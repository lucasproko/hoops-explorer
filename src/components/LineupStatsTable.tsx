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

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
import Select, { components } from "react-select";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable";
import { RosterStatsModel } from './RosterStatsTable';
import { TeamStatsModel } from './TeamStatsTable';
import LuckConfigModal from './shared/LuckConfigModal';
import GenericTogglingMenu from './shared/GenericTogglingMenu';
import GenericTogglingMenuItem from './shared/GenericTogglingMenuItem';
import ToggleButtonGroup from "./shared/ToggleButtonGroup";
import LuckAdjDiagView from './diags/LuckAdjDiagView';
import AsyncFormControl from './shared/AsyncFormControl';

// Table building
import { TableDisplayUtils } from "../utils/tables/TableDisplayUtils";
import { LineupTableUtils } from "../utils/tables/LineupTableUtils";

// Util imports
import { LineupUtils } from "../utils/stats/LineupUtils";
import { CbbColors } from "../utils/CbbColors";
import { CommonTableDefs } from "../utils/CommonTableDefs";
import { PositionUtils } from "../utils/stats/PositionUtils";
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { LineupFilterParams, ParamDefaults, LuckParams } from '../utils/FilterModels';

export type LineupStatsModel = {
  lineups?: Array<any>,
  error_code?: string
}
type Props = {
  startingState: LineupFilterParams,
  dataEvent: {
    lineupStats: LineupStatsModel,
    teamStats: TeamStatsModel,
    rosterStats: RosterStatsModel,
  },
  onChangeState: (newParams: LineupFilterParams) => void
}

const LineupStatsTable: React.FunctionComponent<Props> = ({startingState, dataEvent, onChangeState}) => {
  const { lineupStats, teamStats, rosterStats } = dataEvent;

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  /** Only show help for diagnstic on/off on main page */
  const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");

  // 1] Data Model

  // 2] State

  // Misc display

  /** Whether to show the weighted combo of all visible lineups */
  const [ showTotals, setShowTotals ] = useState(_.isNil(startingState.showTotal) ?
    ParamDefaults.defaultLineupShowTotal : startingState.showTotal
  );

  const teamSeasonLookup = `${startingState.gender}_${startingState.team}_${startingState.year}`;

  const startingMinPoss = startingState.minPoss || ParamDefaults.defaultLineupMinPos;
  const [ minPoss, setMinPoss ] = useState(startingMinPoss);
  const startingMaxTableSize = startingState.maxTableSize || ParamDefaults.defaultLineupMaxTableSize;
  const [ maxTableSize, setMaxTableSize ] = useState(startingMaxTableSize);
  const [ sortBy, setSortBy ] = useState(startingState.sortBy || ParamDefaults.defaultLineupSortBy);
  const [ filterStr, setFilterStr ] = useState(startingState.filter || ParamDefaults.defaultLineupFilter);

  // Luck:

  /** Adjust for luck in all stats */
  const [ adjustForLuck, setAdjustForLuck ] = useState(_.isNil(startingState.lineupLuck) ?
    ParamDefaults.defaultLineupLuckAdjust : startingState.lineupLuck
  );
  /** Whether to show the luck diagnostics */
  const [ showLuckAdjDiags, setShowLuckAdjDiags ] = useState(_.isNil(startingState.showLineupLuckDiags) ?
    ParamDefaults.defaultLineupLuckDiagMode : startingState.showLineupLuckDiags
  );
  /** The settings to use for luck adjustment */
  const [ luckConfig, setLuckConfig ] = useState(_.isNil(startingState.luck) ?
    ParamDefaults.defaultLuckConfig : startingState.luck
  );

  /** Whether we are showing the luck config modal */
  const [ showLuckConfig, setShowLuckConfig ] = useState(false);

  /** Whether to badge/colorize the lineups */
  const [ decorateLineups, setDecorateLineups ] = useState(_.isNil(startingState.decorate) ?
    ParamDefaults.defaultLineupDecorate : startingState.decorate
  );

  useEffect(() => { //(this ensures that the filter component is up to date with the union of these fields)
    const newState = {
      ...startingState,
      // Luck
      luck: luckConfig,
      lineupLuck: adjustForLuck,
      showLineupLuckDiags: showLuckAdjDiags,
      // Misc filters
      decorate: decorateLineups,
      showTotal: showTotals,
      minPoss: minPoss,
      maxTableSize: maxTableSize,
      sortBy: sortBy,
      filter: filterStr
    };
    onChangeState(newState);
  }, [ decorateLineups, showTotals, minPoss, maxTableSize, sortBy, filterStr,
        luckConfig, adjustForLuck, showLuckAdjDiags ]);

  // 3] Utils

  // 3.0] Luck calculations:

  const genderYearLookup = `${startingState.gender}_${startingState.year}`;
  const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

  /** Need baseline player info for tooltip view/lineup decoration */
  const baselinePlayerInfo = LineupTableUtils.buildBaselinePlayerInfo(
    rosterStats.baseline, avgEfficiency
  );

  // 3.1] Build individual info

  // 3.1.1] Positional info from the season stats

  const positionFromPlayerKey = LineupTableUtils.buildPositionPlayerMap(rosterStats.global, teamSeasonLookup);

  // 3.2] Table building

  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off";
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def";

  const lineups = lineupStats?.lineups || [];
  const filteredLineups = LineupTableUtils.buildFilteredLineups(
    lineups,
    filterStr, sortBy, minPoss, maxTableSize,
    teamSeasonLookup, positionFromPlayerKey
  );

  const totalLineup = showTotals ? [
    _.assign(LineupUtils.calculateAggregatedLineupStats(filteredLineups), {
      key: LineupTableUtils.totalLineupId
    })
  ] : [];

  const tableData = LineupTableUtils.buildEnrichedLineups(
    filteredLineups,
    teamStats.global, rosterStats.global, teamStats.baseline,
    adjustForLuck, luckConfig.base, avgEfficiency,
    totalLineup, teamSeasonLookup, positionFromPlayerKey, baselinePlayerInfo
  ).flatMap((lineup, lineupIndex) => {
    TableDisplayUtils.injectPlayTypeInfo(lineup, false, false); //(inject assist numbers)

    const codesAndIds = LineupTableUtils.buildCodesAndIds(lineup);
    const sortedCodesAndIds = (lineup.key == LineupTableUtils.totalLineupId) ? undefined :
      PositionUtils.orderLineup(codesAndIds, positionFromPlayerKey, teamSeasonLookup);

    const perLineupBaselinePlayerMap = _.fromPairs(codesAndIds.map((cid: { code: string, id: string }) => {
      return [  cid.id, baselinePlayerInfo[cid.id] || {} ];
    })) as Record<string, Record<string, any>>;

    const lineupTitleKey = "" + lineupIndex;
    const title = sortedCodesAndIds ?
      TableDisplayUtils.buildDecoratedLineup(
        lineupTitleKey, sortedCodesAndIds, perLineupBaselinePlayerMap, positionFromPlayerKey, "off_adj_rtg", decorateLineups
      ) : "Weighted Total";

    const stats = { off_title: title, def_title: "", ...lineup };

    return _.flatten([
      [ GenericTableOps.buildDataRow(stats, offPrefixFn, offCellMetaFn) ],
      [ GenericTableOps.buildDataRow(stats, defPrefixFn, defCellMetaFn) ],
      showLuckAdjDiags && lineup.off_luck_diags ? [ GenericTableOps.buildTextRow(
        <LuckAdjDiagView
          name="lineup"
          offLuck={lineup.off_luck_diags}
          defLuck={lineup.def_luck_diags}
          baseline={luckConfig.base}
          showHelp={showHelp}
        />, "small pt-2"
      ) ] : [] ,
      [ GenericTableOps.buildRowSeparator() ]
    ]);
  });

  // 3.2] Sorting utils

  const sortOptions: Array<any> = _.flatten(
    _.toPairs(CommonTableDefs.lineupTable)
      .filter(keycol => keycol[1].colName && keycol[1].colName != "")
      .map(keycol => {
        return [
          ["desc","off"], ["asc","off"], ["desc","def"], ["asc","def"], ["desc","diff"], ["asc","diff"]
        ].map(combo => {
          const ascOrDesc = (s: string) => { switch(s) {
            case "asc": return "Asc.";
            case "desc": return "Desc.";
          }}
          const offOrDef = (s: string) => { switch(s) {
            case "off": return "Offensive";
            case "def": return "Defensive";
            case "diff": return "Off-Def";
          }}
          return {
            label: `${keycol[1].colName} (${ascOrDesc(combo[0])} / ${offOrDef(combo[1])})`,
            value: `${combo[0]}:${combo[1]}_${keycol[0]}`
          };
        });
      })
  );
  const sortOptionsByValue = _.fromPairs(
    sortOptions.map(opt => [opt.value, opt])
  );
  /** Put these options at the front */
  const mostUsefulSubset = [
    "desc:off_poss",
    "desc:diff_adj_ppp",
    "desc:off_adj_ppp",
    "asc:def_adj_ppp",
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
  /** The sub-header builder */
  const formatGroupLabel = (data: any) => (
    <div>
      <span>{data.label}</span>
    </div>
  );

  // 3] Utils
  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return lineupStats.lineups === undefined;
  }

  /** For use in selects */
  function stringToOption(s: string) {
    return sortOptionsByValue[s];
  }

  // 4] View

  return <Container>
    <LoadingOverlay
      active={needToLoadQuery()}
      text={lineupStats.error_code ?
        `Query Error: ${lineupStats.error_code}` :
        "Press 'Submit' to view results"
      }
    >
      <LuckConfigModal
        show={showLuckConfig}
        onHide={() => setShowLuckConfig(false)}
        onSave={(l: LuckParams) => setLuckConfig(l)}
        luck={luckConfig}
        showHelp={showHelp}
      />
      <Form.Row>
        <Form.Group as={Col} sm="8">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="filter">Filter</InputGroup.Text>
            </InputGroup.Prepend>
            <AsyncFormControl
              startingVal={filterStr}
              onChange={(t: string) => setFilterStr(t)}
              timeout={500}
              placeholder = "eg TeamA;-TeamB;Player1Code;Player2FirstName;-Player3Surname"
            />
          </InputGroup>
        </Form.Group>
        <Col sm="3"/>
        <Form.Group as={Col} sm="1">
          <GenericTogglingMenu>
            <GenericTogglingMenuItem
              text="Decorate Lineups"
              truthVal={decorateLineups}
              onSelect={() => setDecorateLineups(!decorateLineups)}
            />
            <GenericTogglingMenuItem
              text="Show Weighted Combo of All Lineups"
              truthVal={showTotals}
              onSelect={() => setShowTotals(!showTotals)}
            />
            <GenericTogglingMenuItem
              text="Adjust for Luck"
              truthVal={adjustForLuck}
              onSelect={() => setAdjustForLuck(!adjustForLuck)}
              helpLink={showHelp ? "https://hoop-explorer.blogspot.com/2020/07/luck-adjustment-details.html" : undefined}
            />
            <Dropdown.Divider />
            <GenericTogglingMenuItem
              text="Configure Luck Adjustments..."
              truthVal={false}
              onSelect={() => setShowLuckConfig(true)}
            />
            <Dropdown.Divider />
            <GenericTogglingMenuItem
              text="Show Luck Adjustment diagnostics"
              truthVal={showLuckAdjDiags}
              onSelect={() => setShowLuckAdjDiags(!showLuckAdjDiags)}
            />
          </GenericTogglingMenu>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} sm="3">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="maxLineups">Max Lineups</InputGroup.Text>
            </InputGroup.Prepend>
            <AsyncFormControl
              startingVal={startingMaxTableSize}
              validate={(t: string) => t.match("^[0-9]*$") != null}
              onChange={(t: string) => setMaxTableSize(t)}
              timeout={200}
              placeholder = "eg 50"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="minPossessions">Min Poss #</InputGroup.Text>
            </InputGroup.Prepend>
            <AsyncFormControl
              startingVal={startingMinPoss}
              validate={(t: string) => t.match("^[0-9]*$") != null}
              onChange={(t: string) => setMinPoss(t)}
              timeout={200}
              placeholder = "eg 20"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} sm="6">
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
      </Form.Row>
      <Form.Row>
        <Col>
          <ToggleButtonGroup items={[
            {
              label: "Totals",
              tooltip: showTotals ? "Hide Weighted Combo of All Lineups" : "Show Weighted Combo of All Lineups",
              toggled: showTotals,
              onClick: () => setShowTotals(!showTotals)
            },
            {
              label: "Luck",
              tooltip: adjustForLuck ? "Remove luck adjustments" : "Adjust statistics for luck",
              toggled: adjustForLuck,
              onClick: () => setAdjustForLuck(!adjustForLuck)
            }
          ]}/>
        </Col>
      </Form.Row>
      <Row className="mt-2">
        <Col style={{paddingLeft: "5px", paddingRight: "5px"}}>
          <GenericTable
            tableCopyId="lineupStatsTable"
            tableFields={CommonTableDefs.lineupTable}
            tableData={tableData}
            cellTooltipMode="none"
          />
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
};

export default LineupStatsTable;
