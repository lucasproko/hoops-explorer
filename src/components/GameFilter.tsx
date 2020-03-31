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
import { TeamStatsModel } from '../components/TeamStatsTable';
import { RosterCompareModel } from '../components/RosterCompareTable';
import { RosterStatsModel } from '../components/RosterStatsTable';
import CommonFilter, { GlobalKeypressManager } from '../components/CommonFilter';
import { ParamPrefixes, CommonFilterParams, GameFilterParams, ParamDefaults } from "../utils/FilterModels";
import AutoSuggestText from './AutoSuggestText';

// Library imports:
import fetch from 'isomorphic-unfetch';

type Props = {
  onStats: (teamStats: TeamStatsModel, rosterCompareStats: RosterCompareModel, rosterStats: RosterStatsModel) => void;
  startingState: GameFilterParams;
  onChangeState: (newParams: GameFilterParams) => void;
}

const GameFilter: React.FunctionComponent<Props> = ({onStats, startingState, onChangeState}) => {

  // Data model

  const {
    //(these fields are for the individual view)
    filter: startFilter, sortBy: startSortBy,
    showBase: startShowBase, showExpanded: startShowExpanded,
    showDiag: startShowDiag,
    //these fields affect the query
    autoOffQuery: startAutoOffQuery,
    onQuery: startOnQuery, offQuery: startOffQuery,
    ...startingCommonFilterParams
  } = startingState;

  /** The state managed by the CommonFilter element */
  const [ commonParams, setCommonParams ] = useState(startingCommonFilterParams as CommonFilterParams);

  // Game Filter - custom queries and filters:

  const [ autoOffQuery, toggleAutoOffQuery ] = useState(
    _.isNil(startAutoOffQuery) ? ParamDefaults.defaultAutoOffQuery : startAutoOffQuery
  );
  const [ onQuery, setOnQuery ] = useState(startOnQuery || "");
  const [ offQuery, setOffQuery ] = useState(startOffQuery || "");

  /** Used to differentiate between the different implementations of the CommonFilter */
  const cacheKeyPrefix = ParamPrefixes.game;

  // Utils

  /** Bridge between the callback in CommonFilter and state management */
  function updateCommonParams(params: CommonFilterParams) {
    setCommonParams(params)
  }

  /** Builds a game filter from the various state elements */
  function buildParamsFromState(includeFilterParams: Boolean): GameFilterParams {
    return includeFilterParams ?
      _.merge(
        buildParamsFromState(false), {
          // Individual stats:
          filter: startFilter, sortBy: startSortBy,
          showBase: startShowBase, showExpanded: startShowExpanded,
          showDiag: startShowDiag
      }) : {
        ...commonParams,
        autoOffQuery: autoOffQuery,
        onQuery: onQuery,
        offQuery: offQuery
      };
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(json: any, wasError: Boolean) {
    const jsons = json?.responses || [];
    const teamJson = (jsons.length > 0) ? jsons[0] : {};
    const rosterCompareJson = (jsons.length > 1) ? jsons[1] : {};
    const rosterStatsJson = (jsons.length > 2) ? jsons[2] : {};
    onStats({
      on: teamJson?.aggregations?.tri_filter?.buckets?.on || {},
      off: teamJson?.aggregations?.tri_filter?.buckets?.off || {},
      baseline: teamJson?.aggregations?.tri_filter?.buckets?.baseline || {},
      error_code: wasError ? (teamJson?.status || json?.status) : undefined
    }, {
      on: rosterCompareJson?.aggregations?.tri_filter?.buckets?.on || {},
      off: rosterCompareJson?.aggregations?.tri_filter?.buckets?.off || {},
      baseline: rosterCompareJson?.aggregations?.tri_filter?.buckets?.baseline || {},
      error_code: wasError ? (rosterCompareJson?.status || json?.status) : undefined
    }, {
      on: rosterStatsJson?.aggregations?.tri_filter?.buckets?.on?.player?.buckets || [],
      off: rosterStatsJson?.aggregations?.tri_filter?.buckets?.off?.player?.buckets || [],
      baseline: rosterStatsJson?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      error_code: wasError ? (rosterStatsJson?.status || json?.status) : undefined
    });
  }

  /** Builds the query issued to the API server - the response handling is generic */
  function onSubmit(paramStr: string, callback: (resp: fetch.IsomorphicResponse) => void) {
    fetch(`/api/calculateOnOffStats?${paramStr}`).then(callback);
  }

  /** Sets the automatically generated off query, if that option is selected */
  const setAutoOffQuery = (onQuery: string) => {
    setOffQuery(onQuery == "" ? "" : `NOT (${onQuery})`);
  }

  /** Ran into issues with SSR and 'readOnly' property, so have to fix like this */
  function renderOffQueryFormField() {
    if (typeof window !== `undefined`) {
      return <Form.Control
        placeholder="eg 'NOT (Player1 AND (Player2 OR Player3))'"
        onKeyUp={(ev: any) => setOffQuery(ev.target.value)}
        onChange={(ev: any) => setOffQuery(ev.target.value)}
        value={offQuery}
        readOnly={autoOffQuery}
      />
    }
  }

  /** Works around a bug in the input where it was ignoring the first select/delete of a page load */
  const handleOnQueryChange = (ev: any) => {
    setOnQuery(ev.target.value);
    if (autoOffQuery) {
      setAutoOffQuery(ev.target.value);
    }
  };

  // Visual components:

  return <CommonFilter //(generic type inferred)
      startingState={startingState}
      onChangeState={onChangeState}
      onChangeCommonState={updateCommonParams}
      tablePrefix = {cacheKeyPrefix}
      buildParamsFromState={buildParamsFromState}
      childHandleResponse={handleResponse}
      childSubmitRequest={onSubmit}
    ><GlobalKeypressManager.Consumer>{ globalKeypressHandler => <div>
      <Form.Group as={Row}>
        <Form.Label column sm="2">On Query</Form.Label>
        <Col sm="8">
          <AutoSuggestText
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
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column sm="2">Off Query</Form.Label>
        <Col sm="8">
          { (typeof window !== `undefined`) ?
            <AutoSuggestText
              readOnly={autoOffQuery}
              placeholder="eg 'NOT (Player1 AND (Player2 OR Player3))'"
              initValue={offQuery}
              year={commonParams.year}
              gender={commonParams.gender}
              team={commonParams.team}
              onKeyUp={(ev: any) => setOffQuery(ev.target.value)}
              onChange={(ev: any) => setOffQuery(ev.target.value)}
              onKeyDown={globalKeypressHandler}
            /> : <div/> //(this construct needed to address SSR/readonly issue)
          }
        </Col>
        <Col sm="2">
          <Form.Check type="switch"
            id="autoOffQuery"
            checked={autoOffQuery}
            onChange={() => {
              if (!autoOffQuery) {
                setAutoOffQuery(onQuery);
              }
              toggleAutoOffQuery(!autoOffQuery);
            }}
            label="Auto"
          />
        </Col>
      </Form.Group>
    </div>}</GlobalKeypressManager.Consumer></CommonFilter>
    ;
}

export default GameFilter;
