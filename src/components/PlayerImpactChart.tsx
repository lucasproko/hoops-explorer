// React imports:
import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import {
  ReferenceLine,
  ReferenceArea,
  Legend,
  Tooltip as RechartTooltip,
  CartesianGrid,
  Cell,
  Label,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { CbbColors } from "../utils/CbbColors";
import { ScatterChartUtils } from "../utils/charts/ScatterChartUtils";

import {
  getCommonFilterParams,
  MatchupFilterParams,
  ParamDefaults,
} from "../utils/FilterModels";
import { efficiencyAverages } from "../utils/public-data/efficiencyAverages";
import { PureStatSet } from "../utils/StatModels";
import { LineupUtils } from "../utils/stats/LineupUtils";
import { GameAnalysisUtils } from "../utils/tables/GameAnalysisUtils";
import { LineupStatsModel } from "./LineupStatsTable";
import { RosterStatsModel } from "./RosterStatsTable";
import { TeamStatsModel } from "./TeamStatsTable";

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
  };
  onChangeState: (newParams: MatchupFilterParams) => void;
  seasonStats?: Boolean; //(defaults to game mode)
};

const graphLimit = 10.0;

const PlayerImpactChart: React.FunctionComponent<Props> = ({
  startingState,
  opponent,
  dataEvent,
  onChangeState,
  seasonStats,
}) => {
  const {
    lineupStatsA,
    teamStatsA,
    rosterStatsA,
    lineupStatsB,
    teamStatsB,
    rosterStatsB,
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

  // Viewport management

  const [screenHeight, setScreenHeight] = useState(512);
  const [screenWidth, setScreenWidth] = useState(512);
  const isSmallScreen = screenWidth <= 800;

  //(would only need these if using dynamic sizing)
  // const latestScreenHeight = useRef(screenHeight);
  // const latestScreenWidth = useRef(screenWidth);
  const calcWidthHeight = (): [number, number] => {
    const baseHeight = Math.max(0.5 * window.innerHeight, 400);
    const baseWidth = Math.max(
      baseHeight,
      Math.max(0.5 * window.innerWidth, 400)
    );
    return [baseWidth, baseHeight];
  };
  useEffect(() => {
    function handleResize() {
      setTimeout(() => {
        const [baseWidth, baseHeight] = calcWidthHeight();
        setScreenHeight(baseHeight);
        setScreenWidth(baseWidth);
      }, 250);
    }
    window.addEventListener("resize", handleResize);
    const [baseWidth, baseHeight] = calcWidthHeight();
    setScreenHeight(baseHeight);
    setScreenWidth(baseWidth);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // RAPM building

  const [cachedStats, setCachedStats] = useState<{ ab: any[] }>({ ab: [] });
  useEffect(() => {
    setCachedStats({ ab: [] });
  }, [dataEvent, adjustForLuck]);
  useEffect(() => {
    if (_.isEmpty(cachedStats.ab) && !_.isEmpty(lineupStatsA.lineups)) {
      const aStats = buildStats(
        commonParams.team!,
        "black",
        lineupStatsA,
        teamStatsA,
        rosterStatsA
      );
      const bStats = buildStats(
        opponent,
        "purple",
        lineupStatsB,
        teamStatsB,
        rosterStatsB
      );
      setCachedStats({
        ab: _.orderBy(aStats.concat(bStats), (p) => -(p.x * p.x + p.y * p.y)),
        // (render the players around the edge first, who are likely to be less congested)
      });
    }
  }, [cachedStats]);

  // Calcs

  /** For a given lineup set, calculate RAPM as quickly as possible */
  const buildStats = (
    team: string,
    labelColor: string,
    lineupStats: LineupStatsModel,
    teamStats: TeamStatsModel,
    rosterStats: RosterStatsModel
  ) => {
    const totalGames = seasonStats
      ? _.size(
          LineupUtils.isGameInfoStatSet(teamStats.baseline?.game_info || {})
            ? LineupUtils.getGameInfo(teamStats.baseline?.game_info || {})
            : teamStats.baseline?.game_info
        ) || 1
      : 1;

    return _.thru(
      GameAnalysisUtils.buildGameRapmStats(
        team,
        commonParams,
        lineupStats,
        teamStats,
        rosterStats,
        adjustForLuck,
        luckConfig,
        avgEfficiency
      ),
      ({ playerInfo, positionInfo, rapmInfo }) => {
        return _.chain(rapmInfo?.enrichedPlayers || [])
          .map((p) => {
            const statObj = playerInfo[p.playerId];
            const offPoss = statObj.off_team_poss_pct?.value || 0;
            const defPoss = statObj.def_team_poss_pct?.value || 0;
            const playerGames = seasonStats
              ? _.size(
                  LineupUtils.isGameInfoStatSet(statObj.game_info)
                    ? LineupUtils.getGameInfo(statObj.game_info || {})
                    : statObj.game_info
                ) || 1
              : 1;

            const missingGameAdjustment = totalGames / playerGames;

            const offRapmProd =
              (p.rapm?.off_adj_ppp?.value || 0) *
              offPoss *
              missingGameAdjustment;
            const defRapmProd =
              (p.rapm?.def_adj_ppp?.value || 0) *
              defPoss *
              missingGameAdjustment;

            return {
              seriesId: team,
              labelColor,
              x: Math.min(graphLimit, Math.max(-graphLimit, offRapmProd)),
              y: -Math.min(graphLimit, Math.max(-graphLimit, defRapmProd)),
              z: offPoss * missingGameAdjustment,
              color: offRapmProd - defRapmProd,
              name: GameAnalysisUtils.namePrettifier(p.playerCode),
              posInfo: positionInfo[p.playerId],
              stats: statObj,
              onOffStats: p,
              missingGameAdj: missingGameAdjustment,
            };
          })
          .value();
      }
    );
  };

  // Tooltip:

  type CustomTooltipProps = {
    active?: boolean;
    payload?: any;
    label?: string;
  };

  const CustomTooltip: React.FunctionComponent<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active) {
      const data = payload?.[0].payload || {};
      return (
        <div
          className="custom-tooltip"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <small>
            {GameAnalysisUtils.buildPlayerTooltipContents(
              data.seriesId,
              data.stats,
              data.onOffStats,
              data.posInfo,
              seasonStats || false,
              data.missingGameAdj
            )}
          </small>
        </div>
      );
    } else {
      return null;
    }
  };

  // Calculate the x/y limits:
  const [xMin, xMax, yMin, yMax] = _.transform(
    cachedStats.ab,
    (acc, v) => {
      acc[0] = Math.min(acc[0], v.x);
      acc[1] = Math.max(acc[1], v.x);
      acc[2] = Math.min(acc[2], v.y);
      acc[3] = Math.max(acc[3], v.y);
    },
    [1000, -1000, 1000, -1000]
  );

  const calcGraphLimit = (min: number, max: number) => {
    const factor = _.find(
      [0.6, 0.8],
      (factor) => min > -factor * graphLimit && max < factor * graphLimit
    );
    return factor ? factor * graphLimit : graphLimit;
  };
  const graphLimitX = calcGraphLimit(xMin, xMax);
  const graphLimitY = calcGraphLimit(yMin, yMax);

  const labelState = ScatterChartUtils.buildEmptyLabelState();
  return _.isEmpty(cachedStats.ab) ? (
    <Col className="text-center w-100">
      <i>(No Data)</i>
    </Col>
  ) : (
    <ResponsiveContainer width={screenWidth} height={screenHeight}>
      <ScatterChart>
        <defs>
          <linearGradient
            id="xAxisGradient"
            x1="0"
            y1="0"
            x2={screenWidth}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0%"
              stopColor={CbbColors.off_diff10_p100_redBlackGreen(-10)}
            />
            <stop
              offset="100%"
              stopColor={CbbColors.off_diff10_p100_redBlackGreen(10)}
              stopOpacity={1}
            />
          </linearGradient>
          <linearGradient
            id="yAxisGradient"
            x1="0"
            y1="0"
            x2="0"
            y2={screenHeight}
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0%"
              stopColor={CbbColors.off_diff10_p100_redBlackGreen(10)}
            />
            <stop
              offset="100%"
              stopColor={CbbColors.off_diff10_p100_redBlackGreen(-10)}
              stopOpacity={1}
            />
          </linearGradient>
        </defs>

        <ReferenceLine y={0} strokeWidth={1} />
        <ReferenceLine x={0} strokeWidth={1} />

        <ReferenceArea
          x1={-graphLimitX}
          x2={0}
          y1={graphLimitY}
          y2={0}
          fillOpacity={0}
        >
          <Label
            position="insideTopLeft"
            value={isSmallScreen ? "Good D" : "Negative=Good D"}
          />
        </ReferenceArea>
        <ReferenceArea
          x1={0}
          x2={graphLimitX}
          y1={0}
          y2={-graphLimitY}
          fillOpacity={0}
        >
          <Label
            position="insideBottomRight"
            value={isSmallScreen ? "Good O" : "Positive=Good O"}
          />
        </ReferenceArea>

        <Legend verticalAlign="bottom" align="center" iconSize={8} />
        <XAxis
          type="number"
          dataKey="x"
          domain={[-graphLimitX, graphLimitX]}
          axisLine={{ stroke: "url(#xAxisGradient)", strokeWidth: 3 }}
        >
          <Label
            value={
              isSmallScreen ? "Off. Impact (pts)" : "Offensive Impact (pts)"
            }
            position="top"
            style={{ textAnchor: "middle" }}
          />
        </XAxis>
        <YAxis
          type="number"
          dataKey="y"
          domain={[-graphLimitY, graphLimitY]}
          axisLine={{ stroke: "url(#yAxisGradient)", strokeWidth: 3 }}
          tickFormatter={(s) => `-${s}`.replace("--", "")}
        >
          <Label
            angle={-90}
            value={"Defensive Impact (pts)"}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        {seasonStats ? (
          <ZAxis type="number" dataKey="z" range={[10, 100]} />
        ) : undefined}
        <CartesianGrid strokeDasharray="4" />
        <Scatter
          data={cachedStats.ab}
          fill="black"
          shape="triangle"
          name={commonParams.team!}
          legendType="triangle"
        >
          {ScatterChartUtils.buildTidiedLabelList({
            maxHeight: screenHeight,
            maxWidth: screenWidth,
            mutableState: labelState,
            dataKey: "name",
            series: cachedStats.ab,
          })}
          {_.values(cachedStats.ab).map((p, index) => {
            return p.seriesId == commonParams.team! ? (
              <Cell
                key={`cellA-${index}`}
                fill={CbbColors.off_diff10_p100_redBlackGreen(p.color)}
              />
            ) : (
              <Cell key={`cellA-${index}`} opacity={0} />
            );
          })}
          ;
        </Scatter>
        <Scatter
          data={cachedStats.ab}
          fill="purple"
          name={opponent}
          legendType="circle"
        >
          {ScatterChartUtils.buildTidiedLabelList({
            maxHeight: screenHeight,
            maxWidth: screenWidth,
            mutableState: labelState,
            dataKey: "name",
            series: cachedStats.ab,
          })}
          {_.values(cachedStats.ab).map((p, index) => {
            return p.seriesId == opponent ? (
              <Cell
                key={`cellB-${index}`}
                fill={CbbColors.off_diff10_p100_redBlackGreen(p.color)}
              />
            ) : (
              <Cell key={`cellB-${index}`} opacity={0} />
            );
          })}
          ;
        </Scatter>
        <RechartTooltip
          content={<CustomTooltip />}
          wrapperStyle={{ opacity: "0.9", zIndex: 1000 }}
          allowEscapeViewBox={{ x: true, y: false }}
          itemSorter={(item: any) => item.value}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
export default PlayerImpactChart;
