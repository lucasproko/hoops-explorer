
// Lodash:
import _ from "lodash";

// Other app utils
import { LineupUtils } from "./LineupUtils";

// Math utils
// @ts-ignore
import { SVD } from 'svd-js'
// @ts-ignore
import { multiply, add, inv, sum, apply, transpose, matrix, zeros, identity } from 'mathjs'

/** Useful intermediate results */
export type RapmPlayerContext = {
  /** The column corresponding to the player */
  playerToCol: Record<string, number>;
  /** The player name in each column */
  colToPlayer: Array<string>;
  /** A shallow copy of the lineups, minus ones with removed player or no off/def possessions */
  filteredLineups: Array<any>,
  /** An aggregated view of filteredLineups */
  teamInfo: Record<string, any>,

  // Handy counts:
  numPlayers: number;
  numLineups: number;
  offLineupPoss: number;
  defLineupPoss: number;
};

/** Holds the multi-collinearity info */
export type RapmDiagnostics = {
  lineupCombos: Array<number>;
  playerCombos: Record<string, Array<number>>
};

/** Wrapper for some math to calculate RAPM and its various artefacts */
export class RapmUtils {

  // 1] INITIALIZATION LOGIC

  /**
  * Builds a context object with functionality required by further processing
  * removalPct - the min% (eg 10%) of possessions a player must have
  */
  static buildPlayerContext(
    players: Array<any>,
    lineups: Array<any>,
    removalPct: number
  ): RapmPlayerContext {
    // The static threshold for removing players
    // (who do more harm than good)
    // (2x to approximate checking both offense and defense)
    const totalLineups = players?.[0]?.on?.off_poss?.value || 0;
    const removalThreshold = 2*removalPct*totalLineups;
    // Filter out players with too few possessions
    var checkForPlayersToRemove = true; //(always do the full processing loop once)
    var currFilteredLineupSet = [];
    const removedPlayersSet: Record<string, number> = {};
    const playerPossessionCountTracker: Record<string, number> = {};
    while (checkForPlayersToRemove) {
      _.chain(players).filter((p: any) => !p.rapmRemove).forEach((p: any) => {
        const playerId = p.playerId as string || "";
        if (_.isNil(playerPossessionCountTracker[playerId])) {
          //(first time through, fill in the player possession tracker)
          playerPossessionCountTracker[playerId] =
            (p.on?.off_poss?.value || 0) + (p.on?.def_poss?.value || 0);
        }
        if (playerPossessionCountTracker[playerId] < removalThreshold) {
          p.rapmRemove = true; //(temp flag for peformance in this loop)
          removedPlayersSet[playerId] = playerPossessionCountTracker[playerId];
          checkForPlayersToRemove = true;
        }
      }).value();
      if (checkForPlayersToRemove) { //(always go through this first time)
        checkForPlayersToRemove = false; //(won't need to rerun unless we remove any new lineups)

        // Now need to go through lineups, remove them
        currFilteredLineupSet = _.chain(lineups).filter((l: any) => !l.rapmRemove).flatMap((l: any) => {
          // THIS FLATMAP HAS SIDE-EFFECTS

          const lineupPlayers = l?.players_array?.hits?.hits?.[0]?._source?.players || [];
          const shouldRemoveLineup =
            _.find(lineupPlayers, (p: any) => !_.isNil(removedPlayersSet[p.id as string])) //contains removed players
            ||
            (!l.off_poss?.value || !l.def_poss?.value); // only take lineup combos with both off and def combos

          if (shouldRemoveLineup) {
            l.rapmRemove = true; //(temp flag for peformance in this loop)
            const lineupPossCount = (l.off_poss?.value || 0) + (l.def_poss?.value || 0);
            // Loop over all the players, remove the lineup possessions from their counter
            _.chain(lineupPlayers).forEach((lp: any) => {
              playerPossessionCountTracker[lp.id as string] =
                (playerPossessionCountTracker[lp.id as string] || 0) - lineupPossCount;
            }).value();
            checkForPlayersToRemove = true;
          }
          return l.rapmRemove ? [] : [ l ];
        }).value();
      }
    }
    // Calculate the aggregated team stats
    const teamInfo = LineupUtils.calculateAggregatedLineupStats(lineups);

    const sortedPlayers = _.chain(playerPossessionCountTracker).toPairs().filter((kv) => {
      return !removedPlayersSet.hasOwnProperty(kv[0]);
    }).sortBy(kv => -kv[1]).map((kv) => kv[0]).value();

    return {
      playerToCol: _.chain(sortedPlayers).map((playerId, index) => {
        return [ playerId, index ]
      }).fromPairs().value()
      ,
      colToPlayer: sortedPlayers
      ,
      filteredLineups: currFilteredLineupSet
      ,
      teamInfo: teamInfo
      ,
      numPlayers: sortedPlayers.length,
      numLineups: currFilteredLineupSet.length,
      offLineupPoss: teamInfo.off_poss?.value || 0,
      defLineupPoss: teamInfo.def_poss?.value || 0
    };
  }

  /** Calculates the weights and returns 2 matrices, one for off */
  static calcPlayerWeights(
    ctx: RapmPlayerContext
  ) {
    // Build a matrix of the right size:
    const offWeights = zeros(ctx.numLineups, ctx.numPlayers);
    const defWeights = zeros(ctx.numLineups, ctx.numPlayers);

    // Fill it in with the players
    const populateMatrix = (inMatrix: any, prefix: "off" | "def") => {
      ctx.filteredLineups.forEach((lineup, index) => {
        const possCount = (lineup as any)[`${prefix}_poss`]?.value || 0;
        const inPlayers = lineup?.players_array?.hits?.hits?.[0]?._source?.players || [];
        const lineupRow = inMatrix.valueOf()[index];
        const lineupPossCount = ((ctx as any)[`${prefix}LineupPoss`] || 1);
        const possCountWeight = Math.sqrt(possCount/lineupPossCount);
        inPlayers.forEach((player: any) => {
          const playerIndex = ctx.playerToCol[player.id];
          if (playerIndex >= 0) {
            lineupRow[playerIndex] = possCountWeight;
          } //(else this player is filtered out so ignore)
        });
      });
    };
    populateMatrix(offWeights, "off");
    populateMatrix(defWeights, "def");

    return [ offWeights, defWeights ];
  }

  static calcPlayerOutputs(
    lineups: Array<any>,
    field: string, offset: number,
    ctx: RapmPlayerContext,
  ) {
    const calculateVector = (prefix: "off" | "def") => {
      return lineups.map((lineup: any) => {
        const possCount = (lineup as any)[`${prefix}_poss`]?.value || 0;
        const lineupPossCount = ((ctx as any)[`${prefix}LineupPoss`] || 1);
        const possCountWeight = Math.sqrt(possCount/lineupPossCount);
        const val = (lineup as any)[`${prefix}_${field}`]?.value || 0;
        return (val - offset)*possCountWeight;
      });
    };
    return [
      calculateVector("off"), calculateVector("def")
    ];
  }

  // 2] PROCESSING

  static slowRegression(
    playerWeightMatrix: any,
    ridgeLambda: number,
    ctx: RapmPlayerContext
  ) {
    // Note ridgeLambdas from similar work of 2K is without col normalization
    // So instead of each row of XtX having "length" Nstint^2 it has "length"
    // 1, so we should reduce the lambda by the same amount (assuming each stint is 5 possessions on average)
    const factor = (ctx.numLineups*ctx.numLineups)/25;

    const playerWeightMatrixT = transpose(playerWeightMatrix)
    const bottom = add(
      multiply(playerWeightMatrixT, playerWeightMatrix),
      multiply(ridgeLambda/factor, identity(ctx.numPlayers))
    );
    const bottomInv = inv(bottom);
    return multiply(
      bottomInv, playerWeightMatrixT
    );
  }

  static calculateRapm(
    regressionMatrix: any,
    playerOutputs: Array<number>
  ) {
    const out = transpose(matrix(playerOutputs));
    return transpose(multiply(regressionMatrix, out)).valueOf();
  }

  // 3] ERROR VALIDATION

  static calcSlowPseudoInverse(
    playerWeightMatrix: any,
    ridgeLambda: number,
    ctx: RapmPlayerContext
  ) {
    // Note ridgeLambdas from similar work of 2K is without col normalization
    // So instead of each row of XtX having "length" Nstint^2 it has "length"
    // 1, so we should reduce the lambda by the same amount (assuming each stint is 5 possessions on average)
    const factor = (ctx.numLineups*ctx.numLineups)/25;

    const playerWeightMatrixT = transpose(playerWeightMatrix)
    const bottom = add(
      multiply(playerWeightMatrixT, playerWeightMatrix),
      multiply(ridgeLambda/factor, identity(ctx.numPlayers))
    );
    const bottomInv = inv(bottom).valueOf();
    return _.range(0, ctx.numPlayers).map((i) => Math.sqrt(bottomInv[i][i]));
  }

  static calculatePredictedOut(
    playerWeightMatrix: any,
    regressedPlayers: Array<any>,
    ctx: RapmPlayerContext
  ) {
    return transpose(
      multiply(playerWeightMatrix, transpose(matrix(regressedPlayers)))
    ).valueOf();
  }

  static calculateResidualError(
    playerOuts: Array<any>,
    regressedOuts: Array<any>,
    ctx: RapmPlayerContext
  ) {
    return _.reduce(
      _.zip(playerOuts, regressedOuts),
      (sum, ab: Array<number>) => sum + (ab[0] - ab[1])**2,
      0
    );
  }

  // 4] DIAGNOSTIC PROCESSING

  //TODO: Pearsson correlation matrix between players

  /** Looks for multi-collinearity conditions between players
      The cond index ("lineup combo") is 0-10 == safe, 10-30 == OKish, 30 - 100 problem
      With players 0.5+ is concerning (up to the max concern of the lineup combo)

      Note will throw if there are too few lineups
  */
  static calcCollinearityDiag(
    weightMatrix: any,
    ctx: RapmPlayerContext
  ): RapmDiagnostics {
    const debugMode = false;

    if (debugMode) {
      console.log(`in=[${JSON.stringify(weightMatrix.valueOf(), null, 3)}]`);
    }

    // Algorithm inferred from https://github.com/brian-lau/colldiag/blob/master/colldiag.m
    // (test using https://www.mathworks.com/help/matlab/ref/double.svd.html)

    // SVD
    const { v, q } = SVD(weightMatrix.valueOf(), false);

    if (debugMode) {
      console.log(`q=[${q}], v=[${JSON.stringify(v, null ,3)}]`);
    }

    const sortedQWithIndex = _.chain(q).zip(_.range(0, ctx.numPlayers)).sortBy([(zip) => zip[0]]).value();

    if (debugMode) {
      console.log(`sort(q_i)=[${JSON.stringify(sortedQWithIndex)}]`);
    }

    // Ratio of largest singular value to all singular values
    const largestEig = sortedQWithIndex[q.length - 1][0];

    const condIndicesWithIndex = sortedQWithIndex.filter(zip => zip[0] > 0).map((zip: Array<number>) => {
      return [ largestEig/zip[0], zip[1] ];
    });

    if (debugMode) {
      console.log(`cond_ind=[${JSON.stringify(condIndicesWithIndex)}]`);
    }

    // variance decomposition proportions
    const lambdaInvArray = q.map((eig: number) => {
      const eigRatioSq = eig > 0 ? 1.0/(eig*eig) : 0;
      return eigRatioSq;
    });

    if (debugMode) {
      console.log(`1/lambdaSq=[${JSON.stringify(lambdaInvArray)}]`);
    }

    const vMatrix = matrix(v);
    const vMatrixT = transpose(vMatrix);
    const phiMatrix = matrix(vMatrixT.valueOf().map((row: Array<number>, index: number) => {
      const lambda = lambdaInvArray[index];
      return row.map((val: number) => val*val*lambda);
    }));
    const phiMatrixInvSumArray = apply(phiMatrix, 0, sum).valueOf().map((val: number) => 1.0/val);

    if (debugMode) {
      console.log(`phi=[${JSON.stringify(phiMatrix.valueOf(), null, 3)}]`);
      console.log(`1/col_sum(phi)=[${JSON.stringify(phiMatrixInvSumArray)}]`);
    }

    const vdpMatrix = matrix(phiMatrix.valueOf().map((row: Array<number>) => {
      return row.map((val: number, index: number) => val*phiMatrixInvSumArray[index]);
    }));
    const vdpRaw = vdpMatrix.valueOf();

    if (debugMode) {
      console.log(`vdp=[${JSON.stringify(vdpRaw)}]`)
    }

    // Now build an actual player/lineup specific construct

    // the result of all the matrix stuff is like: (descending sorted)
    // (C_I) ... player[0] ............ player[n]
    // C_I_0 ... VDP_RAW[s(0), 0], ..., VDP_RAW[s(0), n]
    // C_I_1 ... VDP_RAW[s(1), 0], ..., VDP_RAW[s(1), n]
    // ...
    // For the output, we're going to transpose that, ie:
    // player[0]: [  VDP_RAW[s(0), 0], ..., VDP_RAW[s(N), 0] ]

    const condIndicesSortedIndex = condIndicesWithIndex.map((zip) => zip[1]);
    return {
      lineupCombos: condIndicesWithIndex.map((zip) => zip[0]),
      playerCombos: _.chain(ctx.colToPlayer).map((player, playerIndex) => {
        return [player, condIndicesSortedIndex.map((lineupComboIndex) => {
          return vdpRaw[lineupComboIndex][playerIndex];
        })]
      }).fromPairs().value()
    };
  }


}
