// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

// Util imports
import { GameFilterParams } from "../utils/FilterModels";
import { TeamStatsModel } from '../components/TeamStatsTable';

export type RosterStatsModel = {
  on: any,
  off: any,
  baseline: any,
  error_code?: string
}
type Props = {
  gameFilterParams: GameFilterParams,
  teamStats: TeamStatsModel,
  rosterStats: RosterStatsModel
}

const RosterStatsTable: React.FunctionComponent<Props> = ({gameFilterParams, teamStats, rosterStats}) => {

  return <Card.Text>Coming Soon!</Card.Text>;
}

export default RosterStatsTable;
