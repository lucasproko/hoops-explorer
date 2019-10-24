import React from 'react';
import GameFilter, { GameFilterParams } from '../GameFilter';
import { TeamStatsModel } from '../TeamStatsTable';
import { RosterCompareModel } from '../RosterCompareTable';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("GameFilter", () => {
  test("GameFilter - should create snapshot", () => {
    const dummySubmitCallback = (teamStats: TeamStatsModel, rosterCompareStats: RosterCompareModel) => {};
    const dummyChangeStateCallback = (stats: GameFilterParams) => {};
    const wrapper = shallow(<GameFilter
      onStats={dummySubmitCallback}
      startingState={{}}
      onChangeState={dummyChangeStateCallback}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
//TODO: add mock for fetch and test submit etc
//TODO: check text
