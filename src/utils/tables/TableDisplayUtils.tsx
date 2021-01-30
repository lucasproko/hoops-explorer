
// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// Lodash:
import _ from "lodash";

// Util imports
import { CbbColors } from "../CbbColors";
import { PositionUtils } from "../stats/PositionUtils";

import { CommonTableDefs } from "../tables/CommonTableDefs";
import "./TableDisplayUtils.css";

/** Encapsulates some of the logic used to build decorated lineups in LineupStatsTable */
export class TableDisplayUtils {


  /** Adds a tooltip to the position code */
  static buildPositionTooltip(pos: string, typeStr: string) {
    const fullPos = PositionUtils.idToPosition[pos] || "Unknown"
    return <Tooltip id={pos + "Tooltip"}>
      {fullPos}<br/><br/>
      Algorithmically assigned via stats from {typeStr} lineups.
      See "Show Positional diagnostics" (gear icon on right) for more details.
    </Tooltip>;
  }

  /** Builds an information (over-)loaded lineup HTML */
  static buildDecoratedLineup(
    key: string,
    sortedLineup: { code: string, id: string }[],
    perLineupPlayerMap: Record<string, Record<string, any>>,
    positionFromPlayerKey: Record<string, {posClass: string}>,
    colorField: string,
    decorateLineup: boolean
  ) {
    const tooltipBuilder = (pid: number) => TableDisplayUtils.buildTooltipTexts(
      key + pid, sortedLineup, perLineupPlayerMap, positionFromPlayerKey
    );
    if (decorateLineup) {
      return <OverlayTrigger placement="auto" overlay={tooltipBuilder(0)}>
        <div>{sortedLineup.map((cid: { code: string, id: string }, pid: number) => {
          return TableDisplayUtils.buildDecoratedPlayer(cid, perLineupPlayerMap, colorField, pid == 4)
        })}</div>
      </OverlayTrigger>;
    } else {
      return <OverlayTrigger placement="auto" overlay={tooltipBuilder(0)}>
        <span><b>{sortedLineup.map((cid: { code: string, id: string}) => cid.code).join(" / ")}</b></span>
      </OverlayTrigger>;
    }
  }

  /** Builds a tooltip element for the entire lineup */
  static buildTooltipTexts(
    key: string,
    sortedLineup: { code: string, id: string }[],
    perLineupPlayerMap: Record<string, Record<string, any>>,
    positionFromPlayerKey: Record<string, {posClass: string}>
  ) {
    const tooltipTexts = _.flatMap(sortedLineup, (cid: {id: string, code: string}) => {
      return TableDisplayUtils.buildTooltipText(cid, perLineupPlayerMap, positionFromPlayerKey);
    });
    const tooltip = <Tooltip id={`${key}_info`}>{_.map(tooltipTexts,
      (t: string, i: number) => <span key={"" + i}>{t}<br/></span>
    )}</Tooltip>;

    return tooltip;
  }

  private static buildTooltipText(
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
    const fontWeight = (playerInfo: Record<string, any>) => {
      const usage = _.max(
        [ 0.10, _.min(
          [ playerInfo.off_usage?.value || 0.20, 0.35 ]
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

    const singleColorField = (playerInfo: Record<string, any>, field: string) => {
      const val = playerInfo[field]?.value;
      const color = colorChooser(field)(val) + "80"; //(opacity at the end)
      return color;
    };

    const buildBadges = (playerInfo: Record<string, any>) => {
      const _3pr = playerInfo.off_3pr?.value;
      const ftr = playerInfo.off_ftr?.value;
      const assist = playerInfo.off_assist?.value;
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

    const playerInfo = perLineupPlayerMap[cid.id];
    return <span key={cid.code}>
      <span style={{whiteSpace: 'nowrap'}}><Badge variant="light"
        style={{
          backgroundColor: singleColorField(playerInfo, colorField)
// consider this in the future:
//          background: `linear-gradient(to right, ${singleColorField(cid.id, colorField)}, white, ${singleColorField(cid.id, "def_adj_rtg")})`
        }}>
          <span style={{
            fontSize: "small",
            fontWeight: fontWeight(playerInfo)
          }}>{cid.code}</span>
      </Badge>
      {buildBadges(playerInfo)}</span>
      {finalPlayer ? null : <span style={{opacity: 0}}> ; </span> }
    </span>;
  }

  /** Inject various assist info into the table cell inputs */
  static injectPlayTypeInfo(stat: Record<string, any>, expandedView: boolean, playerView: boolean, teamSeasonLookup?: string) {
    if (playerView) {
      // Put assist %s as the row underneath shot types:
      const buildInfoRow = (stat: any) =>
        <small style={CommonTableDefs.getTextShadow(stat, CbbColors.fgr_offDef)}>
          <i>{(100*(stat?.value || 0)).toFixed(0)}%</i>
        </small>;
      stat.def_2primr = buildInfoRow(stat.off_2prim_ast);
      stat.def_2pmidr = buildInfoRow(stat.off_2pmid_ast);
      stat.def_3pr = buildInfoRow(stat.off_3p_ast);
    }
    const assistBuilder = (stat: any, offDef: "off" | "def") => {
      const rimPct = (100*(stat[`${offDef}_ast_rim`]?.value || 0)).toFixed(0);
      const midPct = (100*(stat[`${offDef}_ast_mid`]?.value || 0)).toFixed(0);
      const threePct = (100*(stat[`${offDef}_ast_3p`]?.value || 0)).toFixed(0);
      return <span>
        Assist breakdown:
        <li>{threePct}% for 3P</li>
        <li>{midPct}% for mid-range</li>
        <li>{rimPct}% at the rim</li>
      </span>;
    }
    const playCategoryBuilder = (stat: any, offDef: "off" | "def") => {
      const totalPoss = stat[`total_${offDef}_poss`]?.value || 1;
      const scramblePct = 100*(stat[`total_${offDef}_scramble_poss`]?.value || 0)/totalPoss;
      const transPct = 100*(stat[`total_${offDef}_trans_poss`]?.value || 0)/totalPoss;
      const totalPpp = (stat[`${offDef}_ppp`]?.value || 0); //TODO: depends on player vs team/lineup
      const scramblePpp = (stat[`${offDef}_scramble_ppp`]?.value || 0) ;
      const scramblePppDelta = scramblePpp - totalPpp;
      const scramblePm = scramblePppDelta > 0 ? "+" : "";
      const transPpp = (stat[`${offDef}_trans_ppp`]?.value || 0);
      const transPppDelta = transPpp - totalPpp;
      const transPm = transPppDelta > 0 ? "+" : "";

      return <span>
        Play category breakdown:
        { scramblePct > 5 ?
          <li>{scramblePct.toFixed(1)}% scramble:<br/>{scramblePm}{scramblePppDelta.toFixed(1)} pts/100</li> :
          <li>{scramblePct.toFixed(1)}% scramble</li>
        }
        { transPct > 5 ?
          <li>{transPct.toFixed(1)}% transition:<br/>{transPm}{transPppDelta.toFixed(1)} pts/100</li> :
          <li>{transPct.toFixed(1)}% transition</li>
        }
      </span>;
    };
    const paceBuilder = (stat: any, isPlayer: boolean) => {
      const totalOffPoss = (isPlayer ? stat[`off_team_poss`]?.value : stat[`off_poss`]?.value) || 0;
      const totalDefPoss = (isPlayer ? totalOffPoss : stat[`def_poss`]?.value) || 0;
      const totalTime = stat[`duration_mins`]?.value || 0;
      const possPer40 = 0.5*(totalOffPoss + totalDefPoss) / (totalTime/40);
      return totalTime > 0 ? <span>{possPer40.toFixed(1)} poss/g</span> : undefined;
    }

    if (stat.off_assist) {
      stat.off_assist.extraInfo = assistBuilder(stat, "off");
    }
    // Offensive FT%: team/lineup/player
    if (stat.off_ftr) {
      stat.off_ftr.extraInfo = <span>FT: {(100*(stat.off_ft?.value || 0)).toFixed(1)}%</span>;
    }

    const buildText = (stat: any) => {
      return `${(100*(stat?.value || 0)).toFixed(0)}% assisted`
    }


    // Pending fixing this issue (https://github.com/Alex-At-Home/cbb-on-off-analyzer/issues/142),
    // just filter out any teams that suffer from it (All women teams and a few men's teams)
    const workaroundTempoBug = teamSeasonLookup && (
      (_.startsWith(teamSeasonLookup, "Women_") && !_.endsWith(teamSeasonLookup, "2020/21")) ||

      (teamSeasonLookup == "Men_West Virginia_2018/9") ||
      (teamSeasonLookup == "Men_Florida St._2018/9") ||
      (teamSeasonLookup == "Men_George Washington_2018/9") ||
      (teamSeasonLookup == "Men_Kansas St._2018/9") ||
      (teamSeasonLookup == "Men_NC State_2018/9") ||
      (teamSeasonLookup == "Men_Oklahoma St._2018/9") ||
      (teamSeasonLookup == "Men_South Carolina_2018/9") ||
      (teamSeasonLookup == "Men_Tennessee_2018/9") ||
      (teamSeasonLookup == "Men_Utah St._2018/9") ||

      (teamSeasonLookup == "Men_Florida_2019/20") ||
      (teamSeasonLookup == "Men_Missouri_2019/20")
    );

    // Handle adding and removing of extra info:
    if (expandedView) {
      if (stat.off_2primr) {
        delete stat.off_2primr.extraInfo;
      }
      if (stat.off_2pmidr) {
        delete stat.off_2pmidr.extraInfo;
      }
      if (stat.off_3pr) {
        delete stat.off_3pr.extraInfo;
      }
    } else {
      if (stat.off_2primr) {
        stat.off_2primr.extraInfo = <span>{buildText(stat.off_2prim_ast)}</span>;
      }
      if (stat.off_2pmidr) {
        stat.off_2pmidr.extraInfo = <span>{buildText(stat.off_2pmid_ast)}</span>;
      }
      if (stat.off_3pr) {
        stat.off_3pr.extraInfo = <span>{buildText(stat.off_3p_ast)}</span>;
      }
    }
    if (!playerView) { // team/lineup views have both offense and defense
      if (stat.off_ppp) {
        stat.off_ppp.extraInfo = playCategoryBuilder(stat, "off");
      }
      if (stat.def_ppp) {
        stat.def_ppp.extraInfo = playCategoryBuilder(stat, "def");
      }
      if (stat.def_assist) {
        stat.def_assist.extraInfo = assistBuilder(stat, "def");
      }
      if (stat.def_2primr) {
        stat.def_2primr.extraInfo = <span>{buildText(stat.def_2prim_ast)}</span>;
      }
      if (stat.def_2pmidr) {
        stat.def_2pmidr.extraInfo = <span>{buildText(stat.def_2pmid_ast)}</span>;
      }
      if (stat.def_3pr) {
        stat.def_3pr.extraInfo = <span>{buildText(stat.def_3p_ast)}</span>;
      }
      if (stat.off_poss) {
        //TODO: see https://github.com/Alex-At-Home/cbb-on-off-analyzer/issues/142
        if (workaroundTempoBug) {
          stat.off_poss.extraInfo = <i>(data not available for this team, contact me for more details)</i>;
        } else {
          stat.off_poss.extraInfo = paceBuilder(stat, false);
        }
      }
      // Defensive FT%: team/lineup/ only
      if (stat.def_ftr) {
        stat.def_ftr.extraInfo = <span>FT: {(100*(stat.def_ft?.value || 0)).toFixed(1)}%</span>;
      }
      if (stat.off_raw_net) { // Copy raw net as a small extra info in the defensive column
        stat.def_net = {
          ...stat.off_raw_net,
          value: <small style={CommonTableDefs.getTextShadow(stat.off_raw_net, CbbColors.off_diff35_p100_redGreen)}><i>
            {(stat.off_raw_net?.value || 0).toFixed(1)}
          </i></small>
        };
      }
    } else {
      if (stat.off_team_poss) {
        //TODO: see https://github.com/Alex-At-Home/cbb-on-off-analyzer/issues/142
        if (workaroundTempoBug) {
          stat.off_team_poss.extraInfo = <i>(data not available for this team, contact me for more details)</i>;
        } else {
          stat.off_team_poss.extraInfo = paceBuilder(stat, true);
        }
      }
      if (stat.off_team_poss_pct) {
        //TODO: see https://github.com/Alex-At-Home/cbb-on-off-analyzer/issues/142
        if (workaroundTempoBug) {
          stat.off_team_poss_pct.extraInfo = <i>(data not available for this team, contact me for more details)</i>;
        } else {
          stat.off_team_poss_pct.extraInfo = paceBuilder(stat, true);
        }
      }
    }
    return stat;
  }

}
