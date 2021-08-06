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

//////////////////////////////////////

// Invidual

/** Non statistical metadata relating to individuals */
export type IndivMetadata = {
  /** Some display info */
  off_title?: string | React.ReactNode,

  /** eg 'Ayala, Eric' gives ErAyala */
  code?: PlayerCode,

  /** eg 'Ayala, Eric' - Id and Key are considered equivalent here */
  key?: PlayerId,

  doc_count?: number,
  /** Roster info for the player */
  roster?: RosterEntry,

  /** Gets abused to display roster info (height) in the table */
  def_efg?: React.ReactNode,

  /** Gets abused to display roster info (year/class) in the table */
  def_assist?: React.ReactNode,

  /** Gets abused to display positional information in the table */
  def_usage?: React.ReactNode,

  // These are used in the leaderboard:
  conf?: string,
  team?: string,
  teamYear?: string,
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
  doc_count?: number,
  /** Only present for global team info */
  roster?: Record<PlayerCode, RosterEntry>
};

/** Derived stats we add to the team's stat set */
export type TeamEnrichment = {

};

export type TeamStatSet = PureStatSet & TeamEnrichment & TeamMetadata;

//////////////////////////////////////

// Lineup

/** Non statistical metadata relating to individuals */
export type LineupMetadata = {
  doc_count?: number,
};

/** Derived stats we add to the individual's stat set */
export type LineupEnrichment = {

};

export type LineupStatSet = PureStatSet & LineupEnrichment & LineupMetadata;
