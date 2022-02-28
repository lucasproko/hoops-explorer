import _ from 'lodash';

/** For some reason ncaa.com has different names to stats.ncaa.org! */
const weirdNameChanges: Record<string, string> = {
   "North Carolina St.": "NC State",
   "NC St.": "NC State",
   "Connecticut": "UConn",
   "South Florida": "South Fla.",
   "Loyola (IL)": "Loyola Chicago",
   "USC": "Southern California",
   "Southern Cal": "Southern California",
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
1	Gonzaga	24-3	1,504	1
2	Arizona	25-3	1,360	2
3	Baylor	24-5	1,342	10
4	Duke	25-4	1,306	7
5	Auburn	25-4	1,268	3
6	Kansas	23-5	1,224	5
7	Kentucky	23-6	1,215	6
8	Purdue	24-5	1,129	4
9	Providence	24-3	1,021	11
10	Wisconsin	23-5	865	13
11	Villanova	21-7	861	8
12	Texas Tech	22-7	850	9
13	Tennessee	21-7	770	17
14	Arkansas	23-6	759	18
14	Houston	24-4	759	14
16	Southern Cal	25-4	557	16
17	UCLA	21-6	498	12
18	UConn	21-7	480	21
19	Saint Mary's	24-6	449	23
20	Illinois	20-8	383	15
21	Texas	21-8	364	20
22	Murray State	28-2	333	19
23	Ohio State	18-8	191	22
24	Iowa	20-8	99	25
25	Alabama	19-10	90	24
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 17
      }
   ).value();

/** From https://www.ncaa.com/rankings/basketball-women/d1/associated-press. Note you need to edit the names by hand */
const apPollWomen_2021_22: Record<string, number> = _.chain(`
1	South Carolina	27-1	750	1
2	Stanford	25-3	719	2
3	NC State	26-3	687	3
4	Louisville	25-3	659	4
5	Baylor	23-5	626	5
6	LSU	25-4	567	8
7	UConn	22-5	555	7
8	Iowa State	24-4	527	9
9	Texas	21-6	510	11
10	Michigan	22-5	492	6
11	Maryland	21-7	460	13
12	Iowa	20-7	395	21
13	Ohio State	22-5	329	17
14	Indiana	19-7	327	10
14	Arizona	20-6	327	12
16	North Carolina	23-5	300	18
17	BYU	25-2	258	19
18	Tennessee	22-7	245	16
19	Oklahoma	22-6	244	20
20	Notre Dame	21-7	224	14
21	Virginia Tech	21-8	113	23
22	Florida Gulf Coast	26-2	103	24
23	Florida	20-9	89	15
24	Georgia	20-8	51	25
25	Georgia Tech	20-9	50	22
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 16
      }
   ).value();

/** Contains NCAA/KP lookups for gender/years where we want to retrieve efficiency from the cache (current year only) */
export const apPolls: Record<string, Record<string, number>> = {
   "Women_2020/21": apPollWomen_2020_21,
   "Women_2021/22": apPollWomen_2021_22,

   "Men_2020/21": apPollMen_2020_21,
   "Men_2021/22": apPollMen_2021_22,
};
