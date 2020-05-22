import renderer from 'react-test-renderer';
import React from 'react';
import _ from 'lodash';
import RosterCompareTable from '../RosterCompareTable';
import { sampleRosterCompareResponse } from "../../sample-data/sampleRosterCompareResponse"

describe("RosterCompareTable", () => {
  test("RosterCompareTable - should create snapshot", () => {
    const gameFilterTestData = {};
    const testData = _.merge(sampleRosterCompareResponse.aggregations.tri_filter.buckets, { onOffMode: true });
    const component = renderer.create(<RosterCompareTable gameFilterParams={gameFilterTestData} rosterCompareStats={testData} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
