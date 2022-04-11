import React from 'react';
import TeamEditor from '../../pages/TeamEditor';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("TeamEditorPage", () => {
  test("TeamEditorPage - should create snapshot", () => {
    const wrapper = shallow(<TeamEditor testMode={true}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
