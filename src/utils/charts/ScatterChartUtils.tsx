// React imports:
import _ from 'lodash';
import React from 'react';
import { LabelList, LabelListProps } from 'recharts';

interface Rectangle {
   name: string;

   left: number;
   right: number;

   /** the higher number, ie the _lower_ value on the screen! */
   top: number;
   /** the lower number, ie the _higher_ value on the screen! */
   bottom: number; 
};
export interface LabelMoveState {
   labels: Rectangle[];
   dataPointSet: Record<string, Rectangle>;
};
export type TidyLabelListProps = LabelListProps<Record<string, any>> & {
   maxHeight: number,
   maxWidth: number,
   textColorOverride?: string,
   mutableState: LabelMoveState
};

export class ScatterChartUtils {
   static buildEmptyLabelState = (): LabelMoveState => ({
      labels: [], dataPointSet: {}
   });
   
   static buildTidiedLabelList = (props: TidyLabelListProps) => {
      const renderCustomizedLabel = (labelProps: any, state: LabelMoveState) => {
         //console.log(labelProps); 
         const { index, x, y, cx, cy, width, height, value, fill } = labelProps;
   
         const approxTextWidth = (1 + 0.8*value.length)*width;
         const approxTextHeight = 2.5*height;
         const boxHeight = 3.5*height;
         const offLeftOfScreen = x + approxTextWidth > props.maxWidth;
         const offTopOfScreen = (y < approxTextHeight);
         const labelRectangle = {
            name: value,
            left: offLeftOfScreen ? x - approxTextWidth : x, 
            right: offLeftOfScreen ? x : x + approxTextWidth,
   
            top: offTopOfScreen ? (y + boxHeight) : (y + height), 
            bottom: offTopOfScreen ? y : (y - approxTextHeight),
         };
         const rectangleOfIcon = { name: "dot", left: cx - width, right: cx + width, top: cy + height, bottom: cy - height };
         const buildRect = _.thru(state.dataPointSet[value], rect => {
            if (rect) {
               return rect;
            } else {
               const adjustedRect = moveRectangle(labelRectangle, state.labels);
               // Mutuate the state
               state.labels.push(adjustedRect);
               state.labels.push(rectangleOfIcon);
               state.dataPointSet[value] = adjustedRect;
               return adjustedRect;
            }
         });
         const textBlock = <text 
            fontSize="small"
            className="recharts-text recharts-label"
            key={`label-${index}`} textAnchor="start" 
            x={buildRect.left + width} y={buildRect.top - height} 
            fill={props.textColorOverride || fill} name={value}
         >{value}</text>;
   
         const lineEdgeX = cx > (buildRect.left + 0.5*approxTextWidth) ? buildRect.right : buildRect.left;
   
         const line = ((buildRect == labelRectangle) || doRectanglesOverlap(buildRect, rectangleOfIcon)) 
            ? null :
            <path 
               d={`M${cx},${cy}L${lineEdgeX},${buildRect.top - 0.5*approxTextHeight}`} 
               stroke="grey" fill="none" 
               strokeDasharray="3,1"
               />;
         const debugRect = true ? null : 
           <rect fill={"purple"} opacity={0.25} x={buildRect.left} y={buildRect.bottom} height={boxHeight} width={approxTextWidth}/>;
   
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
         const [ dyPre1, dyPre2 ] = getOverlap(rect.top, rect.bottom, overlappers.top, overlappers.bottom);
   
         const dy1 = 0.5*(dyPre1 + dx1); //(y adjustments are normally too small compared to x)
         const dy2 = 0.5*(dyPre2 + dx2); //(y adjustments are normally too small compared to x)
   
         return _.orderBy(_.flatMap(_.range(1, 4), i => { return [ // Lots of combos:
               [ i*dx1, 0 ], [ i*dx2, 0], 
               [ i*0.5*dx1, i*0.5*dy1 ], [ i*0.5*dx1, i*0.5*dy2 ], [ i*0.5*dx2, i*0.5*dy1 ], [ i*0.5*dx2, i*0.5*dy2 ],
               [ i*dx1, i*dy1 ], [ i*dx1, i*dy2 ], [ i*dx2, i*dy1 ], [ i*dx2, i*dy2 ]
            ] }), (dXdY: number[]) => (dXdY[0]!*dXdY[0]! + dXdY[1]!*dXdY[1]!)
         ).filter((dXdY: number[]) => {
            const [ dx, dy ] = dXdY;
            return (rect.left + dx >= 0) && (rect.bottom + dy >= 0) 
               && (rect.right + dx <= props.maxWidth) && (rect.top + dy <= props.maxHeight);
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
         const minCoveringRectangle = generateSmallestCoveringRectangle(overlappingRectangles);
         const candidateRectangles = buildNonOverlappingRectangles(rectangle, minCoveringRectangle);
   
         // console.log(`${JSON.stringify(rectangle)} -> ${JSON.stringify(candidateRectangles[0])} vs ${JSON.stringify(minCoveringRectangle)} (${JSON.stringify(overlappingRectangles)})`);
   
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
};