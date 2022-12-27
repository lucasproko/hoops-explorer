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

// Library imports:
import fetch from 'isomorphic-unfetch';
import Select from "react-select"

// Component imports:
import { LineupStatsModel } from '../components/LineupStatsTable';
import { RosterStatsModel } from '../components/RosterStatsTable';
import { TeamStatsModel } from '../components/TeamStatsTable';
import CommonFilter, { GlobalKeypressManager } from '../components/CommonFilter';
import { ParamDefaults, ParamPrefixesType, ParamPrefixes, FilterParamsType, CommonFilterParams, LineupFilterParams, FilterRequestInfo, getCommonFilterParams, MatchupFilterParams } from "../utils/FilterModels";

// Utils
import { StatModels, OnOffBaselineEnum, OnOffBaselineGlobalEnum, PlayerCode, PlayerId, Statistic, IndivStatSet, TeamStatSet, LineupStatSet } from "../utils/StatModels";
import { QueryUtils } from '../utils/QueryUtils';
import { dataLastUpdated } from '../utils/internal-data/dataLastUpdated';
import { ClientRequestCache } from '../utils/ClientRequestCache';

type Props = {
  onStats: (
    lineupStatsA: LineupStatsModel, teamStatsA: TeamStatsModel, rosterStatsA: RosterStatsModel,
    lineupStatsB: LineupStatsModel, teamStatsB: TeamStatsModel, rosterStatsB: RosterStatsModel,
  ) => void;
  startingState: MatchupFilterParams;
  onChangeState: (newParams: MatchupFilterParams) => void;
}

const MatchupFilter: React.FunctionComponent<Props> = ({onStats, startingState, onChangeState}) => {
  //console.log("Loading LineupFilter " + JSON.stringify(startingState));

  // Data model

  const {
    ...startingCommonFilterParams
  } = startingState;

  /** The state managed by the CommonFilter element */
  const [ commonParams, setCommonParams ] = useState(startingCommonFilterParams as CommonFilterParams);

  /** The list of opponents */
  const [ opponentList, setOpponentList ] = useState<Array<any>>([]); //(TODO: see StatModels - this needs to get modelled)

  // Lineup Filter - custom queries and filters:

  const isDebug = (process.env.NODE_ENV !== 'production');

  const cacheKeyPrefix = ParamPrefixes.lineup;

  const [ game, setGame ] = useState(startingState.oppoTeam || "");

  // Utils

  /** Bridge between the callback in CommonFilter and state management */
  function updateCommonParams(params: CommonFilterParams) {
    // Need to refetch the list of games a team has played
    if ((params.team != commonParams.team) || (params.year != commonParams.year) || (params.gender != commonParams.gender)) {
      if (params.team && params.year && params.gender) {
        setOpponentList([]);
        fetchOpponents(params);
      }
    }
    setCommonParams(params);
  }

  const buildDateStr = (gameInfoObj: any) => {
    return (gameInfoObj?.game_info?.buckets?.[0]?.key_as_string || "????-??-??").substring(0, 10);
  };

  const buildScoreInfo = (gameInfoObj: any) => {
    const scoreInfoObj = gameInfoObj?.game_info?.buckets?.[0]?.end_of_game?.hits?.hits?.[0]?._source?.score_info?.end
      || { scored: 0, allowed: 0 };

    return `${scoreInfoObj.scored > scoreInfoObj.allowed ? "W": "L"} ${scoreInfoObj.scored}-${scoreInfoObj.allowed}`;
  };

  const buildMenuItem = (gameInfoObj: any) => {
    const oppoAndLocation = (gameInfoObj?.key || "Unknown")
      .replace(/^A:/, "@ ").replace(/^H:/, "").replace(/^N:/, "vs ");

    return `${oppoAndLocation} (${buildDateStr(gameInfoObj)}): ${buildScoreInfo(gameInfoObj)}`;
  }

  /** Makes an API call to elasticsearch to get the roster */
  const fetchOpponents = (params: CommonFilterParams) => {
    const { gender, year, team} = params;
    if (gender && year && team) {
      const genderYear = `${gender}_${year}`;
      const currentJsonEpoch = dataLastUpdated[genderYear] || -1;

      const query: CommonFilterParams = {
        gender: gender, year: year, team: team,
        baseQuery: "start_min:0",
        minRank: ParamDefaults.defaultMinRank, maxRank: ParamDefaults.defaultMaxRank,
      };
      const paramStr = QueryUtils.stringify(query);
      // Check if it's in the cache:
      const cachedJson = ClientRequestCache.decacheResponse(
        paramStr, ParamPrefixes.gameInfo, currentJsonEpoch, isDebug
      );
      if (cachedJson && !_.isEmpty(cachedJson)) { //(ignore placeholders here)
          setOpponentList(_.sortBy(cachedJson?.responses?.[0]?.aggregations?.game_info?.buckets || [], buildDateStr));
      } else {  
        fetch(`/api/getGameInfo?${paramStr}`).then(function(response: fetch.IsomorphicResponse) {
          response.json().then(function(json: any) {
            // Cache result locally:
            if (isDebug) {
              console.log(`CACHE_KEY=[${ParamPrefixes.lineup}${paramStr}]`);
              //(this is a bit chatty)
              //console.log(`CACHE_VAL=[${JSON.stringify(json)}]`);
            }
            if (response.ok) { //(never cache errors)
              ClientRequestCache.cacheResponse(
                paramStr, ParamPrefixes.gameInfo, json, currentJsonEpoch, isDebug
              );
            }
            setOpponentList(_.sortBy(json?.responses?.[0]?.aggregations?.game_info?.buckets || [], buildDateStr));
          });
        })
      }
    }
  };


  /** Builds a lineup filter from the various state elements, and also any secondary filters
   * NOTE: ugly hack I need to fix, needs to sync with CommonFilter.onSeeExample
  */
  function buildParamsFromState(includeFilterParams: Boolean): [ LineupFilterParams, FilterRequestInfo[] ]
  {
    const primaryRequest: MatchupFilterParams = includeFilterParams ?
      _.assign(
        buildParamsFromState(false)[0], {
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

    const makeGlobalRequest = !_.isEqual(entireSeasonRequest, secondaryRequest);

    return [ primaryRequest, [{
        context: ParamPrefixes.game as ParamPrefixesType, paramsObj: secondaryRequest
      }, {
        context: ParamPrefixes.player as ParamPrefixesType, paramsObj: secondaryRequest, includeRoster: !makeGlobalRequest
      }].concat(makeGlobalRequest ? [{ //(don't make a spurious call)
        context: ParamPrefixes.player as ParamPrefixesType, paramsObj: entireSeasonRequest, includeRoster: true
      }] : [])
    ];
  }

  /** Handles the response from ES to a stats calc request */
  function handleResponse(jsonResps: any[], wasError: Boolean) {
    const jsonStatuses = jsonResps.map(j => j.status);
    const lineupJson = jsonResps?.[0]?.responses?.[0] || {};
    const teamJson = jsonResps?.[1]?.responses?.[0] || {};

    const rosterStatsJson = jsonResps?.[2]?.responses?.[0] || {};
    const globalRosterStatsJson = jsonResps?.[3]?.responses?.[0] || rosterStatsJson;
    const hasGlobalRosterStats = jsonResps?.[3]?.responses?.[0]?.aggregations?.tri_filter;

    const globalTeam = teamJson?.aggregations?.global?.only?.buckets?.team || StatModels.emptyTeam();
    const rosterInfo = jsonResps?.[hasGlobalRosterStats ? 3 : 2]?.roster;
    if (rosterInfo) {
      globalTeam.roster = rosterInfo;
    }

    const fromLineups = () => ({
      lineups: lineupJson?.aggregations?.lineups?.buckets,
      error_code: wasError ? (lineupJson?.status || jsonStatuses?.[0] || "Unknown") : undefined
    });
    const fromTeam = () => ({
      on: StatModels.emptyTeam(), off: StatModels.emptyTeam(), onOffMode: true,
      baseline: teamJson?.aggregations?.tri_filter?.buckets?.baseline || StatModels.emptyTeam(),
      global: globalTeam,
      error_code: wasError ? (teamJson?.status || jsonStatuses?.[1] || "Unknown") : undefined
    });
    const fromRoster = () => ({
      on: [], off: [],
      baseline: rosterStatsJson?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      global: globalRosterStatsJson?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [],
      error_code: wasError ? (rosterStatsJson?.status || jsonStatuses?.[2] ||
          globalRosterStatsJson?.status || jsonStatuses?.[3] || "Unknown") : undefined
    });
    onStats(fromLineups(), fromTeam(), fromRoster(), fromLineups(), fromTeam(), fromRoster());
  }

  // Visual components:

  /** Let the user know that he might need to change */

  const team: string = "";

  /** For use in selects */
  function stringToOption(s: string) {
    return { label: s, value: s};
  }
  /** For use in team select */
  function getCurrentTeamOrPlaceholder() {
    return (game == "") ? { label: 'Choose Game...' } : stringToOption(game);
  }

  return <CommonFilter //(generic type inferred)
      startingState={startingState}
      onChangeState={onChangeState}
      onChangeCommonState={updateCommonParams}
      tablePrefix = {cacheKeyPrefix}
      buildParamsFromState={buildParamsFromState}
      childHandleResponse={handleResponse}
      matchupMode={true}
    ><GlobalKeypressManager.Consumer>{ globalKeypressHandler => <div>
      <Form.Group as={Row}>
        <Col xs={0} sm={0} md={0} lg={4}/>
        <Col xs={12} sm={12} md={12} lg={6}>
          <Select
            isClearable={false}
            styles={{ menu: (base) => ({ ...base, zIndex: 1000 }) }}
            value={ getCurrentTeamOrPlaceholder() }
            options={opponentList.map(
              (r) => stringToOption(buildMenuItem(r))
            )}
            onChange={(option) => {
              setGame((option as any)?.value);
            }}
          />
      </Col>
      </Form.Group>
    </div>
    }</GlobalKeypressManager.Consumer>
    </CommonFilter>
    ;
}

export default MatchupFilter;
