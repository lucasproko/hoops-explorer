// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable"

type Props = {
  readonly title: string
}

const TeamStatsTable: React.FunctionComponent<Props> = ({title}) => {
  // 1] State
  const [ showTable, setShowTable ] = useState(true)

  //TODO: sample data
  const commonData = {
    off_pts: 110, def_pts: 90, off_pos: 300, def_pos: 301, off_eff: 105, def_eff: 95,
    off_efg: 51, def_efg: 49, off_to: 19, def_to: 21, off_orb: 31, def_orb: 29, off_ftr: 36, def_ftr: 34,
    off_fg_3pr: 41, def_fg_3pr: 39, off_fg_2pr_mid: 18, def_fg_2pr_mid: 22, off_fg_2pr_rim: 41, def_fg_2pr_rim: 39,
    off_fg_3p: 36, def_fg_3p: 34, off_fg_2p: 51, def_fg_2p: 49, off_fg_2p_mid: 41, def_fg_2p_mid: 39, off_fg_2p_rim: 61, def_fg_2p_rim: 59,
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
  const sampleColorPicker = (val: any, valMeta: string) => {
    const num = val as number;
    return num > 50 ? "#00FF00" : "#FF0000";
  };

  // 2] Data Model
  const tableFields = { //accessors vs column metadata
    "title": GenericTableOps.addTitle("", ""),
    "sep0": GenericTableOps.addColSeparator(),
    "pts": GenericTableOps.addPtsCol("pp100", "Points per 100 possessions", GenericTableOps.defaultColorPicker),
    //TODO: get rid of sampleColorPicker
    "efg": GenericTableOps.addPctCol("eFG%", "Effective field goal% (3 pointers count 1.5x as much) for selected lineups", sampleColorPicker),
    "to": GenericTableOps.addPctCol("TO%", "Turnover % for selected lineups", GenericTableOps.defaultColorPicker),
    "orb": GenericTableOps.addPctCol("ORB%", "Offensive rebounding % for selected lineups", GenericTableOps.defaultColorPicker),
    "ftr": GenericTableOps.addPctCol("FTR", "Free throw rate for selected lineups", GenericTableOps.defaultColorPicker),
    "sep1": GenericTableOps.addColSeparator(),
    "fg_3pr": GenericTableOps.addPctCol("3PR", "Percentage of 3 pointers taken against all field goals", GenericTableOps.defaultColorPicker),
    "fg_2pr_mid": GenericTableOps.addPctCol("2PR rim", "Percentage of mid range 2 pointers taken against all field goals", GenericTableOps.defaultColorPicker),
    "fg_2pr_rim": GenericTableOps.addPctCol("2PR mid", "Percentage of layup/dunk/etc 2 pointers taken against all field goals", GenericTableOps.defaultColorPicker),
    "sep2": GenericTableOps.addColSeparator(),
    "fg_3p": GenericTableOps.addPctCol("3P%", "3 point field goal percentage", GenericTableOps.defaultColorPicker),
    "fg_2p": GenericTableOps.addPctCol("2P%", "2 point field goal percentage", GenericTableOps.defaultColorPicker),
    "fg_2p_mid": GenericTableOps.addPctCol("2P% mid", "2 point field goal percentage (mid range)", GenericTableOps.defaultColorPicker),
    "fg_2p_rim": GenericTableOps.addPctCol("2P% mid", "2 point field goal percentage (layup/dunk/etc)", GenericTableOps.defaultColorPicker),
    "sep3": GenericTableOps.addColSeparator(),
    "pos": GenericTableOps.addIntCol("Poss", "Total number of possessions for selected lineups", GenericTableOps.defaultColorPicker),
    "eff": GenericTableOps.addPtsCol("SoS", "Weighted average of the offensive or defensive efficiencies of the lineups' opponents", GenericTableOps.defaultColorPicker),
  };

  // 3] Utils

  // 4] View
  return <Card className="w-100">
    <Card.Body>
      <Card.Title
        onClick={() => { setShowTable(!showTable); return false } }
      ><a href="#">({showTable ? "+" : "-"}) {title}</a></Card.Title>
      <Collapse in={showTable}>
        <Container>
          <Row>
            <Col>
              <GenericTable tableFields={tableFields} tableData={sampleTableData}/>
            </Col>
          </Row>
        </Container>
      </Collapse>
    </Card.Body>
  </Card>;
};

export default TeamStatsTable;
