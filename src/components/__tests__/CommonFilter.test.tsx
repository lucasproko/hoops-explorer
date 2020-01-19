import React from 'react';
import CommonFilter, { CommonFilterParams } from '../CommonFilter';
import { LineupFilterParams } from "../utils/FilterModels";
import { LineupStatsModel } from '../LineupStatsTable';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import fetch from 'isomorphic-unfetch';

describe("CommonFilter", () => {
  test("CommonFilter - should create snapshot (empty)", () => {
    const dummySubmitCallback = (stats: LineupStatsModel) => {};
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const dummyChangeCommonStateCallback = (stats: CommonFilterParams) => {};
    const dummyHandleResponse = (a: any, b: Boolean) => {};
    const dummySubmitRequest = (a: string, b: (r: fetch.IsomorphicResponse) => void) => {};
    const wrapper = shallow(<CommonFilter
      startingState={{}}
      onChangeState={dummyChangeStateCallback}
      onChangeCommonState={dummyChangeCommonStateCallback}
      tablePrefix = {"test-"}
      buildParamsFromState={() => {}}
      childHandleResponse={dummyHandleResponse}
      childSubmitRequest={dummySubmitRequest}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("CommonFilter - should create snapshot (preloaded)", () => {
    const dummySubmitCallback = (stats: LineupStatsModel) => {};
    const dummyChangeStateCallback = (stats: LineupFilterParams) => {};
    const dummyChangeCommonStateCallback = (stats: CommonFilterParams) => {};
    const dummyHandleResponse = (a: any, b: Boolean) => {};
    const dummySubmitRequest = (a: string, b: (r: fetch.IsomorphicResponse) => void) => {};
    const wrapper = shallow(<CommonFilter
      startingState={{ team: "Maryland", gender: "Men", year: "2018/9" }}
      onChangeState={dummyChangeStateCallback}
      onChangeCommonState={dummyChangeCommonStateCallback}
      tablePrefix = {"test-"}
      buildParamsFromState={() => {}}
      childHandleResponse={dummyHandleResponse}
      childSubmitRequest={dummySubmitRequest}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
//TODO: add mock for fetch and test submit etc
//TODO: check text
