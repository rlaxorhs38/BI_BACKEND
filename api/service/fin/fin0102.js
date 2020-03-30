var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

// 당일 매출 순위
exports.getsalesRanking = (req, res) => {
    console.log("============== getsalesRanking Call ======================");

    let orderType = req.query.orderType.toUpperCase();
    let searchType = req.query.searchType.toString();
    let tabType = req.query.tabType;
    let code = req.query.code;
    let date = req.query.date;

    let year = date.substr(0, 4);
    let month = date.substr(5, 2);

    // 매출 추이 누적
    let sql = "SELECT ROWNUM() RN, VDCD, VDSNM, "
    sql += "        SALE_TOT, PRE_SALE_TOT, QTY_TOT, "
    sql += "        TARGETAMT, GROWTH_RATE, "
    sql += "        ACHIEVEMENT_RATE, MEMPNM "
    sql += "FROM   (SELECT VDCD, VDSNM, "
    sql += "            SUM(SALE_TOT) AS SALE_TOT, SUM(PRE_SALE_TOT) AS PRE_SALE_TOT, "
    sql += "            SUM(QTY_TOT) AS QTY_TOT, SUM(TARGETAMT) AS TARGETAMT, "
    sql += "            CASE WHEN SUM(PRE_SALE_TOT) = 0 THEN 0 "
    sql += "                    ELSE ROUND(SUM(SALE_TOT)/SUM(PRE_SALE_TOT)*100, 0) "
    sql += "            END AS GROWTH_RATE, "
    sql += "            CASE WHEN SUM(TARGETAMT) = 0 THEN 0 "
    sql += "                    ELSE ROUND(SUM(SALE_TOT)/SUM(TARGETAMT)*100, 0) "
    sql += "            END AS ACHIEVEMENT_RATE, "
    sql += "            MAX(MEMPNM) AS MEMPNM "
    sql += "        FROM   (SELECT VDCD, VDSNM, "
    sql += "                    SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS SALE_TOT, 0 AS PRE_SALE_TOT, "
    sql += "                    SUM(JQTY+DCQTY+GQTY) AS QTY_TOT, SUM(TARGETAMT) AS TARGETAMT, "
    sql += "                    MAX(MEMPNM) AS MEMPNM "
    sql += "                FROM   BISL060 "
    if(searchType == "2") {
        sql += "                WHERE  SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + month + "' AND '" + year + month + "' "
    } else {
        sql += "                WHERE  SUBSTR(SALEDT, 1, 6) BETWEEN '" + year + "01' AND '" + year + month + "' "
    }
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) "
    sql += "                GROUP BY VDCD, VDSNM, SUCD "
    if(code == "A") {
        sql += "                HAVING " + tabType + " IN ('1', '12', '23', '4', '3') "
    } else {
        sql += "                HAVING " + tabType + " = '" + code + "' "
    }
    sql += "                UNION ALL "
    sql += "                SELECT VDCD, VDSNM, 0 AS SALE_TOT,  "
    sql += "                    SUM(JAMT+DCAMT+GAMT+ADVDEPAMT) AS PRE_SALE_TOT, "
    sql += "                    0 AS QTY_TOT, 0 AS TARGETAMT, '' AS MEMPNM "
    sql += "                FROM   BISL060 "
    if(searchType == "2") {
        sql += "                WHERE  SUBSTR(SALEDT, 1, 6) BETWEEN '" + (Number(year)-1).toString() + month + "' AND '" + (Number(year)-1).toString() + month + "' "
    } else {
        sql += "                WHERE  SUBSTR(SALEDT, 1, 6) BETWEEN '" + (Number(year)-1).toString() + "01' AND '" + (Number(year)-1).toString() + month + "' "
    }
    sql += "                AND    CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISL060) "
    sql += "                GROUP BY VDCD, VDSNM, SUCD "
    if(code == "A") {
        sql += "                HAVING " + tabType + " IN ('1', '12', '23', '4', '3') ) "
    } else {
        sql += "                HAVING " + tabType + " = '" + code + "' ) "
    }
    sql += "        GROUP BY VDCD, VDSNM "
    sql += "        ORDER BY SALE_TOT " + orderType + " ) "
    sql += "WHERE  SALE_TOT > 0 "

    console.log(sql)

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};
