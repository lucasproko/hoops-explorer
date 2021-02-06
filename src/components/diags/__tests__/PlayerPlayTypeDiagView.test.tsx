import renderer from 'react-test-renderer';
import React from 'react';
import PlayerPlayTypeDiagView from '../PlayerPlayTypeDiagView';
import { samplePlayerStatsResponse } from "../../../sample-data/samplePlayerStatsResponse";
import { GameFilterParams } from "../../../utils/FilterModels";
import { RosterTableUtils } from "../../../utils/tables/RosterTableUtils";
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("PlayerPlayTypeDiagView", () => {
  const testData = {
    on: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.on?.player?.buckets || [],
    off: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.off?.player?.buckets || [],
    baseline: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
    error_code: undefined
  };
  const teamSeasonLookup = "Men_Maryland_2018/9";
  const rosterStatsByCode = RosterTableUtils.buildRosterTableByCode(testData.on, true, teamSeasonLookup);
  test("PositionalDiagView - should create snapshot (!details, help)", () => {
    const wrapper = shallow(
      <PlayerPlayTypeDiagView
        player={{  ...(testData.on[0]), posClass: "WG"}}
        rosterStatsByCode={rosterStatsByCode}
        teamSeason={teamSeasonLookup} showHelp={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("PositionalDiagView - should create snapshot (details, !help)", () => {
    const wrapper = shallow(
      <PlayerPlayTypeDiagView
        player={{  ...(testData.on[0]), posClass: "WG"}}
        rosterStatsByCode={rosterStatsByCode}
        teamSeason={teamSeasonLookup} showHelp={false}
        showDetailsOverride={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
