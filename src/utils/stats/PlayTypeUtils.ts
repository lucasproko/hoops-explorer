
// Utils:
import _ from 'lodash'
import { PlayerCode, IndivStatSet, TeamStatSet } from '../StatModels';

export type PosFamily = "ballhandler" | "wing" | "big";
export const PosFamilyNames: PosFamily[] = [ "ballhandler", "wing", "big" ];

/** Data for a given player broken down */
export type PlayerStyleInfo = {
  unassisted: Record<string, any>,
  assisted: Record<string, any>,
  scramble: Record<string, any>, //(totals, asssisted + unassisted)
  transition: Record<string, any>, //(totals, asssisted + unassisted)
  scrambleAssisted: Record<string, any>,
  transitionAssisted: Record<string, any>,
  totalScoringPlaysMade: number,
  totalAssists: number
};

const targetSource = [ "source", "target" ];
const shotTypes = [ "3p", "mid", "rim" ];
const shotNameMap = { "3p": "3P", "mid": "Mid", "rim": "Rim" } as Record<string, string>;
const shotMap = { "3p": "3p", "rim": "2prim", "mid": "2pmid" } as Record<string, string>;

type PlayStyleTypes = "scoringPlaysPct" | "pointsPer100" | "playsPct";

export type TopLevelPlayTypes = 
  "Rim Attack" | "Attack & Kick" | "Attack & Dish" | "Dribble Jumper" |
  "Spread" |
  "Cut & Roll" | "Post-Ups" | "Post-Up Collapse" | "Pick & Pop" | "High-Low" |
  "Transition" | "Put-Back" | "Misc";
  //(currently "Misc" is just team turnovers, used to get the sum back to 100%)

/** Utilities for guessing different play types based on box scorer info */
export class PlayTypeUtils {

  static topTevelPlayTypes: TopLevelPlayTypes[] = [
    "Rim Attack" , "Attack & Kick" , "Attack & Dish" , "Dribble Jumper" ,
    "Spread" ,
    "Cut & Roll" , "Post-Ups" , "Post-Up Collapse", "Pick & Pop" , "High-Low" ,
    "Transition" , "Put-Back"
  ]; //(no Misc we don't rennder)

  /** Gives % of ball-handler /  wing / big vs position name */
  private static posToFamilyScore = {
    "PG": [ 1.0, 0, 0],
    "s-PG": [ 1.0, 0, 0],
    "CG": [ 0.8, 0.2, 0 ],
    "WG": [ 0.2, 0.8, 0 ],
    "WF": [ 0, 0.8, 0.2 ],
    "S-PF": [ 0, 0.6, 0.4 ],
    "PF/C": [ 0, 0.2, 0.8 ],
    "C": [ 0, 0, 1.0 ],
    "G?": [ 0.75, 0.25, 0 ],
    "F/C?": [ 0, 0.5, 0.5 ]
  } as Record<string, [ number, number, number ]>;
  private static posClassToFamilyScore = [
    [ 1.00, 0.66, 0.15, 0.00, 0.00 ], // ballhandler
    [ 0.00, 0.34, 0.85, 0.66, 0.00 ], // wing
    [ 0.00, 0.00, 0.00, 0.34, 1.00 ], // big
  ];

  /** Goes from all 5 position classes to a smaller/simple position family */
  private static buildPosFamily(pos: string, posClass: number[]): [ number, number, number ] {
    return PlayTypeUtils.posToFamilyScore[pos] || [ 0, 1.0, 0 ];
    //TODO: this uses the raw numbers, which empiricially didn't work particularly well
    // eg for centers it tended to
    // return PlayTypeUtils.posClassToFamilyScore.map((scores: number[]) => {
    //   return _.sumBy(_.zip(scores, posClass), xy => xy[0]!*xy[1]!);
    // });
  }

  /** Builds a list of all the team-mate codes who assist or are assisted by the specified player */
  static buildPlayerAssistCodeList(player: Record<string, any>) {
    return _.chain(targetSource).flatMap((loc) => {
      return shotTypes.flatMap((key) => {
        return _.keys(player[`off_ast_${key}_${loc}`]?.value || {});
      });
    }).uniq().value();
  }

  /** Decomposes a player stats into unassisted/assisted _totals_ and half-court/scramble/transition */
  static buildPlayerStyle(
    playStyleType: PlayStyleTypes,
    player: Record<string, any>, 
    countNotPctScorePoss?: number, countNotPctAssists?: number, 
    separateHalfCourt?: boolean
  ): PlayerStyleInfo {

    // Some types and globals

    const ftaMult = 0.475;
    const totalAssistsCalc = (player[`total_off_assist`]?.value || 0)
    const totalAssistsCalcHalfCourt = totalAssistsCalc
      - (player[`total_off_scramble_assist`]?.value || 0)
      - (player[`total_off_trans_assist`]?.value || 0)
      ; // (don't render if 0)
    const totalAssistsCalcToUse = separateHalfCourt ? totalAssistsCalcHalfCourt : totalAssistsCalc;

    const totalAssists = countNotPctAssists ? countNotPctAssists : totalAssistsCalc;
    const maybeTurnovers = (playStyleType == "scoringPlaysPct") ? 0 : (player.total_off_to?.value || 0);

    const totalSuffix = (playStyleType == "scoringPlaysPct") ? "fgm" : "fga";
    //(for pts/100 and % of plays we care about field goals made and missed)

    const totalShotsCount = player[`total_off_${totalSuffix}`]?.value || 0;
    const totalFtTripsMade = ftaMult*(player[`total_off_fta`]?.value || 0);
    const totalPlaysMade = (countNotPctScorePoss ? countNotPctScorePoss :
        (totalShotsCount + totalFtTripsMade + totalAssists + maybeTurnovers)
      ) || 1; //(always render so avoid NaN with default 1)

    const fieldGoalTypeSuffix = (playStyleType == "playsPct") ? "attempts" : "made";
    //(if we care about scoring unless calculating the pure playsPct)

    /** (util method, see below) */
    const buildTotal = (prefix: string) => { return _.fromPairs(shotTypes.map((key) => {
      const total = player[`total_off_${prefix}_${shotMap[key]!}_${fieldGoalTypeSuffix}`]?.value || 0;
      const assisted = player[`total_off_${prefix}_${shotMap[key]!}_ast`]?.value || 0;
      const unassisted = total - assisted;
      return [ key, [ total, assisted, unassisted ] ];
    })) as Record<string, number[]>; };

    /** (util method, see below) */
    const buildRow = (totalInfo: Record<string, number[]>, ftInfo: number, assists: number, turnovers: number, assistedOnly: boolean) => {
      return _.toPairs(totalInfo).map(kv => {
        const key = kv[0];
        const total = kv[1][0]!; //total unassisted + assisted
        const assisted = kv[1][1]!; 
        return [ `source_${key}_ast`, total > 0 ? {
          value: (assistedOnly ? assisted : total)/totalPlaysMade
        } : null ]
      }).concat(assistedOnly ? [] : [
        [ `source_sf`, ftInfo > 0 ? { value: ftInfo/totalPlaysMade } : null ],
        [ `target_ast`, assists > 0 ? { value: assists/totalPlaysMade } : null ],
      ]).concat(!assistedOnly && (maybeTurnovers > 0) ? [
        [ `source_to`, turnovers > 0 ? { value: turnovers/totalPlaysMade } : null ],
      ]: []);
    }

    // Scramble and transition

    const scrambleTotal = buildTotal("scramble");
    const scrambleFtTrips = ftaMult*(player[`total_off_scramble_fta`]?.value || 0);
    const scrambleAssists = player[`total_off_scramble_assist`]?.value || 0;
    const scrambleTo = player[`total_off_scramble_to`]?.value || 0;
    const scrambleRow = buildRow(scrambleTotal, scrambleFtTrips, scrambleAssists, scrambleTo, false);
    const scrambleRowAssistedOnly = separateHalfCourt ? 
      buildRow(scrambleTotal, scrambleFtTrips, scrambleAssists, 0, true) : [];

    const transitionTotal = buildTotal("trans");
    const transitionFtTrips = ftaMult*(player[`total_off_trans_fta`]?.value || 0);
    const transitionAssists = player[`total_off_trans_assist`]?.value || 0;
    const transitionTo = player[`total_off_trans_to`]?.value || 0;
    const transitionRow = buildRow(transitionTotal, transitionFtTrips, transitionAssists, transitionTo, false);
    const transitionRowAssistedOnly = separateHalfCourt ? 
      buildRow(transitionTotal, transitionFtTrips, transitionAssists, 0, true) : [];

    // Half court:

    const totalFtTripsMadeHalfCourt = totalFtTripsMade - transitionFtTrips - scrambleFtTrips;
    const totalFtTripsToUse = (separateHalfCourt ? totalFtTripsMadeHalfCourt : totalFtTripsMade);
    const halfCourtTos = separateHalfCourt ? (maybeTurnovers - transitionTo - scrambleTo) : maybeTurnovers;

    const unassistedToUseRow = shotTypes.map((key) => {
      const shots = player[`total_off_${shotMap[key]!}_${fieldGoalTypeSuffix}`]?.value || 0; //(half court/transition/scramble)
      const assisted = player[`total_off_${shotMap[key]!}_ast`]?.value || 0; //(half court/transition/scramble)
      const unassisted = (shots - assisted);
      const unassistedHalfCourt =  unassisted - scrambleTotal[key]![2]! - transitionTotal[key]![2]!;
      const unassistedToUse = (separateHalfCourt ? unassistedHalfCourt : unassisted);

      return [ `source_${key}_ast`, unassistedToUse > 0 ? {
        value: unassistedToUse/totalPlaysMade
      } : null ];
    }).concat([
      [ `source_sf`, totalFtTripsToUse > 0 ? { value: totalFtTripsToUse/totalPlaysMade } : null ]
    ]).concat((maybeTurnovers > 0) ? [
      [ `source_to`, halfCourtTos > 0 ? { value: halfCourtTos/totalPlaysMade } : null ],
    ]: []);

    const assistToUseTotalsRow = shotTypes.map((key) => {
      const assisted = player[`total_off_${shotMap[key]!}_ast`]?.value || 0;
      const assistedHalfCourt = assisted - scrambleTotal[key]![1]! - transitionTotal[key]![1]!;
      const assistedToUse = separateHalfCourt ? assistedHalfCourt : assisted;

      return [ `source_${key}_ast`, assistedToUse > 0 ? {
        value: assistedToUse/totalPlaysMade
      } : null];
    }).concat([
      [ `target_ast`, totalAssistsCalcToUse > 0 ? {
        value: totalAssistsCalcToUse/totalPlaysMade
      } : null ]
    ]);

    return {
      unassisted: _.fromPairs(unassistedToUseRow),
      assisted: _.fromPairs(assistToUseTotalsRow),
      scramble: _.fromPairs(scrambleRow),
      transition: _.fromPairs(transitionRow),
      scrambleAssisted: _.fromPairs(scrambleRowAssistedOnly),
      transitionAssisted: _.fromPairs(transitionRowAssistedOnly),
      totalScoringPlaysMade: totalPlaysMade,
      totalAssists: totalAssists
    };
  }

  /** Takes a player or category (ball-handler / wing / frontcourt) and builds their assist network
   * relative to the main player (ie assisting or assisted by) for each shot type
   * note totalScoringPlaysMade/totalAssists is relative to "mainPlayer"
   *  (note that the interaction between this logic and the calling code in XxxPlayTypeDiagView is currently a bit tangled)
   */
  static buildPlayerAssistNetwork(
    playerOrPos: string, mainPlayer: Record<string, any>,
    totalScoringPlaysMade: number, totalAssists: number,
    rosterStatsByCode: Record<string, any>
  ): [ Record<string, any>, number ] {
    const p = playerOrPos;
    var mutableTotal = 0;
    const info = (_.fromPairs([ "target", "source" ].flatMap((loc) => {
      const targetNotSource = loc == "target";
      var mutableAssistsAcrossShotTypes = 0;
      return shotTypes.flatMap((key) => {
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

  /** Adds example plays to the "extraInfo" of unassisted stats */
  static enrichUnassistedStats(unassistedStats: Record<string, any>, mainPlayer: Record<string, any> | number) {
    // Build main player's positional category:
    const mainPlayerCats = _.isNumber(mainPlayer) ?
      [ { order: mainPlayer, score: 0 }  ]
      :
      _.orderBy(PlayTypeUtils.buildPosFamily(mainPlayer.role, mainPlayer.posClass).flatMap((catScore, ix) => {
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

  /** Adds example plays to the "extraInfo" of non-half-court stats */
  static enrichNonHalfCourtStats(transitionStats: Record<string, any>, scrambleStats: Record<string, any>) {
    _.forEach(transitionStats, (oval, okey) => {
      if (okey.startsWith("source_")) {
        oval.extraInfo = [ "trans" ];
      }
    });
    _.forEach(scrambleStats, (oval, okey) => {
      if (okey.startsWith("source_")) {
        oval.extraInfo = [ "scramble" ];
      }
    });
  }

  /** Comes up with an approximate set of half-court stats */
  static convertAssistsToHalfCourtAssists(
    mutableAssistInfo: Record<string, any>[],
    nonHalfCourtInfoTrans: Record<string, any>,
    nonHalfCourtInfoScramble: Record<string, any>
  ) {
    _.map(shotTypes, shotType => {
      // const nonHalfCourtInfoTrans = otherInfo[4];
      // const nonHalfCourtInfoScramble = otherInfo[5];
      const nonHalfCourtInfoTransPct = nonHalfCourtInfoTrans[`source_${shotType}_ast`]?.value || 0;
      const nonHalfCourtInfoScramblePct = nonHalfCourtInfoScramble[`source_${shotType}_ast`]?.value || 0;
      const nonHalfCourtInfoPct = nonHalfCourtInfoTransPct + nonHalfCourtInfoScramblePct;

      //console.log(`[*][${shotType}][${posTitle}] Need to distribute [${nonHalfCourtInfoPct.toFixed(4)}](=[${nonHalfCourtInfoTransPct.toFixed(4)}]+[${nonHalfCourtInfoScramblePct.toFixed(4)}]) to:`)

      const totalAssistedPct = _.chain(PosFamilyNames).map((pos, ipos) => {
        return (mutableAssistInfo[ipos]?.[`source_${shotType}_ast`]?.value || 0);
      }).sum().value();

      const reductionPct = (totalAssistedPct - Math.min(nonHalfCourtInfoPct, totalAssistedPct))/(totalAssistedPct || 1);

      //console.log(`[*][${shotType}][${posTitle}] Approximate half-court assisted by keeping [${reductionPct.toFixed(2)}]%`);

      _.map(PosFamilyNames, (pos, ipos) => {

        //console.log(`[${pos}][${shotType}][${posTitle}]: [${(assistInfo[ipos]?.[`source_${shotType}_ast`]?.value || 0).toFixed(4)}]`);
        
        if (_.isNumber(mutableAssistInfo[ipos]?.[`source_${shotType}_ast`]?.value)) {
          mutableAssistInfo[ipos][`source_${shotType}_ast`].value = mutableAssistInfo[ipos][`source_${shotType}_ast`].value*reductionPct;
        }
      });
    });

  }

  /** Guess what happened when a TO occurred */
  static apportionHalfCourtTurnovers(
    pos: string, posIndex: number,
    immutableHalfCourtAssistInfo: Record<string, { assists: Record<string, any>[] }>,
    mutableHalfCourtAssistInfo: Record<string, { assists: Record<string, any>[] }>,
    mutableUnassisted: Record<string, any>
  ) {
    // We take the % of half-court turnovers for each position group
    // and apportion it out in the following ratios:
    // unassisted rim: highest weight
    // "my" assists: next highest weight
    // (gap)
    // assists to "me" inside: lower weight
    // assists to "me" on the perimeter: lowest weight
    const weights = [ 4.5, 3.5, 2, 1 ];

    const adjStat = (stat: any, adj: number) => {
      if (_.isNumber(stat?.value)) stat.value = stat.value + adj;
    };
    const toPctToUse = (mutableUnassisted.source_to?.value || 0);
    var totalWeight = 0;
    // 2 Phases, 1 to collect weight, 1 to mutate stats
    [ 0, 1 ].forEach(phase =>{
      const unassistedWeight = weights[0]*(mutableUnassisted.source_rim_ast?.value || 0);
      if (phase == 0) totalWeight = totalWeight + unassistedWeight;
      if (phase == 1) adjStat(mutableUnassisted.source_rim_ast, (unassistedWeight*toPctToUse)/(totalWeight || 1));
      //if (phase == 1) console.log(`[${pos}][${posIndex}] (to%=[${toPctToUse}]): adj [unassisted] by [${unassistedWeight}] -> [${toPctToUse*unassistedWeight/totalWeight}]`)

      _.map(PosFamilyNames).map((otherPos, jpos) => {
        const meToOtherPosAssists = immutableHalfCourtAssistInfo[pos]!.assists[jpos]!;
        const otherPosToMeAssists = immutableHalfCourtAssistInfo[otherPos]!.assists[posIndex]!;
        const mutMeToOtherPosAssists = mutableHalfCourtAssistInfo[pos]!.assists[jpos]!;
        const mutOtherPosToMeAssists = mutableHalfCourtAssistInfo[otherPos]!.assists[posIndex]!;

        shotTypes.map(shotType => {
          const isInside = shotType == "rim";
          const otherToMeAssistWeight = 
            weights[isInside? 2 : 3]*(otherPosToMeAssists[`source_${shotType}_ast`]?.value || 0);
          if (phase == 0) totalWeight = totalWeight + otherToMeAssistWeight;          
          if (phase == 1) adjStat(mutOtherPosToMeAssists[`source_${shotType}_ast`], (otherToMeAssistWeight*toPctToUse)/(totalWeight || 1));
          //if (phase == 1) console.log(`[${pos}][${posIndex}] (to%=[${toPctToUse}]): adj me->other [ast/${shotType}] by [${meToOtherPosAssists}] -> [${toPctToUse*meToOtherPosAssists/totalWeight}]`)

          const meToOtherAssistWeight = weights[1]*(meToOtherPosAssists[`source_${shotType}_ast`]?.value || 0);
          if (phase == 0) totalWeight = totalWeight + meToOtherAssistWeight;
          if (phase == 1) adjStat(mutMeToOtherPosAssists[`source_${shotType}_ast`], (meToOtherAssistWeight*toPctToUse)/(totalWeight || 1));
          //if (phase == 1) console.log(`[${pos}][${posIndex}] (to%=[${toPctToUse}]): adj me->other [ast/${shotType}] by [${meToOtherAssistWeight}] -> [${toPctToUse*meToOtherAssistWeight/totalWeight}]`)
        });

      });
    });
  }

  /** Uncategorized TOs, for housekeeping purposes - half court, scramble, transition */
  static calcTeamHalfCourtTos(players: IndivStatSet[], teamStats: TeamStatSet): [ number, number, number] {
    //(7..half-court, 6..scramble/trans)

    const teamTotalTos = (teamStats.total_off_to?.value || 0) 
      - _.sumBy(players, player => (player.total_off_to?.value || 0));
    const teamScrambleTos = (teamStats.total_off_scramble_to?.value || 0)
      - _.sumBy(players, player => (player.total_off_scramble_to?.value || 0));
    const teamTransitionTos = (teamStats.total_off_trans_to?.value || 0)
      - _.sumBy(players, player => (player.total_off_trans_to?.value || 0));

    return [ teamTotalTos -  teamScrambleTos - teamTransitionTos, teamScrambleTos, teamTransitionTos ];
  }

  /** Converts a player-grouped assist network into a positional category grouped one
   *  Returns an array of stats for each of: ballhandler, guard, wing (ie size <= 3)
   *  (note that the interaction between this logic and the calling code in XxxPlayTypeDiagView is currently a bit tangled)
   * (if mainPlayer is undefined then is called for team calcs)
   */
  static buildPosCategoryAssistNetwork(
    playerAssistNetwork: Array<Record<string, any>>,
    rosterStatsByCode: Record<string, any>,
    mainPlayer: Record<string, any> | number | undefined
  ): Array<Record<string, any>> {
    // Build main player's positional category:
    // (this is just for injecting examples - if you don't want examples just set mainPlayer to undefined)
    const mainPlayerCats = !_.isNil(mainPlayer) ? (
      _.isNumber(mainPlayer) ?
        [ { order: mainPlayer, score: 0 }  ]
        :
        _.orderBy(PlayTypeUtils.buildPosFamily(mainPlayer.role, mainPlayer.posClass).flatMap((catScore, ix) => {
         return catScore > 0 ? [ { order: ix, score: catScore } ] : [];
       }), ["score"], ["desc"])
    ) : undefined;

    return _.chain(playerAssistNetwork).flatMap(playerStats => {
      const playerCode = playerStats.code!;
      const role = rosterStatsByCode[playerCode]?.role || "??";
      const posClass = rosterStatsByCode[playerCode]?.posClass || [];
      return PlayTypeUtils.buildPosFamily(role, posClass).flatMap((catScore, ix) => {
        return catScore > 0 ? [ {
          ...playerStats,
          title: null, order: ix,
          score: catScore
        } ] : [];
      }) as Array<any>;
    }).concat([
      { order: 0, score: 0 }, { order: 1, score: 0 }, { order: 2, score: 0 }
    ]).groupBy(
      info => info.order
    ).values().map(infos => { //(NOTE: infos includes the empty dummy entry that just ensures we have one obj for every position)
      const mutableObj = {
        order: infos[0]!.order
      } as Record<string, any>;

      // Weighting inv vs shot type:
      const efgWeightInvsTarget = shotTypes.map(shotType => {
        return 1.0 /
          (_.reduce(infos, (acc, statSet) =>
            acc + statSet.score*(statSet[`target_${shotType}_ast`]?.value || 0), 0
          ) || 1);
      });
      // Aggregate the different stats across the different player weights vs the category
      _.transform(infos, (acc, statSet) => {
        const maybeFill = (key: string, examples?: Array<string>) => {
          if (!acc[key]) {
            acc[key] = { value: 0, extraInfo: examples };
          }
        }
        // handle usages, (AST)
        targetSource.forEach(loc => {
          const sourceNotTarget = (loc == "source");
          const weight = statSet.score;

          // Handle misc sums:
          const miscStats = sourceNotTarget ? [ "source_sf", "source_to" ] : [ "target_ast" ];
          miscStats.forEach(statKey => {
            const statVal = statSet[statKey];
            if (statVal?.value) { // (do nothing on 0)
              maybeFill(statKey);
              acc[statKey].value! += weight * statVal.value;
            }
          });

          // Handle shot types
          shotTypes.forEach((shotType, ix) => {
            //(bit horrid but everything is reversed when doing pos vs pos calcs)
            const playTypeWayRound = _.isNumber(mainPlayer) ? !sourceNotTarget : sourceNotTarget;

            // Inject examples
            const playTypeExamples = mainPlayerCats ? _.chain(mainPlayerCats).map(catInfo => {
              const exampleKey = playTypeWayRound ?
                `${PosFamilyNames[catInfo.order!]}_${shotType}_${PosFamilyNames[statSet.order!]}` :
                `${PosFamilyNames[statSet.order!]}_${shotType}_${PosFamilyNames[catInfo.order!]}`;

              return PlayTypeUtils.playTypesByFamily[exampleKey]?.examples || [];
            }).flatten().uniq().value() : undefined;

            const statKey = `${loc}_${shotType}_ast`;
            const statVal = statSet[statKey];

            if (statVal?.value) { // (do nothing on 0)
              maybeFill(statKey, playTypeExamples);
              acc[statKey].value! += weight * statVal.value;
            }
          });
        });

        // Handle weighted averages (eFG)
        shotTypes.forEach((shotType, ix) => {
          //TODO: weights are still wrong here in x-player case
          const weight = statSet.score;

          const statKey = `target_${shotType}_efg`;
          const statVal = statSet[statKey];
          if (statVal?.value) { // (do nothing on 0)
            maybeFill(statKey);
            const eFgWeight = (statSet[`target_${shotType}_ast`]?.value || 0) * efgWeightInvsTarget[ix]!
            acc[statKey].value! += weight * statVal.value * eFgWeight;
          }
        });
      }, mutableObj);

      return mutableObj;
    }).orderBy(["order"], ["asc"]).value();
  }

  /////////////////////////////////////////////////////

  // Different ways of represening play types

  static buildPlayTypesLookup = _.memoize(() => {
    return _.chain(PlayTypeUtils.playTypesByFamily).values().map(o => {
      return [ o.examples.join(":"), o.topLevel ];
    }).concat([
      [ "trans", { "Transition": 1.0 } as Record<TopLevelPlayTypes, number> ],
      [ "scramble", { "Put-Back": 1.0 }  as Record<TopLevelPlayTypes, number> ],
    ])
    .fromPairs().value() as Record<string, Record<TopLevelPlayTypes, number>>;
  });

  /** PlayerFamily_ShotType_([source|target]_AssisterFamily)? */
  private static playTypesByFamily: 
    Record<string, { source: string, examples: string[], topLevel: Record<TopLevelPlayTypes, number>}> = 
  {
    // 1] Ball handler:

    // 1.0] SF
    "ballhandler_sf": {
      source: "Shooting Foul",
      examples: [ "fouled driving to the rim", "fouled in the bonus", "fouled cutting" ],
      topLevel: { "Rim Attack": 0.8, "Cut": 0.2  }
    },

    // 1.1] 3P

    "ballhandler_3p": {
      source: "3P Unassisted",
      examples: [ "dribble jumper off misc action", "off ball-screen", "dribble jumper off ISO" ],
      topLevel: { "Dribble Jumper": 1.0 }
    },
    "ballhandler_3p_ballhandler": {
      source: "3P Assisted by a ballhandler",
      target: "Pass to ballhandler for 3P",
      examples: [ "drive-and-kick", "hockey assist after defense collapses inside", "misc action" ],
      topLevel: { "Attack & Kick": 1.0 }
    },
    "ballhandler_3p_wing": {
      source: "3P Assisted by a wing",
      target: "Pass to ballhandler for 3P",
      examples: [ "slash-and-kick", "hockey assist after defense collapses inside", "misc action" ],
      topLevel: { "Attack & Kick": 1.0 }
    },
    "ballhandler_3p_big": {
      source: "3P Assisted by frontcourt",
      target: "Pass to ballhandler for 3P",
      examples: [ "kick-out after an ORB", "pass out of a post-up" ],
      topLevel: { "Post-Up Collapse": 1.0 }
    },

    // 1.2] mid

    "ballhandler_mid": {
      source: "Mid Range Unassisted",
      examples: [ "drive and pull-up off ball-screen or ISO", "misc action" ],
      topLevel: { "Rim Attack": 0.6, "Spread": 0.4 } 
    },
    "ballhandler_mid_ballhandler": {
      source: "Mid Range Assisted by ballhandler",
      target: "Pass to ballhandler for mid-range",
      examples: [ "spread offense", "misc action" ],
      topLevel: { "Spread": 1.0 } 
    },
    "ballhandler_mid_wing": {
      source: "Mid Range Assisted by wing",
      target: "Pass to ballhandler for mid-range",
      examples: [ "spread offense", "misc action" ],
      topLevel: { "Spread": 1.0 } 
    },
    "ballhandler_mid_big": {
      source: "Mid Range Assisted from frontcourt",
      target: "Pass to ballhandler for mid-range",
      examples: [ "(usually sub-optimal) pass out of a post-up" ],
      topLevel: { "Post-Up Collapse": 1.0 } 
    },

    // 1.3] rim

    "ballhandler_rim": {
      source: "Drive Unassisted",
      examples: [ "attacks the rim off pick-and-roll", "ISO" ],
      topLevel: { "Rim Attack": 1.0 } 
    },
    "ballhandler_rim_ballhandler": {
      source: "Layup Assisted by ballhandler",
      target: "Pass to ballhandler for a layup",
      examples: [ "cut" ],
      topLevel: { "Cut": 1.0 } 
    },
    "ballhandler_rim_wing": {
      source: "Layup Assisted by wing",
      target: "Pass to ballhandler for a layup",
      examples: [ "cut" ],
      topLevel: { "Cut": 1.0 } 
    },
    "ballhandler_rim_big": {
      source: "Layup Assisted by frontcourt",
      target: "Pass to ballhandler for a layup",
      examples: [ "cut" ],
      topLevel: { "Cut": 1.0 } 
    },

    // 2] Wing:

    // 2.0] SF
    "wing_sf": {
      source: "Shooting Foul",
      examples: [ "fouled slashing to the rim", "fouled in the bonus", "fouled cutting" ],
      topLevel: { "Rim Attack": 0.8, "Cut": 0.2  }
    },

    // 2.1] 3P

    "wing_3p": {
      source: "3P Unassisted",
      examples: [ "off ball-screen", "dribble jumper off misc action", "dribble jumper off ISO" ],
      topLevel: { "Dribble Jumper": 1.0 }
    },
    "wing_3p_ballhandler": {
      source: "3P Assisted by a ballhandler",
      target: "Pass to wing for 3P",
      examples: [ "drive-and-kick", "hockey assist after defense collapses inside", "misc action" ],
      topLevel: { "Attack & Kick": 1.0 }
    },
    "wing_3p_wing": {
      source: "3P Assisted by a wing",
      target: "Pass to wing for 3P",
      examples: [ "slash-and-kick", "hockey assist after defense collapses inside", "misc action" ],
      topLevel: { "Attack & Kick": 1.0 }
    },
    "wing_3p_big": {
      source: "3P Assisted by frontcourt",
      target: "Pass to wing for 3P",
      examples: [ "kick-out after an ORB", "pass out of a post-up" ],
      topLevel: { "Post-Up Collapse": 1.0 } 
    },

    // 2.2] mid

    "wing_mid": {
      source: "Mid Range Unassisted",
      examples: [ "drive and pull-up off ball-screen or ISO", "misc action" ],
      topLevel: { "Rim Attack": 0.6, "Spread": 0.4 } 
    },
    "wing_mid_ballhandler": {
      source: "Mid Range Assisted by ballhandler",
      target: "Pass to wing for mid-range",
      examples: [ "spread offense", "misc action", "zone buster" ],
      topLevel: { "Spread": 1.0 } 
    },
    "wing_mid_wing": {
      source: "Mid Range Assisted by wing",
      target: "Pass to wing for mid-range",
      examples: [ "spread offense, misc action", "zone buster" ],
      topLevel: { "Spread": 1.0 } 
    },
    "wing_mid_big": {
      source: "Mid Range Assisted from frontcourt",
      target: "Pass to wing for mid-range",
      examples: [ "(usually sub-optimal) pass out of a post-up" ],
      topLevel: { "Post-Up Collapse": 1.0 } 
    },

    // 2.3] rim

    "wing_rim": {
      source: "Drive Unassisted",
      examples: [ "attacks the rim off pick-and-roll", "ISO" ],
      topLevel: { "Rim Attack": 1.0 } 
    },
    "wing_rim_ballhandler": {
      source: "Layup Assisted by ballhandler",
      target: "Pass to wing for a layup",
      examples: [ "cut" ],
      topLevel: { "Cut": 1.0 } 
    },
    "wing_rim_wing": {
      source: "Layup Assisted by wing",
      target: "Pass to wing for a layup",
      examples: [ "cut" ],
      topLevel: { "Cut": 1.0 } 
    },
    "wing_rim_big": {
      source: "Layup Assisted by frontcourt",
      target: "Pass to wing for a layup",
      examples: [ "cut" ],
      topLevel: { "Cut": 1.0 } 
    },

    // 3] Frontcourt:

    // 2.0] SF
    "big_sf": {
      source: "Shooting Foul",
      examples: [ "fouled on a rebound", "fouled posting up", "fouled rolling", "fouled in the bonus", "fouled cutting" ],
      topLevel: { "Post-Up": 0.7, "Cut & Roll": 0.3 } 
    },

    // 3.1] 3P

    "big_3p": {
      source: "3P Unassisted",
      examples: [ "dribble jumper off misc action", "dribble jumper off ISO", "off ball-screen" ],
      topLevel: { "Dribble Jumper": 1.0 } 
    },
    "big_3p_ballhandler": {
      source: "3P Assisted by a ballhandler",
      target: "Pass to frontcourt for 3P",
      examples: [ "pick-and-pop", "misc action" ],
      topLevel: { "Pick & Pop": 1.0 } 
    },
    "big_3p_wing": {
      source: "3P Assisted by a wing",
      target: "Pass to frontcourt for 3P",
      examples: [ "pick-and-pop", "misc action" ],
      topLevel: { "Pick & Pop": 1.0 } 
    },
    "big_3p_big": {
      source: "3P Assisted by frontcourt",
      target: "Pass to frontcourt for 3P",
      examples: [ "kick-out after an ORB", "pass out of a post-up" ],
      topLevel: { "Post-Up Collapse": 1.0 } 
    },

    // 3.2] mid

    "big_mid": {
      source: "Mid Range Unassisted",
      examples: [ "high post-up", "ISO", "misc action" ],
      topLevel: { "Post-Up": 1.0 } 
    },
    "big_mid_ballhandler": {
      source: "Mid Range Assisted by ballhandler",
      target: "Pass to frontcourt for mid-range",
      examples: [ "high post-up", "spread offense", "misc action" ],
      topLevel: { "Post-Up": 1.0 } 
    },
    "big_mid_wing": {
      source: "Mid Range Assisted by wing",
      target: "Pass to frontcourt for mid-range",
      examples: [ "high post-up", "spread offense", "misc action" ],
      topLevel: { "Post-Up": 1.0 } 
    },
    "big_mid_big": {
      source: "Mid Range Assisted from frontcourt",
      target: "Pass to frontcourt for mid-range",
      examples: [ "high-low action" ],
      topLevel: { "High Low": 1.0 } 
    },

    // 3.3] rim

    "big_rim": {
      source: "Layup Unassisted",
      examples: [ "post-up", "ISO" ],
      topLevel: { "Post-Up": 1.0 } 
    },
    "big_rim_ballhandler": {
      source: "Layup Assisted by ballhandler",
      target: "Pass to frontcourt for layup",
      examples: [ "roll", "cut", "sometimes post-up" ],
      topLevel: { "Cut & Roll": 1.0 } 
    },
    "big_rim_wing": {
      source: "Layup Assisted by wing",
      target: "Pass to frontcourt for layup",
      examples: [ "roll", "cut", "sometimes post-up" ],
      topLevel: { "Cut & Roll": 1.0 } 
    },
    "big_rim_big": {
      source: "Layup Assisted by frontcourt",
      target: "Pass to frontcourt for layup",
      examples: [ "high-low action" ],
      topLevel: { "High Low" : 0.8, "Cut & Roll": 0.2 } 
    }
  } as Record<string, any>;

}
