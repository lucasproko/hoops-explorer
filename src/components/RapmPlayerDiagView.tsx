// React imports:
import React, { useState } from 'react';

import _ from "lodash";

// Next imports:
import { NextPage } from 'next';

// Utils
import { RapmInfo, RapmPlayerContext, RapmPreProcDiagnostics, RapmProcessingInputs, RapmUtils } from "../utils/stats/RapmUtils";

type Props = {
  rapmInfo: RapmInfo,
  player: Record<string, any>,
  globalRef: React.RefObject<HTMLDivElement>
};

const RapmPlayerDiagView: React.FunctionComponent<Props> = (({rapmInfo, player, globalRef}) => {
  try {
    const ctx = rapmInfo.ctx;
    const offWeights = rapmInfo.offWeights.valueOf();
    const offInputs = rapmInfo.offInputs;
    const defInputs = rapmInfo.defInputs;

    const gotoGlobalDiags = () => {
      if (globalRef.current) {
        globalRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };

    const rapmOff = (player.rapm?.off_adj_ppp?.value || 0);
    const rapmDef = (player.rapm?.def_adj_ppp?.value || 0);
    const calcPriorDiags = () => {
      if (ctx.unbiasWeight > 0) {
        const totalOffPoss = ctx.teamInfo?.off_poss?.value;
        const teamOffAdj = ((ctx.teamInfo.off_adj_ppp?.value || ctx.avgEfficiency) - ctx.avgEfficiency);
        const teamDefAdj = ((ctx.teamInfo.def_adj_ppp?.value || ctx.avgEfficiency) - ctx.avgEfficiency);

        const col = ctx.playerToCol[player.playerId];
        const offPossPcts = offWeights[ctx.numLineups]; //(use as approx for def also)
        const offPossPctStr = (100.0*(offPossPcts[col]/ctx.unbiasWeight)).toFixed(0);

        const [ sigmaRapmOff, sigmaRapmDef ] = rapmInfo?.noUnbiasWeightsDiags?.map((vec) =>
          _.reduce(vec, (acc, n: number, i: number) => acc + n*offPossPcts[i]/ctx.unbiasWeight) || 0
        ) || [0, 0];
        const offPriorTotalDiff = teamOffAdj - sigmaRapmOff;
        const defPriorTotalDiff = teamDefAdj - sigmaRapmDef;

        const [ offUnbiasRapm, defUnbiasRapm ] = rapmInfo?.noUnbiasWeightsDiags?.map((vec) => vec[col]) || [0, 0];
        const offPrior = rapmOff - offUnbiasRapm;
        const defPrior = rapmDef - defUnbiasRapm;

        return [
          offPrior, defPrior,
          <ul>
            <li>We calculate the total team priors (off=[<b>{offPriorTotalDiff.toFixed(2)}</b>] def=[<b>{defPriorTotalDiff.toFixed(2)}</b>]) from
            the reduction in the team adjusted efficiency due to the regression factor, eg compare <em>observed</em> (off=[<b>{teamOffAdj.toFixed(2)}</b>] def=[<b>{teamDefAdj.toFixed(2)}</b>])
            vs <em>derived from RAPM</em> (off=[<b>{sigmaRapmOff.toFixed(2)}</b>] def=[<b>{sigmaRapmDef.toFixed(2)}</b>]).
            </li>
            <li>Then we calculate a player's contribution to the team prior - currently this is mostly based on their % on floor, [<b>{offPossPctStr}%</b>] (of [<b>{totalOffPoss}</b>] poss);
            eg for the offense approximately [<b>{offPossPctStr}%</b>] * (1/5) * [<b>{offPriorTotalDiff.toFixed(2)}</b>] = [<b>{(0.2*offPossPcts[col]*offPriorTotalDiff/ctx.unbiasWeight).toFixed(2)}</b>],
            plus some smaller lineup adjustments.
            </li>
          </ul>
        ];

      } else {
        return [ 0, 0, <ul><li>Not currently supported</li></ul> ]; //(not currently supported)
      }
    };
    const [ priorOff, priorDef, priorDiagListEl ] = calcPriorDiags() as [ number, number, Element ];
    const totalPrior = priorOff - priorDef;
    const rawRapmOff = rapmOff - priorOff;
    const rawRapmDef = rapmDef - priorDef;
    const totalRawRapm = rawRapmOff - rawRapmDef;

    return <span>
        <b>RAPM diagnostics for [{player.playerId}]:</b> adj_off=[<b>{rapmOff.toFixed(2)}</b>], adj_def=[<b>{rapmDef.toFixed(2)}</b>]
        <ul>
          <li>RAPM contribution: off=[<b>{rawRapmOff.toFixed(2)}</b>], def=[<b>{rawRapmDef.toFixed(2)}</b>], total=[<b>{totalRawRapm.toFixed(2)}</b>]</li>
          <li>Priors contribution: off=[<b>{priorOff.toFixed(2)}</b>], def=[<b>{priorDef.toFixed(2)}</b>], total=[<b>{totalPrior.toFixed(2)}</b>]</li>
            {priorDiagListEl}
        </ul>
        (<b>More player diagnostics to come...</b>)<br/>(<a href="#" onClick={(event) => { event.preventDefault(); gotoGlobalDiags() }}>Scroll to global RAPM diagnostics</a>)
      </span>;
    }
    catch (err) { //Temp issue during reprocessing
      return <span>Recalculating diags, pending {err.message}</span>;
    }
});

export default RapmPlayerDiagView;
