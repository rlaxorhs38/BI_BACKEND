var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res, next) => {
    console.log("============== getMakeDataDate Call ======================");

    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BISL060";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getStoreDailyList = (req, res) => {
    console.log("============== getStoreDailyList Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let date = req.query.date;
    let selectStoreList = req.query.selectStoreList.split(',')

    // 매장 매출순위 팝업 리스트 개수
    // 당일매출 순위 (일간)
    let sql = "SELECT ROWNUM() RN, VDCD, VDSNM, SALE_TOT, QTY_TOT, JAMT, JQTY, DCAMT, DCQTY, GAMT, GQTY, R_JAMT, R_JQTY, R_DCAMT, R_DCQTY, R_GAMT, R_GQTY, ADVDEPAMT FROM ( "
    sql += "SELECT VDCD, VDSNM, SUM(SALE_TOT) SALE_TOT, SUM(QTY_TOT) QTY_TOT, SUM(JAMT) JAMT, SUM(JQTY) JQTY, SUM(DCAMT) DCAMT, SUM(DCQTY) DCQTY, "
    sql += "SUM(GAMT) GAMT, SUM(GQTY) GQTY, SUM(R_JAMT) R_JAMT, SUM(R_JQTY) R_JQTY, SUM(R_DCAMT) R_DCAMT, SUM(R_DCQTY) R_DCQTY, SUM(R_GAMT) R_GAMT, SUM(R_GQTY) R_GQTY, SUM(ADVDEPAMT) ADVDEPAMT FROM ( "
    sql += "SELECT SUCD, VDCD, VDSNM, SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS SALE_TOT, SUM(JQTY+DCQTY+GQTY) AS QTY_TOT, "
    sql += "JSAMT JAMT, JSQTY JQTY, DCSAMT DCAMT, DCSQTY DCQTY, GSAMT GAMT, GSQTY GQTY, "
    sql += "JRAMT R_JAMT, JRQTY R_JQTY, DCRAMT R_DCAMT, DCRQTY R_DCQTY, GRAMT R_GAMT, GRQTY R_GQTY, "
    sql += "ADVDEPAMT "
    sql += "FROM BISL060 "
    sql += "WHERE 1=1 "
    sql += "AND SALEDT = '"+ moment(date).format("YYYYMMDD") +"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) ";
    sql += "GROUP BY SUCD, VDCD, VDSNM, JAMT, JQTY, DCAMT, DCQTY, GAMT, GQTY, R_JAMT, R_JQTY, R_DCAMT, R_DCQTY, R_GAMT, R_GQTY, ADVDEPAMT "
    sql += "HAVING " + tabType + " = '" + selectedCODE +  "' "
    sql += "AND VDCD IN ("
    for (let i=0;i<selectStoreList.length;i++) {
    sql += "'" + selectStoreList[i] + "'"
    if (i < selectStoreList.length - 1) {
        sql += ","
    }
    }
    sql += ") "
    sql += "ORDER BY SALE_TOT DESC "
    sql += ") "
    sql += "GROUP BY VDCD, VDSNM "
    sql += ") "
    sql += "ORDER BY SALE_TOT DESC"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getStoreMonthList = (req, res) => {
    console.log("============== getStoreMonthList Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let year = req.query.year;
    let month = req.query.month;
    let selectStoreList = req.query.selectStoreList.split(',');
    
    if (month.toString().length == 1) {
        month = "0" + month
    }
    
    // 당일매출 순위 (월간)
    let sql = "SELECT ROWNUM() RN, VDCD, VDSNM, SALE_TOT, QTY_TOT, "
    sql += "JAMT, JQTY, DCAMT, DCQTY, GAMT, GQTY, "
    sql += "R_JAMT, R_JQTY, R_DCAMT, R_DCQTY, R_GAMT, R_GQTY, "
    sql += "ADVDEPAMT FROM ( "
    sql += "SELECT SUCD, VDCD, VDSNM, SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS SALE_TOT, SUM(JQTY+DCQTY+GQTY) AS QTY_TOT, "
    sql += "SUM(JSAMT) JAMT, SUM(JSQTY) JQTY, SUM(DCSAMT) DCAMT, SUM(DCSQTY) DCQTY, SUM(GSAMT) GAMT, SUM(GSQTY) GQTY, "
    sql += "SUM(JRAMT) R_JAMT, SUM(JRQTY) R_JQTY, SUM(DCRAMT) R_DCAMT, SUM(DCRQTY) R_DCQTY, SUM(GRAMT) R_GAMT, SUM(GRQTY) R_GQTY, SUM(ADVDEPAMT) ADVDEPAMT "
    sql += "FROM BISL060 "
    sql += "WHERE 1=1 "
    sql += "AND SUBSTR(SALEDT,1,6) = '" + year + month +"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) ";
    sql += "GROUP BY SUCD, VDCD, VDSNM "
    sql += "HAVING " + tabType + " = '" + selectedCODE +  "' "
    sql += "AND VDCD IN ("
    for (let i=0;i<selectStoreList.length;i++) {
    sql += "'" + selectStoreList[i] + "'"
    if (i < selectStoreList.length - 1) {
        sql += ","
    }
    }
    sql += ") "
    sql += "ORDER BY SALE_TOT DESC "
    sql += ")"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getStoreCumulativeList = (req, res) => {
    console.log("============== getStoreCumulativeList Call ======================");
    
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let year = req.query.year;
    let selectStoreList = req.query.selectStoreList.split(',');
    
    // 당일매출 순위 (누적)
    let sql = "SELECT ROWNUM() RN, VDCD, VDSNM, SALE_TOT, QTY_TOT, "
    sql += "JAMT, JQTY, DCAMT, DCQTY, GAMT, GQTY, "
    sql += "R_JAMT, R_JQTY, R_DCAMT, R_DCQTY, R_GAMT, R_GQTY, "
    sql += "ADVDEPAMT FROM ( "
    sql += "SELECT SUCD, VDCD, VDSNM, SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS SALE_TOT, SUM(JQTY+DCQTY+GQTY) AS QTY_TOT, "
    sql += "SUM(JSAMT) JAMT, SUM(JSQTY) JQTY, SUM(DCSAMT) DCAMT, SUM(DCSQTY) DCQTY, SUM(GSAMT) GAMT, SUM(GSQTY) GQTY, "
    sql += "SUM(JRAMT) R_JAMT, SUM(JRQTY) R_JQTY, SUM(DCRAMT) R_DCAMT, SUM(DCRQTY) R_DCQTY, SUM(GRAMT) R_GAMT, SUM(GRQTY) R_GQTY, SUM(ADVDEPAMT) ADVDEPAMT "
    sql += "FROM BISL060 "
    sql += "WHERE 1=1 "
    sql += "AND SUBSTR(SALEDT,1,6) BETWEEN '"+ year + "01" +"' AND '" + year + "12" +"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) ";
    sql += "GROUP BY SUCD, VDCD, VDSNM "
    sql += "HAVING " + tabType + " = '" + selectedCODE +  "' "
    sql += "AND VDCD IN ("
    for (let i=0;i<selectStoreList.length;i++) {
    sql += "'" + selectStoreList[i] + "'"
    if (i < selectStoreList.length - 1) {
        sql += ","
    }
    }
    sql += ") "
    sql += "ORDER BY SALE_TOT DESC "
    sql += ")"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};