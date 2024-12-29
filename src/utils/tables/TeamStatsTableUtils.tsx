import React from "react";
import _ from "lodash";

import GameInfoDiagView from "../../components/diags/GameInfoDiagView";
import LuckAdjDiagView from "../../components/diags/LuckAdjDiagView";
import TeamExtraStatsInfoView from "../../components/diags/TeamExtraStatsInfoView";
import TeamPlayTypeDiagView from "../../components/diags/TeamPlayTypeDiagView";
import TeamRosterDiagView from "../../components/diags/TeamRosterDiagView";
import ShotChartDiagView, {
  UserChartOpts,
} from "../../components/diags/ShotChartDiagView";
import {
  GenericTableOps,
  GenericTableRow,
} from "../../components/GenericTable";
import { LineupStatsModel } from "../../components/LineupStatsTable";
import { RosterStatsModel } from "../../components/RosterStatsTable";
import { TeamStatsModel } from "../../components/TeamStatsTable";
import { GameFilterParams, LuckParams } from "../FilterModels";
import { efficiencyAverages } from "../public-data/efficiencyAverages";
import {
  GameInfoStatSet,
  IndivPosInfo,
  IndivStatSet,
  LineupStatSet,
  OnOffBaselineEnum,
  OnOffBaselineOtherEnum,
  PlayerId,
  ShotStats,
  ShotStatsModel,
  StatModels,
  TeamStatSet,
} from "../StatModels";
import { LineupUtils } from "../stats/LineupUtils";
import {
  DefLuckAdjustmentDiags,
  LuckUtils,
  OffLuckAdjustmentDiags,
} from "../stats/LuckUtils";
import { OverrideUtils } from "../stats/OverrideUtils";
import { CommonTableDefs } from "./CommonTableDefs";
import { GradeTableUtils, DivisionStatsCache } from "./GradeTableUtils";
import { LineupTableUtils } from "./LineupTableUtils";
import { RosterTableUtils } from "./RosterTableUtils";
import { TableDisplayUtils } from "./TableDisplayUtils";

// Data model

export type TeamStatsOnOffBase = {
  baseline?: TeamStatsBreakdown;
  on?: TeamStatsBreakdown;
  off?: TeamStatsBreakdown;
  other: (TeamStatsBreakdown | undefined)[];
  diffs: GenericTableRow[];
};

export type TeamStatsBreakdown = {
  teamStatsRows: GenericTableRow[];
  teamRosterRows: GenericTableRow[];
  teamDiagRows: GenericTableRow[];
};

export type TeamStatsReadOnlyState = {
  showPlayTypes: boolean;
  showRoster: boolean;
  adjustForLuck: boolean;
  showDiffs: boolean;
  showGameInfo: boolean;
  showShotCharts: boolean;
  shotChartConfig: UserChartOpts | undefined;
  showExtraInfo: boolean;
  showGrades: string;
  showLuckAdjDiags: boolean;
  showHelp: boolean;
};

export type TeamStatsChangeState = {
  setShowGrades: (showGradesCfg: string) => void;
  setShotChartConfig: (opts: UserChartOpts) => void;
};

/** Get the right roster stats for on/off/etc  */
const getRosterStats = (
  key: OnOffBaselineOtherEnum,
  rosterModel: RosterStatsModel,
  otherIndex?: number
): Array<IndivStatSet> => {
  if (key == "other") {
    //TODO: once we have "other" keys plumbed in, handled this
    return [];
  } else {
    return rosterModel[key] || [];
  }
};

/** Get the right roster stats for on/off/etc  */
const getTeamStats = (
  key: OnOffBaselineOtherEnum,
  teamModel: TeamStatsModel,
  otherIndex?: number
): TeamStatSet => {
  if (key == "other") {
    return teamModel.other?.[otherIndex || 0] || StatModels.emptyTeam();
  } else {
    return teamModel[key] || StatModels.emptyTeam();
  }
};

/** Get the right roster stats for on/off/etc  */
const getShotStats = (
  key: OnOffBaselineOtherEnum,
  shotModel: ShotStatsModel,
  otherIndex?: number
): {
  off: ShotStats;
  def: ShotStats;
} => {
  if (key == "other") {
    //TODO: once we have "other" keys plumbed in, handled this
    return { off: {}, def: {} };
  } else {
    return shotModel[key] || { off: {}, def: {} };
  }
};

// Business logic:

/** Encapsulates building the elements that make up a TeamStatsTable */
export class TeamStatsTableUtils {
  static buildRows(
    // From page load
    gameFilterParams: GameFilterParams,
    teamStats: TeamStatsModel,
    rosterStats: RosterStatsModel,
    shotStats: ShotStatsModel,
    lineupStats: LineupStatsModel[],

    // Page control
    readOnlyState: TeamStatsReadOnlyState,
    persistNewState: TeamStatsChangeState,

    // Runtime page params
    luckConfig: LuckParams,
    divisionStatsCache: DivisionStatsCache
  ): TeamStatsOnOffBase {
    const {
      showPlayTypes,
      showRoster,
      adjustForLuck,
      showDiffs,
      showGameInfo,
      showExtraInfo,
      showGrades,
      showShotCharts,
      shotChartConfig,
      showLuckAdjDiags,
      showHelp,
    } = readOnlyState;

    // Some handy strings
    const offPrefixFn = (key: string) => "off_" + key;
    const offCellMetaFn = (key: string, val: any) => "off";
    const defPrefixFn = (key: string) => "def_" + key;
    const defCellMetaFn = (key: string, val: any) => "def";

    const maybeOnStr = teamStats.onOffMode ? "On ('A')" : "'A'";
    const maybeOn = TableDisplayUtils.addQueryInfo(
      maybeOnStr,
      gameFilterParams,
      "on"
    );
    const maybeOffStr = teamStats.onOffMode ? "Off ('B')" : "'B'";
    const maybeOff = TableDisplayUtils.addQueryInfo(
      maybeOffStr,
      gameFilterParams,
      "off"
    );
    const maybeBase = TableDisplayUtils.addQueryInfo(
      "Baseline",
      gameFilterParams,
      "baseline"
    );

    const genderYearLookup = `${gameFilterParams.gender}_${gameFilterParams.year}`;
    const teamSeasonLookup = `${gameFilterParams.gender}_${gameFilterParams.team}_${gameFilterParams.year}`;
    const avgEfficiency =
      efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

    /** Largest sample of player stats, by player key - use for ORtg calcs */
    const globalRosterInfo = teamStats.global?.roster;
    const globalRosterStatsByCode = RosterTableUtils.buildRosterTableByCode(
      rosterStats.global || [],
      globalRosterInfo,
      showPlayTypes,
      teamSeasonLookup
    ); //TODO: which set do I actually want to use for positional calcs here?

    /** List all the normal query keys */
    const baselineOnOffKeys: OnOffBaselineEnum[] = ["baseline", "on", "off"];

    /** List all the query keys */
    const getModelKeys = (): [OnOffBaselineOtherEnum, number][] => {
      return (
        [
          ["baseline", 0],
          ["on", 0],
          ["off", 0],
        ] as [OnOffBaselineOtherEnum, number][]
      ).concat((teamStats.other || []).map((__, ii) => ["other", ii]));
    };

    /** Turn one of the model keys into associative index */
    const modelKey = (k: OnOffBaselineOtherEnum, otherQueryIndex: number) => {
      return k == "other" ? `other_${otherQueryIndex}` : k;
    };

    //TODO: need to do a better job of deciding which one to use (or possibly a blend?)
    const positionFromPlayerIdGlobal = showRoster
      ? LineupTableUtils.buildPositionPlayerMap(
          rosterStats.global,
          teamSeasonLookup
        )
      : {};

    const positionFromPlayerId = _.chain(getModelKeys())
      .map(([k, otherQueryIndex]) => {
        const retVal: [string, Record<string, IndivPosInfo>] = [
          modelKey(k, otherQueryIndex),
          showRoster && getRosterStats(k, rosterStats, otherQueryIndex).length
            ? LineupTableUtils.buildPositionPlayerMap(
                getRosterStats(k, rosterStats, otherQueryIndex),
                teamSeasonLookup,
                globalRosterInfo
              )
            : {},
        ];
        return retVal;
      })
      .fromPairs()
      .value();

    // If manual overrides specified we have some more work to do:
    const manualOverridesAsMap = _.isNil(gameFilterParams.manual)
      ? undefined
      : OverrideUtils.buildOverrideAsMap(gameFilterParams.manual);

    // If building roster info then enrich player stats:
    const playerInfoByIdBy0AB =
      showRoster || manualOverridesAsMap
        ? getModelKeys().map(([queryKey, otherQueryIndex]) => {
            const playerStatsFor0AB = getRosterStats(
              queryKey,
              rosterStats,
              otherQueryIndex
            );
            const teamStatsFor0AB = getTeamStats(
              queryKey,
              teamStats,
              otherQueryIndex
            );
            if (teamStatsFor0AB.doc_count) {
              /** Need player info for tooltip view/lineup decoration */
              const playerInfo = LineupTableUtils.buildBaselinePlayerInfo(
                playerStatsFor0AB,
                globalRosterStatsByCode,
                teamStatsFor0AB,
                avgEfficiency,
                adjustForLuck,
                luckConfig.base,
                manualOverridesAsMap || {}
              );
              return playerInfo;
            } else {
              return undefined;
            }
          })
        : [];

    // Luck calculations and manual overrides

    // The luck baseline can either be the user-selecteed baseline or the entire season
    const baseLuckBuilder: () => [
      TeamStatSet,
      Record<PlayerId, IndivStatSet>
    ] = () => {
      if (adjustForLuck) {
        switch (luckConfig.base) {
          case "baseline":
            return [
              teamStats.baseline,
              _.fromPairs(
                (rosterStats.baseline || []).map((p: any) => [p.key, p])
              ),
            ];
          default:
            //("season")
            return [
              teamStats.global,
              _.fromPairs(
                (rosterStats.global || []).map((p: any) => [p.key, p])
              ),
            ];
        }
      } else return [StatModels.emptyTeam(), {}]; //(not used)
    };
    const [baseOrSeasonTeamStats, baseOrSeason3PMap] = baseLuckBuilder();

    // Create luck adjustments, inject luck into mutable stat sets, and calculate efficiency margins
    const luckAdjustment = _.fromPairs(
      getModelKeys().map(([k, otherQueryIndex], ii) => {
        if (getTeamStats(k, teamStats, otherQueryIndex).doc_count) {
          const playerStats = playerInfoByIdBy0AB[ii] || {};

          // Before applying luck, reset any changes due to manual player overrides or earlier iterations of luck
          OverrideUtils.clearTeamManualOrLuckOverrides(
            getTeamStats(k, teamStats, otherQueryIndex)
          );

          if (adjustForLuck && k != "other") {
            //(calculate expected numbers which then get incorporated into luck calcs)
            OverrideUtils.applyPlayerOverridesToTeam(
              k,
              gameFilterParams.manual || [],
              playerStats,
              getTeamStats(k, teamStats, otherQueryIndex),
              avgEfficiency,
              adjustForLuck
            );
          }

          const luckAdj =
            adjustForLuck && k != "other"
              ? ([
                  LuckUtils.calcOffTeamLuckAdj(
                    getTeamStats(k, teamStats, otherQueryIndex),
                    getRosterStats(k, rosterStats, otherQueryIndex),
                    baseOrSeasonTeamStats,
                    baseOrSeason3PMap,
                    avgEfficiency,
                    undefined,
                    OverrideUtils.filterManualOverrides(
                      k,
                      gameFilterParams.manual
                    )
                  ),
                  LuckUtils.calcDefTeamLuckAdj(
                    getTeamStats(k, teamStats, otherQueryIndex),
                    baseOrSeasonTeamStats,
                    avgEfficiency
                  ),
                ] as [OffLuckAdjustmentDiags, DefLuckAdjustmentDiags])
              : undefined;

          // Extra mutable set, build net margin column:
          LineupUtils.buildEfficiencyMargins(
            getTeamStats(k, teamStats, otherQueryIndex)
          );

          // Mutate stats object to inject luck
          LuckUtils.injectLuck(
            getTeamStats(k, teamStats, otherQueryIndex),
            luckAdj?.[0],
            luckAdj?.[1]
          );

          if (!adjustForLuck && k != "other") {
            //(else called above and incorporated into the luck adjustments)
            OverrideUtils.applyPlayerOverridesToTeam(
              k,
              gameFilterParams.manual || [],
              playerStats,
              getTeamStats(k, teamStats, otherQueryIndex),
              avgEfficiency,
              adjustForLuck
            );
          }
          return [modelKey(k, otherQueryIndex), luckAdj];
        } else {
          //(no docs)
          return [modelKey(k, otherQueryIndex), undefined];
        }
      })
    ) as {
      [P in OnOffBaselineOtherEnum]:
        | [OffLuckAdjustmentDiags, DefLuckAdjustmentDiags]
        | undefined;
    };

    //(end luck/manual overrides calcs)

    // Calc diffs if required ... needs to be before injectPlayTypeInfo but after luck injection!
    const [aMinusB, aMinusBase, bMinusBase] = showDiffs
      ? (() => {
          const aMinusB =
            teamStats.on?.doc_count && teamStats.off?.doc_count
              ? LineupUtils.getStatsDiff(
                  teamStats.on,
                  teamStats.off,
                  "A - B diffs"
                )
              : undefined;
          const aMinusBase =
            teamStats.on?.doc_count && teamStats.baseline?.doc_count
              ? LineupUtils.getStatsDiff(
                  teamStats.on,
                  teamStats.baseline,
                  "A - Baseline diffs"
                )
              : undefined;
          const bMinusBase =
            teamStats.off?.doc_count && teamStats.baseline?.doc_count
              ? LineupUtils.getStatsDiff(
                  teamStats.off,
                  teamStats.baseline,
                  "B - Baseline diffs"
                )
              : undefined;

          [aMinusB, aMinusBase, bMinusBase].forEach((statSet) => {
            if (statSet)
              TableDisplayUtils.injectPlayTypeInfo(
                statSet,
                false,
                false,
                teamSeasonLookup
              );
          });
          return [aMinusB, aMinusBase, bMinusBase];
        })()
      : ([undefined, undefined, undefined] as [any, any, any]);

    getModelKeys().forEach(([k, otherQueryIndex]) => {
      TableDisplayUtils.injectPlayTypeInfo(
        getTeamStats(k, teamStats, otherQueryIndex),
        false,
        false,
        teamSeasonLookup
      );
    });

    // Show game info logic:
    const orderedMutableOppoList: Record<string, GameInfoStatSet> = {};
    const totalLineupsByQueryKey = _.chain(getModelKeys())
      .map(([k, otherQueryIndex], ii) => {
        if (showGameInfo) {
          const lineups = lineupStats?.[ii]?.lineups || [];
          const totalLineup = _.assign(
            LineupUtils.calculateAggregatedLineupStats(lineups),
            {
              key: LineupTableUtils.totalLineupId,
              doc_count: lineups.length, //(for doc_count >0 checks, calculateAggregatedLineupStats doesn't inject)
            }
          );
          //(for reasons I don't understand the logic is different to the LineupStatsTable ...
          // the game_info isn't sorted but "orderedMutableOppoList" shouldn't be set
          //TODO: at some point i need to refactor/doc this game info code, but for now this works
          totalLineup.game_info = _.sortBy(
            (totalLineup.game_info as Array<GameInfoStatSet>) || [],
            (g) => g.date
          );
          orderedMutableOppoList[k] = {};
          return [modelKey(k, otherQueryIndex), totalLineup];
        } else {
          return [modelKey(k, otherQueryIndex), {}];
        }
      })
      .fromPairs()
      .value() as {
      [P in OnOffBaselineOtherEnum]: LineupStatSet;
    };
    //(end show game info logic)

    // Last stage before building the table: inject titles into the stats:
    const teamStatsKeys = _.zip(baselineOnOffKeys, [
      maybeBase,
      maybeOn,
      maybeOff,
    ]);
    const teamStatsByQuery = _.chain(teamStatsKeys)
      .map((keyDesc) => {
        const queryKey = keyDesc[0]!;
        const desc = keyDesc[1];
        const retVal: [OnOffBaselineEnum, any] = [
          queryKey,
          {
            off_title: <b>{desc} Offense</b>,
            def_title: <b>{desc} Defense</b>,
            ...teamStats[queryKey],
          },
        ];
        return retVal;
      })
      .fromPairs()
      .value() as {
      [P in OnOffBaselineOtherEnum]: any;
    };

    /** If true, then repeat the table headers */
    const showingSomeDiags =
      showExtraInfo ||
      showGrades ||
      showRoster ||
      showGameInfo ||
      showPlayTypes ||
      showLuckAdjDiags;
    const showingOn = teamStats.on?.doc_count ? true : false;
    const showingOnOrOff =
      showingOn || (teamStats.off?.doc_count ? true : false);

    const shotChartQuickSwitchOptions = [
      {
        title: "On ('A')",
        off: shotStats.on.off,
        def: shotStats.on.def,
        gender: gameFilterParams.gender as "Men" | "Women",
      },
      {
        title: "Off ('B')",
        off: shotStats.off.off,
        def: shotStats.off.def,
        gender: gameFilterParams.gender as "Men" | "Women",
      },
      {
        title: "Baseline",
        off: shotStats.baseline.off,
        def: shotStats.baseline.def,
        gender: gameFilterParams.gender as "Men" | "Women",
      },
    ];

    const teamPlayTypeQuickSwitchOptions = [
      {
        title: "On ('A')",
        players: rosterStats["on"] || [],
        rosterStatsByCode: globalRosterStatsByCode,
        teamStats: teamStatsByQuery["on"],
        showGrades: showGrades,
        avgEfficiency,
        showHelp,
      },
      {
        title: "Off ('B')",
        players: rosterStats["off"] || [],
        rosterStatsByCode: globalRosterStatsByCode,
        teamStats: teamStatsByQuery["off"],
        showGrades: showGrades,
        avgEfficiency,
        showHelp,
      },
      {
        title: "Baseline",
        players: rosterStats["baseline"] || [],
        rosterStatsByCode: globalRosterStatsByCode,
        teamStats: teamStatsByQuery["baseline"],
        showGrades: showGrades,
        avgEfficiency,
        showHelp,
      },
    ].filter((opt) => (opt.teamStats.doc_count || 0) > 0);

    /** Builds the basic info and all the optional diags/enrichment for a single lineup set (on/off/baseline) */
    const buildTableEntries = (
      queryKey: OnOffBaselineOtherEnum,
      displayKey: string,
      otherQueryIndex?: number
    ): TeamStatsBreakdown | undefined => {
      //TODO: for lineups, handle "other query" lineups
      const queryIndex = queryKey == "baseline" ? 0 : queryKey == "on" ? 1 : 2;
      const hasData =
        (getTeamStats(queryKey, teamStats, otherQueryIndex).doc_count || 0) > 0;

      const showExtraHeader =
        queryKey == "off"
          ? showingSomeDiags && showingOn
          : queryKey == "baseline"
          ? showingSomeDiags && showingOnOrOff
          : false;

      if (hasData) {
        const teamStatsRows = _.flatten([
          showExtraHeader
            ? [
                GenericTableOps.buildHeaderRepeatRow(
                  CommonTableDefs.repeatingOnOffHeaderFields,
                  "small"
                ),
              ]
            : [],
          [
            GenericTableOps.buildDataRow(
              teamStatsByQuery[queryKey],
              offPrefixFn,
              offCellMetaFn
            ),
          ],
          [
            GenericTableOps.buildDataRow(
              teamStatsByQuery[queryKey],
              defPrefixFn,
              defCellMetaFn
            ),
          ],
          showGrades != ""
            ? GradeTableUtils.buildTeamGradeTableRows({
                selectionType: queryKey,
                config: showGrades,
                setConfig: (newConfig: string) => {
                  persistNewState.setShowGrades(newConfig);
                },
                teamStats: {
                  comboTier: divisionStatsCache.Combo,
                  highTier: divisionStatsCache.High,
                  mediumTier: divisionStatsCache.Medium,
                  lowTier: divisionStatsCache.Low,
                },
                team: getTeamStats(queryKey, teamStats, otherQueryIndex),
              })
            : [],
          showShotCharts
            ? [
                GenericTableOps.buildTextRow(
                  <ShotChartDiagView
                    title={displayKey}
                    off={getShotStats(queryKey, shotStats).off}
                    def={getShotStats(queryKey, shotStats).def}
                    gender={gameFilterParams.gender as "Men" | "Women"}
                    quickSwitchOptions={shotChartQuickSwitchOptions.filter(
                      (opt) => opt.title != displayKey
                    )}
                    chartOpts={shotChartConfig}
                    onChangeChartOpts={(newOpts) => {
                      persistNewState.setShotChartConfig(newOpts);
                    }}
                  />,
                  "small"
                ),
              ]
            : [],
          showPlayTypes
            ? [
                GenericTableOps.buildTextRow(
                  <TeamPlayTypeDiagView
                    title={displayKey}
                    players={getRosterStats(queryKey, rosterStats)}
                    rosterStatsByCode={globalRosterStatsByCode}
                    teamStats={teamStatsByQuery[queryKey]}
                    avgEfficiency={avgEfficiency}
                    quickSwitchOptions={teamPlayTypeQuickSwitchOptions.filter(
                      (opt) => opt.title != displayKey
                    )}
                    showGrades={showGrades}
                    grades={divisionStatsCache}
                    showHelp={showHelp}
                  />,
                  "small"
                ),
              ]
            : [],
          showExtraInfo
            ? [
                GenericTableOps.buildTextRow(
                  <span>
                    <TeamExtraStatsInfoView
                      name={displayKey}
                      teamStatSet={getTeamStats(
                        queryKey,
                        teamStats,
                        otherQueryIndex
                      )}
                      showGrades={showGrades}
                      grades={
                        showGrades
                          ? {
                              comboTier: divisionStatsCache.Combo,
                              highTier: divisionStatsCache.High,
                              mediumTier: divisionStatsCache.Medium,
                              lowTier: divisionStatsCache.Low,
                            }
                          : undefined
                      }
                    />
                  </span>,
                  "small pt-2"
                ),
              ]
            : [],
        ]);

        const teamRosterRows = _.flatten([
          showRoster
            ? [
                GenericTableOps.buildTextRow(
                  <span>
                    <TeamRosterDiagView
                      positionInfoGlobal={LineupTableUtils.getPositionalInfo(
                        lineupStats[queryIndex]?.lineups || [],
                        positionFromPlayerIdGlobal,
                        teamSeasonLookup
                      )}
                      positionInfoSample={
                        getTeamStats(queryKey, teamStats, otherQueryIndex)
                          .doc_count < teamStats.global.doc_count
                          ? LineupTableUtils.getPositionalInfo(
                              lineupStats[queryIndex]?.lineups || [],
                              positionFromPlayerId[queryKey],
                              teamSeasonLookup
                            )
                          : undefined
                      }
                      rosterStatsByPlayerId={
                        playerInfoByIdBy0AB[queryIndex] || {}
                      }
                      positionFromPlayerId={positionFromPlayerIdGlobal}
                      teamSeasonLookup={teamSeasonLookup}
                      showHelp={showHelp}
                    />
                  </span>,
                  "small pt-2"
                ),
              ]
            : [],
        ]);

        const teamDiagRows = _.flatten([
          showGameInfo
            ? [
                GenericTableOps.buildTextRow(
                  <GameInfoDiagView
                    oppoList={
                      LineupUtils.isGameInfoStatSet(
                        totalLineupsByQueryKey[queryKey].game_info
                      )
                        ? LineupUtils.getGameInfo(
                            totalLineupsByQueryKey[queryKey].game_info || {}
                          )
                        : (totalLineupsByQueryKey[queryKey]
                            .game_info as GameInfoStatSet[])
                    }
                    orderedOppoList={_.clone(orderedMutableOppoList[queryKey])}
                    params={{}}
                    maxOffPoss={-1}
                  />,
                  "small pt-2"
                ),
              ]
            : [],
          showLuckAdjDiags && luckAdjustment[queryKey]
            ? [
                GenericTableOps.buildTextRow(
                  <LuckAdjDiagView
                    name={displayKey}
                    offLuck={luckAdjustment[queryKey]![0]}
                    defLuck={luckAdjustment[queryKey]![1]}
                    baseline={luckConfig.base}
                    showHelp={showHelp}
                  />,
                  "small pt-2"
                ),
              ]
            : [],
        ]);

        return {
          teamStatsRows,
          teamRosterRows,
          teamDiagRows,
        };
      } else {
        return undefined;
      }
    };

    return {
      baseline: buildTableEntries("baseline", "Baseline"),
      on: buildTableEntries("on", "On ('A')"),
      off: buildTableEntries("off", "Off ('B')"),
      other: (teamStats.other || []).map((__, queryIndex) => {
        return buildTableEntries(
          "other",
          `'${String.fromCharCode(67 + queryIndex)}'`,
          queryIndex
        );
      }),
      diffs: _.flatten([
        //(note diffs not supported when showing multiple queries)
        aMinusB
          ? _.flatten([
              [
                GenericTableOps.buildDataRow(
                  aMinusB,
                  offPrefixFn,
                  offCellMetaFn,
                  CommonTableDefs.onOffReportReplacement
                ),
              ],
              [
                GenericTableOps.buildDataRow(
                  aMinusB,
                  defPrefixFn,
                  defCellMetaFn,
                  CommonTableDefs.onOffReportReplacement
                ),
              ],
              [GenericTableOps.buildRowSeparator()],
            ])
          : [],
        aMinusBase
          ? _.flatten([
              [
                GenericTableOps.buildDataRow(
                  aMinusBase,
                  offPrefixFn,
                  offCellMetaFn,
                  CommonTableDefs.onOffReportReplacement
                ),
              ],
              [
                GenericTableOps.buildDataRow(
                  aMinusBase,
                  defPrefixFn,
                  defCellMetaFn,
                  CommonTableDefs.onOffReportReplacement
                ),
              ],
              [GenericTableOps.buildRowSeparator()],
            ])
          : [],
        bMinusBase
          ? _.flatten([
              [
                GenericTableOps.buildDataRow(
                  bMinusBase,
                  offPrefixFn,
                  offCellMetaFn,
                  CommonTableDefs.onOffReportReplacement
                ),
              ],
              [
                GenericTableOps.buildDataRow(
                  bMinusBase,
                  defPrefixFn,
                  defCellMetaFn,
                  CommonTableDefs.onOffReportReplacement
                ),
              ],
              [GenericTableOps.buildRowSeparator()],
            ])
          : [],
      ]),
    };
  }
}
