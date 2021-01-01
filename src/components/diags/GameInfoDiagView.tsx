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
// import Tooltip from 'react-bootstrap/Tooltip';
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

//@ts-ignore
import { ResponsiveContainer, ComposedChart, Bar, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceLine, Label } from 'recharts';

// Utils

// Component imports

type CustomTooltipProps = {
  active?: boolean,
  payload?: any,
  label?: string,
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
          <span>+- [<b>{data.plusMinus}</b>]</span><br/>
        </p>
      </div>
    );
  }
  return null;
};

type Props = {
  oppoList: Array<any>,
  orderedOppoList: Record<string, any>,
  params: Record<string, any>,
  maxOffPoss: number
};
const GameInfoDiagView: React.FunctionComponent<Props> = ({oppoList, orderedOppoList, params, maxOffPoss}) => {

  const [ zoomIn, setZoomIn ] = useState(false as boolean);

  // Merge with the ordered oppo list
  oppoList.forEach((oppo) => {
    const plusMinus = (oppo.num_pts_for || 0) - (oppo.num_pts_against || 0);
    const marginalEff = (oppo.num_pts_for || 0)/(oppo.num_off_poss || 1) - (oppo.num_pts_against || 0)/(oppo.num_def_poss || 1);
    const maybeMin = (t: number) => zoomIn ? t : Math.min(t, 100);
    orderedOppoList[`${oppo.date} ${oppo.opponent}`] = {
      ...oppo,
      plusMinus: plusMinus,
      plusOnly: marginalEff >= 0 ? maybeMin(100*marginalEff) : undefined,
      minusOnly: marginalEff < 0 ? maybeMin(100*Math.abs(marginalEff)) : undefined,
    };
  });
  const gameDates = _.values(orderedOppoList);

  return <Container>
    <Row>
      <Col xs={1}/>
      <Col xs={10}>
        <br/>
        <ResponsiveContainer width={"100%"} height={120}>
          <ComposedChart
            data={gameDates}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="opponent" />
            <YAxis yAxisId="left" domain={[0, zoomIn ? 'auto' : (maxOffPoss + 1)]}>
              <Label angle={-90} value='# possessions' position='insideLeft' style={{textAnchor: 'middle'}} />
            </YAxis>
            <YAxis yAxisId="right" domain={[0, zoomIn ? 'auto' : 100]} orientation="right" tickFormatter={t => (!zoomIn && (t == 100)) ? "100+" : t.toFixed(0)}>
              <Label angle={-90} value='margin/100' position='insideRight' style={{textAnchor: 'middle'}} />
            </YAxis>
            <Tooltip
              content={(<CustomTooltip />)}
              wrapperStyle={{ opacity: "0.9", zIndex: "1000" }}
              formatter={(value: number, name: string, props: any) => value.toFixed(0)}
              allowEscapeViewBox={{x: true, y: true}}
              itemSorter={(item: any) => <span>item.value</span>}
            />
            <Bar
              yAxisId="right"
              barSize={5}
              isAnimationActive={false}
              dataKey="plusOnly"
              fill="green" fillOpacity={0.5}/>
            <Bar
              yAxisId="right"
              barSize={5}
              isAnimationActive={false}
              dataKey="minusOnly"
              fill="red" fillOpacity={0.5}/>
            <Line
              yAxisId="left"
              type="monotone"
              isAnimationActive={false}
              dataKey="num_off_poss"
              stroke="#8884d8" strokeWidth={2}/>
          </ComposedChart>
        </ResponsiveContainer>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <b>Game breakdown for above lineup</b>
          &nbsp;(<a href="#" onClick={(event) => { event.preventDefault(); setZoomIn(!zoomIn) }}>{zoomIn ? "zoom out" : "zoom in"}</a>)
        </div>
      </Col>
      <Col/>
    </Row>
  </Container>;
};
export default GameInfoDiagView;
