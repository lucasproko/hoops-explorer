// React imports:
import _ from "lodash";
import React, { useState, useEffect, useRef } from "react";
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
} from "recharts";
import { CbbColors } from "../utils/CbbColors";
import { ScatterChartUtils } from "../utils/charts/ScatterChartUtils";

import {
  getCommonFilterParams,
  MatchupFilterParams,
  ParamDefaults,
} from "../utils/FilterModels";
import { efficiencyAverages } from "../utils/public-data/efficiencyAverages";
import { LineupStintInfo, PureStatSet } from "../utils/StatModels";
import { defaultRapmConfig, RapmInfo } from "../utils/stats/RapmUtils";
import { LineupTableUtils } from "../utils/tables/LineupTableUtils";
import { RosterTableUtils } from "../utils/tables/RosterTableUtils";
import { TeamReportTableUtils } from "../utils/tables/TeamReportTableUtils";
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
    lineupStintsA: LineupStintInfo[];
    lineupStintsB: LineupStintInfo[];
  };
  onChangeState: (newParams: MatchupFilterParams) => void;
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
  } = dataEvent;

  return <p>WIP!</p>;
};
export default LineupStintsChart;
