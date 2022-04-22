
// Lodash:
import _ from "lodash";

// Next imports:
import fetch from 'isomorphic-unfetch';
import { ParamDefaults } from "./FilterModels";

/** Information about transfer (typically indexed by player code) */
export type TransferModel = {
   f: string, //(team transferring from)
   t?: string //(team transferring to)
};

export class LeaderboardUtils {

   //////////////////////////////////////

   // Constants

   /** This year is being written to GCS daily, others are no statically part of the website */
   static readonly inSeasonYear = "2022/23";

   /** This year is being written to GCS daily, others are no statically part of the website */
   static readonly offseasonYear = "2021/22";

   /** All years supported by the leaderboard */
   static readonly yearList = [ "2018/9", "2019/20", "2020/21", "2021/22", "Extra" ];

   //////////////////////////////////////
   
   // Top level methods

   /** Get multiple years and tier of player leaderboards, plus transfer info for a given year 
    * Returns a list of JSONs, the last transfersYear.size of which are transfers
   */
   static getMultiYearPlayerLboards(
      dataSubEventKey: "all" | "t100" | "conf",
      gender: string, fullYear: string, tier: string,
      transferYears: string[], otherYears: string[],
   ): Promise<any[]> {
      return LeaderboardUtils.getMultiYearLboards(
         gender, fullYear, tier, transferYears, otherYears,
         (gender: string, subYear: string, inTier: string) => LeaderboardUtils.getPlayerUrl(dataSubEventKey, gender, subYear, inTier)
      );
   }   

   /** Get multiple years and tier of player/lineup leaderboards, plus transfer info for a given year 
    * Returns a list of JSONs, the last transfersYear.size of which are transfers
   */
   private static getMultiYearLboards(
      gender: string, fullYear: string, tier: string,
      transferYears: string[], otherYears: string[],
      getUrl: (gender: string, subYear: string, inTier: string) => string
   ): Promise<any[]> {
      const year = fullYear.substring(0, 4);
   
      const years = _.filter(LeaderboardUtils.yearList, inYear => (year == "All") || (inYear == fullYear) || _.some(otherYears, y => y == inYear));
      const tiers = _.filter([ "High", "Medium", "Low" ], inTier => (tier == "All") || (inTier == tier));
   
      const yearsAndTiers = _.flatMap(years, inYear => tiers.map(inTier => [ inYear, inTier ]));
   
      const fetchAll = Promise.all(yearsAndTiers.map(([ inYear, inTier ]) => {
        const subYear = inYear.substring(0, 4);
        return fetch(getUrl(gender, subYear, inTier))
          .then((response: fetch.IsomorphicResponse) => {
            return response.ok ? 
            response.json().then((j: any) => { //(tag the tier in)
              if (tier == "All") j.tier = inTier;
              return j;
            }) : 
            Promise.resolve({ error: "No data available" });
          });
      }).concat(
         transferYears.map(transferYear => {
            return transferYear ? fetch(`/api/getTransfers?transferMode=${transferYear || ""}`).then((response: fetch.IsomorphicResponse) => {
               return response.ok ? response.json() : Promise.resolve({})
             }) : Promise.resolve({});
         })
      ));  
      return fetchAll;  
   }

   /** Get a single year of player leaderboard for a single tier (mostly for older years when there was only one tier) */
   static getSingleYearPlayerLboards(
      dataSubEventKey: "all" | "t100" | "conf",
      gender: string, fullYear: string, tier: string
   ): Promise<any> {
      return LeaderboardUtils.getSingleYearLboards(
         gender, fullYear, tier, 
         (gender: string, subYear: string, inTier: string) => LeaderboardUtils.getPlayerUrl(dataSubEventKey, gender, subYear, inTier)
      );
   }

   /** Get a single year of player/lineup leaderboard for a single tier (mostly for older years when there was only one tier) */
   private static getSingleYearLboards(
      gender: string, fullYear: string, tier: string,
      getUrl: (gender: string, subYear: string, inTier: string) => string
   ): Promise<any> {
      const year = fullYear.substring(0, 4);

      return fetch(getUrl(gender, year, tier))
         .then((response: fetch.IsomorphicResponse) => {
            return (response.ok ? response.json() : Promise.resolve({ error: "No data available" }))
         });
   }
   
   //////////////////////////////////////
   
   // Lower level utils

   /** Fetch the requested player leaderboard either from GCS or static storage */
   static readonly getPlayerUrl = (oppo: string, gender: string, subYear: string, inTier: string) => {
      if (LeaderboardUtils.inSeasonYear.startsWith(subYear)) { // Access from dynamic storage
        return `/api/getLeaderboard?src=players&oppo=${oppo}&gender=${gender}&year=${subYear}&tier=${inTier}`;
      } else { //archived
        return `/leaderboards/lineups/players_${oppo}_${gender}_${subYear}_${inTier}.json`;
      }
   }
    
   /** Fetch the requested lineup leaderboard either from GCS or static storage */
   static readonly getLineupUrl = (oppo: string, gender: string, subYear: string, inTier: string) => {
      if (LeaderboardUtils.inSeasonYear.startsWith(subYear)) { // Access from dynamic storage
        return `/api/getLeaderboard?src=lineups&oppo=${oppo}&gender=${gender}&year=${subYear}&tier=${inTier}`;
      } else { //archived
        return `/leaderboards/lineups/lineups_${oppo}_${gender}_${subYear}_${inTier}.json`;
      }
   }

   /** Fetch the requested team leaderboard either from GCS or static storage */
   static readonly getTeamUrl = (oppo: string, gender: string, subYear: string, inTier: string) => {
      if (LeaderboardUtils.inSeasonYear.startsWith(subYear)) { // Access from dynamic storage
        return `/api/getLeaderboard?src=teams&oppo=${oppo}&gender=${gender}&year=${subYear}&tier=${inTier}`;
      } else { //archived
        return `/leaderboards/lineups/teams_${oppo}_${gender}_${subYear}_${inTier}.json`;
      }
   }
  
   /** Get the previous season */
   static readonly getPrevYear = (y: string) => {
      if (y == "2022/23") {
         return "2021/22";
      } else if (y == "2021/22") { //TODO: From 2020/21 onwards can calculate
         return "2020/21";
      } else if (y == "2020/21") {
         return "2019/20";
      } else if (y == "2019/20") {
         return "2018/9";
      } else { // older, we'll show the historical data I've pulled
         return "Extra";
      }
   }
   /** Get the next season */
   static readonly getNextYear = (y: string) => {
      if (y == "2021/22") { 
         return "2022/23";
      } else if (y == "2020/21") { //TODO: From 2020/21 onwards can calculate
         return "2021/22";
      } else if (y == "2019/20") {
         return "2020/21";
      } else if (y == "2018/9") {
         return "2019/20";
      } else if (y == "Extra") {
         return "2018/9";
      } else {
         return "None";
      }
   }
   /** Get the offseason of the current season */
   static readonly getOffseasonOfYear = (y: string) => {
      if (y == "2021/22") { //TODO: can calculate programmatically
         return "2022";
      } else if (y == "2020/21") {
         return "2021";
      } else if (y == "2019/20") {
         return "2020";
      } else {
         return undefined;
      }
   }
}