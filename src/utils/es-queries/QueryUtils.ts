
export class QueryUtils {

  static basicOrAdvancedQuery(query: string | undefined, fallback: string): string {
    const regexMatch = /^\s*\[(.*)\]\s*$/.exec(query || "");
    if (regexMatch) {
      return regexMatch[1]; //(just return the raw query, trust that it's well formed)
    } else {
      // (if there's a NOT outside the query, lift it into the query)
      const regexMatch2 = /^\s*NOT\s*\(\s*\[(.*)\]\s*\)\s*$/.exec(query || "");
      if (regexMatch2) {
        return `NOT (${regexMatch2[1]})`
      } else {
        return `players.id:(${query || fallback})`;
      }
    }
  }

}
