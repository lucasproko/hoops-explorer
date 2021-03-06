import { commonTeamQuery } from "../commonTeamQuery";
import { CommonFilterType, QueryUtils } from "../../QueryUtils";
import _ from 'lodash';

describe("commonTeamQuery", () => {
  test("commonTeamQuery (queryFilters)", () => {

    const efficiencyInfo = { "TestTeam": { "stats": 0, "conf": "TestConf" } };
    const lookup = {};

    const queryWithFilters = (filters: CommonFilterType[], filterGarbage: boolean) => {
      return _.assign({
        team: "TestTeam", year: "2019",
        minRank: "10", maxRank: "100",
        baseQuery: "base"
      }, {
        filterGarbage: filterGarbage,
        queryFilters: _.join(filters, ",")
      });
    };

    const test1 = commonTeamQuery(queryWithFilters([
      "Home", "Nov-Dec", "Conf"
    ], false), 333, efficiencyInfo, lookup);

    const test2 = commonTeamQuery(queryWithFilters([
      "Away", "Jan-Apr"
    ], true), 333, efficiencyInfo, lookup);

    const test3 = commonTeamQuery(queryWithFilters([
      "Not-Home", "Last-30d", "Conf"
    ], true), 333, efficiencyInfo, lookup);

    // For testing:
    //console.log(JSON.stringify(test2, null, 3));

    // TEST1: Home / 2018 / Conf only

    expect(test1.bool.must_not).toEqual([]);
    expect(test1.bool.should).toEqual([]);
    expect(test1.bool.minimum_should_match).toEqual(0);
    expect(test1.bool.must.length).toEqual(5);
    expect(test1.bool?.must?.[2]).toEqual({
      "query_string": {
         "query": `is_same_conf:true`
       }
    });
    expect(test1.bool?.must?.[3]).toEqual({
      "term": {
        "location_type.keyword": "Home"
      }
    });
    expect(test1.bool?.must?.[4]).toEqual({
      "range": {
        "date": {
          "lte": "2019-12-31"
        }
      }
    });

    // TEST2: Away / 2019 / Filter Garbage

    expect(test2.bool.must_not).toEqual([]);
    expect(test2.bool.should.length).toEqual(3);
    expect(test2.bool.minimum_should_match).toEqual(1);
    expect(test2.bool.must.length).toEqual(4);
    expect(test2.bool?.must?.[2]).toEqual({
      "term": {
        "location_type.keyword": "Away"
      }
    });
    expect(test2.bool?.must?.[3]).toEqual({
      "range": {
        "date": {
          "gt": "2019-12-31"
        }
      }
    });

    // TEST3: Not-Home, Last-30d / Conf / Filter Garbage

    expect(test3.bool.must_not).toEqual([{
      "term": {
        "location_type.keyword": "Home"
      }
    }]);
    expect(test3.bool.should.length).toEqual(3);
    expect(test3.bool.minimum_should_match).toEqual(1);
    expect(test3.bool.must.length).toEqual(4);
    expect(test1.bool?.must?.[2]).toEqual({
      "query_string": {
         "query": `is_same_conf:true`
       }
    });
    expect(test3.bool?.must?.[3]).toEqual({
      "range": {
        "date": {
          "gt": "333000||-30d/d"
        }
      }
    });

  });
});
