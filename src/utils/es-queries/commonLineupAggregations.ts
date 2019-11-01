import { ncaaToKenpomLookup } from "../public-data/ncaaToKenpomLookup"

export const commonLineupAggregations = function(publicKenpomEfficiency: any) {
  return {
     "off_adj_opp": {
        "weighted_avg": {
           "weight": {
              "field": "opponent_stats.num_possessions"
           },
           "value": {
              "script": {
                 "source": "def kp_name = params.pbp_to_kp[doc[\"opponent.team.keyword\"].value];\nif (kp_name == null) {\n   kp_name = doc[\"opponent.team.keyword\"].value;\n} else {\n   kp_name = kp_name.pbp_kp_team;\n}\ndef oppo = params.kp[kp_name];\nif (oppo != null) {\n return oppo['stats.adj_off.value'];\n} else {\n return null;\n}\n",
                 "lang": "painless",
                 "params": {
                    "pbp_to_kp": ncaaToKenpomLookup,
                    "kp": publicKenpomEfficiency
                 }
              }
           }
        }
     },
     "total_off_fga": {
        "sum": {
           "field": "team_stats.fg.attempts.total"
        }
     },
     "def_2prim": {
        "bucket_script": {
           "buckets_path": {
              "my_var2": "total_def_2prim_attempts",
              "my_var1": "total_def_2prim_made"
           },
           "script": "params.my_var1 / params.my_var2"
        }
     },
     "total_def_2prim_attempts": {
        "sum": {
           "field": "opponent_stats.fg_rim.attempts.total"
        }
     },
     "total_off_2pmid_made": {
        "sum": {
           "field": "team_stats.fg_mid.made.total"
        }
     },
     "total_off_2pmid_attempts": {
        "sum": {
           "field": "team_stats.fg_mid.attempts.total"
        }
     },
     "total_def_fta": {
        "sum": {
           "field": "opponent_stats.ft.attempts.total"
        }
     },
     "off_2pmidr": {
        "weighted_avg": {
           "weight": {
              "field": "team_stats.fg.attempts.total"
           },
           "value": {
              "script": {
                 "source": "def attempts = doc['team_stats.fg.attempts.total'].value;\n\nif (attempts > 0) {\n return (1.0*doc['team_stats.fg_mid.attempts.total'].value)/attempts;\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "off_2pmid": {
        "bucket_script": {
           "buckets_path": {
              "my_var2": "total_off_2pmid_attempts",
              "my_var1": "total_off_2pmid_made"
           },
           "script": "params.my_var1 / params.my_var2"
        }
     },
     "off_ppp": {
        "weighted_avg": {
           "weight": {
              "field": "team_stats.num_possessions"
           },
           "value": {
              "script": {
                 "source": "if (doc[\"team_stats.num_possessions\"].value > 0) {\n return 100.0*doc[\"team_stats.pts\"].value/doc[\"team_stats.num_possessions\"].value;\n} else {\n return 0.0;\n}\n",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "off_3pr": {
        "weighted_avg": {
           "weight": {
              "field": "team_stats.fg.attempts.total"
           },
           "value": {
              "script": {
                 "source": "def attempts = doc['team_stats.fg.attempts.total'].value;\n\nif (attempts > 0) {\n return (1.0*doc['team_stats.fg_3p.attempts.total'].value)/attempts;\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "def_2pmid": {
        "bucket_script": {
           "buckets_path": {
              "my_var2": "total_def_2pmid_attempts",
              "my_var1": "total_def_2pmid_made"
           },
           "script": "params.my_var1 / params.my_var2"
        }
     },
     "total_def_fga": {
        "sum": {
           "field": "opponent_stats.fg.attempts.total"
        }
     },
     "def_poss": {
        "sum": {
           "field": "opponent_stats.num_possessions"
        }
     },
     "total_off_2prim_made": {
        "sum": {
           "field": "team_stats.fg_rim.made.total"
        }
     },
     "def_to": {
        "weighted_avg": {
           "weight": {
              "field": "opponent_stats.num_possessions"
           },
           "value": {
              "script": {
                 "source": "if (doc[\"opponent_stats.num_possessions\"].value > 0) {\n return 1.0*doc[\"opponent_stats.to.total\"].value/doc[\"opponent_stats.num_possessions\"].value;\n} else {\n return 0.0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "off_3p": {
        "weighted_avg": {
           "weight": {
              "field": "team_stats.fg_3p.attempts.total"
           },
           "value": {
              "script": {
                 "source": "def attempts = doc['team_stats.fg_3p.attempts.total'].value;\n\nif (attempts > 0) {\n return (1.0*doc['team_stats.fg_3p.made.total'].value)/attempts;\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "def_adj_opp": {
        "weighted_avg": {
           "weight": {
              "field": "team_stats.num_possessions"
           },
           "value": {
              "script": {
                 "source": "def kp_name = params.pbp_to_kp[doc[\"opponent.team.keyword\"].value];\nif (kp_name == null) {\n   kp_name = doc[\"opponent.team.keyword\"].value;\n} else {\n   kp_name = kp_name.pbp_kp_team;\n}\ndef oppo = params.kp[kp_name];\nif (oppo != null) {\n return oppo['stats.adj_def.value'];\n} else {\n return null;\n}\n",
                 "lang": "painless",
                 "params": {
                   "pbp_to_kp": ncaaToKenpomLookup,
                   "kp": publicKenpomEfficiency
                 }
              }
           }
        }
     },
     "def_2p": {
        "weighted_avg": {
           "weight": {
              "field": "opponent_stats.fg_2p.attempts.total"
           },
           "value": {
              "script": {
                 "source": "def attempts = doc['opponent_stats.fg_2p.attempts.total'].value;\n\nif (attempts > 0) {\n return (1.0*doc['opponent_stats.fg_2p.made.total'].value)/attempts;\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "off_2primr": {
        "weighted_avg": {
           "weight": {
              "field": "team_stats.fg.attempts.total"
           },
           "value": {
              "script": {
                 "source": "def attempts = doc['team_stats.fg.attempts.total'].value;\n\nif (attempts > 0) {\n return (1.0*doc['team_stats.fg_rim.attempts.total'].value)/attempts;\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "points_scored": {
        "sum": {
           "field": "team_stats.pts"
        }
     },
     "def_2primr": {
        "weighted_avg": {
           "weight": {
              "field": "opponent_stats.fg.attempts.total"
           },
           "value": {
              "script": {
                 "source": "def attempts = doc['opponent_stats.fg.attempts.total'].value;\n\nif (attempts > 0) {\n return (1.0*doc['opponent_stats.fg_rim.attempts.total'].value)/attempts;\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "off_orb": {
        "weighted_avg": {
           "weight": {
              "script": {
                 "source": "def orb = doc['team_stats.orb.total'].value;\ndef drb = doc['opponent_stats.drb.total'].value;\nreturn orb + drb;",
                 "lang": "painless",
                 "params": {}
              }
           },
           "value": {
              "script": {
                 "source": "def orb = doc['team_stats.orb.total'].value;\ndef drb = doc['opponent_stats.drb.total'].value;\n\nif (orb + drb > 0) {\n return 1.0*orb/(orb + drb);\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "def_ppp": {
        "weighted_avg": {
           "weight": {
              "field": "opponent_stats.num_possessions"
           },
           "value": {
              "script": {
                 "source": "if (doc[\"opponent_stats.num_possessions\"].value > 0) {\n return 100.0*doc[\"opponent_stats.pts\"].value/doc[\"opponent_stats.num_possessions\"].value;\n} else {\n return 0.0;\n}\n",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "total_def_2pmid_attempts": {
        "sum": {
           "field": "opponent_stats.fg_mid.attempts.total"
        }
     },
     "def_2pmidr": {
        "weighted_avg": {
           "weight": {
              "field": "opponent_stats.fg.attempts.total"
           },
           "value": {
              "script": {
                 "source": "def attempts = doc['opponent_stats.fg.attempts.total'].value;\n\nif (attempts > 0) {\n return (1.0*doc['opponent_stats.fg_mid.attempts.total'].value)/attempts;\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "def_3pr": {
        "weighted_avg": {
           "weight": {
              "field": "opponent_stats.fg.attempts.total"
           },
           "value": {
              "script": {
                 "source": "def attempts = doc['opponent_stats.fg.attempts.total'].value;\n\nif (attempts > 0) {\n return (1.0*doc['opponent_stats.fg_3p.attempts.total'].value)/attempts;\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "points_allowed": {
        "sum": {
           "field": "opponent_stats.pts"
        }
     },
     "off_poss": {
        "sum": {
           "field": "team_stats.num_possessions"
        }
     },
     "def_3p": {
        "weighted_avg": {
           "weight": {
              "field": "opponent_stats.fg_3p.attempts.total"
           },
           "value": {
              "script": {
                 "source": "def attempts = doc['opponent_stats.fg_3p.attempts.total'].value;\n\nif (attempts > 0) {\n return (1.0*doc['opponent_stats.fg_3p.made.total'].value)/attempts;\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "def_orb": {
        "weighted_avg": {
           "weight": {
              "script": {
                 "source": "def drb = doc['team_stats.drb.total'].value;\ndef orb = doc['opponent_stats.orb.total'].value;\nreturn orb + drb;",
                 "lang": "painless",
                 "params": {}
              }
           },
           "value": {
              "script": {
                 "source": "def drb = doc['team_stats.drb.total'].value;\ndef orb = doc['opponent_stats.orb.total'].value;\n\nif (orb + drb > 0) {\n return 1.0*orb/(orb + drb);\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "total_off_2prim_attempts": {
        "sum": {
           "field": "team_stats.fg_rim.attempts.total"
        }
     },
     "off_ftr": {
        "bucket_script": {
           "buckets_path": {
              "my_var2": "total_off_fga",
              "my_var1": "total_off_fta"
           },
           "script": "params.my_var1 / params.my_var2"
        }
     },
     "def_ftr": {
        "bucket_script": {
           "buckets_path": {
              "my_var2": "total_def_fga",
              "my_var1": "total_def_fta"
           },
           "script": "params.my_var1 / params.my_var2"
        }
     },
     "total_def_2pmid_made": {
        "sum": {
           "field": "opponent_stats.fg_mid.made.total"
        }
     },
     "off_2p": {
        "weighted_avg": {
           "weight": {
              "field": "team_stats.fg_2p.attempts.total"
           },
           "value": {
              "script": {
                 "source": "def attempts = doc['team_stats.fg_2p.attempts.total'].value;\n\nif (attempts > 0) {\n return (1.0*doc['team_stats.fg_2p.made.total'].value)/attempts;\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "off_2prim": {
        "bucket_script": {
           "buckets_path": {
              "my_var2": "total_off_2prim_attempts",
              "my_var1": "total_off_2prim_made"
           },
           "script": "params.my_var1 / params.my_var2"
        }
     },
     "total_def_2prim_made": {
        "sum": {
           "field": "opponent_stats.fg_rim.made.total"
        }
     },
     "off_efg": {
        "weighted_avg": {
           "weight": {
              "field": "team_stats.fg.attempts.total"
           },
           "value": {
              "script": {
                 "source": "def attempts = doc['team_stats.fg.attempts.total'].value;\n\nif (attempts > 0) {\n return (doc['team_stats.fg_2p.made.total'].value + 1.5*doc['team_stats.fg_3p.made.total'].value)/attempts;\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "off_to": {
        "weighted_avg": {
           "weight": {
              "field": "team_stats.num_possessions"
           },
           "value": {
              "script": {
                 "source": "if (doc[\"team_stats.num_possessions\"].value > 0) {\n return 1.0*doc[\"team_stats.to.total\"].value/doc[\"team_stats.num_possessions\"].value;\n} else {\n return 0.0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     },
     "total_off_fta": {
        "sum": {
           "field": "team_stats.ft.attempts.total"
        }
     },
     "def_efg": {
        "weighted_avg": {
           "weight": {
              "field": "opponent_stats.fg.attempts.total"
           },
           "value": {
              "script": {
                 "source": "def attempts = doc['opponent_stats.fg.attempts.total'].value;\n\nif (attempts > 0) {\n return (doc['opponent_stats.fg_2p.made.total'].value + 1.5*doc['opponent_stats.fg_3p.made.total'].value)/attempts;\n} else {\n return 0;\n}",
                 "lang": "painless",
                 "params": {}
              }
           }
        }
     }
  };
}
