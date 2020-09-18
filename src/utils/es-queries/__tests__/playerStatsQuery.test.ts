
import { playerStatsQuery } from "../playerStatsQueryTemplate";

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

    // Write the resulting object out in pure JS format in case we want to paste it into
    // the ES console
    expect.addSnapshotSerializer({
      test: (val: any) => true,
      print: (val: any) => JSON.stringify(test, null, 3)
    });
    expect(test).toMatchSnapshot();
  });
});
