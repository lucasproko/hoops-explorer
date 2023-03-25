
import _ from 'lodash';
import Enumerable from 'linq';

/** Library accepts strings. but typescript extension doesn't */
type TypeScriptWorkaround1 = (element: any, index: number) => boolean;
type TypeScriptWorkaround2 = (element: any) => unknown;
type EnumToEnum = (e: Enumerable.IEnumerable<any>) => Enumerable.IEnumerable<any>;

/** Utils to build LINQ filter/sort capabilities */
export class AdvancedFilterUtils {

   static readonly operators = [ "&&", "||", "SORT_BY", "ASC", "DESC", "AND", "OR" ];

   static readonly operatorsSet = new Set<string>(AdvancedFilterUtils.operators);

   static readonly playerLeaderBoardAutocomplete = AdvancedFilterUtils.operators.concat([
      // Basic metadata:
      "conf", "team", "year",

      // Advanced metadata:
      "posClass",
      "posConfidences", 
      "roster.number", "roster.height", "roster.year_class", "roster.pos",
      "tier", "transfer_dest",

      // Opposition strength
      "off_adj_opp",
      "def_adj_opp",

      // Possessions
      "off_poss", "off_team_poss_pct",
      "def_poss", "def_team_poss_pct",

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
      "off_usage", "off_assist", "off_ast_rim", "off_ast_mid", "off_ast_threep",
      "off_twoprimr", "off_twopmidr", "off_threepr", 

      // Shot-making
      "off_threep", "off_twop", "off_twopmid", "off_twoprim", "off_ft",
      "off_threep_ast", "off_twop_ast", "off_twopmid_ast", "off_twoprim_ast",

      // Scramble:
      "off_scramble_twop", "off_scramble_twop_ast", "off_scramble_threep", "off_scramble_threep_ast", "off_scramble_twoprim", "off_scramble_twoprim_ast", "off_scramble_twopmid", 
      "off_scramble_twopmid_ast", "off_scramble_ft", "off_scramble_ftr", "off_scramble_twoprimr", "off_scramble_twopmidr", "off_scramble_threepr", "off_scramble_assist",

      // Transition:
      "off_trans_twop", "off_trans_twop_ast", "off_trans_threep", "off_trans_threep_ast", "off_trans_twoprim", "off_trans_twoprim_ast", "off_trans_twopmid", 
      "off_trans_twopmid_ast", "off_trans_ft", "off_trans_ftr", "off_trans_twoprimr", "off_trans_twopmidr", "off_trans_threepr", "off_trans_assist",

      // Other:
      "off_orb", "def_orb",

      // These need to be created by substitution:
      "def_stl", "def_blk", // (these don't exist: def_stl is def_2prim, def_blk is def_to)
      "def_fc", //(doesn't exist: def_ftr)

      // Transfers only, predicted:
      "off_adj_rapm_pred", "def_adj_rapm_pred", "off_rtg_pred", "off_usage_pred", "adj_rapm_margin_pred"
   ]);

   static playerSeasonComparisonAutocomplete = _.flatMap([ "prev_", "next_" ], prefix => {
      return _.flatMap(AdvancedFilterUtils.playerLeaderBoardAutocomplete, field => {
         if (AdvancedFilterUtils.operatorsSet.has(field)) {
            return (prefix == "prev_") ? [ field ] : []; //(return operators just once)
         } else {
            return [ `${prefix}${field}` ];
         }
      });
   });

   static fixBoolOps(s: String) { return s.replace(/ AND /g, " && ").replace(/ OR /g, " || ") };
   static fieldReplacements(s: string) { 
      return s.replace(/twop/g, "2p").replace(/threep/g, "3p")
         .replace(/def_blk/g, "def_2prim").replace(/def_stl/g, "def_to").replace(/def_fc/g, "def_ftr")
         .replace(/(off|def)_poss/g, "$1_team_poss"); 
   }
   static singleYearfixObjectFormat(s: string) { 
      return s
         .replace(/((?:off|def)_[0-9a-zA-Z_]+)/g, "$.p.$1?.value")
         .replace(/(^| |[(])(adj_[0-9a-zA-Z_]+)/g, "$1$.$2")
         .replace(/roster[.]height/g, "$.normht")
         .replace(/transfer_dest/g, "$.transfer_dest")
         .replace(/(^| |[(])(roster[.][a-z]+|posC[a-z]+|tier|team|conf|year)/g, "$1$.p.$2")
         .replace(/[$][.]p[.]def_ftr[?][.]value/g, "(100*$.p.def_ftr?.value)")
      ; 
   }
   static multiYearfixObjectFormat(s: string) { 
      return s
         .replace(/(prev|next)_((?:off|def)_[0-9a-zA-Z_]+)/g, "$.$1.p.$2?.value")
         .replace(/(^| |[(])(prev|next)_(adj_[0-9a-zA-Z_]+)/g, "$1.$.$2.$3")
         .replace(/(prev|next)_roster[.]height/g, "$.$1.normht")
         .replace(/(prev|next)_transfer_dest/g, "$.$1.transfer_dest")
         .replace(/(^| |[(])(prev|next)_(roster[.][a-z]+|posC[a-z]+|tier|team|conf|year)/g, "$1$.p.$2.$3")
         .replace(/[$][.](prev|next)[.]def_ftr[?][.]value/g, "(100*$.$1.def_ftr?.value)")
      ; 
   }
   static avoidAssigmentOperator(s: string) {
      return s.replace(/([^!<>])=[=]*/g, "$1==");
   }
   static normHeightInQuotes(s: string) { return s.replace(/['"]([567])[-']([0-9])['"]/, "'$1-0$2'"); }
   static normHeightString(s: string) { return s.replace(/^([567])-([0-9])$/, "$1-0$2"); }
   static removeAscDesc(s: string) { return s.replace(/(ASC|DESC)/g, ""); }

   static readonly tidyClauses: (s: string,  multiYear: boolean) => string = 
      (s: string, multiYear: boolean) => _.flow([
         AdvancedFilterUtils.fixBoolOps,
         AdvancedFilterUtils.avoidAssigmentOperator,
         AdvancedFilterUtils.fieldReplacements,
         multiYear ? AdvancedFilterUtils.multiYearfixObjectFormat : AdvancedFilterUtils.singleYearfixObjectFormat,
         AdvancedFilterUtils.normHeightInQuotes,
         AdvancedFilterUtils.removeAscDesc,
         _.trim,
      ])(s, multiYear);

   /** Builds a where/orderBy chain by interpreting the string either side of SORT_BY */
   static applyFilter(inData: any[], filterStr: string, multiYear: boolean = false): [any[], string | undefined] {
      const filterFrags = filterStr.split("SORT_BY");
      const where = AdvancedFilterUtils.tidyClauses(filterFrags[0], multiYear);
      
      const sortingFrags = _.drop(filterFrags, 1);

      //DIAG:
      console.log(`?Q = ${where} SORT_BY: ${sortingFrags.map(s => AdvancedFilterUtils.tidyClauses(s, multiYear))}`);

      const sortByFns: Array<EnumToEnum> = sortingFrags.map((sortingFrag, index) => {
         const isAsc = sortingFrag.indexOf("ASC") >= 0;
         const sortBy = AdvancedFilterUtils.tidyClauses(sortingFrag, multiYear);   

         if (index == 0) {
            return (enumerable: Enumerable.IEnumerable<any>) => {
               return isAsc ? 
                  enumerable.orderBy(sortBy as unknown as TypeScriptWorkaround2) :
                  enumerable.orderByDescending(sortBy as unknown as TypeScriptWorkaround2)
            };
         } else {
            return (enumerable: Enumerable.IEnumerable<any>) => {
               return isAsc ? 
                  (enumerable as Enumerable.IOrderedEnumerable<any>).thenBy(sortBy as unknown as TypeScriptWorkaround2) :
                  (enumerable as Enumerable.IOrderedEnumerable<any>).thenByDescending(sortBy as unknown as TypeScriptWorkaround2)
            };
         }
      });
      
      try {
         const buildSingleYearRetVal = (p: any) => {
            const retVal = { 
               p: p,
               transfer_dest: p.transfer_dest || "",
               // Normalize so can do height comparisons 
               normht: AdvancedFilterUtils.normHeightString(p.roster?.height || ""),
               // These need to be derived
               adj_rapm_margin: (p.off_adj_rapm?.value || 0) - (p.def_adj_rapm?.value || 0),
               adj_rtg_margin: (p.off_adj_rtg?.value || 0) - (p.def_adj_rtg?.value || 0),
               adj_rapm_prod_margin: (p.off_adj_rapm?.value || 0)*(p.off_team_poss_pct?.value || 0) - 
                                       (p.def_adj_rapm?.value || 0)*(p.def_team_poss_pct?.value || 0),
               adj_prod_margin: (p.off_adj_rtg?.value || 0)*(p.off_team_poss_pct?.value || 0) - 
                                       (p.def_adj_rtg?.value || 0)*(p.def_team_poss_pct?.value || 0),
               // Already have these but makes the query formatting simpler
               adj_rapm_margin_rank: p.adj_rapm_margin_rank,
               adj_rtg_margin_rank: p.adj_rtg_margin_rank,
               adj_rapm_prod_margin_rank: p.adj_rapm_prod_margin_rank,
               adj_prod_margin_rank: p.adj_prod_margin_rank,
               adj_rapm_margin_pred: (p.off_adj_rapm_pred?.value || 0) - (p.def_adj_rapm_pred?.value || 0),
            }; 
            //DIAG:
            //if (index < 10) console.log(`OBJ ${JSON.stringify({ ...retVal, p: undefined })}`);
            return retVal;
         };
         const buildMultiYearRetVal = (p: any) => {
            const retVal = {
               p: p,
               prev: buildSingleYearRetVal(p.orig),
               next: buildSingleYearRetVal(p.actualResult),
            };
            //DIAG:
            //if (index < 10) console.log(`OBJ ${JSON.stringify({ ...retVal, p: undefined })}`);
            return retVal;
         };

         const enumData = Enumerable.from(inData.map((p, index) => { 
            return multiYear ? buildMultiYearRetVal(p) : buildSingleYearRetVal(p);
         }));
         const filteredData = where.length > 0 ? enumData.where(where as unknown as TypeScriptWorkaround1) : enumData;
         const sortedData = sortByFns.length > 0 ? 
            _.flow(sortByFns)(filteredData)
               .thenBy((p: any) => {
                  const sortPoss = multiYear ?
                     (p.p?.actualResults?.off_team_poss?.value || 0) :
                     (p.p?.baseline?.off_team_poss?.value || 0);
                  return sortPoss;
               })
               .thenBy((p: any) => p.p?.key) //(ensure player duplicates follow each other)
            :
            filteredData
            ;

         return [ sortedData.toArray().map((p: any) => p.p), undefined ];
      } catch (e) {
         return [ inData, `${e.message} in ${where}` ];
      }
   }

}