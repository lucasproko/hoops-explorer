
import { HistoryManager } from "../HistoryManager"
import { GameFilterParams, LineupFilterParams } from "../utils/FilterModels";

describe("HistoryManager", () => {
  test("HistoryManager - gameFilterSummary", () => {
    const game1: GameFilterParams = {
      kind: "game",
      team: "test"
    };
    expect(HistoryManager.filterSummary(game1)).toBe(
      `On/Off: 2019/20 test (M): base:'', on:'', auto-off`
    );
    const game2: GameFilterParams = {
      kind: "game",
      team: "test",
      year: "2019/20", gender: "Men",
      minRank: "1", maxRank: "150",
      onQuery: "testOn", baseQuery: "testBase",
      offQuery: "testOff", autoOffQuery: "false",
    };
    expect(HistoryManager.filterSummary(game2)).toBe(
      `On/Off: 2019/20 test (M) [1:150]: base:'testBase', on:'testOn', off:'testOff'`
    );
  });
  test("HistoryManager - lineupFilterSummary", () => {
    const lineup1: LineupFilterParams = {
      kind: "lineup"
    };
    expect(HistoryManager.filterSummary(lineup1)).toBe(
      `Lineups: 2019/20  (M): query:'' (max:50, min-poss:5, sort:desc:off_poss)`
    );
    const lineup2: LineupFilterParams = {
      kind: "lineup", team: "team2",
      year: "2018/19", gender: "Women",
      lineupQuery: "test ''", maxTableSize: 11,
      minRank: "1", maxRank: "370",
      minPoss: 10, sortBy: "test-sort"
    };
    expect(HistoryManager.filterSummary(lineup2)).toBe(
      `Lineups: 2018/19 team2 (W): query:'test ""' (max:11, min-poss:10, sort:test-sort)`
    );
  });
});
