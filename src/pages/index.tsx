// Google analytics:
import { initGA, logPageView } from '../utils/analytics';

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
import GameFilter, { GameFilterParams } from '../components/GameFilter';
import TeamStatsTable, { TeamStatsModel } from '../components/TeamStatsTable';
import RosterStatsTable from '../components/RosterStatsTable';
import RosterCompareTable, { RosterCompareModel } from '../components/RosterCompareTable';
import GenericCollapsibleCard from '../components/GenericCollapsibleCard';

const OnOffAnalysisPage: NextPage<{}> = () => {

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
  const [ teamStats, setTeamStats ] = useState({on: {}, off: {}, baseline: {}} as TeamStatsModel);
  const [ rosterCompareStats, setRosterCompareStats ] = useState({on: {}, off: {}, baseline: {}} as RosterCompareModel);

  const injectStats = (teamStats: TeamStatsModel, rosterCompareStats: RosterCompareModel) => {
    setTeamStats(teamStats);
    setRosterCompareStats(rosterCompareStats);
  }

  // Game filter

  const [ gameFilterParams, setGameFilterParams ] = useState(
    (typeof window === `undefined`) ? //(ensures SSR code still compiles)
      ({}) :
      (queryString.parse(window.location.search) as GameFilterParams)
  )

  const onGameFilterParamsChange = (params: GameFilterParams) => {
    //TODO: get URL?
    //TODO: build params
    const href = `/?${queryString.stringify(params)}`
    const as = href
    Router.push(href, as, { shallow: true })
  }

  // View

  return <Container>
    <Row>
      <h3>CBB On/Off Analysis Tool <span className="badge badge-pill badge-info">BETA!</span></h3>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Team and Game Filter">
        <GameFilter
          onStats={injectStats}
          startingState={gameFilterParams}
          onChangeState={onGameFilterParamsChange}
        />
      </GenericCollapsibleCard>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Team Analysis">
        <TeamStatsTable teamStats={teamStats}/>
      </GenericCollapsibleCard>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Lineup Comparison">
        <RosterCompareTable rosterCompareStats={rosterCompareStats}/>
      </GenericCollapsibleCard>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Individual Analysis">
        <RosterStatsTable/>
      </GenericCollapsibleCard>
    </Row>
  </Container>;
}
export default OnOffAnalysisPage;
