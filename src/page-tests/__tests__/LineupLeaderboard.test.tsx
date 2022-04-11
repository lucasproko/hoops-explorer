import React from 'react';
import LineupLeaderboardPage from '../../pages/LineupLeaderboard';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("LineupLeaderboardPage", () => {
  test("LineupLeaderboardPage - should create snapshot", () => {
    //TODO: this isn't the best test because it will just step over the async fetch
    //and render a trivial page, still will do for now
    
    const wrapper = shallow(<LineupLeaderboardPage testMode={true}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
