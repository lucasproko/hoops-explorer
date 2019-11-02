// Lodash
import _ from "lodash";

// Additional components:
import queryString from "query-string";

/** Url routing utils */
export class UrlRouting {

  static readonly noSuffix = "";
  static readonly savedLineupSuffix = "_lineup";
  static readonly savedGameSuffix = "_game";
  /** List of all the keys that can be saved */
  static readonly savedKeySuffices = [
    UrlRouting.savedLineupSuffix, UrlRouting.savedGameSuffix
  ];

  /** Filters out _lineup or _game from object to avoid them getting chained repeatedly */
  static removedSavedKeys(urlParams: string, suffices: Array<string> = UrlRouting.savedKeySuffices) {
    return _.pickBy(queryString.parse(urlParams), (value, key) => {
      return !_.some(suffices, (suffix) => key.indexOf(suffix) >= 0);
    });
  }

  /** Retries only the specified saved URL params */
  static extractSavedKeys(urlParams: string, suffixToKeep: string) {
    return _.mapKeys(_.pickBy(queryString.parse(urlParams), (value, key) => {
      return key.indexOf(suffixToKeep) >= 0;
    }), (value, key) => key.replace(suffixToKeep, ""));
  }

  /** Builds a state URL out of the base params (key "") and the saved ones (key==suffix) */
  static getUrl(paramsBySuffix: Record<string, any>) {
    return _.toPairs(paramsBySuffix).map((kv) => {
      const queryStr =
        queryString.stringify(
          _.mapKeys(kv[1], (value, key) => key + kv[0])
        );
      return (queryStr == "") ? "" : (queryStr + "&");
    }).join("");
  }

}
