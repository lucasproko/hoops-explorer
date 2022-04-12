import { PlayerEditModel, TeamEditorUtils } from "./TeamEditorUtils";

/** Note string keys are TeamEditorUtils.getKey, string val in leftTeam is player id (aka name) */
export type TeamEditorManualFixModel = {
   leftTeam?: Record<string, string>,
   superSeniorsReturning?: Set<string>,
   overrides?: Record<string, PlayerEditModel>,
   codeSwitch?: Record<string, string> //this year key to next year's key
};

const wName = (name: string, def: PlayerEditModel) => {
   return { [name]: { ...def, name: name }};
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
               ...wName("Keels, Trevor", {
                  pos: "CG",
                  profile: "5*"
               }),
               ...wName("Griffen, AJ", {
                  pos: "WG",
                  profile: "5*"
               }),
               ...wName("Banchero, Paolo", {
                  pos: "WF",
                  profile: "5*/Lotto"
               })
            }
         },
         "Gonzaga": {
            leftTeam: { "JaSuggs::": "Suggs, Jalen", "JoAyayi::": "Ayayi, Joel" },
            overrides: {
               ...wName("Holmgren, Chet", {
                  pos: "PF/C",
                  profile: "5*/Lotto"
               })
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
               ...wName("Washington Jr., TyTy", {
                  pos: "s-PG",
                  profile: "5*"
               })
            }
         },
         "Marquette": {
            leftTeam: { "DjCarton::": "Carton, D.J." },
         },
         "Maryland": {
            leftTeam: { "AaWiggins::": "Wiggins, Aaron" },
            overrides: {
               ...wName("Reese, Julian", {
                  pos: "PF/C",
                  profile: "4*"
               })
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
               ...wName("Branham, Malaki", {
                  pos: "WG",
                  profile: "4*/T40ish"
               }),
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
               ...wName("Smith, Nick", {
                  profile: "5*/Lotto",
                  pos: "CG"
               }),
               ...wName("Walsh, Jordan", {
                  profile: "5*",
                  pos: "WG"
               }),
               ...wName("Black, Anthony", {
                  profile: "5*",
                  pos: "PG"
               }),
               [TeamEditorUtils.benchWingKey]: {
                  profile: "4*"
               }
            }
         },
         "Colorado St.": {
            superSeniorsReturning: new Set([ "KeMoore::" ])          
         },
         "Duke": {
            leftTeam: { "TrKeels::": "Keels, Trevor", "PaBanchero::": "Banchero, Paolo", "MaWilliams::": "Williams, Mark", "AjGriffin::": "Griffin, AJ"  },
            overrides: { //https://247sports.com/college/duke/Season/2022-Basketball/Commits/
               ...wName("Lively II, Derek", {
                  profile: "5*/Lotto",
                  pos: "C"
               }),
               ...wName("Filipowski, Kyle", {
                  profile: "5*/Lotto",
                  pos: "C"
               }),
               ...wName("Whitehead, Dariq", {
                  profile: "5*/Lotto",
                  pos: "WG"
               }),
               ...wName("Mitchell, Mark", {
                  profile: "5*",
                  pos: "WF"
               }),
               ...wName("Schutt, Jaden", {
                  profile: "4*",
                  pos: "WG"
               }),
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
            overrides: { //https://247sports.com/college/kentucky/Season/2022-Basketball/Commits/
               ...wName("Livingston, Chris", {
                  profile: "5*/Lotto",
                  pos: "WG"
               }),
               ...wName("Wallace, Cason", {
                  profile: "5*/Lotto",
                  pos: "CG"
               }),
            }
         },
         "Marquette": {
            leftTeam: { "GrElliott::": "Elliott, Greg" }
         },
         "Ohio St.": {
            leftTeam: { "MaBranham::": "Branham, Malaki", "EjLiddell::": "Liddell, EJ" }
         },
         "San Diego St.": {
            superSeniorsReturning: new Set([ "AdSeiko::" ]),
         },
         "Syracuse": {
            leftTeam: { "CoSwider::": "Swider, Cole" }
         },
         "UCLA": {
            leftTeam: { "PeWatson::": "Watson, Peyton" }
         },
         "Wisconsin": {
            leftTeam: { "JoDavis::": "Davis, Johnny" }
         }
      }
   }

}