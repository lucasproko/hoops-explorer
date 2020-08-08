import React from 'react';
import ManualOverrideModal from '../ManualOverrideModal';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import { ParamPrefixes, ManualOverride } from '../../../utils/FilterModels';
import { GenericTableOps } from '../../GenericTable';

describe("ManualOverride", () => {
  test("ManualOverride - should create snapshot (not initialized at all)", () => {
    //(annoyingly this needs to be shallow because Modal doesn't work with full rendering)
    const wrapper = shallow(
      <div>
        <ManualOverrideModal
          tableType={ParamPrefixes.player}
          inStats={[

          ]}
          statsAsTable={{

          }}
          overrides={[]}
          show={true}
          onHide={() => false}
          onSave={(overrides: ManualOverride[]) => false}
          showHelp={false}
        />
      </div>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("ManualOverride - should create snapshot (players and overrides, nothing selected)", () => {
    //(annoyingly this needs to be shallow because Modal doesn't work with full rendering)
    const wrapper = shallow(
      <div>
        <ManualOverrideModal
          tableType={ParamPrefixes.player}
          inStats={[
            { onOffKey: "Baseline", key: "Player1", off_3p: { value: 0.3 } },
            { onOffKey: "On", key: "Player2", off_3p: { value: 0.4 } }
          ]}
          statsAsTable={{
            "Player1 / Baseline": [
              GenericTableOps.buildTextRow(<p>Test</p>)
            ]
          }}
          overrides={[
            { rowId: "Player1 / Baseline", newVal: 0.5, statName: "off_3p", use: true }
          ]}
          show={true}
          onHide={() => false}
          onSave={(overrides: ManualOverride[]) => false}
          showHelp={true}
        />
      </div>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("ManualOverride - should create snapshot (players and overrides, something selected)", () => {
    //(annoyingly this needs to be shallow because Modal doesn't work with full rendering)
    const wrapper = shallow(
      <div>
        <ManualOverrideModal
          tableType={ParamPrefixes.player}
          inStats={[
            { onOffKey: "Baseline", key: "Player1", off_3p: { value: 0.3 } },
            { onOffKey: "On", key: "Player2", off_3p: { value: 0.4 } },
            { onOffKey: "Off", key: "Player3", off_3p: { value: 0.4 } }
          ]}
          statsAsTable={{
            "Player1 / Baseline": [
              GenericTableOps.buildTextRow(<p>Test1</p>)
            ],
            "Player3 / Off": [
              GenericTableOps.buildTextRow(<p>Test3</p>)
            ]
          }}
          overrides={[
            { rowId: "Player1 / Baseline", newVal: 0.5, statName: "off_3p", use: true  },
            { rowId: "Player3 / Off", newVal: 0.5, statName: "off_3p", use: true  }
          ]}
          show={true}
          onHide={() => false}
          onSave={(overrides: ManualOverride[]) => false}
          showHelp={true}
          startOverride={
            { rowId: "Player1 / Baseline", newVal: 0.5, statName: "off_3p", use: true  }
          }
        />
      </div>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
