// React imports:
import _ from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import { Tooltip as RechartTooltip, CartesianGrid, Cell, Label, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import { CbbColors } from '../utils/CbbColors';
import { ScatterChartUtils } from '../utils/charts/ScatterChartUtils';

import { getCommonFilterParams, MatchupFilterParams, ParamDefaults } from "../utils/FilterModels";
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { PureStatSet } from '../utils/StatModels';
import { LineupTableUtils } from '../utils/tables/LineupTableUtils';
import { RosterTableUtils } from '../utils/tables/RosterTableUtils';
import { TeamReportTableUtils } from '../utils/tables/TeamReportTableUtils';
import { LineupStatsModel } from "./LineupStatsTable";
import { RosterStatsModel } from "./RosterStatsTable";
import { TeamStatsModel } from "./TeamStatsTable";

type Props = {
   startingState: MatchupFilterParams,
   opponent: string,
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

const SingleGameRapmChart: React.FunctionComponent<Props> = ({startingState, opponent, dataEvent, onChangeState}) => {
   const { lineupStatsA, teamStatsA, rosterStatsA, lineupStatsB, teamStatsB, rosterStatsB } = dataEvent;

   // Model

   const commonParams = getCommonFilterParams(startingState);
   const genderYearLookup = `${commonParams.gender}_${commonParams.year}`;
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
      setCachedStats({ a: [], b: [] });
   }, [ dataEvent, adjustForLuck ]);
   useEffect(() => {
      if (_.isEmpty(cachedStats.a) && !_.isEmpty(lineupStatsA.lineups)) {
         setCachedStats({
            a: buildStats(commonParams.team || "",
               lineupStatsA, teamStatsA, rosterStatsA, 
            ),
            b: buildStats(opponent,
               lineupStatsB, teamStatsB, rosterStatsB, 
            ),
         })
      }
   }, [ cachedStats ]);
   
   // Calcs

   /** For a given lineup set, calculate RAPM as quickly as possible */
   const buildStats = (
      team: string,
      lineupStats: LineupStatsModel, teamStats: TeamStatsModel, rosterStats: RosterStatsModel,
   ) => {
      if (!lineupStats.lineups) {
         return [];
      }
      const teamSeasonLookup = `${commonParams.gender}_${team}_${commonParams.year}`;
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
               posClass: positionFromPlayerKey[p.playerId]?.posClass,
               stats: statObj,
               off_adj_rapm: p.rapm?.off_adj_ppp, 
               def_adj_rapm: p.rapm?.def_adj_ppp 
            };
         }
      );
   };

   // Tooltip:

   const fieldValExtractor = (field: string) => {
      return (p: PureStatSet | undefined) => {
         if ((field[0] == 'o') || (field[0] == 'd')) {
            return p?.[field]?.value || 0;
         } else {
            return (p?.[`off_${field}`]?.value || 0) - (p?.[`def_${field}`]?.value || 0);
         }
      }
   };
   type CustomTooltipProps = {
      active?: boolean,
      payload?: any,
      label?: string,
    };
   const CustomTooltip: React.FunctionComponent<CustomTooltipProps> = ({ active, payload, label }) => {
      const bOrW = (f: number) => {
         return `${Math.abs(f).toFixed(1)} ${f > 0 ? "better" : "worse"} than expected`;
      };
      if (active) {
        const data = payload?.[0].payload || {};
        const net = data.x + data.y;
        return (
          <div className="custom-tooltip" style={{
            background: 'rgba(255, 255, 255, 0.9)',
          }}><small>
            <p className="label"><b>
            {`${data.stats?.key}`}</b><br/>
            <i>{`${data.posClass || "??"}`}
            {` ${data.stats?.roster?.height || "?-?"}`}
            </i></p>
            <p className="desc">
               <span>Net RAPM: <b>{net.toFixed(1)}</b> pts/100</span><br/>
               <span>Off RAPM: <b>{data.x.toFixed(1)}</b> pts/100</span><br/>
               <span>Def RAPM: <b>{(-data.y).toFixed(1)}</b> pts/100</span><br/>
               <span>Off Rtg: <b>{fieldValExtractor("off_rtg")(data.stats).toFixed(1)}</b></span><br/>
               <span>Usage: <b>{(fieldValExtractor("off_usage")(data.stats)*100).toFixed(1)}</b>%</span><br/>
               <span>Mpg: <b>{(fieldValExtractor("off_team_poss_pct")(data.stats)*40).toFixed(1)}</b></span><br/>
            </p>
         </small></div>
        );
      }
      return null;
    };
    
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
            <Scatter data={cachedStats.a} fill="green" shape="triangle">
               {ScatterChartUtils.buildTidiedLabelList({
                  maxHeight: screenHeight, maxWidth: screenWidth, textColorOverride: "black", mutableState: labelState,
                  dataKey: "name"
               })}
               {_.values(cachedStats.a).map((p, index) => {
                  return <Cell key={`cell-${index}`} fill={CbbColors.off_diff10_p100_redBlackGreen(p.color)}/>
               })};
            </Scatter>
            <RechartTooltip
              content={(<CustomTooltip />)}
              wrapperStyle={{ opacity: "0.9", zIndex: 1000 }}
              allowEscapeViewBox={{x: true, y: false}}
              itemSorter={(item: any) => item.value}
            />
         </ScatterChart>
      </ResponsiveContainer>;
}
export default SingleGameRapmChart;

