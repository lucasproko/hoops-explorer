// React imports:
import React, { useState, useEffect } from 'react';

// Next imports:
import { NextPage } from 'next';
import Router from 'next/router'

// Lodash
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import InputGroup from 'react-bootstrap/InputGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Dropdown from 'react-bootstrap/Dropdown';
import Tooltip from 'react-bootstrap/Tooltip';

// Additional components:
import Select, { components} from "react-select"
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { faHistory } from '@fortawesome/free-solid-svg-icons'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import ClipboardJS from 'clipboard';
// @ts-ignore
import { Shake } from 'reshake'
// @ts-ignore
import ls from 'local-storage';

// Component imports:
import { TeamStatsModel } from '../components/TeamStatsTable';
import { RosterCompareModel } from '../components/RosterCompareTable';
import HistorySelector, { historySelectContainerWidth } from './shared/HistorySelector';
import AutoSuggestText, { notFromAutoSuggest } from './shared/AutoSuggestText';
import GenericTogglingMenuItem from "./shared/GenericTogglingMenuItem";

// Utils:
import { dataLastUpdated } from '../utils/internal-data/dataLastUpdated';
import { PreloadedDataSamples, preloadedData } from '../utils/internal-data/preloadedData';
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import { ClientRequestCache } from '../utils/ClientRequestCache';
import { RequestUtils } from '../utils/RequestUtils';
import { FilterParamsType, FilterRequestInfo, ParamPrefixes, ParamPrefixesType, ParamDefaults, CommonFilterParams, RequiredTeamReportFilterParams } from '../utils/FilterModels';
import { HistoryManager } from '../utils/HistoryManager';
import { UrlRouting } from '../utils/UrlRouting';
import { CommonFilterType, QueryUtils } from '../utils/QueryUtils';

// Library imports:
import fetch from 'isomorphic-unfetch';

interface Props<PARAMS> {
  startingState: PARAMS;
  onChangeState: (newParams: PARAMS) => void;
  onChangeCommonState: (newCommonParams: CommonFilterParams) => void;
  tablePrefix: ParamPrefixesType,
  buildParamsFromState: (includeFilterParams: Boolean) => [ PARAMS, FilterRequestInfo[] ];
  childHandleResponse: (json: any, wasError: Boolean) => void;
  majorParamsDisabled?: boolean; //(not currently used but would allow you to block changing team/seeason/gender)
  forceReload1Up?: number; //force submits a new set of parameters if true
}

/** Used to pass the submitListener to child components */
export const GlobalKeypressManager = React.createContext((ev: any) => {});

/** Type workaround per https://stackoverflow.com/questions/51459971/type-of-generic-stateless-component-react-or-extending-generic-function-interfa */
type CommonFilterI<PARAMS = any> = React.FunctionComponent<Props<PARAMS>>

const CommonFilter: CommonFilterI = ({
    children,
    startingState, onChangeState, onChangeCommonState,
    tablePrefix, buildParamsFromState, childHandleResponse,
    majorParamsDisabled,
    forceReload1Up
}) => {
  //console.log("Loading CommonFilter " + JSON.stringify(startingState));

  // Data model

  // Ugly internals
  const [ queryIsLoading, setQueryIsLoading ] = useState(false);
  const [ atLeastOneQueryMade, setAtLeastOneQueryMade ] = useState(false);
  const [ pageJustLoaded, setPageJustLoaded ] = useState(true);
  const [ currForceReload1Up, setCurrForceload1up ] = useState(0);
  const [ currState, setCurrState ] = useState(startingState);

  const [ clipboard, setClipboard] = useState(null as null | ClipboardJS);

  // Data source
  const [ team, setTeam ] = useState(startingState.team || ParamDefaults.defaultTeam);
  const [ year, setYear ] = useState(startingState.year || ParamDefaults.defaultYear);
  const [ gender, setGender ] = useState(startingState.gender || ParamDefaults.defaultGender);
  /** Pre-calculate this */
  const teamList = AvailableTeams.getTeams(null, year, gender);

  // Generic filters:

  const [ minRankFilter, setMinRankFilter ] = useState(startingState.minRank || ParamDefaults.defaultMinRank);
  const [ maxRankFilter, setMaxRankFilter ] = useState(startingState.maxRank || ParamDefaults.defaultMaxRank);
  const [ baseQuery, setBaseQuery ] = useState(startingState.baseQuery || "")

  const [ garbageTimeFiltered, setGarbageTimeFiltered ] = useState(
    _.isNil(startingState.filterGarbage) ? ParamDefaults.defaultFilterGarbage : startingState.filterGarbage
  );

  const [ queryFilters, setQueryFilters ] = useState(
    QueryUtils.parseFilter(
      _.isNil(startingState.queryFilters) ? ParamDefaults.defaultQueryFilters : startingState.queryFilters
    )
  );

  // Automatically update child state when any current param is changed:
  // (Note this doesn't trigger a change to the URL unless submit is pressed)
  useEffect(() => {
    onChangeCommonState({
      team: team, year: year, gender: gender, minRank: minRankFilter, maxRank: maxRankFilter,
      baseQuery: baseQuery, filterGarbage: garbageTimeFiltered,
      queryFilters: _.join(queryFilters || [], ",")
    });
  }, [ team, year, gender, minRankFilter, maxRankFilter, baseQuery, garbageTimeFiltered, queryFilters ]);

  const [ submitDisabled, setSubmitDisabled ] = useState(false); // (always start as true on page load)
  const [ reportIsDisabled, setReportIsDisabled ] = useState(false); //(same as above)

  const isDebug = (process.env.NODE_ENV !== 'production');

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  // Utils

  const genderYear = `${gender}_${year}`;
  const currentJsonEpoch = dataLastUpdated[genderYear] || -1;

  /** Keyboard listener - handles global page overrides while supporting individual components */
  const submitListenerFactory = (inAutoSuggest: boolean) => (event: any) => {
    const allowKeypress = () => {
      //(if this logic is run inside AutoSuggestText, we've already processed the special cases so carry on)
      return inAutoSuggest || notFromAutoSuggest(event);
    };
    if (event.code === "Enter" || event.code === "NumpadEnter" || event.keyCode == 13 || event.keyCode == 14) {
      if (!submitDisabled && allowKeypress()) {
        onSubmit();
      }
    } else if (event.code == "Escape" || event.keyCode == 27) {
      if (!submitDisabled && allowKeypress()) {
        document.body.click(); //closes any overlays (like history) that have rootClick
      }
    }
  };

  /** Used with LS to determine if user is active */
  const sessionActiveKey = "session-activity";

  /** Was the session active recently enough that we'll auto-load? */
  const isSessionActive = () => {
    const thresholdMs = 24*3600*1000; //(1 day)
    const lastActive = parseInt((ls as any).get(sessionActiveKey));
    const now = new Date().getTime();
    return (now - lastActive) < thresholdMs; //4hrs
  }
  /** Update session activity */
  const registerSessionActivity = (sessionActive: boolean) => {
    if (!sessionActive) {
      console.log("Set browser session active, will auto-retrieve non-cached requests");
    }
    (ls as any).set(sessionActiveKey, "" + new Date().getTime());
  }

  /** Handles data loading logic either when loading a page (onLoad==true) or pressing submit (onLoad==false) */
  const requestHandlingLogic = (onLoadIn: boolean) => {
    if (onLoadIn && shouldSubmitBeDisabled()) {
      return; //page load when no team/gender/season is selected
    }
    const sessionActive = isSessionActive();
    const onLoad = onLoadIn && !sessionActive; //(ie always false if session active)
    if (!onLoadIn) registerSessionActivity(sessionActive); //(pressed button => session active)
    if (onLoadIn && !onLoad) { // (user visited page but we're going to load it anyway)
      setQueryIsLoading(true);
    }

    const fetchUrl = (url: string, force: boolean) => {
      return !onLoad || force ? //(if onLoad - JSON cache, or wait for user to hit submit)
        fetch(url).then((response: fetch.IsomorphicResponse) => {
          return response.json().then((json: any) => [json, response.ok, response]);
        }) :
        Promise.reject(new Error('Needed request, currently forcing user to press submit'));
    };
    const [ primaryRequest, otherRequests ] = buildParamsFromState(false);
    const allPromises = Promise.all(
      RequestUtils.requestHandlingLogic(
        primaryRequest, tablePrefix, otherRequests,
        fetchUrl,
        currentJsonEpoch, isDebug
      )
    );
    allPromises.then((jsons: any[]) => {
      if (onLoadIn) registerSessionActivity(sessionActive); //(retrieved from cache => session active)
      handleResponse(jsons);
    }, rejection => {
      if (isDebug) {
        console.log(`(no cached entry found)`);
      }
    });
  };

  /** Checks if the input has been changed, and also handles on page load logic */
  useEffect(() => {
    initClipboard();
    setSubmitDisabled(shouldSubmitBeDisabled());
    setReportIsDisabled(_.isEmpty(team) || _.isEmpty(gender) || _.isEmpty(year));

    const submitListener = submitListenerFactory(false);

    // Add "enter" to submit page (do on every effect, since removal occurs on every effect, see return below)
    if (typeof document !== `undefined`) {
      //(TODO: this actually causes mass complications with AutoSuggestText - see the useContext grovelling
      // 'cos for some reason preventDefault from AutoSuggestText gets ignored ... needs more investigation
      // but the grovelling works fine for now!)
      document.addEventListener("keydown", submitListener);
    }

    // Cached response and pre-load handling:
    const forceReload = forceReload1Up && (forceReload1Up != currForceReload1Up);
    if (pageJustLoaded || forceReload) {
      if (forceReload) {
        setCurrForceload1up(forceReload1Up);
      }
      setPageJustLoaded(false); //(ensures this code only gets called once)
      // Load the data if it's cached
      requestHandlingLogic(true);
    }
    if (typeof document !== `undefined`) {
      //(if we added a clipboard listener, then remove it on page close)
      //(if we added a submitListener, then remove it on page close)
      return () => {
        if (clipboard) {
          clipboard.destroy();
          setClipboard(null);
        }
        document.removeEventListener("keydown", submitListener);
      };
    }
  });

  /** If the params match the last request, disable submit */
  function shouldSubmitBeDisabled() {
    const newParams = buildParamsFromState(false)[0];

    const paramsUnchanged = Object.keys(newParams).filter((key) => {
      return (key != "filterGarbage") && (key != "queryFilters");
    }).every(
      (key: string) => (newParams as any)[key] == (currState as any)[key]
    );
    const garbageSpecialCase =
      (newParams?.filterGarbage || ParamDefaults.defaultFilterGarbage) ==
        (currState?.filterGarbage || ParamDefaults.defaultFilterGarbage);
    const queryFiltersSpecialCase =
      (newParams?.queryFilters || ParamDefaults.defaultQueryFilters) ==
        (currState?.queryFilters || ParamDefaults.defaultQueryFilters);

    return (
      atLeastOneQueryMade && paramsUnchanged &&
        garbageSpecialCase && queryFiltersSpecialCase
    ) || (team == "") || (year == AvailableTeams.extraTeamName);
  }


  /** Handles the response from ES to a stats calc request */
  function handleResponse(jsons: any[]) {
    setQueryIsLoading(false);
    const newParams = buildParamsFromState(true)[0];
    const wasError = _.some(jsons, json => RequestUtils.isResponseError(json));
    if (!wasError) {
      setAtLeastOneQueryMade(true);
      setCurrState(newParams);
      onChangeState(newParams);
    }
    childHandleResponse(jsons, wasError);
  }

  /** The user has pressed the submit button - mix of generic and custom logic */
  function onSubmit() {
    setQueryIsLoading(true);

    // Store every primary request in history, successful or not:
    // including the filtering on the results
    const newParamsStrWithFilterParams = QueryUtils.stringify(buildParamsFromState(true)[0]);
    HistoryManager.addParamsToHistory(newParamsStrWithFilterParams, tablePrefix);

    // Load the data via request
    requestHandlingLogic(false);
  }

  /** Load the designated example */
  function onSeeExample() {
    registerSessionActivity(true); //(ensures gets cached)

    // (this is overly complicated looking because it used to include a load of cache management
    //  which has been removed - it's close enough to optimal it's not currently worth tidying up though)
    const prefixesAndParamStrs = (() => {
      if (tablePrefix == ParamPrefixes.report) {
        if (gender == "Women") {
          const newUrl = `${PreloadedDataSamples.womenLineup}`;
          return [
            [ "TeamReport", newUrl ],
          ];
        } else { //(default is men)
          const newUrl = `${PreloadedDataSamples.menLineup}`;
          return [
            [ "TeamReport", newUrl ],
          ];
        }
      } else if (tablePrefix == ParamPrefixes.game) {
        if (gender == "Women") {
          const newUrl = `${PreloadedDataSamples.womenOnOff}`;
          return [
            [ "", newUrl ],
          ];
        } else { //(default is men)
          const newUrl = `${PreloadedDataSamples.menOnOff}`;
          return [
            [ "", newUrl ],
          ];
        }
      } else if (tablePrefix == ParamPrefixes.lineup) {
        if (gender == "Women") {
          const newUrl = `${PreloadedDataSamples.womenLineup}`;
          return [
            [ "LineupAnalyzer", newUrl ],
          ];
        } else { //(default is men)
          const newUrl = `${PreloadedDataSamples.menLineup}`;
          return [
            [ "LineupAnalyzer", newUrl ],
          ];
        }
      }
      return [ ["", ""] ];
    })();
    const pageAndParam = prefixesAndParamStrs[0] as [ string, string ];
    window.location.href = `/${pageAndParam[0]}?${pageAndParam[1]}`;
  }

  /** For use in selects */
  function stringToOption(s: string) {
    return { label: s, value: s};
  }
  /** For use in team select */
  function getCurrentTeamOrPlaceholder() {
    return (team == "") ? { label: 'Choose Team...' } : stringToOption(team);
  }

  /** Adds the MenuList component with user prompt if there are teams fitered out*/
  function maybeMenuList() {
    if (teamList.length < Object.keys(AvailableTeams.byName).length) {
      return { MenuList };
    }
  }

  /** This grovelling is needed to ensure that clipboard is only loaded client side */
  function initClipboard() {
    if (null == clipboard) {
      var newClipboard = new ClipboardJS(`#copyLink_${tablePrefix}`, {
        text: function(trigger) {
          return window.location.href;
        }
      });
      newClipboard.on('success', (event: ClipboardJS.Event) => {
        // Add the saved entry to the clipbaorrd
        const newParamsStrWithFilterParams = QueryUtils.stringify(buildParamsFromState(true)[0]);
        HistoryManager.addParamsToHistory(newParamsStrWithFilterParams, tablePrefix);
        // Clear the selection in some visually pleasing way
        setTimeout(function() {
          event.clearSelection();
        }, 150);
      });
      setClipboard(newClipboard);
    }
  }

  // Visual components:

  /** Let the user know that he might need to change */
  const MenuList = (props: any)  => {
    return (
      <components.MenuList {...props}>
        <p className="text-secondary text-center">(Let me know if there's a team/season you want to see!)</p>
        {props.children}
      </components.MenuList>
    );
  };

  /** Add button to allow users to access their analysis history easily */
  const getHistoryButton = () => {

    // I actually want placement=left but it doesn't work on mobile
    return <OverlayTrigger
      rootClose={true}
      trigger="click"
      key="left"
      placement="auto"
      overlay={
        <Popover id="popover-positioned-left" style={{ maxWidth: historySelectContainerWidth }}>
          <Popover.Title as="h3">{`History`}</Popover.Title>
          <Popover.Content>
            <HistorySelector
              tablePrefix={tablePrefix}
            />
          </Popover.Content>
        </Popover>
      }
    >
      <Button className="float-left" id="historyButton" variant="outline-secondary" size="sm">
        <FontAwesomeIcon icon={faHistory} />
      </Button>
    </OverlayTrigger>
    ;
  };
  /** Copy to clipboard button */
  const getCopyLinkButton = () => {
    const tooltip = (
      <Tooltip id="copyLinkTooltip">Copies URL to clipboard (and saves state to history)</Tooltip>
    );
    return  <OverlayTrigger placement="auto" overlay={tooltip}>
        <Button className="float-left" id={`copyLink_${tablePrefix}`} variant="outline-secondary" size="sm">
          <FontAwesomeIcon icon={faLink} />
        </Button>
      </OverlayTrigger>;
  };
  const getClearQueryButton = () => {
    const onClick = () => {
      const getUrl = () => {
        if (tablePrefix == ParamPrefixes.game) {
          return UrlRouting.getGameUrl({}, {});
        } else if (tablePrefix == ParamPrefixes.lineup) {
          return UrlRouting.getLineupUrl({}, {});
        } else if (tablePrefix == ParamPrefixes.report) {
          return UrlRouting.getTeamReportUrl({});
        } else {
          return undefined;
        }
      };
      const newUrl = getUrl();
      if (newUrl) {
        window.location.href = newUrl;
      }
    };
    const tooltip = (
      <Tooltip id="copyLinkTooltip">Clears and empties the page</Tooltip>
    );
    return  <OverlayTrigger placement="auto" overlay={tooltip}>
        <Button onClick={() => onClick()} className="float-right" id={`clearQuery_${tablePrefix}`} variant="outline-secondary" size="sm">
          <FontAwesomeIcon icon={faTrashAlt} />
        </Button>
      </OverlayTrigger>;
  }

  /** If no team is specified, add the option to jump to an example */
  const getExampleButtonsIfNoTeam = () => {
    if (team == "") {
      return <Shake
        h={20} v={5} r={5} q={5} int={25} fixed={true}
        className="float-right"
      >
        <Button variant="warning" onClick={() => onSeeExample()}><b>Example ({gender})!</b></Button>
      </Shake>;
    } else { // If there is no query then show clear query
      return getClearQueryButton();
    }
  }

  /** Shows the blog help when accessed via hoop-explorer, consistency with top-level maybeShowBlog */
  function maybeShowBlogHelp() {
    const publicSite = !_.startsWith(server, "cbb-on-off-analyzer")
    if (publicSite) {
      return <a href="https://hoop-explorer.blogspot.com/2020/01/basic-and-advanced-queries-in-hoop.html" target="_blank">(?)</a>;
    } else {
      return <a href="/query_docs.html" target="_blank">(?)</a>;
    }
  }

  function maybeShowGarbageHelp() {
    const publicSite = !_.startsWith(server, "cbb-on-off-analyzer")
    if (publicSite) {
      return <span>
      &nbsp;
        <a href="https://hoop-explorer.blogspot.com/2020/01/garbage-time.html" target="_blank">(?)</a>
      </span>;
    } else {
      return undefined;
    }
  }

  const garbageFilterTooltip = (
    <Tooltip id="garbageFilterTooltip">Filters out lineups in garbage time - see the "Garbage time" article under "Blog contents" for more details</Tooltip>
  );

  const filterMenuItem = (item: CommonFilterType, text: String) => {
    return <GenericTogglingMenuItem
      text={text}
      truthVal={QueryUtils.filterHas(queryFilters, item)}
      onSelect={() => setQueryFilters(QueryUtils.toggleFilter(queryFilters, item))}
    />;
  };

  return <LoadingOverlay
    active={queryIsLoading}
    spinner
    text="Calculating statistics"
  ><Form>
    <Form.Group as={Row}>
      <Col xs={6} sm={6} md={3} lg={2}>
        <Select
          isDisabled={majorParamsDisabled}
          value={ stringToOption(gender) }
          options={Array.from(new Set(AvailableTeams.getTeams(team, year, null).map(
            (r) => r.gender
          ))).map(
            (gender) => stringToOption(gender)
          )}
          isSearchable={false}
          onChange={(option) => { if ((option as any)?.value) setGender((option as any).value) }}
        />
      </Col>
      <Col xs={6} sm={6} md={3} lg={2}>
        <Select
          isDisabled={majorParamsDisabled}
          value={ stringToOption(year) }
          options={Array.from(new Set(AvailableTeams.getTeams(team, null, gender).map(
            (r) => r.year
          ))).concat([AvailableTeams.extraTeamName]).map(
            (year) => stringToOption(year)
          )}
          isSearchable={false}
          onChange={(option) => { if ((option as any)?.value) setYear((option as any).value) }}
        />
      </Col>
      <Col className="w-100" bsPrefix="d-lg-none d-md-none"/>
      <Col xs={12} sm={12} md={6} lg={6}>
        <Select
          isDisabled={majorParamsDisabled}
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
      <Col>
        {getHistoryButton()}
        <div className="float-left">&nbsp;&nbsp;</div>
        {getCopyLinkButton()}
      </Col>
    </Form.Group>
    <GlobalKeypressManager.Provider value={submitListenerFactory(true)}>
      {children}
    </GlobalKeypressManager.Provider>
    <Form.Group as={Row}>
      <Form.Label column sm="2">Baseline Query {maybeShowBlogHelp()}</Form.Label>
      <Col sm="8">
        <InputGroup>
          <div className="flex-fill">
            <AutoSuggestText
              readOnly={false}
              placeholder="eg 'Player1 AND NOT (WalkOn1 OR WalkOn2)'"
              initValue={baseQuery}
              year={year}
              gender={gender}
              team={team}
              onChange={(ev: any) => setBaseQuery(ev.target.value)}
              onKeyUp={(ev: any) => setBaseQuery(ev.target.value)}
              onKeyDown={submitListenerFactory(true)}
            />
            </div>
          <Dropdown as={InputGroup.Append} variant="outline-secondary" alignRight>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              <FontAwesomeIcon icon={faFilter} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {filterMenuItem("Conf", "Conference games only")}
              <Dropdown.Divider />
              {filterMenuItem("Home", "Home games only")}
              {filterMenuItem("Away", "Away games only")}
              {filterMenuItem("Not-Home", "Away/Neutral games only")}
              <Dropdown.Divider />
              {filterMenuItem("Nov-Dec", "Nov/Dec only")}
              {filterMenuItem("Jan-Apr", "Jan-Apr only")}
              {filterMenuItem("Last-30d", "Last 30 days only")}
              <Dropdown.Divider />
              <Dropdown.Item as={Button}>
                <div onClick={() => {setQueryFilters([])}}>
                  <span>Clear all query filters</span>
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </InputGroup>
      </Col>
      <Form.Label column className="ml-0 pl-0"><span className="text-muted small">{_.join(queryFilters, "; ")}</span></Form.Label>
    </Form.Group>
    <Form.Group as={Row} controlId="oppositionFilter">
      <Form.Label column sm="2">Opponent Strength</Form.Label>
      <Col sm="2">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="filterOppoBest">Best</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            onChange={(ev: any) => {
              if (ev.target.value.match("^[0-9]*$") != null) {
                setMinRankFilter(ev.target.value);
              }
            }}
            placeholder = "eg 0"
            value={minRankFilter}
          />
        </InputGroup>
      </Col>
      <Col sm="2">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="filterOppoWorst">Worst</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            onChange={(ev: any) => {
              if (ev.target.value.match("^[0-9]*$") != null) {
                setMaxRankFilter(ev.target.value);
              }
            }}
            placeholder = "eg 400"
            value={maxRankFilter}
          />
          </InputGroup>
      </Col>
      <Form.Label column sm="2"><span className="text-muted">(out of ~360 teams)</span></Form.Label>
      <Col sm="3" className="mt-1 pt-1">
        <OverlayTrigger placement="auto" overlay={garbageFilterTooltip}>
          <div>
            <Form.Check type="switch"
              id="excludeGarbage"
              checked={garbageTimeFiltered}
              onChange={() => {
                setGarbageTimeFiltered(!garbageTimeFiltered);
              }}
              label={<span>Filter Garbage{maybeShowGarbageHelp()}</span>}
            />
          </div>
        </OverlayTrigger>
      </Col>
    </Form.Group>
    <Col>
      <Button disabled={submitDisabled} variant="primary" onClick={onSubmit}>Submit</Button>
      {getExampleButtonsIfNoTeam()}
    </Col>
  </Form></LoadingOverlay>;
}

export default CommonFilter;
