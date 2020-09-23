

import _ from 'lodash';

import { LuckUtils } from "../LuckUtils";
import { GameFilterParams, LineupFilterParams, TeamReportFilterParams } from "../../FilterModels";
import { samplePlayerStatsResponse } from "../../../sample-data/samplePlayerStatsResponse";
import { sampleTeamStatsResponse } from "../../../sample-data/sampleTeamStatsResponse";
import { sampleOffOnOffLuckDiagnostics, sampleDefOnOffLuckDiagnostics } from "../../../sample-data/sampleOnOffLuckDiagnostics";


describe("LuckUtils", () => {

  const baseTeam = sampleTeamStatsResponse.responses[0].aggregations.global.only.buckets.team;
  const basePlayers =
    samplePlayerStatsResponse.responses[0].aggregations.tri_filter.buckets.baseline.player.buckets;
  const basePlayersMap = _.fromPairs(
    basePlayers.map((p: any) => [ p.key, p ])
  );
  const sampleTeamOn =
    sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets.on;
  const samplePlayersOn =
    samplePlayerStatsResponse.responses[0].aggregations.tri_filter.buckets.on.player.buckets;
  const sampleTeamOff =
    sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets.off;

  const savedSampleTeamOn = _.cloneDeep(sampleTeamOn);

  // Write the data objects out in pure JS format so we can store them
  expect.addSnapshotSerializer({
    test: (val: any) => true,
    print: (val: any) => JSON.stringify(val, null, 3)
  });

  test("LuckUtils - calcOffTeamLuckAdj", () => {
    const offTeamLuckAdj = LuckUtils.calcOffTeamLuckAdj(
      sampleTeamOn, samplePlayersOn, baseTeam, basePlayersMap, 100.0
    );
    expect(offTeamLuckAdj).toMatchSnapshot("Offensive Luck Adjustments");
    // Now copy the snapshot here:
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
    expect(defTeamLuckAdj).toMatchSnapshot("Defensive Luck Adjustments");
    // Now copy the snapshot here:
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

    expect(_.fromPairs(_.differenceWith(
      _.toPairs(sampleTeamOn),
      _.toPairs(savedSampleTeamOn),
      _.isEqual
    ))).toMatchSnapshot();

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
        value: 0.32377075874747585,
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
