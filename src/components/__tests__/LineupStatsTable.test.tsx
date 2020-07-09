import renderer from 'react-test-renderer';
import React from 'react';
import LineupStatsTable from '../LineupStatsTable';
import { LineupFilterParams } from "../utils/FilterModels";
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse";
import { sampleTeamStatsResponse } from "../../sample-data/sampleTeamStatsResponse";
import { samplePlayerStatsResponse } from "../../sample-data/samplePlayerStatsResponse";
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import _ from "lodash";

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
        teamStats={{}}
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
    const teamData = _.merge(
      sampleTeamStatsResponse.aggregations.tri_filter.buckets,
      { global: {}, onOffMode: true }
    );
    const playerData = {
      baseline: samplePlayerStatsResponse.aggregations.tri_filter.buckets.on.player.buckets,
      global: samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        lineupStats={testData}
        teamStats={teamData}
        rosterStats={playerData}
        startingState={{}}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
