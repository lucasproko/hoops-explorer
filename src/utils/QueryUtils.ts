
// @ts-ignore
import 'lodash.combinations';
import _ from 'lodash';

import queryString from "query-string";

import { CommonFilterParams, ParamDefaults } from "./FilterModels";

/** All the different supported filters */
export type CommonFilterType =
  "Conf" | "Home" | "Away" | "Not-Home" | "Last-30d" | "Nov-Dec" | "Jan-Apr";

export class QueryUtils {

  private static readonly legacyQueryField = "lineupQuery";
  private static readonly newQueryField = "baseQuery";

  /** Wraps QueryUtils.parse but with luck/baseQuery/lineupQuery handling */
  static parse(str: string): any {
    const parsed: Record<string, any> = queryString.parse(str, {parseBooleans: true}) as any;
    // Handle baseQuery/lineupQuery
    if (parsed && parsed[QueryUtils.legacyQueryField]) {
      parsed[QueryUtils.newQueryField] = parsed[QueryUtils.legacyQueryField];
      delete parsed[QueryUtils.legacyQueryField];
    }
    // Handle nested luck + manual overrides:
    const luck = {} as any;
    const manualTmp = {} as any; //(start as map of arrays, will convert to array of maps later)
    _.forEach(parsed, (value: any, key: string) => {
      if (_.startsWith(key, "luck.")) {
        luck[key.substring(5)] = value;
        delete parsed[key];
      } else if (_.startsWith(key, "manual.")) {
        manualTmp[key.substring(7)] = _.isArray(value) ? value : [ value ];
        delete parsed[key];
      }
    });
    // complete nested overrides
    if (!_.isEmpty(manualTmp)) {
      parsed.manual = manualTmp.rowId.map((rid: string, index: number) => {
        return {
          rowId: rid,
          statName: manualTmp.statName?.[index] || "",
          newVal: parseFloat(manualTmp.newVal?.[index] || ""),
          use: manualTmp.use?.[index] || false
        };
      });
    }

    // (Extra annoyance: handle bwc in change of onOffLuck becoming a boolean)
    if (_.isString(parsed.onOffLuck)) {
      luck.base = parsed.onOffLuck;
      parsed.onOffLuck = true;
    }
    if (!_.isEmpty(luck)) {
      parsed.luck = luck;
    }
    return parsed;
  }
  /** Wraps QueryUtils.parse but with luck/baseQuery/lineupQuery handling */
  static stringify(obj: any): string {
    const objCopy = _.clone(obj); //(shallow clone)
    // Handle nested luck:
    if (objCopy.luck) {
      const luckCfg = objCopy.luck as any;
      delete objCopy.luck;
      _.forEach(luckCfg, (value: any, key: string) => {
        objCopy["luck." + key] = value;
      });
    }
    // Handle manual overrides (convert from array of obj into set of arrays):
    if (objCopy.manual && (objCopy.manual.length > 0)) {
      const manualOverrides = objCopy.manual as any[];
      delete objCopy.manual;
      _.forEach(manualOverrides[0], (value: any, key: string) => {
        objCopy["manual." + key] = manualOverrides.map(m => m[key]);
      });
    }
    // Handle baseQuery/lineupQuery
    if (objCopy && objCopy.hasOwnProperty(QueryUtils.legacyQueryField)) {
      objCopy.baseQuery = (objCopy as any)[QueryUtils.legacyQueryField];
      delete (objCopy as any)[QueryUtils.legacyQueryField];
    }
    QueryUtils.cleanseQuery(objCopy);
    return queryString.stringify(objCopy);
  }

  /** Removes some optional fields that we don't want */
  static cleanseQuery(mutableObj: CommonFilterParams) {
    if (mutableObj.filterGarbage == ParamDefaults.defaultFilterGarbage) { //default==false => remove altogether
      delete mutableObj.filterGarbage;
    }
    if (mutableObj.queryFilters == ParamDefaults.defaultQueryFilters) { //default==[] => remove altogether
      delete mutableObj.queryFilters;
    }
    return mutableObj; //(for chaining)
  }

  /** Returns the advanced query, with NOT support, or undefined if not an advanced query */
  static extractAdvancedQuery(maybeAdvQuery: string): [ string, string | undefined] {
    const advancedMatch = /^\s*\[(.*)\]\s*$/.exec(maybeAdvQuery);
    if (advancedMatch) {
       //(just return the raw query, trust that it's well formed)
      return [maybeAdvQuery, advancedMatch[1]];
    } else {
      const advancedMatchNot = /^\s*NOT\s*\(\s*\[(.*)\]\s*\)\s*$/.exec(maybeAdvQuery);
      if (advancedMatchNot) {
        // (if there's a NOT outside the query, lift it into the query)
        return [maybeAdvQuery, `NOT (${advancedMatchNot[1]})` ];
      } else {
        // (return basic query)
        return [maybeAdvQuery, undefined];
      }
    }
  }

  /** Returns the advanced query, with NOT support, or undefined if not an advanced query
   ** NOTE: this is now basically obsolete, since the "advanced queries" work just fine without it
  */
  static basicOrAdvancedQuery(query: string | undefined, fallback: string): string {
    // Firstly, let's sub-in the special case of {playerX|...}~N to take N from that set
    const subMatch = /[{]([^}]*)[}]([~=])([0-9]+)/g;
    return _.chain((_.trim(query) || fallback).replace(subMatch, function(match, p1, p2, p3) {
      const players = p1.split(';');
      const laxCombo = p2 == '~'; //(vs strict if ==)
      const numToInclude = parseInt(p3); //(number by construction)

      return "(" +
          (_ as any).combinations(players, numToInclude).map((combo: any) => {
            const andTerms = `(${_.join(combo, " AND ")})`;
            const notTermList = laxCombo ? [] : _.difference(players, combo);
            const notTerms = `(${_.join(notTermList, " OR ")})`;
            return (laxCombo || _.isEmpty(notTermList)) ? andTerms : `(${andTerms} AND NOT ${notTerms})`;
          }).join(" OR ") +
        ")";

    })).thru((subQuery) => {
      const locationMatch = /opponent[.]([Hh]ome|[Aa]way|[Nn]eutral): *([(][^)]+[)]|"[^"]+"|[^ )\]]+)/g;
      return subQuery.replace(locationMatch, function(match, p1, p2) {
        const replaceStr = `(location_type:${_.capitalize(p1)} AND (opponent.team:${p2}))`;
        return replaceStr;
      });

    }).thru((subQuery) => {
      const [ basicMatch, maybeAdvQuery ] = QueryUtils.extractAdvancedQuery(subQuery);
      if (maybeAdvQuery) { //(advanced query must already have field ids etc)
        return maybeAdvQuery;
      } else {
        return `players.id:(${basicMatch})`;
      }
    }).value();
  }

  /** Handles a set of new filters (which can cause existing filters to be removed) */
  private static filterWith(curr: CommonFilterType[], toAdd: CommonFilterType[]): CommonFilterType[] {
    const toRemove = (_.flatMap(toAdd, (add) => {
      switch(add) {
        case "Home": return [ "Away", "Not-Home" ];
        case "Away": return [ "Home", "Not-Home" ];
        case "Not-Home": return [ "Home", "Away" ];
        case "Last-30d": return [ "Nov-Dec", "Jan-Apr" ];
        case "Nov-Dec":
          return [ "Last-30d", "Jan-Apr" ];
        case "Jan-Apr":
          return [ "Last-30d", "Nov-Dec" ];
        default: return [];
      }
      return [];
    }) as CommonFilterType[]).concat(toAdd); //(we'll add them back again, but this ensures uniqueness)
    return _.sortBy(QueryUtils.filterWithout(curr, toRemove).concat(toAdd));
  }

  /** Returns the composite filter without the specified filter elements */
  private static filterWithout(curr: CommonFilterType[], toRemove: CommonFilterType[]): CommonFilterType[] {
    const toRemoveSet = _.chain(toRemove).map((filter) => [filter, true]).fromPairs().value();
    return _.filter(curr, (filter) => !toRemoveSet.hasOwnProperty(filter as string));
  }

  /** Switches between string and array formulation */
  static parseFilter(queryFilters: string): CommonFilterType[] {
    return queryFilters.split(",").filter((s: string) => s != "").map((s: string) => s.trim() as CommonFilterType)
  }

  /** Checks if a filter item is enabled */
  static filterHas(curr: CommonFilterType[], item: CommonFilterType) {
    return Boolean(_.find(curr, (f) => f == item));
  }

  /** Toggles a filter item */
  static toggleFilter(curr: CommonFilterType[], item: CommonFilterType) {
    return QueryUtils.filterHas(curr, item) ?
      QueryUtils.filterWithout(curr, [ item ]) : QueryUtils.filterWith(curr, [ item ]);
  }

  /** Lookups into the public efficiency records to get a team's conference */
  static getConference(team: string, efficiency: Record<string, any>, lookup: Record<string, any>) {
    const efficiencyName = lookup[team]?.pbp_kp_team || team;
    return efficiency[efficiencyName]?.conf || "";
  }

  /** Injects a new AND clause into the query */
  static injectIntoQuery(newQueryEl: string, currQuery: [ string, string | undefined ]) {
    // Different cases
    if (currQuery[0] == "") {
      return newQueryEl;
    } else if (currQuery[1]) { // Complicated advanced query
      return `[players.id:(${newQueryEl}) AND (${currQuery[1]})]`;
    } else {
      return `(${newQueryEl}) AND (${currQuery[0]})`;
    }
  }
}
