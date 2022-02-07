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
   "Saint Mary's": "Saint Mary's (CA)",
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
1	Auburn	22-1	1,506	1
2	Gonzaga	19-2	1,477	2
3	Purdue	20-3	1,329	4
4	Arizona	19-2	1,300	7
5	Kentucky	19-4	1,288	5
6	Houston	20-2	1,205	6
7	Duke	19-3	1,179	9
8	Kansas	19-3	1,173	10
9	Texas Tech	18-5	947	14
10	Baylor	19-4	921	8
11	Providence	20-2	899	15
12	UCLA	16-4	881	3
13	Illinois	17-5	818	18
14	Wisconsin	18-4	706	11
15	Villanova	17-6	634	12
16	Ohio State	14-5	628	16
17	Michigan State	17-5	536	13
18	Marquette	16-7	522	24
19	Tennessee	16-6	377	22
20	Texas	17-6	294	23
21	Southern California	19-4	278	19
22	Saint Mary's	19-4	185	NR
23	Murray State	22-2	178	NR
24	UConn	15-6	118	17
25	Xavier	16-6	91	21
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 14
      }
   ).value();

/** From https://www.ncaa.com/rankings/basketball-women/d1/associated-press. Note you need to edit the names by hand */
const apPollWomen_2021_22: Record<string, number> = _.chain(`
1	South Carolina	21-1	750	1
2	Stanford	18-3	719	2
3	Louisville	21-2	679	4
4	Michigan	20-2	656	6
5	NC State	20-3	639	3
6	Arizona	17-3	583	8
7	Indiana	16-3	566	5
8	UConn	15-4	534	10
9	Iowa State	20-3	465	11
10	Baylor	17-5	462	9
11	Georgia Tech	18-4	445	12
12	Oklahoma	20-3	404	18
13	Tennessee	19-4	398	7
14	LSU	18-4	342	15
15	Maryland	17-6	337	17
16	Texas	15-6	269	13
17	Georgia	17-5	255	14
18	Notre Dame	18-5	240	20
19	Florida	17-6	166	NR
20	BYU	19-2	161	16
21	Ohio State	16-4	147	23
22	Florida Gulf Coast	21-1	140	22
23	North Carolina	18-4	136	24
24	Oregon	14-7	99	19
25	Iowa	15-6	61	21
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 14
      }
   ).value();

/** Contains NCAA/KP lookups for gender/years where we want to retrieve efficiency from the cache (current year only) */
export const apPolls: Record<string, Record<string, number>> = {
   "Women_2020/21": apPollWomen_2020_21,
   "Women_2021/22": apPollWomen_2021_22,

   "Men_2020/21": apPollMen_2020_21,
   "Men_2021/22": apPollMen_2021_22,
};
