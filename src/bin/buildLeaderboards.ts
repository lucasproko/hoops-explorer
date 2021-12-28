////////////////////////////////////////////////////////////////
//
// NOTE: to compile this run "npm run dev" (then ctrl+c once "event - compiled successfully")
// ("npm run build" also works but takes longer)
// npm run build_leaderboards -- --year=<<eg 2021/22>> --tier=<<High|Low|Medium>> --gender=<<Men|Women>
//

// NOTE: test code is under src/__tests__

// System imports
import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import zlib from 'zlib';

import _ from "lodash";

// Models
import { PlayerCode, PlayerId, Statistic, IndivStatSet, TeamStatSet, LineupStatSet, TeamInfo } from "../utils/StatModels";

// API calls
import calculateLineupStats from "../pages/api/calculateLineupStats";
import calculateOnOffStats from "../pages/api/calculateOnOffStats";
import calculateOnOffPlayerStats from "../pages/api/calculateOnOffPlayerStats";
import { CommonApiUtils } from "../utils/CommonApiUtils";

// Pre processing
import { RequestUtils } from "../utils/RequestUtils";
import { QueryUtils } from "../utils/QueryUtils";
import { ParamDefaults } from "../utils/FilterModels";

// Post processing
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { averageStatsInfo } from '../utils/internal-data/averageStatsInfo';
import { efficiencyInfo } from '../utils/internal-data/efficiencyInfo';
import { LineupTableUtils } from "../utils/tables/LineupTableUtils";
import { RosterTableUtils } from "../utils/tables/RosterTableUtils";
import { TeamReportTableUtils } from "../utils/tables/TeamReportTableUtils";
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import { dataLastUpdated } from '../utils/internal-data/dataLastUpdated';
import { ncaaToKenpomLookup } from '../utils/public-data/ncaaToKenpomLookup'
import { TeamEvalUtils } from '../utils/stats/TeamEvalUtils'

//process.argv 2... are the command line args passed via "-- (args)"

const sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/** For completed years, filter based on possessions */
const ongoingYear = "2021/22";
const averagePossInCompletedYear = 1600;

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

/** Have to disable RAPM in test mode */
export const setTestModeOn = () => {
  ignoreRapm = true;
}
/** Have to disable RAPM in test mode */
var ignoreRapm = false;

/** Exported for test only */
export const savedLineups = [] as Array<any>;
const savedConfOnlyLineups = [] as Array<any>;
const savedT100Lineups = [] as Array<any>;

/** Exported for test only */
export const savedPlayers = [] as Array<any>;
const savedConfOnlyPlayers = [] as Array<any>;
const savedT100Players = [] as Array<any>;

/** Exported for test only */
export const teamInfo = [] as Array<TeamInfo>;
var bubbleOffenseInfo: number[] = [];
var bubbleDefenseInfo: number[] = [];
var eliteOffenseInfo: number[] = [];
var eliteDefenseInfo: number[] = [];

var commandLine = process?.argv || [];
if (commandLine?.[1]?.endsWith("buildLeaderboards.js")) {
  console.log("Start processing with args: " + _.drop(commandLine, 2));
} else {
  console.log("Unit test mode - just export methods [main, completeLineupLeaderboard]");
  commandLine = [];
}
const testMode = commandLine.length == 0;

const inTier = (_.find(commandLine, p => _.startsWith(p, "--tier="))
  || `--tier=${ParamDefaults.defaultTier}`).substring(7); //High, Medium, Low

const inGender = (_.find(commandLine, p => _.startsWith(p, "--gender="))
  || `--gender=${ParamDefaults.defaultGender}`).substring(9);
const inYear = (_.find(commandLine, p => _.startsWith(p, "--year="))
  || `--year=${testMode ? "2020/21": ParamDefaults.defaultLeaderboardYear}`).substring(7);
if (!testMode) console.log(`Args: gender=[${inGender}] year=[${inYear}]`);

const onlyHasTopConferences = (inGender != "Men") || (parseInt(inYear.substring(0, 4)) < 2020);

const testTeamFilter = undefined as Set<string> | undefined;
//(generic test set for debugging)
//const testTeamFilter = new Set([ "Maryland", "Iowa", "Michigan", "Dayton", "Rutgers", "Fordham" ]);
//(used this to build sample:)
//const testTeamFilter = new Set([ "Maryland", "Dayton", "Fordham" ]);

/** All the conferences in a given tier plus the "guest" teams if it's not in the right tier */
const mutableConferenceMap = {} as Record<string, string[]>;

const effectivelyHighMajor = new Set([
  "Gonzaga", "BYU", "Saint Mary's (CA)",
  "Memphis", "Wichita St.", "UConn", "Cincinnati", "Houston",
  "Utah St.", "Nevada"
]);
const excludeFromMidMajor = new Set([
  "Gonzaga",
  "Memphis", "Wichita St.", "UConn", "Cincinnati",
]);

/** Request data from ES, duplicate table processing over each team to build leaderboard (export for testing only) */
export async function main() {
  const globalGenderYearKey = `${inGender}_${inYear}`;
  const lookupForQuery = ncaaToKenpomLookup[globalGenderYearKey];
  var fallbackConfMapInfo: any = undefined;
  if (lookupForQuery) {
    console.log("Getting dynamic efficiency info (needed for conference map)");
    //(also will cache it for subsequent requests)
    const efficiencyYear = (parseInt(inYear.substring(0, 4)) + 1).toString(); //(+1 from the input year)
    fallbackConfMapInfo = await CommonApiUtils.buildCurrentMenEfficiency(globalGenderYearKey, efficiencyYear, lookupForQuery);
  }
  const completedEfficiencyInfo = (efficiencyInfo?.[globalGenderYearKey]?.[0] || fallbackConfMapInfo);

  const rankInfo = _.chain(completedEfficiencyInfo || {}).values().orderBy([ "stats.adj_margin.rank" ], [ "asc" ]).value();
  const bubbleRankInfo = _.chain(rankInfo).drop(40).take(10).value();
  const eliteRankInfo = _.chain(rankInfo).drop(10).take(5).value();
  bubbleOffenseInfo = bubbleRankInfo.map(o => o["stats.adj_off.value"] || 0);
  bubbleDefenseInfo = bubbleRankInfo.map(o => o["stats.adj_def.value"] || 0);
  eliteOffenseInfo = eliteRankInfo.map(o => o["stats.adj_off.value"] || 0);
  eliteDefenseInfo = eliteRankInfo.map(o => o["stats.adj_def.value"] || 0);

  const teamListChain = (inYear == "Extra") ?
    _.chain(AvailableTeams.extraTeamsBase) :
    _.chain(AvailableTeams.byName).values().flatten();

  /** If any teams aren't in the conf then */
  const mutableIncompleteConfs = new Set() as Set<string>;
  const teams = teamListChain.filter(
    team => ((testTeamFilter == undefined) || testTeamFilter.has(team.team))
  ).filter(team => {
    return team.gender == inGender &&
      ((inYear == "Extra") || (team.year == inYear));
  }).filter(team => {
    const conference = completedEfficiencyInfo?.[team.team]?.conf || "Unknown";
    const rank = completedEfficiencyInfo?.[team.team]?.["stats.adj_margin.rank"] || 400;
    // For years with lots of conferences, split into tiers:
    if (onlyHasTopConferences) {
      return true;
    } else {
      const isSupported = () => {
        if (inTier == "High") {
          return team.category == "high" || (rank <= 150) || effectivelyHighMajor.has(team.team);
        } else if (inTier == "Medium") {
          return (team.category != "high") && (team.category != "low") && (rank < 275) && !excludeFromMidMajor.has(team.team);
        } else if (inTier == "Low") {
          return team.category == "low" || team.category == "midlow" || ((team.category != "high") && (rank > 250));
        } else {
          throw `Tier not supported: ${inTier}`;
        }
      };
      const toInclude = isSupported();
      if (!toInclude) {
        mutableIncompleteConfs.add(conference);
      }
      return toInclude;
    }
  }).value();

//Test code:
//console.log("Number of teams = " + teams.length);
//throw "done";

  for (const teamObj of teams) {
    const team = teamObj.team;
    const teamYear = teamObj.year;
    const genderYearLookup = `${inGender}_${teamYear}`;
    const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;
    const statsAverages = averageStatsInfo[genderYearLookup] || {};

    if (!testMode) console.log(`Processing ${inGender} ${team} ${teamYear}`);

    const fullRequestModel = {
      gender: inGender,
      minRank: ParamDefaults.defaultMinRank,
      maxRank: ParamDefaults.defaultMaxRank,
      team: team,
      year: teamYear,
      getGames: true
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
    const conference = completedEfficiencyInfo?.[team]?.conf || "Unknown";
    const buildTeamAbbr = (t: string) => {
      const candidate1 = t.replace(/[^A-Z]/g, "");
      const addU = (abb: string) => {
        return (abb.indexOf("U") >= 0) ? abb : abb + "U";
      };
      return (candidate1.length == 1) ? t.substring(0, 3) : addU(candidate1);
    };
    mutableConferenceMap[conference] =
      mutableIncompleteConfs.has(conference) ?
        (mutableConferenceMap[conference] || []).concat([ buildTeamAbbr(team) ]) :
        [];

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

      // Also we're going to try fetching the roster

      const rosterInfoJson = await fs.readFile(
        `./public/rosters/${inGender}_${(teamYear || "").substring(0, 4)}/${RequestUtils.fixRosterUrl(team, false)}.json`
      ).then((s: any) => JSON.parse(s)).catch((err: any) => {
        return undefined;
      });
      //(don't use height_in for women)
      RequestUtils.mutateRosterJsonForWomen(rosterInfoJson, inGender);

      // Check for errors:

      if ((lineupResponse.statusCode >= 400) || (teamResponse.statusCode >= 400) || (playerResponse.statusCode >= 400)) {
        console.log(`ERROR [${team} ${label}]: ${JSON.stringify(lineupResponse)} ${JSON.stringify(teamResponse)} ${JSON.stringify(playerResponse)}`);
        process.exit(-1);
      }

      // Received all data, now do post-Processing:

      const rosterBaseline =
        playerResponse.getJsonResponse().aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [];

      const rosterGlobal =
        playerResponse.getJsonResponse().aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [];
          //using baseline instead of global here:
          // has no effect on luck since using "baseline" not "season" for luck adjustments
          // will have a small impact on ORtg and position calcs, in on/off they use season-wide

      const lineups =
        lineupResponse.getJsonResponse().aggregations?.lineups?.buckets || [];

      const teamGlobal =
        teamResponse.getJsonResponse().aggregations?.global?.only?.buckets?.team || {};

      const teamBaseline =
        teamResponse.getJsonResponse().aggregations?.tri_filter?.buckets?.baseline || {};

       // Team info, for "Build your own T25"
       if ("all" == label) {
         teamInfo.push({
            team_name: fullRequestModel.team,
            gender: fullRequestModel.gender,
            year: fullRequestModel.year,
            conf: conference,

            opponents: _.chain(teamBaseline.game_info?.buckets || [])
                .flatMap(l => l?.game_info?.buckets || [])
                .map(l => { // Let's do some marshalling:
                  const retVal = l?.end_of_game?.hits?.hits?.[0]?._source || {};
                  retVal.offPoss = l?.off_poss?.value || 0;
                  retVal.defPoss = l?.def_poss?.value || 0;
                  retVal.avgLead = (l?.avg_lead?.value || 0)/(0.5*(retVal.offPoss + retVal.defPoss) || 1);
                  return retVal;
                })
                .sortBy(g => g.date)
                .flatMap(g => {

                  // Get efficiency
                  const oppoEff = completedEfficiencyInfo?.[g.opponent?.team];
                  const gameDate = Date.parse(g.date); 

                  const isValid = g.score_info?.end?.scored && g.score_info?.end?.allowed && oppoEff && !Number.isNaN(gameDate);
                  
                  const teamOff = oppoEff?.["stats.adj_off.value"] || 0.0;
                  const teamDef = oppoEff?.["stats.adj_def.value"] || 0.0;
                  const locationType = g.location_type as "Home" | "Away" | "Neutral";
                  const baseHca = CommonApiUtils.getHca(fullRequestModel);
                  const actualHca = locationType == "Home" ? baseHca : (locationType == "Away" ? -baseHca : 0);

                  return isValid ? [{
                    oppo_name: g.opponent?.team || "Unknown",
                    date_str: (g.date || "").substring(0, 16),
                    date: Math.floor(gameDate/1000),
                    team_scored: g.score_info?.end?.scored || 0,
                    oppo_scored: g.score_info?.end?.allowed || 0,
                    off_poss: g.offPoss,
                    def_poss: g.defPoss,
                    avg_lead: g.avgLead,
                    location_type: locationType,

                    rank: oppoEff?.["stats.adj_margin.rank"] || 400,
                    adj_off: teamOff,
                    adj_def: teamDef,

                    wae: TeamEvalUtils.calcWinsAbove(teamOff, teamDef, eliteOffenseInfo, eliteDefenseInfo, actualHca), 
                    wab: TeamEvalUtils.calcWinsAbove(teamOff, teamDef, bubbleOffenseInfo, bubbleDefenseInfo, actualHca)
                  }] : [];
                }).value()
         });
       } 

      /** Largest sample of player stats, by player key - use for ORtg calcs */
      const globalRosterStatsByCode = RosterTableUtils.buildRosterTableByCode(rosterGlobal, rosterInfoJson);

      const baselinePlayerInfo = LineupTableUtils.buildBaselinePlayerInfo(
        rosterBaseline, globalRosterStatsByCode, teamBaseline, avgEfficiency, true //(always adjust for luck)
      );
      const positionFromPlayerKey = LineupTableUtils.buildPositionPlayerMap(rosterGlobal, teamSeasonLookup);

      const sortedLineups = LineupTableUtils.buildFilteredLineups(
        lineups,
        "", "desc:off_poss", "0", "500", //take all lineuos (sorted by off_pos) with no min poss - will filter later
        teamSeasonLookup, positionFromPlayerKey
      );

      // Merge ratings and position, and filter based on offensive possessions played
      const enrichedAndFilteredPlayers = _.toPairs(baselinePlayerInfo).filter(kv => {

        const globalTeamPoss = teamGlobal?.def_poss?.value || 0; //(global has def_poss but not off_poss)
        const playerPossPct = kv[1].off_team_poss_pct?.value || 0;

        // Basically: for teams that have played fewer possessions, but a decent number overall relative to their team
        // we'll allow it!
        const teamFactor = Math.min(globalTeamPoss/averagePossInCompletedYear, 1.0);
        const secondaryFilter =
          (fullRequestModel.year == ongoingYear) || (teamFactor*playerPossPct > 0.25);

        return secondaryFilter && (playerPossPct > 0.37); //(~15mpg min)
      }).map((kv: [PlayerId, IndivStatSet]) => {
        const posInfo = positionFromPlayerKey[kv[0]] || {};
        return {
          key: kv[0],
          conf: conference,
          team: team,
          year: teamYear,
          // Rating production
          off_adj_prod: {
            value: (kv[1].off_adj_rtg?.value || 0) * (kv[1].off_team_poss_pct?.value || 0)
          },
          def_adj_prod: {
            value: (kv[1].def_adj_rtg?.value || 0) * (kv[1].def_team_poss_pct?.value || 0),
            old_value: (kv[1].def_adj_rtg?.old_value || 0) * (kv[1].def_team_poss_pct?.value || 0),
            override: kv[1].def_adj_rtg?.override
          },
          ...posInfo,
          ...(_.chain(kv[1]).toPairs().filter(t2 => //Reduce down to the field we'll actually need
              (
                (t2[0] == "off_team_poss") || (t2[0] == "off_team_poss_pct") ||
                (t2[0] == "def_team_poss") || (t2[0] == "def_team_poss_pct")
              ) || (
                !_.startsWith(t2[0], "off_team_") && !_.startsWith(t2[0], "def_team_") &&
                !_.startsWith(t2[0], "off_oppo_") && !_.startsWith(t2[0], "def_oppo_") &&
                !_.startsWith(t2[0], "team_") && !_.startsWith(t2[0], "oppo_") &&
                !_.startsWith(t2[0], "total_") &&
                !_.endsWith(t2[0], "_target") && !_.endsWith(t2[0], "_source") &&
                (t2[0] != "player_array") && (t2[0] != "roster")
              )
            ).fromPairs().value()
          )
        };
      });

      const preRapmTableData = LineupTableUtils.buildEnrichedLineups(
        sortedLineups,
        teamGlobal, rosterGlobal, teamBaseline,
        true, "baseline", avgEfficiency,
        false, teamSeasonLookup, positionFromPlayerKey, baselinePlayerInfo
      );

      // Now do all the RAPM work (after luck has been adjusted)
      if (!ignoreRapm) { //(TODO: test data isn't big enough to calc RAPM so ignore for now in unit test)
        const rapmInfo = TeamReportTableUtils.buildOrInjectRapm(
          preRapmTableData, baselinePlayerInfo,
          true, //<-always adjust for luck
          avgEfficiency, genderYearLookup
        );
        const enrichedAndFilteredPlayersMap = _.fromPairs(
          enrichedAndFilteredPlayers.map(p => [ p.key, p ])
        );
        (rapmInfo?.enrichedPlayers || []).forEach((rapmP, index) => {
          const player = enrichedAndFilteredPlayersMap[rapmP.playerId] as Record<string, any>;
          // RAPM (rating + productions)
          if (player && rapmP.rapm) {
            player.off_adj_rapm = rapmP.rapm?.off_adj_ppp;
            player.off_adj_rapm_prod = {
              value: rapmP.rapm!.off_adj_ppp!.value! * player.off_team_poss_pct!.value!
            };
            player.def_adj_rapm = rapmP.rapm?.def_adj_ppp;
            player.def_adj_rapm_prod = {
              value: rapmP.rapm!.def_adj_ppp!.value! * player.def_team_poss_pct!.value!,
              old_value: (rapmP.rapm?.def_adj_ppp?.old_value || 0) * player.def_team_poss_pct!.value!,
              override: rapmP.rapm?.def_adj_ppp?.override
            };
          }
        });
      } //(end RAPM)

      const tableData = _.take(preRapmTableData, 5).map(tmpLineup => {
        // (removes unused fields from the JSON, to save space)
        const lineup =
          _.chain(tmpLineup).toPairs().filter(kv => {
            return (
              !_.startsWith(kv[0], "total_")
              || //(need to keep scramble and transition counts for now, used in the interim play category tooltips)
              (_.endsWith(kv[0], "_poss") || _.endsWith(kv[0], "_ppp"))
            );
          }).fromPairs().value() as LineupStatSet; //(we trust it has required fields)
        // Add conference:
        lineup.conf = conference;
        lineup.team = team;
        lineup.year = teamYear;
        // Add minimal player info:
        const codesAndIds = LineupTableUtils.buildCodesAndIds(lineup);
        lineup.player_info = _.fromPairs(codesAndIds.map(cid => {
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
            } as IndivStatSet
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
export function completePlayerLeaderboard(key: string, leaderboard: any[], topTableSize: number) {
  //TODO: RAPM
  // Take T300 by possessions
  const topByPoss =
    _.chain(leaderboard).sortBy(player => -1*(player.off_team_poss?.value || 0)).take(topTableSize).value();

  [ "rtg", "prod", "rapm", "rapm_prod"  ].forEach(subKey => {
    _.sortBy(
      topByPoss, player => (player[`def_adj_${subKey}`]?.value || 0) - (player[`off_adj_${subKey}`]?.value || 0)
    ).map((player, index) => {
      player[`adj_${subKey}_margin_rank`] = index + 1;
    });
    _.sortBy(topByPoss, player => (player[`def_adj_${subKey}`]?.value || 0)).forEach((player, index) => {
      player[`def_adj_${subKey}_rank`] = index + 1;
    });
    _.sortBy(topByPoss, player => -1*(player[`off_adj_${subKey}`]?.value || 0)).forEach((player, index) => {
      player[`off_adj_${subKey}_rank`] = index + 1;
    });
  });
  const sortedLeaderboard = _.sortBy(topByPoss, player => player.adj_rapm_margin_rank);
  return sortedLeaderboard;
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

if (!testMode) main().then(async dummy => {
  const topLineupSize = onlyHasTopConferences ? 300 : 400;
  const topPlayersSize = onlyHasTopConferences ? 700 : 1000;

  console.log("Processing Complete!");

  const outputCases: Array<[string, Array<any>, Array<any>]> =
    [ [ "all", savedLineups, savedPlayers ],
      [ "conf", savedConfOnlyLineups, savedConfOnlyPlayers ],
      [ "t100", savedT100Lineups, savedT100Players ] ];

  const lastUpdated =  //(will be new now for curr year + "Extra")
    dataLastUpdated[`${inGender}_${inYear}`] || new Date().getTime();

  await Promise.all(_.flatMap(outputCases, kv => {
    const sortedLineups = completeLineupLeaderboard(kv[0], kv[1], topLineupSize);
    const sortedLineupsStr = JSON.stringify({
      lastUpdated: lastUpdated,
      confMap: mutableConferenceMap,
      confs: _.keys(mutableConferenceMap),
      lineups: sortedLineups
    }, reduceNumberSize);
    const players = completePlayerLeaderboard(kv[0], kv[2], topPlayersSize);
    const playersStr = JSON.stringify({
      lastUpdated: lastUpdated,
      confMap: mutableConferenceMap,
      confs: _.keys(mutableConferenceMap),
      players: players
    }, reduceNumberSize);

    // Write to file
    console.log(`${kv[0]} lineup count: [${sortedLineups.length}] ([${kv[1].length}])`);
    console.log(`${kv[0]} lineup length: [${sortedLineupsStr.length}]`);
    const lineupFilename = `./public/leaderboards/lineups/lineups_${kv[0]}_${inGender}_${inYear.substring(0, 4)}_${inTier}.json`;
    const lineupsWritePromise = fs.writeFile(`${lineupFilename}`,sortedLineupsStr);
    console.log(`${kv[0]} player count: [${players.length}] ([${kv[2].length}])`);
    console.log(`${kv[0]} player length: [${playersStr.length}]`);
    const playersFilename = `./public/leaderboards/lineups/players_${kv[0]}_${inGender}_${inYear.substring(0, 4)}_${inTier}.json`;
    const playersWritePromise = fs.writeFile(`${playersFilename}`,playersStr);
    
    const teamFilename = `./public/leaderboards/lineups/teams_${kv[0]}_${inGender}_${inYear.substring(0, 4)}_${inTier}.json`;
    console.log(`${kv[0]} team count: ${teamInfo.length}`);

    const teamWritePromise = (("all" == kv[0]) && (teamInfo.length > 0)) ? 
      fs.writeFile(`${teamFilename}`, JSON.stringify({
        lastUpdated: lastUpdated,
        confMap: mutableConferenceMap,
        confs: _.keys(mutableConferenceMap),  

        teams: teamInfo
      }, reduceNumberSize)) :
      Promise.resolve();

    return [lineupsWritePromise, playersWritePromise, teamWritePromise];

   //(don't zip, the server/browser does it for us, so it's mainly just "wasting GH space")
   // zlib.gzip(sortedLineupsStr, (_, result) => {
   //   fs.writeFile(`${filename}.gz`,result, err => {});
   // });
  }));
  console.log("File creation Complete!");
  if (!testMode) {
    console.log("(exiting process)");
    process.exit(0);
  }
});
