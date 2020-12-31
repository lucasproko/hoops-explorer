// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Tooltip from 'react-bootstrap/Tooltip';
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

//@ts-ignore
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceLine, Label } from 'recharts';

// Utils

// Component imports

type CustomTooltipProps = {
  active?: boolean,
  payload?: any,
  label?: string
};
const CustomTooltip: React.FunctionComponent<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active) {
    const data = payload?.[0].payload || {};
    return (
      <div className="custom-tooltip" style={{
        background: 'rgba(255, 255, 255, 0.9)',
      }}>
        <p className="label"><b>{`${data.date} ${label}`}</b></p>
        <p className="desc">
          <span>[<b>{data.num_off_poss}</b>] off possessions</span><br/>
          <span>[<b>{data.num_def_poss}</b>] def possessions</span><br/>
          <span>[<b>{data.num_pts_for}</b>] pts scored</span><br/>
          <span>[<b>{data.num_pts_against}</b>] pts conceded</span><br/>
        </p>
      </div>
    );
  }
  return null;
};

type Props = {
  oppoList: Array<any>,
  orderedOppoList: Record<string, any>,
  params: Record<string, any>
};
const GameInfoDiagView: React.FunctionComponent<Props> = ({oppoList, orderedOppoList, params}) => {

  // Merge with the ordered oppo list
  oppoList.forEach((oppo) => {
    orderedOppoList[`${oppo.date} ${oppo.opponent}`] = oppo;
  });
  const gameDates = _.values(orderedOppoList);


  return <div>
    <br/>
    <ResponsiveContainer width={"80%"} height={120}>
      <LineChart
        data={gameDates}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="opponent" />
        <YAxis>
          <Label angle={-90} value='# possessions' position='insideLeft' style={{textAnchor: 'middle'}} />
        </YAxis>
        <Tooltip
          content={(<CustomTooltip />)}
          wrapperStyle={{ opacity: "0.9", zIndex: "1000" }}
          formatter={(value: number, name: string, props: any) => value.toFixed(0)}
          allowEscapeViewBox={{x: true, y: true}}
          itemSorter={(item: any) => <span>item.value</span>}
        />
        <Line
          type="monotone"
          isAnimationActive={false}
          dataKey="num_off_poss"
          stroke="#8884d8"/>
      </LineChart>
    </ResponsiveContainer>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <b>Game breakdown for above lineup</b>
    </div>
  </div>;
};
export default GameInfoDiagView;
