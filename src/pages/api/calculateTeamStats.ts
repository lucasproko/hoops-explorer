
// System imports
import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'isomorphic-unfetch'

// Application imports
import { teamStatsQuery2018 } from "../../utils/teamStatsQueryTemplate"

// Additional imports
import queryString from "query-string";

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const params = queryString.parse(require('url').parse(req.url).query);

  const esFetchJson = await fetch(`${process.env.CLUSTER_ID}/maryland_2018/_search`, {
          method: 'post',
          body:    JSON.stringify(teamStatsQuery2018(params)),
          headers: { 'Content-Type': 'application/json' },
      }).then(res => res.json());

  //TODO: handle errors (eg try making minRank a string in the query)

  res.status(200).json(esFetchJson)
}
