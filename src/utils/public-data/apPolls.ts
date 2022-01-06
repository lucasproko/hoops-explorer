import _ from 'lodash';

/** For some reason ncaa.com has different names to stats.ncaa.org! */
const weirdNameChanges: Record<string, string> = {
   "North Carolina St.": "NC State",
   "NC St.": "NC State",
   "Connecticut": "UConn",
   "South Florida": "South Fla.",
   "Loyola (IL)": "Loyola Chicago",
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
1	Baylor	13-0	1,525	1
2	Duke	11-1	1,447	2
3	Purdue	12-1	1,376	3
4	Gonzaga	11-2	1,314	4
5	UCLA	8-1	1,287	5
6	Kansas	11-1	1,237	6
7	Southern California	12-0	1,015	7
8	Arizona	11-1	1,013	9
9	Auburn	12-1	976	11
10	Michigan State	12-2	934	10
11	Iowa State	12-1	896	8
12	Houston	12-2	849	12
13	Ohio State	9-2	819	13
14	Texas	11-2	640	17
15	Alabama	10-3	589	19
16	Providence	13-1	560	21
16	Kentucky	11-2	560	18
18	Tennessee	9-3	519	14
19	Villanova	9-4	437	22
20	Colorado State	10-0	386	20
21	LSU	12-1	371	16
22	Xavier	11-2	270	23
23	Wisconsin	10-2	221	24
24	Seton Hall	9-3	174	15
25	Texas Tech	10-2	142	25
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 9
      }
   ).value();

/** From https://www.ncaa.com/rankings/basketball-women/d1/associated-press. Note you need to edit the names by hand */
const apPollWomen_2021_22: Record<string, number> = _.chain(`
1	South Carolina	13-1	737	1
2	Stanford	9-3	694	2
3	Louisville	12-1	691	3
4	Arizona	10-0	660	4
5	North Carolina State	12-2	636	5
6	Indiana	11-2	578	8
7	Tennessee	13-1	571	7
8	Michigan	12-1	540	9
9	Texas	10-1	483	12
10	Maryland	10-4	478	6
11	Connecticut	6-3	462	11
12	Iowa State	12-1	429	14
13	LSU	14-1	365	19
14	Baylor	10-3	355	10
15	Georgia	12-2	318	13
16	Georgia Tech	10-3	287	16
17	Duke	10-2	232	15
18	BYU	10-1	183	18
19	North Carolina	13-0	162	24
20	Notre Dame	11-3	130	17
21	Kentucky	7-3	122	20
22	Iowa	7-3	119	21
23	Oklahoma	12-1	118	NR
24	South Florida	10-4	92	22
25	Texas A&M	10-3	58	23
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 9
      }
   ).value();

/** Contains NCAA/KP lookups for gender/years where we want to retrieve efficiency from the cache (current year only) */
export const apPolls: Record<string, Record<string, number>> = {
   "Women_2020/21": apPollWomen_2020_21,
   "Women_2021/22": apPollWomen_2021_22,

   "Men_2020/21": apPollMen_2020_21,
   "Men_2021/22": apPollMen_2021_22,
};
