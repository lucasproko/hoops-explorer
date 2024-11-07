// React imports:
import React, { useState } from "react";

import _ from "lodash";

// Next imports:
import { NextPage } from "next";

// Utils
import {
  RapmInfo,
  RapmPlayerContext,
  RapmPreProcDiagnostics,
  RapmProcessingInputs,
  RapmUtils,
} from "../../utils/stats/RapmUtils";
import { PlayerOnOffStats } from "../../utils/stats/LineupUtils";

type Props = {
  rapmInfo: RapmInfo;
  player: PlayerOnOffStats;
  globalRef: React.RefObject<HTMLDivElement>;
};

const RapmPlayerDiagView: React.FunctionComponent<Props> = ({
  rapmInfo,
  player,
  globalRef,
}) => {
  try {
    const ctx = rapmInfo.ctx;
    const offWeights = rapmInfo.offWeights.valueOf();
    const offInputs = rapmInfo.offInputs;
    const defInputs = rapmInfo.defInputs;

    const gotoGlobalDiags = () => {
      if (globalRef.current) {
        globalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    const rapmOff = player.rapm?.off_adj_ppp?.value || 0;
    const rapmDef = player.rapm?.def_adj_ppp?.value || 0;

    const col = ctx.playerToCol[player.playerId];

    const totalOffPoss = ctx.teamInfo?.off_poss?.value || 0;
    const teamOffAdj =
      (ctx.teamInfo.all_lineups?.off_adj_ppp?.value || ctx.avgEfficiency) -
      ctx.avgEfficiency;
    const teamDefAdj =
      (ctx.teamInfo.all_lineups?.def_adj_ppp?.value || ctx.avgEfficiency) -
      ctx.avgEfficiency;

    const offPoss = offInputs.playerPossPcts[col]!;
    const defPoss = defInputs.playerPossPcts[col]!;
    const offPossPctStr = (100.0 * offInputs.playerPossPcts[col]!).toFixed(0);

    // Prior (luck adjusted o/drtg)
    const offPrior =
      (ctx.priorInfo.playersWeak?.[col]?.off_adj_ppp || 0) -
      ctx.priorInfo.basis.off;
    const defPrior =
      (ctx.priorInfo.playersWeak?.[col]?.def_adj_ppp || 0) -
      ctx.priorInfo.basis.def;

    const offUnbiasRapm = offInputs.rapmRawAdjPpp[col];
    const defUnbiasRapm = defInputs.rapmRawAdjPpp[col];

    const buildLowVolumePlayerRapmAdj = (onOrOff: "off" | "def") => {
      const lineupPossCount =
        ctx.teamInfo.all_lineups?.[`${onOrOff}_poss`]?.value || 1;
      return [
        _.chain(ctx.removedPlayers)
          .values()
          .reduce((acc, v) => {
            const vStat = v[2];
            return (
              acc +
              ((vStat[`${onOrOff}_adj_rtg`]?.value || 0) *
                (vStat[`${onOrOff}_poss`]?.value || 0)) /
                lineupPossCount
            );
          }, 0.0)
          .value(),
        totalOffPoss / lineupPossCount,
      ];
    };
    const buildPrior = (
      onOrOff: "off" | "def",
      input: RapmProcessingInputs
    ) => {
      const vec = input.rapmRawAdjPpp;
      const [addLowVolumeAdjRtg, reduceRapm] =
        buildLowVolumePlayerRapmAdj(onOrOff);
      return (
        (_.reduce(
          vec,
          (acc, n: number, i: number) => acc + n * input.playerPossPcts[i]!
        ) || 0) *
          reduceRapm +
        addLowVolumeAdjRtg
      );
    };
    const [sigmaRapmOff, sigmaRapmDef] = [
      buildPrior("off", offInputs),
      buildPrior("def", defInputs),
    ];
    const offPriorTotalDiff = teamOffAdj - sigmaRapmOff;
    const defPriorTotalDiff = teamDefAdj - sigmaRapmDef;
    const offPriorContrib = rapmOff - offUnbiasRapm;
    const defPriorContrib = rapmDef - defUnbiasRapm;

    const maybeAdaptiveWeight =
      rapmInfo?.preProcDiags?.adaptiveCorrelWeights?.[col] || 0.0;

    const detailedInfoPost = (
      <ul>
        <li>
          We calculate a team adjustment (off=[
          <b>{offPriorTotalDiff.toFixed(2)}</b>] def=[
          <b>{defPriorTotalDiff.toFixed(2)}</b>]) to reduce/remove the the delta
          between total adjusted efficiency and RAPM (due to the regression
          factor): eg compare <em>observed</em> (off=[
          <b>{teamOffAdj.toFixed(2)}</b>] def=[<b>{teamDefAdj.toFixed(2)}</b>])
          vs <em>derived solely from RAPM</em> (off=[
          <b>{sigmaRapmOff.toFixed(2)}</b>] def=[
          <b>{sigmaRapmDef.toFixed(2)}</b>])
        </li>
        <ul>
          <li>
            <em>
              (includes an adjustment for low-volume players based on their "Adj
              Rtg+"s: off=[
              <b>{buildLowVolumePlayerRapmAdj("off")[0]!.toFixed(2)}</b>] def=[
              <b>{buildLowVolumePlayerRapmAdj("def")[0]!.toFixed(2)}</b>]).
            </em>
          </li>
        </ul>
        {ctx.priorInfo.useRecursiveWeakPrior ? (
          <span>
            <ul>
              <li>
                (In "recursive prior" mode this is just a factor of the player's
                raw RAPM, see above)
              </li>
            </ul>
          </span>
        ) : (
          <span>
            <li>
              Then we calculate a player's contribution to this team total -
              currently this is a fraction of "Adj Rtg+": off=[
              <b>{offPrior.toFixed(2)}</b>] def=[<b>{defPrior.toFixed(2)}</b>],
              ...
            </li>
            <li>
              ... chosen so that a minutes-weighted average of the ratings ([
              <b>{offPossPctStr}%</b>] of [<b>{totalOffPoss}</b>]) sums to the
              team value: off=[<b>{offPriorContrib.toFixed(2)}</b>], def=[
              <b>{defPriorContrib.toFixed(2)}</b>]
            </li>
          </span>
        )}
      </ul>
    );

    const adaptiveWeight =
      ctx.priorInfo.strongWeight >= 0
        ? ctx.priorInfo.strongWeight
        : maybeAdaptiveWeight;
    const rapmPriorOverrideInfo =
      ctx.priorInfo.strongWeight >= 0 ? (
        <span>
          {" "}
          (hand-overwritten to <b>{adaptiveWeight.toFixed(2)}</b>)
        </span>
      ) : null;

    const detailedInfoPre = (
      <ul>
        <li>
          To combat the tendency of RAPM to over-share the contribution of the
          strongest players amongst their typical team-mates, we take the
          weighted average player correlation (see "Player correlation table" in
          the Global Diagnostics below) [<b>{maybeAdaptiveWeight.toFixed(2)}</b>
          ]{rapmPriorOverrideInfo}, ...
        </li>
        <li>
          ... and use that % of the player's "Adj Rating+" ([
          <b>{adaptiveWeight.toFixed(2)}</b>]*[<b>{offPrior.toFixed(2)}</b>]) =
          [<b>{(adaptiveWeight * offPrior).toFixed(2)}</b>] as a prior in the
          RAPM calculation.
        </li>
        <ul>
          <li>
            <i>
              (Currently we only do this for offense because ORtg is a much more
              reliable individual stat than DRtg)
            </i>
          </li>
        </ul>
        <li>
          ie Off RAPM [<b>{offUnbiasRapm.toFixed(2)}</b>] = Raw RAPM [
          <b>{(offUnbiasRapm - adaptiveWeight * offPrior).toFixed(2)}</b>] +
          Prior [<b>{(adaptiveWeight * offPrior).toFixed(2)}</b>]
        </li>
      </ul>
    );

    const totalPrior = offPriorContrib - defPriorContrib;
    const totalRawRapm = offUnbiasRapm - defUnbiasRapm;

    return (
      <span>
        <b>RAPM diagnostics for [{player.playerId}]:</b> adj_off=[
        <b>{rapmOff.toFixed(2)}</b>], adj_def=[<b>{rapmDef.toFixed(2)}</b>] =
        <ul>
          <li>
            RAPM contribution: off=[<b>{offUnbiasRapm.toFixed(2)}</b>], def=[
            <b>{defUnbiasRapm.toFixed(2)}</b>], total=[
            <b>{totalRawRapm.toFixed(2)}</b>]
          </li>
          {detailedInfoPre}
          {!ctx.priorInfo.noWeakPrior || ctx.priorInfo.useRecursiveWeakPrior ? (
            <span>
              <li>
                &nbsp;+ POST RAPM adjustment: off=[
                <b>{offPriorContrib.toFixed(2)}</b>], def=[
                <b>{defPriorContrib.toFixed(2)}</b>], total=[
                <b>{totalPrior.toFixed(2)}</b>]
              </li>
              {detailedInfoPost}
            </span>
          ) : null}
        </ul>
        (<b>More player diagnostics to come...</b>)<br />(
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            gotoGlobalDiags();
          }}
        >
          Scroll to global RAPM diagnostics
        </a>
        )
      </span>
    );
  } catch (err: unknown) {
    //Temp issue during reprocessing
    return (
      <span>
        Recalculating diags, pending {err instanceof Error ? err.message : err}
      </span>
    );
  }
};

export default RapmPlayerDiagView;
