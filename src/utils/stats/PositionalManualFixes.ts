
/** Team/season -> player -> positional override */
const absolutePositionFixes: Record<string, Record<string, string>> = {
  //TODO: currently not in use
}

type Rule = {
  /** Every non-null code must match the position */
  key: Array<string | undefined>,
  /** How the positions are shuffled */
  rule: Array<{code: string, id: string} | undefined>
}

/** Team/season -> lineups -> positional overrides */
const relativePositionFixes: Record<string, Rule[]> = {

  "Maryland_2019/20": [
    {
      // 7/6/2020: In 4-guard lineups, Morsell plays the 4
      key: [ undefined, undefined, "DaMorsell", "AaWiggins", undefined ],
      rule: [ undefined, undefined,
        { code: "DaMorsell", id: "Morsell, Darryl" },
        { code: "AaWiggins", id: "Wiggins, Aaron" },
        undefined
      ]
    }
  ]
}
