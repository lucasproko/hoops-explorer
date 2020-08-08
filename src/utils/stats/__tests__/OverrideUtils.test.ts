

import _ from 'lodash';

import { OverrideUtils } from "../OverrideUtils";
import { ParamPrefixes, ManualOverride } from "../../FilterModels";

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
  test("OverrideUtils - overrideMutableVal", () => {
    //(all the different combos for this rather horrible method)
    const test1 = { };
    const test2a = { key: { value: 1.0 } };
    const test2b = _.clone(test2a);
    const test2c = _.clone(test2a);
    const test3a = { key: { value: 1.0, old_value: 10.0, override: "test reason" } };
    const test3b = _.clone(test3a);
    const test3c = _.clone(test3a);
    const test4a = { key: { value: 1.0, old_value: 10.0, override: "wrong reason" } };
    const test4b = _.clone(test4a);
    const test5a = { key: { value: 1.0, old_value: 10.0 } };
    // Add override (abs)
    expect(OverrideUtils.overrideMutableVal(test1, "key", 4.0, "test reason")).toBe(false);
    expect(test1).toEqual({});
    expect(OverrideUtils.overrideMutableVal(test2a, "key", 4.0, "test reason")).toBe(true);
    expect(test2a).toEqual({ key: { value: 4.0, old_value: 1.0, override: "test reason" } });
    expect(OverrideUtils.overrideMutableVal(test3a, "key", 4.0, "test reason")).toBe(true);
    expect(test3a).toEqual({ key: { value: 4.0, old_value: 10.0, override: "test reason" } });
    expect(OverrideUtils.overrideMutableVal(test4a, "key", 4.0, "test reason")).toBe(true);
    expect(test4a).toEqual({ key: { value: 4.0, old_value: 10.0, override: "test reason" } });
    // Add override (delta)
    expect(OverrideUtils.overrideMutableVal(test1, "key", { delta: 20.0 }, "test reason")).toBe(false);
    expect(test1).toEqual({});
    expect(OverrideUtils.overrideMutableVal(test2b, "key", { delta: 20.0 }, "test reason")).toBe(true);
    expect(test2b).toEqual({ key: { value: 21.0, old_value: 1.0, override: "test reason" } });
    expect(OverrideUtils.overrideMutableVal(test3b, "key", { delta: 20.0 }, "test reason")).toBe(true);
    expect(test3b).toEqual({ key: { value: 30.0, old_value: 10.0, override: "test reason" } });
    // Remove override:
    expect(OverrideUtils.overrideMutableVal(test1, "key", undefined, "test reason")).toBe(false);
    expect(test1).toEqual({});
    expect(OverrideUtils.overrideMutableVal(test2c, "key", undefined, "test reason")).toBe(false);
    expect(test2c).toEqual({ key: { value: 1.0 } });
    expect(OverrideUtils.overrideMutableVal(test3c, "key", undefined, "test reason")).toBe(false);
    expect(test3c).toEqual({ key: { value: 10.0 } });
    expect(OverrideUtils.overrideMutableVal(test4b, "key", undefined, "test reason")).toBe(false);
    expect(test4b).toEqual({ key: { value: 1.0, old_value: 10.0, override: "wrong reason" } });
    expect(OverrideUtils.overrideMutableVal(test4b, "key", undefined, undefined)).toBe(false);
    expect(test4b).toEqual({ key: { value: 10.0 } });
    expect(OverrideUtils.overrideMutableVal(test5a, "key", undefined, "test reason")).toBe(false);
    expect(test5a).toEqual({ key: { value: 10.0 } });
  });
  test("OverrideUtils - diff", () => {
    expect(OverrideUtils.diff({})).toBe(0);
    expect(OverrideUtils.diff({ value: 10 })).toBe(0);
    expect(OverrideUtils.diff({ value: 10, old_value: 9 })).toBe(1);
  });
  test("OverrideUtils - updateDerivedStats", () => {
    const testIn1 = {
      off_3pr: { value: 0.5 },
      off_2pmidr: { value: 0.25 },
      off_2primr: { value: 0.25 },
      off_3p: { value: 0.4, old_value: 0.3, override: "blah" },
      off_2pmid: { value: 0.5, old_value: 0.3, override: "blah" },
      off_2prim: { value: 0.6, old_value: 0.3, override: "blah" },

      off_2p: { value: 10 },
      off_efg: { value: -1000, old_value: 20 },
    };
    const testOut1 = _.clone(testIn1);
    const testIn2 = {
      off_3pr: { value: 0.5 },
      off_2pmidr: { value: 0.25 },
      off_2primr: { value: 0.25 },

      off_3p: { value: 0.4, old_value: 0.4, override: "blah" },
      off_2pmid: { value: 0.5 },
      //no off_2prim

      off_2p: { value: 10, old_value: 30, override: "test2-in" },
      off_efg: { value: -1000, old_value: 20 },
    };
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
