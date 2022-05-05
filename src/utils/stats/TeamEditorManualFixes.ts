import { PlayerEditModel, Profiles, TeamEditorUtils } from "./TeamEditorUtils";

import _ from "lodash";
import { freshmenMen2020_21 } from "../public-data/freshmenMen2020_21";
import { freshmenMen2021_22 } from "../public-data/freshmenMen2021_22";
import { freshmenMen2022_23 } from "../public-data/freshmenMen2022_23";

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

   static readonly getFreshmenForYear = _.memoize((genderYear: string) => {
      if (genderYear == "Men_2019/20") { //(offseason of 19/20, ie team for 20/21)
         return TeamEditorManualFixes.buildOverrides(freshmenMen2020_21);
      } else if (genderYear == "Men_2020/21") { //(offseason of 20/21, ie team for 21/22)
         return TeamEditorManualFixes.buildOverrides(freshmenMen2021_22);
      } else if (genderYear == "Men_2021/22") {  //(offseason of 21/22, ie team for 22/23)
         return TeamEditorManualFixes.buildOverrides(freshmenMen2022_23);
      } else {
         return {};
      }
   });

   private static readonly buildOverrides = (recruits: Record<string, any>)  => {
      return _.transform(recruits, (acc, override, team) => {
         const typedOverrides: Record<string, {pr: string, pos:string, c:string, h:string}> = override;
         const playerOverrides = _.transform(typedOverrides, ((acc2, over, player) => {
            acc2[`${over.c}`] = { //(index by code not key, code isn't needed)
               name: player,
               profile: over.pr as Profiles,
               pos: over.pos,
               height: over.h
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
      const mutableToRet = TeamEditorManualFixes.getFreshmenForYear(genderYear);  
      if (genderYear == "Men_2018/9") { //offseason of 18/19 ie team for 19/20
         const manualOverrides_Men_2019_20: Record<string, TeamEditorManualFixModel> = {
            "Maryland": {
               leftTeam: [ "BrFernando::" ],
            },
         }
         return TeamEditorManualFixes.combineOverrides(mutableToRet, manualOverrides_Men_2019_20);
      } else if (genderYear == "Men_2019/20") { //(offseason of 19/20, ie team for 20/21)
         const manualOverrides_Men_2020_21: Record<string, TeamEditorManualFixModel> = {
            "Texas Tech": {
               leftTeam: [ "DaMoretti::" ],
            },
         }
         return TeamEditorManualFixes.combineOverrides(mutableToRet, manualOverrides_Men_2020_21);
      } else if (genderYear == "Men_2020/21") { //(offseason of 20/21, ie team for 21/22)
         const manualOverrides_Men_2021_22: Record<string, TeamEditorManualFixModel> = {
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
            "Oklahoma": {
               leftTeam: [ "AuReaves::" ],
            },
            "San Diego St.": {
               superSeniorsReturning: new Set([ "JoTomaic::", "TrPulliam::" ]),
            },
            "Seton Hall": {
               superSeniorsReturning: new Set([ "MyCale::" ]),
               overrides: {
                  ...wName("Aiken, Bryce", { //(he's a super senior, but treat him like a T40 Fr, to give about the right RAPM)
                     pos: "s-PG",
                     profile: "4*/T40ish"
                  })
               },
            },
            "Southern California": {
               superSeniorsReturning: new Set([ "ChGoodwin::" ]),
            },
            "Tennessee": {
               superSeniorsReturning: new Set([ "JoFulkerson::" ]),
            },
            "Texas Tech": {
               superSeniorsReturning: new Set([ "MaSantos-sil::" ]),
            },
            "UConn": {
               superSeniorsReturning: new Set([ "IsWhaley::" ]),
            },
            "Wisconsin": {
               superSeniorsReturning: new Set([ "BrDavison::" ]),
               codeSwitch: { "JoDavis": "JnDavis" } //(sigh...)
            },
         }
         return TeamEditorManualFixes.combineOverrides(mutableToRet, manualOverrides_Men_2021_22);

      } else if (genderYear == "Men_2021/22") {  //(offseason of 21/22, ie team for 22/23)
         const manualOverrides_Men_2022_23:  Record<string, TeamEditorManualFixModel> = { 
            "Colorado St.": {
               superSeniorsReturning: new Set([ "KeMoore::" ])          
            },
            "Duke": {
               leftTeam: [ "TrKeels::", "PaBanchero::", "MaWilliams::", "AjGriffin::"  ],
            },
            "Florida": {
               superSeniorsReturning: new Set([ "CoCastleton::" ]),
            },
            "Gonzaga": {
               leftTeam: [ "ChHolmgren::" ],
            },
            "Illinois": {
               leftTeam: [ "KoCockburn::" ],
            },
            "Indiana": {
               superSeniorsReturning: new Set([ "RaThompson::" ]),
            },
            "Marquette": {
               overrides: {
                  ...wName("Wrightsil, Zach", {
                     pos: "S-PF",
                     profile: "4*"
                  }),
               }
            },
            "Michigan St.": {
               superSeniorsReturning: new Set([ "JoHauser::" ]),
            },
            "North Carolina": {
               superSeniorsReturning: new Set([ "LeBlack::" ]),
            },
            "Ohio St.": {
               superSeniorsReturning: new Set([ "SeTowns::" ]),
               leftTeam: [ "MaBranham::", "EjLiddell::" ],
            },
            "Penn St.": {
               superSeniorsReturning: new Set([ "JaPickett::" ]),
            },
            "San Diego St.": {
               superSeniorsReturning: new Set([ "AdSeiko::", "AgArop::" ]),
            },
            "Seton Hall": {
               leftTeam: [ "AlYetna::", "BrAiken::" ],
            },
            "Syracuse": {
               leftTeam: [ "CoSwider::" ],
            },
            "Texas": {
               superSeniorsReturning: new Set([ "MaCarr::", "TiAllen::" ]),
            },
            "Texas Tech": {
               superSeniorsReturning: new Set([ "KeObanor::" ]),
            },
            "Vanderbilt": {
               superSeniorsReturning: new Set([ "LiRobbins::", "QuMillora-br::" ]),
            },
            "Villanova": {
               superSeniorsReturning: new Set([ "BrSlater::" ]),
            },
            "Virginia": {
               superSeniorsReturning: new Set([ "KiClark::" ]),
            },
         };
         return TeamEditorManualFixes.combineOverrides(mutableToRet, manualOverrides_Men_2022_23);
      } else {
         return {} as Record<string, TeamEditorManualFixModel>;
      }
   });

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