// Lodash
import _ from "lodash";

// @ts-ignore
import ls from 'local-storage';

// @ts-ignore
import LZUTF8 from 'lzutf8';
import { QueryUtils } from "./QueryUtils";

import { ParamPrefixes, CommonFilterParams, GameFilterParams, LineupFilterParams, TeamReportFilterParams, ParamDefaults } from "../utils/FilterModels";

/** Wraps the local storage based cache of recent requests */
export class HistoryManager {

  static readonly lastQueryKeyPrefix = "lastQuery-";
  static readonly key = "analysisHistory";
  static readonly maxHistorySize = 50;

  /** Returns an ordered list of filter params */
  static getHistory(): Array<[string, GameFilterParams | LineupFilterParams | TeamReportFilterParams]> {
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
  static filterSummary(prefix: string, p: GameFilterParams | LineupFilterParams | TeamReportFilterParams) {
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
  static commonFilterSummary(p: CommonFilterParams) {
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
    const getGarbageFilter = () => {
      if (p.filterGarbage) {
        return ` [!garbage]`;
      } else {
        return "";
      }
    }
    const getQueryFilters = () => {
      if (p.queryFilters) {
        return ` [+${p.queryFilters}]`;
      } else {
        return "";
      }
    }
    return `${p.year || ParamDefaults.defaultYear} ${p.team || ParamDefaults.defaultTeam} (${gender[0]})` +
      `${getSosFilter()}${getGarbageFilter()}${getQueryFilters()}`;
  }

  /** Returns a summary string for the game filter */
  static gameFilterSummary(p: GameFilterParams) {
    const isAutoOff =
      _.isNil(p.autoOffQuery) ? ParamDefaults.defaultAutoOffQuery : p.autoOffQuery;
    const base = `base:'${tidyQuery(p.baseQuery)}'`;
    const on = `on:'${tidyQuery(p.onQuery)}'`;
    const off = isAutoOff ? `auto-off` : `off:'${tidyQuery(p.offQuery)}'`;

    const onOffLuck = p.onOffLuck;
    const showOnOffLuckDiags =
      _.isNil(p.showOnOffLuckDiags) ? ParamDefaults.defaultOnOffLuckDiagMode : p.showOnOffLuckDiags;

    const showTeamArray = _.flatMap([
      onOffLuck ? [ `on-off-luck:${onOffLuck}`]: [],
      showOnOffLuckDiags ? [ `show-on-off-luck-diags` ] : []
    ]);
    const teamParams = (showTeamArray.length > 0) ?
      `, team:[${_.join(showTeamArray, ",")}]` : "";

    const sortBy =
      _.isNil(p.sortBy) ? ParamDefaults.defaultPlayerSortBy : p.sortBy;
    const filter =
      _.isNil(p.filter) ? ParamDefaults.defaultPlayerFilter : p.filter;
    const showBase =
      _.isNil(p.showBase) ? ParamDefaults.defaultPlayerShowBase : p.showBase;
    const showExpanded =
      _.isNil(p.showExpanded) ? ParamDefaults.defaultPlayerShowExpanded : p.showExpanded;
    const showDiag =
      _.isNil(p.showDiag) ? ParamDefaults.defaultPlayerDiagMode : p.showDiag;
    const showPosDiag =
      _.isNil(p.showPosDiag) ? ParamDefaults.defaultPlayerPosDiagMode : p.showPosDiag;
    const possAsPct =
      _.isNil(p.possAsPct) ? ParamDefaults.defaultPlayerPossAsPct : p.possAsPct;

    const showPlayerArray = _.flatMap([
      (sortBy != ParamDefaults.defaultPlayerSortBy) ? [ `sort:${sortBy}` ] : [],
      (filter != "") ? [ `filter:${filter}` ] : [],
      showBase ? [ "show-base" ] : [],
      showExpanded ? [ "show-def" ] : [],
      showDiag ? [ "show-rtg-diags" ] : [],
      showPosDiag ? [ "show-pos-diags" ] : [],
      possAsPct ? [ ] : [ "poss-#" ],
    ]);
    const playerParams = (showPlayerArray.length > 0) ?
      `, players:[${_.join(showPlayerArray, ",")}]` : "";

    return `On/Off: ${HistoryManager.commonFilterSummary(p)}: ${on}, ${off}, ${base}${teamParams}${playerParams}`;
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
    const showOnOff =
      _.isNil(p.showOnOff) ? ParamDefaults.defaultShowOnOff : p.showOnOff;
    const showComps =
      _.isNil(p.showComps) ? ParamDefaults.defaultShowComps : p.showComps;
    const incRepOnOff =
      _.isNil(p.incRepOnOff) ? ParamDefaults.defaultTeamReportIncRepOnOff : p.incRepOnOff;
    const incRapm =
      _.isNil(p.incRapm) ? ParamDefaults.defaultTeamReportIncRapm : p.incRapm;
    const regressNum =
      _.isNil(p.regressDiffs) ? ParamDefaults.defaultTeamReportRegressDiffs : p.regressDiffs;
    const regressStr =
      (regressNum == ParamDefaults.defaultTeamReportRegressDiffs) ? '' : (':R' + regressNum);
    const repOnOffDiagMode =
      _.isNil(p.repOnOffDiagMode) ? false : true;
    const rapmDiagMode =
      _.isNil(p.rapmDiagMode) ? false : (p.rapmDiagMode != "");

    const showArray = _.flatMap([
      showOnOff ? [] : [ "!on/off" ],
      showComps ? [ "comps" ] : [],
      incRepOnOff ? [ "r:on-off" + regressStr ] : [],
      incRapm ? [ "rapm" ] : [],
      repOnOffDiagMode ? [ "r:on-off:diag" ] : [],
      rapmDiagMode ? [ "rapm:diag" ] : [],
    ]);

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
