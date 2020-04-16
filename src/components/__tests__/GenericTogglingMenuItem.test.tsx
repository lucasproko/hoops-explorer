import renderer from 'react-test-renderer';
import React from 'react';
import GenericTogglingMenuItem from '../GenericTogglingMenuItem';
import Dropdown from 'react-bootstrap/Dropdown';

describe("GenericTogglingMenuItem", () => {
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
