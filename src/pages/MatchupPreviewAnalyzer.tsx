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
  GameFilterParams,
  LineupFilterParams,
  MatchupFilterParams,
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
import MatchupFilter from "../components/MatchupFilter";
import PlayerImpactChart from "../components/PlayerImpactChart";
import { buildOppoFilter } from "../components/MatchupFilter";
import { FeatureFlags } from "../utils/stats/FeatureFlags";
import LineupStintsChart from "../components/LineupStintsChart";
import { LineupStintInfo } from "../utils/StatModels";
import MatchupPreviewFilter from "../components/MatchupPreviewFilter";

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
  const [shouldForceReload, setShouldForceReload] = useState(0 as number);

  const onMatchupFilterParamsChange = (rawParams: MatchupFilterParams) => {
    /** We're going to want to remove the manual options if the year changes */
    const yearTeamGenderChange = (
      rawParams: MatchupFilterParams,
      currParams: MatchupFilterParams
    ) => {
      return (
        rawParams.year != currParams.year ||
        rawParams.gender != currParams.gender ||
        rawParams.team != currParams.team
      );
    };

    // Omit all the defaults
    const params = _.omit(
      rawParams,
      _.flatten([
        // omit all defaults
        !rawParams.oppoTeam ? ["oppoTeam"] : [],
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
        <Col xs={12} className="text-center d-flex justify-content-center">
          <PlayerImpactChart
            startingState={matchupFilterParamsRef.current || {}}
            opponent={
              buildOppoFilter(matchupFilterParams.oppoTeam || "")?.team || ""
            }
            dataEvent={dataEvent}
            onChangeState={onMatchupFilterParamsChange}
          />
        </Col>
      </GenericCollapsibleCard>
    );
  }, [dataEvent]);

  return (
    <Container>
      <Row>
        <Col xs={12} className="text-center">
          <h3>
            CBB Match-up Preview Tool{" "}
            <span className="badge badge-pill badge-info">BETA!</span>
          </h3>
        </Col>
      </Row>
      <Row>
        <HeaderBar
          common={matchupFilterParams}
          thisPage={ParamPrefixes.gameInfo}
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
      <Footer
        year={matchupFilterParams.year}
        gender={matchupFilterParams.gender}
        server={server}
      />
    </Container>
  );
};
export default MatchupPreviewAnalyzerPage;
