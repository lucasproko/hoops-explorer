
import _ from "lodash";
import { IndivStatSet } from '../StatModels';

export type GoodBadOkTriple = {
   good: IndivStatSet,
   ok: IndivStatSet,
   bad: IndivStatSet
};

/** Data manipulation functions for the TeamEditorTable */
export class TeamEditorUtils {

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
            good: _.clone(p),
            ok: _.clone(p),
            bad: _.clone(p),
         };
      }).concat(_.values(cache));
   }
}