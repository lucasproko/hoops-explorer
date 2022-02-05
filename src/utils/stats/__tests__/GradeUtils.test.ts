import { GradeUtils } from '../GradeUtils';
import { DivisionStatistics } from '../../StatModels';

describe("GradeUtils", () => {
   test("GradeUtils.binaryChop", () => {
      const test1 = [ 129, 0, 10, 20, 30, 40, 50 ]; //(eg 0-10 is 129, 40-50 is 133)

      expect(GradeUtils.binaryChop(test1, 5, 1, 6)).toEqual(129);
      expect(GradeUtils.binaryChop(test1, 22, 1, 6)).toEqual(131);
      expect(GradeUtils.binaryChop(test1, 49, 1, 6)).toEqual(133);

      //(ignore val because start/end indices are the same)
      expect(GradeUtils.binaryChop(test1, 300, 3, 3)).toEqual(131); 

      // (check optimization - gets there in 1)
      expect(GradeUtils.binaryChop(test1, 25, 2, 6)).toEqual(131);
      expect(GradeUtils.binaryChop(test1, 35, 2, 6)).toEqual(132);

      // Edge cases - outside the bounds of the array
      expect(GradeUtils.binaryChop(test1, 55, 1, 6)).toEqual(134);
      expect(GradeUtils.binaryChop(test1, -5, 1, 6)).toEqual(128);
   });
   test("GradeUtils.getPercentile", () => {
      const testLut = {
         "test_field_pct": {
            isPct: true, //(whether you need to *100 before applying .toFixed(0))
            size: 20, //(total number of samples in the LUT)
            min: 0.199, //(don't need max, if value missed LUT and is >max then %ile==100, else 1)
            lut: {
               "20": [ 5, 0.199, 0.203, 0.204, 0.2048 ]
            }        
         },
         "test_field": {
            isPct: false, //(whether you need to *100 before applying .toFixed(0))
            size: 20, //(total number of samples in the LUT)
            min: -5, //(don't need max, if value missed LUT and is >max then %ile==100, else 1)
            lut: {
               "1": [ 10, 0.5, 0.53, 0.54 ]
            }        
         },
      };
      const testDivStats: DivisionStatistics = {
         tier_sample_size: 0, tier_samples: {}, tier_lut: testLut,
         dedup_sample_size: 0, dedup_samples: {}
      };
      expect(GradeUtils.getPercentile(testDivStats, "no_field", -1)).toEqual({});

      expect(GradeUtils.getPercentile(testDivStats, "test_field_pct", 0.1)).toEqual({ value: 0.01 });
      expect(GradeUtils.getPercentile(testDivStats, "test_field_pct", 0.3)).toEqual({ value: 1.00 });
      expect(GradeUtils.getPercentile(testDivStats, "test_field_pct", 0.1995)).toEqual({ value: 0.25 });
      expect(GradeUtils.getPercentile(testDivStats, "test_field_pct", 0.2035)).toEqual({ value: 0.3 });
      expect(GradeUtils.getPercentile(testDivStats, "test_field_pct", 0.20485)).toEqual({ value: 0.4 });

      expect(GradeUtils.getPercentile(testDivStats, "test_field", -10)).toEqual({ value: 0.01 });
      expect(GradeUtils.getPercentile(testDivStats, "test_field", 0.5)).toEqual({ value: 0.5 });
      expect(GradeUtils.getPercentile(testDivStats, "test_field", 0.539)).toEqual({ value: 0.55 });
   });
});