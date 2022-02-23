import { DerivedStatsUtils } from '../DerivedStatsUtils';
import _ from 'lodash';

import { sampleTeamStatsResponse } from "../../../sample-data/sampleTeamStatsResponse"
import { PureStatSet } from '../../StatModels';

describe("DerivedStatsUtils", () => {
   const teamData = _.assign(
      sampleTeamStatsResponse.responses[0].aggregations.tri_filter.buckets as { on: any, off: any, baseline: any },
      { global: {}, onOffMode: true }
    );

   /** Tests all the methods in one go */
   test("DerivedStatsUtils.injectDerivedStats", () => {
      const derivedStats = DerivedStatsUtils.injectDerivedStats(teamData.baseline, {} as PureStatSet);
      expect(derivedStats).toMatchSnapshot();
   });
});
