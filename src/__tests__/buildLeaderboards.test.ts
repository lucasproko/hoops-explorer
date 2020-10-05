import { NextApiRequest, NextApiResponse } from 'next';

import _ from "lodash";

import { main, completeLineupLeaderboard, savedLineups, MutableAsyncResponse } from "../bin/buildLeaderboards";

import { sampleLineupStatsResponse } from "../sample-data/sampleLineupStatsResponse";
import { sampleTeamStatsResponse } from "../sample-data/sampleTeamStatsResponse";
import { samplePlayerStatsResponse } from "../sample-data/samplePlayerStatsResponse";

const mockSampleLineupStatsResponse = sampleLineupStatsResponse;
const mockSampleTeamStatsResponse = sampleTeamStatsResponse;
const mockSamplePlayerStatsResponse = samplePlayerStatsResponse;

// Mock the API requests to return the sample data where available, else just an empty list

jest.mock("../pages/api/calculateLineupStats", () =>
  jest.fn().mockImplementation((req: NextApiRequest, res: NextApiResponse) => {
    const mockRes = res as unknown as MutableAsyncResponse;
    mockRes.statusCode = 200;
    if ((req.url || "").indexOf("Maryland") >= 0) {
      mockRes.resultJson = mockSampleLineupStatsResponse;
    } else {
      mockRes.resultJson = {};
    }
  })
);

jest.mock("../pages/api/calculateOnOffStats", () =>
  jest.fn().mockImplementation((req: NextApiRequest, res: NextApiResponse) => {
    const mockRes = res as unknown as MutableAsyncResponse;
    mockRes.statusCode = 200;
    if ((req.url || "").indexOf("Maryland") >= 0) {
      mockRes.resultJson = mockSampleTeamStatsResponse;
    } else {
      mockRes.resultJson = {};
    }
  })
);
jest.mock("../pages/api/calculateOnOffPlayerStats", () =>
  jest.fn().mockImplementation((req: NextApiRequest, res: NextApiResponse) => {
    const mockRes = res as unknown as MutableAsyncResponse;
    mockRes.statusCode = 200;
    if ((req.url || "").indexOf("Maryland") >= 0) {
      mockRes.resultJson = mockSamplePlayerStatsResponse;
    } else {
      mockRes.resultJson = {};
    }
  })
);

describe("buildLeaderboards", () => {
  test("buildLeaderboards - main / completeLineupLeaderboard", async () => {

    await main();

    expect(completeLineupLeaderboard("test", savedLineups, 300)).toMatchSnapshot();
    expect(completeLineupLeaderboard("test", savedLineups, 1)).toMatchSnapshot();
  });
});
