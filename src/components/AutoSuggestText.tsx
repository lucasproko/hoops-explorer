// React imports:
import React, { useState, useEffect, createRef } from 'react';
import Router from 'next/router';

// Lodash
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';

// Library imports:
import fetch from 'isomorphic-unfetch';

// Additional components:
// @ts-ignore
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';

// Utils:
import { ParamPrefixes, ParamDefaults, GameFilterParams } from '../utils/FilterModels';
import { RosterCompareModel } from '../components/RosterCompareTable';
import { dataLastUpdated } from '../utils/internal-data/dataLastUpdated';
import { ClientRequestCache } from '../utils/ClientRequestCache';
import { QueryUtils } from "../utils/QueryUtils";

/** The keydown event does not come from AutoSuggestText element */
export const notFromAutoSuggest = (event: any) => {
  return (event?.srcElement?.className?.indexOf("auto-suggest") < 0);
}

type Props = {
  readOnly: boolean,
  placeholder: string,
  initValue: string,
  team?: string,
  gender?: string,
  year?: string,
  onChange: (ev: any) => void,
  onKeyUp: (ev: any) => void
  onKeyDown: (ev: any) => void
};
const AutoSuggestText: React.FunctionComponent<Props> = (
  {readOnly, placeholder, initValue, team, year, gender, onChange, onKeyUp, onKeyDown}
) => {

  // Data model

  const [ savedParams, setSavedParams ] = useState({} as GameFilterParams);
  const [ basicOptions, setBasicOptions ] = useState([] as Array<string>);
  const [ advOptions, setAdvOptions ] = useState([] as Array<string>);

  const isDebug = (process.env.NODE_ENV !== 'production');

  const basicOperators = [
    "AND", "OR", "NOT"
  ];
  const advancedFields = basicOperators.concat([
    "players.id:", "opponent.team:", "start_min:", "end_min:",
    "location_type:", "location_type:Home", "location_type:Away", "location_type:Neutral",
    "date:",
    "players_in.id:",  "players_out.id:",
    "score_info.start_diff:", "score_info.end_diff:"
  ]);

  const textRef = createRef();

  // Utils

  /** Reset everything if team/year/gender changes */
  useEffect(() => {
    const params: GameFilterParams = { year: year, gender: gender, team: team }
    if (!_.isEqual(params, savedParams)) {
      if (isDebug) console.log(`Update params: old=[${JSON.stringify(savedParams)}] vs new=[${JSON.stringify(params)}]`);
      setSavedParams(params);
      setBasicOptions([]);
      setAdvOptions([]);
    }
  });

  /** Makes an API call to elasticsearch to get the roster */
  const fetchRoster = () => {
    if (gender && year && team) {
      const genderYear = `${gender}_${year}`;
      const currentJsonEpoch = dataLastUpdated[genderYear] || -1;

      const query: GameFilterParams = {
        gender: gender, year: year, team: team,
        baseQuery: "", onQuery: "", offQuery: "",
        minRank: ParamDefaults.defaultMinRank, maxRank: ParamDefaults.defaultMaxRank
      };
      const paramStr = QueryUtils.stringify(query);
      // Check if it's in the cache:
      const cachedJson = ClientRequestCache.decacheResponse(
        paramStr, ParamPrefixes.roster, currentJsonEpoch, isDebug
      );
      if (cachedJson && !_.isEmpty(cachedJson)) { //(ignore placeholders here)
        handleResponse(cachedJson);
      } else {
        fetch(`/api/getRoster?${paramStr}`).then(function(response: fetch.IsomorphicResponse) {
          response.json().then(function(json: any) {
            // Cache result locally:
            if (isDebug) {
              console.log(`CACHE_KEY=[${ParamPrefixes.roster}${paramStr}]`);
              //(this is a bit chatty)
              //console.log(`CACHE_VAL=[${JSON.stringify(json)}]`);
            }
            if (response.ok) { //(never cache errors)
              ClientRequestCache.cacheResponse(
                paramStr, ParamPrefixes.roster, json, currentJsonEpoch, isDebug
              );
            }
            handleResponse(json);
          });
        })
      }
    }
  };

  /** Parse the return from fetch Roster into name fragments */
  const handleResponse = (json: any) => {
    const jsons = json?.responses || [];
    const rosterCompareJson = (jsons.length > 0) ? jsons[0] : {};
    const roster = rosterCompareJson?.aggregations?.tri_filter?.buckets?.baseline?.player?.buckets || [];

    const nameFrags = _.chain(roster)
      .flatMap((rosterObj) => {
        const nameFragments = _.split(rosterObj.key, /\s*,\s*|\s+/);
        return _.chain(nameFragments)
          .filter((s) => s.length >= 2)
          .value();
      }).sortBy().sortedUniq().value();

    const names = _.chain(roster)
      .map((rosterObj) => `"${rosterObj.key}"`)
      .sortBy().sortedUniq().value();

    const namesAndFrags = nameFrags.concat(names); //(get the order to work well in practice)

    setBasicOptions(namesAndFrags.concat(basicOperators));
    setAdvOptions(namesAndFrags.concat(advancedFields));
  };

  // View

  return <TextInput
    ref={textRef}
    Component={"input"}
    defaultValue={initValue}
    readOnly={readOnly}
    className="form-control auto-suggest"
    placeholder={placeholder}
    requestOnlyIfNoOptions={true} //(only requests if empty)
    options={
      (initValue && ('[' == initValue[0])) ? advOptions : basicOptions
    }
    onRequestOptions = {fetchRoster}
    trigger=""
    regex='^[A-Za-z0-9\\-_"]+$'
    matchAny={true}
    maxOptions={18}
    spaceRemovers={[';', ')', ':', ']']}
    onChange={(eventText: string) => onChange({target: { value: eventText}})}
    onBlur={(ev:any) => {
      const currentTextRef = textRef.current as any;
      setTimeout(() => { //(give out of order events a chance!)
        try {
          currentTextRef.resetHelper();
        } catch (e) {}
      }, 100);
    }}
    onKeyUp={onKeyUp}
    onKeyDown={(ev:any) => {
      // Understanding this requires understanding of internals:
      //https://github.com/yury-dymov/react-autocomplete-input/blob/master/src/AutoCompleteTextField.js
      if (ev.keyCode == 9) {
        const underlyingObj = textRef.current as any;
        if (underlyingObj.state.helperVisible) {
          ev.preventDefault();
          ev.keyCode = 13;
          (textRef.current as any).handleKeyDown(ev);
        }
        //(else will just get passed up)
      } else {
        //(doesn't work for enter/return because of the CommonFilter-specific handler)
        onKeyDown(ev);
      }
    }}
  />;
}
export default AutoSuggestText;
