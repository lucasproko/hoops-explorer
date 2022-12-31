// React imports:
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Cell, Label, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import { CbbColors } from '../utils/CbbColors';

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

   const [ cachedStats, setCachedStats ] = useState<{a: any[], b: any[] }>({ a: [], b: [] });
   useEffect(() => {
      //TODO: something weird happens with this being called lots of time on page load
      // (some issue with CommonFilter / MatchupFilter?)

      //ensure we never show the _wrong_ RAPM
      setCachedStats({ a: [], b: [] });
   }, [ dataEvent, adjustForLuck ]);
   useEffect(() => {
      if (_.isEmpty(cachedStats.a)) {
         setCachedStats({
            a: buildStats(
               lineupStatsA, teamStatsA, rosterStatsA, 
            ),
            b: buildStats(
               lineupStatsB, teamStatsB, rosterStatsB, 
            ),
         })
      }
   }, [ cachedStats ]);
   
   // Calcs

   //TODO: build RAPM

   /** For a given lineup set, calculate RAPM as quickly as possible */
   const buildStats = (
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
      return (rapmInfo?.enrichedPlayers || []).map(
         p => ({ 
            x: p.rapm?.off_adj_ppp?.value || 0, 
            y: p.rapm?.def_adj_ppp?.value || 0,
            color: (p.rapm?.off_adj_ppp?.value || 0) - (p.rapm?.def_adj_ppp?.value || 0),
            p: p,
            off_adj_rapm: p.rapm?.off_adj_ppp, 
            def_adj_rapm: p.rapm?.def_adj_ppp 
         })
      );
   };

   //TODO; +-12, incorp mins by default, labels etc

   return  _.isEmpty(cachedStats.a) ? <div>(Loading)</div> :
      <ResponsiveContainer width={"100%"} height={400}>
         <ScatterChart>
            <XAxis type="number" dataKey="x">
               <Label value={"Offensive RAPM"} position='top' style={{textAnchor: 'middle'}} />
            </XAxis>
            <YAxis type="number" dataKey="y">
               <Label angle={-90} value={"Defensive RAPM"} position='insideLeft' style={{textAnchor: 'middle'}} />
            </YAxis>
            <Scatter data={cachedStats.a} fill="green">
               {_.values(cachedStats.a).map((p, index) => {
                  return <Cell key={`cell-${index}`} fill={CbbColors.off_diff10_p100_redBlackGreen(p.color)}/>
               })};
            </Scatter>
         </ScatterChart>
      </ResponsiveContainer>;
}
export default SingleGameRapmChart;

