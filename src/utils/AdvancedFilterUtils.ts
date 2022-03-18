
import _ from 'lodash';
import Enumerable from 'linq';

/** Library accepts strings. but typescript extension doesn't */
type TypeScriptWorkaround1 = (element: any, index: number) => boolean;
type TypeScriptWorkaround2 = (element: any) => unknown;

/** Utils to build LINQ filter/sort capabilities */
export class AdvancedFilterUtils {

   static readonly playerLeaderBoardAutocomplete = [
      "&&", "||", "SORT_BY", "ASC", "DESC",

      "off_adj_rapm",
      "def_adj_rapm",
      "off_3p"  
   ];


   static fixObjectFormat(s: string) { return s.replace(/((?:off|def)_[0-9a-zA-Z_]+)/g, "$.$1.value"); }

   /** Builds a where/orderBy chain by interpreting the string either side of SORT_BY */
   static applyFilter(inData: any[], filterStr: string): [any[], string | undefined] {
      const filterFrags = filterStr.split("SORT_BY");

      const where = _.flow([
         _.trim,
         AdvancedFilterUtils.fixObjectFormat
      ])(filterFrags[0]);
      
      const sortBy = _.flow([
         _.trim,
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
            ) : filteredData;

         return [ sortedData.toArray(), undefined ];
      } catch (e) {
/**/
console.log(`[${e.message}]: [${where}][${sortBy}]`);

         return [ inData, e.message ]
      }
   }

}