
// Utils:
import _ from 'lodash'

export type PosFamily = "ballhandler" | "wing" | "big";
export const PosFamilyNames: PosFamily[] = [ "ballhandler", "wing", "big" ];

/** Information we can calculate */
export type PlayTypeInfo = { scoringPoss: number, eFG: number, fg: number, approxPos: number };
const playInfo0: PlayTypeInfo = { scoringPoss: 0, eFG: 0, fg: 0, approxPos: 0 };

/** Utilities for guessing different play types based on box scorer info */
export class PlayTypeUtils {

  private static posClassToFamilyScore = [
    [ 1.00, 0.66, 0.15, 0.00, 0.00 ], // ballhandler
    [ 0.00, 0.34, 0.85, 0.66, 0.00 ], // wing
    [ 0.00, 0.00, 0.00, 0.34, 1.00 ], // big
  ];

  /** Goes from all 5 position classes to a smaller/simple position family */
  static buildPosFamily(posClass: number[]): [ number, number, number ] {
    return PlayTypeUtils.posClassToFamilyScore.map((scores: number[]) => {
      return _.sumBy(_.zip(scores, posClass), xy => xy[0]!*xy[1]!);
    });
  }

  /** Simplifies assist networks by mapping them from individuals to position families (shotType: "rim", "mid", "3p")*/
  static simplifyAssistNetwork(
    assistNetwork: Record<string, number>,
    rosterStatsByCode: Record<string, any>,
    shotType: string,
    calcTargetStats: boolean
  ) {
    const actualShotType = shotType == "3p" ? shotType : "2p" + shotType;
    const shotBonus = shotType == "3p" ? 1.5 : 1;
    return _.chain(assistNetwork).transform(
      (acc, assistVal, key) => {
        const playerStats = rosterStatsByCode[key] || {};
        const familyStats = PlayTypeUtils.buildPosFamily(playerStats.posClass || [ 0, 0, 0, 0, 0]);
        const playerFg = playerStats[`off_${actualShotType}`]?.value || 0; //TODO
        _.map(acc, (familyVal, posFamily) => {
          return [
            familyVal.scoringPoss + assistVal*familyStats[posFamily]!,
            familyVal.fg + playerFg*assistVal*familyStats[posFamily]!
          ];
        }).forEach((scoresFg, ii) => {
          acc[ii] = { scoringPoss: scoresFg[0], eFG: 0, fg: scoresFg[1], approxPos: 0 };
        });

      }, [ playInfo0, playInfo0, playInfo0 ]
    ).map((v, ii) => {
      const fg = v.fg/(v.scoringPoss || 1);
      return [ PosFamilyNames[ii]!, {
        scoringPoss: v.scoringPoss,
        fg: calcTargetStats ? fg : undefined,
        eFG: calcTargetStats ? fg*shotBonus : undefined,
        approxPos: calcTargetStats ? v.scoringPoss/fg : undefined
      } ];
    }).fromPairs().value();
  }

  /** PlayerFamily_ShotType_([source|target]_AssisterFamily)? */
  private static playTypes = {
    // 1] Ball handler:

    // 1.1] 3P

    "ballhandler_3p":
      "3P Unassisted: eg off ball-screen, ISO, dribble jumper off misc action",
    "ballhandler_3p_ballhandler":
      "3P Assisted by a ballhandler: eg drive-and-kick, hockey assist after defense collapses inside, misc action",
    "ballhandler_3p_wing":
      "3P Assisted by a wing: eg slash-and-kick, hockey assist after defense collapses inside, misc action",
    "ballhandler_3p_big":
      "3P Assisted by frontcourt: eg kick-out after an ORB, pass out of a post-up",

    // 1.2] mid

    "ballhandler_mid":
      "Mid Range Unassisted: eg drive and pull-up off ball-screen, ISO, misc action",
    "ballhandler_mid_ballhandler":
      "Mid Range Assisted by wing: eg misc action",
    "ballhandler_mid_wing":
      "Mid Range Assisted by wing: eg misc action",
    "ballhandler_mid_big":
      "Mid Range Assisted from frontcourt: eg (sub-optimal) pass out of a post-up",

    // 1.3] rim

    "ballhandler_rim":
      "Drive Unassisted: eg attacks the rim off P&R, ISO",
    "ballhandler_rim_ballhandler":
      "Drive ",

  };

}
