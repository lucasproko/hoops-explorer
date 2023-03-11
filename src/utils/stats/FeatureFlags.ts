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

   /** Some long term work on showing guesses as to the play types players and teams use */
   static readonly betterStyleAnalysis = false;

   /** For team editor - short term work on allowing make-believe NIL estimates */
   static readonly enableNilView = false;

   /** For player leaderboard - show transfer predictions */
   static readonly showTransferPredictions = false;
}