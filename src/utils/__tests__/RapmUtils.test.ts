
import _ from 'lodash';

import { RapmUtils, RapmPlayerContext, RapmDiagnostics } from "../RapmUtils";
// @ts-ignore
import { apply, transpose, matrix, zeros } from 'mathjs'

// For creating test data:
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse";
import { LineupUtils } from "../LineupUtils";
import { LineupStatsModel } from './LineupStatsTable';

describe("RapmUtils", () => {

  const lineupReport: LineupStatsModel = {
    lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets,
    avgOff: 100.0,
    error_code: "test"
  };

  test("RapmUtils - buildPlayerContext", () => {

    // Build some dummy data with 2 extra players, one who we'll filter out
    // and the other we won't, but he'll get "chain filtered out"
    const dummyLineup1 = JSON.parse(JSON.stringify(lineupReport.lineups[0])
      .replace("JaSmith", "DuData").replace("Smith, Jalen", "Data, Dummy")
      .replace("ErAyala", "OtPlayer").replace("Ayala, Eric", "Player, Other")
    );
    dummyLineup1.off_poss = { value: 50 };
    dummyLineup1.def_poss = { value: 50 };
    const dummyLineup2 = JSON.parse(JSON.stringify(lineupReport.lineups[0])
      .replace("ErAyala", "OtPlayer").replace("Ayala, Eric", "Player, Other")
    );
    dummyLineup2.off_poss = { value: 100 };
    dummyLineup2.def_poss = { value: 100 };
    const lineupReportWithExtra: LineupStatsModel = {
      lineups: lineupReport.lineups.concat([dummyLineup1, dummyLineup2]),
      avgOff: lineupReport.avgOff,
      error_code: lineupReport.error_code
    };

    const onOffReport = LineupUtils.lineupToTeamReport(lineupReportWithExtra);
    const expectedContext_all = {
       playerToCol: {
         "Ayala, Eric": 4,
         "Cowan, Anthony": 1,
         "Data, Dummy": 7,
         "Morsell, Darryl": 3,
         "Player, Other": 6,
         "Scott, Donta": 5,
         "Smith, Jalen": 2,
         "Wiggins, Aaron": 0,
       },
       colToPlayer: [
         "Wiggins, Aaron",
         "Cowan, Anthony",
         "Smith, Jalen",
         "Morsell, Darryl",
         "Ayala, Eric",
         "Scott, Donta",
         "Player, Other",
         "Data, Dummy",
       ],
       numPlayers: 8,
       numLineups: 5,
       offLineupPoss: 559,
       defLineupPoss: 550
    };
    const expectedContext_removed = {
       playerToCol: _.omit(expectedContext_all.playerToCol, [
         "Data, Dummy", "Player, Other"
       ]),
       colToPlayer: _.take(expectedContext_all.colToPlayer, 6),
       numPlayers: 6,
       numLineups: 3,
       offLineupPoss: 409,
       defLineupPoss: 400
    };

    [ [expectedContext_all, 0.0], [expectedContext_removed, 0.20] ].forEach((t2) => {
      const threshold = t2[1] as number;
      const results = RapmUtils.buildPlayerContext(
        onOffReport.players || [], lineupReportWithExtra.lineups || [], threshold
      );
      expect(_.omit(results, ["filteredLineups", "teamInfo"])).toEqual(t2[0]);
      expect(results.filteredLineups.length).toEqual(t2[1] > 0.05 ? 3 : 5);
      expect(results.teamInfo.off_poss.value).toEqual(t2[1] > 0.05 ? 409 : 559);
    });
  });

  test("RapmUtils - calcPlayerWeights", () => {
    const onOffReport = LineupUtils.lineupToTeamReport(lineupReport);
    const context = RapmUtils.buildPlayerContext(
      onOffReport.players || [], lineupReport.lineups || [], 0.0
    );
    const results = RapmUtils.calcPlayerWeights(
      context.filteredLineups || [], context
    );

    const tidyResults = (resMatrix: any) => {
      return resMatrix.map((val: number) => val.toFixed(3)).valueOf();
    };

    expect(tidyResults(results[0])).toEqual([
      [ "0.692", "0.692", "0.692", "0.692", "0.692", "0.000" ],
      [ "0.521", "0.521", "0.521", "0.521", "0.000", "0.521" ],
      [ "0.499", "0.499", "0.499", "0.000", "0.499", "0.499" ],
    ]);
    expect(tidyResults(results[1])).toEqual([
      [ "0.687", "0.687", "0.687", "0.687", "0.687", "0.000" ],
      [ "0.534", "0.534", "0.534", "0.534", "0.000", "0.534" ],
      [ "0.492", "0.492", "0.492", "0.000", "0.492", "0.492" ],
    ]);
  });
  test("RapmUtils - calcCollinearityDiag", () => {

    // Test matrix

    // Result matrix
    const test = matrix([
       [ 1, 0, 1 ], [ -1, -2, 0 ], [0, 1, -1], [ 0.5, 0.5, 0.5]
    ]);

    const dummyContext = {
      playerToCol: { "PlayerB": 1, "PlayerC": 2, "PlayerA": 0 },
      colToPlayer: [ "PlayerA", "PlayerB", "PlayerC" ],
      filteredLineups: [],
      teamInfo: {},
      numPlayers: 3,
      numLineups: 4,
      offLineupPoss: 10,
      defLineupPoss: 9
    };

    const results = RapmUtils.calcCollinearityDiag(test, dummyContext);

    const tidyResults = (t: RapmDiagnostics) => {
      return {
        lineupCombos: t.lineupCombos.map((val) => val.toFixed(4)),
        playerCombos: _.chain(t.playerCombos).mapValues((playerRow) => {
          return playerRow.map((val) => val.toFixed(4));
        }).value()
      }
    };

    // (Results from https://www.mathworks.com/help/matlab/ref/double.svd.html using test)

    expect(tidyResults(results)).toEqual({
      lineupCombos: [ "9.4618", "1.4154", "1.0000" ],
      playerCombos: {
        "PlayerA": [ "0.9852", "0.0103", "0.0045" ],
        "PlayerB": [ "0.9401", "0.0081", "0.0519" ],
        "PlayerC": [ "0.9524", "0.0476", "0.0000" ],
      }
    });

  });
  test("RapmUtils - calcCollinearityDiag (pseudo-real data)", () => {
    const lineupReportFake: LineupStatsModel = {
      lineups: lineupReport.lineups.concat(lineupReport.lineups),
      avgOff: lineupReport.avgOff,
      error_code: lineupReport.error_code
    };
    const onOffReport = LineupUtils.lineupToTeamReport(lineupReportFake);
    const context = RapmUtils.buildPlayerContext(
      onOffReport.players || [], lineupReportFake.lineups || [], 0.1
    );
    const weights = RapmUtils.calcPlayerWeights(
      context.filteredLineups, context
    );
    const results = RapmUtils.calcCollinearityDiag(weights[0], context);

    // Just check it doesn't crash and looks sane
    const logResults = false;
    if (logResults) {
      console.log(JSON.stringify(results));
    }
  });
});
