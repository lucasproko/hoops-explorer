// React imports:
import React, { useState, useEffect, useRef } from 'react';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
import Select, { components } from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faPen, faEye, faExclamation, faCheck, faFilter, faList, faTags } from '@fortawesome/free-solid-svg-icons'
import ClipboardJS from 'clipboard';

// Component imports
import GenericTable, { GenericTableOps } from "./GenericTable";
import GenericTogglingMenu from './shared/GenericTogglingMenu';
import GenericTogglingMenuItem from './shared/GenericTogglingMenuItem';
import ConferenceSelector, { ConfSelectorConstants } from './shared/ConferenceSelector';

// Table building
// Util imports
import { TeamEditorParams, PlayerSeasonComparisonParams, ParamDefaults } from '../utils/FilterModels';

import { Statistic, RosterEntry, PureStatSet } from '../utils/StatModels';
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import { GradeUtils } from '../utils/stats/GradeUtils';
import { UrlRouting } from '../utils/UrlRouting';
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import TeamEditorTable, { TeamEditorStatsModel } from './TeamEditorTable';
import { DateUtils } from '../utils/DateUtils';
import { Dropdown, InputGroup, ModalTitle } from 'react-bootstrap';
import AsyncFormControl from './shared/AsyncFormControl';

// Library imports:
import fetch from 'isomorphic-unfetch';
import { RequestUtils } from '../utils/RequestUtils';
import { OffseasonLeaderboardUtils } from '../utils/stats/OffseasonLeaderboardUtils';

// Recharts imports:
//@ts-ignore
import { ReferenceArea, ResponsiveContainer, Tooltip as RechartTooltip, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Label, Cell, LabelList } from 'recharts';
import { GoodBadOkTriple } from '../utils/stats/TeamEditorUtils';
import { CbbColors } from '../utils/CbbColors';
import { NicknameToConference, NonP6Conferences, Power6Conferences } from '../utils/public-data/ConferenceInfo';
import { AdvancedFilterUtils } from '../utils/AdvancedFilterUtils';
import LinqExpressionBuilder from './shared/LinqExpressionBuilder';
import { SelectComponents } from 'react-select/src/components';
import { CommonTableDefs } from '../utils/tables/CommonTableDefs';

type Props = {
   startingState: PlayerSeasonComparisonParams,
   dataEvent: TeamEditorStatsModel,
   onChangeState: (newParams: PlayerSeasonComparisonParams) => void
}

/** Set to true to rebuild public/leaderboard/lineups/stats_all_Men_YYYY_Preseason.json */
const logDivisionStatsToConsole = false;

/** Will dump out some possible manual overrides to be made */
const diagnosticCompareWithRosters = false;

const PlayerSeasonComparisonChart: React.FunctionComponent<Props> = ({startingState, dataEvent, onChangeState}) => {
   const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
     "server" : window.location.hostname
 
   /** Only show help for diagnstic on/off on main page */
   const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");
 
   // 1] Data model

   // (don't support tier changes)
   const tier: string = "All";

   // Data source
   const [ clipboard, setClipboard] = useState(null as null | ClipboardJS);
   const [confs, setConfs] = useState(startingState.confs || "");
   const hasCustomFilter = confs.indexOf(ConfSelectorConstants.queryFiltersName) >= 0;

   const [year, setYear] = useState(startingState.year || DateUtils.mostRecentYearWithData);
   const yearWithStats = DateUtils.getPrevYear(year);

   const [gender, setGender] = useState("Men"); // TODO ignore input just take Men

   const [queryFilters, setQueryFilters] = useState(startingState.queryFilters || "");

   const [ rostersPerTeam, setRostersPerTeam ] = useState({} as Record<string, Record<string, RosterEntry>>);

   const [ title, setTitle ] = useState(startingState.title || "");
   const overallPresets = [
      [ "Transfer predictions",  {
         title: "How transfers fared compared to their predicted RAPM",
         advancedFilter: "Transfers",
         xAxis: "Off RAPM: actual - predicted",
         yAxis: "Def RAPM: actual - predicted",
         dotColor: "RAPM margin",
         dotSize: "Possession% (off)",
         dotColorMap: "RAPM"
      }]
   ] as Array<[string, PlayerSeasonComparisonParams]>;

   const [height, setHeight] = useState(512);
   const latestHeight = useRef(height);
   useEffect(() => {
     function handleResize() {
         setTimeout(() => {
            setHeight(window.innerHeight);
         }, 250);
     }
     window.addEventListener('resize', handleResize);
     setHeight(window.innerHeight);
     return () => window.removeEventListener('resize', handleResize);
   }, []);


   // All the complex config:

   // If there's a title show that, otherwise show the config
   const [ showConfigOptions, setShowConfigOptions ] = useState<boolean>(startingState.showConfig || !startingState.title);

   // Filter text (show/hide):
   const [ advancedFilterStr, setAdvancedFilterStr ] = useState(startingState.advancedFilter || "");
   const [ advancedFilterError, setAdvancedFilterError ] = useState(undefined as string | undefined);
   const advancedFilterPresets = [
      [ "Transfers", "(prev_team != next_team) AND prev_team" ],
      [ "Ranked Freshmen", `!prev_team AND next_roster.year_class == "Fr"` ],
      [ "Freshmen -> Sophomores", `prev_roster.year_class == "Fr"` ],
      [ "Sophomores -> Juniors", `prev_roster.year_class == "So"` ],
      [ "Juniors -> Seniors", `prev_roster.year_class == "Jr"` ],
      [ "Seniors -> Super-Seniors", `prev_roster.year_class == "Sr"` ],
      [ "Rotation+ caliber previous year", `prev_adj_rapm_margin >= 2` ],
      [ "Starter+ caliber previous year", `prev_adj_rapm_margin >= 3.5` ],
   ] as Array<[string, string]>;
    
   // Highlight text (show/hide):
   const [ highlightFilterStr, setHighlightFilterStr ] = useState(startingState.highlightFilter || "");
   const [ highlightFilterError, setHighlightFilterError ] = useState(undefined as string | undefined);

   // Chart control
   const [ xAxis, setXAxis ] = useState(startingState.xAxis || ParamDefaults.defaultPlayerComparisonXAxis);
   const [ yAxis, setYAxis ] = useState(startingState.yAxis || ParamDefaults.defaultPlayerComparisonYAxis);
   const [ dotColor, setDotColor ] = useState(startingState.dotColor || "");
   const [ dotSize, setDotSize ] = useState(startingState.dotSize || "");
   const axisPresets = [
      [ "Off RAPM: actual - predicted", "next_off_adj_rapm  - pred_ok_off_adj_rapm" ],
      [ "Def RAPM: actual - predicted", "pred_ok_def_adj_rapm - next_def_adj_rapm" ],
      [ "RAPM margin (prev)", "prev_adj_rapm_margin" ],
      [ "RAPM margin", "next_adj_rapm_margin" ],
      [ "Min/game (prev)", "40*prev_off_team_poss_pct" ],
      [ "Min/game", "40*next_off_team_poss_pct" ],
      [ "Possession% (off, prev)", "prev_off_team_poss_pct" ],
      [ "Possession% (off)", "next_off_team_poss_pct" ],
   ] as Array<[string, string]>;
   const [ dotColorMap, setDotColorMap ] = useState(startingState.dotColorMap || "Black");
   const colorMapOptions = {
      "Black": undefined,
      "Red/Green Auto": CbbColors.percentile_redBlackGreen,
      "Green/Red Auto": CbbColors.percentile_greenBlackRed,
      "Blue/Orange Auto": CbbColors.percentile_blueBlackOrange,
      "Off Rtg": CbbColors.off_pp100_redBlackGreen,
      "Def Rtg": CbbColors.def_pp100_redBlackGreen,
      "RAPM": CbbColors.off_diff10_p100_redBlackGreen,
      "oRAPM": CbbColors.off_diff10_p100_redBlackGreen,
      "dRAPM": CbbColors.def_diff10_p100_redBlackGreen,
      "Adj oRtg+": CbbColors.off_diff10_p100_redBlackGreen,
      "Adj dRtg+": CbbColors.def_diff10_p100_redBlackGreen,
      "Usage": CbbColors.usg_offDef_blueBlackOrange,
      "Red/Green -10:+10": CbbColors.off_diff10_p100_redBlackGreen,
      "Green/Red -10:+10": CbbColors.def_diff10_p100_redBlackGreen,
      "Red/Green 80:120": CbbColors.off_pp100_redBlackGreen,
      "Green/Red 80:120": CbbColors.def_pp100_redBlackGreen,
      "Blue/Orange 10%:30%": CbbColors.usg_offDef_blueBlackOrange,
      "Red/Green %ile": CbbColors.percentile_redBlackGreen,
      "Green/Red %ile": CbbColors.percentile_greenBlackRed,
      "Blue/Orange %ile": CbbColors.percentile_blueBlackOrange,
   } as Record<string, undefined | ((val: number) => string)>;

   const [ labelStrategy, setLabelStrategy ] = useState(startingState.labelStrategy || "None");

   // Go fetch the data

   if (diagnosticCompareWithRosters && _.isEmpty(rostersPerTeam)) {
      const fetchRosterJson = (teamName: string) => {
         const rosterJsonUri = (encodeEncodePrefix: boolean) =>
           `/rosters/${gender}_${(year || "").substring(0, 4)}`
           + `/${RequestUtils.fixLocalhostRosterUrl(teamName, encodeEncodePrefix)}.json`;
         return fetch(
           rosterJsonUri(true)
         ).then(
           (resp: any) => resp.json()
         ).then((json: any) => [ teamName, json ] as [ string, Record<string, RosterEntry> ]);
      };
      const rosterPromises: Promise<[string, Record<string, RosterEntry>]>[] = _.flatMap(AvailableTeams.byName, (teams, __) => {
         const maybeTeam = teams.find(t => (t.year == yearWithStats) && (t.gender == gender));
         return maybeTeam ? [ 
            fetchRosterJson(maybeTeam.team).catch( //(carry on error, eg if the file doesn't exist)
               (err: any) => [ maybeTeam.team, {} ]
            )                
         ] : []
      });
      if (_.isEmpty(rosterPromises)) {
         setRostersPerTeam({});
      } else {
         Promise.all(rosterPromises).then((rosterInfo: [string, Record<string, RosterEntry>][]) => {
            setRostersPerTeam(_.fromPairs(rosterInfo));
         });
      }
   }

   /** When the params change */
   useEffect(() => {
      onChangeState({
         year: year, confs, 
         queryFilters: queryFilters,
         title: title,
         advancedFilter: advancedFilterStr,
         highlightFilter: highlightFilterStr,
         xAxis: xAxis, yAxis: yAxis, dotSize: dotSize, dotColor: dotColor,
         showConfig: showConfigOptions,
         dotColorMap: dotColorMap,
         labelStrategy: labelStrategy
      });
   }, [ confs, year, queryFilters, advancedFilterStr, highlightFilterStr, title, xAxis, yAxis, 
      dotColor, dotColorMap, dotSize, showConfigOptions, labelStrategy ]);

   /** Set this to be true on expensive operations */
   const [loadingOverride, setLoadingOverride] = useState(false);

   useEffect(() => { // Add and remove clipboard listener
      initClipboard();
  
      if (typeof document !== `undefined`) {
        //(if we added a clipboard listener, then remove it on page close)
        //(if we added a submitListener, then remove it on page close)
        return () => {
          if (clipboard) {
            clipboard.destroy();
            setClipboard(null);
          }
        };
      }
   });
   /** This grovelling is needed to ensure that clipboard is only loaded client side */
   function initClipboard() {
      if (null == clipboard) {
         var newClipboard = new ClipboardJS(`#copyLink_playerSeasonComparison`, {
            text: function(trigger) {
               return window.location.href;
            }
         });
         newClipboard.on('success', (event: ClipboardJS.Event) => {
            //(unlike other tables, don't add to history)
            // Clear the selection in some visually pleasing way
            setTimeout(function() {
               event.clearSelection();
            }, 150);
         });
         setClipboard(newClipboard);
      }
   }
 
   /** At the expense of some time makes it easier to see when changes are happening */
   const friendlyChange = (change: () => void, guard: boolean, timeout: number = 250) => {
      if (guard) {
      setLoadingOverride(true);
      setTimeout(() => {
         change()
      }, timeout)
      }
   };

   // 2] Processing

   const editTooltip = <Tooltip id="editTooltip">Show/Hide the inline Team Viewer and Editor </Tooltip>;

   const chart = React.useMemo(() => {

      const waitForRosterDiagMode = diagnosticCompareWithRosters && _.isEmpty(rostersPerTeam);
      if (waitForRosterDiagMode || _.isEmpty(dataEvent.players)) {
         // If we don't have players we're not done loading yet, so put up a loading screen:
         return <div>
            </div>;
      } else {
         setLoadingOverride(false);
      }

      const avgEff = efficiencyAverages[`${gender}_${yearWithStats}`] || efficiencyAverages.fallback;
         //(always use yearWithStats, because in evalMode you want to compare actual against exactly what was projected)

      // Team stats generation business logic:
      const {
         derivedDivisionStats, teamRanks,
         numTeams, 
         netEffToRankMap, actualNetEffToRankMap, offEffToRankMap, defEffToRankMap
      } = OffseasonLeaderboardUtils.buildAllTeamStats(
         dataEvent, {
            confs, year, gender,
            sortBy: "", 
            evalMode: true,
            diagnosticCompareWithRosters
         },
         {}, rostersPerTeam, avgEff, true
      );

      //Useful for building late off-season grade lists (copy to public/leaderboard/lineups/stats_all_Men_YYYY_Preseason.json) 
      //(note this gets printed out multiple times - ignore all but the last time, it doesn't have all the data yet)
      if (logDivisionStatsToConsole && server == "localhost") {
         console.log(JSON.stringify(derivedDivisionStats));
      }

      const fieldValExtractor = (field: string) => {
         return (p: PureStatSet | undefined) => {
            if ((field[0] == 'o') || (field[0] == 'd')) {
               return p?.[field]?.value || 0;
            } else {
               return (p?.[`off_${field}`]?.value || 0) - (p?.[`def_${field}`]?.value || 0);
            }
         }
      };

      type CustomTooltipProps = {
         active?: boolean,
         payload?: any,
         label?: string,
       };
       const extractBubbleAttr = (fieldDef: string) => {
         const typeAndField = fieldDef.split(":");
         const fieldType = typeAndField.length > 1 ? typeAndField[0] : "actualResults";
         const field = typeAndField.length > 1 ? typeAndField[1] : typeAndField[0];

         const fieldExtractor = fieldValExtractor(field);
         return (p: GoodBadOkTriple) => {
            const tripleAsMap = p as unknown as Record<string, Record<string, Statistic>>;
            if (fieldType == "delta") {
               return fieldExtractor(p.actualResults) - fieldExtractor(p.ok);
            } else if (fieldType == "deltaHistory") {
               return fieldExtractor(p.actualResults) - fieldExtractor(p.orig);
            } else {
               return fieldExtractor(tripleAsMap[fieldType]);
            }
         };
      };
      const oRtgExtractor = extractBubbleAttr("delta:off_rtg");
      const usageExtractor = extractBubbleAttr("delta:off_usage");
      const possExtractor = extractBubbleAttr("delta:off_team_poss_pct");
      const CustomTooltip: React.FunctionComponent<CustomTooltipProps> = ({ active, payload, label }) => {
         const bOrW = (f: number) => {
            return `${Math.abs(f).toFixed(1)} ${f > 0 ? "better" : "worse"} than expected`;
         };
         if (active) {
           const data = payload?.[0].payload || {};
           const net = data.x + data.y;
           const triple = data.p;
           const deltaORtg = oRtgExtractor(triple);
           const deltaUsage = usageExtractor(triple);
           const deltaMpg = possExtractor(triple);
           return (
             <div className="custom-tooltip" style={{
               background: 'rgba(255, 255, 255, 0.9)',
             }}><small>
               <p className="label"><b>
               {`${triple.actualResults?.key}`}<br/>
               {`${triple.actualResults?.team}`}</b><br/>
               <i>{`${triple.actualResults?.posClass}`}
               {` ${triple.orig?.roster?.height || "?-?"}`}
               </i></p>
               <p className="desc">
                  <span>Net RAPM: <b>{fieldValExtractor("adj_rapm")(data?.p?.actualResults).toFixed(1)}</b> pts/100</span><br/>
                  <span><i>({bOrW(net)})</i></span><br/>
                  <span>Off RAPM: <b>{fieldValExtractor("off_adj_rapm")(data?.p?.actualResults).toFixed(1)}</b> pts/100</span><br/>
                  <span><i>({bOrW(data.x)})</i></span><br/>
                  <span>Def RAPM: <b>{fieldValExtractor("def_adj_rapm")(data?.p?.actualResults).toFixed(1)}</b> pts/100</span><br/>
                  <span><i>({bOrW(data.y)})</i></span><br/>
                  <span>Off Rtg: <b>{fieldValExtractor("off_rtg")(data?.p?.actualResults).toFixed(1)}</b></span><br/>
                  <span><i>({bOrW(deltaORtg)})</i></span><br/>
                  <span>Usage: <b>{(fieldValExtractor("off_usage")(data?.p?.actualResults)*100).toFixed(1)}</b>%</span><br/>
                  <span><i>({bOrW(100*deltaUsage)})</i></span><br/>
                  <span>Mpg: <b>{(fieldValExtractor("off_team_poss_pct")(data?.p?.actualResults)*40).toFixed(1)}</b></span><br/>
                  <span><i>({bOrW(40*deltaMpg)})</i></span><br/><br/>
                  <span><i>(Previous school: {data?.p?.orig.team})</i></span>
               </p>
            </small></div>
           );
         }
         return null;
       };
       
      const extractTitle = (fieldDef: string) => {
         return axisPresets.find(kv => kv[1] == fieldDef)?.[0] || fieldDef;
      };

      const hasCustomFilter = confs.indexOf(ConfSelectorConstants.queryFiltersName) >= 0;
      const specialCases = {
         "P6": Power6Conferences,
         "MM": NonP6Conferences
       } as Record<string, any>;
       const confSet = confs ? new Set(
         _.flatMap((confs || "").split(","), c => specialCases[c] || [ NicknameToConference[c] || c ])
       ) : undefined;


      const dataToFilter = _.flatMap(teamRanks, t => t.players || []);
      const [ filteredData, tmpAvancedFilterError ] = advancedFilterStr ?
         AdvancedFilterUtils.applyFilter(dataToFilter, advancedFilterStr, {
            "x": xAxis,
            "y": yAxis,
            "z": dotSize,
            "color": dotColor,
         }, true) : [ dataToFilter, undefined ];
      setAdvancedFilterError(tmpAvancedFilterError);

      const [ highlightData, tmpHighlightFilterError ] = highlightFilterStr ?
         AdvancedFilterUtils.applyFilter(filteredData, highlightFilterStr, {}, true) : [ undefined, undefined ];
      setHighlightFilterError(tmpHighlightFilterError);

      //TODO:
      // some of the entries seem like nonsense when displaying the JSON in applyFilter, plus entry far left is
      // undefined, wut
   
      const subChart = (_.isEmpty(confs) && !highlightData) ? undefined : _.chain(highlightData || filteredData)
         // .map((p, ii) => {
         //    //Debug:
         //    if (ii < 100) {
         //       console.log(`??? ${JSON.stringify(p)}`);
         //       // console.log(`??? ${p.orig.roster?.year_class} - ${fieldValExtractor("adj_rapm")(p.orig)}`);
         //       // console.log(`??? CONF = ${p.actualResults?.conf} TEAM=${p.actualResults?.team}`);
         //    }
         //    return p;
         // })
         .filter(p => {
            return _.isEmpty(confs) ? true : (
               (confSet?.has(p.actualResults?.conf || "???")|| false) 
               || (hasCustomFilter && ((queryFilters || "").indexOf(`${p.actualResults?.team || ""};`) >= 0))
            );
         })
         .map(p => {
            return {
               x: p.x,
               y: p.y,
               z: p.z,
               label: p.actualResults.code,
               p: p
            };
         }).value();

      //TODO: this was supposed to block hover tooltips for main chart, need to try again
      var inSubChart = new Set(subChart?.map(p => p.p.key) || []);
         
      var minColor = Number.MAX_SAFE_INTEGER;
      var maxColor = -Number.MAX_SAFE_INTEGER;
      const mainChart = _.chain(filteredData)
         .map(p => {
            if ((p.color || 0) < minColor) minColor = p.color || 0;
            if ((p.color || 0) > maxColor) maxColor = p.color || 0;
            return {
               x: p.x,
               y: p.y,
               z: p.z,
               label: p.actualResults.code,
               p: p
            };
         }).value();

      // Labelling logic
      const [ maxLabels, topAndBottom ]: [ number, boolean ] = _.thru(labelStrategy, () => {
         if (labelStrategy == "None") return [ 0, true ];
         else {
            return [
               parseInt(labelStrategy.replace(/^[^0-9]*([0-9]+)$/, "$1")), 
               labelStrategy.indexOf("Bottom") >= 0 
            ];
         }
      });
      const chartToUseForLabels = subChart || mainChart;
      const dataPointsToLabel = (maxLabels > 0) ? _.thru(topAndBottom, () => {
         if (topAndBottom) {
            if (2*maxLabels > _.size(chartToUseForLabels)) {
               return chartToUseForLabels;
            } else {
               return _.take(chartToUseForLabels, maxLabels).concat(
                  _.takeRight(chartToUseForLabels, maxLabels)
               );
            }
         } else {
            return _.take(chartToUseForLabels, maxLabels);
         }
      }) as any[]: undefined;

      // (Some util logic associated with building averages and limits)
      const mutAvgState = {
         avgX: 0, avgY: 0, weightAvgX: 0, weightAvgY: 0,
         varX: 0, varY: 0, weightVarX: 0, weightVarY: 0,
         avgCount: 0, avgWeightX: 0, avgWeightY: 0,
      };
      const xHasNext = xAxis.indexOf("next_") >= 0;
      const yHasNext = yAxis.indexOf("next_") >= 0;
      const updateAvgState = (p: any) => {
         mutAvgState.avgX += p.x || 0;
         mutAvgState.avgY += p.y || 0;
         mutAvgState.varX += (p.x || 0)*(p.x || 0);
         mutAvgState.varY += (p.y || 0)*(p.y || 0);
         const weightX = xHasNext ? (p.p?.actualResults?.off_team_poss_pct?.value || 0) : (p.p?.orig?.off_team_poss_pct?.value || 0);
         const weightY = yHasNext ? (p.p?.actualResults?.off_team_poss_pct?.value || 0) : (p.p?.orig?.off_team_poss_pct?.value || 0);
         mutAvgState.weightAvgX += (p.x || 0)*weightX;
         mutAvgState.weightAvgY += (p.y || 0)*weightY;
         mutAvgState.weightVarX += (p.x || 0)*(p.x || 0)*weightX;
         mutAvgState.weightVarY += (p.y || 0)*(p.y || 0)*weightY;
         mutAvgState.avgWeightX += weightX;
         mutAvgState.avgWeightY += weightY;
         mutAvgState.avgCount += 1;
      };
      const completeAvgState = () => {
         mutAvgState.avgX = mutAvgState.avgX/(mutAvgState.avgCount || 1);
         mutAvgState.avgY = mutAvgState.avgY/(mutAvgState.avgCount || 1);
         const avgX2 = mutAvgState.varX/(mutAvgState.avgCount || 1);
         const avgY2 = mutAvgState.varY/(mutAvgState.avgCount || 1);
         mutAvgState.varX = Math.sqrt(Math.abs(avgX2 - mutAvgState.avgX*mutAvgState.avgX))
         mutAvgState.varY = Math.sqrt(Math.abs(avgY2 - mutAvgState.avgY*mutAvgState.avgY))
         const avgWeightX2 = mutAvgState.weightVarX/(mutAvgState.avgWeightX || 1);
         const avgWeightY2 = mutAvgState.weightVarY/(mutAvgState.avgWeightY || 1);
         mutAvgState.weightAvgX = mutAvgState.weightAvgX/(mutAvgState.avgWeightX || 1);
         mutAvgState.weightAvgY = mutAvgState.weightAvgY/(mutAvgState.avgWeightY || 1);
         mutAvgState.weightVarX = Math.sqrt(Math.abs(avgWeightX2 - mutAvgState.weightAvgX*mutAvgState.weightAvgX));
         mutAvgState.weightVarY = Math.sqrt(Math.abs(avgWeightY2 - mutAvgState.weightAvgY*mutAvgState.weightAvgY));
      };
      if (subChart) {
         subChart.forEach(el => updateAvgState(el));
      } else {
         mainChart.forEach(el => updateAvgState(el));
      }
      //TODO: if the axis are the same except for next/prev then force the domains to be the same
      completeAvgState();    
      const renderAvgState = () => {
         return <p>Average: [({mutAvgState.avgX.toFixed(2)}, {mutAvgState.avgY.toFixed(2)})]&nbsp;
            (std: [{mutAvgState.varX.toFixed(2)}], [{mutAvgState.varY.toFixed(2)}]) //&nbsp;
            Weighted: [({mutAvgState.weightAvgX.toFixed(2)}, {mutAvgState.weightAvgY.toFixed(2)})]&nbsp;
            (std: [{mutAvgState.weightVarX.toFixed(2)}], [{mutAvgState.weightVarY.toFixed(2)}]) //&nbsp;
            sample count=[{mutAvgState.avgCount}]
         </p>;
      };   
      //(end averages and limits)     

      const colorMapPicker = colorMapOptions[dotColorMap] || CbbColors.alwaysDarkGrey;
      const isAutoColorMap = dotColorMap.indexOf("Auto") >= 0;
      const deltaColorInv = 1/((maxColor - minColor) || 1);
      const colorMapTransformer = (n: number) => {
         if (isAutoColorMap) {
            return (n - minColor)*deltaColorInv;
         } else return n;
      };
      return  <div>
         <ResponsiveContainer width={"100%"} height={0.75*height}>
            <ScatterChart>
               <CartesianGrid />
               <XAxis type="number" dataKey="x" domain={["auto", "auto"]}>
                  <Label value={extractTitle(xAxis)} position='top' style={{textAnchor: 'middle'}} />
               </XAxis>
               <YAxis type="number" dataKey="y" domain={["auto", "auto"]}>
                  <Label angle={-90} value={extractTitle(yAxis)} position='insideLeft' style={{textAnchor: 'middle'}} />
               </YAxis>
               <ZAxis type="number" dataKey="z" range={[10, 100]}/>
               <Scatter data={mainChart} fill="green" opacity={subChart ? 0.25 : 1.0}>
                  {mainChart.map((p, index) => {
                     return <Cell key={`cell-${index}`} fill={colorMapPicker(colorMapTransformer(p.p.color))}/>
                  })};
               </Scatter>
               {subChart ? <Scatter data={subChart} fill="green">
                  {subChart.map((p, index) => {
                     return <Cell key={`cell-${index}`} fill={colorMapPicker(colorMapTransformer(p.p.color))}/>
                  })}</Scatter> : null
               };         
               {dataPointsToLabel ? <Scatter data={dataPointsToLabel} fill="green">
                  <LabelList dataKey="label" />
                  {dataPointsToLabel.map((p, index) => {
                     return <Cell key={`cell-${index}`} fill={colorMapPicker(colorMapTransformer(p.p.color))}/>
                  })}</Scatter> : null
               };         
               <RechartTooltip
                  content={(<CustomTooltip />)}
                  wrapperStyle={{ opacity: "0.9", zIndex: 1000 }}
                  allowEscapeViewBox={{x: true, y: false}}
                  itemSorter={(item: any) => item.value}
               />
            </ScatterChart>
         </ResponsiveContainer>
         <i><small>{renderAvgState()}</small></i>
      </div>
      ;
   }, [
      gender, year, confs, dataEvent, queryFilters, rostersPerTeam, height, 
      advancedFilterStr, highlightFilterStr, xAxis, yAxis, dotSize, dotColor, dotColorMap, labelStrategy
   ]);

   // 3] View

   // Advanced filter text

   const editingAdvFilterTooltip = (
      <Tooltip id="editingAdvFilterTooltip">Press enter to apply this Linq filter</Tooltip>
   );
   const doneAdvFilterTooltip = (
      <Tooltip id="doneAdvFilterTooltip">Filter successfully applied</Tooltip>
   );
   const errorAdvFilterTooltip = (
      <Tooltip id="errorAdvFilterTooltip">Malformed Linq query: [{advancedFilterError || ""}]</Tooltip>
   );
   const editingAdvFilterText = <OverlayTrigger placement="auto" overlay={editingAdvFilterTooltip}><div>...</div></OverlayTrigger>;
   const doneAdvFilterText = advancedFilterError ?
      <OverlayTrigger placement="auto" overlay={errorAdvFilterTooltip}><FontAwesomeIcon icon={faExclamation} /></OverlayTrigger> :
      <OverlayTrigger placement="auto" overlay={doneAdvFilterTooltip}><FontAwesomeIcon icon={faCheck} /></OverlayTrigger>;

   /** Sticks an overlay on top of the table if no query has ever been loaded */
   function needToLoadQuery() {
      return !dataEvent.error && (loadingOverride || ((dataEvent?.players || []).length == 0));
   }

   /** Copy to clipboard button */
   const getCopyLinkButton = () => {
      const tooltip = (
      <Tooltip id="copyLinkTooltip">Copies URL to clipboard</Tooltip>
      );
      return <OverlayTrigger placement="auto" overlay={tooltip}>
      <Button className="float-left" id={`copyLink_offSeasonTeamLeaderboard`} variant="outline-secondary" size="sm">
         <FontAwesomeIcon icon={faLink} />
      </Button>
      </OverlayTrigger>;
   };

   function stringToOption(s: string) {
      return { label: s, value: s };
   }

   // Overall presets

   const isOverallPresetSelected = (preset: PlayerSeasonComparisonParams) => {
      return (
         ((advancedFilterPresets.find(t => t[0] == preset.advancedFilter)?.[1] || preset.advancedFilter || "") == advancedFilterStr) &&
         ((advancedFilterPresets.find(t => t[0] == preset.highlightFilter)?.[1] || preset.highlightFilter || "") == highlightFilterStr) &&
         ((axisPresets.find(t => t[0] == preset.xAxis)?.[1] || preset.xAxis || "") == xAxis) &&
         ((axisPresets.find(t => t[0] == preset.yAxis)?.[1] || preset.yAxis || "") == yAxis) &&
         ((axisPresets.find(t => t[0] == preset.dotColor)?.[1] || preset.dotColor || "") == dotColor) &&
         ((axisPresets.find(t => t[0] == preset.dotSize)?.[1] || preset.dotColor || "") == dotSize) &&
         dotColorMap == preset.dotColorMap
      );
   };
   const buildOverallPresetMenuItem = (name: string, preset: PlayerSeasonComparisonParams) => {
      return <GenericTogglingMenuItem
        text={name}
        truthVal={isOverallPresetSelected(preset)}
        onSelect={() => {
           friendlyChange(() => {
            setTitle(preset.title || "");
            setAdvancedFilterStr(advancedFilterPresets.find(t => t[0] == preset.advancedFilter)?.[1] || preset.advancedFilter || "");
            setHighlightFilterStr(advancedFilterPresets.find(t => t[0] == preset.highlightFilter)?.[1] || preset.highlightFilter || "");
            setXAxis(axisPresets.find(t => t[0] == preset.xAxis)?.[1] || preset.xAxis || "");
            setYAxis(axisPresets.find(t => t[0] == preset.yAxis)?.[1] || preset.yAxis || "");
            setDotColor(axisPresets.find(t => t[0] == preset.dotColor)?.[1] || preset.dotColor || "");
            setDotSize(axisPresets.find(t => t[0] == preset.dotSize)?.[1] || preset.dotSize || "");
            setDotColorMap(preset.dotColorMap || "Black");
           }, true);
        }}
      />;
    }
   const getOverallPresets = () => {
      const tooltipForFilterPresets = (
         <Tooltip id="overallFilterPresets">Preset charts</Tooltip>
       );   
      return <Dropdown alignRight>
        <Dropdown.Toggle variant="outline-secondary">
          <OverlayTrigger placement="auto" overlay={tooltipForFilterPresets}><FontAwesomeIcon icon={faList}/></OverlayTrigger>            
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <GenericTogglingMenuItem
            text={<i>Clear selection</i>}
            truthVal={false}
            onSelect={() => {
               friendlyChange(() => {
                  setTitle(""); 
                  setAdvancedFilterStr(""); setHighlightFilterStr("");
                  setXAxis(""); setYAxis("");
                  setDotColor(""); setDotSize("");
               }, true);
            }}
          />
          {overallPresets.map(preset => buildOverallPresetMenuItem(preset[0], preset[1]))}
        </Dropdown.Menu>
      </Dropdown>
   };

   // Color selector

   const ColorMapSingleValue = (props: any) => {
      const label = props.data.label || "Black";
      const labelToRender = label.replace(/[A-Za-z]+[/][A-Za-z]+\s+/, ""); //(remove leading colors)
      const colorMapPicker = colorMapOptions[label] || CbbColors.alwaysDarkGrey;
      const leftColorStr = CbbColors.toRgba(colorMapPicker(-Number.MAX_SAFE_INTEGER), 0.75); 
      const rightColorStr = CbbColors.toRgba(colorMapPicker(Number.MAX_SAFE_INTEGER), 0.75);
      return <components.SingleValue {...props}>
         <div style={{
            textAlign: "center",
            background: (label == "Black") ? undefined : 
               `linear-gradient(to right, ${leftColorStr}, 20%, white, 80%, ${rightColorStr})`,
         }}>
            {labelToRender}
         </div>
      </components.SingleValue>
   };

   // Label strategy

   const labelStrategyTooltip = (
      <Tooltip id="labelStrategyTooltip">Label the top/bottom entries based on a SORT BY clause in either the 'Filter' or 'Highlight' Linq expressions</Tooltip>
   );
   const buildLabelStrategy = (name: string) => {
      return <GenericTogglingMenuItem
        text={name}
        truthVal={name == labelStrategy}
        onSelect={() => {
           friendlyChange(() => {
              setLabelStrategy(name);
           }, true);
        }}
      />;
   }

   return <Container>
      <Form.Row>
         <Col xs={6} sm={6} md={3} lg={2} style={{zIndex: 12}}>
            <Select
               isDisabled={true}
               value={stringToOption("Men")}
               options={["Men"].map(
                  (gender) => stringToOption(gender)
               )}
               isSearchable={false}
               onChange={(option) => { if ((option as any)?.value) {
                  /* currently only support Men */
               }}}
            />
         </Col>
         <Col xs={6} sm={6} md={3} lg={2} style={{zIndex: 11}}>
            <Select
               value={stringToOption(year)}
               options={[stringToOption("2021/22"), stringToOption("2022/23")]}
               isSearchable={false}
               onChange={(option) => { if ((option as any)?.value) {
                  setYear((option as any)?.value);
               }}}
            />
         </Col>
         <Col className="w-100" bsPrefix="d-lg-none d-md-none" />
         <Col xs={12} sm={12} md={5} lg={5} style={{zIndex: 10}}>
            <ConferenceSelector
               emptyLabel={year < DateUtils.yearFromWhichAllMenD1Imported ? `All High Tier Teams` : `All Teams`}
               confStr={confs}
               confMap={dataEvent?.confMap}
               confs={dataEvent?.confs}
               onChangeConf={confStr => friendlyChange(() => setConfs(confStr), confs != confStr)}
            />
         </Col>
         <Form.Group as={Col} xs={1} className="mt-1">
            {getCopyLinkButton()}
         </Form.Group>
         <Form.Group as={Col} xs={6} sm={6} md={6} lg={2} className="mt-2">
          <Form.Check type="switch"
              id="configOptions"
              checked={!showConfigOptions}
              onChange={() => {
                const isCurrentlySet = showConfigOptions;
                setShowConfigOptions(!showConfigOptions)
              }}
              label="Hide Config"
            />
        </Form.Group>
      </Form.Row>
      {hasCustomFilter ? <Form.Row>
         {hasCustomFilter ? <Col xs={12} sm={12} md={8} lg={8}>
            <InputGroup>
               <InputGroup.Prepend>
                  <InputGroup.Text id="filter">Filter:</InputGroup.Text>
               </InputGroup.Prepend>
               <AsyncFormControl
                  startingVal={queryFilters}
                  onChange={(t: string) => {
                     const newStr = t.endsWith(";") ? t : t + ";";
                     friendlyChange(() => setQueryFilters(newStr), newStr != queryFilters);
                  }}
                  timeout={500}
                  placeholder = ";-separated list of teams"
               />
            </InputGroup>
         </Col> : null}
      </Form.Row> : null}
      <Form.Row>
         <Form.Group as={Col} xs="12">
            <InputGroup>
               <InputGroup.Prepend>
                  <InputGroup.Text id="filter">Chart Title</InputGroup.Text>
               </InputGroup.Prepend>
               <AsyncFormControl
                  startingVal={title}
                  onChange={(newStr: string) => {
                     if (newStr != title) setTitle(newStr);
                  }}
                  timeout={500}
                  placeholder = "Enter a title for this chart or select a preset"
               />
               <InputGroup.Append>
                  {getOverallPresets()}
               </InputGroup.Append>
            </InputGroup>
         </Form.Group>
      </Form.Row>
      { showConfigOptions ? <Form.Row className="mb-2">
        <Col xs={12} sm={12} md={12} lg={12}>
            <LinqExpressionBuilder
               label="Filter"
               prompt="Enter Linq: remove unselected players (see presets for ideas)"
               value={advancedFilterStr}
               error={advancedFilterError}
               autocomplete={AdvancedFilterUtils.playerSeasonComparisonAutocomplete}
               presets={advancedFilterPresets}
               callback={(newVal: string) => friendlyChange(() => setAdvancedFilterStr(newVal), true)}
            />
        </Col>
      </Form.Row> : null }
      { showConfigOptions ? <Form.Row className="mb-2">
        <Col xs={11} sm={11} md={11} lg={11}>
           <LinqExpressionBuilder
               label="Highlight"
               prompt="Enter Linq: unselected players are faded into the background"
               value={highlightFilterStr}
               error={highlightFilterError}
               autocomplete={AdvancedFilterUtils.playerSeasonComparisonAutocomplete}
               presets={advancedFilterPresets}
               callback={(newVal: string) => friendlyChange(() => setHighlightFilterStr(newVal), true)}
           />
         </Col>
         <Col xs={1} sm={1} md={1} lg={1}>
            <Dropdown alignRight style={{maxHeight: "2.4rem"}}>
               <Dropdown.Toggle variant="outline-secondary">
                  <OverlayTrigger placement="auto" overlay={labelStrategyTooltip}><FontAwesomeIcon icon={faTags}/></OverlayTrigger>            
               </Dropdown.Toggle>
               <Dropdown.Menu>
                  {["None", "Top 5", "Top 10", "Top 25", "Top/Bottom 5", "Top/Bottom 10", "Top/Bottom 25"].map(buildLabelStrategy)}
               </Dropdown.Menu>
            </Dropdown>
         </Col>
      </Form.Row> : null }
      { showConfigOptions ? <Form.Row className="mb-2">
        <Col xs={12} sm={12} md={6} lg={6}>
            <LinqExpressionBuilder
               label="X-Axis"
               prompt="Linq expression for 'x' (see presets for ideas)"
               value={xAxis}
               error={advancedFilterError}
               autocomplete={AdvancedFilterUtils.playerSeasonComparisonAutocomplete}
               presets={axisPresets}
               presetsIcon={faList}
               callback={(newVal: string) => friendlyChange(() => setXAxis(newVal), true)}
            />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
            <LinqExpressionBuilder
               label="Y-Axis"
               prompt="Linq expression for 'y' (see presets for ideas)"
               value={yAxis}
               error={advancedFilterError}
               autocomplete={AdvancedFilterUtils.playerSeasonComparisonAutocomplete}
               presets={axisPresets}
               presetsIcon={faList}
               callback={(newVal: string) => friendlyChange(() => setYAxis(newVal), true)}
            />
        </Col>
      </Form.Row> : null }
      { showConfigOptions ? <Form.Row className="mb-2">
         <Col xs={6} sm={6} md={5} lg={5}>
            <LinqExpressionBuilder
               label="Color"
               prompt="Linq expression for color (see presets for ideas)"
               value={dotColor}
               error={advancedFilterError}
               autocomplete={AdvancedFilterUtils.playerSeasonComparisonAutocomplete}
               presets={axisPresets}
               presetsIcon={faList}
               callback={(newVal: string) => friendlyChange(() => setDotColor(newVal), true)}
            />
        </Col>
        <Col xs={6} sm={6} md={2} lg={2}>
           <Select
               value={stringToOption(dotColorMap)}
               options={_.keys(colorMapOptions).map(
                  (colorMap) => stringToOption(colorMap)
               )}
               components={
                  //@ts-ignore
                  {SingleValue: ColorMapSingleValue}
               }
               styles={{
                  singleValue: (provided, __) => ({
                     ...provided,
                     width: "100%",                     
                  })
               }}
               isSearchable={false}
               onChange={(option) => { 
                  const newColorMap = (option as any)?.value || "Black";
                  friendlyChange(() => {
                     setDotColorMap(newColorMap);
                  }, newColorMap != dotColorMap);
               }}
            />
        </Col>
        <Col xs={12} sm={12} md={5} lg={5}>
            <LinqExpressionBuilder
               label="Size"
               prompt="Linq expression for size (see presets for ideas)"
               value={dotSize}
               error={advancedFilterError}
               autocomplete={AdvancedFilterUtils.playerSeasonComparisonAutocomplete}
               presets={axisPresets}
               presetsIcon={faList}
               callback={(newVal: string) => friendlyChange(() => setDotSize(newVal), true)}
            />
        </Col>
      </Form.Row> : null }      
      <Row>
         <Col>
            <LoadingOverlay
               active={needToLoadQuery()}
               spinner
               text={"Loading Player Comparison Chart..."}
            >
               {chart}
            </LoadingOverlay>
         </Col>
      </Row>
   </Container>;
 }
 export default PlayerSeasonComparisonChart;
