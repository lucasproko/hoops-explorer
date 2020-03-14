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
import { UrlRouting } from '../utils/UrlRouting';

// Util imports
import { CbbColors } from "../utils/CbbColors";

/** Convert from LineupStatsModel into this */
export type TeamReportStatsModel = {
  players?: Array<any>,
  avgOff?: number,
  error_code?: string
}
type Props = {
  lineupReport: LineupStatsModel,
  startingState: TeamReportFilterParams;
  onChangeState: (newParams: TeamReportFilterParams) => void;
}

const TeamReportStatsTable: React.FunctionComponent<Props> = ({lineupReport, startingState, onChangeState}) => {

  // 1] State

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

  useEffect(() => { //(this ensures that the filter component is up to date with the union of these fields)

    // We just set this flag to make the processing async so that we can give some indication that
    // we're processing (vs just being unresponsive)
    setInBrowserRepOnOffPxing(true);

  }, [ lineupReport, incReplacementOnOff, regressDiffs, repOnOffDiagMode ] );

  useEffect(() => {
    if (inBrowserRepOnOffPxing) {
      setTimeout(() => { //(ensures that the "processing" element is returned _before_ the processing starts)
        try {
          const tempTeamReport = LineupUtils.lineupToTeamReport(
            lineupReport, incReplacementOnOff, regressDiffs, repOnOffDiagMode
          );
          setTeamReport(tempTeamReport);
          const avgOff = lineupReport.avgOff || 100.0;
          setPlayersWithAdjEff(withAdjEfficiency(tempTeamReport?.players || [], avgOff));
        } catch (e) {
          console.log("Error calling LineupUtils.lineupToTeamReport", e);
        }
        setInBrowserRepOnOffPxing(false);
      }, 1);
    }
  }, [ inBrowserRepOnOffPxing ] );

  // 2] Data Model
  const tableFields = { //accessors vs column metadata
    "title": GenericTableOps.addTitle("", "", rowSpanCalculator, "small"),
    "sep0": GenericTableOps.addColSeparator(),
    "ppp": GenericTableOps.addPtsCol("P/100", "Points per 100 possessions", picker(...CbbColors.pp100)),
    "adj_ppp": GenericTableOps.addPtsCol("Adj P/100", "Approximate schedule-adjusted Points per 100 possessions", picker(...CbbColors.pp100)),
    "sep1": GenericTableOps.addColSeparator(),
    "efg": GenericTableOps.addPctCol("eFG%", "Effective field goal% (3 pointers count 1.5x as much) for selected lineups", picker(...CbbColors.eFG)),
    "to": GenericTableOps.addPctCol("TO%", "Turnover % for selected lineups", picker(...CbbColors.tOver)),
    "orb": GenericTableOps.addPctCol("ORB%", "Offensive rebounding % for selected lineups", picker(...CbbColors.oReb)),
    "ftr": GenericTableOps.addPctCol("FTR", "Free throw rate for selected lineups", picker(...CbbColors.ftr)),
    "sep2": GenericTableOps.addColSeparator(),
    "3pr": GenericTableOps.addPctCol("3PR", "Percentage of 3 pointers taken against all field goals", picker(...CbbColors.fgr)),
    "2pmidr": GenericTableOps.addPctCol("2PR mid", "Percentage of mid range 2 pointers taken against all field goals", picker(...CbbColors.fgr)),
    "2primr": GenericTableOps.addPctCol("2PR rim", "Percentage of layup/dunk/etc 2 pointers taken against all field goals", picker(...CbbColors.fgr)),
    "sep3": GenericTableOps.addColSeparator(),
    "3p": GenericTableOps.addPctCol("3P%", "3 point field goal percentage", picker(...CbbColors.fg3P)),
    "2p": GenericTableOps.addPctCol("2P%", "2 point field goal percentage", picker(...CbbColors.fg2P)),
    "2pmid": GenericTableOps.addPctCol("2P% mid", "2 point field goal percentage (mid range)", picker(...CbbColors.fg2P_mid)),
    "2prim": GenericTableOps.addPctCol("2P% rim", "2 point field goal percentage (layup/dunk/etc)", picker(...CbbColors.fg2P_rim)),
    "sep4": GenericTableOps.addColSeparator(),
    "poss": GenericTableOps.addIntCol("Poss", "Total number of possessions for selected lineups", GenericTableOps.defaultColorPicker),
    "adj_opp": GenericTableOps.addPtsCol("SoS", "Weighted average of the offensive or defensive efficiencies of the lineups' opponents", GenericTableOps.defaultColorPicker),
  };
  const tableFieldsWithFormattedTitle = _.chain(tableFields).toPairs().map((kv) => {
    if (kv[0] == "title") {
      return [ kv[0], GenericTableOps.addTitle("", "", rowSpanCalculator, "small", GenericTableOps.htmlFormatter) ];
    } else return kv;
  }).fromPairs().value();
  const replacementTableFields = { //accessors vs column metadata
    "title": GenericTableOps.addTitle("", "", rowSpanCalculator, "small"),
    "sep0": GenericTableOps.addColSeparator(),
    "ppp": GenericTableOps.addPtsCol("P/100", "Points per 100 possessions", picker(...CbbColors.diff10_p100_redGreen)),
    "adj_ppp": GenericTableOps.addPtsCol("Adj P/100", "Approximate schedule-adjusted Points per 100 possessions", picker(...CbbColors.diff10_p100_redGreen)),
    "sep1": GenericTableOps.addColSeparator(),
    "efg": GenericTableOps.addPctCol("eFG%", "Effective field goal% (3 pointers count 1.5x as much) for selected lineups", picker(...CbbColors.diff10_redGreen)),
    "to": GenericTableOps.addPctCol("TO%", "Turnover % for selected lineups", picker(...CbbColors.diff10_greenRed)),
    "orb": GenericTableOps.addPctCol("ORB%", "Offensive rebounding % for selected lineups", picker(...CbbColors.diff10_redGreen)),
    "ftr": GenericTableOps.addPctCol("FTR", "Free throw rate for selected lineups", picker(...CbbColors.diff10_redGreen)),
    "sep2": GenericTableOps.addColSeparator(),
    "3pr": GenericTableOps.addPctCol("3PR", "Percentage of 3 pointers taken against all field goals", picker(...CbbColors.diff10_blueOrange)),
    "2pmidr": GenericTableOps.addPctCol("2PR mid", "Percentage of mid range 2 pointers taken against all field goals", picker(...CbbColors.diff10_blueOrange)),
    "2primr": GenericTableOps.addPctCol("2PR rim", "Percentage of layup/dunk/etc 2 pointers taken against all field goals", picker(...CbbColors.diff10_blueOrange)),
    "sep3": GenericTableOps.addColSeparator(),
    "3p": GenericTableOps.addPctCol("3P%", "3 point field goal percentage", picker(...CbbColors.diff10_redGreen)),
    "2p": GenericTableOps.addPctCol("2P%", "2 point field goal percentage", picker(...CbbColors.diff10_redGreen)),
    "2pmid": GenericTableOps.addPctCol("2P% mid", "2 point field goal percentage (mid range)", picker(...CbbColors.diff10_redGreen)),
    "2prim": GenericTableOps.addPctCol("2P% rim", "2 point field goal percentage (layup/dunk/etc)", picker(...CbbColors.diff10_redGreen)),
    "sep4": GenericTableOps.addColSeparator(),
    "poss": GenericTableOps.addIntCol("Poss", "Total number of possessions for selected lineups", GenericTableOps.defaultColorPicker),
    "adj_opp": GenericTableOps.addPtsCol("SoS", "Weighted average of the offensive or defensive efficiencies of the lineups' opponents", GenericTableOps.defaultColorPicker),
  };

  // 3] Utils

  // 3.1] Table building

  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off";
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def";

  const calcAdjEff = (stats: any, avgOff: number) => {
    return _.mapValues({
      off_adj_ppp: { value: (stats.def_adj_opp?.value) ?
        (stats.off_ppp.value || 0.0)*(avgOff/stats.def_adj_opp.value) : undefined
      },
      def_adj_ppp: { value: (stats.off_adj_opp?.value) ?
        (stats.def_ppp.value || 0.0)*(avgOff/stats.off_adj_opp.value) : undefined
      }
    }, v => _.isNil(v.value) ? undefined : v);
  };

  const withAdjEfficiency = (mutablePlayers: Array<any>, avgOff: number) => {
    return _.chain(mutablePlayers).map((player) => {
        const adjOffDefOn = calcAdjEff(player.on, avgOff);
        const adjOffDefOff = calcAdjEff(player.off, avgOff);
        //(replacement on/off mutated in when the lineupReport changes)
        if (player.replacement?.off_adj_ppp?.value) {
          //these have be calc'd already, just need to incorporate average
          player.replacement.off_adj_ppp.value *= avgOff;
        }
        if (player.replacement?.def_adj_ppp?.value) {
          player.replacement.def_adj_ppp.value *= avgOff;
        }
        return {
          playerId: player.playerId,
          on: { ...player.on, ...adjOffDefOn },
          off: { ...player.off, ...adjOffDefOff },
          replacement: { ...player.replacement },
          teammates: player.teammates
        };
      } ).value();
  };

  const playerLineupPowerSet = _.chain(playersWithAdjEff).map((player) => {
    if (incReplacementOnOff && player.replacement.key) {
      return [ player.playerId,
        (player.replacement?.off_adj_ppp?.value || 0.0) - (player.replacement?.def_adj_ppp?.value || 0.0)];
    } else {
      const onMargin = player.on.off_adj_ppp.value - player.on.def_adj_ppp.value;
      const offMargin = player.off.off_adj_ppp.value - player.off.def_adj_ppp.value;
      return [ player.playerId, onMargin - offMargin ];
    }
  }).fromPairs().value();

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

  /** Builds lineup composition info */
  const buildLineupInfo = (playerObj: Record<string, any>) => {
    const totalOnPoss = _.max([playerObj.on.off_poss.value + playerObj.on.def_poss.value, 1]);
    const totalOffPoss = _.max([playerObj.off.off_poss.value + playerObj.off.def_poss.value, 1]);
    const playerPcts = _.chain(playerObj.teammates).toPairs()
      .filter((keyVal) => {
        return keyVal[0] != playerObj.playerId;
      }).map((keyVal) => {
        const possObj = keyVal[1];
        const onPoss = possObj.on.off_poss + possObj.on.def_poss;
        const offPoss = possObj.off.off_poss + possObj.off.def_poss;
        return {
          name: keyVal[0],
          onPct: 100.0*onPoss/totalOnPoss,
          offPct: 100.0*offPoss/totalOffPoss
        };
      }).value();

    const lineupPower = _.sumBy(playerPcts, (pctObj) => {
        return 0.01*
          (pctObj.onPct - pctObj.offPct)*(playerLineupPowerSet[pctObj.name] || 0);
    });

    return _.concat(_.chain(playerPcts).orderBy(["onPct"], ["desc"]).map((pctObj, index) => {
        return <span key={"" + index}>
            <b>{pctObj.name}</b> ([{pctObj.onPct.toFixed(1)}]% - [{pctObj.offPct.toFixed(1)}]%);&nbsp;
          </span>;
      }).value(),
      <span key="last">
        <b>Lineup rating:</b> [{lineupPower.toFixed(1)}]
      </span>
    );
  };

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
      const onMargin = player.on.off_adj_ppp.value - player.on.def_adj_ppp.value;
      const offMargin = player.off.off_adj_ppp.value - player.off.def_adj_ppp.value;
      const onSuffix = `\nAdj: [${onMargin.toFixed(1)}]-[${offMargin.toFixed(1)}]=[${(onMargin - offMargin).toFixed(1)}]`;
      const totalPoss = (player.on.off_poss.value + player.off.off_poss.value || 1);
      const onPoss = 100.0*player.on.off_poss.value/totalPoss;
      const offPoss = 100.0*player.off.off_poss.value/totalPoss;
      const offSuffix = `\nPoss: [${onPoss.toFixed(0)}]% v [${offPoss.toFixed(0)}]%`;
      const statsOn = { off_title: player.on.key + onSuffix, def_title: "", ...player.on };
      const statsOff = { off_title: player.off.key + offSuffix, def_title: "", ...player.off };

      const replacementMargin = incReplacementOnOff ?
        player.replacement?.off_adj_ppp?.value - player.replacement?.def_adj_ppp?.value : 0.0;
      const repSuffix = `\nAdj: [${replacementMargin.toFixed(1)}]`;

      const statsReplacement = incReplacementOnOff ?
        { off_title: player.replacement?.key + repSuffix, def_title: "", ...player?.replacement }: "";

      return _.flatten([
        showOnOff ? [
          GenericTableOps.buildDataRow(statsOn, offPrefixFn, offCellMetaFn),
          GenericTableOps.buildDataRow(statsOn, defPrefixFn, defCellMetaFn),
          GenericTableOps.buildDataRow(statsOff, offPrefixFn, offCellMetaFn),
          GenericTableOps.buildDataRow(statsOff, defPrefixFn, defCellMetaFn),
        ] : [],
        incReplacementOnOff && (player?.replacement?.key) ? [
          GenericTableOps.buildDataRow(statsReplacement, offPrefixFn, offCellMetaFn, replacementTableFields),
          GenericTableOps.buildDataRow(statsReplacement, defPrefixFn, defCellMetaFn, replacementTableFields)
        ] : [],
        showLineupCompositions ? [ GenericTableOps.buildTextRow(
          buildLineupInfo(player), "small"
        ) ] : [],
        [ GenericTableOps.buildRowSeparator() ],
        (index == 0) && (repOnOffDiagMode > 0) ? _.flatten([
          [ GenericTableOps.buildTextRow(<span><b>Replacement 'ON-OFF' Diagnostics For [{player.playerId}]</b></span>) ],
          _.chain(player?.replacement?.myLineups)
            .sortBy([(lineup) => -lineup?.off_poss.value])
            .take(repOnOffDiagMode).flatMap((lineup: any) => {

              const onLineupKeyArray = lineup.key.split("_");

              const lineupKeys = (key: string) => {
                const lineupKeyArray = key.split("_");
                const newPlayerId = _.difference(lineupKeyArray, onLineupKeyArray)?.[0] || "unknown";
                return lineupKeyArray
                  .filter(pid => pid != newPlayerId)
                  .map((pid, i) => <span key={"" + i}>{pid}/<wbr/></span>)
                  .concat(<b key={"newPlayerId"}>{newPlayerId}</b>);
              }
              //kv[0].replace(/_/g, " / ")
              const lineupSummary =
                _.chain(player?.replacement?.lineupUsage || {})
                  .pick(lineup.offLineupKeys || [])
                  .toPairs()
                  .sortBy((kv => - kv[1]?.off_poss?.value))
                  .take(repOnOffDiagMode)
                  .map((kv, i) =>
                    <span key={"" + i}>{lineupKeys(kv[0])} (p=[{kv[1].poss}]/o=[{kv[1].overlap}]);&nbsp;</span>
                  ).value();

              const onLineupPlayerId = _.difference(
                onLineupKeyArray, ((lineup.offLineupKeys?.[0] || "").split("_"))
              )?.[0] || "unknown";

              const lineupOnAdjEff: Record<string, any> = calcAdjEff(lineup.onLineup, lineupReport.avgOff || 100.0);
              const lineupOffAdjEff: Record<string, any> = calcAdjEff(lineup.offLineups, lineupReport.avgOff || 100.0);
              const lineupDiffAdjEff = {
                off_adj_ppp: { value: lineupOnAdjEff.off_adj_ppp.value - lineupOffAdjEff.off_adj_ppp.value },
                def_adj_ppp: { value: lineupOnAdjEff.def_adj_ppp.value - lineupOffAdjEff.def_adj_ppp.value }
              };
              const regressed = (n: number | undefined) => {
                const num = n || 0;
                return regressDiffs < 0 ? -regressDiffs : (num + regressDiffs);
              }
              const offTotalPos = regressed(player?.replacement?.off_poss?.value) || 1;
              const defTotalPos = regressed(player?.replacement?.def_poss?.value) || 1;
              const offContrib = lineupDiffAdjEff.off_adj_ppp.value*(lineup?.off_poss?.value || 0)/offTotalPos;
              const defContrib = lineupDiffAdjEff.def_adj_ppp.value*(lineup?.def_poss?.value || 0)/defTotalPos;
              const contribStr = `Adj Eff Contrib:\noff=[${offContrib.toFixed(2)}] def=[${defContrib.toFixed(2)}]`;

              const nonPlayerLineup = onLineupKeyArray.filter((pid: string) => pid != onLineupPlayerId);
              const lineupParams = {
                ...getCommonFilterParams(startingState),
                minPoss: "0",
                maxTableSize: "100",
                //sortBy: use default
                filter: nonPlayerLineup.join(",")
              };

              const offTitleWithLinks =
                <div><b>Same-4 Lineups</b><br/>
                  <a href="#" target="_blank">On/Off Analysis...</a><br/>
                  <a href={UrlRouting.getLineupUrl(lineupParams, {})} target="_blank">Lineup Analysis...</a>
                </div>;

              const lineupKey = nonPlayerLineup.join(" / ");
              const lineupDiffStats = { off_title: `Harmonic: ${lineupKey}`, def_title: "", ...lineup, ...lineupDiffAdjEff };
              const lineupOnStats = { off_title: `'ON' Lineup\n${contribStr}`, def_title: "", ...lineup.onLineup, ...lineupOnAdjEff };
              const lineupOffStats = { off_title: offTitleWithLinks, def_title: "", ...lineup.offLineups, ...lineupOffAdjEff };
              return [
                GenericTableOps.buildDataRow(lineupDiffStats, offPrefixFn, offCellMetaFn, replacementTableFields),
                GenericTableOps.buildDataRow(lineupDiffStats, defPrefixFn, defCellMetaFn, replacementTableFields),
                GenericTableOps.buildDataRow(lineupOnStats, offPrefixFn, offCellMetaFn),
                GenericTableOps.buildDataRow(lineupOnStats, defPrefixFn, defCellMetaFn),
                GenericTableOps.buildDataRow(lineupOffStats, offPrefixFn, offCellMetaFn, tableFieldsWithFormattedTitle),
                GenericTableOps.buildDataRow(lineupOffStats, defPrefixFn, defCellMetaFn),
                GenericTableOps.buildTextRow(
                  <span><b>Same-4 Lineup Counts:</b> {lineupSummary}</span>,
                  "small"
                ),
                GenericTableOps.buildRowSeparator()
              ];
          }).value(),
          [ GenericTableOps.buildRowSeparator() ],
        ]) : [],
      ]);
    }).value();

  // 3.2] Sorting utils

  const sortOptions: Array<any> = _.flatten(
    _.toPairs(tableFields)
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
            case "on": return "'ON'";
            case "off": return "'OFF'";
            case "delta": return "'ON'-'OFF'";
            case "rep": return "'REP.+-'";
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
    return inBrowserRepOnOffPxing || (teamReport.players || []).length == 0;
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
          <GenericTable tableCopyId="teamReportStatsTable" tableFields={tableFields} tableData={tableData}/>
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
};

export default TeamReportStatsTable;
