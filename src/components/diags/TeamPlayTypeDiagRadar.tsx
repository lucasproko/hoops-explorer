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
import { PosFamilyNames, PlayTypeUtils, TopLevelPlayTypes } from "../../utils/stats/PlayTypeUtils";
import { PositionUtils } from "../../utils/stats/PositionUtils";
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { PlayTypeDiagUtils } from "../../utils/tables/PlayTypeDiagUtils";
import { CbbColors } from "../../utils/CbbColors";
import { LineupUtils } from "../../utils/stats/LineupUtils";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "../GenericTable";
import { PureStatSet, Statistic, IndivStatSet, TeamStatSet } from '../../utils/StatModels';

const tidyNumbers = (k: string, v: any) => {
  if (_.isNumber(v)) {
    const numStr = v.toFixed(3);
    if (_.endsWith(numStr, ".000")) {
      return numStr.split(".")[0];
    } else {
      return parseFloat(numStr);
    }
  } else {
    return v;
  }
}

type Props = {
  title: string,
  players: Array<Record<string, any>>,
  rosterStatsByCode: Record<string, any>,
  teamStats: Record<string, any>,
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
    : teamStatsIn) || [];

  // Repeat the logic in PlayerTypeTypeDiagView:

 //START: code1 to move (plus can share this simply by switching between playsPct/teamPossessions and scoringPct/teamScoringPossessions)

   //(use pure possessions and not + assists because the team is "closed" unlike one player)
    const teamPossessions =
    (teamStats.total_off_fga?.value || 0) + 0.475*(teamStats.total_off_fta?.value || 0) 
      + (teamStats.total_off_to?.value || 0);

    const teamScoringPossessions =
      (teamStats.total_off_fgm?.value || 0) + 0.475*(teamStats.total_off_fta?.value || 0);
    //(use pure scoring possessions and not + assists because the team is "closed" unlike one player)

  const teamTotalAssists = teamStats.total_off_assist?.value || 0;
    //(use team total assists for consistency with individual chart)

  const filterCodes = undefined as Set<string> | undefined; // = new Set(["ErAyala", "AqSmart"])
  const filteredPlayers = filterCodes ? players.filter(pl => {
    const code = pl.player_array?.hits?.hits?.[0]?._source?.player?.code || pl.key;
    return filterCodes.has(code);
  }) : players;

  const posCategoryAssistNetworkVsPlayer = _.chain(filteredPlayers).map((player, ix) => {
    const allPlayers = PlayTypeUtils.buildPlayerAssistCodeList(player);
    const separateHalfCourt = true; //(half court vs transition/scramble)
    const playerStyle = PlayTypeUtils.buildPlayerStyle("playsPct",
      player, teamPossessions, teamTotalAssists, separateHalfCourt
    );
    const playerAssistNetwork = allPlayers.map((p) => {
      const [ info, ignore ] = PlayTypeUtils.buildPlayerAssistNetwork(
        p, player, playerStyle.totalScoringPlaysMade, playerStyle.totalAssists,
        rosterStatsByCode
      );
      return { code: p, ...info };
    });
    const posCategoryAssistNetwork = PlayTypeUtils.buildPosCategoryAssistNetwork(
      playerAssistNetwork, rosterStatsByCode, undefined
    );

    const code = player.player_array?.hits?.hits?.[0]?._source?.player?.code || player.key;

// console.log(`${code} ... vs ... ${JSON.stringify(playerAssistNetwork, tidyNumbers, 3)}`);

    return [ code, { posCategoryAssistNetwork: posCategoryAssistNetwork, playerStyle: playerStyle } ];
  }).fromPairs().value();

  // This gets us to:
  // [1] (player)[ { [pos]: <shot-type-stats> } ]   (pos=bh|wing|big)

  // Then buildPosCategoryAssistNetwork goes:
  // [2] player, (other_players)[ <shot-type-stats> ] => { [pos]: <shot-type-stats> }
  // (and "player" is only used to inject examples in)

  // So transform [1] to (pos)(players)[ <shot-type-stats> ] and then use [2] on each pos
  // and that gives us a pos vs pos -> <shot-type-stats> as desired!

  const posVsPosAssistNetwork = _.chain(PosFamilyNames).map((pos, ix) => {
    const perPlayer = _.chain(posCategoryAssistNetworkVsPlayer).mapValues((perPlayerInfo, playerCode) => {
      const posCategoryAssistNetwork = perPlayerInfo.posCategoryAssistNetwork;
        // ^ For each player, the stats to/from the position

      // For each player: get a single pos category stats
      const posStats = posCategoryAssistNetwork.filter((net: any) => net?.order == ix)?.[0] || undefined;
      return posStats ? [ {
        ...posStats,
        code: playerCode
      } ] : [];
    }).values().flatten().value();

    // This is now "for each pos, a list of player stats", so we can reapply, to get "for each pos a list of pos stats"
    const posPosCatAssistNetwork = PlayTypeUtils.buildPosCategoryAssistNetwork(
      perPlayer, rosterStatsByCode, ix,
    ); // pos vs <shot-type-stats> (order tells you which)

//console.log(`${pos} ... vs ... ${JSON.stringify(perPlayer, tidyNumbers, 3)}`);

    // Unassisted/scramble/transition: similar:
    const posVsPosOtherTypes = _.chain([ "unassisted", "assisted", "transition", "scramble", "transitionAssisted", "scrambleAssisted" ]).map(key => {

      const perPlayer = _.chain(posCategoryAssistNetworkVsPlayer).mapValues((perPlayerInfo, playerCode) => {
        const playerStyle = perPlayerInfo.playerStyle;
        return { ...(playerStyle[key] || {}), code: playerCode };
      }).values().value();
      const posOtherPosCatAssistNetwork = PlayTypeUtils.buildPosCategoryAssistNetwork(
        perPlayer, rosterStatsByCode, undefined,
      ); // pos vs <shot-type-stats> (order tells you which)

//console.log(`${key}: ${JSON.stringify(perPlayer, tidyNumbers)} ... ${JSON.stringify(posOtherPosCatAssistNetwork, tidyNumbers)}`);

      return posOtherPosCatAssistNetwork[ix];
    }).value();

    return [ pos, { assists: posPosCatAssistNetwork, other: posVsPosOtherTypes} ];

  }).fromPairs().value();

  // The above is the wrong way round, so re-order the 2x pos keys:
  const reorderedPosVsPosAssistNetwork = _.chain(PosFamilyNames).map((pos, ix) => {
    const other = posVsPosAssistNetwork[pos]?.other || {};
    const assists = _.chain(posVsPosAssistNetwork).values().map((assistNetwork, ix2) => {
      return { ...(assistNetwork.assists?.[ix] || {}), order: ix2 };
    }).value();
//END code1 to move    

//console.log(`${pos} ... vs ... ${JSON.stringify(posVsPosAssistNetwork[pos], tidyNumbers, 3)}`);

    return [ pos, { assists: assists, other: other } ];
  }).fromPairs().value();

//TODO: move this code2 to PlayTypeUtils
  _.chain(reorderedPosVsPosAssistNetwork).toPairs().forEach((kv, ix) => {
    // Some mutation that is needed
    const assistInfo = kv[1].assists as Record<string, any>[];
    const otherInfo = kv[1].other as Record<string, any>[]; 
      //(unassisted, assisted <- DROP, transition, scramble)
    const assistedTransitionInfo = otherInfo[4];
    const assistedScrambleInfo = otherInfo[5];

    // Unassisted:
    PlayTypeUtils.enrichUnassistedStats(otherInfo[0], ix);
    // Transition + Scramble:
    PlayTypeUtils.enrichNonHalfCourtStats(otherInfo[2], otherInfo[3]);

    // Now get an approximate half court number for all the assists by sensibly (if not correctly!)
    // taking out the scramble and transition assisted numbers
    PlayTypeUtils.convertAssistsToHalfCourtAssists(assistInfo, assistedTransitionInfo, assistedScrambleInfo);
  }).value();

  //(need a copy of this before we mutate it one final time in PlayTypeUtils.apportionHalfCourtTurnovers()
  const copyOfReorderedPosVsPosAssistNetwork = _.cloneDeep(reorderedPosVsPosAssistNetwork);

  const flattenedNetwork = _.chain(reorderedPosVsPosAssistNetwork).toPairs().flatMap((kv, ix) => {
    const posTitle = kv[0];
    const assistInfo = kv[1].assists as Record<string, any>[];
    const otherInfo = kv[1].other as Record<string, any>[]; 
      //(unassisted, assisted <- DROP, transition, scramble)
    const unassistedInfo = otherInfo[0];
    const transitionInfo = otherInfo[2];
    const scrambleInfo = otherInfo[3];

    // Distribute TOs into half court assist network
    PlayTypeUtils.apportionHalfCourtTurnovers(
      posTitle, ix, copyOfReorderedPosVsPosAssistNetwork, reorderedPosVsPosAssistNetwork, unassistedInfo
    );
  
    return assistInfo.concat([unassistedInfo, transitionInfo, scrambleInfo]).flatMap((a, i) => {
      return _.keys(a).filter(ka => 
        _.startsWith(ka, "source_")
      ).map(ka => ({ key: `${posTitle}_${i}_${ka}`, stat: a[ka] }))
    });

  }).groupBy(obj => (obj.stat.extraInfo || []).join(":")).mapValues(oo => _.sumBy(oo, o => (o.stat?.value || 0))).value();
  
  const playTypesLookup = PlayTypeUtils.buildPlayTypesLookup();

  const topLevelPlayTypeAnalysis = _.transform(flattenedNetwork, (acc, usage, key) => {
    const playTypesCombo = playTypesLookup[key];
    _.toPairs(playTypesCombo).forEach(kv => {
      const playType = kv[0] as TopLevelPlayTypes;
      const weight = kv[1];
      acc[playType] = (acc[playType] || 0) + weight*usage;
    });

  }, {} as Record<TopLevelPlayTypes, number>);

  // Uncategorized turnovers:
  const [ uncatHalfCourtTos, uncatScrambleTos, uncatTransTos ] 
    = PlayTypeUtils.calcTeamHalfCourtTos(players as IndivStatSet[], teamStats as TeamStatSet);
  topLevelPlayTypeAnalysis["Misc"] = uncatHalfCourtTos/teamPossessions;
  topLevelPlayTypeAnalysis["Put-Back"] += uncatScrambleTos/teamPossessions;
  topLevelPlayTypeAnalysis["Transition"] += uncatTransTos/teamPossessions;
//end code2 to move
  
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
        {_.toPairs(topLevelPlayTypeAnalysis).map(o => JSON.stringify(o)).map(t => <span>{t}<br/></span>)}
        SUM = [{_.chain(topLevelPlayTypeAnalysis).values().sum().value()}]
      </Col>
    </Container>
  </span>;
};
export default TeamPlayTypeDiagRadar;
