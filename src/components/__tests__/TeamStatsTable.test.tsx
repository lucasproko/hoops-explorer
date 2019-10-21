import renderer, { ReactTestRenderer } from 'react-test-renderer';
import React from 'react';
import TeamStatsTable from '../TeamStatsTable';
import { sampleTeamStatsResponse } from "../../sample-data/sampleTeamStatsResponse"

const testData = sampleTeamStatsResponse.aggregations.tri_filter.buckets;
let component: ReactTestRenderer;
beforeEach(() => {
  const teamStatsTable = <TeamStatsTable teamStats={testData} />;
  component = renderer.create(teamStatsTable);
});

describe("TeamStatsTable", () => {
  test("TeamStatsTable - should create snapshot", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
