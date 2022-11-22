

import _ from 'lodash';

import { OverrideUtils } from "../OverrideUtils";
import { ParamPrefixes, ManualOverride } from "../../FilterModels";
import { IndivStatSet, TeamStatSet } from '../../StatModels';

describe("OverrideUtils", () => {

  test("OverrideUtils - getPlayerRowId", () => {
    expect(OverrideUtils.getPlayerRowId("test1", "Baseline")).toBe("test1 / Baseline");
  });
  test("OverrideUtils - getOverridableStats", () => {
    expect(OverrideUtils.getOverridableStats(ParamPrefixes.player)).toEqual({
      "off_2pmid": "Offensive mid-range 2P%",
      "off_2prim": "Offensive rim/dunk 2P%",
      "off_3p": "Offensive 3P%",
      "off_ft": "Offensive FT%",
      "off_to": "Offensive TO%"
    });
    expect(OverrideUtils.getOverridableStats(ParamPrefixes.lineup)).toEqual({});
  });
  test("OverrideUtils - buildOverrideAsMap", () => {
    const testOverrides = [
      { rowId: "test1", newVal: 0.1, use: true, statName: "testStat1a"},
      { rowId: "test1", newVal: 0.9, use: true, statName: "testStat1b"},
      { rowId: "test1", newVal: 0.15, use: true, statName: "testStat1b"},
      { rowId: "test2", newVal: 0.2, use: false, statName: "testStat2"},
      { rowId: "test2", newVal: 0.3, use: true, statName: "testStat2"},
    ];
    expect(OverrideUtils.buildOverrideAsMap(testOverrides)).toEqual({
      "test1": {
        "testStat1a": 0.1,
        "testStat1b": 0.15
      },
      "test2": { "testStat2": 0.3 }
    });
  });
  [ true, false ].forEach(luckAdj => {
    test(`OverrideUtils - applyPlayerOverridesToTeam (luckAdj=[${luckAdj}])`, () => {
      expect(_.chain(OverrideUtils.applyPlayerOverridesToTeam(
        "baseline", [
            {
            rowId: "Cowan, Anthony / Baseline",
            statName: "off_3p",
            newVal: 0.5,
            use: true
          },
          {
            rowId: "Cowan, Anthony / Baseline",
            statName: "off_2pmid",
            newVal: 0.5,
            use: false
          },
          {
            rowId: "Cowan, Anthony / On",
            statName: "off_2p",
            newVal: 0.5,
            use: false
          },
        ], {
          "Cowan, Anthony": {
            off_rtg: { value: 120, old_value: 110 },
            off_usage: { value: 0.25 },
            off_team_poss_pct: { value: 0.9 },
            off_3p: { value: 0.4 },
            total_off_3p_attempts: { value: 10 },
            off_2pmid: { value: 0.5 },
            total_off_2pmid_attempts: { value: 20 },
            off_efg: { value: 0.6 },
            total_off_fga: { value: 30 },
            def_adj_opp: { value: 90 },
          } as unknown as IndivStatSet
        }, {
          off_3p: { value: 0.3 },
          total_off_3p_attempts: { value: 100 },
          off_2pmid: { value: 0.4 },
          total_off_2pmid_attempts: { value: 200 },
          off_efg: { value: 0.5 },
          total_off_fga: { value: 300 },
          off_ppp: { value: 110 },
          off_adj_ppp: { value: 110 },
          off_net: { value: 10 },
          off_raw_net: { value: 10 },
      } as unknown as TeamStatSet, 100.0, luckAdj
      )).mapValues(p => { return _.isNil(p.old_value) ? p : { 
        value: parseFloat(p.value!.toFixed(2)), old_value: parseFloat(p.old_value?.toFixed(2)), override: p.override
      }}).value()).toEqual({
        total_off_3p_attempts: { value: 100 },
        off_2pmid: { value: 0.4 },
        total_off_2pmid_attempts: { value: 200 },
        total_off_fga: { value: 300 },
      
        off_3p: { 
          value: 0.34,
          old_value: 0.3,
          override: "Adjusted by [4.0] for [Cowan, Anthony] override of [off_3p] to [50]%"
        },
        off_efg: { 
          value: luckAdj ? 0.5 : 0.56,
          old_value: luckAdj ? undefined : 0.5, 
          override: "Adjusted by [6.0] for [Cowan, Anthony] override of [off_3p] to [50]%"
        },
        off_ppp: { 
          value: luckAdj ? 110 : 112.25, 
          old_value: luckAdj ? undefined : 110, 
          override: "Adjusted by [2.3] for [Cowan, Anthony] override of [off_3p] to [50]%"
        },
        off_adj_ppp: { 
          value: luckAdj ? 110 : 112.5, 
          old_value: luckAdj ? undefined : 110, 
          override: "Adjusted by [2.5] for [Cowan, Anthony] override of [off_3p] to [50]%"
        },
        off_net: { 
          value: luckAdj ? 10 : 12.5, 
          old_value: luckAdj ? undefined : 10, 
          override: "Adjusted by [2.5] for [Cowan, Anthony] override of [off_3p] to [50]%"
        },
        off_raw_net: { 
          value: luckAdj ? 10 : 12.25, 
          old_value: luckAdj ? undefined : 10, 
          override: "Adjusted by [2.3] for [Cowan, Anthony] override of [off_3p] to [50]%"
        },
      });
    });
  });
  test("OverrideUtils - overrideMutableVal", () => {
    //(all the different combos for this rather horrible method)
    const test1 = { key: "test" } as IndivStatSet;
    const test2a = { key: "test", num_key: { value: 1.0 } } as IndivStatSet;
    const test2b = _.clone(test2a);
    const test2c = _.clone(test2a);
    const test3a = { key: "test", num_key: { value: 1.0, old_value: 10.0, override: "test reason" } } as IndivStatSet;
    const test3b = _.clone(test3a);
    const test3c = _.clone(test3a);
    const test4a = { key: "test", num_key: { value: 1.0, old_value: 10.0, override: "wrong reason" } } as IndivStatSet;
    const test4b = _.clone(test4a);
    const test5a = { key: "test", num_key: { value: 1.0, old_value: 10.0 } } as IndivStatSet;
    // Add override (abs)
    expect(OverrideUtils.overrideMutableVal(test1, "num_key", 4.0, "test reason")).toBe(false);
    expect(test1).toEqual({ key: "test" });
    expect(OverrideUtils.overrideMutableVal(test2a, "num_key", 4.0, "test reason")).toBe(true);
    expect(test2a).toEqual({ key: "test", num_key: { value: 4.0, old_value: 1.0, override: "test reason" } });
    expect(OverrideUtils.overrideMutableVal(test3a, "num_key", 4.0, "test reason")).toBe(true);
    expect(test3a).toEqual({ key: "test", num_key: { value: 4.0, old_value: 10.0, override: "test reason" } });
    expect(OverrideUtils.overrideMutableVal(test4a, "num_key", 4.0, "test reason")).toBe(true);
    expect(test4a).toEqual({ key: "test", num_key: { value: 4.0, old_value: 10.0, override: "test reason" } });
    // Add override (delta)
    expect(OverrideUtils.overrideMutableVal(test1, "num_key", { delta: 20.0 }, "test reason")).toBe(false);
    expect(test1).toEqual({ key: "test" });
    expect(OverrideUtils.overrideMutableVal(test2b, "num_key", { delta: 20.0 }, "test reason")).toBe(true);
    expect(test2b).toEqual({ key: "test", num_key: { value: 21.0, old_value: 1.0, override: "test reason" } });
    expect(OverrideUtils.overrideMutableVal(test3b, "num_key", { delta: 20.0 }, "test reason")).toBe(true);
    expect(test3b).toEqual({ key: "test", num_key: { value: 30.0, old_value: 10.0, override: "test reason" } });
    // Remove override:
    expect(OverrideUtils.overrideMutableVal(test1, "num_key", undefined, "test reason")).toBe(false);
    expect(test1).toEqual({ key: "test" });
    expect(OverrideUtils.overrideMutableVal(test2c, "num_key", undefined, "test reason")).toBe(false);
    expect(test2c).toEqual({ key: "test", num_key: { value: 1.0 } });
    expect(OverrideUtils.overrideMutableVal(test3c, "num_key", undefined, "test reason")).toBe(false);
    expect(test3c).toEqual({ key: "test", num_key: { value: 10.0 } });
    expect(OverrideUtils.overrideMutableVal(test4b, "num_key", undefined, "test reason")).toBe(false);
    expect(test4b).toEqual({ key: "test", num_key: { value: 1.0, old_value: 10.0, override: "wrong reason" } });
    expect(OverrideUtils.overrideMutableVal(test4b, "num_key", undefined, undefined)).toBe(false);
    expect(test4b).toEqual({ key: "test", num_key: { value: 10.0 } });
    expect(OverrideUtils.overrideMutableVal(test5a, "num_key", undefined, "test reason")).toBe(false);
    expect(test5a).toEqual({ key: "test", num_key: { value: 10.0 } });
  });
  test("OverrideUtils - diff", () => {
    expect(OverrideUtils.diff({})).toBe(0);
    expect(OverrideUtils.diff({ value: 10 })).toBe(0);
    expect(OverrideUtils.diff({ value: 10, old_value: 9 })).toBe(1);
  });
  test("OverrideUtils - updateDerivedStats", () => {
    const testIn1 = {
      key: "test",
      off_3pr: { value: 0.5 },
      off_2pmidr: { value: 0.25 },
      off_2primr: { value: 0.25 },
      off_3p: { value: 0.4, old_value: 0.3, override: "blah" },
      off_2pmid: { value: 0.5, old_value: 0.3, override: "blah" },
      off_2prim: { value: 0.6, old_value: 0.3, override: "blah" },

      off_2p: { value: 10 },
      off_efg: { value: -1000, old_value: 20 },
    } as IndivStatSet;
    const testOut1 = _.clone(testIn1);
    const testIn2 = {
      key: "test",
      off_3pr: { value: 0.5 },
      off_2pmidr: { value: 0.25 },
      off_2primr: { value: 0.25 },

      off_3p: { value: 0.4, old_value: 0.4, override: "blah" },
      off_2pmid: { value: 0.5 },
      //no off_2prim

      off_2p: { value: 10, old_value: 30, override: "test2-in" },
      off_efg: { value: -1000, old_value: 20 },
    } as IndivStatSet;
    const testOut2 = _.clone(testIn2);
    OverrideUtils.updateDerivedStats(testIn1, "test1");
    expect(testIn1).toEqual({
      ...testOut1,
      off_2p: { value: 10.25, old_value: 10, override: "test1" },
      off_efg: { value: 20.2, old_value: 20, override: "test1" },
    });
    OverrideUtils.updateDerivedStats(testIn2, "test2");
    expect(testIn2).toEqual({
      ...testOut2,
      off_2p: { value: 30 },
      off_efg: { value: 20 },
    });
  });
});
