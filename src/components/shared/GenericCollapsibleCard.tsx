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
  /** Much smaller margin => looks good for table-oriented displays */
  readonly minimizeMargin: boolean,
  readonly title: string
  readonly summary?: string
  readonly helpLink?: string
}

const GenericCollapsibleCard: React.FunctionComponent<Props> = ({children, minimizeMargin, title, summary, helpLink}) => {
  const [ showTable, toggleShowTable ] = useState(true)

  const showSummaryIfHidden = () => {
    if (!showTable && summary) {
      return <div className="">{summary}</div>;
    }
  }
  const optionalHelpLink = () => {
    if (helpLink ) {
      return <span className="float-right"><a target="_blank" href={helpLink}><small>(?)</small></a></span>;
    }
  }

  const cardBodyStyle = minimizeMargin ? {paddingLeft: "5px", paddingRight: "5px"} : {};
  const containerStyle = minimizeMargin ? {paddingLeft: 0, paddingRight: 0} : {};
  const titleStyle = minimizeMargin ? {paddingLeft: "15px", paddingRight: "15px"} : {};

  return <Card className="w-100">
    <Card.Body style={cardBodyStyle}>
      <Card.Title style={titleStyle}>
        <span><a href="#" onClick={() => { toggleShowTable(!showTable); return false } }>
          ({showTable ? "+" : "-"}) {title}
        </a></span>
        {optionalHelpLink()}
      </Card.Title>
      {showSummaryIfHidden()}
      <Collapse in={showTable}>
        <Container style={containerStyle}>
          {children}
        </Container>
      </Collapse>
    </Card.Body>
  </Card>;
}

export default GenericCollapsibleCard;
