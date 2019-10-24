// React imports:
import React, { useState, useEffect } from 'react';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

// Additional components:
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import queryString from "query-string";
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';

// Component imports:
import { TeamStatsModel } from '../components/TeamStatsTable';
import { RosterCompareModel } from '../components/RosterCompareTable';

// Library imports:
import fetch from 'isomorphic-unfetch';

export type GameFilterParams = {
  autoOffQuery?: string;
  onQuery?: string,
  offQuery?: string,
  baseQuery?: string,
  minRank?: string,
  maxRank?: string
}
type Props = {
  onStats: (teamStats: TeamStatsModel, rosterCompareStats: RosterCompareModel) => void;
  startingState: GameFilterParams;
  onChangeState: (newParams: GameFilterParams) => void;
}

const GameFilter: React.FunctionComponent<Props> = ({onStats, startingState, onChangeState}) => {
  const [ queryIsLoading, setQueryIsLoading ] = useState(false);
  const [ pageJustLoaded, setPageJustLoaded ] = useState(true);
  const [ currState, setCurrState ] = useState(startingState);

  const [ autoOffQuery, toggleAutoOffQuery ] = useState("true" == (startingState.autoOffQuery || "false"))
  const [ onQuery, setOnQuery ] = useState(startingState.onQuery || "")
  const [ offQuery, setOffQuery ] = useState(startingState.offQuery || "")
  const [ baseQuery, setBaseQuery ] = useState(startingState.baseQuery || "")

  const [ minRankFilter, setMinRankFilter ] = useState(startingState.minRank || "0")
  const [ maxRankFilter, setMaxRankFilter ] = useState(startingState.maxRank || "400")

  const [ submitDisabled, setSubmitDisabled ] = useState(false) // (always start as true on page load)
    //TODO: do need an extra flag I think? otherwise

  useEffect(() => {
    setSubmitDisabled(shouldSubmitBeDisabled())
  });

  const setAutoOffQuery = (onQuery: string) => {
    setOffQuery(onQuery == "" ? "" : `NOT (${onQuery})`);
  }

  function buildParamsFromState(): GameFilterParams {
    return {
      autoOffQuery: autoOffQuery.toString(),
      onQuery: onQuery,
      offQuery: offQuery,
      baseQuery: baseQuery,
      minRank: minRankFilter,
      maxRank: maxRankFilter
    };
  }

  function shouldSubmitBeDisabled() {
    const newParams = buildParamsFromState();
    const paramsUnchanged = Object.keys(newParams).every(
      (key: string) => (newParams as any)[key] == (currState as any)[key]
    );
    return !pageJustLoaded && paramsUnchanged;
  }

  function onSubmit() {
    setQueryIsLoading(true);
    const newParamsStr = queryString.stringify(buildParamsFromState());
    //TODO: add overlay with spinner and cancel button (remove in log)
    fetch(`/api/calculateStats?${newParamsStr}`).then(function(response) {
      response.json().then(function(json) {
        setQueryIsLoading(false);
        const jsons = json?.responses || [];
        const teamJson = (jsons.length > 0) ? jsons[0] : {};
        const rosterCompareJson = (jsons.length > 1) ? jsons[1] : {};

        const newParams = buildParamsFromState();
        setCurrState(newParams);
        onChangeState(newParams);
        setPageJustLoaded(false);
        onStats({
          on: teamJson?.aggregations?.tri_filter?.buckets?.on || {},
          off: teamJson?.aggregations?.tri_filter?.buckets?.off || {},
          baseline: teamJson?.aggregations?.tri_filter?.buckets?.baseline || {},
        }, {
          on: rosterCompareJson?.aggregations?.tri_filter?.buckets?.on || {},
          off: rosterCompareJson?.aggregations?.tri_filter?.buckets?.off || {},
          baseline: rosterCompareJson?.aggregations?.tri_filter?.buckets?.baseline || {},
        });
      })
    });
  }

  return <LoadingOverlay
    active={queryIsLoading}
    spinner
    text="Calculating statistics"
  ><Form>
    <Form.Group>
      <Row>
        <Col xs={2}>
          <Typeahead
            disabled //TODO
            id="teamGenderTypeahead"
            multiple={false}
            options={[
              "Men"
            ]}
            defaultInputValue="Men"
          />
        </Col>
        <Col xs={2}>
          <Typeahead
            disabled //TODO
            id="teamYearTypeahead"
            multiple={false}
            options={[
              "2018/9"
            ]}
            defaultInputValue="2018/9"
          />
        </Col>
        <Col xs={6}>
          <Typeahead
            disabled //TODO
            id="teamTypeahead"
            multiple={false}
            options={[
              "Maryland"
            ]}
            defaultInputValue="Maryland"
          />
        </Col>
      </Row>
    </Form.Group>
    <Form.Group as={Row}>
      <Form.Label column sm="2">On Query</Form.Label>
      <Col sm="8">
        <Form.Control
          placeholder="eg 'Player1 AND Player2'"
          value={onQuery}
          onChange={(ev: any) => {
            setOnQuery(ev.target.value);
            if (autoOffQuery) {
              setAutoOffQuery(ev.target.value);
            }
          }}
        />
      </Col>
    </Form.Group>
    <Form.Group as={Row}>
      <Form.Label column sm="2">Off Query</Form.Label>
      <Col sm="8">
        <Form.Control
          placeholder="eg 'NOT (Player1 AND Player2)'"
          onChange={(ev: any) => {
            setOffQuery(ev.target.value);
          }}
          value={offQuery}
          readOnly={autoOffQuery}
        />
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
          placeholder="eg 'Player0' - applied to both 'On' and 'Off' queries"
          value={baseQuery}
          onChange={(ev: any) => {
            setBaseQuery(ev.target.value);
          }}
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
    <Form.Group as={Row} controlId="oppositionFilter">
      <Form.Label column sm="2">Opponent Strength</Form.Label>
      <Form.Label column sm="1">Best</Form.Label>
      <Col sm="2">
        <Form.Control
          onChange={(ev: any) => {
            if (ev.target.value.match("^[0-9]*$") != null) {
              setMinRankFilter(ev.target.value);
            }
          }}
          placeholder = "eg 0"
          value={minRankFilter}
        />
      </Col>
      <Form.Label column sm="1">Worst</Form.Label>
      <Col sm="2">
        <Form.Control
          onChange={(ev: any) => {
            if (ev.target.value.match("^[0-9]*$") != null) {
              setMaxRankFilter(ev.target.value);
            }
          }}
          placeholder = "eg 400"
          value={maxRankFilter}
        />
      </Col>
      <Form.Label column sm="2">(out of 352 teams)</Form.Label>
    </Form.Group>
    <Button disabled={submitDisabled} variant="primary" onClick={onSubmit}>Submit</Button>
  </Form></LoadingOverlay>;
}

export default GameFilter;
