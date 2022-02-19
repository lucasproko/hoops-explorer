
import { commonOnOffBaseQuery } from "../commonOnOffBaseQuery";
import { GameFilterParams } from '../../FilterModels';

describe("commonOnOffBaseQuery", () => {
  test("commonOnOffBaseQuery", () => {

    const query1: GameFilterParams = {};

    const query2: GameFilterParams = {
      onQuery: "query1a",
      offQuery: "[query1b]",
      baseQuery: "query1c"
    };

    const query3: GameFilterParams = {
      onQuery: "query1a",
      onQueryFilters: "Home,Conf",
      offQuery: "[query1b]",
      offQueryFilters: "Away",
      baseQuery: "query1c",
    };

    const query4: GameFilterParams = {
      onQuery: "",
      onQueryFilters: "Not-Home",
      offQuery: "",
      autoOffQuery: true,
      baseQuery: "",
    };

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
    expect(commonOnOffBaseQuery(query3, 0)).toEqual({
      filters: {
        off: {
          bool: {
            must: [
              {
                query_string: {
                  query: `(query1b) AND (players.id:(query1c))`
                }      
              },
              {
                term: {
                  "location_type.keyword": "Away"
                }
              }
            ],
            must_not: []
          }
        },
        on: {
          bool: {
            must: [
              {
                query_string: {
                  query: `(players.id:(query1a)) AND (players.id:(query1c))`
                }
              },
              {
                query_string: {
                  query: `in_conf:true`
                }
              },
              {
                term: {
                  "location_type.keyword": "Home"
                }
              }
            ],
            must_not: []
          }
        },
        baseline: {
          query_string: {
            query: `players.id:(query1c)`
          }
        },
      }
    });
    expect(commonOnOffBaseQuery(query4, 0)).toEqual({
      filters: {
        off: {
          bool: {
            must: [
              {
                query_string: {
                  query: `players.id:(*)`
                }      
              },
            ],
            must_not: [
              {
                query_string: {
                  query: `players.id:(NOT *)`
                }      
              },
              {
                query_string: {
                  query: `location_type.keyword:(Away OR Neutral)`
                }
              }
            ],
          }
        },
        on: {
          bool: {
            must: [
              {
                query_string: {
                  query: `(players.id:(*)) AND (players.id:(*))`
                }
              },
              {
                query_string: {
                  query: `location_type.keyword:(Away OR Neutral)`
                }
              }
            ],
            must_not: []
          }
        },
        baseline: {
          query_string: {
            query: `players.id:(*)`
          }
        },
      }
    });
  });
});
