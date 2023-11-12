import _ from "lodash";

/** DMVish players from 2017+ */
export const PlayerLeaderboardTracking = {
  __DMV_2017__: _.flatten([
    ["-YEAR2016,GrGolden,JeWilliams:Penn"],
    [
      "-YEAR2017,NaMarshall,DjHarvey,DaMorsell,JoCarlton,JaMoultrie,ChWalker+Chyree,DePerry+De'Vondre,TeHightower,ElClarance,NiJackson:Wagner,OmHabwe,AnDuruji,NaWatson,JaPickett:George,EjObinna,AaThompson,DaDickens:Hampton,MyDouglas,AnWalker:Rhode,ChLykes,LuGarza",
    ],
    [
      "-YEAR2018,JaSmith:Mary,ImQuickley,SaBey,JeHarris,NoLocke,MoMathis,BrGolden,BrAdams,WyTabbs,LaHardnett,DeMims,AmHarris,JaBynum,AnHiggs,DiZdor,DoToatley,BrSlater,XaJohnson:Pitt,XaJohnson:Indiana,PrHubb,SaBey,MyDead,TrWood+Tre,DeFlowers,RiLindo",
    ],
    [
      "-YEAR2019,JuMoore:Villanova,JaBishop,JaYoung+Jahmir,YaGultekin,AbTsimbila,ChPaar,KaWilliams:Boston,MaPrice+Marvin,LoCurtis,CaMorsell,JaHeath,MiMitchell+Makhi,MlMitchell+Makhel,AyHikim,EjJarvis,AnHarris,DeSeabron,QuWahab,MeLong,JaMcallister,XaJohnson:George,JoOduro",
    ],
    [
      "-YEAR2020,EaTimberlake,HuDickinson,JuLewis+Justin,WoNewton,ChEvans,AdBaldwin,MaDockery,DiStevens,JoSmith:Seton,DaN'guessan,ElWood,DwKoroma,JaWest+Jamal,TeWilliams+Terrance,DaMiles+Darius,ChHarris+Chuck,MyStute,IsLeggett,TeIzay,JeRoach,AnScreen,JoFreeman+Josiah,AnGill+Anwar,DaMaddox+Darius",
    ],
    [
      "-YEAR2021MD,JoHawkins,JuReese,IkCornish,JaRobinson+Jakai,RyConway,JaMiller,TyBrelsford",
    ],
    [
      "-YEAR2021VADC,ErReynolds,AbSamb,QuAllen,MyDread+Myles,TrKeels,DaJohnson+Darius,BrMurray+Brandon,BeWilliams+Benny,BrFreeman+Brayon,ElHawkins+Elijah",
    ],
    [
      "-YEAR2022MD,ChWatson+Christian,JaTurner+Jared,DeDinkins+Devin,CaWhitmore+Cam,TyWard+Tyrell,JaWest+Jamal,TyCommander+Tyson,D'Stines+D'Angelo",
    ],
    [
      "-YEAR2022VADC,RoRice+Rodney,FaAire+Favour,MaTraore+Mady,ChWinbourne+Christian,JuMintz+Judah,DuMcdaniel,PaLewis+Paul,DaOnanina,JaWalker+Jarace,NoBatchelor+Noah,RoBrumbaugh",
    ],
    [
      "-YEAR2023MD,AmHansberry+Amani,CaCarrington+Carlton,DrMckenna+Drew,JaLamothe+Jahn,MiWilliams:LSU,BrLindsey+Bryce,ElJones:UTEP",
    ],
    [
      "-YEAR2023VADC,DeHarris-smi,KwEvans+Kwame,JaKaiser+Jamie,JaHutchinson+Jacoi,MaMack+Malik,RoDockery+Rob",
    ],
  ]).join(","),

  __EURO_2017__: _.flatten([
    [
      // Built from:
      // url_countries.tsv from "Euro" tab of https://docs.google.com/spreadsheets/d/1UcS-f0yhEg1xzJKOZfZdqZn6T2_BefjrLooZMJdMnyQ/edit#gid=879295464
      //while IFS=$'\t' read -r col1 col2; do echo "getting $col1 [$col2]"; htmltab --select table.tablesaw "https://basketball.realgm.com/$col1" | grep -v 'Current Team' | sed "s/$/,$col2/" | tr -d '\r' > EURO_$col2.csv; done < url_countries.tsv
      //cat EURO_*.csv | grep -E '",(2017|2018|2019|2020|2021|2022),' > ../EURO_all.csv
      //java -cp "$PBP_SRC_ROOT/target/scala-2.12/cbb-explorer-assembly-0.1-deps.jar:$PBP_SRC_ROOT/target/scala-2.12/cbb-explorer_2.12-0.1.jar" org.piggottfamily.cbb_explorer.BuildPlayerLists --in=/Users/alex/personal/github/cbb-data/cbb/EURO_all.csv --rosters=$HOOPEXP_SRC_DIR/public/rosters
      "GiBezhanishv,BeErsek,RoAnderson,DaBohm,AlHuseinovic,DuNeskovic,EmSertovic,BeBosmans-ve,ToCamara,NoColeman,AuGrateretse,AjMitchell,ShAllen,StSwenson,GePlotnikov,DzRyuny,IvAlipiev,AlDelev,LuBarisic,OtJankovic,ViCubrilo,JaKukic,IgMilicic,AnBeljan,AjEdu,DaBohm,MiKozak,MaRoub,MiStafl,JaZidek,AsMidtgaard,EmFreese-vil,JeGranlund,LiSorensen,LoStormark,JeBallisager,MaAmadasun,CjFulton,EoNelson,NdOkafor,SaAlajiki,KiGribben,SiShittu,RjEytle-rock,NeBoachie-yi,LeBockler,MaIlver,MaJaakson,CaJurgens,TaJurkatamm,JoKirsipuu,ArKonontsuk,KeKriisa,RaPehka,KaSuurong,MaTass,HeVeesaar,ElValtonen,HaPolla,AnGustavson,TuJaakkola,MiJantunen,MuAmzil,JeGranlund,OlNkamhoua,ViTahvanaine,TeSuokas,FeFederiko,ToTainamo,NiGustavson,EmSkytta,JoAyayi,DaBatcho,BeBayela,JoBilau,AlBoutayeb,MoDiabate,MeEbonkoli,NiElame,NiEvtimov,EdKayouloud,LoLesmond,ChLorng,KaMilling,ClNadolny,YvOuedraogo,YvPons,OlSarr,AlTchikou,YaToumi,AnToure,TaTouze,YoTraore,AlYetna,WiIsiani,NiMetskhvari,SaMamukelash,RaAndronikas,TsTsartsidze,GiBezhanishv,ZuZhgenti,SaGigiberia,AlMerkviladz,ShAbashidze,MaLinssen,QuEmanga,OsDaSilva,FrWagner,VlPinchuk,IsIhnen,SaGriesel,LaThiemann,LaSabally,BeLeuchten,DwKoroma,IsHawthorne,TrDaSilva,BeSchroder,MiRataj,EfKalogerias,ArTsourgiann,AlPilavios,RoChougkaz,TaKamateros,FiGkogkos,EmDimou,PeFilipovity,MaOkros,SvBirgisson,InGudmundsso,StThrastarso,EyNankin,EmSharp,DaMoretti,AlLever,FrBadocchi,ThBinelli,GuCaruso,FePoser,AbCanka,EtEsposito,MaPicarelli,LoDonadio,ErCzumbel,UmBrusadin,ToWoldetensa,PaBanchero,FrBorra,LeBettiol,FiRebraca,MiAnumba,EdDelCadia,FeMotta,GiArletti,MlArmus,MiAntoms,MaKulackovsk,FrLacis,RaHermanovsk,KrFeierbergs,FrBagatskis,NoWilliamson,TaKararinas,DoKupsas,ToVerbinskis,IgBrazdeikis,LuKisunas,VoMarkovetsk,MaArlauskas,LaVaistaras,AzTubelis,KaJonauskas,MaSpokas,AuMarciulion,GeMokseckas,TaTubelis,HuPivorius,EmButkus,RaKneizys,OlKojenets,RoJocius,LuGudavicius,SiLukosius,LoDemuth,NiZizic,PeKrivokapic,GoMiladinovi,VaVucinic,CjFulton,KiGribben,IbBayu,JaBergens,JeCordilia,MaDiouf,JeEdwards,TrEnaruna,JaFritz,JaFritz,LaGrantsaan,MaLeons,BaLeyte,RiMast,ThOosterbroe,QuPost,HiRoessink,JoSaizonou,KeSarvan,KeSchutte,NoThelissen,SiUijtendaal,DyVanEyck,JoVisser,AnJakimovski,DiPandev,ToRotegaard,KrSjolund,KaKlaczek,IgMilicic,JeSochan,SzWojcik,SzZapala,StBorden,AnCruz,HuFerreira,NeQueta,AnArion,LuColceag,DiGeorgiadis,ViMuresan,VlGoldin,DaKasatkin,ViLakhin,ViPanov,SaRuzhentsev,AnSavrasov,MaTikhonenko,AnToure,PaZakharov,HaMorrice,StKenic,DiSpasojevic,AlMatic,FiPetrusev,VuVulikic,MlArmus,RoIdehen,GoDike,JeCarralero,SaAldama,JaLangarica,IsMassoud,JaRuffin,VaPinedo,MiAyesa,AlFaure,PeLoSanvicente,PaTamba,SiSiJawara,MaDolezaj,MaHronsky,JaO'connell,RaSipkovsky,MaZeliznak,LuKraljevic,AlKunc,LuTekavcic,DaAppelgren,JoCrafoord,AlAbdouDibba,EbDibba,SeForsling,AnJansson,BoKlintman,PeLarsson,ViLarsson,FeLemetti,AnLorentsson,JaMansson,RoMyrthil,OsPalmquist,KePohto,FiSkobalj,BrFavre,KeMartina,AnPolite,ArRevaz,ToRocak,AcSpadone,YaGultekin,EmBuyukhanli,DaMutaf,TiGorener,AdBona,ZeTekin,StBorden,GeMaslenniko,VoMarkovetsk,RoNovitskyi,MaShulga,PaDziuba",
      // By hand from CBB_Europe twitter (11/24):
      "MaRaynaud,ShWalters+Shaquille,DaAkin+Daniel,SaStefanovic+Sasha,JaGrandison+Jacob,MoDiabate+Moussa,KaKostmayer+Kai,SeSiJawara,NaRobinson+Nate,ViRajkovic+Viktor",
      // By hand from CBB_Europe twitter (12/5):
      "JeEdwards+Jesse,ToEvbuomwan,EtPrice+Ethan,AjMitchell+Ajay",
      // By hand from CBB_Europe twitter (12/12):
      "AuMarciulion+Augustus,AlCardenas+Alvaro,SeForsling+Seb",
      // By hand from discussion with CBB_Europe (2022: 30/11, 2/12)
      "CaHildreth,EmSharp:Houston,NeQuinn:Richmond,WiBreidenbac",
      // By hand from CBB_Europe twitter (01/12, 02/12):
      "JaDelaire,MePissis,SaPissis,MiMoshkovitz,AmWilliams+Amari,RiTutic,QuDiboundje,AnBrzovic,JuBelo+Jubrile,CaFuller+Caleb,AlMukeba,DaN'guessan,StVerplancke,JoBrown:Montana,MoKancleris,GeJuozapait,KyHouinsou,MaMarsh+Matthew,KaKlaczekm,MaLukic+Marko,ToLawal",
    ],
  ]).join(","),

  __CANADA_2017__: _.flatten([
    [
      // Built from: (https://docs.google.com/spreadsheets/d/1UcS-f0yhEg1xzJKOZfZdqZn6T2_BefjrLooZMJdMnyQ/edit#gid=879295464)
      // while IFS=$'\t' read -r col1; do echo "getting $col1"; htmltab --select table.tablesaw "https://basketball.realgm.com/ncaa/birth-countries/23/Canada/$col1" | grep -v 'Current Team' | tr -d '\r' > CAN_$col1.csv; done < alphabet.tsv
      // cat CAN_*.csv | grep -E '",(2017|2018|2019|2020|2021|2022),' > ../CAN_all.csv
      //java -cp "$PBP_SRC_ROOT/target/scala-2.12/cbb-explorer-assembly-0.1-deps.jar:$PBP_SRC_ROOT/target/scala-2.12/cbb-explorer_2.12-0.1.jar" org.piggottfamily.cbb_explorer.BuildPlayerLists --in=/Users/alex/personal/github/cbb-data/cbb/CAN_all.csv --rosters=$HOOPEXP_SRC_DIR/public/rosters
      // hand edits: JoBrown+Joel, JoDavis+Josiah, JaBrown+Javonte
      "EmAkot,KeAmbrose-hy,FaAimaq,MaBailey,DaBanton,RjBarrett,KeBarthelemy,JoBascoe,ChBediako,JaBediako,JaBlair,EnBoakye,IgBrazdeikis,OsBrissett,JaBrown+Javonte,JoBrown+Joel,MaCalloo,MaCarr,MaCase,NaCayo,KoCharles,AlChristie,JaClayton,ShDaniel,ChDavid,JoDavis+Josiah,DaDeaveiro,JeDesrosiers,LuDort,ChDuarte,JeMonegro,ZaEdey,TrEdwards,KoElvis,WiExacte,KaEzeagu,KyFilewich,ElFisher,MaGrace,QuGuerrier,BaHaidara,JoHemmings,BeHendriks,JaHenry,ScHitchon,CaHoustan,LuHunger,KcIbekwe,ElIfejeh,NaJack,DjJackson,JaJean-marie,FaJenneto,KuJongkuch,JoKabongo,AbKigab,JaKirkwood,NoKirkwood,JeKoulibaly,BeKrikke,AjLawson,JaLlewellyn,AnLongpre,BeMathurin,LiMcchesney,EmMiller,SeMiller-moo,TrMinott,MaMoncrieffe,JdMuila,AnNembhard,ElNsoseme,MaNdur,AlNwagha,RyNembhard,JaNeath,MiNenadic,BrNewton,PrOduro,OsOkojie,GaOsabuohien,NaOwusu-anan,WhPanzo,JoPrimo,OlProsper,JaPrice-noel,ShRathan-may,TyRowell,DaSackey,LuSakota,TySamuel,KeSaunders,JeScott,SiShittu,TaSimms,StSmith,DaSquire,ShStevenson,CoStucke,CaSwanton-ro,BrTalbot,JaTelfort,TaTodd,MiTomley,NaTshimanga,AnVernon,JoVrankic,NiAlexander-,JaWarren,HoWashington,LiWigginton,AnWrzeszcz,RyYoung",
      // By hand from eg CanBallReport twitter (11/24):
      "NiDjogo+Nikola,KuJongkuch+Kur,JaJean-marie,StIngo+Stephane",
      // By hand from eg CanBallReport twitter (12/5):
      "AaRai+Aaryn,RuWilliams+Rudi,ShGivance+Shamar,JaKarnik+James,RuWilliams+Rudi,EmBandoumel,KoMcewen+Koby,JaCampbell+Jaden,hearn+Dylan,JeDesrosiers+Jerome",
      // By hand from eg CanBallReport twitter (12/12):
      "AdEleeda+Adham,MiNuga+Mich",
    ],
  ]).join(","),

  // Tracking transfer targets
  __TERPS_TAMPER_TARGETS__: "AdBaldwin;ErReynolds;",

  // Archived:

  // __NYNJ_2017__: _.flatten([
  //   ["-YEAR2016,BrAiken,KeMarfo"],
  //   [
  //     "-YEAR2017,PaPaulicap,NiRichards,HaWright,IsWashington,MaDoucoure,KeWilliams,JoAlvarado,ChDuarte,BoDiakite,NaCarter,MyCale,BoSidibe,DeGak,ZaKent,JoWalker,NaPierre-lou,MaTurner,JuMutts,JaHarris,DaMading",
  //   ],
  //   [
  //     "-YEAR2018,KyLofton,MoBrown,DaBanton,BrWillis,JaRhoden,KhMoore,AlGriffin,FrPolicelli,SoKoureissi,NaReid,LoKing,JaQuinerly,JaCarey,LuMuhammad,VaManuel,SaDiabllo,RoHarper,MaNowell,GiBezhanishv,MaEarlington",
  //   ],
  //   [
  //     "-YEAR2019,AiIgiehon,ChLedium,JoGirard,JuChampagnie,DaDavis:Oregon,JoToussaint,JoSoriano,BeKouma,AuMahoney,ScLewis,KaWhitney,BrAntoine,ZaFreemantle,KhBattle,JoPierre-lou,AlDawes,PaMulcahy,DeAkanno,AlKlatsky",
  //   ],
  //   [
  //     "-YEAR2020,AnJackson,RjDavis,AnCurbelo,ZeKey,MaAmadasun,PoAlexander,NaTabor,DyWusu,JaCelestine,JaAbdur-rahim,LaWare,ClOmoruyi,AdSanogo,MiOConnell,CjWilcher,NiLane,MaZona,JaWhite,TaThweatt,QuAdams",
  //   ],
  // ]).join(","),

  // T100 NBA draft picks, per NBA
  // __NBA_2022__:
  //   "ChHolmgren;JaSmith+Jabari;PaBanchero;JaIvey;KeMurray;AjGriffin;BeMathurin;JaDuren;MaBranham;MaWilliams:Duke;JeSochan;OcAgbaji;TyWashington;TaEason;KeChandler;EjLiddell;TeSmith+Terq;DaTerry;JaWilliams:Santa;WaKessler;BlWesley;TrKeels;KeBrown+Kendall;BrMcgowens;ChBraun;JaLaravia;PaBaldwin;AnNembhard;WeMoore;RyRollins;PeWatson;JaWilliams:Ark;ChKoloko;JuLewis:Marq;MaChristie;DaRoddy;JoMinott;CaHouston;TrWilliams:Purd;JdDavison;DeSeabron;RoHarper;AlWilliams:Wake;DrTimme;KeEllis;CoGillesp;TyMartin;JuStrawther;KeLofton;MaSasser;ScPippen;JoButler:Flor;HaIngram;JaWalker+Jabari;JuChampa;MoDiabate;PeNance;JoJuzang;TeBrown+Tevin;AmMohammed;OrRobinson;IvMolinar;ViWilliams:VCU;KoCockburn;BaScheierm;GaBrown+Gabe;JaWilson:Kansas;JoHall+Jordan;JaBouy;DaDays:LSU;BrWilliams+Bryson;KrMurray;JaRhoden;QuJackson:Texas;IsMobley;HyLee:Davi",

  // Super seniors for 2022/23 (built by uncommenting the section at the end of TeamEditorManualFixes)
  // __SUPER_SR_2022__:
  //   "GiGeorge:BYU;ZeJasper:Auburn;TyFagan:Ole Miss;CoCastleton:Florida;MyJones:Florida;KeObanor:Texas Tech;BrSlater:Villanova;CaDaniels:Villanova;DaSingleton:UCLA;SeTowns:Ohio St.;JuSueing:Ohio St.;DrPeterson:Southern California;YoAnei:DePaul;MaCarr:Texas;TiAllen:Texas;ChBishop:Texas;ReChaney:Houston;TaGroves:Oklahoma;ElHarkless:Oklahoma;DeWalker:Nebraska;LeBlack:North Carolina;KiClark:Virginia;JaGardner:Virginia;NoGurley:Alabama;JuMutts:Virginia Tech;DaQuisenberr:Fordham;BeStanley:Xavier;AdKunkel:Xavier;RaThompson:Indiana;MiKopp:Indiana;XaJohnson:Indiana;LiRobbins:Vanderbilt;QuMillora-br:Vanderbilt;FlThamba:Baylor;MoMathis:St. John's (NY);CoRyan:Notre Dame;DaGoodwin:Notre Dame;NaLaszewski:Notre Dame;JaBurton:Pittsburgh;JaPickett:Penn St.;MyDread:Penn St.;WiRichardson:Oregon;MaShaver:Boise St.;JoHauser:Michigan St.;MaAshton-lan:Boston College;KeMoore:Colorado St.;HuTyson:Clemson;DeJohnson:Cleveland St.;DjWilkins:Drake;RoPenn:Drake;GaSturtz:Drake;DaBrodie:Drake;MiBothwell:Furman;JaSlawson:Furman;RaBolton:Gonzaga;FiRebraca:Iowa;CoMccaffery:Iowa;GaKalscheur:Iowa St.;AlKunc:Iowa St.;TyGreene:Jacksonville;SiCarry:Kent St.;DaMcGhee:Liberty;DeWilliams:Memphis;DaKountz:Northern Colo.;EdCroswell:Providence;MaGrace:Richmond;DwMurray:Rider;AuHyatt:Rutgers;CaMcconnell:Rutgers;JaPerkins:Saint Louis;LoJohnson:Saint Mary's (CA);MaEarlington:San Diego;AdSeiko:San Diego St.;AgArop:San Diego St.;MaBradley:San Diego St.;NaMensah:San Diego St.;KhShabazz:San Francisco;JaHarris:Seton Hall;TeJones:Southern Utah;MaFausett:Southern Utah;DaWilliamson:Wake Forest;JsHamilton:Western Ky.;LuFrampton:Western Ky.;HuThompson:Wyoming;HuMaldonado:Wyoming",

  // "__NBA_2021__":  _.flatten([
  //   ["JaSuggs,EvMobley,CaCunningham,ScBarnes,CoKispert,FrWagner,MoMoody,JaBouknight,JaSpringer,KeJohnson,JaButler,DaMitchell,ShCooper,DaSharpe,KaJones,ChDuarte,IsJackson,NeQueta,TeShannon,ZiWilliams,CaThomas,JoAyayi"],
  //   ["TrMurphy:Virginia,GrBrown,JaHuff,AyDosunmu,MaHurt,JoChristophe,BrBoston,ScLewis,MiMcbride,TrMann,NaHyland,QuGrimes,HeJones,MaAbmas,JoWieskamp,McWright,IsLivers,JoJuzang,AuReaves,LuGarza,RoHarper,ChBassey,OcAgbaji"],
  //   ["OsDaSilva,DrTimme,MaZega,DaJohnson,AaHenry,JoPetty,DjSteward,DaDuke,YvPons,JeRobinson,TrWatford,AjLawson,RoWeems"],
  // ]).join(","),
} as Record<string, string>;
