import { PlayerEditModel, TeamEditorUtils } from "./TeamEditorUtils";

/** Note string keys are TeamEditorUtils.getKey, string val in leftTeam is player id (aka name) */
export type TeamEditorManualFixModel = {
   leftTeam?: Record<string, string>,
   superSeniorsReturning?: Set<string>,
   overrides?: Record<string, PlayerEditModel>
};
export class TeamEditorManualFixes {

   static readonly fixes: Record<string, Record<string, TeamEditorManualFixModel>> = {

      "Men_2021/22": {
         "Arkansas": { //Lots of big-name recruits, see https://247sports.com/college/arkansas/Season/2022-Basketball/Commits/
            overrides: {
               [TeamEditorUtils.benchGuardKey]: {
                  mins: 35,
                  global_off_adj: 1.5,
                  global_def_adj: -1.5,
               },
               [TeamEditorUtils.benchWingKey]: {
                  mins: 35,
                  global_off_adj: 1.5,
                  global_def_adj: -1.5
               }
            }
         },
         "Colorado St.": {
            superSeniorsReturning: new Set([ "KeMoore::" ])          
         },
         "Duke": {
            leftTeam: { "TrKeels::": "Keels, Trevor", "PaBanchero::": "Banchero, Paolo", "MaWilliams::": "Williams, Mark"  },
            overrides: { //https://247sports.com/college/duke/Season/2022-Basketball/Commits/
               [TeamEditorUtils.benchWingKey]: {
                  mins: 60,
                  global_off_adj: 2,
                  global_def_adj: -2
               },
               [TeamEditorUtils.benchBigKey]: {
                  mins: 40,
                  global_off_adj: 2,
                  global_def_adj: -2
               }
            },
         },
         "Gonzaga": {
            leftTeam: { "ChHolmgren::": "Holmgren, Chet" },
            overrides: { //Gonzaga recruits higher than the normal WCC level
               [TeamEditorUtils.benchGuardKey]: {
                  global_off_adj: 1,
                  global_def_adj: -1
               },
               [TeamEditorUtils.benchWingKey]: {
                  global_off_adj: 1,
                  global_def_adj: -1
               },
               [TeamEditorUtils.benchBigKey]: {
                  global_off_adj: 1,
                  global_def_adj: -1
               }
            }
         },
         "Iowa": {
            leftTeam: { "KeMurray::": "Murray, Keegan" }
         },
         "Marquette": {
            leftTeam: { "JuLewis::": "Lewis, Justin", "GrElliott::": "Elliott, Greg" }
         },
         "Ohio St.": {
            leftTeam: { "MaBranham::": "Branham, Malaki" }
         },
         "Wisconsin": {
            leftTeam: { "JoDavis::": "Davis, Johnny" }
         }
      }
   }

}