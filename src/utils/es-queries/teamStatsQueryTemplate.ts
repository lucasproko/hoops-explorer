import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonLineupAggregations } from "./commonLineupAggregations";
import { GameFilterParams } from "../FilterModels";


export const teamStatsQuery = function(params: GameFilterParams, publicEfficiency: any, lookup: any) {
  return {
     "_source": {
        "includes": [],
        "excludes": []
     },
     "size": 0,
     "aggregations": {
        "tri_filter": {
           "aggregations": commonLineupAggregations(publicEfficiency, lookup),
           "filters": commonOnOffBaseQuery(params)
        }
     },
     "query": commonTeamQuery(params, publicEfficiency, lookup)
  };
}
