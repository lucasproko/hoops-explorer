import _ from 'lodash';

/** For some reason ncaa.com has different names to stats.ncaa.org! */
const weirdNameChanges: Record<string, string> = {
   "North Carolina St.": "NC State",
   "NC St.": "NC State",
   "Connecticut": "UConn",
   "South Florida": "South Fla.",
   "Loyola (IL)": "Loyola Chicago",
   "USC": "Southern California",
};
const fixName = (t: string) => weirdNameChanges[t] || t;

/* poll archives https://www.collegepollarchive.com/ */
const apPollMen_2020_21: Record<string, number> = {"Gonzaga":1,"Illinois":2,"Baylor":3,"Michigan":4,"Alabama":5,"Houston":6,"Ohio St.":7,"Iowa":8,"Texas":9,"Arkansas":10,"Oklahoma St.":11,"Kansas":12,"West Virginia":13,"Florida St.":14,"Virginia":15,"San Diego St.":16,"Loyola Chicago":17,"Villanova":18,"Creighton":19,"Purdue":20,"Texas Tech":21,"Colorado":22,"BYU":23,"Southern California":24,"Virginia Tech":25,"__week__":17};

/* poll archives https://www.collegepollarchive.com/ */
//const apPollWomen_2019_20: Record<string, number> = {"South Carolina":1,"Oregon":2,"Baylor":3,"Maryland":4,"UConn":5,"Louisville":6,"Stanford":7,"NC State":8,"Mississippi St.":9,"UCLA":10,"Northwestern":11,"Arizona":12,"Gonzaga":13,"Oregon St.":14,"DePaul":15,"Kentucky":16,"South Dakota":17,"Texas A&M":18,"Florida St.":19,"Indiana":20,"Iowa":21,"Princeton":22,"Missouri St.":23,"Arkansas":24,"Arizona St.":25,"__week__":17}

/* poll archives https://www.collegepollarchive.com/ */
const apPollWomen_2020_21: Record<string, number> = {"UConn":1,"Stanford":2,"NC State":3,"Texas A&M":4,"Baylor":5,"South Carolina":6,"Maryland":7,"Louisville":8,"UCLA":9,"Georgia":10,"Arizona":11,"Indiana":12,"Tennessee":13,"Gonzaga":14,"Arkansas":15,"Michigan":16,"West Virginia":17,"Kentucky":18,"South Fla.":19,"Missouri St.":20,"Rutgers":21,"Ohio St.":22,"Oregon":23,"Florida Gulf Coast":24,"South Dakota St.":25,"__week__":17};

/** From https://www.ncaa.com/rankings/basketball-men/d1/associated-press. Note you need to edit the names by hand */
const apPollMen_2021_22: Record<string, number> = _.chain(`
1	Gonzaga	14-2	1,486	2
2	Auburn	16-1	1,482	4
3	Arizona	14-1	1,320	6
4	Purdue	14-2	1,255	7
5	Baylor	15-2	1,238	1
6	Duke	14-2	1,205	8
7	Kansas	14-2	1,192	9
8	Wisconsin	14-2	1,056	13
9	UCLA	11-2	1,041	3
10	Houston	15-2	1,036	11
11	Villanova	13-4	908	14
12	Kentucky	14-3	804	18
13	LSU	15-2	738	12
14	Michigan State	14-3	681	10
15	Iowa State	14-3	665	15
16	USC	14-2	618	5
17	Illinois	13-3	521	25
18	Texas Tech	13-4	509	19
19	Ohio State	11-4	465	16
20	Xavier	13-3	427	17
21	Providence	14-2	350	23
22	Loyola Chicago	13-2	193	NR
23	Texas	13-4	185	21
24	Tennessee	11-5	98	22
25	Connecticut	11-4	73	NR
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 11
      }
   ).value();

/** From https://www.ncaa.com/rankings/basketball-women/d1/associated-press. Note you need to edit the names by hand */
const apPollWomen_2021_22: Record<string, number> = _.chain(`
1	South Carolina	15-1	745	1
2	Stanford	11-3	703	2
3	Louisville	13-1	698	3
4	North Carolina State	14-2	655	5
5	Tennessee	15-1	613	7
6	Indiana	12-2	606	6
7	Arizona	11-1	561	4
8	Maryland	12-4	511	10
9	Iowa State	14-1	489	12
10	Connecticut	7-3	476	11
11	Michigan	13-2	455	8
12	LSU	15-2	403	13
13	Texas	11-2	394	9
14	Baylor	10-3	364	14
15	Georgia Tech	11-3	324	16
16	Duke	11-2	275	17
17	Georgia	13-3	243	15
18	BYU	12-1	203	18
19	Kentucky	8-4	156	21
20	Notre Dame	11-3	148	20
21	North Carolina	14-1	147	19
22	Colorado	13-0	118	NR
23	Oklahoma	13-2	109	23
24	South Florida	11-4	92	24
25	Kansas State	13-2	83	NR
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 10
      }
   ).value();

/** Contains NCAA/KP lookups for gender/years where we want to retrieve efficiency from the cache (current year only) */
export const apPolls: Record<string, Record<string, number>> = {
   "Women_2020/21": apPollWomen_2020_21,
   "Women_2021/22": apPollWomen_2021_22,

   "Men_2020/21": apPollMen_2020_21,
   "Men_2021/22": apPollMen_2021_22,
};
