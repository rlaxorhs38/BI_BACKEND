var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getProfitData = (req, res) => {
    console.log("============== getProfitData Call ======================");

    let choice = req.query.choice;
    let year = req.query.year;
    let month = req.query.month;
    let SUCDs = req.query.SUCDs.split(',');

    let currentMonth = moment().format("M")
    let sql = ""
    if(choice == 1){
      sql += "SELECT SUM(PROFIT_PLNAMT) PROFIT_PLNAMT, SUM(PROFIT_RSLTAMT) PROFIT_RSLTAMT, SUM(PROFIT_LMRSLTAMT) PROFIT_LMRSLTAMT, SUM(SALE_PLNAMT) AS SALE_PLNAMT, SUM(SALE_RSLTAMT) AS SALE_RSLTAMT FROM ( "
      sql += "SELECT PROFIT_PLNAMT, PROFIT_RSLTAMT, PROFIT_LMRSLTAMT, 0 AS SALE_PLNAMT, 0 AS SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(PLNAMT) PROFIT_PLNAMT, SUM(RSLTAMT) PROFIT_RSLTAMT, SUM(LMRSLTAMT) PROFIT_LMRSLTAMT FROM ( "
      sql += "SELECT SUCD, PLNAMT, RSLTAMT, LMRSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '05' "
      sql += "AND YYYY = '" + year + "' "
      sql += "AND MM = '" + month + "' "
      sql += "AND SUCD IN ("
      for (let i=0;i<SUCDs.length;i++) {
        sql += "'" + SUCDs[i] + "'"
        if (i < SUCDs.length - 1) {
          sql += ","
        }
      }
      sql += ") "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "ORDER BY SUCD)) "
      sql += "UNION ALL "
      sql += "SELECT 0 AS PROFIT_PLNAMT, 0 AS PROFIT_RSLTAMT, 0 AS PROFIT_LMRSLTAMT, SALE_PLNAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(PLNAMT) SALE_PLNAMT, SUM(RSLTAMT) SALE_RSLTAMT FROM ( "
      sql += "SELECT SUCD, PLNAMT, RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '01' "
      sql += "AND YYYY = '" + year + "' "
      sql += "AND MM = '" + month + "' "
      sql += "AND SUCD IN ("
      for (let i=0;i<SUCDs.length;i++) {
        sql += "'" + SUCDs[i] + "'"
        if (i < SUCDs.length - 1) {
          sql += ","
        }
      }
      sql += ") "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "ORDER BY SUCD)) "
      sql += ")"
    } else {
       if (year != moment().format("YYYY")) {
        currentMonth = "12"
      }

      sql += "SELECT SUM(PROFIT_PLNAMT) PROFIT_PLNAMT, SUM(PROFIT_RSLTAMT) PROFIT_RSLTAMT, SUM(PROFIT_LMRSLTAMT) PROFIT_LMRSLTAMT, SUM(SALE_PLNAMT) AS SALE_PLNAMT, SUM(SALE_RSLTAMT) AS SALE_RSLTAMT FROM ( "
      sql += "SELECT PROFIT_PLNAMT, PROFIT_RSLTAMT, PROFIT_LMRSLTAMT, 0 AS SALE_PLNAMT, 0 AS SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(PLNAMT) PROFIT_PLNAMT, SUM(RSLTAMT) PROFIT_RSLTAMT, SUM(LYRSLTAMT) PROFIT_LMRSLTAMT FROM ( "
      sql += "SELECT SUCD, PLNAMT, RSLTAMT, LYRSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '05' "
      sql += "AND YYYY = '" + year + "' "
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " "
      sql += "AND SUCD IN ("
      for (let i=0;i<SUCDs.length;i++) {
        sql += "'" + SUCDs[i] + "'"
        if (i < SUCDs.length - 1) {
          sql += ","
        }
      }
      sql += ") "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "ORDER BY SUCD)) "
      sql += "UNION ALL "
      sql += "SELECT 0 AS PROFIT_PLNAMT, 0 AS PROFIT_RSLTAMT, 0 AS PROFIT_LMRSLTAMT, SALE_PLNAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(PLNAMT) SALE_PLNAMT, SUM(RSLTAMT) SALE_RSLTAMT FROM ( "
      sql += "SELECT SUCD, PLNAMT, RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '01' "
      sql += "AND YYYY = '" + year + "' "
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + month + " "
      sql += "AND SUCD IN ("
      for (let i=0;i<SUCDs.length;i++) {
        sql += "'" + SUCDs[i] + "'"
        if (i < SUCDs.length - 1) {
          sql += ","
        }
      }
      sql += ") "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "ORDER BY SUCD)) "
      sql += ")"
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getDeptProfitData = (req, res) => {
    console.log("============== getDeptProfitData Call ======================");

    let choice = req.query.choice;
    let year = req.query.year;
    let month = req.query.month;
    let FasionSUCDCode = req.query.FasionSUCDCode.split(',');
    let FutureSUCDCode = req.query.FutureSUCDCode.split(',');
    let StopSUCDCode = req.query.StopSUCDCode.split(',');

    let currentMonth = moment().format("M")
    let sql = ""
    if(choice == 1){
      sql += "SELECT '패션사업' AS 'GUBUN', LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(SALE_RSLTAMT) SALE_RSLTAMT FROM ( "
      sql += "SELECT LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, 0 AS SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '05' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND MM = '" + month + "' "
      sql += "AND SUCD IN ("
      for (let i=0;i<FasionSUCDCode.length;i++) {
        sql += "'" + FasionSUCDCode[i] + "'"
        if (i < FasionSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) ";
      sql += "UNION ALL "
      sql += "SELECT 0 AS LYRSLTAMT, 0 AS LMRSLTAMT, 0 AS PLNAMT, 0 AS RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(RSLTAMT) SALE_RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '01' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND MM = '" + month + "' "
      sql += "AND SUCD IN ("
      for (let i=0;i<FasionSUCDCode.length;i++) {
        sql += "'" + FasionSUCDCode[i] + "'"
        if (i < FasionSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) ";
      sql += ") "
      sql += ") "
      sql += "UNION ALL "
      sql += "SELECT '미래성장사업' AS 'GUBUN', LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(SALE_RSLTAMT) SALE_RSLTAMT FROM ( "
      sql += "SELECT LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, 0 AS SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '05' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND MM = '" + month + "' "
      sql += "AND SUCD IN ("
      for (let i=0;i<FutureSUCDCode.length;i++) {
        sql += "'" + FutureSUCDCode[i] + "'"
        if (i < FutureSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) ";
      sql += "UNION ALL "
      sql += "SELECT 0 AS LYRSLTAMT, 0 AS LMRSLTAMT, 0 AS PLNAMT, 0 AS RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(RSLTAMT) SALE_RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '01' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND MM = '" + month + "' "
      sql += "AND SUCD IN ("
      for (let i=0;i<FutureSUCDCode.length;i++) {
        sql += "'" + FutureSUCDCode[i] + "'"
        if (i < FutureSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) ";
      sql += ") "
      sql += ") "
      sql += "UNION ALL "
      sql += "SELECT '중단사업' AS 'GUBUN', LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(SALE_RSLTAMT) SALE_RSLTAMT FROM ( "
      sql += "SELECT LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, 0 AS SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '05' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND MM = '" + month + "' "
      sql += "AND SUCD IN ("
      for (let i=0;i<StopSUCDCode.length;i++) {
        sql += "'" + StopSUCDCode[i] + "'"
        if (i < StopSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) ";
      sql += "UNION ALL "
      sql += "SELECT 0 AS LYRSLTAMT, 0 AS LMRSLTAMT, 0 AS PLNAMT, 0 AS RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(RSLTAMT) SALE_RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '01' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND MM = '" + month + "' "
      sql += "AND SUCD IN ("
      for (let i=0;i<StopSUCDCode.length;i++) {
        sql += "'" + StopSUCDCode[i] + "'"
        if (i < StopSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) ";
      sql += ") "
      sql += ") "
      

    } else {
      if (year != moment().format("YYYY")) {
        currentMonth = "12"
      }

      sql += "SELECT '패션사업' AS 'GUBUN', LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(SALE_RSLTAMT) SALE_RSLTAMT FROM ( "
      sql += "SELECT LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, 0 AS SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '05' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " "
      sql += "AND SUCD IN ("
      for (let i=0;i<FasionSUCDCode.length;i++) {
        sql += "'" + FasionSUCDCode[i] + "'"
        if (i < FasionSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) ";
      sql += "UNION ALL "
      sql += "SELECT 0 AS LYRSLTAMT, 0 AS LMRSLTAMT, 0 AS PLNAMT, 0 AS RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(RSLTAMT) SALE_RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '01' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " "
      sql += "AND SUCD IN ("
      for (let i=0;i<FasionSUCDCode.length;i++) {
        sql += "'" + FasionSUCDCode[i] + "'"
        if (i < FasionSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) ";
      sql += ") "
      sql += ") "
      sql += "UNION ALL "
      sql += "SELECT '미래성장사업' AS 'GUBUN', LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(SALE_RSLTAMT) SALE_RSLTAMT FROM ( "
      sql += "SELECT LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, 0 AS SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '05' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " "
      sql += "AND SUCD IN ("
      for (let i=0;i<FutureSUCDCode.length;i++) {
        sql += "'" + FutureSUCDCode[i] + "'"
        if (i < FutureSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) ";
      sql += "UNION ALL "
      sql += "SELECT 0 AS LYRSLTAMT, 0 AS LMRSLTAMT, 0 AS PLNAMT, 0 AS RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(RSLTAMT) SALE_RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '01' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " "
      sql += "AND SUCD IN ("
      for (let i=0;i<FutureSUCDCode.length;i++) {
        sql += "'" + FutureSUCDCode[i] + "'"
        if (i < FutureSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) ";
      sql += ") "
      sql += ") "
      sql += "UNION ALL "
      sql += "SELECT '중단사업' AS 'GUBUN', LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(SALE_RSLTAMT) SALE_RSLTAMT FROM ( "
      sql += "SELECT LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, 0 AS SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '05' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " "
      sql += "AND SUCD IN ("
      for (let i=0;i<StopSUCDCode.length;i++) {
        sql += "'" + StopSUCDCode[i] + "'"
        if (i < StopSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) ";
      sql += "UNION ALL "
      sql += "SELECT 0 AS LYRSLTAMT, 0 AS LMRSLTAMT, 0 AS PLNAMT, 0 AS RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(RSLTAMT) SALE_RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '01' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " "
      sql += "AND SUCD IN ("
      for (let i=0;i<StopSUCDCode.length;i++) {
        sql += "'" + StopSUCDCode[i] + "'"
        if (i < StopSUCDCode.length - 1) {
          sql += ","
        }
      }
      sql += ") ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) ";
      sql += ") "
      sql += ") "
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getDeptBrandProfitData = (req, res) => {
    console.log("============== getDeptBrandProfitData Call ======================");

    let choice = req.query.choice;
    let year = req.query.year;
    let month = req.query.month;
    let gubun = req.query.gubun;
    let FasionBRCDCode = req.query.FasionBRCDCode.split(',');
    let FutureBRCDCode = req.query.FutureBRCDCode.split(',');
    let StopBRCDCode = req.query.StopBRCDCode.split(',');

    let currentMonth = moment().format("M")
    let sql = ""
    if(choice == 1){
      sql += "SELECT BRCD, SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(SALE_RSLTAMT) SALE_RSLTAMT FROM ( "
      sql += "SELECT BRCD, LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, 0 AS SALE_RSLTAMT FROM ( "
      sql += "SELECT BRCD, SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '05' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND MM = '" + month + "' "
      if(gubun == '패션사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<FasionBRCDCode.length;i++) {
          sql += "'" + FasionBRCDCode[i] + "'"
          if (i < FasionBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '미래성장사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<FutureBRCDCode.length;i++) {
          sql += "'" + FutureBRCDCode[i] + "'"
          if (i < FutureBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '중단사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<StopBRCDCode.length;i++) {
          sql += "'" + StopBRCDCode[i] + "'"
          if (i < StopBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      }
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "GROUP BY BRCD "
      sql += ") "
      sql += "UNION ALL "
      sql += "SELECT BRCD, 0 AS LYRSLTAMT, 0 AS LMRSLTAMT, 0 AS PLNAMT, 0 AS RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT BRCD, SUM(RSLTAMT) SALE_RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '01' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND MM = '" + month + "' "
      if(gubun == '패션사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<FasionBRCDCode.length;i++) {
          sql += "'" + FasionBRCDCode[i] + "'"
          if (i < FasionBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '미래성장사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<FutureBRCDCode.length;i++) {
          sql += "'" + FutureBRCDCode[i] + "'"
          if (i < FutureBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '중단사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<StopBRCDCode.length;i++) {
          sql += "'" + StopBRCDCode[i] + "'"
          if (i < StopBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      }
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "GROUP BY BRCD "
      sql += ") "
      sql += ") "
      sql += "GROUP BY BRCD "
      sql += "ORDER BY BRCD"

    } else {
      if (year != moment().format("YYYY")) {
        currentMonth = "12"
      }

      sql += "SELECT BRCD, SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(SALE_RSLTAMT) SALE_RSLTAMT FROM ( "
      sql += "SELECT BRCD, LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, 0 AS SALE_RSLTAMT FROM ( "
      sql += "SELECT BRCD, SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '05' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " "
      if(gubun == '패션사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<FasionBRCDCode.length;i++) {
          sql += "'" + FasionBRCDCode[i] + "'"
          if (i < FasionBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '미래성장사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<FutureBRCDCode.length;i++) {
          sql += "'" + FutureBRCDCode[i] + "'"
          if (i < FutureBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '중단사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<StopBRCDCode.length;i++) {
          sql += "'" + StopBRCDCode[i] + "'"
          if (i < StopBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      }
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "GROUP BY BRCD "
      sql += ") "
      sql += "UNION ALL "
      sql += "SELECT BRCD, 0 AS LYRSLTAMT, 0 AS LMRSLTAMT, 0 AS PLNAMT, 0 AS RSLTAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT BRCD, SUM(RSLTAMT) SALE_RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '01' " 
      sql += "AND YYYY = '" + year + "' "
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " "
      if(gubun == '패션사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<FasionBRCDCode.length;i++) {
          sql += "'" + FasionBRCDCode[i] + "'"
          if (i < FasionBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '미래성장사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<FutureBRCDCode.length;i++) {
          sql += "'" + FutureBRCDCode[i] + "'"
          if (i < FutureBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '중단사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<StopBRCDCode.length;i++) {
          sql += "'" + StopBRCDCode[i] + "'"
          if (i < StopBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      }
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "GROUP BY BRCD "
      sql += ") "
      sql += ") "
      sql += "GROUP BY BRCD "
      sql += "ORDER BY BRCD"
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getBrandCashData = (req, res) => {
    console.log("============== getBrandCashData Call ======================");

    let choice = req.query.choice;
    let year = req.query.year;
    let month = req.query.month;
    let gubun = req.query.gubun;
    let FasionBRCDCode = req.query.FasionBRCDCode.split(',');
    let FutureBRCDCode = req.query.FutureBRCDCode.split(',');
    let StopBRCDCode = req.query.StopBRCDCode.split(',');

    let currentMonth = moment().format("M")
    let sql = ""
    if(choice == 1){
      sql += "SELECT BRCD, CODNM, LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT FROM ";
      sql += "(SELECT BRCD, SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '02' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND MM = '" + month + "' ";
      if(gubun == '패션사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<FasionBRCDCode.length;i++) {
          sql += "'" + FasionBRCDCode[i] + "'"
          if (i < FasionBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '미래성장사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<FutureBRCDCode.length;i++) {
          sql += "'" + FutureBRCDCode[i] + "'"
          if (i < FutureBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '중단사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<StopBRCDCode.length;i++) {
          sql += "'" + StopBRCDCode[i] + "'"
          if (i < StopBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      }
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "GROUP BY BRCD ";
      sql += "ORDER BY BRCD)A, ";
      sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 WHERE GBNCD = 'C0003' AND USEYN = 'Y' AND ADDINFO1 = 'Y' ORDER BY SORTORD)B ";
      sql += "WHERE A.BRCD = B.CODE ";
      sql += "ORDER BY SORTORD";
    } else {
      if (year != moment().format("YYYY")) {
        currentMonth = "12"
      }

      sql += "SELECT BRCD, CODNM, LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT FROM ";
      sql += "(SELECT BRCD, SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '02' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
      if(gubun == '패션사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<FasionBRCDCode.length;i++) {
          sql += "'" + FasionBRCDCode[i] + "'"
          if (i < FasionBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '미래성장사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<FutureBRCDCode.length;i++) {
          sql += "'" + FutureBRCDCode[i] + "'"
          if (i < FutureBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(gubun == '중단사업'){
        sql += "AND BRCD IN ("
        for (let i=0;i<StopBRCDCode.length;i++) {
          sql += "'" + StopBRCDCode[i] + "'"
          if (i < StopBRCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      }
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050) ";
      sql += "GROUP BY BRCD ";
      sql += "ORDER BY BRCD)A, ";
      sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 WHERE GBNCD = 'C0003' AND USEYN = 'Y' AND ADDINFO1 = 'Y' ORDER BY SORTORD)B ";
      sql += "WHERE A.BRCD = B.CODE ";
      sql += "ORDER BY SORTORD";
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
    sql += "SELECT SUCD, CODNM, PLNAMT, RSLTAMT, NORSTAMT, FOWSTAMT, LMNORSTAMT, LMFOWSTAMT FROM ( ";
    sql += "SELECT SUCD, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(NORSTAMT) NORSTAMT, SUM(FOWSTAMT) FOWSTAMT, SUM(LMNORSTAMT) LMNORSTAMT, SUM(LMFOWSTAMT) LMFOWSTAMT FROM BIFN050  ";
    sql += "WHERE SECGBN = '05' ";
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

    sql += "SELECT SUCD, CODNM, PLNAMT, RSLTAMT, NORSTAMT, FOWSTAMT, LMNORSTAMT, LMFOWSTAMT FROM ( ";
    sql += "SELECT SUCD, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(NORSTAMT) NORSTAMT, SUM(FOWSTAMT) FOWSTAMT, SUM(LMNORSTAMT) LMNORSTAMT, SUM(LMFOWSTAMT) LMFOWSTAMT FROM BIFN050  ";
    sql += "WHERE SECGBN = '05' ";
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