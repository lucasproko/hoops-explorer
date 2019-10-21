import renderer from 'react-test-renderer';
import React from 'react';
import TeamStatsTable from '../TeamStatsTable';
import { sampleTeamStatsResponse } from "../../sample-data/sampleTeamStatsResponse"

describe("TeamStatsTable", () => {
  test("TeamStatsTable - should create snapshot", () => {
    const testData = sampleTeamStatsResponse.aggregations.tri_filter.buckets;
    const component = renderer.create(<TeamStatsTable teamStats={testData} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
