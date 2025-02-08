import React from "react";
import LineupStatsTable from "../LineupStatsTable";
import { LineupFilterParams } from "../../utils/FilterModels";
import { SampleDataUtils } from "../../sample-data/SampleDataUtils";
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse";
import { sampleTeamStatsResponse } from "../../sample-data/sampleTeamStatsResponse";
import { samplePlayerStatsResponse } from "../../sample-data/samplePlayerStatsResponse";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import _ from "lodash";
import {
  StatModels,
  LineupStatSet,
  TeamStatSet,
  IndivStatSet,
} from "../../utils/StatModels";

describe("LineupStatsTable", () => {
  // Tidy up snapshot rendering:
  expect.addSnapshotSerializer(
    SampleDataUtils.summarizeEnrichedApiResponse(
      sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets[0]
    )
  );

  test("LineupStatsTable - should create snapshot (no individual data)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups
        .buckets as LineupStatSet[],
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        startingState={{}}
        dataEvent={{
          teamStats: {
            on: StatModels.emptyTeam(),
            off: StatModels.emptyTeam(),
            baseline: StatModels.emptyTeam(),
            global: StatModels.emptyTeam(),
            onOffMode: true,
          },
          rosterStats: { on: [], off: [], baseline: [], global: [], other: [] },
          lineupStats: testData,
        }}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("LineupStatsTable - should create snapshot (totals/off)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups
        .buckets as LineupStatSet[],
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        startingState={{ maxTableSize: "2", showTotal: true, showOff: true }}
        dataEvent={{
          teamStats: {
            on: StatModels.emptyTeam(),
            off: StatModels.emptyTeam(),
            baseline: StatModels.emptyTeam(),
            global: StatModels.emptyTeam(),
            onOffMode: true,
          },
          rosterStats: { on: [], off: [], baseline: [], global: [], other: [] },
          lineupStats: testData,
        }}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("LineupStatsTable - should create snapshot (with individual data)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups
        .buckets as LineupStatSet[],
    };
    const teamData = _.assign(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as {
        on: TeamStatSet;
        off: TeamStatSet;
        baseline: TeamStatSet;
      },
      { global: StatModels.emptyTeam(), onOffMode: true }
    );
    const playerData = {
      on: [],
      off: [],
      baseline: samplePlayerStatsResponse.responses[0].aggregations.tri_filter
        .buckets.on.player.buckets as unknown as IndivStatSet[],
      global: samplePlayerStatsResponse.responses[0].aggregations.tri_filter
        .buckets.baseline.player.buckets as unknown as IndivStatSet[],
      other: [],
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        startingState={{}}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData,
        }}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("LineupStatsTable - should create snapshot (with individual data - plain, luck, luck diags)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups
        .buckets as LineupStatSet[],
    };
    const teamData = _.assign(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as {
        on: TeamStatSet;
        off: TeamStatSet;
        baseline: TeamStatSet;
      },
      { global: StatModels.emptyTeam(), onOffMode: true }
    );
    const playerData = {
      on: [],
      off: [],
      baseline: samplePlayerStatsResponse.responses[0].aggregations.tri_filter
        .buckets.on.player.buckets as unknown as IndivStatSet[],
      global: samplePlayerStatsResponse.responses[0].aggregations.tri_filter
        .buckets.baseline.player.buckets as unknown as IndivStatSet[],
      other: [],
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        startingState={{
          decorate: false,
          lineupLuck: true,
          showLineupLuckDiags: true,
        }}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData,
        }}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("LineupStatsTable - should create snapshot (with individual data - plain) ... raw pts mode", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups
        .buckets as LineupStatSet[],
    };
    const teamData = _.assign(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as {
        on: TeamStatSet;
        off: TeamStatSet;
        baseline: TeamStatSet;
      },
      { global: StatModels.emptyTeam(), onOffMode: true }
    );
    const playerData = {
      on: [],
      off: [],
      baseline: samplePlayerStatsResponse.responses[0].aggregations.tri_filter
        .buckets.on.player.buckets as unknown as IndivStatSet[],
      global: samplePlayerStatsResponse.responses[0].aggregations.tri_filter
        .buckets.baseline.player.buckets as unknown as IndivStatSet[],
      other: [],
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        startingState={{ decorate: false, showRawPts: true }}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData,
        }}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("LineupStatsTable - should create snapshot (with individual data, aggregated by PG)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups
        .buckets as LineupStatSet[],
    };
    const teamData = _.assign(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as {
        on: TeamStatSet;
        off: TeamStatSet;
        baseline: TeamStatSet;
      },
      {
        global: StatModels.emptyTeam(),
        onOffMode: true,
        aggByPos: "PG",
        showTotal: true,
      }
    );
    const playerData = {
      on: [],
      off: [],
      baseline: samplePlayerStatsResponse.responses[0].aggregations.tri_filter
        .buckets.on.player.buckets as unknown as IndivStatSet[],
      global: samplePlayerStatsResponse.responses[0].aggregations.tri_filter
        .buckets.baseline.player.buckets as unknown as IndivStatSet[],
      other: [],
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        startingState={{}}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData,
        }}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
