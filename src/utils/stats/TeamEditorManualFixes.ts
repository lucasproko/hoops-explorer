import { PlayerEditModel, Profiles, TeamEditorUtils } from "./TeamEditorUtils";

import _ from "lodash";
import { freshmenMen2021_22 } from "../public-data/freshmenMen2021_22";

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

   private static readonly buildOverrides = (recruits: Record<string, any>)  => {
      return _.transform(recruits, (acc, override, team) => {
         const typedOverrides: Record<string, {pr: string, pos:string}> = override;
         const playerOverrides = _.transform(typedOverrides, ((acc2, over, player) => {
            acc2[player] = {
               name: player,
               profile: over.pr as Profiles,
               pos: over.pos
            }
         }), {} as Record<string, PlayerEditModel>);
         acc[team] = {
            overrides: playerOverrides
         };

      }, {} as Record<string, TeamEditorManualFixModel>);
   };
   private static combineOverrides = 
      (mutableRecruits: Record<string, TeamEditorManualFixModel>, manual: Record<string, TeamEditorManualFixModel>) => 
   {
      return _.transform(manual, (acc, override, team) => {
         if (!acc[team]) {
            acc[team] = {};
         }
         _.merge(acc[team], override);
      }, mutableRecruits);
   };

   static readonly fixes: (genderYear: string) => Record<string, TeamEditorManualFixModel> = _.memoize((genderYear: string) => {
      if (genderYear == "Men_2020/21") {
         const mutableToRet = TeamEditorManualFixes.buildOverrides(freshmenMen2021_22);
         const manualOverrides_Men_2021_21: Record<string, TeamEditorManualFixModel> = {
            "Iowa": {
               superSeniorsReturning: new Set([ "JoBohannon::" ]),
            },
            "Kentucky": {
               superSeniorsReturning: new Set([ "DaMintz::" ]),
            },   
            "Michigan": {
               superSeniorsReturning: new Set([ "ElBrooks::" ]),
            },
            "Ohio St.": {
               superSeniorsReturning: new Set([ "KyYoung::" ]),
            },
            "San Diego St.": {
               superSeniorsReturning: new Set([ "JoTomaic::", "TrPulliam::" ]),
            },
            "Southern California": {
               superSeniorsReturning: new Set([ "ChGoodwin::" ]),
            },
            "Tennessee": {
               superSeniorsReturning: new Set([ "JoFulkerson::" ]),
            },
            "Wisconsin": {
               superSeniorsReturning: new Set([ "BrDavison::" ]),
               codeSwitch: { "JoDavis": "JnDavis" } //(sigh...)
            },
         }
         return TeamEditorManualFixes.combineOverrides(mutableToRet, manualOverrides_Men_2021_21);

      } else if (genderYear == "Men_2021/22") { //https://247sports.com/Season/2022-Basketball/CompositeTeamRankings/
         return { 
            "Alabama": {
               overrides: {
                  ...wName("Miller, Brandon", {
                     profile: "5*/Lotto",
                     pos: "WF"
                  }),
                  ...wName("Bradley, Jaden", {
                     profile: "5*",
                     pos: "s-PG"
                  }),
                  ...wName("Griffen, Rylan", {
                     profile: "4*/T40ish",
                     pos: "WG"
                  }),
                  ...wName("Clowney, Noah", {
                     profile: "4*",
                     pos: "S-PF"
                  }),
               }
            },
            "Arizona": {
            },
            "Arkansas": { 
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
            "Auburn": {
               overrides: {
                  ...wName("Traore, Yohan", {
                     profile: "5*",
                     pos: "C"
                  }),
                  ...wName("Westry, Chance", {
                     profile: "4*/T40ish",
                     pos: "WG"
                  }),
               }
            },
            "Baylor": {
               overrides: {
                  ...wName("Keyonte, George", {
                     profile: "5*",
                     pos: "WG"
                  }),
               }
            },
            "Colorado St.": {
               superSeniorsReturning: new Set([ "KeMoore::" ])          
            },
            "Duke": {
               leftTeam: [ "TrKeels::", "PaBanchero::", "MaWilliams::", "AjGriffin::"  ],
               overrides: {
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
            "Florida": {
               superSeniorsReturning: new Set([ "CoCastleton::" ]),
            },
            "Gonzaga": {
               leftTeam: [ "ChHolmgren::" ],
            },
            "Houston": {
               overrides: {
                  ...wName("Walker, Jarace", {
                     profile: "5*/Lotto",
                     pos: "S-PF"
                  }),
               }
            },
            "Iowa": {
            },
            "Illinois": {
               leftTeam: [ "KoCockburn::" ],
               overrides: {
                  ...wName("Clark, Skyy", {
                     profile: "5*",
                     pos: "s-PG"
                  }),
                  ...TeamEditorManualFixes.alwaysTopBench()
               }
            },
            "Indiana": {
               superSeniorsReturning: new Set([ "RaThompson::" ]),
               overrides: {
                  ...wName("Hood-Schifino, Jalen", {
                     profile: "5*",
                     pos: "CG"
                  }),
                  ...wName("Reneau, Malik", {
                     profile: "5*",
                     pos: "S-PF"
                  }),
               }
            },
            "Kansas": {
               overrides: {
                  ...wName("Gradley, Dick", {
                     profile: "5*",
                     pos: "WF"
                  }),
                  ...wName("Rice, MJ", {
                     profile: "5*",
                     pos: "WG"
                  }),
                  ...wName("Udeh, Ernest", {
                     profile: "5*",
                     pos: "C"
                  }),
                  ...wName("Ejifor, Zuby", {
                     profile: "4*",
                     pos: "S-PF"
                  }),
                  ...TeamEditorManualFixes.alwaysTopBench()
               }
            },
            "Kentucky": {
               overrides: { 
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
            "LSU": {
            },
            "Marquette": {
               overrides: {
                  ...wName("Wrightsil, Zach", {
                     pos: "S-PF",
                     profile: "4*"
                  }),
               }
            },
            "Michigan": {
               overrides: {
                  ...wName("Reed, Tarris", {
                     profile: "4*/T40ish",
                     pos: "C"
                  }),
                  ...wName("Howard, Jett", {
                     profile: "4*/T40ish",
                     pos: "WF"
                  }),
                  ...wName("McDaniel, Dug", {
                     profile: "4*",
                     pos: "PG"
                  }),
               }
            },
            "Michigan St.": {
               superSeniorsReturning: new Set([ "JoHauser::" ]),
            },
            "Nebraska": {
            },
            "North Carolina": {
               superSeniorsReturning: new Set([ "LeBlack::" ]),
               overrides: {
                  ...TeamEditorManualFixes.alwaysTopBench(),
                  ...wName("Trimble, Seth", {
                     profile: "4*/T40ish",
                     pos: "s-PG"
                  }),
                  ...wName("Washington, Jalen", {
                     profile: "4*/T40ish",
                     pos: "C"
                  }),
               }
            },
            "Notre Dame": {
               overrides: {
                  ...wName("Starling, JJ", {
                     profile: "4*/T40ish",
                     pos: "CG"
                  }),
               }
            },
            "Ohio St.": {
               leftTeam: [ "MaBranham::", "EjLiddell::" ],
               overrides: {
                  ...TeamEditorManualFixes.alwaysTopBench(),
                  ...wName("Okpara, Felix", {
                     profile: "4*/T40ish",
                     pos: "C"
                  }),
                  ...wName("Gayle, Roddy", {
                     profile: "4*",
                     pos: "WG"
                  }),
                  ...wName("Thornton, Bruce", {
                     profile: "4*/T40ish",
                     pos: "s-PG"
                  }),
                  ...wName("Sensabaugh, Brice", {
                     profile: "4*",
                     pos: "WF"
                  }),
                  
               }
            },
            "Oregon": {
               overrides: {
                  ...wName("Ware, Kel'el", {
                     profile: "5*/Lotto",
                     pos: "C"
                  }),
                  ...wName("Johnson, Dior", {
                     profile: "5*",
                     pos: "s-PG"
                  }),
               }
            },
            "Penn St.": {
               superSeniorsReturning: new Set([ "JaPickett::" ]),
            },
            "Purdue": {
            },
            "Rutgers": {
            },
            "San Diego St.": {
               superSeniorsReturning: new Set([ "AdSeiko::" ]),
            },
            "Seton Hall": {
               leftTeam: [ "AlYetna::" ],
            },
            "Southern California": {
               overrides: {
                  ...wName("Iwuchukwu, Vince", {
                     profile: "5*",
                     pos: "C"
                  }),
                  ...wName("Wright, Kijani", {
                     profile: "4*/T40ish",
                     pos: "PF/C"
                  }),
                  ...wName("White, Tre", {
                     profile: "4*",
                     pos: "WF"
                  }),
               }
            },
            "Stanford": {
            },
            "St. John's (NY)": {
            },
            "Syracuse": {
               leftTeam: [ "CoSwider::" ],
               overrides: {
                  ...wName("Mintz, Judah", {
                     profile: "4*/T40ish",
                     pos: "s-PG"
                  }),
               },
            },
            "Texas": {
               superSeniorsReturning: new Set([ "TiAllen::" ]),
               overrides: {
                  ...wName("Mitchell, Dillon", {
                     profile: "5*",
                     pos: "WF"
                  }),
                  ...wName("Morris, Arterio", {
                     profile: "5*",
                     pos: "s-PG"
                  }),
                  ...TeamEditorManualFixes.alwaysTopBench(),
               },      
            },
            "Tennessee": {
            },
            "UCLA": {
               overrides: {
                  ...wName("Bailey, Amari", {
                     profile: "5*/Lotto",
                     pos: "CG"
                  }),
                  ...wName("Bona, Adem", {
                     profile: "5*",
                     pos: "C"
                  }),
                  ...TeamEditorManualFixes.alwaysTopBench(),
               },      
            },
            "Villanova": {
               overrides: {
                  ...wName("Whitmore, Cam", {
                     profile: "5*",
                     pos: "WF"
                  }),
                  ...wName("Armstrong, Mark", {
                     profile: "4*/T40ish",
                     pos: "CG"
                  }),
               },      

            },
            "Virginia": {
               superSeniorsReturning: new Set([ "KiClark::" ]),
               overrides: {
                  ...TeamEditorManualFixes.alwaysTopBench(),
               }
            },
            "Wisconsin": {
            },         
         } as Record<string, TeamEditorManualFixModel>;
      } else {
         return {} as Record<string, TeamEditorManualFixModel>;
      }
   });

   static readonly oldFixes: () => Record<string, Record<string, TeamEditorManualFixModel>> = _.memoize(() => { return {

      // Rutgers, Purdue - no changes needed
      "Men_2020/21": {
         "Alabama": {
            overrides: {
               ...wName("Davison, JD", {
                  pos: "s-PG",
                  profile: "5*"
               }),
               ...wName("Bediako, Charles", {
                  pos: "C",
                  profile: "4*/T40ish"
               }),
               ...TeamEditorManualFixes.alwaysTopBench()
            }
         },
         "Baylor": {
            overrides: {
               ...wName("Brown, Kendrall", {
                  profile: "5*",
                  pos: "WF"
               }),
               ...wName("Love, Langson", {
                  profile: "4*/T40ish",
                  pos: "WG"
               }),
            }
         },
         "Creighton": {
            overrides: {
               ...TeamEditorManualFixes.alwaysTopBench()
            }
         },
         "Duke": {
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
         "Florida St.": {
            overrides: {
               ...wName("Cleveland, Matthew", {
                  pos: "WF",
                  profile: "5*"
               }),
               ...wName("Warley, Jalen", {
                  pos: "CG",
                  profile: "4*/T40ish"
               }),
            }
         },
         "Georgetown": {
            overrides: {
               ...wName("Mohammed, Aminu", {
                  pos: "WG",
                  profile: "5*"
               }),
            }
         },
         "Gonzaga": {
            overrides: {
               ...wName("Holmgren, Chet", {
                  pos: "PF/C",
                  profile: "5*/Lotto"
               }),
               ...wName("Sallis, Hunter", {
                  pos: "CG",
                  profile: "5*"
               }),
               ...wName("Hickman, Nolan", {
                  pos: "s-PG",
                  profile: "4*/T40ish"
               })
             }
         },
         "Iowa": {
            superSeniorsReturning: new Set([ "JoBohannon::" ]),
         },
         "Kansas": {
            ...TeamEditorManualFixes.alwaysTopBench()
         },
         "Kentucky": {
            superSeniorsReturning: new Set([ "DaMintz::" ]),
            overrides: {
               ...wName("Washington Jr., TyTy", {
                  pos: "s-PG",
                  profile: "5*"
               }),
               ...wName("Shaedon, Sharpe", {
                  pos: "WG",
                  profile: "5*/Lotto"
               }),
               ...wName("Collins, Daimion", {
                  pos: "PF/C",
                  profile: "5*"
               }),
               ...wName("Hopkins, Bryce", {
                  pos: "WF",
                  profile: "4*/T40ish"
               })
            }
         },
         "LSU": {
            overrides: {
               ...wName("Reid, Efton", {
                  pos: "C",
                  profile: "5*"
               }),
               ...wName("Williams, Justice", {
                  pos: "WG",
                  profile: "4*"
               }),
            }
         },
         "Maryland": {
            overrides: {
               ...wName("Reese, Julian", {
                  pos: "PF/C",
                  profile: "4*"
               })
            }
         },
         "Memphis": {
            overrides: {
               ...wName("Bates, Emoni", {
                  pos: "WF",
                  profile: "5*/Lotto"
               }),
               ...wName("Duran, Jalen", {
                  pos: "C",
                  profile: "5*/Lotto"
               }),
               ...wName("Minott, Josh", {
                  pos: "WF",
                  profile: "4*/T40ish"
               }),
            }
         },
         "Michigan": {
            superSeniorsReturning: new Set([ "ElBrooks::" ]),
            overrides: {
               ...TeamEditorManualFixes.genericLoadedBench()
            }
         },
         "Michigan St.": {
            overrides: {
               ...wName("Christie, Max", {
                  pos: "WG",
                  profile: "5*"
               }),
               ...wName("Akins, Jaden", {
                  pos: "s-PG",
                  profile: "4*/T40ish"
               }),
            }
         },
         "Ohio St.": {
            superSeniorsReturning: new Set([ "KyYoung::" ]),
            overrides: {
               ...wName("Branham, Malaki", {
                  pos: "WG",
                  profile: "4*/T40ish"
               }),
               ...TeamEditorManualFixes.alwaysTopBench()
            }
         },
         "San Diego St.": {
            superSeniorsReturning: new Set([ "JoTomaic::", "TrPulliam::" ]),
         },
         "Southern California": {
            superSeniorsReturning: new Set([ "ChGoodwin::" ]),
         },
         "Stanford": {
            overrides: {
               ...wName("Ingram, Harrison", {
                  pos: "WF",
                  profile: "5*"
               }),
            }
         },
         "Tennessee": {
            superSeniorsReturning: new Set([ "JoFulkerson::" ]),
            overrides: {
               ...wName("Kennedy, Chandler", {
                  pos: "WG",
                  profile: "5*/Lotto"
               }),
               ...wName("Huntley-Hatfield, Brandon", {
                  pos: "S-PF",
                  profile: "5*"
               }),
               ...wName("Aidoo, Jonas", {
                  pos: "C",
                  profile: "4*/T40ish"
               }),
               ...TeamEditorManualFixes.alwaysTopBench()
            }
         },
         "UConn": {
            overrides: {
               ...TeamEditorManualFixes.genericLoadedBench()
            }
         },
         "Wisconsin": {
            superSeniorsReturning: new Set([ "BrDavison::" ]),
            codeSwitch: { "JoDavis": "JnDavis" } //(sigh...)
         },
      },
      "Men_2021/22": { //https://247sports.com/Season/2022-Basketball/CompositeTeamRankings/
         "Alabama": {
            overrides: {
               ...wName("Miller, Brandon", {
                  profile: "5*/Lotto",
                  pos: "WF"
               }),
               ...wName("Bradley, Jaden", {
                  profile: "5*",
                  pos: "s-PG"
               }),
               ...wName("Griffen, Rylan", {
                  profile: "4*/T40ish",
                  pos: "WG"
               }),
               ...wName("Clowney, Noah", {
                  profile: "4*",
                  pos: "S-PF"
               }),
            }
         },
         "Arizona": {
         },
         "Arkansas": { 
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
         "Auburn": {
            overrides: {
               ...wName("Traore, Yohan", {
                  profile: "5*",
                  pos: "C"
               }),
               ...wName("Westry, Chance", {
                  profile: "4*/T40ish",
                  pos: "WG"
               }),
            }
         },
         "Baylor": {
            overrides: {
               ...wName("Keyonte, George", {
                  profile: "5*",
                  pos: "WG"
               }),
            }
         },
         "Colorado St.": {
            superSeniorsReturning: new Set([ "KeMoore::" ])          
         },
         "Duke": {
            leftTeam: [ "TrKeels::", "PaBanchero::", "MaWilliams::", "AjGriffin::"  ],
            overrides: {
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
         "Florida": {
            superSeniorsReturning: new Set([ "CoCastleton::" ]),
         },
         "Gonzaga": {
            leftTeam: [ "ChHolmgren::" ],
         },
         "Houston": {
            overrides: {
               ...wName("Walker, Jarace", {
                  profile: "5*/Lotto",
                  pos: "S-PF"
               }),
            }
         },
         "Iowa": {
         },
         "Illinois": {
            leftTeam: [ "KoCockburn::" ],
            overrides: {
               ...wName("Clark, Skyy", {
                  profile: "5*",
                  pos: "s-PG"
               }),
               ...TeamEditorManualFixes.alwaysTopBench()
            }
         },
         "Indiana": {
            superSeniorsReturning: new Set([ "RaThompson::" ]),
            overrides: {
               ...wName("Hood-Schifino, Jalen", {
                  profile: "5*",
                  pos: "CG"
               }),
               ...wName("Reneau, Malik", {
                  profile: "5*",
                  pos: "S-PF"
               }),
            }
         },
         "Kansas": {
            overrides: {
               ...wName("Gradley, Dick", {
                  profile: "5*",
                  pos: "WF"
               }),
               ...wName("Rice, MJ", {
                  profile: "5*",
                  pos: "WG"
               }),
               ...wName("Udeh, Ernest", {
                  profile: "5*",
                  pos: "C"
               }),
               ...wName("Ejifor, Zuby", {
                  profile: "4*",
                  pos: "S-PF"
               }),
               ...TeamEditorManualFixes.alwaysTopBench()
            }
         },
         "Kentucky": {
            overrides: { 
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
         "LSU": {
         },
         "Marquette": {
            overrides: {
               ...wName("Wrightsil, Zach", {
                  pos: "S-PF",
                  profile: "4*"
               }),
            }
         },
         "Michigan": {
            overrides: {
               ...wName("Reed, Tarris", {
                  profile: "4*/T40ish",
                  pos: "C"
               }),
               ...wName("Howard, Jett", {
                  profile: "4*/T40ish",
                  pos: "WF"
               }),
               ...wName("McDaniel, Dug", {
                  profile: "4*",
                  pos: "PG"
               }),
            }
         },
         "Michigan St.": {
            superSeniorsReturning: new Set([ "JoHauser::" ]),
         },
         "Nebraska": {
         },
         "North Carolina": {
            superSeniorsReturning: new Set([ "LeBlack::" ]),
            overrides: {
               ...TeamEditorManualFixes.alwaysTopBench(),
               ...wName("Trimble, Seth", {
                  profile: "4*/T40ish",
                  pos: "s-PG"
               }),
               ...wName("Washington, Jalen", {
                  profile: "4*/T40ish",
                  pos: "C"
               }),
            }
         },
         "Notre Dame": {
            overrides: {
               ...wName("Starling, JJ", {
                  profile: "4*/T40ish",
                  pos: "CG"
               }),
            }
         },
         "Ohio St.": {
            leftTeam: [ "MaBranham::", "EjLiddell::" ],
            overrides: {
               ...TeamEditorManualFixes.alwaysTopBench(),
               ...wName("Okpara, Felix", {
                  profile: "4*/T40ish",
                  pos: "C"
               }),
               ...wName("Gayle, Roddy", {
                  profile: "4*",
                  pos: "WG"
               }),
               ...wName("Thornton, Bruce", {
                  profile: "4*/T40ish",
                  pos: "s-PG"
               }),
               ...wName("Sensabaugh, Brice", {
                  profile: "4*",
                  pos: "WF"
               }),
               
            }
         },
         "Oregon": {
            overrides: {
               ...wName("Ware, Kel'el", {
                  profile: "5*/Lotto",
                  pos: "C"
               }),
               ...wName("Johnson, Dior", {
                  profile: "5*",
                  pos: "s-PG"
               }),
            }
         },
         "Penn St.": {
            superSeniorsReturning: new Set([ "JaPickett::" ]),
         },
         "Purdue": {
         },
         "Rutgers": {
         },
         "San Diego St.": {
            superSeniorsReturning: new Set([ "AdSeiko::" ]),
         },
         "Seton Hall": {
            leftTeam: [ "AlYetna::" ],
         },
         "Southern California": {
            overrides: {
               ...wName("Iwuchukwu, Vince", {
                  profile: "5*",
                  pos: "C"
               }),
               ...wName("Wright, Kijani", {
                  profile: "4*/T40ish",
                  pos: "PF/C"
               }),
               ...wName("White, Tre", {
                  profile: "4*",
                  pos: "WF"
               }),
            }
         },
         "Stanford": {
         },
         "St. John's (NY)": {
         },
         "Syracuse": {
            leftTeam: [ "CoSwider::" ],
            overrides: {
               ...wName("Mintz, Judah", {
                  profile: "4*/T40ish",
                  pos: "s-PG"
               }),
            },
         },
         "Texas": {
            superSeniorsReturning: new Set([ "TiAllen::" ]),
            overrides: {
               ...wName("Mitchell, Dillon", {
                  profile: "5*",
                  pos: "WF"
               }),
               ...wName("Morris, Arterio", {
                  profile: "5*",
                  pos: "s-PG"
               }),
               ...TeamEditorManualFixes.alwaysTopBench(),
            },      
         },
         "Tennessee": {
         },
         "UCLA": {
            overrides: {
               ...wName("Bailey, Amari", {
                  profile: "5*/Lotto",
                  pos: "CG"
               }),
               ...wName("Bona, Adem", {
                  profile: "5*",
                  pos: "C"
               }),
               ...TeamEditorManualFixes.alwaysTopBench(),
            },      
         },
         "Villanova": {
            overrides: {
               ...wName("Whitmore, Cam", {
                  profile: "5*",
                  pos: "WF"
               }),
               ...wName("Armstrong, Mark", {
                  profile: "4*/T40ish",
                  pos: "CG"
               }),
            },      

         },
         "Virginia": {
            superSeniorsReturning: new Set([ "KiClark::" ]),
            overrides: {
               ...TeamEditorManualFixes.alwaysTopBench(),
            }
         },
         "Wisconsin": {
         },
      }
   }; });

   /** The top few schools always have premium benches */
   static readonly alwaysTopBench: () => Record<string, PlayerEditModel> = () => { return {
      [TeamEditorUtils.benchGuardKey]: {
         profile: "4*"
      },
      [TeamEditorUtils.benchWingKey]: {
         profile: "4*"
      },
      [TeamEditorUtils.benchBigKey]: {
         profile: "4*"
      }
   }; };

   /** The top few schools always have premium benches */
   static readonly genericLoadedBench: () => Record<string, PlayerEditModel> = () => { return {
      [TeamEditorUtils.benchGuardKey]: {
         profile: "4*/T40ish"
      },
      [TeamEditorUtils.benchWingKey]: {
         profile: "4*/T40ish"
      },
      [TeamEditorUtils.benchBigKey]: {
         profile: "4*/T40ish"
      }
   }; };
   
}