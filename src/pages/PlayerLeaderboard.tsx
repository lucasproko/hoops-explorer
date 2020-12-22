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

  const dataEventInit = {
    all: { players: [] as any[], confs: [] as string[], lastUpdated: 0 },
    t100: { players: [] as any[], confs: [] as string[], lastUpdated: 0 },
    conf: { players: [] as any[], confs: [] as string[], lastUpdated: 0 }
  };

  const [ gaInited, setGaInited ] = useState(false);
  const [ dataEvent, setDataEvent ] = useState(dataEventInit);
  const [ dataSubEvent, setDataSubEvent ] = useState({ players: [], confs: [], lastUpdated: 0 } as PlayerLeaderboardStatsModel);
  const [ currYear, setCurrYear ] = useState("");
  const [ currGender, setCurrGender ] = useState("");

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
      (!rawParams.posClasses) ? [ 'posClasses' ] : [],

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
    const fullYear = (paramObj.year || ParamDefaults.defaultYear);
    const year = fullYear.substring(0, 4);
    const tier = (paramObj.tier || ParamDefaults.defaultTier);

    if (year == "All") { //TODO: tidy this up
      setDataEvent(dataEventInit); //(clear saved sub-events)

      const years = [ "2018/9", "2019/20", "2020/21", "Extra" ];
      const fetchAll = Promise.all(years.map(tmpYear => tmpYear.substring(0, 4)).map((subYear) => {
        return fetch(`/leaderboards/lineups/players_${dataSubEventKey}_${gender}_${subYear}_${tier}.json`)
          .then((response: fetch.IsomorphicResponse) => {
            return response.ok ? response.json() : Promise.resolve({ error: "No data available" });
          });
      }));
      fetchAll.then((jsons: any[]) => {
        setDataSubEvent({
          players: _.chain(jsons).map(d => d.players || []).flatten().value(),
          confs: _.chain(jsons).map(d => d.players || []).flatten().value(),
          lastUpdated: 0 //TODO use max?
        });
      })
    } else {
      if ((!dataEvent[dataSubEventKey]?.players?.length) || (currYear != fullYear) || (currGender != gender)) {
        const oldCurrYear = currYear;
        const oldCurrGender = currGender;
        setCurrYear(fullYear);
        setCurrGender(gender)
        setDataSubEvent({ players: [], confs: [], lastUpdated: 0 }); //(set the spinner off)
        fetch(`/leaderboards/lineups/players_${dataSubEventKey}_${gender}_${year}_${tier}.json`)
          .then((response: fetch.IsomorphicResponse) => {
            return (response.ok ? response.json() : Promise.resolve({ error: "No data available" })).then((json: any) => {
              //(if year has changed then clear saved data events)
              setDataEvent({ ...(oldCurrYear != year ? dataEventInit : dataEvent), [dataSubEventKey]: json });
              setDataSubEvent(json);
            });
          });
      } else if (dataSubEvent != dataEvent[dataSubEventKey]) {
        setDataSubEvent(dataEvent[dataSubEventKey]);
      }
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
        <h3>CBB Player Leaderboard <span className="badge badge-pill badge-info">BETA!</span></h3>
      </Col>
    </Row>
    <Row className="border-bottom">
      <HeaderBar
        common={{ gender: currGender, year: (currYear == "All") ? undefined : currYear }}
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
