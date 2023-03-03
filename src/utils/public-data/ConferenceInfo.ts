
import _ from "lodash";

export const NonP6Nick = "MM";
export const P6Nick = "P6"

/** Note these use the KenPom naming conventions */
export const ConferenceToNickname: Record<string, string> = {
  "Power 6 Conferences": P6Nick,
  "Outside The P6": NonP6Nick,
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
    (confNick == NonP6Nick || confNick == P6Nick || HighMajorConfs.has(conf)) ? [] : [ conf ]).value();

/** high / midhigh / mid / midlow / low doesn't seem quite granular enough in practice, plus  */    
export const confAdjustments = {
  "horizon": -1, //"mid" seems way too high
};
export const getConfAdjustment = (confStr: string, year: string) => {
  if (confStr == "horizon") {
    return -1; //"mid" seems way too high
  } else if (confStr == "atlanticsun") {
    return +0.5; //"low" seems harsh, has often been better than that
  }else if (confStr == "wac") {
    return +0.5; //"midlow" seems too low, has been mad but also in mid territory often
  } else if (confStr == "americaeast") {
    return +0.5; //"low" seems too low, pretty close to horizon
  } else if (confStr == "socon") {
    return +1.0; //"midlow" - socon have beeen reasonably middle of the road mid major for a while
  } else if (confStr == "maac") {
    return +0.5; //"midlow" - have had some bad years but also decent
  } else if (confStr == "sunbelt") {
    return -0.5; //"mid", one of the weaker mid majors
  } else if (confStr == "ivy") {
    return -0.5; //"mid", one of the weaker mid majors
  } else if (confStr == "bigwest") {
    return -0.5; //"mid", one of the weaker mid majors
  } else if (confStr == "summit") {
    return -0.5; //"mid", one of the weaker mid majors
  }
  return 0;
}

/** Currently for 22/23 offseason - conf changes that I won't pick up until I build the pre-season ingest lineup 
 * h/t Jun 2022: https://medium.com/run-it-back-with-zach/conference-realignment-all-the-moves-coming-in-2022-25-130ef706da55
*/
export const latestConfChanges = {

  "2022/3": {
    // Sun Belt
    "James Madison": "Sun Belt Conference", //(CAA)
    "Marshall": "Sun Belt Conference", //(C-USA)
    "Old Dominion": "Sun Belt Conference", //(C-USA)
    "Southern Miss.": "Sun Belt Conference", //(C-USA)

    // Atlantic Sun
    "Austin Peay": "ASUN Conference", //(OVC)
    // (Queens from D2)

    // Western Athletic Conference
    
    "Southern Utah": "Western Athletic Conference", //(bigsky)
    "UT Arlington": "Western Athletic Conference", //(sunbelt)
    // 2023?: "UIW": "Western Athletic Conference", //(southland)


    // Colonial Athletic Association
    "Hampton": "Colonial Athletic Association", //(bigsouth)
    "Monmouth": "Colonial Athletic Association", //(maac)
    "N.C. A&T": "Colonial Athletic Association", //(bigsouth)
    "Stony Brook": "Colonial Athletic Association", //(americaeast)

    // Atlantic 10 Conference
    "Loyola Chicago": "Atlantic 10 Conference", //(mvc)

    // Ohio Valley Conference
    "Little Rock": "Ohio Valley Conference", //(sunbelt)
    // (Lindenwood, Southern Indiana from D2)

    // Missouri Valley Conference
    "Belmont": "Missouri Valley Conference", //(ovc)
    "UIC": "Missouri Valley Conference", //(horizon)
    "Murray St.": "Missouri Valley Conference", //(ovc)

    //Metro Atlantic Athletic Conference
    "Mount St. Mary's": "Metro Atlantic Athletic Conference", //(nec)

    // America East Conference
    "Bryant": "America East Conference", //(nec)

    // Northeast Conference
    // (Stonehill from D2)
  },

  "2023/4": {
    // Conference USA
    //2023: "Jacksonville St.": "Conference USA",
    //2023: "Liberty": "Conference USA",
    //2023: "New Mexico St.": "Conference USA",
    //2023: "Sam Houston": "Conference USA",


    // Western Athletic Conference
    
    // 2023?: "UIW": "Western Athletic Conference", //(southland)

    //Southland
    //2023: "Lamar University": "Southland Conference",
    // (Texas A&M-Commerce from D2)  

  }

} as Record<string, Record<string, string>>;