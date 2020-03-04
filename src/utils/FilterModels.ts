
export class ParamPrefixes {
  static readonly game = "game-";
  static readonly lineup = "lineup-";
  static readonly report = "report-"; //(not used currrently, we re-use lineup)
  static readonly roster = "roster-";
}

/** Common params across all filter types */
export type CommonFilterParams = {
  year?: string,
  team?: string,
  gender?: string,
  minRank?: string,
  maxRank?: string,
  baseQuery?: string,
  filterGarbage?: boolean //(missing iff "false")
}

/** Combined params for game filtering */
export type GameFilterParams = {
  [P in keyof CommonFilterParams]?: CommonFilterParams[P];
} & {
  onQuery?: string,
  offQuery?: string,
  autoOffQuery?: boolean
};

/** Params for lineup filtering */
export type LineupFilterParams = {
  [P in keyof CommonFilterParams]?: CommonFilterParams[P];
} & {
  // These params need to be explicitly merged in buildParamsFromState(true)
  // For sorting in the generated table:
  minPoss?: string,
  maxTableSize?: string,
  sortBy?: string,
  // Filtering:
  filter?: string
};

export type TeamReportFilterParams = {
  [P in keyof CommonFilterParams]?: CommonFilterParams[P];
} & {
  // These params need to be explicitly merged in buildParamsFromState(true)
  // For sorting in the generated table:
  sortBy?: string,
  // Filtering:
  filter?: string,
  showOnOff?: boolean,
  showComps?: boolean,
  incRepOnOff?: boolean,
  regressDiffs?: boolean
};

/** Used to give compile errors if a field is omitted, for fw compat */
export type RequiredTeamReportFilterParams = {
  [P in keyof TeamReportFilterParams]?: TeamReportFilterParams[P];
} & {
  [P in keyof Required<CommonFilterParams>]: CommonFilterParams[P] | undefined;
};

export class ParamDefaults {
  // Game
  static readonly defaultAutoOffQuery = true;
  // Lineup
  static readonly defaultLineupMinPos = "5";
  static readonly defaultLineupMaxTableSize = "50";
  static readonly defaultLineupSortBy = "desc:off_poss";
  static readonly defaultLineupFilter = "";
  // Report
  static readonly defaultTeamReportSortBy = "desc:off_poss:on";
  static readonly defaultTeamReportFilter = "";
  static readonly defaultShowOnOff = true;
  static readonly defaultShowComps = true;
  static readonly defaultTeamReportIncRepOnOff = false;
  static readonly defaultTeamReportRegressDiffs = true;
  // Common
  static readonly defaultTeam = "";
  static readonly defaultYear = "2019/20";
  static readonly defaultGender = "Men";
  static readonly defaultMinRank = "0";
  static readonly defaultMaxRank = "400";
  static readonly defaultFilterGarbage = false;
}
