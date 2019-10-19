
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
import RosterCompareTable from '../components/RosterCompareTable';

const Home: NextPage<{}> = () => {
  return <Container>
    <Row>
      <h2>CBB On/Off Analysis Tool</h2>
    </Row>
    <Row>
      <GameFilter/>
    </Row>
    <Row>
      <TeamStatsTable title="Team Analysis"/>
    </Row>
    <Row>
      <RosterCompareTable title="Lineup Comparison"/>
    </Row>
    <Row>
      <RosterStatsTable title="Lineup Analysis"/>
    </Row>
  </Container>;
}

export default Home;
