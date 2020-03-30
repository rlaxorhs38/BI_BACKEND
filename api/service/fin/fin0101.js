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
    let sql = "SELECT SUNM, " + tabType + " MCODE, SUM(SALE_TOT) AS SALE_TOT, SUM(SALE_MONTH_TOT) AS SALE_MONTH_TOT, SUM(AMT) AS AMT FROM ( "
    sql += "SELECT SUNM, " + tabType + ", SALE_TOT, 0 AS SALE_MONTH_TOT, 0 AS AMT FROM ( "
    sql += "SELECT SUNM, " + tabType + ", SUM(JAMT+DCAMT+GAMT+ADVDEPAMT)AS SALE_TOT FROM BISL061 "
    sql += "WHERE " + tabType + " IN ("
    for (i=0;i<authCodeList.length;i++) {
      sql += "'" + authCodeList[i] + "'"
      if (i < authCodeList.length - 1) {
        sql += ","
      }
    }
    sql += ") ";
    sql += "AND SALEDT = '" + date + "' ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) "
    sql += "GROUP BY SUNM, " + tabType + ") "
    sql += "UNION ALL ";
    sql += "SELECT SUNM, " + tabType + ", 0 AS SALE_TOT, SALE_MONTH_TOT, TARGETAMT AS AMT FROM ( ";
    sql += "SELECT SUNM, " + tabType + ", SUM((JAMT+DCAMT+GAMT+ADVDEPAMT))AS SALE_MONTH_TOT, SUM(TARGETAMT) TARGETAMT FROM BISL061 ";
    sql += "WHERE " + tabType + " IN ("
    for (i=0;i<authCodeList.length;i++) {
      sql += "'" + authCodeList[i] + "'"
      if (i < authCodeList.length - 1) {
        sql += ","
      }
    }
    sql += ") ";
    sql += "AND SALEDT >= '" + monthStartDate + "' ";
    sql += "AND SALEDT <= '" + date + "' ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SUNM, " + tabType + ") ";
    sql += ") GROUP BY SUNM, " + tabType

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getCumulativeData = (req, res) => {
    console.log("============== getCumulativeData Call ======================");

    let tabType = req.query.tabType;
    // let date = req.query.date;
    let authCodeList = req.query.authCodeList.split(',');
    // let monthStartDate = req.query.monthStartDate;

    // 당일 매출, 당일 매출 목표, 월 누적매출, 월 매출 목표,
    let sql = "SELECT SUNM, " + tabType + " MCODE, SUM(SALE_TOT) AS SALE_YEAR_TOT, SUM(AMT) YEAR_AMT, SUM(SALE_MONTH_TOT) AS SALE_MONTH_TOT, SUM(MONTH_AMT) AS MONTH_AMT FROM ( ";
    sql += "SELECT SUNM, " + tabType + ", SALE_TOT, AMT, 0 AS SALE_MONTH_TOT, 0 AS MONTH_AMT FROM ( ";
    sql += "SELECT SUNM, " + tabType + ", SUM((JAMT+DCAMT+GAMT+ADVDEPAMT))AS SALE_TOT, SUM(TARGETAMT) AMT FROM BISL061 ";
    sql += "WHERE " + tabType + " IN ("
        for (i=0;i<authCodeList.length;i++) {
            sql += "'" + authCodeList[i] + "'"
            if (i < authCodeList.length - 1) {
            sql += ","
            }
        }
    sql += ") ";
    sql += "AND    SALEDT BETWEEN SUBSTR(TO_CHAR(SYSDATE,'YYYYMMDD'),1,4)||'0101' AND TO_CHAR(ADD_TIME(SYSDATE, '0/0/-1 0:0:0'),'YYYYMMDD') ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SUNM, " + tabType + ") ";
    sql += "UNION ALL ";
    sql += "SELECT SUNM, " + tabType + ", 0 AS SALE_TOT, 0 AS AMT, SALE_MONTH_TOT, TARGETAMT AS MONTH_AMT FROM ( ";
    sql += "SELECT SUNM, " + tabType + ", SUM((JAMT+DCAMT+GAMT+ADVDEPAMT))AS SALE_MONTH_TOT, SUM(TARGETAMT) TARGETAMT FROM BISL061 ";
    sql += "WHERE " + tabType + " IN ("
        for (i=0;i<authCodeList.length;i++) {
            sql += "'" + authCodeList[i] + "'"
            if (i < authCodeList.length - 1) {
                sql += ","
            }
        }
    sql += ") ";
    sql += "AND SALEDT BETWEEN SUBSTR(TO_CHAR(SYSDATE,'YYYYMMDD'),1,6)||'01' AND TO_CHAR(ADD_TIME(SYSDATE, '0/0/-1 0:0:0'),'YYYYMMDD') ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SUNM, " + tabType + ") ";
    sql += ")GROUP BY SUNM, " + tabType + "";

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
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getCurrentYearData = (req, res) => {
    console.log("============== getCurrentYearData Call ======================");

    let tabType = req.query.tabType;
    let code = req.query.code;
    let last30day = req.query.last30day;
    let date = req.query.date;
    let searchType = req.query.searchType.toString();
    let start_date = "";

    // 일별매출, 일별매출목표
    let sql = "SELECT"
    if(searchType == "1") {
        start_date = last30day;
        sql += " SALEDT, "
    } else if(searchType == "2") {
        start_date = (Number(date.substr(0, 4))-1).toString() + date.substr(4, 2) +'01';
        sql += " TO_CHAR(TO_DATE(SALEDT, 'YYYYMMDD'), 'YYYY/MM') SALEDT, "
    } else {
        start_date = (Number(date.substr(0, 4))-4)+'0101';
        sql += " TO_CHAR(TO_DATE(SALEDT, 'YYYYMMDD'), 'YYYY') SALEDT, "
    }
    if(code == "A") {
        sql += "'ALL' AS "
    } 
    sql += "SUNM, SUM(TARGETAMT) AS AMT, SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS SALE_TOT FROM BISL061 "
    sql += "WHERE SALEDT BETWEEN '" + start_date + "' AND '" + date + "' "
    if(code != "A") {
        sql += "AND " + tabType + " = '" + code + "' "
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SALEDT "
    if(code != "A") {
        sql += ", SUNM "
    }
    sql += "ORDER BY SALEDT "
    
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

    // 당일 판매, 반품 수량
    let sql = "SELECT "
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
    if(code != "A") {
        sql += "AND " + tabType + " = '" + code + "' "
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SALEDT "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSalesChartAMT = (req, res) => {
    console.log("============== getSalesChartAMT Call ======================");

    let tabType = req.query.tabType;
    let code = req.query.code;
    let date = req.query.date;

    // 당일 판매, 반품 금액
    let sql ="SELECT SALEDT, SUM(JSAMT) JAMT, SUM(DCSAMT) DCAMT, SUM(GSAMT) GAMT, SUM(JRAMT) R_JAMT, SUM(DCRAMT) R_DCAMT, SUM(GRAMT) R_GAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISL061 "
    sql += "WHERE SALEDT = '"+ date +"' "
    if(code != "A") {
        sql += "AND " + tabType + " = '" + code + "' "
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SALEDT "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

// 매출 추이 월간(누적)
exports.getCumulativeSales = (req, res) => {
    console.log("============== getCumulativeSales Call ======================");

    let tabType = req.query.tabType;
    let code = req.query.code;
    let date = req.query.date;

    let allCode = ""
    let allName = ""
    let strTxt2 = ""
    if(code == "A") {
        allCode = "'ALL' AS "
        allName = "'전체' AS "
    } else {
        strTxt2 = "SUNM, SUCD, "
    }

    // 매출 추이 누적
    let sql ="SELECT " + allName + "SUNM, " + allCode + "SUCD, SUBSTR(SALEDT, 5, 2) AS SALEDT, "
    sql += "    SUM(NOW_MONTH_TOT) AS SALE_TOT, ";
    sql += "    SUM(PRE_MONTH_TOT) AS LY_SALE_TOT, ";
    sql += "    SUM(TARGETAMT) AS AMT ";
    sql += "FROM   (SELECT " + strTxt2 + "SUBSTR(SALEDT, 1, 6) AS SALEDT, ";
    sql += "            SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS NOW_MONTH_TOT, ";
    sql += "            0 AS PRE_MONTH_TOT, ";
    sql += "            SUM(TARGETAMT) AS TARGETAMT ";
    sql += "        FROM   BISL061 ";
    sql += "        WHERE  SALEDT BETWEEN SUBSTR(TO_CHAR(SYSDATE, 'YYYYMMDD'), 1, 4)||'0101' AND TO_CHAR(ADD_TIME(SYSDATE, '0/0/-1 0:0:0'), 'YYYY')||'1231' ";
    if(code != "A") {
        sql += "    AND " + tabType + " = '" + code + "' ";
    }
    sql += "        AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "        GROUP BY " + strTxt2 + "SALEDT ";
    sql += "        UNION ALL ";
    sql += "        SELECT " + strTxt2 + "SUBSTR(SALEDT, 1, 6) AS SALEDT, ";
    sql += "            0 AS NOW_MONTH_TOT, ";
    sql += "            SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS PRE_MONTH_TOT, ";
    sql += "            0 AS TARGETAMT ";
    sql += "        FROM   BISL061 ";
    sql += "        WHERE  SALEDT BETWEEN TO_CHAR(ADD_TIME(SYSDATE, '-1/0/0 0:0:0'), 'YYYY')||'0101' AND TO_CHAR(ADD_TIME(SYSDATE, '-1/0/0 0:0:0'), 'YYYY')||'1231'";
    if(code != "A") {
        sql += "    AND " + tabType + " = '" + code + "' ";
    }
    sql += "        AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "        GROUP BY " + strTxt2 + "SALEDT ) ";
    sql += "GROUP BY " + strTxt2 + "SALEDT ";
    sql += "ORDER BY SALEDT ";

    console.log("getCumulativeSales >>> ", sql)
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};
