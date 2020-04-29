import renderer from 'react-test-renderer';
import React from 'react';
import { OnOffReportDiagUtils } from '../OnOffReportDiagUtils';
import { CommonFilterParams } from "../FilterModels";
import { LineupUtils } from "../LineupUtils";
import { CommonTableDefs } from "../CommonTableDefs";
import { LineupStatsModel } from '../../components/LineupStatsTable';
import GenericTable, { GenericTableOps, GenericTableColProps } from "../../components/GenericTable";
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse"
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe("OnOffReportDiagUtils", () => {
  [ true, false ].forEach((incRepOnOff) => {
    test(`OnOffReportDiagUtils - should create roster comparison HTML (replacement on/off: ${incRepOnOff})`, () => {

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
      const playerLineupPowerSet = OnOffReportDiagUtils.buildPlayerSummary(playersWithAdjEff, incRepOnOff);

      const component = renderer.create(
        <span>{
          OnOffReportDiagUtils.buildLineupInfo(playersWithAdjEff[0], playerLineupPowerSet)
        }</span>
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
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
    const playerLineupPowerSet = OnOffReportDiagUtils.buildPlayerSummary(playersWithAdjEff, true);
    const diagInfo = OnOffReportDiagUtils.getRepOnOffDiagInfo(playersWithAdjEff[2], 100);
    const component = renderer.create(
      <GenericTable
        tableCopyId="teamReportStatsTable"
        tableFields={CommonTableDefs.onOffReport}
        tableData={OnOffReportDiagUtils.getRepOnOffDiags( //[2] == Morsell, actually has some same-4s
          playersWithAdjEff[2], diagInfo, {}, 10, true
        )}
      />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

  });
});
