import renderer from 'react-test-renderer';
import React from 'react';
import RapmPlayerDiagView from '../RapmPlayerDiagView';

// Needed to build the data
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse";
import { LineupUtils } from "../../utils/LineupUtils";
import { RapmUtils } from "../../utils/RapmUtils";
import { semiRealRapmResults } from "../../utils/__tests__/RapmUtils.test";

describe("RapmPlayerDiagView", () => {

  const lineupReport = {
    lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets,
    avgEff: 100.0,
    error_code: "test"
  };

  test("RapmPlayerDiagView - should create snapshot", () => {
    const [ offResults, defResults ] = RapmUtils.pickRidgeRegression(
      semiRealRapmResults.testOffWeights, semiRealRapmResults.testDefWeights, semiRealRapmResults.testContext);
    const onOffReport = LineupUtils.lineupToTeamReport(lineupReport);

    RapmUtils.injectRapmIntoPlayers(
      onOffReport.players || [], offResults, defResults, {}, semiRealRapmResults.testContext
    );
    const rapmInfo = {
      ctx: semiRealRapmResults.testContext,
      preProcDiags: RapmUtils.calcCollinearityDiag(
        semiRealRapmResults.testOffWeights, semiRealRapmResults.testContext
      ),
      offWeights: semiRealRapmResults.testOffWeights,
      defWeights: semiRealRapmResults.testDefWeights,
      offInputs: offResults,
      defInputs: defResults
    };

    const component = renderer.create(<RapmPlayerDiagView
      rapmInfo={rapmInfo}
      player={onOffReport.players?.[0] || {}}
    />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
