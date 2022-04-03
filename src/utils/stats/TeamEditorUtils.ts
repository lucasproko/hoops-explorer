
import _ from "lodash";
import { AvailableTeams } from "../internal-data/AvailableTeams";
import { IndivStatSet, PureStatSet, Statistic } from '../StatModels';

export type GoodBadOkTriple = {
   key: string,
   good: IndivStatSet,
   ok: IndivStatSet,
   bad: IndivStatSet,
   orig: IndivStatSet
};

/** Data manipulation functions for the TeamEditorTable */
export class TeamEditorUtils {

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

   //TODO: is there some way I can take walk-ons out the equation but use the roster info to list "guys that don't play much"
   // (ignoring anyone who isn't a Fr, will get rid of some of them, but not Fr walk-ons.... really need the *s)

   /** Pulls out the players from the designated team */
   static getBasePlayers(
      team: string, year: string, players: IndivStatSet[], cache: Record<string, GoodBadOkTriple>, 
      includeSeniors: boolean, excludeSet: Record<string, string>, 
      transfers: Record<string, Array<{f: string, t?: string}>>
   ): GoodBadOkTriple[] {
      const fromBaseRoster = _.transform(players, (acc, p) => {
         const yearAdj = year == "All" ? p.year : ""; //(for building all star teams)
         const code = (p.code || "") + yearAdj;
         const isTransfer = p.team != team;
         const key = isTransfer ? `${p.code}:${p.team}:${yearAdj}` : `${p.code}::${yearAdj}`;
         const isRightYear = year == "All" || (p.year == year);
         const transferringIn = _.some(transfers[code] || [], p => p.t == team);
         const notTransferringOut = ((p.team == team)                
                                       && (includeSeniors || (p.roster?.year_class != "Sr"))
                                          && !_.some(transfers[code] || [], p => p.f == team));
         const notOnExcludeList = !cache[code] && !excludeSet[key] && !acc.dups[code];

         if ((transferringIn || notTransferringOut) && notOnExcludeList && isRightYear) {
            acc.retVal = acc.retVal.concat([{
               key: key,
               good: _.clone(p),
               ok: _.clone(p),
               bad: _.clone(p),
               orig: p
            }]);
            acc.dups[code] = true; //(use key not code because of possibility that player with same code has transferred in)
         }
      }, { retVal: [] as GoodBadOkTriple[], dups:  {} as Record<string, boolean> });

      return fromBaseRoster.retVal.concat(_.values(cache));
   }

   /** Give players their year-on-year improvement */
   static calcAndInjectYearlyImprovement(
      roster: GoodBadOkTriple[], 
      team: string, teamSosOff: number, teamSosDef: number, avgEff: number,
      offSeasonMode: boolean
   ) {
      const addToVal = (s: Statistic | undefined, toAdd: number): Statistic | undefined => {
         if (s && !_.isNil(s.value)) {
            return { value: s.value + toAdd };
         } else {
            return undefined;
         }
      };
      roster.forEach(p => {
         const avgOffBump = offSeasonMode ? 0.6 : 0; //(1.5 ORtg + 1 usage - the bump for staying in the same team)
         const offClassMulti = (p.orig.roster?.year_class == "Fr") ? 2 : 1;

         const defSosDeltaForTxfers = teamSosDef - (p.orig.def_adj_opp?.value || (avgEff - 4));
         const isTransferringUpOff = ((p.orig.team != team) && (defSosDeltaForTxfers < -4));
         const offTxferUpPenalty = //(specific to transferring up as a shorter player)
            isTransferringUpOff ? TeamEditorUtils.calcTxferUpHeightEffDrop(p) : 0;

         const generalTxferOffPenalty = (p.orig.team != team) ? avgOffBump : 0; //(just the fact that you might not get quite the same off-season bump as a transfer)

         // Adj delta assumes the usage goes to good use, then RAPM adjusts off that. But maybe with a new team, the RAPM will
         const rapmVsAdjOffDelta = 0.5*(((p.orig as PureStatSet).off_adj_rapm?.value || 0) - (p.orig.off_adj_rtg?.value || 0));
         const rapmVsAdjOffDeltaGood = rapmVsAdjOffDelta < 0 ? Math.abs(rapmVsAdjOffDelta) : 0; 
            //if they under-performed their rating then optimistically maybe on this team they will under-perform less
         const rapmVsAdjOffDeltaBad = rapmVsAdjOffDelta > 0 ? -Math.abs(rapmVsAdjOffDelta) : 0;
            //if they over-performed their rating then optimistically maybe on this team they will out-perform less

         const goodOffAdj = 2*offClassMulti*avgOffBump - 0.5*offTxferUpPenalty + rapmVsAdjOffDeltaGood;
         p.good.off_adj_rtg = addToVal((p.orig as PureStatSet).off_adj_rtg, goodOffAdj)!;
         p.good.off_adj_rapm = addToVal((p.orig as PureStatSet).off_adj_rapm, goodOffAdj);

         const okOffAdj = offClassMulti*avgOffBump - 0.75*offTxferUpPenalty - 0.5*generalTxferOffPenalty;
         p.ok.off_adj_rtg = addToVal((p.orig as PureStatSet).off_adj_rtg, okOffAdj)!;
         p.ok.off_adj_rapm = addToVal((p.orig as PureStatSet).off_adj_rapm, okOffAdj);

         const badOffAdj = -offTxferUpPenalty - generalTxferOffPenalty + rapmVsAdjOffDeltaBad;
         p.bad.off_adj_rtg = addToVal((p.orig as PureStatSet).off_adj_rtg, badOffAdj)!;
         p.bad.off_adj_rapm = addToVal((p.orig as PureStatSet).off_adj_rapm, badOffAdj);

         const avgDefBump = offSeasonMode ? -0.6 : 0; //(just make the same as the offensive bump, I don't believe there is any data)
         const defClassMulti = (p.orig.roster?.year_class == "Fr") ? 2 : 0.5; //(I'm going to assert without evidence the Fr bump for defense is relatively bigger)

         const offSosDeltaForTxfers = teamSosOff - (p.orig.off_adj_opp?.value || (avgEff + 4));
         const isTransferringUpDef = ((p.orig.team != team) && (offSosDeltaForTxfers > 4));
         const defTxferUpBetterHelpBump =
            isTransferringUpDef ? -0.5 : //(approx 50% of approx 50% help * avg delta of 2 between high and low majors)
            0; //(for players transferring up a decent amount, give their defense a bump because the help defense should be better)

         const defTxferUpPenalty =
            isTransferringUpDef ? TeamEditorUtils.calcTxferUpHeightEffDrop(p) : 0;

         const defTxferMulti = (p.orig.roster?.year_class == "Fr") ? 1 : 0.5; //(you get a bigger jump as a Fr, see defClassMulti)
         const generalTxferDefPenalty = (p.orig.team != team) ? defTxferMulti*avgDefBump : 0; //(just the fact that you might not get quite the same off-season bump as a transfer)

         const goodDefAdj = 2*defClassMulti*avgDefBump + defTxferUpBetterHelpBump - 0.5*defTxferUpPenalty;
         p.good.def_adj_rtg = addToVal((p.orig as PureStatSet).def_adj_rtg, goodDefAdj)!;
         p.good.def_adj_rapm = addToVal((p.orig as PureStatSet).def_adj_rapm, goodDefAdj);

         const okDefAdj = defClassMulti*avgDefBump + 0.5*defTxferUpBetterHelpBump - 0.75*defTxferUpPenalty - 0.5*generalTxferDefPenalty;
         p.ok.def_adj_rtg = addToVal((p.orig as PureStatSet).def_adj_rtg, okDefAdj)!;
         p.ok.def_adj_rapm = addToVal((p.orig as PureStatSet).def_adj_rapm, okDefAdj);

         const badDefAdj = -defTxferUpPenalty - generalTxferDefPenalty;
         p.bad.def_adj_rtg = addToVal((p.orig as PureStatSet).def_adj_rtg, badDefAdj)!;
         p.bad.def_adj_rapm = addToVal((p.orig as PureStatSet).def_adj_rapm, badDefAdj);
      });

      //TODO: turn the adjustment into an ORtg/usage delta for "OK" tier
   }

   /** Calculate minutes assignment, mutates roster */
   static calcAndInjectMinsAssignment(
      roster: GoodBadOkTriple[], 
      team: string, year: string, disabledPlayers: Record<string, boolean>,
      teamSosNet: number, avgEff: number
   ) {
      const getOffRapm = (s: PureStatSet) => (s.off_adj_rapm || s.off_adj_rtg)?.value || 0;
      const getDefRapm = (s: PureStatSet) => (s.def_adj_rapm || s.def_adj_rtg)?.value || 0;
      const getNetRapm = (s: PureStatSet) => getOffRapm(s) - getDefRapm(s);
      const getOffAdjRtg = (s: PureStatSet) => s.off_adj_rtg?.value || 0;
      const getMixedNet = (s: PureStatSet) => getOffAdjRtg(s) - getDefRapm(s);
      const getNet = (s: PureStatSet) => Math.max(getNetRapm(s), getMixedNet(s));
      
      const filteredRoster = roster.filter(p => !disabledPlayers[p.key]);

      const benchLevel = TeamEditorUtils.getBenchLevelScoring(team, year);
      const netRatings = _.sortBy(filteredRoster.map(p => getNet(p.ok)).concat(
         [benchLevel, benchLevel, benchLevel]) //(add one bench player per pos group)
      );
      const tierSize = (Math.ceil(_.size(netRatings)/3) || 1);
      const avgLowerTierNetTmp = _.sum(_.take(netRatings, tierSize))/tierSize;
      const avgUpperTierNet = _.sum(_.take(_.reverse(netRatings), tierSize))/tierSize;
      // middle tier is unreliable if the team size is small, but we don't really care about that so just do something vaguely sane:
      const avgMidTierNetTmp = _.sum(_.take(_.drop(netRatings, tierSize - 1), tierSize + 1))/(tierSize + 2);
      const avgMidTierNet = (avgMidTierNetTmp < avgLowerTierNetTmp) ? (2*avgLowerTierNetTmp + avgUpperTierNet)/3 : avgMidTierNetTmp;
      const avgLowerTierNet = Math.min(avgMidTierNet - 1.5, avgLowerTierNetTmp); //(can't really determine pecking order with less granularity than that...)

      const maxMinsPerKey = _.chain(filteredRoster).map(p => {
         return [ p.key, TeamEditorUtils.calcMaxMins(p) ];
      }).fromPairs().value();

      const minMinsPerKey = _.chain(filteredRoster).map(p => {
         const minMins = TeamEditorUtils.calcMinMins(p, team, teamSosNet, avgEff);
         return [ p.key, Math.min(minMins, maxMinsPerKey[p.key] || minMins) ]; //(prevent min>max)
      }).fromPairs().value();

      const debugMode = false;
      if (debugMode) { // Diagnostics
         console.log(`NET TIERS: [${avgLowerTierNet.toFixed(1)}] - [${avgMidTierNet.toFixed(1)}] - [${avgUpperTierNet.toFixed(1)}] (SoS: [${teamSosNet.toFixed(3)}])`);
         _.keys(maxMinsPerKey).forEach(p => {
            console.log(`${p}: [${(minMinsPerKey[p] || 0).toFixed(3)}] to [${(maxMinsPerKey[p] || 0).toFixed(3)}]`)
         });
      }

      const assignMins = (newMins: number, p: GoodBadOkTriple) => {
         const minMins = minMinsPerKey[p.key] || newMins;
         const maxMins = maxMinsPerKey[p.key] || newMins;
         const adjBaseMins: Statistic = { value: Math.max(Math.min(newMins, maxMins), minMins) };
         p.good.off_team_poss_pct = adjBaseMins;
         p.good.def_team_poss_pct = adjBaseMins;
         p.ok.off_team_poss_pct = adjBaseMins;
         p.ok.def_team_poss_pct = adjBaseMins;
         p.bad.off_team_poss_pct = adjBaseMins;
         p.bad.def_team_poss_pct = adjBaseMins;
      };

      // First pass - calc minutes purely based on tier:
      filteredRoster.forEach(p => {
         //(TODO: calc mins differently per tier?)
         const baseMins = TeamEditorUtils.netTierToBaseMins(getNet(p.ok), [ avgLowerTierNet, avgMidTierNet, avgUpperTierNet ]);

         if (debugMode) { // Diagnostics
            console.log(`[${p.key}]: base mins [${baseMins}] from ${getNet(p.ok).toFixed(1)}`);
         }
         assignMins(baseMins, p);
      });

      // We want the total to try to hit the range: 5*(35-39mpg), goal 37.5 if high, 36.5 if low and the rest will be picked up as bench minutes

      const steps = [ 0, 1, 2, 3, 4, 5 ];
      _.transform(steps, (acc, step) => {
         const sumMins = _.sumBy(filteredRoster, p => p.ok.off_team_poss_pct.value || 0);

         const highLevel = 5*(39.0/40.0);
         const lowLevel = 5*(35.0/40.0);
         const highGoal = 5*(37.5/40.0);
         const lowGoal = 5*(36.5/40.0);
         const goal = sumMins > highLevel ? highGoal : (sumMins < lowLevel ? lowGoal : -1);

         //console.log(`Step ${step}: ${sumMins.toFixed(3)}`);

         if (goal > 0) {
            const factor = goal/sumMins;
            filteredRoster.forEach(p => {
               const prevMins = p.good.off_team_poss_pct?.value || 0;
               assignMins(prevMins*factor, p);
            });
         } else { // done, stop
            return false;
         }
      });

      //TODO: generic fr need to be handled as special cases
   }

   /** More complex adjustments */

   /** Inserts unused minutes */
   static getBenchMinutes(
      team: string, year: string, guardPct: number, wingPct: number, bigPct: number
   ): [ GoodBadOkTriple | undefined, GoodBadOkTriple | undefined, GoodBadOkTriple | undefined ] {
      const deltaMins = 1.0 - (guardPct + wingPct + bigPct);
      if (deltaMins > 0.0) {

         const benchLevel = TeamEditorUtils.getBenchLevelScoring(team, year);

         const buildBench = (key: string, posClass: string, minsPct: number) => {
            const baseBench = {
               key: key,
               off_team_poss_pct: { value: Math.min(minsPct*5, 1.0) },
               def_team_poss_pct: { value: Math.min(minsPct*5, 1.0) },
               off_adj_rapm: { value: benchLevel },
               def_adj_rapm: { value: -benchLevel },
               posClass: posClass
            };
            return {
               key: key,
               good: {
                  ...baseBench,
                  off_adj_rapm: { value: benchLevel + 0.5 },
                  def_adj_rapm: { value: -benchLevel - 0.5 }
               },
               ok: {
                  ...baseBench,
               },
               bad: {
                  ...baseBench,
                  off_adj_rapm: { value: benchLevel - 1 }, //(bench scoring can be really bad)
                  def_adj_rapm: { value: -benchLevel + 1 }
               },
               orig: baseBench
            } as GoodBadOkTriple;
         };

         const benchGuardMins = Math.min(Math.max(0, (0.30 - guardPct)), deltaMins); // wings can play 50% of SG minutes
         const benchBigMins = Math.min(Math.max(0, (0.30 - bigPct)), deltaMins); // wings can play 50% of PF minutes
         const benchWingMins = Math.max(0, deltaMins - benchGuardMins - benchBigMins);

         return [ 
            benchGuardMins > 0 ? buildBench("Bench Guard Minutes", "G?", benchGuardMins) : undefined, 
            benchWingMins > 0 ? buildBench("Bench Wing Minutes", "W?", benchWingMins) : undefined, 
            benchBigMins > 0 ? buildBench("Bench Big Minutes", "PF/C", benchBigMins) : undefined, 
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


   // Lower level utils in handy testable chunks

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

   /** Estimate the minimum number of minutes played based on their minutes the previous season */
   static calcMinMins(p: GoodBadOkTriple, team: string, teamSosNet: number, avgEff: number) {
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

   /** If transferring up (assumed if this method is called), then very short players may incur a offensive/defensive penalty */
   static calcTxferUpHeightEffDrop(p: GoodBadOkTriple) {
      const heightStrToIn = (s?: string) => { //(for some reason sometimes don't have height_in but do have height)
         if (s && /^[0-9]-[0-9]+$/.test(s)) {
            const heightFrags = s.split("-");
            return parseInt(heightFrags[0])*12 + parseInt(heightFrags[1]!);
         } else return undefined;
      };
      const heightIn = p.orig?.roster?.height_in || heightStrToIn(p.orig?.roster?.height);
      if (heightIn) {
         // Arbitrarily escalating scale (the idea is that the more you rely on physicality, the harder it is to get a shot off)
         if ((p.orig.posClass == "PG") || (p.orig.posClass == "s-PG") && (heightIn <= 70)) { //5'10-
            return -0.3;
         } else if ((p.orig.posClass == "CG") && (heightIn <= 72)) { // 6'0-
            return -0.4;
         } else if ((p.orig.posClass == "WG") && (heightIn <= 74)) { // 6'2-
            return -0.4;
         } else if ((p.orig.posClass == "WF") && (heightIn <= 77)) { // 6'5-
            return -0.5;            
         } else if ((p.orig.posClass == "S-PG") && (heightIn <= 78)) { // 6'6-
            return -0.5;            
         } else if ((p.orig.posClass == "PF/C") && (heightIn <= 79)) { // 6'7-
            return -0.5;            
         } else if ((p.orig.posClass == "C") && (heightIn <= 79)) { // 6'7-
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
      const expandedTiers = [ tiers[0] - 1, tiers[0], 0.5*(tiers[0] + tiers[1]), tiers[1], 0.5*(tiers[1] + tiers[2]), tiers[2], tiers[2] + 1.0 ];
      const expandedTierToMins = [ 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85 ];

      const closestExpandedTier = _.sortBy(
         expandedTiers.map((t, i) => [i, Math.abs(playerNet - t) ] as [number, number]), vi => vi[1]
      )[0]![0];

      return expandedTierToMins?.[closestExpandedTier] || 0.9;
   }
   
   /** Gets the bench level scoring depending on the quality of the team */
   static getBenchLevelScoring(team: string, year: string) {
      const level = _.find(AvailableTeams.byName[team] || [], teamInfo => teamInfo.year == year) || { category: "unknown"};
      const getBenchLevel = () => {
         if (level.category == "high") {
            return 0.5;            
         } else if (level.category == "midhigh") {
            return -0.5;
         } else if (level.category == "mid") {
            return -1.5;
         } else if (level.category == "midlow") {
            return -2.5;
         } else if (level.category == "midlow") {
            return -4;
         } else { //unknown
            return 0;
         } 
      }
      return getBenchLevel();
   }
   
   //TODO: also need to handle in-season mins (ie for "what if player goes down" type questions)
}