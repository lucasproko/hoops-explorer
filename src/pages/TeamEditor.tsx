// Google analytics:
import { initGA, logPageView } from '../utils/GoogleAnalytics';

// React imports:
import React, { useState, useEffect, useRef } from 'react';
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
import { PlayerLeaderboardStatsModel } from '../components/PlayerLeaderboardTable';
import TeamEditorTable from '../components/TeamEditorTable';
import GenericCollapsibleCard from '../components/shared/GenericCollapsibleCard';
import Footer from '../components/shared/Footer';
import HeaderBar from '../components/shared/HeaderBar';

// Utils:
import { UrlRouting } from "../utils/UrlRouting";
import Head from 'next/head';

const TeamEditorPage: NextPage<{}> = () => {

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

  const transferMode = true; //(always retrieve transfers as part of the team editor table pipeline)
    //^ Note only supported for "All" tiers
  const transferInit = transferMode ? {} as Record<string, Array<string>> : undefined; //(start as empty list)

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  // Team Stats interface

  const dataEventInit = {
    all: { players: [] as any[], confs: [] as string[], transfers: transferInit, lastUpdated: 0 },
    t100: { players: [] as any[], confs: [] as string[], transfers: transferInit, lastUpdated: 0 },
    conf: { players: [] as any[], confs: [] as string[], transfers: transferInit, lastUpdated: 0 }
  };

  const [ gaInited, setGaInited ] = useState(false);
  const [ dataEvent, setDataEvent ] = useState(dataEventInit);
  const [ dataSubEvent, setDataSubEvent ] = useState({ players: [], confs: [], lastUpdated: 0 } as PlayerLeaderboardStatsModel);
  const [ currYear, setCurrYear ] = useState("");
  const [ currGender, setCurrGender ] = useState("");
  const [ currTier, setCurrTier ] = useState("");

  // Game filter

  function getRootUrl(params: PlayerLeaderboardParams) {
    return UrlRouting.getTeamEditorUrl(params);
  }

  const [ playerLeaderboardParams, setPlayerLeaderboardParams ] = useState(
    UrlRouting.removedSavedKeys(allParams) as PlayerLeaderboardParams
  )
  const playerLeaderboardParamsRef = useRef<PlayerLeaderboardParams>();
  playerLeaderboardParamsRef.current = playerLeaderboardParams;

  const getUrl = (oppo: string, gender: string, subYear: string, inTier: string) => {
    if (ParamDefaults.defaultYear.startsWith(subYear)) { // Access from dynamic storage
      return `/api/getLeaderboard?src=players&oppo=${oppo}&gender=${gender}&year=${subYear}&tier=${inTier}`;
    } else { //archived
      return `/leaderboards/lineups/players_${oppo}_${gender}_${subYear}_${inTier}.json`;
    }
  }

  const onPlayerLeaderboardParamsChange = (rawParams: PlayerLeaderboardParams) => {
    const params = _.omit(rawParams, _.flatten([ // omit all defaults
      (!rawParams.t100) ? [ 't100' ] : [],
      (!rawParams.confOnly) ? [ 'confOnly' ] : [],
      (!rawParams.filter) ? [ 'filter' ] : [],
      (!rawParams.advancedFilter) ? [ 'advancedFilter' ] : [],
      (!rawParams.conf) ? [ 'conf' ] : [],
      (!rawParams.posClasses) ? [ 'posClasses' ] : [],

      (rawParams.useRapm == ParamDefaults.defaultPlayerLboardUseRapm) ? [ 'useRapm' ] : [],
      (rawParams.factorMins == ParamDefaults.defaultPlayerLboardFactorMins) ? [ 'factorMins' ] : [],
      (rawParams.possAsPct == ParamDefaults.defaultPlayerLboardPossAsPct) ? [ 'possAsPct' ] : [],

      (!rawParams.showInfoSubHeader) ? [ 'showInfoSubHeader' ] : [],

      (rawParams.minPoss == ParamDefaults.defaultPlayerLboardMinPos) ? [ 'minPoss' ] : [],
      (rawParams.maxTableSize == ParamDefaults.defaultPlayerLboardMaxTableSize) ? [ 'maxTableSize' ] : [],
      (rawParams.sortBy == ParamDefaults.defaultPlayerLboardSortBy(
        _.isNil(rawParams.useRapm) ? ParamDefaults.defaultPlayerLboardUseRapm : rawParams.useRapm,
        _.isNil(rawParams.factorMins) ? ParamDefaults.defaultPlayerLboardFactorMins : rawParams.factorMins
      )) ? [ 'sortBy' ] : []
    ]));
    if (!_.isEqual(params, playerLeaderboardParamsRef.current)) { //(to avoid recursion)
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
    const fullYear = (paramObj.year || ParamDefaults.defaultLeaderboardYear);
    const year = fullYear.substring(0, 4);
    const tier = (paramObj.tier || ParamDefaults.defaultTier);

    if ((year == "All") || (tier == "All")) { //TODO: tidy this up
      setDataEvent(dataEventInit); //(clear saved sub-events)

      const years = _.filter([ "2018/9", "2019/20", "2020/21", "2021/22", "Extra" ], inYear => (year == "All") || (inYear == fullYear));
      const tiers = _.filter([ "High", "Medium", "Low" ], inTier => (tier == "All") || (inTier == tier));

      const yearsAndTiers = _.flatMap(years, inYear => tiers.map(inTier => [ inYear, inTier ]));
 
      const fetchAll = Promise.all(yearsAndTiers.map(([ inYear, inTier ]) => {
        const subYear = inYear.substring(0, 4);
        return fetch(getUrl(dataSubEventKey, gender, subYear, inTier))
          .then((response: fetch.IsomorphicResponse) => {
            return response.ok ? 
            response.json().then((j: any) => { //(tag the tier in)
              if (tier == "All") j.tier = inTier;
              return j;
            }) : 
            Promise.resolve({ error: "No data available" });
          });
      }).concat(
        transferMode ? [
           fetch(`/api/getTransfers?${allParams.match(/transferMode=[0-9]+/) || ""}`).then((response: fetch.IsomorphicResponse) => {
            return response.ok ? response.json() : Promise.resolve({})
           })
        ] : []
      ));
      fetchAll.then((jsonsIn: any[]) => {
        const jsons = _.dropRight(jsonsIn, transferMode ? 1 : 0);
        setDataSubEvent({
          players: _.chain(jsons).map(d => (d.players || []).map((p: any) => { p.tier = d.tier; return p; }) || []).flatten().value(),
          confs: _.chain(jsons).map(d => d.confs || []).flatten().uniq().value(),
          transfers: (transferMode ? _.last(jsonsIn) : undefined) as Record<string, Array<string>>,
          lastUpdated: 0 //TODO use max?
        });
      })
    } else {
      if ((!dataEvent[dataSubEventKey]?.players?.length) || (currYear != fullYear) || (currGender != gender) || (currTier != tier)) {
        const oldCurrYear = currYear;
        const oldCurrGender = currGender;
        setCurrYear(fullYear);
        setCurrGender(gender)
        setCurrTier(tier);
        setDataSubEvent({ players: [], confs: [], lastUpdated: 0 }); //(set the spinner off)
        fetch(getUrl(dataSubEventKey, gender, year, tier))
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
    return <TeamEditorTable
      startingState={playerLeaderboardParamsRef.current || {}}
      dataEvent={dataSubEvent}
      onChangeState={onPlayerLeaderboardParamsChange}
    />
  }, [dataSubEvent]);

  const thumbnailUrl = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/thumbnails/player_leaderboard_thumbnail.png`;
  return <Container>
    <Head>
      <meta property="og:image" content={thumbnailUrl} />
      <meta name="twitter:image" content={thumbnailUrl} />
    </Head>
    <Row>
      <Col xs={12} className="text-center">
        <h3>Team Builder <span className="badge badge-pill badge-info">BETA!</span></h3>
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
export default TeamEditorPage;
