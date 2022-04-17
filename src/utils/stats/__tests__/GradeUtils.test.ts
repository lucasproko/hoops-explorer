import { GradeUtils } from '../GradeUtils';
import { DivisionStatistics, Statistic } from '../../StatModels';

describe("GradeUtils", () => {
   //TODO: add unit tests anyway:
   //GradeUtils.buildAndInjectDivisionStats tested by src/__tests__/buildLeaderboards.test.ts
   //GradeUtils.buildAndInjectDivisionStatsLUT tested by src/__tests__/buildLeaderboards.test.ts

   test("GradeUtils.binaryChop", () => {
      const test1 = [ 129, 0, 10, 20, 30, 40, 50 ]; //(eg 0-10 is 129, 40-50 is 133)

      expect(GradeUtils.binaryChop(test1, 5, 1, 6)).toEqual(130);
      expect(GradeUtils.binaryChop(test1, 20, 1, 6)).toEqual(131);
      expect(GradeUtils.binaryChop(test1, 22, 1, 6)).toEqual(132);
      expect(GradeUtils.binaryChop(test1, 49, 1, 6)).toEqual(134);

      //(ignore val because start/end indices are the same)
      expect(GradeUtils.binaryChop(test1, 300, 3, 3)).toEqual(131); 

      // (check optimization - gets there in 1)
      expect(GradeUtils.binaryChop(test1, 25, 2, 6)).toEqual(132);
      expect(GradeUtils.binaryChop(test1, 35, 2, 6)).toEqual(133);

      // Edge cases - outside the bounds of the array
      expect(GradeUtils.binaryChop(test1, 55, 1, 6)).toEqual(135);
      expect(GradeUtils.binaryChop(test1, -5, 1, 6)).toEqual(129); //(min val allowed is start offset)
   });
   test("GradeUtils.getPercentile", () => {
      const testLut = {
         "test_field_pct": {
            isPct: true, //(whether you need to *100 before applying .toFixed(0))
            size: 200, //(total number of samples in the LUT)
            min: 0.150, //(don't need max, if value missed LUT and is >max then %ile==100, else 1)
            lut: {
               //5 entries
               "15": [ 0, 0.150001, 0.150002, 0.150003, 0.150004, 0.150005 ], //1st onwards
               "20": [ 5, 0.199, 0.203, 0.204, 0.2048 ], //6th onwards
               "22": [ 9, 0.22 ] //10th onwards
            }        
         },
         "test_field": {
            isPct: false, //(whether you need to *100 before applying .toFixed(0))
            size: 200, //(total number of samples in the LUT)
            min: -5, //(don't need max, if value missed LUT and is >max then %ile==100, else 1)
            lut: {
               "1": [ 10, 0.5, 0.53, 0.54 ] //(11th onwards)
            }        
         },
      };
      const testDivStats: DivisionStatistics = {
         tier_sample_size: 0, tier_samples: {}, tier_lut: testLut,
         dedup_sample_size: 0, dedup_samples: {}
      };
      expect(GradeUtils.getPercentile(testDivStats, "no_field", -1)).toEqual({});

      const convertToRank = (res: Statistic | undefined) => {
         // This is way easier to see the correctness (and also in practice how I'm using it)
         return res ? { rank: Math.round((res?.value || 0)*(res?.samples || 0)), samples: res.samples || 0 } : {};
      };

      // Outside limits
      expect(convertToRank(GradeUtils.getPercentile(testDivStats, "test_field_pct", 0.1))).toEqual({ rank: 1, samples: 200 });
      expect(convertToRank(GradeUtils.getPercentile(testDivStats, "test_field_pct", 0.3))).toEqual({ rank: 200, samples: 200 });
      // Exact match
      expect(convertToRank(GradeUtils.getPercentile(testDivStats, "test_field_pct", 0.199))).toEqual({ rank: 6, samples: 200 });
      // In the gaps
      expect(convertToRank(GradeUtils.getPercentile(testDivStats, "test_field_pct", 0.1995))).toEqual({ rank: 7, samples: 200 });
      expect(convertToRank(GradeUtils.getPercentile(testDivStats, "test_field_pct", 0.2035))).toEqual({ rank: 8, samples: 200 });
      expect(convertToRank(GradeUtils.getPercentile(testDivStats, "test_field_pct", 0.20485))).toEqual({ rank: 10, samples: 200 });

      // Check if it doesn't hit a hash entry
      //TDOO wut
      expect(convertToRank(GradeUtils.getPercentile(testDivStats, "test_field_pct", 0.211))).toEqual({ rank: 10, samples: 200 });

      expect(convertToRank(GradeUtils.getPercentile(testDivStats, "test_field", -10))).toEqual({ rank: 1, samples: 200 });
      expect(convertToRank(GradeUtils.getPercentile(testDivStats, "test_field", 0.5))).toEqual({ rank: 11, samples: 200 });
      expect(convertToRank(GradeUtils.getPercentile(testDivStats, "test_field", 0.539))).toEqual({ rank: 13, samples: 200 });

      // When things break in practice fail, put 'em here

      const stableDoorLut = {
         "def_adj_ppp": {
            isPct: false,
            "min":89.36973972330725,"size":358,
            lut: {
               "89":[0,89.36973972330725],"91":[1,91.07522499231013,91.17919656823477,91.23846000656911,91.30987205091664,91.41544195831091],
               "92":[6,91.87347977468076,92.18124207085954,92.26684514165964,92.37299122471474],
               "93":[10,92.62822067268007,92.71815122338846,92.73271262442395,92.79564822160677,92.8561697808506,93.03223977904416,93.03944118025748,93.05430467241172,93.18887442059476]               
            }
         }
      };
      const stableDoorStats: DivisionStatistics = {
         tier_sample_size: 0, tier_samples: {}, tier_lut: stableDoorLut,
         dedup_sample_size: 0, dedup_samples: {}
      };
      expect(convertToRank(GradeUtils.buildTeamPercentiles(stableDoorStats, {
         def_adj_ppp: { value: 90.6 }
      }, [ "adj_ppp" ], true)?.def_adj_ppp)).toEqual({
         samples: 358, rank: 357         
      });
      expect(convertToRank(GradeUtils.buildTeamPercentiles(stableDoorStats, {
         def_adj_ppp: { value: 92.8561697808506 }
      }, [ "adj_ppp" ], true)?.def_adj_ppp)).toEqual({
         samples: 358, rank: 344         
      });
   });
});