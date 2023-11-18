// React imports:
import _ from "lodash";
import React, { useState, useEffect } from "react";
import { CbbColors } from "../utils/CbbColors";

// Bootstrap imports:
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import {
  getCommonFilterParams,
  MatchupFilterParams,
  ParamDefaults,
} from "../utils/FilterModels";
import { efficiencyAverages } from "../utils/public-data/efficiencyAverages";
import {
  LineupStintInfo,
  LineupStintTeamShot,
  LineupStintTeamStat,
  LineupStintTeamStats,
  PlayerCode,
} from "../utils/StatModels";
import GenericTable, {
  GenericTableColProps,
  GenericTableOps,
  GenericTableRow,
} from "./GenericTable";
import { LineupStatsModel } from "./LineupStatsTable";
import { RosterStatsModel } from "./RosterStatsTable";
import { TeamStatsModel } from "./TeamStatsTable";
import {
  GameAnalysisUtils,
  GameStatsCache,
} from "../utils/tables/GameAnalysisUtils";
import ToggleButtonGroup from "./shared/ToggleButtonGroup";

type Props = {
  startingState: MatchupFilterParams;
  opponent: string;
  dataEvent: {
    lineupStatsA: LineupStatsModel;
    teamStatsA: TeamStatsModel;
    rosterStatsA: RosterStatsModel;
    lineupStatsB: LineupStatsModel;
    teamStatsB: TeamStatsModel;
    rosterStatsB: RosterStatsModel;
    lineupStintsA: LineupStintInfo[];
    lineupStintsB: LineupStintInfo[];
  };
  onChangeState: (newParams: MatchupFilterParams) => void;
};

type StintClump = {
  stints: LineupStintInfo[];
};

const LineupStintsChart: React.FunctionComponent<Props> = ({
  startingState,
  opponent,
  dataEvent,
  onChangeState,
}) => {
  const {
    lineupStatsA,
    teamStatsA,
    rosterStatsA,
    lineupStatsB,
    teamStatsB,
    rosterStatsB,
    lineupStintsA,
    lineupStintsB,
  } = dataEvent;

  // Model

  const commonParams = getCommonFilterParams(startingState);
  const genderYearLookup = `${commonParams.gender}_${commonParams.year}`;
  const avgEfficiency =
    efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

  // Luck:
  const [adjustForLuck, setAdjustForLuck] = useState(
    _.isNil(startingState.onOffLuck)
      ? ParamDefaults.defaultOnOffLuckAdjust
      : startingState.onOffLuck
  );
  const [luckConfig, setLuckConfig] = useState(
    _.isNil(startingState.luck)
      ? ParamDefaults.defaultLuckConfig
      : startingState.luck
  );

  // Highlight lineup in hovered over stint:

  const [activeLineup, setActiveLineup] = useState<Set<string> | undefined>(
    undefined
  );

  const [showUsage, setShowUsage] = useState<boolean>(
    _.isNil(startingState.showUsage)
      ? ParamDefaults.defaultMatchupAnalysisShowUsage
      : startingState.showUsage
  );
  const [showPpp, setShowPpp] = useState<boolean>(
    _.isNil(startingState.showPpp)
      ? ParamDefaults.defaultMatchupAnalysisShowPpp
      : startingState.showPpp
  );

  // Integration with main page

  useEffect(() => {
    onChangeState({
      ...startingState,
      showUsage,
      showPpp,
    });
  }, [showUsage, showPpp]);

  // RAPM building

  const [cachedStats, setCachedStats] = useState<{
    aStats?: GameStatsCache;
    bStats?: GameStatsCache;
  }>({});
  useEffect(() => {
    setCachedStats({});
  }, [dataEvent, adjustForLuck]);
  useEffect(() => {
    if (_.isEmpty(cachedStats) && !_.isEmpty(lineupStatsA.lineups)) {
      const aStats = GameAnalysisUtils.buildGameRapmStats(
        commonParams.team!,
        commonParams,
        lineupStatsA,
        teamStatsA,
        rosterStatsA,
        adjustForLuck,
        luckConfig,
        avgEfficiency
      );

      const bStats = GameAnalysisUtils.buildGameRapmStats(
        opponent,
        commonParams,
        lineupStatsB,
        teamStatsB,
        rosterStatsB,
        adjustForLuck,
        luckConfig,
        avgEfficiency
      );
      setCachedStats({
        aStats,
        bStats,
      });
    }
  }, [cachedStats]);

  // Lineup building model

  const toStintsPerPlayer = (
    stints: LineupStintInfo[]
  ): Record<PlayerCode, LineupStintInfo[]> => {
    return _.chain(stints)
      .flatMap((l) => {
        return l.players.map(
          (p) => [p.code, l] as [PlayerCode, LineupStintInfo]
        );
      })
      .groupBy((idStint: [PlayerCode, LineupStintInfo]) => idStint[0])
      .mapValues((idStints: [PlayerCode, LineupStintInfo][]) =>
        idStints.map((idStint) => idStint[1])
      )
      .value();
  };

  const gameBreaks = [
    20.0, 40.0, 45.0, 50.0, 55.0, 60.0, 65.0, 70.0, 75.0, 80.0,
  ];

  const crossesGameBreak = (
    breakTime: number,
    lastStingInClump: LineupStintInfo,
    nextStint: LineupStintInfo
  ) => {
    if (breakTime > nextStint.end_min) {
      return false;
    } else {
      const lastClumpEnd = lastStingInClump.end_min;
      if (lastClumpEnd <= breakTime && nextStint.end_min > breakTime) {
        return true;
      } else {
        return false;
      }
    }
  };
  const toClumpsPerPlayer = (stints: LineupStintInfo[]): StintClump[] => {
    return _.transform(
      stints,
      (acc, v) => {
        if (_.isEmpty(acc.res)) {
          acc.res = [{ stints: [v] }];
        } else {
          const lastClump = _.last(acc.res)!;
          const lastStint = _.last(lastClump.stints)!; //(non-empty by construction)
          if (v.start_min > lastStint.end_min) {
            //(new clump!)
            acc.res = acc.res.concat([{ stints: [v] }]);
            if (v.end_min > gameBreaks[acc.nextGameBreakIndex]!) {
              acc.nextGameBreakIndex = acc.nextGameBreakIndex + 1;
            }
          } else if (
            crossesGameBreak(
              gameBreaks[acc.nextGameBreakIndex]!,
              _.last(lastClump.stints)!,
              v
            )
          ) {
            //(new clump!)
            acc.res = acc.res.concat([{ stints: [v] }]);
            acc.nextGameBreakIndex = acc.nextGameBreakIndex + 1;
          } else {
            lastClump.stints = lastClump.stints.concat([v]);
          }
        }
      },
      { res: [] as StintClump[], nextGameBreakIndex: 0 }
    ).res;
  };

  const playersA = _.mapValues(toStintsPerPlayer(lineupStintsA), (ss) =>
    toClumpsPerPlayer(ss)
  );
  const playersB = _.mapValues(toStintsPerPlayer(lineupStintsB), (ss) =>
    toClumpsPerPlayer(ss)
  );

  const buildTable = (
    team: string,
    lineupStints: LineupStintInfo[],
    players: Record<string, StintClump[]>,
    playerInfoCache: GameStatsCache | undefined
  ): [Record<string, GenericTableColProps>, GenericTableRow[]] => {
    const starterCodes = new Set(
      _.first(lineupStints)?.players?.map((p) => p.code) || []
    );

    const { tableCols, gameBreakRowInfo } = _.transform(
      lineupStints,
      (acc, stint, index) => {
        if (stint.end_min > gameBreaks[acc.nextGameBreakIndex]!) {
          const fieldName = `gm${acc.nextGameBreakIndex}`;
          acc.tableCols[fieldName] = new GenericTableColProps(
            "",
            "",
            0.1,
            false,
            GenericTableOps.htmlFormatter
          );
          acc.gameBreakRowInfo[fieldName] = _.thru(
            acc.nextGameBreakIndex,
            (breakNum) => {
              const tooltip = (
                <Tooltip id={`gameBreak${breakNum}`}>
                  [{GameAnalysisUtils.buildDurationStr(gameBreaks[breakNum])}]
                  break
                  <br />
                  Score: [{stint.score_info.start.scored}:
                  {stint.score_info.start.allowed}]
                </Tooltip>
              );
              const styled = (str: string) => (
                <OverlayTrigger placement="auto" overlay={tooltip}>
                  <small>
                    <sup
                      style={{
                        paddingLeft: "5px",
                        paddingRight: "4px",
                      }}
                    >
                      <b>{str}</b>
                    </sup>
                  </small>
                </OverlayTrigger>
              );
              if (breakNum == 0) {
                return styled("H");
              } else if (breakNum == 1) {
                return styled("F");
              } else {
                return styled((breakNum - 1).toFixed(0));
              }
            }
          );
          acc.nextGameBreakIndex = acc.nextGameBreakIndex + 1;
        }
        acc.tableCols[`stint${index}`] = new GenericTableColProps(
          "",
          ``,
          stint.duration_mins,
          false,
          GenericTableOps.htmlFormatter
        );
      },
      {
        tableCols: {} as Record<string, GenericTableColProps>,
        nextGameBreakIndex: 0,
        gameBreakRowInfo: {} as Record<string, any>,
      }
    );

    const tableDefs = {
      title: GenericTableOps.addTitle(
        "",
        "",
        GenericTableOps.defaultRowSpanCalculator,
        "",
        GenericTableOps.htmlFormatter,
        7.5
      ),
      sep0: GenericTableOps.addColSeparator(),
      ...tableCols,
    };

    const sortedPlayerObjs = _.chain(players)
      .map((clumps, playerCode) => {
        const playerKey =
          _.find(
            clumps[0].stints[0].players,
            (player) => player.code == playerCode
          )?.id || "?????";

        const playerCols = _.transform(
          clumps,
          (acc, clump) => {
            const clumpStart = clump.stints[0].start_min;
            const clumpEnd = _.last(clump.stints)!.end_min;
            const clumpPlusMinus = _.sum(
              clump.stints.map((c) => c.team_stats.plus_minus)
            );
            const clumpNumPoss =
              _.sum(clump.stints.map((c) => c.team_stats.num_possessions)) || 1;

            const stintsRemaining = _.drop(lineupStints, acc.currStint);
            const startStint = _.thru(
              _.findIndex(
                stintsRemaining,
                (stint) => stint.start_min >= clumpStart
              ),
              (index) =>
                index < 0 ? _.size(lineupStints) : index + acc.currStint
            );
            if (startStint >= 0) {
              const endStint = _.thru(
                _.findIndex(
                  stintsRemaining,
                  (stint) => stint.end_min >= clumpEnd
                ),
                (index) =>
                  index < 0 ? _.size(lineupStints) : index + acc.currStint
              );

              //   console.log(
              //     `${playerCode}: ${clumpStart}:${clumpEnd} found ${startStint}(${lineupStints[startStint].start_min})` +
              //       ` vs ${startStint}(${lineupStints[endStint]?.end_min}`
              //   );

              for (var ii = startStint; ii <= endStint; ++ii) {
                const stint = lineupStints[ii];

                const playerStats = _.find(
                  stint.players,
                  (p) => p.code == playerCode
                )?.stats;

                // Calculate very simple usage rate:
                const toStats = (stats: LineupStintTeamStats) =>
                  stats as Record<string, LineupStintTeamStat>;
                const toShots = (stats: LineupStintTeamStats) =>
                  stats as Record<string, LineupStintTeamShot>;

                const playerStintInfo = _.thru(playerStats, (__) => {
                  const teamShots =
                    stint.team_stats.num_possessions +
                    (toStats(stint.team_stats)?.orb?.total || 0);
                  if (playerStats && teamShots) {
                    //TODO: very basic assist and ORB info

                    const playerPoss =
                      (toShots(playerStats)?.fg?.attempts?.total || 0) +
                      0.475 * (toShots(playerStats)?.ft?.attempts?.total || 0) +
                      (toStats(playerStats)?.to?.total || 0);

                    const ptsScored =
                      2 * (toShots(playerStats)?.fg_2p?.made?.total || 0) +
                      3 * (toShots(playerStats)?.fg_3p?.made?.total || 0) +
                      (toShots(playerStats)?.ft?.made?.total || 0);

                    return {
                      ppp: ptsScored / (playerPoss || 1),
                      usage: playerPoss / (teamShots || 1),
                    };
                  } else {
                    return undefined;
                  }
                });

                const tooltipTeam = (
                  <Tooltip id={`stint${ii}`}>
                    <b>CLUMP</b>: [
                    {GameAnalysisUtils.buildDurationStr(
                      clump.stints[0].start_min
                    )}
                    ]-[
                    {GameAnalysisUtils.buildDurationStr(
                      _.last(clump.stints)!.end_min
                    )}
                    ]
                    <br />
                    Score: [{clump.stints[0].score_info.start.scored}:
                    {clump.stints[0].score_info.start.allowed}]-[
                    {_.last(clump.stints)!.score_info.end.scored}:
                    {_.last(clump.stints)!.score_info.end.allowed}
                    ]
                    <br />
                    <br />
                    Team Stats:
                    <br />
                    {GameAnalysisUtils.renderStintStats(clump.stints, true)}
                    <br />
                    Opponent Stats:
                    <br />
                    {GameAnalysisUtils.renderStintStats(clump.stints, false)}
                    <br />
                    <br />
                    <b>STINT</b>: [
                    {GameAnalysisUtils.buildDurationStr(stint.start_min)}]-[
                    {GameAnalysisUtils.buildDurationStr(stint.end_min)}]
                    <br />
                    Score: [{stint.score_info.start.scored}:
                    {stint.score_info.start.allowed}]-[
                    {stint.score_info.end.scored}:{stint.score_info.end.allowed}
                    ]
                    <br />
                    <br />
                    Team Stats:
                    <br />
                    {GameAnalysisUtils.renderStintStats([stint], true)}
                    <br />
                    Opponent Stats:
                    <br />
                    {GameAnalysisUtils.renderStintStats([stint], false)}
                    <br />
                  </Tooltip>
                );

                const tooltipPlayer = (
                  <Tooltip id={`stintPlayer${ii}`}>
                    <b>Player Stint Stats</b>
                    <br />
                    usage = [
                    <b>{(100 * (playerStintInfo?.usage || 0)).toFixed(0)}</b>
                    %]
                    <br />
                    ppp = [
                    <b>{(100 * (playerStintInfo?.ppp || 0)).toFixed(2)}</b>]
                    <br />
                    <br />
                    {playerStats
                      ? GameAnalysisUtils.renderStintStats(
                          [
                            {
                              ...stint,
                              team_stats: playerStats,
                            },
                          ],
                          true
                        )
                      : undefined}
                  </Tooltip>
                );

                acc.cols[`stint${ii}`] = (
                  <div>
                    <OverlayTrigger
                      placement="auto"
                      overlay={tooltipTeam}
                      onEntered={() => {
                        setActiveLineup(
                          new Set(stint.players.map((p) => `${team}${p.code}`))
                        );
                      }}
                      onExited={() => {
                        setActiveLineup(undefined);
                      }}
                    >
                      <div>
                        <hr
                          className="mt-0 pt-0 pb-0"
                          style={{
                            height: "4px",
                            marginBottom: "2px",
                            background:
                              CbbColors.off_diff20_p100_redGreyGreen(
                                clumpPlusMinus
                              ),
                          }}
                        />
                      </div>
                    </OverlayTrigger>
                    {showUsage || showPpp ? (
                      <OverlayTrigger
                        placement="auto"
                        overlay={tooltipPlayer}
                        onEntered={() => {
                          setActiveLineup(
                            new Set(
                              stint.players.map((p) => `${team}${p.code}`)
                            )
                          );
                        }}
                        onExited={() => {
                          setActiveLineup(undefined);
                        }}
                      >
                        <div>
                          {showUsage ? (
                            <hr
                              className="mt-0 pt-0 pb-0"
                              style={{
                                height: "2px",
                                marginBottom: "2px",
                                opacity: _.isUndefined(playerStintInfo)
                                  ? "0%"
                                  : "100%",
                                background: CbbColors.usg_offDef_alt(
                                  playerStintInfo?.usage || 0
                                ),
                              }}
                            />
                          ) : undefined}
                          {showPpp ? (
                            <hr
                              className="mt-0 pt-0 pb-0"
                              style={{
                                height: "2px",
                                marginBottom: "0px",
                                opacity: `${Math.min(
                                  (playerStintInfo?.usage || 0) * 400,
                                  100
                                ).toFixed(0)}%`,
                                background: CbbColors.off_ppp_redGreyGreen(
                                  playerStintInfo?.ppp || 0
                                ),
                              }}
                            />
                          ) : undefined}
                        </div>
                      </OverlayTrigger>
                    ) : undefined}
                  </div>
                );
              }
              acc.currStint = endStint + 1;
            } else return undefined; //(can complete the transform)
          },
          { currStint: 0, cols: {} as Record<string, any> }
        ).cols;

        const addFormattingToPlayers = (playerCode: string) => {
          const maybeUnderline = (s: string) =>
            starterCodes.has(s) ? <u>{s}</u> : s;
          if (!playerInfoCache) {
            return <b>{maybeUnderline(playerCode)}</b>;
          } else {
            const maybeRapmInfo = _.find(
              playerInfoCache.rapmInfo?.enrichedPlayers,
              (p) => p.playerCode == playerCode
            );
            const tooltip = (
              <Tooltip id={`playerInfo${playerCode}`}>
                {maybeRapmInfo
                  ? GameAnalysisUtils.buildPlayerTooltipContents(
                      team,
                      playerInfoCache.playerInfo[playerKey] || {},
                      maybeRapmInfo,
                      playerInfoCache.positionInfo[playerKey]
                    )
                  : "(loading)"}
              </Tooltip>
            );

            const maybePos =
              playerInfoCache.positionInfo[playerKey]?.posClass || "??";
            return (
              <span style={{ whiteSpace: "nowrap" }}>
                <sup>
                  <small>{maybePos} </small>
                </sup>
                <OverlayTrigger placement="auto" overlay={tooltip}>
                  <b
                    style={{
                      opacity: activeLineup
                        ? activeLineup.has(`${team}${playerCode}`)
                          ? "100%"
                          : "50%"
                        : "100%",
                    }}
                  >
                    {maybeUnderline(playerCode)}
                  </b>
                </OverlayTrigger>
              </span>
            );
          }
        };

        return {
          title: addFormattingToPlayers(playerCode),
          pct_poss:
            playerInfoCache?.playerInfo?.[playerKey]?.off_team_poss_pct?.value,
          ...playerCols,
        };
      })
      .sortBy((playerObj) => -(playerObj.pct_poss || 0))
      .value();

    const tableRows = (
      [
        GenericTableOps.buildSubHeaderRow(
          [[<b>{team}:</b>, _.size(tableDefs)]],
          "small text-center"
        ),
        GenericTableOps.buildDataRow(
          {
            title: <i>Game score</i>,
            ...gameBreakRowInfo,
            ..._.fromPairs(
              lineupStints.map((stint, stintNum) => {
                const scoreDiffAtStart = stint.score_info.start_diff;
                const scoreDiffAtEnd = stint.score_info.end_diff;
                const stintDiff =
                  stint.score_info.end_diff - stint.score_info.start_diff;
                const tooltip = (
                  <Tooltip id={`gameScore${stintNum}`}>
                    Stint: [
                    {GameAnalysisUtils.buildDurationStr(stint.start_min)}]-[
                    {GameAnalysisUtils.buildDurationStr(stint.end_min)}]
                    <br />
                    Score: [{stint.score_info.start.scored}:
                    {stint.score_info.start.allowed}]-[
                    {stint.score_info.end.scored}:{stint.score_info.end.allowed}
                    ]
                    <br />
                    <br />
                    Stint Delta Pts: [{stintDiff}]
                  </Tooltip>
                );
                return [
                  `stint${stintNum}`,
                  <OverlayTrigger placement="auto" overlay={tooltip}>
                    <div>
                      <hr
                        className="mt-0 pt-0 pb-0"
                        style={{
                          height: "5px",
                          marginBottom: "2px",
                          background: `linear-gradient(to right, ${CbbColors.off_diff20_p100_redGreyGreen(
                            scoreDiffAtStart
                          )} 0%, ${CbbColors.off_diff20_p100_redGreyGreen(
                            scoreDiffAtEnd
                          )} 100%)`,
                        }}
                      />
                      <hr
                        className="mt-0 pt-0 pb-0"
                        style={{
                          height: "1px",
                          marginBottom: "0px",
                          background: `linear-gradient(to right, ${CbbColors.off_diff20_p100_redGreyGreen(
                            stintDiff
                          )} 0%, ${CbbColors.off_diff20_p100_redGreyGreen(
                            stintDiff
                          )} 100%)`,
                        }}
                      />
                    </div>
                  </OverlayTrigger>,
                ];
              })
            ),
          },
          GenericTableOps.defaultFormatter,
          GenericTableOps.defaultCellMeta
        ),
      ] as GenericTableRow[]
    )
      .concat(
        sortedPlayerObjs.map((playerObj) => {
          return GenericTableOps.buildDataRow(
            playerObj,
            GenericTableOps.defaultFormatter,
            GenericTableOps.defaultCellMeta
          );
        })
      )
      .concat(
        showPpp
          ? ([
              GenericTableOps.buildDataRow(
                {
                  title: <i>Defense:</i>,
                  ...gameBreakRowInfo,
                  ..._.fromPairs(
                    lineupStints.map((stint, stintNum) => {
                      const scoredVsAtStart = stint.score_info.start.allowed;
                      const scoredVsAtEnd = stint.score_info.end.allowed;
                      const stintDiff = scoredVsAtEnd - scoredVsAtStart;
                      const ppp =
                        stintDiff / (stint.team_stats.num_possessions || 1);
                      const tooltip = (
                        <Tooltip id={`gameScore${stintNum}`}>
                          Stint: [
                          {GameAnalysisUtils.buildDurationStr(stint.start_min)}
                          ]-[
                          {GameAnalysisUtils.buildDurationStr(stint.end_min)}]
                          <br />
                          Score: [{stint.score_info.start.scored}:
                          {stint.score_info.start.allowed}]-[
                          {stint.score_info.end.scored}:
                          {stint.score_info.end.allowed}
                          ]
                          <br />
                          <br />
                          Pts Allowed: [{stintDiff}]
                          <br />
                          PPP Against: [{ppp.toFixed(2)}]
                        </Tooltip>
                      );
                      return [
                        `stint${stintNum}`,
                        <OverlayTrigger placement="auto" overlay={tooltip}>
                          <hr
                            className="mt-0 pt-0 pb-0"
                            style={{
                              height: "3px",
                              opacity: "75%",
                              marginBottom: "0px",
                              background: `linear-gradient(to right, ${CbbColors.def_ppp_redGreyGreen(
                                ppp
                              )} 0%, ${CbbColors.def_ppp_redGreyGreen(
                                ppp
                              )} 100%)`,
                            }}
                          />
                        </OverlayTrigger>,
                      ];
                    })
                  ),
                },
                GenericTableOps.defaultFormatter,
                GenericTableOps.defaultCellMeta
              ),
            ] as GenericTableRow[])
          : []
      );
    return [tableDefs, tableRows];
  };

  const [tableDefsA, tableRowsA] = buildTable(
    commonParams.team!,
    lineupStintsA,
    playersA,
    cachedStats.aStats
  );
  const [tableDefsB, tableRowsB] = buildTable(
    opponent,
    lineupStintsB,
    playersB,
    cachedStats.bStats
  );

  return (
    <Container>
      <Row className="mb-1">
        <ToggleButtonGroup
          items={[
            {
              label: "Usage",
              tooltip: "Show/hide player usage in each stint/clump",
              toggled: showUsage,
              onClick: () => setShowUsage(!showUsage),
            },
            {
              label: "PPP",
              tooltip: "Show/hide player pts/play in each stint/clump",
              toggled: showPpp,
              onClick: () => setShowPpp(!showPpp),
            },
          ]}
        />
      </Row>
      <Row>
        <Col xs={12} className="w-100 text-center">
          <GenericTable
            tableFields={tableDefsA}
            tableData={tableRowsA}
            cellTooltipMode="missing"
            rowStyleOverride={{
              paddingLeft: "0px",
              paddingRight: "1px",
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="w-100 text-center">
          <GenericTable
            tableFields={tableDefsB}
            tableData={tableRowsB}
            cellTooltipMode="missing"
            rowStyleOverride={{
              paddingLeft: "0px",
              paddingRight: "1px",
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};
export default LineupStintsChart;
