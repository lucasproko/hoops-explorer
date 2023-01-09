// React imports:
import _ from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import { Col } from 'react-bootstrap';
import { ReferenceLine, ReferenceArea, Legend, Tooltip as RechartTooltip, CartesianGrid, Cell, Label, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import { CbbColors } from '../utils/CbbColors';
import { ScatterChartUtils } from '../utils/charts/ScatterChartUtils';

import { getCommonFilterParams, MatchupFilterParams, ParamDefaults } from "../utils/FilterModels";
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { PureStatSet } from '../utils/StatModels';
import { defaultRapmConfig, RapmInfo } from '../utils/stats/RapmUtils';
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

const PlayerImpactChart: React.FunctionComponent<Props> = ({startingState, opponent, dataEvent, onChangeState}) => {
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
   //(would only need these if using dynamic sizing)
   // const latestScreenHeight = useRef(screenHeight);
   // const latestScreenWidth = useRef(screenWidth);
   const calcWidthHeight = (): [ number, number ] => {
      const baseHeight = Math.max(0.5*window.innerHeight, 400);
      const baseWidth = Math.max(baseHeight, Math.max(0.5*window.innerWidth, 400));
      return [ baseWidth, baseHeight ];
   };
   useEffect(() => {
     function handleResize() {
         setTimeout(() => {
            const [ baseWidth, baseHeight ] = calcWidthHeight();
            setScreenHeight(baseHeight);
            setScreenWidth(baseWidth);
         }, 250);
     }
     window.addEventListener('resize', handleResize);
     const [ baseWidth, baseHeight ] = calcWidthHeight();
     setScreenHeight(baseHeight);
     setScreenWidth(baseWidth);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   // RAPM building

   const [ cachedStats, setCachedStats ] = useState<{ ab: any[] }>({ ab: [] });
   useEffect(() => {
      setCachedStats({ ab: [] });
   }, [ dataEvent, adjustForLuck ]);
   useEffect(() => {
      if (_.isEmpty(cachedStats.ab) && !_.isEmpty(lineupStatsA.lineups)) {
         const aStats = buildStats(commonParams.team!, "black",
            lineupStatsA, teamStatsA, rosterStatsA, 
         );
         const bStats = buildStats(opponent, "purple",
            lineupStatsB, teamStatsB, rosterStatsB, 
         );
         setCachedStats({
            ab: _.orderBy(aStats.concat(bStats), p => -(p.x*p.x + p.y*p.y))
               // (render the players around the edge first, who are likely to be less congested)
      })
      }
   }, [ cachedStats ]);
   
   // Calcs

   /** For a given lineup set, calculate RAPM as quickly as possible */
   const buildStats = (
      team: string, labelColor: string,
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
         adjustForLuck, avgEfficiency, genderYearLookup, undefined,
         {
            ...defaultRapmConfig,
            fixedRegression: 0.8
         }
      ) || {
         enrichedPlayers: _.values(playerInfo).map(p => ({
            playerId: p.key || "",
            playerCode: p.code || "",
            rapm: {
               off_adj_ppp: p.off_adj_rtg,
               def_adj_ppp: p.def_adj_rtg,
            }
         }))
      } as unknown as RapmInfo;
      return _.chain(rapmInfo?.enrichedPlayers || []).map(
         p => { 
            const statObj = playerInfo[p.playerId];
            const offPoss = statObj.off_team_poss_pct?.value || 0;
            const defPoss = statObj.def_team_poss_pct?.value || 0;
            const offRapmProd = (p.rapm?.off_adj_ppp?.value || 0)*offPoss;
            const defRapmProd = (p.rapm?.def_adj_ppp?.value || 0)*defPoss;
            return { 
               seriesId: team,
               labelColor,
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
      ).value(); 
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
         const net = (data.off_adj_rapm?.value || 0) - (data.def_adj_rapm?.value || 0);

         // Info needed for the performance breakdown
         const _3pa = data.stats.total_off_3p_attempts?.value || 0;        
         const _3pm = data.stats.total_off_3p_made?.value || 0;        
         const _2pmida = data.stats.total_off_2pmid_attempts?.value || 0;        
         const _2pmidm = data.stats.total_off_2pmid_made?.value || 0;        
         const _2prima = data.stats.total_off_2prim_attempts?.value || 0;        
         const _2primm = data.stats.total_off_2prim_made?.value || 0;        
         const fta = data.stats.total_off_fta?.value || 0;        
         const ftm = data.stats.total_off_ftm?.value || 0;        
         const assists = data.stats.total_off_assist?.value || 0;
         const tos = data.stats.total_off_to?.value || 0;
         const orbs = data.stats.total_off_orb?.value || 0;
         const drbs = data.stats.total_off_drb?.value || 0;
         const pts = 3*_3pm + 2*(_2pmidm + _2primm) + ftm;
         const trbs = orbs + drbs;

         return (
            <div className="custom-tooltip" style={{
               background: 'rgba(255, 255, 255, 0.9)',
            }}><small>
               <p className="label">
                  <b>{`${data.stats?.key}`}</b><br/>
                  <b>{`${data.seriesId}`}</b><br/>
                  <i>
                     {`${data.stats?.roster?.height || "?-?"} `}
                     {`${data.posClass || "??"}`}
                  </i>
               </p>
               <p className="desc">
                  <span><b>{pts}</b> pt{pts == 1 ? "" : "s"} / <b>{trbs}</b> RB{trbs == 1 ? "" : "s"} </span><br/>
                  <br/>
                  <span>Net RAPM: <b>{net.toFixed(1)}</b> pts/100</span><br/>
                  <span>Off RAPM: <b>{(data.off_adj_rapm?.value || 0).toFixed(1)}</b> pts/100</span><br/>
                  <span>Def RAPM: <b>{(data.def_adj_rapm?.value || 0).toFixed(1)}</b> pts/100</span><br/>
                  <span>Off Rtg: <b>{fieldValExtractor("off_rtg")(data.stats).toFixed(1)}</b></span><br/>
                  <span>Usage: <b>{(fieldValExtractor("off_usage")(data.stats)*100).toFixed(1)}</b>%</span><br/>
                  <span>Mpg: <b>{(fieldValExtractor("off_team_poss_pct")(data.stats)*40).toFixed(1)}</b></span><br/>
                  <br/>
                  <span>3P=[<b>{_3pm}/{_3pa}</b>] mid=[<b>{_2pmidm}/{_2pmida}</b>]</span><br/>
                  <span>rim=[<b>{_2primm}/{_2prima}</b>] FT=[<b>{ftm}/{fta}</b>]</span><br/>
                  <span>A:TO=[<b>{assists}</b>]:[<b>{tos}</b>]</span><br/>
                  <span>ORBs=[<b>{orbs}</b>] DRBs=[<b>{drbs}</b>]</span><br/>
               </p>
            </small></div>
         );
      }
      return null;
    };

   // Calculate the x/y limits:
   const [ xMin, xMax, yMin, yMax ] = _.transform(cachedStats.ab, (acc, v) => {
      acc[0] = Math.min(acc[0], v.x);
      acc[1] = Math.max(acc[1], v.x);
      acc[2] = Math.min(acc[2], v.y);
      acc[3] = Math.max(acc[3], v.y);
   }, [1000, -1000, 1000, -1000]); 

   const calcGraphLimit = (min: number, max: number) => {
      const factor = _.find([0.6, 0.8], factor => ((min > -factor*graphLimit) && (max < factor*graphLimit)));
      return factor ? factor*graphLimit : graphLimit;
   };
   const graphLimitX = calcGraphLimit(xMin, xMax);
   const graphLimitY = calcGraphLimit(yMin, yMax);

   const labelState = ScatterChartUtils.buildEmptyLabelState(); 
   return  _.isEmpty(cachedStats.ab) ? <Col className="text-center w-100"><i>(No Data)</i></Col> :
      <ResponsiveContainer width={screenWidth} height={screenHeight}>
         <ScatterChart>
            <defs>
               <linearGradient id="xAxisGradient" x1="0" y1="0" x2={screenWidth} y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={CbbColors.off_diff10_p100_redBlackGreen(-10)}/>
                  <stop offset="100%" stopColor={CbbColors.off_diff10_p100_redBlackGreen(10)} stopOpacity={1}/>
               </linearGradient>
               <linearGradient id="yAxisGradient" x1="0" y1="0" x2="0" y2={screenHeight} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={CbbColors.off_diff10_p100_redBlackGreen(10)}/>
                  <stop offset="100%" stopColor={CbbColors.off_diff10_p100_redBlackGreen(-10)} stopOpacity={1}/>
               </linearGradient>
            </defs>

            <ReferenceLine y={0} strokeWidth={1}/>
            <ReferenceLine x={0} strokeWidth={1}/>

            <Legend verticalAlign="bottom" align="center" iconSize={8}/>
            <XAxis 
               type="number" dataKey="x" domain={[-graphLimitX, graphLimitX]}
               axisLine={{ stroke: "url(#xAxisGradient)", strokeWidth: 3 }}
            >
               <Label value={"Offensive RAPM"} position='top' style={{textAnchor: 'middle'}} />
            </XAxis>
            <YAxis 
               type="number" dataKey="y" domain={[-graphLimitY, graphLimitY]}
               axisLine={{ stroke: "url(#yAxisGradient)", strokeWidth: 3 }}
            >               
               <Label angle={-90} value={"Defensive RAPM"} position='insideLeft' style={{textAnchor: 'middle'}} />
            </YAxis>
            <CartesianGrid strokeDasharray="4"/>
            <Scatter data={cachedStats.ab} fill="black" shape="triangle" name={commonParams.team!} legendType="triangle">
               {ScatterChartUtils.buildTidiedLabelList({
                  maxHeight: screenHeight, maxWidth: screenWidth, mutableState: labelState,
                  dataKey: "name", series: cachedStats.ab
               })}
               {_.values(cachedStats.ab).map((p, index) => {
                  return p.seriesId == commonParams.team! ?
                     <Cell key={`cellA-${index}`} fill={CbbColors.off_diff10_p100_redBlackGreen(p.color)}/> :
                     <Cell key={`cellA-${index}`} opacity={0}/>;
               })};
            </Scatter>
            <Scatter data={cachedStats.ab} fill="purple" name={opponent} legendType="circle">
               {ScatterChartUtils.buildTidiedLabelList({
                  maxHeight: screenHeight, maxWidth: screenWidth, mutableState: labelState,
                  dataKey: "name", series: cachedStats.ab
               })}
               {_.values(cachedStats.ab).map((p, index) => {
                  return p.seriesId == opponent ?
                     <Cell key={`cellB-${index}`} fill={CbbColors.off_diff10_p100_redBlackGreen(p.color)}/> :
                     <Cell key={`cellB-${index}`} opacity={0}/>;
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
export default PlayerImpactChart;

