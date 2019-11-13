// React imports:
import React, { useState, useEffect } from 'react';

// Next imports:
import { NextPage } from 'next';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import InputGroup from 'react-bootstrap/InputGroup';

// Additional components:
import Select, { components} from "react-select"
import queryString from "query-string";
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
// @ts-ignore
import ls from 'local-storage';

// Component imports:
import { LineupStatsModel } from '../components/LineupStatsTable';
import { dataLastUpdated } from '../utils/internal-data/dataLastUpdated';
import { preloadedData } from '../utils/internal-data/preloadedData';
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';

// Library imports:
import fetch from 'isomorphic-unfetch';

export type LineupFilterParams = {
  year?: string,
  team?: string,
  gender?: string,
  lineupQuery?: string,
  minRank?: string,
  maxRank?: string,
  // For sorting in the generated table:
  minPoss?: string,
  maxTableSize?: string,
  sortBy?: string
}
type Props = {
  onStats: (lineupStats: LineupStatsModel) => void;
  startingState: LineupFilterParams;
  onChangeState: (newParams: LineupFilterParams) => void;
}

const LineupFilter: React.FunctionComponent<Props> = ({onStats, startingState, onChangeState}) => {

  // Data model

  // Ugly internals
  const [ queryIsLoading, setQueryIsLoading ] = useState(false);
  const [ atLeastOneQueryMade, setAtLeastOneQueryMade ] = useState(false);
  const [ pageJustLoaded, setPageJustLoaded ] = useState(true);
  const [ currState, setCurrState ] = useState(startingState);

  // Data source
  const [ team, setTeam ] = useState(startingState.team || "");
  const [ year, setYear ] = useState(startingState.year || "2019/20");
  const [ gender, setGender ] = useState(startingState.gender || "Men");
  /** Pre-calculate this */
  const teamList = AvailableTeams.getTeams(null, year, gender);

  // Queries and filters:
  const [ baseQuery, setBaseQuery ] = useState(startingState.lineupQuery || "")

  const [ minRankFilter, setMinRankFilter ] = useState(startingState.minRank || "0")
  const [ maxRankFilter, setMaxRankFilter ] = useState(startingState.maxRank || "400")

  const [ submitDisabled, setSubmitDisabled ] = useState(false) // (always start as true on page load)

  const isDebug = (process.env.NODE_ENV !== 'production');

  const cacheKeyPrefix = "lineups-";

  // Utils

  const currentJsonEpoch = dataLastUpdated[`${gender}_${year}`] || -1;
  useEffect(() => {
    setSubmitDisabled(shouldSubmitBeDisabled());

    // Cached reesponse and pre-load handling:
    if (pageJustLoaded) {
      setPageJustLoaded(false); //(ensures this code only gets called once)

      const cachedEpochKey = `data-epoch-${gender}-${year}`;
      const cachedEpoch = (ls as any).get(cachedEpochKey) || 0;
      if (cachedEpoch != currentJsonEpoch) {
        if (isDebug) {
          console.log(`Force reloading preloads because [${cachedEpoch}] != curr [${currentJsonEpoch}]`);
        }
        (ls as any).set(cachedEpochKey, currentJsonEpoch);
      }
      // Check for pre-loads:
      Object.entries(preloadedData || {}).filter(function(key) {
        return key.indexOf(cacheKeyPrefix) == 0;
      }).map(function(keyVal) {
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
      const cachedJson = getCachedData(cacheKeyPrefix + newParamsStr);
      if (cachedJson) {
        handleResponse(cachedJson);
      }
    }
  });

  function buildParamsFromState(): LineupFilterParams {
    return {
      team: team,
      year: year,
      gender: gender,
      lineupQuery: baseQuery,
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
    const lineupJson = (jsons.length > 0) ? jsons[0] : resp;
      //(error can be so low level there's not even a responses)
    return (Object.keys(lineupJson?.error || {}).length > 0);
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(json: any) {
    setQueryIsLoading(false);
    const jsons = json?.responses || [];
    const lineupJson = (jsons.length > 0) ? jsons[0] : {};
    const newParams = _.merge(
      buildParamsFromState(), {
        maxTableSize: startingState.maxTableSize,
        minPoss: startingState.minPoss,
        sortBy: startingState.sortBy
      }
    );
    const wasError = isResponseError(json);
    if (!wasError) {
      setAtLeastOneQueryMade(true);
      setCurrState(newParams);
      onChangeState(newParams);
    }
    onStats({
      lineups: lineupJson?.aggregations?.lineups?.buckets,
      error_code: wasError ? (lineupJson?.status || json?.status) : undefined,
      avgOff: efficiencyAverages[`${gender}_${year}`]
    });
  }
  function onSubmit() {
    setQueryIsLoading(true);
    const newParamsStr = queryString.stringify(buildParamsFromState());

    // Check if it's in the cache:
    const cachedJson = getCachedData(cacheKeyPrefix + newParamsStr);
    if (cachedJson) {
      handleResponse(cachedJson);
    } else {
      fetch(`/api/calculateLineupStats?${newParamsStr}`).then(function(response) {
        response.json().then(function(json) {
          // Cache result locally:
          const newCacheVal = JSON.stringify({cacheEpoch: currentJsonEpoch, ...json});
          if (isDebug) {
            console.log(`CACHE_KEY=[${cacheKeyPrefix}${newParamsStr}]`);
            console.log(`CACHE_VAL=[${newCacheVal}]`);
          }
          if (!isResponseError(json)) { //(never cache errors)
            (ls as any).set(cacheKeyPrefix + newParamsStr, newCacheVal);
          }
          handleResponse(json);
        })
      });
    }
  }

  /** For use in selects */
  function stringToOption(s: string) {
    return { label: s, value: s};
  }
  /** For use in team select */
  function getCurrentTeamOrPlaceholder() {
    return (team == "") ? { label: 'Choose Team...' } : stringToOption(team);
  }

  /** Adds the MenuList component with user prompt if there are teams fitered out*/
  function maybeMenuList() {
    if (teamList.length < Object.keys(AvailableTeams.byName).length) {
      return { MenuList };
    }
  }

  // Visual components:

  /** Let the user know that he might need to change */
  const MenuList = (props: any)  => {
    return (
      <components.MenuList {...props}>
        <p className="text-secondary text-center">(Teams filtered by gender/year)</p>
        {props.children}
      </components.MenuList>
    );
  };

  return <LoadingOverlay
    active={queryIsLoading}
    spinner
    text="Calculating statistics"
  ><Form>
    <Form.Group as={Row}>
      <Col xs={6} sm={6} md={3} lg={2}>
        <Select
          value={ stringToOption(gender) }
          options={Array.from(new Set(AvailableTeams.getTeams(team, year, null).map(
            (r) => r.gender
          ))).map(
            (gender) => stringToOption(gender)
          )}
          isSearchable={false}
          onChange={(option) => { if ((option as any)?.value) setGender((option as any).value) }}
        />
      </Col>
      <Col xs={6} sm={6} md={3} lg={2}>
        <Select
          value={ stringToOption(year) }
          options={Array.from(new Set(AvailableTeams.getTeams(team, null, gender).map(
            (r) => r.year
          ))).map(
            (year) => stringToOption(year)
          )}
          isSearchable={false}
          onChange={(option) => { if ((option as any)?.value) setYear((option as any).value) }}
        />
      </Col>
      <Col className="w-100" bsPrefix="d-lg-none d-md-none"/>
      <Col xs={12} sm={12} md={6} lg={6}>
        <Select
          components = { maybeMenuList() }
          isClearable={true}
          styles={{ menu: base => ({ ...base, zIndex: 1000 }) }}
          value={ getCurrentTeamOrPlaceholder() }
          options={teamList.map(
            (r) => stringToOption(r.team)
          )}
          onChange={(option) => {
            setTeam((option as any)?.value || "")
          }}
        />
      </Col>
    </Form.Group>
    <Form.Group as={Row}>
      <Form.Label column sm="2">Baseline Query</Form.Label>
      <Col sm="8">
        <Form.Control
          placeholder="eg 'Player1 AND NOT (WalkOn1 OR WalkOn2)'"
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
    <Form.Group as={Row} controlId="oppositionFilter">
      <Form.Label column sm="2">Opponent Strength</Form.Label>
      <Col sm="2">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="filterOppoBest">Best</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            onChange={(ev: any) => {
              if (ev.target.value.match("^[0-9]*$") != null) {
                setMinRankFilter(ev.target.value);
              }
            }}
            placeholder = "eg 0"
            value={minRankFilter}
          />
        </InputGroup>
      </Col>
        <Col sm="2">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="filterOppoWorst">Worst</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              onChange={(ev: any) => {
                if (ev.target.value.match("^[0-9]*$") != null) {
                  setMaxRankFilter(ev.target.value);
                }
              }}
              placeholder = "eg 400"
              value={maxRankFilter}
            />
            </InputGroup>
        </Col>
      <Form.Label column sm="2">(out of ~360 teams)</Form.Label>
    </Form.Group>
    <Button disabled={submitDisabled} variant="primary" onClick={onSubmit}>Submit</Button>
  </Form></LoadingOverlay>;
}

export default LineupFilter;
