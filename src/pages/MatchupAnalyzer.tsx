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
    teamAStats: { on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), baseline: StatModels.emptyTeam(), global: StatModels.emptyTeam() } as TeamStatsModel,
    rosterAStats: { on: [], off: [], baseline: [], global: []} as RosterStatsModel,
    lineupAStats: { lineups: [] } as LineupStatsModel,

    teamBStats: { on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), baseline: StatModels.emptyTeam(), global: StatModels.emptyTeam() } as TeamStatsModel,
    rosterBStats: { on: [], off: [], baseline: [], global: []} as RosterStatsModel,
    lineupBStats: { lineups: [] } as LineupStatsModel,
  });

  const  injectStats = (
    lineupAStats: LineupStatsModel, teamAStats: TeamStatsModel, rosterAStats: RosterStatsModel, 
    lineupBStats: LineupStatsModel, teamBStats: TeamStatsModel, rosterBStats: RosterStatsModel, 
  ) => {
    setDataEvent({teamAStats, rosterAStats, lineupAStats, teamBStats, rosterBStats, lineupBStats});
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
/**/
console.log(`?? ${JSON.stringify(rawParams)}`)  

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

  /** Only rebuild the table if the data changes, or if luck changes (see above) */

  return <Container>
    <Row>
      <Col xs={12} className="text-center">
        <h3>CBB Match-up Analysis Tool <span className="badge badge-pill badge-info">BETA!</span></h3>
      </Col>
    </Row>
    <Row>
      <GenericCollapsibleCard
        minimizeMargin={false}
        title="Team and Game Filter"
        summary={HistoryManager.lineupFilterSummary(matchupFilterParams)}
      >
        <MatchupFilter
          onStats={injectStats}
          startingState={matchupFilterParams}
          onChangeState={onMatchupFilterParamsChange}
        />
      </GenericCollapsibleCard>
    </Row>
    <Row>
      {/* TODO */}
    </Row>
    <Footer year={matchupFilterParams.year} gender={matchupFilterParams.gender} server={server}/>
  </Container>;
}
export default MatchupAnalyzerPage;
