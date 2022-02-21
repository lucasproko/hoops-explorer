import _ from "lodash";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { QueryUtils, CommonFilterType } from './QueryUtils';
import { format } from 'date-fns';

/** For shared display logic between the different filter types for displaying query info */
export class QueryDisplayUtils {

   /** Display the badge corresponding to the filter type */
   public static showQueryFilter = (t: CommonFilterType, year: string, inverted: boolean = false) => {
      const maybeInvert = (s: string) => {
        if (inverted) {
          return s == "Not-Home" ? "Home" : `NOT ${s}`;
        } else return s;
      };
      const toolTip = () => { switch(t) {
        case "Conf":
          return <Tooltip id={`qf${t}`}>Conference games only. Use <b>in_conf:true</b> directly in query fields(s).</Tooltip>
        case "Home":
          return <Tooltip id={`qf${t}`}>Home games only. Use <b>location_type:Home</b> or <b>opponent.Home:*</b> directly in query fields(s).</Tooltip>
        case "Away":
          return <Tooltip id={`qf${t}`}>Away games only. Use <b>location_type:Away</b> or <b>opponent.Away:*</b> directly in query fields(s).</Tooltip>
        case "Not-Home":
          return <Tooltip id={`qf${t}`}>Away/Neutral games only. Use <b>location_type:(Away Neutral)</b> or <b>(opponent.Away:* opponent.Neutral:*)</b> directly in query fields(s).</Tooltip>
        case "Nov-Dec":
          return <Tooltip id={`qf${t}`}>Nov/Dec games only. Use eg <b>date:[* TO {_.take(year, 4)}-12-31]</b> directly in query fields(s).</Tooltip>
        case "Jan-Apr":
          return <Tooltip id={`qf${t}`}>Jan-Apr games only. Use eg <b>date:{`{`}{_.take(year, 4)}-12-31 TO *]</b> directly in query fields(s).</Tooltip>
        case "Last-30d":
          return <Tooltip id={`qf${t}`}>Games in the last 30 days (from now/end-of-season). Use <b>date:[yyyy-mm-dd TO yyyy-mm-dd]</b> directly in query fields(s) for different date queries.</Tooltip>
        default: // all the object types, currently just CommonFilterCustomDate
          return <Tooltip id={`qf${QueryUtils.asString(t)}`}>Games in this data range. Use <b>date:[{format(t.start, "yyyy-MM-dd")} TO {format(t.end, "yyyy-MM-dd")}]</b> directly in query fields(s).</Tooltip>
      }}
      return <OverlayTrigger placement="auto" overlay={toolTip()}>
        <span className="badge badge-pill badge-secondary">{maybeInvert(QueryUtils.asString(t))}</span>
      </OverlayTrigger>;
    };
  
};