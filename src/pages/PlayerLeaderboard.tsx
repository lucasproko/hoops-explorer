// Google analytics:
import { initGA, logPageView } from '../utils/GoogleAnalytics';

// React imports:
import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';

// Next imports:
import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// App components:
import { ParamPrefixes, PlayerLeaderboardParams, ParamDefaults } from '../utils/FilterModels';
import { HistoryManager } from '../utils/HistoryManager';
import PlayerLeaderboardTable, { PlayerLeaderboardStatsModel } from '../components/PlayerLeaderboardTable';
import GenericCollapsibleCard from '../components/shared/GenericCollapsibleCard';
import Footer from '../components/shared/Footer';
import HeaderBar from '../components/shared/HeaderBar';

// Utils:
import { UrlRouting } from "../utils/UrlRouting";

const PlayLeaderboardPage: NextPage<{}> = () => {

  useEffect(() => { // Set up GA
    if ((process.env.NODE_ENV === 'production') && (typeof window !== undefined)) {
      if (!gaInited) {
        initGA();
        setGaInited(true);
      }
      logPageView();
    }
  }); //(on any change to the DOM)

  const allParams = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "" : window.location.search;

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  // Team Stats interface

  const [ gaInited, setGaInited ] = useState(false);
  const [ dataEvent, setDataEvent ] = useState({
    all: { players: [], confs: [], lastUpdated: 0 },
    t100: { players: [], confs: [], lastUpdated: 0 },
    conf: { players: [], confs: [], lastUpdated: 0 }
  });
  const [ dataSubEvent, setDataSubEvent ] = useState({ players: [], confs: [], lastUpdated: 0 });
  const [ currYear, setCurrYear ] = useState("");

  // Game filter

  function getRootUrl(params: PlayerLeaderboardParams) {
    return UrlRouting.getPlayerLeaderboardUrl(params);
  }

  const [ playerLeaderboardParams, setPlayerLeaderboardParams ] = useState(
    UrlRouting.removedSavedKeys(allParams) as PlayerLeaderboardParams
  )

  const onPlayerLeaderboardParamsChange = (rawParams: PlayerLeaderboardParams) => {
    const params = _.omit(rawParams, _.flatten([ // omit all defaults
      (!rawParams.t100) ? [ 't100' ] : [],
      (!rawParams.confOnly) ? [ 'confOnly' ] : [],
      (!rawParams.filter) ? [ 'filter' ] : [],
      (!rawParams.conf) ? [ 'conf' ] : [],

      (rawParams.useRapm == ParamDefaults.defaultPlayerLboardUseRapm) ? [ 'useRapm' ] : [],
      (rawParams.factorMins == ParamDefaults.defaultPlayerLboardFactorMins) ? [ 'factorMins' ] : [],
      (rawParams.possAsPct == ParamDefaults.defaultPlayerLboardPossAsPct) ? [ 'possAsPct' ] : [],

      (rawParams.minPoss == ParamDefaults.defaultPlayerLboardMinPos) ? [ 'minPoss' ] : [],
      (rawParams.maxTableSize == ParamDefaults.defaultPlayerLboardMaxTableSize) ? [ 'maxTableSize' ] : [],
      (rawParams.sortBy == ParamDefaults.defaultPlayerLboardSortBy(
        _.isNil(rawParams.useRapm) ? ParamDefaults.defaultPlayerLboardUseRapm : rawParams.useRapm,
        _.isNil(rawParams.factorMins) ? ParamDefaults.defaultPlayerLboardFactorMins : rawParams.factorMins
      )) ? [ 'sortBy' ] : []
    ]));
    if (!_.isEqual(params, playerLeaderboardParams)) { //(to avoid recursion)
      const href = getRootUrl(params);
      const as = href;
      //TODO: this doesn't work if it's the same page (#91)
      // (plus adding the _current_ query to the history is a bit counter-intuitive)
      // (for intra-page, need to add to HistoryBounce page which will redirect back to force reload)
      // (need to figure out how to detect inter-page)
      // (for now use use "replace" vs "push" to avoid stupidly long browser histories)
      Router.replace(href, as, { shallow: true });
      setPlayerLeaderboardParams(params); // (to ensure the new params are included in links)
    }
  }

  useEffect(() => { // Process data selection change
    const paramObj = playerLeaderboardParams;
    const dataSubEventKey = paramObj.t100 ?
      "t100" : (paramObj.confOnly ? "conf" : "all");

    const gender = paramObj.gender || ParamDefaults.defaultGender;
    const year = (paramObj.year || ParamDefaults.defaultYear).substring(0, 4);

    if ((!dataEvent[dataSubEventKey]?.players?.length) || (currYear != year)) {
      setCurrYear(year);
      setDataSubEvent({ players: [], confs: [], lastUpdated: 0 }); //(set the spinner off)
      fetch(`/leaderboards/lineups/players_${dataSubEventKey}_${gender}_${year}.json`)
        .then((response: fetch.IsomorphicResponse) => {
          return response.json().then((json: any) => {
            setDataEvent({ ...dataEvent, [dataSubEventKey]: json });
            setDataSubEvent(json);
          });
        });
    } else if (dataSubEvent != dataEvent[dataSubEventKey]) {
      setDataSubEvent(dataEvent[dataSubEventKey]);
    }
  }, [ playerLeaderboardParams ]);

  // View

  /** Only rebuild the table if the data changes */
  const table = React.useMemo(() => {
    return <PlayerLeaderboardTable
      startingState={playerLeaderboardParams}
      dataEvent={dataSubEvent}
      onChangeState={onPlayerLeaderboardParamsChange}
    />
  }, [dataSubEvent]);

  return <Container>
    <Row>
      <Col xs={12} className="text-center">
        <h3>CBB T700 Player Leaderboard <span className="badge badge-pill badge-info">BETA!</span></h3>
      </Col>
    </Row>
    <Row className="border-bottom">
      <HeaderBar
        common={{}}
        thisPage={`${ParamPrefixes.player}_leaderboard`}
        />
    </Row>
    <Row className="mt-3">
      {table}
    </Row>
    <Footer dateOverride={dataEvent.all?.lastUpdated} year={playerLeaderboardParams.year} gender={playerLeaderboardParams.gender} server={server}/>
  </Container>;
}
export default PlayLeaderboardPage;
