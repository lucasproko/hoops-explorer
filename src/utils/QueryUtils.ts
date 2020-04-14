
// @ts-ignore
import 'lodash.combinations';
import _ from 'lodash';

import queryString from "query-string";

import { CommonFilterParams } from "./FilterModels";

/** All the different supported filters */
export type CommonFilterType =
  "Conf" | "Home" | "Away" | "Not-Home" | "Last-30d" | "Nov-Dec" | "Jan-Apr";

export class QueryUtils {

  private static readonly legacyQueryField = "lineupQuery";
  private static readonly newQueryField = "baseQuery";

  /** Wraps QueryUtils.parse but with baseQuery/lineupQuery handling */
  static parse(str: string): any {
    const parsed: Record<string, any> = queryString.parse(str, {parseBooleans: true}) as any;
    if (parsed && parsed[QueryUtils.legacyQueryField]) {
      parsed[QueryUtils.newQueryField] = parsed[QueryUtils.legacyQueryField];
      delete parsed[QueryUtils.legacyQueryField];
    }
    return parsed;
  }
  /** Wraps QueryUtils.parse but with baseQuery/lineupQuery handling */
  static stringify(obj: CommonFilterParams): string {
    if (obj && obj.hasOwnProperty(QueryUtils.legacyQueryField)) {
      obj.baseQuery = (obj as any)[QueryUtils.legacyQueryField];
      delete (obj as any)[QueryUtils.legacyQueryField];
    }
    if (!obj.filterGarbage) { //default==false => remove altogether
      delete obj.filterGarbage;
    }
    if (obj.queryFilters == "") { //default==[] => remove altogether
      delete obj.queryFilters;
    }
    return queryString.stringify(obj);
  }

  /** Converts a hoop-explorer lineup query into an ES query_string */
  static basicOrAdvancedQuery(query: string | undefined, fallback: string): string {
    // Firstly, let's sub-in the special case of {playerX|...}~N to take N from that set
    const subMatch = /[{]([^}]*)[}]([~=])([0-9]+)/g;
    return _.chain((query || fallback).replace(subMatch, function(match, p1, p2, p3) {
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
      const advancedMatch = /^\s*\[(.*)\]\s*$/.exec(subQuery);
      if (advancedMatch) {
        return advancedMatch[1]; //(just return the raw query, trust that it's well formed)
      } else {
        // (if there's a NOT outside the query, lift it into the query)
        const advancedMatchNot = /^\s*NOT\s*\(\s*\[(.*)\]\s*\)\s*$/.exec(subQuery);
        if (advancedMatchNot) {
          return `NOT (${advancedMatchNot[1]})`
        } else {
          return `players.id:(${subQuery})`;
        }
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
    return queryFilters.split(",").map((s: string) => s.trim() as CommonFilterType)
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
}
