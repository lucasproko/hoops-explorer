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
import PlayerLeaderboardTable, { PlayerLeaderboardStatsModel } from "./PlayerLeaderboardTable";

// Table building
import { DivisionStatsCache, GradeTableUtils } from "../utils/tables/GradeTableUtils";

// Util imports
import { CommonTableDefs } from "../utils/tables/CommonTableDefs";
import { PlayerLeaderboardParams, ParamDefaults, TeamEditorParams } from '../utils/FilterModels';
import { GoodBadOkTriple, PlayerEditModel, TeamEditorUtils } from '../utils/stats/TeamEditorUtils';

import { StatModels, IndivStatSet, PureStatSet, DivisionStatistics } from '../utils/StatModels';
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import { CbbColors } from '../utils/CbbColors';
import GenericCollapsibleCard from './shared/GenericCollapsibleCard';
import { GradeUtils } from '../utils/stats/GradeUtils';
import { PositionUtils } from '../utils/stats/PositionUtils';
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { LeaderboardUtils, TransferModel } from '../utils/LeaderboardUtils';
import TeamRosterEditor from './shared/TeamRosterEditor';

// Input params/models

export type TeamEditorStatsModel = {
  players?: Array<IndivStatSet>,
  confs?: Array<string>,
  confMap?: Map<string, Array<string>>,
  lastUpdated?: number,
  transfers?: Record<string, Array<TransferModel>>[],
  error?: string
}
type Props = {
  startingState: TeamEditorParams,
  dataEvent: TeamEditorStatsModel,
  onChangeState: (newParams: TeamEditorParams) => void
}

// Table definitions

const tableDef = {
  title: GenericTableOps.addTitle("", "", CommonTableDefs.rowSpanCalculator, "small", GenericTableOps.htmlFormatter, 20),
  "sep0": GenericTableOps.addColSeparator(0.5),

  pos: GenericTableOps.addDataCol("Pos", "Positional class of player (algorithmically generated)", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
  mpg: GenericTableOps.addPtsCol("mpg", "Approximate expected minutes per game", CbbColors.alwaysWhite),
  "sep0.6": GenericTableOps.addColSeparator(0.05), 
  ortg: GenericTableOps.addPtsCol("ORtg", 
    "Offensive Rating, for 'Balanced' projections", 
    CbbColors.varPicker(CbbColors.off_pp100)),
  usage: GenericTableOps.addPctCol("Usg", 
    "Usage for `Balanced` projections", 
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
  good_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.off_pp100)),
  good_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.def_pp100)),

  ok_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
  ok_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_pp100)),
  ok_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.def_pp100)),

  bad_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
  bad_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.off_pp100)),
  bad_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.def_pp100)),
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

/** Handy util for reducing  */
const reduceNumberSize = (k: string, v: any) => {
  if (_.isNumber(v)) {
    const rawNumStr = "" + v;
    const numStr = v.toFixed(2);
    if (numStr.length >= rawNumStr.length) { //made it worse
      return v;
    } else {
      return parseFloat(numStr);
    }
  } else {
    return v;
  }
}

// Functional component

const TeamEditorTable: React.FunctionComponent<Props> = ({startingState, dataEvent, onChangeState}) => {
  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  /** Only show help for diagnstic on/off on main page */
  const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");

  // 1] Data Model

  const [ clipboard, setClipboard] = useState(null as null | ClipboardJS);

  // 2] State (not controllable from outside the page)
  const [ debugMode, setDebugMode ] = useState(false);

  // Misc control toggles
  const [ showPrevSeasons, setShowPrevSeasons ] = useState(_.isNil(startingState.showPrevSeasons) ? false : startingState.showPrevSeasons);
  const [ offSeasonMode, setOffSeasonMode ] = useState(_.isNil(startingState.offSeason) ? true : startingState.offSeason);
  const [ alwaysShowBench, setAlwaysShowBench ] = useState(_.isNil(startingState.alwaysShowBench) ? false : startingState.alwaysShowBench);
  const [ superSeniorsBack, setSuperSeniorsBack ] = useState(_.isNil(startingState.superSeniorsBack) ? false : startingState.superSeniorsBack);

  // Data source
  const [ year, setYear ] = useState(startingState.year || ParamDefaults.defaultYear);
  const [ gender, setGender ] = useState(startingState.gender || ParamDefaults.defaultGender);
  // Data source
  const [ team, setTeam ] = useState(startingState.team || ParamDefaults.defaultTeam);

  /** Pre-calculate this */
  const teamList = AvailableTeams.getTeams(null, (year == "All") ? ParamDefaults.defaultLeaderboardYear : year, gender);

  // Handling various ways of uploading data
  const [ onlyTransfers, setOnlyTransfers ] = useState(_.isNil(startingState.showOnlyTransfers) ? true : startingState.showOnlyTransfers);
  const [ onlyThisYear, setOnlyThisYear ] = useState(_.isNil(startingState.showOnlyCurrentYear) ? true : startingState.showOnlyCurrentYear);
  const [ reloadData, setReloadData ] = useState(false);
  const hasTransfers  = (gender == "Men") && (year >= "2019");

  // Core team editor state

  //(the values passed in by URL pre-transform)
  const [ otherPlayerCacheIn, setOtherPlayerCacheIn ] = useState((startingState.addedPlayers || "") as string | undefined);
  const [ disabledPlayersIn, setDisabledPlayersIn ] = useState((startingState.disabledPlayers || "") as string | undefined);
  const [ deletedPlayersIn, setDeletedPlayersIn ] = useState((startingState.deletedPlayers || "") as string | undefined);
  const [ editOpenIn, setEditOpenIn ] = useState((startingState.editOpen || "") as string | undefined);
  const [ overridesIn, setOverridesIn ] = useState((startingState.overrides || "") as string | undefined);

  const [ otherPlayerCache, setOtherPlayerCache ] = useState({} as Record<string, GoodBadOkTriple>);
  const [ disabledPlayers, setDisabledPlayers ] = useState({} as Record<string, boolean>);
  const [ deletedPlayers, setDeletedPlayers ] = useState({} as Record<string, string>); //(value is key, for display)
  const [ overrides, setOverrides ] = useState({} as Record<string, PlayerEditModel>);

  // Indiv editor
  const [ allEditOpen, setAllEditOpen ] = useState(startingState.allEditOpen as string | undefined);
  const [ editOpen, setEditOpen ] = useState({} as Record<string, string>);

  // Controlling the player leaderboard table
  const [ lboardAltDataSource, setLboardAltDataSource ] = useState(
    undefined as PlayerLeaderboardStatsModel | undefined
  );
  const [ lboardParams, setLboardParams ] = useState(startingState as PlayerLeaderboardParams);

  // (Grade builder)
  const [ divisionStatsCache, setDivisionStatsCache ] = useState({} as DivisionStatsCache);
  
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
      ...lboardParams,
      gender: gender, year: year, team: team,
      // Editor specific settings for team editor itself
      // there's some complexity here because we can't update this until we've used them to build the caches
      addedPlayers: _.isNil(otherPlayerCacheIn) ? _.keys(otherPlayerCache).join(";") : otherPlayerCacheIn,
      deletedPlayers: _.isNil(deletedPlayersIn) ? _.keys(deletedPlayers).join(";") : deletedPlayersIn,
      disabledPlayers: _.isNil(disabledPlayersIn) ? _.keys(disabledPlayers).join(";") : disabledPlayersIn,
      overrides: _.isNil(overridesIn) ? 
        _.map(overrides, (value, key) => TeamEditorUtils.playerEditModelToUrlParams(key, value)).join(";") : overridesIn,
      editOpen: _.isNil(editOpenIn) ? _.map(editOpen, (value, key) => `${key}|${value}`).join(";") : editOpenIn,
      // Editor specific settings for transfer view
      showOnlyTransfers: onlyTransfers,
      showOnlyCurrentYear: onlyThisYear,
      offSeason: offSeasonMode,
      showPrevSeasons: showPrevSeasons,
      alwaysShowBench: alwaysShowBench,
      superSeniorsBack: superSeniorsBack,
      allEditOpen: allEditOpen
    };
    onChangeState(newState);
  }, [ 
    year, gender, team,
    onlyTransfers, onlyThisYear, allEditOpen,
    otherPlayerCache, disabledPlayers, deletedPlayers, overrides, editOpen,
    lboardParams, showPrevSeasons, offSeasonMode, alwaysShowBench, superSeniorsBack
  ]);

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

  // Team Editor specifc logic

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
        const updatedParams = (params.year == "All") || (params.year <= "2019/20") ? { //(18/19- we only have high majors)
          ...params,
          year: ParamDefaults.defaultLeaderboardYear
        } : params;
        GradeTableUtils.populateDivisionStatsCache(updatedParams, statsCache => {
          setDivisionStatsCache(statsCache);
        });
      }
  }, [ year, gender ]);

  // Processing

  const genderYearLookup = `${gender}_${year}`;
  const avgEff = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

  const rosterTable = React.useMemo(() => {
    setLoadingOverride(false);

    const rawTeam = offSeasonMode ? undefined : TeamEditorUtils.getBasePlayers(
      team, year, (dataEvent.players || []), offSeasonMode, superSeniorsBack, {}, dataEvent.transfers || [], undefined
    );

    const playerSubList = offSeasonMode ? //(to avoid having to parse the very big players array multiple times)
      (dataEvent.players || []) : _.flatMap(rawTeam, triple => {
        return [ triple.orig ].concat(triple.prevYear ? [ triple.prevYear ] : []);
      });

    const basePlayers: GoodBadOkTriple[] = TeamEditorUtils.getBasePlayers(
      team, year, playerSubList, offSeasonMode, superSeniorsBack, deletedPlayers, dataEvent.transfers || [], undefined
    );

    // First time through ... Rebuild the state from the input params
    if ((!_.isEmpty(dataEvent.players || [])) && (
      //(first time only)
      !_.isNil(deletedPlayersIn) && !_.isNil(otherPlayerCacheIn) && !_.isNil(disabledPlayersIn) && 
      !_.isNil(overrides) && !_.isNil(editOpenIn) 
    )) {

      //TODO: there is a bug here in that if I go fetch the T100 or CONF versions of a player
      // then on page reload it will go get the original versions
      // (note converse is not true because my dataset is always the old one)
      // Options:
      // 1] mark T100/conf players in the key and then go fetch the data from those :(
      // 2] I guess store the stats in the URL :( :(
      // Block use of T100/conf for now <-- this is what I've gone with

      const needToRebuildBasePlayers = 
        (((startingState.deletedPlayers || "") != "") && _.isEmpty(deletedPlayers)) ||
        (((startingState.addedPlayers || "") != "")  && _.isEmpty(otherPlayerCache)) ||
        (((startingState.disabledPlayers || "") != "")  && _.isEmpty(disabledPlayers)) ||
        (((startingState.overrides || "") != "")  && _.isEmpty(overrides)) ||
        (((startingState.editOpen || "") != "")  && _.isEmpty(editOpen));

      if (startingState.deletedPlayers && _.isEmpty(deletedPlayers)) {
        const deletedPlayersSet = new Set(startingState.deletedPlayers.split(";"));
        const firstDeletedPlayers = _.chain(basePlayers).filter(triple => deletedPlayersSet.has(triple.key)).map(triple => {
          return [ triple.key, triple.orig.key ];
        }).fromPairs().value();
        setDeletedPlayers(firstDeletedPlayers); 
      }
      if (startingState.disabledPlayers && _.isEmpty(disabledPlayers)) {
        const firstDisabledPlayers = _.chain(startingState.disabledPlayers.split(";")).map(key => {
          return [ key, true];
        }).fromPairs().value();
        setDisabledPlayers(firstDisabledPlayers);
      }
      if (startingState.overrides && _.isEmpty(overrides)) {
        const firstOverrides = TeamEditorUtils.urlParamstoPlayerEditModels(startingState.overrides);
        setOverrides(firstOverrides);
      }
      if (startingState.editOpen && _.isEmpty(editOpen)) {
        const firstEditOpen = _.chain(startingState.editOpen.split(";")).map(key => {
          const keyVal = key.split("|");
          return [ keyVal[0], keyVal?.[1] ];
        }).fromPairs().value();
        setEditOpen(firstEditOpen);
      }
      // This is the tricky one:
      if (startingState.addedPlayers && _.isEmpty(otherPlayerCache)) {

        const playerTeamYear = (key: string) => {
          const frags = key.split(":");
          return [ frags[0], frags[1] || team, frags[2] || year ] as [ string, string, string ];
        };
        const keyList = (startingState.addedPlayers || "").split(";");
        const codeSet = new Set(keyList.map(k => playerTeamYear(k)[0]));
        const maybeMatchingPlayers = _.filter(dataEvent.players || [], p => codeSet.has(p.code || ""));
        const maybeMatchingPlayersByCode = _.groupBy(maybeMatchingPlayers, p => p.code);

        const firstAddedPlayers = _.chain(keyList).flatMap(key => {
          const [ code, txferTeam, txferYear ] = playerTeamYear(key);

          return TeamEditorUtils.getBasePlayers(
            team, year, maybeMatchingPlayersByCode[code] || [], 
            offSeasonMode, superSeniorsBack, {}, 
            // Build a transfer set explicitly for this player
            [ { [code]: [ { f: txferTeam, t: team } ] } , dataEvent.transfers?.[1] || {} ], txferYear
          );
        }).map(triple => [ triple.key, triple ]).fromPairs().value();  

        setOtherPlayerCache(firstAddedPlayers);
      }

      // Clear the startingState since we've now done this once per load
      setDeletedPlayersIn(undefined);
      setDisabledPlayersIn(undefined);
      setOtherPlayerCacheIn(undefined);
      setOverridesIn(undefined);
      setEditOpenIn(undefined);

      if (needToRebuildBasePlayers) { //(will get called again with the right state because of the setXxx calls)
        return <div></div>;
      }
    }

    const filteredOverrides = _.chain(overrides).toPairs().filter(keyVal => !keyVal[1].pause).fromPairs().value();

    const playerSet = basePlayers.concat(_.values(otherPlayerCache)); 

    const [ teamSosNet, teamSosOff, teamSosDef ] = TeamEditorUtils.calcApproxTeamSoS(basePlayers.map(p => p.orig), avgEff);

    const hasDeletedPlayersOrTransfersIn = !_.isEmpty( //(used to decide if we need to recalc all the minutes)
      _.omit(otherPlayerCache, _.keys(disabledPlayers)) // have added transfers in (and they aren't disabled)
    ) || !_.isEmpty(deletedPlayers); //(or have deleted players)

    TeamEditorUtils.calcAndInjectYearlyImprovement(playerSet, team, teamSosOff, teamSosDef, avgEff, filteredOverrides, offSeasonMode);
    TeamEditorUtils.calcAndInjectMinsAssignment(
      playerSet, team, year, disabledPlayers, filteredOverrides, hasDeletedPlayersOrTransfersIn, teamSosNet, avgEff, offSeasonMode
    );
    if (offSeasonMode) { //(else not projecting, just describing)
      TeamEditorUtils.calcAdvancedAdjustments(playerSet, team, year, disabledPlayers);
    }

    const getOff = (s: PureStatSet) => (s.off_adj_rapm || s.off_adj_rtg)?.value || 0;
    const getDef = (s: PureStatSet) => (s.def_adj_rapm || s.def_adj_rtg)?.value || 0;
    const getNet = (s: PureStatSet) => getOff(s) - getDef(s);

    // Filter player in/out (onlyDisable==true if undisabled as part of deleting that player)
    const togglePlayerDisabled = (triple: GoodBadOkTriple, currDisabled: Record<string, boolean>, onlyDisable: boolean) => {
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
    // Filter player in/out (onlyDisable==true if undisabled as part of deleting that player)
    const togglePlayerEdited = (triple: GoodBadOkTriple, currEdited: Record<string, string>, onlyDisable: boolean) => {
      const newEditedPlayers = _.clone(currEdited);
      if (currEdited[triple.key]) {
        delete newEditedPlayers[triple.key];
        return newEditedPlayers;
      } else if (!onlyDisable) {
        newEditedPlayers[triple.key] = "General";
        return newEditedPlayers;
      } else { //(by request, only do something if it's a disable)
        return undefined;
      }
    };
    const editPlayerOverrides = (triple: GoodBadOkTriple, currOverrides: Record<string, PlayerEditModel>, newOverride: PlayerEditModel | undefined) => {
      const newOverrides = _.clone(overrides);
      if (!newOverride) {
        delete newOverrides[triple.key];
      } else {
        newOverrides[triple.key] = newOverride;
      }
      return newOverrides;
    }

    const editTooltip = <Tooltip id="editTooltip">Show/hide the Player Editor tab</Tooltip>;
    const filterTooltip = <Tooltip id="filterTooltip">
      Filter the player out from the team temporarily. You can delete them permanently from the Player Editor tab tab.
    </Tooltip>

    const buildDataRowFromTriple = (triple: GoodBadOkTriple) => {
      const rosterInfo = triple.orig?.roster ?
        `${triple.orig.roster?.height || "?-?"} ${
          offSeasonMode ? TeamEditorUtils.getNextClass(triple.orig.roster?.year_class) : triple.orig.roster?.year_class
        }` : undefined;

      const override = filteredOverrides[triple.key];

      const isFiltered = disabledPlayers[triple.key]; //(TODO: display some of these fields but with different formatting)
      const name = <b>{triple.orig.key}</b>;
      const maybeTransferName = otherPlayerCache[triple.key] ? <u>{name}</u> : name;

      const hasEditPage = allEditOpen || editOpen[triple.key];

      const prevSeasonEl = showPrevSeasons && offSeasonMode && !isFiltered? {
        title: <small><i>Previous season</i></small>,
        mpg: { value: (triple.orig.off_team_poss_pct?.value || 0)*40 },
        ortg: triple.orig.off_rtg,
        usage: triple.orig.off_usage,
        rebound: { value: triple.orig.def_orb?.value },
        ok_net: { value: getNet(triple.orig) },
        ok_off: { value: getOff(triple.orig) },
        ok_def: { value: getDef(triple.orig) },

      } : undefined;

      const prevPrevSeasonEl = showPrevSeasons && triple.prevYear && !isFiltered ? {
        title: <small><i>Season before</i></small>,
        mpg: { value: (triple.prevYear.off_team_poss_pct?.value || 0)*40 },
        ortg: triple.prevYear.off_rtg,
        usage: triple.prevYear.off_usage,
        rebound: { value: triple.prevYear.def_orb?.value },
        ok_net: { value: getNet(triple.prevYear) },
        ok_off: { value: getOff(triple.prevYear) },
        ok_def: { value: getDef(triple.prevYear) },

      } : undefined;

      const extraInfoOffObj = 
        _.isNil(override?.global_off_adj) ? {} : { extraInfo: `Manually adjusted, see Player Editor tab` };
      const extraInfoDefObj = 
        _.isNil(override?.global_def_adj) ? {} : { extraInfo: `Manually adjusted, see Player Editor tab` };

      const okNet = getNet(triple.ok);
      const okOff = getOff(triple.ok);
      const okDef = getDef(triple.ok);

      const origNet = offSeasonMode ? undefined : getNet(triple.orig);
      const origOff = offSeasonMode ? undefined : getOff(triple.orig);
      const origDef = offSeasonMode ? undefined :  getDef(triple.orig);

      const origNotEqualOk = offSeasonMode ? false : ((okDef != origDef) || (okOff != origOff));

      const tableEl = {
        title: <span>{rosterInfo ? <i>{rosterInfo}&nbsp;/&nbsp;</i> : null}{maybeTransferName}</span>,
        mpg: isFiltered ? undefined : { 
          value: (triple.ok.off_team_poss_pct?.value || 0)*40,
          extraInfo: _.isNil(override?.mins) ? undefined : "Overridden, see Player Editor tab"
        },
        ortg: triple.ok.off_rtg,
        usage: triple.ok.off_usage,
        rebound: isFiltered ? undefined : { value: triple.ok.def_orb?.value },

        pos: <span style={{whiteSpace: "nowrap"}}>{triple.orig.posClass}</span>,

        // In in-season mode, it's the actual if different
        good_net: isFiltered ? undefined : 
          (offSeasonMode ? { value: getNet(triple.good) } : (origNotEqualOk ? { value: origNet } : undefined)),
        good_off: isFiltered ? undefined : 
          (offSeasonMode ? { value: getOff(triple.good) } : (origNotEqualOk ? { value: origOff } : undefined)),
        good_def: isFiltered ? undefined : 
          (offSeasonMode ? { value: getDef(triple.good) } : (origNotEqualOk ? { value: origDef } : undefined)),

        ok_net: isFiltered? undefined : { value: okNet },
        ok_off: isFiltered ? undefined : { value: okOff, ...extraInfoOffObj },
        ok_def: isFiltered ? undefined : { value: okDef, ...extraInfoDefObj  },
        bad_net: (isFiltered || !offSeasonMode) ? undefined : { value: getNet(triple.bad) },
        bad_off: (isFiltered || !offSeasonMode) ? undefined : { value: getOff(triple.bad), ...extraInfoOffObj },
        bad_def: (isFiltered || !offSeasonMode) ? undefined : { value: getDef(triple.bad), ...extraInfoDefObj  },

        edit: <OverlayTrigger overlay={editTooltip} placement="auto">
          <Button variant={hasEditPage ? "secondary" : "outline-secondary"} size="sm" onClick={(ev: any) => {
            const newEditOpen = togglePlayerEdited(triple, editOpen, false);
            if (newEditOpen) {
              setEditOpen(newEditOpen);
            }
        }}><FontAwesomeIcon icon={faPen} /></Button></OverlayTrigger>,
        disable: <OverlayTrigger overlay={filterTooltip} placement="auto">
          <Button variant={disabledPlayers[triple.key] ? "secondary" : "outline-secondary"} size="sm" onClick={(ev:any) => {
            //(insta do this - the visual clue should be sufficient)
            const newDisabledPlayers = togglePlayerDisabled(triple, disabledPlayers, false);
            if (newDisabledPlayers) {
              setDisabledPlayers(newDisabledPlayers);
            }
          }}><FontAwesomeIcon icon={faFilter} /></Button></OverlayTrigger>,
      };

      return (allEditOpen ? [ GenericTableOps.buildHeaderRepeatRow({}, "small") ] : []).concat([ 
        GenericTableOps.buildDataRow(tableEl, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta) 
      ]).concat(
        showPrevSeasons && prevSeasonEl? 
        [ GenericTableOps.buildDataRow(prevSeasonEl, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta) ] : []
      ).concat(
        showPrevSeasons && prevPrevSeasonEl ? 
        [ GenericTableOps.buildDataRow(prevPrevSeasonEl, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta) ] : []
      ).concat(hasEditPage ? 
        [ GenericTableOps.buildTextRow(
            <TeamRosterEditor
              isBench={false}
              overrides={overrides[triple.key]}
              onUpdate={(edit: PlayerEditModel | undefined) => {
                friendlyChange(() => {
                  setOverrides(editPlayerOverrides(triple, overrides, edit));
                 }, true
                );
              }}
              onDelete={() => {
                const tidyUp = (
                  currDisabledPlayers: Record<string, boolean>, currEditedPlayers: Record<string, string>, currOverrides: Record<string, PlayerEditModel>
                ) => {
                  // Tidy up activity: remove from disabled/edited players set
                  const newDisabledPlayers = togglePlayerDisabled(triple, currDisabledPlayers, true);
                  if (newDisabledPlayers) {
                    setDisabledPlayers(newDisabledPlayers);
                  }
                  const newEditOpen = togglePlayerEdited(triple, currEditedPlayers, false);
                  if (newEditOpen) {
                    setEditOpen(newEditOpen);
                  }
                  setOverrides(editPlayerOverrides(triple, currOverrides, undefined))
                };
                if (otherPlayerCache[triple.key]) {
                  const newOtherPlayerCache = _.clone(otherPlayerCache);
                  delete newOtherPlayerCache[triple.key];
                  friendlyChange(() => {
                    setOtherPlayerCache(newOtherPlayerCache);
                    tidyUp(disabledPlayers, editOpen, overrides);
                  }, true);
                } else {
                  const newDeletedPlayers = _.clone(deletedPlayers);
                  newDeletedPlayers[triple.key] = triple.orig.key;
                  friendlyChange(() => {
                    setDeletedPlayers(newDeletedPlayers);
                    tidyUp(disabledPlayers, editOpen, overrides);
                  }, true);
                }      
              }}
            />, "small"
          ), GenericTableOps.buildRowSeparator() ] : []
      ).concat(
        debugMode ? [ 
          GenericTableOps.buildTextRow(
            JSON.stringify(_.omit(triple.diag, [ "off_usage" ]), reduceNumberSize), "small"
          )
        ] : []
      )
    };
    const buildBenchDataRowFromTriple = (triple: GoodBadOkTriple) => {
      const mpg =  (triple.ok.off_team_poss_pct?.value || 0)*40;
      const isFiltered = (mpg == 0);
      const hasEditPage = allEditOpen || editOpen[triple.key];
      const override = filteredOverrides[triple.key];

      const tableEl = {
        title: <b>{triple.orig.key}</b>,
        mpg: { value: mpg },

        good_net: (isFiltered || !offSeasonMode) ? undefined : { value: getNet(triple.good) },
        good_off: (isFiltered || !offSeasonMode) ? undefined : { value: getOff(triple.good) },
        good_def: (isFiltered || !offSeasonMode) ? undefined : { value: getDef(triple.good) },
        ok_net: isFiltered ? undefined : { value: getNet(triple.ok) },
        ok_off: isFiltered ? undefined : { value: getOff(triple.ok) },
        ok_def: isFiltered ? undefined : { value: getDef(triple.ok) },
        bad_net: (isFiltered || !offSeasonMode) ? undefined : { value: getNet(triple.bad) },
        bad_off: (isFiltered || !offSeasonMode) ? undefined : { value: getOff(triple.bad) },
        bad_def: (isFiltered || !offSeasonMode) ? undefined : { value: getDef(triple.bad) },
        edit: <OverlayTrigger overlay={editTooltip} placement="auto">
          <Button variant={hasEditPage ? "secondary" : "outline-secondary"} size="sm" onClick={(ev: any) => {
            const newEditOpen = togglePlayerEdited(triple, editOpen, false);
            if (newEditOpen) {
              setEditOpen(newEditOpen);
            }
        }}><FontAwesomeIcon icon={faPen} /></Button></OverlayTrigger>,
      };
      return [ 
        GenericTableOps.buildDataRow(tableEl, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
      ].concat(hasEditPage ? 
        [ GenericTableOps.buildTextRow(
            <TeamRosterEditor
              isBench={true}
              overrides={overrides[triple.key]}
              onUpdate={(edit: PlayerEditModel | undefined) => {
                friendlyChange(() => {
                  setOverrides(editPlayerOverrides(triple, overrides, edit));
                 }, true
                );
              }}
              onDelete={() => null}
            />, "small"
          ), GenericTableOps.buildRowSeparator() ] : []
      )
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
        rosterGuardMins, rosterWingMins, rosterBigMins, filteredOverrides, alwaysShowBench
      );

    // Now, finally, can build display:

    const rosterTableDataGuards = [ buildPosHeaderRow("Guards", rosterGuardMins) ].concat(_.flatMap(rosterGuards, triple => {
      return buildDataRowFromTriple(triple);
    })).concat(maybeBenchGuard ? buildBenchDataRowFromTriple(maybeBenchGuard) : []);
    const rosterTableDataWings = [ buildPosHeaderRow("Wings", rosterWingMins) ].concat(_.flatMap(rosterWings, triple => {
      return buildDataRowFromTriple(triple);
    })).concat(maybeBenchWing ? buildBenchDataRowFromTriple(maybeBenchWing) : []);
    const rosterTableDataBigs = [ buildPosHeaderRow("Bigs", rosterBigMins) ].concat(_.flatMap(rosterBigs, triple => {
      return buildDataRowFromTriple(triple);
    })).concat(maybeBenchBig ? buildBenchDataRowFromTriple(maybeBenchBig) : []);

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

    /** (Util to add the bench to a collection of players) */
    const addBench = (from: GoodBadOkTriple[]) => {
      return from
        .concat(maybeBenchGuard ? [ maybeBenchGuard ] : [])
        .concat(maybeBenchWing ? [ maybeBenchWing ] : [])
        .concat(maybeBenchBig ? [ maybeBenchBig ] : [])
    };
    const filteredPlayerSet = addBench(
      playerSet.filter(triple => !disabledPlayers[triple.key])
    );

    // Team totals:

    //(Diagnostic)
    //const totalMins = _.sumBy(filteredPlayerSet, p => p.ok.off_team_poss_pct.value!)*0.2;

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

    const rawTotalMins = rawTeam ? 
      _.sumBy(rawTeam, p => p.orig?.off_team_poss_pct.value || 0) : 5.0;
    const getRawBenchLevel = (5.0 - rawTotalMins)*TeamEditorUtils.getBenchLevelScoring(team, year);
    const rawNetSum = rawTeam ? 
      (_.sumBy(rawTeam, p => (p.orig?.off_team_poss_pct.value || 0)*getNet(p.orig)) + 2*getRawBenchLevel)
      : undefined;
    const rawOffSum = rawTeam ? 
      (_.sumBy(rawTeam, p => (p.orig?.off_team_poss_pct.value || 0)*getOff(p.orig)) + getRawBenchLevel)
      : undefined;
    const rawDefSum = rawTeam ? 
      (_.sumBy(rawTeam, p => (p.orig?.off_team_poss_pct.value || 0)*getDef(p.orig)) - getRawBenchLevel)
      : undefined;

    const dummyTeamOk = {
      off_net: { value: okTotals.net },
      off_adj_ppp: { value: okTotals.off + avgEff },
      def_adj_ppp: { value: okTotals.def + avgEff },
    };
    const dummyTeamGood = { //(in "in-season" mode, reports the original values)
      off_net: !_.isNil(rawNetSum) ? { value: rawNetSum } : { value: okTotals.net + goodDeltaNet },
      off_adj_ppp: !_.isNil(rawOffSum) ? { value: rawOffSum + avgEff } : { value: okTotals.off + avgEff + goodDeltaOff },
      def_adj_ppp: !_.isNil(rawDefSum) ? { value: rawDefSum + avgEff } : { value: okTotals.def + avgEff + goodDeltaDef },
    };
    const dummyTeamBad = {
      off_net: { value: okTotals.net + badDeltaNet },
      off_adj_ppp: { value: okTotals.off + avgEff + badDeltaOff },
      def_adj_ppp: { value: okTotals.def + avgEff + badDeltaDef },
    };
    const teamGradesOk = divisionStatsCache.Combo ?
      GradeUtils.buildTeamPercentiles(divisionStatsCache.Combo, dummyTeamOk, [ "net", "adj_ppp" ], true) : {};
    const teamGradesGood = divisionStatsCache.Combo ?
      GradeUtils.buildTeamPercentiles(divisionStatsCache.Combo, dummyTeamGood, [ "net", "adj_ppp" ], true) : {};
    const teamGradesBad = divisionStatsCache.Combo ?
      GradeUtils.buildTeamPercentiles(divisionStatsCache.Combo, dummyTeamBad, [ "net", "adj_ppp" ], true) : {};

    const subHeaders = [ 
      GenericTableOps.buildSubHeaderRow(
        [ 
          [ <div/>, 9 ], 
          [ <i>{offSeasonMode ? "Optimistic" : "Actual results"}</i>, 4 ], [ <div/>, 1 ], 
            [ <i>{offSeasonMode ? "Balanced" : "Adjusted results"}</i>, 4 ], [ <div/>, 1 ], 
            [ <i>{offSeasonMode ? "Pessimistic" : "(Unused)"}</i>, 4 ], [ <div/>, 1 ],
          [ <div/>, 2 ]
        ], "small text-center"
      ),
    ].concat(_.isEmpty(filteredPlayerSet) ? [] : [
      GenericTableOps.buildDataRow({
        title: <b>Team Totals</b>,
        //(for diag only)
        //mpg: { value: totalMins*40 },
        ok_net: { value: okTotals.net },
        ok_off: { value: okTotals.off + avgEff },
        ok_def: { value: okTotals.def + avgEff },
        good_net: !_.isNil(rawNetSum) ? { value: rawNetSum } : { value: okTotals.net + goodDeltaNet },
        good_off: !_.isNil(rawOffSum) ? { value: rawOffSum + avgEff } : { value: okTotals.off + goodDeltaOff + avgEff },
        good_def: !_.isNil(rawDefSum) ? { value: rawDefSum + avgEff } : { value: okTotals.def + goodDeltaDef + avgEff },
        bad_net: offSeasonMode ? { value: okTotals.net + badDeltaNet } : undefined,
        bad_off: offSeasonMode ? { value: okTotals.off + badDeltaOff + avgEff } : undefined,
        bad_def: offSeasonMode ? { value: okTotals.def + badDeltaDef + avgEff } : undefined,
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
        bad_net: offSeasonMode ? teamGradesBad.off_net : undefined,
        bad_off: offSeasonMode ? teamGradesBad.off_adj_ppp : undefined,
        bad_def: offSeasonMode ? teamGradesBad.def_adj_ppp : undefined,
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta, gradeTableDef),
    ]);
    //TODO: Add: Transfer | Generic | D1

    return <GenericTable
      tableCopyId="rosterEditorTable"
      tableFields={tableDef}
      tableData={subHeaders.concat(rosterTableData)}
      cellTooltipMode={undefined}
    />;
  }, [ dataEvent, year, team, 
      otherPlayerCache, deletedPlayers, disabledPlayers, overrides, divisionStatsCache, debugMode, showPrevSeasons,
      allEditOpen, editOpen ]);

  const playerLeaderboard = React.useMemo(() => {
    setLboardParams(startingState);
    return <PlayerLeaderboardTable
      startingState={{
        ...startingState,
        year: onlyThisYear ? startingState.year : "All",
        tier: "All"
      }}
      dataEvent={reloadData ?
        {} : 
        (lboardAltDataSource ?
          lboardAltDataSource :
          {
            ...dataEvent, 
            players: onlyThisYear ? (dataEvent.players || []).filter(p => p.year == year) : dataEvent.players, 
            transfers: (onlyTransfers && hasTransfers) ? dataEvent.transfers?.[0] : undefined 
          }
        )
      }
      onChangeState={(newParams: PlayerLeaderboardParams) => {
        const dataSubEventKey = newParams.t100 ?
          "t100" : (newParams.confOnly ? "conf" : "all");

        if (dataSubEventKey != "all") {
          //TODO: not supporting this correctly right now because not guaranteed to have players in memory
          //so might not be able to reconstruct fro the keys
          const fetchAll = LeaderboardUtils.getMultiYearPlayerLboards(
            dataSubEventKey, gender, year, "All", [ LeaderboardUtils.getOffseasonOfYear(year) || "" ], true
          );
    
          fetchAll.then((jsonsIn: any[]) => {
            const jsons = _.dropRight(jsonsIn, 1);
            setLboardAltDataSource({
              players: _.chain(jsons).map(d => (d.players || []).map((p: any) => { p.tier = d.tier; return p; }) || []).flatten().value(),
              confs: _.chain(jsons).map(d => d.confs || []).flatten().uniq().value(),
              transfers: _.last(jsonsIn) as Record<string, Array<TransferModel>>,
              lastUpdated: 0 //TODO use max?
            });
          });
        } else {
          setLboardAltDataSource(undefined); //(use default)
        }
        setLboardParams(newParams);
      }}
      teamEditorMode={(p: IndivStatSet) => {
        const newOtherPlayerCache = _.clone(otherPlayerCache);

        TeamEditorUtils.getBasePlayers(
          team, year, (dataEvent.players || []).filter(maybeP => maybeP.code == p.code), 
          offSeasonMode, superSeniorsBack, {}, 
          // Build a transfer set explicitly for this player
          [ { [p.code || ""]: [ { f: (p.team || ""), t: team } ] } , dataEvent.transfers?.[1] || {} ], p.year || year
        ).forEach(triple => {
          newOtherPlayerCache[triple.key] = triple;
        });

        friendlyChange(() => {
          setOtherPlayerCache(newOtherPlayerCache);
        }, true);
      }}
    />;
  }, [ dataEvent, reloadData, team, year, otherPlayerCache, onlyTransfers, onlyThisYear, setLboardAltDataSource ]);

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
                setDisabledPlayers({});
                setDeletedPlayers({});
                setEditOpen({});
                setOverrides({})
                setLboardAltDataSource(undefined);
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
                setDisabledPlayers({});
                setDeletedPlayers({});
                setEditOpen({});
                setOverrides({})
                setLboardAltDataSource(undefined);
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
                setDisabledPlayers({});
                setDeletedPlayers({});
                setEditOpen({});
                setOverrides({})
              }, (teamYear[0] != team) && (teamYear[1] != year));
            } else {
               friendlyChange(() => {
                setTeam(selection);
                setOtherPlayerCache({});
                setDisabledPlayers({});
                setDeletedPlayers({});
                setEditOpen({});
                setOverrides({})
               }, team != selection);
            }
          }}
        />
      </Col>
      <Col lg={1} className="mt-1">
        {getCopyLinkButton()}
      </Col>
      <Form.Group as={Col} sm="1">
        <GenericTogglingMenu>
          <GenericTogglingMenuItem
                text={"Show players' previous seasons"}
                truthVal={showPrevSeasons}
                onSelect={() => friendlyChange(() => setShowPrevSeasons(!showPrevSeasons), true)}
              />
          <GenericTogglingMenuItem
                text={"Always show bench minutes"}
                truthVal={alwaysShowBench}
                onSelect={() => friendlyChange(() => setAlwaysShowBench(!alwaysShowBench), true)}
              />
          <Dropdown.Divider />
          <GenericTogglingMenuItem
                text={"Super-senior season used"}
                truthVal={superSeniorsBack}
                onSelect={() => friendlyChange(() => setSuperSeniorsBack(!superSeniorsBack), true)}
              />
          <GenericTogglingMenuItem
                text={"Off-season mode"}
                truthVal={offSeasonMode}
                onSelect={() => friendlyChange(() => setOffSeasonMode(!offSeasonMode), true)}
              />
          <Dropdown.Divider />
          <GenericTogglingMenuItem
              text={"Debug/Diagnostic mode"}
              truthVal={debugMode}
              onSelect={() => friendlyChange(() => setDebugMode(!debugMode), true)}
            />
        </GenericTogglingMenu>
      </Form.Group>
    </Form.Group>
    <Row>
      <Col xs={12} sm={12} md={12} lg={8}>
        <ToggleButtonGroup items={([
            {
              label: "History",
              tooltip: "If enabled show player's previous 2 seasons (useful sanity check for projections)",
              toggled: showPrevSeasons,
              onClick: () => friendlyChange(() => setShowPrevSeasons(!showPrevSeasons), true)
            },
            {
              label: "Bench",
              tooltip: "If enabled show bench position groups even if they play no minutes (useful if you want to override the minutes)",
              toggled: alwaysShowBench,
              onClick: () => friendlyChange(() => setAlwaysShowBench(!alwaysShowBench), true)
            },
            {
              label: "Super Sr",
              tooltip: "If enabled, assume seniors with eligibility will return (or you can add them from 'Add New Players'",
              toggled: superSeniorsBack,
              onClick: () => friendlyChange(() => setSuperSeniorsBack(!superSeniorsBack), true)
            },
            {
              label: "Offseason",
              tooltip: "In 'on-season' mode shows the current teams' statistics (useful for looking at the effect of injuries)",
              toggled: offSeasonMode,
              onClick: () => friendlyChange(() => setOffSeasonMode(!offSeasonMode), true)
            },
        ])}
        />
      </Col>
    </Row>
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
                <Form.Check type="switch" disabled={!hasTransfers}
                  id="onlyTransfers"
                  checked={onlyTransfers && hasTransfers}
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
                <Form.Check type="switch" disabled={false}
                  id="onlyThisYear"
                  checked={onlyThisYear}
                  onChange={() => {
                    setTimeout(() => {
                      setReloadData(true);
                      setOnlyThisYear(!onlyThisYear);
                      setTimeout(() => {
                        setReloadData(false);
                      }, 100);
                    }, 250);
                  }}
                  label="Only show this season"
                />
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
