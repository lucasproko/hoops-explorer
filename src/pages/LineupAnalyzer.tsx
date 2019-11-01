// Google analytics:
import { initGA, logPageView } from '../utils/GoogleAnalytics';

// React imports:
import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Additional components:
import queryString from "query-string";

// App compnents:
import LineupFilter, { LineupFilterParams } from '../components/LineupFilter';
import LineupStatsTable, { LineupStatsModel } from '../components/LineupStatsTable';
import GenericCollapsibleCard from '../components/GenericCollapsibleCard';

const LineupAnalyzerPage: NextPage<{}> = () => {

  useEffect(() => { // Set up GA
    if ((process.env.NODE_ENV === 'production') && (typeof window !== undefined)) {
      if (!gaInited) {
        initGA();
        setGaInited(true);
      }
      logPageView();
    }
  }); //(on any change to the DOM)

  // Team Stats interface

  const [ gaInited, setGaInited ] = useState(false);
  const [ lineupStats, setLineupStats ] = useState({} as LineupStatsModel);

  const injectStats = (lineupStats: LineupStatsModel) => {
    setLineupStats(lineupStats);
  }

  // Game filter

  const [ lineupFilterParams, setLineupFilterParams ] = useState(
    (typeof window === `undefined`) ? //(ensures SSR code still compiles)
      ({}) :
      (queryString.parse(window.location.search) as LineupFilterParams)
  )

  const onLineupFilterParamsChange = (params: LineupFilterParams) => {
    const href = `/LineupAnalyzer?${queryString.stringify(params)}`
    const as = href
    Router.push(href, as, { shallow: true })
  }

  // View

  return <Container>
    <Row>
      <h3>CBB Lineup Analysis Tool <span className="badge badge-pill badge-info">BETA!</span></h3>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Team and Game Filter">
        <LineupFilter
          onStats={injectStats}
          startingState={lineupFilterParams}
          onChangeState={onLineupFilterParamsChange}
        />
      </GenericCollapsibleCard>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Lineup Analysis">
        <LineupStatsTable lineupStats={lineupStats}/>
      </GenericCollapsibleCard>
    </Row>
  </Container>;
}
export default LineupAnalyzerPage;
