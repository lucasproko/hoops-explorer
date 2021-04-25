
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
     "A&M-Corpus Christi": [
         { team: "A&M-Corpus Christi", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
      ],
     "Abilene Christian": [
         { team: "Abilene Christian", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
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
     "Alabama A&M": [
         { team: "Alabama A&M", year: "2020/21", gender: "Men", index_template: "swac", category: "low" },
      ],
     "Alcorn": [
         { team: "Alcorn", year: "2020/21", gender: "Men", index_template: "swac", category: "low" },
      ],
     "American": [
         { team: "American", year: "2020/21", gender: "Men", index_template: "patriot", category: "midlow" },
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
     "Ark.-Pine Bluff": [
         { team: "Ark.-Pine Bluff", year: "2020/21", gender: "Men", index_template: "swac", category: "low" },
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
     "Army West Point": [
         { team: "Army West Point", year: "2020/21", gender: "Men", index_template: "patriot", category: "midlow" },
      ],
     "Auburn": [
         { team: "Auburn", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
         { team: "Auburn", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
         { team: "Auburn", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
         { team: "Auburn", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
         { team: "Auburn", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
         { team: "Auburn", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
      ],
     "Austin Peay": [
         { team: "Austin Peay", year: "2020/21", gender: "Men", index_template: "ovc", category: "midlow" },
      ],
     "BYU": [
         { team: "BYU", year: "2018/9", gender: "Men", index_template: "misc_conf", category: "midhigh" },
         { team: "BYU", year: "2019/20", gender: "Men", index_template: "misc_conf", category: "midhigh" },
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
     "Belmont": [
         { team: "Belmont", year: "2020/21", gender: "Men", index_template: "ovc", category: "midlow" },
      ],
     "Binghamton": [
         { team: "Binghamton", year: "2020/21", gender: "Men", index_template: "americaeast", category: "low" },
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
     "Boston U.": [
         { team: "Boston U.", year: "2020/21", gender: "Men", index_template: "patriot", category: "midlow" },
      ],
     "Bowling Green": [
         { team: "Bowling Green", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
      ],
     "Bradley": [
         { team: "Bradley", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
      ],
     "Bryant": [
         { team: "Bryant", year: "2020/21", gender: "Men", index_template: "nec", category: "low" },
      ],
     "Bucknell": [
         { team: "Bucknell", year: "2020/21", gender: "Men", index_template: "patriot", category: "midlow" },
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
     "CSU Bakersfield": [
         { team: "CSU Bakersfield", year: "2020/21", gender: "Men", index_template: "bigwest", category: "mid" },
      ],
     "CSUN": [
         { team: "CSUN", year: "2020/21", gender: "Men", index_template: "bigwest", category: "mid" },
      ],
     "Cal Poly": [
         { team: "Cal Poly", year: "2020/21", gender: "Men", index_template: "bigwest", category: "mid" },
      ],
     "Cal St. Fullerton": [
         { team: "Cal St. Fullerton", year: "2020/21", gender: "Men", index_template: "bigwest", category: "mid" },
      ],
     "California": [
         { team: "California", year: "2018/9", gender: "Men", index_template: "pactwelve", category: "high" },
         { team: "California", year: "2019/20", gender: "Men", index_template: "pactwelve", category: "high" },
         { team: "California", year: "2020/21", gender: "Men", index_template: "pactwelve", category: "high" },
         { team: "California", year: "2018/9", gender: "Women", index_template: "women_pactwelve", category: "high" },
         { team: "California", year: "2019/20", gender: "Women", index_template: "women_pactwelve", category: "high" },
         { team: "California", year: "2020/21", gender: "Women", index_template: "women_pactwelve", category: "high" },
      ],
     "Campbell": [
         { team: "Campbell", year: "2020/21", gender: "Men", index_template: "bigsouth", category: "low" },
      ],
     "Canisius": [
         { team: "Canisius", year: "2020/21", gender: "Men", index_template: "maac", category: "midlow" },
      ],
     "Central Ark.": [
         { team: "Central Ark.", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
      ],
     "Central Conn. St.": [
         { team: "Central Conn. St.", year: "2020/21", gender: "Men", index_template: "nec", category: "low" },
      ],
     "Central Mich.": [
         { team: "Central Mich.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
      ],
     "Charleston So.": [
         { team: "Charleston So.", year: "2020/21", gender: "Men", index_template: "bigsouth", category: "low" },
      ],
     "Charlotte": [
         { team: "Charlotte", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
      ],
     "Chattanooga": [
         { team: "Chattanooga", year: "2020/21", gender: "Men", index_template: "socon", category: "midlow" },
      ],
     "Chicago St.": [
         { team: "Chicago St.", year: "2020/21", gender: "Men", index_template: "wac", category: "midlow" },
      ],
     "Cincinnati": [
         { team: "Cincinnati", year: "2018/9", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Cincinnati", year: "2019/20", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Cincinnati", year: "2020/21", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Cincinnati", year: "2018/9", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Cincinnati", year: "2019/20", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Cincinnati", year: "2020/21", gender: "Women", index_template: "women_american", category: "midhigh" },
      ],
     "Clemson": [
         { team: "Clemson", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
         { team: "Clemson", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
         { team: "Clemson", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
         { team: "Clemson", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
         { team: "Clemson", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
         { team: "Clemson", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
      ],
     "Cleveland St.": [
         { team: "Cleveland St.", year: "2020/21", gender: "Men", index_template: "horizon", category: "mid" },
      ],
     "Coastal Carolina": [
         { team: "Coastal Carolina", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
      ],
     "Col. of Charleston": [
         { team: "Col. of Charleston", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
      ],
     "Colgate": [
         { team: "Colgate", year: "2020/21", gender: "Men", index_template: "patriot", category: "midlow" },
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
     "Coppin St.": [
         { team: "Coppin St.", year: "2020/21", gender: "Men", index_template: "meac", category: "low" },
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
     "Delaware St.": [
         { team: "Delaware St.", year: "2020/21", gender: "Men", index_template: "meac", category: "low" },
      ],
     "Denver": [
         { team: "Denver", year: "2020/21", gender: "Men", index_template: "summit", category: "mid" },
      ],
     "Detroit Mercy": [
         { team: "Detroit Mercy", year: "2020/21", gender: "Men", index_template: "horizon", category: "mid" },
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
         { team: "ETSU", year: "2020/21", gender: "Men", index_template: "socon", category: "midlow" },
      ],
     "East Carolina": [
         { team: "East Carolina", year: "2018/9", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "East Carolina", year: "2019/20", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "East Carolina", year: "2020/21", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "East Carolina", year: "2018/9", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "East Carolina", year: "2019/20", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "East Carolina", year: "2020/21", gender: "Women", index_template: "women_american", category: "midhigh" },
      ],
     "Eastern Ill.": [
         { team: "Eastern Ill.", year: "2020/21", gender: "Men", index_template: "ovc", category: "midlow" },
      ],
     "Eastern Ky.": [
         { team: "Eastern Ky.", year: "2020/21", gender: "Men", index_template: "ovc", category: "midlow" },
      ],
     "Eastern Mich.": [
         { team: "Eastern Mich.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
      ],
     "Eastern Wash.": [
         { team: "Eastern Wash.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "midlow" },
      ],
     "Elon": [
         { team: "Elon", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
      ],
     "Evansville": [
         { team: "Evansville", year: "2020/21", gender: "Men", index_template: "mvc", category: "mid" },
      ],
     "FGCU": [
         { team: "FGCU", year: "2020/21", gender: "Men", index_template: "atlanticsun", category: "low" },
      ],
     "FIU": [
         { team: "FIU", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
      ],
     "Fairfield": [
         { team: "Fairfield", year: "2020/21", gender: "Men", index_template: "maac", category: "midlow" },
      ],
     "Fairleigh Dickinson": [
         { team: "Fairleigh Dickinson", year: "2020/21", gender: "Men", index_template: "nec", category: "low" },
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
     "Florida A&M": [
         { team: "Florida A&M", year: "2020/21", gender: "Men", index_template: "meac", category: "low" },
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
         { team: "Furman", year: "2020/21", gender: "Men", index_template: "socon", category: "midlow" },
      ],
     "Ga. Southern": [
         { team: "Ga. Southern", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
      ],
     "Gardner-Webb": [
         { team: "Gardner-Webb", year: "2020/21", gender: "Men", index_template: "bigsouth", category: "low" },
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
         { team: "Gonzaga", year: "2018/9", gender: "Men", index_template: "misc_conf", category: "midhigh" },
         { team: "Gonzaga", year: "2019/20", gender: "Men", index_template: "misc_conf", category: "midhigh" },
         { team: "Gonzaga", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
      ],
     "Grambling": [
         { team: "Grambling", year: "2020/21", gender: "Men", index_template: "swac", category: "low" },
      ],
     "Grand Canyon": [
         { team: "Grand Canyon", year: "2020/21", gender: "Men", index_template: "wac", category: "midlow" },
      ],
     "Green Bay": [
         { team: "Green Bay", year: "2020/21", gender: "Men", index_template: "horizon", category: "mid" },
      ],
     "Hampton": [
         { team: "Hampton", year: "2020/21", gender: "Men", index_template: "bigsouth", category: "low" },
      ],
     "Hartford": [
         { team: "Hartford", year: "2020/21", gender: "Men", index_template: "americaeast", category: "low" },
      ],
     "Hawaii": [
         { team: "Hawaii", year: "2020/21", gender: "Men", index_template: "bigwest", category: "mid" },
      ],
     "High Point": [
         { team: "High Point", year: "2020/21", gender: "Men", index_template: "bigsouth", category: "low" },
      ],
     "Hofstra": [
         { team: "Hofstra", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
      ],
     "Holy Cross": [
         { team: "Holy Cross", year: "2020/21", gender: "Men", index_template: "patriot", category: "midlow" },
      ],
     "Houston": [
         { team: "Houston", year: "2018/9", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Houston", year: "2019/20", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Houston", year: "2020/21", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Houston", year: "2018/9", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Houston", year: "2019/20", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Houston", year: "2020/21", gender: "Women", index_template: "women_american", category: "midhigh" },
      ],
     "Houston Baptist": [
         { team: "Houston Baptist", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
      ],
     "Howard": [
         { team: "Howard", year: "2020/21", gender: "Men", index_template: "meac", category: "low" },
      ],
     "IUPUI": [
         { team: "IUPUI", year: "2020/21", gender: "Men", index_template: "horizon", category: "mid" },
      ],
     "Idaho": [
         { team: "Idaho", year: "2020/21", gender: "Men", index_template: "bigsky", category: "midlow" },
      ],
     "Idaho St.": [
         { team: "Idaho St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "midlow" },
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
     "Iona": [
         { team: "Iona", year: "2020/21", gender: "Men", index_template: "maac", category: "midlow" },
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
     "Jackson St.": [
         { team: "Jackson St.", year: "2020/21", gender: "Men", index_template: "swac", category: "low" },
      ],
     "Jacksonville": [
         { team: "Jacksonville", year: "2020/21", gender: "Men", index_template: "atlanticsun", category: "low" },
      ],
     "Jacksonville St.": [
         { team: "Jacksonville St.", year: "2020/21", gender: "Men", index_template: "ovc", category: "midlow" },
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
     "Kennesaw St.": [
         { team: "Kennesaw St.", year: "2020/21", gender: "Men", index_template: "atlanticsun", category: "low" },
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
     "LIU": [
         { team: "LIU", year: "2020/21", gender: "Men", index_template: "nec", category: "low" },
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
     "Lafayette": [
         { team: "Lafayette", year: "2020/21", gender: "Men", index_template: "patriot", category: "midlow" },
      ],
     "Lamar University": [
         { team: "Lamar University", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
      ],
     "Lehigh": [
         { team: "Lehigh", year: "2020/21", gender: "Men", index_template: "patriot", category: "midlow" },
      ],
     "Liberty": [
         { team: "Liberty", year: "2020/21", gender: "Men", index_template: "atlanticsun", category: "low" },
      ],
     "Lipscomb": [
         { team: "Lipscomb", year: "2020/21", gender: "Men", index_template: "atlanticsun", category: "low" },
      ],
     "Little Rock": [
         { team: "Little Rock", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
      ],
     "Long Beach St.": [
         { team: "Long Beach St.", year: "2020/21", gender: "Men", index_template: "bigwest", category: "mid" },
      ],
     "Longwood": [
         { team: "Longwood", year: "2020/21", gender: "Men", index_template: "bigsouth", category: "low" },
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
     "Loyola Maryland": [
         { team: "Loyola Maryland", year: "2020/21", gender: "Men", index_template: "patriot", category: "midlow" },
      ],
     "Manhattan": [
         { team: "Manhattan", year: "2020/21", gender: "Men", index_template: "maac", category: "midlow" },
      ],
     "Marist": [
         { team: "Marist", year: "2020/21", gender: "Men", index_template: "maac", category: "midlow" },
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
     "McNeese": [
         { team: "McNeese", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
      ],
     "Memphis": [
         { team: "Memphis", year: "2018/9", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Memphis", year: "2019/20", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Memphis", year: "2020/21", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Memphis", year: "2018/9", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Memphis", year: "2019/20", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Memphis", year: "2020/21", gender: "Women", index_template: "women_american", category: "midhigh" },
      ],
     "Mercer": [
         { team: "Mercer", year: "2020/21", gender: "Men", index_template: "socon", category: "midlow" },
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
     "Milwaukee": [
         { team: "Milwaukee", year: "2020/21", gender: "Men", index_template: "horizon", category: "mid" },
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
     "Mississippi Val.": [
         { team: "Mississippi Val.", year: "2020/21", gender: "Men", index_template: "swac", category: "low" },
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
     "Monmouth": [
         { team: "Monmouth", year: "2020/21", gender: "Men", index_template: "maac", category: "midlow" },
      ],
     "Montana": [
         { team: "Montana", year: "2020/21", gender: "Men", index_template: "bigsky", category: "midlow" },
      ],
     "Montana St.": [
         { team: "Montana St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "midlow" },
      ],
     "Morehead St.": [
         { team: "Morehead St.", year: "2020/21", gender: "Men", index_template: "ovc", category: "midlow" },
      ],
     "Morgan St.": [
         { team: "Morgan St.", year: "2020/21", gender: "Men", index_template: "meac", category: "low" },
      ],
     "Mount St. Mary's": [
         { team: "Mount St. Mary's", year: "2020/21", gender: "Men", index_template: "nec", category: "low" },
      ],
     "Murray St.": [
         { team: "Murray St.", year: "2020/21", gender: "Men", index_template: "ovc", category: "midlow" },
      ],
     "N.C. A&T": [
         { team: "N.C. A&T", year: "2020/21", gender: "Men", index_template: "meac", category: "low" },
      ],
     "N.C. Central": [
         { team: "N.C. Central", year: "2020/21", gender: "Men", index_template: "meac", category: "low" },
      ],
     "NC State": [
         { team: "NC State", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
         { team: "NC State", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
         { team: "NC State", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
         { team: "NC State", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
         { team: "NC State", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
         { team: "NC State", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
      ],
     "Navy": [
         { team: "Navy", year: "2020/21", gender: "Men", index_template: "patriot", category: "midlow" },
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
     "New Hampshire": [
         { team: "New Hampshire", year: "2020/21", gender: "Men", index_template: "americaeast", category: "low" },
      ],
     "New Mexico": [
         { team: "New Mexico", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
      ],
     "New Mexico St.": [
         { team: "New Mexico St.", year: "2020/21", gender: "Men", index_template: "wac", category: "midlow" },
      ],
     "New Orleans": [
         { team: "New Orleans", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
      ],
     "Niagara": [
         { team: "Niagara", year: "2020/21", gender: "Men", index_template: "maac", category: "midlow" },
      ],
     "Nicholls St.": [
         { team: "Nicholls St.", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
      ],
     "Norfolk St.": [
         { team: "Norfolk St.", year: "2020/21", gender: "Men", index_template: "meac", category: "low" },
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
     "North Florida": [
         { team: "North Florida", year: "2020/21", gender: "Men", index_template: "atlanticsun", category: "low" },
      ],
     "North Texas": [
         { team: "North Texas", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
      ],
     "Northeastern": [
         { team: "Northeastern", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
      ],
     "Northern Ariz.": [
         { team: "Northern Ariz.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "midlow" },
      ],
     "Northern Colo.": [
         { team: "Northern Colo.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "midlow" },
      ],
     "Northern Ill.": [
         { team: "Northern Ill.", year: "2020/21", gender: "Men", index_template: "mac", category: "mid" },
      ],
     "Northern Ky.": [
         { team: "Northern Ky.", year: "2020/21", gender: "Men", index_template: "horizon", category: "mid" },
      ],
     "Northwestern": [
         { team: "Northwestern", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
         { team: "Northwestern", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
         { team: "Northwestern", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
         { team: "Northwestern", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
         { team: "Northwestern", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
         { team: "Northwestern", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
      ],
     "Northwestern St.": [
         { team: "Northwestern St.", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
      ],
     "Notre Dame": [
         { team: "Notre Dame", year: "2018/9", gender: "Men", index_template: "acc", category: "high" },
         { team: "Notre Dame", year: "2019/20", gender: "Men", index_template: "acc", category: "high" },
         { team: "Notre Dame", year: "2020/21", gender: "Men", index_template: "acc", category: "high" },
         { team: "Notre Dame", year: "2018/9", gender: "Women", index_template: "women_acc", category: "high" },
         { team: "Notre Dame", year: "2019/20", gender: "Women", index_template: "women_acc", category: "high" },
         { team: "Notre Dame", year: "2020/21", gender: "Women", index_template: "women_acc", category: "high" },
      ],
     "Oakland": [
         { team: "Oakland", year: "2020/21", gender: "Men", index_template: "horizon", category: "mid" },
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
         { team: "Portland St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "midlow" },
      ],
     "Prairie View": [
         { team: "Prairie View", year: "2020/21", gender: "Men", index_template: "swac", category: "low" },
      ],
     "Presbyterian": [
         { team: "Presbyterian", year: "2020/21", gender: "Men", index_template: "bigsouth", category: "low" },
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
     "Purdue Fort Wayne": [
         { team: "Purdue Fort Wayne", year: "2020/21", gender: "Men", index_template: "horizon", category: "mid" },
      ],
     "Quinnipiac": [
         { team: "Quinnipiac", year: "2020/21", gender: "Men", index_template: "maac", category: "midlow" },
      ],
     "Radford": [
         { team: "Radford", year: "2020/21", gender: "Men", index_template: "bigsouth", category: "low" },
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
     "Rider": [
         { team: "Rider", year: "2020/21", gender: "Men", index_template: "maac", category: "midlow" },
      ],
     "Robert Morris": [
         { team: "Robert Morris", year: "2020/21", gender: "Men", index_template: "horizon", category: "mid" },
      ],
     "Rutgers": [
         { team: "Rutgers", year: "2018/9", gender: "Men", index_template: "bigten", category: "high" },
         { team: "Rutgers", year: "2019/20", gender: "Men", index_template: "bigten", category: "high" },
         { team: "Rutgers", year: "2020/21", gender: "Men", index_template: "bigten", category: "high" },
         { team: "Rutgers", year: "2018/9", gender: "Women", index_template: "women_bigten", category: "high" },
         { team: "Rutgers", year: "2019/20", gender: "Women", index_template: "women_bigten", category: "high" },
         { team: "Rutgers", year: "2020/21", gender: "Women", index_template: "women_bigten", category: "high" },
      ],
     "SFA": [
         { team: "SFA", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
      ],
     "SIUE": [
         { team: "SIUE", year: "2020/21", gender: "Men", index_template: "ovc", category: "midlow" },
      ],
     "SMU": [
         { team: "SMU", year: "2018/9", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "SMU", year: "2019/20", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "SMU", year: "2020/21", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "SMU", year: "2018/9", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "SMU", year: "2019/20", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "SMU", year: "2020/21", gender: "Women", index_template: "women_american", category: "midhigh" },
      ],
     "Sacramento St.": [
         { team: "Sacramento St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "midlow" },
      ],
     "Sacred Heart": [
         { team: "Sacred Heart", year: "2020/21", gender: "Men", index_template: "nec", category: "low" },
      ],
     "Saint Francis (PA)": [
         { team: "Saint Francis (PA)", year: "2020/21", gender: "Men", index_template: "nec", category: "low" },
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
        { team: "Saint Mary's (CA)", year: "2018/9", gender: "Men", index_template: "misc_conf", category: "midhigh" },
        { team: "Saint Mary's (CA)", year: "2019/20", gender: "Men", index_template: "misc_conf", category: "midhigh" },
        { team: "Saint Mary's (CA)", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
      ],
     "Saint Peter's": [
         { team: "Saint Peter's", year: "2020/21", gender: "Men", index_template: "maac", category: "midlow" },
      ],
     "Sam Houston St.": [
         { team: "Sam Houston St.", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
      ],
     "Samford": [
         { team: "Samford", year: "2020/21", gender: "Men", index_template: "socon", category: "midlow" },
      ],
     "San Diego": [
         { team: "San Diego", year: "2020/21", gender: "Men", index_template: "wcc", category: "midhigh" },
      ],
     "San Diego St.": [
         { team: "San Diego St.", year: "2018/9", gender: "Men", index_template: "misc_conf", category: "midhigh" },
         { team: "San Diego St.", year: "2019/20", gender: "Men", index_template: "misc_conf", category: "midhigh" },
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
     "Seattle U": [
         { team: "Seattle U", year: "2020/21", gender: "Men", index_template: "wac", category: "midlow" },
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
     "South Carolina St.": [
         { team: "South Carolina St.", year: "2020/21", gender: "Men", index_template: "meac", category: "low" },
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
         { team: "South Fla.", year: "2018/9", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "South Fla.", year: "2019/20", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "South Fla.", year: "2020/21", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "South Fla.", year: "2018/9", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "South Fla.", year: "2019/20", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "South Fla.", year: "2020/21", gender: "Women", index_template: "women_american", category: "midhigh" },
      ],
     "Southeast Mo. St.": [
         { team: "Southeast Mo. St.", year: "2020/21", gender: "Men", index_template: "ovc", category: "midlow" },
      ],
     "Southeastern La.": [
         { team: "Southeastern La.", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
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
     "Southern U.": [
         { team: "Southern U.", year: "2020/21", gender: "Men", index_template: "swac", category: "low" },
      ],
     "Southern Utah": [
         { team: "Southern Utah", year: "2020/21", gender: "Men", index_template: "bigsky", category: "midlow" },
      ],
     "St. Bonaventure": [
         { team: "St. Bonaventure", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
         { team: "St. Bonaventure", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
         { team: "St. Bonaventure", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
      ],
     "St. Francis Brooklyn": [
         { team: "St. Francis Brooklyn", year: "2020/21", gender: "Men", index_template: "nec", category: "low" },
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
     "Stetson": [
         { team: "Stetson", year: "2020/21", gender: "Men", index_template: "atlanticsun", category: "low" },
      ],
     "Stony Brook": [
         { team: "Stony Brook", year: "2020/21", gender: "Men", index_template: "americaeast", category: "low" },
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
         { team: "Temple", year: "2018/9", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Temple", year: "2019/20", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Temple", year: "2020/21", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Temple", year: "2018/9", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Temple", year: "2019/20", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Temple", year: "2020/21", gender: "Women", index_template: "women_american", category: "midhigh" },
      ],
     "Tennessee": [
         { team: "Tennessee", year: "2018/9", gender: "Men", index_template: "sec", category: "high" },
         { team: "Tennessee", year: "2019/20", gender: "Men", index_template: "sec", category: "high" },
         { team: "Tennessee", year: "2020/21", gender: "Men", index_template: "sec", category: "high" },
         { team: "Tennessee", year: "2018/9", gender: "Women", index_template: "women_sec", category: "high" },
         { team: "Tennessee", year: "2019/20", gender: "Women", index_template: "women_sec", category: "high" },
         { team: "Tennessee", year: "2020/21", gender: "Women", index_template: "women_sec", category: "high" },
      ],
     "Tennessee St.": [
         { team: "Tennessee St.", year: "2020/21", gender: "Men", index_template: "ovc", category: "midlow" },
      ],
     "Tennessee Tech": [
         { team: "Tennessee Tech", year: "2020/21", gender: "Men", index_template: "ovc", category: "midlow" },
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
     "Texas Southern": [
         { team: "Texas Southern", year: "2020/21", gender: "Men", index_template: "swac", category: "low" },
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
         { team: "The Citadel", year: "2020/21", gender: "Men", index_template: "socon", category: "midlow" },
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
         { team: "Tulane", year: "2018/9", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Tulane", year: "2019/20", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Tulane", year: "2020/21", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Tulane", year: "2018/9", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Tulane", year: "2019/20", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Tulane", year: "2020/21", gender: "Women", index_template: "women_american", category: "midhigh" },
      ],
     "Tulsa": [
         { team: "Tulsa", year: "2018/9", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Tulsa", year: "2019/20", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Tulsa", year: "2020/21", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Tulsa", year: "2018/9", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Tulsa", year: "2019/20", gender: "Women", index_template: "women_american", category: "midhigh" },
      ],
     "UAB": [
         { team: "UAB", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
      ],
     "UC Davis": [
         { team: "UC Davis", year: "2020/21", gender: "Men", index_template: "bigwest", category: "mid" },
      ],
     "UC Irvine": [
         { team: "UC Irvine", year: "2020/21", gender: "Men", index_template: "bigwest", category: "mid" },
      ],
     "UC Riverside": [
         { team: "UC Riverside", year: "2020/21", gender: "Men", index_template: "bigwest", category: "mid" },
      ],
     "UC Santa Barbara": [
         { team: "UC Santa Barbara", year: "2020/21", gender: "Men", index_template: "bigwest", category: "mid" },
      ],
     "UCF": [
         { team: "UCF", year: "2018/9", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "UCF", year: "2019/20", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "UCF", year: "2020/21", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "UCF", year: "2018/9", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "UCF", year: "2019/20", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "UCF", year: "2020/21", gender: "Women", index_template: "women_american", category: "midhigh" },
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
         { team: "UConn", year: "2018/9", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "UConn", year: "2019/20", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "UConn", year: "2020/21", gender: "Men", index_template: "bigeast", category: "high" },
         { team: "UConn", year: "2018/9", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "UConn", year: "2019/20", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "UConn", year: "2020/21", gender: "Women", index_template: "women_bigeast", category: "high" },
      ],
     "UIC": [
         { team: "UIC", year: "2020/21", gender: "Men", index_template: "horizon", category: "mid" },
      ],
     "UIW": [
         { team: "UIW", year: "2020/21", gender: "Men", index_template: "southland", category: "low" },
      ],
     "ULM": [
         { team: "ULM", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
      ],
     "UMBC": [
         { team: "UMBC", year: "2020/21", gender: "Men", index_template: "americaeast", category: "low" },
      ],
     "UMass Lowell": [
         { team: "UMass Lowell", year: "2020/21", gender: "Men", index_template: "americaeast", category: "low" },
      ],
     "UNC Asheville": [
         { team: "UNC Asheville", year: "2020/21", gender: "Men", index_template: "bigsouth", category: "low" },
      ],
     "UNC Greensboro": [
         { team: "UNC Greensboro", year: "2020/21", gender: "Men", index_template: "socon", category: "midlow" },
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
     "USC Upstate": [
         { team: "USC Upstate", year: "2020/21", gender: "Men", index_template: "bigsouth", category: "low" },
      ],
     "UT Arlington": [
         { team: "UT Arlington", year: "2020/21", gender: "Men", index_template: "sunbelt", category: "mid" },
      ],
     "UT Martin": [
         { team: "UT Martin", year: "2020/21", gender: "Men", index_template: "ovc", category: "midlow" },
      ],
     "UTEP": [
         { team: "UTEP", year: "2020/21", gender: "Men", index_template: "conferenceusa", category: "mid" },
      ],
     "UTRGV": [
         { team: "UTRGV", year: "2020/21", gender: "Men", index_template: "wac", category: "midlow" },
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
         { team: "Utah St.", year: "2018/9", gender: "Men", index_template: "misc_conf", category: "midhigh" },
         { team: "Utah St.", year: "2019/20", gender: "Men", index_template: "misc_conf", category: "midhigh" },
         { team: "Utah St.", year: "2020/21", gender: "Men", index_template: "mountainwest", category: "midhigh" },
      ],
     "Utah Valley": [
         { team: "Utah Valley", year: "2020/21", gender: "Men", index_template: "wac", category: "midlow" },
      ],
     "VCU": [
         { team: "VCU", year: "2018/9", gender: "Men", index_template: "atlanticten", category: "midhigh" },
         { team: "VCU", year: "2019/20", gender: "Men", index_template: "atlanticten", category: "midhigh" },
         { team: "VCU", year: "2020/21", gender: "Men", index_template: "atlanticten", category: "midhigh" },
      ],
     "VMI": [
         { team: "VMI", year: "2020/21", gender: "Men", index_template: "socon", category: "midlow" },
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
     "Wagner": [
         { team: "Wagner", year: "2020/21", gender: "Men", index_template: "nec", category: "low" },
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
         { team: "Weber St.", year: "2020/21", gender: "Men", index_template: "bigsky", category: "midlow" },
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
         { team: "Western Caro.", year: "2020/21", gender: "Men", index_template: "socon", category: "midlow" },
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
         { team: "Wichita St.", year: "2018/9", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Wichita St.", year: "2019/20", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Wichita St.", year: "2020/21", gender: "Men", index_template: "american", category: "midhigh" },
         { team: "Wichita St.", year: "2018/9", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Wichita St.", year: "2019/20", gender: "Women", index_template: "women_american", category: "midhigh" },
         { team: "Wichita St.", year: "2020/21", gender: "Women", index_template: "women_american", category: "midhigh" },
      ],
     "William & Mary": [
         { team: "William & Mary", year: "2020/21", gender: "Men", index_template: "colonial", category: "mid" },
      ],
     "Winthrop": [
         { team: "Winthrop", year: "2020/21", gender: "Men", index_template: "bigsouth", category: "low" },
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
         { team: "Wofford", year: "2020/21", gender: "Men", index_template: "socon", category: "midlow" },
      ],
     "Wright St.": [
         { team: "Wright St.", year: "2020/21", gender: "Men", index_template: "horizon", category: "mid" },
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
     "Youngstown St.": [
         { team: "Youngstown St.", year: "2020/21", gender: "Men", index_template: "horizon", category: "mid" },
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
