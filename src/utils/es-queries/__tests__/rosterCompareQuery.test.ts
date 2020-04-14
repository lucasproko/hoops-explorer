
import { rosterCompareQuery } from "../rosterCompareQueryTemplate";
import { sampleRosterCompareQueryRequest } from "../../../sample-data/sampleRosterCompareQueryRequest";

describe("rosterCompareQuery", () => {
  test("rosterCompareQuery  ", () => {

    const test = rosterCompareQuery({
      team: "TestTeam", year: "2019",
      minRank: "10", maxRank: "100",
      baseQuery: "base",
    }, 0, { "team": { "stats": 0 } }, {
      "name1": "name1b"
    });
    expect(test).toEqual(sampleRosterCompareQueryRequest);
  });
});
