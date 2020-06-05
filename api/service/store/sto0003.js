var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getMainCurrentStatus = (req, res) => {
    console.log("============== getMainCurrentStatus Call ======================");
    
    let sucd = req.query.sucd
    let year = req.query.year
    let month = req.query.month
    
    if (month.toString().length == 1) {
        month = "0" + month
    }
    
    let sql = "SELECT SUM(CNT) CNT, SUM(SILAMT) NOWMON, TO_CHAR(SUM(AVGMON)) AVGMON, TO_CHAR(ROUND(SUM(SILAMT)/SUM(CNT),0)) AVGVDCD FROM ( "
    sql += "SELECT SUM(CNT) CNT, SUM(NVL(SILAMT,0)) SILAMT, SUM(NVL(MONCNT,0)) MONCNT, ROUND(SUM(NVL(SILAMT,0))/SUM(NVL(MONCNT,0)), 0) AVGMON FROM ( "
    sql += "SELECT SUM(0) CNT, COUNT(SALEDT) MONCNT, SALEDT, SUM(SILAMT) SILAMT FROM ( "
    sql += "SELECT SUBSTR(SALEDT, 1, 6) SALEDT, SUM(SILAMT) SILAMT FROM BISL070 "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SALEDT "
    sql += ") "
    sql += "GROUP BY SALEDT "
    sql += "UNION ALL "
    sql += "SELECT COUNT(*) CNT, SUM(0) MONCNT, MAX('') SALEDT, SUM(0) SILAMT FROM ( "
    sql += "SELECT DISTINCT MVDCD "
    sql += "FROM BISL070 "
    sql += "WHERE 1=1 "
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += ") "
    sql += ") "
    sql += ")"  
    
    console.log("getMainCurrentStatus >>> ", sql);
    // let sql = "SELECT CNT, NOWMON, TO_CHAR(AVGMON) AVGMON, TO_CHAR(ROUND(SILAMT/CNT,0)) AVGVDCD FROM ( "
    // sql += "SELECT SUM(CNT) CNT , SUM(NOWMON) NOWMON , "
    // sql += "SUM(NVL(SILAMT,0)) SILAMT , SUM(NVL(MONCNT,0)) MONCNT, "
    // sql += "ROUND(SUM(NVL(SILAMT,0))/SUM(NVL(MONCNT,0)), 0) AVGMON FROM ( "
    // sql += "SELECT SUM(0) CNT, COUNT(SALEDT) MONCNT, SALEDT, SUM(SILAMT) SILAMT, CASE WHEN SALEDT='" + year + month + "' THEN SUM(SILAMT) ELSE 0 END NOWMON FROM( "
    // sql += "SELECT SUBSTR(SALEDT, 1, 6) SALEDT, SUM(SILAMT) SILAMT FROM BISL070 "
    // sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    // sql += "AND SUCD = '"+sucd+"' "
    // sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
	// sql += "GROUP BY SALEDT "
    // sql += ") "
    // sql += "GROUP BY SALEDT "
    // sql += "UNION ALL "
    // sql += "SELECT COUNT(*) CNT, SUM(0) MONCNT, MAX('') SALEDT, SUM(0) SILAMT, SUM(0) NOWMON FROM ( "
    // sql += "SELECT DISTINCT MVDCD FROM BISL070 "
    // sql += "WHERE SUBSTR(SALEDT, 1, 6) = '" + year + month + "' "
    // sql += "AND SUCD = '"+sucd+"' "
    // sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += ") "
    // sql += ")"
    // sql += ")"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getMainLastStatus = (req, res) => {
    console.log("============== getMainLastStatus Call ======================");
    
    let sucd = req.query.sucd
    let year = req.query.year
    let month = req.query.month
    
    if (month.toString().length == 1) {
        month = "0" + month
    }

    let lastYear = Number(year) - 1

    let sql = "SELECT SUM(CNT) CNT, SUM(SILAMT) NOWMON, TO_CHAR(SUM(AVGMON)) AVGMON, TO_CHAR(ROUND(SUM(SILAMT)/SUM(CNT),0)) AVGVDCD FROM ( "
    sql += "SELECT SUM(CNT) CNT, SUM(NVL(SILAMT,0)) SILAMT, SUM(NVL(MONCNT,0)) MONCNT, ROUND(SUM(NVL(SILAMT,0))/SUM(NVL(MONCNT,0)), 0) AVGMON FROM ( "
    sql += "SELECT SUM(0) CNT, COUNT(SALEDT) MONCNT, SALEDT, SUM(SILAMT) SILAMT FROM ( "
    sql += "SELECT SUBSTR(SALEDT, 1, 6) SALEDT, SUM(SILAMT) SILAMT FROM BISL070 "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SALEDT "
    sql += ") "
    sql += "GROUP BY SALEDT "
    sql += "UNION ALL "
    sql += "SELECT COUNT(*) CNT, SUM(0) MONCNT, MAX('') SALEDT, SUM(0) SILAMT FROM ( "
    sql += "SELECT DISTINCT MVDCD "
    sql += "FROM BISL070 "
    sql += "WHERE 1=1 "
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += ") "
    sql += ") "
    sql += ")"
    
    // sql = ""
    // sql += "SELECT CNT, NOWMON, TO_CHAR(AVGMON) AVGMON, TO_CHAR(ROUND(SILAMT/CNT,0)) AVGVDCD "
    // sql += "FROM( "
    // sql += "SELECT SUM(CNT) CNT , "
    // sql += "       SUM(NOWMON) NOWMON , "
    // sql += "       SUM(NVL(SILAMT,0)) SILAMT, "
    // sql += "       SUM(NVL(MONCNT,0)) MONCNT, "
    // sql += "       ROUND(SUM(NVL(SILAMT,0))/SUM(NVL(MONCNT,0)), 0) AVGMON "
    // sql += "  FROM (SELECT SUM(0) CNT , "
    // sql += "               COUNT(SALEDT) MONCNT , "
    // sql += "               SALEDT , "
    // sql += "               SUM(SILAMT) SILAMT , "
    // sql += "               CASE "
    // sql += "                   WHEN SALEDT='" + lastYear + month + "' THEN SUM(SILAMT) "
    // sql += "                   ELSE 0 "
    // sql += "               END NOWMON "
    // sql += "          FROM(SELECT SUBSTR(SALEDT, 1, 6) SALEDT , "
    // sql += "                       SUM(SILAMT) SILAMT "
    // sql += "                  FROM BISL070 "
    // sql += "                 WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01' AND '" + lastYear + month + "' "
    // sql += "                   AND SUCD = '"+sucd+"' "
    // sql += "                   AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "                 GROUP BY SALEDT) "
    // sql += "         GROUP BY SALEDT  "
    // sql += "         UNION ALL "
    // sql += "         SELECT COUNT(*) CNT , "
    // sql += "               SUM(0) MONCNT , "
    // sql += "               MAX('') SALEDT , "
    // sql += "               SUM(0) SILAMT , "
    // sql += "               SUM(0) NOWMON "
    // sql += "          FROM (SELECT DISTINCT MVDCD "
    // sql += "                  FROM BISL070 "
    // sql += "                 WHERE 1=1 "
    // sql += "                   AND SUBSTR(SALEDT, 1, 6) = '" + lastYear + month + "' "
    // sql += "                   AND SUCD = '"+sucd+"' "
    // sql += "                   AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) ) )  "
    // sql += ") "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getInDeCreaseStore = (req, res) => {
    console.log("============== getInDeCreaseStore Call ======================");
    
    let sucd = req.query.sucd
    let year = req.query.year
    let lastYear = Number(year) - 1
    let month = req.query.month
    let comcd = 1
    
    if (month.toString().length == 1) {
        month = "0" + month
    }
    
    if(sucd == 3) { // SO 사업부만 selectComcd 2
        comcd = 2
    }
    
    if(sucd == 1) { // MI사업부
        brcd = "BRCD = 'MI'"
    } else if(sucd == 12) { // MO사업부
        brcd = "BRCD = 'MI'"
    } else if(sucd == 4) { // IT사업부
        brcd = "BRCD = 'IT'"
    } else if(sucd == 3) { // SO사업부
        brcd = "BRCD = 'SO'"
    } else if(sucd == 21) { // FO사업부
        brcd = "BRCD IN ('MI','IT','SO')"
    }
    
    let sql = "SELECT SHTPNM, MVDCD, VDSNM, OPENDT, LASTYEARAMT, AMT, LASTYEARMONAMT, MONAMT MONAMT, MONAMT - LASTYEARMONAMT MONCHANGE, "
    sql += "CASE WHEN LASTYEARMONAMT = 0 THEN 0 ELSE ROUND((MONAMT - LASTYEARMONAMT)/LASTYEARMONAMT*100, 2) END MONCHANGERR FROM ( "
    sql += "SELECT SHTPNM, MVDCD, VDSNM, OPENDT, SUM(LASTYEARAMT) LASTYEARAMT, SUM(AMT) AMT, SUM(CNT1) CNT1, SUM(CNT2) CNT2, "
    sql += "CASE WHEN SUM(CNT1) = 0 THEN 0 ELSE ROUND(SUM(LASTYEARAMT)/SUM(CNT1), 0) END LASTYEARMONAMT, "
    sql += "CASE WHEN SUM(CNT2) = 0 THEN 0 ELSE ROUND(SUM(AMT)/SUM(CNT2), 0) END MONAMT FROM ( "
	sql += "SELECT COUNT(SALEDT) CNT1, SUM(0) CNT2, SHTPNM, MVDCD, VDSNM, OPENDT, SUM(LASTYEARAMT) LASTYEARAMT, SUM(AMT) AMT FROM ( "
    sql += "SELECT SHTPNM, MVDCD, VDSNM, SUBSTR(OPENDT, 1, 6) OPENDT, SUBSTR(SALEDT, 1, 6) SALEDT, SUM(SILAMT) LASTYEARAMT, SUM(0) AMT FROM BISL070 "
    sql += "WHERE 1=1 "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    sql += "AND COMCD = '"+comcd+"' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND " + brcd
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SALEDT "
	sql += ") "
	sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT "
	sql += "UNION ALL "
	sql += "SELECT SUM(0) CNT1, COUNT(SALEDT) CNT2, SHTPNM, MVDCD, VDSNM, OPENDT, SUM(LASTYEARAMT) LASTYEARAMT, SUM(AMT) AMT FROM ( "
    sql += "SELECT SHTPNM, MVDCD, VDSNM, SUBSTR(OPENDT, 1, 6) OPENDT, SUBSTR(SALEDT, 1, 6) SALEDT, SUM(0) LASTYEARAMT, SUM(SILAMT) AMT FROM BISL070 "
    sql += "WHERE 1=1 "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    sql += "AND COMCD = '"+comcd+"' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND " + brcd
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SALEDT "
	sql += ") "
	sql += "WHERE AMT <> 0 "
	sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT "
    sql += ") "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT "
    sql += ") "
    
    console.log("getInDeCreaseStore >>> ", sql);
    
    // let sql = "SELECT SHTPNM, MVDCD, VDSNM, OPENDT, LASTYEARAMT, AMT, LASTYEARMONAMT, MONAMT MONAMT, MONAMT - LASTYEARMONAMT MONCHANGE, "
    // sql += "CASE WHEN LASTYEARMONAMT = 0 THEN 0 ELSE ROUND((MONAMT - LASTYEARMONAMT)/LASTYEARMONAMT*100, 2) END MONCHANGERR FROM ( "
    // sql += "SELECT SHTPNM, MVDCD, VDSNM, OPENDT, SUM(LASTYEARAMT) LASTYEARAMT, SUM(AMT) AMT, SUM(CNT1) CNT1, SUM(CNT2) CNT2, "
    // sql += "CASE WHEN SUM(CNT1) = 0 THEN 0 ELSE ROUND(SUM(LASTYEARAMT)/SUM(CNT1), 0) END LASTYEARMONAMT, "
    // sql += "CASE WHEN SUM(CNT2) = 0 THEN 0 ELSE ROUND(SUM(AMT)/SUM(CNT2), 0) END MONAMT FROM ( "
    // sql += "SELECT COUNT(SALEDT) CNT1, SUM(0) CNT2, SHTPNM, MVDCD, VDSNM, OPENDT, SUM(LASTYEARAMT) LASTYEARAMT, SUM(AMT) AMT FROM ( "
    // sql += "SELECT SHTPNM, MVDCD, VDSNM, SUBSTR(OPENDT, 1, 6) OPENDT, SUBSTR(SALEDT, 1, 6) SALEDT, SUM(SILAMT) LASTYEARAMT, SUM(0) AMT FROM BISL070 "
    // sql += "WHERE 1=1 "
    // sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    // sql += "AND VDCD IN ( "
    // sql += "SELECT VDCD FROM ( "
    // sql += "SELECT VDCD FROM BISL070 "
    // sql += "WHERE COMCD = '"+comcd+"' "
    // sql += "AND SUCD = '"+sucd+"' "
    // sql += "AND " + brcd
    // sql += "AND SUBSTR(SALEDT, 1, 6) = '" + year + month + "' "
    // sql += "GROUP BY VDCD ) "
    // sql += "WHERE VDCD NOT IN ( "
    // sql += "SELECT VDCD FROM BISL070 "
    // sql += "WHERE COMCD = '"+comcd+"' "
    // sql += "AND SUCD = '"+sucd+"' "
    // sql += "AND " + brcd
    // sql += "AND SUBSTR(OPENDT,1,6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    // sql += "AND SUBSTR(SALEDT,1,6) = '" + year + month + "' "
    // sql += "GROUP BY VDCD) "
    // sql += ") "
    // sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SALEDT ) "
    // sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT "
    // sql += "UNION ALL "
    // sql += "SELECT SUM(0) CNT1, COUNT(SALEDT) CNT2, SHTPNM, MVDCD, VDSNM, OPENDT, SUM(LASTYEARAMT) LASTYEARAMT, SUM(AMT) AMT FROM ( "
    // sql += "SELECT SHTPNM, MVDCD, VDSNM, SUBSTR(OPENDT, 1, 6) OPENDT, SUBSTR(SALEDT, 1, 6) SALEDT, SUM(0) LASTYEARAMT, SUM(SILAMT) AMT FROM BISL070 "
    // sql += "WHERE 1=1 "
    // sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    // sql += "AND VDCD IN ( "
    // sql += "SELECT VDCD FROM ( "
    // sql += "SELECT VDCD FROM BISL070 "
    // sql += "WHERE COMCD = '"+comcd+"' "
    // sql += "AND SUCD = '"+sucd+"' "
    // sql += "AND " + brcd
    // sql += "AND SUBSTR(SALEDT, 1, 6) = '" + year + month + "' "
    // sql += "GROUP BY VDCD ) "
    // sql += "WHERE VDCD NOT IN ( "
    // sql += "SELECT VDCD FROM BISL070 "
    // sql += "WHERE COMCD = '"+comcd+"' "
    // sql += "AND SUCD = '"+sucd+"' "
    // sql += "AND " + brcd
    // sql += "AND SUBSTR(OPENDT,1,6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    // sql += "AND SUBSTR(SALEDT,1,6) = '" + year + month + "' "
    // sql += "GROUP BY VDCD) "
    // sql += ") "
    // sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SALEDT ) "
    // sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT ) "
    // sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT) "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getOpenCloseStore = (req, res) => {
    console.log("============== getOpenCloseStore Call ======================");
    
    let sucd = req.query.sucd
    let year = req.query.year
    let lastYear = Number(year) - 1
    let month = req.query.month
    let comcd = 1
    
    if (month.toString().length == 1) {
        month = "0" + month
    }
    
    if(sucd == 3) { // SO 사업부만 selectComcd 2
        comcd = 2
    }
    
    if(sucd == 1) { // MI사업부
        brcd = "BRCD = 'MI'"
    } else if(sucd == 12) { // MO사업부
        brcd = "BRCD = 'MI'"
    } else if(sucd == 4) { // IT사업부
        brcd = "BRCD = 'IT'"
    } else if(sucd == 3) { // SO사업부
        brcd = "BRCD = 'SO'"
    } else if(sucd == 21) { // FO사업부
        brcd = "BRCD IN ('MI','IT','SO')"
    }
    
    let sql = "SELECT COUNT(MVDCD) CNT, SUM(MONAMT - LASTYEARMONAMT) MONCHANGE FROM ( "
    sql += "SELECT SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SUM(CNT1) CNT1, SUM(CNT2) CNT2, SUM(LASTYEARAMT) LASTYEARAMT, "
    sql += "CASE WHEN SUM(CNT1) = 0 THEN 0 ELSE ROUND(SUM(LASTYEARAMT)/SUM(CNT1), 0) END LASTYEARMONAMT, "
    sql += "SUM(AMT) AMT, "
    sql += "CASE WHEN SUM(CNT2) = 0 THEN 0 ELSE ROUND(SUM(AMT)/SUM(CNT2), 0) END MONAMT FROM ( "
    sql += "SELECT COUNT(SALEDT) CNT1, SUM(0) CNT2, SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SUM(LASTYEARAMT) LASTYEARAMT, SUM(AMT) AMT FROM ( "
    sql += "SELECT SHTPNM, MVDCD, VDSNM, SUBSTR(OPENDT, 1, 6) OPENDT, SHUTYN, SHTP, SUBSTR(SALEDT, 1, 6) SALEDT, SUM(SILAMT) LASTYEARAMT, SUM(0) AMT FROM BISL070 "
    sql += "WHERE 1=1 "
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SALEDT "
    sql += ") "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP "
    sql += "UNION ALL "
    sql += "SELECT SUM(0) CNT1, COUNT(SALEDT) CNT2, SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SUM(LASTYEARAMT) LASTYEARAMT, SUM(AMT) AMT FROM ( "
    sql += "SELECT SHTPNM, MVDCD, VDSNM, SUBSTR(OPENDT, 1, 6) OPENDT, SHUTYN, SHTP, SUBSTR(SALEDT, 1, 6) SALEDT, SUM(0) LASTYEARAMT, SUM(SILAMT) AMT FROM BISL070 "
    sql += "WHERE 1=1 "
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SALEDT "
    sql += ") "
    sql += "WHERE AMT <> 0 "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP "
    sql += ") "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP "
    sql += ") "
    sql += "WHERE CNT1 = 0 "
    sql += "AND CNT2 <> 0 "
    sql += "UNION ALL "
    sql += "SELECT COUNT(MVDCD) CNT, SUM(MONAMT - LASTYEARMONAMT) MONCHANGE FROM ( "
    sql += "SELECT SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SUM(CNT1) CNT1, SUM(CNT2) CNT2, SUM(LASTYEARAMT) LASTYEARAMT, CASE "
    sql += "WHEN SUM(CNT1) = 0 THEN 0 ELSE ROUND(SUM(LASTYEARAMT)/SUM(CNT1), 0) END LASTYEARMONAMT, "
    sql += "SUM(AMT) AMT, "
    sql += "CASE WHEN SUM(CNT2) = 0 THEN 0 ELSE ROUND(SUM(AMT)/SUM(CNT2), 0) END MONAMT FROM ( "
    sql += "SELECT COUNT(SALEDT) CNT1, SUM(0) CNT2, SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SUM(LASTYEARAMT) LASTYEARAMT, SUM(AMT) AMT FROM ( "
    sql += "SELECT SHTPNM, MVDCD, VDSNM, SUBSTR(OPENDT, 1, 6) OPENDT, SHUTYN, SHTP, SUBSTR(SALEDT, 1, 6) SALEDT, SUM(SILAMT) LASTYEARAMT, SUM(0) AMT FROM BISL070 "
    sql += "WHERE 1=1 "
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SALEDT "
    sql += ") "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP "
    sql += "UNION ALL "
    sql += "SELECT SUM(0) CNT1, COUNT(SALEDT) CNT2, SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SUM(LASTYEARAMT) LASTYEARAMT, SUM(AMT) AMT FROM ( "
    sql += "SELECT SHTPNM, MVDCD, VDSNM, SUBSTR(OPENDT, 1, 6) OPENDT, SHUTYN, SHTP, SUBSTR(SALEDT, 1, 6) SALEDT, SUM(0) LASTYEARAMT, SUM(SILAMT) AMT FROM BISL070 "
    sql += "WHERE 1=1 "
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SALEDT "
    sql += ") "
    sql += "WHERE AMT <> 0 "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP "
    sql += ") "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP "
    sql += ") "
    sql += "WHERE VDSNM LIKE '%철수%' "  
    
    console.log(" getOpenCloseStore >>> ", sql);
    
    // let sql = "SELECT COUNT(VDCD) CNT, "
    // sql += "SUM(SILAMT) SILAMT "
    // sql += "FROM (SELECT VDCD, "
    // sql += "SUM(SILAMT) SILAMT "
    // sql += "FROM BISL070 "
    // sql += "WHERE COMCD = '"+comcd+"' "
    // sql += "AND SUCD = '"+sucd+"' "
    // sql += "AND " + brcd
    // sql += "AND SUBSTR(OPENDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    // sql += "AND SUBSTR(SALEDT, 1, 6) = '" + year + month + "' "
    // sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "GROUP BY VDCD ) "
    // sql += "UNION ALL "
    // sql += "SELECT COUNT(VDCD) CNT, "
    // sql += "SUM(SILAMT) SILAMT "
    // sql += "FROM (SELECT VDCD, "
    // sql += "SUM(SILAMT) SILAMT "
    // sql += "FROM BISL070 "
    // sql += "WHERE COMCD = '"+comcd+"' "
    // sql += "AND SUCD = '"+sucd+"' "
    // sql += "AND " + brcd
    // sql += "AND SUBSTR(SHUTDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    // sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    // sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "GROUP BY VDCD )"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getCuIndexStore = (req, res) => {
    console.log("============== getCuIndexStore Call ======================");
    
    let sucd = req.query.sucd
    let year = req.query.year
    let month = req.query.month
    
    if (month.toString().length == 1) {
        month = "0" + month
    }

    let sql = "SELECT COUNT(*) CNT, SHTPNM, SUM(SILAMT) SILAMT FROM ( "
    sql += "SELECT VDCD, SHTPNM, SUM(SILAMT) SILAMT FROM BISL070 "
    // sql += "WHERE SUBSTR(SALEDT, 1, 6) = '" + year + month + "' "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY VDCD,SHTPNM) "
    sql += "GROUP BY SHTPNM"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getLastIndexStore = (req, res) => {
    console.log("============== getLastIndexStore Call ======================");
    
    let sucd = req.query.sucd
    let year = req.query.year
    let lastYear = Number(year) - 1
    let month = req.query.month
    
    if (month.toString().length == 1) {
        month = "0" + month
    }

    let sql = "SELECT COUNT(*) CNT, SHTPNM, SUM(SILAMT) SILAMT FROM ( "
    sql += "SELECT VDCD, SHTPNM, SUM(SILAMT) SILAMT FROM BISL070 "
    // sql += "WHERE SUBSTR(SALEDT, 1, 6) = '" + lastYear + month + "' "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY VDCD,SHTPNM) "
    sql += "GROUP BY SHTPNM"    

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getMonthAvg = (req, res) => {
    console.log("============== getMonthAvg Call ======================");
    
    let sucd = req.query.sucd
    let year = req.query.year
    let month = req.query.month
    
    if (month.toString().length == 1) {
        month = "0" + month
    }

    let lastYear = Number(year) - 1

    let sql = "SELECT SHTPNM, TO_CHAR(LAST_AVGMON) LY_MONTH_AVG, TO_CHAR(CU_AVGMON) CY_MONTH_AVG, TO_CHAR(CU_AVGMON-LAST_AVGMON) INDE_MONTH_AVG FROM ( "
    sql += "SELECT SHTPNM, SUM(LAST_AVGMON) LAST_AVGMON, SUM(CU_AVGMON) CU_AVGMON FROM ( "
    sql += "SELECT SHTPNM, LAST_AVGMON, 0 CU_AVGMON FROM ( "
    sql += "SELECT SHTPNM, ROUND(SUM(NVL(SILAMT,0))/SUM(NVL(MONCNT,0)), 0) LAST_AVGMON FROM ( "
    sql += "SELECT SHTPNM, COUNT(SALEDT) MONCNT , SALEDT , SUM(SILAMT) SILAMT  FROM( "
    sql += "SELECT SHTPNM, SUBSTR(SALEDT, 1, 6) SALEDT , SUM(SILAMT) SILAMT FROM BISL070 "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SHTPNM, SALEDT ) "
    sql += "GROUP BY SHTPNM, SALEDT "
    sql += ") "
    sql += "GROUP BY SHTPNM "
    sql += ") "
    sql += "UNION ALL "
    sql += "SELECT SHTPNM, 0 LAST_AVGMON, CU_AVGMON FROM ( "
    sql += "SELECT SHTPNM, ROUND(SUM(NVL(SILAMT,0))/SUM(NVL(MONCNT,0)), 0) CU_AVGMON FROM ( "
    sql += "SELECT SHTPNM, COUNT(SALEDT) MONCNT , SALEDT , SUM(SILAMT) SILAMT  FROM( "
    sql += "SELECT SHTPNM, SUBSTR(SALEDT, 1, 6) SALEDT , SUM(SILAMT) SILAMT FROM BISL070 "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SHTPNM, SALEDT ) "
    sql += "GROUP BY SHTPNM, SALEDT "
    sql += ") "
    sql += "GROUP BY SHTPNM "
    sql += ") "
    sql += ") "
    sql += "GROUP BY SHTPNM "
    sql += ") "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};
    
exports.getMonthStoreAvg = (req, res) => {
    console.log("============== getMonthStoreAvg Call ======================");
    
    let sucd = req.query.sucd
    let year = req.query.year
    let month = req.query.month
    
    if (month.toString().length == 1) {
        month = "0" + month
    }

    let lastYear = Number(year) - 1

    let sql = "SELECT SUM(LAST_CNT) LAST_CNT, TO_CHAR(ROUND(SUM(LAST_SILAMT)/SUM(LAST_CNT),0)) LAST_SILAMT, SUM(CU_CNT) CU_CNT, TO_CHAR(ROUND(SUM(CU_SILAMT)/SUM(CU_CNT),0)) CU_SILAMT, SHTPNM FROM ( "
    sql += "SELECT SUM(0) LAST_CNT, SUM(0) LAST_SILAMT, SHTPNM, SUM(CNT) CU_CNT , SUM(NVL(SILAMT, 0)) CU_SILAMT FROM ( "
    sql += "SELECT SUM(0) CNT, SUM(SILAMT) SILAMT, SHTPNM FROM ( "
    sql += "SELECT SUBSTR(SALEDT, 1, 6) SALEDT, SUM(SILAMT) SILAMT, SHTPNM FROM BISL070 "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SALEDT, SHTPNM "
    sql += ") "
    sql += "GROUP BY SALEDT, SHTPNM "
    sql += "UNION ALL "
    sql += "SELECT COUNT(*) CNT, SUM(0) SILAMT, SHTPNM FROM ( "
    sql += "SELECT DISTINCT MVDCD, SHTPNM FROM BISL070 "
    sql += "WHERE 1=1 "
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += ") "
    sql += "GROUP BY SHTPNM "
    sql += ") "
    sql += "GROUP BY SHTPNM "
    sql += "UNION ALL "
    sql += "SELECT SUM(CNT) LAST_CNT, SUM(NVL(SILAMT, 0)) LAST_SILAMT, SHTPNM, SUM(0) CU_CNT, SUM(0) CU_SILAMT FROM ( "
    sql += "SELECT SUM(0) CNT, SUM(SILAMT) SILAMT, SHTPNM FROM ( "
    sql += "SELECT SUBSTR(SALEDT, 1, 6) SALEDT, SUM(SILAMT) SILAMT, SHTPNM FROM BISL070 "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SALEDT, SHTPNM "
    sql += ") "
    sql += "GROUP BY SALEDT, SHTPNM "
    sql += "UNION ALL "
    sql += "SELECT COUNT(*) CNT, SUM(0) SILAMT, SHTPNM FROM ( "
    sql += "SELECT DISTINCT MVDCD, SHTPNM FROM BISL070 "
    sql += "WHERE 1=1 "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    sql += "AND SUCD = '"+sucd+"' "
    sql += ") "
    sql += "GROUP BY SHTPNM "
    sql += ") "
    sql += "GROUP BY SHTPNM " 
    sql += ") "
    sql += "GROUP BY SHTPNM "

    // let sql = "SELECT SHTPNM, SUM(LAST_CNT) LAST_CNT, SUM(CU_CNT) CU_CNT, SUM(LAST_SILAMT) LAST_SILAMT, SUM(CU_SILAMT) CU_SILAMT FROM ( "
    // sql += "SELECT SHTPNM, CNT LAST_CNT, 0 CU_CNT, SILAMT LAST_SILAMT, 0 CU_SILAMT FROM ( "
    // sql += "SELECT SUM(CNT) CNT, SUM(NVL(SILAMT,0)) SILAMT, SHTPNM FROM ( "
    // sql += "SELECT SUM(0) CNT, SUM(SILAMT) SILAMT, SHTPNM FROM ( "
    // sql += "SELECT SUBSTR(SALEDT, 1, 6) SALEDT , SUM(SILAMT) SILAMT, SHTPNM FROM BISL070 "
    // sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    // sql += "AND SUCD = '"+sucd+"' "
    // sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "GROUP BY SALEDT,SHTPNM) "
    // sql += "GROUP BY SALEDT,SHTPNM "
    // sql += "UNION ALL "
    // sql += "SELECT COUNT(*) CNT, SUM(0) SILAMT, SHTPNM FROM ( "
    // sql += "SELECT DISTINCT MVDCD, SHTPNM "
    // sql += "FROM BISL070 "
    // sql += "WHERE 1=1 "
    // sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "AND SUBSTR(SALEDT, 1, 6) = '" + lastYear + month + "' "
    // sql += "AND SUCD = '"+sucd+"') "
    // sql += "GROUP BY SHTPNM "
    // sql += ") "
    // sql += "GROUP BY SHTPNM "
    // sql += ") "
    // sql += "UNION ALL "
    // sql += "SELECT SHTPNM, 0 LAST_CNT, CNT CU_CNT, 0 LAST_SILAMT, SILAMT CU_SILAMT FROM ( "
    // sql += "SELECT SUM(CNT) CNT, SUM(NVL(SILAMT,0)) SILAMT, SHTPNM FROM ( "
    // sql += "SELECT SUM(0) CNT, SUM(SILAMT) SILAMT, SHTPNM FROM ( "
    // sql += "SELECT SUBSTR(SALEDT, 1, 6) SALEDT, SUM(SILAMT) SILAMT, SHTPNM FROM BISL070 "
    // sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    // sql += "AND SUCD = '"+sucd+"' "
    // sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "GROUP BY SALEDT,SHTPNM) "
    // sql += "GROUP BY SALEDT,SHTPNM "
    // sql += "UNION ALL "
    // sql += "SELECT COUNT(*) CNT, SUM(0) SILAMT, SHTPNM FROM ( "
    // sql += "SELECT DISTINCT MVDCD, SHTPNM FROM BISL070 "
    // sql += "WHERE 1=1 "
    // sql += "AND SUBSTR(SALEDT, 1, 6) = '" + year + month + "' "
    // sql += "AND SUCD = '"+sucd+"' "
    // sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "AND SHUTYN = '0') "
    // sql += "GROUP BY SHTPNM "
    // sql += ") "
    // sql += "GROUP BY SHTPNM "
    // sql += ") "
    // sql += ") "
    // sql += "GROUP BY SHTPNM "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getMonthlySalesAverage = (req, res) => {
    console.log("============== getMonthlySalesAverage Call ======================");
    
    let sucd = req.query.sucd
    let year = req.query.year
    let lastYear = Number(year) - 1
    let month = req.query.month
    let type = req.query.type
    
    if (month.toString().length == 1) {
        month = "0" + month
    }

    let sql = "SELECT TO_CHAR(LAST_AVGMON) LAST_AVGMON, TO_CHAR(CU_AVGMON) CU_AVGMON, TO_CHAR(CU_AVGMON-LAST_AVGMON) INDE_MONTH_AVG FROM ( "
    sql += "SELECT SUM(LAST_AVGMON) LAST_AVGMON, SUM(CU_AVGMON) CU_AVGMON FROM ( "
    sql += "SELECT LAST_AVGMON, 0 CU_AVGMON FROM ( "
    sql += "SELECT ROUND(SUM(NVL(SILAMT,0))/SUM(NVL(MONCNT,0)), 0) LAST_AVGMON FROM ( "
    sql += "SELECT COUNT(SALEDT) MONCNT , SALEDT , SUM(SILAMT) SILAMT  FROM( "
    sql += "SELECT SUBSTR(SALEDT, 1, 6) SALEDT , SUM(SILAMT) SILAMT FROM BISL070 "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    sql += "AND SUCD = '" + sucd + "' "
    if(type && type != "" && type != "전체") {
        if(type == "기타") {
            sql += "AND SHTPNM NOT IN('백화점', '몰', '대리점')"
        } else {
            sql += "AND SHTPNM = '" + type + "'"
        }
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SALEDT ) "
    sql += "GROUP BY SALEDT "
    sql += ") "
    sql += ") "
    sql += "UNION ALL "
    sql += "SELECT 0 LAST_AVGMON, CU_AVGMON FROM ( "
    sql += "SELECT ROUND(SUM(NVL(SILAMT,0))/SUM(NVL(MONCNT,0)), 0) CU_AVGMON FROM ( "
    sql += "SELECT COUNT(SALEDT) MONCNT , SALEDT , SUM(SILAMT) SILAMT  FROM( "
    sql += "SELECT SUBSTR(SALEDT, 1, 6) SALEDT , SUM(SILAMT) SILAMT FROM BISL070 "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month + "' "
    sql += "AND SUCD = '" + sucd + "' "
    if(type && type != "" && type != "전체"){
        if(type == "기타") {
            sql += "AND SHTPNM NOT IN('백화점', '몰', '대리점')"
        } else {
            sql += "AND SHTPNM = '" + type + "'"
        }
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SALEDT ) "
    sql += "GROUP BY SALEDT "
    sql += ") "
    sql += ") "
    sql += ") "
    sql += ") "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getStoreSalesAverage = (req, res) => {
    console.log("============== getStoreSalesAverage Call ======================");
    
    let sucd = req.query.sucd
    let year = req.query.year
    let lastYear = Number(year) - 1
    let month = req.query.month
    let type = req.query.type
    
    if (month.toString().length == 1) {
        month = "0" + month
    }

    let sql = "SELECT TO_CHAR(SUM(LAST_AVGVDCD)) LAST_AVGVDCD, TO_CHAR(SUM(CU_AVGVDCD)) CU_AVGVDCD, TO_CHAR(SUM(CU_AVGVDCD) - SUM(LAST_AVGVDCD)) AA FROM ( "
    sql += "SELECT 0 LAST_AVGVDCD, CASE WHEN SILAMT = 0 OR CNT = 0 THEN 0 ELSE ROUND(SILAMT/CNT, 0) END CU_AVGVDCD FROM ( "
    sql += "SELECT SUM(CNT) CNT, SUM(NVL(SILAMT, 0)) SILAMT FROM ( "
    sql += "SELECT SUM(0) CNT, SUM(SILAMT) SILAMT FROM ( "
    sql += "SELECT SUM(SILAMT) SILAMT FROM BISL070 "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01' AND '" + year + month + "' "
    sql += "AND SUCD = '" + sucd + "' "
    if(type && type != "" && type != "전체") {
        if(type == "기타") {
            sql += "AND SHTPNM NOT IN ('백화점', '몰', '대리점') "
        } else {
            sql += "AND SHTPNM = '" + type + "' "
        }
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += ") "
    sql += "UNION ALL "
    sql += "SELECT COUNT(*) CNT, SUM(0) SILAMT FROM ( "
    sql += "SELECT DISTINCT MVDCD "
    sql += "FROM BISL070 "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01' AND '" + year + month + "' "
    sql += "AND SUCD = '" + sucd + "' "
    if(type && type != "" && type != "전체") {
        if(type == "기타") {
            sql += "AND SHTPNM NOT IN ('백화점', '몰', '대리점') "
        } else {
            sql += "AND SHTPNM = '" + type + "' "
        }
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += ") " 
    sql += ") "
    sql += ") "
    sql += "UNION ALL "
    sql += "SELECT CASE WHEN SILAMT = 0 OR CNT = 0 THEN 0 ELSE ROUND(SILAMT/CNT, 0) END LAST_AVGVDCD, 0 CU_AVGVDCD FROM ( "
    sql += "SELECT SUM(CNT) CNT, SUM(NVL(SILAMT, 0)) SILAMT FROM ( "
    sql += "SELECT SUM(0) CNT, SUM(SILAMT) SILAMT FROM ( "
    sql += "SELECT SUM(SILAMT) SILAMT FROM BISL070 "
    sql += "WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01' AND '" + lastYear + month + "' "
    sql += "AND SUCD = '" + sucd + "' "
    if(type && type != "" && type != "전체") {
        if(type == "기타") {
            sql += "AND SHTPNM NOT IN ('백화점', '몰', '대리점') "
        } else {
            sql += "AND SHTPNM = '" + type + "' "
        }
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += ") "
    sql += "UNION ALL "
    sql += "SELECT COUNT(*) CNT, SUM(0) SILAMT FROM ( "
    sql += "SELECT DISTINCT MVDCD FROM BISL070 "
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "AND SUCD = '" + sucd + "' "
    if(type && type != "" && type != "전체") {
        if(type == "기타") {
            sql += "AND SHTPNM NOT IN ('백화점', '몰', '대리점') "
        } else {
            sql += "AND SHTPNM = '" + type + "' "
        }
    }
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01' AND '" + lastYear + month + "' "
    sql += ") " 
    sql += ") " 
    sql += ") "
    sql += ") "

    // let sql = ""
    // sql += "SELECT TO_CHAR(SUM(LAST_AVGVDCD)) LAST_AVGVDCD, TO_CHAR(SUM(CU_AVGVDCD)) CU_AVGVDCD, TO_CHAR(SUM(CU_AVGVDCD) - SUM(LAST_AVGVDCD)) AA "
    // sql += "FROM ( "
    // sql += "SELECT 0 LAST_AVGVDCD,  "
    // sql += "       CASE WHEN SILAMT = 0 OR CNT = 0 THEN 0 "
    // sql += "  	   ELSE  "
    // sql += "       ROUND(SILAMT/CNT,0) "
    // sql += "       END CU_AVGVDCD  "
    // sql += "FROM( "
    // sql += "SELECT SUM(CNT) CNT , "
    // sql += "       SUM(NOWMON) NOWMON , "
    // sql += "       SUM(NVL(SILAMT,0)) SILAMT "
    // sql += "  FROM (SELECT SUM(0) CNT , "
    // sql += "               SUM(SILAMT) SILAMT , "
    // sql += "               CASE "
    // sql += "                   WHEN SALEDT='" + year + month + "' THEN SUM(SILAMT) "
    // sql += "                   ELSE 0 "
    // sql += "               END NOWMON "
    // sql += "          FROM(SELECT SUBSTR(SALEDT, 1, 6) SALEDT , "
    // sql += "                       SUM(SILAMT) SILAMT "
    // sql += "                  FROM BISL070 "
    // sql += "                 WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01' AND '" + year + month + "' "
    // sql += "                   AND SUCD = '" + sucd + "' "
    // if(type && type != "" && type != "전체"){
    //     if(type == "기타"){
    //         sql += "                           AND SHTPNM NOT IN('백화점', '몰', '대리점')"
    //     }else{
    //         sql += "                           AND SHTPNM = '" + type + "'"
    //     }
    // }
    // sql += "                   AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "                 GROUP BY SALEDT) "
    // sql += "         GROUP BY SALEDT  "
    // sql += "         UNION ALL "
    // sql += "         SELECT COUNT(*) CNT , "
    // sql += "               SUM(0) SILAMT , "
    // sql += "               SUM(0) NOWMON "
    // sql += "          FROM (SELECT DISTINCT MVDCD "
    // sql += "                  FROM BISL070 "
    // sql += "                 WHERE 1=1 "
    // sql += "                   AND SUBSTR(SALEDT, 1, 6) = '" + year + month + "'"
    // sql += "                   AND SUCD = '" + sucd + "' "
    // if(type && type != "" && type != "전체"){
    //     if(type == "기타"){
    //         sql += "                           AND SHTPNM NOT IN('백화점', '몰', '대리점')"
    //     }else{
    //         sql += "                           AND SHTPNM = '" + type + "'"
    //     }
    // }
    // sql += "                   AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "                   AND SHUTYN = '0' ) )  "
    // sql += ")      "
    // sql += "UNION ALL "
    // sql += "SELECT CASE WHEN SILAMT = 0 OR CNT = 0 THEN 0 "
    // sql += "  	   ELSE  "
    // sql += "       ROUND(SILAMT/CNT,0) "
    // sql += "       END LAST_AVGVDCD,  "
    // sql += "       0 CU_AVGVDCD "
    // sql += "FROM( "
    // sql += "SELECT SUM(CNT) CNT , "
    // sql += "       SUM(NOWMON) NOWMON , "
    // sql += "       SUM(NVL(SILAMT,0)) SILAMT "
    // sql += "  FROM (SELECT SUM(0) CNT , "
    // sql += "               SUM(SILAMT) SILAMT , "
    // sql += "               CASE "
    // sql += "                   WHEN SALEDT='" + lastYear + month + "' THEN SUM(SILAMT) "
    // sql += "                   ELSE 0 "
    // sql += "               END NOWMON "
    // sql += "          FROM(SELECT SUBSTR(SALEDT, 1, 6) SALEDT , "
    // sql += "                       SUM(SILAMT) SILAMT "
    // sql += "                  FROM BISL070 "
    // sql += "                 WHERE SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01' AND '" + lastYear + month + "' "
    // sql += "                   AND SUCD = '" + sucd + "' "
    // if(type && type != "" && type != "전체"){
    //     if(type == "기타"){
    //         sql += "                           AND SHTPNM NOT IN('백화점', '몰', '대리점')"
    //     }else{
    //         sql += "                           AND SHTPNM = '" + type + "'"
    //     }
    // }
    // sql += "                   AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "                 GROUP BY SALEDT) "
    // sql += "         GROUP BY SALEDT  "
    // sql += "         UNION ALL "
    // sql += "         SELECT COUNT(*) CNT , "
    // sql += "               SUM(0) SILAMT , "
    // sql += "               SUM(0) NOWMON "
    // sql += "          FROM (SELECT DISTINCT MVDCD "
    // sql += "                  FROM BISL070 "
    // sql += "                 WHERE 1=1 "
    // sql += "                   AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "                   AND SUBSTR(SALEDT, 1, 6) = '" + lastYear + month + "' "
    // if(type && type != "" && type != "전체"){
    //     if(type == "기타"){
    //         sql += "                           AND SHTPNM NOT IN('백화점', '몰', '대리점')"
    //     }else{
    //         sql += "                           AND SHTPNM = '" + type + "'"
    //     }
    // }
    // sql += "                   AND SUCD = '" + sucd + "') )  "
    // sql += "    )   "
    // sql += ") "    

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSalesTotal = (req, res) => {
    console.log("============== getSalesTotal Call ======================");
    
    let year = req.query.year
    let month = req.query.month
    
    if (month.toString().length == 1) {
        month = "0" + month
    }
    let jyear = Number(year-1).toString()
    let sql = "SELECT SUM(NVL(SILAMT, 0)) SILAMT,  "
    sql += "       SUM(NVL(J_SILAMT, 0)) JSILAMT, "
    sql += "       SUCD, DECODE(SUCD,'1',1,'4',2,'3',3,'12',4,'21',5) AS SORT "
    sql += "FROM ( "
    sql += "        SELECT SUBSTR(SALEDT, 1, 6) SALEDT, "
    sql += "               SUM(SILAMT) SILAMT, "
    sql += "               SUM(0) J_SILAMT, "
    sql += "               SUCD "
    sql += "        FROM   BISL070 "
    sql += "        WHERE  SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01' AND '" + year + month + "' "
    sql += "        AND    SUCD IN ('1', '12', '4', '3', '21', '5') "
    sql += "        AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "        GROUP BY SALEDT, SUCD "
    sql += "        UNION ALL "
    sql += "        SELECT SUBSTR(SALEDT, 1, 6) SALEDT, "
    sql += "               SUM(0) SILAMT, "
    sql += "               SUM(SILAMT) J_SILAMT, "
    sql += "               SUCD "
    sql += "        FROM   BISL070 "
    sql += "        WHERE  SUBSTR(SALEDT, 1, 6) BETWEEN '" + jyear + "01' AND '" + jyear + month + "' "
    sql += "        AND    SUCD IN ('1', '12', '4', '3', '21', '5') "
    sql += "        AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "        GROUP BY SALEDT, SUCD "
    sql += "     )  "
    sql += "GROUP BY SUCD, SORT "
    sql += "ORDER BY SORT "
    
    console.log("getSalesTotal >>> ", sql);

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};
