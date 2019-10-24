export const sampleRosterCompareResponse = {
   "took": 71,
   "timed_out": false,
   "_shards": {
      "total": 5,
      "successful": 5,
      "skipped": 0,
      "failed": 0
   },
   "hits": {
      "total": {
         "value": 562,
         "relation": "eq"
      },
      "max_score": null,
      "hits": []
   },
   "aggregations": {
      "tri_filter": {
         "buckets": {
            "baseline": {
               "doc_count": 475,
               "global_poss_count": {
                  "value": 1522
               },
               "player": {
                  "doc_count_error_upper_bound": 0,
                  "sum_other_doc_count": 0,
                  "buckets": [
                     {
                        "key": "Cowan, Anthony",
                        "doc_count": 475,
                        "poss_count": {
                           "value": 1522
                        }
                     },
                     {
                        "key": "Fernando, Bruno",
                        "doc_count": 336,
                        "poss_count": {
                           "value": 1197
                        }
                     },
                     {
                        "key": "Ayala, Eric",
                        "doc_count": 308,
                        "poss_count": {
                           "value": 1066
                        }
                     },
                     {
                        "key": "Morsell, Darryl",
                        "doc_count": 295,
                        "poss_count": {
                           "value": 1062
                        }
                     },
                     {
                        "key": "Smith, Jalen",
                        "doc_count": 284,
                        "poss_count": {
                           "value": 1023
                        }
                     },
                     {
                        "key": "Wiggins, Aaron",
                        "doc_count": 295,
                        "poss_count": {
                           "value": 798
                        }
                     },
                     {
                        "key": "Lindo Jr., Ricky",
                        "doc_count": 182,
                        "poss_count": {
                           "value": 427
                        }
                     },
                     {
                        "key": "Smith Jr., Serrel",
                        "doc_count": 150,
                        "poss_count": {
                           "value": 387
                        }
                     },
                     {
                        "key": "Bender, Ivan",
                        "doc_count": 33,
                        "poss_count": {
                           "value": 81
                        }
                     },
                     {
                        "key": "Tomaic, Joshua",
                        "doc_count": 17,
                        "poss_count": {
                           "value": 47
                        }
                     }
                  ]
               }
            },
            "off": {
               "doc_count": 180,
               "global_poss_count": {
                  "value": 724
               },
               "player": {
                  "doc_count_error_upper_bound": 0,
                  "sum_other_doc_count": 0,
                  "buckets": [
                     {
                        "key": "Cowan, Anthony",
                        "doc_count": 180,
                        "poss_count": {
                           "value": 724
                        }
                     },
                     {
                        "key": "Morsell, Darryl",
                        "doc_count": 172,
                        "poss_count": {
                           "value": 710
                        }
                     },
                     {
                        "key": "Ayala, Eric",
                        "doc_count": 157,
                        "poss_count": {
                           "value": 664
                        }
                     },
                     {
                        "key": "Fernando, Bruno",
                        "doc_count": 142,
                        "poss_count": {
                           "value": 641
                        }
                     },
                     {
                        "key": "Smith, Jalen",
                        "doc_count": 130,
                        "poss_count": {
                           "value": 598
                        }
                     },
                     {
                        "key": "Lindo Jr., Ricky",
                        "doc_count": 62,
                        "poss_count": {
                           "value": 132
                        }
                     },
                     {
                        "key": "Smith Jr., Serrel",
                        "doc_count": 42,
                        "poss_count": {
                           "value": 113
                        }
                     },
                     {
                        "key": "Bender, Ivan",
                        "doc_count": 12,
                        "poss_count": {
                           "value": 27
                        }
                     },
                     {
                        "key": "Tomaic, Joshua",
                        "doc_count": 3,
                        "poss_count": {
                           "value": 11
                        }
                     }
                  ]
               }
            },
            "on": {
               "doc_count": 295,
               "global_poss_count": {
                  "value": 798
               },
               "player": {
                  "doc_count_error_upper_bound": 0,
                  "sum_other_doc_count": 0,
                  "buckets": [
                     {
                        "key": "Cowan, Anthony",
                        "doc_count": 295,
                        "poss_count": {
                           "value": 798
                        }
                     },
                     {
                        "key": "Wiggins, Aaron",
                        "doc_count": 295,
                        "poss_count": {
                           "value": 798
                        }
                     },
                     {
                        "key": "Fernando, Bruno",
                        "doc_count": 194,
                        "poss_count": {
                           "value": 556
                        }
                     },
                     {
                        "key": "Smith, Jalen",
                        "doc_count": 154,
                        "poss_count": {
                           "value": 425
                        }
                     },
                     {
                        "key": "Ayala, Eric",
                        "doc_count": 151,
                        "poss_count": {
                           "value": 402
                        }
                     },
                     {
                        "key": "Morsell, Darryl",
                        "doc_count": 123,
                        "poss_count": {
                           "value": 352
                        }
                     },
                     {
                        "key": "Lindo Jr., Ricky",
                        "doc_count": 120,
                        "poss_count": {
                           "value": 295
                        }
                     },
                     {
                        "key": "Smith Jr., Serrel",
                        "doc_count": 108,
                        "poss_count": {
                           "value": 274
                        }
                     },
                     {
                        "key": "Bender, Ivan",
                        "doc_count": 21,
                        "poss_count": {
                           "value": 54
                        }
                     },
                     {
                        "key": "Tomaic, Joshua",
                        "doc_count": 14,
                        "poss_count": {
                           "value": 36
                        }
                     }
                  ]
               }
            }
         }
      }
   },
   "status": 200
};
