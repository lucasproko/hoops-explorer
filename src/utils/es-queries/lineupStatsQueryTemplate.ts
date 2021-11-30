import { commonRuntimeMappings } from "./commonRuntimeMappings";
import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonLineupAggregations } from "./commonLineupAggregations";
import { QueryUtils } from "../QueryUtils";
import { LineupFilterParams } from "../FilterModels";

/** Builds a list of opponents - there's some chance they could spill across 2 buckets
   though the -10 TZ should mostly avoid. You could try to coalesce them, though there's a small
   chance you could combine same opponent on consecutive days (have a low bound for poss for doing?)
*/
const buildGameInfoRequest = function(params: LineupFilterParams) {
  return params.showGameInfo ? {

    "game_info": {
      "terms": {
        "size": 100,
        "script": "doc['location_type.keyword'][0].charAt(0) + ':' + doc['opponent.team.keyword'][0]"
      },
      "aggs": {
        "game_info": {
          "date_histogram": { "field": "date", "fixed_interval": "12h",  "time_zone": "-10:00" },
          "aggs": {
            "num_off_poss": {
              "sum": { "field": "team_stats.num_possessions" }
            },
            "num_def_poss": {
              "sum": { "field": "opponent_stats.num_possessions" }
            },
            "num_pts_for": {
              "sum": { "field": "team_stats.pts" }
            },
            "num_pts_against": {
              "sum": { "field": "opponent_stats.pts" }
            }
          }
        }
      }
    }

  } : {};
}
/*          { "date": { "date_histogram": { "field": "date", "fixed_interval": "12h",  "time_zone": "-10:00" } } }

*/
export const lineupStatsQuery = function(
  params: LineupFilterParams,
  lastDate: number, publicEfficiency: any, lookup: any, avgEfficiency: number, hca: number
) {
  return {
    ...commonRuntimeMappings(params, lastDate, publicEfficiency, lookup),
     "_source": {
        "includes": [],
        "excludes": []
     },
     "size": 0,
     "aggregations": {
        "lineups": {
           "aggregations": {
             ...buildGameInfoRequest(params),
             ...commonLineupAggregations(publicEfficiency, lookup, avgEfficiency, hca, true),
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
