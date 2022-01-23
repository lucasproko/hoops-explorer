import _ from 'lodash';

/** For some reason ncaa.com has different names to stats.ncaa.org! */
const weirdNameChanges: Record<string, string> = {
   "North Carolina St.": "NC State",
   "NC St.": "NC State",
   "Connecticut": "UConn",
   "South Florida": "South Fla.",
   "Loyola (IL)": "Loyola Chicago",
   "USC": "Southern California",
   "Florida Gulf Coast": "FGCU",
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
1	South Carolina	17-1	747	1
2	Stanford	13-3	701	2
3	Louisville	15-1	694	3
4	NC State	16-2	661	4
5	Tennessee	17-1	633	5
6	Indiana	14-2	607	6
7	Iowa State	16-1	542	9
8	Michigan	15-2	529	11
9	UConn	9-3	510	10
10	Arizona	12-2	466	7
11	LSU	17-2	464	12
12	Maryland	12-5	406	8
13	Georgia	13-3	310	17
14	Oklahoma	15-2	306	23
15	Baylor	11-4	295	14
15	Texas	12-3	295	13
17	BYU	14-1	275	18
18	Georgia Tech	13-4	263	15
19	Notre Dame	13-3	262	20
20	North Carolina	14-2	133	21
21	Duke	11-4	125	16
22	Colorado	13-1	119	22
23	Kentucky	8-5	83	19
24	Florida Gulf Coast	15-1	80	NR
25	Iowa	10-4	52	NR
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 11
      }
   ).value();

/** Contains NCAA/KP lookups for gender/years where we want to retrieve efficiency from the cache (current year only) */
export const apPolls: Record<string, Record<string, number>> = {
   "Women_2020/21": apPollWomen_2020_21,
   "Women_2021/22": apPollWomen_2021_22,

   "Men_2020/21": apPollMen_2020_21,
   "Men_2021/22": apPollMen_2021_22,
};
