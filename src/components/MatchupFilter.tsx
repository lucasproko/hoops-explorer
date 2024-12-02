// React imports:
import React, { useState, useEffect } from "react";

// Lodash:
import _ from "lodash";

// Bootstrap imports:

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Library imports:
import fetch from "isomorphic-unfetch";
//@ts-ignore
import Select from "react-select";

// Component imports:
import { LineupStatsModel } from "../components/LineupStatsTable";
import { RosterStatsModel } from "../components/RosterStatsTable";
import { TeamStatsModel } from "../components/TeamStatsTable";
import CommonFilter, {
  GlobalKeypressManager,
} from "../components/CommonFilter";
import {
  ParamDefaults,
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
  PlayerCode,
  PureStatSet,
  LineupStintTeamStats,
} from "../utils/StatModels";
import { QueryUtils } from "../utils/QueryUtils";
import { dataLastUpdated } from "../utils/internal-data/dataLastUpdated";
import { ClientRequestCache } from "../utils/ClientRequestCache";
import { UrlRouting } from "../utils/UrlRouting";

type Props = {
  onStats: (
    lineupStatsA: LineupStatsModel,
    teamStatsA: TeamStatsModel,
    rosterStatsA: RosterStatsModel,
    lineupStatsB: LineupStatsModel,
    teamStatsB: TeamStatsModel,
    rosterStatsB: RosterStatsModel,
    lineupStintsA: LineupStintInfo[],
    lineupStintsB: LineupStintInfo[]
  ) => void;
  startingState: MatchupFilterParams;
  onChangeState: (newParams: MatchupFilterParams) => void;
};

/** Convert from the menu string into team + date */
export const buildOppoFilter = (
  menuItemStr: string
): { team: string; dateStr: string } | undefined => {
  const regexExtractor = /^(?:@|vs)? *(.*) [(]([^)]*).*$/;
  const regexResult = regexExtractor.exec(menuItemStr);
  if (regexResult && regexResult.length >= 3) {
    return { team: regexResult[1], dateStr: regexResult[2] };
  } else {
    return undefined;
  }
};

const MatchupFilter: React.FunctionComponent<Props> = ({
  onStats,
  startingState,
  onChangeState,
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

  /** The list of opponents */
  const [opponentList, setOpponentList] = useState<Array<any>>([]); //(TODO: see StatModels - this needs to get modelled)

  // Lineup Filter - custom queries and filters:

  const isDebug = process.env.NODE_ENV !== "production";

  const [game, setGame] = useState(startingState.oppoTeam || "");

  // Utils

  useEffect(() => {
    // On load,
    if (_.isEmpty(opponentList) && commonParams.team) {
      fetchOpponents(commonParams);
    }
  }, []);

  /** Bridge between the callback in CommonFilter and state management */
  function updateCommonParams(params: CommonFilterParams) {
    // Need to refetch the list of games a team has played
    if (
      params.team != commonParams.team ||
      params.year != commonParams.year ||
      params.gender != commonParams.gender
    ) {
      if (params.team && params.year && params.gender) {
        setOpponentList([]);
        setGame("");
        fetchOpponents(params);
      }
    }
    setCommonParams(params);
  }

  const buildDateStr = (gameInfoObj: any) => {
    return (
      gameInfoObj?.game_info?.buckets?.[0]?.key_as_string || "????-??-??"
    ).substring(0, 10);
  };

  const buildScoreInfo = (gameInfoObj: any) => {
    const scoreInfoObj = gameInfoObj?.game_info?.buckets?.[0]?.end_of_game?.hits
      ?.hits?.[0]?._source?.score_info?.end || { scored: 0, allowed: 0 };

    return `${scoreInfoObj.scored > scoreInfoObj.allowed ? "W" : "L"} ${
      scoreInfoObj.scored
    }-${scoreInfoObj.allowed}`;
  };

  const buildMenuItem = (gameInfoObj: any) => {
    const oppoAndLocation = (gameInfoObj?.key || "Unknown")
      .replace(/^A:/, "@ ")
      .replace(/^H:/, "")
      .replace(/^N:/, "vs ");

    return `${oppoAndLocation} (${buildDateStr(gameInfoObj)}): ${buildScoreInfo(
      gameInfoObj
    )}`;
  };

  /** Makes an API call to elasticsearch to get the roster */
  const fetchOpponents = (params: CommonFilterParams) => {
    const { gender, year, team } = params;
    if (gender && year && team) {
      const genderYear = `${gender}_${year}`;
      const currentJsonEpoch = dataLastUpdated[genderYear] || -1;

      const query: CommonFilterParams = {
        gender: gender,
        year: year,
        team: team,
        baseQuery: "start_min:0",
        minRank: ParamDefaults.defaultMinRank,
        maxRank: ParamDefaults.defaultMaxRank,
      };
      const paramStr = QueryUtils.stringify(query);
      // Check if it's in the cache:
      const cachedJson = ClientRequestCache.decacheResponse(
        paramStr,
        ParamPrefixes.gameInfo,
        currentJsonEpoch,
        isDebug
      );
      if (cachedJson && !_.isEmpty(cachedJson)) {
        //(ignore placeholders here)
        setOpponentList(
          _.orderBy(
            cachedJson?.responses?.[0]?.aggregations?.game_info?.buckets || [],
            buildDateStr,
            "desc"
          )
        );
      } else {
        fetch(`/api/getGameInfo?${paramStr}`).then(function (
          response: fetch.IsomorphicResponse
        ) {
          response.json().then(function (json: any) {
            // Cache result locally:
            if (isDebug) {
              console.log(`CACHE_KEY=[${ParamPrefixes.lineup}${paramStr}]`);
              //(this is a bit chatty)
              //console.log(`CACHE_VAL=[${JSON.stringify(json)}]`);
            }
            if (response.ok) {
              //(never cache errors)
              ClientRequestCache.cacheResponse(
                paramStr,
                ParamPrefixes.gameInfo,
                json,
                currentJsonEpoch,
                isDebug
              );
            }
            setOpponentList(
              _.orderBy(
                json?.responses?.[0]?.aggregations?.game_info?.buckets || [],
                buildDateStr,
                "desc"
              )
            );
          });
        });
      }
    }
  };

  /** Builds a lineup filter from the various state elements, and also any secondary filters
   * NOTE: ugly hack I need to fix, needs to sync with CommonFilter.onSeeExample
   */
  function buildParamsFromState(
    includeFilterParams: Boolean
  ): [LineupFilterParams, FilterRequestInfo[]] {
    const oppoQueryInfo = buildOppoFilter(game);
    if (!oppoQueryInfo) {
      return [{}, []];
    }
    const baseQueryA = `opponent.team:"${oppoQueryInfo.team}" AND date:(${oppoQueryInfo.dateStr})`;
    const baseQueryB = `opponent.team:"${team}" AND date:(${oppoQueryInfo.dateStr})`;

    const primaryRequestA: MatchupFilterParams = {
      ...commonParams,
      baseQuery: baseQueryA,

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
      team: oppoQueryInfo.team,
      baseQuery: baseQueryB,
    };
    //(another ugly hack to be fixed - remove default optional fields)
    QueryUtils.cleanseQuery(primaryRequestA);
    QueryUtils.cleanseQuery(primaryRequestB);

    const secondaryRequestA = {
      ...primaryRequestA,
      onQuery: "",
      offQuery: "",
    };
    const secondaryRequestB = {
      ...primaryRequestB,
      onQuery: "",
      offQuery: "",
    };

    const entireSeasonRequestA = {
      // Get the entire season of players for things like luck adjustments
      team: primaryRequestA.team,
      year: primaryRequestA.year,
      gender: primaryRequestA.gender,
      minRank: ParamDefaults.defaultMinRank,
      maxRank: ParamDefaults.defaultMaxRank,
      baseQuery: "",
      onQuery: "",
      offQuery: "",
    };
    const entireSeasonRequestB = {
      // Get the entire season of players for things like luck adjustments
      team: primaryRequestB.team,
      year: primaryRequestB.year,
      gender: primaryRequestB.gender,
      minRank: ParamDefaults.defaultMinRank,
      maxRank: ParamDefaults.defaultMaxRank,
      baseQuery: "",
      onQuery: "",
      offQuery: "",
    };

    return [
      primaryRequestA,
      [
        {
          context: ParamPrefixes.game as ParamPrefixesType,
          paramsObj: secondaryRequestA,
        },
        {
          context: ParamPrefixes.player as ParamPrefixesType,
          paramsObj: secondaryRequestA,
          includeRoster: false,
        },
        {
          //(don't make a spurious call)
          context: ParamPrefixes.player as ParamPrefixesType,
          paramsObj: entireSeasonRequestA,
          includeRoster: true,
        },
        {
          context: ParamPrefixes.lineup as ParamPrefixesType,
          paramsObj: primaryRequestB,
        },
        {
          context: ParamPrefixes.game as ParamPrefixesType,
          paramsObj: secondaryRequestB,
        },
        {
          context: ParamPrefixes.player as ParamPrefixesType,
          paramsObj: secondaryRequestB,
          includeRoster: false,
        },
        {
          //(don't make a spurious call)
          context: ParamPrefixes.player as ParamPrefixesType,
          paramsObj: entireSeasonRequestB,
          includeRoster: true,
        },
        {
          context: ParamPrefixes.lineupStints as ParamPrefixesType,
          paramsObj: primaryRequestA,
          includeRoster: false,
        },
        {
          context: ParamPrefixes.lineupStints as ParamPrefixesType,
          paramsObj: primaryRequestB,
          includeRoster: false,
        },
      ],
    ];
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(jsonResps: any[], wasError: Boolean) {
    const jsonStatuses = jsonResps.map((j) => j.status);

    const lineupJsonA = jsonResps?.[0]?.responses?.[0] || {};
    const teamJsonA = jsonResps?.[1]?.responses?.[0] || {};
    const rosterStatsJsonA = jsonResps?.[2]?.responses?.[0] || {};
    const globalRosterStatsJsonA =
      jsonResps?.[3]?.responses?.[0] || rosterStatsJsonA;
    const globalTeamA =
      teamJsonA?.aggregations?.global?.only?.buckets?.team ||
      StatModels.emptyTeam();
    const rosterInfoA = jsonResps?.[3]?.roster;
    globalTeamA.roster = rosterInfoA;

    const lineupJsonB = jsonResps?.[4]?.responses?.[0] || {};
    const teamJsonB = jsonResps?.[5]?.responses?.[0] || {};
    const rosterStatsJsonB = jsonResps?.[6]?.responses?.[0] || {};
    const globalRosterStatsJsonB =
      jsonResps?.[7]?.responses?.[0] || rosterStatsJsonB;
    const globalTeamB =
      teamJsonB?.aggregations?.global?.only?.buckets?.team ||
      StatModels.emptyTeam();
    const rosterInfoB = jsonResps?.[7]?.roster;
    globalTeamB.roster = rosterInfoB;

    /** Combines player and team info for each minute */
    const buildLineupStint = (pp: any[]) => {
      const loadPlayer = (
        mutableLineupStint: LineupStintInfo,
        playerCode: PlayerCode,
        playerStatSet: any
      ) => {
        const playerInfo = _.find(
          mutableLineupStint.players,
          (p) => p.code == playerCode
        );
        if (playerInfo) {
          playerInfo.stats = playerStatSet as LineupStintTeamStats;
        }
      };
      return _.transform(
        pp,
        (acc, p) => {
          const newStartMin = _.isNumber(p.start_min) ? p.start_min : -2;

          if (p.player?.code && newStartMin != acc.startMin) {
            //stash:
            acc.playerStash[p.player?.code] = p.player_stats || {};
          } else if (p.player) {
            const currStint = _.last(acc.stints);
            if (currStint) {
              loadPlayer(currStint, p.player.code, p.player_stats || {});
            }
          } else {
            acc.startMin = newStartMin;
            acc.stints = acc.stints.concat([p as LineupStintInfo]);
            _.forEach(acc.playerStash, (val, key) => {
              loadPlayer(p as LineupStintInfo, key, val);
            });
          }
        },
        {
          stints: [] as LineupStintInfo[],
          startMin: -1,
          playerStash: {} as Record<string, any>,
        }
      ).stints;
    };

    const lineupStintsA: LineupStintInfo[] = buildLineupStint(
      (jsonResps?.[8]?.responses?.[0]?.hits?.hits || []).map(
        (p: any) => p._source
      )
    );
    const lineupStintsB: LineupStintInfo[] = buildLineupStint(
      (jsonResps?.[9]?.responses?.[0]?.hits?.hits || []).map(
        (p: any) => p._source
      )
    );

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
    onStats(
      fromLineups(lineupJsonA),
      fromTeam(teamJsonA, globalTeamA),
      fromRoster(rosterStatsJsonA, globalRosterStatsJsonA),
      fromLineups(lineupJsonB),
      fromTeam(teamJsonB, globalTeamB),
      fromRoster(rosterStatsJsonB, globalRosterStatsJsonB),
      lineupStintsA,
      lineupStintsB
    );
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
    showTeamPlayTypes: true,
    rapmRegressMode: "0.8",
    showExpanded: true,
    teamShotCharts: true,
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
    showRawPts: true,
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
        const opponentName = buildOppoFilter(params.oppoTeam || "")?.team;
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
                  styles={{ menu: (base: any) => ({ ...base, zIndex: 1000 }) }}
                  value={getCurrentTeamOrPlaceholder()}
                  options={opponentList.map((r) =>
                    stringToOption(buildMenuItem(r))
                  )}
                  onChange={(option: any) => {
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

export default MatchupFilter;
