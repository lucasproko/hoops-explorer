import React from 'react';
import ToggleButtonGroup from '../ToggleButtonGroup';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';


describe("ToggleButtonGroup", () => {
  test("ToggleButtonGroup", () => {
    const component = renderer.create(
      <ToggleButtonGroup override={true} items={[
        {
          label: "Test A",
          tooltip: "Test Tooltip A",
          toggled: true,
          onClick: () => {}
        },
        {
          label: "Test B",
          tooltip: "Test Tooltip A",
          toggled: false,
          onClick: () => {}
        }
      ]}/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("ToggleButtonGroup - empty SSR render", () => {
    const component = renderer.create(
      <ToggleButtonGroup override={false} items={[
        {
          label: "Test A",
          tooltip: "Test Tooltip A",
          toggled: true,
          onClick: () => {}
        },
        {
          label: "Test B",
          tooltip: "Test Tooltip A",
          toggled: false,
          onClick: () => {}
        }
      ]}/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
