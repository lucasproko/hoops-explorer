
import { playerStatsQuery } from "../playerStatsQueryTemplate";
import { samplePlayerQueryRequest } from "../../../sample-data/samplePlayerQueryRequest";

describe("playerStatsQuery", () => {
  test("playerStatsQuery", () => {

    const test = playerStatsQuery({
      team: "TestTeam", year: "2019",
      minRank: "10", maxRank: "100",
      baseQuery: "base",
      onQuery: "on", offQuery: "off"
    }, 0, { "team": { "stats": 0 } }, {
      "name1": "name1b"
    }, 100.0);

    expect(test).toEqual(samplePlayerQueryRequest);
  });
});
