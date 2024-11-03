// React imports:
import React, { useState } from "react";

// Lodash:
import _ from "lodash";

// Bootstrap imports:

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Library imports:
import Select from "react-select";

// Component imports:
import { LineupStatsModel } from "../components/LineupStatsTable";
import { RosterStatsModel } from "../components/RosterStatsTable";
import { TeamStatsModel } from "../components/TeamStatsTable";
import CommonFilter, {
  GlobalKeypressManager,
} from "../components/CommonFilter";
import {
  ParamPrefixesType,
  ParamPrefixes,
  CommonFilterParams,
  LineupFilterParams,
  FilterRequestInfo,
  MatchupFilterParams,
  GameFilterParams,
} from "../utils/FilterModels";

// Utils
import {
  StatModels,
  LineupStintInfo,
  IndivStatSet,
  TeamStatSet,
} from "../utils/StatModels";
import { QueryUtils } from "../utils/QueryUtils";
import { UrlRouting } from "../utils/UrlRouting";
import { AvailableTeams } from "../utils/internal-data/AvailableTeams";
import { DateUtils } from "../utils/DateUtils";
import { FilterParamsType } from "../utils/FilterModels";

type Props = {
  onStats: (
    lineupStatsA: LineupStatsModel,
    teamStatsA: TeamStatsModel,
    rosterStatsA: RosterStatsModel,
    lineupStatsB: LineupStatsModel,
    teamStatsB: TeamStatsModel,
    rosterStatsB: RosterStatsModel,
    lineupStintsA: LineupStintInfo[],
    lineupStintsB: LineupStintInfo[],
    defensiveInfoA?: Record<
      string,
      { teamStats: TeamStatSet; playerStats: Array<IndivStatSet> }
    >,
    defensiveInfoB?: Record<
      string,
      { teamStats: TeamStatSet; playerStats: Array<IndivStatSet> }
    >
  ) => void;
  startingState: MatchupFilterParams;
  onChangeState: (newParams: MatchupFilterParams) => void;
  includeDefense?: boolean;
};

const MatchupPreviewFilter: React.FunctionComponent<Props> = ({
  onStats,
  startingState,
  onChangeState,
  includeDefense,
}) => {
  //console.log("Loading LineupFilter " + JSON.stringify(startingState));

  // Data model

  const {
    oppoTeam: startOppoTeam,
    onOffLuck: startOnOffLuck,
    luck: startLuck,
    ...startingCommonFilterParams
  } = startingState;

  /** The state managed by the CommonFilter element */
  const [commonParams, setCommonParams] = useState(
    startingCommonFilterParams as CommonFilterParams
  );

  // Lineup Filter - custom queries and filters:

  const isDebug = process.env.NODE_ENV !== "production";

  const [game, setGame] = useState(startingState.oppoTeam || "");

  // Utils

  /** Pre-calculate this */
  const teamList = AvailableTeams.getTeams(
    null,
    commonParams.year || DateUtils.mostRecentYearWithData,
    commonParams.gender || "Men"
  ).filter((t) => t.team != commonParams.team);

  /** Bridge between the callback in CommonFilter and state management */
  function updateCommonParams(params: CommonFilterParams) {
    // Need to refetch the list of games a team has played
    if (
      params.team != commonParams.team ||
      params.year != commonParams.year ||
      params.gender != commonParams.gender
    ) {
      if (params.team && params.year && params.gender) {
        setGame("");
      }
    }
    setCommonParams(params);
  }

  /** Builds a lineup filter from the various state elements, and also any secondary filters
   * NOTE: ugly hack I need to fix, needs to sync with CommonFilter.onSeeExample
   */
  function buildParamsFromState(
    includeFilterParams: Boolean
  ): [LineupFilterParams, FilterRequestInfo[]] {
    const primaryRequestA: MatchupFilterParams = {
      ...commonParams,
      baseQuery: "",

      // Hacky: because of how this logic works, the primary request needs to have all the
      // filter and query params:
      oppoTeam: game,
      ...(includeFilterParams
        ? {
            luck: startLuck,
            onOffLuck: startOnOffLuck,
          }
        : {}),
    };
    const primaryRequestB: CommonFilterParams = {
      ...commonParams,
      team: game,
      baseQuery: "",
    };
    //(another ugly hack to be fixed - remove default optional fields)
    QueryUtils.cleanseQuery(primaryRequestA);
    QueryUtils.cleanseQuery(primaryRequestB);

    const secondaryRequestA = {
      ...primaryRequestA,
      onQuery: "",
      offQuery: "",
      getGames: true,
    };
    const secondaryRequestB = {
      ...primaryRequestB,
      onQuery: "",
      offQuery: "",
      getGames: true,
    };

    const noExtraFullSeasonRequests = true;

    const primaryRequests: FilterRequestInfo[] = [
      {
        context: ParamPrefixes.game as ParamPrefixesType,
        paramsObj: secondaryRequestA,
      },
      {
        context: ParamPrefixes.player as ParamPrefixesType,
        paramsObj: secondaryRequestA,
        includeRoster: noExtraFullSeasonRequests,
      },
    ];
    const secondaryRequests: FilterRequestInfo[] = [
      {
        context: ParamPrefixes.lineup as ParamPrefixesType,
        paramsObj: primaryRequestB as FilterParamsType,
      },
      {
        context: ParamPrefixes.game as ParamPrefixesType,
        paramsObj: secondaryRequestB,
      },
      {
        context: ParamPrefixes.player as ParamPrefixesType,
        paramsObj: secondaryRequestB,
        includeRoster: noExtraFullSeasonRequests,
      },
    ];
    const defensiveRequests: FilterRequestInfo[] = includeDefense
      ? _.take(
          [
            {
              context: ParamPrefixes.defensiveInfo as ParamPrefixesType,
              paramsObj: primaryRequestA as FilterParamsType,
            },
            {
              context: ParamPrefixes.defensiveInfo as ParamPrefixesType,
              paramsObj: primaryRequestB as FilterParamsType,
            },
          ],
          game != AvailableTeams.noOpponent ? 2 : 1
        ) //(only get team defense if there is "no opponent")
      : [];

    return [
      primaryRequestA,
      primaryRequests
        .concat(
          game != AvailableTeams.noOpponent
            ? secondaryRequests
            : ([] as FilterRequestInfo[])
        )
        .concat(defensiveRequests),
    ];
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(jsonResps: any[], wasError: Boolean) {
    const fromLineups = (lineupJson: any) => ({
      lineups: lineupJson?.aggregations?.lineups?.buckets,
      error_code: wasError
        ? lineupJson?.status || jsonStatuses?.[0] || "Unknown"
        : undefined,
    });
    const fromTeam = (teamJson: any, globalTeam: any) => ({
      on: StatModels.emptyTeam(),
      off: StatModels.emptyTeam(),
      onOffMode: true,
      baseline:
        teamJson?.aggregations?.tri_filter?.buckets?.baseline ||
        StatModels.emptyTeam(),
      global: globalTeam,
      error_code: wasError
        ? teamJson?.status || jsonStatuses?.[1] || "Unknown"
        : undefined,
    });
    const fromRoster = (rosterStatsJson: any, globalRosterStatsJson: any) => ({
      on: [],
      off: [],
      baseline:
        rosterStatsJson?.aggregations?.tri_filter?.buckets?.baseline?.player
          ?.buckets || [],
      global:
        globalRosterStatsJson?.aggregations?.tri_filter?.buckets?.baseline
          ?.player?.buckets || [],
      error_code: wasError
        ? rosterStatsJson?.status ||
          jsonStatuses?.[2] ||
          globalRosterStatsJson?.status ||
          jsonStatuses?.[3] ||
          "Unknown"
        : undefined,
    });

    const extraFullSeasonRequests = 0; //0 or 1, will be 1 later if we allow more granular filtering
    const jsonStatuses = jsonResps.map((j) => j.status);

    const lineupJsonA = jsonResps?.[0]?.responses?.[0] || {};
    const teamJsonA = jsonResps?.[1]?.responses?.[0] || {};
    const rosterStatsJsonA = jsonResps?.[2]?.responses?.[0] || {};
    const globalRosterStatsJsonA =
      jsonResps?.[2 + extraFullSeasonRequests]?.responses?.[0] ||
      rosterStatsJsonA;
    const globalTeamA =
      teamJsonA?.aggregations?.global?.only?.buckets?.team ||
      StatModels.emptyTeam();
    const rosterInfoA = jsonResps?.[2 + extraFullSeasonRequests]?.roster;
    globalTeamA.roster = rosterInfoA;

    const noOpponentCase =
      jsonResps.length < extraFullSeasonRequests + (includeDefense ? 7 : 5);

    const buildDefensiveInfo = (jsonResp: any[]) => {
      const teamsStatsByTeam: Record<string, TeamStatSet> = _.chain(
        jsonResp?.[0]?.aggregations?.tri_filter?.buckets?.baseline?.opponents
          ?.buckets || []
      )
        .groupBy((t) => t["key"])
        .mapValues(
          //(convert from  team defense to opponent offense)
          (vv) => vv[0] || ({} as TeamStatSet)
          // Previously I was getting team defense not opponent offense, but the
          // stats weren't entirely identical (buglet!) so I switched to the slower but more
          // accurate opponent offense
          // _.mapKeys(vv[0] || ({} as TeamStatSet), (v, k) =>
          //   _.startsWith(k, "total_def_") ? `total_off_${k.substring(10)}` : k
          // ) as TeamStatSet
        )
        .value();

      const playerStatsByTeam: Record<string, Array<IndivStatSet>> = _.chain(
        jsonResp?.[1]?.aggregations?.tri_filter?.buckets?.baseline?.opponents
          ?.buckets || []
      )
        .groupBy((t) => t["key"])
        .mapValues((vv) => vv[0]?.player?.buckets || [])
        .value();

      return _.chain(teamsStatsByTeam)
        .toPairs()
        .transform((acc, kv) => {
          const team = kv[0];
          const teamStats = kv[1];
          const playerStats = playerStatsByTeam[team];
          if (playerStats) {
            acc[team] = {
              teamStats,
              playerStats,
            };
          }
        }, {} as Record<string, { teamStats: TeamStatSet; playerStats: Array<IndivStatSet> }>)
        .value();
    };
    const [defensiveStatsA, defensiveStatsB] = _.thru(includeDefense, (__) => {
      const startingIndex =
        extraFullSeasonRequests +
        (noOpponentCase ? 3 : 6 + extraFullSeasonRequests);
      if (includeDefense) {
        return [
          buildDefensiveInfo(jsonResps?.[startingIndex]?.responses || []),
          buildDefensiveInfo(jsonResps?.[startingIndex + 1]?.responses || []),
        ];
      } else {
        return [undefined, undefined];
      }
    });

    if (noOpponentCase) {
      //special "no opponent case", short circuit the rest
      onStats(
        fromLineups(lineupJsonA),
        fromTeam(teamJsonA, globalTeamA),
        fromRoster(rosterStatsJsonA, globalRosterStatsJsonA),
        fromLineups({}),
        fromTeam({}, {}),
        fromRoster({}, {}),
        [],
        [],
        defensiveStatsA,
        defensiveStatsB
      );
    } else {
      const lineupJsonB =
        jsonResps?.[3 + extraFullSeasonRequests]?.responses?.[0] || {};
      const teamJsonB =
        jsonResps?.[4 + extraFullSeasonRequests]?.responses?.[0] || {};
      const rosterStatsJsonB =
        jsonResps?.[5 + extraFullSeasonRequests]?.responses?.[0] || {};
      const globalRosterStatsJsonB =
        jsonResps?.[5 + 2 * extraFullSeasonRequests]?.responses?.[0] ||
        rosterStatsJsonB;
      const globalTeamB =
        teamJsonB?.aggregations?.global?.only?.buckets?.team ||
        StatModels.emptyTeam();
      const rosterInfoB = jsonResps?.[5 + 2 * extraFullSeasonRequests]?.roster;
      globalTeamB.roster = rosterInfoB;

      onStats(
        fromLineups(lineupJsonA),
        fromTeam(teamJsonA, globalTeamA),
        fromRoster(rosterStatsJsonA, globalRosterStatsJsonA),
        fromLineups(lineupJsonB),
        fromTeam(teamJsonB, globalTeamB),
        fromRoster(rosterStatsJsonB, globalRosterStatsJsonB),
        [],
        [],
        defensiveStatsA,
        defensiveStatsB
      );
    }
  }

  // Visual components:

  /** Let the user know that he might need to change */

  const team: string = "";

  /** For use in selects */
  function stringToOption(s: string) {
    return { label: s, value: s };
  }
  /** For use in team select */
  function getCurrentTeamOrPlaceholder() {
    return game == "" ? { label: "Choose Game..." } : stringToOption(game);
  }

  // Link building
  const gameParams = (
    params: MatchupFilterParams,
    team: string,
    subFor?: string
  ): GameFilterParams => ({
    team,
    minRank: "1",
    maxRank: "400",
    gender: params.gender,
    year: params.year,
    baseQuery: subFor
      ? (params.baseQuery || "").replace(`"${team}"`, `"${subFor}"`)
      : params.baseQuery,
    showRoster: true,
    calcRapm: true,
    rapmRegressMode: "0.8",
    showExpanded: true,
  });
  const lineupParams = (
    params: MatchupFilterParams,
    team: string,
    subFor?: string
  ): LineupFilterParams => ({
    team,
    minRank: "1",
    maxRank: "400",
    gender: params.gender,
    year: params.year,
    minPoss: "0",
    baseQuery: subFor
      ? (params.baseQuery || "").replace(`"${team}"`, `"${subFor}"`)
      : params.baseQuery,
  });

  return (
    <CommonFilter //(generic type inferred)
      startingState={startingState}
      onChangeState={onChangeState}
      onChangeCommonState={updateCommonParams}
      tablePrefix={ParamPrefixes.gameInfo}
      tablePrefixForPrimaryRequest={ParamPrefixes.lineup}
      buildParamsFromState={buildParamsFromState}
      childHandleResponse={handleResponse}
      matchupMode={true}
      blockSubmit={game == ""}
      buildLinks={(params) => {
        const opponentName = game;
        return params.team && opponentName
          ? [
              <a
                target="_blank"
                href={UrlRouting.getGameUrl(
                  gameParams(params, params.team),
                  {}
                )}
              >
                Team stats
              </a>,
              <a
                target="_blank"
                href={UrlRouting.getLineupUrl(
                  lineupParams(params, params.team),
                  {}
                )}
              >
                Team lineups
              </a>,
            ].concat(
              opponentName != AvailableTeams.noOpponent
                ? [
                    <a
                      target="_blank"
                      href={UrlRouting.getGameUrl(
                        gameParams(params, opponentName, params.team),
                        {}
                      )}
                    >
                      Opponent stats
                    </a>,
                    <a
                      target="_blank"
                      href={UrlRouting.getLineupUrl(
                        lineupParams(params, opponentName, params.team),
                        {}
                      )}
                    >
                      Opponent lineups
                    </a>,
                  ]
                : []
            )
          : [];
      }}
    >
      <GlobalKeypressManager.Consumer>
        {(globalKeypressHandler) => (
          <div>
            <Form.Group as={Row}>
              <Col xs={0} sm={0} md={0} lg={4} />
              <Col xs={12} sm={12} md={12} lg={6}>
                <Select
                  isClearable={false}
                  styles={{ menu: (base) => ({ ...base, zIndex: 1000 }) }}
                  value={getCurrentTeamOrPlaceholder()}
                  options={[stringToOption(AvailableTeams.noOpponent)].concat(
                    teamList.map((r) => stringToOption(r.team))
                  )}
                  onChange={(option) => {
                    setGame((option as any)?.value);
                  }}
                />
              </Col>
            </Form.Group>
          </div>
        )}
      </GlobalKeypressManager.Consumer>
    </CommonFilter>
  );
};

export default MatchupPreviewFilter;
