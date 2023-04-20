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

   revalidatedPlacement?: boolean;
};
export interface LabelMoveState {
   labels: Rectangle[];
   dataPointSet: Record<string, Rectangle>;
   blockers: Record<string, number>;
};
export type TidyLabelListProps = LabelListProps<Record<string, any>> & {
   maxHeight: number,
   maxWidth: number,
   mutableState: LabelMoveState, 
   underlinedLabels?: Record<string, boolean>,
   /** This is _all_ the series in the scatter chart, differentiated by labelColor property 
    *  the points will be rendered 2nd time through
   */
   series: any[], 
};

export class ScatterChartUtils {
   static buildEmptyLabelState = (): LabelMoveState => ({
      labels: [], dataPointSet: {}, blockers: {}
   });
   

   /** Allows unlabelled points to act as blocking rectangles for the labelled points */
   static buildLabelColliders = (seriesName: string, props: TidyLabelListProps) => {

      const insertLabelOfRectangle = (labelProps: any, state: LabelMoveState) => {
         const { index, x, y, cx, cy, width, height, value, fill } = labelProps;
         
         const blocker = props.mutableState.blockers[seriesName] || -1;
         if (index <= blocker) {
            if (index == 0) {
               // console.log(`SKIP DUP SERIES ${seriesName} [${_.size(props.series)}] vs blockers: [${JSON.stringify(props.mutableState.blockers)}] state: [${_.size(props.mutableState.labels)}]`);
               // console.log(`${_.chain(props.mutableState.labels.map(r => r.name)).groupBy(n => n).filter(ns => _.size(ns) > 1).value()}`)
            }
            return null;
         } else {
            if (index == 0) {
               // console.log(`SERIES ${seriesName} [${_.size(props.series)}] vs blockers: [${JSON.stringify(props.mutableState.blockers)}] state: [${_.size(props.mutableState.labels)}]`);
            }
            props.mutableState.blockers[seriesName] = index;
         }

         const dataPointObj = props.series[labelProps.index];

         const rectangleOfIcon = { 
            name: `${value}-${seriesName}-dot`, 
            left: cx - 0.5*width, right: cx + 0.5*width, 
            top: cy + 0.5*height, bottom: cy - 0.5*height
         };
         state.labels.push(rectangleOfIcon);
         return null;
      };
      return <LabelList {...props} content={(p) => insertLabelOfRectangle(p, props.mutableState)}/>;
   };

   /** Builds 1 of >1 LabelLists (need >1 or the labels won't render) 
    *  Note that the parent Scatter needs all series (same as props.series)
    * and then you use Cell to make the "wrong" series points not be visible  
   */
   static buildTidiedLabelList = (props: TidyLabelListProps) => {
      //TODO: these aren't quite right because of the margins to left and bottom
      const xOrigin = 60 + 0.5*(props.maxWidth - 60);
      const yOrigin = 0.5*(props.maxHeight - 60);

      const renderCustomizedLabel = (labelProps: any, state: LabelMoveState) => {
         // console.log(labelProps); 
         // console.log(`${labelProps.value} vs ${props.series[labelProps.index]?.name}`);

         const { index, x, y, cx, cy, width, height, value, fill } = labelProps;
         const dataPointObj = props.series[labelProps.index];

         //console.log(`LABEL ${value} vs state: [${_.size(state.labels)}]: (${cx},${cy})+(${width},${height})`);
         
         const approxTextWidth = 6*value.length;  //(1 + 0.8*value.length)*width;
         const approxTextHeight = 14; //2.5*height;
         const boxHeight = height + approxTextHeight; //(add width/height padding)
         const boxWidth = width + approxTextWidth;
         const offRightOfScreen = x + approxTextWidth > props.maxWidth;
         const toLeftMiddleOfScreen = (x >= 0.25*props.maxWidth) && (x <= 0.5*props.maxWidth);
         const leftJustifyLabel = offRightOfScreen || toLeftMiddleOfScreen;
         const offTopOfScreen = (y < (approxTextHeight + 0.5*height));
         const labelRectangle = {
            name: value,
            left: leftJustifyLabel ? x - approxTextWidth - 0.5*width : x, 
            right: leftJustifyLabel ? x + 0.5*width : x + approxTextWidth + width,
   
            top: offTopOfScreen ? (y + approxTextHeight + height) : (y + 0.5*height), 
            bottom: offTopOfScreen ? y : (y - (approxTextHeight + 0.5*height)),
         };
         const rectangleOfIcon = { 
            name: `${value}-dot`, 
            left: cx - 0.5*width, right: cx + 0.5*width, 
            top: cy + 0.5*height, bottom: cy - 0.5*height
         };
         const cacheKey = `${dataPointObj?.seriesId || "series"}-${value}-${index}`;    
         const buildRect = _.thru(state.dataPointSet[cacheKey], rect => {
            // if (value == "XXX") console.log(`cacheLookup: ${cacheKey}: ${JSON.stringify(rect)} (state: ${state.labels.length})`);            
            if (rect && rect.revalidatedPlacement) { //(probably third+ time through)
               return rect;
            } else if (rect) { //(second time through)
               // Double check placement now we've placed both teams
               const iconRect = state.labels.find(rect1 => {
                  return (`${rect.name}-dot` == rect1.name);
               });
               const adjustedRect = moveRectangle(rect, state.labels.filter(rect1 => {
                  return rect1.name != iconRect?.name;
               }), iconRect ? [ iconRect ] : []);

               //if (value == "SoBoum") console.log(`cacheLookup: ${cacheKey}: ${JSON.stringify(rect)} -> ${JSON.stringify(adjustedRect)}`);            

               // Adjust position (if needed)
               rect.bottom = adjustedRect.bottom;
               rect.top = adjustedRect.top;
               rect.left = adjustedRect.left;
               rect.right = adjustedRect.right;
               rect.revalidatedPlacement = true; // OK, no more checking!
               return rect;
            } else { //(first time through)
               const adjustedRect = moveRectangle(labelRectangle, state.labels, [ rectangleOfIcon ]);

               // Mutuate the state
               state.labels.push(adjustedRect);
               state.labels.push(rectangleOfIcon);
               state.dataPointSet[cacheKey] = adjustedRect;
               return adjustedRect;
            }
         });

         // The above code needs to be applied to all series' data points
         // But now we only render elements for this series

         if (buildRect.revalidatedPlacement) {
            const showDebugRects = false;
            const textBlock = <svg x={buildRect.left} y={buildRect.bottom} height={boxHeight} width={boxWidth}>
               {showDebugRects ? 
                  <rect x="0" y="0" height={boxHeight} width={boxWidth} fill={"purple"} opacity={0.25}/>
                  :
                  null
               }
               <text 
                  fontSize="12px"
                  className="recharts-text recharts-label"
                  key={`label-${index}`} 
                  x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
                  textDecoration={props.underlinedLabels?.[value] ? "underline" : undefined}
                  fill={dataPointObj.labelColor || fill} name={value}
               >{value}</text>
            </svg>;
         
            const [ lineOtherEndX, lineOtherEndY ] = _.thru(buildRect, __ => {
               const deltaX = Math.min(Math.abs(cx - buildRect.right), Math.abs(cx - buildRect.left));
               const deltaY = buildRect.bottom - cy; //(recall bottom is lower y ie higher up screen)
               const halfwayX = 0.5*(buildRect.left + buildRect.right);
               const topToBottomLine = [ halfwayX, buildRect.bottom ];
               const bottomToTopLine = [ halfwayX, buildRect.top ];
               const verticalLine = deltaY > 0 ? topToBottomLine : bottomToTopLine;

               if (deltaY >= 1.25*deltaX) { // label is below icon more than to the side
                  // Line goes up/down, join to the top/middle of label
                  return verticalLine;
               } else if ((cx >= buildRect.left) && (cx <= buildRect.right)) {
                  //(special case: icon is directly above label)
                  return verticalLine;
               } else {
                  // Line goes left/right, join to the side of label
                  const lineEdgeX = cx > halfwayX ? buildRect.right : buildRect.left;
                  return [ lineEdgeX, 0.5*(buildRect.bottom + buildRect.top) ];
               }
            });

            const line = ((buildRect == labelRectangle) || doRectanglesOverlap(buildRect, rectangleOfIcon)) 
               ? null :
               <path 
                  d={`M${cx},${cy}L${lineOtherEndX},${lineOtherEndY}`} 
                  stroke="grey" fill="none" 
                  strokeDasharray="3,1"
                  />;
            const debugRectIcon = !showDebugRects ? null : 
            <rect fill={"blue"} opacity={0.25} x={rectangleOfIcon.left} y={rectangleOfIcon.bottom} height={height} width={width}/>;
      
            return (<g>
               {line}
               {debugRectIcon}
               {textBlock}
            </g>);
         } else { // (hasn't finalized its position yet, don't render)
            return null;
         }
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
      function isInSameQuadrant(rect: Rectangle, candidateRect: Rectangle): Boolean {
         // Give a decent amount of grace so in the middle we don't care too much
         const topLeft = (r: Rectangle, loose: number) => (r.left <= (1 + loose)*xOrigin) && (r.bottom <= (1 + loose)*yOrigin); 
         const topRight = (r: Rectangle, loose: number) => (r.right >= (1 - loose)*xOrigin) && (r.bottom <= (1 + loose)*yOrigin); 
         const bottomRight = (r: Rectangle, loose: number) => (r.right >= (1 - loose)*xOrigin) && (r.bottom >= (1 - loose)*yOrigin); 
         const bottomLeft = (r: Rectangle, loose: number) => (r.right <= (1 + loose)*xOrigin) && (r.bottom >= (1 - loose)*yOrigin); 

         // if (candidateRect.name == "XXX") console.log(`(${xOrigin}, ${yOrigin}) ${JSON.stringify(
         //    _.map([
         //       topLeft, topRight, bottomRight, bottomLeft
         //    ], f => f(rect, 0.20) && f(candidateRect, 0))
         // )}: ${JSON.stringify(candidateRect)}`);

         return _.some([
            topLeft, topRight, bottomRight, bottomLeft
         ], f => f(rect, 0.20) && f(candidateRect, 0));
      }
      function buildNonOverlappingRectangles(rect: Rectangle, overlappers: Rectangle, strictAttemptRect?: Rectangle): Rectangle[] {
         const [ dxPre1, dxPre2 ] = getOverlap(rect.left, rect.right, overlappers.left, overlappers.right);
         const [ dyPre1, dyPre2 ] = getOverlap(rect.top, rect.bottom, overlappers.top, overlappers.bottom);
   
         //if (rect.name == "XXX") console.log(`name=[${rect.name}] DX=[${dxPre1}, ${dxPre2}] DY=[${dyPre1}, ${dyPre2}] (rect=[${JSON.stringify(rect)}])`)

         const dx1 = dxPre1 || dyPre1;
         const dx2 = dxPre2 || dyPre2; //(handle the case where x is 0, just to give the rectangle some wiggle room)

         const dy1 = 0.5*(dyPre1 + dx1); //(y adjustments are normally too small compared to x)
         const dy2 = 0.5*(dyPre2 + dx2); //(y adjustments are normally too small compared to x)
   
         //(in the list of scalars below, empirically 1 was too low, the labels were still too close)
         const attemptList = [ 1.2, 2, 3, 4 ];
         return _.orderBy(_.flatMap(attemptList, i => { return [ // Lots of combos:
               [ i*dx1, 0 ], [ i*dx2, 0 ], 
               [ 0, i*dyPre1 ], [ 0, i*dyPre2 ], //(do allow the smaller vertical jumps as well)
               [ 0, i*dy1 ], [ 0, i*dy2 ], 
               [ i*dx1, i*dy1 ], [ i*dx1, i*dy2 ], [ i*dx2, i*dy1 ], [ i*dx2, i*dy2 ],
               [ i*dy1, i*dx1 ], [ i*dy1, i*dx2 ], [ i*dy2, i*dx1 ], [ i*dy2, i*dx2 ] // rotate allowed jumps by 90deg
            ] }), (dXdY: number[]) => (dXdY[0]!*dXdY[0]! + dXdY[1]!*dXdY[1]!) //(try closest first)
            //TODO: in calculating distance, it would be nice to give a bonus to arrows that "radiated from the origin"
            //(do this by Lerping the center of gravity while calc'ing the blockers?)

         ).filter((dXdY: number[]) => {
            const [ dx, dy ] = dXdY;

            const isOnScreen = (rect.left + dx >= 0) && (rect.bottom + dy >= 0) 
            && (rect.right + dx <= props.maxWidth) && (rect.top + dy <= props.maxHeight)

            // if (rect.name == "XXX") console.log(`name=[${rect.name}] DX=[${dx}]+[${rect.right}] DY=[${dy}]+[${rect.top}] vs w=[${props.maxWidth}] h=[${props.maxHeight}], ONSCREEN=${isOnScreen}`)

            return isOnScreen;
         }).filter(
            (dXdY: number[]) => (dXdY[0] != 0) || (dXdY[1] != 0)
         ).map((dXdY: number[]) => {
            const [ dx, dy ] = dXdY;
            return { 
               name: rect.name,
               left: rect.left + dx, right: rect.right + dx, 
               top: rect.top + dy, bottom: rect.bottom + dy, 
            };
         }).filter(candidateRect => !strictAttemptRect || isInSameQuadrant(strictAttemptRect, candidateRect));
      }
      function moveRectangle(rectangle: Rectangle, rectangles: Rectangle[], iconRect: Rectangle[]): Rectangle {
         // Create a list of all the rectangles that overlap with my rectangle
         const overlappingRectangles = rectangles.filter(rect1 => {

         // if (rectangle.name == "XXX") if (rect1.name == "YYY") 
         //    console.log(`No match for ${JSON.stringify(rectangle)} vs ${JSON.stringify(rect1)}: ${doRectanglesOverlap(rect1, rectangle)}`)         

           return (rect1.name != rectangle.name) && doRectanglesOverlap(rect1, rectangle);
         });
         if (_.isEmpty(overlappingRectangles)) {
            // if (rectangle.name == "XXX") console.log(`No match for ${JSON.stringify(rectangle)} vs ${JSON.stringify(rectangles)}`)         
            return rectangle;
         }
         // Otherwise we have some overlap
         const minCoveringRectangle = generateSmallestCoveringRectangle(overlappingRectangles.concat(iconRect));

         // 2 phases: strict (same quadrant) then anything goes
         const getRectangleToReturn = (maybeIconRect?: Rectangle) => {
            const candidateRectangles = buildNonOverlappingRectangles(rectangle, minCoveringRectangle, maybeIconRect);  
            // if (rectangle.name == "XXX") console.log(`${JSON.stringify(rectangle)} (${JSON.stringify(maybeIconRect)}) -> ${JSON.stringify(candidateRectangles[0])} vs ${JSON.stringify(minCoveringRectangle)} (${JSON.stringify(overlappingRectangles)})`);

            // Pick the closest rectangle that hits none of the others      
            const rectanglesPlusLabel = rectangles.concat(iconRect);
            const rectangeToReturn = _.find(candidateRectangles || [], rect => {
               const overlapping = rectanglesPlusLabel.find(rect1 => {
                  const doOverlap = doRectanglesOverlap(rect1, rect)
                  //if (doOverlap && (rectangle.name == "XXX")) console.log(`CMP ${JSON.stringify(rect)} vs ${JSON.stringify(rect1)}: ${doOverlap}`)
                  return (rect1.name != rectangle.name) && doOverlap;
               });
               //  if (!overlapping) {
               //    if (rectangle.name == "XXX") console.log(`2nd check: ${JSON.stringify(rect)}: overlaps: [${JSON.stringify(overlapping)}]`)
               //  }
               return !overlapping;
            });
            // if (!rectangeToReturn && !maybeIconRect) {
            //    console.log(`Giving up and falling back to ${JSON.stringify(candidateRectangles[0])}`)
            // }
            return rectangeToReturn || (maybeIconRect ? undefined : candidateRectangles[0]);
         }   
         return getRectangleToReturn(iconRect?.[0]) || getRectangleToReturn()! || rectangle;
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
            ((rect1.left <= rect2.right) && (rect1.right >= rect2.left))
           &&          
           ((rect1.top >= rect2.bottom) && (rect1.bottom <= rect2.top))
         )
         return cmp(rectA, rectB) || cmp(rectB, rectA); //(not needed but gives me a warm safe glow!)
       }
       
      //(for comparison:)
      //return <LabelList {...props} position="insideBottomLeft"/>;
      return <LabelList {...props} content={(p) => renderCustomizedLabel(p, props.mutableState)}/>;
   };
};