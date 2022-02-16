// Lodash
import _ from "lodash";

import { DivisionStatistics, Statistic, TeamStatSet, PureStatSet } from '../StatModels';

/** Utility functions for calculating percentile/grade related statistics */
export class GradeUtils {

   /** Fields to record that are part of the query response (apart from "net", which is derived) */
   static readonly fieldsToRecord = [ 
      "net", "ppp", "adj_ppp", 
      "efg", "to", "orb", "ftr", "assist", "3pr", "2pmidr", "2primr", 
      "3p", "2p", "2pmid", "2prim", "adj_opp"
    ];

   /** Add a team's stats to the divison stats collection  */
   static buildAndInjectDivisionStats = (teamBaseline: TeamStatSet, mutableDivisionStats: DivisionStatistics, inNaturalTier: boolean) => {
      //TODO: more complex: also derived fields (scoring %s, transition + scramble play)
      mutableDivisionStats.tier_sample_size += 1;
      if (inNaturalTier) {
        mutableDivisionStats.dedup_sample_size += 1;
      }
      _.chain(GradeUtils.fieldsToRecord).flatMap(field => [ `off_${field}`, `def_${field}` ]).forEach(field => {
         const maybeStat = teamBaseline[field]?.value;
         if (!_.isNil(maybeStat)) {
           if (!mutableDivisionStats.tier_samples[field]) {
             mutableDivisionStats.tier_samples[field] = [];
           }
           mutableDivisionStats.tier_samples[field]!.push(maybeStat);

           if (inNaturalTier) {
             if (!mutableDivisionStats.dedup_samples[field]) {
               mutableDivisionStats.dedup_samples[field] = [];
             }
             mutableDivisionStats.dedup_samples[field]!.push(maybeStat);
           }
         }
      }).value();
   };

   /** Convert an unsorted list of samples into an LUT for Divison Stats */
   static buildAndInjectDivisionStatsLUT = (mutableUnsortedDivisionStats: DivisionStatistics) => {
      const sort = (samples: Record<string, Array<number>>) => {
         return _.transform(samples, (acc, value, key) => {
           acc[key] = _.sortBy(value);
         }, {} as Record<string, Array<number>>);  
      }
      mutableUnsortedDivisionStats.dedup_samples = sort(mutableUnsortedDivisionStats.dedup_samples);
      //(this is a waste of cycles since will sort again in "Combo", but useful for debugging and not on performance critical path)

      const tier_samples = sort(mutableUnsortedDivisionStats.tier_samples);
      mutableUnsortedDivisionStats.tier_lut = _.transform(tier_samples, (acc, sample_set, field) => {
        const last_val = sample_set[sample_set.length - 1];
        acc[field] = _.transform(sample_set, (lutObj, val) => {
     
         const lutKey = (lutObj.isPct ? 100*val : val).toFixed(0);
         const currLutVal = lutObj.lut[lutKey];
         if (_.isNil(currLutVal)) { // New entry
           lutObj.lut[lutKey] = [ lutObj.size , val ];
          } else { // Existing entry, append
            currLutVal.push(val);
            }
           lutObj.size = lutObj.size + 1;
         }, {
           isPct: (sample_set[0] >= -1) && (sample_set[0] <= 1) && (last_val >= -1) && (last_val <= 1),
           min: sample_set[0],
           size: 0, //(will mutate this to size during the loop)
           lut: {} as Record<string, Array<number>>
         })
       }, {} as Record<string, any>);
     
       mutableUnsortedDivisionStats.tier_samples = {}; //(replace this by LUT)       
   };

   /** Note first entry is the offset of the LUT entry */
   static binaryChop(array: Array<number>, val: number, index1: number, index2: number): number {
      //TODO: not my finest code, written while I wasn't feeling great in a stream-of-consciousness. Maybe rewrite sometime?

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
   static getPercentile(divStats: DivisionStatistics, field: string, val: number): Statistic | undefined {
      const divStatsField = divStats.tier_lut[field];
      if (divStatsField) {
         const lookupKey = (divStatsField.isPct ? (val*100) : val).toFixed(0);
         const lutArray = divStatsField.lut[lookupKey];

         if (!lutArray && (val <= (divStatsField.min + 0.001))) {
            return { value: 0.01, samples: divStatsField.size } as Statistic; //1st percentile
         } else if (!lutArray) {
            return { value: 1.00, samples: divStatsField.size } as Statistic; //100% percentile
         } else { //lutArray
            const offsetIndex = GradeUtils.binaryChop(lutArray, val, 1, lutArray.length - 1);
            return { value: Math.max(0.01, offsetIndex/(divStatsField.size || 1)), samples: divStatsField.size };
         }
      } else {
         return {};
      }
   };

   static readonly fieldsToInvert = {
      off_to: true, def_to: true,
      // Frequency:
      def_net: true, def_assist: true, def_3pr: true, def_2pmidr: true, def_2primr: true
   } as Record<string, boolean>;

   /** Calculate the percentile of all fields within a stat set */
   static buildTeamPercentiles = (divStats: DivisionStatistics, team: TeamStatSet, supportRank: boolean): PureStatSet => {
      const format = (f: string, s: Statistic | undefined) => {
         const isDef = f.startsWith("def_");
         const isInverted = GradeUtils.fieldsToInvert[f] || false;
         const invert = (!isDef && isInverted) || (isDef && !isInverted);
         const maybeInvert = (invert) ?
            (s && _.isNumber(s.value) ? { value: 1.01 - s.value, samples: supportRank ? s.samples : 0 } : s)
            : { value: s?.value, samples: supportRank ? s?.samples : 0 };
         return maybeInvert;
      }
      return _.chain(divStats.tier_lut).mapValues((val, key) => {
         const adjustedKey = (key == "def_net" ? "off_raw_net" : key);
         const teamVal = team[adjustedKey]?.value;
         return _.isNumber(teamVal) ? 
            format(key, GradeUtils.getPercentile(divStats, key, teamVal)) 
            : undefined;
      }).omitBy(_.isNil).value() as PureStatSet;
   }
}