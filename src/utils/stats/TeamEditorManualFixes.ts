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
   codeSwitch?: Record<string, string>, //this year code to next year's code, note not currently supported for transfers
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

   //TODO: move this into TeamEditorUtils
   private static readonly buildOverrides = (recruits: Record<string, any>)  => {
      return _.transform(recruits, (acc, override, team) => {
         const typedOverrides: Record<string, {pr: string, pos:string, c:string, h:string, r?:number}> = override;
         const playerOverrides = _.transform(typedOverrides, ((acc2, over, player) => {
            const adjRtg = (over.r || 0)*0.01;
            const fourStarSuperFactor = ((over.pr == "4*") && (adjRtg >= 0.8)) ? 
               (0.25 + ((adjRtg - 0.8)*5)*1.25) : 0.25;
                //(0.5 for off/def, and * 0.5 so the total -1 to 1 range is RAPM of 1)
                //(to make 4* lineup with T40 you start to get a bigger bonus at 75+, need o+d to get from 1.5 to 3 at adjRtg of 1.0
            const fiveStarFactor = 0.5; //(5* gets bigger range of penalties because values assigned are pretty higher)
            const factor = (over.pr >= "5*") ? fiveStarFactor : fourStarSuperFactor; 

            const factorTimeRating = parseFloat((factor*adjRtg).toFixed(2));

            acc2[`${over.c}`] = { //(index by code not key)
               name: player,
               profile: over.pr as Profiles,
               pos: over.pos,
               height: over.h,
               global_off_adj: adjRtg ? factorTimeRating : undefined, //apportion out bonus/penalty if there is one
               global_def_adj: adjRtg ? -factorTimeRating : undefined,
               fromFrList: true
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
               leftTeam: [ "BrFernando::", "KeHuerter::", "JuJackson::" ], //(Fernando/Huerter/Jackson appear in Extra, before I did NBA departures)
            },
         }
         return TeamEditorManualFixes.combineOverrides(mutableToRet, manualOverrides_Men_2019_20);
      } else if (genderYear == "Men_2019/20") { //(offseason of 19/20, ie team for 20/21)
         const manualOverrides_Men_2020_21: Record<string, TeamEditorManualFixModel> = {
            "Maryland": {
               leftTeam: [ "BrFernando::" ]
            },
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
            "Illinois": {
               superSeniorsReturning: new Set([ "DaWilliams::" ]),
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
            "VCU": {
               superSeniorsReturning: new Set([ "LeStockard::" ]),
            },
            "Wisconsin": {
               superSeniorsReturning: new Set([ "BrDavison::" ]),
               codeSwitch: { "JnDavis": "JoDavis" } //(sigh... see cbb-exlorer:DataQualityIssues)
            },
         }
         return TeamEditorManualFixes.combineOverrides(mutableToRet, manualOverrides_Men_2021_22);

      } else if (genderYear == "Men_2021/22") {  //(offseason of 21/22, ie team for 22/23)
         const manualOverrides_Men_2022_23:  Record<string, TeamEditorManualFixModel> = { 
            "Alabama": {
               superSeniorsReturning: new Set([ "NoGurley::" ])          
            },
            "Auburn": {
               superSeniorsReturning: new Set([ "ZeJasper::" ])          
            },
            "Baylor": {
               superSeniorsReturning: new Set([ "FlThamba::" ])          
            },
            "Boise St.": {
               superSeniorsReturning: new Set([ "MaShaver::" ])          
            },
            "Boston College": {
               superSeniorsReturning: new Set([ "MaAshton-lan::" ])          
            },
            "BYU": {
               superSeniorsReturning: new Set([ "GiGeorge::" ])          
            },
            "Colorado St.": {
               superSeniorsReturning: new Set([ "KeMoore::" ])          
            },
            "Clemson": {
               superSeniorsReturning: new Set([ "HuTyson::" ])          
            },
            "Cleveland St.": {
               superSeniorsReturning: new Set([ "DeJohnson::" ])          
            },
            "DePaul": {
               superSeniorsReturning: new Set([ "YoAnei::" ]),
            },
            "Drake": {
               superSeniorsReturning: new Set([ "DjWilkins::", "RoPenn::", "GaSturtz::", "DaBrodie::" ])
            },
            "Duke": {
               leftTeam: [ "TrKeels::", "PaBanchero::", "MaWilliams::", "AjGriffin::"  ],
            },
            "Florida": {
               superSeniorsReturning: new Set([ "CoCastleton::", "MyJones::" ]),
            },
            "Fordham": {
               superSeniorsReturning: new Set([ "DaQuisenberr::" ])                         
            },
            "Houston": {
               superSeniorsReturning: new Set([ "ReChaney::" ])          
            },
            "Indiana": {
               superSeniorsReturning: new Set([ "RaThompson::", "MiKopp::", "XaJohnson::" ]),
            },
            "Iowa": {
               superSeniorsReturning: new Set([ "FiRebraca::", "CoMccaffery::" ]),
            },
            "Iowa St.": {
               superSeniorsReturning: new Set([ "GaKalscheur::", "AlKunc::" ]),
            },
            "Jacksonville": {
               superSeniorsReturning: new Set([ "TyGreene::" ]),
            },
            "Kentucky": {
               leftTeam: [ "ShSharpe::" ],
            },
            "Liberty": {
               superSeniorsReturning: new Set([ "DaMcGhee::" ]),
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
            "Nebraska": {
               superSeniorsReturning: new Set([ "DeWalker::" ]),
            },
            "North Carolina": {
               superSeniorsReturning: new Set([ "LeBlack::" ]),
            },
            "Notre Dame": {
               superSeniorsReturning: new Set([ "CoRyan::", "DaGoodwin::" ]),
            },
            "Ohio St.": {
               superSeniorsReturning: new Set([ "SeTowns::", "JuSueing::" ]),
               leftTeam: [ "MaBranham::", "EjLiddell::" ],
            },
            "Oklahoma": {
               superSeniorsReturning: new Set([ "TaGroves::", "ElHarkless" ]),
            },
            "Ole Miss": {
               superSeniorsReturning: new Set([ "TyFagan::" ]),
            },
            "Penn St.": {
               superSeniorsReturning: new Set([ "JaPickett::", "MyDread::" ]),
            },
            "Pittsburgh": {
               superSeniorsReturning: new Set([ "JaBurton::" ]),
            },
            "Providence": {
               superSeniorsReturning: new Set([ "EdCroswell::" ]),
            },
            "Richmond": {
               superSeniorsReturning: new Set([ "MaGrace::" ]),
            },
            "Rider": {
               superSeniorsReturning: new Set([ "DwMurray::" ]),
            },
            "Saint Louis": {
               superSeniorsReturning: new Set([ "JaPerkins::" ]),
            },
            "Saint Mary's (CA)": {
               superSeniorsReturning: new Set([ "LoJohnson::" ]),
            },
            "San Diego": {
               superSeniorsReturning: new Set([ "MaEarlington::" ]),
            },
            "San Diego St.": {
               superSeniorsReturning: new Set([ "AdSeiko::", "AgArop::", "MaBradley::" ]),
            },
            "San Francisco": {
               superSeniorsReturning: new Set([ "KhShabazz::" ]),
            },
            "Seton Hall": {
               superSeniorsReturning: new Set([ "JaHarris::" ]),
               leftTeam: [ "Aiken, Bryce" ],
            },
            "St. John's (NY)": {
               superSeniorsReturning: new Set([ "MoMathis::" ]),
            },
            "Texas": {
               superSeniorsReturning: new Set([ "MaCarr::", "TiAllen::", "ChBishop::" ]),
            },
            "Texas Tech": {
               superSeniorsReturning: new Set([ "KeObanor::" ]),
            },
            "UCLA": {
               superSeniorsReturning: new Set([ "DaSingleton::" ]),
            },
            "Vanderbilt": {
               superSeniorsReturning: new Set([ "LiRobbins::", "QuMillora-br::" ]),
            },
            "Villanova": {
               superSeniorsReturning: new Set([ "BrSlater::", "CaDaniels::" ]),
            },
            "Virginia": {
               superSeniorsReturning: new Set([ "KiClark::", "JaGardner::" ]),
            },
            "Wake Forest": {
               superSeniorsReturning: new Set([ "DaWilliamson::" ]),
            },
            "Western Ky.": {
               superSeniorsReturning: new Set([ "JsHamilton::", "LuFrampton::" ]),
            },
            "Wyoming": {
               superSeniorsReturning: new Set([ "HuThompson::" ]),
            },
            "Xavier": {
               superSeniorsReturning: new Set([ "BeStanley::", "AdKunkel::" ]),
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

// Use this to build leaderboard lists
// console.log(`${
//    _.chain(TeamEditorManualFixes.fixes("Men_2021/22"))
//       .toPairs().flatMap(teamOver => {
//          const team = teamOver[0];
//          const over = teamOver[1];
//          return Array.from(over.superSeniorsReturning || []).map(p => `${p.replaceAll(":","")}:${team}`)
//       }).value().join(";")
// }`)