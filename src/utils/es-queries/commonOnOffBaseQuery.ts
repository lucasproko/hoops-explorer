
export const commonOnOffBaseQuery = function(params: any) {
  return {
    "filters": {
       "off": {
          "query_string": {
             "query": `players.id:((${params.offQuery || "NOT *"}) AND (${params.baseQuery || "*"}))`
          }
       },
       "on": {
          "query_string": {
            "query": `players.id:((${params.onQuery || "NOT *"}) AND (${params.baseQuery || "*"}))`
          }
       },
       "baseline": {
          "query_string": {
             "query": `players.id:(${params.baseQuery || "*"})`
          }
       }
    }
  };
}
