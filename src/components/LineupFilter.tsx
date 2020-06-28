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
import CommonFilter from '../components/CommonFilter';
import { ParamPrefixes, FilterParamsType, CommonFilterParams, LineupFilterParams, FilterRequestInfo } from "../utils/FilterModels";

type Props = {
  onStats: (lineupStats: LineupStatsModel) => void;
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

    return [ primaryRequest, [] ];
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(jsonResps: any[], wasError: Boolean) {
    //TODO: fix this per GameFilter

    const json = jsonResps[0] || []; //(currently just one request)

    const jsons = json?.responses || [];
    const lineupJson = (jsons.length > 0) ? jsons[0] : {};
    onStats({
      lineups: lineupJson?.aggregations?.lineups?.buckets,
      error_code: wasError ? (lineupJson?.status || json?.status) : undefined
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
