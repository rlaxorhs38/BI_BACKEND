var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res) => {
    console.log("============== getMakeDataDate Call ======================");
    
    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BIFN050";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getRecentDate = (req, res) => {
    console.log("============== getRecentDate Call ======================");
    
    let sql = "SELECT MAX(TO_NUMBER(YYYY)) YYYY, MAX(TO_NUMBER(MM)) MM FROM BIFN050 ";
    sql += "WHERE YYYY = (SELECT MAX(YYYY) FROM BIFN050)";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSaleData = (req, res) => {
    console.log("============== getSaleData Call ======================");

    let choice = req.query.choice;
    let year = req.query.year;
    let month = req.query.month;
    let SUCDs = req.query.SUCDs.split(',');

    let currentMonth = moment().format("M")
    // 당원매출합계, 월평균할인율, 당월매출달성률, 전월대비매출증감
    let sql = ""
    if(choice == 1){
        sql += "SELECT SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(SILAMT) SILAMT, SUM(TAGAMT) TAGAMT FROM ( ";
        sql += "SELECT SUCD, PLNAMT, RSLTAMT, LMRSLTAMT, SILAMT, TAGAMT FROM BIFN050 ";
        sql += "WHERE SECGBN = '01' ";
        sql += "AND YYYY = '" + year + "' ";
        sql += "AND MM = '" + month + "' ";
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
      } else {
        if (year != moment().format("YYYY")) {
            currentMonth = "12"
        }

        sql += "SELECT SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(LYRSLTAMT) LMRSLTAMT, SUM(SILAMT) SILAMT, SUM(TAGAMT) TAGAMT FROM ( ";
        sql += "SELECT SUCD, PLNAMT, RSLTAMT, LYRSLTAMT, SILAMT, TAGAMT FROM BIFN050 ";
        sql += "WHERE SECGBN = '01' ";
        sql += "AND YYYY = '" + year + "' ";
        sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
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
      }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSaleTotRate = (req, res) => {
    console.log("============== getSaleTotRate Call ======================");

    let choice = req.query.choice;
    let year = req.query.year;
    let month = req.query.month;
    let authSUCDCode = req.query.authSUCDCode.split(',');

    let currentMonth = moment().format("M")
    let sql = ""
    if(choice == 1){
      sql += "SELECT SUCD, CODNM, "; 
      sql += "CASE WHEN TOT_RSLTAMT = 0 THEN 0 ELSE ROUND(RSLTAMT/TOT_RSLTAMT * 100,1) END AS CU_MONTH, ";
      sql += "CASE WHEN TOT_LMRSLTAMT = 0 THEN 0 ELSE ROUND(LMRSLTAMT/TOT_LMRSLTAMT * 100,1) END AS LAST_MONTH FROM ( ";
      sql += "SELECT SUCD, CODNM, RSLTAMT, LMRSLTAMT, TOT_RSLTAMT, TOT_LMRSLTAMT FROM ";
      sql += "(SELECT SUCD, RSLTAMT, LMRSLTAMT, ";
      sql += "(SELECT SUM(RSLTAMT) TOT_RSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND MM = '" + month + "' ";
      sql += "AND SUCD IN ("
      for (let i=0;i<authSUCDCode.length;i++) {
        sql += "'" + authSUCDCode[i] + "'"
        if (i < authSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) TOT_RSLTAMT, ";
      sql += "(SELECT SUM(LMRSLTAMT) TOT_LMRSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND MM = '" + month + "' ";
      sql += "AND SUCD IN ("
      for (let i=0;i<authSUCDCode.length;i++) {
        sql += "'" + authSUCDCode[i] + "'"
        if (i < authSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) TOT_LMRSLTAMT ";
      sql += "FROM ( ";
      sql += "SELECT SUCD, SUM(RSLTAMT) RSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' "; 
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND MM = '" + month + "' ";
      sql += "AND SUCD IN ("
      for (let i=0;i<authSUCDCode.length;i++) {
        sql += "'" + authSUCDCode[i] + "'"
        if (i < authSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "GROUP BY SUCD ";
      sql += "ORDER BY SUCD ";
      sql += ")) A, ";
      sql += "(SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' AND ADDINFO1 = 'Y' ORDER BY SORTORD) B ";
      sql += "WHERE A.SUCD = B.CODE ";
      sql += ") ";
    } else {
      if (year != moment().format("YYYY")) {
        currentMonth = "12"
      }

      sql += "SELECT SUCD, CODNM, "; 
      sql += "CASE WHEN TOT_RSLTAMT = 0 THEN 0 ELSE ROUND(RSLTAMT/TOT_RSLTAMT * 100,1) END AS CU_MONTH, ";
      sql += "CASE WHEN TOT_LMRSLTAMT = 0 THEN 0 ELSE ROUND(LMRSLTAMT/TOT_LMRSLTAMT * 100,1) END AS LAST_MONTH FROM ( ";
      sql += "SELECT SUCD, CODNM, RSLTAMT, LMRSLTAMT, TOT_RSLTAMT, TOT_LMRSLTAMT FROM ";
      sql += "(SELECT SUCD, RSLTAMT, LMRSLTAMT, ";
      sql += "(SELECT SUM(RSLTAMT) TOT_RSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
      sql += "AND SUCD IN ("
      for (let i=0;i<authSUCDCode.length;i++) {
        sql += "'" + authSUCDCode[i] + "'"
        if (i < authSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) TOT_RSLTAMT, ";
      sql += "(SELECT SUM(LMRSLTAMT) TOT_LMRSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
      sql += "AND SUCD IN ("
      for (let i=0;i<authSUCDCode.length;i++) {
        sql += "'" + authSUCDCode[i] + "'"
        if (i < authSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) TOT_LMRSLTAMT ";
      sql += "FROM ( ";
      sql += "SELECT SUCD, SUM(RSLTAMT) RSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' "; 
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
      sql += "AND SUCD IN ("
      for (let i=0;i<authSUCDCode.length;i++) {
        sql += "'" + authSUCDCode[i] + "'"
        if (i < authSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "GROUP BY SUCD ";
      sql += "ORDER BY SUCD ";
      sql += ")) A, ";
      sql += "(SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' AND ADDINFO1 = 'Y' ORDER BY SORTORD) B ";
      sql += "WHERE A.SUCD = B.CODE ";
      sql += ") ";
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSaleDeptData = (req, res) => {
    console.log("============== getSaleDeptData Call ======================");

    let choice = req.query.choice;
    let year = req.query.year;
    let month = req.query.month;
    let FasionSUCDCode = req.query.FasionSUCDCode.split(',');
    let FutureSUCDCode = req.query.FutureSUCDCode.split(',');
    let StopSUCDCode = req.query.StopSUCDCode.split(',');

    let currentMonth = moment().format("M")
    let sql = ""
    if(choice == 1){
      sql += "SELECT '패션사업' AS 'GUBUN', LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, NORSTAMT, FOWSTAMT, LMNORSTAMT, LMFOWSTAMT FROM ( ";
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(NORSTAMT) NORSTAMT, SUM(FOWSTAMT) FOWSTAMT, SUM(LMNORSTAMT) LMNORSTAMT, SUM(LMFOWSTAMT) LMFOWSTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND MM = '" + month + "' ";
      sql += "AND SUCD IN ("
      for (let i=0;i<FasionSUCDCode.length;i++) {
        sql += "'" + FasionSUCDCode[i] + "'"
        if (i < FasionSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += ") ";
      sql += "UNION ALL ";
      sql += "SELECT '미래성장사업' AS 'GUBUN', LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, NORSTAMT, FOWSTAMT, LMNORSTAMT, LMFOWSTAMT FROM ( ";
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(NORSTAMT) NORSTAMT, SUM(FOWSTAMT) FOWSTAMT, SUM(LMNORSTAMT) LMNORSTAMT, SUM(LMFOWSTAMT) LMFOWSTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND MM = '" + month + "' ";
      sql += "AND SUCD IN ("
      for (let i=0;i<FutureSUCDCode.length;i++) {
        sql += "'" + FutureSUCDCode[i] + "'"
        if (i < FutureSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += ") ";
      sql += "UNION ALL ";
      sql += "SELECT '중단사업' AS 'GUBUN', LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, NORSTAMT, FOWSTAMT, LMNORSTAMT, LMFOWSTAMT FROM ( ";
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(NORSTAMT) NORSTAMT, SUM(FOWSTAMT) FOWSTAMT, SUM(LMNORSTAMT) LMNORSTAMT, SUM(LMFOWSTAMT) LMFOWSTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND MM = '" + month + "' ";
      sql += "AND SUCD IN ("
      for (let i=0;i<StopSUCDCode.length;i++) {
        sql += "'" + StopSUCDCode[i] + "'"
        if (i < StopSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += ")";
    } else {
      if (year != moment().format("YYYY")) {
        currentMonth = "12"
      }

      sql += "SELECT '패션사업' AS 'GUBUN', LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, NORSTAMT, FOWSTAMT, LMNORSTAMT, LMFOWSTAMT FROM ( ";
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(NORSTAMT) NORSTAMT, SUM(FOWSTAMT) FOWSTAMT, SUM(LMNORSTAMT) LMNORSTAMT, SUM(LMFOWSTAMT) LMFOWSTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
      sql += "AND SUCD IN ("
      for (let i=0;i<FasionSUCDCode.length;i++) {
        sql += "'" + FasionSUCDCode[i] + "'"
        if (i < FasionSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += ") ";
      sql += "UNION ALL ";
      sql += "SELECT '미래성장사업' AS 'GUBUN', LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, NORSTAMT, FOWSTAMT, LMNORSTAMT, LMFOWSTAMT FROM ( ";
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(NORSTAMT) NORSTAMT, SUM(FOWSTAMT) FOWSTAMT, SUM(LMNORSTAMT) LMNORSTAMT, SUM(LMFOWSTAMT) LMFOWSTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
      sql += "AND SUCD IN ("
      for (let i=0;i<FutureSUCDCode.length;i++) {
        sql += "'" + FutureSUCDCode[i] + "'"
        if (i < FutureSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += ") ";
      sql += "UNION ALL ";
      sql += "SELECT '중단사업' AS 'GUBUN', LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, NORSTAMT, FOWSTAMT, LMNORSTAMT, LMFOWSTAMT FROM ( ";
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(NORSTAMT) NORSTAMT, SUM(FOWSTAMT) FOWSTAMT, SUM(LMNORSTAMT) LMNORSTAMT, SUM(LMFOWSTAMT) LMFOWSTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
      sql += "AND SUCD IN ("
      for (let i=0;i<StopSUCDCode.length;i++) {
        sql += "'" + StopSUCDCode[i] + "'"
        if (i < StopSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += ")";
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getDepartmentList = (req, res) => {
    console.log("============== getDepartmentList Call ======================");

    let choice = req.query.choice;
    let year = req.query.year;
    let month = req.query.month;
    let gubun = req.query.gubun;
    let FasionSUCDCode = req.query.FasionSUCDCode.split(',');
    let FutureSUCDCode = req.query.FutureSUCDCode.split(',');
    let StopSUCDCode = req.query.StopSUCDCode.split(',');

    let currentMonth = moment().format("M")
    let sql = ""
    if(choice == 1){
      sql += "SELECT SUCD, CODNM, PLNAMT, RSLTAMT FROM ( ";
      sql += "SELECT SUCD, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050  ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND MM = '" + month + "' ";
      if(gubun == '패션사업'){
        sql += "AND SUCD IN ("
        for (let i=0;i<FasionSUCDCode.length;i++) {
          sql += "'" + FasionSUCDCode[i] + "'"
          if (i < FasionSUCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '미래성장사업'){
        sql += "AND SUCD IN ("
        for (let i=0;i<FutureSUCDCode.length;i++) {
          sql += "'" + FutureSUCDCode[i] + "'"
          if (i < FutureSUCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '중단사업'){
        sql += "AND SUCD IN ("
        for (let i=0;i<StopSUCDCode.length;i++) {
          sql += "'" + StopSUCDCode[i] + "'"
          if (i < StopSUCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      }
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "GROUP BY SUCD ";
      sql += "ORDER BY SUCD)A, ";
      sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' AND ADDINFO1 = 'Y' ORDER BY SORTORD) B ";
      sql += "WHERE A.SUCD = B.CODE ";
      sql += "ORDER BY SORTORD";
    } else {
      if (year != moment().format("YYYY")) {
        currentMonth = "12"
      }

      sql += "SELECT SUCD, CODNM, PLNAMT, RSLTAMT FROM ( ";
      sql += "SELECT SUCD, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050  ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " "
      if(gubun == '패션사업'){
        sql += "AND SUCD IN ("
        for (let i=0;i<FasionSUCDCode.length;i++) {
          sql += "'" + FasionSUCDCode[i] + "'"
          if (i < FasionSUCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '미래성장사업'){
        sql += "AND SUCD IN ("
        for (let i=0;i<FutureSUCDCode.length;i++) {
          sql += "'" + FutureSUCDCode[i] + "'"
          if (i < FutureSUCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '중단사업'){
        sql += "AND SUCD IN ("
        for (let i=0;i<StopSUCDCode.length;i++) {
          sql += "'" + StopSUCDCode[i] + "'"
          if (i < StopSUCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      }
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "GROUP BY SUCD ";
      sql += "ORDER BY SUCD)A, ";
      sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' AND ADDINFO1 = 'Y' ORDER BY SORTORD) B ";
      sql += "WHERE A.SUCD = B.CODE ";
      sql += "ORDER BY SORTORD";
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSaleBrandDeptData = (req, res) => {
    console.log("============== getSaleBrandDeptData Call ======================");

    let choice = req.query.choice;
    let year = req.query.year;
    let month = req.query.month;
    let authBRCDCode = req.query.authBRCDCode.split(',');

    let currentMonth = moment().format("M")
    let sql = ""
    if(choice == 1){
      sql += "SELECT BRCD, SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND MM = '" + month + "' ";
      sql += "AND BRCD IN (";
      for (i=0;i<authBRCDCode.length;i++) {
        sql += "'" + authBRCDCode[i] + "'";
        if (i < authBRCDCode.length - 1) {
          sql += ",";
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "GROUP BY BRCD ";
      sql += "ORDER BY BRCD";
    } else {
      if (year != moment().format("YYYY")) {
        currentMonth = "12"
      }

      sql += "SELECT BRCD, SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '01' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
      sql += "AND BRCD IN (";
      for (i=0;i<authBRCDCode.length;i++) {
        sql += "'" + authBRCDCode[i] + "'";
        if (i < authBRCDCode.length - 1) {
          sql += ",";
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "GROUP BY BRCD ";
      sql += "ORDER BY BRCD";
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};
