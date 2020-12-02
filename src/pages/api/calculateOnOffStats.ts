
// System imports
import { NextApiRequest, NextApiResponse } from 'next';

// Application imports
import { CommonApiUtils } from "../../utils/CommonApiUtils";
import { teamStatsQuery } from "../../utils/es-queries/teamStatsQueryTemplate";
import { rosterCompareQuery } from "../../utils/es-queries/rosterCompareQueryTemplate";
import { playerStatsQuery } from "../../utils/es-queries/playerStatsQueryTemplate";
import { ParamPrefixes, CommonFilterParams } from '../../utils/FilterModels';

const queryPrefix = ParamPrefixes.game;

function marshallRequest(
  index: string, genderPrefix: string, params: Record<string, any>,
  currentJsonEpoch: number, efficiency: Record<string, any>, lookup: Record<string, any>,
  avgEfficiency: number
) {
  const body = [
    JSON.stringify({ index: index }),
    JSON.stringify(
      teamStatsQuery(params, currentJsonEpoch, efficiency, lookup, avgEfficiency,
        CommonApiUtils.getHca(params as CommonFilterParams)
      ),
      CommonApiUtils.efficiencyReplacer()
    )
  ].join('\n') + "\n";

  // Debug logs:
  //console.log(JSON.stringify(teamStatsQuery(params, currentJsonEpoch, efficiency, lookup, avgEfficiency), CommonApiUtils.efficiencyReplacer(), 3));
  //console.log(JSON.stringify(teamStatsQuery(params, currentJsonEpoch, {}, {}, avgEfficiency), CommonApiUtils.efficiencyReplacer(), 3));
  //console.log(JSON.stringify(teamStatsQuery(params, currentJsonEpoch, {}, {}).query, CommonApiUtils.efficiencyReplacer(), 3));

  return body;
}

async function calculateOnOffStats(req: NextApiRequest, res: NextApiResponse) {
  const url = require('url').parse(req.url);

  await CommonApiUtils.handleRequest(res, queryPrefix, url.query, marshallRequest);
}
export default calculateOnOffStats;
