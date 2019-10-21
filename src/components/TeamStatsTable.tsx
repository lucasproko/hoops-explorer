// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable"

// Util imports
import { CbbColors } from "../utils/CbbColors"

export type TeamStatsModel = {
  on: any,
  off: any,
  baseline: any
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
  const sampleTableData = [
    GenericTableOps.buildDataRow(teamStatsOn, offPrefixFn, offCellMetaFn),
    GenericTableOps.buildDataRow(teamStatsOn, defPrefixFn, defCellMetaFn),
    GenericTableOps.buildRowSeparator(),
    GenericTableOps.buildDataRow(teamStatsOff, offPrefixFn, offCellMetaFn),
    GenericTableOps.buildDataRow(teamStatsOff, defPrefixFn, defCellMetaFn),
    GenericTableOps.buildRowSeparator(),
    GenericTableOps.buildDataRow(teamStatsBaseline, offPrefixFn, offCellMetaFn),
    GenericTableOps.buildDataRow(teamStatsBaseline, defPrefixFn, defCellMetaFn),
    GenericTableOps.buildRowSeparator(),
  ];

  // 2] Data Model
  const tableFields = { //accessors vs column metadata
    "title": GenericTableOps.addTitle("", ""),
    "sep0": GenericTableOps.addColSeparator(),
    "ppp": GenericTableOps.addPtsCol("pp100", "Points per 100 possessions", picker(...CbbColors.pp100)),
    "efg": GenericTableOps.addPctCol("eFG%", "Effective field goal% (3 pointers count 1.5x as much) for selected lineups", picker(...CbbColors.eFG)),
    "to": GenericTableOps.addPctCol("TO%", "Turnover % for selected lineups", picker(...CbbColors.tOver)),
    "orb": GenericTableOps.addPctCol("ORB%", "Offensive rebounding % for selected lineups", picker(...CbbColors.oReb)),
    "ftr": GenericTableOps.addPctCol("FTR", "Free throw rate for selected lineups", picker(...CbbColors.ftr)),
    "sep1": GenericTableOps.addColSeparator(),
    "3pr": GenericTableOps.addPctCol("3PR", "Percentage of 3 pointers taken against all field goals", picker(...CbbColors.fgr)),
    "2pmidr": GenericTableOps.addPctCol("2PR rim", "Percentage of mid range 2 pointers taken against all field goals", picker(...CbbColors.fgr)),
    "2primr": GenericTableOps.addPctCol("2PR mid", "Percentage of layup/dunk/etc 2 pointers taken against all field goals", picker(...CbbColors.fgr)),
    "sep2": GenericTableOps.addColSeparator(),
    "3p": GenericTableOps.addPctCol("3P%", "3 point field goal percentage", picker(...CbbColors.fg3P)),
    "2p": GenericTableOps.addPctCol("2P%", "2 point field goal percentage", picker(...CbbColors.fg2P)),
    "2pmid": GenericTableOps.addPctCol("2P% mid", "2 point field goal percentage (mid range)", picker(...CbbColors.fg2P_mid)),
    "2prim": GenericTableOps.addPctCol("2P% rim", "2 point field goal percentage (layup/dunk/etc)", picker(...CbbColors.fg2P_rim)),
    "sep3": GenericTableOps.addColSeparator(),
    "poss": GenericTableOps.addIntCol("Poss", "Total number of possessions for selected lineups", GenericTableOps.defaultColorPicker),
    "adj_opp": GenericTableOps.addPtsCol("SoS", "Weighted average of the offensive or defensive efficiencies of the lineups' opponents", GenericTableOps.defaultColorPicker),
  };

  // 3] Utils
  function picker(offScale: (val: number) => string, defScale: (val: number) => string) {
    return (val: any, valMeta: string) => {
      const num = val as number;
      return ("off" == valMeta) ? offScale(num) : defScale(num);
    };
  }

  // 4] View
  return <Container>
    <Row>
      <Col>
        <GenericTable tableFields={tableFields} tableData={sampleTableData}/>
      </Col>
    </Row>
  </Container>;
};

export default TeamStatsTable;
