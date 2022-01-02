/**
 * @jest-environment jsdom
 */

import React from 'react';
import HeaderBar from '../HeaderBar';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import { ParamPrefixes} from "../../../utils/FilterModels";


describe("HeaderBar", () => {
  test("HeaderBar - should create snapshot (game)", () => {
    const component = renderer.create(<HeaderBar
      thisPage={ParamPrefixes.game}
      common={{team:"Test1", gender:"Men", year:"2019/20", baseQuery:"query1"}}
      override={true}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("HeaderBar - should create snapshot (lineup)", () => {
    const component = renderer.create(<HeaderBar
      thisPage={ParamPrefixes.lineup}
      common={{team:"Test2", gender:"Men", year:"2019/20", baseQuery:"query2"}}
      override={true}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("HeaderBar - should create snapshot (report)", () => {
    const component = renderer.create(<HeaderBar
      thisPage={ParamPrefixes.report}
      common={{team:"Test3", gender:"Men", year:"2019/20", baseQuery:"query3"}}
      override={true}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
