import React from 'react';
import OnOffAnalysisPage from '../index';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("GameFilter", () => {
  test("OnOffAnalysisPage - should create snapshot", () => {
    const wrapper = shallow(<OnOffAnalysisPage/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
//TODO: add mock for fetch and test submit etc
//TODO: check text
