
import { lineupStatsQuery } from "../lineupStatsQueryTemplate";
import { sampleLineupQueryRequest } from "../../../sample-data/sampleLineupQueryRequest";

describe("lineupStatsQuery", () => {
  test("lineupStatsQuery", () => {

    const test = lineupStatsQuery({
      minRank: "10", maxRank: "100",
      baseQuery: "base",
    }, { "team": { "stats": 0 } }, {
      "name1": "name1b"
    }, 100.0);

    expect(test).toEqual(sampleLineupQueryRequest);

  });
});
