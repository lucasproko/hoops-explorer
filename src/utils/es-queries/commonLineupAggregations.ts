
import _ from "lodash";

/////////////////////////////////////////////////////////////

// Util methods

/** Painless script used below to calculate average offensive and defensive SoS */
const calculateAdjEff = function(offOrDef: "off" | "def") { return `
  def hca = 0.0;
  if (doc["location_type.keyword"].value == "Home") {
    hca = params.${offOrDef}_hca;
  } else if (doc["location_type.keyword"].value == "Away") {
    hca = -params.${offOrDef}_hca;
  }
  def kp_name = params.pbp_to_kp[doc["opponent.team.keyword"].value];
  if (kp_name == null) {
     kp_name = doc["opponent.team.keyword"].value;
  } else {
     kp_name = kp_name.pbp_kp_team;
  }
  def oppo = params.kp_${offOrDef}[kp_name];
  def adj_sos = null;
  if (oppo != null) {
     adj_sos = oppo['stats.adj_${offOrDef}.value'] - hca;
  }
  `;
};

/** Painless script used below to calculate average opponent's 3P */
const calculate3pSos = function() { return `
  def kp_name = params.pbp_to_kp[doc["opponent.team.keyword"].value];
  if (kp_name == null) {
     kp_name = doc["opponent.team.keyword"].value;
  } else {
     kp_name = kp_name.pbp_kp_team;
  }
  def oppo = params.kp_3p[kp_name];
  def sos_3p = null;
  if (oppo != null) {
     sos_3p = oppo['stats.off._3p_pct.value'];
  }
  `;
};

/** srcType/dstType are
 * - (see commonShotAggs)
 * - "poss"/"num_possessions", "to", "pts" (total: false)
 * - "fga", "fg.attempts"; "fta", "ft.attempts"
 * - "orb"x2; "drb"x2
*/
const commonMiscAggs = function(
  srcPrefix: string, dstPrefix: "off" | "def", srcType: string, dstType: string, suffix: string = ".total"
) {
  return {
    [`total_${dstPrefix}_${dstType}`]: {
       "sum": {
          "field": `${srcPrefix}.${srcType}${suffix}`
       }
    }
  };
}

/** shotType is 2p, 3p, 2prim, 2pmid */
const commonShotAggs = function(
  srcPrefix: string, dstPrefix: "off" | "def", altShotType: string, shotType: string, suffix: string
) {
  return {
    ...commonMiscAggs(srcPrefix, dstPrefix, `fg_${altShotType || shotType}.attempts`, `${shotType}_attempts`, suffix),
    ...commonMiscAggs(srcPrefix, dstPrefix, `fg_${altShotType || shotType}.made`, `${shotType}_made`, suffix),
    ...commonMiscAggs(srcPrefix, dstPrefix, `fg_${altShotType || shotType}.ast`, `${shotType}_ast`, suffix),
  };
}

/** commonShotAggs AND basically all the other stats also :) */
const commonAverageAggs = function(
  dstPrefix: "off" | "def", name: string, top: string, bottom: string, factor: number = 1.0
) {
  return {
    [`${dstPrefix}_${name}`]: {
       "bucket_script": {
          "buckets_path": {
            "my_var1": `total_${dstPrefix}_${top}`,
            "my_var2": `total_${dstPrefix}_${bottom}`
          },
          "script": `(params.my_var1 > 0) ? ${factor}*params.my_var1 / params.my_var2 : 0`
       }
    },
  };
}

/** shotType is 2p, 3p, 2prim, 2pmid */
const commonAverageShotAggs = function(dstPrefix: "off" | "def", shotType: string) {
  return {
    ...commonAverageAggs(dstPrefix, shotType, `${shotType}_made`, `${shotType}_attempts`),
    ...commonAverageAggs(dstPrefix, `${shotType}_ast`, `${shotType}_ast`, `${shotType}_made`)
  }
}

const commonAssistInfo = function(srcPrefix: string, dstPrefix: "off" | "def", shotType: string) {
  return {
    [`total_${dstPrefix}_ast_${shotType}`]: {
      "sum": {
         "field": `${srcPrefix}.ast_${shotType}.counts.total`
      }
    },
    ...commonAverageAggs(
      dstPrefix, `ast_${shotType}`, `ast_${shotType}`, `assist`
    )
  }
}

/////////////////////////////////////////////////////////////

// Public methods

/** srcPrefix is "team_stats", "opponent_stats", dstPrefix is "off", "def" */
export const commonAggregations = function(
  srcPrefix: string, dstPrefix: "off" | "def",
  publicEfficiency: any, lookup: any, avgEff: number
) {
  const oppoDstPrefix = (dstPrefix == "off") ? "def" : "off"; //(swivels)
  const bestPossCount =
    (srcPrefix == "opponent_stats" ? "team_stats" : "opponent_stats");

  // (if true, calcs adj_eff based on weighted lineup sets ... if false
  //  just uses average of SoS over entire dataset - means it's hard to compare sets
  //  of lineups against on/off, which feels wrong, even though appears slightly more accurate)
  const properAdjEffCalc = true;

  const typeSuffixFromPrefix = (typePrefix: "" | "scramble_" | "trans_") => { switch (typePrefix) {
    case "": return ".total";
    case "scramble_": return ".orb";
    case "trans_": return ".early";
  }};
  const typePrefixes = ["", "scramble_", "trans_"] as ("" | "scramble_" | "trans_")[]

  return {
    // Totals:
    ...commonMiscAggs(srcPrefix, dstPrefix, "num_possessions", "poss", ""),
    ...commonMiscAggs(srcPrefix, dstPrefix, "pts", "pts", ""),
    //TODO: needs to be an object not an array
    ...(_.transform(typePrefixes, (acc, typePrefix) => { return _.merge(acc, {
      ...commonMiscAggs(srcPrefix, dstPrefix, "to", typePrefix + "to", typeSuffixFromPrefix(typePrefix)),
      ...commonMiscAggs(srcPrefix, dstPrefix, "assist", typePrefix + "assist", typeSuffixFromPrefix(typePrefix)),
    }); }, {})),
    ...commonMiscAggs(srcPrefix, dstPrefix, "stl", "stl"), //(does want total)
    ...commonMiscAggs(srcPrefix, dstPrefix, "blk", "blk"), //(does want total)
    ...commonMiscAggs(srcPrefix, dstPrefix, "foul", "foul"), //(does want total)
    // Shots
    ...(_.transform(typePrefixes, (acc, typePrefix) => { return _.merge(acc, {
      ...commonShotAggs(srcPrefix, dstPrefix, "2p", typePrefix + "2p", typeSuffixFromPrefix(typePrefix)),
      ...commonShotAggs(srcPrefix, dstPrefix, "3p", typePrefix + "3p", typeSuffixFromPrefix(typePrefix)),
      ...commonShotAggs(srcPrefix, dstPrefix, "rim", typePrefix + "2prim", typeSuffixFromPrefix(typePrefix)),
      ...commonShotAggs(srcPrefix, dstPrefix, "mid", typePrefix + "2pmid", typeSuffixFromPrefix(typePrefix)),

      ...commonMiscAggs(srcPrefix, dstPrefix, "fg.attempts", typePrefix + "fga", typeSuffixFromPrefix(typePrefix)),
      ...commonMiscAggs(srcPrefix, dstPrefix, "fg.made", typePrefix + "fgm", typeSuffixFromPrefix(typePrefix)),
      ...commonMiscAggs(srcPrefix, dstPrefix, "ft.attempts", typePrefix + "fta", typeSuffixFromPrefix(typePrefix)),
      ...commonMiscAggs(srcPrefix, dstPrefix, "ft.made", typePrefix + "ftm", typeSuffixFromPrefix(typePrefix)),
    }); }, {})),
    // Rebounding
    ...commonMiscAggs(srcPrefix, dstPrefix, "orb", "orb"),
    ...commonMiscAggs(srcPrefix, dstPrefix, "drb", "drb"),
    // X/Y type expressions
    ...(_.transform(typePrefixes, (acc, typePrefix) => { return _.merge(acc, {
      ...commonAverageShotAggs(dstPrefix, typePrefix + "2p"),
      ...commonAverageShotAggs(dstPrefix, typePrefix + "3p"),
      ...commonAverageShotAggs(dstPrefix, typePrefix + "2prim"),
      ...commonAverageShotAggs(dstPrefix, typePrefix + "2pmid"),
      ...commonAverageAggs(dstPrefix, typePrefix + "ft", typePrefix + "ftm", typePrefix + "fta"),
      ...commonAverageAggs(dstPrefix, typePrefix + "ftr", typePrefix + "fta", typePrefix + "fga"),
      // Shot type stats
      ...commonAverageAggs(dstPrefix, typePrefix + "2primr", typePrefix + "2prim_attempts", typePrefix + "fga"),
      ...commonAverageAggs(dstPrefix, typePrefix + "2pmidr", typePrefix + "2pmid_attempts", typePrefix + "fga"),
      ...commonAverageAggs(dstPrefix, typePrefix + "3pr", typePrefix + "3p_attempts", typePrefix + "fga"),
      // Assist %s (includes totals for ast_)
      ...commonAverageAggs(dstPrefix, typePrefix + "assist", typePrefix + "assist", typePrefix + "fgm"),
    }); }, {})),
    // Other assist %s (includes totals for ast_)
    ...commonAssistInfo(srcPrefix, dstPrefix, "rim"),
    ...commonAssistInfo(srcPrefix, dstPrefix, "mid"),
    ...commonAssistInfo(srcPrefix, dstPrefix, "3p"),
    // Per Possession stats
    ...(_.transform(_.drop(typePrefixes), (acc, typePrefix) => { return _.merge(acc, { //TODO
      [`total_${dstPrefix}_${typePrefix}pts`]: {
        "bucket_script": {
          "buckets_path": {
            "made3p": `total_${dstPrefix}_${typePrefix}3p_made`,
            "made2p": `total_${dstPrefix}_${typePrefix}2p_made`,
            "ftm": `total_${dstPrefix}_${typePrefix}ftm`,
          },
          "script": "3*params.made3p + 2*params.made2p + params.ftm"
        }
      },
      [`total_${dstPrefix}_${typePrefix}poss`]: { //fgm + (approx-unrebounded) fgM + 0.475*fta + to
        "bucket_script": {
          "buckets_path": {
            "fga": `total_${dstPrefix}_${typePrefix}fga`,
            "fgm": `total_${dstPrefix}_${typePrefix}fgm`,
            "fta": `total_${dstPrefix}_${typePrefix}fta`,
            "to": `total_${dstPrefix}_${typePrefix}to`,

            "var_orb": `total_${dstPrefix}_orb`, //(for "trans_", treat ORB% as 0 since never count post-ORB as transition)
            "var_drb": `total_${oppoDstPrefix}_drb`,
          },
          "script": `
            def fgM = params.fga - params.fgm;
            def rebound_pct = (params.var_orb > 0) ? 1.0*params.var_orb/(params.var_orb + params.var_drb) : 0.0;
            ${(typePrefix == "trans_") ? "rebound_pct = 0.0;" : "" }
            return params.fgm + (1.0 - rebound_pct)*fgM + 0.475*params.fta + params.to;
          `
        }
      },
    }); }, {})),
    ...(_.transform(typePrefixes, (acc, typePrefix) => { return _.merge(acc, {
      ...commonAverageAggs(dstPrefix, typePrefix + "ppp", typePrefix + "pts", typePrefix + "poss", 100.0),
      ...commonAverageAggs(dstPrefix, typePrefix + "to", typePrefix + "to", typePrefix + "poss"),
    }); }, {})),
    // Dumb rename:
    [`${dstPrefix}_poss`]: { //TODO fix this, there's a mess of total prefixes
      "bucket_script": {
        "buckets_path": {
          "var": `total_${dstPrefix}_poss`
        },
        "script": "params.var"
      }
    },
    // Finally, tricky numbers:
    // ORB:
    [`${dstPrefix}_orb`]: {
      "bucket_script": {
        "buckets_path": {
          "var_orb": `total_${dstPrefix}_orb`,
          "var_drb": `total_${oppoDstPrefix}_drb`
        },
        "script": "(params.var_orb > 0) ? 1.0*params.var_orb/(params.var_orb + params.var_drb) : 0.0"
      }
    },
    // eFG:
    ...(_.transform(typePrefixes, (acc, typePrefix) => { return _.merge(acc, {
      [`${dstPrefix}_${typePrefix}efg`]: {
         "bucket_script": {
            "buckets_path": {
               "my_varFG": `total_${dstPrefix}_${typePrefix}fga`,
               "my_var2": `total_${dstPrefix}_${typePrefix}2p_made`,
               "my_var3": `total_${dstPrefix}_${typePrefix}3p_made`
            },
            "script": `(params.my_varFG > 0) ? (1.0*params.my_var2 + 1.5*params.my_var3) / params.my_varFG : 0`
         }
      },
    }); }, {})),
    [`${dstPrefix}_adj_opp`]: {
        "weighted_avg": {
           "weight": {
              "field": `${bestPossCount}.num_possessions`
           },
           "value": {
              "script": {
                 "source": `${calculateAdjEff(dstPrefix)}\nreturn adj_sos;`,
                 "lang": "painless",
                 "params": {
                    "avgEff": avgEff,
                    "pbp_to_kp": lookup,
                    [`kp_${dstPrefix}`]: publicEfficiency,
                    "off_hca": 1.5, //(this should be derived from year/gender at some point?)
                    "def_hca": -1.5
                 }
              }
           }
        }
     },
     ...((dstPrefix == "def") ? {"def_3p_opp": {
       "weighted_avg": {
          "weight": {
             "field": `opponent_stats.fg_3p.attempts.total`
          },
          "value": {
             "script": {
                "source": `${calculate3pSos()}\nreturn sos_3p;`,
                "lang": "painless",
                "params": {
                   "pbp_to_kp": lookup,
                   "kp_3p": publicEfficiency
                }
             }
          }
        }
     }} : {}),
     [`${dstPrefix}_adj_ppp`]: properAdjEffCalc ? {
         "weighted_avg": {
            "weight": {
               "field": `${srcPrefix}.num_possessions`
            },
            "value": {
               "script": { // calcs adj_sos
                  "source": `${calculateAdjEff(oppoDstPrefix)}
                    if (null != adj_sos) {
                       def bottom = adj_sos*doc["${srcPrefix}.num_possessions"].value;
                       return (bottom > 0) ?
                         100.0*doc["${srcPrefix}.pts"].value*params.avgEff/bottom : params.avgEff;
                    } else {
                      return null;
                    }
                  `,
                  "lang": "painless",
                  "params": {
                     "avgEff": avgEff,
                     "pbp_to_kp": lookup,
                     [`kp_${oppoDstPrefix}`]: publicEfficiency,
                     "off_hca": 1.5, //(this should be derived from year/gender at some point?)
                     "def_hca": -1.5
                  }
               }
            }
         }
      } : {
       "bucket_script": {
          "buckets_path": {
            "var_adj_opp": `${oppoDstPrefix}_adj_opp`,
            "var_ppp": `${dstPrefix}_ppp`
          },
          "gap_policy": "insert_zeros",
          "script": {
            "lang": "painless",
            "source": `
              (params.var_adj_opp > 0) ?
                params.var_ppp*params.avgEff/params.var_adj_opp : params.avgEff
            `,
            "params": {
              "avgEff": avgEff
            }
          }
        }
     }
  };
}

export const commonLineupAggregations = function(publicEfficiency: any, lookup: any, avgEff: number) {
  return {
    // Derived
    ...commonAggregations("team_stats", "off", publicEfficiency, lookup, avgEff),
    ...commonAggregations("opponent_stats", "def", publicEfficiency, lookup, avgEff)
   };
}
