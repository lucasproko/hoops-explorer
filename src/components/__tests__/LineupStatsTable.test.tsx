import renderer from 'react-test-renderer';
import React from 'react';
import LineupStatsTable from '../LineupStatsTable';
import { LineupFilterParams } from "../utils/FilterModels";
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse"
import { samplePlayerStatsResponse } from "../../sample-data/samplePlayerStatsResponse"
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("LineupStatsTable", () => {
  test("LineupStatsTable - should create snapshot (no individual data)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        lineupStats={testData}
        rosterStats={{}}
        startingState={{}}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("LineupStatsTable - should create snapshot (with individual data)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const playerData = {
      baseline: samplePlayerStatsResponse.aggregations.tri_filter.buckets.on.player.buckets,
      global: samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        lineupStats={testData}
        rosterStats={playerData}
        startingState={{}}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
