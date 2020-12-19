
export type AvailableTeamMeta = {
  team: string,
  year: string,
  gender: string,
  index_template: string,
  category: string
}

export class AvailableTeams {

  static readonly defaultConfIndex = "misc_conf";

  static readonly extraTeamName = "Extra";

  /** A list of all the teams with lineup data available */
  static readonly byName: Record<string, Array<AvailableTeamMeta>> = {

    "Boston College": [
        { team: "Boston College", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Boston College", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Boston College", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Boston College", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Boston College", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Boston College", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Clemson": [
        { team: "Clemson", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Clemson", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Clemson", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Clemson", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Clemson", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Clemson", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Duke": [
        { team: "Duke", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Duke", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Duke", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Duke", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Duke", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Duke", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Florida St.": [
        { team: "Florida St.", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Florida St.", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Florida St.", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Florida St.", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Florida St.", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Florida St.", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Georgia Tech": [
        { team: "Georgia Tech", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Georgia Tech", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Georgia Tech", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Georgia Tech", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Georgia Tech", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Georgia Tech", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Louisville": [
        { team: "Louisville", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Louisville", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Louisville", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Louisville", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Louisville", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Louisville", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Miami (FL)": [
        { team: "Miami (FL)", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Miami (FL)", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Miami (FL)", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Miami (FL)", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Miami (FL)", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Miami (FL)", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "NC State": [
        { team: "NC State", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "NC State", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "NC State", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "NC State", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "NC State", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "NC State", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "North Carolina": [
        { team: "North Carolina", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "North Carolina", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "North Carolina", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "North Carolina", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "North Carolina", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "North Carolina", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Notre Dame": [
        { team: "Notre Dame", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Notre Dame", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Notre Dame", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Notre Dame", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Notre Dame", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Notre Dame", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Pittsburgh": [
        { team: "Pittsburgh", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Pittsburgh", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Pittsburgh", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Pittsburgh", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Pittsburgh", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Pittsburgh", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Syracuse": [
        { team: "Syracuse", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Syracuse", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Syracuse", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Syracuse", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Syracuse", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Syracuse", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Virginia": [
        { team: "Virginia", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Virginia", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Virginia", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Virginia", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Virginia", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Virginia", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Virginia Tech": [
        { team: "Virginia Tech", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Virginia Tech", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Virginia Tech", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Virginia Tech", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Virginia Tech", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Virginia Tech", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Wake Forest": [
        { team: "Wake Forest", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Wake Forest", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Wake Forest", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Wake Forest", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Wake Forest", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Wake Forest", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Cincinnati": [
        { team: "Cincinnati", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "Cincinnati", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "Cincinnati", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "Cincinnati", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Cincinnati", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Cincinnati", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "East Carolina": [
        { team: "East Carolina", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "East Carolina", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "East Carolina", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "East Carolina", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "East Carolina", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "East Carolina", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Houston": [
        { team: "Houston", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "Houston", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "Houston", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "Houston", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Houston", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Houston", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Memphis": [
        { team: "Memphis", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "Memphis", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "Memphis", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "Memphis", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Memphis", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Memphis", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "SMU": [
        { team: "SMU", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "SMU", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "SMU", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "SMU", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "SMU", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "SMU", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "South Fla.": [
        { team: "South Fla.", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "South Fla.", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "South Fla.", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "South Fla.", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "South Fla.", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "South Fla.", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Temple": [
        { team: "Temple", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "Temple", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "Temple", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "Temple", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Temple", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Temple", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Tulane": [
        { team: "Tulane", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "Tulane", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "Tulane", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "Tulane", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Tulane", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Tulane", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Tulsa": [
        { team: "Tulsa", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "Tulsa", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "Tulsa", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "Tulsa", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Tulsa", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "UCF": [
        { team: "UCF", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "UCF", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "UCF", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "UCF", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "UCF", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "UCF", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "UConn": [
        { team: "UConn", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "UConn", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "UConn", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "UConn", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "UConn", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "UConn", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "Wichita St.": [
        { team: "Wichita St.", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "Wichita St.", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "Wichita St.", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "Wichita St.", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Wichita St.", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Wichita St.", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Davidson": [
        { team: "Davidson", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Davidson", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Davidson", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Dayton": [
        { team: "Dayton", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Dayton", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Dayton", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Duquesne": [
        { team: "Duquesne", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Duquesne", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Duquesne", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Fordham": [
        { team: "Fordham", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Fordham", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Fordham", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "George Mason": [
        { team: "George Mason", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "George Mason", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "George Mason", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "George Washington": [
        { team: "George Washington", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "George Washington", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "George Washington", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "La Salle": [
        { team: "La Salle", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "La Salle", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "La Salle", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Massachusetts": [
        { team: "Massachusetts", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Massachusetts", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Massachusetts", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Rhode Island": [
        { team: "Rhode Island", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Rhode Island", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Rhode Island", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Richmond": [
        { team: "Richmond", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Richmond", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Richmond", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Saint Joseph's": [
        { team: "Saint Joseph's", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Saint Joseph's", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Saint Joseph's", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Saint Louis": [
        { team: "Saint Louis", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Saint Louis", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Saint Louis", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "St. Bonaventure": [
        { team: "St. Bonaventure", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "St. Bonaventure", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "St. Bonaventure", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "VCU": [
        { team: "VCU", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "VCU", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "VCU", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Butler": [
        { team: "Butler", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Butler", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Butler", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Butler", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "Creighton": [
        { team: "Creighton", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Creighton", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Creighton", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Creighton", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "DePaul": [
        { team: "DePaul", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "DePaul", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "DePaul", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "DePaul", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "Georgetown": [
        { team: "Georgetown", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Georgetown", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Georgetown", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
     ],
    "Marquette": [
        { team: "Marquette", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Marquette", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Marquette", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Marquette", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "Providence": [
        { team: "Providence", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Providence", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Providence", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Providence", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "Seton Hall": [
        { team: "Seton Hall", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Seton Hall", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Seton Hall", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Seton Hall", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "St. John's (NY)": [
        { team: "St. John's (NY)", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "St. John's (NY)", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "St. John's (NY)", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "St. John's (NY)", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "Villanova": [
        { team: "Villanova", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Villanova", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Villanova", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Villanova", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "Xavier": [
        { team: "Xavier", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Xavier", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Xavier", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Xavier", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "Eastern Wash.": [
        { team: "Eastern Wash.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Idaho": [
        { team: "Idaho", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Idaho St.": [
        { team: "Idaho St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Montana": [
        { team: "Montana", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Montana St.": [
        { team: "Montana St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Northern Ariz.": [
        { team: "Northern Ariz.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Northern Colo.": [
        { team: "Northern Colo.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Portland St.": [
        { team: "Portland St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Sacramento St.": [
        { team: "Sacramento St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Southern Utah": [
        { team: "Southern Utah", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Weber St.": [
        { team: "Weber St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Illinois": [
        { team: "Illinois", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Illinois", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Illinois", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Illinois", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Illinois", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Illinois", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Indiana": [
        { team: "Indiana", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Indiana", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Indiana", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Indiana", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Indiana", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Indiana", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Iowa": [
        { team: "Iowa", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Iowa", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Iowa", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Iowa", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Iowa", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Iowa", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Maryland": [
        { team: "Maryland", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Maryland", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Maryland", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Maryland", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Maryland", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Maryland", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Michigan": [
        { team: "Michigan", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Michigan", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Michigan", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Michigan", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Michigan", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Michigan", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Michigan St.": [
        { team: "Michigan St.", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Michigan St.", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Michigan St.", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Michigan St.", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Michigan St.", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Michigan St.", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Minnesota": [
        { team: "Minnesota", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Minnesota", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Minnesota", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Minnesota", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Minnesota", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Minnesota", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Nebraska": [
        { team: "Nebraska", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Nebraska", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Nebraska", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Nebraska", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Nebraska", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Nebraska", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Northwestern": [
        { team: "Northwestern", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Northwestern", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Northwestern", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Northwestern", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Northwestern", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Northwestern", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Ohio St.": [
        { team: "Ohio St.", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Ohio St.", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Ohio St.", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Ohio St.", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Ohio St.", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Ohio St.", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Penn St.": [
        { team: "Penn St.", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Penn St.", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Penn St.", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Penn St.", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Penn St.", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Penn St.", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Purdue": [
        { team: "Purdue", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Purdue", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Purdue", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Purdue", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Purdue", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Purdue", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Rutgers": [
        { team: "Rutgers", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Rutgers", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Rutgers", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Rutgers", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Rutgers", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Rutgers", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Wisconsin": [
        { team: "Wisconsin", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Wisconsin", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Wisconsin", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Wisconsin", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Wisconsin", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Wisconsin", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Baylor": [
        { team: "Baylor", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Baylor", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Baylor", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Baylor", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Baylor", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Baylor", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Iowa St.": [
        { team: "Iowa St.", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Iowa St.", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Iowa St.", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Iowa St.", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Iowa St.", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Iowa St.", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Kansas": [
        { team: "Kansas", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Kansas", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Kansas", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Kansas", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Kansas", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Kansas", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Kansas St.": [
        { team: "Kansas St.", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Kansas St.", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Kansas St.", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Kansas St.", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Kansas St.", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Kansas St.", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Oklahoma": [
        { team: "Oklahoma", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Oklahoma", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Oklahoma", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Oklahoma", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Oklahoma", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Oklahoma", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Oklahoma St.": [
        { team: "Oklahoma St.", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Oklahoma St.", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Oklahoma St.", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Oklahoma St.", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Oklahoma St.", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Oklahoma St.", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "TCU": [
        { team: "TCU", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "TCU", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "TCU", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "TCU", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "TCU", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "TCU", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Texas": [
        { team: "Texas", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Texas", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Texas", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Texas", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Texas", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Texas", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Texas Tech": [
        { team: "Texas Tech", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Texas Tech", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Texas Tech", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Texas Tech", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Texas Tech", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Texas Tech", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "West Virginia": [
        { team: "West Virginia", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "West Virginia", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "West Virginia", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "West Virginia", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "West Virginia", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "West Virginia", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Col. of Charleston": [
        { team: "Col. of Charleston", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Delaware": [
        { team: "Delaware", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Drexel": [
        { team: "Drexel", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Elon": [
        { team: "Elon", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Hofstra": [
        { team: "Hofstra", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "James Madison": [
        { team: "James Madison", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Northeastern": [
        { team: "Northeastern", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Towson": [
        { team: "Towson", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "UNCW": [
        { team: "UNCW", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "William & Mary": [
        { team: "William & Mary", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Charlotte": [
        { team: "Charlotte", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "FIU": [
        { team: "FIU", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Fla. Atlantic": [
        { team: "Fla. Atlantic", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Louisiana Tech": [
        { team: "Louisiana Tech", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Marshall": [
        { team: "Marshall", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Middle Tenn.": [
        { team: "Middle Tenn.", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "North Texas": [
        { team: "North Texas", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Old Dominion": [
        { team: "Old Dominion", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Rice": [
        { team: "Rice", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Southern Miss.": [
        { team: "Southern Miss.", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "UAB": [
        { team: "UAB", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "UTEP": [
        { team: "UTEP", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "UTSA": [
        { team: "UTSA", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Western Ky.": [
        { team: "Western Ky.", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Akron": [
        { team: "Akron", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Ball St.": [
        { team: "Ball St.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Bowling Green": [
        { team: "Bowling Green", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Buffalo": [
        { team: "Buffalo", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Central Mich.": [
        { team: "Central Mich.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Eastern Mich.": [
        { team: "Eastern Mich.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Kent St.": [
        { team: "Kent St.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Miami (OH)": [
        { team: "Miami (OH)", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Northern Ill.": [
        { team: "Northern Ill.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Ohio": [
        { team: "Ohio", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Toledo": [
        { team: "Toledo", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Western Mich.": [
        { team: "Western Mich.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "BYU": [
        { team: "BYU", year: "2018/9", gender: "Men", index_template: "misc_conf", category: "midhigh" },
        { team: "BYU", year: "2019/20", gender: "Men", index_template: "misc_conf", category: "midhigh" },
        { team: "BYU", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "ETSU": [
        { team: "ETSU", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Gonzaga": [
        { team: "Gonzaga", year: "2018/9", gender: "Men", index_template: "misc_conf", category: "midhigh" },
        { team: "Gonzaga", year: "2019/20", gender: "Men", index_template: "misc_conf", category: "midhigh" },
        { team: "Gonzaga", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "Saint Mary's (CA)": [
        { team: "Saint Mary's (CA)", year: "2018/9", gender: "Men", index_template: "misc_conf", category: "midhigh" },
        { team: "Saint Mary's (CA)", year: "2019/20", gender: "Men", index_template: "misc_conf", category: "midhigh" },
        { team: "Saint Mary's (CA)", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "San Diego St.": [
        { team: "San Diego St.", year: "2018/9", gender: "Men", index_template: "misc_conf", category: "midhigh" },
        { team: "San Diego St.", year: "2019/20", gender: "Men", index_template: "misc_conf", category: "midhigh" },
        { team: "San Diego St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Utah St.": [
        { team: "Utah St.", year: "2018/9", gender: "Men", index_template: "misc_conf", category: "midhigh" },
        { team: "Utah St.", year: "2019/20", gender: "Men", index_template: "misc_conf", category: "midhigh" },
        { team: "Utah St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Air Force": [
        { team: "Air Force", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Boise St.": [
        { team: "Boise St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Colorado St.": [
        { team: "Colorado St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Fresno St.": [
        { team: "Fresno St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Nevada": [
        { team: "Nevada", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "New Mexico": [
        { team: "New Mexico", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "San Jose St.": [
        { team: "San Jose St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "UNLV": [
        { team: "UNLV", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Wyoming": [
        { team: "Wyoming", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Bradley": [
        { team: "Bradley", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Drake": [
        { team: "Drake", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Evansville": [
        { team: "Evansville", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Illinois St.": [
        { team: "Illinois St.", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Indiana St.": [
        { team: "Indiana St.", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Loyola Chicago": [
        { team: "Loyola Chicago", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Missouri St.": [
        { team: "Missouri St.", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Southern Ill.": [
        { team: "Southern Ill.", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "UNI": [
        { team: "UNI", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Valparaiso": [
        { team: "Valparaiso", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Arizona": [
        { team: "Arizona", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Arizona", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Arizona", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Arizona", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Arizona", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Arizona", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Arizona St.": [
        { team: "Arizona St.", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Arizona St.", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Arizona St.", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Arizona St.", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Arizona St.", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Arizona St.", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "California": [
        { team: "California", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "California", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "California", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "California", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "California", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "California", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Colorado": [
        { team: "Colorado", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Colorado", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Colorado", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Colorado", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Colorado", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Colorado", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Oregon": [
        { team: "Oregon", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Oregon", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Oregon", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Oregon", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Oregon", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Oregon", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Oregon St.": [
        { team: "Oregon St.", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Oregon St.", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Oregon St.", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Oregon St.", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Oregon St.", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Oregon St.", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Southern California": [
        { team: "Southern California", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Southern California", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Southern California", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Southern California", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Southern California", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Southern California", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Stanford": [
        { team: "Stanford", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Stanford", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Stanford", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Stanford", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Stanford", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Stanford", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "UCLA": [
        { team: "UCLA", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "UCLA", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "UCLA", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "UCLA", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "UCLA", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "UCLA", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Utah": [
        { team: "Utah", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Utah", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Utah", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Utah", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Utah", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Utah", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Washington": [
        { team: "Washington", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Washington", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Washington", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Washington", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Washington", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Washington", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Washington St.": [
        { team: "Washington St.", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Washington St.", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Washington St.", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Washington St.", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Washington St.", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Washington St.", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Alabama": [
        { team: "Alabama", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Alabama", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Alabama", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Alabama", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Alabama", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Alabama", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Arkansas": [
        { team: "Arkansas", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Arkansas", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Arkansas", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Arkansas", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Arkansas", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Arkansas", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Auburn": [
        { team: "Auburn", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Auburn", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Auburn", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Auburn", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Auburn", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Auburn", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Florida": [
        { team: "Florida", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Florida", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Florida", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Florida", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Florida", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Florida", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Georgia": [
        { team: "Georgia", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Georgia", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Georgia", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Georgia", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Georgia", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Georgia", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Kentucky": [
        { team: "Kentucky", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Kentucky", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Kentucky", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Kentucky", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Kentucky", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Kentucky", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "LSU": [
        { team: "LSU", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "LSU", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "LSU", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "LSU", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "LSU", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "LSU", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Mississippi St.": [
        { team: "Mississippi St.", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Mississippi St.", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Mississippi St.", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Mississippi St.", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Mississippi St.", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Mississippi St.", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Missouri": [
        { team: "Missouri", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Missouri", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Missouri", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Missouri", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Missouri", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Missouri", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Ole Miss": [
        { team: "Ole Miss", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Ole Miss", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Ole Miss", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Ole Miss", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Ole Miss", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Ole Miss", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "South Carolina": [
        { team: "South Carolina", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "South Carolina", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "South Carolina", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "South Carolina", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "South Carolina", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "South Carolina", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Tennessee": [
        { team: "Tennessee", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Tennessee", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Tennessee", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Tennessee", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Tennessee", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Tennessee", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Texas A&M": [
        { team: "Texas A&M", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Texas A&M", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Texas A&M", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Texas A&M", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Texas A&M", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Texas A&M", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Vanderbilt": [
        { team: "Vanderbilt", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Vanderbilt", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Vanderbilt", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Vanderbilt", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Vanderbilt", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Vanderbilt", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Chattanooga": [
        { team: "Chattanooga", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Furman": [
        { team: "Furman", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Mercer": [
        { team: "Mercer", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Samford": [
        { team: "Samford", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "The Citadel": [
        { team: "The Citadel", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "UNC Greensboro": [
        { team: "UNC Greensboro", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "VMI": [
        { team: "VMI", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Western Caro.": [
        { team: "Western Caro.", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Wofford": [
        { team: "Wofford", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Denver": [
        { team: "Denver", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "Kansas City": [
        { team: "Kansas City", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "North Dakota": [
        { team: "North Dakota", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "North Dakota St.": [
        { team: "North Dakota St.", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "Omaha": [
        { team: "Omaha", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "Oral Roberts": [
        { team: "Oral Roberts", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "South Dakota": [
        { team: "South Dakota", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "South Dakota St.": [
        { team: "South Dakota St.", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
        { team: "South Dakota St.", year: "2018/9", gender: "Women", index_template: "women_misc_conf", category: "midhigh" },
        { team: "South Dakota St.", year: "2019/20", gender: "Women", index_template: "women_misc_conf", category: "midhigh" },
        { team: "South Dakota St.", year: "2020/21", gender: "Women", index_template: "women_misc_conf", category: "midhigh" },
     ],
    "Western Ill.": [
        { team: "Western Ill.", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "App State": [
        { team: "App State", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Arkansas St.": [
        { team: "Arkansas St.", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Coastal Carolina": [
        { team: "Coastal Carolina", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Ga. Southern": [
        { team: "Ga. Southern", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Georgia St.": [
        { team: "Georgia St.", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Little Rock": [
        { team: "Little Rock", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Louisiana": [
        { team: "Louisiana", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "South Alabama": [
        { team: "South Alabama", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Texas St.": [
        { team: "Texas St.", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Troy": [
        { team: "Troy", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "ULM": [
        { team: "ULM", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "UT Arlington": [
        { team: "UT Arlington", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "LMU (CA)": [
        { team: "LMU (CA)", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "Pacific": [
        { team: "Pacific", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "Pepperdine": [
        { team: "Pepperdine", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "Portland": [
        { team: "Portland", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "San Diego": [
        { team: "San Diego", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "San Francisco": [
        { team: "San Francisco", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "Santa Clara": [
        { team: "Santa Clara", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],

  };

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
