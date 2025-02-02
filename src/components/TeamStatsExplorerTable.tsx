// React imports:
import React, { useState, useEffect } from "react";

// Lodash:
import _ from "lodash";

// Bootstrap imports:

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";

// Additional components:
// @ts-ignore
import LoadingOverlay from "@ronchalant/react-loading-overlay";
//@ts-ignore
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faPen, faEye } from "@fortawesome/free-solid-svg-icons";
import ClipboardJS from "clipboard";

// Component imports
import GenericTable, { GenericTableOps } from "./GenericTable";
import GenericTogglingMenu from "./shared/GenericTogglingMenu";
import GenericTogglingMenuItem from "./shared/GenericTogglingMenuItem";
import ConferenceSelector, {
  ConfSelectorConstants,
} from "./shared/ConferenceSelector";

// Math:
// @ts-ignore
import Statistics from "statistics.js";

// Table building
// Util imports
import {
  TeamEditorParams,
  OffseasonLeaderboardParams,
  TeamStatsExplorerParams,
  ParamDefaults,
} from "../utils/FilterModels";

import {
  Statistic,
  RosterEntry,
  PlayerCode,
  StatModels,
} from "../utils/StatModels";
import { AvailableTeams } from "../utils/internal-data/AvailableTeams";
import { GradeUtils } from "../utils/stats/GradeUtils";
import { UrlRouting } from "../utils/UrlRouting";
import { efficiencyAverages } from "../utils/public-data/efficiencyAverages";
import TeamEditorTable, { TeamEditorStatsModel } from "./TeamEditorTable";
import { CommonTableDefs } from "../utils/tables/CommonTableDefs";
import { DateUtils } from "../utils/DateUtils";
import { InputGroup } from "react-bootstrap";

// Library imports:
import fetch from "isomorphic-unfetch";
import { RequestUtils } from "../utils/RequestUtils";
import {
  EvalResults,
  EvalRule,
  EvalStatInfo,
  EvalStatSubResults,
  OffseasonLeaderboardUtils,
  OffseasonTeamInfo,
  PredictedVsActualRankings,
} from "../utils/stats/OffseasonLeaderboardUtils";
import TeamFilterAutoSuggestText, {
  notFromFilterAutoSuggest,
} from "./shared/TeamFilterAutoSuggestText";
import { TeamStatsTableUtils } from "../utils/tables/TeamStatsTableUtils";
import { DivisionStatsCache } from "../utils/tables/GradeTableUtils";
import { ConferenceToNickname } from "../utils/public-data/ConferenceInfo";
import { TeamEvalUtils } from "../utils/stats/TeamEvalUtils";

export type TeamStatsExplorerModel = {
  confs: string[];
  teams: any[]; //TODO
  lastUpdated: number;
  error?: string;
};

type Props = {
  startingState: TeamStatsExplorerParams;
  dataEvent: TeamStatsExplorerModel;
  onChangeState: (newParams: TeamStatsExplorerParams) => void;
};

const TeamStatsExplorerTable: React.FunctionComponent<Props> = ({
  startingState,
  dataEvent,
  onChangeState,
}) => {
  const server =
    typeof window === `undefined` //(ensures SSR code still compiles)
      ? "server"
      : window.location.hostname;

  /** Only show help for diagnstic on/off on main page */
  const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");

  // 1] Data model

  // (don't support tier changes)
  const tier: string = "All";

  // Data source
  const [clipboard, setClipboard] = useState(null as null | ClipboardJS);
  const [confs, setConfs] = useState(startingState.confs || "");
  const hasCustomFilter =
    confs.indexOf(ConfSelectorConstants.queryFiltersName) >= 0;
  const [queryFilters, setQueryFilters] = useState(
    startingState.queryFilters || ""
  );
  const [tmpQueryFilters, setTmpQueryFilters] = useState(
    startingState.queryFilters || ""
  );
  const separatorKeyword = "BREAK";
  // const queryFiltersAsMap: Record<string, number> = _.fromPairs(
  //   queryFilters.split(";").map((s, ii) => [_.trim(s), ii + 1])
  // );
  const { queryFiltersAsMap, queryFilterRowBreaks } = _.transform(
    queryFilters.split(";"),
    (acc, v, ii) => {
      const teamName = _.trim(v);
      if (teamName == separatorKeyword) {
        acc.queryFilterRowBreaks.add(ii - acc.queryFilterRowBreaks.size - 1);
      } else {
        acc.queryFiltersAsMap[teamName] =
          1 + ii - acc.queryFilterRowBreaks.size;
      }
    },
    {
      queryFiltersAsMap: {} as Record<string, number>,
      queryFilterRowBreaks: new Set<number>(),
    }
  );

  const maybeFilterPromptTooltip = (
    <Tooltip id="maybeFilterPromptTooltip">
      Press Enter to apply this filter (current filter [{queryFilters}])
    </Tooltip>
  );
  const maybeFilterPrompt =
    queryFilters != tmpQueryFilters ? (
      <OverlayTrigger placement="auto" overlay={maybeFilterPromptTooltip}>
        <span>&nbsp;(*)</span>
      </OverlayTrigger>
    ) : null;

  const [year, setYear] = useState(
    startingState.year || DateUtils.mostRecentYearWithLboardData
  );

  const [gender, setGender] = useState("Men"); // TODO ignore input just take Men

  const [sortBy, setSortBy] = useState(startingState.sortBy || "net");

  const teamList = _.flatMap(AvailableTeams.byName, (teams, __) => {
    const maybeTeam = teams.find((t) => t.year == year && t.gender == gender);
    return maybeTeam ? [maybeTeam.team] : [];
  });

  /** Show team and individual grades */
  const [showGrades, setShowGrades] = useState(
    _.isNil(startingState.showGrades) ? "" : startingState.showGrades
  );

  /** The settings to use for luck adjustment */
  const [luckConfig, setLuckConfig] = useState(
    _.isNil(startingState.luck)
      ? ParamDefaults.defaultLuckConfig
      : startingState.luck
  );

  const [divisionStatsCache, setDivisionStatsCache] = useState(
    {} as DivisionStatsCache
  );

  /** When the params change */
  useEffect(() => {
    onChangeState({
      year: year,
      confs,
      sortBy: sortBy,
      queryFilters: queryFilters,
    });
  }, [confs, year, sortBy, queryFilters]);

  /** Set this to be true on expensive operations */
  const [loadingOverride, setLoadingOverride] = useState(false);

  useEffect(() => {
    // Add and remove clipboard listener
    initClipboard();

    if (typeof document !== `undefined`) {
      //(if we added a clipboard listener, then remove it on page close)
      //(if we added a submitListener, then remove it on page close)
      return () => {
        if (clipboard) {
          clipboard.destroy();
          setClipboard(null);
        }
      };
    }
  });
  /** This grovelling is needed to ensure that clipboard is only loaded client side */
  function initClipboard() {
    if (null == clipboard) {
      var newClipboard = new ClipboardJS(`#copyLink_teamStatsExplorer`, {
        text: function (trigger) {
          return window.location.href;
        },
      });
      newClipboard.on("success", (event: ClipboardJS.Event) => {
        //(unlike other tables, don't add to history)
        // Clear the selection in some visually pleasing way
        setTimeout(function () {
          event.clearSelection();
        }, 150);
      });
      setClipboard(newClipboard);
    }
  }

  /** At the expense of some time makes it easier to see when changes are happening */
  const friendlyChange = (
    change: () => void,
    guard: boolean,
    timeout: number = 250
  ) => {
    if (guard) {
      setLoadingOverride(true);
      setTimeout(() => {
        change();
      }, timeout);
    }
  };

  // 2] Processing

  const table = React.useMemo(() => {
    setLoadingOverride(false);

    const confFilter = (t: { team: string; conf: string }) => {
      return (
        confs == "" ||
        confs.indexOf(t.conf) >= 0 ||
        (confs.indexOf(ConfSelectorConstants.highMajorConfsNick) >= 0 &&
          ConfSelectorConstants.powerSixConfsStr.indexOf(t.conf) >= 0) ||
        (confs.indexOf(ConfSelectorConstants.nonHighMajorConfsNick) >= 0 &&
          ConfSelectorConstants.powerSixConfsStr.indexOf(t.conf) < 0) ||
        (hasCustomFilter && !_.isNil(queryFiltersAsMap[t.team]))
      );
    };

    const rowsForEachTeam = _.chain(dataEvent.teams || [])
      .map((team) => {
        const confNick = ConferenceToNickname[team.conf || ""] || "???";
        const { wab, wins, losses } = _.transform(
          team.opponents || [],
          (acc, game) => {
            const isWin = (game.team_scored || 0) >= (game.oppo_scored || 0);
            acc.wab += isWin ? game.wab || 0 : (game.wab || 0) - 1;
            acc.wins += isWin ? 1 : 0;
            acc.losses += isWin ? 0 : 1;
          },
          { wab: 0.0, wins: 0, losses: 0 }
        );
        team.confNick = confNick;
        team.wab = wab;
        team.wins = wins;
        team.losses = losses;

        const expWinPctVsBubble = TeamEvalUtils.calcWinsAbove(
          team.adj_off,
          team.adj_def,
          //TODO: need to collect these like we do for the simple team stats view,
          // these will do for now
          [
            115.9, 113.2, 114.7, 113.4, 114.3, 114.1, 117.8, 114.6, 115.2,
            113.1,
          ],
          [99.5, 96.9, 98.7, 97.4, 98.4, 98.4, 102.1, 99.2, 100, 98.1],
          0.0
        );
        team.exp_wab = (expWinPctVsBubble - 0.5) * (wins + losses);
        //(to get a proper ranking would need to normalize games played, but this is fine for this power ranking)

        team.combo_title = (
          <p>
            <b>{team.team_name}</b>
            <br />
            <small>
              <i>
                {confNick} / {wins}-{losses} ({wab >= 0 ? "+" : ""}
                {wab.toFixed(2)})
              </i>
            </small>
          </p>
        );
        return team;
      })
      .filter((team) => {
        return confFilter({
          team: team.team_name,
          conf: team.confNick || "???",
        });
      })
      .sortBy((team) => -0.5 * (team.exp_wab || 0) - 0.5 * (team.wab || 0))
      .map((team) => {
        const tableInfo = TeamStatsTableUtils.buildRows(
          { team: team.team, year, gender },
          {
            baseline: team,
            global: team,
            on: StatModels.emptyTeam(),
            off: StatModels.emptyTeam(),
          },
          { on: [], off: [], baseline: [], other: [], global: [] },

          {
            on: { off: {}, def: {} },
            off: { off: {}, def: {} },
            other: [],
            baseline: { off: {}, def: {} },
          },
          [],

          // Page control
          {
            showPlayTypes: false,
            showRoster: false, //(won't work without more data)
            adjustForLuck: false, //(won't work without more data)
            showDiffs: false, //(NA for this view)
            showGameInfo: false,
            showShotCharts: false, //(won't work without more data)
            shotChartConfig: undefined, //(won't work without more data)
            showExtraInfo: false, //TODO takes a while to render if true maybe only do for "top" 30?
            showGrades: "", //TODO: need to play with performance
            showLuckAdjDiags: false, //(won't work without more data)
            showHelp,
          },
          {
            setShowGrades: (showGrades: string) => setShowGrades(showGrades),
            setShotChartConfig: (config: any) => {},
          },

          luckConfig,
          divisionStatsCache
        );
        return tableInfo;
      })
      .value();

    const tableRows = _.chain(rowsForEachTeam)
      .flatMap((rows, ii) => [
        ...(ii > 0 && ii % 10 == 0
          ? [
              GenericTableOps.buildHeaderRepeatRow(
                CommonTableDefs.repeatingOnOffHeaderFields,
                "small"
              ),
            ]
          : []),
        ...(rows.baseline?.teamStatsRows || []),
        GenericTableOps.buildRowSeparator(),
      ])
      .value();

    return (
      <GenericTable
        tableCopyId="teamStatsTable"
        tableFields={CommonTableDefs.onOffTable(true)}
        tableData={tableRows}
        cellTooltipMode="none"
      />
    );
  }, [gender, year, confs, dataEvent, sortBy, queryFilters]);

  // 3] View

  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return (
      !dataEvent.error &&
      (loadingOverride || (dataEvent?.teams || []).length == 0)
    );
  }

  /** Copy to clipboard button */
  const getCopyLinkButton = () => {
    const tooltip = (
      <Tooltip id="copyLinkTooltip">Copies URL to clipboard</Tooltip>
    );
    return (
      <OverlayTrigger placement="auto" overlay={tooltip}>
        <Button
          className="float-left"
          id={`copyLink_teamExplorerStatsTable`}
          variant="outline-secondary"
          size="sm"
        >
          <FontAwesomeIcon icon={faLink} />
        </Button>
      </OverlayTrigger>
    );
  };

  function stringToOption(s: string) {
    return { label: s, value: s };
  }
  const sortByOptions: Record<string, { label: string; value: string }> = {};

  return (
    <Container>
      <Form.Group as={Row}>
        <Col xs={6} sm={6} md={3} lg={2} style={{ zIndex: 12 }}>
          <Select
            value={stringToOption("Men")}
            options={["Men"].map((gender) => stringToOption(gender))}
            isSearchable={false}
            onChange={(option: any) => {
              if ((option as any)?.value) {
                /* currently only support Men */
              }
            }}
          />
        </Col>
        <Col xs={6} sm={6} md={3} lg={2} style={{ zIndex: 11 }}>
          <Select
            isDisabled={false}
            value={stringToOption(year)}
            options={DateUtils.coreYears.map((r) => stringToOption(r))}
            isSearchable={false}
            onChange={(option: any) => {
              if ((option as any)?.value) {
                setYear((option as any)?.value);
              }
            }}
          />
        </Col>
        <Col className="w-100" bsPrefix="d-lg-none d-md-none" />
        <Col xs={12} sm={12} md={5} lg={5} style={{ zIndex: 10 }}>
          <ConferenceSelector
            emptyLabel={
              year < DateUtils.yearFromWhichAllMenD1Imported
                ? `All High Tier Teams`
                : `All Teams`
            }
            confStr={confs}
            confMap={undefined}
            confs={dataEvent?.confs}
            onChangeConf={(confStr) =>
              friendlyChange(() => setConfs(confStr), confs != confStr)
            }
          />
        </Col>
        <Col lg={2} className="mt-1">
          {getCopyLinkButton()}
        </Col>
        <Col lg={1} className="mt-1">
          <GenericTogglingMenu></GenericTogglingMenu>
        </Col>
      </Form.Group>
      {hasCustomFilter ? (
        <Form.Group as={Row}>
          {hasCustomFilter ? (
            <Col xs={12} sm={12} md={8} lg={8}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id="filter">
                    Filter{maybeFilterPrompt}:
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <div className="flex-fill">
                  <TeamFilterAutoSuggestText
                    readOnly={false}
                    placeholder={`;-separated list of teams, or "BREAK;"`}
                    autocomplete={teamList
                      .concat([separatorKeyword])
                      .map((s) => s + ";")}
                    value={tmpQueryFilters}
                    onChange={(ev: any) => setTmpQueryFilters(ev.target.value)}
                    onSelectionChanged={(newStr: string) =>
                      friendlyChange(() => {
                        setQueryFilters(newStr);
                      }, newStr != queryFilters)
                    }
                    onKeyUp={(ev: any) => setTmpQueryFilters(ev.target.value)}
                  />
                </div>
              </InputGroup>
            </Col>
          ) : null}
        </Form.Group>
      ) : null}
      <Row>
        <Col>
          <LoadingOverlay
            active={needToLoadQuery()}
            spinner
            text={"Loading Team Stats Explorer..."}
          >
            {table}
          </LoadingOverlay>
        </Col>
      </Row>
    </Container>
  );
};
export default TeamStatsExplorerTable;
