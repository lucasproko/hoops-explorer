

import _ from 'lodash';

import { RatingUtils } from "../RatingUtils";
import { GameFilterParams, LineupFilterParams, TeamReportFilterParams } from "../../FilterModels";
import { samplePlayerStatsResponse } from "../../../sample-data/samplePlayerStatsResponse";
import { sampleOrtgDiagnostics } from "../../../sample-data/sampleOrtgDiagnostics";
import { sampleDrtgDiagnostics } from "../../../sample-data/sampleDrtgDiagnostics";

describe("RatingUtils", () => {
  test("RatingUtils - buildORtg", () => {
    const playerInfo = _.cloneDeep(
      samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets[0]
    );
    const [ oRtg, adjORtg, rawORtg, rawAdjORtg, oRtgDiags ] = RatingUtils.buildORtg(
      playerInfo, 100, true, false
    );
    const expORtg = {value:112.99672660419142};
    const expORtgAdj = {value:4.916508627129151};
    expect(oRtg).toEqual(expORtg);
    expect(adjORtg).toEqual(expORtgAdj);
    expect(rawORtg).toEqual(undefined);
    expect(rawAdjORtg).toEqual(undefined);
    expect(oRtgDiags).toEqual(sampleOrtgDiagnostics);

    // Check with override:
    (playerInfo as any).off_3p = {
      value: playerInfo.off_3p.value - 0.1,
      old_value: playerInfo.off_3p.value
    };
    const [ oRtg2, adjORtg2, rawORtg2, rawAdjORtg2, oRtgDiags2 ] = RatingUtils.buildORtg(
      playerInfo, 100, true, true
    );
    expect(oRtg2).toEqual({value:104.58916190012069});
    expect(adjORtg2).toEqual({value:3.04109682502357});
    expect(rawORtg2).toEqual(expORtg);
    expect(rawAdjORtg2).toEqual(expORtgAdj);
  });
  test("RatingUtils - buildDRtg", () => {
    const playerInfo = _.cloneDeep(
      samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets[0]
    );
    const [ dRtg, adjDRtg, rawDRtg, rawAdjDRtg, dRtgDiags ] = RatingUtils.buildDRtg(
      playerInfo, 100, true, false
    );
    const expDRtg = {value:110.2860531155855};
    const expDRtgAdj = {value:0.4085659844387266};
    expect(dRtg).toEqual(expDRtg);
    expect(adjDRtg).toEqual(expDRtgAdj);
    expect(rawDRtg).toEqual(undefined)
    expect(rawAdjDRtg).toEqual(undefined)
    expect(dRtgDiags).toEqual(sampleDrtgDiagnostics);

    // Check with override:
    (playerInfo as any).oppo_def_3p = {
      value: 0.3,
      old_value: 0.4
    };
    const [ dRtg2, adjDRtg2, rawDRtg2, rawAdjDRtg2, dRtgDiags2 ] = RatingUtils.buildDRtg(
      playerInfo, 100, true, true
    );
    expect(dRtg2).toEqual({value:102.47503482022093});
    expect(adjDRtg2).toEqual({value:-1.0368722897874307});
    expect(rawDRtg2).toEqual(expDRtg);
    expect(rawAdjDRtg2).toEqual(expDRtgAdj);
  });
});
