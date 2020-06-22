

import _ from 'lodash';

import { LuckUtils } from "../LuckUtils";
import { GameFilterParams, LineupFilterParams, TeamReportFilterParams } from "../../FilterModels";
import { samplePlayerStatsResponse } from "../../../sample-data/samplePlayerStatsResponse";
import { sampleTeamStatsResponse } from "../../../sample-data/sampleTeamStatsResponse";
import { sampleOffOnOffLuckDiagnostics, sampleDefOnOffLuckDiagnostics } from "../../../sample-data/sampleOnOffLuckDiagnostics";


describe("LuckUtils", () => {

  const baseTeam = sampleTeamStatsResponse.aggregations.global.only.buckets.team;
  const basePlayersMap = _.fromPairs(
    samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets.map((p: any) => [ p.key, p ])
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
  test("LuckUtils - calcDefTeamLuckAdj", () => {
    const defTeamLuckAdj = LuckUtils.calcDefTeamLuckAdj(
      sampleTeamOff, baseTeam, 100.0
    );
    expect(defTeamLuckAdj).toEqual(sampleDefOnOffLuckDiagnostics);
  });
  test("LuckUtils - injectLuck", () => {
    const offTeamLuckAdj = LuckUtils.calcOffTeamLuckAdj(
      sampleTeamOn, samplePlayersOn, baseTeam, basePlayersMap, 100.0
    );
    const defTeamLuckAdj = LuckUtils.calcDefTeamLuckAdj(
      sampleTeamOff, baseTeam, 100.0
    );
    LuckUtils.injectLuck(sampleTeamOn, offTeamLuckAdj, defTeamLuckAdj);
    LuckUtils.injectLuck(sampleTeamOff, offTeamLuckAdj, defTeamLuckAdj);

    // Check diffs are about what's expected

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
            "value": 109.19697091493352,
          },
        ],
         [
          "def_adj_ppp",
           {
            "old_value": 88,
            "override": "Adjustment derived from Def 3P%",
            "value": 96.40706874893569,
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
  });
});
