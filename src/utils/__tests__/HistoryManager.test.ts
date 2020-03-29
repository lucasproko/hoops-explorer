
// Lodash
import _ from "lodash";

import { HistoryManager } from "../HistoryManager";
import { GameFilterParams, LineupFilterParams, TeamReportFilterParams } from "../utils/FilterModels";

describe("HistoryManager", () => {
  test("HistoryManager - getHistory/addParamsToHistory/getLastQuery/clearHistory", () => {
    HistoryManager.addParamsToHistory("year=2019/20&gender=Men", "game-");
    expect(HistoryManager.getLastQuery("game-")).toBe("year=2019/20&gender=Men");
    expect(HistoryManager.getLastQuery("lineup-")).toBe(undefined);
    HistoryManager.addParamsToHistory("year=2018/9&gender=Women", "lineup-");
    expect(HistoryManager.getLastQuery("lineup-")).toBe("year=2018/9&gender=Women");
    expect(HistoryManager.getHistory()).toEqual(
      [
        ["lineup-", { year: "2018/9", gender: "Women" }],
        ["game-", { year: "2019/20", gender: "Men" }],
      ]
    );
    HistoryManager.addParamsToHistory("year=2019/20&gender=Men", "game-");
    expect(HistoryManager.getHistory()).toEqual(
      [
        ["game-", { year: "2019/20", gender: "Men" }],
        ["lineup-", { year: "2018/9", gender: "Women" }],
      ]
    );
    HistoryManager.addParamsToHistory("year=2018/19&gender=Men", "game-");
    expect(HistoryManager.getLastQuery("game-")).toBe("year=2018/19&gender=Men");

    HistoryManager.clearHistory();
    expect(HistoryManager.getLastQuery("game-")).toBe(undefined);
    expect(HistoryManager.getLastQuery("lineup-")).toBe(undefined);
    expect(HistoryManager.getHistory()).toEqual([]);
  });
  test("HistoryManager - gameFilterSummary", () => {
    const game1: GameFilterParams = {
      team: "test",
      sortBy: "desc:off_team_poss:baseline",
    };
    expect(HistoryManager.gameFilterSummary(game1)).toBe(
      `On/Off: 2019/20 test (M): on:'', auto-off, base:''`
    );
    const game1b: GameFilterParams = {
      team: "test",
      filter: "test-fil",
      sortBy: "test-sort",
      showDiag: true,
      showExpanded: true,
      showBase: true
    };
    expect(HistoryManager.gameFilterSummary(game1b)).toBe(
      `On/Off: 2019/20 test (M): on:'', auto-off, base:'', players:[sortBy:test-sort,filter:test-fil,show-base,show-defs,show-diags]`
    );
    const game2: GameFilterParams = {
      team: "test",
      year: "2019/20", gender: "Men",
      minRank: "1", maxRank: "150",
      onQuery: "testOn", baseQuery: "testBase",
      offQuery: "testOff", autoOffQuery: false,
      filterGarbage: true
    };
    expect(HistoryManager.filterSummary("game-", game2)).toBe(
      `On/Off: 2019/20 test (M) [1:150] [!garbage]: on:'testOn', off:'testOff', base:'testBase'`
    );
  });
  test("HistoryManager - lineupFilterSummary", () => {
    const lineup1: LineupFilterParams = {
    };
    expect(HistoryManager.lineupFilterSummary(lineup1)).toBe(
      `Lineups: 2019/20  (M): query:'' (max:50, min-poss:5, sort:desc:off_poss, filter:'')`
    );
    const lineup2: LineupFilterParams = {
      team: "team2",
      year: "2018/19", gender: "Women",
      baseQuery: "test ''", maxTableSize: 11,
      minRank: "1", maxRank: "370",
      minPoss: 10, sortBy: "test-sort",
      filter: "Test'Filter"
    };
    expect(HistoryManager.filterSummary("lineup-", lineup2)).toBe(
      `Lineups: 2018/19 team2 (W): query:'test ""' (max:11, min-poss:10, sort:test-sort, filter:'Test"Filter')`
    );
  });
  test("HistoryManager - teamReportFilterSummary", () => {
    const report1: TeamReportFilterParams = {
    };
    expect(HistoryManager.teamReportFilterSummary(report1)).toBe(
      `On/Off Report: 2019/20  (M): query:'' (sort:desc:off_poss, filter:'', show:[comps])`
    );
    const report2: TeamReportFilterParams = {
      team: "team3",
      year: "2018/19", gender: "Women",
      baseQuery: "test ''",
      minRank: "10", maxRank: "370",
      sortBy: "test-sort",
      players: [ "ignore1", "ignore2" ],
      filter: "Test'Filter",
      showComps: false
    };
    expect(HistoryManager.teamReportFilterSummary(report2)).toBe(
      `On/Off Report: 2018/19 team3 (W) [10:370]: query:'test ""' (sort:test-sort, filter:'Test"Filter', show:[])`
    );
    expect(HistoryManager.teamReportFilterSummary(_.merge(_.clone(report2), { showOnOff: false, showComps: true }))).toBe(
      `On/Off Report: 2018/19 team3 (W) [10:370]: query:'test ""' (sort:test-sort, filter:'Test"Filter', show:[!on/off,comps])`
    );
    expect(HistoryManager.teamReportFilterSummary(_.merge(_.clone(report2), { incRepOnOff: true, regressDiffs: 0 }))).toBe(
      `On/Off Report: 2018/19 team3 (W) [10:370]: query:'test ""' (sort:test-sort, filter:'Test"Filter', show:[r:on-off:R0])`
    );
    expect(HistoryManager.teamReportFilterSummary(_.merge(_.clone(report2), { incRepOnOff: true, repOnOffDiagMode: 10 }))).toBe(
      `On/Off Report: 2018/19 team3 (W) [10:370]: query:'test ""' (sort:test-sort, filter:'Test"Filter', show:[r:on-off,r:on-off:diag])`
    );
  });
});
