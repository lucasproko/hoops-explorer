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
import { ParamPrefixes, CommonFilterParams, LineupFilterParams } from "../utils/FilterModels";

// Library imports:
import fetch from 'isomorphic-unfetch';

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

  /** Builds a game filter from the various state elements */
  function buildParamsFromState(includeFilterParams: Boolean): LineupFilterParams {
    return includeFilterParams ?
    _.merge(
      buildParamsFromState(false), {
        maxTableSize: startMaxTableSize,
        minPoss: startMinPoss,
        sortBy: startSortBy,
        filter: startFilter
    }) : {
      ...commonParams
    };
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(json: any, wasError: Boolean) {
    const jsons = json?.responses || [];
    const lineupJson = (jsons.length > 0) ? jsons[0] : {};
    onStats({
      lineups: lineupJson?.aggregations?.lineups?.buckets,
      error_code: wasError ? (lineupJson?.status || json?.status) : undefined
    });
  }

  /** Builds the query issued to the API server - the response handling is generic */
  function onSubmit(paramStr: string, callback: (resp: fetch.IsomorphicResponse) => void) {
    fetch(`/api/calculateLineupStats?${paramStr}`).then(callback);
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
      childSubmitRequest={onSubmit}
    />
    ;
}

export default LineupFilter;
