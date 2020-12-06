
import _ from 'lodash';

/** DMVish players from 2017+ */
export const PlayerLeaderboardTracking = {
  "__DMV_2017__":  _.flatten([
    ["-YEAR2017,DjHarvey,JoCarlton,AnRafus,DePerry,TeHightower,NaWatson,JaPickett:George,BrKnapper,EjObinna,AaThompson,DaDickens,MyDouglas,LeDjonkam,AnWalker,ChLykes,LuGarza"],
    ["-YEAR2018,JeHarris,NoLocke,MoMathis,BrGolden,BrAdams,WyTabbs,LaHardnett,AmHarris,JaBynum,DaMccormack,BrSlater,TrMcgowans,TyMartin,RaBolton,XaJohnson,MaMcclung,ChLorng,CoCrabtree,PrHubb,MyDead,TrWood,RiLindo"],
    ["-YEAR2019,JuMoore,OlNkamhoua,JaBishop,YaGultekin,AbTsimbila,ChPaar,KaWilliams,LoCurtis,RoBeran,AnHarris,DeSeabron,QuWahab,DaGaines,MeLong,JaMcallister,XaJohnson,JoOduro,CaMorsell,JaHeath,MiMitches,MlMitchell,AyHikim"],
    ["-YEAR2020,EaTimberlake,HuDickinson,JuLewis,WoNewton,ChEvans,AdBaldwin,DiStevens,DaNguessan,ElWood,JeRoach,CoWalker,JoBamisile,DaMaddox,ChJenkins,TeWilliams,ChHarris,MyStute,IsLeggett,TeIzay"],
  ]).join(",")
} as Record<string, string>;
