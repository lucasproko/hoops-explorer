import React from 'react';
import ChartsPage from '../../pages/Charts';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("ChartsPage", () => {
  test("ChartsPage - should create snapshot", () => {
    const wrapper = shallow(<ChartsPage/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
