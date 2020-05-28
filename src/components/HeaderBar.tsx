// React imports:
import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';

// Next imports:
import { NextPage } from 'next';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';

// App components:
import { getCommonFilterParams, ParamPrefixes, CommonFilterParams, GameFilterParams, LineupFilterParams, TeamReportFilterParams } from '../utils/FilterModels';

// Utils:
import { UrlRouting } from "../utils/UrlRouting";
import { HistoryManager } from '../utils/HistoryManager';

type Props = {
  thisPage: string,
  common: CommonFilterParams
};

const HeaderBar: React.FunctionComponent<Props> = ({thisPage, common}) => {

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  // Last visited
  function getLastGameUrl() {
    return UrlRouting.getGameUrl(
      UrlRouting.removedSavedKeys(
        HistoryManager.getLastQuery(ParamPrefixes.game) || ""
      ) as GameFilterParams, {});
  }
  function getLastLineupUrl() {
    return UrlRouting.getLineupUrl(
      UrlRouting.removedSavedKeys(
        HistoryManager.getLastQuery(ParamPrefixes.lineup) || ""
      ) as LineupFilterParams, {});
  }
  function getLastReportUrl() {
    return UrlRouting.getTeamReportUrl(
      UrlRouting.removedSavedKeys(
        HistoryManager.getLastQuery(ParamPrefixes.report) || ""
      ) as TeamReportFilterParams);
  }
  // From baseline query
  function getBaseGameUrl() {
    return UrlRouting.getGameUrl(
      getCommonFilterParams(common)  as GameFilterParams, {}
    );
  }
  function getBaseLineupUrl() {
    return UrlRouting.getLineupUrl(
      getCommonFilterParams(common) as LineupFilterParams, {}
    );
  }
  function getBaseReportUrl() {
    return UrlRouting.getTeamReportUrl(
      getCommonFilterParams(common) as TeamReportFilterParams
    );
  }

  function maybeShowBlog() {
    if (!_.startsWith(server, "cbb-on-off-analyzer")) {
      const blogTooltip = (
        <Tooltip id="blogTooltip">Articles describing how to use the tool</Tooltip>
      );
      return <Col xs={1} className="small">
        <OverlayTrigger placement="auto" overlay={blogTooltip}>
          <a href="https://hoop-explorer.blogspot.com/p/blog-page.html" target="_new">Blog...</a>
        </OverlayTrigger>
      </Col>;
    }
  }

  const baseGameTooltip = (
    <Tooltip id="baseGameTooltip">Go to the On/Off Analysis page with the current baseline query</Tooltip>
  );
  const lastGameTooltip = (
    <Tooltip id="lastGameTooltip">Go back to the most recently submitted On/Off Analysis page</Tooltip>
  );
  const baseLineupTooltip = (
    <Tooltip id="baseLineupTooltip">Go to the Lineup Analysis page with the current baseline query</Tooltip>
  );
  const lastLineupTooltip = (
    <Tooltip id="lastLineupTooltip">Go back to the most recently submitted Lineup Analysis page</Tooltip>
  );
  const baseReportTooltip = (
    <Tooltip id="baseReportTooltip">Go to the On/Off Report page with the current baseline query</Tooltip>
  );
  const lastReportTooltip = (
    <Tooltip id="lastReportTooltip">Go back to the most recently submitted On/Off Report page</Tooltip>
  );
  const chartTooltip = (
    <Tooltip id="lastReportTooltip">View a gallery of interesting basketball analytics charts</Tooltip>
  );

  //(only render client-side - was running into cache issues of the Link href)
  return (typeof window !== `undefined`) ? <Container>
      <Row className="border-top">
        {(thisPage != ParamPrefixes.game) ?
            <Col className="text-center small">
              <OverlayTrigger placement="auto" overlay={baseGameTooltip}>
                <span><Link href={getBaseGameUrl()}><a>On/Off: Base</a></Link></span>
              </OverlayTrigger>
            </Col> : null
        }
        {(thisPage != ParamPrefixes.game) ?
            <Col className="text-center small">
              <OverlayTrigger placement="auto" overlay={lastGameTooltip}>
                <span><Link href={getLastGameUrl()}><a>On/Off: Last</a></Link></span>
              </OverlayTrigger>
            </Col> : null
        }
        {(thisPage != ParamPrefixes.lineup) ?
            <Col className="text-center small">
              <OverlayTrigger placement="auto" overlay={baseLineupTooltip}>
                <span><Link href={getBaseLineupUrl()}><a>Lineups: Base</a></Link></span>
              </OverlayTrigger>
            </Col> : null
        }
        {(thisPage != ParamPrefixes.lineup) ?
            <Col className="text-center small">
            <OverlayTrigger placement="auto" overlay={lastLineupTooltip}>
                <span><Link href={getLastLineupUrl()}><a>Lineups: Last</a></Link></span>
              </OverlayTrigger>
            </Col> : null
        }
        {(thisPage != ParamPrefixes.report) ?
            <Col className="text-center small">
            <OverlayTrigger placement="auto" overlay={baseReportTooltip}>
                <span><Link href={getBaseReportUrl()}><a>Report: Base</a></Link></span>
            </OverlayTrigger>
            </Col> : null
        }
        {(thisPage != ParamPrefixes.report) ?
            <Col className="text-center small">
              <OverlayTrigger placement="auto" overlay={lastReportTooltip}>
                <span><Link href={getLastReportUrl()}><a>Report: Last</a></Link></span>
              </OverlayTrigger>
            </Col> : null
        }
        {(thisPage != "charts") ?
            <Col className="text-center small">
              <OverlayTrigger placement="auto" overlay={chartTooltip}>
                <span><Link href={"/Charts"}><a>Charts</a></Link></span>
              </OverlayTrigger>
            </Col> : null
        }
        {maybeShowBlog()}
      </Row>
    </Container> : null;
}

export default HeaderBar;
