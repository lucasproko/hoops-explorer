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
// @ts-ignore
import ls from 'local-storage';

// Component imports:
import { TeamStatsModel } from '../components/TeamStatsTable';
import { RosterCompareModel } from '../components/RosterCompareTable';
import { dataLastUpdated } from '../utils/dataLastUpdated';
import { preloadedData } from '../utils/preloadedData';
import { AvailableTeams } from '../utils/AvailableTeams';

// Library imports:
import fetch from 'isomorphic-unfetch';

export type GameFilterParams = {
  year?: string,
  team?: string,
  gender?: string,
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
  const [ atLeastOneQueryMade, setAtLeastOneQueryMade ] = useState(false);
  const [ pageJustLoaded, setPageJustLoaded ] = useState(true);
  const [ currState, setCurrState ] = useState(startingState);

  const [ team, setTeam ] = useState(startingState.team || "");
  const [ year, setYear ] = useState(startingState.year || "2018/9");
  const [ gender, setGender ] = useState(startingState.gender || "Men");
  const [ autoOffQuery, toggleAutoOffQuery ] = useState(
    "true" == (((startingState.autoOffQuery == undefined) ? "true" : startingState.autoOffQuery) || "false")
  )
  const [ onQuery, setOnQuery ] = useState(startingState.onQuery || "")
  const [ offQuery, setOffQuery ] = useState(startingState.offQuery || "")
  const [ baseQuery, setBaseQuery ] = useState(startingState.baseQuery || "")

  const [ minRankFilter, setMinRankFilter ] = useState(startingState.minRank || "0")
  const [ maxRankFilter, setMaxRankFilter ] = useState(startingState.maxRank || "400")

  const [ submitDisabled, setSubmitDisabled ] = useState(false) // (always start as true on page load)

  const isDebug = (process.env.NODE_ENV !== 'production');

  const currentJsonEpoch = dataLastUpdated[year] || -1;
  useEffect(() => {
    setSubmitDisabled(shouldSubmitBeDisabled());

    // Cached reesponse and pre-load handling:
    if (pageJustLoaded) {
      setPageJustLoaded(false); //(ensures this code only gets called once)

      const cachedEpochKey = `data-epoch-${year}`;
      const cachedEpoch = (ls as any).get(cachedEpochKey) || 0;
      if (cachedEpoch != currentJsonEpoch) {
        if (isDebug) {
          console.log(`Force reloading preloads because [${cachedEpoch}] != curr [${currentJsonEpoch}]`);
        }
        (ls as any).set(cachedEpochKey, currentJsonEpoch);
      }
      // Check for pre-loads:
      Object.entries(preloadedData || {}).map(function(keyVal) {
        const key = keyVal[0];
        const valAsJson = keyVal[1];
        if ((cachedEpoch == currentJsonEpoch) && getCachedData(keyVal[0])) {
          if (isDebug) {
            console.log(`Already pre-loaded [${key}]`);
          }
        } else {
          if (isDebug) {
            console.log(`Pre-loading [${key}]`);
          }
          valAsJson.cacheEpoch = currentJsonEpoch;
          (ls as any).set(key, JSON.stringify(valAsJson));
        }
      });
      // Check if object is in cache and onSubmit if so
      const newParamsStr = queryString.stringify(buildParamsFromState());
      const cachedJson = getCachedData(newParamsStr);
      if (cachedJson) {
        handleResponse(cachedJson);
      }
    }
  });
  const setAutoOffQuery = (onQuery: string) => {
    setOffQuery(onQuery == "" ? "" : `NOT (${onQuery})`);
  }

  function buildParamsFromState(): GameFilterParams {
    return {
      team: team,
      year: year,
      gender: gender,
      autoOffQuery: autoOffQuery.toString(),
      onQuery: onQuery,
      offQuery: offQuery,
      baseQuery: baseQuery,
      minRank: minRankFilter,
      maxRank: maxRankFilter
    };
  }

  /** If the params match the last request, disable submit */
  function shouldSubmitBeDisabled() {
    const newParams = buildParamsFromState();
    const paramsUnchanged = Object.keys(newParams).every(
      (key: string) => (newParams as any)[key] == (currState as any)[key]
    );
    return (atLeastOneQueryMade && paramsUnchanged) || (team == "");
  }

  /** Check if we have an up-todate local cache for this set of params */
  function getCachedData(str: string) {
    const cachedJson = JSON.parse((ls as any).get(str) || "{}");
    const cachedJsonEpoch = cachedJson.cacheEpoch || 0;
    if (cachedJsonEpoch == currentJsonEpoch) {
      if (isDebug) {
        console.log(`Found cache for ${str} epochs: [${cachedJsonEpoch}, ${currentJsonEpoch}]`);
      }
      return cachedJson;
    } else {
      return null;
    }
  }

  /** Whether any of the queries returned an error - we'll treat them all as errors if so */
  function isResponseError(resp: any) {
    const jsons = resp?.responses || [];
    const teamJson = (jsons.length > 0) ? jsons[0] : {};
    const rosterCompareJson = (jsons.length > 1) ? jsons[1] : {};
    return (Object.keys(teamJson?.error || {}).length > 0) ||
      (Object.keys(rosterCompareJson?.error || {}).length > 0);
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(json: any) {
    setQueryIsLoading(false);
    setAtLeastOneQueryMade(true);
    const jsons = json?.responses || [];
    const teamJson = (jsons.length > 0) ? jsons[0] : {};
    const rosterCompareJson = (jsons.length > 1) ? jsons[1] : {};
    const newParams = buildParamsFromState();
    const wasError = isResponseError(json);
    if (!wasError) {
      setCurrState(newParams);
      onChangeState(newParams);
    }
    onStats({
      on: teamJson?.aggregations?.tri_filter?.buckets?.on || {},
      off: teamJson?.aggregations?.tri_filter?.buckets?.off || {},
      baseline: teamJson?.aggregations?.tri_filter?.buckets?.baseline || {},
      error_code: wasError ? teamJson?.status : undefined
    }, {
      on: rosterCompareJson?.aggregations?.tri_filter?.buckets?.on || {},
      off: rosterCompareJson?.aggregations?.tri_filter?.buckets?.off || {},
      baseline: rosterCompareJson?.aggregations?.tri_filter?.buckets?.baseline || {},
      error_code: wasError ? rosterCompareJson?.status : undefined
    });
  }
  function onSubmit() {
    setQueryIsLoading(true);
    const newParamsStr = queryString.stringify(buildParamsFromState());

    // Check if it's in the cache:
    const cachedJson = getCachedData(newParamsStr);
    if (cachedJson) {
      handleResponse(cachedJson);
    } else {
      fetch(`/api/calculateStats?${newParamsStr}`).then(function(response) {
        response.json().then(function(json) {
          // Cache result locally:
          const newCacheVal = JSON.stringify({cacheEpoch: currentJsonEpoch, ...json});
          if (isDebug) {
            console.log(`CACHE_KEY=[${newParamsStr}]`);
            console.log(`CACHE_VAL=[${newCacheVal}]`);
          }
          if (!isResponseError(json)) { //(never cache errors)
            (ls as any).set(newParamsStr, newCacheVal);
          }
          handleResponse(json);
        })
      });
    }
  }

  /** Ran into issues with SSR and 'readOnly' property, so have to fix like this */
  function renderOffQueryFormField() {
    if (typeof window !== `undefined`) {
      return <Form.Control
        placeholder="eg 'NOT (Player1 AND Player2)'"
        onChange={(ev: any) => {
          setOffQuery(ev.target.value);
        }}
        value={offQuery}
        readOnly={autoOffQuery}
      />
    }
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
            id="teamGenderTypeahead"
            multiple={false}
            options={AvailableTeams.getTeams(team, year, null).map((r) => r.gender)}
            onChange={(genders) => { if (genders.length > 0) setGender(genders[0])}}
            selected={[gender]}
          />
        </Col>
        <Col xs={2}>
          <Typeahead
            id="teamYearTypeahead"
            multiple={false}
            options={AvailableTeams.getTeams(team, null, gender).map((r) => r.year)}
            onChange={(years) => { if (years.length > 0) setYear(years[0])}}
            selected={[year]}
          />
        </Col>
        <Col xs={6}>
          <Typeahead
            id="teamTypeahead"
            multiple={false}
            options={AvailableTeams.getTeams(null, year, gender).map((r) => r.team)}
            placeholder="Choose a team..."
            onChange={(teams) => { if (teams.length > 0) setTeam(teams[0]); else setTeam("");}}
            selected={team == "" ? [] : [team]}
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
      <Form.Label column sm="2">(out of ~360 teams)</Form.Label>
    </Form.Group>
    <Button disabled={submitDisabled} variant="primary" onClick={onSubmit}>Submit</Button>
  </Form></LoadingOverlay>;
}

export default GameFilter;
