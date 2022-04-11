import React from 'react';
import PlayerLeaderboardPage from '../../pages/PlayerLeaderboard';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("PlayerLeaderboardPage", () => {
  test("PlayerLeaderboardPage - should create snapshot", () => {
    //TODO: this isn't the best test because it will just step over the async fetch
    //and render a trivial page, still will do for now

    const wrapper = shallow(<PlayerLeaderboardPage testMode={true}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
