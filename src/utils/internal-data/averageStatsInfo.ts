// @ts-ignore
import { publicStatsAveragesMen2018_9 } from "../../utils/public-data/publicStatsAveragesMen2018_9";
// @ts-ignore
import { publicStatsAveragesMen2019_20 } from "../../utils/public-data/publicStatsAveragesMen2019_20";
// @ts-ignore
import { publicStatsAveragesMen2020_21 } from "../../utils/public-data/publicStatsAveragesMen2020_21";
// @ts-ignore
import { publicStatsAveragesWomen2018_9 } from "../../utils/public-data/publicStatsAveragesWomen2018_9";
// @ts-ignore
import { publicStatsAveragesWomen2019_20 } from "../../utils/public-data/publicStatsAveragesWomen2019_20";

export const averageStatsInfo: Record<string, Record<string, any>> = {
  "Men_2014/5": {},
  "Men_2015/6": {},
  "Men_2016/7": {},
  "Men_2017/8": {},
  "Men_2018/9": publicStatsAveragesMen2018_9,
  "Men_2019/20": publicStatsAveragesMen2019_20,
  "Men_2020/21": publicStatsAveragesMen2020_21,
  "Women_2018/9": publicStatsAveragesWomen2018_9,
  "Women_2019/20": publicStatsAveragesWomen2019_20
};
