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
1	Auburn	20-1	1,508	1
2	Gonzaga	17-2	1,475	2
3	UCLA	1,338	7
4	Purdue	18-3	1,282	6
5	Kentucky	17-4	1,195	12
6	Houston	18-2	1,164	7
7	Arizona	17-2	1,159	3
8	Baylor	18-3	1,141	4
9	Duke	17-3	1,107	9
10	Kansas	17-3	1,014	5
11	Wisconsin	17-3	938	11
12	Villanova	16-5	807	14
13	Michigan State	16-4	751	10
14	Texas Tech	16-5	741	13
15	Providence	18-2	709	17
16	Ohio State	13-5	548	16
17	UConn	15-4	483	20
18	Illinois	15-5	445	24
19	Southern California	18-3	337	15
20	Iowa State	16-5	324	23
21	Xavier	15-5	255	21
22	Tennessee	14-6	234	18
23	Texas	16-5	203	NR
24	Marquette	15-7	188	22
25	LSU	16-5	180	19
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 13
      }
   ).value();

/** From https://www.ncaa.com/rankings/basketball-women/d1/associated-press. Note you need to edit the names by hand */
const apPollWomen_2021_22: Record<string, number> = _.chain(`
1	South Carolina	20-1	748	1
2	Stanford	16-3	713	2
3	NC State	19-2	698	3
4	Louisville	18-2	657	5
5	Indiana	14-2	613	6
6	Michigan	18-2	606	7
7	Tennessee	18-2	564	4
8	Arizona	15-3	540	8
9	Baylor	15-4	466	11
10	UConn	13-4	449	10
11	Iowa State	18-3	396	13
12	Georgia Tech	17-4	381	14
13	Texas	15-4	367	9
14	Georgia	16-4	352	15
15	LSU	18-4	322	12
16	BYU	18-1	313	16
17	Maryland	15-6	288	17
18	Oklahoma	18-3	287	18
19	Oregon	14-5	226	19
20	Notre Dame	16-4	195	20
21	Iowa	14-4	132	23
22	Florida Gulf Coast	19-1	105	NR
23	Ohio State	15-4	85	22
24	North Carolina	16-4	66	NR
25	Kansas State	16-5	60	25
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 13
      }
   ).value();

/** Contains NCAA/KP lookups for gender/years where we want to retrieve efficiency from the cache (current year only) */
export const apPolls: Record<string, Record<string, number>> = {
   "Women_2020/21": apPollWomen_2020_21,
   "Women_2021/22": apPollWomen_2021_22,

   "Men_2020/21": apPollMen_2020_21,
   "Men_2021/22": apPollMen_2021_22,
};
