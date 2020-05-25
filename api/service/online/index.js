var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res, next) => {
    console.log("============== getMakeDataDate Call ======================");

    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BION050";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getLatelySalesDate = (req, res) => {
    console.log("============== getLatelySalesDate Call ======================");
    
    let sql = "SELECT TO_CHAR(TO_DATE(MAX(SALEDT), 'YYYYMMDD'), 'YYYY-MM-DD') AS MAXSALEDT FROM BION050 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) AND SAMT > 0";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSaleData = (req, res) => {
    console.log("============== getSaleData Call ======================");
    let month = req.query.month;
    let sql_startdate = req.query.sql_startdate;
    let sql_enddate = req.query.sql_enddate;

    // 당원매출합계, 당월목표, 누계목표대비달성률, 전년동기대비신장률
    let sql = "SELECT A.YM AS YM";
    sql += ", A.PLNAMT  AS PLNAMT";              /*누계목표액*/
    sql += ", A.SAMT  AS SAMT";                /*매출액*/
    sql += ", A.LYSAMT  AS LYSAMT";              /*전년동기매출액*/
    sql += ", B.TOTPLNAMT AS TOTPLNAMT ";  /*목표액*/
    sql += ", CASE WHEN PLNAMT = 0 THEN 0 ELSE ROUND(SAMT/PLNAMT*100) END AS ACC_RATE "; /*달성률*/
    // sql += ", CASE WHEN LYSAMT = 0 THEN 0 ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE ";
    sql += ", CASE WHEN LYSAMT = 0 THEN 0 WHEN LYSAMT < 0 THEN ROUND((SAMT-LYSAMT)/ABS(LYSAMT)*100) ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE "; /*신장율*/
    sql += "FROM ";
    sql += "(SELECT SUBSTR(SALEDT,1,6) AS YM ";
    sql += ", SUM(PLNAMT) AS PLNAMT ";         /*목표액*/
    sql += ", SUM(SAMT) AS SAMT ";             /*매출액*/
    sql += ", SUM(LYSAMT) AS LYSAMT ";         /*전년동기매출액*/
    sql += "FROM BION050 ";
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) ";
    sql += "AND SUBSTR(SALEDT,1,6) = '" + month + "' ";                    /*선택한 월*/
    sql += "AND SALEDT BETWEEN '" + sql_startdate + "' AND '" + sql_enddate + "' ";         /*선택한 월의 1일부터 선택한 날짜까지*/
    // 200206 요청사항으로 인터뷰 제외
    sql += "AND MAINGU <> 'IN' "
    sql += "GROUP BY SUBSTR(SALEDT,1,6) ";
    sql += ") A ";
    sql += ", (SELECT SUBSTR(SALEDT,1,6) AS YM ";
    sql += ", SUM(PLNAMT) AS TOTPLNAMT ";         /*목표액*/
    sql += "FROM BION050 ";
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) ";
    sql += "AND SUBSTR(SALEDT,1,6) = '" + month + "' ";                    /*선택한 월*/
    // 200206 요청사항으로 인터뷰 제외
    sql += "AND MAINGU <> 'IN' "
    sql += "GROUP BY SUBSTR(SALEDT,1,6) ";
    sql += ") B ";
    sql += "WHERE A.YM = B.YM";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSaleDeptCount = (req, res) => {
    console.log("============== getSaleDeptCount Call ======================");

    // 사업부 종류
    let sql = "SELECT CODE, CODNM, SORTORD FROM BICM011 "
    sql += "WHERE GBNCD = 'ON001' "
    // 200206 요청사항으로 인터뷰 제외
    sql += "AND CODE <> 'IN' "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSaleDeptData = (req, res) => {
    console.log("============== getSaleDeptData Call ======================");
    let month = req.query.month;
    let sql_startdate = req.query.sql_startdate;
    let sql_enddate = req.query.sql_enddate;

    // 사업부별
    let sql = "SELECT A.MAINGU AS MAINGU, A.YM";
    sql += ", MS.CODNM"
    sql += ", A.PLNAMT AS PLNAMT";              /*누계목표액*/
    sql += ", A.SAMT AS SAMT";                /*매출액*/
    sql += ", A.LYSAMT AS LYSAMT";              /*전년동기매출액*/
    sql += ", B.TOTPLNAMT AS TOTPLNAMT";  /*목표액*/
    sql += ", CASE WHEN PLNAMT = 0 THEN 0 ELSE ROUND(SAMT/PLNAMT*100) END AS ACC_RATE"; /*달성률*/
    // sql += ", CASE WHEN LYSAMT = 0 THEN 0 ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE"; 
    sql += ", CASE WHEN LYSAMT = 0 THEN 0 WHEN LYSAMT < 0 THEN ROUND((SAMT-LYSAMT)/ABS(LYSAMT)*100) ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE "; /*신장율*/
    sql += ", MS.SORTORD AS MAINSORT ";
    sql += "FROM ";
    sql += "(SELECT MAINGU, SUBSTR(SALEDT,1,6) AS YM ";
    sql += ", SUM(PLNAMT) AS PLNAMT ";         /*목표액*/
    sql += ", SUM(SAMT) AS SAMT ";             /*매출액*/
    sql += ", SUM(LYSAMT) AS LYSAMT ";         /*전년동기매출액*/
    sql += "FROM BION050 ";
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) ";
    sql += "AND SUBSTR(SALEDT,1,6) = '" + month + "' ";                    /*선택한 월*/
    sql += "AND SALEDT BETWEEN '" + sql_startdate + "' AND '" + sql_enddate + "' ";         /*선택한 월의 1일부터 선택한 날짜까지*/
    // 200206 요청사항으로 인터뷰 제외
    sql += "AND MAINGU <> 'IN' "
    sql += "GROUP BY MAINGU, SUBSTR(SALEDT,1,6) ";
    sql += ") A ";
    sql += ", (SELECT MAINGU, SUBSTR(SALEDT,1,6) AS YM ";
    sql += ", SUM(PLNAMT) AS TOTPLNAMT ";         /*목표액*/
    sql += "FROM BION050 ";
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) ";
    sql += "AND SUBSTR(SALEDT,1,6) = '" + month + "' ";                    /*선택한 월*/
    // 200206 요청사항으로 인터뷰 제외
    sql += "AND MAINGU <> 'IN' "
    sql += "GROUP BY MAINGU, SUBSTR(SALEDT,1,6) ";
    sql += ") B ";
    // 200206 요청사항으로 인터뷰 제외
    sql += ", (SELECT CODE, CODNM, SORTORD FROM BICM011 WHERE GBNCD = 'ON001' AND CODE <> 'IN') MS ";
    sql += "WHERE A.MAINGU = B.MAINGU ";
    sql += "AND A.YM = B.YM ";
    sql += "AND A.MAINGU = MS.CODE ";
    sql += "ORDER BY MAINSORT";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSaleBrandCount = (req, res) => {
    console.log("============== getSaleBrandCount Call ======================");

    // 온라인몰 종류
    let sql = "SELECT CODE, CODNM, SORTORD FROM BICM011 "
    sql += "WHERE GBNCD = 'ON002' "
    // 200206 요청사항으로 인터뷰스토어,종합몰 제외
    sql += "AND CODE <> 'IN' "
    sql += "AND CODE <> 'OM' "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSaleBrandData = (req, res) => {
    console.log("============== getSaleBrandData Call ======================");
    let month = req.query.month;
    let sql_enddate = req.query.sql_enddate;

    // 온라인몰별 매출
    let sql = "SELECT A.SUBGU, A.YM ";
    sql += ", SS.CODNM ";
    sql += ", A.PLNAMT ";              /*누계목표액*/
    sql += ", A.SAMT ";                /*매출액*/
    sql += ", A.LYSAMT ";              /*전년동기매출액*/
    sql += ", B.TOTPLNAMT AS TOTPLNAMT ";  /*목표액*/
    sql += ", CASE WHEN PLNAMT = 0 THEN 0 ELSE ROUND(SAMT/PLNAMT*100) END AS ACC_RATE "; /*달성율*/
    // sql += ", CASE WHEN LYSAMT = 0 THEN 0 ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE "; 
    sql += ", CASE WHEN LYSAMT = 0 THEN 0 WHEN LYSAMT < 0 THEN ROUND((SAMT-LYSAMT)/ABS(LYSAMT)*100) ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE "; /*신장율*/
    sql += ", SS.SORTORD AS SUBSORT ";
    sql += "FROM ";
    sql += "(SELECT SUBGU, SUBSTR(SALEDT,1,6) AS YM ";
    sql += ", SUM(PLNAMT) AS PLNAMT ";         /*목표액*/
    sql += ", SUM(SAMT) AS SAMT ";             /*매출액*/
    sql += ", SUM(LYSAMT) AS LYSAMT ";         /*전년동기매출액*/
    sql += "FROM BION050 ";
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) ";
    sql += "AND SUBSTR(SALEDT,1,6) = '" + month + "' ";                    /*선택한 월*/
    sql += "AND SALEDT <='" + sql_enddate + "' ";         /*선택한 월의 1일부터 선택한 날짜까지*/
    // 200206 요청사항으로 인터뷰스토어,종합몰 제외
    sql += "AND MAINGU <> 'IN' "
    sql += "GROUP BY SUBGU, SUBSTR(SALEDT,1,6) ";
    sql += ") A ";
    sql += ", (SELECT SUBGU, SUBSTR(SALEDT,1,6) AS YM ";
    sql += ", SUM(PLNAMT) AS TOTPLNAMT ";         /*목표액*/
    sql += "FROM BION050 ";
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) ";
    sql += "AND SUBSTR(SALEDT,1,6) = '" + month + "' ";                    /*선택한 월*/
    // 200206 요청사항으로 인터뷰스토어,종합몰 제외
    sql += "AND MAINGU <> 'IN' "
    sql += "GROUP BY SUBGU, SUBSTR(SALEDT,1,6) ";
    sql += ") B ";
    // 200206 요청사항으로 인터뷰스토어,종합몰 제외
    sql += ", (SELECT CODE, CODNM, SORTORD FROM BICM011 WHERE GBNCD = 'ON002' AND CODE <> 'IN' AND CODE <> 'OM') SS ";
    sql += "WHERE A.SUBGU = B.SUBGU ";
    sql += "AND A.YM = B.YM ";
    sql += "AND A.SUBGU = SS.CODE ";
    sql += "ORDER BY SUBSORT ";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getBrandDetailData = (req, res) => {
    console.log("============== getBrandDetailData Call ======================");
    let year = req.query.year;
    let yeardate = req.query.yeardate;
    let SUBGU = req.query.SUBGU;
    
    let sql = ""
    /* ONL-02-02 온라인몰별 상세화면 */
    sql += "SELECT SUBGU "
    sql += "  , CASE WHEN GUBUN = 'TOTAL' THEN GUBUN ELSE CODNM END AS GUBUN "
    sql += "  , YM "
    sql += "  , TOTPLNAMT "
    sql += "  , PLNAMT "
    sql += "  , SAMT "
    sql += "  , ACC_RATE "
    sql += "  , LYSAMT "
    sql += "  , UP_RATE "
    sql += "  , SORT "
    sql += "  , NVL(SORTORD,99) AS SORTORD "
    sql += "  FROM "
    sql += "  (SELECT A.SUBGU, A.GUBUN, '" + year + "00' AS YM "
    sql += "    , B.TOTPLNAMT AS TOTPLNAMT "  /*목표액*/
    sql += "    , A.PLNAMT "              /*누계목표액*/
    sql += "    , A.SAMT "                /*매출액*/
    sql += "    , CASE WHEN PLNAMT = 0 THEN 0 ELSE ROUND(SAMT/PLNAMT*100) END AS ACC_RATE " /*달성율*/
    sql += "    , A.LYSAMT "              /*전년동기매출액*/
    // sql += "    , CASE WHEN LYSAMT = 0 THEN 0 ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE " /*신장률*/
    sql += "    , CASE WHEN LYSAMT = 0 THEN 0 WHEN LYSAMT < 0 THEN ROUND((SAMT-LYSAMT)/ABS(LYSAMT)*100) ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE "; /*신장율*/
    sql += "    , 0 AS SORT "
    sql += "  FROM  "
    sql += "  (SELECT GUBUN, SUBGU "
    sql += "      , SUM(PLNAMT) AS PLNAMT "         /*목표액*/
    sql += "      , SUM(SAMT) AS SAMT "             /*매출액*/
    sql += "      , SUM(LYSAMT) AS LYSAMT "         /*전년동기매출액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + yeardate + "' "         /*당해 1월 1일부터 선택한 날짜까지*/
    sql += "    GROUP BY GUBUN, SUBGU "
    sql += "  ) A "
    sql += "  , (SELECT GUBUN, SUBGU "
    sql += "      , SUM(PLNAMT) AS TOTPLNAMT "         /*목표액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + year + "1231' "         /*당해 1월 1일부터 12월 31일까지*/
    sql += "    GROUP BY GUBUN, SUBGU "
    sql += "  ) B "
    sql += "  WHERE A.GUBUN = B.GUBUN "
    sql += "  AND A.SUBGU = B.SUBGU "
    sql += "  AND A.SUBGU = '" + SUBGU + "' "
    sql += "  UNION ALL "
    sql += "  SELECT A.SUBGU, 'TOTAL' AS GUBUN, '" + year + "00' AS YM "
    sql += "    , B.TOTPLNAMT AS TOTPLNAMT "  /*목표액*/
    sql += "    , A.PLNAMT "              /*누계목표액*/
    sql += "    , A.SAMT "                /*매출액*/
    sql += "    , CASE WHEN PLNAMT = 0 THEN 0 ELSE ROUND(SAMT/PLNAMT*100) END AS ACC_RATE " /*달성율*/
    sql += "    , A.LYSAMT "              /*전년동기매출액*/
    // sql += "    , CASE WHEN LYSAMT = 0 THEN 0 ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE " /*신장률*/
    sql += "    , CASE WHEN LYSAMT = 0 THEN 0 WHEN LYSAMT < 0 THEN ROUND((SAMT-LYSAMT)/ABS(LYSAMT)*100) ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE "; /*신장율*/
    sql += "    , 1 AS SORT "
    sql += "  FROM  "
    sql += "  (SELECT SUBGU "
    sql += "      , SUM(PLNAMT) AS PLNAMT "         /*목표액*/
    sql += "      , SUM(SAMT) AS SAMT "             /*매출액*/
    sql += "      , SUM(LYSAMT) AS LYSAMT "         /*전년동기매출액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + yeardate + "' "         /*당해 1월 1일부터 선택한 날짜까지*/
    sql += "    GROUP BY SUBGU "
    sql += "  ) A "
    sql += "  , (SELECT SUBGU "
    sql += "      , SUM(PLNAMT) AS TOTPLNAMT "         /*목표액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + year + "1231' "         /*당해 1월 1일부터 12월 31일까지*/
    sql += "    GROUP BY SUBGU "
    sql += "  ) B "
    sql += "  WHERE A.SUBGU = B.SUBGU "
    sql += "  AND A.SUBGU = '" + SUBGU + "' "
    sql += "  UNION ALL "   
    sql += "  SELECT A.SUBGU, A.GUBUN, A.YM "
    sql += "    , B.TOTPLNAMT AS TOTPLNAMT "  /*목표액*/
    sql += "    , A.PLNAMT "              /*누계목표액*/
    sql += "    , A.SAMT "                /*매출액*/
    sql += "    , CASE WHEN PLNAMT = 0 THEN 0 ELSE ROUND(SAMT/PLNAMT*100) END AS ACC_RATE " /*달성율*/
    sql += "    , A.LYSAMT "              /*전년동기매출액*/
    // sql += "    , CASE WHEN LYSAMT = 0 THEN 0 ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE " /*신장률*/
    sql += "    , CASE WHEN LYSAMT = 0 THEN 0 WHEN LYSAMT < 0 THEN ROUND((SAMT-LYSAMT)/ABS(LYSAMT)*100) ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE "; /*신장율*/
    sql += "    , 0 AS SORT "
    sql += "  FROM  "
    sql += "  (SELECT GUBUN, SUBGU, SUBSTR(SALEDT,1,6) AS YM "
    sql += "      , SUM(PLNAMT) AS PLNAMT "         /*목표액*/
    sql += "      , SUM(SAMT) AS SAMT "             /*매출액*/
    sql += "      , SUM(LYSAMT) AS LYSAMT "         /*전년동기매출액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + yeardate + "' "         /*당해 1월 1일부터 선택한 날짜까지*/
    sql += "    GROUP BY GUBUN, SUBGU, SUBSTR(SALEDT,1,6) "
    sql += "  ) A "
    sql += "  , (SELECT GUBUN, SUBGU, SUBSTR(SALEDT,1,6) AS YM "
    sql += "      , SUM(PLNAMT) AS TOTPLNAMT "         /*목표액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + year + "1231' "         /*당해 1월 1일부터 12월 31일까지*/
    sql += "    GROUP BY GUBUN, SUBGU, SUBSTR(SALEDT,1,6) "
    sql += "  ) B "
    sql += "  WHERE A.GUBUN = B.GUBUN "
    sql += "  AND A.SUBGU = B.SUBGU "
    sql += "  AND A.YM = B.YM "
    sql += "  AND A.SUBGU = '" + SUBGU + "' "
    sql += "  UNION ALL "
    sql += "  SELECT A.SUBGU, 'TOTAL' AS GUBUN, A.YM "
    sql += "    , B.TOTPLNAMT AS TOTPLNAMT "  /*목표액*/
    sql += "    , A.PLNAMT "              /*누계목표액*/
    sql += "    , A.SAMT "                /*매출액*/
    sql += "    , CASE WHEN PLNAMT = 0 THEN 0 ELSE ROUND(SAMT/PLNAMT*100) END AS ACC_RATE " /*달성율*/
    sql += "    , A.LYSAMT "              /*전년동기매출액*/
    // sql += "    , CASE WHEN LYSAMT = 0 THEN 0 ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE " /*신장률*/
    sql += "    , CASE WHEN LYSAMT = 0 THEN 0 WHEN LYSAMT < 0 THEN ROUND((SAMT-LYSAMT)/ABS(LYSAMT)*100) ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE "; /*신장율*/
    sql += "    , 1 AS SORT "
    sql += "  FROM  "
    sql += "  (SELECT SUBGU, SUBSTR(SALEDT,1,6) AS YM "
    sql += "      , SUM(PLNAMT) AS PLNAMT "         /*목표액*/
    sql += "      , SUM(SAMT) AS SAMT "             /*매출액*/
    sql += "      , SUM(LYSAMT) AS LYSAMT "         /*전년동기매출액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + yeardate + "' "         /*당해 1월 1일부터 선택한 날짜까지*/
    sql += "    GROUP BY SUBGU, SUBSTR(SALEDT,1,6) "
    sql += "  ) A "
    sql += "  , (SELECT SUBGU, SUBSTR(SALEDT,1,6) AS YM "
    sql += "      , SUM(PLNAMT) AS TOTPLNAMT "         /*목표액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + year + "1231' "         /*당해 1월 1일부터 12월 31일까지*/
    sql += "    GROUP BY SUBGU, SUBSTR(SALEDT,1,6) "
    sql += "  ) B "
    sql += "  WHERE A.SUBGU = B.SUBGU "
    sql += "  AND A.YM = B.YM "
    sql += "  AND A.SUBGU = '" + SUBGU + "' "
    sql += "  ) X "
    sql += "  LEFT OUTER JOIN (SELECT CODE, CODNM, SORTORD FROM BICM011 WHERE GBNCD = 'ON003') SS "
    sql += "    ON X.GUBUN = SS.CODE "
    sql += "ORDER BY YM, SORTORD, SORT "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getMallDetailData = (req, res) => {
    console.log("============== getMallDetailData Call ======================");
    let year = req.query.year;
    let yeardate = req.query.yeardate;
    let MAINGU = req.query.MAINGU;
    
    let sql = ""
    /* ONL-01-02 사업부별 상세화면 */
    sql += "SELECT MAINGU "
    sql += "  , CASE WHEN SUBGU = 'TOTAL' THEN SUBGU ELSE CODNM END AS SUBGU "
    sql += "  , YM "
    sql += "  , TOTPLNAMT "
    sql += "  , PLNAMT "
    sql += "  , SAMT "
    sql += "  , ACC_RATE "
    sql += "  , LYSAMT "
    sql += "  , UP_RATE "
    sql += "  , SORT "
    sql += "  , NVL(SORTORD,99) AS SORTORD "
    sql += "  FROM "
    sql += "  (SELECT A.MAINGU, A.SUBGU, '" + year + "00' AS YM "
    sql += "    , B.TOTPLNAMT AS TOTPLNAMT "  /*목표액*/
    sql += "    , A.PLNAMT "              /*누계목표액*/
    sql += "    , A.SAMT "                /*매출액*/
    sql += "    , CASE WHEN PLNAMT = 0 THEN 0 ELSE ROUND(SAMT/PLNAMT*100) END AS ACC_RATE " /*달성율*/
    sql += "    , A.LYSAMT "              /*전년동기매출액*/
    // sql += "    , CASE WHEN LYSAMT = 0 THEN 0 ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE " /*신장률*/
    sql += "    , CASE WHEN LYSAMT = 0 THEN 0 WHEN LYSAMT < 0 THEN ROUND((SAMT-LYSAMT)/ABS(LYSAMT)*100) ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE "; /*신장율*/
    sql += "    , 0 AS SORT "
    sql += "  FROM  "
    sql += "  (SELECT MAINGU, SUBGU "
    sql += "      , SUM(PLNAMT) AS PLNAMT "         /*목표액*/
    sql += "      , SUM(SAMT) AS SAMT "             /*매출액*/
    sql += "      , SUM(LYSAMT) AS LYSAMT "         /*전년동기매출액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + yeardate + "' "         /*당해 1월 1일부터 선택한 날짜까지*/
    sql += "    GROUP BY MAINGU, SUBGU "
    sql += "  ) A "
    sql += "  , (SELECT MAINGU, SUBGU "
    sql += "      , SUM(PLNAMT) AS TOTPLNAMT "         /*목표액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + year + "1231' "         /*당해 1월 1일부터 12월 31일까지*/
    sql += "    GROUP BY MAINGU, SUBGU "
    sql += "  ) B "
    sql += "  WHERE A.MAINGU = B.MAINGU "
    sql += "  AND A.SUBGU = B.SUBGU "
    sql += "  AND A.MAINGU = '" + MAINGU + "' "
    sql += "  AND A.SUBGU <> 'OM' "
    sql += "  UNION ALL "
    sql += "  SELECT A.MAINGU, 'TOTAL' AS SUBGU, '" + year + "00' AS YM "
    sql += "    , B.TOTPLNAMT AS TOTPLNAMT "  /*목표액*/
    sql += "    , A.PLNAMT "              /*누계목표액*/
    sql += "    , A.SAMT "                /*매출액*/
    sql += "    , CASE WHEN PLNAMT = 0 THEN 0 ELSE ROUND(SAMT/PLNAMT*100) END AS ACC_RATE " /*달성율*/
    sql += "    , A.LYSAMT "              /*전년동기매출액*/
    // sql += "    , CASE WHEN LYSAMT = 0 THEN 0 ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE " /*신장률*/
    sql += "    , CASE WHEN LYSAMT = 0 THEN 0 WHEN LYSAMT < 0 THEN ROUND((SAMT-LYSAMT)/ABS(LYSAMT)*100) ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE "; /*신장율*/
    sql += "    , 1 AS SORT "
    sql += "  FROM  "
    sql += "  (SELECT MAINGU "
    sql += "      , SUM(PLNAMT) AS PLNAMT "         /*목표액*/
    sql += "      , SUM(SAMT) AS SAMT "             /*매출액*/
    sql += "      , SUM(LYSAMT) AS LYSAMT "         /*전년동기매출액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + yeardate + "' "         /*당해 1월 1일부터 선택한 날짜까지*/
    sql += "    GROUP BY MAINGU "
    sql += "  ) A "
    sql += "  , (SELECT MAINGU "
    sql += "      , SUM(PLNAMT) AS TOTPLNAMT "         /*목표액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + year + "1231' "         /*당해 1월 1일부터 12월 31일까지*/
    sql += "    GROUP BY MAINGU "
    sql += "  ) B "
    sql += "  WHERE A.MAINGU = B.MAINGU "
    sql += "  AND A.MAINGU = '" + MAINGU + "' "
    sql += "  UNION ALL "
    sql += "  SELECT A.MAINGU, A.SUBGU, A.YM "
    sql += "    , B.TOTPLNAMT AS TOTPLNAMT "  /*목표액*/
    sql += "    , A.PLNAMT "              /*누계목표액*/
    sql += "    , A.SAMT "                /*매출액*/
    sql += "    , CASE WHEN PLNAMT = 0 THEN 0 ELSE ROUND(SAMT/PLNAMT*100) END AS ACC_RATE " /*달성율*/
    sql += "    , A.LYSAMT "              /*전년동기매출액*/
    // sql += "    , CASE WHEN LYSAMT = 0 THEN 0 ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE " /*신장률*/
    sql += "    , CASE WHEN LYSAMT = 0 THEN 0 WHEN LYSAMT < 0 THEN ROUND((SAMT-LYSAMT)/ABS(LYSAMT)*100) ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE "; /*신장율*/
    sql += "    , 0 AS SORT "
    sql += "  FROM " 
    sql += "  (SELECT MAINGU, SUBGU, SUBSTR(SALEDT,1,6) AS YM "
    sql += "      , SUM(PLNAMT) AS PLNAMT "         /*목표액*/
    sql += "      , SUM(SAMT) AS SAMT "             /*매출액*/
    sql += "      , SUM(LYSAMT) AS LYSAMT "         /*전년동기매출액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + yeardate + "' "         /*당해 1월 1일부터 선택한 날짜까지*/
    sql += "    GROUP BY MAINGU, SUBGU, SUBSTR(SALEDT,1,6) "
    sql += "  ) A "
    sql += "  , (SELECT MAINGU, SUBGU, SUBSTR(SALEDT,1,6) AS YM "
    sql += "      , SUM(PLNAMT) AS TOTPLNAMT "         /*목표액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + year + "1231' "         /*당해 1월 1일부터 12월 31일까지*/
    sql += "    GROUP BY MAINGU, SUBGU, SUBSTR(SALEDT,1,6) "
    sql += "  ) B "
    sql += "  WHERE A.MAINGU = B.MAINGU "
    sql += "  AND A.SUBGU = B.SUBGU "
    sql += "  AND A.YM = B.YM "
    sql += "  AND A.MAINGU = '" + MAINGU + "' "
    sql += "  AND A.SUBGU <> 'OM' "
    sql += "  UNION ALL "
    sql += "  SELECT A.MAINGU, 'TOTAL' AS SUBGU, A.YM "
    sql += "    , B.TOTPLNAMT AS TOTPLNAMT "  /*목표액*/
    sql += "    , A.PLNAMT "              /*누계목표액*/
    sql += "    , A.SAMT "                /*매출액*/
    sql += "    , CASE WHEN PLNAMT = 0 THEN 0 ELSE ROUND(SAMT/PLNAMT*100) END AS ACC_RATE " /*달성율*/
    sql += "    , A.LYSAMT "              /*전년동기매출액*/
    // sql += "    , CASE WHEN LYSAMT = 0 THEN 0 ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE " /*신장률*/
    sql += "    , CASE WHEN LYSAMT = 0 THEN 0 WHEN LYSAMT < 0 THEN ROUND((SAMT-LYSAMT)/ABS(LYSAMT)*100) ELSE ROUND((SAMT-LYSAMT)/LYSAMT*100) END AS UP_RATE "; /*신장율*/
    sql += "    , 1 AS SORT "
    sql += "  FROM  "
    sql += "  (SELECT MAINGU, SUBSTR(SALEDT,1,6) AS YM "
    sql += "      , SUM(PLNAMT) AS PLNAMT "         /*목표액*/
    sql += "      , SUM(SAMT) AS SAMT "             /*매출액*/
    sql += "      , SUM(LYSAMT) AS LYSAMT "         /*전년동기매출액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + yeardate + "' "         /*당해 1월 1일부터 선택한 날짜까지*/
    sql += "    GROUP BY MAINGU, SUBSTR(SALEDT,1,6) "
    sql += "  ) A "
    sql += "  , (SELECT MAINGU, SUBSTR(SALEDT,1,6) AS YM "
    sql += "      , SUM(PLNAMT) AS TOTPLNAMT "         /*목표액*/
    sql += "    FROM BION050 "
    sql += "    WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) "
    sql += "    AND SALEDT BETWEEN '" + year + "0101' AND '" + year + "1231' "         /*당해 1월 1일부터 12월 31일까지*/
    sql += "    GROUP BY MAINGU, SUBSTR(SALEDT,1,6) "
    sql += "  ) B "
    sql += "  WHERE A.MAINGU = B.MAINGU "
    sql += "  AND A.YM = B.YM "
    sql += "  AND A.MAINGU = '" + MAINGU + "' "
    sql += "  ) X "
    sql += "  LEFT OUTER JOIN (SELECT CODE, CODNM, SORTORD FROM BICM011 WHERE GBNCD = 'ON002') SS "
    sql += "    ON X.SUBGU = SS.CODE "
    sql += "ORDER BY YM, SORTORD, SORT "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

// 브랜드별 온라인 매출 추이(올해)
exports.getSaleByBrandList = (req, res) => {
    console.log("============== getSaleByBrandList Call ======================");
    let year = parseInt(req.query.year);
    
    let sql = "SELECT MAINGU, SORT, ";
    sql += "ROUND(SUM(JASASILAMT)/1000000,0) AS JASASILAMT, ";
    sql += "ROUND(SUM(OUTSILAMT)/1000000,0) AS OUTSILAMT, ";
    sql += "ROUND(SUM(TOTSILAMT)/1000000,0) AS TOTSILAMT ";
    sql += "FROM ( ";
    sql += "SELECT MAINGU, SUBGU, ";
    sql += "CASE WHEN MAINGU = 'MI' THEN SAMT ";
    sql += "     WHEN MAINGU = 'MO' THEN SAMT ";
    sql += "     WHEN MAINGU = 'IT' AND SUBGU = 'IT' THEN SAMT ";
    sql += "     WHEN MAINGU = 'IN' AND SUBGU = 'IN' THEN SAMT ";
    sql += "ELSE 0 END JASASILAMT, ";
    sql += "CASE WHEN MAINGU = 'IT' AND SUBGU <> 'IT' THEN SAMT ";
    sql += "     WHEN MAINGU = 'IN' AND SUBGU <> 'IN' THEN SAMT ";
    sql += "ELSE 0 END OUTSILAMT, ";
    sql += "CASE WHEN MAINGU = 'MI' THEN SAMT ";
    sql += "     WHEN MAINGU = 'MO' THEN SAMT ";
    sql += "     WHEN MAINGU = 'IT' THEN SAMT ";
    sql += "     WHEN MAINGU = 'IN' THEN SAMT ";
    sql += "ELSE 0 END TOTSILAMT, ";
    sql += "DECODE(MAINGU,'MI',1,'MO',4,'IT',2,'IN',5,'SO',3) SORT ";
    sql += "FROM BION050 ";
    sql += "WHERE SALEDT BETWEEN '" + year + "0101' AND TO_CHAR(SYSDATE, 'YYYYMMDD') ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050) ";
    sql += ") ";
    sql += "GROUP BY MAINGU,SORT ";
    sql += "ORDER BY SORT ";
    //console.log(sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

// 잇미샤 온/오프 판매비중(올해)
exports.getITOnOffSaleList = (req, res) => {
    console.log("============== getITOnOffSaleList Call ======================");
    let year = parseInt(req.query.year);
    
    let sql = "SELECT ROUND(AMT/1000, 0) AS AMT, ITEM ";
    sql += "FROM   (SELECT SUM(SILAMT) AS AMT, ITEM ";
    sql += "        FROM   (SELECT SILAMT, '00' AS ITEM ";
    sql += "                FROM   BISY021 ";
    sql += "                WHERE  INOUTDT BETWEEN '" + year + "0101' AND TO_CHAR(SYSDATE, 'YYYYMMDD') ";
    sql += "                AND    SUCD = '4' ";
    sql += "                AND    BRCD = 'IT' ) ";
    sql += "        GROUP BY ITEM ";
    // sql += "        UNION ALL ";
    // sql += "        SELECT SUM(NAVER) AS AMT, ITEM ";
    // sql += "        FROM   (SELECT 0 AS NAVER, '11' AS ITEM ";
    // sql += "                FROM   BION050 ";
    // sql += "                WHERE  SALEDT BETWEEN '" + year + "0101' AND TO_CHAR(SYSDATE, 'YYYYMMDD') ";
    // sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) ";
    // sql += "                        FROM   BION050) ) ";
    // sql += "        GROUP BY ITEM ";
    sql += "        UNION ALL ";
    sql += "        SELECT SUM(DEPAMT) AS AMT, ITEM ";
    sql += "        FROM   (SELECT CASE WHEN MAINGU = 'IT' AND SUBGU = 'ITDM' THEN SAMT ELSE 0 END DEPAMT, '22' AS ITEM ";
    sql += "                FROM   BION050 ";
    sql += "                WHERE  SALEDT BETWEEN '" + year + "0101' AND TO_CHAR(SYSDATE, 'YYYYMMDD') ";
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) ";
    sql += "                        FROM   BION050) ) ";
    sql += "        GROUP BY ITEM ";
    sql += "        UNION ALL ";
    sql += "        SELECT SUM(ONAMT) AS AMT, ITEM ";
    sql += "        FROM   (SELECT CASE WHEN MAINGU = 'IT' AND SUBGU IN ('ITOM', 'IT') THEN SAMT ELSE 0 END ONAMT, '33' AS ITEM ";
    sql += "                FROM   BION050 ";
    sql += "                WHERE  SALEDT BETWEEN '" + year + "0101' AND TO_CHAR(SYSDATE, 'YYYYMMDD') ";
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) ";
    sql += "                        FROM   BION050)) ";
    sql += "        GROUP BY ITEM) ";
    
    //console.log(sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

// 월별 매출 실적
exports.getSaleByBrdDetailData = (req, res) => {
    console.log("============== getSaleByBrdDetailData Call ======================");
    let year = parseInt(req.query.year);
    
    let sql = "SELECT BRCD, SORT, ";
    sql += "        SUM(JASASILAMT1) AS JASASILAMT1, SUM(OUTSILAMT1) AS OUTSILAMT1, SUM(TOTSILAMT1) AS TOTSILAMT1 , ";
    sql += "        SUM(JASASILAMT2) AS JASASILAMT2, SUM(OUTSILAMT2) AS OUTSILAMT2, SUM(TOTSILAMT2) AS TOTSILAMT2 , ";
    sql += "        SUM(JASASILAMT3) AS JASASILAMT3, SUM(OUTSILAMT3) AS OUTSILAMT3, SUM(TOTSILAMT3) AS TOTSILAMT3 , ";
    sql += "        SUM(JASASILAMT4) AS JASASILAMT4, SUM(OUTSILAMT4) AS OUTSILAMT4, SUM(TOTSILAMT4) AS TOTSILAMT4 , ";
    sql += "        SUM(JASASILAMT5) AS JASASILAMT5, SUM(OUTSILAMT5) AS OUTSILAMT5, SUM(TOTSILAMT5) AS TOTSILAMT5 , ";
    sql += "        SUM(JASASILAMT6) AS JASASILAMT6, SUM(OUTSILAMT6) AS OUTSILAMT6, SUM(TOTSILAMT6) AS TOTSILAMT6 , ";
    sql += "        SUM(JASASILAMT7) AS JASASILAMT7, SUM(OUTSILAMT7) AS OUTSILAMT7, SUM(TOTSILAMT7) AS TOTSILAMT7 , ";
    sql += "        SUM(JASASILAMT8) AS JASASILAMT8, SUM(OUTSILAMT8) AS OUTSILAMT8, SUM(TOTSILAMT8) AS TOTSILAMT8 , ";
    sql += "        SUM(JASASILAMT9) AS JASASILAMT9, SUM(OUTSILAMT9) AS OUTSILAMT9, SUM(TOTSILAMT9) AS TOTSILAMT9 , ";
    sql += "        SUM(JASASILAMT10) AS JASASILAMT10, SUM(OUTSILAMT10) AS OUTSILAMT10, SUM(TOTSILAMT10) AS TOTSILAMT10 , ";
    sql += "        SUM(JASASILAMT11) AS JASASILAMT11, SUM(OUTSILAMT11) AS OUTSILAMT11, SUM(TOTSILAMT11) AS TOTSILAMT11 , ";
    sql += "        SUM(JASASILAMT12) AS JASASILAMT12, SUM(OUTSILAMT12) AS OUTSILAMT12, SUM(TOTSILAMT12) AS TOTSILAMT12 ";
    sql += "FROM   (SELECT BRCD, ";
    sql += "            DECODE(SALEDT, '" + year + "01', JASASILAMT) JASASILAMT1, ";
    sql += "            DECODE(SALEDT, '" + year + "01', OUTSILAMT) OUTSILAMT1, ";
    sql += "            DECODE(SALEDT, '" + year + "01', TOTSILAMT) TOTSILAMT1, ";
    sql += "            DECODE(SALEDT, '" + year + "02', JASASILAMT) JASASILAMT2, ";
    sql += "            DECODE(SALEDT, '" + year + "02', OUTSILAMT) OUTSILAMT2, ";
    sql += "            DECODE(SALEDT, '" + year + "02', TOTSILAMT) TOTSILAMT2, ";
    sql += "            DECODE(SALEDT, '" + year + "03', JASASILAMT) JASASILAMT3, ";
    sql += "            DECODE(SALEDT, '" + year + "03', OUTSILAMT) OUTSILAMT3, ";
    sql += "            DECODE(SALEDT, '" + year + "03', TOTSILAMT) TOTSILAMT3, ";
    sql += "            DECODE(SALEDT, '" + year + "04', JASASILAMT) JASASILAMT4, ";
    sql += "            DECODE(SALEDT, '" + year + "04', OUTSILAMT) OUTSILAMT4, ";
    sql += "            DECODE(SALEDT, '" + year + "04', TOTSILAMT) TOTSILAMT4, ";
    sql += "            DECODE(SALEDT, '" + year + "05', JASASILAMT) JASASILAMT5, ";
    sql += "            DECODE(SALEDT, '" + year + "05', OUTSILAMT) OUTSILAMT5, ";
    sql += "            DECODE(SALEDT, '" + year + "05', TOTSILAMT) TOTSILAMT5, ";
    sql += "            DECODE(SALEDT, '" + year + "06', JASASILAMT) JASASILAMT6, ";
    sql += "            DECODE(SALEDT, '" + year + "06', OUTSILAMT) OUTSILAMT6, ";
    sql += "            DECODE(SALEDT, '" + year + "06', TOTSILAMT) TOTSILAMT6, ";
    sql += "            DECODE(SALEDT, '" + year + "07', JASASILAMT) JASASILAMT7, ";
    sql += "            DECODE(SALEDT, '" + year + "07', OUTSILAMT) OUTSILAMT7, ";
    sql += "            DECODE(SALEDT, '" + year + "07', TOTSILAMT) TOTSILAMT7, ";
    sql += "            DECODE(SALEDT, '" + year + "08', JASASILAMT) JASASILAMT8, ";
    sql += "            DECODE(SALEDT, '" + year + "08', OUTSILAMT) OUTSILAMT8, ";
    sql += "            DECODE(SALEDT, '" + year + "08', TOTSILAMT) TOTSILAMT8, ";
    sql += "            DECODE(SALEDT, '" + year + "09', JASASILAMT) JASASILAMT9, ";
    sql += "            DECODE(SALEDT, '" + year + "09', OUTSILAMT) OUTSILAMT9, ";
    sql += "            DECODE(SALEDT, '" + year + "09', TOTSILAMT) TOTSILAMT9, ";
    sql += "            DECODE(SALEDT, '" + year + "10', JASASILAMT) JASASILAMT10, ";
    sql += "            DECODE(SALEDT, '" + year + "10', OUTSILAMT) OUTSILAMT10, ";
    sql += "            DECODE(SALEDT, '" + year + "10', TOTSILAMT) TOTSILAMT10, ";
    sql += "            DECODE(SALEDT, '" + year + "11', JASASILAMT) JASASILAMT11, ";
    sql += "            DECODE(SALEDT, '" + year + "11', OUTSILAMT) OUTSILAMT11, ";
    sql += "            DECODE(SALEDT, '" + year + "11', TOTSILAMT) TOTSILAMT11, ";
    sql += "            DECODE(SALEDT, '" + year + "12', JASASILAMT) JASASILAMT12, ";
    sql += "            DECODE(SALEDT, '" + year + "12', OUTSILAMT) OUTSILAMT12, ";
    sql += "            DECODE(SALEDT, '" + year + "12', TOTSILAMT) TOTSILAMT12, ";
    sql += "            SORT ";
    sql += "        FROM   (SELECT BRCD, SALEDT, SORT, ";
    sql += "                    ROUND(SUM(JASASILAMT)/1000000, 0) AS JASASILAMT, ";
    sql += "                    ROUND(SUM(OUTSILAMT)/1000000, 0) AS OUTSILAMT, ";
    sql += "                    ROUND(SUM(TOTSILAMT)/1000000, 0) AS TOTSILAMT ";
    sql += "                FROM   (SELECT BRCD , ";
    sql += "                            SUBSTR(SALEDT, 1, 6) AS SALEDT , ";
    sql += "                            CASE ";
    sql += "                                WHEN VDCD IN ('MI615', 'MID85', 'IT519', 'IT520', 'IN804', 'SO885')  ";
    sql += "                                THEN SILAMT ELSE 0  ";
    sql += "                            END JASASILAMT , ";
    sql += "                            CASE ";
    sql += "                                WHEN VDCD IN ('IT515', 'IT518', 'IT524')  ";
    sql += "                                THEN SILAMT WHEN SUCD = '23' AND VDCD <> 'IN804'  ";
    sql += "                                            THEN SILAMT ELSE 0 ";
    sql += "                            END OUTSILAMT , ";
    sql += "                            CASE ";
    sql += "                                WHEN VDCD IN ('MI615', 'MID85', 'IT519', 'IT520', 'IN804', 'SO885', 'IT515', 'IT518', 'IT524') ";
    sql += "                                THEN SILAMT WHEN SUCD = '23'  ";
    sql += "                                            THEN SILAMT ELSE 0 ";
    sql += "                            END TOTSILAMT , ";
    sql += "                            DECODE(BRCD, 'MI', 1, 'MO', 4, 'IT', 2, 'IN', 5, 'SO', 3) SORT ";
    sql += "                        FROM   BION060 ";
    sql += "                        WHERE SALEDT BETWEEN SUBSTR(TO_CHAR(SYSDATE,'YYYYMMDD'),1,4)||'0101' AND TO_CHAR(ADD_TIME(SYSDATE, '0/0/-1 0:0:0'),'YYYYMMDD') ";
    sql += "                        AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION060) ) ";
    sql += "                GROUP BY BRCD, SALEDT, SORT )) ";
    sql += "GROUP BY BRCD, SORT ";
    sql += "ORDER BY SORT ";
    //console.log(sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

//잇미샤 온/오프 판매비중(월별)
exports.getITOnOffDetailData = (req, res) => {
    console.log("============== getITOnOffDetailData Call ======================");
    let year = parseInt(req.query.year);
    
    let sql = "SELECT ITEM, ";
    sql += "       SUM(AMT1) AS AMT1, ";
    sql += "       SUM(AMT2) AS AMT2, ";
    sql += "       SUM(AMT3) AS AMT3, ";
    sql += "       SUM(AMT4) AS AMT4, ";
    sql += "       SUM(AMT5) AS AMT5, ";
    sql += "       SUM(AMT6) AS AMT6, ";
    sql += "       SUM(AMT7) AS AMT7, ";
    sql += "       SUM(AMT8) AS AMT8, ";
    sql += "       SUM(AMT9) AS AMT9, ";
    sql += "       SUM(AMT10) AS AMT10, ";
    sql += "       SUM(AMT11) AS AMT11, ";
    sql += "       SUM(AMT12) AS AMT12 ";
    sql += "FROM   (SELECT SALEDT, ITEM, ";
    sql += "               DECODE(SALEDT, '" + year + "01', AMT) AS AMT1, ";
    sql += "               DECODE(SALEDT, '" + year + "02', AMT) AS AMT2, ";
    sql += "               DECODE(SALEDT, '" + year + "03', AMT) AS AMT3, ";
    sql += "               DECODE(SALEDT, '" + year + "04', AMT) AS AMT4, ";
    sql += "               DECODE(SALEDT, '" + year + "05', AMT) AS AMT5, ";
    sql += "               DECODE(SALEDT, '" + year + "06', AMT) AS AMT6, ";
    sql += "               DECODE(SALEDT, '" + year + "07', AMT) AS AMT7, ";
    sql += "               DECODE(SALEDT, '" + year + "08', AMT) AS AMT8, ";
    sql += "               DECODE(SALEDT, '" + year + "09', AMT) AS AMT9, ";
    sql += "               DECODE(SALEDT, '" + year + "010', AMT) AS AMT10, ";
    sql += "               DECODE(SALEDT, '" + year + "011', AMT) AS AMT11, ";
    sql += "               DECODE(SALEDT, '" + year + "012', AMT) AS AMT12 ";
    sql += "        FROM   (SELECT ROUND(AMT/1000, 0) AS AMT, SALEDT, ITEM ";
    sql += "                FROM   (SELECT SUM(SILAMT) AS AMT, SALEDT, ITEM ";
    sql += "                        FROM   (SELECT SILAMT, '00' AS ITEM, SUBSTR(INOUTDT, 1, 6) AS SALEDT ";
    sql += "                                FROM   BISY021 ";
    sql += "                                WHERE  INOUTDT BETWEEN '" + year + "0101' AND TO_CHAR(SYSDATE, 'YYYYMMDD') ";
    sql += "                                AND    SUCD = '4' ";
    sql += "                                AND    BRCD = 'IT' ) ";
    sql += "                        GROUP BY ITEM, SALEDT ";
    sql += "                        UNION ALL ";
    sql += "                        SELECT SUM(DEPAMT) AS AMT, SALEDT, ITEM ";
    sql += "                        FROM   (SELECT CASE WHEN MAINGU = 'IT' AND SUBGU = 'ITDM' THEN SAMT ELSE 0 END DEPAMT , ";
    sql += "                                       '22' AS ITEM, SUBSTR(SALEDT, 1, 6) AS SALEDT ";
    sql += "                                FROM   BION050 ";
    sql += "                                WHERE  SALEDT BETWEEN '" + year + "0101' AND TO_CHAR(SYSDATE, 'YYYYMMDD') ";
    sql += "                                AND    CREATEDATE = (SELECT MAX(CREATEDATE) ";
    sql += "                                        FROM   BION050) ) ";
    sql += "                        GROUP BY ITEM, SALEDT ";
    sql += "                        UNION ALL ";
    sql += "                        SELECT SUM(ONAMT) AS AMT, SALEDT, ITEM ";
    sql += "                        FROM   (SELECT CASE WHEN MAINGU = 'IT' AND SUBGU IN ('ITOM', 'IT') THEN SAMT ELSE 0 END ONAMT , ";
    sql += "                                       '33' AS ITEM , SUBSTR(SALEDT, 1, 6) AS SALEDT ";
    sql += "                                FROM   BION050 ";
    sql += "                                WHERE  SALEDT BETWEEN '" + year + "0101' AND TO_CHAR(SYSDATE, 'YYYYMMDD') ";
    sql += "                                AND    CREATEDATE = (SELECT MAX(CREATEDATE) ";
    sql += "                                        FROM   BION050)) ";
    sql += "                        GROUP BY ITEM, SALEDT))) ";
    sql += "GROUP BY ITEM ORDER BY ITEM ";
    //console.log(sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

// 매출 실적
exports.getBaseSaleList = (req, res) => {
    console.log("============== getBaseSaleList Call ======================");
    let selectDate = parseInt(req.query.selectDate);
    
    let sql = "SELECT BRCD, SORT,";
    sql += "       CASE ";
    sql += "         WHEN DAYTOT = 0 THEN 0 ELSE ROUND(DAYTOT/1000, 0) ";
    sql += "       END DAYTOT, ";
    sql += "       CASE WHEN DAYJASA = 0 THEN 0 ELSE ROUND(DAYJASA/1000, 0) END DAYJASA, ";
    sql += "       CASE ";
    sql += "         WHEN DAYOUT = 0 THEN 0 ELSE ROUND(DAYOUT/1000, 0) ";
    sql += "       END DAYOUT, ";
    sql += "       CASE ";
    sql += "         WHEN (DAYJASA+DAYOUT) = 0 THEN 0 ELSE ROUND((DAYJASA+DAYOUT)/DAYTOT, 2)*100 ";
    sql += "       END DAYRAT, ";
    sql += "       CASE ";
    sql += "         WHEN MONTOT = 0 THEN 0 ELSE ROUND(MONTOT/1000, 0) ";
    sql += "       END MONTOT, ";
    sql += "       CASE ";
    sql += "         WHEN MONJASA = 0 THEN 0 ELSE ROUND(MONJASA/1000, 0) ";
    sql += "       END MONJASA, ";
    sql += "       CASE ";
    sql += "         WHEN MONOUT = 0 THEN 0 ELSE ROUND(MONOUT/1000, 0) ";
    sql += "       END MONOUT, ";
    sql += "       CASE ";
    sql += "         WHEN (MONJASA+MONOUT) = 0 THEN 0 ELSE ROUND((MONJASA+MONOUT)/MONTOT, 2)*100 ";
    sql += "       END MONRAT, ";
    sql += "       CASE ";
    sql += "         WHEN YEARTOT = 0 THEN 0 ELSE ROUND(YEARTOT/1000, 0) ";
    sql += "       END YEARTOT , ";
    sql += "       CASE ";
    sql += "         WHEN YEARJASA = 0 THEN 0 ELSE ROUND(YEARJASA/1000, 0) ";
    sql += "       END YEARJASA , ";
    sql += "       CASE ";
    sql += "         WHEN YEAROUT = 0 THEN 0 ELSE ROUND(YEAROUT/1000, 0) ";
    sql += "       END YEAROUT , ";
    sql += "       CASE ";
    sql += "         WHEN (YEARJASA+YEAROUT) = 0 THEN 0 ";
    sql += "         ELSE ROUND((YEARJASA+YEAROUT)/YEARTOT, 2)*100 ";
    sql += "       END YEARRAT ";
    sql += "FROM   (SELECT BRCD, SORT , ";
    sql += "               SUM(DAYTOT) AS DAYTOT , SUM(DAYJASA) AS DAYJASA , SUM(DAYOUT) AS DAYOUT , ";
    sql += "               SUM(MONTOT) AS MONTOT , SUM(MONJASA) AS MONJASA , SUM(MONOUT) AS MONOUT , ";
    sql += "               SUM(YEARTOT) AS YEARTOT , SUM(YEARJASA) AS YEARJASA , SUM(YEAROUT) AS YEAROUT ";
    sql += "        FROM   (SELECT BRCD , SILAMT AS DAYTOT , ";
    sql += "                       CASE ";
    sql += "                         WHEN VDCD IN ('MI615', 'MID85', 'IT519', 'IT520', 'IN804', 'SO885') ";
    sql += "                         THEN SILAMT ELSE 0 ";
    sql += "                       END DAYJASA, ";
    sql += "                       CASE ";
    sql += "                         WHEN VDCD IN ('IT515', 'IT518', 'IT524') ";
    sql += "                         THEN SILAMT WHEN SUCD = '23' AND VDCD <> 'IN804' THEN SILAMT ELSE 0 ";
    sql += "                       END DAYOUT, ";
    sql += "                       0 AS MONTOT, 0 AS MONJASA, 0 AS MONOUT, ";
    sql += "                       0 AS YEARTOT , 0 AS YEARJASA , 0 AS YEAROUT , ";
    sql += "                       DECODE(BRCD, 'MI', '1', 'MO', '4', 'IT', '2', 'IN', '5', 'SO', '3') AS SORT ";
    sql += "                FROM   BION060 ";
    sql += "                WHERE  SALEDT = '"+selectDate+"'";
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION060) ";
    sql += "                UNION ALL ";
    sql += "                SELECT BRCD, 0 AS DAYTOT, 0 AS DAYJASAS, 0 AS DAYOUT, SILAMT AS MONTOT, ";
    sql += "                       CASE ";
    sql += "                         WHEN VDCD IN ('MI615', 'MID85', 'IT519', 'IT520', 'IN804', 'SO885') ";
    sql += "                         THEN SILAMT ELSE 0 ";
    sql += "                       END MONJASA, ";
    sql += "                       CASE ";
    sql += "                         WHEN VDCD IN ('IT515', 'IT518', 'IT524') THEN SILAMT ";
    sql += "                         WHEN SUCD = '23' AND VDCD <> 'IN804' THEN SILAMT ELSE 0 ";
    sql += "                       END MONOUT, ";
    sql += "                       0 AS YEARTOT , 0 AS YEARJASA , 0 AS YEAROUT , ";
    sql += "                       DECODE(BRCD, 'MI', '1', 'MO', '4', 'IT', '2', 'IN', '5', 'SO', '3') AS SORT ";
    sql += "                FROM   BION060 ";
    sql += "                WHERE SALEDT BETWEEN SUBSTR(TO_CHAR(SYSDATE,'YYYYMMDD'),1,6)||'01' AND TO_CHAR(ADD_TIME(SYSDATE, '0/0/-1 0:0:0'),'YYYYMMDD') ";
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION060) ";
    sql += "                UNION ALL ";
    sql += "                SELECT BRCD , 0 AS DAYTOT , 0 AS DAYJASAS , 0 AS DAYOUT , ";
    sql += "                       0 AS MONTOT , 0 AS MONJASA , 0 AS MONOUT , ";
    sql += "                       SILAMT AS YEARTOT , ";
    sql += "                       CASE ";
    sql += "                         WHEN VDCD IN ('MI615', 'MID85', 'IT519', 'IT520', 'IN804', 'SO885') ";
    sql += "                         THEN SILAMT ELSE 0 ";
    sql += "                       END YEARJASA , ";
    sql += "                       CASE ";
    sql += "                         WHEN VDCD IN ('IT515', 'IT518', 'IT524') ";
    sql += "                         THEN SILAMT WHEN SUCD = '23' AND VDCD <> 'IN804' ";
    sql += "                                     THEN SILAMT ELSE 0 ";
    sql += "                       END YEAROUT , ";
    sql += "                       DECODE(BRCD, 'MI', '1', 'MO', '4', 'IT', '2', 'IN', '5', 'SO', '3') AS SORT ";
    sql += "                FROM   BION060 ";
    sql += "                WHERE SALEDT BETWEEN SUBSTR(TO_CHAR(SYSDATE,'YYYYMMDD'),1,4)||'0101' AND TO_CHAR(ADD_TIME(SYSDATE, '0/0/-1 0:0:0'),'YYYYMMDD') ";
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION060)) ";
    sql += "        WHERE  BRCD <> 'SO' ";
    sql += "        GROUP BY BRCD, SORT ";
    sql += "        ORDER BY SORT) ";
    console.log("getBaseSaleList >>> " + sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

// 일별 매출 추이
exports.getDailySaleList = (req, res) => {
    console.log("============== getDailySaleList Call ======================");
    let start_date = req.query.start_date;
    let end_date = req.query.end_date;
    console.log("!! DailyDate >> "+ start_date+" / "+ end_date)

    let sql = "SELECT TO_CHAR(TO_DATE(SALEDT, 'YYYYMMDD'), 'DD') SALEDT, ";
    sql += "       ROUND(NVL(SUM(TOTSILAMT), 0)/1000, 0) AS TOTSILAMT , ";
    sql += "       ROUND(NVL(SUM(MISILAMT), 0)/1000, 0) AS MISILAMT , ";
    sql += "       ROUND(NVL(SUM(MOSILAMT), 0)/1000, 0) AS MOSILAMT , ";
    sql += "       ROUND(NVL(SUM(ITSILAMT), 0)/1000, 0) AS ITSILAMT , ";
    sql += "       ROUND(NVL(SUM(INSILAMT), 0)/1000, 0) AS INSILAMT, ";
    sql += "        ";
    sql += "       ROUND(NVL(SUM(TOTDAYTOT), 0)/1000, 0) AS TOTDAYTOT , ";
    sql += "       ROUND(NVL(SUM(MIDAYTOT), 0)/1000, 0) AS MIDAYTOT , ";
    sql += "       ROUND(NVL(SUM(MODAYTOT), 0)/1000, 0) AS MODAYTOT, ";
    sql += "       ROUND(NVL(SUM(ITDAYTOT), 0)/1000, 0) AS ITDAYTOT, ";
    sql += "       ROUND(NVL(SUM(INDAYTOT), 0)/1000, 0) AS INDAYTOT ";
    sql += "FROM   (SELECT SALEDT , ";
    sql += "               SILAMT TOTSILAMT, ";
    sql += "               DECODE(BRCD, 'MI', SILAMT) MISILAMT , ";
    sql += "               DECODE(BRCD, 'MO', SILAMT) MOSILAMT , ";
    sql += "               DECODE(BRCD, 'IT', SILAMT) ITSILAMT , ";
    sql += "               DECODE(BRCD, 'IN', SILAMT) INSILAMT, ";
               
    sql += "               DAYTOT TOTDAYTOT, ";
    sql += "               DECODE(BRCD, 'MI', DAYTOT) MIDAYTOT, ";
    sql += "               DECODE(BRCD, 'MO', DAYTOT) MODAYTOT, ";
    sql += "               DECODE(BRCD, 'IT', DAYTOT) ITDAYTOT, ";
    sql += "               DECODE(BRCD, 'IN', DAYTOT) INDAYTOT ";
    sql += "        FROM   (SELECT BRCD, ";
    sql += "                       SALEDT, ";
    sql += "                       SUM(SILAMT) AS SILAMT, ";
    sql += "                       SUM(DAYTOT) AS DAYTOT ";
    sql += "                FROM   (SELECT BRCD , ";
    sql += "                               SALEDT , ";
    sql += "                               CASE ";
    sql += "                                WHEN VDCD IN ('MI615', 'MID85', 'IT519', 'IT520', 'IN804', 'SO885', 'IT515', 'IT518', 'IT524') THEN SILAMT  ";
    sql += "                                WHEN SUCD = '23' AND VDCD <> 'IN804' THEN SILAMT  ";
    sql += "                               ELSE 0 END SILAMT, ";
    sql += "                               SILAMT AS DAYTOT ";
    sql += "                        FROM   BION060 ";
    sql += "                        WHERE  SALEDT BETWEEN '"+start_date+"' AND '"+end_date+"' ";
    sql += "                        AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM   BION060) ) ";
    sql += "                WHERE BRCD <> 'SO' ";
    sql += "                GROUP BY BRCD, SALEDT  ";
    sql += "                ) ";
    sql += "       ) ";
    sql += "GROUP BY SALEDT ";
    sql += "ORDER BY SALEDT ";
  
    console.log("getDailySaleList ===========> " + sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

// 월별 매출 추이
exports.getMonthlySaleList = (req, res) => {
    console.log("============== getMonthlySaleList Call ======================");
    let start_date = req.query.start_date;
    let end_date = req.query.end_date;
    console.log("!! MonthlyDate >> "+ start_date+" / "+ end_date)

    let sql = "SELECT TO_CHAR(TO_DATE(SALEDT, 'YYYYMM'), 'MM') SALEDT, ";
    sql += "        ROUND(NVL(SUM(TOTSILAMT), 0)/1000000, 0) AS TOTSILAMT , ";   
    sql += "        ROUND(NVL(SUM(MISILAMT), 0)/1000000, 0) AS MISILAMT , ";
    sql += "        ROUND(NVL(SUM(MOSILAMT), 0)/1000000, 0) AS MOSILAMT , ";
    sql += "        ROUND(NVL(SUM(ITSILAMT), 0)/1000000, 0) AS ITSILAMT , ";
    sql += "        ROUND(NVL(SUM(INSILAMT), 0)/1000000, 0) AS INSILAMT ";
    sql += "FROM   (SELECT SALEDT , ";
    sql += "            SILAMT TOTSILAMT, "; 
    sql += "            DECODE(BRCD, 'MI', SILAMT) MISILAMT , ";
    sql += "            DECODE(BRCD, 'MO', SILAMT) MOSILAMT , ";
    sql += "            DECODE(BRCD, 'IT', SILAMT) ITSILAMT , ";
    sql += "            DECODE(BRCD, 'IN', SILAMT) INSILAMT ";
    sql += "        FROM   (SELECT BRCD, SALEDT, SUM(SILAMT) AS SILAMT ";
    sql += "                FROM   (SELECT BRCD , ";
    sql += "                            SUBSTR(SALEDT, 1, 6) AS SALEDT , ";
    sql += "                            CASE ";
    sql += "                                WHEN VDCD IN ('MI615', 'MID85', 'IT519', 'IT520', 'IN804', 'SO885', 'IT515', 'IT518', 'IT524') ";
    sql += "                                THEN SILAMT WHEN SUCD = '23' THEN SILAMT ELSE 0 ";
    sql += "                            END SILAMT ";
    sql += "                        FROM   BION060 ";
    sql += "                        WHERE  SALEDT BETWEEN '"+start_date+"' AND '"+end_date+"' ";
    sql += "                        AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION060) ) ";
    sql += "                GROUP BY BRCD, SALEDT )) ";
    sql += "GROUP BY SALEDT ORDER BY SALEDT ";
  
    console.log("getMonthlySaleList========>"+sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

// 일별 매출 현황
exports.getDailySaleList_POP = (req, res) => {
    console.log("============== getDailySaleList_POP Call ======================");
    let month = req.query.month;
    let date = req.query.date;
    
    let start_date = date.substr(0, 4) + "" + month + "01";
    let end_date = Number(month) != Number(moment().format("MM")) ? moment(start_date, "YYYYMMDD").endOf('month').format("YYYYMMDD") : date;

    console.log("!! DailyDate >> "+ month + " / " + moment().format("MM") + " / " + start_date + " / " + end_date);

    let sql = "SELECT DAY, ";
    sql += "    SUM(TDAYTOT) AS TDAYTOT, ";
    sql += "    SUM(TDAYON) AS TDAYON, ";
    sql += "    ROUND(SUM(TDAYON)/SUM(TDAYTOT)*100, 2) AS TDAYRAT, ";
    sql += "    SUM(MIDAYTOT) AS MIDAYTOT, ";
    sql += "    SUM(MIDAYON) AS MIDAYON, ";
    sql += "    SUM(MIDAYRAT) AS MIDAYRAT, ";
    sql += "    SUM(MODAYTOT) AS MODAYTOT, ";
    sql += "    SUM(MODAYON) AS MODAYON, ";
    sql += "    SUM(MODAYRAT) AS MODAYRAT, ";
    sql += "    SUM(ITDAYTOT) AS ITDAYTOT, ";
    sql += "    SUM(ITDAYON) AS ITDAYON, ";
    sql += "    SUM(ITDAYRAT) AS ITDAYRAT, ";
    sql += "    SUM(INDAYTOT) AS INDAYTOT, ";
    sql += "    SUM(INDAYON) AS INDAYON, ";
    sql += "    SUM(INDAYRAT) AS INDAYRAT ";
    sql += " FROM   (SELECT DAY, ";
    sql += "            CASE WHEN BRCD IN ('MI', 'MO', 'IT', 'IN') THEN DAYTOT END AS TDAYTOT, ";
    sql += "            CASE WHEN BRCD IN ('MI', 'MO', 'IT', 'IN') THEN DAYON END AS TDAYON, ";
    sql += "            CASE WHEN BRCD = 'MI' THEN DAYTOT END AS MIDAYTOT, ";
    sql += "            CASE WHEN BRCD = 'MI' THEN DAYON END AS MIDAYON, ";
    sql += "            CASE WHEN BRCD = 'MI' THEN DAYRAT END AS MIDAYRAT, ";
    sql += "            CASE WHEN BRCD = 'MO' THEN DAYTOT END AS MODAYTOT, ";
    sql += "            CASE WHEN BRCD = 'MO' THEN DAYON END AS MODAYON, ";
    sql += "            CASE WHEN BRCD = 'MO' THEN DAYRAT END AS MODAYRAT, ";
    sql += "            CASE WHEN BRCD = 'IT' THEN DAYTOT END AS ITDAYTOT, ";
    sql += "            CASE WHEN BRCD = 'IT' THEN DAYON END AS ITDAYON, ";
    sql += "            CASE WHEN BRCD = 'IT' THEN DAYRAT END AS ITDAYRAT, ";
    sql += "            CASE WHEN BRCD = 'IN' THEN DAYTOT END AS INDAYTOT, ";
    sql += "            CASE WHEN BRCD = 'IN' THEN DAYON END AS INDAYON, ";
    sql += "            CASE WHEN BRCD = 'IN' THEN DAYRAT END AS INDAYRAT ";
    sql += "     FROM   (SELECT BRCD, ";
    sql += "                    DAY, ";
    sql += "                    CASE WHEN DAYTOT = 0 THEN 0 ";
    sql += "                    ELSE ROUND(DAYTOT/1000, 0) END DAYTOT, ";
    sql += "                    CASE WHEN DAYON = 0 THEN 0 ";
    sql += "                    ELSE ROUND(DAYON/1000, 0) END DAYON, ";
    sql += "                    CASE WHEN DAYON = 0 THEN 0 ";
    sql += "                    ELSE ROUND(DAYON/DAYTOT*100, 2) END DAYRAT ";
    sql += "             FROM   (SELECT BRCD, ";
    sql += "                            DAY, ";
    sql += "                            NVL(SUM(DAYTOT), 0) AS DAYTOT , ";
    sql += "                            NVL(SUM(DAYJASA), 0)+NVL(SUM(DAYOUT), 0) AS DAYON ";
    sql += "                     FROM   (SELECT BRCD, ";
    sql += "                                    SUBSTR(SALEDT, 7, 2) AS DAY, ";
    sql += "                                    SILAMT AS DAYTOT, ";
    sql += "                                    CASE  ";
    sql += "                                     WHEN VDCD IN ('MI615', 'MID85', 'IT519', 'IT520', 'IN804', 'SO885') ";
    sql += "                                     THEN SILAMT ";
    sql += "                                    END DAYJASA, ";
    sql += "                                    CASE WHEN VDCD IN ('IT515', 'IT518', 'IT524') THEN SILAMT ";
    sql += "                                         WHEN SUCD = '23' AND    VDCD <> 'IN804' THEN SILAMT ";
    sql += "                                    END DAYOUT ";
    sql += "                             FROM   BION060 ";
    sql += "                             WHERE  SALEDT BETWEEN '" + start_date + "' AND '" + end_date + "' ";
    sql += "                             AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM   BION060) ) ";
    sql += "                     WHERE  BRCD <> 'SO' ";
    sql += "                     GROUP BY BRCD, DAY ";
    sql += "                     ) ";
    sql += "            ) ";
    sql += "    ) ";
    sql += " GROUP BY DAY ";
    sql += " ORDER BY DAY";
    console.log("getDailySaleList >>> ", sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};