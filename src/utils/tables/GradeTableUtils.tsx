// React imports:
import React, { useState } from 'react';

// Next imports
import fetch from 'isomorphic-unfetch';

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
import { GenericTableColProps, GenericTableOps, GenericTableRow } from "../../components/GenericTable";
import { DivisionStatistics, IndivStatSet, TeamStatSet } from '../../utils/StatModels';
import { DerivedStatsUtils } from '../stats/DerivedStatsUtils';
import { ParamDefaults, CommonFilterParams } from '../FilterModels';
import { DateUtils } from '../DateUtils';

type TeamProps = {
   setName: "on" | "off" | "baseline",
   config: string,
   setConfig: (newConfig: string) => void,
   comboTier?: DivisionStatistics,
   highTier?: DivisionStatistics,
   mediumTier?: DivisionStatistics,
   lowTier?: DivisionStatistics

   team: TeamStatSet
};

type PlayerProps = {
   title: string,
   config: string,
   setConfig: (newConfig: string) => void,
   comboTier?: DivisionStatistics,
   highTier?: DivisionStatistics,
   mediumTier?: DivisionStatistics,
   lowTier?: DivisionStatistics,

   player: IndivStatSet,
   expandedView: boolean, possAsPct: boolean, factorMins: boolean, includeRapm: boolean
};

type TableBuilderInfo = {
   custom: Record<string, (val: any, valMeta: string) => string | undefined>,
   all_pct: Set<string>
   // all others are off_pct_qual
};

/** Builds the team and player grade tables based on their config */
const buildOnOffTable = (table: Record<string, GenericTableColProps>, config: TableBuilderInfo, player: boolean) => _.chain(table)
   .map((val, key) => {
      const formatter = player ? GenericTableOps.approxRankOrHtmlFormatter : GenericTableOps.gradeOrHtmlFormatter;
      if (key == "title") {
         return [ key, GenericTableOps.addTitle("", "", GenericTableOps.defaultRowSpanCalculator, "", formatter) ];
      } else if (_.startsWith(key, "sep")) {
         return [ key, val] as [string, GenericTableColProps];
      } else if (config.all_pct.has(key)) {
         return [ key, GenericTableOps.addDataCol(val.colName, "", 
            CbbColors.varPicker(CbbColors.all_pctile_freq), formatter)
         ];
       } else { // "falls back" to CbbColors.off_pctile_qual
         const picker = config.custom[key];
         if (!_.isNil(picker)) {
            return [ key, GenericTableOps.addDataCol(val.colName, "", 
               picker, formatter)
            ];
         } else {
            return [ key, GenericTableOps.addDataCol(val.colName, "", 
              CbbColors.varPicker(CbbColors.off_pctile_qual), formatter)
            ];
         }
      }
   }).fromPairs().value();

/** Controls the formatting of the team grade table */
const teamBuilderInfo = {
   custom: {
      "net": CbbColors.offOnlyPicker(...CbbColors.pctile_qual)
   },
   all_pct: new Set(["assist", "3pr", "2pmidr", "2primr" ])
};

/** Controls the formatting of the team grade table */
const playerBuilderInfo = {
   custom: {
   },
   all_pct: new Set(["usage", "assist", "3pr", "2pmidr", "2primr" ])
};

export type DivisionStatsCache = {
   year?: string,
   gender?: string,
   Combo?: DivisionStatistics,
   High?: DivisionStatistics,
   Medium?: DivisionStatistics
   Low?: DivisionStatistics
 };
 
export class GradeTableUtils {

  /** Create or build a cache contain D1/tier stats for a bunch of team statistics */
  static readonly populateTeamDivisionStatsCache = (
     filterParams: CommonFilterParams,
     setCache: (s: DivisionStatsCache) => void,
     tierOverride: string | undefined = undefined
   ) => {
      GradeTableUtils.populateDivisionStatsCache("team", filterParams, setCache, tierOverride);
   };

   /** Create or build a cache contain D1/tier stats for a bunch of team statistics */
   static readonly populatePlayerDivisionStatsCache = (
      filterParams: CommonFilterParams,
      setCache: (s: DivisionStatsCache) => void,
      tierOverride: string | undefined = undefined
   ) => {
      GradeTableUtils.populateDivisionStatsCache("player", filterParams, setCache, tierOverride);
   }

   /** Create or build a cache contain D1/tier stats for a bunch of team statistics */
   static readonly populateDivisionStatsCache = (
      type: "player" | "team",
      filterParams: CommonFilterParams,
      setCache: (s: DivisionStatsCache) => void,
      tierOverride: string | undefined = undefined
   ) => {
      const urlInFix = type == "player" ? "players_" : "";
      const getUrl = (inGender: string, inYear: string, inTier: string) => {
         const subYear = inYear.substring(0, 4);
         if (DateUtils.inSeasonYear.startsWith(subYear)) { // Access from dynamic storage
            return `/api/getStats?&gender=${inGender}&year=${subYear}&tier=${inTier}&type=${type}`;
         } else { //archived
            return `/leaderboards/lineups/stats_${urlInFix}all_${inGender}_${subYear}_${inTier}.json`;
         }
      }

      const inGender = filterParams.gender || ParamDefaults.defaultGender;
      const inYear = filterParams.year || ParamDefaults.defaultYear;
      const fetchAll = (tierOverride ? [ tierOverride ] : [ "Combo", "High", "Medium", "Low" ]).map((tier) => {
      return fetch(getUrl(inGender, inYear, tier)).then((response: fetch.IsomorphicResponse) => {
            return response.ok ? response.json() : Promise.resolve({});
         });
      });
      Promise.all(fetchAll).then((jsons: any[]) => {
         setCache({
            year: inYear, gender: inGender, //(so know when to refresh cache)
            Combo: _.isEmpty(jsons[0]) ? undefined : jsons[0], //(if using tierOverride, it goes in here)
            High: _.isEmpty(jsons[1]) ? undefined : jsons[1],
            Medium: _.isEmpty(jsons[2]) ? undefined : jsons[2],
            Low: _.isEmpty(jsons[3]) ? undefined : jsons[3],
         });
      });
   };


   /** Build the rows containing the grade information for a team */
   static readonly buildTeamGradeTableRows: (p: TeamProps) => GenericTableRow[] = ({
      setName, config, setConfig, comboTier, highTier, mediumTier, lowTier, team
   }) => {
      const nameAsId = setName.replace(/[^A-Za-z0-9_]/g, '');
      const title = setName == "on" ? "A Lineups" : (setName == "off" ? "B Lineups" : "Baseline");
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
         Combo: <Tooltip id={`comboTooltip${nameAsId}`}>Compare each stat against the set of all available D1 teams</Tooltip>,
         High: <Tooltip id={`highTooltip${nameAsId}`}>Compare each stat against the "high tier" of D1 (high majors, mid-high majors, any team in the T150)</Tooltip>,
         Medium: <Tooltip id={`mediumTooltip${nameAsId}`}>Compare each stat against the "medium tier" of D1 (mid/mid-high/mid-low majors, if in the T275)</Tooltip>,
         Low: <Tooltip id={`lowTooltip${nameAsId}`}>Compare each stat against the "low tier" of D1 (low/mid-low majors, if outside the T250)</Tooltip>
      } as Record<string, any>;

//TODO: I think the event.preventDefault stops the OverlayTrigger from working (on mobile specifically), so removing it for now      
      const link = (tier: string) => (tier == tierStr) ? <b>{linkTmp(tier)}</b> : linkTmp(tier);
//      <OverlayTrigger placement="auto" overlay={tooltipMap[tier]!}>
//         {(tier == tierStr) ? <b>{linkTmp(tier)}</b> : linkTmp(tier)}
//      </OverlayTrigger>;    
      

      const topLine = <span className="small">{link("Combo")} | {link("High")} | {link("Medium")} | {link("Low")}</span>;

      const eqRankShowTooltip = <Tooltip id={`eqRankShowTooltip${nameAsId}`}>Show the approximate rank for each stat against the "tier" (D1/High/etc) as if it were over the entire season</Tooltip>;
      const percentileShowTooltip = <Tooltip id={`percentileShowTooltip${nameAsId}`}>Show the percentile of each stat against the "tier" (D1/High/etc) </Tooltip>;

//TODO: I think the event.preventDefault stops the OverlayTrigger from working (on mobile specifically), so removing it for now      
      const maybeBold = (bold: boolean, html: React.ReactNode) => bold ? <b>{html}</b> : html;
      const bottomLine = <span className="small">
         {maybeBold(gradeFormat == "rank", 
//            <OverlayTrigger placement="auto" overlay={eqRankShowTooltip}>
               <a href={"#"} onClick={(event) => { event.preventDefault(); setConfig(`rank:${tierStrTmp}`); }}>Ranks</a>
//            </OverlayTrigger>
            )}
         &nbsp;| {maybeBold(gradeFormat == "pct", 
//           <OverlayTrigger placement="auto" overlay={percentileShowTooltip}>
               <a href="#" onClick={(event) => { event.preventDefault(); setConfig(`pct:${tierStrTmp}`); }}>Pctiles</a>
//           </OverlayTrigger>
         )}
      </span>;

      const helpTooltip = <Tooltip id={`helpTooltip${nameAsId}`}>
         High Tier: high majors, mid-high majors, plus any team in the T150<br/>
         Medium Tier: mid/mid-high/mid-low majors, if in the T275<br/>
         Low Tier: low/mid-low majors, or if outside the T250
      </Tooltip>;
      const helpOverlay = <OverlayTrigger placement="auto" overlay={helpTooltip}><b>(?)</b></OverlayTrigger>;

      const teamPercentiles = tierToUse ? GradeUtils.buildTeamPercentiles(tierToUse, team, GradeUtils.teamFieldsToRecord, gradeFormat == "rank")  : {};

      const tempoObj = DerivedStatsUtils.injectPaceStats(team, {}, false);
      const tempoGrade = tierToUse ? GradeUtils.buildTeamPercentiles(tierToUse, tempoObj, [ "tempo" ], gradeFormat == "rank")  : {};
      if (tempoGrade.tempo) {
         tempoGrade.tempo.extraInfo = "(Grade for unadjusted poss/g)";
      }
      teamPercentiles.off_poss = tempoGrade.tempo;

      // Special field formatting:
      const eqRankTooltip = <Tooltip id={`eqRankTooltip${nameAsId}`}>The approximate rank for each stat against the "tier" (D1/High/etc) as if it were over the entire season</Tooltip>;
      const percentileTooltip = <Tooltip id={`percentileTooltip${nameAsId}`}>The percentile of each stat against the "tier" (D1/High/etc) </Tooltip>;

      (teamPercentiles as any).off_title = gradeFormat == "pct" ? 
         <OverlayTrigger placement="auto" overlay={percentileTooltip}>
            <small><b>Off Pctiles</b></small>
         </OverlayTrigger> 
         :
         <OverlayTrigger placement="auto" overlay={eqRankTooltip}>
            <small><b>Off Equiv Ranks</b></small>
         </OverlayTrigger>
         ;
      (teamPercentiles as any).def_title = gradeFormat == "pct" ? 
         <OverlayTrigger placement="auto" overlay={percentileTooltip}>
            <small><b>Def Pctiles</b></small>
         </OverlayTrigger> 
         :
         <OverlayTrigger placement="auto" overlay={eqRankTooltip}>
            <small><b>Def Equiv Ranks</b></small>
         </OverlayTrigger>
         ;

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
      const tableConfig = buildOnOffTable(CommonTableDefs.onOffTable, teamBuilderInfo, false);
      const tableData = [
         GenericTableOps.buildRowSeparator(),
         GenericTableOps.buildDataRow(teamPercentiles, offPrefixFn, offCellMetaFn, tableConfig),
         GenericTableOps.buildDataRow(teamPercentiles, defPrefixFn, defCellMetaFn, tableConfig),
         GenericTableOps.buildTextRow(<span><small>{title} Team Grades {helpOverlay}</small>: {topLine} // {bottomLine}</span>, ""),
      ];
      return tableData;
   };

   /** Build the rows containing the grade information for a team 
    * (see buildTeamGradeTableRows for why there aren't OverlayTriggers)
   */
   static readonly buildPlayerGradeTableRows: (p: PlayerProps) => GenericTableRow[] = ({
      title, config, setConfig, comboTier, highTier, mediumTier, lowTier, player,
      expandedView, possAsPct, factorMins, includeRapm
   }) => {
      const nameAsId = title.replace(/[^A-Za-z0-9_]/g, '');
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
         Combo: <Tooltip id={`comboTooltip${nameAsId}`}>Compare each stat against the set of all available D1 teams</Tooltip>,
         High: <Tooltip id={`highTooltip${nameAsId}`}>Compare each stat against the "high tier" of D1 (high majors, mid-high majors, any team in the T150)</Tooltip>,
         Medium: <Tooltip id={`mediumTooltip${nameAsId}`}>Compare each stat against the "medium tier" of D1 (mid/mid-high/mid-low majors, if in the T275)</Tooltip>,
         Low: <Tooltip id={`lowTooltip${nameAsId}`}>Compare each stat against the "low tier" of D1 (low/mid-low majors, if outside the T250)</Tooltip>
      } as Record<string, any>;

      const link = (tier: string) => (tier == tierStr) ? <b>{linkTmp(tier)}</b> : linkTmp(tier);
      
      const topLine = <span className="small">{link("Combo")} | {link("High")} | {link("Medium")} | {link("Low")}</span>;

      const eqRankShowTooltip = <Tooltip id={`eqRankShowTooltip${nameAsId}`}>Show the approximate rank for each stat against the "tier" (D1/High/etc) as if it were over the entire season</Tooltip>;
      const percentileShowTooltip = <Tooltip id={`percentileShowTooltip${nameAsId}`}>Show the percentile of each stat against the "tier" (D1/High/etc) </Tooltip>;

      const maybeBold = (bold: boolean, html: React.ReactNode) => bold ? <b>{html}</b> : html;
      const bottomLine = <span className="small">
         {maybeBold(gradeFormat == "rank", 
               <a href={"#"} onClick={(event) => { event.preventDefault(); setConfig(`rank:${tierStrTmp}`); }}>Ranks</a>
            )}
         &nbsp;| {maybeBold(gradeFormat == "pct", 
               <a href="#" onClick={(event) => { event.preventDefault(); setConfig(`pct:${tierStrTmp}`); }}>Pctiles</a>
         )}
      </span>;

      const helpTooltip = <Tooltip id={`helpTooltip${nameAsId}`}>
         High Tier: high majors, mid-high majors, plus any team in the T150<br/>
         Medium Tier: mid/mid-high/mid-low majors, if in the T275<br/>
         Low Tier: low/mid-low majors, or if outside the T250
      </Tooltip>;
      const helpOverlay = <OverlayTrigger placement="auto" overlay={helpTooltip}><b>(?)</b></OverlayTrigger>;

      const playerPercentiles = tierToUse ? GradeUtils.buildPlayerPercentiles(tierToUse, player, _.keys(GradeUtils.playerFields), gradeFormat == "rank")  : {};

      // Special field formatting:
      const eqRankTooltip = <Tooltip id={`eqRankTooltip${nameAsId}`}>The approximate rank for each stat against the "tier" (D1/High/etc) as if it were over the entire season</Tooltip>;
      const percentileTooltip = <Tooltip id={`percentileTooltip${nameAsId}`}>The percentile of each stat against the "tier" (D1/High/etc) </Tooltip>;

      (playerPercentiles as any).off_title = gradeFormat == "pct" ? 
         <OverlayTrigger placement="auto" overlay={percentileTooltip}>
            <small><b>Pctiles</b></small>
         </OverlayTrigger> 
         :
         <OverlayTrigger placement="auto" overlay={eqRankTooltip}>
            <small><b>Equiv Ranks</b></small>
         </OverlayTrigger>
         ;
      (playerPercentiles as any).def_title = gradeFormat == "pct" ? 
         <OverlayTrigger placement="auto" overlay={percentileTooltip}>
            <small></small>
         </OverlayTrigger> 
         :
         <OverlayTrigger placement="auto" overlay={eqRankTooltip}>
            <small></small>
         </OverlayTrigger>
         ;

      const offPrefixFn = (key: string) => "off_" + key;
      const offCellMetaFn = (key: string, val: any) => "off";
      const defPrefixFn = (key: string) => "def_" + key;
      const defCellMetaFn = (key: string, val: any) => "def";
      const tableConfig = buildOnOffTable(CommonTableDefs.onOffIndividualTable(
         expandedView, possAsPct, factorMins, includeRapm
      ), playerBuilderInfo, true);
      const tableData = [
         GenericTableOps.buildDataRow(playerPercentiles, offPrefixFn, offCellMetaFn, tableConfig),
      ].concat(expandedView ?
         GenericTableOps.buildDataRow(playerPercentiles, defPrefixFn, defCellMetaFn, tableConfig) : []
      ).concat([
         GenericTableOps.buildTextRow(<span><small>{title} {helpOverlay}</small>: {topLine} // {bottomLine}</span>, ""),
      ]);
      return tableData;
   };
};
