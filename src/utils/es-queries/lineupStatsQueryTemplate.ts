import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonLineupAggregations } from "./commonLineupAggregations";

export const lineupStatsQuery = function(params: any, publicEfficiency: any, lookup: any) {
  return {
     "_source": {
        "includes": [],
        "excludes": []
     },
     "size": 0,
     "aggregations": {
        "lineups": {
           "aggregations": {
             ...commonLineupAggregations(publicEfficiency, lookup),
             "sort_by_poss": {
                "bucket_sort": {
                  "sort": [
                     {"off_poss": {"order": "desc"}},
                  ]
                }
             },
             "filter_by_poss": {
                "bucket_selector": {
                  "buckets_path": {
                    "offPoss": "off_poss",
                    "defPoss": "def_poss"
                  },
                  "script": "params.offPoss >= 10 && params.defPoss >= 10"
                }
              }
           },
           "terms": {
             "field": "lineup_id.keyword", //TODO: 2015/6 has wrong mapping?!
             "size": 200
           }
        }
     },
     "query": {
       "bool": {
          "filter": [],
          "must_not": [],
          "should": [],
          "must": [
             commonTeamQuery(params, publicEfficiency, lookup),
             {
               "query_string": {
                  "query": `players.id:(${params.lineupQuery || "*"})`
               }
             }
          ]
        }
      }
  };
}
