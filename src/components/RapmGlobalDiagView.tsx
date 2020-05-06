// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Utils
import { RapmInfo, RapmPlayerContext, RapmPreProcDiagnostics, RapmProcessingInputs, RapmUtils } from "../utils/RapmUtils";

type Props = {
  rapmInfo: RapmInfo
  players: Array<Record<string, any>>
};

const RapmGlobalDiagView: React.FunctionComponent<Props> = (({rapmInfo, players}) => {
  if (rapmInfo.preProcDiags) try {
    const ctx = rapmInfo.ctx;

    const correlMatrix = rapmInfo.preProcDiags.correlMatrix;
    const tmpMatrixView = correlMatrix.valueOf().map((row: number[]) => row.map((n) => n.toFixed(2)).toString());

    //TODO: correlation between players
    //TODO: filtered out players
    //TODO: QA: collinearity
    //TODO: QA: choice of ridge regression

    return <section id="global-rapm-diags">
      <h4>Global RAPM Diagnostics View</h4>
      <h5>Player correlation table</h5>
      <span>{tmpMatrixView.map((n: any) => <span><span>{n}</span><br/></span>)}</span>
      <h5>Filtered out player diagnostics</h5>
      <li>TBD</li>
      <h5>Lineup collinearity diagnostics</h5>
      <li>TBD</li>
    </section>;

  }
  catch (err) { //Temp issue during reprocessing
      return <span>Recalculating diags, pending {err.message}</span>;
  } else {
    return <span>(Internal Logic Error: No Diags)</span>; //(only theoretically reachable)
  }
});

export default RapmGlobalDiagView;
