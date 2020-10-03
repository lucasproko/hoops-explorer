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
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable";
import { RosterStatsModel } from './RosterStatsTable';
import { TeamStatsModel } from './TeamStatsTable';
import LuckConfigModal from './shared/LuckConfigModal';
import GenericTogglingMenu from './shared/GenericTogglingMenu';
import GenericTogglingMenuItem from './shared/GenericTogglingMenuItem';
import ToggleButtonGroup from "./shared/ToggleButtonGroup";
import LuckAdjDiagView from './diags/LuckAdjDiagView';

// Table building
import { TableDisplayUtils } from "../utils/tables/TableDisplayUtils";
import { LineupTableUtils } from "../utils/tables/LineupTableUtils";

// Util imports
import { UrlRouting } from "../utils/UrlRouting";
import { LineupUtils } from "../utils/stats/LineupUtils";
import { CbbColors } from "../utils/CbbColors";
import { CommonTableDefs } from "../utils/CommonTableDefs";
import { PositionUtils } from "../utils/stats/PositionUtils";
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { LineupLeaderboardParams, ParamDefaults, LuckParams } from '../utils/FilterModels';
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import { ConferenceToNickname, NicknameToConference, Power6Conferences } from '../utils/public-data/ConferenceInfo';

import ReactDOMServer from 'react-dom/server'

export type LineupStatsModel = {
  lineups?: Array<any>,
  confs?: Array<string>,
  error_code?: string
}
type Props = {
  startingState: LineupLeaderboardParams,
  dataEvent: LineupStatsModel,
  onChangeState: (newParams: LineupLeaderboardParams) => void
}

const LineupLeaderboardTable: React.FunctionComponent<Props> = ({startingState, dataEvent, onChangeState}) => {

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  /** Only show help for diagnstic on/off on main page */
  const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");

  // 1] Data Model

  // 2] State

  // Data source
  const [ confs, setConfs ] = useState(startingState.confs || "");
  const [ year, setYear ] = useState(startingState.year || ParamDefaults.defaultYear);
  const [ gender, setGender ] = useState(startingState.gender || ParamDefaults.defaultGender);

  // Misc display

  const [ minPoss, setMinPoss ] = useState(startingState.minPoss || ParamDefaults.defaultLineupLboardMinPos);
  const [ maxTableSize, setMaxTableSize ] = useState(startingState.maxTableSize || ParamDefaults.defaultLineupLboardMaxTableSize);
  const [ sortBy, setSortBy ] = useState(startingState.sortBy || ParamDefaults.defaultLineupLboardSortBy);
  const [ filterStr, setFilterStr ] = useState(startingState.filter || ParamDefaults.defaultLineupLboardFilter);

  const [ isT100, setIsT100 ] = useState(startingState.t100 || false);
  const [ isConfOnly, setIsConfOnly ] = useState(startingState.confOnly || false);

  // Luck:

  /** Whether to show the luck diagnostics */
  const [ showLuckAdjDiags, setShowLuckAdjDiags ] = useState(_.isNil(startingState.showLineupLuckDiags) ?
    ParamDefaults.defaultLineupLboardLuckDiagMode : startingState.showLineupLuckDiags
  );

  // (slight delay when typing into the filter to make it more responsive)
  var timeoutId = -1;

  useEffect(() => { //(this ensures that the filter component is up to date with the union of these fields)
    const newState = {
      ...startingState,
      conf: confs, gender: gender, year: year,
      t100: isT100, confOnly: isConfOnly,
      // Luck
      showLineupLuckDiags: showLuckAdjDiags,
      // Misc filters
      minPoss: minPoss,
      maxTableSize: maxTableSize,
      sortBy: sortBy,
      filter: filterStr
    };
    onChangeState(newState);
  }, [ minPoss, maxTableSize, sortBy, filterStr,
      showLuckAdjDiags,
      isT100, isConfOnly,
      confs, year, gender ]);

  // 3] Utils

  // 3.0] Luck calculations:

  const genderYearLookup = `${startingState.gender}_${startingState.year}`;
  const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

  // 3.1] Build individual info

  // 3.2] Table building

  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off";
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def";

  const confSet = confs ? new Set(
    _.flatMap((confs || "").split(","), c => c == "P6" ? Power6Conferences : [ NicknameToConference[c] || c ])
  ) : undefined;
  const lineups = LineupTableUtils.buildFilteredLineups(
    (dataEvent?.lineups || []).filter(lineup => {
      return !confSet || confSet.has(lineup.conf || "Unknown");
    }),
    filterStr,
    (sortBy == ParamDefaults.defaultLineupLboardSortBy) ? undefined : sortBy,
    minPoss, maxTableSize, undefined, undefined //<-calc from lineup
  );

  const tableData = lineups.flatMap((lineup, lineupIndex) => {
    TableDisplayUtils.injectPlayTypeInfo(lineup, false, false); //(inject assist numbers)

    const teamSeasonLookup = `${startingState.gender}_${lineup.team}_${startingState.year}`;

    const perLineupBaselinePlayerMap = lineup.player_info;
    const positionFromPlayerKey = lineup.player_info;
    const codesAndIds = _.toPairs(lineup.player_info).map(kv => { return { code: kv[1].code, id: kv[0] } });
    const sortedCodesAndIds = PositionUtils.orderLineup(codesAndIds, positionFromPlayerKey, teamSeasonLookup);

    const lineupTitleKey = "" + lineupIndex;
    const subTitle = sortedCodesAndIds ?
      TableDisplayUtils.buildDecoratedLineup(
        lineupTitleKey, sortedCodesAndIds, perLineupBaselinePlayerMap, positionFromPlayerKey, "off_adj_rtg", true
      ) : "Weighted Total";

    const rankings = <span><b>#{lineup.adj_margin_rank}</b> <small>(#{lineup.off_adj_ppp_rank} / #{lineup.def_adj_ppp_rank})</small></span>;

    const confNickname = ConferenceToNickname[lineup.conf] || "???";

    const teamTooltip = (
      <Tooltip id={`team_${lineupIndex}`}>Open new tab with all lineups for this team</Tooltip>
    );
    const teamParams = {
      team: lineup.team, gender: gender, year: year,
      minRank: 0, maxRank: isT100 ? 100 : 400,
      queryFilters: isConfOnly ? "Conf" : undefined,
      lineupLuck: true
    };
    const teamEl = <OverlayTrigger placement="auto" overlay={teamTooltip}>
      <a target="_new" href={UrlRouting.getLineupUrl(teamParams, {})}><b>{lineup.team}</b></a>
    </OverlayTrigger>;

    const title = <div><span className="float-left">
      {rankings}
      &nbsp;<span>{teamEl} (<span>{confNickname}</span>)</span>
      </span><br/>
      {subTitle}
    </div>

    const stats = { off_title: title, def_title: "", ...lineup };

    return _.flatten([
      [ GenericTableOps.buildDataRow(stats, offPrefixFn, offCellMetaFn) ],
      [ GenericTableOps.buildDataRow(stats, defPrefixFn, defCellMetaFn) ],
      showLuckAdjDiags && lineup.off_luck_diags ? [ GenericTableOps.buildTextRow(
        <LuckAdjDiagView
          name="lineup"
          offLuck={lineup.off_luck_diags}
          defLuck={lineup.def_luck_diags}
          baseline={"season"}
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
    "desc:diff_adj_ppp",
    "desc:off_adj_ppp",
    "asc:def_adj_ppp",
    "desc:off_poss",
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
    return (dataEvent?.lineups || []).length == 0;
  }

  /** For use in selects */
  function sortStringToOption(s: string) {
    return sortOptionsByValue[s];
  }
  function stringToOption(s: string) {
    return { label: s, value: s};
  }

  /** Handling filter change (/key presses to fix the select/delete on page load) */
  const onFilterChange = (ev: any) => {
    const toSet = ev.target.value;
    if (timeoutId != -1) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = (window.setTimeout(() => {
      setFilterStr(toSet);
    }, 500));
  };

  // 4] View

  /** Copy to clipboard button */
  const getCopyLinkButton = () => {
    const tooltip = (
      <Tooltip id="copyLinkTooltip">Copies URL to clipboard)</Tooltip>
    );
    return  <OverlayTrigger placement="auto" overlay={tooltip}>
        <Button className="float-left" id={`copyLink_lineupLeaderboard`} variant="outline-secondary" size="sm">
          <FontAwesomeIcon icon={faLink} />
        </Button>
      </OverlayTrigger>;
  };

  function getCurrentConfsOrPlaceholder() {
    return (confs == "") ?
      { label: 'All Available Conferences' } :
      confs.split(",").map(conf => stringToOption(NicknameToConference[conf] || conf));
  }

  /** Slightly hacky code to render the conference nick names */
  const ConferenceValueContainer = props => {
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

  return <Container>
    <LoadingOverlay
      active={needToLoadQuery()}
      spinner
      text={"Loading Lineup Leaderboard..."}
    >
    <Form.Group as={Row}>
      <Col xs={6} sm={6} md={3} lg={2}>
        <Select
          value={ stringToOption(gender) }
          options={[ "Men" ].map(
            (gender) => stringToOption(gender)
          )}
          isSearchable={false}
          onChange={(option) => { if ((option as any)?.value) setGender((option as any).value) }}
        />
      </Col>
      <Col xs={6} sm={6} md={3} lg={2}>
        <Select
          value={ stringToOption(year) }
          options={[ "2018/9", "2019/20" ].map( /*TODO: also add 2018/9*/
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
          options={["Power 6 Conferences"].concat(dataEvent?.confs || []).map(
            (r) => stringToOption(r)
          )}
          onChange={(options) => {
            const selection = (options ||  []).map(option => (option as any)?.value || "");
            const confStr = selection.filter(t => t != "").map(c => ConferenceToNickname[c] || c).join(",")
            setConfs(confStr);
          }}
        />
      </Col>
      <Col>
        {getCopyLinkButton()}
      </Col>
    </Form.Group>
      <Form.Row>
        <Form.Group as={Col} sm="8">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="filter">Filter</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              onKeyUp={onFilterChange}
              onChange={onFilterChange}
              placeholder = "eg TeamA;-TeamB;Player1Code;Player2FirstName;-Player3Surname"
            />
          </InputGroup>
        </Form.Group>
        <Col sm="3"/>
        <Form.Group as={Col} sm="1">
          <GenericTogglingMenu>
            <GenericTogglingMenuItem
              text={<i class="text-secondary">Adjust for Luck</i>}
              truthVal={true}
              onSelect={() => {}}
              helpLink={showHelp ? "https://hoop-explorer.blogspot.com/2020/07/luck-adjustment-details.html" : undefined}
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
            <Form.Control
              onChange={(ev: any) => {
                if (ev.target.value.match("^[0-9]*$") != null) {
                  setMaxTableSize(ev.target.value);
                }
              }}
              value={maxTableSize}
              placeholder = "eg 100"
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
              placeholder = "eg 20"
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
              value={ sortStringToOption(sortBy) }
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
              label: "Luck",
              tooltip: "Statistics always adjusted for luck",
              toggled: true,
              onClick: () => {}
            },
            {
              label: "T100",
              tooltip: "Leaderboard of lineups vs T100 opposition",
              toggled: isT100,
              onClick: () => {
                setIsT100(!isT100); setIsConfOnly(false);
              }
            },
            {
              label: "Conf",
              tooltip: "Leaderboard of lineups vs conference opposition",
              toggled: isConfOnly,
              onClick: () => {
                setIsT100(false); setIsConfOnly(!isConfOnly);
              }
            }
          ].concat(showHelp ? [
            {
              label: <a href="https://hoop-explorer.blogspot.com/2020/07/understanding-lineup-analyzer-page.html" target="_new">?</a>,
              tooltip: "Open a page that explains some of the elements of this table",
              toggled: false,
              onClick: () => {}
            }
          ] : [])
          }/>
        </Col>
      </Form.Row>
      <Row className="mt-2">
        <Col style={{paddingLeft: "5px", paddingRight: "5px"}}>
          <GenericTable
            tableCopyId="lineupLeaderboardTable"
            tableFields={CommonTableDefs.lineupTable}
            tableData={tableData}
            cellTooltipMode="none"
          />
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
};

export default LineupLeaderboardTable;
