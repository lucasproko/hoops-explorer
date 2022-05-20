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
import Select, { components } from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faPen, faEye } from '@fortawesome/free-solid-svg-icons'
import ClipboardJS from 'clipboard';

// Component imports
import GenericTable, { GenericTableColProps, GenericTableOps } from "./GenericTable";
import GenericTogglingMenu from './shared/GenericTogglingMenu';
import GenericTogglingMenuItem from './shared/GenericTogglingMenuItem';

// Table building
// Util imports
import { TeamEditorParams, OffseasonLeaderboardParams } from '../utils/FilterModels';
import { GoodBadOkTriple, TeamEditorUtils } from '../utils/stats/TeamEditorUtils';

import { StatModels, IndivStatSet, PureStatSet, DivisionStatistics, Statistic, TeamStatInfo } from '../utils/StatModels';
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import { GradeUtils } from '../utils/stats/GradeUtils';
import { UrlRouting } from '../utils/UrlRouting';
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import TeamEditorTable, { TeamEditorStatsModel } from './TeamEditorTable';
import { ConferenceToNickname, NicknameToConference, Power6ConferencesNicks } from '../utils/public-data/ConferenceInfo';
import { CommonTableDefs } from '../utils/tables/CommonTableDefs';
import { CbbColors } from '../utils/CbbColors';
import { efficiencyInfo } from '../utils/internal-data/efficiencyInfo';
import { LeaderboardUtils } from '../utils/LeaderboardUtils';
import { DateUtils } from '../utils/DateUtils';
import { TeamEditorManualFixes, TeamEditorManualFixModel } from '../utils/stats/TeamEditorManualFixes';
import { InputGroup } from 'react-bootstrap';
import AsyncFormControl from './shared/AsyncFormControl';

const highMajorConfsName = "Power 6 Conferences";
const nonHighMajorConfsName = "Outside The P6";
const queryFiltersName = "Manual Filter";
const powerSixConfsStr = Power6ConferencesNicks.join(",");

type Props = {
   startingState: OffseasonLeaderboardParams,
   dataEvent: TeamEditorStatsModel,
   onChangeState: (newParams: OffseasonLeaderboardParams) => void
}

const OffSeasonLeaderboardTable: React.FunctionComponent<Props> = ({startingState, dataEvent, onChangeState}) => {
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
   const hasCustomFilter = confs.indexOf(queryFiltersName) >= 0;

   const [year, setYear] = useState(startingState.year ? 
      (startingState.evalMode ? startingState.year : DateUtils.getPrevYear(startingState.year))
      : "2021/22"); //TODO ignore input just take 2021/22 (display 2022/23 but it's off-season)
   const [yearRedirect, setYearRedirect] = useState(startingState.year || DateUtils.inSeasonYear); //TODO lets us jump between off-seasons and normal leaderboards
   const [gender, setGender] = useState("Men"); // TODO ignore input just take Men
   const [teamView,  setTeamView] = useState(startingState.teamView || "");

   const [transferInOutMode, setTransferInOutMode] = useState(startingState.transferInOutMode || false);
   const [evalMode, setEvalMode] = useState(startingState.evalMode || false);

   const [sortBy, setSortBy] = useState(startingState.sortBy || "net");
   const [queryFilters, setQueryFilters] = useState(startingState.queryFilters || "");

   /** Converts a list of params to their team's key/value params  */
   const buildOverrides = (inOverrides: Record<string, string>) => {
      return _.transform(inOverrides, (acc, paramIn, key) => {
         const splitKey = key.split("__");
         const inTeam = splitKey[0];
         const inParamKey = splitKey?.[1];
         const param = paramIn?.toString(); //(in case it's boolean)
         if (inParamKey) {
            if (!acc[inTeam]) {
               acc[inTeam] = {};
            }
            // Supported overrides: superSeniorsBack, deletedPlayers, disabledPlayers, addedPlayers, overrides
            if (inParamKey == "deletedPlayers") {
               acc[inTeam]!.deletedPlayers = param;
            } else if (inParamKey == "disabledPlayers") {
               acc[inTeam]!.disabledPlayers = param;
            } else if (inParamKey == "addedPlayers") {
               acc[inTeam]!.addedPlayers = param;
            } else if (inParamKey == "overrides") {
               acc[inTeam]!.overrides = param;
            } else if (inParamKey == "superSeniorsBack") {
               acc[inTeam]!.superSeniorsBack = (param == "true");
            } else if (inParamKey == "diffBasis") {
               acc[inTeam]!.diffBasis = param;
            } else if (inParamKey == "showPrevSeasons") {
               acc[inTeam]!.showPrevSeasons = (param == "true");
            } else if (inParamKey == "alwaysShowBench") {
               acc[inTeam]!.alwaysShowBench = (param == "true");
            } else if (inParamKey == "factorMins") {
               acc[inTeam]!.factorMins = (param == "true");
            }
         }
      }, {} as Record<string, TeamEditorParams>);
   }
   const [ teamOverrides, setTeamOverrides ] = useState(
      buildOverrides(startingState) as Record<string, TeamEditorParams>
   );

   /** When the params change */
   useEffect(() => {
      onChangeState(_.merge({
         year: yearRedirect, teamView: teamView, confs, evalMode: evalMode, transferInOutMode: transferInOutMode,
         sortBy: sortBy,
         queryFilters: queryFilters
      }, _.chain(teamOverrides).flatMap((teamEdit, teamToOver) => {
         return _.map(teamEdit, 
            (teamEditVal, paramKey) => teamEditVal ? [ `${teamToOver}__${paramKey}`, teamEditVal.toString() ] : []
         );
      }).fromPairs().value()));
   }, [ teamView, confs, teamOverrides, yearRedirect, evalMode, transferInOutMode, sortBy, queryFilters ]);

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

   // Conference filter
   function getCurrentConfsOrPlaceholder() {
      return (confs == "") ?
      { label: year < "2020/21" ? `All High Tier Teams` : `All Teams` } :
      confs.split(",").map((conf: string) => stringToOption(NicknameToConference[conf] || conf));
   }

   /** Slightly hacky code to render the conference nick names */
   const ConferenceValueContainer = (props: any) => {
      const oldText = props.children[0];
      const fullConfname = oldText.props.children;
      const newText = {
      ...oldText,
      props: {
         ...oldText.props,
         children: [ConferenceToNickname[fullConfname] || fullConfname]
      }
      }
      const newProps = {
      ...props,
      children: [newText, props.children[1]]
      }
      return <components.MultiValueContainer {...newProps} />
   };

   const confsWithTeams = dataEvent?.confMap ?
      _.toPairs(dataEvent?.confMap || {}).map(kv => {
      const teams = kv[1] || [];
      return _.isEmpty(teams) ? kv[0] : `${kv[0]} [${teams.join(", ")}]`;
      }) : (dataEvent?.confs || []);

   // 2] Processing

   const editTooltip = <Tooltip id="editTooltip">Show/Hide the inline Team Viewer and Editor </Tooltip>;

   const table = React.useMemo(() => {
      setLoadingOverride(false);

      const avgEff = efficiencyAverages[`${gender}_${year}`] || efficiencyAverages.fallback;
         
      // Come up with a superset of which players might be on which teams, for performance reasons
      const playerPartition = _.transform(dataEvent.players || [], (acc, p) => {
         const teams = [ (p.team || "") ].concat(
            _.flatMap(dataEvent.transfers || [], txfers => {
               return ((txfers || {})[p.code || ""] || [])
                  .flatMap(txfer => txfer.t ? [ txfer.t, txfer.f ] : [ txfer.f ]);
            })      
         ).concat( // Add all players that might be added to this team
            _.flatMap(teamOverrides,
               (teamEdit, teamName) => ((teamEdit.addedPlayers || "").indexOf((p.code || "") + ":") >= 0) ? [ teamName ] : []
            )
         );
         teams.forEach(team => {
            if (!acc[team]) {
               acc[team] = [];
            }
            acc[team]!.push(p);
         })
      }, {} as Record<string, IndivStatSet[]>);

      const nextSeasonForEvalMode = DateUtils.getNextYear(year);
      const teamStatsPartition = _.transform(dataEvent.teamStats || [], (acc, t) => {         
         if (t.year == year) {
            acc.projYear[t.team_name] = t;
         } else if (t.year == nextSeasonForEvalMode) {
            acc.actualYear[t.team_name] = t;
         }
      }, { projYear: {} as Record<string, TeamStatInfo>, actualYear: {} as Record<string, TeamStatInfo> });

      // Come up with a superset of which (RSish) freshmen might be on which teams, for performance reasons
      const genderPrevSeason = `${gender}_${DateUtils.getPrevYear(year)}`; //(For fr)
      const frPartition = _.transform(
         TeamEditorManualFixes.getFreshmenForYear(genderPrevSeason), (acc, frPerTeam, teamKey) => {
            // To be quick just include the entire overrides object if any transfer matches
            const inject = (teamKeyIn: string, toInject: TeamEditorManualFixModel) => {
               if (!acc[teamKeyIn]) {
                  acc[teamKeyIn] = {};
               }
               acc[teamKeyIn]![teamKey] = toInject;
            };
            // Always inject a team's Fr for that team:
            inject(teamKey, frPerTeam);
            const transferringTeams = _.chain(frPerTeam.overrides || {}).keys()
                  .flatMap(code => dataEvent.transfers?.[0]?.[code] || [])
                     .flatMap(p => (p.t && (p.t != "NBA")) ? [p.t] : []).value();

            transferringTeams.forEach(teamKeyIn => {
               inject(teamKeyIn, frPerTeam);
            });

         }, {} as Record<string, Record<string, TeamEditorManualFixModel>>
      );

      // Get a list of teams
      const teamList = _.flatMap(AvailableTeams.byName, (teams, teamName) => {
         const maybeTeam = teams.find(t => (t.year == year) && (t.gender == gender));
         return maybeTeam ? [ maybeTeam.team ] : []
      });
      const numTeams = _.size(teamList);

      // For each team, do the big off-season calcs:

      const mutableDivisionStats: DivisionStatistics = { 
         tier_sample_size: 0,
         dedup_sample_size: 0,
         tier_samples: {},
         tier_lut: {},
         dedup_samples: {}
        };

      const teamRanks = _.chain(teamList).map(t => {

         const maybeOverride = teamOverrides[t] || {};

         const addedPlayers = maybeOverride.addedPlayers ? TeamEditorUtils.fillInAddedPlayers(
            t, year,
            maybeOverride.addedPlayers || "", playerPartition[t] || [], dataEvent.transfers?.[1] || {},
            false, maybeOverride.superSeniorsBack || false
         ) : {};
         const overrides = maybeOverride.overrides ? TeamEditorUtils.urlParamstoPlayerEditModels(maybeOverride.overrides) : {};
         const disabledPlayers = _.chain((maybeOverride.disabledPlayers || "").split(";")).map(p => [ p, true ]).fromPairs().value();
         const deletedPlayers = _.chain((maybeOverride.deletedPlayers || "").split(";")).map(p => [ p, "unknown" ]).fromPairs().value();
 
         const pxResults = TeamEditorUtils.teamBuildingPipeline(
            gender, t, year,
            playerPartition[t] || [], teamStatsPartition.projYear[t]?.stats, dataEvent.transfers || [],
            true, evalMode || false,
            addedPlayers, overrides, deletedPlayers, disabledPlayers,
            maybeOverride.superSeniorsBack || false, false,
            avgEff, frPartition[t] || {}
         );
         const filteredPlayerSet = TeamEditorUtils.getFilteredPlayersWithBench(pxResults, disabledPlayers);
         
         const buildTotals = (triples: GoodBadOkTriple[], range: "good" | "bad" | "ok" | "orig", depthBonus: {off: number, def: number}, adj: number = 0) => {
            const { off, def, net } = TeamEditorUtils.buildTotals(triples, range, depthBonus, adj);

            const netInfo = _.transform(triples, (acc, triple) => { 
               const netEff = TeamEditorUtils.getNet(triple.ok || {});
               if (netEff >= 6.5) {
                  acc.numSuperstars = acc.numSuperstars + 1;
               } else if (netEff >= 5) {
                  acc.numStars = acc.numStars + 1;
               } else if (netEff >= 3.5) {
                  acc.numStarters = acc.numStarters + 1;
               } else if (netEff >= 2) {
                  acc.numRotation = acc.numRotation + 1;
               }

            }, { numSuperstars: 0, numStars: 0, numStarters: 0, numRotation: 0});
            return { off, def, net, ...netInfo };
         };
         const depthBonus = TeamEditorUtils.calcDepthBonus(filteredPlayerSet, t);

         //Depth diag:
         // if ((depthBonus.off > 0) || (depthBonus.def < 0)) {
         //    console.log(`Team depth bonus: [${t}], off=[${depthBonus.off.toFixed(2)}] def=[${depthBonus.def.toFixed(2)}] net=[${(depthBonus.off-depthBonus.def).toFixed(2)}]`);
         // }

         const okTotals = buildTotals(filteredPlayerSet, "ok", depthBonus);
         const goodNet = _.sumBy(filteredPlayerSet, triple => {
            return (triple.good.off_team_poss_pct.value || 0)*TeamEditorUtils.getNet(triple.good);
         });
         const badNet = _.sumBy(filteredPlayerSet, triple => {
            return (triple.bad.off_team_poss_pct.value || 0)*TeamEditorUtils.getNet(triple.bad);
         });
         const stdDevFactor = 1.0/Math.sqrt(5); //(1 std dev, so divide by root of team size)
         const goodDeltaNet = (goodNet - okTotals.net)*stdDevFactor;
         const badDeltaNet = (badNet - okTotals.net)*stdDevFactor;
   
         const confStr = efficiencyInfo[`${gender}_Latest`]?.[0]?.[t]?.conf || "???";

         GradeUtils.buildAndInjectDivisionStats(
            { off_adj_ppp: { value: okTotals.off + avgEff }, def_adj_ppp: { value: okTotals.def + avgEff }, off_net: { value: okTotals.net } },
            {}, mutableDivisionStats, true, [ "off_adj_ppp", "def_adj_ppp", "off_net" ]
         );

         // Eval mode:
         //(we try to use the actual team totals from the team stats page, though have a legacy fallback just because the code was there)
         const totalActualMins = evalMode ? _.sumBy(pxResults.actualResultsForReview, p => p.orig.off_team_poss_pct.value!)*0.2 : undefined;
         const finalActualEffAdj = totalActualMins ? 
           5.0*Math.max(0, 1.0 - totalActualMins)*TeamEditorUtils.getBenchLevelScoring(t, year) : 0;

         const actualTotalsFromTeam = evalMode ? teamStatsPartition.actualYear[t] : undefined;

         const getLuckAdjOrRaw = (s: Statistic | undefined) => (_.isNil(s?.old_value) ? s?.value : s?.old_value) || avgEff;
         const dummyTeamActualFromTeamNoLuck = actualTotalsFromTeam ? {
           off_net: { 
             value: getLuckAdjOrRaw(actualTotalsFromTeam.stats.off_adj_ppp) - getLuckAdjOrRaw(actualTotalsFromTeam.stats.def_adj_ppp) 
           }, 
           off_adj_ppp: { value: getLuckAdjOrRaw(actualTotalsFromTeam.stats.off_adj_ppp) },
           def_adj_ppp: { value: getLuckAdjOrRaw(actualTotalsFromTeam.stats.def_adj_ppp) },
         } : undefined;
     
         const actualTotalsFromPlayers = evalMode && !actualTotalsFromTeam ? 
           TeamEditorUtils.buildTotals(pxResults.actualResultsForReview, "orig", depthBonus, finalActualEffAdj) : undefined;
         const dummyTeamActualFromPlayers = actualTotalsFromPlayers ? {
           off_net: { value: actualTotalsFromPlayers.net },
           off_adj_ppp: { value: actualTotalsFromPlayers.off + avgEff },
           def_adj_ppp: { value: actualTotalsFromPlayers.def + avgEff },
         } : undefined;
         const dummyTeamActual = dummyTeamActualFromTeamNoLuck || dummyTeamActualFromPlayers;
         //(end Eval mode)

         return { ...okTotals, 
            goodNet: okTotals.net + goodDeltaNet, badNet: okTotals.net + badDeltaNet,
            actualNet: dummyTeamActual?.off_net?.value, //TODO: off and def also
            team: t, 
            conf: ConferenceToNickname[confStr] || "???", 
            rosterInfo: `${okTotals.numSuperstars} / ${okTotals.numStars} / ${okTotals.numStarters} / ${okTotals.numRotation}`,
            // Some transfer diags
            in_off: pxResults.in_off, in_def: pxResults.in_def, out_off: pxResults.out_off, out_def: pxResults.out_def, 
            nba_off: pxResults.nba_off, nba_def: pxResults.nba_def, sr_off: pxResults.sr_off, sr_def: pxResults.sr_def, 
            dev_off: pxResults.dev_off, dev_def: pxResults.dev_def, fr_net: pxResults.fr_net
         };
      }).sortBy(t => {
         // For net transfer purposes, cap the benefit you can get from losing players
         const transferIn = (t.in_off - t.in_def);
         const benefitCap = t.net > 0 ? (0.33*t.net) : t.net; //(1/3 transfer, 1/3 dev, 1/3 Fr)
         const transferInOutMargin = (t.in_off - t.in_def) - Math.max((t.out_off - t.out_def), -benefitCap);
         const seniorOut = Math.max((t.sr_off - t.sr_def), -benefitCap);

         const totalInOutMargin = t.fr_net + transferInOutMargin - (t.nba_off - t.nba_def) - seniorOut;
         switch(sortBy) {
            case "offseason_net":
               return -totalInOutMargin - (t.dev_off - t.dev_def);
            case "dev_in":
               return -(t.dev_off - t.dev_def);
            case "total_io":
               return -totalInOutMargin;
            case "txfer_in":
               return -transferIn;
            case "txfer_out":
               return -(t.out_off - t.out_def);
            case "txfer_io":
               return -transferInOutMargin;               
            case "nba_out":
               return -(t.nba_off - t.nba_def);
            case "sr_out":
               return -seniorOut;
            default: 
               return -t.net;
         }
      }).value();

      // Lookups
      const offEffToRankMap = _.chain(teamRanks).sortBy(t => -t.off).map((t, rank) => [t.off, rank]).fromPairs().value();
      const defEffToRankMap = _.chain(teamRanks).sortBy(t =>t.def).map((t, rank) => [t.def, rank]).fromPairs().value();
      const netEffToRankMap = (confs || (sortBy != "net")) ? _.chain(teamRanks).sortBy(t => -t.net).map((t, rank) => [t.net, rank]).fromPairs().value() : {};
      const actualNetEffToRankMap = evalMode ? 
         _.chain(teamRanks).sortBy(t => -(t.actualNet || 0)).map((t, rank) => [t.actualNet || 0, rank]).fromPairs().value() : undefined;

      GradeUtils.buildAndInjectDivisionStatsLUT(mutableDivisionStats);

      const tableDefs = _.omit({
         title: GenericTableOps.addTitle("", "", CommonTableDefs.rowSpanCalculator, "small", GenericTableOps.htmlFormatter, 10),
         "conf": GenericTableOps.addDataCol("Conf", "The team's conference", GenericTableOps.defaultColorPicker, GenericTableOps.htmlFormatter),
         "sep0": GenericTableOps.addColSeparator(),

         net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 team, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
         net_grade: GenericTableOps.addDataCol("Rank", 
            "Net Adjusted Pts/100 ranking, for 'Balanced' projections",
            CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
         actual_grade: GenericTableOps.addDataCol("Act.", 
            "Ranking based on the team's actual Net Adjusted Pts/100 above an average D1 team",
            CbbColors.varPicker(CbbColors.net_guess), GenericTableOps.gradeOrHtmlFormatter),

         // Txfer in/out
         "sepInOut1": GenericTableOps.addColSeparator(),
         dev_margin: GenericTableOps.addDataCol(
            "Dev", "For efficiency margin, expected increase in production from returning players",
            CbbColors.picker(...CbbColors.diff10_p100_greenRed), GenericTableOps.pointsOrHtmlFormatter
         ),
         inout_margin: GenericTableOps.addDataCol(
            "I-O", "For efficiency margin, in-from-transfers minus out-from-transfers/NBA/Sr (using projected production for 'in')",
            CbbColors.picker(...CbbColors.diff35_p100_greenRed), GenericTableOps.pointsOrHtmlFormatter
         ),
         "sepInOut1.5": GenericTableOps.addColSeparator(0.25),
         in_margin: GenericTableOps.addDataCol(
            "TxIn", "For efficiency margin, projected production from incoming transfers",
            CbbColors.picker(...CbbColors.diff10_p100_greenRed), GenericTableOps.pointsOrHtmlFormatter
         ),
         out_margin: GenericTableOps.addDataCol(
            "TxOut", "For efficiency margin, lost production from last season due to transfers",
            CbbColors.picker(...CbbColors.diff10_p100_redGreen), GenericTableOps.pointsOrHtmlFormatter
         ),
         "sepInOut1.6": GenericTableOps.addColSeparator(0.25),
         fr_margin: GenericTableOps.addDataCol(
            "FrIn", "For efficiency margin, projected production from Freshmen",
            CbbColors.picker(...CbbColors.diff10_p100_greenRed), GenericTableOps.pointsOrHtmlFormatter
         ),
         nba_margin: GenericTableOps.addDataCol(
            "NBA", "For efficiency margin, lost production from last season due to early NBA departures",
            CbbColors.picker(...CbbColors.diff10_p100_redGreen), GenericTableOps.pointsOrHtmlFormatter
         ),
         sr_margin: GenericTableOps.addDataCol(
            "SrOut", "For efficiency margin, lost production from last season due to graduation",
            CbbColors.picker(...CbbColors.diff35_p100_redGreen), GenericTableOps.pointsOrHtmlFormatter
         ),

         "sep1": GenericTableOps.addColSeparator(),

         off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 team, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_pp100)),
         off_grade: GenericTableOps.addDataCol(
            "Rank", "Offensive Adjusted Pts/100 ranking, for 'Balanced' projections", 
            CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),

         "sep2": GenericTableOps.addColSeparator(),

         def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 team, for 'Balanced' projections", CbbColors.varPicker(CbbColors.def_pp100)),
         def_grade: GenericTableOps.addDataCol(
            "Rank", "Defensive Adjusted Pts/100 ranking, for 'Balanced' projections", 
            CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),

         "sep3": GenericTableOps.addColSeparator(),

         high_grade: GenericTableOps.addDataCol(
            "Good", "Optimistic net ranking", 
            CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
         low_grade: GenericTableOps.addDataCol(
            "Bad", "Pessimistic net ranking", 
            CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   
         "sep4": GenericTableOps.addColSeparator(),

         roster: GenericTableOps.addDataCol("Roster", "Projected of (high major) Superstars / Stars / Starters / Rotation players on the team", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),

         "sep5": GenericTableOps.addColSeparator(),

         edit: GenericTableOps.addDataCol("", "Edit the team projections", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
      }, ([] as string[]).concat(
            evalMode ? [] : [ "actual_grade" ]
         ).concat(
            transferInOutMode ? [ "high_grade", "low_grade" ] : [
               "sepInOut1", "dev_margin", "inout_margin", "sepInOut1.5", "sepInOut1.6", "in_margin", "out_margin", "nba_margin", "fr_margin", "sr_margin"
            ]
         )
      ) as Record<string, GenericTableColProps>;

      const confFilter = (t: {team: string, conf: string}) => {
         return (confs == "") || (confs.indexOf(t.conf) >= 0) 
            || (((confs.indexOf("P6") >= 0) && confs.indexOf(nonHighMajorConfsName) < 0) && (powerSixConfsStr.indexOf(t.conf) >= 0))
            || ((confs.indexOf(nonHighMajorConfsName) >= 0) && (powerSixConfsStr.indexOf(t.conf) < 0))
            || (hasCustomFilter && ((startingState.queryFilters || "").indexOf(`${t.team};`) >= 0))
            ;
      }
      
      const tableRows = _.chain(teamRanks).filter(confFilter).take(75).flatMap((t, netRankIn) => {

         const nonStdSort = sortBy && (sortBy != "net") && transferInOutMode;

         const goodNet = GradeUtils.buildTeamPercentiles(mutableDivisionStats, { off_net: { value: t.goodNet } }, [ "net" ], true);
         const badNet = GradeUtils.buildTeamPercentiles(mutableDivisionStats, { off_net: { value: t.badNet } }, [ "net" ], true);

         const teamParams = {
            year, gender, team: t.team,
            evalMode: evalMode,
            ...(teamOverrides[t.team] || {})
         };

         const maybeOverriddenEl = _.isEmpty(teamOverrides[t.team] || {}) ? null : <span> (*)</span>

         const teamTooltip = (
            <Tooltip id={`teamTooltip${netRankIn}`}>
               {maybeOverriddenEl ? <span>(Team has edits, click on View icon to right to see them)<br/><br/></span> : null}
               Open new tab with the detailed off-season predictions for this team{maybeOverriddenEl ? <span> (with these edits)</span> : null}</Tooltip>
          );
         const teamLink = <OverlayTrigger placement="auto" overlay={teamTooltip}>
            <b><a target="_blank" href={UrlRouting.getTeamEditorUrl(teamParams)}>{t.team}</a>{maybeOverriddenEl}</b>
         </OverlayTrigger>;
             
         const netRank = (nonStdSort || confs) ? netEffToRankMap[t.net]! : netRankIn;

         // Eval mode:         
         // (make the format like we'd called buildTeamPercentiles)
         const actualNetRankObj = actualNetEffToRankMap ? 
            { off_net: { value: 1.0 - (actualNetEffToRankMap[t.actualNet || 0]!)/(numTeams || 1), samples: numTeams } }: undefined;
         // example of calling buildTeamPercentils
         //const actualNetRank = GradeUtils.buildTeamPercentiles(mutableDivisionStats, { off_net: { value: t.actualNet || 0 } }, [ "net" ], true);
         const toIntRank = (val: Statistic) => {
            const pcile = val.value || 0;
            const rank = 1 + Math.round((1 - pcile)*numTeams); //(+1, since 100% is rank==1)
            return rank;
         };
         const actualNetRank = actualNetRankObj ? toIntRank(actualNetRankObj?.off_net) : 0;
         const goodNetRank = actualNetRankObj ? toIntRank(goodNet.off_net) : 0;
         const badNetRank = actualNetRankObj ? toIntRank(badNet.off_net) : 0;
         const evalStdDev = (actualNetRank < netRank) ? (netRank - goodNetRank) : (badNetRank - netRank);
         const deltaProjRank = Math.abs(netRank - actualNetRank)/(evalStdDev || 1);
         //end Eval mode

         const pickSubHeaderMessage = (rank: number) => {
            if (rank == 0) {
               return "Top 25 + 1";
            } else if (rank == 26) {
               return "Solid NCAAT teams";
            } else if (rank == 35) {
               return "The Bubble";
            } else if (rank == 55) {
               return "Autobids / AD on Selection Committee / Maybe Next Year";
            } else {
               return "";
            }
         };
         const yearOnYearDetails = GenericTableOps.buildSubHeaderRow([
            [ <div/>, 5 ], [ <i>Net Yr-on-Yr</i>, 4 ], [ <i>Yr-on-Yr gain/loss details</i> , 6 ]
         ], "small text-center");

         const subHeaderMessage = pickSubHeaderMessage(netRank);
         const subHeaderRows = (nonStdSort || confs || !subHeaderMessage) ? 
            (((netRankIn == 0) && transferInOutMode) ? [ yearOnYearDetails ] : [])
         : ([
            GenericTableOps.buildSubHeaderRow([
               [ <div/>, 4 ], [ <i>{subHeaderMessage}</i>, transferInOutMode ? 11 : 9 ]
            ], "small text-center") 
         ].concat(
            (netRank == 0) ? (transferInOutMode ? [ yearOnYearDetails ] : [])
            : (
            [ GenericTableOps.buildHeaderRepeatRow({}, "small") ]
               .concat(transferInOutMode ? [ yearOnYearDetails ] : [])
            )
         ));
         const totalInOutMargin = t.fr_net + (t.in_off - t.in_def ) - (t.out_off - t.out_def) - (t.nba_off - t.nba_def) - (t.sr_off - t.sr_def);
         return subHeaderRows.concat([ GenericTableOps.buildDataRow({
               title: <span>{(nonStdSort || confs) ? <sup><small>{1 + netRankIn}</small>&nbsp;</sup> : null}{teamLink}</span>,
               conf: <small>{t.conf}</small>,

               net: { value: t.net },
               net_grade: { samples: numTeams, value: (1.0*(numTeams - netRank))/numTeams },
               actual_grade: 
                  _.isNil(actualNetRankObj?.off_net) ? undefined : { 
                     ...(actualNetRankObj?.off_net),
                     colorOverride: deltaProjRank
                  }
               ,
               off: { value: avgEff + t.off },
               off_grade: { samples: numTeams, value: (1.0*(numTeams - offEffToRankMap[t.off]!))/numTeams },
               def: { value: avgEff + t.def },
               def_grade: { samples: numTeams, value: (1.0*(numTeams - defEffToRankMap[t.def]!))/numTeams },

               high_grade: goodNet.off_net,
               low_grade: badNet.off_net,

               dev_margin: { value: t.dev_off - t.dev_def },
               inout_margin: { value: totalInOutMargin },
               fr_margin: { value: t.fr_net },
               in_margin: { value: t.in_off - t.in_def },
               out_margin: { value: t.out_off - t.out_def },
               nba_margin: { value: t.nba_off - t.nba_def },
               sr_margin: { value: t.sr_off - t.sr_def },

               roster: <span style={{whiteSpace: "nowrap"}}><small>{t.rosterInfo}</small></span>,
               edit: <OverlayTrigger overlay={editTooltip} placement="auto">
                  <Button variant={(t.team == teamView) ? "secondary" : "outline-secondary"} size="sm" onClick={(ev: any) => {
                     friendlyChange(() => {
                        if (teamView == t.team) {
                           setTeamView("");
                        } else {
                           setTeamView(t.team);
                        }
                     }, true);
               }}><FontAwesomeIcon icon={faEye} /></Button></OverlayTrigger>,
            }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
         ]).concat((teamView == t.team) ? [
            GenericTableOps.buildTextRow(
               <TeamEditorTable
                  startingState={{
                     team: teamView, gender, year,
                     evalMode: evalMode,
                     ...(teamOverrides[teamView] || {})
                  }}
                  dataEvent={dataEvent}
                  onChangeState={(newState) => {
                     const newOverrides = _.cloneDeep(teamOverrides);
                     if (_.isEmpty(newState)) {
                        delete newOverrides[teamView];
                     } else {
                        newOverrides[teamView] = newState;
                     }
                     friendlyChange(() => {
                        setTeamOverrides(newOverrides);
                     }, true);
                  }}
                  overrideGrades={mutableDivisionStats}
               />
            )
         ] : []);
      }).value();

      return <GenericTable       
         tableCopyId="teamTable"
         tableFields={tableDefs}
         tableData={tableRows}
         cellTooltipMode={undefined}
      />;
   }, [
      gender, year, confs, teamView, dataEvent, teamOverrides, transferInOutMode, evalMode, sortBy, queryFilters
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
   const sortByOptions: Record<string, { label: string, value: string}> = {
      net: { label: "Net Rating", value: "net" },  
      offseason_net: { label: "Total offseason net", value: "offseason_net" },
      total_io: { label: "Total in - out", value: "total_io" },
      txfer_io: { label: "Transfer in - out", value: "txfer_io" },
      txfer_in: { label: "Transfers in", value: "txfer_in" },
      txfer_out: { label: "Transfers out", value: "txfer_out" },
      dev_in: { label: "Returning improvement", value: "dev_in" },
      nba_out: { label: "Declared", value: "nba_out" },
      sr_out: { label: "Aged out", value: "sr_out" },
   };
  
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
               isDisabled={evalMode || transferInOutMode}
               value={stringToOption((evalMode || transferInOutMode) ? DateUtils.getNextYear(year) : "2022/23")}
               options={DateUtils.lboardYearListWithNextYear(tier == "High").map(r => stringToOption(r))}
               isSearchable={false}
               onChange={(option) => { if ((option as any)?.value) {
                  /* currently only support 2022/23 - but lets other years be specified to jump between off-season predictions and previous results */
                  setYearRedirect((option as any)?.value);
               }}}
            />
         </Col>
         <Col className="w-100" bsPrefix="d-lg-none d-md-none" />
         <Col xs={12} sm={12} md={6} lg={6} style={{zIndex: 10}}>
            <Select
               isClearable={true}
               styles={{ menu: base => ({ ...base, zIndex: 1000 }) }}
               isMulti
               components={{ MultiValueContainer: ConferenceValueContainer }}
               value={getCurrentConfsOrPlaceholder()}
               options={([highMajorConfsName, nonHighMajorConfsName, queryFiltersName]).concat(_.sortBy(confsWithTeams))
                  .map(r => stringToOption(r))
               }
               onChange={(optionsIn) => {
                  const options = optionsIn as Array<any>;
                  const selection = (options || [])
                     .map(option => ((option as any)?.value || "").replace(/ *\[.*\]/, ""));
                  const confStr = selection.filter((t: string) => t != "").map((c: string) => ConferenceToNickname[c] || c).join(",")
                  friendlyChange(() => setConfs(confStr), confs != confStr);
               }}
            />
         </Col>
         <Col lg={1} className="mt-1">
            {getCopyLinkButton()}
         </Col>
         <Col lg={1} className="mt-1">
            <GenericTogglingMenu>
               <GenericTogglingMenuItem
                  text={"Show breakdown of team's offseason metrics"}
                  truthVal={transferInOutMode}
                  disabled={evalMode}
                  onSelect={() => friendlyChange(() => setTransferInOutMode(!transferInOutMode), !evalMode)}
                  />
               <GenericTogglingMenuItem
                  text={"Review mode"}
                  truthVal={evalMode}
                  disabled={transferInOutMode}
                  onSelect={() => friendlyChange(() => {
                     if (evalMode) { // Switching off, go back to current year
                        setYearRedirect(DateUtils.inSeasonYear);
                        setYear(DateUtils.getPrevYear(DateUtils.inSeasonYear));
                        setEvalMode(false);  //(do this last so don't run into "redirect to in-season rankings")
                     } else { //Switching on, 20/21 *offseason* is the only season we support
                        setEvalMode(true); //(do this first so don't run into "redirect to in-season rankings")
                        const onlySeasonSupported = DateUtils.getPrevYear(DateUtils.offseasonYear);
                        setYearRedirect(onlySeasonSupported);
                        setYear(onlySeasonSupported);
                     }
                  }, true)}
               />
            </GenericTogglingMenu>
         </Col>               
      </Form.Group>
      {(transferInOutMode || hasCustomFilter) ? <Form.Group as={Row}>
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
         {transferInOutMode ? <Col xs={12} sm={12} md={4} lg={4}>
            <Select
               styles={{ menu: base => ({ ...base, zIndex: 1000 }) }}
               value={sortByOptions[sortBy]}
               options={_.values(sortByOptions)}
               isSearchable={false}
               onChange={(option) => { if ((option as any)?.value) {
                  const newSortBy = (option as any)?.value || "net";               
                  friendlyChange(() => setSortBy(newSortBy), sortBy != newSortBy);
               }}}
            />
         </Col> : null}
      </Form.Group> : null}       
      <Row>
         <Col>
            <LoadingOverlay
               active={needToLoadQuery()}
               spinner
               text={"Loading Offseason Leaderboard..."}
            >
               {table}
            </LoadingOverlay>
         </Col>
      </Row>
   </Container>;
 }
 export default OffSeasonLeaderboardTable;
