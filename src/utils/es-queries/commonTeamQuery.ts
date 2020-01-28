
import { CommonFilterParams } from "../FilterModels";

const garbageTimeFilter = [
  {
    "range": {
      "start_min": {
        "lt": 34.5 // (too early in the game)
      }
    }
  },
  {
    "range": {
      "end_min": {
        "gt": 40.0 // (will never filter OT)
      }
    }
  },
  {
    "script": {
      "script": { // see https://github.com/Alex-At-Home/cbb-on-off-analyzer/issues/40#issuecomment-576919670
        "source": `
        def diff = doc["score_info.start_diff"].value;
        def abs_diff = Math.abs(diff) - 0.5;
        def diff_to_sq = abs_diff >= 0.0 ? abs_diff : 0.0;
        def diff_sq = diff_to_sq*diff_to_sq;
        // (OT case filtered out)
        def remaining = (40.0 - doc["start_min"].value)*60.0;
        diff_sq <= remaining;
        `,
        "lang": "painless"
      }
    }
  }
];

export const commonTeamQuery = function(params: CommonFilterParams, publicEfficiency: any, lookup: any) {
  return {
     "bool": {
        "filter": [],
        "must_not": [],
        "should": params.filterGarbage ? garbageTimeFilter : [],
        "minimum_should_match": params.filterGarbage ? 1 : 0,
        "must": [
           {
              "script": {
                 "script": {
                   "source": "if (params.kp.isEmpty()) return true;\ndef kp_name = params.pbp_to_kp[doc[\"opponent.team.keyword\"].value];\nif (kp_name == null) {\n   kp_name = doc[\"opponent.team.keyword\"].value;\n} else {\n   kp_name = kp_name.pbp_kp_team\n}\ndef oppo = params.kp[kp_name];\nif (oppo != null) {\n def kp_rank = oppo['stats.adj_margin.rank'];\n def game_filter = params.game_filter.game_filter;\n //TODO: high major\n return (kp_rank >= game_filter.min_kp) && (kp_rank <= game_filter.max_kp);\n} else {\n return false;\n}\n\n",
                    "lang": "painless",
                    "params": {
                       "pbp_to_kp": lookup,
                       "kp": publicEfficiency,
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
              "term": {
                "team.team.keyword": `${params.team}`
              }
           }
        ]
     }
  };
}
