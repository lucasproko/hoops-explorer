// React imports:
import React from 'react';

// Next imports:
import { NextPage } from 'next';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable"

// Util imports
import { CbbColors } from "../utils/CbbColors"
import { CommonTableDefs } from "../utils/CommonTableDefs"

export type TeamStatsModel = {
  on: any,
  off: any,
  baseline: any,
  error_code?: string
}
type Props = {
  teamStats: TeamStatsModel
}

const TeamStatsTable: React.FunctionComponent<Props> = ({teamStats}) => {

  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off";
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def";

  const teamStatsOn = { off_title:  "'On' Offense", def_title: "'On' Defense", ...teamStats.on };
  const teamStatsOff = { off_title:"'Off' Offense", def_title: "'Off' Defense", ...teamStats.off };
  const teamStatsBaseline = { off_title: "'Baseline' Offense", def_title: "'Baseline' Defense", ...teamStats.baseline };

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

  // 2] Data Model

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
      <Row>
        <Col>
          <GenericTable tableCopyId="teamStatsTable" tableFields={CommonTableDefs.onOffTable} tableData={tableData}/>
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
};

export default TeamStatsTable;
