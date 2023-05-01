import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import _ from "lodash";
import fs from 'fs';
import OffSeasonLeaderboardTable from '../components/OffseasonLeaderboardTable';
import { DateUtils } from '../utils/DateUtils';
import { OffseasonLeaderboardParams, TeamEditorParams } from '../utils/FilterModels';


/** Run "BUILD_OFFSEASON_STATS_LEADERBOARD=true npm run test src/__tests__/buildOffseasonStatsLeaderboard.test.ts" to build 
 * After copying "transfers_${offseasonYearStr}" to working dir
 */
describe("buildOffseasonStatsLeaderboards", () => {
   if (process.env.BUILD_OFFSEASON_STATS_LEADERBOARD == "true") {
      test("create offseason stats leaderboard ", async () => {
         const currYear = DateUtils.mostRecentYearWithLboardData;
         const nextYear = DateUtils.offseasonPredictionYear;
         const olderYear = DateUtils.getPrevYear(currYear);
         const currYearStr = currYear.substring(0, 4);
         const nextYearStr = nextYear.substring(0, 4);
         const olderYearStr = olderYear.substring(0, 4);
         const tierList = [ "High", "Medium", "Low" ];
         const { players, teams } = _.transform(tierList, (acc, v) => {
            const sampleData = JSON.parse( //TODO: need all here...
               fs.readFileSync(`./public/leaderboards/lineups/players_all_Men_${currYearStr}_${v}.json`, { encoding: "utf-8"})
            );
            const sampleTeamData = JSON.parse(
               fs.readFileSync(`./public/leaderboards/lineups/team_stats_all_Men_${currYearStr}_${v}.json`, { encoding: "utf-8"})
            );
            const sampleDataOlder = JSON.parse(
               fs.readFileSync(`./public/leaderboards/lineups/players_all_Men_${olderYearStr}_${v}.json`, { encoding: "utf-8"})
            );         
            acc.players = (sampleData.players || []).concat(sampleDataOlder.players || []);
            acc.teams = (sampleData.teams || []).concat(sampleDataOlder.teams || []);
         }, {
            players: [], teams: []
         });
         // Load in data sample:
         const transferData = JSON.parse(fs.readFileSync(`./transfers_${nextYearStr}.json`, { encoding: "utf-8"}));     
         const transferDataOlder = JSON.parse(fs.readFileSync(`./public/leaderboards/roster_movement/transfers_${currYearStr}.json`, { encoding: "utf-8"}));     
         const twoYears = {
            ...{}, //TODO: used to be sample data
            players: players,
            teamStats: teams,
            transfers: [ transferData, transferDataOlder],
          };
          const dummyChangeStateCallback = (stats: TeamEditorParams) => {};
          const wrapper = shallow(
            <OffSeasonLeaderboardTable
               startingState={{
                  year: DateUtils.offseasonPredictionYear, 
               } as OffseasonLeaderboardParams}
               dataEvent={twoYears}
               onChangeState={dummyChangeStateCallback}
            />
         );
         toJson(wrapper);
         //(no expectations, but the Preseason stats file is now TODO)
      });
   } else {
      test("(Skipping buildOffseasonStatsLeaderboards, not manually specified)", async () => {
         //(do nothing this is just so that the suite has a test in it, otherwise jest errors)
      });
   }
});
 