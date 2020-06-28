import _ from "lodash";

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

  /** Calculate the offensive luck adjustment for a team ...samplePlayers==players.map(_.on/off/baseline) */
  static readonly calcOffTeamLuckAdj = (
    sampleTeam: any, samplePlayers: any[], baseTeam: any, basePlayersMap: Record<string,any>,
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
      const samplePlayer3PA = get(player?.total_off_3p_attempts, 0);
      const samplePlayer3P = get(basePlayersMap[player?.key]?.off_3p, 0);
      varTotal3PA += samplePlayer3PA;
      varTotal3P += samplePlayer3PA*samplePlayer3P;

      return (samplePlayer3PA > 0) ? //(don't bother with any players who didn't take a 3P shot)
        [ [ player?.key, { sample3PA: samplePlayer3PA, base3P: samplePlayer3P }  ] ] : [];

    }).sortBy((pV: any[]) => -1*(pV?.[1]?.sample3PA || 0)).fromPairs().value();

    // Calculate average weight of 3P% weighted by 3PA

    const sampleBase3P = varTotal3P / (varTotal3PA || 1);

    // Regress vs actual 3P%

    const total3PA = (sample3PA + base3PA) || 1;
    const regress3P = (sampleBase3P*base3PA + sample3P*sample3PA)/total3PA;

    // Calculate effects similarly to calcDefTeamLuckAdj
    const sampleOff3PRate = get(sampleTeam?.off_3pr, 0);
    const sampleOffFGA = get(sampleTeam?.total_off_2p_attempts, 0) + get(sampleTeam?.total_off_3p_attempts, 0);
    const sampleOffOrb = get(sampleTeam?.off_orb, 0);

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

  /** Calculate the defensive luck adjustment for a team */
  static readonly calcDefTeamLuckAdj = (sample: any, base: any, avgEff: number) => {
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
    const sampleDefOrb = get(sample?.def_orb, 0);
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
    mutableStats: any,
    offLuck: OffLuckAdjustmentDiags | undefined,
    defLuck: DefLuckAdjustmentDiags | undefined
  ) => {
    const reset = (mutableVal: any) => {
      return _.isNil(mutableVal?.old_value) ? mutableVal?.value : mutableVal?.old_value;
    }

    // Offense - 3P

    const off3P = reset(mutableStats?.off_3p)
    mutableStats.off_3p = offLuck ? {
      value: off3P + offLuck.delta3P,
      old_value: off3P,
      override: "Luck adjusted"
    } : {
      value: off3P
    };

    // Offense - derived 4 factors and efficiency

    const eFgOff = reset(mutableStats?.off_efg);
    mutableStats.off_efg = offLuck ? {
      value: eFgOff + offLuck.deltaOffEfg,
      old_value: eFgOff,
      override: "Adjustment derived from Off 3P%"
    } : {
      value: eFgOff
    };

    const rawOffPpp = reset(mutableStats?.off_ppp);
    mutableStats.off_ppp = offLuck ? {
      value: rawOffPpp + offLuck.deltaOffPpp,
      old_value: rawOffPpp,
      override: "Adjustment derived from Off 3P%"
    } : {
      value: rawOffPpp
    };

    const adjOffPpp = reset(mutableStats?.off_adj_ppp);
    mutableStats.off_adj_ppp = offLuck ? {
      value: adjOffPpp + offLuck.deltaOffPpp,
      old_value: adjOffPpp,
      override: "Adjustment derived from Off 3P%"
    } : {
      value: adjOffPpp
    };

    // Defense - 3P

    const def3P = reset(mutableStats?.def_3p)
    mutableStats.def_3p = defLuck ? {
      value: defLuck.adjDef3P,
      old_value: def3P,
      override: "Luck adjusted"
    } : {
      value: def3P
    };

    // Defense - derived 4 factors and efficiency

    const eFgDef = reset(mutableStats?.def_efg);
    mutableStats.def_efg = defLuck ? {
      value: eFgDef + defLuck.deltaDefEfg,
      old_value: eFgDef,
      override: "Adjustment derived from Def 3P%"
    } : {
      value: eFgDef
    };

    const rawDefPpp = reset(mutableStats?.def_ppp);
    mutableStats.def_ppp = defLuck ? {
      value: rawDefPpp + defLuck.deltaDefPpp,
      old_value: rawDefPpp,
      override: "Adjustment derived from Def 3P%"
    } : {
      value: rawDefPpp
    };

    const adjDefPpp = reset(mutableStats?.def_adj_ppp);
    mutableStats.def_adj_ppp = defLuck ? {
      value: adjDefPpp + defLuck.deltaDefPpp,
      old_value: adjDefPpp,
      override: "Adjustment derived from Def 3P%"
    } : {
      value: adjDefPpp
    };

  }

};
