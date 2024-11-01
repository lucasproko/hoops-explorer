import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import _ from "lodash";
import fs from "fs";
import OffSeasonLeaderboardTable from "../components/OffseasonLeaderboardTable";
import { DateUtils } from "../utils/DateUtils";
import {
  OffseasonLeaderboardParams,
  TeamEditorParams,
} from "../utils/FilterModels";

/** Run "BUILD_OFFSEASON_STATS_LEADERBOARD=true npm run test src/__tests__/buildOffseasonStatsLeaderboard.test.ts  -- --coverage=false" to build
 * After copying "transfers_${offseasonYearStr}" to working dir
 * Also run with "BUILD_OFFSEASON_ROSTER=true" to enrich the following year's roster data with roles from
 * the previous year
 */
describe("buildOffseasonStatsLeaderboards", () => {
  if (process.env.BUILD_OFFSEASON_STATS_LEADERBOARD == "true") {
    test("create offseason stats leaderboard ", async () => {
      // Simulate OffseasonLeaderboard.tsx
      const currYear = DateUtils.mostRecentYearWithLboardData;
      const nextYear = DateUtils.offseasonPredictionYear;
      // For regenerating previous years:
      // const currYear = "2021/22";
      // const nextYear = "2022/23";

      const olderYear = DateUtils.getPrevYear(currYear);
      const currYearStr = currYear.substring(0, 4);
      const nextYearStr = nextYear.substring(0, 4);
      const olderYearStr = olderYear.substring(0, 4);
      const tierList = ["High", "Medium", "Low"];
      const { players, playersOld, teams, confs } = _.transform(
        tierList,
        (acc, v) => {
          const sampleData = JSON.parse(
            fs.readFileSync(
              `./public/leaderboards/lineups/players_all_Men_${currYearStr}_${v}.json`,
              { encoding: "utf-8" }
            )
          );
          const lowVolSampleData = JSON.parse(
            fs.readFileSync(
              `./public/leaderboards/lineups/players_lowvol_Men_${currYearStr}_${v}.json`,
              { encoding: "utf-8" }
            )
          );
          _.forEach(sampleData.players || [], (p: any) => {
            p.tier = v;
          });
          _.forEach(lowVolSampleData.players || [], (p: any) => {
            p.tier = v;
          });
          const sampleTeamData = JSON.parse(
            fs.readFileSync(
              `./public/leaderboards/lineups/team_stats_all_Men_${currYearStr}_${v}.json`,
              { encoding: "utf-8" }
            )
          );
          const sampleDataOlder = JSON.parse(
            fs.readFileSync(
              `./public/leaderboards/lineups/players_all_Men_${olderYearStr}_${v}.json`,
              { encoding: "utf-8" }
            )
          );
          const lowVolSampleDataOlder = JSON.parse(
            fs.readFileSync(
              `./public/leaderboards/lineups/players_lowvol_Men_${olderYearStr}_${v}.json`,
              { encoding: "utf-8" }
            )
          );
          _.forEach(sampleDataOlder.players || [], (p: any) => {
            p.tier = v;
          });
          acc.players = acc.players
            .concat(sampleData.players || [])
            .concat(lowVolSampleData.players || []);
          acc.playersOld = acc.playersOld
            .concat(sampleDataOlder.players || [])
            .concat(lowVolSampleDataOlder.players || []);
          acc.teams = acc.teams.concat(sampleTeamData.teams || []);
          acc.confs = acc.confs
            .concat(sampleData.confs || [])
            .concat(sampleDataOlder.confs || []);
        },
        {
          players: [],
          playersOld: [],
          teams: [],
          confs: [],
        }
      );

      // Load in data sample:
      const transferData = JSON.parse(
        fs.readFileSync(`./transfers_${nextYearStr}.json`, {
          encoding: "utf-8",
        })
      );
      const transferDataOlder = JSON.parse(
        fs.readFileSync(
          `./public/leaderboards/roster_movement/transfers_${currYearStr}.json`,
          { encoding: "utf-8" }
        )
      );
      const twoYears = {
        players: playersOld.concat(players),
        teamStats: teams,
        confs: _.uniq(confs),
        transfers: [transferData, transferDataOlder],
        lastUpdated: 0,
      };
      const dummyChangeStateCallback = (stats: TeamEditorParams) => {};
      shallow(
        <OffSeasonLeaderboardTable
          startingState={
            {
              //(all defaults, except:)
              year: nextYear,
            } as OffseasonLeaderboardParams
          }
          dataEvent={twoYears}
          onChangeState={dummyChangeStateCallback}
        />
      );
      //(no expectations, but the Preseason stats file is now [./stats_all_Men_${year.substring(0, 4)}_Preseason.json]])
    });
  } else {
    test("(Skipping buildOffseasonStatsLeaderboards, not manually specified)", async () => {
      //(do nothing this is just so that the suite has a test in it, otherwise jest errors)
    });
  }
});
