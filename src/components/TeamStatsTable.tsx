// React imports:
import React, { useState, useEffect } from "react";

// Next imports:
import { NextPage } from "next";
import fetch from "isomorphic-unfetch";

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";

// Additional components:
// @ts-ignore
import LoadingOverlay from "react-loading-overlay";

// Component imports
import GenericTable, { GenericTableOps } from "./GenericTable";
import { RosterStatsModel } from "./RosterStatsTable";
import { LineupStatsModel } from "./LineupStatsTable";
import LuckConfigModal from "./shared/LuckConfigModal";
import GenericTogglingMenu from "./shared/GenericTogglingMenu";
import GenericTogglingMenuItem from "./shared/GenericTogglingMenuItem";
import ToggleButtonGroup from "./shared/ToggleButtonGroup";

// Util imports
import { TeamStatSet } from "../utils/StatModels";
import {
  GameFilterParams,
  ParamDefaults,
  LuckParams,
} from "../utils/FilterModels";
import { CommonTableDefs } from "../utils/tables/CommonTableDefs";

import {
  DivisionStatsCache,
  GradeTableUtils,
} from "../utils/tables/GradeTableUtils";
import {
  TeamStatsTableUtils,
  TeamStatsBreakdown,
} from "../utils/tables/TeamStatsTableUtils";

export type TeamStatsModel = {
  on: TeamStatSet;
  off: TeamStatSet;
  baseline: TeamStatSet;
  global: TeamStatSet;
} & {
  onOffMode?: boolean;
  error_code?: string;
};
type Props = {
  gameFilterParams: GameFilterParams;
  /** Ensures that all relevant data is received at the same time */
  dataEvent: {
    teamStats: TeamStatsModel;
    rosterStats: RosterStatsModel;
    lineupStats: LineupStatsModel[];
  };
  onChangeState: (newParams: GameFilterParams) => void;
};

const TeamStatsTable: React.FunctionComponent<Props> = ({
  gameFilterParams,
  dataEvent,
  onChangeState,
}) => {
  const { teamStats, rosterStats, lineupStats } = dataEvent;
  const server =
    typeof window === `undefined` //(ensures SSR code still compiles)
      ? "server"
      : window.location.hostname;

  /** Only show help for diagnstic on/off on main page */
  const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");

  // 1] Data Model

  const [adjustForLuck, setAdjustForLuck] = useState(
    _.isNil(gameFilterParams.onOffLuck)
      ? ParamDefaults.defaultOnOffLuckAdjust
      : gameFilterParams.onOffLuck
  );
  const [showLuckAdjDiags, setShowLuckAdjDiags] = useState(
    _.isNil(gameFilterParams.showOnOffLuckDiags)
      ? ParamDefaults.defaultOnOffLuckDiagMode
      : gameFilterParams.showOnOffLuckDiags
  );
  const [luckConfig, setLuckConfig] = useState(
    _.isNil(gameFilterParams.luck)
      ? ParamDefaults.defaultLuckConfig
      : gameFilterParams.luck
  );

  const [showRoster, setShowRoster] = useState(
    _.isNil(gameFilterParams.showRoster)
      ? ParamDefaults.defaultTeamShowRoster
      : gameFilterParams.showRoster
  );

  const [showGameInfo, setShowGameInfo] = useState(
    _.isNil(gameFilterParams.showGameInfo)
      ? ParamDefaults.defaultTeamShowGameInfo
      : gameFilterParams.showGameInfo
  );

  const [showDiffs, setShowDiffs] = useState(
    _.isNil(gameFilterParams.teamDiffs) ? false : gameFilterParams.teamDiffs
  );

  const [showExtraInfo, setShowExtraInfo] = useState(
    _.isNil(gameFilterParams.showExtraInfo)
      ? false
      : gameFilterParams.showExtraInfo
  );

  /** Show team and individual grades */
  const [showGrades, setShowGrades] = useState(
    _.isNil(gameFilterParams.showGrades) ? "" : gameFilterParams.showGrades
  );

  /** (placeholder for positional info)*/
  const [showPlayTypes, setShowPlayTypes] = useState(
    _.isNil(gameFilterParams.showTeamPlayTypes)
      ? ParamDefaults.defaultTeamShowPlayTypes
      : gameFilterParams.showTeamPlayTypes
  );

  /** Whether we are showing the luck config modal */
  const [showLuckConfig, setShowLuckConfig] = useState(false);

  useEffect(() => {
    //(keep luck and grades up to date between the two views)
    setAdjustForLuck(
      _.isNil(gameFilterParams.onOffLuck)
        ? ParamDefaults.defaultOnOffLuckAdjust
        : gameFilterParams.onOffLuck
    );
    setLuckConfig(
      _.isNil(gameFilterParams.luck)
        ? ParamDefaults.defaultLuckConfig
        : gameFilterParams.luck
    );
    setShowGrades(
      _.isNil(gameFilterParams.showGrades) ? "" : gameFilterParams.showGrades
    );
  }, [gameFilterParams]);

  // Team Grade and Division Stats logic
  //TODO: have stats logic separate from grade cache?

  const [divisionStatsCache, setDivisionStatsCache] = useState(
    {} as DivisionStatsCache
  );

  // Events that trigger building or rebuilding the division stats cache
  useEffect(() => {
    if (showGrades) {
      if (
        gameFilterParams.year != divisionStatsCache.year ||
        gameFilterParams.gender != divisionStatsCache.gender ||
        _.isEmpty(divisionStatsCache)
      ) {
        if (!_.isEmpty(divisionStatsCache)) setDivisionStatsCache({}); //unset if set
        GradeTableUtils.populateTeamDivisionStatsCache(
          gameFilterParams,
          setDivisionStatsCache
        );
      }
    }
  }, [gameFilterParams, showGrades]);

  // Generic page builder plumbing

  useEffect(() => {
    //(this ensures that the filter component is up to date with the union of these fields)
    const newState = {
      ...gameFilterParams,
      teamDiffs: showDiffs,
      showTeamPlayTypes: showPlayTypes,
      showExtraInfo: showExtraInfo,
      luck: luckConfig,
      onOffLuck: adjustForLuck,
      showOnOffLuckDiags: showLuckAdjDiags,
      showRoster: showRoster,
      showGameInfo: showGameInfo,
      showGrades: showGrades,
    };
    onChangeState(newState);
  }, [
    luckConfig,
    adjustForLuck,
    showLuckAdjDiags,
    showDiffs,
    showExtraInfo,
    showPlayTypes,
    showRoster,
    showGameInfo,
    showGrades,
  ]);

  const tableInfo = TeamStatsTableUtils.buildRows(
    gameFilterParams,
    teamStats,
    rosterStats,
    lineupStats,

    // Page control
    {
      showPlayTypes,
      showRoster,
      adjustForLuck,
      showDiffs,
      showGameInfo,
      showExtraInfo,
      showGrades,
      showLuckAdjDiags,
      showHelp,
    },
    {
      setShowGrades: (showGrades: string) => setShowGrades(showGrades),
    },

    luckConfig,
    divisionStatsCache
  );

  const buildRows = (
    stats: TeamStatsBreakdown | undefined,
    withSeparator: boolean
  ) => {
    return stats
      ? _.flatten([
          stats.teamStatsRows,
          stats.teamRosterRows,
          stats.teamDiagRows,
          withSeparator ? [GenericTableOps.buildRowSeparator()] : [],
        ])
      : [];
  };

  const tableData = _.flatten([
    buildRows(tableInfo.on, true),
    buildRows(tableInfo.off, true),
    buildRows(tableInfo.baseline, false),
    // Diffs if showing:
    showDiffs ? [GenericTableOps.buildRowSeparator()] : [],
    tableInfo.diffs,
  ]);

  // 3] Utils
  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return (teamStats.baseline.doc_count || 0) == 0;
  }

  // 4] View

  return (
    <Container>
      <LoadingOverlay
        active={needToLoadQuery()}
        text={
          teamStats.error_code
            ? `Query Error: ${teamStats.error_code}`
            : "Press 'Submit' to view results"
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
                <ToggleButtonGroup
                  items={[
                    {
                      label: "Luck",
                      tooltip: adjustForLuck
                        ? "Remove luck adjustments"
                        : "Adjust statistics for luck",
                      toggled: adjustForLuck,
                      onClick: () => setAdjustForLuck(!adjustForLuck),
                    },
                    {
                      label: "Diffs",
                      tooltip: "Show hide diffs between A/B/Baseline stats",
                      toggled: showDiffs,
                      onClick: () => setShowDiffs(!showDiffs),
                    },
                    {
                      label: "Extra",
                      tooltip: showExtraInfo
                        ? "Hide extra stats info"
                        : "Show extra stats info",
                      toggled: showExtraInfo,
                      onClick: () => setShowExtraInfo(!showExtraInfo),
                    },
                    {
                      label: "Grades",
                      tooltip: showGrades
                        ? "Hide team ranks/percentiles"
                        : "Show team ranks/percentiles",
                      toggled: showGrades != "",
                      onClick: () =>
                        setShowGrades(
                          showGrades ? "" : ParamDefaults.defaultEnabledGrade
                        ),
                    },
                    {
                      label: "Style",
                      tooltip: showPlayTypes
                        ? "Hide play style breakdowns"
                        : "Show play style breakdowns",
                      toggled: showPlayTypes,
                      onClick: () => setShowPlayTypes(!showPlayTypes),
                    },
                    {
                      label: "Roster",
                      tooltip: showRoster
                        ? "Hide roster/positional information"
                        : "Show roster/positional information",
                      toggled: showRoster,
                      onClick: () => setShowRoster(!showRoster),
                    },
                    {
                      label: "Games",
                      tooltip: showGameInfo
                        ? "Hide per-game graphs"
                        : "Show per-game graphs",
                      toggled: showGameInfo,
                      onClick: () => setShowGameInfo(!showGameInfo),
                    },
                  ]}
                />
              </Col>
            </Form.Row>
          </Col>
          <Form.Group as={Col} sm="1">
            <GenericTogglingMenu>
              <GenericTogglingMenuItem
                text="Adjust for Luck"
                truthVal={adjustForLuck}
                onSelect={() => setAdjustForLuck(!adjustForLuck)}
                helpLink={
                  showHelp
                    ? "https://hoop-explorer.blogspot.com/2020/07/luck-adjustment-details.html"
                    : undefined
                }
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
                onSelect={() =>
                  setShowGrades(
                    showGrades ? "" : ParamDefaults.defaultEnabledGrade
                  )
                }
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
              <GenericTogglingMenuItem
                text="Show Game Information"
                truthVal={showGameInfo}
                onSelect={() => setShowGameInfo(!showGameInfo)}
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
          <Col style={{ paddingLeft: "5px", paddingRight: "5px" }}>
            <GenericTable
              tableCopyId="teamStatsTable"
              tableFields={CommonTableDefs.onOffTable}
              tableData={tableData}
              cellTooltipMode="none"
            />
          </Col>
        </Row>
      </LoadingOverlay>
    </Container>
  );
};

export default TeamStatsTable;
