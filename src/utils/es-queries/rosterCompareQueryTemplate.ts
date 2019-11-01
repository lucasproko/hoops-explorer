import { ncaaToKenpomLookup } from "./ncaaToKenpomLookup";
import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";

export const rosterCompareQuery = function(params: any, publicKenpomEfficiency: any) {
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
              "global_poss_count": {
                 "sum": {
                    "field": "team_stats.num_possessions"
                 }
              },
              "player": {
                 "terms": {
                    "field": "players.id.keyword",
                    "size": 100
                 },
                 "aggregations": {
                    "poss_count": {
                       "sum": {
                          "field": "team_stats.num_possessions"
                       }
                    },
                    "sort": {
                       "bucket_sort": {
                          "from": 0,
                          "sort": [
                             {
                                "poss_count": {
                                   "order": "desc"
                                }
                             }
                          ],
                          "size": 100
                       }
                    }
                 }
              }
           }
        }
     },
     "query": commonTeamQuery(params, publicKenpomEfficiency)
  };
}
