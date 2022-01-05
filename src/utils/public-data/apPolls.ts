import _ from 'lodash';

/** Note you need to edit the names by hand */
const apPollMen_2021_22: Record<string, number> = _.chain(`
1,Baylor,1,-,Big 12
2,Duke,2,-,ACC
3,Purdue,3,-,Big Ten
4,Gonzaga,4,-,WCC
5,UCLA,5,-,Pac-12
6,Kansas,6,-,Big 12
7,Southern California,7,-,Pac-12
8,Arizona,9,1,Pac-12
9,Auburn,11,2,SEC
10,Michigan State,10,-,Big Ten
11,Iowa State,8,3,Big 12
12,Houston,12,-,AAC
13,Ohio State,13,-,Big Ten
14,Texas,17,3,Big 12
15,Alabama,19,4,SEC
16,Kentucky,18,2,SEC
16,Providence,21,5,Big East
18,Tennessee,14,4,SEC
19,Villanova,22,3,Big East
20,Colorado State,20,-,MWC
21,LSU,16,5,SEC
22,Xavier,23,1,Big East
23,Wisconsin,24,1,Big Ten
24,Seton Hall,15,9,Big East
25,Texas Tech,25,-,Big 12
`).split("\n").map(l => { const ab = l.split(","); return [ ab[1]?.replaceAll("State", "St."), parseInt(ab[0]) ];}).fromPairs().assign(
   {
      __week__: 9,
      __max__: 25
   }
).value();

/** Contains NCAA/KP lookups for gender/years where we want to retrieve efficiency from the cache (current year only) */
export const apPolls: Record<string, Record<string, number>> = {
   "Men_2021/22": apPollMen_2021_22
};
