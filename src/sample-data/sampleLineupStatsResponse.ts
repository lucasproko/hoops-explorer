import { SampleDataUtils } from "./SampleDataUtils"

// Query: Lineups: 2019/20 Maryland (M): base:'', [overrides]

// Only keep these 3 lineups:
// (see src/sample-data/__tests__/SampleDataUtils.test.ts to see a util to do this)
// AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith
// AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith
// AaWiggins_AnCowan_DoScott_ErAyala_JaSmith

export const sampleLineupStatsResponse =
{
	"took": 862,
	"responses": [{
		"took": 862,
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
				"buckets":
				[
		       {
		          "key": "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith",
		          "off_efg": {
		             "value": 0.5092879256965944
		          },
		          "def_efg": {
		             "value": 0.4362017804154303
		          },
		          "total_off_fga": {
		             "value": 323
		          },
		          "total_def_fga": {
		             "value": 337
		          },
		          "total_off_fgm": {
		             "value": 142
		          },
		          "total_def_fgm": {
		             "value": 127
		          },
		          "off_ft": {
		             "value": 0.7663043478260869
		          },
		          "def_ft": {
		             "value": 0.7472527472527473
		          },
		          "total_off_fta": {
		             "value": 184
		          },
		          "total_def_fta": {
		             "value": 91
		          },
		          "total_off_ftm": {
		             "value": 141
		          },
		          "total_def_ftm": {
		             "value": 68
		          },
		          "off_ftr": {
		             "value": 0.5696594427244582
		          },
		          "def_ftr": {
		             "value": 0.27002967359050445
		          },
		          "off_2p": {
		             "value": 0.5511363636363636
		          },
		          "def_2p": {
		             "value": 0.4264705882352941
		          },
		          "total_off_2p_attempts": {
		             "value": 176
		          },
		          "total_def_2p_attempts": {
		             "value": 204
		          },
		          "total_off_2p_made": {
		             "value": 97
		          },
		          "total_def_2p_made": {
		             "value": 87
		          },
		          "off_2pmid": {
		             "value": 0.2413793103448276
		          },
		          "def_2pmid": {
		             "value": 0.3069306930693069
		          },
		          "total_off_2pmid_attempts": {
		             "value": 58
		          },
		          "total_def_2pmid_attempts": {
		             "value": 101
		          },
		          "total_off_2pmid_made": {
		             "value": 14
		          },
		          "total_def_2pmid_made": {
		             "value": 31
		          },
		          "off_2pmidr": {
		             "value": 0.17956656346749225
		          },
		          "def_2pmidr": {
		             "value": 0.2997032640949555
		          },
		          "off_2prim": {
		             "value": 0.7033898305084746
		          },
		          "def_2prim": {
		             "value": 0.5436893203883495
		          },
		          "total_off_2prim_attempts": {
		             "value": 118
		          },
		          "total_def_2prim_attempts": {
		             "value": 103
		          },
		          "total_off_2prim_made": {
		             "value": 83
		          },
		          "total_def_2prim_made": {
		             "value": 56
		          },
		          "off_2primr": {
		             "value": 0.3653250773993808
		          },
		          "def_2primr": {
		             "value": 0.3056379821958457
		          },
		          "off_3p": {
		             "value": 0.30612244897959184
		          },
		          "def_3p": {
		             "value": 0.3007518796992481
		          },
		          "total_off_3p_attempts": {
		             "value": 147
		          },
		          "total_def_3p_attempts": {
		             "value": 133
		          },
		          "total_off_3p_made": {
		             "value": 45
		          },
		          "total_def_3p_made": {
		             "value": 40
		          },
		          "def_3p_opp": {
		             "value": 33.58872180451128
		          },
		          "off_3pr": {
		             "value": 0.4551083591331269
		          },
		          "def_3pr": {
		             "value": 0.39465875370919884
		          },
		          "total_off_drb": {
		             "value": 174
		          },
		          "total_def_drb": {
		             "value": 145
		          },
		          "total_off_orb": {
		             "value": 58
		          },
		          "total_def_orb": {
		             "value": 51
		          },
		          "off_orb": {
		             "value": 0.2857142857142857
		          },
		          "def_orb": {
		             "value": 0.22666666666666666
		          },
		          "total_off_2p_ast": {
		             "value": 0
		          },
		          "total_def_2p_ast": {
		             "value": 0
		          },
		          "off_2p_ast": {
		             "value": 0
		          },
		          "def_2p_ast": {
		             "value": 0
		          },
		          "total_off_2pmid_ast": {
		             "value": 3
		          },
		          "total_def_2pmid_ast": {
		             "value": 7
		          },
		          "off_2pmid_ast": {
		             "value": 0.21428571428571427
		          },
		          "def_2pmid_ast": {
		             "value": 0.22580645161290322
		          },
		          "total_off_2prim_ast": {
		             "value": 36
		          },
		          "total_def_2prim_ast": {
		             "value": 25
		          },
		          "off_2prim_ast": {
		             "value": 0.43373493975903615
		          },
		          "def_2prim_ast": {
		             "value": 0.44642857142857145
		          },
		          "total_off_3p_ast": {
		             "value": 35
		          },
		          "total_def_3p_ast": {
		             "value": 35
		          },
		          "off_3p_ast": {
		             "value": 0.7777777777777778
		          },
		          "def_3p_ast": {
		             "value": 0.875
		          },
		          "total_off_assist": {
		             "value": 74
		          },
		          "total_def_assist": {
		             "value": 67
		          },
		          "off_assist": {
		             "value": 0.5211267605633803
		          },
		          "def_assist": {
		             "value": 0.5275590551181102
		          },
		          "total_off_ast_3p": {
		             "value": 35
		          },
		          "total_def_ast_3p": {
		             "value": 35
		          },
		          "off_ast_3p": {
		             "value": 0.47297297297297297
		          },
		          "def_ast_3p": {
		             "value": 0.5223880597014925
		          },
		          "total_off_ast_mid": {
		             "value": 3
		          },
		          "total_def_ast_mid": {
		             "value": 7
		          },
		          "off_ast_mid": {
		             "value": 0.04054054054054054
		          },
		          "def_ast_mid": {
		             "value": 0.1044776119402985
		          },
		          "total_off_ast_rim": {
		             "value": 36
		          },
		          "total_def_ast_rim": {
		             "value": 25
		          },
		          "off_ast_rim": {
		             "value": 0.4864864864864865
		          },
		          "def_ast_rim": {
		             "value": 0.373134328358209
		          },
		          "total_off_scramble_2p_ast": {
		             "value": 0
		          },
		          "total_def_scramble_2p_ast": {
		             "value": 0
		          },
		          "off_scramble_2p_ast": {
		             "value": 0
		          },
		          "def_scramble_2p_ast": {
		             "value": 0
		          },
		          "total_off_scramble_2pmid_ast": {
		             "value": 1
		          },
		          "total_def_scramble_2pmid_ast": {
		             "value": 0
		          },
		          "off_scramble_2pmid_ast": {
		             "value": 1
		          },
		          "def_scramble_2pmid_ast": {
		             "value": 0
		          },
		          "total_off_scramble_2prim_ast": {
		             "value": 1
		          },
		          "total_def_scramble_2prim_ast": {
		             "value": 0
		          },
		          "off_scramble_2prim_ast": {
		             "value": 0.07692307692307693
		          },
		          "def_scramble_2prim_ast": {
		             "value": 0
		          },
		          "total_off_scramble_3p_ast": {
		             "value": 2
		          },
		          "total_def_scramble_3p_ast": {
		             "value": 3
		          },
		          "off_scramble_3p_ast": {
		             "value": 1
		          },
		          "def_scramble_3p_ast": {
		             "value": 1
		          },
		          "total_off_scramble_assist": {
		             "value": 4
		          },
		          "total_def_scramble_assist": {
		             "value": 3
		          },
		          "off_scramble_assist": {
		             "value": 0.25
		          },
		          "def_scramble_assist": {
		             "value": 0.3333333333333333
		          },
		          "total_off_scramble_to": {
		             "value": 4
		          },
		          "total_def_scramble_to": {
		             "value": 3
		          },
		          "off_scramble_to": {
		             "value": 0.10439970171513795
		          },
		          "def_scramble_to": {
		             "value": 0.09331259720062209
		          },
		          "total_off_to": {
		             "value": 49
		          },
		          "total_def_to": {
		             "value": 59
		          },
		          "off_to": {
		             "value": 0.12219451371571072
		          },
		          "def_to": {
		             "value": 0.15206185567010308
		          },
		          "total_off_trans_2p_ast": {
		             "value": 0
		          },
		          "total_def_trans_2p_ast": {
		             "value": 0
		          },
		          "off_trans_2p_ast": {
		             "value": 0
		          },
		          "def_trans_2p_ast": {
		             "value": 0
		          },
		          "total_off_trans_2pmid_ast": {
		             "value": 0
		          },
		          "total_def_trans_2pmid_ast": {
		             "value": 0
		          },
		          "off_trans_2pmid_ast": {
		             "value": 0
		          },
		          "def_trans_2pmid_ast": {
		             "value": 0
		          },
		          "total_off_trans_2prim_ast": {
		             "value": 13
		          },
		          "total_def_trans_2prim_ast": {
		             "value": 7
		          },
		          "off_trans_2prim_ast": {
		             "value": 0.5
		          },
		          "def_trans_2prim_ast": {
		             "value": 0.4375
		          },
		          "total_off_trans_3p_ast": {
		             "value": 5
		          },
		          "total_def_trans_3p_ast": {
		             "value": 7
		          },
		          "off_trans_3p_ast": {
		             "value": 0.7142857142857143
		          },
		          "def_trans_3p_ast": {
		             "value": 0.875
		          },
		          "total_off_trans_assist": {
		             "value": 18
		          },
		          "total_def_trans_assist": {
		             "value": 14
		          },
		          "off_trans_assist": {
		             "value": 0.5142857142857142
		          },
		          "def_trans_assist": {
		             "value": 0.5185185185185185
		          },
		          "total_off_trans_to": {
		             "value": 11
		          },
		          "total_def_trans_to": {
		             "value": 9
		          },
		          "off_trans_to": {
		             "value": 0.10824108241082411
		          },
		          "def_trans_to": {
		             "value": 0.1126690035052579
		          },
		          "off_adj_opp": {
		             "value": 108.34432989690721
		          },
		          "def_adj_opp": {
		             "value": 97.46209476309228
		          },
		          "off_adj_ppp": {
		             "value": 123.30858896547036
		          },
		          "def_adj_ppp": {
		             "value": 87.8676478552093
		          },
		          "total_off_blk": {
		             "value": 24
		          },
		          "total_def_blk": {
		             "value": 15
		          },
		          "total_off_foul": {
		             "value": 82
		          },
		          "total_def_foul": {
		             "value": 143
		          },
		          "total_off_poss": {
		             "value": 401
		          },
		          "total_def_poss": {
		             "value": 388
		          },
		          "off_poss": {
		             "value": 401
		          },
		          "def_poss": {
		             "value": 388
		          },
		          "off_ppp": {
		             "value": 117.2069825436409
		          },
		          "def_ppp": {
		             "value": 93.29896907216495
		          },
		          "total_off_pts": {
		             "value": 470
		          },
		          "total_def_pts": {
		             "value": 362
		          },
		          "off_scramble_2p": {
		             "value": 0.7
		          },
		          "def_scramble_2p": {
		             "value": 0.35294117647058826
		          },
		          "total_off_scramble_2p_attempts": {
		             "value": 20
		          },
		          "total_def_scramble_2p_attempts": {
		             "value": 17
		          },
		          "total_off_scramble_2p_made": {
		             "value": 14
		          },
		          "total_def_scramble_2p_made": {
		             "value": 6
		          },
		          "off_scramble_2pmid": {
		             "value": 0.3333333333333333
		          },
		          "def_scramble_2pmid": {
		             "value": 0
		          },
		          "total_off_scramble_2pmid_attempts": {
		             "value": 3
		          },
		          "total_def_scramble_2pmid_attempts": {
		             "value": 5
		          },
		          "total_off_scramble_2pmid_made": {
		             "value": 1
		          },
		          "total_def_scramble_2pmid_made": {
		             "value": 0
		          },
		          "off_scramble_2pmidr": {
		             "value": 0.0967741935483871
		          },
		          "def_scramble_2pmidr": {
		             "value": 0.20833333333333334
		          },
		          "off_scramble_2prim": {
		             "value": 0.7647058823529411
		          },
		          "def_scramble_2prim": {
		             "value": 0.5
		          },
		          "total_off_scramble_2prim_attempts": {
		             "value": 17
		          },
		          "total_def_scramble_2prim_attempts": {
		             "value": 12
		          },
		          "total_off_scramble_2prim_made": {
		             "value": 13
		          },
		          "total_def_scramble_2prim_made": {
		             "value": 6
		          },
		          "off_scramble_2primr": {
		             "value": 0.5483870967741935
		          },
		          "def_scramble_2primr": {
		             "value": 0.5
		          },
		          "off_scramble_3p": {
		             "value": 0.18181818181818182
		          },
		          "def_scramble_3p": {
		             "value": 0.42857142857142855
		          },
		          "total_off_scramble_3p_attempts": {
		             "value": 11
		          },
		          "total_def_scramble_3p_attempts": {
		             "value": 7
		          },
		          "total_off_scramble_3p_made": {
		             "value": 2
		          },
		          "total_def_scramble_3p_made": {
		             "value": 3
		          },
		          "off_scramble_3pr": {
		             "value": 0.3548387096774194
		          },
		          "def_scramble_3pr": {
		             "value": 0.2916666666666667
		          },
		          "off_scramble_efg": {
		             "value": 0.5483870967741935
		          },
		          "def_scramble_efg": {
		             "value": 0.4375
		          },
		          "total_off_scramble_fga": {
		             "value": 31
		          },
		          "total_def_scramble_fga": {
		             "value": 24
		          },
		          "total_off_scramble_fgm": {
		             "value": 16
		          },
		          "total_def_scramble_fgm": {
		             "value": 9
		          },
		          "off_scramble_ft": {
		             "value": 0.875
		          },
		          "def_scramble_ft": {
		             "value": 0.6666666666666666
		          },
		          "total_off_scramble_fta": {
		             "value": 16
		          },
		          "total_def_scramble_fta": {
		             "value": 18
		          },
		          "total_off_scramble_ftm": {
		             "value": 14
		          },
		          "total_def_scramble_ftm": {
		             "value": 12
		          },
		          "off_scramble_ftr": {
		             "value": 0.5161290322580645
		          },
		          "def_scramble_ftr": {
		             "value": 0.75
		          },
		          "total_off_scramble_poss": {
		             "value": 38.31428571428572
		          },
		          "total_def_scramble_poss": {
		             "value": 32.15
		          },
		          "off_scramble_ppp": {
		             "value": 125.27964205816554
		          },
		          "def_scramble_ppp": {
		             "value": 102.6438569206843
		          },
		          "total_off_scramble_pts": {
		             "value": 48
		          },
		          "total_def_scramble_pts": {
		             "value": 33
		          },
		          "total_off_stl": {
		             "value": 31
		          },
		          "total_def_stl": {
		             "value": 25
		          },
		          "off_trans_2p": {
		             "value": 0.7567567567567568
		          },
		          "def_trans_2p": {
		             "value": 0.4634146341463415
		          },
		          "total_off_trans_2p_attempts": {
		             "value": 37
		          },
		          "total_def_trans_2p_attempts": {
		             "value": 41
		          },
		          "total_off_trans_2p_made": {
		             "value": 28
		          },
		          "total_def_trans_2p_made": {
		             "value": 19
		          },
		          "off_trans_2pmid": {
		             "value": 0.3333333333333333
		          },
		          "def_trans_2pmid": {
		             "value": 0.2727272727272727
		          },
		          "total_off_trans_2pmid_attempts": {
		             "value": 6
		          },
		          "total_def_trans_2pmid_attempts": {
		             "value": 11
		          },
		          "total_off_trans_2pmid_made": {
		             "value": 2
		          },
		          "total_def_trans_2pmid_made": {
		             "value": 3
		          },
		          "off_trans_2pmidr": {
		             "value": 0.09523809523809523
		          },
		          "def_trans_2pmidr": {
		             "value": 0.15942028985507245
		          },
		          "off_trans_2prim": {
		             "value": 0.8387096774193549
		          },
		          "def_trans_2prim": {
		             "value": 0.5333333333333333
		          },
		          "total_off_trans_2prim_attempts": {
		             "value": 31
		          },
		          "total_def_trans_2prim_attempts": {
		             "value": 30
		          },
		          "total_off_trans_2prim_made": {
		             "value": 26
		          },
		          "total_def_trans_2prim_made": {
		             "value": 16
		          },
		          "off_trans_2primr": {
		             "value": 0.49206349206349204
		          },
		          "def_trans_2primr": {
		             "value": 0.43478260869565216
		          },
		          "off_trans_3p": {
		             "value": 0.2692307692307692
		          },
		          "def_trans_3p": {
		             "value": 0.2857142857142857
		          },
		          "total_off_trans_3p_attempts": {
		             "value": 26
		          },
		          "total_def_trans_3p_attempts": {
		             "value": 28
		          },
		          "total_off_trans_3p_made": {
		             "value": 7
		          },
		          "total_def_trans_3p_made": {
		             "value": 8
		          },
		          "off_trans_3pr": {
		             "value": 0.4126984126984127
		          },
		          "def_trans_3pr": {
		             "value": 0.4057971014492754
		          },
		          "off_trans_efg": {
		             "value": 0.6111111111111112
		          },
		          "def_trans_efg": {
		             "value": 0.4492753623188406
		          },
		          "total_off_trans_fga": {
		             "value": 63
		          },
		          "total_def_trans_fga": {
		             "value": 69
		          },
		          "total_off_trans_fgm": {
		             "value": 35
		          },
		          "total_def_trans_fgm": {
		             "value": 27
		          },
		          "off_trans_ft": {
		             "value": 0.7866666666666666
		          },
		          "def_trans_ft": {
		             "value": 0.75
		          },
		          "total_off_trans_fta": {
		             "value": 75
		          },
		          "total_def_trans_fta": {
		             "value": 24
		          },
		          "total_off_trans_ftm": {
		             "value": 59
		          },
		          "total_def_trans_ftm": {
		             "value": 18
		          },
		          "off_trans_ftr": {
		             "value": 1.1904761904761905
		          },
		          "def_trans_ftr": {
		             "value": 0.34782608695652173
		          },
		          "total_off_trans_poss": {
		             "value": 101.625
		          },
		          "total_def_trans_poss": {
		             "value": 79.88
		          },
		          "off_trans_ppp": {
		             "value": 133.82533825338254
		          },
		          "def_trans_ppp": {
		             "value": 100.15022533800702
		          },
		          "total_off_trans_pts": {
		             "value": 136
		          },
		          "total_def_trans_pts": {
		             "value": 80
		          },
		          "doc_count": 72,
		          "players_array": {
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
		                         "players": [
		                            {
		                               "code": "AaWiggins",
		                               "id": "Wiggins, Aaron"
		                            },
		                            {
		                               "code": "AnCowan",
		                               "id": "Cowan, Anthony"
		                            },
		                            {
		                               "code": "DaMorsell",
		                               "id": "Morsell, Darryl"
		                            },
		                            {
		                               "code": "ErAyala",
		                               "id": "Ayala, Eric"
		                            },
		                            {
		                               "code": "JaSmith",
		                               "id": "Smith, Jalen"
		                            }
		                         ]
		                      }
		                   }
		                ]
		             }
		          },
		          "duration_mins": {
		             "value": 220.22333333333333
		          }
		       },
		       {
		          "key": "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith",
		          "off_efg": {
		             "value": 0.47126436781609193
		          },
		          "def_efg": {
		             "value": 0.42032967032967034
		          },
		          "total_off_fga": {
		             "value": 174
		          },
		          "total_def_fga": {
		             "value": 182
		          },
		          "total_off_fgm": {
		             "value": 71
		          },
		          "total_def_fgm": {
		             "value": 68
		          },
		          "off_ft": {
		             "value": 0.7126436781609196
		          },
		          "def_ft": {
		             "value": 0.6341463414634146
		          },
		          "total_off_fta": {
		             "value": 87
		          },
		          "total_def_fta": {
		             "value": 41
		          },
		          "total_off_ftm": {
		             "value": 62
		          },
		          "total_def_ftm": {
		             "value": 26
		          },
		          "off_ftr": {
		             "value": 0.5
		          },
		          "def_ftr": {
		             "value": 0.22527472527472528
		          },
		          "off_2p": {
		             "value": 0.4803921568627451
		          },
		          "def_2p": {
		             "value": 0.425
		          },
		          "total_off_2p_attempts": {
		             "value": 102
		          },
		          "total_def_2p_attempts": {
		             "value": 120
		          },
		          "total_off_2p_made": {
		             "value": 49
		          },
		          "total_def_2p_made": {
		             "value": 51
		          },
		          "off_2pmid": {
		             "value": 0.16666666666666666
		          },
		          "def_2pmid": {
		             "value": 0.3125
		          },
		          "total_off_2pmid_attempts": {
		             "value": 36
		          },
		          "total_def_2pmid_attempts": {
		             "value": 64
		          },
		          "total_off_2pmid_made": {
		             "value": 6
		          },
		          "total_def_2pmid_made": {
		             "value": 20
		          },
		          "off_2pmidr": {
		             "value": 0.20689655172413793
		          },
		          "def_2pmidr": {
		             "value": 0.3516483516483517
		          },
		          "off_2prim": {
		             "value": 0.6515151515151515
		          },
		          "def_2prim": {
		             "value": 0.5535714285714286
		          },
		          "total_off_2prim_attempts": {
		             "value": 66
		          },
		          "total_def_2prim_attempts": {
		             "value": 56
		          },
		          "total_off_2prim_made": {
		             "value": 43
		          },
		          "total_def_2prim_made": {
		             "value": 31
		          },
		          "off_2primr": {
		             "value": 0.3793103448275862
		          },
		          "def_2primr": {
		             "value": 0.3076923076923077
		          },
		          "off_3p": {
		             "value": 0.3055555555555556
		          },
		          "def_3p": {
		             "value": 0.27419354838709675
		          },
		          "total_off_3p_attempts": {
		             "value": 72
		          },
		          "total_def_3p_attempts": {
		             "value": 62
		          },
		          "total_off_3p_made": {
		             "value": 22
		          },
		          "total_def_3p_made": {
		             "value": 17
		          },
		          "def_3p_opp": {
		             "value": 33.36290322580645
		          },
		          "off_3pr": {
		             "value": 0.41379310344827586
		          },
		          "def_3pr": {
		             "value": 0.34065934065934067
		          },
		          "total_off_drb": {
		             "value": 90
		          },
		          "total_def_drb": {
		             "value": 79
		          },
		          "total_off_orb": {
		             "value": 37
		          },
		          "total_def_orb": {
		             "value": 33
		          },
		          "off_orb": {
		             "value": 0.31896551724137934
		          },
		          "def_orb": {
		             "value": 0.2682926829268293
		          },
		          "total_off_2p_ast": {
		             "value": 0
		          },
		          "total_def_2p_ast": {
		             "value": 0
		          },
		          "off_2p_ast": {
		             "value": 0
		          },
		          "def_2p_ast": {
		             "value": 0
		          },
		          "total_off_2pmid_ast": {
		             "value": 0
		          },
		          "total_def_2pmid_ast": {
		             "value": 7
		          },
		          "off_2pmid_ast": {
		             "value": 0
		          },
		          "def_2pmid_ast": {
		             "value": 0.35
		          },
		          "total_off_2prim_ast": {
		             "value": 18
		          },
		          "total_def_2prim_ast": {
		             "value": 11
		          },
		          "off_2prim_ast": {
		             "value": 0.4186046511627907
		          },
		          "def_2prim_ast": {
		             "value": 0.3548387096774194
		          },
		          "total_off_3p_ast": {
		             "value": 21
		          },
		          "total_def_3p_ast": {
		             "value": 16
		          },
		          "off_3p_ast": {
		             "value": 0.9545454545454546
		          },
		          "def_3p_ast": {
		             "value": 0.9411764705882353
		          },
		          "total_off_assist": {
		             "value": 39
		          },
		          "total_def_assist": {
		             "value": 34
		          },
		          "off_assist": {
		             "value": 0.5492957746478874
		          },
		          "def_assist": {
		             "value": 0.5
		          },
		          "total_off_ast_3p": {
		             "value": 21
		          },
		          "total_def_ast_3p": {
		             "value": 16
		          },
		          "off_ast_3p": {
		             "value": 0.5384615384615384
		          },
		          "def_ast_3p": {
		             "value": 0.47058823529411764
		          },
		          "total_off_ast_mid": {
		             "value": 0
		          },
		          "total_def_ast_mid": {
		             "value": 7
		          },
		          "off_ast_mid": {
		             "value": 0
		          },
		          "def_ast_mid": {
		             "value": 0.20588235294117646
		          },
		          "total_off_ast_rim": {
		             "value": 18
		          },
		          "total_def_ast_rim": {
		             "value": 11
		          },
		          "off_ast_rim": {
		             "value": 0.46153846153846156
		          },
		          "def_ast_rim": {
		             "value": 0.3235294117647059
		          },
		          "total_off_scramble_2p_ast": {
		             "value": 0
		          },
		          "total_def_scramble_2p_ast": {
		             "value": 0
		          },
		          "off_scramble_2p_ast": {
		             "value": 0
		          },
		          "def_scramble_2p_ast": {
		             "value": 0
		          },
		          "total_off_scramble_2pmid_ast": {
		             "value": 0
		          },
		          "total_def_scramble_2pmid_ast": {
		             "value": 1
		          },
		          "off_scramble_2pmid_ast": {
		             "value": 0
		          },
		          "def_scramble_2pmid_ast": {
		             "value": 1
		          },
		          "total_off_scramble_2prim_ast": {
		             "value": 1
		          },
		          "total_def_scramble_2prim_ast": {
		             "value": 0
		          },
		          "off_scramble_2prim_ast": {
		             "value": 0.1111111111111111
		          },
		          "def_scramble_2prim_ast": {
		             "value": 0
		          },
		          "total_off_scramble_3p_ast": {
		             "value": 1
		          },
		          "total_def_scramble_3p_ast": {
		             "value": 3
		          },
		          "off_scramble_3p_ast": {
		             "value": 1
		          },
		          "def_scramble_3p_ast": {
		             "value": 1
		          },
		          "total_off_scramble_assist": {
		             "value": 2
		          },
		          "total_def_scramble_assist": {
		             "value": 4
		          },
		          "off_scramble_assist": {
		             "value": 0.2
		          },
		          "def_scramble_assist": {
		             "value": 0.36363636363636365
		          },
		          "total_off_scramble_to": {
		             "value": 2
		          },
		          "total_def_scramble_to": {
		             "value": 0
		          },
		          "off_scramble_to": {
		             "value": 0.08348927594645171
		          },
		          "def_scramble_to": {
		             "value": 0
		          },
		          "total_off_to": {
		             "value": 33
		          },
		          "total_def_to": {
		             "value": 47
		          },
		          "off_to": {
		             "value": 0.15639810426540285
		          },
		          "def_to": {
		             "value": 0.22065727699530516
		          },
		          "total_off_trans_2p_ast": {
		             "value": 0
		          },
		          "total_def_trans_2p_ast": {
		             "value": 0
		          },
		          "off_trans_2p_ast": {
		             "value": 0
		          },
		          "def_trans_2p_ast": {
		             "value": 0
		          },
		          "total_off_trans_2pmid_ast": {
		             "value": 0
		          },
		          "total_def_trans_2pmid_ast": {
		             "value": 0
		          },
		          "off_trans_2pmid_ast": {
		             "value": 0
		          },
		          "def_trans_2pmid_ast": {
		             "value": 0
		          },
		          "total_off_trans_2prim_ast": {
		             "value": 7
		          },
		          "total_def_trans_2prim_ast": {
		             "value": 0
		          },
		          "off_trans_2prim_ast": {
		             "value": 0.7
		          },
		          "def_trans_2prim_ast": {
		             "value": 0
		          },
		          "total_off_trans_3p_ast": {
		             "value": 6
		          },
		          "total_def_trans_3p_ast": {
		             "value": 2
		          },
		          "off_trans_3p_ast": {
		             "value": 1
		          },
		          "def_trans_3p_ast": {
		             "value": 1
		          },
		          "total_off_trans_assist": {
		             "value": 13
		          },
		          "total_def_trans_assist": {
		             "value": 2
		          },
		          "off_trans_assist": {
		             "value": 0.7647058823529411
		          },
		          "def_trans_assist": {
		             "value": 0.6666666666666666
		          },
		          "total_off_trans_to": {
		             "value": 13
		          },
		          "total_def_trans_to": {
		             "value": 8
		          },
		          "off_trans_to": {
		             "value": 0.2395894567928695
		          },
		          "def_trans_to": {
		             "value": 0.3325644470355631
		          },
		          "off_adj_opp": {
		             "value": 109.45211267605633
		          },
		          "def_adj_opp": {
		             "value": 94.87867298578198
		          },
		          "off_adj_ppp": {
		             "value": 116.18465333545907
		          },
		          "def_adj_ppp": {
		             "value": 79.356108708242
		          },
		          "total_off_blk": {
		             "value": 13
		          },
		          "total_def_blk": {
		             "value": 6
		          },
		          "total_off_foul": {
		             "value": 51
		          },
		          "total_def_foul": {
		             "value": 67
		          },
		          "total_off_poss": {
		             "value": 211
		          },
		          "total_def_poss": {
		             "value": 213
		          },
		          "off_poss": {
		             "value": 211
		          },
		          "def_poss": {
		             "value": 213
		          },
		          "off_ppp": {
		             "value": 107.1090047393365
		          },
		          "def_ppp": {
		             "value": 84.03755868544602
		          },
		          "total_off_pts": {
		             "value": 226
		          },
		          "total_def_pts": {
		             "value": 179
		          },
		          "off_scramble_2p": {
		             "value": 0.75
		          },
		          "def_scramble_2p": {
		             "value": 0.6666666666666666
		          },
		          "total_off_scramble_2p_attempts": {
		             "value": 12
		          },
		          "total_def_scramble_2p_attempts": {
		             "value": 12
		          },
		          "total_off_scramble_2p_made": {
		             "value": 9
		          },
		          "total_def_scramble_2p_made": {
		             "value": 8
		          },
		          "off_scramble_2pmid": {
		             "value": 0
		          },
		          "def_scramble_2pmid": {
		             "value": 0.5
		          },
		          "total_off_scramble_2pmid_attempts": {
		             "value": 1
		          },
		          "total_def_scramble_2pmid_attempts": {
		             "value": 2
		          },
		          "total_off_scramble_2pmid_made": {
		             "value": 0
		          },
		          "total_def_scramble_2pmid_made": {
		             "value": 1
		          },
		          "off_scramble_2pmidr": {
		             "value": 0.06666666666666667
		          },
		          "def_scramble_2pmidr": {
		             "value": 0.1111111111111111
		          },
		          "off_scramble_2prim": {
		             "value": 0.8181818181818182
		          },
		          "def_scramble_2prim": {
		             "value": 0.7
		          },
		          "total_off_scramble_2prim_attempts": {
		             "value": 11
		          },
		          "total_def_scramble_2prim_attempts": {
		             "value": 10
		          },
		          "total_off_scramble_2prim_made": {
		             "value": 9
		          },
		          "total_def_scramble_2prim_made": {
		             "value": 7
		          },
		          "off_scramble_2primr": {
		             "value": 0.7333333333333333
		          },
		          "def_scramble_2primr": {
		             "value": 0.5555555555555556
		          },
		          "off_scramble_3p": {
		             "value": 0.3333333333333333
		          },
		          "def_scramble_3p": {
		             "value": 0.5
		          },
		          "total_off_scramble_3p_attempts": {
		             "value": 3
		          },
		          "total_def_scramble_3p_attempts": {
		             "value": 6
		          },
		          "total_off_scramble_3p_made": {
		             "value": 1
		          },
		          "total_def_scramble_3p_made": {
		             "value": 3
		          },
		          "off_scramble_3pr": {
		             "value": 0.2
		          },
		          "def_scramble_3pr": {
		             "value": 0.3333333333333333
		          },
		          "off_scramble_efg": {
		             "value": 0.7
		          },
		          "def_scramble_efg": {
		             "value": 0.6944444444444444
		          },
		          "total_off_scramble_fga": {
		             "value": 15
		          },
		          "total_def_scramble_fga": {
		             "value": 18
		          },
		          "total_off_scramble_fgm": {
		             "value": 10
		          },
		          "total_def_scramble_fgm": {
		             "value": 11
		          },
		          "off_scramble_ft": {
		             "value": 0.6666666666666666
		          },
		          "def_scramble_ft": {
		             "value": 1
		          },
		          "total_off_scramble_fta": {
		             "value": 18
		          },
		          "total_def_scramble_fta": {
		             "value": 3
		          },
		          "total_off_scramble_ftm": {
		             "value": 12
		          },
		          "total_def_scramble_ftm": {
		             "value": 3
		          },
		          "off_scramble_ftr": {
		             "value": 1.2
		          },
		          "def_scramble_ftr": {
		             "value": 0.16666666666666666
		          },
		          "total_off_scramble_poss": {
		             "value": 23.9551724137931
		          },
		          "total_def_scramble_poss": {
		             "value": 17.546951219512195
		          },
		          "off_scramble_ppp": {
		             "value": 137.75730531164533
		          },
		          "def_scramble_ppp": {
		             "value": 159.57188032108976
		          },
		          "total_off_scramble_pts": {
		             "value": 33
		          },
		          "total_def_scramble_pts": {
		             "value": 28
		          },
		          "total_off_stl": {
		             "value": 18
		          },
		          "total_def_stl": {
		             "value": 17
		          },
		          "off_trans_2p": {
		             "value": 0.6875
		          },
		          "def_trans_2p": {
		             "value": 0.16666666666666666
		          },
		          "total_off_trans_2p_attempts": {
		             "value": 16
		          },
		          "total_def_trans_2p_attempts": {
		             "value": 6
		          },
		          "total_off_trans_2p_made": {
		             "value": 11
		          },
		          "total_def_trans_2p_made": {
		             "value": 1
		          },
		          "off_trans_2pmid": {
		             "value": 0.5
		          },
		          "def_trans_2pmid": {
		             "value": 0
		          },
		          "total_off_trans_2pmid_attempts": {
		             "value": 2
		          },
		          "total_def_trans_2pmid_attempts": {
		             "value": 0
		          },
		          "total_off_trans_2pmid_made": {
		             "value": 1
		          },
		          "total_def_trans_2pmid_made": {
		             "value": 0
		          },
		          "off_trans_2pmidr": {
		             "value": 0.06451612903225806
		          },
		          "def_trans_2pmidr": {
		             "value": 0
		          },
		          "off_trans_2prim": {
		             "value": 0.7142857142857143
		          },
		          "def_trans_2prim": {
		             "value": 0.16666666666666666
		          },
		          "total_off_trans_2prim_attempts": {
		             "value": 14
		          },
		          "total_def_trans_2prim_attempts": {
		             "value": 6
		          },
		          "total_off_trans_2prim_made": {
		             "value": 10
		          },
		          "total_def_trans_2prim_made": {
		             "value": 1
		          },
		          "off_trans_2primr": {
		             "value": 0.45161290322580644
		          },
		          "def_trans_2primr": {
		             "value": 0.4
		          },
		          "off_trans_3p": {
		             "value": 0.4
		          },
		          "def_trans_3p": {
		             "value": 0.2222222222222222
		          },
		          "total_off_trans_3p_attempts": {
		             "value": 15
		          },
		          "total_def_trans_3p_attempts": {
		             "value": 9
		          },
		          "total_off_trans_3p_made": {
		             "value": 6
		          },
		          "total_def_trans_3p_made": {
		             "value": 2
		          },
		          "off_trans_3pr": {
		             "value": 0.4838709677419355
		          },
		          "def_trans_3pr": {
		             "value": 0.6
		          },
		          "off_trans_efg": {
		             "value": 0.6451612903225806
		          },
		          "def_trans_efg": {
		             "value": 0.26666666666666666
		          },
		          "total_off_trans_fga": {
		             "value": 31
		          },
		          "total_def_trans_fga": {
		             "value": 15
		          },
		          "total_off_trans_fgm": {
		             "value": 17
		          },
		          "total_def_trans_fgm": {
		             "value": 3
		          },
		          "off_trans_ft": {
		             "value": 0.8387096774193549
		          },
		          "def_trans_ft": {
		             "value": 0.6666666666666666
		          },
		          "total_off_trans_fta": {
		             "value": 31
		          },
		          "total_def_trans_fta": {
		             "value": 9
		          },
		          "total_off_trans_ftm": {
		             "value": 26
		          },
		          "total_def_trans_ftm": {
		             "value": 6
		          },
		          "off_trans_ftr": {
		             "value": 1
		          },
		          "def_trans_ftr": {
		             "value": 0.6
		          },
		          "total_off_trans_poss": {
		             "value": 54.25948275862069
		          },
		          "total_def_trans_poss": {
		             "value": 24.055487804878048
		          },
		          "off_trans_ppp": {
		             "value": 121.63772421791836
		          },
		          "def_trans_ppp": {
		             "value": 58.19877823122354
		          },
		          "total_off_trans_pts": {
		             "value": 66
		          },
		          "total_def_trans_pts": {
		             "value": 14
		          },
		          "doc_count": 50,
		          "players_array": {
		             "hits": {
		                "total": {
		                   "value": 50,
		                   "relation": "eq"
		                },
		                "max_score": 4.823819,
		                "hits": [
		                   {
		                      "_index": "bigten_2019_lpong",
		                      "_type": "_doc",
		                      "_id": "jNtArXQBjSGDKv5Ymnvb",
		                      "_score": 4.823819,
		                      "_source": {
		                         "players": [
		                            {
		                               "code": "AaWiggins",
		                               "id": "Wiggins, Aaron"
		                            },
		                            {
		                               "code": "AnCowan",
		                               "id": "Cowan, Anthony"
		                            },
		                            {
		                               "code": "DaMorsell",
		                               "id": "Morsell, Darryl"
		                            },
		                            {
		                               "code": "DoScott",
		                               "id": "Scott, Donta"
		                            },
		                            {
		                               "code": "JaSmith",
		                               "id": "Smith, Jalen"
		                            }
		                         ]
		                      }
		                   }
		                ]
		             }
		          },
		          "duration_mins": {
		             "value": 131.06833333333333
		          }
		       },
		       {
		          "key": "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith",
		          "off_efg": {
		             "value": 0.521978021978022
		          },
		          "def_efg": {
		             "value": 0.38202247191011235
		          },
		          "total_off_fga": {
		             "value": 182
		          },
		          "total_def_fga": {
		             "value": 178
		          },
		          "total_off_fgm": {
		             "value": 81
		          },
		          "total_def_fgm": {
		             "value": 59
		          },
		          "off_ft": {
		             "value": 0.7560975609756098
		          },
		          "def_ft": {
		             "value": 0.5925925925925926
		          },
		          "total_off_fta": {
		             "value": 41
		          },
		          "total_def_fta": {
		             "value": 54
		          },
		          "total_off_ftm": {
		             "value": 31
		          },
		          "total_def_ftm": {
		             "value": 32
		          },
		          "off_ftr": {
		             "value": 0.22527472527472528
		          },
		          "def_ftr": {
		             "value": 0.30337078651685395
		          },
		          "off_2p": {
		             "value": 0.5353535353535354
		          },
		          "def_2p": {
		             "value": 0.3867924528301887
		          },
		          "total_off_2p_attempts": {
		             "value": 99
		          },
		          "total_def_2p_attempts": {
		             "value": 106
		          },
		          "total_off_2p_made": {
		             "value": 53
		          },
		          "total_def_2p_made": {
		             "value": 41
		          },
		          "off_2pmid": {
		             "value": 0.3235294117647059
		          },
		          "def_2pmid": {
		             "value": 0.20454545454545456
		          },
		          "total_off_2pmid_attempts": {
		             "value": 34
		          },
		          "total_def_2pmid_attempts": {
		             "value": 44
		          },
		          "total_off_2pmid_made": {
		             "value": 11
		          },
		          "total_def_2pmid_made": {
		             "value": 9
		          },
		          "off_2pmidr": {
		             "value": 0.18681318681318682
		          },
		          "def_2pmidr": {
		             "value": 0.24719101123595505
		          },
		          "off_2prim": {
		             "value": 0.6461538461538462
		          },
		          "def_2prim": {
		             "value": 0.5161290322580645
		          },
		          "total_off_2prim_attempts": {
		             "value": 65
		          },
		          "total_def_2prim_attempts": {
		             "value": 62
		          },
		          "total_off_2prim_made": {
		             "value": 42
		          },
		          "total_def_2prim_made": {
		             "value": 32
		          },
		          "off_2primr": {
		             "value": 0.35714285714285715
		          },
		          "def_2primr": {
		             "value": 0.34831460674157305
		          },
		          "off_3p": {
		             "value": 0.3373493975903614
		          },
		          "def_3p": {
		             "value": 0.25
		          },
		          "total_off_3p_attempts": {
		             "value": 83
		          },
		          "total_def_3p_attempts": {
		             "value": 72
		          },
		          "total_off_3p_made": {
		             "value": 28
		          },
		          "total_def_3p_made": {
		             "value": 18
		          },
		          "def_3p_opp": {
		             "value": 33.34861111111111
		          },
		          "off_3pr": {
		             "value": 0.45604395604395603
		          },
		          "def_3pr": {
		             "value": 0.4044943820224719
		          },
		          "total_off_drb": {
		             "value": 87
		          },
		          "total_def_drb": {
		             "value": 74
		          },
		          "total_off_orb": {
		             "value": 34
		          },
		          "total_def_orb": {
		             "value": 41
		          },
		          "off_orb": {
		             "value": 0.3148148148148148
		          },
		          "def_orb": {
		             "value": 0.3203125
		          },
		          "total_off_2p_ast": {
		             "value": 0
		          },
		          "total_def_2p_ast": {
		             "value": 0
		          },
		          "off_2p_ast": {
		             "value": 0
		          },
		          "def_2p_ast": {
		             "value": 0
		          },
		          "total_off_2pmid_ast": {
		             "value": 3
		          },
		          "total_def_2pmid_ast": {
		             "value": 4
		          },
		          "off_2pmid_ast": {
		             "value": 0.2727272727272727
		          },
		          "def_2pmid_ast": {
		             "value": 0.4444444444444444
		          },
		          "total_off_2prim_ast": {
		             "value": 16
		          },
		          "total_def_2prim_ast": {
		             "value": 15
		          },
		          "off_2prim_ast": {
		             "value": 0.38095238095238093
		          },
		          "def_2prim_ast": {
		             "value": 0.46875
		          },
		          "total_off_3p_ast": {
		             "value": 24
		          },
		          "total_def_3p_ast": {
		             "value": 16
		          },
		          "off_3p_ast": {
		             "value": 0.8571428571428571
		          },
		          "def_3p_ast": {
		             "value": 0.8888888888888888
		          },
		          "total_off_assist": {
		             "value": 43
		          },
		          "total_def_assist": {
		             "value": 35
		          },
		          "off_assist": {
		             "value": 0.5308641975308642
		          },
		          "def_assist": {
		             "value": 0.5932203389830508
		          },
		          "total_off_ast_3p": {
		             "value": 24
		          },
		          "total_def_ast_3p": {
		             "value": 16
		          },
		          "off_ast_3p": {
		             "value": 0.5581395348837209
		          },
		          "def_ast_3p": {
		             "value": 0.45714285714285713
		          },
		          "total_off_ast_mid": {
		             "value": 3
		          },
		          "total_def_ast_mid": {
		             "value": 4
		          },
		          "off_ast_mid": {
		             "value": 0.06976744186046512
		          },
		          "def_ast_mid": {
		             "value": 0.11428571428571428
		          },
		          "total_off_ast_rim": {
		             "value": 16
		          },
		          "total_def_ast_rim": {
		             "value": 15
		          },
		          "off_ast_rim": {
		             "value": 0.37209302325581395
		          },
		          "def_ast_rim": {
		             "value": 0.42857142857142855
		          },
		          "total_off_scramble_2p_ast": {
		             "value": 0
		          },
		          "total_def_scramble_2p_ast": {
		             "value": 0
		          },
		          "off_scramble_2p_ast": {
		             "value": 0
		          },
		          "def_scramble_2p_ast": {
		             "value": 0
		          },
		          "total_off_scramble_2pmid_ast": {
		             "value": 0
		          },
		          "total_def_scramble_2pmid_ast": {
		             "value": 1
		          },
		          "off_scramble_2pmid_ast": {
		             "value": 0
		          },
		          "def_scramble_2pmid_ast": {
		             "value": 1
		          },
		          "total_off_scramble_2prim_ast": {
		             "value": 0
		          },
		          "total_def_scramble_2prim_ast": {
		             "value": 0
		          },
		          "off_scramble_2prim_ast": {
		             "value": 0
		          },
		          "def_scramble_2prim_ast": {
		             "value": 0
		          },
		          "total_off_scramble_3p_ast": {
		             "value": 0
		          },
		          "total_def_scramble_3p_ast": {
		             "value": 0
		          },
		          "off_scramble_3p_ast": {
		             "value": 0
		          },
		          "def_scramble_3p_ast": {
		             "value": 0
		          },
		          "total_off_scramble_assist": {
		             "value": 0
		          },
		          "total_def_scramble_assist": {
		             "value": 1
		          },
		          "off_scramble_assist": {
		             "value": 0
		          },
		          "def_scramble_assist": {
		             "value": 0.14285714285714285
		          },
		          "total_off_scramble_to": {
		             "value": 5
		          },
		          "total_def_scramble_to": {
		             "value": 3
		          },
		          "off_scramble_to": {
		             "value": 0.2518069480065283
		          },
		          "def_scramble_to": {
		             "value": 0.1846331378017117
		          },
		          "total_off_to": {
		             "value": 34
		          },
		          "total_def_to": {
		             "value": 33
		          },
		          "off_to": {
		             "value": 0.17258883248730963
		          },
		          "def_to": {
		             "value": 0.17098445595854922
		          },
		          "total_off_trans_2p_ast": {
		             "value": 0
		          },
		          "total_def_trans_2p_ast": {
		             "value": 0
		          },
		          "off_trans_2p_ast": {
		             "value": 0
		          },
		          "def_trans_2p_ast": {
		             "value": 0
		          },
		          "total_off_trans_2pmid_ast": {
		             "value": 0
		          },
		          "total_def_trans_2pmid_ast": {
		             "value": 0
		          },
		          "off_trans_2pmid_ast": {
		             "value": 0
		          },
		          "def_trans_2pmid_ast": {
		             "value": 0
		          },
		          "total_off_trans_2prim_ast": {
		             "value": 4
		          },
		          "total_def_trans_2prim_ast": {
		             "value": 6
		          },
		          "off_trans_2prim_ast": {
		             "value": 0.36363636363636365
		          },
		          "def_trans_2prim_ast": {
		             "value": 0.75
		          },
		          "total_off_trans_3p_ast": {
		             "value": 5
		          },
		          "total_def_trans_3p_ast": {
		             "value": 2
		          },
		          "off_trans_3p_ast": {
		             "value": 0.8333333333333334
		          },
		          "def_trans_3p_ast": {
		             "value": 0.5
		          },
		          "total_off_trans_assist": {
		             "value": 9
		          },
		          "total_def_trans_assist": {
		             "value": 8
		          },
		          "off_trans_assist": {
		             "value": 0.5
		          },
		          "def_trans_assist": {
		             "value": 0.6666666666666666
		          },
		          "total_off_trans_to": {
		             "value": 7
		          },
		          "total_def_trans_to": {
		             "value": 5
		          },
		          "off_trans_to": {
		             "value": 0.19322189848182797
		          },
		          "def_trans_to": {
		             "value": 0.1332833520763047
		          },
		          "off_adj_opp": {
		             "value": 108.46632124352331
		          },
		          "def_adj_opp": {
		             "value": 95.28071065989847
		          },
		          "off_adj_ppp": {
		             "value": 120.3613605770025
		          },
		          "def_adj_ppp": {
		             "value": 82.0894333612718
		          },
		          "total_off_blk": {
		             "value": 17
		          },
		          "total_def_blk": {
		             "value": 11
		          },
		          "total_off_foul": {
		             "value": 48
		          },
		          "total_def_foul": {
		             "value": 48
		          },
		          "total_off_poss": {
		             "value": 197
		          },
		          "total_def_poss": {
		             "value": 193
		          },
		          "off_poss": {
		             "value": 197
		          },
		          "def_poss": {
		             "value": 193
		          },
		          "off_ppp": {
		             "value": 112.18274111675127
		          },
		          "def_ppp": {
		             "value": 87.04663212435233
		          },
		          "total_off_pts": {
		             "value": 221
		          },
		          "total_def_pts": {
		             "value": 168
		          },
		          "off_scramble_2p": {
		             "value": 0.5384615384615384
		          },
		          "def_scramble_2p": {
		             "value": 0.7777777777777778
		          },
		          "total_off_scramble_2p_attempts": {
		             "value": 13
		          },
		          "total_def_scramble_2p_attempts": {
		             "value": 9
		          },
		          "total_off_scramble_2p_made": {
		             "value": 7
		          },
		          "total_def_scramble_2p_made": {
		             "value": 7
		          },
		          "off_scramble_2pmid": {
		             "value": 0
		          },
		          "def_scramble_2pmid": {
		             "value": 0.5
		          },
		          "total_off_scramble_2pmid_attempts": {
		             "value": 2
		          },
		          "total_def_scramble_2pmid_attempts": {
		             "value": 2
		          },
		          "total_off_scramble_2pmid_made": {
		             "value": 0
		          },
		          "total_def_scramble_2pmid_made": {
		             "value": 1
		          },
		          "off_scramble_2pmidr": {
		             "value": 0.13333333333333333
		          },
		          "def_scramble_2pmidr": {
		             "value": 0.16666666666666666
		          },
		          "off_scramble_2prim": {
		             "value": 0.6363636363636364
		          },
		          "def_scramble_2prim": {
		             "value": 0.8571428571428571
		          },
		          "total_off_scramble_2prim_attempts": {
		             "value": 11
		          },
		          "total_def_scramble_2prim_attempts": {
		             "value": 7
		          },
		          "total_off_scramble_2prim_made": {
		             "value": 7
		          },
		          "total_def_scramble_2prim_made": {
		             "value": 6
		          },
		          "off_scramble_2primr": {
		             "value": 0.7333333333333333
		          },
		          "def_scramble_2primr": {
		             "value": 0.5833333333333334
		          },
		          "off_scramble_3p": {
		             "value": 0
		          },
		          "def_scramble_3p": {
		             "value": 0
		          },
		          "total_off_scramble_3p_attempts": {
		             "value": 2
		          },
		          "total_def_scramble_3p_attempts": {
		             "value": 3
		          },
		          "total_off_scramble_3p_made": {
		             "value": 0
		          },
		          "total_def_scramble_3p_made": {
		             "value": 0
		          },
		          "off_scramble_3pr": {
		             "value": 0.13333333333333333
		          },
		          "def_scramble_3pr": {
		             "value": 0.25
		          },
		          "off_scramble_efg": {
		             "value": 0.4666666666666667
		          },
		          "def_scramble_efg": {
		             "value": 0.5833333333333334
		          },
		          "total_off_scramble_fga": {
		             "value": 15
		          },
		          "total_def_scramble_fga": {
		             "value": 12
		          },
		          "total_off_scramble_fgm": {
		             "value": 7
		          },
		          "total_def_scramble_fgm": {
		             "value": 7
		          },
		          "off_scramble_ft": {
		             "value": 0.8
		          },
		          "def_scramble_ft": {
		             "value": 0.16666666666666666
		          },
		          "total_off_scramble_fta": {
		             "value": 5
		          },
		          "total_def_scramble_fta": {
		             "value": 6
		          },
		          "total_off_scramble_ftm": {
		             "value": 4
		          },
		          "total_def_scramble_ftm": {
		             "value": 1
		          },
		          "off_scramble_ftr": {
		             "value": 0.3333333333333333
		          },
		          "def_scramble_ftr": {
		             "value": 0.5
		          },
		          "total_off_scramble_poss": {
		             "value": 19.85648148148148
		          },
		          "total_def_scramble_poss": {
		             "value": 16.2484375
		          },
		          "off_scramble_ppp": {
		             "value": 90.6505012823502
		          },
		          "def_scramble_ppp": {
		             "value": 92.31656890085584
		          },
		          "total_off_scramble_pts": {
		             "value": 18
		          },
		          "total_def_scramble_pts": {
		             "value": 15
		          },
		          "total_off_stl": {
		             "value": 11
		          },
		          "total_def_stl": {
		             "value": 17
		          },
		          "off_trans_2p": {
		             "value": 0.6666666666666666
		          },
		          "def_trans_2p": {
		             "value": 0.4444444444444444
		          },
		          "total_off_trans_2p_attempts": {
		             "value": 18
		          },
		          "total_def_trans_2p_attempts": {
		             "value": 18
		          },
		          "total_off_trans_2p_made": {
		             "value": 12
		          },
		          "total_def_trans_2p_made": {
		             "value": 8
		          },
		          "off_trans_2pmid": {
		             "value": 0.5
		          },
		          "def_trans_2pmid": {
		             "value": 0
		          },
		          "total_off_trans_2pmid_attempts": {
		             "value": 2
		          },
		          "total_def_trans_2pmid_attempts": {
		             "value": 2
		          },
		          "total_off_trans_2pmid_made": {
		             "value": 1
		          },
		          "total_def_trans_2pmid_made": {
		             "value": 0
		          },
		          "off_trans_2pmidr": {
		             "value": 0.06060606060606061
		          },
		          "def_trans_2pmidr": {
		             "value": 0.06451612903225806
		          },
		          "off_trans_2prim": {
		             "value": 0.6875
		          },
		          "def_trans_2prim": {
		             "value": 0.5
		          },
		          "total_off_trans_2prim_attempts": {
		             "value": 16
		          },
		          "total_def_trans_2prim_attempts": {
		             "value": 16
		          },
		          "total_off_trans_2prim_made": {
		             "value": 11
		          },
		          "total_def_trans_2prim_made": {
		             "value": 8
		          },
		          "off_trans_2primr": {
		             "value": 0.48484848484848486
		          },
		          "def_trans_2primr": {
		             "value": 0.5161290322580645
		          },
		          "off_trans_3p": {
		             "value": 0.4
		          },
		          "def_trans_3p": {
		             "value": 0.3076923076923077
		          },
		          "total_off_trans_3p_attempts": {
		             "value": 15
		          },
		          "total_def_trans_3p_attempts": {
		             "value": 13
		          },
		          "total_off_trans_3p_made": {
		             "value": 6
		          },
		          "total_def_trans_3p_made": {
		             "value": 4
		          },
		          "off_trans_3pr": {
		             "value": 0.45454545454545453
		          },
		          "def_trans_3pr": {
		             "value": 0.41935483870967744
		          },
		          "off_trans_efg": {
		             "value": 0.6363636363636364
		          },
		          "def_trans_efg": {
		             "value": 0.45161290322580644
		          },
		          "total_off_trans_fga": {
		             "value": 33
		          },
		          "total_def_trans_fga": {
		             "value": 31
		          },
		          "total_off_trans_fgm": {
		             "value": 18
		          },
		          "total_def_trans_fgm": {
		             "value": 12
		          },
		          "off_trans_ft": {
		             "value": 0.5
		          },
		          "def_trans_ft": {
		             "value": 0.5
		          },
		          "total_off_trans_fta": {
		             "value": 2
		          },
		          "total_def_trans_fta": {
		             "value": 16
		          },
		          "total_off_trans_ftm": {
		             "value": 1
		          },
		          "total_def_trans_ftm": {
		             "value": 8
		          },
		          "off_trans_ftr": {
		             "value": 0.06060606060606061
		          },
		          "def_trans_ftr": {
		             "value": 0.5161290322580645
		          },
		          "total_off_trans_poss": {
		             "value": 36.227777777777774
		          },
		          "total_def_trans_poss": {
		             "value": 37.5140625
		          },
		          "off_trans_ppp": {
		             "value": 118.69345192455145
		          },
		          "def_trans_ppp": {
		             "value": 95.9640134949394
		          },
		          "total_off_trans_pts": {
		             "value": 43
		          },
		          "total_def_trans_pts": {
		             "value": 36
		          },
		          "doc_count": 52,
		          "players_array": {
		             "hits": {
		                "total": {
		                   "value": 52,
		                   "relation": "eq"
		                },
		                "max_score": 4.823819,
		                "hits": [
		                   {
		                      "_index": "bigten_2019_lpong",
		                      "_type": "_doc",
		                      "_id": "qttArXQBjSGDKv5Ym3vP",
		                      "_score": 4.823819,
		                      "_source": {
		                         "players": [
		                            {
		                               "code": "AaWiggins",
		                               "id": "Wiggins, Aaron"
		                            },
		                            {
		                               "code": "AnCowan",
		                               "id": "Cowan, Anthony"
		                            },
		                            {
		                               "code": "DoScott",
		                               "id": "Scott, Donta"
		                            },
		                            {
		                               "code": "ErAyala",
		                               "id": "Ayala, Eric"
		                            },
		                            {
		                               "code": "JaSmith",
		                               "id": "Smith, Jalen"
		                            }
		                         ]
		                      }
		                   }
		                ]
		             }
		          },
		          "duration_mins": {
		             "value": 121.81833333333336
		          }
		       }
		    ]
			}
		},
		"status": 200
	}]
};
