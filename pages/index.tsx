
// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Additional components:
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Typeahead } from 'react-bootstrap-typeahead';

// App compnents:
import GameFilter from '../components/GameFilter';
import TeamStatsTable from '../components/TeamStatsTable';
import RosterStatsTable from '../components/RosterStatsTable';

const Home: NextPage<{}> = () => {
  return <Container>
    <Row>
      <h2>CBB On/Off Analysis Tool</h2>
    </Row>
    <Row>
      <GameFilter/>
    </Row>
    <Row>
      <TeamStatsTable title="'On' Team Stats"/>
    </Row>
    <Row>
      <RosterStatsTable title="'On' Roster Stats"/>
    </Row>
    <Row>
      <TeamStatsTable title="'Baseline' Team Stats"/>
    </Row>
    <Row>
      <RosterStatsTable title="'Baseline' Roster Stats"/>
    </Row>
    <Row>
      <TeamStatsTable title="'Off' Team Stats"/>
    </Row>
    <Row>
      <RosterStatsTable title="'Off' Roster Stats"/>
    </Row>
  </Container>;
}

export default Home;
