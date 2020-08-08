import renderer from 'react-test-renderer';
import React from 'react';
import RosterStatsTable from '../RosterStatsTable';
import { samplePlayerStatsResponse } from "../../sample-data/samplePlayerStatsResponse";
import { GameFilterParams } from "../utils/FilterModels";
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import _ from "lodash";

describe("RosterStatsTable", () => {
  test("RosterStatsTable (baseline only, !expanded) - should create snapshot", () => {
    const testData = {
      on: [],
      off: [],
      baseline: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      global: _.cloneDeep(samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || []),
      error_code: undefined
    };
    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{showExpanded: false}}
      dataEvent={{
        teamStats: {on: {}, off: {}, global: {}, onOffMode: true, baseline: {}},
        rosterStats: testData
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("RosterStatsTable (baseline only, expanded) - should create snapshot", () => {
    const testData = {
      on: [],
      off: [],
      baseline: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      global: _.cloneDeep(samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || []),
      error_code: undefined
    };
    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{showExpanded: true}}
      dataEvent={{
        teamStats: {on: {}, off: {}, global: {}, onOffMode: true, baseline: {}},
        rosterStats: testData
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("RosterStatsTable (!expanded) - should create snapshot", () => {
    const testData = {
      on: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.on?.player?.buckets || [],
      off: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.off?.player?.buckets || [],
      baseline: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      global: _.cloneDeep(samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || []),
      error_code: undefined
    };
    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{}}
      dataEvent={{
        teamStats: {on: {}, off: {}, global: {}, onOffMode: true, baseline: {}},
        rosterStats: testData
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("RosterStatsTable (expanded) - should create snapshot", () => {
    const testData = {
      on: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.on?.player?.buckets || [],
      off: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.off?.player?.buckets || [],
      baseline: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      global: _.cloneDeep(samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || []),
      error_code: undefined
    };
    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{showExpanded: true}}
      dataEvent={{
        teamStats: {on: {}, off: {}, global: {}, onOffMode: true, baseline: {}},
        rosterStats: testData
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("RosterStatsTable (luck enabled, all the diags) - should create snapshot", () => {
    const testData = {
      on: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.on?.player?.buckets || [],
      off: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.off?.player?.buckets || [],
      baseline: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      global: _.cloneDeep(samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || []),
      error_code: undefined
    };

    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{onOffLuck: true, showPlayerOnOffLuckDiags: true, showDiag: true, showPosDiag: true }}
      dataEvent={{
        teamStats: {on: {}, off: {}, global: {}, onOffMode: true, baseline: {}},
        rosterStats: testData
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("RosterStatsTable (manual enabled - manual dialog showing, all the diags) - should create snapshot", () => {
    const testData = {
      on: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.on?.player?.buckets || [],
      off: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.off?.player?.buckets || [],
      baseline: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      global: _.cloneDeep(samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || []),
      error_code: undefined
    };

    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{onOffLuck: false, showPlayerOnOffLuckDiags: true, showDiag: true, showPosDiag: true,
        manual: [
          { rowId: "Cowan, Anthony / Baseline", newVal: 0.5, statName: "off_3p", use: true },
        ],
        showPlayerManual: true
       }}
      dataEvent={{
        teamStats: {on: {}, off: {}, global: {}, onOffMode: true, baseline: {}},
        rosterStats: testData
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("RosterStatsTable (luck+overrides enabled, all the diags) - should create snapshot", () => {
    const testData = {
      on: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.on?.player?.buckets || [],
      off: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.off?.player?.buckets || [],
      baseline: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      global: _.cloneDeep(samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || []),
      error_code: undefined
    };

    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{onOffLuck: true, showPlayerOnOffLuckDiags: true, showDiag: true, showPosDiag: true,
        manual: [
          { rowId: "Cowan, Anthony / Baseline", newVal: 0.5, statName: "off_3p", use: true },
        ],
        showPlayerManual: true
       }}
      dataEvent={{
        teamStats: {on: {}, off: {}, global: {}, onOffMode: true, baseline: {}},
        rosterStats: testData
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
