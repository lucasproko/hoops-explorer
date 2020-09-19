import { SampleDataUtils } from "./SampleDataUtils"

const sampleLineupStatsTemplate =
{
  // A: Top Level Scoring

   "efg": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 0.47305389221556887,
         "def_": 0.43354430379746833
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 0.3735632183908046,
         "def_": 0.4176470588235294
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 0.5052083333333334,
         "def_": 0.34408602150537637
      }
   },
   "fga": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 167,
         "total_def_": 158
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 87,
         "total_def_": 85
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 96,
         "total_def_": 93
      }
   },
   "fta": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 83,
         "total_def_": 47
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 48,
         "total_def_": 24
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 19,
         "total_def_": 27
      }
   },
   "ftr": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 0.49700598802395207,
         "def_": 0.2974683544303797
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 0.5517241379310345,
         "def_": 0.2823529411764706
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 0.19791666666666666,
         "def_": 0.2903225806451613
      }
   },

    // B] Advanced Shooting Stats

   "2p": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 0.5098039215686274,
         "def_": 0.43478260869565216
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 0.39285714285714285,
         "def_": 0.3793103448275862
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 0.4642857142857143,
         "def_": 0.34
      }
   },
   "2p_attempts": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 102,
         "total_def_": 92
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 56,
         "total_def_": 58
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 56,
         "total_def_": 50
      }
   },
   "2p_made": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 52,
         "total_def_": 40
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 22,
         "total_def_": 22
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 26,
         "total_def_": 17
      }
   },
   "2pmid": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 0.2727272727272727,
         "def_": 0.3269230769230769
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 0.14814814814814814,
         "def_": 0.25806451612903225
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 0.4,
         "def_": 0.13636363636363635
      }
   },
   "2pmid_attempts": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 44,
         "total_def_": 52
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 27,
         "total_def_": 31
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 25,
         "total_def_": 22
      }
   },
   "2pmid_made": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 12,
         "total_def_": 17
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 4,
         "total_def_": 8
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 10,
         "total_def_": 3
      }
   },
   "2pmidr": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 0.2634730538922156,
         "def_": 0.3291139240506329
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 0.3103448275862069,
         "def_": 0.36470588235294116
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 0.2604166666666667,
         "def_": 0.23655913978494625
      }
   },
   "2prim": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 0.6896551724137931,
         "def_": 0.575
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 0.6206896551724138,
         "def_": 0.5185185185185185
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 0.5161290322580645,
         "def_": 0.5
      }
   },
   "2prim_attempts": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 58,
         "total_def_": 40
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 29,
         "total_def_": 27
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 31,
         "total_def_": 28
      }
   },
   "2prim_made": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 40,
         "total_def_": 23
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 18,
         "total_def_": 14
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 16,
         "total_def_": 14
      }
   },
   "2primr": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 0.3473053892215569,
         "def_": 0.25316455696202533
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 0.3333333333333333,
         "def_": 0.3176470588235294
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 0.3229166666666667,
         "def_": 0.3010752688172043
      }
   },
   "3p": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 0.27692307692307694,
         "def_": 0.2878787878787879
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 0.22580645161290322,
         "def_": 0.3333333333333333
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 0.375,
         "def_": 0.23255813953488372
      }
   },
   "3p_attempts": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 65,
         "total_def_": 66
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 31,
         "total_def_": 27
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 40,
         "total_def_": 43
      }
   },
   "3p_made": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 18,
         "total_def_": 19
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 7,
         "total_def_": 9
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 15,
         "total_def_": 10
      }
   },
   "3pr": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 0.38922155688622756,
         "def_": 0.4177215189873418
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 0.3563218390804598,
         "def_": 0.3176470588235294
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 0.4166666666666667,
         "def_": 0.46236559139784944
      }
   },

    // C] Rebounds

   "drb": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 90,
         "total_def_": 68
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 43,
         "total_def_": 43
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 43,
         "total_def_": 36
      }
   },
   "orb": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 39,
         "total_def_": 19,
         "off_": 0.3644859813084112,
         "def_": 0.1743119266055046
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 18,
         "total_def_": 14,
         "off_": 0.29508196721311475,
         "def_": 0.24561403508771928
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 21,
         "total_def_": 27,
         "off_": 0.3684210526315789,
         "def_": 0.38571428571428573
      }
   },

    // D] Assists and TOs

   "assist": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 0.52,
         "def_": 0.48
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 0.53,
         "def_": 0.47
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 0.52,
         "def_": 0.48
      }
   },
   "to": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 0.14285714285714285,
         "def_": 0.14285714285714285
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 0.18018018018018017,
         "def_": 0.2719298245614035
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 0.20588235294117646,
         "def_": 0.21649484536082475
      }
   },

    // E] Adjusted Numbers

   "adj_opp": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 103.93650793650794,
         "def_": 95.56989795918368
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 106.32105263157895,
         "def_": 93.37927927927929
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 104.70927835051546,
         "def_": 93.46372549019607
      }
   },
   "adj_ppp": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 116.22448979591837,
         "def_": 85.47619047619048
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 96.22448979591837,
         "def_": 75.47619047619048
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 114.22448979591837,
         "def_": 75.47619047619048
      }
   },

    // F] Misc Stats

   "poss": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 196,
         "def_": 189
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 111,
         "def_": 114
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 102,
         "def_": 97
      }
   },
   "ppp": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "off_": 111.22448979591837,
         "def_": 90.47619047619048
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "off_": 89.1891891891892,
         "def_": 77.19298245614036
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "off_": 109.80392156862744,
         "def_": 80.41237113402062
      }
   },
   "pts": {
      "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
         "total_off_": 218,
         "total_def_": 171
      },
      "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
         "total_off_": 99,
         "total_def_": 88
      },
      "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
         "total_off_": 112,
         "total_def_": 78
      }
   },
   "main": {
      "doc_count": {
         "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": 38,
         "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": 27,
         "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": 24
      },
      "players_array": {
         "AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith": {
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
         "AaWiggins_AnCowan_DaMorsell_DoScott_JaSmith": {
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
         "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith": {
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
         }
      }
   }
};

export const sampleLineupStatsResponse =
{
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
               "buckets": SampleDataUtils.buildResponseFromTemplateLineup(sampleLineupStatsTemplate)
            }
         }
    }
  ]
};
