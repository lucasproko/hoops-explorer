/** 247 All American Freshmen get a bonus (since we use the 247 rankings to rank them in the first place this seems reasonable) */
export const allAmericanFreshmen: Record<string, Record<string, number>> = {
  "Men_2023/24": {
    //(https://247sports.com/college/maryland/longformarticle/247-freshman-all-american-isaiah-collier-usc-justin-edwards-kentucky-aden-holloway-auburn-dj-wagner-kentucky-jakobe-walkter-baylor-elliot-cadeau-north-carolina-duke-217937235)
    // First team:
    "IsCollier::Southern California": 1,
    "JuEdwards::Kentucky": 1,
    "AdHolloway::Auburn": 1,
    "DjWagner::Kentucky": 1,
    "JaWalter::Baylor": 1,
    // Second team:
    "JaMccain::Duke": 2,
    "ElCadeau::North Carolina": 2,
    "StCastle::UConn": 2,
    "DeHarris-smi::Maryland": 2,
    "BeBuyuktunce::UCLA": 2,
    // Third team:
    "CoWiliams::Colorado": 3,
    "JaShelstad::Oregon": 3,
    "GaDual::Providence": 3,
    "MaMgbako::Indiana": 3,
    "ElJackson::Kansas": 3,
    // Fourth team:
    "OmBiliew::Iowa St.": 4,
    "AaBradshaw::Kentucky": 4,
    "ScMiddleton::Ohio St.": 4,
    "CaFoster::Duke": 4,
    "DeThomas::UNLV": 4,
  },
};
/** Returns AA team or none if not on team / data not available */
export function getAllAmericanFrTeam(
  playerCode: string,
  team: string,
  genderYear: string
): number {
  const code = `${playerCode}::${team}`;
  return allAmericanFreshmen[genderYear]?.[code] || 0;
}
