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
        <li>Currently calculated from poss [<b>{offPossPctStr}%</b>] of [<b>{totalOffPoss}</b>]
         and team's adj_off=[<b>{teamOffAdj.toFixed(1)}</b>], adj_def=[<b>{teamDefAdj.toFixed(1)}</b>]</li>
      ];

    } else {
      return [ 0, 0, <li>Not currently supported</li> ]; //(not currently supported)
    }
  };
  const [ priorOff, priorDef, priorDiagListEl ] = calcPriorDiags() as [ number, number, Element ];
  const totalPrior = priorOff - priorDef;
  const rawRapmOff = rapmOff - priorOff;
  const rawRapmDef = rapmDef - priorDef;
  const totalRawRapm = rawRapmOff - rawRapmDef;

  return <span>
      <b>RAPM diagnostics for [{player.playerId}]: adj_off=[{rapmOff.toFixed(2)}], adj_def=[{rapmDef.toFixed(2)}]</b>
      <ul>
        <li>Priors: off=[<b>{priorOff.toFixed(2)}</b>], def=[<b>{priorDef.toFixed(2)}</b>], total=[<b>{totalPrior.toFixed(2)}</b>]</li>
        <ul>
          {priorDiagListEl}
        </ul>
        <li>raw RAPM: off=[<b>{rawRapmOff.toFixed(2)}</b>], def=[<b>{rawRapmDef.toFixed(2)}</b>], total=[<b>{totalRawRapm.toFixed(2)}</b>]</li>
      </ul>
      (<a href="#">Show details</a>)
    </span>;
});

export default RapmPlayerDiagView;
