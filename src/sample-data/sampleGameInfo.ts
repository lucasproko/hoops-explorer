export const sampleGameInfo: any = {
  took: 1,
  responses: [
    {
      took: 1,
      timed_out: false,
      _shards: {
        total: 1,
        successful: 1,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: {
          value: 747,
          relation: "eq",
        },
        max_score: null,
        hits: [],
      },
      aggregations: {
        game_info: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [
            {
              key: "H:Wright St.",
              doc_count: 52,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-01-12T12:00:00.000-10:00",
                    key: 1736719200000,
                    doc_count: 30,
                    def_poss: {
                      value: 71,
                    },
                    off_poss: {
                      value: 71,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 30,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "b434aca8d07c47003215a0d72efa701eb2bc908d5dce9a2ce4216b5999b4a967",
                            _score: null,
                            _source: {
                              date: "2025-01-12T17:39:37.186-05:00",
                              score_info: {
                                end: {
                                  scored: 75,
                                  allowed: 72,
                                },
                              },
                              location_type: "Home",
                              opponent: {
                                team: "Wright St.",
                              },
                              end_min: 40,
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 167.5,
                    },
                  },
                  {
                    key_as_string: "2025-01-13T00:00:00.000-10:00",
                    key: 1736762400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-13T12:00:00.000-10:00",
                    key: 1736805600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-14T00:00:00.000-10:00",
                    key: 1736848800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-14T12:00:00.000-10:00",
                    key: 1736892000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-15T00:00:00.000-10:00",
                    key: 1736935200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-15T12:00:00.000-10:00",
                    key: 1736978400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-16T00:00:00.000-10:00",
                    key: 1737021600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-16T12:00:00.000-10:00",
                    key: 1737064800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-17T00:00:00.000-10:00",
                    key: 1737108000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-17T12:00:00.000-10:00",
                    key: 1737151200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-18T00:00:00.000-10:00",
                    key: 1737194400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-18T12:00:00.000-10:00",
                    key: 1737237600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-19T00:00:00.000-10:00",
                    key: 1737280800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-19T12:00:00.000-10:00",
                    key: 1737324000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-20T00:00:00.000-10:00",
                    key: 1737367200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-20T12:00:00.000-10:00",
                    key: 1737410400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-21T00:00:00.000-10:00",
                    key: 1737453600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-21T12:00:00.000-10:00",
                    key: 1737496800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-22T00:00:00.000-10:00",
                    key: 1737540000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-22T12:00:00.000-10:00",
                    key: 1737583200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-23T00:00:00.000-10:00",
                    key: 1737626400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-23T12:00:00.000-10:00",
                    key: 1737669600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-24T00:00:00.000-10:00",
                    key: 1737712800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-24T12:00:00.000-10:00",
                    key: 1737756000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-25T00:00:00.000-10:00",
                    key: 1737799200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-25T12:00:00.000-10:00",
                    key: 1737842400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-26T00:00:00.000-10:00",
                    key: 1737885600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-26T12:00:00.000-10:00",
                    key: 1737928800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-27T00:00:00.000-10:00",
                    key: 1737972000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-27T12:00:00.000-10:00",
                    key: 1738015200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-28T00:00:00.000-10:00",
                    key: 1738058400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-28T12:00:00.000-10:00",
                    key: 1738101600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-29T00:00:00.000-10:00",
                    key: 1738144800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-29T12:00:00.000-10:00",
                    key: 1738188000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-30T00:00:00.000-10:00",
                    key: 1738231200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-30T12:00:00.000-10:00",
                    key: 1738274400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-31T00:00:00.000-10:00",
                    key: 1738317600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-01-31T12:00:00.000-10:00",
                    key: 1738360800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-01T00:00:00.000-10:00",
                    key: 1738404000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-01T12:00:00.000-10:00",
                    key: 1738447200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-02T00:00:00.000-10:00",
                    key: 1738490400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-02T12:00:00.000-10:00",
                    key: 1738533600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-03T00:00:00.000-10:00",
                    key: 1738576800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-03T12:00:00.000-10:00",
                    key: 1738620000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-04T00:00:00.000-10:00",
                    key: 1738663200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-04T12:00:00.000-10:00",
                    key: 1738706400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-05T00:00:00.000-10:00",
                    key: 1738749600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-05T12:00:00.000-10:00",
                    key: 1738792800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-06T00:00:00.000-10:00",
                    key: 1738836000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-06T12:00:00.000-10:00",
                    key: 1738879200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-07T00:00:00.000-10:00",
                    key: 1738922400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-07T12:00:00.000-10:00",
                    key: 1738965600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-08T00:00:00.000-10:00",
                    key: 1739008800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-08T12:00:00.000-10:00",
                    key: 1739052000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-09T00:00:00.000-10:00",
                    key: 1739095200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-09T12:00:00.000-10:00",
                    key: 1739138400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-10T00:00:00.000-10:00",
                    key: 1739181600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-10T12:00:00.000-10:00",
                    key: 1739224800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-11T00:00:00.000-10:00",
                    key: 1739268000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-11T12:00:00.000-10:00",
                    key: 1739311200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-12T00:00:00.000-10:00",
                    key: 1739354400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-12T12:00:00.000-10:00",
                    key: 1739397600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-13T00:00:00.000-10:00",
                    key: 1739440800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-13T12:00:00.000-10:00",
                    key: 1739484000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-14T00:00:00.000-10:00",
                    key: 1739527200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-14T12:00:00.000-10:00",
                    key: 1739570400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-15T00:00:00.000-10:00",
                    key: 1739613600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-15T12:00:00.000-10:00",
                    key: 1739656800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-16T00:00:00.000-10:00",
                    key: 1739700000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-16T12:00:00.000-10:00",
                    key: 1739743200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-17T00:00:00.000-10:00",
                    key: 1739786400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-17T12:00:00.000-10:00",
                    key: 1739829600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-18T00:00:00.000-10:00",
                    key: 1739872800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-18T12:00:00.000-10:00",
                    key: 1739916000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-19T00:00:00.000-10:00",
                    key: 1739959200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-19T12:00:00.000-10:00",
                    key: 1740002400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-20T00:00:00.000-10:00",
                    key: 1740045600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-20T12:00:00.000-10:00",
                    key: 1740088800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-21T00:00:00.000-10:00",
                    key: 1740132000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-21T12:00:00.000-10:00",
                    key: 1740175200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-22T00:00:00.000-10:00",
                    key: 1740218400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-22T12:00:00.000-10:00",
                    key: 1740261600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-23T00:00:00.000-10:00",
                    key: 1740304800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-23T12:00:00.000-10:00",
                    key: 1740348000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-24T00:00:00.000-10:00",
                    key: 1740391200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-24T12:00:00.000-10:00",
                    key: 1740434400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-25T00:00:00.000-10:00",
                    key: 1740477600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-25T12:00:00.000-10:00",
                    key: 1740520800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-26T00:00:00.000-10:00",
                    key: 1740564000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-26T12:00:00.000-10:00",
                    key: 1740607200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-27T00:00:00.000-10:00",
                    key: 1740650400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-27T12:00:00.000-10:00",
                    key: 1740693600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-28T00:00:00.000-10:00",
                    key: 1740736800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-02-28T12:00:00.000-10:00",
                    key: 1740780000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-03-01T00:00:00.000-10:00",
                    key: 1740823200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-03-01T12:00:00.000-10:00",
                    key: 1740866400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-03-02T00:00:00.000-10:00",
                    key: 1740909600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-03-02T12:00:00.000-10:00",
                    key: 1740952800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-03-03T00:00:00.000-10:00",
                    key: 1740996000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-03-03T12:00:00.000-10:00",
                    key: 1741039200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-03-04T00:00:00.000-10:00",
                    key: 1741082400000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-03-04T12:00:00.000-10:00",
                    key: 1741125600000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-03-05T00:00:00.000-10:00",
                    key: 1741168800000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-03-05T12:00:00.000-10:00",
                    key: 1741212000000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-03-06T00:00:00.000-10:00",
                    key: 1741255200000,
                    doc_count: 0,
                    off_poss: {
                      value: 0,
                    },
                    def_poss: {
                      value: 0,
                    },
                    avg_lead: {
                      value: 0,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 0,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [],
                      },
                    },
                  },
                  {
                    key_as_string: "2025-03-06T12:00:00.000-10:00",
                    key: 1741298400000,
                    doc_count: 22,
                    def_poss: {
                      value: 69,
                    },
                    off_poss: {
                      value: 67,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 22,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "1a8ba2eed3acb22ccaca80b56fc1de3c2633d71fbefbbeb2dd944af1ed221d27",
                            _score: null,
                            _source: {
                              score_info: {
                                end: {
                                  scored: 83,
                                  allowed: 62,
                                },
                              },
                              opponent: {
                                team: "Wright St.",
                              },
                              location_type: "Home",
                              date: "2025-03-06T17:39:06.491-05:00",
                              end_min: 40,
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 475,
                    },
                  },
                ],
              },
            },
            {
              key: "A:Cornell",
              doc_count: 31,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-11-21T12:00:00.000-10:00",
                    key: 1732226400000,
                    doc_count: 31,
                    def_poss: {
                      value: 72,
                    },
                    off_poss: {
                      value: 73,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 31,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "233302d442f70a980bb8359757c90e2146bcfbf017a15ee9d83302b9d977ace7",
                            _score: null,
                            _source: {
                              opponent: {
                                team: "Cornell",
                              },
                              location_type: "Away",
                              score_info: {
                                end: {
                                  scored: 86,
                                  allowed: 76,
                                },
                              },
                              date: "2024-11-21T17:39:51.486-05:00",
                              end_min: 40,
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 657.75,
                    },
                  },
                ],
              },
            },
            {
              key: "A:Delaware",
              doc_count: 29,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-11-07T12:00:00.000-10:00",
                    key: 1731016800000,
                    doc_count: 29,
                    def_poss: {
                      value: 76,
                    },
                    off_poss: {
                      value: 76,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 29,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "895014d05517a99600e8dcf00e4e007059c0a2791714e6d86ca94f2b5cc861a9",
                            _score: null,
                            _source: {
                              score_info: {
                                end: {
                                  allowed: 81,
                                  scored: 77,
                                },
                              },
                              opponent: {
                                team: "Delaware",
                              },
                              location_type: "Away",
                              date: "2024-11-07T17:39:24.586-05:00",
                              end_min: 40,
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 42.25,
                    },
                  },
                ],
              },
            },
            {
              key: "A:Milwaukee",
              doc_count: 28,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-01-19T12:00:00.000-10:00",
                    key: 1737324000000,
                    doc_count: 28,
                    def_poss: {
                      value: 71,
                    },
                    off_poss: {
                      value: 72,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 28,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "637cd8abd4c723570d26705c1dfb68fee464a1a663d0dcf8611f51d06ba006ed",
                            _score: null,
                            _source: {
                              end_min: 40,
                              score_info: {
                                end: {
                                  scored: 81,
                                  allowed: 79,
                                },
                              },
                              opponent: {
                                team: "Milwaukee",
                              },
                              date: "2025-01-19T17:39:53.790-05:00",
                              location_type: "Away",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 429.75,
                    },
                  },
                ],
              },
            },
            {
              key: "A:Purdue Fort Wayne",
              doc_count: 26,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-12-08T12:00:00.000-10:00",
                    key: 1733695200000,
                    doc_count: 26,
                    def_poss: {
                      value: 77,
                    },
                    off_poss: {
                      value: 78,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 26,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "b6d06e51be6ff0df2e35bacb563619eb805fe2d0ae6215928d30a54b1e8d2042",
                            _score: null,
                            _source: {
                              end_min: 40,
                              date: "2024-12-08T17:38:12.987-05:00",
                              opponent: {
                                team: "Purdue Fort Wayne",
                              },
                              score_info: {
                                end: {
                                  scored: 77,
                                  allowed: 82,
                                },
                              },
                              location_type: "Away",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: -233.25,
                    },
                  },
                ],
              },
            },
            {
              key: "H:New Orleans",
              doc_count: 26,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-11-17T12:00:00.000-10:00",
                    key: 1731880800000,
                    doc_count: 26,
                    def_poss: {
                      value: 71,
                    },
                    off_poss: {
                      value: 72,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 26,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "8ca62b3bc6f5f896a136eabf83078a58fe93ac7603f030d7eb273fdf630fb055",
                            _score: null,
                            _source: {
                              date: "2024-11-17T17:38:51.991-05:00",
                              opponent: {
                                team: "New Orleans",
                              },
                              location_type: "Home",
                              end_min: 40,
                              score_info: {
                                end: {
                                  scored: 73,
                                  allowed: 62,
                                },
                              },
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 578,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Northern Ky.",
              doc_count: 26,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-12-29T12:00:00.000-10:00",
                    key: 1735509600000,
                    doc_count: 26,
                    def_poss: {
                      value: 95,
                    },
                    off_poss: {
                      value: 98,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 26,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "da230594f345d70b3f58d1cf8626a2eea192680808ec2522cfd7c84fb71b7f04",
                            _score: null,
                            _source: {
                              end_min: 55,
                              location_type: "Home",
                              date: "2024-12-29T17:49:59.992-05:00",
                              score_info: {
                                end: {
                                  allowed: 93,
                                  scored: 97,
                                },
                              },
                              opponent: {
                                team: "Northern Ky.",
                              },
                            },
                            sort: [55],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: -42,
                    },
                  },
                ],
              },
            },
            {
              key: "A:Green Bay",
              doc_count: 25,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-01-17T12:00:00.000-10:00",
                    key: 1737151200000,
                    doc_count: 25,
                    def_poss: {
                      value: 68,
                    },
                    off_poss: {
                      value: 67,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 25,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "767c1ce17582617bae8bf1f0fa07a3c1c6bb16f2a8a2939b73809a00fb812cb0",
                            _score: null,
                            _source: {
                              opponent: {
                                team: "Green Bay",
                              },
                              date: "2025-01-17T17:37:43.989-05:00",
                              end_min: 40,
                              score_info: {
                                end: {
                                  scored: 89,
                                  allowed: 67,
                                },
                              },
                              location_type: "Away",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 191.75,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Stonehill",
              doc_count: 25,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-11-14T12:00:00.000-10:00",
                    key: 1731621600000,
                    doc_count: 25,
                    def_poss: {
                      value: 67,
                    },
                    off_poss: {
                      value: 68,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 25,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "3333df4590831eac80e9425d400a5e4b0100d92fed98dee2afa9bfd834dd46bb",
                            _score: null,
                            _source: {
                              opponent: {
                                team: "Stonehill",
                              },
                              end_min: 40,
                              location_type: "Home",
                              score_info: {
                                end: {
                                  scored: 63,
                                  allowed: 51,
                                },
                              },
                              date: "2024-11-14T17:36:44.988-05:00",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 431,
                    },
                  },
                ],
              },
            },
            {
              key: "N:Oakland",
              doc_count: 25,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-03-10T00:00:00.000-10:00",
                    key: 1741600800000,
                    doc_count: 25,
                    def_poss: {
                      value: 70,
                    },
                    off_poss: {
                      value: 69,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 25,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "6972c7898a5e5fa398f2ad5eec59ffbe7c57593e8309d8489fedffe0dbff9a77",
                            _score: null,
                            _source: {
                              location_type: "Neutral",
                              score_info: {
                                end: {
                                  scored: 79,
                                  allowed: 76,
                                },
                              },
                              end_min: 45,
                              opponent: {
                                team: "Oakland",
                              },
                              date: "2025-03-10T17:39:59.988-04:00",
                            },
                            sort: [45],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: -182,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Canisius",
              doc_count: 24,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-11-27T12:00:00.000-10:00",
                    key: 1732744800000,
                    doc_count: 24,
                    def_poss: {
                      value: 67,
                    },
                    off_poss: {
                      value: 67,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 24,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "e04619988c419b844f17b0b3175d908d044bcca6699f5f0238630cc2252813a4",
                            _score: null,
                            _source: {
                              end_min: 40,
                              score_info: {
                                end: {
                                  scored: 72,
                                  allowed: 64,
                                },
                              },
                              opponent: {
                                team: "Canisius",
                              },
                              location_type: "Home",
                              date: "2024-11-27T17:39:38.190-05:00",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 134.5,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Saint Francis",
              doc_count: 24,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-12-21T12:00:00.000-10:00",
                    key: 1734818400000,
                    doc_count: 24,
                    def_poss: {
                      value: 72,
                    },
                    off_poss: {
                      value: 74,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 24,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "32cf1f2885a8186587e97eb5e2a1d6f5bd398bfe0b7e3331f67754aab769c9c7",
                            _score: null,
                            _source: {
                              location_type: "Home",
                              date: "2024-12-21T17:37:11.993-05:00",
                              end_min: 40,
                              opponent: {
                                team: "Saint Francis",
                              },
                              score_info: {
                                end: {
                                  scored: 90,
                                  allowed: 77,
                                },
                              },
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 320.75,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Cleveland St.",
              doc_count: 23,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-01-08T12:00:00.000-10:00",
                    key: 1736373600000,
                    doc_count: 23,
                    def_poss: {
                      value: 69,
                    },
                    off_poss: {
                      value: 69,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 23,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "9c7c952d1fb6ad719671d3863140f254cb983a622c49408f9bb0c03152d823eb",
                            _score: null,
                            _source: {
                              date: "2025-01-08T17:36:26.993-05:00",
                              score_info: {
                                end: {
                                  scored: 69,
                                  allowed: 80,
                                },
                              },
                              end_min: 40,
                              opponent: {
                                team: "Cleveland St.",
                              },
                              location_type: "Home",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: -311.25,
                    },
                  },
                ],
              },
            },
            {
              key: "A:Wright St.",
              doc_count: 22,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-02-02T12:00:00.000-10:00",
                    key: 1738533600000,
                    doc_count: 22,
                    def_poss: {
                      value: 62,
                    },
                    off_poss: {
                      value: 63,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 22,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "18e6cbd3de4dd097a2fcd76e9d58f9e8dc6f10d0d33fc43cc809bfd35705847b",
                            _score: null,
                            _source: {
                              opponent: {
                                team: "Wright St.",
                              },
                              date: "2025-02-02T17:39:59.593-05:00",
                              score_info: {
                                end: {
                                  scored: 64,
                                  allowed: 66,
                                },
                              },
                              location_type: "Away",
                              end_min: 40,
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 197.75,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Lindenwood",
              doc_count: 22,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-11-15T12:00:00.000-10:00",
                    key: 1731708000000,
                    doc_count: 22,
                    def_poss: {
                      value: 63,
                    },
                    off_poss: {
                      value: 62,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 22,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "82e8b25be0c22ace565eb84bf564285f8ea5062961839332546384cae69c44da",
                            _score: null,
                            _source: {
                              location_type: "Home",
                              end_min: 40,
                              score_info: {
                                end: {
                                  scored: 67,
                                  allowed: 53,
                                },
                              },
                              date: "2024-11-15T17:38:09.990-05:00",
                              opponent: {
                                team: "Lindenwood",
                              },
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 323.5,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Youngstown St.",
              doc_count: 22,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-12-04T12:00:00.000-10:00",
                    key: 1733349600000,
                    doc_count: 22,
                    def_poss: {
                      value: 71,
                    },
                    off_poss: {
                      value: 72,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 22,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "e26099fd6bfb7984e8ee82fc9e79f80d94b07d48af3c5de0a6a29f884c517d5f",
                            _score: null,
                            _source: {
                              date: "2024-12-04T17:37:29.991-05:00",
                              end_min: 40,
                              opponent: {
                                team: "Youngstown St.",
                              },
                              location_type: "Home",
                              score_info: {
                                end: {
                                  scored: 58,
                                  allowed: 72,
                                },
                              },
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: -746,
                    },
                  },
                ],
              },
            },
            {
              key: "A:Oakland",
              doc_count: 21,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-01-04T12:00:00.000-10:00",
                    key: 1736028000000,
                    doc_count: 21,
                    def_poss: {
                      value: 66,
                    },
                    off_poss: {
                      value: 64,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 21,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "24e1139cd4f536daed9b518b407c31b670f3f993253bde3e194579cfe874e10f",
                            _score: null,
                            _source: {
                              location_type: "Away",
                              opponent: {
                                team: "Oakland",
                              },
                              score_info: {
                                end: {
                                  scored: 79,
                                  allowed: 71,
                                },
                              },
                              end_min: 40,
                              date: "2025-01-04T17:37:52.993-05:00",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 51.75,
                    },
                  },
                ],
              },
            },
            {
              key: "A:Ohio",
              doc_count: 21,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-11-30T12:00:00.000-10:00",
                    key: 1733004000000,
                    doc_count: 21,
                    def_poss: {
                      value: 67,
                    },
                    off_poss: {
                      value: 69,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 21,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "5d619c80e6e225ea620892334da45fbf7e1ca877ae6e7825a8b86f7ba0ad07bc",
                            _score: null,
                            _source: {
                              end_min: 40,
                              date: "2024-11-30T17:37:43.991-05:00",
                              score_info: {
                                end: {
                                  scored: 68,
                                  allowed: 84,
                                },
                              },
                              opponent: {
                                team: "Ohio",
                              },
                              location_type: "Away",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: -772,
                    },
                  },
                ],
              },
            },
            {
              key: "A:West Virginia",
              doc_count: 21,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-11-04T12:00:00.000-10:00",
                    key: 1730757600000,
                    doc_count: 21,
                    def_poss: {
                      value: 71,
                    },
                    off_poss: {
                      value: 71,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 21,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "ea031ccd78bd1fabf20ff5e9a7bc335b9b3f45658296efbcc46d0872716a01ff",
                            _score: null,
                            _source: {
                              score_info: {
                                end: {
                                  scored: 59,
                                  allowed: 87,
                                },
                              },
                              location_type: "Away",
                              opponent: {
                                team: "West Virginia",
                              },
                              date: "2024-11-04T17:33:14.991-05:00",
                              end_min: 40,
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: -1548.75,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Purdue Fort Wayne",
              doc_count: 20,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-02-15T12:00:00.000-10:00",
                    key: 1739656800000,
                    doc_count: 20,
                    def_poss: {
                      value: 71,
                    },
                    off_poss: {
                      value: 71,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 20,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "8ca8c8f0b2cb9e50cc4741e85c471dce907e23e4cfa949ea174a7ec790b0ea69",
                            _score: null,
                            _source: {
                              location_type: "Home",
                              end_min: 40,
                              date: "2025-02-15T17:36:40.991-05:00",
                              score_info: {
                                end: {
                                  scored: 76,
                                  allowed: 69,
                                },
                              },
                              opponent: {
                                team: "Purdue Fort Wayne",
                              },
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 347.5,
                    },
                  },
                ],
              },
            },
            {
              key: "N:Youngstown St.",
              doc_count: 20,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-03-11T00:00:00.000-10:00",
                    key: 1741687200000,
                    doc_count: 20,
                    def_poss: {
                      value: 66,
                    },
                    off_poss: {
                      value: 67,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 20,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "b3d014741d9fb45ffc73839b011a1cafb2fed918fe44151dda4e57cdc07790fa",
                            _score: null,
                            _source: {
                              location_type: "Neutral",
                              opponent: {
                                team: "Youngstown St.",
                              },
                              end_min: 40,
                              score_info: {
                                end: {
                                  scored: 89,
                                  allowed: 78,
                                },
                              },
                              date: "2025-03-11T17:38:51.990-04:00",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 420.75,
                    },
                  },
                ],
              },
            },
            {
              key: "A:IU Indy",
              doc_count: 19,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-02-27T12:00:00.000-10:00",
                    key: 1740693600000,
                    doc_count: 19,
                    def_poss: {
                      value: 58,
                    },
                    off_poss: {
                      value: 59,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 19,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "23c9d716bc0c99324555b974426c25013e89d44b9dbf212f92d8f021340a0412",
                            _score: null,
                            _source: {
                              score_info: {
                                end: {
                                  scored: 82,
                                  allowed: 68,
                                },
                              },
                              end_min: 40,
                              location_type: "Away",
                              date: "2025-02-27T17:39:10.691-05:00",
                              opponent: {
                                team: "IU Indy",
                              },
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 359.75,
                    },
                  },
                ],
              },
            },
            {
              key: "A:Northern Ky.",
              doc_count: 19,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-02-08T12:00:00.000-10:00",
                    key: 1739052000000,
                    doc_count: 19,
                    def_poss: {
                      value: 68,
                    },
                    off_poss: {
                      value: 68,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 19,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "cbb70e7dc2f3ecedccd947c9891ca7a493c944614474ce9a6cfda92f4cb98bc5",
                            _score: null,
                            _source: {
                              opponent: {
                                team: "Northern Ky.",
                              },
                              score_info: {
                                end: {
                                  scored: 81,
                                  allowed: 76,
                                },
                              },
                              date: "2025-02-08T17:37:36.993-05:00",
                              end_min: 40,
                              location_type: "Away",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: -76.5,
                    },
                  },
                ],
              },
            },
            {
              key: "A:Youngstown St.",
              doc_count: 19,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-01-22T12:00:00.000-10:00",
                    key: 1737583200000,
                    doc_count: 19,
                    def_poss: {
                      value: 64,
                    },
                    off_poss: {
                      value: 65,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 19,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "1cfaa4c1e448739662e956420fd8370dcb8a237090010de1592a4978f6ed1864",
                            _score: null,
                            _source: {
                              location_type: "Away",
                              date: "2025-01-22T17:35:04.993-05:00",
                              score_info: {
                                end: {
                                  allowed: 70,
                                  scored: 72,
                                },
                              },
                              opponent: {
                                team: "Youngstown St.",
                              },
                              end_min: 40,
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 130.25,
                    },
                  },
                ],
              },
            },
            {
              key: "H:IU Indy",
              doc_count: 19,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-01-30T12:00:00.000-10:00",
                    key: 1738274400000,
                    doc_count: 19,
                    def_poss: {
                      value: 71,
                    },
                    off_poss: {
                      value: 69,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 19,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "5e9db97fef89f9caab202924261ba5e6e69d6e64e11bb95cbb708ef86ed0077c",
                            _score: null,
                            _source: {
                              score_info: {
                                end: {
                                  allowed: 53,
                                  scored: 106,
                                },
                              },
                              date: "2025-01-30T17:37:25.992-05:00",
                              opponent: {
                                team: "IU Indy",
                              },
                              end_min: 40,
                              location_type: "Home",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 2198.25,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Milwaukee",
              doc_count: 19,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-02-23T12:00:00.000-10:00",
                    key: 1740348000000,
                    doc_count: 19,
                    def_poss: {
                      value: 65,
                    },
                    off_poss: {
                      value: 66,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 19,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "188f4cc1516377d230041de69e8245756784d5e4aa41f5537ee83f6f22d4c1d4",
                            _score: null,
                            _source: {
                              opponent: {
                                team: "Milwaukee",
                              },
                              location_type: "Home",
                              score_info: {
                                end: {
                                  scored: 72,
                                  allowed: 59,
                                },
                              },
                              date: "2025-02-23T17:37:12.993-05:00",
                              end_min: 40,
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 394.25,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Chatham",
              doc_count: 18,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-11-10T12:00:00.000-10:00",
                    key: 1731276000000,
                    doc_count: 18,
                    def_poss: {
                      value: 68,
                    },
                    off_poss: {
                      value: 67,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 18,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "28bef2d6e57e303c4b99eea6c3407ad578b6778a52c26560c1296f930cde6f13",
                            _score: null,
                            _source: {
                              score_info: {
                                end: {
                                  scored: 79,
                                  allowed: 51,
                                },
                              },
                              date: "2024-11-10T17:38:04.993-05:00",
                              location_type: "Home",
                              end_min: 40,
                              opponent: {
                                team: "Chatham",
                              },
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 1164,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Towson",
              doc_count: 18,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2024-12-17T12:00:00.000-10:00",
                    key: 1734472800000,
                    doc_count: 18,
                    def_poss: {
                      value: 62,
                    },
                    off_poss: {
                      value: 63,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 18,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "d2b244e4ca98e8ec60435b8032243110349115d4010e9b4350ea943f32d72edf",
                            _score: null,
                            _source: {
                              opponent: {
                                team: "Towson",
                              },
                              date: "2024-12-17T17:37:25.992-05:00",
                              score_info: {
                                end: {
                                  scored: 68,
                                  allowed: 67,
                                },
                              },
                              location_type: "Home",
                              end_min: 40,
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: -514.75,
                    },
                  },
                ],
              },
            },
            {
              key: "A:Detroit Mercy",
              doc_count: 17,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-01-02T12:00:00.000-10:00",
                    key: 1735855200000,
                    doc_count: 17,
                    def_poss: {
                      value: 73,
                    },
                    off_poss: {
                      value: 73,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 17,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "5abf41fb2df017a339e850cac8bd28d24dcedf375188a098d9147b382324bf6d",
                            _score: null,
                            _source: {
                              end_min: 45,
                              date: "2025-01-02T17:39:59.993-05:00",
                              opponent: {
                                team: "Detroit Mercy",
                              },
                              score_info: {
                                end: {
                                  scored: 76,
                                  allowed: 78,
                                },
                              },
                              location_type: "Away",
                            },
                            sort: [45],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 369,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Detroit Mercy",
              doc_count: 17,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-02-05T12:00:00.000-10:00",
                    key: 1738792800000,
                    doc_count: 17,
                    def_poss: {
                      value: 64,
                    },
                    off_poss: {
                      value: 64,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 17,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "51ad4cb7ea2b7900581cbb3fdbc00586f2c70c4fb2a1659b2093f0739758fa68",
                            _score: null,
                            _source: {
                              score_info: {
                                end: {
                                  scored: 71,
                                  allowed: 56,
                                },
                              },
                              location_type: "Home",
                              date: "2025-02-05T17:39:08.393-05:00",
                              opponent: {
                                team: "Detroit Mercy",
                              },
                              end_min: 40,
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 232.75,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Green Bay",
              doc_count: 17,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-02-21T12:00:00.000-10:00",
                    key: 1740175200000,
                    doc_count: 17,
                    def_poss: {
                      value: 73,
                    },
                    off_poss: {
                      value: 75,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 17,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "cb851562c03a960a2fbdb5495e7856fe00511550195c0d88a399aa9121692bfa",
                            _score: null,
                            _source: {
                              end_min: 40,
                              score_info: {
                                end: {
                                  scored: 94,
                                  allowed: 85,
                                },
                              },
                              date: "2025-02-21T17:36:44.992-05:00",
                              location_type: "Home",
                              opponent: {
                                team: "Green Bay",
                              },
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: 639.75,
                    },
                  },
                ],
              },
            },
            {
              key: "H:Oakland",
              doc_count: 17,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-01-25T12:00:00.000-10:00",
                    key: 1737842400000,
                    doc_count: 17,
                    def_poss: {
                      value: 64,
                    },
                    off_poss: {
                      value: 63,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 17,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "69d58c04a139316abc184e68c1873361e2f51e4f557827c3a24a22250a240ce9",
                            _score: null,
                            _source: {
                              score_info: {
                                end: {
                                  scored: 73,
                                  allowed: 71,
                                },
                              },
                              end_min: 40,
                              date: "2025-01-25T17:36:24.992-05:00",
                              opponent: {
                                team: "Oakland",
                              },
                              location_type: "Home",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: -68,
                    },
                  },
                ],
              },
            },
            {
              key: "A:Cleveland St.",
              doc_count: 15,
              game_info: {
                buckets: [
                  {
                    key_as_string: "2025-02-12T12:00:00.000-10:00",
                    key: 1739397600000,
                    doc_count: 15,
                    def_poss: {
                      value: 63,
                    },
                    off_poss: {
                      value: 63,
                    },
                    end_of_game: {
                      hits: {
                        total: {
                          value: 15,
                          relation: "eq",
                        },
                        max_score: null,
                        hits: [
                          {
                            _index: "horizon_2024_lping",
                            _id: "db795549a61b6a6c18a3e15fb692ca457b9bc7aa385afa60cc9e33738ea072f7",
                            _score: null,
                            _source: {
                              date: "2025-02-12T17:34:10.995-05:00",
                              score_info: {
                                end: {
                                  scored: 68,
                                  allowed: 59,
                                },
                              },
                              end_min: 40,
                              opponent: {
                                team: "Cleveland St.",
                              },
                              location_type: "Away",
                            },
                            sort: [40],
                          },
                        ],
                      },
                    },
                    avg_lead: {
                      value: -23.25,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      status: 200,
    },
  ],
};
