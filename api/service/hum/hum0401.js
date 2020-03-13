var axios = require('axios');
const db = require('../../config/db')

exports.getLeftInfoData3 = (req, res, next) => {
    console.log("============== getLeftInfoData3 Call ======================");
    let vdcd = req.query.vdcd;
    let currentYear = req.query.currentYear;

    let sql = "SELECT SUCD, SUNM, AMTRATINGNM, PHOTOPATH, NAME, JAEJIGNM, ONEAVGAMT, TWOAVGAMT, MARRYYN, STDT, EMAIL, TO_CHAR(UPDDT, 'YYYY-MM-DD HH24:MI') UPDDT, "
    + " (SELECT SUM(TSAMT)+SUM(ADVDEPAMT) TSAMT FROM BISH041"
    + " WHERE MVDCD = '" + vdcd + "'" // 매출 데이터만 MVDCD 바라봄
    + " AND SALEYY = '" + (currentYear-2) + "'"
    + " AND SALEMM BETWEEN '01' AND '12'"
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041)) TWOYEAR_AGO_AMT,"
    + " (SELECT SUM(TSAMT)+SUM(ADVDEPAMT) TSAMT FROM BISH041"
    + " WHERE MVDCD = '" + vdcd + "'" // 매출 데이터만 MVDCD 바라봄
    + " AND SALEYY = '" + (currentYear-1) + "'"
    + " AND SALEMM BETWEEN '01' AND '12'"
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041)) ONEYEAR_AGO_AMT,"
    + " VDSNM, CHGUCD, CHGUNM, SI, GU, BIRTHYEAR, PHONE FROM BIHR050"
    + " WHERE COMPANYCD = '3'"
    + " AND VDCD = '" + vdcd + "'"  // 매출 데이터만 MVDCD 바라봄
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050)"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getBagicInfoTopData3 = (req, res, next) => {
    console.log("============== getBagicInfoTopData3 Call ======================");
    let vdcd = req.query.vdcd;
    let currentYear = req.query.currentYear;
    let lastMonth = req.query.lastMonth;

    let sql = "SELECT CHGUNM, AMTRATINGNM,"
    + " (SELECT TSAMT+ADVDEPAMT FROM ("
    + " SELECT SUM(TSAMT) TSAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISH041"
    + " WHERE MVDCD = '" + vdcd + "'" // 매출 데이터만 MVDCD 바라봄
    + " AND SALEYY = '" + currentYear + "'"
    + " AND SALEMM BETWEEN '01' AND '12'"
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041))"
    + " ) CUYEAR_AMT,"
    + " (SELECT TSAMT+ADVDEPAMT FROM ("
    + " SELECT SUM(TSAMT) TSAMT, SUM(ADVDEPAMT) ADVDEPAMT FROM BISH041"
    + " WHERE MVDCD = '" + vdcd + "'" // 매출 데이터만 MVDCD 바라봄
    + " AND SALEYY = '" + currentYear + "'"
    + " AND SALEMM BETWEEN '01' AND '" + lastMonth + "'"
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041))"
    + " )CUYEAR_AVG"
    + " FROM BIHR050"
    + " WHERE COMPANYCD = '3'"
    + " AND VDCD = '" + vdcd + "'" // 매출 데이터만 MVDCD 바라봄
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050)"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSpecialNote3 = (req, res, next) => {
    console.log("============== getSpecialNote3 Call ======================");
    let vdcd = req.query.vdcd;

    // 특이사항
    let sql = "SELECT AMTGRADE, STKGRADE, COMGRADE, VISGRADE, MNGGRADE, ROUND((AMTGRADE+STKGRADE+COMGRADE+VISGRADE+MNGGRADE)/5) GRADE_AVG, TOTGRADE FROM BIHR050 "
            + " WHERE COMPANYCD = '3'"
            + " AND VDCD = '" + vdcd + "'"
            + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050)"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSalesManagerData3 = (req, res, next) => {
    console.log("============== getSalesManagerData3 Call ======================");
    let vdcd = req.query.vdcd;

    let sql = "SELECT CAREER, REGDEPTNM, REGNAME, REGCOMMENT, REGTEL, POSITNCD, POSITNNM, REGPHONE FROM BIHR050 "
    + "WHERE COMPANYCD = '3' "
    + "AND VDCD = '" + vdcd + "' "
    + "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) "
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};