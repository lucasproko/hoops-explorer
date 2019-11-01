import { ncaaToKenpomLookup } from "./ncaaToKenpomLookup";
import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonLineupAggregations } from "./commonLineupAggregations";

export const teamStatsQuery = function(params: any, publicKenpomEfficiency: any) {
  return {
     "_source": {
        "includes": [],
        "excludes": []
     },
     "size": 0,
     "aggregations": {
        "tri_filter": {
           "aggregations": commonLineupAggregations(publicKenpomEfficiency),
           "filters": commonOnOffBaseQuery(params)
        }
     },
     "query": commonTeamQuery(params, publicKenpomEfficiency)
  };
}
