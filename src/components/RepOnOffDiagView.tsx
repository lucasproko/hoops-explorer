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
import { OnOffReportDiagUtils } from "../utils/OnOffReportDiagUtils";

type Props = {
  diagInfo: Array<any>,
  player: Record<string, any>,
  expandedMode: boolean,
  showHelp: boolean
};

const RepOnOffDiagView: React.FunctionComponent<Props> = ({diagInfo, player, expandedMode, showHelp}) => {

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
    return [
      _.chain(lineups).filter( // has to be > 1x stdev
        (lineupPlusDiag) => Math.abs(contrib(lineupPlusDiag, field) - meanContrib) > 1*stdevContrib
      ).filter( // only care about 1 direction
        (lineupPlusDiag) => (dir == -1) == (contrib(lineupPlusDiag, field) > meanContrib)
      ).sortBy(
        [ (lineupPlusDiag) => dir*contrib(lineupPlusDiag, field) ]
      ).take(5).map((lineupPlusDiag, i) => {
        return <li key={"" + i}>
          <a href="#">{lineupPlusDiag.keyArray.join(" / ")}</a>:
          &nbsp;contrib=[<b>{contrib(lineupPlusDiag, field).toFixed(2)}</b>]
          &nbsp;(poss=[<b>{contrib(lineupPlusDiag, "totalPoss").toFixed(1)}</b>], [<b>{(100*contrib(lineupPlusDiag, "possWeight")).toFixed(1)}%</b>])
        </li>
      }).value(),
      sumContrib, meanContrib, stdevContrib, contribs.length
    ];
  };
  const peerInfo = OnOffReportDiagUtils.buildPeerStatsForPlayer(player, diagInfo);
  const doPeerAnalysis = (offOrDef: "off" | "def") => {
    return _.keys(peerInfo).join(" , "); //TODO
  };


  const buildInfo = (offOrDef: "off" | "def") => {

    const infoHtml = _.flatMap([ -1, 1 ], (dir: 1 | -1, index) => {
      const [
        keyLineupHtml, keySum, keyMean, keyStdev, keyLength
      ] = doSame4Analysis(offOrDef, dir);

      const goodOrBad = (dir > 0) == (offOrDef == "off") ? "Bad" : "Good";

      return [
        <li key={offOrDef + index}>[<b>{keyLength}</b>] {goodOrBad} "Same-4"s, total contrib=[<b>{keySum.toFixed(1)}</b>] (mean=[<b>{keyMean.toFixed(1)}</b>], std=[<b>{keyStdev.toFixed(1)}</b>]). Key lineups:</li>,
        <ul key={"ul" + offOrDef + index}>
          {keyLineupHtml}
        </ul>,
        <li key={"peer" + offOrDef + index}>TODO {doPeerAnalysis(offOrDef)}</li>
      ]
    });

    return <ul>
      {infoHtml}
    </ul>;
  }

  return <span>
    {OnOffReportDiagUtils.getTitle(player, showHelp)}
    <ul>
      <li>Offensive analysis:</li>
      {buildInfo("off")}
      <li>Defensive analysis:</li>
      {buildInfo("def")}
    </ul>
    {expandedMode ?
      <span>For a more detailed analysis click here to view just this player.</span>
      : null
    }
  </span>;
}

export default RepOnOffDiagView;
