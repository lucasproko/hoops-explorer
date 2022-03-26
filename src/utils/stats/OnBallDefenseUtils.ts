
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

  /** Idempotent conversion of on ball stats to the TSV - in practice not currently used since they are never persisted */
  static parseInput(stats: OnBallDefenseModel[]): string {
   const st = stats[0]!;
   const headerRow = "Team,-,Plays,Pts,-,-,-,FGm,FGM,-,-,-,TOV%,-,SF%,score%".replace(",", "\t");
   const teamRow = `Team,-,${st.totalPlays},${st.totalPts},-,-,-,${st.totalFgMiss},${st.totalFgMade},-,-,-,${(st.totalTos/(st.totalPlays || 1))},-,${(st.totalSfPlays/(st.totalPlays || 1))},${st.totalScorePct}`.replace(",", "\t");

   const rows = stats.map(s => {
     return `Team,-,${s.plays},${s.pts},-,-,-,${s.fgMiss},${s.fgMade},-,-,-,${s.tovPct},-,${s.sfPct},${s.scorePct}`.replace(",", "\t");
   });

   return `${headerRow}\n${teamRow}\n${rows.join("\n")}`
 };

 static parseContents(players: Array<IndivStatSet>, contents: string) {
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

   // If there's a totals row we can now add team stats (can still do something otherwise)
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