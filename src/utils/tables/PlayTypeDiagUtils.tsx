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


const targetSource = [ "source", "target" ];
const shotTypes = [ "3p", "mid", "rim" ];
const shotNameMap = { "3p": "3P", "mid": "Mid", "rim": "Rim" } as Record<string, string>;
const shotMap = { "3p": "3p", "rim": "2prim", "mid": "2pmid" } as Record<string, string>;

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "../../components/GenericTable";

/** Encapsulates some of the logic used to build the diag visualiations in XxxPlayTypeDiags */
export class PlayTypeDiagUtils {

  // Couple of utils for decorating the background eFG
  private static buildInfoStat = (stat: any) =>
    <span style={CommonTableDefs.getTextShadow(stat, CbbColors.off_eFG)}>
      <i>{(100*(stat?.value || 0)).toFixed(1)}%</i>
    </span>;
  private static enrichExtraInfo = (stat: any) => {
    if (stat.extraInfo) {
      stat.extraInfo = <div>
        Example play types:<br/>
        {stat.extraInfo.map((ex: string, i: number) => <li key={`ex${i}`}>{ex}</li>)}
      </div>;
    }
    return stat;
  };
  static buildInfoRow = (statSet: any) => {
    return _.mapValues(statSet, (valObj, key) => { // Decorate eFG
      if (valObj) {
        return _.endsWith(key, "_efg") ? PlayTypeDiagUtils.buildInfoStat(valObj) : PlayTypeDiagUtils.enrichExtraInfo(valObj);
      } else return valObj;
    });
  }

  // Build raw assist table:

  static rawAssistTableFields = (hasPlayers: boolean, teamTotals: boolean) => {
    const rowMeans = hasPlayers ? "team-mate / positional role" : "positional role";
    const denomMeans = teamTotals ? "team scoring possessions" : "player scoring possessions + assists";
    return {
      "title": GenericTableOps.addTitle("", "", CommonTableDefs.singleLineRowSpanCalculator, "", GenericTableOps.htmlFormatter),
      ...(_.fromPairs(targetSource.flatMap((loc) => {
          const targetNotSource = loc == "target";
          return [
            [`sep${loc}`, GenericTableOps.addColSeparator(0.75) ],
          ].concat(
            shotTypes.flatMap((key) => {
              const descriptionAst = targetNotSource ?
                `% of total assists to the specified row (${rowMeans}) for this shot type` : `% of ${denomMeans} of this shot type assisted BY the specified row (${rowMeans})`;
              const descriptionEfg = `The season eFG% of this shot type / row (${rowMeans})`;
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
                `source_sf`, GenericTableOps.addPctCol(`SF`,
                  `% of ${denomMeans} ending in a trip to the FT line`, CbbColors.varPicker(CbbColors.p_ast_breakdown),
                )
              ],
              [`sep${loc}ast`, GenericTableOps.addColSeparator(0.25) ],
              [
                `target_ast`, GenericTableOps.addPctCol(`AST`,
                  `% of ${denomMeans} ending with an assist FOR the specified row (${rowMeans})`, CbbColors.varPicker(CbbColors.p_ast_breakdown),
                )
              ]
            ])
          );
        })))
    };
  };

};
