
import RosterStatsTable from '../RosterStatsTable';
import { SampleDataUtils } from "../../sample-data/SampleDataUtils";
import { samplePlayerStatsResponse } from "../../sample-data/samplePlayerStatsResponse";
import { GameFilterParams, ParamDefaults } from "../../utils/FilterModels";
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import _ from "lodash";
import { StatModels, IndivStatSet } from '../../utils/StatModels';
import fs from 'fs';

//@ts-nocheck
import fetchMock from 'isomorphic-unfetch';

describe("RosterStatsTable", () => {

  const testYear = "2021/22";

  const sampleData = JSON.parse(
    fs.readFileSync("./public/leaderboards/lineups/stats_players_all_Men_2020_High.json", { encoding: "UTF-8"})
  );  

  // Mock the URL calls needed to get the stats
  [ "Combo", "High", "Medium", "Low"].forEach(tier => {
    //(old files)
    (fetchMock as any).mock(`/leaderboards/lineups/stats_players_all_Men_${testYear.substring(0, 4)}_${tier}.json`, {
      status: 200,
      body: tier == "High" ? sampleData : { }
    });
    //(new files)
    (fetchMock as any).mock(`/api/getStats?&gender=Men&year=${testYear.substring(0, 4)}&tier=${tier}&type=player`, {
      status: 200,
      body: tier == "High" ? sampleData : { }
    });
  });

  // Tidy up snapshot rendering:
  expect.addSnapshotSerializer(SampleDataUtils.summarizeEnrichedApiResponse(
    samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets[0]
  ));

  test("RosterStatsTable (baseline only, !expanded) - should create snapshot", () => {
    const testData = {
      on: [],
      off: [],
      baseline: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[],
      global: _.cloneDeep(samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[]),
      error_code: undefined
    };
    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{showExpanded: false}}
      dataEvent={{
        teamStats: {
          on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), global: StatModels.emptyTeam(), onOffMode: true, baseline: StatModels.emptyTeam()
        },
        rosterStats: testData,
        lineupStats: []
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("RosterStatsTable (baseline only, expanded) - should create snapshot", () => {
    const testData = {
      on: [],
      off: [],
      baseline: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[],
      global: _.cloneDeep(samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[]),
      error_code: undefined
    };
    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{showExpanded: true}}
      dataEvent={{
        teamStats: {
          on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), global: StatModels.emptyTeam(), onOffMode: true, baseline: StatModels.emptyTeam()
        },
        rosterStats: testData,
        lineupStats: []
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("RosterStatsTable (!expanded) - should create snapshot", () => {
    const testData = {
      on: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.on?.player?.buckets as unknown as IndivStatSet[],
      off: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.off?.player?.buckets as unknown as IndivStatSet[],
      baseline: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[],
      global: _.cloneDeep(samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[]),
      error_code: undefined
    };
    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{onQuery: 'testQon', offQuery: `testQoff`}}
      dataEvent={{
        teamStats: {
          on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), global: StatModels.emptyTeam(), onOffMode: true, baseline: StatModels.emptyTeam()
        },
        rosterStats: testData,
        lineupStats: []
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("RosterStatsTable (expanded) - should create snapshot", () => {
    const testData = {
      on: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.on?.player?.buckets as unknown as IndivStatSet[],
      off: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.off?.player?.buckets as unknown as IndivStatSet[],
      baseline: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[],
      global: _.cloneDeep(samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[]),
      error_code: undefined
    };
    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{showExpanded: true}}
      dataEvent={{
        teamStats: {
          on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), global: StatModels.emptyTeam(), onOffMode: true, baseline: StatModels.emptyTeam()
        },
        rosterStats: testData,
        lineupStats: []
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("RosterStatsTable (luck enabled, all the diags) - should create snapshot", () => {
    const testData = {
      on: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.on?.player?.buckets as unknown as IndivStatSet[],
      off: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.off?.player?.buckets as unknown as IndivStatSet[],
      baseline: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[],
      global: _.cloneDeep(samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[]),
      error_code: undefined
    };

    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{onOffLuck: true, showPlayerOnOffLuckDiags: true, showDiag: true, showPosDiag: true }}
      dataEvent={{
        teamStats: {
          on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), global: StatModels.emptyTeam(), onOffMode: true, baseline: StatModels.emptyTeam()
        },
        rosterStats: testData,
        lineupStats: []
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("RosterStatsTable (manual enabled - manual dialog showing, all the diags) - should create snapshot", () => {
    const testData = {
      on: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.on?.player?.buckets as unknown as IndivStatSet[],
      off: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.off?.player?.buckets as unknown as IndivStatSet[],
      baseline: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[],
      global: _.cloneDeep(samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[]),
      error_code: undefined
    };

    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{onOffLuck: false, showPlayerOnOffLuckDiags: true, showDiag: true, showPosDiag: true,
        manual: [
          { rowId: "Cowan, Anthony / Baseline", newVal: 0.5, statName: "off_3p", use: true },
        ],
        showPlayerManual: true
       }}
      dataEvent={{
        teamStats: {
          on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), global: StatModels.emptyTeam(), onOffMode: true, baseline: StatModels.emptyTeam()
        },
        rosterStats: testData,
        lineupStats: []
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("RosterStatsTable (luck+overrides enabled, all the diags) - should create snapshot", () => {
    const testData = {
      on: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.on?.player?.buckets as unknown as IndivStatSet[],
      off: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.off?.player?.buckets as unknown as IndivStatSet[],
      baseline: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[],
      global: _.cloneDeep(samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[]),
      error_code: undefined
    };

    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{onOffLuck: true,
        showPlayerOnOffLuckDiags: true, showDiag: true, showPosDiag: true, showPlayerPlayTypes: true,
        manual: [
          { rowId: "Cowan, Anthony / Baseline", newVal: 0.5, statName: "off_3p", use: true },
          { rowId: "Wiggins, Aaron / Baseline", newVal: 0.5, statName: "sq_3p", use: true }, //(applied)
          { rowId: "Wiggins, Aaron / Baseline", newVal: 0.1, statName: "sq_2pmid", use: true }, //(ignored)
          { rowId: "Wiggins, Aaron / Baseline", newVal: 0.6, statName: "off_2pmid", use: true }, //(overwrites the above)
        ],
        showPlayerManual: true
       }}
      dataEvent={{
        teamStats: {
          on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), 
          global: _.assign(StatModels.emptyTeam(), { doc_count: 1000 }), 
          onOffMode: true, baseline: StatModels.emptyTeam()
        },
        rosterStats: testData,
        lineupStats: []
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test("RosterStatsTable (grades, expanded) - should create snapshot", () => {
    const testData = {
      on: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.on?.player?.buckets as unknown as IndivStatSet[],
      off: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.off?.player?.buckets as unknown as IndivStatSet[],
      baseline: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[],
      global: _.cloneDeep(samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[]),
      error_code: undefined
    };

    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{onOffLuck: false,
        showPlayerOnOffLuckDiags: false, showDiag: true, showPosDiag: false, showPlayerPlayTypes: false,
        showGrades: ParamDefaults.defaultEnabledGrade, showExpanded: true
       }}
      dataEvent={{
        teamStats: {
          on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), 
          global: _.assign(StatModels.emptyTeam(), { doc_count: 1000 }), 
          onOffMode: true, baseline: StatModels.emptyTeam()
        },
        rosterStats: testData,
        lineupStats: []
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
 
  test("RosterStatsTable (grades, !expanded) - should create snapshot", () => {
    const testData = {
      on: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.on?.player?.buckets as unknown as IndivStatSet[],
      off: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.off?.player?.buckets as unknown as IndivStatSet[],
      baseline: samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[],
      global: _.cloneDeep(samplePlayerStatsResponse.responses[0].aggregations?.tri_filter?.buckets?.baseline?.player?.buckets as unknown as IndivStatSet[]),
      error_code: undefined
    };

    const wrapper = shallow(
    <RosterStatsTable
      gameFilterParams={{onOffLuck: false,
        showPlayerOnOffLuckDiags: false, showDiag: true, showPosDiag: false, showPlayerPlayTypes: false,
        showGrades: ParamDefaults.defaultEnabledGrade
       }}
      dataEvent={{
        teamStats: {
          on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), 
          global: _.assign(StatModels.emptyTeam(), { doc_count: 1000 }), 
          onOffMode: true, baseline: StatModels.emptyTeam()
        },
        rosterStats: testData,
        lineupStats: []
      }}
      onChangeState={(newParams: GameFilterParams) => {}}
    />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
