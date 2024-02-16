// React imports:
import React, { useState, useEffect } from "react";
import Link from "next/link";

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Dropdown from "react-bootstrap/Dropdown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

// Utils:
import {
  getCommonFilterParams,
  getBaseFilterParams,
  getCommonLboardFilterParams,
  ParamPrefixes,
  CommonFilterParams,
  GameFilterParams,
  LineupFilterParams,
  TeamReportFilterParams,
  LineupLeaderboardParams,
  PlayerLeaderboardParams,
  MatchupFilterParams,
  TeamLeaderboardParams,
  TeamEditorParams,
} from "../../utils/FilterModels";
import { UrlRouting } from "../../utils/UrlRouting";
import { HistoryManager } from "../../utils/HistoryManager";
import { DateUtils } from "../../utils/DateUtils";

type Props = {
  thisPage: string;
  common: CommonFilterParams;
  override?: boolean; //(for testing)
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
    &nbsp;&nbsp;
    <FontAwesomeIcon icon={faAngleDown} />
  </a>
));

const HeaderBar: React.FunctionComponent<Props> = ({
  thisPage,
  common,
  override,
}) => {
  const server =
    typeof window === `undefined` //(ensures SSR code still compiles)
      ? "server"
      : window.location.hostname;

  const hasMidMajors =
    !common.year || common.year >= DateUtils.yearFromWhichAllMenD1Imported;

  const currYearLboard = common.year || DateUtils.mostRecentYearWithLboardData;
  const commonWithCorrectedYearLboard =
    currYearLboard <= DateUtils.mostRecentYearWithLboardData
      ? common
      : {
          ...common,
          year: DateUtils.mostRecentYearWithLboardData,
        };

  // Lineup Leaderboard
  function getLineupLeaderboardUrl(tier: "High" | "Medium" | "Low") {
    return UrlRouting.getLineupLeaderboardUrl(
      getCommonLboardFilterParams(
        commonWithCorrectedYearLboard,
        tier
      ) as LineupLeaderboardParams
    );
  }
  // Player Leaderboard
  function getPlayerLeaderboardUrl(tier: "High" | "Medium" | "Low" | "All") {
    return UrlRouting.getPlayerLeaderboardUrl(
      getCommonLboardFilterParams(
        commonWithCorrectedYearLboard,
        tier
      ) as PlayerLeaderboardParams
    );
  }
  function getPlayerLeaderboardTrackingUrl(trackingList: string) {
    return UrlRouting.getPlayerLeaderboardUrl({
      ...(getCommonLboardFilterParams(common) as PlayerLeaderboardParams),
      gender: "Men",
      tier: "All",
      year: DateUtils.mostRecentYearWithLboardData,
      filter: trackingList,
    });
  }
  function getTeamLeaderboardUrl() {
    const currYear = common.year || DateUtils.mostRecentYearWithData;
    if (
      DateUtils.isSeasonFinished(currYear)
        ? currYear >= DateUtils.mostRecentYearWithData
        : currYear > DateUtils.mostRecentYearWithData
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
  function getLastGameUrl(extraParams?: GameFilterParams) {
    return UrlRouting.getGameUrl(
      {
        ...UrlRouting.removedSavedKeys(
          HistoryManager.getLastQuery(ParamPrefixes.game) || ""
        ),
        ...(extraParams || {}),
      } as GameFilterParams,
      {}
    );
  }
  function getLastLineupUrl(extraParams?: LineupFilterParams) {
    return UrlRouting.getLineupUrl(
      {
        ...UrlRouting.removedSavedKeys(
          HistoryManager.getLastQuery(ParamPrefixes.lineup) || ""
        ),
        ...(extraParams || {}),
      } as LineupFilterParams,
      {}
    );
  }
  function getLastReportUrl(extraParams?: TeamReportFilterParams) {
    return UrlRouting.getTeamReportUrl({
      ...UrlRouting.removedSavedKeys(
        HistoryManager.getLastQuery(ParamPrefixes.report) || ""
      ),
      ...(extraParams || {}),
    } as TeamReportFilterParams);
  }
  // From baseline query
  function getBaseGameUrl(extraParams?: GameFilterParams) {
    return UrlRouting.getGameUrl(
      {
        ...getCommonFilterParams(common),
        ...(extraParams || {}),
      } as GameFilterParams,
      {}
    );
  }
  function getBaseLineupUrl(extraParams?: LineupFilterParams) {
    return UrlRouting.getLineupUrl(
      {
        ...getCommonFilterParams(common),
        ...(extraParams || {}),
      } as LineupFilterParams,
      {}
    );
  }
  function getBaseReportUrl(extraParams?: TeamReportFilterParams) {
    return UrlRouting.getTeamReportUrl({
      ...getCommonFilterParams(common),
      ...(extraParams || {}),
    } as TeamReportFilterParams);
  }

  const describeConfs = (tier: "High" | "Medium" | "Low" | "All") => {
    switch (tier) {
      case "High":
        return "P6 and friends, or any T150-better team";
      case "Medium":
        return "Mid majors, must be T275-better team";
      case "Low":
        return "Bottom 7 conferences, or any T250-worse team";
      case "All":
        return "All conferences, can get slow";
    }
    return "";
  };
  const lineupLeaderboardTooltip = (tier: "High" | "Medium" | "Low") => {
    return (
      <Tooltip id={"lineupLeaderboardTooltip" + tier}>
        Go to the (luck adjusted) Lineup T400 Leaderboard page (
        {describeConfs(tier)})
      </Tooltip>
    );
  };
  const playerLeaderboardTooltip = (
    tier: "High" | "Medium" | "Low" | "All"
  ) => {
    return (
      <Tooltip id={"playerLeaderboardTooltip" + tier}>
        Go to the (luck adjusted) Player Leaderboard page ({describeConfs(tier)}
        )
      </Tooltip>
    );
  };
  const playerLeaderboardTransferTooltip = (
    tier: "High" | "Medium" | "Low" | "All"
  ) => {
    return (
      <Tooltip id={"playerLeaderboardTransferTooltip" + tier}>
        Go to the (luck adjusted) Player Leaderboard page, transfers only (
        {describeConfs(tier)})
      </Tooltip>
    );
  };
  const teamLeaderboardTooltip = (
    <Tooltip id={"teamLeaderboardTooltip"}>
      Build your own team leaderboard out of various resume and quality based
      metrics!
    </Tooltip>
  );
  const teamBuilderTooltip = (
    <Tooltip id={"teamBuilderTooltip"}>
      Build your own roster out of returning players, transfers (or steals!),
      and the bench!
    </Tooltip>
  );
  // const playerLeaderboardTooltipNba2021 = (
  //   <Tooltip id="playerLeaderboardTooltipNba2021">Go to the (luck adjusted) Player Leaderboard page (Men, 'high' tier), filtered for 2021 NBA prospects (from Tankathon)</Tooltip>
  // );
  const playerLeaderboardTooltipNba2022 = (
    <Tooltip id="playerLeaderboardTooltipNba2022">
      Go to the (luck adjusted) Player Leaderboard page (Men), filtered for 2022
      NBA prospects (from ESPN/@DraftExpress)
    </Tooltip>
  );
  const playerLeaderboardTooltipSuperSr2022 = (
    <Tooltip id="playerLeaderboardTooltipSuperSr2022">
      Go to the (luck adjusted) Player Leaderboard page (Men), filtered for 2022
      returning super seniors
    </Tooltip>
  );
  const playerLeaderboardTooltipMdDmv2017 = (
    <Tooltip id="playerLeaderboardTooltipMdDmv2017">
      Go to the (luck adjusted) Player Leaderboard page (Men), filtered for
      Md/DMV-area players class of 2017+
    </Tooltip>
  );
  const playerLeaderboardTooltipNyNj2017 = (
    <Tooltip id="playerLeaderboardTooltipNyNj2017">
      Go to the (luck adjusted) Player Leaderboard page (Men), filtered for
      NY/NJ-area players class of 2017+ (h/t jules99b from reddit)
    </Tooltip>
  );
  const playerLeaderboardTooltipEuro2017 = (
    <Tooltip id="playerLeaderboardTooltipEuro2017">
      Go to the (luck adjusted) Player Leaderboard page (Men), filtered for
      European players class of 2017+
    </Tooltip>
  );
  const playerLeaderboardTooltipCanada2017 = (
    <Tooltip id="playerLeaderboardTooltipCanada2017">
      Go to the (luck adjusted) Player Leaderboard page (Men), filtered for
      Canadian players class of 2017+
    </Tooltip>
  );
  const baseGameTooltip = (
    <Tooltip id="baseGameTooltip">
      Go to the On/Off Analysis page with the current baseline query
    </Tooltip>
  );
  const lastGameTooltip = (
    <Tooltip id="lastGameTooltip">
      Go back to the most recently submitted On/Off Analysis page
    </Tooltip>
  );
  const baseLineupTooltip = (
    <Tooltip id="baseLineupTooltip">
      Go to the Lineup Analysis page with the current baseline query
    </Tooltip>
  );
  const lastLineupTooltip = (
    <Tooltip id="lastLineupTooltip">
      Go back to the most recently submitted Lineup Analysis page
    </Tooltip>
  );
  const baseReportTooltip = (
    <Tooltip id="baseReportTooltip">
      Go to the On/Off Report page with the current baseline query
    </Tooltip>
  );
  const lastReportTooltip = (
    <Tooltip id="lastReportTooltip">
      Go back to the most recently submitted On/Off Report page
    </Tooltip>
  );
  const chartTooltip = (
    <Tooltip id="lastReportTooltip">
      View a gallery of interesting basketball analytics charts
    </Tooltip>
  );
  const gameReportTooltip = (
    <Tooltip id="gameReportTooltip">
      Charts and tables for individual games
    </Tooltip>
  );
  const playerSeasonAnalysisTooltip = (
    <Tooltip id="playerSeasonTooltip">
      Analyze players' year-vs-year statistics
    </Tooltip>
  );
  const transferAnalysisTooltip = (
    <Tooltip id="transferAnalysisTooltip">
      Analyze transfers' performance vs predicted
    </Tooltip>
  );

  /** Adds the current selection to history before navigating away */
  const onNav = (e: any) => {
    if (!_.isEmpty(common)) {
      //(do nothing if the page has just been loaded and not modified)
      const key = UrlRouting.getUrl({ [UrlRouting.noSuffix]: common });
      HistoryManager.addParamsToHistory(key, thisPage);
    }
  };
  const onForce = (url: string) => (e: any) => {
    // (can't force a full client refresh using Router - this is an ugly alternative)
    window.location.href = url;
  };

  /** Builds a nice looking nav dropdown item */
  const buildNavItem = (
    itemName: string,
    tooltip: React.ReactElement<any>,
    url: string,
    dstPage: string
  ) => {
    return thisPage == dstPage ? (
      <OverlayTrigger rootClose placement="auto" overlay={tooltip}>
        <a className="text-center small" href={url} onClick={onForce(url)}>
          {itemName}
        </a>
      </OverlayTrigger>
    ) : (
      <OverlayTrigger rootClose placement="auto" overlay={tooltip}>
        <span>
          <Link href={url}>
            <div>
              <a className="text-center small" href={url} onClick={onNav}>
                {itemName}
              </a>
            </div>
          </Link>
        </span>
      </OverlayTrigger>
    );
  };

  const dropdownStyle = {
    width: "40px",
    left: "50%",
    marginLeft: "-20px",
  };

  const buildTeamDropdown = () => {
    const teamAnalysisSettings: GameFilterParams = {
      showRoster: true,
      calcRapm: true,
      showExtraInfo: true,
    };
    return (
      <Dropdown>
        <Dropdown.Toggle
          id="chartDropDown"
          as={StyledDropdown as unknown as undefined}
        >
          Teams
        </Dropdown.Toggle>
        <Dropdown.Menu style={dropdownStyle}>
          <Dropdown.Item>
            {buildNavItem(
              "Build your own team leaderboard!",
              teamLeaderboardTooltip,
              getTeamLeaderboardUrl(),
              `${ParamPrefixes.team}_leaderboard`
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {buildNavItem(
              "Build your own off-season roster!",
              teamBuilderTooltip,
              getTeamBuilderUrl(),
              `${ParamPrefixes.team}_editor`
            )}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            {buildNavItem(
              "Analysis Base",
              baseGameTooltip,
              getBaseGameUrl(teamAnalysisSettings),
              `${ParamPrefixes.game}`
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {buildNavItem(
              "Analysis Last",
              lastGameTooltip,
              getLastGameUrl(teamAnalysisSettings),
              `${ParamPrefixes.game}`
            )}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            {buildNavItem(
              "On-Off Base",
              baseGameTooltip,
              getBaseGameUrl(),
              `${ParamPrefixes.game}`
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {buildNavItem(
              "On-Off Last",
              lastGameTooltip,
              getLastGameUrl(),
              `${ParamPrefixes.game}`
            )}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const buildPlayerDropdown = () => {
    const teamAnalysisSettings: GameFilterParams = {
      showRoster: true,
      calcRapm: true,
      showExpanded: true,
    };
    return (
      <Dropdown>
        <Dropdown.Toggle
          id="chartDropDown"
          as={StyledDropdown as unknown as undefined}
        >
          Players
        </Dropdown.Toggle>
        <Dropdown.Menu style={dropdownStyle}>
          <Dropdown.Item>
            {buildNavItem(
              "Leaderboard",
              playerLeaderboardTooltip(hasMidMajors ? "All" : "High"),
              getPlayerLeaderboardUrl(hasMidMajors ? "All" : "High"),
              `${ParamPrefixes.player}_leaderboard`
            )}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            {buildNavItem(
              "Roster Analysis Base",
              baseGameTooltip,
              getBaseGameUrl(teamAnalysisSettings),
              `${ParamPrefixes.game}`
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {buildNavItem(
              "Roster Analysis Last",
              lastGameTooltip,
              getLastGameUrl(teamAnalysisSettings),
              `${ParamPrefixes.game}`
            )}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            {buildNavItem(
              "Multi-Season Player Analysis",
              playerSeasonAnalysisTooltip,
              UrlRouting.getPlayerSeasonComparisonUrl({
                year: DateUtils.mostRecentYearWithLboardData,
              }),
              `${ParamPrefixes.player}_chart`
            )}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            {buildNavItem(
              "Md/DMV-area players (HS 2017+)",
              playerLeaderboardTooltipMdDmv2017,
              getPlayerLeaderboardTrackingUrl("__DMV_2017__"),
              `${ParamPrefixes.player}_leaderboard`
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {buildNavItem(
              "European players (HS 2017-2023)",
              playerLeaderboardTooltipEuro2017,
              getPlayerLeaderboardTrackingUrl("__EURO_2017__"),
              `${ParamPrefixes.player}_leaderboard`
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {buildNavItem(
              "Canadian players (HS 2017-2023)",
              playerLeaderboardTooltipCanada2017,
              getPlayerLeaderboardTrackingUrl("__CANADA_2017__"),
              `${ParamPrefixes.player}_leaderboard`
            )}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            {buildNavItem(
              "On-Off/Same-4/RAPM Report",
              baseReportTooltip,
              getBaseReportUrl(),
              `${ParamPrefixes.report}`
            )}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            {buildNavItem("Player Positions", chartTooltip, "/Charts", "chart")}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const buildLineupDropdown = () => {
    return (
      <Dropdown>
        <Dropdown.Toggle
          id="chartDropDown"
          as={StyledDropdown as unknown as undefined}
        >
          Lineups
        </Dropdown.Toggle>
        <Dropdown.Menu style={dropdownStyle}>
          <Dropdown.Item>
            {buildNavItem(
              "Analysis Base",
              baseLineupTooltip,
              getBaseLineupUrl(),
              `${ParamPrefixes.lineup}`
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {buildNavItem(
              "Analysis Last",
              lastLineupTooltip,
              getLastLineupUrl(),
              `${ParamPrefixes.lineup}`
            )}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            {buildNavItem(
              "Leaderboard - 'high' tier",
              lineupLeaderboardTooltip("High"),
              getLineupLeaderboardUrl("High"),
              `${ParamPrefixes.lineup}_leaderboard`
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {buildNavItem(
              "Leaderboard - 'medium' tier",
              lineupLeaderboardTooltip("Medium"),
              getLineupLeaderboardUrl("Medium"),
              `${ParamPrefixes.lineup}_leaderboard`
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {buildNavItem(
              "Leaderboard - 'low' tier",
              lineupLeaderboardTooltip("Low"),
              getLineupLeaderboardUrl("Low"),
              `${ParamPrefixes.lineup}_leaderboard`
            )}
          </Dropdown.Item>{" "}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const buildGameDropdown = () => {
    //(mega grovelling with types required to get TS to compile with example from react bootstrap custom dropdown example code)
    return (
      <Dropdown>
        <Dropdown.Toggle
          id={getBaseReportUrl()}
          as={StyledDropdown as unknown as undefined}
        >
          {"Games"}
        </Dropdown.Toggle>
        <Dropdown.Menu style={dropdownStyle}>
          <Dropdown.Item>
            {buildNavItem(
              "Game Reports",
              gameReportTooltip,
              UrlRouting.getMatchupUrl(
                getBaseFilterParams(common) as MatchupFilterParams
              ),
              `${ParamPrefixes.gameInfo}_review`
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {buildNavItem(
              "Game Previews",
              gameReportTooltip,
              UrlRouting.getMatchupPreviewUrl(
                getBaseFilterParams(common) as MatchupFilterParams
              ),
              `${ParamPrefixes.gameInfo}_preview`
            )}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  /** Show blog if rendering external version of the page */
  function maybeShowBlog() {
    if (!_.startsWith(server, "cbb-on-off-analyzer")) {
      const blogTooltip = (
        <Tooltip id="blogTooltip">
          Articles describing how to use the tool
        </Tooltip>
      );
      return (
        <Col xs={1} className="small">
          <OverlayTrigger placement="auto" overlay={blogTooltip}>
            <a
              href="https://hoop-explorer.blogspot.com/p/blog-page.html"
              target="_blank"
            >
              Docs...
            </a>
          </OverlayTrigger>
        </Col>
      );
    }
  }

  //(only render client-side - was running into cache issues of the Link href)
  return override || typeof window !== `undefined` ? (
    <Container>
      <Row className="border-top">
        <Col className="text-center small">{buildTeamDropdown()}</Col>
        <Col className="text-center small">{buildPlayerDropdown()}</Col>
        <Col className="text-center small">{buildLineupDropdown()}</Col>
        <Col className="text-center small">{buildGameDropdown()}</Col>
        {maybeShowBlog()}
      </Row>
    </Container>
  ) : null;
};

export default HeaderBar;
