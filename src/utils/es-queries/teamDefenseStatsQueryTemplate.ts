import _ from "lodash";

import { commonRuntimeMappings } from "./commonRuntimeMappings";
import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import {
  commonLineupAggregations,
  commonAggregations,
} from "./commonLineupAggregations";
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
              field: "team.team.keyword",
            },
            aggregations: {
              ..._.pick(
                commonAggregations(
                  "team_stats",
                  "off",
                  publicEfficiency,
                  lookup,
                  avgEfficiency,
                  hca
                ),
                [
                  // These are needed for play style analysis
                  "off_poss",
                  "total_off_poss",
                  "total_off_fga",
                  "total_off_fta",
                  "total_off_to",
                  "total_off_assist",
                  "total_off_scramble_to",
                  "total_off_trans_to",
                ]
              ),
            },
          },
        },
      },
    },
    query: commonTeamQuery(params, lastDate, publicEfficiency, lookup, true), //(look for opponent instead of team)
  };
};
