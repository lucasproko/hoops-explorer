
// Utils:
import _ from 'lodash'

export type PosFamily = "ballhandler" | "wing" | "big";
export const PosFamilyNames: PosFamily[] = [ "ballhandler", "wing", "big" ];

/** Data for a given player broken down */
export type PlayerStyleInfo = {
  unassisted: Record<string, any>,
  assisted: Record<string, any>,
  scramble: Record<string, any>,
  transition: Record<string, any>,
  totalScoringPlaysMade: number,
  totalAssists: number
};

const targetSource = [ "source", "target" ];
const shotTypes = [ "3p", "mid", "rim" ];
const shotNameMap = { "3p": "3P", "mid": "Mid", "rim": "Rim" } as Record<string, string>;
const shotMap = { "3p": "3p", "rim": "2prim", "mid": "2pmid" } as Record<string, string>;

/** Utilities for guessing different play types based on box scorer info */
export class PlayTypeUtils {

  /** Gives % of ball-handler /  wing / big vs position name */
  private static posToFamilyScore = {
    "PG": [ 1.0, 0, 0],
    "s-PG": [ 1.0, 0, 0],
    "CG": [ 0.8, 0.2, 0 ],
    "WG": [ 0, 1.0, 0 ],
    "WF": [ 0, 1.0, 0 ],
    "S-PF": [ 0, 0.5, 0.5 ],
    "C": [ 0, 0, 1.0 ],
    "G?": [ 0.75, 0.25, 0 ],
    "F/C?": [ 0, 0.25, 0.75 ]
  } as Record<string, [ number, number, number ]>;
  private static posClassToFamilyScore = [
    [ 1.00, 0.66, 0.15, 0.00, 0.00 ], // ballhandler
    [ 0.00, 0.34, 0.85, 0.66, 0.00 ], // wing
    [ 0.00, 0.00, 0.00, 0.34, 1.00 ], // big
  ];

  /** Goes from all 5 position classes to a smaller/simple position family */
  static buildPosFamily(pos: string, posClass: number[]): [ number, number, number ] {
    return PlayTypeUtils.posToFamilyScore[pos] || [ 0, 1.0, 0 ];
    //TODO: this uses the raw numbers, which empiricially didn't work particularly well
    // eg for centers it tended to
    // return PlayTypeUtils.posClassToFamilyScore.map((scores: number[]) => {
    //   return _.sumBy(_.zip(scores, posClass), xy => xy[0]!*xy[1]!);
    // });
  }


  /** Decomposes a player stats into unassisted/assisted and half-court/scramble/transition */
  static buildPlayerStyle(player: Record<string, any>): PlayerStyleInfo {

    // Some types and globals

    const ftaMult = 0.475;
    const totalAssists = player[`total_off_assist`]?.value || 0;
    const totalShotsMade = player[`total_off_fgm`]?.value || 0;
    const totalFtTripsMade = ftaMult*(player[`total_off_fta`]?.value || 0);
    const totalScoringPlaysMade = (totalShotsMade + totalFtTripsMade + totalAssists) || 1;

    /** (util method, see below) */
    const buildTotal = (prefix: string) => { return _.fromPairs(shotTypes.map((key) => {
      const total = player[`total_off_${prefix}_${shotMap[key]!}_made`]?.value || 0;
      const assisted = player[`total_off_${prefix}_${shotMap[key]!}_ast`]?.value || 0;
      const unassisted = total - assisted;
      return [ key, [ total, assisted, unassisted ] ];
    })) as Record<string, number[]>; };

    /** (util method, see below) */
    const buildRow = (totalInfo: Record<string, number[]>, ftInfo: number) => {
      return _.toPairs(totalInfo).map(kv => {
        const key = kv[0];
        const total = kv[1][0]!;
        return [ `source_${key}_ast`, total > 0 ? {
          value: total/totalScoringPlaysMade
        } : null ]
      }).concat([
        [ `source_sf`, ftInfo > 0 ? { value: ftInfo/totalScoringPlaysMade } : null ]
      ]);
    }

    // Scramble and transitiob

    const scrambleTotal = buildTotal("scramble");
    const scrambleFtTrips = ftaMult*(player[`total_off_scramble_fta`]?.value || 0);
    const scrambleRow = buildRow(scrambleTotal, scrambleFtTrips);

    const transitionTotal = buildTotal("trans");
    const transitionFtTrips = ftaMult*(player[`total_off_trans_fta`]?.value || 0);
    const transitionRow = buildRow(transitionTotal, transitionFtTrips);

    // Half court:

    const totalFtTripsMadeHalfCourt = totalFtTripsMade - transitionFtTrips - scrambleFtTrips;

//    const unassistedHalfCourtRow = shotTypes.map((key) => {
    const unassistedRow = shotTypes.map((key) => {
      const shots = player[`total_off_${shotMap[key]!}_made`]?.value || 0; //(half court/transition/scramble)
      const assisted = player[`total_off_${shotMap[key]!}_ast`]?.value || 0; //(half court/transition/scramble)
      const unassisted = (shots - assisted);
      const unassistedHalfCourt =  unassisted - scrambleTotal[key]![2]! - transitionTotal[key]![2]!;

      return [ `source_${key}_ast`, unassisted > 0 ? {
        value: unassisted/totalScoringPlaysMade
      } : null ];
    }).concat([
      [ `source_sf`, totalFtTripsMadeHalfCourt > 0 ? { value: totalFtTripsMadeHalfCourt/totalScoringPlaysMade } : null ]
    ]);

    const assistTotalsRow = shotTypes.map((key) => {
      const assisted = player[`total_off_${shotMap[key]!}_ast`]?.value || 0;
      const assistedHalfCourt = assisted - scrambleTotal[key]![1]! - transitionTotal[key]![1]!;
      return [ `source_${key}_ast`, assisted > 0 ? {
        value: assisted/totalScoringPlaysMade
      } : null];
    }).concat([
      [ `target_ast`, totalAssists > 0 ? {
        value: totalAssists/totalScoringPlaysMade
      } : null ]
    ]);

    return {
      unassisted: _.fromPairs(unassistedRow),
      assisted: _.fromPairs(assistTotalsRow),
      scramble: _.fromPairs(scrambleRow),
      transition: _.fromPairs(transitionRow),
      totalScoringPlaysMade: totalScoringPlaysMade,
      totalAssists: totalAssists
    };
  }

  /** Takes a player or category (ball-handler / wing / frontcourt) and builds their assist network
   *  (note that the interaction between this logic and the calling code in XxxPlayTypeDiagView is currently a bit tangled)
   */
  static buildPlayerOrPosAssistNetwork(
    playerOrPos: string, mainPlayer: Record<string, any>,
    totalScoringPlaysMade: number, totalAssists: number,
    rosterStatsByCode: Record<string, any>
  ): [ Record<string, any>, number ] {
    const p = playerOrPos;
    var mutableTotal = 0;
    const info = (_.fromPairs([ "target", "source" ].flatMap((loc) => {
      const targetNotSource = loc == "target";
      var mutableAssistsAcrossShotTypes = 0;
      return [ "3p", "mid", "rim" ].flatMap((key) => {
        const assists = mainPlayer[`off_ast_${key}_${loc}`]?.value?.[p] || 0;
        mutableAssistsAcrossShotTypes += targetNotSource ? assists : 0;
        mutableTotal += assists;
        const denominator = targetNotSource ? (totalAssists || 1) : totalScoringPlaysMade;
        const eFG = (key == "3p" ? 1.5 : 1) * rosterStatsByCode[p]?.[`off_${shotMap[key]!}`]?.value || 0;

        return assists > 0 ? [
          [`${loc}_${key}_ast`, { value: assists/(denominator || 1) }],
          [`${loc}_${key}_efg`, { value: eFG } ]
        ] : [];
      }).concat( (targetNotSource && (mutableAssistsAcrossShotTypes > 0)) ?
        [ [ `target_ast`, { value: mutableAssistsAcrossShotTypes / totalScoringPlaysMade } ] ]: []
      );
    })));
    return [ info, mutableTotal ];
  }

  /** Adds example plays to the "extraInfo" of unassited stats */
  static enrichUnassistedStats(unassistedStats: Record<string, any>, mainPlayer: Record<string, any>) {
    // Build main player's positional category:
    const mainPlayerCats = _.orderBy(PlayTypeUtils.buildPosFamily(mainPlayer.role, mainPlayer.posClass).flatMap((catScore, ix) => {
      return catScore > 0 ? [ { order: ix, score: catScore } ] : [];
    }), ["score"], ["desc"]);

    // handle usages, (AST)
    shotTypes.concat(["sf"]).forEach((shotType, ix) => {

      const statKey = shotType == "sf" ? `source_sf` : `source_${shotType}_ast`;

      // Inject examples
      const playTypeExamples = _.chain(mainPlayerCats).map(catInfo => {
        const exampleKey = `${PosFamilyNames[catInfo.order!]}_${shotType}`;

        return PlayTypeUtils.playTypesByFamily[exampleKey]?.examples || [];
      }).flatten().uniq().value();

      if (unassistedStats[statKey]) {
        unassistedStats[statKey].extraInfo = playTypeExamples;
      }
    });
    return unassistedStats; //(for chaining)
  }

  /** Converts a player-grouped assist network into a positional category grouped one
   *  (note that the interaction between this logic and the calling code in XxxPlayTypeDiagView is currently a bit tangled)
   */
  static buildPosCategoryAssistNetwork(
    playerAssistNetwork: Array<Record<string, any>>,
    rosterStatsByCode: Record<string, any>,
    mainPlayer: Record<string, any>
  ) {
    // Build main player's positional category:
    const mainPlayerCats = _.orderBy(PlayTypeUtils.buildPosFamily(mainPlayer.role, mainPlayer.posClass).flatMap((catScore, ix) => {
      return catScore > 0 ? [ { order: ix, score: catScore } ] : [];
    }), ["score"], ["desc"]);

    return _.chain(playerAssistNetwork).flatMap(playerStats => {
      const playerCode = playerStats.code!;
      const role = rosterStatsByCode[playerCode]?.role || "??";
      const posClass = rosterStatsByCode[playerCode]?.posClass || [];
      return PlayTypeUtils.buildPosFamily(role, posClass).flatMap((catScore, ix) => {
        return catScore > 0 ? [ { ...playerStats, title: null, order: ix, score: catScore } ] : [];
      }) as Array<any>;
    }).concat([
      { order: 0, score: 0 }, { order: 1, score: 0 }, { order: 2, score: 0 }
    ]).groupBy(info => info.order).values().map(infos => {
      const mutableObj = {
        order: infos[0]!.order
      } as Record<string, any>;

      // Score inv vs shot type:
      const scoreTotalInvsTarget = shotTypes.map(shotType => {
        return 1.0 /
          (_.reduce(infos, (acc, statSet) =>
            acc + statSet.score*(statSet[`target_${shotType}_ast`]?.value || 0), 0
          ) || 1);
      });
      // Aggregate the different stats across the different player weights vs the category
      _.transform(infos, (acc, statSet) => {
        const maybeFill = (key: string, examples?: Array<Array<string>>) => {
          if (!acc[key]) {
            acc[key] = { value: 0, extraInfo: examples };
          }
        }

        // Handle misc sums:
        [ "target_ast", "source_sf" ].forEach(statKey => {
          const statVal = statSet[statKey];
          if (statVal?.value) { // (do nothing on 0)
            maybeFill(statKey);
            acc[statKey].value! += statSet.score! * statVal.value;
          }
        });
        // handle usages, (AST)
        targetSource.forEach(loc => {
          shotTypes.forEach((shotType, ix) => {

            // Inject examples
            const playTypeExamples = _.chain(mainPlayerCats).map(catInfo => {
              const exampleKey = (loc == "source") ?
                `${PosFamilyNames[catInfo.order!]}_${shotType}_${PosFamilyNames[statSet.order!]}` :
                `${PosFamilyNames[statSet.order!]}_${shotType}_${PosFamilyNames[catInfo.order!]}`;

              return PlayTypeUtils.playTypesByFamily[exampleKey]?.examples || [];
            }).flatten().uniq().value();

            const statKey = `${loc}_${shotType}_ast`;
            const statVal = statSet[statKey];
            if (statVal?.value) { // (do nothing on 0)
              maybeFill(statKey, playTypeExamples);
              acc[statKey].value! += statSet.score! * statVal.value;
            }
          });
        });
        // Handle weighted averages (eFG)
        shotTypes.forEach((shotType, ix) => {
          const statKey = `target_${shotType}_efg`;
          const statVal = statSet[statKey];
          if (statVal?.value) { // (do nothing on 0)
            maybeFill(statKey);
            const weight = (statSet[`target_${shotType}_ast`]?.value || 0) * scoreTotalInvsTarget[ix]!
            acc[statKey].value! += statSet.score! * statVal.value * weight;
          }
        });
      }, mutableObj);

      return mutableObj;
    }).orderBy(["order"], ["asc"]).value();
  }

  /** PlayerFamily_ShotType_([source|target]_AssisterFamily)? */
  private static playTypesByFamily = {
    // 1] Ball handler:

    // 1.0] SF
    "ballhandler_sf": {
      source: "Shooting Foul",
      examples: [ "fouled driving to the rim", "fouled in the bonus", "fouled cutting" ]
    },

    // 1.1] 3P

    "ballhandler_3p": {
      source: "3P Unassisted",
      examples: [ "off ball-screen", "ISO", "dribble jumper off misc action" ]
    },
    "ballhandler_3p_ballhandler": {
      source: "3P Assisted by a ballhandler",
      target: "Pass to ballhandler for 3P",
      examples: [ "drive-and-kick", "hockey assist after defense collapses inside", "misc action" ]
    },
    "ballhandler_3p_wing": {
      source: "3P Assisted by a wing",
      target: "Pass to ballhandler for 3P",
      examples: [ "slash-and-kick", "hockey assist after defense collapses inside", "misc action" ]
    },
    "ballhandler_3p_big": {
      source: "3P Assisted by frontcourt",
      target: "Pass to ballhandler for 3P",
      examples: [ "kick-out after an ORB", "pass out of a post-up" ]
    },

    // 1.2] mid

    "ballhandler_mid": {
      source: "Mid Range Unassisted",
      examples: [ "drive and pull-up off ball-screen or ISO", "misc action" ]
    },
    "ballhandler_mid_ballhandler": {
      source: "Mid Range Assisted by ballhandler",
      target: "Pass to ballhandler for mid-range",
      examples: [ "spread offense", "misc action" ]
    },
    "ballhandler_mid_wing": {
      source: "Mid Range Assisted by wing",
      target: "Pass to ballhandler for mid-range",
      examples: [ "spread offense", "misc action" ]
    },
    "ballhandler_mid_big": {
      source: "Mid Range Assisted from frontcourt",
      target: "Pass to ballhandler for mid-range",
      examples: [ "(usually sub-optimal) pass out of a post-up" ]
    },

    // 1.3] rim

    "ballhandler_rim": {
      source: "Drive Unassisted",
      examples: [ "attacks the rim off pick-and-roll", "ISO" ]
    },
    "ballhandler_rim_ballhandler": {
      source: "Layup Assisted by ballhandler",
      target: "Pass to ballhandler for a layup",
      examples: [ "cut" ]
    },
    "ballhandler_rim_wing": {
      source: "Layup Assisted by wing",
      target: "Pass to ballhandler for a layup",
      examples: [ "cut" ]
    },
    "ballhandler_rim_big": {
      source: "Layup Assisted by frontcourt",
      target: "Pass to ballhandler for a layup",
      examples: [ "cut" ]
    },

    // 2] Wing:

    // 2.0] SF
    "wing_sf": {
      source: "Shooting Foul",
      examples: [ "fouled slashing to the rim", "fouled in the bonus", "fouled cutting" ]
    },

    // 2.1] 3P

    "wing_3p": {
      source: "3P Unassisted",
      examples: [ "off ball-screen", "ISO", "dribble jumper off misc action" ]
    },
    "wing_3p_ballhandler": {
      source: "3P Assisted by a ballhandler",
      target: "Pass to wing for 3P",
      examples: [ "drive-and-kick", "hockey assist after defense collapses inside", "misc action" ]
    },
    "wing_3p_wing": {
      source: "3P Assisted by a wing",
      target: "Pass to wing for 3P",
      examples: [ "slash-and-kick", "hockey assist after defense collapses inside", "misc action" ]
    },
    "wing_3p_big": {
      source: "3P Assisted by frontcourt",
      target: "Pass to wing for 3P",
      examples: [ "kick-out after an ORB", "pass out of a post-up" ]
    },

    // 2.2] mid

    "wing_mid": {
      source: "Mid Range Unassisted",
      examples: [ "drive and pull-up off ball-screen or ISO", "misc action" ]
    },
    "wing_mid_ballhandler": {
      source: "Mid Range Assisted by ballhandler",
      target: "Pass to wing for mid-range",
      examples: [ "spread offense", "misc action", "zone buster" ]
    },
    "wing_mid_wing": {
      source: "Mid Range Assisted by wing",
      target: "Pass to wing for mid-range",
      examples: [ "spread offense, misc action", "zone buster" ]
    },
    "wing_mid_big": {
      source: "Mid Range Assisted from frontcourt",
      target: "Pass to wing for mid-range",
      examples: [ "(usually sub-optimal) pass out of a post-up" ]
    },

    // 2.3] rim

    "wing_rim": {
      source: "Drive Unassisted",
      examples: [ "attacks the rim off pick-and-roll", "ISO" ]
    },
    "wing_rim_ballhandler": {
      source: "Layup Assisted by ballhandler",
      target: "Pass to wing for a layup",
      examples: [ "cut" ]
    },
    "wing_rim_wing": {
      source: "Layup Assisted by wing",
      target: "Pass to wing for a layup",
      examples: [ "cut" ]
    },
    "wing_rim_big": {
      source: "Layup Assisted by frontcourt",
      target: "Pass to wing for a layup",
      examples: [ "cut" ]
    },

    // 3] Frontcourt:

    // 2.0] SF
    "big_sf": {
      source: "Shooting Foul",
      examples: [ "fouled on a rebound", "fouled posting up", "fouled rolling", "fouled in the bonus", "fouled cutting" ]
    },

    // 3.1] 3P

    "big_3p": {
      source: "3P Unassisted",
      examples: [ "off ball-screen", "ISO", "dribble jumper off misc action" ]
    },
    "big_3p_ballhandler": {
      source: "3P Assisted by a ballhandler",
      target: "Pass to frontcourt for 3P",
      examples: [ "pick-and-pop", "misc action" ]
    },
    "big_3p_wing": {
      source: "3P Assisted by a wing",
      target: "Pass to frontcourt for 3P",
      examples: [ "pick-and-pop", "misc action" ]
    },
    "big_3p_big": {
      source: "3P Assisted by frontcourt",
      target: "Pass to frontcourt for 3P",
      examples: [ "kick-out after an ORB", "pass out of a post-up" ]
    },

    // 3.2] mid

    "big_mid": {
      source: "Mid Range Unassisted",
      exammples: [ "high post-up", "ISO", "misc action" ]
    },
    "big_mid_ballhandler": {
      source: "Mid Range Assisted by ballhandler",
      target: "Pass to frontcourt for mid-range",
      examples: [ "high post-up", "spread offense", "misc action" ]
    },
    "big_mid_wing": {
      source: "Mid Range Assisted by wing",
      target: "Pass to frontcourt for mid-range",
      examples: [ "high post-up", "spread offense", "misc action" ]
    },
    "big_mid_big": {
      source: "Mid Range Assisted from frontcourt",
      target: "Pass to frontcourt for mid-range",
      examples: [ "high-low action" ]
    },

    // 3.3] rim

    "big_rim": {
      source: "Layup Unassisted",
      examples: [ "post-up", "ISO" ]
    },
    "big_rim_ballhandler": {
      source: "Layup Assisted by ballhandler",
      target: "Pass to frontcourt for layup",
      examples: [ "roll", "cut", "sometimes post-up" ]
    },
    "big_rim_wing": {
      source: "Layup Assisted by wing",
      target: "Pass to frontcourt for layup",
      examples: [ "roll", "cut", "sometimes post-up" ]
    },
    "big_rim_big": {
      source: "Layup Assisted by frontcourt",
      target: "Pass to frontcourt for layup",
      examples: [ "roll", "cut", "sometimes post-up" ]
    }
  } as Record<string, any>;

}
