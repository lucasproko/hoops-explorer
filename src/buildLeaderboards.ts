////////////////////////////////////////////////////////////////
//
// NOTE: to compile this run "npm run dev" (then ctrl+c once "event - compiled successfully")
// ("npm run build" also works but takes longer)
//

// System imports
import { NextApiRequest, NextApiResponse } from 'next';

import _ from "lodash";

// API calls
import calculateLineupStats from "./pages/api/calculateLineupStats";
import calculateOnOffStats from "./pages/api/calculateOnOffStats";
import calculateOnOffPlayerStats from "./pages/api/calculateOnOffPlayerStats";

// Pre processing
import { QueryUtils } from "./utils/QueryUtils";

// Post processing
import { efficiencyAverages } from './utils/public-data/efficiencyAverages';
import { LineupTableUtils } from "./utils/tables/LineupTableUtils";

//process.argv 2... are the command line args passed via "-- (args)"

//const result = marshallLineupRequest

class MutableAsyncResponse {
  statusCode: number;
  resultJson: any;

  constructor() {
    this.statusCode = 0;
    this.resultJson = {};
  }
  status(n: number) {
    this.statusCode = n;
    return this;
  }
  json(j: any) {
    this.resultJson = j;
    return this;
  }
  getJsonResponse() {
    return this.resultJson.responses?.[0] || {};
  }
}

async function main() {

  const globalRequest = {
    gender: "Men",
    minRank: "0",
    maxRank: "400",
    team: "Maryland",
    year: "2019/20"
  };
  const globalRequestParams = QueryUtils.stringify(globalRequest);

  const lineupResponse = new MutableAsyncResponse();
  const teamResponse = new MutableAsyncResponse();
  const playerResponse = new MutableAsyncResponse();
  await Promise.all([
    calculateLineupStats(
      { url: `https://hoop-explorer.com/?${globalRequestParams}` } as unknown as NextApiRequest,
      lineupResponse as unknown as NextApiResponse
    ),
    calculateOnOffStats(
      { url: `https://hoop-explorer.com/?${globalRequestParams}` } as unknown as NextApiRequest,
      teamResponse as unknown as NextApiResponse
    ),
    calculateOnOffPlayerStats(
      { url: `https://hoop-explorer.com/?${globalRequestParams}` } as unknown as NextApiRequest,
      playerResponse as unknown as NextApiResponse
    ),
  ]);

  // Received all data, now do post-Processing
  //TODO: Check for any errors:

  const teamSeasonLookup = `${globalRequest.gender}_${globalRequest.team}_${globalRequest.year}`;
  const genderYearLookup = `${globalRequest.gender}_${globalRequest.year}`;
  const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

  const rosterBaseline =
    playerResponse.getJsonResponse().aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [];

  const rosterGlobal = //TODO: will be different for other filters maybe?!
    playerResponse.getJsonResponse().aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [];

  const lineups =
    lineupResponse.getJsonResponse().aggregations?.lineups?.buckets || [];

  const teamGlobal =
    teamResponse.getJsonResponse().aggregations?.global?.only?.buckets?.team || {};

  const teamBaseline =
    teamResponse.getJsonResponse().aggregations?.global?.only?.buckets?.team || {};

  const baselinePlayerInfo = LineupTableUtils.buildBaselinePlayerInfo(
    rosterBaseline, avgEfficiency
  );
  const positionFromPlayerKey = LineupTableUtils.buildPositionPlayerMap(rosterGlobal, teamSeasonLookup);

  const filteredLineups = LineupTableUtils.buildFilteredLineups(
    lineups,
    "", "desc:off_poss", "150", "5", //TODO: take top 5 (sorted by off_pos) with min 150 poss
    teamSeasonLookup, positionFromPlayerKey
  );
  const tableData = LineupTableUtils.buildEnrichedLineups(
    filteredLineups,
    teamGlobal, rosterGlobal, teamBaseline,
    true, "season", avgEfficiency,
    [], teamSeasonLookup, positionFromPlayerKey, baselinePlayerInfo
  );
  //TODO: inject required fields into the lineup... (can we remove stuff?!)

/**/
//  console.log("RECEIVED: " + JSON.stringify(tableData, null, 3));
}

console.log("Start processing with args: " + _.drop(process.argv, 2));

main().then(_ => {
  console.log("Processing Complete!")
});
