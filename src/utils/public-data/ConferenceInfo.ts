
export const ConferenceToNickname: Record<string, string> = {
  "Power 6 Conferences": "P6",
  "Big Ten Conference": "B1G",
  "Atlantic Coast Conference": "ACC",
  "American Athletic Conference": "AAC",
  "Atlantic 10 Conference": "A10",
  "Big East Conference": "BE",
  "Summit League": "SUM",
  "Big 12 Conference": "B12",
  "Pac 12 Conference": "P12",
  "Southeastern Conference": "SEC",
  "West Coast Conference": "WCC",
  "Mountain West Conference": "MWC"
};

export const NicknameToConference: Record<string, string> = {
  "P6": "Power 6 Conferences",
  "B1G": "Big Ten Conference",
  "ACC": "Atlantic Coast Conference",
  "AAC": "American Athletic Conference",
  "A10": "Atlantic 10 Conference",
  "BE": "Big East Conference",
  "SUM": "Summit League",
  "B12": "Big 12 Conference",
  "P12": "Pac 12 Conference",
  "SEC": "Southeastern Conference",
  "WCC": "West Coast Conference",
  "MWC": "Mountain West Conference"
};

export const Power6Conferences = [ "B1G", "ACC", "BE", "B12", "P12", "SEC" ].map(c => NicknameToConference[c] || c);
