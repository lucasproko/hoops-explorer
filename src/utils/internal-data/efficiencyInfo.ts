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
import { publicKenpomEfficiency2020_21 } from "../../utils/public-data/publicKenpomEfficiency2020_21";
// @ts-ignore
import { publicKenpomEfficiency2021_22 } from "../../utils/public-data/publicKenpomEfficiency2021_22";
// @ts-ignore
import { publicKenpomEfficiency2022_23 } from "../../utils/public-data/publicKenpomEfficiency2022_23";
// @ts-ignore
import { publicHerhoopstatsEfficiency2018_9 } from "../../utils/public-data/publicHerhoopstatsEfficiency2018_9";
// @ts-ignore
import { publicHerhoopstatsEfficiency2019_20 } from "../../utils/public-data/publicHerhoopstatsEfficiency2019_20";
// @ts-ignore
import { publicNcaawMassey2020_21 } from "../../utils/public-data/publicNcaawMassey2020_21";
// @ts-ignore
import { publicNcaawMassey2021_22 } from "../../utils/public-data/publicNcaawMassey2021_22";

export const efficiencyInfo: Record<string, [ Record<string, any>, Record<string, any> ]> = {
  "Men_2014/5": [ publicKenpomEfficiency2014_5, {} ], //(kenpom, convert the names at source)
  "Men_2015/6": [ publicKenpomEfficiency2015_6, {} ],
  "Men_2016/7": [ publicKenpomEfficiency2016_7, {} ],
  "Men_2017/8": [ publicKenpomEfficiency2017_8, {} ],
  "Men_2018/9": [ publicKenpomEfficiency2018_9, {} ],
  "Men_2019/20": [ publicKenpomEfficiency2019_20, {} ],
  "Men_2020/21": [ publicKenpomEfficiency2020_21, {} ],
  "Men_2021/22": [ publicKenpomEfficiency2021_22, {} ],
  "Men_2022/23": [ publicKenpomEfficiency2022_23, {} ],
  //"Men_2022/23" - calculated on the fly
  "Men_Latest": [ publicKenpomEfficiency2022_23, {} ],

  "Women_2018/9": [ publicHerhoopstatsEfficiency2018_9, {} ], //(herhoopstats uses NCAA team names)
  "Women_2019/20": [ publicHerhoopstatsEfficiency2019_20, {} ],
  "Women_2020/21": [ publicNcaawMassey2020_21, {} ],  //(Massey, convert the names at source)
  "Women_2021/22": [ publicNcaawMassey2021_22, {} ],  //(Massey, convert the names at source)
  //"Women_2022/23" - TODO
  "Women_Latest": [ publicNcaawMassey2021_22, {} ],  //(Massey, convert the names at source)
};
