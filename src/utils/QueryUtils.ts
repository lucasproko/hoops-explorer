
// @ts-ignore
import 'lodash.combinations';
import _ from 'lodash';

import queryString from "query-string";

import { CommonFilterParams, ParamDefaults, GameFilterParams } from './FilterModels';

import { format, parse, addYears } from "date-fns";

export type CommonFilterTypeSimple =
  "Conf" | "Home" | "Away" | "Not-Home" | "Last-30d" | "Nov-Dec" | "Jan-Apr";

export type CommonFilterCustomDate = {
  kind: CustomDateAlias,
  start: Date,
  end: Date
};

/** All the different supported filters */
export type CommonFilterType = CommonFilterTypeSimple | CommonFilterCustomDate; 
  //(NOTE: currently only one non-string type supported, need to start using kind)

// Note name has to match customDateAliasName below
type CustomDateAlias = "Custom-Date";

type CommonFilterKeyType = CommonFilterTypeSimple | CustomDateAlias;

export class QueryUtils {

  private static readonly legacyQueryField = "lineupQuery";
  private static readonly newQueryField = "baseQuery";

  // Note name has to match CustomDateAlias above
  static readonly customDateAliasName = "Custom-Date";
  private static readonly customDateFormat = "MM.dd";
  static readonly customDatePrefix = "Date:";

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
  
  ///////////////////////////

  // Lots of query filter handling

  /** Allows having objects (eg custom dates) as common filters also - all (eg) custom dates have the same name */
  private static byName(filter: CommonFilterType | CustomDateAlias): CommonFilterKeyType {
    return (typeof filter == "string") ?
     filter as CommonFilterKeyType : QueryUtils.customDateAliasName; 
      //(NOTE: currently only one non-string type supported, need to start using kind) 
  }

  static asString(filter: CommonFilterType) {
    if (typeof filter == "string") {
      return filter as string;
    } else { // must be a custom date
      //(NOTE: currently only one non-string type supported, need to start using kind) 
      return `${QueryUtils.customDatePrefix}${format(filter.start, QueryUtils.customDateFormat)}-${format(filter.end, QueryUtils.customDateFormat)}`; 
    }
  }

  /** Handles a set of new filters (which can cause existing filters to be removed) */
  private static filterWith(curr: CommonFilterType[], toAdd: CommonFilterType[]): CommonFilterType[] {
    const typed = (s: CommonFilterKeyType) => s; //(give ts compiler a bit of help with its arrays!)
    const toRemove: CommonFilterKeyType[] = (_.flatMap(toAdd, (add) => {
      switch(QueryUtils.byName(add)) {
        case "Home": return [ typed("Away"), typed("Not-Home") ];
        case "Away": return [ typed("Home"), typed("Not-Home") ];
        case "Not-Home": return [ typed("Home"), typed("Away") ];

        case "Last-30d": return [ typed("Nov-Dec"), typed("Jan-Apr"), typed("Custom-Date") ];
        case "Nov-Dec":
          return [ typed("Last-30d"), typed("Jan-Apr"), typed("Custom-Date") ];
        case "Jan-Apr":
          return [ typed("Last-30d"), typed("Nov-Dec"), typed("Custom-Date") ];
        case "Custom-Date":
          return [ typed("Last-30d"), typed("Nov-Dec"), typed("Jan-Apr") ];

        default: return [];
      }
    })).concat(toAdd.map(QueryUtils.byName)); //(we'll add them back again, but this ensures uniqueness)
    return _.sortBy(QueryUtils.filterWithout(curr, toRemove).concat(toAdd));
  }

  /** Returns the composite filter without the specified filter elements */
  private static filterWithout(curr: CommonFilterType[], toRemoveByName: CommonFilterKeyType[]): CommonFilterType[] {
    const toRemoveSet = _.chain(toRemoveByName).map((filter) => [filter, true]).fromPairs().value();
    return _.filter(curr, (filter) => !toRemoveSet.hasOwnProperty(QueryUtils.byName(filter) as string));
  }

  /** Returns a custom date filter from the string MM.dd-MM.dd (note: without "Date:" prefix) */
  static parseCustomDate(dateStr: string, year: string): CommonFilterCustomDate | undefined { 
    const yearStr = year.substring(0, 4);
    const dateStrs = dateStr.split("-");
    try {
      const contextDate = parse(`${yearStr}-12-30`, "yyyy-MM-dd", new Date()); //(mid point of the season)
      const getCorrectYear = (d: Date) => {
        return d.getMonth() < 6 ? addYears(d, 1) : d;
      };
      const dateStart = getCorrectYear(parse(dateStrs[0], QueryUtils.customDateFormat, contextDate));
      const dateEnd = getCorrectYear(parse(dateStrs[1] || "", QueryUtils.customDateFormat, contextDate));
      return (!Number.isNaN(dateStart.getTime()) && !Number.isNaN((dateEnd.getTime()))) ? {
        kind: QueryUtils.customDateAliasName,
        start: dateStart,
        end: dateEnd
      } : undefined;
    } catch (e) {
      return undefined; //(invalid state)
    }
  }

  /** Returns the custom date filter if it exists in the current filter set */
  static extractCustomDate(queryFilters: CommonFilterType[]): CommonFilterCustomDate | undefined {
    const maybeItem = _.find(queryFilters, (f) => QueryUtils.byName(f) == QueryUtils.customDateAliasName);
    return maybeItem ? maybeItem as CommonFilterCustomDate : undefined;
  }

  /** Switches between string and array formulation */
  static parseFilter(queryFilters: string, year: string): CommonFilterType[] {
    return queryFilters.split(",").filter((s: string) => s != "").flatMap((s: string) => {
      const trimmed = s.trim();
      if (trimmed.startsWith(QueryUtils.customDatePrefix)) {
        const parsedDataObj = QueryUtils.parseCustomDate(trimmed.substring(QueryUtils.customDatePrefix.length), year);
        return parsedDataObj ? [ parsedDataObj ] : [];
      } else {
        return [ trimmed ] as CommonFilterType[];
      }
    })
  }

  /** Converts the CommonFilterTypr into a string, deduplicating if necessary */
  static buildFilterStr(curr: CommonFilterType[]) {
    const currByName = curr.map(QueryUtils.asString);
    return _.join(_.uniq(currByName), ",");
  }

  /** Checks if a filter item is enabled */
  static filterHas(curr: CommonFilterType[], item: CommonFilterType | CustomDateAlias) {
    return Boolean(_.find(curr, (f) => QueryUtils.byName(f) == QueryUtils.byName((item))));
  }
  
  /** Toggles a filter item (not custom dates) */
  static toggleFilter(curr: CommonFilterType[], item: CommonFilterTypeSimple) {
    return QueryUtils.filterHas(curr, item) ?
      QueryUtils.filterWithout(curr, [ item ]) : QueryUtils.filterWith(curr, [ item ]);
  }

  /** Adds a new custom date (overwrite the current one if it exists), or removes the custom date */
  static setCustomDate(curr: CommonFilterType[], setOrUnset: CommonFilterCustomDate | undefined) {
    return QueryUtils.filterWith(
      QueryUtils.filterWithout(curr, [ QueryUtils.customDateAliasName ]), 
      setOrUnset ? [ setOrUnset ] : []
    );
  }

  // A bunch of utils to handle some of the logic surrounding combined query strings and filters

  /** One of some overloaded checks for whether a query type is doing anything */
  static nonEmptyQueryObj(params: GameFilterParams, queryType: "on" | "off") {
    if (queryType == "on") {
      return QueryUtils.nonEmptyQueryStr(params.onQuery, params.onQueryFilters);
    } else { //off
      return QueryUtils.nonEmptyQueryStr(params.offQuery, params.offQueryFilters);
    }
  }
  /** One of some overloaded checks for whether a query type is doing anything */
  static nonEmptyQueryStr(queryStr: string | undefined, queryFiltersStr: string | undefined) {
    return ((queryStr || "") != "") || ((queryFiltersStr || "") != "");
  }
  /** One of some overloaded checks for whether a query type is doing anything */
  static nonEmptyQuery(queryStr: string | undefined, queryFilter: CommonFilterType[]) {
    return ((queryStr || "") != "") || (queryFilter.length > 0);
  }

  /** Auto off query with on query filters set - this is a special case because can't represent the query with a single query/filter pair */
  static autoOffAndFilters(autoOff: boolean, onQueryFilter: CommonFilterType[]) {
    return autoOff && onQueryFilter.length > 0;
  }
  /** Auto off query with on query filters set - this is a special case because can't represent the query with a single query/filter pair */
  static autoOffAndFiltersObj(params: GameFilterParams) {
    return (params.autoOffQuery || false) && ((params.onQueryFilters || "") != "");
  }
  /** To handle the "autoOffAndFilters" case described above, we have a special internal search mode for lineups */
  static invertedQueryMode(params: CommonFilterParams) {
    return ((params.invertBase || "") != "") || ((params.invertBaseQueryFilters || "") != "");
  }
}
