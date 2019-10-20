
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
import GenericCollapsibleCard from '../components/GenericCollapsibleCard';

const Home: NextPage<{}> = () => {
  return <Container>
    <Row>
      <h2>CBB On/Off Analysis Tool</h2>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Team and Game Filter">
        <GameFilter/>
      </GenericCollapsibleCard>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Team Analysis">
        <TeamStatsTable/>
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
console.log(`Check that no secrets are leaked to client side: ${process.env.CLUSTER_USER == undefined}`)
export default Home;
