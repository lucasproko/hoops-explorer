import _, { forEach } from "lodash";

import { OverrideUtils } from "./OverrideUtils";
import { StatModels, PureStatSet, PlayerCodeId, PlayerCode, PlayerId, Statistic, TeamStatSet, LineupStatSet, IndivStatSet } from "../StatModels";
import { LineupUtils } from './LineupUtils';

/** Whether to calculate the luck adjustment over the baseline or the entire season
    Baseline will be subject to more noise but enables luck to be reduced in cases
    where you suspect the baseline is more representative (eg injuries)
*/
export type LuckAdjustmentBaseline = "baseline" | "season";

export type OffLuckShotInfo = {
  shot_info_ast_3pm: number,
  shot_info_early_3pa: number,
  shot_info_unast_3pm: number,
  shot_info_unknown_3pM: number,
  shot_info_total: number
};

export type OffLuckAdj3P = {
  base3P: number,
  unassisted3P: number,
  assisted3P: number,
  expected3P?: number
};

export type OffLuckShotTypeAndAdj3P = OffLuckShotInfo & OffLuckAdj3P;

/** Holds all the info required to calculate and explain the delta when luck is regressed away */
export type OffLuckAdjustmentDiags = {
  avgEff: number,
  samplePoss: number,
  sample3P: number,
  sample3PA: number,
  base3PA: number,
  player3PInfo: Record<string, OffLuckShotTypeAndAdj3P>,
  sampleBase3P: number,
  regress3P: number,

  // Effects:
  sampleOff3PRate: number,
  sampleOffFGA: number,
  sampleOffOrb: number,

  sampleOffEfg: number,
  sampleOffPpp: number,
  sampleDefSos: number,

  delta3P: number,
  deltaOffEfg: number,
  deltaMissesPct: number,
  deltaOffPppNoOrb: number,

  deltaOffOrbFactor: number,
  deltaPtsOffMisses: number,
  deltaOffPpp: number,
  deltaOffAdjEff: number,
};

/** Holds all the info required to calculate and explain the delta when luck is regressed away */
export type DefLuckAdjustmentDiags = {
  avgEff: number,
  /** The % of the delta between 3PD and 3P SoS  that is luck */
  luckPct: number,

  /** Opponents' 3P% against the team */
  baseDef3P: number,
  /** Opponents' 3P% over the season */
  baseDef3PSos: number,
  basePoss: number,
  /** The ability of the team to adjust the opponents' 3P% over the season */
  base3PSosAdj: number,

  // Same stats but over the sample in question: on/off/baseline
  sampleDef3P: number,
  sampleDef3PSos: number,
  samplePoss: number
  sample3PSosAdj: number,

  // (We'll need these stats later)
  sampleDefEfg: number,
  sampleDefPpp: number,
  sampleOffSos: number,
  sampleDef3PRate: number,
  sampleDefFGA: number,
  sampleDefOrb: number,

  /** The weighted sum of the two 3PD adjustments */
  avg3PSosAdj: number,
  /** The final number */
  adjDef3P: number,

  // The effect:
  delta3P: number,
  deltaDefEfg: number,
  /** The delta in raw Pts/100 not including the ORB change */
  deltaDefPppNoOrb: number,
  deltaMissesPct: number,
  deltaDefOrbFactor: number,
  deltaPtsOffMisses: number,
  deltaDefPpp: number,
  deltaDefAdjEff: number
};

/** Contains logic to help other stats modules adjust for luck */
export class LuckUtils {

  //TODO: there is a nasty problem with the way we're aggregating luck across lineups.
  // Imagine you have 2 lineups, a and b (equal size say), with luck adjsted 3P(a) and 3P(b)
  // comparing with the aggregation of a+b, 3P(a+b) is regressed by 3PA(a+b) vs 3PA(base)
  // The weighted average of 3P(a) and 3P(b) is regressed by 0.5*(3P(a)+3(b)) vs 3PA(base)
  // ie 0.5*3P(a+b) vs 3PA(base)

  static readonly lineupShotInfoFields = [
    "ast_3pm", "unast_3pm", "early_3pa", "unknown_3pM"
  ];
  static readonly lineupAggregatedShotInfoFields = LuckUtils.lineupShotInfoFields.map(i => `shot_info_${i}`);

  /** Set of all the fields that are affected by luck adjustments */
  static readonly affectedFieldSet = new Set([
    "off_adj_ppp", "off_ppp", "off_efg", "off_3p",
    "def_adj_ppp", "def_ppp", "def_efg", "def_3p",
    "oppo_def_3p"
  ]);
  /** List of the partial fieldnames affected by luck adjustments */
  static readonly affectedPartialFieldnames = [
    "adj_ppp", "ppp", "efg", "3p"
  ];

  /** Calculate the offensive luck adjustment for a player */
  static readonly calcOffPlayerLuckAdj = (
    samplePlayer: IndivStatSet, basePlayer: IndivStatSet,
    avgEff: number
  ) => {
    // The team calc basically works fine here, apart from ORBs, which we'll ignore
    return LuckUtils.calcOffTeamLuckAdj(
      samplePlayer, [ samplePlayer ], basePlayer, { [basePlayer.key]: basePlayer }, avgEff
    );
  }

 /** Calculate the offensive luck adjustment for a team ...samplePlayers==players.map(_.on/off/baseline) */
  static readonly calcOffTeamLuckAdj = (
    sampleTeam: TeamStatSet | LineupStatSet | IndivStatSet, samplePlayers: Array<IndivStatSet>,
    baseTeam: TeamStatSet | LineupStatSet | IndivStatSet, basePlayersMap: Record<PlayerId, IndivStatSet>,
    avgEff: number
  ) => {

    // Number of 3P shots taken in sample

    const samplePoss = LuckUtils.get(sampleTeam?.off_poss, 0);
    const sample3P = LuckUtils.get(sampleTeam?.off_3p, 0);
    const sample3PA = LuckUtils.get(sampleTeam?.total_off_3p_attempts, 0);
    const base3PA = LuckUtils.get(baseTeam?.total_off_3p_attempts, 0);

    // Loop over sample roster - lookup into base to get 3PA shots 3P%

    // If we don't have roster but we do have lineup shot info then use that instead
    const deserializeLineupSum = (n: Statistic | undefined) => {
      return { value: [ 0, 1, 2, 3, 4 ].map(index => {
        return ((n?.value || 0)/Math.pow(2, 10*index)) & 0x3FF;
      }) };
    }
    const playerShotInfo = 
      _.transform(LuckUtils.lineupAggregatedShotInfoFields, (acc, field) => {
        if (sampleTeam[field]) {
          const toAdd = deserializeLineupSum(sampleTeam[field]); //(exists and is >0)
          acc[field] = toAdd.value;
          acc.total = _.zipWith(toAdd.value, acc.total as number[], (a, b) => a + b);
          acc.hasLineupInfo = acc.hasLineupInfo || ((sampleTeam[field].value || 0) > 0);
        }
      }, { hasLineupInfo: false, total: [0, 0, 0, 0, 0] } as Record<string, any>);
    
    var varTotal3PA = 0.0;
    var varTotal3P = 0.0;

    const buildShotLineupInfo = (basePlayerStats: IndivStatSet, index: number, baseShotInfo: OffLuckShotInfo) => {
      return _.transform(LuckUtils.lineupAggregatedShotInfoFields, (acc, field) => {
        acc[field] = playerShotInfo?.[field]?.[index] || 0;
      }, {
        shot_info_total: playerShotInfo.total[index] || 0,
        ...LuckUtils.buildAdjusted3P(basePlayerStats, baseShotInfo)
      } as Record<string, number>)
    };
    const player3PInfo = _.chain(samplePlayers).flatMap((player: IndivStatSet, index: number) => {
      const basePlayerStats = basePlayersMap[player.key];
      const baseShotInfo = LuckUtils.buildShotInfo(basePlayersMap[player.key] || player); //(to calc buildAdjusted3P)
      const playerInfo = (((index < 5) && playerShotInfo.hasLineupInfo && basePlayerStats) ? {
        ...buildShotLineupInfo(basePlayerStats, index, baseShotInfo)
      } : {
        ...(LuckUtils.buildShotInfo(player)),
        ...LuckUtils.buildAdjusted3P(basePlayerStats || {}, baseShotInfo)        
      }) as OffLuckShotTypeAndAdj3P;

      if (playerInfo) {
        //(we use the sample size but the expected 3P% based on base3P% and sample distribution)        
        varTotal3PA += playerInfo.shot_info_total;
        const totalTimes3P = LuckUtils.buildExp3P(playerInfo)
        playerInfo.expected3P = totalTimes3P/(playerInfo.shot_info_total || 1)
        varTotal3P += totalTimes3P;

        return (playerInfo.shot_info_total > 0) ? //(don't bother with any players who didn't take a 3P shot)
          [ [ player.key, playerInfo  ] ] : [];
        } else {
          return []; //(player not in this lineup)
        }

    }).sortBy((pV: any[]) => -1*(pV?.[1]?.shot_info_total || 0)).fromPairs().value();

    // Calculate average weight of 3P% weighted by 3PA

    const sampleBase3P = varTotal3P / (varTotal3PA || 1);

    // Regress vs actual 3P%

    const total3PA = (sample3PA + base3PA) || 1;
    const regress3P = (sampleBase3P*base3PA + sample3P*sample3PA)/total3PA;

    // Calculate effects similarly to calcDefTeamLuckAdj
    const sampleOff3PRate = LuckUtils.get(sampleTeam?.off_3pr, 0);
    const sampleOffFGA = LuckUtils.get(sampleTeam?.total_off_2p_attempts, 0) + LuckUtils.get(sampleTeam?.total_off_3p_attempts, 0);
    const rawSampleOffOrb = LuckUtils.get(sampleTeam?.off_orb, 0);
    const sampleOffOrb = rawSampleOffOrb > 0.66 ? 0.66 : rawSampleOffOrb;

    const sampleOffEfg = LuckUtils.get(sampleTeam?.off_efg, 0);
    const sampleOffPpp = LuckUtils.get(sampleTeam?.off_ppp, 0);
    const sampleDefSos = LuckUtils.get(sampleTeam?.def_adj_opp, 0);

    // const threePointRate = sampleDef3PA/((sampleDef3PA + sampleDef2PA) || 1)
    const delta3P = regress3P - sample3P;
    const deltaOffEfg = 1.5*delta3P*sampleOff3PRate;
    const deltaMissesPct = -1*delta3P*sampleOff3PRate;
    const deltaOffPppNoOrb = 200*deltaOffEfg*sampleOffFGA/(samplePoss || 1);
    // pts_off_misses = delta_misses*ORB*(ppp_no_orb + pts_off_misses)
    // ie pts_off_misses = delta_misses*ORB*ppp_no_orb/(1 - delta_misses*ORB)
    const deltaOffOrbFactor = deltaMissesPct*sampleOffOrb/(1 - deltaMissesPct*sampleOffOrb);
    const deltaPtsOffMisses = deltaOffOrbFactor*(sampleOffPpp + deltaOffPppNoOrb);
    const deltaOffPpp = deltaOffPppNoOrb + deltaPtsOffMisses;
    const deltaOffAdjEff = deltaOffPpp*avgEff/(sampleDefSos || 1);

    return {
      avgEff,
      samplePoss,
      sample3P,
      sample3PA,
      base3PA,
      player3PInfo,
      sampleBase3P,
      regress3P,

      sampleOff3PRate, sampleOffFGA, sampleOffOrb,
      sampleOffEfg, sampleOffPpp, sampleDefSos,

      delta3P, deltaOffEfg, deltaMissesPct, deltaOffPppNoOrb,

      deltaOffOrbFactor, deltaPtsOffMisses, deltaOffPpp, deltaOffAdjEff,
    } as OffLuckAdjustmentDiags;
  };

  /** Calculate the defensive luck adjustment for a player */
  static readonly calcDefPlayerLuckAdj = (sample: IndivStatSet, base: IndivStatSet, avgEff: number) => {
    const translate = (statSet: IndivStatSet) => {
      return {
        key: sample.key,
        def_3p: {
          value: (statSet.oppo_total_def_3p_made?.value || 0)
                / (statSet.oppo_total_def_3p_attempts?.value || 1)
        },
        def_3p_opp: statSet.oppo_def_3p_opp,
        def_poss: statSet.oppo_total_def_poss,
      } as IndivStatSet;
    };
    // We really just want the 3P delta:
    return LuckUtils.calcDefTeamLuckAdj(
      translate(sample), translate(base), avgEff
    );
  };

  /** Calculate the defensive luck adjustment for a team */
  static readonly calcDefTeamLuckAdj = (
    sample: IndivStatSet | TeamStatSet | LineupStatSet, base: IndivStatSet | TeamStatSet | LineupStatSet, avgEff: number
  ) => {
    const get = (maybeOld: any, fallback: number) => {
      // Uses the non-adjusted luck number if present
      return (_.isNil(maybeOld?.old_value) ? maybeOld?.value : maybeOld?.old_value) || fallback;
    }
    const luckPct = 0.66;

    //TODO: if we don't have 3PSos then just regress
    //TODO: also add a test for this case

    const baseDef3P = get(base?.def_3p, 0);
    const baseDef3PSos = _.isNil(base?.def_3p_opp?.value) ? baseDef3P : 0.01*get(base?.def_3p_opp, 0); //(normalize to %)
    const basePoss = get(base?.def_poss, 0);
    const base3PSosAdj = (1 - luckPct)*(baseDef3P - baseDef3PSos);

    const sampleDef3P = get(sample?.def_3p, 0);
    const sampleDef3PSos = _.isNil(sample?.def_3p_opp?.value) ? sampleDef3P : 0.01*get(sample?.def_3p_opp, 0); //(normalize to %)
    const samplePoss = get(sample?.def_poss, 0);
    const sample3PSosAdj = (1 - luckPct)*(sampleDef3P - sampleDef3PSos);

    const sampleDefEfg = get(sample?.def_efg, 0);
    const sampleDefPpp = get(sample?.def_ppp, 0);
    const sampleOffSos = get(sample?.off_adj_opp, 0);

    const avg3PSosAdj = (samplePoss*sample3PSosAdj + basePoss*base3PSosAdj)/((samplePoss + basePoss) || 1);
    const adjDef3P = sampleDef3PSos + avg3PSosAdj;

    const sampleDef3PRate = get(sample?.def_3pr, 0);
    const sampleDefFGA = get(sample?.total_def_2p_attempts, 0) + get(sample?.total_def_3p_attempts, 0);
    const rawSampleDefOrb = get(sample?.def_orb, 0);
    const sampleDefOrb = rawSampleDefOrb > 0.66 ? 0.66 : rawSampleDefOrb;
    //
    // const threePointRate = sampleDef3PA/((sampleDef3PA + sampleDef2PA) || 1)
    const delta3P = adjDef3P - sampleDef3P;
    const deltaDefEfg = 1.5*delta3P*sampleDef3PRate;
    const deltaMissesPct = -1*delta3P*sampleDef3PRate;
    const deltaDefPppNoOrb = 200*deltaDefEfg*sampleDefFGA/(samplePoss || 1);
    // pts_off_misses = delta_misses*ORB*(ppp_no_orb + pts_off_misses)
    // ie pts_off_misses = delta_misses*ORB*ppp_no_orb/(1 - delta_misses*ORB)
    const deltaDefOrbFactor = deltaMissesPct*sampleDefOrb/(1 - deltaMissesPct*sampleDefOrb);
    const deltaPtsOffMisses = deltaDefOrbFactor*(sampleDefPpp + deltaDefPppNoOrb);
    const deltaDefPpp = deltaDefPppNoOrb + deltaPtsOffMisses;
    const deltaDefAdjEff = deltaDefPpp*avgEff/(sampleOffSos || 1);

    return {
      avgEff, luckPct,
      baseDef3P, baseDef3PSos, basePoss,
      base3PSosAdj,

      sampleDef3P, sampleDef3PSos, samplePoss,
      sample3PSosAdj,

      sampleDefEfg, sampleDefPpp, sampleOffSos,
      sampleDef3PRate, sampleDefFGA, sampleDefOrb,

      avg3PSosAdj, adjDef3P,

      delta3P, deltaDefEfg,
      deltaDefPppNoOrb, deltaMissesPct, deltaDefOrbFactor, deltaPtsOffMisses,
      deltaDefPpp, deltaDefAdjEff
    } as DefLuckAdjustmentDiags;

  };

  /** Mutates (in a reversible way) the team stats with luck adjustments */
  static readonly injectLuck = (
    mutableStats: TeamStatSet | IndivStatSet | LineupStatSet,
    offLuck: OffLuckAdjustmentDiags | undefined,
    defLuck: DefLuckAdjustmentDiags | undefined
  ) => {
    /** Builds a delta object */
    const maybeDelta = (val: number | undefined) => _.isNil(val) ? undefined : { delta: val };

    // Offense - 3P

    OverrideUtils.overrideMutableVal(mutableStats, "off_3p",
      maybeDelta(offLuck?.delta3P), "Luck adjusted"
    );

    // Offense - derived 4 factors and efficiency

    OverrideUtils.overrideMutableVal(mutableStats, "off_efg",
      maybeDelta(offLuck?.deltaOffEfg), "Adjusted from Off 3P%"
    );

    OverrideUtils.overrideMutableVal(mutableStats, "off_ppp",
      maybeDelta(offLuck?.deltaOffPpp), "Adjusted from Off 3P%"
    );

    OverrideUtils.overrideMutableVal(mutableStats, "off_adj_ppp",
      maybeDelta(offLuck?.deltaOffAdjEff), "Adjusted from Off 3P%"
    );

    // Defense - 3P

    OverrideUtils.overrideMutableVal(mutableStats, "def_3p",
      defLuck?.adjDef3P, "Luck adjusted"
    );

    // Defense - derived 4 factors and efficiency

    OverrideUtils.overrideMutableVal(mutableStats, "def_efg",
      maybeDelta(defLuck?.deltaDefEfg), "Adjusted from Def 3P%"
    );

    OverrideUtils.overrideMutableVal(mutableStats, "def_ppp",
      maybeDelta(defLuck?.deltaDefPpp), "Adjusted from Def 3P%"
    );

    OverrideUtils.overrideMutableVal(mutableStats, "def_adj_ppp",
      maybeDelta(defLuck?.deltaDefAdjEff), "Adjusted from Def 3P%"
    );

    // Player defense

    if (mutableStats.oppo_total_def_3p_made) { //(use this to tell us if it's a player stat not a team one)
      // Don't have oppo_3p_def so we'll calculate it every time
      // (and pretend it was a raw value from the query)
      mutableStats.oppo_def_3p = {
        value: (mutableStats.oppo_total_def_3p_made?.value || 0)
              / (mutableStats.oppo_total_def_3p_attempts?.value || 1)
      };
      OverrideUtils.overrideMutableVal(mutableStats, "oppo_def_3p",
        defLuck?.adjDef3P, "Luck adjusted"
      );
    }

    // Net

    const pppAdjMargin = _.isNil(defLuck?.deltaDefAdjEff) && _.isNil(offLuck?.deltaOffAdjEff) ? undefined
      :  (offLuck?.deltaOffAdjEff || 0) - (defLuck?.deltaDefAdjEff || 0);

    const pppMargin = _.isNil(defLuck?.deltaDefPpp) && _.isNil(offLuck?.deltaOffPpp) ? undefined
      :  (offLuck?.deltaOffPpp || 0) - (defLuck?.deltaDefPpp || 0);

    OverrideUtils.overrideMutableVal(mutableStats, "off_net",
      maybeDelta(pppAdjMargin), "Adjusted from Off 3P% and Def 3P%"
    );
    OverrideUtils.overrideMutableVal(mutableStats, "off_raw_net",
      maybeDelta(pppMargin), "Adjusted from Off 3P% and Def 3P%"
    );

  };

  // Some utils

  /** Util - Uses the non-adjusted luck number if present */
  static readonly get = (maybeOld: Statistic, fallback: number) => {
    return (_.isNil(maybeOld?.old_value) ? maybeOld?.value : maybeOld?.old_value) || fallback;
  }

  /** Builds the different shot types when you don't have the lineup info */
  static readonly buildShotInfo = (p: IndivStatSet) => {
    //"ast_3pm", "unast_3pm", "early_3pa", "unknown_3pM"

    const shot_info_ast_trans_3pm = p.total_off_trans_3p_ast?.value || 0; //(includes some early shots)
    const shot_info_unast_trans_3pm = Math.max((p.total_off_trans_3p_made?.value || 0) - shot_info_ast_trans_3pm, 0);
    const shot_info_ast_3pm = p.total_off_3p_ast?.value || 0;
    const shot_info_early_3pa = Math.max((p.total_off_trans_3p_attempts?.value || 0) - shot_info_ast_trans_3pm, 0);
    const shot_info_unast_3pm = Math.max(
      (p.total_off_3p_made?.value || 0) - shot_info_ast_3pm - shot_info_unast_trans_3pm, 0
    );
    const shot_info_total = p.total_off_3p_attempts?.value || 0;
    const shot_info_unknown_3pM = Math.max(
      shot_info_total - shot_info_ast_3pm - shot_info_early_3pa - shot_info_unast_3pm
    )
    return {
      shot_info_ast_3pm,
      shot_info_early_3pa,
      shot_info_unast_3pm,
      shot_info_unknown_3pM,
      shot_info_total
    } as OffLuckShotInfo;
  };
  /** Calculates approx unassisted/assisted 3P (p and baseShotInfo should be based on the biggest sample available, normally NOT the sample) */
  static readonly buildAdjusted3P = (p: IndivStatSet, baseShotInfo: OffLuckShotInfo) => {
    const base3P = LuckUtils.get(p?.off_3p, 0);
    // Can't use off_3p_ast because some of the transition 3PAs are unassisted makes, so we just use non-early ast%
    const baseAssistPct = baseShotInfo.shot_info_ast_3pm/((baseShotInfo.shot_info_ast_3pm + baseShotInfo.shot_info_unast_3pm) || 1);

    const weight = 0.06; // (we estimate the average diff between assisted and unassisted 3P% as 6%)
    return {
      base3P,
      unassisted3P: base3P - baseAssistPct*weight,
      assisted3P: base3P + (1 - baseAssistPct)*weight,
    } as OffLuckAdj3P;
  }
  /** Returns (3P%*total 3P) */
  static readonly buildExp3P = (info: OffLuckShotTypeAndAdj3P) => {
    return info.shot_info_ast_3pm*info.assisted3P + info.shot_info_unast_3pm*info.unassisted3P
            + (info.shot_info_early_3pa + info.shot_info_unknown_3pM)*info.base3P;
  };

   
};
