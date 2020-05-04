// Lodash
import _ from "lodash";

import { ServerRequestCache } from "../ServerRequestCache";

describe("ServerRequestCache", () => {
  // Handy util to cope with client caching now being async:
  const waitForCondition = async (condition: () => Boolean, attempts: number = 10, sleepTimeMs: number = 50) => {
    const sleep = (milliseconds: number) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    for (let i = 0; i < attempts; i++) {
      const exitLoop = condition();
      if (exitLoop) break;
      await sleep(sleepTimeMs);
    }
  };

  test("ServerRequestCache - decacheResponse / cacheResponse", async () => {

    const obj1 = { testKey: "testVal" };
    ServerRequestCache.cacheResponse("test-cache-key", "test-prefix-", obj1, 1, false);
    await waitForCondition(() =>
      ServerRequestCache.decacheResponse("test-cache-key1", "lineup-", 1, false) != null
    );

    expect(ServerRequestCache.decacheResponse("test-cache-key", "test-prefix-", 1, false)).toEqual(obj1);
    expect(ServerRequestCache.decacheResponse("test-cache-key", "test-prefix-", undefined, false)).toEqual(obj1);
    expect(ServerRequestCache.decacheResponse("test-cache-key", "test-prefix-", 2, false)).toBe(null);
  });
  test("ServerRequestCache - special handling for report- vs lineup-", async () => {
    const obj1 = { testKey: "testVal1" };
    const obj2 = { testKey: "testVal2" };
    const obj3 = { testKey: "testVal3" };
    ServerRequestCache.cacheResponse("test-cache-key1", "lineup-", obj1, 1, false);
    ServerRequestCache.cacheResponse("test-cache-key2", "report-", obj2, 1, false);
    await waitForCondition(() =>
      ServerRequestCache.decacheResponse("test-cache-key1", "lineup-", 1, false) != null
    );

    expect(ServerRequestCache.decacheResponse("test-cache-key1", "lineup-", 1, false)).toEqual(obj1);
    expect(ServerRequestCache.decacheResponse("test-cache-key1", "report-", 1, false)).toEqual(obj1);
    expect(ServerRequestCache.decacheResponse("test-cache-key2", "lineup-", 1, false)).toEqual(obj2);
    expect(ServerRequestCache.decacheResponse("test-cache-key2", "report-", 1, false)).toEqual(obj2);

    //(will overwrite obj1)
    ServerRequestCache.cacheResponse("test-cache-key1", "report-", obj3, 2, false);
    await waitForCondition(() =>
      ServerRequestCache.decacheResponse("test-cache-key1", "report-", 2, false) != null
    );
    expect(ServerRequestCache.decacheResponse("test-cache-key1", "lineup-", 2, false)).toEqual(obj3);
    expect(ServerRequestCache.decacheResponse("test-cache-key1", "report-", 2, false)).toEqual(obj3);
  });
});
