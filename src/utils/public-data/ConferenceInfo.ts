
import _ from "lodash";

/** Note these use the KenPom naming conventions */
export const ConferenceToNickname: Record<string, string> = {
  "Power 6 Conferences": "P6",
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
