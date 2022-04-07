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
import { ParamPrefixes, TeamEditorParams, ParamDefaults } from '../utils/FilterModels';
import { HistoryManager } from '../utils/HistoryManager';
import TeamEditorTable, { TeamEditorStatsModel } from '../components/TeamEditorTable';
import GenericCollapsibleCard from '../components/shared/GenericCollapsibleCard';
import Footer from '../components/shared/Footer';
import HeaderBar from '../components/shared/HeaderBar';

// Utils:
import { UrlRouting } from "../utils/UrlRouting";
import Head from 'next/head';
import { LeaderboardUtils } from '../utils/LeaderboardUtils';

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
  const transferInit = transferMode ? {} as Record<string, Array<{f: string, t?:string}>> : undefined; //(start as empty list)

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
  const [ dataSubEvent, setDataSubEvent ] = useState({ players: [], confs: [], lastUpdated: 0 } as TeamEditorStatsModel);
  const [ currYear, setCurrYear ] = useState("");
  const [ currGender, setCurrGender ] = useState("");
  const [ currTier, setCurrTier ] = useState("");

  // Game filter

  function getRootUrl(params: TeamEditorParams) {
    return UrlRouting.getTeamEditorUrl(params);
  }

  const [ teamEditorParams, setTeamEditorParams ] = useState(
    UrlRouting.removedSavedKeys(allParams) as TeamEditorParams
  )
  const teamEditorParamsRef = useRef<TeamEditorParams>();
  teamEditorParamsRef.current = teamEditorParams;

  const onTeamEditorParamsChange = (rawParams: TeamEditorParams) => {
    const params = _.omit(rawParams, _.flatten([ // omit all defaults

      // Team Editor params

      (_.isNil(rawParams.offSeason) || rawParams.offSeason) ? [ 'offSeason' ] : [],
      (!rawParams.showPrevSeasons) ? [ 'showPrevSeasons' ] : [],
      (!rawParams.alwaysShowBench)? [  'alwaysShowBench' ] : [],
      (!rawParams.superSeniorsBack)? [  'superSeniorsBack' ] : [],

      (!rawParams.allEditOpen) ? [ 'allEditOpen' ] : [], 
        //(currently not used anywhere - will leave for now and decided whether to remove after more play testing)

      (!rawParams.deletedPlayers) ? [ 'deletedPlayers' ] : [],
      (!rawParams.disabledPlayers) ? [ 'disabledPlayers' ] : [],
      (!rawParams.addedPlayers) ? [ 'addedPlayers' ] : [],
      (!rawParams.editOpen) ? [ 'editOpen' ] : [],
      (!rawParams.overrides) ? [ 'overrides' ] : [],

      // Controls which players are visible in the "Add To Players"
      (_.isNil(rawParams.showOnlyCurrentYear) || rawParams.showOnlyCurrentYear) ? [ 'showOnlyCurrentYear' ] : [],
      (_.isNil(rawParams.showOnlyTransfers) || rawParams.showOnlyTransfers) ? [ 'showOnlyTransfers' ] : [],

      // "Add players from leaderboard" params

      (!rawParams.filter) ? [ 'filter' ] : [],
      (!rawParams.advancedFilter) ? [ 'advancedFilter' ] : [],
      (!rawParams.conf) ? [ 'conf' ] : [], //(unused now)
      (!rawParams.posClasses) ? [ 'posClasses' ] : [],

      //These aren't plumbed in:
      (!rawParams.t100) ? [ 't100' ] : [], //(TODO these 2 don't work)
      (!rawParams.confOnly) ? [ 'confOnly' ] : [],
      
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
    if (!_.isEqual(params, teamEditorParamsRef.current)) { //(to avoid recursion)
      const href = getRootUrl(params);
      const as = href;
      //TODO: this doesn't work if it's the same page (#91)
      // (plus adding the _current_ query to the history is a bit counter-intuitive)
      // (for intra-page, need to add to HistoryBounce page which will redirect back to force reload)
      // (need to figure out how to detect inter-page)
      // (for now use use "replace" vs "push" to avoid stupidly long browser histories)
      Router.replace(href, as, { shallow: true });
      setTeamEditorParams(params); // (to ensure the new params are included in links)
    }
  }

  useEffect(() => { // Process data selection change
    const paramObj = teamEditorParams;

    const gender = paramObj.gender || ParamDefaults.defaultGender;
    const fullYear = (paramObj.year || ParamDefaults.defaultLeaderboardYear);
    const tier = (paramObj.tier || "All");

    const transferYear = (LeaderboardUtils.getOffseasonOfYear(fullYear) || "").substring(0, 4);
    const prevYear = LeaderboardUtils.getPrevYear(fullYear || "")
    const transferYearPrev = (LeaderboardUtils.getOffseasonOfYear(prevYear) || "").substring(0, 4);
    const transferYears = [ transferYear, transferYearPrev ];

    if ((fullYear != currYear) || (gender != currGender) || (tier == currTier)) { // Only need to do this if the data source has changed
      setDataEvent(dataEventInit); //(clear saved sub-events)
      setCurrYear(fullYear);
      setCurrGender(gender)
      setCurrTier(tier);

      const fetchAll = LeaderboardUtils.getMultiYearPlayerLboards(
        "all", gender, fullYear, tier, transferYears, true
      );

      fetchAll.then((jsonsIn: any[]) => {
        const jsons = _.dropRight(jsonsIn, _.size(transferYears));
        setDataSubEvent({
          players: _.chain(jsons).map(d => (d.players || []).map((p: any) => { p.tier = d.tier; return p; }) || []).flatten().value(),
          confs: _.chain(jsons).map(d => d.confs || []).flatten().uniq().value(),
          transfers: _.drop(jsonsIn, _.size(jsons)) as Record<string, Array<{f: string, t?: string}>>[],
          lastUpdated: 0 //TODO use max?
        });
      });
    }
  }, [ teamEditorParams ]);

  // View

  /** Only rebuild the table if the data changes */
  const table = React.useMemo(() => {
    return <TeamEditorTable
      startingState={teamEditorParamsRef.current || {}}
      dataEvent={dataSubEvent}
      onChangeState={onTeamEditorParamsChange}
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
        <h3>Team Builder <span className="badge badge-pill badge-info">ALPHA!</span></h3>
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
    <Footer dateOverride={dataEvent.all?.lastUpdated} year={teamEditorParams.year} gender={teamEditorParams.gender} server={server}/>
  </Container>;
}
export default TeamEditorPage;
