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
import { ParamPrefixes, TeamLeaderboardParams, ParamDefaults, GameFilterParams } from '../utils/FilterModels';
import { HistoryManager } from '../utils/HistoryManager';
import TeamLeaderboardTable, { TeamLeaderboardStatsModel } from '../components/TeamLeaderboardTable';
import GenericCollapsibleCard from '../components/shared/GenericCollapsibleCard';
import Footer from '../components/shared/Footer';
import HeaderBar from '../components/shared/HeaderBar';

// Utils:
import { UrlRouting } from "../utils/UrlRouting";
import { dataLastUpdated } from '../utils/internal-data/dataLastUpdated';

const TeamLeaderboardPage: NextPage<{}> = () => {

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

  // "/" used to be OnOffAnalyzer, but now it's team leaderboard ... handle redirecting old links
  if ((allParams.indexOf("&team=") >= 0) || (allParams.indexOf("&team=") >= 0)) {
    console.log(`(redirecting old link [${allParams}]`);
    const newUrl = UrlRouting.getGameUrl(UrlRouting.removedSavedKeys(allParams) as GameFilterParams, {});
    window.location.href = newUrl;
    return <span>(redirecting old link)</span>;
  }

  // Team Stats interface

  const dataEventInit = {
    all: { players: [] as any[], confs: [] as string[], lastUpdated: 0 },
    t100: { players: [] as any[], confs: [] as string[], lastUpdated: 0 },
    conf: { players: [] as any[], confs: [] as string[], lastUpdated: 0 }
  };

  const [ gaInited, setGaInited ] = useState(false);
  const [ dataEvent, setDataEvent ] = useState(dataEventInit);
  const [ dataSubEvent, setDataSubEvent ] = useState({ teams: [], confs: [], lastUpdated: 0 } as TeamLeaderboardStatsModel);
  const [ currYear, setCurrYear ] = useState("2020/21"); //TODO: remove this once ready to use current year
  const [ currGender, setCurrGender ] = useState("Men");

  // Game filter

  function getRootUrl(params: TeamLeaderboardParams) {
    return UrlRouting.getTeamLeaderboardUrl(params);
  }

  const [ teamLeaderboardParams, setTeamLeaderboardParams ] = useState(
    UrlRouting.removedSavedKeys(allParams) as TeamLeaderboardParams
  )
  const TeamLeaderboardParamsRef = useRef<TeamLeaderboardParams>();
  TeamLeaderboardParamsRef.current = teamLeaderboardParams;

  const getUrl = (oppo: string, gender: string, subYear: string, inTier: string) => {
    if (ParamDefaults.defaultYear.startsWith(subYear)) { // Access from dynamic storage
      return `/api/getLeaderboard?src=teams&oppo=${oppo}&gender=${gender}&year=${subYear}&tier=${inTier}`;
    } else { //archived
      return `/leaderboards/lineups/teams_${oppo}_${gender}_${subYear}_${inTier}.json`;
    }
  }

  const onTeamLeaderboardParamsChange = (rawParams: TeamLeaderboardParams) => {
    const params = _.omit(rawParams, _.flatten([ // omit all defaults
      (!rawParams.conf) ? [ 'conf' ] : [],

      (rawParams.qualityWeight == ParamDefaults.defaultTeamLboardQualityWeight) ? [ `qualityWeight` ]  : [],
      (rawParams.wabWeight == ParamDefaults.defaultTeamLboardWabWeight) ? [ `wabWeight` ]  : [],
      (rawParams.waeWeight == ParamDefaults.defaultTeamLboardWaeWeight) ? [ `waeWeight` ]  : [],
      (rawParams.domWeight == ParamDefaults.defaultTeamLboardDomWeight) ? [ `domWeight` ]  : [],
      (rawParams.timeWeight == ParamDefaults.defaultTeamLboardTimeWeight) ? [ `timeWeight` ]  : [],

      (rawParams.qualityWeight == rawParams.pinQualityWeight) ? [ `pinQualityWeight` ]  : [],
      (rawParams.wabWeight == rawParams.pinWabWeight) ? [ `pinWabWeight` ]  : [],
      (rawParams.waeWeight == rawParams.pinWaeWeight) ? [ `pinWaeWeight` ]  : [],
      (rawParams.domWeight == rawParams.pinDomWeight) ? [ `pinDomWeight` ]  : [],
      (rawParams.timeWeight == rawParams.pinTimeWeight) ? [ `pinTimeWeight` ]  : [],

    ]));

    if (!_.isEqual(params, TeamLeaderboardParamsRef.current)) { //(to avoid recursion)
      const href = getRootUrl(params);
      const as = href;
      //TODO: this doesn't work if it's the same page (#91)
      // (plus adding the _current_ query to the history is a bit counter-intuitive)
      // (for intra-page, need to add to HistoryBounce page which will redirect back to force reload)
      // (need to figure out how to detect inter-page)
      // (for now use use "replace" vs "push" to avoid stupidly long browser histories)
      Router.replace(href, as, { shallow: true });
      setTeamLeaderboardParams(params); // (to ensure the new params are included in links)
    }
  }

  useEffect(() => { // Process data selection change
    const paramObj = teamLeaderboardParams;
    const dataSubEventKey = "all";

    const gender = paramObj.gender || ParamDefaults.defaultGender;
    const fullYear = (paramObj.year || ParamDefaults.defaultLeaderboardYear);
    const year = fullYear.substring(0, 4);
    const tier: string = "All"; //(paramObj.tier || "All"); //(in this page, tier is really a diag param)

    if ((year == "All") || (tier == "All")) { //TODO: tidy this up
      setDataEvent(dataEventInit); //(clear saved sub-events)

      const years = _.filter([ "2018/9", "2019/20", "2020/21", "2021/22" ], inYear => (year == "All") || (inYear == fullYear));
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
      }));
      fetchAll.then((jsons: any[]) => {
        setDataSubEvent({
          teams: _.chain(jsons).map(d => (d.teams || [])).flatten().value(),
          confs: _.chain(jsons).map(d => d.confs || []).flatten().uniq().value(),
          bubbleOffense: _.chain(jsons).take(1).map(d => d.bubbleOffense || []).flatten().value(),
          bubbleDefense: _.chain(jsons).take(1).map(d => d.bubbleDefense || []).flatten().value(),
          lastUpdated: _.chain(jsons).map(d => d.lastUpdated).max().value() 
        });
      })
    } else {
      if ((!dataEvent[dataSubEventKey]?.players?.length) || (currYear != fullYear) || (currGender != gender)) {
        const oldCurrYear = currYear;
        const oldCurrGender = currGender;
        setCurrYear(fullYear);
        setCurrGender(gender)
        setDataSubEvent({ teams: [], confs: [], lastUpdated: 0 }); //(set the spinner off)
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
  }, [ teamLeaderboardParams ]);

  // View

  /** Only rebuild the table if the data changes */
  const table = React.useMemo(() => {
    return <TeamLeaderboardTable
      startingState={TeamLeaderboardParamsRef.current || {}}
      dataEvent={dataSubEvent}
      onChangeState={onTeamLeaderboardParamsChange}
    />
  }, [dataSubEvent]);

  return <Container>
    <Row>
      <Col xs={12} className="text-center">
        <h3>Build Your Own T25! <span className="badge badge-pill badge-info">BETA!</span></h3>
      </Col>
    </Row>
    <Row className="border-bottom">
      <HeaderBar
        common={{ gender: currGender, year: (currYear == "All") ? undefined : currYear }}
        thisPage={`${ParamPrefixes.game}_leaderboard`}
        />
    </Row>
    <Row className="mt-3">
      {table}
    </Row>
    <Footer dateOverride={dataEvent.all?.lastUpdated} year={teamLeaderboardParams.year} gender={teamLeaderboardParams.gender} server={server}/>
  </Container>;
}
export default TeamLeaderboardPage;
