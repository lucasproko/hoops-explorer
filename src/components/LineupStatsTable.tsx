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
import LuckAdjDiagView from './diags/LuckAdjDiagView';

// Util imports
import { CbbColors } from "../utils/CbbColors";
import { CommonTableDefs } from "../utils/CommonTableDefs";
import { PositionUtils } from "../utils/stats/PositionUtils";
import { LuckUtils, OffLuckAdjustmentDiags, DefLuckAdjustmentDiags, LuckAdjustmentBaseline } from "../utils/stats/LuckUtils";
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { LineupFilterParams, ParamDefaults, LuckParams } from '../utils/FilterModels';

export type LineupStatsModel = {
  lineups?: Array<any>,
  error_code?: string
}
type Props = {
  lineupStats: LineupStatsModel,
  teamStats: TeamStatsModel,
  rosterStats: RosterStatsModel,
  startingState: LineupFilterParams;
  onChangeState: (newParams: LineupFilterParams) => void;
}

const LineupStatsTable: React.FunctionComponent<Props> = ({lineupStats, teamStats, rosterStats, startingState, onChangeState}) => {

  // 1] Data Model

  const [ adjustForLuck, setAdjustForLuck ] = useState(_.isNil(startingState.lineupLuck) ?
    ParamDefaults.defaultLineupLuckAdjust : startingState.lineupLuck
  );
  const [ showLuckAdjDiags, setShowLuckAdjDiags ] = useState(_.isNil(startingState.showLineupLuckDiags) ?
    ParamDefaults.defaultLineupLuckDiagMode : startingState.showLineupLuckDiags
  );
  const [ luckConfig, setLuckConfig ] = useState(_.isNil(startingState.luck) ?
    ParamDefaults.defaultLuckConfig : startingState.luck
  );

  /** Whether we are showing the luck config modal */
  const [ showLuckConfig, setShowLuckConfig ] = useState(false);

  // 2] State

  const teamSeasonLookup = `${startingState.gender}_${startingState.team}_${startingState.year}`;

  const [ minPoss, setMinPoss ] = useState(startingState.minPoss || ParamDefaults.defaultLineupMinPos);
  const [ maxTableSize, setMaxTableSize ] = useState(startingState.maxTableSize || ParamDefaults.defaultLineupMaxTableSize);
  const [ sortBy, setSortBy ] = useState(startingState.sortBy || ParamDefaults.defaultLineupSortBy);
  const [ filterStr, setFilterStr ] = useState(startingState.filter || ParamDefaults.defaultLineupFilter);

  // (slight delay when typing into the filter to make it more responsive)
  const [ timeoutId, setTimeoutId ] = useState(-1);
  const [ tmpFilterStr, setTmpFilterStr ] = useState(filterStr);

  const filterFragments =
    filterStr.split(",").map(fragment => _.trim(fragment)).filter(fragment => fragment ? true : false);
  const filterFragmentsPve =
    filterFragments.filter(fragment => fragment[0] != '-');
  const filterFragmentsNve =
    filterFragments.filter(fragment => fragment[0] == '-').map(fragment => fragment.substring(1));

  useEffect(() => { //(this ensures that the filter component is up to date with the union of these fields)
    const newState = _.chain(startingState).merge({
      // Luck
      luck: luckConfig,
      lineupLuck: adjustForLuck,
      showLineupLuckDiags: showLuckAdjDiags,
      // Misc filters
      minPoss: minPoss,
      maxTableSize: maxTableSize,
      sortBy: sortBy,
      filter: filterStr
    }).omit(_.flatten([
      _.isEqual(luckConfig, ParamDefaults.defaultLuckConfig) ? [ 'luck' ] : [],
      !adjustForLuck ? [ 'lineupLuck' ] : [],
      (showLuckAdjDiags == ParamDefaults.defaultOnOffLuckDiagMode) ? [ 'showLineupLuckDiags' ] : []
    ])).value();
    onChangeState(newState);
  }, [ minPoss, maxTableSize, sortBy, filterStr,
        luckConfig, adjustForLuck, showLuckAdjDiags ]);

  // 3] Utils

  // 3.0] Luck calculations:

  const genderYearLookup = `${startingState.gender}_${startingState.year}`;
  const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

  // The luck baseline can either be the user-selecteed baseline or the entire season
  const [ baseOrSeasonTeamStats, baseOrSeason3PMap ] = (() => {
    if (adjustForLuck) {
      switch (luckConfig.base) {
        case "baseline":
          return [
            teamStats.baseline, _.fromPairs((rosterStats.baseline || []).map((p: any) => [ p.key, p ]))
          ];
        default: //("season")
          return [
            teamStats.global, _.fromPairs((rosterStats.global || []).map((p: any) => [ p.key, p ]))
          ];
      }
    } else return [ {}, {} ]; //(not used)
  })();

  // 3.1] Build individual info

  // 3.1.1] Positional info from the season stats

  const positionFromPlayerKey = _.chain(rosterStats.global || []).map((player: any) => {
    const [ posConfs, posConfsDiags ] = PositionUtils.buildPositionConfidences(player);
    const [ pos, posDiags ] = PositionUtils.buildPosition(posConfs, player);
    return [ player.key, { posConfidences: _.values(posConfs || {}), posClass: pos } ];
  }).fromPairs().value();

  // 3.2] Table building

  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off";
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def";

  const sorter = (sortStr: string) => { // format: (asc|desc):(off_|def_|diff_)<field>
    const sortComps = sortStr.split(":"); //asc/desc
    const dir = (sortComps[0] == "desc") ? -1 : 1;
    const fieldComps = _.split(sortComps[1], "_", 1); //off/def/diff
    const fieldName = sortComps[1].substring(fieldComps[0].length + 1); //+1 for _
    const field = (lineup: any) => {
      switch(fieldComps[0]) {
        case "diff": //(off-def)
          return (lineup["off_" + fieldName]?.value || 0.0)
                - (lineup["def_" + fieldName]?.value || 0.0);
        default: return lineup[sortComps[1]]?.value; //(off or def)
      }
    };
    return (lineup: any) => {
      return dir*(field(lineup) || 0);
    };
  };

  const lineups = lineupStats?.lineups || [];
  const tableData = _.chain(lineups).filter((lineup) => {
      const minPossInt = parseInt(minPoss);
      const offPos = lineup.off_poss?.value || 0;
      const defPos = lineup.def_poss?.value || 0;
      return offPos >= minPossInt || defPos >= minPossInt; //(unclear which of || vs && is best...)
    }).filter((lineup) => {
      const namesToTest = _.chain(lineup?.players_array?.hits?.hits).flatMap((pDoc) => {
        return pDoc?._source.players.map((p: any) => p.id);
      }).value().concat([ lineup.key ]);

      const playerFilter =
        (_.isEmpty(filterFragmentsPve) ||
          _.every(filterFragmentsPve, (frag) => _.some(namesToTest, (name) => name.indexOf(frag) >= 0))
        ) &&
        (_.isEmpty(filterFragmentsNve) ||
          !_.some(filterFragmentsNve, (frag) => _.some(namesToTest, (name) => name.indexOf(frag) >= 0))
        );
      return playerFilter && (lineup.key != ""); // (workaround for #53 pending fix)

    }).sortBy(
       [ sorter(sortBy) ]
    ).take(
      parseInt(maxTableSize)
    ).flatMap((lineup) => {
      const codesAndIds = lineup.players_array?.hits?.hits?.[0]?._source?.players || [];

      const sortedCodesAndIds = PositionUtils.orderLineup(codesAndIds, positionFromPlayerKey, teamSeasonLookup);
      const perLineupPlayerMap = _.fromPairs(codesAndIds.map((cid: { code: string, id: string }) => {
        return [  cid.id, baseOrSeason3PMap[cid.id] ];
      }));

      const luckAdj = (adjustForLuck && lineup?.doc_count) ? [
        LuckUtils.calcOffTeamLuckAdj(lineup, rosterStats.baseline || [], baseOrSeasonTeamStats, perLineupPlayerMap, avgEfficiency),
        LuckUtils.calcDefTeamLuckAdj(lineup, baseOrSeasonTeamStats, avgEfficiency),
      ] as [OffLuckAdjustmentDiags, DefLuckAdjustmentDiags] : undefined;

      if (lineup?.doc_count) {
        LuckUtils.injectLuck(lineup, luckAdj?.[0], luckAdj?.[1]);
      }

      const title = sortedCodesAndIds.map((cid: { code: string, id: string}) => cid.code).join(" / ");
      const stats = { off_title: title, def_title: "", ...lineup };
      return _.flatten([
        [ GenericTableOps.buildDataRow(stats, offPrefixFn, offCellMetaFn) ],
        [ GenericTableOps.buildDataRow(stats, defPrefixFn, defCellMetaFn) ],
        showLuckAdjDiags && luckAdj ? [ GenericTableOps.buildTextRow(
          <LuckAdjDiagView
            name="lineup"
            offLuck={luckAdj[0]}
            defLuck={luckAdj[1]}
            baseline={luckConfig.base}
          />, "small pt-2"
        ) ] : [] ,
        [ GenericTableOps.buildRowSeparator() ]
      ]);
    }).value();

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
  function picker(offScale: (val: number) => string, defScale: (val: number) => string) {
    return (val: any, valMeta: string) => {
      const num = val.value as number;
      return _.isNil(num) ?
        CbbColors.malformedDataColor : //(we'll use this color to indicate malformed data)
        ("off" == valMeta) ? offScale(num) : defScale(num)
        ;
    };
  }
  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return lineupStats.lineups === undefined;
  }
  function rowSpanCalculator(cellMeta: string) {
    switch(cellMeta) {
      case "off": return 2;
      case "def": return 0;
      default: return 1;
    }
  }

  /** For use in selects */
  function stringToOption(s: string) {
    return sortOptionsByValue[s];
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
      />
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
        <Col sm="5"/>
        <Form.Group as={Col} sm="1">
          <GenericTogglingMenu>
            <GenericTogglingMenuItem
              text="Adjust for Luck"
              truthVal={adjustForLuck}
              onSelect={() => setAdjustForLuck(!adjustForLuck)}
            />
            <Dropdown.Divider />
            <GenericTogglingMenuItem
              text="Configure Luck Adjustments..."
              truthVal={false}
              onSelect={() => setShowLuckConfig(true)}
            />
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
            <Form.Control
              onChange={(ev: any) => {
                if (ev.target.value.match("^[0-9]*$") != null) {
                  setMaxTableSize(ev.target.value);
                }
              }}
              placeholder = "eg 50"
              value={maxTableSize}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="minPossessions">Min Poss #</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              onChange={(ev: any) => {
                if (ev.target.value.match("^[0-9]*$") != null) {
                  setMinPoss(ev.target.value);
                }
              }}
              placeholder = "eg 5"
              value={minPoss}
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
      <Row>
        <Col>
          <GenericTable tableCopyId="lineupStatsTable" tableFields={CommonTableDefs.lineupTable} tableData={tableData}/>
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
};

export default LineupStatsTable;
