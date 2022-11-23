
import _ from 'lodash';

/** DMVish players from 2017+ */
export const PlayerLeaderboardTracking = {
  "__DMV_2017__":  _.flatten([
    ["-YEAR2016,GrGolden,JeWilliams:Penn"],
    ["-YEAR2017,NaMarshall,DjHarvey,DaMorsell,JoCarlton,JaMoultrie,ChWalker+Chyree,DePerry+De'Vondre,TeHightower,ElClarance,NiJackson:Wagner,OmHabwe,AnDuruji,NaWatson,JaPickett:George,EjObinna,AaThompson,DaDickens:Hampton,MyDouglas,AnWalker:Rhode,ChLykes,LuGarza"],
    ["-YEAR2018,JaSmith:Mary,ImQuickley,SaBey,JeHarris,NoLocke,MoMathis,BrGolden,BrAdams,WyTabbs,LaHardnett,DeMims,AmHarris,JaBynum,AnHiggs,DiZdor,DoToatley,BrSlater,XaJohnson:Pitt,XaJohnson:Indiana,PrHubb,SaBey,MyDead,TrWood+Tre,DeFlowers,RiLindo"],
    ["-YEAR2019,JuMoore:Villanova,JaBishop,OlNkamhoua,JaYoung+Jahmir,YaGultekin,AbTsimbila,ChPaar,KaWilliams:Boston,MaPrice+Marvin,LoCurtis,CaMorsell,JaHeath,MiMitchell+Makhi,MlMitchell+Makhel,AyHikim,EjJarvis,AnHarris,DeSeabron,QuWahab,MeLong,JaMcallister,XaJohnson:George,JoOduro"],
    ["-YEAR2020,EaTimberlake,HuDickinson,JuLewis+Justin,WoNewton,ChEvans,AdBaldwin,MaDockery,DiStevens,JoSmith:Seton,DaN'guessan,ElWood,DwKoroma,JaWest+Jamal,TeWilliams+Terrance,DaMiles+Darius,ChHarris+Chuck,MyStute,IsLeggett,TeIzay,JeRoach,AnScreen,JoFreeman+Josiah,AnGill+Anwar"],
    ["-YEAR2021,JoHawkins,JuReese,IkCornish,JaRobinson,RyConway,JaMiller,ErReynolds,AbSamb,QuAllen,MaDread,TrKeels,DaJohnson+Darius,BrMurray+Brandon,BeWilliams+Benny,BrFreeman+Brayon,ElHawkins+Elijah"],
    ["-YEAR2022,ChWatson+Christian,JaTurner+Jared,DeDinkins+Devin,CaWhitmore+Cam,TyWard+Tyrell,RoRice+Rodney,FaAire+Favour,MaTraore+Mady,ChWinbourne+Christian,JuMintz+Judah,DuMcdaniel,PaLewis+Paul,DaOnanina,JaWalker+Jarace,NoBatchelor"],
  ]).join(","),

  "__NYNJ_2017__":  _.flatten([
    ["-YEAR2016,BrAiken,KeMarfo"],
    ["-YEAR2017,PaPaulicap,NiRichards,HaWright,IsWashington,MaDoucoure,KeWilliams,JoAlvarado,ChDuarte,BoDiakite,NaCarter,MyCale,BoSidibe,DeGak,ZaKent,JoWalker,NaPierre-lou,MaTurner,JuMutts,JaHarris,DaMading"],
    ["-YEAR2018,KyLofton,MoBrown,DaBanton,BrWillis,JaRhoden,KhMoore,AlGriffin,FrPolicelli,SoKoureissi,NaReid,LoKing,JaQuinerly,JaCarey,LuMuhammad,VaManuel,SaDiabllo,RoHarper,MaNowell,GiBezhanishv,MaEarlington"],
    ["-YEAR2019,AiIgiehon,ChLedium,JoGirard,JuChampagnie,DaDavis:Oregon,JoToussaint,JoSoriano,BeKouma,AuMahoney,ScLewis,KaWhitney,BrAntoine,ZaFreemantle,KhBattle,JoPierre-lou,AlDawes,PaMulcahy,DeAkanno,AlKlatsky"],
    ["-YEAR2020,AnJackson,RjDavis,AnCurbelo,ZeKey,MaAmadasun,PoAlexander,NaTabor,DyWusu,JaCelestine,JaAbdur-rahim,LaWare,ClOmoruyi,AdSanogo,MiOConnell,CjWilcher,NiLane,MaZona,JaWhite,TaThweatt,QuAdams"],
  ]).join(","),

  "__EURO_2017__": 
  _.flatten([
    [
      // Built from https://docs.google.com/spreadsheets/d/1UcS-f0yhEg1xzJKOZfZdqZn6T2_BefjrLooZMJdMnyQ/edit#gid=879295464
      "OdDedolli,MaWhiteside,MaSchuecker,LuBrajkovic,BeErsek,GiBezhanishv,NiMaric,AdBesovic,EmSertovic,DaBohm,DuNeskovic,AlHuseinovic,DaKapiti,AyNouhi,ToCamara,NoColeman,SaHofman,BeBosmans-Ve,StSwenson,AuGateretse,YaMassalski,DzRyuny,IvAlipiev,AlDelev,LuBarisic,OtJankovic,ViCubrilo,JaKukic,DuRadja,LuJaksic,MaFantina,AjEdu,MaSvoboda,MaRoub,MiKozak,MaWelsch,JaZidek,DaBohm,MiStafl,AsMidtgaard,DaKristensen,MaPoulsen,EmFreese-Vil,MiHauge,AgKizilkaya,JeGranlund,LiSorensen,KaChristense,MaAmadasun,EoNelson,NeBoachie-Yi,RjEytle-Rock,SiShittu,TaJurkatamm,CaJurgens,MaTass,MaJaakson,KeKriisa,RaPehka,ArKonontsuk,KaSuurorg,MaIlver,LeBockler,EdMaxhuni,LaNikkarinen,ElValtonen,HaPolla,ToMurphy,AnGustavson,TuJaakkola,MiJantunen,MuAmzil,JeGranlund,OlNkamhoua,ViTahvanaine,TeSuokas,ToTainamo,OlSarr,YvPons,JaHoard,JoAyayi,NiElame,AlYetna,EdKayouloud,JoMballa,JoBilau,NiEvtimov,DaBatcho,MeEbonkoli,PaDjoko,YvOuedraogo,KaMilling,LoLesmond,YaToumi,ChLorng,ClNadolny,AnToure,QuDiboundje-,WiIsiani,NiMetskhvari,SaMamukelash,RaAndronikas,TsTsartsidze,GiBezhanishv,LuMaziashvil,ZuZhgenti,SaGigiberia,AlMerkviladz,SeMuch,MaLinssen,QuNoupoue,OsDaSilva,FiFleute,ChSpenkuch,FrWagner,AkJonah,VlPinchuk,IsIhnen,SaGriesel,LaThiemann,DwKoroma,IsHawthorne,TrDaSilva,EfKalogerias,ArTsourgiann,ThZevgaras,AlPilavios,ArKaraiskos,DiKlonaras,NiChougkaz,TaKamateros,StPolatoglou,RoChougkaz,FiGkogkos,MaOkros,PeFilipovity,InGudmundsson,BrGylfason,HaHjalmarsso,ThThorbjarna,StThrastarso,DaMoretti,GaStefanini,AlLever,FrBadocchi,MaAcunzo,ThBinelli,GuCaruso,AnBernardi,FePoser,NiMannion,EtEsposito,MaPicarelli,LoDonadio,ErCzumbel,UmBrusadin,ToWoldetensa,PaBanchero,FrBorra,MiAnumba,EdCadia,GiArletti,MlArmus,DaKapiti,MiAntoms,KaGaroza,KrZoriks,MaKulackovsk,RoBlumbergs,FrLacis,RaHermanovsk,KrFeierbergs,TaKararinas,DoKupsas,ToVerbinskis,IgBrazdeikis,LuKisunas,IgSargiunas,VoMarkovetsk,MoKancleris,MaArlauskas,GeUrbonavici,LaVaistaras,AzTubelis,KaJonauskas,MaSpokas,GeMokseckas,TaTubelis,HuPivorius,SiLukosius,LoDemuth,PaDurisic,PeKrivokapic,GoMiladinovi,VaVucinic,NiZizic,CjFulton,DyVanEyck,JaFritz,RiMast,CaPoulina,KeSchutte,HiRoessink,KeSarvan,KjGraff,TrEnaruna,JaBergens,SiUijtendaal,BaLeyte,JoVisser,MaLeons,IyEnaruna,JoSaizonou,JeCordilia,QuPost,LaGrantsaan,DiPandev,AnJakimovski,KrSjolund,SiLorange,ToRotegard,MaLarsson,LaNilsen,SzWojcik,SzZapala,KuKarwowski,ToDomingos,NeQueta,HuFerreira,AnArion,DiGeorgiadis,MiCarcoana,DaKasatkin,MaTikhonenko,AnSavrasov,PaZakharov,ViLakhin,PeStepanyant,SaRuzhentsev,VlGoldin,AnToure,KoDotsenko,HaMorrice,StKenic,DiSpasojevic,LaNikolic,SiJovic,AlMatic,FiPetrusev,VuVulikic,MlArmus,AcMcCarthy,JoBernacer,RoIdehen,GoDike,BoFernandez,JeCarralero,SaAldama,JaLangarica,IsMassoud,MiAyesa,AlFaure,PeLopez-Sanv,PaTamba,SiSisoho,MaDolezaj,JaO'Connell,RaSipkovsky,MaZeliznak,LuKraljevic,GaOzegovic,MaVesel,DaKralj,JaDornik,AlKunc,MaDusanic,DeAlibegovic,DaAppelgren,ViLarsson,ElClarance,DaCzerapowic,FeLemetti,PeStumer,EbDibba,OlGehrke,OsPalmquist,AnLorentsson,PeLarsson,JoCrafoord,KePohto,AnJansson,BrFavre,DaHuenermann,GrKolomoisky,AnPolite,ArRevaz,NiRocak,ToRocak,YaGultekin,CeKirciman,EmBuyukhanli,IyEnaruna,DaMutaf,TiGorener,AtAtsuren,PaDziuba,VoMarkovetsk,GeMaslenniko,RoNovitshyi,MaShulga,MyYagodin,DiZdor",
      // By hand from CBB_Europe twitter (11/24):
      "MaRaynaud,ShWalters+Shaquille,DaAkin+Daniel,SaStefanovic+Sasha,JaGrandison+Jacob,MoDiabate+Moussa,KaKostmayer+Kai,SeSiJawara,NaRobinson+Nate,ViRajkovic+Vic=ktor,",
      // By hand from CBB_Europe twitter (12/5):
      "JeEdwards+Jesse,ToEvbuomwan,EtPrice+Ethan,AjMitchell+Ajay",
      // By hand from CBB_Europp twitter (12/12):
      "AuMarciulion+Augustus,AlCardenas+Alvaro,SeForsling+Seb"
    ]
  ]).join(","),

  "__CANADA_2017__":
  _.flatten([
    [
      // Built from https://docs.google.com/spreadsheets/d/1UcS-f0yhEg1xzJKOZfZdqZn6T2_BefjrLooZMJdMnyQ/edit#gid=879295464
      "EmAkot,MaMoncreiffe,KeAmbrose-Hy,FaAimaq,JaBlair,OSBrissett,IgBrazdeikis,JaBediako,R.Barrett,JoBrown,ChBediako,KhBennett,KeBarthelemy,MaBailey,DaBanton,JaBrown,JoBascoe,EnBoakye,MaCalloo,MaCarr,MaCase,NaCayo,KoCharles,AlChristie,JaColley,AlComanita,IvCucak,ShDaniel,ChDavid,DaDeAveiro,AjEdu,DaDjuricic,LuDort,ChDuarte,KyDuke-Simps,ZaEdey,TrEdwards,KoElvis,KaEzeagu,JuFarquhar,KyFilewich,SaGasana,ShGilgeous-A,ThGilgeous-A,MaGrace,ClGriffith,QuGuerrier,BaHaidara,BeHendriks,JaHenry,RjEytle-Rock,CaHoustan,ElIfejeh,NaJack,FaJenneto,JoKabongo,AbKigab,NoKirkwood,JeKoulibaly,BeKrikke,AjLawson,GeLefebvre,BeLi,JaLlewellyn,AnLongpre,AdMakuoi,BeMathurin,LiMcChesney,EmMiller,SeMiller-Moo,TrMinott,JdMuila,MaNdur,JaNeath,AnNembhard,RyNembhard,MiNenadic,BrNewton,ElNsoseme,AlNwagha,PrOduro,MiOkafor,GaOsabuohien,NaOwusu-Anan,WhPanzo,AdPatterson,JoPrimo,OlProsper,JaPryce-Noel,DaQuest,ViRadocaj,ShRathan-May,SaRautins,DaSackey,LuSakota,TySamuel,KeSaunders,JeScott,ThShelton-Sz,SiShittu,TaSimms,StSmith,DaSquire,ShStevenson,CoStucke,BrTalbot,JaTelfort,TaTodd,MiTomley,NaTshimanga,AnVernon,JoVrankic,NiAlexander-,JaWarren,HoWashington,LiWigginton",
      // By hand from eg CanBallReport twitter (11/24):
      "NiDjogo+Nikola,KuJongkuch+Kur,JaJean-marie,StIngo+Stephane",
      // By hand from eg CanBallReport twitter (12/5):
      "AaRai+Aaryn,RuWilliams+Rudi,ShGivance+Shamar,JaKarnik+James,RuWilliams+Rudi,EmBandoumel,KoMcewen+Koby,JaCampbell+Jaden,hearn+Dylan,JeDesrosiers+Jerome",
      // By hand from eg CanBallReport twitter (12/12):
      "AdEleeda+Adham,MiNuga+Mich"
    ]
  ]).join(","),

  // T100 NBA draft picks, per NBA
  "__NBA_2022__": "ChHolmgren;JaSmith+Jabari;PaBanchero;JaIvey;KeMurray;AjGriffin;BeMathurin;JaDuren;MaBranham;MaWilliams:Duke;JeSochan;OcAgbaji;TyWashington;TaEason;KeChandler;EjLiddell;TeSmith+Terq;DaTerry;JaWilliams:Santa;WaKessler;BlWesley;TrKeels;KeBrown+Kendall;BrMcgowens;ChBraun;JaLaravia;PaBaldwin;AnNembhard;WeMoore;RyRollins;PeWatson;JaWilliams:Ark;ChKoloko;JuLewis:Marq;MaChristie;DaRoddy;JoMinott;CaHouston;TrWilliams:Purd;JdDavison;DeSeabron;RoHarper;AlWilliams:Wake;DrTimme;KeEllis;CoGillesp;TyMartin;JuStrawther;KeLofton;MaSasser;ScPippen;JoButler:Flor;HaIngram;JaWalker+Jabari;JuChampa;MoDiabate;PeNance;JoJuzang;TeBrown+Tevin;AmMohammed;OrRobinson;IvMolinar;ViWilliams:VCU;KoCockburn;BaScheierm;GaBrown+Gabe;JaWilson:Kansas;JoHall+Jordan;JaBouy;DaDays:LSU;BrWilliams+Bryson;KrMurray;JaRhoden;QuJackson:Texas;IsMobley;HyLee:Davi",

  // Super seniors for 2022/23 (built by uncommenting the section at the end of TeamEditorManualFixes)
  "__SUPER_SR_2022__": "GiGeorge:BYU;ZeJasper:Auburn;TyFagan:Ole Miss;CoCastleton:Florida;MyJones:Florida;KeObanor:Texas Tech;BrSlater:Villanova;CaDaniels:Villanova;DaSingleton:UCLA;SeTowns:Ohio St.;JuSueing:Ohio St.;DrPeterson:Southern California;YoAnei:DePaul;MaCarr:Texas;TiAllen:Texas;ChBishop:Texas;ReChaney:Houston;TaGroves:Oklahoma;ElHarkless:Oklahoma;DeWalker:Nebraska;LeBlack:North Carolina;KiClark:Virginia;JaGardner:Virginia;NoGurley:Alabama;JuMutts:Virginia Tech;DaQuisenberr:Fordham;BeStanley:Xavier;AdKunkel:Xavier;RaThompson:Indiana;MiKopp:Indiana;XaJohnson:Indiana;LiRobbins:Vanderbilt;QuMillora-br:Vanderbilt;FlThamba:Baylor;MoMathis:St. John's (NY);CoRyan:Notre Dame;DaGoodwin:Notre Dame;NaLaszewski:Notre Dame;JaBurton:Pittsburgh;JaPickett:Penn St.;MyDread:Penn St.;WiRichardson:Oregon;MaShaver:Boise St.;JoHauser:Michigan St.;MaAshton-lan:Boston College;KeMoore:Colorado St.;HuTyson:Clemson;DeJohnson:Cleveland St.;DjWilkins:Drake;RoPenn:Drake;GaSturtz:Drake;DaBrodie:Drake;MiBothwell:Furman;JaSlawson:Furman;RaBolton:Gonzaga;FiRebraca:Iowa;CoMccaffery:Iowa;GaKalscheur:Iowa St.;AlKunc:Iowa St.;TyGreene:Jacksonville;SiCarry:Kent St.;DaMcGhee:Liberty;DeWilliams:Memphis;DaKountz:Northern Colo.;EdCroswell:Providence;MaGrace:Richmond;DwMurray:Rider;AuHyatt:Rutgers;CaMcconnell:Rutgers;JaPerkins:Saint Louis;LoJohnson:Saint Mary's (CA);MaEarlington:San Diego;AdSeiko:San Diego St.;AgArop:San Diego St.;MaBradley:San Diego St.;NaMensah:San Diego St.;KhShabazz:San Francisco;JaHarris:Seton Hall;TeJones:Southern Utah;MaFausett:Southern Utah;DaWilliamson:Wake Forest;JsHamilton:Western Ky.;LuFrampton:Western Ky.;HuThompson:Wyoming;HuMaldonado:Wyoming",

  // Tracking transfer targets
  "__TERPS_TAMPER_TARGETS__": "AdBaldwin;JoOduro;BeWilliams;EaTimberlake;IsLeggett;BrMurray;DrPember;JaBishop;",

  // Archived:

  // "__NBA_2021__":  _.flatten([
  //   ["JaSuggs,EvMobley,CaCunningham,ScBarnes,CoKispert,FrWagner,MoMoody,JaBouknight,JaSpringer,KeJohnson,JaButler,DaMitchell,ShCooper,DaSharpe,KaJones,ChDuarte,IsJackson,NeQueta,TeShannon,ZiWilliams,CaThomas,JoAyayi"],
  //   ["TrMurphy:Virginia,GrBrown,JaHuff,AyDosunmu,MaHurt,JoChristophe,BrBoston,ScLewis,MiMcbride,TrMann,NaHyland,QuGrimes,HeJones,MaAbmas,JoWieskamp,McWright,IsLivers,JoJuzang,AuReaves,LuGarza,RoHarper,ChBassey,OcAgbaji"],
  //   ["OsDaSilva,DrTimme,MaZega,DaJohnson,AaHenry,JoPetty,DjSteward,DaDuke,YvPons,JeRobinson,TrWatford,AjLawson,RoWeems"],
  // ]).join(","),

} as Record<string, string>;
