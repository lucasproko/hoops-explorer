import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonLineupAggregations } from "./commonLineupAggregations";

export const teamStatsQuery = function(params: any, publicEfficiency: any, lookup: any) {
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
