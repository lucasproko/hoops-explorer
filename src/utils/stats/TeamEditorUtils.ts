
import _ from "lodash";
import { AvailableTeams } from "../internal-data/AvailableTeams";
import { IndivStatSet, PureStatSet, Statistic } from '../StatModels';
import { RatingUtils } from './RatingUtils';
import { LeaderboardUtils, TransferModel } from '../LeaderboardUtils';
import { PositionUtils } from "./PositionUtils";
import { TeamEditorManualFixes, TeamEditorManualFixModel } from "./TeamEditorManualFixes";
import { DateUtils } from "../DateUtils";

/** Possibly ways we change projections */
type DiagCodes = 
   "fr_yearly_bonus" | "yearly_bonus" |
   "undersized_txfer_pen" | "general_txfer_pen" |
   "player_gravity_bonus" | "player_gravity_penalty" | 
   "better_help_txfer_bonus" | "share_team_defense" |
   "incorp_prev_season" | "fr_regression" |
   "switch_usage_ortg_style" |
   "user_adjustment" |
   "average_usage" | "switch_usage_ortg_average" | "lack_of_playmaking_penalty"
   ;

/** For a given stat/projection, how/why we changed it */
type TeamEditorDiagObject = { [K in DiagCodes]?: number }

/** For a given player, a set of all the changes to their projection */
type TeamEditorDiags = {
   off_rtg: { good: TeamEditorDiagObject, ok: TeamEditorDiagObject, bad: TeamEditorDiagObject, }
   off_usage: { good: TeamEditorDiagObject, ok: TeamEditorDiagObject, bad: TeamEditorDiagObject, }
   off: { good: TeamEditorDiagObject, ok: TeamEditorDiagObject, bad: TeamEditorDiagObject, }
   def: { good: TeamEditorDiagObject, ok: TeamEditorDiagObject, bad: TeamEditorDiagObject, }
};

/** Different possible HS profiles used to build Fr projections */
export type Profiles = "5*/Lotto" | "5*" | "5+4*s" | "4*/T40ish" | "4*" | "3.5*/T150ish" | "3*" | "3+2*s" | "2*" | "Auto" | "UR";

/** The overides */
export type PlayerEditModel = {
   name?: string, //this determines if the override is a player in their own right
   mins?: number,
   global_off_adj?: number,
   global_def_adj?: number,
   pause?: boolean,
   profile?: Profiles, //(see TeamRosterEditor for possible values)
   pos?: string, //(usual set of possible pos)
};

/** Encapsulates a projection for a player (possibly manually created), plus their actual results */
export type GoodBadOkTriple = {
   key: string,
   good: IndivStatSet,
   ok: IndivStatSet,
   bad: IndivStatSet,
   orig: IndivStatSet,
   prevYear?: IndivStatSet,
   diag?: TeamEditorDiags,
   actualResults?: IndivStatSet,
   isOnlyActualResults?: boolean,
   manualProfile?: PlayerEditModel // created by hand
};

/** The output of the main procesing chain */
export type TeamEditorProcessingResults = {
   // Main results
   rosterGuards: Array<GoodBadOkTriple>,
   rosterGuardMins: number,
   maybeBenchGuard: GoodBadOkTriple | undefined,
   rosterWings: Array<GoodBadOkTriple>,
   rosterWingMins: number,
   maybeBenchWing: GoodBadOkTriple | undefined,
   rosterBigs: Array<GoodBadOkTriple>,
   rosterBigMins: number,
   maybeBenchBig: GoodBadOkTriple | undefined,

   //Lists of players needed for rendering
   basePlayersPlusHypos: Array<GoodBadOkTriple>, //The roster, minus deleted players, plus added hypos
   inSeasonPlayerResultsList: Array<GoodBadOkTriple> | undefined, // In-Season or Eval mode, what's actually going on
   actualResultsForReview: Array<GoodBadOkTriple> // Eval mode, 

   // Some other useful intermediates
   avgEff: number,
   allDeletedPlayers: Record<string, string> //(merged team and UI overrides)
   allOverrides: Record<string, PlayerEditModel>, //(merged player and UI overrides)
   unpausedOverrides: Record<string, PlayerEditModel>, //(active allOverrides)
}

/** Data manipulation functions for the TeamEditorTable */
export class TeamEditorUtils {

   static readonly benchGuardKey = "benchG";
   static readonly benchWingKey = "benchW";
   static readonly benchBigKey = "benchB";

   // Model Parsing

   /** Has the user applied any overrides */
   static anyUserOverrides(model: PlayerEditModel) {
      return !_.isNil(model.mins) || !_.isNil(model.global_off_adj) || !_.isNil(model.global_def_adj);
   }

   /** Convert user overrides to a param string */
   static playerEditModelToUrlParams(key: string, model: PlayerEditModel): string {
      const maybeMins = _.isNil(model.mins) ? undefined : `m@${model.mins.toFixed(1)}`;
      const maybeOffAdj = _.isNil(model.global_off_adj) ? undefined : `go@${model.global_off_adj.toFixed(2)}`;
      const maybeDefAdj = _.isNil(model.global_def_adj) ? undefined : `gd@${model.global_def_adj.toFixed(2)}`;
      const maybePaused = _.isNil(model.pause) ? undefined : `p@${model.pause ? 1 : 0}`;
      const maybeProfile = _.isNil(model.profile) ? undefined : `b@${model.profile}`;
      const maybePos = _.isNil(model.pos) ? undefined : `P@${model.pos}`;
      const toWrite = [  maybeMins, maybeOffAdj, maybeDefAdj, maybePaused, maybeProfile, maybePos ].filter(s => !_.isNil(s));
      return `${key}|${toWrite.join("|")}`;
   }

   /** Convert the stringified param into a map of player edit modes */
   static urlParamstoPlayerEditModels(urlParamFrag: string): Record<string, PlayerEditModel> {
      return _.chain(urlParamFrag).split(";").map(frag => {
         const fragFrags = frag.split("|");
         const key = fragFrags[0];
         return [ key, _.transform(_.drop(fragFrags, 1), (acc, v) => {
            const vFrags = v.split("@");
            if (vFrags[0] == "m") {
               acc.mins = parseFloat(vFrags?.[1] || "");
            } else if (vFrags[0] == "go") {
               acc.global_off_adj = parseFloat(vFrags?.[1] || "");
            } else if (vFrags[0] == "gd") {
               acc.global_def_adj = parseFloat(vFrags?.[1] || "");
            } else if (vFrags[0] == "p") {
               acc.pause = vFrags?.[1] == "1";
            } else if (vFrags[0] == "b") {
               acc.profile = vFrags?.[1] as Profiles | undefined;
            } else if (vFrags[0] == "P") {
               acc.pos = vFrags?.[1];
               acc.name = key; //(if this is set then must be an added player, so also set name)
            }  
         }, {} as PlayerEditModel) ];
      }).fromPairs().value();
   }

   static readonly diagCodeToString: Record<DiagCodes, string> = {
      fr_yearly_bonus: "Fr->Soph bonus",
      yearly_bonus: "Small year-on-year bonus",
      general_txfer_pen: "General transfer penalty",
      undersized_txfer_pen: "Undersized transfer penalty",
      player_gravity_bonus: "Player gravity bonus",
      player_gravity_penalty: "Player gravity penalty",
      better_help_txfer_bonus: "Better help defense bonus",
      share_team_defense: "Shared team defense",
      incorp_prev_season: "Incorporate previous seasons' stats",
      fr_regression: "Freshmen stats are prone to regression",
      switch_usage_ortg_style: "Trade usage for efficiency (style reasons)",
      user_adjustment: "User adjustment",
      average_usage: "Average usage across team",
      switch_usage_ortg_average: "Trade usage for efficiency (after averaging usage)",
      lack_of_playmaking_penalty: "Team penalty because there's a lack of playmaking"
   };
      

   /** Key for storing enough info to rebuild roster from source */
   static getKey(p: IndivStatSet, currTeam: string, currYear: string): string {
      if ((currTeam == p.team) && (currYear == p.year)) {
         return `${p.code}::`;
      } else if (currTeam == p.team) {
         return `${p.code}::${p.year}`;
      } else if (currYear == p.year) {
         return `${p.code}:${p.team}:`;
      } else {
         return `${p.code}:${p.team}:${p.year}`;
      }
   };

   //////////////////////////////////////////////////////////////////////////////

   // Data processing  - main processing pipeline

   static teamBuildingPipeline(
      gender: string, team: string, yearIn: string,
      playerList: Array<IndivStatSet>, transfers: Array<Record<string, TransferModel[]>>,
      offSeasonMode: boolean, evalMode: boolean,
      addedPlayersIn: Record<string, GoodBadOkTriple>, overridesIn: Record<string, PlayerEditModel>, 
      deletedPlayersIn: Record<string, string>, disabledPlayersIn: Record<string, boolean>,
      superSeniorsBack: boolean, alwaysShowBench: boolean,
      avgEff: number,
      frList: Record<string, TeamEditorManualFixModel>
   ): TeamEditorProcessingResults {
      const specialCase = () => { // In "year==All" mode, if 5 players are present from the same selected team, then pick that as the base year
         const specialCaseKey = _.chain(addedPlayersIn)
            .filter(p => p.orig.team == team).map(p => `${p.orig.year}_${p.orig.team}`).countBy().toPairs()
            .filter(countKey => countKey[1] >= 5).value()?.[0]?.[0];
         if (specialCaseKey) {
            return specialCaseKey.split("_")[0];
         } else {
            return yearIn;
         }
      };
      const year = ((yearIn == "All") && (team != "")) ? specialCase() : yearIn;

      const genderYearLookup = `${gender}_${year}`;
      const teamOverrides: TeamEditorManualFixModel = offSeasonMode ?  //(the fixes only apply in off-season mode)
         (TeamEditorManualFixes.fixes(genderYearLookup)[team] || {}) : {};

      //////////////
      
      // Build lots of handy lists

      const [ rawTeamCorrectYear, rawTeamNextYear ] = evalMode ? 
         _.partition(playerList, p => (p.year || "") <= year) : [ playerList, [] ];

      /** Get the base players for what actually transpired, just one year, no transfers, etc */
      const actualResultsForReview = (evalMode ? TeamEditorUtils.getBasePlayers(
         team, DateUtils.getNextYear(year), rawTeamNextYear, false, false, undefined, {}, [], undefined
      ) : []).map(triple => {
         //(warning - mutates triple.org ... shouldn't mess anything else up since the next year's results aren't used anyway)
         triple.orig.code = teamOverrides.codeSwitch?.[triple.orig.code || ""] || triple.orig.code;
         triple.isOnlyActualResults = true; //(starts with true, we'll set to false as we merge with projected results)
         triple.actualResults = triple.orig;
         return triple;
      });
      // Alternative view of the same data
      const actualResultsCodeOrIdSet = _.fromPairs(_.flatMap(actualResultsForReview, triple => {
         return [
         [ triple.orig.key || "", triple ], //key-aka-id, for matching vs manually generated players
         [ triple.orig.code || "", triple ] //code for normal
         ];
      }));

      // In in-season mode we get a list of all players (ignore delete/disable lists since this is what actually happened)
      const inSeasonPlayerResultsList = offSeasonMode ? undefined : TeamEditorUtils.getBasePlayers(
         team, year, rawTeamCorrectYear, offSeasonMode, superSeniorsBack, teamOverrides.superSeniorsReturning, {}, transfers, undefined
      );
      const addedPlayers = (year != yearIn) ? //(we're in special case mode)
         _.omit(addedPlayersIn, (inSeasonPlayerResultsList || []).map(t => t.key + year)) //(key was calculated based on year not yearIn)
            : addedPlayersIn;

      const candidatePlayersList = offSeasonMode ? //(to avoid having to parse the very big players array multiple times)
         rawTeamCorrectYear 
         : 
         _.flatMap(inSeasonPlayerResultsList || [], triple => {
            return [ triple.orig ].concat(triple.prevYear ? [ triple.prevYear ] : []);
         });

      const allDeletedPlayers = _.merge(
         _.fromPairs((teamOverrides.leftTeam || []).map(p => [ p, `code:${p}` ])),
         deletedPlayersIn
      );
      const basePlayers: GoodBadOkTriple[] = TeamEditorUtils.getBasePlayers(
         team, year, candidatePlayersList, offSeasonMode, superSeniorsBack, teamOverrides.superSeniorsReturning, allDeletedPlayers, transfers, undefined
      );
      const redshirtishFr = (_.isEmpty(frList) || _.isEmpty(candidatePlayersList)) 
         ? {} : TeamEditorUtils.addRedShirtishFreshmen(
            team, year, frList, transfers, new Set(basePlayers.map(triple => triple.orig.code || "")), allDeletedPlayers
         ); //(if base players is empty assume it's because we haven't loaded the data yet)

      // Merge team overrides and user overrides
      const allOverrides: Record<string, PlayerEditModel> = 
         _.fromPairs(
            _.chain(teamOverrides.overrides || {}).toPairs().filter(keyVal=> !overridesIn[keyVal[0]]).value()
               .concat(
                  _.toPairs(redshirtishFr)
               ).concat(
                  _.toPairs(overridesIn).map(keyVal => { 
                     //(ugly complication: redshirt-ish Fr look like "hand added" players, but their key is a code, not a human readable name)
                     const maybeRedshirtFr = redshirtishFr[keyVal[0]];
                     if (maybeRedshirtFr) keyVal[1].name = maybeRedshirtFr.name; //(so retrieve the name from the original source)
                     return keyVal;
                  })
               )
         );

      //TODO: (see TeamRosterEditor TODO), this doesn't correctly handle combining overrids on top of "redshirtishFr"
      const unpausedOverrides: Record<string, PlayerEditModel> = 
         _.chain(allOverrides).toPairs().filter(keyVal => !keyVal[1].pause).fromPairs().value();

      const basePlayersPlusHypos = basePlayers.concat(_.values(addedPlayers)).concat(
         _.chain(allOverrides).toPairs().filter(keyVal => !_.isNil(keyVal[1].name)).map(keyVal => { 
            const code = keyVal[0];
            const o = keyVal[1];
            const netScoring = TeamEditorUtils.getBenchLevelScoringByProfile(o.profile);
            const offAdj = (o.global_off_adj || 0);
            const defAdj = (o.global_def_adj || 0);
            const indivStatSet = (adj: number) => { return {
               key: o.name,
               posClass: o.pos,
               off_adj_rapm: { value: offAdj + 0.5*netScoring + adj},
               def_adj_rapm: { value: defAdj + -0.5*netScoring - adj},
               off_team_poss_pct: { value: 0 }
            }; };
            return {
               key: code,
               good: indivStatSet(TeamEditorUtils.optimisticBenchOrFr),
               bad: indivStatSet(-TeamEditorUtils.pessimisticBenchOrFr),
               ok: indivStatSet(0),
               orig: indivStatSet(0),
               manualProfile: o
            } as GoodBadOkTriple;
         }).value()
      ); 
      if (evalMode) basePlayersPlusHypos.forEach(triple => {
         const matchingActual = triple.manualProfile
            ? actualResultsCodeOrIdSet[triple.manualProfile.name || ""]
            : actualResultsCodeOrIdSet[triple.orig.code || ""];

         if (matchingActual) {
            triple.actualResults = matchingActual.orig;
            matchingActual.isOnlyActualResults = false; //(merged actual results and projections)
         }        
      });

      //////////////

      // Most of the math occurs here:

      const [ teamSosNet, teamSosOff, teamSosDef ] = TeamEditorUtils.calcApproxTeamSoS(basePlayers.map(p => p.orig), avgEff);

      const hasDeletedPlayersOrTransfersIn = !_.isEmpty( //(used to decide if we need to recalc all the minutes)
         _.omit(addedPlayers, _.keys(disabledPlayersIn)) // have added transfers in (and they aren't disabled)
      ) || !_.isEmpty(allDeletedPlayers); //(or have deleted players)

      TeamEditorUtils.calcAndInjectYearlyImprovement(
         basePlayersPlusHypos, team, year, teamSosOff, teamSosDef, avgEff, unpausedOverrides, offSeasonMode
      );
      TeamEditorUtils.calcAndInjectMinsAssignment(
         basePlayersPlusHypos, team, year, disabledPlayersIn, unpausedOverrides, hasDeletedPlayersOrTransfersIn, teamSosNet, avgEff, offSeasonMode
      );
      if (offSeasonMode) { //(else not projecting, just describing)
         TeamEditorUtils.calcAdvancedAdjustments(basePlayersPlusHypos, team, year, disabledPlayersIn);
      }

      //////////////

      // Summarize what's happened

      // (can't use minutes annoyingly because that jumps around too much as you filter/unfilter stuff)
      const sortedWithinPosGroup = (triple: GoodBadOkTriple) => {
         return ((evalMode && triple.isOnlyActualResults) ? 10000 : 0) + 
         PositionUtils.posClassToScore(triple.orig.posClass || "") - TeamEditorUtils.getNet(triple.ok);
      };

      // In eval mode, now concat the actual players that we didn't match with
      const playerProjectionsPlusActual = basePlayersPlusHypos.concat(
         evalMode ? 
         actualResultsForReview.filter(triple => triple.isOnlyActualResults) : []
      );

      const rosterGuards = _.sortBy(playerProjectionsPlusActual.filter(triple => {
         return (triple.orig.posClass == "PG") || (triple.orig.posClass == "s-PG") || (triple.orig.posClass == "CG");
      }), sortedWithinPosGroup);
      const filteredRosterGuards = rosterGuards.filter(triple => !triple.isOnlyActualResults && !disabledPlayersIn[triple.key]);
      const rosterGuardMinsPreBench = _.sumBy(filteredRosterGuards, p => p.ok.off_team_poss_pct.value!)*0.2;

      const rosterWings = _.sortBy(playerProjectionsPlusActual.filter(triple => {
         return (triple.orig.posClass == "WG") || (triple.orig.posClass == "WF") || (triple.orig.posClass == "G?");
      }), sortedWithinPosGroup);
      const filteredRosterWings = rosterWings.filter(triple => !triple.isOnlyActualResults && !disabledPlayersIn[triple.key]);
      const rosterWingMinsPreBench = _.sumBy(filteredRosterWings, p => p.ok.off_team_poss_pct.value!)*0.2;

      const rosterBigs = _.sortBy(playerProjectionsPlusActual.filter(triple => {
         return (triple.orig.posClass == "S-PF") || (triple.orig.posClass == "PF/C") || (triple.orig.posClass == "C")
               || (triple.orig.posClass == "F/C?");
      }), sortedWithinPosGroup);
      const filteredRosterBigs = rosterBigs.filter(triple => !triple.isOnlyActualResults && !disabledPlayersIn[triple.key]);
      const rosterBigMinsPreBench = _.sumBy(filteredRosterBigs, p => p.ok.off_team_poss_pct.value!)*0.2;

      //////////////

      // Build bench minutes:

      const [ maybeBenchGuard, maybeBenchWing, maybeBenchBig ] = _.isEmpty(basePlayersPlusHypos) ?
         [ undefined, undefined, undefined ]
         : 
         TeamEditorUtils.getBenchMinutes(
            team, year,
            rosterGuardMinsPreBench, rosterWingMinsPreBench, rosterBigMinsPreBench, 
            unpausedOverrides, alwaysShowBench
         );
      const rosterGuardMins = rosterGuardMinsPreBench + 0.2*(maybeBenchGuard?.ok?.off_team_poss_pct?.value || 0);
      const rosterWingMins = rosterWingMinsPreBench + 0.2*(maybeBenchWing?.ok?.off_team_poss_pct?.value || 0);
      const rosterBigMins = rosterBigMinsPreBench + 0.2*(maybeBenchBig?.ok?.off_team_poss_pct?.value || 0);

      return {
         rosterGuards, rosterGuardMins, maybeBenchGuard,
         rosterWings, rosterWingMins, maybeBenchWing,
         rosterBigs, rosterBigMins, maybeBenchBig,

         inSeasonPlayerResultsList, basePlayersPlusHypos, actualResultsForReview,

         avgEff, allDeletedPlayers, 
         allOverrides, unpausedOverrides
      };
   }

//TODO: also add team totals calcs here

//TODO idea: for pessimistic mode (I think optimistic is optimistic enough?!) recalc the minutes using the worst case 
// RAPMs, which will allow the better players to take more minutes and hopefully narrow the gap with the normal

   //////////////////////////////////////////////////////////////////////////////

   // Data processing  - middle level

   //TODO: is there some way I can take walk-ons out the equation but use the roster info to list "guys that don't play much"
   // (ignoring anyone who isn't a Fr, will get rid of some of them, but not Fr walk-ons.... really need the *s)

   /** Handy utility to fill in all the details for addedPlayers (eg hypothetical transfers) */
   static fillInAddedPlayers(
      team: string, year: string,
      addedPlayersParam: string, playerList: IndivStatSet[], prevYearTransfers: Record<string, TransferModel[]>,
      offSeasonMode: boolean, superSeniorsBack: boolean
   ): Record<string, GoodBadOkTriple> {
      const playerTeamYear = (key: string) => {
        const frags = key.split(":");
        return [ frags[0], frags[1] || team, frags[2] || year ] as [ string, string, string ];
      };
      const keyList = addedPlayersParam.split(";");
      const codeSet = new Set(keyList.map(k => playerTeamYear(k)[0]));
      const maybeMatchingPlayers = _.filter(playerList, p => codeSet.has(p.code || "") && ((p.year || "") <= year));
      const maybeMatchingPlayersByCode = _.groupBy(maybeMatchingPlayers, p => p.code);

      const firstAddedPlayers = _.chain(keyList).flatMap(key => {
        const [ code, txferTeam, txferYear ] = playerTeamYear(key);

        return TeamEditorUtils.getBasePlayers(
          team, year, maybeMatchingPlayersByCode[code] || [], 
          offSeasonMode, superSeniorsBack, undefined, {}, 
          // Build a transfer set explicitly for this player
          [ { [code]: [ { f: txferTeam, t: team } ] } , prevYearTransfers ], txferYear
        );
      }).map(triple => [ triple.key, triple ]).fromPairs().value();    

      return firstAddedPlayers;
   };

   /** Pulls out the players from the designated team */
   static getBasePlayers(
      team: string, year: string, players: IndivStatSet[], 
      offSeasonMode: boolean, includeSuperSeniors: boolean, superSeniorsReturning: Set<string> | undefined, mutableExcludeSet: Record<string, string>, 
      transfers: Record<string, Array<TransferModel>>[], transferYearOverride: string | undefined
   ): GoodBadOkTriple[] {
      if ((year == "All") && !transferYearOverride) { // There's no benefit in showing N seasons of a given team, easier just to add them manually
         //TODO: once we have a set of "addedPlayers" set up, can infer year from the most common, eg if there's 5+ from the same year?
         return [];
      }

      const transfersThisYear = transfers[0] || {};
      const transfersLastYear = transfers[1] || {};
      const transfersOnly = transferYearOverride != undefined;

      const getMaybeDoubleTransfer = (code: string, maybeP: IndivStatSet) => {
         return _.find( //Transferred to Y 2 years ago then from Y to here (T say)
            // Example: transfers[0] = {p1: { f:X t:Y }}, transfers[1] = { p1: {f:X t:T }},
            // players: [ { code: p1, team: X }, { code: p1, team: Y } ]
            transfersLastYear[code] || [], txfer => {
               return (txfer.f == maybeP.team) &&
                  _.some(transfersThisYear[code] || [], txfer2 => (txfer.t == txfer2.f) && (txfer2.t == team));
            }
         ); //(note the purpose of doubleTransfer is to match up last year's player with this year's triple)
      };

      const fromBaseRoster = _.transform(players, (acc, p) => {
         const yearAdj = (year == "All") ? //(for building all star teams)
            p.year : 
            (transferYearOverride && (year != transferYearOverride)) ? transferYearOverride : ""; 

         const isRightYear = (transferYearOverride ? (p.year == transferYearOverride) : (p.year == year));

         const code = (p.code || "");
         const dupCode = code + yearAdj;
         const isTransfer = p.team != team;
         const key = isTransfer ? `${code}:${p.team}:${yearAdj}` : `${code}::${yearAdj}`;
         
         const isOnTeam = !transfersOnly && !isTransfer;
         const transferringIn = (transfersOnly || offSeasonMode) && _.some(
            transfersThisYear[code] || [], txfer => (txfer.f == p.team) && (txfer.t == team)
         );
         const isTransferringOut = _.some(transfersThisYear[code] || [], p => p.f == team)
         const wasPlayerTxferLastYear = _.some(
            transfersLastYear[code] || [], txfer => (txfer.f == p.team) && (txfer.t == team)
         );
         const doubleTransfer = getMaybeDoubleTransfer(code, p);
         const isNotLeaving = (transferringIn || !offSeasonMode || (           
            (includeSuperSeniors || (p.roster?.year_class != "Sr") || (superSeniorsReturning?.has(key)))
               && !isTransferringOut
         ));
         const onTeam = (isOnTeam || wasPlayerTxferLastYear);
         const notOnExcludeList = !mutableExcludeSet[key];
         if (!notOnExcludeList) {
            mutableExcludeSet[key] = p.key; //(fill this in with the name of the player for display purposes)
         }

         //Diagnostic:
         //if (p.code == "PlayerCode") console.log(`? ${p.year} ${doubleTransfer} ${transferringIn} ${onTeam} ${notOnExcludeList} ${isNotLeaving} ${isRightYear}  `)

         if ((doubleTransfer || transferringIn || onTeam) && notOnExcludeList) {
            if (isNotLeaving && isRightYear && !acc.dups[dupCode]) {
               acc.retVal = acc.retVal.concat([{
                  key: key,
                  good: _.clone(p),
                  ok: _.clone(p),
                  bad: _.clone(p),
                  orig: p
               }]);
               acc.dups[dupCode] = true; 
            } else if (!isRightYear) { //(must be previous year)     
               const lastYearKey = wasPlayerTxferLastYear  ? `${code}::${yearAdj}` : 
                  (doubleTransfer ? `${code}:${doubleTransfer.t || ""}:${yearAdj}` : key);

               acc.prevYears[lastYearKey] = p;
            } else if (!isNotLeaving) { // mark the dup so know we've seen this player when checking "unmatched prev years" 
               acc.dups[dupCode] = true;
            }
         }
      }, { 
         retVal: [] as GoodBadOkTriple[], 
         dups: {} as Record<string, boolean>, 
         prevYears: {} as Record<string, IndivStatSet>,
         inAndLeaving: {} as Record<string, boolean> //(not filled in because we can't account for early departures)
      });

      const injectPrevYearsIntoBaseRoster: Array<GoodBadOkTriple> = 
         fromBaseRoster.retVal.map(triple => {
            const matchingPrevYear = fromBaseRoster.prevYears[triple.key];
            if (matchingPrevYear) {
               // remove from (unmatched) prevYears list
               delete fromBaseRoster.prevYears[triple.key];
            }
            return { ...triple, prevYear: matchingPrevYear };
         }).filter(triple => { // Filter out players who were already super seniors, if in offSeasonMode (else this is descriptive)
            return !offSeasonMode || (!triple.prevYear || 
               ((triple.prevYear.roster?.year_class != "Sr") || superSeniorsReturning?.has(triple.key)) //(manual override trumps that though)
            );
         });

      // Now find players who aren't the right year:
      const unmatchedPrevYearsToAdd: Array<GoodBadOkTriple> = _.flatMap(fromBaseRoster.prevYears, (p, key) => {

         if (offSeasonMode) { //might still be playing this season
            const code = p.code || "";
            const yearClass = p.roster?.year_class || "??";

            // If they transferred in _this_ year then they are definitely playing
            const transferringIn = !mutableExcludeSet[key] && (_.some(
               transfersThisYear[code] || [], txfer => (txfer.f == p.team) && (txfer.t == team)
            ) || !_.isNil(getMaybeDoubleTransfer(code, p)));

            const left = fromBaseRoster.inAndLeaving[key] || false;
            const transferredOut = 
               _.some(transfersLastYear[code] || [], p => p.f == team) ||
               _.some(transfersThisYear[code] || [], p => p.f == team);

            const transferringInLastYear = !left && !transferredOut && !mutableExcludeSet[key] && (_.some(
               transfersLastYear[code] || [], txfer => (txfer.f == p.team) && (txfer.t == team)
            ) && ((yearClass != "Sr") || includeSuperSeniors || superSeniorsReturning?.has(key)));

            const keyFrags = key.split(":");
            const dupCode = keyFrags[0] + (keyFrags?.[2] || "");
               //(will check we haven't seen and discard this year's version of this player)

            // There could be other cases (eg was injured a year, now back, but it's hard to tell ...
            // especially because of early NBA departures, so we'll just ignore and you can add them by hand)
            // const agedOut = (p.roster?.year_class == "Fr") || (p.roster?.year_class == "So")
            //    || (includeSuperSeniors && (p.roster?.year_class == "Jr"));
            // (inAndLeaving was defined as "(isOnTeam || wasPlayerTxferLastYear) && !isNotLeaving")

            return (!fromBaseRoster.dups[dupCode] && (transferringIn || transferringInLastYear)) ? [{
               key: key,
               good: _.clone(p),
               ok: _.clone(p),
               bad: _.clone(p),
               orig: p
            }] : [];
         } else {
            return [];
         }
      });

      return injectPrevYearsIntoBaseRoster.concat(unmatchedPrevYearsToAdd);
   }

   /** Add red-shirt-ish Fr, including transfers */
   static addRedShirtishFreshmen(
      team: string, year: string, 
      frList: Record<string, TeamEditorManualFixModel>, //(indexed by team) 
      transfers: Record<string, Array<TransferModel>>[], 
      dupCodes: Set<string>, 
      deletedCodes: Record<string, string>
   ): Record<string, PlayerEditModel> {
      return _.chain(frList).flatMap((fr, frTeam) => {
         if (team == frTeam) {
            return _.flatMap(fr.overrides || {}, (info, key) => {
               // Previous season ... if you didn't play 1 season ago and didn't transfer
               if (!dupCodes.has(key) && !deletedCodes[key] && //(key is code for inserted Fr)
                  !dupCodes.has(`${key}::`) && !deletedCodes[`${key}::`] && //(can occur with either key or code)
                   !_.some(transfers[0]?.[key] || [], p => p.f == team)
               ) {
                  return [ [ key, info ]  ];
               } else {
                  return [];
               }
            });
         } else {
            return _.flatMap(fr.overrides || {}, (info, key) => {
               // Transfers in
               if (!dupCodes.has(key) && !deletedCodes[key] && //(key is code for inserted Fr)
                  !dupCodes.has(`${key}::`) && !deletedCodes[`${key}::`] && //(can occur with either key or code)
                  _.some(transfers[0]?.[key] || [], p => p.t == team)
               ) {
                  return [ [ key, info ]  ];
               } else {
                  return [];
               }
            });
         }
      }).fromPairs().value();
   }

   /** Give players their year-on-year improvement */
   static calcAndInjectYearlyImprovement(
      roster: GoodBadOkTriple[], 
      team: string, year: string, teamSosOff: number, teamSosDef: number, avgEff: number,
      overrides: Record<string, PlayerEditModel>, 
      offSeasonMode: boolean
   ) {
      /** Handy a util to make the diagnostics mode a bit more readable */
      const tidy = (inJson: TeamEditorDiagObject) => {
         const keys = _.keys(inJson) as DiagCodes[];
         keys.forEach(key => {
            if (!inJson[key]) delete inJson[key];
         });
         return inJson;
      };
      const calcBasicAdjustments = (
         basePlayer: IndivStatSet, basePlayerPrevYear: IndivStatSet | undefined, override: PlayerEditModel | undefined
      ) => {
         const isFr = (basePlayer.roster?.year_class == "Fr") && _.isNil(basePlayerPrevYear); //(filter out "fake Freshmen")

         const avgOffBump = 0.6; //(1.5 ORtg + 1 usage - the bump for staying in the same team)
         const offClassMulti = isFr ? 2 : 1;

         // Calculate ORtg adjustment from delta projection: 0.2*((ORtg*(avgEff/teamSosDef) - avgEff)
         const offAdjToORtg = (offAdj: number) => {
            return (5*offAdj)*(teamSosDef/avgEff);
         };

         // Useuable for defense and offense
         const maybeLevelJump = (basePlayer.team != team) ? TeamEditorUtils.getJumpInLevel(basePlayer.team || "", team, year) : 0;

         // Offensive bonuses and penalties (+ == good)

         //(specific to transferring up as a shorter player)
         const defSosDeltaForTxfers = teamSosDef - (basePlayer.def_adj_opp?.value || (avgEff - 4));
         const offLevelJump = _.isNil(maybeLevelJump) ? ((defSosDeltaForTxfers < -4) ? 2 : 0) : maybeLevelJump;
         const offHeightPenaltyFactor = (offLevelJump == 1) ? 0.5 : (offLevelJump >= 2 ? 1.0 : 0);
         const offTxferUpPenalty = (offHeightPenaltyFactor > 0) ? -1*offHeightPenaltyFactor*TeamEditorUtils.calcTxferUpHeightEffDrop(basePlayer) : 0

         const generalTxferOffPenalty = (basePlayer.team != team) ? avgOffBump : 0; //(just the fact that you might not get quite the same off-season bump as a transfer)

         // Adj delta assumes the usage goes to good use, then RAPM adjusts off that. But maybe with a new team, the RAPM will
         const rapmVsAdjOffDelta = 0.5*(((basePlayer as PureStatSet).off_adj_rapm?.value || 0) - (basePlayer.off_adj_rtg?.value || 0));
         const rapmVsAdjOffDeltaGoodBonus = rapmVsAdjOffDelta < 0 ? Math.abs(rapmVsAdjOffDelta) : 0; 
            //if they under-performed their rating then optimistically maybe on this team they will under-perform less
         const rapmVsAdjOffDeltaBadPenalty = rapmVsAdjOffDelta > 0 ? Math.abs(rapmVsAdjOffDelta) : 0;
            //if they over-performed their rating then optimistically maybe on this team they will out-perform less

         // Defensive bonuses and penalties (- == good)

         const avgDefBump = -0.6; //(just make the same as the offensive bump, I don't believe there is any data)
         const defClassMulti = isFr ? 2 : 0.5; //(I'm going to assert without evidence the Fr bump for defense is relatively bigger)

         //TODO: Want to do a better job of this, but for now we'll heavily limit how bad up-transfers defense can be
         //TODO: (I'd like to try to calculate some sort of baseline for last year's team and what's returning and use that)
         const offSosDeltaForTxfers = teamSosOff - (basePlayer.off_adj_opp?.value || (avgEff + 4));
         const defLevelJump = _.isNil(maybeLevelJump) ? ((offSosDeltaForTxfers > 4) ? 2 : 0) : maybeLevelJump;
         //(basically the idea here is that if a transfer gets taken by a high major, their defense probably isn't unplayably bad,
         // and if RAPM says it is, then it's likely a team-effect vs a player-effect)
         const minDefAdj = (defLevelJump >= 3) ? 1 : ((defLevelJump >= 2) ? 0.75 : 0); //(the bigger the jump, the worse we'll allow the defender to be, numbers are pretty arbitrary)
         const minDef = -TeamEditorUtils.getBenchLevelScoring(team, year) + minDefAdj;
         const currDef = TeamEditorUtils.getDef(basePlayer);
         const adjustedCurrDef = currDef - ((defLevelJump >= 2) ? 0.5 : 0); //(bonus help defense for players coming up from low majors)
         const defTxferUpBetterHelpBump = (
            ((adjustedCurrDef > minDef) && (defLevelJump >= 2)) ? minDef : adjustedCurrDef
         ) - currDef;
         //(end ugly heuristic defense adjustment)

         const defHeightPenaltyFactor = (defLevelJump == 1) ? 0.75 : (defLevelJump >= 2 ? 1.0 : 0);
         const defTxferUpPenalty = (defHeightPenaltyFactor > 0) ? defHeightPenaltyFactor*TeamEditorUtils.calcTxferUpHeightEffDrop(basePlayer) : 0;

         const defTxferMulti = isFr ? 1 : 0.5; //(you get a bigger jump as a Fr, see defClassMulti)
         const generalTxferDefPenalty = (basePlayer.team != team) ? defTxferMulti*avgDefBump : 0; //(just the fact that you might not get quite the same off-season bump as a transfer)

         const yearlyBonusField: DiagCodes = isFr ? "fr_yearly_bonus" : "yearly_bonus";
         const diags: TeamEditorDiags = {
            // These are just for display
            off_rtg: {
               good: tidy({
                  [yearlyBonusField]: 2*offClassMulti*1.5, //(TODO calc these better)
                  user_adjustment: offAdjToORtg(override?.global_off_adj || 0),
                  undersized_txfer_pen: offAdjToORtg(-0.5*offTxferUpPenalty),
               }),
               ok: tidy({
                  [yearlyBonusField]: offClassMulti*1.5, //(TODO calc these better)
                  user_adjustment: offAdjToORtg(override?.global_off_adj || 0),
                  undersized_txfer_pen: offAdjToORtg(-0.75*offTxferUpPenalty),
                  general_txfer_pen: offAdjToORtg(-0.5*generalTxferOffPenalty),
               }),
               bad: tidy({
                  user_adjustment: offAdjToORtg(override?.global_off_adj || 0),
                  undersized_txfer_pen: offAdjToORtg(-offTxferUpPenalty),
                  general_txfer_pen: offAdjToORtg(-generalTxferOffPenalty),
               }),
            },
            off_usage: {
               good: tidy({
                  [yearlyBonusField]: 2*offClassMulti*1
               }),
               ok: tidy({
                  [yearlyBonusField]: offClassMulti*1
               }),
               bad: tidy({
               }),
            },
            // These are the main fields
            off: {
               good: tidy({
                  [yearlyBonusField]: 2*offClassMulti*avgOffBump,
                  undersized_txfer_pen: -0.5*offTxferUpPenalty,
                  player_gravity_bonus: rapmVsAdjOffDeltaGoodBonus,
                  user_adjustment: override?.global_off_adj || 0,
               }), 
               ok: tidy({
                  [yearlyBonusField]: offClassMulti*avgOffBump,
                  undersized_txfer_pen: -0.75*offTxferUpPenalty,
                  general_txfer_pen: -0.5*generalTxferOffPenalty,
                  user_adjustment: override?.global_off_adj || 0,
               }),
               bad: tidy({
                  undersized_txfer_pen: -offTxferUpPenalty,
                  general_txfer_pen: -generalTxferOffPenalty,
                  player_gravity_penalty: -rapmVsAdjOffDeltaBadPenalty,
                  user_adjustment: override?.global_off_adj || 0,
               })
            },
            def: {
               good: tidy({
                  [yearlyBonusField]: 2*defClassMulti*avgDefBump,
                  better_help_txfer_bonus: defTxferUpBetterHelpBump,
                  undersized_txfer_pen: -0.5*defTxferUpPenalty,
                  user_adjustment: override?.global_def_adj || 0,
               }),
               ok: tidy({
                  [yearlyBonusField]: defClassMulti*avgDefBump,
                  better_help_txfer_bonus: defTxferUpBetterHelpBump,
                  undersized_txfer_pen: -0.75*defTxferUpPenalty,
                  general_txfer_pen: -0.5*generalTxferDefPenalty,
                  user_adjustment: override?.global_def_adj || 0,
               }),
               bad: tidy({
                  undersized_txfer_pen: -defTxferUpPenalty,
                  general_txfer_pen: -generalTxferDefPenalty,
                  user_adjustment: override?.global_def_adj || 0,
               })
            }
         };
         return diags;
      };
      const applyFrRegression = (
         player: IndivStatSet, 
      ) => {
         const netRegressTo = TeamEditorUtils.getAvgProduction(team, player.year || "");

         const regressedOffRapm = 0.75*((player as PureStatSet).off_adj_rapm?.value || 0) + 0.25*(netRegressTo*0.5)
         const regressedDefRapm = 0.75*((player as PureStatSet).def_adj_rapm?.value || 0) + 0.25*(netRegressTo*0.5)

         // Only apply if negative, and not to optimistic result
         const deltaOffRapm = regressedOffRapm - ((player as PureStatSet).off_adj_rapm?.value || 0);
         const deltaDefRapm = regressedDefRapm - ((player as PureStatSet).def_adj_rapm?.value || 0);

         // Diagnostic
         // console.log(`[${player.key}]: reg=[${regressedOffRapm.toFixed(1)},${regressedDefRapm.toFixed(1)}], ` +
         //    `act=[${((player as PureStatSet).off_adj_rapm?.value || 0)},${((player as PureStatSet).def_adj_rapm?.value || 0)}] (${netRegressTo})`);

         return {
            off_rtg: { good: {}, bad: {}, ok: {} },
            off_usage: { good: {}, bad: {}, ok: {} },
            off: { 
               good: {},
               ok: tidy({
                  fr_regression: deltaOffRapm < 0 ? 0.5*deltaOffRapm : 0
               }),
               bad: tidy({
                  fr_regression: deltaOffRapm < 0 ? deltaOffRapm : 0
               }),
            },
            def: { 
               good: {},
               ok: tidy({
                  fr_regression: deltaDefRapm > 0 ? 0.5*deltaDefRapm : 0
               }),
               bad: tidy({
                  fr_regression: deltaDefRapm > 0 ? deltaDefRapm : 0
               }),
            }      
         };
      };

      const applyRegression = (
         player: PureStatSet, prevYear: IndivStatSet, adjPrevYear: PureStatSet
      ) => {
         const thisYearPossWeighted = (player.off_poss?.value || 0)*3; // 3:1
         const lastYearPossWeightedTmp = (prevYear.off_poss?.value || 0);

         const lastYearPossWeighted = Math.min(lastYearPossWeightedTmp, 0.40*thisYearPossWeighted); 
            //(as much weight as we'll allow last season)

         const thisYearDefSos = (player.def_adj_opp?.value || 100);
         const lastYearDefSos = (player.prevYear?.value || 100);
         const thisYearNormalizer = teamSosDef/thisYearDefSos;
         const lastYearNormalizer = teamSosDef/lastYearDefSos;

         const totalWeightInv = 1.0/((thisYearPossWeighted + lastYearPossWeighted) || 1);
         const thisYearWeight = thisYearPossWeighted*totalWeightInv;
         const lastYearWeight = lastYearPossWeighted*totalWeightInv;

         const regressedORtg = thisYearWeight*(player.off_rtg?.value || 0)*thisYearNormalizer + lastYearWeight*(adjPrevYear.off_rtg?.value || 0)*lastYearNormalizer;
         const regressedUsage = thisYearWeight*(player.off_usage?.value || 0) + lastYearWeight*(adjPrevYear.off_usage?.value || 0);

         const regressedOffRapm = thisYearWeight*(player.off_adj_rapm?.value || 0) + lastYearWeight*(adjPrevYear.off_adj_rapm?.value || 0);
         const regressedDefRapm = thisYearWeight*(player.def_adj_rapm?.value || 0) + lastYearWeight*(adjPrevYear.def_adj_rapm?.value || 0);

         const deltaORtg = regressedORtg - (player.off_rtg?.value || 0); //(only incorporate the 2 if they were better)
         const deltaUsg = regressedUsage - (player.off_usage?.value || 0);
         const deltaOffRapm = regressedOffRapm - (player.off_adj_rapm?.value || 0);
         const deltaDefRapm = regressedDefRapm - (player.def_adj_rapm?.value || 0);
         const lastYearWasFr = (prevYear.roster?.year_class == "Fr");

         // Diagnostics
         //console.log(`[${player.key}]: ([${player.off_rtg?.value}]*[${thisYearWeight}] + [${adjPrevYear.off_rtg?.value}]*[${lastYearWeight}])`);

         return {
            off_rtg: {
               good: tidy({
                  incorp_prev_season: (deltaOffRapm > 0) ? deltaORtg : 0 //if it's good
               }),
               ok: tidy({
                  incorp_prev_season: (!lastYearWasFr || (deltaOffRapm > 0)) ? deltaORtg : 0 //(for Fr - only if it's good)
               }),
               bad: tidy({
                  incorp_prev_season: !lastYearWasFr && (deltaOffRapm < 0) ? deltaORtg : 0 //(only if it's bad, not Fr)
               }),
            },
            off_usage: {
               good: tidy({
                  incorp_prev_season: (deltaOffRapm > 0) ? deltaUsg : 0 //if it's good
               }),
               ok: tidy({
                  incorp_prev_season: (!lastYearWasFr || (deltaOffRapm > 0)) ? deltaUsg : 0 //(for Fr - only if it's good)
               }),
               bad: tidy({
                  incorp_prev_season: !lastYearWasFr && (deltaOffRapm < 0) ? deltaUsg : 0 //(only if it's bad, not Fr)
               }),
            },
            off: {
               good: tidy({
                  incorp_prev_season: (deltaOffRapm > 0) ? deltaOffRapm : 0 //if it's good
               }),
               ok: tidy({
                  incorp_prev_season: (!lastYearWasFr || (deltaOffRapm > 0)) ? deltaOffRapm : 0 //(for Fr - only if it's good)
               }),
               bad: tidy({
                  incorp_prev_season: !lastYearWasFr && (deltaOffRapm < 0) ? deltaOffRapm : 0 //(only if it's bad, not Fr)
               }),
            },
            def: {
               good: tidy({
                  incorp_prev_season: (deltaDefRapm > 0) ? deltaDefRapm : 0 //if it's good
               }),
               ok: tidy({
                  incorp_prev_season: (!lastYearWasFr || (deltaDefRapm > 0)) ? deltaDefRapm : 0 //(for Fr - only if it's good)
               }),
               bad: tidy({
                  incorp_prev_season: !lastYearWasFr && (deltaDefRapm < 0) ? deltaDefRapm : 0 //(only if it's bad, not Fr)
               }),
            },
         }
      };

      /** Balance ORtg and usage somewhat - this is really just for display */
      const balanceORtgAndUsage = (triple: GoodBadOkTriple) => {
         const handleScenario = (proj: "good" | "bad" | "ok", dataSource: PureStatSet) => {
            const usage = dataSource.off_usage?.value || 0.20;
            const ortg = dataSource.off_rtg?.value || 0.20;
            // Diagnostics
            //console.log(`?? [${triple.key}][${proj}] - usg=${usage} rtg=${ortg}`);            

            if ((usage > 0.25) && (ortg < 110)) {
               // Scenario 1: Heavy usage (>25%), not superstar efficiency (ORtg < 110), try shot selection
               // aim for 24, assume we'll get 2/3rds of the way there
               const deltaUsage = -(usage - 0.24)*0.66;
               const deltaORtg = RatingUtils.adjustORtgForUsageDelta(ortg, usage, deltaUsage) - ortg;
               // Diagnostics
               //console.log(`?? [${triple.key}][${proj}] - Delta usg=${deltaUsage} rtg=${deltaORtg}`);            
               return [ deltaORtg, deltaUsage ];
            } else if ((ortg < 90) && (usage > 0.10)) {
               // Scenario 2: Your ORtg is so bad that you'll lower your usage as low as it will go to get back to 90
               const deltaUsage = -(usage - 0.10)*0.66;
               const deltaORtg = RatingUtils.adjustORtgForUsageDelta(ortg, usage, deltaUsage) - ortg;
               return [ deltaORtg, deltaUsage ];
            } else if ((usage > 0.21) && (usage < 0.25) && (ortg < 98)) {
               // Scenario 3: the search for 100!
               const deltaUsage = -(usage - 0.19)*0.80; //(will go all the way down to 19)
               const deltaORtg = RatingUtils.adjustORtgForUsageDelta(ortg, usage, deltaUsage) - ortg;            
               return [ deltaORtg, deltaUsage ];
            } 
            return [ 0, 0 ];
         }
         const [ goodDeltaORtg, goodDeltaUsg ] = handleScenario("good", triple.good);
         const [ okDeltaORtg, okDeltaUsg ] = handleScenario("ok", triple.ok);
         const [ badDeltaORtg, badDeltaUsg ] = handleScenario("bad", triple.bad);
         return {
            off_rtg: {
               good: tidy({
                  switch_usage_ortg_style: goodDeltaORtg
               }),
               ok: tidy({
                  switch_usage_ortg_style: okDeltaORtg
               }),
               bad: tidy({
                  switch_usage_ortg_style: badDeltaORtg
               }),
            },
            off_usage: {
               good: tidy({
                  switch_usage_ortg_style: goodDeltaUsg*100
               }),
               ok: tidy({
                  switch_usage_ortg_style: okDeltaUsg*100
               }),
               bad: tidy({
                  switch_usage_ortg_style: badDeltaUsg*100
               }),
            },
            off: { good: {}, ok: {}, bad: {} },
            def: { good: {}, ok: {}, bad: {} },
         };
      }

      // Now apply the above rules

      const applyDiagsToBase = (proj: "good" | "bad" | "ok", 
         diags: TeamEditorDiags, mutableTarget: PureStatSet, basePlayer: PureStatSet, applySos: boolean,
         filter: Set<DiagCodes> | undefined
      ) => {
         // (These 2 are just for display) 
         const thisYearDefSos = applySos ? (basePlayer.def_adj_opp?.value || 100) : teamSosDef; //(For ORtg, need to take SoS into account)
         const sumOffRtg = _.chain(diags.off_rtg[proj]).filter((value, key) => !filter || filter.has(key as DiagCodes)).sum().value();
         mutableTarget.off_rtg = TeamEditorUtils.addToVal(basePlayer.off_rtg, sumOffRtg, applySos ? (teamSosDef/thisYearDefSos) : 1.0)!;
         const sumOffUsage = 0.01*_.chain(diags.off_usage[proj]).filter((value, key) => !filter || filter.has(key as DiagCodes)).sum().value();
         mutableTarget.off_usage = TeamEditorUtils.addToVal(basePlayer.off_usage, sumOffUsage)!;

         const sumOffAdj = _.chain(diags.off[proj]).filter((value, key) => !filter || filter.has(key as DiagCodes)).sum().value();
         mutableTarget.off_adj_rtg = TeamEditorUtils.addToVal(basePlayer.off_adj_rtg, sumOffAdj)!;
         mutableTarget.off_adj_rapm = TeamEditorUtils.addToVal(basePlayer.off_adj_rapm, sumOffAdj)!;
         const sumDefAdj = _.chain(diags.def[proj]).filter((value, key) => !filter || filter.has(key as DiagCodes)).sum().value();
         mutableTarget.def_adj_rtg = TeamEditorUtils.addToVal(basePlayer.def_adj_rtg, sumDefAdj)!;
         mutableTarget.def_adj_rapm = TeamEditorUtils.addToVal(basePlayer.def_adj_rapm, sumDefAdj)!;
      }


      roster.filter(t => !t.manualProfile).forEach(triple => {
         // Calculate previous player improvement for regression
         const prevPlayerDiags = triple.prevYear ? calcBasicAdjustments(triple.prevYear, undefined, undefined) : undefined;
         const prevPlayerYearlyAdjustment = {};
         if (prevPlayerDiags && triple.prevYear && offSeasonMode) {
            applyDiagsToBase("ok", 
               prevPlayerDiags, prevPlayerYearlyAdjustment, triple.prevYear, true,
               new Set([ "fr_yearly_bonus", "yearly_bonus" ] as DiagCodes[])
            );
         };
         const isFr = (triple.orig.roster?.year_class == "Fr"); //("fake Freshmen" already handled by 1st clause)
         const regressionDeltas = triple.prevYear ? 
            applyRegression(triple.orig, triple.prevYear, prevPlayerYearlyAdjustment) : 
               (isFr ? applyFrRegression(triple.orig) : undefined);

         // Diagnostics
         //console.log(`[${triple.key}] ? [${triple.prevYear}]:  ${JSON.stringify(regressionDeltas)} AND ${JSON.stringify(prevPlayerYearlyAdjustment)}`);

         // Calculate other adjustments on top of the regressed data

         const maybeOverride = overrides[triple.key];
         const playerDiags = calcBasicAdjustments(triple.orig, triple.prevYear, maybeOverride);
         triple.diag = (regressionDeltas && offSeasonMode) ? _.merge(playerDiags, regressionDeltas) : playerDiags;
         ([ "good", "bad", "ok" ] as ("good" | "bad" | "ok")[]).forEach(proj => {
            applyDiagsToBase(
               proj, playerDiags, triple[proj], triple.orig, true, 
               offSeasonMode ? undefined : new Set<DiagCodes>([ "user_adjustment" ])
            )
         });
         // Now we have calculated the ORtg/usage corresponding to the RAPM, balance it to look better
         if (offSeasonMode) {
            const balanceORtgDiag = balanceORtgAndUsage(triple) as TeamEditorDiags;
            ([ "good", "bad", "ok" ] as ("good" | "bad" | "ok")[]).forEach(proj => {
               applyDiagsToBase(proj, balanceORtgDiag, triple[proj], triple[proj], false, // <- already applied it
                  new Set<DiagCodes>([ "switch_usage_ortg_style" ]))
            });
            triple.diag = _.merge(triple.diag, balanceORtgDiag);
         }
      });
      //TODO: turn the adjustment into an ORtg/usage delta for "OK" tier (add off_ortg and off_usg)
   }

   /** More advanced calculations that require the minutes adjustments */
   static calcAdvancedAdjustments(
      roster: GoodBadOkTriple[], 
      team: string, year: string, disabledPlayers: Record<string, boolean>
   ) {
      // Team defense adjustments ... approx 3/10ths of defense is help defense not involving the player
      // so we'll average that out, but allow players to keep their individual impact, which we'll define as the delta
      // between def_rapm and def_adj_rtg.old_value (very approximate!)
   
      // ends up giving a team-wide 30% bonus/penalty to the average RAPM-adjusted defense delta

      const filteredRoster = roster.filter(p => !disabledPlayers[p.key]);

      const shareTeamDefense = (proj: "good" | "bad" | "ok") => {

         const avDefense = 0.2*_.sumBy(filteredRoster, p => {
            const defToUse = ((_.isNil((p[proj] as PureStatSet).def_adj_rapm?.value) ? 
               p[proj].def_adj_rtg?.value : (p[proj] as PureStatSet).def_adj_rapm?.value) || 0
            );
            return defToUse*(p[proj].def_team_poss_pct?.value || 0);
         });

         filteredRoster.filter(t => !t.manualProfile).forEach(p => {
            const defense = ((_.isNil((p[proj] as PureStatSet).def_adj_rapm?.value) ? 
               p[proj].def_adj_rtg?.value : (p[proj] as PureStatSet).def_adj_rapm?.value) || 0
            );
            const indivAdj = defense - ((!_.isNil(p[proj].def_adj_rtg?.old_value) ? 
               p[proj].def_adj_rtg?.old_value : p[proj].def_adj_rtg?.value) || 0
            );
            const adjDefense = 0.7*(defense - indivAdj) + 0.3*avDefense + indivAdj;
            const defAdjustment = adjDefense - defense;

            p[proj].def_adj_rtg = TeamEditorUtils.addToVal((p[proj] as PureStatSet).def_adj_rtg, defAdjustment)!;
            p[proj].def_adj_rapm = TeamEditorUtils.addToVal((p[proj] as PureStatSet).def_adj_rapm, defAdjustment); 

            if (p.diag) {
               // More debugging:
               //console.log(`[${p.key}][${proj}]: def=[${defense.toFixed(3)}] indiv=[${indivAdj.toFixed(3)}] approx_team=[${(defense - indivAdj).toFixed(3)}] adjDef=[${adjDefense.toFixed(3)}]: delta=[${defAdjustment.toFixed(3)}] (av=[${avDefense.toFixed(3)}])`);

               p.diag.def[proj]["share_team_defense"] = defAdjustment;
            }
         });
      };

      const balanceUsage = (proj: "good" | "bad" | "ok") => {
         const newPlayerAndBenchUsage = 0.18;

         const usgInfo = _.transform(roster, (acc, triple) => {

            const indivStatSet = (triple[proj] as PureStatSet);

            const mins = indivStatSet.off_team_poss_pct?.value || 0;
            const usg = (indivStatSet.off_usage?.value || newPlayerAndBenchUsage); // (Fr-ish get a baseline of 0.18)

            acc.minUsgSum += mins*usg;
            acc.minSum += mins;

            // const tripleOk = (triple.ok as PureStatSet)
            // indivStatSet.off_adj_rapm = {  value: (indivStatSet.off_adj_rapm?.value || 0) - 0.25*1.58 }

         }, { minUsgSum: 0, minSum: 0 });

         const benchMins = Math.max(5 - usgInfo.minSum, 0);
         const totalMins = usgInfo.minSum + benchMins;
         const minUsgSumIncBench = usgInfo.minUsgSum + benchMins*newPlayerAndBenchUsage;

         const weightedUsg = (minUsgSumIncBench/totalMins);
         const deltaUsg = 0.20 - weightedUsg;

         //Debugging
         //console.log(`AVG_USG [${proj}] = ${weightedUsg.toFixed(4)} .. player_mins[${usgInfo.minSum.toFixed(2)}] total=[${totalMins}]`)

         const applyPlaymakingPenalty = (proj != "good") && (deltaUsg > 0);

         // In all cases want to fix the usg/org
         if (deltaUsg != 0) roster.forEach(triple => {
            const indivStatSet = (triple[proj] as PureStatSet);
            const oRtgAdjustment = applyPlaymakingPenalty ? -deltaUsg*100 : 0; 
               //Arbitrary: 1 pt of ORtg per player per % of usage below 20

            if (indivStatSet.off_usage) { // Don't have this info for Fr-ish
               const ortg = indivStatSet.off_rtg?.value || 100;
               const usage = indivStatSet.off_usage?.value || 0.20;
               const deltaORtg = RatingUtils.adjustORtgForUsageDelta(ortg, usage, deltaUsg) - ortg;            

               indivStatSet.off_rtg = TeamEditorUtils.addToVal(indivStatSet.off_rtg, deltaORtg + oRtgAdjustment)!;
               indivStatSet.off_usage = TeamEditorUtils.addToVal(indivStatSet.off_usage, deltaUsg)!;

               if (triple.diag) {
                  triple.diag.off_rtg[proj]["switch_usage_ortg_average"] = deltaORtg;
                  triple.diag.off_usage[proj]["average_usage"] = deltaUsg;
                  if (applyPlaymakingPenalty) {
                     triple.diag.off_rtg[proj]["lack_of_playmaking_penalty"] = oRtgAdjustment;
                  }
               }
            }
            if (applyPlaymakingPenalty) {
               //Debugging"
               //console.log(`RAPM_adj [${proj}] = ${rapmAdjustment.toFixed(4)}`)
               const rapmAdjustment = oRtgAdjustment*0.2;   
               indivStatSet.off_adj_rtg = TeamEditorUtils.addToVal(indivStatSet.off_adj_rtg, rapmAdjustment)!;
               indivStatSet.off_adj_rapm = TeamEditorUtils.addToVal(indivStatSet.off_adj_rapm, rapmAdjustment)!; 
               if (triple.diag) {
                  triple.diag.off[proj]["lack_of_playmaking_penalty"] = rapmAdjustment;
               }
            }

         });
      };

      // Apply advanced:
      ([ "good", "ok", "bad" ] as ("good" | "bad" | "ok")[]).forEach(proj => {
         shareTeamDefense(proj);
         balanceUsage(proj);
      })

      //TODO: other more advanced adjustments? Improve playmaking penalty maybe?
   }

   /** Calculate minutes assignment, mutates roster */
   static calcAndInjectMinsAssignment(
      roster: GoodBadOkTriple[], 
      team: string, year: string, disabledPlayers: Record<string, boolean>, overrides: Record<string, PlayerEditModel>,
      hasDeletedPlayersOrTransfersIn: boolean,
      teamSosNet: number, avgEff: number, offSeasonMode: boolean
   ) {
      const getOffRapm = (s: PureStatSet) => (s.off_adj_rapm || s.off_adj_rtg)?.value || 0;
      const getDefRapm = (s: PureStatSet) => (s.def_adj_rapm || s.def_adj_rtg)?.value || 0;
      const getNetRapm = (s: PureStatSet) => getOffRapm(s) - getDefRapm(s);
      const getOffAdjRtg = (s: PureStatSet) => s.off_adj_rtg?.value || 0;
      const getMixedNet = (s: PureStatSet) => getOffAdjRtg(s) - getDefRapm(s);
      const getNet = (s: PureStatSet) => Math.max(getNetRapm(s), getMixedNet(s));
      
      const filteredRoster = roster.filter(p => !disabledPlayers[p.key]);

      const benchLevel = TeamEditorUtils.getBenchLevelScoring(team, year);
      const benchGuardOverride = overrides[TeamEditorUtils.benchGuardKey]?.profile;
      const benchWingOverride = overrides[TeamEditorUtils.benchWingKey]?.profile;
      const benchBigOverride = overrides[TeamEditorUtils.benchBigKey]?.profile;
      const netRatings = _.sortBy(filteredRoster.map(p => getNet(p.ok)).concat(
         [benchGuardOverride ? TeamEditorUtils.getBenchLevelScoringByProfile(benchGuardOverride) : benchLevel, 
            benchWingOverride ? TeamEditorUtils.getBenchLevelScoringByProfile(benchWingOverride) : benchLevel, 
            benchBigOverride ? TeamEditorUtils.getBenchLevelScoringByProfile(benchBigOverride) : benchLevel, 
         ].map(n => 0.5*n)) //(add one bench player per pos group)
      );
      const tierSize = (Math.ceil(_.size(netRatings)/3) || 1);
      const avgLowerTierNetTmp = _.sum(_.take(netRatings, tierSize))/tierSize;
      const avgUpperTierNet = _.sum(_.take(_.reverse(netRatings), tierSize))/tierSize;
      // middle tier is unreliable if the team size is small, but we don't really care about that so just do something vaguely sane:
      const avgMidTierNetTmp = _.sum(_.take(_.drop(netRatings, tierSize - 1), tierSize + 1))/(tierSize + 2);
      const avgMidTierNet = (avgMidTierNetTmp < avgLowerTierNetTmp) ? (2*avgLowerTierNetTmp + avgUpperTierNet)/3 : avgMidTierNetTmp;
      const avgLowerTierNet = Math.min(avgMidTierNet - 1.5, avgLowerTierNetTmp); //(can't really determine pecking order with less granularity than that...)

      const maxMinsPerKey = _.chain(filteredRoster).map(p => {
         const maybeOverride = overrides[p.key]?.mins;
         return [ p.key, maybeOverride ? maybeOverride/40.0 : TeamEditorUtils.calcMaxMins(p) ];
      }).fromPairs().value();

      const minMinsPerKey = _.chain(filteredRoster).map(p => {
         const maybeOverride = overrides[p.key]?.mins;
         const minMins = maybeOverride ? maybeOverride/40.0 : TeamEditorUtils.calcMinMins(p, team, teamSosNet, avgEff);
         return [ p.key, Math.min(minMins, maxMinsPerKey[p.key] || minMins) ]; //(prevent min>max)
      }).fromPairs().value();

      const debugMode = false;
      if (debugMode) { // Diagnostics
         console.log(`NET TIERS: [${avgLowerTierNet.toFixed(1)}] - [${avgMidTierNet.toFixed(1)}] - [${avgUpperTierNet.toFixed(1)}] (SoS: [${teamSosNet.toFixed(3)}])`);
         _.keys(maxMinsPerKey).forEach(p => {
            console.log(`${p}: [${(minMinsPerKey[p] || 0).toFixed(3)}] to [${(maxMinsPerKey[p] || 0).toFixed(3)}]`)
         });
      }

      const assignMins = (newMins: number, p: GoodBadOkTriple, force: boolean = false) => {
         const minMins = minMinsPerKey[p.key] || newMins;
         const maxMins = maxMinsPerKey[p.key] || newMins;
         const adjBaseMins: Statistic = { value: force ? newMins : Math.max(Math.min(newMins, maxMins), minMins) };
         p.good.off_team_poss_pct = adjBaseMins;
         p.good.def_team_poss_pct = adjBaseMins;
         p.ok.off_team_poss_pct = adjBaseMins;
         p.ok.def_team_poss_pct = adjBaseMins;
         p.bad.off_team_poss_pct = adjBaseMins;
         p.bad.def_team_poss_pct = adjBaseMins;
      };

      const somethingChangedBase = offSeasonMode ||
         !_.isEmpty(disabledPlayers) ||
         hasDeletedPlayersOrTransfersIn; // has transfers in or deleted players

      // In "in-season" mode, we try to leep the original minutes, but once the user starts editing all bets are off
      const somethingChanged = somethingChangedBase || // has transfers in or deleted players
         _.some(overrides, o => !o.pause); // has any overrides at all


      // First pass - calc minutes purely based on tier:
      filteredRoster.forEach(p => {
         //(TODO: calc mins differently per tier?)
         const hasMinsOverride = !_.isNil(overrides[p.key]?.mins);

         const calcMins = (somethingChanged || hasMinsOverride); //(since overrides are enforced using min/max)
         const baseMins = calcMins ?
            TeamEditorUtils.netTierToBaseMins(getNet(p.ok), [ avgLowerTierNet, avgMidTierNet, avgUpperTierNet ])
            :
            (p.orig.off_team_poss_pct?.value || 0) //(in-season mode, just described minutes played)
            ;

         if (debugMode) { // Diagnostics
            console.log(`[${p.key}]: base mins [${baseMins}] from ${getNet(p.ok).toFixed(1)}`);
         }
         assignMins(baseMins, p, !calcMins);
      });

      // We want the total to try to hit the range: 5*(35-39mpg), goal 37.5 if high, 36.5 if low and the rest will be picked up as bench minutes
      // (lower range is 25mpg of bench, upper range is 5mpg)
      // (for in-season, we bump a little further since we don't have the concept of "Fr ready to take their minutes")

      const allThreeBenchPosHaveOverriddenMins =
         _.chain(overrides).pick(
            [ TeamEditorUtils.benchGuardKey, TeamEditorUtils.benchWingKey, TeamEditorUtils.benchBigKey ]
         ).filter(o => !o.pause && !_.isNil(o.mins)).size().value() == 3;

      // In "in-season" mode, until the user changes something we leave the minutes along
      const benchMinOverrides =_ .chain(overrides).pick( // add bench minutes override
         [  TeamEditorUtils.benchGuardKey, TeamEditorUtils.benchWingKey, TeamEditorUtils.benchBigKey ]
      ).values().filter(o => !o.pause).sumBy(o => (o.mins || 0)/40).value();
      
      const needToAdjBaseMinutes = somethingChangedBase ||
               (benchMinOverrides > 0) ||
               (_.some(filteredRoster, p => !_.isNil(overrides[p.key]?.mins))) // has overrides
          
      // Always reserve a few minutes for the deep bench
      const rosterSize = _.size(filteredRoster) + Math.ceil(benchMinOverrides/15);   
      const minsForBench = Math.max(0, 10 - rosterSize)*5; //(we're not going to include walk-ons)

      const steps = needToAdjBaseMinutes ? [ 0, 1, 2, 3, 4, 5 ] : [];
      const finalStep = _.last(steps);
      _.transform(steps, (acc, step) => {
         const sumMins = _.sumBy(filteredRoster, p => p.ok.off_team_poss_pct.value || 0);

         const emergencyMeasures = (step == finalStep) && (sumMins + benchMinOverrides) > 5.0;
            //(ensure the sum of the players' + bench minutes is never more than physically possib;e)

         const threshold = 5.0 - minsForBench/40.0 - benchMinOverrides;
         const maxGoal = 5.0 - benchMinOverrides; //(if bench specified then try to exactly hit 40mpg)
         const goal = 
            ((allThreeBenchPosHaveOverriddenMins || emergencyMeasures) ? 
               maxGoal :
               threshold
            );
         const target = 0.025; //(within 1 min)

         //Diagnostic
         if (debugMode) {
            console.log(`Step [${step}]: sum=[${sumMins.toFixed(3)}] [bench=${benchMinOverrides.toFixed(3)}] vs ` +
               `goal=[${goal.toFixed(3)}]/levels=[${threshold.toFixed(3)} - ${maxGoal.toFixed(3)}] = [${Math.abs(sumMins - goal).toFixed(3)}]`);
         }
         if ((goal > 0) && (Math.abs(sumMins - goal) > target)) {
            const factor = goal/sumMins;
            filteredRoster.forEach(p => {
               const hasMinsOverride = !_.isNil(overrides[p.key]?.mins);
               if (!hasMinsOverride) {  //(can't override players with fixed numbers)
                  const prevMins = p.good.off_team_poss_pct?.value || 0;
                  assignMins(prevMins*factor, p, emergencyMeasures);
               }
            });
         } else { // done, stop
            return false;
         }
      });
   }

   /** Inserts unused minutes */
   static getBenchMinutes(
      team: string, year: string, 
      guardPctIn: number, wingPctIn: number, bigPctIn: number, 
      overrides: Record<string, PlayerEditModel>,
      alwaysBuildBench: boolean
   ): [ GoodBadOkTriple | undefined, GoodBadOkTriple | undefined, GoodBadOkTriple | undefined ] {

      const hasGuardOverride = !_.isNil(overrides[TeamEditorUtils.benchGuardKey]?.mins);
      const guardPctOverride = 0.2*(overrides[TeamEditorUtils.benchGuardKey]?.mins || 0)/40;
      const guardPct = guardPctIn + guardPctOverride;
      const hasWingOverride = !_.isNil(overrides[TeamEditorUtils.benchWingKey]?.mins);
      const wingPctOverride = 0.2*(overrides[TeamEditorUtils.benchWingKey]?.mins || 0)/40;
      const wingPct = wingPctIn + wingPctOverride;
      const hasBigOverride = !_.isNil(overrides[TeamEditorUtils.benchBigKey]?.mins);
      const bigPctOverride = 0.2*(overrides[TeamEditorUtils.benchBigKey]?.mins || 0)/40;
      const bigPct = bigPctIn + bigPctOverride;

      const hasBenchOverrides = hasGuardOverride || hasWingOverride || hasBigOverride;
      const deltaMins = Math.max(0, 1.0 - (guardPct + wingPct + bigPct));

      //(if auto-calc need for bench minutes, or if any minutes overrides are in place)
      if ((deltaMins > 0.0) || hasBenchOverrides || alwaysBuildBench) {

         const defaultBenchLevel = TeamEditorUtils.getBenchLevelScoring(team, year);

         const buildBench = (key: string, name: string, posClass: string, minsPctIn: number) => {
            const maybeOverrides = overrides[key];
            const benchLevelOverride = maybeOverrides?.profile;
            const benchLevel = 0.5*(benchLevelOverride ? 
               TeamEditorUtils.getBenchLevelScoringByProfile(benchLevelOverride) : defaultBenchLevel);
      
            const minsPct = 
               !_.isNil(maybeOverrides?.mins) ? (maybeOverrides.mins/40.0) : (minsPctIn*5);
            const offAdj = maybeOverrides?.global_off_adj || 0;
            const defAdj = maybeOverrides?.global_def_adj || 0;

            const baseBench = {
               key: name,
               off_team_poss_pct: { value: minsPct },
               def_team_poss_pct: { value: minsPct },
               off_adj_rapm: { value: benchLevel + offAdj },
               def_adj_rapm: { value: -benchLevel + defAdj },
               posClass: posClass
            };
            return {
               key: key,
               good: {
                  ...baseBench,
                  off_adj_rapm: { value: benchLevel + TeamEditorUtils.optimisticBenchOrFr + offAdj },
                  def_adj_rapm: { value: -benchLevel - TeamEditorUtils.optimisticBenchOrFr + defAdj }
               },
               ok: {
                  ...baseBench,
               },
               bad: {
                  ...baseBench,
                  off_adj_rapm: { value: benchLevel - TeamEditorUtils.pessimisticBenchOrFr + offAdj }, 
                  def_adj_rapm: { value: -benchLevel + TeamEditorUtils.pessimisticBenchOrFr + defAdj }
               },
               orig: baseBench
            } as GoodBadOkTriple;
         };

         const benchGuardMins = hasGuardOverride ? (guardPct - guardPctIn) :
            Math.min(Math.max(0, (0.30 - guardPct)), deltaMins); // wings can play 50% of SG minutes
         const nonOverriddenBenchGuardMins = hasGuardOverride ? 0 : benchGuardMins;
         const benchBigMins = hasBigOverride ? (bigPct - bigPctIn) :
            Math.min(
               Math.max(0, (0.30 - bigPct)), // wings can play 50% of PF minutes
               deltaMins - nonOverriddenBenchGuardMins); //(subtract off bench guard minutes from the available minutes pool)
         const nonOverriddenBenchBigMins = hasBigOverride ? 0 : benchBigMins;
         const benchWingMins = hasWingOverride ? (wingPct - wingPctIn) :
            Math.max(0, deltaMins - nonOverriddenBenchGuardMins - nonOverriddenBenchBigMins); //(wings get the leftover)

         // Diagnostics
         // console.log(`Bench ${deltaMins.toFixed(3)} [${hasGuardOverride}/${hasWingOverride}/${hasBigOverride}] = ${guardPct.toFixed(3)}/${benchGuardMins.toFixed(3)} ${wingPct.toFixed(3)}/${benchWingMins.toFixed(3)} ${bigPct.toFixed(3)}/${benchBigMins.toFixed(3)}`)

         return [ 
            (benchGuardMins > 0) || alwaysBuildBench ? buildBench(
               TeamEditorUtils.benchGuardKey, "Bench & Fr Guards", "G?", benchGuardMins
            ) : undefined, 
            (benchWingMins > 0) || alwaysBuildBench ? buildBench(
               TeamEditorUtils.benchWingKey, "Bench & Fr Wings", "W?", benchWingMins
            ) : undefined, 
            (benchBigMins > 0) || alwaysBuildBench ? buildBench(
               TeamEditorUtils.benchBigKey, "Bench & Fr Bigs", "PF/C", benchBigMins
            ) : undefined, 
         ];

      } else {
         return [ undefined, undefined, undefined ]
      }
   }

   //TODO: position adjustments ... if playing WF or S-PF at center then add/subtract -1
   // if have non-PG minutes then mark down offense if there is a traditional center
   // if have a WF playing the 3 then mark down offense

   //TODO: two ways to reduce usage (and vice versa)
   // 1] based on def SoS .. normally reduce it 50:50 but if >25 then reduce by more
   // 2] if >25 and ORtg isn't stellar can we just reduce it anyway?

   //////////////////////////////////////////////////////////////////////////////

   // Lower level utils in handy testable chunks

   /** Statistic manipulation */
   private static addToVal = (s: Statistic | undefined, toAdd: number, scaler: number = 1): Statistic | undefined => {
      if (s && !_.isNil(s.value)) {
         return { 
            value: scaler*s.value + toAdd,
            old_value: _.isNil(s.old_value) ? undefined : scaler*s.old_value + toAdd
         };
      } else {
         return undefined;
      }
   };

   /** Calculate SoS */
   static calcApproxTeamSoS(origRoster: IndivStatSet[], avgEff: number): [ number, number, number ] {
      if (!_.isEmpty(origRoster)) {
         const calcs = _.transform(origRoster, (acc, p) => {
            const thisOffPoss = p.off_team_poss_pct?.value || 0;
            const thisDefPoss = p.def_team_poss_pct?.value || 0;
            acc.off_poss += thisDefPoss; //(reversed because I play against opposing defense)
            acc.def_poss += thisOffPoss;
            acc.sum_off += (p.off_adj_opp?.value || avgEff)*thisDefPoss; 
            acc.sum_def += (p.def_adj_opp?.value || avgEff)*thisOffPoss; 
         }, {
            off_poss: 0, def_poss: 0, sum_off: 0, sum_def: 0
         });
         const offSoS = calcs.sum_off/(calcs.off_poss || 1);
         const defSoS = calcs.sum_def/(calcs.def_poss || 1);
         return [ offSoS - defSoS, offSoS, defSoS ];
      } else { //(just return some generic number)
         return [ 8, avgEff + 4, avgEff - 4 ];
      }
   }
   
   /** Estimate the maximum number of minutes played based on their fouling rate */
   static calcMaxMins(p: GoodBadOkTriple) {
      if (p.manualProfile) {
         return TeamEditorUtils.getFreshmenMaxMins(p)/40;
      } else {
         const improvement = (p.orig.roster?.year_class == "Fr") ? 0.5 :
            ((p.orig.roster?.year_class == "So") ?  0.5 : 0);

         const foulsPer50 = Math.min(Math.max(0, (p.orig.def_ftr?.value || 0)*100 - improvement), 6);

         const baseMax = 0.85;
         if (foulsPer50 > 4) { //(so now by construction it's in the 6-4 range)
            return baseMax - (foulsPer50 - 4)*0.10;
         } else {
            return baseMax;
         }    
      }
   }

   /** Estimate the minimum number of minutes played based on their minutes the previous season */
   static calcMinMins(p: GoodBadOkTriple, team: string, teamSosNet: number, avgEff: number) {
      if (p.manualProfile) {
         return 5/40; //(some nominal value)
      } else {
         const currPossPct = p.orig.off_team_poss_pct?.value || 0.25;
         if ((p.orig.team == team) && (p.orig.roster?.year_class == "Fr")) { // Fr always increase their minutes
            return currPossPct;
         } else if (p.orig.team != team) { //TODO transfer up vs transfer down
            // Transfers ... are we transferring up or down?
            const sosNet = (p.orig.off_adj_opp?.value || avgEff) - (p.orig.def_adj_opp?.value || avgEff);
            const txferDeltaDiff = sosNet - teamSosNet;

            //Diag:
            //console.log(`${p.key} SoS: [${sosNet.toFixed(1)}], diff = [${txferDeltaDiff.toFixed(1)}]`);

            if (txferDeltaDiff > 6) { // moving way down
               return 1.5*currPossPct;
            } else if (txferDeltaDiff > 3) { // moving down
               return currPossPct;
            } else if (txferDeltaDiff < -6) { // moving way up
               return 0.5*currPossPct;
            } else if (txferDeltaDiff < -3) { // moving up
               return 0.66*currPossPct;
            } else { //about the same, treat same as returner, see below
               return currPossPct*0.80;
            }
         } else { // team member
            return currPossPct*0.80; //(at most a 20% drop in numbers)
         }
      }
   }

   /** If transferring up (assumed if this method is called), then very short players may incur a offensive/defensive penalty */
   static calcTxferUpHeightEffDrop(p: IndivStatSet) {
      const heightStrToIn = (s?: string) => { //(for some reason sometimes don't have height_in but do have height)
         if (s && /^[0-9]-[0-9]+$/.test(s)) {
            const heightFrags = s.split("-");
            return parseInt(heightFrags[0])*12 + parseInt(heightFrags[1]!);
         } else return undefined;
      };
      const heightIn = p.roster?.height_in || heightStrToIn(p.roster?.height);

      if (heightIn) {
         // Arbitrarily escalating scale (the idea is that the more you rely on physicality, the harder it is to get a shot off)
         if (((p.posClass == "PG") || (p.posClass == "s-PG")) && (heightIn <= 70)) { //5'10-
            return -0.3;
         } else if ((p.posClass == "CG") && (heightIn <= 72)) { // 6'0-
            return -0.4;
         } else if ((p.posClass == "WG") && (heightIn <= 74)) { // 6'2-
            return -0.4;
         } else if ((p.posClass == "WF") && (heightIn <= 77)) { // 6'5-
            return -0.5;            
         } else if ((p.posClass == "S-PG") && (heightIn <= 78)) { // 6'6-
            return -0.5;            
         } else if ((p.posClass == "PF/C") && (heightIn <= 79)) { // 6'7-
            return -0.5;            
         } else if ((p.posClass == "C") && (heightIn <= 79)) { // 6'7-
            return -0.8;            
         } else {
            return 0;
         }
      } else { //nothing we can do
         return 0;
      }
   }

   /** Gives the next year of a player (for off-season) */
   static getNextClass(s: string | undefined) {
      if (s == "Fr") return "So";
      else if (s == "So") return "Jr";
      else if (s == "Jr") return "Sr";
      else if (s == "Sr") return "Sr*";
      else return "So?";
   }

   /** Assign a fairly abitrary minute total based on where you sit in the team pecking order... */
   static netTierToBaseMins(playerNet: number, tiers: [number, number, number]) {
      // expand to 7 numbers by introducing the gaps
      const expandedTiers = [ tiers[0] - 0.5, tiers[0], 0.5*(tiers[0] + tiers[1]), tiers[1], 0.5*(tiers[1] + tiers[2]), tiers[2], tiers[2] + 1.0 ];
      const expandedTierToMins = [ 0.15, 0.30, 0.45, 0.55, 0.65, 0.75, 0.85 ];

      const closestExpandedTier = _.sortBy(
         expandedTiers.map((t, i) => [i, Math.abs(playerNet - t) ] as [number, number]), vi => vi[1]
      )[0]![0];

      return expandedTierToMins?.[closestExpandedTier] || 0.9;
   }
   
   /** Gets a max cap on Fr minutes */
   static getFreshmenMaxMins(triple: GoodBadOkTriple) {
      const isBig = PositionUtils.posClassToScore(triple.orig.posClass || "") > 5500;
      const blueChip = new Set(["5*/Lotto", "5*", "5+4*s"]);
      const decentRecruit = new Set(["4*/T40ish", "4*", "3.5*/T150ish"]);
      const profile = triple.manualProfile?.profile || "";
      if (isBig) {
         if (blueChip.has(profile)) {
            return 25;
         } else if (decentRecruit.has(profile)) {
            return 20;
         } else {
            return 15;
         }
      } else {
         if (blueChip.has(profile)) {
            return 30;
         } else if (decentRecruit.has(profile)) {
            return 25;
         } else {
            return 20;
         }
      }
   }


   /** Upside on bench/Fr predictions */
   static readonly optimisticBenchOrFr = 0.5;
   /** Downside on bench/Fr predictions - bench scoring can be bad so we make this higher */
   static readonly pessimisticBenchOrFr = 1.0;

   /** Gets the bench level scoring depending on the quality of the team */
   static getBenchLevelScoring(team: string, year: string) {
      const level = _.find(AvailableTeams.byName[team] || [], teamInfo => teamInfo.year == year) 
         || AvailableTeams.byName[team]?.[0] 
         || { category: "unknown"};

      const getBenchLevel = () => {
         if (team == "Gonzaga") { // Treat as high major
            return TeamEditorUtils.getBenchLevelScoringByProfile("3.5*/T150ish");            
         } else if (level.category == "high") {
            return TeamEditorUtils.getBenchLevelScoringByProfile("3.5*/T150ish");            
         } else if (level.category == "midhigh") {
            return TeamEditorUtils.getBenchLevelScoringByProfile("3*");
         } else if (level.category == "mid") {
            return TeamEditorUtils.getBenchLevelScoringByProfile("3+2*s");
         } else if (level.category == "midlow") {
            return TeamEditorUtils.getBenchLevelScoringByProfile("2*");
         } else if (level.category == "low") {
            return TeamEditorUtils.getBenchLevelScoringByProfile("UR");
         } else { //unknown
            return TeamEditorUtils.getBenchLevelScoringByProfile(undefined);
         } 
      }
      return getBenchLevel();
   }

   /** Returns a numeric value for how many "levels" a player has jumped */
   static getJumpInLevel(oldTeam: string, newTeam: string, year: string): undefined | number {
      const levelToNumber = (level: string) => {
         switch(level) {
            case "high": return 5;
            case "midhigh": return 4;
            case "mid": return 3;
            case "midlow": return 2;
            case "low": return 1;
            default: return undefined;
         }
      }
      const getLevel = (team: string) => _.find(AvailableTeams.byName[team] || [], teamInfo => teamInfo.year == year) 
         || AvailableTeams.byName[team]?.[0] 
         || { category: "unknown"};

      const oldLevel = levelToNumber(getLevel(oldTeam).category || "unknown");
      const newLevel = levelToNumber(getLevel(newTeam).category || "unknown");
      if (_.isNil(oldLevel) || _.isNil(newLevel)) {
         return undefined;
      } else {
         return newLevel - oldLevel;
      }
   }

   /** Provides an offense/defense based on "HS recruitment level, see TeamRosterEditor" */
   static getBenchLevelScoringByProfile(profile: Profiles | undefined): number {
      //(these numbers derived from looking at the T200 Fr for the last 4 years - the lower ranges are purely guesswork)
      if (profile == "5*/Lotto") {
         return 6.5;
      } else if (profile == "5*") {
         return 5.2;
      } else if (profile == "5+4*s") { //(still support this even though it's no longer selectible)
         return 4.6;
      } else if (profile == "4*/T40ish") {
         return 3.5;
      } else if (profile == "4*") {
         return 1.5;
      } else if (profile == "3.5*/T150ish") {
         return 0.5;
      } else if (profile == "3*") {
         return -1;
      } else if (profile == "3+2*s") { //(not selectible)
         return -2;
      } else if (profile == "2*") {
         return -3;
      } else if (profile == "UR") {
         return -4;
      } else {
         return 0; //(error)
      }
   }
   
   /** To regress Fr players we'll move them in this direction - TODO would be nice to include '*' rating in this */
   static getAvgProduction(team: string, year: string) {
      const level = _.find(AvailableTeams.byName[team] || [], teamInfo => teamInfo.year == year) || { category: "unknown"};
      const getAvgLevel = () => {
         if (team == "Gonzaga") { // Treat as high major
            return 2.5;            
         } else if (level.category == "high") {
            return 2.5;            
         } else if (level.category == "midhigh") {
            return 1.5;
         } else if (level.category == "mid") {
            return 0;
         } else if (level.category == "midlow") {
            return -1;
         } else if (level.category == "midlow") {
            return -2.5;
         } else { //unknown
            return 0;
         } 
      }
      return getAvgLevel();
   }

   /** Builds the list of players to calculate the actual season prediction over */
   static readonly getFilteredPlayersWithBench = (pxResults: TeamEditorProcessingResults, disabledPlayers: Record<string, boolean>) => {
      return pxResults.basePlayersPlusHypos.filter(triple => !disabledPlayers[triple.key])
        .concat(pxResults.maybeBenchGuard ? [ pxResults.maybeBenchGuard ] : [])
        .concat(pxResults.maybeBenchWing ? [ pxResults.maybeBenchWing ] : [])
        .concat(pxResults.maybeBenchBig ? [ pxResults.maybeBenchBig ] : []);
    }

   /** Sums the given projection in a set of projections for the team */
   static readonly buildTotals = (triples: GoodBadOkTriple[], range: "good" | "bad" | "ok" | "orig", adj: number = 0) => {
      const off = _.sumBy(triples, triple => {
        return (triple[range]?.off_team_poss_pct.value || 0)*TeamEditorUtils.getOff(triple[range] || {});
      }) + adj;
      const def = _.sumBy(triples, triple => {
        return (triple[range]?.off_team_poss_pct.value || 0)*TeamEditorUtils.getDef(triple[range] || {});
      }) - adj;
      const net = _.sumBy(triples, triple => {
        return (triple[range]?.off_team_poss_pct.value || 0)*TeamEditorUtils.getNet(triple[range] || {});
      }) + 2*adj;
      return { off, def, net };
   };

   /* Quick accessor for offensive contribution of player */
   static getOff = (s: PureStatSet, factor: number = 1.0) => ((s.off_adj_rapm || s.off_adj_rtg)?.value || 0)*factor;
   /* Quick accessor for defensive contribution of player */
   static getDef = (s: PureStatSet, factor: number = 1.0) => ((s.def_adj_rapm || s.def_adj_rtg)?.value || 0)*factor;
   /* Quick accessor for net (offensive + defensive) contribution of player */
   static getNet = (s: PureStatSet, factor: number = 1.0) => TeamEditorUtils.getOff(s, factor) - TeamEditorUtils.getDef(s, factor);
}