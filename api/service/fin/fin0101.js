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
    let date = req.query.date;
    let authCodeList = req.query.authCodeList.split(',');
    let monthStartDate = req.query.monthStartDate;

    // 당일 매출, 당일 매출 목표, 월 누적매출, 일 매출 목표, 일 매출 달성률
    let sql = "SELECT SUNM, " + tabType + " MCODE, SUM(SALE_TOT) AS SALE_TOT, SUM(AMT) AMT, SUM(SALE_MONTH_TOT) AS SALE_MONTH_TOT, SUM(MONTH_AMT) AS MONTH_AMT FROM ( ";
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
    sql += "AND SALEDT = '" + date + "' ";
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
    sql += "AND SALEDT >= '" + monthStartDate + "' ";
    sql += "AND SALEDT <= '" + date + "' ";
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

    // 매출추이
    // 작년동기매출
    let sql = "SELECT SALEDT, SUNM, TRUNC(SUM(JAMT+DCAMT+GAMT+ADVDEPAMT)/1000000) AS LY_SALE_TOT FROM BISL061 "
    sql += "WHERE " + tabType + " = '" + code + "' "
    sql += "AND SALEDT BETWEEN '" + lastYear30day + "' AND '" + lastYearSelectDay + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SALEDT, SUNM "
    sql += "ORDER BY SALEDT"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getCurrentYearData = (req, res) => {
    console.log("============== getCurrentYearData Call ======================");

    let tabType = req.query.tabType;
    let code = req.query.code;
    let last30day = req.query.last30day;
    let date = req.query.date;

    // 일별매출, 일별매출목표
    let sql = "SELECT SALEDT, SUNM, TRUNC(SUM(TARGETAMT)/1000000) AS AMT, TRUNC(SUM(JAMT+DCAMT+GAMT+ADVDEPAMT)/1000000) AS SALE_TOT FROM BISL061 "
    sql += "WHERE " + tabType + " = '" + code + "' "
    sql += "AND SALEDT BETWEEN '" + last30day + "' AND '" + date + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SALEDT, SUNM "
    sql += "ORDER BY SALEDT "

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
    sql += "HAVING " + tabType + " = '" + code + "' "
    sql += "ORDER BY SALE_TOT "
    sql += ")"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSalesChartCount = (req, res) => {
    console.log("============== getSalesChartCount Call ======================");

    let tabType = req.query.tabType;
    let code = req.query.code;
    let date = req.query.date;

    // 당일 판매, 반품 수량
    let sql ="SELECT SALEDT, SUM(JSQTY) JQTY, SUM(DCSQTY) DCQTY, SUM(GSQTY) GQTY, SUM(JRQTY) R_JQTY, SUM(DCRQTY) R_DCQTY, SUM(GRQTY) R_GQTY FROM BISL061 "
    sql += "WHERE " + tabType + " = '" + code + "' "
    sql += "AND SALEDT = '"+ date +"' "
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
    sql += "WHERE " + tabType + " = '" + code + "' "
    sql += "AND SALEDT = '"+ date +"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SALEDT "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

