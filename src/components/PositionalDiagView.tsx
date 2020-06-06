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

// Utils
import { StatsUtils } from "../utils/StatsUtils";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable";

const tooltipTradPosGenerator = (pos: string) => {
  return `% Fit of the player vs signature stats associated with players traditionally called '${pos}'`
};

// Table defs
const simpleDiagTable = {
  "title": GenericTableOps.addTitle("", "The positional class associated with this player's statistical signature"),
  "sep0": GenericTableOps.addColSeparator(),
  "pos_pg": GenericTableOps.addPctCol("PG%", tooltipTradPosGenerator("Point Guard"), GenericTableOps.defaultColorPicker),
  "pos_sg": GenericTableOps.addPctCol("SG%", tooltipTradPosGenerator("Shooting Guard"), GenericTableOps.defaultColorPicker),
  "pos_sf": GenericTableOps.addPctCol("SF%", tooltipTradPosGenerator("Small Forward"), GenericTableOps.defaultColorPicker),
  "pos_pf": GenericTableOps.addPctCol("PF%", tooltipTradPosGenerator("Power Forward"), GenericTableOps.defaultColorPicker),
  "pos_c": GenericTableOps.addPctCol("C%", tooltipTradPosGenerator("Center"), GenericTableOps.defaultColorPicker),
};

type Props = {
  player: Record<string, any>
};
const PositionalDiagView: React.FunctionComponent<Props> = ({player}) => {

  const [ positionInfo, positionDiags ] = StatsUtils.buildPositionConfidences(player)

  const simpleDiagTableData = [ GenericTableOps.buildDataRow({
    title: "TBD",
    ...(_.mapValues(positionInfo, (p: number) => { return { value: p }; }))
  }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta) ];

  //TODO: remove this once the tables are up
  const tidyObj = (vo: Record<string, number>) => _.mapValues(vo, (v: number) => v.toFixed(2))

  return <span>
      <Container>
        <Col xs={8}>
          <GenericTable tableCopyId="simpleDiagTable" tableFields={simpleDiagTable} tableData={simpleDiagTableData}/>
        </Col>
      </Container>
      <br/>
      { JSON.stringify(tidyObj(positionDiags.scores)) }<br/>
    </span>;
};
export default PositionalDiagView;
