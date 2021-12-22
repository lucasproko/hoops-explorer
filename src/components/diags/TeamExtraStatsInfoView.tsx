// React imports:
import React from 'react';

import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Utils
import { CbbColors } from "../../utils/CbbColors";

// Component imports
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { TeamStatSet } from '../../utils/StatModels';

type Props = {
    name: string,
    teamStatSet: TeamStatSet,
};
const TeamExtraStatsInfoView: React.FunctionComponent<Props> = ({name, teamStatSet}) => {

    //TODO things I can display:
    // Off and Def:
    // - ORB related info ... scramble vs recycle, on scramble: 3PA%, FTR%, TO% -> raw efficiency (delta)
    // - transition related info ... 3PA%, FTR%, TO% -> raw efficiency (delta)
    // - assist related info ... usual

    /** See also TableDisplayUtils.injectPlayTypeInfo */
    const postOrbInfoBuilder = (stat: TeamStatSet, offDef: "off" | "def") => {
        const totalPoss = stat[`total_${offDef}_poss`]?.value || 1;
        const scramblePct = 100*(stat[`total_${offDef}_scramble_poss`]?.value || 0)/totalPoss;
        const totalPpp = (stat[`${offDef}_ppp`]?.value || 0); //TODO: depends on player vs team/lineup
        const scramblePpp = (stat[`${offDef}_scramble_ppp`]?.value || 0) ;
        const scramblePppDelta = scramblePpp - totalPpp;
        const scramblePm = scramblePppDelta > 0 ? "+" : "";
  
        const effColor = offDef == "off" ? CbbColors.off_diff10_p100_redGreen : CbbColors.def_diff10_p100_redGreen;

        return scramblePct > 5 ? <li>
            [<b>{scramblePct.toFixed(1)}</b>]% scramble:
            [<b style={CommonTableDefs.getTextShadow({ value: scramblePppDelta }, effColor)}>{scramblePm}{scramblePppDelta.toFixed(1)}</b>] pts/100
        </li> : <li>
            [<b>{scramblePct.toFixed(1)}</b>]% scramble
        </li>;
    };
    /** See also TableDisplayUtils.injectPlayTypeInfo */
    const transitionInfoBuilder = (stat: TeamStatSet, offDef: "off" | "def") => {
        const totalPoss = stat[`total_${offDef}_poss`]?.value || 1;
        const transPct = 100*(stat[`total_${offDef}_trans_poss`]?.value || 0)/totalPoss;
        const totalPpp = (stat[`${offDef}_ppp`]?.value || 0); 
        const transPpp = (stat[`${offDef}_trans_ppp`]?.value || 0);
        const transPppDelta = transPpp - totalPpp;
        const transPm = transPppDelta > 0 ? "+" : "";
  
        const effColor = offDef == "off" ? CbbColors.off_diff10_p100_redGreen : CbbColors.def_diff10_p100_redGreen;
        const transColor = CbbColors.p_trans; //(orange/blue are the same off vs def)

        return transPct > 5 ? <li>
            [<b style={CommonTableDefs.getTextShadow({ value: transPct }, transColor)}>{transPct.toFixed(1)}</b>]% transition:
            [<b style={CommonTableDefs.getTextShadow({ value: transPppDelta }, effColor)}>{transPm}{transPppDelta.toFixed(1)}</b>] pts/100
        </li> : <li>
            [<b style={CommonTableDefs.getTextShadow({ value: transPct }, transColor)}>{transPct.toFixed(1)}</b>]% transition
        </li>;
    };
    /** See also TableDisplayUtils.injectPlayTypeInfo */
    const paceBuilder = (stat: TeamStatSet) => {
        const totalOffPoss = stat[`off_poss`]?.value || 0;
        const totalDefPoss = stat[`def_poss`]?.value || 0;
        const totalTime = stat[`duration_mins`]?.value || 0;
        const possPer40 = 0.5*(totalOffPoss + totalDefPoss) / (totalTime/40);
        return totalTime > 0 ? 
            <span><b style={CommonTableDefs.getTextShadow({ value: possPer40 }, CbbColors.p_tempo)}>[{possPer40.toFixed(1)}]</b> poss/g</span> : undefined;
    }
    const tempoHtml = paceBuilder(teamStatSet);
    const def_3p_SoS = teamStatSet[`def_3p_opp`]?.value || 0;

    return <span>
        <b>Extra stats info for [{name}]</b>
        <ul>
            <li><b>Offense</b></li>
            <ul>
                {transitionInfoBuilder(teamStatSet, "off")}
                {postOrbInfoBuilder(teamStatSet, "off")}
            </ul>
            <li><b>Defense</b></li>
            <ul>
                <li>3P SoS: [<b style={CommonTableDefs.getTextShadow({ value: 0.01*def_3p_SoS }, CbbColors.off_3P)}>{def_3p_SoS.toFixed(1)}</b>]%</li>
                {transitionInfoBuilder(teamStatSet, "def")}
                {postOrbInfoBuilder(teamStatSet, "def")}
            </ul>
            <li><b>Misc</b></li>
            <ul>
                <li>Raw tempo: {tempoHtml}</li>
            </ul>
        </ul>
    </span>;
};
export default TeamExtraStatsInfoView;

