
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

  test("RapmUtils - calcPlayerContext", () => {

    const onOffReport = LineupUtils.lineupToTeamReport(lineupReport);
    const expectedContext = {
       playerToCol: {
         "Ayala, Eric": 3,
         "Cowan, Anthony": 1,
         "Morsell, Darryl": 2,
         "Scott, Donta": 5,
         "Smith, Jalen": 4,
         "Wiggins, Aaron": 0,
       },
       colToPlayer: [
         "Wiggins, Aaron",
         "Cowan, Anthony",
         "Morsell, Darryl",
         "Ayala, Eric",
         "Smith, Jalen",
         "Scott, Donta",
       ],
       numPlayers: 6,
       numLineups: 3,
       offLineupPoss: 409,
       defLineupPoss: 400
    };
    const results = RapmUtils.calcPlayerContext(
      onOffReport.players || [], lineupReport.lineups || []
    );
    expect(results).toEqual(expectedContext);
  });
  test("RapmUtils - calcPlayerContext", () => {
    const onOffReport = LineupUtils.lineupToTeamReport(lineupReport);
    const context = RapmUtils.calcPlayerContext(
      onOffReport.players || [], lineupReport.lineups || []
    );
    const results = RapmUtils.calcPlayerWeights(
      lineupReport.lineups || [], context
    );

    const tidyResults = (resMatrix: any) => {
      return resMatrix.map((val: number) => val.toFixed(3)).valueOf();
    };

    expect(tidyResults(results[0])).toEqual([
      [ "0.692", "0.692", "0.692", "0.692", "0.692", "0.000" ],
      [ "0.521", "0.521", "0.521", "0.000", "0.521", "0.521" ],
      [ "0.499", "0.499", "0.000", "0.499", "0.499", "0.499" ],
    ]);
    expect(tidyResults(results[1])).toEqual([
      [ "0.687", "0.687", "0.687", "0.687", "0.687", "0.000" ],
      [ "0.534", "0.534", "0.534", "0.000", "0.534", "0.534" ],
      [ "0.492", "0.492", "0.000", "0.492", "0.492", "0.492" ],
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
    const context = RapmUtils.calcPlayerContext(
      onOffReport.players || [], lineupReportFake.lineups || []
    );
    const weights = RapmUtils.calcPlayerWeights(
      lineupReportFake.lineups || [], context
    );
    const results = RapmUtils.calcCollinearityDiag(weights[0], context);

    // Just check it doesn't crash and looks sane
    const logResults = false;
    if (logResults) {
      console.log(JSON.stringify(results));
    }
  });
});
