import { PlayerEditModel, Profiles, TeamEditorUtils } from "./TeamEditorUtils";

import _ from "lodash";
import { freshmenMen2020_21 } from "../public-data/freshmenMen2020_21";
import { freshmenMen2021_22 } from "../public-data/freshmenMen2021_22";
import { freshmenMen2022_23 } from "../public-data/freshmenMen2022_23";
import { freshmenMen2023_24 } from "../public-data/freshmenMen2023_24";
import { superSeniors2021_22 } from "../public-data/superSeniors2021_22";
import { leftTeam2021_22 } from "../public-data/leftTeam2021_22";
import { superSeniors2022_23 } from "../public-data/superSeniors2022_23";
import { leftTeam2022_23 } from "../public-data/leftTeam2022_23";

/** Note string keys are TeamEditorUtils.getKey, string val in leftTeam is player id (aka name) */
export type TeamEditorManualFixModel = {
   leftTeam?: Array<string>, //Note use normal key for players in DB, omit the "::" for Fr
   superSeniorsReturning?: Set<string>,
   overrides?: Record<string, PlayerEditModel>,
   codeSwitch?: Record<string, string>, //this year code to next year's code, note not currently supported for transfers
};

export class TeamEditorManualFixes {

   static readonly getFreshmenForYear = _.memoize((genderYear: string) => {
      if (genderYear == "Men_2019/20") { //(Fr for the following year given date)
         return TeamEditorManualFixes.buildOverrides(freshmenMen2020_21);
      } else if (genderYear == "Men_2020/21") { 
         return TeamEditorManualFixes.buildOverrides(freshmenMen2021_22);
      } else if (genderYear == "Men_2021/22") {  
         return TeamEditorManualFixes.buildOverrides(freshmenMen2022_23);
      } else if (genderYear == "Men_2022/23") {  
         return TeamEditorManualFixes.buildOverrides(freshmenMen2023_24);
      } else {
         return {};
      }
   });

   //TODO: move this into TeamEditorUtils
   private static readonly buildOverrides = (recruits: Record<string, any>)  => {
      return _.transform(recruits, (acc, override, team) => {
         const typedOverrides: Record<string, {pr: string, pos:string, c:string, h:string, r?:number, o?:number, d?:number}> = override;
         const playerOverrides = _.transform(typedOverrides, ((acc2, over, player) => {
            const adjRtg = (over.r || 0)*0.01;
            const fourStarSuperFactor = (((over.pr == "4*") && (adjRtg >= 0.8)) ? 
                  (0.5 + ((adjRtg - 0.8)*5)*1.25) : //(to make 4* align with T40 you start to get a bigger bonus at 75+, need o+d to get from 1.5 to 3 at adjRtg of 1.0
                  0.5 //(0.5 so the total -1 to 1 range is RAPM of 1)
               )*0.5; //(*0.5 for off/def)

            const fiveStarFactor = 0.5; //(5* gets bigger range of penalties because values assigned are pretty higher)
            const factor = (over.pr >= "5*") ? fiveStarFactor : fourStarSuperFactor; 

            const factorTimeRatingOff = parseFloat((factor*adjRtg + (over.o || 0)).toFixed(2));
            const factorTimeRatingDef = -parseFloat((factor*adjRtg + (over.d || 0)).toFixed(2));

            acc2[`${over.c}`] = { //(index by code not key)
               name: player,
               profile: over.pr as Profiles,
               pos: over.pos,
               height: over.h,
               global_off_adj: factorTimeRatingOff ? factorTimeRatingOff : undefined, //apportion out bonus/penalty if there is one
               global_def_adj: factorTimeRatingDef ? factorTimeRatingDef : undefined,
               fromFrList: true
            }
         }), {} as Record<string, PlayerEditModel>);
         acc[team] = {
            overrides: playerOverrides
         };

      }, {} as Record<string, TeamEditorManualFixModel>);
   };
   private static combineOverrides = 
      (
         mutableRecruits: Record<string, TeamEditorManualFixModel>, 
         manual: Record<string, TeamEditorManualFixModel>,
         superSeniors: Record<string, string[]> = {},
         leftTeam: Record<string, string[]> = {}
      ) => 
   {
      const phase1 = _.transform(manual, (acc, override, team) => {
         if (!acc[team]) {
            acc[team] = {};
         }
         _.merge(acc[team], override);
      }, mutableRecruits);

      const phase2 = _.transform(superSeniors, (acc, override, team) => {
         if (!acc[team]) {
            acc[team] = {};
         } 
         if (acc[team].superSeniorsReturning) {
            override.forEach(returningPlayer => acc[team].superSeniorsReturning!.add(returningPlayer));
         } else {
            acc[team].superSeniorsReturning = new Set(override);
         }
      }, phase1);

      const phase3 = _.transform(leftTeam, (acc, override, team) => {
         if (!acc[team]) {
            acc[team] = {};
         } 
         if (acc[team].leftTeam) {
            acc[team].leftTeam = acc[team].leftTeam!.concat(override);
         } else {
            acc[team].leftTeam = override;
         }
      }, phase2);

      return phase3;
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
            "Seton Hall": {
               ...(TeamEditorManualFixes.buildOverrides({"": {
                  "Aiken, Bryce": {
                     //(he's a super senior, but treat him like a T40 Fr, to give about the right RAPM)
                     "pos": "s-PG", "pr": "4*/T40ish", "c": "BrAiken", "h": "5-11", "r": 0
                  },
               }})[""])
            },
         }
         return TeamEditorManualFixes.combineOverrides(
            mutableToRet, manualOverrides_Men_2020_21
         );
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
         return TeamEditorManualFixes.combineOverrides(
            mutableToRet, manualOverrides_Men_2021_22, superSeniors2021_22, leftTeam2021_22
         );

      } else if (genderYear == "Men_2021/22") {  //(offseason of 21/22, ie team for 22/23)

         // Add significant injury information from https://www.covers.com/sport/basketball/ncaab/injuries

         const manualOverrides_Men_2022_23:  Record<string, TeamEditorManualFixModel> = { 
            "Alabama": {
               overrides: {
                  "JaQuinerly::": { mins: 20 } //(injury)
               }
            },
            "Arizona": {
               ...(TeamEditorManualFixes.buildOverrides({"": { //(some foreign players worth HS T100 rankings)
                  "Veesaar, Henri": {
                     "pos": "PF/C", "pr": "4*/T40ish", "c": "HeVeesaar", "h": "6-11", "r": 54
                  },
                  "Borvicanin, Filip": {
                     "pos": "WF", "pr": "3.5*/T150ish", "c": "FiBorvicanin", "h": "6-8", "r": 72
                  },
                  "Boswell, Kylan": {
                     "pos": "PG", "pr": "4*/T40ish", "c": "KyBoswell", "h": "6-1", "r": 90
                  },
               }})[""])
            },
            "Arizona St.": {
               leftTeam: [ "JaNeal::" ], //(injury)
            },
            "Baylor": {
               ...(TeamEditorManualFixes.buildOverrides({"": {
                  "Ojianwuna, Joshua": {
                     "pos": "C", "pr": "4*", "c": "JoOjianwuna", "h": "6-10", "r": 0
                  },
               }})[""])
            },
            "BYU": {
               leftTeam: [ "CoChandler" ], //KEEPME, (Fr on mission - Fr hence no ::)
            },
            "Clemson": {
               overrides: {
                  "PjHall::": { mins: 25 } //(injury)
               }
            },
            "Colorado St.": {
               overrides: {
                  "IsStevens::": { mins: 10 } //(injury)
               }
            },
            "Drake": {
               overrides: {
                  "DjWilkins::": { mins: 15 } //(injury)
               }
            },
            "Duke": {
               //(injuries, see below)
               ...(TeamEditorManualFixes.buildOverrides({"": {
                  "Proctor, Tyrese": {
                     "pos": "PG", "pr": "5*", "c": "TyProctor", "h": "6-4", "r": -100
                  },
               }})[""])
            },
            "Florida": { 
               ...(TeamEditorManualFixes.buildOverrides({"": { //TODO: interim until I've incorporated lower poss players in properly
                  "Lane, Niels": {
                     "pos": "WG", "pr": "3*", "c": "NiLane", "h": "6-5", "r": 0, "o": 1, "d": 2.5
                  },
                  "Jitoboh, Jason": {
                     "pos": "C", "pr": "3*", "c": "JaJitoboh", "h": "6-11", "r": 0, "o": 2, "d": 2
                  },
               }})[""])
            },
            "Florida St.": { 
               leftTeam: [ "JaGainey:Brown:" ], //(injury)
               ...(TeamEditorManualFixes.buildOverrides({"": { //TODO: interim until I've incorporated lower poss players in properly
                  "McLeod, Naheem": {
                     "pos": "C", "pr": "3*", "c": "NaMcleod", "h": "7-4", "r": 0, "o": 2.5, "d": 1
                  },
               }})[""])
            },
            "Georgia": {
               overrides: {
                  "TeRoberts:Bradley:": { mins: 15 } //(injury)
               }
            },
            "Iowa St.": {
               leftTeam: [ "JeWilliams:Temple:" ] //(injury)
            },
            "Illinois": { 
               ...(TeamEditorManualFixes.buildOverrides({"": { //TODO: interim until I've incorporated lower poss players in properly
                  "Melendez, RJ": {
                     "pos": "WF", "pr": "4*", "c": "RjMelendez", "h": "6-7", "r": 0, "o": 1.5, "d": 1.5
                  },
               }})[""])
            },
            "Kentucky": {
               leftTeam: [ "ShSharpe::" ], //KEEPME (NBA draft)
               overrides: {
                  "OsTshiebwe::": { mins: 25 } //(injury)
               }
            },
            "Marquette": {
               ...(TeamEditorManualFixes.buildOverrides({"": { //Very strong JUCO
                  "Wrightsil, Zach": {
                     "pos": "S-PF", "pr": "4*", "c": "ZaWrightsil", "h": "6-7", "r": 0
                  },
               }})[""])
            },
            "Minnesota": {
               leftTeam: [ "IsIhnen::" ], //(injury)
            },
            "Nevada": {
               overrides: {
                  "HuMcintosh:Elon:": { mins: 5 } //(injury)
               }
            },
            "New Mexico St.": {
               overrides: {
                  "KiAiken:Arizona:": { mins: 20 }, //(elig.)
               }
            },
            "Ole Miss": {
               superSeniorsReturning: new Set([ "TyFagan::" ]), //KEEPME 
            },
            "Oklahoma": { 
               ...(TeamEditorManualFixes.buildOverrides({"": { //TODO: interim until I've incorporated lower poss players in properly
                  "Cortes, Bijan": {
                     "pos": "s-PG", "pr": "3*", "c": "BiCortes", "h": "6-3", "r": 0, "o": 0.5, "d": 2
                  },
               }})[""])
            },
            "Oregon": {
               overrides: {
                  "JeCouisnard:South Carolina:": { mins: 15 } //(injury)
               }
            },
            "Oregon St.": {
               overrides: {
                  "ChWright:Georgia:": { mins: 15 } //(injury)
               }
            },
            "Pittsburgh": {
               leftTeam: [ "DiJohnson" ], //(suspension)               
            },
            "Saint Mary's (CA)": { 
               ...(TeamEditorManualFixes.buildOverrides({"": { //TODO: interim until I've incorporated lower poss players in properly
                  "Saxen, Mitchell": {
                     "pos": "C", "pr": "3*", "c": "MiSaxen", "h": "6-10", "r": 0, "o": 1.5, "d": 1.5
                  },
               }})[""])
            },
            "South Carolina": { 
               ...(TeamEditorManualFixes.buildOverrides({"": { //TODO: interim until I've incorporated lower poss players in properly
                  "Gray, Josh": {
                     "pos": "C", "pr": "3*", "c": "JoGray", "h": "7-0", "r": 0, "o": 0.75, "d": 3.25
                  },
               }})[""])
            },
            "Texas A&M": {
               overrides: {
                  "EtHenderson::": { mins: 5 } //(suspension)
               }
            },
            "Texas Tech": {
               overrides: {
                  "FaAimaq:Utah Valley:": { mins: 20 } //(injury)
               }
            },
            "Villanova": {
               overrides: {
                  "JuMoore::": { mins: 20 } //(injury)
               }
            },
            "Wichita St.": {
               overrides: {
                  "CoRogers:Siena:": { mins: 25 } //(elig)
               }               
            },
            "Winthrop": {
               leftTeam: [ "MiAnumba::" ], //(injury)
            },
            "Wyoming": {
               overrides: {
                  "GrIke::": { mins: 15 } //(injury)
               }               
            }
         };
         const combinedOverrides = TeamEditorManualFixes.combineOverrides(
            mutableToRet, manualOverrides_Men_2022_23, superSeniors2022_23, leftTeam2022_23
         );

         // Duke injury:
         combinedOverrides["Duke"]!.overrides!["DaWhitehead"]!.mins = 25.0; //(injury)
         // Kansas injury
         combinedOverrides["Kansas"]!.overrides!["MjRice"]!.mins = 5.0; //(injury)

         return combinedOverrides;
      } else if (genderYear == "Men_2022/23") {  //(offseason of 21/22, ie team for 22/23)
         const manualOverrides_Men_2023_24:  Record<string, TeamEditorManualFixModel> = {
            //(through Apr 23, see https://barttorvik.com/all_superseniors.php / https://docs.google.com/spreadsheets/d/1LihDf0cb5B703qojm0V0cZ_VXxA0PcXD6999AgwumBM/edit#gid=0)
            "Arkansas": {
               superSeniorsReturning: new Set([ "JaGraham::" ]),
            },
            "App State": {
               superSeniorsReturning: new Set([ "DoGregory::" ]),
            },
            "Boise St.": {
               superSeniorsReturning: new Set([ "MaRice::" ]),
            },
            "Boston College": {
               superSeniorsReturning: new Set([ "QuPost::" ]),
            },
            "Bradley": {
               superSeniorsReturning: new Set([ "MaLeons::" ]),
            },
            "Butler": {
               superSeniorsReturning: new Set([ "JaThomas::", "AlAli::" ]),
            },
            "Cincinnati": {
               superSeniorsReturning: new Set([ "OdOguama::" ]),
            },
            "Clemson": {
               superSeniorsReturning: new Set([ "AlHemenway::" ]),
            },
            "Creighton": {
               superSeniorsReturning: new Set([ "FrFarabello::", "BaScheierman::" ]),
            },
            "Dayton": {
               leftTeam: [ "MiSharavjamt::" ], //(NBA)
            },
            "Drake": {
               superSeniorsReturning: new Set([ "DaBrodie::", "TuDevries::" ]),
            },
            "Duke": {
               superSeniorsReturning: new Set([ "RyYoung::" ]),
            },
            "Eastern Ky.": {
               superSeniorsReturning: new Set([ "IsCozart::" ]),
            },
            "Fairfield": {
               superSeniorsReturning: new Set([ "CaFields::" ]),
            },
            "George Washington": {
               superSeniorsReturning: new Set([ "JaBishop::" ]),
            },
            "Georgia Tech": {
               superSeniorsReturning: new Set([ "LaTerry::" ]),
            },
            "Georgetown": {
               leftTeam: [ "DaHarris::" ], //(bug in how transfers who didn't suit up last year are handled)
            },
            "Hampton": {
               superSeniorsReturning: new Set([ "BrEarle::" ]),
            },
            "Indiana": {
               superSeniorsReturning: new Set([ "XaJohnson::" ]),
            },
            "Iona": {
               superSeniorsReturning: new Set([ "OsShema::" ]),
            },
            "Iowa St.": {
               superSeniorsReturning: new Set([ "RoJones::", "HaWard::", "TrKing::" ]),
            },
            "Kansas": {
               superSeniorsReturning: new Set([ "DaHarris::" ]),
            },
            "Kentucky": {
               superSeniorsReturning: new Set([ "BrCanada::" ]),
            },
            "Liberty": {
               superSeniorsReturning: new Set([ "KyRode::", "ShRobinson::" ]),
            },
            "Loyola Chicago": {
               superSeniorsReturning: new Set([ "BrNorris::", "ToWelch::" ]),
            },
            "LMU (CA)": {
               superSeniorsReturning: new Set([ "KeLeaupepe::" ]),
            },
            "Maryland": {
               ...(TeamEditorManualFixes.buildOverrides({"": { //TODO: interim until I've incorporated lower poss players in properly
                  "Long, Jahari": {
                     "pos": "PG", "pr": "4*", "c": "JaLong", "h": "6-5", "r": 0, "o": -0.25, "d": 0.5
                  },
               }})[""]),
               superSeniorsReturning: new Set([ "JaYoung::", "DoScott::" ]),
            },
            "Massachusetts": {
               superSeniorsReturning: new Set([ "WiLeveque::" ]),
            },
            "Memphis": {
               superSeniorsReturning: new Set([ "JaHardaway::", "ChLawson::" ]),
            },
            "Missouri": {
               superSeniorsReturning: new Set([ "NoCarter::" ]),
            },
            "Mississippi St.": {
               superSeniorsReturning: new Set([ "DaDavis::", "DjJeffries::", "WiMcnair::" ]),
            },
            "Michigan St.": {
               superSeniorsReturning: new Set([ "StIzzo::", "TyWalker::", "MaHall::" ]),
            },
            "Montana": {
               superSeniorsReturning: new Set([ "AaMoody::" ]),
            },
            "Nevada": {
               superSeniorsReturning: new Set([ "KeBlackshear::" ]),
            },
            "New Mexico": {
               superSeniorsReturning: new Set([ "JaHouse::" ]),
            },
            "North Carolina": {
               superSeniorsReturning: new Set([ "ArBacot::" ]),
            },
            "North Florida": {
               superSeniorsReturning: new Set([ "DoJames::" ]),
            },
            "Ohio": {
               superSeniorsReturning: new Set([ "MiBrown::" ]),
            },
            "Ohio St.": {
               superSeniorsReturning: new Set([ "TaHolden::" ]),
            },
            "Oklahoma St.": {
               superSeniorsReturning: new Set([ "JoWright::" ]),
            },
            "Oregon": {
               superSeniorsReturning: new Set([ "JeCouisnard::", "N'Dante::" ]),
            },
            "Quinnipiac": {
               superSeniorsReturning: new Set([ "SaLewis::", "MaBalanc::" ]),
            },
            "Richmond": {
               superSeniorsReturning: new Set([ "NeQuinn::" ]),
            },
            "Rider": {
               superSeniorsReturning: new Set([ "AlPowell::" ]),
            },
            "Rutgers": {
               superSeniorsReturning: new Set([ "CaSpencer::", "AuHyatt::" ]),
            },
            "Sacred Heart": {
               superSeniorsReturning: new Set([ "JoReilly::", "RaSoloman::", "BrMcguire::" ]),
            },
            "Saint Joseph's": {
               superSeniorsReturning: new Set([ "CaBrown::" ]),
            },
            "Saint Louis": {
               superSeniorsReturning: new Set([ "GiJimerson::" ]),
            },
            "Saint Mary's (CA)": {
               superSeniorsReturning: new Set([ "AlDucas::" ]),
            },
            "San Diego St.": {
               superSeniorsReturning: new Set([ "JaLedee::", "DaTrammell::" ]),
            },
            "Santa Clara": {
               leftTeam: [ "BrPodziemski" ], //(NBA)
            },
            "SMU": {
               superSeniorsReturning: new Set([ "SaWilliamson::" ]),
            },
            "Southern California": {
               superSeniorsReturning: new Set([ "JoMorgan::", "BoEllis::" ]),
            },
            "St. John's (NY)": {
               superSeniorsReturning: new Set([ "JoSoriano::" ]),
            },
            "Stanford": {
               superSeniorsReturning: new Set([ "MiJones::", "SpJones::" ]),
            },
            "Stonehill": {
               superSeniorsReturning: new Set([ "MaZegarowski::" ]),
            },
            "TCU": {
               superSeniorsReturning: new Set([ "ChO'bannon::" ]),
            },
            "Tennessee": {
               superSeniorsReturning: new Set([ "SaVescovi::" ]),
            },
            "Texas": {
               superSeniorsReturning: new Set([ "BrCunningham::", "DyDisu::" ]),
            },
            "Toledo": {
               superSeniorsReturning: new Set([ "RaDennis::" ]),
            },
            "Towson": {
               superSeniorsReturning: new Set([ "ChThompson::" ]),
            },
            "UC Santa Barbara": {
               superSeniorsReturning: new Set([ "JoPierre-lou::" ]),
            },
            "UCLA": {
               superSeniorsReturning: new Set([ "KeNwuba::" ]),
            },
            "UNC Asheville": {
               superSeniorsReturning: new Set([ "DrPember::" ]),
            },
            "UNCW": {
               superSeniorsReturning: new Set([ "AmKelly::", "ShPhillips::" ]),
            },
            "Valparaiso": {
               superSeniorsReturning: new Set([ "QuGreen::" ]),
            },
            "Vermont": {
               superSeniorsReturning: new Set([ "MaVeretto::", "AaDeloney::" ]),
            },
            "Villanova": {
               superSeniorsReturning: new Set([ "JuMoore::", "ErDixon::" ]), //(Dixon is actually a Jr but NCAA roster is wrong)
            },
            "Virginia Tech": {
               superSeniorsReturning: new Set([ "HuCattoor::" ]),
            },
            "Washington": {
               superSeniorsReturning: new Set([ "KeBrooks::" ]),
            },
            "Washington St.": {
               superSeniorsReturning: new Set([ "DjRodman::" ]),
            },
            "West Virginia": {
               superSeniorsReturning: new Set([ "JoPerez::", "JoToussaint::" ]), 
            },
            "Winthrop": {
               superSeniorsReturning: new Set([ "MiAnumba::", "ChClaxton::" ]),
            },
            "Wisconsin": {
               superSeniorsReturning: new Set([ "TyWahl::" ]),
            },
            "Wright St.": {
               superSeniorsReturning: new Set([ "TrCalvin::" ]),
            },
            "Xavier": {
               superSeniorsReturning: new Set([ "JeHunter::", "ZaFreemantle::" ]),
            },
            "Youngstown St.": {
               superSeniorsReturning: new Set([ "BrRush::" ]),
            }
         };

         const combinedOverrides = TeamEditorManualFixes.combineOverrides(
            mutableToRet, manualOverrides_Men_2023_24, {}, leftTeam2022_23 //(use prev season until have calculated this season's)
         );
         return combinedOverrides;
      } else {
         // Note when calling combineOverrides, need to use leftTeam${prevYear} to handle players who left a season ago
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