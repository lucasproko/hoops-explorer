
import _ from 'lodash';

/** DMVish players from 2017+ */
export const PlayerLeaderboardTracking = {
  "__DMV_2017__":  _.flatten([
    ["-YEAR2016,GrGolden"],
    ["-YEAR2017,NaMarshall,DjHarvey,DaMorsell,JoCarlton,AnRafus,DePerry,TeHightower,NaWatson,JaPickett:George,EjObinna,AaThompson,DaDickens,MyDouglas,AnWalker,ChLykes,LuGarza"],
    ["-YEAR2018,JaSmith:Mary,ImQuickley,SaBey,JeHarris,NoLocke,MoMathis,BrGolden,BrAdams,WyTabbs,LaHardnett,AmHarris,JaBynum,BrSlater,RaBolton,XaJohnson:Pitt,PrHubb,MyDead,TrWood,RiLindo"],
    ["-YEAR2019,JuMoore,OlNkamhoua,JaBishop,YaGultekin,AbTsimbila,ChPaar,KaWilliams,LoCurtis,AnHarris,DeSeabron,QuWahab,MeLong,JaMcallister,XaJohnson:George,JoOduro,CaMorsell,JaHeath,MiMitchell,MlMitchell,AyHikim"],
    ["-YEAR2020,EaTimberlake,HuDickinson,JuLewis,WoNewton,ChEvans,AdBaldwin,DiStevens,DaNguessan,ElWood,JeRoach,TeWilliams,ChHarris,MyStute,IsLeggett,TeIzay"],
  ]).join(","),

  "__NYNJ_2017__":  _.flatten([
    ["-YEAR2016,BrAiken,KeMarfo"],
    ["-YEAR2017,PaPaulicap,NiRichards,HaWright,IsWashington,MaDoucoure,KeWilliams,JoAlvarado,ChDuarte,BoDiakite,NaCarter,MyCale,BoSidibe,DeGak,ZaKent,JoWalker,NaPierre-lou,MaTurner,JuMutts,JaHarris,DaMading"],
    ["-YEAR2018,KyLofton,MoBrown,DaBanton,BrWillis,JaRhoden,KhMoore,AlGriffin,FrPolicelli,SoKoureissi,NaReid,LoKing,JaQuinerly,JaCarey,LuMuhammad,VaManuel,SaDiabllo,RoHarper,MaNowell,GiBezhanishv,MaEarlington"],
    ["-YEAR2019,AiIgiehon,ChLedium,JoGirard,JuChampagnie,DaDavis:Oregon,JoToussaint,JoSoriano,BeKouma,AuMahoney,ScLewis,KaWhitney,BrAntoine,ZaFreemantle,KhBattle,JoPierre-lou,AlDawes,PaMulcahy,DeAkanno,AlKlatsky"],
    ["-YEAR2020,AnJackson,RjDavis,AnCurbelo,ZeKey,MaAmadasun,PoAlexander,NaTabor,DyWusu,JaCelestine,JaAbdur-rahim,LaWare,ClOmoruyi,AdSanogo,MiOConnell,CjWilcher,NiLane,MaZona,JaWhite,TaThweatt,QuAdams"],
  ]).join(","),


  // Archived:

  // "__NBA_2021__":  _.flatten([
  //   ["JaSuggs,EvMobley,CaCunningham,ScBarnes,CoKispert,FrWagner,MoMoody,JaBouknight,JaSpringer,KeJohnson,JaButler,DaMitchell,ShCooper,DaSharpe,KaJones,ChDuarte,IsJackson,NeQueta,TeShannon,ZiWilliams,CaThomas,JoAyayi"],
  //   ["TrMurphy:Virginia,GrBrown,JaHuff,AyDosunmu,MaHurt,JoChristophe,BrBoston,ScLewis,MiMcbride,TrMann,NaHyland,QuGrimes,HeJones,MaAbmas,JoWieskamp,McWright,IsLivers,JoJuzang,AuReaves,LuGarza,RoHarper,ChBassey,OcAgbaji"],
  //   ["OsDaSilva,DrTimme,MaZega,DaJohnson,AaHenry,JoPetty,DjSteward,DaDuke,YvPons,JeRobinson,TrWatford,AjLawson,RoWeems"],
  // ]).join(","),

} as Record<string, string>;
