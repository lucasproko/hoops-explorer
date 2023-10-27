// System imports
import { NextApiRequest, NextApiResponse } from "next";

// Application imports
import { CommonApiUtils } from "../../utils/CommonApiUtils";
import { lineupStintsQuery } from "../../utils/es-queries/lineupStintsQueryTemplate";
import { ParamPrefixes, CommonFilterParams } from "../../utils/FilterModels";

const queryPrefix = ParamPrefixes.lineupStints;

function marshallRequest(
  index: string,
  genderPrefix: string,
  params: Record<string, any>,
  currentJsonEpoch: number,
  efficiency: Record<string, any>,
  lookup: Record<string, any>,
  avgEfficiency: number
) {
  const body =
    [
      JSON.stringify({ index: index }),
      JSON.stringify(
        lineupStintsQuery(
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

  return body;
}

async function calculateLineupStints(
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
export default calculateLineupStints;
