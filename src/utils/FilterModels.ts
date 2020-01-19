
export class ParamPrefixes {
  static readonly game = "game-";
  static readonly lineup = "lineup-";
  static readonly report = "report-";
}

/** Params for game filtering */
export type GameFilterParams = {
  year?: string,
  team?: string,
  gender?: string,
  autoOffQuery?: string;
  onQuery?: string,
  offQuery?: string,
  baseQuery?: string,
  minRank?: string,
  maxRank?: string
};

/** Params for lineup filtering */
export type LineupFilterParams = {
  year?: string,
  team?: string,
  gender?: string,
  lineupQuery?: string,
  minRank?: string,
  maxRank?: string,
  // These params need to be explicitly merged in buildParamsFromState(true)
  // For sorting in the generated table:
  minPoss?: string,
  maxTableSize?: string,
  sortBy?: string,
  // Filtering:
  filter?: string
};

export type TeamReportFilterParams = {
  year?: string,
  team?: string,
  gender?: string,
  lineupQuery?: string,
  minRank?: string,
  maxRank?: string,
  // These params need to be explicitly merged in buildParamsFromState(true)
  // For sorting in the generated table:
  sortBy?: string,
  // Filtering:
  filter?: string,
  showComps?: string
};

export class ParamDefaults {
  // Game
  static readonly defaultAutoOffQuery = "true";
  // Lineup
  static readonly defaultLineupMinPos = "5";
  static readonly defaultLineupMaxTableSize = "50";
  static readonly defaultLineupSortBy = "desc:off_poss";
  static readonly defaultLineupFilter = "";
  // Report
  static readonly defaultTeamReportSortBy = "desc:off_poss:on";
  static readonly defaultTeamReportFilter = "";
  static readonly defaultShowComps = "true";
  // Common
  static readonly defaultTeam = "";
  static readonly defaultYear = "2019/20";
  static readonly defaultGender = "Men";
  static readonly defaultMinRank = "0";
  static readonly defaultMaxRank = "400";
}
