
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
  ftxPoss: number
};

/** All the info needed to explain the DRtg calculation, see "buildDRtgDiag" */
export type DRtgDiagnostics = {
  // Basic player numbers
  stl: number,
  blk: number,
  drb: number,
  // Advanced player numbers
  playerRtg: number,
  playerDelta: number,
  scPossConceded: number,
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
  // Advanced team numbers
  oppoFgMiss: number,
  oppoNonStlTov: number,
  teamMissWeight: number,
  oppoFtPct: number,
  oppoFtHitOnePlus: number,
  oppoProbFtHitOnePlus: number,
  oppoScPoss: number,
  oppoPtsPerScore: number,
  teamRtg: number,
};

/** General cbb complex stats calcs */
export class StatsUtils {

  /** From https://www.basketball-reference.com/about/ratings.html */
  static buildDRtg(statSet: Record<string, any>, calcDiags: boolean): [ any, DRtgDiagnostics | undefined ] {
    if (!statSet) return [ { value: 0.0 }, undefined ];

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
    const Opponent_TOV = statSet?.oppo_total_def_orb?.value || 0;
    const Opponent_FTA = statSet?.oppo_total_def_fta?.value || 0;
    const Opponent_FTM = statSet?.oppo_total_def_ftm?.value || 0;
    const Opponent_Possessions = statSet?.oppo_total_def_poss?.value || 0;
    const Opponent_PTS = statSet?.oppo_total_def_pts?.value || 0;

    // The overall credit for a miss and a defensive rebound gets split between the ...
    // ... team for forcing the miss and the individual for getting the rebound
    // (as per usual based on their relative difficulty)
    const DFGpct = Opponent_FGA > 0 ? Opponent_FGM / Opponent_FGA : 0;
    const Total_RBs = (Opponent_ORB + Team_DRB);
    const Team_DORpct = Total_RBs > 0 ? Opponent_ORB/Total_RBs : 0;
    const FMwt = ((Team_DORpct < 1) || (DFGpct < 1)) ?
      (DFGpct*(1 - Team_DORpct)) / (DFGpct*(1 - Team_DORpct) + (1 - DFGpct)*Team_DORpct) : 0;

    // Block/Miss weighting - team has to rebound (bonus 7%), and the credit is the chance opponent would have scored
    const TeamMissWeight = FMwt*(1 - 1.07*Team_DORpct);
    // Credit to the individual for stops
    const PFpct = Team_PF > 0 ? PF/Team_PF : 0;
    const Opponent_MissAllFTs = Opponent_FTA > 0 ? (1 - Opponent_FTM/Opponent_FTA)**2 : 0;
    const Stops_Ind = STL + BLK*TeamMissWeight + DRB*(1 - FMwt) + PFpct*(0.475*Opponent_FTA)*Opponent_MissAllFTs;

    // Credit to the team for stops (divided by 5 for shots/turnovers, in proportion of fouls for FTMs)
    const Opponent_FGMiss = Opponent_FGA - Opponent_FGM - Team_BLK;
    const Opponent_NonStlTOV  = Opponent_TOV - Team_STL;
    const Stops_Team = 0.2*(Opponent_FGMiss*TeamMissWeight + Opponent_NonStlTOV);

    const Stops = Stops_Ind + Stops_Team;

    const StopPct = Opponent_Possessions > 0 ? Stops/(0.2*Opponent_Possessions) : 0;

    const Opponent_HitFTs = 1 - Opponent_MissAllFTs;
    const Team_DRtg = Opponent_Possessions > 0 ? 100*(Opponent_PTS/Opponent_Possessions) : 0;

    const ScPoss = Opponent_FGM + Opponent_HitFTs*0.475*Opponent_FTA;
    const D_Pts_Per_ScPoss = ScPoss > 0 ? Opponent_PTS/ScPoss : 0;

    const Player_DRtg = 100*D_Pts_Per_ScPoss*(1 - StopPct);
    const Player_Delta = 0.2*(Player_DRtg - Team_DRtg);

    const DRtg = Team_DRtg + Player_Delta;

    // Try to incorporate FT fault:
    // Sum per lineup Approx_SF_Poss = PFpct*(Opponent_FTA*0.475)
    //(maybe discard intentional FT spots)
    // Approx_SF_FTM =PFpct*Opponent_FTM
    // then subtract from Opponent_PTS, Opponents_FTM, Opponents_FTA
    // remove Stop_Ind
    // and then add an extra term 100/Team_Poss*(SF_FTM/SF_Poss)

    return [Opponent_Possessions > 0 ? { value: DRtg } : undefined, (calcDiags ? {
      // Basic player numbers
      stl: STL,
      blk: BLK,
      drb: DRB,
      // Advanced player numbers
      playerRtg: Player_DRtg,
      playerDelta: Player_Delta,
      scPossConceded: 1 - StopPct,
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
      oppoFtPoss: 0.475*Opponent_FTA,
      oppoTov: Opponent_TOV,
      teamStl: Team_STL,
      // Advanced team numbers
      oppoFgMiss: Opponent_FGMiss,
      oppoNonStlTov: Opponent_NonStlTOV,
      teamMissWeight: TeamMissWeight,
      oppoFtPct: Opponent_FTA > 0 ? Opponent_FTM/Opponent_FTA : 0,
      oppoFtHitOnePlus: Opponent_HitFTs*0.475*Opponent_FTA,
      oppoProbFtHitOnePlus: Opponent_HitFTs,
      oppoScPoss: ScPoss,
      oppoPtsPerScore: D_Pts_Per_ScPoss,
      teamRtg: Team_DRtg,
    } : undefined) ];
  }

  /** From https://www.basketball-reference.com/about/ratings.html */
  static buildORtg(statSet: Record<string, any>, calcDiags: boolean): [ any, ORtgDiagnostics | undefined ] {
    if (!statSet) return [ { value: 0.0 }, undefined ];

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

    return [TotPoss > 0 ? { value: 100 * (PProd / TotPoss) } : undefined, (calcDiags ? {
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
      ftxPoss: FTxPoss

    } : undefined) as (ORtgDiagnostics | undefined) ];
  }

}
