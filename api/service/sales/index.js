var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res, next) => {
    console.log("============== getMakeDataDate Call ======================");

    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BIFN050";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getTotalSalesData = (req, res) => {
    console.log("============== getTotalSalesData Call ======================");
    
    let date = req.query.date;
    let tabType = req.query.tabType;
    let CODETab = req.query.CODETab;
    
    let currentData = moment(date).format("YYYYMMDD")
    let currentYear = moment(date).format("YYYY")
    let monthStartDate = moment(date).startOf('month').format("MMDD")
    let currentYearMonthStartDate = currentYear + monthStartDate
    let currentYearStartMonthDate = currentYear + "0101"

    let sql = "SELECT SUM(Y_SAMT) Y_SAMT, SUM(Y_GAMT) Y_GAMT, SUM(Y_ADVDEPAMT) Y_ADVDEPAMT, SUM(M_SAMT) M_SAMT, SUM(M_GAMT) M_GAMT, SUM(M_ADVDEPAMT) M_ADVDEPAMT, SUM(M_TTAGPRI) M_TTAGPRI, SUM(M_PROFIT) M_PROFIT, SUM(M_LMPROFIT) M_LMPROFIT FROM ( "
    sql += "SELECT Y_SAMT, Y_GAMT, Y_ADVDEPAMT, 0 AS M_SAMT, 0 AS M_GAMT, 0 AS M_ADVDEPAMT, 0 AS M_TTAGPRI, 0 AS M_PROFIT, 0 AS M_LMPROFIT FROM ( "
    sql += "SELECT SUM(TSAMT) Y_SAMT, SUM(GAMT) Y_GAMT, SUM(ADVDEPAMT) Y_ADVDEPAMT FROM BISA010 "
    sql += "WHERE SALEDT BETWEEN '" + currentYearStartMonthDate +"' AND '" + currentData + "' "
    sql += "AND " + tabType + " = '" + CODETab + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISA010) ";
    sql += ") "
    sql += "UNION ALL "
    sql += "SELECT 0 AS Y_SAMT, 0 AS Y_GAMT, 0 AS Y_ADVDEPAMT, M_SAMT, M_GAMT, M_ADVDEPAMT, M_TTAGPRI, M_PROFIT, M_LMPROFIT FROM ( "
    sql += "SELECT SUM(TSAMT) M_SAMT, SUM(GAMT) M_GAMT, SUM(ADVDEPAMT) M_ADVDEPAMT, SUM(TTAGPRI) M_TTAGPRI, SUM(PROFIT) M_PROFIT, SUM(LMPROFIT) M_LMPROFIT FROM BISA010 "
    sql += "WHERE SALEDT BETWEEN '" + currentYearMonthStartDate + "' AND '" + currentData + "' "
    sql += "AND " + tabType + " = '" + CODETab + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISA010) ";
    sql += "))"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getYearSalesData = (req, res) => {
    console.log("============== getYearSalesData Call ======================");
    let date = req.query.date;
    let tabType = req.query.tabType;
    let CODETab = req.query.CODETab;
    
    let currentData = moment(date).format("YYYYMMDD")
    let lastYearSelectDay = moment(date).subtract(1, 'year').format("YYYYMMDD")
    
    // 연매출추이
    let sql = "SELECT SUBSTR(SALEDT , 1, 6) SALEDT, SUM(LTSAMT) LTSAMT, SUM(GAMT) GAMT, SUM(TSAMT) TSAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISA010 "
    sql += "WHERE SALEDT BETWEEN '" + lastYearSelectDay +"' AND '" + currentData + "' "
    sql += "AND " + tabType + " = '" + CODETab + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISA010) ";
    sql += "GROUP BY SALEDT "
    sql += "ORDER BY SALEDT"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getMonthSalesData = (req, res) => {
    console.log("============== getMonthSalesData Call ======================");
    let date = req.query.date;
    let tabType = req.query.tabType;
    let CODETab = req.query.CODETab;

    let currentData = moment(date).format("YYYYMMDD")
    let last30day = moment(date).subtract(30, 'days').format("YYYYMMDD")

    // 월매출 추이
    let sql = "SELECT SALEDT, SUM(LTSAMT) LTSAMT, SUM(GAMT) GAMT, SUM(TSAMT) TSAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISA010 "
    sql += "WHERE SALEDT BETWEEN '" + last30day +"' AND '" + currentData + "' "
    sql += "AND " + tabType + " = '" + CODETab + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISA010) ";
    sql += "GROUP BY SALEDT "
    sql += "ORDER BY SALEDT"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getMonthDiscountData = (req, res) => {
    console.log("============== getMonthDiscountData Call ======================");
    let date = req.query.date;
    let tabType = req.query.tabType;
    let CODETab = req.query.CODETab;

    let currentData = moment(date).format("YYYYMMDD")
    let lastYearSelectDay = moment(date).subtract(1, 'year').format("YYYYMMDD")

    // 평균할인율 추이
    let sql = "SELECT SUBSTR(SALEDT , 1, 6) SALEDT, SUM(TTAGPRI) TTAGPRI, SUM(TSAMT) TSAMT, SUM(LTTAGPRI) LTTAGPRI, SUM(LTSAMT) LTSAMT FROM BISA010 "
    sql += "WHERE SALEDT BETWEEN '" + lastYearSelectDay +"' AND '" + currentData + "' "
    sql += "AND " + tabType + " = '" + CODETab + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISA010) ";
    sql += "GROUP BY SALEDT "
    sql += "ORDER BY SALEDT"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getMonthTotalSalesData = (req, res) => {
    console.log("============== getMonthTotalSalesData Call ======================");
    let date = req.query.date;
    let tabType = req.query.tabType;
    let CODETab = req.query.CODETab;

    let currentData = moment(date).format("YYYYMMDD")
    let lastYearSelectDay = moment(date).subtract(1, 'year').format("YYYYMMDD")

    // 매출총이익 추이
    let sql = "SELECT SUBSTR(SALEDT , 1, 6) SALEDT, SUM(PROFIT) PROFIT, SUM(LPROFIT) LPROFIT FROM BISA010 "
    sql += "WHERE SALEDT BETWEEN '" + lastYearSelectDay +"' AND '" + currentData + "' "
    sql += "AND " + tabType + " = '" + CODETab + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISA010) ";
    sql += "GROUP BY SALEDT "
    sql += "ORDER BY SALEDT"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};