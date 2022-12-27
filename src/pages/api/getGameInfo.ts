// System imports
import { NextApiRequest, NextApiResponse } from 'next';

// Application imports
import { CommonApiUtils } from "../../utils/CommonApiUtils";
import { gameInfoQuery } from "../../utils/es-queries/gameInfoQueryTemplate";
import { ParamPrefixes } from '../../utils/FilterModels';

const queryPrefix = ParamPrefixes.roster;

function marshallRequest(
  index: string, genderPrefix: string, params: Record<string, any>,
  currentJsonEpoch: number, efficiency: Record<string, any>, lookup: Record<string, any>,
  avgEfficiency: number
) {
  //(make the query a bit more efficient by not including the efficieny/lookup JSON objects unless we need them)
  const needEff = (Number(params.minRank || "0") > 0) || (Number(params.maxRank || "400") < 400)
                  || ((params.queryFilters || "").indexOf("Conf") >= 0)
                  || params.baseQuery || params.onQuery || params.offQuery //(need these in case we're using eg vs_rank)
                  ;

  const body = [
    JSON.stringify({ index: index }),
    JSON.stringify(
      gameInfoQuery(
        params, currentJsonEpoch,
      )
    )
      //(leaving efficiency blank means that the opponent filter is ignored)
  ].join('\n') + "\n";

  return body;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = require('url').parse(req.url);
  await CommonApiUtils.handleRequest(res, queryPrefix, url.query, marshallRequest);
}
