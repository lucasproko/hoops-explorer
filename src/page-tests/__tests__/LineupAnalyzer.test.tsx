import React from 'react';
import LineupAnalyzerPage from '../../pages/LineupAnalyzer';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("LineupAnalyzerPage", () => {
  test("LineupAnalyzerPage - should create snapshot", () => {
    const wrapper = shallow(<LineupAnalyzerPage/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
