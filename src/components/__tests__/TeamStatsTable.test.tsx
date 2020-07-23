import renderer from 'react-test-renderer';
import React from 'react';
import _ from 'lodash';
import TeamStatsTable from '../TeamStatsTable';
import { sampleTeamStatsResponse } from "../../sample-data/sampleTeamStatsResponse"
import { GameFilterParams } from '../../utils/FilterModels';

describe("TeamStatsTable", () => {
  test("TeamStatsTable - should create snapshot", () => {
    const testData = _.merge(sampleTeamStatsResponse.aggregations.tri_filter.buckets, { global: {}, onOffMode: true });
    const component = renderer.create(<TeamStatsTable
      gameFilterParams={{}}
      dataEvent={{
        teamStats: testData,
        rosterStats: {}
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
      />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("TeamStatsTable - should create snapshot, luck enabled + diagnostics shown", () => {
    const testData = _.merge(sampleTeamStatsResponse.aggregations.tri_filter.buckets, { global: {}, onOffMode: true });
    const component = renderer.create(<TeamStatsTable
      gameFilterParams={{ onOffLuck: true, showOnOffLuckDiags: true }}
      dataEvent={{
        teamStats: testData,
        rosterStats: {}
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
      />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
