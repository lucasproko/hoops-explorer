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
import { ParamPrefixes, ParamPrefixesType, CommonFilterParams, FilterRequestInfo, TeamReportFilterParams } from "../utils/FilterModels";

// Utils
import { QueryUtils } from '../utils/QueryUtils';

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
    incRapm: startIncRapm,
    regressDiffs: startingRegressDiffs,
    repOnOffDiagMode: startingRepOnOffDiagMode,
    rapmDiagMode: startingRapmDiagMode,
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

  /** Builds a team report filter from the various state elements, and also any secondary filters
   * NOTE: ugly hack I need to fix, needs to sync with CommonFilter.onSeeExample
  */
  function buildParamsFromState(includeFilterParams: Boolean): [ TeamReportFilterParams, FilterRequestInfo[] ]
  {
    const primaryRequest: TeamReportFilterParams = includeFilterParams ?
    _.merge(
      buildParamsFromState(false)[0], {
        sortBy: startSortBy,
        filter: startFilter,
        showOnOff: startShowOnOff,
        showComps: startShowComps,
        incRepOnOff: startIncRepOnOff,
        incRapm: startIncRapm,
        regressDiffs: startingRegressDiffs,
        repOnOffDiagMode: startingRepOnOffDiagMode,
        rapmDiagMode: startingRapmDiagMode
    }) : {
      ...commonParams
    };
    //(another ugly hack to be fixed - remove default optional fields)
    QueryUtils.cleanseQuery(primaryRequest);

    return [ primaryRequest, [] ];
  }

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

export default TeamReportFilter;
