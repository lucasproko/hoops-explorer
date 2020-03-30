

import _ from 'lodash';

import { StatsUtils } from "../StatsUtils";
import { GameFilterParams, LineupFilterParams, TeamReportFilterParams } from "../utils/FilterModels";
import { samplePlayerStatsResponse } from "../../sample-data/samplePlayerStatsResponse";
import { sampleOrtgDiagnostics } from "../../sample-data/sampleOrtgDiagnostics";
import { LineupStatsModel } from './RosterStatsTable';

describe("LineupUtils", () => {
  test("StatsUtils - StatsUtils", () => {
    const [ oRtg, oRtgDiags ] = StatsUtils.buildORtg(
      samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets[0], true
    );
    expect(oRtg).toEqual({value:112.99672660419142});
    expect(oRtgDiags).toEqual(sampleOrtgDiagnostics);
  });
});
