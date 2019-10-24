import { ncaaToKenpomLookup } from "./ncaaToKenpomLookup"
import { publicKenpomEfficiency2018 } from "./publicKenpomEfficiency2018"

export const rosterCompareQuery2018 = function(params: any) {
  return { //TODO: handle multiple years
     "_source": {
        "includes": [],
        "excludes": []
     },
     "size": 0,
     "aggregations": {
        "tri_filter": {
          "filters": {
             "filters": {
                "off": {
                   "query_string": {
                      "query": `players.id:((${params.offQuery || "*"}) AND (${params.baseQuery || "*"}))`
                   }
                },
                "on": {
                   "query_string": {
                     "query": `players.id:((${params.onQuery || "*"}) AND (${params.baseQuery || "*"}))`
                   }
                },
                "baseline": {
                   "query_string": {
                      "query": `players.id:(${params.baseQuery || "*"})`
                   }
                }
             }
          },
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
     "query": {
        "bool": {
           "filter": [],
           "must_not": [],
           "should": [],
           "must": [
              {
                 "script": {
                    "script": {
                       "source": "def kp_name = params.pbp_to_kp[doc[\"opponent.team.keyword\"].value];\nif (kp_name != null) {\ndef oppo = params.kp[kp_name.pbp_kp_team];\nif (oppo != null) {\n   def kp_rank = oppo['stats.adj_margin.rank'];\n   def game_filter = params.game_filter.game_filter;\n   //TODO: high major\n   return (kp_rank >= game_filter.min_kp) && (kp_rank <= game_filter.max_kp);\n} else {\n   return false;\n}\n} else {\n   return false;\n}\n",
                       "lang": "painless",
                       "params": {
                          "pbp_to_kp": ncaaToKenpomLookup,
                          "kp": publicKenpomEfficiency2018,
                          "game_filter": {
                             "game_filter": {
                               "min_kp": Number(params.minRank),
                               "max_kp": Number(params.maxRank)
                             }
                          }
                       }
                    }
                 }
              },
              {
                 "query_string": {
                    "query": "*"
                 }
              }
           ]
        }
     }
  };
}
