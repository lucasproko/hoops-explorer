import renderer from 'react-test-renderer';
import React from 'react';
import _ from 'lodash';
import TeamPlayTypeDiagView from '../TeamPlayTypeDiagView';
import { samplePlayerStatsResponse } from "../../../sample-data/samplePlayerStatsResponse";
import { sampleTeamStatsResponse } from "../../../sample-data/sampleTeamStatsResponse"
import { GameFilterParams } from "../../../utils/FilterModels";
import { RosterTableUtils } from "../../../utils/tables/RosterTableUtils";
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("TeamPlayTypeDiagView", () => {
  const testData = {
    on: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.on?.player?.buckets || [],
    off: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.off?.player?.buckets || [],
    baseline: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
    error_code: undefined
  };
  const teamData = _.assign(
    sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
    { global: {}, onOffMode: true }
  );
  const teamSeasonLookup = "Men_Maryland_2018/9";
  const rosterStatsByCode = RosterTableUtils.buildRosterTableByCode(testData.on, true, teamSeasonLookup);
  const players = testData.on.map(p => { //inject pos class into data
    const code = p.player_array?.hits?.hits?.[0]?._source?.player?.code;
    return {
      ...p,
      posClass: code ? rosterStatsByCode[code]?.posClass || "WG" : "WG"
    }
  });
  test("TeamPlayTypeDiagView - should create snapshot (!details, help)", () => {
    const wrapper = shallow(
      <TeamPlayTypeDiagView
        players={players}
        rosterStatsByCode={rosterStatsByCode}
        teamStats={teamData}
        teamSeasonLookup={teamSeasonLookup} showHelp={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamPlayTypeDiagView - should create snapshot (!help)", () => {
    const wrapper = shallow(
      <TeamPlayTypeDiagView
        players={players}
        rosterStatsByCode={rosterStatsByCode}
        teamStats={teamData}
        teamSeasonLookup={teamSeasonLookup} showHelp={false}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
