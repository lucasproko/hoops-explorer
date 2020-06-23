

import _ from 'lodash';

import { RatingUtils } from "../RatingUtils";
import { GameFilterParams, LineupFilterParams, TeamReportFilterParams } from "../../FilterModels";
import { samplePlayerStatsResponse } from "../../../sample-data/samplePlayerStatsResponse";
import { sampleOrtgDiagnostics } from "../../../sample-data/sampleOrtgDiagnostics";
import { sampleDrtgDiagnostics } from "../../../sample-data/sampleDrtgDiagnostics";

describe("RatingUtils", () => {
  test("RatingUtils - buildORtg", () => {
    const [ oRtg, adjORtg, oRtgDiags ] = RatingUtils.buildORtg(
      samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets[0], 100, true
    );
    expect(oRtg).toEqual({value:112.99672660419142});
    expect(adjORtg).toEqual({value:4.916508627129151});
    expect(oRtgDiags).toEqual(sampleOrtgDiagnostics);
  });
  test("RatingUtils - buildDRtg", () => {
    const [ dRtg, adjDRtg, dRtgDiags ] = RatingUtils.buildDRtg(
      samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets[0], 100, true
    );
    expect(dRtg).toEqual({value:110.2860531155855});
    expect(adjDRtg).toEqual({value:0.4085659844387266});
    expect(dRtgDiags).toEqual(sampleDrtgDiagnostics);
  });
});
