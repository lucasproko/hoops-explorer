import _ from "lodash";

import { commonRuntimeMappings } from "./commonRuntimeMappings";
import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonLineupAggregations, commonAggregations } from "./commonLineupAggregations";
import { GameFilterParams } from "../FilterModels";


export const teamStatsQuery = function(
  params: GameFilterParams,
  lastDate: number, publicEfficiency: any, lookup: any, avgEfficiency: number, hca: number
) {
  return {
    ...commonRuntimeMappings(params, lastDate, publicEfficiency, lookup),
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
             "aggregations": {
               ...(_.pick(
                 commonAggregations("team_stats", "off", publicEfficiency, lookup, avgEfficiency, hca),
                 [ "total_off_3p_attempts" ]
              )),
               ...(_.pick(
                 commonAggregations("opponent_stats", "def", publicEfficiency, lookup, avgEfficiency, hca),
                 [ "def_3p", "def_poss", "total_def_poss", "total_def_3p_attempts", "total_def_3p_made", "def_3p_opp" ]
              ))
            }
           }
         }
       },
       "tri_filter": {
           "aggregations": commonLineupAggregations(publicEfficiency, lookup, avgEfficiency, hca),
           "filters": commonOnOffBaseQuery(params)
       }
     },
     "query": commonTeamQuery(params, lastDate, publicEfficiency, lookup)
  };
}
