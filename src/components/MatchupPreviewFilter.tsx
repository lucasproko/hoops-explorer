// React imports:
import React, { useState, useEffect } from "react";

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Library imports:
import fetch from "isomorphic-unfetch";
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
import { StatModels, LineupStintInfo } from "../utils/StatModels";
import { QueryUtils } from "../utils/QueryUtils";
import { dataLastUpdated } from "../utils/internal-data/dataLastUpdated";
import { ClientRequestCache } from "../utils/ClientRequestCache";
import { UrlRouting } from "../utils/UrlRouting";
import { AvailableTeams } from "../utils/internal-data/AvailableTeams";
import { DateUtils } from "../utils/DateUtils";

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

const MatchupPreviewFilter: React.FunctionComponent<Props> = ({
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

    // Currently don't need this but might want it later for home/away analysis
    // const entireSeasonRequestA = {
    //   // Get the entire season of players for things like luck adjustments
    //   team: primaryRequestA.team,
    //   year: primaryRequestA.year,
    //   gender: primaryRequestA.gender,
    //   minRank: ParamDefaults.defaultMinRank,
    //   maxRank: ParamDefaults.defaultMaxRank,
    //   baseQuery: "",
    //   onQuery: "",
    //   offQuery: "",
    // };
    // const entireSeasonRequestB = {
    //   // Get the entire season of players for things like luck adjustments
    //   team: primaryRequestB.team,
    //   year: primaryRequestB.year,
    //   gender: primaryRequestB.gender,
    //   minRank: ParamDefaults.defaultMinRank,
    //   maxRank: ParamDefaults.defaultMaxRank,
    //   baseQuery: "",
    //   onQuery: "",
    //   offQuery: "",
    // };

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
          includeRoster: noExtraFullSeasonRequests,
        },
        // Currently this is equivalent to primary request
        // {
        //   //(don't make a spurious call)
        //   context: ParamPrefixes.player as ParamPrefixesType,
        //   paramsObj: entireSeasonRequestA,
        //   includeRoster: true,
        // },
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
          includeRoster: noExtraFullSeasonRequests,
        },
        // Currently this is equivalent to primary request
        // {
        //   //(don't make a spurious call)
        //   context: ParamPrefixes.player as ParamPrefixesType,
        //   paramsObj: entireSeasonRequestB,
        //   includeRoster: true,
        // },
      ],
    ];
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(jsonResps: any[], wasError: Boolean) {
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
      [],
      []
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
                  styles={{ menu: (base) => ({ ...base, zIndex: 1000 }) }}
                  value={getCurrentTeamOrPlaceholder()}
                  options={teamList.map((r) => stringToOption(r.team))}
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
