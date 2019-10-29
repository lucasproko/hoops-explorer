
// System imports
import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'isomorphic-unfetch'

// Application imports
import { teamStatsQuery2018 } from "../../utils/teamStatsQueryTemplate"
import { rosterCompareQuery2018 } from "../../utils/rosterCompareQueryTemplate"

// Additional imports
import queryString from "query-string";

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const params = queryString.parse(require('url').parse(req.url).query);

  const body = [
    JSON.stringify({ index: "misc_conf_2018" }),
    JSON.stringify(teamStatsQuery2018(params)),
    JSON.stringify({ index: "misc_conf_2018" }),
    JSON.stringify(rosterCompareQuery2018(params))
  ].join('\n') + "\n";

  const esFetch = await fetch(`${process.env.CLUSTER_ID}/_msearch`, {
          method: 'post',
          body:    body,
          headers: { 'Content-Type': 'application/x-ndjson' },
      });

  const esFetchJson = await esFetch.json();

  //console.log(JSON.stringify(esFetchJson, null, 3));
  //console.log(esFetch.status);
  const jsonToUse = esFetch.ok ?
    esFetchJson :
    { error: { reason: "unknown" }, status_code: "" + esFetch.status }

  res.status(esFetch.status).json(esFetchJson);
}
