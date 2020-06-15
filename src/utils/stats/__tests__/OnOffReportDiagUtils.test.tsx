import renderer from 'react-test-renderer';
import React from 'react';
import { OnOffReportDiagUtils } from '../OnOffReportDiagUtils';
import { CommonFilterParams } from "../../FilterModels";
import { LineupUtils } from "../LineupUtils";
import { CommonTableDefs } from "../../CommonTableDefs";
import { LineupStatsModel } from '../../../components/LineupStatsTable';
import GenericTable, { GenericTableOps, GenericTableColProps } from "../../../components/GenericTable";
import { sampleLineupStatsResponse } from "../../../sample-data/sampleLineupStatsResponse"
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("OnOffReportDiagUtils", () => {
  [ true, false ].forEach((incRapm) => {
    [ true, false ].forEach((incRepOnOff) => {
      test(`OnOffReportDiagUtils - should create roster comparison HTML (rapm: ${incRapm} replacement on/off: ${incRepOnOff})`, () => {

        // Setup the data
        const lineupReport = {
          lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets,
          avgOff: 100.0,
          error_code: "test"
        } as LineupStatsModel;
        const tempTeamReport = LineupUtils.lineupToTeamReport(
          lineupReport, incRepOnOff
        );
        const playersWithAdjEff = tempTeamReport.players || [];
        const playerLineupPowerSet = OnOffReportDiagUtils.buildPlayerSummary(playersWithAdjEff, incRapm, incRepOnOff);

        const component = renderer.create(
          <span>{
            OnOffReportDiagUtils.buildLineupInfo(playersWithAdjEff[0], playerLineupPowerSet, "RAPM")
          }</span>
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });
  test("OnOffReportDiagUtils - should create table containing replacement on/off diagnostics", () => {
    const lineupReport = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets,
      avgOff: 100.0,
      error_code: "test"
    } as LineupStatsModel;
    const tempTeamReport = LineupUtils.lineupToTeamReport(
      lineupReport, true, 100, 10
    );
    const playersWithAdjEff = tempTeamReport.players || [];
    const playerLineupPowerSet = OnOffReportDiagUtils.buildPlayerSummary(playersWithAdjEff, false, true);
    const diagInfo = OnOffReportDiagUtils.getRepOnOffDiagInfo(playersWithAdjEff[2], 100);
    const component = renderer.create(
      <GenericTable
        tableCopyId="teamReportStatsTable"
        tableFields={CommonTableDefs.onOffReport}
        tableData={OnOffReportDiagUtils.getRepOnOffDiags( //[2] == Morsell, actually has some same-4s
          playersWithAdjEff[2], {"DoScott": "Scott, Donta"}, diagInfo, {},
          [ 10, "lineup.off_poss.value", -1 ], (a: string, b: number) => false,
          true
        )}
      />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

  });
  test("OnOffReportDiagUtils - buildOnOffAnalysisLink", () => {
    const component = renderer.create(
      <span>
        {OnOffReportDiagUtils.buildOnOffAnalysisLink("player, test1", ["PlOne1", "PlTwo1"], {baseQuery: "test1"})}
        {OnOffReportDiagUtils.buildOnOffAnalysisLink("player, test2", ["PlOne2", "PlTwo2"], {baseQuery: "test2"}, "test-title")}
      </span>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("OnOffReportDiagUtils - buildPlayerComparisonLink", () => {
    const component = renderer.create(
      <span>
        {OnOffReportDiagUtils.buildPlayerComparisonLink(
          "player, test1", "TePlayer", "peer, test1", "TePeer", ["testQuery1", undefined], {baseQuery: "test1"}
        )}
        {OnOffReportDiagUtils.buildPlayerComparisonLink(
          "player, test2", "TePlayer", "peer, test2", "TePeer", ["[testQuery2]","testQuery2"], {baseQuery: "test2"}
        )}
        {OnOffReportDiagUtils.buildPlayerComparisonLink(
          "player, test3", "TePlayer", "peer, test3", "TePeer", ["[testQuery2]","testQuery2"], {
            baseQuery: `{"player, test3";"peer, test3"}=1 AND TEST`
          }
        )}
      </span>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
