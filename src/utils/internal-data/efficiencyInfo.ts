import { ncaaToKenpomLookup } from "../../utils/public-data/ncaaToKenpomLookup";
// @ts-ignore
import { publicKenpomEfficiency2014_5 } from "../../utils/public-data/publicKenpomEfficiency2014_5";
// @ts-ignore
import { publicKenpomEfficiency2015_6 } from "../../utils/public-data/publicKenpomEfficiency2015_6";
// @ts-ignore
import { publicKenpomEfficiency2016_7 } from "../../utils/public-data/publicKenpomEfficiency2016_7";
// @ts-ignore
import { publicKenpomEfficiency2017_8 } from "../../utils/public-data/publicKenpomEfficiency2017_8";
// @ts-ignore
import { publicKenpomEfficiency2018_9 } from "../../utils/public-data/publicKenpomEfficiency2018_9";
// @ts-ignore
import { publicKenpomEfficiency2019_20 } from "../../utils/public-data/publicKenpomEfficiency2019_20";
// @ts-ignore
import { publicHerhoopstatsEfficiency2018_9 } from "../../utils/public-data/publicHerhoopstatsEfficiency2018_9";
// @ts-ignore
import { publicHerhoopstatsEfficiency2019_20 } from "../../utils/public-data/publicHerhoopstatsEfficiency2019_20";

export const efficiencyInfo: Record<string, [ Record<string, any>, Record<string, any> ]> = {
  "Men_2014/5": [ publicKenpomEfficiency2014_5, ncaaToKenpomLookup ],
  "Men_2015/6": [ publicKenpomEfficiency2015_6, ncaaToKenpomLookup ],
  "Men_2016/7": [ publicKenpomEfficiency2016_7, ncaaToKenpomLookup ],
  "Men_2017/8": [ publicKenpomEfficiency2017_8, ncaaToKenpomLookup ],
  "Men_2018/9": [ publicKenpomEfficiency2018_9, ncaaToKenpomLookup ],
  "Men_2019/20": [ publicKenpomEfficiency2019_20, ncaaToKenpomLookup ],
  "Women_2018/9": [ publicHerhoopstatsEfficiency2018_9, {} ], //(herhoopstats uses NCAA team names)
  "Women_2019/20": [ publicHerhoopstatsEfficiency2019_20, {} ] //(herhoopstats uses NCAA team names)
};
