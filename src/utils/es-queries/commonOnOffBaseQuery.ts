import _ from "lodash";

import { GameFilterParams } from "../FilterModels";
import { QueryUtils } from "../QueryUtils";
import { buildQueryFiltersBoolArray } from "./commonTeamQuery";

export const commonOnOffBaseQuery = function(params: GameFilterParams, lastDate: number) {

   const baselineQuery = QueryUtils.basicOrAdvancedQuery(params.baseQuery, '*');

   const buildQueryAndFilter = (queryStr: string | undefined, queryFilterStr: string | undefined, offAndAutoOff: boolean) => {
      const fallbackQuery = queryFilterStr ? "*" : "NOT *";
      const query = { //(note: ignored in the autoOff case)
         "query_string": {
            "query": `(${QueryUtils.basicOrAdvancedQuery(queryStr, fallbackQuery)}) AND (${baselineQuery})`
          }
      };
      if (queryFilterStr) {
         return {
            "bool": { 
               "must": _.flatten([
                  [ query ],
                  buildQueryFiltersBoolArray(queryFilterStr, params.year, lastDate)
               ] as any[]),
               "must_not": offAndAutoOff 
                  ?  buildQueryFiltersBoolArray(params.onQueryFilters, params.year, lastDate)
                  : []
            }
         };
      } else if (offAndAutoOff && params.onQueryFilters) {
         return {
            "bool": {
               "must": [{ //Decompose the 2 queries, since the off-specific one is combined with the query filters' negations
                  "query_string": {
                     "query": `${baselineQuery}`
                   }         
               }],
               "must_not": _.flatten([
                  [{
                     "query_string": {
                        "query": `${QueryUtils.basicOrAdvancedQuery(queryStr, fallbackQuery)}`
                      }
                  }],
                  buildQueryFiltersBoolArray(params.onQueryFilters, params.year, lastDate)
               ] as any[])
            }
         }
      } else {
         return query as any;
      }
   };

  return {
    "filters": {
      "off": buildQueryAndFilter(params.offQuery, params.autoOffQuery ? undefined : params.offQueryFilters, params.autoOffQuery || false),
      "on": buildQueryAndFilter(params.onQuery, params.onQueryFilters, false),
       "baseline": {
          "query_string": {
             "query": baselineQuery
          }
       }
    }
  };
}
