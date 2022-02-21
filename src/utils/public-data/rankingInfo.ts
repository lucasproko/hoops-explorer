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
1	Gonzaga	23-2	1,525	1
2	Arizona	24-2	1,461	3
3	Auburn	24-3	1,313	2
4	Purdue	24-4	1,299	5
5	Kansas	22-4	1,297	6
6	Kentucky	22-5	1,248	4
7	Duke	23-4	1,146	9
8	Villanova	21-6	1,071	10
9	Texas Tech	21-6	1,066	11
10	Baylor	22-5	984	7
11	Providence	22-3	910	8
12	UCLA	19-5	802	13
13	Wisconsin	21-5	735	15
14	Houston	22-4	734	14
15	Illinois	19-7	666	12
16	USC	23-4	586	17
17	Tennessee	19-7	580	16
18	Arkansas	21-6	502	23
19	Murray State	26-2	371	21
20	Texas	19-8	349	20
21	UConn	19-7	340	24
22	Ohio State	16-7	320	18
23	Saint Mary's	22-6	148	NR
24	Alabama	17-10	63	25
25	Iowa	18-8	59	NR
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 16
      }
   ).value();

/** From https://www.ncaa.com/rankings/basketball-women/d1/associated-press. Note you need to edit the names by hand */
const apPollWomen_2021_22: Record<string, number> = _.chain(`
1	South Carolina	25-1	750	1
2	Stanford	23-3	720	2
3	NC State	25-3	688	4
4	Louisville	23-3	651	3
5	Baylor	21-5	619	7
6	Michigan	21-4	596	9
7	UConn	19-5	517	10
8	LSU	23-4	510	11
9	Iowa State	22-4	508	6
10	Indiana	19-5	485	5
11	Texas	19-6	469	14
12	Arizona	19-5	429	8
13	Maryland	20-7	425	13
14	Notre Dame	20-6	288	19
15	Florida	20-7	287	17
16	Tennessee	21-6	273	12
17	Ohio State	20-5	238	18
18	North Carolina	21-5	228	24
19	BYU	23-2	226	20
20	Oklahoma	20-6	212	15
21	Iowa	17-7	176	22
22	Georgia Tech	19-8	117	16
23	Virginia Tech	20-7	106	23
24	Florida Gulf Coast	24-2	62	25
25	Georgia	18-8	44	21
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
