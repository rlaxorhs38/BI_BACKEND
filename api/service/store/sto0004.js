var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res, next) => {
    console.log("============== getMakeDataDate Call ======================");

    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BISL070";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getMonthlySalesStatus = (req, res) => {
    console.log("============== getMonthlySalesStatus Call ======================");
    
    let sucd = req.query.sucd;
    let year = req.query.year;
    let month = req.query.month;

    if (month.toString().length == 1) {
        month = "0" + month
    }

    let lastYear = Number(year) - 1

    let sql = "SELECT SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, CNT1, CNT2, LASTYEARAMT, LASTYEARMONAMT, AMT, MONAMT, MONAMT - LASTYEARMONAMT MONCHANGE, "
    sql += "CASE WHEN LASTYEARMONAMT = 0 THEN 0 ELSE ROUND((MONAMT - LASTYEARMONAMT)/LASTYEARMONAMT*100, 2) END MONCHANGERR FROM ( "
    sql += "SELECT SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SUM(CNT1) CNT1, SUM(CNT2) CNT2, SUM(LASTYEARAMT) LASTYEARAMT, "
    sql += "CASE WHEN SUM(CNT1) = 0 THEN 0 ELSE ROUND(SUM(LASTYEARAMT)/SUM(CNT1), 0) END LASTYEARMONAMT, "
    sql += "SUM(AMT) AMT, "
    sql += "CASE WHEN SUM(CNT2) = 0 THEN 0 ELSE ROUND(SUM(AMT)/SUM(CNT2), 0) END MONAMT FROM ( "
	sql += "SELECT COUNT(SALEDT) CNT1, SUM(0) CNT2, SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SUM(LASTYEARAMT) LASTYEARAMT, SUM(AMT) AMT FROM ( "
    sql += "SELECT SHTPNM, MVDCD, VDSNM, SUBSTR(OPENDT, 1, 6) OPENDT, SHUTYN, SHTP, SUBSTR(SALEDT, 1, 6) SALEDT, SUM(SILAMT) LASTYEARAMT, SUM(0) AMT FROM BISL070 "
    sql += "WHERE 1=1 "
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + lastYear + "01" + "' AND '" + lastYear + month + "' "
    sql += "AND SUCD='" + sucd + "'"
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SALEDT "
	sql += ") "
	sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP "
	sql += "UNION ALL "
	sql += "SELECT SUM(0) CNT1, COUNT(SALEDT) CNT2, SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SUM(LASTYEARAMT) LASTYEARAMT, SUM(AMT) AMT FROM ( "
    sql += "SELECT SHTPNM, MVDCD, VDSNM, SUBSTR(OPENDT, 1, 6) OPENDT, SHUTYN, SHTP, SUBSTR(SALEDT, 1, 6) SALEDT, SUM(0) LASTYEARAMT, SUM(SILAMT) AMT FROM BISL070 "
    sql += "WHERE 1=1 "
    sql += "AND SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01" + "' AND '" + year + month  + "' "
    sql += "AND SUCD='" + sucd + "'"
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP, SALEDT "
	sql += ") "
	sql += "WHERE AMT <> 0 "
	sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP "
    sql += ") "
    sql += "GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHTP "
    sql += ") "
    sql += "ORDER BY SHTP, MVDCD"


    // let sql = "SELECT SHTPNM,"
    // sql += "       MVDCD,"
    // sql += "       VDSNM,"
    // sql += "       OPENDT,"
    // sql += "       SHUTYN,"
    // sql += "       SHUTDT,"
    // sql += "       SUM(LASTYEARAMT) LASTYEARAMT,"
    // sql += "       TO_CHAR(SUM(ROUND(LASTYEARAMT/CNT1, 0))) LASTYEARMONAMT,"
    // sql += "       SUM(AMT) AMT,"
    // sql += "       TO_CHAR(SUM(ROUND(AMT/CNT2, 0))) MONAMT,"
    // sql += "       TO_CHAR(SUM(ROUND(AMT/CNT2, 0)) - SUM(ROUND(LASTYEARAMT/CNT1, 0))) MONCHANGE,"
    // sql += "       CASE WHEN SUM(ROUND(AMT/CNT2, 0)) - SUM(ROUND(LASTYEARAMT/CNT1, 0)) = 0 OR SUM(ROUND(LASTYEARAMT/CNT1, 0)) = 0 THEN 0"
    // sql += "       ELSE ROUND((SUM(ROUND(AMT/CNT2, 0)) - SUM(ROUND(LASTYEARAMT/CNT1, 0)))/SUM(ROUND(LASTYEARAMT/CNT1, 0))*100,2) END MONCHANGERR"
    // // sql += "       ROUND((SUM(ROUND(AMT/CNT2, 0)) - SUM(ROUND(LASTYEARAMT/CNT1, 0)))/SUM(ROUND(LASTYEARAMT/CNT1, 0))*100,2) MONCHANGERR"
    // sql += "  FROM (SELECT COUNT(SALEDT) CNT1,"
    // sql += "		       COUNT(0) CNT2,"
    // sql += "               SHTPNM,"
    // sql += "               MVDCD,"
    // sql += "               VDSNM,"
    // sql += "               OPENDT,"
    // sql += "               SHUTYN,"
    // sql += "               SHUTDT,"
    // sql += "               SUM(LASTYEARAMT) LASTYEARAMT,"
    // sql += "               SUM(AMT) AMT"
    // sql += "          FROM (SELECT SHTPNM,"
    // sql += "                       MVDCD,"
    // sql += "                       VDSNM,"
    // sql += "                       SUBSTR(OPENDT, 1, 6) OPENDT,"
    // sql += "                       SHUTYN,"
    // sql += "                       SUBSTR(SHUTDT, 1, 6) SHUTDT,"
    // sql += "                       SUBSTR(SALEDT, 1, 6) SALEDT,"
    // sql += "                       SUM(SILAMT) LASTYEARAMT,"
    // sql += "                       SUM(0) AMT"
    // sql += "                  FROM BISL070"
    // sql += "                  WHERE 1=1 AND SUCD='" + sucd + "'"
    // sql += "                  AND SALEDT BETWEEN '" + lastYear + "0101" + "' AND '" + lastYear + "1231" +"'"
    // sql += "                  AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "                  GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHUTDT, SALEDT )"
    // sql += "         GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHUTDT "
    // sql += "         UNION ALL"
    // sql += "         SELECT COUNT(0) CNT1,"
    // sql += "               COUNT(SALEDT) CNT2,"
    // sql += "               SHTPNM,"
    // sql += "               MVDCD,"
    // sql += "               VDSNM,"
    // sql += "               OPENDT,"
    // sql += "               SHUTYN,"
    // sql += "               SHUTDT,"
    // sql += "               SUM(LASTYEARAMT) LASTYEARAMT,"
    // sql += "               SUM(AMT) AMT"
    // sql += "          FROM (SELECT SHTPNM,"
    // sql += "                       MVDCD,"
    // sql += "                       VDSNM,"
    // sql += "                       SUBSTR(OPENDT, 1, 6) OPENDT,"
    // sql += "                       SHUTYN,"
    // sql += "                       SUBSTR(SHUTDT, 1, 6) SHUTDT,"
    // sql += "                       SUBSTR(SALEDT, 1, 6) SALEDT,"
    // sql += "                       SUM(0) LASTYEARAMT,"
    // sql += "                       SUM(SILAMT) AMT"
    // sql += "                  FROM BISL070"
    // sql += "                  WHERE 1=1 AND SUCD='" + sucd + "' "
    // sql += "                  AND SALEDT BETWEEN '" + year + "0101" + "' AND '" + year + month + "31" +"'"
    // sql += "                  AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL070) "
    // sql += "                  GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHUTDT, SALEDT )"
    // sql += "         GROUP BY SHTPNM, MVDCD, VDSNM, OPENDT, SHUTYN, SHUTDT )"
    // sql += "		 GROUP BY SHTPNM,"
    // sql += "				  MVDCD,"
    // sql += "				  VDSNM,"
    // sql += "				  OPENDT,"
    // sql += "				  SHUTYN,"
    // sql += "				  SHUTDT"	
    // sql += "	     ORDER BY SHTPNM, MVDCD"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSHTPNMList = (req, res) => {
    console.log("============== getSHTPNMList Call ======================");

    let sql = "SELECT SHTPNM FROM BISL070 "
    sql += "GROUP BY SHTPNM "
    sql += "ORDER BY SHTPNM"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};