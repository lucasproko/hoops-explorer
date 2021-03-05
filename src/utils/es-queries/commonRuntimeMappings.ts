
import _ from "lodash";

import { CommonFilterParams } from "../FilterModels";
import { CommonFilterType, QueryUtils } from "../QueryUtils";

export const commonRuntimeMappings = function(
  params: CommonFilterParams,
  lastDate: number, publicEfficiency: any, lookup: any
) {
  const queryFilters = QueryUtils.parseFilter(params.queryFilters || "");
  return {
    runtime_mappings: {
      is_high_major: {
        type: "boolean",
        script: {
          source: `if (0 != doc['common_lookup'].size()) emit((doc['common_lookup'].value & 1) > 0)`
        }
      },
      is_same_conf: {
        type: "boolean",
        script: {
          source: `if (0 != doc['common_lookup'].size()) emit((doc['common_lookup'].value & 2) > 0)`
        }
      },
      rank: {
        type: "long",
        script: {
          source: `if (0 != doc['common_lookup'].size()) emit((doc['common_lookup'].value >> 2) & 511)`
        }
      },
      _3p: {
        type: "double",
        script: {
          source: `if (0 != doc['common_lookup'].size()) emit(0.1*((doc['common_lookup'].value >> 11) & 1023))`
        }
      },
      tempo: {
        type: "double",
        script: {
          source: `if (0 != doc['common_lookup'].size()) emit(0.1*((doc['common_lookup'].value >> 21) & 1023))`
        }
      },
      off_adj: {
        type: "double",
        script: {
          source: `if (0 != doc['common_lookup'].size()) emit(0.1*((doc['common_lookup'].value >> 31) & 2047))`
        }
      },
      def_adj: {
        type: "double",
        script: {
          source: `if (0 != doc['common_lookup'].size()) emit(0.1*((doc['common_lookup'].value >> 42) & 2047))`
        }
      },
      common_lookup: {
        type: "long",
        script: {
          source: `
            if (!params.kp_info.isEmpty()) {
              def kp_name = params.pbp_to_kp[doc["opponent.team.keyword"].value];
              if (kp_name == null) {
                 kp_name = doc["opponent.team.keyword"].value;
              } else {
                 kp_name = kp_name.pbp_kp_team;
              }
              def oppo = params.kp_info[kp_name];
              if (oppo != null) {
                def is_high_major = oppo["is_high_major"] ?: 0;
                def oppo_conf = oppo["conf"];
                def is_same_conf = params.conf.equals(oppo_conf);
                def margin_rank = oppo["stats.adj_margin.rank"] ?: 0;

                def _3p = oppo["stats.off._3p_pct.value"] ?: 0.0;
                _3p = (_3p * 10).longValue() & 1023;

                def tempo = oppo["stats.adj_tempo.value"] ?: 0.0;
                tempo = (tempo * 10).longValue() & 1023;

                def off_adj = oppo["stats.adj_off.value"] ?: 0;
                off_adj = (off_adj * 10).longValue() & 2047;

                def def_adj = oppo["stats.adj_def.value"] ?: 0;
                def_adj = (def_adj * 10).longValue() & 2047;

                long returnVal = 0L | (is_high_major << 0)
                  | ((is_same_conf ? 1 : 0) << 1)
                  | ((margin_rank & 511) << 2)
                  | (_3p.longValue() << 11)
                  | (tempo.longValue() << 21)
                  | (off_adj.longValue() << 31)
                  | (def_adj.longValue() << 42)
                  ;
                emit(returnVal);
              }
            }
          `
          ,
          "lang": "painless",
          "params": {
             "pbp_to_kp": lookup,
             "kp_info": publicEfficiency, //(if empty then the query auto-returns true)
             "conf": QueryUtils.getConference(params.team || "", publicEfficiency, lookup) || ""
          }
        }
      }
    }
  };
}
