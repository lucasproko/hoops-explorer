import { PlayerEditModel, TeamEditorUtils } from "./TeamEditorUtils";

/** Note string keys are TeamEditorUtils.getKey, string val in leftTeam is player id (aka name) */
export type TeamEditorManualFixModel = {
   leftTeam?: Record<string, string>,
   superSeniorsReturning?: Set<string>,
   overrides?: Record<string, PlayerEditModel>
};
export class TeamEditorManualFixes {

   static readonly fixes: Record<string, Record<string, TeamEditorManualFixModel>> = {

      "Men_2020/21": {
         "Maryland": {
            leftTeam: { "AaWiggins::": "Wiggins, Aaron" },
            overrides: {
               [TeamEditorUtils.benchBigKey]: {
                  mins: 15,
                  bench: "4*"
               }
            }
         }
      },
      "Men_2021/22": {
         "Arkansas": { //Lots of big-name recruits, see https://247sports.com/college/arkansas/Season/2022-Basketball/Commits/
            overrides: {
               [TeamEditorUtils.benchGuardKey]: {
                  mins: 35,
                  bench: "5+4*s"
               },
               [TeamEditorUtils.benchWingKey]: {
                  mins: 35,
                  bench: "5+4*s"
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
                  bench: "5*"
               },
               [TeamEditorUtils.benchBigKey]: {
                  mins: 40,
                  bench: "5*"
               }
            },
         },
         "Gonzaga": {
            leftTeam: { "ChHolmgren::": "Holmgren, Chet" },
            overrides: { //Gonzaga recruits higher than the normal WCC level
               [TeamEditorUtils.benchGuardKey]: {
                  bench: "4*"
               },
               [TeamEditorUtils.benchWingKey]: {
                  bench: "4*"
               },
               [TeamEditorUtils.benchBigKey]: {
                  bench: "4*"
               }
            }
         },
         "Iowa": {
            leftTeam: { "KeMurray::": "Murray, Keegan" }
         },
         "Marquette": {
            leftTeam: { "GrElliott::": "Elliott, Greg" }
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