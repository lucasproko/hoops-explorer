// React imports:
import React, { useState, useEffect } from 'react';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';

// Additional components:
import Select, { components} from "react-select"

// Utils:
import { HistoryManager } from "../utils/HistoryManager"

/** Popovers appear to need to know their children's width, if it's "complex" */
export const historySelectContainerWidth = "600px";

const HistorySelector: React.FunctionComponent<{}> = ({}) => {

  /** For use in selects */
  function stringToOption(s: string) {
    return { label: s, value: s};
  }
  function getPlaceholder() {
    return { label: 'Select analysis from history...' };
  }

  return <div style={{ width: "500px" }}>
    <Select
      isClearable={true}
      styles={{ menu: base => ({ ...base, zIndex: 1000 }) }}
      value={ getPlaceholder() }
      options={HistoryManager.returnHistory().map(
        (r) => stringToOption("TODO")
      )}
      onChange={(option) => {
        //TODO
      }}
    />
  </div>;
}
export default HistorySelector;
