// System imports
import { NextApiResponse, NextApiRequest } from 'next';
import fetch from 'isomorphic-unfetch';

import queryString from "query-string";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const url = require('url').parse(req.url);
    const parsed: Record<string, any> = queryString.parse(url.query, {parseBooleans: true}) as any;

    const getFilename = () => {
        const transferMode = parsed["transferMode"] || "";
        if ((transferMode == "") || (transferMode == "true")) { //(available transfers only)
            return "current_transfers.json";
        } else { //(all transfers from previous year)
            return `transfers_${transferMode}.json`;
        }
    };

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
            const resp = await fetch(`https://storage.googleapis.com/${process.env.LEADERBOARD_BUCKET}/${getFilename()}`, {
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
  