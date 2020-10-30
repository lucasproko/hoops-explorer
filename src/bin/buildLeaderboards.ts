////////////////////////////////////////////////////////////////
//
// NOTE: to compile this run "npm run dev" (then ctrl+c once "event - compiled successfully")
// ("npm run build" also works but takes longer)
//

// NOTE: test code is under src/__tests__

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
import { ParamDefaults } from "../utils/FilterModels";

// Post processing
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { efficiencyInfo } from '../utils/internal-data/efficiencyInfo';
import { LineupTableUtils } from "../utils/tables/LineupTableUtils";
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import { dataLastUpdated } from '../utils/internal-data/dataLastUpdated';

//process.argv 2... are the command line args passed via "-- (args)"

const sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/** Handy util for reducing  */
const reduceNumberSize = (k: string, v: any) => {
  if (_.isNumber(v)) {
    const rawNumStr = "" + v;
    const numStr = v.toFixed(4);
    if (numStr.length >= rawNumStr.length) { //made it worse
      return v;
    } else {
      return parseFloat(numStr);
    }
  } else {
    return v;
  }
}


export class MutableAsyncResponse {
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

/** Exported for test only */
export const savedLineups = [] as Array<any>;
const savedConfOnlyLineups = [] as Array<any>;
const savedT100Lineups = [] as Array<any>;

/** Exported for test only */
export const savedPlayers = [] as Array<any>;
const savedConfOnlyPlayers = [] as Array<any>;
const savedT100Players = [] as Array<any>;

var commandLine = process?.argv || [];
if (commandLine?.[1]?.endsWith("buildLeaderboards.js")) {
  console.log("Start processing with args: " + _.drop(commandLine, 2));
} else {
  console.log("Unit test mode - just export methods [main, completeLineupLeaderboard]");
  commandLine = [];
}
const testMode = commandLine.length == 0;

const inGender = (_.find(commandLine, p => _.startsWith(p, "--gender="))
  || `--gender=${ParamDefaults.defaultGender}`).substring(9);
const inYear = (_.find(commandLine, p => _.startsWith(p, "--year="))
  || `--year=${ParamDefaults.defaultYear}`).substring(7);
if (!testMode) console.log(`Args: gender=[${inGender}] year=[${inYear}]`);
const teamFilter = undefined as Set<string> | undefined;
  //(inYear == "2019/20") ? new Set([ "Maryland", "Iowa", "Michigan", "Dayton", "Rutgers" ]) : undefined;

const genderYearLookup = `${inGender}_${inYear}`;
const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

const conferenceSet = new Set() as Set<string>;

/** Request data from ES, duplicate table processing over each team to build leaderboard (export for testing only) */
export async function main() {

  const teams = _.chain(AvailableTeams.byName).values().flatten().filter(team => {
    return team.gender == inGender && team.year == inYear && ((teamFilter == undefined) || teamFilter.has(team.team))
  }).map(team => team.team).value();

  for (const team of teams) {
    if (!testMode) console.log(`Processing ${inGender} ${team} ${inYear}`);

    const fullRequestModel = {
      gender: inGender,
      minRank: ParamDefaults.defaultMinRank,
      maxRank: ParamDefaults.defaultMaxRank,
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

    // Snag conference from D1 metadata
    const conference = efficiencyInfo?.[genderYearLookup]?.[0]?.[team]?.conf || "Unknown";
    conferenceSet.add(conference);

    const inputCases: Array<[string, any]> =
      [ [ "all", fullRequestModel], [ "conf", requestModelConfOnly ], [ "t100", requestModelT100 ] ];

    if (!testMode) await sleep(1000); //(just ensure we don't hammer ES too badly)

    if (!testMode) console.log("Asking Elasticsearch:")

    const getAllDataPromise = Promise.all(inputCases.map(async ([label, requestModel]: [string, any]) => {
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

      /** Largest sample of player stats, by player key - use for ORtg calcs */
      const globalRosterStatsByCode =
        _.chain(rosterGlobal).map(p => {
          return [ p.player_array?.hits?.hits?.[0]?._source?.player?.code || p.key, p ];
        }).fromPairs().value();

      const baselinePlayerInfo = LineupTableUtils.buildBaselinePlayerInfo(
        rosterBaseline, globalRosterStatsByCode, teamBaseline, avgEfficiency
      );
      const positionFromPlayerKey = LineupTableUtils.buildPositionPlayerMap(rosterGlobal, teamSeasonLookup);

      const filteredLineups = LineupTableUtils.buildFilteredLineups(
        lineups,
        "", "desc:off_poss", "0", "5", //take top 5 (sorted by off_pos) with no min poss
        teamSeasonLookup, positionFromPlayerKey
      );

      // Merge ratings and position, and filter based on offensive possessions played
      const enrichedAndFilteredPlayers = _.toPairs(baselinePlayerInfo).filter(kv => {
        return kv[1].off_team_poss_pct!.value! > 0.37; //(~15mpg min)
      }).map(kv => {
        const posInfo = positionFromPlayerKey[kv[0]] || {};
        return {
          conf: conference,
          ...posInfo,
          ...(_.chain(kv[1]).toPairs().filter(t2 => //Reduce down to the field we'll actually need
              (t2[0] == "off_team_poss")
              || (
                !_.startsWith(t2[0], "off_team_") && !_.startsWith(t2[0], "def_team_") &&
                !_.startsWith(t2[0], "off_oppo_") && !_.startsWith(t2[0], "def_oppo_") &&
                !_.startsWith(t2[0], "team_") && !_.startsWith(t2[0], "oppo_") &&
                !_.startsWith(t2[0], "total_")
              )
            ).fromPairs().value()
          )
        };
      });

      const tableData = LineupTableUtils.buildEnrichedLineups(
        filteredLineups,
        teamGlobal, rosterGlobal, teamBaseline,
        true, "baseline", avgEfficiency,
        false, teamSeasonLookup, positionFromPlayerKey, baselinePlayerInfo
      ).map(tmpLineup => {
        // (removes unused fields from the JSON, to save space)
        const lineup =
          _.chain(tmpLineup).toPairs().filter(kv => {
            return (
              !_.startsWith(kv[0], "total_")
              || //(need to keep scramble and transition counts for now, used in the interim play category tooltips)
              (_.endsWith(kv[0], "_poss") || _.endsWith(kv[0], "_ppp"))
            );
          }).fromPairs().value();
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
            { ...playerSubset, code: cid.code,
              // Both these are needed to order the players within the lineup
              posClass: positionFromPlayerKey[playerSubset.key]?.posClass,
              posConfidences: positionFromPlayerKey[playerSubset.key]?.posConfidences,
            }
          ];
        }));
        //(now don't need this:)
        delete lineup.players_array;
        return lineup;
      });

      switch (label) {
        case "all":
          savedLineups.push(...tableData);
          savedPlayers.push(...enrichedAndFilteredPlayers);
          break;
        case "conf":
          savedConfOnlyLineups.push(...tableData);
          savedConfOnlyPlayers.push(...enrichedAndFilteredPlayers);
          break;
        case "t100":
          savedT100Lineups.push(...tableData);
          savedT100Players.push(...enrichedAndFilteredPlayers);
          break;

        default: console.log(`WARNING unexpected label: ${label}`);
      }

    })); //(end loop over leaderboards)

    await getAllDataPromise;
  }
  //  console.log("RECEIVED: " + JSON.stringify(tableData, null, 3));
}
/** Adds some handy default sortings */
export function completePlayerLeaderboard(key: string, leaderboard: any[]) {
  //TODO:
  return leaderboard;
}

/** Adds some handy default sortings and removes possession outliers (export for test only) */
export function completeLineupLeaderboard(key: string, leaderboard: any[], topLineupSize: number) {
  // Take T300 by possessions
  const topByPoss =
    _.chain(leaderboard).sortBy(lineup => -1*(lineup.off_poss?.value || 0)).take(topLineupSize).value();

  _.sortBy(topByPoss, lineup => -1*(lineup.off_adj_ppp?.value || 0)).forEach((lineup, index) => {
    lineup[`off_adj_ppp_rank`] = index + 1;
  });
  _.sortBy(topByPoss, lineup => (lineup.def_adj_ppp?.value || 0)).forEach((lineup, index) => {
    lineup[`def_adj_ppp_rank`] = index + 1;
  });
  const rankedLineups = _.sortBy(
    topByPoss, lineup => (lineup.def_adj_ppp?.value || 0) - (lineup.off_adj_ppp?.value || 0)
  ).map((lineup, index) => {
    lineup[`adj_margin_rank`] = index + 1;
    return lineup;
  });
  return rankedLineups;
}

if (!testMode) main().then(_ => {
  const topLineupSize = 300; //T300

  console.log("Processing Complete!");

  const outputCases: Array<[string, Array<any>, Array<any>]> =
    [ [ "all", savedLineups, savedPlayers ],
      [ "conf", savedConfOnlyLineups, savedConfOnlyPlayers ],
      [ "t100", savedT100Lineups, savedT100Players ] ];

  outputCases.forEach(kv => {
    const sortedLineups = completeLineupLeaderboard(kv[0], kv[1], topLineupSize);
    const sortedLineupsStr = JSON.stringify({
      lastUpdated: dataLastUpdated[genderYearLookup] || new Date().getTime(),
      confs: Array.from(conferenceSet.values()),
      lineups: sortedLineups
    }, reduceNumberSize);
    const players = completePlayerLeaderboard(kv[0], kv[2]);
    const playersStr = JSON.stringify({
      lastUpdated: dataLastUpdated[genderYearLookup] || new Date().getTime(),
      confs: Array.from(conferenceSet.values()),
      players: players
    }, reduceNumberSize);

    // Write to file
    console.log(`${kv[0]} lineup length: [${sortedLineupsStr.length}]`);
    const lineupFilename = `./public/leaderboards/lineups/lineups_${kv[0]}_${inGender}_${inYear.substring(0, 4)}.json`;
    fs.writeFile(`${lineupFilename}`,sortedLineupsStr, err => {});
    console.log(`${kv[0]} player length: [${playersStr.length}]`);
    const playersFilename = `./public/leaderboards/lineups/players_${kv[0]}_${inGender}_${inYear.substring(0, 4)}.json`;
    fs.writeFile(`${playersFilename}`,playersStr, err => {});

   //(don't zip, the server/browser does it for us, so it's mainly just "wasting GH space")
   // zlib.gzip(sortedLineupsStr, (_, result) => {
   //   fs.writeFile(`${filename}.gz`,result, err => {});
   // });
 });
 console.log("File creation Complete!")
});
