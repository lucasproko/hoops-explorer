
import _ from 'lodash';

/** DMVish players from 2017+ */
export const PlayerLeaderboardTracking = {
  "__DMV_2017__":  _.flatten([
    ["-YEAR2017,DjHarvey,DaMorsell,JoCarlton,AnRafus,DePerry,TeHightower,NaWatson,JaPickett:George,EjObinna,AaThompson,DaDickens,MyDouglas,AnWalker,ChLykes,LuGarza"],
    ["-YEAR2018,JeHarris,NoLocke,MoMathis,BrGolden,BrAdams,WyTabbs,LaHardnett,AmHarris,JaBynum,BrSlater,RaBolton,XaJohnson,PrHubb,MyDead,TrWood,RiLindo"],
    ["-YEAR2019,JuMoore,OlNkamhoua,JaBishop,YaGultekin,AbTsimbila,ChPaar,KaWilliams,LoCurtis,AnHarris,DeSeabron,QuWahab,MeLong,JaMcallister,XaJohnson,JoOduro,CaMorsell,JaHeath,MiMitches,MlMitchell,AyHikim"],
    ["-YEAR2020,EaTimberlake,HuDickinson,JuLewis,WoNewton,ChEvans,AdBaldwin,DiStevens,DaNguessan,ElWood,JeRoach,TeWilliams,ChHarris,MyStute,IsLeggett,TeIzay"],
  ]).join(",")
} as Record<string, string>;
