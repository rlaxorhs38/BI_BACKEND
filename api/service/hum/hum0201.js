var axios = require('axios');
const db = require('../../config/db')

exports.getRatingInfoData = (req, res, next) => {
    console.log("============== getRatingInfoData Call ======================");
    let sucd = req.query.sucd;
    let chgucd = req.query.chgucd;
    

    let sql = "SELECT MEMO, CODNM FROM BICM011 "

    if(sucd == "12"){
        sql += "WHERE GBNCD = 'HR010'"
    }else{
      switch(chgucd){
        case "1":
          sql += "WHERE GBNCD = 'HR006'"
          break;
        case "2":
          sql += "WHERE GBNCD = 'HR007'"
          break;
        case "3":
          sql += "WHERE GBNCD = 'HR008'"
          break;
        case "4":
          sql += "WHERE GBNCD = 'HR009'"
          break;      
        default:
            break;
      }
    }
    sql += " ORDER BY SORTORD"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSalesManagerData = (req, res, next) => {
    console.log("============== getSalesManagerData Call ======================");
    let vdcd = req.query.vdcd;

    let sql = "SELECT CAREER, REGDEPTNM, REGNAME, REGCOMMENT, REGTEL, POSITNCD, POSITNNM, REGPHONE FROM BIHR050 "
    + "WHERE COMPANYCD = '1' "
    + "AND VDCD = '" + vdcd + "' "
    + "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) "
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSalesManInfo = (req, res, next) => {
    console.log("============== getSalesManInfo Call ======================");
    let hrid = req.query.hrid;

    let sql = "SELECT HRID, SEQ, REGDEPTNM, REGNAME, REGCOMMENT, REGTEL, POSITNCD, POSITNNM, REGPHONE, TO_CHAR(REGDT,'YYYY-MM-DD') REGDT FROM BIHR051 "
    + "WHERE HRID = '" + hrid + "' "
    + "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR051) "
    + "ORDER BY SEQ DESC"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSalesResultData = (req, res, next) => {
    console.log("============== getSalesResultData Call ======================");
    let vdcd = req.query.vdcd;
    let currentYear = req.query.currentYear;

    let sql = "SELECT SALEMM, GAMT, TSAMT, LTSAMT, ROUND(TSAMT/GAMT*100) G_RATIO, ROUND(TSAMT/LTSAMT*100) LTS_RATIO FROM ( "
    + "SELECT SALEMM, SUM(GAMT) GAMT, SUM(TSAMT) TSAMT, SUM(LTSAMT) LTSAMT FROM BISH041 "
    + "WHERE MVDCD = '" + vdcd + "' "
    + "AND SALEYY = '" + currentYear + "' "
    + "AND SALEMM BETWEEN '01' AND '12' "
    + "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) "
    + "GROUP BY SALEMM "
    + "ORDER BY SALEMM "
    + ")"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getAccumulatedSalesData = (req, res, next) => {
    console.log("============== getAccumulatedSalesData Call ======================");
    let vdcd = req.query.vdcd;
    let currentYear = req.query.currentYear;

    let sql = "SELECT TSAMT+ADVDEPAMT TSAMT, ONSAMT, SQTY, RQTY, SQTY+RQTY ACC_QTY FROM ( "
    + "SELECT MVDCD, SUM(TSAMT) TSAMT, SUM(ADVDEPAMT) ADVDEPAMT, SUM(ONSAMT) ONSAMT, SUM(SQTY) SQTY, SUM(RQTY) RQTY FROM BISH041 "
    + "WHERE MVDCD = '" + vdcd + "' "
    + "AND SALEYY = '" + currentYear + "' "
    + "AND SALEMM BETWEEN '01' AND '12' "
    + "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) "
    + "GROUP BY MVDCD"
    + ")"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSalesInfoData = (req, res, next) => {
    console.log("============== getSalesInfoData Call ======================");
    let vdcd = req.query.vdcd;
    let sucd = req.query.sucd;
    let currentYear = req.query.currentYear;

    let sql = "SELECT TSAMT, ADVDEPAMT, BR_TSAMT, BR_TTAGPRI, ROUND((1-(BR_TSAMT/BR_TTAGPRI))*100) BR_DCAVG, "
    + "ROUND((1-(TSAMT/TTAGPRI))*100) DCAVG, TTAGPRI, ROUND((ABS(RQTY)/SQTY)*100) RPER, SQTY, ABS(RQTY) RQTY FROM ( "
    + "SELECT SUM(TSAMT) TSAMT, SUM(ADVDEPAMT) ADVDEPAMT, SUM(TTAGPRI) TTAGPRI, SUM(SQTY) SQTY, "
    + "SUM(RQTY) RQTY, SUM(BR_TSAMT) BR_TSAMT, SUM(BR_TTAGPRI) BR_TTAGPRI FROM ( "
    + "SELECT TSAMT, ADVDEPAMT, TTAGPRI, SQTY, RQTY, 0 AS BR_TSAMT, 0 AS BR_TTAGPRI FROM ( "
    + "SELECT MVDCD, SUM(TSAMT) TSAMT, SUM(ADVDEPAMT) ADVDEPAMT, SUM(TTAGPRI) TTAGPRI, SUM(SQTY) SQTY, SUM(RQTY) RQTY FROM BISH041 "
    + "WHERE MVDCD = '" + vdcd + "' "
    + "AND SALEYY = '" + currentYear + "' "
    + "AND SALEMM BETWEEN '01' AND '12' "
    + "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) "
    + "GROUP BY MVDCD "
    + ") "
    + "UNION ALL "
    + "SELECT 0 AS TSAMT, 0 AS ADVDEPAMT, 0 AS TTAGPRI, 0 AS SQTY, 0 AS RQTY, BR_TSAMT, BR_TTAGPRI FROM ( "
    + "SELECT SUCD, SUM(TSAMT) BR_TSAMT, SUM(TTAGPRI) BR_TTAGPRI FROM BISH041 "
    + "WHERE SUCD = '" + sucd + "' "
    + "AND SALEYY = '" + currentYear + "' "
    + "AND SALEMM BETWEEN '01' AND '12' "
    + "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) "
    + "GROUP BY SUCD "
    + ") "
    + ") "
    + ") "
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getLeftInfoData = (req, res, next) => {
    console.log("============== getLeftInfoData Call ======================");
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
    + " WHERE COMPANYCD = '1'"
    + " AND VDCD = '" + vdcd + "'"  // 매출 데이터만 MVDCD 바라봄
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050)"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getBagicInfoTopData = (req, res, next) => {
    console.log("============== getBagicInfoTopData Call ======================");
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
    + " WHERE COMPANYCD = '1'"
    + " AND VDCD = '" + vdcd + "'" // 매출 데이터만 MVDCD 바라봄
    + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050)"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStyleStoreTop10 = (req, res, next) => {
    console.log("============== getStyleStoreTop10 Call ======================");
    let vdcd = req.query.vdcd;
    let sDate = req.query.sDate;
    let eDate = req.query.eDate;

    let sql = "SELECT ST.BRCD, ST.STYCD, ST.DIMAGEPATH, ST.MAINDIMAGEPATH, ST.RESEQ,"
    + " CASE WHEN STAGPRI > 0 THEN ROUND(SILAMT/STAGPRI*100,1) ELSE 0 END AS ACC_SALERATE,"
    + " CASE WHEN MRGU IS NULL THEN '' ELSE MRGU END AS MRGU,"
    + " SILAMT AS ACC_SALEAMT, SQTY AS ACC_SALEQTY FROM"
    + " (SELECT BRCD, STYCD, DIMAGEPATH, MAINDIMAGEPATH, MRGU, RESEQ, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM BISY021"
    + " WHERE VDCD = '" + vdcd + "'"
    + " AND INOUTDT BETWEEN '" + sDate + "' AND '" + eDate + "'"
    + " GROUP BY BRCD, STYCD, DIMAGEPATH, MAINDIMAGEPATH, MRGU, RESEQ) ST"
    + " LEFT OUTER JOIN"
    + " (SELECT STYCD, DIMAGEPATH, SUM(SQTY) INQTY, SUM(STAGPRI) STAGPRI FROM BISY021"
    + " WHERE VDCD = '" + vdcd + "'"
    + " GROUP BY STYCD, DIMAGEPATH) IT"
    + " ON ST.STYCD = IT.STYCD"
    + " ORDER BY ACC_SALEQTY DESC"

    // let sql = "SELECT ST.BRCD, ST.STYCD, ST.DIMAGEPATH, ST.MAINDIMAGEPATH, ST.RESEQ,"
    // + " CASE WHEN STAGPRI > 0 THEN ROUND(SILAMT/STAGPRI*100, 1) ELSE 0 END AS ACC_SALERATE,"
    // + " CASE WHEN MRGU IS NULL THEN '' ELSE MRGU END AS MRGU, SILAMT AS ACC_SALEAMT, SQTY AS ACC_SALEQTY FROM ("
    // + " SELECT BRCD,STYCD, MAX(A.DIMAGEPATH) DIMAGEPATH, MRGU, RESEQ, A.MAINSTYCD, MAX(B.DIMAGEPATH) MAINDIMAGEPATH, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM BISY021 A"
    // + " JOIN"
    // + " (SELECT MAINSTYCD,DIMAGEPATH FROM BISY021"
    // + " WHERE VDCD = '" + vdcd + "'"
    // + " GROUP BY MAINSTYCD, DIMAGEPATH) B"
    // + " ON A.MAINSTYCD = B.MAINSTYCD"
    // + " WHERE VDCD = '" + vdcd + "'"
    // + " AND INOUTDT BETWEEN '" + sDate + "' AND '" + eDate + "'"
    // + " GROUP BY BRCD, STYCD, MRGU, RESEQ, A.MAINSTYCD"
    // + " )ST"
    // + " LEFT OUTER JOIN"
    // + " (SELECT STYCD, DIMAGEPATH, SUM(SQTY) INQTY, SUM(STAGPRI) STAGPRI FROM BISY021"
    // + " WHERE VDCD = '" + vdcd + "'"
    // + " GROUP BY STYCD, DIMAGEPATH"
    // + " ) IT"
    // + " ON ST.STYCD = IT.STYCD"
    // + " ORDER BY ACC_SALEQTY DESC"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStyleSucdTop10 = (req, res, next) => {
    console.log("============== getStyleSucdTop10 Call ======================");
    let sucd = req.query.sucd;
    let sDate = req.query.sDate;
    let eDate = req.query.eDate;

    let sql = "SELECT ST.BRCD, ST.STYCD, ST.DIMAGEPATH, ST.MAINDIMAGEPATH, ST.RESEQ,"
    + " CASE WHEN STAGPRI > 0 THEN ROUND(SILAMT/STAGPRI*100,1) ELSE 0 END AS ACC_SALERATE,"
    + " CASE WHEN MRGU IS NULL THEN '' ELSE MRGU END AS MRGU,"
    + " SILAMT AS ACC_SALEAMT, SQTY AS ACC_SALEQTY FROM"
    + " (SELECT BRCD, STYCD, DIMAGEPATH, MAINDIMAGEPATH, MRGU, RESEQ, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM BISY011"
    + " WHERE SUCD = '" + sucd + "'"
    + " AND INOUTDT BETWEEN '" + sDate + "' AND '" + eDate + "'"
    + " GROUP BY BRCD, STYCD, DIMAGEPATH, MAINDIMAGEPATH, MRGU, RESEQ) ST"
    + " LEFT OUTER JOIN"
    + " (SELECT STYCD, DIMAGEPATH, SUM(SQTY) INQTY, SUM(STAGPRI) STAGPRI FROM BISY011"
    + " WHERE SUCD = '" + sucd + "'"
    + " GROUP BY STYCD, DIMAGEPATH) IT"
    + " ON ST.STYCD = IT.STYCD"
    + " ORDER BY ACC_SALEQTY DESC"

    // let sql = "SELECT ST.BRCD, ST.STYCD, ST.DIMAGEPATH, ST.MAINDIMAGEPATH, ST.RESEQ,"
    // + " CASE WHEN STAGPRI > 0 THEN ROUND(SILAMT/STAGPRI*100, 1) ELSE 0 END AS ACC_SALERATE,"
    // + " CASE WHEN MRGU IS NULL THEN '' ELSE MRGU END AS MRGU, SILAMT AS ACC_SALEAMT, SQTY AS ACC_SALEQTY FROM ("
    // + " SELECT BRCD,STYCD, MAX(A.DIMAGEPATH) DIMAGEPATH, MRGU, RESEQ, A.MAINSTYCD, MAX(B.DIMAGEPATH) MAINDIMAGEPATH, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM BISY011 A"
    // + " JOIN"
    // + " (SELECT MAINSTYCD,DIMAGEPATH FROM BISY011"
    // + " WHERE SUCD = '" + sucd + "'"
    // + " GROUP BY MAINSTYCD, DIMAGEPATH) B"
    // + " ON A.MAINSTYCD = B.MAINSTYCD"
    // + " WHERE SUCD = '" + sucd + "'"
    // + " AND INOUTDT BETWEEN '" + sDate + "' AND '" + eDate + "'"
    // + " GROUP BY BRCD, STYCD, MRGU, RESEQ, A.MAINSTYCD"
    // + " )ST"
    // + " LEFT OUTER JOIN"
    // + " (SELECT STYCD, DIMAGEPATH, SUM(SQTY) INQTY, SUM(STAGPRI) STAGPRI FROM BISY011"
    // + " WHERE SUCD = '" + sucd + "'"
    // + " GROUP BY STYCD, DIMAGEPATH"
    // + " ) IT"
    // + " ON ST.STYCD = IT.STYCD"
    // + " ORDER BY ACC_SALEQTY DESC"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getAdditionalInfo = (req, res, next) => {
    console.log("============== getAdditionalInfo Call ======================");
    let vdcd = req.query.vdcd;
    let hrid = req.query.hrid;

    // 추가정보
    let sql = "SELECT CHGUMGNORMAL, CHGUMGEVENT, SDMGNORMAL, SDMGEVENT, SDMGONLINE, SDMGTRUST, SEC_CASH, SEC_INSU, BUYER FROM BIHR050"
            + " WHERE VDCD = '" + vdcd + "' "
            + " AND HRID = '" + hrid + "' "
            + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) "
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSpecialNote = (req, res, next) => {
    console.log("============== getSpecialNote Call ======================");
    let vdcd = req.query.vdcd;

    // 특이사항
    let sql = "SELECT AMTGRADE, STKGRADE, COMGRADE, VISGRADE, MNGGRADE, ROUND((AMTGRADE+STKGRADE+COMGRADE+VISGRADE+MNGGRADE)/5) GRADE_AVG, TOTGRADE FROM BIHR050 "
            + " WHERE COMPANYCD = '1'"
            + " AND VDCD = '" + vdcd + "'"
            + " AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050)"
  
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};