// Lodash
import _ from "lodash";

import { DivisionStatistics, Statistic, TeamStatSet, PureStatSet } from '../StatModels';

type QualifyingCriterion = [ string, number ];

/** Utility functions for calculating percentile/grade related statistics */
export class GradeUtils {

   /** For players, only use their stats for grades if they've played 40% of possessions (same for display, but will allow override) */
   static readonly minPossPctForInclusion = 0.4;

   /** Fields to be used for player grades, _plus_ "qualifying" criteria for including them */
   static readonly playerFields: Record<string, QualifyingCriterion | undefined> = { //(qualifying possessions will always be 40% for consistency with KenPom?)
      //TODO: poss%, poss count, SoS
      // Overall production
      "off_rtg": undefined, "def_rtg": undefined,
      "off_adj_rtg": undefined, "def_adj_rtg": undefined,
      "off_adj_prod": undefined, "def_adj_prod": undefined,
      "off_adj_rapm": undefined, "def_adj_rapm": undefined,
      "off_adj_rapm_prod": undefined, "def_adj_rapm_prod": undefined,
      "off_usage": undefined,
      // Assists, TOs, steals, blocks, fouls
      "off_ast": undefined,
      "off_to": undefined,
      "def_stl": undefined,
      "def_blk": undefined,
      "def_ftr": undefined, // (FC/50) TODO invert
      // Rebounding:
      "off_drb": undefined,
      "def_drb": undefined,
      // Shooting % stats
      "off_efg": [ "off_team_poss_pct", 0.6 ],
      "off_3p": [ "total_off_3p_attempts", 60 ],
      "off_2p": [ "total_off_2p_attempts", 60 ],
      "off_2pmid": [ "total_off_2pmid_attempts", 60 ],
      "off_2prim": [ "total_off_2pim_attempts", 60 ],
      // Shooting style
      "off_3pr": undefined,
      "off_2pmidr": undefined,
      "off_2primr": undefined,
      "def_3pr": [ "total_off_3p_attempts", 60 ], //(assisted %s)
      "def_2pmidr": [ "total_off_2pmid_attempts", 60 ],
      "def_2primr": [ "total_off_2pim_attempts", 60 ],
      //TODO: assisted% (will want so min criteria for that)
      "off_ftr": [ "off_team_poss_pct", 0.6 ], //TODO: handle %
      // Other stylistic grades: assist breakdowns, transition, scramble etc
      //TODO
   };

   /** Fields to record that are part of the query response (apart from "net", which is derived) */
   static readonly fieldsToRecord = [ 
      "net", "ppp", "adj_ppp", 
      "efg", "to", "orb", "ftr", "assist", "3pr", "2pmidr", "2primr", 
      "3p", "2p", "2pmid", "2prim", "adj_opp",

      // Not in table
      "3p_opp"
    ];

   /* Fields derived in DerivedStatsUtils */
   static readonly derivedFields = [
       "scramble", "scramble_per_orb", "scramble_ppp", "scramble_delta_ppp",
       "trans", "trans_ppp", "trans_delta_ppp",
       "scramble_to", "scramble_ftr", "scramble_3pr", "scramble_3p", "scramble_2p",
       "trans_to", "trans_ftr", "trans_3pr", "trans_3p", "trans_2p",

      // Not in dataset but used here in extra dialog, so include for convenience (ignored if not present anyway)
      "3p_opp"
    ];

   /** Add a team's stats to the divison stats collection  */
   static buildAndInjectDivisionStats = (teamBaseline: PureStatSet, derivedStats: PureStatSet, mutableDivisionStats: DivisionStatistics, inNaturalTier: boolean, fields: Array<string> | undefined = undefined) => {
      //TODO: more complex: also style-based fields
      mutableDivisionStats.tier_sample_size += 1;
      if (inNaturalTier) {
        mutableDivisionStats.dedup_sample_size += 1;
      }
      const updateForField = (field: string, dataSet: PureStatSet) => {
         const maybeStat = dataSet[field]?.value;
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
      }
      if (_.isNil(fields)) {
         _.chain(GradeUtils.fieldsToRecord).flatMap(field => [ `off_${field}`, `def_${field}` ])
            .forEach(f => updateForField(f, teamBaseline)).value();
         _.chain(GradeUtils.derivedFields).flatMap(field => [ `off_${field}`, `def_${field}` ]).concat([ "tempo" ])
            .forEach(f => updateForField(f, derivedStats)).value();
      } else { // manually specified fields
         _.chain(fields).forEach(f => updateForField(f, teamBaseline)).value();
      }
   };

   /** Add a team's stats to the divison stats collection  */
   static buildAndInjectPlayerDivisionStats = (playerStats: PureStatSet, derivedStats: PureStatSet, mutableDivisionStats: DivisionStatistics, inNaturalTier: boolean, fields: Array<string> | undefined = undefined) => {
      const possPct = playerStats?.off_team_poss_pct?.value || 0;
      if (possPct >= GradeUtils.minPossPctForInclusion) {
         mutableDivisionStats.tier_sample_size += 1;
         if (inNaturalTier) {
           mutableDivisionStats.dedup_sample_size += 1;
         }
         //(this will be inaccurate for fields with addition criteria but it's only used for display anyway)
         const updateForField = (field: string, dataSet: PureStatSet) => {
            const maybeStat = dataSet[field]?.value;
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
         }
         const manualFieldSet = _.isNil(fields) ? new Set([]) : new Set(fields);
         const fieldChain = _.chain(GradeUtils.playerFields).toPairs().filter(kv => {
            return _.isNil(fields) ? true : manualFieldSet.has(kv[0]);
         }).flatMap(kv => {
            const key = kv[0];
            const value = kv[1];
            if (!value) {
               return [ key ];
            } else { // Check if the qualifying criteria are met for each field
               const [ field, criterion ] = value;
               return ((playerStats?.[field]?.value || 0) >= criterion) ? [ field ] : [];
            }
         });
         fieldChain.forEach(f => updateForField(f, playerStats)).value();
      }
   }

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

   private static readonly MIN = -10000;
   private static readonly MAX = 10000;

   /** Note first entry is the offset of the LUT entry - always go higher */
   static binaryChop(array: Array<number>, val: number, index1: number, index2: number): number {
      //TODO: not my finest code, written while I wasn't feeling great in a stream-of-consciousness. Maybe rewrite sometime?

      if (index1 == index2) { //no choice
         return array[0]! + index1 - 1; //(because index is relative to the 2nd element of array, 1st is offset)
      } else {
         const midIndex = Math.floor(0.5*(index1 + index2)); 
         const midVal = array[midIndex]!;
         const midValPlus1 = (midIndex < index2) ? array[midIndex + 1]! : GradeUtils.MAX; //(always match in latter case)
         const midValMinus1 = (midIndex > index1) ? array[midIndex - 1]! : GradeUtils.MIN; //(always match in latter case)

         //(for debugging:)
         //console.log(`${val.toFixed(5)} VS ${index1} ... ${midValMinus1.toFixed(5)} - ${midIndex}:${midVal.toFixed(5)}  - ${index2} ... ${midValPlus1.toFixed(5)} (start: [${array[0]}])`)

         if ((val > midVal) && (val <= midValPlus1)) {
            return array[0]! + midIndex; //(-1 because 0 is offset, but +1 because we pick next higher index)
         } else if ((val <= midVal) && (val > midValMinus1)) {
            return array[0]! + midIndex - 1; //(as above but one back)
         } else if (val == midValMinus1) {
            return array[0]! + midIndex - 2;
         } else if (val < midVal) { // Need a bigger jump downwards
            if (midIndex == index2) {
               return array[0]!; // never go lower (by construction - we'd hit the previous LUT element)
            } else {
               return GradeUtils.binaryChop(array, val, index1, midIndex);
            }
         } else { // Need a bigfer jump upwards
            if (midIndex == index1) { //(can't go any higher)
               return array[0]! + index2; 
            } else {
               return GradeUtils.binaryChop(array, val, midIndex, index2);
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
         const minPctile = 1.0/(divStatsField.size);

         if (!lutArray && (val <= (divStatsField.min + 0.001))) {
            return { value: minPctile, samples: divStatsField.size } as Statistic; //1st percentile
         } else if (!lutArray) {
            // Either it's a split stat so doesn't appear in the LUT, or it's off the end of the chart
            // (slow may need/want to speed this up)
            const closestLutArray = _.find(divStatsField.lut, (arr, key) => {
               return (arr.length > 1) && arr[1]! > val;
            });
            if (closestLutArray) {
               return { value: Math.max(minPctile, (closestLutArray[0]! + 1)*minPctile), samples: divStatsField.size };
                  //(+1 because we don't want index we want rank)               
            } else {
               return { value: 1.00, samples: divStatsField.size } as Statistic; //100% percentile
            }
         } else { //lutArray
            const offsetIndex = GradeUtils.binaryChop(lutArray, val, 1, lutArray.length - 1); //(minPctile is lowest)
            return { value: Math.max(minPctile, (offsetIndex + 1)*minPctile), samples: divStatsField.size };
               //(+1 because we don't want index we want rank)
         }
      } else {
         return {};
      }
   };

   static readonly fieldsToInvert = {
      off_to: true, def_to: true, 
      off_scramble_to: true, def_scramble_to: true, off_trans_to: true, def_trans_to: true, 
      // The higher the defensive SoS the higher the rank should be:
      def_3p_opp: true,
      // Frequency:
      def_net: true, def_assist: true, def_3pr: true, def_2pmidr: true, def_2primr: true,
      def_trans_3pr: true, def_scramble_3pr: true, 
   } as Record<string, boolean>;

   static readonly combinedStat = { //(no off/def)
      tempo: true
   } as Record<string, boolean>;

   /** Calculate the percentile of all fields within a stat set */
   static buildTeamPercentiles = (divStats: DivisionStatistics, team: PureStatSet, fieldList: string[], supportRank: boolean): PureStatSet => {
      const format = (f: string, s: Statistic | undefined) => {
         const isDef = f.startsWith("def_");
         const isInverted = GradeUtils.fieldsToInvert[f] || false;
         const invert = (!isDef && isInverted) || (isDef && !isInverted);
         const maxPct = 1 + 1.0/(s?.samples || 1); //(since 100% is rank 1)
         const maybeInvert = (invert) ?
            (s && _.isNumber(s.value) ? { value: maxPct - s.value, samples: supportRank ? s.samples : 0 } : s)
            : { value: s?.value, samples: supportRank ? s?.samples : 0 };
         return maybeInvert;
      }
      const offDefFieldList = _.flatMap(
         fieldList, field => GradeUtils.combinedStat[field] ? [ field ] : [`off_${field}`, `def_${field}` ]
      );
      return _.chain(offDefFieldList).map(key => {
         const adjustedKey = (key == "def_net" ? "off_raw_net" : key);
         const teamVal = team[adjustedKey]?.value;
         return [ key, _.isNumber(teamVal) ? 
            format(key, GradeUtils.getPercentile(divStats, key, teamVal)) 
            : undefined ];
      }).fromPairs().omitBy(_.isNil).value() as PureStatSet;
   }
}