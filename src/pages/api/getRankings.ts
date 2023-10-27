import { NextApiResponse, NextApiRequest } from "next";
import fetch from "isomorphic-unfetch";
import _ from "lodash";
import LRUCache from "lru-cache";

import queryString from "query-string";
import { Tabletojson } from "tabletojson";
import { DateUtils } from "../../utils/DateUtils";

const rankingCache = new LRUCache<string, Record<string, any>>({
  max: 20,
  maxAge: 4 * 3600 * 1000, //(in ms, 4h cache before age out)
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = require("url").parse(req.url);
  const parsed: Record<string, any> = queryString.parse(url.query || "", {
    parseBooleans: true,
  }) as any;
  // year (eg 2021/22), name=NCAAT|AP|NET, gender=Men|Women

  const cacheKey = `${parsed.year}_${parsed.name}_${parsed.gender || "Men"}`;

  if (parsed.name == "NET") {
    if (parsed.year <= DateUtils.mostRecentYearWithNetAvailable) {
      const maybeCachedVal = rankingCache.get(cacheKey);
      if (!maybeCachedVal) {
        console.log(`getRankings: Retrieving and caching [${cacheKey}]`);

        const url =
          parsed.gender == "Women"
            ? "https://www.ncaa.com/rankings/basketball-women/d1/ncaa-womens-basketball-net-rankings"
            : "https://www.ncaa.com/rankings/basketball-men/d1/ncaa-mens-basketball-net-rankings";

        const getNetInfo = await fetch(url);
        const getNetInfoBody = await getNetInfo.text();

        const netInfoJson = Tabletojson.convert(getNetInfoBody);
        const parsedNetInfoJson = _.transform(
          netInfoJson?.[0] || [],
          (acc, teamObj: any, index: number) => {
            const rank = parseInt(teamObj.Rank || "");
            if (teamObj.School && !_.isNaN(rank)) {
              acc[teamObj.School] = rank;
            }
          },
          {} as Record<string, number>
        );

        rankingCache.set(cacheKey, parsedNetInfoJson);
        res.status(200).json(parsedNetInfoJson);
      } else {
        res.status(200).json(maybeCachedVal);
      }
    } else {
      res.status(404).json({});
    }
  } else {
    res.status(404).json({});
  }
};
