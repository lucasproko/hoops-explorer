
// @ts-ignore
import 'lodash.combinations';
import _ from 'lodash';

export class QueryUtils {

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
