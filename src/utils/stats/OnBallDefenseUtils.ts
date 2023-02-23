
//lodash
import _ from "lodash";
import { IndivStatSet, RosterEntry } from "../StatModels";

import { OnBallDefenseModel, RatingUtils } from "./RatingUtils";

/** Encapsulate the results and diags from OnBallDefenseUtils.parseContents */
type OnBallDefenseAnalysisResults = {
   rowsCols: string[][],
   matchedPlayers: { found: number[], notFound: number[], matchedCols: string[] },
   matchedPlayerStats: OnBallDefenseModel[],
   unmatchedPlayerStats: OnBallDefenseModel[],
   maybeTotals: string[] | undefined,
   playerNumberToCol: Record<string, string[]>,
   dupColMatches: string[],
   colsNotMatched: string[]
};

/** All the actual math lives in RatingUtils, this is just the common table parsing logic */
export class OnBallDefenseUtils {

  /** Idempotent conversion of on ball stats to the TSV - in practice not currently used since they are never persisted 
   * (see also parseContentsLegacy)
   */
  static parseInputLegacy(stats: OnBallDefenseModel[]): string {
   const st = stats[0]!;
   const headerRow = "Team,-,Plays,Pts,-,-,-,FGm,FGM,-,-,-,-,-,-,TOV%,-,SF%,score%".replace(",", "\t");
   const teamRow = `Team,-,${st.totalPlays},${st.totalPts},-,-,-,${st.totalFgMiss},${st.totalFgMade},-,-,-,-,-,-,${(st.totalTos/(st.totalPlays || 1))},-,${(st.totalSfPlays/(st.totalPlays || 1))},${st.totalScorePct}`.replace(",", "\t");

   const rows = stats.map(s => {
     return `Team,-,${s.plays},${s.pts},-,-,-,${s.fgMiss},${s.fgMade},-,-,-,-,-,-,${s.tovPct},-,${s.sfPct},${s.scorePct}`.replace(",", "\t");
   });

   return `${headerRow}\n${teamRow}\n${rows.join("\n")}`
  };

  /** Util to parse a nd csv file, remove headers and corrupted lines */
  private static getRowCols(contents: string): string[][] {
      const rowsCols: string[][] =
      contents
         .split("\n").filter(line => !_.startsWith(line, "#"))
         .map(line => line.split(",")).filter(cols => cols.length > 5);
      return rowsCols;
  }

   /** Combine team and player CSVs from Synergy */
   static combineTeamAndPlayerFiles(contents1: string, contents2: string) {

      // Phase 1: which is player and which is team?

      const rowsCols1 = OnBallDefenseUtils.getRowCols(contents1);
      const rowsCols2 = OnBallDefenseUtils.getRowCols(contents2);

      const numCols1 = _.chain(rowsCols1).take(1).map(row => row.length).max().value();
      const numCols2 = _.chain(rowsCols2).take(1).map(row => row.length).max().value();

      const playerRowsCols = numCols1 > numCols2 ? rowsCols1 : rowsCols2; 
      const teamRowsCols = numCols1 > numCols2 ? rowsCols2 : rowsCols1; //(players has extra col)

      // Phase 2: find the line corresponding to the team

      const teamName = playerRowsCols[0]?.[2] || "NOT FOUND TEAM";
      const teamRow = teamRowsCols.find(row => (row?.[1] == teamName));
      const transformTeamRow = (row: string[]) => {
         return [ row?.[0] || "", "Team", ...(_.drop(row, 1)) ];
      }
      return transformTeamRow(teamRow || []).join(",") + "\n" + (numCols1 > numCols2 ? contents1 : contents2);
   }

   /** Parse a combined team/player file */
   static parseContents(players: Array<IndivStatSet>, contents: string) {
      const rowsCols = OnBallDefenseUtils.getRowCols(contents);

      const parseFloatOrMissing = (s: string | undefined) => {
         const tmp = parseFloat(s || "-");
         return _.isNaN(tmp) ? 0 : tmp;
      };
      /** For now very simple name transformer */   
      const transformName = (n: string) => {
         const n1 = (n[0] == '"') ? n.substr(1, n.length - 2) : n;
         const names = n1.split(/ +/);
         if (names.length == 1) {
            return n1;
         } else {
            const reformattedName = `${_.last(names)}, ${_.take(names, names.length - 1).join(" ")}`;
            return reformattedName;
         }
      };
      const parseRow = (code: string, row: string[]) => {
         const scoreQualityOffset = row.length > 17 ? 3 : 0;

         const res: OnBallDefenseModel = {
            code: code,
            title: transformName(row[1]),
   
            pts: parseFloatOrMissing(row[6]),
            plays: parseFloatOrMissing(row[5]),
            scorePct: parseFloatOrMissing(row[15 + scoreQualityOffset]),
            tovPct: parseFloatOrMissing(row[13 + scoreQualityOffset]),
            fgMiss: parseFloatOrMissing(row[8]),
   
            // New algo:
            fgMade: parseFloatOrMissing(row[9]),
            sfPct: parseFloatOrMissing(row[16 + scoreQualityOffset]),
   
            // Fill these in later:
            totalPts: -1, totalScorePct: -1, totalPlays: -1,
            uncatPts: -1, uncatPlays: -1,
            uncatScorePct: -1,  uncatPtsPerScPlay: -1,
   
            // New algo:
            totalSfPlays: -1, totalTos: -1, totalFgMade: -1, totalFgMiss: -1,
            uncatSfPlays: -1, uncatTos: -1, uncatFgMade: -1, uncatFgMiss: -1,    
         };
         return res;
      };

      const mutableMatchFound: number[] = [];
      const mutableMatchNotFound: string[] = [];
      const playersByFullName = _.fromPairs(players.map(p => {
         return [ p.key, p ];
      }));
      const playersByCode = _.fromPairs(players.map(p => {
         return [ p.code, p ];
      }));

      const mutablePlayersNotFound = _.fromPairs(players.map((p, ii) => [p.key, ii]));
      const [ matchedPlayerStats, unmatchedPlayerStats] = _.chain(rowsCols).flatMap((row, ii) => {
         const playerName = transformName(row[1]);
         const matchingPlayer = playersByCode[row[1]] || playersByFullName[playerName];
         if (matchingPlayer?.code) {
            mutableMatchFound.push(ii);
            _.unset(mutablePlayersNotFound, matchingPlayer.key || "");
            return [ parseRow(matchingPlayer.code, row) ];
         } else {
            if ((playerName != "") && (playerName != "Team")) {
               mutableMatchNotFound.push(playerName);
               return [ parseRow("", row) ];
            } else {
               return [];
            }
         }
      }).partition(stats => stats.code).value();

      // If there's a totals row we can now add team stats (otherwise do nothing)
      const maybeTotals = _.find(rowsCols, row => row[1] == "Team");
      if (maybeTotals) {
         const totalStats = parseRow("totals", maybeTotals);
         RatingUtils.injectUncatOnBallDefenseStats(totalStats, _.concat(matchedPlayerStats, unmatchedPlayerStats));
         //(mutates the objects in these array)
      }
      const res: OnBallDefenseAnalysisResults = {
         rowsCols,
   
         matchedPlayers: { 
            found: mutableMatchFound, 
            notFound: _.values(mutablePlayersNotFound),
            matchedCols: [] //TODO
         },
         matchedPlayerStats,
         unmatchedPlayerStats,
   
         maybeTotals,
         playerNumberToCol: {}, //(not used any more)
   
         dupColMatches: [], //(not used any more)
         colsNotMatched: mutableMatchNotFound,
      };
      return res;
   }

 /** No longer in-use 
   * (see also parseContentsLegacy)
   */
 static parseContentsLegacy(players: Array<IndivStatSet>, contents: string) {
   const rowsCols: string[][] =
      contents
         .split("\n").filter(line => _.endsWith(line, "%"))
         .map(line => line.split("\t")).filter(cols => cols.length > 5);

   const maybeTotals = _.startsWith(rowsCols?.[0]?.[0] || "", "#") ? undefined : rowsCols[0];

   const playerNumberToColAndDups = _.transform(rowsCols, (acc, cols) => {
      const playerId = cols[0]!;
      const playerIdComps = playerId.split(" ");
      if (_.startsWith(playerId, "#")) {
         if (acc.unique.hasOwnProperty(playerIdComps[0])) {
            acc.dups.push(playerId);
            acc.dups.push(acc.unique[playerIdComps[0]][0]);
         } else {
            acc.unique[playerIdComps[0]] = cols;
         }
      }
   }, { unique: {} as Record<string, string[]>, dups: [] as string[] });

   const playerNumberToCol = playerNumberToColAndDups.unique;
   const dupColMatches = playerNumberToColAndDups.dups;

   const getMatchingRosterId = (roster: RosterEntry) => {
      const rosterNumber = (roster?.number || "??")
      const rosterNumberNoZero = rosterNumber.replace(/0([0-9])/, "$1");
      const rosterId = "#" + rosterNumberNoZero;
      const rosterIdWithLeadingZero = "#0" + (roster?.number || "??");
      const backupRosterId = "#" + (roster?.alt_number || "??");
      return playerNumberToCol.hasOwnProperty(rosterId) ? rosterId :
            (playerNumberToCol.hasOwnProperty(rosterIdWithLeadingZero) ? rosterIdWithLeadingZero :
               (playerNumberToCol.hasOwnProperty(backupRosterId) ? backupRosterId : "#??"));
   };
   const matchedPlayers = _.transform(players, (acc, player, ii) => {
      const matchingRosterId = getMatchingRosterId(player.roster || {});
      if (matchingRosterId) {
         acc.found.push(ii);
         acc.matchedCols.push(matchingRosterId)
      } else {
         acc.notFound.push(ii);
      }
   }, { found: [] as number[], notFound: [] as number[], matchedCols: [] as string[] });

   const colsNotMatched = _.chain(playerNumberToCol).omit(matchedPlayers.matchedCols).keys().value();

   // Convert TSV to data structures

   const parseFloatOrMissing = (s: string | undefined) => {
      const tmp = parseFloat(s || "-");
      return _.isNaN(tmp) ? 0 : tmp;
   };
   const parseRow = (code: string, row: string[]) => {

      // Needs to be consistent with parseInputLegacy
      //const headerRow = "Team,-,Plays,Pts,-,-,-,FGm,FGM,-,-,-,TOV%,-,SF%,score%".replace(",", "\t");

      const res: OnBallDefenseModel = {
         code: code,
         title: row[0],

         pts: parseFloatOrMissing(row[3]),
         plays: parseFloatOrMissing(row[2]),
         scorePct: parseFloatOrMissing(row[15]),
         tovPct: parseFloatOrMissing(row[12]),
         fgMiss: parseFloatOrMissing(row[7]),

         // New algo:
         fgMade: parseFloatOrMissing(row[8]),
         sfPct: parseFloatOrMissing(row[14]),

         // Fill these in later:
         totalPts: -1, totalScorePct: -1, totalPlays: -1,
         uncatPts: -1, uncatPlays: -1,
         uncatScorePct: -1,  uncatPtsPerScPlay: -1,

         // New algo:
         totalSfPlays: -1, totalTos: -1, totalFgMade: -1, totalFgMiss: -1,
         uncatSfPlays: -1, uncatTos: -1, uncatFgMade: -1, uncatFgMiss: -1,    
      };
      return res;
   };
   const matchedPlayerStats = matchedPlayers.found.map(ii => {
      const player = players[ii]!;
      const matchingRosterId = getMatchingRosterId(player.roster || {});
      const row = playerNumberToCol[matchingRosterId || "??"] || [];
      const onBallDefense = parseRow(player.code || matchingRosterId, row);
      return onBallDefense;
   });
   const unmatchedPlayerStats = colsNotMatched.map(rosterId => {
      const row = playerNumberToCol[rosterId] || [];
      const onBallDefense = parseRow(rosterId, row);
      return onBallDefense;
   });

   //(Use to generate unit test artefact sampleOnBallDefenseStats)
   // console.log(JSON.stringify([ parseRow("totals", maybeTotals!),  matchedPlayerStats ], null, 3));

   // If there's a totals row we can now add team stats (otherwise do nothing)
   if (maybeTotals) {
      const totalStats = parseRow("totals", maybeTotals);
      RatingUtils.injectUncatOnBallDefenseStats(totalStats, _.concat(matchedPlayerStats, unmatchedPlayerStats));
      //(mutates the objects in these array)
   }

   const res: OnBallDefenseAnalysisResults = {
      rowsCols,

      matchedPlayers,
      matchedPlayerStats,
      unmatchedPlayerStats,

      maybeTotals,
      playerNumberToCol,

      dupColMatches,
      colsNotMatched,
   };
   return res;
 }

}