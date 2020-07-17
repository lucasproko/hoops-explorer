import renderer from 'react-test-renderer';
import React from 'react';
import LuckAdjDiagView from '../LuckAdjDiagView';
import { sampleOffOnOffLuckDiagnostics, sampleDefOnOffLuckDiagnostics } from "../../../sample-data/sampleOnOffLuckDiagnostics";
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("LuckAdjDiagView", () => {
  test("LuckAdjDiagView - should create snapshot (season, !override)", () => {

    const wrapper = shallow(
      <LuckAdjDiagView
        name="Test1"
        offLuck={sampleOffOnOffLuckDiagnostics}
        defLuck={sampleDefOnOffLuckDiagnostics}
        baseline="season"
        showHelp={false}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("LuckAdjDiagView - should create snapshot (baseline, override)", () => {

    const wrapper = shallow(
      <LuckAdjDiagView
        name="Test2"
        offLuck={sampleOffOnOffLuckDiagnostics}
        defLuck={sampleDefOnOffLuckDiagnostics}
        baseline="baseline"
        showHelp={true}
        showDetailsOverride={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
