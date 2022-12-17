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
    fs.readFileSync("./public/leaderboards/lineups/lineups_all_Men_2019_High.json", { encoding: "utf-8"})
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
        startingState={{ year: "2019/20" }}
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
        startingState={{  year: "2019/20" , showLineupLuckDiags: true }}
        dataEvent={sampleData}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });


  const sampleDataMore = JSON.parse(
    fs.readFileSync("./public/leaderboards/lineups/lineups_all_Men_2018_High.json", { encoding: "utf-8"})
  );
  const sampleDataExtra = JSON.parse(
    fs.readFileSync("./public/leaderboards/lineups/lineups_all_Men_Extr_High.json", { encoding: "utf-8"})
  );
  sampleDataMore.lineups = _.take(sampleData.lineups, 5).concat(_.take(sampleDataMore.lineups, 5)).concat(_.take(sampleDataExtra.lineups, 5));

  test("LineupLeaderboardTable - should create snapshot (luck diags disabled, multi year)", () => {
    const dummyChangeStateCallback = (stats: LineupLeaderboardParams) => {};
    const wrapper = shallow(
      <LineupLeaderboardTable
        startingState={{year: "All"}}
        dataEvent={sampleDataMore}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
