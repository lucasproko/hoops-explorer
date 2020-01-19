// Lodash
import _ from "lodash";

import { ServerRequestCache } from "../ServerRequestCache";

describe("ServerRequestCache", () => {

  test("ServerRequestCache - decacheResponse / cacheResponse", () => {

    const obj1 = { testKey: "testVal" };
    ServerRequestCache.cacheResponse("test-cache-key", "test-prefix-", obj1, 1, false);

    expect(ServerRequestCache.decacheResponse("test-cache-key", "test-prefix-", 1, false)).toEqual(obj1);
    expect(ServerRequestCache.decacheResponse("test-cache-key", "test-prefix-", undefined, false)).toEqual(obj1);
    expect(ServerRequestCache.decacheResponse("test-cache-key", "test-prefix-", 2, false)).toBe(null);
  });
  test("ServerRequestCache - special handling for report- vs lineup-", () => {
    const obj1 = { testKey: "testVal1" };
    const obj2 = { testKey: "testVal2" };
    const obj3 = { testKey: "testVal3" };
    ServerRequestCache.cacheResponse("test-cache-key1", "lineup-", obj1, 1, false);
    ServerRequestCache.cacheResponse("test-cache-key2", "report-", obj2, 1, false);

    expect(ServerRequestCache.decacheResponse("test-cache-key1", "lineup-", 1, false)).toEqual(obj1);
    expect(ServerRequestCache.decacheResponse("test-cache-key1", "report-", 1, false)).toEqual(obj1);
    expect(ServerRequestCache.decacheResponse("test-cache-key2", "lineup-", 1, false)).toEqual(obj2);
    expect(ServerRequestCache.decacheResponse("test-cache-key2", "report-", 1, false)).toEqual(obj2);

    //(will overwrite obj1)
    ServerRequestCache.cacheResponse("test-cache-key1", "report-", obj3, 2, false);
    expect(ServerRequestCache.decacheResponse("test-cache-key1", "lineup-", 2, false)).toEqual(obj3);
    expect(ServerRequestCache.decacheResponse("test-cache-key1", "report-", 2, false)).toEqual(obj3);
  });
});
