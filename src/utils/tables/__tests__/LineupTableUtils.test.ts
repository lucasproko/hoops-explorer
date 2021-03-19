import { LineupTableUtils } from '../LineupTableUtils';
import _ from "lodash";

import { SampleDataUtils } from "../../../sample-data/SampleDataUtils";
import { sampleLineupStatsResponse } from "../../../sample-data/sampleLineupStatsResponse";
import { samplePlayerStatsResponse } from "../../../sample-data/samplePlayerStatsResponse";
import { sampleTeamStatsResponse } from "../../../sample-data/sampleTeamStatsResponse";

describe("LineupTableUtils", () => {

  test("getPositionalInfo", () => {
    // Setup test data:
    const teamSeasonLookup = "Men_Maryland_2018/9";

    const lineups =
      sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets || [];

    const globalRosterStats =
      samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [];

    const positionFromPlayerKey = LineupTableUtils.buildPositionPlayerMap(globalRosterStats, teamSeasonLookup);

    const results = LineupTableUtils.getPositionalInfo(
      lineups, positionFromPlayerKey, teamSeasonLookup
    );
    //expect(results).toBe({});
    expect(results).toMatchSnapshot();

  });
});
