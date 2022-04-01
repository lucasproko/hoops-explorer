
import _ from "lodash";
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
      team: string, players: IndivStatSet[], cache: Record<string, GoodBadOkTriple>, 
      includeSeniors: boolean, excludeSet: Record<string, boolean>, 
      transfers: Record<string, Array<{f: string, t?: string}>>
   ): GoodBadOkTriple[] {
      return players.filter(
         p => (_.some(transfers[p.code || ""] || [], p => p.t == team)  //transferring in
            || 
            ((p.team == team)                
               && (includeSeniors || (p.roster?.year_class != "Sr"))
                  && !_.some(transfers[p.code || ""] || [], p => p.f == team) //(transferring out...)
            ))
            && !cache[p.code || ""] && !excludeSet[p.code || ""] //(not in exclude lists)
      ).map(p => {
         const isTransfer = p.team != team;
         return {
            key: isTransfer ? `${p.code}:${p.team}:` : `${p.code}::`,
            good: _.clone(p),
            ok: _.clone(p),
            bad: _.clone(p),
            orig: p
         };
      }).concat(_.values(cache));
   }

   /** Give players their year-on-year improvement */
   static calcAndInjectYearlyImprovement(
      roster: GoodBadOkTriple[], 
      team: string, teamSosOff: number, teamSosDef: number, avgEff: number
   ) {
      const addToVal = (s: Statistic | undefined, toAdd: number): Statistic | undefined => {
         if (s && s.value) {
            return { value: s.value + toAdd };
         } else {
            return undefined;
         }
      }
      roster.forEach(p => {
         const avgOffBump = 0.6; //(1.5 ORtg + 1 usage)
         const offClassMulti = (p.orig.roster?.year_class == "Fr") ? 2 : 1;
         const defSosDeltaForTxfers = teamSosDef - (p.orig.def_adj_opp?.value || (avgEff - 4));
         const isTransferringUpOff = ((p.orig.team != team) && (defSosDeltaForTxfers < -4));
         const offTxferPenalty =
            isTransferringUpOff ? -TeamEditorUtils.calcTxferUpHeightEffDrop(p) : 0;

         p.good.off_adj_rapm = addToVal(
            (p.orig as PureStatSet).off_adj_rapm, 2*offClassMulti*avgOffBump - 0.5*offTxferPenalty
         );
         p.good.off_adj_rtg = addToVal(
            (p.orig as PureStatSet).off_adj_rtg, 2*offClassMulti*avgOffBump - 0.5*offTxferPenalty
         ) || p.good.off_adj_rtg;

         p.ok.off_adj_rapm = addToVal(
            (p.orig as PureStatSet).off_adj_rapm, offClassMulti*avgOffBump - 0.5*offTxferPenalty
         );
         p.ok.off_adj_rtg = addToVal(
            (p.orig as PureStatSet).off_adj_rtg, offClassMulti*avgOffBump - 0.5*offTxferPenalty
         ) || p.good.off_adj_rtg;

         p.bad.off_adj_rapm = addToVal((p.orig as PureStatSet).off_adj_rapm, -offTxferPenalty);
         p.bad.off_adj_rtg = addToVal((p.orig as PureStatSet).off_adj_rtg, -offTxferPenalty) || p.bad.off_adj_rtg;

         const avgDefBump = -0.6; //(just make the same as the offensive bump, I don't believe there is any data)
         const defClassMulti = (p.orig.roster?.year_class == "Fr") ? 2 : 0.5; //(I'm going to assert without evidence the Fr bump for defense is relatively bigger)
         const offSosDeltaForTxfers = teamSosOff - (p.orig.off_adj_opp?.value || (avgEff + 4));
         const isTransferringUpDef = ((p.orig.team != team) && (offSosDeltaForTxfers > 4));
         const defTxferBump =
            isTransferringUpDef ? -0.5 : //(approx 50% of approx 50% help * avg delta of 2 between high and low majors)
            0; //(for players transferring up a decent amount, give their defense a bump because the help defense should be better)

         const defTxferPenalty =
            isTransferringUpDef ? TeamEditorUtils.calcTxferUpHeightEffDrop(p) : 0;

         p.good.def_adj_rapm = addToVal(
            (p.orig as PureStatSet).def_adj_rapm, 2*defClassMulti*avgDefBump + defTxferBump - 0.5*defTxferPenalty
         );
         p.good.def_adj_rtg = addToVal(
            (p.orig as PureStatSet).def_adj_rtg, 2*defClassMulti*avgDefBump + defTxferBump - 0.5*defTxferPenalty
         ) || p.good.def_adj_rtg;

         p.ok.def_adj_rapm = addToVal(
            (p.orig as PureStatSet).def_adj_rapm, defClassMulti*avgDefBump + 0.5*(defTxferBump - defTxferPenalty)
         );
         p.ok.def_adj_rtg = addToVal(
            (p.orig as PureStatSet).def_adj_rtg, defClassMulti*avgDefBump + 0.5*(defTxferBump - defTxferPenalty)
         ) || p.ok.def_adj_rtg;

         p.bad.def_adj_rapm = addToVal((p.orig as PureStatSet).def_adj_rapm, -defTxferPenalty);
         p.bad.def_adj_rtg = addToVal((p.orig as PureStatSet).def_adj_rtg, -defTxferPenalty) || p.bad.def_adj_rtg;
      });

      //TODO: turn the adjustment into an ORtg/usage delta for "OK" tier
   }

   /** Calculate minutes assignment, mutates roster */
   static calcAndInjectMinsAssignment(
      roster: GoodBadOkTriple[], 
      team: string, disabledPlayers: Record<string, boolean>,
      teamSosNet: number, avgEff: number
   ) {
      const getOffRapm = (s: PureStatSet) => (s.off_adj_rapm || s.off_adj_rtg)?.value || 0;
      const getDefRapm = (s: PureStatSet) => (s.def_adj_rapm || s.def_adj_rtg)?.value || 0;
      const getNetRapm = (s: PureStatSet) => getOffRapm(s) - getDefRapm(s);
      const getOffAdjRtg = (s: PureStatSet) => s.off_adj_rtg?.value || 0;
      const getMixedNet = (s: PureStatSet) => getOffAdjRtg(s) - getDefRapm(s);
      const getNet = (s: PureStatSet) => Math.max(getNetRapm(s), getMixedNet(s));
      
      const filteredRoster = roster.filter(p => !disabledPlayers[p.key]);

      const netRatings = _.sortBy(filteredRoster.map(p => getNet(p.ok)));
      const tierSize = Math.ceil(_.size(netRatings)/3) || 1;
      const avgLowerTierNet = _.sum(_.take(netRatings, tierSize))/tierSize;
      const avgUpperTierNet = _.sum(_.take(_.reverse(netRatings), tierSize))/tierSize;
      // middle tier is unreliable if the team size is small, but we don't really care about that so just do something vaguely sane:
      const avgMidTierNetTmp = _.sum(_.take(_.drop(netRatings, tierSize - 1), tierSize + 1))/(tierSize + 2);
      const avgMidTierNet = (avgMidTierNetTmp < avgLowerTierNet) ? (2*avgLowerTierNet + avgUpperTierNet)/3 : avgMidTierNetTmp;

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

      // First pass - calc minutes purely based on tier:
      filteredRoster.forEach(p => {
         //(TODO: calc mins differently per tier?)
         const baseMins = TeamEditorUtils.netTierToBaseMins(getNet(p.ok), [ avgLowerTierNet, avgMidTierNet, avgUpperTierNet ]);
         const minMins = minMinsPerKey[p.key] || baseMins;
         const maxMins = maxMinsPerKey[p.key] || baseMins;
         const adjBaseMins: Statistic = { value: Math.max(Math.min(baseMins, maxMins), minMins) };
         p.good.off_team_poss_pct = adjBaseMins;
         p.good.def_team_poss_pct = adjBaseMins;
         p.ok.off_team_poss_pct = adjBaseMins;
         p.ok.def_team_poss_pct = adjBaseMins;
         p.bad.off_team_poss_pct = adjBaseMins;
         p.bad.def_team_poss_pct = adjBaseMins;
      });

      //TODO: generic fr need to be handled as special cases

      // const pass1MinsPerKey = _.chain(filteredRoster).map(p => {

      //    const pNet = getNet(p.ok);
      //    if (pNet < avgLowerTierNet)


      // }).fromPairs().value();

      //TODO: special cases at PG and C?

      //TODO: have target 10-20 mpg if in tier1, 21-29 mpg in tier2, 30-35 mpg if in tier3
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

   //TODO: also need to handle in-season mins (ie for "what if player goes down" type questions)
}