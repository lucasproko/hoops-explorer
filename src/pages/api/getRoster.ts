// System imports
import { NextApiRequest, NextApiResponse } from 'next';

// Application imports
import { CommonApiUtils } from "../../utils/CommonApiUtils";
import { rosterCompareQuery } from "../../utils/es-queries/rosterCompareQueryTemplate";
import { ParamPrefixes } from '../../utils/FilterModels';

const queryPrefix = ParamPrefixes.roster;

function marshallRequest(
  index: string, genderPrefix: string, params: Record<string, any>,
  currentJsonEpoch: number, efficiency: Record<string, any>, lookup: Record<string, any>,
  avgEfficiency: number
) {
  const body = [
    JSON.stringify({ index: index }),
    JSON.stringify(rosterCompareQuery(params, currentJsonEpoch, {}, {}))
      //(leaving efficiency blank means that the opponent filter is ignored)
  ].join('\n') + "\n";

  return body;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = require('url').parse(req.url);
  await CommonApiUtils.handleRequest(res, queryPrefix, url.query, marshallRequest);
}
