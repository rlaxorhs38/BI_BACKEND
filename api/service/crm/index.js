var axios = require('axios');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res, next) => {
    console.log("============== getMakeDataDate Call ======================");

    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BICR030";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSalesBest3 = (req, res) => {
    console.log("============== getSalesBest3 Call ======================");
    let choice = req.query.choice;
    let date = req.query.date;
    let year = req.query.year;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    
    // 매출비중 상위 3 구간
    let sql = "SELECT A.* FROM ( "
    sql += "SELECT SAMT_GU, COUNT(SAMT_GU) CNT "
    sql += "FROM BICR030 "
    if(choice == 1){
      sql += "WHERE SALEYM = '" + date + "' "
    } else {
      sql += "WHERE SALEYM BETWEEN '" + year + "01'" + "AND" + "'" + year + "12' "
    }
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR030) ";
    sql += "GROUP BY SAMT_GU "
    sql += "ORDER BY CNT DESC) A"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getDataByAge = (req, res) => {
    console.log("============== getDataByAge Call ======================");
    let choice = req.query.choice;
    let date = req.query.date;
    let year = req.query.year;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;

    // 연령대별 고객 매출, 판매품목수, 객단가
    let sql = "SELECT TRUNC((SAMT/AGE_GU_CNT)/1000) AVR, A.* FROM ( "
    sql += "SELECT AGE_GU, COUNT(AGE_GU) AGE_GU_CNT, SUM(SAMT) SAMT, SUM(SQTY) SQTY_CNT FROM BICR030 "
    if(choice == 1){
      sql += "WHERE SALEYM = '" + date + "' "
    } else {
      sql += "WHERE SALEYM BETWEEN '" + year + "01'" + "AND" + "'" + year + "12' "
    }
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR030) ";
    sql += "GROUP BY AGE_GU  "
    sql += "ORDER BY AGE_GU DESC) A "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getItemDataByAge = (req, res) => {
    console.log("============== getItemDataByAge Call ======================");
    let choice = req.query.choice;
    let date = req.query.date;
    let year = req.query.year;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;

    // 연령대별 복종 선호도 그래프
    let sql = "SELECT AGE_GU, ITEM, SUM(SAMT) SAMT, SUM(SQTY) SQTY FROM BICR031 "
    if(choice == 1){
    sql += "WHERE SALEYM = '" + date + "' "
    } else {
    sql += "WHERE SALEYM BETWEEN '" + year + "01'" + "AND" + "'" + year + "12' "
    }
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR031) ";
    sql += "GROUP BY AGE_GU, ITEM "
    sql += "ORDER BY AGE_GU, SAMT DESC"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getNewCustomerCount = (req, res) => {
    console.log("============== getNewCustomerCount Call ======================");
    let choice = req.query.choice;
    let date = req.query.date;
    let year = req.query.year;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;

    // 신규 고객 수
    let sql = "SELECT A.* FROM ( "
    sql += "SELECT AGE_GU, COUNT(AGE_GU) AGE_GU_CNT FROM BICR040 "
    if(choice == 1){
      sql += "WHERE SUBSTR(ISSUEDT,1,6) = '" + date + "' "
    } else {
      sql += "WHERE SUBSTR(ISSUEDT,1,6) BETWEEN '" + year + "01'" + "AND" + "'" + year + "12' "
    }
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR040) ";
    sql += "GROUP BY AGE_GU "
    sql += "ORDER BY AGE_GU )A"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getNewCustomerCountByPeriod = (req, res) => {
    console.log("============== getNewCustomerCountByPeriod Call ======================");
    let choice = req.query.choice;
    let lastYearMonth = req.query.lastYearMonth;
    let lastMonth = req.query.lastMonth;
    let currentMonth = req.query.currentMonth;
    let year = req.query.year;
    let month = req.query.month;
    let lastYear = req.query.lastYear;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;

    // 신규 고객 수 기간 비교
    let sql = "";      
    if(choice == 1){
      sql += "SELECT SUM(LY_CNT) LY_CNT, SUM(LM_CNT) LM_CNT, SUM(CU_CNT) CU_CNT FROM ( "
      sql += "SELECT LY_CNT, LM_CNT, CU_CNT FROM ( "
      sql += "SELECT LY_CNT, 0 AS LM_CNT, 0 AS CU_CNT FROM ( "
      sql += "SELECT COUNT(*) LY_CNT FROM BICR040 "
      sql += "WHERE SUBSTR(ISSUEDT,1,6) = '" + lastYearMonth + "' "
      sql += "AND " + tabType + " = '" + selectedCODE + "' "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR040) ";
      sql += ") ";
      sql += "UNION ALL "
      sql += "SELECT 0 AS LY_CNT, LM_CNT, 0 AS CU_CNT FROM ( "
      sql += "SELECT COUNT(*) LM_CNT FROM BICR040 "
      sql += "WHERE SUBSTR(ISSUEDT,1,6) = '" + lastMonth + "' "
      sql += "AND " + tabType + " = '" + selectedCODE + "' "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR040) ";
      sql += ") ";
      sql += "UNION ALL "
      sql += "SELECT 0 AS LY_CNT, 0 AS LM_CNT, CU_CNT FROM ( "
      sql += "SELECT COUNT(*) CU_CNT FROM BICR040 "
      sql += "WHERE SUBSTR(ISSUEDT,1,6) = '" + currentMonth + "' "
      sql += "AND " + tabType + " = '" + selectedCODE + "' "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR040) ";
      sql += ") ";
      sql += ") ";
      sql += ")";
    } else {
      if (year != moment().format("YYYY")) {
        month = "12"
      }
      sql += "SELECT SUM(LY_CNT) LY_CNT, SUM(CU_CNT) CU_CNT FROM ( "
      sql += "SELECT LY_CNT, CU_CNT FROM ( "
      sql += "SELECT LY_CNT, 0 AS CU_CNT FROM ( "
      sql += "SELECT COUNT(*) LY_CNT FROM BICR040 "
      sql += "WHERE SUBSTR(ISSUEDT,1,6) BETWEEN '" + lastYear + "01'" + "AND" + "'" + lastYear + month + "' "
      sql += "AND " + tabType + " = '" + selectedCODE + "' "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR040) ";
      sql += ") ";
      sql += "UNION ALL "
      sql += "SELECT 0 AS LY_CNT, CU_CNT FROM ( "
      sql += "SELECT COUNT(*) CU_CNT FROM BICR040 "
      sql += "WHERE SUBSTR(ISSUEDT,1,6) BETWEEN '" + year + "01'" + "AND" + "'" + year + month + "' "
      sql += "AND " + tabType + " = '" + selectedCODE + "' "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR040) ";
      sql += ") ";
      sql += ") ";
      sql += ")";
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getCurrentCustomerCount = (req, res) => {
    console.log("============== getCurrentCustomerCount Call ======================");
    let choice = req.query.choice;
    let date = req.query.date;
    let year = req.query.year;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;

    // 구매 고객 수
    let sql = "SELECT A.* FROM ( "
    sql += "SELECT AGE_GU, COUNT(AGE_GU) AGE_GU_CNT FROM BICR030 "
    if(choice == 1){
    sql += "WHERE SALEYM = '" + date + "' "
    } else {
    sql += "WHERE SALEYM BETWEEN '" + year + "01'" + "AND" + "'" + year + "12' "
    }
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    sql += "AND SAMT <> 0 "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR030) ";
    sql += "GROUP BY AGE_GU "
    sql += "ORDER BY AGE_GU)A"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getCurrentCustomerCountByPeriod = (req, res) => {
    console.log("============== getCurrentCustomerCountByPeriod Call ======================");
    let choice = req.query.choice;
    let lastYearMonth = req.query.lastYearMonth;
    let lastMonth = req.query.lastMonth;
    let currentMonth = req.query.currentMonth;
    let year = req.query.year;
    let month = req.query.month;
    let lastYear = req.query.lastYear;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;

    // 구매 고객 수 기간 비교
    let sql = "";      
    if(choice == 1) {
      sql += "SELECT SUM(LY_CNT) LY_CNT, SUM(LM_CNT) LM_CNT, SUM(CU_CNT) CU_CNT FROM ( "
      sql += "SELECT LY_CNT, LM_CNT, CU_CNT FROM ( "
      sql += "SELECT LY_CNT, 0 AS LM_CNT, 0 AS CU_CNT FROM ( "
      sql += "SELECT COUNT(*) LY_CNT FROM BICR030 "
      sql += "WHERE SALEYM = '" + lastYearMonth + "' "
      sql += "AND " + tabType + " = '" + selectedCODE + "' "
      sql += "AND SAMT <> 0 "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR030) ";
      sql += ") ";
      sql += "UNION ALL "
      sql += "SELECT 0 AS LY_CNT, LM_CNT, 0 AS CU_CNT FROM ( "
      sql += "SELECT COUNT(*) LM_CNT FROM BICR030 "
      sql += "WHERE SALEYM = '" + lastMonth + "' "
      sql += "AND " + tabType + " = '" + selectedCODE + "' "
      sql += "AND SAMT <> 0 "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR030) ";
      sql += ") ";
      sql += "UNION ALL "
      sql += "SELECT 0 AS LY_CNT, 0 AS LM_CNT, CU_CNT FROM ( "
      sql += "SELECT COUNT(*) CU_CNT FROM BICR030 "
      sql += "WHERE SALEYM = '" + currentMonth + "' "
      sql += "AND " + tabType + " = '" + selectedCODE + "' "
      sql += "AND SAMT <> 0 "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR030) ";
      sql += ") ";
      sql += ") ";
      sql += ")";
    } else {
      if (year != moment().format("YYYY")) {
        month = "12"
      }
      sql += "SELECT SUM(LY_CNT) LY_CNT, SUM(CU_CNT) CU_CNT FROM ( "
      sql += "SELECT LY_CNT, CU_CNT FROM ( "
      sql += "SELECT LY_CNT, 0 AS CU_CNT FROM ( "
      sql += "SELECT COUNT(*) LY_CNT FROM BICR030 "
      sql += "WHERE SALEYM BETWEEN '" + lastYear + "01'" + "AND" + "'" + lastYear + month + "' "
      sql += "AND " + tabType + " = '" + selectedCODE + "' "
      sql += "AND SAMT <> 0 "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR030) ";
      sql += ") ";
      sql += "UNION ALL "
      sql += "SELECT 0 AS LY_CNT, CU_CNT FROM ( "
      sql += "SELECT COUNT(*) CU_CNT FROM BICR030 "
      sql += "WHERE SALEYM BETWEEN '" + year + "01'" + "AND" + "'" + year + month + "' "
      sql += "AND " + tabType + " = '" + selectedCODE + "' "
      sql += "AND SAMT <> 0 "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR030) ";
      sql += ") ";
      sql += ") ";
      sql += ")";
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getDormancyCustomerCount = (req, res) => {
    console.log("============== getDormancyCustomerCount Call ======================");
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;

    // 휴면 고객 수
    let sql = "SELECT A.* FROM ( "
    sql += "SELECT AGE_GU, COUNT(AGE_GU) AGE_GU_CNT FROM BICR040 "
    sql += "WHERE HYU_YN = 'Y' "
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR040) ";
    sql += "GROUP BY AGE_GU "
    sql += "ORDER BY AGE_GU)A"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSumSalesForCurrentMonth = (req, res) => {
    console.log("============== getSumSalesForCurrentMonth Call ======================");
    let choice = req.query.choice;
    let date = req.query.date;
    let year = req.query.year;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;

    // 기존고객 SAMT에 신규고객 NEW_SAMT 매출 포함되어 있어서 예외 처리 추가
    // SUM(SAMT) - > (SUM(SAMT)-SUM(NEW_SAMT))
    let sql = "SELECT SUM(NEW_SAMT) NEW_SAMT, (SUM(SAMT)-SUM(NEW_SAMT)) SAMT FROM ( "
    sql += "SELECT NEW_SAMT, 0 AS SAMT FROM ( "
    sql += "SELECT SUM(SAMT) NEW_SAMT FROM BICR030 "
    if(choice == 1){
      sql += "WHERE SALEYM = '" + date + "' "
      sql += "AND ISSUE_YM = '" + date + "' "
    } else {
      sql += "WHERE SALEYM BETWEEN '" + year + "01'" + "AND" + "'" + year + "12' "
      sql += "AND ISSUE_YM BETWEEN '" + year + "01'" + "AND" + "'" + year + "12' "
    }
    // sql += "WHERE SALEYM = '" + date + "' "
    // sql += "AND ISSUE_YM = '" + date + "' "
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    // sql += "AND TO_CHAR(CREATEDATE , 'YYYYMMDD') = (SELECT MAX(TO_CHAR(CREATEDATE , 'YYYYMMDD')) FROM BICR030) ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR030) ";
    sql += ") ";
    sql += "UNION ALL "
    sql += "SELECT 0 AS NEW_SAMT, SAMT FROM ( "
    sql += "SELECT SUM(SAMT) SAMT FROM BICR030 "
    if(choice == 1){
      sql += "WHERE SALEYM = '" + date + "' "
    } else {
      sql += "WHERE SALEYM BETWEEN '" + year + "01'" + "AND" + "'" + year + "12' "
    }
    // sql += "WHERE SALEYM = '" + date + "' "
    sql += "AND " + tabType + " = '" + selectedCODE + "' "
    // sql += "AND TO_CHAR(CREATEDATE , 'YYYYMMDD') = (SELECT MAX(TO_CHAR(CREATEDATE , 'YYYYMMDD')) FROM BICR030) ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR030) ";
    sql += ") ";
    sql += ")";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getCustomerSalesDataByAge = (req, res) => {
    console.log("============== getCustomerSalesDataByAge Call ======================");
    let choice = req.query.choice;
    let date = req.query.date;
    let year = req.query.year;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;

      // 기존고객 SAMT에 신규고객 NEW_SAMT 매출 포함되어 있어서 예외 처리 추가
      // SUM(SAMT) - > (SUM(SAMT)-SUM(NEW_SAMT))
      let sql = "SELECT A.* FROM ( "
      sql += "SELECT AGE_GU, SUM(NEW_SAMT) NEW_SAMT, (SUM(SAMT)-SUM(NEW_SAMT)) SAMT FROM ( "
      sql += "SELECT AGE_GU, NEW_SAMT, 0 AS SAMT FROM ( "
      sql += "SELECT AGE_GU, SUM(SAMT) NEW_SAMT FROM BICR030 "
      if(choice == 1){
        sql += "WHERE SALEYM = '" + date + "' "
        sql += "AND ISSUE_YM = '" + date + "' "
      } else {
        sql += "WHERE SALEYM BETWEEN '" + year + "01'" + "AND" + "'" + year + "12' "
        sql += "AND ISSUE_YM BETWEEN '" + year + "01'" + "AND" + "'" + year + "12' "
      }
      // sql += "WHERE SALEYM = '" + date + "' "
      // sql += "AND ISSUE_YM = '" + date + "' "
      sql += "AND " + tabType + " = '" + selectedCODE + "' "
      // sql += "AND TO_CHAR(CREATEDATE , 'YYYYMMDD') = (SELECT MAX(TO_CHAR(CREATEDATE , 'YYYYMMDD')) FROM BICR030)";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR030) ";
      sql += "GROUP BY AGE_GU) "
      sql += "UNION ALL "
      sql += "SELECT AGE_GU, 0 AS NEW_SAMT, SAMT FROM ( "
      sql += "SELECT AGE_GU, SUM(SAMT) SAMT FROM BICR030 "
      if(choice == 1){
        sql += "WHERE SALEYM = '" + date + "' "
      } else {
        sql += "WHERE SALEYM BETWEEN '" + year + "01'" + "AND" + "'" + year + "12' "
      }
      // sql += "WHERE SALEYM = '" + date + "' "
      sql += "AND " + tabType + " = '" + selectedCODE + "' "
      // sql += "AND TO_CHAR(CREATEDATE , 'YYYYMMDD') = (SELECT MAX(TO_CHAR(CREATEDATE , 'YYYYMMDD')) FROM BICR030)";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICR030) ";
      sql += "GROUP BY AGE_GU) ) "
      sql += "GROUP BY AGE_GU "
      sql += "ORDER BY AGE_GU ) A"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};