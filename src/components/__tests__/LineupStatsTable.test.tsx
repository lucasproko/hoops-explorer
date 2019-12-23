import renderer from 'react-test-renderer';
import React from 'react';
import LineupStatsTable from '../LineupStatsTable';
import { LineupFilterParams } from "../utils/FilterModels";
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse"
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("LineupStatsTable", () => {
  test("LineupStatsTable - should create snapshot", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.aggregations.lineups.buckets
    };
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(
      <LineupStatsTable
        lineupStats={testData}
        startingState={{}}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
