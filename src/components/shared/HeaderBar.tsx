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
import Dropdown from 'react-bootstrap/Dropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';


// Utils:
import { getCommonFilterParams, ParamPrefixes, CommonFilterParams, GameFilterParams, LineupFilterParams, TeamReportFilterParams } from '../../utils/FilterModels';
import { UrlRouting } from "../../utils/UrlRouting";
import { HistoryManager } from '../../utils/HistoryManager';

type Props = {
  thisPage: string,
  common: CommonFilterParams,
  override?: boolean //(for testing)
};

/** Dropdowns for controlling navigation */
const StyledDropdown = React.forwardRef<HTMLAnchorElement>((props, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        (props as any).onClick(e);
      }}
    >
        {props.children}
        &nbsp;&nbsp;<FontAwesomeIcon icon={faAngleDown} />
    </a>
));

const HeaderBar: React.FunctionComponent<Props> = ({thisPage, common, override}) => {

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname;

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
      getCommonFilterParams(common) as GameFilterParams, {}
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

  /** Adds the current selection to history before navigating away */
  const onNav = (e: any) => {
    if (!_.isEmpty(common)) { //(do nothing if the page has just been loaded and not modified)
      const key = UrlRouting.getUrl({ [UrlRouting.noSuffix]: common });
      HistoryManager.addParamsToHistory(key, thisPage);
    }
  };

  /** Builds a nice looking nav dropdown item */
  const buildNavItem = (itemName: string, tooltip: React.ReactElement<any>, url: string) => {
    return <OverlayTrigger rootClose placement="left" overlay={tooltip}>
      <span>
        <Link href={url}>
          <div>
            <a className="text-center small" href={url} onClick={onNav}>{itemName}</a>
          </div>
        </Link>
      </span>
    </OverlayTrigger>
  };

  const dropdownStyle = {
    width:"40px", left:"50%", marginLeft:"-20px"
  };

  /** Build a nice looking nav dropdown */
  const buildNavDropdown = (
      name: string,
      baseTooltip: React.ReactElement<any>, baseUrl: string,
      lastTooltip: React.ReactElement<any>, lastUrl: string
  ) => {
    //(mega grovelling with types required to get TS to compile with example from react bootstrap custom dropdown example code)
    return <Dropdown
    >
        <Dropdown.Toggle id={baseUrl} as={StyledDropdown as unknown as undefined}>{name}</Dropdown.Toggle>
        <Dropdown.Menu style={dropdownStyle}>
          <Dropdown.Item>
            {buildNavItem("Base", baseTooltip, baseUrl)}
          </Dropdown.Item>
          <Dropdown.Item>
            {buildNavItem("Last", lastTooltip, lastUrl)}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>;
  };

  /** Build a nice looking nav dropdown */
  const buildChartDropdown = () => {
    //(mega grovelling with types required to get TS to compile with example from react bootstrap custom dropdown example code)
    return <Dropdown>
        <Dropdown.Toggle id="chartDropDown" as={StyledDropdown as unknown as undefined}>Charts</Dropdown.Toggle>
        <Dropdown.Menu style={dropdownStyle}>
          <Dropdown.Item>
            {buildNavItem("Player Positions", chartTooltip, "/Charts")}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>;
  };

  /** Show blog if rendering external version of the page */
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

  //(only render client-side - was running into cache issues of the Link href)
  return (override || (typeof window !== `undefined`)) ? <Container>
      <Row className="border-top">
        {(thisPage != ParamPrefixes.game) ?
            <Col className="text-center small">
              {buildNavDropdown("On/Off", baseGameTooltip, getBaseGameUrl(), lastGameTooltip, getLastGameUrl())}
            </Col> : null
        }
        {(thisPage != ParamPrefixes.lineup) ?
            <Col className="text-center small">
              {buildNavDropdown("Lineups", baseLineupTooltip, getBaseLineupUrl(), lastLineupTooltip, getLastLineupUrl())}
            </Col> : null
        }
        {(thisPage != ParamPrefixes.report) ?
          <Col className="text-center small">
            {buildNavDropdown("Reports", baseReportTooltip, getBaseReportUrl(), lastReportTooltip, getLastReportUrl())}
          </Col> : null
        }
        {(thisPage != "charts") ?
          <Col className="text-center small">
            {buildChartDropdown()}
          </Col> : null
        }
        {maybeShowBlog()}
      </Row>
    </Container> : null;
}

export default HeaderBar;
