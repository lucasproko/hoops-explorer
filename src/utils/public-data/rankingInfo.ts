import _ from "lodash";

/** For some reason ncaa.com has different names to stats.ncaa.org! */
const weirdNameChanges: Record<string, string> = {
  "North Carolina St.": "NC State",
  "NC St.": "NC State",
  UNC: "North Carolina",
  Connecticut: "UConn",
  "South Florida": "South Fla.",
  "Loyola (IL)": "Loyola Chicago",
  USC: "Southern California",
  "Southern Cal": "Southern California",
  "Florida Gulf Coast": "FGCU",
  USF: "South Fla.",
  "Saint Mary's": "Saint Mary's (CA)",
  "Miami (Fl.)": "Miami (FL)",
  "Miami (Fla.)": "Miami (FL)",
  "St. John's": "St. John's (NY)",
  Charleston: "Col. of Charleston",
  "Florida Atlantic": "Fla. Atlantic",
  FAU: "Fla. Atlantic",
};
const fixName = (t: string) => weirdNameChanges[t] || t;

////////////////////////////////////////////////////////////////

// AP Rankings

/* poll archives https://www.collegepollarchive.com/ */
const apPollMen_2020_21: () => Record<string, number> = () => {
  return {
    Gonzaga: 1,
    Illinois: 2,
    Baylor: 3,
    Michigan: 4,
    Alabama: 5,
    Houston: 6,
    "Ohio St.": 7,
    Iowa: 8,
    Texas: 9,
    Arkansas: 10,
    "Oklahoma St.": 11,
    Kansas: 12,
    "West Virginia": 13,
    "Florida St.": 14,
    Virginia: 15,
    "San Diego St.": 16,
    "Loyola Chicago": 17,
    Villanova: 18,
    Creighton: 19,
    Purdue: 20,
    "Texas Tech": 21,
    Colorado: 22,
    BYU: 23,
    "Southern California": 24,
    "Virginia Tech": 25,
    __week__: 17,
  };
};

/* poll archives https://www.collegepollarchive.com/ */
const apPollWomen_2020_21: () => Record<string, number> = () => {
  return {
    UConn: 1,
    Stanford: 2,
    "NC State": 3,
    "Texas A&M": 4,
    Baylor: 5,
    "South Carolina": 6,
    Maryland: 7,
    Louisville: 8,
    UCLA: 9,
    Georgia: 10,
    Arizona: 11,
    Indiana: 12,
    Tennessee: 13,
    Gonzaga: 14,
    Arkansas: 15,
    Michigan: 16,
    "West Virginia": 17,
    Kentucky: 18,
    "South Fla.": 19,
    "Missouri St.": 20,
    Rutgers: 21,
    "Ohio St.": 22,
    Oregon: 23,
    "Florida Gulf Coast": 24,
    "South Dakota St.": 25,
    __week__: 17,
  };
};

/** From https://www.ncaa.com/rankings/basketball-men/d1/associated-press. Note you need to edit the names by hand */
const apPollMen_2021_22: () => Record<string, number> = () =>
  _.chain(
    `
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
`
  )
    .split("\n")
    .map((l) => {
      const ab = l.split("\t");
      return [fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0])];
    })
    .fromPairs()
    .assign({
      __week__: 19,
    })
    .value();
/** From https://www.ncaa.com/rankings/basketball-men/d1/associated-press. Note you need to edit the names by hand */
const apPollMen_2022_23: () => Record<string, number> = () =>
  _.chain(
    `
1	Houston (58)	29-2	1,522	1
2	UCLA (3)	27-4	1,452	4
3	Kansas	25-6	1,368	3
4	Alabama	26-5	1,343	2
5	Purdue	26-5	1,274	5
6	Marquette	25-6	1,218	6
7	Texas	23-8	1,100	9
8	Arizona	25-6	1,042	8
9	Gonzaga	26-5	1,031	10
10	Baylor	22-9	961	7
11	UConn	24-7	847	14
12	Kansas State	23-8	838	11
13	Virginia	23-6	791	13
14	Miami (Fla.)	24-6	761	16
15	Xavier	23-8	641	19
16	Saint Mary's	25-6	587	17
17	Tennessee	22-9	573	12
18	Texas A&M	23-8	507	24
19	Indiana	21-10	481	15
20	San Diego State	24-6	370	18
21	Duke	23-8	293	NR
22	TCU	20-11	193	22
23	Kentucky	21-10	138	23
24	Creighton	20-11	133	NR
25	Missouri	23-8	66	NR
`
  )
    .split("\n")
    .map((l) => {
      const ab = l.split("\t");
      return [
        fixName(
          (ab[1] || "").replace(/ *[(][0-9]+[)]/, "").replace("State", "St.")
        ),
        parseInt(ab[0].replace("T-", "")),
      ];
    })
    .fromPairs()
    .assign({
      __week__: 17,
    })
    .value();

/** From https://www.ncaa.com/rankings/basketball-men/d1/associated-press. Note you need to edit the names by hand */
const apPollMen_2023_24: () => Record<string, number> = () =>
  _.chain(
    `
    1	UConn (45)	20-2	1509	1
    2	Purdue (16)	21-2	1479	2
    3	North Carolina	18-4	1352	3
    4	Kansas	18-4	1322	8
    5	Houston	19-3	1273	4
    6	Tennessee	16-5	1211	5
    7	Marquette	17-5	1173	9
    8	Arizona	17-5	1077	11
    9	Duke	16-5	924	7
    10	Illinois	17-5	893	14
    11	Wisconsin	16-6	838	6
    12	Auburn	18-4	818	16
    13	Baylor	16-5	730	18
    14	Iowa State	16-5	700	12
    15	South Carolina	19-3	564	NR
    16	Alabama	16-6	520	24
    17	Kentucky	15-6	513	10
    18	Dayton	18-3	493	21
    19	Creighton	16-6	484	13
    20	Florida Atlantic	18-4	431	20
    21	BYU	16-5	425	22
    22	Utah State	19-3	286	17
    23	Texas Tech	16-5	156	15
    24	San Diego State	17-5	141	NR
    25	New Mexico	18-4	123	19
`
  )
    .split("\n")
    .map((l) => {
      const ab = l.split("\t");
      return [
        fixName(
          (ab[1] || "").replace(/ *[(][0-9]+[)]/, "").replace("State", "St.")
        ),
        parseInt(ab[0].replace("T-", "")),
      ];
    })
    .fromPairs()
    .assign({
      __week__: 13,
    })
    .value();

/** From https://www.ncaa.com/rankings/basketball-women/d1/associated-press. Note you need to edit the names by hand */
const apPollWomen_2021_22: () => Record<string, number> = () =>
  _.chain(
    `
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
`
  )
    .split("\n")
    .map((l) => {
      const ab = l.split("\t");
      return [fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0])];
    })
    .fromPairs()
    .assign({
      __week__: 19,
    })
    .value();

/** From https://www.ncaa.com/rankings/basketball-women/d1/associated-press. Note you need to edit the names by hand */
const apPollWomen_2022_23: () => Record<string, number> = () =>
  _.chain(
    `
1	South Carolina (28)	32-0	700	1
2	Iowa	26-6	651	7
3	Indiana	27-3	640	2
4	Virginia Tech	27-4	595	8
5	Stanford	28-5	557	6
6	Maryland	25-6	547	5
7	UConn	28-5	543	9
8	Utah	25-4	519	3
9	LSU	28-2	506	4
10	Villanova	28-5	425	11
11	Notre Dame	25-5	401	10
12	Ohio State	25-7	395	14
13	Duke	25-6	327	13
14	Oklahoma	24-5	313	16
15	Texas	23-8	298	12
16	Gonzaga	27-3	282	15
17	UCLA	25-9	273	19
18	Michigan	22-9	175	17
19	North Carolina	21-10	151	18
20	Colorado	23-8	114	20
21	UNLV	28-2	113	22
22	Washington State	23-10	100	NR
23	Tennessee	23-11	92	NR
24	Arizona	21-9	89	21
25	Middle Tennessee	25-4	62	24
`
  )
    .split("\n")
    .map((l) => {
      const ab = l.split("\t");
      return [
        fixName(
          (ab[1] || "").replace(/ *[(][0-9]+[)]/, "").replace("State", "St.")
        ),
        parseInt(ab[0].replace("T-", "")),
      ];
    })
    .fromPairs()
    .assign({
      __week__: 17,
    })
    .value();

/** From https://www.ncaa.com/rankings/basketball-women/d1/associated-press. Note you need to edit the names by hand */
const apPollWomen_2023_24: () => Record<string, number> = () =>
  _.chain(
    `
    1	South Carolina (35)	21-0	875	1
    2	Iowa	21-2	836	3
    3	NC State	19-2	802	5
    4	Colorado	19-3	743	6
    5	Ohio State	19-3	694	8
    6	Stanford	20-3	691	4
    7	Texas	21-3	628	12
    8	Kansas State	20-3	593	2
    9	UCLA	17-4	546	7
    10	Southern Cal	16-4	543	15
    11	UConn	19-4	522	11
    12	Notre Dame	17-4	455	14
    13	LSU	19-4	450	9
    14	Indiana	18-3	398	10
    15	Louisville	19-3	394	16
    16	Virginia Tech	18-4	379	17
    17	Oregon State	17-3	322	18
    18	Baylor	17-4	317	13
    19	Gonzaga	22-2	292	19
    20	Utah	17-6	267	20
    21	Creighton	18-3	169	22
    22	West Virginia	19-2	139	23
    23	Syracuse	18-4	106	21
    24	Oklahoma	15-6	69	NR
    25	Princeton	17-3	44	25
`
  )
    .split("\n")
    .map((l) => {
      const ab = l.split("\t");
      return [
        fixName(
          (ab[1] || "").replace(/ *[(][0-9]+[)]/, "").replace("State", "St.")
        ),
        parseInt(ab[0].replace("T-", "")),
      ];
    })
    .fromPairs()
    .assign({
      __week__: 13,
    })
    .value();

/** Contains NCAA/KP lookups for gender/years where we want to retrieve efficiency from the cache (current year only) */
export const apPolls: Record<string, () => Record<string, number>> = {
  "Women_2020/21": _.memoize(apPollWomen_2020_21),
  "Women_2021/22": _.memoize(apPollWomen_2021_22),
  "Women_2022/23": _.memoize(apPollWomen_2022_23),
  "Women_2023/24": _.memoize(apPollWomen_2023_24),

  "Men_2020/21": _.memoize(apPollMen_2020_21),
  "Men_2021/22": _.memoize(apPollMen_2021_22),
  "Men_2022/23": _.memoize(apPollMen_2022_23),
  "Men_2023/24": _.memoize(apPollMen_2023_24),
};

////////////////////////////////////////////////////////////////

// AP Rankings

/** From https://www.ncaa.com/news/basketball-men/article/2022-03-13/2022-ncaa-mens-tournament-bids-all-68-march-madness-teams. Note you need to edit the names by hand */
const sCurveMen_2021_22: () => Record<string, number> = () =>
  _.chain(
    `
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
`
  )
    .split("\n")
    .map((l) => {
      const ab = l
        .replace(/^([0-9]+)[.] +(.*) +[(][0-9].*/, "$1\t$2")
        .split("\t");
      return [fixName((ab[1] || "").replace("State", "St.")), parseInt(ab[0])];
    })
    .fromPairs()
    .value();

const sCurveWomen_2021_22: () => Record<string, number> = () =>
  _.chain(
    `
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
`
  )
    .split("\n")
    .map((l, rank) => {
      return [fixName(l.replace("State", "St.")), rank];
    })
    .fromPairs()
    .value();

export const sCurves: Record<string, () => Record<string, number>> = {
  "Men_2021/22": _.memoize(sCurveMen_2021_22),
  "Women_2021/22": _.memoize(sCurveWomen_2021_22),
};
