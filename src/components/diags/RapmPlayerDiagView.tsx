// React imports:
import React, { useState } from 'react';

import _ from "lodash";

// Next imports:
import { NextPage } from 'next';

// Utils
import { RapmInfo, RapmPlayerContext, RapmPreProcDiagnostics, RapmProcessingInputs, RapmUtils } from "../../utils/stats/RapmUtils";

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

    const col = ctx.playerToCol[player.playerId];

    const totalOffPoss = ctx.teamInfo?.off_poss?.value;
    const teamOffAdj = ((ctx.teamInfo.off_adj_ppp?.value || ctx.avgEfficiency) - ctx.avgEfficiency);
    const teamDefAdj = ((ctx.teamInfo.def_adj_ppp?.value || ctx.avgEfficiency) - ctx.avgEfficiency);

    const offPoss = offInputs.playerPossPcts[col]!;
    const defPoss = defInputs.playerPossPcts[col]!;
    const offPossPctStr = (100.0*(offInputs.playerPossPcts[col]!)).toFixed(0);

    // Prior (luck adjusted o/drtg)
    const offPrior = ctx.priorInfo.playersWeak?.[col]?.off_adj_ppp || 0;
    const defPrior = ctx.priorInfo.playersWeak?.[col]?.def_adj_ppp || 0;

    const offUnbiasRapm = offInputs.rapmRawAdjPpp[col];
    const defUnbiasRapm = defInputs.rapmRawAdjPpp[col];

    const buildPrior = (input: RapmProcessingInputs) => {
      const vec = input.rapmRawAdjPpp;
      return _.reduce(vec, (acc, n: number, i: number) => acc + n*input.playerPossPcts[i]!) || 0
    };
    const [ sigmaRapmOff, sigmaRapmDef ]  = [ buildPrior(offInputs), buildPrior(defInputs) ];
    const offPriorTotalDiff = teamOffAdj - sigmaRapmOff;
    const defPriorTotalDiff = teamDefAdj - sigmaRapmDef;
    const offPriorContrib = rapmOff - offUnbiasRapm;
    const defPriorContrib = rapmDef - defUnbiasRapm;

    const detailedInfo = <ul>
      <li>We calculate the total team prior (off=[<b>{offPriorTotalDiff.toFixed(2)}</b>] def=[<b>{defPriorTotalDiff.toFixed(2)}</b>]) from
      the delta between total adjusted efficiency and RAPM, due to the regression factor: eg compare <em>observed</em> (off=[<b>{teamOffAdj.toFixed(2)}</b>] def=[<b>{teamDefAdj.toFixed(2)}</b>])
      vs <em>derived solely from RAPM</em> (off=[<b>{sigmaRapmOff.toFixed(2)}</b>] def=[<b>{sigmaRapmDef.toFixed(2)}</b>]).
      </li>
      <li>Then we calculate a player's contribution to the team prior - currently this is a multiple of
      "Adj Rtg+" ("adjusted production above D1 average"; off=[<b>{offPrior.toFixed(2)}</b>] def=[<b>{defPrior.toFixed(2)}</b>]),
      <li>
      chosen so that a minutes-weighted average of the ratings sums to the team prior: off=[<b>{offPriorContrib.toFixed(2)}</b>], def=[<b>{defPriorContrib.toFixed(2)}</b>]
        <ul>
        <li>
        <em> (eg incorporating the % on floor [<b>{offPossPctStr}%</b>] (of [<b>{totalOffPoss}</b>] poss,
           this is an off=[<b>{(offPriorContrib*offPoss).toFixed(2)}</b>] def=[<b>{(defPriorContrib*defPoss).toFixed(2)}</b>]
          "slice" of the team prior of off=[<b>{offPriorTotalDiff.toFixed(2)}</b>] def=[<b>{defPriorTotalDiff.toFixed(2)}</b>])</em>
        </li>
        </ul>
      </li>
      </li>
    </ul>;

    const totalPrior = offPriorContrib - defPriorContrib;
    const totalRawRapm = offUnbiasRapm - defUnbiasRapm;

    return <span>
        <b>RAPM diagnostics for [{player.playerId}]:</b> adj_off=[<b>{rapmOff.toFixed(2)}</b>], adj_def=[<b>{rapmDef.toFixed(2)}</b>] =
        <ul>
          <li>Raw RAPM contribution: off=[<b>{offUnbiasRapm.toFixed(2)}</b>], def=[<b>{defUnbiasRapm.toFixed(2)}</b>], total=[<b>{totalRawRapm.toFixed(2)}</b>]</li>
          <li>&nbsp;+ Priors' contribution: off=[<b>{offPriorContrib.toFixed(2)}</b>], def=[<b>{defPriorContrib.toFixed(2)}</b>], total=[<b>{totalPrior.toFixed(2)}</b>]</li>
            {detailedInfo}
        </ul>
        (<b>More player diagnostics to come...</b>)<br/>(<a href="#" onClick={(event) => { event.preventDefault(); gotoGlobalDiags() }}>Scroll to global RAPM diagnostics</a>)
      </span>;
    }
    catch (err) { //Temp issue during reprocessing
      return <span>Recalculating diags, pending {err.message}</span>;
    }
});

export default RapmPlayerDiagView;
