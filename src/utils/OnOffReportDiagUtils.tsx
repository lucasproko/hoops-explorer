
// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "../components/GenericTable";

// Utils
import { UrlRouting } from './UrlRouting';
import { CommonTableDefs } from "./CommonTableDefs";
import { CommonFilterParams } from "./FilterModels";

/** Encapsulates some of the logic used to build the diag visualiations in TeamReportStatsTable */
export class OnOffReportDiagUtils {

  // 1] Roster comparison logic

  /** Util to calc on/off margins */
  static readonly getAdjEffMargins = (player: Record<string, any>) => {
    const onMargin = (player?.on?.off_adj_ppp?.value || 0.0) - (player?.on?.def_adj_ppp?.value || 0.0);
    const offMargin = (player.off?.off_adj_ppp?.value || 0.0) - (player?.off?.def_adj_ppp?.value || 0.0);
    return [ onMargin, offMargin ]
  }

  /** Builds an array of players vs their margin differences (using replacement on/off if available)*/
  static readonly buildPlayerSummary = (playersWithAdjEff: Array<Record<string, any>>, incReplacementOnOff: boolean) => {
    return _.chain(playersWithAdjEff).map((player) => {
      if (incReplacementOnOff && player.replacement?.key) {
        return [ player.playerId,
          (player.replacement?.off_adj_ppp?.value || 0.0) - (player.replacement?.def_adj_ppp?.value || 0.0)];
      } else {
        const [ onMargin, offMargin ] = OnOffReportDiagUtils.getAdjEffMargins(player);
        return [ player.playerId, onMargin - offMargin ];
      }
    }).fromPairs().value();
  }

  /** Builds lineup composition info */
  static readonly buildLineupInfo = (playerObj: Record<string, any>, playerLineupPowerSet: Record<string, any>) => {
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

  // 2] Replacement on/off diag logic

  private static getTitle(player: Record<string, any>, showHelp: boolean) {
    return GenericTableOps.buildTextRow(<span>
        <b>Replacement 'On-Off' Diagnostics For [{player.playerId}]</b> {
          showHelp ? <a href="https://hoop-explorer.blogspot.com/2020/03/diagnostics-mode-for-replacement-onoff.html" target="_new">(?)</a> : null
        }
      </span>);
  }

  static getRepOnOffDiags(
    player: Record<string, any>, commonParams: CommonFilterParams,
    repOnOffDiagMode: number, regressDiffs: number,
    showHelp: boolean
  ) {
    return _.flatten([
      [ OnOffReportDiagUtils.getTitle(player, showHelp) ],
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

          const lineupDiffAdjEff = {
            off_adj_ppp: { value: lineup.onLineup.off_adj_ppp.value - lineup.offLineups.off_adj_ppp.value },
            def_adj_ppp: { value: lineup.onLineup.def_adj_ppp.value - lineup.offLineups.def_adj_ppp.value }
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
            ...commonParams,
            minPoss: "0",
            maxTableSize: "100",
            //sortBy: use default
            filter: nonPlayerLineup.join(",")
          };
          const same4Players =
            _.chain(lineup?.players_array?.hits?.hits?.[0]?._source?.players || [])
              .map((v) => v.id)
              .filter((pid) => pid != player.playerId).value();

          const onOffParams = {
            ...commonParams,
            onQuery: `"${player.playerId}" AND "${same4Players.join('" AND "')}"`,
            offQuery: `"${same4Players.join('" AND "')}" AND NOT "${player.playerId}"`,
            autoOffQuery: false
          };

          const offTitleWithLinks =
            <div>Same-4 Lineups<br/>
              <a href={UrlRouting.getGameUrl(onOffParams, {})} target="_blank">On/Off Analysis...</a><br/>
              <a href={UrlRouting.getLineupUrl(lineupParams, {})} target="_blank">Lineup Analysis...</a>
            </div>;

          const lineupKey = nonPlayerLineup.join(" / ");
          const lineupDiffStats = { off_title: `Harmonic: ${lineupKey}`, def_title: "", ...lineup, ...lineupDiffAdjEff };
          const lineupOnStats = { off_title: `'On' Lineup\n${contribStr}`, def_title: "", ...lineup.onLineup };
          const lineupOffStats = { off_title: offTitleWithLinks, def_title: "", ...lineup.offLineups };
          return [
            GenericTableOps.buildDataRow(lineupDiffStats, CommonTableDefs.offPrefixFn, CommonTableDefs.offCellMetaFn, CommonTableDefs.onOffReportReplacement),
            GenericTableOps.buildDataRow(lineupDiffStats, CommonTableDefs.defPrefixFn, CommonTableDefs.defCellMetaFn, CommonTableDefs.onOffReportReplacement),
            GenericTableOps.buildDataRow(lineupOnStats, CommonTableDefs.offPrefixFn, CommonTableDefs.offCellMetaFn),
            GenericTableOps.buildDataRow(lineupOnStats, CommonTableDefs.defPrefixFn, CommonTableDefs.defCellMetaFn),
            GenericTableOps.buildDataRow(lineupOffStats, CommonTableDefs.offPrefixFn, CommonTableDefs.offCellMetaFn, CommonTableDefs.onOffReportWithFormattedTitle),
            GenericTableOps.buildDataRow(lineupOffStats, CommonTableDefs.defPrefixFn, CommonTableDefs.defCellMetaFn),
            GenericTableOps.buildTextRow(
              <span><b>Same-4 Lineup Counts:</b> {lineupSummary}</span>,
              "small"
            ),
            GenericTableOps.buildRowSeparator()
          ];
      }).value(),
      [ GenericTableOps.buildRowSeparator() ],
    ]);
  }

}
