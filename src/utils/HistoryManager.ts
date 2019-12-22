// Lodash
import _ from "lodash";

// @ts-ignore
import ls from 'local-storage';

// @ts-ignore
import LZUTF8 from 'lzutf8';

import { GameFilterParams, LineupFilterParams, ParamDefaults } from "../utils/FilterModels";

/** Wraps the local storage based cache of recent requests */
export class HistoryManager {

  /** Returns an ordered list of filter params */
  static returnHistory(): Array<GameFilterParams | LineupFilterParams> {
    return [];//TODO
  }

  /** Called when a request is submitted to add/bring to front of history */
  static addGameFilterToHistory(p: GameFilterParams) {
  }

  /** Called when a request is submitted to add/bring to front of history */
  static addLineupFilterToHistory(p: LineupFilterParams) {
  }

  /** Returns a summary string for the game or lineup filters */
  static filterSummary(p: GameFilterParams | LineupFilterParams): string {
    switch (p.kind) {
      case "game": return HistoryManager.gameFilterSummary(p);
      case "lineup": return HistoryManager.lineupFilterSummary(p);
    }
  }

  /** The common component of the filter */
  static commonFilterSummary(p: GameFilterParams | LineupFilterParams) {
    const gender = p.gender || ParamDefaults.defaultGender;
    const getSosFilter = () => {
      if (parseInt(p.minRank || ParamDefaults.defaultMinRank) > 1
            || parseInt(p.maxRank || ParamDefaults.defaultMaxRank) < 360
      ) {
        return ` [${p.minRank}:${p.maxRank}]`;
      } else {
        return "";
      }
    };
    return `${p.year || ParamDefaults.defaultYear} ${p.team || ParamDefaults.defaultTeam} (${gender[0]})${getSosFilter()}`;
  }

  /** Returns a summary string for the game filter */
  static gameFilterSummary(p: GameFilterParams) {
    const isAutoOff =
      (((p.autoOffQuery == undefined) ? "true" : p.autoOffQuery) || "false") == "true";
    const base = `base:'${tidyQuery(p.baseQuery)}'`;
    const on = `on:'${tidyQuery(p.onQuery)}'`;
    const off = isAutoOff ? `auto-off` : `off:'${tidyQuery(p.offQuery)}'`;
    return `On/Off: ${HistoryManager.commonFilterSummary(p)}: ${base}, ${on}, ${off}`;
  }

  /** Returns a summary string for the game filter */
  static lineupFilterSummary(p: LineupFilterParams) {
    const lineupQuery = `query:'${tidyQuery(p.lineupQuery)}'`;
    const otherParams = `max:${p.maxTableSize || ParamDefaults.defaultLineupMaxTableSize}, ` +
      `min-poss:${p.minPoss || ParamDefaults.defaultLineupMinPos}, ` +
      `sort:${p.sortBy || ParamDefaults.defaultLineupSortBy}`;
    return `Lineups: ${HistoryManager.commonFilterSummary(p)}: ${lineupQuery} (${otherParams})`;
  }
}
/** (handy util) */
function tidyQuery(q: string | undefined | null): string {
  return (q || "").replace(/'/g, '"');
}
