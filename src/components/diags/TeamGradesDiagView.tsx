// React imports:
import React, { useState } from 'react';

import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Utils
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { CbbColors } from "../../utils/CbbColors";
import { GradeUtils } from "../../utils/stats/GradeUtils";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "../GenericTable";
import { DivisionStatistics, TeamStatSet } from '../../utils/StatModels';

type Props = {
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
   "title": GenericTableOps.addTitle("", ""),
   "sep0": GenericTableOps.addColSeparator(),
   "net": GenericTableOps.addDataCol("Net Rtg", "The margin between the adjusted offensive and defensive efficiencies (lower number is raw margin)",
     CbbColors.offOnlyPicker(...CbbColors.pctile_qual), GenericTableOps.percentOrHtmlFormatter),
   "ppp": GenericTableOps.addDataCol("P/100", "Points per 100 possessions", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.percentOrHtmlFormatter),
   "adj_ppp": GenericTableOps.addDataCol("Adj P/100", "Approximate schedule-adjusted Points per 100 possessions", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.percentOrHtmlFormatter),
   "sep1": GenericTableOps.addColSeparator(),
   "efg": GenericTableOps.addDataCol("eFG%", "Effective field goal% (3 pointers count 1.5x as much) for selected lineups", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.percentOrHtmlFormatter),
   "to": GenericTableOps.addDataCol("TO%", "Turnover % for selected lineups", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.percentOrHtmlFormatter),
   "orb": GenericTableOps.addDataCol("OR%", "Offensive rebounding % for selected lineups", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.percentOrHtmlFormatter),
   "ftr": GenericTableOps.addDataCol("FTR", "Free throw rate for selected lineups", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.percentOrHtmlFormatter),
   "sep2a": GenericTableOps.addColSeparator(),
   "assist": GenericTableOps.addDataCol("A%", "Assist % for selected lineups", 
      CbbColors.varPicker(CbbColors.all_pctile_freq), GenericTableOps.percentOrHtmlFormatter),
   "sep2b": GenericTableOps.addColSeparator(0.05),
   "3pr": GenericTableOps.addDataCol("3PR", "Percentage of 3 pointers taken against all field goals", 
      CbbColors.varPicker(CbbColors.all_pctile_freq), GenericTableOps.percentOrHtmlFormatter),
   "2pmidr": GenericTableOps.addDataCol("2PR mid", "Percentage of mid range 2 pointers taken against all field goals", 
      CbbColors.varPicker(CbbColors.all_pctile_freq), GenericTableOps.percentOrHtmlFormatter),
   "2primr": GenericTableOps.addDataCol("2PR rim", "Percentage of layup/dunk/etc 2 pointers taken against all field goals", 
      CbbColors.varPicker(CbbColors.all_pctile_freq), GenericTableOps.percentOrHtmlFormatter),
   "sep3": GenericTableOps.addColSeparator(),
   "3p": GenericTableOps.addDataCol("3P%", "3 point field goal percentage", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.percentOrHtmlFormatter),
   "2p": GenericTableOps.addDataCol("2P%", "2 point field goal percentage", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.percentOrHtmlFormatter),
   "2pmid": GenericTableOps.addDataCol("2P% mid", "2 point field goal percentage (mid range)", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.percentOrHtmlFormatter),
   "2prim": GenericTableOps.addDataCol("2P% rim", "2 point field goal percentage (layup/dunk/etc)", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.percentOrHtmlFormatter),
   "poss": GenericTableOps.addDataCol("Poss", "Unadjusted possessions/game", 
      CommonTableDefs.picker(...CbbColors.pctile_qual), GenericTableOps.percentOrHtmlFormatter),
   "sep4": GenericTableOps.addColSeparator(),
   "adj_opp": GenericTableOps.addDataCol("SoS", "Weighted average of the offensive or defensive efficiencies of the lineups' opponents", 
      CbbColors.varPicker(CbbColors.off_pctile_qual), GenericTableOps.percentOrHtmlFormatter),
};


const TeamGradesDiagView: React.FunctionComponent<Props> = ({
   config, setConfig, comboTier, highTier, mediumTier, lowTier, team
 }) => {

   const tiers = { //(handy LUT)
      High: highTier,
      Medium: mediumTier,
      Low: lowTier,
      Combo: comboTier
   } as Record<string, DivisionStatistics | undefined>;

   const gradeOrPcile = config.split(":")[0];
   const tierStrTmp = config.split(":")?.[1] || "Combo";
   const tierStr = tiers[tierStrTmp] ? tierStrTmp : (tiers["Combo"] ? "Combo" : (tiers["High"] ? "High" : tierStrTmp))
   const tierToUseTmp = tiers[tierStr]; //(if set tier doesn't exist just fallback)
   // (some older versions of this file were nested under "stats" - we'll just handle these for now until I have time to fix the data)
   const tierToUse = (tierToUseTmp as any)?.stats ? ((tierToUseTmp as any)?.stats as DivisionStatistics | undefined) : tierToUseTmp;

   const linkTmp = (tier: string) => <a href={tiers[tier] ? "#" : undefined}
      onClick={(event) => { event.preventDefault(); setConfig(`${gradeOrPcile}:${tier}`); }}
   >
      {tier == "Combo" ? "D1" : tier}
   </a>;
   //TODO: add a tooltip

   const link = (tier: string) => (tier == tierStr) ? <b>{linkTmp(tier)}</b> : linkTmp(tier);
   const topLine = <span className="small">{link("Combo")} | {link("High")} | {link("Medium")} | {link("Low")}</span>;
   const bottomLine = <span className="small"><b><a href="#" onClick={(event) => { event.preventDefault() }}>%iles</a></b> | Grades</span>

   const teamPercentiles = tierToUse ? GradeUtils.buildTeamPercentiles(tierToUse, team)  : {};
   (teamPercentiles as any).off_title = "Off %iles";
   (teamPercentiles as any).def_title = "Def %iles";
   (teamPercentiles as any).def_net = _.isNumber(teamPercentiles.def_net?.value) 
      ?  <small style={CommonTableDefs.getTextShadow(teamPercentiles.def_net, CbbColors.off_pctile_qual)}>
            <i>{(100*teamPercentiles.def_net!.value!).toFixed(1)}</i>
         </small> : undefined;

   const offPrefixFn = (key: string) => "off_" + key;
   const offCellMetaFn = (key: string, val: any) => "off";
   const defPrefixFn = (key: string) => "def_" + key;
   const defCellMetaFn = (key: string, val: any) => "def";
    const tableData = [
      GenericTableOps.buildDataRow(teamPercentiles, offPrefixFn, offCellMetaFn),
      GenericTableOps.buildDataRow(teamPercentiles, defPrefixFn, defCellMetaFn)
   ];

   return <div>
      Team Grades: {topLine}<br/>
      <GenericTable
         tableCopyId="teamStatsTable"
         tableFields={onOffTable}
         tableData={tableData}
         cellTooltipMode="none"
      />
      {bottomLine}<br/><br/>
   </div>;
};

export default TeamGradesDiagView;
