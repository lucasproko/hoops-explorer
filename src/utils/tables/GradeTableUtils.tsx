// React imports:
import React, { useState } from 'react';

import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// Utils
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { CbbColors } from "../../utils/CbbColors";
import { GradeUtils } from "../../utils/stats/GradeUtils";

// Component imports
import { GenericTableOps, GenericTableRow } from "../../components/GenericTable";
import { DivisionStatistics, TeamStatSet } from '../../utils/StatModels';
import { DerivedStatsUtils } from '../stats/DerivedStatsUtils';

type Props = {
   setName: "on" | "off" | "baseline",
   config: string,
   setConfig: (newConfig: string) => void,
   comboTier?: DivisionStatistics,
   highTier?: DivisionStatistics,
   mediumTier?: DivisionStatistics,
   lowTier?: DivisionStatistics

   team: TeamStatSet
};

/** Version of CommonTableDefs.onOffTable for percentils */
const onOffTable = { //accessors vs column metadata
   "title": GenericTableOps.addTitle("", "", GenericTableOps.defaultRowSpanCalculator, "", GenericTableOps.htmlFormatter),
   "sep0": GenericTableOps.addColSeparator(),
   "net": GenericTableOps.addDataCol("Net Rtg", "The margin between the adjusted offensive and defensive efficiencies (lower number is raw margin)",
     CbbColors.offOnlyPicker(...CbbColors.pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   "ppp": GenericTableOps.addDataCol("P/100", "Points per 100 possessions", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   "adj_ppp": GenericTableOps.addDataCol("Adj P/100", "Approximate schedule-adjusted Points per 100 possessions", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   "sep1": GenericTableOps.addColSeparator(),
   "efg": GenericTableOps.addDataCol("eFG%", "Effective field goal% (3 pointers count 1.5x as much) for selected lineups", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   "to": GenericTableOps.addDataCol("TO%", "Turnover % for selected lineups", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   "orb": GenericTableOps.addDataCol("OR%", "Offensive rebounding % for selected lineups", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   "ftr": GenericTableOps.addDataCol("FTR", "Free throw rate for selected lineups", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   "sep2a": GenericTableOps.addColSeparator(),
   "assist": GenericTableOps.addDataCol("A%", "Assist % for selected lineups", 
      CbbColors.varPicker(CbbColors.all_pctile_freq), GenericTableOps.gradeOrHtmlFormatter),
   "sep2b": GenericTableOps.addColSeparator(0.05),
   "3pr": GenericTableOps.addDataCol("3PR", "Percentage of 3 pointers taken against all field goals", 
      CbbColors.varPicker(CbbColors.all_pctile_freq), GenericTableOps.gradeOrHtmlFormatter),
   "2pmidr": GenericTableOps.addDataCol("2PR mid", "Percentage of mid range 2 pointers taken against all field goals", 
      CbbColors.varPicker(CbbColors.all_pctile_freq), GenericTableOps.gradeOrHtmlFormatter),
   "2primr": GenericTableOps.addDataCol("2PR rim", "Percentage of layup/dunk/etc 2 pointers taken against all field goals", 
      CbbColors.varPicker(CbbColors.all_pctile_freq), GenericTableOps.gradeOrHtmlFormatter),
   "sep3": GenericTableOps.addColSeparator(),
   "3p": GenericTableOps.addDataCol("3P%", "3 point field goal percentage", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   "2p": GenericTableOps.addDataCol("2P%", "2 point field goal percentage", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   "2pmid": GenericTableOps.addDataCol("2P% mid", "2 point field goal percentage (mid range)", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   "2prim": GenericTableOps.addDataCol("2P% rim", "2 point field goal percentage (layup/dunk/etc)", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   "poss": GenericTableOps.addDataCol("Tempo", "Unadjusted possessions/game", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   "sep4": GenericTableOps.addColSeparator(),
   "adj_opp": GenericTableOps.addDataCol("SoS", "Weighted average of the offensive or defensive efficiencies of the lineups' opponents", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
};

export class GradeTableUtils {
   static readonly buildGradeTableRows: (p: Props) => GenericTableRow[] = ({
      setName, config, setConfig, comboTier, highTier, mediumTier, lowTier, team
   }) => {
      const tiers = { //(handy LUT)
         High: highTier,
         Medium: mediumTier,
         Low: lowTier,
         Combo: comboTier
      } as Record<string, DivisionStatistics | undefined>;

      const gradeFormat = config.split(":")[0];
      const tierStrTmp = config.split(":")?.[1] || "Combo";
      const tierStr = tiers[tierStrTmp] ? tierStrTmp : (tiers["Combo"] ? "Combo" : (tiers["High"] ? "High" : tierStrTmp));
         //(if set tier doesn't exist just fallback)
      const tierToUse = tiers[tierStr]; 

      const linkTmp = (tier: string) => <a href={tiers[tier] ? "#" : undefined}
         onClick={(event) => { event.preventDefault(); setConfig(`${gradeFormat}:${tier}`); }}
      >
         {tier == "Combo" ? "D1" : tier}{tiers[tier] ? ` (${tiers[tier]?.tier_sample_size})` : ""}
      </a>;

      const tooltipMap = {
         Combo: <Tooltip id={`comboTooltip${setName}`}>Compare each stat against the set of all available D1 teams</Tooltip>,
         High: <Tooltip id={`highTooltip${setName}`}>Compare each stat against the "high tier" of D1 (high majors, mid-high majors, any team in the T150)</Tooltip>,
         Medium: <Tooltip id={`mediumTooltip${setName}`}>Compare each stat against the "medium tier" of D1 (mid/mid-high/mid-low majors, if in the T275)</Tooltip>,
         Low: <Tooltip id={`lowTooltip${setName}`}>Compare each stat against the "low tier" of D1 (low/mid-low majors, if outside the T250)</Tooltip>
      } as Record<string, any>;

      const link = (tier: string) => <OverlayTrigger placement="auto" overlay={tooltipMap[tier]!}>
         {(tier == tierStr) ? <b>{linkTmp(tier)}</b> : linkTmp(tier)}
      </OverlayTrigger>;      

      const topLine = <span className="small">{link("Combo")} | {link("High")} | {link("Medium")} | {link("Low")}</span>;

      const eqRankShowTooltip = <Tooltip id={`eqRankShowTooltip`}>Show the approximate rank for each stat against the "tier" (D1/High/etc) as if it were over the entire season</Tooltip>;
      const percentileShowTooltip = <Tooltip id={`percentileShowTooltip`}>Show the percentile of each stat against the "tier" (D1/High/etc) </Tooltip>;

      const maybeBold = (bold: boolean, html: React.ReactNode) => bold ? <b>{html}</b> : html;
      const bottomLine = <span className="small">
         {maybeBold(gradeFormat == "rank", 
            <OverlayTrigger rootClose placement="auto" overlay={eqRankShowTooltip}>
               <a href="#" onClick={(event) => { event.preventDefault(); setConfig(`rank:${tierStrTmp}`); }}>Ranks</a>
            </OverlayTrigger>)}&nbsp;
         | {maybeBold(gradeFormat == "pct", 
            <OverlayTrigger rootClose placement="auto" overlay={percentileShowTooltip}>
               <a href="#" onClick={(event) => { event.preventDefault(); setConfig(`pct:${tierStrTmp}`); }}>Pctiles</a>
            </OverlayTrigger>)}
      </span>;

      const teamPercentiles = tierToUse ? GradeUtils.buildTeamPercentiles(tierToUse, team, GradeUtils.fieldsToRecord, gradeFormat == "rank")  : {};

      const tempoObj = DerivedStatsUtils.injectPaceStats(team, {}, false);
      const tempoGrade = tierToUse ? GradeUtils.buildTeamPercentiles(tierToUse, tempoObj, [ "tempo" ], gradeFormat == "rank")  : {};
      if (tempoGrade.tempo) {
         tempoGrade.tempo.extraInfo = "(Grade for unadjusted poss/g)";
      }
      teamPercentiles.off_poss = tempoGrade.tempo;

      // Special field formatting:
      const eqRankTooltip = <Tooltip id={`eqRankTooltip${setName}`}>The approximate rank for each stat against the "tier" (D1/High/etc) as if it were over the entire season</Tooltip>;
      const percentileTooltip = <Tooltip id={`percentileTooltip${setName}`}>The percentile of each stat against the "tier" (D1/High/etc) </Tooltip>;

      (teamPercentiles as any).off_title = gradeFormat == "pct" ? 
         <OverlayTrigger rootClose placement="auto" overlay={percentileTooltip}>
            <small><b>Off Pctiles</b></small>
         </OverlayTrigger> :
         <OverlayTrigger rootClose placement="auto" overlay={eqRankTooltip}>
            <small><b>Off Equiv Ranks</b></small>
         </OverlayTrigger>;
      (teamPercentiles as any).def_title = gradeFormat == "pct" ? 
         <OverlayTrigger rootClose placement="auto" overlay={percentileTooltip}>
            <small><b>Def Pctiles</b></small>
         </OverlayTrigger> :
         <OverlayTrigger rootClose placement="auto" overlay={eqRankTooltip}>
            <small><b>Def Equiv Ranks</b></small>
         </OverlayTrigger>;

      if (gradeFormat == "pct") {
         (teamPercentiles as any).def_net = _.isNumber(teamPercentiles.def_net?.value) 
         ?  <small style={CommonTableDefs.getTextShadow(teamPercentiles.def_net, CbbColors.off_pctile_qual)}>
               <i>{(100*teamPercentiles.def_net!.value!).toFixed(1)}</i>
            </small> : undefined;
      } else { //Rank
         (teamPercentiles as any).def_net = _.isNumber(teamPercentiles.def_net?.value) 
         ?  <span style={CommonTableDefs.getTextShadow(teamPercentiles.def_net, CbbColors.off_pctile_qual)}>
               <i><small>(</small>{GenericTableOps.gradeOrHtmlFormatter(teamPercentiles.def_net)}<small>)</small></i>
            </span> : undefined;
      }

      const offPrefixFn = (key: string) => "off_" + key;
      const offCellMetaFn = (key: string, val: any) => "off";
      const defPrefixFn = (key: string) => "def_" + key;
      const defCellMetaFn = (key: string, val: any) => "def";
      const tableData = [
         GenericTableOps.buildTextRow(<span><small>Team Grades</small>: {topLine} // {bottomLine}</span>, ""),
         GenericTableOps.buildDataRow(teamPercentiles, offPrefixFn, offCellMetaFn, onOffTable),
         GenericTableOps.buildDataRow(teamPercentiles, defPrefixFn, defCellMetaFn, onOffTable),
         GenericTableOps.buildRowSeparator()
      ];
      return tableData;
   };
};
