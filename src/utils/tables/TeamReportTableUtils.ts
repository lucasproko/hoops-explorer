// Lodash
import _ from "lodash";

// Util imports
import { RapmInfo, RapmUtils } from "../stats/RapmUtils";
import { LineupUtils } from "../stats/LineupUtils";

/** Object marshalling logic for roster tables */
export class TeamReportTableUtils {

  /** For a given lineup set, calculate RAPM as quickly as possible */
  static buildOrInjectRapm(
    enrichedLineups: Array<Record<string, any>>, playerInfo: Record<string, any>,
    adjustForLuck: Boolean, avgEfficiency: number,
    preCalcTeamReport: undefined | Record<string, any> = undefined, //(can calculate this in advance if using anyway)
    rapmPriorMode: number = -1, rapmDiagMode: string = ""
  ): RapmInfo | undefined {
    //TODO (#4): manual edits don't show as override (so can't see original value) - fix at some point
    // but not worth delaying over

    //TODO (#173): ^ similar for on-ball defense adjustments. Both these only affect the priors, so
    //need some logic to loop over before/after options for luck/!luck

    const tempTeamReport = preCalcTeamReport || LineupUtils.lineupToTeamReport({ //(calcs for both luck and non-luck versions)
      lineups: enrichedLineups
    });

    // Has to be in this order, else injectRapmIntoPlayers doesn't work properly
    const results = ([ "value", "old_value"  ] as Array<"value" | "old_value">).filter(valueKey => {
      if (valueKey == "old_value" && !adjustForLuck) return false; //(nothing to do)
      else return true;
    }).map((valueKey, index) => {
      try {
        const rapmContext = RapmUtils.buildPlayerContext(
          tempTeamReport.players || [], enrichedLineups,
          playerInfo,
          avgEfficiency,
          valueKey, //<- with or without luck adjustment, only applies to priors
          rapmPriorMode
        );
        const [ offRapmWeights, defRapmWeights ] = RapmUtils.calcPlayerWeights(rapmContext);
        const preProcDiags = RapmUtils.calcCollinearityDiag(offRapmWeights, rapmContext);
        const [ offRapmInputs, defRapmInputs ] = RapmUtils.pickRidgeRegression(
          offRapmWeights, defRapmWeights, rapmContext, preProcDiags.adaptiveCorrelWeights, (rapmDiagMode != ""),
          valueKey //<- we fit to the overall efficiency, be it luck adjusted or not
        );
        RapmUtils.injectRapmIntoPlayers(
          tempTeamReport.players || [], offRapmInputs, defRapmInputs, {}, rapmContext, preProcDiags.adaptiveCorrelWeights,
          "old_value", valueKey
          //^ currently: not using luck in lineup calcs (ie old_value if it exists),
          // but writing a luck-adjusted version based on different priors
        );
        return {
          enrichedPlayers: tempTeamReport.players || [],
          ctx: rapmContext,
          preProcDiags: preProcDiags,
          offWeights: offRapmWeights,
          defWeights: defRapmWeights,
          offInputs: offRapmInputs,
          defInputs: defRapmInputs
        };
      } catch (err) {
        console.log(`Error calculating RAPM for [${valueKey}]: [${err.message}]`);
        return undefined;
      }
    });
    return results[0]!;
  }

};
