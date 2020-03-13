var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res, next) => {
    console.log("============== getMakeDataDate Call ======================");

    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BISL060";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getDailyData = (req, res) => {
    console.log("============== getDailyData Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let store = req.query.store;
    let date = req.query.date;
    
    // 매장 팝업 일간 상단
    let sql ="SELECT JAMT, DCAMT, GAMT, ADVDEPAMT, JQTY, DCQTY, GQTY, JAMT+DCAMT+GAMT+ADVDEPAMT TOT_AMT, JQTY+DCQTY+GQTY TOT_QTY FROM BISL060 "
    sql += "WHERE SALEDT = '" + moment(date).format("YYYYMMDD") + "' "
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    sql += "AND VDCD = '" + store + "'" // 부모 페이지에서 받아온 매장코드
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getDailyChartCountData = (req, res) => {
    console.log("============== getDailyChartCountData Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let store = req.query.store;
    let date = req.query.date;
    
    // 매장 팝업 일간 매출유형 당일 판매 반품수량
    let sql ="SELECT SALEDT, SUM(JSQTY) JQTY, SUM(DCSQTY) DCQTY, SUM(GSQTY) GQTY, SUM(JRQTY) R_JQTY, SUM(DCRQTY) R_DCQTY, SUM(GRQTY) R_GQTY FROM BISL060 "
    sql += "WHERE SALEDT = '" + moment(date).format("YYYYMMDD") + "' "
    sql += "AND VDCD = '" + store + "' "
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) ";
    sql += "GROUP BY SALEDT "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getDailyChartAMTData = (req, res) => {
    console.log("============== getDailyChartAMTData Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let store = req.query.store;
    let date = req.query.date;
    
    // 매장 팝업 일간 매출유형 당일 판매 반품금액
    let sql ="SELECT SALEDT, SUM(JSAMT) JAMT, SUM(DCSAMT) DCAMT, SUM(GSAMT) GAMT, SUM(JRAMT) R_JAMT, SUM(DCRAMT) R_DCAMT, SUM(GRAMT) R_GAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISL060 "
    sql += "WHERE SALEDT = '" + moment(date).format("YYYYMMDD") + "' "
    sql += "AND VDCD = '" + store + "' "
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) ";
    sql += "GROUP BY SALEDT "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getDailyChartListData = (req, res) => {
    console.log("============== getDailyChartListData Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let store = req.query.store;
    let date = req.query.date;
   
    let lastYear30day = moment(date).subtract(30, 'days').subtract(1, 'year').format("YYYYMMDD")
    let lastYearSelectDay = moment(date).subtract(1, 'year').format("YYYYMMDD")
    
    // 매출추이
    // 작년동기매출
    let sql = "SELECT SALEDT, SUNM, TRUNC(SUM(JAMT+DCAMT+GAMT+ADVDEPAMT)/1000) LY_SALE_TOT FROM BISL060 "
    sql += "WHERE VDCD = '" + store + "' "
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    sql += "AND SALEDT BETWEEN '" + lastYear30day + "' AND  '" + lastYearSelectDay + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) ";
    sql += "GROUP BY SALEDT, SUNM "
    sql += "ORDER BY SALEDT "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getCurrentYearData = (req, res) => {
    console.log("============== getCurrentYearData Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let store = req.query.store;
    let date = req.query.date;
   
    let currentday = moment(date).format("YYYYMMDD")
    let last30day = moment(date).subtract(30, 'days').format("YYYYMMDD")
    
    // 일별매출, 일별매출목표
    let sql = "SELECT SALEDT, SUNM, TRUNC(SUM(JAMT+DCAMT+GAMT+ADVDEPAMT)/1000) SALE_TOT FROM BISL060 "
    sql += "WHERE VDCD = '" + store + "' "
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    sql += "AND SALEDT BETWEEN '" + last30day + "' AND  '" + currentday + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) ";
    sql += "GROUP BY SALEDT, SUNM "
    sql += "ORDER BY SALEDT "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getDailyStoreListData = (req, res) => {
    console.log("============== getDailyStoreListData Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let selectStoreSU = req.query.selectStoreSU;
    let date = req.query.date;

    // 매장 팝업 일간 매장별 매출순위
    let sql ="SELECT ROWNUM() RN, VDSNM, VDCD, SALE_TOT, QTY_TOT, JAMT, JQTY, DCAMT, DCQTY, GAMT, GQTY, ADVDEPAMT FROM ( "
    sql += "SELECT VDSNM, VDCD, SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS SALE_TOT, SUM(JQTY+DCQTY+GQTY) AS QTY_TOT, "
    sql += "JAMT, JQTY, DCAMT, DCQTY, GAMT, GQTY, ADVDEPAMT FROM BISL060 "
    sql += "WHERE " + tabType + " = '" + selectedCODE + "' "
    // if (selectStoreSU) {
    // sql += "AND  SUCD = '" + selectStoreSU + "' "
    // }
    sql += "AND SALEDT = '" + moment(date).format("YYYYMMDD") + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) ";
    sql += "GROUP BY VDSNM, VDCD, JAMT, JQTY, DCAMT, DCQTY, GAMT, GQTY, ADVDEPAMT "
    sql += "ORDER BY SALE_TOT DESC)"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};