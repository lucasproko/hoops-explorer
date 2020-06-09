import renderer from 'react-test-renderer';
import React from 'react';
import RosterStatsTable from '../RosterStatsTable';
import { samplePlayerStatsResponse } from "../../sample-data/samplePlayerStatsResponse";
import { GameFilterParams } from "../utils/FilterModels";
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("RosterStatsTable", () => {
  test("RosterStatsTable (baseline only, !expanded) - should create snapshot", () => {
    const testData = {
      on: [],
      off: [],
      baseline: samplePlayerStatsResponse?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      error_code: undefined
    };
    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{showExpanded: false}}
      teamStats={{on: {}, off: {}, onOffMode: true, baseline: {}}}
      rosterStats={testData}
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
      error_code: undefined
    };
    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{showExpanded: true}}
      teamStats={{on: {}, off: {}, onOffMode: true, baseline: {}}}
      rosterStats={testData}
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
      error_code: undefined
    };
    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{}}
      teamStats={{on: {}, off: {}, onOffMode: true, baseline: {}}}
      rosterStats={testData}
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
      error_code: undefined
    };
    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{showExpanded: true}}
      teamStats={{on: {}, off: {}, onOffMode: true, baseline: {}}}
      rosterStats={testData}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
