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
1	Auburn	18-1	1,504	2
2	Gonzaga	15-2	1,475	1
3	Arizona	16-1	1,381	3
4	Baylor	17-2	1,335	5
5	Kansas	16-2	1,281	7
6	Purdue	16-3	1,119	4
7	UCLA	13-2	1,116	9
7	Houston	17-2	1,116	10
9	Duke	15-3	1,017	6
10	Michigan State	15-3	979	14
11	Wisconsin	15-3	894	8
12	Kentucky	15-4	822	12
13	Texas Tech	15-4	766	18
14	Villanova	14-5	713	11
15	Southern California	16-2	711	16
16	Ohio State	12-4	584	19
17	Providence	16-2	542	21
18	Tennessee	13-5	419	24
19	LSU	15-4	399	13
20	UConn	13-4	284	25
21	Xavier	14-4	269	20
22	Marquette	14-6	177	NR
23	Iowa State	14-5	167	15
24	Illinois	13-5	155	17
25	Davidson	16-2	132	NR
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 12
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
