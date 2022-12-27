import _ from "lodash";

import { commonRuntimeMappings } from "./commonRuntimeMappings";
import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonLineupAggregations, commonAggregations } from "./commonLineupAggregations";
import { buildGameInfoRequest } from "./lineupStatsQueryTemplate";
import { CommonFilterParams, GameFilterParams } from "../FilterModels";


export const gameInfoQuery = function(
  params: CommonFilterParams,
  lastDate: number, 
) {
  return {
     "_source": {
        "includes": [],
        "excludes": []
     },
     "size": 0,
     "aggregations": {
         ...(buildGameInfoRequest("final_scores")),
     },
     "query": commonTeamQuery(params, lastDate, {}, {})
  };
}
