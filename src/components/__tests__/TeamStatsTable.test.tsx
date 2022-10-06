/**
 * @jest-environment jsdom
 */

import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import React from 'react';
import _ from 'lodash';
import TeamStatsTable from '../TeamStatsTable';
import { SampleDataUtils } from "../../sample-data/SampleDataUtils";
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse";
import { sampleTeamStatsResponse } from "../../sample-data/sampleTeamStatsResponse";
import { samplePlayerStatsResponse } from "../../sample-data/samplePlayerStatsResponse";
import { GameFilterParams, ParamDefaults } from '../../utils/FilterModels';
import { StatModels, TeamStatSet, IndivStatSet } from '../../utils/StatModels';
import fs from 'fs';

//@ts-nocheck
import fetchMock from 'isomorphic-unfetch';

describe("TeamStatsTable", () => {

  const testYear = "2021/22";

  afterEach(() => {
    (fetchMock as any).restore();
    (fetchMock as any).reset();
  });

  // Tidy up snapshot rendering:
  expect.addSnapshotSerializer(SampleDataUtils.summarizeEnrichedApiResponse(
    sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets.baseline
  ));

  const testData = _.assign(
    sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as { on: TeamStatSet, off: TeamStatSet, baseline: TeamStatSet },
    { global: StatModels.emptyTeam(), onOffMode: true }
);
  const players = samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [];
  const testRosterData = {
    on: _.cloneDeep(players) as unknown as IndivStatSet[],
    off: _.cloneDeep(players) as unknown as IndivStatSet[],
    baseline: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[],
    global: _.cloneDeep(players) as unknown as IndivStatSet[],
    error_code: undefined
  };
  const testLineupData = {
    lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
  }


  test("TeamStatsTable - should create snapshot", () => {
    const component = renderer.create(<TeamStatsTable
      gameFilterParams={{}}
      dataEvent={{
        teamStats: testData,
        rosterStats: { on: [], off: [], baseline: [], global: [] },
        lineupStats: []
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
      />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("TeamStatsTable - should create snapshot, luck enabled + diagnostics + grades shown", async () => {

    const sampleData = JSON.parse(
      fs.readFileSync("./public/leaderboards/lineups/stats_all_Men_2020_High.json", { encoding: "UTF-8"})
    );  

    // Mock the URL calls needed to get the stats
    [ "Combo", "High", "Medium", "Low"].forEach(tier => {
      //(old files)
      (fetchMock as any).mock(`/leaderboards/lineups/stats_all_Men_${testYear.substring(0, 4)}_${tier}.json`, {
        status: 200,
        body: tier == "High" ? sampleData : { }
      });
      //(new files)
      (fetchMock as any).mock(`/api/getStats?&gender=Men&year=${testYear.substring(0, 4)}&tier=${tier}`, {
        status: 200,
        body: tier == "High" ? sampleData : { }
      });
    });

    var component: ReactTestRenderer;
    await act(async () => {
      component = renderer.create(<TeamStatsTable
        gameFilterParams={{ 
          year: testYear,
          onOffLuck: true, showOnOffLuckDiags: true, showRoster: true, 
          showExtraInfo: true, showTeamPlayTypes: true, showGrades: ParamDefaults.defaultEnabledGrade }}
        dataEvent={{
          teamStats: testData,
          rosterStats: testRosterData,
          lineupStats: [ ] //(can't find lineup that works with this, needs more investigation - in the meantime just show the empty table)
        }}
        onChangeState={(newParams: GameFilterParams) => {}}
      />);
      return new Promise((resolve) => setTimeout(resolve, 50));
    });
    const tree = component!.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
