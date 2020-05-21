var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getRecentBISL061Date = (req, res) => {
    console.log("============== getRecentBISL061Date Call ======================");

    let sql = "SELECT MAX(SALEDT) SALEDT FROM BISL061 "
    sql += "WHERE SALEDT = (SELECT MAX(SALEDT) FROM BISL061)"
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getTotalSalesData = (req, res) => {
    console.log("============== getTotalSalesData Call ======================");
    
    let tabType = req.query.tabType;
    let date = req.query.date;
    let authCodeList = req.query.authCodeList.split(',');
    let monthStartDate = req.query.monthStartDate;
    
    // 사업부별 일매출
    /*
    let sql = "SELECT SUNM, " + tabType + " MCODE, SUM(SALE_TOT) AS SALE_TOT, SUM(SALE_MONTH_TOT) AS SALE_MONTH_TOT, SUM(AMT) AS AMT FROM ( "
    sql += "SELECT SUNM, " + tabType + ", SALE_TOT, 0 AS SALE_MONTH_TOT, 0 AS AMT FROM ( "
    sql += "SELECT SUNM, " + tabType + ", SUM(JAMT+DCAMT+GAMT+ADVDEPAMT)AS SALE_TOT FROM BISL061 "
    sql += "WHERE " + tabType + " IN ('1','12','4','3','21','5') ";
    sql += "AND SALEDT = '" + date + "' ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) "
    sql += "GROUP BY SUNM, " + tabType + ") "
    sql += "UNION ALL ";
    sql += "SELECT SUNM, " + tabType + ", 0 AS SALE_TOT, SALE_MONTH_TOT, TARGETAMT AS AMT FROM ( ";
    sql += "SELECT SUNM, " + tabType + ", SUM((JAMT+DCAMT+GAMT+ADVDEPAMT))AS SALE_MONTH_TOT, SUM(TARGETAMT) TARGETAMT FROM BISL061 ";
    sql += "WHERE " + tabType + " IN ('1','12','4','3','21','5') ";
    sql += "AND SALEDT >= '" + monthStartDate + "' ";
    sql += "AND SALEDT <= '" + date + "' ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SUNM, " + tabType + ") ";
    sql += ") GROUP BY SUNM, " + tabType
    */
    let sql = "SELECT " + tabType + " MCODE, ";
    sql += "       SUM(SALE_TOT) AS SALE_TOT, ";
    sql += "       SUM(SALE_MONTH_TOT) AS SALE_MONTH_TOT, ";
    sql += "       SUM(AMT) AS AMT, ";
    sql += "       DECODE(" + tabType + ",'1',1,'4',2,'3',3,'12',4,'21',5) AS SORT ";
    sql += "FROM   (SELECT " + tabType + ", ";
    sql += "               SALE_TOT, ";
    sql += "               0 AS SALE_MONTH_TOT, ";
    sql += "               0 AS AMT ";
    sql += "        FROM   (SELECT DECODE(" + tabType + ",'5','3'," + tabType + ") AS " + tabType + ", ";
    sql += "                       SUM(JAMT+DCAMT+GAMT+ADVDEPAMT)AS SALE_TOT ";
    sql += "                FROM   BISL061 ";
    sql += "                WHERE  " + tabType + " IN ('1', '12', '4', '3', '21', '5') ";
    sql += "                AND    SALEDT = '" + date + "' ";
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) ";
    sql += "                        FROM   BISL061) ";
    sql += "                GROUP BY " + tabType + ") ";
    sql += "        UNION ALL ";
    sql += "        SELECT " + tabType + ", ";
    sql += "               0 AS SALE_TOT, ";
    sql += "               SALE_MONTH_TOT, ";
    sql += "               TARGETAMT AS AMT ";
    sql += "        FROM   (SELECT DECODE(" + tabType + ",'5','3'," + tabType + ") AS " + tabType + ", ";
    sql += "                       SUM((JAMT+DCAMT+GAMT+ADVDEPAMT))AS SALE_MONTH_TOT, ";
    sql += "                       SUM(TARGETAMT) TARGETAMT ";
    sql += "                FROM   BISL061 ";
    sql += "                WHERE  " + tabType + " IN ('1', '12', '4', '3', '21', '5') ";
    sql += "                AND    SALEDT BETWEEN '" + monthStartDate + "' AND '" + date + "' ";
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) ";
    sql += "                        FROM   BISL061) ";
    sql += "                GROUP BY " + tabType + ") ) ";
    sql += "GROUP BY " + tabType + ",SORT ";
    sql += "ORDER BY SORT ";
    console.log("getTotalSalesData >>>> ", sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getCumulativeData = (req, res) => {
    console.log("============== getCumulativeData Call ======================");

    let tabType = req.query.tabType;
    let date = req.query.date;
    let authCodeList = req.query.authCodeList.split(',');
    let monthStartDate = req.query.monthStartDate;

    // 당일 매출, 당일 매출 목표, 월 누적매출, 월 매출 목표,
    /*
    let sql = "SELECT SUNM, " + tabType + " MCODE, ";
    sql += "       SUM(SALE_YEAR_TOT) AS SALE_YEAR_TOT, SUM(YEAR_AMT) AS YEAR_AMT,  ";
    sql += "       SUM(SALE_MONTH_TOT) AS SALE_MONTH_TOT, SUM(MONTH_AMT) AS MONTH_AMT, ";
    sql += "       SUM(SALE_TOT) AS SALE_TOT, SUM(AMT) AS AMT ";
    sql += "FROM   ( ";
    sql += "        SELECT SUNM, " + tabType + ", SALE_TOT AS SALE_YEAR_TOT, AMT AS YEAR_AMT, ";
    sql += "               0 AS SALE_MONTH_TOT, 0 AS MONTH_AMT, 0 AS SALE_TOT, 0 AS AMT ";
    sql += "        FROM   ( SELECT SUNM, " + tabType + ", ";
    sql += "                 SUM((JAMT+DCAMT+GAMT+ADVDEPAMT))AS SALE_TOT, SUM(TARGETAMT) AMT FROM BISL061 ";
    sql += "        WHERE " + tabType + " IN ('1','12','4','3','21','5') ";
    sql += "        AND SALEDT BETWEEN '" + monthStartDate + "' AND '" + date + "' ";
    sql += "        AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "        GROUP BY SUNM, " + tabType + ") ";
    sql += "        UNION ALL ";
    sql += "        SELECT SUNM, " + tabType + ", ";
    sql += "               0 AS SALE_YEAR_TOT, 0 AS YEAR_AMT, ";
    sql += "               SALE_MONTH_TOT, TARGETAMT AS MONTH_AMT, ";
    sql += "               0 AS SALE_TOT, 0 AS AMT ";
    sql += "        FROM   ( SELECT SUNM, " + tabType + ", ";
    sql += "                SUM((JAMT+DCAMT+GAMT+ADVDEPAMT)) AS SALE_MONTH_TOT, SUM(TARGETAMT) TARGETAMT FROM BISL061 ";
    sql += "        WHERE " + tabType + " IN ('1','12','4','3','21','5')  ";
    sql += "        AND SALEDT BETWEEN TO_CHAR(ADD_TIME(SYSDATE, '0/0/-1 0:0:0'),'YYYYMM')||'01' AND TO_CHAR(ADD_TIME(SYSDATE, '0/0/-1 0:0:0'),'YYYYMMDD') ";
    sql += "        AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "        GROUP BY SUNM, " + tabType + ") ";
    sql += "        UNION ALL ";
    sql += "        SELECT SUNM, " + tabType + ", ";
    sql += "               0 AS SALE_YEAR_TOT, 0 AS YEAR_AMT, ";
    sql += "               0 AS SALE_MONTH_TOT, 0 AS MONTH_AMT, ";
    sql += "               SALE_TOT, AMT ";
    sql += "        FROM   ( SELECT SUNM, " + tabType + ", ";
    sql += "                SUM((JAMT+DCAMT+GAMT+ADVDEPAMT))AS SALE_TOT, SUM(TARGETAMT) AMT FROM BISL061 ";
    sql += "        WHERE " + tabType + " IN ('1','12','4','3','21','5')  ";
    sql += "        AND SALEDT = '" + date + "' ";
    sql += "        AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "        GROUP BY SUNM, " + tabType + ") ";
    sql += ") GROUP BY SUNM, " + tabType + "";
    */
    let sql = "SELECT SUCD MCODE, ";
    sql += "       SUM(SALE_YEAR_TOT) AS SALE_YEAR_TOT, ";
    sql += "       SUM(YEAR_AMT) AS YEAR_AMT, ";
    sql += "       SUM(SALE_MONTH_TOT) AS SALE_MONTH_TOT, ";
    sql += "       SUM(MONTH_AMT) AS MONTH_AMT, ";
    sql += "       SUM(SALE_TOT) AS SALE_TOT, ";
    sql += "       SUM(AMT) AS AMT, ";
    sql += "       DECODE(SUCD,'1',1,'4',2,'3',3,'12',4,'21',5) AS SORT ";
    sql += "FROM   (SELECT SUCD, ";
    sql += "               SALE_TOT AS SALE_YEAR_TOT, ";
    sql += "               AMT AS YEAR_AMT, ";
    sql += "               0 AS SALE_MONTH_TOT, ";
    sql += "               0 AS MONTH_AMT, ";
    sql += "               0 AS SALE_TOT, ";
    sql += "               0 AS AMT ";
    sql += "        FROM   (SELECT DECODE(SUCD,'5','3',SUCD) AS SUCD, ";
    sql += "                       SUM((JAMT+DCAMT+GAMT+ADVDEPAMT))AS SALE_TOT, ";
    sql += "                       SUM(TARGETAMT) AMT ";
    sql += "                FROM   BISL061 ";
    sql += "                WHERE  SUCD IN ('1', '12', '4', '3', '21', '5') ";
    sql += "                AND    SALEDT BETWEEN '" + monthStartDate + "' AND '" + date + "' ";
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM   BISL061) ";
    sql += "                GROUP BY SUCD) ";
    sql += "        UNION ALL ";
    sql += "        SELECT SUCD, ";
    sql += "               0 AS SALE_YEAR_TOT, ";
    sql += "               0 AS YEAR_AMT, ";
    sql += "               SALE_MONTH_TOT, ";
    sql += "               TARGETAMT AS MONTH_AMT, ";
    sql += "               0 AS SALE_TOT, ";
    sql += "               0 AS AMT ";
    sql += "        FROM   (SELECT DECODE(SUCD,'5','3',SUCD) AS SUCD, ";
    sql += "                       SUM((JAMT+DCAMT+GAMT+ADVDEPAMT)) AS SALE_MONTH_TOT, ";
    sql += "                       SUM(TARGETAMT) TARGETAMT ";
    sql += "                FROM   BISL061 ";
    sql += "                WHERE  SUCD IN ('1', '12', '4', '3', '21', '5') ";
    sql += "                AND    SALEDT BETWEEN '" + monthStartDate + "' AND '" + date + "' ";
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM   BISL061) ";
    sql += "                GROUP BY SUCD) ";
    sql += "        UNION ALL ";
    sql += "        SELECT SUCD, ";
    sql += "               0 AS SALE_YEAR_TOT, ";
    sql += "               0 AS YEAR_AMT, ";
    sql += "               0 AS SALE_MONTH_TOT, ";
    sql += "               0 AS MONTH_AMT, ";
    sql += "               SALE_TOT, ";
    sql += "               AMT ";
    sql += "        FROM   (SELECT DECODE(SUCD,'5','3',SUCD) AS SUCD, ";
    sql += "                       SUM((JAMT+DCAMT+GAMT+ADVDEPAMT))AS SALE_TOT, ";
    sql += "                       SUM(TARGETAMT) AMT ";
    sql += "                FROM   BISL061 ";
    sql += "                WHERE  SUCD IN ('1', '12', '4', '3', '21', '5') ";
    sql += "                AND    SALEDT = '" + date + "' ";
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM   BISL061) ";
    sql += "                GROUP BY SUCD) ) ";
    sql += "GROUP BY SORT,SUCD  ";
    sql += "ORDER BY SORT ";

    console.log("getCumulativeData >>>??? "+sql);
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getChartData2 = (req, res) => {
    console.log("============== getChartData2 Call ======================");
    
    let tabType = req.query.tabType;
    let code = req.query.code;
    let lastYear30day = req.query.lastYear30day;
    let lastYearSelectDay = req.query.lastYearSelectDay;
    
    let searchType = req.query.searchType.toString();
    let start_date = "";
    
    // 매출추이
    // 작년동기매출
    let sql = "SELECT SALEDT, "
    
    if(code == "A") {
        sql += " 'ALL' AS "
    }
    sql += "SUNM, SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS LY_SALE_TOT FROM BISL061 "
    sql += "WHERE SALEDT BETWEEN '" + lastYear30day + "' AND '" + lastYearSelectDay + "' "
    if(code != "A") {
        sql += "AND " + tabType + " = '" + code + "' "
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SALEDT "
    if(code != "A") {
        sql += ", SUNM "
    }
    sql += "ORDER BY SALEDT"
    
    console.log("getChartData2 >>>??? "+sql);
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getCurrentYearData = (req, res) => {
    console.log("============== getCurrentYearData Call ======================");

    let tabType = req.query.tabType;
    let code = req.query.code;
    let searchType = req.query.searchType.toString();

    let start_date = req.query.start_date;
    let date = req.query.date;

    let end_date = moment(date, "YYYYMMDD").endOf('month').format("YYYYMMDD");

    // 일별매출, 일별매출목표
    /*
    let sql = "SELECT"
    if(searchType == "1") {
        sql += " SALEDT, "
    } else if(searchType == "2") {
        sql += " TO_CHAR(TO_DATE(SALEDT, 'YYYYMMDD'), 'YYYY/MM') SALEDT, "
    } else {
        sql += " TO_CHAR(TO_DATE(SALEDT, 'YYYYMMDD'), 'YYYY') SALEDT, "
    }
    sql += "SUM(TARGETAMT) AS AMT, SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS SALE_TOT FROM BISL061 "
    sql += "WHERE SALEDT BETWEEN '" + start_date + "' AND '" + date + "' "
    if(code == "A") {
        sql += "AND " + tabType + " IN ('1', '12', '4', '3', '21', '5') "
    } else if(code == "3") {
        sql += "AND " + tabType + " IN ('3', '5') "
    } else {
        sql += "AND " + tabType + " = '" + code + "' "
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SALEDT "
    sql += "ORDER BY SALEDT "
    */

    let sql = "SELECT";
    if(searchType == "1") {
        sql += " SALEDT, "
    } else if(searchType == "2") {
        sql += " TO_CHAR(TO_DATE(SALEDT, 'YYYYMMDD'), 'YYYY/MM') SALEDT, "
    } else {
        sql += " TO_CHAR(TO_DATE(SALEDT, 'YYYYMMDD'), 'YYYY') SALEDT, "
    }
    sql += " SUM(AMT) AS AMT, SUM(SALE_TOT) AS SALE_TOT FROM ( ";
    sql += "        SELECT SALEDT, ";
    sql += "               0 AS AMT, ";
    sql += "               SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS SALE_TOT ";
    sql += "        FROM   BISL061 ";
    sql += "        WHERE  SALEDT BETWEEN '" + start_date + "' AND '" + date + "' ";
    if(code == "A") {
        sql += "AND " + tabType + " IN ('1', '12', '4', '3', '21', '5') "
    } else if(code == "3") {
        sql += "AND " + tabType + " IN ('3', '5') "
    } else {
        sql += "AND " + tabType + " = '" + code + "' "
    }
    sql += "        AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM   BISL061) ";
    sql += "        GROUP BY SALEDT ";
    sql += "        UNION ALL ";
    sql += "        SELECT YYYYMMDD AS SALEDT, ";
    sql += "               SUM(AMT) AS AMT, ";
    sql += "               0 AS SALE_TOT ";
    sql += "        FROM   BISL010 ";
    sql += "        WHERE  YYYYMMDD BETWEEN '" + start_date + "' AND '" + end_date + "' ";
    if(code == "A") {
        sql += "AND " + tabType + " IN ('1', '12', '4', '3', '21', '5') "
    } else if(code == "3") {
        sql += "AND " + tabType + " IN ('3', '5') "
    } else {
        sql += "AND " + tabType + " = '" + code + "' "
    }
    sql += "        AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM   BISL010) ";
    sql += "        GROUP BY YYYYMMDD ";
    sql += "     ) ";
    sql += "GROUP BY SALEDT ";
    sql += "ORDER BY SALEDT ";
    
    console.log("매출추이 >>> ", sql)

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStoreList = (req, res) => {
    console.log("============== getStoreList Call ======================");
    
    let tabType = req.query.tabType;
    let code = req.query.code;
    let date = req.query.date;

    // 당일매출 순위
    let sql = "SELECT ROWNUM() RN, VDSNM, SALE_TOT FROM ( "
    sql += "SELECT VDSNM, SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS SALE_TOT FROM BISL060 "
    // sql += "WHERE " + this.tabType + " = '" + code + "' "
    sql += "WHERE SALEDT = '"+ date +"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) ";
    sql += "GROUP BY VDSNM, SUCD "
    if(code == "A") {
        sql += "HAVING " + tabType + " IN ('1', '12', '4', '3', '21', '5') "
    } else if(code == "3") {
        sql += "HAVING " + tabType + " IN ('" + code + "', '5') "
    } else {
        sql += "HAVING " + tabType + " = '" + code + "' "
    }
    sql += "ORDER BY SALE_TOT "
    sql += ")"
    console.log("getStoreList Call >>>",sql)

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStoreMonthList = (req, res) => {
    console.log("============== getStoreMonthList Call ======================");

    let tabType = req.query.tabType;
    let code = req.query.code;
    let date = req.query.date;

    // 당일매출 순위
    let sql = "SELECT ROWNUM() RN, VDSNM, SALE_TOT FROM ( "
    sql += "SELECT VDSNM, SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS SALE_TOT FROM BISL060 "
    // sql += "WHERE " + this.tabType + " = '" + code + "' "
    sql += "WHERE SALEDT BETWEEN '" + date.substr(0, 6) +"01' AND '"+ date +"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) ";
    sql += "GROUP BY VDSNM, SUCD "
    if(code != "A") {
        sql += "HAVING " + tabType + " = '" + code + "' "
    }
    sql += "ORDER BY SALE_TOT "
    sql += ")"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSalesChartCount = (req, res) => {
    console.log("============== getSalesChartCount Call ======================");

    let tabType = req.query.tabType;
    let searchType = req.query.searchType.toString();
    let code = req.query.code;
    let date = req.query.date;

    let start_date = "";
    let sql = "";

    // 당일 판매, 반품 수량
    if(searchType == "2") {
        sql += "SELECT SALEDT, SUM(JQTY) JQTY, SUM(DCQTY) DCQTY, SUM(GQTY) GQTY, SUM(R_JQTY) R_JQTY, SUM(R_DCQTY) R_DCQTY, SUM(R_GQTY) R_GQTY FROM ( "
    }
    sql += "SELECT "
    if(searchType == "1") {
        start_date = date;
        sql += " SALEDT, "
    } else if(searchType == "2") {
        start_date = date.substr(0, 6)+'01';
        sql += " TO_CHAR(TO_DATE(SALEDT, 'YYYYMMDD'), 'YYYYMM') SALEDT, "
    } else {
        start_date = date.substr(0, 4)+'0101';
        sql += " TO_CHAR(TO_DATE(SALEDT, 'YYYYMMDD'), 'YYYY') SALEDT, "
    }
    sql += "SUM(JSQTY) JQTY, SUM(DCSQTY) DCQTY, SUM(GSQTY) GQTY, SUM(JRQTY) R_JQTY, SUM(DCRQTY) R_DCQTY, SUM(GRQTY) R_GQTY FROM BISL061 "
    sql += "WHERE SALEDT BETWEEN '"+ start_date +"' AND '"+ date +"' "
    if(code == "A") {
        sql += "AND " + tabType + " IN ('1', '12', '4', '3', '21', '5')"
    } else if(code == "3") {
        sql += "AND " + tabType + " IN ('" + code + "', '5') "
    } else {
        sql += "AND " + tabType + " = '" + code + "' "
    }

    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SALEDT "
    if(searchType == "2") {
        sql += ") GROUP BY SALEDT"
    }

    console.log("searchType >>> " + searchType + " || start_date >>> " + start_date)
    console.log("getSalesChartCount >>> " + sql)

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSalesChartAMT = (req, res) => {
    console.log("============== getSalesChartAMT Call ======================");

    let tabType = req.query.tabType;
    let code = req.query.code;
    let date = req.query.date;
    let searchType = req.query.searchType.toString();

    let start_date = "";
    let sql = "";

    console.log("searchType >>> ", searchType);

    // 당일 판매, 반품 금액
    if(searchType == "2") {
        sql += "SELECT SALEDT, SUM(JAMT) JAMT, SUM(DCAMT) DCAMT, SUM(GAMT) GAMT, SUM(R_JAMT) R_JAMT, SUM(R_DCAMT) R_DCAMT, SUM(R_GAMT) R_GAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM ( "
    }
    sql += "SELECT "
    if(searchType == "1") {
        start_date = date;
        sql += " SALEDT, "
    } else if(searchType == "2") {
        start_date = date.substr(0, 6)+'01';
        sql += " TO_CHAR(TO_DATE(SALEDT, 'YYYYMMDD'), 'YYYYMM') SALEDT, "
    } else {
        start_date = date.substr(0, 4)+'0101';
        sql += " TO_CHAR(TO_DATE(SALEDT, 'YYYYMMDD'), 'YYYY') SALEDT, "
    }
    sql += " SUM(JSAMT) JAMT, SUM(DCSAMT) DCAMT, SUM(GSAMT) GAMT, SUM(JRAMT) R_JAMT, SUM(DCRAMT) R_DCAMT, SUM(GRAMT) R_GAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISL061 "
    sql += "WHERE SALEDT BETWEEN '"+ start_date +"' AND '"+ date +"' "
    if(code == "A") {
        sql += "AND " + tabType + " IN ('1', '12', '4', '3', '21', '5')"
    } else if(code == "3") {
        sql += "AND " + tabType + " IN ('" + code + "', '5') "
    } else {
        sql += "AND " + tabType + " = '" + code + "' "
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SALEDT "
    if(searchType == "2") {
        sql += ") GROUP BY SALEDT"
    }

    console.log(" || date >>> " + date)
    console.log("getSalesChartAMT >>> " + sql)

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

// 매출 추이 월간(누적)
exports.getCumulativeSales = (req, res) => {
    console.log("============== getCumulativeSales Call ======================");

    let tabType = req.query.tabType;
    let code = req.query.code;
    let date = req.query.date;

    let year = date.substr(0, 4);

    let allCode = ""
    let groupBy = ""
    if(code == "A") {
        allCode = "MAX('ALL') AS "
    } else {
        groupBy = "SUCD, "
    }

    // 매출 추이 누적
    let sql ="SELECT SUCD, SALEDT, "
    sql += "    ROUND(SUM(NOW_MONTH_TOT)/1000000, 0) AS SALE_TOT, ";
    sql += "    ROUND(SUM(PRE_MONTH_TOT)/1000000, 0) AS LY_SALE_TOT, ";
    sql += "    ROUND(SUM(TARGETAMT)/1000000, 0) AS AMT ";
    sql += "FROM   (SELECT " + allCode + "SUCD, SUBSTR(SALEDT, 5, 2) AS SALEDT, ";
    sql += "            SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS NOW_MONTH_TOT, ";
    sql += "            0 AS PRE_MONTH_TOT, ";
    sql += "            SUM(TARGETAMT) AS TARGETAMT ";
    sql += "        FROM   BISL061 ";
    sql += "        WHERE  SALEDT BETWEEN '" + year + "0101' AND '" + date + "' ";
    if(code != "A") {
        sql += "    AND " + tabType + " = '" + code + "' ";
    } else {
        sql += "    AND " + tabType + " IN ('1','12','4','3','21','5') ";
    }
    sql += "        AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "        GROUP BY " + groupBy + "SALEDT ";
    sql += "        UNION ALL ";
    sql += "        SELECT " + allCode + "SUCD, SUBSTR(SALEDT, 5, 2) AS SALEDT, ";
    sql += "            0 AS NOW_MONTH_TOT, ";
    sql += "            SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS PRE_MONTH_TOT, ";
    sql += "            0 AS TARGETAMT ";
    sql += "        FROM   BISL061 ";
    sql += "        WHERE  SALEDT BETWEEN '" + (Number(year)-1).toString() + "0101' AND '" + (Number(year)-1).toString() + "1231'";

    if(code == "A") {
        sql += "    AND " + tabType + " IN ('1','12','4','3','21','5') "
    } else if(code == "3") {
        sql += "    AND " + tabType + " IN ('" + code + "', '5') "
    } else {
        sql += "    AND " + tabType + " = '" + code + "' ";
    }
    
    sql += "        AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "        GROUP BY " + groupBy + "SALEDT ) ";
    sql += "GROUP BY SUCD, SALEDT ";
    sql += "ORDER BY SALEDT ";

    console.log("getCumulativeSales >>> ", sql)
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};
