// Google analytics:
import { initGA, logPageView } from '../utils/GoogleAnalytics';

// React imports:
import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';

// Next imports:
import { NextPage } from 'next';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// App components:
import LineupFilter from '../components/LineupFilter';
import { ParamPrefixes, GameFilterParams, LineupFilterParams } from '../utils/FilterModels';
import { HistoryManager } from '../utils/HistoryManager';
import LineupStatsTable, { LineupStatsModel } from '../components/LineupStatsTable';
import GenericCollapsibleCard from '../components/GenericCollapsibleCard';
import Footer from '../components/Footer';
import HeaderBar from '../components/HeaderBar';

// Utils:
import { UrlRouting } from "../utils/UrlRouting";

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

  const allParams = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "" : window.location.search;

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  const [ lineupFilterParams, setLineupFilterParams ] = useState(
    UrlRouting.removedSavedKeys(allParams) as LineupFilterParams
  )
  function getRootUrl(params: LineupFilterParams) {
    return UrlRouting.getLineupUrl(params, {});
  }

  const onLineupFilterParamsChange = (params: LineupFilterParams) => {
    const href = getRootUrl(params);
    const as = href;
    //TODO: this doesn't work if it's the same page
    // (plus adding the _current_ query to the history is a bit counter-intuitive)
    // (for intra-page, need to add to HistoryBounce page which will redirect back to force reload)
    // (need to figure out how to detect inter-page)
    // (for now just comment out, tracked by #91)
    // Router.push(href, as, { shallow: true });
    setLineupFilterParams(params); // (to ensure the new params are included in links)
  }

  // View

  return <Container>
    <Row>
      <Col xs={12} className="text-center">
        <h3>CBB Lineup Analysis Tool <span className="badge badge-pill badge-info">BETA!</span></h3>
      </Col>
    </Row>
    <Row>
      <HeaderBar
        common={lineupFilterParams}
        thisPage={ParamPrefixes.lineup}
        />
    </Row>
    <Row>
      <GenericCollapsibleCard
        title="Team and Game Filter"
        summary={HistoryManager.lineupFilterSummary(lineupFilterParams)}
      >
        <LineupFilter
          onStats={injectStats}
          startingState={lineupFilterParams}
          onChangeState={onLineupFilterParamsChange}
        />
      </GenericCollapsibleCard>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Lineup Analysis">
        <LineupStatsTable
          lineupStats={lineupStats}
          startingState={lineupFilterParams}
          onChangeState={onLineupFilterParamsChange}
        />
      </GenericCollapsibleCard>
    </Row>
    <Footer year={lineupFilterParams.year} gender={lineupFilterParams.gender} server={server}/>
  </Container>;
}
export default LineupAnalyzerPage;
