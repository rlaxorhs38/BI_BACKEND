var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getRecentBIFN050Date = (req, res) => {
    console.log("============== getRecentBIFN050Date Call ======================");

    let sql = "SELECT MAX(TO_NUMBER(YYYY)) YYYY, MAX(TO_NUMBER(MM)) MM FROM BIFN050 ";
    sql += "WHERE YYYY = (SELECT MAX(YYYY) FROM BIFN050)";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getRecentBIFN051Date = (req, res) => {
    console.log("============== getRecentBIFN051Date Call ======================");

    let sql = "SELECT MAX(TO_NUMBER(YYYY)) YYYY, MAX(TO_NUMBER(MM)) MM FROM BIFN051 ";
    sql += "WHERE YYYY = (SELECT MAX(YYYY) FROM BIFN051)";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getDailySalesData = (req, res) => {
    console.log("============== getDailySalesData Call ======================");

    let tabType = req.query.tabType;
    let date = req.query.date;
    let authCodeList = req.query.authCodeList.split(',');

    // 사업부별 일매출, 달성률
    let sql = "SELECT SUNM, " + tabType + " MCODE, TARGETAMT AMT, SUM(JAMT+DCAMT+GAMT+ADVDEPAMT)AS SALE_TOT FROM BISL061 ";
    sql += "WHERE " + tabType + " IN ("
    for (let i=0;i<authCodeList.length;i++) {
        sql += "'" + authCodeList[i] + "'"
        if (i < authCodeList.length - 1) {
            sql += ","
        }
    }
    sql += ") ";
    sql += "AND SALEDT = '" + date + "' ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL061) ";
    sql += "GROUP BY SUNM, " + tabType + ", AMT";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSaleData = (req, res) => {
    console.log("============== getSaleData Call ======================");

    let f_year = req.query.f_year;
    let f_month = req.query.f_month;
    let SUCDs = req.query.SUCDs.split(',');

    // 매출 당월합계, 당월목표합계
    let sql = "SELECT SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM ( ";
    sql += "SELECT SUCD, PLNAMT, RSLTAMT FROM BIFN050 ";
    sql += "WHERE SECGBN = '01' ";
    sql += "AND YYYY = '" + f_year + "' ";
    sql += "AND MM = '" + f_month + "' ";
    sql += "AND SUCD IN ("
    for (let i=0;i<SUCDs.length;i++) {
    sql += "'" + SUCDs[i] + "'"
    if (i < SUCDs.length - 1) {
        sql += ","
    }
    }
    sql += ") ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
    sql += "ORDER BY SUCD)"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getTotSaleData = (req, res) => {
    console.log("============== getTotSaleData Call ======================");

    let f_year = req.query.f_year;
    let f_month = req.query.f_month;
    let SUCDs = req.query.SUCDs.split(',');

    if (f_year != moment().format("YYYY")) {
        f_month = "12"
    }

    // 매출 누계합계, 누계목표합계
    let sql = "SELECT SUM(PLNAMT) TOT_PLNAMT, SUM(RSLTAMT) TOT_RSLTAMT FROM ( ";
    sql += "SELECT SUCD, PLNAMT, RSLTAMT FROM BIFN050 ";
    sql += "WHERE SECGBN = '01' ";
    sql += "AND YYYY = '" + f_year + "' ";
    sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + f_month + " ";
    sql += "AND SUCD IN ("
    for (let i=0;i<SUCDs.length;i++) {
      sql += "'" + SUCDs[i] + "'"
      if (i < SUCDs.length - 1) {
        sql += ","
      }
    }
    sql += ") ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
    sql += "ORDER BY SUCD)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getCashData = (req, res) => {
    console.log("============== getCashData Call ======================");

    let f_year = req.query.f_year;
    let f_month = req.query.f_month;
    let SUCDs = req.query.SUCDs.split(',');

    // 현금 당월합계, 당월목표합계
    let sql = "SELECT SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT FROM BIFN050 ";
    sql += "WHERE SECGBN = '02' ";
    sql += "AND YYYY = '" + f_year + "' ";
    sql += "AND MM = '" + f_month + "' ";
    sql += "AND SUCD IN ("
    for (let i=0;i<SUCDs.length;i++) {
    sql += "'" + SUCDs[i] + "'"
    if (i < SUCDs.length - 1) {
        sql += ","
    }
    }
    sql += ") ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getTotCashData = (req, res) => {
    console.log("============== getTotCashData Call ======================");

    let f_year = req.query.f_year;
    let f_month = req.query.f_month;
    let SUCDs = req.query.SUCDs.split(',');

    if (f_year != moment().format("YYYY")) {
        f_month = "12"
    }
    // 현금 누계합계, 누계목표합계
    let sql = "SELECT SUM(PLNAMT) TOT_PLNAMT, SUM(RSLTAMT) TOT_RSLTAMT, SUM(LYRSLTAMT) TOT_LMRSLTAMT FROM BIFN050 ";
    sql += "WHERE SECGBN = '02' ";
    sql += "AND YYYY = '" + f_year + "' ";
    sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + f_month + " ";
    sql += "AND SUCD IN ("
    for (let i=0;i<SUCDs.length;i++) {
    sql += "'" + SUCDs[i] + "'"
    if (i < SUCDs.length - 1) {
        sql += ","
    }
    }
    sql += ") ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getProfitData = (req, res) => {
    console.log("============== getProfitData Call ======================");

    let f_year = req.query.f_year;
    let f_month = req.query.f_month;
    let SUCDs = req.query.SUCDs.split(',');

    // 영업이익 당월합계, 당월목표합계
    let sql = "SELECT SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 ";
    sql += "WHERE SECGBN = '05' ";
    sql += "AND YYYY = '" + f_year + "' ";
    sql += "AND MM = '" + f_month + "' ";
    sql += "AND SUCD IN ("
    for (let i=0;i<SUCDs.length;i++) {
    sql += "'" + SUCDs[i] + "'"
    if (i < SUCDs.length - 1) {
        sql += ","
    }
    }
    sql += ") ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getTotProfitData = (req, res) => {
    console.log("============== getTotProfitData Call ======================");

    let f_year = req.query.f_year;
    let f_month = req.query.f_month;
    let SUCDs = req.query.SUCDs.split(',');

    if (f_year != moment().format("YYYY")) {
        f_month = "12"
        }
    // 영업이익 누계합계, 누계목표합계
    let sql = "SELECT SUM(PLNAMT) TOT_PLNAMT, SUM(RSLTAMT) TOT_RSLTAMT FROM BIFN050 ";
    sql += "WHERE SECGBN = '05' ";
    sql += "AND YYYY = '" + f_year + "' ";
    sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + f_month + " ";
    sql += "AND SUCD IN ("
    for (let i=0;i<SUCDs.length;i++) {
    sql += "'" + SUCDs[i] + "'"
    if (i < SUCDs.length - 1) {
        sql += ","
    }
    }
    sql += ") ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStockData = (req, res) => {
    console.log("============== getStockData Call ======================");

    let date = req.query.date;
    let currentYear = req.query.currentYear;
    // let yearCode = req.query.yearCode;
    // let fs_yearCode = req.query.fs_yearCode;
    // let fe_yearCode = req.query.fe_yearCode;
    // let du_yearCode = req.query.du_yearCode;
    // let SUCDs = req.query.SUCDs.split(',');

    let currentMonth = moment(date).format("M")
    // let lastMonthYear = moment(date).subtract(1, 'month').format("YYYY")
    // let lastMonth = moment(date).subtract(1, 'month').format("M")
    // let lastYear = moment(date).subtract(1, 'year').format("YYYY")

    // 사업부별 재품제고 누적합계, 전월증감함계, 기말증감합계 그래프
    let sql = "SELECT STOCK, PRDTYY, CU_1_TOT, LM_1_TOT, DU_1_TOT, (CU_1_TOT+LM_1_TOT+DU_1_TOT) TOT1, CU_2_TOT, LM_2_TOT, DU_2_TOT, (CU_2_TOT+LM_2_TOT+DU_2_TOT) TOT2, CU_3_TOT, LM_3_TOT, DU_3_TOT, (CU_3_TOT+LM_3_TOT+DU_3_TOT) TOT3, CU_4_TOT, LM_4_TOT, DU_4_TOT, (CU_4_TOT+LM_4_TOT+DU_4_TOT) TOT4 FROM ( "
    sql += "SELECT STOCK, PRDTYY, SUM(CU_1_TOT) CU_1_TOT, SUM(LM_1_TOT) LM_1_TOT, SUM(DU_1_TOT) DU_1_TOT , SUM(CU_2_TOT) CU_2_TOT, SUM(LM_2_TOT) LM_2_TOT, SUM(DU_2_TOT) DU_2_TOT , SUM(CU_3_TOT) CU_3_TOT, SUM(LM_3_TOT) LM_3_TOT, SUM(DU_3_TOT) DU_3_TOT,  SUM(CU_4_TOT) CU_4_TOT, SUM(LM_4_TOT) LM_4_TOT, SUM(DU_4_TOT) DU_4_TOT FROM ( "
    // 정상
    sql += "SELECT STOCK, PRDTYY, CU_1_TOT, CU_2_TOT, CU_3_TOT, CU_4_TOT, 0 AS LM_1_TOT, 0 AS LM_2_TOT, 0 AS LM_3_TOT, 0 AS LM_4_TOT, 0 AS DU_1_TOT, 0 AS DU_2_TOT, 0 AS DU_3_TOT, 0 AS DU_4_TOT FROM (  "
    sql += "SELECT MAX(STOCK)STOCK, PRDTYY,SUM(CU_1_TOT) CU_1_TOT, SUM(CU_2_TOT) CU_2_TOT, SUM(CU_3_TOT) CU_3_TOT, SUM(CU_4_TOT) CU_4_TOT FROM ( "
    sql += "SELECT STOCK, PRDTYY, SUM(STAMT) CU_1_TOT, SUM(LMSTAMT) CU_2_TOT, SUM(LYSTAMT) CU_3_TOT, SUM(LESTAMT) CU_4_TOT FROM BIFN051 "
    sql += "WHERE SUCD IN ('1','12','4','3','10') " // 패션사업(FO는 정상없음), 중단사업
    sql += "AND STOCK = 'N' " // 정상
    sql += "AND SECGBN = '04' "
    sql += "AND YYYY = '" + currentYear + "' "
    sql += "AND MM = '" + currentMonth + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) "
    sql += "GROUP BY STOCK, PRDTYY "
    sql += "UNION ALL "
    sql += "SELECT STOCK, PRDTYY, SUM(STAMT) CU_1_TOT, SUM(LMSTAMT) CU_2_TOT, SUM(LYSTAMT) CU_3_TOT, SUM(LESTAMT) CU_4_TOT FROM BIFN051 "
    sql += "WHERE SUCD IN ('23','26','27','28') " // 미래성장사업
    sql += "AND PRDTYY = 'J' " // 미래성장사업은 정상만 있고 STOCK 값이 없어 2019년 4월 기준 J시즌을 정상으로 하드코딩
    sql += "AND SECGBN = '04' "
    sql += "AND YYYY = '" + currentYear + "' "
    sql += "AND MM = '" + currentMonth + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) "
    sql += "GROUP BY STOCK, PRDTYY "
    sql += ") "
    sql += "GROUP BY  PRDTYY "
    sql += ") "
    sql += "UNION ALL "
    // 이월
    sql += "SELECT STOCK, PRDTYY, 0 AS CU_1_TOT, 0 AS CU_2_TOT, 0 AS CU_3_TOT, 0 AS CU_4_TOT, LM_1_TOT, LM_2_TOT, LM_3_TOT, LM_4_TOT, 0 AS DU_1_TOT, 0 AS DU_2_TOT, 0 AS DU_3_TOT, 0 AS DU_4_TOT FROM ( "
    sql += "SELECT STOCK, PRDTYY, SUM(LM_1_TOT) LM_1_TOT, SUM(LM_2_TOT) LM_2_TOT, SUM(LM_3_TOT) LM_3_TOT, SUM(LM_4_TOT) LM_4_TOT FROM ( "
    sql += "SELECT STOCK, PRDTYY, SUM(STAMT) LM_1_TOT, SUM(LMSTAMT) LM_2_TOT, SUM(LYSTAMT) LM_3_TOT, SUM(LESTAMT) LM_4_TOT FROM BIFN051 "
    sql += "WHERE SUCD IN ('1','12','4','3','10','21') " // 미래성장사업은 정상만 있어서 빠짐
    sql += "AND STOCK = 'C' " // 이월
    sql += "AND SECGBN = '04' "
    sql += "AND YYYY = '" + currentYear + "' "
    sql += "AND MM = '" + currentMonth + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
    sql += "GROUP BY STOCK, PRDTYY "
    sql += ") "
    sql += "GROUP BY STOCK, PRDTYY "
    sql += ") "
    sql += "UNION ALL "
    // 불용
    sql += "SELECT STOCK, PRDTYY, 0 AS CU_1_TOT, 0 AS CU_2_TOT, 0 AS CU_3_TOT, 0 AS CU_4_TOT, 0 AS LM_1_TOT, 0 AS LM_2_TOT, 0 AS LM_3_TOT, 0 AS LM_4_TOT, DU_1_TOT, DU_2_TOT, DU_3_TOT, DU_4_TOT FROM ( "
    sql += "SELECT STOCK, PRDTYY, SUM(DU_1_TOT) DU_1_TOT, SUM(DU_2_TOT) DU_2_TOT, SUM(DU_3_TOT) DU_3_TOT, SUM(DU_4_TOT) DU_4_TOT FROM ( "
    sql += "SELECT STOCK, PRDTYY, SUM(STAMT) DU_1_TOT, SUM(LMSTAMT) DU_2_TOT, SUM(LYSTAMT) DU_3_TOT, SUM(LESTAMT) DU_4_TOT FROM BIFN051 "
    sql += "WHERE SUCD IN ('1','12','4','3','10','21') "
    sql += "AND STOCK = 'U' " // 불용
    sql += "AND SECGBN = '04' "
    sql += "AND YYYY = '" + currentYear + "' "
    sql += "AND MM = '" + currentMonth + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) "
    sql += "GROUP BY STOCK, PRDTYY "
    sql += ") "
    sql += "GROUP BY STOCK, PRDTYY "
    sql += ") "
    sql += ") "
    sql += "GROUP BY STOCK, PRDTYY "
    sql += ") ORDER BY STOCK, PRDTYY"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getResourceData = (req, res) => {
    console.log("============== getResourceData Call ======================");

    let date = req.query.date;
    let currentYear = req.query.currentYear;
    let yearCode = req.query.yearCode;
    let fs_yearCode = req.query.fs_yearCode;
    let fe_yearCode = req.query.fe_yearCode;
    let du_yearCode = req.query.du_yearCode;
    let SUCDs = req.query.SUCDs.split(',');

    let currentMonth = moment(date).format("M")
    // let lastMonthYear = moment(date).subtract(1, 'month').format("YYYY")
    // let lastMonth = moment(date).subtract(1, 'month').format("M")
    // let lastYear = moment(date).subtract(1, 'year').format("YYYY")

    // 사업부별 재품제고 누적합계, 전월증감함계, 기말증감합계 그래프
    let sql = "SELECT PRDTYY, LM_1_TOT, CU_1_TOT, (LM_1_TOT+CU_1_TOT) TOT1, LM_2_TOT, CU_2_TOT, (LM_2_TOT+CU_2_TOT) TOT2, LM_3_TOT, CU_3_TOT, (LM_3_TOT+CU_3_TOT) TOT3, LM_4_TOT, CU_4_TOT, (LM_4_TOT+CU_4_TOT) TOT4 FROM ( "
    sql += "SELECT PRDTYY, SUM(LM_1_TOT) LM_1_TOT, SUM(CU_1_TOT) CU_1_TOT, SUM(LM_2_TOT) LM_2_TOT, SUM(CU_2_TOT) CU_2_TOT, SUM(LM_3_TOT) LM_3_TOT, SUM(CU_3_TOT) CU_3_TOT, SUM(LM_4_TOT) LM_4_TOT, SUM(CU_4_TOT) CU_4_TOT FROM ( "
    // 정상
    sql += "SELECT PRDTYY, 0 AS LM_1_TOT, 0 AS LM_2_TOT, 0 AS LM_3_TOT, 0 AS LM_4_TOT, CU_1_TOT, CU_2_TOT, CU_3_TOT, CU_4_TOT FROM ( "
    sql += "SELECT PRDTYY, SUM(STAMT) CU_1_TOT, SUM(LMSTAMT) CU_2_TOT, SUM(LYSTAMT) CU_3_TOT, SUM(LESTAMT) CU_4_TOT FROM BIFN051 "
    sql += "WHERE SUCD IN ("
    for (let i=0;i<SUCDs.length;i++) {
    sql += "'" + SUCDs[i] + "'"
    if (i < SUCDs.length - 1) {
        sql += ","
    }
    }
    sql += ") ";
    sql += "AND PRDTYY >= '" + yearCode + "' "
    sql += "AND SECGBN = '03' "
    sql += "AND YYYY = '" + currentYear + "' "
    sql += "AND MM = '" + currentMonth + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
    sql += "GROUP BY PRDTYY) "
    sql += "UNION ALL "
    // 이월
    sql += "SELECT PRDTYY, LM_1_TOT, LM_2_TOT, LM_3_TOT, LM_4_TOT, 0 AS CU_1_TOT, 0 AS CU_2_TOT, 0 AS CU_3_TOT, 0 AS CU_4_TOT FROM ( "
    sql += "SELECT PRDTYY, SUM(STAMT) LM_1_TOT, SUM(LMSTAMT) LM_2_TOT, SUM(LYSTAMT) LM_3_TOT, SUM(LESTAMT) LM_4_TOT FROM BIFN051 "
    sql += "WHERE SUCD IN ("
    for (let i=0;i<SUCDs.length;i++) {
    sql += "'" + SUCDs[i] + "'"
    if (i < SUCDs.length - 1) {
        sql += ","
    }
    }
    sql += ") ";
    sql += "AND PRDTYY BETWEEN '" + fs_yearCode + "' AND '" + fe_yearCode + "' ";
    sql += "AND SECGBN = '03' "
    sql += "AND YYYY = '" + currentYear + "' "
    sql += "AND MM = '" + currentMonth + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
    sql += "GROUP BY PRDTYY) "
    sql += "UNION ALL "
    // 불용
    sql += "SELECT PRDTYY, LM_1_TOT, LM_2_TOT, LM_3_TOT, LM_4_TOT, 0 AS CU_1_TOT, 0 AS CU_2_TOT, 0 AS CU_3_TOT, 0 AS CU_4_TOT FROM ( "
    sql += "SELECT PRDTYY, SUM(STAMT) LM_1_TOT, SUM(LMSTAMT) LM_2_TOT, SUM(LYSTAMT) LM_3_TOT, SUM(LESTAMT) LM_4_TOT FROM BIFN051 "
    sql += "WHERE SUCD IN ("
    for (let i=0;i<SUCDs.length;i++) {
    sql += "'" + SUCDs[i] + "'"
    if (i < SUCDs.length - 1) {
        sql += ","
    }
    }
    sql += ") ";
    sql += "AND PRDTYY <= '" + du_yearCode + "' ";
    sql += "AND SECGBN = '03' ";
    sql += "AND YYYY = '" + currentYear + "' "
    sql += "AND MM = '" + currentMonth + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
    sql += "GROUP BY PRDTYY) "
    sql += ")GROUP BY PRDTYY "
    sql += ") ORDER BY PRDTYY"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};
