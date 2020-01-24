import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonLineupAggregations } from "./commonLineupAggregations";
import { QueryUtils } from "../QueryUtils";

export const lineupStatsQuery = function(params: any, publicEfficiency: any, lookup: any) {
  return {
     "_source": {
        "includes": [],
        "excludes": []
     },
     "size": 0,
     "aggregations": {
        "lineups": {
           "aggregations": {
             ...commonLineupAggregations(publicEfficiency, lookup),
             "players_array": {
                "top_hits": {
                  "size": 1,
                  "_source": {
                    "includes": "players"
                  }
                }
             },
             "sort_by_poss": {
                "bucket_sort": {
                  "sort": [
                     {"off_poss": {"order": "desc"}},
                  ]
                }
             }
           },
           "terms": {
             "field": "lineup_id.keyword",
             "size": 1000
           }
        }
     },
     "query": {
       "bool": {
          "filter": [],
          "must_not": [],
          "should": [],
          "must": [
             commonTeamQuery(params, publicEfficiency, lookup),
             {
               "query_string": {
                  "query": `${QueryUtils.basicOrAdvancedQuery(params.baseQuery, '*')}`
               }
             }
          ]
        }
      }
  };
}
