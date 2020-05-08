
import _ from 'lodash';

import { RapmUtils, RapmPlayerContext, RapmPreProcDiagnostics } from "../RapmUtils";
// @ts-ignore
import { apply, transpose, matrix, zeros } from 'mathjs'

// For creating test data:
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse";
import { LineupUtils } from "../LineupUtils";

// Some handy data:

const reducedFilteredLineups =
  [{"off_adj_ppp":{"value":123.5174},"def_adj_ppp":{"value":87.6567},"off_to":{"value":0.1234},"def_to":{"value":0.1506},"off_poss":{"value":397},"def_poss":{"value":385}},{"off_adj_ppp":{"value":115.2944},"def_adj_ppp":{"value":78.5102},"off_to":{"value":0.1578},"def_to":{"value":0.2248},"off_poss":{"value":209},"def_poss":{"value":209}},{"off_adj_ppp":{"value":120.3613},"def_adj_ppp":{"value":82.0894},"off_to":{"value":0.1725},"def_to":{"value":0.1709},"off_poss":{"value":197},"def_poss":{"value":193}},{"off_adj_ppp":{"value":106.4985},"def_adj_ppp":{"value":98.5939},"off_to":{"value":0.2},"def_to":{"value":0.1388},"off_poss":{"value":175},"def_poss":{"value":180}},{"off_adj_ppp":{"value":109.0532},"def_adj_ppp":{"value":96.0848},"off_to":{"value":0.1803},"def_to":{"value":0.1896},"off_poss":{"value":61},"def_poss":{"value":58}},{"off_adj_ppp":{"value":115.8655},"def_adj_ppp":{"value":97.3980},"off_to":{"value":0.2272},"def_to":{"value":0.3695},"off_poss":{"value":44},"def_poss":{"value":46}},{"off_adj_ppp":{"value":116.7904},"def_adj_ppp":{"value":69.0444},"off_to":{"value":0.1363},"def_to":{"value":0.1590},"off_poss":{"value":44},"def_poss":{"value":44}},{"off_adj_ppp":{"value":97.1418},"def_adj_ppp":{"value":68.3655},"off_to":{"value":0.1842},"def_to":{"value":0.2162},"off_poss":{"value":38},"def_poss":{"value":37}},{"off_adj_ppp":{"value":111.8079},"def_adj_ppp":{"value":73.4509},"off_to":{"value":0.1538},"def_to":{"value":0.1923},"off_poss":{"value":26},"def_poss":{"value":26}},{"off_adj_ppp":{"value":137.3557},"def_adj_ppp":{"value":92.6562},"off_to":{"value":0.05},"def_to":{"value":0.2222},"off_poss":{"value":20},"def_poss":{"value":18}},{"off_adj_ppp":{"value":126.2792},"def_adj_ppp":{"value":76.3977},"off_to":{"value":0.1},"def_to":{"value":0.1052},"off_poss":{"value":20},"def_poss":{"value":19}},{"off_adj_ppp":{"value":105.8534},"def_adj_ppp":{"value":78.1378},"off_to":{"value":0.3571},"def_to":{"value":0.25},"off_poss":{"value":14},"def_poss":{"value":16}},{"off_adj_ppp":{"value":83.1219},"def_adj_ppp":{"value":69.6595},"off_to":{"value":0.1428},"def_to":{"value":0.0555},"off_poss":{"value":14},"def_poss":{"value":18}},{"off_adj_ppp":{"value":81.2756},"def_adj_ppp":{"value":85.3294},"off_to":{"value":0.0769},"def_to":{"value":0.2142},"off_poss":{"value":13},"def_poss":{"value":14}},{"off_adj_ppp":{"value":113.5027},"def_adj_ppp":{"value":78.6277},"off_to":{"value":0.0833},"def_to":{"value":0.1818},"off_poss":{"value":12},"def_poss":{"value":11}},{"off_adj_ppp":{"value":113.2939},"def_adj_ppp":{"value":87.9023},"off_to":{"value":0.2},"def_to":{"value":0.1},"off_poss":{"value":10},"def_poss":{"value":10}},{"off_adj_ppp":{"value":147.1840},"def_adj_ppp":{"value":146.6079},"off_to":{"value":0.2222},"def_to":{"value":0.125},"off_poss":{"value":9},"def_poss":{"value":8}},{"off_adj_ppp":{"value":125.4313},"def_adj_ppp":{"value":126.6332},"off_to":{"value":0.25},"def_to":{"value":0.1428},"off_poss":{"value":8},"def_poss":{"value":7}},{"off_adj_ppp":{"value":143.5760},"def_adj_ppp":{"value":88.7995},"off_to":{"value":0},"def_to":{"value":0.1},"off_poss":{"value":7},"def_poss":{"value":10}},{"off_adj_ppp":{"value":0},"def_adj_ppp":{"value":140.9383},"off_to":{"value":0.25},"def_to":{"value":0},"off_poss":{"value":4},"def_poss":{"value":5}},{"off_adj_ppp":{"value":51.6649},"def_adj_ppp":{"value":113.5392},"off_to":{"value":0.25},"def_to":{"value":0.2},"off_poss":{"value":4},"def_poss":{"value":5}},{"off_adj_ppp":{"value":279.4759},"def_adj_ppp":{"value":37.3041},"off_to":{"value":0},"def_to":{"value":0},"off_poss":{"value":4},"def_poss":{"value":5}},{"off_adj_ppp":{"value":96.1502},"def_adj_ppp":{"value":52.7835},"off_to":{"value":0.25},"def_to":{"value":0.5},"off_poss":{"value":4},"def_poss":{"value":4}},{"off_adj_ppp":{"value":73.4050},"def_adj_ppp":{"value":137.3543},"off_to":{"value":0},"def_to":{"value":0.25},"off_poss":{"value":3},"def_poss":{"value":4}},{"off_adj_ppp":{"value":68.5408},"def_adj_ppp":{"value":120.0750},"off_to":{"value":0},"def_to":{"value":0},"off_poss":{"value":3},"def_poss":{"value":4}},{"off_adj_ppp":{"value":109.4017},"def_adj_ppp":{"value":0},"off_to":{"value":0.3333},"def_to":{"value":0.3333},"off_poss":{"value":3},"def_poss":{"value":3}},{"off_adj_ppp":{"value":129.5382},"def_adj_ppp":{"value":53.1671},"off_to":{"value":0},"def_to":{"value":0.25},"off_poss":{"value":3},"def_poss":{"value":4}},{"off_adj_ppp":{"value":160.5015},"def_adj_ppp":{"value":98.6512},"off_to":{"value":0.5},"def_to":{"value":0},"off_poss":{"value":2},"def_poss":{"value":2}},{"off_adj_ppp":{"value":199.6101},"def_adj_ppp":{"value":0},"off_to":{"value":0},"def_to":{"value":0},"off_poss":{"value":1},"def_poss":{"value":1}},{"off_adj_ppp":{"value":204.3912},"def_adj_ppp":{"value":176.8566},"off_to":{"value":0},"def_to":{"value":0},"off_poss":{"value":1},"def_poss":{"value":1}},{"off_adj_ppp":{"value":210.6995},"def_adj_ppp":{"value":129.2929},"off_to":{"value":0},"def_to":{"value":0},"off_poss":{"value":1},"def_poss":{"value":2}}];

export const semiRealRapmResults = {
  // Somewhat complex real world test data:
  testOffWeights: [[0.5420,0.5420,0.5420,0.5420,0.5420,0,0,0],[0.3933,0.3933,0.3933,0.3933,0,0.3933,0,0],[0.3818,0.3818,0.3818,0,0.3818,0.3818,0,0],[0.3599,0.3599,0,0.3599,0.3599,0.3599,0,0],[0.2124,0.2124,0.2124,0,0.2124,0,0.2124,0],[0.1804,0.1804,0.1804,0.1804,0,0,0.1804,0],[0.1804,0,0.1804,0.1804,0.1804,0.1804,0,0],[0.1677,0.1677,0.1677,0,0,0.1677,0,0.1677],[0.1387,0.1387,0.1387,0,0,0,0.1387,0.1387],[0.1216,0.1216,0.1216,0.1216,0,0,0,0.1216],[0.1216,0.1216,0,0.1216,0.1216,0,0.1216,0],[0.1017,0,0.1017,0.1017,0.1017,0,0.1017,0],[0.1017,0,0.1017,0.1017,0.1017,0,0,0.1017],[0.0980,0.0980,0,0.0980,0,0.0980,0,0.0980],[0.0942,0.0942,0,0.0942,0.0942,0,0,0.0942],[0,0.0860,0.0860,0.0860,0,0.0860,0.0860,0],[0,0.0816,0.0816,0.0816,0.0816,0.0816,0,0],[0,0.0769,0.0769,0,0.0769,0.0769,0.0769,0],[0.0719,0,0.0719,0,0.0719,0,0.0719,0.0719],[0.0544,0,0.0544,0,0.0544,0.0544,0,0.0544],[0,0,0.0544,0.0544,0.0544,0.0544,0,0.0544],[0.0544,0,0,0.0544,0.0544,0.0544,0,0.0544],[0.0544,0,0,0,0.0544,0.0544,0.0544,0.0544],[0,0.0471,0.0471,0.0471,0.0471,0,0.0471,0],[0.0471,0.0471,0,0.0471,0,0,0.0471,0.0471],[0.0471,0.0471,0,0,0.0471,0.0471,0,0.0471],[0.0471,0.0471,0.0471,0,0.0471,0,0,0.0471],[0.0384,0,0,0.0384,0.0384,0,0.0384,0.0384],[0,0.0272,0.0272,0.0272,0,0,0.0272,0.0272],[0,0.0272,0,0.0272,0.0272,0.0272,0,0.0272],[0.0272,0.0272,0,0,0.0272,0,0.0272,0.0272],[1.9467,1.8564,1.6476,1.4789,1.4611,1.0703,0.3019,0.2368]],

  testDefWeights: [[0.5342,0.5342,0.5342,0.5342,0.5342,0,0,0],[0.3936,0.3936,0.3936,0.3936,0,0.3936,0,0],[0.3782,0.3782,0.3782,0,0.3782,0.3782,0,0],[0.3652,0.3652,0,0.3652,0.3652,0.3652,0,0],[0.2073,0.2073,0.2073,0,0.2073,0,0.2073,0],[0.1846,0.1846,0.1846,0.1846,0,0,0.1846,0],[0.1806,0,0.1806,0.1806,0.1806,0.1806,0,0],[0.1656,0.1656,0.1656,0,0,0.1656,0,0.1656],[0.1388,0.1388,0.1388,0,0,0,0.1388,0.1388],[0.1155,0.1155,0.1155,0.1155,0,0,0,0.1155],[0.1186,0.1186,0,0.1186,0.1186,0,0.1186,0],[0.1089,0,0.1089,0.1089,0.1089,0,0.1089,0],[0.1155,0,0.1155,0.1155,0.1155,0,0,0.1155],[0.1018,0.1018,0,0.1018,0,0.1018,0,0.1018],[0.0903,0.0903,0,0.0903,0.0903,0,0,0.0903],[0,0.0860,0.0860,0.0860,0,0.0860,0.0860,0],[0,0.0770,0.0770,0.0770,0.0770,0.0770,0,0],[0,0.0720,0.0720,0,0.0720,0.0720,0.0720,0],[0.0860,0,0.0860,0,0.0860,0,0.0860,0.0860],[0.0608,0,0.0608,0,0.0608,0.0608,0,0.0608],[0,0,0.0608,0.0608,0.0608,0.0608,0,0.0608],[0.0608,0,0,0.0608,0.0608,0.0608,0,0.0608],[0.0544,0,0,0,0.0544,0.0544,0.0544,0.0544],[0,0.0544,0.0544,0.0544,0.0544,0,0.0544,0],[0.0544,0.0544,0,0.0544,0,0,0.0544,0.0544],[0.0471,0.0471,0,0,0.0471,0.0471,0,0.0471],[0.0544,0.0544,0.0544,0,0.0544,0,0,0.0544],[0.0385,0,0,0.0385,0.0385,0,0.0385,0.0385],[0,0.0272,0.0272,0.0272,0,0,0.0272,0.0272],[0,0.0272,0,0.0272,0.0272,0.0272,0,0.0272],[0.0385,0.0385,0,0,0.0385,0,0.0385,0.0385],[1.9466,1.8383,1.6367,1.4825,1.4588,1.0748,0.3098,0.2520]],

  reducedFilteredLineups: reducedFilteredLineups,

  testContext: {"unbiasWeight":2,"removalPct":0.1,"removedPlayers":{"Mitchell, Makhel":210,"Tomaic, Joshua":149,"Marial, Chol":208,"Mona, Reese":42,"Hart, Hakim":237,"Mitchell, Makhi":264},"playerToCol":{"Smith, Jalen":0,"Cowan, Anthony":1,"Wiggins, Aaron":2,"Morsell, Darryl":3,"Ayala, Eric":4,"Scott, Donta":5,"Lindo Jr., Ricky":6,"Smith Jr., Serrel":7},"colToPlayer":["Smith, Jalen","Cowan, Anthony","Wiggins, Aaron","Morsell, Darryl","Ayala, Eric","Scott, Donta","Lindo Jr., Ricky","Smith Jr., Serrel"],"avgEfficiency":102.4,"numPlayers":8,"numLineups":31,"offLineupPoss":1351,"defLineupPoss":1349
  ,
  // Extra fields:
  filteredLineups: reducedFilteredLineups,
  teamInfo: { off_adj_ppp: { value: 112.4 }, def_adj_ppp: { value: 82.4 }, off_poss: { value: 101 }, def_poss: { value : 99 } }
  }
  //(defense picked to be more extreme so that it will trigger the "eff error too high" vs the "results stable")

};

describe("RapmUtils", () => {

  const lineupReport = {
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
    const lineupReportWithExtra = {
      lineups: lineupReport.lineups.concat([dummyLineup1, dummyLineup2]),
      avgOff: lineupReport.avgOff,
      error_code: lineupReport.error_code
    };

    const onOffReport = LineupUtils.lineupToTeamReport(lineupReportWithExtra);
    const expectedContext_all = {
       avgEfficiency: 100.0,
       removalPct: 0.0,
       removedPlayers: {},
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
       defLineupPoss: 550,
       unbiasWeight: 3
    };
    const expectedContext_removed = {
       avgEfficiency: 100.0,
       removalPct: 0.20,
       removedPlayers: {
         "Data, Dummy": 0.17889087656529518,
         "Player, Other": 0.35778175313059035
       },
       playerToCol: _.omit(expectedContext_all.playerToCol, [
         "Data, Dummy", "Player, Other"
       ]),
       colToPlayer: _.take(expectedContext_all.colToPlayer, 6),
       numPlayers: 6,
       numLineups: 3,
       offLineupPoss: 409,
       defLineupPoss: 400,
       unbiasWeight: 3
    };

    [ [expectedContext_all, 0.0], [expectedContext_removed, 0.20] ].forEach((t2) => {
      const threshold = t2[1] as number;
      const results = RapmUtils.buildPlayerContext(
        onOffReport.players || [], lineupReportWithExtra.lineups || [], 100.0,
        threshold, 3.0
      );
      expect(_.omit(results, ["filteredLineups", "teamInfo"])).toEqual(t2[0]);
      expect(results.filteredLineups.length).toEqual(t2[1] > 0.05 ? 3 : 5);
      expect(results.teamInfo.off_poss.value).toEqual(t2[1] > 0.05 ? 409 : 559);
    });
  });

  test("RapmUtils - calcPlayerWeights", () => {

    [ 0.0, 2.0 ].forEach((unbiasWeight) => {
      const onOffReport = LineupUtils.lineupToTeamReport(lineupReport);
      const context = RapmUtils.buildPlayerContext(
        onOffReport.players || [], lineupReport.lineups || [], 100.0, 0.0, unbiasWeight
      );
      const results = RapmUtils.calcPlayerWeights(context);

      const tidyResults = (resMatrix: any) => {
        return resMatrix.map((val: number) => val.toFixed(3)).valueOf();
      };

      expect(tidyResults(results[0])).toEqual(_.filter([
        [ "0.692", "0.692", "0.692", "0.692", "0.692", "0.000" ],
        [ "0.521", "0.521", "0.521", "0.521", "0.000", "0.521" ],
        [ "0.499", "0.499", "0.499", "0.000", "0.499", "0.499" ],
        [ "2.000", "2.000", "2.000", "1.501", "1.457", "1.042" ], //(extra row if adding unbiasing obs)
      ], (r, i) => (unbiasWeight != 0) || i < 3));
      expect(tidyResults(results[1])).toEqual(_.filter([
        [ "0.687", "0.687", "0.687", "0.687", "0.687", "0.000" ],
        [ "0.534", "0.534", "0.534", "0.534", "0.000", "0.534" ],
        [ "0.492", "0.492", "0.492", "0.000", "0.492", "0.492" ],
        [ "2.000", "2.000", "2.000", "1.515", "1.430", "1.055" ], //(extra row if adding unbiasing obs)
      ], (r, i) => (unbiasWeight != 0) || i < 3));
    });
  });

  test("RapmUtils - calcLineupOutputs", () => {
    [ 0.0, 2.0 ].forEach((unbiasWeight) => {
      const onOffReport = LineupUtils.lineupToTeamReport(lineupReport);
      const context = RapmUtils.buildPlayerContext(
        onOffReport.players || [], lineupReport.lineups || [], 100.0, 0.0, unbiasWeight
      );
      const results = RapmUtils.calcLineupOutputs(
        "adj_ppp", 100.0, 100.0, context
      );
      const tidyResults = (resMatrix: Array<Array<number>>) => {
        return resMatrix.map((arr) => {
          return arr.map((val) => val.toFixed(2));
        });
      };
      expect(tidyResults(results)).toEqual([
        [ "11.23", "-1.97", "7.10" ].concat(unbiasWeight > 0 ? [ "20.60" ] : []),
        [ "-9.98", "-13.09", "-12.08" ].concat(unbiasWeight > 0 ? [ "-39.60" ] : [])
         //(extra value if adding unbiasing obs)
      ]);
    });
  });

  test("RapmUtils - pickRidgeRegression", () => {
    const [ offResults, defResults ] = RapmUtils.pickRidgeRegression(
      semiRealRapmResults.testOffWeights, semiRealRapmResults.testDefWeights, semiRealRapmResults.testContext
    );

    // Hand checked results, just checking nothing's broken with changes!

    expect(offResults.prevAttempts).toEqual( // 4 iterations
      [ {}, {}, {}, {} ]
    );
    expect(offResults.ridgeLambda.toFixed(3)).toEqual("1.097");
    expect(defResults.prevAttempts).toEqual( // 2 iterations
      [ {}, {} ]
    );
    expect(defResults.ridgeLambda.toFixed(3)).toEqual("0.439");
  });

  test("RapmUtils - injectRapmIntoPlayers", () => {
    const [ offResults, defResults ] = RapmUtils.pickRidgeRegression(
      semiRealRapmResults.testOffWeights, semiRealRapmResults.testDefWeights, semiRealRapmResults.testContext);
    const onOffReport = LineupUtils.lineupToTeamReport(lineupReport);

    // Check that removed players are handled
    const players = [ { playerId: "Mitchell, Makhel" } as Record<string, any> ].concat(onOffReport.players || []);
    RapmUtils.injectRapmIntoPlayers(
      players, offResults, defResults, {}, semiRealRapmResults.testContext
    );

    const resultsToExamine =
      _.chain((players || [])).map((p) => p.rapm || { noRapm: true }).take(2).map((p: any) => {
        return _.chain(p).pick(
          [ "noRapm", "key", "off_adj_ppp", "def_adj_ppp", "off_poss", "def_poss", "off_to", "def_to" ]
        ).mapValues((v: any) =>
          (v || {}).hasOwnProperty("value") ? (v?.value || 0).toFixed(2) : v
        ).value()
      }).value();

    expect(resultsToExamine).toEqual([
         {
           "noRapm": true,
         },
         {
           "def_adj_ppp": "-5.91",
           "def_poss": "99.00",
           "def_to": "0.02",
           "key": "RAPM Wiggins, Aaron",
           "off_adj_ppp": "2.78",
           "off_poss": "101.00",
           "off_to": "0.00",
         },
    ]);
  });

  test("RapmUtils - recalcNoUnbiasWeightingRapmForDiag", () => {

    const [ offResults, defResults ] = RapmUtils.pickRidgeRegression(
      semiRealRapmResults.testOffWeights, semiRealRapmResults.testDefWeights, semiRealRapmResults.testContext);

    const results = RapmUtils.recalcNoUnbiasWeightingRapmForDiag(
      semiRealRapmResults.testOffWeights, semiRealRapmResults.testDefWeights,
      offResults, defResults, semiRealRapmResults.testContext
    );

    expect(results.map((row: number[]) => row.map((n: number) => n.toFixed(2)))).toEqual([
      [
        '2.53', '2.75',
        '2.98', '2.32',
        '2.60', '0.28',
        '0.27', '-0.19'
      ],[
        '-5.50', '-1.73',
        '-5.00', '-1.48',
        '-0.53', '-3.04',
        '0.31',  '-2.64'
      ]
    ]);
  });

  test("RapmUtils - calcCollinearityDiag", () => {

    // Test matrix

    // Result matrix
    const test = matrix([
       [ 1, 0, 1 ], [ -1, -2, 0 ], [0, 1, -1], [ 0.5, 0.5, 0.5]
    ]);

    const dummyContext = {
      avgEfficiency: 100.0,
      removalPct: 0.0,
      removedPlayers: {},
      playerToCol: { "PlayerB": 1, "PlayerC": 2, "PlayerA": 0 },
      colToPlayer: [ "PlayerA", "PlayerB", "PlayerC" ],
      filteredLineups: [],
      teamInfo: {},
      numPlayers: 3,
      numLineups: 4,
      offLineupPoss: 10,
      defLineupPoss: 9,
      unbiasWeight: 0
    };

    const results = RapmUtils.calcCollinearityDiag(test, dummyContext);

    const tidyResults = (t: RapmPreProcDiagnostics) => {
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
    const lineupReportFake = {
      lineups: lineupReport.lineups.concat(lineupReport.lineups),
      avgOff: lineupReport.avgOff,
      error_code: lineupReport.error_code
    };
    const onOffReport = LineupUtils.lineupToTeamReport(lineupReportFake);
    const context = RapmUtils.buildPlayerContext(
      onOffReport.players || [], lineupReportFake.lineups || [], 100.0,
    );
    const weights = RapmUtils.calcPlayerWeights(context);
    const results = RapmUtils.calcCollinearityDiag(weights[0], context);

    // Just check it doesn't crash and looks sane
    const logResults = false;
    if (logResults) {
      console.log(JSON.stringify(results));
    }
  });


});
