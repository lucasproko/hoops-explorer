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
import { LineupStintInfo, PlayerCode } from "../utils/StatModels";
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
            1,
            false,
            GenericTableOps.htmlFormatter
          );
          acc.gameBreakRowInfo[fieldName] = _.thru(
            acc.nextGameBreakIndex,
            (breakNum) => {
              const tooltip = (
                <Tooltip id={`gameBreak${breakNum}`}>
                  Break at [{gameBreaks[breakNum]!.toFixed(1)}]
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
          Math.floor(stint.duration_mins * 10),
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
        75
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
                acc.cols[`stint${ii}`] = (
                  <hr
                    style={{
                      height: "3px",
                      background:
                        CbbColors.off_diff20_p100_redGreyGreen(clumpPlusMinus),
                    }}
                  />
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
            const tooltip = (
              <Tooltip id={`playerInfo${playerCode}`}>
                {GameAnalysisUtils.buildPlayerTooltipContents(
                  team,
                  playerInfoCache.playerInfo[playerKey] || {},
                  _.find(
                    playerInfoCache.rapmInfo?.enrichedPlayers,
                    (p) => p.playerCode == playerCode
                  )!,
                  playerInfoCache.positionInfo[playerKey]
                )}
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
                  <b>{maybeUnderline(playerCode)}</b>
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
                const tooltip = (
                  <Tooltip id={`gameScore${stintNum}`}>
                    Stint: [{stint.start_min.toFixed(1)}]-[
                    {stint.end_min.toFixed(0)}]
                    <br />
                    Score: [{stint.score_info.start.scored}:
                    {stint.score_info.start.allowed}]-[
                    {stint.score_info.end.scored}:{stint.score_info.end.allowed}
                    ]
                  </Tooltip>
                );
                return [
                  `stint${stintNum}`,
                  <OverlayTrigger placement="auto" overlay={tooltip}>
                    <hr
                      style={{
                        height: "5px",
                        background: `linear-gradient(to right, ${CbbColors.off_diff20_p100_redGreyGreen(
                          scoreDiffAtStart
                        )} 0%, ${CbbColors.off_diff20_p100_redGreyGreen(
                          scoreDiffAtEnd
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
      ] as GenericTableRow[]
    ).concat(
      sortedPlayerObjs.map((playerObj) => {
        return GenericTableOps.buildDataRow(
          playerObj,
          GenericTableOps.defaultFormatter,
          GenericTableOps.defaultCellMeta
        );
      })
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
