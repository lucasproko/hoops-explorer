
import _ from 'lodash';

import { CommonApiUtils } from "../CommonApiUtils";
import { NextApiRequest, NextApiResponse } from 'next';

// Utils:

function testOnCacheHit(
  cacheJson: any, res: NextApiResponse
) {
  (res as any)["testOnCacheHit"] = true;
  (res as any)["cache"] = cacheJson;
}

/** Return a 404 if the request is invalid */
function testOnTeamNotFound(
  res: NextApiResponse
) {
  (res as any)["testOnTeamNotFound"] = true;
}

/** Return a 500 if the response is invalid */
function testOnRequestError(
  res: NextApiResponse
) {
  (res as any)["testOnRequestError"] = true;
}

function testMarshallRequest(
  index: string, genderPrefix: string, params: Record<string, any>,
  currentJsonEpoch: number, efficiency: Record<string, any>, lookup: Record<string, any>,
  avgEfficiency: number
) {
  //TODO: check inputs
  return "test-body";
}

async function testMakeRequest(
  body: string
): Promise<[ boolean, number, any ]> {

  //TODO: check body

  return Promise.resolve(
    [ true, 100, { test: "response" } ]
  );
}

/** Returns the valid response */
function testOnResponse(
  status: number, responseBody: any,
  res: NextApiResponse
) {
  (res as any)["commonOnResponse"] = true;
  (res as any)["status"] = status;
  (res as any)["responseBody"] = responseBody;
}

describe("CommonApiUtils", () => {

  test("CommonApiUtils - handleRequest:(commonMakeRequest, commonOnResponse)", async () => {

    const res = {};
    const prefix = "test-";

    //TODO
    const query = "";

    const result =  await CommonApiUtils.handleRequest(
      res as NextApiResponse,
      prefix, query,
      testMarshallRequest,
      // isDebug
      false,
      // useLocalIndices
      false,
      // Callacks:
      testMakeRequest,
      testOnCacheHit,
      testOnTeamNotFound,
      testOnRequestError,
      testOnResponse
    );


  });

  //TODO: test cache, team error, request error, general error
  //debug

});
