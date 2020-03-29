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

  const [ showMoreORtgPts, setShowMoreORtgPts ] = useState(false);
  const [ showMoreORtgPoss, setShowMoreORtgPoss ] = useState(false);

  const d = ortgDiags;
  return <span>
    ORtg = Points_Produced/Adjusted_Possessions [<b>{d.ptsProd.toFixed(1)}</b>] / [<b>{d.adjPoss.toFixed(1)}</b>]
    &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setShowMoreORtgPts(!showMoreORtgPts) }}>{showMoreORtgPts ? "less" : "more"} about points</a>)
    &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setShowMoreORtgPoss(!showMoreORtgPoss) }}>{showMoreORtgPoss ? "less" : "more"} about possessions</a>)
    <ul>
      <li>Points_Produced: [<b>{d.ptsProd.toFixed(1)}</b>] = PProd_From_ORB [<b>{d.ppOrb.toFixed(1)}</b>] +
      [<b>{((d.ppFg + d.ppAssist + d.rawFtm)*(1 - d.teamOrbContribPct)).toFixed(1)}</b>]
      (PProd_From_FG [<b>{d.ppFg.toFixed(1)}</b>] + FTM [<b>{d.rawFtm}</b>] + PProd_From_AST [<b>{d.ppAssist.toFixed(1)}</b>],
      less Team_ORB_Contrib% [<b>{(100*d.teamOrbContribPct).toFixed(1)}%</b>]==[<b>{((d.ppFg + d.ppAssist + d.rawFtm)*d.teamOrbContribPct).toFixed(1)}</b>])
      </li>
      <ul>
        <li><em>Compare raw stats: orb=[<b>{d.rawOrb}</b>], pts=[<b>{d.rawPts}</b>] (fg_pts=[<b>{d.ptsFgm}</b>] + ftm=[<b>{d.rawFtm}</b>]), assists=[<b>{d.rawAssist}</b>]</em></li>
      </ul>
      {showMoreORtgPts ?
      <span><li><u>Points section</u></li>
      <ul>
        <li>PProd_From_FG: [<b>{d.ppFg.toFixed(1)}</b>] = Raw_FG_Pts [<b>{d.ptsFgm}</b>], less Team_Assist_Contrib% [<b>{(100*d.ppFgTeamAstPct).toFixed(1)}%</b>]===[<b>{(d.ptsFgm-d.ppFg).toFixed(1)}</b>]</li>
        <ul>
          <li><em>(Team_Assist_Contrib%: In the same way that Player gets rewarded for assisting their team, they get slightly less rewarded when they scored off an assist):</em></li>
          <li>Team_Assist_Contrib% [<b>{(100*d.ppFgTeamAstPct).toFixed(1)}%</b>] = Weighting ([<b>0.5</b>] * Player_eFG [<b>{(100*d.eFG).toFixed(1)}%</b>]) * Team_Assist_Rate [<b>{(100*d.teamAssistRate).toFixed(1)}%</b>]</li>
          <ul>
            <li><em>(The theory behind the weighting is that easier shots are harder to assist, so the higher the eFG the more credit to the assist.)</em></li>
            <li>Team_Assist_Rate: [<b>{(100*d.teamAssistRate).toFixed(1)}%</b>] = (Weighting [<b>1.14</b>] * (Others_AST [<b>{d.othersAssist}</b>] / Team_FGM [<b>{d.teamFgm}</b>])</li>
          </ul>
        </ul>
        <li>PProd_From_AST: [<b>{d.ppAssist.toFixed(1)}</b>] = Weighting ([<b>0.5</b>] * Team_Not_Player_eFG [<b>{(100*d.otherEfg).toFixed(1)}%</b>]) * Team_Not_Player_Pts_Per_Made_Shot [<b>{d.otherPtsPerFgm.toFixed(1)}</b>] * Player_Assists [<b>{d.rawAssist.toFixed(1)}</b>]</li>
        <li>PProd_From_ORB: [<b>{d.ppOrb.toFixed(1)}</b>] = Team_ORB_Weight [<b>{(100*d.teamOrbWeight).toFixed(1)}%</b>] * ORB [<b>{d.rawOrb.toFixed(1)}</b>] * % Plays_Team_Scored [<b>{(100*d.teamScoredPlayPct).toFixed(1)}%</b>] * Pts_Per_Scoring_Possession [<b>{d.teamPtsPerScore.toFixed(1)}</b>] </li>
        <ul>
          <li><em>(Team_ORB_Weight is described under Team_ORB_Contrib%, below)</em></li>
          <li><em>(% Plays_Team_Scored is described in the possessions section, below)</em></li>
          <li>Pts_Per_Scoring_Possession: [<b>{d.teamPtsPerScore.toFixed(1)}</b>] = Team_Pts [<b>{d.teamPts}</b>] / Team_Scoring_Plays [<b>{d.teamScoringPoss.toFixed(1)}</b>]</li>
          <ul>
            <li><em>(Team_Scoring_Plays described under possessions section, below)</em></li>
          </ul>
        </ul>
        <li><em>(Team_ORB_Contrib%: In the same way a Player gets rewarded for an ORB, they get slightly less reward for a score that comes off someone else's rebound):</em></li>
        <li>Team_ORB_Contrib%: [<b>{(100*d.teamOrbContribPct).toFixed(1)}</b>%] = Team_ORB_Weight [<b>{(100*d.teamOrbWeight).toFixed(1)}%</b>] * % Team_Scoring_Plays_From_Rebound [<b>{(100*d.teamScoreFromReboundPct).toFixed(1)}%</b>]</li>
        <ul>
          <li>% Team_Scoring_Plays_From_Rebound: [<b>{(100*d.teamScoreFromReboundPct).toFixed(1)}%</b>] = (Team_ORB [<b>{d.teamOrb}</b>] * % Plays_Team_Scored [<b>{(100*d.teamScoredPlayPct).toFixed(1)}%</b>]) / Scoring_Plays [<b>{d.teamScoringPoss.toFixed(1)}</b>] </li>
          <ul>
            <li><em>(% Plays_Team_Scored is described in the possessions section, below)</em></li>
          </ul>
          <li>Team_ORB_Weight: [<b>{(100*d.teamOrbWeight).toFixed(1)}%</b>] = % Credit_To_Rebounder [<b>{(100*d.teamOrbCreditToRebounder).toFixed(1)}%</b>] / (
          % Credit_To_Rebounder [<b>{(100*d.teamOrbCreditToRebounder).toFixed(1)}%</b>] + % Credit_To_Scorer [<b>{(100*d.teamOrbCreditToScorer).toFixed(1)}%</b>])</li>
          <ul>
            <li><em>(The theory here is that we assign credit to the rebounder based on the relative difficulty of rebounding vs scoring)</em></li>
            <li>% Credit_To_Rebounder [<b>{(100*d.teamOrbCreditToRebounder).toFixed(1)}%</b>] = Team_No_ORB% [<b>{(100*(1 - d.teamOrbPct)).toFixed(1)}%</b>] * Team_Score% [<b>{(100*d.teamScoredPlayPct).toFixed(1)}%</b>]</li>
            <li>% Credit_To_Scorer = [<b>{(100*d.teamOrbCreditToScorer).toFixed(1)}%</b>] = Team_ORB% [<b>{(100*d.teamOrbPct).toFixed(1)}%</b>] * Team_No_Score% [<b>{(100*(1 - d.teamScoredPlayPct)).toFixed(1)}%</b>]</li>
          </ul>
        </ul>
      </ul></span> : null }
      <li>Adjusted_Possessions: [<b>{d.adjPoss.toFixed(1)}</b>] = Scoring_Possessions [<b>{d.scoringPoss.toFixed(1)}</b>] + Missed_FG_Possessions [<b>{d.fgxPoss.toFixed(1)}</b>] + Missed_FT_Possessions [<b>{d.ftxPoss.toFixed(1)}</b>] + TO [<b>{d.rawTo}</b>]</li>
      <ul>
        <li><em>Compare raw stats: poss=[<b>{d.offPoss.toFixed(1)}</b>] (fga=[<b>{d.rawFga}</b>] + 0.475*fta=[<b>{d.ftPoss.toFixed(1)}</b>] + to=[<b>{d.rawTo}</b>] - orb=[<b>{d.offPlaysLessPoss.toFixed(1)}</b>])</em></li>
      </ul>
      {showMoreORtgPoss ?
      <span><li><u>Possessions section</u></li>
      <ul>
        <li>Scoring_Possessions: [<b>{d.scoringPoss.toFixed(1)}</b>] = ORB_Part [<b>{d.orbPart.toFixed(1)}</b>] + (FG_Part [<b>{d.fgPart.toFixed(1)}</b>] + FT_Part [<b>{d.ftPart.toFixed(1)}</b>] + AST_Part [<b>{d.astPart.toFixed(1)}</b>],
        less Team_ORB_Contrib% [<b>{(100*d.teamOrbContribPct).toFixed(1)}%</b>]==[<b>{((d.fgPart + d.ftPart + d.astPart)*d.teamOrbContribPct).toFixed(1)}</b>])</li>
        <ul>
          <li>ORB_Part: [<b>{d.orbPart.toFixed(1)}</b>] = Team_ORB_Weight [<b>{(100*d.teamOrbWeight).toFixed(1)}%</b>]
          * Scoring_Plays_From_Rebound [<b>{(d.rawOrb*d.teamScoredPlayPct).toFixed(1)}</b>] (ORB [<b>{d.rawOrb}</b>] * % Plays_Team_Scored [<b>{(100*d.teamScoredPlayPct).toFixed(1)}%</b>]) </li>
          <ul>
            <li>% Plays_Team_Scored: [<b>{(100*d.teamScoredPlayPct).toFixed(1)}%</b>] = Team_Scoring_Plays [<b>{d.teamScoringPoss.toFixed(1)}</b>] / Team_Total_Plays [<b>{d.teamPlays.toFixed(1)}</b>]</li>
            <li>Team_Scoring_Plays: [<b>{d.teamScoringPoss.toFixed(1)}</b>] = Team_FGM [<b>{d.teamFgm}</b>] + Team_FTs_Hit_1+ [<b>{d.teamFtHitOnePlus.toFixed(1)}</b>]</li>
            <ul>
              <li>Team_FTs_Hit_1+: [<b>{d.teamFtHitOnePlus.toFixed(1)}</b>] = (1 - Team_FTs_Missed_Both% [<b>{(100*(1 - d.teamProbFtHitOnePlus)).toFixed(1)}%</b>]) * (0.475*Team_FTA) [<b>{(0.475*d.teamFta).toFixed(1)}</b>]</li>
              <ul>
                <li>Team_FTs_Missed_Both%: [<b>{(100*(1 - d.teamProbFtHitOnePlus)).toFixed(1)}%</b>] = (1 - Team_FT% [<b>{(100*d.teamFtPct).toFixed(1)}%</b>])^2</li>
                <li><em>(0.475*FTA is a standard equation for estimating the number of trips to the FT line)</em></li>
              </ul>
            </ul>
            <li>Team_Total_Plays: [<b>{d.teamPlays.toFixed(1)}</b>] = Team_FGA [<b>{d.teamFga}</b>] + (0.475*Team_FTA) [<b>{(0.475*d.teamFta).toFixed(1)}</b>] + Team_TOV [<b>{d.teamTo}</b>]</li>
            <li><em>(Team_ORB_Weight is described in the points section, above. The cost of the play is reduced like the reward of the score)</em></li>
          </ul>
          <li>FG_Part: [<b>{d.fgPart.toFixed(1)}</b>] = FGM [<b>{d.rawFgm}</b>], less Team_Assist_Contrib% [<b>{(100*d.ppFgTeamAstPct).toFixed(1)}%</b>]===[<b>{(d.rawFgm*d.ppFgTeamAstPct).toFixed(1)}</b>]</li>
          <ul>
            <li><em>(Team_Assist_Contrib% is described in the points section, above. Since it reduces the reward of a score, it also reduces the cost of the play)</em></li>
          </ul>
          <li>FT_Part: [<b>{d.ftPart.toFixed(1)}</b>] = (1 - Missed_Both_FTs% [<b>{(100*d.missedBothFTs).toFixed(1)}%</b>]) * 0.475*FTA [<b>{d.ftPoss.toFixed(1)}</b>]</li>
          <ul>
            <li>Missed_Both_FTs%: [<b>{(100*d.missedBothFTs).toFixed(1)}%</b>] = (1 - FT% [<b>{(100*d.ftPct).toFixed(1)}%</b>])^2</li>
          </ul>
          <li>AST_Part: [<b>{d.astPart.toFixed(1)}</b>] = Weighting ([<b>0.5</b>] * Team_Not_Player_eFG [<b>{(100*d.otherEfg).toFixed(1)}%</b>]) * AST [<b>{d.rawAssist}</b>]</li>
          <li><em>(Team_ORB_Contrib% is described in the points section, above. Since it reduces the reward of a score, it also reduces the cost of the play)</em></li>
        </ul>
        <li>Missed_FG_Possessions: [<b>{d.fgxPoss.toFixed(1)}</b>] = Missed_FG [<b>{d.rawFgx.toFixed(1)}</b>], less Team_Rebound_Weight [<b>{(107*d.teamOrbPct).toFixed(1)}%</b>]==[<b>{(1.07*d.teamOrbPct*d.rawFgx).toFixed(1)}</b>]</li>
        <ul>
          <li><em>(Team_Rebound_Weight: each missed shot doesn't count a full possession, because it may be rebounded)</em></li>
          <li>Team_Rebound_Weight: [<b>{(107*d.teamOrbPct).toFixed(1)}%</b>] = Weight [<b>1.07</b>] * Team_ORB% [<b>{(100*d.teamOrbPct).toFixed(1)}%</b>]</li>
        </ul>
        <li>Missed_FT_Possessions: [<b>{d.ftxPoss.toFixed(1)}</b>] = Missed_Both_FTs% [<b>{(100*d.missedBothFTs).toFixed(1)}%</b>] * 0.475*FTA [<b>{d.ftPoss.toFixed(1)}</b>]</li>
        <ul>
          <li><em>(FT possession calcs above, under Team_Scoring_Plays)</em></li>
        </ul>
      </ul></span> : null }
    </ul>
  </span>;
};

export default RosterStatsDiagView;
