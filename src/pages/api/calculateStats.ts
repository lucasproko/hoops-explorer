
// System imports
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

// Application imports
import { teamStatsQuery2018 } from "../../utils/teamStatsQueryTemplate";
import { rosterCompareQuery2018 } from "../../utils/rosterCompareQueryTemplate";
import { AvailableTeams } from '../../utils/AvailableTeams';
import { publicKenpomEfficiency2015_6 } from "../../utils/publicKenpomEfficiency2015_6";
import { publicKenpomEfficiency2018_9 } from "../../utils/publicKenpomEfficiency2018_9";
import { publicHerhoopstatsEfficiency2018_9 } from "../../utils/publicHerhoopstatsEfficiency2018_9";

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

  const kenpom: Record<string, any> = {
    "Men_2015/6": publicKenpomEfficiency2015_6,
    "Men_2018/9": publicKenpomEfficiency2018_9,
    "Women_2018/9": publicHerhoopstatsEfficiency2018_9
  };
  const thisKenpom = kenpom[`${params.gender}_${params.year}`] || {};

  if (team == null) {
    res.status(404).json({});
  } else {

    const body = [
      JSON.stringify({ index: team.index_template + "_" + team.year.substring(0, 4) }),
      JSON.stringify(teamStatsQuery2018(params, thisKenpom)),
      JSON.stringify({ index: team.index_template + "_" + team.year.substring(0, 4) }),
      JSON.stringify(rosterCompareQuery2018(params, thisKenpom))
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
