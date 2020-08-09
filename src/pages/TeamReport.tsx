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
import TeamReportFilter from '../components/TeamReportFilter';
import { ParamPrefixes, GameFilterParams, LineupFilterParams, TeamReportFilterParams, ParamDefaults } from '../utils/FilterModels';
import { HistoryManager } from '../utils/HistoryManager';
import TeamReportStatsTable from '../components/TeamReportStatsTable';
import { LineupStatsModel } from '../components/LineupStatsTable';
import { RosterStatsModel } from '../components/RosterStatsModel';
import { TeamStatsModel } from '../components/TeamStatsModel';
import GenericCollapsibleCard from '../components/shared/GenericCollapsibleCard';
import Footer from '../components/shared/Footer';
import HeaderBar from '../components/shared/HeaderBar';

// Utils:
import { UrlRouting } from "../utils/UrlRouting";

const TeamReportPage: NextPage<{}> = () => {

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

  const [ teamReportFilterParams, setTeamReportFilterParams ] = useState(
    UrlRouting.removedSavedKeys(allParams) as TeamReportFilterParams
  )
  function getRootUrl(params: TeamReportFilterParams) {
    return UrlRouting.getTeamReportUrl(params);
  }

  const onTeamReportFilterParamsChange = (rawParams: TeamReportFilterParams) => {
    const params = _.omit(rawParams, _.flatten([ // omit all defaults
      (rawParams.showComps == ParamDefaults.defaultShowComps) ? [ 'showComps' ] : [],
      (rawParams.repOnOffDiagMode == "0") ? [ 'repOnOffDiagMode' ] : [],
      (rawParams.rapmDiagMode == "") ? [ 'rapmDiagMode' ] : [],
    ]));

    if (!_.isEqual(params, teamReportFilterParams)) { //(to avoid recursion)
      const href = getRootUrl(params);
      const as = href;
      //TODO: this doesn't work if it's the same page (#91)
      // (plus adding the _current_ query to the history is a bit counter-intuitive)
      // (for intra-page, need to add to HistoryBounce page which will redirect back to force reload)
      // (need to figure out how to detect inter-page)
      // (for now use use "replace" vs "push" to avoid stupidly long browser histories)
      Router.replace(href, as, { shallow: true });
      setTeamReportFilterParams(params); // (to ensure the new params are included in links)
    }
  }

  // View

  function maybeShowDocs() {
    if (!_.startsWith(server, "cbb-on-off-analyzer")) {
      return "https://hoop-explorer.blogspot.com/2020/03/understanding-team-report-onoff-page.html";
    } else {
      return undefined;
    }
  }

  return <Container>
    <Row>
      <Col xs={12} className="text-center">
        <h3>CBB Team On/Off Report Tool <span className="badge badge-pill badge-info">BETA!</span></h3>
      </Col>
    </Row>
    <Row>
      <HeaderBar
        common={teamReportFilterParams}
        thisPage={ParamPrefixes.report}
        />
    </Row>
    <Row>
      <GenericCollapsibleCard
        title="Team Report Filter"
        summary={HistoryManager.teamReportFilterSummary(teamReportFilterParams)}
      >
        <TeamReportFilter
          onStats={injectStats}
          startingState={teamReportFilterParams}
          onChangeState={onTeamReportFilterParamsChange}
        />
      </GenericCollapsibleCard>
    </Row>
    <Row>
      <GenericCollapsibleCard title="Team Analysis" helpLink={maybeShowDocs()}>
        <TeamReportStatsTable
          startingState={teamReportFilterParams}
          dataEvent={dataEvent}
          onChangeState={onTeamReportFilterParamsChange}
        />
      </GenericCollapsibleCard>
    </Row>
    <Footer year={teamReportFilterParams.year} gender={teamReportFilterParams.gender} server={server}/>
  </Container>;
}
export default TeamReportPage;
