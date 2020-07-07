
/** Team/season -> player -> positional override */
export const absolutePositionFixes: Record<string, Record<string, string>> = {
  //TODO: currently not in use
};

export type RelativePositionFixRule = {
  /** Every non-null code must match the position */
  key: Array<string | undefined>,
  /** How the positions are shuffled */
  rule: Array<{code: string, id: string} | undefined>
};

/** Team/season -> lineups -> positional overrides */
export const relativePositionFixes: Record<string, RelativePositionFixRule[]> = {

  "Men_Maryland_2018/9": [
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
  ],
  "Men_Maryland_2019/20": [
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
  ]
};
