

import _ from 'lodash';

import { QueryUtils } from "../QueryUtils";
import { CommonFilterParams } from "../FilterModels";

describe("QueryUtils", () => {
  test("QueryUtils - parse/stringify", () => {
    //(just test lineupQuery/baseQuery handling)
    expect(QueryUtils.stringify({lineupQuery: "a", otherField: true} as CommonFilterParams)).toEqual(
      "baseQuery=a&otherField=true"
    )
    expect(QueryUtils.parse("lineupQuery=a&otherField=true&numField=1")).toEqual(
      {baseQuery: "a", otherField: true, numField: "1"}
    )
    // Check garbageFilter handling
    expect(QueryUtils.stringify({lineupQuery: "a", filterGarbage: true} as CommonFilterParams)).toEqual(
      "baseQuery=a&filterGarbage=true"
    )
    expect(QueryUtils.stringify({lineupQuery: "a", filterGarbage: false} as CommonFilterParams)).toEqual(
      "baseQuery=a"
    )
  });
  test("QueryUtils - basicOrAdvancedQuery", () => {

    const query1 = ' [ test "]';
    const query2 = "te'st";
    const query3 = undefined;
    const query4 = ' NOT ([ test "] )';
    const query5 = '{"Cowan, Ant";Morsell;Ayala}~2'
    const query6 = '[players.id:{"Cowan, Ant";Morsell;Ayala}~2]'
    const query6b = '[players.id:{"Cowan, Ant";Morsell;Ayala}=2]'
    const query7 = '{Morsell;Ayala}=1'
    const query8 = '[players.id:{Cowan;Morsell;Ayala}=1]'

    expect(QueryUtils.basicOrAdvancedQuery(query1, "1")).toBe(' test "');
    expect(QueryUtils.basicOrAdvancedQuery(query2, "2")).toBe("players.id:(te'st)");
    expect(QueryUtils.basicOrAdvancedQuery(query3, 'NOT "*"')).toBe('players.id:(NOT "*")');
    expect(QueryUtils.basicOrAdvancedQuery(query4, "4")).toBe('NOT ( test ")');
    expect(QueryUtils.basicOrAdvancedQuery(query5, "fallback")).toBe(
      `players.id:((("Cowan, Ant" AND Morsell) OR ("Cowan, Ant" AND Ayala) OR (Morsell AND Ayala)))`
    );
    expect(QueryUtils.basicOrAdvancedQuery(query6, "fallback")).toBe(
      `players.id:(("Cowan, Ant" AND Morsell) OR ("Cowan, Ant" AND Ayala) OR (Morsell AND Ayala))`
    );
    expect(QueryUtils.basicOrAdvancedQuery(query6b, "fallback")).toBe(
      `players.id:((("Cowan, Ant" AND Morsell) AND NOT (Ayala)) OR (("Cowan, Ant" AND Ayala) AND NOT (Morsell)) OR ((Morsell AND Ayala) AND NOT ("Cowan, Ant")))`
    );
    expect(QueryUtils.basicOrAdvancedQuery(query7, "fallback")).toBe(
      `players.id:((((Morsell) AND NOT (Ayala)) OR ((Ayala) AND NOT (Morsell))))`  
    );
    expect(QueryUtils.basicOrAdvancedQuery(query8, "fallback")).toBe(
      `players.id:(((Cowan) AND NOT (Morsell OR Ayala)) OR ((Morsell) AND NOT (Cowan OR Ayala)) OR ((Ayala) AND NOT (Cowan OR Morsell)))`
    );
  });
});
