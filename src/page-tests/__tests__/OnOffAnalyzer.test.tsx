import React from 'react';
import OnOffAnalyzerPage from '../../pages/OnOffAnalyzer';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("OnOffAnalyzerPage", () => {
  test("OnOffAnalyzerPage - should create snapshot", () => {
    const wrapper = shallow(<OnOffAnalyzerPage/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
