
import _ from "lodash";
import { IndivStatSet } from '../StatModels';

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
      return `${p.key}::`;
      } else if (currTeam == p.team) {
      return `${p.key}::${p.year}`;
      } else if (currYear == p.year) {
      return `${p.key}:${p.team}:`;
      } else {
      return `${p.key}:${p.team}:${p.year}`;
      }
   };


   /** Pulls out the players from the designated team */
   static getBasePlayers(
      team: string, players: IndivStatSet[], cache: Record<string, GoodBadOkTriple>, 
      includeSeniors: boolean, excludeSet: Record<string, boolean>
   ): GoodBadOkTriple[] {
      return players.filter(
         p => (p.team == team) 
               && !cache[p.code || ""] && !excludeSet[p.code || ""] 
                  && (includeSeniors || (p.roster?.year_class != "Sr"))
      ).map(p => {
         return {
            key: `${p.code}::`,
            good: _.clone(p),
            ok: _.clone(p),
            bad: _.clone(p),
            orig: p
         };
      }).concat(_.values(cache));
   }
}