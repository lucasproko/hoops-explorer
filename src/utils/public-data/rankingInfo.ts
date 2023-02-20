import _ from 'lodash';

/** For some reason ncaa.com has different names to stats.ncaa.org! */
const weirdNameChanges: Record<string, string> = {
   "North Carolina St.": "NC State",
   "NC St.": "NC State",
   "UNC": "North Carolina",
   "Connecticut": "UConn",
   "South Florida": "South Fla.",
   "Loyola (IL)": "Loyola Chicago",
   "USC": "Southern California",
   "Southern Cal": "Southern California",
   "Florida Gulf Coast": "FGCU",
   "USF": "South Fla.",
   "Saint Mary's": "Saint Mary's (CA)",
   "Miami (Fl.)": "Miami (FL)",
   "Miami (Fla.)": "Miami (FL)",
   "St. John's": "St. John's (NY)",
   "Charleston": "Col. of Charleston",
   "Florida Atlantic": "Fla. Atlantic"
};
const fixName = (t: string) => weirdNameChanges[t] || t;

////////////////////////////////////////////////////////////////

// AP Rankings

/* poll archives https://www.collegepollarchive.com/ */
const apPollMen_2020_21: () => Record<string, number> = () => { return {"Gonzaga":1,"Illinois":2,"Baylor":3,"Michigan":4,"Alabama":5,"Houston":6,"Ohio St.":7,"Iowa":8,"Texas":9,"Arkansas":10,"Oklahoma St.":11,"Kansas":12,"West Virginia":13,"Florida St.":14,"Virginia":15,"San Diego St.":16,"Loyola Chicago":17,"Villanova":18,"Creighton":19,"Purdue":20,"Texas Tech":21,"Colorado":22,"BYU":23,"Southern California":24,"Virginia Tech":25,"__week__":17} };

/* poll archives https://www.collegepollarchive.com/ */
const apPollWomen_2020_21: () => Record<string, number> = () => { return {"UConn":1,"Stanford":2,"NC State":3,"Texas A&M":4,"Baylor":5,"South Carolina":6,"Maryland":7,"Louisville":8,"UCLA":9,"Georgia":10,"Arizona":11,"Indiana":12,"Tennessee":13,"Gonzaga":14,"Arkansas":15,"Michigan":16,"West Virginia":17,"Kentucky":18,"South Fla.":19,"Missouri St.":20,"Rutgers":21,"Ohio St.":22,"Oregon":23,"Florida Gulf Coast":24,"South Dakota St.":25,"__week__":17} }; 

/** From https://www.ncaa.com/rankings/basketball-men/d1/associated-press. Note you need to edit the names by hand */
const apPollMen_2021_22: () => Record<string, number> = () => _.chain(`
1	Gonzaga	26-3	1,518	1
2	Arizona	31-3	1,470	2
3	Kansas	28-6	1,388	6
4	Baylor	26-6	1,286	3
5	Tennessee	26-7	1,235	9
6	Villanova	26-7	1,211	8
7	Kentucky	26-7	1,178	5
8	Auburn	27-5	1,144	4
9	Duke	28-6	986	7
10	Purdue	27-7	958	9
11	UCLA	25-7	823	13
12	Texas Tech	25-9	819	14
13	Providence	25-5	723	11
14	Wisconsin	24-7	685	12
15	Houston	29-5	65	18
16	Iowa	26-9	661	24
17	Arkansas	25-8	578	15
18	Saint Mary's	25-7	508	17
19	Illinois	22-9	457	16
20	Murray State	30-2	425	19
21	UConn	23-9	353	20
22	Southern California	26-7	170	21
23	Boise State	27-7	165	NR
24	Colorado State	25-5	82	23
25	Texas	21-11	72	22
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 19
      }
   ).value();
/** From https://www.ncaa.com/rankings/basketball-men/d1/associated-press. Note you need to edit the names by hand */
const apPollMen_2022_23: () => Record<string, number> = () => _.chain(`
1	Houston (48)	25-2	1,534	2
2	Alabama (7)	23-4	1,448	1
3	Kansas (7)	22-5	1,409	5
4	UCLA	23-4	1,363	4
5	Purdue	24-4	1,294	3
6	Virginia	21-4	1,228	7
7	Arizona	24-4	1,213	8
8	Texas	21-6	1,083	6
9	Baylor	20-7	1,013	9
10	Marquette	21-6	968	11
11	Tennessee	20-7	887	10
12	Gonzaga	23-5	856	13
13	Miami (Fla.)	22-5	833	15
14	Kansas State	20-7	666	12
15	Saint Mary's	24-5	650	17
16	Xavier	20-7	563	16
17	Indiana	19-8	539	14
18	UConn	20-7	440	20
19	Creighton	18-9	361	18
20	Providence	20-7	350	24
21	Northwestern	20-7	349	NR
22	San Diego State	21-5	336	21
23	Iowa State	17-9	309	19
24	TCU	18-9	162	22
25	Texas A&M	20-7	125	NR
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "")
   .replace(/ *[(][0-9]+[)]/, "").replace("State", "St.")
   ), parseInt(ab[0].replace("T-", "")) ];}).fromPairs()
   .assign(
      {
         __week__: 15
      }
   ).value();

/** From https://www.ncaa.com/rankings/basketball-women/d1/associated-press. Note you need to edit the names by hand */
const apPollWomen_2021_22: () => Record<string, number> = () => _.chain(`
1	South Carolina	29-2	1	739
2	Stanford	28-3	2	728
3	NC State	29-3	3	693
4	Louisville	25-4	5	624
5	UConn	25-5	6	605
6	Texas	26-6	7	599
7	Baylor	27-6	4	597
8	Iowa	23-7	8	541
9	LSU	25-5	9	505
10	Iowa State	26-6	10	473
11	Indiana	22-8	11	455
12	Michigan	22-6	12	413
13	Maryland	21-8	13	383
14	Ohio State	23-6	14	338
15	Kentucky	19-11	16	301
16	Virginia Tech	23-9	17	254
17	North Carolina	23-6	18	236
18	Tennessee	23-8	19	218
19	Arizona	20-7	20	213
20	BYU	26-3	15	201
21	Notre Dame	22-8	22	159
22	Oklahoma	24-8	21	156
23	Florida Gulf Coast	29-2	23	132
24	UCF	25-3	25	58
25	Princeton	24-4	24	46
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}).fromPairs()
   .assign(
      {
         __week__: 19
      }
   ).value();

/** From https://www.ncaa.com/rankings/basketball-women/d1/associated-press. Note you need to edit the names by hand */
const apPollWomen_2022_23: () => Record<string, number> = () => _.chain(`
1	South Carolina (27)	27-0	699	1
2	Indiana (1)	26-1	672	2
3	Stanford	25-3	634	3
4	UConn	24-4	585	6
5	LSU	25-1	573	5
6	Iowa	22-5	567	7
7	Maryland	22-5	522	8
8	Utah	23-3	507	4
9	Virginia Tech	22-4	488	11
10	Notre Dame	22-4	464	10
11	Duke	23-4	416	9
12	Michigan	20-6	340	12
13	Oklahoma	22-4	336	15
14	Arizona	21-6	322	18
15	Villanova	23-5	296	14
16	Ohio State	22-5	291	13
17	UCLA	21-6	279	16
18	Gonzaga	25-3	206	20
19	Texas	21-7	186	17
20	Iowa State	17-7	167	22
21	Colorado	21-6	113	21
22	North Carolina	19-8	100	19
23	Florida State	22-7	96	24
24	UNLV	25-2	78	23
25	Illinois	20-7	29	NR
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "")
   .replace(/ *[(][0-9]+[)]/, "").replace("State", "St.")
), parseInt(ab[0].replace("T-", "")) ];}).fromPairs()
   .assign(
      {
         __week__: 15
      }
   ).value();

/** Contains NCAA/KP lookups for gender/years where we want to retrieve efficiency from the cache (current year only) */
export const apPolls: Record<string, () => Record<string, number>> = {
   "Women_2020/21": _.memoize(apPollWomen_2020_21),
   "Women_2021/22": _.memoize(apPollWomen_2021_22),
   "Women_2022/23": _.memoize(apPollWomen_2022_23),

   "Men_2020/21": _.memoize(apPollMen_2020_21),
   "Men_2021/22": _.memoize(apPollMen_2021_22),
   "Men_2022/23": _.memoize(apPollMen_2022_23),
};

////////////////////////////////////////////////////////////////

// AP Rankings

/** From https://www.ncaa.com/news/basketball-men/article/2022-03-13/2022-ncaa-mens-tournament-bids-all-68-march-madness-teams. Note you need to edit the names by hand */
const sCurveMen_2021_22: () => Record<string, number> = () => _.chain(`
1. Gonzaga (26 - 3)
2. Arizona (31 - 3)
3. Kansas (28 - 6)
4. Baylor (26 - 6)
5. Auburn (27 - 5)
6. Kentucky (26 - 7)
7. Villanova (26 - 7)
8. Duke (28 - 6)
9. Wisconsin (24 - 7)
10. Tennessee (26 - 7)
11. Purdue (27 - 7)
12. Texas Tech (25 - 9)
13. UCLA (25 - 7)
14. Illinois (22 - 9)
15. Providence (25 - 5)
16. Arkansas (25 - 8)
17. UConn (23 - 9)
18. Houston (29 - 5)
19. Saint Mary's (CA) (25 - 7)
20. Iowa (26 - 9)
21. Alabama (19 - 13)
22. LSU (22 - 11)
23. Texas (21 - 11)
24. Colorado St. (25 - 5)
25. Southern California (26 - 7)
26. Murray St. (30 - 2)
27. Michigan St. (22 - 12)
28. Ohio St. (19 - 11)
29. Boise St. (27 - 7)
30. North Carolina (24 - 9)
31. San Diego St. (23 - 8)
32. Seton Hall (21 - 10)
33. Creighton (22 - 11)
34. TCU (20 - 12)
35. Marquette (19 - 12)
36. Memphis (21 - 10)
37. San Francisco (24 - 9)
38. Miami (FL) (23 - 10)
39. Loyola Chicago (25 - 7)
40. Davidson (27 - 6)
41. Iowa St. (20 - 12)
42. Michigan (17 - 14)
43. Wyoming (25 - 8)
44. Rutgers (18 - 13)
45. Indiana (20 - 13)
46. Virginia Tech (23 - 12)
47. Notre Dame (22 - 10)
48. Dayton (0 - 0)
49. Oklahoma (0 - 0)
50. SMU (0 - 0)
51. Texas A&M (0 - 0)
`).split("\n").map(l => { 
   const ab = l.replace(/^([0-9]+)[.] +(.*) +[(][0-9].*/, '$1\t$2').split("\t"); 
   return [ fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0]) ];}
).fromPairs().value();

const sCurveWomen_2021_22: () => Record<string, number> = () => _.chain(`
South Carolina
Stanford
NC State
Louisville
Baylor
UConn
Texas
Iowa
Iowa State
LSU
Indiana
Michigan
Tennessee
Oklahoma
Maryland
Arizona
UNC
Virginia Tech
Notre Dame
Oregon
BYU
Kentucky
Ohio State
Georgia
Colorado
Utah
UCF
Ole Miss
Nebraska
Washington State
Kansas
Miami (FL)
USF
Georgia Tech
Kansas State
Gonzaga
South Dakota
Florida
Arkansas
Creighton
Princeton
Villanova
Dayton
DePaul
Florida State
Missouri State
FGCU
Belmont
Oregon State
Boston College
South Dakota State
Marquette
`).split("\n").map((l, rank) => { 
   return [ fixName(l.replace("State", "St.")), rank ];}
).fromPairs().value();


export const sCurves: Record<string, () => Record<string, number>> = {
   "Men_2021/22": _.memoize(sCurveMen_2021_22),
   "Women_2021/22": _.memoize(sCurveWomen_2021_22)
};