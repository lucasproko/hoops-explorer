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
      "buckets" : {
        "baseline" : {
          "doc_count" : 571,
          "total_off_fga" : {
            "value" : 1617.0
          },
          "off_adj_opp" : {
            "value" : 110.32620320855615
          },
          "total_def_2prim_attempts" : {
            "value" : 424.0
          },
          "total_off_2pmid_attempts" : {
            "value" : 485.0
          },
          "total_def_3p_attempts" : {
            "value" : 1000
          },
          "total_off_2_attempts" : {
            "value" : 485 + 424
          },
          "total_off_2pmid_made" : {
            "value" : 206.0
          },
          "total_def_fta" : {
            "value" : 437.0
          },
          "off_2pmidr" : {
            "value" : 0.29993815708101423
          },
          "off_ppp" : {
            "value" : 110.6744556558683
          },
          "off_3pr" : {
            "value" : 0.37105751391465674
          },
          "total_def_fga" : {
            "value" : 1663.0
          },
          "def_poss" : {
            "value" : 1870.0
          },
          "total_off_2prim_made" : {
            "value" : 325.0
          },
          "def_to" : {
            "value" : 0.14385026737967915
          },
          "off_3p" : {
            "value" : 0.3466666666666667
          },
          "def_2p" : {
            "value" : 0.44366197183098594
          },
          "def_adj_opp" : {
            "value" : 98.59978757302179
          },
          "off_2primr" : {
            "value" : 0.329004329004329
          },
          "def_2primr" : {
            "value" : 0.2549609140108238
          },
          "total_off_pts" : {
            "value" : 2084.0
          },
          "off_orb" : {
            "value" : 0.3411513859275053
          },
          "total_def_2pmid_attempts" : {
            "value" : 570.0
          },
          "def_ppp" : {
            "value" : 98.23529411764706
          },
          "def_2pmidr" : {
            "value" : 0.3427540589296452
          },
          "def_3pr" : {
            "value" : 0.40228502705953095
          },
          "total_def_pts" : {
            "value" : 1837.0
          },
          "def_3p" : {
            "value" : 0.3183856502242152
          },
          "def_3p_opp":{"value":36.240722891566264},
          "off_poss" : {
            "value" : 1883.0
          },
          "total_off_2prim_attempts" : {
            "value" : 532.0
          },
          "def_orb" : {
            "value" : 0.24372093023255814
          },
          "total_def_2pmid_made" : {
            "value" : 209.0
          },
          "total_def_2prim_made" : {
            "value" : 232.0
          },
          "off_2p" : {
            "value" : 0.5221238938053098
          },
          "off_efg" : {
            "value" : 0.5213358070500927
          },
          "off_to" : {
            "value" : 0.18693574083908657
          },
          "total_off_fta" : {
            "value" : 530.0
          },
          "def_efg" : {
            "value" : 0.45730607336139506
          },
          "def_2prim" : {
            "value" : 0.5471698113207547
          },
          "off_2pmid" : {
            "value" : 0.4247422680412371
          },
          "def_2pmid" : {
            "value" : 0.36666666666666664
          },
          "off_ftr" : {
            "value" : 0.3277674706246135
          },
          "def_ftr" : {
            "value" : 0.2627781118460613
          },
          "off_2prim" : {
            "value" : 0.6109022556390977
          },
          "off_adj_ppp" : {
            "value" : 120.6744556558683
          },
          "def_adj_ppp" : {
            "value" : 100.23529411764706
          },
          // Assists
          "off_assist" : {
            "value" : 0.50
          },
          "def_assist" : {
            "value" : 0.48
          },
          "total_off_assists": {
            "value": 100
          },
          "total_def_assists": {
            "value": 110
          },
          //(off assist)
          "total_off_ast_3p": {
            "value": 40
          },
          "total_off_ast_mid": {
            "value": 30
          },
          "total_off_ast_rim": {
            "value": 30
          },
          "off_ast_3p": {
            "value": 0.4
          },
          "off_ast_mid": {
            "value": 0.3
          },
          "off_ast_rim": {
            "value": 0.3
          },
          "total_off_3p_ast": {
            "value": 40
          },
          "total_off_2p_ast": {
            "value": 30
          },
          "total_off_2pmid_ast": {
            "value": 30
          },
          "total_off_2prim_ast": {
            "value": 60
          },
          "off_3p_ast": {
            "value": 0.60
          },
          "off_2p_ast": {
            "value": 0.5
          },
          "off_2pmid_ast": {
            "value": 0.25
          },
          "off_2prim_ast": {
            "value": 0.25
          },
          //(def assist)
          "total_def_ast_3p": {
            "value": 45
          },
          "total_def_ast_mid": {
            "value": 35
          },
          "total_def_ast_rim": {
            "value": 35
          },
          "def_ast_3p": {
            "value": 0.45
          },
          "def_ast_mid": {
            "value": 0.35
          },
          "def_ast_rim": {
            "value": 0.35
          },
          "total_def_3p_ast": {
            "value": 45
          },
          "total_def_2p_ast": {
            "value": 35
          },
          "total_def_2pmid_ast": {
            "value": 35
          },
          "total_def_2prim_ast": {
            "value": 65
          },
          "def_3p_ast": {
            "value": 0.65
          },
          "def_2p_ast": {
            "value": 0.55
          },
          "def_2pmid_ast": {
            "value": 0.30
          },
          "def_2prim_ast": {
            "value": 0.30
          },
          //(end assists)
        },
        "off" : {
          "doc_count" : 204,
          "total_off_fga" : {
            "value" : 506.0
          },
          "off_adj_opp" : {
            "value" : 109.2234899328859
          },
          "total_def_2prim_attempts" : {
            "value" : 146.0
          },
          "total_off_2pmid_attempts" : {
            "value" : 157.0
          },
          "total_off_2pmid_made" : {
            "value" : 67.0
          },
          "total_def_fta" : {
            "value" : 135.0
          },
          "off_2pmidr" : {
            "value" : 0.3102766798418972
          },
          "off_ppp" : {
            "value" : 109.15254237288136
          },
          "off_3pr" : {
            "value" : 0.3675889328063241
          },
          "total_def_fga" : {
            "value" : 520.0
          },
          "def_poss" : {
            "value" : 596.0
          },
          "total_off_2prim_made" : {
            "value" : 106.0
          },
          "def_to" : {
            "value" : 0.18120805369127516
          },
          "off_3p" : {
            "value" : 0.3333333333333333
          },
          "def_2p" : {
            "value" : 0.4115853658536585
          },
          "def_adj_opp" : {
            "value" : 99.26440677966102
          },
          "off_2primr" : {
            "value" : 0.3221343873517787
          },
          "def_2primr" : {
            "value" : 0.28076923076923077
          },
          "total_off_pts" : {
            "value" : 644.0
          },
          "off_orb" : {
            "value" : 0.3494809688581315
          },
          "total_def_3p_attempts": {
            "value": 450
          },
          "total_def_2p_attempts": {
            "value": 182 + 163
          },
          "total_def_2pmid_attempts" : {
            "value" : 182.0
          },
          "def_ppp" : {
            "value" : 91.61073825503355
          },
          "def_2pmidr" : {
            "value" : 0.35
          },
          "def_3pr" : {
            "value" : 0.36923076923076925
          },
          "total_def_pts" : {
            "value" : 546.0
          },
          "def_3p" : {
            "value" : 0.3020833333333333
          },
          "def_3p_opp":{"value":37.240722891566264},
          "off_poss" : {
            "value" : 590.0
          },
          "total_off_2prim_attempts" : {
            "value" : 163.0
          },
          "def_orb" : {
            "value" : 0.2577903682719547
          },
          "total_def_2pmid_made" : {
            "value" : 62.0
          },
          "total_def_2prim_made" : {
            "value" : 73.0
          },
          "off_2p" : {
            "value" : 0.540625
          },
          "off_efg" : {
            "value" : 0.525691699604743
          },
          "off_to" : {
            "value" : 0.2016949152542373
          },
          "total_off_fta" : {
            "value" : 154.0
          },
          "def_efg" : {
            "value" : 0.4269230769230769
          },
          "def_2prim" : {
            "value" : 0.5
          },
          "off_2pmid" : {
            "value" : 0.4267515923566879
          },
          "def_2pmid" : {
            "value" : 0.34065934065934067
          },
          "off_ftr" : {
            "value" : 0.30434782608695654
          },
          "def_ftr" : {
            "value" : 0.25961538461538464
          },
          "off_2prim" : {
            "value" : 0.6503067484662577
          },
          "off_adj_ppp" : {
            "value" : 115.6744556558683
          },
          "def_adj_ppp" : {
            "value" : 105.23529411764706
          },
          // Assists
          "off_assist" : {
            "value" : 0.51
          },
          "def_assist" : {
            "value" : 0.49
          },
          "total_off_assists": {
            "value": 101
          },
          "total_def_assists": {
            "value": 111
          },
          //(off assist)
          "total_off_ast_3p": {
            "value": 41
          },
          "total_off_ast_mid": {
            "value": 31
          },
          "total_off_ast_rim": {
            "value": 31
          },
          "off_ast_3p": {
            "value": 0.41
          },
          "off_ast_mid": {
            "value": 0.31
          },
          "off_ast_rim": {
            "value": 0.31
          },
          "total_off_3p_ast": {
            "value": 41
          },
          "total_off_2p_ast": {
            "value": 31
          },
          "total_off_2pmid_ast": {
            "value": 31
          },
          "total_off_2prim_ast": {
            "value": 61
          },
          "off_3p_ast": {
            "value": 0.61
          },
          "off_2p_ast": {
            "value": 0.51
          },
          "off_2pmid_ast": {
            "value": 0.26
          },
          "off_2prim_ast": {
            "value": 0.26
          },
          //(def assist)
          "total_def_ast_3p": {
            "value": 46
          },
          "total_def_ast_mid": {
            "value": 36
          },
          "total_def_ast_rim": {
            "value": 36
          },
          "def_ast_3p": {
            "value": 0.46
          },
          "def_ast_mid": {
            "value": 0.36
          },
          "def_ast_rim": {
            "value": 0.36
          },
          "total_def_3p_ast": {
            "value": 46
          },
          "total_def_2p_ast": {
            "value": 36
          },
          "total_def_2pmid_ast": {
            "value": 36
          },
          "total_def_2prim_ast": {
            "value": 66
          },
          "def_3p_ast": {
            "value": 0.66
          },
          "def_2p_ast": {
            "value": 0.56
          },
          "def_2pmid_ast": {
            "value": 0.31
          },
          "def_2prim_ast": {
            "value": 0.31
          },
          //(end assists)
        },
        "on" : {
          "doc_count" : 367,
          "total_off_fga" : {
            "value" : 1111.0
          },
          "off_adj_opp" : {
            "value" : 110.84207221350077
          },
          "total_def_2prim_attempts" : {
            "value" : 278.0
          },
          "total_off_2pmid_attempts" : {
            "value" : 328.0
          },
          "total_off_2pmid_made" : {
            "value" : 139.0
          },
          "total_def_fta" : {
            "value" : 302.0
          },
          "off_2pmidr" : {
            "value" : 0.2952295229522952
          },
          "off_ppp" : {
            "value" : 111.36890951276102
          },
          "off_3pr" : {
            "value" : 0.3726372637263726
          },
          "total_def_fga" : {
            "value" : 1143.0
          },
          "def_poss" : {
            "value" : 1274.0
          },
          "total_off_2prim_made" : {
            "value" : 219.0
          },
          "def_to" : {
            "value" : 0.12637362637362637
          },
          "off_3p" : {
            "value" : 0.3526570048309179
          },
          "def_2p" : {
            "value" : 0.4594594594594595
          },
          "def_adj_opp" : {
            "value" : 98.29651972157772
          },
          "off_2primr" : {
            "value" : 0.3321332133213321
          },
          "def_2primr" : {
            "value" : 0.2432195975503062
          },
          "total_off_pts" : {
            "value" : 1440.0
          },
          "off_orb" : {
            "value" : 0.337442218798151
          },
          "total_def_3p_attempts": {
            "value": 750
          },
          "total_def_2p_attempts": {
            "value": 650
          },
          "total_def_2pmid_attempts" : {
            "value" : 388.0
          },
          "def_ppp" : {
            "value" : 101.33437990580848
          },
          "def_2pmidr" : {
            "value" : 0.3394575678040245
          },
          "def_3pr" : {
            "value" : 0.41732283464566927
          },
          "total_def_pts" : {
            "value" : 1291.0
          },
          "def_3p" : {
            "value" : 0.3249475890985325
          },
          "def_3p_opp":{"value":35.240722891566264},
          "off_poss" : {
            "value" : 1293.0
          },
          "total_off_3p_attempts": {
            "value": 500
          },
          "total_off_2p_attempts": {
            "value": 600
          },
          "total_off_2prim_attempts" : {
            "value" : 369.0
          },
          "def_orb" : {
            "value" : 0.23684210526315788
          },
          "total_def_2pmid_made" : {
            "value" : 147.0
          },
          "total_def_2prim_made" : {
            "value" : 159.0
          },
          "off_2p" : {
            "value" : 0.5136298421807748
          },
          "off_efg" : {
            "value" : 0.5193519351935193
          },
          "off_to" : {
            "value" : 0.18020108275328692
          },
          "total_off_fta" : {
            "value" : 376.0
          },
          "def_efg" : {
            "value" : 0.47112860892388453
          },
          "def_2prim" : {
            "value" : 0.5719424460431655
          },
          "off_2pmid" : {
            "value" : 0.42378048780487804
          },
          "def_2pmid" : {
            "value" : 0.3788659793814433
          },
          "off_ftr" : {
            "value" : 0.3384338433843384
          },
          "def_ftr" : {
            "value" : 0.2642169728783902
          },
          "off_2prim" : {
            "value" : 0.5934959349593496
          },
          "off_adj_ppp": {
            "value": 111
          },
          "def_adj_ppp": {
            "value": 88
          },
          // Assists
          "off_assist" : {
            "value" : 0.52
          },
          "def_assist" : {
            "value" : 0.50
          },
          "total_off_assists": {
            "value": 102
          },
          "total_def_assists": {
            "value": 112
          },
          //(off assist)
          "total_off_ast_3p": {
            "value": 42
          },
          "total_off_ast_mid": {
            "value": 32
          },
          "total_off_ast_rim": {
            "value": 32
          },
          "off_ast_3p": {
            "value": 0.42
          },
          "off_ast_mid": {
            "value": 0.32
          },
          "off_ast_rim": {
            "value": 0.32
          },
          "total_off_3p_ast": {
            "value": 42
          },
          "total_off_2p_ast": {
            "value": 32
          },
          "total_off_2pmid_ast": {
            "value": 32
          },
          "total_off_2prim_ast": {
            "value": 62
          },
          "off_3p_ast": {
            "value": 0.62
          },
          "off_2p_ast": {
            "value": 0.52
          },
          "off_2pmid_ast": {
            "value": 0.27
          },
          "off_2prim_ast": {
            "value": 0.27
          },
          //(def assist)
          "total_def_ast_3p": {
            "value": 47
          },
          "total_def_ast_mid": {
            "value": 37
          },
          "total_def_ast_rim": {
            "value": 37
          },
          "def_ast_3p": {
            "value": 0.47
          },
          "def_ast_mid": {
            "value": 0.37
          },
          "def_ast_rim": {
            "value": 0.37
          },
          "total_def_3p_ast": {
            "value": 47
          },
          "total_def_2p_ast": {
            "value": 37
          },
          "total_def_2pmid_ast": {
            "value": 37
          },
          "total_def_2prim_ast": {
            "value": 67
          },
          "def_3p_ast": {
            "value": 0.67
          },
          "def_2p_ast": {
            "value": 0.57
          },
          "def_2pmid_ast": {
            "value": 0.32
          },
          "def_2prim_ast": {
            "value": 0.32
          },
          //(end assists)
        }
      }
    }
  }
}
