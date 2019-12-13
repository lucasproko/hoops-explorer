import React from 'react';
import LineupFilter, { LineupFilterParams } from '../LineupFilter';
import { LineupStatsModel } from '../LineupStatsTable';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("LineupFilter", () => {
  test("LineupFilter - should create snapshot", () => {
    const dummySubmitCallback = (stats: LineupStatsModel) => {};
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const wrapper = shallow(<LineupFilter
      onStats={dummySubmitCallback}
      startingState={{}}
      onChangeState={dummyChangeStateCallback}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
//TODO: add mock for fetch and test submit etc
//TODO: check text
