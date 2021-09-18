import React from 'react';
import _ from 'lodash';
import TeamRosterDiagView from '../TeamRosterDiagView';
import { SampleDataUtils } from "../../../sample-data/SampleDataUtils";
import { samplePlayerStatsResponse } from "../../../sample-data/samplePlayerStatsResponse";
import { sampleTeamStatsResponse } from "../../../sample-data/sampleTeamStatsResponse";
import { sampleLineupStatsResponse } from "../../../sample-data/sampleLineupStatsResponse";
import { LineupTableUtils } from "../../../utils/tables/LineupTableUtils";
import { RosterTableUtils } from "../../../utils/tables/RosterTableUtils";
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { IndivStatSet, LineupStatSet } from '../../../utils/StatModels';

describe("TeamRosterDiagView", () => {
  // Tidy up snapshot rendering:
  expect.addSnapshotSerializer(SampleDataUtils.summarizeEnrichedApiResponse(
    samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.on?.player?.buckets?.[0]
  ));
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
  const testLineupData = {
    lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
  }
  const teamSeasonLookup = "Men_Maryland_2018/9";
  const rosterStatsByCode = RosterTableUtils.buildRosterTableByCode(testData.on, undefined, true, teamSeasonLookup);
  const positionFromPlayerId = _.chain(testData.on).map(p => { //inject pos class into data
    const player = p.player_array?.hits?.hits?.[0]?._source?.player;
    const code = player?.code;
    const key = player?.id || "unknown";
    return [ key, {
      ...p,
      posClass: code ? rosterStatsByCode[code]?.posClass || "WG" : "WG"
    } ];
  }).fromPairs().value();
  const rosterStatsById = LineupTableUtils.buildBaselinePlayerInfo(
    testData.on as unknown as Array<IndivStatSet>, rosterStatsByCode, teamData.on, 100.0, true //(adjust for luck in this scenario, arbitrarily)
  );
  test("TeamRosterDiagView - baseline only", () => {
    const wrapper = shallow(
      <TeamRosterDiagView
        positionInfoBase={LineupTableUtils.getPositionalInfo(
          (testLineupData.lineups || []) as unknown as Array<LineupStatSet>, positionFromPlayerId, teamSeasonLookup
        )}
        positionInfoSample={undefined}
        rosterStatsByPlayerId={rosterStatsById}
        positionFromPlayerId={positionFromPlayerId}
        teamSeasonLookup={teamSeasonLookup}
        showHelp={true}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
