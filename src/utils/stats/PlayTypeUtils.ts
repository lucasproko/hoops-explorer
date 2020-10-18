
// Utils:
import _ from 'lodash'

export type PosFamily = "ballhandler" | "wing" | "big";
export const PosFamilyNames: PosFamily[] = [ "ballhandler", "wing", "big" ];

/** Information we can calculate */
export type PlayTypeRawInfo = { scoringPoss: number, eFG: number, fg: number, approxPoss: number };
const playRawInfo0: PlayTypeRawInfo = { scoringPoss: 0, eFG: 0, fg: 0, approxPoss: 0 };

export type PlayTypeInfo = {
  totalPossPct: number,
  shotLikePossPct: number,
  scoringPossPct: number,
  passPossPct: number,
  assistPossPct: number,
  targetEfg: number,
};
const playInfo0 = { totalPossPct: 0, shotLikePossPct: 0, scoringPossPct: 0, passPossPct: 0, assistPossPct: 0, targetEfg: 0 };


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
        const playerStats = (calcTargetStats ? rosterStatsByCode[key] : rosterStatsByCode) || {};
        const familyStats = PlayTypeUtils.buildPosFamily(playerStats.posClass || [ 0, 0, 0, 0, 0]);
        const playerFg = playerStats[`off_${actualShotType}`]?.value || 0;
        _.map(acc, (familyVal, posFamily) => {
          return [
            familyVal.scoringPoss + assistVal*familyStats[posFamily]!,
            familyVal.fg + playerFg*assistVal*familyStats[posFamily]!
          ];
        }).forEach((scoresFg, ii) => {
          acc[ii] = { scoringPoss: scoresFg[0], eFG: 0, fg: scoresFg[1], approxPoss: 0 };
        });

      }, [ playRawInfo0, playRawInfo0, playRawInfo0 ]
    ).map((v, ii) => {
      const fg = v.fg/(v.scoringPoss || 1);
      return [ PosFamilyNames[ii]!, {
        scoringPoss: v.scoringPoss,
        fg: fg,
        eFG: fg*shotBonus,
        approxPoss: fg > 0 ? v.scoringPoss/fg : fg
      } ];
    }).fromPairs().value();
  }

  /** Converts assist networks and other stats into some simple stats indexed by play type */
  static buildPlayTypes(
    playerStats: Record<string, any>,
    targetAssistNetworks: Record<string, Record<string, PlayTypeRawInfo>>, //(indexed as `<shotType>:<from>`)
    sourceAssistNetworks: Record<string, Record<string, PlayTypeRawInfo>> //(indexed as `<shotType>:<from>`)
  ) {
    //TODO; is there some way I can take super low % play types and add them to saner ones?
    //TODO; scramble and transition assisted play adjustments
    //TODO: dole out FT credit to play types (based on %s of: rims, unassisted mid)

    const mutableResultArray = [] as Array<[string, PlayTypeInfo]>;
    const mutableTotalsArray = { ... playInfo0 };

    // Build player family:
    const playerFamily = PlayTypeUtils.buildPosFamily(playerStats.posClass);

    // Nasty mutable nested loop for expediency
    const playTypes = playerFamily.filter(pct => pct > 0).flatMap((familyPct, familyIndex) => {
      const posFamilyName = PosFamilyNames[familyIndex]!;

      // Turns my assists into play info:
      // Note that for target, you swap the key round ie <<assisted>>_shotType_<<shotTaker>>
      const flatTargetNetwork = _.chain(targetAssistNetworks).toPairs().flatMap(kv => {
        return _.toPairs(kv[1]).map(kv2 => [`${kv2[0]}_${kv[0]}`, kv2[1]]);
      }).value();
      const targetPlayTypes = flatTargetNetwork.map(kv => {
        const shotTypeFrom = kv[0];
        const targetInfo = kv[1] as PlayTypeRawInfo;
        const toAdd = {
          totalPossPct: 0,
          shotLikePossPct: 0,
          scoringPossPct: 0,
          passPossPct: targetInfo.approxPoss*familyPct,
          assistPossPct: targetInfo.scoringPoss*familyPct,
          targetEfg: (targetInfo.scoringPoss*familyPct)*targetInfo.eFG,
        };
        mutableTotalsArray.passPossPct += toAdd.passPossPct;
        mutableTotalsArray.assistPossPct += toAdd.assistPossPct;

        return [`${shotTypeFrom}_${posFamilyName}`, toAdd];
      });

      // Turns assists to me into play info:

      const buildUnassisted = (actualShotType: string) => {
        const assists = playerStats[`total_off_${actualShotType}_ast`]?.value || 0;
        const made = playerStats[`total_off_${actualShotType}_made`]?.value || 0;
        const unassisted = made - assists;
        const unassistedPct = made > 0 ? unassisted/made : 0;
          //(this obv makes the assumption that eFG is the same assisted vs unassisted)
        const attempts = playerStats[`total_off_${actualShotType}_attempts`]?.value || 0;
        const unassistedAttempts = unassistedPct*made;
        return [ unassisted, unassistedAttempts ];
      };
      const buildHalfCourtUnassisted = (actualShotType: string) => {
        const [ totalUnassisted, unassistedAttempts ] = buildUnassisted(`${actualShotType}`);
        const [ nonHcUnassisted, nonHcUnassistedAttempts ] = _.transform([ "scramble_", "trans_" ], (acc, v) => {
          const [ unassisted, unassistedAttempts ] = buildUnassisted(`${v}${actualShotType}`);

          acc[0] = acc[0] + unassisted;
          acc[1] = acc[1] + unassistedAttempts;

        }, [ 0, 0 ]); // [ made, attempts]

        return [ totalUnassisted - nonHcUnassisted, unassistedAttempts - nonHcUnassistedAttempts ];
      }

      const flatSourceNetwork = _.chain(sourceAssistNetworks).toPairs().flatMap(kv => {
        return _.toPairs(kv[1]).map(kv2 => [`${kv[0]}_${kv2[0]}`, kv2[1]]);
      }).value().concat( // Add unassisted events:
        [ "3p", "mid", "rim" ].map(shotType => {
          const actualShotType = shotType == "3p" ? shotType : "2p" + shotType;
          const [ made, attempts ] = buildHalfCourtUnassisted(actualShotType);
          return [
            shotType, {
              approxPoss: attempts,
              scoringPoss: made,
              eFG: (attempts > 0 ? made/attempts : 0)*(shotType == "3p" ? 1.5 : 1)
            }
          ];
        })
      );
      const sourcePlayTypes = flatSourceNetwork.map(kv => {
        const shotTypeFrom = kv[0];
        const sourceInfo = kv[1] as PlayTypeRawInfo;
        const toAdd = {
          totalPossPct: 0,
          shotLikePossPct: sourceInfo.approxPoss*familyPct,
          scoringPossPct: sourceInfo.scoringPoss*familyPct,
          passPossPct: 0,
          assistPossPct: 0,
          targetEfg: 0,
        };
        mutableTotalsArray.shotLikePossPct += toAdd.shotLikePossPct;
        mutableTotalsArray.scoringPossPct += toAdd.scoringPossPct;
        return [`${posFamilyName}_${shotTypeFrom}`, toAdd];
      });
      return sourcePlayTypes.concat(targetPlayTypes);
    });

    const completePlayTypes = (vals: Array<PlayTypeInfo>) => {
      const merged = _.transform(vals, (acc, v) => {
        acc.shotLikePossPct += v.shotLikePossPct;
        acc.scoringPossPct += v.scoringPossPct;
        acc.passPossPct += v.passPossPct;
        acc.assistPossPct += v.assistPossPct;
        acc.targetEfg += v.targetEfg;
      },  { ...playInfo0 });
      return { ...merged,
        totalPossPct: merged.shotLikePossPct + merged.passPossPct,
        targetEfg: merged.assistPossPct > 0 ? merged.targetEfg/merged.assistPossPct : 0
      };
    };

    return _.chain(playTypes).groupBy(kv =>
      PlayTypeUtils.playTypesByFamily[kv[0]!]!
    ).toPairs().map(keyVals => {
      const key = keyVals[0]!;
      const vals = keyVals[1]!;
      return [ key, completePlayTypes(vals.map(kv => kv[1])) ];
    }).filter(kv => kv[1].totalPossPct >= 5).value();
  }

//TODO: these descs don't work well because eg Cowan: to Stix for 3 shows as "3P Assisted by a ballhandler"
// not: "Ballhandler to big: for 3"

  /** PlayerFamily_ShotType_([source|target]_AssisterFamily)? */
  private static playTypesByFamily = {
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
      "Mid Range Unassisted: eg drive and pull-up off ball-screen or ISO, misc action",
    "ballhandler_mid_ballhandler":
      "Mid Range Assisted by ballhandler: eg spread offense, misc action",
    "ballhandler_mid_wing":
      "Mid Range Assisted by wing: eg spread offense, misc action",
    "ballhandler_mid_big":
      "Mid Range Assisted from frontcourt: eg (usually sub-optimal) pass out of a post-up",

    // 1.3] rim

    "ballhandler_rim":
      "Drive Unassisted: eg attacks the rim off pick-and-roll, ISO",
    "ballhandler_rim_ballhandler":
      "Layup Assisted by ballhandler: eg cut",
    "ballhandler_rim_wing":
      "Layup Assisted by wing: eg cut",
    "ballhandler_rim_big":
      "Layup Assisted by frontcourt: eg cut",

    // 2] Wing:

    // 2.1] 3P

    "wing_3p":
      "3P Unassisted: eg off ball-screen, ISO, dribble jumper off misc action",
    "wing_3p_ballhandler":
      "3P Assisted by a ballhandler: eg drive-and-kick, hockey assist after defense collapses inside, misc action",
    "wing_3p_wing":
      "3P Assisted by a wing: eg slash-and-kick, hockey assist after defense collapses inside, misc action",
    "wing_3p_big":
      "3P Assisted by frontcourt: eg kick-out after an ORB, pass out of a post-up",

    // 2.2] mid

    "wing_mid":
      "Mid Range Unassisted: eg drive and pull-up off ball-screen or ISO, misc action",
    "wing_mid_ballhandler":
      "Mid Range Assisted by ballhandler: eg spread offense, misc action, zone buster",
    "wing_mid_wing":
      "Mid Range Assisted by wing: eg spread offense, misc action, zone buster",
    "wing_mid_big":
      "Mid Range Assisted from frontcourt: eg (usually sub-optimal) pass out of a post-up",

    // 2.3] rim

    "wing_rim":
      "Drive Unassisted: eg attacks the rim off pick-and-roll, ISO",
    "wing_rim_ballhandler":
      "Layup Assisted by ballhandler: eg cut",
    "wing_rim_wing":
      "Layup Assisted by wing: eg cut",
    "wing_rim_big":
      "Layup Assisted by frontcourt: eg cut",

    // 3] Frontcourt:

    // 3.1] 3P

    "big_3p":
      "3P Unassisted: eg off ball-screen, ISO, dribble jumper off misc action",
    "big_3p_ballhandler":
      "3P Assisted by a ballhandler: eg pick-and-pop, misc action",
    "big_3p_wing":
      "3P Assisted by a wing: eg pick-and-pop, misc action",
    "big_3p_big":
      "3P Assisted by frontcourt: eg kick-out after an ORB, pass out of a post-up",

    // 3.2] mid

    "big_mid":
      "Mid Range Unassisted: eg deep post-up, ISO, misc action",
    "big_mid_ballhandler":
      "Mid Range Assisted by ballhandler: eg deep post-up, spread offense, misc action",
    "big_mid_wing":
      "Mid Range Assisted by wing: eg deep post-up, spread offense, misc action",
    "big_mid_big":
      "Mid Range Assisted from frontcourt: eg high-low action",

    // 3.3] rim

    "big_rim":
      "Drive Unassisted: post-up",
    "big_rim_ballhandler":
      "Layup Assisted by ballhandler: eg roll or cut, sometimes post-up",
    "big_rim_wing":
      "Layup Assisted by wing: eg roll or cut, sometimes post-up",
    "big_rim_big":
      "Layup Assisted by frontcourt: eg roll or cut, sometimes post-up",
  };

}
