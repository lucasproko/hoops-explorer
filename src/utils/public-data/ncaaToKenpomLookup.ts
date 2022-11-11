
import _ from "lodash";

/** The NCAA name to KenPom name mappings, built in 2020, can have per year changes */

/** Contains NCAA/KP lookups for gender/years where we want to retrieve efficiency from the cache (current year only) */
export const ncaaToKenpomLookup: Record<string, Record<string, Record<string, string>>> = {
   "Men_2022/23": {} // the upload pipeline already performs the team map
};
