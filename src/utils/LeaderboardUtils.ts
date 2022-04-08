
// Lodash:
import _ from "lodash";

// Next imports:
import fetch from 'isomorphic-unfetch';
import { ParamDefaults } from "./FilterModels";

export class LeaderboardUtils {

   // Top level methods

   /** Get multiple years and tier of player leaderboards, plus transfer info for a given year */
   static getMultiYearPlayerLboards(
      dataSubEventKey: string,
      gender: string, fullYear: string, tier: string,
      transferYears: string[], getLastYearAlso: boolean,
   ) {
      const year = fullYear.substring(0, 4);
   
      const lastYear = getLastYearAlso ? 
         LeaderboardUtils.getPrevYear(fullYear) : undefined; //always get last year if available TODO not for lboard page
   
      //TODO: need this set of years to be a constant
      const years = _.filter([ "2018/9", "2019/20", "2020/21", "2021/22", "Extra" ], inYear => (year == "All") || (inYear == fullYear) || (inYear == lastYear));
      const tiers = _.filter([ "High", "Medium", "Low" ], inTier => (tier == "All") || (inTier == tier));
   
      const yearsAndTiers = _.flatMap(years, inYear => tiers.map(inTier => [ inYear, inTier ]));
   
      const fetchAll = Promise.all(yearsAndTiers.map(([ inYear, inTier ]) => {
        const subYear = inYear.substring(0, 4);
        return fetch(LeaderboardUtils.getPlayerUrl(dataSubEventKey, gender, subYear, inTier))
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
      dataSubEventKey: string,
      gender: string, fullYear: string, tier: string
   ) {
      const year = fullYear.substring(0, 4);

      return fetch(LeaderboardUtils.getPlayerUrl(dataSubEventKey, gender, year, tier))
         .then((response: fetch.IsomorphicResponse) => {
            return (response.ok ? response.json() : Promise.resolve({ error: "No data available" }))
         });
   }

   // Lower level utils

   /** This year is being written to GCS daily, others are no statically part of the website */
   static readonly inSeasonYear = "2022/23";

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
  

   /** Get the previous season */
   static readonly getPrevYear = (y: string) => {
      if (y == "2021/22") { //TODO: From 2020/21 onwards can calculate
         return "2020/21";
      } else if (y == "2020/21") {
         return "2019/20";
      } else if (y == "2019/20") {
         return "2018/9";
      } else { // older, we'll show the historical data I've pulled
         return "Extra";
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