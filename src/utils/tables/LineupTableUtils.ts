// Lodash
import _ from "lodash";

// Util imports
import { StatModels, PlayerCodeId, PlayerCode, PlayerId, Statistic, IndivStatSet, TeamStatSet, LineupStatSet, IndivPosInfo, RosterEntry } from '../StatModels';
import { RatingUtils, OnBallDefenseModel } from "../stats/RatingUtils";
import { PositionUtils } from "../stats/PositionUtils";
import { LineupUtils } from "../stats/LineupUtils";
import { LuckUtils, OffLuckAdjustmentDiags, DefLuckAdjustmentDiags, LuckAdjustmentBaseline } from "../stats/LuckUtils";
import { ParamDefaults } from '../FilterModels';

export type PositionInfo = PlayerCodeId & { numPoss: number };

/** Object marshalling logic for lineup tables */
export class LineupTableUtils {

  /** Key of "total" fake lineuo */
  static readonly totalLineupId = "TOTAL";

  /** Handy accessor for picking the player codes out of the lineup */
  static buildCodesAndIds(lineup: LineupStatSet): Array<PlayerCodeId> {
    return lineup.players_array ?
      (lineup.players_array?.hits?.hits?.[0]?._source?.players || []) :
      _.toPairs((lineup.player_info || {}) as Record<PlayerId, IndivStatSet>).map(kv => { return { code: kv[1].code, id: kv[0] } }) //(leaderboard mode)
      ;
  }

  /** Injects some advanced stats into players, returns an associative array vs player.key */
  static buildBaselinePlayerInfo(
    players: Array<IndivStatSet> | undefined,
    globalRosterStatsByCode: Record<PlayerCode, IndivStatSet>, teamStat: TeamStatSet,
    avgEfficiency: number, adjustForLuck: boolean, luckConfigBase: "baseline" | "season",
    onBallDefenseByCode: Record<PlayerCode, OnBallDefenseModel>  = {}
  ): Record<PlayerId, IndivStatSet> {
    const sampleRosterByCode = _.fromPairs( // Needed for ORtg, also ensure the codes exist
      (players || []).map((mutableP: IndivStatSet) => {
        // Code:
        mutableP.code = (mutableP.player_array?.hits?.hits?.[0]?._source?.player?.code || mutableP.key) as PlayerCode;
        return [ mutableP.code, mutableP];
      })
    );

    const baselinePlayerInfo = _.fromPairs(
      (players || []).map((mutableP: IndivStatSet) => {
        const playerAdjustForLuckOff = adjustForLuck; //(only apply luck to the lineups if we have granular lineup 3PA info, but always apply to priors)
        const playerAdjustForLuckDef = adjustForLuck; //(never apply luck to the lineups, but always apply to priors)

        // Possession %
        mutableP.off_team_poss_pct = { value: _.min([(mutableP.off_team_poss.value || 0)
            / (teamStat.off_poss?.value || 1), 1 ]) };
        mutableP.def_team_poss_pct = { value: _.min([(mutableP.def_team_poss.value || 0)
            / (teamStat.def_poss?.value || 1), 1 ]) };

        if (mutableP?.doc_count) {
          const globalPlayerStats = (luckConfigBase == "season") ? 
            (globalRosterStatsByCode[mutableP.code || "??"] || mutableP) : mutableP;
          // (No offensive luck since our "to adjust" and baseline are the same)
          const offLuckAdj = LuckUtils.calcOffPlayerLuckAdj(
            mutableP, globalPlayerStats, avgEfficiency
          );
          // Calculate luck for defense - over the baseline query, but will regress to opponent SoS
          const defLuckAdj = LuckUtils.calcDefPlayerLuckAdj(
            mutableP, globalPlayerStats, avgEfficiency
          );
          LuckUtils.injectLuck(mutableP, offLuckAdj, defLuckAdj);
        }

        // Add ORtg to lineup stats:
        const [ oRtg, adjORtg, rawORtg, rawAdjORtg, oRtgDiag ] = RatingUtils.buildORtg(
          mutableP, sampleRosterByCode, {
              total_off_to: teamStat.total_off_to || { value: 0 },
              sum_total_off_to: { //(sum of all players TOs, so we can calc team TOVs)
                //(note don't luck adjust these since the team values aren't luck adjusted)
                value: _.sumBy(players, p => p.total_off_to?.value || 0)
              }
          }, avgEfficiency, true, playerAdjustForLuckOff
        );
        const [ dRtg, adjDRtg, rawDRtg, rawAdjDRtg, dRtgDiag ] = RatingUtils.buildDRtg(
          mutableP, avgEfficiency, !_.isEmpty(onBallDefenseByCode), playerAdjustForLuckDef
        );
        mutableP.off_rtg = {
          value: oRtg?.value, old_value: rawORtg?.value,
          override: playerAdjustForLuckOff ? "Luck adjusted" : undefined
        };
        mutableP.off_adj_rtg = {
          value: adjORtg?.value, old_value: rawAdjORtg?.value,
          override: playerAdjustForLuckOff ? "Luck adjusted" : undefined
        };
        mutableP.off_usage = {
          value: !_.isNil(oRtgDiag) ? oRtgDiag.Usage!*0.01 : mutableP.off_usage?.value
        };
        mutableP.def_rtg = {
          value: dRtg?.value, old_value: rawDRtg?.value,
          override: playerAdjustForLuckDef ? "Luck adjusted" : undefined
        };
        mutableP.def_adj_rtg = {
          value: adjDRtg?.value, old_value: rawAdjDRtg?.value,
          override: playerAdjustForLuckDef ? "Luck adjusted" : undefined
        };

        // Apply on-ball defense if it exists for this player
        if (dRtgDiag && onBallDefenseByCode.hasOwnProperty(mutableP.code!)) {
          const onBallDefense = onBallDefenseByCode[mutableP.code!]!;
          const onBallDiags = RatingUtils.buildOnBallDefenseAdjustmentsPhase1(mutableP, dRtgDiag, onBallDefense);
          dRtgDiag.onBallDef = onBallDefense;
          dRtgDiag.onBallDiags = onBallDiags;
        
          mutableP.diag_def_rtg = dRtgDiag;
        }

        // If roster info is available then add:
        const rosterEntry = globalRosterStatsByCode[mutableP.code!].roster;
        if (rosterEntry && !_.isEmpty(rosterEntry)) {
          mutableP.roster = rosterEntry;
        }

        return [ mutableP.key, mutableP ];
      })
    );

    // Finish off on-ball defense if there is any:
    if (!_.isEmpty(onBallDefenseByCode)) {
      RatingUtils.injectOnBallDefenseAdjustmentsPhase2(_.values(baselinePlayerInfo), teamStat);
    }
    return baselinePlayerInfo;
  }

  /** Handy util for sorting JSON blobs of fields */
  static sorter(sortStr: string) { // format: (asc|desc):(off_|def_|diff_)<field>|year
    const sortComps = sortStr.split(":"); //asc/desc
    const dir = (sortComps[0] == "desc") ? -1 : 1;
    const fieldComps = _.split(sortComps[1], "_", 1); //off/def/diff
    const fieldName = (fieldComps[0] != "year")
      ? sortComps[1].substring(fieldComps[0].length + 1) //+1 for _
      : sortComps[1];
    const field = (stat: any) => {
      switch(fieldComps[0]) {
        case "diff": //(off-def)
          return (stat["off_" + fieldName]?.value || 0.0)
                - (stat["def_" + fieldName]?.value || 0.0);
        case "year": //metadata
          return parseInt((stat?.year || ParamDefaults.defaultLeaderboardYear).substring(0, 4));
        default:
          return stat[sortComps[1]]?.value; //(off or def)
      }
    };
    return (stat: any) => {
      return dir*(field(stat) || 0);
    };
  };


  /** Builds positional info vs player key */
  static buildPositionPlayerMap(
    players: IndivStatSet[] | undefined, teamSeasonLookup: string, externalRoster?: Record<PlayerId, RosterEntry>
  ): Record<PlayerId, IndivPosInfo> {
    const positionFromPlayerKey = _.chain(players || []).map((player: IndivStatSet) => {
      const rosterMeta = player.roster || externalRoster?.[player.key];
      const [ posConfs, posConfsDiags ] = PositionUtils.buildPositionConfidences(player, rosterMeta?.height_in);
      const [ pos, posDiags ] = PositionUtils.buildPosition(posConfs, posConfsDiags.confsNoHeight, player, teamSeasonLookup);

      return [ player.key, { 
        posConfidences: _.values(posConfs || {}), 
        posClass: pos,
        roster: rosterMeta ? {
          number: rosterMeta.number,
          height: rosterMeta.height,
          year_class: rosterMeta.year_class,
          pos: rosterMeta.pos,
        } : undefined
      } ];
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
      const teamFilter = lineup.team ? [ { id: `${lineup.team}_${lineup.year}`, code: lineup.team } ] : []; //(leaderboard version)

      const playerFilter = PositionUtils.testPositionalAwareFilter(
        namesToTest.concat(teamFilter), filterFragmentsPve, filterFragmentsNve
      );

     return playerFilter && (lineup.key != ""); // (workaround for #53 pending fix)
    }).sortBy(
       sortBy ? [ LineupTableUtils.sorter(sortBy) ] : [] //(don't sort if sortBy not specified)
    ).take(
      parseInt(maxTableSize)
    ).value();

    return filteredLineups;
  }

  /** Builds a filtered sorted list of lineups */
  static buildEnrichedLineups(
    // Stats inputs:
    filteredLineups: Array<LineupStatSet>, globalTeamStats: TeamStatSet,
    players: Array<IndivStatSet>, baselineTeamStats: TeamStatSet,
    // Table control:
    adjustForLuck: boolean, luckConfigBase: "baseline" | "season", avgEfficiency: number,
    // Derived objects:
    showTotalLineups: boolean, teamSeasonLookup: string,
    positionFromPlayerKey: Record<PlayerId, any>, baselinePlayerInfo: Record<PlayerId, IndivStatSet>
  ): Array<LineupStatSet> {
    // The luck baseline can either be the user-selecteed baseline or the entire season
    const baseLuckBuilder: () => [TeamStatSet, Record<PlayerId, IndivStatSet>] = () => {
      if (adjustForLuck) {
        switch (luckConfigBase) {
          case "baseline":
            return [
              baselineTeamStats, baselinePlayerInfo
            ];
          default: //("season")
            return [
              globalTeamStats, _.fromPairs((players || []).map(p => [ p.key, p ]))
            ];
        }
      } else return [ StatModels.emptyTeam(), {} ]; //(not used)
    };
    const [ baseOrSeasonTeamStats, baseOrSeason3PMap ] = baseLuckBuilder();

    /** Perform enrichment on each lineup, including luck adjustment */
    const enrichLineup = (lineup: LineupStatSet) => {
      const codesAndIds = LineupTableUtils.buildCodesAndIds(lineup);

      const sortedCodesAndIds = (lineup.key == LineupTableUtils.totalLineupId) ? undefined :
        PositionUtils.orderLineup(codesAndIds, positionFromPlayerKey, teamSeasonLookup);

      const perLineupPlayerLuckMap: Record<PlayerId, IndivStatSet> = _.fromPairs(
        codesAndIds.map((cid: PlayerCodeId) => {
          return [  cid.id, baseOrSeason3PMap[cid.id] || StatModels.emptyIndiv()];
        })
      );
      const luckAdj = (
        (lineup.key != LineupTableUtils.totalLineupId) && adjustForLuck && lineup?.doc_count
      ) ? [
        LuckUtils.calcOffTeamLuckAdj(
          lineup, codesAndIds.map(cid => perLineupPlayerLuckMap[cid.id]), baseOrSeasonTeamStats, perLineupPlayerLuckMap, avgEfficiency,
          baselineTeamStats?.total_off_3p_attempts?.value  
            //(ensure that the aggregation of the 3P-luck-adjusted lineups are equal to the 3P-adjusted set)
        ),        
        LuckUtils.calcDefTeamLuckAdj(
          lineup, baseOrSeasonTeamStats, avgEfficiency,
          baselineTeamStats?.total_def_3p_attempts?.value
            //(ensure that the aggregation of the 3P-luck-adjusted lineups are equal to the 3P-adjusted set)
        ),
      ] as [OffLuckAdjustmentDiags, DefLuckAdjustmentDiags] : undefined;

      if (lineup?.doc_count) {
        LineupUtils.buildEfficiencyMargins(lineup); //(just used for display in the lineup table)

        if (lineup.key != LineupTableUtils.totalLineupId) {
          // don't inject luck into the total lineup calcs - a) empirically it's wrong so
          // probably I'm doing something stupid, b) it seems wrong anyway, eg aggregating
          // the per-lineup players is not correct, (for team we have the actual 3PA numbers)
          // but it's better than assuming all players play in their season poss ratios, which
          // is what this appears to do...
          // (https://github.com/Alex-At-Home/cbb-on-off-analyzer/issues/100)
          LuckUtils.injectLuck(lineup, luckAdj?.[0], luckAdj?.[1]);
          lineup.off_luck_diags = luckAdj?.[0];
          lineup.def_luck_diags = luckAdj?.[1];
        }
      }
      return lineup;
    };

    const enrichedLineups = filteredLineups.map(lineup => enrichLineup(lineup));
    const totalLineup = showTotalLineups ? [
      // Have to do this last in order to get the luck-mutated lineups
      // TODO: luck adjusted lineups seemed completely wrong so I pulled it :(, see above
      // (https://github.com/Alex-At-Home/cbb-on-off-analyzer/issues/100)
      enrichLineup(_.assign(LineupUtils.calculateAggregatedLineupStats(filteredLineups), {
        key: LineupTableUtils.totalLineupId,
        doc_count: filteredLineups.length //(for doc_count >0 checks, calculateAggregatedLineupStats doesn't inject)
      }))
    ] : [];

    return totalLineup.concat(enrichedLineups);
  }

  /** Builds the list of where players play based on their lineup */
  static getPositionalInfo(
    lineups: Array<LineupStatSet>,
    positionFromPlayerId: Record<PlayerId, IndivPosInfo>,
    teamSeasonLookup: string
  ): PositionInfo[][] {
    return _.chain(lineups).transform((mutableAcc, lineup) => {
      const codesAndIds = LineupTableUtils.buildCodesAndIds(lineup);
      const sortedCodesAndIds = PositionUtils.orderLineup(codesAndIds, positionFromPlayerId, teamSeasonLookup);
      sortedCodesAndIds.forEach((codeId, i) => {
        mutableAcc[i]!.push({ id: codeId.id, code: codeId.code, numPoss: lineup?.off_poss?.value || 0 })
      });
    }, [
      [] as PositionInfo[], [] as PositionInfo[], [] as PositionInfo[], [] as PositionInfo[], [] as PositionInfo[],
    ]).map(keyPosses => {
      return _.chain(keyPosses).groupBy(keyPoss => keyPoss.id).mapValues((keyPosses, id) => {
        const code = keyPosses?.[0].code;
        return {
          id: id,
          code: code,
          numPoss: _.reduce(keyPosses, (acc, keyPoss) => acc + keyPoss.numPoss, 0)
        };
      }).values().orderBy([ "numPoss" ], [ "desc" ]).value();
    }).value();
  }

}
