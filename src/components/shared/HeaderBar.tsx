// React imports:
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';


// Utils:
import { getCommonFilterParams, getCommonLboardFilterParams, ParamPrefixes, CommonFilterParams, GameFilterParams, LineupFilterParams, TeamReportFilterParams, LineupLeaderboardParams, PlayerLeaderboardParams, ParamDefaults, TeamLeaderboardParams, TeamEditorParams } from '../../utils/FilterModels';
import { UrlRouting } from "../../utils/UrlRouting";
import { HistoryManager } from '../../utils/HistoryManager';
import { DateUtils } from '../../utils/DateUtils';

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

  const isLeaderboard = _.endsWith(thisPage, "_leaderboard");

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname;

  const hasMidMajors = (!common.year || (common.year >= DateUtils.yearFromWhichAllMenD1Imported));

  // Lineup Leaderboard
  function getLineupLeaderboardUrl(tier: "High" | "Medium" | "Low") {
    return UrlRouting.getLineupLeaderboardUrl(
      getCommonLboardFilterParams(common, tier) as LineupLeaderboardParams
    );
  }
  // Player Leaderboard
  function getPlayerLeaderboardUrl(tier: "High" | "Medium" | "Low" | "All") {
    return UrlRouting.getPlayerLeaderboardUrl(
      getCommonLboardFilterParams(common, tier) as PlayerLeaderboardParams
    );
  }
  function getPlayerLeaderboardTrackingUrl(trackingList: string) {
    return UrlRouting.getPlayerLeaderboardUrl(
      {
        ...(getCommonLboardFilterParams(common) as PlayerLeaderboardParams),
        gender: "Men",
        tier: "All",
        year: ParamDefaults.defaultLeaderboardYear,
        filter: trackingList
      }
    );
  }
  function getTeamLeaderboardUrl() {
    const currYear = common.year || DateUtils.mostRecentYearWithData;
    if (DateUtils.isSeasonFinished(currYear) ? 
          (currYear >= DateUtils.mostRecentYearWithData) : (currYear > DateUtils.mostRecentYearWithData)
    ) {
      return UrlRouting.getOffseasonLeaderboard({});
    } else {
      return UrlRouting.getTeamLeaderboardUrl(
        getCommonLboardFilterParams(common) as TeamLeaderboardParams
      );
    }
  }
  function getTeamBuilderUrl() {
    return UrlRouting.getTeamEditorUrl({} as TeamEditorParams);
  }
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

//TODO sort all these out

  const describeConfs = (tier: "High" | "Medium" | "Low" | "All") => {
    switch (tier) {
      case "High": return "P6 and friends, or any T150-better team";
      case "Medium": return "Mid majors, must be T275-better team"
      case "Low": return "Bottom 7 conferences, or any T250-worse team";
      case "All": return "All conferences, can get slow";
    }
    return "";
  };
  const lineupLeaderboardTooltip = (tier: "High" | "Medium" | "Low") => {
    return <Tooltip id={"lineupLeaderboardTooltip" + tier}>Go to the (luck adjusted) Lineup T400 Leaderboard page ({describeConfs(tier)})</Tooltip>
  };
  const playerLeaderboardTooltip = (tier: "High" | "Medium" | "Low" | "All") => {
    return <Tooltip id={"playerLeaderboardTooltip" + tier}>Go to the (luck adjusted) Player Leaderboard page ({describeConfs(tier)})</Tooltip>
  };
  const playerLeaderboardTransferTooltip = (tier: "High" | "Medium" | "Low" | "All") => {
    return <Tooltip id={"playerLeaderboardTransferTooltip" + tier}>Go to the (luck adjusted) Player Leaderboard page, transfers only ({describeConfs(tier)})</Tooltip>
  };
  const teamLeaderboardTooltip = (
    <Tooltip id={"teamLeaderboardTooltip"}>Build your own team leaderboard out of various resume and quality based metrics!</Tooltip>
  );
  const teamBuilderTooltip = (
    <Tooltip id={"teamBuilderTooltip"}>Build your own roster out of returning players, transfers (or steals!), and the bench!</Tooltip>
  );
  const playerLeaderboardTooltipNba2021 = (
    <Tooltip id="playerLeaderboardTooltipNba2021">Go to the (luck adjusted) Player Leaderboard page (Men, 'high' tier), filtered for 2021 NBA prospects (from Tankathon)</Tooltip>
  );
  const playerLeaderboardTooltipMdDmv2017 = (
    <Tooltip id="playerLeaderboardTooltipMdDmv2017">Go to the (luck adjusted) Player Leaderboard page (Men, 'high' tier), filtered for Md/DMV-area players class of 2017+</Tooltip>
  );
  const playerLeaderboardTooltipNyNj2017 = (
    <Tooltip id="playerLeaderboardTooltipNyNj2017">Go to the (luck adjusted) Player Leaderboard page (Men, 'high' tier), filtered for NY/NJ-area players class of 2017+ (h/t jules99b from reddit)</Tooltip>
  );
  const playerLeaderboardTooltipEuro2017 = (
    <Tooltip id="playerLeaderboardTooltipEuro2017">Go to the (luck adjusted) Player Leaderboard page (Men, 'high' tier), filtered for European players class of 2017+</Tooltip>
  );
  const playerLeaderboardTooltipCanada2017 = (
    <Tooltip id="playerLeaderboardTooltipCanada2017">Go to the (luck adjusted) Player Leaderboard page (Men, 'high' tier), filtered for Canadian players class of 2017+</Tooltip>
  );
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
  const onForce = (url: string) => (e: any) => {
    // (can't force a full client refresh using Router - this is an ugly alternative)
    window.location.href = url;
  };

  /** Builds a nice looking nav dropdown item */
  const buildNavItem = (itemName: string, tooltip: React.ReactElement<any>, url: string, toLeaderboard: boolean = false) => {
    return isLeaderboard && toLeaderboard ?
      <OverlayTrigger rootClose placement="auto" overlay={tooltip}>
        <a className="text-center small" href={url} onClick={onForce(url)}>{itemName}</a>
      </OverlayTrigger>
      :
      <OverlayTrigger rootClose placement="auto" overlay={tooltip}>
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

  /** Build a nice looking nav dropdown */
  const buildLeaderboardDropdown = () => {

    //(mega grovelling with types required to get TS to compile with example from react bootstrap custom dropdown example code)
    return <Dropdown>
        <Dropdown.Toggle id="chartDropDown" as={StyledDropdown as unknown as undefined}>Leaderboards</Dropdown.Toggle>
        {hasMidMajors ?
          <Dropdown.Menu style={dropdownStyle}>
            <Dropdown.Item>
              {buildNavItem("Build your own team leaderboard!", teamLeaderboardTooltip, getTeamLeaderboardUrl(), true)}
            </Dropdown.Item>
            <Dropdown.Item>
              {buildNavItem("Build your own roster!", teamBuilderTooltip, getTeamBuilderUrl(), true)}
            </Dropdown.Item>
            <Dropdown.Divider/>
            <Dropdown.Item>
              {buildNavItem("Players - all tiers", playerLeaderboardTooltip("All"), getPlayerLeaderboardUrl("All"), true)}
            </Dropdown.Item>
            <Dropdown.Item>
              {buildNavItem("Players - 2022 Transfers", playerLeaderboardTransferTooltip("All"), getPlayerLeaderboardUrl("All") + "&transferMode=true", true)}
            </Dropdown.Item>
            <Dropdown.Divider/>
            <Dropdown.Item>
              {buildNavItem("Lineups - 'high' tier", lineupLeaderboardTooltip("High"), getLineupLeaderboardUrl("High"), true)}
            </Dropdown.Item>
            <Dropdown.Item>
              {buildNavItem("Lineups - 'medium' tier", lineupLeaderboardTooltip("Medium"), getLineupLeaderboardUrl("Medium"), true)}
            </Dropdown.Item>
            <Dropdown.Item>
              {buildNavItem("Lineups - 'low' tier", lineupLeaderboardTooltip("Low"), getLineupLeaderboardUrl("Low"), true)}
            </Dropdown.Item>
            <Dropdown.Divider/>
            <Dropdown.Item>
              {buildNavItem("Md/DMV-area players (HS 2017+)", playerLeaderboardTooltipMdDmv2017, getPlayerLeaderboardTrackingUrl("__DMV_2017__"), true)}
            </Dropdown.Item>
            <Dropdown.Item>
              {buildNavItem("NY/NJ-area players (HS 2017+)", playerLeaderboardTooltipNyNj2017, getPlayerLeaderboardTrackingUrl("__NYNJ_2017__"), true)}
            </Dropdown.Item>
            <Dropdown.Item>
              {buildNavItem("European players (HS 2017+)", playerLeaderboardTooltipEuro2017, getPlayerLeaderboardTrackingUrl("__EURO_2017__"), true)}
            </Dropdown.Item>
            <Dropdown.Item>
              {buildNavItem("Canadian players (HS 2017+)", playerLeaderboardTooltipCanada2017, getPlayerLeaderboardTrackingUrl("__CANADA_2017__"), true)}
            </Dropdown.Item>
            {
              // Archived tracking lists:
              // <Dropdown.Item>
              // {buildNavItem("2021 NBA prospects", playerLeaderboardTooltipNba2021, getPlayerLeaderboardTrackingUrl("__NBA_2021__"), true)}
              // </Dropdown.Item>
            }
          </Dropdown.Menu>
          :
          <Dropdown.Menu style={dropdownStyle}>
            <Dropdown.Item>
              {buildNavItem("Players - 'high' tier", playerLeaderboardTooltip("High"), getPlayerLeaderboardUrl("High"), true)}
            </Dropdown.Item>
            <Dropdown.Item>
              {buildNavItem("Lineups - 'high' tier", lineupLeaderboardTooltip("High"), getLineupLeaderboardUrl("High"), true)}
            </Dropdown.Item>
            <Dropdown.Divider/>
            {
            // <Dropdown.Item>
            //   {buildNavItem("2021 NBA prospects", playerLeaderboardTooltipNba2021, getPlayerLeaderboardTrackingUrl("__NBA_2021__"), true)}
            // </Dropdown.Item>
            }
            <Dropdown.Item>
              {buildNavItem("Md/DMV-area players (HS 2017+)", playerLeaderboardTooltipMdDmv2017, getPlayerLeaderboardTrackingUrl("__DMV_2017__"), true)}
            </Dropdown.Item>
            <Dropdown.Item>
              {buildNavItem("NY/NJ-area players (HS 2017+)", playerLeaderboardTooltipNyNj2017, getPlayerLeaderboardTrackingUrl("__NYNJ_2017__"), true)}
            </Dropdown.Item>
          </Dropdown.Menu>
        }
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
          <a href="https://hoop-explorer.blogspot.com/p/blog-page.html" target="_blank">Blog...</a>
        </OverlayTrigger>
      </Col>;
    }
  }

  //(only render client-side - was running into cache issues of the Link href)
  return (override || (typeof window !== `undefined`)) ? <Container>
      <Row className="border-top">
        <Col className="text-center small">
          {buildLeaderboardDropdown()}
        </Col>
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
