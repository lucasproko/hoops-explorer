
// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// Lodash:
import _ from "lodash";

// Util imports
import { CbbColors } from "../CbbColors";

import "./LineupDisplayUtils.css";

/** Encapsulates some of the logic used to build decorated lineups in LineupStatsTable */
export class LineupDisplayUtils {

  /** Builds an information (over-)loaded lineup HTML */
  static buildDecoratedLineup(
    key: string,
    sortedLineup: { code: string, id: string }[],
    perLineupPlayerMap: Record<string, Record<string, any>>,
    positionFromPlayerKey: Record<string, {posClass: string}>,
    colorField: string,
    decorateLineup: boolean
  ) {
    const tooltipTexts = _.flatMap(sortedLineup, (cid: {id: string, code: string}) => {
      return LineupDisplayUtils.buildTooltipText(cid, perLineupPlayerMap, positionFromPlayerKey);
    });
    const tooltip = <Tooltip id={`${key}_info`}>{_.map(tooltipTexts,
      (t: string, i: number) => <span key={"" + i}>{t}<br/></span>
    )}</Tooltip>;
    if (decorateLineup) {
      return sortedLineup.map((cid: { code: string, id: string }, pid: number) => {
        return <OverlayTrigger placement="auto" overlay={tooltip} key={"" + pid}>{
          LineupDisplayUtils.buildDecoratedPlayer(cid, perLineupPlayerMap, colorField, pid == 4)
        }</OverlayTrigger>;
      });
    } else {
      return <OverlayTrigger placement="auto" overlay={tooltip}>
        <span><b>{sortedLineup.map((cid: { code: string, id: string}) => cid.code).join(" / ")}</b></span>
      </OverlayTrigger>;
    }
  }

  static buildTooltipText(
    cid: { code: string, id: string },
    perLineupPlayerMap: Record<string, Record<string, any>>,
    positionFromPlayerKey: Record<string, {posClass: string}>
  ) {
    // Some minimal info:
    const playerInfo = perLineupPlayerMap[cid.id] || {};
    const oRtgStr = (playerInfo.off_rtg?.value || 0).toFixed(0);
    const usageStr = (100*(playerInfo.off_usage?.value || 0)).toFixed(0) + "%";
    const defRbStr = (100*(playerInfo.def_orb?.value || 0)).toFixed(0) + "%";
    return [
      `${cid.id}: ${positionFromPlayerKey[cid.id]?.posClass || "??"}`,
      `ORtg ${oRtgStr} on ${usageStr}, DRB ${defRbStr}`,
      ""
    ];
  }

  /** Builds the player HTML within a lineup */
  static buildDecoratedPlayer(
    cid: { code: string, id: string },
    perLineupPlayerMap: Record<string, Record<string, any>>,
    colorField: string,
    finalPlayer: boolean
  ) {
    const fontWeight = (id: string) => {
      const usage = _.max(
        [ 0.10, _.min(
          [ perLineupPlayerMap[id]?.off_usage?.value || 0.20, 0.35 ]
        )]
      );
      return 100*_.round((usage < 0.20) ? //10 == 100 weight
        1 + (usage-0.10)*40 : //20 == 500 weight
        5 + (usage-0.20)*20, 0);  //35 ~= 800 weight
    };

    const colorChooser = (field: string) => {
      switch(field) {
        case "off_adj_rtg": return CbbColors.off_diff10_p100_redGreen;
        case "def_adj_rtg": return CbbColors.def_diff10_p100_redGreen;
        case "off_3pr": return CbbColors.fgr_offDef;
        default: return (val: number) => CbbColors.malformedDataColor;
      };
    };

    const singleColorField = (id: string, field: string) => {
      const val = perLineupPlayerMap[id]?.[field]?.value;
      const color = colorChooser(field)(val) + "80"; //(opacity at the end)
      return color;
    };

    const buildBadges = (id: string) => {
      const _3pr = perLineupPlayerMap[id]?.off_3pr?.value;
      const ftr = perLineupPlayerMap[id]?.off_ftr?.value;
      const assist = perLineupPlayerMap[id]?.off_assist?.value;
      return <span style={{}}>
        { _3pr <= 0.05 ? <sup className="megaTwoPointBadge"></sup> : null }
        { _3pr >= 0.05 && _3pr < 0.2 ? <sup className="twoPointBadge"></sup> : null }
        { _3pr >= 0.45 && _3pr < 0.6 ? <sup className="threePointBadge"></sup> : null }
        { _3pr >= 0.6 ? <sup className="megaThreePointBadge"></sup> : null }
        { ftr > 0.35 && ftr < 0.60 ? <sub className="freeThrowBadge"></sub> : null }
        { ftr >= 0.6 ? <sub className="megaFreeThrowBadge"></sub> : null }
        { assist >= 0.18 && assist < 0.25 ? <sup className="assistBadge"></sup> : null }
        { assist >= 0.25 ? <sup className="megaAssistBadge"></sup> : null }
      </span>;
    };

    return <span key={cid.code}>
      <span style={{whiteSpace: 'nowrap'}}><Badge variant="light"
        style={{
          backgroundColor: singleColorField(cid.id, colorField)
// consider this in the future:
//          background: `linear-gradient(to right, ${singleColorField(cid.id, colorField)}, white, ${singleColorField(cid.id, "def_adj_rtg")})`
        }}>
          <span style={{
            fontSize: "small",
            fontWeight: fontWeight(cid.id)
          }}>{cid.code}</span>
      </Badge>
      {buildBadges(cid.id)}</span>
      {finalPlayer ? null : <span style={{opacity: 0}}> ; </span> }
    </span>;
  }

}
