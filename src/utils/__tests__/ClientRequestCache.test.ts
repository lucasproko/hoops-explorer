// Lodash
import _ from "lodash";

import { ClientRequestCache } from "../ClientRequestCache";
import { PreloadedDataSamples } from "../internal-data/preloadedData";

describe("ClientRequestCache", () => {

  test("ClientRequestCache - decacheResponse / cacheResponse / peekForResponse", () => {

    const obj1 = { testKey: "testVal" };
    const expObj1 = { testKey: "testVal", cacheEpoch: 1 };
    ClientRequestCache.cacheResponse("test-cache-key", "test-prefix-", obj1, 1, false);
    expect(ClientRequestCache.peekForResponse("test-cache-key", "test-prefix-")).toBe(true);
    expect(ClientRequestCache.peekForResponse("wrong-cache-key", "test-prefix-")).toBe(false);
    expect(ClientRequestCache.peekForResponse("test-cache-key", "wrong-prefix-")).toBe(false);
    expect(ClientRequestCache.peekForResponse("test-prefix-test-cache-key", "")).toBe(true);

    expect(ClientRequestCache.decacheResponse("test-cache-key", "test-prefix-", 1, false)).toEqual(expObj1);
    expect(ClientRequestCache.decacheResponse("test-cache-key", "test-prefix-", undefined, false)).toEqual(expObj1);
    expect(ClientRequestCache.decacheResponse("test-cache-key", "test-prefix-", 2, false)).toBe(null);
  });
  test("ClientRequestCache - directInsertCache", () => {
    /*TODO: not using directInsertCache for anything except {} so don't run this test for now
    const testObj = null; //TODO: needs to be B64 encoded and compressed
    const expectedObj = { cacheEpoch: 1, took: 43 }
    ClientRequestCache.directInsertCache(PreloadedDataSamples.menLineup, "lineup-", testObj, 1, false);

    expect(
      _.pick(
        ClientRequestCache.decacheResponse(PreloadedDataSamples.menLineup, "lineup-", 1, false),
        [ "cacheEpoch", "took" ]
      )
    ).toEqual(expectedObj);
    */
  });
  test("ClientRequestCache - special handling for {} as placeholder", () => {
    ClientRequestCache.directInsertCache("test-empty-key", "test-prefix-", "{}", 1, false);
    expect(ClientRequestCache.decacheResponse("test-empty-key", "test-prefix-", 1, false)).toEqual({});
    //(epoch ignored)
    expect(ClientRequestCache.decacheResponse("test-empty-key", "test-prefix-", 2, false)).toEqual({});

    // Check handles report- vs lineup- below
    ClientRequestCache.directInsertCache("test-empty-key", "report-", "{}", 1, false);
    expect(ClientRequestCache.peekForResponse("test-empty-key", "report-")).toBe(false);
    expect(ClientRequestCache.peekForResponse("test-empty-key", "lineup-")).toBe(true);
  });
  test("ClientRequestCache - special handling for report- vs lineup-", () => {
    const obj1 = { testKey: "testVal1" };
    const obj2 = { testKey: "testVal2" };
    const obj3 = { testKey: "testVal3" };
    const expObj1 = { testKey: "testVal1", cacheEpoch: 1 };
    const expObj2 = { testKey: "testVal2", cacheEpoch: 1 };
    const expObj3 = { testKey: "testVal3", cacheEpoch: 2 };
    ClientRequestCache.cacheResponse("test-cache-key1", "lineup-", obj1, 1, false);
    ClientRequestCache.cacheResponse("test-cache-key2", "report-", obj2, 1, false);

    expect(ClientRequestCache.decacheResponse("test-cache-key1", "lineup-", 1, false)).toEqual(expObj1);
    expect(ClientRequestCache.decacheResponse("test-cache-key1", "report-", 1, false)).toEqual(expObj1);
    expect(ClientRequestCache.decacheResponse("test-cache-key2", "lineup-", 1, false)).toEqual(expObj2);
    expect(ClientRequestCache.decacheResponse("test-cache-key2", "report-", 1, false)).toEqual(expObj2);

    // Peek _doesn't_ work:
    expect(ClientRequestCache.peekForResponse("test-cache-key1", "report-")).toBe(false);
    expect(ClientRequestCache.peekForResponse("test-cache-key2", "report-")).toBe(false);

    //(will overwrite obj1)
    ClientRequestCache.cacheResponse("test-cache-key1", "report-", obj3, 2, false);
    expect(ClientRequestCache.decacheResponse("test-cache-key1", "lineup-", 2, false)).toEqual(expObj3);
    expect(ClientRequestCache.decacheResponse("test-cache-key1", "report-", 2, false)).toEqual(expObj3);
  });

  // clearCache / refreshEpoch / removeLru - can't be tested without additional mocking
});
