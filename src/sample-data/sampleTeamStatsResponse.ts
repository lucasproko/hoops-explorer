import { SampleDataUtils } from "./SampleDataUtils"

// Query: On/Off: 2019/20 Maryland (M): on:'NOT (Hart Or Serrel )', auto-off, base:'', [overrides]

export const sampleTeamStatsResponse =
{
	"took": 47,
	"responses": [{
		"took": 46,
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
			"tri_filter": {
				"buckets": {
					"baseline": {
						"doc_count": 594,
						"total_off_fga": {
							"value": 1774
						},
						"total_def_scramble_3p_attempts": {
							"value": 35
						},
						"total_def_drb": {
							"value": 769
						},
						"total_off_2pmid_made": {
							"value": 102
						},
						"total_def_2p_made": {
							"value": 504
						},
						"total_off_trans_to": {
							"value": 83
						},
						"total_off_trans_assist": {
							"value": 102
						},
						"total_off_2pmid_ast": {
							"value": 28
						},
						"total_off_3p_attempts": {
							"value": 765
						},
						"total_def_2p_attempts": {
							"value": 1133
						},
						"total_def_trans_2p_attempts": {
							"value": 157
						},
						"total_def_trans_2pmid_made": {
							"value": 14
						},
						"total_off_scramble_assist": {
							"value": 22
						},
						"total_def_trans_ftm": {
							"value": 78
						},
						"total_off_to": {
							"value": 352
						},
						"total_off_scramble_2pmid_attempts": {
							"value": 19
						},
						"total_off_foul": {
							"value": 463
						},
						"total_def_2p_ast": {
							"value": 0
						},
						"total_def_ast_rim": {
							"value": 151
						},
						"total_def_poss": {
							"value": 2081
						},
						"off_adj_ppp": {
							"value": 113.24062028551026
						},
						"total_def_trans_3p_attempts": {
							"value": 119
						},
						"total_def_trans_2prim_ast": {
							"value": 35
						},
						"total_def_trans_fta": {
							"value": 116
						},
						"total_def_scramble_fgm": {
							"value": 66
						},
						"total_off_2prim_attempts": {
							"value": 656
						},
						"total_def_scramble_fga": {
							"value": 142
						},
						"total_off_drb": {
							"value": 854
						},
						"total_off_scramble_fgm": {
							"value": 93
						},
						"total_def_scramble_2prim_made": {
							"value": 44
						},
						"total_off_scramble_fga": {
							"value": 184
						},
						"total_def_2prim_attempts": {
							"value": 582
						},
						"total_def_fta": {
							"value": 444
						},
						"total_off_scramble_2prim_attempts": {
							"value": 120
						},
						"total_def_trans_to": {
							"value": 77
						},
						"total_off_2p_made": {
							"value": 506
						},
						"total_def_trans_assist": {
							"value": 72
						},
						"total_def_3p_ast": {
							"value": 194
						},
						"total_off_2prim_made": {
							"value": 404
						},
						"total_off_trans_3p_ast": {
							"value": 36
						},
						"total_off_3p_ast": {
							"value": 202
						},
						"total_def_scramble_ftm": {
							"value": 38
						},
						"total_off_trans_fga": {
							"value": 316
						},
						"total_off_2prim_ast": {
							"value": 179
						},
						"total_def_ast_mid": {
							"value": 55
						},
						"total_off_scramble_3p_ast": {
							"value": 12
						},
						"total_off_trans_3p_attempts": {
							"value": 139
						},
						"total_off_ftm": {
							"value": 500
						},
						"total_def_scramble_2p_made": {
							"value": 51
						},
						"total_def_trans_2pmid_ast": {
							"value": 2
						},
						"off_adj_opp": {
							"value": 107.58303700144161
						},
						"total_off_blk": {
							"value": 134
						},
						"total_def_2pmid_attempts": {
							"value": 551
						},
						"total_def_scramble_2prim_ast": {
							"value": 3
						},
						"total_off_trans_fgm": {
							"value": 163
						},
						"total_def_ftm": {
							"value": 310
						},
						"total_off_trans_2prim_made": {
							"value": 110
						},
						"total_def_blk": {
							"value": 110
						},
						"total_off_scramble_2pmid_ast": {
							"value": 4
						},
						"total_off_trans_2prim_ast": {
							"value": 63
						},
						"total_off_fta": {
							"value": 669
						},
						"total_off_scramble_2prim_made": {
							"value": 74
						},
						"total_off_trans_2p_made": {
							"value": 120
						},
						"total_def_scramble_assist": {
							"value": 20
						},
						"total_off_assist": {
							"value": 409
						},
						"total_def_scramble_to": {
							"value": 25
						},
						"total_def_trans_2p_made": {
							"value": 83
						},
						"total_off_stl": {
							"value": 142
						},
						"total_def_trans_3p_ast": {
							"value": 35
						},
						"def_adj_ppp": {
							"value": 91.58495122584529
						},
						"total_off_ast_3p": {
							"value": 202
						},
						"total_off_scramble_ftm": {
							"value": 59
						},
						"total_def_2pmid_ast": {
							"value": 55
						},
						"total_off_ast_rim": {
							"value": 179
						},
						"total_def_assist": {
							"value": 400
						},
						"total_off_3p_made": {
							"value": 238
						},
						"total_def_scramble_2pmid_ast": {
							"value": 3
						},
						"total_off_scramble_3p_attempts": {
							"value": 45
						},
						"total_def_3p_made": {
							"value": 227
						},
						"total_def_stl": {
							"value": 170
						},
						"total_off_trans_2pmid_ast": {
							"value": 3
						},
						"total_def_scramble_fta": {
							"value": 64
						},
						"total_def_foul": {
							"value": 588
						},
						"total_off_scramble_2pmid_made": {
							"value": 6
						},
						"total_def_scramble_2pmid_made": {
							"value": 7
						},
						"total_off_scramble_3p_made": {
							"value": 13
						},
						"def_3p_opp": {
							"value": 32.98939828080229
						},
						"total_def_trans_fgm": {
							"value": 125
						},
						"total_off_scramble_fta": {
							"value": 87
						},
						"total_def_2pmid_made": {
							"value": 169
						},
						"total_off_poss": {
							"value": 2077
						},
						"duration_mins": {
							 "value": 1000
						},
						"total_def_scramble_3p_made": {
							"value": 15
						},
						"total_off_scramble_2prim_ast": {
							"value": 6
						},
						"total_def_scramble_2p_ast": {
							"value": 0
						},
						"total_off_trans_2p_attempts": {
							"value": 177
						},
						"total_off_2pmid_attempts": {
							"value": 353
						},
						"total_def_trans_fga": {
							"value": 276
						},
						"total_def_trans_2prim_made": {
							"value": 69
						},
						"total_off_trans_2pmid_made": {
							"value": 10
						},
						"total_off_scramble_2p_attempts": {
							"value": 139
						},
						"total_off_trans_2prim_attempts": {
							"value": 150
						},
						"total_def_fgm": {
							"value": 731
						},
						"total_off_scramble_2p_ast": {
							"value": 0
						},
						"total_def_trans_3p_made": {
							"value": 42
						},
						"total_def_fga": {
							"value": 1831
						},
						"total_def_2prim_ast": {
							"value": 151
						},
						"total_off_pts": {
							"value": 2226
						},
						"total_def_ast_3p": {
							"value": 194
						},
						"total_def_scramble_2prim_attempts": {
							"value": 83
						},
						"total_off_trans_3p_made": {
							"value": 43
						},
						"total_def_scramble_2pmid_attempts": {
							"value": 24
						},
						"total_off_scramble_to": {
							"value": 27
						},
						"def_adj_opp": {
							"value": 96.96167549350024
						},
						"total_def_to": {
							"value": 363
						},
						"total_def_pts": {
							"value": 1999
						},
						"total_off_orb": {
							"value": 349
						},
						"total_off_ast_mid": {
							"value": 28
						},
						"total_off_trans_2pmid_attempts": {
							"value": 27
						},
						"total_def_scramble_3p_ast": {
							"value": 14
						},
						"total_def_scramble_2p_attempts": {
							"value": 107
						},
						"total_def_orb": {
							"value": 304
						},
						"total_off_2p_ast": {
							"value": 0
						},
						"total_def_trans_2p_ast": {
							"value": 0
						},
						"total_off_2p_attempts": {
							"value": 1009
						},
						"total_def_trans_2pmid_attempts": {
							"value": 36
						},
						"total_def_3p_attempts": {
							"value": 698
						},
						"total_off_fgm": {
							"value": 744
						},
						"total_off_trans_fta": {
							"value": 212
						},
						"total_off_scramble_2p_made": {
							"value": 80
						},
						"total_def_trans_2prim_attempts": {
							"value": 121
						},
						"total_def_2prim_made": {
							"value": 335
						},
						"total_off_trans_ftm": {
							"value": 167
						},
						"total_off_trans_2p_ast": {
							"value": 0
						},
						"off_2p": {
							"value": 0.5014866204162537
						},
						"off_2p_ast": {
							"value": 0
						},
						"off_3p": {
							"value": 0.3111111111111111
						},
						"off_3p_ast": {
							"value": 0.8487394957983193
						},
						"off_2prim": {
							"value": 0.6158536585365854
						},
						"off_2prim_ast": {
							"value": 0.4430693069306931
						},
						"off_2pmid": {
							"value": 0.28895184135977336
						},
						"off_2pmid_ast": {
							"value": 0.27450980392156865
						},
						"off_ft": {
							"value": 0.7473841554559043
						},
						"off_ftr": {
							"value": 0.37711386696730553
						},
						"off_2primr": {
							"value": 0.3697857948139797
						},
						"off_2pmidr": {
							"value": 0.19898534385569336
						},
						"off_3pr": {
							"value": 0.43122886133032695
						},
						"off_assist": {
							"value": 0.5497311827956989
						},
						"off_scramble_2p": {
							"value": 0.5755395683453237
						},
						"off_scramble_2p_ast": {
							"value": 0
						},
						"off_scramble_3p": {
							"value": 0.28888888888888886
						},
						"off_scramble_3p_ast": {
							"value": 0.9230769230769231
						},
						"off_scramble_2prim": {
							"value": 0.6166666666666667
						},
						"off_scramble_2prim_ast": {
							"value": 0.08108108108108109
						},
						"off_scramble_2pmid": {
							"value": 0.3157894736842105
						},
						"off_scramble_2pmid_ast": {
							"value": 0.6666666666666666
						},
						"off_scramble_ft": {
							"value": 0.6781609195402298
						},
						"off_scramble_ftr": {
							"value": 0.47282608695652173
						},
						"off_scramble_2primr": {
							"value": 0.6521739130434783
						},
						"off_scramble_2pmidr": {
							"value": 0.10326086956521739
						},
						"off_scramble_3pr": {
							"value": 0.24456521739130435
						},
						"off_scramble_assist": {
							"value": 0.23655913978494625
						},
						"off_trans_2p": {
							"value": 0.6779661016949152
						},
						"off_trans_2p_ast": {
							"value": 0
						},
						"off_trans_3p": {
							"value": 0.30935251798561153
						},
						"off_trans_3p_ast": {
							"value": 0.8372093023255814
						},
						"off_trans_2prim": {
							"value": 0.7333333333333333
						},
						"off_trans_2prim_ast": {
							"value": 0.5727272727272728
						},
						"off_trans_2pmid": {
							"value": 0.37037037037037035
						},
						"off_trans_2pmid_ast": {
							"value": 0.3
						},
						"off_trans_ft": {
							"value": 0.7877358490566038
						},
						"off_trans_ftr": {
							"value": 0.6708860759493671
						},
						"off_trans_2primr": {
							"value": 0.47468354430379744
						},
						"off_trans_2pmidr": {
							"value": 0.08544303797468354
						},
						"off_trans_3pr": {
							"value": 0.439873417721519
						},
						"off_trans_assist": {
							"value": 0.6257668711656442
						},
						"off_ast_rim": {
							"value": 0.43765281173594134
						},
						"off_ast_mid": {
							"value": 0.06845965770171149
						},
						"off_ast_3p": {
							"value": 0.4938875305623472
						},
						"total_off_scramble_pts": {
							"value": 258
						},
						"total_off_scramble_poss": {
							"value": 223.91802325581395
						},
						"total_off_trans_pts": {
							"value": 536
						},
						"total_off_trans_poss": {
							"value": 499.7
						},
						"off_ppp": {
							"value": 107.1738083774675
						},
						"off_to": {
							"value": 0.16947520462205104
						},
						"off_scramble_ppp": {
							"value": 115.22073848662431
						},
						"off_scramble_to": {
							"value": 0.12057984260228126
						},
						"off_trans_ppp": {
							"value": 107.2643586151691
						},
						"off_trans_to": {
							"value": 0.16609965979587754
						},
						"off_poss": {
							"value": 2077
						},
						"off_orb": {
							"value": 0.31216457960644006
						},
						"off_efg": {
							"value": 0.48647125140924463
						},
						"off_scramble_efg": {
							"value": 0.5407608695652174
						},
						"off_trans_efg": {
							"value": 0.5838607594936709
						},
						"def_2p": {
							"value": 0.44483671668137686
						},
						"def_2p_ast": {
							"value": 0
						},
						"def_3p": {
							"value": 0.32521489971346706
						},
						"def_3p_ast": {
							"value": 0.8546255506607929
						},
						"def_2prim": {
							"value": 0.5756013745704467
						},
						"def_2prim_ast": {
							"value": 0.4507462686567164
						},
						"def_2pmid": {
							"value": 0.30671506352087113
						},
						"def_2pmid_ast": {
							"value": 0.3254437869822485
						},
						"def_ft": {
							"value": 0.6981981981981982
						},
						"def_ftr": {
							"value": 0.24249044238121245
						},
						"def_2primr": {
							"value": 0.3178590933915893
						},
						"def_2pmidr": {
							"value": 0.3009284543965046
						},
						"def_3pr": {
							"value": 0.3812124522119061
						},
						"def_assist": {
							"value": 0.5471956224350205
						},
						"def_scramble_2p": {
							"value": 0.4766355140186916
						},
						"def_scramble_2p_ast": {
							"value": 0
						},
						"def_scramble_3p": {
							"value": 0.42857142857142855
						},
						"def_scramble_3p_ast": {
							"value": 0.9333333333333333
						},
						"def_scramble_2prim": {
							"value": 0.5301204819277109
						},
						"def_scramble_2prim_ast": {
							"value": 0.06818181818181818
						},
						"def_scramble_2pmid": {
							"value": 0.2916666666666667
						},
						"def_scramble_2pmid_ast": {
							"value": 0.42857142857142855
						},
						"def_scramble_ft": {
							"value": 0.59375
						},
						"def_scramble_ftr": {
							"value": 0.4507042253521127
						},
						"def_scramble_2primr": {
							"value": 0.5845070422535211
						},
						"def_scramble_2pmidr": {
							"value": 0.16901408450704225
						},
						"def_scramble_3pr": {
							"value": 0.24647887323943662
						},
						"def_scramble_assist": {
							"value": 0.30303030303030304
						},
						"def_trans_2p": {
							"value": 0.5286624203821656
						},
						"def_trans_2p_ast": {
							"value": 0
						},
						"def_trans_3p": {
							"value": 0.35294117647058826
						},
						"def_trans_3p_ast": {
							"value": 0.8333333333333334
						},
						"def_trans_2prim": {
							"value": 0.5702479338842975
						},
						"def_trans_2prim_ast": {
							"value": 0.5072463768115942
						},
						"def_trans_2pmid": {
							"value": 0.3888888888888889
						},
						"def_trans_2pmid_ast": {
							"value": 0.14285714285714285
						},
						"def_trans_ft": {
							"value": 0.6724137931034483
						},
						"def_trans_ftr": {
							"value": 0.42028985507246375
						},
						"def_trans_2primr": {
							"value": 0.4384057971014493
						},
						"def_trans_2pmidr": {
							"value": 0.13043478260869565
						},
						"def_trans_3pr": {
							"value": 0.4311594202898551
						},
						"def_trans_assist": {
							"value": 0.576
						},
						"def_ast_rim": {
							"value": 0.3775
						},
						"def_ast_mid": {
							"value": 0.1375
						},
						"def_ast_3p": {
							"value": 0.485
						},
						"total_def_scramble_pts": {
							"value": 185
						},
						"total_def_scramble_poss": {
							"value": 177.4483592400691
						},
						"total_def_trans_pts": {
							"value": 370
						},
						"total_def_trans_poss": {
							"value": 408.1
						},
						"def_ppp": {
							"value": 96.05958673714561
						},
						"def_to": {
							"value": 0.17443536761172512
						},
						"def_scramble_ppp": {
							"value": 104.25568362101016
						},
						"def_scramble_to": {
							"value": 0.14088605894731104
						},
						"def_trans_ppp": {
							"value": 90.66405292820387
						},
						"def_trans_to": {
							"value": 0.18867924528301885
						},
						"def_poss": {
							"value": 2081
						},
						"def_orb": {
							"value": 0.26252158894645944
						},
						"def_efg": {
							"value": 0.4612233752048061
						},
						"def_scramble_efg": {
							"value": 0.5176056338028169
						},
						"def_trans_efg": {
							"value": 0.5289855072463768
						}
					},
					"off": {
						"doc_count": 192,
						"total_off_fga": {
							"value": 414
						},
						"total_def_scramble_3p_attempts": {
							"value": 9
						},
						"total_def_drb": {
							"value": 186
						},
						"total_off_2pmid_made": {
							"value": 20
						},
						"total_def_2p_made": {
							"value": 114
						},
						"total_off_trans_to": {
							"value": 17
						},
						"total_off_trans_assist": {
							"value": 23
						},
						"total_off_2pmid_ast": {
							"value": 6
						},
						"total_off_3p_attempts": {
							"value": 183
						},
						"total_def_2p_attempts": {
							"value": 265
						},
						"total_def_trans_2p_attempts": {
							"value": 31
						},
						"total_def_trans_2pmid_made": {
							"value": 4
						},
						"total_off_scramble_assist": {
							"value": 11
						},
						"total_def_trans_ftm": {
							"value": 19
						},
						"total_off_to": {
							"value": 78
						},
						"total_off_scramble_2pmid_attempts": {
							"value": 8
						},
						"total_off_foul": {
							"value": 119
						},
						"total_def_2p_ast": {
							"value": 0
						},
						"total_def_ast_rim": {
							"value": 39
						},
						"total_def_poss": {
							"value": 489
						},
						"off_adj_ppp": {
							"value": 106.5947911981385
						},
						"total_def_trans_3p_attempts": {
							"value": 18
						},
						"total_def_trans_2prim_ast": {
							"value": 5
						},
						"total_def_trans_fta": {
							"value": 27
						},
						"total_def_scramble_fgm": {
							"value": 18
						},
						"total_off_2prim_attempts": {
							"value": 155
						},
						"total_def_scramble_fga": {
							"value": 37
						},
						"total_off_drb": {
							"value": 189
						},
						"total_off_scramble_fgm": {
							"value": 27
						},
						"total_def_scramble_2prim_made": {
							"value": 11
						},
						"total_off_scramble_fga": {
							"value": 52
						},
						"total_def_2prim_attempts": {
							"value": 140
						},
						"total_def_fta": {
							"value": 99
						},
						"total_off_scramble_2prim_attempts": {
							"value": 31
						},
						"total_def_trans_to": {
							"value": 21
						},
						"total_off_2p_made": {
							"value": 108
						},
						"total_def_trans_assist": {
							"value": 14
						},
						"total_def_3p_ast": {
							"value": 49
						},
						"total_off_2prim_made": {
							"value": 88
						},
						"total_off_trans_3p_ast": {
							"value": 10
						},
						"total_off_3p_ast": {
							"value": 48
						},
						"total_def_scramble_ftm": {
							"value": 5
						},
						"total_off_trans_fga": {
							"value": 76
						},
						"total_off_2prim_ast": {
							"value": 35
						},
						"total_def_ast_mid": {
							"value": 11
						},
						"total_off_scramble_3p_ast": {
							"value": 6
						},
						"total_off_trans_3p_attempts": {
							"value": 35
						},
						"total_off_ftm": {
							"value": 118
						},
						"total_def_scramble_2p_made": {
							"value": 13
						},
						"total_def_trans_2pmid_ast": {
							"value": 2
						},
						"off_adj_opp": {
							"value": 105.45848670756645
						},
						"total_off_blk": {
							"value": 35
						},
						"total_def_2pmid_attempts": {
							"value": 125
						},
						"total_def_scramble_2prim_ast": {
							"value": 2
						},
						"total_off_trans_fgm": {
							"value": 38
						},
						"total_def_ftm": {
							"value": 72
						},
						"total_off_trans_2prim_made": {
							"value": 24
						},
						"total_def_blk": {
							"value": 32
						},
						"total_off_scramble_2pmid_ast": {
							"value": 3
						},
						"total_off_trans_2prim_ast": {
							"value": 12
						},
						"total_off_fta": {
							"value": 161
						},
						"total_off_scramble_2prim_made": {
							"value": 17
						},
						"total_off_trans_2p_made": {
							"value": 27
						},
						"total_def_scramble_assist": {
							"value": 7
						},
						"total_off_assist": {
							"value": 89
						},
						"total_def_scramble_to": {
							"value": 7
						},
						"total_def_trans_2p_made": {
							"value": 16
						},
						"total_off_stl": {
							"value": 29
						},
						"total_def_trans_3p_ast": {
							"value": 7
						},
						"def_adj_ppp": {
							"value": 96.05408370346916
						},
						"total_off_ast_3p": {
							"value": 48
						},
						"total_off_scramble_ftm": {
							"value": 6
						},
						"total_def_2pmid_ast": {
							"value": 11
						},
						"total_off_ast_rim": {
							"value": 35
						},
						"total_def_assist": {
							"value": 99
						},
						"total_off_3p_made": {
							"value": 52
						},
						"total_def_scramble_2pmid_ast": {
							"value": 1
						},
						"total_off_scramble_3p_attempts": {
							"value": 13
						},
						"total_def_3p_made": {
							"value": 60
						},
						"total_def_stl": {
							"value": 32
						},
						"total_off_trans_2pmid_ast": {
							"value": 1
						},
						"total_def_scramble_fta": {
							"value": 7
						},
						"total_def_foul": {
							"value": 130
						},
						"total_off_scramble_2pmid_made": {
							"value": 4
						},
						"total_def_scramble_2pmid_made": {
							"value": 2
						},
						"total_off_scramble_3p_made": {
							"value": 6
						},
						"def_3p_opp": {
							"value": 32.25421686746988
						},
						"total_def_trans_fgm": {
							"value": 26
						},
						"total_off_scramble_fta": {
							"value": 16
						},
						"total_def_2pmid_made": {
							"value": 34
						},
						"total_off_poss": {
							"value": 475
						},
						"duration_mins": {
							 "value": 250
						},
						"total_def_scramble_3p_made": {
							"value": 5
						},
						"total_off_scramble_2prim_ast": {
							"value": 2
						},
						"total_def_scramble_2p_ast": {
							"value": 0
						},
						"total_off_trans_2p_attempts": {
							"value": 41
						},
						"total_off_2pmid_attempts": {
							"value": 76
						},
						"total_def_trans_fga": {
							"value": 49
						},
						"total_def_trans_2prim_made": {
							"value": 12
						},
						"total_off_trans_2pmid_made": {
							"value": 3
						},
						"total_off_scramble_2p_attempts": {
							"value": 39
						},
						"total_off_trans_2prim_attempts": {
							"value": 34
						},
						"total_def_fgm": {
							"value": 174
						},
						"total_off_scramble_2p_ast": {
							"value": 0
						},
						"total_def_trans_3p_made": {
							"value": 10
						},
						"total_def_fga": {
							"value": 431
						},
						"total_def_2prim_ast": {
							"value": 39
						},
						"total_off_pts": {
							"value": 490
						},
						"total_def_ast_3p": {
							"value": 49
						},
						"total_def_scramble_2prim_attempts": {
							"value": 22
						},
						"total_off_trans_3p_made": {
							"value": 11
						},
						"total_def_scramble_2pmid_attempts": {
							"value": 6
						},
						"total_off_scramble_to": {
							"value": 5
						},
						"def_adj_opp": {
							"value": 99.076
						},
						"total_def_to": {
							"value": 90
						},
						"total_def_pts": {
							"value": 480
						},
						"total_off_orb": {
							"value": 88
						},
						"total_off_ast_mid": {
							"value": 6
						},
						"total_off_trans_2pmid_attempts": {
							"value": 7
						},
						"total_def_scramble_3p_ast": {
							"value": 4
						},
						"total_def_scramble_2p_attempts": {
							"value": 28
						},
						"total_def_orb": {
							"value": 79
						},
						"total_off_2p_ast": {
							"value": 0
						},
						"total_def_trans_2p_ast": {
							"value": 0
						},
						"total_off_2p_attempts": {
							"value": 231
						},
						"total_def_trans_2pmid_attempts": {
							"value": 9
						},
						"total_def_3p_attempts": {
							"value": 166
						},
						"total_off_fgm": {
							"value": 160
						},
						"total_off_trans_fta": {
							"value": 47
						},
						"total_off_scramble_2p_made": {
							"value": 21
						},
						"total_def_trans_2prim_attempts": {
							"value": 22
						},
						"total_def_2prim_made": {
							"value": 80
						},
						"total_off_trans_ftm": {
							"value": 38
						},
						"total_off_trans_2p_ast": {
							"value": 0
						},
						"off_2p": {
							"value": 0.4675324675324675
						},
						"off_2p_ast": {
							"value": 0
						},
						"off_3p": {
							"value": 0.28415300546448086
						},
						"off_3p_ast": {
							"value": 0.9230769230769231
						},
						"off_2prim": {
							"value": 0.567741935483871
						},
						"off_2prim_ast": {
							"value": 0.3977272727272727
						},
						"off_2pmid": {
							"value": 0.2631578947368421
						},
						"off_2pmid_ast": {
							"value": 0.3
						},
						"off_ft": {
							"value": 0.7329192546583851
						},
						"off_ftr": {
							"value": 0.3888888888888889
						},
						"off_2primr": {
							"value": 0.3743961352657005
						},
						"off_2pmidr": {
							"value": 0.18357487922705315
						},
						"off_3pr": {
							"value": 0.4420289855072464
						},
						"off_assist": {
							"value": 0.55625
						},
						"off_scramble_2p": {
							"value": 0.5384615384615384
						},
						"off_scramble_2p_ast": {
							"value": 0
						},
						"off_scramble_3p": {
							"value": 0.46153846153846156
						},
						"off_scramble_3p_ast": {
							"value": 1
						},
						"off_scramble_2prim": {
							"value": 0.5483870967741935
						},
						"off_scramble_2prim_ast": {
							"value": 0.11764705882352941
						},
						"off_scramble_2pmid": {
							"value": 0.5
						},
						"off_scramble_2pmid_ast": {
							"value": 0.75
						},
						"off_scramble_ft": {
							"value": 0.375
						},
						"off_scramble_ftr": {
							"value": 0.3076923076923077
						},
						"off_scramble_2primr": {
							"value": 0.5961538461538461
						},
						"off_scramble_2pmidr": {
							"value": 0.15384615384615385
						},
						"off_scramble_3pr": {
							"value": 0.25
						},
						"off_scramble_assist": {
							"value": 0.4074074074074074
						},
						"off_trans_2p": {
							"value": 0.6585365853658537
						},
						"off_trans_2p_ast": {
							"value": 0
						},
						"off_trans_3p": {
							"value": 0.3142857142857143
						},
						"off_trans_3p_ast": {
							"value": 0.9090909090909091
						},
						"off_trans_2prim": {
							"value": 0.7058823529411765
						},
						"off_trans_2prim_ast": {
							"value": 0.5
						},
						"off_trans_2pmid": {
							"value": 0.42857142857142855
						},
						"off_trans_2pmid_ast": {
							"value": 0.3333333333333333
						},
						"off_trans_ft": {
							"value": 0.8085106382978723
						},
						"off_trans_ftr": {
							"value": 0.618421052631579
						},
						"off_trans_2primr": {
							"value": 0.4473684210526316
						},
						"off_trans_2pmidr": {
							"value": 0.09210526315789473
						},
						"off_trans_3pr": {
							"value": 0.4605263157894737
						},
						"off_trans_assist": {
							"value": 0.6052631578947368
						},
						"off_ast_rim": {
							"value": 0.39325842696629215
						},
						"off_ast_mid": {
							"value": 0.06741573033707865
						},
						"off_ast_3p": {
							"value": 0.5393258426966292
						},
						"total_off_scramble_pts": {
							"value": 66
						},
						"total_off_scramble_poss": {
							"value": 56.57080291970803
						},
						"total_off_trans_pts": {
							"value": 125
						},
						"total_off_trans_poss": {
							"value": 115.325
						},
						"off_ppp": {
							"value": 103.15789473684211
						},
						"off_to": {
							"value": 0.16421052631578947
						},
						"off_scramble_ppp": {
							"value": 116.66795695594952
						},
						"off_scramble_to": {
							"value": 0.08838481587571934
						},
						"off_trans_ppp": {
							"value": 108.38933448948623
						},
						"off_trans_to": {
							"value": 0.14740949490570127
						},
						"off_poss": {
							"value": 475
						},
						"off_orb": {
							"value": 0.32116788321167883
						},
						"off_efg": {
							"value": 0.4492753623188406
						},
						"off_scramble_efg": {
							"value": 0.5769230769230769
						},
						"off_trans_efg": {
							"value": 0.5723684210526315
						},
						"def_2p": {
							"value": 0.43018867924528303
						},
						"def_2p_ast": {
							"value": 0
						},
						"def_3p": {
							"value": 0.3614457831325301
						},
						"def_3p_ast": {
							"value": 0.8166666666666667
						},
						"def_2prim": {
							"value": 0.5714285714285714
						},
						"def_2prim_ast": {
							"value": 0.4875
						},
						"def_2pmid": {
							"value": 0.272
						},
						"def_2pmid_ast": {
							"value": 0.3235294117647059
						},
						"def_ft": {
							"value": 0.7272727272727273
						},
						"def_ftr": {
							"value": 0.2296983758700696
						},
						"def_2primr": {
							"value": 0.3248259860788863
						},
						"def_2pmidr": {
							"value": 0.2900232018561485
						},
						"def_3pr": {
							"value": 0.3851508120649652
						},
						"def_assist": {
							"value": 0.5689655172413793
						},
						"def_scramble_2p": {
							"value": 0.4642857142857143
						},
						"def_scramble_2p_ast": {
							"value": 0
						},
						"def_scramble_3p": {
							"value": 0.5555555555555556
						},
						"def_scramble_3p_ast": {
							"value": 0.8
						},
						"def_scramble_2prim": {
							"value": 0.5
						},
						"def_scramble_2prim_ast": {
							"value": 0.18181818181818182
						},
						"def_scramble_2pmid": {
							"value": 0.3333333333333333
						},
						"def_scramble_2pmid_ast": {
							"value": 0.5
						},
						"def_scramble_ft": {
							"value": 0.7142857142857143
						},
						"def_scramble_ftr": {
							"value": 0.1891891891891892
						},
						"def_scramble_2primr": {
							"value": 0.5945945945945946
						},
						"def_scramble_2pmidr": {
							"value": 0.16216216216216217
						},
						"def_scramble_3pr": {
							"value": 0.24324324324324326
						},
						"def_scramble_assist": {
							"value": 0.3888888888888889
						},
						"def_trans_2p": {
							"value": 0.5161290322580645
						},
						"def_trans_2p_ast": {
							"value": 0
						},
						"def_trans_3p": {
							"value": 0.5555555555555556
						},
						"def_trans_3p_ast": {
							"value": 0.7
						},
						"def_trans_2prim": {
							"value": 0.5454545454545454
						},
						"def_trans_2prim_ast": {
							"value": 0.4166666666666667
						},
						"def_trans_2pmid": {
							"value": 0.4444444444444444
						},
						"def_trans_2pmid_ast": {
							"value": 0.5
						},
						"def_trans_ft": {
							"value": 0.7037037037037037
						},
						"def_trans_ftr": {
							"value": 0.5510204081632653
						},
						"def_trans_2primr": {
							"value": 0.4489795918367347
						},
						"def_trans_2pmidr": {
							"value": 0.1836734693877551
						},
						"def_trans_3pr": {
							"value": 0.3673469387755102
						},
						"def_trans_assist": {
							"value": 0.5384615384615384
						},
						"def_ast_rim": {
							"value": 0.3939393939393939
						},
						"def_ast_mid": {
							"value": 0.1111111111111111
						},
						"def_ast_3p": {
							"value": 0.494949494949495
						},
						"total_def_scramble_pts": {
							"value": 46
						},
						"total_def_scramble_poss": {
							"value": 41.72425373134328
						},
						"total_def_trans_pts": {
							"value": 81
						},
						"total_def_trans_poss": {
							"value": 82.825
						},
						"def_ppp": {
							"value": 98.15950920245399
						},
						"def_to": {
							"value": 0.18404907975460122
						},
						"def_scramble_ppp": {
							"value": 110.24762790531295
						},
						"def_scramble_to": {
							"value": 0.16776812942112843
						},
						"def_trans_ppp": {
							"value": 97.79655900996076
						},
						"def_trans_to": {
							"value": 0.25354663447026865
						},
						"def_poss": {
							"value": 489
						},
						"def_orb": {
							"value": 0.2947761194029851
						},
						"def_efg": {
							"value": 0.4733178654292343
						},
						"def_scramble_efg": {
							"value": 0.5540540540540541
						},
						"def_trans_efg": {
							"value": 0.6326530612244898
						}
					},
					"on": {
						"doc_count": 402,
						"total_off_fga": {
							"value": 1360
						},
						"total_def_scramble_3p_attempts": {
							"value": 26
						},
						"total_def_drb": {
							"value": 583
						},
						"total_off_2pmid_made": {
							"value": 82
						},
						"total_def_2p_made": {
							"value": 390
						},
						"total_off_trans_to": {
							"value": 66
						},
						"total_off_trans_assist": {
							"value": 79
						},
						"total_off_2pmid_ast": {
							"value": 22
						},
						"total_off_3p_attempts": {
							"value": 582
						},
						"total_def_2p_attempts": {
							"value": 868
						},
						"total_def_trans_2p_attempts": {
							"value": 126
						},
						"total_def_trans_2pmid_made": {
							"value": 10
						},
						"total_off_scramble_assist": {
							"value": 11
						},
						"total_def_trans_ftm": {
							"value": 59
						},
						"total_off_to": {
							"value": 274
						},
						"total_off_scramble_2pmid_attempts": {
							"value": 11
						},
						"total_off_foul": {
							"value": 344
						},
						"total_def_2p_ast": {
							"value": 0
						},
						"total_def_ast_rim": {
							"value": 112
						},
						"total_def_poss": {
							"value": 1592
						},
						"off_adj_ppp": {
							"value": 115.21113764911924
						},
						"total_def_trans_3p_attempts": {
							"value": 101
						},
						"total_def_trans_2prim_ast": {
							"value": 30
						},
						"total_def_trans_fta": {
							"value": 89
						},
						"total_def_scramble_fgm": {
							"value": 48
						},
						"total_off_2prim_attempts": {
							"value": 501
						},
						"total_def_scramble_fga": {
							"value": 105
						},
						"total_off_drb": {
							"value": 665
						},
						"total_off_scramble_fgm": {
							"value": 66
						},
						"total_def_scramble_2prim_made": {
							"value": 33
						},
						"total_off_scramble_fga": {
							"value": 132
						},
						"total_def_2prim_attempts": {
							"value": 442
						},
						"total_def_fta": {
							"value": 345
						},
						"total_off_scramble_2prim_attempts": {
							"value": 89
						},
						"total_def_trans_to": {
							"value": 56
						},
						"total_off_2p_made": {
							"value": 398
						},
						"total_def_trans_assist": {
							"value": 58
						},
						"total_def_3p_ast": {
							"value": 145
						},
						"total_off_2prim_made": {
							"value": 316
						},
						"total_off_trans_3p_ast": {
							"value": 26
						},
						"total_off_3p_ast": {
							"value": 154
						},
						"total_def_scramble_ftm": {
							"value": 33
						},
						"total_off_trans_fga": {
							"value": 240
						},
						"total_off_2prim_ast": {
							"value": 144
						},
						"total_def_ast_mid": {
							"value": 44
						},
						"total_off_scramble_3p_ast": {
							"value": 6
						},
						"total_off_trans_3p_attempts": {
							"value": 104
						},
						"total_off_ftm": {
							"value": 382
						},
						"total_def_scramble_2p_made": {
							"value": 38
						},
						"total_def_trans_2pmid_ast": {
							"value": 0
						},
						"off_adj_opp": {
							"value": 108.23561557788945
						},
						"total_off_blk": {
							"value": 99
						},
						"total_def_2pmid_attempts": {
							"value": 426
						},
						"total_def_scramble_2prim_ast": {
							"value": 1
						},
						"total_off_trans_fgm": {
							"value": 125
						},
						"total_def_ftm": {
							"value": 238
						},
						"total_off_trans_2prim_made": {
							"value": 86
						},
						"total_def_blk": {
							"value": 78
						},
						"total_off_scramble_2pmid_ast": {
							"value": 1
						},
						"total_off_trans_2prim_ast": {
							"value": 51
						},
						"total_off_fta": {
							"value": 508
						},
						"total_off_scramble_2prim_made": {
							"value": 57
						},
						"total_off_trans_2p_made": {
							"value": 93
						},
						"total_def_scramble_assist": {
							"value": 13
						},
						"total_off_assist": {
							"value": 320
						},
						"total_def_scramble_to": {
							"value": 18
						},
						"total_def_trans_2p_made": {
							"value": 67
						},
						"total_off_stl": {
							"value": 113
						},
						"total_def_trans_3p_ast": {
							"value": 28
						},
						"def_adj_ppp": {
							"value": 90.212208900746
						},
						"total_off_ast_3p": {
							"value": 154
						},
						"total_off_scramble_ftm": {
							"value": 53
						},
						"total_def_2pmid_ast": {
							"value": 44
						},
						"total_off_ast_rim": {
							"value": 144
						},
						"total_def_assist": {
							"value": 301
						},
						"total_off_3p_made": {
							"value": 186
						},
						"total_def_scramble_2pmid_ast": {
							"value": 2
						},
						"total_off_scramble_3p_attempts": {
							"value": 32
						},
						"total_def_3p_made": {
							"value": 167
						},
						"total_def_stl": {
							"value": 138
						},
						"total_off_trans_2pmid_ast": {
							"value": 2
						},
						"total_def_scramble_fta": {
							"value": 57
						},
						"total_def_foul": {
							"value": 458
						},
						"total_off_scramble_2pmid_made": {
							"value": 2
						},
						"total_def_scramble_2pmid_made": {
							"value": 5
						},
						"total_off_scramble_3p_made": {
							"value": 7
						},
						"def_3p_opp": {
							"value": 33.2187969924812
						},
						"total_def_trans_fgm": {
							"value": 99
						},
						"total_off_scramble_fta": {
							"value": 71
						},
						"total_def_2pmid_made": {
							"value": 135
						},
						"total_off_poss": {
							"value": 1602
						},
						"duration_mins": {
							 "value": 800
						},
						"total_def_scramble_3p_made": {
							"value": 10
						},
						"total_off_scramble_2prim_ast": {
							"value": 4
						},
						"total_def_scramble_2p_ast": {
							"value": 0
						},
						"total_off_trans_2p_attempts": {
							"value": 136
						},
						"total_off_2pmid_attempts": {
							"value": 277
						},
						"total_def_trans_fga": {
							"value": 227
						},
						"total_def_trans_2prim_made": {
							"value": 57
						},
						"total_off_trans_2pmid_made": {
							"value": 7
						},
						"total_off_scramble_2p_attempts": {
							"value": 100
						},
						"total_off_trans_2prim_attempts": {
							"value": 116
						},
						"total_def_fgm": {
							"value": 557
						},
						"total_off_scramble_2p_ast": {
							"value": 0
						},
						"total_def_trans_3p_made": {
							"value": 32
						},
						"total_def_fga": {
							"value": 1400
						},
						"total_def_2prim_ast": {
							"value": 112
						},
						"total_off_pts": {
							"value": 1736
						},
						"total_def_ast_3p": {
							"value": 145
						},
						"total_def_scramble_2prim_attempts": {
							"value": 61
						},
						"total_off_trans_3p_made": {
							"value": 32
						},
						"total_def_scramble_2pmid_attempts": {
							"value": 18
						},
						"total_off_scramble_to": {
							"value": 22
						},
						"def_adj_opp": {
							"value": 96.33476903870161
						},
						"total_def_to": {
							"value": 273
						},
						"total_def_pts": {
							"value": 1519
						},
						"total_off_orb": {
							"value": 261
						},
						"total_off_ast_mid": {
							"value": 22
						},
						"total_off_trans_2pmid_attempts": {
							"value": 20
						},
						"total_def_scramble_3p_ast": {
							"value": 10
						},
						"total_def_scramble_2p_attempts": {
							"value": 79
						},
						"total_def_orb": {
							"value": 225
						},
						"total_off_2p_ast": {
							"value": 0
						},
						"total_def_trans_2p_ast": {
							"value": 0
						},
						"total_off_2p_attempts": {
							"value": 778
						},
						"total_def_trans_2pmid_attempts": {
							"value": 27
						},
						"total_def_3p_attempts": {
							"value": 532
						},
						"total_off_fgm": {
							"value": 584
						},
						"total_off_trans_fta": {
							"value": 165
						},
						"total_off_scramble_2p_made": {
							"value": 59
						},
						"total_def_trans_2prim_attempts": {
							"value": 99
						},
						"total_def_2prim_made": {
							"value": 255
						},
						"total_off_trans_ftm": {
							"value": 129
						},
						"total_off_trans_2p_ast": {
							"value": 0
						},
						"off_2p": {
							"value": 0.5115681233933161
						},
						"off_2p_ast": {
							"value": 0
						},
						"off_3p": {
							"value": 0.31958762886597936
						},
						"off_3p_ast": {
							"value": 0.8279569892473119
						},
						"off_2prim": {
							"value": 0.6307385229540918
						},
						"off_2prim_ast": {
							"value": 0.45569620253164556
						},
						"off_2pmid": {
							"value": 0.296028880866426
						},
						"off_2pmid_ast": {
							"value": 0.2682926829268293
						},
						"off_ft": {
							"value": 0.7519685039370079
						},
						"off_ftr": {
							"value": 0.3735294117647059
						},
						"off_2primr": {
							"value": 0.3683823529411765
						},
						"off_2pmidr": {
							"value": 0.2036764705882353
						},
						"off_3pr": {
							"value": 0.4279411764705882
						},
						"off_assist": {
							"value": 0.547945205479452
						},
						"off_scramble_2p": {
							"value": 0.59
						},
						"off_scramble_2p_ast": {
							"value": 0
						},
						"off_scramble_3p": {
							"value": 0.21875
						},
						"off_scramble_3p_ast": {
							"value": 0.8571428571428571
						},
						"off_scramble_2prim": {
							"value": 0.6404494382022472
						},
						"off_scramble_2prim_ast": {
							"value": 0.07017543859649122
						},
						"off_scramble_2pmid": {
							"value": 0.18181818181818182
						},
						"off_scramble_2pmid_ast": {
							"value": 0.5
						},
						"off_scramble_ft": {
							"value": 0.7464788732394366
						},
						"off_scramble_ftr": {
							"value": 0.5378787878787878
						},
						"off_scramble_2primr": {
							"value": 0.6742424242424242
						},
						"off_scramble_2pmidr": {
							"value": 0.08333333333333333
						},
						"off_scramble_3pr": {
							"value": 0.24242424242424243
						},
						"off_scramble_assist": {
							"value": 0.16666666666666666
						},
						"off_trans_2p": {
							"value": 0.6838235294117647
						},
						"off_trans_2p_ast": {
							"value": 0
						},
						"off_trans_3p": {
							"value": 0.3076923076923077
						},
						"off_trans_3p_ast": {
							"value": 0.8125
						},
						"off_trans_2prim": {
							"value": 0.7413793103448276
						},
						"off_trans_2prim_ast": {
							"value": 0.5930232558139535
						},
						"off_trans_2pmid": {
							"value": 0.35
						},
						"off_trans_2pmid_ast": {
							"value": 0.2857142857142857
						},
						"off_trans_ft": {
							"value": 0.7818181818181819
						},
						"off_trans_ftr": {
							"value": 0.6875
						},
						"off_trans_2primr": {
							"value": 0.48333333333333334
						},
						"off_trans_2pmidr": {
							"value": 0.08333333333333333
						},
						"off_trans_3pr": {
							"value": 0.43333333333333335
						},
						"off_trans_assist": {
							"value": 0.632
						},
						"off_ast_rim": {
							"value": 0.45
						},
						"off_ast_mid": {
							"value": 0.06875
						},
						"off_ast_3p": {
							"value": 0.48125
						},
						"total_off_scramble_pts": {
							"value": 192
						},
						"total_off_scramble_poss": {
							"value": 167.31504739336492
						},
						"total_off_trans_pts": {
							"value": 411
						},
						"total_off_trans_poss": {
							"value": 384.375
						},
						"off_ppp": {
							"value": 108.3645443196005
						},
						"off_to": {
							"value": 0.17103620474406991
						},
						"off_scramble_ppp": {
							"value": 114.7535759581741
						},
						"off_scramble_to": {
							"value": 0.13148847245207448
						},
						"off_trans_ppp": {
							"value": 106.92682926829268
						},
						"off_trans_to": {
							"value": 0.17170731707317075
						},
						"off_poss": {
							"value": 1602
						},
						"off_orb": {
							"value": 0.30924170616113744
						},
						"off_efg": {
							"value": 0.49779411764705883
						},
						"off_scramble_efg": {
							"value": 0.5265151515151515
						},
						"off_trans_efg": {
							"value": 0.5875
						},
						"def_2p": {
							"value": 0.44930875576036866
						},
						"def_2p_ast": {
							"value": 0
						},
						"def_3p": {
							"value": 0.31390977443609025
						},
						"def_3p_ast": {
							"value": 0.8682634730538922
						},
						"def_2prim": {
							"value": 0.5769230769230769
						},
						"def_2prim_ast": {
							"value": 0.4392156862745098
						},
						"def_2pmid": {
							"value": 0.31690140845070425
						},
						"def_2pmid_ast": {
							"value": 0.32592592592592595
						},
						"def_ft": {
							"value": 0.6898550724637681
						},
						"def_ftr": {
							"value": 0.24642857142857144
						},
						"def_2primr": {
							"value": 0.3157142857142857
						},
						"def_2pmidr": {
							"value": 0.30428571428571427
						},
						"def_3pr": {
							"value": 0.38
						},
						"def_assist": {
							"value": 0.5403949730700179
						},
						"def_scramble_2p": {
							"value": 0.4810126582278481
						},
						"def_scramble_2p_ast": {
							"value": 0
						},
						"def_scramble_3p": {
							"value": 0.38461538461538464
						},
						"def_scramble_3p_ast": {
							"value": 1
						},
						"def_scramble_2prim": {
							"value": 0.5409836065573771
						},
						"def_scramble_2prim_ast": {
							"value": 0.030303030303030304
						},
						"def_scramble_2pmid": {
							"value": 0.2777777777777778
						},
						"def_scramble_2pmid_ast": {
							"value": 0.4
						},
						"def_scramble_ft": {
							"value": 0.5789473684210527
						},
						"def_scramble_ftr": {
							"value": 0.5428571428571428
						},
						"def_scramble_2primr": {
							"value": 0.580952380952381
						},
						"def_scramble_2pmidr": {
							"value": 0.17142857142857143
						},
						"def_scramble_3pr": {
							"value": 0.24761904761904763
						},
						"def_scramble_assist": {
							"value": 0.2708333333333333
						},
						"def_trans_2p": {
							"value": 0.5317460317460317
						},
						"def_trans_2p_ast": {
							"value": 0
						},
						"def_trans_3p": {
							"value": 0.31683168316831684
						},
						"def_trans_3p_ast": {
							"value": 0.875
						},
						"def_trans_2prim": {
							"value": 0.5757575757575758
						},
						"def_trans_2prim_ast": {
							"value": 0.5263157894736842
						},
						"def_trans_2pmid": {
							"value": 0.37037037037037035
						},
						"def_trans_2pmid_ast": {
							"value": 0
						},
						"def_trans_ft": {
							"value": 0.6629213483146067
						},
						"def_trans_ftr": {
							"value": 0.3920704845814978
						},
						"def_trans_2primr": {
							"value": 0.43612334801762115
						},
						"def_trans_2pmidr": {
							"value": 0.11894273127753303
						},
						"def_trans_3pr": {
							"value": 0.44493392070484583
						},
						"def_trans_assist": {
							"value": 0.5858585858585859
						},
						"def_ast_rim": {
							"value": 0.37209302325581395
						},
						"def_ast_mid": {
							"value": 0.1461794019933555
						},
						"def_ast_3p": {
							"value": 0.48172757475083056
						},
						"total_def_scramble_pts": {
							"value": 139
						},
						"total_def_scramble_poss": {
							"value": 135.66488764044942
						},
						"total_def_trans_pts": {
							"value": 289
						},
						"total_def_trans_poss": {
							"value": 325.275
						},
						"def_ppp": {
							"value": 95.41457286432161
						},
						"def_to": {
							"value": 0.17148241206030151
						},
						"def_scramble_ppp": {
							"value": 102.45834601535924
						},
						"def_scramble_to": {
							"value": 0.13267987253787528
						},
						"def_trans_ppp": {
							"value": 88.84789793251865
						},
						"def_trans_to": {
							"value": 0.17216201675505344
						},
						"def_poss": {
							"value": 1592
						},
						"def_orb": {
							"value": 0.25280898876404495
						},
						"def_efg": {
							"value": 0.4575
						},
						"def_scramble_efg": {
							"value": 0.5047619047619047
						},
						"def_trans_efg": {
							"value": 0.5066079295154186
						}
					}
				}
			},
			"global": {
				"doc_count": 10011,
				"only": {
					"buckets": {
						"team": {
							"doc_count": 594,
							"def_3p_opp": {
								"value": 32.98939828080229
							},
							"total_def_3p_attempts": {
								"value": 698
							},
							"total_def_poss": {
								"value": 2081
							},
							"total_def_3p_made": {
								"value": 227
							},
							"total_off_3p_attempts": {
								"value": 765
							},
							"def_3p": {
								"value": 0.32521489971346706
							},
							"def_poss": {
								"value": 2081
							}
						}
					}
				}
			}
		},
		"status": 200
	}]
};

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

export const sampleTeamStatsResponseOld =
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
