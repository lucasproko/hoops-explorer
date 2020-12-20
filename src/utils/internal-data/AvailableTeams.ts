
export type AvailableTeamMeta = {
  team: string,
  year: string,
  gender: string,
  index_template: string,
  category?: string
}

export class AvailableTeams {

  static readonly defaultConfIndex = "misc_conf";

  static readonly extraTeamName = "Extra";

  /** A list of all the teams with lineup data available */
  static readonly byName: Record<string, Array<AvailableTeamMeta>> = {
    "Maryland": [
        { team: "Maryland", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Maryland", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Maryland", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Maryland", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Maryland", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Maryland", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Air Force": [
        { team: "Air Force", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Akron": [
        { team: "Akron", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Alabama": [
        { team: "Alabama", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Alabama", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Alabama", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Alabama", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Alabama", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Alabama", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "App State": [
        { team: "App State", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
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
    "Arkansas": [
        { team: "Arkansas", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Arkansas", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Arkansas", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Arkansas", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Arkansas", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Arkansas", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Arkansas St.": [
        { team: "Arkansas St.", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Auburn": [
        { team: "Auburn", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Auburn", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Auburn", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Auburn", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Auburn", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Auburn", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "BYU": [
        { team: "BYU", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "Ball St.": [
        { team: "Ball St.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Baylor": [
        { team: "Baylor", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Baylor", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Baylor", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Baylor", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Baylor", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Baylor", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Boise St.": [
        { team: "Boise St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Boston College": [
        { team: "Boston College", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Boston College", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Boston College", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Boston College", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Boston College", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Boston College", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Bowling Green": [
        { team: "Bowling Green", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Bradley": [
        { team: "Bradley", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Buffalo": [
        { team: "Buffalo", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Butler": [
        { team: "Butler", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Butler", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Butler", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Butler", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "California": [
        { team: "California", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "California", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "California", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "California", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "California", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "California", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Central Mich.": [
        { team: "Central Mich.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Charlotte": [
        { team: "Charlotte", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Chattanooga": [
        { team: "Chattanooga", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Cincinnati": [
        { team: "Cincinnati", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "Cincinnati", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "Cincinnati", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "Cincinnati", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Cincinnati", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Cincinnati", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Clemson": [
        { team: "Clemson", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Clemson", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Clemson", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Clemson", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Clemson", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Clemson", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Coastal Carolina": [
        { team: "Coastal Carolina", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Col. of Charleston": [
        { team: "Col. of Charleston", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Colorado": [
        { team: "Colorado", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Colorado", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Colorado", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Colorado", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Colorado", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Colorado", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Colorado St.": [
        { team: "Colorado St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Creighton": [
        { team: "Creighton", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Creighton", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Creighton", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Creighton", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
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
    "DePaul": [
        { team: "DePaul", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "DePaul", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "DePaul", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "DePaul", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "Delaware": [
        { team: "Delaware", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Denver": [
        { team: "Denver", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "Drake": [
        { team: "Drake", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Drexel": [
        { team: "Drexel", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Duke": [
        { team: "Duke", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Duke", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Duke", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Duke", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Duke", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Duke", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Duquesne": [
        { team: "Duquesne", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Duquesne", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Duquesne", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "ETSU": [
        { team: "ETSU", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "East Carolina": [
        { team: "East Carolina", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "East Carolina", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "East Carolina", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "East Carolina", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "East Carolina", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "East Carolina", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Eastern Mich.": [
        { team: "Eastern Mich.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Eastern Wash.": [
        { team: "Eastern Wash.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Elon": [
        { team: "Elon", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Evansville": [
        { team: "Evansville", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "FIU": [
        { team: "FIU", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Fla. Atlantic": [
        { team: "Fla. Atlantic", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Florida": [
        { team: "Florida", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Florida", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Florida", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Florida", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Florida", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Florida", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Florida St.": [
        { team: "Florida St.", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Florida St.", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Florida St.", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Florida St.", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Florida St.", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Florida St.", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Fordham": [
        { team: "Fordham", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Fordham", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Fordham", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Fresno St.": [
        { team: "Fresno St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Furman": [
        { team: "Furman", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Ga. Southern": [
        { team: "Ga. Southern", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
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
    "Georgetown": [
        { team: "Georgetown", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Georgetown", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Georgetown", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
     ],
    "Georgia": [
        { team: "Georgia", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Georgia", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Georgia", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Georgia", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Georgia", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Georgia", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Georgia St.": [
        { team: "Georgia St.", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Georgia Tech": [
        { team: "Georgia Tech", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Georgia Tech", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Georgia Tech", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Georgia Tech", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Georgia Tech", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Georgia Tech", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Gonzaga": [
        { team: "Gonzaga", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "Hofstra": [
        { team: "Hofstra", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Houston": [
        { team: "Houston", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "Houston", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "Houston", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "Houston", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Houston", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Houston", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Idaho": [
        { team: "Idaho", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Idaho St.": [
        { team: "Idaho St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Illinois": [
        { team: "Illinois", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Illinois", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Illinois", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Illinois", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Illinois", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Illinois", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Illinois St.": [
        { team: "Illinois St.", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Indiana": [
        { team: "Indiana", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Indiana", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Indiana", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Indiana", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Indiana", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Indiana", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Indiana St.": [
        { team: "Indiana St.", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Iowa": [
        { team: "Iowa", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Iowa", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Iowa", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Iowa", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Iowa", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Iowa", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Iowa St.": [
        { team: "Iowa St.", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Iowa St.", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Iowa St.", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Iowa St.", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Iowa St.", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Iowa St.", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "James Madison": [
        { team: "James Madison", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Kansas": [
        { team: "Kansas", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Kansas", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Kansas", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Kansas", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Kansas", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Kansas", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Kansas City": [
        { team: "Kansas City", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "Kansas St.": [
        { team: "Kansas St.", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Kansas St.", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Kansas St.", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Kansas St.", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Kansas St.", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Kansas St.", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Kent St.": [
        { team: "Kent St.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Kentucky": [
        { team: "Kentucky", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Kentucky", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Kentucky", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Kentucky", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Kentucky", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Kentucky", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "LMU (CA)": [
        { team: "LMU (CA)", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "LSU": [
        { team: "LSU", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "LSU", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "LSU", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "LSU", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "LSU", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "LSU", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "La Salle": [
        { team: "La Salle", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "La Salle", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "La Salle", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Little Rock": [
        { team: "Little Rock", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Louisiana": [
        { team: "Louisiana", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Louisiana Tech": [
        { team: "Louisiana Tech", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Louisville": [
        { team: "Louisville", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Louisville", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Louisville", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Louisville", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Louisville", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Louisville", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Loyola Chicago": [
        { team: "Loyola Chicago", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Marquette": [
        { team: "Marquette", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Marquette", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Marquette", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Marquette", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "Marshall": [
        { team: "Marshall", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Massachusetts": [
        { team: "Massachusetts", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Massachusetts", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Massachusetts", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Memphis": [
        { team: "Memphis", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "Memphis", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "Memphis", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "Memphis", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Memphis", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Memphis", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Mercer": [
        { team: "Mercer", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Miami (FL)": [
        { team: "Miami (FL)", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Miami (FL)", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Miami (FL)", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Miami (FL)", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Miami (FL)", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Miami (FL)", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Miami (OH)": [
        { team: "Miami (OH)", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
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
    "Middle Tenn.": [
        { team: "Middle Tenn.", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Minnesota": [
        { team: "Minnesota", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Minnesota", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Minnesota", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Minnesota", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Minnesota", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Minnesota", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
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
    "Missouri St.": [
        { team: "Missouri St.", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Montana": [
        { team: "Montana", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Montana St.": [
        { team: "Montana St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "NC State": [
        { team: "NC State", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "NC State", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "NC State", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "NC State", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "NC State", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "NC State", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Nebraska": [
        { team: "Nebraska", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Nebraska", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Nebraska", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Nebraska", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Nebraska", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Nebraska", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Nevada": [
        { team: "Nevada", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "New Mexico": [
        { team: "New Mexico", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "North Carolina": [
        { team: "North Carolina", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "North Carolina", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "North Carolina", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "North Carolina", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "North Carolina", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "North Carolina", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "North Dakota": [
        { team: "North Dakota", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "North Dakota St.": [
        { team: "North Dakota St.", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "North Texas": [
        { team: "North Texas", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Northeastern": [
        { team: "Northeastern", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Northern Ariz.": [
        { team: "Northern Ariz.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Northern Colo.": [
        { team: "Northern Colo.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Northern Ill.": [
        { team: "Northern Ill.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Northwestern": [
        { team: "Northwestern", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Northwestern", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Northwestern", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Northwestern", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Northwestern", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Northwestern", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Notre Dame": [
        { team: "Notre Dame", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Notre Dame", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Notre Dame", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Notre Dame", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Notre Dame", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Notre Dame", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Ohio": [
        { team: "Ohio", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Ohio St.": [
        { team: "Ohio St.", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Ohio St.", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Ohio St.", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Ohio St.", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Ohio St.", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Ohio St.", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
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
    "Old Dominion": [
        { team: "Old Dominion", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Ole Miss": [
        { team: "Ole Miss", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Ole Miss", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Ole Miss", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Ole Miss", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Ole Miss", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Ole Miss", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Omaha": [
        { team: "Omaha", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "Oral Roberts": [
        { team: "Oral Roberts", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
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
    "Pacific": [
        { team: "Pacific", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "Penn St.": [
        { team: "Penn St.", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Penn St.", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Penn St.", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Penn St.", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Penn St.", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Penn St.", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Pepperdine": [
        { team: "Pepperdine", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "Pittsburgh": [
        { team: "Pittsburgh", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Pittsburgh", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Pittsburgh", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Pittsburgh", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Pittsburgh", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Pittsburgh", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "Portland": [
        { team: "Portland", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "Portland St.": [
        { team: "Portland St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "Providence": [
        { team: "Providence", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Providence", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Providence", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Providence", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "Purdue": [
        { team: "Purdue", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Purdue", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Purdue", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Purdue", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Purdue", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Purdue", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Rhode Island": [
        { team: "Rhode Island", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Rhode Island", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Rhode Island", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Rice": [
        { team: "Rice", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Richmond": [
        { team: "Richmond", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Richmond", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "Richmond", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "Rutgers": [
        { team: "Rutgers", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Rutgers", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Rutgers", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Rutgers", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Rutgers", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Rutgers", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "SMU": [
        { team: "SMU", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "SMU", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "SMU", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "SMU", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "SMU", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "SMU", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Sacramento St.": [
        { team: "Sacramento St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
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
    "Saint Mary's (CA)": [
        { team: "Saint Mary's (CA)", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "Samford": [
        { team: "Samford", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "San Diego": [
        { team: "San Diego", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "San Diego St.": [
        { team: "San Diego St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "San Francisco": [
        { team: "San Francisco", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "San Jose St.": [
        { team: "San Jose St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Santa Clara": [
        { team: "Santa Clara", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
     ],
    "Seton Hall": [
        { team: "Seton Hall", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Seton Hall", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Seton Hall", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Seton Hall", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "South Alabama": [
        { team: "South Alabama", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "South Carolina": [
        { team: "South Carolina", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "South Carolina", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "South Carolina", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "South Carolina", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "South Carolina", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "South Carolina", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
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
    "South Fla.": [
        { team: "South Fla.", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "South Fla.", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "South Fla.", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "South Fla.", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "South Fla.", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "South Fla.", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Southern California": [
        { team: "Southern California", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Southern California", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Southern California", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Southern California", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Southern California", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Southern California", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Southern Ill.": [
        { team: "Southern Ill.", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Southern Miss.": [
        { team: "Southern Miss.", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Southern Utah": [
        { team: "Southern Utah", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "St. Bonaventure": [
        { team: "St. Bonaventure", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "St. Bonaventure", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "St. Bonaventure", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "St. John's (NY)": [
        { team: "St. John's (NY)", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "St. John's (NY)", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "St. John's (NY)", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "St. John's (NY)", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "Stanford": [
        { team: "Stanford", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Stanford", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Stanford", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Stanford", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Stanford", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Stanford", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Syracuse": [
        { team: "Syracuse", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
        { team: "Syracuse", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
        { team: "Syracuse", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
        { team: "Syracuse", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Syracuse", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
        { team: "Syracuse", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
     ],
    "TCU": [
        { team: "TCU", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "TCU", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "TCU", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "TCU", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "TCU", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "TCU", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Temple": [
        { team: "Temple", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "Temple", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "Temple", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "Temple", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Temple", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Temple", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "Tennessee": [
        { team: "Tennessee", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Tennessee", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Tennessee", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Tennessee", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Tennessee", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Tennessee", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Texas": [
        { team: "Texas", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Texas", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Texas", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Texas", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Texas", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Texas", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Texas A&M": [
        { team: "Texas A&M", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Texas A&M", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Texas A&M", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Texas A&M", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Texas A&M", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Texas A&M", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Texas St.": [
        { team: "Texas St.", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "Texas Tech": [
        { team: "Texas Tech", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Texas Tech", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Texas Tech", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "Texas Tech", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Texas Tech", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "Texas Tech", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "The Citadel": [
        { team: "The Citadel", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Toledo": [
        { team: "Toledo", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Towson": [
        { team: "Towson", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Troy": [
        { team: "Troy", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
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
    "UAB": [
        { team: "UAB", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "UCF": [
        { team: "UCF", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "UCF", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "UCF", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "UCF", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "UCF", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "UCF", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "UCLA": [
        { team: "UCLA", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "UCLA", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "UCLA", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "UCLA", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "UCLA", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "UCLA", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "UConn": [
        { team: "UConn", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "UConn", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "UConn", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "UConn", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "UConn", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "UConn", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],
    "ULM": [
        { team: "ULM", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "UNC Greensboro": [
        { team: "UNC Greensboro", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "UNCW": [
        { team: "UNCW", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "UNI": [
        { team: "UNI", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "UNLV": [
        { team: "UNLV", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "UT Arlington": [
        { team: "UT Arlington", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
     ],
    "UTEP": [
        { team: "UTEP", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "UTSA": [
        { team: "UTSA", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Utah": [
        { team: "Utah", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Utah", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Utah", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
        { team: "Utah", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Utah", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
        { team: "Utah", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
     ],
    "Utah St.": [
        { team: "Utah St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "VCU": [
        { team: "VCU", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "VCU", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
        { team: "VCU", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
     ],
    "VMI": [
        { team: "VMI", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Valparaiso": [
        { team: "Valparaiso", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
     ],
    "Vanderbilt": [
        { team: "Vanderbilt", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
        { team: "Vanderbilt", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
        { team: "Vanderbilt", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
        { team: "Vanderbilt", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Vanderbilt", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
        { team: "Vanderbilt", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
     ],
    "Villanova": [
        { team: "Villanova", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Villanova", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Villanova", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Villanova", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
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
    "Weber St.": [
        { team: "Weber St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "mid" },
     ],
    "West Virginia": [
        { team: "West Virginia", year: "2018/9", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "West Virginia", year: "2019/20", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "West Virginia", year: "2020/21", gender: "Men", index_template: "bigtwelve", category: "high" },
        { team: "West Virginia", year: "2018/9", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "West Virginia", year: "2019/20", gender: "Women", index_template: "women_bigtwelve", category: "high" },
        { team: "West Virginia", year: "2020/21", gender: "Women", index_template: "women_bigtwelve", category: "high" },
     ],
    "Western Caro.": [
        { team: "Western Caro.", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Western Ill.": [
        { team: "Western Ill.", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
     ],
    "Western Ky.": [
        { team: "Western Ky.", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
     ],
    "Western Mich.": [
        { team: "Western Mich.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
     ],
    "Wichita St.": [
        { team: "Wichita St.", year: "2018/9", gender: "Men", index_template: "american", category: "high" },
        { team: "Wichita St.", year: "2019/20", gender: "Men", index_template: "american", category: "high" },
        { team: "Wichita St.", year: "2020/21", gender: "Men", index_template: "american", category: "high" },
        { team: "Wichita St.", year: "2018/9", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Wichita St.", year: "2019/20", gender: "Women", index_template: "women_american", category: "high" },
        { team: "Wichita St.", year: "2020/21", gender: "Women", index_template: "women_american", category: "high" },
     ],
    "William & Mary": [
        { team: "William & Mary", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
     ],
    "Wisconsin": [
        { team: "Wisconsin", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Wisconsin", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Wisconsin", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
        { team: "Wisconsin", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Wisconsin", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
        { team: "Wisconsin", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
     ],
    "Wofford": [
        { team: "Wofford", year: "2020/21", gender: "Men", index_template: "socon", category: "mid" },
     ],
    "Wyoming": [
        { team: "Wyoming", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
     ],
    "Xavier": [
        { team: "Xavier", year: "2018/9", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Xavier", year: "2019/20", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Xavier", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
        { team: "Xavier", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
     ],

  };

  /** These are extra teams I've added for specific years */
  static readonly extraTeamsBase = [
    { team: "Maryland", year: "2014/5", gender: "Men", index_template: "misc_conf", category: "high" },
    { team: "Maryland", year: "2015/6", gender: "Men", index_template: "misc_conf", category: "high" },
    { team: "Maryland", year: "2016/7", gender: "Men", index_template: "misc_conf", category: "high" },
    { team: "Maryland", year: "2017/8", gender: "Men", index_template: "misc_conf", category: "high" },
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
