// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

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
import Button from 'react-bootstrap/Button';

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
import Select, { components} from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable";
import RosterStatsDiagView from "./RosterStatsDiagView";

// Util imports
import { CbbColors } from "../utils/CbbColors";
import { GameFilterParams } from "../utils/FilterModels";
import { ORtgDiagnostics, StatsUtils } from "../utils/StatsUtils";
import { TeamStatsModel } from '../components/TeamStatsTable';

export type RosterStatsModel = {
  on?: Array<any>,
  off?: Array<any>,
  baseline?: Array<any>,
  error_code?: string
}
type Props = {
  gameFilterParams: GameFilterParams,
  teamStats: TeamStatsModel,
  rosterStats: RosterStatsModel
}

const RosterStatsTable: React.FunctionComponent<Props> = ({gameFilterParams, teamStats, rosterStats}) => {

  // 1] State (some of these are phase 2+ and aren't plumbed in yet)

  /** Splits out offensive and defensive metrics into separate rows */
  const [ expandedView, setExpandedView ] = useState(false);

  /** Show baseline even if on/off are present */
  const [ alwaysShowBaseline, setAlwaysShowBaseline ] = useState(false);

  /** Show a diagnostics mode explaining the off/def ratings */
  const [ showDiagMode, setShowDiagMode ] = useState(false);

  /** Incorporates SoS into rating calcs "Adj [Eq] Rtg" */
  const [ adjORtgForSos, setAdjORtgForSos ] = useState(false);

  /** Switches usage to an offset "[Adj] Eq ORtg" */
  const [ showEquivORtgAtUsage, setShowEquivORtgAtUsage ] = useState("" as string);

  /** Which players to filter */
  const [ filterStr, setFilterStr ] = useState("");

  // (slight delay when typing into the filter to make it more responsive)
  const [ timeoutId, setTimeoutId ] = useState(-1);
  const [ tmpFilterStr, setTmpFilterStr ] = useState(filterStr);

  const filterFragments =
    filterStr.split(",").map(fragment => _.trim(fragment)).filter(fragment => fragment ? true : false);
  const filterFragmentsPve =
    filterFragments.filter(fragment => fragment[0] != '-');
  const filterFragmentsNve =
    filterFragments.filter(fragment => fragment[0] == '-').map(fragment => fragment.substring(1));

  // 2] Data Model

  //TODO: fix the wording for all these

  const tableFields = _.omit({ //accessors vs column metadata
    "title": GenericTableOps.addTitle("", "", rowSpanCalculator, "small"),
    "sep0": GenericTableOps.addColSeparator(),
    "rtg": GenericTableOps.addPtsCol("Rtg", "Offensive/Defensive rating for selected lineups", CbbColors.picker(...CbbColors.pp100)),
    "usage": GenericTableOps.addPctCol("Usg", "% of team possessions used for selected lineups", CbbColors.picker(...CbbColors.usg)), //TODO needs to be steeper
    "sep1": GenericTableOps.addColSeparator(),
    "efg": GenericTableOps.addPctCol("eFG%", "Effective field goal% (3 pointers count 1.5x as much) for player in selected lineups", CbbColors.picker(...CbbColors.eFG)),
    "assist": GenericTableOps.addPctCol("A%", "Assist % for player in selected lineups", CbbColors.picker(...CbbColors.ast)),
    "to": GenericTableOps.addPctCol("TO%", "Turnover % for player in for selected lineups", CbbColors.picker(...CbbColors.p_tOver)),
    "orb": expandedView ?
      GenericTableOps.addPctCol("RB%", "Offensive/Defensive rebounding % for player in selected lineups", CbbColors.picker(...CbbColors.p_oReb)) :
      GenericTableOps.addPctCol("OR%", "Offensive rebounding % for player in selected lineups", CbbColors.picker(...CbbColors.p_oReb))
      ,
    "drb": GenericTableOps.addPctCol("DR%", "Defensive rebounding % for player in selected lineups", CbbColors.picker(...CbbColors.p_dReb)),
    "ftr": GenericTableOps.addPctCol("FTR", "Free throw rate for player in selected lineups", CbbColors.picker(...CbbColors.p_ftr)),
    "sep2": GenericTableOps.addColSeparator(),
    "3pr": GenericTableOps.addPctCol("3PR", "Percentage of 3 pointers taken against all field goals", CbbColors.picker(...CbbColors.fgr)),
    "2pmidr": GenericTableOps.addPctCol("2PR mid", "Percentage of mid range 2 pointers taken against all field goals", CbbColors.picker(...CbbColors.fgr)),
    "2primr": GenericTableOps.addPctCol("2PR rim", "Percentage of layup/dunk/etc 2 pointers taken against all field goals", CbbColors.picker(...CbbColors.fgr)),
    "sep3": GenericTableOps.addColSeparator(),
    "3p": GenericTableOps.addPctCol("3P%", "3 point field goal percentage", CbbColors.picker(...CbbColors.fg3P)),
    "2p": GenericTableOps.addPctCol("2P%", "2 point field goal percentage", CbbColors.picker(...CbbColors.fg2P)),
    "2pmid": GenericTableOps.addPctCol("2P% mid", "2 point field goal percentage (mid range)", CbbColors.picker(...CbbColors.fg2P_mid)),
    "2prim": GenericTableOps.addPctCol("2P% rim", "2 point field goal percentage (layup/dunk/etc)", CbbColors.picker(...CbbColors.p_fg2P_rim)),
    "sep4": GenericTableOps.addColSeparator(),
    "team_poss": GenericTableOps.addIntCol("Poss", "Number of possessions in selected lineups that player was on the floor", GenericTableOps.defaultColorPicker),
    "adj_opp": GenericTableOps.addPtsCol("SoS", "Weighted average of the offensive or defensive efficiencies of the lineups' opponents", GenericTableOps.defaultColorPicker),
  }, expandedView ? [ "drb" ] : [ "adj_opp" ] );

  // 3] Utils

  // 3.1] Table building

  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off";
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def";

  const onOffBasePicker = (str: string, arr: Array<any>) => {
    return _.find(arr, (p) => _.startsWith(p.title, str));
  }

  /** Show baseline unless both on and off are present */
  const skipBaseline = !alwaysShowBaseline &&
    (rosterStats?.on?.length && rosterStats?.off?.length);

  const allPlayers = _.chain([
    _.map(rosterStats.on  || [], (p) => _.merge(p, {title: `'ON' ${p.key}`})),
    _.map(rosterStats.off  || [], (p) => _.merge(p, {title: `'OFF' ${p.key}`})),
    _.map(rosterStats.baseline || [], (p) => _.merge(p, {title: `'Baseline' ${p.key}`})),
  ]).flatten().groupBy("key").toPairs().map((key_onOffBase) => {

    return {
      key: key_onOffBase[0],
      on: onOffBasePicker("'ON' ", key_onOffBase[1]),
      off: onOffBasePicker("'OFF' ", key_onOffBase[1]),
      baseline: onOffBasePicker("'Baseline' ", key_onOffBase[1])
    };
  }).value();

  const tableData = _.chain(allPlayers).filter((player) => {
    const strToTest = (player.on?.key || player.off?.key || player.baseline?.key || "");
    return(
      (filterFragmentsPve.length == 0) ||
        (_.find(filterFragmentsPve, (fragment) => strToTest.indexOf(fragment) >= 0) ? true : false))
      &&
      ((filterFragmentsNve.length == 0) ||
        (_.find(filterFragmentsNve, (fragment) => strToTest.indexOf(fragment) >= 0) ? false : true))
      ;
  }).sortBy(
    [ (p) => { return p.on?.off_pos?.value ||  p.baseline?.off_pos?.value || 0 } ] //TODO: other things
  ).flatMap((player) => {
    if (!expandedView) { //(ensure DRB is present)
      [ player.on, player.off, player.baseline ].forEach((stat) => {
        if (!_.isNil(stat?.def_orb)) {
          stat.off_drb = stat.def_orb;
        }
      });
    }
    const [ onORtg, onORtgDiag ] = StatsUtils.buildORtg(player.on, showDiagMode);
    const [ offORtg, offORtgDiag ] = StatsUtils.buildORtg(player.off, showDiagMode);
    const [ baseORtg, baseORtgDiag ] = StatsUtils.buildORtg(player.baseline, showDiagMode);
    const onStats = { off_title: player.on?.title, off_rtg: onORtg, ...player.on };
    const offStats = { off_title: player.off?.title, off_rtg: offORtg, ...player.off };
    const baseStats = { off_title: player.baseline?.title, off_rtg: baseORtg, ...player.baseline };
    return _.flatten([
      _.isNil(onStats.off_title) ? [ ] : _.flatten([
        [ GenericTableOps.buildDataRow(onStats, offPrefixFn, offCellMetaFn) ],
        expandedView ? [ GenericTableOps.buildDataRow(onStats, defPrefixFn, defCellMetaFn) ] : [],
        onORtgDiag ? [ GenericTableOps.buildTextRow(<RosterStatsDiagView ortgDiags={onORtgDiag}/>, "small") ] : []
      ]),
      _.isNil(offStats.off_title) ? [ ] : _.flatten([
        [ GenericTableOps.buildDataRow(offStats, offPrefixFn, offCellMetaFn) ],
        expandedView ? [ GenericTableOps.buildDataRow(offStats, defPrefixFn, defCellMetaFn) ] : [],
        offORtgDiag ? [ GenericTableOps.buildTextRow(<RosterStatsDiagView ortgDiags={offORtgDiag}/>, "small") ] : []
      ]),
      (skipBaseline || _.isNil(baseStats.off_title)) ? [ ] : _.flatten([
        [ GenericTableOps.buildDataRow(baseStats, offPrefixFn, offCellMetaFn) ],
        expandedView ? [ GenericTableOps.buildDataRow(baseStats, defPrefixFn, defCellMetaFn) ] : [],
        baseORtgDiag ? [ GenericTableOps.buildTextRow(<RosterStatsDiagView ortgDiags={baseORtgDiag}/>, "small") ] : []
      ]),
      [ GenericTableOps.buildRowSeparator() ]
    ]);
  }).value();

  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return (rosterStats?.baseline?.length || 0) == 0;
  }
  /** Table formatter */
  function rowSpanCalculator(cellMeta: string) {
    switch(cellMeta) {
      case "off": return expandedView ? 2 : 1;
      case "def": return 0;
      default: return 1;
    }
  }

  /** Handling filter change (/key presses to fix the select/delete on page load) */
  const onFilterChange = (ev: any) => {
    const toSet = ev.target.value;
    setTmpFilterStr(toSet);
    if (timeoutId != -1) {
      window.clearTimeout(timeoutId);
    }
    setTimeoutId(window.setTimeout(() => {
      setFilterStr(toSet);
    }, 100));
  };

  // 4] View

  return <Container>
    <LoadingOverlay
      active={needToLoadQuery()}
      text={rosterStats.error_code ?
        `Query Error: ${rosterStats.error_code}` :
        "Press 'Submit' to view results"
      }
    >
      <Form.Row>
        <Form.Group as={Col} sm="6">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="filter">Filter</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              onKeyUp={onFilterChange}
              onChange={onFilterChange}
              placeholder = "eg Player1Surname,Player2FirstName,-Player3Name"
              value={tmpFilterStr}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} sm="5">
        </Form.Group>
        <Form.Group as={Col} sm="1">
          <Dropdown alignRight>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              <FontAwesomeIcon icon={faCog} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Button}>
                <div onClick={() => setExpandedView(!expandedView)}>
                  <span>Show expanded statistics</span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  {expandedView ? <FontAwesomeIcon icon={faCheck}/> : null}
                </div>
              </Dropdown.Item>
              <Dropdown.Item as={Button}>
                <div onClick={() => setAlwaysShowBaseline(!alwaysShowBaseline)}>
                  <span>Always show baseline statistics</span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  {alwaysShowBaseline ? <FontAwesomeIcon icon={faCheck}/> : null}
                </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as={Button}>
                <div onClick={() => setShowDiagMode(!showDiagMode)}>
                  <span>Show Off/Def Rating diagnostics</span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  {showDiagMode ? <FontAwesomeIcon icon={faCheck}/> : null}
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      </Form.Row>
      <Row>
        <Col>
          <GenericTable tableCopyId="rosterStatsTable" tableFields={tableFields} tableData={tableData}/>
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
}

export default RosterStatsTable;
