import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonPlayerAggregations } from "./commonPlayerAggregations";
import { GameFilterParams } from "../FilterModels";


export const playerStatsQuery = function(
  params: GameFilterParams,
  lastDate: number, publicEfficiency: any, lookup: any, avgEfficiency: number
) {
  return {
     "_source": {
        "includes": [],
        "excludes": []
     },
     "size": 0,
     "aggregations": {
        "tri_filter": {
           "filters": commonOnOffBaseQuery(params),
           "aggregations": {
             "player": {
                "terms": {
                   "field": "player.id.keyword",
                   "size": 100
                },
                "aggregations": {
                  ...commonPlayerAggregations(publicEfficiency, lookup, avgEfficiency),
                  "player_array": {
                     "top_hits": {
                       "size": 1,
                       "_source": {
                         "includes": "player"
                       }
                     }
                  }
                }
              }
           }
        }
     },
     "query": commonTeamQuery(params, lastDate, publicEfficiency, lookup)
  };
}
