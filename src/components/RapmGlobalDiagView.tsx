// React imports:
import React, { useState } from 'react';

import _ from "lodash";

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable";

// Utils
import { RapmInfo, RapmPlayerContext, RapmPreProcDiagnostics, RapmProcessingInputs, RapmUtils } from "../utils/RapmUtils";
import { CbbColors } from "../utils/CbbColors";

type Props = {
  rapmInfo: RapmInfo
  players: Array<Record<string, any>>,
  topRef: React.RefObject<HTMLDivElement>,
};

const RapmGlobalDiagView: React.FunctionComponent<Props> = (({rapmInfo, players, topRef}) => {
  if (rapmInfo.preProcDiags) try {
    const ctx = rapmInfo.ctx;
    const gotoTop = () => {
      if (topRef.current) {
        topRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };

    // Player correlation matrix

    // Table defs:
    const playerInitials = (player: string) => {
      const tmp = player.replace(/[^A-Z]/g, "")
      return tmp[tmp.length - 1] + tmp[0];
    };
    const correlTableFields = {
      "title": GenericTableOps.addTitle("", ""),
      "sep0": GenericTableOps.addColSeparator(),
      ...(
        _.fromPairs(ctx.colToPlayer.map((p: string) => {
          const initials = playerInitials(p);
          const description = `Correlations for "${p}"`;
          return [ initials,
            GenericTableOps.addPctCol(initials, description, CbbColors.varPicker(CbbColors.rapmCorrel))
          ];
        }))
      )
    };
    // Table data:
    const tmpCorrelMatrix = rapmInfo.preProcDiags.correlMatrix.valueOf();
    const correlTableData = ctx.colToPlayer.map((p: string, i: number) => {
      return GenericTableOps.buildDataRow({
        title: p,
        ...(
          _.fromPairs(tmpCorrelMatrix[i].map((n: number, j: number) => i != j ? [
            playerInitials(ctx.colToPlayer[j]), { value: n }
          ]: [ "", 0 ]).filter((kv: [string, number]) => kv[1] != 0))
        )
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta);
    });

    // Player removal

    const playerThreshold = ctx.removalPct;
    const playerRemovalTidy = (playerList: Array<[string, [number, number]]>, phase: "p1" | "p2") => {
      return _.sortBy(
        playerList, [ (playerPoss: [string, [number, number]]) => -playerPoss[1][0] ]
      ).map((playerPoss: [string, [number, number]]) => {
        const extra = (phase == "p1") ? "" : `->[${(100*playerPoss[1][1]).toFixed(1)}%]`
        return `"${playerPoss[0]}" [${(100*playerPoss[1][0]).toFixed(1)}%]${extra}`;
      });
    };
    const tmpRemovedPlayersPhase1 = playerRemovalTidy(
      _.toPairs(ctx.removedPlayers).filter((playerPoss: [string, [number, number]]) =>
        playerPoss[1][0] <= ctx.removalPct
    ), "p1");
    const tmpRemovedPlayersPhase2 = playerRemovalTidy(
      _.toPairs(ctx.removedPlayers).filter((playerPoss: [string, [number, number]]) =>
        playerPoss[1][0] > ctx.removalPct
    ), "p2");

    // Collinearity analysis

    // Some helper methods:
    const lineupCombos = rapmInfo.preProcDiags.lineupCombos;
    const collinCol = (index: number) => `LC${index + 1}`;
    const collinColDef = (index: number) => `Linear combination of lineups ${index + 1}`;

    // Table defs
    const collinTableFields_Base = {
      "title": GenericTableOps.addTitle("", ""),
      "sep0": GenericTableOps.addColSeparator(),
    };
    const collinTableFields_CondIndices = _.merge(_.clone(collinTableFields_Base),
      _.fromPairs(lineupCombos.map((n: number, index: number) =>
        [ collinCol(index),
          GenericTableOps.addPtsCol(collinCol(index), collinColDef(index), CbbColors.varPicker(CbbColors.rapmCollinLineup, 0.01))
        ]
      ))
    );
    const collinTableFields = _.merge(_.clone(collinTableFields_Base),
      _.fromPairs(lineupCombos.map((n: number, index: number) =>
        [ collinCol(index),
          GenericTableOps.addPctCol(collinCol(index), collinColDef(index), CbbColors.varPicker(CbbColors.rapmCollinPlayer, n*0.01))
        ]
      ))
    );
    // Table vals:
    const condIndicesTitle = `"RAPM Impact"`;
    const buildCollinRow = (row: number[], title: string) => {
      return GenericTableOps.buildDataRow(_.fromPairs(row.map((n: number, index: number) =>
          [ collinCol(index), { value: n } ] as [ string, any ]
        ).concat(title ? [ [ "title", title ] ] : [])),
        GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta,
        title != condIndicesTitle ? undefined : collinTableFields_CondIndices
      )
    };
    const collinTableData = [ buildCollinRow(lineupCombos, condIndicesTitle) ].concat(
      _.toPairs(rapmInfo.preProcDiags.playerCombos).map((pRow: [ string, number[] ]) => {
        return buildCollinRow(pRow[1], pRow[0]);
      })
    );

    return <section>
      <h4>Global RAPM Diagnostics View</h4>

      <h5>Player correlation table</h5>
      <span><em>
        <ul>
          <li>Shows the <a target="_blank" href="https://en.wikipedia.org/wiki/Pearson_correlation_coefficient">Pearson Correlation Coefficient</a>
          &nbsp;between any two players. This can be thought of as "how similar would the changes be to the two players' RAPMs from a random change in the lineup stats?"</li>
          <ul>
            <li>(eg 100%: the changes would be proportional to each other; 0%: the changes would be unrelated to each other)</li>
          </ul>
        </ul>
      </em></span>
      <Container>
        <Col xs={8}>
          <GenericTable tableCopyId="correlDiags" tableFields={correlTableFields} tableData={correlTableData}/>
        </Col>
      </Container>

      <h5>Filtered-out player diagnostics</h5>
      {tmpRemovedPlayersPhase1.length > 0 ? <span>
        <li>Players starting with too few possessions (threshold [<b>{(playerThreshold*100).toFixed(1)}%</b>]):</li>
        <ul>
          <li>{tmpRemovedPlayersPhase1.join(";")}</li>
        </ul>
      </span> : <span><li>No players filtered out based on possession % (threshold [<b>{(playerThreshold*100).toFixed(1)}%</b>])</li></span>}
      {tmpRemovedPlayersPhase2.length > 0 ? <span>
        <li>Players who have too few possessions after filtering out other players:</li>
        <ul>
          <li>{tmpRemovedPlayersPhase2.join("; ")}</li>
        </ul>
      </span> : null }

      <h5>Lineup collinearity diagnostics</h5>
      <span><em>
        <ul>
        <li>In the context of RAPM, "lineup collinearity" means that players are in such a similar combination of lineups that
        it is hard for the math to distinguish correctly between their contributions. The more "collinear" the lineups are,
        the more sensitive the raw RAPM is to small changes in lineup stats, and therefore the more aggressive the regression toward the "prior estimates" needs to be.</li>

        <li>In the table below, each "LC" is a combination of lineups, and the first row a measure of its impact on the raw RAPM.
        For each "LC" we show a % for each player indicating how much they are affected by the collinearity of that combination.</li>
        </ul>
      </em></span>
      <Container>
        <Col xs={8}>
          <GenericTable tableCopyId="collinDiags" tableFields={collinTableFields} tableData={collinTableData}/>
        </Col>
      </Container>
      <span><em>
        <ul>
        <li>A good rule of thumb is that an "impact" of <b>15-30</b> is slightly worrying, from <b>30-100+</b> increasingly problematic.
        For a problematic "LC", a player score of <b>50%</b> onwards indicates an increasing unreliability of their raw RAPM share with other affected players.</li>
        <li>(For a purely mathematical explanation see bullet 6 of <a target="_blank" href="https://en.wikipedia.org/wiki/Multicollinearity#Detection_of_multicollinearity">this section of the wiki article.</a>)</li>
        </ul>
      </em></span>
      (<a href="#" onClick={(event) => { event.preventDefault(); gotoTop() }}>Scroll back to the top</a>)
    </section>;

  }
  catch (err) { //Temp issue during reprocessing
    return <span>Recalculating diags, pending [{err.message}]</span>;
  } else {
    return <span>(Internal Logic Error: No Diags)</span>; //(only theoretically reachable)
  }
});

export default RapmGlobalDiagView;
