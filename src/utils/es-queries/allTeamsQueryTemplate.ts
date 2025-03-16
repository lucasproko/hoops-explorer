import _ from "lodash";

import { commonRuntimeMappings } from "./commonRuntimeMappings";
import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import {
  commonAggregations,
  commonLineupAggregations,
} from "./commonLineupAggregations";
import { GameFilterParams } from "../FilterModels";

export const allTeamStatsQuery = function (
  params: GameFilterParams,
  lastDate: number,
  publicEfficiency: any,
  lookup: any,
  avgEfficiency: number,
  hca: number
) {
  // For checking conf results:
  //params.team = "*";

  return {
    ...commonRuntimeMappings(params, lastDate, publicEfficiency, lookup, false),
    _source: {
      includes: [],
      excludes: [],
    },
    size: 0,
    aggregations: {
      tri_filter: {
        filters: commonOnOffBaseQuery(params, lastDate),
        aggregations: {
          teams: {
            terms: {
              size: 400,
              field: "team.team.keyword",
            },
            aggregations: {
              ...commonLineupAggregations(
                publicEfficiency,
                lookup,
                avgEfficiency,
                hca
              ),
            },
          },
        },
      },
    },
    query: commonTeamQuery(params, lastDate, publicEfficiency, lookup, false), //(look for opponent instead of team)
  };
};
