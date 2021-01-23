import _ from "lodash";

import { OverrideUtils } from "./OverrideUtils"

/** Whether to calculate the luck adjustment over the baseline or the entire season
    Baseline will be subject to more noise but enables luck to be reduced in cases
    where you suspect the baseline is more representative (eg injuries)
*/
export type LuckAdjustmentBaseline = "baseline" | "season";

/** Holds all the info required to calculate and explain the delta when luck is regressed away */
export type OffLuckAdjustmentDiags = {
  avgEff: number,
  samplePoss: number,
  sample3P: number,
  sample3PA: number,
  base3PA: number,
  player3PInfo: Record<string, { sample3PA: number, base3P: number }>,
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
  deltaOffAdjEff: number
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
    samplePlayer: Record<string, any>, basePlayer: Record<string, any>,
    avgEff: number
  ) => {
    // The team calc basically works fine here, apart from ORBs, which we'll ignore
    return LuckUtils.calcOffTeamLuckAdj(
      samplePlayer, [ samplePlayer ], basePlayer, { [basePlayer.key]: basePlayer }, avgEff
    );
  }

  /** Calculate the offensive luck adjustment for a team ...samplePlayers==players.map(_.on/off/baseline) */
  static readonly calcOffTeamLuckAdj = (
    sampleTeam: Record<string, any>, samplePlayers: Record<string, any>[],
    baseTeam: Record<string, any>, basePlayersMap: Record<string,any>,
    avgEff: number
  ) => {
    const get = (maybeOld: any, fallback: number) => {
      // Uses the non-adjusted luck number if present
      return (_.isNil(maybeOld?.old_value) ? maybeOld?.value : maybeOld?.old_value) || fallback;
    }

    // Number of 3P shots taken in sample

    const samplePoss = get(sampleTeam?.off_poss, 0);
    const sample3P = get(sampleTeam?.off_3p, 0);
    const sample3PA = get(sampleTeam?.total_off_3p_attempts, 0);
    const base3PA = get(baseTeam?.total_off_3p_attempts, 0);

    // Loop over sample roster - lookup into base to get 3PA shots 3P%

    var varTotal3PA = 0.0;
    var varTotal3P = 0.0;
    const player3PInfo = _.chain(samplePlayers).flatMap((player: any) => {
      const playerInfo = basePlayersMap[player.key];
      if (playerInfo) {
        //(we use the sample size but the base 3P%)
        const samplePlayer3PA = get(player.total_off_3p_attempts, 0);
        const basePlayer3P = get(basePlayersMap[player.key]?.off_3p, 0);
        varTotal3PA += samplePlayer3PA;
        varTotal3P += samplePlayer3PA*basePlayer3P;

        return (samplePlayer3PA > 0) ? //(don't bother with any players who didn't take a 3P shot)
          [ [ player.key, { sample3PA: samplePlayer3PA, base3P: basePlayer3P }  ] ] : [];
        } else {
          return []; //(player not in this lineup)
        }

    }).sortBy((pV: any[]) => -1*(pV?.[1]?.sample3PA || 0)).fromPairs().value();

    // Calculate average weight of 3P% weighted by 3PA

    const sampleBase3P = varTotal3P / (varTotal3PA || 1);

    // Regress vs actual 3P%

    const total3PA = (sample3PA + base3PA) || 1;
    const regress3P = (sampleBase3P*base3PA + sample3P*sample3PA)/total3PA;

    // Calculate effects similarly to calcDefTeamLuckAdj
    const sampleOff3PRate = get(sampleTeam?.off_3pr, 0);
    const sampleOffFGA = get(sampleTeam?.total_off_2p_attempts, 0) + get(sampleTeam?.total_off_3p_attempts, 0);
    const rawSampleOffOrb = get(sampleTeam?.off_orb, 0);
    const sampleOffOrb = rawSampleOffOrb > 0.66 ? 0.66 : rawSampleOffOrb;

    const sampleOffEfg = get(sampleTeam?.off_efg, 0);
    const sampleOffPpp = get(sampleTeam?.off_ppp, 0);
    const sampleDefSos = get(sampleTeam?.def_adj_opp, 0);

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

      deltaOffOrbFactor, deltaPtsOffMisses, deltaOffPpp, deltaOffAdjEff
    } as OffLuckAdjustmentDiags;
  };

  /** Calculate the defensive luck adjustment for a player */
  static readonly calcDefPlayerLuckAdj = (sample: Record<string, any>, base: Record<string, any>, avgEff: number) => {
    const translate = (statSet: any) => {
      return {
        def_3p: {
          value: (statSet.oppo_total_def_3p_made?.value || 0)
                / (statSet.oppo_total_def_3p_attempts?.value || 1)
        },
        def_3p_opp: statSet.oppo_def_3p_opp,
        def_poss: statSet.oppo_total_def_poss,
      };
    };
    // We really just want the 3P delta:
    return LuckUtils.calcDefTeamLuckAdj(
      translate(sample), translate(base), avgEff
    );
  };

  /** Calculate the defensive luck adjustment for a team */
  static readonly calcDefTeamLuckAdj = (sample: Record<string, any>, base: Record<string, any>, avgEff: number) => {
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
    mutableStats: Record<string, any>,
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
    OverrideUtils.overrideMutableVal(mutableStats, "def_net",
      maybeDelta(pppMargin), "Adjusted from Off 3P% and Def 3P%"
    );

  };
};
