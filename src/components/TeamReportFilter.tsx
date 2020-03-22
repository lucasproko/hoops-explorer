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
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { LineupStatsModel } from '../components/LineupStatsTable';
import CommonFilter from '../components/CommonFilter';
import { ParamPrefixes, CommonFilterParams, TeamReportFilterParams } from "../utils/FilterModels";

// Library imports:
import fetch from 'isomorphic-unfetch';

type Props = {
  onStats: (reportStats: LineupStatsModel) => void;
  startingState: TeamReportFilterParams;
  onChangeState: (newParams: TeamReportFilterParams) => void;
}

const TeamReportFilter: React.FunctionComponent<Props> = ({onStats, startingState, onChangeState}) => {

  // Data model

  const {
    sortBy: startSortBy,
    filter: startFilter,
    showOnOff: startShowOnOff,
    showComps: startShowComps,
    incRepOnOff: startIncRepOnOff,
    regressDiffs: startingRegressDiffs,
    repOnOffDiagMode: startingRepOnOffDiagMode,
    ...startingCommonFilterParams
  } = startingState;

  /** The state managed by the CommonFilter element */
  const [ commonParams, setCommonParams ] = useState(startingCommonFilterParams as CommonFilterParams);

  // Lineup Filter - custom queries and filters:

  const isDebug = (process.env.NODE_ENV !== 'production');

  const cacheKeyPrefix = ParamPrefixes.report;

  // Utils

  /** Bridge between the callback in CommonFilter and state management */
  function updateCommonParams(params: CommonFilterParams) {
    setCommonParams(params)
  }

  /** Builds a game filter from the various state elements */
  function buildParamsFromState(includeFilterParams: Boolean): TeamReportFilterParams {
    return includeFilterParams ?
    _.merge(
      buildParamsFromState(false), {
        sortBy: startSortBy,
        filter: startFilter,
        showOnOff: startShowOnOff,
        showComps: startShowComps,
        incRepOnOff: startIncRepOnOff,
        regressDiffs: startingRegressDiffs,
        repOnOffDiagMode: startingRepOnOffDiagMode,
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

export default TeamReportFilter;
