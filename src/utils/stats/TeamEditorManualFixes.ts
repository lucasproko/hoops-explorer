import { PlayerEditModel, TeamEditorUtils } from "./TeamEditorUtils";

/** Note string keys are TeamEditorUtils.getKey, string val in leftTeam is player id (aka name) */
export type TeamEditorManualFixModel = {
   leftTeam?: Record<string, string>,
   superSeniorsReturning?: Set<string>,
   overrides?: Record<string, PlayerEditModel>,
   codeSwitch?: Record<string, string> //this year key to next year's key
};
export class TeamEditorManualFixes {

   static readonly fixes: Record<string, Record<string, TeamEditorManualFixModel>> = {

      // Rutgers, Purdue - no changes needed
      "Men_2020/21": {
         "Alabama": {
            leftTeam: { "JoPrimo::": "Primo, Josh" },
         },
         "Arkansas": {
            leftTeam: { "MoMoody::": "Moody, Moses" },
         },
         "Illinois": {
            leftTeam: { "AyDosunmu::": "Dosunmu, Ayo", "GiBezhanishv::": "Bezhanishvili, Giorgi" },
         },
         "Iowa": {
            leftTeam: { "JoWieskamp::": "Wieskamp, Joe" },
            superSeniorsReturning: new Set([ "JoBohannon::" ]),
         },
         "Maryland": {
            leftTeam: { "AaWiggins::": "Wiggins, Aaron" },
            overrides: {
               [TeamEditorUtils.benchBigKey]: {
                  mins: 15,
                  bench: "4*"
               }
            }
         },
         "Michigan": {
            superSeniorsReturning: new Set([ "ElBrooks::" ]),
            leftTeam: { "FrWagner::": "Wagner, Franz" },
            overrides: {
               [TeamEditorUtils.benchGuardKey]: {
                  bench: "4*/T40ish"
               },
               [TeamEditorUtils.benchWingKey]: {
                  bench: "4*/T40ish"
               },
               [TeamEditorUtils.benchBigKey]: {
                  bench: "4*/T40ish"
               }
            }
         },
         "Michigan St.": {
            leftTeam: { "AaHenry::": "Henry, Aaron" },
         },
         "Ohio St.": {
            leftTeam: { "DuWashington::": "Washington, Duane" },
            overrides: {
               [TeamEditorUtils.benchGuardKey]: {
                  bench: "4*/T40ish"
               },
            }
         },
         "Wisconsin": {
            superSeniorsReturning: new Set([ "BrDavison::" ]),
            codeSwitch: { "JoDavis": "JnDavis" } //(sigh...)
         },
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
         "San Diego St.": {
            superSeniorsReturning: new Set([ "AdSeiko::" ]),
         },
         "Wisconsin": {
            leftTeam: { "JoDavis::": "Davis, Johnny" }
         }
      }
   }

}