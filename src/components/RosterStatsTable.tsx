// React imports:
import React, { useState } from 'react';

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
import InputGroup from 'react-bootstrap/InputGroup';

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
import Select, { components} from "react-select"

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable"

// Util imports
import { CbbColors } from "../utils/CbbColors"
import { GameFilterParams } from "../utils/FilterModels";
import { TeamStatsModel } from '../components/TeamStatsTable';

export type RosterStatsModel = {
  on?: Array<any>,
  off?: Array<any>,
  baseline?: Array<any>,
  error_code?: string
}
type Props = {
  gameFilterParams: GameFilterParams,
  teamStats: TeamStatsModel,
  rosterStats: RosterStatsModel
}

const RosterStatsTable: React.FunctionComponent<Props> = ({gameFilterParams, teamStats, rosterStats}) => {

  // 1] State

  // 2] Data Model

  const tableFields = { //accessors vs column metadata
    "title": GenericTableOps.addTitle("", "", rowSpanCalculator, "small"),
    "sep0": GenericTableOps.addColSeparator(),
    "rtg": GenericTableOps.addPtsCol("Rtg", "Offensive/Defensive rating for selected lineups", CbbColors.picker(...CbbColors.pp100)),
    "usage": GenericTableOps.addPctCol("Usg", "% of team possessions used for selected lineups", CbbColors.picker(...CbbColors.usg)), //TODO needs to be steeper
    "sep1": GenericTableOps.addColSeparator(),
    "efg": GenericTableOps.addPctCol("eFG%", "Effective field goal% (3 pointers count 1.5x as much) for player in selected lineups", CbbColors.picker(...CbbColors.eFG)),
    "assist": GenericTableOps.addPctCol("AST%", "Assist % for player in selected lineups", CbbColors.picker(...CbbColors.ast)),
    "to": GenericTableOps.addPctCol("TO%", "Turnover % for player in for selected lineups", CbbColors.picker(...CbbColors.p_tOver)),
    "orb": GenericTableOps.addPctCol("RB%", "Offensive/Defensive rebounding % for player in selected lineups", CbbColors.picker(...CbbColors.p_oReb)),
    "ftr": GenericTableOps.addPctCol("FTR", "Free throw rate for player in selected lineups", CbbColors.picker(...CbbColors.p_ftr)),
    "sep2": GenericTableOps.addColSeparator(),
    "3pr": GenericTableOps.addPctCol("3PR", "Percentage of 3 pointers taken against all field goals", CbbColors.picker(...CbbColors.fgr)),
    "2pmidr": GenericTableOps.addPctCol("2PR mid", "Percentage of mid range 2 pointers taken against all field goals", CbbColors.picker(...CbbColors.fgr)),
    "2primr": GenericTableOps.addPctCol("2PR rim", "Percentage of layup/dunk/etc 2 pointers taken against all field goals", CbbColors.picker(...CbbColors.fgr)),
    "sep3": GenericTableOps.addColSeparator(),
    "3p": GenericTableOps.addPctCol("3P%", "3 point field goal percentage", CbbColors.picker(...CbbColors.fg3P)),
    "2p": GenericTableOps.addPctCol("2P%", "2 point field goal percentage", CbbColors.picker(...CbbColors.fg2P)),
    "2pmid": GenericTableOps.addPctCol("2P% mid", "2 point field goal percentage (mid range)", CbbColors.picker(...CbbColors.fg2P_mid)),
    "2prim": GenericTableOps.addPctCol("2P% rim", "2 point field goal percentage (layup/dunk/etc)", CbbColors.picker(...CbbColors.p_fg2P_rim)),
    "sep4": GenericTableOps.addColSeparator(),
    "team_poss": GenericTableOps.addIntCol("Poss", "Number of possessions in selected lineups that player was on the floor", GenericTableOps.defaultColorPicker),
  };

  // 3] Utils

  // 3.1] Table building

  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off";
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def";

  const onOffBasePicker = (str: string, arr: Array<any>) => {
    return _.find(arr, (p) => _.startsWith(p.title, str));
  }

  const allPlayers = _.chain([
    _.map(rosterStats.on  || [], (p) => _.merge(p, {title: `'ON' ${p.key}`})),
    _.map(rosterStats.off  || [], (p) => _.merge(p, {title: `'OFF' ${p.key}`})),
    _.map(rosterStats.baseline || [], (p) => _.merge(p, {title: `'Baseline' ${p.key}`})),
  ]).flatten().groupBy("key").toPairs().map((key_onOffBase) => {

    return {
      key: key_onOffBase[0],
      on: onOffBasePicker("'ON' ", key_onOffBase[1]),
      off: onOffBasePicker("'OFF' ", key_onOffBase[1]),
      baseline: onOffBasePicker("'Baseline' ", key_onOffBase[1])
    };
  }).value();

  const tableData = _.chain(allPlayers).filter((player) => {
    //TODO: player filter on player.key
    return true;
  }).sortBy(
    [ (p) => { return p.on?.off_pos?.value ||  p.baseline?.off_pos?.value || 0 } ] //TODO: other things
  ).flatMap((player) => {
    const onStats = { off_title: player.on?.title, def_title: "", ...player.on };
    const offStats = { off_title: player.off?.title, def_title: "", ...player.off };
    const baseStats = { off_title: player.baseline?.title, def_title: "", ...player.baseline };
    return _.flatten([
      _.isNil(onStats.off_title) ? [ ] : [
        GenericTableOps.buildDataRow(onStats, offPrefixFn, offCellMetaFn),
        GenericTableOps.buildDataRow(onStats, defPrefixFn, defCellMetaFn)
      ],
      _.isNil(offStats.off_title) ? [ ] : [
        GenericTableOps.buildDataRow(offStats, offPrefixFn, offCellMetaFn),
        GenericTableOps.buildDataRow(offStats, defPrefixFn, defCellMetaFn)
      ],
      _.isNil(baseStats.off_title) ? [ ] : [
        GenericTableOps.buildDataRow(baseStats, offPrefixFn, offCellMetaFn),
        GenericTableOps.buildDataRow(baseStats, defPrefixFn, defCellMetaFn)
      ],
      [ GenericTableOps.buildRowSeparator() ]
    ]);
  }).value(); //TODO etc etc

  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return (rosterStats?.baseline?.length || 0) == 0;
  }
  /** Table formatter */
  function rowSpanCalculator(cellMeta: string) {
    switch(cellMeta) {
      case "off": return 2;
      case "def": return 0;
      default: return 1;
    }
  }

  // 4] View

  return <Container>
    <LoadingOverlay
      active={needToLoadQuery()}
      text={rosterStats.error_code ?
        `Query Error: ${rosterStats.error_code}` :
        "Press 'Submit' to view results"
      }
    >
      <Row>
        <Col>
          <GenericTable tableCopyId="rosterStatsTable" tableFields={tableFields} tableData={tableData}/>
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
}

export default RosterStatsTable;
