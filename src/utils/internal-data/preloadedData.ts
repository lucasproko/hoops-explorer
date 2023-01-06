

/** Some sample keys, for convenience */
export class PreloadedDataSamples {
  static readonly womenOnOff =
    'baseQuery=&gender=Women&maxRank=400&minRank=0&offQuery=NOT%20%28Kaila%29&onQuery=Kaila&team=Maryland&year=2018%2F9';
  /** Entire season results for Men on/off demo */
  static readonly womenOnOffSeason =
    'baseQuery=&gender=Women&maxRank=400&minRank=0&offQuery=&onQuery=&team=Maryland&year=2018%2F9';

  static readonly menOnOff =
    'baseQuery=NOT%20%28Terrell%20OR%20Valmon%20OR%20Clark%29&gender=Men&maxRank=100&minRank=0&offQuery=NOT%20%28Bruno%29&onQuery=Bruno&team=Maryland&year=2018%2F9';
  /** Entire season results for Men on/off demo */
  static readonly menOnOffSeason =
    'baseQuery=&gender=Men&maxRank=400&minRank=0&offQuery=&onQuery=&team=Maryland&year=2018%2F9';

  static readonly menLineup =
    'baseQuery=&gender=Men&maxRank=400&minRank=0&team=Virginia&year=2018%2F9';
  static readonly menLineupOnOff =
  'baseQuery=&gender=Men&maxRank=400&minRank=0&offQuery=&onQuery=&team=Virginia&year=2018%2F9';
  static readonly menLineupOnOffSeason = PreloadedDataSamples.menLineupOnOff;

  static readonly womenLineup =
    'baseQuery=&gender=Women&maxRank=100&minRank=0&team=Maryland&year=2018%2F9';
  static readonly womenLineupOnOff =
    'baseQuery=&gender=Women&maxRank=100&minRank=0&offQuery=&onQuery=&team=Maryland&year=2018%2F9';
  static readonly womenLineupOnOffSeason =
    'baseQuery=&gender=Women&maxRank=400&minRank=0&offQuery=&onQuery=&team=Maryland&year=2018%2F9';

  static readonly menSingleGames =
    'baseQuery=opponent.team%3A%22North%20Carolina%22%20AND%20date%3A2022-04-04&gender=Men&maxRank=400&minRank=0&oppoTeam=vs%20North%20Carolina%20%282022-04-04%29%3A%20W%2072-69&team=Kansas&year=2021%2F22&';
  static readonly womenSingleGames =
    'baseQuery=opponent.team%3A%22Louisville%22%20AND%20date%3A2022-04-01&gender=Women&maxRank=400&minRank=0&oppoTeam=vs%20Louisville%20%282022-04-01%29%3A%20W%2072-59&team=South%20Carolina&year=2021%2F22&';

  //(menLineup and womenLineup re-used for pre-loaded Team On/Off Report samples)
}

/** A list of key/value parits to preload into local storage - note 'cacheEpoch' is overwritten */
export const preloadedData: Record<string, Record<string, any>> = {
  // I decided to remove all pre-loaded data so I didn't have to keep it up to date,
  // and just trust in the caches.
};
