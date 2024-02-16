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
import {
  PosFamilyNames,
  PlayTypeUtils,
  TopLevelPlayType,
} from "../../utils/stats/PlayTypeUtils";
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { PlayTypeDiagUtils } from "../../utils/tables/PlayTypeDiagUtils";
import { CbbColors } from "../../utils/CbbColors";

// Component imports
import GenericTable, {
  GenericTableOps,
  GenericTableColProps,
} from "../GenericTable";
import {
  PureStatSet,
  Statistic,
  IndivStatSet,
  TeamStatSet,
  RosterStatsByCode,
  StatModels,
} from "../../utils/StatModels";

import {
  Text,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  title?: string;
  players: Array<IndivStatSet>;
  rosterStatsByCode: RosterStatsByCode;
  teamStats: TeamStatSet;
  teamSeasonLookup: string;
  quickSwitchOptions?: Props[];
  showHelp: boolean;
};
const TeamPlayTypeDiagRadar: React.FunctionComponent<Props> = ({
  title,
  players: playersIn,
  rosterStatsByCode,
  teamStats: teamStatsIn,
  teamSeasonLookup,
  quickSwitchOptions,
  showHelp,
}) => {
  const [quickSwitch, setQuickSwitch] = useState<string | undefined>(undefined);
  const players =
    (quickSwitch
      ? _.find(quickSwitchOptions || [], (opt) => opt.title == quickSwitch)
          ?.players
      : playersIn) || [];
  const teamStats =
    (quickSwitch
      ? _.find(quickSwitchOptions || [], (opt) => opt.title == quickSwitch)
          ?.teamStats
      : teamStatsIn) || StatModels.emptyTeam();

  const topLevelPlayTypeStyles = PlayTypeUtils.buildTopLevelPlayStyles(
    players,
    rosterStatsByCode,
    teamStats
  );

  const data = _.map(topLevelPlayTypeStyles, (stat, playType) => {
    return {
      name: playType.replace("-", " - "),
      pct: (stat.possPct.value || 0) * 100,
      pts: stat.pts.value || 0,
    };
  });

  const tooltipBuilder = (id: string, title: string, tooltip: string) => (
    <OverlayTrigger
      placement="auto"
      overlay={<Tooltip id={id + "Tooltip"}>{tooltip}</Tooltip>}
    >
      <i>{title}</i>
    </OverlayTrigger>
  );

  const quickSwitchBuilder = _.map(
    quickSwitchOptions || [],
    (opt) => opt.title
  ).map((t, index) => {
    return (
      <div key={`quickSwitch-${index}`}>
        [
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setQuickSwitch(quickSwitch == t ? undefined : t); //(ie toggle)
          }}
        >
          {t}
        </a>
        ]&nbsp;
      </div>
    );
  });

  const CustomizedAxisTick: React.FunctionComponent<any> = (props) => {
    const { x, y, payload } = props;
    return (
      <Text x={x} y={y} width={40} textAnchor="middle" verticalAnchor="start">
        {payload.value}
      </Text>
    );
  };

  return (
    <span>
      {/*JSON.stringify(_.chain(teamStats).toPairs().filter(kv => kv[0].indexOf("trans") >= 0).values(), tidyNumbers, 3)*/}
      <br />
      {title ? (
        <span style={{ display: "flex" }}>
          <b>Scoring Analysis: [{quickSwitch || title}]</b>
          {_.isEmpty(quickSwitchOptions) ? null : (
            <div style={{ display: "flex" }}>
              &nbsp;|&nbsp;<i>quick-toggles:</i>&nbsp;{quickSwitchBuilder}
            </div>
          )}
        </span>
      ) : undefined}
      <br />
      <br />
      <Container>
        <Row>
          <Col xs={10}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                height={400}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 40,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  tick={<CustomizedAxisTick />}
                />
                <YAxis domain={[0, 35]} />
                <RechartsTooltip />
                <Bar dataKey="pct" fill="#8884d8">
                  {data.map((p, index) => {
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={CbbColors.off_pp100_redBlackGreen(p.pts * 100)}
                      />
                    );
                  })}
                  ;
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Col>
        </Row>
        <Row>
          <Col xs={10}>
            {_.toPairs(topLevelPlayTypeStyles).map((o) => (
              <span>
                {JSON.stringify(o, tidyNumbers)}
                <br />
              </span>
            ))}
          </Col>
        </Row>
      </Container>
    </span>
  );
};
export default TeamPlayTypeDiagRadar;

/** Util for console log */
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
};
