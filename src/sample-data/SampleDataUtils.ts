import _ from "lodash";

export class SampleDataUtils {

  /** For snapshot testing, provides a more useful output than a giant list of stats */
  static summarizeEnrichedApiResponse(exampleRawResponse: Record<string, any>, mutableSample: boolean = false) {
    const expectedFields1 = mutableSample ? null : new Set(_.keys(exampleRawResponse));

    return {
      test: (val: any) => val && (val.off_efg ||
          val.hasOwnProperty("dRtg") || val.hasOwnProperty("oRtg") ||
          val.hasOwnProperty("deltaOffPpp") || val.hasOwnProperty("deltaDefPpp")
        ),
        //(pick a field that all stat sets have - plus special case for: diagnostics)
      print: (val: any, serialize: ((val: any) => string), indent: ((val: any) => string)) => {
        const expectedFields = expectedFields1 || new Set(_.keys(exampleRawResponse));
        if (val.off_efg) {
          return "{\n" +
            _.chain(val).toPairs().filter(kv => {
              return !expectedFields.has(kv[0]) //derived field)
                || (!kv[1]?.hasOwnProperty("value") && exampleRawResponse[kv[0]]?.hasOwnProperty("value")) //missing value
                || (kv[1]?.hasOwnProperty("value") && _.keys(kv[1]).length > 1) //(has extra properties)
            }).sortBy(0).map(kv => {
              return indent(`${kv[0]}: ` + serialize(kv[1]))
            }).value().join("\n\n") +
          "}";
        } else if (val.hasOwnProperty("dRtg") || val.hasOwnProperty("oRtg")) {
          return JSON.stringify(_.pick(val, [
            "oRtg", "adjORtg", "adjORtgPlus", "dRtg", "adjDRtg", "adjDRtgPlus"
          ]), null , 3);
        } else if (val.hasOwnProperty("deltaOffPpp") || val.hasOwnProperty("deltaDefPpp")) {
          return JSON.stringify(_.pick(val, [
            "deltaOffPpp", "deltaOffEfg", "deltaOffAdjEff", "deltaDefPpp", "deltaDefEfg", "deltaDefAdjEff"
          ]), null , 3);
        } else {
          return "???";
        }
      }
    }
  }


  /** From easier to read templates builds a bucket list */
  static buildResponseFromTemplateLineup(input: Record<string, any>) {
    const lineupAsObj = SampleDataUtils.buildResponseFromTemplateTeam(input);
    return _.toPairs(lineupAsObj).map(kv => {
      return { key: kv[0], ...(kv[1] as Record<string, any>) };
    })
  }

  /** From easier to read templates builds a bucket list */
  static buildResponseFromTemplateTeam(input: Record<string, any>) {
    const teamAsObj = _.transform(_.toPairs(input), (acc, inElKv) => {
      _.forEach(_.toPairs(inElKv[1] as Record<string, any>), (kv) => {
        _.forEach(_.toPairs(kv[1] as Record<string, any>), (deepKv) => {
          if (inElKv[0] != "main") {
            _.set(acc, `${kv[0]}.${deepKv[0]}${inElKv[0]}.value`, deepKv[1]);
          } else {
            _.set(acc, `${deepKv[0]}.${kv[0]}`, deepKv[1]);
          }
        });
      });
    }, {} as Record<string, any>);
    return teamAsObj;
  }

  /** From easier to read templates builds a bucket list */
  static buildResponseFromTemplatePlayer(input: Record<string, any>) {
    const flatPlayersAsObj = SampleDataUtils.buildResponseFromTemplateTeam(input);
    return _.transform(["baseline", "on", "off"], (acc, v) => {
      acc[v] = { player: {
        buckets: _.chain(flatPlayersAsObj).toPairs().filter(kv => {
          return kv[0].indexOf(v) == 0;
        }).map(kv => {
          const key = kv[0].substring(v.length + 2); //(+2 for ": ")
          return { ...(kv[1]), key: key }
        }).value()
      } };
    }, {} as Record<string, any>);
  }

  /** Builds an easier to manipulate template for the different responses, from an actual response */
  static buildTemplateFromResponseTeam(input: Record<string, Record<string, any>>) {
    return SampleDataUtils.buildTemplateFromResponseLineup(
      _.chain(input).toPairs().map((kv: [string, any]) => {
        return { key: kv[0], ...(kv[1]) }
      }).value()
    );
  }

  /** Builds an easier to manipulate template for the different responses, from an actual response */
  static buildTemplateFromResponsePlayer(input: Record<string, Record<string, any>>) {
    return SampleDataUtils.buildTemplateFromResponseLineup(
      _.chain(input).toPairs().flatMap((kv: [string, any]) => {
        const players = (kv[1]?.player?.buckets || []) as Array<Record<string, any>>;
        return players.map(p => { return { ...p, key: `${kv[0]}: ${p.key}` } });
      }).value()
    );
  }

  /** Builds an easier to manipulate template for the different responses, from an actual response */
  static buildTemplateFromResponseLineup(input: Array<Record<string, any>>, filter?: Set<String>) {
    const preSorted = _.transform(input, (acc, inEl) => {
      const recordId = inEl?.key || "unknown";
      const injectInfo = (k: string, prefix: string) => {
        const topLevelKey = k.substring(prefix.length);
        const realPrefix = prefix || "main";
        if (prefix) {
          const existingObj = _.get(acc, `${topLevelKey}.${recordId}`) || {};
          existingObj[realPrefix] = inEl[k]?.value;
          const sortedObj = _(existingObj).toPairs().sortBy(0).reverse().fromPairs().value()
          _.set(acc, `${topLevelKey}.${recordId}`, sortedObj);
        } else {
          _.set(acc, `main.${topLevelKey}.${recordId}`, inEl[k]);
        }
      };

      if (!filter || filter.has(recordId)) {
        _.keys(inEl).filter(k => k != "key").forEach(k => {
          const stat = _.find([
            "oppo_total_off_", "oppo_total_def_",
            "oppo_off_", "oppo_def_",

            "team_total_off_", "team_total_def_",
            "team_off_", "team_def_",

            "total_off_", "total_def_",
            "off_", "def_"
          ], prefix => k.indexOf(prefix) == 0);
          if (stat) {
            injectInfo(k, stat);
          } else {
            injectInfo(k, "");
          }
        });
      }
    }, {} as Record<string, any>);

    // Sort the keys into some sort of logical order
    return _.chain(preSorted).toPairs().sortBy([
      (kv: [ string , any ]) => {
        const key = kv[0];
        if (key == "main") {
          return 100;
        } else if ((key.indexOf("assist") >= 0) || (key.indexOf("to") >= 0) || (key.indexOf("ast") >= 0)) {
          return 4;
        } else if ((key.indexOf("ft") == 0) || (key.indexOf("fg") == 0) || (key == "efg")) {
          return 1;
        } else if ((key.indexOf("2p") == 0) || (key.indexOf("3p") == 0)) {
          return 2;
        } else if ((key.indexOf("rb") > 0)) {
          return 3;
        } else if ((key.indexOf("adj") >= 0)) {
          return 5;
        } else { //misc other stuff
          return 6;
        }
      },
      (kv: [ string , any ]) => {
        return kv[0];
      },
    ]).fromPairs().value();
  }
}
