import { SampleDataUtils } from "./SampleDataUtils"

const sampleTeamStatsTemplate =
{
  // A: Top Level Scoring

   "efg": {
      "baseline": {
         "off_": 0.5213358070500927,
         "def_": 0.45730607336139506
      },
      "off": {
         "off_": 0.525691699604743,
         "def_": 0.4269230769230769
      },
      "on": {
         "off_": 0.5193519351935193,
         "def_": 0.47112860892388453
      }
   },
   "fga": {
      "baseline": {
         "total_off_": 1617,
         "total_def_": 1663
      },
      "off": {
         "total_off_": 506,
         "total_def_": 520
      },
      "on": {
         "total_off_": 1111,
         "total_def_": 1143
      }
   },
   "fta": {
      "baseline": {
         "total_off_": 530,
         "total_def_": 437
      },
      "off": {
         "total_off_": 154,
         "total_def_": 135
      },
      "on": {
         "total_off_": 376,
         "total_def_": 302
      }
   },
   "ftr": {
      "baseline": {
         "off_": 0.3277674706246135,
         "def_": 0.2627781118460613
      },
      "off": {
         "off_": 0.30434782608695654,
         "def_": 0.25961538461538464
      },
      "on": {
         "off_": 0.3384338433843384,
         "def_": 0.2642169728783902
      }
   },

  // B] Advanced Shooting Stats

   "2p": {
      "baseline": {
         "off_": 0.5221238938053098,
         "def_": 0.44366197183098594
      },
      "off": {
         "off_": 0.540625,
         "def_": 0.4115853658536585
      },
      "on": {
         "off_": 0.5136298421807748,
         "def_": 0.4594594594594595
      }
   },
   "2p_attempts": {
      "off": {
         "total_off_": 909,
         "total_def_": 345
      },
      "on": {
         "total_off_": 600,
         "total_def_": 650
      }
   },
   "2pmid": {
      "baseline": {
         "off_": 0.4247422680412371,
         "def_": 0.36666666666666664
      },
      "off": {
         "off_": 0.4267515923566879,
         "def_": 0.34065934065934067
      },
      "on": {
         "off_": 0.42378048780487804,
         "def_": 0.3788659793814433
      }
   },
   "2pmid_attempts": {
      "baseline": {
         "total_off_": 485,
         "total_def_": 570
      },
      "off": {
         "total_off_": 157,
         "total_def_": 182
      },
      "on": {
         "total_off_": 328,
         "total_def_": 388
      }
   },
   "2pmid_made": {
      "baseline": {
         "total_off_": 206,
         "total_def_": 209
      },
      "off": {
         "total_off_": 67,
         "total_def_": 62
      },
      "on": {
         "total_off_": 139,
         "total_def_": 147
      }
   },
   "2pmidr": {
      "baseline": {
         "off_": 0.29993815708101423,
         "def_": 0.3427540589296452
      },
      "off": {
         "off_": 0.3102766798418972,
         "def_": 0.35
      },
      "on": {
         "off_": 0.2952295229522952,
         "def_": 0.3394575678040245
      }
   },
   "2prim": {
      "baseline": {
         "off_": 0.6109022556390977,
         "def_": 0.5471698113207547
      },
      "off": {
         "off_": 0.6503067484662577,
         "def_": 0.5
      },
      "on": {
         "off_": 0.5934959349593496,
         "def_": 0.5719424460431655
      }
   },
   "2prim_attempts": {
      "baseline": {
         "total_off_": 532,
         "total_def_": 424
      },
      "off": {
         "total_off_": 163,
         "total_def_": 146
      },
      "on": {
         "total_off_": 369,
         "total_def_": 278
      }
   },
   "2prim_made": {
      "baseline": {
         "total_off_": 325,
         "total_def_": 232
      },
      "off": {
         "total_off_": 106,
         "total_def_": 73
      },
      "on": {
         "total_off_": 219,
         "total_def_": 159
      }
   },
   "2primr": {
      "baseline": {
         "off_": 0.329004329004329,
         "def_": 0.2549609140108238
      },
      "off": {
         "off_": 0.3221343873517787,
         "def_": 0.28076923076923077
      },
      "on": {
         "off_": 0.3321332133213321,
         "def_": 0.2432195975503062
      }
   },
   "3p": {
      "baseline": {
         "off_": 0.3466666666666667,
         "def_": 0.3183856502242152
      },
      "off": {
         "off_": 0.3333333333333333,
         "def_": 0.3020833333333333
      },
      "on": {
         "off_": 0.3526570048309179,
         "def_": 0.3249475890985325
      }
   },
   "3p_attempts": {
      "baseline": {
         "total_def_": 1000
      },
      "off": {
         "total_def_": 450
      },
      "on": {
         "total_off_": 500,
         "total_def_": 750
      }
   },
   "3p_opp": {
      "baseline": {
         "def_": 36.240722891566264
      },
      "off": {
         "def_": 37.240722891566264
      },
      "on": {
         "def_": 35.240722891566264
      }
   },
   "3pr": {
      "baseline": {
         "off_": 0.37105751391465674,
         "def_": 0.40228502705953095
      },
      "off": {
         "off_": 0.3675889328063241,
         "def_": 0.36923076923076925
      },
      "on": {
         "off_": 0.3726372637263726,
         "def_": 0.41732283464566927
      }
   },


  // C] Rebounds


   "orb": {
      "baseline": {
         "off_": 0.3411513859275053,
         "def_": 0.24372093023255814
      },
      "off": {
         "off_": 0.3494809688581315,
         "def_": 0.2577903682719547
      },
      "on": {
         "off_": 0.337442218798151,
         "def_": 0.23684210526315788
      }
   },

  // D] Assists and TOs

   "2p_ast": {
      "baseline": {
         "total_off_": 30,
         "total_def_": 35,
         "off_": 0.5,
         "def_": 0.55
      },
      "off": {
         "total_off_": 31,
         "total_def_": 36,
         "off_": 0.51,
         "def_": 0.56
      },
      "on": {
         "total_off_": 32,
         "total_def_": 37,
         "off_": 0.52,
         "def_": 0.57
      }
   },
   "2pmid_ast": {
      "baseline": {
         "total_off_": 30,
         "total_def_": 35,
         "off_": 0.25,
         "def_": 0.3
      },
      "off": {
         "total_off_": 31,
         "total_def_": 36,
         "off_": 0.26,
         "def_": 0.31
      },
      "on": {
         "total_off_": 32,
         "total_def_": 37,
         "off_": 0.27,
         "def_": 0.32
      }
   },
   "2prim_ast": {
      "baseline": {
         "total_off_": 60,
         "total_def_": 65,
         "off_": 0.25,
         "def_": 0.3
      },
      "off": {
         "total_off_": 61,
         "total_def_": 66,
         "off_": 0.26,
         "def_": 0.31
      },
      "on": {
         "total_off_": 62,
         "total_def_": 67,
         "off_": 0.27,
         "def_": 0.32
      }
   },
   "3p_ast": {
      "baseline": {
         "total_off_": 40,
         "total_def_": 45,
         "off_": 0.6,
         "def_": 0.65
      },
      "off": {
         "total_off_": 41,
         "total_def_": 46,
         "off_": 0.61,
         "def_": 0.66
      },
      "on": {
         "total_off_": 42,
         "total_def_": 47,
         "off_": 0.62,
         "def_": 0.67
      }
   },
   "assist": {
      "baseline": {
         "off_": 0.5,
         "def_": 0.48
      },
      "off": {
         "off_": 0.51,
         "def_": 0.49
      },
      "on": {
         "off_": 0.52,
         "def_": 0.5
      }
   },
   "assists": {
      "baseline": {
         "total_off_": 100,
         "total_def_": 110
      },
      "off": {
         "total_off_": 101,
         "total_def_": 111
      },
      "on": {
         "total_off_": 102,
         "total_def_": 112
      }
   },
   "ast_3p": {
      "baseline": {
         "total_off_": 40,
         "total_def_": 45,
         "off_": 0.4,
         "def_": 0.45
      },
      "off": {
         "total_off_": 41,
         "total_def_": 46,
         "off_": 0.41,
         "def_": 0.46
      },
      "on": {
         "total_off_": 42,
         "total_def_": 47,
         "off_": 0.42,
         "def_": 0.47
      }
   },
   "ast_mid": {
      "baseline": {
         "total_off_": 30,
         "total_def_": 35,
         "off_": 0.3,
         "def_": 0.35
      },
      "off": {
         "total_off_": 31,
         "total_def_": 36,
         "off_": 0.31,
         "def_": 0.36
      },
      "on": {
         "total_off_": 32,
         "total_def_": 37,
         "off_": 0.32,
         "def_": 0.37
      }
   },
   "ast_rim": {
      "baseline": {
         "total_off_": 30,
         "total_def_": 35,
         "off_": 0.3,
         "def_": 0.35
      },
      "off": {
         "total_off_": 31,
         "total_def_": 36,
         "off_": 0.31,
         "def_": 0.36
      },
      "on": {
         "total_off_": 32,
         "total_def_": 37,
         "off_": 0.32,
         "def_": 0.37
      }
   },
   "to": {
      "baseline": {
         "off_": 0.18693574083908657,
         "def_": 0.14385026737967915
      },
      "off": {
         "off_": 0.2016949152542373,
         "def_": 0.18120805369127516
      },
      "on": {
         "off_": 0.18020108275328692,
         "def_": 0.12637362637362637
      }
   },

  // E] Adjusted Numbers

   "adj_opp": {
      "baseline": {
         "off_": 110.32620320855615,
         "def_": 98.59978757302179
      },
      "off": {
         "off_": 109.2234899328859,
         "def_": 99.26440677966102
      },
      "on": {
         "off_": 110.84207221350077,
         "def_": 98.29651972157772
      }
   },
   "adj_ppp": {
      "baseline": {
         "off_": 120.6744556558683,
         "def_": 100.23529411764706
      },
      "off": {
         "off_": 115.6744556558683,
         "def_": 105.23529411764706
      },
      "on": {
         "off_": 111,
         "def_": 88
      }
   },

   // F] Misc Stats

   "poss": {
      "baseline": {
         "off_": 1883,
         "def_": 1870
      },
      "off": {
         "off_": 590,
         "def_": 596
      },
      "on": {
         "off_": 1293,
         "def_": 1274
      }
   },
   "ppp": {
      "baseline": {
         "off_": 110.6744556558683,
         "def_": 98.23529411764706
      },
      "off": {
         "off_": 109.15254237288136,
         "def_": 91.61073825503355
      },
      "on": {
         "off_": 111.36890951276102,
         "def_": 101.33437990580848
      }
   },
   "pts": {
      "baseline": {
         "total_off_": 2084,
         "total_def_": 1837
      },
      "off": {
         "total_off_": 644,
         "total_def_": 546
      },
      "on": {
         "total_off_": 1440,
         "total_def_": 1291
      }
   },
   "main": {
      "doc_count": {
         "baseline": 571,
         "off": 204,
         "on": 367
      }
   }
};

export const sampleTeamStatsResponse =
{
  "took" : 73,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 693,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "global": {
  		"doc_count": 720,
  		"only": {
  			"buckets": {
  				"team": {
  					"doc_count": 720,
  					"def_3p_opp": {
  						"value": 35.578840579710146
  					},
            "total_off_3p_attempts": {
  						"value": 800
  					},
  					"total_def_3p_attempts": {
  						"value": 709
  					},
            "total_def_2p_attempts": {
  						"value": 900
  					},
  					"total_def_poss": {
  						"value": 2089
  					},
  					"total_def_3p_made": {
  						"value": 241
  					},
  					"def_3p": {
  						"value": 0.33991537376586745
  					},
  					"def_poss": {
  						"value": 2089
  					}
  				}
  			}
  		}
  	},
    "tri_filter" : {
      "buckets" : SampleDataUtils.buildResponseFromTemplateTeam(sampleTeamStatsTemplate)
    }
  }
};
