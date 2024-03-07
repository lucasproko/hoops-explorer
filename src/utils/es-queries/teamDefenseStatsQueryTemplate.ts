import _ from "lodash";

import { commonRuntimeMappings } from "./commonRuntimeMappings";
import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import {
  commonLineupAggregations,
  commonAggregations,
} from "./commonLineupAggregations";
import { buildGameInfoRequest } from "./lineupStatsQueryTemplate";
import { GameFilterParams } from "../FilterModels";

export const teamDefenseStatsQuery = function (
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
    ...commonRuntimeMappings(params, lastDate, publicEfficiency, lookup),
    _source: {
      includes: [],
      excludes: [],
    },
    size: 0,
    aggregations: {
      tri_filter: {
        filters: commonOnOffBaseQuery(params, lastDate),
        aggregations: {
          opponents: {
            terms: {
              size: 100,
              field: "opponent.team.keyword",
            },
            aggregations: {
              ..._.pick(
                commonAggregations(
                  "team_stats",
                  "def",
                  publicEfficiency,
                  lookup,
                  avgEfficiency,
                  hca
                ),
                [
                  // These are needed for play style analysis
                  "total_def_fga",
                  "total_def_fta",
                  "total_def_to",
                  "total_def_assist",
                  "total_def_scramble_to",
                  "total_def_trans_to",
                ]
              ),
            },
          },
        },
      },
    },
    query: commonTeamQuery(params, lastDate, publicEfficiency, lookup),
  };
};
