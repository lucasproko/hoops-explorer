
// Utils:
import _ from 'lodash'

/** Utilities for managing luck or manual overrides to individual/team stats */
export class OverrideUtils {

  private static readonly getOriginalVal = (mutableVal: any) => {
    return _.isNil(mutableVal?.old_value) ? mutableVal?.value : mutableVal?.old_value;
  }
  /** If the old value was null we leave it alone */
  private static readonly getIgnoreNull = (val: any) => (val?.old_value == null) ? { value: null }  : val;

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
  }

}
