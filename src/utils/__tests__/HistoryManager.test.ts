
// Lodash
import _ from "lodash";
import { ParamDefaults, GameFilterParams, LineupFilterParams, TeamReportFilterParams } from "../FilterModels";
import { HistoryManager } from "../HistoryManager";

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
      year: "2019/20",
      sortBy: "desc:off_team_poss_pct:baseline",
    };
    expect(HistoryManager.gameFilterSummary(game1)).toBe(
      `On/Off: 2019/20 test (M): on:'', auto-off, base:''`
    );
    const game1b: GameFilterParams = { //(need to change this every season)
      team: "test",
      showOnOffLuckDiags: true,
      filter: "test-fil",
      sortBy: "test-sort",
      showDiag: true,
      showPosDiag: true,
      teamDiffs: true,
      showPlayerPlayTypes: true,
      showExpanded: true,
      showBase: true,
      possAsPct: false
    };
    expect(HistoryManager.gameFilterSummary(game1b)).toBe(
      `On/Off: ${ParamDefaults.defaultYear} test (M): on:'', auto-off, base:'', team:[show-on-off-luck-diags,show-diffs], players:[sort:test-sort,filter:test-fil,show-base,show-def,show-rtg-diags,show-pos-diags,show-play-types,poss-#]`
    );
    const game2: GameFilterParams = {
      team: "test",
      manual: [{ newVal: 1, rowId: "test", use: true, statName: "test" }],
      showTeamPlayTypes: true,
      showExtraInfo: true,
      showRoster: true,
      year: "2019/20", gender: "Men",
      minRank: "1", maxRank: "150",
      onQuery: "testOn", baseQuery: "testBase",
      offQuery: "testOff", autoOffQuery: false,
      luck: { base: "baseline" },
      onOffLuck: true,
      filterGarbage: true, queryFilters: "Conf"
    };
    expect(HistoryManager.filterSummary("game-", game2)).toBe(
      `On/Off: 2019/20 test (M) [1:150] [!garbage] [+Conf]: on:'testOn', off:'testOff', base:'testBase', luck:[baseline], [overrides], team:[on-off-luck,show-roster,show-play-types,show-extra-info]`
    );
  });
  test("HistoryManager - lineupFilterSummary", () => { //(need to change this every season)
    const lineup1: LineupFilterParams = {
    };
    expect(HistoryManager.lineupFilterSummary(lineup1)).toBe(
      `Lineups: ${ParamDefaults.defaultYear}  (M): query:'' (max:50, min-poss:5)`
    );
    const lineup2: LineupFilterParams = {
      team: "team2",
      year: "2018/19", gender: "Women",
      baseQuery: "test ''", maxTableSize: "11",
      minRank: "1", maxRank: "370",
      decorate: true,
      minPoss: "10", sortBy: "test-sort",
      filter: "Test'Filter",
      luck: { base: "baseline" },
      showLineupLuckDiags: true
    };
    expect(HistoryManager.filterSummary("lineup-", lineup2)).toBe(
      `Lineups: 2018/19 team2 (W): query:'test ""', luck:[baseline], show-lineup-luck-diags (max:11, min-poss:10, sort:test-sort, filter:'Test"Filter')`
    );
    const lineup3: LineupFilterParams = {
      team: "team2",
      year: "2018/19", gender: "Women",
      baseQuery: "test ''", maxTableSize: "11",
      minRank: "1", maxRank: "370",
      decorate: false,
      showTotal: true,
      minPoss: "10", sortBy: "test-sort",
      filter: "Test'Filter",
      lineupLuck: true,
      aggByPos: "PG"
    };
    expect(HistoryManager.filterSummary("lineup-", lineup3)).toBe(
      `Lineups: 2018/19 team2 (W): query:'test ""', lineup-luck (max:11, min-poss:10, plain, show-total, sort:test-sort, filter:'Test"Filter', agg-by-pg)`
    );
  });
  test("HistoryManager - teamReportFilterSummary", () => {
    const report1: TeamReportFilterParams = { //(need to change this every season)
    };
    expect(HistoryManager.teamReportFilterSummary(report1)).toBe(
      `On/Off Report: ${ParamDefaults.defaultYear}  (M): query:'' (sort:desc:off_poss, filter:'', show:[])`
    );
    const report2: TeamReportFilterParams = {
      team: "team3",
      year: "2018/19", gender: "Women",
      baseQuery: "test ''",
      minRank: "10", maxRank: "370",
      sortBy: "test-sort",
      filter: "Test'Filter",
      showComps: false
    };
    expect(HistoryManager.teamReportFilterSummary(report2)).toBe(
      `On/Off Report: 2018/19 team3 (W) [10:370]: query:'test ""' (sort:test-sort, filter:'Test"Filter', show:[])`
    );
    expect(HistoryManager.teamReportFilterSummary(_.assign(_.clone(report2), { teamLuck: true, showOnOff: false, showComps: true }))).toBe(
      `On/Off Report: 2018/19 team3 (W) [10:370]: query:'test ""', team-luck (sort:test-sort, filter:'Test"Filter', show:[!on/off,comps])`
    );
    expect(HistoryManager.teamReportFilterSummary(_.assign(_.clone(report2), { teamLuck: true, luck: { base: "baseline" }, incRepOnOff: true, regressDiffs: 0 }))).toBe(
      `On/Off Report: 2018/19 team3 (W) [10:370]: query:'test ""', luck:[baseline], team-luck (sort:test-sort, filter:'Test"Filter', show:[r:on-off:R0])`
    );
    expect(HistoryManager.teamReportFilterSummary(_.assign(_.clone(report2), { incRapm: true, rapmDiagMode: "" }))).toBe(
      `On/Off Report: 2018/19 team3 (W) [10:370]: query:'test ""' (sort:test-sort, filter:'Test"Filter', show:[rapm])`
    );
    expect(HistoryManager.teamReportFilterSummary(_.assign(_.clone(report2), { incRapm: true, rapmDiagMode: "base", rapmPriorMode: 0.5 }))).toBe(
      `On/Off Report: 2018/19 team3 (W) [10:370]: query:'test ""' (sort:test-sort, filter:'Test"Filter', show:[rapm:prior=0.5,rapm:diag])`
    );
    expect(HistoryManager.teamReportFilterSummary(_.assign(_.clone(report2), { incRepOnOff: true, repOnOffDiagMode: 10 }))).toBe(
      `On/Off Report: 2018/19 team3 (W) [10:370]: query:'test ""' (sort:test-sort, filter:'Test"Filter', show:[r:on-off,r:on-off:diag])`
    );
  });
});
