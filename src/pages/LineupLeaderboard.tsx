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
import { ParamPrefixes, LineupLeaderboardParams, ParamDefaults } from '../utils/FilterModels';
import { HistoryManager } from '../utils/HistoryManager';
import LineupLeaderboardTable, { LineupLeaderboardStatsModel } from '../components/LineupLeaderboardTable';
import GenericCollapsibleCard from '../components/shared/GenericCollapsibleCard';
import Footer from '../components/shared/Footer';
import HeaderBar from '../components/shared/HeaderBar';

// Utils:
import { UrlRouting } from "../utils/UrlRouting";

const LineupLeaderboardPage: NextPage<{}> = () => {

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
    all: { lineups: [], confs: [], lastUpdated: 0 },
    t100: { lineups: [], confs: [], lastUpdated: 0 },
    conf: { lineups: [], confs: [], lastUpdated: 0 }
  });
  const [ dataSubEvent, setDataSubEvent ] = useState({ lineups: [], confs: [], lastUpdated: 0 } as LineupLeaderboardStatsModel);
  const [ currYear, setCurrYear ] = useState("");

  // Game filter

  function getRootUrl(params: LineupLeaderboardParams) {
    return UrlRouting.getLineupLeaderboardUrl(params);
  }

  const [ lineupLeaderboardParams, setLineupLeaderboardParams ] = useState(
    UrlRouting.removedSavedKeys(allParams) as LineupLeaderboardParams
  )

  const onLineupLeaderboardParamsChange = (rawParams: LineupLeaderboardParams) => {
    const params = _.omit(rawParams, _.flatten([ // omit all defaults
      (!rawParams.t100) ? [ 't100' ] : [],
      (!rawParams.confOnly) ? [ 'confOnly' ] : [],
      (!rawParams.filter) ? [ 'filter' ] : [],
      (!rawParams.conf) ? [ 'conf' ] : [],

      (rawParams.minPoss == ParamDefaults.defaultLineupLboardMinPos) ? [ 'minPoss' ] : [],
      (rawParams.maxTableSize == ParamDefaults.defaultLineupLboardMaxTableSize) ? [ 'maxTableSize' ] : [],
      (rawParams.sortBy == ParamDefaults.defaultLineupLboardSortBy) ? [ 'sortBy' ] : [],

      (rawParams.showLineupLuckDiags == ParamDefaults.defaultLineupLboardLuckDiagMode) ? [ 'showLineupLuckDiags' ] : [],
    ]));
    if (!_.isEqual(params, lineupLeaderboardParams)) { //(to avoid recursion)
      const href = getRootUrl(params);
      const as = href;
      //TODO: this doesn't work if it's the same page (#91)
      // (plus adding the _current_ query to the history is a bit counter-intuitive)
      // (for intra-page, need to add to HistoryBounce page which will redirect back to force reload)
      // (need to figure out how to detect inter-page)
      // (for now use use "replace" vs "push" to avoid stupidly long browser histories)
      Router.replace(href, as, { shallow: true });
      setLineupLeaderboardParams(params); // (to ensure the new params are included in links)
    }
  }

  useEffect(() => { // Process data selection change
    const paramObj = lineupLeaderboardParams;
    const dataSubEventKey = paramObj.t100 ?
      "t100" : (paramObj.confOnly ? "conf" : "all");

    const gender = paramObj.gender || ParamDefaults.defaultGender;
    const year = (paramObj.year || ParamDefaults.defaultYear).substring(0, 4);

    if (year == "All") { //TODO: tidy this up

      const years = [ "2018/9", "2019/20", "Extra" ];
      const fetchAll = Promise.all(years.map(tmpYear => tmpYear.substring(0, 4)).map((subYear) => {
        return fetch(`/leaderboards/lineups/lineups_${dataSubEventKey}_${gender}_${subYear}.json`)
          .then((response: fetch.IsomorphicResponse) => {
            return response.json();
          });
      }));
      fetchAll.then((jsons: any[]) => {
        setDataSubEvent({
          lineups: _.chain(jsons).map(d => d.lineups || []).flatten().value(),
          confs: _.chain(jsons).map(d => d.players || []).flatten().value(),
          lastUpdated: 0 //TODO use max?
        });
      })
    } else {
      if ((!dataEvent[dataSubEventKey]?.lineups?.length) || (currYear != year)) {
        setCurrYear(year);
        setDataSubEvent({ lineups: [], confs: [], lastUpdated: 0 }); //(set the spinner off)
        fetch(`/leaderboards/lineups/lineups_${dataSubEventKey}_${gender}_${year}.json`)
          .then((response: fetch.IsomorphicResponse) => {
            return response.json().then((json: any) => {
              setDataEvent({ ...dataEvent, [dataSubEventKey]: json });
              setDataSubEvent(json);
            });
          });
      } else if (dataSubEvent != dataEvent[dataSubEventKey]) {
        setDataSubEvent(dataEvent[dataSubEventKey]);
      }
    }
  }, [ lineupLeaderboardParams ]);

  // View

  /** Only rebuild the table if the data changes */
  const table = React.useMemo(() => {
    return <LineupLeaderboardTable
      startingState={lineupLeaderboardParams}
      dataEvent={dataSubEvent}
      onChangeState={onLineupLeaderboardParamsChange}
    />
  }, [dataSubEvent]);

  return <Container>
    <Row>
      <Col xs={12} className="text-center">
        <h3>CBB T300 Lineup Leaderboard <span className="badge badge-pill badge-info">BETA!</span></h3>
      </Col>
    </Row>
    <Row className="border-bottom">
      <HeaderBar
        common={{}}
        thisPage={`${ParamPrefixes.lineup}_leaderboard`}
        />
    </Row>
    <Row className="mt-3">
      {table}
    </Row>
    <Footer dateOverride={dataEvent.all?.lastUpdated} year={lineupLeaderboardParams.year} gender={lineupLeaderboardParams.gender} server={server}/>
  </Container>;
}
export default LineupLeaderboardPage;
