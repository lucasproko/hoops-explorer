// React imports:
import React, { useState, useEffect } from 'react';

// Next imports:
import { NextPage } from 'next';

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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "./GenericTable"
import { RosterStatsModel } from './RosterStatsTable';
import GenericTogglingMenuItem from "./shared/GenericTogglingMenuItem";
import LuckAdjDiagView from "./diags/LuckAdjDiagView"

// Util imports
import { CbbColors } from "../utils/CbbColors"
import { GameFilterParams, ParamDefaults } from "../utils/FilterModels"
import { CommonTableDefs } from "../utils/CommonTableDefs"
import { LuckUtils, OffLuckAdjustmentDiags, DefLuckAdjustmentDiags, LuckAdjustmentBaseline } from "../utils/stats/LuckUtils";
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';

export type TeamStatsModel = {
  on: any,
  off: any,
  baseline: any,
  global: any, //(a subest of the fields, across all samples for the team)
  onOffMode: boolean,
  error_code?: string
}
type Props = {
  gameFilterParams: GameFilterParams;
  teamStats: TeamStatsModel,
  rosterStats: RosterStatsModel,
  onChangeState: (newParams: GameFilterParams) => void;
}

const TeamStatsTable: React.FunctionComponent<Props> = ({gameFilterParams, teamStats, rosterStats, onChangeState}) => {

  // 1] Data Model

  const [ adjustForLuck, setAdjustForLuck ] = useState(
    gameFilterParams.onOffLuck as undefined | LuckAdjustmentBaseline
  );
  const [ showLuckAdjDiags, setShowLuckAdjDiags ] = useState(_.isNil(gameFilterParams.showOnOffLuckDiags) ?
    ParamDefaults.defaultOnOffLuckDiagMode : gameFilterParams.showOnOffLuckDiags
  );

  useEffect(() => { //(this ensures that the filter component is up to date with the union of these fields)
    const newState = _.chain(gameFilterParams).merge({
      onOffLuck: adjustForLuck,
      showOnOffLuckDiags: showLuckAdjDiags,
    }).omit(_.flatten([ // omit all defaults
      (adjustForLuck == undefined) ? [ 'onOffLuck' ] : [],
      (showLuckAdjDiags == ParamDefaults.defaultOnOffLuckDiagMode) ? [ 'showOnOffLuckDiags' ] : []
    ])).value();
    onChangeState(newState);
  }, [ adjustForLuck, showLuckAdjDiags ]);

  // 2] Data View

  const offPrefixFn = (key: string) => "off_" + key;
  const offCellMetaFn = (key: string, val: any) => "off";
  const defPrefixFn = (key: string) => "def_" + key;
  const defCellMetaFn = (key: string, val: any) => "def";

  const maybeOn = teamStats.onOffMode ? "On ('A')" : "'A'"
  const maybeOff = teamStats.onOffMode ? "Off ('B')" : "'B'"

  // Luck calculations:

  const genderYearLookup = `${gameFilterParams.gender}_${gameFilterParams.year}`;
  const avgEfficiency = efficiencyAverages[genderYearLookup] || efficiencyAverages.fallback;

  // The luck baseline can either be the user-selecteed baseline or the entire season
  const [ baseOrSeasonTeamStats, baseOrSeason3PMap ] = (() => {
    switch (adjustForLuck) {
      case "season":
        return [
          teamStats.global, _.fromPairs((rosterStats.global || []).map((p: any) => [ p.key, p ]))
        ];
      case "baseline":
        return [
          teamStats.baseline, _.fromPairs((rosterStats.baseline || []).map((p: any) => [ p.key, p ]))
        ];
      case undefined:
        return [ {}, {} ]; //(not used)
    }
  })();

  type OnOffBase = "on" | "off" | "baseline";
  const luckAdjustment = _.fromPairs(([ "on", "off", "baseline" ] as OnOffBase[]).map(k => {
    const luckAdj = (adjustForLuck && teamStats[k]?.doc_count) ? [
      LuckUtils.calcOffTeamLuckAdj(teamStats[k], rosterStats[k] || [], baseOrSeasonTeamStats, baseOrSeason3PMap, avgEfficiency),
      LuckUtils.calcDefTeamLuckAdj(teamStats[k], baseOrSeasonTeamStats, avgEfficiency),
    ] as [OffLuckAdjustmentDiags, DefLuckAdjustmentDiags] : undefined;

    if (teamStats[k]?.doc_count) {
      LuckUtils.injectLuck(teamStats[k], luckAdj?.[0], luckAdj?.[1]);
    }
    return [ k, luckAdj ];
  })) as {
    [P in OnOffBase]: [ OffLuckAdjustmentDiags, DefLuckAdjustmentDiags ] | undefined
  };

  //(end luck calcs)

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

  const tableData = _.flatMap([
    (teamStats.on?.doc_count) ? _.flatten([
      [ GenericTableOps.buildDataRow(teamStatsOn, offPrefixFn, offCellMetaFn) ],
      [ GenericTableOps.buildDataRow(teamStatsOn, defPrefixFn, defCellMetaFn) ],
      showLuckAdjDiags && luckAdjustment.on ? [ GenericTableOps.buildTextRow(
        <LuckAdjDiagView
          name="On"
          offLuck={luckAdjustment.on[0]}
          defLuck={luckAdjustment.on[1]}
          baseline={adjustForLuck || "season"}
        />, "small pt-2"
      ) ] : [] ,
      [ GenericTableOps.buildRowSeparator() ]
    ]) : [],
    (teamStats.off?.doc_count) ? _.flatten([
      [ GenericTableOps.buildDataRow(teamStatsOff, offPrefixFn, offCellMetaFn) ],
      [ GenericTableOps.buildDataRow(teamStatsOff, defPrefixFn, defCellMetaFn) ],
      showLuckAdjDiags && luckAdjustment.off ? [ GenericTableOps.buildTextRow(
        <LuckAdjDiagView
          name="Off"
          offLuck={luckAdjustment.off[0]}
          defLuck={luckAdjustment.off[1]}
          baseline={adjustForLuck || "season"}
        />, "small pt-2"
      ) ] : [] ,
      [ GenericTableOps.buildRowSeparator() ]
    ]) : [],
    _.flatten([
      [ GenericTableOps.buildDataRow(teamStatsBaseline, offPrefixFn, offCellMetaFn) ],
      [ GenericTableOps.buildDataRow(teamStatsBaseline, defPrefixFn, defCellMetaFn) ],
      showLuckAdjDiags && luckAdjustment.baseline ? [ GenericTableOps.buildTextRow(
        <LuckAdjDiagView
          name="Baseline"
          offLuck={luckAdjustment.baseline[0]}
          defLuck={luckAdjustment.baseline[1]}
          baseline={adjustForLuck || "season"}
        />, "small pt-2"
      ) ] : [] ,
      [ GenericTableOps.buildRowSeparator() ]
    ]),
  ]);

  // 3] Utils
  /** Sticks an overlay on top of the table if no query has ever been loaded */
  function needToLoadQuery() {
    return (Object.keys(teamStats.on).length == 0) &&
      (Object.keys(teamStats.off).length == 0) &&
      (Object.keys(teamStats.baseline).length == 0);
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
      <Form.Row>
        <Col sm="11"/>
        <Form.Group as={Col} sm="1">
          <Dropdown alignRight>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              <FontAwesomeIcon icon={faCog} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <GenericTogglingMenuItem
                text="Adjust for Luck - over season"
                truthVal={adjustForLuck == "season"}
                onSelect={() => setAdjustForLuck(adjustForLuck == "season" ? undefined : "season")}
              />
              <GenericTogglingMenuItem
                text="Adjust for Luck - over baseline"
                truthVal={adjustForLuck == "baseline"}
                onSelect={() => setAdjustForLuck(adjustForLuck == "baseline" ? undefined : "baseline")}
              />
              <Dropdown.Divider />
              <GenericTogglingMenuItem
                text="Show Luck Adjustment diagnostics"
                truthVal={showLuckAdjDiags}
                onSelect={() => setShowLuckAdjDiags(!showLuckAdjDiags)}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      </Form.Row>
      <Row>
        <Col>
          <GenericTable tableCopyId="teamStatsTable" tableFields={CommonTableDefs.onOffTable} tableData={tableData}/>
        </Col>
      </Row>
    </LoadingOverlay>
  </Container>;
};

export default TeamStatsTable;
