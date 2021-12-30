// React imports:
import React, { useState, useEffect } from 'react';

// Lodash:
import _ from "lodash";

// mathjs
// @ts-ignore
import { mean, mode } from 'mathjs';

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

// Util imports
import { UrlRouting } from "../utils/UrlRouting";
import { CommonTableDefs } from "../utils/tables/CommonTableDefs";
import { TeamLeaderboardParams, ParamDefaults } from '../utils/FilterModels';
import { ConferenceToNickname, NicknameToConference, Power6Conferences } from '../utils/public-data/ConferenceInfo';
import { TeamInfo } from '../utils/StatModels';

import { RosterTableUtils } from '../utils/tables/RosterTableUtils';
import { TeamEvalUtils } from '../utils/stats/TeamEvalUtils';
import { cpuUsage } from 'process';

export type TeamLeaderboardStatsModel = {
  teams?: Array<TeamInfo>,
  confs?: Array<string>,
  confMap?: Map<string, Array<string>>,
  bubbleOffense?: Array<number>,
  bubbleDefense?: Array<number>,
  lastUpdated?: number,
  error?: string
};
type Props = {
  startingState: TeamLeaderboardParams,
  dataEvent: TeamLeaderboardStatsModel,
  onChangeState: (newParams: TeamLeaderboardParams) => void
};

// Some static methods

// View

const TeamLeaderboardTable: React.FunctionComponent<Props> = ({ startingState, dataEvent, onChangeState }) => {
  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  /** Only show help for diagnstic on/off on main page */
  const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");

  // 1] Data Model

  const [clipboard, setClipboard] = useState(null as null | ClipboardJS);

  // 2] State

  // Data source
  const [confs, setConfs] = useState(startingState.conf || "");
  const [year, setYear] = useState(startingState.year || "2020/21"); //TODO remove once year sorted out
  const [gender, setGender] = useState(startingState.gender || ParamDefaults.defaultGender);
  const isMultiYr = (year == "Extra") || (year == "All");

  const [tier, setTier] = useState(startingState.tier || "All");

  /** Set this to be true on expensive operations */
  const [loadingOverride, setLoadingOverride] = useState(false);

  const [ wabWeight, setWabWeight ] = useState(0.8);
  const [ waeWeight, setWaeWeight ] = useState(0.1);
  const [ qualityWeight, setQualityWeight ] = useState(0.2);

  const table = React.useMemo(() => {
    setLoadingOverride(false); //(rendering)

    // Calculate a commmon set of games
    const gameArray = (dataEvent.teams || []).map(t => t.opponents.length);
    const gameBasis: number = gameArray.length > 0 ? (mean(mode(gameArray)) || 1) : 1;

    const mutableDedupSet = new Set() as Set<string>;
    const tableDataTmp = _.chain(dataEvent.teams || []).flatMap(team => {
      if (!mutableDedupSet.has(team.team_name)) {
        mutableDedupSet.add(team.team_name);

        const expWinPctVsBubble = TeamEvalUtils.calcWinsAbove(
          team.adj_off, team.adj_def, dataEvent.bubbleOffense || [], dataEvent.bubbleDefense || [], 0.0
        );
        const totalWeight = (wabWeight + waeWeight + qualityWeight) || 1;

        const wab = _.sumBy(team.opponents, o => o.team_scored > o.oppo_scored ? o.wab : o.wab - 1);
        const wae = _.sumBy(team.opponents, o => o.team_scored > o.oppo_scored ? o.wae : o.wae - 1);
        const quality = (expWinPctVsBubble - 0.5)*gameBasis;
        const games = team.opponents.length;
        const factor = (games > 0.5*gameBasis) ?  (gameBasis/games) : 1;
        const total = ((wab*wabWeight + wae*waeWeight)*factor + quality*qualityWeight)/totalWeight;
        return [ {
          title: <div><b>{team.team_name}</b></div>,
          conf: <small>{ConferenceToNickname[team.conf] || "??"}</small>,
          wab: { value: wab },
          wae: { value: wae },
          quality: { value: quality },
          rating: { value: total },
          rank: { value: 0 },
          games: { value: games }
        } ];
      } else return [];
    }).sortBy(t => (t.games.value > 0.5*gameBasis) ? -(t.rating?.value || 0) : (100 - (t.rating?.value || 0))).map((t, i) => {
      t.rank = { value: i + 1 };
      return t;
    }).value();

    const mainTable = tableDataTmp.filter(t => (t.games.value > 0.5*gameBasis));
    const tooFewGames = tableDataTmp.filter(t => (t.games.value <= 0.5*gameBasis));

    const tableData = [ 
      GenericTableOps.buildTextRow(<div>Top 25 + 1</div>, "small text-center") 
    ].concat(_.take(mainTable, 26).map(t =>
      GenericTableOps.buildDataRow(t, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    )).concat([ 
      GenericTableOps.buildTextRow(<div>Solid NCAAT teams</div>, "small text-center") 
    ]).concat(_.take(_.drop(mainTable, 26), 9).map(t =>
      GenericTableOps.buildDataRow(t, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    )).concat([ 
      GenericTableOps.buildTextRow(<div>The Bubble</div>, "small text-center") 
    ]).concat(_.take(_.drop(mainTable, 35), 20).map(t =>
      GenericTableOps.buildDataRow(t, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    )).concat([ 
      GenericTableOps.buildTextRow(<div>Autobids / Maybe Next Year</div>, "small text-center") 
    ]).concat(_.drop(mainTable, 55).map(t =>
      GenericTableOps.buildDataRow(t, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    )).concat([ 
        GenericTableOps.buildTextRow(<div>Teams with too few games</div>, "small text-center") 
    ]).concat(
      tooFewGames.map(t =>
        GenericTableOps.buildDataRow(t, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
      )
    );

    //console.log(JSON.stringify(_.take(tableDataTmp, 5), null, 3));

    return <GenericTable
      tableCopyId="teamLeaderboardTable"
      tableFields={CommonTableDefs.teamLeaderboard}
      tableData={tableData}
      cellTooltipMode="none"
    />
  }, [ confs, dataEvent ]);

  // 3] Utils
  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return !dataEvent.error && (loadingOverride || ((dataEvent?.teams || []).length == 0));
  }

  function stringToOption(s: string) {
    return { label: s, value: s };
  }

  // 4] View

  /** Copy to clipboard button */
  const getCopyLinkButton = () => {
    const tooltip = (
      <Tooltip id="copyLinkTooltip">Copies URL to clipboard)</Tooltip>
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
        text: function (trigger) {
          return window.location.href;
        }
      });
      newClipboard.on('success', (event: ClipboardJS.Event) => {
        //(unlike other tables, don't add to history)
        // Clear the selection in some visually pleasing way
        setTimeout(function () {
          event.clearSelection();
        }, 150);
      });
      setClipboard(newClipboard);
    }
  }

  // Conference filter

  function getCurrentConfsOrPlaceholder() {
    return (confs == "") ?
      { label: `All Teams in ${tier} Tier${tier == "All" ? "s" : ""}` } :
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
        children: [ConferenceToNickname[fullConfname] || fullConfname]
      }
    }
    const newProps = {
      ...props,
      children: [newText, props.children[1]]
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
      text={"Loading Team Leaderboard..."}
    >
      <Form.Group as={Row}>
        <Col xs={6} sm={6} md={3} lg={2}>
          <Select
            value={stringToOption(gender)}
            options={["Men", "Women"].map(
              (gender) => stringToOption(gender)
            )}
            isSearchable={false}
            onChange={(option) => { if ((option as any)?.value) setGender((option as any).value) }}
          />
        </Col>
        <Col xs={6} sm={6} md={3} lg={2}>
          <Select
            value={stringToOption(year)}
            options={
              (
                ["2020/21"]
              ).concat(tier == "High" ? ["Extra"] : []).map(
                (r) => stringToOption(r)
              )}
            isSearchable={false}
            onChange={(option) => { if ((option as any)?.value) setYear((option as any).value) }}
          />
        </Col>
        <Col className="w-100" bsPrefix="d-lg-none d-md-none" />
        <Col xs={12} sm={12} md={6} lg={6}>
          <Select
            isClearable={true}
            styles={{ menu: base => ({ ...base, zIndex: 1000 }) }}
            isMulti
            components={{ MultiValueContainer: ConferenceValueContainer }}
            value={getCurrentConfsOrPlaceholder()}
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
      <Row className="mt-2">
        <Col style={{ paddingLeft: "5px", paddingRight: "5px" }}>
          {table}
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
};
export default TeamLeaderboardTable;
