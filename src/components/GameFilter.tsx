// React imports:
import React, { useState, useEffect } from "react";

// Next imports:
import { NextPage } from "next";

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";

// Component imports:
import { TeamStatsModel } from "../components/TeamStatsTable";
import { RosterCompareModel } from "../components/RosterCompareTable";
import { RosterStatsModel } from "../components/RosterStatsTable";
import { LineupStatsModel } from "../components/LineupStatsTable";
import CommonFilter, {
  GlobalKeypressManager,
} from "../components/CommonFilter";
import {
  ParamPrefixes,
  CommonFilterParams,
  GameFilterParams,
  FilterRequestInfo,
  ParamPrefixesType,
  ParamDefaults,
  LineupFilterParams,
} from "../utils/FilterModels";
import LineupQueryAutoSuggestText from "./shared/LineupQueryAutoSuggestText";

// Utils
import { StatModels } from "../utils/StatModels";
import { QueryUtils, CommonFilterCustomDate } from "../utils/QueryUtils";
import { QueryDisplayUtils } from "../utils/QueryDisplayUtils";
import QueryFilterDropdown from "./shared/QueryFilterDropdown";
import DateRangeModal from "./shared/DateRangeModal";
import { UrlRouting } from "../utils/UrlRouting";

type Props = {
  onStats: (
    teamStats: TeamStatsModel,
    rosterCompareStats: RosterCompareModel,
    rosterStats: RosterStatsModel,
    lineupStats: LineupStatsModel[]
  ) => void;
  startingState: GameFilterParams;
  onChangeState: (newParams: GameFilterParams) => void;
  forceReload1Up: number;
};

const GameFilter: React.FunctionComponent<Props> = ({
  onStats,
  startingState,
  onChangeState,
  forceReload1Up,
}) => {
  // Data model

  const {
    // Team stats
    teamDiffs: startTeamDiffs,
    showTeamPlayTypes: startShowTeamPlayTypes,
    showRoster: startShowRoster,
    showGameInfo: startShowGameInfo,
    showGrades: startShowGrades,
    showExtraInfo: startShowExtraInfo,
    //(common visualization fields across all tables)
    //(manual overrides)
    manual: startManual,
    showPlayerManual: startShowPlayerManual,
    showOnBallConfig: startShowOnBallConfig,
    //(luck)
    luck: startLuck,
    //(these fields are for the team view)
    onOffLuck: startOnOffLuck,
    showOnOffLuckDiags: startShowOnOffLuckDiags,
    showPlayerOnOffLuckDiags: startShowPlayerOnOffLuckDiags,
    calcRapm: startCalcRapm,
    rapmPriorMode: startRapmPriorMode,
    rapmRegressMode: startRapmRegressMode,
    //(these fields are for the individual view)
    filter: startFilter,
    sortBy: startSortBy,
    showBase: startShowBase,
    showExpanded: startShowExpanded,
    showDiag: startShowDiag,
    possAsPct: startPossAsPct,
    showPosDiag: startShowPosDiag,
    showPlayerPlayTypes: startShowPlayerPlayTypes,
    showInfoSubHeader: startShowInfoSubHeader,
    //these fields affect the query
    autoOffQuery: startAutoOffQuery,
    onQuery: startOnQuery,
    offQuery: startOffQuery,
    onQueryFilters: startOnQueryFilters,
    offQueryFilters: startOffQueryFilters,
    ...startingCommonFilterParams
  } = startingState;

  /** The state managed by the CommonFilter element */
  const [commonParams, setCommonParams] = useState(
    startingCommonFilterParams as CommonFilterParams
  );

  /** Ugly pattern that is part of support for force reloading */
  const [internalForceReload1Up, setInternalForceReload1Up] =
    useState(forceReload1Up);

  useEffect(() => {
    // Whenever forceReload1Up is incremented, reset common params:
    if (forceReload1Up != internalForceReload1Up) {
      setCommonParams(startingCommonFilterParams as CommonFilterParams);
      setInternalForceReload1Up(forceReload1Up);
      // Actually have to reset these two vs just their underlying value
      // (could build that intermediate pair,. but we'll stick with this limitation for now)
      setOnQuery(startOnQuery || "");
      setOffQuery(startOffQuery || "");
      setOnQueryFilters(
        QueryUtils.parseFilter(
          _.isNil(startOnQueryFilters)
            ? ParamDefaults.defaultQueryFilters
            : startOnQueryFilters,
          startingState.year || ParamDefaults.defaultYear
        )
      );
      setOffQueryFilters(
        QueryUtils.parseFilter(
          _.isNil(startOffQueryFilters)
            ? ParamDefaults.defaultQueryFilters
            : startOffQueryFilters,
          startingState.year || ParamDefaults.defaultYear
        )
      );
      //(leave toggleAutoOffQuery since it seems harmless, and weird stuff happened when I tried to set it
      // which I don't have time to investigate):
      //toggleAutoOffQuery(startAutoOffQuery);
    }
  }, [forceReload1Up]);

  // Game Filter - custom queries and filters:

  const [autoOffQuery, toggleAutoOffQuery] = useState(
    _.isNil(startAutoOffQuery)
      ? ParamDefaults.defaultAutoOffQuery
      : startAutoOffQuery
  );
  const [onQuery, setOnQuery] = useState(startOnQuery || "");
  const [offQuery, setOffQuery] = useState(startOffQuery || "");

  //TODO: need to plumb
  const [onQueryFilters, setOnQueryFilters] = useState(
    QueryUtils.parseFilter(
      _.isNil(startOnQueryFilters)
        ? ParamDefaults.defaultQueryFilters
        : startOnQueryFilters,
      startingState.year || ParamDefaults.defaultYear
    )
  );
  const [offQueryFilters, setOffQueryFilters] = useState(
    QueryUtils.parseFilter(
      _.isNil(startOffQueryFilters)
        ? ParamDefaults.defaultQueryFilters
        : startOffQueryFilters,
      startingState.year || ParamDefaults.defaultYear
    )
  );
  const [showOnDateRangeModal, setOnShowDateRangeModal] = useState(false);
  const [showOffDateRangeModal, setOffShowDateRangeModal] = useState(false);

  /** Used to differentiate between the different implementations of the CommonFilter */
  const cacheKeyPrefix = ParamPrefixes.game;

  // Utils

  /** Bridge between the callback in CommonFilter and state management */
  function updateCommonParams(params: CommonFilterParams) {
    setCommonParams(params);
  }

  /** Builds lineup queries for on/off queries */
  function buildLineupQueriesFromOnOffQueries(): {
    on?: CommonFilterParams;
    off?: CommonFilterParams;
  } {
    //TODO: should tidy this up so can just make get lineups back from on/off query
    //      but for now we'll just hack a workaround
    const [baseQuery, maybeAdvBaseQuery] = QueryUtils.extractAdvancedQuery(
      commonParams.baseQuery || ""
    );

    const getLineupQuery = (
      onOrOffQuery: string,
      ignoreBase: boolean = false
    ) => {
      const [onOrOff, maybeAdvOnOrOff] =
        QueryUtils.extractAdvancedQuery(onOrOffQuery);
      const baseToUse = ignoreBase ? "*" : maybeAdvBaseQuery || baseQuery || "";
      const onOffToUse = maybeAdvOnOrOff || onOrOff || "";
      return baseToUse != ""
        ? `(${onOffToUse}) AND (${baseToUse})`
        : onOffToUse;
    };
    return {
      on: QueryUtils.nonEmptyQuery(onQuery, onQueryFilters)
        ? {
            baseQuery: getLineupQuery(onQuery || "*"),
            queryFilters: QueryUtils.buildFilterStr(
              onQueryFilters.concat(
                QueryUtils.parseFilter(
                  commonParams.queryFilters ||
                    ParamDefaults.defaultQueryFilters,
                  commonParams.year || ParamDefaults.defaultYear
                )
              )
            ),
          }
        : undefined,

      off: _.thru(
        QueryUtils.autoOffAndFilters(autoOffQuery, onQueryFilters),
        (autoOff) => {
          const nonEmptyOff = QueryUtils.nonEmptyQuery(
            offQuery,
            offQueryFilters
          );

          if (!autoOff && nonEmptyOff) {
            return {
              baseQuery: getLineupQuery(offQuery || "*"), //(this is actually "B" not "off" if we're here and offQuery == "")
              queryFilters: QueryUtils.buildFilterStr(
                offQueryFilters.concat(
                  QueryUtils.parseFilter(
                    commonParams.queryFilters ||
                      ParamDefaults.defaultQueryFilters,
                    commonParams.year || ParamDefaults.defaultYear
                  )
                )
              ),
            };
          } else if (autoOff) {
            return {
              baseQuery: commonParams.baseQuery,
              queryFilters: commonParams.queryFilters,
              invertBase: getLineupQuery(onQuery || "*", true),
              invertBaseQueryFilters: QueryUtils.buildFilterStr(onQueryFilters),
              //(ie will be * once inverted, ie ignore this clause if missing)
            };
          } else {
            return undefined;
          }
        }
      ),
    };
  }

  /** Builds a game filter from the various state elements, and also any secondary filters
   * NOTE: ugly hack I need to fix, needs to sync with CommonFilter.onSeeExample
   */
  function buildParamsFromState(
    includeFilterParams: Boolean
  ): [GameFilterParams, FilterRequestInfo[]] {
    // Only include these if they aren't defaults:
    const onQueryFiltersObj = !_.isEmpty(onQueryFilters)
      ? { onQueryFilters: QueryUtils.buildFilterStr(onQueryFilters) }
      : {};
    const offQueryFiltersObj =
      autoOffQuery || _.isEmpty(offQueryFilters)
        ? {}
        : { offQueryFilters: QueryUtils.buildFilterStr(offQueryFilters) };

    const primaryRequest: GameFilterParams = includeFilterParams
      ? _.assign(buildParamsFromState(false)[0], {
          // Team stats
          autoOffQuery: autoOffQuery,
          teamDiffs: startTeamDiffs,
          showTeamPlayTypes: startShowTeamPlayTypes,
          showRoster: startShowRoster,
          showGameInfo: startShowGameInfo,
          showGrades: startShowGrades,
          showExtraInfo: startShowExtraInfo,
          // Common luck stats across all tables:
          //(manual overrides)
          manual: startManual,
          showPlayerManual: startShowPlayerManual,
          showOnBallConfig: startShowOnBallConfig,
          //(luck)
          luck: startLuck,
          onOffLuck: startOnOffLuck,
          showOnOffLuckDiags: startShowOnOffLuckDiags,
          showPlayerOnOffLuckDiags: startShowPlayerOnOffLuckDiags,
          // Individual stats:
          calcRapm: startCalcRapm,
          rapmPriorMode: startRapmPriorMode,
          rapmRegressMode: startRapmRegressMode,
          filter: startFilter,
          sortBy: startSortBy,
          showBase: startShowBase,
          showExpanded: startShowExpanded,
          showDiag: startShowDiag,
          possAsPct: startPossAsPct,
          showPosDiag: startShowPosDiag,
          showPlayerPlayTypes: startShowPlayerPlayTypes,
          showInfoSubHeader: startShowInfoSubHeader,
        })
      : {
          ...commonParams,
          autoOffQuery: autoOffQuery,
          onQuery: onQuery,
          ...onQueryFiltersObj,
          offQuery: offQuery,
          ...offQueryFiltersObj, //(not possible to specify if auto-off)
        };
    //(another ugly hack to be fixed - remove default optional fields)
    QueryUtils.cleanseQuery(primaryRequest);

    const entireSeasonRequest = {
      // Get the entire season of players for things like luck adjustments
      team: primaryRequest.team,
      year: primaryRequest.year,
      gender: primaryRequest.gender,
      minRank: ParamDefaults.defaultMinRank,
      maxRank: ParamDefaults.defaultMaxRank,
      baseQuery: "",
      onQuery: "",
      offQuery: "",
    };
    //TODO: also if the main query minus/on-off matches can't we just re-use that?!
    // (ie and just ignore the on-off portion)

    const alsoPullLineups =
      startCalcRapm || startShowRoster || startShowGameInfo;

    // Lineups (eg for RAPM) calculations:
    //TODO: should tidy this up so can just make get lineups back from on/off query
    //      but for now we'll just hack a workaround
    const lineupRequests: LineupFilterParams[] = alsoPullLineups
      ? _.thru(alsoPullLineups, (__) => {
          const lineupQueriesAndFilters = buildLineupQueriesFromOnOffQueries();
          return [
            QueryUtils.cleanseQuery({
              ...commonParams,
            }),
          ]
            .concat(
              _.isEmpty(lineupQueriesAndFilters.on)
                ? []
                : [
                    QueryUtils.cleanseQuery({
                      ...commonParams,
                      ...lineupQueriesAndFilters.on,
                    }),
                  ]
            )
            .concat(
              _.isEmpty(lineupQueriesAndFilters.off)
                ? []
                : [
                    QueryUtils.cleanseQuery({
                      ...commonParams,
                      ...lineupQueriesAndFilters.off,
                    }),
                  ]
            )
            .map((l) => {
              return startShowGameInfo
                ? {
                    ...l,
                    showGameInfo: startShowGameInfo,
                  }
                : l;
            });
        })
      : [];

    const makeGlobalRequest = !_.isEqual(entireSeasonRequest, primaryRequest);

    return [
      primaryRequest,
      [
        {
          context: ParamPrefixes.roster as ParamPrefixesType,
          paramsObj: primaryRequest,
        },
        {
          context: ParamPrefixes.player as ParamPrefixesType,
          paramsObj: primaryRequest,
          includeRoster: !makeGlobalRequest,
        },
      ]
        .concat(
          makeGlobalRequest
            ? [
                {
                  //(don't make a spurious call)
                  context: ParamPrefixes.player as ParamPrefixesType,
                  paramsObj: entireSeasonRequest,
                  includeRoster: true,
                },
              ]
            : []
        )
        .concat(
          lineupRequests.map((req) => {
            return {
              context: ParamPrefixes.lineup as ParamPrefixesType,
              paramsObj: req,
            };
          })
        ),
    ];
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(jsonResps: any[], wasError: Boolean) {
    const jsonStatuses = jsonResps.map((j) => j.status);
    const teamJson = jsonResps?.[0]?.responses?.[0] || {}; //(from primary request)
    const rosterCompareJson = jsonResps?.[1]?.responses?.[0] || {}; //(from roster request)
    const rosterStatsJson = jsonResps?.[2]?.responses?.[0] || {}; //(from player request #1)

    // 3, [4, 5] can be lineups ... or they might be 4, [5, 6]
    // depends on whether jsonResps?.[3]?.responses?.[0] has "aggregations.tri_filter"

    //(optionally, from player request #2)
    const hasGlobalRosterStats =
      jsonResps?.[3]?.responses?.[0]?.aggregations?.tri_filter;
    const globalRosterStatsJson =
      (hasGlobalRosterStats ? jsonResps?.[3]?.responses?.[0] : undefined) ||
      _.cloneDeep(rosterStatsJson);
    //(need to clone it so that changes to baseline don't overwrite global)

    const globalTeam =
      teamJson?.aggregations?.global?.only?.buckets?.team ||
      StatModels.emptyTeam();
    const rosterInfo = jsonResps?.[hasGlobalRosterStats ? 3 : 2]?.roster;
    if (rosterInfo) {
      globalTeam.roster = rosterInfo;
    }

    /** For RAPM, from lineup requests */
    const lineupResponses = _.drop(jsonResps, hasGlobalRosterStats ? 4 : 3).map(
      (lineupJson) => {
        return {
          lineups: lineupJson?.responses?.[0]?.aggregations?.lineups?.buckets,
          error_code: wasError
            ? lineupJson?.status || jsonStatuses?.[0] || "Unknown"
            : undefined,
        };
      }
    );

    onStats(
      {
        on:
          teamJson?.aggregations?.tri_filter?.buckets?.on ||
          StatModels.emptyTeam(),
        off:
          teamJson?.aggregations?.tri_filter?.buckets?.off ||
          StatModels.emptyTeam(),
        onOffMode: autoOffQuery,
        baseline:
          teamJson?.aggregations?.tri_filter?.buckets?.baseline ||
          StatModels.emptyTeam(),
        global: globalTeam,
        error_code: wasError
          ? teamJson?.status || jsonStatuses?.[0] || "Unknown"
          : undefined,
      },
      {
        on: rosterCompareJson?.aggregations?.tri_filter?.buckets?.on || {},
        off: rosterCompareJson?.aggregations?.tri_filter?.buckets?.off || {},
        onOffMode: autoOffQuery,
        baseline:
          rosterCompareJson?.aggregations?.tri_filter?.buckets?.baseline || {},
        error_code: wasError
          ? rosterCompareJson?.status || jsonStatuses?.[1] || "Unknown"
          : undefined,
      },
      {
        on:
          rosterStatsJson?.aggregations?.tri_filter?.buckets?.on?.player
            ?.buckets || [],
        off:
          rosterStatsJson?.aggregations?.tri_filter?.buckets?.off?.player
            ?.buckets || [],
        onOffMode: autoOffQuery,
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
      },
      lineupResponses
    );
  }

  /** Sets the automatically generated off query, if that option is selected */
  const setAutoOffQuery = (onQuery: string) => {
    setOffQuery(onQuery == "" || onQuery == " " ? "" : `NOT (${onQuery})`);
  };

  /** Ran into issues with SSR and 'readOnly' property, so have to fix like this */
  function renderOffQueryFormField() {
    if (typeof window !== `undefined`) {
      return (
        <Form.Control
          placeholder="eg 'NOT (Player1 AND (Player2 OR Player3))'"
          onKeyUp={(ev: any) => setOffQuery(ev.target.value)}
          onChange={(ev: any) => setOffQuery(ev.target.value)}
          value={offQuery}
          readOnly={autoOffQuery}
        />
      );
    }
  }

  /** Works around a bug in the input where it was ignoring the first select/delete of a page load */
  const handleOnQueryChange = (ev: any) => {
    setOnQuery(ev.target.value);
    if (autoOffQuery) {
      setAutoOffQuery(ev.target.value);
    }
  };

  const maybeOn = autoOffQuery ? "On ('A')" : "'A'";
  const maybeOff = autoOffQuery ? "Off ('B')" : "'B'";

  // Link building:

  const buildLineups = (
    params: GameFilterParams,
    overrides: CommonFilterParams
  ) => {
    return {
      gender: params.gender,
      year: params.year,
      team: params.team,
      minRank: params.minRank,
      maxRank: params.maxRank,
      filterGarbage: params.filterGarbage,
      // Query filters and base query:
      ...overrides,
      // Game info
      showGameInfo: params.showGameInfo,
      // Luck:
      luck: params.luck,
      lineupLuck: params.onOffLuck,
      showLineupLuckDiags: params.onOffLuck,
    };
  };

  // Visual components:

  return (
    <CommonFilter //(generic type inferred)
      startingState={startingState}
      onChangeState={onChangeState}
      onChangeCommonState={updateCommonParams}
      tablePrefix={cacheKeyPrefix}
      buildParamsFromState={buildParamsFromState}
      childHandleResponse={handleResponse}
      buildLinks={(params) => {
        const lineupOnOffQueries = buildLineupQueriesFromOnOffQueries();
        //(don't this is built from state instead of params)
        return [
          <a
            target="_blank"
            href={UrlRouting.getLineupUrl(
              buildLineups(params, {
                baseQuery: params.baseQuery,
                queryFilters: params.queryFilters,
              }),
              {}
            )}
          >
            Base Lineups
          </a>,
        ]
          .concat(
            lineupOnOffQueries.on
              ? [
                  <a
                    target="_blank"
                    href={UrlRouting.getLineupUrl(
                      buildLineups(params, lineupOnOffQueries.on),
                      {}
                    )}
                  >
                    'A' Lineups
                  </a>,
                ]
              : []
          )
          .concat(
            lineupOnOffQueries.off
              ? [
                  <a
                    target="_blank"
                    href={UrlRouting.getLineupUrl(
                      buildLineups(params, lineupOnOffQueries.off),
                      {}
                    )}
                  >
                    'B' Lineups
                  </a>,
                ]
              : []
          )
          .concat([
            <a
              target="_blank"
              href={UrlRouting.getMatchupUrl({
                gender: params.gender,
                year: params.year,
                team: params.team,
              })}
            >
              Game Reports
            </a>,
          ]);
      }}
      forceReload1Up={internalForceReload1Up}
    >
      <GlobalKeypressManager.Consumer>
        {(globalKeypressHandler) => (
          <div>
            <DateRangeModal
              show={showOnDateRangeModal}
              queryType="On/'A' Query"
              onSave={(filter: CommonFilterCustomDate | undefined) =>
                setOnQueryFilters(
                  QueryUtils.setCustomDate(onQueryFilters, filter)
                )
              }
              onHide={() => setOnShowDateRangeModal(false)}
              year={startingState.year || ParamDefaults.defaultYear}
            />
            <DateRangeModal
              show={showOffDateRangeModal}
              queryType="Off/'B' Query"
              onSave={(filter: CommonFilterCustomDate | undefined) =>
                setOffQueryFilters(
                  QueryUtils.setCustomDate(offQueryFilters, filter)
                )
              }
              onHide={() => setOffShowDateRangeModal(false)}
              year={startingState.year || ParamDefaults.defaultYear}
            />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                {maybeOn} Query
              </Form.Label>
              <Col sm="8">
                <Container>
                  <Row>
                    <InputGroup>
                      <div className="flex-fill">
                        <LineupQueryAutoSuggestText
                          readOnly={false}
                          placeholder="eg 'Player1 AND (Player2 OR Player3)'"
                          initValue={onQuery}
                          year={commonParams.year}
                          gender={commonParams.gender}
                          team={commonParams.team}
                          onKeyUp={handleOnQueryChange}
                          onChange={handleOnQueryChange}
                          onKeyDown={globalKeypressHandler}
                        />
                      </div>
                      <QueryFilterDropdown
                        queryFilters={onQueryFilters}
                        setQueryFilters={setOnQueryFilters}
                        showCustomRangeFilter={() =>
                          setOnShowDateRangeModal(true)
                        }
                      />
                    </InputGroup>
                  </Row>
                  {onQueryFilters.length > 0 ? (
                    <Row>
                      &nbsp;
                      {onQueryFilters.map((p, i) => (
                        <span key={`conf${i}`}>
                          {i > 0 ? null : <small>AND </small>}
                          {QueryDisplayUtils.showQueryFilter(
                            p,
                            commonParams.gender || "",
                            commonParams.year || ""
                          )}
                          &nbsp;
                        </span>
                      ))}
                    </Row>
                  ) : null}
                </Container>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                {maybeOff} Query
              </Form.Label>
              <Col sm="8">
                {
                  typeof window !== `undefined` ? (
                    <Container>
                      <Row>
                        <InputGroup>
                          <div className="flex-fill">
                            <LineupQueryAutoSuggestText
                              readOnly={autoOffQuery}
                              placeholder="eg 'NOT (Player1 AND (Player2 OR Player3))'"
                              initValue={offQuery}
                              year={commonParams.year}
                              gender={commonParams.gender}
                              team={commonParams.team}
                              onKeyUp={(ev: any) =>
                                setOffQuery(ev.target.value)
                              }
                              onChange={(ev: any) =>
                                setOffQuery(ev.target.value)
                              }
                              onKeyDown={globalKeypressHandler}
                            />
                          </div>
                          {autoOffQuery ? null : (
                            <QueryFilterDropdown
                              queryFilters={offQueryFilters}
                              setQueryFilters={setOffQueryFilters}
                              showCustomRangeFilter={() =>
                                setOffShowDateRangeModal(true)
                              }
                            />
                          )}
                        </InputGroup>
                      </Row>
                      {offQueryFilters.length > 0 && !autoOffQuery ? (
                        <Row>
                          &nbsp;
                          {offQueryFilters.map((p, i) => (
                            <span key={`conf${i}`}>
                              {i > 0 ? null : <small>AND </small>}
                              {QueryDisplayUtils.showQueryFilter(
                                p,
                                commonParams.gender || "",
                                commonParams.year || ""
                              )}
                              &nbsp;
                            </span>
                          ))}
                        </Row>
                      ) : null}
                      {onQueryFilters.length > 0 && autoOffQuery ? (
                        <Row>
                          &nbsp;
                          {onQueryFilters.map((p, i) => (
                            <span key={`conf${i}`}>
                              {i > 0 ? <span>/ </span> : <small>OR </small>}
                              {QueryDisplayUtils.showQueryFilter(
                                p,
                                commonParams.gender || "",
                                commonParams.year || "",
                                true
                              )}
                              &nbsp;
                            </span>
                          ))}
                        </Row>
                      ) : null}
                    </Container>
                  ) : null //(this construct needed to address SSR/readonly issue)
                }
              </Col>
              <Col sm="2" className="mt-1">
                <Form.Check
                  type="switch"
                  id="autoOffQuery"
                  checked={autoOffQuery}
                  onChange={() => {
                    setOffQueryFilters([]);
                    if (!autoOffQuery) {
                      setAutoOffQuery(onQuery);
                    } //(TODO: note clearing offQuery in the else doesn't work due to limitations of AutoSuggestText)
                    toggleAutoOffQuery(!autoOffQuery);
                  }}
                  label="Auto"
                />
              </Col>
            </Form.Group>
          </div>
        )}
      </GlobalKeypressManager.Consumer>
    </CommonFilter>
  );
};

export default GameFilter;
