// Lodash:
import _ from "lodash";

// @ts-ignore
import { erf } from 'mathjs';

const sqrt2 = Math.sqrt(2);

/** Wrapper for WAB and related utils */
export class TeamEvalUtils {

    /** See https://www.wolframalpha.com/input/?i=cdf+normal+distribution */
    private static cdf(val: number, mean: number, std: number): number {
        return 0.5*(1 + erf((val - mean) / (sqrt2*std)));
    }

    /** Calculate wins above bubble / elite (depending on rangeOffs/rangeDefs) */
    static calcWinsAbove(
        teamOff: number, teamDef: number,
        rangeOffs: number[], rangeDefs: number[],
        hca: number 
    ): number {
        const samples = rangeOffs.length || 1;
        return _.chain(rangeOffs).map((off, ii) => {
            const def = rangeDefs[ii]!;
            return TeamEvalUtils.cdf((teamOff - off) - (teamDef - def) - hca, 0, 11); //(I forget where 11 comes from)
        }).sum().value()/samples;
    }
};
