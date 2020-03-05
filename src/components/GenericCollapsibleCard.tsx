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
  readonly summary?: string
  readonly helpLink?: string
}

const GenericCollapsibleCard: React.FunctionComponent<Props> = ({children, title, summary, helpLink}) => {
  const [ showTable, toggleShowTable ] = useState(true)

  const showSummaryIfHidden = () => {
    if (!showTable && summary) {
      return <div className="">{summary}</div>;
    }
  }
  const optionalHelpLink = () => {
    if (helpLink ) {
      return <span className="float-right"><a href={helpLink}><small>(?)</small></a></span>;
    }
  }

  return <Card className="w-100">
    <Card.Body>
      <Card.Title>
        <span><a href="#" onClick={() => { toggleShowTable(!showTable); return false } }>
          ({showTable ? "+" : "-"}) {title}
        </a></span>
        {optionalHelpLink()}
      </Card.Title>
      {showSummaryIfHidden()}
      <Collapse in={showTable}>
        <Container>
          {children}
        </Container>
      </Collapse>
    </Card.Body>
  </Card>;
}

export default GenericCollapsibleCard;
