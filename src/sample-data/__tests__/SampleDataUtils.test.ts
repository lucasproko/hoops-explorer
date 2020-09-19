// Lodash
import _ from "lodash";

import { SampleDataUtils } from "../SampleDataUtils";
import { sampleLineupStatsResponse } from "../sampleLineupStatsResponse";
import { samplePlayerStatsResponse } from "../samplePlayerStatsResponse";
import { sampleTeamStatsResponse } from "../sampleTeamStatsResponse";

describe("SampleDataUtils", () => {

  test("buildTemplateFromResponse", () => {
    const lineupTemplate = SampleDataUtils.buildTemplateFromResponseLineup(
      sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    );
    if (false) console.log(JSON.stringify(
      lineupTemplate, null, 3
    ));
    expect(SampleDataUtils.buildResponseFromTemplateLineup(lineupTemplate)).toEqual(
      sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets
    );

    const playerTemplate = SampleDataUtils.buildTemplateFromResponsePlayer(
      samplePlayerStatsResponse.responses[0].aggregations.tri_filter.buckets
    );
    if (false) console.log(JSON.stringify(
      playerTemplate, null, 3
    ));
    expect(SampleDataUtils.buildResponseFromTemplatePlayer(playerTemplate)).toEqual(
      samplePlayerStatsResponse.responses[0].aggregations.tri_filter.buckets
    );

    const teamTemplate = SampleDataUtils.buildTemplateFromResponseTeam(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets
    );
    if (false) console.log(JSON.stringify(
      teamTemplate, null, 3
    ));
    expect(SampleDataUtils.buildResponseFromTemplateTeam(teamTemplate)).toEqual(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets
    );

  });

});
