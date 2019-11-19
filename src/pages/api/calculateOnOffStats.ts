
// System imports
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

// Application imports
import { teamStatsQuery } from "../../utils/es-queries/teamStatsQueryTemplate";
import { rosterCompareQuery } from "../../utils/es-queries/rosterCompareQueryTemplate";
import { AvailableTeams } from '../../utils/internal-data/AvailableTeams';
import { efficiencyInfo } from '../../utils/internal-data/efficiencyInfo';

// Additional imports
import queryString from "query-string";

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const params = queryString.parse(require('url').parse(req.url).query);

  const team =
    (params.team && params.year && params.gender) ?
    AvailableTeams.getTeam( //(params is string|string[], so toString is needed for type safety)
        params.team.toString(), params.year.toString(), params.gender.toString()
    ) :
    null;

  const [ efficiency, lookup ] = efficiencyInfo[`${params.gender}_${params.year}`] || [ {}, {} ];

  if (team == null) {
    res.status(404).json({});
  } else {
    const index = team.index_template + "_" + team.year.substring(0, 4);

    const body = [
      JSON.stringify({ index: index }),
      JSON.stringify(teamStatsQuery(params, efficiency, lookup)),
      JSON.stringify({ index: index }),
      JSON.stringify(rosterCompareQuery(params, efficiency, lookup))
    ].join('\n') + "\n";

    try {
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
    } catch (e) {
      res.status(500).json({});
    }
  }
}
