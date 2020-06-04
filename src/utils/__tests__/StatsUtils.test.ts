

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
    expect(adjORtg).toEqual({value:4.916508627129151});
    expect(oRtgDiags).toEqual(sampleOrtgDiagnostics);
  });
  test("StatsUtils - buildDRtg", () => {
    const [ dRtg, adjDRtg, dRtgDiags ] = StatsUtils.buildDRtg(
      samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets[0], 100, true
    );
    expect(dRtg).toEqual({value:110.2860531155855});
    expect(adjDRtg).toEqual({value:0.4085659844387266});
    expect(dRtgDiags).toEqual(sampleDrtgDiagnostics);
  });
  test("StatsUtils - buildPositionConfidences", () => {

    const tidyArr = (vv: number[]) => vv.map((v: number) => v.toFixed(2))
    const tidyObj = (vo: Record<string, number>) => _.mapValues(vo, (v: number) => v.toFixed(2))

    // Some hand-checked results:

    const [ realConfidences, realDiags ] = StatsUtils.buildPositionConfidences(
      samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets[0]
    );
    expect(tidyArr(realConfidences)).toEqual(["0.98", "0.02", "0.00", "0.00", "0.00", ]);
    expect(tidyArr(realDiags.scores)).toEqual(["2.75","-1.33","-6.64","-13.02","-5.72"]);
    expect(tidyObj(realDiags.calculated)).toEqual({
      "assist_per_fga": "0.41",
      "ast_tov": "2.09",
      "ft_relative_inv": "0.59", // 47% eFG / (166/206)
      "mid_relative": "0.91",
      "rim_relative": "1.07",
      "three_relative": "1.02"
    });

    const [ realConfidences2, realDiags2 ] = StatsUtils.buildPositionConfidences(
      samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets[1]
    );
    expect(tidyArr(realConfidences2)).toEqual(["0.71", "0.19", "0.01", "0.00", "0.09", ]);
  });
});
