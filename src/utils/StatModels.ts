// React imports:
import React from 'react';

import { OffLuckAdjustmentDiags, DefLuckAdjustmentDiags } from "./stats/LuckUtils";
import { ORtgDiagnostics, DRtgDiagnostics } from "./stats/RatingUtils";

/** Represents a player, lineup, or team statistic */
export type Statistic = {
  /** The current most relevant number */
  value?: number,
  /** If a number was overridden by manual or luck adjustments, the original */
  old_value?: number,
  /** Provides some context for value */
  extraInfo?: string | React.ReactNode
  /** Gives some details about how value was derived from old_value */
  override?: string | React.ReactNode
};

/** TODO: consider coming up with a list of all possible fields from ES and using a mapped type? */
export type PureStatSet = Record<string, Statistic>;

/** (eg ErAyala) */
export type PlayerCode = string;

/** (eg "Ayala, Eric") */
export type PlayerId = string;

export type PlayerCodeId = { code: PlayerCode, id: PlayerId };

export type RosterEntry = {
  player_code_id?: PlayerCodeId,
  height_in?: number,
  /** Listed jersey number */
  number?: string,
  /** Added by hand to fix errors */
  alt_number?: string,
  /** From NCAA roster - just G, F, C */
  pos?: string,
  /** Ft-In format */
  height?: string,
  /** Fr/So/Jr/Sr */
  year_class?: string,
  gp?: number
};

export type OnOffBaselineEnum = "on" | "off" | "baseline";
export type OnOffBaselineGlobalEnum = "on" | "off" | "baseline" | "global";

//////////////////////////////////////

// Invidual

/** Non statistical metadata relating to individuals */
export type IndivMetadata = {
  /** eg 'Ayala, Eric' - Id and Key are considered equivalent here  - this field is required */
  key: PlayerId,

  /** Another required field - can just use to tell if the object is empty */
  doc_count: number,

  /** Comes from the ES response */
  player_array?: any, //(long nested type)

  /** Some display info */
  off_title?: string | React.ReactNode,

  /** eg 'Ayala, Eric' gives ErAyala */
  code?: PlayerCode,

  /** Roster info for the player */
  roster?: RosterEntry,

  /** Gets abused to display roster info (height) in the table */
  def_efg?: React.ReactNode,

  /** Gets abused to display roster info (year/class) in the table */
  def_assist?: React.ReactNode,

  /** Gets abused to display positional information in the table */
  def_usage?: React.ReactNode,

  /** These can be elements to show spinner while loading */
  off_adj_rapm?: React.ReactNode,
  def_adj_rapm?: React.ReactNode,
  off_adj_rapm_prod?: React.ReactNode,
  def_adj_rapm_prod?: React.ReactNode,

  // Implementation detail for roster stats table:
  onOffKey?: "On" | "Off" | "Baseline" | "Global",

  // These are used in the leaderboard:
  conf?: string,
  team?: string,
  year?: string,
};

/** Derived stats we add to the individual's stat set */
export type IndivEnrichment = {
  /** Positional info derived from statistics */
  role?: string,

  /** Positional diag info */
  posClass?: number[],

  /** Luck diags */
  off_luck?: OffLuckAdjustmentDiags,
  /** Luck diags */
  def_luck?: DefLuckAdjustmentDiags,

  /** Off Rating diags */
  diag_off_rtg?: ORtgDiagnostics,
  /** Def Rating diags */
  diag_def_rtg?: DRtgDiagnostics,
};

export type IndivStatSet = PureStatSet & IndivEnrichment & IndivMetadata;

//////////////////////////////////////

// Team

/** Non statistical metadata relating to teams */
export type TeamMetadata = {
  /** Another required field - can just use to tell if the object is empty */
  doc_count: number,

  /** Only present for global team info */
  roster?: Record<PlayerCode, RosterEntry>
};

/** Derived stats we add to the team's stat set */
export type TeamEnrichment = {
  // Title info for tables
  off_title?: string | React.ReactNode,
  def_title?: string | React.ReactNode
};

export type TeamStatSet = PureStatSet & TeamEnrichment & TeamMetadata;

//////////////////////////////////////

// Lineup

/** Non statistical metadata relating to individuals */
export type LineupMetadata = {
  /** Required, list of codes, _ separated */
  key: string,

  doc_count: number,

  /** Comes from the ES response */
  players_array?: any, //(long nested type)

  /** From ES (object) or derived by aggregation (list), TODO encode the type */
  game_info?: any,

  // These are used in the leaderboard:
  conf?: string,
  team?: string,
  year?: string,
  /** TODO: add type here */
  player_info?: any,
};

/** Derived stats we add to the individual's stat set */
export type LineupEnrichment = {

  /** Luck diags */
  off_luck_diags?: OffLuckAdjustmentDiags,
  /** Luck diags */
  def_luck_diags?: DefLuckAdjustmentDiags,

  /** For aggregating lineups with a filter (RAPM specific logic) - this is the unfiltered version */
  all_lineups?: LineupStatSet, //TODO: horrible recursiveness, should fix

  /** The key field when the lineup is an aggregation (TODO: should just rename to key I think?) */
  posKey?: string,

  /** The codes and ids of players in a lineup */
  codesAndIds?: Array<PlayerCodeId>,

  // Title info for tables
  off_title?: string | React.ReactNode,
  def_title?: string | React.ReactNode,

  /** Temp hacky flag to optimize some loops during RAPM */
  rapmRemove?: boolean,

  // Used to aggregate on/off lineups, TODO: horrible recursiveness, should fix
  //TODO: I like the idea of moving this into a separate object that "extends" LineupStatSet
  myLineups?: Array<LineupStatSet>,
  onLineup?: LineupStatSet,
  offLineups?: LineupStatSet,
  offLineupKeys?: Array<string>,
  lineupUsage?: Record<string, {
    poss?: number,
    keyArray?: Array<string>
    overlap?: number
  }>
};

export type LineupStatSet = PureStatSet & LineupEnrichment & LineupMetadata;

//////////////////////////////////////

/** Useful constants */
export class StatModels {
  static emptyIndiv: () => IndivStatSet = () => { return { key: "empty", doc_count: 0 } as IndivStatSet; }
  static emptyTeam: () => TeamStatSet = () => { return { doc_count: 0 } as TeamStatSet };
  static emptyLineup: () => LineupStatSet = () => { return { key: "empty", doc_count: 0 } as LineupStatSet };
}
