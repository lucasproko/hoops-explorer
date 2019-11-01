import { ncaaToKenpomLookup } from "../public-data/ncaaToKenpomLookup"

export const commonTeamQuery = function(params: any, publicKenpomEfficiency: any) {
  return {
     "bool": {
        "filter": [],
        "must_not": [],
        "should": [],
        "must": [
           {
              "script": {
                 "script": {
                   "source": "if (params.kp.isEmpty()) return true;\ndef kp_name = params.pbp_to_kp[doc[\"opponent.team.keyword\"].value];\nif (kp_name == null) {\n   kp_name = doc[\"opponent.team.keyword\"].value;\n} else {\n   kp_name = kp_name.pbp_kp_team\n}\ndef oppo = params.kp[kp_name];\nif (oppo != null) {\n def kp_rank = oppo['stats.adj_margin.rank'];\n def game_filter = params.game_filter.game_filter;\n //TODO: high major\n return (kp_rank >= game_filter.min_kp) && (kp_rank <= game_filter.max_kp);\n} else {\n return false;\n}\n\n",
                    "lang": "painless",
                    "params": {
                       "pbp_to_kp": ncaaToKenpomLookup,
                       "kp": publicKenpomEfficiency,
                       "game_filter": {
                          "game_filter": {
                            "min_kp": Number(params.minRank),
                            "max_kp": Number(params.maxRank)
                          }
                       }
                    }
                 }
              }
           },
           {
              "query_string": {
                "query": `team.team: "${params.team}"`
              }
           }
        ]
     }
  };
}
