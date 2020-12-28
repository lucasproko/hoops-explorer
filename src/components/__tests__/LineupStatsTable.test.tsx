import renderer from 'react-test-renderer';
import React from 'react';
import LineupStatsTable from '../LineupStatsTable';
import { LineupFilterParams } from "../utils/FilterModels";
import { SampleDataUtils } from "../../sample-data/SampleDataUtils";
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse";
import { sampleTeamStatsResponse } from "../../sample-data/sampleTeamStatsResponse";
import { samplePlayerStatsResponse } from "../../sample-data/samplePlayerStatsResponse";
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import _ from "lodash";

describe("LineupStatsTable", () => {

  // Tidy up snapshot rendering:
  expect.addSnapshotSerializer(SampleDataUtils.summarizeEnrichedApiResponse(
    sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets[0]
  ));


  test("LineupStatsTable - should create snapshot (no individual data)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        startingState={{}}
        dataEvent={{
          teamStats: { on:{}, off: {}, baseline: {}, global: {}, onOffMode: true },
          rosterStats: {},
          lineupStats: testData
        }}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("LineupStatsTable - should create snapshot (with individual data)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const teamData = _.assign(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
      { global: {}, onOffMode: true }
    );
    const playerData = {
      baseline: samplePlayerStatsResponse.responses[0].aggregations.tri_filter.buckets.on.player.buckets,
      global: samplePlayerStatsResponse.responses[0].aggregations.tri_filter.buckets.baseline.player.buckets
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        startingState={{}}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData
        }}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("LineupStatsTable - should create snapshot (with individual data - plain, luck, luck diags)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const teamData = _.assign(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
      { global: {}, onOffMode: true }
    );
    const playerData = {
      baseline: samplePlayerStatsResponse.responses[0].aggregations.tri_filter.buckets.on.player.buckets,
      global: samplePlayerStatsResponse.responses[0].aggregations.tri_filter.buckets.baseline.player.buckets
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        startingState={{ decorate: false, lineupLuck: true, showLineupLuckDiags: true }}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData
        }}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("LineupStatsTable - should create snapshot (with individual data, aggregated by PG)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const teamData = _.assign(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
      { global: {}, onOffMode: true, aggByPos: "PG", showTotal: true }
    );
    const playerData = {
      baseline: samplePlayerStatsResponse.responses[0].aggregations.tri_filter.buckets.on.player.buckets,
      global: samplePlayerStatsResponse.responses[0].aggregations.tri_filter.buckets.baseline.player.buckets
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        startingState={{}}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData
        }}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });});
