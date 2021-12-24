
import { teamStatsQuery } from "../teamStatsQueryTemplate";
import { CommonApiUtils } from "../../../utils/CommonApiUtils";

describe("teamStatsQuery", () => {
  test("teamStatsQuery", () => {

    const params = {
      team: "TestTeam", year: "2019",
      minRank: "10", maxRank: "100",
      baseQuery: "base",
      onQuery: "on", offQuery: "off"
    };
    const test1 = teamStatsQuery(params, 0, { "team": { "stats": 0 } }, {
      "name1": "name1b"
    }, 100.0, CommonApiUtils.getHca(params));
    const test2 = teamStatsQuery(params, 0, { "team": { "stats": 0 } }, {
      "name1": "name1b"
    }, 100.0, CommonApiUtils.getHca({ ...params, year: "2020" }));

    // Write the resulting object out in pure JS format in case we want to paste it into
    // the ES console
    expect.addSnapshotSerializer({
      test: (val: any) => true,
      print: (val: any) => JSON.stringify(val, null, 3)
    });
    expect(test1).toMatchSnapshot();
    expect(test2).toMatchSnapshot();
  });
  test("teamStatsQuery-game-info", () => {

    const params = {
      team: "TestTeam", year: "2019",
      minRank: "10", maxRank: "100",
      baseQuery: "base",
      onQuery: "on", offQuery: "off",
      getGames: true
    };
    const test1 = teamStatsQuery(params, 0, { "team": { "stats": 0 } }, {
      "name1": "name1b"
    }, 100.0, CommonApiUtils.getHca(params));
    const test2 = teamStatsQuery(params, 0, { "team": { "stats": 0 } }, {
      "name1": "name1b"
    }, 100.0, CommonApiUtils.getHca({ ...params, year: "2020" }));

    // Write the resulting object out in pure JS format in case we want to paste it into
    // the ES console
    expect.addSnapshotSerializer({
      test: (val: any) => true,
      print: (val: any) => JSON.stringify(val, null, 3)
    });
    expect(test1).toMatchSnapshot();
    expect(test2).toMatchSnapshot();
  });
});
