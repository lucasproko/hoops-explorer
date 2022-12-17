import renderer from 'react-test-renderer';
import React from 'react';

import { ParamPrefixes, ParamDefaults, TeamEditorParams } from '../../utils/FilterModels';
import TeamEditorTable, { TeamEditorStatsModel } from '../TeamEditorTable';
import { TeamEditorUtils } from '../../utils/stats/TeamEditorUtils';
import { SampleDataUtils } from "../../sample-data/SampleDataUtils";

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import _ from "lodash";
import fs from 'fs';
import { teamStatInfo } from '../../bin/buildLeaderboards';

describe("TeamEditorTable", () => {
  // Load in data sample:
  const sampleData = JSON.parse(
    fs.readFileSync("./public/leaderboards/lineups/players_all_Men_2019_High.json", { encoding: "utf-8"})
  );
  const sampleDataMore = JSON.parse(
    fs.readFileSync("./public/leaderboards/lineups/players_all_Men_2018_High.json", { encoding: "utf-8"})
  );
  const sampleDataEvenMore = JSON.parse(
    fs.readFileSync("./public/leaderboards/lineups/players_all_Men_2020_High.json", { encoding: "utf-8"})
  );
  const sampleTeamData = JSON.parse(
    fs.readFileSync("./public/leaderboards/lineups/team_stats_all_Men_2020_High.json", { encoding: "utf-8"})
  );
  const transfers = [
    { 
      "RiLindo": [ { "f": "Maryland", "t": "George Washington"} ],
      "SeSmith": [ { "f": "Maryland", "t": "ETSU"} ],
    }
  ];
  const twoYears = {
    ...sampleData,
    players: (sampleData.players || []).concat(sampleDataMore.players || []).filter((p: any) => {
      return (p.team == "Maryland") || (p.team == "Seton Hall");
    }),
    transfers: transfers
  };
  const threeYears = {
    ...sampleData,
    players: (sampleData.players || []).concat(sampleDataMore.players || []).concat(sampleDataEvenMore.players || []).filter((p: any) => {
      return (p.team == "Maryland") || (p.team == "Seton Hall");
    }),
    transfers: transfers
  };
  const threeYearsWithEvalTeamStats = {
    ...threeYears,
    teamStats: sampleTeamData.teams.filter((t: any) => t.team_name == "Maryland"),
  }

  // Tidy up snapshot rendering:
  expect.addSnapshotSerializer(SampleDataUtils.summarizeEnrichedApiResponse(
    sampleData.players[0]
  ));

  test("TeamEditorTable - should create snapshot", () => {
    const dummyChangeStateCallback = (stats: TeamEditorParams) => {};
    const wrapper = shallow(
      <TeamEditorTable
        startingState={{ 
          team: "Maryland", year: "2020/21", 
          offSeason: true, evalMode: false,
          alwaysShowBench: false, superSeniorsBack: false, 
          showOnlyTransfers: true, showOnlyCurrentYear: false
        }}
        dataEvent={twoYears}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test("TeamEditorTable - should create snapshot, eval mode", () => {
    const dummyChangeStateCallback = (stats: TeamEditorParams) => {};
    const wrapper = shallow(
      <TeamEditorTable
        startingState={{ 
          team: "Maryland", year: "2020/21", 
          offSeason: true, evalMode: true,
          alwaysShowBench: false, superSeniorsBack: false, 
          showOnlyTransfers: true, showOnlyCurrentYear: false
        }}
        dataEvent={threeYearsWithEvalTeamStats}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamEditorTable - should create snapshot, eval mode (legacy mode - no team info)", () => {
    const dummyChangeStateCallback = (stats: TeamEditorParams) => {};
    const wrapper = shallow(
      <TeamEditorTable
        startingState={{ 
          team: "Maryland", year: "2020/21", 
          offSeason: true, evalMode: true,
          alwaysShowBench: false, superSeniorsBack: false, 
          showOnlyTransfers: true, showOnlyCurrentYear: false
        }}
        dataEvent={threeYears}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamEditorTable - should create snapshot, what if mode", () => {
    const dummyChangeStateCallback = (stats: TeamEditorParams) => {};
    const wrapper = shallow(
      <TeamEditorTable
        startingState={{ 
          team: "Maryland", year: "2019/20", 
          offSeason: false, evalMode: false,
          alwaysShowBench: false, superSeniorsBack: false, 
          showOnlyTransfers: true, showOnlyCurrentYear: false
        }}
        dataEvent={twoYears}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  // Options phase 2

  test("TeamEditorTable - should create snapshot, misc display options", () => {
    const dummyChangeStateCallback = (stats: TeamEditorParams) => {};
    const wrapper = shallow(
      <TeamEditorTable
        startingState={{ 
          team: "Maryland", year: "2020/21", 
          offSeason: true, evalMode: false,
          alwaysShowBench: true, superSeniorsBack: true, 
          showOnlyTransfers: false, showOnlyCurrentYear: true
        }}
        dataEvent={twoYears}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamEditorTable - should create snapshot, eval mode, misc display options", () => {
    const dummyChangeStateCallback = (stats: TeamEditorParams) => {};
    const wrapper = shallow(
      <TeamEditorTable
        startingState={{ 
          team: "Maryland", year: "2020/21", 
          offSeason: true, evalMode: true,
          alwaysShowBench: true, superSeniorsBack: true, 
          showOnlyTransfers: false, showOnlyCurrentYear: true
        }}
        dataEvent={threeYearsWithEvalTeamStats}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamEditorTable - should create snapshot, what if mode, misc display options", () => {
    const dummyChangeStateCallback = (stats: TeamEditorParams) => {};
    const wrapper = shallow(
      <TeamEditorTable
        startingState={{ 
          team: "Maryland", year: "2019/20", 
          offSeason: false, evalMode: false,
          factorMins: true,
          alwaysShowBench: true, superSeniorsBack: true, 
          showOnlyTransfers: false, showOnlyCurrentYear: true
        }}
        dataEvent={twoYears}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  // Options phase 3

  const userEdits = {
    deletedPlayers: "ErAyala::",
    disabledPlayers: "AaWiggins::",
    addedPlayers: "MyPowell:Seton Hall:",
    overrides: TeamEditorUtils.playerEditModelToUrlParams(
      "DaMorsell::", { mins: 5, global_off_adj: 0.5,  global_def_adj: -0.5 }
    ) + ";" + TeamEditorUtils.playerEditModelToUrlParams(
      "DoScott::", { pause: true, mins: 10, global_off_adj: 1.5,  global_def_adj: -1.5 }
    ) + ";" + TeamEditorUtils.playerEditModelToUrlParams(
      "Freshmen, Random", { mins: 15, profile: "4*", pos: "CG" }
    )
  };

  test("TeamEditorTable - should create snapshot - with user edits", () => {
    const dummyChangeStateCallback = (stats: TeamEditorParams) => {};
    const wrapper = shallow(
      <TeamEditorTable
        startingState={{ 
          team: "Maryland", year: "2020/21", 
          offSeason: true, evalMode: false,
          alwaysShowBench: false, superSeniorsBack: false, 
          showOnlyTransfers: true, showOnlyCurrentYear: false,
          ...userEdits
        }}
        dataEvent={twoYears}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamEditorTable - should create snapshot, eval mode - with user edits", () => {
    const dummyChangeStateCallback = (stats: TeamEditorParams) => {};
    const wrapper = shallow(
      <TeamEditorTable
        startingState={{ 
          team: "Maryland", year: "2020/21", 
          offSeason: true, evalMode: true,
          alwaysShowBench: false, superSeniorsBack: false, 
          showOnlyTransfers: true, showOnlyCurrentYear: false,
          ...userEdits
        }}
        dataEvent={threeYears}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test("TeamEditorTable - should create snapshot, what if mode - with user edits", () => {
    const dummyChangeStateCallback = (stats: TeamEditorParams) => {};
    const wrapper = shallow(
      <TeamEditorTable
        startingState={{ 
          team: "Maryland", year: "2019/20", 
          offSeason: false, evalMode: false,
          alwaysShowBench: false, superSeniorsBack: false, 
          showOnlyTransfers: true, showOnlyCurrentYear: false,
          ...userEdits
        }}
        dataEvent={twoYears}
        onChangeState={dummyChangeStateCallback}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

});
