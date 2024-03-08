import { commonRuntimeMappings } from "./commonRuntimeMappings";
import { commonTeamQuery } from "./commonTeamQuery";
import { commonOnOffBaseQuery } from "./commonOnOffBaseQuery";
import { commonPlayerAggregations } from "./commonPlayerAggregations";
import { GameFilterParams } from "../FilterModels";
import { buildGameInfoRequest } from "./lineupStatsQueryTemplate";

export const playerStatsQuery = function (
  params: GameFilterParams,
  lastDate: number,
  publicEfficiency: any,
  lookup: any,
  avgEfficiency: number,
  hca: number
) {
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
          player: {
            terms: {
              field: "player.id.keyword",
              size: 100,
            },
            aggregations: {
              ...(params.getGames ? buildGameInfoRequest("final_scores") : {}),
              ...commonPlayerAggregations(
                publicEfficiency,
                lookup,
                avgEfficiency,
                hca
              ),
              player_array: {
                top_hits: {
                  size: 1,
                  _source: {
                    includes: "player",
                  },
                },
              },
            },
          },
        },
      },
    },
    query: commonTeamQuery(params, lastDate, publicEfficiency, lookup),
  };
};
