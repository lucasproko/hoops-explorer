
// System imports
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

// Application imports
import { lineupStatsQuery } from "../../utils/es-queries/lineupStatsQueryTemplate";
import { AvailableTeams } from '../../utils/internal-data/AvailableTeams';
import { ncaaToKenpomLookup } from "../../utils/public-data/ncaaToKenpomLookup"
import { publicKenpomEfficiency2015_6 } from "../../utils/public-data/publicKenpomEfficiency2015_6";
import { publicKenpomEfficiency2018_9 } from "../../utils/public-data/publicKenpomEfficiency2018_9";
import { publicHerhoopstatsEfficiency2018_9 } from "../../utils/public-data/publicHerhoopstatsEfficiency2018_9";

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

  const efficiencyInfo: Record<string, [ Record<string, any>, Record<string, any> ]> = {
    "Men_2015/6": [ publicKenpomEfficiency2015_6, ncaaToKenpomLookup ],
    "Men_2018/9": [ publicKenpomEfficiency2018_9, ncaaToKenpomLookup ],
    "Women_2018/9": [ publicHerhoopstatsEfficiency2018_9, {} ] //(herhoopstats uses NCAA team names)
  };
  const [ efficiency, lookup ] = efficiencyInfo[`${params.gender}_${params.year}`] || [ {}, {} ];

  if (team == null) {
    res.status(404).json({});
  } else {
    const index = team.index_template + "_" + team.year.substring(0, 4);

    const body = [
      JSON.stringify({ index: index }),
      JSON.stringify(lineupStatsQuery(params, efficiency, lookup))
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
