import React from 'react';
import OnBallDefenseModal from '../OnBallDefenseModal';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import { ParamPrefixes, ManualOverride } from '../../../utils/FilterModels';
import { GenericTableOps } from '../../GenericTable';
import { OnBallDefenseModel } from "../../../utils/stats/RatingUtils";

describe("OnBallDefenseModal", () => {
  test("OnBallDefenseModal - should create snapshot (not initialized at all)", () => {
    //(annoyingly this needs to be shallow because Modal doesn't work with full rendering - which makes it 99% useless)
    const wrapper = shallow(
      <div>
        <OnBallDefenseModal
          players={[]}
          onBallDefense={[]}
          show={true}
          onHide={() => false}
          onSave={(onBallDefense: OnBallDefenseModel[]) => false}
          showHelp={false}
        />
      </div>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
