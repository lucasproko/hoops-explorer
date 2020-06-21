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
import { CommonTableDefs } from "../utils/CommonTableDefs";
import { CbbColors } from "../utils/CbbColors";
import { LuckAdjustmentBaseline, OffLuckAdjustmentDiags, DefLuckAdjustmentDiags } from "../utils/stats/LuckUtils";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable";
import { TeamStatsModel } from '../components/TeamStatsTable';
import { RosterStatsModel } from '../components/RosterStatsTable';

type Props = {
  name: string,
  offLuck: OffLuckAdjustmentDiags,
  defLuck: DefLuckAdjustmentDiags,
  baseline: LuckAdjustmentBaseline
};
const LuckAdjDiagView: React.FunctionComponent<Props> = ({name, offLuck, defLuck, baseline}) => {

  const topRef = React.createRef<HTMLDivElement>();

  const [ showDetails, setShowDetails ] = useState(true);
  const [ show3POff, setShow3POff ] = useState(true);
  const [ show3PDef, setShow3PDef ] = useState(false);

  const o = offLuck;
  const d = defLuck;

  return <span ref={topRef}>
      <span>
        <b>Luck Adjustment diagnostics [{name}]</b>
        &nbsp;off=[<b>{o.deltaOffAdjEff.toFixed(1)}</b>], def=[<b>{d.deltaDefAdjEff.toFixed(1)}</b>], margin=[<b>{(o.deltaOffAdjEff - d.deltaDefAdjEff).toFixed(1)}</b>] pts/100
        &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setShowDetails(!showDetails) }}>show {showDetails ? "less" : "more"}</a>)
      </span>
      { showDetails ? <ul>
        <li><b>Offense</b>: adjustment [<b>{o.deltaOffAdjEff.toFixed(1)}</b>] pts/100</li>
        <ul>
          <li><b>3P Shooting</b>: 3P% [<b>{(100*o.delta3P).toFixed(1)}</b>%], eFG [<b>{(100*o.deltaOffEfg).toFixed(1)}</b>%], adjustment [<b>{o.deltaOffAdjEff.toFixed(1)}</b>] pts/100
           (<a href="#" onClick={(event) => { event.preventDefault(); setShow3POff(!show3POff) }}>show {show3POff ? "less" : "more"}</a>)
          </li>
          { show3POff ? <ul>
            <li>{JSON.stringify(offLuck, null, 3)}</li>
          </ul> : null }
        </ul>
        <li><b>Defense</b>: adjustment [<b>{d.deltaDefAdjEff.toFixed(1)}</b>] pts/100</li>
        <ul>
          <li><b>3P Shooting</b>: 3P% [<b>{(100*d.delta3P).toFixed(1)}</b>%], eFG [<b>{(100*d.deltaDefEfg).toFixed(1)}</b>%], adjustment [<b>{d.deltaDefAdjEff.toFixed(1)}</b>] pts/100
           (<a href="#" onClick={(event) => { event.preventDefault(); setShow3PDef(!show3PDef) }}>show {show3PDef ? "less" : "more"}</a>)
          </li>
          { show3PDef ? <ul>
            <li>Delta_eFG: [<b>{(100*d.deltaDefEfg).toFixed(1)}</b>%] =
            1.5 * (Adj_3P_Def [<b>{(100*d.adjDef3P).toFixed(1)}</b>%] - Sample_3P_Def [<b>{(100*d.sampleDef3P).toFixed(1)}</b>%]) *
            Sample_Def_3PR [<b>{(100*d.sampleDef3PRate).toFixed(1)}</b>%]
            </li>
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
            <li>Adj_Delta_Pts/100: [<b>{d.deltaDefAdjEff.toFixed(1)}</b>] = Delta_Pts/100 [<b>{d.deltaDefPpp.toFixed(1)}</b>] * D1_Avg_Eff [<b>{d.avgEff.toFixed(1)}</b>] / Sample_Off_SOS [<b>{d.sampleOffSos.toFixed(1)}</b>]</li>
            <li>Delta_Pts/100: [<b>{d.deltaDefPpp.toFixed(1)}</b>] = Delta_Pts_No_ORBs/100 [<b>{d.deltaDefPppNoOrb.toFixed(1)}</b>] + Pts_Off_Delta_Misses/100 [<b>{d.deltaPtsOffMisses.toFixed(1)}</b>]</li>
            <ul>
              <li><i>(Because of the change in 3P%, there are either more or less misses that can be rebounded by the offense.)</i></li>
              <li>Delta_Pts_No_ORBs/100: [<b>{d.deltaDefPppNoOrb.toFixed(1)}</b>] = 2 * Delta_eFG [<b>{(100*d.deltaDefEfg).toFixed(1)}</b>%] * Sample_Def_FGA [<b>{d.sampleDefFGA.toFixed(0)}</b>] / Sample_Possessions [<b>{d.samplePoss.toFixed(0)}</b>]</li>
              <li>Pts_Off_Delta_Misses/100: [<b>{d.deltaPtsOffMisses.toFixed(1)}</b>] = ORB_Factor [<b>{(100*d.deltaDefOrbFactor).toFixed(1)}</b>%] * (Sample_Def_Pts/100 [<b>{d.sampleDefPpp.toFixed(1)}</b>] + Delta_Pts_No_ORBs/100: [<b>{d.deltaDefPppNoOrb.toFixed(1)}</b>])</li>
              <ul>
                <li>ORB_Factor: [<b>{(100*d.deltaDefOrbFactor).toFixed(1)}</b>%] = Delta_Misses% [<b>{(100*d.deltaMissesPct).toFixed(1)}</b>%] * Sample_Def_ORB [<b>{(100*d.sampleDefOrb).toFixed(1)}</b>%] / (1 - Delta_Misses/100 [<b>{(100*d.deltaMissesPct).toFixed(1)}</b>%] * Sample_Def_ORB [<b>{(100*d.sampleDefOrb).toFixed(1)}</b>%])</li>
              </ul>
            </ul>
          </ul> : null }
        </ul>
      </ul> : null }
    </span>;
};
export default LuckAdjDiagView;
