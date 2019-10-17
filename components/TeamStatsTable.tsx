// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';

type Props = {
  title: string
}

const TeamStatsTable: React.FunctionComponent<Props> = ({title}) => {
  const [ showTable, setShowTable ] = useState(true)

  return <Card className="w-100">
    <Card.Body>
      <Card.Title
        onClick={() => { setShowTable(!showTable); return false } }
      ><a href="#">({showTable ? "+" : "-"}) {title}</a></Card.Title>
      <Collapse in={showTable}>
        <Card.Text>No data</Card.Text>
      </Collapse>
    </Card.Body>
  </Card>;
};

export default TeamStatsTable
