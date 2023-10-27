import _ from "lodash";

import { commonTeamQuery } from "./commonTeamQuery";
import { buildGameInfoRequest } from "./lineupStatsQueryTemplate";
import { CommonFilterParams } from "../FilterModels";

export const gameInfoQuery = function (
  params: CommonFilterParams,
  lastDate: number
) {
  return {
    _source: {
      includes: [],
      excludes: [],
    },
    size: 0,
    aggregations: {
      ...buildGameInfoRequest("final_scores"),
    },
    query: commonTeamQuery(params, lastDate, {}, {}),
  };
};
