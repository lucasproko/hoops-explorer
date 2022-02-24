import renderer from 'react-test-renderer';
import React from 'react';
import _ from 'lodash';
import TeamExtraStatsInfoView from '../TeamExtraStatsInfoView';
import { sampleTeamStatsResponse } from "../../../sample-data/sampleTeamStatsResponse"
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("TeamExtraStatsInfoView", () => {
  test("TeamExtraStatsInfoView - should create snapshot", () => {
    const teamData = _.assign(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
      { global: {}, onOffMode: true }
    );
      const wrapper = shallow(
      <TeamExtraStatsInfoView
        name="test"
        teamStatSet={teamData.baseline}
        showGrades=""
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
