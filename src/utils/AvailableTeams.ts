
export type AvailableTeamMeta = {
  team: string,
  year: string,
  gender: string,
  index_template: string
}

export class AvailableTeams {
  static getTeams(
    team: string | null, year: string | null, gender: string | null
  ): Array<AvailableTeamMeta> {
    const list = team ?
      (AvailableTeams.byName[team] || ([] as Array<AvailableTeamMeta>)) :
      (Object.values(AvailableTeams.byName).flat(1) as Array<AvailableTeamMeta>);

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
    "Maryland": [
      { team: "Maryland", year: "2016/7", gender: "Men", index_template: "maryland" },
      { team: "Maryland", year: "2018/9", gender: "Men", index_template: "misc_conf" },
      { team: "Maryland", year: "2018/9", gender: "Women", index_template: "women_big10" },
    ],
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
