// System imports
import { NextApiResponse, NextApiRequest } from 'next';
import fetch from 'isomorphic-unfetch';

import queryString from "query-string";

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
        try {
            const cacheId = process.env.NEXT_PUBLIC_VERCEL_URL || "default_cache_control";
            const resp = await fetch(`https://storage.googleapis.com/${process.env.LEADERBOARD_BUCKET}/${parsed.src}_${parsed.oppo}_${parsed.gender}_${parsed.year}_${parsed.tier}.json?cacheId=${cacheId}`, {
                method: 'get'
            });
            const respJson = await resp.json();
            res.setHeader("Cache-Control", "s-maxage=28800"); // requests that the CDN cache this for 12 hours or until the app redeploys
            res.status(200).json(respJson);
        } catch (e) {
            res.status(500).json({ error: "Unknown error"});
        }
    }    
  }
  