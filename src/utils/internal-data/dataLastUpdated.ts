
/** The date when the data for the given year was last updated - will clear local caching */
export const dataLastUpdated: Record<string, number> = { //Update by executing ./get-epoch-time.sh
  "Men_2014/5": 1428624005,
  "Men_2015/6": 1458864007,
  "Men_2016/7": 1491782405,
  "Men_2017/8": 1523318405,
  "Men_2018/9": 1554854412,
  "Women_2018/9": 1554854412,
  "Men_2019/20": 1583968708,
  "Women_2019/20": 1583968708
  // "Men_2020/21": parseInt(process.env.MEN_CURR_UPDATE || "0"),
  // "Women_2020/21": parseInt(process.env.WOMEN_CURR_UPDATE || "0")
};
