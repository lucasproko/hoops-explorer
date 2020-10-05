import renderer from 'react-test-renderer';
import React from 'react';

import { ParamPrefixes, LineupLeaderboardParams, ParamDefaults } from '../../utils/FilterModels';
import LineupLeaderboardTable, { LineupLeaderboardStatsModel } from '../LineupLeaderboardTable';
import { SampleDataUtils } from "../../sample-data/SampleDataUtils";

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import _ from "lodash";
import fs from 'fs';

describe("LineupLeaderboardTable", () => {
  // Load in data sample:
  const sampleData = JSON.parse(
    fs.readFileSync("./public/leaderboards/lineups/lineups_all_Men_2019.json", { encoding: "UTF-8"})
  );
  sampleData.lineups = _.take(sampleData.lineups, 10); //(reduce the size a bit)

  // Tidy up snapshot rendering:
  expect.addSnapshotSerializer(SampleDataUtils.summarizeEnrichedApiResponse(
    sampleData.lineups[0]
  ));

  test("LineupLeaderboardTable - should create snapshot (luck diags disabled)", () => {
    const dummyChangeStateCallback = (stats: LineupLeaderboardParams) => {};
    const wrapper = shallow(
      <LineupLeaderboardTable
        startingState={{}}
        dataEvent={sampleData}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("LineupLeaderboardTable - should create snapshot (luck diags enabled)", () => {
    const dummyChangeStateCallback = (stats: LineupLeaderboardParams) => {};
    const wrapper = shallow(
      <LineupLeaderboardTable
        startingState={{ showLineupLuckDiags: true }}
        dataEvent={sampleData}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
