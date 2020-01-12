

import _ from 'lodash';

import { LineupUtils } from "../LineupUtils"
import { GameFilterParams, LineupFilterParams, TeamReportFilterParams } from "../utils/FilterModels";
import { sampleLineupStatsResponse } from "../../sample-data/sampleLineupStatsResponse";
import { LineupStatsModel } from './LineupStatsTable';

describe("LineupUtils", () => {
  test("LineupUtils - lineupToTeamReport", () => {

    const lineupReport: LineupStatsModel = {
      lineups: sampleLineupStatsResponse.responses[0].aggregations.lineups.buckets,
      avgOff: 100.0,
      error_code: "test"
    };

    const onOffReport = LineupUtils.lineupToTeamReport(lineupReport);

    const playerList = _.chain(onOffReport.players || []).flatMap((onOff) => {
      return [ onOff.on.key, onOff.off.key ];
    }).sortBy().value();

    // Check list of expected players
    expect(playerList).toEqual(
      [
        "'OFF' Ayala, Eric", //1,2
        "'OFF' Cowan, Anthony", //1,2,3
        "'OFF' Morsell, Darryl", //1,3
        "'OFF' Scott, Donta", //2,3
        "'OFF' Smith, Jalen", //1,2
        "'OFF' Wiggins, Aaron", //1,2,3
        "'ON' Ayala, Eric",
        "'ON' Cowan, Anthony",
        "'ON' Morsell, Darryl",
        "'ON' Scott, Donta",
        "'ON' Smith, Jalen",
        "'ON' Wiggins, Aaron",
      ]
    );

    // Check Wiggins "OFF" values are zero'd

    const onOnlyOffVals = _.chain(onOffReport.players).filter((p) => {
      return p.off.key == "'OFF' Wiggins, Aaron";
    }).map((p) => p.off).flatMap((off) => {
      return _.chain(off).toPairs().filter((kv) => {
        return !_.isObject(kv[1]) || ((kv[1] as any).value != 0)
      }).value();
    }).fromPairs().value();

    expect(onOnlyOffVals).toEqual({ key: "'OFF' Wiggins, Aaron" }); //(all vals are 0)

    // Spot check some values

    const toFixed = (obj: any) => {
      return obj.hasOwnProperty("value") ? { value: obj.value.toFixed(3) } : obj
    };

    const someOnOffVals = _.chain(onOffReport.players).filter((p) => {
      return p.on.key == "'ON' Ayala, Eric";
    }).flatMap((p) => [ p.on, p.off ]).map((onOrOff) => {
      return _.chain(onOrOff).pick([
        "key", "off_poss", "def_poss", "off_ppp", "def_ppp",
        "total_off_fga", "points_scored", "doc_count", "player_array" // (these are all ignored)
      ]).mapValues(toFixed).value();
    }).value();

    const totalOffPoss = 192 + 102;
    const totalDefPoss = 185 + 97;
    expect(someOnOffVals).toEqual([
      _.mapValues({
        key: "'ON' Ayala, Eric",
        off_poss: { value: totalOffPoss }, def_poss: { value: totalDefPoss },
        off_ppp: { value: 192.0/(totalOffPoss)*112.5 + 102.0/(totalOffPoss)*109.80392156862744 },
        def_ppp: { value: 185.0/(totalDefPoss)*89.1891891891892 + 97.0/(totalDefPoss)*80.41237113402062 },
      }, toFixed),
      _.mapValues({
        key: "'OFF' Ayala, Eric",
        off_poss: { value: 101 }, def_poss: { value: 103 },
        off_ppp: { value: 91.08910891089108 },
        def_ppp: { value: 79.6116504854369 },
      }, toFixed),
    ]);

  });
});
