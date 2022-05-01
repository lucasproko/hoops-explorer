////////////////////////////////////////////////////////////////
//
// NOTE: to compile this run "npm run dev" (then ctrl+c once "event - compiled successfully")
// ("npm run build" also works but takes longer)
// npm run build_leaderboards -- --year=<<eg 2021/22>> --tier=<<High|Low|Medium|Combo>> --gender=<<Men|Women>
//
// (Combo tier just combines the division stats from the other 3 tiers idempotently to buikd a combined stats file - no DB queries)

// NOTE: test code is under src/__tests__

// System imports
import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import zlib from 'zlib';

import _ from "lodash";

// Models
import { PlayerCode, PlayerId, Statistic, IndivStatSet, TeamStatSet, LineupStatSet, TeamInfo, DivisionStatistics, TeamStatInfo } from "../utils/StatModels";

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
import { efficiencyInfo } from '../utils/internal-data/efficiencyInfo';
import { LineupTableUtils } from "../utils/tables/LineupTableUtils";
import { RosterTableUtils } from "../utils/tables/RosterTableUtils";
import { TeamReportTableUtils } from "../utils/tables/TeamReportTableUtils";
import { AvailableTeams, AvailableTeamMeta } from '../utils/internal-data/AvailableTeams';
import { dataLastUpdated } from '../utils/internal-data/dataLastUpdated';
import { ncaaToKenpomLookup } from '../utils/public-data/ncaaToKenpomLookup';
import { TeamEvalUtils } from '../utils/stats/TeamEvalUtils';
import { GradeUtils } from '../utils/stats/GradeUtils';
import { DerivedStatsUtils } from '../utils/stats/DerivedStatsUtils';
import { OnBallDefenseUtils } from '../utils/stats/OnBallDefenseUtils';
import { OnBallDefenseModel } from '../utils/stats/RatingUtils';
import { DateUtils } from '../utils/DateUtils';

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

/** Exported for test only */
export const teamStatInfo = [] as Array<TeamStatInfo>;

/** Exported for test only */
export const mutableDivisionStats: DivisionStatistics = { 
  tier_sample_size: 0,
  dedup_sample_size: 0,
  tier_samples: {},
  tier_lut: {},
  dedup_samples: {}
 };

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
  || `--year=${testMode ? DateUtils.yearToUseForTests : DateUtils.mostRecentYearWithData}`).substring(7);
if (!testMode) console.log(`Args: gender=[${inGender}] year=[${inYear}]`);

const onlyHasTopConferences = (inGender != "Men") || (inYear < DateUtils.yearFromWhichAllMenD1Imported);

const testTeamFilter = undefined as Set<string> | undefined;
//(generic test set for debugging)
//const testTeamFilter = new Set([ "Maryland", "Iowa", "Michigan", "Dayton", "Rutgers", "Fordham" ]);
//(used this to build sample:)
//const testTeamFilter = new Set([ "Maryland" ]) //, "Dayton", "Fordham" ]);

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

const lastUpdated =  //(will be new now for curr year + "Extra")
  dataLastUpdated[`${inGender}_${inYear}`] || new Date().getTime();

/** ~20d before end of full season */
const approxEndofRegSeason = DateUtils.getEndOfRegSeason(`${inGender}_${inYear}`) || lastUpdated;

/** For completed years, filter based on possessions */
const averagePossInCompletedYear = (inYear == DateUtils.covidSeason) ? 1000 : 1600; //(reduce min allowed for Covid year)

/** Enable this to pass a subfield called 'rapm' to the player objects (just for export, then re-disable) */
const injectAllRapmForNbaFolks = false;

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
      const isSupported = () => { // Note that this method has to be consistent with naturalTier defintion below
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

  async function handleTeam(teamObj: AvailableTeamMeta, retry: number) {
    const team = teamObj.team;
    const teamYear = teamObj.year;
    const genderYearLookup = `${inGender}_${teamYear}`;
    const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;
    const rank = completedEfficiencyInfo?.[team]?.["stats.adj_margin.rank"] || 400;

    // Note that this definition has to be consistent with isSupported defintion above
    const naturalTier = 
      (onlyHasTopConferences || (teamObj.category == "high") || excludeFromMidMajor.has(team)) ? "High" : (
        ((teamObj.category == "low") || (teamObj.category == "midlow") || (rank >= 275)) ? "Low" : 
          "Medium"
      );

    const inNaturalTier = naturalTier == inTier;

    if (!testMode) console.log(`Processing ${inGender} ${team} ${teamYear}`);

    const fullRequestModel = {
      gender: inGender,
      minRank: ParamDefaults.defaultMinRank,
      maxRank: ParamDefaults.defaultMaxRank,
      team: team,
      year: teamYear,
      getGames: true
    };
    const _30d_ago = new Date((approxEndofRegSeason - 30*24*3600)*1000).toISOString().slice(0, 10);
    const fullTeamRequestModelWithRecency = {
      ...fullRequestModel,
      onQuery: `date:[${_30d_ago} TO *]`
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

    const inputCases: Array<[string, any, any]> =
      [ [ "all", fullRequestModel, fullTeamRequestModelWithRecency], 
        [ "conf", requestModelConfOnly, undefined],
        [ "t100", requestModelT100, undefined ] 
      ];

    if (!testMode) await sleep(1000); //(just ensure we don't hammer ES too badly)

    if (!testMode) console.log("Asking Elasticsearch:")

    const getAllDataPromise = Promise.all(inputCases.map(async ([label, requestModel, teamRequestModel]: [string, any, any]) => {
      const requestParams = QueryUtils.stringify(requestModel);
      const teamRequestParms = teamRequestModel ? QueryUtils.stringify(teamRequestModel) : requestParams;

      const lineupResponse = new MutableAsyncResponse();
      const teamResponse = new MutableAsyncResponse();
      const playerResponse = new MutableAsyncResponse();

      await Promise.all([
        calculateLineupStats(
          { url: `https://hoop-explorer.com/?${requestParams}` } as unknown as NextApiRequest,
          lineupResponse as unknown as NextApiResponse
        ),
        calculateOnOffStats(
          { url: `https://hoop-explorer.com/?${teamRequestParms}` } as unknown as NextApiRequest,
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

      if ((retry < 10) && ((lineupResponse.statusCode >= 500) || (teamResponse.statusCode >= 500) || (playerResponse.statusCode >= 500))) {
        console.log(`RETRYABLE ERROR [${team} ${label}]: ${JSON.stringify(lineupResponse)} ${JSON.stringify(teamResponse)} ${JSON.stringify(playerResponse)}`);

        await sleep(10000); //(wait 10s and try again)
        handleTeam(teamObj, retry + 1);

      } else if ((lineupResponse.statusCode >= 400) || (teamResponse.statusCode >= 400) || (playerResponse.statusCode >= 400)) {
        // Not retry-able, or run out of attempts
        console.log(`ERROR #[${retry}] [${team} ${label}]: ${JSON.stringify(lineupResponse)} ${JSON.stringify(teamResponse)} ${JSON.stringify(playerResponse)}`);
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

      const teamRecent = 
        teamResponse.getJsonResponse().aggregations?.tri_filter?.buckets?.on || {};

       // Team info, for "Build your own T25"
       if (("all" == label) && (completedEfficiencyInfo?.[team])) {
          const teamAdjOff = completedEfficiencyInfo?.[team]?.["stats.adj_off.value"] || 0.0;
          const teamAdjDef = completedEfficiencyInfo?.[team]?.["stats.adj_def.value"] || 0.0;
  
          const teamCalcAdjEffOff = teamBaseline.off_adj_ppp?.value || teamAdjOff;
          const teamCalcAdjEffDef = teamBaseline.def_adj_ppp?.value || teamAdjDef;
          const teamCalcAdjEffOffRecent = teamRecent.off_adj_ppp?.value || teamCalcAdjEffOff;
          const teamCalcAdjEffDefRecent = teamRecent.def_adj_ppp?.value || teamCalcAdjEffDef;

          // Add net if the data is available:
          if (teamBaseline.off_adj_ppp && teamBaseline.def_adj_ppp) {
            teamBaseline.off_net = { value: teamCalcAdjEffOff -  teamCalcAdjEffDef };
          }
          if (teamBaseline.off_ppp && teamBaseline.def_ppp) {
            teamBaseline.def_net = { value: (teamBaseline.off_ppp?.value || 100) - (teamBaseline.def_ppp?.value || 100) };
          }

          // Add other derived stats:
          const extraFields = DerivedStatsUtils.injectTeamDerivedStats(teamBaseline, {});

          // Build all the samples ready for percentiles:
          GradeUtils.buildAndInjectDivisionStats(teamBaseline, extraFields, mutableDivisionStats, inNaturalTier);

          teamStatInfo.push({
            team_name: fullRequestModel.team,
            gender: fullRequestModel.gender,
            year: fullRequestModel.year,
            conf: conference,

            stats: {
              // Subset of baseline team stats
              ...(_.pick(teamBaseline, _.flatMap(["off", "def"], prefix => {
                const fields = [ "adj_ppp", "ppp", "to", "3p", "2p", "3pr", "ftr", "sos" ];
                return fields.map(field => `${prefix}_${field}`);
              }).concat(["tempo"]))),

              // Derived stats
              ...extraFields
            }
          });

          teamInfo.push({
            team_name: fullRequestModel.team,
            gender: fullRequestModel.gender,
            year: fullRequestModel.year,
            conf: conference,
            adj_off: teamAdjOff,
            adj_def: teamAdjDef,
            adj_off_calc: teamCalcAdjEffOff,
            adj_def_calc: teamCalcAdjEffDef,
            adj_off_calc_30d: teamCalcAdjEffOffRecent,
            adj_def_calc_30d: teamCalcAdjEffDefRecent,

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

      // Ready in on-ball defense if it exists
      var onBallDefenseByCode = {} as Record<string, OnBallDefenseModel>;
      if (("all" == label) && (inGender == "Men")) {
        const onBallDefenseLoc = `${process.env.PBP_OUT_DIR}/OnBallDefense/out/${(teamYear || "").substring(0, 4)}/${RequestUtils.fixRosterUrl(team, false)}.txt`;
        const onBallDefenseText = await fs.readFile(
          onBallDefenseLoc
        ).then((s: any) => s.toString()).catch((err: any) => {
          console.log(`Couldn't load [${onBallDefenseLoc}]: [${err}]`);
          return undefined;
        });
        if (onBallDefenseText && !testMode) {
          // Players need code added first, normally happens in buildBaselinePlayerInfo but is needed for "OnBallDefenseUtils.parseContents":
          (rosterBaseline || []).forEach((mutableP: IndivStatSet) => {
            // Code:
            mutableP.code = (mutableP.player_array?.hits?.hits?.[0]?._source?.player?.code || mutableP.key) as PlayerCode;
          })
    
          //Full diag
          //console.log(`Loaded on-ball defense [${onBallDefenseLoc}]: [${onBallDefenseText}]`)

          onBallDefenseByCode = 
            _.chain(OnBallDefenseUtils.parseContents(rosterBaseline, onBallDefenseText).matchedPlayerStats)
              .groupBy(p => p.code).mapValues(l => l[0]!).value();

          console.log(`Incorporated on-ball defense from [${onBallDefenseLoc}] into [${_.size(onBallDefenseByCode)}] players`);
        }
      }
      //(end on ball defense logic)

      const baselinePlayerInfo = LineupTableUtils.buildBaselinePlayerInfo(
        rosterBaseline, globalRosterStatsByCode, teamBaseline, avgEfficiency, true, "baseline", {}, onBallDefenseByCode //(always adjust for luck)
      );
      const positionFromPlayerKey = LineupTableUtils.buildPositionPlayerMap(rosterGlobal, teamSeasonLookup);

      const sortedLineups = LineupTableUtils.buildFilteredLineups(
        lineups,
        "", "desc:off_poss", "0", "500", //take all players (sorted by off_pos) with no min poss - will filter later
        teamSeasonLookup, positionFromPlayerKey
      );

      // Merge ratings and position, and filter based on offensive possessions played
      const enrichedAndFilteredPlayers = _.toPairs(baselinePlayerInfo).filter(kv => {
        const minThreshold = 0.25;
        const player = kv[1];

        const playerPossPct = player.off_team_poss_pct?.value || 0;
        const playerPoss = player.off_team_poss?.value || 0; //(despite it's name this is the player possessions, not team possessions)

        // For teams that have played fewer possessions than others we still have a lower limit
        //TODO: fix the secondary filter _during_ the year
        const secondaryFilter = 
          !DateUtils.isSeasonFinished(teamYear) || (playerPoss > minThreshold*averagePossInCompletedYear);

        return secondaryFilter && (playerPossPct > minThreshold); //(>10mpg)
      }).map((kv: [PlayerId, IndivStatSet]) => {
        const posInfo = positionFromPlayerKey[kv[0]] || {};
        const player = kv[1];

        // Remove offensive luck apart from RAPM (everything else is normalized to data set)
        [ "off_rtg", "off_adj_rtg", "off_adj_prod", "off_efg", "off_3p" ].forEach(field => {
          if (!_.isNil(player[field]?.old_value)) delete player[field]?.old_value; 
          if (!_.isNil(player[field]?.override)) delete player[field]?.override;  
        });
        // Improving wording of explanation of def rtg improvements
        if (player.diag_def_rtg?.onBallDef) {
          [ "def_rtg", "def_adj_rtg", "def_adj_prod", "def_adj_rapm", "def_adj_rapm_prod"  ].forEach(field => {
            if (!_.isNil(player[field])) player[field].extraInfo = 
              "The leaderboard version of this stat has been improved with some pre-processing so may not be identical to the on-demand values eg in the On/Off pages";
          });
        }

        return {
          key: kv[0],
          conf: conference,
          team: team,
          year: teamYear,
          ...posInfo,
          ...(_.chain(kv[1]).toPairs().filter(t2 => //Reduce down to the field we'll actually need
              (
                (t2[0] == "off_team_poss") || (t2[0] == "off_team_poss_pct") ||
                (t2[0] == "def_team_poss") || (t2[0] == "def_team_poss_pct")
              ) || (
                (t2[0] != "diag_off_rtg") &&
                (t2[0] != "diag_def_rtg") &&
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
            if (injectAllRapmForNbaFolks) {
              player.rapm = rapmP.rapm;
            }
            player.off_adj_rapm = rapmP.rapm?.off_adj_ppp;
            player.off_adj_rapm_prod = {
              value: rapmP.rapm!.off_adj_ppp!.value! * player.off_team_poss_pct!.value!
            };
            player.def_adj_rapm = rapmP.rapm?.def_adj_ppp;
            if (player.def_adj_rapm && player.def_adj_rtg?.extraInfo) {
              player.def_adj_rapm.extraInfo = player.def_adj_rtg?.extraInfo; //(since it's used as a prior)
            }
            player.def_adj_rapm_prod = {
              value: rapmP.rapm!.def_adj_ppp!.value! * player.def_team_poss_pct!.value!,
              old_value: (rapmP.rapm?.def_adj_ppp?.old_value || 0) * player.def_team_poss_pct!.value!,
              override: rapmP.rapm?.def_adj_ppp?.override,
              extraInfo: player.def_adj_prod?.extraInfo //(since it's used as a prior)
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
  for (const teamObj of teams) {
    await handleTeam(teamObj, 0);
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

/** Optimizes the data format from D1 stats (export for test only) */
export function completeDivisionStats(mutableUnsortedDivisionStats: DivisionStatistics) {
  // Build LUT  
  GradeUtils.buildAndInjectDivisionStatsLUT(mutableUnsortedDivisionStats);

  return mutableUnsortedDivisionStats; //(for chaining purposes)
};

/** If all 3 exist, combines stats for High/Medium/Low tiers */
export async function combineDivisionStatsFiles() {
  const tiers = [ "High", "Medium", "Low"];
  const filesToCombine: Promise<[String, DivisionStatistics[]]>[] = tiers.map(tier => {
    const divisionStatsInFilename = `./public/leaderboards/lineups/stats_all_${inGender}_${inYear.substring(0, 4)}_${tier}.json`;
    const statsPromise: Promise<[String, DivisionStatistics[]]> = fs.readFile(divisionStatsInFilename).then(buffer => {
      return [
        tier,
        [ JSON.parse(buffer.toString()) as DivisionStatistics ]
      ] as [ string, DivisionStatistics[] ];
    }).catch(err => [ tier,  [] as DivisionStatistics[] ]);
    return statsPromise;
  });
  const resolvedFilesAwait = await Promise.all(filesToCombine);
  const resolvedFiles: Record<string, DivisionStatistics> = 
    _.chain(resolvedFilesAwait)
      .filter(kv => (kv[1].length > 0) && !_.isEmpty(kv[1][0]!.dedup_samples)) //(makes this method idempotent)
      .fromPairs().mapValues(array => array[0]!).value();

  const combineDivisionStats = (toCombine: DivisionStatistics[]) => {
    const allKeys = _.chain(toCombine).flatMap(stats => _.keys(stats.dedup_samples)).value();
    const combinedSamples = _.transform(allKeys, (acc, key) => {

      acc[key] = _.flatMap(toCombine, stat => stat.dedup_samples[key] || []);//(gets re-sorted below)

    }, {} as Record<string, Array<number>>);

    // Build LUT from presorted samples
    return completeDivisionStats({
      tier_sample_size: _.sumBy(toCombine, stats => stats.dedup_sample_size),
      tier_samples: combinedSamples,
      tier_lut: {},
      dedup_sample_size: 0,
      dedup_samples: {}
    });
  };

  const divisionStatsComboFilename = `./public/leaderboards/lineups/stats_all_${inGender}_${inYear.substring(0, 4)}_Combo.json`;
  const combinedFilesPromise = (_.keys(resolvedFiles).length == 3) ? 
    fs.writeFile(
      divisionStatsComboFilename,
      JSON.stringify(combineDivisionStats(_.values(resolvedFiles)), reduceNumberSize)
    ) : Promise.resolve();
    
  await combinedFilesPromise; //(so we'll error out if this step fails - otherwise could lose dedup_samples before using them)

  const filesToOutput =  _.map(resolvedFiles, (stats, tier) => {
    const divisionStatsOutFilename = `./public/leaderboards/lineups/stats_all_${inGender}_${inYear.substring(0, 4)}_${tier}.json`;
    // Remove the dedup_samples since it's now been calculated
    return fs.writeFile(divisionStatsOutFilename, JSON.stringify({ ...stats, dedup_samples: {} }, reduceNumberSize));
  });

  await Promise.all(filesToOutput);

  console.log(`Completed combining stats for [${_.keys(resolvedFiles)}]`);
}

if (!testMode) {

  if (inTier == "Combo") {
    combineDivisionStatsFiles().then(async dummy => {
      console.log("File creation Complete!");
      if (!testMode) { //(ie always)
        console.log("(exiting process)");
        process.exit(0);
      }
    })
  } else {
    main().then(async dummy => {
      const topLineupSize = onlyHasTopConferences ? 300 : 400;
      const topPlayersSize = 1250; //(at 1500 essentially just means the 10mpg is only qualifier)
//TODO: got >5MB body with low tier for 1500 (picked up 1400)      

      console.log("Processing Complete!");

      const outputCases: Array<[string, Array<any>, Array<any>]> =
        [ [ "all", savedLineups, savedPlayers ],
          [ "conf", savedConfOnlyLineups, savedConfOnlyPlayers ],
          [ "t100", savedT100Lineups, savedT100Players ] ];

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

            bubbleOffense: bubbleOffenseInfo,
            bubbleDefense: bubbleDefenseInfo,

            teams: teamInfo
          }, reduceNumberSize)) 
          :
          Promise.resolve();

        const teamStatFilename = `./public/leaderboards/lineups/team_stats_${kv[0]}_${inGender}_${inYear.substring(0, 4)}_${inTier}.json`;
        console.log(`${kv[0]} team stats count: ${teamStatInfo.length}`);
  
        const teamWriteStatPromise = (("all" == kv[0]) && (teamInfo.length > 0)) ? 
          fs.writeFile(`${teamStatFilename}`, JSON.stringify({
            lastUpdated: lastUpdated,
            confMap: mutableConferenceMap,
            confs: _.keys(mutableConferenceMap),  

            teams: teamStatInfo
          }, reduceNumberSize)) 
          :
          Promise.resolve();


        // Division stats:
        if ("all" == kv[0]) completeDivisionStats(mutableDivisionStats);
        const divisionStatsFilename = `./public/leaderboards/lineups/stats_${kv[0]}_${inGender}_${inYear.substring(0, 4)}_${inTier}.json`;
        const divisionStatsWritePromise = ("all" == kv[0]) ? 
          fs.writeFile(divisionStatsFilename, JSON.stringify(mutableDivisionStats, reduceNumberSize)) : Promise.resolve();

        return [lineupsWritePromise, playersWritePromise, teamWritePromise, teamWriteStatPromise, divisionStatsWritePromise];

      //(don't zip, the server/browser does it for us, so it's mainly just "wasting GH space")
      // zlib.gzip(sortedLineupsStr, (_, result) => {
      //   fs.writeFile(`${filename}.gz`,result, err => {});
      // });
      }));
      console.log("File creation Complete!");
      if (!testMode) { //(ie always)
        console.log("(exiting process)");
        process.exit(0);
      }
    });
  }
}