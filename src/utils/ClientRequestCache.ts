// Lodash
import _ from "lodash";

// @ts-ignore
import ls from 'local-storage';

// @ts-ignore
import LZUTF8 from 'lzutf8';

/** Wraps local storage and handles compression of the fields, clearing out if space is needed etc */
export class ClientRequestCache {

  /** Check if a global refresh has occurred for this gender/year pairing */
  static refreshEpoch(
    gender: string, year: string, currentEpoch: number, isDebug: boolean
  ): boolean {
    const cachedEpochKey = `data-epoch-${gender}-${year}`;
    const cachedEpoch = (ls as any).get(cachedEpochKey) || 0;
    if (cachedEpoch != currentEpoch) {
      if (isDebug) {
        console.log(`Force reloading preloads because [${cachedEpoch}] != curr [${currentEpoch}]`);
      }
      for (let i = 0; i < 15; i++) {
        const success = (ls as any).set(cachedEpochKey, currentEpoch);
        if (success) {
          break;
        } else {
          ClientRequestCache.removeLru();          
        }
      }
      return true;
    }
    return false;
  }

  /** Quick look in the cache to see if an element is there */
  static peekForResponse(key: string, prefix: string): boolean {
    return (ls as any).get(prefix + key);
  }

  /** Returns the cached JSON object, if it exists, has a matching epochKey (or epoch key is undefined) - else null */
  static decacheResponse(
    key: string, prefix: string, epochKey: number | undefined, isDebug: boolean = false
  ): Record<string, any> | null {
    const cacheStr = (ls as any).get(prefix + key);
    if (!cacheStr) {
      return null; // (cache miss)
    } else { // (cache hit) is it compressed or uncompressed?
      if ('{' == cacheStr[0]) { // legacy
        const cacheJsonTmp = JSON.parse(cacheStr);
        if (!epochKey || !cacheJsonTmp.cacheEpoch || (cacheJsonTmp.cacheEpoch == epochKey)) {
          //(rewrite it back in compressed format)
          if (isDebug) {
            console.log(`Found legacy cache for [${prefix}][${key}] epochs: [${cacheJsonTmp.cacheEpoch}, ${epochKey}]`);
          }
          ClientRequestCache.cacheResponse(key, prefix, cacheJsonTmp, epochKey);
          return cacheJsonTmp;
        } else {
          return null; //(cache element has expired)
        }
      } else { // compressed
        const results =  _.split(cacheStr, ":", 1);
        const cacheEpoch = parseInt(results[0] || "0");
        const compCacheJsonTmp = cacheStr.substring(results[0].length + 1); // +1 for :

        if (!epochKey || !cacheEpoch || (cacheEpoch == epochKey)) {
          if (isDebug) {
            console.log(`Found cache for [${prefix}][${key}] epochs: [${cacheEpoch}, ${epochKey}]`);
          }
          const decompStr = LZUTF8.decompress(
            compCacheJsonTmp, { inputEncoding: "StorageBinaryString" }
          );
          return _.merge(JSON.parse(decompStr), { cacheEpoch: cacheEpoch });
        } else {
          return null;
        }
      }
    }
  }

  /** Caches a JSON element */
  static cacheResponse(
    key: string, prefix: string, value: Record<string, any>, epochKey: number | undefined, isDebug: boolean = false
  ) {
    const valueStr = JSON.stringify(value);
    const compressedVal = LZUTF8.compress(
      valueStr, { outputEncoding: "StorageBinaryString" }
    );
    for (let i = 0; i < 15; i++) {
      const success = (ls as any).set(prefix + key, (epochKey || "0") + ":" + compressedVal);
      if (success) {
        return true;
      } else { // (remove the LRU and try again, up to 15 times)
        ClientRequestCache.removeLru();
      }
    }//if we get to here then just let the caller know and exit)
    return false;
  }

  private static removeLru() {
    //TODO
  }

}
