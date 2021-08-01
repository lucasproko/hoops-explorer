// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Utils
import { ORtgDiagnostics, DRtgDiagnostics } from "../../utils/stats/RatingUtils";

type Props = {
  ortgDiags: ORtgDiagnostics,
  drtgDiags: DRtgDiagnostics,
};
const RosterStatsDiagView: React.FunctionComponent<Props> = ({ortgDiags, drtgDiags}) => {

  const [ showMoreORtgPts, setShowMoreORtgPts ] = useState(false);
  const [ showMoreORtgPoss, setShowMoreORtgPoss ] = useState(false);
  const [ showMoreORtgAdj, setShowMoreORtgAdj ] = useState(false);
  const [ showMoreDRtg, setShowMoreDRtg ] = useState(false);
  const [ showMoreOnBallDRtg, setShowMoreOnBallDRtg ] = useState(false);

  const o = ortgDiags;
  const d = drtgDiags;
  const dbd = drtgDiags.onBallDiags;
  const dbs = drtgDiags.onBallDef;
  return <span>
    ORtg: [<b>{o.oRtg.toFixed(1)}</b>] = Points_Produced [<b>{o.ptsProd.toFixed(1)}</b>] / Adjusted_Possessions [<b>{o.adjPoss.toFixed(1)}</b>]
    (<a href="#" onClick={(event) => { event.preventDefault(); setShowMoreORtgPts(!showMoreORtgPts) }}>{showMoreORtgPts ? "less" : "more"} about points</a>)
    (<a href="#" onClick={(event) => { event.preventDefault(); setShowMoreORtgPoss(!showMoreORtgPoss) }}>{showMoreORtgPoss ? "less" : "more"} about possessions</a>)
    (<a href="#" onClick={(event) => { event.preventDefault(); setShowMoreORtgAdj(!showMoreORtgAdj) }}>{showMoreORtgAdj ? "less" : "more"} about Adj+ ORtg</a>)
    <ul>
      <li>Points_Produced: [<b>{o.ptsProd.toFixed(1)}</b>] = PProd_From_ORB [<b>{o.ppOrb.toFixed(1)}</b>] +
      [<b>{((o.ppFg + o.ppAssist + o.rawFtm)*(1 - o.teamOrbContribPct)).toFixed(1)}</b>]
      (PProd_From_FG [<b>{o.ppFg.toFixed(1)}</b>] + FTM [<b>{o.rawFtm.toFixed(1)}</b>] + PProd_From_AST [<b>{o.ppAssist.toFixed(1)}</b>],
      less Team_ORB_Contrib% [<b>{(100*o.teamOrbContribPct).toFixed(1)}%</b>]==[<b>{((o.ppFg + o.ppAssist + o.rawFtm)*o.teamOrbContribPct).toFixed(1)}</b>])
      </li>
      <ul>
        <li><em>Compare raw stats: orb=[<b>{o.rawOrb.toFixed(1)}</b>], pts=[<b>{o.rawPts.toFixed(1)}</b>] (fg_pts=[<b>{o.ptsFgm.toFixed(1)}</b> = <b>3</b>*<b>{o.raw3Fgm.toFixed(1)}</b> + <b>2</b>*(<b>{o.raw2midFgm.toFixed(1)}</b> + <b>{o.raw2rimFgm.toFixed(1)}</b>)] + ftm=[<b>{o.rawFtm.toFixed(1)}</b>]), assists=[<b>{o.rawAssist.toFixed(1)}</b>]</em></li>
      </ul>
      {showMoreORtgPts ?
      <span><li><u>Points section</u></li>
      <ul>
        <li>PProd_From_FG: [<b>{o.ppFg.toFixed(1)}</b>] = Raw_FG_Pts [<b>{o.ptsFgm.toFixed(1)}</b>], less Team_Assist_Contrib% [<b>{(100*o.ppFgTeamAstPct).toFixed(1)}%</b>] * Assisted_Pts_Per_FG_Bonus [<b>{((o.ptsFgm-o.ppFg)/((o.ptsFgm || 1)*(o.ppFgTeamAstPct || 1))).toFixed(2)}</b>], gives [<b>{(o.ptsFgm-o.ppFg).toFixed(1)}</b>]</li>
        <ul>
          <li><em>(Team_Assist_Contrib%: In the same way that Player gets rewarded for assisting their team, they get slightly less rewarded when they scored off an assist):</em></li>
          <li>Team_Assist_Contrib% [<b>{(100*o.ppFgTeamAstPct).toFixed(1)}%</b>] = Weighting ([<b>0.5</b>] * Player_Assisted_eFG [~<b>{(100*o.teamAssistedEfg).toFixed(1)}%</b>]) * Player_Assisted_Rate [~<b>{(100*o.teamAssistRate).toFixed(1)}%</b>] (averaged over shot types)</li>
          <ul>
            <li><em>(The theory behind the weighting is that easier shots are harder to assist, so the higher the eFG the more credit to the assist.)</em></li>
            <li><em>The above values are calculated using a player's assist networks vs shot type. The "classic" algorithm approximates from box scores, giving ORtg=[<b>{o.oRtg_Classic.toFixed(1)}</b>]:</em></li>
            <ul>
              <li><em>(Classic) Team_Assist_Contrib% [<b>{(100*o.ppFgTeamAstPct_Classic).toFixed(1)}%</b>] = Weighting ([<b>0.5</b>] * Player_eFG [<b>{(100*o.eFG).toFixed(1)}%</b>]) * Team_Assist_Rate [<b>{(100*o.teamAssistRate_Classic).toFixed(1)}%</b>]</em></li>
              <li><em>(Classic) Team_Assist_Rate: [<b>{(100*o.teamAssistRate_Classic).toFixed(1)}%</b>] = (Weighting [<b>1.14</b>] * (Others_AST [<b>{o.othersAssist.toFixed(0)}</b>] / Team_FGM [<b>{o.teamFgm.toFixed(0)}</b>])</em></li>
            </ul>
          </ul>
        </ul>
        <li>PProd_From_AST: [<b>{o.ppAssist.toFixed(1)}</b>] = Sum(Shot Type)[Weighting ([<b>0.5</b>] * ShotType_eFG [<b>{(o.otherEfgInfo.join("/"))}</b>]%) * [<b>3/2/2</b>]pts * Player_Assists [<b>{o.rawAssistInfo.join("/")}</b>]]</li>
        <ul>
          <li><em>(Classic) PProd_From_AST: [<b>{o.ppAssist_Classic.toFixed(1)}</b>] = Weighting ([<b>0.5</b>] * Team_Not_Player_eFG [<b>{(100*o.otherEfg).toFixed(1)}%</b>]) * Team_Not_Player_Pts_Per_Made_Shot [<b>{o.otherPtsPerFgm.toFixed(1)}</b>] * Player_Assists [<b>{o.rawAssist.toFixed(0)}</b>]</em></li>
        </ul>
        <li>PProd_From_ORB: [<b>{o.ppOrb.toFixed(1)}</b>] = Team_ORB_Weight [<b>{(100*o.teamOrbWeight).toFixed(1)}%</b>] * ORB [<b>{o.rawOrb.toFixed(1)}</b>] * % Plays_Team_Scored [<b>{(100*o.teamScoredPlayPct).toFixed(1)}%</b>] * Pts_Per_Scoring_Possession [<b>{o.teamPtsPerScore.toFixed(1)}</b>] </li>
        <ul>
          <li><em>(Team_ORB_Weight is described under Team_ORB_Contrib%, below)</em></li>
          <li><em>(% Plays_Team_Scored is described in the possessions section, below)</em></li>
          <li>Pts_Per_Scoring_Possession: [<b>{o.teamPtsPerScore.toFixed(1)}</b>] = Team_Pts [<b>{o.teamPts.toFixed(1)}</b>] / Team_Scoring_Plays [<b>{o.teamScoringPoss.toFixed(1)}</b>]</li>
          <ul>
            <li><em>(Team_Scoring_Plays described under possessions section, below)</em></li>
          </ul>
        </ul>
        <li><em>(Team_ORB_Contrib%: In the same way a Player gets rewarded for an ORB, they get slightly less reward for a score that comes off someone else's rebound):</em></li>
        <li>Team_ORB_Contrib%: [<b>{(100*o.teamOrbContribPct).toFixed(1)}</b>%] = Team_ORB_Weight [<b>{(100*o.teamOrbWeight).toFixed(1)}%</b>] * % Team_Scoring_Plays_From_Rebound [<b>{(100*o.teamScoreFromReboundPct).toFixed(1)}%</b>]</li>
        <ul>
          <li>% Team_Scoring_Plays_From_Rebound: [<b>{(100*o.teamScoreFromReboundPct).toFixed(1)}%</b>] = (~All_Players_ORB [<b>{o.rosterOrb.toFixed(1)}</b>] * % Plays_Team_Scored [<b>{(100*o.teamScoredPlayPct).toFixed(1)}%</b>]) / Scoring_Plays [<b>{o.teamScoringPoss.toFixed(1)}</b>] </li>
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
        <li>(Gives adjusted usage: Adj_Usage = [<b>{(100*o.adjPoss/(o.teamPoss || 1)).toFixed(1)}%</b>])</li>
        <li><em>Compare raw stats: poss=[<b>{o.offPoss.toFixed(1)}</b>] (fga=[<b>{o.rawFga}</b> = <b>{o.raw3Fga}</b> + (<b>{o.raw2midFga}</b> + <b>{o.raw2rimFga}</b>)] + [<b>{o.actualFtaToPoss.toFixed(3)}</b>]*fta=[<b>{o.ftPoss.toFixed(1)}</b>] + to=[<b>{o.rawTo}</b>] - orb=[<b>{o.offPlaysLessPoss.toFixed(1)}</b>])</em></li>
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
            <li>Team_Scoring_Plays: [<b>{o.teamScoringPoss.toFixed(1)}</b>] = Team_FGM [<b>{o.teamFgm.toFixed(1)}</b>] + Team_FTs_Hit_1+ [<b>{o.teamFtHitOnePlus.toFixed(1)}</b>]</li>
            <ul>
              <li>Team_FTs_Hit_1+: [<b>{o.teamFtHitOnePlus.toFixed(1)}</b>] = (1 - Team_FTs_Missed_Both% [<b>{(100*(1 - o.teamProbFtHitOnePlus)).toFixed(1)}%</b>]) * ([<b>{o.actualFtaToPoss.toFixed(3)}</b>]*Team_FTA) [<b>{(o.actualFtaToPoss*o.teamFta).toFixed(1)}</b>]</li>
              <ul>
                <li>Team_FTs_Missed_Both%: [<b>{(100*(1 - o.teamProbFtHitOnePlus)).toFixed(1)}%</b>] = (1 - Team_FT% [<b>{(100*o.teamFtPct).toFixed(1)}%</b>])^2</li>
                <li><em>([0.475]*FTA is standard for estimating the number of trips to the FT line; we use [<b>{o.actualFtaToPoss.toFixed(3)}</b>] inferred from the actual possession count)</em></li>
              </ul>
            </ul>
            <li>Team_Total_Plays: [<b>{o.teamPlays.toFixed(1)}</b>] = Team_FGA [<b>{o.teamFga}</b>] + ([<b>{o.actualFtaToPoss.toFixed(3)}</b>]*Team_FTA) [<b>{(o.actualFtaToPoss*o.teamFta).toFixed(1)}</b>] + Team_TOV [<b>{o.teamTo}</b>]</li>
            <li><em>(Team_ORB_Weight is described in the points section, above. The cost of the play is reduced like the reward of the score)</em></li>
          </ul>
          <li>FG_Part: [<b>{o.fgPart.toFixed(1)}</b>] = FGM [<b>{o.rawFgm.toFixed(1)}</b>], less Team_Assist_Contrib% [<b>{(100*o.ppFgTeamAstPct).toFixed(1)}%</b>]===[<b>{(o.rawFgm-o.fgPart).toFixed(1)}</b>]</li>
          <ul>
            <li><em>(Team_Assist_Contrib% is described in the points section, above. Since it reduces the reward of a score, it also reduces the cost of the play)</em></li>
          </ul>
          <li>FT_Part: [<b>{o.ftPart.toFixed(1)}</b>] = (1 - Missed_Both_FTs% [<b>{(100*o.missedBothFTs).toFixed(1)}%</b>]) * [<b>{o.actualFtaToPoss.toFixed(3)}</b>]*FTA [<b>{o.ftPoss.toFixed(1)}</b>]</li>
          <ul>
            <li>Missed_Both_FTs%: [<b>{(100*o.missedBothFTs).toFixed(1)}%</b>] = (1 - FT% [<b>{(100*o.ftPct).toFixed(1)}%</b>])^2</li>
          </ul>
          <li>AST_Part: [<b>{o.astPart.toFixed(1)}</b>] = Sum(Shot Type)[Weighting ([<b>0.5</b>] * ShotType_eFG [<b>{(o.otherEfgInfo.join("/"))}</b>]%) * Player_Assists [<b>{o.rawAssistInfo.join("/")}</b>]]</li>
          <li><em>(Team_ORB_Contrib% is described in the points section, above. Since it reduces the reward of a score, it also reduces the cost of the play)</em></li>
        </ul>
        <li>Missed_FG_Possessions: [<b>{o.fgxPoss.toFixed(1)}</b>] = Missed_FG [<b>{o.rawFgx.toFixed(1)}</b>], less Team_Rebound_Weight [<b>{(107*o.teamOrbPct).toFixed(1)}%</b>]==[<b>{(1.07*o.teamOrbPct*o.rawFgx).toFixed(1)}</b>]</li>
        <ul>
          <li><em>(Team_Rebound_Weight: each missed shot doesn't count a full possession, because it may be rebounded)</em></li>
          <li>Team_Rebound_Weight: [<b>{(107*o.teamOrbPct).toFixed(1)}%</b>] = Weight [<b>1.07</b>] * Team_ORB% [<b>{(100*o.teamOrbPct).toFixed(1)}%</b>]</li>
        </ul>
        <li>Missed_FT_Possessions: [<b>{o.ftxPoss.toFixed(1)}</b>] = Missed_Both_FTs% [<b>{(100*o.missedBothFTs).toFixed(1)}%</b>] * [<b>{o.actualFtaToPoss.toFixed(3)}</b>]*FTA [<b>{o.ftPoss.toFixed(1)}</b>]</li>
        <ul>
          <li><em>(FT possession calcs above, under Team_Scoring_Plays)</em></li>
        </ul>
      </ul></span> : null }
      <li><b>Adjusted+ ORtg</b>: [<b>{o.adjORtgPlus.toFixed(1)}</b>] = <em>Normalize</em> [<b>{o.adjORtg.toFixed(1)}</b>] (Regressed_ORtg [<b>{o.Regressed_ORtg.toFixed(1)}</b>] + Usage_Bonus [<b>{o.Usage_Bonus.toFixed(1)}</b>]) * (Avg_Efficiency [<b>{o.avgEff.toFixed(1)}</b>] / Def_SOS [<b>{o.defSos.toFixed(1)}</b>])
      </li>
      { showMoreORtgAdj ? <span><li><u>Adjusted+ ORtg details</u> (<a target="_blank" href="https://www.bigtengeeks.com/new-stat-porpagatu/">?</a>)</li><ul>
        <li>Normalization: Rtg+ [<b>{o.adjORtgPlus.toFixed(1)}</b>] = 20% * (Rtg [<b>{o.adjORtg.toFixed(1)}</b>] - Avg_Efficiency [<b>{o.avgEff.toFixed(1)}</b>])</li>
        <li>Regressed_ORtg: [<b>{o.Regressed_ORtg.toFixed(1)}</b>] = Avg_Efficiency [<b>{o.avgEff.toFixed(1)}</b>] + ORtg_SDs_Above_Mean [<b>{o.SDs_Above_Mean.toFixed(1)}</b>] * ORtg_SD_At_20%_Usage [<b>{o.SD_at_Usage_20.toFixed(1)}</b>]</li>
        <ul>
          <li>ORtg_SDs_Above_Mean: [<b>{o.SDs_Above_Mean.toFixed(1)}</b>] = (ORtg [<b>{o.oRtg.toFixed(1)}</b>] - Avg_Efficiency [<b>{o.avgEff.toFixed(1)}</b>]) / SD_At_Actual_Usage [<b>{o.SD_at_Usage.toFixed(1)}</b>]</li>
          <ul>
            <li>SD_At_Actual_Usage: [<b>{o.SD_at_Usage.toFixed(1)}</b>] = [<b>13.023</b>] - (Adj_Usage [<b>{o.Usage.toFixed(1)}</b>] * [<b>0.144</b>])</li>
          </ul>
          <li>ORtg_SD_At_20%_Usage [<b>{o.SD_at_Usage_20.toFixed(1)}</b>] = [<b>10.143</b>]</li>
          <li><em>(Various constants empirically derived)</em></li>
        </ul>
        <li>Usage_Bonus: [<b>{o.Usage_Bonus.toFixed(1)}</b>] = {o.Usage > 20 ?
        <span>((Adj_Usage [<b>{o.Usage.toFixed(1)}%</b>] - [<b>20%</b>]) * [<b>1.25</b>])</span> : <span>((Adj_Usage [<b>{o.Usage.toFixed(1)}%</b>] - [<b>20%</b>]) * [<b>1.5</b>])</span>
        }</li>
        <ul>
          <li><em>
          (Factor would have been [<b>{o.Usage > 20 ? <span>1.5</span> : <span>1.25</span>}</b>] at Adj_Usage {o.Usage > 20 ? <span>&lt;</span> : <span>&gt;</span>} [<b>20%</b>]),
          ie there is an additional penalty on low usage players
          </em></li>
        </ul>
      </ul></span> : null}
    </ul>
    {(dbd && dbs) ?
      <p>
        "On-Ball Aware" DRtg: [<b>{dbd.dRtg.toFixed(1)}</b>] = OnBall_Player_DRtg [<b>{dbd.unadjDRtg.toFixed(1)}</b>] + Unassigned_Plays_Bonus [<b>{(dbd.uncategorizedAdjustment).toFixed(1)}</b>]
        &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setShowMoreOnBallDRtg(!showMoreOnBallDRtg) }}>{showMoreOnBallDRtg ? "less" : "more"} about "On-Ball" DRtg</a>)
        <ul>
          <li>OnBall_Player_DRtg: [<b>{dbd.unadjDRtg.toFixed(1)}</b>] = 100 * (Pts_Per_Score [<b>{d.oppoPtsPerScore.toFixed(2)}</b>] -
          Rebound_Credit [<b>{(100*dbd.comboRebCredit).toFixed(1)}%</b>] - Stop_Credit [<b>{(100*dbd.comboBallStopCredit).toFixed(1)}%</b>])
          </li>
          <li>Unassigned_Plays_Bonus: [<b>{(dbd.uncategorizedAdjustment).toFixed(1)}</b>] = Regress to [<b>-7.0</b>] by [<b>{(100*(1-dbd.adjustedPossPct)).toFixed(1)}%</b>] from [<b>{(dbd.weightedClassicDRtgMean - dbd.weightedUnadjDRtgMean).toFixed(1)}</b>] (<i>Avg_Classic_DRtg</i> [<b>{(dbd.weightedClassicDRtgMean).toFixed(1)}</b>] - <i>Avg_OnBallPlayer_DRtg</i> [<b>{(dbd.weightedUnadjDRtgMean).toFixed(1)}</b>])</li>
          <li><b>Adjusted+ DRtg</b>: [<b>{dbd.adjDRtgPlus.toFixed(1)}</b>] = <em>Normalize</em> [<b>{dbd.adjDRtg.toFixed(1)}</b>] (DRtg [<b>{dbd.dRtg.toFixed(1)}</b>] * (Avg_Efficiency [<b>{d.avgEff.toFixed(1)}</b>] / Off_SOS [<b>{d.offSos.toFixed(1)}</b>]))</li>
          {showMoreOnBallDRtg ?
          <span><li><u>"On-Ball" DRtg details</u></li>
          <ul>
            <li>Rebound_Credit: [<b>{(100*dbd.comboRebCredit).toFixed(1)}%</b>] = Pts_Per_Score [<b>{d.oppoPtsPerScore.toFixed(2)}</b>] * ([<b>20%</b>]*Player_Rebound_Credit [<b>{(100*dbd.playerRebCredit).toFixed(1)}%</b>]) + [<b>80%</b>]*Team_Rebound_Credit [<b>{(100*dbd.teamRebCredit).toFixed(1)}%</b>])</li>
            <ul>
              <li>Player_Rebound_Credit: [<b>{(100*dbd.playerRebCredit).toFixed(1)}%</b>] = Classic_Rebound_Credit [<b>{d.reboundCredit.toFixed(1)}</b>] / (20% * Opponent_Poss) [<b>{(0.2*d.oppoPoss).toFixed(1)}</b>]</li>
              <li>Team_Rebound_Credit: [<b>{(100*dbd.teamRebCredit).toFixed(1)}%</b>] = Team_Rebounds [<b>{d.teamDrb.toFixed(0)}</b>] * (1 - Classic_Miss_vs_Rebound_Credit% [<b>{(100*d.teamDvsRebCredit).toFixed(1)}%</b>]) / Opponent_Poss [<b>{d.oppoPoss.toFixed(0)}</b>]</li>
              <li><i>(This is the same as "Classic", except with Team_DRtg decomposed into rebound and stops - see below)</i></li>
            </ul>
            <li>Stop_Credit: [<b>{(100*dbd.comboBallStopCredit).toFixed(1)}%</b>] = [<b>5</b>] * ((OnBall_Weight [<b>{(100*dbd.onBallCreditWeight).toFixed(1)}%</b>] * OnBall_Credit [<b>{(100*dbd.onBallStopCredit*dbd.playerPtsPerScore).toFixed(1)}%</b>]) +  (OffBall_Weight [<b>{(100*dbd.offBallCreditWeight).toFixed(1)}%</b>] * OffBall_Credit [<b>{(100*dbd.offBallStopCredit*dbd.weightedPtsPerScore).toFixed(1)}%</b>]) )</li>
            <ul>
              <li><i>(* [<b>5</b>] because each player in the lineup has equal defensive responsibilities)</i></li>
              <li>OnBall_Credit: [<b>{(100*dbd.onBallStopCredit*dbd.playerPtsPerScore).toFixed(1)}%</b>] = Player_Pts_Per_Score [<b>{dbd.playerPtsPerScore.toFixed(2)}</b>] * Player_Stop_Credit [<b>{(100*dbd.onBallStopCredit*dbd.playerTargetPoss/(dbd.playerTargetPoss || 1)).toFixed(1)}%</b>]</li>
              <ul>
                <li>Player_Stop_Credit: [<b>{(100*dbd.onBallStopCredit*dbd.playerTargetPoss/(dbd.playerTargetPoss || 1)).toFixed(1)}%</b>] = No_Shot_Credit [<b>{(dbd.onBallStopCredit*dbd.playerTargetPoss).toFixed(1)}</b>] + Classic_Missed_FTs [<b>{d.missFtCredit.toFixed(1)}</b>]) / Targeted_Poss [<b>{dbd.playerTargetPoss.toFixed(1)}</b>]</li>
                <li>NoShot_Credit: [<b>{(dbd.onBallStopCredit*dbd.playerTargetPoss).toFixed(1)}</b>] = (Classic_Miss_Weight [<b>{(100*d.teamMissWeight).toFixed(1)}%</b>] * Credited_Misses [<b>{dbs.fgMiss.toFixed(0)}</b>]) + Credited_TOVs [<b>{(0.01*dbs.tovPct*dbs.plays).toFixed(1)}</b>]</li>
                <li>Targeted_Poss: [<b>{dbd.playerTargetPoss.toFixed(1)}</b>] = Targeted_Plays [<b>{dbs.plays.toFixed(0)}</b>] - (Credited_Misses [<b>{dbs.fgMiss.toFixed(0)}</b>] * Opponent_ORB% [<b>{(100*d.opponentOrbPct).toFixed(1)}%</b>])</li>
              </ul>
              <li>OffBall_Credit: [<b>{(100*dbd.offBallStopCredit*dbd.weightedPtsPerScore).toFixed(1)}%</b>] = Weighted_Pts_Per_Score [<b>{dbd.weightedPtsPerScore.toFixed(2)}</b>] * Not_Player_Stop_Credit [<b>{(100*dbd.offBallStopCredit).toFixed(1)}%</b>]</li>
              <ul>
                <li>Weighted_Pts_Per_Score: [<b>{dbd.weightedPtsPerScore.toFixed(2)}</b>] = (Pts_Per_Score [<b>{d.oppoPtsPerScore.toFixed(2)}</b>] - (Targeted% [<b>{(100*dbd.targetedPct).toFixed(1)}%</b>] * Player_Pts_Per_Score [<b>{dbd.playerPtsPerScore.toFixed(2)}</b>]))/(1 - Targeted% [<b>{(100*dbd.targetedPct).toFixed(1)}%</b>])</li>
                <li>Not_Player_Stop_Credit [<b>{(100*dbd.offBallStopCredit).toFixed(1)}%</b>]:
                <i> We decompose Team_DRtg for all non-player points into rebound and stop credit</i></li>
                <ul>
                  <li><i>Delta Pts=[<b>-{(d.oppoPts - dbd.offBallPts).toFixed(1)}</b>], Poss=[<b>-{(d.oppoPoss - dbd.offBallPoss).toFixed(1)}</b>], DRBs=[<b>-{(d.teamDrb - dbd.otherRebounds).toFixed(1)}</b>], DRtgs: all=[<b>-{d.teamRtg.toFixed(1)}</b>] vs [<b>{(100*dbd.offBallPts/(dbd.offBallPoss || 1)).toFixed(1)}</b>]</i></li>
                </ul>
                <li><i>NonPlayer_Team_DRtg [<b>{(100*dbd.offBallPts/(dbd.offBallPoss || 1)).toFixed(1)}</b>] = 100*Pts_Per_Score [<b>{dbd.weightedPtsPerScore.toFixed(2)}</b>]*(1 - Other_Rebound_Credit [<b>{(100*dbd.otherRebCredit).toFixed(1)}%</b>] - <u>Not_Player_Stop_Credit</u> [<b>{(100*dbd.offBallStopCredit).toFixed(1)}%</b>]</i></li>
              </ul>
              <li>OnBall_Weight: [<b>{(100*dbd.onBallCreditWeight).toFixed(1)}%</b>] = On_vs_OffBall_Weight [<b>{(100*dbd.onVsOffBallWeight).toFixed(1)}%</b>] * Targeted% [<b>{(100*dbd.targetedPct).toFixed(1)}%</b>]</li>
              <ul>
                <li>Targeted%: [<b>{(100*dbd.targetedPct).toFixed(1)}%</b>] = (Targeted_Plays [<b>{dbs.plays.toFixed(0)}</b>] / Total_Plays [<b>{dbs.totalPlays.toFixed(0)}</b>]) / Player_Poss% [<b>{(100*dbs.plays/(dbs.totalPlays || 1)/(dbd.targetedPct || 1)).toFixed(1)}%</b>]</li>
                <li><i>(On_vs_OffBall_Weight [<b>{(100*dbd.onVsOffBallWeight).toFixed(1)}%</b>] is a arbitrary split of credit given to on-ball vs help defense)</i></li>
              </ul>
              <li>OffBall_Weight: [<b>{(100*dbd.offBallCreditWeight).toFixed(1)}%</b>] = [<b>25%</b>] * (1 - On_vs_OffBall_Weight [<b>{(100*dbd.onVsOffBallWeight).toFixed(1)}%</b>])*(1 - Targeted% [<b>{(100*dbd.targetedPct).toFixed(1)}%</b>])</li>
              <ul>
                <li><i>([<b>25%</b>] because the help defense is spread out across the 4 non-on-ball defenders)</i></li>
              </ul>
            </ul>
            <li><i>(Unassigned_Plays_Bonus spreads out the credit for stops not assigned an on-ball defender. It is typically [<b>-7.0</b>] +- [<b>2.0</b>] pts/100)</i></li>
          </ul></span>
          : null }
        </ul>
      </p>
      :
      null
    }
    {(dbd && dbs) ? <span>"Classic" </span> : null}DRtg: [<b>{d.dRtg.toFixed(1)}</b>] = Team_DRtg [<b>{d.teamRtg.toFixed(1)}</b>] + Player_Delta [<b>{d.playerDelta.toFixed(1)}</b>]
    &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setShowMoreDRtg(!showMoreDRtg) }}>{showMoreDRtg ? "less" : "more"} about {(dbd && dbs) ? <span>"Classic" </span> : null}DRtg</a>)
    <ul>
      <li>Team_DRtg: [<b>{d.teamRtg.toFixed(1)}</b>] = 100 * Opponent_Pts [<b>{d.oppoPts.toFixed(0)}</b>] / Opponent_Poss [<b>{d.oppoPoss.toFixed(0)}</b>] <em>(only counting while player was on floor)</em></li>
      <li>Player_Delta: [<b>{(d.playerDelta).toFixed(1)}</b>] = (Player_DRtg [<b>{d.playerRtg.toFixed(1)}</b>] - Team_DRtg [<b>{d.teamRtg.toFixed(1)}</b>]) / Team_Size [<b>5</b>]</li>
      <ul>
        <li>Player_DRtg:  [<b>{d.playerRtg.toFixed(1)}</b>] = 100 * Pts_Per_Score [<b>{d.oppoPtsPerScore.toFixed(2)}</b>] * Score_Conceded_By_Player% [<b>{(100*d.scPossConceded).toFixed(1)}%</b>]</li>
      </ul>
      <li><b>Adjusted+ DRtg</b>: [<b>{d.adjDRtgPlus.toFixed(1)}</b>] = <em>Normalize</em> [<b>{d.adjDRtg.toFixed(1)}</b>] (DRtg [<b>{d.dRtg.toFixed(1)}</b>] * (Avg_Efficiency [<b>{d.avgEff.toFixed(1)}</b>] / Off_SOS [<b>{d.offSos.toFixed(1)}</b>]))</li>
      {showMoreDRtg ?
      <span><li><u>{(dbd && dbs) ? <span>"Classic" </span> : null}DRtg details</u></li>
      <ul>
        <li><em>(Note: you can also view this as DRtg [<b>{(d.teamRtg + d.playerDelta).toFixed(1)}</b>] = ([<b>20%</b>] * Player_DRtg [<b>{d.playerRtg.toFixed(1)}</b>]) + ([<b>80%</b>] * Team_DRtg [<b>{d.teamRtg.toFixed(1)}</b>]);
        ie a weighted average of a player's defense when actively involved,
        vs when passively involved, eg guarding off ball (where the best you can do is use the Team_DRtg). This assumes every player is "targeted" 1/5th of the time.</em></li>
        <li>Pts_Per_Score: [<b>{d.oppoPtsPerScore.toFixed(2)}</b>] = Opponent_PTS [<b>{d.oppoPts.toFixed(0)}</b>] / Scoring_Plays [<b>{d.oppoScPoss.toFixed(1)}</b>]</li>
        <ul>
          <li>Scoring_Plays: [<b>{d.oppoScPoss.toFixed(1)}</b>] = Opponent_FGM [<b>{d.oppoFgm.toFixed(0)}</b>] + Opponent_FTs_Hit_1+ [<b>{d.oppoFtHitOnePlus.toFixed(1)}</b>]</li>
          <ul>
            <li>Opponent_FTs_Hit_1+: [<b>{d.oppoFtHitOnePlus.toFixed(1)}</b>] = (1 - Opponent_FTs_Missed_Both% [<b>{(100*(1 - d.oppoProbFtHitOnePlus)).toFixed(1)}%</b>]) * ([0.475]*Opponent_FTA) [<b>{d.oppoFtPoss.toFixed(1)}</b>]</li>
            <ul>
              <li>Opponent_FTs_Missed_Both%: [<b>{(100*(1 - d.oppoProbFtHitOnePlus)).toFixed(1)}%</b>] = (1 - Opponent_FT% [<b>{(100*d.oppoFtPct).toFixed(1)}%</b>])^2</li>
              <li><em>([0.475*FTA is a standard equation for estimating the number of trips to the FT line)</em></li>
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
              <li><em>([0.475]*FTA is standard for estimating the number of trips to the FT line)</em></li>
            </ul>
          </ul>
          <li>Stops_Credit_Team%: [<b>{(100*d.stopsTeamPct).toFixed(1)}%</b>] = ((Opponent_FGMiss [<b>{d.oppoFgMiss.toFixed(0)}</b>] * Opponent_Miss_Credit% [<b>{(100*d.teamMissWeight).toFixed(1)}%</b>]) + Opponent_NonSteal_TOV [<b>{d.oppoNonStlTov.toFixed(0)}</b>]) / Opponent_Poss [<b>{(d.oppoPoss).toFixed(0)}</b>]</li>
          <ul>
            <li><em>(Opponent_Miss_Credit% is described under Stops_Credit_Player%, above)</em></li>
            <li>Opponent_FGMiss: [<b>{d.oppoFgMiss.toFixed(0)}</b>] = Opponent_FGA [<b>{d.oppoFga}</b>] - Opponent_FGM [<b>{d.oppoFgm}</b>] - Team_BLK [<b>{d.teamBlk}</b>]</li>
            <li>Opponent_NonSteal_TOV: [<b>{d.oppoNonStlTov.toFixed(0)}</b>] = Opponent_TOV [<b>{d.oppoTov}</b>] - Team_STL [<b>{d.teamStl}</b>]</li>
          </ul>
        </ul>
        <li>Adj+ Rtg Normalization: Rtg+ [<b>{d.adjDRtgPlus.toFixed(1)}</b>] = 20% * (Rtg [<b>{d.adjDRtg.toFixed(1)}</b>] - Avg_Efficiency [<b>{o.avgEff.toFixed(1)}</b>])</li>
      </ul></span> : null
      }
    </ul>
  </span>;
};

export default RosterStatsDiagView;
