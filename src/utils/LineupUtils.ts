// Lodash
import _ from "lodash";

import { TeamReportStatsModel } from "../components/TeamReportStatsTable";
import { LineupStatsModel } from "../components/LineupStatsTable";

/** Wraps the local storage based cache of recent requests */
export class LineupUtils {

  /** Builds on/off info out of lineups */
  static lineupToTeamReport(lineupReport: LineupStatsModel): TeamReportStatsModel {
    const allPlayersSet = _.chain(lineupReport.lineups || []).reduce((acc: any, lineup: any) => {
      const players = lineup?.players_array?.hits?.hits?.[0]?._source?.players || [];
      return _.mergeWith(
        acc, _.chain(players).map((v) => [ v.id, v.code ]).fromPairs().value()
      );
    }, {}).value();

    const mutableState: TeamReportStatsModel = {
      players: _.keys(allPlayersSet).map((playerId) => {
        return {
          playerId: playerId,
          teammates: _.chain(allPlayersSet).keys().map(
              (player) => [ player, {
                on: { off_poss: 0, def_poss: 0 }, off: { off_poss : 0, def_poss: 0 }
              } ]
            ).fromPairs().value(),
          on: {
            key: `'ON' ${playerId}`
          },
          off: {
            key: `'OFF' ${playerId}`
          }
        };
      }),
      avgOff: lineupReport.avgOff,
      error_code: lineupReport.error_code
    };

    _.chain(lineupReport.lineups || []).transform((acc, lineup) => {
      const playersSet = _.chain(
        lineup?.players_array?.hits?.hits?.[0]?._source?.players || []
      ).map((v) => [ v.id, v.code ]).fromPairs().value();

      _.chain(acc.players).forEach((playerObj) => {
        if (playersSet.hasOwnProperty(playerObj.playerId)) { //ON!
          LineupUtils.weightedAvg(playerObj.on, lineup);
          // Lineup composition:
          _.chain(playersSet).keys().forEach((player) =>
            LineupUtils.updateLineupComposition(playerObj.teammates[player]?.on, player, lineup)
          ).value();
        } else { //OFF!
          LineupUtils.weightedAvg(playerObj.off, lineup);
          // Lineup composition:
          _.chain(playersSet).keys().forEach((player) =>
            LineupUtils.updateLineupComposition(playerObj.teammates[player]?.off, player, lineup)
          ).value();
        }
      }).value();
    }, mutableState).value();

    // Finish off the weighted averages:

    mutableState.players = _.chain(mutableState.players).map((playerObj) => {
      if (playerObj.on.hasOwnProperty("off_poss")) {
        LineupUtils.completeWeightedAvg(playerObj.on);
        if (!playerObj.off.hasOwnProperty("off_poss")) {
          LineupUtils.copyAndZero(playerObj.off, playerObj.on);
        }
      }
      if (playerObj.off.hasOwnProperty("off_poss")) {
        LineupUtils.completeWeightedAvg(playerObj.off);
      }
      return playerObj; // ('ON' exists by construction)
    }).value();
    return mutableState;
  }

  private static readonly ignoreFieldSet =  //or anything that starts with total_
    { key: true, players_array: true, doc_count: true, points_scored: true, points_allowed: true };
  private static readonly sumFieldSet = { off_poss: true, def_poss: true };

  /** Updates lineup info */
  private static updateLineupComposition(mutableTeammateInfo: any, player: string, lineupInfo: any) {
    if (mutableTeammateInfo) {
      mutableTeammateInfo.off_poss += lineupInfo.off_poss?.value || 0;
      mutableTeammateInfo.def_poss += lineupInfo.def_poss?.value || 0;
    }
  }

  /** Get the weights as a function of the key type (except for shot types) */
  private static getSimpleWeights(obj: any, defaultVal: number) {
    // ppp, adj_opp (opposite)
    const ppp_totals = {
      off_ppp: obj.off_poss?.value || defaultVal,
      def_ppp: obj.def_poss?.value || defaultVal,
      off_to: obj.off_poss?.value || defaultVal,
      def_to: obj.def_poss?.value || defaultVal,
      off_adj_opp: obj.def_poss?.value || defaultVal,
      def_adj_opp: obj.off_poss?.value || defaultVal,
    };
    // all the shot type %s (not rates, which use FGA):
    // (see totalShotTypeKey below)
    // ORBs
    const orb_totals = {
      off_orb: (obj.total_off_orb?.value || defaultVal) + (obj.total_def_drb?.value || defaultVal),
      def_orb: (obj.total_def_orb?.value || defaultVal) + (obj.total_off_drb?.value || defaultVal)
    };
    // everything else
    const fga_totals = {
      off: obj.total_off_fga?.value || defaultVal,
      def: obj.total_def_fga?.value || defaultVal
    };
    return {
      ppp_totals: ppp_totals,
      orb_totals: orb_totals,
      fga_totals: fga_totals
    };
  }

  /** For all the various shot type %s, get the corresponding total to use as a weight */
  private static getShotTypeField(key: string): string | undefined {
    const matchInfo = /^(off|def)_([23][a-z]*[^r]+)$/.exec(key); //ie % only, not rates
    return matchInfo ? `total_${matchInfo[1]}_${matchInfo[2]}_attempts` : undefined;
  }

  /** Combines the per-lineup objects into a mutable aggregator */
  private static weightedAvg(mutableAcc: any, obj: any) {
    const weights = LineupUtils.getSimpleWeights(obj, 0);
    _.chain(obj).toPairs().forEach((keyVal) => {
      const key = keyVal[0];
      if (!LineupUtils.ignoreFieldSet.hasOwnProperty(key)) {
        const val = keyVal[1]?.value || 0;
        // all the shot type stats:
        const totalShotTypeKey: string | undefined = LineupUtils.getShotTypeField(key);

        if (!mutableAcc.hasOwnProperty(key)) { //(init if necessary)
          mutableAcc[key] = { value: 0 };
        }
        if (totalShotTypeKey) {
          mutableAcc[key].value += val*obj[totalShotTypeKey]?.value || 0;
        } else if (weights.ppp_totals.hasOwnProperty(key)) {
          mutableAcc[key].value += val*(weights.ppp_totals as any)[key];
        } else if (weights.orb_totals.hasOwnProperty(key)) {
          mutableAcc[key].value += val*(weights.orb_totals as any)[key];
        } else if (_.startsWith(key, "total_") || LineupUtils.sumFieldSet.hasOwnProperty(key)) {
          mutableAcc[key].value += val;
        } else if (_.startsWith(key, "off_")) { // everything else if off/def FGA
          mutableAcc[key].value += val*weights.fga_totals.off;
        } else if (_.startsWith(key, "def_")) {
          mutableAcc[key].value += val*weights.fga_totals.def;
        }
      }
    }).value();
  }
  /** Completes the mutable aggregator by dividing by the sum of its weights*/
  private static completeWeightedAvg(mutableAcc: any) {
    const weights = LineupUtils.getSimpleWeights(mutableAcc, 1);
    _.chain(mutableAcc).toPairs().forEach((keyVal) => {
      const key = keyVal[0];
      // all the shot type stats:
      const totalShotTypeKey: string | undefined = LineupUtils.getShotTypeField(key);

      if (!LineupUtils.ignoreFieldSet.hasOwnProperty(key)) {
        const val = keyVal[1]?.value || 0;

        if (totalShotTypeKey) {
          mutableAcc[key].value = 1.0*val/(mutableAcc[totalShotTypeKey]?.value || 1);
        } else if (weights.ppp_totals.hasOwnProperty(key)) {
          mutableAcc[key].value = 1.0*val/(weights.ppp_totals as any)[key];
        } else if (weights.orb_totals.hasOwnProperty(key)) {
          mutableAcc[key].value = 1.0*val/(weights.orb_totals as any)[key];
        } else if (_.startsWith(key, "total_") || LineupUtils.sumFieldSet.hasOwnProperty(key)) {
          //(nothing to do)
        } else if (key == "off_ftr") { // FTR are special case because you can have
          mutableAcc[key].value = 1.0*(mutableAcc.total_off_fta?.value || 0.0)/weights.fga_totals.off;
        } else if (key == "def_ftr") {
          mutableAcc[key].value = 1.0*(mutableAcc.total_def_fta?.value || 0.0)/weights.fga_totals.def;
        } else if (_.startsWith(key, "off_")) { // everything else if off/def FGA
          mutableAcc[key].value = 1.0*val/weights.fga_totals.off;
        } else if (_.startsWith(key, "def_")) {
          mutableAcc[key].value = 1.0*val/weights.fga_totals.def;
        }
      }
    }).value();
  }

  /** Builds an empty object (all fields 0) */
  private static copyAndZero(mutableToZero: any, from: any) {
    _.chain(from).keys().forEach((key) => {
      if (!LineupUtils.ignoreFieldSet.hasOwnProperty(key)) {
        mutableToZero[key] = { value: 0 }
      }
    }).value();
  }
};
