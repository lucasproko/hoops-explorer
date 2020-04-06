

import _ from 'lodash';

import { LineupUtils } from "../LineupUtils";
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

    [ 0, 10 ].forEach((diagMode) => {
      [ 0, 100 -100, -500 ].forEach((regressDiffs) => {
        [ false, true ].forEach((incOnOff) => {

          const onOffReport = LineupUtils.lineupToTeamReport(lineupReport, incOnOff, regressDiffs, diagMode);

          const playerList = _.chain(onOffReport.players || []).flatMap((onOff) => {
            return [ onOff.on.key, onOff.off.key ];
          }).sortBy().value();

          const replacementPlayerList = _.chain(onOffReport.players || []).flatMap((onOff) => {
            return [ onOff?.replacement?.key ];
          }).filter((k) => !_.isUndefined(k)).sortBy().value();

          // Check list of expected players
          expect(playerList).toEqual(
            [
              "'Off' Ayala, Eric", //1,2
              "'Off' Cowan, Anthony", //1,2,3
              "'Off' Morsell, Darryl", //1,3
              "'Off' Scott, Donta", //2,3
              "'Off' Smith, Jalen", //1,2
              "'Off' Wiggins, Aaron", //1,2,3
              "'On' Ayala, Eric",
              "'On' Cowan, Anthony",
              "'On' Morsell, Darryl",
              "'On' Scott, Donta",
              "'On' Smith, Jalen",
              "'On' Wiggins, Aaron",
            ]
          );
          expect(replacementPlayerList).toEqual(
            incOnOff ? [
              "'r:On-Off' Ayala, Eric",
              "'r:On-Off' Cowan, Anthony",
              "'r:On-Off' Morsell, Darryl",
              "'r:On-Off' Scott, Donta",
              "'r:On-Off' Smith, Jalen",
              "'r:On-Off' Wiggins, Aaron",
            ]: []
          );

          // Check Wiggins "OFF" values are zero'd

          const onOnlyOffVals = _.chain(onOffReport.players).filter((p) => {
            return p.off.key == "'Off' Wiggins, Aaron";
          }).map((p) => p.off).flatMap((off) => {
            return _.chain(off).toPairs().filter((kv) => {
              return !_.isObject(kv[1]) || ((kv[1] as any).value != 0)
            }).value();
          }).fromPairs().value();

          expect(onOnlyOffVals).toEqual({ key: "'Off' Wiggins, Aaron" }); //(all vals are 0)

          // Spot check some values

          const toFixed = (obj: any) => {
            return obj.hasOwnProperty("value") ? { value: obj.value.toFixed(3) } : obj
          };

          const someOnOffVals = _.chain(onOffReport.players).filter((p) => {
            return p.on.key == "'On' Ayala, Eric";
          }).flatMap((p) => [ p.on, p.off, p.replacement ]).map((onOrOff) => {
            return _.chain(onOrOff || {}).pick([
              "key", "off_poss", "def_poss",
              "off_ppp", "def_ppp", "off_adj_opp", "def_adj_opp",
              "def_2prim", "def_2primr",
              "off_orb", "def_orb", "off_ftr",
              //^(note FTR has a different implementation because you can have lineups with FTs but no FGAs
              // this is not currently tested here, except by inspection on real data)
              "total_off_fga",
              "total_off_pts", "doc_count", "player_array" // (these are all ignored)
            ]).mapValues(toFixed).value();
          }).value();

          // Check build diagnostics when required
          if ((diagMode > 0) && (incOnOff)) {
            const same4Lineups = _.chain(onOffReport.players).filter((p) => {
              return p.on.key == "'On' Ayala, Eric";
            }).flatMap((p) => p.replacement.myLineups.map((l: any) => l.key)).value();
            expect(same4Lineups).toEqual(
              ["AaWiggins_AnCowan_DaMorsell_ErAyala_JaSmith", "AaWiggins_AnCowan_DoScott_ErAyala_JaSmith"]
            );
          }

          const regressed = (regress: number, val0: string, valBy: string, valTo: string) => {
            if (regress > 0) {
              return valBy;
            } else if (regress < 0) {
              if (regress > -200) {
                return val0;
              } else {
                return valTo;
              }
            } else {
              return val0;
            }
          };

          const totalOffPoss = 196 + 102;
          const totalDefPoss = 189 + 97;
          const totalOffFga = 167 + 96;
          const totalDefFga = 158 + 93;
          const offOrbAllowed = 39 + 21;
          const offDrbAllowed = 90 + 43;
          const defOrbAllowed = 19 + 27;
          const defDrbAllowed = 68 + 36;
          expect(someOnOffVals).toEqual([
            _.mapValues({
              key: "'On' Ayala, Eric",
              off_poss: { value: totalOffPoss }, def_poss: { value: totalDefPoss },
              off_ppp: { value: 196.0/(totalOffPoss)*111.22448979591837 + 102.0/(totalOffPoss)*109.80392156862744 },
              def_ppp: { value: 189.0/(totalDefPoss)*90.47619047619048 + 97.0/(totalDefPoss)*80.41237113402062 },
              off_adj_opp: { value: 189.0/(totalDefPoss)*103.93650793650794 + 97.0/(totalDefPoss)*104.70927835051546 },
              def_adj_opp: { value: 196.0/(totalOffPoss)* 95.56989795918368 + 102.0/(totalOffPoss)*93.46372549019607 },

              def_2prim: { value: (40.0/(40 + 28))*0.575 + (28.0/(40 + 28))*0.5 },
              def_2primr: { value: (158.0/totalDefFga)*0.25316455696202533 + (93.0/totalDefFga)*0.3010752688172043 },
              off_orb: { value:
                ((39.0 + 68)/(offOrbAllowed + defDrbAllowed))*0.3644859813084112 +
                ((21.0 + 36)/(offOrbAllowed + defDrbAllowed))*0.3684210526315789
              },
              def_orb: { value:
                ((90.0 + 19)/(offDrbAllowed + defOrbAllowed))*0.1743119266055046 +
                ((43.0 + 27)/(offDrbAllowed + defOrbAllowed))*0.38571428571428573
              },
              off_ftr: { value: (167.0/totalOffFga)*0.49700598802395207 + (96.0/totalOffFga)*0.19791666666666666 },

              total_off_fga: { value: totalOffFga },
              total_off_pts: { value: 330.0 }
            }, toFixed)
            ,
            _.mapValues({
              key: "'Off' Ayala, Eric",
              off_poss: { value: 111 }, def_poss: { value: 114 },
              off_ppp: { value: 89.1891891891892 },
              def_ppp: { value: 77.19298245614036 },
              off_adj_opp: { value: 106.32105263157895 },
              def_adj_opp: { value: 93.37927927927929 },

              def_2prim: { value: 0.5185185185185185 },
              def_2primr: { value: 0.3176470588235294 },
              off_orb: { value: 0.29508196721311475 },
              def_orb: { value: 0.24561403508771928 },
              off_ftr: { value: 0.5517241379310345 },

              total_off_fga: { value: 87 },
              total_off_pts: { value: 99.0 }
            }, toFixed)
            ,
            incOnOff ? { //(hand-chcked)
              key: "'r:On-Off' Ayala, Eric",
              "off_poss": { "value": "248.043" },
              "def_poss": { "value": "247.033" },
              "off_ppp": { "value": regressed(regressDiffs, "21.426", "15.270", "10.629") },
              "def_ppp": { "value": regressed(regressDiffs, "9.013", "6.416", "4.453") },
              "off_adj_opp": { "value": regressed(regressDiffs, "-2.057", "-1.464", "-1.018")  },
              "def_adj_opp": { "value": regressed(regressDiffs, "1.288", "0.918", "0.638") },
              "def_2prim": { "value": regressed(regressDiffs, "0.022", "0.015", "0.010") },
              "def_2primr": { "value": regressed(regressDiffs, "-0.043", "-0.031", "-0.021") },
              "off_orb": { "value": regressed(regressDiffs, "0.071", "0.055", "0.041") },
              "def_orb": { "value": regressed(regressDiffs, "0.024", "0.019", "0.014") },
              "off_ftr": { "value": regressed(regressDiffs, "-0.187", "-0.135", "-0.095") },
              "total_off_fga": { "value": "205.680" },
              "total_off_pts": { "value": "241.264" }
            } : {}
          ]);
          // Check roster

          const lineupComp = _.chain(onOffReport.players).filter((p) => {
            return p.on.key == "'On' Ayala, Eric";
          }).map((p) => _.pick(p.teammates, [ 'Cowan, Anthony' ])).value();

          expect(lineupComp).toEqual([
            { "Cowan, Anthony": {
              on: { off_poss: 196 + 102, def_poss: 189 + 97 },
              off: { off_poss: 111, def_poss: 114 }
            }}
          ]);

          // Check empty lineup:

          const emptyReplacementOnOff = _.chain(onOffReport.players).filter((p) => {
            return p?.replacement?.key == "'r:On-Off' Wiggins, Aaron";
          }).map((p) => p?.replacement || {}).value();

          expect(emptyReplacementOnOff).toEqual(incOnOff ? [
            {
              key: "'r:On-Off' Wiggins, Aaron",
              lineupUsage: {},
              myLineups: diagMode > 0 ? [] : undefined
            }
          ] : []);

        });//(end loop over incOnOff)
      });//(end loop over regress diffs)
    });//(end loop over diag mode)
  });
});
