import { commonAggregations } from "./commonLineupAggregations";

import _ from "lodash";

//TODO:
// offense:
// - pts/50 (approx 30mpg on 70 possessions)
// - usage ... (player_fga + player_to + 0.44*player_ft)/(team_fga + team_to + 0.44*team_ft)
// - orb ... player_orb / (team_orb + opponent_drb)
// - (ortg: additional stats: team_ast, team_fga, team_pts etc)
// - assists ... player_assists / (team_fga - player_fga)
// defense:
// - steals ... player_stl / opponent_poss
// - drb .... player_drb / (team_drb + opponent_orb)
// - (drtg)
// - FC/50
// - blocks ... player_block/(opponent_fga - opponent_3pa)

export const commonPlayerAggregations = function(publicEfficiency: any, lookup: any, avgEff: number) {

  //TOOD: for orb% and drb% I need the FGM for the two teams

  return {
    // Team based stats
    ...(_.chain(
        commonAggregations("team_stats", "off", publicEfficiency, lookup, avgEff)
      ).pick(
        [ "total_off_poss", "total_off_fga", "total_off_fta", "total_off_to",
          "total_off_orb", "total_off_drb"
        ]
      ).mergeWith({
        //(nothing yet, see list above)
      }).mapKeys((value, key) => {
        return `team_${key}`;
      }).value()
    ), //TODO rename the total_ to team_total for use in player stats calcs
    ...(_.chain(
        commonAggregations("opponent_stats", "def", publicEfficiency, lookup, avgEff)
      ).pick(
        [ "total_def_poss", "total_def_fga", "total_def_3p_attempts",
          "total_def_drb", "total_def_orb"
        ]
      ).mergeWith({
        //(nothing yet, see list above)
      }).mapKeys((value, key) => {
        return `oppo_${key}`;
      }).value()
    ),
    // Player based stats
    // The bulk are offensive:
    ...(_.chain(
        commonAggregations("player_stats", "off", publicEfficiency, lookup, avgEff)
      ).omit(
        [ "off_poss", "off_ppp", "off_to", "off_orb", "off_adj_opp", "off_adj_ppp" ]
      ).mergeWith({

        // Offensive fields

        "off_poss": { // (player_fga + player_to + 0.44*player_ft)
          "bucket_script": {
            "buckets_path": {
              "fga": "total_off_fga",
              "to": "total_off_to",
              "fta": "total_off_fta"
            },
            "script": "params.fga + params.to + 0.44*params.fta"
          }
        },
        "off_team_poss": {//total_off_pos
          "bucket_script": {
            "buckets_path": {
              "team_poss": "team_total_off_poss"
            },
            "script": "params.team_poss"
          }
        },
        "off_to": { // player_to/player_off_poss
          "bucket_script": {
            "buckets_path": {
              "to": "total_off_to",
              "poss": "off_poss"
            },
            "script": "params.poss > 0 ? 1.0*params.to/params.poss : 0.0"
          }
        },
        "off_orb": { // player_orb/(team_orb + oppo_drb)
          "bucket_script": {
            "buckets_path": {
              "orb": "total_off_orb",
              "team_orb": "team_total_off_orb",
              "oppo_drb": "oppo_total_def_drb",
            },
            "script": "params.team_orb > 0 || params.oppo_drb > 0 ? 1.0*params.orb/(params.team_orb + params.oppo_drb) : 0.0"
          }
        },
        "off_usage": { //off_pos/(team_fga + team_to + 0.44*team_ft)
          "bucket_script": {
            "buckets_path": {
              "off_poss": "off_poss",
              "fga": "team_total_off_fga",
              "to": "team_total_off_to",
              "fta": "team_total_off_fta"
            },
            "script": `params.fga > 0 || params.to > 0 || params.fta > 0 ?
                        params.off_poss/(params.fga + params.to + 0.44*params.fta) : 0.0`
          }
        },

        // Defensive fields

        "def_orb": { // player_drb/(team_drb + oppo_orb)
          "bucket_script": {
            "buckets_path": {
              "drb": "total_off_drb",
              "oppo_orb": "oppo_total_def_orb",
              "team_drb": "team_total_off_drb",
            },
            "script": "params.oppo_orb > 0 || params.team_drb > 0 ? 1.0*params.drb/(params.oppo_orb + params.team_drb) : 0.0"
          }
        },
        "def_ftr": { //FC/50
          "bucket_script": {
            "buckets_path": {
              "fouls": "total_off_foul",
              "poss": "total_off_poss"
            },
            "script": "params.poss > 0 ? 50.0*params.fouls/params.poss : 0.0"
          }
        },
        "def_to": { //steals ... player_stl / opponent_poss
          "bucket_script": {
            "buckets_path": {
              "stl": "total_off_stl",
              "poss": "total_off_poss"
            },
            "script": "params.poss > 0 ? 1.0*params.stl/params.poss : 0.0"
          }
        },
        "def_2prim": { //blo ... player_stl / opponent_poss
          "bucket_script": {
            "buckets_path": {
              "blk": "total_off_blk",
              "fga": "oppo_total_def_fga",
              "fg3pa": "oppo_total_def_3p_attempts",
            },
            "script": "(params.fga - params.fg3pa) > 0 ? 1.0*params.blk/(params.fga - params.fg3pa) : 0.0"
          }
        }

      }).value()
    ),
    // Plus a few defensive ones
    // ...(_.chain(
    //     commonAggregations("player_stats", "def", publicEfficiency, lookup, avgEff)
    //   ).pick(
    //     [ ] //(just defensive SoS, when I want it)
    //   ).value()
    // )
  };
}
