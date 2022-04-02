// React imports:
import React, { useState, useEffect } from 'react';

// Lodash:
import _, { concat } from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
import Select, { components } from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faCheck, faPen, faFilter, faTrash } from '@fortawesome/free-solid-svg-icons'
import ClipboardJS from 'clipboard';

// Component imports
import GenericTable, { GenericTableOps } from "./GenericTable";
import GenericTogglingMenu from './shared/GenericTogglingMenu';
import GenericTogglingMenuItem from './shared/GenericTogglingMenuItem';
import ToggleButtonGroup from "./shared/ToggleButtonGroup";
import AsyncFormControl from './shared/AsyncFormControl';
import AdvancedFilterAutoSuggestText, { notFromFilterAutoSuggest } from './shared/AdvancedFilterAutoSuggestText';
import PlayerLeaderboardTable from "./PlayerLeaderboardTable";

// Table building
import { TableDisplayUtils } from "../utils/tables/TableDisplayUtils";
import { LineupTableUtils } from "../utils/tables/LineupTableUtils";
import { DivisionStatsCache, GradeTableUtils } from "../utils/tables/GradeTableUtils";

// Util imports
import { UrlRouting } from "../utils/UrlRouting";
import { CommonTableDefs } from "../utils/tables/CommonTableDefs";
import { PlayerLeaderboardParams, ParamDefaults, TeamEditorParams } from '../utils/FilterModels';
import { GoodBadOkTriple, TeamEditorUtils } from '../utils/stats/TeamEditorUtils';

import { StatModels, IndivStatSet, PureStatSet, DivisionStatistics } from '../utils/StatModels';
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import { CbbColors } from '../utils/CbbColors';
import GenericCollapsibleCard from './shared/GenericCollapsibleCard';
import { GradeUtils } from '../utils/stats/GradeUtils';
import { PositionUtils } from '../utils/stats/PositionUtils';
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';

export type TeamEditorStatsModel = {
  players?: Array<any>,
  confs?: Array<string>,
  confMap?: Map<string, Array<string>>,
  lastUpdated?: number,
  transfers?: Record<string, Array<{f: string, t?: string}>>,
  error?: string
}
type Props = {
  startingState: TeamEditorParams,
  dataEvent: TeamEditorStatsModel,
  onChangeState: (newParams: TeamEditorParams) => void
}

// Functional component

const TeamEditorTable: React.FunctionComponent<Props> = ({startingState, dataEvent, onChangeState}) => {
  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  /** Only show help for diagnstic on/off on main page */
  const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");

  // 1] Data Model

  const [ clipboard, setClipboard] = useState(null as null | ClipboardJS);

  // 2] State

  // Data source
  const [ year, setYear ] = useState(startingState.year || ParamDefaults.defaultYear);
  const [ gender, setGender ] = useState(startingState.gender || ParamDefaults.defaultGender);
  // Data source
  const [ team, setTeam ] = useState(startingState.team || ParamDefaults.defaultTeam);

  // Data source
  const [ offSeasonMode, setOffSeasonMode ] = useState(_.isNil(startingState.offSeason) ? true : startingState.offSeason);

  /** Pre-calculate this */
  const teamList = AvailableTeams.getTeams(null, year, gender);

  // Handling various ways of uploading data
  const [ onlyTransfers, setOnlyTransfers ] = useState(true);
  const [ reloadData, setReloadData ] = useState(false);



  // Misc display

  /** Set this to be true on expensive operations */
  const [ loadingOverride, setLoadingOverride ] = useState(false);

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

  useEffect(() => { //(this ensures that the filter component is up to date with the union of these fields)
    const newState = {
      ...startingState,
      gender: gender, year: year, team: team,
      // Player filters/settings:
      // Misc filters
      // Misc display
    };
    onChangeState(newState);
  }, [ year, gender, team ]);

  // 3] Utils

  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return !dataEvent.error && (loadingOverride || ((dataEvent?.players || []).length == 0));
  }

  /** For use in selects */
  function stringToOption(s: string) {
    return { label: s, value: s};
  }

  /////////////////////////////////////

  //TODO: put team editor specific things in here:

  const [ divisionStatsCache, setDivisionStatsCache ] = useState({} as DivisionStatsCache);
  
  // Events that trigger building or rebuilding the division stats cache
  useEffect(() => {
    const params = {
      ...startingState,
      year, gender
    };

    if ((params.year != divisionStatsCache.year) ||
      (params.gender != divisionStatsCache.gender) ||
      _.isEmpty(divisionStatsCache)) {
        if (!_.isEmpty(divisionStatsCache)) setDivisionStatsCache({}); //unset if set
        const updatedParams = (params.year == "All") ? {
          ...params,
          year: ParamDefaults.defaultLeaderboardYear
        } : params;
        GradeTableUtils.populateDivisionStatsCache(updatedParams, statsCache => {
          setDivisionStatsCache(statsCache);
        });
      }
  }, [ year, gender ]);

  const tableDef = {
    title: GenericTableOps.addTitle("", "", CommonTableDefs.rowSpanCalculator, "small", GenericTableOps.htmlFormatter, 20),
    "sep0": GenericTableOps.addColSeparator(0.5),

    pos: GenericTableOps.addDataCol("Pos", "Positional class of player (algorithmically generated)", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
    mpg: GenericTableOps.addPtsCol("mpg", "Approximate expected minutes per game", CbbColors.alwaysWhite),
    "sep0.6": GenericTableOps.addColSeparator(0.05), 
    ortg: GenericTableOps.addPtsCol("ORtg", 
      "Offensive Rating, for 'Balanced' projections" + " (CURRENTLY: last season's numbers)", 
      CbbColors.varPicker(CbbColors.off_pp100)),
    usage: GenericTableOps.addPctCol("Usg", 
      "Usage for `Balanced` projections" + " (CURRENTLY: last season's numbers)", 
      CbbColors.varPicker(CbbColors.usg_offDef)),
    rebound: GenericTableOps.addPctCol("RB%", 
      "% of available defensive rebounds made by this player ('Balanced' projection)" + " (CURRENTLY: last season's numbers)", 
      CbbColors.varPicker(CbbColors.p_def_OR)),

    "sep1": GenericTableOps.addColSeparator(2),

    good_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
    "sep1.5": GenericTableOps.addColSeparator(0.05),
    good_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
    good_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.def_diff10_p100_redGreen)),
    "sep2": GenericTableOps.addColSeparator(3),

    ok_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
    "sep2.5": GenericTableOps.addColSeparator(0.05),
    ok_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
    ok_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.def_diff10_p100_redGreen)),
    "sep3": GenericTableOps.addColSeparator(3),

    bad_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
    "sep3.5": GenericTableOps.addColSeparator(0.05),
    bad_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
    bad_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.def_diff10_p100_redGreen)),
    "sep4": GenericTableOps.addColSeparator(2),

    edit: GenericTableOps.addDataCol("", "Edit the Optimistic/Balanced/Pessmistic projections for the player", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
    disable: GenericTableOps.addDataCol("", "Disable/re-enabled this player from the roster", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
  };
  const teamTableDef = {
    title: GenericTableOps.addTitle("", "", CommonTableDefs.rowSpanCalculator, "small", GenericTableOps.htmlFormatter, 20),
    mpg: GenericTableOps.addPtsCol("mpg", "Approximate expected minutes per game", CbbColors.alwaysWhite),

    good_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
    good_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
    good_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.def_diff35_p100_redGreen)),

    ok_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
    ok_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
    ok_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.def_diff35_p100_redGreen)),

    bad_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
    bad_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
    bad_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.def_diff35_p100_redGreen)),
  }
  const gradeTableDef = {
    title: GenericTableOps.addTitle("", "", CommonTableDefs.rowSpanCalculator, "small", GenericTableOps.htmlFormatter, 20),

    ok_net: GenericTableOps.addDataCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Balanced' projections",
      CbbColors.varPicker(CbbColors.pctile_qual[0]), GenericTableOps.gradeOrHtmlFormatter),
    ok_off: GenericTableOps.addDataCol(
      "Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", 
      CbbColors.varPicker(CbbColors.pctile_qual[0]), GenericTableOps.gradeOrHtmlFormatter),
    ok_def: GenericTableOps.addDataCol(
      "Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", 
      CbbColors.varPicker(CbbColors.pctile_qual[0]), GenericTableOps.gradeOrHtmlFormatter),

    good_net: GenericTableOps.addDataCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections",
      CbbColors.varPicker(CbbColors.pctile_qual[0]), GenericTableOps.gradeOrHtmlFormatter),
    good_off: GenericTableOps.addDataCol(
      "Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", 
      CbbColors.varPicker(CbbColors.pctile_qual[0]), GenericTableOps.gradeOrHtmlFormatter),
    good_def: GenericTableOps.addDataCol(
      "Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", 
      CbbColors.varPicker(CbbColors.pctile_qual[0]), GenericTableOps.gradeOrHtmlFormatter),

    bad_net: GenericTableOps.addDataCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections",
      CbbColors.varPicker(CbbColors.pctile_qual[0]), GenericTableOps.gradeOrHtmlFormatter),
    bad_off: GenericTableOps.addDataCol(
      "Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", 
      CbbColors.varPicker(CbbColors.pctile_qual[0]), GenericTableOps.gradeOrHtmlFormatter),
    bad_def: GenericTableOps.addDataCol(
      "Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", 
      CbbColors.varPicker(CbbColors.pctile_qual[0]), GenericTableOps.gradeOrHtmlFormatter),

  };

  const [ otherPlayerCache, setOtherPlayerCache ] = useState({} as Record<string, GoodBadOkTriple>);

  const [ disabledPlayers, setDisabledPlayers ] = useState({} as Record<string, boolean>);

  const [ deletedPlayers, setDeletedPlayers ] = useState({} as Record<string, string>); //(value is key, for display)

  const genderYearLookup = `${gender}_${year}`;
  const avgEff = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

  const rosterTable = React.useMemo(() => {
    setLoadingOverride(false);

    const basePlayerCache: Record<string, GoodBadOkTriple> = {}; //TODO: currently unused

    const basePlayers: GoodBadOkTriple[] = TeamEditorUtils.getBasePlayers(
      team, year, (dataEvent.players || []), basePlayerCache, !offSeasonMode, deletedPlayers, dataEvent.transfers || {}
    );

    const playerSet = basePlayers.concat(_.values(otherPlayerCache)); //TODO process this + get team results

    const [ teamSosNet, teamSosOff, teamSosDef ] = TeamEditorUtils.calcApproxTeamSoS(basePlayers.map(p => p.orig), avgEff);

    TeamEditorUtils.calcAndInjectYearlyImprovement(playerSet, team, teamSosOff, teamSosDef, avgEff, offSeasonMode);
    TeamEditorUtils.calcAndInjectMinsAssignment(playerSet, team, year, disabledPlayers, teamSosNet, avgEff);

    const getOff = (s: PureStatSet) => (s.off_adj_rapm || s.off_adj_rtg)?.value || 0;
    const getDef = (s: PureStatSet) => (s.def_adj_rapm || s.def_adj_rtg)?.value || 0;
    const getNet = (s: PureStatSet) => getOff(s) - getDef(s);

    // Filter player in/out (onlyDisable==true if undisabled as part of deleting that player)
    const togglePlayer = (triple: GoodBadOkTriple, currDisabled: Record<string, boolean>, onlyDisable: boolean) => {
      const newDisabledPlayers = _.clone(currDisabled);
      if (currDisabled[triple.key]) {
        delete newDisabledPlayers[triple.key];
        return newDisabledPlayers;
      } else if (!onlyDisable) {
        newDisabledPlayers[triple.key] = true;
        return newDisabledPlayers;
      } else { //(by request, only do something if it's a disable)
        return undefined;
      }
    };

    const buildDataRowFromTriple = (triple: GoodBadOkTriple) => {
      const rosterInfo = triple.orig?.roster ?
        `${triple.orig.roster?.height || "?-?"} ${
          offSeasonMode ? TeamEditorUtils.getNextClass(triple.orig.roster?.year_class) : triple.orig.roster?.year_class
        }` : undefined;
      const isFiltered = disabledPlayers[triple.key]; //(TODO: display some of these fields but with different formatting)
      const name = <b>{triple.orig.key}</b>;
      const maybeTransferName = otherPlayerCache[triple.key] ? <u>{name}</u> : name;
      const tableEl = {
        title: <span>{rosterInfo ? <i>{rosterInfo}&nbsp;/&nbsp;</i> : null}{maybeTransferName}</span>,
        mpg: isFiltered ? undefined : { value: (triple.ok.off_team_poss_pct?.value || 0)*40 },
        ortg: triple.ok.off_rtg,
        usage: triple.ok.off_usage,
        rebound: isFiltered ? undefined : { value: triple.ok.def_orb?.value },

        pos: <span style={{whiteSpace: "nowrap"}}>{triple.orig.posClass}</span>,
        good_net: isFiltered ? undefined : { value: getNet(triple.good) },
        good_off: isFiltered ? undefined : { value: getOff(triple.good) },
        good_def: isFiltered ? undefined : { value: getDef(triple.good) },
        ok_net: isFiltered ? undefined : { value: getNet(triple.ok) },
        ok_off: isFiltered ? undefined : { value: getOff(triple.ok) },
        ok_def: isFiltered ? undefined : { value: getDef(triple.ok) },
        bad_net: isFiltered ? undefined : { value: getNet(triple.bad) },
        bad_off: isFiltered ? undefined : { value: getOff(triple.bad) },
        bad_def: isFiltered ? undefined : { value: getDef(triple.bad) },

        //TODO: tooltips and make disable button latch
        edit: <Button variant="outline-danger" size="sm" onClick={(ev: any) => {
          if (otherPlayerCache[triple.key]) {
            const newOtherPlayerCache = _.clone(otherPlayerCache);
            delete newOtherPlayerCache[triple.key];
            friendlyChange(() => {
              setOtherPlayerCache(newOtherPlayerCache);
              // Tidy up activity: remove from disabled players set
              const newDisabledPlayers = togglePlayer(triple, disabledPlayers, false);
              if (newDisabledPlayers) {
                setDisabledPlayers(newDisabledPlayers);
              }
            }, true);
          } else {
            const newDeletedPlayers = _.clone(deletedPlayers);
            newDeletedPlayers[triple.key] = triple.orig.key;
            friendlyChange(() => {
              setDeletedPlayers(newDeletedPlayers);
              // Tidy up activity: remove from disabled players set
              const newDisabledPlayers = togglePlayer(triple, disabledPlayers, false);
              if (newDisabledPlayers) {
                setDisabledPlayers(newDisabledPlayers);
              }
            }, true);
          }
        }}><FontAwesomeIcon icon={faTrash} /></Button>,
        disable: <Button variant={disabledPlayers[triple.key] ? "secondary" : "outline-secondary"} size="sm" onClick={(ev:any) => {
          //(insta do this - the visual clue should be sufficient)
          const newDisabledPlayers = togglePlayer(triple, disabledPlayers, false);
          if (newDisabledPlayers) {
            setDisabledPlayers(newDisabledPlayers);
          }
        }}><FontAwesomeIcon icon={faFilter} /></Button>,
      };
      return GenericTableOps.buildDataRow(tableEl, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    };
    const buildBenchDataRowFromTriple = (triple: GoodBadOkTriple) => {
      const isFiltered = false; //(never possible to filter bench minutes)
      const tableEl = {
        title: <b>{triple.orig.key}</b>,
        mpg: isFiltered ? undefined : { value: (triple.ok.off_team_poss_pct?.value || 0)*40 },

        good_net: isFiltered ? undefined : { value: getNet(triple.good) },
        good_off: isFiltered ? undefined : { value: getOff(triple.good) },
        good_def: isFiltered ? undefined : { value: getDef(triple.good) },
        ok_net: isFiltered ? undefined : { value: getNet(triple.ok) },
        ok_off: isFiltered ? undefined : { value: getOff(triple.ok) },
        ok_def: isFiltered ? undefined : { value: getDef(triple.ok) },
        bad_net: isFiltered ? undefined : { value: getNet(triple.bad) },
        bad_off: isFiltered ? undefined : { value: getOff(triple.bad) },
        bad_def: isFiltered ? undefined : { value: getDef(triple.bad) },
      };
      return GenericTableOps.buildDataRow(tableEl, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    };

    const buildPosHeaderRow = (posName: string, pct: number) => GenericTableOps.buildSubHeaderRow(
      [ 
        [ <div/>, 9 ], 
        [ <div/>, 4 ], [ <div/>, 1 ], [ <div><b>{posName}</b> ({(100*pct).toFixed(0)}%)</div>, 4 ], [ <div/>, 1 ], [ <div/>, 4 ], [ <div/>, 1 ], 
        [ <div/>, 2 ]
      ], "small text-center"
    );

    // (can't use minutes annoyingly because that jumps around too much as you filter/unfilter stuff)
    const sortedWithinPosGroup = (triple: GoodBadOkTriple) => {
      return PositionUtils.posClassToScore(triple.orig.posClass || "") - getNet(triple.ok);
    };

    const rosterGuards = _.sortBy(playerSet.filter(triple => {
      return (triple.orig.posClass == "PG") || (triple.orig.posClass == "s-PG") || (triple.orig.posClass == "CG");
    }), sortedWithinPosGroup);
    const filteredRosterGuards = rosterGuards.filter(triple => !disabledPlayers[triple.key]);
    const rosterGuardMins = _.sumBy(filteredRosterGuards, p => p.ok.off_team_poss_pct.value!)*0.2;

    const rosterWings = _.sortBy(playerSet.filter(triple => {
      return (triple.orig.posClass == "WG") || (triple.orig.posClass == "WF") || (triple.orig.posClass == "G?");
    }), sortedWithinPosGroup);
    const filteredRosterWings = rosterWings.filter(triple => !disabledPlayers[triple.key]);
    const rosterWingMins = _.sumBy(filteredRosterWings, p => p.ok.off_team_poss_pct.value!)*0.2;

    const rosterBigs = _.sortBy(playerSet.filter(triple => {
      return (triple.orig.posClass == "S-PF") || (triple.orig.posClass == "PF/C") || (triple.orig.posClass == "C")
              || (triple.orig.posClass == "F/C?");
    }), sortedWithinPosGroup);
    const filteredRosterBigs = rosterBigs.filter(triple => !disabledPlayers[triple.key]);
    const rosterBigMins = _.sumBy(filteredRosterBigs, p => p.ok.off_team_poss_pct.value!)*0.2;

    // Build bench minutes:

    const [ maybeBenchGuard, maybeBenchWing, maybeBenchBig ] = _.isEmpty(playerSet) ?
      [ undefined, undefined, undefined ]
      : 
      TeamEditorUtils.getBenchMinutes(
        team, year,
        rosterGuardMins, rosterWingMins, rosterBigMins
      );

    // Now, finally, can build display:

    const rosterTableDataGuards = [ buildPosHeaderRow("Guards", rosterGuardMins) ].concat(rosterGuards.map(triple => {
      return buildDataRowFromTriple(triple);
    })).concat(maybeBenchGuard ? [ buildBenchDataRowFromTriple(maybeBenchGuard) ] : []);
    const rosterTableDataWings = [ buildPosHeaderRow("Wings", rosterWingMins) ].concat(rosterWings.map(triple => {
      return buildDataRowFromTriple(triple);
    })).concat(maybeBenchWing ? [ buildBenchDataRowFromTriple(maybeBenchWing) ] : []);
    const rosterTableDataBigs = [ buildPosHeaderRow("Bigs", rosterBigMins) ].concat(rosterBigs.map(triple => {
      return buildDataRowFromTriple(triple);
    })).concat(maybeBenchBig ? [ buildBenchDataRowFromTriple(maybeBenchBig) ] : []);

    const addedTxfersStr = _.values(otherPlayerCache).map(p => p.orig.key).join(" / ");
    const removedPlayerStr = _.values(deletedPlayers).join(" / ");

    const rosterTableData = _.flatten([
      rosterTableDataGuards,
      rosterTableDataWings,
      rosterTableDataBigs,
      [ GenericTableOps.buildRowSeparator() ],
      [ GenericTableOps.buildTextRow(
        <i>Hypotheticals: <b>added</b> [{addedTxfersStr}], <b>removed</b> [{removedPlayerStr}]</i>
        , "small"
      ) ]
    ]);

    const filteredPlayerSet = playerSet.filter(triple => !disabledPlayers[triple.key])
      .concat(maybeBenchGuard ? [ maybeBenchGuard ] : [])
      .concat(maybeBenchWing ? [ maybeBenchWing ] : [])
      .concat(maybeBenchBig ? [ maybeBenchBig ] : [])
    ;

    const totalMins = _.sumBy(filteredPlayerSet, p => p.ok.off_team_poss_pct.value!)*0.2;
    const buildTotals = (triples: GoodBadOkTriple[], range: "good" | "bad" | "ok") => {
      const off = _.sumBy(triples, triple => {
        return (triple[range].off_team_poss_pct.value || 0)*getOff(triple[range]);
      });
      const def = _.sumBy(triples, triple => {
        return (triple[range].off_team_poss_pct.value || 0)*getDef(triple[range]);
      });
      const net = _.sumBy(triples, triple => {
        return (triple[range].off_team_poss_pct.value || 0)*getNet(triple[range]);
      });
      return { off, def, net };
    };
    const okTotals = buildTotals(filteredPlayerSet, "ok");
    const stdDevFactor = 1.0/Math.sqrt(5);

    const goodRange = buildTotals(filteredPlayerSet, "good");
    const badRange = buildTotals(filteredPlayerSet, "bad");
    const goodDeltaNet = (goodRange.net - okTotals.net)*stdDevFactor;
    const goodDeltaOff = (goodRange.off - okTotals.off)*stdDevFactor;
    const goodDeltaDef = (goodRange.def - okTotals.def)*stdDevFactor;
    const badDeltaNet = (badRange.net - okTotals.net)*stdDevFactor;
    const badDeltaOff = (badRange.off - okTotals.off)*stdDevFactor;
    const badDeltaDef = (badRange.def - okTotals.def)*stdDevFactor;

    const dummyTeamOk = {
      off_net: { value: okTotals.net },
      off_adj_ppp: { value: okTotals.off + avgEff },
      def_adj_ppp: { value: okTotals.def + avgEff },
    };
    const dummyTeamGood = {
      off_net: { value: okTotals.net + goodDeltaNet },
      off_adj_ppp: { value: okTotals.off + avgEff + goodDeltaOff },
      def_adj_ppp: { value: okTotals.def + avgEff + goodDeltaDef },
    };
    const dummyTeamBad = {
      off_net: { value: okTotals.net + badDeltaNet },
      off_adj_ppp: { value: okTotals.off + avgEff + badDeltaOff },
      def_adj_ppp: { value: okTotals.def + avgEff + badDeltaDef },
    };
    const teamGradesOk = divisionStatsCache.Combo ?
      GradeUtils.buildTeamPercentiles(divisionStatsCache.Combo, dummyTeamOk, [  "net", "adj_ppp" ], true) : {};
    const teamGradesGood = divisionStatsCache.Combo ?
      GradeUtils.buildTeamPercentiles(divisionStatsCache.Combo, dummyTeamGood, [  "net", "adj_ppp" ], true) : {};
    const teamGradesBad = divisionStatsCache.Combo ?
      GradeUtils.buildTeamPercentiles(divisionStatsCache.Combo, dummyTeamBad, [  "net", "adj_ppp" ], true) : {};

    const subHeaders = [ 
      GenericTableOps.buildSubHeaderRow(
        [ 
          [ <div/>, 9 ], 
          [ <i>Optimistic</i>, 4 ], [ <div/>, 1 ], [ <i>Balanced</i>, 4 ], [ <div/>, 1 ], [ <i>Pessimistic</i>, 4 ], [ <div/>, 1 ],
          [ <div/>, 2 ]
        ], "small text-center"
      ),
    ].concat(_.isEmpty(filteredPlayerSet) ? [] : [
      GenericTableOps.buildDataRow({
        title: <b>Team Totals</b>,
        //(for diag only)
        //mpg: { value: totalMins*40 },
        ok_net: { value: okTotals.net },
        ok_off: { value: okTotals.off },
        ok_def: { value: okTotals.def },
        good_net: { value: okTotals.net + goodDeltaNet },
        good_off: { value: okTotals.off + goodDeltaOff },
        good_def: { value: okTotals.def + goodDeltaDef },
        bad_net: { value: okTotals.net + badDeltaNet },
        bad_off: { value: okTotals.off + badDeltaOff },
        bad_def: { value: okTotals.def + badDeltaDef },
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta, teamTableDef)
      ,
      GenericTableOps.buildDataRow({
        title: <b>Team Grades</b>,
        ok_net: teamGradesOk.off_net,
        ok_off: teamGradesOk.off_adj_ppp,
        ok_def: teamGradesOk.def_adj_ppp,
        good_net: teamGradesGood.off_net,
        good_off: teamGradesGood.off_adj_ppp,
        good_def: teamGradesGood.def_adj_ppp,
        bad_net: teamGradesBad.off_net,
        bad_off: teamGradesBad.off_adj_ppp,
        bad_def: teamGradesBad.def_adj_ppp,
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta, gradeTableDef),
    ]);
    //TODO: Add: Transfer | Generic | D1

    const trailers = [ 

    ];

    return <GenericTable
      tableCopyId="rosterEditorTable"
      tableFields={tableDef}
      tableData={subHeaders.concat(rosterTableData)}
      cellTooltipMode={undefined}
    />;
  }, [ dataEvent, year, team, otherPlayerCache, deletedPlayers, disabledPlayers, divisionStatsCache ]);

  const playerLeaderboard = React.useMemo(() => {
    return <PlayerLeaderboardTable
      startingState={{
        ...startingState,
        tier: "All"
      }}
      dataEvent={reloadData ?
        {} : {
          ...dataEvent, 
          transfers: (onlyTransfers && (year == ParamDefaults.defaultLeaderboardYear)) ? dataEvent.transfers : undefined 
        }
      }
      onChangeState={() => null}
      teamEditorMode={(p: IndivStatSet) => {
        const newOtherPlayerCache = _.clone(otherPlayerCache);
        const key = TeamEditorUtils.getKey(p, team, year);
        newOtherPlayerCache[key] = {
          key,
          good: _.clone(p),
          bad: _.clone(p),
          ok: _.clone(p),
          orig: p
        };
        friendlyChange(() => {
          setOtherPlayerCache(newOtherPlayerCache);
        }, otherPlayerCache[key] == undefined);
      }}
    />;
  }, [ dataEvent, reloadData, team, year, otherPlayerCache ]);

  /////////////////////////////////////

  // 4] View

  /** Copy to clipboard button */
  const getCopyLinkButton = () => {
    const tooltip = (
      <Tooltip id="copyLinkTooltip">Copies URL to clipboard</Tooltip>
    );
    return  <OverlayTrigger placement="auto" overlay={tooltip}>
        <Button className="float-left" id={`copyLink_playerLeaderboard`} variant="outline-secondary" size="sm">
          <FontAwesomeIcon icon={faLink} />
        </Button>
      </OverlayTrigger>;
  };
  /** This grovelling is needed to ensure that clipboard is only loaded client side */
  function initClipboard() {
    if (null == clipboard) {
      var newClipboard = new ClipboardJS(`#copyLink_playerLeaderboard`, {
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
      }, timeout);
    }
  };

  const confsWithTeams = dataEvent?.confMap ?
    _.toPairs(dataEvent?.confMap || {}).map(kv => {
      const teams = kv[1] || [];
      return _.isEmpty(teams) ? kv[0] : `${kv[0]} [${teams.join(", ")}]`;
    }) : (dataEvent?.confs || []);

  /** Let the user know that he might need to change */
  const MenuList = (props: any)  => {
    return (
      <components.MenuList {...props}>
        <p className="text-secondary text-center">(Let me know if there's a team/season you want to see!)</p>
        {props.children}
      </components.MenuList>
    );
  };
  /** Adds the MenuList component with user prompt if there are teams fitered out*/
  function maybeMenuList() {
    if (teamList.length < Object.keys(AvailableTeams.byName).length) {
      return { MenuList };
    }
  }
  /** For use in team select */
  function getCurrentTeamOrPlaceholder() {
    return (team == "") ? { label: 'Choose Team...' } : stringToOption(team);
  }

  return <Container>
    <Form.Group as={Row}>
      <Col xs={6} sm={6} md={3} lg={2}>
        <Select
          value={ stringToOption(gender) }
          options={[ "Men", "Women" ].map(
            (gender) => stringToOption(gender)
          )}
          isSearchable={false}
          onChange={(option) => { 
            if ((option as any)?.value) {
              const newGender = (option as any).value;
              friendlyChange(() => {
                setGender(newGender);
                setOtherPlayerCache({});
              }, newGender != gender);
            }
          }}
        />
      </Col>
      <Col xs={6} sm={6} md={3} lg={2}>
        <Select
          value={ stringToOption(year) }
          options={[ "2018/9", "2019/20", "2020/21", "2021/22" ].map(
              (r) => stringToOption(r)
          )}
          isSearchable={false}
          onChange={(option) => { 
            if ((option as any)?.value) {
              const newYear = (option as any).value;
              friendlyChange(() => {
                setYear(newYear);
                setOtherPlayerCache({});
              }, newYear != year);
            }
          }}
        />
      </Col>
      <Col className="w-100" bsPrefix="d-lg-none d-md-none"/>
      <Col xs={12} sm={12} md={6} lg={6}>
        <Select
          isDisabled={false}
          components = { maybeMenuList() }
          isClearable={false}
          styles={{ menu: base => ({ ...base, zIndex: 1000 }) }}
          value={ getCurrentTeamOrPlaceholder() }
          options={teamList.map(
            (r) => stringToOption(r.team)
          )}
          onChange={(option) => {
            const selection = (option as any)?.value || "";
            if (year == AvailableTeams.extraTeamName) {
              const teamYear = selection.split(/ (?=[^ ]+$)/);
              friendlyChange(() => {
                setTeam(teamYear[0]);
                setYear(teamYear[1]);
                setOtherPlayerCache({});
                setDeletedPlayers({});
                setDisabledPlayers({})
              }, (teamYear[0] != team) && (teamYear[1] != year));
            } else {
               friendlyChange(() => {
                setTeam(selection);
                setOtherPlayerCache({});
                setOtherPlayerCache({});
                setDeletedPlayers({});
                setDisabledPlayers({})
               }, team != selection);
            }
          }}
        />
      </Col>
      <Col lg={1} className="mt-1">
        {getCopyLinkButton()}
      </Col>
    </Form.Group>
    <Row className="mt-2">
      <Col style={{paddingLeft: "5px", paddingRight: "5px"}}>
        <LoadingOverlay
          active={needToLoadQuery()}
          spinner
          text={"Loading Team Editor..."}
        >
          {rosterTable}
        </LoadingOverlay>
      </Col>
    </Row>
    <Row>
      <Col style={{paddingLeft: "5px", paddingRight: "5px"}}>
        <GenericCollapsibleCard minimizeMargin={true} title="Add New Player" helpLink={undefined} startClosed={false}>
          <Container>
            <Row>
              <Form.Group as={Col} xs="4" className="mt-2">
                <Form.Check type="switch" disabled={year != ParamDefaults.defaultLeaderboardYear}
                  id="onlyTransfers"
                  checked={onlyTransfers && (year == ParamDefaults.defaultLeaderboardYear)}
                  onChange={() => {
                    setTimeout(() => {
                      setReloadData(true);
                      setOnlyTransfers(!onlyTransfers);
                      setTimeout(() => {
                        setReloadData(false);
                      }, 100);
                    }, 250);
                  }}
                  label="Only show transfers"
                />
              </Form.Group>
              <Form.Group as={Col} xs="1" className="mt-2"/>
              <Form.Group as={Col} xs="4" className="mt-2">
              </Form.Group>
            </Row>
            <Row>
              {playerLeaderboard}
            </Row>
          </Container>
        </GenericCollapsibleCard>
      </Col>
    </Row>
  </Container>;
};

export default TeamEditorTable;
