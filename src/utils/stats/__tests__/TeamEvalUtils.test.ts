// Utils:
import _ from 'lodash'
import { TeamEvalUtils } from "../TeamEvalUtils";
import { sampleTeamInfo } from "../../../sample-data/sampleTeamInfo"

describe("TeamEvalUtils", () => {

      // Write the data objects out in pure JS format so we can store them
  expect.addSnapshotSerializer({
    test: (val: any) => true,
    print: (val: any) => JSON.stringify(val, null, 3)
  });

  const testInfo = {
        "off_elite_eff": [
          114.6,
          114.4,
          112.1,
          114.6,
          114.9
        ],
        "def_elite_eff": [
          91.2,
          91.4,
          89.2,
          92.1,
          93.3
        ],
        "off_bubble_eff": [
          106.3,
          110,
          109.5,
          103.6,
          102.8,
          108.3,
          105.7,
          107.3,
          106.1,
          107.1
        ],
        "def_bubble_eff": [
          90.9,
          94.8,
          94.5,
          88.7,
          88.3,
          94.9,
          92.4,
          94,
          92.9,
          93.9
        ]
  };
  test("TeamEvalUtils - calcWinsAbove", () => {
      
    const inCases: [number, number, number][] = [
        [  120.0, 80.0, 3 ],
        [  105.0, 95.0, 3 ],
        [  105.0, 95.0, 0 ],
        [  95.0, 110.0, 3]
    ];
    const resultsBubble = [
        "0.98", "0.26", "0.35", "0.00"        
    ];
    const resultsElite = [
        "0.90", "0.08", "0.12", "0.00"        
    ];

    expect(inCases.map((off_def: [number, number, number]) => 
        TeamEvalUtils.calcWinsAbove(off_def[0], off_def[1], testInfo.off_bubble_eff, testInfo.def_bubble_eff, off_def[2])
    ).map(n => n.toFixed(2))).toEqual(resultsBubble);

    expect(inCases.map((off_def: [number, number, number]) => 
        TeamEvalUtils.calcWinsAbove(off_def[0], off_def[1], testInfo.off_elite_eff, testInfo.def_elite_eff, off_def[2])
    ).map(n => n.toFixed(2))).toEqual(resultsElite);

  });

});