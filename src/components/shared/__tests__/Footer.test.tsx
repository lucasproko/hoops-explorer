import React from 'react';
import Footer from '../Footer';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';


describe("Footer", () => {
  test("Footer - should create snapshot", () => {
    const component = renderer.create(<Footer
      server="server"
      year="2019/20"
      gender="Men"
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
