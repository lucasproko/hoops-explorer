import _ from "lodash";

import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonLineupAggregations, commonAggregations } from "./commonLineupAggregations";
import { GameFilterParams } from "../FilterModels";


export const teamStatsQuery = function(
  params: GameFilterParams,
  lastDate: number, publicEfficiency: any, lookup: any, avgEfficiency: number
) {
  return {
     "_source": {
        "includes": [],
        "excludes": []
     },
     "size": 0,
     "aggregations": {
       "global": {
         "global": {},
         "aggregations": {
           "only": {
             "filters": {
               "filters": {
                 "team": {
                   "term": {
                     "team.team.keyword": `${params.team}`
                   }
                 }
               }
             },
             "aggregations": _.pick(
               commonAggregations("opponent_stats", "def", publicEfficiency, lookup, avgEfficiency),
               [ "def_3p", "def_poss", "total_def_poss", "total_def_3p_attempts", "total_def_3p_made", "def_3p_opp" ]
             )
           }
         }
       },
       "tri_filter": {
           "aggregations": commonLineupAggregations(publicEfficiency, lookup, avgEfficiency),
           "filters": commonOnOffBaseQuery(params)
       }
     },
     "query": commonTeamQuery(params, lastDate, publicEfficiency, lookup)
  };
}
