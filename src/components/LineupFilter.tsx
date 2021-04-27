// React imports:
import React, { useState, useEffect } from 'react';

// Next imports:
import { NextPage } from 'next';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Component imports:
import { LineupStatsModel } from '../components/LineupStatsTable';
import { RosterStatsModel } from '../components/RosterStatsTable';
import { TeamStatsModel } from '../components/TeamStatsTable';
import CommonFilter from '../components/CommonFilter';
import { ParamDefaults, ParamPrefixesType, ParamPrefixes, FilterParamsType, CommonFilterParams, LineupFilterParams, FilterRequestInfo, getCommonFilterParams } from "../utils/FilterModels";

// Utils
import { QueryUtils } from '../utils/QueryUtils';

type Props = {
  onStats: (lineupStats: LineupStatsModel, teamStats: TeamStatsModel, rosterStats: RosterStatsModel) => void;
  startingState: LineupFilterParams;
  onChangeState: (newParams: LineupFilterParams) => void;
  forceReload1Up: number;
}

const LineupFilter: React.FunctionComponent<Props> = ({onStats, startingState, onChangeState, forceReload1Up}) => {
  //console.log("Loading LineupFilter " + JSON.stringify(startingState));

  // Data model

  const {
    // Luck stats:
    luck: startLuck,
    lineupLuck: startLineupLuck, showLineupLuckDiags: startShowLineupLuckDiags,
    aggByPos: startAggByPos,
    showGameInfo: startShowGameInfo,
    // Filters etc
    decorate: startDecorate,
    showTotal: startShowTotal,
    maxTableSize: startMaxTableSize,
    minPoss: startMinPoss,
    sortBy: startSortBy,
    filter: startFilter,
    ...startingCommonFilterParams
  } = startingState;

  /** The state managed by the CommonFilter element */
  const [ commonParams, setCommonParams ] = useState(startingCommonFilterParams as CommonFilterParams);

  /** Ugly pattern that is part of support for force reloading */
  const [ internalForceReload1Up, setInternalForceReload1Up ] = useState(forceReload1Up);

  useEffect(() => { // Whenever forceReload1Up is incremented, reset common params:
    if (forceReload1Up != internalForceReload1Up) {
      setCommonParams(startingCommonFilterParams as CommonFilterParams);
      setInternalForceReload1Up(forceReload1Up);
    }
  }, [ forceReload1Up ]);

  // Lineup Filter - custom queries and filters:

  const isDebug = (process.env.NODE_ENV !== 'production');

  const cacheKeyPrefix = ParamPrefixes.lineup;

  // Utils

  /** Bridge between the callback in CommonFilter and state management */
  function updateCommonParams(params: CommonFilterParams) {
    setCommonParams(params)
  }

  /** Builds a lineup filter from the various state elements, and also any secondary filters
   * NOTE: ugly hack I need to fix, needs to sync with CommonFilter.onSeeExample
  */
  function buildParamsFromState(includeFilterParams: Boolean): [ LineupFilterParams, FilterRequestInfo[] ]
  {
    const primaryRequest: LineupFilterParams = includeFilterParams ?
      _.assign(
        buildParamsFromState(false)[0], {
          // Luck stats:
          luck: startLuck,
          lineupLuck: startLineupLuck, showLineupLuckDiags: startShowLineupLuckDiags,
          aggByPos: startAggByPos,
          // Filters etc
          decorate: startDecorate,
          showTotal: startShowTotal,
          maxTableSize: startMaxTableSize,
          minPoss: startMinPoss,
          sortBy: startSortBy,
          filter: startFilter
      }) : {
        ...commonParams
      };
    //(another ugly hack to be fixed - remove default optional fields)
    QueryUtils.cleanseQuery(primaryRequest);

    const secondaryRequest = {
      ...primaryRequest,
      onQuery: "", offQuery: ""
    };

    const entireSeasonRequest = { // Get the entire season of players for things like luck adjustments
      team: primaryRequest.team, year: primaryRequest.year, gender: primaryRequest.gender,
      minRank: ParamDefaults.defaultMinRank, maxRank: ParamDefaults.defaultMaxRank,
      baseQuery: "", onQuery: "", offQuery: ""
    };

    if (startShowGameInfo) { // mutate primary request to inject param only if non-default
      // Special case: this determines the query set sent to the server:
      primaryRequest.showGameInfo = true;
    }

    const makeGlobalRequest = !_.isEqual(entireSeasonRequest, primaryRequest);

    return [ primaryRequest, [{
        context: ParamPrefixes.game as ParamPrefixesType, paramsObj: secondaryRequest
      }, {
        context: ParamPrefixes.player as ParamPrefixesType, paramsObj: secondaryRequest, includeRoster: !makeGlobalRequest
      }].concat(makeGlobalRequest ? [{ //(don't make a spurious call)
        context: ParamPrefixes.player as ParamPrefixesType, paramsObj: entireSeasonRequest, includeRoster: true
      }] : [])
    ];
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(jsonResps: any[], wasError: Boolean) {
    const jsonStatuses = jsonResps.map(j => j.status);
    const lineupJson = jsonResps?.[0]?.responses?.[0] || {};
    const teamJson = jsonResps?.[1]?.responses?.[0] || {};

    const rosterStatsJson = jsonResps?.[2]?.responses?.[0] || {};
    const globalRosterStatsJson = jsonResps?.[3]?.responses?.[0] || rosterStatsJson;
    const hasGlobalRosterStats = jsonResps?.[3]?.responses?.[0]?.aggregations?.tri_filter;

    const globalTeam = teamJson?.aggregations?.global?.only?.buckets?.team || {};
    const rosterInfo = jsonResps?.[hasGlobalRosterStats ? 3 : 2]?.roster;
    if (rosterInfo) {
      globalTeam.roster = rosterInfo;
    }

    onStats({
      lineups: lineupJson?.aggregations?.lineups?.buckets,
      error_code: wasError ? (lineupJson?.status || jsonStatuses?.[0] || "Unknown") : undefined
    }, {
      on: {}, off: {}, onOffMode: true,
      baseline: teamJson?.aggregations?.tri_filter?.buckets?.baseline || {},
      global: globalTeam,
      error_code: wasError ? (teamJson?.status || jsonStatuses?.[1] || "Unknown") : undefined
    }, {
      baseline: rosterStatsJson?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      global: globalRosterStatsJson?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      error_code: wasError ? (rosterStatsJson?.status || jsonStatuses?.[2] ||
          globalRosterStatsJson?.status || jsonStatuses?.[3] || "Unknown") : undefined
    });
  }

  // Visual components:

  /** Let the user know that he might need to change */

  return <CommonFilter //(generic type inferred)
      startingState={startingState}
      onChangeState={onChangeState}
      onChangeCommonState={updateCommonParams}
      tablePrefix = {cacheKeyPrefix}
      buildParamsFromState={buildParamsFromState}
      childHandleResponse={handleResponse}
      forceReload1Up={internalForceReload1Up}
    />
    ;
}

export default LineupFilter;
