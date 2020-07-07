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
import CommonFilter from '../components/CommonFilter';
import { ParamDefaults, ParamPrefixesType, ParamPrefixes, FilterParamsType, CommonFilterParams, LineupFilterParams, FilterRequestInfo, getCommonFilterParams } from "../utils/FilterModels";

// Utils
import { QueryUtils } from '../utils/QueryUtils';

type Props = {
  onStats: (lineupStats: LineupStatsModel, rosterStats: RosterStatsModel) => void;
  startingState: LineupFilterParams;
  onChangeState: (newParams: LineupFilterParams) => void;
}

const LineupFilter: React.FunctionComponent<Props> = ({onStats, startingState, onChangeState}) => {
  //console.log("Loading LineupFilter " + JSON.stringify(startingState));

  // Data model

  const {
    maxTableSize: startMaxTableSize,
    minPoss: startMinPoss,
    sortBy: startSortBy,
    filter: startFilter,
    ...startingCommonFilterParams
  } = startingState;

  /** The state managed by the CommonFilter element */
  const [ commonParams, setCommonParams ] = useState(startingCommonFilterParams as CommonFilterParams);

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
    _.merge(
      buildParamsFromState(false)[0], {
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

    return [ primaryRequest, [{
        context: ParamPrefixes.player as ParamPrefixesType, paramsObj: secondaryRequest
      }].concat(_.isEqual(entireSeasonRequest, secondaryRequest) ? [] :[{ //(don't make a spurious call)
        context: ParamPrefixes.player as ParamPrefixesType, paramsObj: entireSeasonRequest
      }])
    ];
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(jsonResps: any[], wasError: Boolean) {
    const jsonStatuses = jsonResps.map(j => j.status);
    const lineupJson = jsonResps?.[0]?.responses?.[0] || {};
    const rosterStatsJson = jsonResps?.[1]?.responses?.[0] || {};
    const globalRosterStatsJson = jsonResps?.[2]?.responses?.[0] || rosterStatsJson;

    onStats({
      lineups: lineupJson?.aggregations?.lineups?.buckets,
      error_code: wasError ? (lineupJson?.status || jsonStatuses?.[0] || "Unknown") : undefined
    }, {
      baseline: rosterStatsJson?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      global: globalRosterStatsJson?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      error_code: wasError ? (rosterStatsJson?.status || jsonStatuses?.[1] ||
          globalRosterStatsJson?.status || jsonStatuses?.[2] || "Unknown") : undefined
    });
  }

  /** Builds the query issued to the API server - the response handling is generic */
  function onSubmit(paramObj: FilterParamsType) {
    return [{
      context: ParamPrefixes.lineup,
      paramsObj: paramObj
    }];
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
    />
    ;
}

export default LineupFilter;
