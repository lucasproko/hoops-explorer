import React from 'react';
import GameFilter, { GameFilterParams } from '../GameFilter';
import { TeamStatsModel } from '../TeamStatsTable';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("GameFilter", () => {
  test("GameFilter - should create snapshot", () => {
    const dummySubmitCallback = (stats: TeamStatsModel) => {};
    const dummyChangeStateCallback = (stats: GameFilterParams) => {};
    const wrapper = shallow(<GameFilter
      onTeamStats={dummySubmitCallback}
      startingState={}
      onChangeState={dummyChangeStateCallback}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
//TODO: add mock for fetch and test submit etc
//TODO: check text
