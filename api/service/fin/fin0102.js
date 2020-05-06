var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

// 당일 매출 순위
exports.getsalesRanking = (req, res) => {
    console.log("============== getsalesRanking Call ======================");

    let orderType = req.query.orderType.toUpperCase();
    let searchType = req.query.searchType.toString();
    let tabType = req.query.tabType;
    let code = req.query.code;
    let date = req.query.date;

    let year = date.substr(0, 4);
    let month = date.substr(5, 2);

    // 매출 추이 누적
    let sql = "SELECT ROWNUM() RN, VDCD, VDSNM, "
    sql += "        SALE_TOT, PRE_SALE_TOT, QTY_TOT, "
    sql += "        TARGETAMT, GROWTH_RATE, "
    sql += "        ACHIEVEMENT_RATE, MEMPNM "
    sql += "FROM   (SELECT VDCD, VDSNM, "
    sql += "            SUM(SALE_TOT) AS SALE_TOT, SUM(PRE_SALE_TOT) AS PRE_SALE_TOT, "
    sql += "            SUM(QTY_TOT) AS QTY_TOT, SUM(TARGETAMT) AS TARGETAMT, "
    sql += "            CASE WHEN SUM(PRE_SALE_TOT) = 0 THEN 0 "
    sql += "                    ELSE ROUND(SUM(SALE_TOT)/SUM(PRE_SALE_TOT)*100, 0) "
    sql += "            END AS GROWTH_RATE, "
    sql += "            CASE WHEN SUM(TARGETAMT) = 0 THEN 0 "
    sql += "                    ELSE ROUND(SUM(SALE_TOT)/SUM(TARGETAMT)*100, 0) "
    sql += "            END AS ACHIEVEMENT_RATE, "
    sql += "            MAX(MEMPNM) AS MEMPNM "
    sql += "        FROM   (SELECT VDCD, VDSNM, "
    sql += "                    SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS SALE_TOT, 0 AS PRE_SALE_TOT, "
    sql += "                    SUM(JQTY+DCQTY+GQTY) AS QTY_TOT, SUM(TARGETAMT) AS TARGETAMT, "
    sql += "                    MAX(MEMPNM) AS MEMPNM "
    sql += "                FROM   BISL060 "
    if(searchType == "2") {
        sql += "                WHERE  SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + month + "' AND '" + year + month + "' "
    } else {
        sql += "                WHERE  SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01' AND '" + year + month + "' "
    }
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) "
    sql += "                GROUP BY VDCD, VDSNM, SUCD "
    if(code == "A") {
        sql += "                HAVING " + tabType + " IN ('1', '12', '23', '4', '3') "
    } else {
        sql += "                HAVING " + tabType + " = '" + code + "' "
    }
    sql += "                UNION ALL "
    sql += "                SELECT VDCD, VDSNM, 0 AS SALE_TOT,  "
    sql += "                    SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS PRE_SALE_TOT, "
    sql += "                    0 AS QTY_TOT, 0 AS TARGETAMT, '' AS MEMPNM "
    sql += "                FROM   BISL060 "
    if(searchType == "2") {
        sql += "                WHERE  SUBSTR(SALEDT, 1, 6) BETWEEN '" + (Number(year)-1).toString() + month + "' AND '" + (Number(year)-1).toString() + month + "' "
    } else {
        sql += "                WHERE  SUBSTR(SALEDT, 1, 6) BETWEEN '" + (Number(year)-1).toString() + "01' AND '" + (Number(year)-1).toString() + month + "' "
    }
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) "
    sql += "                GROUP BY VDCD, VDSNM, SUCD "
    if(code == "A") {
        sql += "                HAVING " + tabType + " IN ('1', '12', '23', '4', '3') ) "
    } else {
        sql += "                HAVING " + tabType + " = '" + code + "' ) "
    }
    sql += "        GROUP BY VDCD, VDSNM "
    sql += "        ORDER BY SALE_TOT " + orderType + " ) "
    sql += "WHERE  SALE_TOT > 0 "

    console.log(sql)

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

// 일목표 대비 실적
exports.getPerformanceList = (req, res) => {
    console.log("============== getPerformanceList Call ======================");

    let tabType = req.query.tabType;
    let code = req.query.code;
    let date = req.query.date;

    let year = date.substr(0, 4);
    let month = date.substr(4, 2);

    // 일목표 대비 실적
    let sql = "SELECT  DAY  "
    sql += "        ,SUM(TARGETAMT) AS TOTTARGETAMT, SUM(SAMT) AS TOTSAMT "
    if(code == "A" || code == "1") {
        sql += "        ,SUM(MITARGETAMT) AS MITARGETAMT, SUM(MISAMT) AS MISAMT "
    }
    if(code == "A" || code == "4") {
        sql += "        ,SUM(ITTARGETAMT) AS ITTARGETAMT, SUM(ITSAMT) AS ITSAMT "
    }
    if(code == "A" || code == "3") {
        sql += "        ,SUM(TSOTARGETAMT) AS TSOTARGETAMT, SUM(TSOSAMT) AS TSOSAMT "
        sql += "        ,SUM(SOTARGETAMT) AS SOTARGETAMT, SUM(SOSAMT) AS SOSAMT "
        sql += "        ,SUM(SOTARGETAMT1) AS SOTARGETAMT1, SUM(SOSAMT1) AS SOSAMT1 "
    }
    if(code == "A" || code == "12") {
        sql += "        ,SUM(MOTARGETAMT) AS MOTARGETAMT, SUM(MOSAMT) AS MOSAMT "
    }
    if(code == "A" || code == "21") {
        sql += "        ,SUM(FOTARGETAMT) AS FOTARGETAMT, SUM(FOSAMT) AS FOSAMT "
    }
    sql += "  FROM ( "
    sql += "        SELECT DAY "
    sql += "              ,0 AS TARGETAMT, SAMT "
    sql += "              ,0 AS MITARGETAMT "
    sql += "              ,CASE WHEN SUCD = '1' THEN SAMT END MISAMT "
    sql += "              ,0 AS ITTARGETAMT "
    sql += "              ,CASE WHEN SUCD = '4' THEN SAMT END ITSAMT "
    sql += "              ,0 AS TSOTARGETAMT "
    sql += "              ,CASE WHEN SUCD IN ('3','5') THEN SAMT END TSOSAMT "
    sql += "              ,0 AS SOTARGETAMT "
    sql += "              ,CASE WHEN SUCD = '3' THEN SAMT END SOSAMT "
    sql += "              ,0 AS SOTARGETAMT1 "
    sql += "              ,CASE WHEN SUCD = '5' THEN SAMT END SOSAMT1 "
    sql += "              ,0 AS MOTARGETAMT "
    sql += "              ,CASE WHEN SUCD = '12' THEN SAMT END MOSAMT "
    sql += "              ,0 AS FOTARGETAMT "
    sql += "              ,CASE WHEN SUCD = '21' THEN SAMT END FOSAMT "
    sql += "        FROM   (SELECT SUCD,"
    sql += "                       SUNM,"
    sql += "                       SUBSTR(SALEDT, 7, 2) AS DAY ,"
    sql += "                       SUM(TARGETAMT) AS TARGETAMT ,"
    sql += "                       SUM((JAMT+DCAMT+GAMT+ADVDEPAMT)) AS SAMT"
    sql += "                FROM   BISL061"
    sql += "                WHERE  SALEDT BETWEEN '" + year.toString() + month.toString() + "01' AND '" + date +"'"
    sql += "                AND    SUCD IN ('1','12','4', '3', '21', '5')"
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM   BISL061) "
    sql += "                GROUP BY SUCD, SUNM, SUBSTR(SALEDT, 7, 2) ) "
    sql += "        UNION ALL"
    sql += "        SELECT SUBSTR(YYYYMMDD,7,2) AS DAY, "
    sql += "            AMT AS TARGETAMT, 0 AS SAMT, "
    sql += "            CASE WHEN SUCD = '1' THEN AMT END AS MITARGETAMT, 0 AS MISAMT, "
    sql += "            CASE WHEN SUCD = '4' THEN AMT END AS ITTARGETAMT, 0 AS ITSAMT, "
    sql += "            CASE WHEN SUCD IN ('3', '5') THEN AMT END AS TSOTARGETAMT, 0 AS TSOSAMT, "
    sql += "            CASE WHEN SUCD = '3' THEN AMT END AS SOTARGETAMT, 0 AS SOSAMT, "
    sql += "            CASE WHEN SUCD = '5' THEN AMT END AS SOTARGETAMT1, 0 AS SOSAMT1, "
    sql += "            CASE WHEN SUCD = '12' THEN AMT END AS MOTARGETAMT, 0 AS MOSAMT, "
    sql += "            CASE WHEN SUCD = '21' THEN AMT END AS FOTARGETAMT, 0 AS FOSAMT "
    sql += "        FROM (SELECT SUCD,SUM(AMT) AS AMT, YYYYMMDD FROM BISL010 "
    sql += "           WHERE SUBSTR(YYYYMMDD,1,6) = '" + year.toString() + month.toString() + "' "
    sql += "           AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL010) "
    sql += "           GROUP BY SUCD, YYYYMMDD ) "
    sql += "        ) "
    sql += "        GROUP BY DAY "
    sql += "        ORDER BY DAY "

    console.log("getPerformanceList >>> ", sql)

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

// 전체 목표 금액
exports.getMonthGoal = (req, res) => {
    console.log("============== getMonthGoal Call ======================");
    
    let date = req.query.date;
    
    let year = date.substr(0, 4);
    let month = date.substr(5, 2);
    
    // 전체 목표 금액
    let sql = "SELECT SUM(AMT) AS TOTAMT, SUM(MIAMT) AS MIAMT, SUM(ITAMT) AS ITAMT, SUM(TSOAMT) AS TSOAMT, SUM(SOAMT) AS SOAMT, SUM(SOAMT1) AS SOAMT1, SUM(MOAMT) AS MOAMT, SUM(FOAMT) AS FOAMT, SUM(INAMT) AS INAMT  "
    sql += " FROM ( "
    sql += " SELECT AMT, "
    sql += "        CASE WHEN SUCD = '1' THEN AMT END AS MIAMT, "
    sql += "        CASE WHEN SUCD = '4' THEN AMT END AS ITAMT, "
    sql += "        CASE WHEN SUCD IN ('3','5') THEN AMT END AS TSOAMT, "
    sql += "        CASE WHEN SUCD = '3' THEN AMT END AS SOAMT, "
    sql += "        CASE WHEN SUCD = '5' THEN AMT END AS SOAMT1, "
    sql += "        CASE WHEN SUCD = '12' THEN AMT END AS MOAMT, "
    sql += "        CASE WHEN SUCD = '21' THEN AMT END AS FOAMT, "
    sql += "        CASE WHEN SUCD = '23' THEN AMT END AS INAMT "
    sql += " FROM ( "
    sql += " SELECT SUCD,SUM(AMT) AS AMT FROM BISL010"
    sql += " WHERE SUBSTR(YYYYMMDD,1,6) = '" + date + "' "
    sql += " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL010) "
    sql += " GROUP BY SUCD "
    sql += "    )"
    sql += " )"
    console.log("getMonthGoal Call >>> ", sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

// 매장별 일자별
exports.getStoreByDate = (req, res) => {
    console.log("============== getStoreByDate Call ======================");
    
    let vdcd = req.query.vdcd;
    let date = req.query.date;
    
    let start_date = date.substr(0, 6) + "01";

    // 전체 목표 금액
    let sql = "SELECT VDCD, VDSNM, SALEDT, "
    sql += "SALE_TOT, QTY_TOT, "
    sql += "       JAMT, JQTY, "
    sql += "       DCAMT, DCQTY, "
    sql += "       GAMT, GQTY, "
    sql += "       R_JAMT, R_JQTY, "
    sql += "       R_DCAMT, R_DCQTY, "
    sql += "       R_GAMT, R_GQTY, "
    sql += "       ADVDEPAMT "
    sql += "  FROM (SELECT VDCD, VDSNM, SALEDT, "
    sql += "               SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS SALE_TOT, "
    sql += "               SUM(JQTY+DCQTY+GQTY) AS QTY_TOT, "
    sql += "               SUM(JSAMT) JAMT, SUM(JSQTY) JQTY, "
    sql += "               SUM(DCSAMT) DCAMT, SUM(DCSQTY) DCQTY, "
    sql += "               SUM(GSAMT) GAMT, SUM(GSQTY) GQTY, "
    sql += "               SUM(JRAMT) R_JAMT, SUM(JRQTY) R_JQTY, "
    sql += "               SUM(DCRAMT) R_DCAMT, SUM(DCRQTY) R_DCQTY, "
    sql += "               SUM(GRAMT) R_GAMT, SUM(GRQTY) R_GQTY, "
    sql += "               SUM(ADVDEPAMT) ADVDEPAMT "
    sql += "          FROM BISL060 "
    sql += "         WHERE SALEDT BETWEEN '" + start_date + "' AND '" + date + "' "
    sql += "           AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) "
    sql += "           AND VDCD = '" + vdcd + "' "
    sql += "         GROUP BY VDCD, VDSNM, SUCD, SALEDT "
    sql += "        HAVING SUCD IN ('1', '12', '21', '23', '4', '3', '5') "
    sql += "         ORDER BY SALEDT) "

    console.log("getStoreByDate Call >>> ", sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};
