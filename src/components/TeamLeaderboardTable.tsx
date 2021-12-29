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

// Util imports
import { UrlRouting } from "../utils/UrlRouting";
import { CommonTableDefs } from "../utils/tables/CommonTableDefs";
import { TeamLeaderboardParams, ParamDefaults } from '../utils/FilterModels';
import { ConferenceToNickname, NicknameToConference, Power6Conferences } from '../utils/public-data/ConferenceInfo';
import { TeamInfo } from '../utils/StatModels';

import { RosterTableUtils } from '../utils/tables/RosterTableUtils';

export type TeamLeaderboardStatsModel = {
  teams?: Array<TeamInfo>,
  confs?: Array<string>,
  confMap?: Map<string, Array<string>>,
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

  const table = React.useMemo(() => {
    setLoadingOverride(false); //(rendering)

    const tableDataTmp = _.chain(dataEvent.teams || []).map(team => {
      const wab = _.sumBy(team.opponents, o => o.wab);
      const wae = _.sumBy(team.opponents, o => o.wae);
      const total = wab + wae;
      return {
        title: team.team_name,
        wab: { value: wab },
        wae: { value: wae },
        rank: { value: total },
        rating: 0,
      };
    }).sortBy(t => -(t.rank?.value || 0)).map((t, i) => {
      t.rating = { value: i + 1 };
      return t;
    }).value();

    const tableData = tableDataTmp.map(t =>
      GenericTableOps.buildDataRow(t, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
    );

/**/console.log(JSON.stringify(_.take(tableDataTmp, 5), null, 3));

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
