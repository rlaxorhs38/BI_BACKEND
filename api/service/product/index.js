var axios = require('axios');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res, next) => {
    console.log("============== getMakeDataDate Call ======================");

    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BIPD050";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getProData = (req, res, next) => {
    console.log("============== getProData Call ======================");
    let tabType = req.query.tabType;
    let CODETab = req.query.CODETab;
    let yearCode = req.query.yearCode;

    let sql = "SELECT SEASON ";
    sql += ", SUM(YSMODEL)  AS YSMODEL ";  /*계획 M*/
    sql += ", SUM(YSQTY)    AS YSQTY ";    /*계획 수량*/
    sql += ", SUM(YSAMT)    AS YSAMT ";   /*계획 금액*/
    sql += ", SUM(FMODEL)   AS FMODEL ";   /*FIX M*/
    sql += ", SUM(FQTY)     AS FQTY ";     /*FIX 수량*/
    sql += ", SUM(FAMT)     AS FAMT ";     /*FIX 금액*/
    sql += ", CASE WHEN SUM(YSAMT) > 0 THEN ROUND(SUM(FAMT)/SUM(YSAMT)*100,1) ELSE 0 END AS FIXPER "; /*계획대비FIX율*/
    sql += ", SUM(PLNMODEL) AS PLNMODEL "; /*투입 M*/
    sql += ", SUM(PLNQTY)   AS PLNQTY ";   /*투입 수량*/
    sql += ", SUM(PLNAMT)   AS PLNAMT ";   /*투입 금액*/
    sql += ", CASE WHEN SUM(FAMT) > 0 THEN ROUND(SUM(PLNAMT)/SUM(FAMT)*100,1) ELSE 0 END AS PLNPER "; /*FIX대비 투입율*/
    sql += ", SUM(INMODEL)  AS INMODEL ";  /*입고 M*/
    sql += ", SUM(INQTY)    AS INQTY ";    /*입고 수량*/
    sql += ", SUM(INAMT)    AS INAMT ";    /*입고 금액*/
    sql += ", CASE WHEN SUM(FAMT) > 0 THEN ROUND(SUM(INAMT)/SUM(FAMT)*100,1) ELSE 0 END AS INPER "; /*FIX대비 입고율*/
    sql += ", SUM(SMODEL)   AS SMODEL ";   /*판매 M*/
    sql += ", SUM(SQTY)     AS SQTY ";     /*판매 수량*/
    sql += ", SUM(SAMT)     AS SAMT ";     /*판매 금액*/
    sql += ", CASE WHEN SUM(INQTY) > 0 THEN ROUND(SUM(SQTY)/SUM(INQTY)*100,1) ELSE 0 END AS SPERQTY "; /*입고대비 판매율(수량기준)*/
    sql += ", CASE WHEN SUM(INAMT) > 0 THEN ROUND(SUM(SAMT)/SUM(INAMT)*100,1) ELSE 0 END AS SPERAMT "; /*입고대비 판매율(금액기준)*/
    sql += ", SUM(STOCKQTY) AS STOCKQTY "; /*재고 수량*/
    sql += ", SUM(STOCKAMT) AS STOCKAMT "; /*재고 금액*/
    sql += "FROM BIPD050 ";
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPD050) ";
    sql += "AND " + tabType + " = '" + CODETab + "' "
    sql += "AND SEASON LIKE '%" + yearCode + "%' ";
    sql += "GROUP BY SEASON ";
    sql += "ORDER BY SEASON";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getData = (req, res, next) => {
    console.log("============== getData Call ======================");
    let tabType = req.query.tabType;
    let CODETab = req.query.CODETab;
    let yearCode = req.query.yearCode;
    let season = req.query.season;
    let YSCD = req.query.YSCD;

      /* PRO-01-02 */
      let sql = "SELECT * FROM ( "
      sql += "SELECT SEASON AS YSGU "
      sql += ", SUM(YSMODEL)  AS YSMODEL "  /*계획 M*/
      sql += ", SUM(YSQTY)    AS YSQTY "    /*계획 수량*/
      sql += ", SUM(YSAMT)    AS YSAMT "    /*계획 금액*/
      sql += ", SUM(FMODEL)   AS FMODEL "   /*FIX M*/
      sql += ", SUM(FQTY)     AS FQTY "     /*FIX 수량*/
      sql += ", SUM(FAMT)     AS FAMT "     /*FIX 금액*/
      sql += ", CASE WHEN SUM(YSAMT) > 0 THEN ROUND(SUM(FAMT)/SUM(YSAMT)*100,1) ELSE 0 END AS FIXPER " /*계획대비FIX율*/
      sql += ", SUM(PLNMODEL) AS PLNMODEL " /*투입 M*/
      sql += ", SUM(PLNQTY)   AS PLNQTY "   /*투입 수량*/
      sql += ", SUM(PLNAMT)   AS PLNAMT "   /*투입 금액*/
      sql += ", CASE WHEN SUM(FAMT) > 0 THEN ROUND(SUM(PLNAMT)/SUM(FAMT)*100,1) ELSE 0 END AS PLNPER " /*FIX대비 투입율*/
      sql += ", SUM(INMODEL)  AS INMODEL "  /*입고 M*/
      sql += ", SUM(INQTY)    AS INQTY "    /*입고 수량*/
      sql += ", SUM(INAMT)    AS INAMT "    /*입고 금액*/
      sql += ", CASE WHEN SUM(FAMT) > 0 THEN ROUND(SUM(INAMT)/SUM(FAMT)*100,1) ELSE 0 END AS INPER " /*FIX대비 입고율*/
      sql += ", SUM(SMODEL)   AS SMODEL "   /*판매 M*/
      sql += ", SUM(SQTY)     AS SQTY "     /*판매 수량*/
      sql += ", SUM(SAMT)     AS SAMT "     /*판매 금액*/
      sql += ", CASE WHEN SUM(INQTY) > 0 THEN ROUND(SUM(SQTY)/SUM(INQTY)*100,1) ELSE 0 END AS SPERQTY " /*입고대비 판매율(수량기준)*/
      sql += ", CASE WHEN SUM(INAMT) > 0 THEN ROUND(SUM(SAMT)/SUM(INAMT)*100,1) ELSE 0 END AS SPERAMT " /*입고대비 판매율(금액기준)*/
      sql += ", SUM(STOCKQTY) AS STOCKQTY " /*재고 수량*/
      sql += ", SUM(STOCKAMT) AS STOCKAMT " /*재고 금액*/
      sql += "FROM BIPD050 "
      sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPD050) "
      sql += "AND " + tabType + " = '" + CODETab + "' "
    //   sql += "AND SEASON = '" + yearCode + addZero(season + 1) + "' "
      sql += "AND SEASON LIKE '%" + yearCode + "%' ";
      sql += "GROUP BY SEASON "
      sql += ") "
      sql += "WHERE YSGU = '" + yearCode + season + "' "
      sql += "UNION ALL "
      sql += "SELECT * FROM ( "
      sql += "SELECT "
      sql += "YSCD AS YSGU "        /*년월*/
      sql += ", SUM(YSMODEL)  AS YSMODEL "  /*계획 M*/
      sql += ", SUM(YSQTY)    AS YSQTY "    /*계획 수량*/
      sql += ", SUM(YSAMT)    AS YSAMT "    /*계획 금액*/
      sql += ", SUM(FMODEL)   AS FMODEL "   /*FIX M*/
      sql += ", SUM(FQTY)     AS FQTY "     /*FIX 수량*/
      sql += ", SUM(FAMT)     AS FAMT "     /*FIX 금액*/
      sql += ", CASE WHEN SUM(YSAMT) > 0 THEN ROUND(SUM(FAMT)/SUM(YSAMT)*100,1) ELSE 0 END AS FIXPER " /*계획대비FIX율*/
      sql += ", SUM(PLNMODEL) AS PLNMODEL " /*투입 M*/
      sql += ", SUM(PLNQTY)   AS PLNQTY "   /*투입 수량*/
      sql += ", SUM(PLNAMT)   AS PLNAMT "   /*투입 금액*/
      sql += ", CASE WHEN SUM(FAMT) = 0 THEN 0 ELSE ROUND(SUM(PLNAMT)/SUM(FAMT)*100,1) END AS PLNPER " /*FIX대비 투입율*/
      sql += ", SUM(INMODEL)  AS INMODEL "  /*입고 M*/
      sql += ", SUM(INQTY)    AS INQTY "    /*입고 수량*/
      sql += ", SUM(INAMT)    AS INAMT "    /*입고 금액*/
      sql += ", CASE WHEN SUM(FAMT) = 0 THEN 0 ELSE ROUND(SUM(INAMT)/SUM(FAMT)*100,1) END AS INPER " /*FIX대비 입고율*/
      sql += ", SUM(SMODEL)   AS SMODEL "   /*판매 M*/
      sql += ", SUM(SQTY)     AS SQTY "     /*판매 수량*/
      sql += ", SUM(SAMT)     AS SAMT "     /*판매 금액*/
      sql += ", CASE WHEN SUM(INQTY) = 0 THEN 0 ELSE ROUND(SUM(SQTY)/SUM(INQTY)*100,1) END AS SPERQTY " /*입고대비 판매율(수량기준)*/
      sql += ", CASE WHEN SUM(INAMT) = 0 THEN 0 ELSE ROUND(SUM(SAMT)/SUM(INAMT)*100,1) END AS SPERAMT " /*입고대비 판매율(금액기준)*/
      sql += ", SUM(STOCKQTY) AS STOCKQTY " /*재고 수량*/
      sql += ", SUM(STOCKAMT) AS STOCKAMT " /*재고 금액*/
      sql += "FROM BIPD050 "
      sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPD050) "
      sql += "AND " + tabType + " = '" + CODETab + "' "
    //   sql += "AND YSCD IN (" + YSCD + ") "
      sql += "GROUP BY YSCD "
      sql += ") "
      sql += "WHERE YSGU IN (" + YSCD + ") "
      sql += "ORDER BY YSGU"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getMonthlyDetailData = (req, res) => {
    console.log("============== getMonthlyDetailData Call ======================");
//   res.send('respond with a resource');
    let tabType = req.query.tabType;
    let code = req.query.code;
    let yearCode = req.query.yearCode;

    /* PRO-01-03 */
    let sql = "SELECT YSGU,SUBGU "
    sql += "    ,YSMODEL,YSQTY,YSAMT "
    sql += "    ,FMODEL,FQTY,FAMT,CASE WHEN YSAMT > 0 THEN ROUND(FAMT/YSAMT*100,1) ELSE 0 END AS FIXPER " /*계획대비FIX율*/
    sql += "    ,PLNMODEL,PLNQTY,PLNAMT,CASE WHEN FAMT > 0 THEN ROUND(PLNAMT/FAMT*100,1) ELSE 0 END AS PLNPER " /*FIX대비 투입율*/
    sql += "    ,INMODEL,INQTY,INAMT,CASE WHEN FAMT > 0 THEN ROUND(INAMT/FAMT*100,1) ELSE 0 END AS INPER " /*FIX대비 입고율*/
    sql += "    ,SMODEL,SQTY,SAMT,CASE WHEN INAMT > 0 THEN ROUND(SAMT/INAMT*100,1) ELSE 0 END AS SPER " /*입고대비 판매율*/
    sql += "    ,STOCKQTY,STOCKAMT,SORT "
    sql += "  FROM ( "
    sql += "    SELECT 'TOTAL' AS YSGU,SUBGU,YSMODEL,YSQTY,YSAMT,FMODEL,FQTY,FAMT,PLNMODEL,PLNQTY,PLNAMT,INMODEL,INQTY,INAMT,SMODEL,SQTY,SAMT,STOCKQTY,STOCKAMT, 0 AS SORT "
    sql += "      FROM ( "
    sql += "        SELECT SUBGU "    /*소재명*/
    sql += "            , SUM(YSMODEL)  AS YSMODEL "  /*계획 M*/
    sql += "            , SUM(YSQTY)    AS YSQTY "    /*계획 수량*/
    sql += "            , SUM(YSAMT)    AS YSAMT "    /*계획 금액*/
    sql += "            , SUM(FMODEL)   AS FMODEL "   /*FIX M*/
    sql += "            , SUM(FQTY)     AS FQTY "     /*FIX 수량*/
    sql += "            , SUM(FAMT)     AS FAMT "     /*FIX 금액*/
    sql += "            , SUM(PLNMODEL) AS PLNMODEL " /*투입 M*/
    sql += "            , SUM(PLNQTY)   AS PLNQTY "   /*투입 수량*/
    sql += "            , SUM(PLNAMT)   AS PLNAMT "   /*투입 금액*/
    sql += "            , SUM(INMODEL)  AS INMODEL "  /*입고 M*/
    sql += "            , SUM(INQTY)    AS INQTY "    /*입고 수량*/
    sql += "            , SUM(INAMT)    AS INAMT "    /*입고 금액*/
    sql += "            , SUM(SMODEL)   AS SMODEL "   /*판매 M*/
    sql += "            , SUM(SQTY)     AS SQTY "     /*판매 수량*/
    sql += "            , SUM(SAMT)     AS SAMT "     /*판매 금액*/
    sql += "            , SUM(STOCKQTY) AS STOCKQTY " /*재고 수량*/
    sql += "            , SUM(STOCKAMT) AS STOCKAMT " /*재고 금액*/
    sql += "          FROM BIPD050 "
    sql += "        WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPD050) "
    sql += "          AND " + tabType + " = '" + code + "' "   /* 사업부에 따라 변경 */
    sql += "          AND SEASON IN ('" + yearCode + "01', '" + yearCode + "02', '" + yearCode + "03', '" + yearCode + "04') "   /* 년도,계절에 따라 변경 */
    sql += "        GROUP BY SUBGU "
    sql += "        ) "
    sql += "    UNION ALL "
    sql += "    SELECT 'TOTAL' AS YSGU,'TOTAL' AS SUBGU,YSMODEL,YSQTY,YSAMT,FMODEL,FQTY,FAMT,PLNMODEL,PLNQTY,PLNAMT,INMODEL,INQTY,INAMT,SMODEL,SQTY,SAMT,STOCKQTY,STOCKAMT, 1 AS SORT "
    sql += "      FROM ( "
    sql += "        SELECT SUM(YSMODEL)  AS YSMODEL "  /*계획 M*/
    sql += "            , SUM(YSQTY)    AS YSQTY "    /*계획 수량*/
    sql += "            , SUM(YSAMT)    AS YSAMT "    /*계획 금액*/
    sql += "            , SUM(FMODEL)   AS FMODEL "   /*FIX M*/
    sql += "            , SUM(FQTY)     AS FQTY "     /*FIX 수량*/
    sql += "            , SUM(FAMT)     AS FAMT "     /*FIX 금액*/
    sql += "            , SUM(PLNMODEL) AS PLNMODEL " /*투입 M*/
    sql += "            , SUM(PLNQTY)   AS PLNQTY "   /*투입 수량*/
    sql += "            , SUM(PLNAMT)   AS PLNAMT "   /*투입 금액*/
    sql += "            , SUM(INMODEL)  AS INMODEL "  /*입고 M*/
    sql += "            , SUM(INQTY)    AS INQTY "    /*입고 수량*/
    sql += "            , SUM(INAMT)    AS INAMT "    /*입고 금액*/
    sql += "            , SUM(SMODEL)   AS SMODEL "   /*판매 M*/
    sql += "            , SUM(SQTY)     AS SQTY "     /*판매 수량*/
    sql += "            , SUM(SAMT)     AS SAMT "     /*판매 금액*/
    sql += "            , SUM(STOCKQTY) AS STOCKQTY " /*재고 수량*/
    sql += "            , SUM(STOCKAMT) AS STOCKAMT " /*재고 금액*/
    sql += "          FROM BIPD050 "
    sql += "        WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPD050) "
    sql += "        AND " + tabType + " = '" + code + "' "   /* 사업부에 따라 변경 */
    sql += "      AND SEASON IN ('" + yearCode + "01', '" + yearCode + "02', '" + yearCode + "03', '" + yearCode + "04') "   /* 년도,계절에 따라 변경 */
    sql += "        ) "
    sql += "    ) "
    sql += "UNION ALL "
    sql += "SELECT YSGU,SUBGU "
    sql += ",YSMODEL,YSQTY,YSAMT "
    sql += ",FMODEL,FQTY,FAMT,CASE WHEN YSAMT > 0 THEN ROUND(FAMT/YSAMT*100,1) ELSE 0 END AS FIXPER " /*계획대비FIX율*/
    sql += ",PLNMODEL,PLNQTY,PLNAMT,CASE WHEN FAMT > 0 THEN ROUND(PLNAMT/FAMT*100,1) ELSE 0 END AS PLNPER " /*FIX대비 투입율*/
    sql += ",INMODEL,INQTY,INAMT,CASE WHEN FAMT > 0 THEN ROUND(INAMT/FAMT*100,1) ELSE 0 END AS INPER " /*FIX대비 입고율*/
    sql += ",SMODEL,SQTY,SAMT,CASE WHEN INAMT > 0 THEN ROUND(SAMT/INAMT*100,1) ELSE 0 END AS SPER " /*입고대비 판매율*/
    sql += ",STOCKQTY,STOCKAMT,SORT "
    sql += "FROM ( "
    sql += "SELECT SEASON AS YSGU,SUBGU,YSMODEL,YSQTY,YSAMT,FMODEL,FQTY,FAMT,PLNMODEL,PLNQTY,PLNAMT,INMODEL,INQTY,INAMT,SMODEL,SQTY,SAMT,STOCKQTY,STOCKAMT, 0 AS SORT "
    sql += "FROM ( "
    sql += "SELECT SEASON "
    sql += ", SUBGU "    /*소재명*/
    sql += ", SUM(YSMODEL)  AS YSMODEL "  /*계획 M*/
    sql += ", SUM(YSQTY)    AS YSQTY "    /*계획 수량*/
    sql += ", SUM(YSAMT)    AS YSAMT "    /*계획 금액*/
    sql += ", SUM(FMODEL)   AS FMODEL "   /*FIX M*/
    sql += ", SUM(FQTY)     AS FQTY "     /*FIX 수량*/
    sql += ", SUM(FAMT)     AS FAMT "     /*FIX 금액*/
    sql += ", SUM(PLNMODEL) AS PLNMODEL " /*투입 M*/
    sql += ", SUM(PLNQTY)   AS PLNQTY "   /*투입 수량*/
    sql += ", SUM(PLNAMT)   AS PLNAMT "   /*투입 금액*/
    sql += ", SUM(INMODEL)  AS INMODEL "  /*입고 M*/
    sql += ", SUM(INQTY)    AS INQTY "    /*입고 수량*/
    sql += ", SUM(INAMT)    AS INAMT "    /*입고 금액*/
    sql += ", SUM(SMODEL)   AS SMODEL "   /*판매 M*/
    sql += ", SUM(SQTY)     AS SQTY "     /*판매 수량*/
    sql += ", SUM(SAMT)     AS SAMT "     /*판매 금액*/
    sql += ", SUM(STOCKQTY) AS STOCKQTY " /*재고 수량*/
    sql += ", SUM(STOCKAMT) AS STOCKAMT " /*재고 금액*/
    sql += "FROM BIPD050 "
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPD050) "
    sql += "AND " + tabType + " = '" + code + "' "   /* 사업부에 따라 변경 */
    sql += "AND SEASON IN ('" + yearCode + "01', '" + yearCode + "02', '" + yearCode + "03', '" + yearCode + "04') "   /* 년도,계절에 따라 변경 */
    sql += "GROUP BY SUBGU, SEASON "
    sql += ") "
    sql += "UNION ALL "
    sql += "SELECT SEASON AS YSGU,'TOTAL' AS SUBGU,YSMODEL,YSQTY,YSAMT,FMODEL,FQTY,FAMT,PLNMODEL,PLNQTY,PLNAMT,INMODEL,INQTY,INAMT,SMODEL,SQTY,SAMT,STOCKQTY,STOCKAMT, 1 AS SORT "
    sql += "FROM ( "
    sql += "SELECT SEASON "
    sql += ", SUM(YSMODEL)  AS YSMODEL "  /*계획 M*/
    sql += ", SUM(YSQTY)    AS YSQTY "    /*계획 수량*/
    sql += ", SUM(YSAMT)    AS YSAMT "    /*계획 금액*/
    sql += ", SUM(FMODEL)   AS FMODEL "   /*FIX M*/
    sql += ", SUM(FQTY)     AS FQTY "     /*FIX 수량*/
    sql += ", SUM(FAMT)     AS FAMT "     /*FIX 금액*/
    sql += ", SUM(PLNMODEL) AS PLNMODEL " /*투입 M*/
    sql += ", SUM(PLNQTY)   AS PLNQTY "   /*투입 수량*/
    sql += ", SUM(PLNAMT)   AS PLNAMT "   /*투입 금액*/
    sql += ", SUM(INMODEL)  AS INMODEL "  /*입고 M*/
    sql += ", SUM(INQTY)    AS INQTY "    /*입고 수량*/
    sql += ", SUM(INAMT)    AS INAMT "    /*입고 금액*/
    sql += ", SUM(SMODEL)   AS SMODEL "   /*판매 M*/
    sql += ", SUM(SQTY)     AS SQTY "     /*판매 수량*/
    sql += ", SUM(SAMT)     AS SAMT "     /*판매 금액*/
    sql += ", SUM(STOCKQTY) AS STOCKQTY " /*재고 수량*/
    sql += ", SUM(STOCKAMT) AS STOCKAMT " /*재고 금액*/
    sql += "FROM BIPD050 "
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPD050) "
    sql += "AND " + tabType + " = '" + code + "' "   /* 사업부에 따라 변경 */
    sql += "AND SEASON IN ('" + yearCode + "01', '" + yearCode + "02', '" + yearCode + "03', '" + yearCode + "04') "   /* 년도,계절에 따라 변경 */
    sql += "GROUP BY SEASON "
    sql += ") "
    sql += ") "
    sql += "UNION ALL "
    sql += "SELECT YSCD AS YSGU,SUBGU "
    sql += ",YSMODEL,YSQTY,YSAMT "
    sql += ",FMODEL,FQTY,FAMT,CASE WHEN YSAMT > 0 THEN ROUND(FAMT/YSAMT*100,1) ELSE 0 END AS FIXPER " /*계획대비FIX율*/
    sql += ",PLNMODEL,PLNQTY,PLNAMT,CASE WHEN FAMT > 0 THEN ROUND(PLNAMT/FAMT*100,1) ELSE 0 END AS PLNPER " /*FIX대비 투입율*/
    sql += ",INMODEL,INQTY,INAMT,CASE WHEN FAMT > 0 THEN ROUND(INAMT/FAMT*100,1) ELSE 0 END AS INPER " /*FIX대비 입고율*/
    sql += ",SMODEL,SQTY,SAMT,CASE WHEN INAMT > 0 THEN ROUND(SAMT/INAMT*100,1) ELSE 0 END AS SPER " /*입고대비 판매율*/
    sql += ",STOCKQTY,STOCKAMT,SORT "
    sql += "FROM ( "
    sql += "SELECT YSCD,SUBGU,YSMODEL,YSQTY,YSAMT,FMODEL,FQTY,FAMT,PLNMODEL,PLNQTY,PLNAMT,INMODEL,INQTY,INAMT,SMODEL,SQTY,SAMT,STOCKQTY,STOCKAMT, 2 AS SORT "
    sql += "FROM ( "
    sql += "SELECT YSCD "        /*년월*/
    sql += ", SUBGU "    /*소재명*/
    sql += ", SUM(YSMODEL)  AS YSMODEL "  /*계획 M*/
    sql += ", SUM(YSQTY)    AS YSQTY "   /*계획 수량*/
    sql += ", SUM(YSAMT)    AS YSAMT "    /*계획 금액*/
    sql += ", SUM(FMODEL)   AS FMODEL "   /*FIX M*/
    sql += ", SUM(FQTY)     AS FQTY "     /*FIX 수량*/
    sql += ", SUM(FAMT)     AS FAMT "     /*FIX 금액*/
    sql += ", SUM(PLNMODEL) AS PLNMODEL " /*투입 M*/
    sql += ", SUM(PLNQTY)   AS PLNQTY "   /*투입 수량*/
    sql += ", SUM(PLNAMT)   AS PLNAMT "   /*투입 금액*/
    sql += ", SUM(INMODEL)  AS INMODEL "  /*입고 M*/
    sql += ", SUM(INQTY)    AS INQTY "    /*입고 수량*/
    sql += ", SUM(INAMT)    AS INAMT "    /*입고 금액*/
    sql += ", SUM(SMODEL)   AS SMODEL "   /*판매 M*/
    sql += ", SUM(SQTY)     AS SQTY "     /*판매 수량*/
    sql += ", SUM(SAMT)     AS SAMT "     /*판매 금액*/
    sql += ", SUM(STOCKQTY) AS STOCKQTY " /*재고 수량*/
    sql += ", SUM(STOCKAMT) AS STOCKAMT " /*재고 금액*/
    sql += "FROM BIPD050 "
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPD050) "
    sql += "AND " + tabType + " = '" + code + "' "   /* 사업부에 따라 변경 */
    sql += "AND YSCD IN ('"
                        + yearCode + "1','"
                        + yearCode + "2','"
                        + yearCode + "3','"
                        + yearCode + "4','"
                        + yearCode + "5','"
                        + yearCode + "6','"
                        + yearCode + "7','"
                        + yearCode + "8','"
                        + yearCode + "9','"
                        + yearCode + "A','"
                        + yearCode + "B','"
                        + yearCode + "C') " /* 년도시즌 따라 변경 */
    sql += "GROUP BY YSCD, SUBGU "
    sql += ") "
    sql += "UNION ALL "
    sql += "SELECT YSCD, 'TOTAL' AS SUBGU, YSMODEL,YSQTY,YSAMT,FMODEL,FQTY,FAMT,PLNMODEL,PLNQTY,PLNAMT,INMODEL,INQTY,INAMT,SMODEL,SQTY,SAMT,STOCKQTY,STOCKAMT, 3 AS SORT "
    sql += "FROM ( "
    sql += "SELECT " 
    sql += "YSCD "        /*년월*/
    sql += ", SUM(YSMODEL)  AS YSMODEL "  /*계획 M*/
    sql += ", SUM(YSQTY)    AS YSQTY "    /*계획 수량*/
    sql += ", SUM(YSAMT)    AS YSAMT "    /*계획 금액*/
    sql += ", SUM(FMODEL)   AS FMODEL "   /*FIX M*/
    sql += ", SUM(FQTY)     AS FQTY "     /*FIX 수량*/
    sql += ", SUM(FAMT)     AS FAMT "     /*FIX 금액*/
    sql += ", SUM(PLNMODEL) AS PLNMODEL " /*투입 M*/
    sql += ", SUM(PLNQTY)   AS PLNQTY "   /*투입 수량*/
    sql += ", SUM(PLNAMT)   AS PLNAMT "   /*투입 금액*/
    sql += ", SUM(INMODEL)  AS INMODEL "  /*입고 M*/
    sql += ", SUM(INQTY)    AS INQTY "    /*입고 수량*/
    sql += ", SUM(INAMT)    AS INAMT "    /*입고 금액*/
    sql += ", SUM(SMODEL)   AS SMODEL "   /*판매 M*/
    sql += ", SUM(SQTY)     AS SQTY "     /*판매 수량*/
    sql += ", SUM(SAMT)     AS SAMT "     /*판매 금액*/
    sql += ", SUM(STOCKQTY) AS STOCKQTY " /*재고 수량*/
    sql += ", SUM(STOCKAMT) AS STOCKAMT " /*재고 금액*/
    sql += "FROM BIPD050 "
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPD050) "
    sql += "AND " + tabType + " = '" + code + "' "   /* 사업부에 따라 변경 */
    sql += "AND YSCD IN ('"
                        + yearCode + "1','"
                        + yearCode + "2','"
                        + yearCode + "3','"
                        + yearCode + "4','"
                        + yearCode + "5','"
                        + yearCode + "6','"
                        + yearCode + "7','"
                        + yearCode + "8','"
                        + yearCode + "9','"
                        + yearCode + "A','"
                        + yearCode + "B','"
                        + yearCode + "C') " /* 년도시즌 따라 변경 */
    sql += "GROUP BY YSCD "
    sql += ") "
    sql += ") "
    sql += "ORDER BY YSGU,SORT,SUBGU "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};