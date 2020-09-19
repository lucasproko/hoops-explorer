import { SampleDataUtils } from "./SampleDataUtils"

// Query: Lineups: 2019/20 Maryland (M): base:'', [overrides]

// Only keep these 3 lineups:
// AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith
// AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith
// AaWiggins_AnCowan_DoScott_ErAyala_JaSmith

export const sampleLineupStatsResponse =
{
	"took": 1554,
	"responses": [{
		"took": 1553,
		"timed_out": false,
		"_shards": {
			"total": 1,
			"successful": 1,
			"skipped": 0,
			"failed": 0
		},
		"hits": {
			"total": {
				"value": 594,
				"relation": "eq"
			},
			"max_score": null,
			"hits": []
		},
		"aggregations": {
			"lineups": {
				"doc_count_error_upper_bound": 0,
				"sum_other_doc_count": 0,
				"buckets": [{
					"key": "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith",
					"doc_count": 72,
					"total_off_fga": {
						"value": 323
					},
					"total_def_scramble_3p_attempts": {
						"value": 0
					},
					"total_def_drb": {
						"value": 145
					},
					"total_off_2pmid_made": {
						"value": 14
					},
					"total_def_2p_made": {
						"value": 87
					},
					"total_off_trans_to": {
						"value": 0
					},
					"total_off_trans_assist": {
						"value": 0
					},
					"total_off_2pmid_ast": {
						"value": 0
					},
					"total_off_3p_attempts": {
						"value": 147
					},
					"total_def_2p_attempts": {
						"value": 204
					},
					"total_def_trans_2p_attempts": {
						"value": 0
					},
					"total_def_trans_2pmid_made": {
						"value": 0
					},
					"total_off_scramble_assist": {
						"value": 0
					},
					"total_def_trans_ftm": {
						"value": 0
					},
					"total_off_to": {
						"value": 49
					},
					"total_off_scramble_2pmid_attempts": {
						"value": 0
					},
					"total_off_foul": {
						"value": 82
					},
					"total_def_2p_ast": {
						"value": 0
					},
					"total_def_ast_rim": {
						"value": 0
					},
					"total_def_poss": {
						"value": 388
					},
					"off_adj_ppp": {
						"value": 123.30858896547036
					},
					"total_def_trans_3p_attempts": {
						"value": 0
					},
					"total_def_trans_2prim_ast": {
						"value": 0
					},
					"total_def_trans_fta": {
						"value": 0
					},
					"total_def_scramble_fgm": {
						"value": 0
					},
					"total_off_2prim_attempts": {
						"value": 118
					},
					"total_def_scramble_fga": {
						"value": 0
					},
					"total_off_drb": {
						"value": 174
					},
					"total_off_scramble_fgm": {
						"value": 0
					},
					"total_def_scramble_2prim_made": {
						"value": 0
					},
					"total_off_scramble_fga": {
						"value": 0
					},
					"total_def_2prim_attempts": {
						"value": 103
					},
					"total_def_fta": {
						"value": 91
					},
					"total_off_scramble_2prim_attempts": {
						"value": 0
					},
					"total_def_trans_to": {
						"value": 0
					},
					"total_off_2p_made": {
						"value": 97
					},
					"total_def_trans_assist": {
						"value": 0
					},
					"total_def_3p_ast": {
						"value": 0
					},
					"total_off_2prim_made": {
						"value": 83
					},
					"total_off_trans_3p_ast": {
						"value": 0
					},
					"total_off_3p_ast": {
						"value": 0
					},
					"total_def_scramble_ftm": {
						"value": 0
					},
					"total_off_trans_fga": {
						"value": 0
					},
					"total_off_2prim_ast": {
						"value": 0
					},
					"total_def_ast_mid": {
						"value": 0
					},
					"total_off_scramble_3p_ast": {
						"value": 0
					},
					"total_off_trans_3p_attempts": {
						"value": 0
					},
					"total_off_ftm": {
						"value": 141
					},
					"total_def_scramble_2p_made": {
						"value": 0
					},
					"total_def_trans_2pmid_ast": {
						"value": 0
					},
					"off_adj_opp": {
						"value": 108.34432989690721
					},
					"total_off_blk": {
						"value": 24
					},
					"total_def_2pmid_attempts": {
						"value": 101
					},
					"total_def_scramble_2prim_ast": {
						"value": 0
					},
					"total_off_trans_fgm": {
						"value": 0
					},
					"total_def_ftm": {
						"value": 68
					},
					"players_array": {
						"hits": {
							"total": {
								"value": 72,
								"relation": "eq"
							},
							"max_score": 4.823819,
							"hits": [{
								"_index": "bigten_2019_lping",
								"_type": "_doc",
								"_id": "uofFinEBuJ1HE7yusJhB",
								"_score": 4.823819,
								"_source": {
									"players": [{
										"code": "AaWiggins",
										"id": "Wiggins, Aaron"
									}, {
										"code": "AnCowan",
										"id": "Cowan, Anthony"
									}, {
										"code": "DaMorsell",
										"id": "Morsell, Darryl"
									}, {
										"code": "ErAyala",
										"id": "Ayala, Eric"
									}, {
										"code": "JaSmith",
										"id": "Smith, Jalen"
									}]
								}
							}]
						}
					},
					"total_off_trans_2prim_made": {
						"value": 0
					},
					"total_def_blk": {
						"value": 15
					},
					"total_off_scramble_2pmid_ast": {
						"value": 0
					},
					"total_off_trans_2prim_ast": {
						"value": 0
					},
					"total_off_fta": {
						"value": 184
					},
					"total_off_scramble_2prim_made": {
						"value": 0
					},
					"total_off_trans_2p_made": {
						"value": 0
					},
					"total_def_scramble_assist": {
						"value": 0
					},
					"total_off_assist": {
						"value": 74
					},
					"total_def_scramble_to": {
						"value": 0
					},
					"total_def_trans_2p_made": {
						"value": 0
					},
					"total_off_stl": {
						"value": 31
					},
					"total_def_trans_3p_ast": {
						"value": 0
					},
					"def_adj_ppp": {
						"value": 87.8676478552093
					},
					"total_off_ast_3p": {
						"value": 0
					},
					"total_off_scramble_ftm": {
						"value": 0
					},
					"total_def_2pmid_ast": {
						"value": 0
					},
					"total_off_ast_rim": {
						"value": 0
					},
					"total_def_assist": {
						"value": 67
					},
					"total_off_3p_made": {
						"value": 45
					},
					"total_def_scramble_2pmid_ast": {
						"value": 0
					},
					"total_off_scramble_3p_attempts": {
						"value": 0
					},
					"total_def_3p_made": {
						"value": 40
					},
					"total_def_stl": {
						"value": 25
					},
					"total_off_trans_2pmid_ast": {
						"value": 0
					},
					"total_def_scramble_fta": {
						"value": 0
					},
					"total_def_foul": {
						"value": 143
					},
					"total_off_scramble_2pmid_made": {
						"value": 0
					},
					"total_def_scramble_2pmid_made": {
						"value": 0
					},
					"total_off_scramble_3p_made": {
						"value": 0
					},
					"def_3p_opp": {
						"value": 33.58872180451128
					},
					"total_def_trans_fgm": {
						"value": 0
					},
					"total_off_scramble_fta": {
						"value": 0
					},
					"total_def_2pmid_made": {
						"value": 31
					},
					"total_off_poss": {
						"value": 401
					},
					"total_def_scramble_3p_made": {
						"value": 0
					},
					"total_off_scramble_2prim_ast": {
						"value": 0
					},
					"total_def_scramble_2p_ast": {
						"value": 0
					},
					"total_off_trans_2p_attempts": {
						"value": 0
					},
					"total_off_2pmid_attempts": {
						"value": 58
					},
					"total_def_trans_fga": {
						"value": 0
					},
					"total_def_trans_2prim_made": {
						"value": 0
					},
					"total_off_trans_2pmid_made": {
						"value": 0
					},
					"total_off_scramble_2p_attempts": {
						"value": 0
					},
					"total_off_trans_2prim_attempts": {
						"value": 0
					},
					"total_def_fgm": {
						"value": 127
					},
					"total_off_scramble_2p_ast": {
						"value": 0
					},
					"total_def_trans_3p_made": {
						"value": 0
					},
					"total_def_fga": {
						"value": 337
					},
					"total_def_2prim_ast": {
						"value": 0
					},
					"total_off_pts": {
						"value": 470
					},
					"total_def_ast_3p": {
						"value": 0
					},
					"total_def_scramble_2prim_attempts": {
						"value": 0
					},
					"total_off_trans_3p_made": {
						"value": 0
					},
					"total_def_scramble_2pmid_attempts": {
						"value": 0
					},
					"total_off_scramble_to": {
						"value": 0
					},
					"def_adj_opp": {
						"value": 97.46209476309228
					},
					"total_def_to": {
						"value": 59
					},
					"total_def_pts": {
						"value": 362
					},
					"total_off_orb": {
						"value": 58
					},
					"total_off_ast_mid": {
						"value": 0
					},
					"total_off_trans_2pmid_attempts": {
						"value": 0
					},
					"total_def_scramble_3p_ast": {
						"value": 0
					},
					"total_def_scramble_2p_attempts": {
						"value": 0
					},
					"total_def_orb": {
						"value": 51
					},
					"total_off_2p_ast": {
						"value": 0
					},
					"total_def_trans_2p_ast": {
						"value": 0
					},
					"total_off_2p_attempts": {
						"value": 176
					},
					"total_def_trans_2pmid_attempts": {
						"value": 0
					},
					"total_def_3p_attempts": {
						"value": 133
					},
					"total_off_fgm": {
						"value": 142
					},
					"total_off_trans_fta": {
						"value": 0
					},
					"total_off_scramble_2p_made": {
						"value": 0
					},
					"total_def_trans_2prim_attempts": {
						"value": 0
					},
					"total_def_2prim_made": {
						"value": 56
					},
					"total_off_trans_ftm": {
						"value": 0
					},
					"total_off_trans_2p_ast": {
						"value": 0
					},
					"off_2p": {
						"value": 0.5511363636363636
					},
					"off_2p_ast": {
						"value": 0
					},
					"off_3p": {
						"value": 0.30612244897959184
					},
					"off_3p_ast": {
						"value": 0
					},
					"off_2prim": {
						"value": 0.7033898305084746
					},
					"off_2prim_ast": {
						"value": 0
					},
					"off_2pmid": {
						"value": 0.2413793103448276
					},
					"off_2pmid_ast": {
						"value": 0
					},
					"off_ft": {
						"value": 0.7663043478260869
					},
					"off_ftr": {
						"value": 0.5696594427244582
					},
					"off_2primr": {
						"value": 0.3653250773993808
					},
					"off_2pmidr": {
						"value": 0.17956656346749225
					},
					"off_3pr": {
						"value": 0.4551083591331269
					},
					"off_assist": {
						"value": 0.5211267605633803
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
						"value": 0
					},
					"off_trans_2p_ast": {
						"value": 0
					},
					"off_trans_3p": {
						"value": 0
					},
					"off_trans_3p_ast": {
						"value": 0
					},
					"off_trans_2prim": {
						"value": 0
					},
					"off_trans_2prim_ast": {
						"value": 0
					},
					"off_trans_2pmid": {
						"value": 0
					},
					"off_trans_2pmid_ast": {
						"value": 0
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
						"value": 0
					},
					"off_trans_3pr": {
						"value": 0
					},
					"off_trans_assist": {
						"value": 0
					},
					"off_ast_rim": {
						"value": 0
					},
					"off_ast_mid": {
						"value": 0
					},
					"off_ast_3p": {
						"value": 0
					},
					"total_off_scramble_pts": {
						"value": 0
					},
					"total_off_scramble_poss": {
						"value": 0
					},
					"total_off_trans_pts": {
						"value": 0
					},
					"total_off_trans_poss": {
						"value": 0
					},
					"off_ppp": {
						"value": 117.2069825436409
					},
					"off_to": {
						"value": 0.12219451371571072
					},
					"off_scramble_ppp": {
						"value": 0
					},
					"off_scramble_to": {
						"value": 0
					},
					"off_trans_ppp": {
						"value": 0
					},
					"off_trans_to": {
						"value": 0
					},
					"off_poss": {
						"value": 401
					},
					"off_orb": {
						"value": 0.2857142857142857
					},
					"off_efg": {
						"value": 0.5092879256965944
					},
					"off_scramble_efg": {
						"value": 0
					},
					"off_trans_efg": {
						"value": 0
					},
					"def_2p": {
						"value": 0.4264705882352941
					},
					"def_2p_ast": {
						"value": 0
					},
					"def_3p": {
						"value": 0.3007518796992481
					},
					"def_3p_ast": {
						"value": 0
					},
					"def_2prim": {
						"value": 0.5436893203883495
					},
					"def_2prim_ast": {
						"value": 0
					},
					"def_2pmid": {
						"value": 0.3069306930693069
					},
					"def_2pmid_ast": {
						"value": 0
					},
					"def_ft": {
						"value": 0.7472527472527473
					},
					"def_ftr": {
						"value": 0.27002967359050445
					},
					"def_2primr": {
						"value": 0.3056379821958457
					},
					"def_2pmidr": {
						"value": 0.2997032640949555
					},
					"def_3pr": {
						"value": 0.39465875370919884
					},
					"def_assist": {
						"value": 0.5275590551181102
					},
					"def_scramble_2p": {
						"value": 0
					},
					"def_scramble_2p_ast": {
						"value": 0
					},
					"def_scramble_3p": {
						"value": 0
					},
					"def_scramble_3p_ast": {
						"value": 0
					},
					"def_scramble_2prim": {
						"value": 0
					},
					"def_scramble_2prim_ast": {
						"value": 0
					},
					"def_scramble_2pmid": {
						"value": 0
					},
					"def_scramble_2pmid_ast": {
						"value": 0
					},
					"def_scramble_ft": {
						"value": 0
					},
					"def_scramble_ftr": {
						"value": 0
					},
					"def_scramble_2primr": {
						"value": 0
					},
					"def_scramble_2pmidr": {
						"value": 0
					},
					"def_scramble_3pr": {
						"value": 0
					},
					"def_scramble_assist": {
						"value": 0
					},
					"def_trans_2p": {
						"value": 0
					},
					"def_trans_2p_ast": {
						"value": 0
					},
					"def_trans_3p": {
						"value": 0
					},
					"def_trans_3p_ast": {
						"value": 0
					},
					"def_trans_2prim": {
						"value": 0
					},
					"def_trans_2prim_ast": {
						"value": 0
					},
					"def_trans_2pmid": {
						"value": 0
					},
					"def_trans_2pmid_ast": {
						"value": 0
					},
					"def_trans_ft": {
						"value": 0
					},
					"def_trans_ftr": {
						"value": 0
					},
					"def_trans_2primr": {
						"value": 0
					},
					"def_trans_2pmidr": {
						"value": 0
					},
					"def_trans_3pr": {
						"value": 0
					},
					"def_trans_assist": {
						"value": 0
					},
					"def_ast_rim": {
						"value": 0
					},
					"def_ast_mid": {
						"value": 0
					},
					"def_ast_3p": {
						"value": 0
					},
					"total_def_scramble_pts": {
						"value": 0
					},
					"total_def_scramble_poss": {
						"value": 0
					},
					"total_def_trans_pts": {
						"value": 0
					},
					"total_def_trans_poss": {
						"value": 0
					},
					"def_ppp": {
						"value": 93.29896907216495
					},
					"def_to": {
						"value": 0.15206185567010308
					},
					"def_scramble_ppp": {
						"value": 0
					},
					"def_scramble_to": {
						"value": 0
					},
					"def_trans_ppp": {
						"value": 0
					},
					"def_trans_to": {
						"value": 0
					},
					"def_poss": {
						"value": 388
					},
					"def_orb": {
						"value": 0.22666666666666666
					},
					"def_efg": {
						"value": 0.4362017804154303
					},
					"def_scramble_efg": {
						"value": 0
					},
					"def_trans_efg": {
						"value": 0
					}
				},
        {
					"key": "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith",
					"doc_count": 50,
					"total_off_fga": {
						"value": 174
					},
					"total_def_scramble_3p_attempts": {
						"value": 0
					},
					"total_def_drb": {
						"value": 79
					},
					"total_off_2pmid_made": {
						"value": 6
					},
					"total_def_2p_made": {
						"value": 51
					},
					"total_off_trans_to": {
						"value": 0
					},
					"total_off_trans_assist": {
						"value": 0
					},
					"total_off_2pmid_ast": {
						"value": 0
					},
					"total_off_3p_attempts": {
						"value": 72
					},
					"total_def_2p_attempts": {
						"value": 120
					},
					"total_def_trans_2p_attempts": {
						"value": 0
					},
					"total_def_trans_2pmid_made": {
						"value": 0
					},
					"total_off_scramble_assist": {
						"value": 0
					},
					"total_def_trans_ftm": {
						"value": 0
					},
					"total_off_to": {
						"value": 33
					},
					"total_off_scramble_2pmid_attempts": {
						"value": 0
					},
					"total_off_foul": {
						"value": 51
					},
					"total_def_2p_ast": {
						"value": 0
					},
					"total_def_ast_rim": {
						"value": 0
					},
					"total_def_poss": {
						"value": 213
					},
					"off_adj_ppp": {
						"value": 116.18465333545907
					},
					"total_def_trans_3p_attempts": {
						"value": 0
					},
					"total_def_trans_2prim_ast": {
						"value": 0
					},
					"total_def_trans_fta": {
						"value": 0
					},
					"total_def_scramble_fgm": {
						"value": 0
					},
					"total_off_2prim_attempts": {
						"value": 66
					},
					"total_def_scramble_fga": {
						"value": 0
					},
					"total_off_drb": {
						"value": 90
					},
					"total_off_scramble_fgm": {
						"value": 0
					},
					"total_def_scramble_2prim_made": {
						"value": 0
					},
					"total_off_scramble_fga": {
						"value": 0
					},
					"total_def_2prim_attempts": {
						"value": 56
					},
					"total_def_fta": {
						"value": 41
					},
					"total_off_scramble_2prim_attempts": {
						"value": 0
					},
					"total_def_trans_to": {
						"value": 0
					},
					"total_off_2p_made": {
						"value": 49
					},
					"total_def_trans_assist": {
						"value": 0
					},
					"total_def_3p_ast": {
						"value": 0
					},
					"total_off_2prim_made": {
						"value": 43
					},
					"total_off_trans_3p_ast": {
						"value": 0
					},
					"total_off_3p_ast": {
						"value": 0
					},
					"total_def_scramble_ftm": {
						"value": 0
					},
					"total_off_trans_fga": {
						"value": 0
					},
					"total_off_2prim_ast": {
						"value": 0
					},
					"total_def_ast_mid": {
						"value": 0
					},
					"total_off_scramble_3p_ast": {
						"value": 0
					},
					"total_off_trans_3p_attempts": {
						"value": 0
					},
					"total_off_ftm": {
						"value": 62
					},
					"total_def_scramble_2p_made": {
						"value": 0
					},
					"total_def_trans_2pmid_ast": {
						"value": 0
					},
					"off_adj_opp": {
						"value": 109.45211267605633
					},
					"total_off_blk": {
						"value": 13
					},
					"total_def_2pmid_attempts": {
						"value": 64
					},
					"total_def_scramble_2prim_ast": {
						"value": 0
					},
					"total_off_trans_fgm": {
						"value": 0
					},
					"total_def_ftm": {
						"value": 26
					},
					"players_array": {
						"hits": {
							"total": {
								"value": 50,
								"relation": "eq"
							},
							"max_score": 4.823819,
							"hits": [{
								"_index": "bigten_2019_lping",
								"_type": "_doc",
								"_id": "JYfFinEBuJ1HE7yutpmt",
								"_score": 4.823819,
								"_source": {
									"players": [{
										"code": "AaWiggins",
										"id": "Wiggins, Aaron"
									}, {
										"code": "AnCowan",
										"id": "Cowan, Anthony"
									}, {
										"code": "DaMorsell",
										"id": "Morsell, Darryl"
									}, {
										"code": "DoScott",
										"id": "Scott, Donta"
									}, {
										"code": "JaSmith",
										"id": "Smith, Jalen"
									}]
								}
							}]
						}
					},
					"total_off_trans_2prim_made": {
						"value": 0
					},
					"total_def_blk": {
						"value": 6
					},
					"total_off_scramble_2pmid_ast": {
						"value": 0
					},
					"total_off_trans_2prim_ast": {
						"value": 0
					},
					"total_off_fta": {
						"value": 87
					},
					"total_off_scramble_2prim_made": {
						"value": 0
					},
					"total_off_trans_2p_made": {
						"value": 0
					},
					"total_def_scramble_assist": {
						"value": 0
					},
					"total_off_assist": {
						"value": 39
					},
					"total_def_scramble_to": {
						"value": 0
					},
					"total_def_trans_2p_made": {
						"value": 0
					},
					"total_off_stl": {
						"value": 18
					},
					"total_def_trans_3p_ast": {
						"value": 0
					},
					"def_adj_ppp": {
						"value": 79.356108708242
					},
					"total_off_ast_3p": {
						"value": 0
					},
					"total_off_scramble_ftm": {
						"value": 0
					},
					"total_def_2pmid_ast": {
						"value": 0
					},
					"total_off_ast_rim": {
						"value": 0
					},
					"total_def_assist": {
						"value": 34
					},
					"total_off_3p_made": {
						"value": 22
					},
					"total_def_scramble_2pmid_ast": {
						"value": 0
					},
					"total_off_scramble_3p_attempts": {
						"value": 0
					},
					"total_def_3p_made": {
						"value": 17
					},
					"total_def_stl": {
						"value": 17
					},
					"total_off_trans_2pmid_ast": {
						"value": 0
					},
					"total_def_scramble_fta": {
						"value": 0
					},
					"total_def_foul": {
						"value": 67
					},
					"total_off_scramble_2pmid_made": {
						"value": 0
					},
					"total_def_scramble_2pmid_made": {
						"value": 0
					},
					"total_off_scramble_3p_made": {
						"value": 0
					},
					"def_3p_opp": {
						"value": 33.36290322580645
					},
					"total_def_trans_fgm": {
						"value": 0
					},
					"total_off_scramble_fta": {
						"value": 0
					},
					"total_def_2pmid_made": {
						"value": 20
					},
					"total_off_poss": {
						"value": 211
					},
					"total_def_scramble_3p_made": {
						"value": 0
					},
					"total_off_scramble_2prim_ast": {
						"value": 0
					},
					"total_def_scramble_2p_ast": {
						"value": 0
					},
					"total_off_trans_2p_attempts": {
						"value": 0
					},
					"total_off_2pmid_attempts": {
						"value": 36
					},
					"total_def_trans_fga": {
						"value": 0
					},
					"total_def_trans_2prim_made": {
						"value": 0
					},
					"total_off_trans_2pmid_made": {
						"value": 0
					},
					"total_off_scramble_2p_attempts": {
						"value": 0
					},
					"total_off_trans_2prim_attempts": {
						"value": 0
					},
					"total_def_fgm": {
						"value": 68
					},
					"total_off_scramble_2p_ast": {
						"value": 0
					},
					"total_def_trans_3p_made": {
						"value": 0
					},
					"total_def_fga": {
						"value": 182
					},
					"total_def_2prim_ast": {
						"value": 0
					},
					"total_off_pts": {
						"value": 226
					},
					"total_def_ast_3p": {
						"value": 0
					},
					"total_def_scramble_2prim_attempts": {
						"value": 0
					},
					"total_off_trans_3p_made": {
						"value": 0
					},
					"total_def_scramble_2pmid_attempts": {
						"value": 0
					},
					"total_off_scramble_to": {
						"value": 0
					},
					"def_adj_opp": {
						"value": 94.87867298578198
					},
					"total_def_to": {
						"value": 47
					},
					"total_def_pts": {
						"value": 179
					},
					"total_off_orb": {
						"value": 37
					},
					"total_off_ast_mid": {
						"value": 0
					},
					"total_off_trans_2pmid_attempts": {
						"value": 0
					},
					"total_def_scramble_3p_ast": {
						"value": 0
					},
					"total_def_scramble_2p_attempts": {
						"value": 0
					},
					"total_def_orb": {
						"value": 33
					},
					"total_off_2p_ast": {
						"value": 0
					},
					"total_def_trans_2p_ast": {
						"value": 0
					},
					"total_off_2p_attempts": {
						"value": 102
					},
					"total_def_trans_2pmid_attempts": {
						"value": 0
					},
					"total_def_3p_attempts": {
						"value": 62
					},
					"total_off_fgm": {
						"value": 71
					},
					"total_off_trans_fta": {
						"value": 0
					},
					"total_off_scramble_2p_made": {
						"value": 0
					},
					"total_def_trans_2prim_attempts": {
						"value": 0
					},
					"total_def_2prim_made": {
						"value": 31
					},
					"total_off_trans_ftm": {
						"value": 0
					},
					"total_off_trans_2p_ast": {
						"value": 0
					},
					"off_2p": {
						"value": 0.4803921568627451
					},
					"off_2p_ast": {
						"value": 0
					},
					"off_3p": {
						"value": 0.3055555555555556
					},
					"off_3p_ast": {
						"value": 0
					},
					"off_2prim": {
						"value": 0.6515151515151515
					},
					"off_2prim_ast": {
						"value": 0
					},
					"off_2pmid": {
						"value": 0.16666666666666666
					},
					"off_2pmid_ast": {
						"value": 0
					},
					"off_ft": {
						"value": 0.7126436781609196
					},
					"off_ftr": {
						"value": 0.5
					},
					"off_2primr": {
						"value": 0.3793103448275862
					},
					"off_2pmidr": {
						"value": 0.20689655172413793
					},
					"off_3pr": {
						"value": 0.41379310344827586
					},
					"off_assist": {
						"value": 0.5492957746478874
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
						"value": 0
					},
					"off_trans_2p_ast": {
						"value": 0
					},
					"off_trans_3p": {
						"value": 0
					},
					"off_trans_3p_ast": {
						"value": 0
					},
					"off_trans_2prim": {
						"value": 0
					},
					"off_trans_2prim_ast": {
						"value": 0
					},
					"off_trans_2pmid": {
						"value": 0
					},
					"off_trans_2pmid_ast": {
						"value": 0
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
						"value": 0
					},
					"off_trans_3pr": {
						"value": 0
					},
					"off_trans_assist": {
						"value": 0
					},
					"off_ast_rim": {
						"value": 0
					},
					"off_ast_mid": {
						"value": 0
					},
					"off_ast_3p": {
						"value": 0
					},
					"total_off_scramble_pts": {
						"value": 0
					},
					"total_off_scramble_poss": {
						"value": 0
					},
					"total_off_trans_pts": {
						"value": 0
					},
					"total_off_trans_poss": {
						"value": 0
					},
					"off_ppp": {
						"value": 107.1090047393365
					},
					"off_to": {
						"value": 0.15639810426540285
					},
					"off_scramble_ppp": {
						"value": 0
					},
					"off_scramble_to": {
						"value": 0
					},
					"off_trans_ppp": {
						"value": 0
					},
					"off_trans_to": {
						"value": 0
					},
					"off_poss": {
						"value": 211
					},
					"off_orb": {
						"value": 0.31896551724137934
					},
					"off_efg": {
						"value": 0.47126436781609193
					},
					"off_scramble_efg": {
						"value": 0
					},
					"off_trans_efg": {
						"value": 0
					},
					"def_2p": {
						"value": 0.425
					},
					"def_2p_ast": {
						"value": 0
					},
					"def_3p": {
						"value": 0.27419354838709675
					},
					"def_3p_ast": {
						"value": 0
					},
					"def_2prim": {
						"value": 0.5535714285714286
					},
					"def_2prim_ast": {
						"value": 0
					},
					"def_2pmid": {
						"value": 0.3125
					},
					"def_2pmid_ast": {
						"value": 0
					},
					"def_ft": {
						"value": 0.6341463414634146
					},
					"def_ftr": {
						"value": 0.22527472527472528
					},
					"def_2primr": {
						"value": 0.3076923076923077
					},
					"def_2pmidr": {
						"value": 0.3516483516483517
					},
					"def_3pr": {
						"value": 0.34065934065934067
					},
					"def_assist": {
						"value": 0.5
					},
					"def_scramble_2p": {
						"value": 0
					},
					"def_scramble_2p_ast": {
						"value": 0
					},
					"def_scramble_3p": {
						"value": 0
					},
					"def_scramble_3p_ast": {
						"value": 0
					},
					"def_scramble_2prim": {
						"value": 0
					},
					"def_scramble_2prim_ast": {
						"value": 0
					},
					"def_scramble_2pmid": {
						"value": 0
					},
					"def_scramble_2pmid_ast": {
						"value": 0
					},
					"def_scramble_ft": {
						"value": 0
					},
					"def_scramble_ftr": {
						"value": 0
					},
					"def_scramble_2primr": {
						"value": 0
					},
					"def_scramble_2pmidr": {
						"value": 0
					},
					"def_scramble_3pr": {
						"value": 0
					},
					"def_scramble_assist": {
						"value": 0
					},
					"def_trans_2p": {
						"value": 0
					},
					"def_trans_2p_ast": {
						"value": 0
					},
					"def_trans_3p": {
						"value": 0
					},
					"def_trans_3p_ast": {
						"value": 0
					},
					"def_trans_2prim": {
						"value": 0
					},
					"def_trans_2prim_ast": {
						"value": 0
					},
					"def_trans_2pmid": {
						"value": 0
					},
					"def_trans_2pmid_ast": {
						"value": 0
					},
					"def_trans_ft": {
						"value": 0
					},
					"def_trans_ftr": {
						"value": 0
					},
					"def_trans_2primr": {
						"value": 0
					},
					"def_trans_2pmidr": {
						"value": 0
					},
					"def_trans_3pr": {
						"value": 0
					},
					"def_trans_assist": {
						"value": 0
					},
					"def_ast_rim": {
						"value": 0
					},
					"def_ast_mid": {
						"value": 0
					},
					"def_ast_3p": {
						"value": 0
					},
					"total_def_scramble_pts": {
						"value": 0
					},
					"total_def_scramble_poss": {
						"value": 0
					},
					"total_def_trans_pts": {
						"value": 0
					},
					"total_def_trans_poss": {
						"value": 0
					},
					"def_ppp": {
						"value": 84.03755868544602
					},
					"def_to": {
						"value": 0.22065727699530516
					},
					"def_scramble_ppp": {
						"value": 0
					},
					"def_scramble_to": {
						"value": 0
					},
					"def_trans_ppp": {
						"value": 0
					},
					"def_trans_to": {
						"value": 0
					},
					"def_poss": {
						"value": 213
					},
					"def_orb": {
						"value": 0.2682926829268293
					},
					"def_efg": {
						"value": 0.42032967032967034
					},
					"def_scramble_efg": {
						"value": 0
					},
					"def_trans_efg": {
						"value": 0
					}
				},
        {
					"key": "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith",
					"doc_count": 52,
					"total_off_fga": {
						"value": 182
					},
					"total_def_scramble_3p_attempts": {
						"value": 0
					},
					"total_def_drb": {
						"value": 74
					},
					"total_off_2pmid_made": {
						"value": 11
					},
					"total_def_2p_made": {
						"value": 41
					},
					"total_off_trans_to": {
						"value": 0
					},
					"total_off_trans_assist": {
						"value": 0
					},
					"total_off_2pmid_ast": {
						"value": 0
					},
					"total_off_3p_attempts": {
						"value": 83
					},
					"total_def_2p_attempts": {
						"value": 106
					},
					"total_def_trans_2p_attempts": {
						"value": 0
					},
					"total_def_trans_2pmid_made": {
						"value": 0
					},
					"total_off_scramble_assist": {
						"value": 0
					},
					"total_def_trans_ftm": {
						"value": 0
					},
					"total_off_to": {
						"value": 34
					},
					"total_off_scramble_2pmid_attempts": {
						"value": 0
					},
					"total_off_foul": {
						"value": 48
					},
					"total_def_2p_ast": {
						"value": 0
					},
					"total_def_ast_rim": {
						"value": 0
					},
					"total_def_poss": {
						"value": 193
					},
					"off_adj_ppp": {
						"value": 120.3613605770025
					},
					"total_def_trans_3p_attempts": {
						"value": 0
					},
					"total_def_trans_2prim_ast": {
						"value": 0
					},
					"total_def_trans_fta": {
						"value": 0
					},
					"total_def_scramble_fgm": {
						"value": 0
					},
					"total_off_2prim_attempts": {
						"value": 65
					},
					"total_def_scramble_fga": {
						"value": 0
					},
					"total_off_drb": {
						"value": 87
					},
					"total_off_scramble_fgm": {
						"value": 0
					},
					"total_def_scramble_2prim_made": {
						"value": 0
					},
					"total_off_scramble_fga": {
						"value": 0
					},
					"total_def_2prim_attempts": {
						"value": 62
					},
					"total_def_fta": {
						"value": 54
					},
					"total_off_scramble_2prim_attempts": {
						"value": 0
					},
					"total_def_trans_to": {
						"value": 0
					},
					"total_off_2p_made": {
						"value": 53
					},
					"total_def_trans_assist": {
						"value": 0
					},
					"total_def_3p_ast": {
						"value": 0
					},
					"total_off_2prim_made": {
						"value": 42
					},
					"total_off_trans_3p_ast": {
						"value": 0
					},
					"total_off_3p_ast": {
						"value": 0
					},
					"total_def_scramble_ftm": {
						"value": 0
					},
					"total_off_trans_fga": {
						"value": 0
					},
					"total_off_2prim_ast": {
						"value": 0
					},
					"total_def_ast_mid": {
						"value": 0
					},
					"total_off_scramble_3p_ast": {
						"value": 0
					},
					"total_off_trans_3p_attempts": {
						"value": 0
					},
					"total_off_ftm": {
						"value": 31
					},
					"total_def_scramble_2p_made": {
						"value": 0
					},
					"total_def_trans_2pmid_ast": {
						"value": 0
					},
					"off_adj_opp": {
						"value": 108.46632124352331
					},
					"total_off_blk": {
						"value": 17
					},
					"total_def_2pmid_attempts": {
						"value": 44
					},
					"total_def_scramble_2prim_ast": {
						"value": 0
					},
					"total_off_trans_fgm": {
						"value": 0
					},
					"total_def_ftm": {
						"value": 32
					},
					"players_array": {
						"hits": {
							"total": {
								"value": 52,
								"relation": "eq"
							},
							"max_score": 4.823819,
							"hits": [{
								"_index": "bigten_2019_lping",
								"_type": "_doc",
								"_id": "KbjFinEB8OZ7gWZVt0-S",
								"_score": 4.823819,
								"_source": {
									"players": [{
										"code": "AaWiggins",
										"id": "Wiggins, Aaron"
									}, {
										"code": "AnCowan",
										"id": "Cowan, Anthony"
									}, {
										"code": "DoScott",
										"id": "Scott, Donta"
									}, {
										"code": "ErAyala",
										"id": "Ayala, Eric"
									}, {
										"code": "JaSmith",
										"id": "Smith, Jalen"
									}]
								}
							}]
						}
					},
					"total_off_trans_2prim_made": {
						"value": 0
					},
					"total_def_blk": {
						"value": 11
					},
					"total_off_scramble_2pmid_ast": {
						"value": 0
					},
					"total_off_trans_2prim_ast": {
						"value": 0
					},
					"total_off_fta": {
						"value": 41
					},
					"total_off_scramble_2prim_made": {
						"value": 0
					},
					"total_off_trans_2p_made": {
						"value": 0
					},
					"total_def_scramble_assist": {
						"value": 0
					},
					"total_off_assist": {
						"value": 43
					},
					"total_def_scramble_to": {
						"value": 0
					},
					"total_def_trans_2p_made": {
						"value": 0
					},
					"total_off_stl": {
						"value": 11
					},
					"total_def_trans_3p_ast": {
						"value": 0
					},
					"def_adj_ppp": {
						"value": 82.0894333612718
					},
					"total_off_ast_3p": {
						"value": 0
					},
					"total_off_scramble_ftm": {
						"value": 0
					},
					"total_def_2pmid_ast": {
						"value": 0
					},
					"total_off_ast_rim": {
						"value": 0
					},
					"total_def_assist": {
						"value": 35
					},
					"total_off_3p_made": {
						"value": 28
					},
					"total_def_scramble_2pmid_ast": {
						"value": 0
					},
					"total_off_scramble_3p_attempts": {
						"value": 0
					},
					"total_def_3p_made": {
						"value": 18
					},
					"total_def_stl": {
						"value": 17
					},
					"total_off_trans_2pmid_ast": {
						"value": 0
					},
					"total_def_scramble_fta": {
						"value": 0
					},
					"total_def_foul": {
						"value": 48
					},
					"total_off_scramble_2pmid_made": {
						"value": 0
					},
					"total_def_scramble_2pmid_made": {
						"value": 0
					},
					"total_off_scramble_3p_made": {
						"value": 0
					},
					"def_3p_opp": {
						"value": 33.34861111111111
					},
					"total_def_trans_fgm": {
						"value": 0
					},
					"total_off_scramble_fta": {
						"value": 0
					},
					"total_def_2pmid_made": {
						"value": 9
					},
					"total_off_poss": {
						"value": 197
					},
					"total_def_scramble_3p_made": {
						"value": 0
					},
					"total_off_scramble_2prim_ast": {
						"value": 0
					},
					"total_def_scramble_2p_ast": {
						"value": 0
					},
					"total_off_trans_2p_attempts": {
						"value": 0
					},
					"total_off_2pmid_attempts": {
						"value": 34
					},
					"total_def_trans_fga": {
						"value": 0
					},
					"total_def_trans_2prim_made": {
						"value": 0
					},
					"total_off_trans_2pmid_made": {
						"value": 0
					},
					"total_off_scramble_2p_attempts": {
						"value": 0
					},
					"total_off_trans_2prim_attempts": {
						"value": 0
					},
					"total_def_fgm": {
						"value": 59
					},
					"total_off_scramble_2p_ast": {
						"value": 0
					},
					"total_def_trans_3p_made": {
						"value": 0
					},
					"total_def_fga": {
						"value": 178
					},
					"total_def_2prim_ast": {
						"value": 0
					},
					"total_off_pts": {
						"value": 221
					},
					"total_def_ast_3p": {
						"value": 0
					},
					"total_def_scramble_2prim_attempts": {
						"value": 0
					},
					"total_off_trans_3p_made": {
						"value": 0
					},
					"total_def_scramble_2pmid_attempts": {
						"value": 0
					},
					"total_off_scramble_to": {
						"value": 0
					},
					"def_adj_opp": {
						"value": 95.28071065989847
					},
					"total_def_to": {
						"value": 33
					},
					"total_def_pts": {
						"value": 168
					},
					"total_off_orb": {
						"value": 34
					},
					"total_off_ast_mid": {
						"value": 0
					},
					"total_off_trans_2pmid_attempts": {
						"value": 0
					},
					"total_def_scramble_3p_ast": {
						"value": 0
					},
					"total_def_scramble_2p_attempts": {
						"value": 0
					},
					"total_def_orb": {
						"value": 41
					},
					"total_off_2p_ast": {
						"value": 0
					},
					"total_def_trans_2p_ast": {
						"value": 0
					},
					"total_off_2p_attempts": {
						"value": 99
					},
					"total_def_trans_2pmid_attempts": {
						"value": 0
					},
					"total_def_3p_attempts": {
						"value": 72
					},
					"total_off_fgm": {
						"value": 81
					},
					"total_off_trans_fta": {
						"value": 0
					},
					"total_off_scramble_2p_made": {
						"value": 0
					},
					"total_def_trans_2prim_attempts": {
						"value": 0
					},
					"total_def_2prim_made": {
						"value": 32
					},
					"total_off_trans_ftm": {
						"value": 0
					},
					"total_off_trans_2p_ast": {
						"value": 0
					},
					"off_2p": {
						"value": 0.5353535353535354
					},
					"off_2p_ast": {
						"value": 0
					},
					"off_3p": {
						"value": 0.3373493975903614
					},
					"off_3p_ast": {
						"value": 0
					},
					"off_2prim": {
						"value": 0.6461538461538462
					},
					"off_2prim_ast": {
						"value": 0
					},
					"off_2pmid": {
						"value": 0.3235294117647059
					},
					"off_2pmid_ast": {
						"value": 0
					},
					"off_ft": {
						"value": 0.7560975609756098
					},
					"off_ftr": {
						"value": 0.22527472527472528
					},
					"off_2primr": {
						"value": 0.35714285714285715
					},
					"off_2pmidr": {
						"value": 0.18681318681318682
					},
					"off_3pr": {
						"value": 0.45604395604395603
					},
					"off_assist": {
						"value": 0.5308641975308642
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
						"value": 0
					},
					"off_trans_2p_ast": {
						"value": 0
					},
					"off_trans_3p": {
						"value": 0
					},
					"off_trans_3p_ast": {
						"value": 0
					},
					"off_trans_2prim": {
						"value": 0
					},
					"off_trans_2prim_ast": {
						"value": 0
					},
					"off_trans_2pmid": {
						"value": 0
					},
					"off_trans_2pmid_ast": {
						"value": 0
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
						"value": 0
					},
					"off_trans_3pr": {
						"value": 0
					},
					"off_trans_assist": {
						"value": 0
					},
					"off_ast_rim": {
						"value": 0
					},
					"off_ast_mid": {
						"value": 0
					},
					"off_ast_3p": {
						"value": 0
					},
					"total_off_scramble_pts": {
						"value": 0
					},
					"total_off_scramble_poss": {
						"value": 0
					},
					"total_off_trans_pts": {
						"value": 0
					},
					"total_off_trans_poss": {
						"value": 0
					},
					"off_ppp": {
						"value": 112.18274111675127
					},
					"off_to": {
						"value": 0.17258883248730963
					},
					"off_scramble_ppp": {
						"value": 0
					},
					"off_scramble_to": {
						"value": 0
					},
					"off_trans_ppp": {
						"value": 0
					},
					"off_trans_to": {
						"value": 0
					},
					"off_poss": {
						"value": 197
					},
					"off_orb": {
						"value": 0.3148148148148148
					},
					"off_efg": {
						"value": 0.521978021978022
					},
					"off_scramble_efg": {
						"value": 0
					},
					"off_trans_efg": {
						"value": 0
					},
					"def_2p": {
						"value": 0.3867924528301887
					},
					"def_2p_ast": {
						"value": 0
					},
					"def_3p": {
						"value": 0.25
					},
					"def_3p_ast": {
						"value": 0
					},
					"def_2prim": {
						"value": 0.5161290322580645
					},
					"def_2prim_ast": {
						"value": 0
					},
					"def_2pmid": {
						"value": 0.20454545454545456
					},
					"def_2pmid_ast": {
						"value": 0
					},
					"def_ft": {
						"value": 0.5925925925925926
					},
					"def_ftr": {
						"value": 0.30337078651685395
					},
					"def_2primr": {
						"value": 0.34831460674157305
					},
					"def_2pmidr": {
						"value": 0.24719101123595505
					},
					"def_3pr": {
						"value": 0.4044943820224719
					},
					"def_assist": {
						"value": 0.5932203389830508
					},
					"def_scramble_2p": {
						"value": 0
					},
					"def_scramble_2p_ast": {
						"value": 0
					},
					"def_scramble_3p": {
						"value": 0
					},
					"def_scramble_3p_ast": {
						"value": 0
					},
					"def_scramble_2prim": {
						"value": 0
					},
					"def_scramble_2prim_ast": {
						"value": 0
					},
					"def_scramble_2pmid": {
						"value": 0
					},
					"def_scramble_2pmid_ast": {
						"value": 0
					},
					"def_scramble_ft": {
						"value": 0
					},
					"def_scramble_ftr": {
						"value": 0
					},
					"def_scramble_2primr": {
						"value": 0
					},
					"def_scramble_2pmidr": {
						"value": 0
					},
					"def_scramble_3pr": {
						"value": 0
					},
					"def_scramble_assist": {
						"value": 0
					},
					"def_trans_2p": {
						"value": 0
					},
					"def_trans_2p_ast": {
						"value": 0
					},
					"def_trans_3p": {
						"value": 0
					},
					"def_trans_3p_ast": {
						"value": 0
					},
					"def_trans_2prim": {
						"value": 0
					},
					"def_trans_2prim_ast": {
						"value": 0
					},
					"def_trans_2pmid": {
						"value": 0
					},
					"def_trans_2pmid_ast": {
						"value": 0
					},
					"def_trans_ft": {
						"value": 0
					},
					"def_trans_ftr": {
						"value": 0
					},
					"def_trans_2primr": {
						"value": 0
					},
					"def_trans_2pmidr": {
						"value": 0
					},
					"def_trans_3pr": {
						"value": 0
					},
					"def_trans_assist": {
						"value": 0
					},
					"def_ast_rim": {
						"value": 0
					},
					"def_ast_mid": {
						"value": 0
					},
					"def_ast_3p": {
						"value": 0
					},
					"total_def_scramble_pts": {
						"value": 0
					},
					"total_def_scramble_poss": {
						"value": 0
					},
					"total_def_trans_pts": {
						"value": 0
					},
					"total_def_trans_poss": {
						"value": 0
					},
					"def_ppp": {
						"value": 87.04663212435233
					},
					"def_to": {
						"value": 0.17098445595854922
					},
					"def_scramble_ppp": {
						"value": 0
					},
					"def_scramble_to": {
						"value": 0
					},
					"def_trans_ppp": {
						"value": 0
					},
					"def_trans_to": {
						"value": 0
					},
					"def_poss": {
						"value": 193
					},
					"def_orb": {
						"value": 0.3203125
					},
					"def_efg": {
						"value": 0.38202247191011235
					},
					"def_scramble_efg": {
						"value": 0
					},
					"def_trans_efg": {
						"value": 0
					}
				},
        ]
			}
		},
		"status": 200
	}]
};
