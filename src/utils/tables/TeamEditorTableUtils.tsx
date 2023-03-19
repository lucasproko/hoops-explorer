import _ from "lodash";

import { GenericTableColProps, GenericTableOps } from "../../components/GenericTable";
import { CbbColors } from "../CbbColors";
import { CommonTableDefs } from "./CommonTableDefs";

export class TeamEditorTableUtils {

   // Table definitions

   static tableDef(evalMode: boolean, offSeasonMode: boolean, minPct: boolean, enableNil: boolean = false) { 
      const minPctStr = minPct ? " (weighted for a player's mpg)" : "";

      return _.omit({
         title: GenericTableOps.addTitle("", "", CommonTableDefs.rowSpanCalculator, "small", GenericTableOps.htmlFormatter, 20),
         "sep0": GenericTableOps.addColSeparator(0.5),

         pos: GenericTableOps.addDataCol("Pos", "Positional class of player (algorithmically generated)", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
         nil: GenericTableOps.addDataCol("NIL", "User entered guess at players' NIL value / team's NIL costs", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
         actual_mpg: GenericTableOps.addPtsCol("act. mpg", "Actual minutes per game (bench minutes are currently estimated)", CbbColors.alwaysWhite),
         mpg: GenericTableOps.addPtsCol("mpg", "Approximate expected minutes per game (missing minutes per team shown if there are any)", CbbColors.alwaysWhite),
         "sep0.6": GenericTableOps.addColSeparator(0.05), 
         ortg: GenericTableOps.addPtsCol("ORtg", 
            "Offensive Rating, for 'Balanced' projections", 
            CbbColors.varPicker(CbbColors.off_pp100)),
         usage: GenericTableOps.addPctCol("Usg", 
            "Usage for `Balanced` projections", 
            CbbColors.varPicker(CbbColors.usg_offDef)),
         ptsPlus: GenericTableOps.addPtsCol("Pts+", "Points per game scored or created - weighted according to scored/assisted/rebounded: a reasonable proxy for PPG ('Balanced' projection, assumes a 70 possession game)", CbbColors.alwaysWhite),
         rebound: GenericTableOps.addPctCol("RB%", 
            "% of available defensive rebounds made by this player (just last season's numbers)", 
            CbbColors.varPicker(CbbColors.p_def_OR)),
         rpg: GenericTableOps.addPtsCol("Rpg", "Rebounds per game, offensive and defensive (approximately last season's numbers)", CbbColors.alwaysWhite),

         "sep1": GenericTableOps.addColSeparator(2),

         actual_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, what actually happened" + minPctStr, CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
         "actual_sep1.5": GenericTableOps.addColSeparator(0.05),
         actual_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, what actually happened" + minPctStr, CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
         actual_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, what actually happened" + minPctStr, CbbColors.varPicker(CbbColors.def_diff10_p100_redGreen)),
         "actual_sep2": GenericTableOps.addColSeparator(3),

         ok_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Balanced' projections" + minPctStr, CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
         "sep2.5": GenericTableOps.addColSeparator(0.05),
         ok_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections" + minPctStr, CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
         ok_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections" + minPctStr, CbbColors.varPicker(CbbColors.def_diff10_p100_redGreen)),
         "sep3": GenericTableOps.addColSeparator(3),

         good_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections" + minPctStr, CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
         "sep1.5": GenericTableOps.addColSeparator(0.05),
         good_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections" + minPctStr, CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
         good_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections" + minPctStr, CbbColors.varPicker(CbbColors.def_diff10_p100_redGreen)),
         "sep2": GenericTableOps.addColSeparator(3),

         bad_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections" + minPctStr, CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
         "sep3.5": GenericTableOps.addColSeparator(0.05),
         bad_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections" + minPctStr, CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
         bad_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections" + minPctStr, CbbColors.varPicker(CbbColors.def_diff10_p100_redGreen)),
         "sep4": GenericTableOps.addColSeparator(2),

         edit: GenericTableOps.addDataCol("", "Edit the Optimistic/Balanced/Pessmistic projections for the player", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
         disable: GenericTableOps.addDataCol("", "Disable/re-enabled this player from the roster", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
      }, ((evalMode && offSeasonMode) ?
         [
            "ortg", "usage", "rebound", "sep0.6"
         ] : 
         (!offSeasonMode ?
            [
               "actual_net", "actual_off", "actual_def", "actual_sep1.5", "actual_sep2", "bad_net", "bad_off", "bad_def", "sep3.5", "sep4"
            ]
               :
               [
                  "actual_net", "actual_off", "actual_def", "actual_sep1.5", "actual_sep2", "actual_mpg"
               ])
         ).concat(
//TODO: decide on the best display here (would I rather calc rebounds/game or show usage?)            
//            minPct ? [ "usage", "rebound" ] : [ "ptsPlus", "rpg" ]
            minPct ? [ "rebound", "rpg" ] : [ "ptsPlus", "rpg" ]
         ).concat(enableNil ? [] : [ "nil" ])
      ) as Record<string, GenericTableColProps>; 
   }

   static readonly teamTableDef = {
      title: GenericTableOps.addTitle("", "", CommonTableDefs.rowSpanCalculator, "small", GenericTableOps.htmlFormatter, 20),

      mpg: GenericTableOps.addPtsCol("mpg", "Approximate expected minutes per game", CbbColors.alwaysWhite),

      // Only used in eval mode:
      actual_mpg: GenericTableOps.addPtsCol("act. mpg", "Actual minutes per game", CbbColors.alwaysWhite),
      actual_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, what actually happened", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
      actual_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, what actually happened", CbbColors.varPicker(CbbColors.off_pp100)),
      actual_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, what actually happened", CbbColors.varPicker(CbbColors.def_pp100)),

      good_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
      good_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.off_pp100)),
      good_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.def_pp100)),

      ok_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
      ok_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_pp100)),
      ok_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.def_pp100)),

      bad_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
      bad_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.off_pp100)),
      bad_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.def_pp100)),
   }
   static readonly gradeTableDef = {
      title: GenericTableOps.addTitle("", "", CommonTableDefs.rowSpanCalculator, "small", GenericTableOps.htmlFormatter, 20),

      // Only used in eval mode:
      actual_mpg: GenericTableOps.addPtsCol("act. mpg", "Actual minutes per game", CbbColors.alwaysWhite),
      actual_net: GenericTableOps.addDataCol("Net", "Net Adjusted Pts/100 above an average D1 player, what actually happened",
         CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
      actual_off: GenericTableOps.addDataCol(
         "Off", "Offensive Adjusted Pts/100 above an average D1 player, what actually happened", 
         CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
      actual_def: GenericTableOps.addDataCol(
         "Def", "Defensive Adjusted Pts/100 above an average D1 player, what actually happened", 
         CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),

      ok_net: GenericTableOps.addDataCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Balanced' projections",
         CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
      ok_off: GenericTableOps.addDataCol(
         "Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", 
         CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
      ok_def: GenericTableOps.addDataCol(
         "Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", 
         CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),

      good_net: GenericTableOps.addDataCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections",
         CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
      good_off: GenericTableOps.addDataCol(
         "Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", 
         CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
      good_def: GenericTableOps.addDataCol(
         "Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", 
         CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),

      bad_net: GenericTableOps.addDataCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections",
         CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
      bad_off: GenericTableOps.addDataCol(
         "Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", 
         CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
      bad_def: GenericTableOps.addDataCol(
         "Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", 
         CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   };
}