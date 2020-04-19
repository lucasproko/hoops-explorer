
// System imports
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

// Application imports
import { teamStatsQuery } from "../../utils/es-queries/teamStatsQueryTemplate";
import { rosterCompareQuery } from "../../utils/es-queries/rosterCompareQueryTemplate";
import { playerStatsQuery } from "../../utils/es-queries/playerStatsQueryTemplate";
import { AvailableTeams } from '../../utils/internal-data/AvailableTeams';
import { efficiencyInfo } from '../../utils/internal-data/efficiencyInfo';
import { efficiencyAverages } from '../../utils/public-data/efficiencyAverages';
import { ServerRequestCache } from '../../utils/ServerRequestCache';
import { dataLastUpdated } from '../../utils/internal-data/dataLastUpdated';
import { ParamPrefixes, ParamDefaults, GameFilterParams } from '../../utils/FilterModels';

const isDebug = (process.env.NODE_ENV !== 'production');

/** Run node with "USE_TEST_INDICES" to hit the test indices */
const useTestIndices = isDebug && (process.env.USE_TEST_INDICES === 'true');

if (isDebug) {
  console.log(`Use test indices = [${useTestIndices}]`);
}

// Additional imports
import { QueryUtils } from "../../utils/QueryUtils";

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const queryPrefix = ParamPrefixes.game;

  const url = require('url').parse(req.url);
  const params = QueryUtils.parse(url.query) as GameFilterParams;
  const gender = params.gender || ParamDefaults.defaultGender;
  const year = params.year || ParamDefaults.defaultYear;

  const currentJsonEpoch = dataLastUpdated[`${gender}_${year}`] || -1;
  const maybeCacheJson = ServerRequestCache.decacheResponse(url.query, queryPrefix, currentJsonEpoch, isDebug);

  if (maybeCacheJson) {
    res.status(200).json(maybeCacheJson);
  } else {
    const team =
      (params.team && params.year && params.gender) ?
      AvailableTeams.getTeam( //(params is string|string[], so toString is needed for type safety)
          params.team.toString(), params.year.toString(), params.gender.toString()
      ) || { index_template: null, year: null }:
      null;

    const [ efficiency, lookup ] = efficiencyInfo[`${params.gender}_${params.year}`] || [ {}, {} ];
    const avgEfficiency = efficiencyAverages[`${params.gender}_${params.year}`] || efficiencyAverages.fallback;

    if (team == null) {
      res.status(404).json({});
    } else {
      const index = (team.index_template || AvailableTeams.defaultConfIndex) + "_" +
                      (team.year || params.year || "xxxx").substring(0, 4) + (useTestIndices ? "_ltest" : "");

      //(women is the suffix for index, so only need to add for men)
      const genderPrefix = (gender == "Women" ? "" : (`${gender}_` || "")).toLowerCase();

      const body = [
        JSON.stringify({ index: index }),
        JSON.stringify(teamStatsQuery(params, currentJsonEpoch, efficiency, lookup, avgEfficiency)),
        JSON.stringify({ index: index }),
        JSON.stringify(rosterCompareQuery(params, currentJsonEpoch, efficiency, lookup)),
        JSON.stringify({ index: `player_events_${genderPrefix}${index}` }),
        JSON.stringify(playerStatsQuery(params, currentJsonEpoch, efficiency, lookup, avgEfficiency)),
      ].join('\n') + "\n";
      // Debug logs:
      //console.log(JSON.stringify(teamStatsQuery(params, currentJsonEpoch, efficiency, lookup, avgEfficiency), null, 3));
      //console.log(JSON.stringify(teamStatsQuery(params, currentJsonEpoch, {}, {}, avgEfficiency), null, 3));
      //console.log(JSON.stringify(playerStatsQuery(params, currentJsonEpoch, {}, {}, avgEfficiency).aggregations.tri_filter.aggregations, null, 3));
      //console.log(JSON.stringify(teamStatsQuery(params, currentJsonEpoch, {}, {}).query, null, 3));

      try {
        const esFetch = await fetch(`${process.env.CLUSTER_ID}/_msearch`, {
                method: 'post',
                body:    body,
                headers: { 'Content-Type': 'application/x-ndjson' },
            });

        const esFetchJson = await esFetch.json();

        // Debug logs:
        //console.log(JSON.stringify(esFetchJson, null, 3));
        //console.log(JSON.stringify(esFetchJson?.responses?.[0], null, 3));
        //console.log(JSON.stringify(esFetchJson?.responses?.[2]?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets, null, 3));
        //console.log(esFetch.status);

        const jsonToUse = esFetch.ok ?
          esFetchJson :
          { error: { reason: "unknown" }, status_code: "" + esFetch.status }

        if (esFetch.ok) { // only cache if resposne was OK
           ServerRequestCache.cacheResponse(
             url.query, queryPrefix, esFetchJson, currentJsonEpoch, isDebug
           );
        }
        res.status(esFetch.status).json(esFetchJson);
      } catch (e) {
        console.log(`Error parsing response [${e.message}]`);
        res.status(500).json({});
      }
    }
  }
}
