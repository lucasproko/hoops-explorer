
// System imports
import { NextApiRequest, NextApiResponse } from 'next';

// Application imports
import { CommonApiUtils } from "../../utils/CommonApiUtils";
import { teamStatsQuery } from "../../utils/es-queries/teamStatsQueryTemplate";
import { rosterCompareQuery } from "../../utils/es-queries/rosterCompareQueryTemplate";
import { playerStatsQuery } from "../../utils/es-queries/playerStatsQueryTemplate";
import { ParamPrefixes } from '../../utils/FilterModels';

const queryPrefix = ParamPrefixes.game;

function marshallRequest(
  index: string, genderPrefix: string, params: Record<string, any>,
  currentJsonEpoch: number, efficiency: Record<string, any>, lookup: Record<string, any>,
  avgEfficiency: number
) {
  const body = [
    JSON.stringify({ index: index }),
    JSON.stringify(teamStatsQuery(params, currentJsonEpoch, efficiency, lookup, avgEfficiency)),
    JSON.stringify({ index: index }),
    JSON.stringify(rosterCompareQuery(params, currentJsonEpoch, efficiency, lookup)),
    JSON.stringify({ index: `player_events_${genderPrefix}${index}` }),
    JSON.stringify(playerStatsQuery(params, currentJsonEpoch, efficiency, lookup, avgEfficiency)),
  ].join('\n') + "\n";

  // Debug logs:
  //console.log(JSON.stringify(teamStatsQuery(params, currentJsonEpoch, efficiency, lookup, avgEfficiency), null, 3));
  //console.log(JSON.stringify(teamStatsQuery(params, currentJsonEpoch, {}, {}, avgEfficiency), null, 3));
  //console.log(JSON.stringify(playerStatsQuery(params, currentJsonEpoch, {}, {}, avgEfficiency).aggregations.tri_filter.aggregations, null, 3));
  //console.log(JSON.stringify(teamStatsQuery(params, currentJsonEpoch, {}, {}).query, null, 3));

  return body;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = require('url').parse(req.url);

  await CommonApiUtils.handleRequest(res, queryPrefix, url.query, marshallRequest);
}
