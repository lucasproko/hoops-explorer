#!/bin/bash
if [ -z "$YEARS" ]; then
   echo "Specify YEARS=all|old|new, currently [$YEARS]"
   exit -1
fi
if [ "$YEARS" = "all" ] || [ "$YEARS" = "new" ]; then
  npm run build_leaderboards -- --tier=High; npm run build_leaderboards -- --tier=Medium; npm run build_leaderboards -- --tier=Low; npm run build_leaderboards -- --gender=Women; 
  npm run build_leaderboards -- --tier=Combo 
fi
if [ "$YEARS" = "all" ] || [ "$YEARS" = "old" ]; then
   npm run build_leaderboards -- --year=2022/23 --tier=High;npm run build_leaderboards -- --year=2022/23 --tier=Medium; npm run build_leaderboards -- --year=2022/23 --tier=Low; npm run build_leaderboards -- --year=2022/23 --gender=Women --tier=High;
   npm run build_leaderboards -- --tier=Combo --year=2022/23
   npm run build_leaderboards -- --year=2021/22 --tier=High;npm run build_leaderboards -- --year=2021/22 --tier=Medium; npm run build_leaderboards -- --year=2021/22 --tier=Low; npm run build_leaderboards -- --year=2021/22 --gender=Women --tier=High;
   npm run build_leaderboards -- --tier=Combo --year=2021/22
   npm run build_leaderboards -- --year=2020/21 --tier=High;npm run build_leaderboards -- --year=2020/21 --tier=Medium; npm run build_leaderboards -- --year=2020/21 --tier=Low; npm run build_leaderboards -- --year=2020/21 --gender=Women --tier=High;
   npm run build_leaderboards -- --tier=Combo --year=2020/21
   npm run build_leaderboards -- --tier=High --year=2019/20; npm run build_leaderboards -- --tier=High --year=2018/9;
   npm run build_leaderboards -- --gender=Women --year=2019/20; npm run build_leaderboards -- --gender=Women --year=2018/9; 
   npm run build_leaderboards -- --tier=High --year=Extra; 
fi
