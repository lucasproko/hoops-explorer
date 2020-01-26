// Lodash
import _ from "lodash";

// @ts-ignore
import ls from 'local-storage';

// @ts-ignore
import LZUTF8 from 'lzutf8';
import { QueryUtils } from "./QueryUtils";

import { ParamPrefixes, GameFilterParams, LineupFilterParams, TeamReportFilterParams, ParamDefaults } from "../utils/FilterModels";

/** Wraps the local storage based cache of recent requests */
export class HistoryManager {

  static readonly lastQueryKeyPrefix = "lastQuery-";
  static readonly key = "analysisHistory";
  static readonly maxHistorySize = 50;

  /** Returns an ordered list of filter params */
  static getHistory(): Array<[string, GameFilterParams | LineupFilterParams]> {
    return _.flatMap(HistoryManager.getParamStrs(), (param) => {
      if (_.startsWith(param, ParamPrefixes.game)) {
        const paramNoPrefix = param.substring(ParamPrefixes.game.length);
        return [ [ ParamPrefixes.game, QueryUtils.parse(paramNoPrefix) ] ];
      } else if (_.startsWith(param, ParamPrefixes.lineup)) {
        const paramNoPrefix = param.substring(ParamPrefixes.lineup.length);
        return [ [ ParamPrefixes.lineup, QueryUtils.parse(paramNoPrefix) ] ];
      } else if (_.startsWith(param, ParamPrefixes.report)) {
        const paramNoPrefix = param.substring(ParamPrefixes.report.length);
        return [ [ ParamPrefixes.report, QueryUtils.parse(paramNoPrefix) ] ];
      } else {
        return [];
      }
    });
  }

  /** Clears history */
  static clearHistory() {
    (ls as any).set(HistoryManager.key,
      LZUTF8.compress(
        "[]", { outputEncoding: "StorageBinaryString" }
      )
    );
    Object.values(ParamPrefixes).forEach((prefix) => {
      (ls as any).remove(HistoryManager.lastQueryKeyPrefix + prefix);
    });
  }

  /** Called when a request is submitted to add/bring to front of history */
  static addParamsToHistory(paramStr: string, prefix: string) {
    const paramStrPlusPrefix = prefix + paramStr;
    const currParams = HistoryManager.getParamStrs();

    const newParamStrList = _.take(_.concat( // move to the front
      [ paramStrPlusPrefix ],
      _.filter(currParams, (param) => param != paramStrPlusPrefix)
    ), HistoryManager.maxHistorySize);
    (ls as any).set(HistoryManager.key,
      LZUTF8.compress(
        JSON.stringify(newParamStrList), { outputEncoding: "StorageBinaryString" }
      )
    );
    // For each table, save the last query made
    (ls as any).set(HistoryManager.lastQueryKeyPrefix + prefix,
      paramStr
    );
  }

  /** Gets the last query submitted for the given table */
  static getLastQuery(prefix: string): string | undefined {
    return (ls as any).get(HistoryManager.lastQueryKeyPrefix + prefix);
  }

  /** Retrieves */
  private static getParamStrs(): Array<string> {
    const result = (ls as any).get(HistoryManager.key);
    if (result) {
      return JSON.parse(LZUTF8.decompress(
        result, { inputEncoding: "StorageBinaryString" }
      )) as Array<string>;
    } else {
      return [];
    }
  }

  /** Picks the right filter params and summarizes */
  static filterSummary(prefix: string, p: GameFilterParams | LineupFilterParams) {
    if (prefix == ParamPrefixes.game) {
      return HistoryManager.gameFilterSummary(p as GameFilterParams);
    } else if (prefix == ParamPrefixes.lineup) {
      return HistoryManager.lineupFilterSummary(p as LineupFilterParams);
    } else if (prefix == ParamPrefixes.report) {
      return HistoryManager.teamReportFilterSummary(p as TeamReportFilterParams);
    } else {
      return "unknown";
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
      _.isNil(p.autoOffQuery) ? ParamDefaults.defaultAutoOffQuery : p.autoOffQuery;
    const base = `base:'${tidyQuery(p.baseQuery)}'`;
    const on = `on:'${tidyQuery(p.onQuery)}'`;
    const off = isAutoOff ? `auto-off` : `off:'${tidyQuery(p.offQuery)}'`;
    return `On/Off: ${HistoryManager.commonFilterSummary(p)}: ${on}, ${off}, ${base}`;
  }

  /** Returns a summary string for the game filter */
  static lineupFilterSummary(p: LineupFilterParams) {
    const baseQuery = `query:'${tidyQuery(p.baseQuery)}'`;
    const otherParams = `max:${p.maxTableSize || ParamDefaults.defaultLineupMaxTableSize}, ` +
      `min-poss:${p.minPoss || ParamDefaults.defaultLineupMinPos}, ` +
      `sort:${p.sortBy || ParamDefaults.defaultLineupSortBy}, ` +
      `filter:'${tidyQuery(p.filter)}'`
      ;
    return `Lineups: ${HistoryManager.commonFilterSummary(p)}: ${baseQuery} (${otherParams})`;
  }

  /** Returns a summary string for the game filter */
  static teamReportFilterSummary(p: TeamReportFilterParams) {
    const baseQuery = `query:'${tidyQuery(p.baseQuery)}'`;
    const showComps =
      _.isNil(p.showComps) ? ParamDefaults.defaultShowComps : p.showComps;
    const showArray = showComps ? [ "comps"] : [];

    const otherParams =
      `sort:${p.sortBy || ParamDefaults.defaultLineupSortBy}, ` +
      `filter:'${tidyQuery(p.filter)}', ` +
      `show:[${_.join(showArray, ",")}]`
      ;
    return `On/Off Report: ${HistoryManager.commonFilterSummary(p)}: ${baseQuery} (${otherParams})`;
  }
}
/** (handy util) */
function tidyQuery(q: string | undefined | null): string {
  return (q || "").replace(/'/g, '"');
}
