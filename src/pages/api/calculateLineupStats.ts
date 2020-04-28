// System imports
import { NextApiRequest, NextApiResponse } from 'next';

// Application imports
import { CommonApiUtils } from "../../utils/CommonApiUtils";
import { lineupStatsQuery } from "../../utils/es-queries/lineupStatsQueryTemplate";
import { ParamPrefixes } from '../../utils/FilterModels';

const queryPrefix = ParamPrefixes.lineup;

function marshallRequest(
  index: string, genderPrefix: string, params: Record<string, any>,
  currentJsonEpoch: number, efficiency: Record<string, any>, lookup: Record<string, any>,
  avgEfficiency: number
) {
  const body = [
    JSON.stringify({ index: index }),
    JSON.stringify(lineupStatsQuery(params, currentJsonEpoch, efficiency, lookup, avgEfficiency))
  ].join('\n') + "\n";

  return body;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = require('url').parse(req.url);
  await CommonApiUtils.handleRequest(res, queryPrefix, url.query, marshallRequest);
}
