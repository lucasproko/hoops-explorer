// React imports:
import React, { useState, useEffect } from 'react';

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
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
import Select, { components} from "react-select";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable";
import RosterStatsDiagView from "./diags/RosterStatsDiagView";
import PositionalDiagView from "./diags/PositionalDiagView";
import GenericTogglingMenu from "./shared/GenericTogglingMenu";
import GenericTogglingMenuItem from "./shared/GenericTogglingMenuItem";
import { TeamStatsModel } from '../components/TeamStatsTable';

// Util imports
import { CbbColors } from "../utils/CbbColors";
import { CommonTableDefs } from "../utils/CommonTableDefs";
import { getCommonFilterParams, ParamDefaults, GameFilterParams } from "../utils/FilterModels";
import { ORtgDiagnostics, RatingUtils } from "../utils/stats/RatingUtils";
import { PositionUtils } from "../utils/stats/PositionUtils";
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';

export type RosterStatsModel = {
  on?: Array<any>,
  off?: Array<any>,
  onOffMode?: boolean,
  baseline?: Array<any>,
  global?: Array<any>, //(across all samples for the team)
  error_code?: string
}
type Props = {
  gameFilterParams: GameFilterParams,
  teamStats: TeamStatsModel,
  rosterStats: RosterStatsModel,
  onChangeState: (newParams: GameFilterParams) => void;
}

const RosterStatsTable: React.FunctionComponent<Props> = ({gameFilterParams, teamStats, rosterStats, onChangeState}) => {

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  /** Only show help for diagnstic on/off on main page */
  const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");

  // 1] State (some of these are phase 2+ and aren't plumbed in yet)

  const commonParams = getCommonFilterParams(gameFilterParams);
  const genderYearLookup = `${commonParams.gender}_${commonParams.year}`;
  const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

  /** Splits out offensive and defensive metrics into separate rows */
  const [ expandedView, setExpandedView ] = useState(_.isNil(gameFilterParams.showExpanded) ?
    ParamDefaults.defaultPlayerShowExpanded : gameFilterParams.showExpanded
  );

  /** Show baseline even if on/off are present */
  const [ alwaysShowBaseline, setAlwaysShowBaseline ] = useState(_.isNil(gameFilterParams.showBase) ?
    ParamDefaults.defaultPlayerShowBase : gameFilterParams.showBase
  );

  /** Show a diagnostics mode explaining the off/def ratings */
  const [ showDiagMode, setShowDiagMode ] = useState(_.isNil(gameFilterParams.showDiag) ?
    ParamDefaults.defaultPlayerDiagMode : gameFilterParams.showDiag
  );

  /** Show a diagnostics mode explaining the positional evaluation */
  const [ showPositionDiags, setShowPositionDiags ] = useState(_.isNil(gameFilterParams.showPosDiag) ?
      ParamDefaults.defaultPlayerPosDiagMode : gameFilterParams.showPosDiag
  );

  /** Show a diagnostics mode explaining the off/def ratings */
  const [ possAsPct, setPossAsPct ] = useState(_.isNil(gameFilterParams.possAsPct) ?
    ParamDefaults.defaultPlayerPossAsPct : gameFilterParams.possAsPct
  );

  /** Incorporates SoS into rating calcs "Adj [Eq] Rtg" */
  const [ adjORtgForSos, setAdjORtgForSos ] = useState(false);

  /** Switches usage to an offset "[Adj] Eq ORtg" */
  const [ showEquivORtgAtUsage, setShowEquivORtgAtUsage ] = useState("" as string);

  /** Which players to filter */
  const [ filterStr, setFilterStr ] = useState(_.isNil(gameFilterParams.filter) ?
    ParamDefaults.defaultPlayerFilter : gameFilterParams.filter
  );

  // (slight delay when typing into the filter to make it more responsive)
  const [ timeoutId, setTimeoutId ] = useState(-1);
  const [ tmpFilterStr, setTmpFilterStr ] = useState(filterStr);

  const filterFragments =
    filterStr.split(",").map(fragment => _.trim(fragment)).filter(fragment => fragment ? true : false);
  const filterFragmentsPve =
    filterFragments.filter(fragment => fragment[0] != '-');
  const filterFragmentsNve =
    filterFragments.filter(fragment => fragment[0] == '-').map(fragment => fragment.substring(1));

  // Sort field
  const [ sortBy, setSortBy ] = useState(_.isNil(gameFilterParams.sortBy) ?
    ParamDefaults.defaultPlayerSortBy : gameFilterParams.sortBy
  );

  useEffect(() => { //(this ensures that the filter component is up to date with the union of these fields)
    const newState = _.chain(gameFilterParams).merge({
      sortBy: sortBy,
      filter: filterStr,
      showBase: alwaysShowBaseline,
      showExpanded: expandedView,
      showDiag: showDiagMode,
      possAsPct: possAsPct,
      showPosDiag: showPositionDiags,
    }).omit(_.flatten([ // omit all defaults
      (sortBy == ParamDefaults.defaultPlayerSortBy) ? [ 'sortBy' ] : [],
      (filterStr == ParamDefaults.defaultPlayerFilter) ? [ 'filter' ] : [],
      (alwaysShowBaseline == ParamDefaults.defaultPlayerShowBase) ? [ 'showBase' ] : [],
      (expandedView == ParamDefaults.defaultPlayerShowExpanded) ? [ 'showExpanded' ] : [],
      (showDiagMode == ParamDefaults.defaultPlayerDiagMode) ? [ 'showDiag' ] : [],
      (possAsPct == ParamDefaults.defaultPlayerPossAsPct) ? [ 'possAsPct' ] : [],
      (showPositionDiags == ParamDefaults.defaultPlayerPosDiagMode) ? [ 'showPosDiag' ] : [],
    ])).value();
    onChangeState(newState);
  }, [ sortBy, filterStr, showDiagMode, alwaysShowBaseline, expandedView, possAsPct, showPositionDiags ]);

  // 2] Data Model

  const allTableFields = CommonTableDefs.onOffIndividualTable(expandedView);

  const tableFields = _.omit(allTableFields,
    [
      expandedView ?  "drb"  : "adj_opp",
      possAsPct ? "team_poss" : "team_poss_pct",
    ]
  );

  // 3] Utils

  // 3.1] Table building

  /** Handles the various sorting combos */
  const sorter = (sortStr: string) => { // format: (asc|desc):(off_|def_|diff_)<field>:(on|off|delta)
    const sortComps = sortStr.split(":"); //asc/desc
    const dir = (sortComps[0] == "desc") ? -1 : 1;
    const fieldComps = _.split(sortComps[1], "_", 1); //off/def/diff
    const fieldName = sortComps[1].substring(fieldComps[0].length + 1); //+1 for _
    const field = (player: any) => {
      return player?.[sortComps[1]]?.value || 0; //(off or def)
    };
    const onOrOff = (playerSet: any) => {
      switch(sortComps[2]) {
        case "on": return [ playerSet.on ];
        case "off": return [ playerSet.off ];
        case "baseline": return [ playerSet.baseline ];
        default: return [ 0 ];
      }
    };
    return (playerSet: any) => {
      const playerFields = onOrOff(playerSet || {}).map(player => field(player) || 0);
      return dir*playerFields[0];
    };
  };

  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off";
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def";

  const onOffBasePicker = (str: "On" | "Off" | "Baseline", arr: Array<any>) => {
    return _.find(arr, (p) => _.startsWith(p.onOffKey, str));
  }

  /** Show baseline unless both on and off are present */
  const skipBaseline = !alwaysShowBaseline &&
    (rosterStats?.on?.length && rosterStats?.off?.length);

  const baselineIsOnlyLine = !(rosterStats?.on?.length || rosterStats?.off?.length);

  const onOffBaseToPhrase = (type: "on" | "off" | "baseline") => {
    switch(type) {
      case "on":  return "A";
      case "off":  return "B";
      case "baseline": return "Base"
    }
  };

  /** Adds a tooltip to the code */
  const buildPositionTooltip = (pos: string, type: "on" | "off" | "baseline") => {
    const fullPos = PositionUtils.idToPosition[pos] || "Unknown"
    return <Tooltip id={pos + "Tooltip"}>
      {fullPos}<br/><br/>
      Algorithmically assigned via stats from {onOffBaseToPhrase(type)} lineups.
      See "Show Positional diagnostics" (gear icon on right) for more details.
    </Tooltip>;
  }


  /** Utility function to build the title for the player stats */
  const insertTitle = (playerName: string, type: "on" | "off" | "baseline", pos: string) => {
    const singleLineCase = type == "baseline" && baselineIsOnlyLine;
      //^ (if this is set we only show it together with on/off)
    const sub = onOffBaseToPhrase(type);

    const posIfNotExpanded1 = expandedView ? null :
      <OverlayTrigger placement="auto" overlay={buildPositionTooltip(pos, type)}>
          <sup>{pos}</sup>
      </OverlayTrigger>;

    const posIfNotExpanded2 = expandedView ? null :
      <OverlayTrigger placement="auto" overlay={buildPositionTooltip(pos, type)}>
          <small>{pos} - </small>
      </OverlayTrigger>;

    return singleLineCase ?
      <span>
        <span className="d-none d-xl-block"><b>{playerName}</b> {posIfNotExpanded1}</span>
        <span className="d-block d-xl-none"><b>{playerName}</b></span>
      </span> :
      <span>
        <span><b>{playerName}</b></span>
        <span className="d-none d-xl-block">{posIfNotExpanded2}<b>{sub}</b> lineups</span>
        <span className="d-block d-xl-none"><b>{sub}</b> set</span>
      </span>;
  };

  // (Always just use A/B here because it's too confusing to say
  // "On <Player name>" meaning ""<Player Name> when <Other other player> is on")
  const allPlayers = _.chain([
    _.map(rosterStats.on  || [], (p) => _.merge(p, {
      onOffKey: 'On'
    })),
    _.map(rosterStats.off  || [], (p) => _.merge(p, {
      onOffKey: 'Off'
    })),
    _.map(rosterStats.baseline || [], (p) => _.merge(p, {
      onOffKey: 'Baseline'

    })),
  ]).flatten().groupBy("key").toPairs().map((key_onOffBase) => {

    const player = { // Now grouped by player, re-create the on/off/baseline set
      key: key_onOffBase[0],
      on: onOffBasePicker("On", key_onOffBase[1]),
      off: onOffBasePicker("Off", key_onOffBase[1]),
      baseline: onOffBasePicker("Baseline", key_onOffBase[1])
    };

    // Inject ORtg and DRB and Poss% (ie mutate player idempotently)
    ([ "on", "off", "baseline" ] as ("on" | "off" | "baseline")[]).forEach((key) => {
      const stat = (player as any)[key];
      const teamStat = (teamStats as any)[key] || {};
      if (stat) {
        stat.off_team_poss_pct = { value: _.min([(stat.off_team_poss.value || 0)
            / (teamStat.off_poss?.value || 1), 1 ]) };
        stat.def_team_poss_pct = { value: _.min([(stat.def_team_poss.value || 0)
            / (teamStat.def_poss?.value || 1), 1 ]) };

        stat.off_drb = stat.def_orb; //(just for display, all processing should use def_orb)
        const [ oRtg, adjORtg, oRtgDiag ] = RatingUtils.buildORtg(stat, avgEfficiency, showDiagMode);
        const [ dRtg, adjDRtg, dRtgDiag ] = RatingUtils.buildDRtg(stat, avgEfficiency, showDiagMode);
        stat.off_rtg = oRtg;
        stat.off_adj_rtg = adjORtg;
        stat.diag_off_rtg = oRtgDiag;
        stat.def_rtg = dRtg;
        stat.def_adj_rtg = adjDRtg;
        stat.diag_def_rtg = dRtgDiag;

        // Positional info:

        const [ posConfs, posConfsDiags ] = PositionUtils.buildPositionConfidences(stat);
        const [ pos, posDiags ] = PositionUtils.buildPosition(posConfs, stat);
        stat.def_usage = <OverlayTrigger placement="auto" overlay={buildPositionTooltip(pos, key)}>
          <small>{pos}</small>
        </OverlayTrigger>;

        // Now we have the position we can build the titles:
        stat.off_title = insertTitle(stat.key, key, pos);
      }
    });
    return player;
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
    [ sorter(sortBy) , (p) => { p.baseline?.off_team_poss?.value || 0 } ]
  ).flatMap((p) => {

    return _.flatten([
      _.isNil(p.on?.off_title) ? [ ] : _.flatten([
        [ GenericTableOps.buildDataRow(p.on, offPrefixFn, offCellMetaFn) ],
        expandedView ? [ GenericTableOps.buildDataRow(p.on, defPrefixFn, defCellMetaFn) ] : [],
        p.on?.diag_off_rtg ?
          [ GenericTableOps.buildTextRow(<RosterStatsDiagView ortgDiags={p.on?.diag_off_rtg} drtgDiags={p.on?.diag_def_rtg}/>, "small") ] : [],
        showPositionDiags ?
          [ GenericTableOps.buildTextRow(<PositionalDiagView player={p.on} showHelp={showHelp}/>, "small") ] : [],
      ]),
      _.isNil(p.off?.off_title) ? [ ] : _.flatten([
        [ GenericTableOps.buildDataRow(p.off, offPrefixFn, offCellMetaFn) ],
        expandedView ? [ GenericTableOps.buildDataRow(p.off, defPrefixFn, defCellMetaFn) ] : [],
        p.off?.diag_off_rtg ?
          [ GenericTableOps.buildTextRow(<RosterStatsDiagView ortgDiags={p.off?.diag_off_rtg} drtgDiags={p.off?.diag_def_rtg}/>, "small") ] : [],
        showPositionDiags ?
          [ GenericTableOps.buildTextRow(<PositionalDiagView player={p.off} showHelp={showHelp}/>, "small") ] : [],
      ]),
      (skipBaseline || _.isNil(p.baseline?.off_title)) ? [ ] : _.flatten([
        [ GenericTableOps.buildDataRow(p.baseline, offPrefixFn, offCellMetaFn) ],
        expandedView ? [ GenericTableOps.buildDataRow(p.baseline, defPrefixFn, defCellMetaFn) ] : [],
        p.baseline?.diag_off_rtg ?
          [ GenericTableOps.buildTextRow(<RosterStatsDiagView ortgDiags={p.baseline?.diag_off_rtg} drtgDiags={p.baseline?.diag_def_rtg}/>, "small") ] : [],
        showPositionDiags ?
          [ GenericTableOps.buildTextRow(<PositionalDiagView player={p.baseline} showHelp={showHelp}/>, "small") ] : [],
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

  /** For use in selects */
  function stringToOption(s: string) {
    return sortOptionsByValue[s];
  }

  // 3.1] Sorting utils

  const sortOptions: Array<any> = _.flatten(
    _.toPairs(allTableFields)
      .filter(keycol => keycol[1].colName && keycol[1].colName != "")
      .map(keycol => {
        return _.flatMap([
          //TODO: inject some defensive fields in here
          ["desc","off"], ["asc","off"],
        ], sort_offDef => {
          const onOffCombos = _.flatMap([
            ["baseline", "on", "off"]
          ]);
          return onOffCombos.map(onOff => {
            return [ ...sort_offDef, onOff ];
          }); // eg [ [ desc, off, on ], [ desc, off, off ], [ desc, off, delta ] ]
        }).map(combo => {
          const onOrOff = (s: string) => { switch(s) {
            case "on": return "'On'";
            case "off": return "'Off'";
            case "baseline": return "Base";
          }}
          const ascOrDesc = (s: string) => { switch(s) {
            case "asc": return "Asc.";
            case "desc": return "Desc.";
          }}
          const offOrDef = (s: string) => { switch(s) {
            case "off": return "Offensive";
            case "def": return "Defensive";
          }}
          return {
            label: `${onOrOff(combo[2])} ${keycol[1].colName} (${ascOrDesc(combo[0])} / ${offOrDef(combo[1])})`,
            value: `${combo[0]}:${combo[1]}_${keycol[0]}:${combo[2]}`
          };
        });
      })
  );
  const sortOptionsByValue = _.fromPairs(
    sortOptions.map(opt => [opt.value, opt])
  );
  /** Put these options at the front */
  const mostUsefulSubset = _.flatMap([
    [
      "desc:off_team_poss_pct:baseline", "desc:off_team_poss_pct:on", "desc:off_team_poss_pct:off",
      "desc:off_rtg:baseline", "desc:off_rtg:on", "desc:off_rtg:off",
      "desc:off_usage:baseline", "desc:off_usage:on", "desc:off_usage:off",
    ]
  ]);
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

  // 4] View

  /** The sub-header builder */
  const formatGroupLabel = (data: any) => (
    <div>
      <span>{data.label}</span>
    </div>
  );

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
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="sortBy">Sort By</InputGroup.Text>
            </InputGroup.Prepend>
            <Select
              className="w-75"
              value={ stringToOption(sortBy) }
              options={ groupedOptions }
              onChange={(option) => { if ((option as any)?.value)
                setSortBy((option as any)?.value);
              }}
              formatGroupLabel={formatGroupLabel}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} sm="1">
          <GenericTogglingMenu>
            <GenericTogglingMenuItem
              text="Show expanded statistics"
              truthVal={expandedView}
              onSelect={() => setExpandedView(!expandedView)}
            />
            <GenericTogglingMenuItem
              text="Always show baseline statistics"
              truthVal={alwaysShowBaseline}
              onSelect={() => setAlwaysShowBaseline(!alwaysShowBaseline)}
            />
            <GenericTogglingMenuItem
              text={<span>{possAsPct ?
                "Show possessions as count" : "Show possessions as % of team"
              }</span>}
              truthVal={false}
              onSelect={() => setPossAsPct(!possAsPct)}
            />
            <Dropdown.Divider />
            <GenericTogglingMenuItem
              text="Show Off/Def Rating diagnostics"
              truthVal={showDiagMode}
              onSelect={() => setShowDiagMode(!showDiagMode)}
            />
            <GenericTogglingMenuItem
              text="Show Positional diagnostics"
              truthVal={showPositionDiags}
              onSelect={() => setShowPositionDiags(!showPositionDiags)}
            />
          </GenericTogglingMenu>
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
