
import _ from "lodash";
import TeamReportFilter from "../../components/TeamReportFilter";
import { AvailableTeams } from "../internal-data/AvailableTeams";
import { IndivStatSet, PureStatSet, Statistic } from '../StatModels';

type DiagCodes = 
   "fr_yearly_bonus" | "yearly_bonus" |
   "undersized_txfer_pen" | "general_txfer_pen" |
   "player_gravity_bonus" | "player_gravity_penalty" | 
   "better_help_txfer_bonus" | "share_team_defense"
   ;

type TeamEditorDiags = {
   off: { good: Record<DiagCodes, number>, ok: Record<DiagCodes, number>, bad: Record<DiagCodes, number>, }
   def: { good: Record<DiagCodes, number>, ok: Record<DiagCodes, number>, bad: Record<DiagCodes, number>, }
};

export type GoodBadOkTriple = {
   key: string,
   good: IndivStatSet,
   ok: IndivStatSet,
   bad: IndivStatSet,
   orig: IndivStatSet,
   prevYear?: IndivStatSet,
   diag?: TeamEditorDiags
};

/** Data manipulation functions for the TeamEditorTable */
export class TeamEditorUtils {

   static readonly diagCodeToString: Record<DiagCodes, string> = {
      fr_yearly_bonus: "Fr->Soph bonus",
      yearly_bonus: "Small year-on-year bonus",
      general_txfer_pen: "General transfer penalty",
      undersized_txfer_pen: "Undersized transfer penalty",
      player_gravity_bonus: "Player gravity bonus",
      player_gravity_penalty: "Player gravity penalty",
      better_help_txfer_bonus: "Better help defense bonus",
      share_team_defense: "Shared team defense"
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

   //TODO: is there some way I can take walk-ons out the equation but use the roster info to list "guys that don't play much"
   // (ignoring anyone who isn't a Fr, will get rid of some of them, but not Fr walk-ons.... really need the *s)

   /** Pulls out the players from the designated team */
   static getBasePlayers(
      team: string, year: string, players: IndivStatSet[], 
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
         const notOnExcludeList = !excludeSet[key];

         if ((transferringIn || notTransferringOut) && notOnExcludeList) {
            if (isRightYear && !acc.dups[code]) {
               acc.retVal = acc.retVal.concat([{
                  key: key,
                  good: _.clone(p),
                  ok: _.clone(p),
                  bad: _.clone(p),
                  orig: p
               }]);
               acc.dups[code] = true; //(use key not code because of possibility that player with same code has transferred in)
            } else if (!isRightYear) { //(must be previous year)     
               acc.prevYears[key] = p;
            }
         }
      }, { retVal: [] as GoodBadOkTriple[], dups:  {} as Record<string, boolean>, prevYears: {} as Record<string, IndivStatSet> });

      return fromBaseRoster.retVal.map(triple => {
         return { ...triple, prevYear: fromBaseRoster.prevYears[triple.key]};
      });
   }


   /** Give players their year-on-year improvement */
   static calcAndInjectYearlyImprovement(
      roster: GoodBadOkTriple[], 
      team: string, teamSosOff: number, teamSosDef: number, avgEff: number,
      offSeasonMode: boolean
   ) {
      const calcBasicAdjustments = (
         basePlayer: IndivStatSet, basePlayerPrevYear: IndivStatSet | undefined
      ) => {
         const isFr = (basePlayer.roster?.year_class == "Fr") && _.isNil(basePlayerPrevYear); //(filter out "fake Freshmen")

         const avgOffBump = offSeasonMode ? 0.6 : 0; //(1.5 ORtg + 1 usage - the bump for staying in the same team)
         const offClassMulti = isFr ? 2 : 1;

         // Offensive bonuses and penalties (+ == good)

         const defSosDeltaForTxfers = teamSosDef - (basePlayer.def_adj_opp?.value || (avgEff - 4));
         const isTransferringUpOff = ((basePlayer.team != team) && (defSosDeltaForTxfers < -4));
         const offTxferUpPenalty = //(specific to transferring up as a shorter player)
            isTransferringUpOff ? -TeamEditorUtils.calcTxferUpHeightEffDrop(basePlayer) : 0;

         const generalTxferOffPenalty = (basePlayer.team != team) ? avgOffBump : 0; //(just the fact that you might not get quite the same off-season bump as a transfer)

         // Adj delta assumes the usage goes to good use, then RAPM adjusts off that. But maybe with a new team, the RAPM will
         const rapmVsAdjOffDelta = 0.5*(((basePlayer as PureStatSet).off_adj_rapm?.value || 0) - (basePlayer.off_adj_rtg?.value || 0));
         const rapmVsAdjOffDeltaGoodBonus = rapmVsAdjOffDelta < 0 ? Math.abs(rapmVsAdjOffDelta) : 0; 
            //if they under-performed their rating then optimistically maybe on this team they will under-perform less
         const rapmVsAdjOffDeltaBadPenalty = rapmVsAdjOffDelta > 0 ? Math.abs(rapmVsAdjOffDelta) : 0;
            //if they over-performed their rating then optimistically maybe on this team they will out-perform less

         // Defensive bonuses and penalties (- == good)

         const avgDefBump = offSeasonMode ? -0.6 : 0; //(just make the same as the offensive bump, I don't believe there is any data)
         const defClassMulti = isFr ? 2 : 0.5; //(I'm going to assert without evidence the Fr bump for defense is relatively bigger)

         const offSosDeltaForTxfers = teamSosOff - (basePlayer.off_adj_opp?.value || (avgEff + 4));
         const isTransferringUpDef = ((basePlayer.team != team) && (offSosDeltaForTxfers > 4));
         const defTxferUpBetterHelpBump =
            isTransferringUpDef ? -0.5 : //(approx 50% of approx 50% help * avg delta of 2 between high and low majors)
            0; //(for players transferring up a decent amount, give their defense a bump because the help defense should be better)

         const defTxferUpPenalty =
            isTransferringUpDef ? TeamEditorUtils.calcTxferUpHeightEffDrop(basePlayer) : 0;

         const defTxferMulti = isFr ? 1 : 0.5; //(you get a bigger jump as a Fr, see defClassMulti)
         const generalTxferDefPenalty = (basePlayer.team != team) ? defTxferMulti*avgDefBump : 0; //(just the fact that you might not get quite the same off-season bump as a transfer)

         /** TODO: remove this once moving away from JSON */
         const tidy = (inJson: Record<string, number>) => {
            const keys = _.keys(inJson);
            keys.forEach(key => {
               if (!inJson[key]) delete inJson[key];
            });
            return inJson;
         };
         const diags: TeamEditorDiags = {
            off: {
               good: tidy({
                  [isFr ? "fr_yearly_bonus" : "yearly_bonus" ]: 2*offClassMulti*avgOffBump,
                  "undersized_txfer_pen": -0.5*offTxferUpPenalty,
                  "player_gravity_bonus": rapmVsAdjOffDeltaGoodBonus
               }), 
               ok: tidy({
                  [isFr ? "fr_yearly_bonus" : "yearly_bonus" ]: offClassMulti*avgOffBump,
                  "undersized_txfer_pen": -0.75*offTxferUpPenalty,
                  "general_txfer_pen": -0.5*generalTxferOffPenalty,
               }),
               bad: tidy({
                  "undersized_txfer_pen": -offTxferUpPenalty,
                  "general_txfer_pen": -generalTxferOffPenalty,
                  "player_gravity_penalty": -rapmVsAdjOffDeltaBadPenalty
               })
            },
            def: {
               good: tidy({
                  [isFr ? "fr_yearly_bonus" : "yearly_bonus" ]: 2*defClassMulti*avgDefBump,
                  "better_help_txfer_bonus": defTxferUpBetterHelpBump,
                  "undersized_txfer_pen": -0.5*defTxferUpPenalty,
               }),
               ok: tidy({
                  [isFr ? "fr_yearly_bonus" : "yearly_bonus" ]: defClassMulti*avgDefBump,
                  "better_help_txfer_bonuss": 0.5*defTxferUpBetterHelpBump,
                  "undersized_txfer_pen": -0.75*defTxferUpPenalty,
                  "general_txfer_pen": -0.5*generalTxferDefPenalty,
               }),
               bad: tidy({
                  "undersized_txfer_pen": -defTxferUpPenalty,
                  "general_txfer_pen": -generalTxferDefPenalty,
               })
            }
         };
         return diags;
      };
      const applyDiagsToBase = (proj: "good" | "bad" | "ok", 
         diags: TeamEditorDiags, mutableTarget: PureStatSet, basePlayer: PureStatSet,
         filter: Set<DiagCodes> | undefined
      ) => {
         const sumOffAdj = _.chain(diags.off[proj]).filter((value, key) => !filter || filter.has(key as DiagCodes)).sum().value();
         mutableTarget.off_adj_rtg = TeamEditorUtils.addToVal(basePlayer.off_adj_rtg, sumOffAdj)!;
         mutableTarget.off_adj_rapm = TeamEditorUtils.addToVal(basePlayer.off_adj_rapm, sumOffAdj)!;
         const sumDefAdj = _.chain(diags.def[proj]).filter((value, key) => !filter || filter.has(key as DiagCodes)).sum().value();
         mutableTarget.def_adj_rtg = TeamEditorUtils.addToVal(basePlayer.def_adj_rtg, sumDefAdj)!;
         mutableTarget.def_adj_rapm = TeamEditorUtils.addToVal(basePlayer.def_adj_rapm, sumDefAdj)!;
      }
      roster.forEach(triple => {
         // Calculate previous player improvement for regression
         const prevPlayerDiags = triple.prevYear ? calcBasicAdjustments(triple.prevYear, undefined) : undefined;
         const prevPlayerYearlyAdjustment = {};
         if (prevPlayerDiags && triple.prevYear) {
            applyDiagsToBase("ok", prevPlayerDiags, {}, triple.prevYear, new Set([ "fr_yearly_bonus", "yearly_bonus" ] as DiagCodes[]))
         };

         //TODO: apply regression 4:1 (only regress upwards if So, different regression for Fr)

         // Calculate other adjustments on top of the regressed data

         const playerDiags = calcBasicAdjustments(triple.orig, triple.prevYear);
         triple.diag = playerDiags;
         ([ "good", "bad", "ok" ] as ("good" | "bad" | "ok")[]).forEach(proj => {
            applyDiagsToBase(proj, playerDiags, triple[proj], triple.orig, undefined)
         });
      });
      //TODO: turn the adjustment into an ORtg/usage delta for "OK" tier (add off_ortg and off_usg)
   }

   /** More advanced calculations that require the minutes adjustments */
   static calcAdvancedAdjustments(
      roster: GoodBadOkTriple[], 
      team: string, year: string, disabledPlayers: Record<string, boolean>,
   ) {
      // Team defense adjustments ... approx 3/10ths of defense is help defense not involving the player
      // so we'll average that out, but allow players to keep their individual impact, which we'll define as the delta
      // between def_rapm and def_adj_rtg.old_value (very approximate!)
   
      // ends up giving a team-wide 30% bonus/penalty to the average RAPM-adjusted defense delta

      const adjustProjection = (proj: "good" | "bad" | "ok") => {
         const avDefense = 0.2*_.sumBy(roster, p => {
            const defToUse = ((_.isNil((p[proj] as PureStatSet).def_adj_rapm?.value) ? 
               p[proj].def_adj_rtg?.value : (p[proj] as PureStatSet).def_adj_rapm?.value) || 0
            );
            return defToUse*(p[proj].def_team_poss_pct?.value || 0);
         });
         roster.filter(p => !disabledPlayers[p.key]).forEach(p => {
            const defense = ((_.isNil((p[proj] as PureStatSet).def_adj_rapm?.value) ? 
               p[proj].def_adj_rtg?.value : (p[proj] as PureStatSet).def_adj_rapm?.value) || 0
            );
            const indivAdj = defense - ((_.isNil(p[proj].def_adj_rtg?.old_value) ? 
               p[proj].def_adj_rtg?.old_value : p[proj].def_adj_rtg?.value) || 0
            );
            const adjDefense = 0.7*(defense - indivAdj) + 0.3*avDefense + indivAdj;
            const defAdjustment = adjDefense - defense;
            p[proj].def_adj_rtg = TeamEditorUtils.addToVal((p[proj] as PureStatSet).def_adj_rtg, defAdjustment)!;
            p[proj].def_adj_rapm = TeamEditorUtils.addToVal((p[proj] as PureStatSet).def_adj_rapm, defAdjustment); 

            if (p.diag) {
               p.diag.def[proj]["share_team_defense"] = defAdjustment;
            }
         });
      };
      adjustProjection("good");
      adjustProjection("ok");
      adjustProjection("bad");

      //TODO: more advanced
      // 1] if >0.90 of transfer minutes then have a penatly of 0.5/0.5 -> 1.0/1.0 divided across all the players
      // 2] need playmaking (some % of usage>25 or assist>22) else reduce secondary playmakers' offense
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

   /** Statistic manipulation */
   private static addToVal = (s: Statistic | undefined, toAdd: number): Statistic | undefined => {
      if (s && !_.isNil(s.value)) {
         return { 
            value: s.value + toAdd,
            old_value: _.isNil(s.old_value) ? undefined : s.old_value + toAdd
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
         if ((p.posClass == "PG") || (p.posClass == "s-PG") && (heightIn <= 70)) { //5'10-
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
   
   /** To regress Fr players we'll move them in this direction */
   static getAvgProduction(team: string, year: string) {
      const level = _.find(AvailableTeams.byName[team] || [], teamInfo => teamInfo.year == year) || { category: "unknown"};
      const getAvgLevel = () => {
         if (level.category == "high") {
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

   //TODO: also need to handle in-season mins (ie for "what if player goes down" type questions)
}