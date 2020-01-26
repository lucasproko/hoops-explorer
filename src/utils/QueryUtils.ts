
// @ts-ignore
import 'lodash.combinations';
import _ from 'lodash';

import queryString from "query-string";

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
  static stringify(obj: any): string {
    if (obj && obj.hasOwnProperty(QueryUtils.legacyQueryField)) {
      obj[QueryUtils.newQueryField] = obj[QueryUtils.legacyQueryField];
      delete obj[QueryUtils.legacyQueryField];
    }
    return queryString.stringify(obj);
  }

  /** Converts a hoop-explorer lineup query into an ES query_string */
  static basicOrAdvancedQuery(query: string | undefined, fallback: string): string {
    // Firstly, let's sub-in the special case of {playerX|...}~N to take N from that set
    const subMatch = /[{]([^}]*)[}][~]([0-9]+)/g;
    return _.chain((query || fallback).replace(subMatch, function(match, p1, p2) {
      const players = p1.split(';');
      const numToInclude = parseInt(p2); //(number by construction)

      return "(" +
          (_ as any).combinations(players, numToInclude).map((combo: any) => {
            return `(${_.join(combo, " AND ")})`;
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
}
