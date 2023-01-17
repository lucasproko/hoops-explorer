import _ from 'lodash';

import { PlayTypeUtils } from "../PlayTypeUtils";
import { RosterTableUtils } from "../../tables/RosterTableUtils";
import { GameFilterParams, LineupFilterParams, TeamReportFilterParams } from "../../FilterModels";
import { samplePlayerStatsResponse } from "../../../sample-data/samplePlayerStatsResponse";
import { sampleTeamStatsResponse } from "../../../sample-data/sampleTeamStatsResponse";
import { sampleLineupStatsResponse } from "../../../sample-data/sampleLineupStatsResponse";
import { TeamStatSet } from '../../StatModels';

describe("PlayTypeUtils", () => {

  const teamSeasonLookup = "Men_Maryland_2018/9";
  const players =
    samplePlayerStatsResponse.responses[0].aggregations.tri_filter.buckets.baseline.player.buckets || [];
  const rosterStatsByCode = RosterTableUtils.buildRosterTableByCode(
    players, {}, true, teamSeasonLookup
  );
  const mainPlayer = players[0];
  const allPlayers = PlayTypeUtils.buildPlayerAssistCodeList(mainPlayer);

  const baseTeam = sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets.baseline as TeamStatSet;

  test("PlayTypeUtils - buildPlayerStyle", () => {

    const playStyleScoring = PlayTypeUtils.buildPlayerStyle("scoringPlaysPct", mainPlayer);
    //expect(playStyle).toEqual({});
    expect(playStyleScoring).toMatchSnapshot();

    const playStylePoss = PlayTypeUtils.buildPlayerStyle("playsPct", mainPlayer);
    //expect(playStyle).toEqual({});
    expect(playStylePoss).toMatchSnapshot();

    const playStyleScoringWithTotals = PlayTypeUtils.buildPlayerStyle("scoringPlaysPct", mainPlayer, 1, 1);
    //expect(playStyleWithTotals).toEqual({});
    expect(playStyleScoringWithTotals).toMatchSnapshot();
  });
  test("PlayTypeUtils - buildCategorizedAssistNetworks", () => {
    const assistNetwork = PlayTypeUtils.buildCategorizedAssistNetworks("scoringPlaysPct", false,
      players, rosterStatsByCode, baseTeam
    );
    expect(assistNetwork).toMatchSnapshot();
  });
  test("PlayTypeUtils - buildTopLevelPlayStyles", () => {
    const assistNetwork = PlayTypeUtils.buildCategorizedAssistNetworks("playsPct", true,
      players, rosterStatsByCode, baseTeam
    );
    const topLevelPlayTypeAnalysis = PlayTypeUtils.buildTopLevelPlayStyles(
      assistNetwork, players, baseTeam
    );
    expect(topLevelPlayTypeAnalysis).toMatchSnapshot();
  });
  test("PlayTypeUtils - buildPlayerAssistNetwork", () => {
    const playerStyle = PlayTypeUtils.buildPlayerStyle("scoringPlaysPct", mainPlayer);
    const testPlayerCode = allPlayers.filter(p => rosterStatsByCode.hasOwnProperty(p))[0];

    const network = PlayTypeUtils.buildPlayerAssistNetwork(
      testPlayerCode, mainPlayer, playerStyle.totalScoringPlaysMade, playerStyle.totalAssists,
      rosterStatsByCode
    );
    //expect(network).toEqual({});
    expect(network).toMatchSnapshot();
  });
  test("PlayTypeUtils - enrichUnassistedStats", () => {
    const playerStyle = PlayTypeUtils.buildPlayerStyle("scoringPlaysPct", mainPlayer);
    const extraUnassistedInfo = PlayTypeUtils.enrichUnassistedStats(playerStyle.unassisted, mainPlayer);
    //expect(extraUnassistedInfo).toEqual({});
    expect(extraUnassistedInfo).toMatchSnapshot();

    const extraUnassistedInfoPos = PlayTypeUtils.enrichUnassistedStats(playerStyle.unassisted, 0);
    //expect(extraUnassistedInfoPos).toEqual({});
    expect(extraUnassistedInfoPos).toMatchSnapshot();
  });
  test("PlayTypeUtils - buildPosCategoryAssistNetwork", () => {
    const playerStyle = PlayTypeUtils.buildPlayerStyle("scoringPlaysPct", mainPlayer);
    const playerAssistNetwork = allPlayers.map((p) => {
      const [ info, ignore ] = PlayTypeUtils.buildPlayerAssistNetwork(
        p, mainPlayer, playerStyle.totalScoringPlaysMade, playerStyle.totalAssists,
        rosterStatsByCode
      );
      return info;
    });
    const posCategoryAssistNetwork = PlayTypeUtils.buildPosCategoryAssistNetwork(
      playerAssistNetwork, rosterStatsByCode, mainPlayer
    );
    //expect(posCategoryAssistNetwork).toEqual({});
    expect(posCategoryAssistNetwork).toMatchSnapshot();

    const posCategoryAssistNetworkNoInfo = PlayTypeUtils.buildPosCategoryAssistNetwork(
      playerAssistNetwork, rosterStatsByCode, undefined
    );
    //expect(posCategoryAssistNetworkNoInfo).toEqual({});
    expect(posCategoryAssistNetworkNoInfo).toMatchSnapshot();

    const posCategoryAssistNetworkPos = PlayTypeUtils.buildPosCategoryAssistNetwork(
      playerAssistNetwork, rosterStatsByCode, 0
    );
    //expect(posCategoryAssistNetworkPos).toEqual({});
    expect(posCategoryAssistNetworkPos).toMatchSnapshot();
  });
});
