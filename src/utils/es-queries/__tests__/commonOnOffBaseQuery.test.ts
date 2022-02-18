
import { commonOnOffBaseQuery } from "../commonOnOffBaseQuery";

describe("commonOnOffBaseQuery", () => {
  test("commonOnOffBaseQuery", () => {

    const query1 = {};

    const query2 = {
      onQuery: "query1a",
      offQuery: "[query1b]",
      baseQuery: "query1c"
    };

    //TODO: test with queryFilters (includng the auto-off case)

    expect(commonOnOffBaseQuery(query1, 0)).toEqual({
      filters: {
        off: {
          query_string: {
            query: `(players.id:(NOT *)) AND (players.id:(*))`
          }
        },
        on: {
          query_string: {
            query: `(players.id:(NOT *)) AND (players.id:(*))`
          }
        },
        baseline: {
          query_string: {
            query: `players.id:(*)`
          }
        },
      }
    });

    expect(commonOnOffBaseQuery(query2, 0)).toEqual({
      filters: {
        off: {
          query_string: {
            query: `(query1b) AND (players.id:(query1c))`
          }
        },
        on: {
          query_string: {
            query: `(players.id:(query1a)) AND (players.id:(query1c))`
          }
        },
        baseline: {
          query_string: {
            query: `players.id:(query1c)`
          }
        },
      }
    });
  });
});
