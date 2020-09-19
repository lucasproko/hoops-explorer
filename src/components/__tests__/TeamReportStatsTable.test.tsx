import renderer from 'react-test-renderer';
import React from 'react';
import TeamReportStatsTable, { TeamReportStatsModel } from '../TeamReportStatsTable';
import { LineupStatsModel } from '../LineupStatsTable';
import { TeamReportFilterParams } from "../utils/FilterModels";
import { SampleDataUtils } from "../../sample-data/SampleDataUtils";
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse";
import { sampleTeamStatsResponse } from "../../sample-data/sampleTeamStatsResponse";
import { samplePlayerStatsResponse } from "../../sample-data/samplePlayerStatsResponse";
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import _ from "lodash";

describe("TeamReportStatsTable", () => {

  // Tidy up snapshot rendering:
  expect.addSnapshotSerializer(SampleDataUtils.summarizeEnrichedApiResponse(
    sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets[0]
  ));

  test("TeamReportStatsTable - should create snapshot (no individual data)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        startingState={{}}
        dataEvent={{
          teamStats: { on:{}, off: {}, baseline: {}, global: {}, onOffMode: true },
          rosterStats: {},
          lineupStats: testData
        }}
        onChangeState={dummyChangeStateCallback}
        testMode = {true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamReportStatsTable - should create snapshot (with individual data)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const teamData = _.assign(
      sampleTeamStatsResponse.aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
      { global: {}, onOffMode: true }
    );
    const playerData = {
      baseline: samplePlayerStatsResponse.aggregations.tri_filter.buckets.on.player.buckets,
      global: samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets
    };
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        startingState={{}}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData
        }}
        onChangeState={dummyChangeStateCallback}
        testMode = {true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamReportStatsTable - should create snapshot (with individual data - all viewing modes on)", () => {

    //TODO: RAPM, but need some better sample data

    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const teamData = _.assign(
      sampleTeamStatsResponse.aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
      { global: {}, onOffMode: true }
    );
    const playerData = {
      baseline: samplePlayerStatsResponse.aggregations.tri_filter.buckets.on.player.buckets,
      global: samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets
    };
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        startingState={{incRepOnOff: true}}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData
        }}
        onChangeState={dummyChangeStateCallback}
        testMode = {true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test("TeamReportStatsTable - should create snapshot (with individual data - all viewing modes on + luck)", () => {

    //TODO: RAPM, but need some better sample data

    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const teamData = _.assign(
      sampleTeamStatsResponse.aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
      { global: {}, onOffMode: true }
    );
    const playerData = {
      baseline: samplePlayerStatsResponse.aggregations.tri_filter.buckets.on.player.buckets,
      global: samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets
    };
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        startingState={{incRepOnOff: true, teamLuck: true}}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData
        }}
        onChangeState={dummyChangeStateCallback}
        testMode = {true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  // TODO: RAPM diagnostics mode, but need some better sample data

  test("TeamReportStatsTable - should create snapshot (with individual data - rep on-off diagnostic mode)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const teamData = _.assign(
      sampleTeamStatsResponse.aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
      { global: {}, onOffMode: true }
    );
    const playerData = {
      baseline: samplePlayerStatsResponse.aggregations.tri_filter.buckets.on.player.buckets,
      global: samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets
    };
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        startingState={{incRepOnOff: true, repOnOffDiagMode: "20"}}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData
        }}
        onChangeState={dummyChangeStateCallback}
        testMode = {true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamReportStatsTable - should create snapshot (with individual data - rep on-off diagnostic mode, expanded)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const teamData = _.assign(
      sampleTeamStatsResponse.aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
      { global: {}, onOffMode: true }
    );
    const playerData = {
      baseline: samplePlayerStatsResponse.aggregations.tri_filter.buckets.on.player.buckets,
      global: samplePlayerStatsResponse.aggregations.tri_filter.buckets.baseline.player.buckets
    };
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        startingState={{incRepOnOff: true, repOnOffDiagMode: "20", filter: "AaWiggins"}}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData
        }}
        onChangeState={dummyChangeStateCallback}
        testMode = {true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
