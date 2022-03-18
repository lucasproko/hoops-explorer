
import _ from 'lodash';
import Enumerable from 'linq';

/** Library accepts strings. but typescript extension doesn't */
type TypeScriptWorkaround1 = (element: any, index: number) => boolean;
type TypeScriptWorkaround2 = (element: any) => unknown;

/** Utils to build LINQ filter/sort capabilities */
export class AdvancedFilterUtils {

   static readonly playerLeaderBoardAutocomplete = [
      "&&", "||", "SORT_BY", "ASC", "DESC",

      // Basic metadata:
      "conf", "team", "year",

      // Advanced metadata:
      "posClass",
      "posConfidences", 
      "roster.number", "roster.height", "roster.year_class", "roster.pos",
      "tier",

      // Opposition strength
      "off_adj_opp",
      "def_adj_opp",

      // Possessions
      "off_poss", "off_team_poss", "off_team_poss_pct",
      "def_poss", "def_team_poss", "def_team_poss_pct",

      // Four factors
      "off_efg", "off_to", "off_ftr",

      // Overall:
      "adj_rtg_margin", "adj_prod_margin", "adj_rapm_margin", "adj_rapm_prod_margin",
      "adj_rtg_margin_rank", "adj_prod_margin_rank", "adj_rapm_margin_rank", "adj_rapm_prod_margin_rank",

      "off_rtg", "off_adj_rtg", "off_adj_prod", "off_adj_rapm", "off_adj_rapm_prod",
      "off_adj_rtg_rank", "off_adj_prod_rank", "off_adj_rapm_rank", "off_adj_rapm_prod_rank",

      "def_rtg", "def_adj_rtg", "def_adj_prod", "def_adj_rapm", "def_adj_prod",
      "def_adj_rtg_rank", "def_adj_prod_rank", "def_adj_rapm_rank", "def_adj_rapm_prod_rank",

      // Shot creation
      "off_usage", "off_assist", "off_ast_rim", "off_ast_mid", "off_ast_3p",
      "off_2primr", "off_2pmidr", "off_3pr", 

      // Shot-making
      "off_3p", "off_2p", "off_2pmid", "off_2prim", "off_ft",
      "off_3p_ast", "off_2p_ast", "off_2pmid_ast", "off_2prim_ast",

      // Scramble:
      "off_scramble_2p", "off_scramble_2p_ast", "off_scramble_3p", "off_scramble_3p_ast", "off_scramble_2prim", "off_scramble_2prim_ast", "off_scramble_2pmid", 
      "off_scramble_2pmid_ast", "off_scramble_ft", "off_scramble_ftr", "off_scramble_2primr", "off_scramble_2pmidr", "off_scramble_3pr", "off_scramble_assist",

      // Transition:
      "off_trans_2p", "off_trans_2p_ast", "off_trans_3p", "off_trans_3p_ast", "off_trans_2prim", "off_trans_2prim_ast", "off_trans_2pmid", 
      "off_trans_2pmid_ast", "off_trans_ft", "off_trans_ftr", "off_trans_2primr", "off_trans_2pmidr", "off_trans_3pr", "off_trans_assist",

      // Other:
      "off_orb", "def_orb",

      // These need to be created by substitution:
      "def_stl", "def_blk", // (these don't exist: def_stl is def_2prim, def_blk is def_to)
      "def_fc50", //(doesn't exist: def_ftr)
   ];

   static fieldReplacements(s: string) { return s.replace("def_blk", "def_2prim").replace("def_stl", "def_to").replace("def_fc50", "def_ftr"); }
   static fixObjectFormat(s: string) { return s.replace(/((?:off|def|adj)_[0-9a-zA-Z_]+)/g, "$.$1.value"); }

   /** Builds a where/orderBy chain by interpreting the string either side of SORT_BY */
   static applyFilter(inData: any[], filterStr: string): [any[], string | undefined] {
      const filterFrags = filterStr.split("SORT_BY");

      const where = _.flow([
         _.trim,
         AdvancedFilterUtils.fieldReplacements,
         AdvancedFilterUtils.fixObjectFormat
      ])(filterFrags[0]);
      
      const sortBy = _.flow([
         _.trim,
         AdvancedFilterUtils.fieldReplacements,
         AdvancedFilterUtils.fixObjectFormat,
         s => s.replace("ASC", "").replace("DESC", "")
      ])(filterFrags?.[1] || "")
      
      const isAsc = (filterFrags?.[1] || "").indexOf("ASC") >= 0;

      try {
         const enumData = Enumerable.from(inData);
         const filteredData = where.length > 0 ? enumData.where(where as unknown as TypeScriptWorkaround1) : enumData;
         const sortedData = sortBy.length > 0 ? 
            (isAsc ? 
               filteredData.orderBy(sortBy as unknown as TypeScriptWorkaround2) :
               filteredData.orderByDescending(sortBy as unknown as TypeScriptWorkaround2)
            ).thenBy(p => p.baseline?.off_team_poss?.value || 0).thenBy(p => p.key) //(ensure player duplicates follow each other)
         : filteredData;

         return [ sortedData.toArray(), undefined ];
      } catch (e) {
         return [ inData, e.message ];
      }
   }

}