import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonLineupAggregations } from "./commonLineupAggregations";
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
        "tri_filter": {
           "aggregations": commonLineupAggregations(publicEfficiency, lookup, avgEfficiency),
           "filters": commonOnOffBaseQuery(params)
        }
     },
     "query": commonTeamQuery(params, lastDate, publicEfficiency, lookup)
  };
}
