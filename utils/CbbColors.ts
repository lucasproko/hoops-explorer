import { Color } from "chroma-js";
import chroma from "chroma-js";

type CbbColorTuple = [ (val: number) => string, (val: number) => string ];

export class CbbColors {

  private static readonly redToGreen = chroma.scale(["red", "#ffFFff", "green"]);
  private static readonly greenToRed = chroma.scale(["green", "#ffFFff", "red"]);
  private static readonly blueToOrange = chroma.scale(["lightblue", "#ffFFff", "orange"]);

  // Pts/100
  private static readonly pp100Domain = [80, 100, 120 ];
  public static readonly off_pp100 = (val: number) => CbbColors.redToGreen.domain(CbbColors.pp100Domain)(val).toString();
  public static readonly def_pp100 = (val: number) => CbbColors.greenToRed.domain(CbbColors.pp100Domain)(val).toString();
  public static readonly pp100: CbbColorTuple = [ CbbColors.off_pp100, CbbColors.def_pp100 ];
  // eFG
  private static readonly eFGDomain = [0.4, 0.5, 0.6 ];
  public static readonly off_eFG = (val: number) => CbbColors.redToGreen.domain(CbbColors.eFGDomain)(val).toString();
  public static readonly def_eFG = (val: number) => CbbColors.greenToRed.domain(CbbColors.eFGDomain)(val).toString();
  public static readonly eFG: CbbColorTuple = [ CbbColors.off_eFG, CbbColors.def_eFG ];
  // TO
  private static readonly toDomain = [0.1, 0.16, 0.22 ];
  public static readonly off_TO = (val: number) => CbbColors.greenToRed.domain(CbbColors.toDomain)(val).toString();
  public static readonly def_TO = (val: number) => CbbColors.redToGreen.domain(CbbColors.toDomain)(val).toString();
  public static readonly tOver: CbbColorTuple = [ CbbColors.off_TO, CbbColors.def_TO ];
  // OR
  private static readonly orDomain = [ 0.18, 0.27, 0.36 ];
  public static readonly off_OR = (val: number) => CbbColors.redToGreen.domain(CbbColors.orDomain)(val).toString();
  public static readonly def_OR = (val: number) => CbbColors.greenToRed.domain(CbbColors.orDomain)(val).toString();
  public static readonly oReb: CbbColorTuple = [ CbbColors.off_OR, CbbColors.def_OR ];
  // OR
  // ftr
  private static readonly ftrDomain = [ 0.20, 0.30, 0.40 ];
  public static readonly off_FTR = (val: number) => CbbColors.redToGreen.domain(CbbColors.ftrDomain)(val).toString();
  public static readonly def_FTR = (val: number) => CbbColors.greenToRed.domain(CbbColors.ftrDomain)(val).toString();
  public static readonly ftr: CbbColorTuple = [ CbbColors.off_FTR, CbbColors.def_FTR ];
  // 3P%
  private static readonly fg3PDomain = [ 0.26, 0.33, 0.40 ];
  public static readonly off_3P = (val: number) => CbbColors.redToGreen.domain(CbbColors.fg3PDomain)(val).toString();
  public static readonly def_3P = (val: number) => CbbColors.greenToRed.domain(CbbColors.fg3PDomain)(val).toString();
  public static readonly fg3P: CbbColorTuple = [ CbbColors.off_3P, CbbColors.def_3P ];
  // 2P%
  private static readonly fg2PDomain = [0.4, 0.5, 0.6 ];
  public static readonly off_2P = (val: number) => CbbColors.redToGreen.domain(CbbColors.fg2PDomain)(val).toString();
  public static readonly def_2P = (val: number) => CbbColors.greenToRed.domain(CbbColors.fg2PDomain)(val).toString();
  public static readonly fg2P: CbbColorTuple = [ CbbColors.off_2P, CbbColors.def_2P ];
  // 2P% mid
  private static readonly fg2PMidDomain = [0.3, 0.4, 0.5 ];
  public static readonly off_2P_mid = (val: number) => CbbColors.redToGreen.domain(CbbColors.fg2PMidDomain)(val).toString();
  public static readonly def_2P_mid = (val: number) => CbbColors.greenToRed.domain(CbbColors.fg2PMidDomain)(val).toString();
  public static readonly fg2P_mid: CbbColorTuple = [ CbbColors.off_2P_mid, CbbColors.def_2P_mid ];
  // 2P% rim
  private static readonly fg2PRimDomain = [ 0.5, 0.6, 0.7 ];
  public static readonly off_2P_rim = (val: number) => CbbColors.redToGreen.domain(CbbColors.fg2PRimDomain)(val).toString();
  public static readonly def_2P_rim = (val: number) => CbbColors.greenToRed.domain(CbbColors.fg2PRimDomain)(val).toString();
  public static readonly fg2P_rim: CbbColorTuple = [ CbbColors.off_2P_rim, CbbColors.def_2P_rim ];
  // Any FG rate
  private static readonly fgrDomain = [ 0.15, 0.33, 0.5 ];
  public static readonly fgr_offDef = (val: number) => CbbColors.blueToOrange.domain(CbbColors.fgrDomain)(val).toString();
  public static readonly fgr: CbbColorTuple = [ CbbColors.fgr_offDef, CbbColors.fgr_offDef ];
}
