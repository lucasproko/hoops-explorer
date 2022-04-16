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
import { PlayerLeaderboardParams, ParamDefaults, TeamEditorParams } from '../utils/FilterModels';
import { GoodBadOkTriple, PlayerEditModel, TeamEditorUtils } from '../utils/stats/TeamEditorUtils';

import { StatModels, IndivStatSet, PureStatSet, DivisionStatistics } from '../utils/StatModels';
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import GenericCollapsibleCard from './shared/GenericCollapsibleCard';
import { GradeUtils } from '../utils/stats/GradeUtils';
import { LeaderboardUtils, TransferModel } from '../utils/LeaderboardUtils';
import TeamRosterEditor from './shared/TeamRosterEditor';
import { TeamEditorTableUtils } from '../utils/tables/TeamEditorTableUtils';
import { UrlRouting } from '../utils/UrlRouting';
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';

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
  onChangeState: (newParams: TeamEditorParams) => void,
  overrideGrades?: DivisionStatistics
}


/** Handy util for reducing number format for JSON readability (in diag mode, can remove once that has been replaced) */
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

const TeamEditorTable: React.FunctionComponent<Props> = ({startingState, dataEvent, onChangeState, overrideGrades}) => {
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
  const [ evalMode, setEvalMode ] = useState(_.isNil(startingState.evalMode) ? false : startingState.evalMode);
  const [ offSeasonMode, setOffSeasonMode ] = useState(evalMode || (_.isNil(startingState.offSeason) ? true : startingState.offSeason));
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
  const [ uiDeletedPlayersIn, setUiDeletedPlayersIn ] = useState((startingState.deletedPlayers || "") as string | undefined);
  const [ editOpenIn, setEditOpenIn ] = useState((startingState.editOpen || "") as string | undefined);
  const [ uiOverridesIn, setUiOverridesIn ] = useState((startingState.overrides || "") as string | undefined);

  const [ otherPlayerCache, setOtherPlayerCache ] = useState({} as Record<string, GoodBadOkTriple>);
  const [ disabledPlayers, setDisabledPlayers ] = useState({} as Record<string, boolean>);
  const [ deletedPlayers, setDeletedPlayers ] = useState({} as Record<string, string>); //(value is key, for display)
  const [ uiOverrides, setUiOverrides ] = useState({} as Record<string, PlayerEditModel>);

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

  const [ addNewPlayerMode, setAddNewPlayerMode ] = useState(overrideGrades != undefined); //(can't override this from URL)

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
      deletedPlayers: _.isNil(uiDeletedPlayersIn) ? _.keys(deletedPlayers).join(";") : uiDeletedPlayersIn,
      disabledPlayers: _.isNil(disabledPlayersIn) ? _.keys(disabledPlayers).join(";") : disabledPlayersIn,
      overrides: _.isNil(uiOverridesIn) ? 
        _.map(uiOverrides, (value, key) => TeamEditorUtils.playerEditModelToUrlParams(key, value)).join(";") : uiOverridesIn,
      editOpen: _.isNil(editOpenIn) ? _.map(editOpen, (value, key) => `${key}|${value}`).join(";") : editOpenIn,
      // Editor specific settings for transfer view
      showOnlyTransfers: onlyTransfers,
      showOnlyCurrentYear: onlyThisYear,
      offSeason: offSeasonMode,
      showPrevSeasons: showPrevSeasons,
      alwaysShowBench: alwaysShowBench,
      superSeniorsBack: superSeniorsBack,
      evalMode: evalMode,
      allEditOpen: allEditOpen
    };
    onChangeState(newState);
  }, [ 
    year, gender, team,
    onlyTransfers, onlyThisYear, allEditOpen,
    otherPlayerCache, disabledPlayers, deletedPlayers, uiOverrides, editOpen,
    lboardParams, showPrevSeasons, offSeasonMode, alwaysShowBench, superSeniorsBack, evalMode
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

  /** The year from which we're taking the grades - other averages need to come from that season */
  const gradeYear = (yearIn: string, evalModeIn: boolean) => {
    const firstYearWithGrades = evalModeIn ? "2018/9" : "2019/20";
    return ((yearIn == "All") || (yearIn <= firstYearWithGrades)) 
        ? ParamDefaults.defaultLeaderboardYear 
        : (!evalMode ? yearIn : LeaderboardUtils.getNextYear(yearIn));
  };

  // Events that trigger building or rebuilding the division stats cache
  useEffect(() => {
    const params = {
      ...startingState, gender,
      year: gradeYear(year, evalMode)
    };

    if (!_.isEmpty(divisionStatsCache)) setDivisionStatsCache({}); //unset if set
    GradeTableUtils.populateDivisionStatsCache(params, statsCache => {
      setDivisionStatsCache(statsCache);
    });
  }, [ year, gender, evalMode ]);

  /////////////////////////////////////

  // Build Team table

  const rosterTable = React.useMemo(() => {
    setLoadingOverride(false);

    // First time through ... Rebuild the state from the input params
    if ((!_.isEmpty(dataEvent.players || [])) && (
      //(first time only)
      !_.isNil(uiDeletedPlayersIn) && !_.isNil(otherPlayerCacheIn) && !_.isNil(disabledPlayersIn) && 
      !_.isNil(uiOverrides) && !_.isNil(editOpenIn) 
    )) {

      //TODO: there is a bug here in that if I go fetch the T100 or CONF versions of a player
      // then on page reload it will go get the original versions
      // (note converse is not true because my dataset is always the old one)
      // Options:
      // 1] mark T100/conf players in the key and then go fetch the data from those :(
      // 2] I guess store the stats in the URL :( :(
      // 3] Block use of T100/conf for now <-- this is what I've gone with

      const needToRebuildBasePlayers = 
        (((startingState.deletedPlayers || "") != "") && _.isEmpty(deletedPlayers)) ||
        (((startingState.addedPlayers || "") != "")  && _.isEmpty(otherPlayerCache)) ||
        (((startingState.disabledPlayers || "") != "")  && _.isEmpty(disabledPlayers)) ||
        (((startingState.overrides || "") != "")  && _.isEmpty(uiOverrides)) ||
        (((startingState.editOpen || "") != "")  && _.isEmpty(editOpen));

      if (startingState.deletedPlayers && _.isEmpty(deletedPlayers)) {
        const deletedPlayersSet = startingState.deletedPlayers.split(";");
        setDeletedPlayers(_.fromPairs(deletedPlayersSet.map(p => [ p, "unknown" ]))); //(gets filled in later)
      }
      if (startingState.disabledPlayers && _.isEmpty(disabledPlayers)) {
        const firstDisabledPlayers = _.chain(startingState.disabledPlayers.split(";")).map(key => {
          return [ key, true];
        }).fromPairs().value();
        setDisabledPlayers(firstDisabledPlayers);
      }
      if (startingState.overrides && _.isEmpty(uiOverrides)) {
        const firstOverrides = TeamEditorUtils.urlParamstoPlayerEditModels(startingState.overrides);
        setUiOverrides(firstOverrides);
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
        const maybeMatchingPlayers = _.filter(dataEvent.players || [], p => codeSet.has(p.code || "") && ((p.year || "") <= year));
        const maybeMatchingPlayersByCode = _.groupBy(maybeMatchingPlayers, p => p.code);

        const firstAddedPlayers = _.chain(keyList).flatMap(key => {
          const [ code, txferTeam, txferYear ] = playerTeamYear(key);

          return TeamEditorUtils.getBasePlayers(
            team, year, maybeMatchingPlayersByCode[code] || [], 
            offSeasonMode, superSeniorsBack, undefined, {}, 
            // Build a transfer set explicitly for this player
            [ { [code]: [ { f: txferTeam, t: team } ] } , dataEvent.transfers?.[1] || {} ], txferYear
          );
        }).map(triple => [ triple.key, triple ]).fromPairs().value();  

        setOtherPlayerCache(firstAddedPlayers);
      }

      // Clear the startingState since we've now done this once per load
      setUiDeletedPlayersIn(undefined);
      setDisabledPlayersIn(undefined);
      setOtherPlayerCacheIn(undefined);
      setUiOverridesIn(undefined);
      setEditOpenIn(undefined);

      if (needToRebuildBasePlayers) { //(will get called again with the right state because of the setXxx calls)
        return <div></div>;
      }
    }

    ///////////////////////////////////////////////

    // Processing - various pxResults are used in the buildXxx functions below

    const genderYearLookupForAvgEff = `${gender}_${gradeYear(year, evalMode)}`; //(use whatever year we're taking grades for)
    const avgEff = efficiencyAverages[genderYearLookupForAvgEff] || efficiencyAverages.fallback;

    const pxResults = TeamEditorUtils.teamBuildingPipeline(
      gender, team, year,
      dataEvent.players || [], dataEvent.transfers || [],
      offSeasonMode, evalMode,
      otherPlayerCache, uiOverrides, deletedPlayers, disabledPlayers,
      superSeniorsBack, alwaysShowBench,
      avgEff
    );

    ///////////////////////////////////////////////

    // Display functions

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
      const newOverrides = _.clone(uiOverrides);
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
          (offSeasonMode && !triple.isOnlyActualResults) ? 
            TeamEditorUtils.getNextClass(triple.orig.roster?.year_class) : triple.orig.roster?.year_class
        }` : undefined;

      const playerLeaderboardParams = {
        tier: "All",
        year: "All",
        filter: `${triple.orig.key}:;`,
        sortBy: "desc:year",
        showInfoSubHeader: true
      };
      const playerLboardTooltip = (
        <Tooltip id={`lboard_${triple.orig.code}`}>Open new tab showing all the player's seasons, in the multi-year version of the leaderboard</Tooltip>
      );
      const name = triple.orig.key;
      const maybeTransferName = otherPlayerCache[triple.key] ? <i>{name}</i> : name;
      const playerLink = <OverlayTrigger placement="auto" overlay={playerLboardTooltip}>
        <a target="_blank" href={UrlRouting.getPlayerLeaderboardUrl(playerLeaderboardParams)}><b>{maybeTransferName}</b></a>
      </OverlayTrigger>;

      const override = pxResults.unpausedOverrides[triple.key];

      // (In "in-season mode" always put added players in the adjusted column)
      const isAddedPlayer = !offSeasonMode && otherPlayerCache[triple.key];

      const isFiltered = disabledPlayers[triple.key] || triple.isOnlyActualResults; //(TODO: display some of these fields but with different formatting?)

      const hasEditPage = allEditOpen || editOpen[triple.key];

      const prevSeasonEl = showPrevSeasons && offSeasonMode && !triple.manualProfile && !isFiltered? {
        title: <small><i>Previous season</i></small>,
        mpg: { value: (triple.orig.off_team_poss_pct?.value || 0)*40 },
        ortg: triple.orig.off_rtg,
        usage: triple.orig.off_usage,
        rebound: { value: triple.orig.def_orb?.value },
        ok_net: { value: TeamEditorUtils.getNet(triple.orig) },
        ok_off: { value: TeamEditorUtils.getOff(triple.orig) },
        ok_def: { value: TeamEditorUtils.getDef(triple.orig) },

      } : undefined;

      const prevPrevSeasonEl = showPrevSeasons && triple.prevYear && !isFiltered ? {
        title: <small><i>Season before</i></small>,
        mpg: { value: (triple.prevYear.off_team_poss_pct?.value || 0)*40 },
        ortg: triple.prevYear.off_rtg,
        usage: triple.prevYear.off_usage,
        rebound: { value: triple.prevYear.def_orb?.value },
        ok_net: { value: TeamEditorUtils.getNet(triple.prevYear) },
        ok_off: { value: TeamEditorUtils.getOff(triple.prevYear) },
        ok_def: { value: TeamEditorUtils.getDef(triple.prevYear) },

      } : undefined;

      const extraInfoOffObj = 
        _.isNil(override?.global_off_adj) ? {} : { extraInfo: `Manually adjusted, see Player Editor tab` };
      const extraInfoDefObj = 
        _.isNil(override?.global_def_adj) ? {} : { extraInfo: `Manually adjusted, see Player Editor tab` };

      const okNet = TeamEditorUtils.getNet(triple.ok);
      const okOff = TeamEditorUtils.getOff(triple.ok);
      const okDef = TeamEditorUtils.getDef(triple.ok);

      const origNet = offSeasonMode ? undefined : TeamEditorUtils.getNet(triple.orig);
      const origOff = offSeasonMode ? undefined : TeamEditorUtils.getOff(triple.orig);
      const origDef = offSeasonMode ? undefined :  TeamEditorUtils.getDef(triple.orig);

      const origNotEqualOk = offSeasonMode ? false : ((okDef != origDef) || (okOff != origOff));

      const tableEl = {
        title: <span>{rosterInfo ? <i>{rosterInfo}&nbsp;/&nbsp;</i> : null}{playerLink}</span>,
        actual_mpg: (evalMode && triple.actualResults) ? 
        { 
          value: (triple.actualResults.off_team_poss_pct?.value || 0)*40,
        } : (
          offSeasonMode ? undefined : { value: (triple.orig.off_team_poss_pct?.value || 0)*40, }
        ),
        mpg: isFiltered ? undefined : { 
          value: (triple.ok.off_team_poss_pct?.value || 0)*40,
          extraInfo: _.isNil(override?.mins) ? undefined : "Overridden, see Player Editor tab"
        },
        ortg: triple.ok.off_rtg,
        usage: triple.ok.off_usage,
        rebound: (isFiltered || !triple.ok.def_orb) ? undefined : { value: triple.ok.def_orb?.value },

        pos: <span style={{whiteSpace: "nowrap"}}>{triple.orig.posClass}</span>,

        actual_net: (evalMode && triple.actualResults) ? { value: TeamEditorUtils.getNet(triple.actualResults) } : undefined,
        actual_off: (evalMode && triple.actualResults) ? { value: TeamEditorUtils.getOff(triple.actualResults) } : undefined,
        actual_def: (evalMode && triple.actualResults) ? { value: TeamEditorUtils.getDef(triple.actualResults) } : undefined,

        // In in-season mode, it's the adjusted if different
        good_net: isFiltered ? undefined : 
          (offSeasonMode ? { value: TeamEditorUtils.getNet(triple.good) } : ((origNotEqualOk || isAddedPlayer) ? { value: okNet } : undefined)),
        good_off: isFiltered ? undefined : 
          (offSeasonMode ? { value: TeamEditorUtils.getOff(triple.good) } : ((origNotEqualOk || isAddedPlayer) ? { value: okOff } : undefined)),
        good_def: isFiltered ? undefined : 
          (offSeasonMode ? { value: TeamEditorUtils.getDef(triple.good) } : ((origNotEqualOk || isAddedPlayer) ? { value: okDef } : undefined)),

        // In in-season mode, it's the original if different
        ok_net: ((isFiltered && offSeasonMode) || isAddedPlayer) ? undefined : 
          offSeasonMode ? { value: okNet }: { value: origNet },
        ok_off: ((isFiltered && offSeasonMode) || isAddedPlayer) ? undefined : 
          offSeasonMode ? { value: okOff, ...extraInfoOffObj } : { value: origOff },
        ok_def: ((isFiltered && offSeasonMode) || isAddedPlayer) ? undefined : 
          offSeasonMode ? { value: okDef, ...extraInfoDefObj  } : { value: origDef },

        bad_net: (isFiltered || !offSeasonMode) ? undefined : { value: TeamEditorUtils.getNet(triple.bad) },
        bad_off: (isFiltered || !offSeasonMode) ? undefined : { value: TeamEditorUtils.getOff(triple.bad), ...extraInfoOffObj },
        bad_def: (isFiltered || !offSeasonMode) ? undefined : { value: TeamEditorUtils.getDef(triple.bad), ...extraInfoDefObj  },

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
              addNewPlayerMode={false}
              overrides={pxResults.allOverrides[triple.key]}
              onUpdate={(edit: PlayerEditModel | undefined) => {
                friendlyChange(() => {
                  setUiOverrides(editPlayerOverrides(triple, uiOverrides, edit));
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
                  setUiOverrides(editPlayerOverrides(triple, currOverrides, undefined))
                };
                if (otherPlayerCache[triple.key]) {
                  const newOtherPlayerCache = _.clone(otherPlayerCache);
                  delete newOtherPlayerCache[triple.key];
                  friendlyChange(() => {
                    setOtherPlayerCache(newOtherPlayerCache);
                    tidyUp(disabledPlayers, editOpen, uiOverrides);
                  }, true);
                } else {
                  const newDeletedPlayers = _.clone(deletedPlayers);
                  newDeletedPlayers[triple.key] = triple.orig.key;
                  friendlyChange(() => {
                    if (!pxResults.allOverrides[triple.key]?.name) { //(else just needs to be cleared from overrides below)
                      setDeletedPlayers(newDeletedPlayers);
                    }
                    tidyUp(disabledPlayers, editOpen, uiOverrides);
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

      const benchOverrides = pxResults.allOverrides[triple.key];
      const benchOffOver = benchOverrides?.global_off_adj || 0;
      const benchDefOver = benchOverrides?.global_def_adj || 0;
      const hasBenchOverride = (benchOffOver != 0) || (benchDefOver != 0);
      const showCol = offSeasonMode || hasBenchOverride;

      const tableEl = {
        title: <b>{triple.orig.key}</b>,
        mpg: { value: mpg },

        good_net: (isFiltered || !showCol) ? undefined : 
          (offSeasonMode ? { value: TeamEditorUtils.getNet(triple.good) } : { value: TeamEditorUtils.getNet(triple.ok) }),
        good_off: (isFiltered || !showCol) ? undefined : 
          (offSeasonMode ? { value: TeamEditorUtils.getOff(triple.good) } : { value: TeamEditorUtils.getOff(triple.ok) }),
        good_def: (isFiltered || !showCol) ? undefined : 
          (offSeasonMode ? { value: TeamEditorUtils.getDef(triple.good) } : { value: TeamEditorUtils.getDef(triple.ok) }),
        ok_net: isFiltered ? undefined : 
          (offSeasonMode ? { value: TeamEditorUtils.getNet(triple.ok) } : { value: TeamEditorUtils.getNet(triple.ok) - (benchOffOver - benchDefOver) }),
        ok_off: isFiltered ? undefined : 
          (offSeasonMode ? { value: TeamEditorUtils.getOff(triple.ok) } : { value: TeamEditorUtils.getOff(triple.ok) - benchOffOver }),
        ok_def: isFiltered ? undefined : 
          (offSeasonMode ? { value: TeamEditorUtils.getDef(triple.ok) } : { value: TeamEditorUtils.getDef(triple.ok) + benchDefOver }),
        bad_net: (isFiltered || !offSeasonMode) ? undefined : { value: TeamEditorUtils.getNet(triple.bad) },
        bad_off: (isFiltered || !offSeasonMode) ? undefined : { value: TeamEditorUtils.getOff(triple.bad) },
        bad_def: (isFiltered || !offSeasonMode) ? undefined : { value: TeamEditorUtils.getDef(triple.bad) },
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
              addNewPlayerMode={false}
              overrides={benchOverrides}
              onUpdate={(edit: PlayerEditModel | undefined) => {
                friendlyChange(() => {
                  setUiOverrides(editPlayerOverrides(triple, uiOverrides, edit));
                 }, true
                );
              }}
              onDelete={() => null}
            />, "small"
          ), GenericTableOps.buildRowSeparator() ] : []
      )
    };

    const buildPosHeaderRow = (posName: string, pct: number) => GenericTableOps.buildSubHeaderRow(
      evalMode ? [
        [ <div/>, 6 ], 
        [ <div/>, 4 ], [ <div/>, 1 ], 
        [ <div><b>{posName}</b> ({(100*pct).toFixed(0)}%)</div>, 4 ], [ <div/>, 1 ], 
        [ <div/>, 12 ]
      ] : [ 
        [ <div/>, 9 + (offSeasonMode ? 0 : 1) ], 
        [ <div><b>{posName}</b> ({(100*pct).toFixed(0)}%)</div>, 4 ], [ <div/>, 1 ], 
        [ <div/>, 12 ], 
      ], "small text-center"
    );

    /** actualResultsForReview / inSeasonPlayerResultsList are basically the same thing, except the former comes in 
     * offSeasonMode+evalMode whereas the latter comes in !offSeasonMode
     * TODO: merge them at some point
     */
    const buildTeamRows = (
      actualResultsForReview: GoodBadOkTriple[], inSeasonPlayerResultsList: GoodBadOkTriple[] | undefined,
      avgEff: number
    ) => {
      /** (Util to add the bench to a collection of players) */
      const addBench = (from: GoodBadOkTriple[]) => {
        return from
          .concat(maybeBenchGuard ? [ maybeBenchGuard ] : [])
          .concat(maybeBenchWing ? [ maybeBenchWing ] : [])
          .concat(maybeBenchBig ? [ maybeBenchBig ] : [])
      };
      const filteredPlayerSet = addBench(
        pxResults.basePlayersPlusHypos.filter(triple => !disabledPlayers[triple.key])
      );

      //(Diagnostic - will display if it's <0)
      const totalMins = _.sumBy(filteredPlayerSet, p => p.ok.off_team_poss_pct.value!)*0.2;
      const totalActualMins = evalMode ? _.sumBy(actualResultsForReview, p => p.orig.off_team_poss_pct.value!)*0.2 : undefined;
      const finalActualEffAdj = totalActualMins ? 
        5.0*Math.max(0, 1.0 - totalActualMins)*TeamEditorUtils.getBenchLevelScoring(team, year) : 0;

      const buildTotals = (triples: GoodBadOkTriple[], range: "good" | "bad" | "ok" | "orig", adj: number = 0) => {
        const off = _.sumBy(triples, triple => {
          return (triple[range]?.off_team_poss_pct.value || 0)*TeamEditorUtils.getOff(triple[range] || {});
        }) + adj;
        const def = _.sumBy(triples, triple => {
          return (triple[range]?.off_team_poss_pct.value || 0)*TeamEditorUtils.getDef(triple[range] || {});
        }) - adj;
        const net = _.sumBy(triples, triple => {
          return (triple[range]?.off_team_poss_pct.value || 0)*TeamEditorUtils.getNet(triple[range] || {});
        }) + 2*adj;
        return { off, def, net };
      };
      const okTotals = buildTotals(filteredPlayerSet, "ok");

      // Off-season and eval mode only: good and bad vs neutral ... In-season: ok vs orig
      const stdDevFactor = 1.0/Math.sqrt(5); //(1 std dev, so divide by root of team size)
      const goodRange = offSeasonMode ? buildTotals(filteredPlayerSet, "good") : okTotals;
      const badRange = offSeasonMode ? buildTotals(filteredPlayerSet, "bad") : okTotals;
      //(ignore in in-season mode)
      const goodDeltaNet = (goodRange.net - okTotals.net)*stdDevFactor ;
      const goodDeltaOff = (goodRange.off - okTotals.off)*stdDevFactor;
      const goodDeltaDef = (goodRange.def - okTotals.def)*stdDevFactor;
      const badDeltaNet = (badRange.net - okTotals.net)*stdDevFactor;
      const badDeltaOff = (badRange.off - okTotals.off)*stdDevFactor;
      const badDeltaDef = (badRange.def - okTotals.def)*stdDevFactor;
      //(in-season)
      const origTotals = offSeasonMode ? okTotals : buildTotals(filteredPlayerSet, "orig");
      const inSeasonDeltaNet = (okTotals.net - origTotals.net);
      const inSeasonDeltaOff = (okTotals.off - origTotals.off);
      const inSeasonDeltaDef = (okTotals.def - origTotals.def);

      // In-season mode only
      const rawTotalMins = inSeasonPlayerResultsList ? 
        _.sumBy(inSeasonPlayerResultsList, p => p.orig?.off_team_poss_pct.value || 0) : 5.0;
      const getRawBenchLevel = Math.max(0, 5.0 - rawTotalMins)*TeamEditorUtils.getBenchLevelScoring(team, year);
      const rawNetSum = inSeasonPlayerResultsList ? 
        (_.sumBy(inSeasonPlayerResultsList, p => (p.orig?.off_team_poss_pct.value || 0)*TeamEditorUtils.getNet(p.orig))
         + 2*getRawBenchLevel
        ) : undefined;
      const rawOffSum = inSeasonPlayerResultsList ? 
        (_.sumBy(inSeasonPlayerResultsList, p => (p.orig?.off_team_poss_pct.value || 0)*TeamEditorUtils.getOff(p.orig)) 
         + getRawBenchLevel
        ) : undefined;
      const rawDefSum = inSeasonPlayerResultsList ? 
        (_.sumBy(inSeasonPlayerResultsList, p => (p.orig?.off_team_poss_pct.value || 0)*TeamEditorUtils.getDef(p.orig))
         - getRawBenchLevel
        ) : undefined;
      // Avoid bench adjustment weirdness until user does something
      const somethingHasChanged = (inSeasonDeltaNet > 0) 
        || !_.isEmpty(deletedPlayers) || !_.isEmpty(otherPlayerCache) || !_.isEmpty(disabledPlayers);
      const adjustedNetSum = somethingHasChanged ? goodRange.net : rawNetSum;
      const adjustedOffSum = somethingHasChanged ? goodRange.off : rawOffSum;
      const adjustedDefSum = somethingHasChanged ? goodRange.def : rawDefSum;

      const dummyTeamOk = { //(in "in-season" mode, reports the original values)
        off_net: !_.isNil(rawNetSum) ? { value: rawNetSum } : { value: okTotals.net },
        off_adj_ppp: !_.isNil(rawOffSum) ? { value: rawOffSum + avgEff } : { value: okTotals.off + avgEff },
        def_adj_ppp: !_.isNil(rawDefSum) ? { value: rawDefSum + avgEff } : { value: okTotals.def + avgEff },
      };
      const dummyTeamGood = { // //(in "in-season" mode, reports the adjusted values)
        off_net: !_.isNil(rawNetSum) ? { value: adjustedNetSum } : { value: okTotals.net + goodDeltaNet },
        off_adj_ppp: !_.isNil(rawOffSum) ? { value: adjustedOffSum! + avgEff } : { value: okTotals.off + avgEff + goodDeltaOff },
        def_adj_ppp: !_.isNil(rawDefSum) ? { value: adjustedDefSum! + avgEff } : { value: okTotals.def + avgEff + goodDeltaDef },
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

      //TODO: use team efficiency instead from team leaderboards and back into bench level?
      const actualTotals = evalMode ? buildTotals(pxResults.actualResultsForReview, "orig", finalActualEffAdj) : undefined;
      const dummyTeamActual = actualTotals ? {
        off_net: { value: actualTotals.net },
        off_adj_ppp: { value: actualTotals.off + avgEff },
        def_adj_ppp: { value: actualTotals.def + avgEff },
      } : undefined;
    
      const teamGradesActual = (dummyTeamActual && divisionStatsCache.Combo) ?
        GradeUtils.buildTeamPercentiles(divisionStatsCache.Combo, dummyTeamActual, [ "net", "adj_ppp" ], true) : {};

      const teamParams = {
        team: team, gender: gender, year: year,
        minRank: "0", maxRank: "400",
        factorMins: false, possAsPct: true,
        showExpanded: true, calcRapm: true
      };
      const teamTooltip = (
        <Tooltip id={`teamTooltip`}>Open new tab with the on/off analysis for this player/team</Tooltip>
      );
      const teamLink = team ? <OverlayTrigger placement="auto" overlay={teamTooltip}>
        <a target="_blank" href={UrlRouting.getGameUrl(teamParams, {})}><b>Team Totals</b></a>
      </OverlayTrigger> : <b>Team Totals</b>;

      const actualResultsYear = 
        (year == "All") ? "Actual" : (evalMode ? LeaderboardUtils.getNextYear(year) : year).substring(2);

      const subHeaders = [ 
        GenericTableOps.buildSubHeaderRow(
          evalMode ? [
            [ <div/>, 6 ], 
            [ <i><b>{`${actualResultsYear} results`}</b></i>, 4 ], [ <div/>, 1 ], 
            [ <i><b>Balanced</b></i>, 4 ], [ <div/>, 1 ], 
            [ <i>Optimistic</i>, 4 ], [ <div/>, 1 ], 
            [ <i>Pessimistic</i>, 4 ], [ <div/>, 1 ],
            [ <div/>, 2 ]
          ] : (!offSeasonMode ? [
            [ <div/>, 10 ],  
            [ <i><b>{actualResultsYear} results</b></i>, 4 ], [ <div/>, 1 ], 
            [ <i>Adjusted results</i>, 4 ], [ <div/>, 1 ], 
            [ <div/>, 2 ]
          ]
           : [ 
            [ <div/>, 9 ],  
            [ <i><b>Balanced</b></i>, 4 ], [ <div/>, 1 ], 
            [ <i>Optimistic</i>, 4 ], [ <div/>, 1 ], 
            [ <i>Pessimistic</i>, 4 ], [ <div/>, 1 ],
            [ <div/>, 2 ]
          ]), "small text-center"
        ),
      ].concat(_.isEmpty(filteredPlayerSet) ? [] : [
        GenericTableOps.buildDataRow({
          title: teamLink,
          //(for diag only)
          mpg: totalMins < 0.99 ? { value: (totalMins - 1.0)*40 } : undefined,

          // Eval mode
          actual_mpg: totalActualMins && (totalActualMins < 0.99) ? { value: (totalActualMins - 1.0)*40 } : undefined,
          actual_net: totalActualMins ? dummyTeamActual?.off_net : undefined,
          actual_off: totalActualMins ? dummyTeamActual?.off_adj_ppp : undefined,
          actual_def: totalActualMins ? dummyTeamActual?.def_adj_ppp : undefined,

          // Off-season balanced; In-season: actual results
          ok_net: !_.isNil(rawNetSum) ? (rawTotalMins ? { value: rawNetSum } : undefined) : { value: okTotals.net },
          ok_off: !_.isNil(rawOffSum) ? (rawTotalMins ? { value: rawOffSum + avgEff } : undefined) : { value: okTotals.off + avgEff },
          ok_def: !_.isNil(rawDefSum) ? (rawTotalMins ? { value: rawDefSum + avgEff } : undefined) : { value: okTotals.def + avgEff },
          // Off-season optimistic; In-season adjusted
          good_net: dummyTeamGood.off_net,
          good_off: dummyTeamGood.off_adj_ppp,
          good_def: dummyTeamGood.def_adj_ppp,
          bad_net: offSeasonMode ? dummyTeamBad.off_net : undefined,
          bad_off: offSeasonMode ? dummyTeamBad.off_adj_ppp : undefined,
          bad_def: offSeasonMode ? dummyTeamBad.def_adj_ppp : undefined,
        }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta, TeamEditorTableUtils.teamTableDef)
        ,
        GenericTableOps.buildDataRow({
          title: <b>Team Grades {
            (divisionStatsCache.year && (divisionStatsCache.year != "None")) ? `(${divisionStatsCache.year.substring(2)
            })` : null}</b>,
          actual_net: teamGradesActual.off_net,
          actual_off: teamGradesActual.off_adj_ppp,
          actual_def: teamGradesActual.def_adj_ppp,
          ok_net: (offSeasonMode || (rawTotalMins > 0)) ? teamGradesOk.off_net : undefined,
          ok_off: (offSeasonMode || (rawTotalMins > 0)) ? teamGradesOk.off_adj_ppp : undefined,
          ok_def: (offSeasonMode || (rawTotalMins > 0)) ? teamGradesOk.def_adj_ppp : undefined,
          good_net: teamGradesGood.off_net,
          good_off: teamGradesGood.off_adj_ppp,
          good_def: teamGradesGood.def_adj_ppp,
          bad_net: offSeasonMode ? teamGradesBad.off_net : undefined,
          bad_off: offSeasonMode ? teamGradesBad.off_adj_ppp : undefined,
          bad_def: offSeasonMode ? teamGradesBad.def_adj_ppp : undefined,
        }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta, TeamEditorTableUtils.gradeTableDef),
      ]);
      return subHeaders;
    };

    ///////////////////////////////////////////////

    // Display pipeline:

    const { //(some shortcuts for common vars)
      rosterGuards, rosterGuardMins, maybeBenchGuard,
      rosterWings, rosterWingMins, maybeBenchWing,
      rosterBigs, rosterBigMins, maybeBenchBig,
    } = pxResults;
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
    const removedPlayerStr = _.values(pxResults.allDeletedPlayers).join(" / ");

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

    return <GenericTable
      tableCopyId="rosterEditorTable"
      tableFields={TeamEditorTableUtils.tableDef(evalMode, offSeasonMode)}
      tableData={
        buildTeamRows(
          pxResults.actualResultsForReview, pxResults.inSeasonPlayerResultsList, pxResults.avgEff
        ).concat(rosterTableData)
      }
      cellTooltipMode={undefined}
    />;
  }, [ dataEvent, year, team, 
      otherPlayerCache, deletedPlayers, disabledPlayers, uiOverrides, divisionStatsCache, debugMode, showPrevSeasons,
      allEditOpen, editOpen, evalMode, offSeasonMode, superSeniorsBack, alwaysShowBench ]);

  /////////////////////////////////////
  
  // Add players: show the player leaderboard

  const playerLeaderboard = React.useMemo(() => {

    setLboardParams(startingState);
    return <PlayerLeaderboardTable
      startingState={{
        ...startingState,
        transferMode: (year == LeaderboardUtils.offseasonYear) ? "true" : LeaderboardUtils.getOffseasonOfYear(year),
          //(for the current off-season, only show available transfers; for historical seasons, show all transfers)
        year: onlyThisYear ? startingState.year : "All",
        tier: "All"
      }}
      dataEvent={reloadData ?
        {} : 
        (lboardAltDataSource ?
          lboardAltDataSource :
          {
            ...dataEvent, 
            players: (onlyThisYear && (year != "All"))? 
              (dataEvent.players || []).filter(p => p.year == year) : 
              (evalMode ? (dataEvent.players || []).filter(p => (p.year || "") <= year) : dataEvent.players), 
            transfers: (onlyTransfers && hasTransfers) ? dataEvent.transfers?.[0] : undefined 
          }
        )
      }
      onChangeState={(newParams: PlayerLeaderboardParams) => {
        const dataSubEventKey = newParams.t100 ?
          "t100" : (newParams.confOnly ? "conf" : "all");

        if (dataSubEventKey != "all") {
          const prevYear = LeaderboardUtils.getPrevYear(year || "");

          //TODO: not supporting this correctly right now because not guaranteed to have players in memory
          //so might not be able to reconstruct from the keys - hence this logic cannot currently be reached via UI
          const fetchAll = LeaderboardUtils.getMultiYearPlayerLboards(
            dataSubEventKey, gender, year, "All", [ LeaderboardUtils.getOffseasonOfYear(year) || "" ], [ prevYear ]
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
          team, year, (dataEvent.players || []).filter(maybeP => (maybeP.code == p.code) && ((maybeP.year || "") <= year)), 
          offSeasonMode, superSeniorsBack, undefined, {}, 
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
    return <OverlayTrigger placement="auto" overlay={tooltip}>
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
    {overrideGrades ? null : <Form.Group as={Row}>
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
                setUiOverrides({})
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
                setUiOverrides({})
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
                setUiOverrides({})
              }, (teamYear[0] != team) && (teamYear[1] != year));
            } else {
               friendlyChange(() => {
                setTeam(selection);
                setOtherPlayerCache({});
                setDisabledPlayers({});
                setDeletedPlayers({});
                setEditOpen({});
                setUiOverrides({})
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
                text={"'What If?' mode"}
                truthVal={!offSeasonMode}
                onSelect={() => friendlyChange(() => {
                  setOffSeasonMode(!offSeasonMode);
                  setEvalMode(false);
                }, true)}
              />
          <Dropdown.Divider />
          <GenericTogglingMenuItem
              text={"Review mode"}
              truthVal={evalMode}
              onSelect={() => friendlyChange(() => {
                setOffSeasonMode(true);
                setEvalMode(!evalMode);
              }, true)}
            />
          <GenericTogglingMenuItem
              text={"Debug/Diagnostic mode"}
              truthVal={debugMode}
              onSelect={() => friendlyChange(() => setDebugMode(!debugMode), true)}
            />
        </GenericTogglingMenu>
      </Form.Group>
    </Form.Group>}
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
              tooltip: "If enabled, assume seniors with eligibility will return (or you can add them from 'Add New Players' (off-season mode only)",
              toggled: superSeniorsBack,
              onClick: () => friendlyChange(() => {
                setSuperSeniorsBack(!superSeniorsBack);
              }, true)
            }
          ].concat(overrideGrades ? [] : [
            {
              label: "What If?",
              tooltip: "Describes what actually happened for the selected season, and allows editing to explore different scenarios",
              toggled: !offSeasonMode,
              onClick: () => friendlyChange(() => {
                setOffSeasonMode(!offSeasonMode);
                setEvalMode(false);
            }, true)
            },
            {
              label: "Review",
              tooltip: "Compares the off-season projection against what actually happened (/is actually happening) the following year",
              toggled: evalMode,
              onClick: () => friendlyChange(() => {
                 setOffSeasonMode(true);
                 setEvalMode(!evalMode);
                }, true)
            },
        ]))}
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
                <Form.Check type="switch" 
                  id="addNewPlayerMode"
                  checked={addNewPlayerMode}
                  onChange={() => {
                    setTimeout(() => {
                      setReloadData(true);
                      setAddNewPlayerMode(!addNewPlayerMode);
                      setTimeout(() => {
                        setReloadData(false);
                      }, 100);
                    }, 250);
                  }}
                  label="Player builder mode"
                />
              </Form.Group>
              <Form.Group as={Col} xs="4" className="mt-2">
                <Form.Check type="switch" disabled={!hasTransfers || addNewPlayerMode}
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
              <Form.Group as={Col} xs="4" className="mt-2">
                <Form.Check type="switch" disabled={(year == "All") || addNewPlayerMode}
                  id="onlyThisYear"
                  checked={(year != "All") && onlyThisYear}
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
            {addNewPlayerMode ? <Row className="small mb-4">
                <Col>
                  <TeamRosterEditor
                    isBench={false}
                    addNewPlayerMode={true}
                    overrides={undefined}
                    onUpdate={(edit: PlayerEditModel | undefined) => {
                      if (edit) {
                        const currOverrides = _.clone(uiOverrides);
                        currOverrides[edit.name || ""] = edit;
                        setUiOverrides(currOverrides);
                      }
                    }}
                    onDelete={() => {
                      //(can't be called)
                    }}
                  />
              </Col>
            </Row> : null}
            {addNewPlayerMode ? null : <Row>
              {playerLeaderboard}
            </Row>}
          </Container>
        </GenericCollapsibleCard>
      </Col>
    </Row>
  </Container>;
};

export default TeamEditorTable;
