// React imports:
import React, { useState } from 'react';

// Lodash
import _ from "lodash";

// Next imports:
import { NextPage } from 'next';

// Library Utils
// @ts-ignore
import { mean, std } from "mathjs";

// Utils
import { OnOffReportDiagUtils } from "../../utils/tables/OnOffReportDiagUtils";
import { CommonFilterParams } from "../../utils/FilterModels";
import { QueryUtils } from "../../utils/QueryUtils";

type Props = {
  diagInfo: Array<any>,
  player: Record<string, any>,
  playerMap: Record<string, string>, //(code -> id)
  commonParams: CommonFilterParams,
  expandedMode: boolean,
  onExpand: (playerId: string) => void,
  showHelp: boolean,
  keyLineupThreshold?: number //(for testing, leave blank in prod)
};

const RepOnOffDiagView: React.FunctionComponent<Props> = ({diagInfo, player, playerMap, commonParams, expandedMode, onExpand, showHelp, keyLineupThreshold}) => {

  const threshold = _.isNil(keyLineupThreshold) ? 1 : keyLineupThreshold;

  // Build player comparison links with peers:
  const baseMaybeAdvQuery = QueryUtils.extractAdvancedQuery(commonParams.baseQuery || "");
  const compareLinkFromPeer = (peerCode: string) => {
    return OnOffReportDiagUtils.buildPlayerComparisonLink(
      player.playerId, player.playerCode, playerMap[peerCode] || peerCode, peerCode, baseMaybeAdvQuery, commonParams
    );
  };

  const doSame4Analysis = (offOrDef: "off" | "def", dir: 1 | -1) => {
    const field = "adjEff";
    const contrib = (lineupPlusDiag: any, field: string) =>
      (lineupPlusDiag?.contrib?.[offOrDef]?.[field] || 0) as number;
    const lineups = diagInfo.filter(
      (lineupPlusDiag) => contrib(lineupPlusDiag, field)*dir < 0
    );
    const contribs = lineups.map((lineupPlusDiag) => contrib(lineupPlusDiag, field));
    const sumContrib = _.sum(contribs)
    const meanContrib: any = contribs.length ? mean(contribs) : 0;
    const stdevContrib: any = contribs.length ? std(contribs) : 0;
    const keyLineups =  _.chain(lineups).filter( // has to be > 1x stdev (unless threshold disabled)
        (lineupPlusDiag) => !threshold || (Math.abs(contrib(lineupPlusDiag, field) - meanContrib) > threshold*stdevContrib)
      ).filter( // only care about 1 direction
        (lineupPlusDiag) => (dir == -1) == (contrib(lineupPlusDiag, field) >= meanContrib)
      ).sortBy(
        [ (lineupPlusDiag) => dir*contrib(lineupPlusDiag, field) ]
      ).take(5).value();

    const keyPeers = _.chain(keyLineups).flatMap((v) => _.toPairs(v.peers)).transform((acc, kv) => {
        const peerId = kv[0] as string;
        const peerInfo = kv[1] as Record<string, any>;
        if (!acc.hasOwnProperty(peerId)) {
          acc[peerId] = peerInfo.poss as number;
        } else {
          acc[peerId] += peerInfo.poss as number;
        }
      }, {} as Record<string, number>).toPairs().sortBy([(kv) => -kv[1]]).take(5).value();

    return [
      keyLineups.map((lineupPlusDiag, i) => {
        const title = lineupPlusDiag.keyArray.join(" / ");
        const same4Ids = lineupPlusDiag.keyArray.map((code: string) => playerMap[code] || code);
        return <li key={"" + i}>
          {OnOffReportDiagUtils.buildOnOffAnalysisLink(player.playerId, same4Ids, commonParams, title)}
          &nbsp;contrib=[<b>{contrib(lineupPlusDiag, field).toFixed(2)}</b>]
          &nbsp;(poss=[<b>{contrib(lineupPlusDiag, "totalPoss").toFixed(1)}</b>], [<b>{(100*contrib(lineupPlusDiag, "possWeight")).toFixed(1)}%</b>])
        </li>
      }),
      keyPeers.map((peerKv, i) => {
        const append = (keyPeers.length - 1 == i) ? "" : ", ";
        return <span key={"peer" + i}>{compareLinkFromPeer(peerKv[0])} (poss=[<b>{peerKv[1].toFixed(0)}</b>]){append}</span>
      }),
      sumContrib, meanContrib, stdevContrib, contribs.length
    ];
  };

  const buildInfo = (offOrDef: "off" | "def") => {

    const infoHtml = _.flatMap([ -1, 1 ], (dir: 1 | -1, index) => {
      const [
        keyLineupHtml, keyPeerHtml, keySum, keyMean, keyStdev, keyLength
      ] = doSame4Analysis(offOrDef, dir);

      const goodOrBad = (dir > 0) == (offOrDef == "off") ? "Bad" : "Good";

      return [
        <li key={offOrDef + index}>[<b>{keyLength}</b>] {goodOrBad} "Same-4"s, total contrib=[<b>{keySum.toFixed(1)}</b>] (mean=[<b>{keyMean.toFixed(1)}</b>], std=[<b>{keyStdev.toFixed(1)}</b>]).
        {keyLineupHtml.length > 0 ? " Key lineups:" : " All lineups similar."}</li>,
        <ul key={"ul" + offOrDef + index}>
          {keyLineupHtml.length > 0 ? keyLineupHtml.concat(
            [<li key={"ul" + offOrDef + "peers"}>Key sub-ins: {keyPeerHtml}</li>]
          ) : null}
        </ul>
      ]
    });

    return <ul>
      {infoHtml}
    </ul>;
  }

  return <span>
    {OnOffReportDiagUtils.getTitle(player, showHelp)}
    <ul>
      <li>Offensive analysis ([<b>{player?.replacement?.off_adj_ppp?.value.toFixed(1)}</b>] pts/100):</li>
      {buildInfo("off")}
      <li>Defensive analysis ([<b>{player?.replacement?.def_adj_ppp?.value.toFixed(1)}</b>] pts/100):</li>
      {buildInfo("def")}
      {!expandedMode ?
        <li><a href="#" onClick={(event) => { event.preventDefault(); onExpand(player.playerCode) }}>To view more detailed analysis for just this player click here</a>.</li>
        :
        <li><a href="#" onClick={(event) => { event.preventDefault(); onExpand("") }}>To clear the detailed analysis and player filter click here</a>.</li>
      }
    </ul>
  </span>;
}

export default RepOnOffDiagView;
