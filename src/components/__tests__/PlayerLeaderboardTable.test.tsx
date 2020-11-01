import renderer from 'react-test-renderer';
import React from 'react';

import { ParamPrefixes, PlayerLeaderboardParams, ParamDefaults } from '../../utils/FilterModels';
import PlayerLeaderboardTable, { PlayerLeaderboardStatsModel } from '../PlayerLeaderboardTable';
import { SampleDataUtils } from "../../sample-data/SampleDataUtils";

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import _ from "lodash";
import fs from 'fs';

describe("PlayerLeaderboardTable", () => {
  // Load in data sample:
  const sampleData = JSON.parse(
    fs.readFileSync("./public/leaderboards/lineups/players_all_Men_2019.json", { encoding: "UTF-8"})
  );
  sampleData.players = _.take(sampleData.players, 10); //(reduce the size a bit)

  // Tidy up snapshot rendering:
  expect.addSnapshotSerializer(SampleDataUtils.summarizeEnrichedApiResponse(
    sampleData.players[0]
  ));

  test("PlayerLeaderboardTable - should create snapshot", () => {
    const dummyChangeStateCallback = (stats: PlayerLeaderboardParams) => {};
    const wrapper = shallow(
      <PlayerLeaderboardTable
        startingState={{}}
        dataEvent={sampleData}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
