export const sampleLineupStatsResponse = { //TODO: need to change this...
   "took": 204,
   "responses": [
      {
         "took": 204,
         "timed_out": false,
         "_shards": {
            "total": 1,
            "successful": 1,
            "skipped": 0,
            "failed": 0
         },
         "hits": {
            "total": {
               "value": 318,
               "relation": "eq"
            },
            "max_score": null,
            "hits": []
         },
         "aggregations": {
            "lineups": {
               "doc_count_error_upper_bound": 0,
               "sum_other_doc_count": 0,
               "buckets": [
                 {
                    "key": "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith",
                    "doc_count": 38,
                    "total_off_fga": {
                       "value": 167
                    },
                    "total_def_2prim_attempts": {
                       "value": 40
                    },
                    "total_def_drb": {
                       "value": 68
                    },
                    "total_off_2pmid_made": {
                       "value": 12
                    },
                    "total_off_2pmid_attempts": {
                       "value": 44
                    },
                    "total_def_fta": {
                       "value": 47
                    },
                    "total_def_2p_made": {
                       "value": 40
                    },
                    "off_2pmidr": {
                       "value": 0.2634730538922156
                    },
                    "off_ppp": {
                       "value": 111.22448979591837
                    },
                    "off_3pr": {
                       "value": 0.38922155688622756
                    },
                    "total_off_3p_attempts": {
                       "value": 65
                    },
                    "total_off_2p_made": {
                       "value": 52
                    },
                    "total_def_fga": {
                       "value": 158
                    },
                    "total_def_2p_attempts": {
                       "value": 92
                    },
                    "def_poss": {
                       "value": 189
                    },
                    "total_off_2prim_made": {
                       "value": 40
                    },
                    "def_to": {
                       "value": 0.14285714285714285
                    },
                    "def_adj_opp": {
                       "value": 95.56989795918368
                    },
                    "off_2primr": {
                       "value": 0.3473053892215569
                    },
                    "def_2primr": {
                       "value": 0.25316455696202533
                    },
                    "total_off_pts": {
                       "value": 218
                    },
                    "total_off_orb": {
                       "value": 39
                    },
                    "off_adj_opp": {
                       "value": 103.93650793650794
                    },
                    "def_ppp": {
                       "value": 90.47619047619048
                    },
                    "total_def_2pmid_attempts": {
                       "value": 52
                    },
                    "def_2pmidr": {
                       "value": 0.3291139240506329
                    },
                    "total_off_3p_made": {
                       "value": 18
                    },
                    "def_3pr": {
                       "value": 0.4177215189873418
                    },
                    "total_def_3p_made": {
                       "value": 19
                    },
                    "total_def_pts": {
                       "value": 171
                    },
                    "total_def_orb": {
                       "value": 19
                    },
                    "players_array": {
                       "hits": {
                          "total": {
                             "value": 38,
                             "relation": "eq"
                          },
                          "max_score": 4.760141,
                          "hits": [
                             {
                                "_index": "bigten_2019",
                                "_type": "_doc",
                                "_id": "k5mWzG4B8OZ7gWZVgjRk",
                                "_score": 4.760141,
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
                    "total_off_2p_attempts": {
                       "value": 102
                    },
                    "total_def_3p_attempts": {
                       "value": 66
                    },
                    "off_poss": {
                       "value": 196
                    },
                    "total_off_2prim_attempts": {
                       "value": 58
                    },
                    "total_def_2pmid_made": {
                       "value": 17
                    },
                    "total_def_2prim_made": {
                       "value": 23
                    },
                    "off_efg": {
                       "value": 0.47305389221556887
                    },
                    "off_to": {
                       "value": 0.14285714285714285
                    },
                    "total_off_drb": {
                       "value": 90
                    },
                    "total_off_fta": {
                       "value": 83
                    },
                    "def_efg": {
                       "value": 0.43354430379746833
                    },
                    "off_2p": {
                       "value": 0.5098039215686274
                    },
                    "def_2p": {
                       "value": 0.43478260869565216
                    },
                    "off_3p": {
                       "value": 0.27692307692307694
                    },
                    "def_3p": {
                       "value": 0.2878787878787879
                    },
                    "off_2prim": {
                       "value": 0.6896551724137931
                    },
                    "def_2prim": {
                       "value": 0.575
                    },
                    "off_2pmid": {
                       "value": 0.2727272727272727
                    },
                    "def_2pmid": {
                       "value": 0.3269230769230769
                    },
                    "off_ftr": {
                       "value": 0.49700598802395207
                    },
                    "def_ftr": {
                       "value": 0.2974683544303797
                    },
                    "off_orb": {
                       "value": 0.3644859813084112
                    },
                    "def_orb": {
                       "value": 0.1743119266055046
                    }
                 },
                 {
                    "key": "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith",
                    "doc_count": 27,
                    "total_off_fga": {
                       "value": 87
                    },
                    "total_def_2prim_attempts": {
                       "value": 27
                    },
                    "total_def_drb": {
                       "value": 43
                    },
                    "total_off_2pmid_made": {
                       "value": 4
                    },
                    "total_off_2pmid_attempts": {
                       "value": 27
                    },
                    "total_def_fta": {
                       "value": 24
                    },
                    "total_def_2p_made": {
                       "value": 22
                    },
                    "off_2pmidr": {
                       "value": 0.3103448275862069
                    },
                    "off_ppp": {
                       "value": 89.1891891891892
                    },
                    "off_3pr": {
                       "value": 0.3563218390804598
                    },
                    "total_off_3p_attempts": {
                       "value": 31
                    },
                    "total_off_2p_made": {
                       "value": 22
                    },
                    "total_def_fga": {
                       "value": 85
                    },
                    "total_def_2p_attempts": {
                       "value": 58
                    },
                    "def_poss": {
                       "value": 114
                    },
                    "total_off_2prim_made": {
                       "value": 18
                    },
                    "def_to": {
                       "value": 0.2719298245614035
                    },
                    "def_adj_opp": {
                       "value": 93.37927927927929
                    },
                    "off_2primr": {
                       "value": 0.3333333333333333
                    },
                    "def_2primr": {
                       "value": 0.3176470588235294
                    },
                    "total_off_pts": {
                       "value": 99
                    },
                    "total_off_orb": {
                       "value": 18
                    },
                    "off_adj_opp": {
                       "value": 106.32105263157895
                    },
                    "def_ppp": {
                       "value": 77.19298245614036
                    },
                    "total_def_2pmid_attempts": {
                       "value": 31
                    },
                    "def_2pmidr": {
                       "value": 0.36470588235294116
                    },
                    "total_off_3p_made": {
                       "value": 7
                    },
                    "def_3pr": {
                       "value": 0.3176470588235294
                    },
                    "total_def_3p_made": {
                       "value": 9
                    },
                    "total_def_pts": {
                       "value": 88
                    },
                    "total_def_orb": {
                       "value": 14
                    },
                    "players_array": {
                       "hits": {
                          "total": {
                             "value": 27,
                             "relation": "eq"
                          },
                          "max_score": 4.760141,
                          "hits": [
                             {
                                "_index": "bigten_2019",
                                "_type": "_doc",
                                "_id": "apmWzG4B8OZ7gWZVgTSi",
                                "_score": 4.760141,
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
                    "total_off_2p_attempts": {
                       "value": 56
                    },
                    "total_def_3p_attempts": {
                       "value": 27
                    },
                    "off_poss": {
                       "value": 111
                    },
                    "total_off_2prim_attempts": {
                       "value": 29
                    },
                    "total_def_2pmid_made": {
                       "value": 8
                    },
                    "total_def_2prim_made": {
                       "value": 14
                    },
                    "off_efg": {
                       "value": 0.3735632183908046
                    },
                    "off_to": {
                       "value": 0.18018018018018017
                    },
                    "total_off_drb": {
                       "value": 43
                    },
                    "total_off_fta": {
                       "value": 48
                    },
                    "def_efg": {
                       "value": 0.4176470588235294
                    },
                    "off_2p": {
                       "value": 0.39285714285714285
                    },
                    "def_2p": {
                       "value": 0.3793103448275862
                    },
                    "off_3p": {
                       "value": 0.22580645161290322
                    },
                    "def_3p": {
                       "value": 0.3333333333333333
                    },
                    "off_2prim": {
                       "value": 0.6206896551724138
                    },
                    "def_2prim": {
                       "value": 0.5185185185185185
                    },
                    "off_2pmid": {
                       "value": 0.14814814814814814
                    },
                    "def_2pmid": {
                       "value": 0.25806451612903225
                    },
                    "off_ftr": {
                       "value": 0.5517241379310345
                    },
                    "def_ftr": {
                       "value": 0.2823529411764706
                    },
                    "off_orb": {
                       "value": 0.29508196721311475
                    },
                    "def_orb": {
                       "value": 0.24561403508771928
                    }
                 },
                 {
                    "key": "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith",
                    "doc_count": 24,
                    "total_off_fga": {
                       "value": 96
                    },
                    "total_def_2prim_attempts": {
                       "value": 28
                    },
                    "total_def_drb": {
                       "value": 36
                    },
                    "total_off_2pmid_made": {
                       "value": 10
                    },
                    "total_off_2pmid_attempts": {
                       "value": 25
                    },
                    "total_def_fta": {
                       "value": 27
                    },
                    "total_def_2p_made": {
                       "value": 17
                    },
                    "off_2pmidr": {
                       "value": 0.2604166666666667
                    },
                    "off_ppp": {
                       "value": 109.80392156862744
                    },
                    "off_3pr": {
                       "value": 0.4166666666666667
                    },
                    "total_off_3p_attempts": {
                       "value": 40
                    },
                    "total_off_2p_made": {
                       "value": 26
                    },
                    "total_def_fga": {
                       "value": 93
                    },
                    "total_def_2p_attempts": {
                       "value": 50
                    },
                    "def_poss": {
                       "value": 97
                    },
                    "total_off_2prim_made": {
                       "value": 16
                    },
                    "def_to": {
                       "value": 0.21649484536082475
                    },
                    "def_adj_opp": {
                       "value": 93.46372549019607
                    },
                    "off_2primr": {
                       "value": 0.3229166666666667
                    },
                    "def_2primr": {
                       "value": 0.3010752688172043
                    },
                    "total_off_pts": {
                       "value": 112
                    },
                    "total_off_orb": {
                       "value": 21
                    },
                    "off_adj_opp": {
                       "value": 104.70927835051546
                    },
                    "def_ppp": {
                       "value": 80.41237113402062
                    },
                    "total_def_2pmid_attempts": {
                       "value": 22
                    },
                    "def_2pmidr": {
                       "value": 0.23655913978494625
                    },
                    "total_off_3p_made": {
                       "value": 15
                    },
                    "def_3pr": {
                       "value": 0.46236559139784944
                    },
                    "total_def_3p_made": {
                       "value": 10
                    },
                    "total_def_pts": {
                       "value": 78
                    },
                    "total_def_orb": {
                       "value": 27
                    },
                    "players_array": {
                       "hits": {
                          "total": {
                             "value": 24,
                             "relation": "eq"
                          },
                          "max_score": 4.760141,
                          "hits": [
                             {
                                "_index": "bigten_2019",
                                "_type": "_doc",
                                "_id": "FJmWzG4B8OZ7gWZVjTbp",
                                "_score": 4.760141,
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
                    "total_off_2p_attempts": {
                       "value": 56
                    },
                    "total_def_3p_attempts": {
                       "value": 43
                    },
                    "off_poss": {
                       "value": 102
                    },
                    "total_off_2prim_attempts": {
                       "value": 31
                    },
                    "total_def_2pmid_made": {
                       "value": 3
                    },
                    "total_def_2prim_made": {
                       "value": 14
                    },
                    "off_efg": {
                       "value": 0.5052083333333334
                    },
                    "off_to": {
                       "value": 0.20588235294117646
                    },
                    "total_off_drb": {
                       "value": 43
                    },
                    "total_off_fta": {
                       "value": 19
                    },
                    "def_efg": {
                       "value": 0.34408602150537637
                    },
                    "off_2p": {
                       "value": 0.4642857142857143
                    },
                    "def_2p": {
                       "value": 0.34
                    },
                    "off_3p": {
                       "value": 0.375
                    },
                    "def_3p": {
                       "value": 0.23255813953488372
                    },
                    "off_2prim": {
                       "value": 0.5161290322580645
                    },
                    "def_2prim": {
                       "value": 0.5
                    },
                    "off_2pmid": {
                       "value": 0.4
                    },
                    "def_2pmid": {
                       "value": 0.13636363636363635
                    },
                    "off_ftr": {
                       "value": 0.19791666666666666
                    },
                    "def_ftr": {
                       "value": 0.2903225806451613
                    },
                    "off_orb": {
                       "value": 0.3684210526315789
                    },
                    "def_orb": {
                       "value": 0.38571428571428573
                    }
                 }
              ]
            }
         }
    }
  ]
}
