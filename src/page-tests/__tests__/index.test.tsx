import React from 'react';
import OnOffAnalysisPage from '../../pages/index';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("OnOffAnalysisPage", () => {
  test("OnOffAnalysisPage - should create snapshot", () => {
    const wrapper = shallow(<OnOffAnalysisPage/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
