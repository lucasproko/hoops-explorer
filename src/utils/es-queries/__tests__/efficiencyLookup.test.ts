
import { efficiencyLookup, formatEfficiencyLookupResponse } from "../efficiencyLookup";

describe("efficiencyLookup", () => {

  expect.addSnapshotSerializer({
    test: (val: any) => true,
    print: (val: any) => JSON.stringify(val, null, 3)
  });

  test("efficiencyLookup", () => {

    expect(efficiencyLookup("2021", { test: { field: "value" } })).toMatchSnapshot();
  });
  test("formatEfficiencyLookupResponse", () => {
    const input = {
      "took": 59,
      "timed_out": false,
      "_shards": {
        "total": 5,
        "successful": 5,
        "skipped": 0,
        "failed": 0
      },
      "hits": {
        "total": {
          "value": 348,
          "relation": "eq"
        },
        "max_score": null,
        "hits": [{
          "_index": "kenpom_all",
          "_type": "doc",
          "_id": "Gonzaga 2021",
          "_score": null,
          "_source": {
            "ncaa_seed": 1,
            "stats": {
              "adj_off": {
                "rank": 1,
                "value": 126.4
              },
              "adj_tempo": {
                "rank": 7,
                "value": 73.8
              },
              "adj_def": {
                "rank": 11,
                "value": 89.9
              },
              "off": {
                "_3p_pct": {
                  "value": 36.8
                }
              },
              "adj_margin": {
                "rank": 1,
                "value": 36.5
              }
            },
            "team_season": {
              "year": 2021
            },
            "conf": "West Coast Conference"
          },
          "fields": {
            "total_poss": [2387],
            "ncaa_name": ["Gonzaga"]
          },
          "sort": [1]
        }, {
          "_index": "kenpom_all",
          "_type": "doc",
          "_id": "Baylor 2021",
          "_score": null,
          "_source": {
            //removed seed for test purposes
            "stats": {
              "adj_off": {
                "rank": 2,
                "value": 125
              },
              "adj_tempo": {
                "rank": 213,
                "value": 67.4
              },
              "adj_margin": {
                "rank": 2,
                "value": 33.900000000000006
              },
              "adj_def": {
                "rank": 22,
                "value": 91.1
              },
              "off": {
                "_3p_pct": {
                  "value": 41.3
                }
              }
            },
            "team_season": {
              "year": 2021
            },
            "conf": "Big 12 Conference"
          },
          "fields": {
            "total_poss": [2086],
            "ncaa_name": ["Baylor"]
          },
          "sort": [2]
        }, {
          "_index": "kenpom_all",
          "_type": "doc",
          "_id": "Michigan 2021",
          "_score": null,
          "_source": {
            "ncaa_seed": 1,
            "stats": {
              "adj_off": {
                "rank": 9,
                "value": 117.6
              },
              "adj_tempo": {
                "rank": 256,
                "value": 66.6
              },
              "adj_margin": {
                "rank": 3,
                "value": 29.69999999999999
              },
              "adj_def": {
                "rank": 4,
                "value": 87.9
              },
              "off": {
                "_3p_pct": {
                  "value": 38.1
                }
              }
            },
            "team_season": {
              "year": 2021
            },
            "conf": "Big Ten Conference"
          },
          "fields": {
            "total_poss": [1902],
            "ncaa_name": ["Michigan"]
          },
          "sort": [3]
        }]
      }
    }
    expect(formatEfficiencyLookupResponse(input)).toMatchSnapshot();
  });

});
