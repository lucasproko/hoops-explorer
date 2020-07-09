import renderer from 'react-test-renderer';
import React from 'react';
import GenericTogglingMenu from '../GenericTogglingMenu';
import GenericTogglingMenuItem from '../GenericTogglingMenuItem';
import Dropdown from 'react-bootstrap/Dropdown';

describe("GenericTogglingMenu", () => {
  test("GenericTogglingMenu - should create snapshot", () => {
    const testData = null;
    const component = renderer.create(
      <GenericTogglingMenu>
        <GenericTogglingMenuItem
          text="Test1"
          truthVal={false}
          onSelect={() => ""}
        />
      </GenericTogglingMenu>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("GenericTogglingMenuItem - should create snapshot", () => {
    const testData = null;
    const component = renderer.create(
      <span>
        <GenericTogglingMenuItem
          text="Test1"
          truthVal={false}
          onSelect={() => ""}
        />
        <GenericTogglingMenuItem
          text="Test2"
          truthVal={true}
          onSelect={() => ""}
        />
        <GenericTogglingMenuItem
          text={<span>Test3</span>}
          truthVal={false}
          onSelect={() => ""}
        />
        <GenericTogglingMenuItem
          text={<span>Test4</span>}
          truthVal={true}
          onSelect={() => ""}
        />
      </span>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
