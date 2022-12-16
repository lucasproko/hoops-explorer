// React imports:
import React, { useState, useEffect } from 'react';

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
import Select from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faPen, faEye } from '@fortawesome/free-solid-svg-icons'
import ClipboardJS from 'clipboard';

// Component imports
import GenericTable, { GenericTableOps } from "./GenericTable";
import GenericTogglingMenu from './shared/GenericTogglingMenu';
import GenericTogglingMenuItem from './shared/GenericTogglingMenuItem';
import ConferenceSelector, { ConfSelectorConstants } from './shared/ConferenceSelector';

// Table building
// Util imports
import { TeamEditorParams, PlayerSeasonComparisonParams, ParamDefaults } from '../utils/FilterModels';

import { Statistic, RosterEntry } from '../utils/StatModels';
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import { GradeUtils } from '../utils/stats/GradeUtils';
import { UrlRouting } from '../utils/UrlRouting';
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import TeamEditorTable, { TeamEditorStatsModel } from './TeamEditorTable';
import { DateUtils } from '../utils/DateUtils';
import { InputGroup } from 'react-bootstrap';
import AsyncFormControl from './shared/AsyncFormControl';

// Library imports:
import fetch from 'isomorphic-unfetch';
import { RequestUtils } from '../utils/RequestUtils';
import { OffseasonLeaderboardUtils } from '../utils/stats/OffseasonLeaderboardUtils';

// Recharts imports:
//@ts-ignore
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from 'recharts';
import { GoodBadOkTriple } from '../utils/stats/TeamEditorUtils';

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

   const [year, setYear] = useState(startingState.year || DateUtils.offseasonPredictionYear);
   const yearWithStats = DateUtils.getPrevYear(year);

   const [gender, setGender] = useState("Men"); // TODO ignore input just take Men

   const [queryFilters, setQueryFilters] = useState(startingState.queryFilters || "");

   const [ rostersPerTeam, setRostersPerTeam ] = useState({} as Record<string, Record<string, RosterEntry>>);

   // Chart control
   const [ xAxis, setXAxis ] = useState(startingState.xAxis || ParamDefaults.defaultPlayerComparisonXAxis);
   const [ yAxis, setYAxis ] = useState(startingState.yAxis || ParamDefaults.defaultPlayerComparisonYAxis);
   const [ transfersOnly, setTransdersOnly ] = useState(
      _.isNil(startingState.transfersOnly) ? ParamDefaults.defaultPlayerComparisonTransfersOnly : startingState.transfersOnly
   );
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

         xAxis, yAxis, transfersOnly,
      });
   }, [ confs, year, queryFilters ]);

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
         var newClipboard = new ClipboardJS(`#copyLink_offSeasonTeamLeaderboard`, {
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

      const confFilter = (t: {team: string, conf: string}) => {
         return (confs == "") || (confs.indexOf(t.conf) >= 0) 
            || (((confs.indexOf("P6") >= 0) && confs.indexOf(ConfSelectorConstants.nonHighMajorConfsName) < 0) 
                     && (ConfSelectorConstants.powerSixConfsStr.indexOf(t.conf) >= 0))
            || ((confs.indexOf(ConfSelectorConstants.nonHighMajorConfsName) >= 0) 
                     && (ConfSelectorConstants.powerSixConfsStr.indexOf(t.conf) < 0))
            || (hasCustomFilter && ((startingState.queryFilters || "").indexOf(`${t.team};`) >= 0))
            ;
      }

      //TODO: build data sets

      const extractBubbleAttr = (fieldDef: string) => {
         const typeAndField = fieldDef.split(":");
         const fieldType = typeAndField.length > 1 ? typeAndField[0] : "actualResults";
         const field = typeAndField.length > 1 ? typeAndField[1] : typeAndField[0];

         return (p: GoodBadOkTriple) => {
            const tripleAsMap = p as unknown as Record<string, Record<string, Statistic>>;
            if (fieldType == "delta") {
               return (p.actualResults?.[field]?.value || 0) - (p.ok?.[field]?.value || 0);
            } else if (fieldType == "deltaHistory") {
               return (p.actualResults?.[field]?.value || 0) - (p.prevYear?.[field]?.value || 0);
            } else {
               return tripleAsMap[fieldType]?.[field]?.value || 0;
            }
         };
      };

      const xAxisExtractor = extractBubbleAttr("delta:off_adj_rapm");
      const yAxisExtractor = extractBubbleAttr("delta:def_adj_rapm");

      const mainChart = _.chain(teamRanks)
         .flatMap(t => t.players || []) //TODO filter teams/confs etc
         .filter(p => 
            (p.actualResults || false) && (p.prevYear || false) && (p.actualResults.team != p.prevYear.team)
         )
         .map(p => {
            return {
               x: xAxisExtractor(p),
               y: yAxisExtractor(p),
            }
         }).value();

      //TODO: improve chart

      return  <ResponsiveContainer width={"100%"} height={512}>
         <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" />
            <YAxis type="number" dataKey="y" />
            <Scatter data={mainChart} fill="green" />
         </ScatterChart>
      </ResponsiveContainer>
      ;
   }, [
      gender, year, confs, dataEvent, queryFilters, rostersPerTeam
   ]);

   // 3] View

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

   return <Container>
      <Form.Group as={Row}>
         <Col xs={6} sm={6} md={3} lg={2} style={{zIndex: 12}}>
            <Select
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
               isDisabled={true}
               value={stringToOption(year)}
               options={DateUtils.lboardYearListWithNextYear(tier == "High").map(r => stringToOption(r))}
               isSearchable={false}
               onChange={(option) => { if ((option as any)?.value) {
                  /* currently only support 2022/23 - but lets other years be specified to jump between off-season predictions and previous results */
                  setYear((option as any)?.value);
               }}}
            />
         </Col>
         <Col className="w-100" bsPrefix="d-lg-none d-md-none" />
         <Col xs={12} sm={12} md={6} lg={6} style={{zIndex: 10}}>
            <ConferenceSelector
               emptyLabel={year < DateUtils.yearFromWhichAllMenD1Imported ? `All High Tier Teams` : `All Teams`}
               confStr={confs}
               confMap={dataEvent?.confMap}
               confs={dataEvent?.confs}
               onChangeConf={confStr => friendlyChange(() => setConfs(confStr), confs != confStr)}
            />
         </Col>
         <Col lg={1} className="mt-1">
            {getCopyLinkButton()}
         </Col>
      </Form.Group>
      {hasCustomFilter ? <Form.Group as={Row}>
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
      </Form.Group> : null}       
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
