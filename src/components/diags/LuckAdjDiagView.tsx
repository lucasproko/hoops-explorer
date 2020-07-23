// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

// Utils
import { CommonTableDefs } from "../../utils/CommonTableDefs";
import { CbbColors } from "../../utils/CbbColors";
import { LuckAdjustmentBaseline, OffLuckAdjustmentDiags, DefLuckAdjustmentDiags } from "../../utils/stats/LuckUtils";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "../GenericTable";
import { TeamStatsModel } from '../../components/TeamStatsTable';
import { RosterStatsModel } from '../../components/RosterStatsTable';

type Props = {
  name: string,
  offLuck: OffLuckAdjustmentDiags,
  defLuck: DefLuckAdjustmentDiags,
  baseline: LuckAdjustmentBaseline,
  individualMode?: boolean,
  showHelp: boolean,
  showDetailsOverride?: boolean
};
const LuckAdjDiagView: React.FunctionComponent<Props> = ({name, offLuck, defLuck, baseline, individualMode, showHelp, showDetailsOverride}) => {

  const topRef = React.createRef<HTMLDivElement>();

  const [ showDetails, setShowDetails ] = useState(true);
  const [ show3POff, setShow3POff ] = useState(_.isNil(showDetailsOverride) ? false : showDetailsOverride);
  const [ show3PDef, setShow3PDef ] = useState(_.isNil(showDetailsOverride) ? false : showDetailsOverride);

  const o = offLuck;
  const d = defLuck;

  return <span ref={topRef}>
      <span>
        <b>Luck Adjustment diagnostics [{name}]</b>
        {showHelp ? <span> <a target="_blank" href="https://hoop-explorer.blogspot.com/2020/07/luck-adjustment-details.html">(?)</a></span> : null}
        {!individualMode ? <span>
          &nbsp;off=[<b>{o.deltaOffAdjEff.toFixed(1)}</b>], def=[<b>{d.deltaDefAdjEff.toFixed(1)}</b>], margin=[<b>{(o.deltaOffAdjEff - d.deltaDefAdjEff).toFixed(1)}</b>] pts/100
         </span> : null}
        &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setShowDetails(!showDetails) }}>show {showDetails ? "less" : "more"}</a>)
      </span>
      { showDetails ? <ul>
        <li><b>Offense</b>:
        {!individualMode ? <span> adjustment [<b>{o.deltaOffAdjEff.toFixed(1)}</b>] pts/100</span> : null}</li>
        <ul>
          <li><b>3P Shooting</b>: 3P% [<b>{(100*o.delta3P).toFixed(1)}</b>%], eFG [<b>{(100*o.deltaOffEfg).toFixed(1)}</b>%]
          {!individualMode ? <span>, adjustment [<b>{o.deltaOffAdjEff.toFixed(1)}</b>] pts/100</span> : null }
          &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setShow3POff(!show3POff) }}>show {show3POff ? "less" : "more"}</a>)
          </li>
          { show3POff ? <ul>
            <li>Delta_eFG: [<b>{(100*o.deltaOffEfg).toFixed(1)}</b>%] =
            1.5 * (Adj_3P_Off [<b>{(100*(o.delta3P + o.sample3P)).toFixed(1)}</b>%] - Sample_3P_Off [<b>{(100*o.sample3P).toFixed(1)}</b>%]) *
            Sample_Off_3PR [<b>{(100*o.sampleOff3PRate).toFixed(1)}</b>%]
            </li>
            <ul>
              <li><i>(The idea is we'll calculate the expected shooting performance of the players in the lineup set, weighted by their usage, and then regress the actual 3P shooting agains that.)</i></li>
              <li>Adj_3P_Off: [<b>{(100*(o.delta3P + o.sample3P)).toFixed(1)}</b>%] = <i>Weighted_Mean</i>(
                Expected_3P% [<b>{(100*o.sampleBase3P).toFixed(1)}</b>%], Base_3PA [<b>{o.base3PA.toFixed(0)}</b>],
              Sample_3P% [<b>{(100*o.sample3P).toFixed(1)}</b>%], Sample_3PA [<b>{o.sample3PA.toFixed(0)}</b>])</li>
              <li>Expected_3P%: [<b>{(100*o.sampleBase3P).toFixed(1)}</b>%] = Calculated from <i>Weighted_Mean</i> of:</li>
              <ul>
                {_.toPairs(o.player3PInfo).map((pV: [ string, any ], index: number) => {
                  return <li key={index}>[<b>{pV[0]}</b>]: Sample_3PA=[<b>{((pV[1]?.sample3PA || 0)).toFixed(0)}</b>] Base_3P%=[<b>{(100*(pV[1]?.base3P || 0)).toFixed(1)}</b>%]</li>
                })}
              </ul>
            </ul>
            { !individualMode ? // Only show the following if in team mode
            <span>
              <li>Adj_Delta_Pts/100: [<b>{o.deltaOffAdjEff.toFixed(1)}</b>] = Delta_Pts/100 [<b>{o.deltaOffPpp.toFixed(1)}</b>] * D1_Avg_Eff [<b>{o.avgEff.toFixed(1)}</b>] / Sample_Def_SOS [<b>{o.sampleDefSos.toFixed(1)}</b>]</li>
              <li>Delta_Pts/100: [<b>{o.deltaOffPpp.toFixed(1)}</b>] = Delta_Pts_No_ORBs/100 [<b>{o.deltaOffPppNoOrb.toFixed(1)}</b>] + Pts_Off_Delta_Misses/100 [<b>{o.deltaPtsOffMisses.toFixed(1)}</b>]</li>
              <ul>
                <li><i>(Because of the change in 3P%, there are either more or less misses that can be rebounded by the offense.)</i></li>
                <li>Delta_Pts_No_ORBs/100: [<b>{o.deltaOffPppNoOrb.toFixed(1)}</b>] = 2 * Delta_eFG [<b>{(100*o.deltaOffEfg).toFixed(1)}</b>%] * Sample_Off_FGA [<b>{o.sampleOffFGA.toFixed(0)}</b>] / Sample_Possessions [<b>{o.samplePoss.toFixed(0)}</b>]</li>
                <li>Pts_Off_Delta_Misses/100: [<b>{o.deltaPtsOffMisses.toFixed(1)}</b>] = ORB_Factor [<b>{(100*o.deltaOffOrbFactor).toFixed(1)}</b>%] * (Sample_Def_Pts/100 [<b>{o.sampleOffPpp.toFixed(1)}</b>] + Delta_Pts_No_ORBs/100: [<b>{o.deltaOffPppNoOrb.toFixed(1)}</b>])</li>
                <ul>
                  <li>ORB_Factor: [<b>{(100*o.deltaOffOrbFactor).toFixed(1)}</b>%] = Delta_Misses% [<b>{(100*o.deltaMissesPct).toFixed(1)}</b>%] * Sample_Def_ORB [<b>{(100*o.sampleOffOrb).toFixed(1)}</b>%] / (1 - Delta_Misses/100 [<b>{(100*o.deltaMissesPct).toFixed(1)}</b>%] * Sample_Def_ORB [<b>{(100*o.sampleOffOrb).toFixed(1)}</b>%])</li>
                </ul>
              </ul>
            </span> : null }
          </ul> : null }
        </ul>
        <li><b>Defense</b>:
          {!individualMode ? <span> adjustment [<b>{d.deltaDefAdjEff.toFixed(1)}</b>] pts/100</span> : null }
        </li>
        <ul>
          <li><b>3P Shooting</b>: 3P% [<b>{(100*d.delta3P).toFixed(1)}</b>%]
            {!individualMode ? <span>, eFG [<b>{(100*d.deltaDefEfg).toFixed(1)}</b>%], adjustment [<b>{d.deltaDefAdjEff.toFixed(1)}</b>] pts/100</span> : null}
           &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setShow3PDef(!show3PDef) }}>show {show3PDef ? "less" : "more"}</a>)
          </li>
          { show3PDef ? <ul>
            {individualMode ?
              <li>Delta_3P%: [<b>{(100*d.delta3P).toFixed(1)}</b>%] =
            Adj_3P_Def [<b>{(100*d.adjDef3P).toFixed(1)}</b>%] - Sample_3P_Def [<b>{(100*d.sampleDef3P).toFixed(1)}</b>%]</li>
              : <li>Delta_eFG: [<b>{(100*d.deltaDefEfg).toFixed(1)}</b>%] =
            1.5 * (Adj_3P_Def [<b>{(100*d.adjDef3P).toFixed(1)}</b>%] - Sample_3P_Def [<b>{(100*d.sampleDef3P).toFixed(1)}</b>%]) *
            Sample_Def_3PR [<b>{(100*d.sampleDef3PRate).toFixed(1)}</b>%]</li>
            }
            <ul>
              <li><i>(The idea is we calculate a "3P defense" number from the sample, regressed to the [<b>{baseline}</b>], assuming that [<b>{(100*d.luckPct).toFixed(1)}</b>%] of it is just luck.
              Then we calculate a "luck adjusted" 3P% by combining "3P defense" and the weighted average opponent 3P%.)
              </i></li>
              <li>Adj_3P_Def: [<b>{(100*d.adjDef3P).toFixed(1)}</b>%] = Sample_3P_SoS [<b>{(100*d.sampleDef3PSos).toFixed(1)}</b>%] + Delta_3PD [<b>{(100*d.avg3PSosAdj).toFixed(1)}</b>%]</li>
              <li>Delta_3PD: [<b>{(100*d.avg3PSosAdj).toFixed(1)}</b>%] = <i>Weighted_Mean</i>(
                Base_Delta_3PD [<b>{(100*d.base3PSosAdj).toFixed(1)}</b>%], Base_Possessions [<b>{d.basePoss.toFixed(0)}</b>],
              Sample_Delta_3PD [<b>{(100*d.sample3PSosAdj).toFixed(1)}</b>%], Sample_Possessions [<b>{d.samplePoss.toFixed(0)}</b>])</li>
              <ul>
                <li>Base_Delta_3PD: [<b>{(100*d.base3PSosAdj).toFixed(1)}</b>%] = (1 - Luck_Factor [<b>{(100*d.luckPct).toFixed(1)}</b>%]) *
                (Base_3P_Def [<b>{(100*d.baseDef3P).toFixed(1)}</b>%] - Base_3P_SoS [<b>{(100*d.baseDef3PSos).toFixed(1)}</b>%])
                </li>
                <li>Sample_Delta_3PD: [<b>{(100*d.sample3PSosAdj).toFixed(1)}</b>%] = (1 - Luck_Factor [<b>{(100*d.luckPct).toFixed(1)}</b>%]) *
                (Sample_3P_Def [<b>{(100*d.sampleDef3P).toFixed(1)}</b>%] - Sample_3P_SoS [<b>{(100*d.sampleDef3PSos).toFixed(1)}</b>%])
                </li>
              </ul>
            </ul>
            {!individualMode ? <li>Adj_Delta_Pts/100: [<b>{d.deltaDefAdjEff.toFixed(1)}</b>] = Delta_Pts/100 [<b>{d.deltaDefPpp.toFixed(1)}</b>] * D1_Avg_Eff [<b>{d.avgEff.toFixed(1)}</b>] / Sample_Off_SOS [<b>{d.sampleOffSos.toFixed(1)}</b>]</li> : null}
            {!individualMode ? <li>Delta_Pts/100: [<b>{d.deltaDefPpp.toFixed(1)}</b>] = Delta_Pts_No_ORBs/100 [<b>{d.deltaDefPppNoOrb.toFixed(1)}</b>] + Pts_Off_Delta_Misses/100 [<b>{d.deltaPtsOffMisses.toFixed(1)}</b>]</li> : null}
            {!individualMode ? <ul>
              <li><i>(Because of the change in 3P%, there are either more or less misses that can be rebounded by the offense.)</i></li>
              <li>Delta_Pts_No_ORBs/100: [<b>{d.deltaDefPppNoOrb.toFixed(1)}</b>] = 2 * Delta_eFG [<b>{(100*d.deltaDefEfg).toFixed(1)}</b>%] * Sample_Def_FGA [<b>{d.sampleDefFGA.toFixed(0)}</b>] / Sample_Possessions [<b>{d.samplePoss.toFixed(0)}</b>]</li>
              <li>Pts_Off_Delta_Misses/100: [<b>{d.deltaPtsOffMisses.toFixed(1)}</b>] = ORB_Factor [<b>{(100*d.deltaDefOrbFactor).toFixed(1)}</b>%] * (Sample_Def_Pts/100 [<b>{d.sampleDefPpp.toFixed(1)}</b>] + Delta_Pts_No_ORBs/100: [<b>{d.deltaDefPppNoOrb.toFixed(1)}</b>])</li>
              <ul>
                <li>ORB_Factor: [<b>{(100*d.deltaDefOrbFactor).toFixed(1)}</b>%] = Delta_Misses% [<b>{(100*d.deltaMissesPct).toFixed(1)}</b>%] * Sample_Def_ORB [<b>{(100*d.sampleDefOrb).toFixed(1)}</b>%] / (1 - Delta_Misses/100 [<b>{(100*d.deltaMissesPct).toFixed(1)}</b>%] * Sample_Def_ORB [<b>{(100*d.sampleDefOrb).toFixed(1)}</b>%])</li>
              </ul>
            </ul> : null}
          </ul> : null }
        </ul>
        {baseline == "baseline" ? <li><i>(Regressing over baseline uses in a smaller and possibly biased dataset, which is bad; but can be useful if there is reason to believe the characteristics
        of the team are different compared to the sample - eg due to injury.)</i></li> : null}
      </ul> : null }
    </span>;
};
export default LuckAdjDiagView;
