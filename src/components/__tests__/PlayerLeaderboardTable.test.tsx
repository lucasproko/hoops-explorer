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
    fs.readFileSync("./public/leaderboards/lineups/players_all_Men_2019_High.json", { encoding: "UTF-8"})
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
        startingState={{ year: "2019/20" , useRapm: false}}
        dataEvent={sampleData}
        onChangeState={dummyChangeStateCallback}
        testMode={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("PlayerLeaderboardTable - should create snapshot (prod not /100)", () => {
    const dummyChangeStateCallback = (stats: PlayerLeaderboardParams) => {};
    const wrapper = shallow(
      <PlayerLeaderboardTable
        startingState={{ year: "2019/20" , factorMins: true, useRapm: false}}
        dataEvent={sampleData}
        onChangeState={dummyChangeStateCallback}
        testMode={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test("PlayerLeaderboardTable - should create snapshot (RAPM)", () => {
    const dummyChangeStateCallback = (stats: PlayerLeaderboardParams) => {};
    const wrapper = shallow(
      <PlayerLeaderboardTable
        startingState={{ year: "2019/20" }}
        dataEvent={sampleData}
        onChangeState={dummyChangeStateCallback}
        testMode={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("PlayerLeaderboardTable - should create snapshot (RAPM, prod not /100)", () => {
    const dummyChangeStateCallback = (stats: PlayerLeaderboardParams) => {};
    const wrapper = shallow(
      <PlayerLeaderboardTable
        startingState={{ year: "2019/20" , factorMins: true}}
        dataEvent={sampleData}
        onChangeState={dummyChangeStateCallback}
        testMode={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  const sampleDataMore = JSON.parse(
    fs.readFileSync("./public/leaderboards/lineups/players_all_Men_2018_High.json", { encoding: "UTF-8"})
  );
  const sampleDataExtra = JSON.parse(
    fs.readFileSync("./public/leaderboards/lineups/players_all_Men_Extr_High.json", { encoding: "UTF-8"})
  );
  sampleDataMore.players = _.take(sampleData.players, 5).concat(_.take(sampleDataMore.players, 5)).concat(_.take(sampleDataExtra.players, 5));

  test("PlayerLeaderboardTable - should create snapshot (multi year)", () => {
    const dummyChangeStateCallback = (stats: PlayerLeaderboardParams) => {};
    const wrapper = shallow(
      <PlayerLeaderboardTable
        startingState={{year: "All", useRapm: false}}
        dataEvent={sampleDataMore}
        onChangeState={dummyChangeStateCallback}
        testMode={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });


});
