import React from "react";
import TeamReportStatsTable, {
  TeamReportStatsModel,
} from "../TeamReportStatsTable";
import { TeamReportFilterParams } from "../../utils/FilterModels";
import { SampleDataUtils } from "../../sample-data/SampleDataUtils";
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse";
import { sampleTeamStatsResponse } from "../../sample-data/sampleTeamStatsResponse";
import { samplePlayerStatsResponse } from "../../sample-data/samplePlayerStatsResponse";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import _ from "lodash";
import {
  LineupStatSet,
  StatModels,
  IndivStatSet,
  TeamStatSet,
} from "../../utils/StatModels";

describe("TeamReportStatsTable", () => {
  // Tidy up snapshot rendering:
  expect.addSnapshotSerializer(
    SampleDataUtils.summarizeEnrichedApiResponse(
      sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets[0]
    )
  );

  test("TeamReportStatsTable - should create snapshot (no individual data)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups
        .buckets as LineupStatSet[],
    };
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        startingState={{}}
        dataEvent={{
          teamStats: {
            on: StatModels.emptyTeam(),
            off: StatModels.emptyTeam(),
            global: StatModels.emptyTeam(),
            onOffMode: true,
            baseline: StatModels.emptyTeam(),
          },
          rosterStats: { on: [], off: [], baseline: [], global: [], other: [] },
          lineupStats: testData,
        }}
        onChangeState={dummyChangeStateCallback}
        testMode={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamReportStatsTable - should create snapshot (with individual data)", () => {
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
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        startingState={{}}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData,
        }}
        onChangeState={dummyChangeStateCallback}
        testMode={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamReportStatsTable - should create snapshot (with individual data - all viewing modes on)", () => {
    //TODO: RAPM, but need some better sample data

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
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        startingState={{ incRepOnOff: true }}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData,
        }}
        onChangeState={dummyChangeStateCallback}
        testMode={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test("TeamReportStatsTable - should create snapshot (with individual data - all viewing modes on + luck)", () => {
    //TODO: RAPM, but need some better sample data

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
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        startingState={{ incRepOnOff: true, teamLuck: true }}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData,
        }}
        onChangeState={dummyChangeStateCallback}
        testMode={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  // TODO: RAPM diagnostics mode, but need some better sample data

  test("TeamReportStatsTable - should create snapshot (with individual data - rep on-off diagnostic mode)", () => {
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
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        startingState={{ incRepOnOff: true, repOnOffDiagMode: "20" }}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData,
        }}
        onChangeState={dummyChangeStateCallback}
        testMode={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamReportStatsTable - should create snapshot (with individual data - rep on-off diagnostic mode, expanded)", () => {
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
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        startingState={{
          incRepOnOff: true,
          repOnOffDiagMode: "20",
          filter: "AaWiggins",
        }}
        dataEvent={{
          teamStats: teamData,
          rosterStats: playerData,
          lineupStats: testData,
        }}
        onChangeState={dummyChangeStateCallback}
        testMode={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
