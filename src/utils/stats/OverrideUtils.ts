
// Utils:
import _ from 'lodash'

import { ManualOverride, ParamPrefixesType, ParamPrefixes } from "../FilterModels";

/** Utilities for managing luck or manual overrides to individual/team stats */
export class OverrideUtils {

  /** Returns the original value regardless of whether it's overridden or not */
  private static readonly getOriginalVal = (mutableVal: any) => {
    return _.isNil(mutableVal?.old_value) ? mutableVal?.value : mutableVal?.old_value;
  };

  /** If the old value was null we leave it alone */
  private static readonly getIgnoreNull = (val: any) => (val?.old_value == null) ? { value: null }  : val;

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
    mutableStats: any, key: string, newVal: number | { delta: number } | undefined, reason: string | undefined
  ) => {
    if (mutableStats[key]) {
      const originalVal = OverrideUtils.getOriginalVal(mutableStats?.[key]);
        mutableStats[key] = _.isNil(newVal) ? {
          value: originalVal
        } : OverrideUtils.getIgnoreNull({
          value: _.isNumber(newVal) ? newVal : originalVal + (newVal?.delta || 0),
          old_value: originalVal,
          override: reason || "unknown"
        });
        return !_.isNil(newVal);
    } else {
      return false;
    }
  };

  /** Where overrides to shooting have occurred, update 4 factors */
  static readonly updatePlayer4Factors = (mutableStats: any, reason: string | undefined) => {
    const diff = (val: any) => {
      return _.isNil(val.old_value) ? 0.0 : (val?.value || 0) - val.old_value;
    };
    const deltaEfg = (mutableStats.off_3pr?.value || 0)*diff(mutableStats.off_3p)*1.5;

    if (deltaEfg != 0.0) {
      OverrideUtils.overrideMutableVal(mutableStats, "off_efg", { delta: deltaEfg }, reason);
    }
  };

}
