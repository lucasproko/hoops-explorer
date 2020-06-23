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
      rosterStats={{}}
      teamStats={testData}
      onChangeState={(newParams: GameFilterParams) => {}}
      />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
