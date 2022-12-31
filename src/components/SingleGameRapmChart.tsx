// React imports:
import _ from 'lodash';
import React, { useState, useEffect } from 'react';

import { getCommonFilterParams, MatchupFilterParams, ParamDefaults } from "../utils/FilterModels";
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { PlayerId, IndivStatSet, IndivPosInfo } from '../utils/StatModels';
import { LineupTableUtils } from '../utils/tables/LineupTableUtils';
import { RosterTableUtils } from '../utils/tables/RosterTableUtils';
import { TeamReportTableUtils } from '../utils/tables/TeamReportTableUtils';
import { LineupStatsModel } from "./LineupStatsTable";
import { RosterStatsModel } from "./RosterStatsTable";
import { TeamStatsModel } from "./TeamStatsTable";

type Props = {
   startingState: MatchupFilterParams,
   dataEvent: {
     lineupStatsA: LineupStatsModel,
     teamStatsA: TeamStatsModel,
     rosterStatsA: RosterStatsModel,
     lineupStatsB: LineupStatsModel,
     teamStatsB: TeamStatsModel,
     rosterStatsB: RosterStatsModel,
   },
   onChangeState: (newParams: MatchupFilterParams) => void
};

const SingleGameRapmChart: React.FunctionComponent<Props> = ({startingState, dataEvent, onChangeState}) => {
   const { lineupStatsA, teamStatsA, rosterStatsA, lineupStatsB, teamStatsB, rosterStatsB } = dataEvent;

   // Model

   const commonParams = getCommonFilterParams(startingState);
   const genderYearLookup = `${commonParams.gender}_${commonParams.year}`;
   const teamSeasonLookup = `${commonParams.gender}_${commonParams.team}_${commonParams.year}`;
   const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;
 
   // Luck:
   const [ adjustForLuck, setAdjustForLuck ] = useState(_.isNil(startingState.onOffLuck) ?
      ParamDefaults.defaultOnOffLuckAdjust : startingState.onOffLuck
   );
   const [ luckConfig, setLuckConfig ] = useState(_.isNil(startingState.luck) ?
      ParamDefaults.defaultLuckConfig : startingState.luck
   );

   const [ cachedRapm, setCachedRapm ] = useState<{a: Record<string, any>, b: Record<string, any> }>({ a: {}, b: {} });
   useEffect(() => {
      //ensure we never show the _wrong_ RAPM
      setCachedRapm({ a: {}, b: {} });
   }, [ dataEvent, adjustForLuck ]);
   useEffect(() => {
      setCachedRapm({
         a: buildRapm(
            lineupStatsA, teamStatsA, rosterStatsA, 
         ),
         b: buildRapm(
            lineupStatsB, teamStatsB, rosterStatsB, 
         ),
      })
   }, [ cachedRapm ]);
   
   // Calcs

   //TODO: build RAPM

   /** For a given lineup set, calculate RAPM as quickly as possible */
   const buildRapm = (
     lineupStats: LineupStatsModel, teamStats: TeamStatsModel, rosterStats: RosterStatsModel,
   ) => {
      const rosterStatsByCode = RosterTableUtils.buildRosterTableByCode(
         rosterStats.global || [], teamStats.global?.roster, false, teamSeasonLookup
      );
      const playerInfo = LineupTableUtils.buildBaselinePlayerInfo(
         rosterStats.baseline!, rosterStatsByCode, teamStats.baseline!, avgEfficiency, adjustForLuck, luckConfig.base, 
         {}, {}
      );
      const positionFromPlayerKey = LineupTableUtils.buildPositionPlayerMap(rosterStats.global, teamSeasonLookup);
      const preRapmTableData = LineupTableUtils.buildEnrichedLineups( //(calcs for both luck and non-luck versions)
         lineupStats.lineups || [],
         teamStats.global, rosterStats.global, teamStats.baseline,
            //(the baseline vs on/off here doesn't make any practical difference)
         adjustForLuck, luckConfig.base, avgEfficiency,
         false, teamSeasonLookup, positionFromPlayerKey, playerInfo
      );
      const rapmInfo = TeamReportTableUtils.buildOrInjectRapm(
         preRapmTableData, playerInfo,
         adjustForLuck, avgEfficiency, genderYearLookup
      );
      return _.fromPairs(
         (rapmInfo?.enrichedPlayers || []).map(
            p => [ p.playerId, { off_adj_rapm: p.rapm?.off_adj_ppp, def_adj_rapm: p.rapm?.def_adj_ppp }]
         )
      );
   };


   return null;
}
export default SingleGameRapmChart;

