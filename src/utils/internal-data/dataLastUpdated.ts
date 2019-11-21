
/** The date when the data for the given year was last updated - will clear local caching */
export const dataLastUpdated: Record<string, number> = { //Update by executing ./get-epoch-time.sh
  "Men_2015/6": 1458864000,
  "Men_2018/9": 1554854400,
  "Men_2019/20": parseInt(process.env.MEN_CURR_UPDATE || "0"),
  "Women_2018/9": parseInt(process.env.WOMEN_CURR_UPDATE || "0")
};
