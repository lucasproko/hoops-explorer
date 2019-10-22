
// React imports:
import React, { useState } from 'react';
import Router, { useRouter } from 'next/router'

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
import RosterCompareTable from '../components/RosterCompareTable';
import GenericCollapsibleCard from '../components/GenericCollapsibleCard';

const OnOffAnalysisPage: NextPage<{}> = () => {

  //TODO: store state for collapsable cards

  // Team Stats interface

  const [ teamStats, setTeamStats ] = useState({on: {}, off: {}, baseline: {}} as TeamStatsModel);

  const injectTeamStats = (stats: TeamStatsModel) => {
    setTeamStats(stats);
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
      <h2>CBB On/Off Analysis Tool</h2>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Team and Game Filter">
        <GameFilter
          onTeamStats={injectTeamStats}
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
        <RosterCompareTable/>
      </GenericCollapsibleCard>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Lineup Analysis">
        <RosterStatsTable/>
      </GenericCollapsibleCard>
    </Row>
  </Container>;
}
export default OnOffAnalysisPage;
