// System imports
import { NextApiResponse, NextApiRequest } from 'next';
import fetch from 'isomorphic-unfetch';

import queryString from "query-string";
import { Readable, Writable } from 'stream';

// My existing streaming code didn't work in node10
// production is an earlier version so doesn't have this issue, but I can't share the code
const pxIsDebug = (process.env.NODE_ENV !== 'production');
if (pxIsDebug) {
    console.log(`Running locally (getLeaderboard): use node v18+ constructs for streaming`);
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = require('url').parse(req.url);
    const parsed: Record<string, any> = queryString.parse(url.query, {parseBooleans: true}) as any;
    //src: players|lineups
    //oppo: t100, conf, all
    //tier: High, Medium, Low
    //gender: Men, Women

    // Check the request is cacheable: ie GET, no Authorization header, no Range header, no _vercel_no_cache
    // and no _vercel_no_cache cookie
    if (req.headers?.cookie?.includes("_vercel_no_cache") || 
        req.headers?.authorization || req.headers?.range || 
        parsed._vercel_no_cache ||
        req.method != "GET"
    ) {
        res.status(400).json({ error: "Request must be cacheable" });
        return undefined;
    } else {
        if (req.headers?.['accept-encoding']?.includes("gzip")) {
            try {
                const cacheId = process.env.NEXT_PUBLIC_VERCEL_URL || "default_cache_control";
                const resp = await fetch(`https://storage.googleapis.com/${process.env.LEADERBOARD_BUCKET}/${parsed.src}_${parsed.oppo}_${parsed.gender}_${parsed.year}_${parsed.tier}.json.gz?cacheId=${cacheId}`, {
                    method: 'get'
                });
                if (resp.status >= 400) {
                    res.status(resp.status).json({ error: `status code error [${resp.status}]` });
                } else {
                    res.setHeader("Cache-Control", "s-maxage=28800"); // requests that the CDN cache this for 12 hours or until the app redeploys
                    res.setHeader("Content-Encoding", "gzip");
                    res.setHeader("Content-Type", "application/json");

                    res.status(200);
                    if (pxIsDebug) {
                        //@ts-ignore
                        Readable.fromWeb(resp.body).pipe(res)
                    } else {
                        res.send(resp.body)
                    }
                }
            } catch (e) {
                //console.log(e.message);                
                res.status(500).json({ error: "Unknown error"});
            }
        } else {
            res.status(400).json({ error: "Client must support accept-encoding: gzip"});
        }
    }    
  }
  
  export const config = {
    api: {
      bodyParser: false,
    },
  };