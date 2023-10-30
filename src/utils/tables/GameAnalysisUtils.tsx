import { LineupStatsModel } from "../../components/LineupStatsTable";
import { RosterStatsModel } from "../../components/RosterStatsTable";
import { TeamStatsModel } from "../../components/TeamStatsTable";
import { CommonFilterParams, LuckParams } from "../FilterModels";
import { LineupTableUtils } from "./LineupTableUtils";
import { RosterTableUtils } from "./RosterTableUtils";
import { defaultRapmConfig, RapmInfo } from "../stats/RapmUtils";
import { TeamReportTableUtils } from "./TeamReportTableUtils";
import _ from "lodash";
import {
  IndivPosInfo,
  IndivStatSet,
  PlayerId,
  PureStatSet,
} from "../StatModels";
import { PlayerOnOffStats } from "../stats/LineupUtils";

export type GameStatsCache = {
  playerInfo: Record<PlayerId, IndivStatSet>;
  positionInfo: Record<PlayerId, IndivPosInfo>;
  rapmInfo: RapmInfo | undefined;
};

/** Utils for performing analyses of single game stats */
export class GameAnalysisUtils {
  /** For a given lineup set, calculate RAPM as quickly as possible */
  static buildGameRapmStats = (
    team: string,
    commonParams: CommonFilterParams,
    lineupStats: LineupStatsModel,
    teamStats: TeamStatsModel,
    rosterStats: RosterStatsModel,
    adjustForLuck: boolean,
    luckConfig: LuckParams,
    avgEfficiency: number
  ): GameStatsCache => {
    if (!lineupStats.lineups) {
      return { playerInfo: {}, positionInfo: {}, rapmInfo: undefined };
    }
    const genderYearLookup = `${commonParams.gender}_${commonParams.year}`;
    const teamSeasonLookup = `${commonParams.gender}_${team}_${commonParams.year}`;
    const rosterStatsByCode = RosterTableUtils.buildRosterTableByCode(
      rosterStats.global || [],
      teamStats.global?.roster,
      false,
      teamSeasonLookup
    );
    const playerInfo = LineupTableUtils.buildBaselinePlayerInfo(
      rosterStats.baseline!,
      rosterStatsByCode,
      teamStats.baseline!,
      avgEfficiency,
      adjustForLuck,
      luckConfig.base,
      {},
      {}
    );
    const positionInfo = LineupTableUtils.buildPositionPlayerMap(
      rosterStats.global,
      teamSeasonLookup
    );
    const preRapmTableData = LineupTableUtils.buildEnrichedLineups(
      //(calcs for both luck and non-luck versions)
      lineupStats.lineups || [],
      teamStats.global,
      rosterStats.global,
      teamStats.baseline,
      //(the baseline vs on/off here doesn't make any practical difference)
      adjustForLuck,
      luckConfig.base,
      avgEfficiency,
      false,
      teamSeasonLookup,
      positionInfo,
      playerInfo
    );
    const rapmInfo =
      TeamReportTableUtils.buildOrInjectRapm(
        preRapmTableData,
        playerInfo,
        adjustForLuck,
        avgEfficiency,
        genderYearLookup,
        undefined,
        {
          ...defaultRapmConfig,
          fixedRegression: 0.8,
        }
      ) ||
      ({
        enrichedPlayers: _.values(playerInfo).map((p) => ({
          playerId: p.key || "",
          playerCode: p.code || "",
          rapm: {
            off_adj_ppp: p.off_adj_rtg,
            def_adj_ppp: p.def_adj_rtg,
          },
        })),
      } as unknown as RapmInfo);

    return { playerInfo, positionInfo, rapmInfo };
  };

  private static fieldValExtractor = (field: string) => {
    return (p: PureStatSet | undefined) => {
      if (field[0] == "o" || field[0] == "d") {
        return p?.[field]?.value || 0;
      } else {
        return (
          (p?.[`off_${field}`]?.value || 0) - (p?.[`def_${field}`]?.value || 0)
        );
      }
    };
  };

  /** Gives a bunch of info about a player's performance in the game */
  static buildPlayerTooltipContents = (
    seriesId: string,
    stats: IndivStatSet,
    playerOnOffStats: PlayerOnOffStats,
    playerPosInfo: IndivPosInfo
  ) => {
    const net =
      (playerOnOffStats.rapm?.off_adj_ppp?.value || 0) -
      (playerOnOffStats.rapm?.def_adj_ppp?.value || 0);
    // Info needed for the performance breakdown
    const _3pa = stats.total_off_3p_attempts?.value || 0;
    const _3pm = stats.total_off_3p_made?.value || 0;
    const _2pmida = stats.total_off_2pmid_attempts?.value || 0;
    const _2pmidm = stats.total_off_2pmid_made?.value || 0;
    const _2prima = stats.total_off_2prim_attempts?.value || 0;
    const _2primm = stats.total_off_2prim_made?.value || 0;
    const fta = stats.total_off_fta?.value || 0;
    const ftm = stats.total_off_ftm?.value || 0;
    const assists = stats.total_off_assist?.value || 0;
    const tos = stats.total_off_to?.value || 0;
    const orbs = stats.total_off_orb?.value || 0;
    const drbs = stats.total_off_drb?.value || 0;
    const pts = 3 * _3pm + 2 * (_2pmidm + _2primm) + ftm;
    const trbs = orbs + drbs;
    return (
      <span>
        <p className="label">
          <b>{`${stats?.key}`}</b>
          <br />
          <b>{`${seriesId}`}</b>
          <br />
          <i>
            {`${stats?.roster?.height || "?-?"} `}
            {`${playerPosInfo.posClass || "??"}`}
          </i>
        </p>
        <p className="desc">
          <span>
            <b>{pts}</b> pt{pts == 1 ? "" : "s"} / <b>{trbs}</b> RB
            {trbs == 1 ? "" : "s"}{" "}
          </span>
          <br />
          <br />
          <span>
            Net RAPM: <b>{net.toFixed(1)}</b> pts/100
          </span>
          <br />
          <span>
            Off RAPM:{" "}
            <b>{(playerOnOffStats.rapm?.off_adj_ppp?.value || 0).toFixed(1)}</b>{" "}
            pts/100
          </span>
          <br />
          <span>
            Def RAPM:{" "}
            <b>{(playerOnOffStats.rapm?.def_adj_ppp?.value || 0).toFixed(1)}</b>{" "}
            pts/100
          </span>
          <br />
          <span>
            Off Rtg:{" "}
            <b>
              {GameAnalysisUtils.fieldValExtractor("off_rtg")(stats).toFixed(1)}
            </b>
          </span>
          <br />
          <span>
            Usage:{" "}
            <b>
              {(
                GameAnalysisUtils.fieldValExtractor("off_usage")(stats) * 100
              ).toFixed(1)}
            </b>
            %
          </span>
          <br />
          <span>
            Mpg:{" "}
            <b>
              {(
                GameAnalysisUtils.fieldValExtractor("off_team_poss_pct")(
                  stats
                ) * 40
              ).toFixed(1)}
            </b>
          </span>
          <br />
          <br />
          <span>
            3P=[
            <b>
              {_3pm}/{_3pa}
            </b>
            ] mid=[
            <b>
              {_2pmidm}/{_2pmida}
            </b>
            ]
          </span>
          <br />
          <span>
            rim=[
            <b>
              {_2primm}/{_2prima}
            </b>
            ] FT=[
            <b>
              {ftm}/{fta}
            </b>
            ]
          </span>
          <br />
          <span>
            A:TO=[<b>{assists}</b>]:[<b>{tos}</b>]
          </span>
          <br />
          <span>
            ORBs=[<b>{orbs}</b>] DRBs=[<b>{drbs}</b>]
          </span>
          <br />
        </p>
      </span>
    );
  };
}
