// System imports
import { NextApiRequest, NextApiResponse } from "next";

// Application imports
import { CommonApiUtils } from "../../utils/CommonApiUtils";
import { teamDefenseStatsQuery } from "../../utils/es-queries/teamDefenseStatsQueryTemplate";
import { teamDefensePlayerStatsQuery } from "../../utils/es-queries/teamDefensePlayerStatsQueryTemplate";
import {
  ParamPrefixes,
  CommonFilterParams,
  ParamDefaults,
} from "../../utils/FilterModels";

const queryPrefix = ParamPrefixes.game;

function marshallRequest(
  index: string,
  genderPrefix: string,
  params: Record<string, any>,
  currentJsonEpoch: number,
  efficiency: Record<string, any>,
  lookup: Record<string, any>,
  avgEfficiency: number
) {
  const yearStr = (params.year || ParamDefaults.defaultYear).substring(0, 4);
  const isGenderWomen = (params.gender || "Men") == "Women";

  const body =
    [
      JSON.stringify({
        index: isGenderWomen
          ? `women_*${yearStr}*,-player_*,-bad*,-kenpom*`
          : `*${yearStr}*,-women*,-player_*,-bad*,-kenpom*`,
      }),
      JSON.stringify(
        teamDefenseStatsQuery(
          params,
          currentJsonEpoch,
          efficiency,
          lookup,
          avgEfficiency,
          CommonApiUtils.getHca(params as CommonFilterParams)
        ),
        CommonApiUtils.efficiencyReplacer()
      ),
      JSON.stringify({
        index: isGenderWomen
          ? `player_events_women_*${yearStr}*,-bad*,-kenpom*`
          : `player_events*${yearStr}*,-player_events_women*,-bad*,-kenpom*`,
      }),
      JSON.stringify(
        teamDefensePlayerStatsQuery(
          params,
          currentJsonEpoch,
          efficiency,
          lookup,
          avgEfficiency,
          CommonApiUtils.getHca(params as CommonFilterParams)
        ),
        CommonApiUtils.efficiencyReplacer()
      ),
    ].join("\n") + "\n";

  // Debug logs:
  // console.log(
  //   JSON.stringify(
  //     teamDefenseStatsQuery(
  //       params,
  //       currentJsonEpoch,
  //       efficiency,
  //       lookup,
  //       avgEfficiency,
  //       CommonApiUtils.getHca(params as CommonFilterParams)
  //     ),
  //     CommonApiUtils.efficiencyReplacer(),
  //     3
  //   )
  // );
  // console.log(
  //   JSON.stringify(
  //     teamDefensePlayerStatsQuery(
  //       params,
  //       currentJsonEpoch,
  //       efficiency,
  //       lookup,
  //       avgEfficiency,
  //       CommonApiUtils.getHca(params as CommonFilterParams)
  //     ),
  //     CommonApiUtils.efficiencyReplacer(),
  //     3
  //   )
  // );

  return body;
}

async function calculateTeamDefenseStats(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = require("url").parse(req.url);

  await CommonApiUtils.handleRequest(
    res,
    queryPrefix,
    url.query,
    marshallRequest
  );
}
export default calculateTeamDefenseStats;
