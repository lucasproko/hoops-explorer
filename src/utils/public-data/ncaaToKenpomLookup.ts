
import _ from "lodash";

/** The NCAA name to KenPom name mappings, built in 2020, can have per year changes */

/* For the current year only - this is maintained in the Efficiency spreadsheet for earlier years */

const ncaaToKenpomLookup_2021_22: Record<string, Record<string, string>> = {
   "Charleston": {
      "NCAA_name": "Col. of Charleston"
   },
   "Grambling St.": {
      "NCAA_name": "Grambling"
   },
   "Arkansas Pine Bluff": {
      "NCAA_name": "Ark.-Pine Bluff"
   },
   "Detroit": {
      "NCAA_name": "Detroit Mercy"
   },
   "Northern Iowa": {
      "NCAA_name": "UNI"
   },
   "Central Arkansas": {
      "NCAA_name": "Central Ark."
   },
   "Texas A&M Corpus Chris": {
      "NCAA_name": "A&M-Corpus Christi"
   },
   "Loyola MD": {
      "NCAA_name": "Loyola Maryland"
   },
   "Miami OH": {
      "NCAA_name": "Miami (OH)"
   },
   "North Alabama": {
      "NCAA_name": "North Ala."
   },
   "Bethune Cookman": {
      "NCAA_name": "Bethune-Cookman"
   },
   "Cal St. Bakersfield": {
      "NCAA_name": "CSU Bakersfield"
   },
   "St. Francis NY": {
      "NCAA_name": "St. Francis Brooklyn"
   },
   "Florida Atlantic": {
      "NCAA_name": "Fla. Atlantic"
   },
   "East Tennessee St.": {
      "NCAA_name": "ETSU"
   },
   "Central Connecticut": {
      "NCAA_name": "Central Conn. St."
   },
   "Western Illinois": {
      "NCAA_name": "Western Ill."
   },
   "Northern Colorado": {
      "NCAA_name": "Northern Colo."
   },
   "Northern Kentucky": {
      "NCAA_name": "Northern Ky."
   },
   "Southeast Missouri St.": {
      "NCAA_name": "Southeast Mo. St."
   },
   "Maryland Eastern Shore": {
      "NCAA_name": "UMES"
   },
   "South Florida": {
      "NCAA_name": "South Fla."
   },
   "Nicholls St.": {
      "NCAA_name": "Nicholls"
   },
   "Miami FL": {
      "NCAA_name": "Miami (FL)"
   },
   "Appalachian St.": {
      "NCAA_name": "App State"
   },
   "Southern": {
      "NCAA_name": "Southern U."
   },
   "Albany": {
      "NCAA_name": "Albany (NY)"
   },
   "N.C. State": {
      "NCAA_name": "NC State"
   },
   "Tennessee Martin": {
      "NCAA_name": "UT Martin"
   },
   "Western Kentucky": {
      "NCAA_name": "Western Ky."
   },
   "Eastern Kentucky": {
      "NCAA_name": "Eastern Ky."
   },
   "Prairie View A&M": {
      "NCAA_name": "Prairie View"
   },
   "Army": {
      "NCAA_name": "Army West Point"
   },
   "Seattle": {
      "NCAA_name": "Seattle U"
   },
   "Mississippi Valley St.": {
      "NCAA_name": "Mississippi Val."
   },
   "Southeastern Louisiana": {
      "NCAA_name": "Southeastern La."
   },
   "Auburn": {
      "NCAA_name": "Auburn"
   },
   "Cal St. Northridge": {
      "NCAA_name": "CSUN"
   },
   "Western Michigan": {
      "NCAA_name": "Western Mich."
   },
   "Sam Houston St.": {
      "NCAA_name": "Sam Houston"
   },
   "Saint Mary's": {
      "NCAA_name": "Saint Mary's (CA)"
   },
   "Boston University": {
      "NCAA_name": "Boston U."
   },
   "Alcorn St.": {
      "NCAA_name": "Alcorn"
   },
   "Mississippi": {
      "NCAA_name": "Ole Miss"
   },
   "St. Francis PA": {
      "NCAA_name": "Saint Francis (PA)"
   },
   "DePaul": {
      "NCAA_name": "DePaul"
   },
   "SIU Edwardsville": {
      "NCAA_name": "SIUE"
   },
   "Connecticut": {
      "NCAA_name": "UConn"
   },
   "Purdue Fort Wayne": {
      "NCAA_name": "Purdue Fort Wayne"
   },
   "Eastern Illinois": {
      "NCAA_name": "Eastern Ill."
   },
   "Incarnate Word": {
      "NCAA_name": "UIW"
   },
   "Southern Miss": {
      "NCAA_name": "Southern Miss."
   },
   "North Carolina Central": {
      "NCAA_name": "N.C. Central"
   },
   "Northern Arizona": {
      "NCAA_name": "Northern Ariz."
   },
   "Louisiana Monroe": {
      "NCAA_name": "ULM"
   },
   "Eastern Washington": {
      "NCAA_name": "Eastern Wash."
   },
   "Charleston Southern": {
      "NCAA_name": "Charleston So."
   },
   "Florida Gulf Coast": {
      "NCAA_name": "FGCU"
   },
   "Southern Illinois": {
      "NCAA_name": "Southern Ill."
   },
   "North Carolina A&T": {
      "NCAA_name": "N.C. A&T"
   },
   "UMKC": {
      "NCAA_name": "Kansas City"
   },
   "Gardner Webb": {
      "NCAA_name": "Gardner-Webb"
   },
   "Stephen F. Austin": {
      "NCAA_name": "SFA"
   },
   "Denver": {
      "NCAA_name": "Denver"
   },
   "Nebraska Omaha": {
      "NCAA_name": "Omaha"
   },
   "UT Rio Grande Valley": {
      "NCAA_name": "UTRGV"
   },
   "Cal Baptist": {
      "NCAA_name": "California Baptist"
   },
   "USC": {
      "NCAA_name": "Southern California"
   },
   "McNeese St.": {
      "NCAA_name": "McNeese"
   },
   "UNC Wilmington": {
      "NCAA_name": "UNCW"
   },
   "St. John's": {
      "NCAA_name": "St. John's (NY)"
   },
   "Western Carolina": {
      "NCAA_name": "Western Caro."
   },
   "Eastern Michigan": {
      "NCAA_name": "Eastern Mich."
   },
   "Central Michigan": {
      "NCAA_name": "Central Mich."
   },
   "Lamar": {
      "NCAA_name": "Lamar University"
   },
   "Loyola Marymount": {
      "NCAA_name": "LMU (CA)"
   },
   "Middle Tennessee": {
      "NCAA_name": "Middle Tenn."
   },
   "Georgia Southern": {
      "NCAA_name": "Ga. Southern"
   },
   "Northern Illinois": {
      "NCAA_name": "Northern Ill."
   },
   "LIU": {
      "NCAA_name": "LIU"
   },
   "Illinois Chicago": {
      "NCAA_name": "UIC"
   }
};

//TODO: need to check what names have changed in KP/NCAA for 2022/23
const ncaaToKenpomLookup_2022_23: Record<string, Record<string, string>> = ncaaToKenpomLookup_2021_22;

/** Contains NCAA/KP lookups for gender/years where we want to retrieve efficiency from the cache (current year only) */
export const ncaaToKenpomLookup: Record<string, Record<string, Record<string, string>>> = {
   "Men_2021/22": ncaaToKenpomLookup_2021_22, //TODO: when can I remove this?
   "Men_2022/23": ncaaToKenpomLookup_2022_23,
};
