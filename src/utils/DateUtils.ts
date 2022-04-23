import { dataLastUpdated } from "./internal-data/dataLastUpdated";

/** Keep all the constants and useful manipulation methods for dates in one place  */
export class DateUtils {

   // Constants

   //////////////////////////////////////

   /** This year is being written to GCS daily, others are statically part of the website */
   static readonly inSeasonYear = "2022/23";

   /** During the season, this is the next off-season. During the off-season, this is the _current_ off-season */
   static readonly offseasonYear = "2021/22";

   /** All years supported by the leaderboard */
   static readonly lboardYearList = [ "2018/9", "2019/20", "2020/21", "2021/22", "Extra" ];

   private static readonly seasonNotFinished: Record<string, boolean> = {
      "Men_2022/23": true,
      "Women_2022/23": true
   };

   /** Used for defaults for everything but leaderboards (which get updated later) */
   static readonly mostRecentYearWithData = "2021/22";

   /** Used for leaderboard defaults, which lags behind (player + lineups, currently teams but that might change later) */
   static readonly mostRecentYearWithLboardData = "2021/22";

   /** Don't want to use current year for test logic, so pick a recent previous year - changing this will need all the test artefacts to be changed */
   static readonly yearToUseForTests = "2020/21";

   /** Can use (year < yearFromWhichAllMenD1Imported) to identify years with only the T100 or so seasons */
   static readonly yearFromWhichAllMenD1Imported = "2020/21";

   /** Eg estimated possession counts are smaller this season */
   static readonly covidSeason = "2020/21";

   //////////////////////////////////////

   // Methods

   /** Is the season ongoing */
   static readonly isSeasonFinished = (genderYear: string) => DateUtils.getEndOfRegSeason(genderYear) != undefined;

   /** Approx 20d before the end of the actual season (genderYear format is `${gender}_${year}`) */
   static readonly getEndOfRegSeason = (genderYear: string) => 
      DateUtils.seasonNotFinished[genderYear] ? undefined : (dataLastUpdated[genderYear]! - 20*24*3600);   

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