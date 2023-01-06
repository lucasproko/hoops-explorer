// Google analytics:
import { initGA, logPageView } from '../utils/GoogleAnalytics';

// React imports:
import React, { useState, useEffect, useRef } from 'react';
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

// App components:
import GameFilter from '../components/GameFilter';
import { ParamDefaults, ParamPrefixes, GameFilterParams, LineupFilterParams, MatchupFilterParams } from '../utils/FilterModels';
import TeamStatsTable, { TeamStatsModel } from '../components/TeamStatsTable';
import RosterStatsTable, { RosterStatsModel } from '../components/RosterStatsTable';
import { LineupStatsModel } from '../components/LineupStatsTable';
import RosterCompareTable, { RosterCompareModel } from '../components/RosterCompareTable';
import GenericCollapsibleCard from '../components/shared/GenericCollapsibleCard';
import Footer from '../components/shared/Footer';
import HeaderBar from '../components/shared/HeaderBar';

// Utils:
import { StatModels, OnOffBaselineEnum, OnOffBaselineGlobalEnum, PlayerCode, PlayerId, Statistic, IndivStatSet, TeamStatSet, LineupStatSet } from "../utils/StatModels";
import { UrlRouting } from "../utils/UrlRouting";
import { HistoryManager } from '../utils/HistoryManager';
import { ClientRequestCache } from '../utils/ClientRequestCache';
import MatchupFilter from '../components/MatchupFilter';
import PlayerImpactChart from '../components/PlayerImpactChart';
import { buildOppoFilter } from '../components/MatchupFilter';

const MatchupAnalyzerPage: NextPage<{}> = () => {

  useEffect(() => { // Set up GA
    if ((process.env.NODE_ENV === 'production') && (typeof window !== undefined)) {
      if (!gaInited) {
        initGA();
        setGaInited(true);
      }
      logPageView();
    }
  }); //(on any change to the DOM)

  // Team Stats interface

  const [ gaInited, setGaInited ] = useState(false);
  const [ dataEvent, setDataEvent ] = useState({
    teamStatsA: { on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), baseline: StatModels.emptyTeam(), global: StatModels.emptyTeam() } as TeamStatsModel,
    rosterStatsA: { on: [], off: [], baseline: [], global: []} as RosterStatsModel,
    lineupStatsA: { lineups: [] } as LineupStatsModel,

    teamStatsB: { on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), baseline: StatModels.emptyTeam(), global: StatModels.emptyTeam() } as TeamStatsModel,
    rosterStatsB: { on: [], off: [], baseline: [], global: []} as RosterStatsModel,
    lineupStatsB: { lineups: [] } as LineupStatsModel,
  });

  const  injectStats = (
    lineupStatsA: LineupStatsModel, teamStatsA: TeamStatsModel, rosterStatsA: RosterStatsModel, 
    lineupStatsB: LineupStatsModel, teamStatsB: TeamStatsModel, rosterStatsB: RosterStatsModel, 
  ) => {
    setDataEvent({teamStatsA, rosterStatsA, lineupStatsA, rosterStatsB, teamStatsB, lineupStatsB});
  }

  // Game and Lineup filters

  const allParams = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "" : window.location.search;

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  // Some cache management easter eggs, for development:
  if (allParams.indexOf("__clear_cache__") >= 0) {
    console.log("CLEAR CACHE");
    ClientRequestCache.clearCache();
  }
  if (allParams.indexOf("__clear_history__") >= 0) {
    console.log("CLEAR HISTORY");
    HistoryManager.clearHistory();
  }

  const [ matchupFilterParams, setMatchupFilterParams ] = useState(
    UrlRouting.removedSavedKeys(allParams) as MatchupFilterParams
  )
  const matchupFilterParamsRef = useRef<MatchupFilterParams>();
  matchupFilterParamsRef.current = matchupFilterParams;

  function getRootUrl(params: MatchupFilterParams) {
    return UrlRouting.getMatchupUrl(params);
  }
  const [ shouldForceReload, setShouldForceReload ] = useState(0 as number);

  const onMatchupFilterParamsChange = (rawParams: MatchupFilterParams) => {

    /** We're going to want to remove the manual options if the year changes */
    const yearTeamGenderChange = (rawParams: MatchupFilterParams, currParams: MatchupFilterParams) => {
      return (rawParams.year != currParams.year) ||
              (rawParams.gender != currParams.gender) ||
              (rawParams.team != currParams.team);
    }

    // Omit all the defaults
    const params = _.omit(rawParams, _.flatten([ // omit all defaults
      !rawParams.oppoTeam ? [ 'oppoTeam' ] : [],
    ]));
    if (!_.isEqual(params, matchupFilterParamsRef.current)) { //(to avoid recursion)

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
  }

  // View

  function maybeShowDocs() {
    if (!_.startsWith(server, "cbb-on-off-analyzer")) {
      return "https://hoop-explorer.blogspot.com/2019/11/fun-with-college-basketball-onoff.html";
    } else {
      return undefined;
    }
  }

  /** Only rebuild the chart if the data changes, or if one of the filter params changes */

  /** Only rebuild the table if the data changes */
  const chart = React.useMemo(() => {
    return  <GenericCollapsibleCard minimizeMargin={true} title="Player Impact Chart" helpLink={maybeShowDocs()}>
        <Col xs={12} className="text-center d-flex justify-content-center">
      <PlayerImpactChart
        startingState={matchupFilterParamsRef.current || {}}
        opponent={buildOppoFilter(matchupFilterParams.oppoTeam || "")?.team || ""}
        dataEvent={dataEvent}
        onChangeState={onMatchupFilterParamsChange}
      />
      </Col>
    </GenericCollapsibleCard>
  }, [ dataEvent ]);

  const gameParams = (team: string, subFor?: string): GameFilterParams => ({
    team,
    minRank: "1", maxRank: "400",
    gender: matchupFilterParams.gender,
    year: matchupFilterParams.year,
    baseQuery: subFor ? 
      (matchupFilterParams.baseQuery || "").replace(`"${team}"`, `"${subFor}"`)
      : matchupFilterParams.baseQuery,
    showRoster: true,
    calcRapm: true,
    showExpanded: true
  });
  const lineupParams = (team: string, subFor?: string): LineupFilterParams => ({
    team,
    minRank: "1", maxRank: "400",
    gender: matchupFilterParams.gender,
    year: matchupFilterParams.year,
    minPoss: "0",
    baseQuery: subFor ? 
      (matchupFilterParams.baseQuery || "").replace(`"${team}"`, `"${subFor}"`)
      : matchupFilterParams.baseQuery,
  });
  const opponentName = buildOppoFilter(matchupFilterParams.oppoTeam || "")?.team;

  return <Container>
    <Row>
      <Col xs={12} className="text-center">
        <h3>CBB Match-up Analysis Tool <span className="badge badge-pill badge-info">BETA!</span></h3>
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
        <MatchupFilter
          onStats={injectStats}
          startingState={matchupFilterParams}
          onChangeState={onMatchupFilterParamsChange}
        />
        {(dataEvent.lineupStatsA.lineups.length && 
          matchupFilterParams.team && opponentName
          ) ? <Col className="text-center w-100">
            <small>Links: &nbsp;
              <a target="_blank" href={UrlRouting.getGameUrl(gameParams(matchupFilterParams.team), {})}>Team stats</a> /&nbsp;
              <a target="_blank" href={UrlRouting.getLineupUrl(lineupParams(matchupFilterParams.team), {})}>Team lineups</a> /&nbsp;
              <a target="_blank" href={UrlRouting.getGameUrl(gameParams(opponentName, matchupFilterParams.team), {})}>Opponent stats</a> /&nbsp;
              <a target="_blank" href={UrlRouting.getLineupUrl(lineupParams(opponentName, matchupFilterParams.team), {})}>Opponent lineups</a>
            </small>
          </Col> : null
        }
      </GenericCollapsibleCard>
    </Row>
    <Row>
      {chart}
    </Row>
    <Footer year={matchupFilterParams.year} gender={matchupFilterParams.gender} server={server}/>
  </Container>;
}
export default MatchupAnalyzerPage;
