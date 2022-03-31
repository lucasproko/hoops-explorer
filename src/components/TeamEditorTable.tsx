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
import { faLink, faCheck, faPen, faFilter } from '@fortawesome/free-solid-svg-icons'
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

// Util imports
import { UrlRouting } from "../utils/UrlRouting";
import { CommonTableDefs } from "../utils/tables/CommonTableDefs";
import { PositionUtils } from "../utils/stats/PositionUtils";
import { PlayerLeaderboardParams, ParamDefaults } from '../utils/FilterModels';
import { ConferenceToNickname, NicknameToConference, Power6Conferences } from '../utils/public-data/ConferenceInfo';
import { PlayerLeaderboardTracking } from '../utils/internal-data/LeaderboardTrackingLists';
import { GoodBadOkTriple, TeamEditorUtils } from '../utils/stats/TeamEditorUtils';

import { RosterTableUtils } from '../utils/tables/RosterTableUtils';
import { AdvancedFilterUtils } from '../utils/AdvancedFilterUtils';
import { StatModels, IndivStatSet, PureStatSet } from '../utils/StatModels';
import { O_SYMLINK } from 'constants';
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import { CbbColors } from '../utils/CbbColors';
import GenericCollapsibleCard from './shared/GenericCollapsibleCard';

export type PlayerLeaderboardStatsModel = {
  players?: Array<any>,
  confs?: Array<string>,
  confMap?: Map<string, Array<string>>,
  lastUpdated?: number,
  transfers?: Record<string, Array<string>>,
  error?: string
}
type Props = {
  startingState: PlayerLeaderboardParams,
  dataEvent: PlayerLeaderboardStatsModel,
  onChangeState: (newParams: PlayerLeaderboardParams) => void
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
  /** Pre-calculate this */
  const teamList = AvailableTeams.getTeams(null, year, gender);

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
      gender: gender, year: year,
      // Player filters/settings:
      // Misc filters
      // Misc display
    };
    onChangeState(newState);
  }, [ year, gender ]);

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

  const tableDef = {
    title: GenericTableOps.addTitle("", "", CommonTableDefs.rowSpanCalculator, "small", GenericTableOps.htmlFormatter, 20),
    "sep0": GenericTableOps.addColSeparator(0.5),

    pos: GenericTableOps.addDataCol("Pos", "Positional class of player (algorithmically generated)", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
    min_pct: GenericTableOps.addPctCol("Min%", "% of minutes played", CbbColors.alwaysWhite),
    usage: GenericTableOps.addPctCol("Usg", "Usage for `Balanced` projections", CbbColors.varPicker(CbbColors.usg_offDef)),
    rebound: GenericTableOps.addPctCol("RB%", "% of available defensive rebounds made by this player ('Balanced' projection)", CbbColors.varPicker(CbbColors.p_def_OR)),
    "sep1": GenericTableOps.addColSeparator(2),

    good_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
    "sep1.5": GenericTableOps.addColSeparator(0.05),
    good_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
    good_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.def_diff10_p100_redGreen)),
    "sep1.6": GenericTableOps.addColSeparator(0.05), 
    good_ortg: GenericTableOps.addPtsCol("Rtg", "Offensive Rating, for 'Optimistic' projections", CbbColors.varPicker(CbbColors.off_pp100)),
    "sep2": GenericTableOps.addColSeparator(3),

    ok_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
    "sep2.5": GenericTableOps.addColSeparator(0.05),
    ok_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
    ok_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.def_diff10_p100_redGreen)),
    "sep2.6": GenericTableOps.addColSeparator(0.05), 
    ok_ortg: GenericTableOps.addPtsCol("Rtg", "Offensive Rating, for 'Balacned' projections", CbbColors.varPicker(CbbColors.off_pp100)),
    "sep3": GenericTableOps.addColSeparator(3),

    bad_net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
    "sep3.5": GenericTableOps.addColSeparator(0.05),
    bad_off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.off_diff10_p100_redGreen)),
    bad_def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.def_diff10_p100_redGreen)),
    "sep3.6": GenericTableOps.addColSeparator(0.05), 
    bad_ortg: GenericTableOps.addPtsCol("Rtg", "Offensive Rating, for 'Pessimistic' projections", CbbColors.varPicker(CbbColors.off_pp100)),
    "sep4": GenericTableOps.addColSeparator(2),

    edit: GenericTableOps.addDataCol("", "Edit the Optimistic/Balanced/Pessmistic projections for the player", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
    disable: GenericTableOps.addDataCol("", "Disable/re-enabled this player from the roster", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
  };

  const otherPlayers: GoodBadOkTriple[] = [];
  const basePlayerCache: Record<string, GoodBadOkTriple> = {};
  const removedBasePlayerCodes: Record<string, boolean> = {};

  const basePlayers: GoodBadOkTriple[] = TeamEditorUtils.getBasePlayers(
    team, (dataEvent.players || []), basePlayerCache, false, removedBasePlayerCodes
  );

  const playerSet = basePlayers.concat(otherPlayers); //TODO: process this and also get team line 
  const rosterTableData = playerSet.map(triple => {
    const getOff = (s: PureStatSet) => (s.off_adj_rapm || s.off_adj_rtg)?.value || 0;
    const getDef = (s: PureStatSet) => (s.def_adj_rapm || s.def_adj_rtg)?.value || 0;
    const getNet = (s: PureStatSet) => getOff(s) - getDef(s);
    const tableEl = {
      title: triple.ok.key,
      min_pct: { value: triple.ok.off_team_poss_pct?.value },
      usage: triple.ok.off_usage,
      pos: triple.good.posClass,
      good_net: { value: getNet(triple.good) },
      good_off: { value: getOff(triple.good) },
      good_def: { value: getDef(triple.good) },
      good_ortg: triple.good.off_rtg,
      ok_net: { value: getNet(triple.ok) },
      ok_off: { value: getOff(triple.ok) },
      ok_def: { value: getDef(triple.ok) },
      ok_ortg: triple.ok.off_rtg,
      bad_net: { value: getNet(triple.bad) },
      bad_off: { value: getOff(triple.bad) },
      bad_def: { value: getDef(triple.bad) },
      bad_ortg: triple.bad.off_rtg,
      rebound: { value: triple.ok.def_orb?.value },
      edit: <Button variant="outline-secondary" size="sm"><FontAwesomeIcon icon={faPen} /></Button>,
      disable: <Button variant="outline-secondary" size="sm"><FontAwesomeIcon icon={faFilter} /></Button>,
    };
    return GenericTableOps.buildDataRow(tableEl, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta);
  }).concat(GenericTableOps.buildRowSeparator());

  const subHeaders = [ 
    GenericTableOps.buildSubHeaderRow(
      [ 
        [ <div/>, 7 ], 
        [ <i>Optimistic</i>, 6 ], [ <div/>, 1 ], [ <i>Balanced</i>, 6 ], [ <div/>, 1 ], [ <i>Pessimistic</i>, 6 ], [ <div/>, 1 ],
        [ <div/>, 4 ]
      ], "small text-center"
    ),
    GenericTableOps.buildDataRow({
      title: <b>Team Totals</b>
    }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta),
    GenericTableOps.buildDataRow({
      title: <b>Team Grades</b>
    }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta),
    GenericTableOps.buildSubHeaderRow(
      [ 
        [ <div/>, 7 ], 
        [ <div/>, 6 ], [ <div/>, 1 ], [ <div><b>Guards</b> (0%)</div>, 6 ], [ <div/>, 6 ], [ <div/>, 1 ], [ <div/>, 4 ], 
      ], "small text-center"
    ),
  ];
  //TODO: Add: Transfer | Generic | D1

  const trailers = [ 

  ];

  const rosterTable = <GenericTable
    tableCopyId="rosterEditorTable"
    tableFields={tableDef}
    tableData={subHeaders.concat(rosterTableData)}
    cellTooltipMode={undefined}
  />;

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
              friendlyChange(() => setGender(newGender), newGender != gender);
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
              friendlyChange(() => setYear(newYear), newYear != year);
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
              setTeam(teamYear[0]);
              setYear(teamYear[1]);
            } else {
              setTeam(selection);
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
    <Row className="mt-2">
      <Col style={{paddingLeft: "5px", paddingRight: "5px"}}>
        <GenericCollapsibleCard minimizeMargin={true} title="Add New Player" helpLink={undefined} startClosed={true}>
          <PlayerLeaderboardTable
              startingState={startingState}
              dataEvent={dataEvent}
              onChangeState={() => null}
              teamEditorMode={(p: IndivStatSet) => null}
            />
        </GenericCollapsibleCard>
      </Col>
    </Row>
  </Container>;
};

export default TeamEditorTable;
