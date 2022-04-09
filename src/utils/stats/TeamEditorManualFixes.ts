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
                  mins: 30,
                  global_off_adj: 0.5,
                  global_def_adj: -0.5,
               },
               [TeamEditorUtils.benchWingKey]: {
                  mins: 30,
                  global_off_adj: 1.0,
                  global_def_adj: -1.0
               }
            }
         },
         "Colorado St.": {
            superSeniorsReturning: new Set([ "KeMoore::" ])          
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