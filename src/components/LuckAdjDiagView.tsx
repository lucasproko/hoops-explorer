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
import { OffLuckAdjustmentDiags, DefLuckAdjustmentDiags } from "../utils/stats/LuckUtils";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable";
import { TeamStatsModel } from '../components/TeamStatsTable';
import { RosterStatsModel } from '../components/RosterStatsTable';

type Props = {
  name: string,
  offLuck: OffLuckAdjustmentDiags,
  defLuck: DefLuckAdjustmentDiags
};
const LuckAdjDiagView: React.FunctionComponent<Props> = ({name, offLuck, defLuck}) => {

  const topRef = React.createRef<HTMLDivElement>();

  return <span ref={topRef}>
      <span>
        <b>Luck Adjustment diagnostics [{name}]</b>
      </span>
      <ul>
        <li>Offense</li>
        <li>Defense</li>
        <ul>
          <li>{JSON.stringify(_.mapValues(defLuck, (v) => Math.abs(v) < 1.0 ? (100*v).toFixed(1) : v),
            null, 3)}</li>
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
