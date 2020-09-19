import { SampleDataUtils } from "./SampleDataUtils"

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
         "buckets": SampleDataUtils.buildResponseFromTemplatePlayer(samplePlayerStatsTemplate)
      }
   },
   "status": 200
};
