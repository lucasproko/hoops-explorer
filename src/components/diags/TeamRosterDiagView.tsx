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
import { PositionUtils } from "../../utils/stats/PositionUtils";
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { CbbColors } from "../../utils/CbbColors";
import { LineupUtils } from "../../utils/stats/LineupUtils";
import { LineupTableUtils, PositionInfo } from "../../utils/stats/LineupTableUtils";
import { TableDisplayUtils } from "../../utils/tables/TableDisplayUtils";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "../GenericTable";

type Props = {
  positionInfo: PositionInfo[][],
  rosterStatsByKey: Record<string, any>,
  positionFromPlayerKey: Record<string, any>,
  teamSeasonLookup: string,
  showHelp: boolean
};
const TeamRosterDiagView: React.FunctionComponent<Props> = ({positionInfo, rosterStatsByKey, positionFromPlayerKey, teamSeasonLookup, showHelp}) => {

  const tableCols = [ "pg", "sg", "sf", "pf", "c" ];
  const tableFields = {
    "title": GenericTableOps.addTitle(
      "", "", CommonTableDefs.singleLineRowSpanCalculator, "", GenericTableOps.htmlFormatter, 0
    ),
    "pg": GenericTableOps.addDataCol(`PG`, "PG slot",
      CbbColors.offOnlyPicker(CbbColors.alwaysWhite, CbbColors.alwaysWhite), GenericTableOps.percentOrHtmlFormatter
    ),
    "sg": GenericTableOps.addDataCol(`SG`, "SG slot",
      CbbColors.offOnlyPicker(CbbColors.alwaysWhite, CbbColors.alwaysWhite), GenericTableOps.percentOrHtmlFormatter
    ),
    "sf": GenericTableOps.addDataCol(`SF`, "SF slot",
      CbbColors.offOnlyPicker(CbbColors.alwaysWhite, CbbColors.alwaysWhite), GenericTableOps.percentOrHtmlFormatter
    ),
    "pf": GenericTableOps.addDataCol(`PF`, "PF slot",
      CbbColors.offOnlyPicker(CbbColors.alwaysWhite, CbbColors.alwaysWhite), GenericTableOps.percentOrHtmlFormatter
    ),
    "c": GenericTableOps.addDataCol(`C`, "C slot",
      CbbColors.offOnlyPicker(CbbColors.alwaysWhite, CbbColors.alwaysWhite), GenericTableOps.percentOrHtmlFormatter
    ),
  };

  const tableSize = _.max(positionInfo.map(players => players?.length || 0));
  const possByPosPctInv = positionInfo.map(players => _.sumBy(players, "numPoss")).map(num => 100.0/(num || 1));

  const tableRawData = _.range(tableSize).map(index => {
    return _.chain(tableCols).map((col, colIndex) => {
      const playerCodeId = positionInfo?.[colIndex]?.[index];

      if (playerCodeId) {
        const pct = (playerCodeId.numPoss || 0)*(possByPosPctInv[colIndex] || 0);

        if (pct >= 3) { //seems like a good threshold
/**///TODO have option to show all, plus tidy up table
          const decoratedPlayerInfo = TableDisplayUtils.buildDecoratedLineup(
            playerCodeId.code + col, [ playerCodeId ], rosterStatsByKey, positionFromPlayerKey, "off_adj_rtg", true
          );
          return [ col, <Row>
              <Col xs="1"/>
              <Col xs="5">{decoratedPlayerInfo}</Col>
              <Col xs="4">{pct.toFixed(1)}%</Col>
              <Col xs="1"/>
            </Row>
          ];
        } else {
          return [ col, undefined ];
        }
      } else {
        return [ col, undefined ];
      }
    }).fromPairs().value();
  });
  const tableData = tableRawData.map(row => GenericTableOps.buildDataRow(
    row, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta
  ));

  return <Container>
    <Col xs={12}>
      <GenericTable responsive={false} tableCopyId="rosterView" tableFields={tableFields} tableData={tableData}/>
    </Col>
  </Container>;

};
export default TeamRosterDiagView;
