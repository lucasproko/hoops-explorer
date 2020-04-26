

import _ from 'lodash';

import { StatsUtils } from "../StatsUtils";
import { GameFilterParams, LineupFilterParams, TeamReportFilterParams } from "../utils/FilterModels";
import { samplePlayerStatsResponse } from "../../sample-data/samplePlayerStatsResponse";
import { sampleOrtgDiagnostics } from "../../sample-data/sampleOrtgDiagnostics";
import { sampleDrtgDiagnostics } from "../../sample-data/sampleDrtgDiagnostics";
import { LineupStatsModel } from './RosterStatsTable';

describe("StatsUtils", () => {
  test("StatsUtils - buildORtg", () => {
    const [ oRtg, adjORtg, oRtgDiags ] = StatsUtils.buildORtg(
      samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets[0], 100, true
    );
    expect(oRtg).toEqual({value:112.99672660419142});
    expect(adjORtg).toEqual({value:124.58254313564575});
    expect(oRtgDiags).toEqual(sampleOrtgDiagnostics);
  });
  test("StatsUtils - buildDRtg", () => {
    const [ dRtg, adjDRtg, dRtgDiags ] = StatsUtils.buildDRtg(
      samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets[0], 100, true
    );
    expect(dRtg).toEqual({value:110.2860531155855});
    expect(adjDRtg).toEqual({value:102.04282992219363});
    expect(dRtgDiags).toEqual(sampleDrtgDiagnostics);
  });
});
