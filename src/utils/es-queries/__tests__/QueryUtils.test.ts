

import _ from 'lodash';

import { QueryUtils } from "../QueryUtils";

describe("QueryUtils", () => {
  test("QueryUtils - basicOrAdvancedQuery", () => {

    const query1 = ' [ test "]';
    const query2 = "te'st";
    const query3 = undefined;
    const query4 = ' NOT ([ test "] )';

    expect(QueryUtils.basicOrAdvancedQuery(query1, "1")).toBe(' test "');
    expect(QueryUtils.basicOrAdvancedQuery(query2, "2")).toBe("players.id:(te'st)");
    expect(QueryUtils.basicOrAdvancedQuery(query3, 'NOT "*"')).toBe('players.id:(NOT "*")');
    expect(QueryUtils.basicOrAdvancedQuery(query4, "4")).toBe('NOT ( test ")');
  });
});
