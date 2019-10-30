
export type AvailableTeamMeta = {
  team: string,
  year: string,
  gender: string,
  index_template: string
}

export class AvailableTeams {

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
  static readonly byName: Record<string, Array<AvailableTeamMeta>> = {
    // Maryland!
    "Maryland": [
      { team: "Maryland", year: "2016/7", gender: "Men", index_template: "maryland" },
      { team: "Maryland", year: "2018/9", gender: "Men", index_template: "misc_conf" },
      { team: "Maryland", year: "2018/9", gender: "Women", index_template: "women_bigten" },
    ],
    // Other BIG
    "Indiana": [
      { team: "Indiana", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    "Nebraska": [
      { team: "Nebraska", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    "Wisconsin": [
      { team: "Wisconsin", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    "Ohio St.": [
      { team: "Ohio St.", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    "Michigan St.": [
      { team: "Michigan St.", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    "Iowa": [
      { team: "Iowa", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    "Michigan": [
      { team: "Michigan", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    "Purdue": [
      { team: "Purdue", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    "Illinois": [
      { team: "Illinois", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    "Penn St.": [
      { team: "Penn St.", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    "Northwestern": [
      { team: "Northwestern", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    "Rutgers": [
      { team: "Rutgers", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    "Minnesota": [
      { team: "Minnesota", year: "2018/9", gender: "Men", index_template: "bigten" },
    ],
    // Misc
    "Cincinnati": [
      { team: "Cincinnati", year: "2018/9", gender: "Men", index_template: "misc_conf" },
    ],
    "Kentucky": [
      { team: "Kentucky", year: "2018/9", gender: "Men", index_template: "misc_conf" },
    ],
    "Louisville": [
      { team: "Louisville", year: "2018/9", gender: "Men", index_template: "misc_conf" },
    ],
    "Saint Mary's (CA)": [
      { team: "Saint Mary's (CA)", year: "2018/9", gender: "Men", index_template: "misc_conf" },
    ],
    "Virginia": [
      { team: "Virginia", year: "2018/9", gender: "Men", index_template: "misc_conf" },
    ],
    "UConn": [
      { team: "UConn", year: "2018/9", gender: "Men", index_template: "misc_conf" },
    ],
  }
}
