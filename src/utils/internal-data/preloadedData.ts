

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

  //(menLineup and womenLineup re-used for pre-loaded Team On/Off Report samples)
}

/** A list of key/value parits to preload into local storage - note 'cacheEpoch' is overwritten */
export const preloadedData: Record<string, Record<string, any>> = {
  // I decided to remove all pre-loaded data so I didn't have to keep it up to date,
  // and just trust in the caches.
};
