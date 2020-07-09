import React from 'react';
import LuckConfigModal from '../LuckConfigModal';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import { LuckParams } from '../../../utils/FilterModels';

describe("LuckConfigModal", () => {
  test("LuckConfigModal - should create snapshot", () => {
    //(annoyingly this needs to be shallow because Modal doesn't work with full rendering)
    const wrapper = shallow(
      <div>
        <LuckConfigModal
          show={true}
          onHide={() => {}}
          onSave={(l: LuckParams) => {}}
          luck={{base: "baseline"}}
        />
      </div>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
