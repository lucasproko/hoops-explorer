// React imports:
import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import queryString from "query-string";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';

// Additional components:
import Select, { components} from "react-select"

// Utils:
import { UrlRouting } from "../utils/UrlRouting"
import { HistoryManager } from "../utils/HistoryManager"
import { ParamPrefixes, GameFilterParams, LineupFilterParams } from '../utils/FilterModels';

/** Popovers appear to need to know their children's width, if it's "complex" */
export const historySelectContainerWidth = "600px";

type Props = {
  tablePrefix: string;
};
const HistorySelector: React.FunctionComponent<Props> = ({tablePrefix}) => {

  const allParams = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "" : window.location.search;

  /** For use in selects */
  function stringToOption(s: string, val: [string, GameFilterParams | LineupFilterParams] ) {
    return { label: s, value: JSON.stringify(val) };
  }
  function getPlaceholder() {
    return { label: 'Select analysis from history...' };
  }

  return <div style={{ width: "500px" }}>
    <Select
      styles={{ menu: base => ({ ...base, zIndex: 1000 }) }}
      value={ getPlaceholder() }
      menuIsOpen={true}
      options={HistoryManager.getHistory().map(
        (r) => stringToOption(HistoryManager.filterSummary(r[0], r[1]), r)
      )}
      onChange={(option) => {
        const valJson = JSON.parse((option as any)?.value || "{}"); // [string, GameFilterParams | LineupFilterParams]
        if (valJson[0] == ParamPrefixes.game) {

          if (tablePrefix == ParamPrefixes.game) { //(currently on game page)
            const savedLineupParams =
              UrlRouting.extractSavedKeys(allParams, UrlRouting.savedLineupSuffix) as LineupFilterParams;

            // (can't force a full client refresh using Router - this is an ugly alternative)
            window.location.href = UrlRouting.getGameUrl(valJson[1] as GameFilterParams, savedLineupParams);
          } else { //(currently on lineup page)
            const currLineupParams =
              UrlRouting.removedSavedKeys(allParams) as LineupFilterParams;

            Router.push(UrlRouting.getGameUrl(valJson[1] as GameFilterParams, currLineupParams));
          }
        } else if (valJson[0] == ParamPrefixes.lineup) {

          if (tablePrefix == ParamPrefixes.lineup) { //(currently on lineup page)
            const savedGameParams =
              UrlRouting.extractSavedKeys(allParams, UrlRouting.savedGameSuffix) as GameFilterParams;

            // (can't force a full client refresh using Router - this is an ugly alternative)
            window.location.href = UrlRouting.getLineupUrl(valJson[1] as LineupFilterParams, savedGameParams);
          } else { //(currently on game page)
            const currGameParams =
              UrlRouting.removedSavedKeys(allParams) as GameFilterParams;

            Router.push(UrlRouting.getLineupUrl(valJson[1] as LineupFilterParams, currGameParams)); //TODO: handle saved
          }
        } else { //do nothing (except log)
          console.log(`[WARNING] unexpected history selection: ${JSON.stringify(option)}`);
        }
      }}
    />
  </div>;
}
export default HistorySelector;
