// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';

type Props = {
  readonly title: string
}

const GenericCollapsibleCard: React.FunctionComponent<Props> = ({children, title}) => {
  const [ showTable, toggleShowTable ] = useState(true)

  return <Card className="w-100">
    <Card.Body>
      <Card.Title>
        <span><a href="#" onClick={() => { toggleShowTable(!showTable); return false } }>
          ({showTable ? "+" : "-"}) {title}
        </a></span>
      </Card.Title>
      <Collapse in={showTable}>
        <Container>
          {children}
        </Container>
      </Collapse>
    </Card.Body>
  </Card>;
}

export default GenericCollapsibleCard;
