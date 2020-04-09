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

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
import Select, { components} from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable";
import { LineupStatsModel } from './LineupStatsTable';
import { getCommonFilterParams, TeamReportFilterParams, ParamDefaults } from '../utils/FilterModels';
import { LineupUtils } from '../utils/LineupUtils';
import { RapmUtils } from '../utils/RapmUtils';
import { UrlRouting } from '../utils/UrlRouting';

// Util imports
import { CbbColors } from "../utils/CbbColors";
import { OnOffReportDiagUtils } from "../utils/OnOffReportDiagUtils";
import { CommonTableDefs } from "../utils/CommonTableDefs";

/** Convert from LineupStatsModel into this */
export type TeamReportStatsModel = {
  players?: Array<any>,
  error_code?: string
}
type Props = {
  lineupReport: LineupStatsModel,
  startingState: TeamReportFilterParams;
  onChangeState: (newParams: TeamReportFilterParams) => void;
  testMode?: boolean; //(if set, the initial processing occurs synchronously)
}

const TeamReportStatsTable: React.FunctionComponent<Props> = ({lineupReport, startingState, onChangeState, testMode}) => {

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname
  // 1] State

  const commonParams = getCommonFilterParams(startingState);

  const [ sortBy, setSortBy ] = useState(startingState.sortBy || ParamDefaults.defaultTeamReportSortBy);
  const [ filterStr, setFilterStr ] = useState(startingState.filter || ParamDefaults.defaultTeamReportFilter);

  // (slight delay when typing into the filter to make it more responsive)
  const [ timeoutId, setTimeoutId ] = useState(-1);
  const [ tmpFilterStr, setTmpFilterStr ] = useState(filterStr);

  // Display options:

  const [ showOnOff, setShowOnOff ] = useState(
    _.isNil(startingState.showOnOff) ? ParamDefaults.defaultShowOnOff : startingState.showOnOff
  );

  const [ showLineupCompositions, setShowLineupCompositions ] = useState(
    _.isNil(startingState.showComps) ? ParamDefaults.defaultShowComps : startingState.showComps
  );

  const [ incReplacementOnOff, setIncReplacementOnOff ] = useState(
    _.isNil(startingState.incRepOnOff) ? ParamDefaults.defaultTeamReportIncRepOnOff : startingState.incRepOnOff
  );

  const [ incRapm, setIncRapm ] = useState(
    true // TODO
  );

  const [ regressDiffs, setRegressDiffs ] = useState(
    parseInt(_.isNil(startingState.regressDiffs) ? ParamDefaults.defaultTeamReportRegressDiffs : startingState.regressDiffs)
  );
  //(this won't change unless the page is reloaded)
  const [ startingRegressDiffs, setStartingRegressDiffs_UNUSED ] = useState(
    parseInt(_.isNil(startingState.regressDiffs) ? ParamDefaults.defaultTeamReportRegressDiffs : startingState.regressDiffs)
  );
  const [ repOnOffDiagMode, setRepOnOffDiagMode ] = useState(
    parseInt(_.isNil(startingState.repOnOffDiagMode) ? ParamDefaults.defaultTeamReportRepOnOffDiagMode : startingState.repOnOffDiagMode)
  );

  const [ rapmDiagMode, setRapmDiagMode ] = useState(
    true // TODO
  );

  /** If the browser is doing heavier calcs then spin the display vs just be unresponsive */
  const [ inBrowserRepOnOffPxing, setInBrowserRepOnOffPxing ] = useState(false);

  const filterFragments =
    filterStr.split(",").map(fragment => _.trim(fragment)).filter(fragment => fragment ? true : false);
  const filterFragmentsPve =
    filterFragments.filter(fragment => fragment[0] != '-');
  const filterFragmentsNve =
    filterFragments.filter(fragment => fragment[0] == '-').map(fragment => fragment.substring(1));

  useEffect(() => { //(this ensures that the filter component is up to date with the union of these fields)
    const newState = _.chain(startingState).merge({
      sortBy: sortBy,
      filter: filterStr,
      showOnOff: showOnOff,
      showComps: showLineupCompositions,
      incRepOnOff: incReplacementOnOff,
      regressDiffs: regressDiffs.toString(),
      repOnOffDiagMode: repOnOffDiagMode.toString()
    }).omit( // remove "debuggy" fields
      (repOnOffDiagMode == 0) ? [ 'repOnOffDiagMode' ] : []
    ).value();
    onChangeState(newState);
  }, [ sortBy, filterStr, showOnOff, showLineupCompositions, incReplacementOnOff, regressDiffs, repOnOffDiagMode ]);

  // (cache this below)
  const [ teamReport, setTeamReport ] = useState({} as any);
  const [ playersWithAdjEff, setPlayersWithAdjEff ] = useState([] as Array<any>);

  const [ rapmInfo, setRapmInfo ] = useState({} as any);

  useEffect(() => { //(this ensures that the filter component is up to date with the union of these fields)

    // We just set this flag to make the processing async so that we can give some indication that
    // we're processing (vs just being unresponsive)
    setInBrowserRepOnOffPxing(true);

  }, [ lineupReport, incReplacementOnOff, regressDiffs, repOnOffDiagMode ] );

  /** logic to perform whenever the data changes (or the metadata in such a way re-processing is required)*/
  const onDataChangeProcessing = () => {
    try {
      const tempTeamReport = LineupUtils.lineupToTeamReport(
        lineupReport, incReplacementOnOff, regressDiffs, repOnOffDiagMode
      );
/**/
console.log("---------RAPM");
try {
  const context = RapmUtils.buildPlayerContext(
    tempTeamReport.players || [], lineupReport.lineups || [], 0.10
  );
  const [ offWeights, defWeights ] = RapmUtils.calcPlayerWeights(
    context.filteredLineups, context
  );
  const diags = RapmUtils.calcCollinearityDiag(offWeights, context);
  console.log(JSON.stringify(_.omit(diags, ["filteredLineups"]), null, 3) +
    `\n(from [${lineupReport?.lineups?.length}] to [${context.filteredLineups.length}])`);

  console.log("====================================");

  const [ offAdjPoss, defAdjPoss ] = RapmUtils.calcPlayerOutputs(
    context.filteredLineups || [], "adj_ppp", 102.4, context //TODO USE AVG EFF
  );
  /**/
  console.log("OFF: " + offAdjPoss.map(p => p.toFixed(2)));
  console.log("DEF: " + defAdjPoss.map(p => p.toFixed(2)));

  // Loop over following ridge regresssions, pick best st:
  // sq(diff_vs_adj_eff) + sq(average param var, off+def/2)
  // (or do some variance in rotation?)
  // Have some diag at the bottom with info

  [ 0, 50, 250, 500, 1000, 2000 ].forEach((ridgeLambda) => {
//  [ 500 ].forEach((ridgeLambda) => { //(seems like we have a winner, but need detailed diags to enable this to be reconstructed in the future)
    console.log("==================================== " + ridgeLambda);
    console.log(context.colToPlayer);
    try {
      const offSolver = RapmUtils.slowRegression(offWeights, ridgeLambda, context);
      const defSolver = RapmUtils.slowRegression(defWeights, ridgeLambda, context);
      const offResults = RapmUtils.calculateRapm(offSolver, offAdjPoss);
      const defResults = RapmUtils.calculateRapm(defSolver, defAdjPoss);

      console.log("eOff: " + offResults.map((p: number) => p.toFixed(3)));
      console.log("eDef: " + defResults.map((p: number) => p.toFixed(3)));

      const offResiduals = RapmUtils.calculatePredictedOut(offWeights, offResults, context);
      const defResiduals = RapmUtils.calculatePredictedOut(offWeights, defResults, context);
      const offErrSd = Math.sqrt(RapmUtils.calculateResidualError(offAdjPoss, offResiduals, context)/(context.numLineups - context.numPlayers));
      const defErrSd = Math.sqrt(RapmUtils.calculateResidualError(defAdjPoss, defResiduals, context)/(context.numLineups - context.numPlayers));
      console.log(`ERR = [${offErrSd.toFixed(1)}] + [${defErrSd.toFixed(1)}]`);
      const offParamErrs = RapmUtils.calcSlowPseudoInverse(offWeights, ridgeLambda, context);
      const defParamErrs = RapmUtils.calcSlowPseudoInverse(defWeights, ridgeLambda, context);
      console.log("errO: " + offParamErrs.map((p: number) => (offErrSd*p).toFixed(3)));
      console.log("errD: " + defParamErrs.map((p: number) => (p*defErrSd).toFixed(3)));
    } catch (err) {
      console.log("ERROR CALLING (R)APM: " + err.message);
    }
  });

} catch (err) {
  console.log("ERROR CALLING (R)APM DIAGS: " + err.message);
}
console.log("---------");


      setTeamReport(tempTeamReport);
      setPlayersWithAdjEff(tempTeamReport?.players || []);
    } catch (e) {
      console.log("Error calling LineupUtils.lineupToTeamReport", e);
    }
  };

  React.useEffect(() => {
    if (inBrowserRepOnOffPxing) {
      setTimeout(() => { //(ensures that the "processing" element is returned _before_ the processing starts)
        onDataChangeProcessing();
        setInBrowserRepOnOffPxing(false);
      }, 1);
    }
  }, [ inBrowserRepOnOffPxing ] );

  // Called fron unit test so we build the snapshot based on the actual data
  if (testMode) {
    onDataChangeProcessing();
  }

  // 2] Data Model

  // 3] Utils

  // 3.1] Table building

  const playerLineupPowerSet = OnOffReportDiagUtils.buildPlayerSummary(
    playersWithAdjEff, incReplacementOnOff
  );

  /** Handles the various sorting combos */
  const sorter = (sortStr: string) => { // format: (asc|desc):(off_|def_|diff_)<field>:(on|off|delta)
    const sortComps = sortStr.split(":"); //asc/desc
    const dir = (sortComps[0] == "desc") ? -1 : 1;
    const fieldComps = _.split(sortComps[1], "_", 1); //off/def/diff
    const fieldName = sortComps[1].substring(fieldComps[0].length + 1); //+1 for _
    const field = (player: any) => {
      switch(fieldComps[0]) {
        case "diff": //(off-def)
          return (player["off_" + fieldName]?.value || 0.0)
                - (player["def_" + fieldName]?.value || 0.0);
        default:
          return player[sortComps[1]]?.value; //(off or def)
      }
    };
    const onOrOff = (playerSet: any) => {
      switch(sortComps[2]) {
        case "on": return [ playerSet.on ];
        case "off": return [ playerSet.off ];
        case "rep": return [ playerSet.replacement ];
        case "delta": return [ playerSet.on, playerSet.off ];
        default: return [ 0 ];
      }
    };
    return (playerSet: any) => {
      const playerFields = onOrOff(playerSet || {}).map(player => field(player) || 0);
      if (playerFields.length > 1) {
        return dir*(playerFields[0] - playerFields[1]); //(delta case above)
      } else {
        return dir*playerFields[0];
      }
    };
  };

  /** Only show help for diagnstic on/off on main page */
  const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");

  const tableData = _.chain(playersWithAdjEff).filter((player) => {
      const strToTest = player.on.key.substring(5);
      return(
        (filterFragmentsPve.length == 0) ||
          (_.find(filterFragmentsPve, (fragment) => strToTest.indexOf(fragment) >= 0) ? true : false))
        &&
        ((filterFragmentsNve.length == 0) ||
          (_.find(filterFragmentsNve, (fragment) => strToTest.indexOf(fragment) >= 0) ? false : true))
        ;
    }).sortBy(
       [ sorter(sortBy) ]
    ).flatMap((player, index) => {
      const [ onMargin, offMargin ] = OnOffReportDiagUtils.getAdjEffMargins(player);
      const onSuffix = `\nAdj: [${onMargin.toFixed(1)}]-[${offMargin.toFixed(1)}]=[${(onMargin - offMargin).toFixed(1)}]`;
      const totalPoss = (player.on.off_poss.value + player.off.off_poss.value || 1);
      const onPoss = 100.0*player.on.off_poss.value/totalPoss;
      const offPoss = 100.0*player.off.off_poss.value/totalPoss;
      const offSuffix = `\nPoss: [${onPoss.toFixed(0)}]% v [${offPoss.toFixed(0)}]%`;
      const onOffAnalysis = {
        ...commonParams,
        onQuery: `"${player.playerId}"`,
        offQuery: `NOT "${player.playerId}"`,
        autoOffQuery: true
      };
      const statsOn = {
        off_title: <span>{player.on.key + onSuffix}<br/>
                      <a target="_blank" href={UrlRouting.getGameUrl(onOffAnalysis, {})}>On/Off Analysis...</a>
                    </span>,
        def_title: "", ...player.on };
      const statsOff = { off_title: player.off.key + offSuffix, def_title: "", ...player.off };

      const replacementMargin = incReplacementOnOff ?
        player.replacement?.off_adj_ppp?.value - player.replacement?.def_adj_ppp?.value : 0.0;
      const repSuffix = `\nAdj: [${replacementMargin.toFixed(1)}]`;

      const statsReplacement = incReplacementOnOff ?
        { off_title: player.replacement?.key + repSuffix, def_title: "", ...player?.replacement }: "";

      return _.flatten([
        showOnOff ? [
          GenericTableOps.buildDataRow(statsOn, CommonTableDefs.offPrefixFn, CommonTableDefs.offCellMetaFn, CommonTableDefs.onOffReportWithFormattedTitle),
          GenericTableOps.buildDataRow(statsOn, CommonTableDefs.defPrefixFn, CommonTableDefs.defCellMetaFn),
          GenericTableOps.buildDataRow(statsOff, CommonTableDefs.offPrefixFn, CommonTableDefs.offCellMetaFn),
          GenericTableOps.buildDataRow(statsOff, CommonTableDefs.defPrefixFn, CommonTableDefs.defCellMetaFn),
        ] : [],
        incReplacementOnOff && (player?.replacement?.key) ? [
          GenericTableOps.buildDataRow(statsReplacement, CommonTableDefs.offPrefixFn, CommonTableDefs.offCellMetaFn, CommonTableDefs.onOffReportReplacement),
          GenericTableOps.buildDataRow(statsReplacement, CommonTableDefs.defPrefixFn, CommonTableDefs.defCellMetaFn, CommonTableDefs.onOffReportReplacement)
        ] : [],
        showLineupCompositions ? [ GenericTableOps.buildTextRow(
          OnOffReportDiagUtils.buildLineupInfo(player, playerLineupPowerSet), "small"
        ) ] : [],
        [ GenericTableOps.buildRowSeparator() ],
        incReplacementOnOff && (index == 0) && (repOnOffDiagMode > 0) ?
          OnOffReportDiagUtils.getRepOnOffDiags(player, commonParams,
            repOnOffDiagMode, regressDiffs,
            showHelp
          ) : [],
      ]);
    }).value();

  // 3.2] Sorting utils

  const sortOptions: Array<any> = _.flatten(
    _.toPairs(CommonTableDefs.onOffReport)
      .filter(keycol => keycol[1].colName && keycol[1].colName != "")
      .map(keycol => {
        return [
          ["desc","off"], ["asc","off"], ["desc","def"], ["asc","def"], ["desc","diff"], ["asc","diff"]
        ].flatMap(sort_offDef => {
          const onOffCombos = _.flatMap([
            showOnOff || showLineupCompositions ? ["on", "off", "delta"] : [],
            incReplacementOnOff ? ["rep"] : []
          ]);
          return onOffCombos.map(onOff => {
            return [ ...sort_offDef, onOff ];
          }); // eg [ [ desc, off, on ], [ desc, off, off ], [ desc, off, delta ] ]
        }).map(combo => {
          const onOrOff = (s: string) => { switch(s) {
            case "on": return "'On'";
            case "off": return "'Off'";
            case "delta": return "'On-Off'";
            case "rep": return "'r:On-Off'";
          }}
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
    showOnOff || showLineupCompositions ? [
      "desc:off_poss:on", "desc:off_poss:off",
      "desc:diff_adj_ppp:delta",
      "desc:diff_adj_ppp:on",
      "desc:diff_adj_ppp:off",
      "desc:off_adj_ppp:delta",
      "asc:def_adj_ppp:delta"
    ] : [],
    incReplacementOnOff ? [
      "desc:off_poss:rep",
      "desc:diff_adj_ppp:rep",
      "desc:off_adj_ppp:rep",
      "asc:def_adj_ppp:rep"
    ] : []
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
  /** The sub-header builder */
  const formatGroupLabel = (data: any) => (
    <div>
      <span>{data.label}</span>
    </div>
  );

  // 3] Utils

  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return inBrowserRepOnOffPxing || (teamReport.players || []).length == 0;
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
      text={teamReport.error_code ?
        `Query Error: ${teamReport.error_code}` :
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
          <Dropdown alignRight>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              <FontAwesomeIcon icon={faCog} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Button}>
                <div onClick={() => setShowOnOff(!showOnOff)}>
                  <span>Show on/off statistics</span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  {showOnOff ? <FontAwesomeIcon icon={faCheck}/> : null}
                </div>
              </Dropdown.Item>
              <Dropdown.Item as={Button}>
                <div onClick={() => setIncReplacementOnOff(!incReplacementOnOff)}>
                  <span>Show replacement On-Off</span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  {incReplacementOnOff ? <FontAwesomeIcon icon={faCheck}/> : null}
                </div>
              </Dropdown.Item>
              <Dropdown.Item as={Button}>
                <div onClick={() => setShowLineupCompositions(!showLineupCompositions)}>
                  <span>Show lineup compositions</span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  {showLineupCompositions ? <FontAwesomeIcon icon={faCheck}/> : null}
                </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as={Button}>
                <div onClick={() => setRegressDiffs(
                  regressDiffs != 0 ?
                    0 : // switch off if on, else switch to the number the page was loaded with
                    (startingRegressDiffs != 0 ? startingRegressDiffs : parseInt(ParamDefaults.defaultTeamReportRegressDiffs))
                )}>
                  <span>Regress 'r:On-Off' {
                    startingRegressDiffs > 0 ? "by" : "to"
                  } {Math.abs(startingRegressDiffs != 0 ? startingRegressDiffs : parseInt(ParamDefaults.defaultTeamReportRegressDiffs))} samples</span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  {regressDiffs != 0 ? <FontAwesomeIcon icon={faCheck}/> : null}
                </div>
              </Dropdown.Item>
              <Dropdown.Item as={Button}>
                <div onClick={() => setRepOnOffDiagMode(repOnOffDiagMode != 0 ? 0 : 10)}>
                  <span>'r:On-Off' diagnostic mode</span>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  {repOnOffDiagMode != 0 ? <FontAwesomeIcon icon={faCheck}/> : null}
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      </Form.Row>
      <Row>
        <Col>
          <GenericTable
            tableCopyId="teamReportStatsTable"
            tableFields={CommonTableDefs.onOffReport}
            tableData={tableData}
          />
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
};

export default TeamReportStatsTable;
