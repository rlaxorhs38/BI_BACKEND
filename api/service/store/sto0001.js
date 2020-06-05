var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res, next) => {
    console.log("============== getMakeDataDate Call ======================");

    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BISH010";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getRegionData = (req, res) => {
    console.log("============== getRegionData Call ======================");
    
    let choice = req.query.choice;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let date = req.query.date;
    let year = req.query.year;
    let month = req.query.month;
    let yesterday = req.query.yesterday;
    
    date = moment(date).format("YYYYMMDD")
    if (month.toString().length == 1) {
        month = "0" + month
    }
    let mmdate = year + month
    let selectYYYYMM = moment(year + month + "01").endOf("month").format("YYYYMMDD")
    let selectYYYY = moment(year + month + "01").endOf("year").format("YYYYMMDD")

    // 지역 셀렉박스
    let sql = "SELECT CASE WHEN RENNM IS NULL THEN '지역없음' ELSE RENNM END RENNM, COUNT(*) CNT FROM BISH010 "
    // if(selectedCODE == "IT" || selectedCODE == "SO") {
    // sql += "WHERE (" + tabType + " = '" + selectedCODE +  "' OR SUCD = '21') "
    // } else {
    // sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "  
    // }
    sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "  
    if(choice == 1) {
    sql += "AND VDFLR = '" + date + "' "
    } else if(choice == 2) {
    //sql += "AND VDFLR = '" + date + "' "
    sql += "AND VDFLR = (CASE WHEN '" + mmdate + "' >= TO_CHAR(SYSDATE,'YYYYMM') THEN '"+yesterday+"' ELSE '" + selectYYYYMM + "' END) "
    } else {
    //sql += "AND VDFLR = '" + date + "' "
    sql += "AND VDFLR = (CASE WHEN '" + year + "' >= TO_CHAR(SYSDATE,'YYYY') THEN '"+yesterday+"' ELSE '" + selectYYYY + "' END) "
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH010) ";
    sql += "GROUP BY RENNM "
    sql += "ORDER BY CNT DESC"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSelectRegionData = (req, res) => {
    console.log("============== getSelectRegionData Call ======================");
    let choice = req.query.choice;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let date = req.query.date;
    let year = req.query.year;
    let month = req.query.month;
    let yesterday = req.query.yesterday;
    let selectRegion = req.query.selectRegion;
    let selectStoreType = req.query.selectStoreType;
    let selectStoreOption = req.query.selectStoreOption;
    let selectStoreSU = req.query.selectStoreSU;
    
    date = moment(date).format("YYYYMMDD")
    if (month.toString().length == 1) {
        month = "0" + month
    }
    let mmdate = year + month
    let selectYYYYMM = moment(year + month + "01").endOf("month").format("YYYYMMDD")
    let selectYYYY = moment(year + month + "01").endOf("year").format("YYYYMMDD")
    
    // 매장형태 셀렉박스
    let sql = "SELECT CASE WHEN RENNM IS NULL THEN '지역없음' ELSE RENNM END RENNM, COUNT(*) CNT FROM BISH010 "
    // if(selectedCODE == "IT" || selectedCODE == "SO") {
    // sql += "WHERE (" + tabType + " = '" + selectedCODE +  "' OR SUCD = '21') "
    // } else {
    // sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "  
    // }
    sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "  
    if (selectRegion != "전국") {
    sql += "AND RENNM = '" + selectRegion + "' "
    }
    if (selectStoreType != 0) {
    sql += "AND SHGUNM = '" + selectStoreType + "' "
    }
    if (selectStoreOption != 0) {
    sql += "AND SHTPNM = '" + selectStoreOption + "' "
    }
    if (selectStoreSU != 0) {
    sql += "AND SUCD = '" + selectStoreSU + "' "
    }
    if(choice == 1){
    sql += "AND VDFLR = '" + date + "' "
    } else if(choice == 2){
    //sql += "AND VDFLR = '" + date + "' "
    sql += "AND VDFLR = (CASE WHEN '" + mmdate + "' >= TO_CHAR(SYSDATE-1,'YYYYMM') THEN '"+yesterday+"' ELSE '" + selectYYYYMM + "' END) "
    } else {
    //sql += "AND VDFLR = '" + date + "' "
    sql += "AND VDFLR = (CASE WHEN '" + year + "' >= TO_CHAR(SYSDATE-1,'YYYY') THEN '"+yesterday+"' ELSE '" + selectYYYY + "' END) "
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH010) ";
    sql += "GROUP BY RENNM "
    sql += "ORDER BY CNT DESC"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getStoreSUData = (req, res) => {
    console.log("============== getStoreSUData Call ======================");
    let choice = req.query.choice;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let date = req.query.date;
    let year = req.query.year;
    let month = req.query.month;
    let yesterday = req.query.yesterday;
    let selectRegion = req.query.selectRegion;
    
    date = moment(date).format("YYYYMMDD")
    if (month.toString().length == 1) {
        month = "0" + month
    }
    let mmdate = year + month
    let selectYYYYMM = moment(year + month + "01").endOf("month").format("YYYYMMDD")
    let selectYYYY = moment(year + month + "01").endOf("year").format("YYYYMMDD")

    // 사업부 구분
    let sql = "SELECT SUCD, COUNT(SUCD) CNT FROM BISH010 "
    // if(selectedCODE == "IT" || selectedCODE == "SO") {
    //   sql += "WHERE (" + tabType + " = '" + selectedCODE +  "' OR SUCD = '21') "
    // } else {
    //   sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "  
    // }
    sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "  
    if (selectRegion != "전국") {
    sql += "AND RENNM = '" + selectRegion + "' "
    }
    if(choice == 1){
      sql += "AND VDFLR = '" + date + "' "
    } else if(choice == 2){
      //sql += "AND VDFLR = '" + date + "' "
      sql += "AND VDFLR = (CASE WHEN '" + mmdate + "' >= TO_CHAR(SYSDATE-1,'YYYYMM') THEN '"+yesterday+"' ELSE '" + selectYYYYMM + "' END) "
    } else {
      //sql += "AND VDFLR = '" + date + "' "
      sql += "AND VDFLR = (CASE WHEN '" + year + "' >= TO_CHAR(SYSDATE-1,'YYYY') THEN '"+yesterday+"' ELSE '" + selectYYYY + "' END) "
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH010) ";
    sql += "GROUP BY SUCD "
    sql += "ORDER BY CNT DESC"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getStoreTypeData = (req, res) => {
    console.log("============== getStoreTypeData Call ======================");
    let choice = req.query.choice;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let date = req.query.date;
    let year = req.query.year;
    let month = req.query.month;
    let yesterday = req.query.yesterday;
    let selectRegion = req.query.selectRegion;
    let selectStoreSU = req.query.selectStoreSU;
    
    date = moment(date).format("YYYYMMDD")
    if (month.toString().length == 1) {
        month = "0" + month
    }
    let mmdate = year + month
    let selectYYYYMM = moment(year + month + "01").endOf("month").format("YYYYMMDD")
    let selectYYYY = moment(year + month + "01").endOf("year").format("YYYYMMDD")
    
    // 유형별 선택 > 매장구분 선택 > 3번째 셀렉박스 옵션
    let sql = "SELECT SHGUNM, COUNT(SHGUNM) CNT FROM BISH010 "
    // if(selectedCODE == "IT" || selectedCODE == "SO") {
    // sql += "WHERE (" + tabType + " = '" + selectedCODE +  "' OR SUCD = '21') "
    // } else {
    // sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "  
    // }
    sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "  
    if (selectRegion != "전국") {
    sql += "AND RENNM = '" + selectRegion + "' "
    }
    if (selectStoreSU != 0) {
    sql += "AND SUCD = '" + selectStoreSU + "' "
    }
    if(choice == 1){
    sql += "AND VDFLR = '" + date + "' "
    } else if(choice == 2){
    //sql += "AND VDFLR = '" + date + "' "
    sql += "AND VDFLR = (CASE WHEN '" + mmdate + "' >= TO_CHAR(SYSDATE-1,'YYYYMM') THEN '"+yesterday+"' ELSE '" + selectYYYYMM + "' END) "
    } else {
    //sql += "AND VDFLR = '" + date + "' "
    sql += "AND VDFLR = (CASE WHEN '" + year + "' >= TO_CHAR(SYSDATE-1,'YYYY') THEN '"+yesterday+"' ELSE '" + selectYYYY + "' END) "
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH010) ";
    sql += "GROUP BY SHGUNM "
    sql += "ORDER BY CNT DESC"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getStoreOptionData = (req, res) => {
    console.log("============== getStoreOptionData Call ======================");
    let choice = req.query.choice;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let date = req.query.date;
    let year = req.query.year;
    let month = req.query.month;
    let yesterday = req.query.yesterday;
    let selectRegion = req.query.selectRegion;
    let selectStoreType = req.query.selectStoreType;
    let selectStoreSU = req.query.selectStoreSU;
    
    date = moment(date).format("YYYYMMDD")
    if (month.toString().length == 1) {
        month = "0" + month
    }
    let mmdate = year + month
    let selectYYYYMM = moment(year + month + "01").endOf("month").format("YYYYMMDD")
    let selectYYYY = moment(year + month + "01").endOf("year").format("YYYYMMDD")

    // 유형별 선택 > 매장형태 선택 > 3번째 셀렉박스 옵션
    let sql = "SELECT SHTPNM, COUNT(SHTPNM) CNT FROM BISH010 "
    // if(selectedCODE == "IT" || selectedCODE == "SO") {
    // sql += "WHERE (" + tabType + " = '" + selectedCODE +  "' OR SUCD = '21') "
    // } else {
    // sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "  
    // }
    sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "  
    if (selectRegion != "전국") {
    sql += "AND RENNM = '" + selectRegion + "' "
    }
    if (selectStoreType != 0) {
    sql += "AND SHGUNM = '" + selectStoreType + "' "
    }
    if (selectStoreSU != 0) {
    sql += "AND SUCD = '" + selectStoreSU + "' "
    }
    if(choice == 1){
    sql += "AND VDFLR = '" + date + "' "
    } else if(choice == 2){
    //sql += "AND VDFLR = '" + date + "' "
    sql += "AND VDFLR = (CASE WHEN '" + mmdate + "' >= TO_CHAR(SYSDATE-1,'YYYYMM') THEN '"+yesterday+"' ELSE '" + selectYYYYMM + "' END) "
    } else {
    //sql += "AND VDFLR = '" + date + "' "
    sql += "AND VDFLR = (CASE WHEN '" + year + "' >= TO_CHAR(SYSDATE-1,'YYYY') THEN '"+yesterday+"' ELSE '" + selectYYYY + "' END) "
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH010) ";
    sql += "GROUP BY SHTPNM "
    sql += "ORDER BY CNT DESC"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSelectVDCDStoreInfo = (req, res) => {
    console.log("============== getSelectVDCDStoreInfo Call ======================");
    let choice = req.query.choice;
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let date = req.query.date;
    let year = req.query.year;
    let month = req.query.month;
    let yesterday = req.query.yesterday;
    let selectRegion = req.query.selectRegion;
    let selectStoreType = req.query.selectStoreType;
    let selectStoreOption = req.query.selectStoreOption;
    let selectStoreSU = req.query.selectStoreSU;
    
    date = moment(date).format("YYYYMMDD")
    if (month.toString().length == 1) {
        month = "0" + month
    }
    let mmdate = year + month
    let selectYYYYMM = moment(year + month + "01").endOf("month").format("YYYYMMDD")
    let selectYYYY = moment(year + month + "01").endOf("year").format("YYYYMMDD")

    // 모든 조건 선택후 매출합계를 위한 매장코드 셀렉
    let sql = "SELECT VDCD, VDSNM, SHGU, SHGUNM, SHTP, SHTPNM, RENCD, RENNM, ZIPCODE, ADDR1, ADDR2, TELNO, LAT, LNG FROM BISH010 "
    // if(selectedCODE == "IT" || selectedCODE == "SO") {
    // sql += "WHERE (" + tabType + " = '" + selectedCODE +  "' OR SUCD = '21') "
    // } else {
    // sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "  
    // }
    sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "  
    if (selectRegion != "전국") {
    if (selectRegion == "지역없음") {
        sql += "AND RENNM IS NULL "
    } else if(selectRegion) {
        sql += "AND RENNM = '" + selectRegion + "' "
    }
    }
    if (selectStoreType != 0) {
    sql += "AND SHGUNM = '" + selectStoreType + "' "
    }
    if (selectStoreOption != 0) {
    sql += "AND SHTPNM = '" + selectStoreOption + "' "
    }
    if (selectStoreSU != 0) {
    sql += "AND SUCD = '" + selectStoreSU + "' "
    }
    if(choice == 1){
    sql += "AND VDFLR = '" + date + "' "
    } else if(choice == 2){
    //sql += "AND VDFLR = '" + date + "' "
    sql += "AND VDFLR = (CASE WHEN '" + mmdate + "' >= TO_CHAR(SYSDATE-1,'YYYYMM') THEN '"+yesterday+"' ELSE '" + selectYYYYMM + "' END) "
    } else {
    //sql += "AND VDFLR = '" + date + "' "
    sql += "AND VDFLR = (CASE WHEN '" + year + "' >= TO_CHAR(SYSDATE-1,'YYYY') THEN '"+yesterday+"' ELSE '" + selectYYYY + "' END) "
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH010)"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getDailyStoreList = (req, res) => {
    console.log("============== getDailyStoreList Call ======================");
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let date = req.query.date;
    let selectStoreList = req.query.selectStoreList.split(',');
    
    date = moment(date).format("YYYYMMDD")

    // 매출 베스트 워스트 금액(일간)  
    let sql = "SELECT VDCD, TSAMT FROM ( "
    sql += "SELECT VDCD, SUCD, SUM(JAMT)+SUM(DCAMT)+SUM(GAMT)+SUM(ADVDEPAMT) TSAMT FROM BISL060 "
    sql += "WHERE 1=1 "
    sql += "AND SALEDT = '" + date + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) "
    sql += "GROUP BY VDCD, SUCD, " + tabType + " "
    sql += "HAVING " + tabType + " = '" + selectedCODE +  "' "
    sql += "AND VDCD IN ("
    for (let i=0;i<selectStoreList.length;i++) {
        sql += "'" + selectStoreList[i] + "'"
        if (i < selectStoreList.length - 1) {
            sql += ","
        }
    }
    sql += ") "
    sql += ") "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getMonthStoreList = (req, res) => {
    console.log("============== getMonthStoreList Call ======================");
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let year = req.query.year;
    let month = req.query.month;
    let selectStoreList = req.query.selectStoreList.split(',');
    
    if (month.toString().length == 1) {
        month = "0" + month
    }

    // 매출 베스트 워스트 금액(월간)
    let sql = "SELECT VDCD, SUM(TSAMT) TSAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISH041 "
    sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "
    sql += "AND SALEYY = '" + year + "' "
    sql += "AND SALEMM = '" + month + "' "
    sql += "AND VDCD IN ("
    for (let i=0;i<selectStoreList.length;i++) {
    sql += "'" + selectStoreList[i] + "'"
    if (i < selectStoreList.length - 1) {
        sql += ","
    }
    }
    sql += ") "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) ";
    sql += "GROUP BY VDCD "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getCumulativeStoreList = (req, res) => {
    console.log("============== getCumulativeStoreList Call ======================");
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let year = req.query.year;
    let month = req.query.month;
    let selectStoreList = req.query.selectStoreList.split(',');
    
    if (month.toString().length == 1) {
        month = "0" + month
    }
    if (year != moment().format("YYYY")) {
      month = "12"
    }

    // 매출 베스트 워스트 금액(누적)
    let sql = "SELECT VDCD, SUM(TSAMT) TSAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISH041 "
    sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "
    sql += "AND SALEYY = '" + year + "' "
    sql += "AND SALEMM BETWEEN '" + "01" + "' AND '" + month + "' "
    sql += "AND VDCD IN ("
    for (let i=0;i<selectStoreList.length;i++) {
    sql += "'" + selectStoreList[i] + "'"
    if (i < selectStoreList.length - 1) {
        sql += ","
    }
    }
    sql += ") "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) ";
    sql += "GROUP BY VDCD "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getDailyTotalAMT = (req, res) => {
    console.log("============== getDailyTotalAMT Call ======================");
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let date = req.query.date;
    let selectStoreList = req.query.selectStoreList.split(',');
    
    date = moment(date).format("YYYYMMDD")

    // 모든 조건 선택후 매출합계(일간)
    let sql = "SELECT SUM(AMT) AMT FROM ( " 
    sql += "SELECT  VDCD,SUCD, SUM(JAMT)+SUM(DCAMT)+SUM(GAMT)+SUM(ADVDEPAMT) AMT FROM BISL060 "
    sql += "WHERE SALEDT = '" + date + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) "
    sql += "GROUP BY SUCD,VDCD, " + tabType + " "
    sql += "HAVING " + tabType + " = '" + selectedCODE +  "' "
    sql += "AND VDCD IN ("
    for (let i=0;i<selectStoreList.length;i++) {
    sql += "'" + selectStoreList[i] + "'"
    if (i < selectStoreList.length - 1) {
        sql += ","
    }
    }
    sql += ") "
    sql += ")"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getMonthTotalAMT = (req, res) => {
    console.log("============== getMonthTotalAMT Call ======================");
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let year = req.query.year;
    let month = req.query.month;
    let selectStoreList = req.query.selectStoreList.split(',');
    
    if (month.toString().length == 1) {
        month = "0" + month
    }
    
    // 모든 조건 선택후 매출합계(월간)
    let sql = "SELECT SUM(TSAMT) TSAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISH041 "
    sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "
    sql += "AND SALEYY = '" + year + "' "
    sql += "AND SALEMM = '" + month + "' "
    sql += "AND VDCD IN ("
    for (let i=0;i<selectStoreList.length;i++) {
    sql += "'" + selectStoreList[i] + "'"
    if (i < selectStoreList.length - 1) {
        sql += ","
    }
    }
    sql += ") "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getCumulativeTotalAMT = (req, res) => {
    console.log("============== getCumulativeTotalAMT Call ======================");
    let tabType = req.query.tabType;
    let selectedCODE = req.query.selectedCODE;
    let year = req.query.year;
    let month = req.query.month;
    let selectStoreList = req.query.selectStoreList.split(',');
    
    if (month.toString().length == 1) {
        month = "0" + month
    }
    if (year != moment().format("YYYY")) {
      month = "12"
    }
    
    // 모든 조건 선택후 매출합계(누적)
    let sql = "SELECT SUM(TSAMT) TSAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISH041 "
    sql += "WHERE " + tabType + " = '" + selectedCODE +  "' "
    sql += "AND SALEYY = '" + year + "' "
    sql += "AND SALEMM BETWEEN '" + "01" + "' AND '" + month + "' "
    sql += "AND VDCD IN ("
    for (let i=0;i<selectStoreList.length;i++) {
        sql += "'" + selectStoreList[i] + "'"
        if (i < selectStoreList.length - 1) {
            sql += ","
        }
    }
    sql += ") "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041)";
    
    console.log(" getCumulativeTotalAMT >>>", sql);
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};