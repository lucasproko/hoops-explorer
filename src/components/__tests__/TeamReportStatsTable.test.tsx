import renderer from 'react-test-renderer';
import React from 'react';
import TeamReportStatsTable, { TeamReportStatsModel } from '../TeamReportStatsTable';
import { LineupStatsModel } from '../LineupStatsTable';
import { TeamReportFilterParams } from "../utils/FilterModels";
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse"
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("TeamReportStatsTable", () => {
  test("TeamReportStatsTable - should create snapshot", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        lineupReport={testData}
        startingState={{}}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
