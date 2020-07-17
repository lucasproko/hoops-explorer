
export type AbsolutePositionFixRule = {
  position: string
};

/** Team/season -> player -> positional override */
export const absolutePositionFixes: Record<string, Record<string, AbsolutePositionFixRule>> = {
  "Men_Boston College_2019/20": {
    "Popovic, Nik": {
      position: "PF/C"
    }
  }
};

export type RelativePositionFixRule = {
  /** Every non-null code must match the position */
  key: Array<string | undefined>,
  /** How the positions are shuffled */
  rule: Array<{code: string, id: string} | undefined>
};

/** 7/6/2020: In 4-guard lineups, Morsell plays the 4 (18/19 and 19/20 seasons) */
const Maryland_2018_2020 = [
  {
    // 7/6/2020: In 4-guard lineups, Morsell plays the 4
    key: [ undefined, undefined, "DaMorsell", "AaWiggins", undefined ],
    rule: [ undefined, undefined,
      { code: "AaWiggins", id: "Wiggins, Aaron" },
      { code: "DaMorsell", id: "Morsell, Darryl" },
      undefined
    ]
  },
  {
    // 7/6/2020: In 4-guard lineups, Morsell plays the 4
    key: [ undefined, "DaMorsell", "SeSmith", "AaWiggins", undefined ],
    rule: [ undefined,
      { code: "SeSmith", id: "Smith, Serrel" },
      { code: "AaWiggins", id: "Wiggins, Aaron" },
      { code: "DaMorsell", id: "Morsell, Darryl" },
      undefined
    ]
  }
];

/** Team/season -> lineups -> positional overrides */
export const relativePositionFixes: Record<string, RelativePositionFixRule[]> = {
  // 13/7/2020: Pack plays the point with Nickens at the SG
  "Men_Maryland_2014/5": [{
    key: [ "JaNickens", "RiPack", undefined, undefined, undefined ],
    rule: [
      { code: "RiPack", id: "Pack, Richaud" },
      { code: "JaNickens", id: "Nickens, Jared" },
      undefined, undefined, undefined
    ]
  }],
  "Men_Maryland_2018/9": Maryland_2018_2020,
  "Men_Maryland_2019/20": Maryland_2018_2020.concat([
  // 7/10/2020: Lindo plays the 4 alongside Jalen Smith
  {
    key: [ undefined, undefined, undefined, "JaSmith", "RiLindo" ],
    rule: [ undefined, undefined, undefined,
      { code: "RiLindo", id: "Lindo Jr., Ricky" },
      { code: "JaSmith", id: "Smith, Jalen" }
    ]
  }])
};
