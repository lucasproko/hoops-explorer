// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Data imports:
import { dataLastUpdated } from '../utils/internal-data/dataLastUpdated';

type Props = {
  readonly server: string,
  readonly year?: string,
  readonly gender?: string
}

const Footer: React.FunctionComponent<Props> = ({server, gender, year}) => {

  const emailAddress = "bWFpbHRvOmhvb3AuZXhwbG9yZXJAZ21haWwuY29t";
  const twitterAddress = "aHR0cHM6Ly90d2l0dGVyLmNvbS9JdHNBVGVycF9DQkI=";

  const lastUpdated = _.flow([
    (maybeYear: string, maybeGender: string) => [ maybeYear || "", maybeGender || "" ],
    (yearGender: string) => dataLastUpdated[`${yearGender[1]}_${yearGender[0]}`],
    (lastUpdate: string | undefined) => lastUpdate ?
      new Date(parseInt(lastUpdate)*1000).toString() : "unknown"
  ]);

  const onMouseOver = (encoded: string) => (event: any) => {
    if (!_.startsWith(event.target.href, "mailto") &&
        !_.startsWith(event.target.href, "https"))
    {
      event.target.href = atob(encoded);
    }
  }

  // (Display no footer on the non-public site:)
  if (!_.startsWith(server, "cbb-on-off-analyzer")) return <Container><Row>
      <Col>
        <i><small>This year's data last updated: [{lastUpdated(year, gender)}]</small></i>
      </Col>
      <Col>
        <span className="float-right">
          <i><small>
          PbP events from <a href="https://stats.ncaa.org" target="_new">stats.ncaa.org</a>
          </small></i>
        </span>
      </Col>
    </Row>
    <Row>
      <Col>
        <i><small>It's a beta, so let me know if you see anything weird:&nbsp;
        <a href={twitterAddress} target="_new"
          onMouseOver={onMouseOver(twitterAddress)}
        >
        twitter
        </a>&nbsp;/&nbsp;
        <a href={emailAddress} target="_new"
          onMouseOver={onMouseOver(emailAddress)}
        >
        email
        </a></small></i>
      </Col>
      <Col>
        <span className="float-right">
          <i><small>
          SoS stats from <a href="https://kenpom.com" target="_new">kenpom.com</a> and <a href="https://herhoopstats.com" target="_new">herhoopstats.com</a>
          </small></i>
        </span>
      </Col>
    </Row></Container>;
  else
    return <Container></Container>;
}

export default Footer;
