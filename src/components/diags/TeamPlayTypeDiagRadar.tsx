// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

// Utils
import { PosFamilyNames, PlayTypeUtils, TopLevelPlayType } from "../../utils/stats/PlayTypeUtils";
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { PlayTypeDiagUtils } from "../../utils/tables/PlayTypeDiagUtils";
import { CbbColors } from "../../utils/CbbColors";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "../GenericTable";
import { PureStatSet, Statistic, IndivStatSet, TeamStatSet, RosterStatsByCode, StatModels } from '../../utils/StatModels';

type Props = {
  title: string,
  players: Array<IndivStatSet>,
  rosterStatsByCode: RosterStatsByCode,
  teamStats: TeamStatSet,
  teamSeasonLookup: string,
  quickSwitchOptions?: Props[]
  showHelp: boolean
};
const TeamPlayTypeDiagRadar: React.FunctionComponent<Props> = ({
  title, players: playersIn, rosterStatsByCode, teamStats: teamStatsIn, teamSeasonLookup, quickSwitchOptions, showHelp
}) => {
  const [ quickSwitch, setQuickSwitch ] = useState<string | undefined>(undefined);
  const players = (quickSwitch ? 
    _.find(quickSwitchOptions || [], opt => opt.title == quickSwitch)?.players
    : playersIn) || [];
  const teamStats = (quickSwitch ? 
    _.find(quickSwitchOptions || [], opt => opt.title == quickSwitch)?.teamStats
    : teamStatsIn) || StatModels.emptyTeam();

  const reorderedPosVsPosAssistNetwork = PlayTypeUtils.buildCategorizedAssistNetworks("playsPct", true,
    players, rosterStatsByCode, teamStats
  );
  const topLevelPlayTypeAnalysis = PlayTypeUtils.buildTopLevelPlayStyles(
    reorderedPosVsPosAssistNetwork, players, teamStats
  );

  const tooltipBuilder = (id: string, title: string, tooltip: string) =>
    <OverlayTrigger placement="auto" overlay={
      <Tooltip id={id + "Tooltip"}>{tooltip}</Tooltip>
    }><i>{title}</i></OverlayTrigger>;

  const quickSwitchBuilder = _.map(quickSwitchOptions || [], opt => opt.title).map((t, index) => {
    return <div key={`quickSwitch-${index}`}>[<a href="#" onClick={e => {
      e.preventDefault();
      setQuickSwitch(quickSwitch == t ? undefined : t); //(ie toggle)
    }}>{t}</a>]&nbsp;</div>
  });

  return <span>
    {/*JSON.stringify(_.chain(teamStats).toPairs().filter(kv => kv[0].indexOf("trans") >= 0).values(), tidyNumbers, 3)*/}
    <br/>
    <span style={{ display: "flex" }}>
      <b>Scoring Analysis: [{quickSwitch || title}]</b>
      {_.isEmpty(quickSwitchOptions) ? null : <div style={{ display: "flex" }}>&nbsp;|&nbsp;<i>quick-toggles:</i>&nbsp;{quickSwitchBuilder}</div>}
    </span>
    <br/>
    <br/>
    <Container>
      <Col xs={10}>
        {_.toPairs(topLevelPlayTypeAnalysis).map(o => <span>{o[0]}: {(o[1]*100).toFixed(1)}<br/></span>)}
        SUM = [{_.chain(topLevelPlayTypeAnalysis).values().sum().value()}]
      </Col>
    </Container>
  </span>;
};
export default TeamPlayTypeDiagRadar;
