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
         "Duke": {
            leftTeam: { "JaJohnson::": "Johnson, Jalen", "MaHurt::": "Hurt, Matthew", "DjSteward::": "Steward, DJ", "BaJones::": "Jones, Bates" },
            overrides: {
               "Keels, Trevor": {
                  name: "Keels, Trevor",
                  pos: "CG",
                  profile: "5*"
               },
               "Griffen, AJ": {
                  name: "Griffen, AJ",
                  pos: "WG",
                  profile: "5*"
               },
               "Banchero, Paolo": {
                  name: "Banchero, Paolo",
                  pos: "WF",
                  profile: "5*/Lotto"
               }
            }
         },
         "Gonzaga": {
            leftTeam: { "JaSuggs::": "Suggs, Jalen", "JoAyayi::": "Ayayi, Joel" },
            overrides: {
               "Holmgren, Chet": {
                  name: "Holmgren, Chet",
                  pos: "PF/C",
                  profile: "5*/Lotto"
               }
            }
         },
         "Illinois": {
            leftTeam: { "AyDosunmu::": "Dosunmu, Ayo", "GiBezhanishv::": "Bezhanishvili, Giorgi" },
         },
         "Iowa": {
            leftTeam: { "JoWieskamp::": "Wieskamp, Joe" },
            superSeniorsReturning: new Set([ "JoBohannon::" ]),
         },
         "Kentucky": {
            leftTeam: { "BrBoston::": "Boston, Brandon", "OlSarr::": "Sarr, Olivier", "IsJackson::": "Jackson, Isaiah" },
            superSeniorsReturning: new Set([ "DaMintz::" ]),
            overrides: {
               "Washington Jr., TyTy": {
                  name: "Washington Jr., TyTy",
                  pos: "s-PG",
                  profile: "5*"
               }
            }
         },
         "Marquette": {
            leftTeam: { "DjCarton::": "Carton, D.J." },
         },
         "Maryland": {
            leftTeam: { "AaWiggins::": "Wiggins, Aaron" },
            overrides: {
               "Reese, Julian": {
                  name: "Reese, Julian",
                  pos: "PF/C",
                  profile: "4*"
               }
            }
         },
         "Michigan": {
            superSeniorsReturning: new Set([ "ElBrooks::" ]),
            leftTeam: { "FrWagner::": "Wagner, Franz" },
            overrides: {
               [TeamEditorUtils.benchGuardKey]: {
                  profile: "4*/T40ish"
               },
               [TeamEditorUtils.benchWingKey]: {
                  profile: "4*/T40ish"
               },
               [TeamEditorUtils.benchBigKey]: {
                  profile: "4*/T40ish"
               }
            }
         },
         "Michigan St.": {
            leftTeam: { "AaHenry::": "Henry, Aaron" },
         },
         "Ohio St.": {
            leftTeam: { "DuWashington::": "Washington, Duane" },
            superSeniorsReturning: new Set([ "KyYoung::" ]),
            overrides: {
               "Branham, Malaki": {
                  name: "Branham, Malaki",
                  pos: "WG",
                  profile: "4*/T40ish"
               },
            }
         },
         "San Diego St.": {
            superSeniorsReturning: new Set([ "JoTomaic::", "TrPulliam::" ]),
         },
         "Southern California": {
            superSeniorsReturning: new Set([ "ChGoodwin::" ]),
            leftTeam: { "EvMobley::": "Mobley, Evan" }
         },
         "Tennessee": {
            superSeniorsReturning: new Set([ "JoFulkerson::" ]),
            leftTeam: { "JaSpringer::": "Springer, Jaden", "KeJohnson::": "Johnson, Keon" }
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
                  profile: "5+4*s"
               },
               [TeamEditorUtils.benchWingKey]: {
                  mins: 35,
                  profile: "5+4*s"
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
                  profile: "5*"
               },
               [TeamEditorUtils.benchBigKey]: {
                  mins: 40,
                  profile: "5*"
               }
            },
         },
         "Gonzaga": {
            leftTeam: { "ChHolmgren::": "Holmgren, Chet" },
         },
         "Iowa": {
            leftTeam: { "KeMurray::": "Murray, Keegan" }
         },
         "Kentucky": {
            leftTeam: { "TyWashington::": "Washington, TyTy" },
            overrides: { 
               [TeamEditorUtils.benchGuardKey]: {
                  mins: 27,
                  profile: "5*/Lotto"
               },
               [TeamEditorUtils.benchWingKey]: {
                  mins: 27,
                  profile: "5*/Lotto"
               }
            }
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