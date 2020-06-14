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
import { StatsUtils } from "../utils/StatsUtils";
import { CommonTableDefs } from "../utils/CommonTableDefs";
import { CbbColors } from "../utils/CbbColors";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable";
import { TeamStatsModel } from '../components/TeamStatsTable';
import { RosterStatsModel } from '../components/RosterStatsTable';

type Props = {
  teamStats: TeamStatsModel,
  rosterStats: RosterStatsModel
};
const LuckAdjDiagView: React.FunctionComponent<Props> = ({teamStats, rosterStats}) => {

  const topRef = React.createRef<HTMLDivElement>();

  return <span ref={topRef}>
      <span>
        <b>Luck Adjustment diagnostics [TODO]</b>
      </span>
      <ul>
        <li>Defense</li>
        <ul>
          <li>GLOBAL POSS {(teamStats?.global?.def_poss?.value || 0).toFixed(0)}</li>
          <li>GLOBAL 3P SOS {(teamStats?.global?.def_3p_opp?.value || 0).toFixed(1)}</li>
          <li>BASE 3P SOS {(teamStats?.baseline?.def_3p_opp?.value || 0).toFixed(1)}</li>
          <li>ON 3P SOS {(teamStats?.on?.def_3p_opp?.value || 0).toFixed(1)}</li>
          <li>OFF 3P SOS {(teamStats?.off?.def_3p_opp?.value || 0).toFixed(1)}</li>
        </ul>
      </ul>

      (<a href="#" onClick={(event) => {
        event.preventDefault();
        if (topRef.current) {
          topRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }}>
        Scroll back to start of positional diagnostics
      </a>)
    </span>;
};
export default LuckAdjDiagView;
