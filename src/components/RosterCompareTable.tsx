// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable"

// Util imports
import { CbbColors } from "../utils/CbbColors"

export type RosterCompareModel = {
  on: any,
  off: any,
  baseline: any,
  error_code?: string
}
type Props = {
  rosterCompareStats: RosterCompareModel
}

const RosterCompareTable: React.FunctionComponent<Props> = ({rosterCompareStats}) => {

  const tableFields = { //accessors vs column metadata
    "title": GenericTableOps.addTitle("", ""),
    "sep0": GenericTableOps.addColSeparator(),
    "pct": GenericTableOps.addPctCol("%", "Percentage of possessions played", GenericTableOps.defaultColorPicker),
    "poss": GenericTableOps.addIntCol("Poss", "Number of possessions played", GenericTableOps.defaultColorPicker),
  };
  function tableData(key: string) {
    const obj = (rosterCompareStats as any)[key];
    const total = obj?.global_poss_count?.value || 1;
    return (obj?.player?.buckets || []).map(function(obj: any) {
      return GenericTableOps.buildDataRow({
        title: obj.key,
        pct: 1.0*obj.poss_count.value/total,
        poss: obj.poss_count
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta);
    });
  }
  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return (Object.keys(rosterCompareStats.on).length == 0) &&
      (Object.keys(rosterCompareStats.off).length == 0) &&
      (Object.keys(rosterCompareStats.baseline).length == 0);
  }

  return <LoadingOverlay
    active={needToLoadQuery()}
    text={rosterCompareStats.error_code ?
      `Query Error: ${rosterCompareStats.error_code}` :
      "Press 'Submit' to view results"
    }
  >
    <Row>
        <Col>
          <Card className="w-100">
          <Card.Body>
          <Card.Title>'On' Roster</Card.Title>
          <GenericTable tableCopyId="rosterOnTable" tableFields={tableFields} tableData={tableData("on")}/>
          </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="w-100">
          <Card.Body>
          <Card.Title>'Off' Roster</Card.Title>
          <GenericTable tableCopyId="rosterOffTable" tableFields={tableFields} tableData={tableData("off")}/>
          </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="w-100">
          <Card.Body>
          <Card.Title>'Baseline' Roster</Card.Title>
          <GenericTable tableCopyId="rosterBaseTable" tableFields={tableFields} tableData={tableData("baseline")}/>
          </Card.Body>
          </Card>
        </Col>
      </Row>
    </LoadingOverlay>;
}

export default RosterCompareTable;
