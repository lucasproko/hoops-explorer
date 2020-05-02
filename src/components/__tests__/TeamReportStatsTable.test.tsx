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
        testMode = {true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamReportStatsTable - should create snapshot (all viewing modes on)", () => {

    //TODO: RAPM, but need some better sample data

    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        lineupReport={testData}
        startingState={{incRepOnOff: true}}
        onChangeState={dummyChangeStateCallback}
        testMode = {true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  // TODO: RAPM diagnostics mode, but need some better sample data

  test("TeamReportStatsTable - should create snapshot (rep on-off diagnostic mode)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        lineupReport={testData}
        startingState={{incRepOnOff: true, repOnOffDiagMode: "20"}}
        onChangeState={dummyChangeStateCallback}
        testMode = {true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamReportStatsTable - should create snapshot (rep on-off diagnostic mode, expanded)", () => {
    const testData = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    };
    const dummyChangeStateCallback = (stats: TeamReportFilterParams) => {};
    const wrapper = shallow(
      <TeamReportStatsTable
        lineupReport={testData}
        startingState={{incRepOnOff: true, repOnOffDiagMode: "20", filter: "AaWiggins"}}
        onChangeState={dummyChangeStateCallback}
        testMode = {true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
