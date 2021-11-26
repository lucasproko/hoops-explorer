
// Utils:
import _ from 'lodash'

import { ManualOverride, ParamPrefixesType, ParamPrefixes } from "../FilterModels";
import { IndivStatSet, Statistic } from '../StatModels';

/** Utilities for managing luck or manual overrides to individual/team stats */
export class OverrideUtils {

  /** Returns the original value regardless of whether it's overridden or not */
  private static readonly getOriginalVal = (mutableVal: Statistic): number | undefined => {
    return (_.isNil(mutableVal?.old_value) ? mutableVal?.value : mutableVal?.old_value);
  };


  /** If the old value was nil we leave it alone */
  private static readonly getIgnoreNil = (val: Statistic) => _.isNil(val?.old_value) ? { value: undefined }  : val;

  /** Shared format for individual override row ids */
  static readonly getPlayerRowId = (playerId: string, rowSubType: "On" | "Off" | "Baseline" | "Global") => {
    return `${playerId} / ${rowSubType}`;
  };

  /** For a given table type lists the key/name for stats that we let users overrride */
  static readonly getOverridableStats = (tableType: ParamPrefixesType) => {
    return _.fromPairs((() => {
      switch (tableType) {
        case ParamPrefixes.player: return _.sortBy([
          [ "off_3p", "Offensive 3P%" ],
          [ "off_2pmid", "Offensive mid-range 2P%" ],
          [ "off_2prim", "Offensive rim/dunk 2P%" ],
          [ "off_ft", "Offensive FT%" ],
  //TODO: avoid rate stats for now ... longer term would like to be able to say
  // more mid-range shots, more rim shots, etc and can also include FTR then
  //        [ "off_ftr", "Offensive FT rate" ],
          [ "off_to", "Offensive TO%" ],
        ], [ (o: any[]) => o[1] ]);
        default: return [];
      }
    })());
  };

  /** Convert the list of overrides into a map of maps of numbers */
  static readonly buildOverrideAsMap = (overrides: ManualOverride[]) => {
    return _.transform(overrides, (acc, over) => {
      if (over.use) {
        const maybePlayer = acc[over.rowId] || {};
        maybePlayer[over.statName] = over.newVal;
        acc[over.rowId] = maybePlayer;
      }
    }, {} as Record<string, Record<string, number>>);
  };

  /** Overrides the specified key (newVal undefined means set back), returns true if mutated */
  static readonly overrideMutableVal = (
    mutableStats: IndivStatSet, inKey: string, inNewVal: number | { delta: number } | undefined, reason: string | undefined
  ) => {
    const key = inKey.startsWith(OverrideUtils.shotQualityPrefix) ? 
      `off_${inKey.substring(OverrideUtils.shotQualityPrefix.length)}` : inKey;

    if (mutableStats[key]) {
      const originalVal = OverrideUtils.getOriginalVal(mutableStats[key]);

      const newVal = (OverrideUtils.shotQualityRim == inKey) ?
        OverrideUtils.getRimPctFromTs(inNewVal as number | undefined, mutableStats) : inNewVal;

      const maybeReason = mutableStats[key]?.override;
      // (don't unset an param that was overridden for a different reason - though empty reason always unsets)
      const noOverwrite = _.isNil(newVal) && !_.isNil(maybeReason) && !_.isNil(reason) && (maybeReason != reason);
      if (!noOverwrite) {
        mutableStats[key] = _.isNil(newVal) ? {
          value: originalVal
        } : OverrideUtils.getIgnoreNil({
          value: _.isNumber(newVal) ? newVal : (originalVal || 0) + (newVal?.delta || 0),
          old_value: originalVal,
          override: reason
        });
      }
      return !_.isNil(newVal);
    } else {
      return false;
    }
  };

  /** The delta from the raw value to the override */
  static readonly diff = (val: any) => {
    return _.isNil(val?.old_value) ? 0.0 : (val?.value || 0) - val.old_value;
  };

  /** Where overrides to shooting have occurred, update 4 factors - overwrites any luck values */
  static readonly updateDerivedStats = (mutableStats: IndivStatSet, reason: string | undefined) => {

    //TODO: this is a bit of a mess ... should handle luck and override derived vals in one place

    const threePR = (mutableStats.off_3pr?.value || 0);
    const midR = (mutableStats.off_2pmidr?.value || 0);
    const rimR = (mutableStats.off_2primr?.value || 0);
    const deltaEfg_3p = threePR*OverrideUtils.diff(mutableStats.off_3p)*1.5;
    const deltaEfg_2p_mid = midR*OverrideUtils.diff(mutableStats.off_2pmid);
    const deltaEfg_2p_rim = rimR*OverrideUtils.diff(mutableStats.off_2prim);
    const deltaEfg = deltaEfg_3p + deltaEfg_2p_mid + deltaEfg_2p_rim;

    const delta2p = (deltaEfg_2p_mid + deltaEfg_2p_rim)/(1.0 - threePR);
    if (delta2p != 0.0) {
      OverrideUtils.overrideMutableVal(mutableStats, "off_2p", { delta: delta2p }, reason);
    } else { //(setting reason as undefined ensures it gets overwritten...
      //... this is desirable because I'm overwriting any luck effects)
      OverrideUtils.overrideMutableVal(mutableStats, "off_2p", undefined, undefined);
    }
    if (deltaEfg != 0.0) {
      OverrideUtils.overrideMutableVal(mutableStats, "off_efg", { delta: deltaEfg }, reason);
    } else { //(always set reason as undefined, see above)
      OverrideUtils.overrideMutableVal(mutableStats, "off_efg", undefined, undefined);
    }
  };

  // Some utils needed for Shot Quality overrides

  static readonly shotQualityPrefix = "sq_";
  static readonly shotQualityRim = "sq_2prim";
  static readonly shotQualityMid = "sq_2pmid";
  static readonly shotQualityThree = "sq_3p";

  static readonly shotQualityMetricMap: Record<string, string> = {
    [OverrideUtils.shotQualityRim]: "Shot Quality Rim TS%",
    [OverrideUtils.shotQualityMid]: "Shot Quality Mid FG%",
    [OverrideUtils.shotQualityThree]: "Shot Quality 3P FG%",
  };  

  /** see getOldRimTs */
  static readonly sqFtWeight = 0.88;

  /** 
   * Calculates the rim true shooting from the raw numbers (ie before any overrides)
   * We assume that FTs _all_ come from the rim, since anything else is too complicated 
   */
   static readonly getOldRimTs = (statSet: IndivStatSet) => {
    const rimr = (statSet.off_2primr?.value || 0); // eg 50% would be 100 2PA (if 200 FGA)
    const rimFtr = (statSet.off_ftr?.value || 0); //eg 25% would be 25%*200FGA == 50 FTA, ie 50% rim FTR

    // Example: 100 FGA: 30 2PAs (30% rimr) + 20 FTA (20% ftr) ... 15 FGM + 15 FTM => 45pts / 2*(30 + 0.44*20) => 45/70 ~= 65%
    // We use 88% of both FTA/FTR because a) we only care about 2FTs, b) some of the FTs are 3P/bonus
  
    const weight = OverrideUtils.sqFtWeight;
    const ftPct = OverrideUtils.getOriginalVal(statSet.off_ft || {}) || 0;

    const ts = 
      (2*rimr*(OverrideUtils.getOriginalVal(statSet.off_2prim || {}) || 0) + weight*rimFtr*ftPct)
        /(2*rimr + weight*rimFtr);

    return ts;
  };

  /** Opposite of getOldRimTs */
  private static readonly getRimPctFromTs = (ts: number | undefined, statSet: IndivStatSet) => {
    const rimr = (statSet.off_2primr?.value || 0); // eg 50% would be 100 2PA (if 200 FGA)
    const rimFtr = (statSet.off_ftr?.value || 0); //eg 25% would be 25%*200FGA == 50 FTA, ie 50% rim FTR

    const weight = OverrideUtils.sqFtWeight;
    const ftPct = OverrideUtils.getOriginalVal(statSet.off_ft || {}) || 0;

    const newRim = ts ? (ts*(2*rimr + weight*rimFtr) - weight*rimFtr*ftPct) / (2*rimr || 1) : 0;

    return newRim;
  }

  /** Switches from sq_ to the corresponding stat set key */
  static readonly shotQualityKeyToKey = (key: string) => {
    const statNameKey = key.startsWith(OverrideUtils.shotQualityPrefix) ? 
      `off_${key.substring(OverrideUtils.shotQualityPrefix.length)}` : key 
    return statNameKey;
  };

    /** Switches from sq_ to the corresponding stat set key */
    static readonly keyToShotQualityKey = (key: string): string | undefined => {
      const candidate = `sq_${key.substring(4)}`;
      const sqKey = OverrideUtils.shotQualityMetricMap[candidate];
      return sqKey ? candidate : undefined;
    };
  
}
