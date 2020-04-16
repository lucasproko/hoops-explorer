import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonLineupAggregations } from "./commonLineupAggregations";
import { QueryUtils } from "../QueryUtils";
import { LineupFilterParams } from "../FilterModels";

export const lineupStatsQuery = function(
  params: LineupFilterParams,
  lastDate: number, publicEfficiency: any, lookup: any, avgEfficiency: number
) {
  return {
     "_source": {
        "includes": [],
        "excludes": []
     },
     "size": 0,
     "aggregations": {
        "lineups": {
           "aggregations": {
             ...commonLineupAggregations(publicEfficiency, lookup, avgEfficiency),
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
             commonTeamQuery(params, lastDate, publicEfficiency, lookup),
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
