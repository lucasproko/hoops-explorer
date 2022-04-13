import { PlayerEditModel, TeamEditorUtils } from "./TeamEditorUtils";

import _ from "lodash";

/** Note string keys are TeamEditorUtils.getKey, string val in leftTeam is player id (aka name) */
export type TeamEditorManualFixModel = {
   leftTeam?: Array<string>,
   superSeniorsReturning?: Set<string>,
   overrides?: Record<string, PlayerEditModel>,
   codeSwitch?: Record<string, string> //this year key to next year's key
};

const wName = (name: string, def: PlayerEditModel) => {
   return { [name]: { ...def, name: name }};
}; 

export class TeamEditorManualFixes {

   static readonly fixes: () => Record<string, Record<string, TeamEditorManualFixModel>> = _.memoize(() => { return {

      // Rutgers, Purdue - no changes needed
      "Men_2020/21": {
         "Alabama": {
            leftTeam: [ "JoPrimo::" ],
         },
         "Arkansas": {
            leftTeam: [ "MoMoody::" ],
         },
         "Duke": {
            leftTeam: [ "JaJohnson::", "MaHurt::", "DjSteward::", "BaJones::" ],
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
            leftTeam: [ "JaSuggs::", "JoAyayi::" ],
            overrides: {
               ...wName("Holmgren, Chet", {
                  pos: "PF/C",
                  profile: "5*/Lotto"
               })
            }
         },
         "Illinois": {
            leftTeam: [ "AyDosunmu::", "GiBezhanishv::" ],
         },
         "Iowa": {
            leftTeam: [ "JoWieskamp::" ],
            superSeniorsReturning: new Set([ "JoBohannon::" ]),
         },
         "Kentucky": {
            leftTeam: [ "BrBoston::", "OlSarr::", "IsJackson::" ],
            superSeniorsReturning: new Set([ "DaMintz::" ]),
            overrides: {
               ...wName("Washington Jr., TyTy", {
                  pos: "s-PG",
                  profile: "5*"
               })
            }
         },
         "Marquette": {
            leftTeam: [ "DjCarton::" ],
         },
         "Maryland": {
            leftTeam: [ "AaWiggins::" ],
            overrides: {
               ...wName("Reese, Julian", {
                  pos: "PF/C",
                  profile: "4*"
               })
            }
         },
         "Michigan": {
            superSeniorsReturning: new Set([ "ElBrooks::" ]),
            leftTeam: [ "FrWagner::" ],
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
            leftTeam: [ "AaHenry::" ],
         },
         "Ohio St.": {
            leftTeam: [ "DuWashington::" ],
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
            leftTeam: [ "EvMobley::" ]
         },
         "Tennessee": {
            superSeniorsReturning: new Set([ "JoFulkerson::" ]),
            leftTeam: [ "JaSpringer::", "KeJohnson::" ]
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
            leftTeam: [ "TrKeels::", "PaBanchero::", "MaWilliams::", "AjGriffin::"  ],
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
            leftTeam: [ "ChHolmgren::" ],
         },
         "Iowa": {
            leftTeam: [ "KeMurray::" ]
         },
         "Kentucky": {
            leftTeam: [ "TyWashington::" ],
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
            leftTeam: [ "GrElliott::" ]
         },
         "Ohio St.": {
            leftTeam: [ "MaBranham::", "EjLiddell::" ]
         },
         "San Diego St.": {
            superSeniorsReturning: new Set([ "AdSeiko::" ]),
         },
         "Syracuse": {
            leftTeam: [ "CoSwider::" ]
         },
         "UCLA": {
            leftTeam: [ "PeWatson::" ]
         },
         "Wisconsin": {
            leftTeam: [ "JoDavis::" ]
         }
      }
   }; });

}