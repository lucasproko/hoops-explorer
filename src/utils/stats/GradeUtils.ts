// Lodash
import _ from "lodash";

import { DivisionStatistics, Statistic } from '../StatModels';

/** Utility functions for calculating percentile/grade related statistics */
export class GradeUtils {

   /** Note first entry is the offset of the LUT entry */
   static binaryChop(array: Array<number>, val: number, index1: number, index2: number): number {
      if (index1 == index2) { //no choice
         return array[0]! + index1 - 1; //(because index is relative to the 2nd element of array, 1st is offset)
      } else {
         const nextIndex = Math.floor(0.5*(index1 + index2)); 
         const nextVal = array[nextIndex]!;
         const nextNextVal = (nextIndex < index2) ? array[nextIndex + 1]! : 10000; //(always match in latter case)
         const nextPrevVal = (nextIndex > index1) ? array[nextIndex - 1]! : -10000; //(always match in latter case)

         //(for debugging:)
         //console.log(`${val.toFixed(5)} VS ${index1} ... ${nextPrevVal.toFixed(5)} - ${nextIndex}:${nextVal.toFixed(5)}  - ${index2} ... ${nextNextVal.toFixed(5)}`)

         if ((nextVal == val) || ((val > nextVal) && (val < nextNextVal))) {
            return array[0]! + nextIndex - 1; //(because index is relative to the 2nd element of array, 1st is offset)
         } else if ((val < nextVal) && (val >= nextPrevVal)) {
            return array[0]! + nextIndex - 2; //(because index is relative to the 2nd element of array, 1st is offset)
         } else if (val < nextVal) { // Need a bigger jump downwards
            if (nextIndex == index2) {
               return array[0]! > 0 ? (array[0]! - 1) : array[0]!;
            } else {
               return GradeUtils.binaryChop(array, val, index1, nextIndex);
            }
         } else { // Need a bigfer jump upwards
            if (nextIndex == index1) { //(can't go any higher)
               return array[0]! + index2 - 1; 
            } else {
               return GradeUtils.binaryChop(array, val, nextIndex, index2);
            }
         }
      }
   }

   /** Calculate the percentile of a given field */
   static getPercentile = (divStats: DivisionStatistics, field: string, val: number) => {
      const divStatsField = divStats.tier_lut[field];
      if (divStatsField) {
         const lookupKey = (divStatsField.isPct ? (val*100) : val).toFixed(0);
         const lutArray = divStatsField.lut[lookupKey];
         if (!lutArray && (val <= (divStatsField.min + 0.001))) {
            return { value: 0.01 } as Statistic; //1st percentile
         } else if (!lutArray) {
            return { value: 1.00 } as Statistic; //100% percentile
         } else { //lutArray
            const offsetIndex = GradeUtils.binaryChop(lutArray, val, 1, lutArray.length - 1);
            return { value: offsetIndex/(divStatsField.size || 1) };
         }
      } else {
         return {} as Statistic;
      }
   };

}