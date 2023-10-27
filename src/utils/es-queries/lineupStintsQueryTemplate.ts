import { commonRuntimeMappings } from "./commonRuntimeMappings";
import { commonTeamQuery, buildQueryFiltersBoolArray } from "./commonTeamQuery";
import { QueryUtils } from "../QueryUtils";
import { CommonFilterParams } from "../FilterModels";

export const lineupStintsQuery = function (
  params: CommonFilterParams,
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
      excludes: ["agent", "host", "log", "ecs"],
    },
    sort: ["start_min"],
    size: 200,
    query: {
      bool: {
        filter: [],
        minimum_should_match: QueryUtils.invertedQueryMode(params) ? 1 : 0,
        //(special internal invert mode for getting linueps for on/off)
        should: QueryUtils.invertedQueryMode(params)
          ? buildQueryFiltersBoolArray(
              params.invertBaseQueryFilters,
              params.gender,
              params.year,
              lastDate
            )
              .map((clause) => {
                return {
                  bool: {
                    must_not: [clause],
                  },
                };
              })
              .concat([
                {
                  query_string: {
                    query: `NOT (${QueryUtils.basicOrAdvancedQuery(
                      params.invertBase,
                      "NOT *"
                    )})`,
                  },
                },
              ] as any[])
          : [],
        must_not: [],
        must: [
          commonTeamQuery(params, lastDate, publicEfficiency, lookup),
          {
            query_string: {
              query: `${QueryUtils.basicOrAdvancedQuery(
                params.baseQuery,
                "*"
              )}`,
            },
          },
        ],
      },
    },
  };
};
