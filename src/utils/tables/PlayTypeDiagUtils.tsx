// React imports:
import React, { useState } from "react";

// Next imports:
import { NextPage } from "next";

import _ from "lodash";

// Bootstrap imports:
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

// Utils
import { SourceAssistInfo } from "../../utils/stats/PlayTypeUtils";
import { PositionUtils } from "../../utils/stats/PositionUtils";
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { CbbColors } from "../../utils/CbbColors";
import { Props as PlayTypeDiagProps } from "../../components/diags/TeamPlayTypeDiagRadar";
import TeamPlayTypeDiagRadar from "../../components/diags/TeamPlayTypeDiagRadar";

const targetSource = ["source", "target"];
const shotTypes = ["3p", "mid", "rim"];
const shotNameMap = { "3p": "3P", mid: "Mid", rim: "Rim" } as Record<
  string,
  string
>;
const shotMap = { "3p": "3p", rim: "2prim", mid: "2pmid" } as Record<
  string,
  string
>;

// Component imports
import GenericTable, {
  GenericTableOps,
  GenericTableColProps,
} from "../../components/GenericTable";
import {
  Statistic,
  IndivStatSet,
  TeamStatSet,
  RosterEntry,
} from "../StatModels";
import { DivisionStatsCache } from "./GradeTableUtils";
import { RosterTableUtils } from "./RosterTableUtils";
import { RosterStatsModel } from "../../components/RosterStatsTable";
import { TeamStatsModel } from "../../components/TeamStatsTable";

/** Encapsulates some of the logic used to build the diag visualiations in XxxPlayTypeDiags */
export class PlayTypeDiagUtils {
  // Couple of utils for decorating the background eFG
  private static buildInfoStat = (stat: Statistic) => (
    <span style={CommonTableDefs.getTextShadow(stat, CbbColors.off_eFG)}>
      <i>{(100 * (stat?.value || 0)).toFixed(1)}%</i>
    </span>
  );
  private static enrichExtraInfo = (stat: Statistic) => {
    if (stat.extraInfo) {
      stat.extraInfo = (
        <div>
          Example play types:
          <br />
          {(stat.extraInfo as string[]).map((ex: string, i: number) => (
            <li key={`ex${i}`}>{ex}</li>
          ))}
        </div>
      );
    }
    return stat;
  };
  static buildInfoRow = (
    statSet: SourceAssistInfo,
    maybeScoring?: IndivStatSet
  ) => {
    const enrichedMaybeScoring = _.thru(maybeScoring, (__) => {
      if (maybeScoring) {
        return _.mapKeys(maybeScoring, (valObj, key) => {
          const isNumericKey =
            !_.isNil(valObj.value) && !_.endsWith(key, "_to");
          if (isNumericKey) {
            //(remove - incorrectly formatted anyway - extra info)

            const possStat = (statSet as any)[key]?.value || 1;
            valObj.value = (0.01 * (valObj.value || 0)) / possStat;
            valObj.extraInfo = undefined;
          }
          return isNumericKey
            ? key.replace("_ast", "_ppp").replace("_sf", "_sf_ppp")
            : key;
        });
      } else {
        return {};
      }
    });

    return _.merge(
      _.mapValues(statSet, (valObj, key) => {
        // Decorate eFG
        if (valObj && key != "order") {
          return _.endsWith(key, "_efg")
            ? PlayTypeDiagUtils.buildInfoStat(valObj as Statistic)
            : PlayTypeDiagUtils.enrichExtraInfo(valObj as Statistic);
        } else return valObj;
      }),
      enrichedMaybeScoring
    );
  };

  // Build raw assist table:

  static rawAssistTableFields = (
    hasPlayers: boolean,
    teamTotals: boolean,
    playTypeMode: "scoring" | "usage",
    sourceOnlyMode: boolean = false
  ) => {
    const maybeScoring = playTypeMode == "scoring" ? "scoring" : "total";
    const rowMeans = hasPlayers
      ? "team-mate / positional role"
      : "positional role";
    const denomMeans = teamTotals
      ? `team ${maybeScoring} possessions`
      : `player ${maybeScoring} possessions + assists`;
    const descriptionEfg = `The season eFG% of this shot type / row (${rowMeans})`;
    const descriptionPpp = `The season pts-per-play (not including rebounds or turnovers) of this shot type / row (${rowMeans})`;
    return {
      title: GenericTableOps.addTitle(
        "",
        "",
        CommonTableDefs.singleLineRowSpanCalculator,
        "",
        GenericTableOps.htmlFormatter
      ),
      ..._.fromPairs(
        targetSource
          .filter((loc) => loc == "source" || !sourceOnlyMode)
          .flatMap((loc) => {
            const targetNotSource = loc == "target";
            const descriptionAst = targetNotSource
              ? `% of total assists to the specified row (${rowMeans}) for this shot type`
              : `% of ${denomMeans} of this shot type assisted BY the specified row (${rowMeans})`;

            return [
              [`sep${loc}`, GenericTableOps.addColSeparator(0.75)],
            ].concat(
              shotTypes
                .flatMap((key) => {
                  return [
                    [
                      `${loc}_${key}_ast`,
                      GenericTableOps.addPctCol(
                        `${shotNameMap[key]!}${
                          targetNotSource ? " AST%" : ""
                        } `,
                        descriptionAst,
                        CbbColors.varPicker(CbbColors.p_ast_breakdown)
                      ),
                    ],
                  ]
                    .concat(
                      targetNotSource
                        ? [
                            [
                              `${loc}_${key}_efg`,
                              GenericTableOps.addDataCol(
                                `eFG`,
                                descriptionEfg,
                                CbbColors.offOnlyPicker(
                                  CbbColors.alwaysWhite,
                                  CbbColors.alwaysWhite
                                ),
                                GenericTableOps.percentOrHtmlFormatter
                              ),
                            ],
                            [
                              `sep${loc}${key}`,
                              GenericTableOps.addColSeparator(0.125),
                            ],
                          ]
                        : []
                    )
                    .concat(
                      targetNotSource || !sourceOnlyMode
                        ? []
                        : [
                            [
                              `${loc}_${key}_ppp`,
                              GenericTableOps.addDataCol(
                                `PPP`,
                                descriptionPpp,
                                CbbColors.offOnlyPicker(
                                  CbbColors.alwaysWhite,
                                  CbbColors.alwaysWhite
                                ),
                                GenericTableOps.percentOrHtmlFormatter
                              ),
                            ],
                            [
                              `sep${loc}ppp${key}`,
                              GenericTableOps.addColSeparator(0.125),
                            ],
                          ]
                    );
                })
                .concat(
                  targetNotSource
                    ? []
                    : [
                        [
                          `source_sf`,
                          GenericTableOps.addPctCol(
                            `SF`,
                            `% of ${denomMeans} ending in a trip to the FT line`,
                            CbbColors.varPicker(CbbColors.p_ast_breakdown)
                          ),
                        ],
                        [`sep${loc}ast`, GenericTableOps.addColSeparator(0.25)],
                      ]
                )
                .concat(
                  targetNotSource || !sourceOnlyMode
                    ? []
                    : [
                        [
                          `${loc}_sf_ppp`,
                          GenericTableOps.addDataCol(
                            `PPP`,
                            descriptionPpp,
                            CbbColors.offOnlyPicker(
                              CbbColors.alwaysWhite,
                              CbbColors.alwaysWhite
                            ),
                            GenericTableOps.percentOrHtmlFormatter
                          ),
                        ],
                        [
                          `sep${loc}ppp_sf`,
                          GenericTableOps.addColSeparator(0.125),
                        ],
                      ]
                )
                .concat([
                  [
                    `target_ast`,
                    GenericTableOps.addPctCol(
                      `AST`,
                      `% of ${denomMeans} ending with an assist FOR the specified row (${rowMeans})`,
                      CbbColors.varPicker(CbbColors.p_ast_breakdown)
                    ),
                  ],
                ])
                .concat(
                  sourceOnlyMode
                    ? [
                        [
                          `source_to`,
                          GenericTableOps.addPctCol(
                            `TO%`,
                            `% of possessions from this position group ending in a TO`,
                            CbbColors.varPicker(CbbColors.p_ast_breakdown)
                          ),
                        ],
                      ]
                    : []
                )
            );
          })
      ),
    };
  };

  /** Encapsulates the logic to build a play style table from either single game or season  */
  static buildTeamStyleBreakdown = (
    title: string,
    players: RosterStatsModel,
    teamStats: TeamStatsModel,
    grades: DivisionStatsCache,
    showHelp: boolean
  ) => {
    const rosterInfo = teamStats.global.roster || {};

    /** Largest sample of player stats, by player key - use for ORtg calcs */
    const globalRosterStatsByCode = RosterTableUtils.buildRosterTableByCode(
      players.global,
      rosterInfo,
      true //(injects positional info into the player stats, needed for play style analysis below)
    );

    //TODO: this doesn't work currently, I think "players.global" does not contain the right info maybe?
    const options = [
      {
        title: `${title} // Season Breakdown`,
        players: players.global,
        rosterStatsByCode: globalRosterStatsByCode,
        teamStats: teamStats.global,
        showGrades: "rank:Combo",
        showHelp,
        quickSwitchOverride: undefined,
      },
    ];

    return (
      <div>
        <TeamPlayTypeDiagRadar
          title={`${title} // Game Breakdown`}
          players={players.baseline}
          rosterStatsByCode={globalRosterStatsByCode}
          teamStats={teamStats.baseline}
          showGrades={"rank:Combo"}
          grades={grades}
          showHelp={showHelp}
          quickSwitchOptions={[]}
          usePossCount={true}
          quickSwitchOverride={undefined}
        />
      </div>
    );
  };
}
