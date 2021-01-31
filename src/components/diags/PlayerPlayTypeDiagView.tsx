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
import { PlayTypeUtils } from "../../utils/stats/PlayTypeUtils";
import { PositionUtils } from "../../utils/stats/PositionUtils";
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { CbbColors } from "../../utils/CbbColors";
import { LineupUtils } from "../../utils/stats/LineupUtils";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "../GenericTable";

const tidyNumbers = (k: string, v: any) => {
  if (_.isNumber(v)) {
    const numStr = v.toFixed(3);
    if (_.endsWith(numStr, ".000")) {
      return numStr.split(".")[0];
    } else {
      return parseFloat(numStr);
    }
  } else {
    return v;
  }
}

type Props = {
  player: Record<string, any>,
  rosterStatsByCode: Record<string, any>,
  teamSeason: string,
  showHelp: boolean,
  showDetailsOverride?: boolean
};
const PlayerPlayTypeDiagView: React.FunctionComponent<Props> = ({player, rosterStatsByCode, teamSeason, showHelp, showDetailsOverride}) => {

  ////////////////////////////////////

  // Build raw assist table:

  const targetSource = [ "source", "target" ];
  const shotTypes = [ "3p", "mid", "rim" ];
  const allPlayers = _.chain(targetSource).flatMap((loc) => {
    return shotTypes.flatMap((key) => {
      return _.keys(player[`off_ast_${key}_${loc}`]?.value || {});
    });
  }).uniq().value(); //TODO sort by something better...

  const shotNameMap = { "3p": "3P", "mid": "Mid", "rim": "Rim" } as Record<string, string>;
  const rawAssistTableFields = {
    "title": GenericTableOps.addTitle("", "", CommonTableDefs.singleLineRowSpanCalculator, "", GenericTableOps.htmlFormatter),
    ...(_.fromPairs(targetSource.flatMap((loc) => {
        const targetNotSource = loc == "target";
        return [
          [`sep${loc}`, GenericTableOps.addColSeparator(1.0) ],
        ].concat(
          shotTypes.flatMap((key) => {
            const descriptionAst = targetNotSource ?
              `% of total assists to this player for this shot type` : `% of scoring possessions/assists of this shot type assisted BY this player`;
            const descriptionEfg = `The season eFG% of this shot type / player`;
            return [
              [
                `${loc}_${key}_ast`, GenericTableOps.addPctCol(`${shotNameMap[key]!}${targetNotSource ? " AST%" : ""} `,
                  descriptionAst, CbbColors.varPicker(CbbColors.p_ast_breakdown)
                )
              ],
            ].concat(targetNotSource ?
              [
                [
                  `${loc}_${key}_efg`, GenericTableOps.addDataCol(`eFG`,
                    descriptionEfg, CbbColors.offOnlyPicker(CbbColors.alwaysWhite, CbbColors.alwaysWhite), GenericTableOps.percentOrHtmlFormatter
                  )
                ],
                [ `sep${loc}${key}`, GenericTableOps.addColSeparator(0.25) ],
              ] : []
            );
          }).concat(targetNotSource ? [] : [
            [
              `source_sf`, GenericTableOps.addPctCol(`SF%`,
                "% of scoring possessions/assists ending in a trip to the FT line", CbbColors.varPicker(CbbColors.p_ast_breakdown),
              )
            ],
            [
              `target_ast`, GenericTableOps.addPctCol(`AST%`,
                "% of scoring possessions/assists ending with an assist TO the specified player", CbbColors.varPicker(CbbColors.p_ast_breakdown),
              )
            ],
            [ `sep${loc}_targetsrc`, GenericTableOps.addColSeparator(0.25) ]
          ])
        );
      })))
  };
  const totalAssists = player[`total_off_assist`]?.value || 0;
  const totalShotsMade = player[`total_off_fgm`]?.value || 0;
  const totalFtTripsMade = 0.475*(player[`total_off_fta`]?.value || 0);
  const totalScoringPlaysMade = (totalShotsMade + totalFtTripsMade + totalAssists) || 1;
  const shotMap = { "3p": "3p", "rim": "2prim", "mid": "2pmid" } as Record<string, string>;
  const buildInfoRow = (stat: any) =>
    <text style={CommonTableDefs.getTextShadow(stat, CbbColors.off_eFG)}>
      <i>{(100*(stat?.value || 0)).toFixed(1)}%</i>
    </text>;

  const unassisted = shotTypes.map((key) => {
    const shots = player[`total_off_${shotMap[key]!}_made`]?.value || 0;
    const assisted = player[`total_off_${shotMap[key]!}_ast`]?.value || 0;
    const unassisted = shots - assisted;
    return [ `source_${key}_ast`, unassisted > 0 ? {
      value: unassisted/totalScoringPlaysMade
    } : null];
  }).concat([
    [ `source_sf`, { value: totalFtTripsMade/totalScoringPlaysMade } ]
  ]);
  const rawAssistTableData = [
    GenericTableOps.buildDataRow(
      {
        title: <i>Unassisted - half court</i>,
        ...(_.fromPairs(unassisted))
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    ,
    GenericTableOps.buildDataRow(
      {
        title: <i>In Transition</i>,
        ...({})
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    ,
    GenericTableOps.buildDataRow(
      {
        title: <i>Scrambles</i>,
        ...({})
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    ,
    GenericTableOps.buildRowSeparator()
  ].concat(_.orderBy(allPlayers.map((p) => {
    var mutableTotal = 0;
    const info = {
      title: <span><b>{rosterStatsByCode[p]?.key || ""}</b> ({rosterStatsByCode[p]?.role})</span>,
      ...(_.fromPairs([ "target", "source" ].flatMap((loc) => {
        const targetNotSource = loc == "target";
        var mutableAssistsAcrossShotTypes = 0;
        return [ "3p", "mid", "rim" ].flatMap((key) => {
          const assists = player[`off_ast_${key}_${loc}`]?.value?.[p] || 0;
          mutableAssistsAcrossShotTypes += targetNotSource ? assists : 0;
          mutableTotal += assists;
          const denominator = targetNotSource ? (totalAssists || 1) : totalScoringPlaysMade;
          const eFG = (key == "3p" ? 1.5 : 1) * rosterStatsByCode[p]?.[`off_${shotMap[key]!}`]?.value || 0;
          return assists > 0 ? [
            [`${loc}_${key}_ast`, { value: assists/(denominator || 1) }],
            [`${loc}_${key}_efg`, buildInfoRow({ value: eFG }) ]
          ] : [];
        }).concat( (targetNotSource && (mutableAssistsAcrossShotTypes > 0)) ?
          [ [ `target_ast`, { value: mutableAssistsAcrossShotTypes / totalScoringPlaysMade } ] ]: []
        );
      })))
    };
    return { ...info, total_shots_or_assists: mutableTotal };
  }), [ "total_shots_or_assists" ], [ "desc" ]).map((info) =>
    GenericTableOps.buildDataRow(info, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
  ));

  ////////////////////////////////////

  // Visual layout:

  return <span>
      <br/>
      <span>
        <b>Scoring Analysis for [{player.key}]</b>
      </span>
      <br/>
      <br/>
      <Container>
        <Col xs={10}>
          <GenericTable responsive={false} tableCopyId="rawAssistNetworks" tableFields={rawAssistTableFields} tableData={rawAssistTableData}/>
        </Col>
      </Container>
      <br/>
    </span>;
};
export default PlayerPlayTypeDiagView;
