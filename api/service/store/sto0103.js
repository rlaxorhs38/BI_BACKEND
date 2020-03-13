var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res, next) => {
    console.log("============== getMakeDataDate Call ======================");

    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BISH041";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getHeaderData = (req, res) => {
    console.log("============== getHeaderData Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let year = req.query.year;
    let store = req.query.store;
    
    // 매장 상세 상단카드4개(월간)
    let sql = "SELECT VDCD, SUM(GAMT) GAMT, SUM(TSAMT) TSAMT, SUM(INQTY) INQTY, SUM(SQTY) SQTY, SUM(TQTY) TQTY, SUM(RQTY) RQTY, SUM(TTAGPRI) TTAGPRI, SUM(ADVDEPAMT) ADVDEPAMT FROM BISH041 "
    sql += "WHERE " + tabType + " = '" + selectedCODE + "' "
    sql += "AND VDCD = '" + store + "' "
    sql += "AND SALEYY = '" + year + "' "
    // sql += "AND SALEMM = '" + month + "' " //월간일때는 선택월
    sql += "AND SALEMM BETWEEN '01' AND '12' " //누적일때는 무조건 1월~12월
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) ";
    sql += "GROUP BY VDCD"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSalesChartData = (req, res) => {
    console.log("============== getSalesChartData Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let year = req.query.year;
    let store = req.query.store;
    
    // 월 매출비교 그래프(월간,누적)
    let sql = "SELECT VDCD, SUM(LTSAMT) LTSAMT, SUM(LMTSAMT) LMTSAMT, SUM(TSAMT) TSAMT, SUM(LGAMT) LGAMT, SUM(LMGAMT) LMGAMT, SUM(GAMT) GAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISH041 "
    sql += "WHERE " + tabType + " = '" + selectedCODE + "' "
    sql += "AND VDCD = '" + store + "' "
    sql += "AND SALEYY = '" + year + "' "
    // sql += "AND SALEMM = '" + month + "' " //월간일때는 선택월
    sql += "AND SALEMM BETWEEN '01' AND '12' " //누적일때는 무조건 1월~12월
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) ";
    sql += "GROUP BY VDCD"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSalesLineCharData = (req, res) => {
    console.log("============== getSalesLineCharData Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let year = req.query.year;
    let store = req.query.store;
    
    // 매출추이 그래프(월간,누적)
    let sql = "SELECT SALEMM, SUM(LTSAMT) LTSAMT, SUM(TSAMT) TSAMT FROM BISH041 "
    sql += "WHERE " + tabType + " = '" + selectedCODE + "' "
    sql += "AND VDCD = '" + store + "' "
    sql += "AND SALEYY = '" + year + "' "
    // sql += "AND SALEMM BETWEEN '01' AND '" + month + "' " //월간일때는 1월~선택월
    sql += "AND SALEMM BETWEEN '01' AND '12' " //누적일때는 무조건 1월~12월
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) ";
    sql += "GROUP BY SALEMM "
    sql += "ORDER BY SALEMM"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSalesAnalysisData = (req, res) => {
    console.log("============== getSalesAnalysisData Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let year = req.query.year;
    let store = req.query.store;
    
    // 매출분석(월간,누적)
    let sql = "SELECT SUM(SJAMT) SJAMT, SUM(SDCAMT) SDCAMT, SUM(SGAMT) SGAMT, SUM(RJAMT) RJAMT, SUM(RDCAMT) RDCAMT, SUM(RGAMT) RGAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISH041 "
    sql += "WHERE " + tabType + " = '" + selectedCODE + "' "
    sql += "AND VDCD = '" + store + "' "
    sql += "AND SALEYY = '" + year + "' "
    // sql += "AND SALEMM = '" + month + "' " //월간일때는 선택월
    sql += "AND SALEMM BETWEEN '01' AND '12' " //누적일때는 무조건 1월~12월
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};