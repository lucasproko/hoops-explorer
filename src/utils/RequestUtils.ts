
import _ from "lodash";

// Internal components:
import { ParamPrefixes, ParamPrefixesType, FilterParamsType, FilterRequestInfo } from "./FilterModels";
import { QueryUtils } from "./QueryUtils";
import { ClientRequestCache } from "./ClientRequestCache";

// Library imports:
import fetch from 'isomorphic-unfetch';

/** Some pages require different requests.
    Eg get me lineups but also individual/team requests with and without the filter
    We're going to keep this simple by treating them as separate API calls
    to the server, and then stitch them back together again
*/
export class RequestUtils {

  /** Whether any of the queries returned an error - we'll treat them all as errors if so */
  static isResponseError(resp: any) {
    const jsons = resp?.responses || [];
    const teamJson = (jsons.length > 0) ? jsons[0] : resp;
      //(error can be so low level there's not even a responses)
    const rosterCompareJson = (jsons.length > 1) ? jsons[1] : {};
    return (Object.keys(teamJson?.error || {}).length > 0) ||
      (Object.keys(rosterCompareJson?.error || {}).length > 0);
  }

  /** An easily test abstraction for requesting multiple objects from the server */
  static requestHandlingLogic(
    primaryRequest: FilterParamsType, primaryContext: ParamPrefixesType, otherRequests: FilterRequestInfo[],
    fetchPromiseFactory: (url: string, force: boolean) => Promise<[any, boolean, fetch.IsomorphicResponse]>,
    currentJsonEpoch: number, isDebug: boolean
  ): Promise<any>[] {
    return RequestUtils.buildRequestList(primaryRequest, primaryContext, otherRequests).map(
      (req: FilterRequestInfo, index: number) => {
        const newParamsStr = QueryUtils.stringify(req.paramsObj);

        if (isDebug) {
          console.log(`Looking for cache entry for [${index}][${req.context}][${newParamsStr}]`);
        }

        // Check if it's in the cache:
        const cachedJson = ClientRequestCache.decacheResponse(
          newParamsStr, req.context, currentJsonEpoch, isDebug
        );
        const jsonExistsButEmpty = !_.isNil(cachedJson) && _.isEmpty(cachedJson);

        if (cachedJson && !jsonExistsButEmpty) { //(ignore placeholders here)
          return Promise.resolve(cachedJson);
        } else {
          const startTimeMs = new Date().getTime();
          return fetchPromiseFactory(
            RequestUtils.requestContextToUrl(req.context, newParamsStr), jsonExistsButEmpty
          ).then(function(jsonResp: [any, boolean, fetch.IsomorphicResponse | undefined]) {
              const json = jsonResp[0];
              const respOk = jsonResp[1];
              const response = jsonResp[2]; //(just for debugging hence can be undefined)

              // Cache result locally:
              if (isDebug) {
                console.log(`CACHE_KEY[${index}]=[${req.context}${newParamsStr}]`);
                console.log(`CACHE_VAL[${index}]=[${JSON.stringify(json)}]`);
                const totalTimeMs = new Date().getTime() - startTimeMs;
                console.log(`TOOK[${index}]=[${totalTimeMs}]ms`);
              }
              if (respOk && !RequestUtils.isResponseError(json)) { //(never cache errors)
                ClientRequestCache.cacheResponse(
                  newParamsStr, req.context, json, currentJsonEpoch, isDebug
                );
              } else if (isDebug) {
                console.log(`[${index}] Response error: status=[${response?.status}] keys=[${Object.keys(response || {})}]`)
              }
              return json;
            });
        }
      }
    );
  }

  /** Switch from one of the request types to the URL */
  static requestContextToUrl(context: ParamPrefixesType, paramStr: string) {
    switch (context) {
      case ParamPrefixes.game: return `/api/calculateOnOffStats?${paramStr}`;
      case ParamPrefixes.lineup: return `/api/calculateLineupStats?${paramStr}`;
      case ParamPrefixes.report: return `/api/calculateLineupStats?${paramStr}`;
      case ParamPrefixes.roster: return `/api/getRoster?${paramStr}`;
      case ParamPrefixes.player: return `/api/calculateOnOffPlayerStats?${paramStr}`;
    }
  }

  /////////////////////////////////

  // Utils:

  private static buildRequestList(
    primaryRequest: FilterParamsType, context: ParamPrefixesType, otherRequests: FilterRequestInfo[]
  ): FilterRequestInfo[] {
    return [ { context: context, paramsObj: primaryRequest } ].concat(otherRequests);
  }

}
