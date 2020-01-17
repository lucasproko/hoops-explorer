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
import { TeamStatsModel } from '../components/TeamStatsTable';
import { RosterCompareModel } from '../components/RosterCompareTable';
import CommonFilter, { CommonFilterParams } from '../components/CommonFilter';
import { ParamPrefixes, GameFilterParams, ParamDefaults } from "../utils/FilterModels";

// Library imports:
import fetch from 'isomorphic-unfetch';

type Props = {
  onStats: (teamStats: TeamStatsModel, rosterCompareStats: RosterCompareModel) => void;
  startingState: GameFilterParams;
  onChangeState: (newParams: GameFilterParams) => void;
}

const GameFilter: React.FunctionComponent<Props> = ({onStats, startingState, onChangeState}) => {

  // Data model

  /** The state managed by the CommonFilter element */
  const [ commonParams, setCommonParams ] = useState({
      year: startingState.year, team: startingState.team, gender: startingState.gender,
      minRank: startingState.minRank, maxRank: startingState.maxRank,
  } as CommonFilterParams);

  // Game Filter - custom queries and filters:

  const [ autoOffQuery, toggleAutoOffQuery ] = useState(
    "true" == (
      _.isNil(startingState.autoOffQuery) ? ParamDefaults.defaultAutoOffQuery : startingState.autoOffQuery
    )
  );
  const [ onQuery, setOnQuery ] = useState(startingState.onQuery || "");
  const [ offQuery, setOffQuery ] = useState(startingState.offQuery || "");
  const [ baseQuery, setBaseQuery ] = useState(startingState.baseQuery || "");

  /** Used to differentiate between the different implementations of the CommonFilter */
  const cacheKeyPrefix = ParamPrefixes.game;

  // Utils

  /** Bridge between the callback in CommonFilter and state management */
  function updateCommonParams(params: CommonFilterParams) {
    setCommonParams(params)
  }

  /** Builds a game filter from the various state elements */
  function buildParamsFromState(includeFilterParams: Boolean): GameFilterParams {
    return {
      team: commonParams.team,
      year: commonParams.year,
      gender: commonParams.gender,
      autoOffQuery: autoOffQuery.toString(),
      onQuery: onQuery,
      offQuery: offQuery,
      baseQuery: baseQuery,
      minRank: commonParams.minRank,
      maxRank: commonParams.maxRank
    };
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(json: any, wasError: Boolean) {
    const jsons = json?.responses || [];
    const teamJson = (jsons.length > 0) ? jsons[0] : {};
    const rosterCompareJson = (jsons.length > 1) ? jsons[1] : {};
    onStats({
      on: teamJson?.aggregations?.tri_filter?.buckets?.on || {},
      off: teamJson?.aggregations?.tri_filter?.buckets?.off || {},
      baseline: teamJson?.aggregations?.tri_filter?.buckets?.baseline || {},
      error_code: wasError ? (teamJson?.status || json?.status) : undefined,
      avgOff: efficiencyAverages[`${commonParams.gender}_${commonParams.year}`]
    }, {
      on: rosterCompareJson?.aggregations?.tri_filter?.buckets?.on || {},
      off: rosterCompareJson?.aggregations?.tri_filter?.buckets?.off || {},
      baseline: rosterCompareJson?.aggregations?.tri_filter?.buckets?.baseline || {},
      error_code: wasError ? (rosterCompareJson?.status || json?.status) : undefined
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
    >
      <Form.Group as={Row}>
        <Form.Label column sm="2">On Query</Form.Label>
        <Col sm="8">
          <Form.Control
            placeholder="eg 'Player1 AND (Player2 OR Player3)'"
            value={onQuery}
            onKeyUp={handleOnQueryChange}
            onChange={handleOnQueryChange}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column sm="2">Off Query</Form.Label>
        <Col sm="8">
          { renderOffQueryFormField() }
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
      <Form.Group as={Row}>
        <Form.Label column sm="2">Baseline Query</Form.Label>
        <Col sm="8">
          <Form.Control
            placeholder="eg 'NOT (WalkOn1 OR WalkOn2)' - applied to both 'On' and 'Off' queries"
            value={baseQuery}
            onKeyUp={(ev: any) => setBaseQuery(ev.target.value)}
            onChange={(ev: any) => setBaseQuery(ev.target.value)}
          />
        </Col>
        <Col sm="2">
          <Form.Check type="switch"
            id="excludeWalkons"
            checked={false}
            disabled
            label="Auto Walk-ons"
          />
        </Col>
      </Form.Group>
    </CommonFilter>
    ;
}

export default GameFilter;
