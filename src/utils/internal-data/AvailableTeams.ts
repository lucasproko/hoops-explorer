
export type AvailableTeamMeta = {
  team: string,
  year: string,
  gender: string,
  index_template: string
}

export class AvailableTeams {

  /** A list of all the teams with lineup data available */
  static readonly byName: Record<string, Array<AvailableTeamMeta>> = {
    // Maryland!
    "Maryland": [
      { team: "Maryland", year: "2015/6", gender: "Men", index_template: "maryland" },
      { team: "Maryland", year: "2018/9", gender: "Men", index_template: "misc_conf" },
      { team: "Maryland", year: "2019/20", gender: "Men", index_template: "bigten" },

      { team: "Maryland", year: "2018/9", gender: "Women", index_template: "women_bigten" },
    ],
    // ACC
    "Clemson": [
      { team: "Clemson", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Clemson", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "Georgia Tech": [
      { team: "Georgia Tech", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Georgia Tech", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "Florida St.": [
      { team: "Florida St.", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Florida St.", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "Boston College": [
      { team: "Boston College", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Boston College", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "Wake Forest": [
      { team: "Wake Forest", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Wake Forest", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "North Carolina": [
      { team: "North Carolina", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "North Carolina", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "Virginia": [
      { team: "Virginia", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Virginia", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "Syracuse": [
      { team: "Syracuse", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Syracuse", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "Virginia Tech": [
      { team: "Virginia Tech", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Virginia Tech", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "Duke": [
      { team: "Duke", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Duke", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "Notre Dame": [
      { team: "Notre Dame", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Notre Dame", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "Louisville": [
      { team: "Louisville", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Louisville", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "NC State": [
      { team: "NC State", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "NC State", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "Miami (FL)": [
      { team: "Miami (FL)", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Miami (FL)", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    "Pittsburgh": [
      { team: "Pittsburgh", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Pittsburgh", year: "2019/20", gender: "Men", index_template: "acc" },
    ],
    // American
    "Tulsa": [
      { team: "Tulsa", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Tulsa", year: "2019/20", gender: "Men", index_template: "american" },
    ],
    "South Fla.": [
      { team: "South Fla.", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "South Fla.", year: "2019/20", gender: "Men", index_template: "american" },
    ],
    "Houston": [
      { team: "Houston", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Houston", year: "2019/20", gender: "Men", index_template: "american" },
    ],
    "UCF": [
      { team: "UCF", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "UCF", year: "2019/20", gender: "Men", index_template: "american" },
    ],
    "Cincinnati": [
      { team: "Cincinnati", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Cincinnati", year: "2019/20", gender: "Men", index_template: "american" },
    ],
    "Wichita St.": [
      { team: "Wichita St.", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Wichita St.", year: "2019/20", gender: "Men", index_template: "american" },
    ],
    "Memphis": [
      { team: "Memphis", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Memphis", year: "2019/20", gender: "Men", index_template: "american" },
    ],
    "East Carolina": [
      { team: "East Carolina", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "East Carolina", year: "2019/20", gender: "Men", index_template: "american" },
    ],
    "Tulane": [
      { team: "Tulane", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Tulane", year: "2019/20", gender: "Men", index_template: "american" },
    ],
    "Temple": [
      { team: "Temple", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Temple", year: "2019/20", gender: "Men", index_template: "american" },
    ],
    "SMU": [
      { team: "SMU", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "SMU", year: "2019/20", gender: "Men", index_template: "american" },
    ],
    "UConn": [
      { team: "UConn", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "UConn", year: "2019/20", gender: "Men", index_template: "american" },
    ],
    // Atlantic-10
    "Richmond": [
      { team: "Richmond", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Richmond", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "Dayton": [
      { team: "Dayton", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Dayton", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "La Salle": [
      { team: "La Salle", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "La Salle", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "St. Bonaventure": [
      { team: "St. Bonaventure", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "St. Bonaventure", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "George Washington": [
      { team: "George Washington", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "George Washington", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "Saint Louis": [
      { team: "Saint Louis", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Saint Louis", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "Massachusetts": [
      { team: "Massachusetts", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Massachusetts", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "Fordham": [
      { team: "Fordham", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Fordham", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "George Mason": [
      { team: "George Mason", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "George Mason", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "Saint Joseph's": [
      { team: "Saint Joseph's", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Saint Joseph's", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "VCU": [
      { team: "VCU", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "VCU", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "Davidson": [
      { team: "Davidson", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Davidson", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "Duquesne": [
      { team: "Duquesne", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Duquesne", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    "Rhode Island": [
      { team: "Rhode Island", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Rhode Island", year: "2019/20", gender: "Men", index_template: "atlanticten" },
    ],
    // BIG East
    "Providence": [
      { team: "Providence", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Providence", year: "2019/20", gender: "Men", index_template: "bigeast" },
    ],
    "Villanova": [
      { team: "Villanova", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Villanova", year: "2019/20", gender: "Men", index_template: "bigeast" },
    ],
    "Marquette": [
      { team: "Marquette", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Marquette", year: "2019/20", gender: "Men", index_template: "bigeast" },
    ],
    "DePaul": [
      { team: "DePaul", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "DePaul", year: "2019/20", gender: "Men", index_template: "bigeast" },
    ],
    "Seton Hall": [
      { team: "Seton Hall", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Seton Hall", year: "2019/20", gender: "Men", index_template: "bigeast" },
    ],
    "Xavier": [
      { team: "Xavier", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Xavier", year: "2019/20", gender: "Men", index_template: "bigeast" },
    ],
    "Butler": [
      { team: "Butler", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Butler", year: "2019/20", gender: "Men", index_template: "bigeast" },
    ],
    "St. John's (NY)": [
      { team: "St. John's (NY)", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "St. John's (NY)", year: "2019/20", gender: "Men", index_template: "bigeast" },
    ],
    "Georgetown": [
      { team: "Georgetown", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Georgetown", year: "2019/20", gender: "Men", index_template: "bigeast" },
    ],
    "Creighton": [
      { team: "Creighton", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Creighton", year: "2019/20", gender: "Men", index_template: "bigeast" },
    ],
    // BIG (minus Maryland)
    "Indiana": [
      { team: "Indiana", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Indiana", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Indiana", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    "Nebraska": [
      { team: "Nebraska", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Nebraska", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Nebraska", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    "Wisconsin": [
      { team: "Wisconsin", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Wisconsin", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Wisconsin", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    "Ohio St.": [
      { team: "Ohio St.", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Ohio St.", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Ohio St.", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    "Michigan St.": [
      { team: "Michigan St.", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Michigan St.", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Michigan St.", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    "Iowa": [
      { team: "Iowa", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Iowa", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Iowa", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    "Michigan": [
      { team: "Michigan", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Michigan", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Michigan", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    "Purdue": [
      { team: "Purdue", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Purdue", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Purdue", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    "Illinois": [
      { team: "Illinois", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Illinois", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Illinois", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    "Penn St.": [
      { team: "Penn St.", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Penn St.", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Penn St.", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    "Northwestern": [
      { team: "Northwestern", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Northwestern", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Northwestern", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    "Rutgers": [
      { team: "Rutgers", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Rutgers", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Rutgers", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    "Minnesota": [
      { team: "Minnesota", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Minnesota", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Minnesota", year: "2019/20", gender: "Men", index_template: "bigten" },
    ],
    // BIG 12
    "Texas Tech": [
      { team: "Texas Tech", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Texas Tech", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
    ],
    "Iowa St.": [
      { team: "Iowa St.", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Iowa St.", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
    ],
    "Texas": [
      { team: "Texas", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Texas", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
    ],
    "TCU": [
      { team: "TCU", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "TCU", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
    ],
    "Oklahoma": [
      { team: "Oklahoma", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Oklahoma", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
    ],
    "Baylor": [
      { team: "Baylor", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Baylor", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
    ],
    "Kansas St.": [
      { team: "Kansas St.", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Kansas St.", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
    ],
    "West Virginia": [
      { team: "West Virginia", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "West Virginia", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
    ],
    "Kansas": [
      { team: "Kansas", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Kansas", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
    ],
    "Oklahoma St.": [
      { team: "Oklahoma St.", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Oklahoma St.", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
    ],
    // PAC-12
    "California": [
      { team: "California", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "California", year: "2019/20", gender: "Men", index_template: "pactwelve" },
    ],
    "Oregon St.": [
      { team: "Oregon St.", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Oregon St.", year: "2019/20", gender: "Men", index_template: "pactwelve" },
    ],
    "Washington": [
      { team: "Washington", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Washington", year: "2019/20", gender: "Men", index_template: "pactwelve" },
    ],
    "Arizona St.": [
      { team: "Arizona St.", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Arizona St.", year: "2019/20", gender: "Men", index_template: "pactwelve" },
    ],
    "UCLA": [
      { team: "UCLA", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "UCLA", year: "2019/20", gender: "Men", index_template: "pactwelve" },
    ],
    "Southern California": [
      { team: "Southern California", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Southern California", year: "2019/20", gender: "Men", index_template: "pactwelve" },
    ],
    "Utah": [
      { team: "Utah", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Utah", year: "2019/20", gender: "Men", index_template: "pactwelve" },
    ],
    "Washington St.": [
      { team: "Washington St.", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Washington St.", year: "2019/20", gender: "Men", index_template: "pactwelve" },
    ],
    "Stanford": [
      { team: "Stanford", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Stanford", year: "2019/20", gender: "Men", index_template: "pactwelve" },
    ],
    "Arizona": [
      { team: "Arizona", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Arizona", year: "2019/20", gender: "Men", index_template: "pactwelve" },
    ],
    "Colorado": [
      { team: "Colorado", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Colorado", year: "2019/20", gender: "Men", index_template: "pactwelve" },
    ],
    "Oregon": [
      { team: "Oregon", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Oregon", year: "2019/20", gender: "Men", index_template: "pactwelve" },
    ],
    // SEC
    "Texas A&M": [
      { team: "Texas A&M", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Texas A&M", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "Auburn": [
      { team: "Auburn", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Auburn", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "Ole Miss": [
      { team: "Ole Miss", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Ole Miss", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "Florida": [
      { team: "Florida", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Florida", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "South Carolina": [
      { team: "South Carolina", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "South Carolina", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "Arkansas": [
      { team: "Arkansas", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Arkansas", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "Tennessee": [
      { team: "Tennessee", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Tennessee", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "Georgia": [
      { team: "Georgia", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Georgia", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "Missouri": [
      { team: "Missouri", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Missouri", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "LSU": [
      { team: "LSU", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "LSU", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "Alabama": [
      { team: "Alabama", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Alabama", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "Vanderbilt": [
      { team: "Vanderbilt", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Vanderbilt", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "Kentucky": [
      { team: "Kentucky", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Kentucky", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    "Mississippi St.": [
      { team: "Mississippi St.", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Mississippi St.", year: "2019/20", gender: "Men", index_template: "sec" },
    ],
    // Misc
    "Saint Mary's (CA)": [
      { team: "Saint Mary's (CA)", year: "2018/9", gender: "Men", index_template: "misc_conf" },
      { team: "Saint Mary's (CA)", year: "2019/20", gender: "Men", index_template: "misc_conf" },
    ],
    "Gonzaga": [
      { team: "Gonzaga", year: "2018/9", gender: "Men", index_template: "misc_conf" },
      { team: "Gonzaga", year: "2019/20", gender: "Men", index_template: "misc_conf" }
    ],
  }

  ////////////////////////////////////////////////////////

  // UTILS

  private static flatten(
    arr: Array<Array<AvailableTeamMeta>>
  ): Array<AvailableTeamMeta> {
    return arr.reduce(function(acc, v) {
      return acc.concat(v);
    }, [] as Array<AvailableTeamMeta>);
  }

  static getTeams(
    team: string | null, year: string | null, gender: string | null
  ): Array<AvailableTeamMeta> {
    const list = team ?
      (AvailableTeams.byName[team] || ([] as Array<AvailableTeamMeta>)) :
      AvailableTeams.flatten(Object.values(AvailableTeams.byName));

    return list.filter(function(record) {
      return (!team || (team == record.team)) &&
        (!year || (year == record.year)) && (!gender || (gender == record.gender));
    });
  }
  static getTeam(
    team: string, year: string, gender: string
  ): AvailableTeamMeta | null {
      const retVal = AvailableTeams.getTeams(team, year, gender);
      return (retVal.length > 0) ? retVal[0] : null;
  }
}
