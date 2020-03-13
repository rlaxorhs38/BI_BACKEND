var axios = require('axios');
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
    sql += "DECODE(MAINGU,'MI',1,'MO',2,'IT',3,'IN',4,'SO',5) SORT ";
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

//브랜드별 온라인 매출 추이(월별)
exports.getSaleByBrdDetailData = (req, res) => {
    console.log("============== getSaleByBrdDetailData Call ======================");
    let year = parseInt(req.query.year);
    
    let sql = "SELECT MAINGU,SORT,SUM(JASASILAMT1) AS JASASILAMT1,SUM(OUTSILAMT1) AS OUTSILAMT1,SUM(TOTSILAMT1) AS TOTSILAMT1 ";
    sql += "      , SUM(JASASILAMT2) AS JASASILAMT2,SUM(OUTSILAMT2) AS OUTSILAMT2,SUM(TOTSILAMT2) AS TOTSILAMT2 ";
    sql += "      , SUM(JASASILAMT3) AS JASASILAMT3,SUM(OUTSILAMT3) AS OUTSILAMT3,SUM(TOTSILAMT3) AS TOTSILAMT3 ";
    sql += "      , SUM(JASASILAMT4) AS JASASILAMT4,SUM(OUTSILAMT4) AS OUTSILAMT4,SUM(TOTSILAMT4) AS TOTSILAMT4 ";
    sql += "      , SUM(JASASILAMT5) AS JASASILAMT5,SUM(OUTSILAMT5) AS OUTSILAMT5,SUM(TOTSILAMT5) AS TOTSILAMT5 ";
    sql += "      , SUM(JASASILAMT6) AS JASASILAMT6,SUM(OUTSILAMT6) AS OUTSILAMT6,SUM(TOTSILAMT6) AS TOTSILAMT6 ";
    sql += "      , SUM(JASASILAMT7) AS JASASILAMT7,SUM(OUTSILAMT7) AS OUTSILAMT7,SUM(TOTSILAMT7) AS TOTSILAMT7 ";
    sql += "      , SUM(JASASILAMT8) AS JASASILAMT8,SUM(OUTSILAMT8) AS OUTSILAMT8,SUM(TOTSILAMT8) AS TOTSILAMT8 ";
    sql += "      , SUM(JASASILAMT9) AS JASASILAMT9,SUM(OUTSILAMT9) AS OUTSILAMT9,SUM(TOTSILAMT9) AS TOTSILAMT9 ";
    sql += "      , SUM(JASASILAMT10) AS JASASILAMT10,SUM(OUTSILAMT10) AS OUTSILAMT10,SUM(TOTSILAMT10) AS TOTSILAMT10 ";
    sql += "      , SUM(JASASILAMT11) AS JASASILAMT11,SUM(OUTSILAMT11) AS OUTSILAMT10,SUM(TOTSILAMT11) AS TOTSILAMT11 ";
    sql += "      , SUM(JASASILAMT12) AS JASASILAMT12,SUM(OUTSILAMT12) AS OUTSILAMT12,SUM(TOTSILAMT12) AS TOTSILAMT12 ";
    sql += "FROM( ";
    sql += "SELECT MAINGU, ";
    sql += "      DECODE(SALEDT,'" + year + "01',JASASILAMT) JASASILAMT1, ";
    sql += "      DECODE(SALEDT,'" + year + "01',OUTSILAMT)  OUTSILAMT1, ";
    sql += "      DECODE(SALEDT,'" + year + "01',TOTSILAMT)  TOTSILAMT1, ";
    sql += "      DECODE(SALEDT,'" + year + "02',JASASILAMT) JASASILAMT2, ";
    sql += "      DECODE(SALEDT,'" + year + "02',OUTSILAMT)  OUTSILAMT2, ";
    sql += "      DECODE(SALEDT,'" + year + "02',TOTSILAMT)  TOTSILAMT2,";
    sql += "      DECODE(SALEDT,'" + year + "03',JASASILAMT) JASASILAMT3, ";
    sql += "      DECODE(SALEDT,'" + year + "03',OUTSILAMT)  OUTSILAMT3, ";
    sql += "      DECODE(SALEDT,'" + year + "03',TOTSILAMT)  TOTSILAMT3, ";
    sql += "      DECODE(SALEDT,'" + year + "04',JASASILAMT) JASASILAMT4, ";
    sql += "      DECODE(SALEDT,'" + year + "04',OUTSILAMT)  OUTSILAMT4, ";
    sql += "      DECODE(SALEDT,'" + year + "04',TOTSILAMT)  TOTSILAMT4, ";
    sql += "      DECODE(SALEDT,'" + year + "05',JASASILAMT) JASASILAMT5, ";
    sql += "      DECODE(SALEDT,'" + year + "05',OUTSILAMT)  OUTSILAMT5, ";
    sql += "      DECODE(SALEDT,'" + year + "05',TOTSILAMT)  TOTSILAMT5, ";
    sql += "      DECODE(SALEDT,'" + year + "06',JASASILAMT) JASASILAMT6, ";
    sql += "      DECODE(SALEDT,'" + year + "06',OUTSILAMT)  OUTSILAMT6, ";
    sql += "      DECODE(SALEDT,'" + year + "06',TOTSILAMT)  TOTSILAMT6, ";
    sql += "      DECODE(SALEDT,'" + year + "07',JASASILAMT) JASASILAMT7, ";
    sql += "      DECODE(SALEDT,'" + year + "07',OUTSILAMT)  OUTSILAMT7, ";
    sql += "      DECODE(SALEDT,'" + year + "07',TOTSILAMT)  TOTSILAMT7, ";
    sql += "      DECODE(SALEDT,'" + year + "08',JASASILAMT) JASASILAMT8, ";
    sql += "      DECODE(SALEDT,'" + year + "08',OUTSILAMT)  OUTSILAMT8, ";
    sql += "      DECODE(SALEDT,'" + year + "08',TOTSILAMT)  TOTSILAMT8, ";
    sql += "      DECODE(SALEDT,'" + year + "09',JASASILAMT) JASASILAMT9, ";
    sql += "      DECODE(SALEDT,'" + year + "09',OUTSILAMT)  OUTSILAMT9, ";
    sql += "      DECODE(SALEDT,'" + year + "09',TOTSILAMT)  TOTSILAMT9, ";
    sql += "      DECODE(SALEDT,'" + year + "10',JASASILAMT) JASASILAMT10, ";
    sql += "      DECODE(SALEDT,'" + year + "10',OUTSILAMT)  OUTSILAMT10, ";
    sql += "      DECODE(SALEDT,'" + year + "10',TOTSILAMT)  TOTSILAMT10, ";
    sql += "      DECODE(SALEDT,'" + year + "11',JASASILAMT) JASASILAMT11, ";
    sql += "      DECODE(SALEDT,'" + year + "11',OUTSILAMT)  OUTSILAMT11, ";
    sql += "      DECODE(SALEDT,'" + year + "11',TOTSILAMT)  TOTSILAMT11, ";
    sql += "      DECODE(SALEDT,'" + year + "12',JASASILAMT) JASASILAMT12, ";
    sql += "      DECODE(SALEDT,'" + year + "12',OUTSILAMT)  OUTSILAMT12, ";
    sql += "      DECODE(SALEDT,'" + year + "12',TOTSILAMT)  TOTSILAMT12, ";
    sql += "      SORT ";
    sql += "FROM ( ";
    sql += "SELECT MAINGU, SALEDT, SORT, ";
    sql += "      ROUND(SUM(JASASILAMT)/1000000,0) AS JASASILAMT, ";
    sql += "      ROUND(SUM(OUTSILAMT)/1000000,0) AS OUTSILAMT, ";
    sql += "      ROUND(SUM(TOTSILAMT)/1000000,0) AS TOTSILAMT ";
    sql += "FROM( ";
    sql += "SELECT MAINGU, SUBSTR(SALEDT,1,6) AS SALEDT, ";
    sql += "      CASE WHEN MAINGU = 'MI' THEN SAMT ";
    sql += "          WHEN MAINGU = 'MO' THEN SAMT ";
    sql += "          WHEN MAINGU = 'IT' AND SUBGU = 'IT' THEN SAMT ";
    sql += "          WHEN MAINGU = 'IN' AND SUBGU = 'IN' THEN SAMT ";
    sql += "      ELSE 0 END JASASILAMT, ";
    sql += "      CASE WHEN MAINGU = 'IT' AND SUBGU <> 'IT' THEN SAMT ";
    sql += "          WHEN MAINGU = 'IN' AND SUBGU <> 'IN' THEN SAMT ";
    sql += "      ELSE 0 END OUTSILAMT, ";
    sql += "      CASE WHEN MAINGU = 'MI' THEN SAMT ";
    sql += "          WHEN MAINGU = 'MO' THEN SAMT ";
    sql += "          WHEN MAINGU = 'IT' THEN SAMT ";
    sql += "          WHEN MAINGU = 'IN' THEN SAMT ";
    sql += "      ELSE 0 END TOTSILAMT, ";
    sql += "      DECODE(MAINGU,'MI',1,'MO',2,'IT',3,'IN',4,'SO',5) SORT ";
    sql += "FROM BION050 ";
    sql += "WHERE SALEDT BETWEEN '" + year + "0101' AND TO_CHAR(SYSDATE, 'YYYYMMDD') ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BION050)) ";
    sql += "GROUP BY MAINGU,SALEDT,SORT ";
    sql += ")) GROUP BY MAINGU,SORT ";
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
    sql += "               DECODE(SALEDT, '202001', AMT) AS AMT1, ";
    sql += "               DECODE(SALEDT, '202002', AMT) AS AMT2, ";
    sql += "               DECODE(SALEDT, '202003', AMT) AS AMT3, ";
    sql += "               DECODE(SALEDT, '202004', AMT) AS AMT4, ";
    sql += "               DECODE(SALEDT, '202005', AMT) AS AMT5, ";
    sql += "               DECODE(SALEDT, '202006', AMT) AS AMT6, ";
    sql += "               DECODE(SALEDT, '202007', AMT) AS AMT7, ";
    sql += "               DECODE(SALEDT, '202008', AMT) AS AMT8, ";
    sql += "               DECODE(SALEDT, '202009', AMT) AS AMT9, ";
    sql += "               DECODE(SALEDT, '2020010', AMT) AS AMT10, ";
    sql += "               DECODE(SALEDT, '2020011', AMT) AS AMT11, ";
    sql += "               DECODE(SALEDT, '2020012', AMT) AS AMT12 ";
    sql += "        FROM   (SELECT ROUND(AMT/1000, 0) AS AMT, SALEDT, ITEM ";
    sql += "                FROM   (SELECT SUM(SILAMT) AS AMT, SALEDT, ITEM ";
    sql += "                        FROM   (SELECT SILAMT, '00' AS ITEM, SUBSTR(INOUTDT, 1, 6) AS SALEDT ";
    sql += "                                FROM   BISY021 ";
    sql += "                                WHERE  INOUTDT BETWEEN '20200101' AND TO_CHAR(SYSDATE, 'YYYYMMDD') ";
    sql += "                                AND    SUCD = '4' ";
    sql += "                                AND    BRCD = 'IT' ) ";
    sql += "                        GROUP BY ITEM, SALEDT ";
    sql += "                        UNION ALL ";
    sql += "                        SELECT SUM(DEPAMT) AS AMT, SALEDT, ITEM ";
    sql += "                        FROM   (SELECT CASE WHEN MAINGU = 'IT' AND SUBGU = 'ITDM' THEN SAMT ELSE 0 END DEPAMT , ";
    sql += "                                       '22' AS ITEM, SUBSTR(SALEDT, 1, 6) AS SALEDT ";
    sql += "                                FROM   BION050 ";
    sql += "                                WHERE  SALEDT BETWEEN '20200101' AND TO_CHAR(SYSDATE, 'YYYYMMDD') ";
    sql += "                                AND    CREATEDATE = (SELECT MAX(CREATEDATE) ";
    sql += "                                        FROM   BION050) ) ";
    sql += "                        GROUP BY ITEM, SALEDT ";
    sql += "                        UNION ALL ";
    sql += "                        SELECT SUM(ONAMT) AS AMT, SALEDT, ITEM ";
    sql += "                        FROM   (SELECT CASE WHEN MAINGU = 'IT' AND SUBGU IN ('ITOM', 'IT') THEN SAMT ELSE 0 END ONAMT , ";
    sql += "                                       '33' AS ITEM , SUBSTR(SALEDT, 1, 6) AS SALEDT ";
    sql += "                                FROM   BION050 ";
    sql += "                                WHERE  SALEDT BETWEEN '20200101' AND TO_CHAR(SYSDATE, 'YYYYMMDD') ";
    sql += "                                AND    CREATEDATE = (SELECT MAX(CREATEDATE) ";
    sql += "                                        FROM   BION050)) ";
    sql += "                        GROUP BY ITEM, SALEDT))) ";
    sql += "GROUP BY ITEM ORDER BY ITEM ";
    //console.log(sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};