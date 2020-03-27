// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Utils
import { ORtgDiagnostics } from "../utils/StatsUtils";


type Props = {
  ortgDiags: ORtgDiagnostics
};
const RosterStatsDiagView: React.FunctionComponent<Props> = ({ortgDiags}) => {
  const d = ortgDiags;
  return <span>
    ORtg = Points_Produced/Adjusted_Possessions [<b>{d.ptsProd.toFixed(1)}</b>]/[<b>{d.adjPoss.toFixed(1)}</b>]<br/>
    <ul>
      <li>Points_Produced (compare raw: pts [<b>{d.rawPts}</b>] (fg:[<b>{d.ptsFgm}</b>] + ft:[<b>{d.rawFtm}</b>]), orb=[<b>{d.rawOrb}</b>], assist=[<b>{d.rawAssist}</b>])...</li>
      <li>... = PProd_From_ORB [<b>{d.ppOrb.toFixed(1)}</b>] +
      [<b>{((d.ppFg + d.ppAssist + d.rawFtm)*(1 - d.teamOrbContribPct)).toFixed(1)}</b>]
      (PProd_From_FG [<b>{d.ppFg.toFixed(1)}</b>] + PProd_From_AST [<b>{d.ppAssist.toFixed(1)}</b>] + PProd_From_FT [<b>{d.rawFtm}</b>],
      less Team_ORB_Contrib% [<b>{(100*d.teamOrbContribPct).toFixed(1)}%</b>]===[<b>{((d.ppFg + d.ppAssist + d.rawFtm)*d.teamOrbContribPct).toFixed(1)}</b>])
      </li>
      <ul>
        <li>PProd_From_FG: [<b>{d.ppFg.toFixed(1)}</b>] = Raw_FG_Pts [<b>{d.ptsFgm}</b>], less Team_Assist_Contrib% [<b>{(100*d.ppFgTeamAstPct).toFixed(1)}%</b>]===[<b>{(d.ptsFgm-d.ppFg).toFixed(1)}</b>]</li>
        <ul>
          <li><em>(Team_Assist_Contrib%: In the same way that Player gets rewarded for assisting their team, they get slightly less rewarded when they scored off an assist):</em></li>
          <li>Team_Assist_Contrib% [<b>{(100*d.ppFgTeamAstPct).toFixed(1)}%</b>] = Weighting ([<b>0.5</b>] * Player_eFG [<b>{(100*d.eFG).toFixed(1)}%</b>]) * Team_AssistRate [<b>{(100*d.teamAssistRate).toFixed(1)}%</b>]</li>
          <ul>
            <li><em>(The theory behind the weighting is that easier shots are harder to assist, so the higher the eFG the more credit to the assist.)</em></li>
            <li>Team_AssistRate: [<b>{(100*d.teamAssistRate).toFixed(1)}%</b>] = (Weighting [<b>1.14</b>] * (Others_AST [<b>{d.othersAssist}</b>] / Team_FGM [<b>{d.teamFgm}</b>])</li>
          </ul>
        </ul>
        <li>PProd_From_AST: [<b>{d.ppAssist.toFixed(1)}</b>] = Weighting ([<b>0.5</b>] * Team_Not_Player_eFG [<b>{(100*d.otherEfg).toFixed(1)}%</b>]) * Team_Not_Player_Pts_Per_Made_Shot [<b>{d.otherPtsPerFgm.toFixed(1)}</b>] * Player_Assists [<b>{d.rawAssist.toFixed(1)}</b>]</li>
        <li>PProd_From_FT = FTM [<b>{d.rawFtm}</b>]</li>
        <li>PProd_From_ORB: [<b>{d.ppOrb.toFixed(1)}</b>] = Team_ORB_Weight [<b>{(100*d.teamOrbWeight).toFixed(1)}%</b>] * ORB [<b>{d.rawOrb.toFixed(1)}</b>] * % Plays_Team_Scored [<b>{(100*d.teamScoredPlayPct).toFixed(1)}%</b>] * Pts_Per_Scoring_Possession [<b>{d.teamPtsPerScore.toFixed(1)}</b>] </li>
        <ul>
          <li><em>(Team_ORB_Weight is described below)</em></li>
          <li>% Plays_Team_Scored: [<b>{(100*d.teamScoredPlayPct).toFixed(1)}%</b>] = Scoring_Plays [<b>{d.teamScoringPoss.toFixed(1)}</b>] / Total_Plays [<b>{d.teamPlays.toFixed(1)}</b>]</li>
          <li>Pts_Per_Scoring_Possession: [<b>{d.teamPtsPerScore.toFixed(1)}</b>] = Team_Pts [<b>{d.teamPts}</b>] / (Team_FGM [<b>{d.teamFgm}</b>] + Team_FTs_Hit_1+ [<b>{d.teamFtHitOnePlus.toFixed(1)}</b>]) </li>
        </ul>
        <li><em>(Team_ORB_Contrib%: In the same way a Player gets rewarded for an ORB, they get slightly less reward for a score that comes off someone else's rebound):</em></li>
        <li>Team_ORB_Contrib%: [<b>{(100*d.teamOrbContribPct).toFixed(1)}</b>%] = Team_ORB_Weight [<b>{(100*d.teamOrbWeight).toFixed(1)}%</b>] * % Team_Scoring_Plays_From_Rebound [<b>{(100*d.teamScoreFromReboundPct).toFixed(1)}%</b>]</li>
        <ul>
          <li>% Team_Scoring_Plays_From_Rebound: [<b>{(100*d.teamScoreFromReboundPct).toFixed(1)}%</b>] = (Team_ORB [<b>{d.teamOrb}</b>] * % Plays_Team_Scored [<b>{(100*d.teamScoredPlayPct).toFixed(1)}%</b>]) / Scoring_Plays [<b>{d.teamScoringPoss.toFixed(1)}</b>] </li>
          <ul>
            <li>% Plays_Team_Scored: [<b>{(100*d.teamScoredPlayPct).toFixed(1)}%</b>] = Scoring_Plays [<b>{d.teamScoringPoss.toFixed(1)}</b>] / Total_Plays [<b>{d.teamPlays.toFixed(1)}</b>], same as above</li>
            <li>(Scoring_Plays and Total_Plays covered under Possessions, below)</li>
          </ul>
          <li>Team_ORB_Weight: [<b>{(100*d.teamOrbWeight).toFixed(1)}%</b>] = % Credit_To_Rebounder [<b>{(100*d.teamOrbCreditToRebounder).toFixed(1)}%</b>] / (
          % Credit_To_Rebounder [<b>{(100*d.teamOrbCreditToRebounder).toFixed(1)}%</b>] + % Credit_To_Scorer [<b>{(100*d.teamOrbCreditToScorer).toFixed(1)}%</b>])</li>
          <ul>
            <li><em>(The theory here is that we assign credit to the rebounder based on the relative difficulty of rebounding vs scoring)</em></li>
            <li>% Credit_To_Rebounder [<b>{(100*d.teamOrbCreditToRebounder).toFixed(1)}%</b>] = Team_No_Orb% [<b>{(100*(1 - d.teamOrbPct)).toFixed(1)}%</b>] * % Plays_Team_Score [<b>{(100*d.teamScoredPlayPct).toFixed(1)}%</b>]</li>
            <li>% Credit_To_Scorer = [<b>{(100*d.teamOrbCreditToScorer).toFixed(1)}%</b>] = Team_Orb% [<b>{(100*d.teamOrbPct).toFixed(1)}%</b>] * % Plays_Team_No_Score [<b>{(100*(1 - d.teamScoredPlayPct)).toFixed(1)}%</b>]</li>
          </ul>
        </ul>
      </ul>
    </ul>
  </span>;
};

export default RosterStatsDiagView;
