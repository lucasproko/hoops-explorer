import React from 'react';
import HistorySelector from '../HistorySelector';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("HistorySelector", () => {
  test("HistorySelector - should create snapshot", () => {
    const wrapper = shallow(<HistorySelector
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
