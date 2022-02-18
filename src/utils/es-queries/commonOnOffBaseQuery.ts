import _ from "lodash";

import { GameFilterParams } from "../FilterModels";
import { QueryUtils } from "../QueryUtils";
import { buildQueryFiltersBoolArray } from "./commonTeamQuery";

export const commonOnOffBaseQuery = function(params: GameFilterParams, lastDate: number) {

   const baselineQuery = QueryUtils.basicOrAdvancedQuery(params.baseQuery, '*');

   const buildQueryAndFilter = (queryStr: string | undefined, queryFilterStr: string | undefined, offAndAutoOff: boolean) => {
      const query = {
         "query_string": {
            "query": `(${QueryUtils.basicOrAdvancedQuery(queryStr, 'NOT *')}) AND (${baselineQuery})`
          }
      };
      if (queryFilterStr) {
         return {
            "bool": { //(see also commonTeamQuery - changes here are likely also required there)
               "must": _.flatten([
                  [ query ],
                  buildQueryFiltersBoolArray(queryFilterStr, params.year, lastDate)
               ] as any[]),
               "must_not": offAndAutoOff ? [
                  buildQueryFiltersBoolArray(params.onQueryFilters, params.year, lastDate)
               ] : []
            }
         };
      } else {
         return query as any;
      }
   };

  return {
    "filters": {
      "off": buildQueryAndFilter(params.offQuery, params.offQueryFilters, params.autoOffQuery || false),
      "on": buildQueryAndFilter(params.onQuery, params.onQueryFilters, false),
       "baseline": {
          "query_string": {
             "query": baselineQuery
          }
       }
    }
  };
}
