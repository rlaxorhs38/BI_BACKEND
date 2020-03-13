var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getStockData = (req, res) => {
    console.log("============== getStockData Call ======================");

    let date = req.query.date;
    let currentYear = req.query.currentYear;
    let yearCode = req.query.yearCode;
    let gubun = req.query.gubun;
    let GUBUN = req.query.GUBUN;
    let FasionSUCDCode = req.query.FasionSUCDCode.split(',');
    let FutureSUCDCode = req.query.FutureSUCDCode.split(',');
    let StopSUCDCode = req.query.StopSUCDCode.split(',');

    let currentMonth = moment(date).format("M")
    
    let sql = ""
    if(gubun == 1) { // 제품 재고
      sql += "SELECT STOCK, PRDTYY, CU_1_TOT, LM_1_TOT, DU_1_TOT, (CU_1_TOT+LM_1_TOT+DU_1_TOT) TOT1, CU_2_TOT, LM_2_TOT, DU_2_TOT, (CU_2_TOT+LM_2_TOT+DU_2_TOT) TOT2, CU_3_TOT, LM_3_TOT, DU_3_TOT, (CU_3_TOT+LM_3_TOT+DU_3_TOT) TOT3, CU_4_TOT, LM_4_TOT, DU_4_TOT, (CU_4_TOT+LM_4_TOT+DU_4_TOT) TOT4 FROM ( "
      sql += "SELECT STOCK, PRDTYY, SUM(CU_1_TOT) CU_1_TOT, SUM(LM_1_TOT) LM_1_TOT, SUM(DU_1_TOT) DU_1_TOT , SUM(CU_2_TOT) CU_2_TOT, SUM(LM_2_TOT) LM_2_TOT, SUM(DU_2_TOT) DU_2_TOT , SUM(CU_3_TOT) CU_3_TOT, SUM(LM_3_TOT) LM_3_TOT, SUM(DU_3_TOT) DU_3_TOT,  SUM(CU_4_TOT) CU_4_TOT, SUM(LM_4_TOT) LM_4_TOT, SUM(DU_4_TOT) DU_4_TOT FROM ( "
      // 정상
      sql += "SELECT STOCK, PRDTYY, CU_1_TOT, CU_2_TOT, CU_3_TOT, CU_4_TOT, 0 AS LM_1_TOT, 0 AS LM_2_TOT, 0 AS LM_3_TOT, 0 AS LM_4_TOT, 0 AS DU_1_TOT, 0 AS DU_2_TOT, 0 AS DU_3_TOT, 0 AS DU_4_TOT FROM (  "
      sql += "SELECT MAX(STOCK)STOCK, PRDTYY,SUM(CU_1_TOT) CU_1_TOT, SUM(CU_2_TOT) CU_2_TOT, SUM(CU_3_TOT) CU_3_TOT, SUM(CU_4_TOT) CU_4_TOT FROM ( "
      sql += "SELECT STOCK, PRDTYY, SUM(STAMT) CU_1_TOT, SUM(LMSTAMT) CU_2_TOT, SUM(LYSTAMT) CU_3_TOT, SUM(LESTAMT) CU_4_TOT FROM BIFN051 "
      if(GUBUN == '패션사업'){
        sql += "WHERE SUCD IN ('1','12','4','3','21') " // 패션사업(FO는 정상없음), 중단사업
        sql += "AND STOCK = 'N' " // 정상
      } else if(GUBUN == '미래성장사업'){
        sql += "WHERE SUCD IN ('23','26','27','28') " // 미래성장사업
        sql += "AND PRDTYY = 'J' " // 미래성장사업은 정상만 있고 STOCK 값이 없어 2019년 4월 기준 J시즌을 정상으로 하드코딩
      } else if(GUBUN == '중단사업'){
        sql += "WHERE SUCD = '10' " // 패션사업(FO는 정상없음), 중단사업
        sql += "AND STOCK = 'N' " // 정상
      }
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
      if(GUBUN == '패션사업'){
        sql += "WHERE SUCD IN ('1','12','4','3','21') " // 패션사업(FO는 정상없음), 중단사업
        sql += "AND STOCK = 'C' " // 정상
      } else if(GUBUN == '미래성장사업'){
        sql += "WHERE SUCD IN ('23','26','27','28') " // 미래성장사업
        sql += "AND STOCK = 'C' " // 미래성장사업은 정상만 있고 STOCK 값이 없어 2019년 4월 기준 J시즌을 정상으로 하드코딩
      } else if(GUBUN == '중단사업'){
        sql += "WHERE SUCD = '10' " // 패션사업(FO는 정상없음), 중단사업
        sql += "AND STOCK = 'C' " // 정상
      }
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
      if(GUBUN == '패션사업'){
        sql += "WHERE SUCD IN ('1','12','4','3','21') " // 패션사업(FO는 정상없음), 중단사업
        sql += "AND STOCK = 'U' " // 정상
      } else if(GUBUN == '미래성장사업'){
        sql += "WHERE SUCD IN ('23','26','27','28') " // 미래성장사업
        sql += "AND STOCK = 'U' " // 미래성장사업은 정상만 있고 STOCK 값이 없어 2019년 4월 기준 J시즌을 정상으로 하드코딩
      } else if(GUBUN == '중단사업'){
        sql += "WHERE SUCD = '10' " // 패션사업(FO는 정상없음), 중단사업
        sql += "AND STOCK = 'U' " // 정상
      }
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
    } else { // 원자재 재고
      sql += "SELECT SUCD, PRDTYY, LM_1_TOT, CU_1_TOT, (LM_1_TOT+CU_1_TOT) TOT1, LM_2_TOT, CU_2_TOT, (LM_2_TOT+CU_2_TOT) TOT2, LM_3_TOT, CU_3_TOT, (LM_3_TOT+CU_3_TOT) TOT3, LM_4_TOT, CU_4_TOT, (LM_4_TOT+CU_4_TOT) TOT4 FROM ( "
      sql += "SELECT SUCD, PRDTYY, SUM(LM_1_TOT) LM_1_TOT, SUM(CU_1_TOT) CU_1_TOT, SUM(LM_2_TOT) LM_2_TOT, SUM(CU_2_TOT) CU_2_TOT, SUM(LM_3_TOT) LM_3_TOT, SUM(CU_3_TOT) CU_3_TOT, SUM(LM_4_TOT) LM_4_TOT, SUM(CU_4_TOT) CU_4_TOT FROM ( "
      sql += "SELECT SUCD, PRDTYY, LM_1_TOT, LM_2_TOT, LM_3_TOT, LM_4_TOT, 0 AS CU_1_TOT, 0 AS CU_2_TOT, 0 AS CU_3_TOT, 0 AS CU_4_TOT FROM ( ";
      sql += "SELECT SUCD, PRDTYY, SUM(STAMT) LM_1_TOT, SUM(LMSTAMT) LM_2_TOT, SUM(LYSTAMT) LM_3_TOT, SUM(LESTAMT) LM_4_TOT FROM BIFN051 ";
      if(GUBUN == '패션사업'){
        sql += "WHERE SUCD IN ("
        for (let i=0;i<FasionSUCDCode.length;i++) {
          sql += "'" + FasionSUCDCode[i] + "'"
          if (i < FasionSUCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(GUBUN == '미래성장사업'){
        sql += "WHERE SUCD IN ("
        for (let i=0;i<FutureSUCDCode.length;i++) {
          sql += "'" + FutureSUCDCode[i] + "'"
          if (i < FutureSUCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(GUBUN == '중단사업'){
        sql += "WHERE SUCD IN ("
        for (let i=0;i<StopSUCDCode.length;i++) {
          sql += "'" + StopSUCDCode[i] + "'"
          if (i < StopSUCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      }
      sql += "AND PRDTYY < '" + yearCode + "' ";
      sql += "AND SECGBN = '03' ";
      sql += "AND YYYY = '" + currentYear + "' ";
      sql += "AND MM = '" + currentMonth + "' ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
      sql += "GROUP BY SUCD, PRDTYY) ";
      sql += "UNION ALL ";
      sql += "SELECT SUCD, PRDTYY, 0 AS LM_1_TOT, 0 AS LM_2_TOT, 0 AS LM_3_TOT, 0 AS LM_4_TOT, CU_1_TOT, CU_2_TOT, CU_3_TOT, CU_4_TOT FROM ( ";
      sql += "SELECT SUCD, PRDTYY, SUM(STAMT) CU_1_TOT, SUM(LMSTAMT) CU_2_TOT, SUM(LYSTAMT) CU_3_TOT, SUM(LESTAMT) CU_4_TOT FROM BIFN051 ";
      if(GUBUN == '패션사업'){
        sql += "WHERE SUCD IN ("
        for (let i=0;i<FasionSUCDCode.length;i++) {
          sql += "'" + FasionSUCDCode[i] + "'"
          if (i < FasionSUCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(GUBUN == '미래성장사업'){
        sql += "WHERE SUCD IN ("
        for (let i=0;i<FutureSUCDCode.length;i++) {
          sql += "'" + FutureSUCDCode[i] + "'"
          if (i < FutureSUCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      } else if(GUBUN == '중단사업'){
        sql += "WHERE SUCD IN ("
        for (let i=0;i<StopSUCDCode.length;i++) {
          sql += "'" + StopSUCDCode[i] + "'"
          if (i < StopSUCDCode.length - 1) {
            sql += ","
          }
        }
        sql += ") ";
      }
      sql += "AND PRDTYY >= '" + yearCode + "' ";
      sql += "AND SECGBN = '03' ";
      sql += "AND YYYY = '" + currentYear + "' ";
      sql += "AND MM = '" + currentMonth + "' ";
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
      sql += "GROUP BY SUCD, PRDTYY) ";
      sql += ")GROUP BY SUCD, PRDTYY ";
      sql += ")";
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getDeptStockData = (req, res) => {
    console.log("============== getDeptStockData Call ======================");

    let date = req.query.date;
    let currentYear = req.query.currentYear;
    let yearCode = req.query.yearCode;
    let SUCD = req.query.SUCD
    let gubun = req.query.gubun;
    let GUBUN = req.query.GUBUN;

    let currentMonth = moment(date).format("M")

    let sql = ""
    if(gubun == 1) { // 제품 재고
      sql += "SELECT SUCD, STOCK, PRDTYY, CU_1_TOT, LM_1_TOT, DU_1_TOT, (CU_1_TOT+LM_1_TOT+DU_1_TOT) TOT1, CU_2_TOT, LM_2_TOT, DU_2_TOT, (CU_2_TOT+LM_2_TOT+DU_2_TOT) TOT2, CU_3_TOT, LM_3_TOT, DU_3_TOT, (CU_3_TOT+LM_3_TOT+DU_3_TOT) TOT3, CU_4_TOT, LM_4_TOT, DU_4_TOT, (CU_4_TOT+LM_4_TOT+DU_4_TOT) TOT4 FROM ( "
      sql += "SELECT SUCD, STOCK, PRDTYY, SUM(CU_1_TOT) CU_1_TOT, SUM(LM_1_TOT) LM_1_TOT, SUM(DU_1_TOT) DU_1_TOT , SUM(CU_2_TOT) CU_2_TOT, SUM(LM_2_TOT) LM_2_TOT, SUM(DU_2_TOT) DU_2_TOT , SUM(CU_3_TOT) CU_3_TOT, SUM(LM_3_TOT) LM_3_TOT, SUM(DU_3_TOT) DU_3_TOT,  SUM(CU_4_TOT) CU_4_TOT, SUM(LM_4_TOT) LM_4_TOT, SUM(DU_4_TOT) DU_4_TOT FROM ( "
      sql += "SELECT SUCD, STOCK, PRDTYY, CU_1_TOT, CU_2_TOT, CU_3_TOT, CU_4_TOT, 0 AS LM_1_TOT, 0 AS LM_2_TOT, 0 AS LM_3_TOT, 0 AS LM_4_TOT, 0 AS DU_1_TOT, 0 AS DU_2_TOT, 0 AS DU_3_TOT, 0 AS DU_4_TOT FROM "
      sql += "(SELECT SUCD, STOCK, PRDTYY, SUM(STAMT) CU_1_TOT, SUM(LMSTAMT) CU_2_TOT, SUM(LYSTAMT) CU_3_TOT, SUM(LESTAMT) CU_4_TOT FROM BIFN051 "
      sql += "WHERE SUCD = '" + SUCD + "' "
      // sql += "AND PRDTYY < '" + yearCode + "' ";
      
      if(GUBUN == "패션사업"){
        sql += "AND STOCK = 'N' " // 정상
      } else if(GUBUN == '미래성장사업'){
        sql += "AND PRDTYY = 'J' " // 미래성장사업은 정상만 있고 STOCK 값이 없어 2019년 4월 기준 J시즌을 정상으로 하드코딩
      } else if(GUBUN == "중단사업"){
        sql += "AND STOCK = 'N' " // 정상
      } 

      sql += "AND SECGBN = '04' ";
      sql += "AND YYYY = '" + currentYear + "' "
      sql += "AND MM = '" + currentMonth + "' "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
      sql += "GROUP BY SUCD, STOCK, PRDTYY) "
      sql += "UNION ALL "
      sql += "SELECT SUCD, STOCK, PRDTYY, 0 AS CU_1_TOT, 0 AS CU_2_TOT, 0 AS CU_3_TOT, 0 AS CU_4_TOT, LM_1_TOT, LM_2_TOT, LM_3_TOT, LM_4_TOT, 0 AS DU_1_TOT, 0 AS DU_2_TOT, 0 AS DU_3_TOT, 0 AS DU_4_TOT FROM "
      sql += "(SELECT SUCD, STOCK, PRDTYY, SUM(STAMT) LM_1_TOT, SUM(LMSTAMT) LM_2_TOT, SUM(LYSTAMT) LM_3_TOT, SUM(LESTAMT) LM_4_TOT FROM BIFN051 "
      sql += "WHERE SUCD = '" + SUCD + "' "
      // sql += "AND PRDTYY >= '" + yearCode + "' "
      if(GUBUN == "패션사업"){
        sql += "AND STOCK = 'C' " // 이월
      } else if(GUBUN == '미래성장사업'){
        sql += "AND STOCK = 'C' " // 미래성장사업은 정상만 있고 STOCK 값이 없어 2019년 4월 기준 J시즌을 정상으로 하드코딩
      } else if(GUBUN == "중단사업"){
        sql += "AND STOCK = 'C' " // 이월
      } 
      sql += "AND SECGBN = '04' ";
      sql += "AND YYYY = '" + currentYear + "' "
      sql += "AND MM = '" + currentMonth + "' "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
      sql += "GROUP BY SUCD, STOCK, PRDTYY) "
      sql += "UNION ALL "
      sql += "SELECT SUCD, STOCK, PRDTYY, 0 AS CU_1_TOT, 0 AS CU_2_TOT, 0 AS CU_3_TOT, 0 AS CU_4_TOT, 0 AS LM_1_TOT, 0 AS LM_2_TOT, 0 AS LM_3_TOT, 0 AS LM_4_TOT, DU_1_TOT, DU_2_TOT, DU_3_TOT, DU_4_TOT FROM "
      sql += "(SELECT SUCD, STOCK, PRDTYY, SUM(STAMT) DU_1_TOT, SUM(LMSTAMT) DU_2_TOT, SUM(LYSTAMT) DU_3_TOT, SUM(LESTAMT) DU_4_TOT FROM BIFN051 "
      sql += "WHERE SUCD = '" + SUCD + "' "
      // sql += "AND PRDTYY >= '" + yearCode + "' "
      if(GUBUN == "패션사업"){
        sql += "AND STOCK = 'U' " // 불용
      } else if(GUBUN == '미래성장사업'){
        sql += "AND STOCK = 'U' " // 미래성장사업은 정상만 있고 STOCK 값이 없어 2019년 4월 기준 J시즌을 정상으로 하드코딩
      } else if(GUBUN == "중단사업"){
        sql += "AND STOCK = 'U' " // 불용
      } 
      sql += "AND SECGBN = '04' ";
      sql += "AND YYYY = '" + currentYear + "' "
      sql += "AND MM = '" + currentMonth + "' "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
      sql += "GROUP BY SUCD, STOCK, PRDTYY) "
      sql += ") "
      sql += "GROUP BY SUCD, STOCK, PRDTYY "
      sql += ") "
      sql += "ORDER BY PRDTYY"
    } else { // 원자재 재고
      sql += "SELECT SUCD, PRDTYY, LM_1_TOT, CU_1_TOT, (LM_1_TOT+CU_1_TOT) TOT1, LM_2_TOT, CU_2_TOT, (LM_2_TOT+CU_2_TOT) TOT2, LM_3_TOT, CU_3_TOT, (LM_3_TOT+CU_3_TOT) TOT3, LM_4_TOT, CU_4_TOT, (LM_4_TOT+CU_4_TOT) TOT4 FROM ( "
      sql += "SELECT SUCD, PRDTYY, SUM(LM_1_TOT) LM_1_TOT, SUM(CU_1_TOT) CU_1_TOT, SUM(LM_2_TOT) LM_2_TOT, SUM(CU_2_TOT) CU_2_TOT, SUM(LM_3_TOT) LM_3_TOT, SUM(CU_3_TOT) CU_3_TOT, SUM(LM_4_TOT) LM_4_TOT, SUM(CU_4_TOT) CU_4_TOT FROM ( "
      sql += "SELECT SUCD, PRDTYY, LM_1_TOT, LM_2_TOT, LM_3_TOT, LM_4_TOT, 0 AS CU_1_TOT, 0 AS CU_2_TOT, 0 AS CU_3_TOT, 0 AS CU_4_TOT FROM "
      sql += "(SELECT SUCD, PRDTYY, SUM(STAMT) LM_1_TOT, SUM(LMSTAMT) LM_2_TOT, SUM(LYSTAMT) LM_3_TOT, SUM(LESTAMT) LM_4_TOT FROM BIFN051 "
      sql += "WHERE SUCD = '" + SUCD + "' "
      sql += "AND PRDTYY >= '" + yearCode + "' ";
      sql += "AND SECGBN = '03' ";
      sql += "AND YYYY = '" + currentYear + "' "
      sql += "AND MM = '" + currentMonth + "' "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
      sql += "GROUP BY SUCD, PRDTYY) "
      sql += "UNION ALL "
      sql += "SELECT SUCD, PRDTYY, 0 AS LM_1_TOT, 0 AS LM_2_TOT, 0 AS LM_3_TOT, 0 AS LM_4_TOT, CU_1_TOT, CU_2_TOT, CU_3_TOT, CU_4_TOT FROM ( "
      sql += "SELECT SUCD, PRDTYY, SUM(STAMT) CU_1_TOT, SUM(LMSTAMT) CU_2_TOT, SUM(LYSTAMT) CU_3_TOT, SUM(LESTAMT) CU_4_TOT FROM BIFN051 "
      sql += "WHERE SUCD = '" + SUCD + "' "
      sql += "AND PRDTYY < '" + yearCode + "' "
      sql += "AND SECGBN = '03' ";
      sql += "AND YYYY = '" + currentYear + "' "
      sql += "AND MM = '" + currentMonth + "' "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
      sql += "GROUP BY SUCD, PRDTYY) "
      sql += ")GROUP BY SUCD, PRDTYY "
      sql += ") ORDER BY PRDTYY"
    } 

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getDepartmentList = (req, res) => {
    console.log("============== getDepartmentList Call ======================");

    let date = req.query.date;
    let currentYear = req.query.currentYear;
    let yearCode = req.query.yearCode;
    let gubun = req.query.gubun;
    let gubun2 = req.query.gubun2;
    let FasionSUCDCode = req.query.FasionSUCDCode.split(',');
    let FutureSUCDCode = req.query.FutureSUCDCode.split(',');
    let StopSUCDCode = req.query.StopSUCDCode.split(',');

    let currentMonth = moment(date).format("M")

    // 사업부별 재품제고 누적합계, 전월증감함계, 기말증감합계 그래프
    let sql = "SELECT SUCD, CODNM, LM_1_TOT, CU_1_TOT, TOT1, LM_2_TOT, CU_2_TOT, TOT2, LM_3_TOT, CU_3_TOT, TOT3, LM_4_TOT, CU_4_TOT, TOT4 FROM ( "
    sql += "SELECT SUCD, SUM(LM_1_TOT) LM_1_TOT, SUM(CU_1_TOT) CU_1_TOT, SUM(TOT1) TOT1, SUM(LM_2_TOT) LM_2_TOT, SUM(CU_2_TOT) CU_2_TOT, SUM(TOT2) TOT2, SUM(LM_3_TOT) LM_3_TOT, SUM(CU_3_TOT) CU_3_TOT, SUM(TOT3) TOT3, SUM(LM_4_TOT) LM_4_TOT, SUM(CU_4_TOT) CU_4_TOT, SUM(TOT4) TOT4 FROM ( "
    sql += "SELECT SUCD, PRDTYY, LM_1_TOT, CU_1_TOT, (LM_1_TOT+CU_1_TOT) TOT1, LM_2_TOT, CU_2_TOT, (LM_2_TOT+CU_2_TOT) TOT2, LM_3_TOT, CU_3_TOT, (LM_3_TOT+CU_3_TOT) TOT3, LM_4_TOT, CU_4_TOT, (LM_4_TOT+CU_4_TOT) TOT4 FROM ( "
    sql += "SELECT SUCD, PRDTYY, SUM(LM_1_TOT) LM_1_TOT, SUM(CU_1_TOT) CU_1_TOT, SUM(LM_2_TOT) LM_2_TOT, SUM(CU_2_TOT) CU_2_TOT, SUM(LM_3_TOT) LM_3_TOT, SUM(CU_3_TOT) CU_3_TOT, SUM(LM_4_TOT) LM_4_TOT, SUM(CU_4_TOT) CU_4_TOT FROM ( "
    sql += "SELECT SUCD, PRDTYY, LM_1_TOT, LM_2_TOT, LM_3_TOT, LM_4_TOT, 0 AS CU_1_TOT, 0 AS CU_2_TOT, 0 AS CU_3_TOT, 0 AS CU_4_TOT FROM ( "
    sql += "SELECT SUCD, PRDTYY, SUM(STAMT) LM_1_TOT, SUM(LMSTAMT) LM_2_TOT, SUM(LYSTAMT) LM_3_TOT, SUM(LESTAMT) LM_4_TOT FROM BIFN051 "
    if(gubun2 == '패션사업'){
    sql += "WHERE SUCD IN ("
    for (let i=0;i<FasionSUCDCode.length;i++) {
        sql += "'" + FasionSUCDCode[i] + "'"
        if (i < FasionSUCDCode.length - 1) {
        sql += ","
        }
    }
    sql += ") ";
    } else if(gubun2 == '미래성장사업'){
    sql += "WHERE SUCD IN ("
    for (let i=0;i<FutureSUCDCode.length;i++) {
        sql += "'" + FutureSUCDCode[i] + "'"
        if (i < FutureSUCDCode.length - 1) {
        sql += ","
        }
    }
    sql += ") ";
    } else if(gubun2 == '중단사업'){
    sql += "WHERE SUCD IN ("
    for (let i=0;i<StopSUCDCode.length;i++) {
        sql += "'" + StopSUCDCode[i] + "'"
        if (i < StopSUCDCode.length - 1) {
        sql += ","
        }
    }
    sql += ") ";
    }
    sql += "AND PRDTYY < '" + yearCode + "' ";
    if(gubun == 1){
    sql += "AND SECGBN = '04' ";
    } else {
    sql += "AND SECGBN = '03' ";
    }
    sql += "AND YYYY = '" + currentYear + "' "
    sql += "AND MM = '" + currentMonth + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
    sql += "GROUP BY SUCD, PRDTYY) "
    sql += "UNION ALL "
    sql += "SELECT SUCD, PRDTYY, 0 AS LM_1_TOT, 0 AS LM_2_TOT, 0 AS LM_3_TOT, 0 AS LM_4_TOT, CU_1_TOT, CU_2_TOT, CU_3_TOT, CU_4_TOT FROM ( "
    sql += "SELECT SUCD, PRDTYY, SUM(STAMT) CU_1_TOT, SUM(LMSTAMT) CU_2_TOT, SUM(LYSTAMT) CU_3_TOT, SUM(LESTAMT) CU_4_TOT FROM BIFN051 "
    if(gubun2 == '패션사업'){
    sql += "WHERE SUCD IN ("
    for (let i=0;i<FasionSUCDCode.length;i++) {
        sql += "'" + FasionSUCDCode[i] + "'"
        if (i < FasionSUCDCode.length - 1) {
        sql += ","
        }
    }
    sql += ") ";
    } else if(gubun2 == '미래성장사업'){
    sql += "WHERE SUCD IN ("
    for (let i=0;i<FutureSUCDCode.length;i++) {
        sql += "'" + FutureSUCDCode[i] + "'"
        if (i < FutureSUCDCode.length - 1) {
        sql += ","
        }
    }
    sql += ") ";
    } else if(gubun2 == '중단사업'){
    sql += "WHERE SUCD IN ("
    for (let i=0;i<StopSUCDCode.length;i++) {
        sql += "'" + StopSUCDCode[i] + "'"
        if (i < StopSUCDCode.length - 1) {
        sql += ","
        }
    }
    sql += ") ";
    }
    sql += "AND PRDTYY >= '" + yearCode + "' "
    if(gubun == 1){
    sql += "AND SECGBN = '04' ";
    } else {
    sql += "AND SECGBN = '03' ";
    }
    sql += "AND YYYY = '" + currentYear + "' "
    sql += "AND MM = '" + currentMonth + "' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051) ";
    sql += "GROUP BY SUCD, PRDTYY) "
    sql += ")GROUP BY SUCD, PRDTYY "
    sql += ") ORDER BY PRDTYY "
    sql += ") "
    sql += "GROUP BY SUCD "
    sql += "ORDER BY SUCD)A, "
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' AND ADDINFO1 = 'Y' ORDER BY SORTORD) B "
    sql += "WHERE A.SUCD = B.CODE "
    sql += "ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};