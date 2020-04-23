export const samplePlayerStatsResponse =
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
         "buckets": {
            "baseline": {
               "doc_count": 2770,
               "player": {
                  "doc_count_error_upper_bound": 0,
                  "sum_other_doc_count": 0,
                  "buckets": [
                     {
                        "key": "Cowan, Anthony",
                        "doc_count": 470,
                        "total_off_fga": {
                           "value": 351
                        },
                        "team_total_off_fga": {
                           "value": 1529
                        },
                        "oppo_total_def_2p_attempts": {
                           "value": 975
                        },
                        "total_off_2pmid_made": {
                           "value": 46
                        },
                        "total_off_2pmid_attempts": {
                           "value": 107
                        },
                        "team_total_off_fgm": {
                           "value": 634
                        },
                        "total_off_3p_attempts": {
                           "value": 171
                        },
                        "total_off_2p_made": {
                           "value": 83
                        },
                        "total_off_assist": {
                           "value": 144
                        },
                        "total_off_pts": {
                           "value": 0
                        },
                        "team_total_off_pts": {
                           "value": 1904
                        },
                        "total_off_2prim_made": {
                           "value": 37
                        },
                        "total_off_stl": {
                           "value": 30
                        },
                        "team_total_off_assist": {
                           "value": 354
                        },
                        "def_adj_opp": {
                           "value": 96.52304643261608
                        },
                        "total_off_orb": {
                           "value": 17
                        },
                        "total_off_ftm": {
                           "value": 166
                        },
                        "team_total_off_orb": {
                           "value": 306
                        },
                        "team_total_off_ftm": {
                           "value": 426
                        },
                        "off_adj_opp": {
                           "value": 108.0781993204983
                        },
                        "total_off_blk": {
                           "value": 5
                        },
                        "oppo_total_def_orb": {
                           "value": 266
                        },
                        "total_off_to": {
                           "value": 69
                        },
                        "total_off_foul": {
                           "value": 62
                        },
                        "total_off_3p_made": {
                           "value": 55
                        },
                        "oppo_total_def_drb": {
                           "value": 665
                        },
                        "total_off_2p_attempts": {
                           "value": 180
                        },
                        "team_total_off_to": {
                           "value": 298
                        },
                        "off_poss": {
                           "value": 444.6345238095238
                        },
                        "total_off_fgm": {
                           "value": 138
                        },
                        "team_total_off_drb": {
                           "value": 716
                        },
                        "team_total_off_fta": {
                           "value": 566
                        },
                        "team_total_off_poss": {
                           "value": 1778
                        },
                        "total_off_2prim_attempts": {
                           "value": 73
                        },
                        "team_total_off_3p_made": {
                           "value": 210
                        },
                        "total_off_poss": {
                           "value": 0
                        },
                        "total_off_drb": {
                           "value": 94
                        },
                        "oppo_total_def_poss": {
                           "value": 1766
                        },
                        "total_off_fta": {
                           "value": 206
                        },
                        "off_2p": {
                           "value": 0.46111111111111114
                        },
                        "off_3p": {
                           "value": 0.3216374269005848
                        },
                        "off_2prim": {
                           "value": 0.5068493150684932
                        },
                        "off_2pmid": {
                           "value": 0.42990654205607476
                        },
                        "off_ftr": {
                           "value": 0.5868945868945868
                        },
                        "off_2primr": {
                           "value": 0.20797720797720798
                        },
                        "off_2pmidr": {
                           "value": 0.30484330484330485
                        },
                        "off_3pr": {
                           "value": 0.48717948717948717
                        },
                        "off_efg": {
                           "value": 0.47150997150997154
                        },
                        "off_team_poss": {
                           "value": 1778
                        },
                        "off_assist": {
                           "value": 0.2903225806451613
                        },
                        "off_to": {
                           "value": 0.1551836312862624
                        },
                        "off_orb": {
                           "value": 0.017507723995880537
                        },
                        "off_usage": {
                           "value": 0.25007566018533395
                        },
                        "def_team_poss": {
                           "value": 1766
                        },
                        "def_orb": {
                           "value": 0.09572301425661914
                        },
                        "def_ftr": {
                           "value": 0.024575311438278596
                        },
                        "def_to": {
                           "value": 0.01698754246885617
                        },
                        "def_2prim": {
                           "value": 0.005128205128205128
                        },
                        // Fields added for DRtg, just copied for all players
                        "oppo_total_def_fga": {
                           "value": 1429
                        },
                        "oppo_total_def_fgm": {
                           "value": 534
                        },
                        "oppo_total_def_fta": {
                           "value": 626
                        },
                        "oppo_total_def_ftm": {
                           "value": 426
                        },
                        "oppo_total_def_pts": {
                           "value": 1804
                        },
                        "oppo_total_def_to": {
                           "value": 59
                        },
                        "team_total_off_blk": {
                          "value": 60
                        },
                        "team_total_off_foul": {
                          "value": 310
                        },
                        "team_total_off_stl": {
                          "value": 150
                        }
                     },
                     {
                        "key": "Wiggins, Aaron",
                        "doc_count": 404,
                        "total_off_fga": {
                           "value": 293
                        },
                        "team_total_off_fga": {
                           "value": 1253
                        },
                        "oppo_total_def_2p_attempts": {
                           "value": 784
                        },
                        "total_off_2pmid_made": {
                           "value": 24
                        },
                        "total_off_2pmid_attempts": {
                           "value": 83
                        },
                        "team_total_off_fgm": {
                           "value": 534
                        },
                        "total_off_3p_attempts": {
                           "value": 163
                        },
                        "total_off_2p_made": {
                           "value": 58
                        },
                        "total_off_assist": {
                           "value": 42
                        },
                        "total_off_pts": {
                           "value": 0
                        },
                        "team_total_off_pts": {
                           "value": 1621
                        },
                        "total_off_2prim_made": {
                           "value": 34
                        },
                        "total_off_stl": {
                           "value": 26
                        },
                        "team_total_off_assist": {
                           "value": 283
                        },
                        "def_adj_opp": {
                           "value": 96.80587833219413
                        },
                        "total_off_orb": {
                           "value": 35
                        },
                        "total_off_ftm": {
                           "value": 43
                        },
                        "team_total_off_orb": {
                           "value": 254
                        },
                        "team_total_off_ftm": {
                           "value": 379
                        },
                        "off_adj_opp": {
                           "value": 107.77293233082706
                        },
                        "total_off_blk": {
                           "value": 13
                        },
                        "oppo_total_def_orb": {
                           "value": 214
                        },
                        "total_off_to": {
                           "value": 49
                        },
                        "total_off_foul": {
                           "value": 47
                        },
                        "total_off_3p_made": {
                           "value": 51
                        },
                        "oppo_total_def_drb": {
                           "value": 534
                        },
                        "total_off_2p_attempts": {
                           "value": 130
                        },
                        "team_total_off_to": {
                           "value": 243
                        },
                        "off_poss": {
                           "value": 304.78809523809525
                        },
                        "total_off_fgm": {
                           "value": 109
                        },
                        "team_total_off_drb": {
                           "value": 606
                        },
                        "team_total_off_fta": {
                           "value": 508
                        },
                        "team_total_off_poss": {
                           "value": 1469
                        },
                        "total_off_2prim_attempts": {
                           "value": 47
                        },
                        "team_total_off_3p_made": {
                           "value": 174
                        },
                        "total_off_poss": {
                           "value": 0
                        },
                        "total_off_drb": {
                           "value": 112
                        },
                        "oppo_total_def_poss": {
                           "value": 1463
                        },
                        "total_off_fta": {
                           "value": 59
                        },
                        "off_2p": {
                           "value": 0.4461538461538462
                        },
                        "off_3p": {
                           "value": 0.3128834355828221
                        },
                        "off_2prim": {
                           "value": 0.723404255319149
                        },
                        "off_2pmid": {
                           "value": 0.2891566265060241
                        },
                        "off_ftr": {
                           "value": 0.20136518771331058
                        },
                        "off_2primr": {
                           "value": 0.16040955631399317
                        },
                        "off_2pmidr": {
                           "value": 0.2832764505119454
                        },
                        "off_3pr": {
                           "value": 0.5563139931740614
                        },
                        "off_efg": {
                           "value": 0.4590443686006826
                        },
                        "off_team_poss": {
                           "value": 1469
                        },
                        "off_assist": {
                           "value": 0.0988235294117647
                        },
                        "off_to": {
                           "value": 0.16076743404863644
                        },
                        "off_orb": {
                           "value": 0.044416243654822336
                        },
                        "off_usage": {
                           "value": 0.20747998314369998
                        },
                        "def_team_poss": {
                           "value": 1463
                        },
                        "def_orb": {
                           "value": 0.13658536585365855
                        },
                        "def_ftr": {
                           "value": 0.02248803827751196
                        },
                        "def_to": {
                           "value": 0.0177717019822283
                        },
                        "def_2prim": {
                           "value": 0.016581632653061226
                        },
                        // Fields added for DRtg, just copied for all players
                        "oppo_total_def_fga": {
                           "value": 1429
                        },
                        "oppo_total_def_fgm": {
                           "value": 534
                        },
                        "oppo_total_def_fta": {
                           "value": 626
                        },
                        "oppo_total_def_ftm": {
                           "value": 426
                        },
                        "oppo_total_def_pts": {
                           "value": 1804
                        },
                        "oppo_total_def_to": {
                           "value": 59
                        },
                        "team_total_off_blk": {
                          "value": 60
                        },
                        "team_total_off_foul": {
                          "value": 310
                        },
                        "team_total_off_stl": {
                          "value": 150
                        }
                     }
                  ]
               }
            },
            "off": {
               "doc_count": 750,
               "player": {
                  "doc_count_error_upper_bound": 0,
                  "sum_other_doc_count": 0,
                  "buckets": [
                     {
                        "key": "Cowan, Anthony",
                        "doc_count": 129,
                        "total_off_fga": {
                           "value": 106
                        },
                        "team_total_off_fga": {
                           "value": 410
                        },
                        "oppo_total_def_2p_attempts": {
                           "value": 283
                        },
                        "total_off_2pmid_made": {
                           "value": 17
                        },
                        "total_off_2pmid_attempts": {
                           "value": 39
                        },
                        "team_total_off_fgm": {
                           "value": 162
                        },
                        "total_off_3p_attempts": {
                           "value": 49
                        },
                        "total_off_2p_made": {
                           "value": 24
                        },
                        "total_off_assist": {
                           "value": 46
                        },
                        "total_off_pts": {
                           "value": 0
                        },
                        "team_total_off_pts": {
                           "value": 459
                        },
                        "total_off_2prim_made": {
                           "value": 7
                        },
                        "total_off_stl": {
                           "value": 4
                        },
                        "team_total_off_assist": {
                           "value": 99
                        },
                        "def_adj_opp": {
                           "value": 96.31485355648536
                        },
                        "total_off_orb": {
                           "value": 9
                        },
                        "total_off_ftm": {
                           "value": 35
                        },
                        "team_total_off_orb": {
                           "value": 76
                        },
                        "team_total_off_ftm": {
                           "value": 84
                        },
                        "off_adj_opp": {
                           "value": 108.49037656903766
                        },
                        "total_off_blk": {
                           "value": 0
                        },
                        "oppo_total_def_orb": {
                           "value": 71
                        },
                        "total_off_to": {
                           "value": 14
                        },
                        "total_off_foul": {
                           "value": 15
                        },
                        "total_off_3p_made": {
                           "value": 16
                        },
                        "oppo_total_def_drb": {
                           "value": 186
                        },
                        "total_off_2p_attempts": {
                           "value": 57
                        },
                        "team_total_off_to": {
                           "value": 88
                        },
                        "off_poss": {
                           "value": 122.94642857142857
                        },
                        "total_off_fgm": {
                           "value": 40
                        },
                        "team_total_off_drb": {
                           "value": 191
                        },
                        "team_total_off_fta": {
                           "value": 110
                        },
                        "team_total_off_poss": {
                           "value": 471
                        },
                        "total_off_2prim_attempts": {
                           "value": 18
                        },
                        "team_total_off_3p_made": {
                           "value": 51
                        },
                        "total_off_poss": {
                           "value": 0
                        },
                        "total_off_drb": {
                           "value": 32
                        },
                        "oppo_total_def_poss": {
                           "value": 478
                        },
                        "total_off_fta": {
                           "value": 43
                        },
                        "off_2p": {
                           "value": 0.42105263157894735
                        },
                        "off_3p": {
                           "value": 0.32653061224489793
                        },
                        "off_2prim": {
                           "value": 0.3888888888888889
                        },
                        "off_2pmid": {
                           "value": 0.4358974358974359
                        },
                        "off_ftr": {
                           "value": 0.4056603773584906
                        },
                        "off_2primr": {
                           "value": 0.16981132075471697
                        },
                        "off_2pmidr": {
                           "value": 0.36792452830188677
                        },
                        "off_3pr": {
                           "value": 0.46226415094339623
                        },
                        "off_efg": {
                           "value": 0.4528301886792453
                        },
                        "off_team_poss": {
                           "value": 471
                        },
                        "off_assist": {
                           "value": 0.3770491803278688
                        },
                        "off_to": {
                           "value": 0.11387073347857662
                        },
                        "off_orb": {
                           "value": 0.03435114503816794
                        },
                        "off_usage": {
                           "value": 0.26103275705186535
                        },
                        "def_team_poss": {
                           "value": 478
                        },
                        "def_orb": {
                           "value": 0.12213740458015267
                        },
                        "def_ftr": {
                           "value": 0.021966527196652718
                        },
                        "def_to": {
                           "value": 0.008368200836820083
                        },
                        "def_2prim": {
                           "value": 0
                        },
                        // Fields added for DRtg, just copied for all players
                        "oppo_total_def_fga": {
                           "value": 1429
                        },
                        "oppo_total_def_fgm": {
                           "value": 534
                        },
                        "oppo_total_def_fta": {
                           "value": 626
                        },
                        "oppo_total_def_ftm": {
                           "value": 426
                        },
                        "oppo_total_def_pts": {
                           "value": 1804
                        },
                        "oppo_total_def_to": {
                           "value": 59
                        },
                        "team_total_off_blk": {
                          "value": 60
                        },
                        "team_total_off_foul": {
                          "value": 310
                        },
                        "team_total_off_stl": {
                          "value": 150
                        }
                     },
                     {
                        "key": "Mona, Reese",
                        "doc_count": 3,
                        "total_off_fga": {
                           "value": 0
                        },
                        "team_total_off_fga": {
                           "value": 7
                        },
                        "oppo_total_def_2p_attempts": {
                           "value": 7
                        },
                        "total_off_2pmid_made": {
                           "value": 0
                        },
                        "total_off_2pmid_attempts": {
                           "value": 0
                        },
                        "team_total_off_fgm": {
                           "value": 1
                        },
                        "total_off_3p_attempts": {
                           "value": 0
                        },
                        "total_off_2p_made": {
                           "value": 0
                        },
                        "total_off_assist": {
                           "value": 0
                        },
                        "total_off_pts": {
                           "value": 0
                        },
                        "team_total_off_pts": {
                           "value": 2
                        },
                        "total_off_2prim_made": {
                           "value": 0
                        },
                        "total_off_stl": {
                           "value": 1
                        },
                        "team_total_off_assist": {
                           "value": 1
                        },
                        "def_adj_opp": {
                           "value": 93
                        },
                        "total_off_orb": {
                           "value": 1
                        },
                        "total_off_ftm": {
                           "value": 0
                        },
                        "team_total_off_orb": {
                           "value": 1
                        },
                        "team_total_off_ftm": {
                           "value": 0
                        },
                        "off_adj_opp": {
                           "value": 115.3
                        },
                        "total_off_blk": {
                           "value": 0
                        },
                        "oppo_total_def_orb": {
                           "value": 3
                        },
                        "total_off_to": {
                           "value": 1
                        },
                        "total_off_foul": {
                           "value": 0
                        },
                        "total_off_3p_made": {
                           "value": 0
                        },
                        "oppo_total_def_drb": {
                           "value": 6
                        },
                        "total_off_2p_attempts": {
                           "value": 0
                        },
                        "team_total_off_to": {
                           "value": 3
                        },
                        "off_poss": {
                           "value": 1.475
                        },
                        "total_off_fgm": {
                           "value": 0
                        },
                        "team_total_off_drb": {
                           "value": 2
                        },
                        "team_total_off_fta": {
                           "value": 1
                        },
                        "team_total_off_poss": {
                           "value": 9
                        },
                        "total_off_2prim_attempts": {
                           "value": 0
                        },
                        "team_total_off_3p_made": {
                           "value": 0
                        },
                        "total_off_poss": {
                           "value": 0
                        },
                        "total_off_drb": {
                           "value": 0
                        },
                        "oppo_total_def_poss": {
                           "value": 10
                        },
                        "total_off_fta": {
                           "value": 1
                        },
                        "off_2p": {
                           "value": 0
                        },
                        "off_3p": {
                           "value": 0
                        },
                        "off_2prim": {
                           "value": 0
                        },
                        "off_2pmid": {
                           "value": 0
                        },
                        "off_ftr": {
                           "value": null
                        },
                        "off_2primr": {
                           "value": 0
                        },
                        "off_2pmidr": {
                           "value": 0
                        },
                        "off_3pr": {
                           "value": 0
                        },
                        "off_efg": {
                           "value": 0
                        },
                        "off_team_poss": {
                           "value": 9
                        },
                        "off_assist": {
                           "value": 0
                        },
                        "off_to": {
                           "value": 0.6779661016949152
                        },
                        "off_orb": {
                           "value": 0.14285714285714285
                        },
                        "off_usage": {
                           "value": 0.1638888888888889
                        },
                        "def_team_poss": {
                           "value": 10
                        },
                        "def_orb": {
                           "value": 0
                        },
                        "def_ftr": {
                           "value": 0
                        },
                        "def_to": {
                           "value": 0.1
                        },
                        "def_2prim": {
                           "value": 0
                        },
                        // Fields added for DRtg, just copied for all players
                        "oppo_total_def_fga": {
                           "value": 1429
                        },
                        "oppo_total_def_fgm": {
                           "value": 534
                        },
                        "oppo_total_def_fta": {
                           "value": 626
                        },
                        "oppo_total_def_ftm": {
                           "value": 426
                        },
                        "oppo_total_def_pts": {
                           "value": 1804
                        },
                        "oppo_total_def_to": {
                           "value": 59
                        },
                        "team_total_off_blk": {
                          "value": 60
                        },
                        "team_total_off_foul": {
                          "value": 310
                        },
                        "team_total_off_stl": {
                          "value": 150
                        }
                     }
                  ]
               }
            },
            "on": {
               "doc_count": 2020,
               "player": {
                  "doc_count_error_upper_bound": 0,
                  "sum_other_doc_count": 0,
                  "buckets": [
                     {
                        "key": "Wiggins, Aaron",
                        "doc_count": 404,
                        "total_off_fga": {
                           "value": 293
                        },
                        "team_total_off_fga": {
                           "value": 1253
                        },
                        "oppo_total_def_2p_attempts": {
                           "value": 784
                        },
                        "total_off_2pmid_made": {
                           "value": 24
                        },
                        "total_off_2pmid_attempts": {
                           "value": 83
                        },
                        "team_total_off_fgm": {
                           "value": 534
                        },
                        "total_off_3p_attempts": {
                           "value": 163
                        },
                        "total_off_2p_made": {
                           "value": 58
                        },
                        "total_off_assist": {
                           "value": 42
                        },
                        "total_off_pts": {
                           "value": 0
                        },
                        "team_total_off_pts": {
                           "value": 1621
                        },
                        "total_off_2prim_made": {
                           "value": 34
                        },
                        "total_off_stl": {
                           "value": 26
                        },
                        "team_total_off_assist": {
                           "value": 283
                        },
                        "def_adj_opp": {
                           "value": 96.80587833219413
                        },
                        "total_off_orb": {
                           "value": 35
                        },
                        "total_off_ftm": {
                           "value": 43
                        },
                        "team_total_off_orb": {
                           "value": 254
                        },
                        "team_total_off_ftm": {
                           "value": 379
                        },
                        "off_adj_opp": {
                           "value": 107.77293233082706
                        },
                        "total_off_blk": {
                           "value": 13
                        },
                        "oppo_total_def_orb": {
                           "value": 214
                        },
                        "total_off_to": {
                           "value": 49
                        },
                        "total_off_foul": {
                           "value": 47
                        },
                        "total_off_3p_made": {
                           "value": 51
                        },
                        "oppo_total_def_drb": {
                           "value": 534
                        },
                        "total_off_2p_attempts": {
                           "value": 130
                        },
                        "team_total_off_to": {
                           "value": 243
                        },
                        "off_poss": {
                           "value": 304.78809523809525
                        },
                        "total_off_fgm": {
                           "value": 109
                        },
                        "team_total_off_drb": {
                           "value": 606
                        },
                        "team_total_off_fta": {
                           "value": 508
                        },
                        "team_total_off_poss": {
                           "value": 1469
                        },
                        "total_off_2prim_attempts": {
                           "value": 47
                        },
                        "team_total_off_3p_made": {
                           "value": 174
                        },
                        "total_off_poss": {
                           "value": 0
                        },
                        "total_off_drb": {
                           "value": 112
                        },
                        "oppo_total_def_poss": {
                           "value": 1463
                        },
                        "total_off_fta": {
                           "value": 59
                        },
                        "off_2p": {
                           "value": 0.4461538461538462
                        },
                        "off_3p": {
                           "value": 0.3128834355828221
                        },
                        "off_2prim": {
                           "value": 0.723404255319149
                        },
                        "off_2pmid": {
                           "value": 0.2891566265060241
                        },
                        "off_ftr": {
                           "value": 0.20136518771331058
                        },
                        "off_2primr": {
                           "value": 0.16040955631399317
                        },
                        "off_2pmidr": {
                           "value": 0.2832764505119454
                        },
                        "off_3pr": {
                           "value": 0.5563139931740614
                        },
                        "off_efg": {
                           "value": 0.4590443686006826
                        },
                        "off_team_poss": {
                           "value": 1469
                        },
                        "off_assist": {
                           "value": 0.0988235294117647
                        },
                        "off_to": {
                           "value": 0.16076743404863644
                        },
                        "off_orb": {
                           "value": 0.044416243654822336
                        },
                        "off_usage": {
                           "value": 0.20747998314369998
                        },
                        "def_team_poss": {
                           "value": 1463
                        },
                        "def_orb": {
                           "value": 0.13658536585365855
                        },
                        "def_ftr": {
                           "value": 0.02248803827751196
                        },
                        "def_to": {
                           "value": 0.0177717019822283
                        },
                        "def_2prim": {
                           "value": 0.016581632653061226
                        },
                        // Fields added for DRtg, just copied for all players
                        "oppo_total_def_fga": {
                           "value": 1429
                        },
                        "oppo_total_def_fgm": {
                           "value": 534
                        },
                        "oppo_total_def_fta": {
                           "value": 626
                        },
                        "oppo_total_def_ftm": {
                           "value": 426
                        },
                        "oppo_total_def_pts": {
                           "value": 1804
                        },
                        "oppo_total_def_to": {
                           "value": 59
                        },
                        "team_total_off_blk": {
                          "value": 60
                        },
                        "team_total_off_foul": {
                          "value": 310
                        },
                        "team_total_off_stl": {
                          "value": 150
                        }
                     },
                     {
                        "key": "Cowan, Anthony",
                        "doc_count": 341,
                        "total_off_fga": {
                           "value": 245
                        },
                        "team_total_off_fga": {
                           "value": 1119
                        },
                        "oppo_total_def_2p_attempts": {
                           "value": 692
                        },
                        "total_off_2pmid_made": {
                           "value": 29
                        },
                        "total_off_2pmid_attempts": {
                           "value": 68
                        },
                        "team_total_off_fgm": {
                           "value": 472
                        },
                        "total_off_3p_attempts": {
                           "value": 122
                        },
                        "total_off_2p_made": {
                           "value": 59
                        },
                        "total_off_assist": {
                           "value": 98
                        },
                        "total_off_pts": {
                           "value": 0
                        },
                        "team_total_off_pts": {
                           "value": 1445
                        },
                        "total_off_2prim_made": {
                           "value": 30
                        },
                        "total_off_stl": {
                           "value": 26
                        },
                        "team_total_off_assist": {
                           "value": 255
                        },
                        "def_adj_opp": {
                           "value": 96.6003105590062
                        },
                        "total_off_orb": {
                           "value": 8
                        },
                        "total_off_ftm": {
                           "value": 131
                        },
                        "team_total_off_orb": {
                           "value": 230
                        },
                        "team_total_off_ftm": {
                           "value": 342
                        },
                        "off_adj_opp": {
                           "value": 107.92523291925467
                        },
                        "total_off_blk": {
                           "value": 5
                        },
                        "oppo_total_def_orb": {
                           "value": 195
                        },
                        "total_off_to": {
                           "value": 55
                        },
                        "total_off_foul": {
                           "value": 47
                        },
                        "total_off_3p_made": {
                           "value": 39
                        },
                        "oppo_total_def_drb": {
                           "value": 479
                        },
                        "total_off_2p_attempts": {
                           "value": 123
                        },
                        "team_total_off_to": {
                           "value": 210
                        },
                        "off_poss": {
                           "value": 321.68809523809523
                        },
                        "total_off_fgm": {
                           "value": 98
                        },
                        "team_total_off_drb": {
                           "value": 525
                        },
                        "team_total_off_fta": {
                           "value": 456
                        },
                        "team_total_off_poss": {
                           "value": 1307
                        },
                        "total_off_2prim_attempts": {
                           "value": 55
                        },
                        "team_total_off_3p_made": {
                           "value": 159
                        },
                        "total_off_poss": {
                           "value": 0
                        },
                        "total_off_drb": {
                           "value": 62
                        },
                        "oppo_total_def_poss": {
                           "value": 1288
                        },
                        "total_off_fta": {
                           "value": 163
                        },
                        "off_2p": {
                           "value": 0.4796747967479675
                        },
                        "off_3p": {
                           "value": 0.319672131147541
                        },
                        "off_2prim": {
                           "value": 0.5454545454545454
                        },
                        "off_2pmid": {
                           "value": 0.4264705882352941
                        },
                        "off_ftr": {
                           "value": 0.6653061224489796
                        },
                        "off_2primr": {
                           "value": 0.22448979591836735
                        },
                        "off_2pmidr": {
                           "value": 0.27755102040816326
                        },
                        "off_3pr": {
                           "value": 0.49795918367346936
                        },
                        "off_efg": {
                           "value": 0.47959183673469385
                        },
                        "off_team_poss": {
                           "value": 1307
                        },
                        "off_assist": {
                           "value": 0.2620320855614973
                        },
                        "off_to": {
                           "value": 0.17097306619100133
                        },
                        "off_orb": {
                           "value": 0.011283497884344146
                        },
                        "off_usage": {
                           "value": 0.24612708128392902
                        },
                        "def_team_poss": {
                           "value": 1288
                        },
                        "def_orb": {
                           "value": 0.08611111111111111
                        },
                        "def_ftr": {
                           "value": 0.025543478260869563
                        },
                        "def_to": {
                           "value": 0.020186335403726708
                        },
                        "def_2prim": {
                           "value": 0.0072254335260115606
                        },
                        // Fields added for DRtg, just copied for all players
                        "oppo_total_def_fga": {
                           "value": 1429
                        },
                        "oppo_total_def_fgm": {
                           "value": 534
                        },
                        "oppo_total_def_fta": {
                           "value": 626
                        },
                        "oppo_total_def_ftm": {
                           "value": 426
                        },
                        "oppo_total_def_pts": {
                           "value": 1804
                        },
                        "oppo_total_def_to": {
                           "value": 59
                        },
                        "team_total_off_blk": {
                          "value": 60
                        },
                        "team_total_off_foul": {
                          "value": 310
                        },
                        "team_total_off_stl": {
                          "value": 150
                        }
                     }
                  ]
               }
            }
         }
      }
   },
   "status": 200
}
