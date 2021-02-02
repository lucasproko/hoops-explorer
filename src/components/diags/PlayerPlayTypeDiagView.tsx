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
import { PosFamilyNames, PlayTypeUtils } from "../../utils/stats/PlayTypeUtils";
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

  const [ showPlayerBreakdown, setShowPlayerBreakdown ] = useState(false);

  ////////////////////////////////////

  // Build raw assist table:

  const targetSource = [ "source", "target" ];
  const shotTypes = [ "3p", "mid", "rim" ];
  const shotNameMap = { "3p": "3P", "mid": "Mid", "rim": "Rim" } as Record<string, string>;
  const shotMap = { "3p": "3p", "rim": "2prim", "mid": "2pmid" } as Record<string, string>;

  const allPlayers = _.chain(targetSource).flatMap((loc) => {
    return shotTypes.flatMap((key) => {
      return _.keys(player[`off_ast_${key}_${loc}`]?.value || {});
    });
  }).uniq().value();

  const rawAssistTableFields = {
    "title": GenericTableOps.addTitle("", "", CommonTableDefs.singleLineRowSpanCalculator, "", GenericTableOps.htmlFormatter),
    ...(_.fromPairs(targetSource.flatMap((loc) => {
        const targetNotSource = loc == "target";
        return [
          [`sep${loc}`, GenericTableOps.addColSeparator(0.25) ],
        ].concat(
          shotTypes.flatMap((key) => {
            const descriptionAst = targetNotSource ?
              `% of total assists to this player for this shot type` : `% of scoring possessions/assists of this shot type assisted BY the specified row (team-mate/category)`;
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
                [ `sep${loc}${key}`, GenericTableOps.addColSeparator(0.125) ],
              ] : []
            );
          }).concat(targetNotSource ? [] : [
            [
              `source_sf`, GenericTableOps.addPctCol(`SF%`,
                "% of scoring possessions/assists ending in a trip to the FT line", CbbColors.varPicker(CbbColors.p_ast_breakdown),
              )
            ],
            [ `sep${loc}_targetsrc`, GenericTableOps.addColSeparator(0.75) ],
            [
              `target_ast`, GenericTableOps.addPctCol(`AST%`,
                "% of scoring possessions/assists ending with an assist TO the specified row (team-mate/team category)", CbbColors.varPicker(CbbColors.p_ast_breakdown),
              )
            ]
          ])
        );
      })))
  };

  // Couple of utils for decorating the background eFG
  const buildInfoRow = (stat: any) =>
    <text style={CommonTableDefs.getTextShadow(stat, CbbColors.off_eFG)}>
      <i>{(100*(stat?.value || 0)).toFixed(1)}%</i>
    </text>;
  const enrichExtraInfo = (stat: any) => {
    if (stat.extraInfo) {
      stat.extraInfo = <div>
        Example play types:<br/>
        {stat.extraInfo.map((ex, i) => <li key={`ex${i}`}>{ex}</li>)}
      </div>;
    }
    return stat;
  };
  const buildInfoRows = (statSet: any) => {
    return _.mapValues(statSet, (valObj, key) => { // Decorate eFG
      return _.endsWith(key, "_efg") ? buildInfoRow(valObj) : enrichExtraInfo(valObj);
    });
  }

  const playerStyle = PlayTypeUtils.buildPlayerStyle(player);

  const basicStyleInfo = [
    { title: <i>Unassisted</i>, ...playerStyle.unassisted },
    { title: <i>Assist totals:</i>, ...playerStyle.assisted }
    ,
    { title: <i>In Transition</i>, ...playerStyle.transition },
    { title: <i>Scrambles after RB</i>, ...playerStyle.scramble },
  ];

  // (note that the interaction between this logic and the innards of the PlayTypeUtils is a bit tangled currently)
  const playerAssistNetwork = _.orderBy(allPlayers.map((p) => {
    var mutableTotal = 0;
    const [ info, mutableTmpTotal ] = PlayTypeUtils.buildPlayerOrPosAssistNetwork(
      p, player, playerStyle.totalScoringPlaysMade, playerStyle.totalAssists,
      rosterStatsByCode
    );
    mutableTotal += mutableTmpTotal;
    return {
      code: p,
      title: <span><b>{rosterStatsByCode[p]?.key || ""}</b> ({rosterStatsByCode[p]?.role})</span>,
      ...info,
      total_shots_or_assists: mutableTotal
    };
  }), [ "total_shots_or_assists" ], [ "desc" ]);

  const posCategoryAssistNetwork = PlayTypeUtils.buildPosCategoryAssistNetwork(
    playerAssistNetwork, rosterStatsByCode, player
  ).map(info => {
    return {
      ...info,
      title: <span><i>{_.capitalize(PosFamilyNames[info.order])}</i></span>,
    };
  });

  const playerBreakdownHtml = showPlayerBreakdown ?
    <b>Player breakdown (<a href="#" onClick={(event) => { event.preventDefault(); setShowPlayerBreakdown(false) }}
      >hide<
    /a>):</b>
    :
    <b><a href="#" onClick={(event) => { event.preventDefault(); setShowPlayerBreakdown(true) }}
      >Show player breakdown<
    /a></b>
    ;

  const rawAssistTableData = [
    GenericTableOps.buildTextRow(
      <Row>
        <Col xs={3}></Col>
        <Col xs={3} className="d-flex justify-content-center"><i><span>Scored / Assisted By:</span></i></Col>
        <Col xs={6} className="d-flex justify-content-center"><i><span>Assists:</span></i></Col>
      </Row>
    )
  ].concat(_.take(basicStyleInfo, 2).map(objData => {
    return GenericTableOps.buildDataRow(
      objData, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta
    );
  })).concat(
    posCategoryAssistNetwork.map(info => buildInfoRows(info)).map((info) =>
      GenericTableOps.buildDataRow(info, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    )
  ).concat(
    [ GenericTableOps.buildRowSeparator() ]
  ).concat(_.drop(basicStyleInfo, 2).map(objData => {
    return GenericTableOps.buildDataRow(
      objData, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta
    );
  })).concat(
    [ GenericTableOps.buildTextRow(playerBreakdownHtml) ]
  ).concat(
    showPlayerBreakdown ? playerAssistNetwork.map(info => buildInfoRows(info)).map((info) =>
      GenericTableOps.buildDataRow(info, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    ) : []
  );

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
    </span>;
};
export default PlayerPlayTypeDiagView;
