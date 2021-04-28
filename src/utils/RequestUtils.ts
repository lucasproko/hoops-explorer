
import _ from "lodash";

// Internal components:
import { ParamPrefixes, ParamPrefixesType, FilterParamsType, FilterRequestInfo } from "./FilterModels";
import { QueryUtils } from "./QueryUtils";
import { ClientRequestCache } from "./ClientRequestCache";

// Library imports:
import fetch from 'isomorphic-unfetch';

const debugLogResponses = false;

/** Some pages require different requests.
    Eg get me lineups but also individual/team requests with and without the filter
    We're going to keep this simple by treating them as separate API calls
    to the server, and then stitch them back together again
*/
export class RequestUtils {

  /** Whether any of the queries returned an error - we'll treat them all as errors if so */
  static isResponseError(resp: any): boolean {

    const isGlobalError = Object.keys(resp?.error || {}).length > 0;
    const isLocalError = _.some((resp?.responses || []).map((r: any) => Object.keys(r?.error || {}).length > 0)) || false;

    return isGlobalError || isLocalError;
  }

  /** Handles the rather ugly URL conversion needed to fetch URL encoded files
   * highlights: spaces become +, use strict encoding, and % gets re-encoded as 25
   */
  static fixRosterUrl(str: string, encodeEncodePrefix: boolean): string {
    const stage1 = encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    }).replace(/[%]20/g, "+");
    return encodeEncodePrefix ? stage1.replace(/[%]/g, "%25") : stage1;
  }
  static mutateRosterJsonForWomen(json: any, gender: string | undefined) {
    if (json && (gender == "Women")) { // Remove height_in because all the fns that use it are trained on men
      _.chain(json).mapValues(rosterEntry => {
        delete rosterEntry.height_in;
      }).value();
    }
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
          const fetchPromise = fetchPromiseFactory(
            RequestUtils.requestContextToUrl(req.context, newParamsStr), jsonExistsButEmpty
          );

          // Fetch the JSON from the CDN if requested
          const fetchRosterJson = (encodeEncodePrefix: boolean) => {
            const rosterJsonUri = (encodeEncodePrefix: boolean) =>
              `/rosters/${req.paramsObj.gender}_${(req.paramsObj.year || "").substring(0, 4)}`
              + `/${RequestUtils.fixRosterUrl(req.paramsObj.team || "", encodeEncodePrefix)}.json`;
            return fetch(
              rosterJsonUri(encodeEncodePrefix)
            ).then(
              (resp: any) => resp.json()
            );
          };
          const rosterJsonPromise = (req.includeRoster ?
            fetchRosterJson(false).catch( //(carry on error, eg if the file doesn't exist)
              (err: any) => fetchRosterJson(true)
            ).catch(
              (err: any) => undefined
            ) : Promise.resolve(undefined)
          );
          return rosterJsonPromise.then((rosterJson: any) => {
            return fetchPromise.then(function(jsonResp: [any, boolean, fetch.IsomorphicResponse | undefined]) {
              const json = jsonResp[0];
              const respOk = jsonResp[1];
              const response = jsonResp[2]; //(just for debugging hence can be undefined)

              // Inject the roster into the cacheable object
              if (rosterJson) {
                RequestUtils.mutateRosterJsonForWomen(rosterJson, req.paramsObj.gender);
                json.roster = rosterJson;
              }

              // Cache result locally:
              if (isDebug) {
                console.log(`CACHE_KEY[${index}]=[${req.context}${newParamsStr}]`);
                if (debugLogResponses) {
                  console.log(`CACHE_VAL[${index}]=[${JSON.stringify(json)}]`);
                } else {
                  console.log(`CACHE_VAL[${index}]=[${JSON.stringify(json).length}]B`);
                }
                const totalTimeMs = new Date().getTime() - startTimeMs;
                console.log(`TOOK[${index}]=[${totalTimeMs}]ms`);
              }
              if (respOk && !RequestUtils.isResponseError(json)) { //(never cache errors)
                ClientRequestCache.cacheResponse(
                  newParamsStr, req.context, json, currentJsonEpoch, isDebug
                );
              } else if (isDebug) {
                console.log(`[${index}] Response error: ok=[${respOk}] ok_from_obj=[${!RequestUtils.isResponseError(json)}] status=[${response?.status}] keys=[${Object.keys(response || {})}]`)
              }
              return json;
            });
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
