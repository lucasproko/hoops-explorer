export const sampleRosterCompareQueryRequest =                 {
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
                           "query": "(players.id:(NOT *)) AND (players.id:(base))"
                        }
                     },
                     "on": {
                        "query_string": {
                           "query": "(players.id:(NOT *)) AND (players.id:(base))"
                        }
                     },
                     "baseline": {
                        "query_string": {
                           "query": "players.id:(base)"
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
               "minimum_should_match": 0,
               "must": [
                  {
                     "script": {
                        "script": {
                           "source": "if (params.kp.isEmpty()) return true;\ndef kp_name = params.pbp_to_kp[doc[\"opponent.team.keyword\"].value];\nif (kp_name == null) {\n   kp_name = doc[\"opponent.team.keyword\"].value;\n} else {\n   kp_name = kp_name.pbp_kp_team\n}\ndef oppo = params.kp[kp_name];\nif (oppo != null) {\n def kp_rank = oppo['stats.adj_margin.rank'];\n def game_filter = params.game_filter.game_filter;\n //TODO: high major\n return (kp_rank >= game_filter.min_kp) && (kp_rank <= game_filter.max_kp);\n} else {\n return false;\n}\n\n",
                           "lang": "painless",
                           "params": {
                              "pbp_to_kp": {
                                 "name1": "name1b"
                              },
                              "kp": {
                                 "team": {
                                    "stats": 0
                                 }
                              },
                              "game_filter": {
                                 "game_filter": {
                                    "min_kp": 10,
                                    "max_kp": 100
                                 }
                              }
                           }
                        }
                     }
                  },
                  {
                     "term": {
                        "team.team.keyword": "undefined"
                     }
                  }
               ]
            }
         }
      };
