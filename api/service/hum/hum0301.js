var axios = require('axios');
const db = require('../../config/db')

exports.getLeftInfoData2 = (req, res, next) => {
    console.log("============== getLeftInfoData2 Call ======================");
    let sno = req.query.sno;
    let hrid = req.query.hrid;
    let currentYear = req.query.currentYear;

    let sql = "SELECT SUCD, SUNM, AMTRATINGNM, PHOTOPATH, NAME, JAEJIGNM, ONEAVGAMT, TWOAVGAMT, BRCD, BRNM, MARRYYN, EMAIL,"
    + " TO_CHAR(UPDDT, 'YYYY-MM-DD HH24:MI') UPDDT,"
    + " (SELECT TO_CHAR(REGDT, 'YYYY-MM-DD') FROM BIHR051"
    + " WHERE HRID = '" + hrid + "'"
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR051)) REGDT,"
    + " (SELECT SUM(TSAMT) TSAMT FROM BISH041"
    + " WHERE SNO = " + sno
    + " AND SALEYY = '" + (currentYear-1) + "'"
    + " AND SALEMM BETWEEN '01' AND '12'"
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041)) TWOYEAR_AGO_AMT,"
    + " (SELECT SUM(TSAMT) TSAMT FROM BISH041"
    + " WHERE SNO = " + sno
    + " AND SALEYY = '" + (currentYear-2) + "'"
    + " AND SALEMM BETWEEN '01' AND '12'"
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041)) ONEYEAR_AGO_AMT,"
    + " VDSNM, CHGUCD, CHGUNM, SI, GU, BIRTHYEAR, PHONE  FROM BIHR050"
    + " WHERE SNO = " + sno;
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050)"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getBagicInfoTopData2 = (req, res, next) => {
    console.log("============== getBagicInfoTopData2 Call ======================");
    let sno = req.query.sno;

    let sql = "SELECT CHGUNM, AMTRATINGNM, ONEAVGAMT CUYEAR_AMT FROM BIHR050"
    + " WHERE SNO = " + sno;
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSpecialNote2 = (req, res, next) => {
    console.log("============== getSpecialNote2 Call ======================");
    let sno = req.query.sno;
    
    // 특이사항
    let sql = "SELECT AMTGRADE, STKGRADE, COMGRADE, VISGRADE, MNGGRADE, ROUND((AMTGRADE+STKGRADE+COMGRADE+VISGRADE+MNGGRADE)/5) GRADE_AVG, TOTGRADE FROM BIHR050 "
            + "WHERE SNO = " + sno;
            + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050)"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSalesManagerData2 = (req, res, next) => {
    console.log("============== getSalesManagerData2 Call ======================");
    let sno = req.query.sno;

    let sql = "SELECT CAREER, REGDEPTNM, REGNAME, REGCOMMENT, REGTEL, POSITNCD, POSITNNM, REGPHONE FROM BIHR050 "
    + "WHERE SNO = " + sno
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) "
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};