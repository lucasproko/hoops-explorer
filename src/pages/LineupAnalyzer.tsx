// Google analytics:
import { initGA, logPageView } from '../utils/GoogleAnalytics';

// React imports:
import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/Link';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// App components:
import LineupFilter, { LineupFilterParams } from '../components/LineupFilter';
import { GameFilterParams } from '../components/GameFilter';
import LineupStatsTable, { LineupStatsModel } from '../components/LineupStatsTable';
import GenericCollapsibleCard from '../components/GenericCollapsibleCard';

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

  const [ lineupFilterParams, setLineupFilterParams ] = useState(
    UrlRouting.removedSavedKeys(allParams) as LineupFilterParams
  )

  const [ savedGamesFilterParams, setSavedGamesFilterParams ] = useState(
    UrlRouting.extractSavedKeys(allParams, UrlRouting.savedGameSuffix) as GameFilterParams
  )

  function getRootUrl(params: LineupFilterParams) {
    return `/LineupAnalyzer?${UrlRouting.getUrl({
      [UrlRouting.noSuffix]: params,
      [UrlRouting.savedGameSuffix]: savedGamesFilterParams
    })}`;
  }
  function getGameUrl() {
    return `/?${UrlRouting.getUrl({
      [UrlRouting.noSuffix]: savedGamesFilterParams,
      [UrlRouting.savedLineupSuffix]: lineupFilterParams
    })}`;
  }

  const onLineupFilterParamsChange = (params: LineupFilterParams) => {
    const href = getRootUrl(params);
    const as = href;
    Router.push(href, as, { shallow: true });
    UrlRouting.checkForCommonParamChange(params, lineupFilterParams,
      [ (params: any) => setSavedGamesFilterParams(params as GameFilterParams) ]
    );
    //TODO (update game params as well?)
    setLineupFilterParams(params); // (to ensure the new params are included in links)
  }

  // View

  return <Container>
    <Row>
    <Col xs={10}>
      <h3>CBB Lineup Analysis Tool <span className="badge badge-pill badge-info">BETA!</span></h3>
    </Col>
    <Col>
      <span className="float-right"><Link href={getGameUrl()}>On/Off Analysis</Link></span>
    </Col>
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
