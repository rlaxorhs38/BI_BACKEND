var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getCashData = (req, res) => {
    console.log("============== getCashData Call ======================");

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
      sql += "SELECT SUM(CASH_PLNAMT) CASH_PLNAMT, SUM(CASH_RSLTAMT) CASH_RSLTAMT, SUM(CASH_LMRSLTAMT) CASH_LMRSLTAMT, SUM(SALE_PLNAMT) AS SALE_PLNAMT, SUM(SALE_RSLTAMT) AS SALE_RSLTAMT FROM ( "
      sql += "SELECT CASH_PLNAMT, CASH_RSLTAMT, CASH_LMRSLTAMT, 0 AS SALE_PLNAMT, 0 AS SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(PLNAMT) CASH_PLNAMT, SUM(RSLTAMT) CASH_RSLTAMT, SUM(LMRSLTAMT) CASH_LMRSLTAMT FROM ( "
      sql += "SELECT SUCD, PLNAMT, RSLTAMT, LMRSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '02' "
      sql += "AND YYYY = '" + year + "' "
      sql += "AND MM = '" + month + "' "
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
      sql += "ORDER BY SUCD)) "
      sql += "UNION ALL "
      sql += "SELECT 0 AS CASH_PLNAMT, 0 AS CASH_RSLTAMT, 0 AS CASH_LMRSLTAMT, SALE_PLNAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(PLNAMT) SALE_PLNAMT, SUM(RSLTAMT) SALE_RSLTAMT FROM ( "
      sql += "SELECT SUCD, PLNAMT, RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '01' "
      sql += "AND YYYY = '" + year + "' "
      sql += "AND MM = '" + month + "' "
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
      sql += "ORDER BY SUCD)) "
      sql += ")"
    } else {
      if (year != moment().format("YYYY")) {
        currentMonth = "12"
      }

      sql += "SELECT SUM(CASH_PLNAMT) CASH_PLNAMT, SUM(CASH_RSLTAMT) CASH_RSLTAMT, SUM(CASH_LMRSLTAMT) CASH_LMRSLTAMT, SUM(SALE_PLNAMT) AS SALE_PLNAMT, SUM(SALE_RSLTAMT) AS SALE_RSLTAMT FROM ( "
      sql += "SELECT CASH_PLNAMT, CASH_RSLTAMT, CASH_LMRSLTAMT, 0 AS SALE_PLNAMT, 0 AS SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(PLNAMT) CASH_PLNAMT, SUM(RSLTAMT) CASH_RSLTAMT, SUM(LYRSLTAMT) CASH_LMRSLTAMT FROM ( "
      sql += "SELECT SUCD, PLNAMT, RSLTAMT, LYRSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '02' "
      sql += "AND YYYY = '" + year + "' "
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
      sql += "ORDER BY SUCD)) "
      sql += "UNION ALL "
      sql += "SELECT 0 AS CASH_PLNAMT, 0 AS CASH_RSLTAMT, 0 AS CASH_LMRSLTAMT, SALE_PLNAMT, SALE_RSLTAMT FROM ( "
      sql += "SELECT SUM(PLNAMT) SALE_PLNAMT, SUM(RSLTAMT) SALE_RSLTAMT FROM ( "
      sql += "SELECT SUCD, PLNAMT, RSLTAMT FROM BIFN050 "
      sql += "WHERE SECGBN = '01' "
      sql += "AND YYYY = '" + year + "' "
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
      sql += "ORDER BY SUCD)) "
      sql += ")"
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSaleTotRate = (req, res) => {
    console.log("============== getSaleTotRate Call ======================");

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
      sql += "SELECT SUCD, CODNM, "; 
      sql += "CASE WHEN TOT_RSLTAMT = 0 THEN 0 ELSE ROUND(RSLTAMT/TOT_RSLTAMT * 100,1) END AS CU_MONTH, ";
      sql += "CASE WHEN TOT_LMRSLTAMT = 0 THEN 0 ELSE ROUND(LMRSLTAMT/TOT_LMRSLTAMT * 100,1) END AS LAST_MONTH FROM ( ";
      sql += "SELECT SUCD, CODNM, RSLTAMT, LMRSLTAMT, TOT_RSLTAMT, TOT_LMRSLTAMT FROM ";
      sql += "(SELECT SUCD, RSLTAMT, LMRSLTAMT, ";
      sql += "(SELECT SUM(RSLTAMT) TOT_RSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '02' ";
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
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) TOT_RSLTAMT, ";
      sql += "(SELECT SUM(LMRSLTAMT) TOT_LMRSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '02' ";
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
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) TOT_LMRSLTAMT ";
      sql += "FROM ( ";
      sql += "SELECT SUCD, SUM(RSLTAMT) RSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '02' "; 
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
      sql += "WHERE SECGBN = '02' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
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
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) TOT_RSLTAMT, ";
      sql += "(SELECT SUM(LMRSLTAMT) TOT_LMRSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '02' ";
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
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
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)) TOT_LMRSLTAMT ";
      sql += "FROM ( ";
      sql += "SELECT SUCD, SUM(RSLTAMT) RSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT FROM BIFN050 ";
      sql += "WHERE SECGBN = '02' "; 
      sql += "AND YYYY = '" + year + "' ";
      sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
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
      sql += "ORDER BY SUCD ";
      sql += ")) A, ";
      sql += "(SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' AND ADDINFO1 = 'Y' ORDER BY SORTORD) B ";
      sql += "WHERE A.SUCD = B.CODE ";
      sql += ") ";
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getDeptCashData = (req, res) => {
    console.log("============== getDeptCashData Call ======================");

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
        sql += "SELECT SUCD, CODNM, LYRSLTAMT, LMRSLTAMT, PLNAMT, RSLTAMT, NORSTAMT, FOWSTAMT, LMNORSTAMT, LMFOWSTAMT FROM ";
        sql += "(SELECT SUCD, SUM(LYRSLTAMT) LYRSLTAMT, SUM(LMRSLTAMT) LMRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT, SUM(NORSTAMT) NORSTAMT, SUM(FOWSTAMT) FOWSTAMT, SUM(LMNORSTAMT) LMNORSTAMT, SUM(LMFOWSTAMT) LMFOWSTAMT FROM BIFN050 ";
        sql += "WHERE SECGBN = '02' ";
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
        sql += "ORDER BY SUCD) A, ";
        sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' AND ADDINFO1 = 'Y' ORDER BY SORTORD) B ";
        sql += "WHERE A.SUCD = B.CODE ";
        sql += "ORDER BY SORTORD";
      } else {
        if (year != moment().format("YYYY")) {
          currentMonth = "12"
        }

        sql += "SELECT SUCD, CODNM, LYRSLTAMT, PLNAMT, RSLTAMT FROM ";
        sql += "(SELECT SUCD, SUM(LYRSLTAMT) LYRSLTAMT, SUM(PLNAMT) PLNAMT, SUM(RSLTAMT) RSLTAMT FROM  BIFN050 ";
        sql += "WHERE SECGBN = '02' ";
        sql += "AND YYYY = '" + year + "' ";
        sql += "AND TO_NUMBER(MM) BETWEEN 1 AND " + currentMonth + " ";
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
        sql += "ORDER BY SUCD) A, ";
        sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' AND ADDINFO1 = 'Y' ORDER BY SORTORD) B ";
        sql += "WHERE A.SUCD = B.CODE ";
        sql += "ORDER BY SORTORD";
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
