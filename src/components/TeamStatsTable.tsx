// React imports:
import React, { useState, useEffect } from 'react';

// Next imports:
import { NextPage } from 'next';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable"
import { RosterStatsModel } from './RosterStatsTable';
import GenericTogglingMenuItem from "./GenericTogglingMenuItem";
import LuckAdjDiagView from "./LuckAdjDiagView"

// Util imports
import { CbbColors } from "../utils/CbbColors"
import { GameFilterParams } from "../utils/FilterModels"
import { CommonTableDefs } from "../utils/CommonTableDefs"
import { LuckUtils, OffLuckAdjustmentDiags, DefLuckAdjustmentDiags } from "../utils/stats/LuckUtils";
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';

export type TeamStatsModel = {
  on: any,
  off: any,
  baseline: any,
  global: any, //(a subest of the fields, across all samples for the team)
  onOffMode: boolean,
  error_code?: string
}
type Props = {
  gameFilterParams: GameFilterParams;
  teamStats: TeamStatsModel,
  rosterStats: RosterStatsModel,
  onChangeState: (newParams: GameFilterParams) => void;
}

const TeamStatsTable: React.FunctionComponent<Props> = ({gameFilterParams, teamStats, rosterStats, onChangeState}) => {

  // 1] Data Model

  const [ adjustForLuck, setAdjustForLuck ] = useState(true);
  const [ showLuckAdjDiags, setShowLuckAdjDiags ] = useState(true);

  // 2] Data View

  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off";
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def";

  const maybeOn = teamStats.onOffMode ? "On ('A')" : "'A'"
  const maybeOff = teamStats.onOffMode ? "Off ('B')" : "'B'"

  //TODO: luck .. incorporate into stats
  const genderYearLookup = `${gameFilterParams.gender}_${gameFilterParams.year}`;
  const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

  const luckAdjustmentOn = (showLuckAdjDiags && teamStats.on?.doc_count) ? [
    LuckUtils.calcOffTeamLuckAdj(teamStats.on, teamStats.global, avgEfficiency),
    LuckUtils.calcDefTeamLuckAdj(teamStats.on, teamStats.global, avgEfficiency),
  ] as [OffLuckAdjustmentDiags, DefLuckAdjustmentDiags]: undefined;

  const luckAdjustmentOff = (showLuckAdjDiags && teamStats.off?.doc_count) ? [
    LuckUtils.calcOffTeamLuckAdj(teamStats.off, teamStats.global, avgEfficiency),
    LuckUtils.calcDefTeamLuckAdj(teamStats.off, teamStats.global, avgEfficiency),
  ] as [OffLuckAdjustmentDiags, DefLuckAdjustmentDiags]: undefined;

  const luckAdjustmentBase = (showLuckAdjDiags && teamStats.baseline?.doc_count) ? [
    LuckUtils.calcOffTeamLuckAdj(teamStats.baseline, teamStats.global, avgEfficiency),
    LuckUtils.calcDefTeamLuckAdj(teamStats.baseline, teamStats.global, avgEfficiency),
  ] as [OffLuckAdjustmentDiags, DefLuckAdjustmentDiags]: undefined;

  const teamStatsOn = {
    off_title: `${maybeOn} Offense`,
    def_title: `${maybeOn} Defense`,
    ...teamStats.on
  };
  const teamStatsOff = {
    off_title: `${maybeOff} Offense`,
    def_title: `${maybeOff} Defense`,
    ...teamStats.off
  };
  const teamStatsBaseline = { off_title: "Baseline Offense", def_title: "Baseline Defense", ...teamStats.baseline };

  const tableData = _.flatMap([
    (teamStats.on?.doc_count) ? [
      GenericTableOps.buildDataRow(teamStatsOn, offPrefixFn, offCellMetaFn),
      GenericTableOps.buildDataRow(teamStatsOn, defPrefixFn, defCellMetaFn),
      GenericTableOps.buildRowSeparator()
    ] : [],
    (teamStats.off?.doc_count) ? [
      GenericTableOps.buildDataRow(teamStatsOff, offPrefixFn, offCellMetaFn),
      GenericTableOps.buildDataRow(teamStatsOff, defPrefixFn, defCellMetaFn),
      GenericTableOps.buildRowSeparator()
    ] : [],
    [ GenericTableOps.buildDataRow(teamStatsBaseline, offPrefixFn, offCellMetaFn),
    GenericTableOps.buildDataRow(teamStatsBaseline, defPrefixFn, defCellMetaFn),
    GenericTableOps.buildRowSeparator() ],
  ]);

  // 3] Utils
  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return (Object.keys(teamStats.on).length == 0) &&
      (Object.keys(teamStats.off).length == 0) &&
      (Object.keys(teamStats.baseline).length == 0);
  }

  // 4] View
  return <Container>
    <LoadingOverlay
      active={needToLoadQuery()}
      text={teamStats.error_code ?
        `Query Error: ${teamStats.error_code}` :
        "Press 'Submit' to view results"
      }
    >
      <Form.Row>
        <Col sm="11"/>
        <Form.Group as={Col} sm="1">
          <Dropdown alignRight>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              <FontAwesomeIcon icon={faCog} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <GenericTogglingMenuItem
                text="Adjust for Luck"
                truthVal={adjustForLuck}
                onSelect={() => setAdjustForLuck(!adjustForLuck)}
              />
              <Dropdown.Divider />
              <GenericTogglingMenuItem
                text="Show Luck Adjustment diagnostics"
                truthVal={showLuckAdjDiags}
                onSelect={() => setShowLuckAdjDiags(!showLuckAdjDiags)}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      </Form.Row>
      <Row>
        <Col>
          <GenericTable tableCopyId="teamStatsTable" tableFields={CommonTableDefs.onOffTable} tableData={tableData}/>
        </Col>
      </Row>
      { showLuckAdjDiags && luckAdjustmentOn ? <Row className="small">
          <LuckAdjDiagView
            name="On"
            offLuck={luckAdjustmentOn[0]}
            defLuck={luckAdjustmentOn[1]}
          />
      </Row> : null }
      { showLuckAdjDiags && luckAdjustmentOff ? <Row className="small">
          <LuckAdjDiagView
            name="Off"
            offLuck={luckAdjustmentOff[0]}
            defLuck={luckAdjustmentOff[1]}
          />
      </Row> : null }
      { showLuckAdjDiags && luckAdjustmentBase ? <Row className="small">
          <LuckAdjDiagView
            name="Baseline"
            offLuck={luckAdjustmentBase[0]}
            defLuck={luckAdjustmentBase[1]}
          />
      </Row> : null }
    </LoadingOverlay>
  </Container>;
};

export default TeamStatsTable;
