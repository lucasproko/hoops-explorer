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
1	Purdue (39)	19-1	1,527	3
2	Alabama (23)	17-2	1,511	4
3	Houston	18-2	1,333	1
4	Tennessee	16-3	1,298	9
5	Kansas State	17-2	1,254	13
6	Arizona	17-3	1,195	11
7	Virginia	15-3	1,160	10
8	UCLA	17-3	1,155	5
9	Kansas	16-3	1,117	2
10	Texas	16-3	980	7
11	TCU	15-4	875	14
12	Iowa State	14-4	817	12
13	Xavier	16-4	807	8
14	Gonzaga	17-4	784	6
15	Auburn	16-3	699	16
16	Marquette	16-5	600	20
17	Baylor	14-5	497	21
18	Charleston	21-1	445	18
19	UConn	16-5	372	15
20	Miami (Fla.)	15-4	328	17
21	Florida Atlantic	19-1	271	24
22	Saint Mary's	18-4	254	NR
23	Providence	15-5	194	22
24	Clemson	16-4	169	19
25	New Mexico	18-2	156	NR
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "")
   .replace(/ *[(][0-9]+[)]/, "").replace("State", "St.")
   ), parseInt(ab[0].replace("T-", "")) ];}).fromPairs()
   .assign(
      {
         __week__: 11
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
1	South Carolina (28)	20-0	700	1
2	Ohio State	19-0	669	2
3	Stanford	19-2	615	4
4	LSU	19-0	603	3
5	UConn	17-2	596	5
6	Indiana	17-1	584	6
7	Notre Dame	16-2	541	7
8	UCLA	17-3	448	9
9	Utah	16-2	430	8
T-10	Iowa	15-4	425	10
T-10	Maryland	16-4	425	11
12	Virginia Tech	16-3	403	12
13	Michigan	16-3	352	14
14	Oklahoma	16-2	304	15
15	North Carolina	14-5	298	17
16	Duke	17-2	281	13
17	Gonzaga	19-2	259	16
18	Iowa State	13-4	221	18
19	Arizona	15-4	201	19
20	NC State	15-5	171	20
21	Villanova	18-3	145	22
22	Illinois	16-4	103	21
23	Middle Tennesse	16-2	64	NR
24	Florida State	18-4	57	NR
25	Colorado	15-4	56	24
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "")
   .replace(/ *[(][0-9]+[)]/, "").replace("State", "St.")
), parseInt(ab[0].replace("T-", "")) ];}).fromPairs()
   .assign(
      {
         __week__: 11
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