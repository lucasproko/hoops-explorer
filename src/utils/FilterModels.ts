
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
  filterGarbage?: boolean, //(missing iff "false")
  queryFilters?: string //(missing iff empty)
}

/** Extracts the common params from a superset */
export function getCommonFilterParams(p: CommonFilterParams) {
  return {
    year: p.year,
    team: p.team,
    gender: p.gender,
    minRank: p.minRank,
    maxRank: p.maxRank,
    baseQuery: p.baseQuery,
    filterGarbage: p.filterGarbage,
    queryFilters: p.queryFilters
  };
}

/** Combined params for game filtering */
export type GameFilterParams = {
  [P in keyof CommonFilterParams]?: CommonFilterParams[P];
} & {
  onQuery?: string,
  offQuery?: string,
  autoOffQuery?: boolean
  // Filtering of individual view:
  filter?: string,
  sortBy?: string,
  showBase?: boolean,
  showExpanded?: boolean,
  showDiag?: boolean
  possAsPct?: boolean
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
  regressDiffs?: string, //+ve to add that number of 0 samples, -ve to regress to the given sample size
  repOnOffDiagMode?: string //(tthe number of diagnostic lineups to show, basically 0 or 10)
  incRapm?: boolean
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
  static readonly defaultPlayerFilter = "";
  static readonly defaultPlayerSortBy = "desc:off_team_poss_pct:baseline";
  static readonly defaultPlayerDiagMode = false;
  static readonly defaultPlayerShowBase = false;
  static readonly defaultPlayerShowExpanded = false;
  static readonly defaultPlayerPossAsPct = true;
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
  static readonly defaultTeamReportIncRapm = false;
  static readonly defaultTeamReportRegressDiffs = "-2000";
  static readonly defaultTeamReportRepOnOffDiagMode = "0";
  // Common
  static readonly defaultTeam = "";
  static readonly defaultYear = "2019/20";
  static readonly defaultGender = "Men";
  static readonly defaultMinRank = "0";
  static readonly defaultMaxRank = "400";
  static readonly defaultFilterGarbage = false;
  static readonly defaultQueryFilters = "";
};
