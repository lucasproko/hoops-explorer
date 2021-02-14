import renderer from 'react-test-renderer';
import React from 'react';
import _ from 'lodash';
import TeamStatsTable from '../TeamStatsTable';
import { SampleDataUtils } from "../../sample-data/SampleDataUtils";
import { sampleTeamStatsResponse } from "../../sample-data/sampleTeamStatsResponse"
import { GameFilterParams } from '../../utils/FilterModels';

describe("TeamStatsTable", () => {

  // Tidy up snapshot rendering:
  expect.addSnapshotSerializer(SampleDataUtils.summarizeEnrichedApiResponse(
    sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets.baseline
  ));

  test("TeamStatsTable - should create snapshot", () => {
    const testData = _.assign(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
      { global: {}, onOffMode: true }
    );
    const component = renderer.create(<TeamStatsTable
      gameFilterParams={{}}
      dataEvent={{
        teamStats: testData,
        rosterStats: {},
        lineupStats: []
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
      />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("TeamStatsTable - should create snapshot, luck enabled + diagnostics shown", () => {
    const testData = _.assign(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
      { global: {}, onOffMode: true }
    );
    const component = renderer.create(<TeamStatsTable
      gameFilterParams={{ onOffLuck: true, showOnOffLuckDiags: true, showTeamPlayTypes: true }}
      dataEvent={{
        teamStats: testData,
        rosterStats: {},
        lineupStats: []
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
      />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
