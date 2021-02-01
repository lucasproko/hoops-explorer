
// Utils:
import _ from 'lodash'

export type PosFamily = "ballhandler" | "wing" | "big";
export const PosFamilyNames: PosFamily[] = [ "ballhandler", "wing", "big" ];

/** Data for a given player broken down */
export type PlayerStyleInfo = {
  unassistedHalfCourt: Record<string, any>,
  assistedHalfCourt: Record<string, any>,
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
  private static buildPlayerStyle(player: Record<string, any>): PlayerStyleInfo {

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

    const unassistedHalfCourtRow = shotTypes.map((key) => {
      const shots = player[`total_off_${shotMap[key]!}_made`]?.value || 0; //(half court/transition/scramble)
      const assisted = player[`total_off_${shotMap[key]!}_ast`]?.value || 0; //(half court/transition/scramble)
      const unassistedHalfCourt = (shots - assisted) - scrambleTotal[key]![2]! - transitionTotal[key]![2]!;

      return [ `source_${key}_ast`, unassistedHalfCourt > 0 ? {
        value: unassistedHalfCourt/totalScoringPlaysMade
      } : null ];
    }).concat([
      [ `source_sf`, totalFtTripsMadeHalfCourt > 0 ? { value: totalFtTripsMadeHalfCourt/totalScoringPlaysMade } : null ]
    ]);

    const assistTotalsRow = shotTypes.map((key) => {
      const assisted = player[`total_off_${shotMap[key]!}_ast`]?.value || 0;
      const assistedHalfCourt = assisted - scrambleTotal[key]![1]! - transitionTotal[key]![1]!;
      return [ `source_${key}_ast`, assisted > 0 ? {
        value: assistedHalfCourt/totalScoringPlaysMade
      } : null];
    }).concat([
      [ `target_ast`, totalAssists > 0 ? {
        value: totalAssists/totalScoringPlaysMade
      } : null ]
    ]);

    return {
      unassistedHalfCourt: _.fromPairs(unassistedHalfCourtRow),
      assistedHalfCourt: _.fromPairs(assistTotalsRow),
      scramble: _.fromPairs(scrambleRow),
      transition: _.fromPairs(transitionRow),
      totalScoringPlaysMade: totalScoringPlaysMade,
      totalAssists: totalAssists
    };
  }

  /** Takes a player or category (ball-handler / wing / frontcourt) and builds their assist network */
  static buildPlayerOrPosAssistNetwork(
    playerOrPos: Record<string, any>, mainPlayer: Record<string, any>,
    totalScoringPlaysMade: number, totalAssists: number,
    rosterStatsByCode: Record<string, any>,
    buildInfoRow: (data: any) => any
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
          [`${loc}_${key}_efg`, buildInfoRow({ value: eFG }) ]
        ] : [];
      }).concat( (targetNotSource && (mutableAssistsAcrossShotTypes > 0)) ?
        [ [ `target_ast`, { value: mutableAssistsAcrossShotTypes / totalScoringPlaysMade } ] ]: []
      );
    })));
    return [ info, mutableTotal ];
  }

  /** PlayerFamily_ShotType_([source|target]_AssisterFamily)? */
  private static playTypesByFamily = {
    // 1] Ball handler:

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
      examples: [ "spread offense, misc action" ]
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
      exammples: [ "eg deep post-up", "ISO", "misc action" ]
    },
    "big_mid_ballhandler": {
      source: "Mid Range Assisted by ballhandler",
      target: "Pass to frontcourt for mid-range",
      examples: [ "deep post-up", "spread offense", "misc action" ]
    },
    "big_mid_wing": {
      source: "Mid Range Assisted by wing",
      target: "Pass to frontcourt for mid-range",
      examples: [ "deep post-up", "spread offense", "misc action" ]
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
      examples: [ "roll or cut" , "sometimes post-up" ]
    },
    "big_rim_wing": {
      source: "Layup Assisted by wing",
      target: "Pass to frontcourt for layup",
      examples: [ "roll or cut", "sometimes post-up" ]
    },
    "big_rim_big": {
      source: "Layup Assisted by frontcourt",
      target: "Pass to frontcourt for layup",
      examples: [ "roll or cut", "sometimes post-up" ]
    }
  } as Record<string, any>;

}
