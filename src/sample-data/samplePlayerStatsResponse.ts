import { SampleDataUtils } from "./SampleDataUtils"

// Query: On/Off: 2019/20 Maryland (M): on:'NOT (Hart Or Serrel )', auto-off, base:'', [overrides]

// Cowan, Anthony - baseline
// Wiggins, Aaron - baseline
// Cowan, Anthony - on
// Wiggins, Aaron - on
// Cowan, Anthony - off
// Mona, Reese - off

//(need to remove the intermediate doc_count / doc_count_error_upper_bound / sum_other_doc_count)

export const samplePlayerStatsResponse =
{
  	"took": 202,
		"responses": [{
			"took": 202,
			"timed_out": false,
			"_shards": {
				"total": 1,
				"successful": 1,
				"skipped": 0,
				"failed": 0
			},
			"hits": {
				"total": {
					"value": 2970,
					"relation": "eq"
				},
				"max_score": null,
				"hits": []
			},
			"aggregations": {
				"tri_filter": {
					"buckets": {
						"baseline": {
							"player": {
								"buckets": [
                  {
									"key": "Cowan, Anthony",
                  "player_array": {
                    "hits": {
   		                "total": {
   		                   "value": 72,
   		                   "relation": "eq"
   		                },
   		                "max_score": 4.823819,
   		                "hits": [
   		                   {
   		                      "_index": "bigten_2019_lpong",
   		                      "_type": "_doc",
   		                      "_id": "GdtArXQBjSGDKv5YlXqK",
   		                      "_score": 4.823819,
   		                      "_source": {
   		                         "player":  {
 		                               "code": "AnCowan",
 		                               "id": "Cowan, Anthony"
 		                            },
 		                         }
   		                   }
   		                ]
   		             }
                  },
									"doc_count": 486,
									"total_off_fga": {
										"value": 356
									},
									"oppo_total_def_fga": {
										"value": 1588
									},
									"total_off_2pmid_made": {
										"value": 18
									},
									"total_off_trans_to": {
										"value": 20
									},
									"total_off_trans_assist": {
										"value": 38
									},
									"total_off_2pmid_ast": {
										"value": 0
									},
									"total_off_3p_attempts": {
										"value": 174
									},
									"oppo_total_def_fgm": {
										"value": 637
									},
									"total_off_scramble_assist": {
										"value": 10
									},
									"oppo_def_3p_opp": {
										"value": 33.15740432612313
									},
									"team_total_off_ftm": {
										"value": 438
									},
									"total_off_to": {
										"value": 69
									},
									"total_off_scramble_2pmid_attempts": {
										"value": 4
									},
									"total_off_foul": {
										"value": 63
									},
									"team_total_off_blk": {
										"value": 108
									},
									"oppo_total_def_drb": {
										"value": 674
									},
									"team_total_off_fta": {
										"value": 579
									},
									"total_off_2prim_attempts": {
										"value": 117
									},
									"total_off_drb": {
										"value": 96
									},
									"total_off_scramble_fgm": {
										"value": 11
									},
									"total_off_scramble_fga": {
										"value": 22
									},
									"total_off_scramble_2prim_attempts": {
										"value": 5
									},
									"off_ast_3p_source": {
										"value": {
											"DaMorsell": 10,
											"SeSmith": 2,
											"MlMitchell": 1,
											"ErAyala": 8,
											"AaWiggins": 9,
											"DoScott": 1,
											"RiLindo": 1,
											"JaSmith": 3
										}
									},
									"total_off_2p_made": {
										"value": 83
									},
									"total_off_2prim_made": {
										"value": 65
									},
									"total_off_trans_3p_ast": {
										"value": 5
									},
									"total_off_3p_ast": {
										"value": 35
									},
									"total_off_trans_fga": {
										"value": 55
									},
									"total_off_2prim_ast": {
										"value": 17
									},
									"total_off_scramble_3p_ast": {
										"value": 5
									},
									"total_off_trans_3p_attempts": {
										"value": 23
									},
									"total_off_ftm": {
										"value": 172
									},
									"off_adj_opp": {
										"value": 108.03972067039106
									},
									"total_off_blk": {
										"value": 5
									},
									"oppo_total_def_orb": {
										"value": 274
									},
									"total_off_trans_fgm": {
										"value": 26
									},
									"off_ast_rim_source": {
										"value": {
											"DaMorsell": 5,
											"HaHart": 1,
											"SeSmith": 1,
											"MiMitchell": 1,
											"ErAyala": 3,
											"AaWiggins": 3,
											"JaSmith": 3
										}
									},
									"team_total_off_to": {
										"value": 299
									},
									"oppo_total_def_pts": {
										"value": 1738
									},
									"team_total_off_drb": {
										"value": 726
									},
									"total_off_trans_2prim_made": {
										"value": 17
									},
									"team_total_off_poss": {
										"value": 1802
									},
									"total_off_scramble_2pmid_ast": {
										"value": 0
									},
									"oppo_total_def_poss": {
										"value": 1790
									},
									"total_off_trans_2prim_ast": {
										"value": 5
									},
									"total_off_fta": {
										"value": 212
									},
									"oppo_total_def_to": {
										"value": 312
									},
									"team_total_off_fga": {
										"value": 1550
									},
									"total_off_scramble_2prim_made": {
										"value": 4
									},
									"oppo_total_def_2p_attempts": {
										"value": 987
									},
									"total_off_trans_2p_made": {
										"value": 18
									},
									"team_total_off_fgm": {
										"value": 643
									},
									"oppo_total_def_fta": {
										"value": 384
									},
									"total_off_assist": {
										"value": 147
									},
									"total_off_stl": {
										"value": 30
									},
									"off_ast_mid_source": {
										"value": {}
									},
									"total_off_ast_3p": {
										"value": 70
									},
									"total_off_scramble_ftm": {
										"value": 11
									},
									"oppo_total_def_3p_attempts": {
										"value": 601
									},
									"team_total_off_orb": {
										"value": 310
									},
									"total_off_ast_rim": {
										"value": 67
									},
									"total_off_3p_made": {
										"value": 56
									},
									"total_off_scramble_3p_attempts": {
										"value": 13
									},
									"total_off_trans_2pmid_ast": {
										"value": 0
									},
									"total_off_scramble_2pmid_made": {
										"value": 1
									},
									"total_off_scramble_3p_made": {
										"value": 6
									},
									"off_poss": {
										"value": 451.4845238095238
									},
									"total_off_scramble_fta": {
										"value": 12
									},
									"team_total_off_3p_made": {
										"value": 213
									},
									"total_off_poss": {
										"value": 0
									},
									"total_off_scramble_2prim_ast": {
										"value": 0
									},
									"total_off_trans_2p_attempts": {
										"value": 32
									},
									"total_off_2pmid_attempts": {
										"value": 65
									},
									"oppo_total_def_3p_made": {
										"value": 194
									},
									"total_off_trans_2pmid_made": {
										"value": 1
									},
									"total_off_scramble_2p_attempts": {
										"value": 9
									},
									"total_off_trans_2prim_attempts": {
										"value": 30
									},
									"total_off_scramble_2p_ast": {
										"value": 0
									},
									"off_ast_3p_target": {
										"value": {
											"DaMorsell": 7,
											"SeSmith": 2,
											"ErAyala": 23,
											"DoScott": 5,
											"AaWiggins": 20,
											"RiLindo": 1,
											"JaSmith": 12
										}
									},
									"total_off_pts": {
										"value": 0
									},
									"team_total_off_pts": {
										"value": 1937
									},
									"team_total_off_assist": {
										"value": 361
									},
									"off_ast_rim_target": {
										"value": {
											"DaMorsell": 12,
											"HaHart": 1,
											"MlMitchell": 2,
											"ErAyala": 3,
											"AaWiggins": 7,
											"DoScott": 8,
											"JaSmith": 32,
											"JoTomaic": 2
										}
									},
									"total_off_trans_3p_made": {
										"value": 8
									},
									"total_off_scramble_to": {
										"value": 2
									},
									"def_adj_opp": {
										"value": 96.60184357541898
									},
									"total_off_orb": {
										"value": 17
									},
									"off_ast_mid_target": {
										"value": {
											"DaMorsell": 4,
											"MiMitchell": 1,
											"AaWiggins": 4,
											"JaSmith": 1
										}
									},
									"oppo_total_def_ftm": {
										"value": 270
									},
									"total_off_ast_mid": {
										"value": 10
									},
									"total_off_trans_2pmid_attempts": {
										"value": 2
									},
									"team_total_off_stl": {
										"value": 126
									},
									"total_off_2p_ast": {
										"value": 0
									},
									"total_off_2p_attempts": {
										"value": 182
									},
									"total_off_fgm": {
										"value": 139
									},
									"total_off_trans_fta": {
										"value": 85
									},
									"total_off_scramble_2p_made": {
										"value": 5
									},
									"team_total_off_foul": {
										"value": 399
									},
									"total_off_trans_ftm": {
										"value": 70
									},
									"total_off_trans_2p_ast": {
										"value": 0
									},
									"off_2p": {
										"value": 0.45604395604395603
									},
									"off_2p_ast": {
										"value": 0
									},
									"off_3p": {
										"value": 0.3218390804597701
									},
									"off_3p_ast": {
										"value": 0.625
									},
									"off_2prim": {
										"value": 0.5555555555555556
									},
									"off_2prim_ast": {
										"value": 0.26153846153846155
									},
									"off_2pmid": {
										"value": 0.27692307692307694
									},
									"off_2pmid_ast": {
										"value": 0
									},
									"off_ft": {
										"value": 0.8113207547169812
									},
									"off_ftr": {
										"value": 0.5955056179775281
									},
									"off_2primr": {
										"value": 0.32865168539325845
									},
									"off_2pmidr": {
										"value": 0.18258426966292135
									},
									"off_3pr": {
										"value": 0.4887640449438202
									},
									"off_scramble_2p": {
										"value": 0.5555555555555556
									},
									"off_scramble_2p_ast": {
										"value": 0
									},
									"off_scramble_3p": {
										"value": 0.46153846153846156
									},
									"off_scramble_3p_ast": {
										"value": 0.8333333333333334
									},
									"off_scramble_2prim": {
										"value": 0.8
									},
									"off_scramble_2prim_ast": {
										"value": 0
									},
									"off_scramble_2pmid": {
										"value": 0.25
									},
									"off_scramble_2pmid_ast": {
										"value": 0
									},
									"off_scramble_ft": {
										"value": 0.9166666666666666
									},
									"off_scramble_ftr": {
										"value": 0.5454545454545454
									},
									"off_scramble_2primr": {
										"value": 0.22727272727272727
									},
									"off_scramble_2pmidr": {
										"value": 0.18181818181818182
									},
									"off_scramble_3pr": {
										"value": 0.5909090909090909
									},
									"off_scramble_assist": {
										"value": 0.9090909090909091
									},
									"off_trans_2p": {
										"value": 0.5625
									},
									"off_trans_2p_ast": {
										"value": 0
									},
									"off_trans_3p": {
										"value": 0.34782608695652173
									},
									"off_trans_3p_ast": {
										"value": 0.625
									},
									"off_trans_2prim": {
										"value": 0.5666666666666667
									},
									"off_trans_2prim_ast": {
										"value": 0.29411764705882354
									},
									"off_trans_2pmid": {
										"value": 0.5
									},
									"off_trans_2pmid_ast": {
										"value": 0
									},
									"off_trans_ft": {
										"value": 0.8235294117647058
									},
									"off_trans_ftr": {
										"value": 1.5454545454545454
									},
									"off_trans_2primr": {
										"value": 0.5454545454545454
									},
									"off_trans_2pmidr": {
										"value": 0.03636363636363636
									},
									"off_trans_3pr": {
										"value": 0.41818181818181815
									},
									"off_trans_assist": {
										"value": 1.4615384615384615
									},
									"off_ast_rim": {
										"value": 0.4557823129251701
									},
									"off_ast_mid": {
										"value": 0.06802721088435375
									},
									"off_ast_3p": {
										"value": 0.47619047619047616
									},
									"total_off_scramble_pts": {
										"value": 39
									},
									"total_off_trans_pts": {
										"value": 130
									},
									"off_efg": {
										"value": 0.4691011235955056
									},
									"off_scramble_efg": {
										"value": 0.6363636363636364
									},
									"off_trans_efg": {
										"value": 0.5454545454545454
									},
									"off_team_poss": {
										"value": 1802
									},
                  "duration_mins": {
    		             "value": 900
    		          },
									"off_assist": {
										"value": 0.2916666666666667
									},
									"off_to": {
										"value": 0.1528291588331615
									},
									"off_orb": {
										"value": 0.017276422764227643
									},
									"off_usage": {
										"value": 0.250546350615718
									},
									"def_team_poss": {
										"value": 1790
									},
									"def_orb": {
										"value": 0.096
									},
									"def_ftr": {
										"value": 0.024636871508379884
									},
									"def_to": {
										"value": 0.01675977653631285
									},
									"def_2prim": {
										"value": 0.005065856129685917
									}
								},
                  {
									"key": "Wiggins, Aaron",
                  "player_array": {
                    "hits": {
   		                "total": {
   		                   "value": 72,
   		                   "relation": "eq"
   		                },
   		                "max_score": 4.823819,
   		                "hits": [
   		                   {
   		                      "_index": "bigten_2019_lpong",
   		                      "_type": "_doc",
   		                      "_id": "GdtArXQBjSGDKv5YlXqK",
   		                      "_score": 4.823819,
   		                      "_source": {
   		                         "player":  {
 		                               "code": "AaWiggins",
 		                               "id": "Wiggins, Aaron"
 		                            },
 		                         }
   		                   }
   		                ]
   		             }
                  },
									"doc_count": 421,
									"total_off_fga": {
										"value": 300
									},
									"oppo_total_def_fga": {
										"value": 1294
									},
									"total_off_2pmid_made": {
										"value": 18
									},
									"total_off_trans_to": {
										"value": 6
									},
									"total_off_trans_assist": {
										"value": 11
									},
									"total_off_2pmid_ast": {
										"value": 6
									},
									"total_off_3p_attempts": {
										"value": 167
									},
									"oppo_total_def_fgm": {
										"value": 504
									},
									"total_off_scramble_assist": {
										"value": 1
									},
									"oppo_def_3p_opp": {
										"value": 33.168145161290326
									},
									"team_total_off_ftm": {
										"value": 392
									},
									"total_off_to": {
										"value": 50
									},
									"total_off_scramble_2pmid_attempts": {
										"value": 5
									},
									"total_off_foul": {
										"value": 48
									},
									"team_total_off_blk": {
										"value": 91
									},
									"oppo_total_def_drb": {
										"value": 545
									},
									"team_total_off_fta": {
										"value": 523
									},
									"total_off_2prim_attempts": {
										"value": 59
									},
									"total_off_drb": {
										"value": 116
									},
									"total_off_scramble_fgm": {
										"value": 11
									},
									"total_off_scramble_fga": {
										"value": 26
									},
									"total_off_scramble_2prim_attempts": {
										"value": 12
									},
									"off_ast_3p_source": {
										"value": {
											"DaMorsell": 6,
											"HaHart": 1,
											"SeSmith": 1,
											"ErAyala": 18,
											"AnCowan": 20,
											"DoScott": 2,
											"JaSmith": 1
										}
									},
									"total_off_2p_made": {
										"value": 60
									},
									"total_off_2prim_made": {
										"value": 42
									},
									"total_off_trans_3p_ast": {
										"value": 12
									},
									"total_off_3p_ast": {
										"value": 49
									},
									"total_off_trans_fga": {
										"value": 73
									},
									"total_off_2prim_ast": {
										"value": 19
									},
									"total_off_scramble_3p_ast": {
										"value": 2
									},
									"total_off_trans_3p_attempts": {
										"value": 47
									},
									"total_off_ftm": {
										"value": 43
									},
									"off_adj_opp": {
										"value": 107.7926845637584
									},
									"total_off_blk": {
										"value": 13
									},
									"oppo_total_def_orb": {
										"value": 221
									},
									"total_off_trans_fgm": {
										"value": 30
									},
									"off_ast_rim_source": {
										"value": {
											"DaMorsell": 6,
											"HaHart": 1,
											"ErAyala": 3,
											"AnCowan": 7,
											"JaSmith": 2
										}
									},
									"team_total_off_to": {
										"value": 246
									},
									"oppo_total_def_pts": {
										"value": 1376
									},
									"team_total_off_drb": {
										"value": 619
									},
									"total_off_trans_2prim_made": {
										"value": 13
									},
									"team_total_off_poss": {
										"value": 1499
									},
									"total_off_scramble_2pmid_ast": {
										"value": 1
									},
									"oppo_total_def_poss": {
										"value": 1490
									},
									"total_off_trans_2prim_ast": {
										"value": 8
									},
									"total_off_fta": {
										"value": 60
									},
									"oppo_total_def_to": {
										"value": 278
									},
									"team_total_off_fga": {
										"value": 1278
									},
									"total_off_scramble_2prim_made": {
										"value": 8
									},
									"oppo_total_def_2p_attempts": {
										"value": 798
									},
									"total_off_trans_2p_made": {
										"value": 17
									},
									"team_total_off_fgm": {
										"value": 545
									},
									"oppo_total_def_fta": {
										"value": 314
									},
									"total_off_assist": {
										"value": 44
									},
									"total_off_stl": {
										"value": 26
									},
									"off_ast_mid_source": {
										"value": {
											"MiMitchell": 1,
											"AnCowan": 4,
											"JaSmith": 1
										}
									},
									"total_off_ast_3p": {
										"value": 22
									},
									"total_off_scramble_ftm": {
										"value": 3
									},
									"oppo_total_def_3p_attempts": {
										"value": 496
									},
									"team_total_off_orb": {
										"value": 259
									},
									"total_off_ast_rim": {
										"value": 18
									},
									"total_off_3p_made": {
										"value": 53
									},
									"total_off_scramble_3p_attempts": {
										"value": 9
									},
									"total_off_trans_2pmid_ast": {
										"value": 1
									},
									"total_off_scramble_2pmid_made": {
										"value": 1
									},
									"total_off_scramble_3p_made": {
										"value": 2
									},
									"off_poss": {
										"value": 312.7630952380952
									},
									"total_off_scramble_fta": {
										"value": 5
									},
									"team_total_off_3p_made": {
										"value": 177
									},
									"total_off_poss": {
										"value": 0
									},
									"total_off_scramble_2prim_ast": {
										"value": 2
									},
									"total_off_trans_2p_attempts": {
										"value": 26
									},
									"total_off_2pmid_attempts": {
										"value": 74
									},
									"oppo_total_def_3p_made": {
										"value": 151
									},
									"total_off_trans_2pmid_made": {
										"value": 4
									},
									"total_off_scramble_2p_attempts": {
										"value": 17
									},
									"total_off_trans_2prim_attempts": {
										"value": 18
									},
									"total_off_scramble_2p_ast": {
										"value": 0
									},
									"off_ast_3p_target": {
										"value": {
											"DaMorsell": 1,
											"SeSmith": 1,
											"HaHart": 1,
											"ErAyala": 1,
											"AnCowan": 9,
											"DoScott": 6,
											"RiLindo": 1,
											"JaSmith": 2
										}
									},
									"total_off_pts": {
										"value": 0
									},
									"team_total_off_pts": {
										"value": 1659
									},
									"team_total_off_assist": {
										"value": 288
									},
									"off_ast_rim_target": {
										"value": {
											"DaMorsell": 1,
											"SeSmith": 1,
											"MiMitchell": 1,
											"ErAyala": 1,
											"AnCowan": 3,
											"DoScott": 1,
											"RiLindo": 1,
											"JaSmith": 9
										}
									},
									"total_off_trans_3p_made": {
										"value": 13
									},
									"total_off_scramble_to": {
										"value": 7
									},
									"def_adj_opp": {
										"value": 96.76946308724833
									},
									"total_off_orb": {
										"value": 35
									},
									"off_ast_mid_target": {
										"value": {
											"DaMorsell": 2,
											"JaSmith": 2
										}
									},
									"oppo_total_def_ftm": {
										"value": 217
									},
									"total_off_ast_mid": {
										"value": 4
									},
									"total_off_trans_2pmid_attempts": {
										"value": 8
									},
									"team_total_off_stl": {
										"value": 111
									},
									"total_off_2p_ast": {
										"value": 0
									},
									"total_off_2p_attempts": {
										"value": 133
									},
									"total_off_fgm": {
										"value": 113
									},
									"total_off_trans_fta": {
										"value": 24
									},
									"total_off_scramble_2p_made": {
										"value": 9
									},
									"team_total_off_foul": {
										"value": 343
									},
									"total_off_trans_ftm": {
										"value": 19
									},
									"total_off_trans_2p_ast": {
										"value": 0
									},
									"off_2p": {
										"value": 0.45112781954887216
									},
									"off_2p_ast": {
										"value": 0
									},
									"off_3p": {
										"value": 0.31736526946107785
									},
									"off_3p_ast": {
										"value": 0.9245283018867925
									},
									"off_2prim": {
										"value": 0.711864406779661
									},
									"off_2prim_ast": {
										"value": 0.4523809523809524
									},
									"off_2pmid": {
										"value": 0.24324324324324326
									},
									"off_2pmid_ast": {
										"value": 0.3333333333333333
									},
									"off_ft": {
										"value": 0.7166666666666667
									},
									"off_ftr": {
										"value": 0.2
									},
									"off_2primr": {
										"value": 0.19666666666666666
									},
									"off_2pmidr": {
										"value": 0.24666666666666667
									},
									"off_3pr": {
										"value": 0.5566666666666666
									},
									"off_scramble_2p": {
										"value": 0.5294117647058824
									},
									"off_scramble_2p_ast": {
										"value": 0
									},
									"off_scramble_3p": {
										"value": 0.2222222222222222
									},
									"off_scramble_3p_ast": {
										"value": 1
									},
									"off_scramble_2prim": {
										"value": 0.6666666666666666
									},
									"off_scramble_2prim_ast": {
										"value": 0.25
									},
									"off_scramble_2pmid": {
										"value": 0.2
									},
									"off_scramble_2pmid_ast": {
										"value": 1
									},
									"off_scramble_ft": {
										"value": 0.6
									},
									"off_scramble_ftr": {
										"value": 0.19230769230769232
									},
									"off_scramble_2primr": {
										"value": 0.46153846153846156
									},
									"off_scramble_2pmidr": {
										"value": 0.19230769230769232
									},
									"off_scramble_3pr": {
										"value": 0.34615384615384615
									},
									"off_scramble_assist": {
										"value": 0.09090909090909091
									},
									"off_trans_2p": {
										"value": 0.6538461538461539
									},
									"off_trans_2p_ast": {
										"value": 0
									},
									"off_trans_3p": {
										"value": 0.2765957446808511
									},
									"off_trans_3p_ast": {
										"value": 0.9230769230769231
									},
									"off_trans_2prim": {
										"value": 0.7222222222222222
									},
									"off_trans_2prim_ast": {
										"value": 0.6153846153846154
									},
									"off_trans_2pmid": {
										"value": 0.5
									},
									"off_trans_2pmid_ast": {
										"value": 0.25
									},
									"off_trans_ft": {
										"value": 0.7916666666666666
									},
									"off_trans_ftr": {
										"value": 0.3287671232876712
									},
									"off_trans_2primr": {
										"value": 0.2465753424657534
									},
									"off_trans_2pmidr": {
										"value": 0.1095890410958904
									},
									"off_trans_3pr": {
										"value": 0.6438356164383562
									},
									"off_trans_assist": {
										"value": 0.36666666666666664
									},
									"off_ast_rim": {
										"value": 0.4090909090909091
									},
									"off_ast_mid": {
										"value": 0.09090909090909091
									},
									"off_ast_3p": {
										"value": 0.5
									},
									"total_off_scramble_pts": {
										"value": 27
									},
									"total_off_trans_pts": {
										"value": 92
									},
									"off_efg": {
										"value": 0.465
									},
									"off_scramble_efg": {
										"value": 0.46153846153846156
									},
									"off_trans_efg": {
										"value": 0.5
									},
									"off_team_poss": {
										"value": 1499
									},
                  "duration_mins": {
    		             "value": 800
    		          },
									"off_assist": {
										"value": 0.10185185185185185
									},
									"off_to": {
										"value": 0.15986540855127684
									},
									"off_orb": {
										"value": 0.043532338308457715
									},
									"off_usage": {
										"value": 0.20864782871120427
									},
									"def_team_poss": {
										"value": 1490
									},
									"def_orb": {
										"value": 0.1380952380952381
									},
									"def_ftr": {
										"value": 0.022550335570469794
									},
									"def_to": {
										"value": 0.0174496644295302
									},
									"def_2prim": {
										"value": 0.016290726817042606
									}
								}
                ]
							}
						},
						"off": {
							"player": {
								"buckets": [
                  {
									"key": "Cowan, Anthony",
                  "player_array": {
                    "hits": {
   		                "total": {
   		                   "value": 72,
   		                   "relation": "eq"
   		                },
   		                "max_score": 4.823819,
   		                "hits": [
   		                   {
   		                      "_index": "bigten_2019_lpong",
   		                      "_type": "_doc",
   		                      "_id": "GdtArXQBjSGDKv5YlXqK",
   		                      "_score": 4.823819,
   		                      "_source": {
   		                         "player":  {
 		                               "code": "AnCowan",
 		                               "id": "Cowan, Anthony"
 		                            },
 		                         }
   		                   }
   		                ]
   		             }
                  },
									"doc_count": 110,
									"total_off_fga": {
										"value": 64
									},
									"oppo_total_def_fga": {
										"value": 244
									},
									"total_off_2pmid_made": {
										"value": 4
									},
									"total_off_trans_to": {
										"value": 4
									},
									"total_off_trans_assist": {
										"value": 5
									},
									"total_off_2pmid_ast": {
										"value": 0
									},
									"total_off_3p_attempts": {
										"value": 30
									},
									"oppo_total_def_fgm": {
										"value": 97
									},
									"total_off_scramble_assist": {
										"value": 5
									},
									"oppo_def_3p_opp": {
										"value": 32.68260869565218
									},
									"team_total_off_ftm": {
										"value": 72
									},
									"total_off_to": {
										"value": 9
									},
									"total_off_scramble_2pmid_attempts": {
										"value": 2
									},
									"total_off_foul": {
										"value": 11
									},
									"team_total_off_blk": {
										"value": 15
									},
									"oppo_total_def_drb": {
										"value": 115
									},
									"team_total_off_fta": {
										"value": 92
									},
									"total_off_2prim_attempts": {
										"value": 21
									},
									"total_off_drb": {
										"value": 16
									},
									"total_off_scramble_fgm": {
										"value": 4
									},
									"total_off_scramble_fga": {
										"value": 7
									},
									"total_off_scramble_2prim_attempts": {
										"value": 2
									},
									"off_ast_3p_source": {
										"value": {
											"DaMorsell": 2,
											"SeSmith": 2,
											"AaWiggins": 1,
											"RiLindo": 1
										}
									},
									"total_off_2p_made": {
										"value": 15
									},
									"total_off_2prim_made": {
										"value": 11
									},
									"total_off_trans_3p_ast": {
										"value": 1
									},
									"total_off_3p_ast": {
										"value": 6
									},
									"total_off_trans_fga": {
										"value": 9
									},
									"total_off_2prim_ast": {
										"value": 2
									},
									"total_off_scramble_3p_ast": {
										"value": 2
									},
									"total_off_trans_3p_attempts": {
										"value": 4
									},
									"total_off_ftm": {
										"value": 38
									},
									"off_adj_opp": {
										"value": 106.80295202952028
									},
									"total_off_blk": {
										"value": 0
									},
									"oppo_total_def_orb": {
										"value": 53
									},
									"total_off_trans_fgm": {
										"value": 5
									},
									"off_ast_rim_source": {
										"value": {
											"HaHart": 1,
											"SeSmith": 1
										}
									},
									"team_total_off_to": {
										"value": 38
									},
									"oppo_total_def_pts": {
										"value": 272
									},
									"team_total_off_drb": {
										"value": 99
									},
									"total_off_trans_2prim_made": {
										"value": 3
									},
									"team_total_off_poss": {
										"value": 272
									},
									"total_off_scramble_2pmid_ast": {
										"value": 0
									},
									"oppo_total_def_poss": {
										"value": 271
									},
									"total_off_trans_2prim_ast": {
										"value": 1
									},
									"total_off_fta": {
										"value": 43
									},
									"oppo_total_def_to": {
										"value": 52
									},
									"team_total_off_fga": {
										"value": 250
									},
									"total_off_scramble_2prim_made": {
										"value": 1
									},
									"oppo_total_def_2p_attempts": {
										"value": 152
									},
									"total_off_trans_2p_made": {
										"value": 3
									},
									"team_total_off_fgm": {
										"value": 89
									},
									"oppo_total_def_fta": {
										"value": 57
									},
									"total_off_assist": {
										"value": 21
									},
									"total_off_stl": {
										"value": 2
									},
									"off_ast_mid_source": {
										"value": {}
									},
									"total_off_ast_3p": {
										"value": 13
									},
									"total_off_scramble_ftm": {
										"value": 2
									},
									"oppo_total_def_3p_attempts": {
										"value": 92
									},
									"team_total_off_orb": {
										"value": 57
									},
									"total_off_ast_rim": {
										"value": 7
									},
									"total_off_3p_made": {
										"value": 9
									},
									"total_off_scramble_3p_attempts": {
										"value": 3
									},
									"total_off_trans_2pmid_ast": {
										"value": 0
									},
									"total_off_scramble_2pmid_made": {
										"value": 1
									},
									"total_off_scramble_3p_made": {
										"value": 2
									},
									"off_poss": {
										"value": 78.06547619047619
									},
									"total_off_scramble_fta": {
										"value": 2
									},
									"team_total_off_3p_made": {
										"value": 32
									},
									"total_off_poss": {
										"value": 0
									},
									"total_off_scramble_2prim_ast": {
										"value": 0
									},
									"total_off_trans_2p_attempts": {
										"value": 5
									},
									"total_off_2pmid_attempts": {
										"value": 13
									},
									"oppo_total_def_3p_made": {
										"value": 32
									},
									"total_off_trans_2pmid_made": {
										"value": 0
									},
									"total_off_scramble_2p_attempts": {
										"value": 4
									},
									"total_off_trans_2prim_attempts": {
										"value": 5
									},
									"total_off_scramble_2p_ast": {
										"value": 0
									},
									"off_ast_3p_target": {
										"value": {
											"SeSmith": 2,
											"ErAyala": 1,
											"AaWiggins": 7,
											"DoScott": 1,
											"RiLindo": 1,
											"JaSmith": 1
										}
									},
									"total_off_pts": {
										"value": 0
									},
									"team_total_off_pts": {
										"value": 282
									},
									"team_total_off_assist": {
										"value": 49
									},
									"off_ast_rim_target": {
										"value": {
											"HaHart": 1,
											"MlMitchell": 1,
											"AaWiggins": 2,
											"JaSmith": 2,
											"JoTomaic": 1
										}
									},
									"total_off_trans_3p_made": {
										"value": 2
									},
									"total_off_scramble_to": {
										"value": 0
									},
									"def_adj_opp": {
										"value": 98.20405904059041
									},
									"total_off_orb": {
										"value": 5
									},
									"off_ast_mid_target": {
										"value": {
											"AaWiggins": 1
										}
									},
									"oppo_total_def_ftm": {
										"value": 46
									},
									"total_off_ast_mid": {
										"value": 1
									},
									"total_off_trans_2pmid_attempts": {
										"value": 0
									},
									"team_total_off_stl": {
										"value": 17
									},
									"total_off_2p_ast": {
										"value": 0
									},
									"total_off_2p_attempts": {
										"value": 34
									},
									"total_off_fgm": {
										"value": 24
									},
									"total_off_trans_fta": {
										"value": 17
									},
									"total_off_scramble_2p_made": {
										"value": 2
									},
									"team_total_off_foul": {
										"value": 69
									},
									"total_off_trans_ftm": {
										"value": 16
									},
									"total_off_trans_2p_ast": {
										"value": 0
									},
									"off_2p": {
										"value": 0.4411764705882353
									},
									"off_2p_ast": {
										"value": 0
									},
									"off_3p": {
										"value": 0.3
									},
									"off_3p_ast": {
										"value": 0.6666666666666666
									},
									"off_2prim": {
										"value": 0.5238095238095238
									},
									"off_2prim_ast": {
										"value": 0.18181818181818182
									},
									"off_2pmid": {
										"value": 0.3076923076923077
									},
									"off_2pmid_ast": {
										"value": 0
									},
									"off_ft": {
										"value": 0.8837209302325582
									},
									"off_ftr": {
										"value": 0.671875
									},
									"off_2primr": {
										"value": 0.328125
									},
									"off_2pmidr": {
										"value": 0.203125
									},
									"off_3pr": {
										"value": 0.46875
									},
									"off_scramble_2p": {
										"value": 0.5
									},
									"off_scramble_2p_ast": {
										"value": 0
									},
									"off_scramble_3p": {
										"value": 0.6666666666666666
									},
									"off_scramble_3p_ast": {
										"value": 1
									},
									"off_scramble_2prim": {
										"value": 0.5
									},
									"off_scramble_2prim_ast": {
										"value": 0
									},
									"off_scramble_2pmid": {
										"value": 0.5
									},
									"off_scramble_2pmid_ast": {
										"value": 0
									},
									"off_scramble_ft": {
										"value": 1
									},
									"off_scramble_ftr": {
										"value": 0.2857142857142857
									},
									"off_scramble_2primr": {
										"value": 0.2857142857142857
									},
									"off_scramble_2pmidr": {
										"value": 0.2857142857142857
									},
									"off_scramble_3pr": {
										"value": 0.42857142857142855
									},
									"off_scramble_assist": {
										"value": 1.25
									},
									"off_trans_2p": {
										"value": 0.6
									},
									"off_trans_2p_ast": {
										"value": 0
									},
									"off_trans_3p": {
										"value": 0.5
									},
									"off_trans_3p_ast": {
										"value": 0.5
									},
									"off_trans_2prim": {
										"value": 0.6
									},
									"off_trans_2prim_ast": {
										"value": 0.3333333333333333
									},
									"off_trans_2pmid": {
										"value": 0
									},
									"off_trans_2pmid_ast": {
										"value": 0
									},
									"off_trans_ft": {
										"value": 0.9411764705882353
									},
									"off_trans_ftr": {
										"value": 1.8888888888888888
									},
									"off_trans_2primr": {
										"value": 0.5555555555555556
									},
									"off_trans_2pmidr": {
										"value": 0
									},
									"off_trans_3pr": {
										"value": 0.4444444444444444
									},
									"off_trans_assist": {
										"value": 1
									},
									"off_ast_rim": {
										"value": 0.3333333333333333
									},
									"off_ast_mid": {
										"value": 0.047619047619047616
									},
									"off_ast_3p": {
										"value": 0.6190476190476191
									},
									"total_off_scramble_pts": {
										"value": 12
									},
									"total_off_trans_pts": {
										"value": 28
									},
									"off_efg": {
										"value": 0.4453125
									},
									"off_scramble_efg": {
										"value": 0.7142857142857143
									},
									"off_trans_efg": {
										"value": 0.6666666666666666
									},
									"off_team_poss": {
										"value": 272
									},
                  "duration_mins": {
    		             "value": 200
    		          },
									"off_assist": {
										"value": 0.3230769230769231
									},
									"off_to": {
										"value": 0.11528783835303089
									},
									"off_orb": {
										"value": 0.029069767441860465
									},
									"off_usage": {
										"value": 0.28700542717086835
									},
									"def_team_poss": {
										"value": 271
									},
									"def_orb": {
										"value": 0.10526315789473684
									},
									"def_ftr": {
										"value": 0.028413284132841325
									},
									"def_to": {
										"value": 0.007380073800738007
									},
									"def_2prim": {
										"value": 0
									}
								},
                  {
									"key": "Mona, Reese",
                  "player_array": {
                    "hits": {
   		                "total": {
   		                   "value": 72,
   		                   "relation": "eq"
   		                },
   		                "max_score": 4.823819,
   		                "hits": [
   		                   {
   		                      "_index": "bigten_2019_lpong",
   		                      "_type": "_doc",
   		                      "_id": "GdtArXQBjSGDKv5YlXqK",
   		                      "_score": 4.823819,
   		                      "_source": {
   		                         "player":  {
 		                               "code": "ReMona",
 		                               "id": "Mona, Reese"
 		                            },
 		                         }
   		                   }
   		                ]
   		             }
                  },
									"doc_count": 17,
									"total_off_fga": {
										"value": 3
									},
									"oppo_total_def_fga": {
										"value": 34
									},
									"total_off_2pmid_made": {
										"value": 1
									},
									"total_off_trans_to": {
										"value": 0
									},
									"total_off_trans_assist": {
										"value": 0
									},
									"total_off_2pmid_ast": {
										"value": 1
									},
									"total_off_3p_attempts": {
										"value": 1
									},
									"oppo_total_def_fgm": {
										"value": 19
									},
									"total_off_scramble_assist": {
										"value": 0
									},
									"oppo_def_3p_opp": {
										"value": 31.123529411764707
									},
									"team_total_off_ftm": {
										"value": 13
									},
									"total_off_to": {
										"value": 1
									},
									"total_off_scramble_2pmid_attempts": {
										"value": 0
									},
									"total_off_foul": {
										"value": 3
									},
									"team_total_off_blk": {
										"value": 2
									},
									"oppo_total_def_drb": {
										"value": 12
									},
									"team_total_off_fta": {
										"value": 16
									},
									"total_off_2prim_attempts": {
										"value": 1
									},
									"total_off_drb": {
										"value": 1
									},
									"total_off_scramble_fgm": {
										"value": 0
									},
									"total_off_scramble_fga": {
										"value": 0
									},
									"total_off_scramble_2prim_attempts": {
										"value": 0
									},
									"off_ast_3p_source": {
										"value": {
											"HaHart": 1
										}
									},
									"total_off_2p_made": {
										"value": 2
									},
									"total_off_2prim_made": {
										"value": 1
									},
									"total_off_trans_3p_ast": {
										"value": 1
									},
									"total_off_3p_ast": {
										"value": 1
									},
									"total_off_trans_fga": {
										"value": 2
									},
									"total_off_2prim_ast": {
										"value": 0
									},
									"total_off_scramble_3p_ast": {
										"value": 0
									},
									"total_off_trans_3p_attempts": {
										"value": 1
									},
									"total_off_ftm": {
										"value": 2
									},
									"off_adj_opp": {
										"value": 101.45714285714286
									},
									"total_off_blk": {
										"value": 1
									},
									"oppo_total_def_orb": {
										"value": 3
									},
									"total_off_trans_fgm": {
										"value": 2
									},
									"off_ast_rim_source": {
										"value": {}
									},
									"team_total_off_to": {
										"value": 6
									},
									"oppo_total_def_pts": {
										"value": 57
									},
									"team_total_off_drb": {
										"value": 12
									},
									"total_off_trans_2prim_made": {
										"value": 0
									},
									"team_total_off_poss": {
										"value": 38
									},
									"total_off_scramble_2pmid_ast": {
										"value": 0
									},
									"oppo_total_def_poss": {
										"value": 42
									},
									"total_off_trans_2prim_ast": {
										"value": 0
									},
									"total_off_fta": {
										"value": 2
									},
									"oppo_total_def_to": {
										"value": 6
									},
									"team_total_off_fga": {
										"value": 28
									},
									"total_off_scramble_2prim_made": {
										"value": 0
									},
									"oppo_total_def_2p_attempts": {
										"value": 17
									},
									"total_off_trans_2p_made": {
										"value": 1
									},
									"team_total_off_fgm": {
										"value": 15
									},
									"oppo_total_def_fta": {
										"value": 12
									},
									"total_off_assist": {
										"value": 2
									},
									"total_off_stl": {
										"value": 1
									},
									"off_ast_mid_source": {
										"value": {
											"SeSmith": 1
										}
									},
									"total_off_ast_3p": {
										"value": 1
									},
									"total_off_scramble_ftm": {
										"value": 0
									},
									"oppo_total_def_3p_attempts": {
										"value": 17
									},
									"team_total_off_orb": {
										"value": 2
									},
									"total_off_ast_rim": {
										"value": 1
									},
									"total_off_3p_made": {
										"value": 1
									},
									"total_off_scramble_3p_attempts": {
										"value": 0
									},
									"total_off_trans_2pmid_ast": {
										"value": 1
									},
									"total_off_scramble_2pmid_made": {
										"value": 0
									},
									"total_off_scramble_3p_made": {
										"value": 0
									},
									"off_poss": {
										"value": 4.95
									},
									"total_off_scramble_fta": {
										"value": 0
									},
									"team_total_off_3p_made": {
										"value": 3
									},
									"total_off_poss": {
										"value": 0
									},
									"total_off_scramble_2prim_ast": {
										"value": 0
									},
									"total_off_trans_2p_attempts": {
										"value": 1
									},
									"total_off_2pmid_attempts": {
										"value": 1
									},
									"oppo_total_def_3p_made": {
										"value": 10
									},
									"total_off_trans_2pmid_made": {
										"value": 1
									},
									"total_off_scramble_2p_attempts": {
										"value": 0
									},
									"total_off_trans_2prim_attempts": {
										"value": 0
									},
									"total_off_scramble_2p_ast": {
										"value": 0
									},
									"off_ast_3p_target": {
										"value": {
											"HaHart": 1
										}
									},
									"total_off_pts": {
										"value": 0
									},
									"team_total_off_pts": {
										"value": 46
									},
									"team_total_off_assist": {
										"value": 7
									},
									"off_ast_rim_target": {
										"value": {
											"RiLindo": 1
										}
									},
									"total_off_trans_3p_made": {
										"value": 1
									},
									"total_off_scramble_to": {
										"value": 0
									},
									"def_adj_opp": {
										"value": 102.20714285714286
									},
									"total_off_orb": {
										"value": 0
									},
									"off_ast_mid_target": {
										"value": {}
									},
									"oppo_total_def_ftm": {
										"value": 9
									},
									"total_off_ast_mid": {
										"value": 0
									},
									"total_off_trans_2pmid_attempts": {
										"value": 1
									},
									"team_total_off_stl": {
										"value": 2
									},
									"total_off_2p_ast": {
										"value": 0
									},
									"total_off_2p_attempts": {
										"value": 2
									},
									"total_off_fgm": {
										"value": 3
									},
									"total_off_trans_fta": {
										"value": 0
									},
									"total_off_scramble_2p_made": {
										"value": 0
									},
									"team_total_off_foul": {
										"value": 7
									},
									"total_off_trans_ftm": {
										"value": 0
									},
									"total_off_trans_2p_ast": {
										"value": 0
									},
									"off_2p": {
										"value": 1
									},
									"off_2p_ast": {
										"value": 0
									},
									"off_3p": {
										"value": 1
									},
									"off_3p_ast": {
										"value": 1
									},
									"off_2prim": {
										"value": 1
									},
									"off_2prim_ast": {
										"value": 0
									},
									"off_2pmid": {
										"value": 1
									},
									"off_2pmid_ast": {
										"value": 1
									},
									"off_ft": {
										"value": 1
									},
									"off_ftr": {
										"value": 0.6666666666666666
									},
									"off_2primr": {
										"value": 0.3333333333333333
									},
									"off_2pmidr": {
										"value": 0.3333333333333333
									},
									"off_3pr": {
										"value": 0.3333333333333333
									},
									"off_scramble_2p": {
										"value": 0
									},
									"off_scramble_2p_ast": {
										"value": 0
									},
									"off_scramble_3p": {
										"value": 0
									},
									"off_scramble_3p_ast": {
										"value": 0
									},
									"off_scramble_2prim": {
										"value": 0
									},
									"off_scramble_2prim_ast": {
										"value": 0
									},
									"off_scramble_2pmid": {
										"value": 0
									},
									"off_scramble_2pmid_ast": {
										"value": 0
									},
									"off_scramble_ft": {
										"value": 0
									},
									"off_scramble_ftr": {
										"value": 0
									},
									"off_scramble_2primr": {
										"value": 0
									},
									"off_scramble_2pmidr": {
										"value": 0
									},
									"off_scramble_3pr": {
										"value": 0
									},
									"off_scramble_assist": {
										"value": 0
									},
									"off_trans_2p": {
										"value": 1
									},
									"off_trans_2p_ast": {
										"value": 0
									},
									"off_trans_3p": {
										"value": 1
									},
									"off_trans_3p_ast": {
										"value": 1
									},
									"off_trans_2prim": {
										"value": 0
									},
									"off_trans_2prim_ast": {
										"value": 0
									},
									"off_trans_2pmid": {
										"value": 1
									},
									"off_trans_2pmid_ast": {
										"value": 1
									},
									"off_trans_ft": {
										"value": 0
									},
									"off_trans_ftr": {
										"value": 0
									},
									"off_trans_2primr": {
										"value": 0
									},
									"off_trans_2pmidr": {
										"value": 0.5
									},
									"off_trans_3pr": {
										"value": 0.5
									},
									"off_trans_assist": {
										"value": 0
									},
									"off_ast_rim": {
										"value": 0.5
									},
									"off_ast_mid": {
										"value": 0
									},
									"off_ast_3p": {
										"value": 0.5
									},
									"total_off_scramble_pts": {
										"value": 0
									},
									"total_off_trans_pts": {
										"value": 5
									},
									"off_efg": {
										"value": 1.1666666666666667
									},
									"off_scramble_efg": {
										"value": 0
									},
									"off_trans_efg": {
										"value": 1.25
									},
									"off_team_poss": {
										"value": 38
									},
                  "duration_mins": {
    		             "value": 30
    		          },
									"off_assist": {
										"value": 0.16666666666666666
									},
									"off_to": {
										"value": 0.20202020202020202
									},
									"off_orb": {
										"value": 0
									},
									"off_usage": {
										"value": 0.13026315789473686
									},
									"def_team_poss": {
										"value": 42
									},
									"def_orb": {
										"value": 0.06666666666666667
									},
									"def_ftr": {
										"value": 0.04999999999999999
									},
									"def_to": {
										"value": 0.023809523809523808
									},
									"def_2prim": {
										"value": 0.058823529411764705
									}
								}
                ]
							}
						},
						"on": {
							"player": {
								"buckets": [{
									"key": "Cowan, Anthony",
                  "player_array": {
                    "hits": {
   		                "total": {
   		                   "value": 72,
   		                   "relation": "eq"
   		                },
   		                "max_score": 4.823819,
   		                "hits": [
   		                   {
   		                      "_index": "bigten_2019_lpong",
   		                      "_type": "_doc",
   		                      "_id": "GdtArXQBjSGDKv5YlXqK",
   		                      "_score": 4.823819,
   		                      "_source": {
   		                         "player":  {
 		                               "code": "AnCowan",
 		                               "id": "Cowan, Anthony"
 		                            },
 		                         }
   		                   }
   		                ]
   		             }
                  },
									"doc_count": 376,
									"total_off_fga": {
										"value": 292
									},
									"oppo_total_def_fga": {
										"value": 1344
									},
									"total_off_2pmid_made": {
										"value": 14
									},
									"total_off_trans_to": {
										"value": 16
									},
									"total_off_trans_assist": {
										"value": 33
									},
									"total_off_2pmid_ast": {
										"value": 0
									},
									"total_off_3p_attempts": {
										"value": 144
									},
									"oppo_total_def_fgm": {
										"value": 540
									},
									"total_off_scramble_assist": {
										"value": 5
									},
									"oppo_def_3p_opp": {
										"value": 33.24322200392927
									},
									"team_total_off_ftm": {
										"value": 366
									},
									"total_off_to": {
										"value": 60
									},
									"total_off_scramble_2pmid_attempts": {
										"value": 2
									},
									"total_off_foul": {
										"value": 52
									},
									"team_total_off_blk": {
										"value": 93
									},
									"oppo_total_def_drb": {
										"value": 559
									},
									"team_total_off_fta": {
										"value": 487
									},
									"total_off_2prim_attempts": {
										"value": 96
									},
									"total_off_drb": {
										"value": 80
									},
									"total_off_scramble_fgm": {
										"value": 7
									},
									"total_off_scramble_fga": {
										"value": 15
									},
									"total_off_scramble_2prim_attempts": {
										"value": 3
									},
									"off_ast_3p_source": {
										"value": {
											"DaMorsell": 8,
											"MlMitchell": 1,
											"ErAyala": 8,
											"AaWiggins": 8,
											"DoScott": 1,
											"JaSmith": 3
										}
									},
									"total_off_2p_made": {
										"value": 68
									},
									"total_off_2prim_made": {
										"value": 54
									},
									"total_off_trans_3p_ast": {
										"value": 4
									},
									"total_off_3p_ast": {
										"value": 29
									},
									"total_off_trans_fga": {
										"value": 46
									},
									"total_off_2prim_ast": {
										"value": 15
									},
									"total_off_scramble_3p_ast": {
										"value": 3
									},
									"total_off_trans_3p_attempts": {
										"value": 19
									},
									"total_off_ftm": {
										"value": 134
									},
									"off_adj_opp": {
										"value": 108.26036866359448
									},
									"total_off_blk": {
										"value": 5
									},
									"oppo_total_def_orb": {
										"value": 221
									},
									"total_off_trans_fgm": {
										"value": 21
									},
									"off_ast_rim_source": {
										"value": {
											"DaMorsell": 5,
											"MiMitchell": 1,
											"ErAyala": 3,
											"AaWiggins": 3,
											"JaSmith": 3
										}
									},
									"team_total_off_to": {
										"value": 261
									},
									"oppo_total_def_pts": {
										"value": 1466
									},
									"team_total_off_drb": {
										"value": 627
									},
									"total_off_trans_2prim_made": {
										"value": 14
									},
									"team_total_off_poss": {
										"value": 1530
									},
									"total_off_scramble_2pmid_ast": {
										"value": 0
									},
									"oppo_total_def_poss": {
										"value": 1519
									},
									"total_off_trans_2prim_ast": {
										"value": 4
									},
									"total_off_fta": {
										"value": 169
									},
									"oppo_total_def_to": {
										"value": 260
									},
									"team_total_off_fga": {
										"value": 1300
									},
									"total_off_scramble_2prim_made": {
										"value": 3
									},
									"oppo_total_def_2p_attempts": {
										"value": 835
									},
									"total_off_trans_2p_made": {
										"value": 15
									},
									"team_total_off_fgm": {
										"value": 554
									},
									"oppo_total_def_fta": {
										"value": 327
									},
									"total_off_assist": {
										"value": 126
									},
									"total_off_stl": {
										"value": 28
									},
									"off_ast_mid_source": {
										"value": {}
									},
									"total_off_ast_3p": {
										"value": 57
									},
									"total_off_scramble_ftm": {
										"value": 9
									},
									"oppo_total_def_3p_attempts": {
										"value": 509
									},
									"team_total_off_orb": {
										"value": 253
									},
									"total_off_ast_rim": {
										"value": 60
									},
									"total_off_3p_made": {
										"value": 47
									},
									"total_off_scramble_3p_attempts": {
										"value": 10
									},
									"total_off_trans_2pmid_ast": {
										"value": 0
									},
									"total_off_scramble_2pmid_made": {
										"value": 0
									},
									"total_off_scramble_3p_made": {
										"value": 4
									},
									"off_poss": {
										"value": 373.4190476190476
									},
									"total_off_scramble_fta": {
										"value": 10
									},
									"team_total_off_3p_made": {
										"value": 181
									},
									"total_off_poss": {
										"value": 0
									},
									"total_off_scramble_2prim_ast": {
										"value": 0
									},
									"total_off_trans_2p_attempts": {
										"value": 27
									},
									"total_off_2pmid_attempts": {
										"value": 52
									},
									"oppo_total_def_3p_made": {
										"value": 162
									},
									"total_off_trans_2pmid_made": {
										"value": 1
									},
									"total_off_scramble_2p_attempts": {
										"value": 5
									},
									"total_off_trans_2prim_attempts": {
										"value": 25
									},
									"total_off_scramble_2p_ast": {
										"value": 0
									},
									"off_ast_3p_target": {
										"value": {
											"DaMorsell": 7,
											"ErAyala": 22,
											"DoScott": 4,
											"AaWiggins": 13,
											"JaSmith": 11
										}
									},
									"total_off_pts": {
										"value": 0
									},
									"team_total_off_pts": {
										"value": 1655
									},
									"team_total_off_assist": {
										"value": 312
									},
									"off_ast_rim_target": {
										"value": {
											"DaMorsell": 12,
											"MlMitchell": 1,
											"ErAyala": 3,
											"DoScott": 8,
											"AaWiggins": 5,
											"JaSmith": 30,
											"JoTomaic": 1
										}
									},
									"total_off_trans_3p_made": {
										"value": 6
									},
									"total_off_scramble_to": {
										"value": 2
									},
									"def_adj_opp": {
										"value": 96.3159973666886
									},
									"total_off_orb": {
										"value": 12
									},
									"off_ast_mid_target": {
										"value": {
											"DaMorsell": 4,
											"MiMitchell": 1,
											"AaWiggins": 3,
											"JaSmith": 1
										}
									},
									"oppo_total_def_ftm": {
										"value": 224
									},
									"total_off_ast_mid": {
										"value": 9
									},
									"total_off_trans_2pmid_attempts": {
										"value": 2
									},
									"team_total_off_stl": {
										"value": 109
									},
									"total_off_2p_ast": {
										"value": 0
									},
									"total_off_2p_attempts": {
										"value": 148
									},
									"total_off_fgm": {
										"value": 115
									},
									"total_off_trans_fta": {
										"value": 68
									},
									"total_off_scramble_2p_made": {
										"value": 3
									},
									"team_total_off_foul": {
										"value": 330
									},
									"total_off_trans_ftm": {
										"value": 54
									},
									"total_off_trans_2p_ast": {
										"value": 0
									},
									"off_2p": {
										"value": 0.4594594594594595
									},
									"off_2p_ast": {
										"value": 0
									},
									"off_3p": {
										"value": 0.3263888888888889
									},
									"off_3p_ast": {
										"value": 0.6170212765957447
									},
									"off_2prim": {
										"value": 0.5625
									},
									"off_2prim_ast": {
										"value": 0.2777777777777778
									},
									"off_2pmid": {
										"value": 0.2692307692307692
									},
									"off_2pmid_ast": {
										"value": 0
									},
									"off_ft": {
										"value": 0.7928994082840237
									},
									"off_ftr": {
										"value": 0.5787671232876712
									},
									"off_2primr": {
										"value": 0.3287671232876712
									},
									"off_2pmidr": {
										"value": 0.1780821917808219
									},
									"off_3pr": {
										"value": 0.4931506849315068
									},
									"off_scramble_2p": {
										"value": 0.6
									},
									"off_scramble_2p_ast": {
										"value": 0
									},
									"off_scramble_3p": {
										"value": 0.4
									},
									"off_scramble_3p_ast": {
										"value": 0.75
									},
									"off_scramble_2prim": {
										"value": 1
									},
									"off_scramble_2prim_ast": {
										"value": 0
									},
									"off_scramble_2pmid": {
										"value": 0
									},
									"off_scramble_2pmid_ast": {
										"value": 0
									},
									"off_scramble_ft": {
										"value": 0.9
									},
									"off_scramble_ftr": {
										"value": 0.6666666666666666
									},
									"off_scramble_2primr": {
										"value": 0.2
									},
									"off_scramble_2pmidr": {
										"value": 0.13333333333333333
									},
									"off_scramble_3pr": {
										"value": 0.6666666666666666
									},
									"off_scramble_assist": {
										"value": 0.7142857142857143
									},
									"off_trans_2p": {
										"value": 0.5555555555555556
									},
									"off_trans_2p_ast": {
										"value": 0
									},
									"off_trans_3p": {
										"value": 0.3157894736842105
									},
									"off_trans_3p_ast": {
										"value": 0.6666666666666666
									},
									"off_trans_2prim": {
										"value": 0.56
									},
									"off_trans_2prim_ast": {
										"value": 0.2857142857142857
									},
									"off_trans_2pmid": {
										"value": 0.5
									},
									"off_trans_2pmid_ast": {
										"value": 0
									},
									"off_trans_ft": {
										"value": 0.7941176470588235
									},
									"off_trans_ftr": {
										"value": 1.4782608695652173
									},
									"off_trans_2primr": {
										"value": 0.5434782608695652
									},
									"off_trans_2pmidr": {
										"value": 0.043478260869565216
									},
									"off_trans_3pr": {
										"value": 0.41304347826086957
									},
									"off_trans_assist": {
										"value": 1.5714285714285714
									},
									"off_ast_rim": {
										"value": 0.47619047619047616
									},
									"off_ast_mid": {
										"value": 0.07142857142857142
									},
									"off_ast_3p": {
										"value": 0.4523809523809524
									},
									"total_off_scramble_pts": {
										"value": 27
									},
									"total_off_trans_pts": {
										"value": 102
									},
									"off_efg": {
										"value": 0.4743150684931507
									},
									"off_scramble_efg": {
										"value": 0.6
									},
									"off_trans_efg": {
										"value": 0.5217391304347826
									},
									"off_team_poss": {
										"value": 1530
									},
                  "duration_mins": {
    		             "value": 500
    		          },
									"off_assist": {
										"value": 0.2870159453302961
									},
									"off_to": {
										"value": 0.16067739549593207
									},
									"off_orb": {
										"value": 0.014778325123152709
									},
									"off_usage": {
										"value": 0.24406473700591347
									},
									"def_team_poss": {
										"value": 1519
									},
									"def_orb": {
										"value": 0.09433962264150944
									},
									"def_ftr": {
										"value": 0.023963133640552994
									},
									"def_to": {
										"value": 0.018433179723502304
									},
									"def_2prim": {
										"value": 0.005988023952095809
									}
								},
                  {
									"key": "Wiggins, Aaron",
                  "player_array": {
                    "hits": {
   		                "total": {
   		                   "value": 72,
   		                   "relation": "eq"
   		                },
   		                "max_score": 4.823819,
   		                "hits": [
   		                   {
   		                      "_index": "bigten_2019_lpong",
   		                      "_type": "_doc",
   		                      "_id": "GdtArXQBjSGDKv5YlXqK",
   		                      "_score": 4.823819,
   		                      "_source": {
   		                         "player":  {
 		                               "code": "AaWiggins",
 		                               "id": "Wiggins, Aaron"
 		                            },
 		                         }
   		                   }
   		                ]
   		             }
                  },
									"doc_count": 311,
									"total_off_fga": {
										"value": 246
									},
									"oppo_total_def_fga": {
										"value": 1039
									},
									"total_off_2pmid_made": {
										"value": 16
									},
									"total_off_trans_to": {
										"value": 5
									},
									"total_off_trans_assist": {
										"value": 9
									},
									"total_off_2pmid_ast": {
										"value": 5
									},
									"total_off_3p_attempts": {
										"value": 133
									},
									"oppo_total_def_fgm": {
										"value": 399
									},
									"total_off_scramble_assist": {
										"value": 1
									},
									"oppo_def_3p_opp": {
										"value": 33.28283582089552
									},
									"team_total_off_ftm": {
										"value": 321
									},
									"total_off_to": {
										"value": 42
									},
									"total_off_scramble_2pmid_attempts": {
										"value": 4
									},
									"total_off_foul": {
										"value": 40
									},
									"team_total_off_blk": {
										"value": 72
									},
									"oppo_total_def_drb": {
										"value": 439
									},
									"team_total_off_fta": {
										"value": 427
									},
									"total_off_2prim_attempts": {
										"value": 48
									},
									"total_off_drb": {
										"value": 101
									},
									"total_off_scramble_fgm": {
										"value": 7
									},
									"total_off_scramble_fga": {
										"value": 20
									},
									"total_off_scramble_2prim_attempts": {
										"value": 8
									},
									"off_ast_3p_source": {
										"value": {
											"DaMorsell": 5,
											"ErAyala": 14,
											"AnCowan": 13,
											"DoScott": 2,
											"JaSmith": 1
										}
									},
									"total_off_2p_made": {
										"value": 50
									},
									"total_off_2prim_made": {
										"value": 34
									},
									"total_off_trans_3p_ast": {
										"value": 8
									},
									"total_off_3p_ast": {
										"value": 35
									},
									"total_off_trans_fga": {
										"value": 56
									},
									"total_off_2prim_ast": {
										"value": 13
									},
									"total_off_scramble_3p_ast": {
										"value": 1
									},
									"total_off_trans_3p_attempts": {
										"value": 36
									},
									"total_off_ftm": {
										"value": 37
									},
									"off_adj_opp": {
										"value": 107.99691409507923
									},
									"total_off_blk": {
										"value": 8
									},
									"oppo_total_def_orb": {
										"value": 176
									},
									"total_off_trans_fgm": {
										"value": 23
									},
									"off_ast_rim_source": {
										"value": {
											"DaMorsell": 5,
											"ErAyala": 2,
											"AnCowan": 5,
											"JaSmith": 1
										}
									},
									"team_total_off_to": {
										"value": 199
									},
									"oppo_total_def_pts": {
										"value": 1098
									},
									"team_total_off_drb": {
										"value": 505
									},
									"total_off_trans_2prim_made": {
										"value": 10
									},
									"team_total_off_poss": {
										"value": 1220
									},
									"total_off_scramble_2pmid_ast": {
										"value": 0
									},
									"oppo_total_def_poss": {
										"value": 1199
									},
									"total_off_trans_2prim_ast": {
										"value": 5
									},
									"total_off_fta": {
										"value": 51
									},
									"oppo_total_def_to": {
										"value": 221
									},
									"team_total_off_fga": {
										"value": 1029
									},
									"total_off_scramble_2prim_made": {
										"value": 6
									},
									"oppo_total_def_2p_attempts": {
										"value": 637
									},
									"total_off_trans_2p_made": {
										"value": 14
									},
									"team_total_off_fgm": {
										"value": 448
									},
									"oppo_total_def_fta": {
										"value": 265
									},
									"total_off_assist": {
										"value": 33
									},
									"total_off_stl": {
										"value": 19
									},
									"off_ast_mid_source": {
										"value": {
											"MiMitchell": 1,
											"AnCowan": 3,
											"JaSmith": 1
										}
									},
									"total_off_ast_3p": {
										"value": 15
									},
									"total_off_scramble_ftm": {
										"value": 3
									},
									"oppo_total_def_3p_attempts": {
										"value": 402
									},
									"team_total_off_orb": {
										"value": 201
									},
									"total_off_ast_rim": {
										"value": 15
									},
									"total_off_3p_made": {
										"value": 39
									},
									"total_off_scramble_3p_attempts": {
										"value": 8
									},
									"total_off_trans_2pmid_ast": {
										"value": 1
									},
									"total_off_scramble_2pmid_made": {
										"value": 0
									},
									"total_off_scramble_3p_made": {
										"value": 1
									},
									"off_poss": {
										"value": 259.89285714285717
									},
									"total_off_scramble_fta": {
										"value": 5
									},
									"team_total_off_3p_made": {
										"value": 142
									},
									"total_off_poss": {
										"value": 0
									},
									"total_off_scramble_2prim_ast": {
										"value": 1
									},
									"total_off_trans_2p_attempts": {
										"value": 20
									},
									"total_off_2pmid_attempts": {
										"value": 65
									},
									"oppo_total_def_3p_made": {
										"value": 117
									},
									"total_off_trans_2pmid_made": {
										"value": 4
									},
									"total_off_scramble_2p_attempts": {
										"value": 12
									},
									"total_off_trans_2prim_attempts": {
										"value": 14
									},
									"total_off_scramble_2p_ast": {
										"value": 0
									},
									"off_ast_3p_target": {
										"value": {
											"DaMorsell": 1,
											"AnCowan": 8,
											"DoScott": 6
										}
									},
									"total_off_pts": {
										"value": 0
									},
									"team_total_off_pts": {
										"value": 1359
									},
									"team_total_off_assist": {
										"value": 231
									},
									"off_ast_rim_target": {
										"value": {
											"DaMorsell": 1,
											"MiMitchell": 1,
											"ErAyala": 1,
											"AnCowan": 3,
											"DoScott": 1,
											"JaSmith": 8
										}
									},
									"total_off_trans_3p_made": {
										"value": 9
									},
									"total_off_scramble_to": {
										"value": 6
									},
									"def_adj_opp": {
										"value": 96.3929941618015
									},
									"total_off_orb": {
										"value": 25
									},
									"off_ast_mid_target": {
										"value": {
											"DaMorsell": 1,
											"JaSmith": 2
										}
									},
									"oppo_total_def_ftm": {
										"value": 183
									},
									"total_off_ast_mid": {
										"value": 3
									},
									"total_off_trans_2pmid_attempts": {
										"value": 6
									},
									"team_total_off_stl": {
										"value": 94
									},
									"total_off_2p_ast": {
										"value": 0
									},
									"total_off_2p_attempts": {
										"value": 113
									},
									"total_off_fgm": {
										"value": 89
									},
									"total_off_trans_fta": {
										"value": 19
									},
									"total_off_scramble_2p_made": {
										"value": 6
									},
									"team_total_off_foul": {
										"value": 268
									},
									"total_off_trans_ftm": {
										"value": 17
									},
									"total_off_trans_2p_ast": {
										"value": 0
									},
									"off_2p": {
										"value": 0.4424778761061947
									},
									"off_2p_ast": {
										"value": 0
									},
									"off_3p": {
										"value": 0.2932330827067669
									},
									"off_3p_ast": {
										"value": 0.8974358974358975
									},
									"off_2prim": {
										"value": 0.7083333333333334
									},
									"off_2prim_ast": {
										"value": 0.38235294117647056
									},
									"off_2pmid": {
										"value": 0.24615384615384617
									},
									"off_2pmid_ast": {
										"value": 0.3125
									},
									"off_ft": {
										"value": 0.7254901960784313
									},
									"off_ftr": {
										"value": 0.2073170731707317
									},
									"off_2primr": {
										"value": 0.1951219512195122
									},
									"off_2pmidr": {
										"value": 0.26422764227642276
									},
									"off_3pr": {
										"value": 0.540650406504065
									},
									"off_scramble_2p": {
										"value": 0.5
									},
									"off_scramble_2p_ast": {
										"value": 0
									},
									"off_scramble_3p": {
										"value": 0.125
									},
									"off_scramble_3p_ast": {
										"value": 1
									},
									"off_scramble_2prim": {
										"value": 0.75
									},
									"off_scramble_2prim_ast": {
										"value": 0.16666666666666666
									},
									"off_scramble_2pmid": {
										"value": 0
									},
									"off_scramble_2pmid_ast": {
										"value": 0
									},
									"off_scramble_ft": {
										"value": 0.6
									},
									"off_scramble_ftr": {
										"value": 0.25
									},
									"off_scramble_2primr": {
										"value": 0.4
									},
									"off_scramble_2pmidr": {
										"value": 0.2
									},
									"off_scramble_3pr": {
										"value": 0.4
									},
									"off_scramble_assist": {
										"value": 0.14285714285714285
									},
									"off_trans_2p": {
										"value": 0.7
									},
									"off_trans_2p_ast": {
										"value": 0
									},
									"off_trans_3p": {
										"value": 0.25
									},
									"off_trans_3p_ast": {
										"value": 0.8888888888888888
									},
									"off_trans_2prim": {
										"value": 0.7142857142857143
									},
									"off_trans_2prim_ast": {
										"value": 0.5
									},
									"off_trans_2pmid": {
										"value": 0.6666666666666666
									},
									"off_trans_2pmid_ast": {
										"value": 0.25
									},
									"off_trans_ft": {
										"value": 0.8947368421052632
									},
									"off_trans_ftr": {
										"value": 0.3392857142857143
									},
									"off_trans_2primr": {
										"value": 0.25
									},
									"off_trans_2pmidr": {
										"value": 0.10714285714285714
									},
									"off_trans_3pr": {
										"value": 0.6428571428571429
									},
									"off_trans_assist": {
										"value": 0.391304347826087
									},
									"off_ast_rim": {
										"value": 0.45454545454545453
									},
									"off_ast_mid": {
										"value": 0.09090909090909091
									},
									"off_ast_3p": {
										"value": 0.45454545454545453
									},
									"total_off_scramble_pts": {
										"value": 18
									},
									"total_off_trans_pts": {
										"value": 72
									},
									"off_efg": {
										"value": 0.4410569105691057
									},
									"off_scramble_efg": {
										"value": 0.375
									},
									"off_trans_efg": {
										"value": 0.49107142857142855
									},
									"off_team_poss": {
										"value": 1220
									},
                  "duration_mins": {
    		             "value": 450
    		          },
									"off_assist": {
										"value": 0.09192200557103064
									},
									"off_to": {
										"value": 0.16160505702899544
									},
									"off_orb": {
										"value": 0.0390625
									},
									"off_usage": {
										"value": 0.21302693208430915
									},
									"def_team_poss": {
										"value": 1199
									},
									"def_orb": {
										"value": 0.14831130690161526
									},
									"def_ftr": {
										"value": 0.02335279399499583
									},
									"def_to": {
										"value": 0.0158465387823186
									},
									"def_2prim": {
										"value": 0.012558869701726845
									}
								}
                ]
							}
						}
					}
				}
			},
			"status": 200
		}]
	}


const samplePlayerStatsTemplate =
{
  // A: Top Level Scoring

   "efg": {
      "baseline: Cowan, Anthony": {
         "off_": 0.47150997150997154
      },
      "baseline: Wiggins, Aaron": {
         "off_": 0.4590443686006826
      },
      "off: Cowan, Anthony": {
         "off_": 0.4528301886792453
      },
      "off: Mona, Reese": {
         "off_": 0
      },
      "on: Wiggins, Aaron": {
         "off_": 0.4590443686006826
      },
      "on: Cowan, Anthony": {
         "off_": 0.47959183673469385
      }
   },
   "fga": {
      "baseline: Cowan, Anthony": {
         "total_off_": 351,
         "team_total_off_": 1529,
         "oppo_total_def_": 1429
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 293,
         "team_total_off_": 1253,
         "oppo_total_def_": 1429
      },
      "off: Cowan, Anthony": {
         "total_off_": 106,
         "team_total_off_": 410,
         "oppo_total_def_": 1429
      },
      "off: Mona, Reese": {
         "total_off_": 0,
         "team_total_off_": 7,
         "oppo_total_def_": 1429
      },
      "on: Wiggins, Aaron": {
         "total_off_": 293,
         "team_total_off_": 1253,
         "oppo_total_def_": 1429
      },
      "on: Cowan, Anthony": {
         "total_off_": 245,
         "team_total_off_": 1119,
         "oppo_total_def_": 1429
      }
   },
   "fgm": {
      "baseline: Cowan, Anthony": {
         "total_off_": 138,
         "team_total_off_": 634,
         "oppo_total_def_": 534
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 109,
         "team_total_off_": 534,
         "oppo_total_def_": 534
      },
      "off: Cowan, Anthony": {
         "total_off_": 40,
         "team_total_off_": 162,
         "oppo_total_def_": 534
      },
      "off: Mona, Reese": {
         "total_off_": 0,
         "team_total_off_": 1,
         "oppo_total_def_": 534
      },
      "on: Wiggins, Aaron": {
         "total_off_": 109,
         "team_total_off_": 534,
         "oppo_total_def_": 534
      },
      "on: Cowan, Anthony": {
         "total_off_": 98,
         "team_total_off_": 472,
         "oppo_total_def_": 534
      }
   },
   "fta": {
      "baseline: Cowan, Anthony": {
         "total_off_": 206,
         "team_total_off_": 566,
         "oppo_total_def_": 626
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 59,
         "team_total_off_": 508,
         "oppo_total_def_": 626
      },
      "off: Cowan, Anthony": {
         "total_off_": 43,
         "team_total_off_": 110,
         "oppo_total_def_": 626
      },
      "off: Mona, Reese": {
         "total_off_": 1,
         "team_total_off_": 1,
         "oppo_total_def_": 626
      },
      "on: Wiggins, Aaron": {
         "total_off_": 59,
         "team_total_off_": 508,
         "oppo_total_def_": 626
      },
      "on: Cowan, Anthony": {
         "total_off_": 163,
         "team_total_off_": 456,
         "oppo_total_def_": 626
      }
   },
   "ftm": {
      "baseline: Cowan, Anthony": {
         "total_off_": 166,
         "team_total_off_": 426,
         "oppo_total_def_": 426
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 43,
         "team_total_off_": 379,
         "oppo_total_def_": 426
      },
      "off: Cowan, Anthony": {
         "total_off_": 35,
         "team_total_off_": 84,
         "oppo_total_def_": 426
      },
      "off: Mona, Reese": {
         "total_off_": 0,
         "team_total_off_": 0,
         "oppo_total_def_": 426
      },
      "on: Wiggins, Aaron": {
         "total_off_": 43,
         "team_total_off_": 379,
         "oppo_total_def_": 426
      },
      "on: Cowan, Anthony": {
         "total_off_": 131,
         "team_total_off_": 342,
         "oppo_total_def_": 426
      }
   },
   "ftr": {
      "baseline: Cowan, Anthony": {
         "off_": 0.5868945868945868,
         "def_": 0.024575311438278596
      },
      "baseline: Wiggins, Aaron": {
         "off_": 0.20136518771331058,
         "def_": 0.02248803827751196
      },
      "off: Cowan, Anthony": {
         "off_": 0.4056603773584906,
         "def_": 0.021966527196652718
      },
      "off: Mona, Reese": {
         "off_": null,
         "def_": 0
      },
      "on: Wiggins, Aaron": {
         "off_": 0.20136518771331058,
         "def_": 0.02248803827751196
      },
      "on: Cowan, Anthony": {
         "off_": 0.6653061224489796,
         "def_": 0.025543478260869563
      }
   },

   // B] Advanced Shooting Stats

   "2p": {
      "baseline: Cowan, Anthony": {
         "off_": 0.46111111111111114
      },
      "baseline: Wiggins, Aaron": {
         "off_": 0.4461538461538462
      },
      "off: Cowan, Anthony": {
         "off_": 0.42105263157894735
      },
      "off: Mona, Reese": {
         "off_": 0
      },
      "on: Wiggins, Aaron": {
         "off_": 0.4461538461538462
      },
      "on: Cowan, Anthony": {
         "off_": 0.4796747967479675
      }
   },
   "2p_attempts": {
      "baseline: Cowan, Anthony": {
         "total_off_": 180,
         "oppo_total_def_": 975
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 130,
         "oppo_total_def_": 784
      },
      "off: Cowan, Anthony": {
         "total_off_": 57,
         "oppo_total_def_": 283
      },
      "off: Mona, Reese": {
         "total_off_": 0,
         "oppo_total_def_": 7
      },
      "on: Wiggins, Aaron": {
         "total_off_": 130,
         "oppo_total_def_": 784
      },
      "on: Cowan, Anthony": {
         "total_off_": 123,
         "oppo_total_def_": 692
      }
   },
   "2p_made": {
      "baseline: Cowan, Anthony": {
         "total_off_": 83
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 58
      },
      "off: Cowan, Anthony": {
         "total_off_": 24
      },
      "off: Mona, Reese": {
         "total_off_": 0
      },
      "on: Wiggins, Aaron": {
         "total_off_": 58
      },
      "on: Cowan, Anthony": {
         "total_off_": 59
      }
   },
   "2pmid": {
      "baseline: Cowan, Anthony": {
         "off_": 0.42990654205607476
      },
      "baseline: Wiggins, Aaron": {
         "off_": 0.2891566265060241
      },
      "off: Cowan, Anthony": {
         "off_": 0.4358974358974359
      },
      "off: Mona, Reese": {
         "off_": 0
      },
      "on: Wiggins, Aaron": {
         "off_": 0.2891566265060241
      },
      "on: Cowan, Anthony": {
         "off_": 0.4264705882352941
      }
   },
   "2pmid_attempts": {
      "baseline: Cowan, Anthony": {
         "total_off_": 107
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 83
      },
      "off: Cowan, Anthony": {
         "total_off_": 39
      },
      "off: Mona, Reese": {
         "total_off_": 0
      },
      "on: Wiggins, Aaron": {
         "total_off_": 83
      },
      "on: Cowan, Anthony": {
         "total_off_": 68
      }
   },
   "2pmid_made": {
      "baseline: Cowan, Anthony": {
         "total_off_": 46
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 24
      },
      "off: Cowan, Anthony": {
         "total_off_": 17
      },
      "off: Mona, Reese": {
         "total_off_": 0
      },
      "on: Wiggins, Aaron": {
         "total_off_": 24
      },
      "on: Cowan, Anthony": {
         "total_off_": 29
      }
   },
   "2pmidr": {
      "baseline: Cowan, Anthony": {
         "off_": 0.30484330484330485
      },
      "baseline: Wiggins, Aaron": {
         "off_": 0.2832764505119454
      },
      "off: Cowan, Anthony": {
         "off_": 0.36792452830188677
      },
      "off: Mona, Reese": {
         "off_": 0
      },
      "on: Wiggins, Aaron": {
         "off_": 0.2832764505119454
      },
      "on: Cowan, Anthony": {
         "off_": 0.27755102040816326
      }
   },
   "2prim": {
      "baseline: Cowan, Anthony": {
         "off_": 0.5068493150684932,
         "def_": 0.005128205128205128
      },
      "baseline: Wiggins, Aaron": {
         "off_": 0.723404255319149,
         "def_": 0.016581632653061226
      },
      "off: Cowan, Anthony": {
         "off_": 0.3888888888888889,
         "def_": 0
      },
      "off: Mona, Reese": {
         "off_": 0,
         "def_": 0
      },
      "on: Wiggins, Aaron": {
         "off_": 0.723404255319149,
         "def_": 0.016581632653061226
      },
      "on: Cowan, Anthony": {
         "off_": 0.5454545454545454,
         "def_": 0.0072254335260115606
      }
   },
   "2prim_attempts": {
      "baseline: Cowan, Anthony": {
         "total_off_": 73
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 47
      },
      "off: Cowan, Anthony": {
         "total_off_": 18
      },
      "off: Mona, Reese": {
         "total_off_": 0
      },
      "on: Wiggins, Aaron": {
         "total_off_": 47
      },
      "on: Cowan, Anthony": {
         "total_off_": 55
      }
   },
   "2prim_made": {
      "baseline: Cowan, Anthony": {
         "total_off_": 37
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 34
      },
      "off: Cowan, Anthony": {
         "total_off_": 7
      },
      "off: Mona, Reese": {
         "total_off_": 0
      },
      "on: Wiggins, Aaron": {
         "total_off_": 34
      },
      "on: Cowan, Anthony": {
         "total_off_": 30
      }
   },
   "2primr": {
      "baseline: Cowan, Anthony": {
         "off_": 0.20797720797720798
      },
      "baseline: Wiggins, Aaron": {
         "off_": 0.16040955631399317
      },
      "off: Cowan, Anthony": {
         "off_": 0.16981132075471697
      },
      "off: Mona, Reese": {
         "off_": 0
      },
      "on: Wiggins, Aaron": {
         "off_": 0.16040955631399317
      },
      "on: Cowan, Anthony": {
         "off_": 0.22448979591836735
      }
   },
   "3p": {
      "baseline: Cowan, Anthony": {
         "off_": 0.3216374269005848
      },
      "baseline: Wiggins, Aaron": {
         "off_": 0.3128834355828221
      },
      "off: Cowan, Anthony": {
         "off_": 0.32653061224489793
      },
      "off: Mona, Reese": {
         "off_": 0
      },
      "on: Wiggins, Aaron": {
         "off_": 0.3128834355828221
      },
      "on: Cowan, Anthony": {
         "off_": 0.319672131147541
      }
   },
   "3p_attempts": {
      "baseline: Cowan, Anthony": {
         "total_off_": 171,
         "oppo_total_def_": 500
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 163,
         "oppo_total_def_": 400
      },
      "off: Cowan, Anthony": {
         "total_off_": 49,
         "oppo_total_def_": 200
      },
      "off: Mona, Reese": {
         "total_off_": 0,
         "oppo_total_def_": 1
      },
      "on: Wiggins, Aaron": {
         "total_off_": 163,
         "oppo_total_def_": 100
      },
      "on: Cowan, Anthony": {
         "total_off_": 122,
         "oppo_total_def_": 300
      }
   },
   "3p_made": {
      "baseline: Cowan, Anthony": {
         "total_off_": 55,
         "team_total_off_": 210,
         "oppo_total_def_": 200
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 51,
         "team_total_off_": 174,
         "oppo_total_def_": 100
      },
      "off: Cowan, Anthony": {
         "total_off_": 16,
         "team_total_off_": 51,
         "oppo_total_def_": 20
      },
      "off: Mona, Reese": {
         "total_off_": 0,
         "team_total_off_": 0,
         "oppo_total_def_": 1
      },
      "on: Wiggins, Aaron": {
         "total_off_": 51,
         "team_total_off_": 174,
         "oppo_total_def_": 30
      },
      "on: Cowan, Anthony": {
         "total_off_": 39,
         "team_total_off_": 159,
         "oppo_total_def_": 100
      }
   },
   "3p_opp": {
      "baseline: Cowan, Anthony": {
         "oppo_def_": 30.240722891566264
      },
      "baseline: Wiggins, Aaron": {
         "oppo_def_": 31.240722891566264
      },
      "off: Cowan, Anthony": {
         "oppo_def_": 32.240722891566264
      },
      "off: Mona, Reese": {
         "oppo_def_": 33.240722891566264
      },
      "on: Wiggins, Aaron": {
         "oppo_def_": 34.240722891566264
      },
      "on: Cowan, Anthony": {
         "oppo_def_": 35.240722891566264
      }
   },
   "3pr": {
      "baseline: Cowan, Anthony": {
         "off_": 0.48717948717948717
      },
      "baseline: Wiggins, Aaron": {
         "off_": 0.5563139931740614
      },
      "off: Cowan, Anthony": {
         "off_": 0.46226415094339623
      },
      "off: Mona, Reese": {
         "off_": 0
      },
      "on: Wiggins, Aaron": {
         "off_": 0.5563139931740614
      },
      "on: Cowan, Anthony": {
         "off_": 0.49795918367346936
      }
   },

   // C] Rebounds

   "drb": {
      "baseline: Cowan, Anthony": {
         "total_off_": 94,
         "team_total_off_": 716,
         "oppo_total_def_": 665
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 112,
         "team_total_off_": 606,
         "oppo_total_def_": 534
      },
      "off: Cowan, Anthony": {
         "total_off_": 32,
         "team_total_off_": 191,
         "oppo_total_def_": 186
      },
      "off: Mona, Reese": {
         "total_off_": 0,
         "team_total_off_": 2,
         "oppo_total_def_": 6
      },
      "on: Wiggins, Aaron": {
         "total_off_": 112,
         "team_total_off_": 606,
         "oppo_total_def_": 534
      },
      "on: Cowan, Anthony": {
         "total_off_": 62,
         "team_total_off_": 525,
         "oppo_total_def_": 479
      }
   },
   "orb": {
      "baseline: Cowan, Anthony": {
         "total_off_": 17,
         "team_total_off_": 306,
         "oppo_total_def_": 266,
         "off_": 0.017507723995880537,
         "def_": 0.09572301425661914
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 35,
         "team_total_off_": 254,
         "oppo_total_def_": 214,
         "off_": 0.044416243654822336,
         "def_": 0.13658536585365855
      },
      "off: Cowan, Anthony": {
         "total_off_": 9,
         "team_total_off_": 76,
         "oppo_total_def_": 71,
         "off_": 0.03435114503816794,
         "def_": 0.12213740458015267
      },
      "off: Mona, Reese": {
         "total_off_": 1,
         "team_total_off_": 1,
         "oppo_total_def_": 3,
         "off_": 0.14285714285714285,
         "def_": 0
      },
      "on: Wiggins, Aaron": {
         "total_off_": 35,
         "team_total_off_": 254,
         "oppo_total_def_": 214,
         "off_": 0.044416243654822336,
         "def_": 0.13658536585365855
      },
      "on: Cowan, Anthony": {
         "total_off_": 8,
         "team_total_off_": 230,
         "oppo_total_def_": 195,
         "off_": 0.011283497884344146,
         "def_": 0.08611111111111111
      }
   },

   // D] Assists and TOs

   "assist": {
      "baseline: Cowan, Anthony": {
         "total_off_": 144,
         "team_total_off_": 354,
         "off_": 0.2903225806451613
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 42,
         "team_total_off_": 283,
         "off_": 0.0988235294117647
      },
      "off: Cowan, Anthony": {
         "total_off_": 46,
         "team_total_off_": 99,
         "off_": 0.3770491803278688
      },
      "off: Mona, Reese": {
         "total_off_": 0,
         "team_total_off_": 1,
         "off_": 0
      },
      "on: Wiggins, Aaron": {
         "total_off_": 42,
         "team_total_off_": 283,
         "off_": 0.0988235294117647
      },
      "on: Cowan, Anthony": {
         "total_off_": 98,
         "team_total_off_": 255,
         "off_": 0.2620320855614973
      }
   },
   "to": {
      "baseline: Cowan, Anthony": {
         "total_off_": 69,
         "team_total_off_": 298,
         "oppo_total_def_": 59,
         "off_": 0.1551836312862624,
         "def_": 0.01698754246885617
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 49,
         "team_total_off_": 243,
         "oppo_total_def_": 59,
         "off_": 0.16076743404863644,
         "def_": 0.0177717019822283
      },
      "off: Cowan, Anthony": {
         "total_off_": 14,
         "team_total_off_": 88,
         "oppo_total_def_": 59,
         "off_": 0.11387073347857662,
         "def_": 0.008368200836820083
      },
      "off: Mona, Reese": {
         "total_off_": 1,
         "team_total_off_": 3,
         "oppo_total_def_": 59,
         "off_": 0.6779661016949152,
         "def_": 0.1
      },
      "on: Wiggins, Aaron": {
         "total_off_": 49,
         "team_total_off_": 243,
         "oppo_total_def_": 59,
         "off_": 0.16076743404863644,
         "def_": 0.0177717019822283
      },
      "on: Cowan, Anthony": {
         "total_off_": 55,
         "team_total_off_": 210,
         "oppo_total_def_": 59,
         "off_": 0.17097306619100133,
         "def_": 0.020186335403726708
      }
   },

   // E] Adjusted Numbers

   "adj_opp": {
      "baseline: Cowan, Anthony": {
         "off_": 108.0781993204983,
         "def_": 96.52304643261608
      },
      "baseline: Wiggins, Aaron": {
         "off_": 107.77293233082706,
         "def_": 96.80587833219413
      },
      "off: Cowan, Anthony": {
         "off_": 108.49037656903766,
         "def_": 96.31485355648536
      },
      "off: Mona, Reese": {
         "off_": 115.3,
         "def_": 93
      },
      "on: Wiggins, Aaron": {
         "off_": 107.77293233082706,
         "def_": 96.80587833219413
      },
      "on: Cowan, Anthony": {
         "off_": 107.92523291925467,
         "def_": 96.6003105590062
      }
   },

   // F] Misc Stats

   "blk": {
      "baseline: Cowan, Anthony": {
         "total_off_": 5,
         "team_total_off_": 60
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 13,
         "team_total_off_": 60
      },
      "off: Cowan, Anthony": {
         "total_off_": 0,
         "team_total_off_": 60
      },
      "off: Mona, Reese": {
         "total_off_": 0,
         "team_total_off_": 60
      },
      "on: Wiggins, Aaron": {
         "total_off_": 13,
         "team_total_off_": 60
      },
      "on: Cowan, Anthony": {
         "total_off_": 5,
         "team_total_off_": 60
      }
   },
   "foul": {
      "baseline: Cowan, Anthony": {
         "total_off_": 62,
         "team_total_off_": 310
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 47,
         "team_total_off_": 310
      },
      "off: Cowan, Anthony": {
         "total_off_": 15,
         "team_total_off_": 310
      },
      "off: Mona, Reese": {
         "total_off_": 0,
         "team_total_off_": 310
      },
      "on: Wiggins, Aaron": {
         "total_off_": 47,
         "team_total_off_": 310
      },
      "on: Cowan, Anthony": {
         "total_off_": 47,
         "team_total_off_": 310
      }
   },
   "poss": {
      "baseline: Cowan, Anthony": {
         "total_off_": 0,
         "team_total_off_": 1778,
         "oppo_total_def_": 1766,
         "off_": 444.6345238095238
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 0,
         "team_total_off_": 1469,
         "oppo_total_def_": 1463,
         "off_": 304.78809523809525
      },
      "off: Cowan, Anthony": {
         "total_off_": 0,
         "team_total_off_": 471,
         "oppo_total_def_": 478,
         "off_": 122.94642857142857
      },
      "off: Mona, Reese": {
         "total_off_": 0,
         "team_total_off_": 9,
         "oppo_total_def_": 10,
         "off_": 1.475
      },
      "on: Wiggins, Aaron": {
         "total_off_": 0,
         "team_total_off_": 1469,
         "oppo_total_def_": 1463,
         "off_": 304.78809523809525
      },
      "on: Cowan, Anthony": {
         "total_off_": 0,
         "team_total_off_": 1307,
         "oppo_total_def_": 1288,
         "off_": 321.68809523809523
      }
   },
   "pts": {
      "baseline: Cowan, Anthony": {
         "total_off_": 0,
         "team_total_off_": 1904,
         "oppo_total_def_": 1804
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 0,
         "team_total_off_": 1621,
         "oppo_total_def_": 1804
      },
      "off: Cowan, Anthony": {
         "total_off_": 0,
         "team_total_off_": 459,
         "oppo_total_def_": 1804
      },
      "off: Mona, Reese": {
         "total_off_": 0,
         "team_total_off_": 2,
         "oppo_total_def_": 1804
      },
      "on: Wiggins, Aaron": {
         "total_off_": 0,
         "team_total_off_": 1621,
         "oppo_total_def_": 1804
      },
      "on: Cowan, Anthony": {
         "total_off_": 0,
         "team_total_off_": 1445,
         "oppo_total_def_": 1804
      }
   },
   "stl": {
      "baseline: Cowan, Anthony": {
         "total_off_": 30,
         "team_total_off_": 150
      },
      "baseline: Wiggins, Aaron": {
         "total_off_": 26,
         "team_total_off_": 150
      },
      "off: Cowan, Anthony": {
         "total_off_": 4,
         "team_total_off_": 150
      },
      "off: Mona, Reese": {
         "total_off_": 1,
         "team_total_off_": 150
      },
      "on: Wiggins, Aaron": {
         "total_off_": 26,
         "team_total_off_": 150
      },
      "on: Cowan, Anthony": {
         "total_off_": 26,
         "team_total_off_": 150
      }
   },
   "team_poss": {
      "baseline: Cowan, Anthony": {
         "off_": 1778,
         "def_": 1766
      },
      "baseline: Wiggins, Aaron": {
         "off_": 1469,
         "def_": 1463
      },
      "off: Cowan, Anthony": {
         "off_": 471,
         "def_": 478
      },
      "off: Mona, Reese": {
         "off_": 9,
         "def_": 10
      },
      "on: Wiggins, Aaron": {
         "off_": 1469,
         "def_": 1463
      },
      "on: Cowan, Anthony": {
         "off_": 1307,
         "def_": 1288
      }
   },
   "usage": {
      "baseline: Cowan, Anthony": {
         "off_": 0.25007566018533395
      },
      "baseline: Wiggins, Aaron": {
         "off_": 0.20747998314369998
      },
      "off: Cowan, Anthony": {
         "off_": 0.26103275705186535
      },
      "off: Mona, Reese": {
         "off_": 0.1638888888888889
      },
      "on: Wiggins, Aaron": {
         "off_": 0.20747998314369998
      },
      "on: Cowan, Anthony": {
         "off_": 0.24612708128392902
      }
   },
   "main": {
      "doc_count": {
         "baseline: Cowan, Anthony": 470,
         "baseline: Wiggins, Aaron": 404,
         "off: Cowan, Anthony": 129,
         "off: Mona, Reese": 3,
         "on: Wiggins, Aaron": 404,
         "on: Cowan, Anthony": 341
      }
   }
};

export const samplePlayerStatsResponseOld =
{
   "took": 97,
   "timed_out": false,
   "_shards": {
      "total": 1,
      "successful": 1,
      "skipped": 0,
      "failed": 0
   },
   "hits": {
      "total": {
         "value": 2770,
         "relation": "eq"
      },
      "max_score": null,
      "hits": []
   },
   "aggregations": {
      "tri_filter": {
         "buckets": SampleDataUtils.buildResponseFromTemplatePlayer(samplePlayerStatsTemplate)
      }
   },
   "status": 200
};
