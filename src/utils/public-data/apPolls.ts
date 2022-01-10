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
1	Baylor	15-0	1,525	1
2	Gonzaga	12-2	1,440	4
3	UCLA	10-1	1,376	5
4	Auburn	14-1	1,193	9
5	Southern California	13-0	1,152	7
6	Arizona	12-1	1,144	8
7	Purdue	13-2	1,139	3
8	Duke	12-2	1,130	2
9	Kansas	12-2	1,031	6
10	Michigan State	13-2	1,011	10
11	Houston	14-2	949	12
12	LSU	14-1	889	21
13	Wisconsin	13-2	784	23
14	Villanova	11-4	682	19
15	Iowa State	13-2	648	11
16	Ohio State	10-3	510	13
17	Xavier	12-2	453	22
18	Kentucky	12-3	438	16
19	Texas Tech	11-3	373	25
20	Seton Hall	11-3	342	24
21	Texas	12-3	282	14
22	Tennessee	10-4	277	18
23	Providence	14-2	250	16
24	Alabama	11-4	237	15
25	Illinois	11-3	208	NR
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 9
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
