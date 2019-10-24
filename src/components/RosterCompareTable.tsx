// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable"

// Util imports
import { CbbColors } from "../utils/CbbColors"

export type RosterCompareModel = {
  on: any,
  off: any,
  baseline: any
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

  return <Row>
      <Col>
        <Card className="w-100">
        <Card.Body>
        <Card.Title>'On' Roster</Card.Title>
        <GenericTable tableFields={tableFields} tableData={tableData("on")}/>
        </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card className="w-100">
        <Card.Body>
        <Card.Title>'Off' Roster</Card.Title>
        <GenericTable tableFields={tableFields} tableData={tableData("off")}/>
        </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card className="w-100">
        <Card.Body>
        <Card.Title>'Baseline' Roster</Card.Title>
        <GenericTable tableFields={tableFields} tableData={tableData("baseline")}/>
        </Card.Body>
        </Card>
      </Col>
    </Row>;
}

export default RosterCompareTable;
