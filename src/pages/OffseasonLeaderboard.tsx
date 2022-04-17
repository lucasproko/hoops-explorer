// Google analytics:
import { initGA, logPageView } from '../utils/GoogleAnalytics';

// React imports:
import React, { useState, useEffect, useRef } from 'react';
import Router, { useRouter } from 'next/router';

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
import { ParamPrefixes, OffseasonLeaderboardParams, ParamDefaults } from '../utils/FilterModels';
import { TeamEditorStatsModel } from '../components/TeamEditorTable';
import Footer from '../components/shared/Footer';
import HeaderBar from '../components/shared/HeaderBar';

// Utils:
import { UrlRouting } from "../utils/UrlRouting";
import Head from 'next/head';
import { LeaderboardUtils, TransferModel } from '../utils/LeaderboardUtils';
import OffSeasonLeaderboardTable from '../components/OffseasonLeaderboardTable';

type Props = {
  testMode?: boolean //works around SSR issues, see below
};
const OffseasonLeaderboardPage: NextPage<Props> = ({testMode}) => {

  const isServer = () => typeof window === `undefined`;    
  if (isServer() && !testMode) return null; //(don't render server-side)

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
  const [ dataSubEvent, setDataSubEvent ] = useState({ players: [], confs: [], lastUpdated: 0 } as TeamEditorStatsModel);
  const [ currYear, setCurrYear ] = useState("");
  const [ currGender, setCurrGender ] = useState("");
  const [ currTier, setCurrTier ] = useState("");

  // Game filter

  function getRootUrl(params: OffseasonLeaderboardParams) {
    return UrlRouting.getOffseasonLeaderboard(params);
  }

  const [ offseasonLeaderboardParams, setOffseasonLeaderboardParams ] = useState(
    UrlRouting.removedSavedKeys(allParams) as OffseasonLeaderboardParams
  )
  const offseasonLeaderboardParamsRef = useRef<OffseasonLeaderboardParams>();
  offseasonLeaderboardParamsRef.current = offseasonLeaderboardParams;

  const onOffseasonLeaderboardParamsChange = (rawParams: OffseasonLeaderboardParams) => {
    const params = _.omit(rawParams, _.flatten([ // omit all defaults

      (!rawParams.teamView) ? [ "teamView" ] : [],
      (!rawParams.confs) ? [ "confs" ] : [],

    ]));

    if (rawParams.year && (rawParams.year != "2022/23")) { //TODO: un-hardwire this
      const newUrl = UrlRouting.getTeamLeaderboardUrl({ year: rawParams.year });
      if (typeof window !== `undefined`) window.location.href = newUrl;

    } else if (!_.isEqual(params, offseasonLeaderboardParamsRef.current)) { //(to avoid recursion)
      const href = getRootUrl(params);
      const as = href;
      //TODO: this doesn't work if it's the same page (#91)
      // (plus adding the _current_ query to the history is a bit counter-intuitive)
      // (for intra-page, need to add to HistoryBounce page which will redirect back to force reload)
      // (need to figure out how to detect inter-page)
      // (for now use use "replace" vs "push" to avoid stupidly long browser histories)
      Router.replace(href, as, { shallow: true });
      setOffseasonLeaderboardParams(params); // (to ensure the new params are included in links)
    }
  }

  useEffect(() => { // Process data selection change
    const paramObj = offseasonLeaderboardParams;

    const gender = paramObj.gender || ParamDefaults.defaultGender;
    const fullYear = LeaderboardUtils.getPrevYear(paramObj.year || "2022/23"); //TODO: fix this
    const tier = (paramObj.tier || "All");

    const transferYear = (LeaderboardUtils.getOffseasonOfYear(fullYear) || "").substring(0, 4);
    const prevYear = LeaderboardUtils.getPrevYear(fullYear)
    const transferYearPrev = (LeaderboardUtils.getOffseasonOfYear(prevYear) || "").substring(0, 4);
    const transferYears = [ transferYear, transferYearPrev ];

    if ((fullYear != currYear) || (gender != currGender) || (tier != currTier)) { // Only need to do this if the data source has changed
      setCurrYear(fullYear);
      setCurrGender(gender)
      setCurrTier(tier);

      const fetchAll = LeaderboardUtils.getMultiYearPlayerLboards(
        "all", gender, fullYear, tier, transferYears, [ prevYear ]
      );

      fetchAll.then((jsonsIn: any[]) => {
        const jsons = _.dropRight(jsonsIn, _.size(transferYears));
        setDataSubEvent({
          players: _.chain(jsons).map(d => (d.players || []).map((p: any) => { p.tier = d.tier; return p; }) || []).flatten().value(),
          confs: _.chain(jsons).map(d => d.confs || []).flatten().uniq().value(),
          transfers: _.drop(jsonsIn, _.size(jsons)) as Record<string, Array<TransferModel>>[],
          lastUpdated: 0 //TODO use max?
        });
      });
    }
  }, [ offseasonLeaderboardParams ]);

  // View

  /** Only rebuild the table if the data changes */
  const table = React.useMemo(() => {
    return <OffSeasonLeaderboardTable
      startingState={offseasonLeaderboardParamsRef.current || {}}
      dataEvent={dataSubEvent}
      onChangeState={onOffseasonLeaderboardParamsChange}
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
        <h3>Off-Season Leaderboard <span className="badge badge-pill badge-info">IN DEV!</span></h3>
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
    <Footer dateOverride={dataSubEvent.lastUpdated} year={offseasonLeaderboardParams.year} gender={offseasonLeaderboardParams.gender} server={server}/>
  </Container>;
}
export default OffseasonLeaderboardPage;
