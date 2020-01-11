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

    mutableState.players = _.chain(mutableState.players).flatMap((playerObj) => {
      if (playerObj.on.hasOwnProperty("off_poss")) {
        LineupUtils.completeWeightedAvg(playerObj.on);
        if (!playerObj.off.hasOwnProperty("off_poss")) {
          LineupUtils.copyAndZero(playerObj.off, playerObj.on);
        }
      }
      if (playerObj.off.hasOwnProperty("off_poss")) {
        LineupUtils.completeWeightedAvg(playerObj.off);
        if (!playerObj.on.hasOwnProperty("off_poss")) {
          LineupUtils.copyAndZero(playerObj.on, playerObj.off);
        }
      }
      //if on/off doesn't contain anything (use off_poss as proxy)
      // then copy from off but 0 out
      // + vice-versa .. if neither exist then delete player
      if (!playerObj.on.hasOwnProperty("off_poss") &&
        !playerObj.off.hasOwnProperty("off_poss")
      ) {
        return [];
      } else {
        return [ playerObj ];
      }
    }).value();
    return mutableState;
  }

  private static readonly ignoreFieldSet = { key: true, players_array: true, doc_count: true };
  private static readonly sumFieldSet = { off_pos: true, def_pos: true }; //or anything that starts with total_

  /** Combines the per-lineup objects into a mutable aggregator */
  private static weightedAvg(mutableAcc: any, obj: any) {
    _.chain(obj).toPairs().forEach((keyVal) => {
      const key = keyVal[0];
      if (!LineupUtils.ignoreFieldSet.hasOwnProperty(key)) {
        const val = keyVal[1]?.value;
        const off_pos = obj.off_pos?.value || 0; //(these are the weights)
        const def_pos = obj.def_pos?.value || 0;

        if (mutableAcc.hasOwnProperty(key)) {
          if (_.startsWith(key, "total_") || LineupUtils.sumFieldSet.hasOwnProperty(key)) {
            mutableAcc[key].value += val;
          } else if (_.startsWith(key, "off_")) { // weighted field, off
            mutableAcc[key].value += val*off_pos;
          } else if (_.startsWith(key, "def_")) { // weighted field, off
            mutableAcc[key].value += val*def_pos;
          }
        } else {
          mutableAcc[key] = { value: val };
        }
      }
    }).value();
  }
  /** Completes the mutable aggregator by dividing by the sum of its weights*/
  private static completeWeightedAvg(mutableAcc: any) {
    const off_pos = mutableAcc.off_pos?.value || 1; //(these are the weights)
    const def_pos = mutableAcc.def_pos?.value || 1;
    _.chain(mutableAcc).toPairs().forEach((keyVal) => {
      const key = keyVal[0];
      if (!LineupUtils.ignoreFieldSet.hasOwnProperty(key)) {
        const val = keyVal[1]?.value;
        if (_.startsWith(key, "off_")) { // weighted field, off
          mutableAcc[key].value = (1.0*val)/off_pos;
        } else if (_.startsWith(key, "def_")) { // weighted field, off
          mutableAcc[key].value = (1.0*val)/def_pos;
        }
      }
    });
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
