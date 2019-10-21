import React from 'react';
import GameFilter from '../GameFilter';
import { TeamStatsModel } from '../TeamStatsTable';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("GameFilter", () => {
  test("GameFilter - should create snapshot", () => {
    const dummyCallback = (stats: TeamStatsModel) => {};
    const wrapper = shallow(<GameFilter onTeamStats={dummyCallback} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
//TODO: add mock for fetch and test submit
//TODO: check text
