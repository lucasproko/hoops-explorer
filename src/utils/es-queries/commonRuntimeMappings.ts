
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
          source: `emit((doc['common_lookup'].value & 1) > 0)`
        }
      },
      is_same_conf: {
        type: "boolean",
        script: {
          source: `emit((doc['common_lookup'].value & 2) > 0)`
        }
      },
      rank: {
        type: "long",
        script: {
          source: `emit((doc['common_lookup'].value >> 8) & 4095)`
        }
      },
      off_rank: {
        type: "long",
        script: {
          source: `emit((doc['common_lookup'].value >> 20) & 4095)`
        }
      },
      def_rank: {
        type: "long",
        script: {
          source: `emit((doc['common_lookup'].value >> 32) & 4095)`
        }
      },
      common_lookup: {
        type: "long",
        script: {
          source: `
            long returnVal = -1L;
            if (!params.kp_info.isEmpty()) {
              def kp_name = params.pbp_to_kp[doc["opponent.team.keyword"].value];
              if (kp_name == null) {
                 kp_name = doc["opponent.team.keyword"].value;
              } else {
                 kp_name = kp_name.pbp_kp_team;
              }
              def oppo = params.kp_info[kp_name];
              if (oppo != null) {
                def is_high_major = oppo["is_high_major"];
                is_high_major = (null != is_high_major) ? is_high_major : 0;
                def oppo_conf = oppo["conf"];
                def is_same_conf = params.conf.equals(oppo_conf);
                is_same_conf = (null != is_same_conf) ? is_same_conf : false;
                def margin_rank = oppo["stats.adj_margin.rank"];
                margin_rank = (null != margin_rank) ? margin_rank : 0;
                def off_rank = oppo["stats.adj_off.rank"];
                off_rank = (null != off_rank) ? off_rank : 0;
                def def_rank = oppo["stats.adj_def.rank"];
                def_rank = (null != def_rank) ? def_rank : 0;

                returnVal = 0L | (is_high_major << 0)
                  | ((is_same_conf ? 0 : 1) << 1)
                  | (margin_rank << 8)
                  | (off_rank << 20)
                  | (def_rank.longValue() << 32);
              }
            }
            emit(returnVal);
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
