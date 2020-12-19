
export type AvailableTeamMeta = {
  team: string,
  year: string,
  gender: string,
  index_template: string
}

export class AvailableTeams {

  static readonly defaultConfIndex = "misc_conf";

  static readonly extraTeamName = "Extra";

  /** A list of all the teams with lineup data available */
  static readonly byName: Record<string, Array<AvailableTeamMeta>> = {
    // Maryland!
    "Maryland": [
      { team: "Maryland", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Maryland", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Maryland", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Maryland", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Maryland", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Maryland", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    // ACC
    "Clemson": [
      { team: "Clemson", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Clemson", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Clemson", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Clemson", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Clemson", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Clemson", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "Georgia Tech": [
      { team: "Georgia Tech", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Georgia Tech", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Georgia Tech", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Georgia Tech", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Georgia Tech", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Georgia Tech", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "Florida St.": [
      { team: "Florida St.", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Florida St.", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Florida St.", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Florida St.", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Florida St.", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Florida St.", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "Boston College": [
      { team: "Boston College", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Boston College", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Boston College", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Boston College", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Boston College", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Boston College", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "Wake Forest": [
      { team: "Wake Forest", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Wake Forest", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Wake Forest", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Wake Forest", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Wake Forest", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Wake Forest", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "North Carolina": [
      { team: "North Carolina", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "North Carolina", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "North Carolina", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "North Carolina", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "North Carolina", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "North Carolina", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "Virginia": [
      { team: "Virginia", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Virginia", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Virginia", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Virginia", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Virginia", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Virginia", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "Syracuse": [
      { team: "Syracuse", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Syracuse", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Syracuse", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Syracuse", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Syracuse", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Syracuse", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "Virginia Tech": [
      { team: "Virginia Tech", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Virginia Tech", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Virginia Tech", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Virginia Tech", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Virginia Tech", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Virginia Tech", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "Duke": [
      { team: "Duke", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Duke", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Duke", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Duke", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Duke", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Duke", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "Notre Dame": [
      { team: "Notre Dame", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Notre Dame", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Notre Dame", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Notre Dame", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Notre Dame", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Notre Dame", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "Louisville": [
      { team: "Louisville", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Louisville", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Louisville", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Louisville", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Louisville", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Louisville", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "NC State": [
      { team: "NC State", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "NC State", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "NC State", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "NC State", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "NC State", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "NC State", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "Miami (FL)": [
      { team: "Miami (FL)", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Miami (FL)", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Miami (FL)", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Miami (FL)", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Miami (FL)", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Miami (FL)", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    "Pittsburgh": [
      { team: "Pittsburgh", year: "2018/9", gender: "Men", index_template: "acc" },
      { team: "Pittsburgh", year: "2019/20", gender: "Men", index_template: "acc" },
      { team: "Pittsburgh", year: "2020/21", gender: "Men", index_template: "acc" },

      { team: "Pittsburgh", year: "2018/9", gender: "Women", index_template: "women_acc" },
      { team: "Pittsburgh", year: "2019/20", gender: "Women", index_template: "women_acc" },
      { team: "Pittsburgh", year: "2020/21", gender: "Women", index_template: "women_acc" },
    ],
    // American
    "Tulsa": [
      { team: "Tulsa", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Tulsa", year: "2019/20", gender: "Men", index_template: "american" },
      { team: "Tulsa", year: "2020/21", gender: "Men", index_template: "american" },

      { team: "Tulsa", year: "2018/9", gender: "Women", index_template: "women_american" },
      { team: "Tulsa", year: "2019/20", gender: "Women", index_template: "women_american" },
      { team: "Tulsa", year: "2020/21", gender: "Women", index_template: "women_american" },
    ],
    "South Fla.": [
      { team: "South Fla.", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "South Fla.", year: "2019/20", gender: "Men", index_template: "american" },
      { team: "South Fla.", year: "2020/21", gender: "Men", index_template: "american" },

      { team: "South Fla.", year: "2018/9", gender: "Women", index_template: "women_american" },
      { team: "South Fla.", year: "2019/20", gender: "Women", index_template: "women_american" },
      { team: "South Fla.", year: "2020/21", gender: "Women", index_template: "women_american" },
    ],
    "Houston": [
      { team: "Houston", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Houston", year: "2019/20", gender: "Men", index_template: "american" },
      { team: "Houston", year: "2020/21", gender: "Men", index_template: "american" },

      { team: "Houston", year: "2018/9", gender: "Women", index_template: "women_american" },
      { team: "Houston", year: "2019/20", gender: "Women", index_template: "women_american" },
      { team: "Houston", year: "2020/21", gender: "Women", index_template: "women_american" },
    ],
    "UCF": [
      { team: "UCF", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "UCF", year: "2019/20", gender: "Men", index_template: "american" },
      { team: "UCF", year: "2020/21", gender: "Men", index_template: "american" },

      { team: "UCF", year: "2018/9", gender: "Women", index_template: "women_american" },
      { team: "UCF", year: "2019/20", gender: "Women", index_template: "women_american" },
      { team: "UCF", year: "2020/21", gender: "Women", index_template: "women_american" },
    ],
    "Cincinnati": [
      { team: "Cincinnati", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Cincinnati", year: "2019/20", gender: "Men", index_template: "american" },
      { team: "Cincinnati", year: "2020/21", gender: "Men", index_template: "american" },

      { team: "Cincinnati", year: "2018/9", gender: "Women", index_template: "women_american" },
      { team: "Cincinnati", year: "2019/20", gender: "Women", index_template: "women_american" },
      { team: "Cincinnati", year: "2020/21", gender: "Women", index_template: "women_american" },
    ],
    "Wichita St.": [
      { team: "Wichita St.", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Wichita St.", year: "2019/20", gender: "Men", index_template: "american" },
      { team: "Wichita St.", year: "2020/21", gender: "Men", index_template: "american" },

      { team: "Wichita St.", year: "2018/9", gender: "Women", index_template: "women_american" },
      { team: "Wichita St.", year: "2019/20", gender: "Women", index_template: "women_american" },
      { team: "Wichita St.", year: "2020/21", gender: "Women", index_template: "women_american" },
    ],
    "Memphis": [
      { team: "Memphis", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Memphis", year: "2019/20", gender: "Men", index_template: "american" },
      { team: "Memphis", year: "2020/21", gender: "Men", index_template: "american" },

      { team: "Memphis", year: "2018/9", gender: "Women", index_template: "women_american" },
      { team: "Memphis", year: "2019/20", gender: "Women", index_template: "women_american" },
      { team: "Memphis", year: "2020/21", gender: "Women", index_template: "women_american" },
    ],
    "East Carolina": [
      { team: "East Carolina", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "East Carolina", year: "2019/20", gender: "Men", index_template: "american" },
      { team: "East Carolina", year: "2020/21", gender: "Men", index_template: "american" },

      { team: "East Carolina", year: "2018/9", gender: "Women", index_template: "women_american" },
      { team: "East Carolina", year: "2019/20", gender: "Women", index_template: "women_american" },
      { team: "East Carolina", year: "2020/21", gender: "Women", index_template: "women_american" },
    ],
    "Tulane": [
      { team: "Tulane", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Tulane", year: "2019/20", gender: "Men", index_template: "american" },
      { team: "Tulane", year: "2020/21", gender: "Men", index_template: "american" },

      { team: "Tulane", year: "2018/9", gender: "Women", index_template: "women_american" },
      { team: "Tulane", year: "2019/20", gender: "Women", index_template: "women_american" },
      { team: "Tulane", year: "2020/21", gender: "Women", index_template: "women_american" },
    ],
    "Temple": [
      { team: "Temple", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "Temple", year: "2019/20", gender: "Men", index_template: "american" },
      { team: "Temple", year: "2020/21", gender: "Men", index_template: "american" },

      { team: "Temple", year: "2018/9", gender: "Women", index_template: "women_american" },
      { team: "Temple", year: "2019/20", gender: "Women", index_template: "women_american" },
      { team: "Temple", year: "2020/21", gender: "Women", index_template: "women_american" },
    ],
    "SMU": [
      { team: "SMU", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "SMU", year: "2019/20", gender: "Men", index_template: "american" },
      { team: "SMU", year: "2020/21", gender: "Men", index_template: "american" },

      { team: "SMU", year: "2018/9", gender: "Women", index_template: "women_american" },
      { team: "SMU", year: "2019/20", gender: "Women", index_template: "women_american" },
      { team: "SMU", year: "2020/21", gender: "Women", index_template: "women_american" },
    ],
    "UConn": [
      { team: "UConn", year: "2018/9", gender: "Men", index_template: "american" },
      { team: "UConn", year: "2019/20", gender: "Men", index_template: "american" },
      // Moved to Big East
      { team: "UConn", year: "2020/21", gender: "Men", index_template: "bigeast" },

      { team: "UConn", year: "2018/9", gender: "Women", index_template: "women_american" },
      { team: "UConn", year: "2019/20", gender: "Women", index_template: "women_american" },
      // Moved to Big East
      { team: "UConn", year: "2020/21", gender: "Women", index_template: "women_bigeast" },
    ],
    // Atlantic-10
    "Richmond": [
      { team: "Richmond", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Richmond", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "Richmond", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "Dayton": [
      { team: "Dayton", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Dayton", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "Dayton", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "La Salle": [
      { team: "La Salle", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "La Salle", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "La Salle", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "St. Bonaventure": [
      { team: "St. Bonaventure", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "St. Bonaventure", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "St. Bonaventure", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "George Washington": [
      { team: "George Washington", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "George Washington", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "George Washington", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "Saint Louis": [
      { team: "Saint Louis", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Saint Louis", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "Saint Louis", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "Massachusetts": [
      { team: "Massachusetts", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Massachusetts", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "Massachusetts", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "Fordham": [
      { team: "Fordham", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Fordham", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "Fordham", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "George Mason": [
      { team: "George Mason", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "George Mason", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "George Mason", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "Saint Joseph's": [
      { team: "Saint Joseph's", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Saint Joseph's", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "Saint Joseph's", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "VCU": [
      { team: "VCU", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "VCU", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "VCU", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "Davidson": [
      { team: "Davidson", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Davidson", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "Davidson", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "Duquesne": [
      { team: "Duquesne", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Duquesne", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "Duquesne", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    "Rhode Island": [
      { team: "Rhode Island", year: "2018/9", gender: "Men", index_template: "atlanticten" },
      { team: "Rhode Island", year: "2019/20", gender: "Men", index_template: "atlanticten" },
      { team: "Rhode Island", year: "2020/21", gender: "Men", index_template: "atlanticten" },
    ],
    // BIG East (see under AAC for UConn 2020+)
    "Providence": [
      { team: "Providence", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Providence", year: "2019/20", gender: "Men", index_template: "bigeast" },
      { team: "Providence", year: "2020/21", gender: "Men", index_template: "bigeast" },

      { team: "Providence", year: "2020/21", gender: "Women", index_template: "women_bigeast" },
    ],
    "Villanova": [
      { team: "Villanova", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Villanova", year: "2019/20", gender: "Men", index_template: "bigeast" },
      { team: "Villanova", year: "2020/21", gender: "Men", index_template: "bigeast" },

      { team: "Villanova", year: "2020/21", gender: "Women", index_template: "women_bigeast" },
    ],
    "Marquette": [
      { team: "Marquette", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Marquette", year: "2019/20", gender: "Men", index_template: "bigeast" },
      { team: "Marquette", year: "2020/21", gender: "Men", index_template: "bigeast" },

      { team: "Marquette", year: "2020/21", gender: "Women", index_template: "women_bigeast" },
    ],
    "DePaul": [
      { team: "DePaul", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "DePaul", year: "2019/20", gender: "Men", index_template: "bigeast" },
      { team: "DePaul", year: "2020/21", gender: "Men", index_template: "bigeast" },

      { team: "DePaul", year: "2020/21", gender: "Women", index_template: "women_bigeast" },
    ],
    "Seton Hall": [
      { team: "Seton Hall", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Seton Hall", year: "2019/20", gender: "Men", index_template: "bigeast" },
      { team: "Seton Hall", year: "2020/21", gender: "Men", index_template: "bigeast" },

      { team: "Seton Hall", year: "2020/21", gender: "Women", index_template: "women_bigeast" },
    ],
    "Xavier": [
      { team: "Xavier", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Xavier", year: "2019/20", gender: "Men", index_template: "bigeast" },
      { team: "Xavier", year: "2020/21", gender: "Men", index_template: "bigeast" },

      { team: "Xavier", year: "2020/21", gender: "Women", index_template: "women_bigeast" },
    ],
    "Butler": [
      { team: "Butler", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Butler", year: "2019/20", gender: "Men", index_template: "bigeast" },
      { team: "Butler", year: "2020/21", gender: "Men", index_template: "bigeast" },

      { team: "Butler", year: "2020/21", gender: "Women", index_template: "women_bigeast" },
    ],
    "St. John's (NY)": [
      { team: "St. John's (NY)", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "St. John's (NY)", year: "2019/20", gender: "Men", index_template: "bigeast" },
      { team: "St. John's (NY)", year: "2020/21", gender: "Men", index_template: "bigeast" },

      { team: "St. John's (NY)", year: "2020/21", gender: "Women", index_template: "women_bigeast" },
    ],
    "Georgetown": [
      { team: "Georgetown", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Georgetown", year: "2019/20", gender: "Men", index_template: "bigeast" },
      { team: "Georgetown", year: "2020/21", gender: "Men", index_template: "bigeast" },

      { team: "Georgetown", year: "2020/21", gender: "Women", index_template: "women_bigeast" },
    ],
    "Creighton": [
      { team: "Creighton", year: "2018/9", gender: "Men", index_template: "bigeast" },
      { team: "Creighton", year: "2019/20", gender: "Men", index_template: "bigeast" },
      { team: "Creighton", year: "2020/21", gender: "Men", index_template: "bigeast" },

      { team: "Creighton", year: "2020/21", gender: "Women", index_template: "women_bigeast" },
    ],
    // BIG (minus Maryland)
    "Indiana": [
      { team: "Indiana", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Indiana", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Indiana", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Indiana", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Indiana", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Indiana", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    "Nebraska": [
      { team: "Nebraska", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Nebraska", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Nebraska", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Nebraska", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Nebraska", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Nebraska", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    "Wisconsin": [
      { team: "Wisconsin", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Wisconsin", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Wisconsin", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Wisconsin", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Wisconsin", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Wisconsin", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    "Ohio St.": [
      { team: "Ohio St.", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Ohio St.", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Ohio St.", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Ohio St.", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Ohio St.", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Ohio St.", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    "Michigan St.": [
      { team: "Michigan St.", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Michigan St.", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Michigan St.", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Michigan St.", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Michigan St.", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Michigan St.", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    "Iowa": [
      { team: "Iowa", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Iowa", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Iowa", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Iowa", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Iowa", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Iowa", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    "Michigan": [
      { team: "Michigan", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Michigan", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Michigan", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Michigan", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Michigan", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Michigan", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    "Purdue": [
      { team: "Purdue", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Purdue", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Purdue", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Purdue", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Purdue", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Purdue", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    "Illinois": [
      { team: "Illinois", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Illinois", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Illinois", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Illinois", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Illinois", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Illinois", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    "Penn St.": [
      { team: "Penn St.", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Penn St.", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Penn St.", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Penn St.", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Penn St.", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Penn St.", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    "Northwestern": [
      { team: "Northwestern", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Northwestern", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Northwestern", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Northwestern", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Northwestern", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Northwestern", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    "Rutgers": [
      { team: "Rutgers", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Rutgers", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Rutgers", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Rutgers", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Rutgers", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Rutgers", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    "Minnesota": [
      { team: "Minnesota", year: "2018/9", gender: "Men", index_template: "bigten" },
      { team: "Minnesota", year: "2019/20", gender: "Men", index_template: "bigten" },
      { team: "Minnesota", year: "2020/21", gender: "Men", index_template: "bigten" },

      { team: "Minnesota", year: "2018/9", gender: "Women", index_template: "women_bigten" },
      { team: "Minnesota", year: "2019/20", gender: "Women", index_template: "women_bigten" },
      { team: "Minnesota", year: "2020/21", gender: "Women", index_template: "women_bigten" },
    ],
    // BIG 12
    "Texas Tech": [
      { team: "Texas Tech", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Texas Tech", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
      { team: "Texas Tech", year: "2020/21", gender: "Men", index_template: "bigtwelve" },

      { team: "Texas Tech", year: "2018/9", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Texas Tech", year: "2019/20", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Texas Tech", year: "2020/21", gender: "Women", index_template: "women_bigtwelve" },
    ],
    "Iowa St.": [
      { team: "Iowa St.", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Iowa St.", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
      { team: "Iowa St.", year: "2020/21", gender: "Men", index_template: "bigtwelve" },

      { team: "Iowa St.", year: "2018/9", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Iowa St.", year: "2019/20", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Iowa St.", year: "2020/21", gender: "Women", index_template: "women_bigtwelve" },
    ],
    "Texas": [
      { team: "Texas", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Texas", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
      { team: "Texas", year: "2020/21", gender: "Men", index_template: "bigtwelve" },

      { team: "Texas", year: "2018/9", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Texas", year: "2019/20", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Texas", year: "2020/21", gender: "Women", index_template: "women_bigtwelve" },
    ],
    "TCU": [
      { team: "TCU", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "TCU", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
      { team: "TCU", year: "2020/21", gender: "Men", index_template: "bigtwelve" },

      { team: "TCU", year: "2018/9", gender: "Women", index_template: "women_bigtwelve" },
      { team: "TCU", year: "2019/20", gender: "Women", index_template: "women_bigtwelve" },
      { team: "TCU", year: "2020/21", gender: "Women", index_template: "women_bigtwelve" },
    ],
    "Oklahoma": [
      { team: "Oklahoma", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Oklahoma", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
      { team: "Oklahoma", year: "2020/21", gender: "Men", index_template: "bigtwelve" },

      { team: "Oklahoma", year: "2018/9", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Oklahoma", year: "2019/20", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Oklahoma", year: "2020/21", gender: "Women", index_template: "women_bigtwelve" },
    ],
    "Baylor": [
      { team: "Baylor", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Baylor", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
      { team: "Baylor", year: "2020/21", gender: "Men", index_template: "bigtwelve" },

      { team: "Baylor", year: "2018/9", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Baylor", year: "2019/20", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Baylor", year: "2020/21", gender: "Women", index_template: "women_bigtwelve" },
    ],
    "Kansas St.": [
      { team: "Kansas St.", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Kansas St.", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
      { team: "Kansas St.", year: "2020/21", gender: "Men", index_template: "bigtwelve" },

      { team: "Kansas St.", year: "2018/9", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Kansas St.", year: "2019/20", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Kansas St.", year: "2020/21", gender: "Women", index_template: "women_bigtwelve" },
    ],
    "West Virginia": [
      { team: "West Virginia", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "West Virginia", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
      { team: "West Virginia", year: "2020/21", gender: "Men", index_template: "bigtwelve" },

      { team: "West Virginia", year: "2018/9", gender: "Women", index_template: "women_bigtwelve" },
      { team: "West Virginia", year: "2019/20", gender: "Women", index_template: "women_bigtwelve" },
      { team: "West Virginia", year: "2020/21", gender: "Women", index_template: "women_bigtwelve" },
    ],
    "Kansas": [
      { team: "Kansas", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Kansas", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
      { team: "Kansas", year: "2020/21", gender: "Men", index_template: "bigtwelve" },

      { team: "Kansas", year: "2018/9", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Kansas", year: "2019/20", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Kansas", year: "2020/21", gender: "Women", index_template: "women_bigtwelve" },
    ],
    "Oklahoma St.": [
      { team: "Oklahoma St.", year: "2018/9", gender: "Men", index_template: "bigtwelve" },
      { team: "Oklahoma St.", year: "2019/20", gender: "Men", index_template: "bigtwelve" },
      { team: "Oklahoma St.", year: "2020/21", gender: "Men", index_template: "bigtwelve" },

      { team: "Oklahoma St.", year: "2018/9", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Oklahoma St.", year: "2019/20", gender: "Women", index_template: "women_bigtwelve" },
      { team: "Oklahoma St.", year: "2020/21", gender: "Women", index_template: "women_bigtwelve" },
    ],
    // PAC-12
    "California": [
      { team: "California", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "California", year: "2019/20", gender: "Men", index_template: "pactwelve" },
      { team: "California", year: "2020/21", gender: "Men", index_template: "pactwelve" },

      { team: "California", year: "2018/9", gender: "Women", index_template: "women_pactwelve" },
      { team: "California", year: "2019/20", gender: "Women", index_template: "women_pactwelve" },
      { team: "California", year: "2020/21", gender: "Women", index_template: "women_pactwelve" },
    ],
    "Oregon St.": [
      { team: "Oregon St.", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Oregon St.", year: "2019/20", gender: "Men", index_template: "pactwelve" },
      { team: "Oregon St.", year: "2020/21", gender: "Men", index_template: "pactwelve" },

      { team: "Oregon St.", year: "2018/9", gender: "Women", index_template: "women_pactwelve" },
      { team: "Oregon St.", year: "2019/20", gender: "Women", index_template: "women_pactwelve" },
      { team: "Oregon St.", year: "2020/21", gender: "Women", index_template: "women_pactwelve" },
    ],
    "Washington": [
      { team: "Washington", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Washington", year: "2019/20", gender: "Men", index_template: "pactwelve" },
      { team: "Washington", year: "2020/21", gender: "Men", index_template: "pactwelve" },

      { team: "Washington", year: "2018/9", gender: "Women", index_template: "women_pactwelve" },
      { team: "Washington", year: "2019/20", gender: "Women", index_template: "women_pactwelve" },
      { team: "Washington", year: "2020/21", gender: "Women", index_template: "women_pactwelve" },
    ],
    "Arizona St.": [
      { team: "Arizona St.", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Arizona St.", year: "2019/20", gender: "Men", index_template: "pactwelve" },
      { team: "Arizona St.", year: "2020/21", gender: "Men", index_template: "pactwelve" },

      { team: "Arizona St.", year: "2018/9", gender: "Women", index_template: "women_pactwelve" },
      { team: "Arizona St.", year: "2019/20", gender: "Women", index_template: "women_pactwelve" },
      { team: "Arizona St.", year: "2020/21", gender: "Women", index_template: "women_pactwelve" },
    ],
    "UCLA": [
      { team: "UCLA", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "UCLA", year: "2019/20", gender: "Men", index_template: "pactwelve" },
      { team: "UCLA", year: "2020/21", gender: "Men", index_template: "pactwelve" },

      { team: "UCLA", year: "2018/9", gender: "Women", index_template: "women_pactwelve" },
      { team: "UCLA", year: "2019/20", gender: "Women", index_template: "women_pactwelve" },
      { team: "UCLA", year: "2020/21", gender: "Women", index_template: "women_pactwelve" },
    ],
    "Southern California": [
      { team: "Southern California", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Southern California", year: "2019/20", gender: "Men", index_template: "pactwelve" },
      { team: "Southern California", year: "2020/21", gender: "Men", index_template: "pactwelve" },

      { team: "Southern California", year: "2018/9", gender: "Women", index_template: "women_pactwelve" },
      { team: "Southern California", year: "2019/20", gender: "Women", index_template: "women_pactwelve" },
      { team: "Southern California", year: "2020/21", gender: "Women", index_template: "women_pactwelve" },
    ],
    "Utah": [
      { team: "Utah", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Utah", year: "2019/20", gender: "Men", index_template: "pactwelve" },
      { team: "Utah", year: "2020/21", gender: "Men", index_template: "pactwelve" },

      { team: "Utah", year: "2018/9", gender: "Women", index_template: "women_pactwelve" },
      { team: "Utah", year: "2019/20", gender: "Women", index_template: "women_pactwelve" },
      { team: "Utah", year: "2020/21", gender: "Women", index_template: "women_pactwelve" },
    ],
    "Washington St.": [
      { team: "Washington St.", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Washington St.", year: "2019/20", gender: "Men", index_template: "pactwelve" },
      { team: "Washington St.", year: "2020/21", gender: "Men", index_template: "pactwelve" },

      { team: "Washington St.", year: "2018/9", gender: "Women", index_template: "women_pactwelve" },
      { team: "Washington St.", year: "2019/20", gender: "Women", index_template: "women_pactwelve" },
      { team: "Washington St.", year: "2020/21", gender: "Women", index_template: "women_pactwelve" },
    ],
    "Stanford": [
      { team: "Stanford", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Stanford", year: "2019/20", gender: "Men", index_template: "pactwelve" },
      { team: "Stanford", year: "2020/21", gender: "Men", index_template: "pactwelve" },

      { team: "Stanford", year: "2018/9", gender: "Women", index_template: "women_pactwelve" },
      { team: "Stanford", year: "2019/20", gender: "Women", index_template: "women_pactwelve" },
      { team: "Stanford", year: "2020/21", gender: "Women", index_template: "women_pactwelve" },
    ],
    "Arizona": [
      { team: "Arizona", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Arizona", year: "2019/20", gender: "Men", index_template: "pactwelve" },
      { team: "Arizona", year: "2020/21", gender: "Men", index_template: "pactwelve" },

      { team: "Arizona", year: "2018/9", gender: "Women", index_template: "women_pactwelve" },
      { team: "Arizona", year: "2019/20", gender: "Women", index_template: "women_pactwelve" },
      { team: "Arizona", year: "2020/21", gender: "Women", index_template: "women_pactwelve" },
    ],
    "Colorado": [
      { team: "Colorado", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Colorado", year: "2019/20", gender: "Men", index_template: "pactwelve" },
      { team: "Colorado", year: "2020/21", gender: "Men", index_template: "pactwelve" },

      { team: "Colorado", year: "2018/9", gender: "Women", index_template: "women_pactwelve" },
      { team: "Colorado", year: "2019/20", gender: "Women", index_template: "women_pactwelve" },
      { team: "Colorado", year: "2020/21", gender: "Women", index_template: "women_pactwelve" },
    ],
    "Oregon": [
      { team: "Oregon", year: "2018/9", gender: "Men", index_template: "pactwelve" },
      { team: "Oregon", year: "2019/20", gender: "Men", index_template: "pactwelve" },
      { team: "Oregon", year: "2020/21", gender: "Men", index_template: "pactwelve" },

      { team: "Oregon", year: "2018/9", gender: "Women", index_template: "women_pactwelve" },
      { team: "Oregon", year: "2019/20", gender: "Women", index_template: "women_pactwelve" },
      { team: "Oregon", year: "2020/21", gender: "Women", index_template: "women_pactwelve" },
    ],
    // SEC
    "Texas A&M": [
      { team: "Texas A&M", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Texas A&M", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "Texas A&M", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "Texas A&M", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "Texas A&M", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "Texas A&M", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "Auburn": [
      { team: "Auburn", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Auburn", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "Auburn", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "Auburn", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "Auburn", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "Auburn", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "Ole Miss": [
      { team: "Ole Miss", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Ole Miss", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "Ole Miss", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "Ole Miss", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "Ole Miss", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "Ole Miss", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "Florida": [
      { team: "Florida", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Florida", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "Florida", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "Florida", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "Florida", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "Florida", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "South Carolina": [
      { team: "South Carolina", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "South Carolina", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "South Carolina", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "South Carolina", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "South Carolina", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "South Carolina", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "Arkansas": [
      { team: "Arkansas", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Arkansas", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "Arkansas", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "Arkansas", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "Arkansas", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "Arkansas", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "Tennessee": [
      { team: "Tennessee", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Tennessee", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "Tennessee", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "Tennessee", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "Tennessee", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "Tennessee", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "Georgia": [
      { team: "Georgia", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Georgia", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "Georgia", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "Georgia", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "Georgia", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "Georgia", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "Missouri": [
      { team: "Missouri", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Missouri", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "Missouri", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "Missouri", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "Missouri", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "Missouri", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "LSU": [
      { team: "LSU", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "LSU", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "LSU", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "LSU", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "LSU", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "LSU", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "Alabama": [
      { team: "Alabama", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Alabama", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "Alabama", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "Alabama", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "Alabama", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "Alabama", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "Vanderbilt": [
      { team: "Vanderbilt", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Vanderbilt", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "Vanderbilt", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "Vanderbilt", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "Vanderbilt", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "Vanderbilt", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "Kentucky": [
      { team: "Kentucky", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Kentucky", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "Kentucky", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "Kentucky", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "Kentucky", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "Kentucky", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    "Mississippi St.": [
      { team: "Mississippi St.", year: "2018/9", gender: "Men", index_template: "sec" },
      { team: "Mississippi St.", year: "2019/20", gender: "Men", index_template: "sec" },
      { team: "Mississippi St.", year: "2020/21", gender: "Men", index_template: "sec" },

      { team: "Mississippi St.", year: "2018/9", gender: "Women", index_template: "women_sec" },
      { team: "Mississippi St.", year: "2019/20", gender: "Women", index_template: "women_sec" },
      { team: "Mississippi St.", year: "2020/21", gender: "Women", index_template: "women_sec" },
    ],
    // Misc
    // Men
    "Saint Mary's (CA)": [
      { team: "Saint Mary's (CA)", year: "2018/9", gender: "Men", index_template: "misc_conf" },
      { team: "Saint Mary's (CA)", year: "2019/20", gender: "Men", index_template: "misc_conf" },
      { team: "Saint Mary's (CA)", year: "2020/21", gender: "Men", index_template: "wcc" },
    ],
    "Gonzaga": [
      { team: "Gonzaga", year: "2018/9", gender: "Men", index_template: "misc_conf" },
      { team: "Gonzaga", year: "2019/20", gender: "Men", index_template: "misc_conf" },
      { team: "Gonzaga", year: "2020/21", gender: "Men", index_template: "wcc" },
    ],
    "San Francisco": [
      { team: "San Francisco", year: "2020/21", gender: "Men", index_template: "wcc" },
    ],
    "BYU": [
      { team: "BYU", year: "2018/9", gender: "Men", index_template: "misc_conf" },
      { team: "BYU", year: "2019/20", gender: "Men", index_template: "misc_conf" },
      { team: "BYU", year: "2020/21", gender: "Men", index_template: "wcc" },
    ],
    "San Diego St.": [
      { team: "San Diego St.", year: "2018/9", gender: "Men", index_template: "misc_conf" },
      { team: "San Diego St.", year: "2019/20", gender: "Men", index_template: "misc_conf" },
      { team: "San Diego St.", year: "2020/21", gender: "Men", index_template: "mountainwest" },
    ],
    "Nevada": [
      { team: "Nevada", year: "2020/21", gender: "Men", index_template: "mountainwest" },
    ],
    "Utah St.": [
      { team: "Utah St.", year: "2018/9", gender: "Men", index_template: "misc_conf" },
      { team: "Utah St.", year: "2019/20", gender: "Men", index_template: "misc_conf" },
      { team: "Utah St.", year: "2020/21", gender: "Men", index_template: "mountainwest" },
    ],
    "Furman": [
      { team: "Furman", year: "2020/21", gender: "Men", index_template: "socon" },
    ],
    "ETSU": [
      { team: "ETSU", year: "2020/21", gender: "Men", index_template: "socon" },
    ],
    // Women:
    "South Dakota St.": [
      { team: "South Dakota St.", year: "2018/9", gender: "Women", index_template: "women_misc_conf" },
      { team: "South Dakota St.", year: "2019/20", gender: "Women", index_template: "women_misc_conf" },
      { team: "South Dakota St.", year: "2020/21", gender: "Women", index_template: "women_misc_conf" },
    ],
  }

  /** These are extra teams I've added for specific years */
  static readonly extraTeamsBase = [
    { team: "Maryland", year: "2014/5", gender: "Men", index_template: "misc_conf" },
    { team: "Maryland", year: "2015/6", gender: "Men", index_template: "misc_conf" },
    { team: "Maryland", year: "2016/7", gender: "Men", index_template: "misc_conf" },
    { team: "Maryland", year: "2017/8", gender: "Men", index_template: "misc_conf" },
  ];
  static readonly extraTeams = AvailableTeams.extraTeamsBase.map((t: AvailableTeamMeta) => {
    return { ...t, team: t.team + ` ${t.year}`};
  });

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

    // Special cases
    if ((year == AvailableTeams.extraTeamName) && (gender == "Men")) {
      return AvailableTeams.extraTeams;
    } else {

      const list = team ?
        (AvailableTeams.byName[team] || ([] as Array<AvailableTeamMeta>)) :
        AvailableTeams.flatten(Object.values(AvailableTeams.byName));

      return list.filter(function(record) {
        return (!team || (team == record.team)) &&
          (!year || (year == record.year)) && (!gender || (gender == record.gender));
      });
    }
  }
  static getTeam(
    team: string, year: string, gender: string
  ): AvailableTeamMeta | null {
      const retVal = AvailableTeams.getTeams(team, year, gender);
      return (retVal.length > 0) ? retVal[0] : null;
  }
}
