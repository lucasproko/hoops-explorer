
import { LineupUtils } from "../LineupUtils"
import { GameFilterParams, LineupFilterParams, TeamReportFilterParams } from "../utils/FilterModels";
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse";
import { LineupStatsModel } from './LineupStatsTable';

describe("LineupUtils", () => {
  test("LineupUtils - lineupToTeamReport", () => {

    const lineupReport: LineupStatsModel = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets,
      avgOff: 100.0,
      error_code: "test"
    };

    const onOffReport = LineupUtils.lineupToTeamReport(lineupReport);

    expect(onOffReport).toEqual({});
    // HistoryManager.addParamsToHistory("game-year=2019/20&gender=Men");
    // HistoryManager.addParamsToHistory("lineup-year=2018/9&gender=Women");
    // expect(HistoryManager.getHistory()).toEqual(
    //   [
    //     ["lineup-", { year: "2018/9", gender: "Women" }],
    //     ["game-", { year: "2019/20", gender: "Men" }],
    //   ]
    // )
    // HistoryManager.addParamsToHistory("game-year=2019/20&gender=Men");
    // expect(HistoryManager.getHistory()).toEqual(
    //   [
    //     ["game-", { year: "2019/20", gender: "Men" }],
    //     ["lineup-", { year: "2018/9", gender: "Women" }],
    //   ]
    // )
  });
});
