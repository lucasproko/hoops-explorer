
import { teamStatsQuery } from "../teamStatsQueryTemplate";
import { sampleTeamQueryRequest } from "../../../sample-data/sampleTeamQueryRequest";

describe("teamStatsQuery", () => {
  test("teamStatsQuery", () => {

    const test = teamStatsQuery({
      team: "TestTeam", year: "2019",
      minRank: "10", maxRank: "100",
      baseQuery: "base",
      onQuery: "on", offQuery: "off"
    }, 0, { "team": { "stats": 0 } }, {
      "name1": "name1b"
    }, 100.0);

    expect(test).toEqual(sampleTeamQueryRequest);
  });
});
