
// Utils:
import _ from 'lodash'

/** All the info needed to explain the ORtg calculation, see "buildORtgDiag" */
export type ORtgDiagnostics = {
  // Basic player numbers:
  rawFga: number,
  rawFgx: number,
  rawFgm: number,
  ptsFgm: number,
  rawFtm: number,
  rawAssist: number,
  rawPts: number,
  rawOrb: number,
  rawTo: number,
  // Shooting breakdowns, just for display:
  raw3Fga: number,
  raw2midFga: number,
  raw2rimFga: number,
  raw3Fgm: number,
  raw2midFgm: number,
  raw2rimFgm: number,
  // Basic team numbers:
  teamOrb: number,
  teamPts: number,
  teamFga: number,
  teamFgm: number,
  teamFta: number,
  teamFtPct: number,
  teamOrbPct: number,
  teamTo: number,

  // 1] Points produced calcs:

  // Advanced player numbers:
  eFG: number,
  // Advanced team numbers:
  teamPtsPerScore: number,
  teamFtHitOnePlus: number,
  teamProbFtHitOnePlus: number,
  teamOrbCreditToRebounder: number,
  teamOrbCreditToScorer: number,
  teamScoreFromReboundPct: number,
  teamOrbWeight: number,
  othersAssist: number,
  otherEfg: number,
  otherPtsPerFgm: number,
  teamOrbContribPct: number,
  teamScoredPlayPct: number,
  teamAssistRate: number,
  ppFgTeamAstPct: number,

  // Pts produced:
  ptsProd: number,
  ppOrb: number,
  ppAssist: number,
  ppFg: number,

  // 2] Possession Calcs:
  // Advanced player numbers:
  offPoss: number,
  ftPoss: number,
  ftPct: number,
  missedBothFTs: number,
  offPlaysLessPoss: number,
  fgPart: number,
  ftPart: number,
  astPart: number,
  orbPart: number,
  // Advanced team numbers:
  teamScoringPoss: number,
  teamPlays: number,
  // Possession calcs
  adjPoss: number,
  scoringPoss: number,
  fgxPoss: number,
  ftxPoss: number,
  // Adjusted calcs:
  oRtg: number,
  defSos: number,
  avgEff: number,
  SD_at_Usage: number,
  SDs_Above_Mean: number,
  SD_at_Usage_20: number,
  Regressed_ORtg: number,
  Usage: number,
  Usage_Bonus: number,
  adjORtg: number,
  adjORtgPlus: number,
};

/** All the info needed to explain the DRtg calculation, see "buildDRtgDiag" */
export type DRtgDiagnostics = {
  // Basic player numbers
  stl: number,
  blk: number,
  drb: number,
  pfPct: number,
  // Advanced player numbers
  playerRtg: number,
  playerDelta: number,
  scPossConceded: number,
  noShotCredit: number,
  reboundCredit: number,
  missFtCredit: number,
  stopsIndPct: number,
  stopsTeamPct: number,
  // Basic team numbers
  teamBlk: number,
  oppoPts: number,
  oppoPoss: number,
  oppoFga: number,
  oppoFgm: number,
  oppoFtm: number,
  oppoFta: number,
  oppoFtPoss: number,
  oppoTov: number,
  teamStl: number,
  opponentOrbPct: number,
  opponentFgPct: number,
  // Advanced team numbers
  teamOrbCreditToRebounder: number,
  teamOrbCreditToDefender: number,
  teamDvsRebCredit: number,
  oppoFgMiss: number,
  oppoNonStlTov: number,
  teamMissWeight: number,
  oppoFtPct: number,
  oppoFtHitOnePlus: number,
  oppoProbFtHitOnePlus: number,
  oppoScPoss: number,
  oppoPtsPerScore: number,
  teamRtg: number,
  // Adjusted calcs:
  dRtg: number,
  offSos: number,
  avgEff: number,
  adjDRtg: number,
  adjDRtgPlus: number,
};

/** (just to make copy/pasting between colab and this code easier)*/
const array = (v: number[]) => { return v; }

/** Contains the logic to build offensive and defensive ratings for individual players */
export class RatingUtils {

  /** From https://www.basketball-reference.com/about/ratings.html */
  static buildORtg(
    statSet: Record<string, any>, avgEfficiency: number, calcDiags: boolean
  ): [ { value: number } | undefined, { value: number } | undefined, ORtgDiagnostics | undefined ] {
    if (!statSet) return [ undefined, undefined, undefined ];

    // The formulate references (MP / (Team_MP / 5)) a fair bit
    // All our team numbers are when the player is on the floor, so we set to 1

    const FGA = statSet?.total_off_fga?.value || 0;
    const FGM = statSet?.total_off_fgm?.value || 0;
    const FTM = statSet?.total_off_ftm?.value || 0;
    const FTA = statSet?.total_off_fta?.value || 0;
    const AST = statSet?.total_off_assist?.value || 0;
    const TOV = statSet?.total_off_to?.value || 0;
    const ORB = statSet?.total_off_orb?.value || 0;
    const FG2PM = statSet?.total_off_2p_made?.value || 0;
    const FG3PM = statSet?.total_off_3p_made?.value || 0;
    const offPoss = statSet?.off_poss?.value || 0;

    const Team_AST = statSet?.team_total_off_assist?.value || 0;
    const Team_FGM = statSet?.team_total_off_fgm?.value || 0;
    const Team_FGA = statSet?.team_total_off_fga?.value || 0;
    const Team_FTM = statSet?.team_total_off_ftm?.value || 0;
    const Team_FTA = statSet?.team_total_off_fta?.value || 0;
    const Team_PTS = statSet?.team_total_off_pts?.value || 0;
    const Team_TOV = statSet?.team_total_off_to?.value || 0;
    const Team_3PM = statSet?.team_total_off_3p_made?.value || 0;

    // TODO: regress this to bigger samples
    const Team_ORB = statSet?.team_total_off_orb?.value || 0;
    const Opponent_DRB = statSet?.oppo_total_def_drb?.value || 0;

    const PTS_FROM_FG = 2*FG2PM + 3*FG3PM;
    const Team_PTS_FROM_FG = Team_PTS - Team_FTM;
    const Others_FGA = Team_FGA - FGA;
    const Others_FGM = Team_FGM - FGM;
    const Others_AST = Team_AST - AST;

    const FTA_to_Poss = 0.475;

    // This is much simplified because the stats are for the period the player was on the floor
    const qAST = Team_FGM > 0 ? (1.14 * (Others_AST / Team_FGM)) : 0.0;
    const FG_Part = FGA > 0 ? FGM * (1 - 0.5 * (PTS_FROM_FG / (2 * FGA)) * qAST) : 0.0;

    const AST_Part = Others_FGA > 0 ?
      0.5 * ((Team_PTS_FROM_FG - PTS_FROM_FG) / (2 * Others_FGA)) * AST : 0.0;

    const Prob_Miss_Both_FT = (1-(FTM/FTA))**2
    const FT_Part = FTA > 0 ? (1-Prob_Miss_Both_FT)*FTA_to_Poss*FTA : 0.0;

    const Team_Prob_Hit_1plus_FT = (1 - (1 - (Team_FTM / Team_FTA))**2);
    const Team_Scoring_Poss = Team_FTA > 0 ? Team_FGM + Team_Prob_Hit_1plus_FT * Team_FTA * FTA_to_Poss : 0.0;

    const Team_ORB_pct = (Team_ORB + Opponent_DRB) > 0 ? Team_ORB/(Team_ORB + Opponent_DRB) : 0.0;
    const Num_Team_Plays = Team_FGA + Team_FTA * FTA_to_Poss + Team_TOV;
    const Team_Play_Pct = Num_Team_Plays > 0 ? Team_Scoring_Poss / Num_Team_Plays : 0.0;

    const Credit_To_Rebounder = ((1 - Team_ORB_pct) * Team_Play_Pct);
    const Credit_To_Scorer = Team_ORB_pct * (1 - Team_Play_Pct);
    const Team_ORB_Weight_Denom = Credit_To_Rebounder + Credit_To_Scorer;
    const Team_ORB_Weight = Team_ORB_Weight_Denom > 0 ?  Credit_To_Rebounder/ Team_ORB_Weight_Denom : 0.0;
    const Team_Score_Rebound_Pct =
      Team_Scoring_Poss > 0 ? (Team_ORB * Team_Play_Pct) / Team_Scoring_Poss : 0.0;
    const Team_ORB_Contrib = Team_ORB_Weight * Team_Score_Rebound_Pct;

    const ORB_Part = ORB * Team_ORB_Weight * Team_Play_Pct;

    // And then:
    const ScPoss = Team_Scoring_Poss > 0 ? (FG_Part + AST_Part + FT_Part) *
      (1 - Team_ORB_Contrib) + ORB_Part : 0;

    // Other factors:

    const FGxPoss = (FGA - FGM) * (1 - 1.07 * Team_ORB_pct);

    const FTxPoss = FTA > 0 ? Prob_Miss_Both_FT * FTA_to_Poss * FTA : 0.0;

    const TotPoss = ScPoss + FGxPoss + FTxPoss + TOV;

    // Finally:

    const eFG = FGA > 0 ? PTS_FROM_FG / (2 * FGA) : 0.0;
    const Team_Assist_Contrib = (0.5 * eFG) * qAST;
    const PProd_FG_Part = PTS_FROM_FG * (1 - Team_Assist_Contrib);

    const Other_eFG = Others_FGA > 0 ? (Team_FGM - FGM + 0.5 * (Team_3PM - FG3PM)) / Others_FGA : 0.0;
    const Other_Pts_Per_FGM = Others_FGM > 0 ? (Team_PTS_FROM_FG - PTS_FROM_FG) / Others_FGM : 0.0;
    const PProd_AST_Part = (0.5*Other_eFG) * AST * Other_Pts_Per_FGM;

    const Team_FTs_Hit_1plus = Team_FTA > 0 ? Team_Prob_Hit_1plus_FT * FTA_to_Poss * Team_FTA : 0.0;
    const Team_Pts_Per_Score = (Team_FGM + Team_FTs_Hit_1plus) > 0 ? Team_PTS / (Team_FGM + Team_FTs_Hit_1plus) : 0.0;
    const PProd_ORB_Part = ORB * Team_ORB_Weight * Team_Play_Pct * Team_Pts_Per_Score;

    const PProd = (PProd_FG_Part + PProd_AST_Part + FTM) * (1 - Team_ORB_Contrib) + PProd_ORB_Part;

    const ORtg = TotPoss > 0 ? 100 * (PProd / TotPoss) : 0;

    // Adjusted efficiency
    // Adapted from: https://www.bigtengeeks.com/new-stat-porpagatu/

    const usage = 100*(statSet.off_usage?.value || 0);
    const Def_SOS = (statSet?.def_adj_opp?.value || avgEfficiency);
    const o_adj = avgEfficiency / Def_SOS;
    const SD_at_Usage = usage * -.144 + 13.023;
    const SDs_Above_Mean = SD_at_Usage > 0 ? (ORtg - avgEfficiency) / SD_at_Usage : 0;
    const SD_at_Usage_20 = 10.143;
    const Regressed_ORtg = avgEfficiency + SDs_Above_Mean * SD_at_Usage_20;
    const Usage_Bonus = usage > 20 ? ((usage - 20) * 1.25) :  ((usage - 20) * 1.5);
    const Adj_ORtg = (Regressed_ORtg + Usage_Bonus)*o_adj;
    const Adj_ORtgPlus = 0.2*(Adj_ORtg - avgEfficiency);

    return [
      TotPoss > 0 ? { value: ORtg } : undefined,
      TotPoss > 0 ? { value: Adj_ORtgPlus } : undefined,
      (calcDiags ? {
      // Basic player numbers:
      rawFga: FGA,
      rawFgx: FGA - FGM,
      rawFgm: FGM,
      ptsFgm: PTS_FROM_FG,
      rawFtm: FTM,
      rawAssist: AST,
      rawPts: PTS_FROM_FG + FTM,
      rawOrb: ORB,
      rawTo: TOV,
      // Shooting breakdowns, just for display:
      raw3Fga: statSet?.total_off_3p_attempts?.value || 0,
      raw2midFga: statSet?.total_off_2pmid_attempts?.value || 0,
      raw2rimFga: statSet?.total_off_2prim_attempts?.value || 0,
      raw3Fgm: statSet?.total_off_3p_made?.value || 0,
      raw2midFgm: statSet?.total_off_2pmid_made?.value || 0,
      raw2rimFgm: statSet?.total_off_2prim_made?.value || 0,
      // Basic team numbers:
      teamOrb: Team_ORB,
      teamPts: Team_PTS,
      teamFga: Team_FGA,
      teamFgm: Team_FGM,
      teamFta: Team_FTA,
      teamFtPct: Team_FTA > 0 ? Team_FTM / Team_FTA : 0,
      teamOrbPct: Team_ORB_pct,
      teamTo: Team_TOV,

      // 1] Points produced calcs:
      // Advanced player numbers:
      eFG: eFG,
      // Advanced team numbers:
      teamPtsPerScore: Team_Pts_Per_Score,
      teamFtHitOnePlus: Team_FTs_Hit_1plus,
      teamProbFtHitOnePlus: Team_Prob_Hit_1plus_FT,
      teamOrbCreditToRebounder: Credit_To_Rebounder,
      teamOrbCreditToScorer: Credit_To_Scorer,
      teamScoreFromReboundPct: Team_Score_Rebound_Pct,
      teamOrbWeight: Team_ORB_Weight,
      othersAssist: Others_AST,
      otherEfg: Other_eFG,
      otherPtsPerFgm: Other_Pts_Per_FGM,
      teamOrbContribPct: Team_ORB_Contrib,
      teamScoredPlayPct: Team_Play_Pct,
      teamAssistRate: qAST,
      ppFgTeamAstPct: Team_Assist_Contrib,

      // Pts produced:
      ptsProd: PProd,
      ppOrb: PProd_ORB_Part,
      ppAssist: PProd_AST_Part,
      ppFg: PProd_FG_Part,

      // 2] Possession Calcs:
      // Advanced player numbers:
      ftPoss: FTA_to_Poss*FTA,
      ftPct: FTA > 0 ? FTM / FTA : 0,
      missedBothFTs: Prob_Miss_Both_FT,
      offPlaysLessPoss: FGA + FTA*FTA_to_Poss + TOV - offPoss,
      offPoss: offPoss,
      fgPart: FG_Part,
      ftPart: FT_Part,
      astPart: AST_Part,
      orbPart: ORB_Part,
      // Advanced team numbers:
      teamScoringPoss: Team_Scoring_Poss,
      teamPlays: Num_Team_Plays,
      // Possessions calcs
      adjPoss: TotPoss,
      scoringPoss: ScPoss,
      fgxPoss: FGxPoss,
      ftxPoss: FTxPoss,
      // Adjusted calcs:
      oRtg: ORtg,
      defSos: Def_SOS,
      avgEff: avgEfficiency,
      SD_at_Usage: SD_at_Usage,
      SDs_Above_Mean: SDs_Above_Mean,
      SD_at_Usage_20: SD_at_Usage_20,
      Regressed_ORtg: Regressed_ORtg,
      Usage: usage,
      Usage_Bonus: Usage_Bonus,
      adjORtg: Adj_ORtg,
      adjORtgPlus: Adj_ORtgPlus
    } : undefined) as (ORtgDiagnostics | undefined) ];
  }

  /** From https://www.basketball-reference.com/about/ratings.html */
  static buildDRtg(
    statSet: Record<string, any>, avgEfficiency: number, calcDiags: boolean
  ): [ { value: number } | undefined, { value: number } | undefined, DRtgDiagnostics | undefined ] {
    if (!statSet) return [ undefined, undefined, undefined ];

    // Player:
    const STL = statSet?.total_off_stl?.value || 0;
    const BLK = statSet?.total_off_blk?.value || 0;
    const DRB = statSet?.total_off_drb?.value || 0;
    const PF = statSet?.total_off_foul?.value || 0;
    // Team:
    const Team_DRB = statSet?.team_total_off_drb?.value || 0;
    const Team_BLK = statSet?.team_total_off_blk?.value || 0;
    const Team_STL = statSet?.team_total_off_stl?.value || 0;
    const Team_PF = statSet?.team_total_off_foul?.value || 0;
    // Opponent:
    const Opponent_FGA = statSet?.oppo_total_def_fga?.value || 0;
    const Opponent_FGM = statSet?.oppo_total_def_fgm?.value || 0;
    const Opponent_ORB = statSet?.oppo_total_def_orb?.value || 0;
    const Opponent_TOV = statSet?.oppo_total_def_to?.value || 0;
    const Opponent_FTA = statSet?.oppo_total_def_fta?.value || 0;
    const Opponent_FTM = statSet?.oppo_total_def_ftm?.value || 0;
    const Opponent_Possessions = statSet?.oppo_total_def_poss?.value || 0;
    const Opponent_PTS = statSet?.oppo_total_def_pts?.value || 0;

    const Opponent_FTposs = 0.475*Opponent_FTA;

    // The overall credit for a miss and a defensive rebound gets split between the ...
    // ... team for forcing the miss and the individual for getting the rebound
    // (as per usual based on their relative difficulty)
    const DFGpct = Opponent_FGA > 0 ? Opponent_FGM / Opponent_FGA : 0;
    const Total_RBs = (Opponent_ORB + Team_DRB);
    const Team_DORpct = Total_RBs > 0 ? Opponent_ORB/Total_RBs : 0;
    const Credit_To_Shot_Defense = DFGpct*(1 - Team_DORpct);
    const Credit_To_Rebounder = (1 - DFGpct)*Team_DORpct;
    const FMwt = (Credit_To_Shot_Defense + Credit_To_Rebounder > 0) ?
      Credit_To_Shot_Defense / (Credit_To_Shot_Defense + Credit_To_Rebounder) : 0;

    // Block/Miss weighting - team has to rebound (bonus 7%), and the credit is the chance opponent would have scored
    const TeamMissWeight = FMwt*(1 - 1.07*Team_DORpct);
    // Credit to the individual for stops
    const PFpct = Team_PF > 0 ? PF/Team_PF : 0;
    const Opponent_MissAllFTs = Opponent_FTA > 0 ? (1 - Opponent_FTM/Opponent_FTA)**2 : 0;
    const NoShot_Credit = STL + BLK*TeamMissWeight;
    const Rebound_Credit = DRB*(1 - FMwt);
    const FTmiss_Credit = PFpct*Opponent_FTposs*Opponent_MissAllFTs;
    const Stops_Ind = NoShot_Credit + Rebound_Credit + FTmiss_Credit;

    // Credit to the team for stops (divided by 5 for shots/turnovers, in proportion of fouls for FTMs)
    const Opponent_FGMiss = Opponent_FGA - Opponent_FGM - Team_BLK;
    const Opponent_NonStlTOV  = Opponent_TOV - Team_STL;
    const Stops_Team = 0.2*(Opponent_FGMiss*TeamMissWeight + Opponent_NonStlTOV);

    const Stops = Stops_Ind + Stops_Team;

    const StopPct = Opponent_Possessions > 0 ? Stops/(0.2*Opponent_Possessions) : 0;

    const Opponent_HitFTs = 1 - Opponent_MissAllFTs;
    const Team_DRtg = Opponent_Possessions > 0 ? 100*(Opponent_PTS/Opponent_Possessions) : 0;

    const ScPoss = Opponent_FGM + Opponent_HitFTs*Opponent_FTposs;
    const D_Pts_Per_ScPoss = ScPoss > 0 ? Opponent_PTS/ScPoss : 0;

    const Player_DRtg = 100*D_Pts_Per_ScPoss*(1 - StopPct);
    const Player_Delta = 0.2*(Player_DRtg - Team_DRtg);

    const DRtg = Team_DRtg + Player_Delta;
    const Off_SOS = (statSet?.off_adj_opp?.value || avgEfficiency);
    const Adj_DRtg = Off_SOS > 0 ? DRtg*(avgEfficiency / Off_SOS) : 0;
    const Adj_DRtgPlus =  0.2*(Adj_DRtg - avgEfficiency);

    // Try to incorporate FT fault:
    // Sum per lineup Approx_SF_Poss = PFpct*(Opponent_FTA*0.475)
    //(maybe discard intentional FT spots)
    // Approx_SF_FTM =PFpct*Opponent_FTM
    // then subtract from Opponent_PTS, Opponents_FTM, Opponents_FTA
    // remove Stop_Ind
    // and then add an extra term 100/Team_Poss*(SF_FTM/SF_Poss)

    return [
      Opponent_Possessions > 0 ? { value: DRtg } : undefined,
      Opponent_Possessions > 0 ? { value: Adj_DRtgPlus } : undefined,
      (calcDiags ? {
      // Basic player numbers
      stl: STL,
      blk: BLK,
      drb: DRB,
      pfPct: PFpct,
      // Advanced player numbers
      playerRtg: Player_DRtg,
      playerDelta: Player_Delta,
      scPossConceded: 1 - StopPct,
      noShotCredit: NoShot_Credit,
      reboundCredit: Rebound_Credit,
      missFtCredit: FTmiss_Credit,
      stopsIndPct: Opponent_Possessions > 0 ? Stops_Ind/(0.2*Opponent_Possessions) : 0,
      stopsTeamPct: Opponent_Possessions > 0 ? Stops_Team/(0.2*Opponent_Possessions) : 0,
      // Basic team numbers
      teamBlk: Team_BLK,
      oppoPts: Opponent_PTS,
      oppoPoss: Opponent_Possessions,
      oppoFga: Opponent_FGA,
      oppoFgm: Opponent_FGM,
      oppoFtm: Opponent_FTM,
      oppoFta: Opponent_FTA,
      oppoFtPoss: Opponent_FTposs,
      oppoTov: Opponent_TOV,
      teamStl: Team_STL,
      opponentOrbPct: Team_DORpct,
      opponentFgPct: DFGpct,
      // Advanced team numbers
      teamOrbCreditToDefender: Credit_To_Shot_Defense,
      teamOrbCreditToRebounder: Credit_To_Rebounder,
      teamDvsRebCredit: FMwt,
      oppoFgMiss: Opponent_FGMiss,
      oppoNonStlTov: Opponent_NonStlTOV,
      teamMissWeight: TeamMissWeight,
      oppoFtPct: Opponent_FTA > 0 ? Opponent_FTM/Opponent_FTA : 0,
      oppoFtHitOnePlus: Opponent_HitFTs*Opponent_FTposs,
      oppoProbFtHitOnePlus: Opponent_HitFTs,
      oppoScPoss: ScPoss,
      oppoPtsPerScore: D_Pts_Per_ScPoss,
      teamRtg: Team_DRtg,
      // Adjusted calcs:
      dRtg: DRtg,
      offSos: Off_SOS,
      avgEff: avgEfficiency,
      adjDRtg: Adj_DRtg,
      adjDRtgPlus: Adj_DRtgPlus
    } : undefined) ];
  }

  /** The LDA intercepts */
  static readonly positionFeatureInit = [-2.82375823, -2.41283573, -3.74982844, -8.98755013, -3.23442276];

  /** List of the fields used in the positional confidence vectors */
  static readonly tradPosList = [ "pos_pg", "pos_sg", "pos_sf", "pos_pf", "pos_c" ];

  /** triples in the form [ fieldname, scale, weights-from-ML ] */
  static readonly positionFeatureWeights = [
    // Ball handling
    ['calc_ast_tov', 1.0,
      array([ 0.08281269,  0.09093907, -0.37973552, -0.67240486,  0.5964297 ])
    ],
    ['off_assist', 100.0,
      array([ 0.15829941,  0.02598234, -0.06537337, -0.05021328, -0.12142258])
    ],
    ['off_to', 100.0,
      array([-0.00680258,  0.0051497 , -0.02123889, -0.03861639,  0.04709196])
    ],
    ['calc_assist_per_fga', 100.0, //(expressed as %)
      array([ 0.01429017, -0.00313073,  0.0082461 ,  0.01833772, -0.0319402 ])
    ],
    // Shot selection
    ['off_3pr', 100.0,
      array([ 0.02713631,  0.0218532 , -0.00223302,  0.00081636, -0.06555841])
    ],
    ['off_2pmidr', 100.0,
      array([-0.0010662 , -0.00969839, -0.01555429, -0.04862983,  0.06485701])
    ],
    ['off_2primr', 100.0,
      array([ 0.01545738,  0.01531782, -0.00856427, -0.03075521, -0.01459524])
    ],
    ['off_ftr', 100.0,
      array([ 0.00270944,  0.00083536,  0.00011253, -0.01560428,  0.00500472])
    ],
    // Shot making ability
    ['calc_three_relative', 100.0,
      array([ 0.00753295,  0.00814222,  0.00794373,  0.01847985, -0.04255395])
    ],
    ['calc_mid_relative', 100.0,
      array([ 0.00281905,  0.00377201,  0.00400989,  0.01991123, -0.02632626])
    ],
    ['calc_rim_relative', 100.0,
      array([-0.00995088,  0.00740773,  0.01560057,  0.03010704, -0.03693076])
    ],
    ['calc_ft_relative_inv', 100.0,
      array([-0.01016761, -0.0056131 , -0.00079665, -0.00547513,  0.02533069])
    ],
    // Rebounding and defense
    ['def_to', 100.0, //(used as the field for steals)
      array([ 0.8133556 ,  0.54765371, -0.02580977, -0.68504559, -1.39476509])
    ],
    ['off_orb', 100.0,
      array([-0.26888945, -0.21892123,  0.07832771,  0.26210603,  0.42330573])
    ],
    ['off_drb', 100.0,
      array([-0.23799504, -0.07938086,  0.10442655,  0.21672752,  0.15512722])
    ],
    ['def_2prim', 100.0, //(used as the field for blocks)
      array([-0.29122875, -0.22875385, -0.09758256,  0.20918001,  0.69598967])
    ],
    ['def_ftr', 100.0, //(this is FC/(50*100), which isn't _quite_ FC/40m but close enough given these low numbers)
      array([-0.08827297, -0.20674559, -0.01827295,  0.22834328,  0.3239175 ])
    ],
  ] as Array<[string, number, number[]]>;

  static readonly positionFeatureAverages = {
    'calc_ast_tov':
      array([1.71771567, 1.17932242, 0.79621661, 0.74306857, 0.51254529]),
    'off_assist':
      array([24.86785714, 13.05019881,  9.63812274,  8.73104467,  6.37806666]),
    'off_to':
      array([22.45299921, 18.04530996, 18.44424188, 17.58870432, 20.07028442]),
    'calc_assist_per_fga':
      array([51.81818417, 24.21690841, 17.89512103, 15.10389804, 13.50735024]),

    'off_3pr':
      array([40.5474501 , 49.22191966, 28.19592525, 33.62534936,  1.68639513]),
    'off_2pmidr':
      array([28.41474701, 24.5276034 , 31.24101352, 29.92330697, 38.24966097]),
    'off_2primr':
      array([30.86647093, 26.14022775, 40.36403453, 36.10765493, 59.75727503]),
    'off_ftr':
      array([38.30457774, 30.19707211, 39.07963899, 32.61391657, 49.06417728]),

    'calc_three_relative':
      array([105.20372914, 103.32803494,  94.36055369, 110.83302518, 10.55692479]),
    'calc_mid_relative':
      array([72.5681835 , 69.11712719, 68.56060901, 72.54753109, 67.48685787]),
    'calc_rim_relative':
      array([109.28254527, 115.53768733, 123.82853889, 125.66705542, 122.39476683]),
    'calc_ft_relative_inv':
      array([64.98897552, 68.39666748, 74.86478424, 75.10386658, 93.1631546 ]),

    'def_to':
      array([2.38133386, 1.92994759, 1.75611913, 1.37696567, 1.37380911]),
    'off_orb':
      array([ 2.10153907,  2.86361829,  6.82231047,  7.9960502 , 10.19931949]),
    'off_drb':
      array([ 9.06756117, 10.43093259, 15.15236462, 18.20837948, 17.1899494 ]),
    'def_2prim':
      array([0.46286504, 0.79057473, 1.77850181, 3.52768549, 4.76859187]),
    'def_ftr':
      array([3.13113654, 3.08755648, 3.86938628, 4.45762274, 5.06942942]),
    } as Record<string, number[]>;

  static readonly averageScoresByPos = _.chain(RatingUtils.positionFeatureWeights).transform(
    (acc: number[], feat_scale_weights: [string, number, number[]]) => {
      const feat = feat_scale_weights[0];
      const scale = feat_scale_weights[1];
      const weights = feat_scale_weights[2];
      const fieldVal = RatingUtils.positionFeatureAverages[feat];

      weights.forEach((weight, index) => {
        const sumPart = fieldVal[index]*weight
        acc[index] += sumPart; //(factor to make the scores render nicely)
      });

    }, _.clone(RatingUtils.positionFeatureInit)
  ).map((v, i) => [ RatingUtils.tradPosList[i], { value: 0.1*v } ]).fromPairs().value();

  /** Returns a vector of 5 elements representing the confidence that the player
      can play that position (0=PG, 1=SG, 4=SF, 4=PF, 5=C)
  */
  static buildPositionConfidences(player: Record<string, any>): [ Record<string, number>, any ] {
    const posList = RatingUtils.tradPosList;

    const calculated = {
      calc_ast_tov: player.total_off_assist.value / (player.total_off_to.value || 1),
      calc_three_relative: 1.5*player.off_3p.value / (player.off_efg.value || 1),
      calc_mid_relative: player.off_2pmid.value / (player.off_efg.value || 1),
      calc_rim_relative: player.off_2prim.value / (player.off_efg.value || 1),
      calc_assist_per_fga: player.total_off_assist.value / (player.total_off_fga.value || 1),
      calc_ft_relative_inv:  //=eFG/FT%, (where FT% = FTM/FTA)
        (player.off_efg.value * player.total_off_fta.value) / (player.total_off_ftm.value || 1)
    } as Record<string, number>;

    const scores = _.transform(RatingUtils.positionFeatureWeights,
      (acc: number[], feat_scale_weights: [string, number, number[]]) => {
        const feat = feat_scale_weights[0];
        const scale = feat_scale_weights[1];
        const weights = feat_scale_weights[2];
        const fieldVal = _.startsWith(feat, "calc_") ? (calculated[feat] || 0) : (player[feat]?.value || 0);

        weights.forEach((weight, index) => {
          const sumPart = fieldVal*scale*weight;
          acc[index] += sumPart;
        });

        // (used for debugging - shouldn't be needed moving forward)
        //console.log(`${player.key}: ${pos} ${scale} ${weights}  - ${fieldVal} ... ${acc}`);

      }, _.clone(RatingUtils.positionFeatureInit)
    );

    const addPosAndScale = (v: number[], scale: number) => {

      return _.chain(v).map((s: number, i: number) => [ posList[i], s*scale ]).fromPairs().value();
    }
    const maxScore = _.max(scores) || 0;
    const confs = scores.map((s: number) => Math.exp(s - maxScore));
    const maxConfInv = 1.0/(_.sum(confs) || 1);

    return [
      addPosAndScale(confs, maxConfInv),
      {
        scores: addPosAndScale(scores, 0.1), //(0.1 == factor to make the scores render nicely)
        calculated: calculated,
      }
    ];
  }

  /** Description of the different roles */
  static readonly idToPosition = {
    "PG": "Pure PG",
    "s-PG": "Scoring PG",
    "CG": "Combo Guard",
    "WG": "Wing Guard",
    "WF": "Wing Forward",
    "S-PF": "Stretch PF",
    "PF/C": "Power Forward/Center",
    "C": "Center",
    "G?": "Unknown - probably Guard",
    "F/C?": "Unknown - probably Forward/Center"
  } as Record<string, string>;

  /** Tag the player with a position string given the confidences */
  static buildPosition(confs: Record<string, number>, player: Record<string, any>): [string, string] {
    const posList = RatingUtils.tradPosList;

    // Get the class with the highest prio
    const maxPos = _.maxBy(posList, (pos: string) => confs[pos] || 0) || 0;

    const assistRate = player?.off_assist?.value || 0;
    const minAstRate = 0.09; // (less than this and you can't be a PG!)
    const threeRate = player?.off_3pr?.value || 0;
    const minThreeRate = 0.20;

    const fwdConfSum = confs["pos_sf"] + confs["pos_pf"] + confs["pos_c"];

    // Just do the rules as a big bunch of if statements
    const getPosition = () => {
      if (confs["pos_pg"] > 0.85) {
        return (assistRate >= minAstRate) ?
          [ "PG", `(P[PG] >= 85%)`, "G?" ] :
          [ "WG", `(PG:)(P[PG] >= 85%) BUT (AST%[${(assistRate*100).toFixed(1)}] < 9%)`, "G?" ];
      } else if (confs["pos_pg"] > 0.5) {
        return (assistRate >= minAstRate) ?
          [ "s-PG", `(P[PG] >= 50%)`, "G?" ] :
          [ "WG", `(pG:)(P[PG] >= 50%) BUT (AST%[${(assistRate*100).toFixed(1)}] < 9%)`, "G?" ];
      } else if (maxPos == posList[0]) {
        return (assistRate >= minAstRate) ?
          [ "CG", `(Max[P] == PG)`, "G?" ] :
          [ "WG", `(CG:)(Max[P] == PG) BUT (AST%[${(assistRate*100).toFixed(1)}] < 9%)`, "G?" ];
      } else if ((maxPos == posList[1]) && (confs["pos_pg"] >= fwdConfSum)) {
        return (assistRate >= minAstRate) ?
        [ "CG", `(Max[P] == SG) AND (P[PG] >= P[SF] + P[PF] + P[C])`, "G?" ] :
        [ "WG", `(CG:)(Max[P] == SG) AND (P[PG] >= P[SF] + P[PF] + P[C]) BUT (AST%[${(assistRate*100).toFixed(1)}] < 9%)`, "G?" ];
      } else if ((maxPos == posList[1]) && (confs["pos_pg"] < fwdConfSum)) {
        return [ "WG", `(Max[P] == SG) AND (P[PG] < P[SF] + P[PF] + P[C])`, "G?" ];
      } else if ((maxPos == posList[2]) && (confs["pos_pg"] + confs["pos_sg"] >= confs["pos_pf"] + confs["pos_c"])) {
        return [ "WG", `(Max[P] == SF) AND (P[PG] + P[SG] >= P[PF] + P[C])`, "G?" ];
      } else if (maxPos == posList[2]) {
        return [ "WF", `(Max[P] == SF) AND (P[PG] + P[SG] < P[PF] + P[C])`, "F/C?" ];
      } else if (confs["pos_pf"] >= 0.85) {
        return [ "PF/C", `(P[PF] >= 85%)`, "F/C?" ];
      } else if ((maxPos == posList[3]) && (confs["pos_pg"] + confs["pos_sg"] + confs["pos_sf"] >= confs["pos_c"])) {
        return (threeRate >= minThreeRate) ?
          [ "S-PF", `(Max[P] == PF) AND (P[PG] + P[SG] + P[SF] >= P[C])`, "F/C?" ] :
          [ "PF/C", `(S4:)(Max[P] == PF) AND (P[PG] + P[SG] + P[SF] >= P[C]) BUT 3PR%[${(threeRate*100).toFixed(1)}] < 20%`, "F/C?" ];
      } else if (confs["pos_c"] >= 0.85) {
        return [ "C", `(P[C] >= 85%)`, "F/C?" ];
      }
      //(else fallback)
      return [ "PF/C", `(Max[P] == C) OR ((Max[P] == PF) AND (P[PG] + P[SG] + P[SF] < P[C]))`, "F/C?" ];
    };
    const [ pos, diag, fallbackPos ] = getPosition();

    const usage = (player?.off_usage?.value || 0);
    const poss = (player?.off_team_poss?.value || 0);
    const effectivePoss = poss*usage;

    if (effectivePoss < 25.0) { // Too few possessions to make an accurate determination
      return [ fallbackPos,
        `Too few used possessions [${effectivePoss.toFixed(1)}]=[${poss.toFixed(0)}]*[${(usage*100).toFixed(1)}]% < [25.0]. ` +
        `Would have matched [${pos}] from rule [${diag}]` ];
    } else {
      return [ pos, diag ];
    }
  }
}
