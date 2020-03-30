import renderer from 'react-test-renderer';
import React from 'react';
import RosterStatsDiagView from '../RosterStatsDiagView';
import { sampleOrtgDiagnostics } from "../../sample-data/sampleOrtgDiagnostics";

describe("RosterStatsDiagView", () => {
  test("RosterStatsDiagView - should create snapshot", () => {
    const testData = null;
    const component = renderer.create(<RosterStatsDiagView ortgDiags={sampleOrtgDiagnostics} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
