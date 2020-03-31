
import { teamStatsQuery } from "../teamStatsQueryTemplate";
import { sampleTeamQueryRequest } from "../../../sample-data/sampleTeamQueryRequest";

describe("teamStatsQuery", () => {
  test("teamStatsQuery", () => {

    const test = teamStatsQuery({
      minRank: "10", maxRank: "100",
      baseQuery: "base",
      onQuery: "on", offQuery: "off"
    }, { "team": { "stats": 0 } }, {
      "name1": "name1b"
    }, 100.0);

    expect(test).toEqual(sampleTeamQueryRequest);
  });
});
