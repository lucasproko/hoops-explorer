// React imports:
import React, { useState, useEffect } from 'react';

// Next imports:
import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable"
import { RosterStatsModel } from './RosterStatsTable';
import { LineupStatsModel } from './LineupStatsTable';
import LuckConfigModal from "./shared/LuckConfigModal";
import GenericTogglingMenu from "./shared/GenericTogglingMenu";
import GenericTogglingMenuItem from "./shared/GenericTogglingMenuItem";
import ToggleButtonGroup from "./shared/ToggleButtonGroup";
import LuckAdjDiagView from "./diags/LuckAdjDiagView";
import TeamPlayTypeDiagView from "./diags/TeamPlayTypeDiagView";
import TeamRosterDiagView from "./diags/TeamRosterDiagView";
import TeamExtraStatsInfoView from "./diags/TeamExtraStatsInfoView";

// Util imports
import { StatModels, DivisionStatistics, OnOffBaselineEnum, OnOffBaselineGlobalEnum, PlayerCode, PlayerId, Statistic, IndivStatSet, TeamStatSet, LineupStatSet } from '../utils/StatModels';
import { CbbColors } from "../utils/CbbColors";
import { GameFilterParams, ParamDefaults, LuckParams } from "../utils/FilterModels";
import { CommonTableDefs } from "../utils/tables/CommonTableDefs";
import { LineupUtils } from "../utils/stats/LineupUtils";
import { LuckUtils, OffLuckAdjustmentDiags, DefLuckAdjustmentDiags, LuckAdjustmentBaseline } from "../utils/stats/LuckUtils";
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { TableDisplayUtils } from "../utils/tables/TableDisplayUtils";
import { RosterTableUtils } from "../utils/tables/RosterTableUtils";
import { LineupTableUtils } from "../utils/tables/LineupTableUtils";

import { GradeTableUtils } from "../utils/tables/GradeTableUtils";

export type TeamStatsModel = {
  on: TeamStatSet,
  off: TeamStatSet,
  baseline: TeamStatSet,
  global: TeamStatSet
} & {
  onOffMode?: boolean,
  error_code?: string
};
type Props = {
  gameFilterParams: GameFilterParams;
  /** Ensures that all relevant data is received at the same time */
  dataEvent: {
    teamStats: TeamStatsModel,
    rosterStats: RosterStatsModel,
    lineupStats: LineupStatsModel[]
  },
  onChangeState: (newParams: GameFilterParams) => void;
};
type DivisionStatsCache = {
  year?: string,
  gender?: string,
  Combo?: DivisionStatistics,
  High?: DivisionStatistics,
  Medium?: DivisionStatistics
  Low?: DivisionStatistics
};

const TeamStatsTable: React.FunctionComponent<Props> = ({gameFilterParams, dataEvent, onChangeState}) => {
  const { teamStats, rosterStats, lineupStats } = dataEvent;
  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  /** Only show help for diagnstic on/off on main page */
  const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");

  // 1] Data Model

  const [ adjustForLuck, setAdjustForLuck ] = useState(_.isNil(gameFilterParams.onOffLuck) ?
    ParamDefaults.defaultOnOffLuckAdjust : gameFilterParams.onOffLuck
  );
  const [ showLuckAdjDiags, setShowLuckAdjDiags ] = useState(_.isNil(gameFilterParams.showOnOffLuckDiags) ?
    ParamDefaults.defaultOnOffLuckDiagMode : gameFilterParams.showOnOffLuckDiags
  );
  const [ luckConfig, setLuckConfig ] = useState(_.isNil(gameFilterParams.luck) ?
    ParamDefaults.defaultLuckConfig : gameFilterParams.luck
  );

  const [ showRoster, setShowRoster ] = useState(_.isNil(gameFilterParams.showRoster) ?
    ParamDefaults.defaultTeamShowRoster : gameFilterParams.showRoster
  );

  const [ showDiffs, setShowDiffs ] = useState(_.isNil(gameFilterParams.teamDiffs) ?
    false : gameFilterParams.teamDiffs
  );

  const [ showExtraInfo, setShowExtraInfo ] = useState(_.isNil(gameFilterParams.showExtraInfo) ?
    false : gameFilterParams.showExtraInfo
  );

  const [ showGrades, setShowGrades ] = useState(_.isNil(gameFilterParams.showGrades) ? "" : gameFilterParams.showGrades);

  /** (placeholder for positional info)*/
  const [ showPlayTypes, setShowPlayTypes ] = useState(_.isNil(gameFilterParams.showTeamPlayTypes) ?
    ParamDefaults.defaultTeamShowPlayTypes : gameFilterParams.showTeamPlayTypes
  );

  /** Whether we are showing the luck config modal */
  const [ showLuckConfig, setShowLuckConfig ] = useState(false);

  useEffect(() => { //(keep luck up to date between the two views)
    setAdjustForLuck(_.isNil(gameFilterParams.onOffLuck) ?
        ParamDefaults.defaultOnOffLuckAdjust : gameFilterParams.onOffLuck
    );
    setLuckConfig(_.isNil(gameFilterParams.luck) ?
      ParamDefaults.defaultLuckConfig : gameFilterParams.luck
    );
  }, [ gameFilterParams ]);

  // Team Grade and Division Stats logic
  //TODO: have stats logic separate from grade cache?

  const [ divisionStatsCache, setDivisionStatsCache ] = useState({} as DivisionStatsCache);
  
  /** Create or build a cache contain D1/tier stats for a bunch of team statistics */
  const populateDivisionStatsCache = () => {
    const getUrl = (inGender: string, inYear: string, inTier: string) => {
      const subYear = inYear.substring(0, 4);
      if (ParamDefaults.defaultYear.startsWith(subYear)) { // Access from dynamic storage
        return `/api/getStats?&gender=${inGender}&year=${subYear}&tier=${inTier}`;
      } else { //archived
        return `/leaderboards/lineups/stats_all_${inGender}_${subYear}_${inTier}.json`;
      }
    }

    const inGender = gameFilterParams.gender || ParamDefaults.defaultGender;
    const inYear = gameFilterParams.year || ParamDefaults.defaultYear;
    const fetchAll = [ "Combo", "High", "Medium", "Low" ].map((tier) => {
      return fetch(getUrl(inGender, inYear, tier)).then((response: fetch.IsomorphicResponse) => {
          return response.ok ? response.json() : Promise.resolve({});
        });
    });
    Promise.all(fetchAll).then((jsons: any[]) => {
      setDivisionStatsCache({
        year: inYear, gender: inGender, //(so know when to refresh cache)
        Combo: _.isEmpty(jsons[0]) ? undefined : jsons[0],
        High: _.isEmpty(jsons[1]) ? undefined : jsons[1],
        Medium: _.isEmpty(jsons[2]) ? undefined : jsons[2],
        Low: _.isEmpty(jsons[3]) ? undefined : jsons[3],
      });
    });
  };

  // Events that trigger building or rebuilding the division stats cache
  useEffect(() => {
    if (showGrades) {
      if ((gameFilterParams.year != divisionStatsCache.year) ||
        (gameFilterParams.gender != divisionStatsCache.gender) ||
        _.isEmpty(divisionStatsCache)) {
          if (!_.isEmpty(divisionStatsCache)) setDivisionStatsCache({}); //unset if set
          populateDivisionStatsCache();
        }
      }
  }, [ gameFilterParams, showGrades ]);

  // Generic page builder plumbing
  
  useEffect(() => { //(this ensures that the filter component is up to date with the union of these fields)
    const newState = {
      ...gameFilterParams,
      teamDiffs: showDiffs,
      showTeamPlayTypes: showPlayTypes,
      showExtraInfo: showExtraInfo,
      luck: luckConfig,
      onOffLuck: adjustForLuck,
      showOnOffLuckDiags: showLuckAdjDiags,
      showRoster: showRoster,
      showGrades: showGrades
    };
    onChangeState(newState);
  }, [ luckConfig, adjustForLuck, showLuckAdjDiags, showDiffs, showExtraInfo, showPlayTypes, showRoster, showGrades ]);

  // 2] Data View

  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off";
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def";

  const maybeOn = teamStats.onOffMode ? "On ('A')" : "'A'"
  const maybeOff = teamStats.onOffMode ? "Off ('B')" : "'B'"

  // Luck calculations:

  const genderYearLookup = `${gameFilterParams.gender}_${gameFilterParams.year}`;
  const teamSeasonLookup = `${gameFilterParams.gender}_${gameFilterParams.team}_${gameFilterParams.year}`;
  const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

  // The luck baseline can either be the user-selecteed baseline or the entire season
  const baseLuckBuilder: () => [TeamStatSet, Record<PlayerId, IndivStatSet>] = () => {
    if (adjustForLuck) {
      switch (luckConfig.base) {
        case "baseline":
          return [
            teamStats.baseline, _.fromPairs((rosterStats.baseline || []).map((p: any) => [ p.key, p ]))
          ];
        default: //("season")
          return [
            teamStats.global, _.fromPairs((rosterStats.global || []).map((p: any) => [ p.key, p ]))
          ];
      }
    } else return [ StatModels.emptyTeam(), {} ]; //(not used)
  };
  const [ baseOrSeasonTeamStats, baseOrSeason3PMap ] = baseLuckBuilder();

  // Create luck adjustments, inject luck into mutable stat sets, and calculate efficiency margins
  const luckAdjustment = _.fromPairs(([ "on", "off", "baseline" ] as OnOffBaselineEnum[]).map(k => {
    const luckAdj = (adjustForLuck && teamStats[k]?.doc_count) ? [
      LuckUtils.calcOffTeamLuckAdj(teamStats[k]!, rosterStats[k] || [], baseOrSeasonTeamStats, baseOrSeason3PMap, avgEfficiency),
      LuckUtils.calcDefTeamLuckAdj(teamStats[k]!, baseOrSeasonTeamStats, avgEfficiency),
    ] as [OffLuckAdjustmentDiags, DefLuckAdjustmentDiags] : undefined;

    if (teamStats[k]?.doc_count) {
      // Extra mutable set, build net margin column:
      LineupUtils.buildEfficiencyMargins(teamStats[k]);
      // Mutate stats object to inject luck
      LuckUtils.injectLuck(teamStats[k]!, luckAdj?.[0], luckAdj?.[1]);
    }
    return [ k, luckAdj ];
  })) as {
    [P in OnOffBaselineEnum]: [ OffLuckAdjustmentDiags, DefLuckAdjustmentDiags ] | undefined
  };

  //(end luck calcs)

  /** Largest sample of player stats, by player key - use for ORtg calcs */
  const globalRosterInfo = teamStats.global?.roster
  const globalRosterStatsByCode = RosterTableUtils.buildRosterTableByCode(
    rosterStats.global || [], globalRosterInfo, showPlayTypes, teamSeasonLookup
  ); //TODO: which set do I actually want to use for positional calcs here?

  //TODO: need to do a better job of deciding which one to use (or possibly a blend?)
  const positionFromPlayerIdGlobal =
    showRoster ? LineupTableUtils.buildPositionPlayerMap(rosterStats.global, teamSeasonLookup) : {};
  const positionFromPlayerIdBase =
    showRoster && rosterStats.baseline?.length ? LineupTableUtils.buildPositionPlayerMap(rosterStats.baseline, teamSeasonLookup, globalRosterInfo) : {};
  const positionFromPlayerIdOn =
    showRoster && rosterStats.on?.length ? LineupTableUtils.buildPositionPlayerMap(rosterStats.on, teamSeasonLookup, globalRosterInfo) : {};
  const positionFromPlayerIdOff =
    showRoster && rosterStats.off?.length ? LineupTableUtils.buildPositionPlayerMap(rosterStats.off, teamSeasonLookup, globalRosterInfo) : {};

  // Calc diffs if required ... needs to be before injectPlayTypeInfo but after luck injection!
  const [ aMinusB, aMinusBase, bMinusBase ] = showDiffs ? (() => {
    const aMinusB = (teamStats.on?.doc_count && teamStats.off?.doc_count) ? LineupUtils.getStatsDiff(
      teamStats.on, teamStats.off, "A - B diffs"
    ) : undefined;
    const aMinusBase = (teamStats.on?.doc_count && teamStats.baseline?.doc_count) ? LineupUtils.getStatsDiff(
      teamStats.on, teamStats.baseline, "A - Baseline diffs"
    ) : undefined;
    const bMinusBase = (teamStats.off?.doc_count && teamStats.baseline?.doc_count) ? LineupUtils.getStatsDiff(
      teamStats.off, teamStats.baseline,  "B - Baseline diffs"
    ) : undefined;

    [ aMinusB, aMinusBase, bMinusBase ].forEach((statSet) => {
      if (statSet) TableDisplayUtils.injectPlayTypeInfo(statSet, false, false, teamSeasonLookup)
    });
    return [ aMinusB, aMinusBase, bMinusBase ];
  })() : [ undefined, undefined, undefined ] as [ any, any, any ];

  ([ "on", "off", "baseline" ] as OnOffBaselineEnum[]).forEach(k => {
    TableDisplayUtils.injectPlayTypeInfo(teamStats[k] || StatModels.emptyTeam(), false, false, teamSeasonLookup);
  });

  // If building roster info then enrich player stats:
  const playerInfoByIdBy0AB = showRoster ? ([ "baseline", "on", "off" ] as OnOffBaselineEnum[]).map(queryKey => {
    const playerStatsBy0AB = rosterStats[queryKey] || [];
    const teamStatsBy0AB = teamStats[queryKey] || StatModels.emptyTeam();
    if (teamStatsBy0AB.doc_count) {
      /** Need player info for tooltip view/lineup decoration */
      const playerInfo = LineupTableUtils.buildBaselinePlayerInfo(
        playerStatsBy0AB, globalRosterStatsByCode, teamStats.baseline, avgEfficiency, adjustForLuck, luckConfig.base
      );
      return playerInfo;
    } else {
      return undefined;
    }
  }) : [];

  // Last stage before building the table: inject titles into the stats:
  const teamStatsOn = {
    off_title: `${maybeOn} Offense`,
    def_title: `${maybeOn} Defense`,
    ...teamStats.on
  };
  const teamStatsOff = {
    off_title: `${maybeOff} Offense`,
    def_title: `${maybeOff} Defense`,
    ...teamStats.off
  };
  const teamStatsBaseline = { off_title: "Baseline Offense", def_title: "Baseline Defense", ...teamStats.baseline };

  /** If true, then repeat the table headers */
  const showingSomeDiags = showExtraInfo || showGrades || showRoster || showPlayTypes || showLuckAdjDiags;
  const showingOn = teamStats.on?.doc_count ? true : false;
  const showingOnOrOff = showingOn || (teamStats.off?.doc_count ? true : false);

  const tableData = _.flatMap([
    (teamStats.on?.doc_count) ? _.flatten([
      [ GenericTableOps.buildDataRow(teamStatsOn, offPrefixFn, offCellMetaFn) ],
      [ GenericTableOps.buildDataRow(teamStatsOn, defPrefixFn, defCellMetaFn) ],
      (showGrades != "") && teamStats.on?.doc_count ? 
        GradeTableUtils.buildGradeTableRows({
          setName: "on",
          config: showGrades, setConfig: (newConfig:string) => { setShowGrades(newConfig) },
          comboTier: divisionStatsCache.Combo, highTier: divisionStatsCache.High,
          mediumTier: divisionStatsCache.Medium, lowTier: divisionStatsCache.Low,
          team:teamStats.on
        }) : [],
        showExtraInfo ? [ GenericTableOps.buildTextRow(<span><TeamExtraStatsInfoView
            name="On"
            teamStatSet={teamStats.on}
            showGrades={showGrades}
            grades={showGrades ? {
              comboTier: divisionStatsCache.Combo, highTier: divisionStatsCache.High,
              mediumTier: divisionStatsCache.Medium, lowTier: divisionStatsCache.Low,  
            } : undefined}
          /></span>, "small pt-2")
        ] : [],
        showRoster && teamStats.on?.doc_count ? [ GenericTableOps.buildTextRow(<span>
          <TeamRosterDiagView
            positionInfoGlobal={LineupTableUtils.getPositionalInfo(
              lineupStats[1]?.lineups || [], positionFromPlayerIdGlobal, teamSeasonLookup
            )}
            positionInfoSample={(teamStats.on.doc_count < teamStats.global.doc_count) ? LineupTableUtils.getPositionalInfo(
              lineupStats[1]?.lineups || [], positionFromPlayerIdOn, teamSeasonLookup
            ) : undefined}
            rosterStatsByPlayerId={playerInfoByIdBy0AB[1] || {}}
            positionFromPlayerId={positionFromPlayerIdGlobal}
            teamSeasonLookup={teamSeasonLookup}
            showHelp={showHelp}
          />
        </span>, "small pt-2"
      )] : [],
      showLuckAdjDiags && luckAdjustment.on ? [ GenericTableOps.buildTextRow(
        <LuckAdjDiagView
          name="On"
          offLuck={luckAdjustment.on[0]}
          defLuck={luckAdjustment.on[1]}
          baseline={luckConfig.base}
          showHelp={showHelp}
        />, "small pt-2"
      ) ] : [] ,
      showPlayTypes ?
        [ GenericTableOps.buildTextRow(
          <TeamPlayTypeDiagView
            players={rosterStats.on || []}
            rosterStatsByCode={globalRosterStatsByCode}
            teamStats={teamStatsOn}
            teamSeasonLookup={teamSeasonLookup}
            showHelp={showHelp}
            />, "small"
        ) ] : [],
      [ GenericTableOps.buildRowSeparator() ]
    ]) : [],
    (teamStats.off?.doc_count) ? _.flatten([
      (showingSomeDiags && showingOn) ? [ GenericTableOps.buildHeaderRepeatRow(CommonTableDefs.repeatingOnOffHeaderFields, "small") ] : [],
      [ GenericTableOps.buildDataRow(teamStatsOff, offPrefixFn, offCellMetaFn) ],
      [ GenericTableOps.buildDataRow(teamStatsOff, defPrefixFn, defCellMetaFn) ],
      (showGrades != "") && teamStats.off?.doc_count ? 
        GradeTableUtils.buildGradeTableRows({
          setName: "off",
          config: showGrades, setConfig: (newConfig:string) => { setShowGrades(newConfig) },
          comboTier: divisionStatsCache.Combo, highTier: divisionStatsCache.High,
          mediumTier: divisionStatsCache.Medium, lowTier: divisionStatsCache.Low,
          team:teamStats.off
        }) : [],
        showExtraInfo ? [ GenericTableOps.buildTextRow(<span><TeamExtraStatsInfoView
            name="Off"
            teamStatSet={teamStats.off}
            showGrades={showGrades}
            grades={showGrades ? {
              comboTier: divisionStatsCache.Combo, highTier: divisionStatsCache.High,
              mediumTier: divisionStatsCache.Medium, lowTier: divisionStatsCache.Low,  
            } : undefined}
          /></span>, "small pt-2")
        ] : [],
        showRoster && teamStats.off?.doc_count ? [ GenericTableOps.buildTextRow(<span>
          <TeamRosterDiagView
            positionInfoGlobal={LineupTableUtils.getPositionalInfo(
              lineupStats[2]?.lineups || [], positionFromPlayerIdGlobal, teamSeasonLookup
            )}
            positionInfoSample={(teamStats.off.doc_count < teamStats.global.doc_count) ? LineupTableUtils.getPositionalInfo(
              lineupStats[2]?.lineups || [], positionFromPlayerIdOff, teamSeasonLookup
            ) : undefined}
            rosterStatsByPlayerId={playerInfoByIdBy0AB[2] || {}}
            positionFromPlayerId={positionFromPlayerIdGlobal}
            teamSeasonLookup={teamSeasonLookup}
            showHelp={showHelp}
          />
        </span>, "small pt-2"
      )] : [],
      showLuckAdjDiags && luckAdjustment.off ? [ GenericTableOps.buildTextRow(
        <LuckAdjDiagView
          name="Off"
          offLuck={luckAdjustment.off[0]}
          defLuck={luckAdjustment.off[1]}
          baseline={luckConfig.base}
          showHelp={showHelp}
        />, "small pt-2"
      ) ] : [] ,
      showPlayTypes ?
        [ GenericTableOps.buildTextRow(
          <TeamPlayTypeDiagView
            players={rosterStats.off || []}
            rosterStatsByCode={globalRosterStatsByCode}
            teamStats={teamStatsOff}
            teamSeasonLookup={teamSeasonLookup}
            showHelp={showHelp}
            />, "small"
        ) ] : [],
      [ GenericTableOps.buildRowSeparator() ]
    ]) : [],
    _.flatten([
      (showingSomeDiags && showingOnOrOff) ? [ GenericTableOps.buildHeaderRepeatRow(CommonTableDefs.repeatingOnOffHeaderFields, "small") ] : [],
      [ GenericTableOps.buildDataRow(teamStatsBaseline, offPrefixFn, offCellMetaFn) ],
      [ GenericTableOps.buildDataRow(teamStatsBaseline, defPrefixFn, defCellMetaFn) ],
      (showGrades != "") && teamStats.baseline?.doc_count ? 
        GradeTableUtils.buildGradeTableRows({
          setName: "baseline",
          config: showGrades, setConfig: (newConfig:string) => { setShowGrades(newConfig) },
          comboTier: divisionStatsCache.Combo, highTier: divisionStatsCache.High,
          mediumTier: divisionStatsCache.Medium, lowTier: divisionStatsCache.Low,
          team:teamStats.baseline
        }) : [],
        showExtraInfo ? [ GenericTableOps.buildTextRow(<span><TeamExtraStatsInfoView
            name="Baseline"
            teamStatSet={teamStats.baseline}
            showGrades={showGrades}
            grades={showGrades ? {
              comboTier: divisionStatsCache.Combo, highTier: divisionStatsCache.High,
              mediumTier: divisionStatsCache.Medium, lowTier: divisionStatsCache.Low,  
            } : undefined}
          /></span>, "small pt-2")
        ] : [],
        showRoster && teamStats.baseline?.doc_count ? [ GenericTableOps.buildTextRow(<span>
          <TeamRosterDiagView
            positionInfoGlobal={LineupTableUtils.getPositionalInfo(
              lineupStats[0]?.lineups || [], positionFromPlayerIdGlobal, teamSeasonLookup
            )}
            positionInfoSample={(teamStats.baseline.doc_count < teamStats.global.doc_count) ? LineupTableUtils.getPositionalInfo(
              lineupStats[0]?.lineups || [], positionFromPlayerIdBase, teamSeasonLookup
            ) : undefined}
            rosterStatsByPlayerId={playerInfoByIdBy0AB[0] || {}}
            positionFromPlayerId={positionFromPlayerIdGlobal}
            teamSeasonLookup={teamSeasonLookup}
            showHelp={showHelp}
          />
        </span>, "small pt-2"
      )] : [],
      showLuckAdjDiags && luckAdjustment.baseline ? [ GenericTableOps.buildTextRow(
        <LuckAdjDiagView
          name="Baseline"
          offLuck={luckAdjustment.baseline[0]}
          defLuck={luckAdjustment.baseline[1]}
          baseline={luckConfig.base}
          showHelp={showHelp}
        />, "small pt-2"
      ) ] : [] ,
      showPlayTypes ?
        [ GenericTableOps.buildTextRow(
          <TeamPlayTypeDiagView
            players={rosterStats.baseline || []}
            rosterStatsByCode={globalRosterStatsByCode}
            teamStats={teamStatsBaseline}
            teamSeasonLookup={teamSeasonLookup}
            showHelp={showHelp}
            />, "small"
        ) ] : [],
    ]),
    // Diffs if showing:
    showDiffs ? [ GenericTableOps.buildRowSeparator() ] : [],
    aMinusB ? _.flatten([
      [ GenericTableOps.buildDataRow(aMinusB, offPrefixFn, offCellMetaFn, CommonTableDefs.onOffReportReplacement) ],
      [ GenericTableOps.buildDataRow(aMinusB, defPrefixFn, defCellMetaFn, CommonTableDefs.onOffReportReplacement) ],
      [ GenericTableOps.buildRowSeparator() ],
    ] ) : [],
    aMinusBase ? _.flatten([
      [ GenericTableOps.buildDataRow(aMinusBase, offPrefixFn, offCellMetaFn, CommonTableDefs.onOffReportReplacement) ],
      [ GenericTableOps.buildDataRow(aMinusBase, defPrefixFn, defCellMetaFn, CommonTableDefs.onOffReportReplacement) ],
      [ GenericTableOps.buildRowSeparator() ],
    ] ) : [],
    bMinusBase ? _.flatten([
      [ GenericTableOps.buildDataRow(bMinusBase, offPrefixFn, offCellMetaFn, CommonTableDefs.onOffReportReplacement) ],
      [ GenericTableOps.buildDataRow(bMinusBase, defPrefixFn, defCellMetaFn, CommonTableDefs.onOffReportReplacement) ],
      [ GenericTableOps.buildRowSeparator() ],
    ] ) : [],
  ]);

  // 3] Utils
  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return (teamStats.baseline.doc_count || 0) == 0;
  }

  // 4] View

  return <Container>
    <LoadingOverlay
      active={needToLoadQuery()}
      text={teamStats.error_code ?
        `Query Error: ${teamStats.error_code}` :
        "Press 'Submit' to view results"
      }
    >
      <LuckConfigModal
        show={showLuckConfig}
        onHide={() => setShowLuckConfig(false)}
        onSave={(l: LuckParams) => setLuckConfig(l)}
        luck={luckConfig}
        showHelp={showHelp}
      />
      <Form.Row>
        <Col sm="11">
          <Form.Row>
            <Col>
              <ToggleButtonGroup items={[
                {
                  label: "Luck",
                  tooltip: adjustForLuck ? "Remove luck adjustments" : "Adjust statistics for luck",
                  toggled: adjustForLuck,
                  onClick: () => setAdjustForLuck(!adjustForLuck)
                },
                {
                  label: "Diffs",
                  tooltip: "Show hide diffs between A/B/Baseline stats",
                  toggled: showDiffs,
                  onClick: () => setShowDiffs(!showDiffs)
                },
                {
                  label: "Extra",
                  tooltip: showExtraInfo ? "Hide extra stats info" : "Show extra stats info",
                  toggled: showExtraInfo,
                  onClick: () => setShowExtraInfo(!showExtraInfo)
                },
                {
                  label: "Grades",
                  tooltip: showGrades ? "Hide team ranks/percentiles" : "Show team ranks/percentiles",
                  toggled: (showGrades != ""),
                  onClick: () => setShowGrades(showGrades ? "" : ParamDefaults.defaultTeamEnabledGrade)
                },
                {
                  label: "Style",
                  tooltip: showPlayTypes ? "Hide play style breakdowns" : "Show play style breakdowns",
                  toggled: showPlayTypes,
                  onClick: () => setShowPlayTypes(!showPlayTypes)
                },
                {
                  label: "Roster",
                  tooltip: showRoster ? "Hide roster/positional information" : "Show roster/positional information",
                  toggled: showRoster,
                  onClick: () => setShowRoster(!showRoster)
                },
              ]}/>
            </Col>
          </Form.Row>
        </Col>
        <Form.Group as={Col} sm="1">
          <GenericTogglingMenu>
            <GenericTogglingMenuItem
              text="Adjust for Luck"
              truthVal={adjustForLuck}
              onSelect={() => setAdjustForLuck(!adjustForLuck)}
              helpLink={showHelp ? "https://hoop-explorer.blogspot.com/2020/07/luck-adjustment-details.html" : undefined}
            />
            <GenericTogglingMenuItem
              text="Show Stat Differences"
              truthVal={showDiffs}
              onSelect={() => setShowDiffs(!showDiffs)}
            />
            <GenericTogglingMenuItem
              text="Show Extra Team Information"
              truthVal={showExtraInfo}
              onSelect={() => setShowExtraInfo(!showExtraInfo)}
            />
            <GenericTogglingMenuItem
              text="Show Team Ranks/Percentiles"
              truthVal={showGrades != ""}
              onSelect={() => setShowGrades(showGrades ? "" : ParamDefaults.defaultTeamEnabledGrade)}
            />
            <GenericTogglingMenuItem
              text="Show Play Style Breakdowns"
              truthVal={showPlayTypes}
              onSelect={() => setShowPlayTypes(!showPlayTypes)}
            />
            <GenericTogglingMenuItem
              text="Show Roster Information"
              truthVal={showRoster}
              onSelect={() => setShowRoster(!showRoster)}
            />
            <Dropdown.Divider />
            <GenericTogglingMenuItem
              text="Configure Luck Adjustments..."
              truthVal={false}
              onSelect={() => setShowLuckConfig(true)}
            />
            <Dropdown.Divider />
            <GenericTogglingMenuItem
              text="Show Luck Adjustment diagnostics"
              truthVal={showLuckAdjDiags}
              onSelect={() => setShowLuckAdjDiags(!showLuckAdjDiags)}
            />
          </GenericTogglingMenu>
        </Form.Group>
      </Form.Row>
      <Row className="mt-2">
        <Col style={{paddingLeft: "5px", paddingRight: "5px"}}>
          <GenericTable
            tableCopyId="teamStatsTable"
            tableFields={CommonTableDefs.onOffTable}
            tableData={tableData}
            cellTooltipMode="none"
          />
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
};

export default TeamStatsTable;
