
import { QueryUtils } from "../QueryUtils";

export const commonOnOffBaseQuery = function(params: any) {

  const baselineQuery = QueryUtils.basicOrAdvancedQuery(params.baseQuery, '*');

  return {
    "filters": {
       "off": {
         "query_string": {
            "query": `(${QueryUtils.basicOrAdvancedQuery(params.offQuery, 'NOT *')}) AND (${baselineQuery})`
          }
       },
       "on": {
         "query_string": {
            "query": `(${QueryUtils.basicOrAdvancedQuery(params.onQuery, 'NOT *')}) AND (${baselineQuery})`
          }
       },
       "baseline": {
          "query_string": {
             "query": baselineQuery
          }
       }
    }
  };
}
