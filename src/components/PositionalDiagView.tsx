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
import { StatsUtils } from "../utils/StatsUtils";
import { CommonTableDefs } from "../utils/CommonTableDefs";
import { CbbColors } from "../utils/CbbColors";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable";

const tooltipTradPosGenerator = (pos: string) => {
  return `% Fit of the player vs signature stats associated with players traditionally called [${pos}]`;
};

const tooltipWeightGenerator = (pos: string) => {
  return `The weight associated with this feature for the position [${pos}]`;
};

const tooltipContribGenerator = (pos: string) => {
  return `How much this feature improves/reduces the chance of this player's fit for this position ([${pos}])`;
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

/** Assigns different color maps for the single featyre value column */
const colorPicker = (val: any, valMeta: string) => {
  const num = val.value as number;
  switch (valMeta) {
    case "off_assist": return CbbColors.p_ast_offDef(num);
    case "off_to": return CbbColors.off_TO(num);
    case "off_3pr": return CbbColors.fgr_offDef(num);
    case "off_2pmidr": return CbbColors.fgr_offDef(num);
    case "off_2primr": return CbbColors.fgr_offDef(num);
    case "off_ftr": return CbbColors.off_FTR(num);
    case "off_orb": return CbbColors.p_off_OR(num);
    case "off_drb": return CbbColors.p_def_OR(num);
    case "def_to": return CbbColors.p_def_TO(num);
    case "def_2prim": return CbbColors.p_def_2P_rim(num);
    case "def_ftr": return CbbColors.p_def_FTR(num);
    default: return undefined;
  }
};

const complexDiagTable = {

  "feature": GenericTableOps.addTitle("", "Each of the statistical features used in the classification", CommonTableDefs.singleLineRowSpanCalculator, "", GenericTableOps.htmlFormatter),
  "sep0": GenericTableOps.addColSeparator(),
  "player": GenericTableOps.addPctCol("Player%", "The value of this player vs this statistic", colorPicker),
  "sep1": GenericTableOps.addColSeparator(),
  "pos_pg": GenericTableOps.addPctCol("Wt PG", tooltipWeightGenerator("Point Guard"), GenericTableOps.defaultColorPicker),
  "contrib_pg": GenericTableOps.addPctCol("+- PG%", tooltipContribGenerator("Point Guard"), CbbColors.varPicker(CbbColors.posColors)),
  "sep2": GenericTableOps.addColSeparator(),
  "pos_sg": GenericTableOps.addPctCol("Wt SG", tooltipWeightGenerator("Shooting Guard"), GenericTableOps.defaultColorPicker),
  "contrib_sg": GenericTableOps.addPctCol("+- SG%", tooltipContribGenerator("Shooting Guard"), CbbColors.varPicker(CbbColors.posColors)),
  "sep3": GenericTableOps.addColSeparator(),
  "pos_sf": GenericTableOps.addPctCol("Wt SF", tooltipWeightGenerator("Small Forward"), GenericTableOps.defaultColorPicker),
  "contrib_sf": GenericTableOps.addPctCol("+- SF%", tooltipContribGenerator("Small Forward"), CbbColors.varPicker(CbbColors.posColors)),
  "sep4": GenericTableOps.addColSeparator(),
  "pos_pf": GenericTableOps.addPctCol("Wt PF", tooltipWeightGenerator("Power Forward"), GenericTableOps.defaultColorPicker),
  "contrib_pf": GenericTableOps.addPctCol("+- PF%", tooltipContribGenerator("Power Forward"), CbbColors.varPicker(CbbColors.posColors)),
  "sep5": GenericTableOps.addColSeparator(),
  "pos_c": GenericTableOps.addPctCol("Wt C", tooltipWeightGenerator("Center"), GenericTableOps.defaultColorPicker),
  "contrib_c": GenericTableOps.addPctCol("+- C%", tooltipContribGenerator("Center"), CbbColors.varPicker(CbbColors.posColors)),
};

const calculatedDescriptions = {
  calc_ast_tov: [ "A/TOV", "Assist to Turnover ratio in selected lineups" ],
  calc_three_relative: [ "3PQ%", "A measure of how good a player is at shooting 3s relative to their overall scoring efficiency (1.5*3P%/eFG)" ],
  calc_mid_relative: [ "MidQ%", "A measure of how good a player is at shooting mid-range 2s relative to their overall scoring efficiency (2Pmid%/eFG)" ],
  calc_rim_relative: [ "RimQ%", "A measure of how good a player is at shooting layups/posts/drunks relative to their overall scoring efficiency (2Prim%/eFG)" ],
  calc_assist_per_fga: [ "A/FG%", "The ratio of Assists to FG attempts, expressed as a %" ],
  calc_ft_relative_inv: [ "FGD%", "A very approximate measure of how tough the shots a player takes relative to their overall shooting ability (eFG/FT%) - the lower the number the tougher the shots the player takes." ]
} as Record<string, [ string, string ]>;

const complexDiagSubtitles = {
  calc_ast_tov: "Ball-Handling",
  off_3pr: "Shot Selection",
  calc_ft_relative_inv: "Shot-Making",
  def_to: "Rebounding and Defense"
} as Record<string, string>;

const contribKeys = [ "contrib_pg", "contrib_sg", "contrib_sf", "contrib_pf", "contrib_c" ];

type Props = {
  player: Record<string, any>
};
const PositionalDiagView: React.FunctionComponent<Props> = ({player}) => {

  const [ positionInfo, positionDiags ] = StatsUtils.buildPositionConfidences(player);
  const [ positionId, positionIdDiag ] = StatsUtils.buildPosition(positionInfo, player);

  const [ showComplexDiag, setShowComplexDiag ] = useState(true);

  const simpleDiagTableData = [ GenericTableOps.buildDataRow({
    title: StatsUtils.idToPosition[positionId] || "Unknown",
    ...(_.mapValues(positionInfo, (p: number) => { return { value: p }; }))
  }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta) ];

  const buildFeatureTooltip = (key: string, text: string) => {
    return <Tooltip id={key + "Tooltip"}>{text}</Tooltip>;
  };

  const complexDiagTableData = showComplexDiag ? [ // Total scores

    GenericTableOps.buildDataRow({
      feature: "Total Score",
      ...(_.mapValues(positionDiags.scores, (s) => { return { value: s/100.0 } })),
    }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)

  ].concat(_.chain(StatsUtils.positionFeatureWeights) // Per field contrib/weights:
    .flatMap((feat_scale_weights: [string, number, number[]]) => {
      const feat = feat_scale_weights[0];
      const scale = feat_scale_weights[1];
      const weights = _.mapValues(_.fromPairs(
        _.zip(StatsUtils.tradPosList, feat_scale_weights[2])
      ), (v: any) => { return { value: v } });

      const calculated = positionDiags.calculated;

      const featureName = CommonTableDefs.individualDescriptions[feat] ||
                          calculatedDescriptions[feat] || [ feat, "" ];

      const fieldVal = _.startsWith(feat, "calc_") ? (calculated[feat] || 0) : (player[feat]?.value || 0);

      const dataRow = GenericTableOps.buildDataRow({
        feature: <OverlayTrigger placement="auto" overlay={buildFeatureTooltip(feat, featureName[1])}>
          <b>{featureName[0]}</b>
        </OverlayTrigger>
        ,
        player: { value: fieldVal*(scale/100) },
        ...weights,
        ...(_.fromPairs(positionDiags.absScores.map((absScore: number, index: number) => {
          return [ contribKeys[index], { value: (feat_scale_weights[2][index] || 0)*fieldVal*scale/absScore } ];
        })))
      }, GenericTableOps.defaultFormatter, (key: string, value: any) => feat);

      const subtitle = complexDiagSubtitles[feat];

      return subtitle ? [
        GenericTableOps.buildTextRow(<span><em>{subtitle}</em></span>, "small"),
        dataRow
      ] : [ dataRow ];
    }).value()) : [];

  //TODO: remove this once the tables are up
  const tidyObj = (vo: Record<string, number>) => _.mapValues(vo, (v: number) => v.toFixed(2))

  return <span>
      <Container>
        <Col xs={8}>
          <GenericTable tableCopyId="simpleDiagTable" tableFields={simpleDiagTable} tableData={simpleDiagTableData}/>
        </Col>
      </Container>
      <ul>
        <li>Rule used to categorize player: <em>{positionIdDiag}</em></li>
      </ul>
      (<a href="#" onClick={(event) => { event.preventDefault(); setShowComplexDiag(!showComplexDiag) }}>
        {showComplexDiag ? "Hide": "Show"} detailed positional breakdown
      </a>)
      {showComplexDiag ? <Container>
        <Col xs={8}>
          <GenericTable tableCopyId="complexDiagTable" tableFields={complexDiagTable} tableData={complexDiagTableData}/>
        </Col>
      </Container> : null}
    </span>;
};
export default PositionalDiagView;
