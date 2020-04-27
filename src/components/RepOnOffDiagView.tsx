// React imports:
import React, { useState } from 'react';

// Lodash
import _ from "lodash";

// Next imports:
import { NextPage } from 'next';

// Utils
// @ts-ignore
import { mean, std } from "mathjs";

type Props = {
  diagInfo: Array<any>,
  player: Record<string, any>,
  expandedMode: boolean
};

const RepOnOffDiagView: React.FunctionComponent<Props> = ({diagInfo, player, expandedMode}) => {

  const doAnalysis = (offOrDef: "off" | "def", dir: 1 | -1) => {
    const field = `${offOrDef}AdjEff`;
    const lineups = diagInfo.filter(
      (lineupPlusDiag) => ((lineupPlusDiag.contrib as any)[field] || 0)*dir < 0
    );
    const contribs = lineups.map((lineupPlusDiag) => ((lineupPlusDiag.contrib as any)[field] || 0));
    const sumContrib = _.sum(contribs)
    const meanContrib: any = mean(contribs);
    const stdevContrib: any = std(contribs);
    return [
      _.chain(lineups).filter( // has to be > 1x stdev
        (lineupPlusDiag) => Math.abs(((lineupPlusDiag.contrib as any)[field] || 0) - meanContrib) > 1*stdevContrib
      ).filter( // only care about 1 direction
        (lineupPlusDiag) => (dir == -1) == (((lineupPlusDiag.contrib as any)[field] || 0) > meanContrib)
      ).sortBy(
        [ (lineupPlusDiag) => dir*((lineupPlusDiag.contrib as any)[field] || 0) ]
      ).take(5).map((lineupPlusDiag, i) => {
        const possField = `${offOrDef}TotalPoss`;
        return <li key={"" + i}>
          <a href="#">{lineupPlusDiag.keyArray.join(" / ")}</a>:
          &nbsp;weighted_contrib=[<b>{((lineupPlusDiag.contrib as any)[field] || 0).toFixed(2)}</b>]
          &nbsp;poss_weight=[<b>{(100*((lineupPlusDiag.contrib as any)[possField] || 0)).toFixed(1)}%</b>]
        </li>
      }).value(),
      sumContrib, meanContrib, stdevContrib, contribs.length
    ];
  }

  const buildInfo = (onOrOff: "off" | "def") => {

    const infoHtml = _.flatMap([ -1, 1 ], (dir: 1 | -1) => {
      const [
        keyLineupHtml, keySum, keyMean, keyStdev, keyLength
      ] = doAnalysis(onOrOff, dir);

      const goodOrBad = (dir > 0) == (onOrOff == "off") ? "Bad" : "Good";

      return [
        <li>[<b>{keyLength}</b>] {goodOrBad} "Same-4"s, total [<b>{keySum.toFixed(1)}</b>] (mean [<b>{keyMean.toFixed(1)}</b>], std [<b>{keyStdev.toFixed(1)}</b>]). Key lineups:</li>,
        <ul>
          {keyLineupHtml}
        </ul>
      ]
    });

    return <ul>
      {infoHtml}
    </ul>;
  }

  return <span>
    <b>Replacement 'On-Off' diagnostics for [{player.playerId}]:</b>
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
