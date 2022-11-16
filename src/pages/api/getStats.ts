// System imports
import { NextApiResponse, NextApiRequest } from 'next';
import fetch from 'isomorphic-unfetch';

import queryString from "query-string";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const url = require('url').parse(req.url);
    const parsed: Record<string, any> = queryString.parse(url.query, {parseBooleans: true}) as any;
    //tier: High, Medium, Low, Combo
    //gender: Men, Women
    //type: player, team
    const urlInFix = parsed.type == "player" ? "players_" : "";

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
                const resp = await fetch(`https://storage.googleapis.com/${process.env.LEADERBOARD_BUCKET}/stats_${urlInFix}all_${parsed.gender}_${parsed.year}_${parsed.tier}.json.gz?cacheId=${cacheId}`, {
                    method: 'get'
                });
                res.setHeader("Cache-Control", "s-maxage=28800"); // requests that the CDN cache this for 12 hours or until the app redeploys
                res.setHeader("Content-Encoding", "gzip");

                res.setHeader("Content-Type", "application/json");
                res.status(200).send(resp.body);
            } catch (e) {
                //console.log(e);
                res.status(500).json({ error: "Unknown error"});
            }
        } else {
            res.status(400).json({ error: "Client must support accept-encoding: gzip"});
        }
    }    
  }
  