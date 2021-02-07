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
  teamSeasonLookup: string,
  showHelp: boolean,
  showDetailsOverride?: boolean
};
const TeamPlayTypeDiagView: React.FunctionComponent<Props> = ({players, rosterStatsByCode, teamSeasonLookup, showHelp, showDetailsOverride}) => {

  // Repeat the logic in PlayerTypeTypeDiagView:

  const perPlayCategoryAssistNetwork = _.chain(players).map((player) => {
    const allPlayers = PlayTypeUtils.buildPlayerAssistCodeList(player);
    const playerStyle = PlayTypeUtils.buildPlayerStyle(player);
    const playerAssistNetwork = allPlayers.map((p) => {
      const [ info, ignore ] = PlayTypeUtils.buildPlayerAssistNetwork(
        p, player, playerStyle.totalScoringPlaysMade, playerStyle.totalAssists,
        rosterStatsByCode
      );
      return info;
    });
    const posCategoryAssistNetwork = PlayTypeUtils.buildPosCategoryAssistNetwork(
      playerAssistNetwork, rosterStatsByCode, undefined
    );

    /**/
    console.log(`${player.code} ... vs ... ${JSON.stringify(posCategoryAssistNetwork, tidyNumbers, 3)}`);

    return [ player.code || "??", posCategoryAssistNetwork ];
  }).fromPairs().value();

  //TODO: need unassisted as well

  // This gets us to:
  // [1] (player)[ { [pos]: <shot-type-stats> } ]   (pos=bh|wing|big)

  // Then buildPosCategoryAssistNetwork goes:
  // [2] player, (other_players)[ <shot-type-stats> ] => { [pos]: <shot-type-stats> }
  // (and "player" is only used to inject examples in)

  // So transform [1] to (pos)(players)[ <shot-type-stats> ] and then use [2] on each pos
  // and that gives us a pos vs pos -> <shot-type-stats> as desired!

  _.chain(PosFamilyNames).map((pos, ix) => {
    const perPlayer = _.chain(perPlayCategoryAssistNetwork).mapValues((posAssistNetwork, playerCode) => {
      const posStats = posAssistNetwork.filter(net => net?.order == ix)?.[0] || undefined;
       return posStats ? [ {
        ...posStats,
        code: playerCode
      } ] : [];
    }).values().flatten().value();

    const posPosCatAssistNetwork = PlayTypeUtils.buildPosCategoryAssistNetwork(
      perPlayer, rosterStatsByCode, undefined
    ); // pos vs <shot-type-stats> (order tells you which)

/**/
//console.log(`${pos} ... vs ... ${JSON.stringify(posPosCatAssistNetwork, tidyNumbers, 3)}`);

    return [ pos, posPosCatAssistNetwork ];

  }).fromPairs().value();



  return <span>

    </span>;
};
export default TeamPlayTypeDiagView;
