// React imports:
import _ from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import { CartesianGrid, Cell, Label, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import { CbbColors } from '../utils/CbbColors';
import { ScatterChartUtils } from '../utils/charts/ScatterChartUtils';

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


const graphLimit = 10.0;

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

   // Viewport management

   const [ screenHeight, setScreenHeight ] = useState(512);
   const [ screenWidth, setScreenWidth ] = useState(512);
   const latestScreenHeight = useRef(screenHeight);
   const latestScreenWidth = useRef(screenWidth);
   useEffect(() => {
     function handleResize() {
         setTimeout(() => {
            setScreenHeight(0.5*window.innerHeight);
            setScreenWidth(0.5*window.innerWidth);
         }, 250);
     }
     window.addEventListener('resize', handleResize);
     setScreenHeight(0.5*window.innerHeight);
     setScreenWidth(0.5*window.innerWidth);
     return () => window.removeEventListener('resize', handleResize);
   }, []);

   // RAPM building

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

   /** For a given lineup set, calculate RAPM as quickly as possible */
   const buildStats = (
     lineupStats: LineupStatsModel, teamStats: TeamStatsModel, rosterStats: RosterStatsModel,
   ) => {
      if (!lineupStats.lineups) {
         return [];
      }
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
      return _.orderBy(rapmInfo?.enrichedPlayers || [], p => -p.playerCode.length).map(
         p => { 
            const statObj = playerInfo[p.playerId];

            const offPoss = statObj.off_team_poss_pct?.value || 0;
            const defPoss = statObj.def_team_poss_pct?.value || 0;
            const offRapmProd = (p.rapm?.off_adj_ppp?.value || 0)*offPoss;
            const defRapmProd = (p.rapm?.def_adj_ppp?.value || 0)*defPoss;
            return { 
               x: Math.min(graphLimit, Math.max(-graphLimit, offRapmProd)), 
               y: -Math.min(graphLimit, Math.max(-graphLimit, defRapmProd)),
               color: offRapmProd - defRapmProd,
               name: p.playerCode,
               stats: statObj,
               off_adj_rapm: p.rapm?.off_adj_ppp, 
               def_adj_rapm: p.rapm?.def_adj_ppp 
            };
         }
      );
   };

   //TODO; +-12, incorp mins by default, labels etc
   const scoreLines = [ -6, -2, 2, 6 ];

   const labelState = ScatterChartUtils.buildEmptyLabelState(); 

   return  _.isEmpty(cachedStats.a) ? <div>(Loading...)</div> :
      <ResponsiveContainer width={screenWidth} height={screenHeight}>
         <ScatterChart>
            <XAxis type="number" dataKey="x" domain={[-graphLimit, graphLimit]}>
               <Label value={"Offensive RAPM"} position='top' style={{textAnchor: 'middle'}} />
            </XAxis>
            <YAxis type="number" dataKey="y" domain={[-graphLimit, graphLimit]}>
               <Label angle={-90} value={"Defensive RAPM"} position='insideLeft' style={{textAnchor: 'middle'}} />
            </YAxis>
            <CartesianGrid strokeDasharray="4"/>
            <Scatter data={cachedStats.b} fill="green">
               {ScatterChartUtils.buildTidiedLabelList({
                  maxHeight: screenHeight, maxWidth: screenWidth, textColorOverride: "purple", mutableState: labelState,
                  dataKey: "name"
               })}
               {_.values(cachedStats.b).map((p, index) => {
                  return <Cell key={`cell-${index}`} fill={CbbColors.off_diff10_p100_redBlackGreen(p.color)}/>
               })};
            </Scatter>
            <Scatter data={cachedStats.a} fill="green">
               {ScatterChartUtils.buildTidiedLabelList({
                  maxHeight: screenHeight, maxWidth: screenWidth, textColorOverride: "black", mutableState: labelState,
                  dataKey: "name"
               })}
               {_.values(cachedStats.a).map((p, index) => {
                  return <Cell key={`cell-${index}`} fill={CbbColors.off_diff10_p100_redBlackGreen(p.color)}/>
               })};
            </Scatter>
         </ScatterChart>
      </ResponsiveContainer>;
}
export default SingleGameRapmChart;

