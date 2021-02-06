// Lodash
import _ from "lodash";

// Util imports
import { RatingUtils } from "../stats/RatingUtils";
import { PositionUtils } from "../stats/PositionUtils";
import { LineupUtils } from "../stats/LineupUtils";
import { LuckUtils, OffLuckAdjustmentDiags, DefLuckAdjustmentDiags, LuckAdjustmentBaseline } from "../stats/LuckUtils";

/** Object marshalling logic for roster tables */
export class RosterTableUtils {

  /** Build a lookup map of the roster by their code, eg AaWiggins for "Wiggins, Aaron" (teamSeasonLookup only needed if includePosCat is true) */
  static buildRosterTableByCode(players: Array<any>, includePosCat?: boolean, teamSeasonLookup?: string) {
    return _.chain(players).map(p => {

      //TODO: do I want this one, or the baseline or ???
      if (includePosCat) {
        const [ posConfs, posConfsDiags ] = PositionUtils.buildPositionConfidences(p);
        const [ pos, posDiags ] = PositionUtils.buildPosition(posConfs, p, teamSeasonLookup || "");
        p.posClass = _.values(posConfs);
        p.role = pos;
      }

      return [ p.player_array?.hits?.hits?.[0]?._source?.player?.code || p.key, p ];
    }).fromPairs().value();

  }
};
