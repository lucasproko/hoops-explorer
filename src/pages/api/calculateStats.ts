
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
    JSON.stringify({ index: "maryland_2018" }),
    JSON.stringify(teamStatsQuery2018(params)),
    JSON.stringify({ index: "maryland_2018" }),
    JSON.stringify(rosterCompareQuery2018(params))
  ].join('\n') + "\n";

  const esFetchJson = await fetch(`${process.env.CLUSTER_ID}/_msearch`, {
          method: 'post',
          body:    body,
          headers: { 'Content-Type': 'application/x-ndjson' },
      }).then(res => res.json());

  //TODO: handle errors (eg try making minRank a string in the query)
  
  //console.log(JSON.stringify(esFetchJson.responses[1], null, 3));

  res.status(200).json(esFetchJson);
}
