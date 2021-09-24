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
import { faLink } from '@fortawesome/free-solid-svg-icons'
import ClipboardJS from 'clipboard';

// Component imports
import GenericTable, { GenericTableOps } from "./GenericTable";
import GenericTogglingMenu from './shared/GenericTogglingMenu';
import GenericTogglingMenuItem from './shared/GenericTogglingMenuItem';
import ToggleButtonGroup from "./shared/ToggleButtonGroup";
import AsyncFormControl from './shared/AsyncFormControl';

// Table building
import { TableDisplayUtils } from "../utils/tables/TableDisplayUtils";
import { LineupTableUtils } from "../utils/tables/LineupTableUtils";

// Util imports
import { UrlRouting } from "../utils/UrlRouting";
import { CommonTableDefs } from "../utils/tables/CommonTableDefs";
import { PositionUtils } from "../utils/stats/PositionUtils";
import { PlayerLeaderboardParams, ParamDefaults } from '../utils/FilterModels';
import { ConferenceToNickname, NicknameToConference, Power6Conferences } from '../utils/public-data/ConferenceInfo';
import { PlayerLeaderboardTracking } from '../utils/internal-data/LeaderboardTrackingLists';

import { RosterTableUtils } from '../utils/tables/RosterTableUtils';

export type PlayerLeaderboardStatsModel = {
  players?: Array<any>,
  confs?: Array<string>,
  confMap?: Map<string, Array<string>>,
  lastUpdated?: number,
  error?: string
}
type Props = {
  startingState: PlayerLeaderboardParams,
  dataEvent: PlayerLeaderboardStatsModel,
  onChangeState: (newParams: PlayerLeaderboardParams) => void
}

// Some static methods

const sortOptions: Array<any> = _.flatten(
  _.toPairs(CommonTableDefs.onOffIndividualTableAllFields(true))
    .filter(keycol => keycol[1].colName && keycol[1].colName != "")
    .map(keycol => {
      return [
        ["desc","off"], ["asc","off"], ["desc","def"], ["asc","def"], ["desc","diff"], ["asc","diff"]
      ].flatMap(combo => {
        if ((combo[1] == "diff") && (
          (keycol[0] != "rtg") && (keycol[0] != "adj_rtg") && (keycol[0] != "adj_prod") &&
            (keycol[0] != "adj_rapm") && (keycol[0] != "adj_rapm_prod") && (keycol[0] != "adj_opp")
        )) {  // only do diff for a few:
          return [];
        }
        const ascOrDesc = (s: string) => { switch(s) {
          case "asc": return "Asc.";
          case "desc": return "Desc.";
        }}
        const offOrDef = (s: string) => { switch(s) {
          case "off": return "Offensive";
          case "def": return "Defensive";
          case "diff": return "Off-Def";
        }}
        const labelOverride = CommonTableDefs.indivColNameOverrides[`${combo[1]}_${keycol[0]}`];
        const ascOrDecLabel = ascOrDesc(combo[0]) || "";
        const offOrDefLabel = offOrDef(combo[1]) || "";
        const label = labelOverride ? labelOverride(ascOrDecLabel) : "see_below";
        return label ? [{
          label: !_.isNil(labelOverride) ? label : `${keycol[1].colName} (${ascOrDecLabel} / ${offOrDefLabel})`,
          value: `${combo[0]}:${combo[1]}_${keycol[0]}`
        }] : [];
      });
    })
);
const sortOptionsByValue = _.fromPairs(
  sortOptions.map(opt => [opt.value, opt])
);

// Info required for the positional filter

const positionClasses = [
  "Pure PG",
  "Scoring PG",
  "Combo Guard",
  "(All Ballhandlers)",
  "Wing Guard",
  "(All Guards)",
  "Wing Forward",
  "(All Wings)",
  "Stretch PF",
  "Power Forward/Center",
  "(All PFs)",
  "Center",
  "(All Post Players)",
  "(All Frontcourt)",
];
const posClassToNickname = {
  "Pure PG": "PG",
  "Scoring PG": "s-PG",
  "Combo Guard": "CG",
  "(All Ballhandlers)": "BH*",
  "Wing Guard": "WG",
  "(All Guards)": "*G",
  "Wing Forward": "WF",
  "(All Wings)": "W*",
  "Stretch PF": "S-PF",
  "Power Forward/Center": "PF/C",
  "(All PFs)": "PF+",
  "Center": "C",
  "(All Post Players)": "C+",
  "(All Frontcourt)": "4/5",
} as Record<string, string>;

const nicknameToPosClass = {
  ...PositionUtils.idToPosition,
  "BH*": "(All Ballhandlers)",
  "*G": "(All Guards)",
  "W*": "(All Wings)",
  "PF+": "(All PFs)",
  "C+": "(All Post Players)",
  "4/5": "(All Frontcourt)",
} as Record<string, string>;

const expandedPosClasses = {
  "BH*": [ "PG", "s-PG", "CG" ],
  "*G": [ "PG", "s-PG", "CG", "WG" ],
  "W*": [ "WG", "WF" ],
  "PF+": [ "WF", "S-PF", "PF/C" ],
  "C+": [ "PF/C", "C" ],
  "4/5": [ "WF", "S-PF", "PF/C", "C" ],
} as Record<string, string[]>;

/** When showing across multiple data sets, don't show intra-year rankings unless it's a full data set */
const fullDataSetSeasons = new Set(["2018/9", "2019/20", "2020/21"]);

// Functional component

const PlayerLeaderboardTable: React.FunctionComponent<Props> = ({startingState, dataEvent, onChangeState}) => {
  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  /** Only show help for diagnstic on/off on main page */
  const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");

  // 1] Data Model

  const [ clipboard, setClipboard] = useState(null as null | ClipboardJS);

  // 2] State

  // Data source
  const [ confs, setConfs ] = useState(startingState.conf || "");
  const [ year, setYear ] = useState(startingState.year || ParamDefaults.defaultYear);
  const [ gender, setGender ] = useState(startingState.gender || ParamDefaults.defaultGender);
  const isMultiYr = (year == "Extra") || (year == "All");

  const [ tier, setTier ] = useState(startingState.tier || ParamDefaults.defaultTier);

  // Misc display

  const [ posClasses, setPosClasses ] = useState(startingState.posClasses || "");

  /** Whether to show sub-header with extra info */
  const [ showInfoSubHeader, setShowInfoSubHeader ] = useState(false);

  /** Show the number of possessions as a % of total team count */
  const [ factorMins, setFactorMins ] = useState(_.isNil(startingState.factorMins) ?
    ParamDefaults.defaultPlayerLboardFactorMins : startingState.factorMins
  );

  const [ useRapm, setUseRapm ] = useState(_.isNil(startingState.useRapm) ?
    ParamDefaults.defaultPlayerLboardUseRapm : startingState.useRapm
  );

  /** Set this to be true on expensive operations */
  const [ loadingOverride, setLoadingOverride ] = useState(false);

  const startingMinPoss = startingState.minPoss || ParamDefaults.defaultPlayerLboardMinPos;
  const [ minPoss, setMinPoss ] = useState(startingMinPoss);
  const startingMaxTableSize = startingState.maxTableSize || ParamDefaults.defaultPlayerLboardMaxTableSize;
  const [ maxTableSize, setMaxTableSize ] = useState(startingMaxTableSize);
  const [ sortBy, setSortBy ] = useState(startingState.sortBy || ParamDefaults.defaultPlayerLboardSortBy(useRapm, factorMins));
  const [ filterStr, setFilterStr ] = useState(
    PlayerLeaderboardTracking[startingState.filter || ""] || startingState.filter || ParamDefaults.defaultPlayerLboardFilter
  );

  const [ isT100, setIsT100 ] = useState(startingState.t100 || false);
  const [ isConfOnly, setIsConfOnly ] = useState(startingState.confOnly || false);

  /** Show the number of possessions as a % of total team count */
  const [ possAsPct, setPossAsPct ] = useState(_.isNil(startingState.possAsPct) ?
    ParamDefaults.defaultPlayerLboardPossAsPct : startingState.possAsPct
  );

  /** When switching between rating and prod, also switch common sort bys over */
  const toggleFactorMins = () => {
    const newSortBy = factorMins ?
      sortBy.replace("_rapm_prod", "_rapm").replace("_prod", "_rtg") :
      sortBy.replace("_rapm", "_rapm_prod").replace("_rtg", "_prod");
    if (newSortBy != sortBy) {
      setSortBy(newSortBy);
    }
    setFactorMins(!factorMins);
  };
  /** When switching between RAPM and rtg, also switch common sort bys over */
  const toggleUseRapm = () => {
    const newSortBy = useRapm ?
      sortBy.replace("_rapm_prod", "_prod").replace("_rapm", "_rtg") :
      sortBy.replace("_rtg", "_rapm").replace("adj_prod", "adj_rapm_prod");
    if (newSortBy != sortBy) {
      setSortBy(newSortBy);
    }
    setUseRapm(!useRapm);
  };
  /** Put these options at the front */
  const mostUsefulSubset = factorMins ? [
    "desc:diff_adj_prod",
    "desc:diff_adj_rapm_prod",
    "desc:off_adj_prod",
    "desc:off_adj_rapm_prod",
    "asc:def_adj_prod",
    "asc:def_adj_rapm_prod"
  ] : [
    "desc:diff_adj_rtg",
    "desc:diff_adj_rapm",
    "desc:off_adj_rtg",
    "desc:off_adj_rapm",
    "asc:def_adj_rtg",
    "asc:def_adj_rapm"
  ];
  /** The two sub-headers for the dropdown */
  const groupedOptions = [
    {
      label: "Most useful",
      options: _.chain(sortOptionsByValue).pick(mostUsefulSubset).values().value()
    },
    {
      label: "Other",
      options: _.chain(sortOptionsByValue).omit(mostUsefulSubset).values().value()
    }
  ];

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
      conf: confs, gender: gender, year: year,
      t100: isT100, confOnly: isConfOnly,
      // Player filters/settings:
      posClasses: posClasses,
      possAsPct: possAsPct,
      factorMins: factorMins,
      useRapm: useRapm,
      // Misc filters
      minPoss: minPoss,
      maxTableSize: maxTableSize,
      sortBy: sortBy,
      filter: filterStr
    };
    onChangeState(newState);
  }, [ minPoss, maxTableSize, sortBy, filterStr,
      isT100, isConfOnly, possAsPct, factorMins,
      useRapm,
      posClasses,
      confs, year, gender ]);

  // 3] Utils

  // 3.1] Build individual info

  const filterFragments =
    filterStr.split(",").map(fragment => _.trim(fragment)).filter(fragment => fragment ? true : false);
  const filterFragmentsPve =
    filterFragments.filter(fragment => fragment[0] != '-');
  const filterFragmentsNve =
    filterFragments.filter(fragment => fragment[0] == '-').map(fragment => fragment.substring(1));

  // 3.2] Table building

  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off";
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def";

  /** Only rebuild the expensive table if one of the parameters that controls it changes */
  const table = React.useMemo(() => {
    setLoadingOverride(false); //(rendering)

    const confSet = confs ? new Set(
      _.flatMap((confs || "").split(","), c => c == "P6" ? Power6Conferences : [ NicknameToConference[c] || c ])
    ) : undefined;

    const posClassSet = posClasses ? new Set(
      _.flatMap((posClasses || "").split(","), c => expandedPosClasses[c] || [ c ])
    ) : undefined;
    const dataEventPlayers = (dataEvent?.players || []);

//TODO: make this a % or an int?
    // Filter and limit players part 1/2
    const minPossNum = parseInt(minPoss) || 0;
    const confDataEventPlayers = dataEventPlayers.filter(player => {
      return (!confSet || confSet.has(player.conf || "Unknown")) &&
              (!posClassSet || posClassSet.has(player.posClass || "Unknown")) &&
                (player.off_team_poss?.value >= minPossNum);
        //(we do the "spurious" minPossNum check so we can detect filter presence and use to add a ranking)
    });

    // Filter, sort, and limit players part 2/2
    const players = _.chain(confDataEventPlayers).filter(player => {
      const strToTest = `${(player.key || "")} ${player.team || ""}_${player.year || ""} ${player.roster?.year_class || ""}_${player.code || ""}:${player.team || ""}`;

      return(
        (filterFragmentsPve.length == 0) ||
          (_.find(filterFragmentsPve, (fragment) => strToTest.indexOf(fragment) >= 0) ? true : false))
        &&
        ((filterFragmentsNve.length == 0) ||
          (_.find(filterFragmentsNve, (fragment) => strToTest.indexOf(fragment) >= 0) ? false : true))
        ;
    }).sortBy(
      (year != "All") && (sortBy == ParamDefaults.defaultPlayerLboardSortBy(
        ParamDefaults.defaultPlayerLboardUseRapm, ParamDefaults.defaultPlayerLboardFactorMins
      )) ? [] : //(can save on a sort if using the generated sort-order)
        [ LineupTableUtils.sorter(sortBy) , (p) => { p.baseline?.off_team_poss?.value || 0 } ]
    ).take(parseInt(maxTableSize)).value();

    const usefulSortCombo =  useRapm ?
      (factorMins ?
        (sortBy != "desc:diff_adj_rapm_prod") && (sortBy != "desc:off_adj_rapm_prod") && (sortBy != "asc:def_adj_rapm_prod") :
        (sortBy != "desc:diff_adj_rapm") && (sortBy != "desc:off_adj_rapm") && (sortBy != "asc:def_adj_rapm")) :
      (factorMins ?
        (sortBy != "desc:diff_adj_prod") && (sortBy != "desc:off_adj_prod") && (sortBy != "asc:def_adj_prod") :
        (sortBy != "desc:diff_adj_rtg") && (sortBy != "desc:off_adj_rtg") && (sortBy != "asc:def_adj_rtg"));

    /** Either the sort is not one of the 3 pre-calced, or there is a filter */
    const isGeneralSortOrFilter = (
      usefulSortCombo
      ||
      ((confDataEventPlayers.length < dataEventPlayers.length) || ((filterStr || "") != ""))
      ||
      (year == "All")
    );

    const tableData = players.flatMap((player, playerIndex) => {
      player.def_usage = <OverlayTrigger placement="auto" overlay={TableDisplayUtils.buildPositionTooltip(player.posClass, "Base")}>
        <small>{player.posClass}</small>
      </OverlayTrigger>;

      const confNickname = ConferenceToNickname[player.conf] || "???";
      const teamSeasonLookup = `${startingState.gender}_${player.team}_${startingState.year}`;

      const generalRank = isGeneralSortOrFilter ? <span><i>(#{playerIndex + 1})</i>&nbsp;</span> : null;
      const rankingsTooltip = (
        <Tooltip id={`rankings_${playerIndex}`}>
          {factorMins ? "Production " : "Rating "}Ranks:<br/>
          {isGeneralSortOrFilter ? "[filtered/sorted subset] " : ""}{isGeneralSortOrFilter ? <br/> : null}
          [{useRapm ? "Net RAPM" : "Adj Net Rating+"}]<br/>
          [{useRapm ? "Offensive RAPM" : "Adj Offensive Rating+"}]<br/>
          [{useRapm ? "Defensive RAPM" : "Adj Defensive Rating+"}]
        </Tooltip>
      );

      const getRankings = () => {
        const rtg = useRapm ?
          (factorMins ? "rapm_prod" : "rapm") :
          (factorMins ? "prod" : "rtg");

          const marginRank = (sortBy == `desc:diff_adj_${rtg}`) ? <b><big>#{player[`adj_${rtg}_margin_rank`]}</big></b> : `#${player[`adj_${rtg}_margin_rank`]}`;
          const offRank = (sortBy == `desc:off_adj_${rtg}`) ? <b><big>#{player[`off_adj_${rtg}_rank`]}</big></b> : `#${player[`off_adj_${rtg}_rank`]}`;
          const defRank = (sortBy == `asc:def_adj_${rtg}`) ? <b><big>#{player[`def_adj_${rtg}_rank`]}</big></b> : `#${player[`def_adj_${rtg}_rank`]}`;
          return (year == "All") && !fullDataSetSeasons.has(player.year) ?
            <OverlayTrigger placement="auto" overlay={rankingsTooltip}>
              <span>{generalRank}<small>(no ranking)</small></span>
            </OverlayTrigger>
            :
            <OverlayTrigger placement="auto" overlay={rankingsTooltip}>
              <span>{generalRank}<small>{marginRank} ({offRank} / {defRank})</small></span>
            </OverlayTrigger>;
      };
      const rankings = getRankings();

      const teamTooltip = (
        <Tooltip id={`team_${playerIndex}`}>Open new tab with the on/off analysis for this player/team</Tooltip>
      );
      const teamParams = {
        team: player.team, gender: gender, year: player.year || year,
        minRank: "0", maxRank: isT100 ? "100" : "400",
        queryFilters: isConfOnly ? "Conf" : undefined,
        factorMins: factorMins, possAsPct: possAsPct,
        showExpanded: true, sortBy: "desc:off_team_poss_pct:on",
        onQuery: `"${player.key}"`, offQuery: `NOT "${player.key}"`, autoOffQuery: true,
      };
      const teamEl = <OverlayTrigger placement="auto" overlay={teamTooltip}>
        <a target="_blank" href={UrlRouting.getGameUrl(teamParams, {})}><b>{player.team}</b></a>
      </OverlayTrigger>;

      const playerAnalysisParams = {
        team: player.team, gender: gender, year: player.year || year,
        minRank: "0", maxRank: isT100 ? "100" : "400",
        queryFilters: isConfOnly ? "Conf" : undefined,
        factorMins: factorMins, possAsPct: possAsPct,
        showExpanded: true,
        showDiag: true, showPosDiag: true,
        filter: player.code || player.key
      };
      const rapmAnalysisParams = {
        team: player.team, gender: gender, year: player.year || year,
        minRank: "0", maxRank: isT100 ? "100" : "400",
        filter: player.code || player.key
        //TODO: heh need to add queryFilters to lineup and team report query box
        ,
        showOnOff: false, showComps: false, incRapm: true,
        teamLuck: true, rapmDiagMode: "base"
      };
      const rapmTooltip = (
        <Tooltip id={`rapm_${playerIndex}`}>RAPM {factorMins ? "Production" : "Rating"} margin: click to open new tab showing the RAPM diagnostics for this player</Tooltip>
      );
      const playerTooltip = (
        <Tooltip id={`player_${playerIndex}`}>{factorMins ? "Production" : "Rating"} margin: click to open new tab showing the off/def rating diagnostics for this player</Tooltip>
      );

      const adjMargin = useRapm ?
        (factorMins ?
          (player.off_adj_rapm_prod?.value || 0) - (player.def_adj_rapm_prod?.value || 0) :
          (player.off_adj_rapm?.value || 0) - (player.def_adj_rapm?.value || 0))
        :
        (factorMins ?
          (player.off_adj_prod?.value || 0) - (player.def_adj_prod?.value || 0) :
          (player.off_adj_rtg?.value || 0) - (player.def_adj_rtg?.value || 0))
          ;
      const adjMarginStr = <OverlayTrigger placement="auto" overlay={useRapm ? rapmTooltip : playerTooltip}>
        <a target="_blank" href={
          useRapm ?
            UrlRouting.getTeamReportUrl(rapmAnalysisParams) :
            UrlRouting.getGameUrl(playerAnalysisParams, {})
        }><b>
          {`${(adjMargin > 0.0) ? "+" : ""}${adjMargin.toFixed(1)}`}
        </b></a>
        </OverlayTrigger>;

      const maybeYrStr = isMultiYr ? ` '${player.year.substring(2, 4)}+` : ``;

      // Add roster metadata:

      const height = player.roster?.height;
      const yearClass = player.roster?.year_class;

      if (height && height != "-") {
        player.def_efg = <small><i className="text-secondary">{height}</i></small>;
      }
      if (yearClass) {
        player.def_assist = <small><i className="text-secondary">{yearClass}</i></small>;
      }


      player.off_title = <div>
        <span className="float-left">
          {rankings}
        </span>&nbsp;<b>{player.key}{maybeYrStr}</b>
          <br/>
          <span className="float-left">
            <span>{teamEl}&nbsp;(<span>{confNickname}</span>)&nbsp;[{adjMarginStr}]</span>
          </span>
        </div>;

      player.off_drb = player.def_orb; //(just for display, all processing should use def_orb)
      TableDisplayUtils.injectPlayTypeInfo(player, true, true, teamSeasonLookup);

      return _.flatten([
        [ GenericTableOps.buildDataRow(player, offPrefixFn, offCellMetaFn) ],
        [ GenericTableOps.buildDataRow(player, defPrefixFn, defCellMetaFn) ],
        [ GenericTableOps.buildRowSeparator() ]
      ]);
    });

    /** The sub-header builder - Can show some handy context in between the header and data rows: */
    const maybeSubheaderRow = 
      showInfoSubHeader ? RosterTableUtils.buildInformationalSubheader(true, true): [];

    return <GenericTable
      tableCopyId="playerLeaderboardTable"
      tableFields={CommonTableDefs.onOffIndividualTable(true, possAsPct, factorMins, true)}
      tableData={maybeSubheaderRow.concat(tableData)}
      cellTooltipMode="none"
    />

  }, [ minPoss, maxTableSize, sortBy, filterStr,
      possAsPct, factorMins,
      useRapm,
      confs, posClasses, showInfoSubHeader,
      dataEvent ]);

  // 3.2] Sorting utils

  /** The sub-header builder */
  const formatGroupLabel = (data: any) => (
    <div>
      <span>{data.label}</span>
    </div>
  );

  // 3] Utils
  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return !dataEvent.error && (loadingOverride || ((dataEvent?.players || []).length == 0));
  }

  /** For use in selects */
  function sortStringToOption(s: string) {
    return sortOptionsByValue[s];
  }
  function stringToOption(s: string) {
    return { label: s, value: s};
  }

  // 4] View

  /** Copy to clipboard button */
  const getCopyLinkButton = () => {
    const tooltip = (
      <Tooltip id="copyLinkTooltip">Copies URL to clipboard)</Tooltip>
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

  // Conference filter

  function getCurrentConfsOrPlaceholder() {
    return (confs == "") ?
      { label: `All Teams in ${tier} Tier` } :
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
        children: [ ConferenceToNickname[fullConfname] || fullConfname ]
      }
    }
    const newProps = {
      ...props,
      children: [ newText, props.children[1] ]
    }
    return <components.MultiValueContainer {...newProps} />
  };

  // Position filter

  function getCurrentPositionsOrPlaceholder() {
    return (posClasses == "") ?
      { label: 'All Positions' } :
      posClasses.split(",").map((posClass: string) => stringToOption(nicknameToPosClass[posClass] || posClass));
  }

  /** Slightly hacky code to render the position abbreviations */
  const PositionValueContainer = (props: any) => {
    const oldText = props.children[0];
    const fullPosition = oldText.props.children;
    const newText = {
      ...oldText,
      props: {
        ...oldText.props,
        children: [ posClassToNickname[fullPosition] || fullPosition ]
      }
    }
    const newProps = {
      ...props,
      children: [ newText, props.children[1] ]
    }
    return <components.MultiValueContainer {...newProps} />
  };

  /** At the expense of some time makes it easier to see when changes are happening */
  const friendlyChange = (change: () => void, guard: boolean, timeout: number = 250) => {
    if (guard) {
      setLoadingOverride(true);
      setTimeout(() => {
        change()
      }, timeout)
    }
  };

  const confsWithTeams = dataEvent?.confMap ?
    _.toPairs(dataEvent?.confMap || {}).map(kv => {
      const teams = kv[1] || [];
      return _.isEmpty(teams) ? kv[0] : `${kv[0]} [${teams.join(", ")}]`;
    }) : (dataEvent?.confs || []);

  return <Container>
    <LoadingOverlay
      active={needToLoadQuery()}
      spinner
      text={"Loading Player Leaderboard..."}
    >
    <Form.Group as={Row}>
      <Col xs={6} sm={6} md={3} lg={2}>
        <Select
          value={ stringToOption(gender) }
          options={[ "Men", "Women" ].map(
            (gender) => stringToOption(gender)
          )}
          isSearchable={false}
          onChange={(option) => { if ((option as any)?.value) setGender((option as any).value) }}
        />
      </Col>
      <Col xs={6} sm={6} md={3} lg={2}>
        <Select
          value={ stringToOption(year) }
          options={[ "2018/9", "2019/20", "2020/21" ].concat(tier == "High" ? [ "All", "Extra" ] : []).map(
            (r) => stringToOption(r)
          )}
          isSearchable={false}
          onChange={(option) => { if ((option as any)?.value) setYear((option as any).value) }}
        />
      </Col>
      <Col className="w-100" bsPrefix="d-lg-none d-md-none"/>
      <Col xs={12} sm={12} md={6} lg={6}>
        <Select
          isClearable={true}
          styles={{ menu: base => ({ ...base, zIndex: 1000 }) }}
          isMulti
          components={{ MultiValueContainer: ConferenceValueContainer }}
          value={ getCurrentConfsOrPlaceholder() }
          options={(tier == "High" ? ["Power 6 Conferences"] : []).concat(_.sortBy(confsWithTeams)).map(
            (r) => stringToOption(r)
          )}
          onChange={(optionsIn) => {
            const options = optionsIn as Array<any>;
            const selection = (options || [])
              .map(option => ((option as any)?.value || "").replace(/ *\[.*\]/, ""));
            const confStr = selection.filter((t: string) => t != "").map((c: string) => ConferenceToNickname[c] || c).join(",")
            friendlyChange(() => setConfs(confStr), confs != confStr);
          }}
        />
      </Col>
      <Col lg={1}>
        {getCopyLinkButton()}
      </Col>
    </Form.Group>
      <Form.Row>
        <Form.Group as={Col} sm="7">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="filter">Filter</InputGroup.Text>
            </InputGroup.Prepend>
            <AsyncFormControl
              startingVal={filterStr}
              onChange={(t: string) => friendlyChange(() => setFilterStr(t), t != filterStr)}
              timeout={500}
              placeholder = "eg [-]Year;[-]TeamA[_Year];[-][Class_]Player1Code[:Team];[-]Player2Names"
            />
          </InputGroup>
        </Form.Group>
        <Col xs={12} sm={12} md={4} lg={4}>
          <Select
            isClearable={true}
            styles={{ menu: base => ({ ...base, zIndex: 1000 }) }}
            isMulti
            components={{ MultiValueContainer: PositionValueContainer }}
            value={ getCurrentPositionsOrPlaceholder() }
            options={(positionClasses || []).map(
              (r) => stringToOption(r)
            )}
            onChange={(optionsIn) => {
              const options = optionsIn as Array<any>;
              const selection = (options || []).map(option => (option as any)?.value || "");
              const posClassStr = selection.filter((t: string) => t != "").map((c: string) => posClassToNickname[c] || c).join(",")
              friendlyChange(() => setPosClasses(posClassStr), posClasses != posClassStr);
            }}
          />
        </Col>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} sm="3">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="maxPlayers">Max Players</InputGroup.Text>
            </InputGroup.Prepend>
            <AsyncFormControl
              startingVal={startingMaxTableSize}
              validate={(t: string) => t.match("^[0-9]*$") != null}
              onChange={(t: string) => friendlyChange(() => setMaxTableSize(t), t != maxTableSize)}
              timeout={400}
              placeholder = "eg 100"
            />
          </InputGroup>
        </Form.Group>
        {false ? <Form.Group as={Col} sm="3">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="minPossessions">Min Poss #</InputGroup.Text>
            </InputGroup.Prepend>
            <AsyncFormControl
              startingVal={startingMinPoss}
              validate={(t: string) => t.match("^[0-9]*$") != null}
              onChange={(t: string) => friendlyChange(() => setMinPoss(t), t != minPoss)}
              timeout={400}
              placeholder = "eg 20"
            />
          </InputGroup>
        </Form.Group> : null}
        <Form.Group as={Col} sm="6">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="sortBy">Sort By</InputGroup.Text>
            </InputGroup.Prepend>
            <Select
              className="w-75"
              value={ sortStringToOption(sortBy) }
              options={ groupedOptions }
              onChange={(option) => { if ((option as any)?.value) {
                const newSortBy = (option as any)?.value;
                friendlyChange(() => setSortBy(newSortBy), sortBy != newSortBy);
              }}}
              formatGroupLabel={formatGroupLabel}
            />
          </InputGroup>
        </Form.Group>
        <Col sm="2"/>
        <Form.Group as={Col} sm="1">
          <GenericTogglingMenu>
            <GenericTogglingMenuItem
              text={<i className="text-secondary">Adjust for Luck</i>}
              truthVal={true}
              onSelect={() => {}}
              helpLink={showHelp ? "https://hoop-explorer.blogspot.com/2020/07/luck-adjustment-details.html" : undefined}
            />
            <GenericTogglingMenuItem
              text={<span>Factor minutes % into Adjusted Rating+</span>}
              truthVal={factorMins}
              onSelect={() => friendlyChange(() => toggleFactorMins(), true)}
            />
            <GenericTogglingMenuItem
              text={<span>Use RAPM (vs Adj Rtg) when displaying rankings</span>}
              truthVal={useRapm}
              onSelect={() => friendlyChange(() => toggleUseRapm(), true)}
              helpLink={showHelp ? "https://hoop-explorer.blogspot.com/2020/03/understanding-team-report-onoff-page.html#RAPM" : undefined}
            />
            <Dropdown.Divider />
            <GenericTogglingMenuItem
              text={<span>{possAsPct ?
                "Show possessions as count" : "Show possessions as % of team"
              }</span>}
              truthVal={false}
              onSelect={() => friendlyChange(() => setPossAsPct(!possAsPct), true)}
            />
          </GenericTogglingMenu>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Col xs={12} sm={12} md={12} lg={8}>
          <ToggleButtonGroup items={([
            {
              label: "Luck",
              tooltip: "Statistics always adjusted for luck",
              toggled: true,
              onClick: () => {}
            },
            {
              label: "T100",
              tooltip: "Leaderboard of players vs T100 opposition",
              toggled: isT100,
              onClick: () => friendlyChange(() => { setIsT100(!isT100); setIsConfOnly(false); }, true)
            },
            {
              label: "Conf",
              tooltip: "Leaderboard of players vs conference opposition",
              toggled: isConfOnly,
              onClick: () => friendlyChange(() => { setIsT100(false); setIsConfOnly(!isConfOnly); }, true)
            },
            {
              label: "Poss%",
              tooltip: possAsPct ? "Show possessions as count" : "Show possessions as percentage",
              toggled: possAsPct,
              onClick: () => friendlyChange(() => setPossAsPct(!possAsPct), true)
            },
            {
              label: "* Mins%",
              tooltip: "Whether to incorporate % of minutes played into adjusted ratings (ie turns it into 'production per team 100 possessions')",
              toggled: factorMins,
              onClick: () => friendlyChange(() => toggleFactorMins(), true)
            },
            {
              label: "RAPM",
              tooltip: "Use RAPM (vs Adj Rtg) when displaying rankings",
              toggled: useRapm,
              onClick: () => friendlyChange(() => toggleUseRapm(), true)
            },
            {
              label: "+ Info",
              tooltip: showInfoSubHeader ? "Hide extra info sub-header" : "Show extra info sub-header (not currently saved like other options)",
              toggled: showInfoSubHeader,
              onClick: () => setShowInfoSubHeader(!showInfoSubHeader)
            },
          ] as Array<any>).concat(showHelp ? [
            //TODO: what to show here?
            // {
            //   label: <a href="https://hoop-explorer.blogspot.com/2020/07/understanding-lineup-analyzer-page.html" target="_blank">?</a>,
            //   tooltip: "Open a page that explains some of the elements of this table",
            //   toggled: false,
            //   onClick: () => {}
            // }
          ] : [])
          }/>
        </Col>
        <Col xs={12} sm={12} md={12} lg={4}>
          <div className="float-right"><small>(Qualifying players in tier: <b>{dataEvent?.players?.length || 0}</b>)</small></div>
        </Col>
      </Form.Row>
      <Row className="mt-2">
        <Col style={{paddingLeft: "5px", paddingRight: "5px"}}>
          {table}
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
};

export default PlayerLeaderboardTable;
