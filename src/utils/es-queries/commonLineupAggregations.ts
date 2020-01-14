/** Painless script used below to calculate average offensive and defensive SoS */
const calculateSos = function(offOrDef: string) { return `
  def hca = 0.0;
  if (doc["location_type.keyword"].value == "Home") {
    hca = params.${offOrDef}_hca;
  } else if (doc["location_type.keyword"].value == "Away") {
    hca = -params.${offOrDef}_hca;
  }
  def kp_name = params.pbp_to_kp[doc["opponent.team.keyword"].value];
  if (kp_name == null) {
     kp_name = doc["opponent.team.keyword"].value;
  } else {
     kp_name = kp_name.pbp_kp_team;
  }
  def oppo = params.kp[kp_name];
  if (oppo != null) {
   return oppo['stats.adj_${offOrDef}.value'] - hca;
  } else {
   return null;
  }
`; }

export const commonLineupAggregations = function(publicEfficiency: any, lookup: any) {
  return {
    // Direct totals
    "points_scored": {
       "sum": {
          "field": "team_stats.pts"
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
    "def_poss": {
       "sum": {
          "field": "opponent_stats.num_possessions"
       }
    },
    // "Indirect" Totals:
    "total_off_2p_attempts": {
       "sum": {
          "field": "team_stats.fg_2p.attempts.total"
       }
    },
    "total_def_2p_attempts": {
       "sum": {
          "field": "opponent_stats.fg_2p.attempts.total"
       }
    },
    "total_off_2p_made": {
       "sum": {
          "field": "team_stats.fg_2p.made.total"
       }
    },
    "total_def_2p_made": {
       "sum": {
          "field": "opponent_stats.fg_2p.made.total"
       }
    },
    "total_off_3p_attempts": {
       "sum": {
          "field": "team_stats.fg_3p.attempts.total"
       }
    },
    "total_def_3p_attempts": {
       "sum": {
          "field": "opponent_stats.fg_3p.attempts.total"
       }
    },
    "total_off_3p_made": {
       "sum": {
          "field": "team_stats.fg_3p.made.total"
       }
    },
    "total_def_3p_made": {
       "sum": {
          "field": "opponent_stats.fg_3p.made.total"
       }
    },
    "total_off_2prim_attempts": {
       "sum": {
          "field": "team_stats.fg_rim.attempts.total"
       }
    },
    "total_def_2prim_attempts": {
       "sum": {
          "field": "opponent_stats.fg_rim.attempts.total"
       }
    },
    "total_off_2prim_made": {
       "sum": {
          "field": "team_stats.fg_rim.made.total"
       }
    },
    "total_def_2prim_made": {
       "sum": {
          "field": "opponent_stats.fg_rim.made.total"
       }
    },
    "total_off_2pmid_attempts": {
       "sum": {
          "field": "team_stats.fg_mid.attempts.total"
       }
    },
    "total_def_2pmid_attempts": {
       "sum": {
          "field": "opponent_stats.fg_mid.attempts.total"
       }
    },
    "total_off_2pmid_made": {
       "sum": {
          "field": "team_stats.fg_mid.made.total"
       }
    },
    "total_def_2pmid_made": {
       "sum": {
          "field": "opponent_stats.fg_mid.made.total"
       }
    },
    "total_off_fga": {
       "sum": {
          "field": "team_stats.fg.attempts.total"
       }
    },
    "total_def_fga": {
       "sum": {
          "field": "opponent_stats.fg.attempts.total"
       }
    },
    "total_off_fta": {
       "sum": {
          "field": "team_stats.ft.attempts.total"
       }
    },
    "total_def_fta": {
       "sum": {
          "field": "opponent_stats.ft.attempts.total"
       }
    },
    // Rebounding
    "total_off_orb": {
      "sum": {
         "field": "team_stats.orb.total"
      }
    },
    "total_off_drb": {
      "sum": {
         "field": "team_stats.drb.total"
      }
    },
    "total_def_orb": {
      "sum": {
         "field": "opponent_stats.orb.total"
      }
    },
    "total_def_drb": {
      "sum": {
         "field": "opponent_stats.drb.total"
      }
    },
    // X/Y type expressions
    "off_2p": {
       "bucket_script": {
          "buckets_path": {
             "my_var2": "total_off_2p_attempts",
             "my_var1": "total_off_2p_made"
          },
          "script": "(params.my_var1 > 0) ? params.my_var1 / params.my_var2 : 0"
       }
    },
    "def_2p": {
       "bucket_script": {
          "buckets_path": {
             "my_var2": "total_def_2p_attempts",
             "my_var1": "total_def_2p_made"
          },
          "script": "(params.my_var1 > 0) ? params.my_var1 / params.my_var2 : 0"
       }
    },
    "off_3p": {
       "bucket_script": {
          "buckets_path": {
             "my_var2": "total_off_3p_attempts",
             "my_var1": "total_off_3p_made"
          },
          "script": "(params.my_var1 > 0) ? params.my_var1 / params.my_var2 : 0"
       }
    },
    "def_3p": {
       "bucket_script": {
          "buckets_path": {
             "my_var2": "total_def_3p_attempts",
             "my_var1": "total_def_3p_made"
          },
          "script": "(params.my_var1 > 0) ? params.my_var1 / params.my_var2 : 0"
       }
    },
    "off_2prim": {
       "bucket_script": {
          "buckets_path": {
             "my_var2": "total_off_2prim_attempts",
             "my_var1": "total_off_2prim_made"
          },
          "script": "(params.my_var1 > 0) ? params.my_var1 / params.my_var2 : 0"
       }
    },
    "def_2prim": {
       "bucket_script": {
          "buckets_path": {
             "my_var2": "total_def_2prim_attempts",
             "my_var1": "total_def_2prim_made"
          },
          "script": "(params.my_var1 > 0) ? params.my_var1 / params.my_var2 : 0"
       }
    },
    "off_2pmid": {
       "bucket_script": {
          "buckets_path": {
             "my_var2": "total_off_2pmid_attempts",
             "my_var1": "total_off_2pmid_made"
          },
          "script": "(params.my_var1 > 0) ? params.my_var1 / params.my_var2 : 0"
       }
    },
    "def_2pmid": {
       "bucket_script": {
          "buckets_path": {
             "my_var2": "total_def_2pmid_attempts",
             "my_var1": "total_def_2pmid_made"
          },
          "script": "(params.my_var1 > 0) ? params.my_var1 / params.my_var2 : 0"
       }
    },
    "off_ftr": {
       "bucket_script": {
          "buckets_path": {
             "my_var2": "total_off_fga",
             "my_var1": "total_off_fta"
          },
          "script": "(params.my_var1 > 0) ? params.my_var1 / params.my_var2 : 0"
       }
    },
    "def_ftr": {
       "bucket_script": {
          "buckets_path": {
             "my_var2": "total_def_fga",
             "my_var1": "total_def_fta"
          },
          "script": "(params.my_var1 > 0) ? params.my_var1 / params.my_var2 : 0"
       }
    },
    // Rebounding:
    "off_orb": {
      "bucket_script": {
         "buckets_path": {
            "my_var2": "total_def_drb",
            "my_var1": "total_off_orb"
         },
         "script": "(params.my_var1 > 0) ? params.my_var1 / (params.my_var1 + params.my_var2) : 0"
      }
    },
    "def_orb": {
      "bucket_script": {
         "buckets_path": {
            "my_var2": "total_off_drb",
            "my_var1": "total_def_orb"
         },
         "script": "(params.my_var1 > 0) ? params.my_var1 / (params.my_var1 + params.my_var2) : 0"
      }
    },
    // Weighted averages (should migrate over time to total_*):
    // Per Possession stats
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
    "off_adj_opp": {
        "weighted_avg": {
           "weight": {
              "field": "opponent_stats.num_possessions"
           },
           "value": {
              "script": {
                 "source": calculateSos("off"),
                 "lang": "painless",
                 "params": {
                    "pbp_to_kp": lookup,
                    "kp": publicEfficiency,
                    "off_hca": 1.5 //(this should be derived from year/gender at some point?)
                 }
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
                "source": calculateSos("def"),
                 "lang": "painless",
                 "params": {
                   "pbp_to_kp": lookup,
                   "kp": publicEfficiency,
                   "def_hca": -1.5
                 }
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
     // Shot type stats
     // RIM
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
     // Mid
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
     // 3P
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
     // eFG
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
