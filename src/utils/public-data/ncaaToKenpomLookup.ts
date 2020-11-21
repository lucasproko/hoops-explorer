
import _ from "lodash";

/** The NCAA name to KenPom name mappings, built in 2020, can have per year changes */

/* REMOVED THIS AND MOVED THE LOOKUP TO THE BUILD LOGIC

export const ncaaToKenpomLookup_2019_20 = {
   "A&M-Corpus Christi": {
      "pbp_kp_team": "Texas A&M Corpus Chris"
   },
   "Albany (NY)": {
      "pbp_kp_team": "Albany"
   },
   "Alcorn": {
      "pbp_kp_team": "Alcorn St."
   },
   "Ark.-Pine Bluff": {
     "pbp_kp_team": "Arkansas Pine Bluff"
   },
   "Army West Point": {
      "pbp_kp_team": "Army"
   },
   "Auburn": {
      "pbp_kp_team": "Auburn"
   },
   "Bethune-Cookman": {
      "pbp_kp_team": "Bethune Cookman"
   },
   "Boston U.": {
      "pbp_kp_team": "Boston University"
   },
   "California Baptist": {
      "pbp_kp_team": "Cal Baptist"
   },
   "Central Ark.": {
      "pbp_kp_team": "Central Arkansas"
   },
   "Central Conn. St.": {
      "pbp_kp_team": "Central Connecticut"
   },
   "Central Mich.": {
      "pbp_kp_team": "Central Michigan"
   },
   "Charleston So.": {
      "pbp_kp_team": "Charleston Southern"
   },
   "Col. of Charleston": {
      "pbp_kp_team": "Charleston"
   },
   "CSU Bakersfield": {
      "pbp_kp_team": "Cal St. Bakersfield"
   },
   "CSUN": {
      "pbp_kp_team": "Cal St. Northridge"
   },
   "Detroit Mercy": {
      "pbp_kp_team": "Detroit"
   },
   "Eastern Ill.": {
      "pbp_kp_team": "Eastern Illinois"
   },
   "Eastern Ky.": {
      "pbp_kp_team": "Eastern Kentucky"
   },
   "Eastern Mich.": {
      "pbp_kp_team": "Eastern Michigan"
   },
   "Eastern Wash.": {
      "pbp_kp_team": "Eastern Washington"
   },
   "ETSU": {
      "pbp_kp_team": "East Tennessee St."
   },
   "FGCU": {
      "pbp_kp_team": "Florida Gulf Coast"
   },
   "Fla. Atlantic": {
      "pbp_kp_team": "Florida Atlantic"
   },
   "Ga. Southern": {
      "pbp_kp_team": "Georgia Southern"
   },
   "Gardner-Webb": {
      "pbp_kp_team": "Gardner Webb"
   },
   "Grambling": {
      "pbp_kp_team": "Grambling St."
   },
   "Kansas City": {
      "pbp_kp_team": "UMKC"
   },
   "La.-Monroe": {
      "pbp_kp_team": "Louisiana Monroe"
   },
   "Lamar University": {
      "pbp_kp_team": "Lamar"
   },
   "LIU": {
      "pbp_kp_team": "LIU"
   },
   "LMU (CA)": {
      "pbp_kp_team": "Loyola Marymount"
   },
   "Loyola Maryland": {
      "pbp_kp_team": "Loyola MD"
   },
   "McNeese": {
      "pbp_kp_team": "McNeese St."
   },
   "Miami (FL)": {
      "pbp_kp_team": "Miami FL"
   },
   "Miami (OH)": {
      "pbp_kp_team": "Miami OH"
   },
   "Middle Tenn.": {
      "pbp_kp_team": "Middle Tennessee"
   },
   "Mississippi Val.": {
      "pbp_kp_team": "Mississippi Valley St."
   },
   "N.C. A&T": {
      "pbp_kp_team": "North Carolina A&T"
   },
   "N.C. Central": {
      "pbp_kp_team": "North Carolina Central"
   },
   "NC State": {
      "pbp_kp_team": "N.C. State"
   },
   "North Ala.": {
      "pbp_kp_team": "North Alabama"
   },
   "Northern Ariz.": {
      "pbp_kp_team": "Northern Arizona"
   },
   "Northern Colo.": {
      "pbp_kp_team": "Northern Colorado"
   },
   "Northern Ill.": {
      "pbp_kp_team": "Northern Illinois"
   },
   "Northern Ky.": {
      "pbp_kp_team": "Northern Kentucky"
   },
   "Ole Miss": {
      "pbp_kp_team": "Mississippi"
   },
   "Omaha": {
      "pbp_kp_team": "Nebraska Omaha"
   },
   "Prairie View": {
      "pbp_kp_team": "Prairie View A&M"
   },
   "Purdue Fort Wayne": { //(this one changed recently)
      "pbp_kp_team": "Purdue Fort Wayne"
   },
   "Saint Francis (PA)": {
      "pbp_kp_team": "St. Francis PA"
   },
   "Saint Mary's (CA)": {
      "pbp_kp_team": "Saint Mary's"
   },
   "Seattle U": {
      "pbp_kp_team": "Seattle"
   },
   "SFA": {
      "pbp_kp_team": "Stephen F. Austin"
   },
   "SIUE": {
      "pbp_kp_team": "SIU Edwardsville"
   },
   "South Fla.": {
      "pbp_kp_team": "South Florida"
   },
   "Southeast Mo. St.": {
      "pbp_kp_team": "Southeast Missouri St."
   },
   "Southeastern La.": {
      "pbp_kp_team": "Southeastern Louisiana"
   },
   "Southern California": {
      "pbp_kp_team": "USC"
   },
   "Southern Ill.": {
      "pbp_kp_team": "Southern Illinois"
   },
   "Southern Miss.": {
      "pbp_kp_team": "Southern Miss"
   },
   "Southern U.": {
      "pbp_kp_team": "Southern"
   },
   "St. Francis Brooklyn": {
      "pbp_kp_team": "St. Francis NY"
   },
   "St. John's (NY)": {
      "pbp_kp_team": "St. John's"
   },
   "UConn": {
      "pbp_kp_team": "Connecticut"
   },
   "UIC": {
      "pbp_kp_team": "Illinois Chicago"
   },
   "UIW": {
      "pbp_kp_team": "Incarnate Word"
   },
   "UMES": {
      "pbp_kp_team": "Maryland Eastern Shore"
   },
   "UNCW": {
      "pbp_kp_team": "UNC Wilmington"
   },
   "UNI": {
      "pbp_kp_team": "Northern Iowa"
   },
   "UT Martin": {
      "pbp_kp_team": "Tennessee Martin"
   },
   "UTRGV": {
      "pbp_kp_team": "UT Rio Grande Valley"
   },
   "Western Caro.": {
      "pbp_kp_team": "Western Carolina"
   },
   "Western Ill.": {
      "pbp_kp_team": "Western Illinois"
   },
   "Western Ky.": {
      "pbp_kp_team": "Western Kentucky"
   },
   "Western Mich.": {
      "pbp_kp_team": "Western Michigan"
   }
};

export const ncaaToKenpomLookup_2018_19 = _.assign(_.cloneDeep(ncaaToKenpomLookup_2019_20), {
  "NC State": {
     "pbp_kp_team": "North Carolina St."
  },
  "LIU": {
     "pbp_kp_team": "LIU Brooklyn"
  }
});

export const ncaaToKenpomLookup_2017_18 = _.assign(_.cloneDeep(ncaaToKenpomLookup_2018_19), {
  "Col. of Charleston": {
     "pbp_kp_team": "College of Charleston"
  },
  "Purdue Fort Wayne": {
     "pbp_kp_team": "Fort Wayne"
  },
});

export const ncaaToKenpomLookup_2016_17 = ncaaToKenpomLookup_2017_18;

export const ncaaToKenpomLookup_2015_16 = _.assign(_.cloneDeep(ncaaToKenpomLookup_2016_17), {
  "Purdue Fort Wayne": {
     "pbp_kp_team": "IPFW"
  },
});

export const ncaaToKenpomLookup_2014_15 = ncaaToKenpomLookup_2015_16;

*/
