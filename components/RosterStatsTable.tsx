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

const RosterStatsTable: React.FunctionComponent<Props> = ({title}) => {
  const [ showTable, toggleShowTable ] = useState(true)

  return <Card className="w-100">
    <Card.Body>
      <Card.Title
        onClick={() => { toggleShowTable(!showTable); return false } }
      ><a href="#">({showTable ? "+" : "-"}) {title}</a></Card.Title>
      <Collapse in={showTable}>
        <Card.Text>No data loaded</Card.Text>
      </Collapse>
    </Card.Body>
  </Card>;
}

export default RosterStatsTable
