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
   "St. John's": "St. John's (NY)",
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
1	Purdue (40)	11-0	1,502	1
2	UConn (21)	12-0	1,482	3
3	Houston	11-1	1,374	5
4	Kansas	10-1	1,290	8
5	Arizona	10-1	1,269	9
6	Virginia	8-1	1,195	2
7	Texas	9-1	1,064	7
8	Tennessee	9-2	1,024	6
9	Alabama	9-2	1,021	4
10	Arkansas	10-1	1,004	10
11	Gonzaga	9-3	895	15
12	Baylor	7-2	873	11
13	UCLA	10-2	871	16
14	Duke	10-2	819	12
15	Mississippi State	11-0	623	17
16	Illinois	8-3	528	18
17	Wisconsin	9-2	432	22
18	Indiana	8-3	408	14
19	Kentucky	7-3	370	13
20	TCU	9-1	358	21
21	Virginia Tech	11-1	297	24
22	Miami (Fl.)	11-1	208	25
23	Auburn	9-2	118	19
24	Marquette	9-3	116	NR
25	Arizona State	11-1	98	NR
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "")
   .replace(/ *[(][0-9]+[)]/, "").replace("State", "St.")
   ), parseInt(ab[0].replace("T-", "")) ];}).fromPairs()
   .assign(
      {
         __week__: 7
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
1	South Carolina (28)	11-0	700	1
2	Stanford	11-1	672	2
3	Ohio State	11-0	627	3
4	Indiana	11-0	619	4
5	Notre Dame	9-1	594	5
6	North Carolina	9-1	529	7
7	NC State	11-1	514	8
8	Virginia Tech	10-1	481	6
9	UConn	8-2	470	9
10	LSU	11-0	422	11
11	UCLA	11-1	420	10
12	Utah	10-0	372	13
13	Iowa	9-3	370	12
14	Iowa State	8-2	341	14
15	Maryland	9-3	296	15
16	Oregon	9-1	280	T-16
17	Arkansas	13-0	256	21
18	Arizona	9-1	217	20
19	Michigan	10-1	210	19
20	Kansas	10-0	187	22
21	Creighton	8-2	133	T-16
22	Gonzaga	10-2	114	23
23	Oklahoma	9-1	86	24
24	Baylor	8-3	67	18
25	St. John's	11-0	27	NR
`).split("\n").map(l => { const ab = l.split("\t"); return [ fixName((ab[1] || "")
   .replace(/ *[(][0-9]+[)]/, "").replace("State", "St.")
), parseInt(ab[0].replace("T-", "")) ];}).fromPairs()
   .assign(
      {
         __week__: 7
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