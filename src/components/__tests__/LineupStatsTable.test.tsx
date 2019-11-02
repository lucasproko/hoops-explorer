import renderer from 'react-test-renderer';
import React from 'react';
import LineupStatsTable from '../LineupStatsTable';
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse"

describe("TeamStatsTable", () => {
  test("TeamStatsTable - should create snapshot", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.aggregations.lineups.buckets
    };
    const component = renderer.create(<LineupStatsTable lineupStats={testData} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
