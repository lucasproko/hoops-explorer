// React imports:
import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { QueryUtils } from "../utils/QueryUtils";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';

// Additional components:
// @ts-ignore
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';

// Utils:
import { ParamPrefixes, CommonFilterParams } from '../utils/FilterModels';

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

  const internalOnKeyDown = (event: any) => {
    if (event.keyCode == 13) { // Enter => submit
    }
  };

  return <TextInput
    Component={"input"}
    defaultValue={initValue}
    readOnly={readOnly}
    className="form-control auto-suggest"
    placeholder={placeholder}
    options={(initValue && ('[' == initValue[0])) ? //TODO: ok write this!
        ["players.id", "Cowan", "Anthony", `"Cowan, Anthony"`].concat([team || ""]) :
        ["Cowan", "Anthony", `"Cowan, Anthony"`, "AND", "OR", "NOT"]
    }
    trigger=""
    regex='^[A-Za-z0-9\\-_"]+$'
    matchAny={true}
    maxOptions={18}
    spaceRemovers={[';', ')', ':']}
    onChange={(eventText: string) => onChange({target: { value: eventText}})}
    onKeyUp={onKeyUp}
    onKeyDown={onKeyDown}
  />;
}
export default AutoSuggestText;
