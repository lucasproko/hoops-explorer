// Lodash
import _ from "lodash";

// Util imports
import { RatingUtils } from "../stats/RatingUtils";
import { PositionUtils } from "../stats/PositionUtils";
import { LuckUtils, OffLuckAdjustmentDiags, DefLuckAdjustmentDiags, LuckAdjustmentBaseline } from "../stats/LuckUtils";

/** Object marshalling logic for lineup tables */
export class LineupTableUtils {

  /** Key of "total" fake lineuo */
  static readonly totalLineupId = "TOTAL";

  /** Handy accessor for picking the player codes out of the lineup */
  static buildCodesAndIds(lineup: any) {
    return lineup.players_array ?
      (lineup.players_array?.hits?.hits?.[0]?._source?.players || []) :
      _.toPairs(lineup.player_info as Record<string, any>).map(kv => { return { code: kv[1].code, id: kv[0] } }) //(leaderboard mode)
      ;
  }

  /** Injects some advanced stats into players, returns an associative array vs player.key */
  static buildBaselinePlayerInfo(
    players: any[] | undefined, avgEfficiency: number
  ) {
    const baselinePlayerInfo = _.fromPairs(
      (players || []).map((mutableP: any) => {
        // Add ORtg to lineup stats:
        const playerAdjustForLuck = false; //TODO: longer term I think we will want to do this
        const [ oRtg, adjORtg, rawORtg, rawAdjORtg, oRtgDiag ] = RatingUtils.buildORtg(
          mutableP, avgEfficiency, false, playerAdjustForLuck
        );
        const [ dRtg, adjDRtg, rawDRtg, rawAdjDRtg, dRtgDiag ] = RatingUtils.buildDRtg(
          mutableP, avgEfficiency, false, playerAdjustForLuck
        );
        mutableP.off_rtg = {
          value: oRtg?.value, old_value: rawORtg?.value,
          override: playerAdjustForLuck ? "Luck adjusted" : undefined
        };
        mutableP.off_adj_rtg = {
          value: adjORtg?.value, old_value: rawAdjORtg?.value,
          override: playerAdjustForLuck ? "Luck adjusted" : undefined
        };
        mutableP.def_rtg = {
          value: dRtg?.value, old_value: rawDRtg?.value,
          override: playerAdjustForLuck ? "Luck adjusted" : undefined
        };
        mutableP.def_adj_rtg = {
          value: adjDRtg?.value, old_value: rawAdjDRtg?.value,
          override: playerAdjustForLuck ? "Luck adjusted" : undefined
        };
        return [ mutableP.key, mutableP ];
      })
    );
    return baselinePlayerInfo;
  }

  /** Builds positional info vs player key */
  static buildPositionPlayerMap(
    players: any[] | undefined, teamSeasonLookup: string
  ) {
    const positionFromPlayerKey = _.chain(players || []).map((player: any) => {
      const [ posConfs, posConfsDiags ] = PositionUtils.buildPositionConfidences(player);
      const [ pos, posDiags ] = PositionUtils.buildPosition(posConfs, player, teamSeasonLookup);
      return [ player.key, { posConfidences: _.values(posConfs || {}), posClass: pos } ];
    }).fromPairs().value();

    return positionFromPlayerKey;
  }

  /** Builds a filtered sorted list of lineups */
  static buildFilteredLineups(
    lineups: any[],
    filterStr: string, sortBy: string | undefined, minPoss: string, maxTableSize: string,
    teamSeasonLookup: string | undefined, positionFromPlayerKey: Record<string, any> | undefined,
  ) {
    const [
      filterFragmentsPve, filterFragmentsNve, filterOnPosition
    ] = PositionUtils.buildPositionalAwareFilter(filterStr);

    const sorter = (sortStr: string) => { // format: (asc|desc):(off_|def_|diff_)<field>
      const sortComps = sortStr.split(":"); //asc/desc
      const dir = (sortComps[0] == "desc") ? -1 : 1;
      const fieldComps = _.split(sortComps[1], "_", 1); //off/def/diff
      const fieldName = sortComps[1].substring(fieldComps[0].length + 1); //+1 for _
      const field = (lineup: any) => {
        switch(fieldComps[0]) {
          case "diff": //(off-def)
            return (lineup["off_" + fieldName]?.value || 0.0)
                  - (lineup["def_" + fieldName]?.value || 0.0);
          default: return lineup[sortComps[1]]?.value; //(off or def)
        }
      };
      return (lineup: any) => {
        return dir*(field(lineup) || 0);
      };
    };

    const filteredLineups = _.chain(lineups).filter((lineup) => {
      const minPossInt = parseInt(minPoss);
      const offPos = lineup.off_poss?.value || 0;
      const defPos = lineup.def_poss?.value || 0;
      return offPos >= minPossInt || defPos >= minPossInt; //(unclear which of || vs && is best...)
    }).filter((lineup) => {

      const codesAndIds = LineupTableUtils.buildCodesAndIds(lineup);

      const lineupPosFromPlayerKey = positionFromPlayerKey || lineup.player_info; //(leaderboard version, calc from lineup)
      const lineupTeamSeason = teamSeasonLookup ||
        `${lineup.gender}_${lineup.team}_${lineup.year}`; //(leaderboard version, calc from lineup)

      const namesToTest = filterOnPosition ?
        PositionUtils.orderLineup(codesAndIds, lineupPosFromPlayerKey, lineupTeamSeason) : codesAndIds;
      const teamFilter = lineup.team ? [ { id: lineup.team, code: lineup.team } ] : []; //(leaderboard version)

      const playerFilter = PositionUtils.testPositionalAwareFilter(
        namesToTest.concat(teamFilter), filterFragmentsPve, filterFragmentsNve
      );

     return playerFilter && (lineup.key != ""); // (workaround for #53 pending fix)
    }).sortBy(
       sortBy ? [ sorter(sortBy) ] : [] //(don't sort if sortBy not specified)
    ).take(
      parseInt(maxTableSize)
    ).value();

    return filteredLineups;
  }

  /** Builds a filtered sorted list of lineups */
  static buildEnrichedLineups(
    // Stats inputs:
    filteredLineups: any[], globalTeamStats: Record<string, any>,
    players: any[] | undefined, baselineTeamStats: Record<string, any>,
    // Table control:
    adjustForLuck: boolean, luckConfigBase: "baseline" | "season", avgEfficiency: number,
    // Derived objects:
    initialLineups: any[], teamSeasonLookup: string,
    positionFromPlayerKey: Record<string, any>, baselinePlayerInfo: Record<string, any>
  ) {
    // The luck baseline can either be the user-selecteed baseline or the entire season
    const [ baseOrSeasonTeamStats, baseOrSeason3PMap ] = (() => {
      if (adjustForLuck) {
        switch (luckConfigBase) {
          case "baseline":
            return [
              baselineTeamStats, baselinePlayerInfo
            ];
          default: //("season")
            return [
              globalTeamStats, _.fromPairs((players || []).map((p: any) => [ p.key, p ]))
            ];
        }
      } else return [ {}, {} ]; //(not used)
    })();

    const enrichedLineups = initialLineups.concat(filteredLineups).map(lineup => {
      const codesAndIds = LineupTableUtils.buildCodesAndIds(lineup);

      const sortedCodesAndIds = (lineup.key == LineupTableUtils.totalLineupId) ? undefined :
        PositionUtils.orderLineup(codesAndIds, positionFromPlayerKey, teamSeasonLookup);

      const perLineupPlayerLuckMap = _.fromPairs(codesAndIds.map((cid: { code: string, id: string }) => {
        return [  cid.id, baseOrSeason3PMap[cid.id] ];
      }));
      const luckAdj = (adjustForLuck && lineup?.doc_count) ? [
        LuckUtils.calcOffTeamLuckAdj(
          lineup, players || [], baseOrSeasonTeamStats, perLineupPlayerLuckMap, avgEfficiency
        ),
        LuckUtils.calcDefTeamLuckAdj(lineup, baseOrSeasonTeamStats, avgEfficiency),
      ] as [OffLuckAdjustmentDiags, DefLuckAdjustmentDiags] : undefined;

      if (lineup?.doc_count) {
        LuckUtils.injectLuck(lineup, luckAdj?.[0], luckAdj?.[1]);
        lineup.off_luck_diags = luckAdj?.[0];
        lineup.def_luck_diags = luckAdj?.[1];
      }
      return lineup;
    });
    return enrichedLineups;
  }
}
