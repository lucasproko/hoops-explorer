import _ from 'lodash';
import { HighMajorConfs } from "../public-data/ConferenceInfo"

/** Returns the full set of information from the efficiency lookup primarily from KenPom (with permission) */
export const efficiencyLookup = function(
    year: String,
    nameLookup: Record<string, Record<string, string>> //(from public-data/ncaaToKenomLookup)
) {
    //POST kenpom_all/_search
    return {
        "from": "0",
        "_source": {
           "includes": [
              "ncaa_name",
              "team_season.year",
              "conf",
              "stats.adj_off",
              "stats.adj_def",
              "stats.adj_margin",
              "stats.adj_tempo",
              "stats.off._3p_pct.value",
              "total_poss",
              "ncaa_seed"
           ],
           "excludes": []
        },
        "sort": [
           {
              "stats.adj_margin.rank": {
                 "order": "asc"
              }
           }
        ],
        "size": "1000",
        "query": {
           "bool": {
              "filter": [],
              "must_not": [],
              "should": [],
              "must": [
                 {
                    "query_string": {
                       "query": `team_season.year:${year}` //(eg 2022 for 21/22)
                    }
                 }
              ]
           }
        },
        "script_fields": {
           "ncaa_name": {
              "script": {
                 "lang": "painless",
                 "source": "// Use doc and params, return the field value\ndef team = doc[\"team_season.team.keyword\"].value;\ndef year = doc[\"team_season.year\"].value.toString();\ndef paramKey = \"kp_to_pbp\";\ndef pbp_team = params[paramKey][team];\nif (null != pbp_team) {\n   return pbp_team.NCAA_name;\n} else {\n   return team;\n}",
                 "params": {
                    "kp_to_pbp": nameLookup,
                 }
              }
           },
           "total_poss": {
              "script": {
                 "lang": "painless",
                 "source": "// Use doc and params, return the field value\ndef total_poss = 0;\nfor (p in doc[\"games.pace\"]) {\n   total_poss += p;\n}\nreturn total_poss;",
                 "params": {}
              }
           }
        }
     }
} 

export const formatEfficiencyLookupResponse = function(response: any) {
    return _.chain(response?.hits?.hits || []).map(team => {
        const teamSource = team._source || {};
        const teamFields = team.fields || {};
        const conf = teamSource?.conf || "";
        return [teamFields?.ncaa_name?.[0] || "unknown", {
            "team_season.year": teamSource?.team_season?.year || "",
            "conf": conf,
            "stats.adj_off.rank": teamSource?.stats?.adj_off?.rank || 0,
            "stats.adj_off.value": teamSource?.stats?.adj_off?.value || 0,
            "stats.adj_def.rank": teamSource?.stats?.adj_def?.rank || 0,
            "stats.adj_def.value": teamSource?.stats?.adj_def?.value || 0,
            "stats.adj_margin.rank": teamSource?.stats?.adj_margin?.rank || 0,
            "stats.adj_margin.value": teamSource?.stats?.adj_margin?.value || 0,
            "stats.adj_tempo.rank": teamSource?.stats?.adj_tempo?.rank || 0,
            "stats.adj_tempo.value": teamSource?.stats?.adj_tempo?.value || 0,
            "stats.off._3p_pct.value": teamSource?.stats?.off?._3p_pct?.value || 0,
            "total_poss": teamFields?.total_poss?.[0] || 0,
            "ncaa_seed": teamSource?.ncaa_seed || undefined,
            "is_high_major": HighMajorConfs.has(conf) ? 1 : 0 
        }];
    }).fromPairs().value();
}