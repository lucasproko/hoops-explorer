import renderer from 'react-test-renderer';
import React from 'react';
import RapmGlobalDiagView from '../RapmGlobalDiagView';

// Needed to build the data
import { LineupStatSet } from "../../../utils/StatModels";
import { sampleLineupStatsResponse } from "../../../sample-data/sampleLineupStatsResponse";
import { LineupUtils } from "../../../utils/stats/LineupUtils";
import { RapmUtils } from "../../../utils/stats/RapmUtils";
import { semiRealRapmResults } from "../../../utils/stats/__tests__/RapmUtils.test";

describe("RapmGlobalDiagView", () => {

  const lineupReport = {
    lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets as LineupStatSet[],
    avgEff: 100.0,
    error_code: "test"
  };

  //TODO: when I updated recharts this stopped working, look into this next time make a RAPM change
  test.skip("RapmGlobalDiagView - should create snapshot", () => {
    const [ offResults, defResults ] = RapmUtils.pickRidgeRegression(
      semiRealRapmResults.testOffWeights, semiRealRapmResults.testDefWeights, semiRealRapmResults.testContext, undefined, true
    );
    const onOffReport = LineupUtils.lineupToTeamReport(lineupReport);

    RapmUtils.injectRapmIntoPlayers(
      onOffReport.players || [], offResults, defResults, {}, semiRealRapmResults.testContext, undefined
    );
    const rapmInfo = {
      enrichedPlayers: [],
      ctx: semiRealRapmResults.testContext,
      preProcDiags: RapmUtils.calcCollinearityDiag(
        semiRealRapmResults.testOffWeights, semiRealRapmResults.testContext
      ),
      offWeights: semiRealRapmResults.testOffWeights,
      defWeights: semiRealRapmResults.testDefWeights,
      offInputs: offResults,
      defInputs: defResults
    };

    const component = renderer.create(<RapmGlobalDiagView
      topRef={React.createRef<HTMLDivElement>()}
      rapmInfo={rapmInfo}
    />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
