
import _ from 'lodash';

/** DMVish players from 2017+ */
export const PlayerLeaderboardTracking = {
  "__DMV_2017__":  _.flatten([
    ["-YEAR2016,GrGolden"],
    ["-YEAR2017,NaMarshall,DjHarvey,DaMorsell,JoCarlton,JaMoultrie,ChWalker,DePerry,TeHightower,ElClarance,NiJackson:Wagner,OmHabwe,AnDuruji,NaWatson,JaPickett:George,EjObinna,AaThompson,DaDickens:Hampton,MyDouglas,AnWalker:Rhode,ChLykes,LuGarza"],
    ["-YEAR2018,JaSmith:Mary,ImQuickley,SaBey,JeHarris,NoLocke,MoMathis,BrGolden,BrAdams,WyTabbs,LaHardnett,DeMims,AmHarris,JaBynum,AnHiggs,DiZdor,DoToatley,BrSlater,RaBolton,XaJohnson:Pitt,XaJohnson:Indiana,PrHubb,SaBey,MyDead,TrWood:Mass,DeFlowers,RiLindo"],
    ["-YEAR2019,JuMoore,JaBishop,OlNkamhoua,JaYoung:Charl,YaGultekin,AbTsimbila,ChPaar,KaWilliams:Boston,MaPrice:Ohio,LoCurtis,CaMorsell,JaHeath,MiMitchell,MlMitchell,AyHikim,EjJarvis,AnHarris,DeSeabron,QuWahab,MeLong,JaMcallister,XaJohnson:George,JoOduro"],
    ["-YEAR2020,EaTimberlake,HuDickinson,JuLewis,WoNewton,ChEvans,AdBaldwin,DiStevens,JoSmith:Seton,DaNguessan,ElWood,DwKoroma,JaWest:Alabama,TeWilliams,ChHarris:George,MyStute,IsLeggett,TeIzay,JeRoach,AnScreen,JoFreeman:Mich,AnGill:Salle"],
    ["-YEAR2021,JoHawkins,JuReese,JaRobinson,RyConway,JaMiller,ErReynolds,AbSamb,QuAllen,MaDread,TrKeels,DaJohnson:UCF,BrMurray:LSU,BeWilliams:Syra"],
  ]).join(","),

  "__NYNJ_2017__":  _.flatten([
    ["-YEAR2016,BrAiken,KeMarfo"],
    ["-YEAR2017,PaPaulicap,NiRichards,HaWright,IsWashington,MaDoucoure,KeWilliams,JoAlvarado,ChDuarte,BoDiakite,NaCarter,MyCale,BoSidibe,DeGak,ZaKent,JoWalker,NaPierre-lou,MaTurner,JuMutts,JaHarris,DaMading"],
    ["-YEAR2018,KyLofton,MoBrown,DaBanton,BrWillis,JaRhoden,KhMoore,AlGriffin,FrPolicelli,SoKoureissi,NaReid,LoKing,JaQuinerly,JaCarey,LuMuhammad,VaManuel,SaDiabllo,RoHarper,MaNowell,GiBezhanishv,MaEarlington"],
    ["-YEAR2019,AiIgiehon,ChLedium,JoGirard,JuChampagnie,DaDavis:Oregon,JoToussaint,JoSoriano,BeKouma,AuMahoney,ScLewis,KaWhitney,BrAntoine,ZaFreemantle,KhBattle,JoPierre-lou,AlDawes,PaMulcahy,DeAkanno,AlKlatsky"],
    ["-YEAR2020,AnJackson,RjDavis,AnCurbelo,ZeKey,MaAmadasun,PoAlexander,NaTabor,DyWusu,JaCelestine,JaAbdur-rahim,LaWare,ClOmoruyi,AdSanogo,MiOConnell,CjWilcher,NiLane,MaZona,JaWhite,TaThweatt,QuAdams"],
  ]).join(","),

  // Built from https://docs.google.com/spreadsheets/d/1UcS-f0yhEg1xzJKOZfZdqZn6T2_BefjrLooZMJdMnyQ/edit#gid=879295464
  "__EURO_2017__": "OdDedolli,MaWhiteside,MaSchuecker,LuBrajkovic,BeErsek,GiBezhanishv,NiMaric,AdBesovic,EmSertovic,DaBohm,DuNeskovic,AlHuseinovic,DaKapiti,AyNouhi,ToCamara,NoColeman,SaHofman,BeBosmans-ve,StSwenson,AuGateretse,YaMassalski,DzRyuny,IvAlipiev,AlDelev,LuBarisic,OtJankovic,ViCubrilo,JaKukic,DuRadja,LuJaksic,MaFantina,AjEdu,MaSvoboda,MaRoub,MiKozak,MaWelsch,JaZidek,DaBohm,MiStafl,AsMidtgaard,DaKristensen,MaPoulsen,EmFreese-vil,MiHauge,AgKizilkaya,JeGranlund,LiSorensen,KaChristense,MaAmadasun,EoNelson,NeBoachie-yi,RjEytle-Rock,SiShittu,TaJurkatamm,CaJurgens,MaTass,MaJaakson,KeKriisa,RaPehka,ArKonontsuk,KaSuurorg,MaIlver,LeBockler,EdMaxhuni,LaNikkarinen,ElValtonen,HaPolla,ToMurphy,AnGustavson,TuJaakkola,MiJantunen,MuAmzil,JeGranlund,OlNkamhoua,ViTahvanaine,TeSuokas,ToTainamo,OlSarr,YvPons,JaHoard,JoAyayi,NiElame,AlYetna,EdKayouloud,JoMballa,JoBilau,NiEvtimov,DaBatcho,MeEbonkoli,PaDjoko,YvOuedraogo,KaMilling,LoLesmond,YaToumi,ChLorng,ClNadolny,AnToure,QuDiboundje-,WiIsiani,NiMetskhvari,SaMamukelash,RaAndronikas,TsTsartsidze,GiBezhanishv,LuMaziashvil,ZuZhgenti,SaGigiberia,AlMerkviladz,SeMuch,MaLinssen,QuNoupoue,OsSilva,FiFleute,ChSpenkuch,FrWagner,AkJonah,VlPinchuk,IsIhnen,SaGriesel,LaThiemann,DwKoroma,IsHawthorne,TrSilva,EfKalogerias,ArTsourgiann,ThZevgaras,AlPilavios,ArKaraiskos,DiKlonaras,NiChougkaz,TaKamateros,StPolatoglou,RoChougkaz,FiGkogkos,MaOkros,PeFilipovity,InGudmundsson,BrGylfason,HaHjalmarsso,ThThorbjarna,StThrastarso,DaMoretti,GaStefanini,AlLever,FrBadocchi,MaAcunzo,ThBinelli,GuCaruso,AnBernardi,FePoser,NiMannion,EtEsposito,MaPicarelli,LoDonadio,ErCzumbel,UmBrusadin,ToWoldetensa,PaBanchero,FrBorra,MiAnumba,EdCadia,GiArletti,MlArmus,DaKapiti,MiAntoms,KaGaroza,KrZoriks,MaKulackovsk,RoBlumbergs,FrLacis,RaHermanovsk,KrFeierbergs,TaKararinas,DoKupsas,ToVerbinskis,IgBrazdeikis,LuKisunas,IgSargiunas,VoMarkovetsk,MoKancleris,MaArlauskas,GeUrbonavici,LaVaistaras,AzTubelis,KaJonauskas,MaSpokas,GeMokseckas,TaTubelis,HuPivorius,SiLukosius,LoDemuth,PaDurisic,PeKrivokapic,GoMiladinovi,VaVucinic,NiZizic,CJFulton,DyEyck,JaFritz,RiMast,CaPoulina,KeSchutte,HiRoessink,KeSarvan,KjGraff,TrEnaruna,JaBergens,SiUijtendaal,BaLeyte,JoVisser,MaLeons,IyEnaruna,JoSaizonou,JeCordilia,QuPost,LaGrantsaan,DiPandev,AnJakimovski,KrSjolund,SiLorange,ToRotegard,MaLarsson,LaNilsen,SzWojcik,SzZapala,KuKarwowski,ToDomingos,NeQueta,HuFerreira,AnArion,DiGeorgiadis,MiCarcoana,DaKasatkin,MaTikhonenko,AnSavrasov,PaZakharov,ViLakhin,PeStepanyant,SaRuzhentsev,VlGoldin,AnToure,KoDotsenko,HaMorrice,StKenic,DiSpasojevic,LaNikolic,SiJovic,AlMatic,FiPetrusev,VuVulikic,MlArmus,AcMcCarthy,JoBernacer,RoIdehen,GoDike,BoFernandez,JeCarralero,SaAldama,JaLangarica,IsMassoud,MiAyesa,AlFaure,PeLopez-sanv,PaTamba,SiSisoho,MaDolezaj,JaO'Connell,RaSipkovsky,MaZeliznak,LuKraljevic,GaOzegovic,MaVesel,DaKralj,JaDornik,AlKunc,MaDusanic,DeAlibegovic,DaAppelgren,ViLarsson,ElClarance,DaCzerapowic,FeLemetti,PeStumer,EbDibba,OlGehrke,OsPalmquist,AnLorentsson,PeLarsson,JoCrafoord,KePohto,AnJansson,BrFavre,DaHuenermann,GrKolomoisky,AnPolite,ArRevaz,NiRocak,ToRocak,YaGultekin,CeKirciman,EmBuyukhanli,IyEnaruna,DaMutaf,TiGorener,AtAtsuren,PaDziuba,VoMarkovetsk,GeMaslenniko,RoNovitshyi,MaShulga,MyYagodin,DiZdor",

  // Archived:

  // "__NBA_2021__":  _.flatten([
  //   ["JaSuggs,EvMobley,CaCunningham,ScBarnes,CoKispert,FrWagner,MoMoody,JaBouknight,JaSpringer,KeJohnson,JaButler,DaMitchell,ShCooper,DaSharpe,KaJones,ChDuarte,IsJackson,NeQueta,TeShannon,ZiWilliams,CaThomas,JoAyayi"],
  //   ["TrMurphy:Virginia,GrBrown,JaHuff,AyDosunmu,MaHurt,JoChristophe,BrBoston,ScLewis,MiMcbride,TrMann,NaHyland,QuGrimes,HeJones,MaAbmas,JoWieskamp,McWright,IsLivers,JoJuzang,AuReaves,LuGarza,RoHarper,ChBassey,OcAgbaji"],
  //   ["OsDaSilva,DrTimme,MaZega,DaJohnson,AaHenry,JoPetty,DjSteward,DaDuke,YvPons,JeRobinson,TrWatford,AjLawson,RoWeems"],
  // ]).join(","),

} as Record<string, string>;
