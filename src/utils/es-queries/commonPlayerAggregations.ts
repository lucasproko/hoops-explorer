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
        ["off_adj_ppp"] //TOOD others as per above list
      ).mergeWith({
        //(nothing yet, see list above)
      }).value()
    ), //TODO rename the total_ to team_total for use in player stats calcs
    ...(_.chain(
        commonAggregations("opponent_stats", "def", publicEfficiency, lookup, avgEff)
      ).pick(
        ["def_adj_ppp"] //TOOD others as per above list
      ).mergeWith({
        //(nothing yet, see list above)
      }).value()
    ), //TODO rename some totals
    // Player based stats
    // The bulk are offensive:
    ...(_.chain(
        commonAggregations("player_stats", "off", publicEfficiency, lookup, avgEff)
      ).omit(
        [ "off_ppp", "off_to", "off_orb", "off_adj_opp", "off_adj_ppp" ] //TODO
      ).mergeWith({
        //(nothing yet, see list above)
      }).value()
    ),
    // Plus a few defensive ones
    ...(_.chain(
        commonAggregations("player_stats", "def", publicEfficiency, lookup, avgEff)
      ).pick(
        [ "total_def_poss", "def_poss" ] //(small number of defensive stats we do collect)
      ).mergeWith({
        //(nothing yet, see list above)
      }).value()
    )
  };
}
