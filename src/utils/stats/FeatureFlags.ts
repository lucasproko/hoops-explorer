export class FeatureFlags {
   /** Where possible can be extra safe checking that we're developing on a laptop */
   static isActiveWindow(ff: boolean): boolean {
      if (!ff) {
         return false;
      } else {
         const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
            "server" : window.location.hostname
         return (server == "localhost");
      }
   }
   // Feature flags themselves:
   static readonly betterStyleAnalysis = false;
}