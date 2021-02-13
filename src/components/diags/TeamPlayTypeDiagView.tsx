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
import { PosFamilyNames, PlayTypeUtils } from "../../utils/stats/PlayTypeUtils";
import { PositionUtils } from "../../utils/stats/PositionUtils";
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { PlayTypeDiagUtils } from "../../utils/tables/PlayTypeDiagUtils";
import { CbbColors } from "../../utils/CbbColors";
import { LineupUtils } from "../../utils/stats/LineupUtils";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "../GenericTable";

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
  players: Array<Record<string, any>>,
  rosterStatsByCode: Record<string, any>,
  teamStats: Record<string, any>,
  teamSeasonLookup: string,
  showHelp: boolean,
  showDetailsOverride?: boolean
};
const TeamPlayTypeDiagView: React.FunctionComponent<Props> = ({players, rosterStatsByCode, teamStats, teamSeasonLookup, showHelp, showDetailsOverride}) => {
  // Repeat the logic in PlayerTypeTypeDiagView:

  const teamScoringPossessions =
    (teamStats.total_off_fgm?.value || 0) + 0.475*(teamStats.total_off_fta?.value || 0);
    //(use pure scoring possessions and not + assists because the team is "closed" unlike one player)

  const teamTotalAssists = teamStats.total_off_assist?.value || 0;
    //(use team total assists for consistency with individual chart)

  const filterCodes: Set<string> | undefined = undefined; // = new Set(["ErAyala", "AqSmart"])
  const filteredPlayers = players.filter(pl => {
    const code = pl.player_array?.hits?.hits?.[0]?._source?.player?.code || player.key;
    return !filterCodes || filterCodes.has(code);
  });

  const posCategoryAssistNetworkVsPlayer = _.chain(filteredPlayers).map((player, ix) => {
    const allPlayers = PlayTypeUtils.buildPlayerAssistCodeList(player);
    const playerStyle = PlayTypeUtils.buildPlayerStyle(
      player, teamScoringPossessions, teamTotalAssists
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
      const playerStyle = perPlayerInfo.playerStyle;

      // For each player: get a single pos category stats
      const posStats = posCategoryAssistNetwork.filter((net: any) => net?.order == ix)?.[0] || undefined;
      return posStats ? [ {
        ...posStats,
        code: playerCode
      } ] : [];
    }).values().flatten().value();

//TODO: this is the wrong way round...
    // This is now "for each pos, a list of player stats", so we can reapply, to get "for each pos a list of pos stats"
    const posPosCatAssistNetwork = PlayTypeUtils.buildPosCategoryAssistNetwork(
      perPlayer, rosterStatsByCode, ix,
    ); // pos vs <shot-type-stats> (order tells you which)

//console.log(`${pos} ... vs ... ${JSON.stringify(perPlayer, tidyNumbers, 3)}`);

    // Unassisted/scramble/transition: similar:
    const posVsPosOtherTypes = _.chain([ "unassisted", "assisted", "transition", "scramble" ]).map(key => {

      //TODO: need to weight each set of stats by the score

      const perPlayer = _.chain(posCategoryAssistNetworkVsPlayer).mapValues((perPlayerInfo, playerCode) => {
        const playerStyle = perPlayerInfo.playerStyle;
        return { ...(playerStyle[key] || {}), code: playerCode };
      }).values().value();
      const posPosCatAssistNetwork = PlayTypeUtils.buildPosCategoryAssistNetwork(
        perPlayer, rosterStatsByCode, undefined,
      ); // pos vs <shot-type-stats> (order tells you which)

//console.log(`${key}: ${JSON.stringify(perPlayer, tidyNumbers)} ... ${JSON.stringify(posPosCatAssistNetwork, tidyNumbers)}`);

      return posPosCatAssistNetwork[ix];
    }).value();

    return [ pos, { assists: posPosCatAssistNetwork, other: posVsPosOtherTypes} ];

  }).fromPairs().value();

  // The above is the wrong way round, so re-order the 2x pos keys:
  const reorderedPosVsPosAssistNetwork = _.chain(PosFamilyNames).map((pos, ix) => {
    const other = posVsPosAssistNetwork[pos]?.other || {};
    const assists = _.chain(posVsPosAssistNetwork).values().map((assistNetwork, ix2) => {
      return { ...(assistNetwork.assists?.[ix] || {}), order: ix2 };
    }).value();

//console.log(`${pos} ... vs ... ${JSON.stringify(posVsPosAssistNetwork[pos], tidyNumbers, 3)}`);

    return [ pos, { assists: assists, other: other } ];
  }).fromPairs().value();

  const tooltipBuilder = (id: string, title: string, tooltip: string) =>
    <OverlayTrigger placement="auto" overlay={
      <Tooltip id={id + "Tooltip"}>{tooltip}</Tooltip>
    }><i>{title}</i></OverlayTrigger>;

  const rawAssistTableData = _.chain(reorderedPosVsPosAssistNetwork).toPairs().flatMap((kv, ix) => {
    const posTitle = kv[0];
    const assistInfo = kv[1].assists;
    const otherInfo = kv[1].other;

    return [
      GenericTableOps.buildDataRow({
        title: <b>{_.capitalize(posTitle)} to/from:</b>
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta),
      GenericTableOps.buildDataRow({
        ...PlayTypeDiagUtils.buildInfoRow(
          PlayTypeUtils.enrichUnassistedStats(otherInfo[0]!, ix)
        ),
        title: tooltipBuilder("unassisted", "Unassisted",
          `All scoring plays where the ${posTitle} was unassisted (includes FTs which can never be assisted). Includes half court, scrambles, and transition)`
        )
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta),
      GenericTableOps.buildDataRow({
        ...PlayTypeDiagUtils.buildInfoRow(otherInfo[1]!),
        title: tooltipBuilder("assist", "Assist totals:",
          `All plays where the  ${posTitle} was assisted (left half) or provided the assist (right half). ` +
          "The 3 rows below break down assisted plays according to the positional category of the assister/assistee. " +
          "(Includes half court, scramble, and transitions)"
        )
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    ].concat(
      GenericTableOps.buildRowSeparator(),
      assistInfo.map((info: any) => PlayTypeDiagUtils.buildInfoRow(info)).map((info: any) =>
        GenericTableOps.buildDataRow({
          ...info,
          title: <span><i>{_.capitalize(PosFamilyNames[info.order])}</i></span>
        }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
      )
    ).concat([
      GenericTableOps.buildRowSeparator(),
      GenericTableOps.buildDataRow({
        ...PlayTypeDiagUtils.buildInfoRow(otherInfo[2]!),
        title: tooltipBuilder("trans", "In transition",
          "All plays (assisted or unassisted) that are classified as 'in transition', normally shots taken rapidly after a rebound, miss, or make in the other direction."
        )
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta),
      GenericTableOps.buildDataRow({
        ...PlayTypeDiagUtils.buildInfoRow(otherInfo[3]!),
        title: tooltipBuilder("scramble", "Scrambles after RB",
          "All plays (assisted or unassisted) that occur in the aftermath of an offensive rebound, where the offense does not get reset before scoring. " +
          "Examples are putbacks (unassisted) or tips to other players (assisted)"
        ),
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta),
      GenericTableOps.buildRowSeparator(),
    ]);
  }).value();

  return <span>
    {/*JSON.stringify(_.chain(teamStats).toPairs().filter(kv => kv[0].indexOf("trans") >= 0).values(), tidyNumbers, 3)*/}
    <br/>
    <Container>
      <Col xs={10}>
        <GenericTable responsive={false} tableCopyId="teamAssistNetworks" tableFields={PlayTypeDiagUtils.rawAssistTableFields(false, true)} tableData={rawAssistTableData}/>
      </Col>
    </Container>
  </span>;
};
export default TeamPlayTypeDiagView;
