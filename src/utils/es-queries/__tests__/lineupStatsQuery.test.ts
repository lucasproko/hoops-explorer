
import { lineupStatsQuery } from "../lineupStatsQueryTemplate";
import { sampleLineupQueryRequest } from "../../../sample-data/sampleLineupQueryRequest";

describe("lineupStatsQuery", () => {
  test("lineupStatsQuery", () => {

    const test = lineupStatsQuery({
      team: "TestTeam", year: "2019",
      minRank: "10", maxRank: "100",
      baseQuery: "base",
    }, 0, { "team": { "stats": 0 } }, {
      "name1": "name1b"
    }, 100.0);

    expect(test).toEqual(sampleLineupQueryRequest);

  });
});
