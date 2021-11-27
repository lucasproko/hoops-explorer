
/** The date when the data for the given year was last updated - will clear local caching */
export const dataLastUpdated: Record<string, number> = { //Update by executing ./get-epoch-time.sh
  "Men_2014/5": 1428624018,
  "Men_2015/6": 1458864020,
  "Men_2016/7": 1491782418,
  "Men_2017/8": 1523318418,
  "Men_2018/9": 1554854428,
  "Women_2018/9": 1554854428,
  "Men_2019/20": 1583968724,
  "Women_2019/20": 1583968724,
  "Men_2020/21": 1617682994,
  "Women_2020/21": 1617682994,
  "Men_2021/22": parseInt(process.env.MEN_CURR_UPDATE || "0"),
  "Women_2021/22": parseInt(process.env.WOMEN_CURR_UPDATE || "0")
};
