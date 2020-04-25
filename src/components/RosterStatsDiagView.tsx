// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Utils
import { ORtgDiagnostics, DRtgDiagnostics } from "../utils/StatsUtils";


type Props = {
  ortgDiags: ORtgDiagnostics,
  drtgDiags: DRtgDiagnostics,
};
const RosterStatsDiagView: React.FunctionComponent<Props> = ({ortgDiags, drtgDiags}) => {

  const [ showMoreORtgPts, setShowMoreORtgPts ] = useState(false);
  const [ showMoreORtgPoss, setShowMoreORtgPoss ] = useState(false);
  const [ showMoreORtgAdj, setShowMoreORtgAdj ] = useState(false);
  const [ showMoreDRtg, setShowMoreDRtg ] = useState(false);

//      &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setShowMoreORtgAdj(!showMoreORtgAdj) }}>{showMoreORtgAdj ? "less" : "more"} about adjusted rating</a>)


  const o = ortgDiags;
  const d = drtgDiags;
  return <span>
    ORtg = Points_Produced [<b>{o.ptsProd.toFixed(1)}</b>] / Adjusted_Possessions [<b>{o.adjPoss.toFixed(1)}</b>]
    &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setShowMoreORtgPts(!showMoreORtgPts) }}>{showMoreORtgPts ? "less" : "more"} about points</a>)
    &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setShowMoreORtgPoss(!showMoreORtgPoss) }}>{showMoreORtgPoss ? "less" : "more"} about possessions</a>)
    <ul>
      <li>Points_Produced: [<b>{o.ptsProd.toFixed(1)}</b>] = PProd_From_ORB [<b>{o.ppOrb.toFixed(1)}</b>] +
      [<b>{((o.ppFg + o.ppAssist + o.rawFtm)*(1 - o.teamOrbContribPct)).toFixed(1)}</b>]
      (PProd_From_FG [<b>{o.ppFg.toFixed(1)}</b>] + FTM [<b>{o.rawFtm}</b>] + PProd_From_AST [<b>{o.ppAssist.toFixed(1)}</b>],
      less Team_ORB_Contrib% [<b>{(100*o.teamOrbContribPct).toFixed(1)}%</b>]==[<b>{((o.ppFg + o.ppAssist + o.rawFtm)*o.teamOrbContribPct).toFixed(1)}</b>])
      </li>
      <ul>
        <li><em>Compare raw stats: orb=[<b>{o.rawOrb}</b>], pts=[<b>{o.rawPts}</b>] (fg_pts=[<b>{o.ptsFgm}</b>] + ftm=[<b>{o.rawFtm}</b>]), assists=[<b>{o.rawAssist}</b>]</em></li>
      </ul>
      {showMoreORtgPts ?
      <span><li><u>Points section</u></li>
      <ul>
        <li>PProd_From_FG: [<b>{o.ppFg.toFixed(1)}</b>] = Raw_FG_Pts [<b>{o.ptsFgm}</b>], less Team_Assist_Contrib% [<b>{(100*o.ppFgTeamAstPct).toFixed(1)}%</b>]===[<b>{(o.ptsFgm-o.ppFg).toFixed(1)}</b>]</li>
        <ul>
          <li><em>(Team_Assist_Contrib%: In the same way that Player gets rewarded for assisting their team, they get slightly less rewarded when they scored off an assist):</em></li>
          <li>Team_Assist_Contrib% [<b>{(100*o.ppFgTeamAstPct).toFixed(1)}%</b>] = Weighting ([<b>0.5</b>] * Player_eFG [<b>{(100*o.eFG).toFixed(1)}%</b>]) * Team_Assist_Rate [<b>{(100*o.teamAssistRate).toFixed(1)}%</b>]</li>
          <ul>
            <li><em>(The theory behind the weighting is that easier shots are harder to assist, so the higher the eFG the more credit to the assist.)</em></li>
            <li>Team_Assist_Rate: [<b>{(100*o.teamAssistRate).toFixed(1)}%</b>] = (Weighting [<b>1.14</b>] * (Others_AST [<b>{o.othersAssist}</b>] / Team_FGM [<b>{o.teamFgm}</b>])</li>
          </ul>
        </ul>
        <li>PProd_From_AST: [<b>{o.ppAssist.toFixed(1)}</b>] = Weighting ([<b>0.5</b>] * Team_Not_Player_eFG [<b>{(100*o.otherEfg).toFixed(1)}%</b>]) * Team_Not_Player_Pts_Per_Made_Shot [<b>{o.otherPtsPerFgm.toFixed(1)}</b>] * Player_Assists [<b>{o.rawAssist.toFixed(1)}</b>]</li>
        <li>PProd_From_ORB: [<b>{o.ppOrb.toFixed(1)}</b>] = Team_ORB_Weight [<b>{(100*o.teamOrbWeight).toFixed(1)}%</b>] * ORB [<b>{o.rawOrb.toFixed(1)}</b>] * % Plays_Team_Scored [<b>{(100*o.teamScoredPlayPct).toFixed(1)}%</b>] * Pts_Per_Scoring_Possession [<b>{o.teamPtsPerScore.toFixed(1)}</b>] </li>
        <ul>
          <li><em>(Team_ORB_Weight is described under Team_ORB_Contrib%, below)</em></li>
          <li><em>(% Plays_Team_Scored is described in the possessions section, below)</em></li>
          <li>Pts_Per_Scoring_Possession: [<b>{o.teamPtsPerScore.toFixed(1)}</b>] = Team_Pts [<b>{o.teamPts}</b>] / Team_Scoring_Plays [<b>{o.teamScoringPoss.toFixed(1)}</b>]</li>
          <ul>
            <li><em>(Team_Scoring_Plays described under possessions section, below)</em></li>
          </ul>
        </ul>
        <li><em>(Team_ORB_Contrib%: In the same way a Player gets rewarded for an ORB, they get slightly less reward for a score that comes off someone else's rebound):</em></li>
        <li>Team_ORB_Contrib%: [<b>{(100*o.teamOrbContribPct).toFixed(1)}</b>%] = Team_ORB_Weight [<b>{(100*o.teamOrbWeight).toFixed(1)}%</b>] * % Team_Scoring_Plays_From_Rebound [<b>{(100*o.teamScoreFromReboundPct).toFixed(1)}%</b>]</li>
        <ul>
          <li>% Team_Scoring_Plays_From_Rebound: [<b>{(100*o.teamScoreFromReboundPct).toFixed(1)}%</b>] = (Team_ORB [<b>{o.teamOrb}</b>] * % Plays_Team_Scored [<b>{(100*o.teamScoredPlayPct).toFixed(1)}%</b>]) / Scoring_Plays [<b>{o.teamScoringPoss.toFixed(1)}</b>] </li>
          <ul>
            <li><em>(% Plays_Team_Scored is described in the possessions section, below)</em></li>
          </ul>
          <li>Team_ORB_Weight: [<b>{(100*o.teamOrbWeight).toFixed(1)}%</b>] = % Credit_To_Rebounder [<b>{(100*o.teamOrbCreditToRebounder).toFixed(1)}%</b>] / (
          % Credit_To_Rebounder [<b>{(100*o.teamOrbCreditToRebounder).toFixed(1)}%</b>] + % Credit_To_Scorer [<b>{(100*o.teamOrbCreditToScorer).toFixed(1)}%</b>])</li>
          <ul>
            <li><em>(The theory here is that we assign credit to the rebounder based on the relative difficulty of rebounding vs scoring)</em></li>
            <li>% Credit_To_Rebounder: [<b>{(100*o.teamOrbCreditToRebounder).toFixed(1)}%</b>] = Team_No_ORB% [<b>{(100*(1 - o.teamOrbPct)).toFixed(1)}%</b>] * Team_Score% [<b>{(100*o.teamScoredPlayPct).toFixed(1)}%</b>]</li>
            <li>% Credit_To_Scorer: [<b>{(100*o.teamOrbCreditToScorer).toFixed(1)}%</b>] = Team_ORB% [<b>{(100*o.teamOrbPct).toFixed(1)}%</b>] * Team_No_Score% [<b>{(100*(1 - o.teamScoredPlayPct)).toFixed(1)}%</b>]</li>
          </ul>
        </ul>
      </ul></span> : null }
      <li>Adjusted_Possessions: [<b>{o.adjPoss.toFixed(1)}</b>] = Scoring_Possessions [<b>{o.scoringPoss.toFixed(1)}</b>] + Missed_FG_Possessions [<b>{o.fgxPoss.toFixed(1)}</b>] + Missed_FT_Possessions [<b>{o.ftxPoss.toFixed(1)}</b>] + TO [<b>{o.rawTo}</b>]</li>
      <ul>
        <li><em>Compare raw stats: poss=[<b>{o.offPoss.toFixed(1)}</b>] (fga=[<b>{o.rawFga}</b>] + 0.475*fta=[<b>{o.ftPoss.toFixed(1)}</b>] + to=[<b>{o.rawTo}</b>] - orb=[<b>{o.offPlaysLessPoss.toFixed(1)}</b>])</em></li>
      </ul>
      {showMoreORtgPoss ?
      <span><li><u>Possessions section</u></li>
      <ul>
        <li>Scoring_Possessions: [<b>{o.scoringPoss.toFixed(1)}</b>] = ORB_Part [<b>{o.orbPart.toFixed(1)}</b>] + (FG_Part [<b>{o.fgPart.toFixed(1)}</b>] + FT_Part [<b>{o.ftPart.toFixed(1)}</b>] + AST_Part [<b>{o.astPart.toFixed(1)}</b>],
        less Team_ORB_Contrib% [<b>{(100*o.teamOrbContribPct).toFixed(1)}%</b>]==[<b>{((o.fgPart + o.ftPart + o.astPart)*o.teamOrbContribPct).toFixed(1)}</b>])</li>
        <ul>
          <li>ORB_Part: [<b>{o.orbPart.toFixed(1)}</b>] = Team_ORB_Weight [<b>{(100*o.teamOrbWeight).toFixed(1)}%</b>]
          * Scoring_Plays_From_Rebound [<b>{(o.rawOrb*o.teamScoredPlayPct).toFixed(1)}</b>] (ORB [<b>{o.rawOrb}</b>] * % Plays_Team_Scored [<b>{(100*o.teamScoredPlayPct).toFixed(1)}%</b>]) </li>
          <ul>
            <li>% Plays_Team_Scored: [<b>{(100*o.teamScoredPlayPct).toFixed(1)}%</b>] = Team_Scoring_Plays [<b>{o.teamScoringPoss.toFixed(1)}</b>] / Team_Total_Plays [<b>{o.teamPlays.toFixed(1)}</b>]</li>
            <li>Team_Scoring_Plays: [<b>{o.teamScoringPoss.toFixed(1)}</b>] = Team_FGM [<b>{o.teamFgm}</b>] + Team_FTs_Hit_1+ [<b>{o.teamFtHitOnePlus.toFixed(1)}</b>]</li>
            <ul>
              <li>Team_FTs_Hit_1+: [<b>{o.teamFtHitOnePlus.toFixed(1)}</b>] = (1 - Team_FTs_Missed_Both% [<b>{(100*(1 - o.teamProbFtHitOnePlus)).toFixed(1)}%</b>]) * (0.475*Team_FTA) [<b>{(0.475*o.teamFta).toFixed(1)}</b>]</li>
              <ul>
                <li>Team_FTs_Missed_Both%: [<b>{(100*(1 - o.teamProbFtHitOnePlus)).toFixed(1)}%</b>] = (1 - Team_FT% [<b>{(100*o.teamFtPct).toFixed(1)}%</b>])^2</li>
                <li><em>(0.475*FTA is a standard equation for estimating the number of trips to the FT line)</em></li>
              </ul>
            </ul>
            <li>Team_Total_Plays: [<b>{o.teamPlays.toFixed(1)}</b>] = Team_FGA [<b>{o.teamFga}</b>] + (0.475*Team_FTA) [<b>{(0.475*o.teamFta).toFixed(1)}</b>] + Team_TOV [<b>{o.teamTo}</b>]</li>
            <li><em>(Team_ORB_Weight is described in the points section, above. The cost of the play is reduced like the reward of the score)</em></li>
          </ul>
          <li>FG_Part: [<b>{o.fgPart.toFixed(1)}</b>] = FGM [<b>{o.rawFgm}</b>], less Team_Assist_Contrib% [<b>{(100*o.ppFgTeamAstPct).toFixed(1)}%</b>]===[<b>{(o.rawFgm*o.ppFgTeamAstPct).toFixed(1)}</b>]</li>
          <ul>
            <li><em>(Team_Assist_Contrib% is described in the points section, above. Since it reduces the reward of a score, it also reduces the cost of the play)</em></li>
          </ul>
          <li>FT_Part: [<b>{o.ftPart.toFixed(1)}</b>] = (1 - Missed_Both_FTs% [<b>{(100*o.missedBothFTs).toFixed(1)}%</b>]) * 0.475*FTA [<b>{o.ftPoss.toFixed(1)}</b>]</li>
          <ul>
            <li>Missed_Both_FTs%: [<b>{(100*o.missedBothFTs).toFixed(1)}%</b>] = (1 - FT% [<b>{(100*o.ftPct).toFixed(1)}%</b>])^2</li>
          </ul>
          <li>AST_Part: [<b>{o.astPart.toFixed(1)}</b>] = Weighting ([<b>0.5</b>] * Team_Not_Player_eFG [<b>{(100*o.otherEfg).toFixed(1)}%</b>]) * AST [<b>{o.rawAssist}</b>]</li>
          <li><em>(Team_ORB_Contrib% is described in the points section, above. Since it reduces the reward of a score, it also reduces the cost of the play)</em></li>
        </ul>
        <li>Missed_FG_Possessions: [<b>{o.fgxPoss.toFixed(1)}</b>] = Missed_FG [<b>{o.rawFgx.toFixed(1)}</b>], less Team_Rebound_Weight [<b>{(107*o.teamOrbPct).toFixed(1)}%</b>]==[<b>{(1.07*o.teamOrbPct*o.rawFgx).toFixed(1)}</b>]</li>
        <ul>
          <li><em>(Team_Rebound_Weight: each missed shot doesn't count a full possession, because it may be rebounded)</em></li>
          <li>Team_Rebound_Weight: [<b>{(107*o.teamOrbPct).toFixed(1)}%</b>] = Weight [<b>1.07</b>] * Team_ORB% [<b>{(100*o.teamOrbPct).toFixed(1)}%</b>]</li>
        </ul>
        <li>Missed_FT_Possessions: [<b>{o.ftxPoss.toFixed(1)}</b>] = Missed_Both_FTs% [<b>{(100*o.missedBothFTs).toFixed(1)}%</b>] * 0.475*FTA [<b>{o.ftPoss.toFixed(1)}</b>]</li>
        <ul>
          <li><em>(FT possession calcs above, under Team_Scoring_Plays)</em></li>
        </ul>
      </ul></span> : null }
      <li><b>Adjusted ORtg</b>: [<b>{o.adjORtg.toFixed(1)}</b>] = (ORtg [<b>{o.oRtg.toFixed(1)}</b>] + Usage_Bonus [<b>{o.usageBonus.toFixed(1)}</b>]) * (Avg_Efficiency [<b>{o.avgEff.toFixed(1)}</b>] / Def_SOS [<b>{o.defSos.toFixed(1)}</b>])
      </li>
    </ul>
    DRtg = Team_DRtg [<b>{d.teamRtg.toFixed(1)}</b>] + Player_Delta [<b>{d.playerDelta.toFixed(1)}</b>]
    &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setShowMoreDRtg(!showMoreDRtg) }}>{showMoreDRtg ? "less" : "more"} about DRtg</a>)
    <ul>
      <li>Team_DRtg: [<b>{d.teamRtg.toFixed(1)}</b>] = 100 * Opponent_Pts [<b>{d.oppoPts.toFixed(0)}</b>] / Opponent_Poss [<b>{d.oppoPoss.toFixed(0)}</b>] <em>(only counting while player was on floor)</em></li>
      <li>Player_Delta: [<b>{(d.playerDelta).toFixed(1)}</b>] = (Player_DRtg [<b>{d.playerRtg.toFixed(1)}</b>] - Team_DRtg [<b>{d.teamRtg.toFixed(1)}</b>]) / Team_Size [<b>5</b>]</li>
      <ul>
        <li>Player_DRtg:  [<b>{d.playerRtg.toFixed(1)}</b>] = 100 * Pts_Per_Score [<b>{d.oppoPtsPerScore.toFixed(1)}</b>] * Score_Conceded_By_Player% [<b>{(100*d.scPossConceded).toFixed(1)}%</b>]</li>
      </ul>
      <li><b>Adjusted DRtg</b>: [<b>{d.adjDRtg.toFixed(1)}</b>] = DRtg [<b>{d.dRtg.toFixed(1)}</b>] * (Avg_Efficiency [<b>{d.avgEff.toFixed(1)}</b>] / Off_SOS [<b>{d.offSos.toFixed(1)}</b>])</li>
      {showMoreDRtg ?
      <span><li><u>DRtg details</u></li>
      <ul>
        <li><em>(Note: you can also view this as DRtg [<b>{(d.teamRtg + d.playerDelta).toFixed(1)}</b>] = ([<b>20%</b>] * Player_DRtg [<b>{d.playerRtg.toFixed(1)}</b>]) + ([<b>80%</b>] * Team_DRtg [<b>{d.teamRtg.toFixed(1)}</b>]);
        ie a weighted average of a player's defense when actively involved,
        vs when passively involved, eg guarding off ball (where the best you can do is use the Team_DRtg). This assumes every player is "targeted" 1/5th of the time.</em></li>
        <li>Pts_Per_Score: [<b>{d.oppoPtsPerScore.toFixed(1)}</b>] = Opponent_PTS [<b>{d.oppoPts.toFixed(0)}</b>] / Scoring_Plays [<b>{d.oppoScPoss.toFixed(1)}</b>]</li>
        <ul>
          <li>Scoring_Plays: [<b>{d.oppoScPoss.toFixed(1)}</b>] = Opponent_FGM [<b>{d.oppoFgm.toFixed(0)}</b>] + Opponent_FTs_Hit_1+ [<b>{d.oppoFtHitOnePlus.toFixed(1)}</b>]</li>
          <ul>
            <li>Opponent_FTs_Hit_1+: [<b>{d.oppoFtHitOnePlus.toFixed(1)}</b>] = (1 - Opponent_FTs_Missed_Both% [<b>{(100*(1 - d.oppoProbFtHitOnePlus)).toFixed(1)}%</b>]) * (0.475*Opponent_FTA) [<b>{d.oppoFtPoss.toFixed(1)}</b>]</li>
            <ul>
              <li>Opponent_FTs_Missed_Both%: [<b>{(100*(1 - d.oppoProbFtHitOnePlus)).toFixed(1)}%</b>] = (1 - Opponent_FT% [<b>{(100*d.oppoFtPct).toFixed(1)}%</b>])^2</li>
              <li><em>(0.475*FTA is a standard equation for estimating the number of trips to the FT line)</em></li>
            </ul>
          </ul>
        </ul>
        <li>Score_Conceded_By_Player%: [<b>{(100*d.scPossConceded).toFixed(1)}%</b>] = 1 - Stops_Credit_Player% [<b>{(100*d.stopsIndPct).toFixed(1)}%</b>] - Stops_Credit_Team% [<b>{(100*d.stopsTeamPct).toFixed(1)}%</b>]</li>
        <ul>
          <li><em>(We split stops into those that can be at least partially assigned to a player, and those where the best you can do is use the team stats)</em></li>
          <li>Stops_Credit_Player%: [<b>{(100*d.stopsIndPct).toFixed(1)}%</b>] = (NoShot_Credit [<b>{d.noShotCredit.toFixed(1)}</b>] + Rebound_Credit [<b>{d.reboundCredit.toFixed(1)}</b>] + MissFT_Credit [<b>{d.missFtCredit.toFixed(1)}</b>]) / (20% * Opponent_Poss) [<b>{(0.2*d.oppoPoss).toFixed(1)}</b>]</li>
          <ul>
            <li>NoShot_Credit: [<b>{d.noShotCredit.toFixed(1)}</b>] = Steals [<b>{d.stl.toFixed(0)}</b>] + (Block [<b>{d.blk.toFixed(0)}</b>] * Opponent_Miss_Credit% [<b>{(100*d.teamMissWeight).toFixed(1)}%</b>])</li>
            <ul>
              <li>Opponent_Miss_Credit%: [<b>{(100*d.teamMissWeight).toFixed(1)}%</b>] = Miss_vs_Rebound_Credit% [<b>{(100*d.teamDvsRebCredit).toFixed(1)}%</b>] * Team_Rebound_Miss% [<b>{(107 - 107*d.opponentOrbPct).toFixed(1)}%</b>]</li>
              <li>Miss_vs_Rebound_Credit%: [<b>{(100*d.teamDvsRebCredit).toFixed(1)}%</b>] = % Credit_To_Shot_Defense [<b>{(100*d.teamOrbCreditToDefender).toFixed(1)}%</b>] / (% Credit_To_Shot_Defense [<b>{(100*d.teamOrbCreditToDefender).toFixed(1)}%</b>] + % Credit_To_Rebounder [<b>{(100*d.teamOrbCreditToRebounder).toFixed(1)}%</b>]) </li>
              <ul>
                <li><em>(The theory here is that after a missed shot and a defensive rebound, we assign credit to the shot defender based on the relative difficulty of preventing the score vs rebounding the miss)</em></li>
                <li>% Credit_To_Shot_Defense: [<b>{(100*d.teamOrbCreditToDefender).toFixed(1)}%</b>] = Opponent_FG% [<b>{(100*d.opponentFgPct).toFixed(1)}%</b>] * Team_DRB% [<b>{(100 - 100*d.opponentOrbPct).toFixed(1)}%</b>]</li>
                <li>% Credit_To_Rebounder: [<b>{(100*d.teamOrbCreditToRebounder).toFixed(1)}%</b>] = Opponent_FGmiss% [<b>{(100 - 100*d.opponentFgPct).toFixed(1)}%</b>] * Opponent_ORB% [<b>{(100*d.opponentOrbPct).toFixed(1)}%</b>]</li>
              </ul>
              <li>Team_Rebound_Miss%: [<b>{(107 - 107*d.opponentOrbPct).toFixed(1)}%</b>] = Miss_Rebound_Weight [<b>107%</b>] * Team_DRB% [<b>{(100 - 100*d.opponentOrbPct).toFixed(1)}%</b>]</li>
            </ul>
            <li>Rebound_Credit: [<b>{d.reboundCredit.toFixed(1)}</b>] = Rebounds [<b>{d.drb.toFixed(0)}</b>] * (1 - Miss_vs_Rebound_Credit% [<b>{(100*d.teamDvsRebCredit).toFixed(1)}%</b>])</li>
            <li>MissFT_Credit: [<b>{d.missFtCredit.toFixed(1)}</b>] = PF% [<b>{(100*d.pfPct).toFixed(1)}%</b>] * (0.475*Opponent_FTA) [<b>{d.oppoFtPoss.toFixed(1)}</b>] * Opponent_FTs_Missed_Both% [<b>{(100*(1 - d.oppoProbFtHitOnePlus)).toFixed(1)}%</b>]</li>
            <ul>
              <li><em>(0.475*FTA is a standard equation for estimating the number of trips to the FT line)</em></li>
            </ul>
          </ul>
          <li>Stops_Credit_Team%: [<b>{(100*d.stopsTeamPct).toFixed(1)}%</b>] = ((Opponent_FGMiss [<b>{d.oppoFgMiss.toFixed(0)}</b>] * Opponent_Miss_Credit% [<b>{(100*d.teamMissWeight).toFixed(1)}%</b>]) + Opponent_NonSteal_TOV [<b>{d.oppoNonStlTov.toFixed(0)}</b>]) / Opponent_Poss [<b>{(d.oppoPoss).toFixed(0)}</b>]</li>
          <ul>
            <li><em>(Opponent_Miss_Credit% is described under Stops_Credit_Player%, above)</em></li>
            <li>Opponent_FGMiss: [<b>{d.oppoFgMiss.toFixed(0)}</b>] = Opponent_FGA [<b>{d.oppoFga}</b>] - Opponent_FGM [<b>{d.oppoFgm}</b>] - Team_BLK [<b>{d.teamBlk}</b>]</li>
            <li>Opponent_NonSteal_TOV: [<b>{d.oppoNonStlTov.toFixed(0)}</b>] = Opponent_TOV [<b>{d.oppoTov}</b>] - Team_STL [<b>{d.teamStl}</b>]</li>
          </ul>
        </ul>
      </ul></span> : null
      }
    </ul>
  </span>;
};

export default RosterStatsDiagView;
