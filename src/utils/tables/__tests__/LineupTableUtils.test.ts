import { LineupTableUtils } from '../LineupTableUtils';
import _ from "lodash";

import { sampleLineupStatsResponse } from "../../../sample-data/sampleLineupStatsResponse";
import { samplePlayerStatsResponse } from "../../../sample-data/samplePlayerStatsResponse";
import { LineupStatSet, IndivStatSet } from '../../StatModels';

describe("LineupTableUtils", () => {

  test("getPositionalInfo", () => {
    // Setup test data:
    const teamSeasonLookup = "Men_Maryland_2018/9";

    const lineups =
      sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets as LineupStatSet[];

    const globalRosterStats =
      samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[];

    const positionFromPlayerKey = LineupTableUtils.buildPositionPlayerMap(globalRosterStats, teamSeasonLookup);

    const results = LineupTableUtils.getPositionalInfo(
      lineups, positionFromPlayerKey, teamSeasonLookup
    );
    //expect(results).toBe({});
    expect(results).toMatchSnapshot();

  });
});
