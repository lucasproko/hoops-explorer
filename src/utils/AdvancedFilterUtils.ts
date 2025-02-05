import _ from "lodash";
import Enumerable from "linq";

/** Library accepts strings. but typescript extension doesn't */
type TypeScriptWorkaround1 = (element: any, index: number) => boolean;
type TypeScriptWorkaround2 = (element: any) => unknown;
type EnumToEnum = (
  e: Enumerable.IEnumerable<any>
) => Enumerable.IEnumerable<any>;

/** Utils to build LINQ filter/sort capabilities */
export class AdvancedFilterUtils {
  static readonly operators = [
    "&&",
    "||",
    "SORT_BY",
    "ASC",
    "DESC",
    "AND",
    "OR",
    "ALL",
  ];

  static readonly operatorsSet = new Set<string>(AdvancedFilterUtils.operators);

  static readonly teamExplorerAutocomplete =
    AdvancedFilterUtils.operators.concat([
      // Basic metadata:
      "team_name",
      "conf",
      "conf_nick",
      "year",
      "wins",
      "losses",

      // Advanced metadata:
      "wab",
      "wae",
      "exp_wab",
      "power",

      // Efficiency:
      "off_adj_ppp",
      "def_adj_ppp",
      "off_ppp",
      "def_ppp",

      // Four factors
      "off_efg",
      "off_to",
      "off_ftr",
      "off_orb",
      "def_efg",
      "def_to",
      "def_ftr",
      "def_orb",

      // Shot creation
      "off_assist",
      "off_ast_rim",
      "off_ast_mid",
      "off_ast_threep",
      "off_twoprimr",
      "off_twopmidr",
      "off_threepr",
      "def_assist",
      "def_ast_rim",
      "def_ast_mid",
      "def_ast_threep",
      "def_twoprimr",
      "def_twopmidr",
      "def_threepr",

      // Shot-making
      "off_threep",
      "off_twop",
      "off_twopmid",
      "off_twoprim",
      "off_ft",
      "off_threep_ast",
      "off_twop_ast",
      "off_twopmid_ast",
      "off_twoprim_ast",
      "def_threep",
      "def_twop",
      "def_twopmid",
      "def_twoprim",
      "def_ft",
      "def_threep_ast",
      "def_twop_ast",
      "def_twopmid_ast",
      "def_twoprim_ast",

      // Scramble:
      "off_scramble_twop",
      "off_scramble_twop_ast",
      "off_scramble_threep",
      "off_scramble_threep_ast",
      "off_scramble_twoprim",
      "off_scramble_twoprim_ast",
      "off_scramble_twopmid",
      "off_scramble_twopmid_ast",
      "off_scramble_ft",
      "off_scramble_ftr",
      "off_scramble_twoprimr",
      "off_scramble_twopmidr",
      "off_scramble_threepr",
      "off_scramble_assist",
      "def_scramble_twop",
      "def_scramble_twop_ast",
      "def_scramble_threep",
      "def_scramble_threep_ast",
      "def_scramble_twoprim",
      "def_scramble_twoprim_ast",
      "def_scramble_twopmid",
      "def_scramble_twopmid_ast",
      "def_scramble_ft",
      "def_scramble_ftr",
      "def_scramble_twoprimr",
      "def_scramble_twopmidr",
      "def_scramble_threepr",
      "def_scramble_assist",

      // Transition:
      "off_trans_twop",
      "off_trans_twop_ast",
      "off_trans_threep",
      "off_trans_threep_ast",
      "off_trans_twoprim",
      "off_trans_twoprim_ast",
      "off_trans_twopmid",
      "off_trans_twopmid_ast",
      "off_trans_ft",
      "off_trans_ftr",
      "off_trans_twoprimr",
      "off_trans_twopmidr",
      "off_trans_threepr",
      "off_trans_assist",
      "def_trans_twop",
      "def_trans_twop_ast",
      "def_trans_threep",
      "def_trans_threep_ast",
      "def_trans_twoprim",
      "def_trans_twoprim_ast",
      "def_trans_twopmid",
      "def_trans_twopmid_ast",
      "def_trans_ft",
      "def_trans_ftr",
      "def_trans_twoprimr",
      "def_trans_twopmidr",
      "def_trans_threepr",
      "def_trans_assist",

      //TODO: play styles
      //TODO: others
    ]);

  static readonly playerLeaderBoardAutocomplete =
    AdvancedFilterUtils.operators.concat([
      // Basic metadata:
      "conf",
      "team",
      "year",
      "player_name",
      "player_code",

      // Advanced metadata:
      "posClass",
      "posConfidences",
      "posFreqs",
      "roster.number",
      "roster.height",
      "roster.year_class",
      "roster.pos",
      "roster.origin",
      "tier",
      "transfer_src",
      "transfer_dest",

      // Opposition strength
      "off_adj_opp",
      "def_adj_opp",

      // Possessions
      "off_poss",
      "off_team_poss_pct",
      "def_poss",
      "def_team_poss_pct",

      // Four factors
      "off_efg",
      "off_to",
      "off_ftr",

      // Overall:
      "adj_rtg_margin",
      "adj_prod_margin",
      "adj_rapm_margin",
      "adj_rapm_prod_margin",
      "adj_rtg_margin_rank",
      "adj_prod_margin_rank",
      "adj_rapm_margin_rank",
      "adj_rapm_prod_margin_rank",

      "off_rtg",
      "off_adj_rtg",
      "off_adj_prod",
      "off_adj_rapm",
      "off_adj_rapm_prod",
      "off_adj_rtg_rank",
      "off_adj_prod_rank",
      "off_adj_rapm_rank",
      "off_adj_rapm_prod_rank",

      "def_rtg",
      "def_adj_rtg",
      "def_adj_prod",
      "def_adj_rapm",
      "def_adj_prod_rapm",
      "def_adj_rtg_rank",
      "def_adj_prod_rank",
      "def_adj_rapm_rank",
      "def_adj_rapm_prod_rank",

      // Shot creation
      "off_usage",
      "off_assist",
      "off_ast_rim",
      "off_ast_mid",
      "off_ast_threep",
      "off_twoprimr",
      "off_twopmidr",
      "off_threepr",

      // Shot-making
      "off_threep",
      "off_twop",
      "off_twopmid",
      "off_twoprim",
      "off_ft",
      "off_threep_ast",
      "off_twop_ast",
      "off_twopmid_ast",
      "off_twoprim_ast",

      // Scramble:
      "off_scramble_twop",
      "off_scramble_twop_ast",
      "off_scramble_threep",
      "off_scramble_threep_ast",
      "off_scramble_twoprim",
      "off_scramble_twoprim_ast",
      "off_scramble_twopmid",
      "off_scramble_twopmid_ast",
      "off_scramble_ft",
      "off_scramble_ftr",
      "off_scramble_twoprimr",
      "off_scramble_twopmidr",
      "off_scramble_threepr",
      "off_scramble_assist",

      // Transition:
      "off_trans_twop",
      "off_trans_twop_ast",
      "off_trans_threep",
      "off_trans_threep_ast",
      "off_trans_twoprim",
      "off_trans_twoprim_ast",
      "off_trans_twopmid",
      "off_trans_twopmid_ast",
      "off_trans_ft",
      "off_trans_ftr",
      "off_trans_twoprimr",
      "off_trans_twopmidr",
      "off_trans_threepr",
      "off_trans_assist",

      // Other:
      "off_orb",
      "def_orb",
      "off_reb",
      "def_reb", //(last 2: nicer version of rebounding stats)

      // These need to be created by substitution:
      "def_stl",
      "def_blk", // (these don't exist: def_stl is def_2prim, def_blk is def_to)
      "def_fc", //(doesn't exist: def_ftr)

      // Transfers only, predicted:
      "off_adj_rapm_pred",
      "def_adj_rapm_pred",
      "off_rtg_pred",
      "off_usage_pred",
      "adj_rapm_margin_pred",

      // Regional views:
      "hs_region_dmv",
    ]);

  static readonly playerLboardWithTeamStatsAutcomplete =
    AdvancedFilterUtils.playerLeaderBoardAutocomplete.concat(
      AdvancedFilterUtils.teamExplorerAutocomplete
        .filter(
          (field) => _.startsWith(field, "off_") || _.startsWith(field, "def_")
        )
        .map((field) => `team_stats.${field}`)
    );

  static playerSeasonComparisonAutocomplete = _.flatMap(
    ["prev_", "next_"],
    (prefix) => {
      return _.flatMap(
        AdvancedFilterUtils.playerLeaderBoardAutocomplete,
        (field) => {
          if (_.endsWith(field, "_pred")) {
            return []; //(prediction strings are different with the player season comparison)
          } else if (AdvancedFilterUtils.operatorsSet.has(field)) {
            return prefix == "prev_" ? [field] : []; //(return operators just once)
          } else if (_.startsWith(field, "player_")) {
            //(TODO: incorporate transfer info and do next/prev and orig)
            return prefix == "prev_" ? [field] : []; //(return player_name|code just once)
          } else if (_.startsWith(field, "transfer_")) {
            return prefix == "prev_" ? [field] : [`next_${field}`]; //(return transfer_X and next_transfer_X)
          } else {
            return [`${prefix}${field}`];
          }
        }
      ).concat(
        _.flatMap(["pred_ok_", "pred_good_", "pred_bad_"], (prefix) => {
          //(a small subset of fields have good/bad/ok predictions for the following year)
          return [
            "off_rtg",
            "off_usage",
            "off_adj_rapm",
            "def_adj_rapm",
            "off_team_poss_pct",
            "adj_rapm_margin",
          ].map((field) => `${prefix}${field}`);
        })
      );
    }
  );

  static fixBoolOps(s: String) {
    return s.replace(/ AND /g, " && ").replace(/ OR /g, " || ");
  }
  static fieldReplacements(s: string) {
    return s
      .replace(/twop/g, "2p")
      .replace(/threep/g, "3p")
      .replace(/def_blk/g, "def_2prim")
      .replace(/def_stl/g, "def_to")
      .replace(/def_fc/g, "def_ftr")
      .replace(/(off|def)_poss/g, "$1_team_poss");
  }
  static singleYearfixObjectFormat(s: string) {
    return s
      .replace(/ALL/g, "($.player_code)")
      .replace(/((team_stats[.])?(?:off|def)_[0-9a-zA-Z_]+)/g, "$.p.$1?.value")
      .replace(/(^| |[(!*+/-])(adj_[0-9a-zA-Z_]+)/g, "$1$.$2")
      .replace(/roster[.]height/g, "$.normht")
      .replace(/transfer_(src|dest)/g, "$.transfer_$1")
      .replace(/player_(name|code)/g, "$.player_$1")
      .replace(
        /(^| |[(!*+/-])(roster[.][a-z]+|pos[CF][a-z]+|tier|team|conf|year)/g,
        "$1$.p.$2"
      )
      .replace(/[$][.]p[.]def_ftr[?][.]value/g, "(100*$.p.def_ftr?.value)") //(fouls called/50)
      .replace(/roster[.]/g, "roster?.") //(roster not always present)
      .replace(/(off|def)_reb/g, "$1_orb"); //(nicer version of rebound name)
  }
  static multiYearfixObjectFormat(s: string) {
    return s
      .replace(
        /(prev|next|pred_[a-z]+)_((?:off|def)_[0-9a-zA-Z_]+)/g,
        "$.$1?.p.$2?.value"
      )
      .replace(
        /(^| |[(!*+/-])(prev|next|pred_(?:[a-z]+))_(adj_[0-9a-zA-Z_]+)/g,
        "$1$.$2?.$3"
      )
      .replace(/(prev|next|pred_[a-z]+)_roster[.]height/g, "$.$1?.normht")
      .replace(/(^|[^_])transfer_(src|dest)/g, "$1$.transfer_$2")
      .replace(/(prev|next)_transfer_(src|dest)/g, "$.$1?.transfer_$2")
      .replace(/player_(name|code)/g, "$.player_$1")
      .replace(
        /(^| |[(!*+/-])(prev|next|pred_[a-z]+)_(roster[.][a-z]+|pos[CF][a-z]+|tier|team|conf|year)/g,
        "$1$.$2?.p.$3"
      )
      .replace(
        /[$][.](prev|next|pred_[a-z]+)[.]def_ftr[?][.]value/g,
        "(100*$.$1?.p.def_ftr?.value)"
      ) //(fouls called/50)
      .replace(/roster[.]/g, "roster?.") //(roster not always present)
      .replace(/ALL/g, "($.player_code)");
  }
  static teamFixObjectFormat(s: string) {
    return s
      .replace(
        /(team_name|conf_nick|conf|year|wins|losses|wab|wae|exp_wab|power)/g,
        "$.p.$1"
      )
      .replace(/((?:off|def)_[0-9a-zA-Z_]+)/g, "$.p.$1?.value")
      .replace(/(^| |[(!*+/-])(adj_[0-9a-zA-Z_]+)/g, "$1$.$2")
      .replace(/(off|def)_reb/g, "$1_orb"); //(nicer version of rebound name)
  }
  static avoidAssigmentOperator(s: string) {
    return s.replace(/([^!<>])=[=]*/g, "$1==");
  }
  static convertPositions(s: string) {
    return s
      .replace(/\[(?:_PG_|_1_)\]/g, "[0]")
      .replace(/\[(?:_SG_|_2_)\]/g, "[1]")
      .replace(/\[(?:_SF_|_3_)\]/g, "[2]")
      .replace(/\[(?:_PF_|_4_)\]/g, "[3]")
      .replace(/\[(?:_C_|_5_)\]/g, "[4]");
  }
  static convertPercentages(s: string) {
    return s.replace(/([0-9.]+)[%]/g, "(($1)*0.01)");
  }
  static normHeightInQuotes(s: string) {
    return s.replace(/['"]([567])[-']([0-9])['"]/g, "'$1-0$2'");
  }
  static normHeightString(s: string) {
    return s.replace(/^([567])-([0-9])$/g, "$1-0$2");
  }
  static removeAscDesc(s: string) {
    return s.replace(/(ASC|DESC)/g, "");
  }
  static convertRegionalBounds(s: string) {
    return s.replace(
      "hs_region_dmv",
      "(roster.lat >= 38.3201 && roster.lat <= 39.6395 && roster.lon >= -78.5330 && roster.lon <= -75.4816)"
    );
  }

  /** The Linq to data model pipeline for player expressions */
  static readonly tidyPlayerClauses: (s: string, multiYear: boolean) => string =
    (s: string, multiYear: boolean) =>
      _.flow([
        AdvancedFilterUtils.convertRegionalBounds,
        AdvancedFilterUtils.fixBoolOps,
        AdvancedFilterUtils.avoidAssigmentOperator,
        AdvancedFilterUtils.fieldReplacements,
        multiYear
          ? AdvancedFilterUtils.multiYearfixObjectFormat
          : AdvancedFilterUtils.singleYearfixObjectFormat,
        AdvancedFilterUtils.convertPositions,
        AdvancedFilterUtils.convertPercentages,
        AdvancedFilterUtils.normHeightInQuotes,
        AdvancedFilterUtils.removeAscDesc,
        _.trim,
      ])(s, multiYear);

  /** The Linq to data model pipeline for team explorer expressions */
  static readonly tidyTeamExplorerClauses: (
    s: string,
    multiYear: boolean
  ) => string = (s: string, multiYear: boolean) =>
    _.flow([
      AdvancedFilterUtils.fixBoolOps,
      AdvancedFilterUtils.avoidAssigmentOperator,
      AdvancedFilterUtils.fieldReplacements,
      AdvancedFilterUtils.teamFixObjectFormat,
      AdvancedFilterUtils.convertPercentages,
      AdvancedFilterUtils.removeAscDesc,
      _.trim,
    ])(s, multiYear);

  /** Builds a where/orderBy chain by interpreting the string either side of SORT_BY */
  static applyTeamExplorerFilter(
    inData: any[],
    filterStr: string,
    extraParams: Record<string, string> = {},
    multiYear: boolean = false
  ): [any[], string | undefined] {
    return AdvancedFilterUtils.applyFilter(
      inData,
      filterStr,
      extraParams,
      multiYear,
      AdvancedFilterUtils.tidyTeamExplorerClauses,
      (p: any, index: number) => ({
        p,
      })
    );
  }

  /** Builds a where/orderBy chain by interpreting the string either side of SORT_BY */
  static applyPlayerFilter(
    inData: any[],
    filterStr: string,
    extraParams: Record<string, string> = {},
    multiYear: boolean = false
  ): [any[], string | undefined] {
    const buildSingleYearRetVal = (p: any, index: number) => {
      const retVal = {
        p: p,
        player_name: p.key,
        player_code: p.code,
        transfer_src: p.transfer_src || "",
        transfer_dest: p.transfer_dest || "",
        // Normalize so can do height comparisons
        normht: AdvancedFilterUtils.normHeightString(p.roster?.height || ""),
        // These need to be derived
        adj_rapm_margin:
          (p.off_adj_rapm?.value || 0) - (p.def_adj_rapm?.value || 0),
        adj_rtg_margin:
          (p.off_adj_rtg?.value || 0) - (p.def_adj_rtg?.value || 0),
        adj_rapm_prod_margin:
          (p.off_adj_rapm?.value || 0) * (p.off_team_poss_pct?.value || 0) -
          (p.def_adj_rapm?.value || 0) * (p.def_team_poss_pct?.value || 0),
        adj_prod_margin:
          (p.off_adj_rtg?.value || 0) * (p.off_team_poss_pct?.value || 0) -
          (p.def_adj_rtg?.value || 0) * (p.def_team_poss_pct?.value || 0),
        // Already have these but makes the query formatting simpler
        adj_rapm_margin_rank: p.adj_rapm_margin_rank,
        adj_rtg_margin_rank: p.adj_rtg_margin_rank,
        adj_rapm_prod_margin_rank: p.adj_rapm_prod_margin_rank,
        adj_prod_margin_rank: p.adj_prod_margin_rank,
        adj_rapm_margin_pred:
          (p.off_adj_rapm_pred?.value || 0) - (p.def_adj_rapm_pred?.value || 0),
      };
      //DIAG:
      //if (index < 10) console.log(`OBJ ${JSON.stringify({ ...retVal, p: undefined })}`);
      return retVal;
    };
    const buildMultiYearRetVal = (p: any, index: number) => {
      const retVal = {
        p: p,
        player_name: p.orig?.key || p.actualResults?.key,
        player_code: p.orig?.code || p.actualResults?.code,
        transfer_src:
          p.orig?.team != p.actualResults?.team ? p.orig?.team : undefined,
        transfer_dest:
          p.orig && p.orig.team != p.actualResults?.team
            ? p.actualResults?.team
            : undefined,
        pred_ok: p.ok ? buildSingleYearRetVal(p.ok, index) : undefined,
        pred_good: p.good ? buildSingleYearRetVal(p.good, index) : undefined,
        pred_bad: p.bad ? buildSingleYearRetVal(p.bad, index) : undefined,
        prev: p.orig ? buildSingleYearRetVal(p.orig, index) : undefined,
        next: p.actualResults
          ? buildSingleYearRetVal(p.actualResults, index)
          : undefined,
      };
      //DIAG:
      //if (index < 10) console.log(`OBJ ${JSON.stringify({ ...retVal, p: undefined })}`);
      return retVal;
    };

    const buildRetVal = (p: any, index: number) => {
      return multiYear
        ? buildMultiYearRetVal(p, index)
        : buildSingleYearRetVal(p, index);
    };

    return AdvancedFilterUtils.applyFilter(
      inData,
      filterStr,
      extraParams,
      multiYear,
      AdvancedFilterUtils.tidyPlayerClauses,
      buildRetVal
    );
  }

  /** Builds a where/orderBy chain by interpreting the string either side of SORT_BY */
  static applyFilter(
    inData: any[],
    filterStr: string,
    extraParams: Record<string, string> = {},
    multiYear: boolean = false,
    tidyClauses: (s: string, multiYear: boolean) => string,
    buildRetVal: (p: any, index: number) => any
  ): [any[], string | undefined] {
    const filterFrags = filterStr.split("SORT_BY");
    const where = tidyClauses(filterFrags[0], multiYear);

    const wherePlusMaybeInsert = _.isEmpty(extraParams)
      ? where
      : (where ? `( ${where} ) && ` : "") + //(inject extra params into "p")
        _.chain(extraParams)
          .toPairs()
          .flatMap((kv) => {
            return kv[1]
              ? [`($.p.${kv[0]} = ( ${tidyClauses(kv[1], multiYear)} ))`]
              : [`(true)`];
          })
          .join(" && ")
          .value();

    const sortingFrags = _.drop(filterFrags, 1);

    //DIAG:
    //console.log(`?Q = ${wherePlusMaybeInsert} SORT_BY: ${sortingFrags.map(s => AdvancedFilterUtils.tidyClauses(s, multiYear))}`);

    const sortByFns: Array<EnumToEnum> = sortingFrags.map(
      (sortingFrag, index) => {
        const isAsc = sortingFrag.indexOf("ASC") >= 0;
        const sortBy = tidyClauses(sortingFrag, multiYear);

        if (index == 0) {
          return (enumerable: Enumerable.IEnumerable<any>) => {
            return isAsc
              ? enumerable.orderBy(sortBy as unknown as TypeScriptWorkaround2)
              : enumerable.orderByDescending(
                  sortBy as unknown as TypeScriptWorkaround2
                );
          };
        } else {
          return (enumerable: Enumerable.IEnumerable<any>) => {
            return isAsc
              ? (enumerable as Enumerable.IOrderedEnumerable<any>).thenBy(
                  sortBy as unknown as TypeScriptWorkaround2
                )
              : (
                  enumerable as Enumerable.IOrderedEnumerable<any>
                ).thenByDescending(sortBy as unknown as TypeScriptWorkaround2);
          };
        }
      }
    );

    try {
      const enumData = Enumerable.from(
        inData.map((p, index) => {
          return buildRetVal(p, index);
        })
      );
      const filteredData =
        wherePlusMaybeInsert.length > 0
          ? enumData.where(
              wherePlusMaybeInsert as unknown as TypeScriptWorkaround1
            )
          : enumData;
      const sortedData =
        sortByFns.length > 0
          ? _.flow(sortByFns)(filteredData)
              .thenBy((p: any) => {
                // (this is all player specific, but it "fails" harmlessly for teams)
                const sortPoss = multiYear
                  ? p.p?.actualResults?.off_team_poss?.value || 0
                  : p.p?.baseline?.off_team_poss?.value || 0;
                return sortPoss;
              })
              .thenBy((p: any) => p.p?.key) //(ensure player duplicates follow each other)
          : filteredData;
      return [sortedData.toArray().map((p: any) => p.p), undefined];
    } catch (err: unknown) {
      if (_.isEmpty(extraParams)) {
        return [
          inData,
          `${
            err instanceof Error ? err.message : err
          } in ${wherePlusMaybeInsert}`,
        ];
      } else {
        //for error parsing purposes, try without the extra params
        const [filteredSortedData, errorMessage] =
          AdvancedFilterUtils.applyFilter(
            inData,
            filterStr,
            {},
            multiYear,
            tidyClauses,
            buildRetVal
          );
        return [
          filteredSortedData,
          errorMessage ||
            `${
              err instanceof Error ? err.message : err
            } in ${wherePlusMaybeInsert}`,
        ];
      }
    }
  }
}
