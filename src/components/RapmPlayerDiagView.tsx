// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Utils
import { RapmInfo, RapmPlayerContext, RapmPreProcDiagnostics, RapmProcessingInputs, RapmUtils } from "../utils/RapmUtils";

type Props = {
  rapmInfo: RapmInfo,
  player: Record<string, any>
};

const RapmPlayerDiagView: React.FunctionComponent<Props> = (({rapmInfo, player}) => {
  try {
    const ctx = rapmInfo.ctx;
    const offWeights = rapmInfo.offWeights.valueOf();
    const offInputs = rapmInfo.offInputs;
    const defInputs = rapmInfo.defInputs;

    const rapmOff = (player.rapm?.off_adj_ppp?.value || 0);
    const rapmDef = (player.rapm?.def_adj_ppp?.value || 0);
    const calcPriorDiags = () => {
      if (ctx.unbiasWeight > 0) {
        const totalOffPoss = ctx.teamInfo?.off_poss?.value;
        const teamOffAdj = ((ctx.teamInfo.off_adj_ppp?.value || ctx.avgEfficiency) - ctx.avgEfficiency);
        const teamDefAdj = ((ctx.teamInfo.def_adj_ppp?.value || ctx.avgEfficiency) - ctx.avgEfficiency);

        const col = ctx.playerToCol[player.playerId];
        const offPossPctStr = (100.0*(offWeights[ctx.numLineups][col]/ctx.unbiasWeight)).toFixed(0);

        const offPriorWeight = offInputs.solnMatrix ? offInputs.solnMatrix.valueOf()[col][ctx.numLineups] : 0.0;
        const defPriorWeight = offInputs.solnMatrix ? defInputs.solnMatrix.valueOf()[col][ctx.numLineups] : 0.0;

        const off = (offPriorWeight*(ctx.unbiasWeight*teamOffAdj));
        const def = (defPriorWeight*(ctx.unbiasWeight*teamDefAdj));

        return [
          off, def,
          <ul>
            <li>Currently calculated using players' % on floor, [<b>{offPossPctStr}%</b>] of [<b>{totalOffPoss}</b>] poss,
             and team's adj_off=[<b>{teamOffAdj.toFixed(1)}</b>], adj_def=[<b>{teamDefAdj.toFixed(1)}</b>]</li>
            <li><em>(Not exactly a prior - it's an additional strong observation that the weighted sum of the
             players' contributions is equal to the team's adjusted efficiency)</em></li>
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
          <li>Priors: off=[<b>{priorOff.toFixed(2)}</b>], def=[<b>{priorDef.toFixed(2)}</b>], total=[<b>{totalPrior.toFixed(2)}</b>]</li>
            {priorDiagListEl}
          <li>raw RAPM: off=[<b>{rawRapmOff.toFixed(2)}</b>], def=[<b>{rawRapmDef.toFixed(2)}</b>], total=[<b>{totalRawRapm.toFixed(2)}</b>]</li>
        </ul>
        (<b>More to come...</b>)
      </span>;
    }
    catch (err) { //Temp issue during reprocessing
        return <span>Recalculating diags, pending {err.message}</span>;
    }
});

export default RapmPlayerDiagView;
