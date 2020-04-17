import { ncaaToKenpomLookup_2014_15, ncaaToKenpomLookup_2015_16, ncaaToKenpomLookup_2016_17, ncaaToKenpomLookup_2017_18, ncaaToKenpomLookup_2018_19, ncaaToKenpomLookup_2019_20 } from "../../utils/public-data/ncaaToKenpomLookup";
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
  "Men_2014/5": [ publicKenpomEfficiency2014_5, ncaaToKenpomLookup_2014_15 ],
  "Men_2015/6": [ publicKenpomEfficiency2015_6, ncaaToKenpomLookup_2015_16 ],
  "Men_2016/7": [ publicKenpomEfficiency2016_7, ncaaToKenpomLookup_2016_17 ],
  "Men_2017/8": [ publicKenpomEfficiency2017_8, ncaaToKenpomLookup_2017_18 ],
  "Men_2018/9": [ publicKenpomEfficiency2018_9, ncaaToKenpomLookup_2018_19 ],
  "Men_2019/20": [ publicKenpomEfficiency2019_20, ncaaToKenpomLookup_2019_20 ],
  "Women_2018/9": [ publicHerhoopstatsEfficiency2018_9, {} ], //(herhoopstats uses NCAA team names)
  "Women_2019/20": [ publicHerhoopstatsEfficiency2019_20, {} ] //(herhoopstats uses NCAA team names)
};
