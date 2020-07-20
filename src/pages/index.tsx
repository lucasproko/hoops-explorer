// Google analytics:
import { initGA, logPageView } from '../utils/GoogleAnalytics';

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

// App components:
import GameFilter from '../components/GameFilter';
import { ParamDefaults, ParamPrefixes, GameFilterParams, LineupFilterParams } from '../utils/FilterModels';
import TeamStatsTable, { TeamStatsModel } from '../components/TeamStatsTable';
import RosterStatsTable, { RosterStatsModel } from '../components/RosterStatsTable';
import RosterCompareTable, { RosterCompareModel } from '../components/RosterCompareTable';
import GenericCollapsibleCard from '../components/shared/GenericCollapsibleCard';
import Footer from '../components/shared/Footer';
import HeaderBar from '../components/shared/HeaderBar';

// Utils:
import { UrlRouting } from "../utils/UrlRouting";
import { HistoryManager } from '../utils/HistoryManager';
import { ClientRequestCache } from '../utils/ClientRequestCache';

const OnOffAnalyzerPage: NextPage<{}> = () => {

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
    teamStats: {on: {}, off: {}, baseline: {}} as TeamStatsModel,
    rosterStats: {on: [], off: [], baseline: []} as RosterStatsModel
  });
  const [ rosterCompareStats, setRosterCompareStats ] = useState({on: {}, off: {}, baseline: {}} as RosterCompareModel);

  const injectStats = (
    teamStats: TeamStatsModel, rosterCompareStats: RosterCompareModel, rosterStats: RosterStatsModel
  ) => {
    setDataEvent({teamStats, rosterStats});
    setRosterCompareStats(rosterCompareStats);
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

  const [ gameFilterParams, setGameFilterParams ] = useState(
    UrlRouting.removedSavedKeys(allParams) as GameFilterParams
  )
  function getRootUrl(params: GameFilterParams) {
    return UrlRouting.getGameUrl(params, {});
  }

  const onGameFilterParamsChange = (rawParams: GameFilterParams) => {

    // Omit all the defaults
    const params = _.omit(rawParams, _.flatten([ // omit all defaults
      // TeamStatsTable
      _.isEqual(rawParams.luck, ParamDefaults.defaultLuckConfig) ? [ 'luck' ] : [],
      !rawParams.onOffLuck ? [ 'onOffLuck' ] : [],
      (rawParams.showPlayerOnOffLuckDiags == ParamDefaults.defaultOnOffLuckDiagMode) ? [ 'showPlayerOnOffLuckDiags' ] : [],
      (rawParams.showOnOffLuckDiags == ParamDefaults.defaultOnOffLuckDiagMode) ? [ 'showOnOffLuckDiags' ] : [],
      // RosterStatsTable
      (rawParams.sortBy == ParamDefaults.defaultPlayerSortBy) ? [ 'sortBy' ] : [],
      (rawParams.filter == ParamDefaults.defaultPlayerFilter) ? [ 'filter' ] : [],
      (rawParams.showBase == ParamDefaults.defaultPlayerShowBase) ? [ 'showBase' ] : [],
      (rawParams.showExpanded == ParamDefaults.defaultPlayerShowExpanded) ? [ 'showExpanded' ] : [],
      (rawParams.showDiag == ParamDefaults.defaultPlayerDiagMode) ? [ 'showDiag' ] : [],
      (rawParams.possAsPct == ParamDefaults.defaultPlayerPossAsPct) ? [ 'possAsPct' ] : [],
      (rawParams.showPosDiag == ParamDefaults.defaultPlayerPosDiagMode) ? [ 'showPosDiag' ] : [],
    ]));

    const href = getRootUrl(params);
    const as = href;
    //TODO: this doesn't work if it's the same page (#91)
    // (plus adding the _current_ query to the history is a bit counter-intuitive)
    // (for intra-page, need to add to HistoryBounce page which will redirect back to force reload)
    // (need to figure out how to detect inter-page)
    // (for now use use "replace" vs "push" to avoid stupidly long browser histories)
    Router.replace(href, as, { shallow: true });
    setGameFilterParams(params); //(to ensure the new params are included in links)
  }

  // View

  function maybeShowDocs() {
    if (!_.startsWith(server, "cbb-on-off-analyzer")) {
      return "https://hoop-explorer.blogspot.com/2019/11/fun-with-college-basketball-onoff.html";
    } else {
      return undefined;
    }
  }

  return <Container>
    <Row>
      <Col xs={12} className="text-center">
        <h3>CBB On/Off Analysis Tool <span className="badge badge-pill badge-info">BETA!</span></h3>
      </Col>
    </Row>
    <Row>
      <HeaderBar
        common={gameFilterParams}
        thisPage={ParamPrefixes.game}
        />
    </Row>
    <Row>
      <GenericCollapsibleCard
        title="Team and Game Filter"
        summary={HistoryManager.gameFilterSummary(gameFilterParams)}
      >
        <GameFilter
          onStats={injectStats}
          startingState={gameFilterParams}
          onChangeState={onGameFilterParamsChange}
        />
      </GenericCollapsibleCard>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Team Analysis" helpLink={maybeShowDocs()}>
        <TeamStatsTable
          gameFilterParams={gameFilterParams}
          dataEvent={dataEvent}
          onChangeState={onGameFilterParamsChange}
        />
      </GenericCollapsibleCard>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Individual Analysis" helpLink={maybeShowDocs()}>
        <RosterStatsTable
          gameFilterParams={gameFilterParams}
          dataEvent={dataEvent}
          onChangeState={onGameFilterParamsChange}
        />
      </GenericCollapsibleCard>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Lineup Comparison" helpLink={maybeShowDocs()}>
        <RosterCompareTable
          gameFilterParams={gameFilterParams}
          rosterCompareStats={rosterCompareStats}
        />
      </GenericCollapsibleCard>
    </Row>
    <Footer year={gameFilterParams.year} gender={gameFilterParams.gender} server={server}/>
  </Container>;
}
export default OnOffAnalyzerPage;
