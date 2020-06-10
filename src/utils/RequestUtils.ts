
// Internal components:
import { ParamPrefixes, ParamPrefixesType } from "../utils/FilterModels";

/** Some pages require different requests.
    Eg get me lineups but also individual/team requests with and without the filter
    We're going to keep this simple by treating them as separate API calls
    to the server, and then stitch them back together again
*/
export class RequestUtils {

  /** Gets all data for a given team season */
  // getRawOnOffRequest(paramStr: string) {
  //
  // }

  /** Switch from one of the request types to the URL */
  static requestContextToUrl(context: ParamPrefixesType, paramStr: string) {
    switch (context) {
      case ParamPrefixes.game: return `/api/calculateOnOffStats?${paramStr}`;
      case ParamPrefixes.lineup: return `/api/calculateLineupStats?${paramStr}`;
      case ParamPrefixes.report: return `/api/calculateLineupStats?${paramStr}`;
      case ParamPrefixes.roster: return `/api/getRoster?${paramStr}`;
    }
  }

//  getOnOffRequest

  //TODO: decompose

}
