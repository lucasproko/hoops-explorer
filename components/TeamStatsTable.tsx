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

type Props = {
}

const TeamStatsTable: React.FunctionComponent<Props> = ({}) => {

  //TODO: sample data
  const commonData = {
    off_pts: 110, def_pts: 90, off_pos: 300, def_pos: 301, off_eff: 105, def_eff: 95,
    off_efg: 0.51, def_efg: 0.49, off_to: 0.19, def_to: 0.21, off_orb: 0.31, def_orb: 0.29, off_ftr: 0.36, def_ftr: 0.34,
    off_fg_3pr: 0.41, def_fg_3pr: 0.39, off_fg_2pr_mid: 0.18, def_fg_2pr_mid: 0.22, off_fg_2pr_rim: 0.41, def_fg_2pr_rim: 0.39,
    off_fg_3p: 0.36, def_fg_3p: 0.34, off_fg_2p: 0.51, def_fg_2p: 0.49, off_fg_2p_mid: 0.41, def_fg_2p_mid: 0.39, off_fg_2p_rim: 0.61, def_fg_2p_rim: 0.59,
  };
  const sampleData1 = {
    off_title: "'On' Offense", def_title: "'On' Defense",
    ...commonData
  }
  const sampleData2 = {
    off_title: "'Off' Offense", def_title: "'Off' Defense",
    ...commonData
  }
  const sampleData3 = {
    off_title: "Baseline Offense", def_title: "Baseline Defense",
    ...commonData
  };
  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off"
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def"
  const sampleTableData = [
    GenericTableOps.buildDataRow(sampleData1, offPrefixFn, offCellMetaFn),
    GenericTableOps.buildDataRow(sampleData1, defPrefixFn, defCellMetaFn),
    GenericTableOps.buildRowSeparator(),
    GenericTableOps.buildDataRow(sampleData2, offPrefixFn, offCellMetaFn),
    GenericTableOps.buildDataRow(sampleData2, defPrefixFn, defCellMetaFn),
    GenericTableOps.buildRowSeparator(),
    GenericTableOps.buildDataRow(sampleData3, offPrefixFn, offCellMetaFn),
    GenericTableOps.buildDataRow(sampleData3, defPrefixFn, defCellMetaFn),
    GenericTableOps.buildRowSeparator(),
  ];

  // 2] Data Model
  const tableFields = { //accessors vs column metadata
    "title": GenericTableOps.addTitle("", ""),
    "sep0": GenericTableOps.addColSeparator(),
    "pts": GenericTableOps.addPtsCol("pp100", "Points per 100 possessions", picker(...CbbColors.pp100)),
    "efg": GenericTableOps.addPctCol("eFG%", "Effective field goal% (3 pointers count 1.5x as much) for selected lineups", picker(...CbbColors.eFG)),
    "to": GenericTableOps.addPctCol("TO%", "Turnover % for selected lineups", picker(...CbbColors.tOver)),
    "orb": GenericTableOps.addPctCol("ORB%", "Offensive rebounding % for selected lineups", picker(...CbbColors.oReb)),
    "ftr": GenericTableOps.addPctCol("FTR", "Free throw rate for selected lineups", picker(...CbbColors.ftr)),
    "sep1": GenericTableOps.addColSeparator(),
    "fg_3pr": GenericTableOps.addPctCol("3PR", "Percentage of 3 pointers taken against all field goals", picker(...CbbColors.fgr)),
    "fg_2pr_mid": GenericTableOps.addPctCol("2PR rim", "Percentage of mid range 2 pointers taken against all field goals", picker(...CbbColors.fgr)),
    "fg_2pr_rim": GenericTableOps.addPctCol("2PR mid", "Percentage of layup/dunk/etc 2 pointers taken against all field goals", picker(...CbbColors.fgr)),
    "sep2": GenericTableOps.addColSeparator(),
    "fg_3p": GenericTableOps.addPctCol("3P%", "3 point field goal percentage", picker(...CbbColors.fg3P)),
    "fg_2p": GenericTableOps.addPctCol("2P%", "2 point field goal percentage", picker(...CbbColors.fg2P)),
    "fg_2p_mid": GenericTableOps.addPctCol("2P% mid", "2 point field goal percentage (mid range)", picker(...CbbColors.fg2P_mid)),
    "fg_2p_rim": GenericTableOps.addPctCol("2P% mid", "2 point field goal percentage (layup/dunk/etc)", picker(...CbbColors.fg2P_rim)),
    "sep3": GenericTableOps.addColSeparator(),
    "pos": GenericTableOps.addIntCol("Poss", "Total number of possessions for selected lineups", GenericTableOps.defaultColorPicker),
    "eff": GenericTableOps.addPtsCol("SoS", "Weighted average of the offensive or defensive efficiencies of the lineups' opponents", GenericTableOps.defaultColorPicker),
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
