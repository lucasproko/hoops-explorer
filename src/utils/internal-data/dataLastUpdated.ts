
/** The date when the data for the given year was last updated - will clear local caching */
export const dataLastUpdated: Record<string, number> = { //Update by executing ./get-epoch-time.sh
  "Men_2014/5": 1428624017,
  "Men_2015/6": 1458864019,
  "Men_2016/7": 1491782417,
  "Men_2017/8": 1523318417,
  "Men_2018/9": 1554854427,
  "Women_2018/9": 1554854427,
  "Men_2019/20": 1583968723,
  "Women_2019/20": 1583968723,
  "Men_2020/21": 1617682993,
  "Women_2020/21": 1617682993,
  "Men_2021/22": parseInt(process.env.MEN_CURR_UPDATE || "0"),
  "Women_2021/22": parseInt(process.env.WOMEN_CURR_UPDATE || "0")
};
