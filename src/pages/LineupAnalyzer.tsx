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
import LineupFilter from '../components/LineupFilter';
import { ParamPrefixes, GameFilterParams, LineupFilterParams, ParamDefaults } from '../utils/FilterModels';
import { HistoryManager } from '../utils/HistoryManager';
import LineupStatsTable, { LineupStatsModel } from '../components/LineupStatsTable';
import { RosterStatsModel } from '../components/RosterStatsTable';
import { TeamStatsModel } from '../components/TeamStatsTable';
import GenericCollapsibleCard from '../components/shared/GenericCollapsibleCard';
import Footer from '../components/shared/Footer';
import HeaderBar from '../components/shared/HeaderBar';

// Utils:
import { UrlRouting } from "../utils/UrlRouting";

const LineupAnalyzerPage: NextPage<{}> = () => {

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
    lineupStats: {} as LineupStatsModel,
    teamStats: {on: {}, off: {}, baseline: {}} as TeamStatsModel,
    rosterStats: {on: [], off: [], baseline: []} as RosterStatsModel
  });

  const injectStats = (lineupStats: LineupStatsModel, teamStats: TeamStatsModel, rosterStats: RosterStatsModel) => {
    setDataEvent({ lineupStats, teamStats, rosterStats });
  }

  // Game filter

  const allParams = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "" : window.location.search;

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  const [ lineupFilterParams, setLineupFilterParams ] = useState(
    UrlRouting.removedSavedKeys(allParams) as LineupFilterParams
  )
  const lineupFilterParamsRef = useRef<LineupFilterParams>();
  lineupFilterParamsRef.current = lineupFilterParams;

  function getRootUrl(params: LineupFilterParams) {
    return UrlRouting.getLineupUrl(params, {});
  }
  const [ shouldForceReload, setShouldForceReload ] = useState(0 as number);

  const onLineupFilterParamsChange = (rawParams: LineupFilterParams) => {
    const params = _.omit(rawParams, _.flatten([ // omit all defaults
      (rawParams.decorate == ParamDefaults.defaultLineupDecorate) ? [ 'decorate' ] : [],
      (rawParams.showTotal == ParamDefaults.defaultLineupShowTotal) ? [ 'showTotal' ] : [],
      _.isEqual(rawParams.luck, ParamDefaults.defaultLuckConfig) ? [ 'luck' ] : [],
      !rawParams.lineupLuck ? [ 'lineupLuck' ] : [],
      (rawParams.showLineupLuckDiags == ParamDefaults.defaultOnOffLuckDiagMode) ? [ 'showLineupLuckDiags' ] : [],
      (rawParams.aggByPos == ParamDefaults.defaultLineupAggByPos) ? [ 'aggByPos' ] : [],
    ]));
    if (!_.isEqual(params, lineupFilterParamsRef.current)) { //(to avoid recursion)

      //TODO: example code:
      // if (params.lineupLuck != lineupFilterParamsRef.current.lineupLuck) {
      //   setShouldForceReload(t => t + 1);
      // }
      const href = getRootUrl(params);
      const as = href;
      //TODO: this doesn't work if it's the same page (#91)
      // (plus adding the _current_ query to the history is a bit counter-intuitive)
      // (for intra-page, need to add to HistoryBounce page which will redirect back to force reload)
      // (need to figure out how to detect inter-page)
      // (for now use use "replace" vs "push" to avoid stupidly long browser histories)
      Router.replace(href, as, { shallow: true });
      setLineupFilterParams(params); // (to ensure the new params are included in links)
    }
  }

  // View

  function maybeShowDocs() {
    if (!_.startsWith(server, "cbb-on-off-analyzer")) {
      return "https://hoop-explorer.blogspot.com/2020/07/understanding-lineup-analyzer-page.html";
    } else {
      return undefined;
    }
  }

  /** Only rebuild the table if the data changes */
  const table = React.useMemo(() => {
    return  <GenericCollapsibleCard minimizeMargin={true} title="Lineup Analysis" helpLink={maybeShowDocs()}>
      <LineupStatsTable
        startingState={lineupFilterParamsRef.current || {}}
        dataEvent={dataEvent}
        onChangeState={onLineupFilterParamsChange}
      />
    </GenericCollapsibleCard>
  }, [ dataEvent ]);

  return <Container>
    <Row>
      <Col xs={12} className="text-center">
        <h3>CBB Lineup Analysis Tool <span className="badge badge-pill badge-info">BETA!</span></h3>
      </Col>
    </Row>
    <Row>
      <HeaderBar
        common={lineupFilterParams}
        thisPage={ParamPrefixes.lineup}
        />
    </Row>
    <Row>
      <GenericCollapsibleCard
        minimizeMargin={false}
        title="Team and Game Filter"
        summary={HistoryManager.lineupFilterSummary(lineupFilterParams)}
      >
        <LineupFilter
          onStats={injectStats}
          startingState={lineupFilterParams}
          onChangeState={onLineupFilterParamsChange}
          forceReload1Up={shouldForceReload}
        />
      </GenericCollapsibleCard>
    </Row>
    <Row>
      {table}
    </Row>
    <Footer year={lineupFilterParams.year} gender={lineupFilterParams.gender} server={server}/>
  </Container>;
}
export default LineupAnalyzerPage;
