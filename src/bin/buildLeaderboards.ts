////////////////////////////////////////////////////////////////
//
// NOTE: to compile this run "npm run dev" (then ctrl+c once "event - compiled successfully")
// ("npm run build" also works but takes longer)
//

// System imports
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import zlib from 'zlib';

import _ from "lodash";

// API calls
import calculateLineupStats from "../pages/api/calculateLineupStats";
import calculateOnOffStats from "../pages/api/calculateOnOffStats";
import calculateOnOffPlayerStats from "../pages/api/calculateOnOffPlayerStats";

// Pre processing
import { QueryUtils } from "../utils/QueryUtils";

// Post processing
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { efficiencyInfo } from '../utils/internal-data/efficiencyInfo';
import { LineupTableUtils } from "../utils/tables/LineupTableUtils";
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';

//process.argv 2... are the command line args passed via "-- (args)"

const sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

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

const savedLineups = [];
const savedConfOnlyLineups = [];
const savedT100Lineups = [];

//TODO: command line parameters:
const inGender = "Men";
const inYear = "2019/20";
const teamFilter = new Set([ "Maryland", "Iowa", "Michigan", "Dayton", "Rutgers" ]);

const conferenceSet = new Set([]);

async function main() {

  const teams = _.chain(AvailableTeams.byName).values().flatten().filter(team => {
    return team.gender == inGender && team.year == inYear && (!teamFilter || teamFilter.has(team.team))
  }).map(team => team.team).value();

  await Promise.all(teams.map(async team => {

    console.log(`Processing ${inGender} ${team} ${inYear}`);

    const fullRequestModel = {
      gender: inGender,
      minRank: "0",
      maxRank: "400",
      team: team,
      year: inYear
    };
    const requestModelConfOnly = {
      ...fullRequestModel,
      queryFilters: "Conf"
    };
    const requestModelT100 = {
      ...fullRequestModel,
      maxRank: "100"
    };

    const teamSeasonLookup = `${fullRequestModel.gender}_${fullRequestModel.team}_${fullRequestModel.year}`;
    const genderYearLookup = `${fullRequestModel.gender}_${fullRequestModel.year}`;
    const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

    // Snag conference from D1 metadata
    const conference = efficiencyInfo?.[genderYearLookup]?.[0]?.[team]?.conf || "Unknown";
    conferenceSet.add(conference);

    await Promise.all([ [ "all", fullRequestModel], [ "conf", requestModelConfOnly ], [ "t100", requestModelT100 ] ].map(async ([label, requestModel]: [string, any]) => {
      const requestParams = QueryUtils.stringify(requestModel);

      const lineupResponse = new MutableAsyncResponse();
      const teamResponse = new MutableAsyncResponse();
      const playerResponse = new MutableAsyncResponse();
      await Promise.all([
        calculateLineupStats(
          { url: `https://hoop-explorer.com/?${requestParams}` } as unknown as NextApiRequest,
          lineupResponse as unknown as NextApiResponse
        ),
        calculateOnOffStats(
          { url: `https://hoop-explorer.com/?${requestParams}` } as unknown as NextApiRequest,
          teamResponse as unknown as NextApiResponse
        ),
        calculateOnOffPlayerStats(
          { url: `https://hoop-explorer.com/?${requestParams}` } as unknown as NextApiRequest,
          playerResponse as unknown as NextApiResponse
        ),
      ]);

      // Check for errors:

      if ((lineupResponse.statusCode >= 400) || (teamResponse.statusCode >= 400) || (playerResponse.statusCode >= 400)) {
        console.log(`ERROR [${team} ${label}]: ${JSON.stringify(lineupResponse)} ${JSON.stringify(teamResponse)} ${JSON.stringify(playerResponse)}`);
        process.exit(-1);
      }

      // Received all data, now do post-Processing:

      const rosterBaseline =
        playerResponse.getJsonResponse().aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [];

      const rosterGlobal = //(using "baseline" not "season" for luck adjustments, so don't need this)
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
        "", "desc:off_poss", "0", "5", //TODO: take top 5 (sorted by off_pos) with no min poss
        teamSeasonLookup, positionFromPlayerKey
      );

      const tableData = LineupTableUtils.buildEnrichedLineups(
        filteredLineups,
        teamGlobal, rosterGlobal, teamBaseline,
        true, "baseline", avgEfficiency,
        [], teamSeasonLookup, positionFromPlayerKey, baselinePlayerInfo
      ).map(tmpLineup => {
        // (removes unused fields from the JSON, to save space)
        const lineup =
          _.chain(tmpLineup).toPairs().filter(kv => !_.startsWith(kv[0], "total_")).fromPairs().value();
        // Add conference:
        lineup.conf = conference;
        lineup.team = team;
        lineup.year = inYear;
        lineup.gender = inGender;
        // Add minimal player info:
        const codesAndIds = LineupTableUtils.buildCodesAndIds(lineup);
        lineup.player_info = _.fromPairs(codesAndIds.map((cid: { code: string, id: string }) => {
          const playerSubset =  _.pick(baselinePlayerInfo[cid.id] || {}, [
            //These are the fields required for lineup display enrichment
            "off_rtg", "off_usage", "def_orb", "key",
            "off_adj_rtg", "def_adj_rtg", "off_3pr",
            "off_ftr", "off_assist"
          ]);
          return [
            cid.id,
            { ...playerSubset, code: cid.code, posClass: positionFromPlayerKey[playerSubset.key]?.posClass }
          ];
        }));
        //(now don't need this:)
        delete lineup.players_array;
        return lineup;
      });

      switch (label) {
        case "all": savedLineups.push(...tableData); break;
        case "conf": savedConfOnlyLineups.push(...tableData); break;
        case "t100": savedT100Lineups.push(...tableData); break;
        default: console.log(`WARNING unexpected label: ${label}`);
      }
    })); //(end loop over leaderboards)

    await sleep(250); //(just ensure we don't hammer ES too badly)

  })); //(end loop over teams)
  //  console.log("RECEIVED: " + JSON.stringify(tableData, null, 3));
}

/** Adds some handy default sortings and removes possession outliers */
function completeLineupLeaderboard(key: string, leaderboard: any[]) {
  // Remove possession outliers
  const sum = _.reduce(leaderboard, (acc, v) => {
    const value = v.off_poss?.value || 0;
    return acc + value;
  }, 0);
  const mean = sum/(leaderboard.length || 1);
  const thresh = 0.6*mean;
/**/
//TODO: filter everything that isn't in the T400 in one of the 3 categories
  const filteredLeaderboard = leaderboard.filter(lineup => (lineup.off_poss?.value || 0) >= thresh);

  const removed = leaderboard.length - filteredLeaderboard.length;
  console.log(`${key}: mean=[${mean}] thresh=[${thresh}] removed=[${removed}]`);

  [ "off_adj_ppp", "def_adj_ppp" ].forEach((key) => {
    _.sortBy(filteredLeaderboard, lineup => -1*(lineup[key]?.value || 0)).forEach((lineup, index) => {
      lineup[`${key}_rank`] = index + 1;
    });
  });
  return _.sortBy(
    filteredLeaderboard, lineup => (lineup.def_adj_ppp?.value || 0) - (lineup.off_adj_ppp?.value || 0)
  ).map((lineup, index) => {
    lineup[`adj_margin_rank`] = index + 1;
    return lineup;
  });
}

console.log("Start processing with args: " + _.drop(process.argv, 2));

main().then(_ => {

  console.log("Processing Complete!");

  [ [ "all", savedLineups ], [ "conf", savedConfOnlyLineups ], [ "t100", savedT100Lineups ] ].forEach(kv => {
    const sortedLineups = completeLineupLeaderboard(...kv);
    const sortedLineupsStr = JSON.stringify({
      confs: Array.from(conferenceSet.values()),
      lineups: sortedLineups
    });

      // Write to file
     console.log(`${kv[0]} length: [${sortedLineupsStr.length}]`);
     const filename = `./public/leaderboards/lineups/lineups_${kv[0]}_${inGender}_${inYear.substring(0, 4)}.json`;
     fs.writeFile(`${filename}`,sortedLineupsStr, err => {});
     //(don't zip, the server/browser does it for us, so it's mainly just "wasting GH space")
     // zlib.gzip(sortedLineupsStr, (_, result) => {
     //   fs.writeFile(`${filename}.gz`,result, err => {});
     // });
   });
   console.log("File creation Complete!")
});
