// React imports:
import React, { useState } from "react";

// Next imports:
import { NextPage } from "next";

import _ from "lodash";

// Bootstrap imports:
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

// Utils
import {
  PosFamilyNames,
  PlayTypeUtils,
  TargetAssistInfo,
} from "../../utils/stats/PlayTypeUtils";
import { PlayTypeDiagUtils } from "../../utils/tables/PlayTypeDiagUtils";

// Component imports
import GenericTable, { GenericTableOps } from "../GenericTable";
import {
  IndivStatSet,
  PureStatSet,
  RosterStatsByCode,
  StatModels,
  TeamStatSet,
} from "../../utils/StatModels";
import { FeatureFlags } from "../../utils/stats/FeatureFlags";
import TeamPlayTypeDiagRadar from "./TeamPlayTypeDiagRadar";

type Props = {
  title: string;
  players: Array<IndivStatSet>;
  rosterStatsByCode: RosterStatsByCode;
  teamStats: TeamStatSet;
  teamSeasonLookup: string;
  quickSwitchOptions?: Props[];
  showHelp: boolean;
};
const TeamPlayTypeDiagView: React.FunctionComponent<Props> = ({
  title,
  players: playersIn,
  rosterStatsByCode,
  teamStats: teamStatsIn,
  teamSeasonLookup,
  quickSwitchOptions,
  showHelp,
}) => {
  const [quickSwitch, setQuickSwitch] = useState<string | undefined>(undefined);
  const players =
    (quickSwitch
      ? _.find(quickSwitchOptions || [], (opt) => opt.title == quickSwitch)
          ?.players
      : playersIn) || [];
  const teamStats =
    (quickSwitch
      ? _.find(quickSwitchOptions || [], (opt) => opt.title == quickSwitch)
          ?.teamStats
      : teamStatsIn) || StatModels.emptyTeam();

  const [tableType, setTableType] = useState<"scoring" | "usage" | "breakdown">(
    FeatureFlags.isActiveWindow(FeatureFlags.betterStyleAnalysis)
      ? "breakdown"
      : "scoring"
  );

  const [reorderedPosVsPosAssistNetwork, maybeExtraNetwork] = _.thru(
    tableType,
    () => {
      if (tableType == "scoring") {
        return [
          PlayTypeUtils.buildCategorizedAssistNetworks(
            "scoringPlaysPct",
            false,
            players,
            rosterStatsByCode,
            teamStats
          ),
          undefined,
        ];
      } else {
        const network1 = PlayTypeUtils.buildCategorizedAssistNetworks(
          "playsPct",
          true,
          players,
          rosterStatsByCode,
          teamStats
        );
        const network2 = PlayTypeUtils.buildCategorizedAssistNetworks(
          "pointsPer100",
          true,
          players,
          rosterStatsByCode,
          teamStats
        );
        return [network1, network2];
      }
    }
  );

  const tooltipBuilder = (id: string, title: string, tooltip: string) => (
    <OverlayTrigger
      placement="auto"
      overlay={<Tooltip id={id + "Tooltip"}>{tooltip}</Tooltip>}
    >
      <i>{title}</i>
    </OverlayTrigger>
  );

  const quickSwitchBuilder = _.map(
    quickSwitchOptions || [],
    (opt) => opt.title
  ).map((t, index) => {
    return (
      <div key={`quickSwitch-${index}`}>
        [
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setQuickSwitch(quickSwitch == t ? undefined : t); //(ie toggle)
          }}
        >
          {t}
        </a>
        ]&nbsp;
      </div>
    );
  });

  const rawAssistTableData = (
    tableType == "scoring"
      ? [
          GenericTableOps.buildTextRow(
            <Row>
              <Col xs={3}></Col>
              <Col xs={3} className="d-flex justify-content-center">
                <i>
                  <span>Scored / Assisted By:</span>
                </i>
              </Col>
              <Col xs={6} className="d-flex justify-content-center">
                <i>
                  <span>Assists:</span>
                </i>
              </Col>
            </Row>
          ),
        ]
      : []
  ).concat(
    _.chain(reorderedPosVsPosAssistNetwork)
      .toPairs()
      .flatMap((kv, ix) => {
        const posTitle = kv[0];
        const assistInfo = kv[1].assists;
        const otherInfo = kv[1].other;

        const extraAssistInfo = maybeExtraNetwork?.[posTitle]?.assists;
        const extraOtherInfo = maybeExtraNetwork?.[posTitle]?.other;

        const asStatSet = (
          targetAssistInfo: TargetAssistInfo | undefined
        ): IndivStatSet => (targetAssistInfo || {}) as unknown as IndivStatSet;

        return [
          GenericTableOps.buildDataRow(
            {
              title: <b>{_.capitalize(posTitle)} from/to:</b>,
            },
            GenericTableOps.defaultFormatter,
            GenericTableOps.defaultCellMeta
          ),
          GenericTableOps.buildDataRow(
            {
              ...PlayTypeDiagUtils.buildInfoRow(
                PlayTypeUtils.enrichUnassistedStats(otherInfo[0]!, ix),
                asStatSet(extraOtherInfo?.[0])
              ),
              title: tooltipBuilder(
                "unassisted",
                "Unassisted",
                `All scoring plays where the ${posTitle} was unassisted (includes FTs which can never be assisted). Includes half court, scrambles, and transition.`
              ),
            },
            GenericTableOps.defaultFormatter,
            GenericTableOps.defaultCellMeta
          ),
          GenericTableOps.buildDataRow(
            {
              ...PlayTypeDiagUtils.buildInfoRow(
                otherInfo[1]!,
                asStatSet(extraOtherInfo?.[1])
              ),
              title: tooltipBuilder(
                "assist",
                "Assist totals:",
                `All plays where the  ${posTitle} was assisted (left half) or provided the assist (right half). ` +
                  "The 3 rows below break down assisted plays according to the positional category of the assister/assistee. " +
                  "(Includes half court, scramble, and transitions)"
              ),
            },
            GenericTableOps.defaultFormatter,
            GenericTableOps.defaultCellMeta
          ),
        ]
          .concat(
            GenericTableOps.buildRowSeparator(),
            assistInfo
              .map((info: any, index: number) =>
                PlayTypeDiagUtils.buildInfoRow(
                  info,
                  asStatSet(extraAssistInfo?.[index])
                )
              )
              .map((info: any) =>
                GenericTableOps.buildDataRow(
                  {
                    ...info,
                    title: (
                      <span>
                        <i>{_.capitalize(PosFamilyNames[info.order])}</i>
                      </span>
                    ),
                  },
                  GenericTableOps.defaultFormatter,
                  GenericTableOps.defaultCellMeta
                )
              )
          )
          .concat([
            GenericTableOps.buildRowSeparator(),
            GenericTableOps.buildDataRow(
              {
                ...PlayTypeDiagUtils.buildInfoRow(
                  otherInfo[2]!,
                  asStatSet(extraOtherInfo?.[2])
                ),
                title: tooltipBuilder(
                  "trans",
                  "In transition",
                  "All plays (assisted or unassisted) that are classified as 'in transition', normally shots taken rapidly after a rebound, miss, or make in the other direction."
                ),
              },
              GenericTableOps.defaultFormatter,
              GenericTableOps.defaultCellMeta
            ),
            GenericTableOps.buildDataRow(
              {
                ...PlayTypeDiagUtils.buildInfoRow(
                  otherInfo[3]!,
                  asStatSet(extraOtherInfo?.[3])
                ),
                title: tooltipBuilder(
                  "scramble",
                  "Scrambles after RB",
                  "All plays (assisted or unassisted) that occur in the aftermath of an offensive rebound, where the offense does not get reset before scoring. " +
                    "Examples are putbacks (unassisted) or tips to other players (assisted)"
                ),
              },
              GenericTableOps.defaultFormatter,
              GenericTableOps.defaultCellMeta
            ),
            GenericTableOps.buildRowSeparator(),
          ]);
      })
      .value()
  );

  const maybeBold = (boldIf: String, el: React.ReactElement) => {
    if (boldIf == tableType) {
      return <b>{el}</b>;
    } else {
      return el;
    }
  };

  const scoringToggle = maybeBold(
    "scoring",
    <a
      href="#"
      onClick={(event) => {
        event.preventDefault();
        setTableType("scoring");
      }}
    >
      Scoring
    </a>
  );
  const usageToggle = maybeBold(
    "usage",
    <a
      href="#"
      onClick={(event) => {
        event.preventDefault();
        setTableType("usage");
      }}
    >
      Usage
    </a>
  );

  const breakdownToggle = maybeBold(
    "breakdown",
    <a
      href="#"
      onClick={(event) => {
        event.preventDefault();
        setTableType("breakdown");
      }}
    >
      Play Types
    </a>
  );

  return (
    <span>
      {/*JSON.stringify(_.chain(teamStats).toPairs().filter(kv => kv[0].indexOf("trans") >= 0).values(), tidyNumbers, 3)*/}
      <br />
      <span style={{ display: "flex" }}>
        <b>Scoring Analysis: [{quickSwitch || title}]</b>
        {_.isEmpty(quickSwitchOptions) ? null : (
          <div style={{ display: "flex" }}>
            &nbsp;|&nbsp;<i>quick-toggles:</i>&nbsp;{quickSwitchBuilder}
          </div>
        )}
      </span>
      {FeatureFlags.isActiveWindow(FeatureFlags.betterStyleAnalysis) ? (
        <span>
          ({scoringToggle} // {usageToggle} // {breakdownToggle})
        </span>
      ) : null}
      <br />
      <br />
      {tableType == "breakdown" ? (
        <TeamPlayTypeDiagRadar
          players={players}
          rosterStatsByCode={rosterStatsByCode}
          teamStats={teamStats}
          teamSeasonLookup={teamSeasonLookup}
          showHelp={showHelp}
        />
      ) : (
        <Container>
          <Col xs={10}>
            <GenericTable
              responsive={false}
              tableCopyId="teamAssistNetworks"
              tableFields={PlayTypeDiagUtils.rawAssistTableFields(
                false,
                true,
                tableType,
                tableType == "usage"
              )}
              tableData={rawAssistTableData}
            />
          </Col>
        </Container>
      )}
    </span>
  );
};
export default TeamPlayTypeDiagView;
