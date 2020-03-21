
/////////////////////////////////////////////////////////////

// Util methods

/** Painless script used below to calculate average offensive and defensive SoS */
const calculateSos = function(offOrDef: "off" | "def") { return `
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
  def oppo = params.kp[kp_name];
  if (oppo != null) {
   return oppo['stats.adj_${offOrDef}.value'] - hca;
  } else {
   return null;
  }
  `;
}

/** srcType/dstType are
 * - (see commonShotAggs)
 * - "poss"/"num_possessions", "to", "pts" (total: false)
 * - "fga", "fg.attempts"; "fta", "ft.attempts"
 * - "orb"x2; "drb"x2
*/
const commonMiscAggs = function(
  srcPrefix: string, dstPrefix: "off" | "def", srcType: string, dstType: string, totalSuffix: boolean = true
) {
  return {
    [`total_${dstPrefix}_${dstType}`]: {
       "sum": {
          "field": `${srcPrefix}.${srcType}${totalSuffix ? ".total" : ""}`
       }
    }
  };
}

/** shotType is 2p, 3p, 2prim, 2pmid */
const commonShotAggs = function(srcPrefix: string, dstPrefix: "off" | "def", shotType: string) {
  return {
    ...commonMiscAggs(srcPrefix, dstPrefix, `fg_${shotType}_attempts`, `${shotType}.attempts`),
    ...commonMiscAggs(srcPrefix, dstPrefix, `fg_${shotType}_made`, `${shotType}.made`)
  };
}

/** commonShotAggs AND basically all the other stats also :) */
const commonAverageAggs = function(
  dstPrefix: "off" | "def", name: string, top: string, bottom: string,
  dstPrefix2: "off" | "def" | undefined = undefined, factor: number = 1.0
) {
  return {
    [`${dstPrefix}_${name}`]: {
       "bucket_script": {
          "buckets_path": {
             "my_var2": `total_${dstPrefix2 || dstPrefix}_${bottom}`,
             "my_var1": `total_${dstPrefix}_${top}`
          },
          "script": `(params.my_var1 > 0) ? ${factor}*params.my_var1 / params.my_var2 : 0`
       }
    },
  };
}

/** shotType is 2p, 3p, 2prim, 2pmid */
const commonAverageShotAggs = function(dstPrefix: "off" | "def", shotType: string) {
  return commonAverageAggs(dstPrefix, shotType, `${shotType}_attempts`, `${shotType}_made`);
}

/////////////////////////////////////////////////////////////

// Public methods

/** srcPrefix is "team_stats", "opponent_stats", dstPrefix is "off", "def" */
export const commonAggregations = function(
  srcPrefix: string, dstPrefix: "off" | "def",
  publicEfficiency: any, lookup: any
) {
  const oppoDstPrefix = (dstPrefix == "off") ? "def" : "off"; //(swivels)
  const bestPossCount = srcPrefix ==
    "player_stats" ? srcPrefix : "opponent_stats"; //(for oppo SoS use opponent possessions if available)
  return {
    // Totals:
    ...commonMiscAggs(srcPrefix, dstPrefix, "poss", "num_possessions", false),
    ...commonMiscAggs(srcPrefix, dstPrefix, "pts", "pts", false),
    ...commonMiscAggs(srcPrefix, dstPrefix, "to", "to"), //(does want total)
    // Shots
    ...commonShotAggs(srcPrefix, dstPrefix, "2p"),
    ...commonShotAggs(srcPrefix, dstPrefix, "3p"),
    ...commonShotAggs(srcPrefix, dstPrefix, "2prim"),
    ...commonShotAggs(srcPrefix, dstPrefix, "2pmid"),
    ...commonMiscAggs(srcPrefix, dstPrefix, "fga", "fg.attempts"),
    ...commonMiscAggs(srcPrefix, dstPrefix, "fta", "ft.attempts"),
    // Rebounding
    ...commonMiscAggs(srcPrefix, dstPrefix, "orb", "orb"),
    ...commonMiscAggs(srcPrefix, dstPrefix, "drb", "drb"),
    // X/Y type expressions
    ...commonAverageShotAggs(dstPrefix, "2p"),
    ...commonAverageShotAggs(dstPrefix, "3p"),
    ...commonAverageShotAggs(dstPrefix, "2prim"),
    ...commonAverageShotAggs(dstPrefix, "2pmid"),
    ...commonAverageAggs(dstPrefix, "ftr", "fta", "fga"),
    ...commonAverageAggs(
      dstPrefix, "orb", "orb", "drb", oppoDstPrefix
    ),
    // Per Possession stats
    ...commonAverageAggs(dstPrefix, "ppp", "pts", "poss", undefined, 100.0),
    ...commonAverageAggs(dstPrefix, "to", "to", "poss"),
    // Shot type stats
    ...commonAverageAggs(dstPrefix, "2primr", "2prim", "fga"),
    ...commonAverageAggs(dstPrefix, "2pmidr", "2pmid", "fga"),
    ...commonAverageAggs(dstPrefix, "3pr", "3p", "fga"),
    // Finally, tricky numbers:
    // eFG:
    [`${dstPrefix}_eFG`]: {
       "bucket_script": {
          "buckets_path": {
             "my_varFG": `total_${dstPrefix}_fga`,
             "my_var2": `total_${dstPrefix}_2p`,
             "my_var3": `total_${dstPrefix}_3p`
          },
          "script": `(params.my_varFG > 0) ? (params.my_var2 + 1.5*params.my_var3) / params.my_varFG : 0`
       }
    },
    [`${dstPrefix}_adj_opp`]: { //TODO: pass avg efficiency in and calc the team's adjusted efficiency
        "weighted_avg": {
           "weight": {
              "field": `${bestPossCount}.num_possessions`
           },
           "value": {
              "script": {
                 "source": calculateSos(dstPrefix),
                 "lang": "painless",
                 "params": {
                    "pbp_to_kp": lookup,
                    "kp": publicEfficiency,
                    "off_hca": 1.5 //(this should be derived from year/gender at some point?)
                 }
              }
           }
        }
     }
  };
}

export const commonLineupAggregations = function(publicEfficiency: any, lookup: any) {
  return {
    // Derived
    ...commonAggregations("team_stats", "off", publicEfficiency, lookup),
    ...commonAggregations("opponent_stats", "def", publicEfficiency, lookup),
   };
}
