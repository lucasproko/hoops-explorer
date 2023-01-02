// React imports:
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { CartesianGrid, Cell, Label, LabelList, LabelListProps, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
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

interface Rectangle {
   name: string;

   left: number;
   right: number;

   /** the higher number, ie the _lower_ value on the screen! */
   top: number;
   /** the lower number, ie the _higher_ value on the screen! */
   bottom: number; 
};
interface LabelMoveState {
   labels: Rectangle[];
   dataPointSet: Record<string, Rectangle>;
};
type TidyLabelListProps = LabelListProps<Record<string, any>> & {
   maxHeight: number,
   maxWidth: number,
   textColorOverride?: string,
   mutableState: LabelMoveState
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
      return (rapmInfo?.enrichedPlayers || []).map(
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

   const buildTidiedLabelList = (props: TidyLabelListProps) => {
      const renderCustomizedLabel = (labelProps: any, state: LabelMoveState) => {
         //console.log(labelProps); //fill if not override
         const { index, x, y, cx, cy, width, height, value } = labelProps;
   
         const approxTextWidth = (1 + 0.8*value.length)*width;
         const approxTextHeight = 2.5*height;
         const boxHeight = 3.5*height;
         const offTopOfScreen = (y < approxTextHeight);
         const labelRectangle = {
            name: value,
            left: x, right: x + approxTextWidth,
   
            top: offTopOfScreen ? (y + boxHeight) : (y + height), 
            bottom: offTopOfScreen ? y : (y - approxTextHeight),
         };
         const buildRect = _.thru(state.dataPointSet[value], rect => {
            if (rect) {
               return rect;
            } else {
               const adjustedRect = moveRectangle(labelRectangle, state.labels);
               // Mutuate the state
               state.labels.push(adjustedRect);
               state.dataPointSet[value] = adjustedRect;
               return adjustedRect;
            }
         });
   
         const textBlock = <text 
            fontSize="small"
            className="recharts-text recharts-label"
            key={`label-${index}`} textAnchor="start" 
            x={buildRect.left + width} y={buildRect.top - height} 
            fill="black" name={value}
         >{value}</text>;
   
         const lineEdgeX = cx > (buildRect.left + 0.5*approxTextWidth) ? buildRect.right : buildRect.left;
   
         const rectangleOfIcon = { name: "dot", left: cx - width, right: cx + width, top: cy + height, bottom: cy - height };
         const line = ((buildRect == labelRectangle) || doRectanglesOverlap(buildRect, rectangleOfIcon)) 
            ? null :
            <path 
               d={`M${cx},${cy}L${lineEdgeX},${buildRect.top - 0.5*approxTextHeight}`} 
               stroke="grey" fill="none" 
               strokeDasharray="3,1"
               />;
   
         const debugRect = true ? null : 
           <rect fill="purple" opacity={0.25} x={buildRect.left} y={buildRect.bottom} height={boxHeight} width={approxTextWidth}/>;
   
         return (<g>
            {line}
            {debugRect}
            {textBlock}
         </g>);
      };
   
      // CHAT GPT CODE (j/k I had to rewrite it all, ChatGPT is not the best!)
      function generateSmallestCoveringRectangle(rectangles: Rectangle[]): Rectangle {
         if (rectangles.length === 0) {
           return { name: "overlap", left: 0, right: 0, top: 0, bottom: 0 };
         }
         let top = rectangles[0].top;
         let right = rectangles[0].right;
         let bottom = rectangles[0].bottom;
         let left = rectangles[0].left;
         rectangles.forEach((rect) => {
           top = Math.min(top, rect.top);
           right = Math.max(right, rect.right);
           bottom = Math.max(bottom, rect.bottom);
           left = Math.min(left, rect.left);
         });
         return { name: "overlap", left, right, top, bottom };
      };
      function buildNonOverlappingRectangles(rect: Rectangle, overlappers: Rectangle): Rectangle[] {
         const [ dx1, dx2 ] = getOverlap(rect.left, rect.right, overlappers.left, overlappers.right);
         const [ dy1, dy2 ] = getOverlap(rect.top, rect.bottom, overlappers.top, overlappers.bottom);
         return _.orderBy(_.flatMap(_.range(1, 4), i => { return [ // Lots of combos:
               [ i*dx1, 0 ], [ 0, i*dy1 ], [ i*dx2, 0], [ 0, i*dy2 ], 
               [ i*dx1, i*dy1 ], [ i*dx1, i*dy2 ], [ i*dx2, i*dy1 ], [ i*dx2, i*dy2 ]
            ] }), (dXdY: number[]) => (dXdY[0]!*dXdY[0]! + dXdY[1]!*dXdY[1]!)
         ).filter((dXdY: number[]) => {
            const [ dx, dy ] = dXdY;
            return (rect.left + dx >= 0) && (rect.bottom + dy >= 0);
         }).filter(
            (dXdY: number[]) => (dXdY[0] != 0) || (dXdY[1] != 0)
         ).map((dXdY: number[]) => {
            const [ dx, dy ] = dXdY;
            return { 
               name: rect.name,
               left: rect.left + dx, right: rect.right + dx, 
               top: rect.top + dy, bottom: rect.bottom + dy, 
            };
         });
      }
      function moveRectangle(rectangle: Rectangle, rectangles: Rectangle[]): Rectangle {
         // Create a list of all the rectangles that overlap with my rectangle
         const overlappingRectangles = rectangles.filter(rect1 => {
           return rect1 !== rectangle && doRectanglesOverlap(rect1, rectangle);
         });
         if (_.isEmpty(overlappingRectangles)) {
            // console.log(`No match for ${JSON.stringify(rectangle)} vs ${JSON.stringify(rectangles)}`)         
            return rectangle;
         }
         // Otherwise we have some overlap
         const minCoveringRectange = generateSmallestCoveringRectangle(overlappingRectangles);
         const candidateRectangles = buildNonOverlappingRectangles(rectangle, minCoveringRectange);
   
         // console.log(`${JSON.stringify(rectangle)} -> ${JSON.stringify(candidateRectangles[0])} vs ${JSON.stringify(minCoveringRectange)} (${JSON.stringify(overlappingRectangles)})`);
   
         // Pick the closest rectangle that hits none of the others
         const rectangeToReturn = _.find(candidateRectangles || [], rect => {
            const overlapping = rectangles.find(rect1 => {
               const doOverlap = doRectanglesOverlap(rect1, rect)
               //if (rectangle.name == "XXX") console.log(`CMP ${JSON.stringify(rect)} vs ${JSON.stringify(rect1)}: ${doOverlap}`)
               return (rect1 !== rectangle) && doOverlap;
             });
            //  if (!overlapping) {
            //    console.log(`2nd check: ${JSON.stringify(rect)}: overlaps: [${JSON.stringify(overlapping)}]`)
            //  }
             return !overlapping;
         });
         // if (!rectangeToReturn) {
         //    console.log(`Giving up and falling back to ${JSON.stringify(candidateRectangles[0])}`)
         // }
         return rectangeToReturn || candidateRectangles[0];
       }
       
       // Returns the amount that two intervals overlap, or 0 if they don't overlap
       function getOverlap(a1: number, a2: number, b1: number, b2: number): [ number, number ] {
           // eg A1.B1...B2..A2 or A1..B1...A2.B2
           // or B1.A1..A2...B2 or B1..A1...B2.A2
         return [ -Math.max(0, a2 - b1), Math.max(0, b2 - a1) ];
       }
       
       // Returns true if the two rectangles overlap, false otherwise
       function doRectanglesOverlap(rectA: Rectangle, rectB: Rectangle): boolean {
         const cmp = (rect1: Rectangle, rect2: Rectangle) => (
            ((rect1.left <= rect2.right) && (rect1.left >= rect2.left) ||
            (rect1.right <= rect2.right) && (rect1.right >= rect2.left))
           &&          
           ((rect1.top <= rect2.top) && (rect1.top >= rect2.bottom) ||
           (rect1.bottom <= rect2.top) && (rect1.bottom >= rect2.bottom))
         )
         return cmp(rectA, rectB) || cmp(rectB, rectA);
       }
       
      return <LabelList {...props} content={(p) => renderCustomizedLabel(p, props.mutableState)}/>;
   };

   ////////////////// END CHATGPT CODE (lolno)

   const labelState: LabelMoveState = { labels: [], dataPointSet: {}}; 

   return  _.isEmpty(cachedStats.a) ? <div>(Loading)</div> :
      <ResponsiveContainer width={"100%"} height={400}>
         <ScatterChart>
            <XAxis type="number" dataKey="x" domain={[-graphLimit, graphLimit]}>
               <Label value={"Offensive RAPM"} position='top' style={{textAnchor: 'middle'}} />
            </XAxis>
            <YAxis type="number" dataKey="y" domain={[-graphLimit, graphLimit]}>
               <Label angle={-90} value={"Defensive RAPM"} position='insideLeft' style={{textAnchor: 'middle'}} />
            </YAxis>
            <CartesianGrid strokeDasharray="4"/>
            <Scatter data={cachedStats.b} fill="green">
               {buildTidiedLabelList({
                  maxHeight: 0, maxWidth: 0, textColorOverride: "black", mutableState: labelState,
                  dataKey: "name"
               })}
               {_.values(cachedStats.b).map((p, index) => {
                  return <Cell key={`cell-${index}`} fill={CbbColors.off_diff10_p100_redBlackGreen(p.color)}/>
               })};
            </Scatter>
            <Scatter data={cachedStats.a} fill="green">
               {buildTidiedLabelList({
                  maxHeight: 0, maxWidth: 0, textColorOverride: "purple", mutableState: labelState,
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

