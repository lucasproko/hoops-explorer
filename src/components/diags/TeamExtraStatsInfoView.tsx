// React imports:
import React from 'react';

import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';

// Utils
import { CbbColors } from "../../utils/CbbColors";
import GenericTable, { GenericTableOps, GenericTableRow, GenericTableColProps } from "../../components/GenericTable";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Component imports
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { TeamStatSet, PureStatSet, DivisionStatistics } from '../../utils/StatModels';
import { DerivedStatsUtils } from '../../utils/stats/DerivedStatsUtils';
import { GradeUtils } from '../../utils/stats/GradeUtils';

const playTypeTable = { //accessors vs column metadata
    "title": GenericTableOps.addTitle("", "", GenericTableOps.defaultRowSpanCalculator, "", GenericTableOps.htmlFormatter),
    "sep1": GenericTableOps.addColSeparator(),
    "pct": GenericTableOps.addPctCol("%", "Percentage of possessions this play type occurs", CommonTableDefs.picker(CbbColors.trans_offDef, CbbColors.trans_offDef)),
    "pct_orbs": GenericTableOps.addPctCol("%ORB", "Percentage of Off rebounds resulting in a scramble play type", CbbColors.alwaysWhite),
    "delta_ppp": GenericTableOps.addPtsCol(<span>&Delta;/100</span>, "Delta points per 100 possessions between overall play and this play type", CommonTableDefs.picker(...CbbColors.diff35_p100_redGreen)),
    "sep2": GenericTableOps.addColSeparator(),
    "to": GenericTableOps.addPctCol("TO%", "Turnover % for this play type", CommonTableDefs.picker(...CbbColors.tOver)),
    "ftr": GenericTableOps.addPctCol("FTR", "Free throw rate  for this play type", CommonTableDefs.picker(...CbbColors.ftr)),
    "3pr": GenericTableOps.addPctCol("3PR", "Percentage of 3 pointers taken against all field goals for this play type", CommonTableDefs.picker(...CbbColors.fgr)),
    "sep3": GenericTableOps.addColSeparator(),
    "3p": GenericTableOps.addPctCol("3P%", "3 point field goal percentage for this play type", CommonTableDefs.picker(...CbbColors.fg3P)),
    "2p": GenericTableOps.addPctCol("2P%", "2 point field goal percentage for this play type", CommonTableDefs.picker(...CbbColors.fg2P)),
};

const assistDetailsTable = {
    "title": GenericTableOps.addTitle("", "", GenericTableOps.defaultRowSpanCalculator, "", GenericTableOps.htmlFormatter),
    "sep1": GenericTableOps.addColSeparator(), 
    "3p_ast": GenericTableOps.addPctCol("3P", "% of assists for 3P", CommonTableDefs.picker(...CbbColors.fgr)),
    "mid_ast": GenericTableOps.addPctCol("Mid", "% of assists for mid-range 2P", CommonTableDefs.picker(...CbbColors.fgr)),
    "rim_ast": GenericTableOps.addPctCol("Mid", "% of assists for 2PAs at the rim", CommonTableDefs.picker(...CbbColors.fgr)),
    "sep2": GenericTableOps.addColSeparator(), 
    "ast_3p": GenericTableOps.addPctCol("3P", "% of assists for 3P", CommonTableDefs.picker(...CbbColors.fgr)),
    "ast_mid": GenericTableOps.addPctCol("Mid", "% of assists for mid-range 2P", CommonTableDefs.picker(...CbbColors.fgr)),
    "ast_rim": GenericTableOps.addPctCol("Mid", "% of assists for 2PAs at the rim", CommonTableDefs.picker(...CbbColors.fgr)),
};

type GradeProps = {
    comboTier?: DivisionStatistics,
    highTier?: DivisionStatistics,
    mediumTier?: DivisionStatistics,
    lowTier?: DivisionStatistics 
};
type Props = {
    name: string,
    teamStatSet: TeamStatSet,
    showGrades: string,
    grades?: GradeProps
};
const TeamExtraStatsInfoView: React.FunctionComponent<Props> = ({name, teamStatSet, showGrades, grades}) => {
    const tiers = { //(handy LUT)
        High: grades?.highTier,
        Medium: grades?.mediumTier,
        Low: grades?.lowTier,
        Combo: grades?.comboTier
     } as Record<string, DivisionStatistics | undefined>;

    // Build %ile/rank handling, in case we have show grades enabled
    const gradeFormat = showGrades.split(":")[0];
    const tierStrTmp = showGrades.split(":")?.[1] || "Combo";
    const tierStr = tiers[tierStrTmp] ? tierStrTmp : (tiers["Combo"] ? "Combo" : (tiers["High"] ? "High" : tierStrTmp));
        //(if set tier doesn't exist just fallback)
    const tierToUse = tiers[tierStr]; 

    // Build derived stats and inject into extraStats
    const extraStats = { def_3p_opp: teamStatSet.def_3p_opp  } as PureStatSet;
    DerivedStatsUtils.injectTeamDerivedStats(teamStatSet, extraStats);

    // And now maybe build ranks/%iles:
    const teamPercentiles = tierToUse ? GradeUtils.buildTeamPercentiles(
         tierToUse, extraStats, GradeUtils.derivedFields, gradeFormat == "rank"
    )  : {};

    const offPrefixFn = (key: string) => "off_" + key;
    const offCellMetaFn = (key: string, val: any) => "off";
    const defPrefixFn = (key: string) => "def_" + key;
    const defCellMetaFn = (key: string, val: any) => "def";
    const offDef = "off";
    const buildPlayTypeDataRow = (offDef: "off" | "def", playType: "trans" | "scramble") => {
        const offNotDef = offDef == "off";
        const isTrans = playType == "trans";
        const pct = extraStats[`${offDef}_${playType}`]?.value || 0;
        return GenericTableOps.buildDataRow({
            [`${offDef}_title`]: `${isTrans ? "Transition" : "Scramble"} ${offNotDef ? "Offense" : "Defense"}`,
            [`${offDef}_pct`]: extraStats[`${offDef}_${playType}`],
            [`${offDef}_pct_orbs`]: isTrans ? undefined : extraStats[`${offDef}_scramble_per_orb`],
            [`${offDef}_delta_ppp`]: (pct > 0) ? extraStats[`${offDef}_${playType}_delta_ppp`] : undefined,

            [`${offDef}_to`]: extraStats[`${offDef}_${playType}_to`],
            [`${offDef}_ftr`]: extraStats[`${offDef}_${playType}_ftr`],
            [`${offDef}_3pr`]: extraStats[`${offDef}_${playType}_3pr`],

            [`${offDef}_3p`]: extraStats[`${offDef}_${playType}_3p`],
            [`${offDef}_2p`]: extraStats[`${offDef}_${playType}_2p`],

        }, offNotDef ? offPrefixFn : defPrefixFn, offNotDef ? offCellMetaFn : defCellMetaFn, 
            isTrans ? undefined : {
                pct: GenericTableOps.addPctCol("%", "Percentage of possessions this play type occurs", CbbColors.alwaysWhite)
            });
    };
    const playTypeTableData = [
        buildPlayTypeDataRow("off", "trans"),
        buildPlayTypeDataRow("off", "scramble"),
        GenericTableOps.buildRowSeparator(),
        buildPlayTypeDataRow("def", "trans"),
        buildPlayTypeDataRow("def", "scramble"),
    ];

    const buildAssistDataRow = (offDef: "off" | "def") => {
        const offNotDef = offDef == "off";
        return GenericTableOps.buildDataRow({
            [`${offDef}_title`]: `${offNotDef ? "Offensive" : "Defensive"} assist details`,

            ...(
                _.chain([ "3p", "mid", "rim" ]).flatMap(field => {
                    return [
                        [ `${offDef}_${field}_ast`, teamStatSet[`${offDef}_ast_${field}`] ],
                        [ `${offDef}_ast_${field}`, teamStatSet[`${offDef}_${field == "3p" ? field : `2p${field}`}_ast`] ],
                    ];
                }).fromPairs().value()
            )
            
        }, offNotDef ? offPrefixFn : defPrefixFn, offNotDef ? offCellMetaFn : defCellMetaFn);
    };

    const assistTableData = [
        GenericTableOps.buildSubHeaderRow([
            ["", 2],
            [<i>Assist distribution</i>, 3],
            ["", 1],
            [<i>% of these shots assisted</i>, 3]
        ] as [string, number][], "text-center"),
        buildAssistDataRow("off"),
        buildAssistDataRow("def")
    ];

    const possPer40 = extraStats[`tempo`]?.value || 0;
    const tempoHtml = possPer40 > 0 ? 
        <span>
            <b style={CommonTableDefs.getTextShadow({ value: possPer40 }, CbbColors.p_tempo)}>[{possPer40.toFixed(1)}]</b> poss/g
        </span> : undefined;
    const def_3p_SoS = teamStatSet[`def_3p_opp`]?.value || 0;

    return <span>
        <b>Extra stats info for [{name}]</b>
        <br/><br/>
        <a>Play type stats:</a>
        <Container>
            <Row>
                <Col xs={12} lg={8}>
                    <GenericTable
                        tableCopyId={`playTypeStats_${name}`}
                        tableFields={playTypeTable} 
                        tableData={playTypeTableData}
                    />
                </Col>
            </Row>
        </Container>
        <a>More assist stats:</a>
        <Container>
            <Row>
                <Col xs={12} lg={8}>
                    <GenericTable
                        tableCopyId={`assistStats_${name}`}
                        tableFields={assistDetailsTable} 
                        tableData={assistTableData}
                    />
                </Col>
            </Row>
        </Container>
        <a>Misc other stats:</a>
        <ul>
            <li>3P Defensive SoS: [<b style={CommonTableDefs.getTextShadow({ value: 0.01*def_3p_SoS }, CbbColors.off_3P)}>{def_3p_SoS.toFixed(1)}</b>]%
            </li>
            <li>Raw tempo: {tempoHtml}</li>
        </ul>                
    </span>;
};
export default TeamExtraStatsInfoView;

