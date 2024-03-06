// Google analytics:
import { initGA, logPageView } from "../utils/GoogleAnalytics";

// React imports:
import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";

// Next imports:
import { NextPage } from "next";

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// App components:
import {
  ParamPrefixes,
  MatchupFilterParams,
  ParamDefaults,
} from "../utils/FilterModels";
import { TeamStatsModel } from "../components/TeamStatsTable";
import { RosterStatsModel } from "../components/RosterStatsTable";
import { LineupStatsModel } from "../components/LineupStatsTable";
import GenericCollapsibleCard from "../components/shared/GenericCollapsibleCard";
import Footer from "../components/shared/Footer";
import HeaderBar from "../components/shared/HeaderBar";

// Utils:
import { StatModels } from "../utils/StatModels";
import { UrlRouting } from "../utils/UrlRouting";
import { HistoryManager } from "../utils/HistoryManager";
import { ClientRequestCache } from "../utils/ClientRequestCache";
import PlayerImpactChart from "../components/PlayerImpactChart";
import { LineupStintInfo } from "../utils/StatModels";
import MatchupPreviewFilter from "../components/MatchupPreviewFilter";
import {
  DivisionStatsCache,
  GradeTableUtils,
} from "../utils/tables/GradeTableUtils";
import { PlayTypeDiagUtils } from "../utils/tables/PlayTypeDiagUtils";
import { AvailableTeams } from "../utils/internal-data/AvailableTeams";

const MatchupPreviewAnalyzerPage: NextPage<{}> = () => {
  useEffect(() => {
    // Set up GA
    if (process.env.NODE_ENV === "production" && typeof window !== undefined) {
      if (!gaInited) {
        initGA();
        setGaInited(true);
      }
      logPageView();
    }
  }); //(on any change to the DOM)

  // Team Stats interface

  const [gaInited, setGaInited] = useState(false);
  const [dataEvent, setDataEvent] = useState({
    teamStatsA: {
      on: StatModels.emptyTeam(),
      off: StatModels.emptyTeam(),
      baseline: StatModels.emptyTeam(),
      global: StatModels.emptyTeam(),
    } as TeamStatsModel,
    rosterStatsA: {
      on: [],
      off: [],
      baseline: [],
      global: [],
    } as RosterStatsModel,
    lineupStatsA: { lineups: [] } as LineupStatsModel,

    teamStatsB: {
      on: StatModels.emptyTeam(),
      off: StatModels.emptyTeam(),
      baseline: StatModels.emptyTeam(),
      global: StatModels.emptyTeam(),
    } as TeamStatsModel,
    rosterStatsB: {
      on: [],
      off: [],
      baseline: [],
      global: [],
    } as RosterStatsModel,
    lineupStatsB: { lineups: [] } as LineupStatsModel,
    lineupStintsA: [] as LineupStintInfo[],
    lineupStintsB: [] as LineupStintInfo[],
  });

  const injectStats = (
    lineupStatsA: LineupStatsModel,
    teamStatsA: TeamStatsModel,
    rosterStatsA: RosterStatsModel,
    lineupStatsB: LineupStatsModel,
    teamStatsB: TeamStatsModel,
    rosterStatsB: RosterStatsModel,
    lineupStintsA: LineupStintInfo[],
    lineupStintsB: LineupStintInfo[]
  ) => {
    setDataEvent({
      teamStatsA,
      rosterStatsA,
      lineupStatsA,
      rosterStatsB,
      teamStatsB,
      lineupStatsB,
      lineupStintsA,
      lineupStintsB,
    });
  };

  // Game and Lineup filters

  const allParams =
    typeof window === `undefined` //(ensures SSR code still compiles)
      ? ""
      : window.location.search;

  const server =
    typeof window === `undefined` //(ensures SSR code still compiles)
      ? "server"
      : window.location.hostname;

  /** Only show help for diagnstic on/off on main page */
  const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");

  // Some cache management easter eggs, for development:
  if (allParams.indexOf("__clear_cache__") >= 0) {
    console.log("CLEAR CACHE");
    ClientRequestCache.clearCache();
  }
  if (allParams.indexOf("__clear_history__") >= 0) {
    console.log("CLEAR HISTORY");
    HistoryManager.clearHistory();
  }

  const [matchupFilterParams, setMatchupFilterParams] = useState(
    UrlRouting.removedSavedKeys(allParams) as MatchupFilterParams
  );
  const matchupFilterParamsRef = useRef<MatchupFilterParams>();
  matchupFilterParamsRef.current = matchupFilterParams;

  function getRootUrl(params: MatchupFilterParams) {
    return UrlRouting.getMatchupPreviewUrl(params);
  }
  const onMatchupFilterParamsChange = (rawParams: MatchupFilterParams) => {
    // Omit all the defaults
    const params = _.omit(
      rawParams,
      _.flatten([
        // omit all defaults
        !rawParams.oppoTeam ? ["oppoTeam"] : [],
        _.isNil(rawParams.showTeam) || rawParams.showTeam ? ["showTeam"] : [],
        _.isNil(rawParams.showOppo) || rawParams.showOppo ? ["showOppo"] : [],
        _.isNil(rawParams.factorMins) || rawParams.factorMins
          ? ["factorMins"]
          : [],
        !rawParams.posClasses ? ["posClasses"] : [],
        (rawParams.lockAspect || false) ==
        ParamDefaults.defaultMatchupAnalysisAspectLock
          ? ["lockAspect"]
          : [],
        (rawParams.iconType || "") ==
        ParamDefaults.defaultMatchupAnalysisIconType
          ? ["iconType"]
          : [],
      ])
    );
    if (!_.isEqual(params, matchupFilterParamsRef.current)) {
      //(to avoid recursion)

      const href = getRootUrl(params);
      const as = href;
      //TODO: this doesn't work if it's the same page (#91)
      // (plus adding the _current_ query to the history is a bit counter-intuitive)
      // (for intra-page, need to add to HistoryBounce page which will redirect back to force reload)
      // (need to figure out how to detect inter-page)
      // (for now use use "replace" vs "push" to avoid stupidly long browser histories)
      Router.replace(href, as, { shallow: true });
      setMatchupFilterParams(params); //(to ensure the new params are included in links)
    }
  };

  // Load team grades, needed for play recap view

  const [divisionStatsCache, setDivisionStatsCache] = useState(
    {} as DivisionStatsCache
  );

  // Events that trigger building or rebuilding the division stats cache
  useEffect(() => {
    if (
      matchupFilterParams.year != divisionStatsCache.year ||
      matchupFilterParams.gender != divisionStatsCache.gender ||
      _.isEmpty(divisionStatsCache)
    ) {
      if (!_.isEmpty(divisionStatsCache)) setDivisionStatsCache({}); //unset if set
      GradeTableUtils.populateTeamDivisionStatsCache(
        matchupFilterParams,
        setDivisionStatsCache
      );
    }
  }, [matchupFilterParams]);

  // View

  function maybeShowDocs() {
    if (!_.startsWith(server, "cbb-on-off-analyzer")) {
      return "https://hoop-explorer.blogspot.com/2020/03/understanding-team-report-onoff-page.html#RAPM";
    } else {
      return undefined;
    }
  }

  /** Only rebuild the chart if the data changes, or if one of the filter params changes */

  /** Only rebuild the table if the data changes */
  const chart = React.useMemo(() => {
    return (
      <GenericCollapsibleCard
        minimizeMargin={true}
        title="Player Impact Chart"
        helpLink={maybeShowDocs()}
      >
        <Col
          xs={12}
          className="w-100 text-center d-flex justify-content-center"
        >
          <PlayerImpactChart
            startingState={matchupFilterParamsRef.current || {}}
            opponent={matchupFilterParams.oppoTeam || ""}
            dataEvent={dataEvent}
            onChangeState={onMatchupFilterParamsChange}
            seasonStats={true}
          />
        </Col>
      </GenericCollapsibleCard>
    );
  }, [dataEvent]);

  const playStyleChart = React.useMemo(() => {
    return (
      <GenericCollapsibleCard
        minimizeMargin={true}
        title="Play Type Breakdown"
        helpLink={maybeShowDocs()}
      >
        {dataEvent.teamStatsA.baseline.off_poss?.value ? (
          <Container>
            <Row>
              <Col xs={12}>
                {_.isEmpty(divisionStatsCache) ? (
                  <span>
                    <i>(Loading data...)</i>
                  </span>
                ) : (
                  PlayTypeDiagUtils.buildTeamStyleBreakdown(
                    matchupFilterParams.team || "Unknown",
                    dataEvent.rosterStatsA,
                    dataEvent.teamStatsA,
                    divisionStatsCache,
                    showHelp,
                    false
                  )
                )}
              </Col>
            </Row>
            {matchupFilterParams.oppoTeam ==
            AvailableTeams.noOpponent ? undefined : (
              <Row>
                <Col xs={12}>
                  {_.isEmpty(divisionStatsCache) ? (
                    <span></span>
                  ) : (
                    PlayTypeDiagUtils.buildTeamStyleBreakdown(
                      matchupFilterParams.oppoTeam || "Unknown",
                      dataEvent.rosterStatsB,
                      dataEvent.teamStatsB,
                      divisionStatsCache,
                      showHelp,
                      false
                    )
                  )}
                </Col>
              </Row>
            )}
          </Container>
        ) : (
          <Container>
            <Row>
              <Col xs={12} className="text-center">
                <span>
                  <i>(No Data)</i>
                </span>
              </Col>
            </Row>
          </Container>
        )}
      </GenericCollapsibleCard>
    );
  }, [dataEvent, divisionStatsCache]);

  return (
    <Container style={{ minWidth: "95%" }}>
      <Row>
        <Col xs={12} className="text-center">
          <h3>
            CBB Match-up Preview Tool{" "}
            <span className="badge badge-pill badge-info">IN DEV!</span>
          </h3>
        </Col>
      </Row>
      <Row>
        <HeaderBar
          common={matchupFilterParams}
          thisPage={`${ParamPrefixes.gameInfo}_preview`}
        />
      </Row>
      <Row>
        <GenericCollapsibleCard
          minimizeMargin={false}
          title="Team and Game Filter"
          summary={HistoryManager.gameReportFilterSummary(matchupFilterParams)}
        >
          <MatchupPreviewFilter
            onStats={injectStats}
            startingState={matchupFilterParams}
            onChangeState={onMatchupFilterParamsChange}
          />
        </GenericCollapsibleCard>
      </Row>
      <Row>{chart}</Row>
      <Row>{playStyleChart}</Row>
      <Footer
        year={matchupFilterParams.year}
        gender={matchupFilterParams.gender}
        server={server}
      />
    </Container>
  );
};
export default MatchupPreviewAnalyzerPage;
