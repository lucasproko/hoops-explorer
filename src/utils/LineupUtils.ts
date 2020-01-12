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
        } else { //OFF!
          LineupUtils.weightedAvg(playerObj.off, lineup);
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

  /** Combines the per-lineup objects into a mutable aggregator */
  private static weightedAvg(mutableAcc: any, obj: any) {
    _.chain(obj).toPairs().forEach((keyVal) => {
      const key = keyVal[0];
      if (!_.startsWith(key, "total_") && !LineupUtils.ignoreFieldSet.hasOwnProperty(key)) {
        const val = keyVal[1]?.value || 0;
        const off_poss = obj.off_poss?.value || 0; //(these are the weights)
        const def_poss = obj.def_poss?.value || 0;

        if (!mutableAcc.hasOwnProperty(key)) {
          mutableAcc[key] = { value: 0 };
        }
        if (LineupUtils.sumFieldSet.hasOwnProperty(key)) {
          mutableAcc[key].value += val;
        } else if (_.startsWith(key, "off_")) { // weighted field, off
          mutableAcc[key].value += val*off_poss;
        } else if (_.startsWith(key, "def_")) { // weighted field, off
          mutableAcc[key].value += val*def_poss;
        }
      }
    }).value();
  }
  /** Completes the mutable aggregator by dividing by the sum of its weights*/
  private static completeWeightedAvg(mutableAcc: any) {
    const off_poss = mutableAcc.off_poss?.value || 1; //(these are the weights)
    const def_poss = mutableAcc.def_poss?.value || 1;
    _.chain(mutableAcc).toPairs().forEach((keyVal) => {
      const key = keyVal[0];
      if (!LineupUtils.ignoreFieldSet.hasOwnProperty(key)) {
        const val = keyVal[1]?.value;
        if (LineupUtils.sumFieldSet.hasOwnProperty(key)) {
          //(nothing to do)
        } else if (_.startsWith(key, "off_")) { // weighted field, off
          mutableAcc[key].value = (1.0*val)/off_poss;
        } else if (_.startsWith(key, "def_")) { // weighted field, off
          mutableAcc[key].value = (1.0*val)/def_poss;
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
