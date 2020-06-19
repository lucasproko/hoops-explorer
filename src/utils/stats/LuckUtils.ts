

/** Whether to calculate the luck adjustment over the baseline or the entire season
    Baseline will be subject to more noise but enables luck to be reduced in cases
    where you suspect the baseline is more representative (eg injuries)
*/
export type LuckAdjustmentBaseline = "baseline" | "global";

/** Holds all the info required to calculate and explain the delta when luck is regressed away */
export type OffLuckAdjustmentDiags = {
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
  sample3PSos: number,
  samplePoss: number
  sample3PSosAdj: number,

  // (We'll need these stats later)
  sampleDefEfg: number,
  sampleDefPpp: number,
  sampleOffSos: number,
  sampleDef3PM: number,
  sampleDef3PA: number,
  sampleDef2PA: number,

  /** The weighted sum of the two 3PD adjustments */
  avg3PSosAdj: number,
  /** The final number */
  adjDef3P: number,

  // The effect:
  deltaDefEfg: number,
  deltaDefPpp: number,
  deltaDefAdjEff: number
};

/** Contains logic to help other stats modules adjust for luck */
export class LuckUtils {

  /** Calculate the offensive luck adjustment for a team */
  static readonly calcOffTeamLuckAdj = (sample: any, base: any, avgEff: number) => {

    return {} as OffLuckAdjustmentDiags;
  };

  /** Calculate the defensive luck adjustment for a team */
  static readonly calcDefTeamLuckAdj = (sample: any, base: any, avgEffIn: number) => {
    const avgEff = avgEffIn;
    const luckPct = 0.66;

    const baseDef3P = base?.def_3p?.value || 0;
    const baseDef3PSos = 0.01*base?.def_3p_opp?.value || 0; //(normalize to %)
    const basePoss = base?.def_poss?.value || 0;
    const base3PSosAdj = (1 - luckPct)*(baseDef3P - baseDef3PSos);

    const sampleDef3P = sample?.def_3p?.value || 0;
    const sample3PSos = 0.01*sample?.def_3p_opp?.value || 0; //(normalize to %)
    const samplePoss = sample?.def_poss?.value || 0;
    const sample3PSosAdj = (1 - luckPct)*(sampleDef3P - sample3PSos);

    const sampleDefEfg = sample?.def_efg?.value || 0;
    const sampleDefPpp = sample?.def_ppp?.value || 0;
    const sampleOffSos = sample?.off_adj_opp?.value || 0;

    const avg3PSosAdj = (samplePoss*sample3PSosAdj + basePoss*base3PSosAdj)/((samplePoss + basePoss) || 1);
    const adjDef3P = sample3PSos + avg3PSosAdj;

    const sampleDef3PM = sample?.total_def_3p_made?.value;
    const sampleDef3PA = sample?.total_def_3p_attempts?.value;
    const sampleDef2PA = sample?.total_def_2p_attempts?.value;

    const deltaDefEfg = 1.5*(adjDef3P - sampleDef3P)*sampleDef3PA/((sampleDef3PA + sampleDef2PA) || 1);
    const deltaDefPpp = 300*(adjDef3P - sampleDef3P)*sampleDef3PA/(samplePoss || 1);
    //TODO: what about off offensive rebounds on misses?
    const deltaDefAdjEff = deltaDefPpp*avgEff/(sampleOffSos || 1);

    return {
      avgEff, luckPct,
      baseDef3P, baseDef3PSos, basePoss,
      base3PSosAdj,

      sampleDef3P, sample3PSos, samplePoss,
      sample3PSosAdj,

      sampleDefEfg, sampleDefPpp, sampleOffSos,
      sampleDef3PM, sampleDef3PA, sampleDef2PA,

      avg3PSosAdj, adjDef3P,

      deltaDefEfg, deltaDefPpp, deltaDefAdjEff
    } as DefLuckAdjustmentDiags;

  };

};
