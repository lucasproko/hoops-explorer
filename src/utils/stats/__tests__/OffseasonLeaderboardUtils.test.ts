import _ from "lodash";

// Math:
// @ts-ignore
import Statistics from "statistics.js";

describe("OffseasonLeaderboardUtils", () => {
  test("TODO", () => {
    //TODO: currently minimally tested in OffseasonLeaderboardTable.test.tsx, need to add better coverage testing
  });
  test("Statistics - rank correlation", () => {
    const runExperiments = false;
    if (runExperiments) {
      const metadataA = {
        predicted: "ordinal", //(with data1, metric vs ordinal doesn't matter .. might be slower?)
        actual: "ordinal",
      };

      //TODO test whether you need your ordinals to be identical or if they can be offset? (maybe use metric if so?)

      // Both these gives 0.8 - strong agreement

      const data1 = [
        { predicted: 1, actual: 2 },
        { predicted: 5, actual: 5 },
        { predicted: 4, actual: 4 },
        { predicted: 3, actual: 3 },
        { predicted: 2, actual: 1 },
      ]; //(whether you start from 1 or 0 doesn't matter )

      const stats1A = new Statistics(data1, metadataA);
      const kendallResults1A = stats1A.kendallsTau("actual", "predicted"); //order doesn't matter
      console.log(`TAU 1A: ${JSON.stringify(kendallResults1A, null, 3)}`);

      const gammaResults1A = stats1A.goodmanKruskalsGamma(
        "actual",
        "predicted"
      ); //order doesn't matter
      console.log(`GAMMA 1A: ${JSON.stringify(gammaResults1A, null, 3)}`);

      // Both these give -1: complete disagreement

      const data2 = [
        { predicted: 1, actual: 5 },
        { predicted: 2, actual: 4 },
        { predicted: 3, actual: 3 },
        { predicted: 4, actual: 2 },
        { predicted: 5, actual: 1 },
      ]; //(whether you start from 1 or 0 doesn't matter )

      const stats2A = new Statistics(data2, metadataA);

      const kendallResults2A = stats2A.kendallsTau("actual", "predicted"); //order doesn't matter
      console.log(`TAU 2A: ${JSON.stringify(kendallResults2A, null, 3)}`);

      const gammaResults2A = stats2A.goodmanKruskalsGamma(
        "actual",
        "predicted"
      ); //order doesn't matter
      console.log(`GAMMA 2A: ${JSON.stringify(gammaResults2A, null, 3)}`);

      // Experiments when the ordering is the same but the actual ordinals are different
      // Still get 0.8 in this case

      const data3 = [
        { predicted: 1, actual: 2 },
        { predicted: 5, actual: 8 },
        { predicted: 4, actual: 7 },
        { predicted: 3, actual: 3 },
        { predicted: 2, actual: 0 },
      ]; //(whether you start from 1 or 0 doesn't matter )

      const stats3A = new Statistics(data3, metadataA);

      const kendallResults3A = stats3A.kendallsTau("predicted", "actual"); //order doesn't matter
      console.log(`TAU 3A: ${JSON.stringify(kendallResults3A, null, 3)}`);

      const gammaResults3A = stats3A.goodmanKruskalsGamma(
        "predicted",
        "actual"
      ); //order doesn't matter
      console.log(`GAMMA 3A: ${JSON.stringify(gammaResults3A, null, 3)}`);
    }
  });
});
