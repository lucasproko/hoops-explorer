import React from 'react';
import TeamRosterStatsConfigModal from '../TeamRosterStatsConfigModal';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';

describe("TeamRosterStatsConfigModal", () => {
  test("TeamRosterStatsConfigModal - should create snapshot (config set 1)", () => {
    //(annoyingly this needs to be shallow because Modal doesn't work with full rendering)
    const wrapper = shallow(
      <div>
        <TeamRosterStatsConfigModal
          show={true}
          onHide={() => {}}
          onSave={(l: any) => {}}
          config={{rapmPriorMode: -1, regressDiffs: -2000, showRapmDiag: false, rapmRegressMode: -1}}
          showHelp={true}
        />
      </div>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamRosterStatsConfigModal - should create snapshot (config set 2)", () => {
    //(annoyingly this needs to be shallow because Modal doesn't work with full rendering)
    const wrapper = shallow(
      <div>
        <TeamRosterStatsConfigModal
          show={true}
          onHide={() => {}}
          onSave={(l: any) => {}}
          config={{rapmPriorMode: 0, regressDiffs: 0, showRapmDiag: true, rapmRegressMode: -1}}
          showHelp={false}
        />
      </div>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamRosterStatsConfigModal - should create snapshot (config set 3)", () => {
    //(annoyingly this needs to be shallow because Modal doesn't work with full rendering)
    const wrapper = shallow(
      <div>
        <TeamRosterStatsConfigModal
          show={true}
          onHide={() => {}}
          onSave={(l: any) => {}}
          config={{rapmPriorMode: 0.5, regressDiffs: 2000, showRapmDiag: true, rapmRegressMode: -1}}
          showHelp={true}
        />
      </div>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
