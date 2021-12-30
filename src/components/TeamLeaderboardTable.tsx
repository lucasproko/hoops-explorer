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
import { faThumbtack } from '@fortawesome/free-solid-svg-icons'
import { faTrashRestore } from '@fortawesome/free-solid-svg-icons'
import { faArrowAltCircleDown, faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons'
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
import { CbbColors } from '../utils/CbbColors';
import chroma from 'chroma-js';

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

  const [ wabWeight, setWabWeight ] = useState(1.0);
  const [ waeWeight, setWaeWeight ] = useState(0.15);
  const [ qualityWeight, setQualityWeight ] = useState(0.3);
  const [ pinnedWabWeight, setPinnedWabWeight ] = useState(wabWeight);
  const [ pinnedWaeWeight, setPinnedWaeWeight ] = useState(waeWeight);
  const [ pinnedQualityWeight, setPinnedQualityWeight ] = useState(qualityWeight);

  const [ pinnedRankings, setPinnedRankings ] = useState({} as Record<string, number>);
  const [ currentTable, setCurrentTable ] = useState({} as Array<any>);

  const table = React.useMemo(() => {
    setLoadingOverride(false); //(rendering)

    // Calculate a commmon set of games
    const gameArray = (dataEvent.teams || []).map(t => t.opponents.length);
    const gameBasis: number = gameArray.length > 0 ? Math.floor(mean(mode(gameArray)) || 1) : 1;

    const mutableLimitState = {
      maxWab: -1000,
      minWab: 1000,
      maxWae: -1000,
      minWae: 1000,
      maxQual: -1000,
      minQual: 1000,
      maxTotal: -1000,
      minTotal: 1000
    };

    const mutableDedupSet = new Set() as Set<string>;
    const tableDataTmp = _.chain(dataEvent.teams || []).flatMap(team => {
      if (!mutableDedupSet.has(team.team_name)) {
        mutableDedupSet.add(team.team_name);

        const expWinPctVsBubble = TeamEvalUtils.calcWinsAbove(
          team.adj_off, team.adj_def, dataEvent.bubbleOffense || [], dataEvent.bubbleDefense || [], 0.0
        );
        const totalWeight = (wabWeight + waeWeight + qualityWeight) || 1;

        // Build cell entries
        const wab = _.sumBy(team.opponents, o => o.team_scored > o.oppo_scored ? o.wab : o.wab - 1);
        const wae = _.sumBy(team.opponents, o => o.team_scored > o.oppo_scored ? o.wae : o.wae - 1);
        const quality = (expWinPctVsBubble - 0.5)*gameBasis;
        const games = team.opponents.length;
        const factor = (games > 0.5*gameBasis) ?  (gameBasis/games) : 1;
        const total = ((wab*wabWeight + wae*waeWeight)*factor + quality*qualityWeight)/totalWeight;

        // Update min/max:
        if (wab > mutableLimitState.maxWab) mutableLimitState.maxWab = wab;
        if (wab < mutableLimitState.minWab) mutableLimitState.minWab = wab;
        if (wae > mutableLimitState.maxWae) mutableLimitState.maxWae = wae;
        if (wae < mutableLimitState.minWae) mutableLimitState.minWae = wae;
        if (quality > mutableLimitState.maxQual) mutableLimitState.maxQual = quality;
        if (quality < mutableLimitState.minQual) mutableLimitState.minQual = quality;
        if (total > mutableLimitState.maxTotal) mutableLimitState.maxTotal = total;
        if (total < mutableLimitState.minTotal) mutableLimitState.minTotal = total;

        // Build table entry
        const cell =  [ {
          titleStr: team.team_name,
          title: team.team_name,
          conf: <small>{ConferenceToNickname[team.conf] || "??"}</small>,
          rank: null as any,
          rankDiff: null as any,
          rankNum: 0,
          rating: { value: total },
          wab: { value: wab },
          wae: { value: wae },
          quality: { value: quality },
          games: { value: games }
        } ];
        return cell;

      } else return [];
    }).sortBy(t => (t.games.value > 0.5*gameBasis) ? -(t.rating?.value || 0) : (100 - (t.rating?.value || 0))).map((t, i) => {
      t.rank = <small><b>{i + 1}</b></small>;
      t.rankNum = i + 1;
      const pinnedRank = pinnedRankings[t.titleStr] || -1;
      if (pinnedRank > 0) {
        const delta = pinnedRank - i - 1;
        t.rankDiff = (delta != 0) ? (
          delta > 0 ? 
            (<div><FontAwesomeIcon icon={faArrowAltCircleUp} style={{color:"green"}}/> {delta}</div>) :
            (<div><FontAwesomeIcon icon={faArrowAltCircleDown} style={{color:"red"}}/> {-delta}</div>)  
          ) : ""; //TODO: fix
      }
      return t;
    }).value();

    if (_.isEmpty(pinnedRankings)) {
      setPinnedRankings(_.chain(tableDataTmp).map(t => [t.titleStr, t.rankNum]).fromPairs().value())
    }
    setCurrentTable(tableDataTmp);

    const mainTable = tableDataTmp.filter(t => (t.games.value > 0.5*gameBasis));
    const tooFewGames = tableDataTmp.filter(t => (t.games.value <= 0.5*gameBasis));

    const tableData = [ 
      GenericTableOps.buildTextRow(<i>Top 25 + 1</i>, "small text-center") 
    ].concat(_.take(mainTable, 26).map(t =>
      GenericTableOps.buildDataRow(t, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    )).concat([ 
      GenericTableOps.buildTextRow(<i>Solid NCAAT teams</i>, "small text-center") 
    ]).concat(_.take(_.drop(mainTable, 26), 9).map(t =>
      GenericTableOps.buildDataRow(t, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    )).concat([ 
      GenericTableOps.buildTextRow(<i>The Bubble</i>, "small text-center") 
    ]).concat(_.take(_.drop(mainTable, 35), 20).map(t =>
      GenericTableOps.buildDataRow(t, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    )).concat([ 
      GenericTableOps.buildTextRow(<i>Autobids / AD on Selection Committee / Maybe Next Year</i>, "small text-center") 
    ]).concat(_.drop(mainTable, 55).map(t =>
      GenericTableOps.buildDataRow(t, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    )).concat([ 
        GenericTableOps.buildTextRow(<i>Teams with too few games</i>, "small text-center") 
    ]).concat(
      tooFewGames.map(t =>
        GenericTableOps.buildDataRow(t, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
      )
    );

    //console.log(JSON.stringify(_.take(tableDataTmp, 5), null, 3));

    const wabPicker = (val: { value: number }, valMeta: string) => CbbColors.getRedToGreen().domain([mutableLimitState.minWab, 0, mutableLimitState.maxWab])(val.value).toString();
    const waePicker = (val: { value: number }, valMeta: string) => CbbColors.getRedToGreen().domain([mutableLimitState.minWae, 0, mutableLimitState.maxWae])(val.value).toString();
    const qualPicker = (val: { value: number }, valMeta: string) => CbbColors.getRedToGreen().domain([mutableLimitState.minQual, 0, mutableLimitState.maxQual])(val.value).toString();
    const totalPicker = (val: { value: number }, valMeta: string) => CbbColors.getRedToGreen().domain([mutableLimitState.minTotal, 0, mutableLimitState.maxTotal])(val.value).toString();

    const teamLeaderboard = {
      "title": GenericTableOps.addTitle("", "", CommonTableDefs.rowSpanCalculator, "small", GenericTableOps.htmlFormatter),
      "conf": GenericTableOps.addDataCol("Conf", "The team's conference", GenericTableOps.defaultColorPicker, GenericTableOps.htmlFormatter),
      "rankDiff": GenericTableOps.addDataCol(<b>&Delta;</b>, "The difference vs pinned rank", GenericTableOps.defaultColorPicker, GenericTableOps.htmlFormatter),
      "sep0": GenericTableOps.addColSeparator(),
      "rank": GenericTableOps.addDataCol("Rank", "The overall team ranking", GenericTableOps.defaultColorPicker, GenericTableOps.htmlFormatter),
      "rating": GenericTableOps.addPtsCol("Rating", `The weighted sum of all the different ranking metrics (adjusted as if each team had played the same number of games, [${gameBasis}])`, totalPicker),
      "sep1": GenericTableOps.addColSeparator(),
      "wab": GenericTableOps.addPtsCol("WAB", "Wins Above Bubble (the number of wins more than an average bubble team is expected against this schedule)", wabPicker),
      "sep2": GenericTableOps.addColSeparator(),
      "wae": GenericTableOps.addPtsCol("WAE", "Wins Above Elite (the number of wins more than an average elite team is expected against this schedule)", waePicker),
      "sep3": GenericTableOps.addColSeparator(),
      "quality": GenericTableOps.addPtsCol("Quality", "The efficiency ('eye test') of a team, measured as expected W-L difference against a schedule of bubble teams", qualPicker),
      "sep4": GenericTableOps.addColSeparator(),
      "games": GenericTableOps.addIntCol("Games", "Number of games played", GenericTableOps.defaultColorPicker),
    };
  
    return <GenericTable
      tableCopyId="teamLeaderboardTable"
      tableFields={teamLeaderboard}
      tableData={tableData}
      cellTooltipMode="missing"
    />
  }, [ confs, dataEvent, wabWeight, waeWeight, qualityWeight, pinnedWabWeight, pinnedWaeWeight, pinnedQualityWeight ]);

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
      <Tooltip id="copyLinkTooltip">Copies URL to clipboard</Tooltip>
    );
    return <OverlayTrigger placement="auto" overlay={tooltip}>
      <Button className="float-left" id={`copyLink_teamLeaderboard`} variant="outline-secondary" size="sm">
        <FontAwesomeIcon icon={faLink} />
      </Button>
    </OverlayTrigger>;
  };

  const onPinWeights = (ev: any) => {
    setPinnedWabWeight(wabWeight);
    setPinnedWaeWeight(waeWeight);
    setPinnedQualityWeight(qualityWeight);
    setPinnedRankings(_.chain(currentTable).map(t => [t.titleStr as string, t.rankNum as number]).fromPairs().value());
  };

  /** Copy to clipboard button */
  const getPinButton = () => {
    const toPct = (s: number) => (s*100).toFixed(0) + "%";
    const tooltip = (
      <Tooltip id="pinTooltip">Pins rankings for selected weightings<br/>(current: WAB=[{toPct(pinnedWabWeight)}] WAE=[{toPct(pinnedWaeWeight)}] Quality=[{toPct(pinnedQualityWeight)}])</Tooltip>
    );
    return <OverlayTrigger placement="auto" overlay={tooltip}>
      <Button onClick={onPinWeights} className="float-left" id={`pinWeights_teamLeaderboard`} variant="outline-secondary" size="sm">
        <FontAwesomeIcon icon={faThumbtack} />
      </Button>
    </OverlayTrigger>;
  };

  const onRestoreToDefault = (ev: any) => {
    setWabWeight(1.0);
    setWaeWeight(0.15);
    setQualityWeight(0.3);
    setPinnedWabWeight(1.0);
    setPinnedWaeWeight(0.15);
    setPinnedQualityWeight(0.3);
    setPinnedRankings({});
  }

  const getRestoreToDefault = () => {
    const tooltip = (
      <Tooltip id="pinRestoreToDefault">Return to default weights and re-pin</Tooltip>
    );
    return <OverlayTrigger placement="auto" overlay={tooltip}>
      <Button onClick={onRestoreToDefault} className="float-left" id={`restoreToDefaults_teamLeaderboard`} variant="outline-secondary" size="sm">
        <FontAwesomeIcon icon={faTrashRestore} />
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
      { label: `All Teams` } :
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
        <Col xs={6} sm={6} md={3} lg={2} style={{zIndex: 10}}>
          <Select
            value={stringToOption(gender)}
            options={["Men", "Women"].map(
              (gender) => stringToOption(gender)
            )}
            isSearchable={false}
            onChange={(option) => { if ((option as any)?.value) setGender((option as any).value) }}
          />
        </Col>
        <Col xs={6} sm={6} md={3} lg={2} style={{zIndex: 10}}>
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
        <Col xs={12} sm={12} md={6} lg={6} style={{zIndex: 10}}>
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
        <Col lg={1} className="mt-1">
          {getCopyLinkButton()}
        </Col>
      </Form.Group>
      <Row className="mt-2 sticky-top" style={{backgroundColor: "white", opacity: "85%", zIndex: 1}}>
        <Col xs={11}>
        <Row>
        <Col xs={4}>
          <Form>
            <Form.Group controlId="formBasicRange">
              <Form.Label><small>How much you weight W-L record [<b>{(wabWeight*100).toFixed(0)}</b>%]</small></Form.Label>
              <Form.Control type="range" custom 
                value={wabWeight}
                onChange={(changeEvent: any) => {
                  const newVal = parseFloat(changeEvent.target.value);
                  setWabWeight(newVal);
                }}
                onMouseDown={(ev:any) => console.log("down?")}
                onMouseUp={(ev:any) => console.log("up?")}
                min={0}
                max={1}
                step={0.05}
              />
            </Form.Group>
          </Form>          
        </Col>
        <Col xs={4}>
          <Form>
            <Form.Group controlId="formBasicRange">
              <Form.Label><small>... W-L but compared to elite teams [<b>{(waeWeight*100).toFixed(0)}</b>%]</small></Form.Label>
              <Form.Control type="range" custom 
                value={waeWeight}
                onChange={(changeEvent: any) => {
                  const newVal = parseFloat(changeEvent.target.value);
                  setWaeWeight(newVal);
                }}
                min={0}
                max={1}
                step={0.05}
              />
            </Form.Group>
          </Form>          
        </Col>
        <Col xs={4}>
          <Form>
            <Form.Group controlId="formBasicRange">
              <Form.Label><small>How much you weight a team's efficiency [<b>{(qualityWeight*100).toFixed(0)}</b>%]</small></Form.Label>
              <Form.Control type="range" custom 
                value={qualityWeight}
                onChange={(changeEvent: any) => {
                  const newVal = parseFloat(changeEvent.target.value);
                  setQualityWeight(newVal);
                }}
                min={0}
                max={1}
                step={0.05}
              />
            </Form.Group>
          </Form>          
        </Col>
        </Row>
        </Col>
        <Col xs={1} className="mt-4">
          {getPinButton()}
          {getRestoreToDefault()}
        </Col>
      </Row>
      <Row className="mt-2" style={{zIndex: 0 }}>
        <Col style={{ paddingLeft: "5px", paddingRight: "5px", zIndex: 0 }}>
          {table}
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
};
export default TeamLeaderboardTable;
