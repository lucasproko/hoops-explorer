import * as fs from "fs";

/** Run "cat ./raw_shot_chart_averages.json | npm run test src/__tests__/buildShotChartAverages.test.ts  -- --coverage=false"
 * to build.
 * Then copy the output (./output.json) to src/utils/internal-data/ShotChartAvgs_G*_YYYY.js
 * (eg Men_2024 / Women_2024) is and rename XXX in the code with the same G*_YYYY
 * See below for JSON used to build shot chart averages file from ES (sub women for men).
 */
describe("buildShotChartAverages", () => {
  test("create shot chart averages ", async () => {
    const processData = (data: InputData): OutputData => {
      const totalHits = data.hits.total.value;

      const result: OutputData = {};

      data.aggregations.shot_chart.buckets.forEach((bucket) => {
        const avgFreq = parseFloat((bucket.doc_count / totalHits).toFixed(3));
        const avgPpp = parseFloat(
          (bucket.total_pts.value / bucket.doc_count).toFixed(3)
        );

        result[bucket.key] = {
          loc: [
            parseFloat(bucket.center.location.x.toFixed(1)),
            parseFloat(bucket.center.location.y.toFixed(1)),
          ],
          avg_freq: avgFreq,
          avg_ppp: avgPpp,
        };
      });

      return result;
    };

    // Read input from stdin
    const stdin = process.stdin;
    let inputData = "";

    stdin.setEncoding("utf-8");
    stdin.on("data", (chunk) => {
      inputData += chunk;
    });

    stdin.on("end", () => {
      try {
        const parsedData: InputData = JSON.parse(inputData);
        const output = processData(parsedData);

        // Write the result to a file or log to the console
        const outputFilePath = "output.json";
        fs.writeFileSync(
          outputFilePath,
          "export const ShotChartAvgs_XXX = \n" +
            JSON.stringify(output, null, 2),
          "utf-8"
        );
      } catch (error: unknown) {
        console.error("Error processing input:", (error as any).message);
        process.exit(1);
      }
    });
  });
});

// Define the input and output types for clarity
interface InputData {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: null | number;
    hits: any[];
  };
  aggregations: {
    shot_chart: {
      buckets: Array<{
        key: string;
        doc_count: number;
        center: {
          location: {
            x: number;
            y: number;
          };
        };
        total_pts: {
          value: number;
        };
      }>;
    };
  };
}

interface OutputData {
  [key: string]: {
    loc: [number, number];
    avg_freq: number;
    avg_ppp: number;
  };
}

// POST shot_events_men_*_2023*,shot_events_men_*n_2024*/_search?q=is_off:true
// {
//   "size": 0,
//   "track_total_hits": true,
//   "aggs": {
//     "shot_chart": {
//             "geohex_grid": {
//               "field": "geo",
//               "precision": 14
//             },
//             "aggs": {
// "center": {
//   "cartesian_centroid": { "field": "loc" }
// },
//             "total_pts": {
//               "sum": {
//                 "field": "pts"
//               }
//             }
//             }
//     }
//   }
// }
