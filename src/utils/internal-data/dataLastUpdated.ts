
/** The date when the data for the given year was last updated - will clear local caching */
export const dataLastUpdated: Record<string, number> = { //Update by executing ./get-epoch-time.sh
  "Men_2014/5": 1428624003,
  "Men_2015/6": 1458864005,
  "Men_2016/7": 1491782403,
  "Men_2017/8": 1523318403,
  "Men_2018/9": 1554854406,
  "Women_2018/9": 1554854409,
  "Men_2019/20": 1586476803,
  "Women_2019/20": 1586476803
  // "Men_2020/21": parseInt(process.env.MEN_CURR_UPDATE || "0"),
  // "Women_2020/21": parseInt(process.env.WOMEN_CURR_UPDATE || "0")
};
