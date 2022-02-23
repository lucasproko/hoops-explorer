// React imports:
import React from 'react';

import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';

// Utils
import { CbbColors } from "../../utils/CbbColors";

// Component imports
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { TeamStatSet, PureStatSet } from '../../utils/StatModels';
import { DerivedStatsUtils } from '../../utils/stats/DerivedStatsUtils';

type Props = {
    name: string,
    teamStatSet: TeamStatSet,
};
const TeamExtraStatsInfoView: React.FunctionComponent<Props> = ({name, teamStatSet}) => {

    const extraStats = {} as PureStatSet;
    DerivedStatsUtils.injectDerivedStats(teamStatSet, extraStats);

    // Things I can display:
    // Off and Def:
    // - ORB related info ... scramble vs recycle, on scramble: 3PA%, FTR%, TO% -> raw efficiency (delta)
    // - transition related info ... 3PA%, FTR%, TO% -> raw efficiency (delta)
    // - assist related info ... usual

    /** See also TableDisplayUtils.injectPlayTypeInfo */
    const postOrbInfoBuilder = (offDef: "off" | "def") => {
        const scramblePct = 100*(extraStats[`${offDef}_scramble`]?.value || 0);
        const scrambleOrbRatio = 100*(extraStats[`${offDef}_scramble_per_orb`]?.value || 0);
        const scramblePpp = extraStats[`${offDef}_scramble_ppp`]?.value || 0; //TODO: include this?
        const scramblePppDelta = extraStats[`${offDef}_scramble_delta_ppp`]?.value || 0;
        const scramblePm = scramblePppDelta > 0 ? "+" : "";
  
        const effColor = offDef == "off" ? CbbColors.off_diff10_p100_redGreen : CbbColors.def_diff10_p100_redGreen;

        return scramblePct > 5 ? <li>
            [<b>{scramblePct.toFixed(1)}</b>]% scramble ([<b>{scrambleOrbRatio.toFixed(1)}</b>]% of ORBs):
            [<b style={CommonTableDefs.getTextShadow({ value: scramblePppDelta }, effColor)}>{scramblePm}{scramblePppDelta.toFixed(1)}</b>] pts/100
        </li> : <li>
            [<b>{scramblePct.toFixed(1)}</b>]% scramble
        </li>;
    };
    /** See also TableDisplayUtils.injectPlayTypeInfo */
    const transitionInfoBuilder = (offDef: "off" | "def") => {
        const transPct = 100*(extraStats[`${offDef}_trans`]?.value || 0);
        const transPpp = extraStats[`${offDef}_trans_ppp`]?.value || 0; //TODO: include this?
        const transPppDelta = extraStats[`${offDef}_trans_delta_ppp`]?.value || 0;
        const transPm = transPppDelta > 0 ? "+" : "";
  
        const offDefIndex = offDef == "off" ? 0 : 1;
        const effColor = CbbColors.diff10_p100_redGreen[offDefIndex]!;
        const transColor = CbbColors.p_trans; //(orange/blue are the same off vs def)

        return transPct > 5 ? <li>
            [<b style={CommonTableDefs.getTextShadow({ value: transPct }, transColor)}>{transPct.toFixed(1)}</b>]% transition:
            [<b style={CommonTableDefs.getTextShadow({ value: transPppDelta }, effColor)}>{transPm}{transPppDelta.toFixed(1)}</b>] pts/100
        </li> : <li>
            [<b style={CommonTableDefs.getTextShadow({ value: transPct }, transColor)}>{transPct.toFixed(1)}</b>]% transition
        </li>;
    };

    const furtherPlayBreakdownBuilder = (offDef: "off" | "def", playType: "scramble" | "trans") => {
        const toPct = 100*(extraStats[`${offDef}_${playType}_to`]?.value || 0);
        const ftr = 100*(extraStats[`${offDef}_${playType}_ftr`]?.value || 0);
        const threePtR = 100*(extraStats[`${offDef}_${playType}_3pr`]?.value || 0);
        const threePct = 100*(extraStats[`${offDef}_${playType}_3p`]?.value || 0);
        const twoPct = 100*(extraStats[`${offDef}_${playType}_2p`]?.value || 0);

        const offDefIndex = offDef == "off" ? 0 : 1;
        const toColor = CbbColors.tOver[offDefIndex]!;
        const ftrColor = CbbColors.ftr[offDefIndex]!;
        const fgrColor = CbbColors.fgr[offDefIndex]!;
        const threePctColor = CbbColors.fg3P[offDefIndex]!;
        const twoPctColor = CbbColors.fg2P[offDefIndex]!;

        return <ul>
            <li>
                TO=[<b style={CommonTableDefs.getTextShadow({ value: toPct*0.01 }, toColor)}>{toPct.toFixed(1)}</b>]%, 
                FTR=[<b style={CommonTableDefs.getTextShadow({ value: ftr*0.01 }, ftrColor)}>{ftr.toFixed(1)}</b>]%, 
                3PR=[<b style={CommonTableDefs.getTextShadow({ value: threePtR*0.01 }, fgrColor)}>{threePtR.toFixed(1)}</b>]%, 
                3P=[<b style={CommonTableDefs.getTextShadow({ value: threePct*0.01 }, threePctColor)}>{threePct.toFixed(1)}</b>]%, 
                2P=[<b style={CommonTableDefs.getTextShadow({ value: twoPct*0.01 }, twoPctColor)}>{twoPct.toFixed(1)}</b>]%
            </li>
        </ul>;
    };

    /** See also TableDisplayUtils.injectPlayTypeInfo */
    const assistInfoBuilder = (stat: TeamStatSet, offDef: "off" | "def") => {
        const rimPct = (100*(stat[`${offDef}_ast_rim`]?.value || 0));
        const midPct = (100*(stat[`${offDef}_ast_mid`]?.value || 0));
        const threePct = (100*(stat[`${offDef}_ast_3p`]?.value || 0));
        return <li>
            Assists: [3P: <b style={CommonTableDefs.getTextShadow({ value: threePct*0.01 }, CbbColors.fgr_offDef)}>{threePct.toFixed(1)}</b>%, 
            mid: <b style={CommonTableDefs.getTextShadow({ value: midPct*0.01 }, CbbColors.fgr_offDef)}>{midPct.toFixed(1)}</b>%, 
            rim: <b style={CommonTableDefs.getTextShadow({ value: rimPct*0.01 }, CbbColors.fgr_offDef)}>{rimPct.toFixed(1)}</b>%] 
        </li>;
    };

    /** See also TableDisplayUtils.injectPlayTypeInfo */
    const assistedInfoBuilder = (stat: TeamStatSet, offDef: "off" | "def") => {
        const rimPct = (100*(stat[`${offDef}_2prim_ast`]?.value || 0));
        const midPct = (100*(stat[`${offDef}_2pmid_ast`]?.value || 0));
        const threePct = (100*(stat[`${offDef}_3p_ast`]?.value || 0));
        return <li>
            Assisted: [3P: <b style={CommonTableDefs.getTextShadow({ value: threePct*0.01 }, CbbColors.p_ast_breakdown)}>{threePct.toFixed(1)}</b>%, 
            mid: <b style={CommonTableDefs.getTextShadow({ value: midPct*0.01 }, CbbColors.fgr_offDef)}>{midPct.toFixed(1)}</b>%, 
            rim: <b style={CommonTableDefs.getTextShadow({ value: rimPct*0.01 }, CbbColors.fgr_offDef)}>{rimPct.toFixed(1)}</b>%] 
        </li>;
    };
    
    /** See also TableDisplayUtils.injectPlayTypeInfo */
    const paceBuilder = () => {
        const possPer40 = extraStats[`tempo`]?.value || 0;
        return possPer40 > 0 ? 
            <span><b style={CommonTableDefs.getTextShadow({ value: possPer40 }, CbbColors.p_tempo)}>[{possPer40.toFixed(1)}]</b> poss/g</span> : undefined;
    }
    const tempoHtml = paceBuilder();
    const def_3p_SoS = teamStatSet[`def_3p_opp`]?.value || 0;

    return <span>
        <b>Extra stats info for [{name}]</b>
        <ul>
            <li><b>Offense</b></li>
            <ul>
                {transitionInfoBuilder("off")}
                {furtherPlayBreakdownBuilder("off", "trans")}
                {postOrbInfoBuilder("off")}
                {furtherPlayBreakdownBuilder("off", "scramble")}
                {assistInfoBuilder(teamStatSet, "off")}
                {assistedInfoBuilder(teamStatSet, "off")}
            </ul>
            <li><b>Defense</b></li>
            <ul>
                <li>3P SoS: [<b style={CommonTableDefs.getTextShadow({ value: 0.01*def_3p_SoS }, CbbColors.off_3P)}>{def_3p_SoS.toFixed(1)}</b>]%</li>
                {transitionInfoBuilder("def")}
                {furtherPlayBreakdownBuilder("def", "trans")}
                {postOrbInfoBuilder("def")}
                {furtherPlayBreakdownBuilder("def", "scramble")}
                {assistInfoBuilder(teamStatSet, "def")}
                {assistedInfoBuilder(teamStatSet, "def")}
            </ul>
            <li><b>Misc</b></li>
            <ul>
                <li>Raw tempo: {tempoHtml}</li>
            </ul>
        </ul>
    </span>;
};
export default TeamExtraStatsInfoView;

