
import _ from "lodash";

/** Note these use the KenPom naming conventions */
export const ConferenceToNickname: Record<string, string> = {
  "Power 6 Conferences": "P6",
  "Outside The P6": "MM",
  "American Athletic Conference": "AAC",
  "America East Conference": "AE",
  "Atlantic Coast Conference": "ACC",
  "ASUN Conference": "ASUN",
  "Atlantic 10 Conference": "A10",
  "Big East Conference": "BE",
  "Big Sky Conference": "BSKY",
  "Big South Conference": "BSO",
  "Big Ten Conference": "B1G",
  "Big 12 Conference": "B12",
  "Big West Conference": "BW",
  "Colonial Athletic Association": "CAA",
  "Conference USA": "CUSA",
  "Horizon League": "HOR",
  "Ivy League": "IVY",
  "Mid American Conference": "MAC",
  "Metro Atlantic Athletic Conference": "MAAC",
  "Mid-Eastern Athletic Conference": "MEAC",
  "Mountain West Conference": "MWC",
  "Missouri Valley Conference": "MVC",
  "Northeast Conference": "NEC",
  "Ohio Valley Conference": "OVC",
  "Pac 12 Conference": "P12",
  "Patriot League": "PAT",
  "Southeastern Conference": "SEC",
  "Southern Conference": "SOCON",
  "Southland Conference": "SLND",
  "Summit League": "SUM",
  "Sun Belt Conference": "SBLT",
  "Southwestern Athletic Conference": "SWAC",
  "Western Athletic Conference": "WAC",
  "West Coast Conference": "WCC",
};

export const HighMajorConfs: Set<String> = new Set(
  [ "Atlantic Coast Conference", "Big 12 Conference", "Big East Conference", "Big Ten Conference", "Pac 10 Conference", "Pac 12 Conference", "Southeastern Conference"]
);

export const NicknameToConference: Record<string, string> =
  _.chain(ConferenceToNickname).toPairs().map(kv => [ kv[1], kv[0] ]).fromPairs().value();

export const Power6ConferencesNicks = [ "B1G", "ACC", "BE", "B12", "P12", "SEC" ];
export const Power6Conferences = Power6ConferencesNicks.map(c => NicknameToConference[c] || c);

export const NonP6Conferences = 
  _.chain(ConferenceToNickname).flatMap((confNick, conf) => 
    (confNick == "MM" || confNick == "P6" || HighMajorConfs.has(conf)) ? [] : [ conf ]).value();

/** Currently for 22/23 offseason - conf changes that I won't pick up until I build the pre-season ingest lineup 
 * h/t Jun 2022: https://medium.com/run-it-back-with-zach/conference-realignment-all-the-moves-coming-in-2022-25-130ef706da55
*/
export const latestConfChanges = {

  // Sun Belt
  "James Madison": "Sun Belt Conference",
  "Marshall": "Sun Belt Conference",
  "Old Dominion": "Sun Belt Conference",
  "Southern Miss.": "Sun Belt Conference",

  // Conference USA
  //2023: "Jacksonville St.": "Conference USA",
  //2023: "Liberty": "Conference USA",
  //2023: "New Mexico St.": "Conference USA",
  //2023: "Sam Houston": "Conference USA",

  // Atlantic Sun
  "Austin Peay": "ASUN Conference",
  // (Queens from D2)

  // Western Athletic Conference
  "UIW": "Western Athletic Conference",
  "Southern Utah": "Western Athletic Conference",
  "UT Arlington": "Western Athletic Conference",

  // Colonial Athletic Association
  "Hampton": "Colonial Athletic Association",
  "Monmouth": "Colonial Athletic Association",
  "N.C. A&T": "Colonial Athletic Association",
  "Stony Brook": "Colonial Athletic Association",

  // Missouri Valley Conference
  "Belmont": "Missouri Valley Conference",
  "UIC": "Missouri Valley Conference",
  "Murray St.": "Missouri Valley Conference",

  // Atlantic 10 Conference
  "Loyola Chicago": "Atlantic 10 Conference",

  // Ohio Valley Conference
  "Little Rock": "Ohio Valley Conference",
  // (Lindenwood, Southern Indiana from D2)

  //Southland
  //2023: "Lamar University": "Southland Conference",
  // (Texas A&M-Commerce from D2)  

  //Metro Atlantic Athletic Conference
  "Mount St. Mary's": "Metro Atlantic Athletic Conference",

  // America East Conference
  "Bryant": "America East Conference",

  // Northeast Conference
  // (Stonehill from D2)

} as Record<string, string>;