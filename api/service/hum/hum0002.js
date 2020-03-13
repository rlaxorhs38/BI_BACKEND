var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getCHGUCOMList = (req, res, next) => {
  console.log("============== getCHGUCOMList Call ======================");
  let selectedCOMPANYCD = req.query.selectedCOMPANYCD;
  
  // 유통사 리스트(공통 테이블에 없으므로 따로 구현)
  let sql = "SELECT CHGUCOM FROM BIHR050 ";
  sql += "WHERE COMPANYCD = '"+selectedCOMPANYCD+"' ";
  sql += "AND CHGUCOM IS NOT NULL ";
  sql += "GROUP BY CHGUCOM ";
  sql += "ORDER BY CHGUCOM";

  axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getBrandCodeList = (req, res, next) => {
  console.log("============== getBrandCodeList Call ======================");
  let selectedCOMPANYCD = req.query.selectedCOMPANYCD;
  
  let sql = "SELECT SUNM, SUCD FROM BIHR050"
  + " WHERE COMPANYCD = '" + selectedCOMPANYCD + "'"
  + " GROUP BY SUNM, SUCD"
  + " ORDER BY SUCD"

  axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSiList = (req, res, next) => {
  console.log("============== getSiList Call ======================");
  let selectedCOMPANYCD = req.query.selectedCOMPANYCD;
  
  let sql = "SELECT SI FROM BIHR050"
  + " WHERE COMPANYCD = '" + selectedCOMPANYCD + "'"
  + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) "
  + " GROUP BY SI"
  + " ORDER BY SI"

  axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getGuList = (req, res, next) => {
  console.log("============== getGuList Call ======================");
  let selectedCOMPANYCD = req.query.selectedCOMPANYCD;
  let selectedSi = req.query.selectedSi.split(',');
  
  let sql = "SELECT GU FROM BIHR050 WHERE COMPANYCD = '" + selectedCOMPANYCD + "'";
  sql += "AND SI IN (";
  for (let i=0;i<selectedSi.length;i++) {
  sql += "'" + selectedSi[i] + "'"
  if (i < selectedSi.length - 1) {
    sql += ","
  }
  }
  sql += ") ";
  sql += " GROUP BY GU"
  sql += " ORDER BY GU"

  axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSDList = (req, res) => {
  console.log("============== getSDList Call ======================");
//   res.send('respond with a resource');
  let selectedCOMPANYCD = req.query.selectedCOMPANYCD;
  let selectedSi = req.query.selectedSi.split(',');
  let selectedGu = req.query.selectedGu.split(',');
  let selectedBrand = req.query.selectedBrand.split(',');
  let selectedAmtRating = req.query.selectedAmtRating.split(',');
  let selectedAllAmtRating = req.query.selectedAllAmtRating;
  let initAllAmtRating = req.query.initAllAmtRating;
  let selectedCHGU = req.query.selectedCHGU.split(',');
  let selectedAllCHGU = req.query.selectedAllCHGU;
  let initAllCHGU = req.query.initAllCHGU;
  let selectedCHGUCOM = req.query.selectedCHGUCOM.split(',');
  let selectedAllCHGUCOM = req.query.selectedAllCHGUCOM;
  let initAllCHGUCOM = req.query.initAllCHGUCOM;
  
  /** 체크박스 필터 쿼리 생성 - Where절 삽입 용 */
  let filterSql = "";
  if(selectedSi.length>0){
    filterSql = "AND SI IN (";
    for (let i=0;i<selectedSi.length;i++) {
      filterSql += "'" + selectedSi[i] + "'"
      if (i < selectedSi.length - 1) {
        filterSql += ","
      }
    }
    filterSql += ") ";
  }
  if(selectedGu.length>0){
    filterSql += "AND GU IN (";
    for (let i=0;i<selectedGu.length;i++) {
      filterSql += "'" + selectedGu[i] + "'"
      if (i < selectedGu.length - 1) {
        filterSql += ","
      }
    }
    filterSql += ") ";
  }
  if(selectedCOMPANYCD == 1 || selectedCOMPANYCD == 3){ // 자사인력만 브랜드 있음
    if(selectedBrand.length>0){  
      filterSql += "AND SUCD IN (";
      for (let i=0;i<selectedBrand.length;i++) {
        filterSql += "'" + selectedBrand[i] + "'"
        if (i < selectedBrand.length - 1) {
          filterSql += ","
        }
      }
      filterSql += ") ";
    }
  }
  if(selectedAmtRating.length>0){
    if(selectedAllAmtRating == true || initAllAmtRating == true){
      filterSql += "AND (AMTRATINGNM IN (";
    } else {
      filterSql += "AND AMTRATINGNM IN (";
    }
    for (let i=0;i<selectedAmtRating.length;i++) {
      filterSql += "'" + selectedAmtRating[i] + "'"
      if (i < selectedAmtRating.length - 1) {
        filterSql += ","
      }
    }
    if(selectedAllAmtRating == true || initAllAmtRating == true){
      filterSql += ") OR AMTRATINGNM IS NULL) ";
    } else {
      filterSql += ") ";
    }
  }
  if(selectedCHGU.length>0){
    if(selectedAllCHGU == true ||  initAllCHGU == true){
      filterSql += "AND (CHGUCD IN (";
    } else {
      filterSql += "AND CHGUCD IN (";
    }
    for (let i=0;i<selectedCHGU.length;i++) {
      filterSql += "'" + selectedCHGU[i] + "'"
      if (i < selectedCHGU.length - 1) {
        filterSql += ","
      }
    }
    if(selectedAllCHGU == true ||  initAllCHGU == true){
      filterSql += ") OR CHGUCD IS NULL) ";
    } else {
      filterSql += ") ";
    }
  }
  if(selectedCOMPANYCD == 1 || selectedCOMPANYCD == 3){ // 자사인력만 유통사 있음
    if(selectedCHGUCOM.length>0){
      if(selectedAllCHGUCOM == true ||  initAllCHGUCOM == true){
        filterSql += "AND (CHGUCOM IN (";
      } else {
        filterSql += "AND CHGUCOM IN (";
      }
      for (let i=0;i<selectedCHGUCOM.length;i++) {
        filterSql += "'" + selectedCHGUCOM[i] + "'"
        if (i < selectedCHGUCOM.length - 1) {
          filterSql += ","
        }
      }
      if(selectedAllCHGUCOM == true ||  initAllCHGUCOM == true){
        filterSql += ") OR CHGUCOM IS NULL) ";
      } else {
        filterSql += ") ";
      }
    }
  }
  /** 체크박스 필터 쿼리 생성 끝*/

  let year = moment().format("YYYY")
  let sql;
  
  if(selectedCOMPANYCD == 1 || selectedCOMPANYCD == 3){
    sql = "SELECT HRID, A.VDCD AS VDCD, A.VDSNM VDSNM, SI, GUN, GU, PHOTOPATH, NAME, BIRTHYEAR, PHONE, SUCD, SUNM, BRCD, BRNM, ";
    sql += "ROUND(ONEYEAR_AGO_AMT/100000000 ,1) ONEYEAR_AGO_AMT, ROUND(TWOYEAR_AGO_AMT/100000000 ,1) TWOYEAR_AGO_AMT, AMTRATINGNM, CHGUCD, CHGUNM, CHGUCOM, STORENM, TOTGRADE FROM ";
    sql += "(SELECT HRID, VDCD, VDSNM, SI, GUN, GU, PHOTOPATH, NAME, BIRTHYEAR, PHONE, SUCD, SUNM, BRCD, BRNM, AMTRATINGNM, CHGUCD, CHGUNM, CHGUCOM, STORENM, TOTGRADE FROM BIHR050 ";
    sql += "WHERE COMPANYCD = '" + selectedCOMPANYCD + "' ";
    sql += filterSql;
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) ";
    sql += "ORDER BY HRID)A ";
    sql += "LEFT OUTER JOIN ";
    sql += "(SELECT MVDCD, SUM(ONEYEAR_AGO_AMT) ONEYEAR_AGO_AMT, SUM(TWOYEAR_AGO_AMT) TWOYEAR_AGO_AMT FROM ( ";
    sql += "SELECT MVDCD, ONEYEAR_AGO_AMT, 0 AS TWOYEAR_AGO_AMT FROM ( ";
    sql += "SELECT MVDCD, SUM(TSAMT+ADVDEPAMT) AS ONEYEAR_AGO_AMT FROM BISH041 ";
    sql += "WHERE SALEYY = '" + (year-1) + "' ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) ";
    sql += "GROUP BY MVDCD) ";
    sql += "UNION ALL ";
    sql += "SELECT MVDCD, 0 AS ONEYEAR_AGO_AMT, TWOYEAR_AGO_AMT FROM ( ";
    sql += "SELECT MVDCD, SUM(TSAMT+ADVDEPAMT) AS TWOYEAR_AGO_AMT FROM BISH041 ";
    sql += "WHERE SALEYY = '" + (year-2) + "' ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) ";
    sql += "GROUP BY MVDCD) ";
    sql += ") ";
    sql += "GROUP BY MVDCD)B ";
    sql += "ON A.VDCD = B.MVDCD";
  } else {
    sql = "SELECT HRID, VDCD, VDSNM, SNO, SI, GUN, GU, PHOTOPATH, NAME, BIRTHYEAR, PHONE, SUCD, BRCD, BRNM, AMTRATINGNM, CHGUCD, CHGUNM, CHGUCOM, STORENM, TOTGRADE, ";
    sql += "ROUND(TWOAVGAMT/100000000 ,1) TWOYEAR_AGO_AMT, ROUND(ONEAVGAMT/100000000 ,1) ONEYEAR_AGO_AMT, ROUND(AVGAMT/100000000 ,1) AVGAMT FROM BIHR050 ";
    sql += "WHERE COMPANYCD = '" + selectedCOMPANYCD + "' ";
    sql += filterSql;
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) ";
    sql += "ORDER BY TOTGRADE DESC, HRID";
  }

  axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.searchSD = (req, res, next) => {
  console.log("============== searchSD Call ======================");
  let year = moment().format("YYYY")
  let selectedCOMPANYCD = req.query.selectedCOMPANYCD;
  let searchName = req.query.searchName;
  
  let sql;
  if(selectedCOMPANYCD == 1 || selectedCOMPANYCD == 3){
    sql = "SELECT HRID, A.VDCD AS VDCD, A.VDSNM VDSNM, SI, GUN, GU, PHOTOPATH, NAME, BIRTHYEAR, PHONE, SUCD, SUNM, BRCD, BRNM, ";
    sql += "ROUND(ONEYEAR_AGO_AMT/100000000 ,1) ONEYEAR_AGO_AMT, ROUND(TWOYEAR_AGO_AMT/100000000 ,1) TWOYEAR_AGO_AMT, AMTRATINGNM, CHGUCD, CHGUNM, CHGUCOM, STORENM, TOTGRADE FROM ";
    sql += "(SELECT HRID, VDCD, VDSNM, SI, GUN, GU, PHOTOPATH, NAME, BIRTHYEAR, PHONE, SUCD, SUNM, BRCD, BRNM, AMTRATINGNM, CHGUCD, CHGUNM, CHGUCOM, STORENM, TOTGRADE FROM BIHR050 ";
    sql += "WHERE COMPANYCD = '1' ";
    sql += "AND NAME LIKE '%"+ searchName+"%' ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) ";
    sql += "ORDER BY HRID)A ";
    sql += "LEFT OUTER JOIN ";
    sql += "(SELECT MVDCD, SUM(ONEYEAR_AGO_AMT) ONEYEAR_AGO_AMT, SUM(TWOYEAR_AGO_AMT) TWOYEAR_AGO_AMT FROM ( ";
    sql += "SELECT MVDCD, ONEYEAR_AGO_AMT, 0 AS TWOYEAR_AGO_AMT FROM ( ";
    sql += "SELECT MVDCD, SUM(TSAMT+ADVDEPAMT) AS ONEYEAR_AGO_AMT FROM BISH041 ";
    sql += "WHERE SALEYY = '" + (year-1) + "' ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) ";
    sql += "GROUP BY MVDCD) ";
    sql += "UNION ALL ";
    sql += "SELECT MVDCD, 0 AS ONEYEAR_AGO_AMT, TWOYEAR_AGO_AMT FROM ( ";
    sql += "SELECT MVDCD, SUM(TSAMT+ADVDEPAMT) AS TWOYEAR_AGO_AMT FROM BISH041 ";
    sql += "WHERE SALEYY = '" + (year-2) + "' ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) ";
    sql += "GROUP BY MVDCD) ";
    sql += ") ";
    sql += "GROUP BY MVDCD)B ";
    sql += "ON A.VDCD = B.MVDCD";


  } else {
    sql = "SELECT HRID, VDCD, VDSNM, SNO, SI, GUN, GU, PHOTOPATH, NAME, BIRTHYEAR, PHONE, SUCD, BRCD, BRNM, AMTRATINGNM, CHGUCD, CHGUNM, CHGUCOM, STORENM, TOTGRADE, ";
    sql += "ROUND(TWOAVGAMT/100000000 ,1) TWOYEAR_AGO_AMT, ROUND(ONEAVGAMT/100000000 ,1) ONEYEAR_AGO_AMT, ROUND(AVGAMT/100000000 ,1) AVGAMT FROM BIHR050 ";
    sql += "WHERE COMPANYCD = '2' ";
    sql += "AND NAME LIKE '%"+ searchName+"%' ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) ";
    sql += "ORDER BY HRID";
  }

  axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};