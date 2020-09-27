////////////////////////////////////////////////////////////////
//
// NOTE: to compile this run "npm run dev" (then ctrl+c once "event - compiled successfully")
// ("npm run build" also works but takes longer)
//

import _ from "lodash";

// API calls
import calculateLineupStats from "./pages/api/calculateLineupStats";

// Post processing
import { LineupDisplayUtils } from "./utils/stats/LineupDisplayUtils";

//process.argv 2... are the command line args passed via "-- (args)"

//const result = marshallLineupRequest

class MutableAsyncResponse {
  constructor() {
    this.statusCode = 0;
    this.resultJson = {};
  }
  status(n) {
    this.statusCode = n;
    return this;
  }
  json(j) {
    this.resultJson = j;
    return this;
  }
}

async function main() {

  const lineupResponse = new MutableAsyncResponse();
  await calculateLineupStats(
    { url: "https://hoop-explorer.com/LineupAnalyzer?baseQuery=&gender=Men&maxRank=400&minRank=0&team=Maryland&year=2019%2F20&" },
    lineupResponse
  );
//  console.log("RECEIVED: " + JSON.stringify(lineupResponse.resultJson));
}

console.log("Start processing with args: " + process.argv);

main().then(_ => {
  console.log("Processing Complete!")
});
