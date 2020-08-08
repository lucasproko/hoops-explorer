

import _ from 'lodash';

import { LuckUtils } from "../LuckUtils";
import { GameFilterParams, LineupFilterParams, TeamReportFilterParams } from "../../FilterModels";
import { samplePlayerStatsResponse } from "../../../sample-data/samplePlayerStatsResponse";
import { sampleTeamStatsResponse } from "../../../sample-data/sampleTeamStatsResponse";
import { sampleOffOnOffLuckDiagnostics, sampleDefOnOffLuckDiagnostics } from "../../../sample-data/sampleOnOffLuckDiagnostics";


describe("LuckUtils", () => {

  const baseTeam = sampleTeamStatsResponse.aggregations.global.only.buckets.team;
  const basePlayers =
    samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets;
  const basePlayersMap = _.fromPairs(
    basePlayers.map((p: any) => [ p.key, p ])
  );
  const sampleTeamOn =
    sampleTeamStatsResponse.aggregations.tri_filter.buckets.on;
  const samplePlayersOn =
    samplePlayerStatsResponse.aggregations.tri_filter.buckets.on.player.buckets;
  const sampleTeamOff =
    sampleTeamStatsResponse.aggregations.tri_filter.buckets.off;

  const savedSampleTeamOn = _.cloneDeep(sampleTeamOn);

  test("LuckUtils - calcOffTeamLuckAdj", () => {
    const offTeamLuckAdj = LuckUtils.calcOffTeamLuckAdj(
      sampleTeamOn, samplePlayersOn, baseTeam, basePlayersMap, 100.0
    );
    expect(offTeamLuckAdj).toEqual(sampleOffOnOffLuckDiagnostics);
  });
  test("LuckUtils - calcOffPlayerLuckAdj", () => {
    // (just check it's a straight translation of the team version)
    const offTeamLuckAdj = LuckUtils.calcOffTeamLuckAdj(
      samplePlayersOn[0], [ samplePlayersOn[0] ], basePlayers[0], { [basePlayers[0].key]: basePlayers[0] }, 100.0
    );
    const offPlayerLuckAdj = LuckUtils.calcOffPlayerLuckAdj(
      samplePlayersOn[0], basePlayers[0], 100.0
    );
    expect(offPlayerLuckAdj).toEqual(offTeamLuckAdj);
  });
  test("LuckUtils - calcDefTeamLuckAdj", () => {
    const defTeamLuckAdj = LuckUtils.calcDefTeamLuckAdj(
      sampleTeamOff, baseTeam, 100.0
    );
    expect(defTeamLuckAdj).toEqual(sampleDefOnOffLuckDiagnostics);
  });
  test("LuckUtils - calcDefPlayerLuckAdj", () => {
    // (just check it's a - somewhat! - straight translation of the team version)
    // (TODO this is a bit horrible, I'm just copy/pasting the logic I'm testing, but not sure
    //  how better to test)
    const samplePlayerWithExtraStats = _.assign(_.cloneDeep(samplePlayersOn[0] as any), {
      def_3p: { value: samplePlayersOn[0].oppo_total_def_3p_made.value /  samplePlayersOn[0].oppo_total_def_3p_attempts.value },
      def_3p_opp: samplePlayersOn[0].oppo_def_3p_opp,
      def_poss: samplePlayersOn[0].oppo_total_def_poss
    });
    const basePlayerWithExtraStats = _.assign(_.cloneDeep(basePlayers[0] as any), {
      def_3p: { value: basePlayers[0].oppo_total_def_3p_made.value /  basePlayers[0].oppo_total_def_3p_attempts.value },
      def_3p_opp: basePlayers[0].oppo_def_3p_opp,
      def_poss: basePlayers[0].oppo_total_def_poss
    });
    const defTeamLuckAdj = _.assign(LuckUtils.calcDefTeamLuckAdj(
      samplePlayerWithExtraStats, basePlayerWithExtraStats, 100.0
    ), {
      sampleDefOrb: 0, //(we ignore ORBs)
      sampleOffSos: 0 //(for individual players, don't transform it into efficiency so this isn't needed)
    });
    const defPlayerLuckAdj = LuckUtils.calcDefPlayerLuckAdj(
      samplePlayersOn[0], basePlayers[0], 100.0
    );
    expect(defPlayerLuckAdj).toEqual(defTeamLuckAdj);
  });
  test("LuckUtils - injectLuck", () => {
    const offTeamLuckAdj = LuckUtils.calcOffTeamLuckAdj(
      sampleTeamOn, samplePlayersOn, baseTeam, basePlayersMap, 100.0
    );
    const defTeamLuckAdj = LuckUtils.calcDefTeamLuckAdj(
      sampleTeamOff, baseTeam, 100.0
    );

    // Check object with missing fields are preserved:
    const mutableEmpty = {};
    LuckUtils.injectLuck(mutableEmpty, offTeamLuckAdj, defTeamLuckAdj);
    expect(mutableEmpty).toEqual({});
    LuckUtils.injectLuck(mutableEmpty, undefined, undefined);
    expect(mutableEmpty).toEqual({});

    // Check diffs are about what's expected

    LuckUtils.injectLuck(sampleTeamOn, offTeamLuckAdj, defTeamLuckAdj);
    LuckUtils.injectLuck(sampleTeamOff, offTeamLuckAdj, defTeamLuckAdj);

    expect(_.differenceWith(
      _.toPairs(sampleTeamOn),
      _.toPairs(savedSampleTeamOn),
      _.isEqual
    )).toEqual([
         [
          "off_ppp",
           {
            "old_value": 111.36890951276102,
            "override": "Adjustment derived from Off 3P%",
            "value": 109.56588042769454,
          },
        ],
         [
          "off_3p",
           {
            "old_value": 0.3526570048309179,
            "override": "Luck adjusted",
            "value": 0.3304870068931252,
          },
        ],
         [
          "def_ppp",
           {
            "old_value": 101.33437990580848,
            "override": "Adjustment derived from Def 3P%",
            "value": 109.74144865474416,
          },
        ],
         [
          "def_3p",
           {
            "old_value": 0.3249475890985325,
            "override": "Luck adjusted",
            "value": 0.36290092949990566,
          },
        ],
         [
          "off_efg",
           {
            "old_value": 0.5193519351935193,
            "override": "Adjustment derived from Off 3P%",
            "value": 0.5069598841409817,
          },
        ],
         [
          "def_efg",
           {
            "old_value": 0.47112860892388453,
            "override": "Adjustment derived from Def 3P%",
            "value": 0.5048122006469092,
          },
        ],
         [
          "off_adj_ppp",
           {
            "old_value": 111,
            "override": "Adjustment derived from Off 3P%",
            "value": 109.16572439169413,
          },
        ],
         [
          "def_adj_ppp",
           {
            "old_value": 88,
            "override": "Adjustment derived from Def 3P%",
            "value": 95.6971251825972,
          },
        ]
    ]);

    // Recalculate and check that calcOffTeamLuckAdj / calcDefTeamLuckAdj

    const offTeamLuckAdj2 = LuckUtils.calcOffTeamLuckAdj(
      sampleTeamOn, samplePlayersOn, baseTeam, basePlayersMap, 100.0
    );
    const defTeamLuckAdj2 = LuckUtils.calcDefTeamLuckAdj(
      sampleTeamOff, baseTeam, 100.0
    );
    expect(offTeamLuckAdj2).toEqual(offTeamLuckAdj);
    expect(defTeamLuckAdj2).toEqual(defTeamLuckAdj);

    // Check it's idempotent:

    const savedMutatedSampleTeamOn = _.cloneDeep(sampleTeamOn);
    LuckUtils.injectLuck(sampleTeamOn, offTeamLuckAdj, defTeamLuckAdj);
    expect(sampleTeamOn).toEqual(savedMutatedSampleTeamOn);

    // Check we can reset it:
    LuckUtils.injectLuck(sampleTeamOn, undefined, undefined);
    expect(sampleTeamOn).toEqual(savedSampleTeamOn);

    //Check injectLuck when called on individual player (diff on the defensive side)

    const samplePlayerDef = { // (only difference is this one field)
      oppo_total_def_3p_attempts: {
        value: 100
      },
      oppo_total_def_3p_made: {
        value: 25
      },
    };
    const testPlayerDef = _.cloneDeep(samplePlayerDef);
    LuckUtils.injectLuck(testPlayerDef, offTeamLuckAdj, defTeamLuckAdj);
    expect(testPlayerDef).toEqual(_.assign(_.cloneDeep(samplePlayerDef), {
      oppo_def_3p: {
        value: 0.36290092949990566,
        old_value: 0.25,
        override: "Luck adjusted"
      }
    }));
    LuckUtils.injectLuck(testPlayerDef, undefined, undefined);
    expect(testPlayerDef).toEqual(_.assign(_.cloneDeep(samplePlayerDef), {
      oppo_def_3p: {
        value: 0.25
      }
    }));
  });
});
