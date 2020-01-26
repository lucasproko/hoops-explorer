

import _ from 'lodash';

import { QueryUtils } from "../QueryUtils";

describe("QueryUtils", () => {
  test("QueryUtils - parse/stringify", () => {
    //(just test lineupQuery/baseQuery handling)
    expect(QueryUtils.stringify({lineupQuery: "a", otherField: true})).toEqual(
      "baseQuery=a&otherField=true"
    )
    expect(QueryUtils.parse("lineupQuery=a&otherField=true&numField=1")).toEqual(
      {baseQuery: "a", otherField: true, numField: "1"}
    )
  });
  test("QueryUtils - basicOrAdvancedQuery", () => {

    const query1 = ' [ test "]';
    const query2 = "te'st";
    const query3 = undefined;
    const query4 = ' NOT ([ test "] )';
    const query5 = '{"Cowan, Ant";Morsell;Ayala}~2'
    const query6 = '[players.id:{"Cowan, Ant";Morsell;Ayala}~2]'

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
  });
});
