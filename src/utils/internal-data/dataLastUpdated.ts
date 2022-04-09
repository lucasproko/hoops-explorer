
/** The date when the data for the given year was last updated - will clear local caching */
export const dataLastUpdated: Record<string, number> = { //Update by executing ./get-epoch-time.sh
  "Men_2014/5": 1428624018,
  "Men_2015/6": 1458864012,
  "Men_2016/7": 1491782417,
  "Men_2017/8": 1523318417,
  "Men_2018/9": 1554854428,
  "Women_2018/9": 1554854428,
  "Men_2019/20": 1583968724,
  "Women_2019/20": 1583968724,
  "Men_2020/21": 1617682995,
  "Women_2020/21": 1617682996,
  "Men_2021/22": 1649491206,
  "Women_2021/22": 1649491206,
  "Men_2022/23": parseInt(process.env.MEN_CURR_UPDATE || "0"),
  "Women_2022/23": parseInt(process.env.WOMEN_CURR_UPDATE || "0")
};

const seasonNotFinished: Record<string, boolean> = {
  "Men_2021/22": false,
  "Women_2021/22": false
};

/** Approx 20d before the end of the actual season */
export const getEndOfRegSeason = (gender_year: string) => 
  seasonNotFinished[gender_year] ? undefined : (dataLastUpdated[gender_year]! - 20*24*3600);