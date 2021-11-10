
export type AbsolutePositionFixRule = {
  position: string
};

/** Team/season -> player -> positional override */
export const absolutePositionFixes: Record<string, Record<string, AbsolutePositionFixRule>> = {
  "Men_Baylor_2018/9": {
    "Vital, Mark": {
      position: "S-PF"
    }
  },
  "Men_Baylor_2019/20": {
    "Vital, Mark": {
      position: "S-PF"
    }
  },
  "Men_Baylor_2020/21": {
    "Vital, Mark": {
      position: "S-PF"
    }
  },
  "Men_Boston College_2019/20": {
    "Popovic, Nik": {
      position: "PF/C"
    }
  },
  "Men_Cincinnati_2020/21": {
    "DeJulius, David": {
      position: "s-PG"
    }
  },
  "Men_Iowa_2020/21": {
    "Garza, Luka": {
      position: "PF/C"
    }
  },
  "Men_Oregon St._2020/21": {
    "Alatishe, Warith": {
      position: "PF/C"
    }
  },
  "Men_Purdue_2020/21": {
    "Wheeler, Aaron": {
      position: "S-PF"
    }
  },
  "Men_Purdue_2021/22": {
    "Ivey, Jaden": {
      position: "s-PG"
    }
  },
  "Men_Maryland_2020/21": {
    "Smart, Aquan": {
      position: "s-PG"
    },
    "Mona, Reese": {
      position: "CG"
    },
    "Graham III, James": {
      position: "WF"
    },
  },
  "Men_Michigan St._2020/21": {
    "Hauser, Joey": {
      position: "S-PF"
    }
  },
  "Men_St. Bonaventure_2020/21": {
    "Adaway, Jalen": {
      position: "S-PF"
    }
  },
  "Men_Seton Hall_2020/21": {
    "Mamukelashvili, Sandro": {
      position: "PF/C"
    }
  },
  "Men_Syracuse_2018/9": {
    "Dolezaj, Marek": {
      position: "WF"
    }
  },
  "Men_Syracuse_2020/21": {
    "Dolezaj, Marek": {
      position: "PF/C"
    }
  },
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
    // 2/2022: In 4-guard lineups, Morsell plays the 4 (even when he's supposedly playing the 2!)
    key: [ undefined, "DaMorsell", "HaHart", "AaWiggins", undefined ],
    rule: [ undefined,
      { code: "HaHart", id: "Hart, Hakim" },
      { code: "AaWiggins", id: "Wiggins, Aaron" },
      { code: "DaMorsell", id: "Morsell, Darryl" },
      undefined
    ]
  },
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
  }]),
  // 22/12/2020: Hamilton plays the 5 alongside Scott (+ 4/3); Morsell plays 4 alongside Wiggins
  "Men_Maryland_2020/21": Maryland_2018_2020.concat([{
    key: [ undefined, undefined, undefined, "JsHamilton", "DoScott" ],
    rule: [ undefined, undefined, undefined,
      { code: "DoScott", id: "Scott, Donta" },
      { code: "JsHamilton", id: "Hamilton, Jairus" }
    ]
  }, {
    key: [ undefined, undefined, "JsHamilton", "DoScott", undefined ],
    rule: [ undefined, undefined,
      { code: "DoScott", id: "Scott, Donta" },
      { code: "JsHamilton", id: "Hamilton, Jairus" },
      undefined
    ]
  }])
};
