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
import { CommonTableDefs } from "../../utils/CommonTableDefs";
import { CbbColors } from "../../utils/CbbColors";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "../GenericTable";

// Table defs
/*
const simpleDiagTable = {
  "title": GenericTableOps.addTitle("", "The positional class associated with this player's statistical signature"),
  "sep0": GenericTableOps.addColSeparator(),
  "pos_pg": GenericTableOps.addPctCol("PG%", tooltipTradPosGenerator("Point Guard"), GenericTableOps.defaultColorPicker),
  "pos_sg": GenericTableOps.addPctCol("SG%", tooltipTradPosGenerator("Shooting Guard"), GenericTableOps.defaultColorPicker),
  "pos_sf": GenericTableOps.addPctCol("SF%", tooltipTradPosGenerator("Small Forward"), GenericTableOps.defaultColorPicker),
  "pos_pf": GenericTableOps.addPctCol("PF%", tooltipTradPosGenerator("Power Forward"), GenericTableOps.defaultColorPicker),
  "pos_c": GenericTableOps.addPctCol("C%", tooltipTradPosGenerator("Center"), GenericTableOps.defaultColorPicker),
};

const complexDiagTable = {

  "feature": GenericTableOps.addTitle("", "Each of the statistical features used in the classification", CommonTableDefs.singleLineRowSpanCalculator, "", GenericTableOps.htmlFormatter),
  "sep0": GenericTableOps.addColSeparator(),
  "player": GenericTableOps.addPctCol("Player %", "The value of this player vs this statistic", colorPicker),
  "sep1": GenericTableOps.addColSeparator(),
  "pos_pg": GenericTableOps.addPctCol("Wt PG", tooltipWeightGenerator("Point Guard"), GenericTableOps.defaultColorPicker),
  "av_pos_pg": GenericTableOps.addPctCol("Av PG", tooltipAverageGenerator("Point Guard"), colorPicker),
  "contrib_pos_pg": GenericTableOps.addPctCol("+- PG%", tooltipContribGenerator("Point Guard"), CbbColors.varPicker(CbbColors.posColors)),
  "sep2": GenericTableOps.addColSeparator(),
  "pos_sg": GenericTableOps.addPctCol("Wt SG", tooltipWeightGenerator("Shooting Guard"), GenericTableOps.defaultColorPicker),
  "av_pos_sg": GenericTableOps.addPctCol("Av SG", tooltipAverageGenerator("Shooting Guard"), colorPicker),
  "contrib_pos_sg": GenericTableOps.addPctCol("+- SG%", tooltipContribGenerator("Shooting Guard"), CbbColors.varPicker(CbbColors.posColors)),
  "sep3": GenericTableOps.addColSeparator(),
  "pos_sf": GenericTableOps.addPctCol("Wt SF", tooltipWeightGenerator("Small Forward"), GenericTableOps.defaultColorPicker),
  "av_pos_sf": GenericTableOps.addPctCol("Av SF", tooltipAverageGenerator("Small Forward"), colorPicker),
  "contrib_pos_sf": GenericTableOps.addPctCol("+- SF%", tooltipContribGenerator("Small Forward"), CbbColors.varPicker(CbbColors.posColors)),
  "sep4": GenericTableOps.addColSeparator(),
  "pos_pf": GenericTableOps.addPctCol("Wt PF", tooltipWeightGenerator("Power Forward"), GenericTableOps.defaultColorPicker),
  "av_pos_pf": GenericTableOps.addPctCol("Av PF", tooltipAverageGenerator("Power Forward"), colorPicker),
  "contrib_pos_pf": GenericTableOps.addPctCol("+- PF%", tooltipContribGenerator("Power Forward"), CbbColors.varPicker(CbbColors.posColors)),
  "sep5": GenericTableOps.addColSeparator(),
  "pos_c": GenericTableOps.addPctCol("Wt C", tooltipWeightGenerator("Center"), GenericTableOps.defaultColorPicker),
  "av_pos_c": GenericTableOps.addPctCol("Av C", tooltipAverageGenerator("Center"), colorPicker),
  "contrib_pos_c": GenericTableOps.addPctCol("+- C%", tooltipContribGenerator("Center"), CbbColors.varPicker(CbbColors.posColors)),
};
*/

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

  const [targetAssistNetworks, sourceAssistNetworks] = [ "target", "source" ].map((loc) => {
    const targetNotSource = loc == "target";
    return _.fromPairs([ "3p", "mid", "rim" ].map((key) => {
      const allAssistNetwork = player[`off_ast_${key}_${loc}`]?.value || {};
      const statsPerPosFamily = PlayTypeUtils.simplifyAssistNetwork(
        allAssistNetwork,
        targetNotSource ? rosterStatsByCode : player,
        key, targetNotSource
      );
      return [ key, statsPerPosFamily ];
    }));
  });

  return <span>
      <span>
        <b>Half-Court Play Type Breakdown for [{player.key}]</b>
      </span>
      <br/>
      {PlayTypeUtils.buildPlayTypes(
          player, targetAssistNetworks, sourceAssistNetworks
        ).map(kv => {
          return <div key={kv[0]}>
            <b>{kv[0]}</b><br/>
            {JSON.stringify(kv[1], tidyNumbers)}
          </div>;
        })
      }
      <span>
        <b>Diags ... Half-Court Play Type Breakdown for [{player.key}]</b>
      </span>
      <br/>
      {[ "target", "source" ].flatMap((loc) => {
          const targetNotSource = loc == "target";
          return [ "3p", "mid", "rim", "" ].map((key) => {
            if (key == "") return <br key={key+loc}/>;
            const statsPerPosFamily = targetNotSource ? targetAssistNetworks[key] : sourceAssistNetworks[key];

            return <span key={key+loc}>
                <span>{key} {loc} ballhandler {JSON.stringify(
                  statsPerPosFamily.ballhandler, tidyNumbers
                )}</span>
                <br/>
                <span>{key} {loc} wing {JSON.stringify(
                  statsPerPosFamily.wing, tidyNumbers
                )}</span>
                <br/>
                <span>{key} {loc} big {JSON.stringify(
                  statsPerPosFamily.big, tidyNumbers
                )}</span>
                <br/>
              </span>;
          });
        })
      }
      <br/>
      <span>
        <b>Raw Assist Networks for [{player.key}]</b>
      </span>
      <br/>
      {[ "target", "source" ].flatMap((loc) => {
        return [ "3p", "mid", "rim", "" ].map((key) => {
          if (key == "") return <br key={key+loc}/>;
            return <span key={key+loc}>
                <span>{key} {loc} {JSON.stringify(
                  player[`off_ast_${key}_${loc}`]?.value || {}, null, 3
                )}</span>
                <br/>
              </span>;
          });
        })
      }
    </span>;
};
export default PlayerPlayTypeDiagView;
