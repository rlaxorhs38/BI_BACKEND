var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getSaleListByBrand = (req, res) => {
    console.log("============== getSaleListByBrand Call ======================");

    let yyyy = req.query.yyyy;
    let mm = req.query.mm;
    let week = req.query.week;

    let sql = "SELECT   COMCD, SUCD, ";
    sql += "            DECODE(SUCD, '1', 'MI', '12', 'MO', '21', 'FO', '4', 'IT', '3', 'SO', '5', 'SO') AS BRCD,  ";
    sql += "            YYYY, MM, WEEK, FROM_SALEDT, TO_SALEDT, SALEGU, ";
    sql += "            MONPLNAMT, MONAMT, PLNRATE, WEEKPLNAMT, WEEKAMT, MONRATE, WEEKRATE, PREMONAMT, PREWEEKAMT, MONAVERAGE, WEEKAVERAGE, NEXTWEEKPLNAMT, MONSUMPLNAMT, ";
    sql += "            DECODE(SUCD, '1', '1', '12', '2', '21', '3', '4', '4', '3', '5', '5', '5') AS SORT ";
    sql += "FROM BIWE050 ";
    sql += "WHERE TEMP_SAVE = '3' ";
    sql += "AND   YYYY = '" + yyyy + "' ";
    sql += "AND   MM   = '" + mm + "' ";
    sql += "AND   WEEK = '" + week + "' ";
    sql += "AND   SNO IN (SELECT MAX(SNO) FROM BIWE050 ";
    sql += "            WHERE YYYY = '" + yyyy + "' ";
    sql += "            AND MM = '" + mm + "' ";
    sql += "            AND WEEK = '" + week + "' ";
    sql += "            GROUP BY COMCD, SUCD, BRCD, SALEGU) ";
    sql += "ORDER BY SORT, SALEGU ";

    console.log("getSaleListByBrand >>>", sql);

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getProgressData = (req, res) => {
    console.log("============== getProgressData Call ======================");

    let yyyy = req.query.yyyy;
    let mm = req.query.mm;
    let week = req.query.week;

    let sql = "SELECT "
    sql += "        CASE " 
    sql += "            WHEN COMCD = '3' THEN '2' "
    sql += "            ELSE COMCD "
    sql += "        END COMCD, "
    sql += "        CASE  "
    sql += "            WHEN SUCD = '5' THEN '3' "
    sql += "            ELSE SUCD "
    sql += "        END SUCD,  ";
    sql += "        DECODE(SUCD, '1', 'MI', '12', 'MO', '21', 'FO', '4', 'IT', '3', 'SO', '5', 'SO') AS BRCD,  ";
    sql += "        YYYY, MM, WEEK, FROM_SALEDT, TO_SALEDT, PROGRESS, PLAN, TEMP_SAVE, ";
    sql += "        DECODE(SUCD, '1', '1', '12', '2', '21', '3', '4', '4', '3', '5', '5', '5') AS SORT ";
    sql += "FROM BIWE051 ";
    sql += "WHERE TEMP_SAVE = '3' ";
    sql += "AND SNO IN (SELECT MAX(SNO) FROM BIWE051 ";
    sql += "            WHERE YYYY = '" + yyyy + "' ";
    sql += "            AND MM = '" + mm + "' ";
    sql += "            AND WEEK = '" + week + "' ";
    sql += "            GROUP BY COMCD, SUCD, BRCD) ";
    sql += "ORDER BY SORT ";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getTakeChargeList = (req, res) => {
    console.log("============== getTakeChargeList Call ======================");

    let yyyy = req.query.yyyy;
    let mm = req.query.mm;
    let week = req.query.week;

    let sql = "SELECT DISTINCT(MEMP) AS MEMP, ERPNM,   ";
        sql += "        CASE " 
        sql += "            WHEN COMCD = '3' THEN '2' "
        sql += "            ELSE COMCD "
        sql += "        END COMCD, "
        sql += "        CASE  "
        sql += "            WHEN SUCD = '5' THEN '3' "
        sql += "            ELSE SUCD "
        sql += "        END SUCD,  ";
        sql += "    DECODE(SUCD, '1', '1', '12', '2', '21', '3', '4', '4', '3', '5', '5', '5') AS SORT,  ";
        sql += "    DECODE(SUCD, '1', 'MI', '12', 'MO', '21', 'FO', '4', 'IT', '3', 'SO', '5', 'SO') AS BRCD  ";
        sql += "FROM BIWE060 A  ";
        sql += "WHERE YYYY = '" + yyyy + "'  ";
        sql += "AND MM = '" + mm + "'  ";
        sql += "AND WEEK = '" + week + "'  ";
        sql += "AND A.TEMP_SAVE IN (  ";
        sql += "                    SELECT MAX(B.TEMP_SAVE)  ";
        sql += "                    FROM BIWE060 B  ";
        sql += "                    WHERE YYYY = '" + yyyy + "'  ";
        sql += "                    AND MM = '" + mm + "'  ";
        sql += "                    AND WEEK = '" + week + "'  ";
        sql += "                    AND B.TEMP_SAVE > '2000'  ";
        sql += "                    )  ";
        sql += "ORDER BY SORT,MEMP  ";

    console.log("getTakeChargeList >>>", sql);

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStoreSaleByCharge = (req, res) => {
    console.log("============== getStoreSaleByCharge Call ======================");

    let yyyy = req.query.yyyy;
    let mm = req.query.mm;
    let week = req.query.week;
    
    let sql = "SELECT *  ";
    sql += "FROM   (SELECT  ";
    sql += "            CASE " 
    sql += "                WHEN COMCD = '3' THEN '2' "
    sql += "                ELSE COMCD "
    sql += "            END COMCD, "
    sql += "            CASE  "
    sql += "                WHEN SUCD = '5' THEN '3' "
    sql += "                ELSE SUCD "
    sql += "            END SUCD,  ";
    sql += "            DECODE(SUCD, '1', '1', '12', '2', '21', '3', '4', '4', '3', '5', '5', '5') AS SORT,  ";
    sql += "            DECODE(SUCD, '1', 'MI', '12', 'MO', '21', 'FO', '4', 'IT', '3', 'SO', '5', 'SO') AS BRCD,  ";
    sql += "            YYYY,  ";
    sql += "            MM,  ";
    sql += "            WEEK,  ";
    sql += "            FROM_SALEDT,  ";
    sql += "            TO_SALEDT,  ";
    sql += "            MEMP,  ";
    sql += "            ERPNM,  ";
    sql += "            CASE  ";
    sql += "                WHEN COMCD = '3' THEN 'Z'||MVDCD  ";
    sql += "                ELSE MVDCD  ";
    sql += "            END MVDCD,  ";
    // sql += "            MVDCD,  ";
    sql += "            VDCD,  ";
    sql += "            VDSNM,  ";
    sql += "            BIRTH,  ";
    sql += "            HNAME,  ";
    sql += "            PLNAMT,  ";
    sql += "            NOWAMT,  ";
    sql += "            LASTAMT,  ";
    sql += "            WEEKRATE,  ";
    sql += "            MONSUMAMT,  ";
    sql += "            LASTMONSUMAMT,  ";
    sql += "            ENDMONAMT,  ";
    sql += "            MONRATE,  ";
    sql += "            MONSUMPLNAMT,  ";
    sql += "            MONAVG,  ";
    sql += "            MS,  ";
    sql += "            TEMP_SAVE  ";
    sql += "        FROM   BIWE060 A  ";
    sql += "        WHERE  YYYY = '" + yyyy + "'  ";
    sql += "        AND    MM = '" + mm + "'  ";
    sql += "        AND    WEEK = '" + week + "'  ";
    sql += "        AND    A.TEMP_SAVE IN (  ";
    sql += "                                SELECT MAX(B.TEMP_SAVE)  ";
    sql += "                                FROM BIWE060 B  ";
    sql += "                                WHERE YYYY = '" + yyyy + "'  ";
    sql += "                                AND MM = '" + mm + "'  ";
    sql += "                                AND WEEK = '" + week + "'  ";
    sql += "                                AND B.TEMP_SAVE > '2000'  ";
    sql += "                                )  ";
    sql += "        UNION ALL  ";
    sql += "        SELECT  ";
    sql += "            CASE " 
    sql += "                WHEN COMCD = '3' THEN '2' "
    sql += "                ELSE COMCD "
    sql += "            END COMCD, "
    sql += "            CASE  "
    sql += "                WHEN SUCD = '5' THEN '3' "
    sql += "                ELSE SUCD "
    sql += "            END SUCD,  ";
    sql += "            DECODE(SUCD, '1', '1', '12', '2', '21', '3', '4', '4', '3', '5', '5', '5') AS SORT,  ";
    sql += "            DECODE(SUCD, '1', 'MI', '12', 'MO', '21', 'FO', '4', 'IT', '3', 'SO', '5', 'SO') AS BRCD,  ";
    sql += "            YYYY,  ";
    sql += "            MM,  ";
    sql += "            WEEK,  ";
    sql += "            FROM_SALEDT,  ";
    sql += "            TO_SALEDT,  ";
    sql += "            MEMP,  ";
    sql += "            ERPNM,  ";
    sql += "            'ZZ000' AS VDCD,  ";
    sql += "            'ZZ000' AS MVDCD,  ";
    sql += "            '' VDSNM,  ";
    sql += "            '' BIRTH,  ";
    sql += "            '' HNAME,  ";
    sql += "            SUM(PLNAMT) PLNAMT,  ";
    sql += "            SUM(NOWAMT) NOWAMT,  ";
    sql += "            SUM(LASTAMT) LASTAMT,  ";
    sql += "            CASE  ";
    sql += "                WHEN (SUM(NOWAMT) = 0 OR SUM(NOWAMT) IS NULL OR SUM(NOWAMT) = '') AND (SUM(LASTAMT) = 0 OR SUM(LASTAMT) IS NULL OR SUM(LASTAMT) = '') THEN ''  ";
    sql += "                WHEN SUM(NOWAMT) = 0 OR SUM(NOWAMT) IS NULL OR SUM(NOWAMT) = '' THEN '-100'  ";
    sql += "                WHEN SUM(LASTAMT) = 0 OR SUM(LASTAMT) IS NULL OR SUM(LASTAMT) = '' THEN ''  ";
    sql += "                ELSE TO_CHAR(ROUND((SUM(NOWAMT)/SUM(LASTAMT)-1),2)*100)  ";
    sql += "            END WEEKRATE,  ";
    sql += "            SUM(MONSUMAMT) MONSUMAMT,  ";
    sql += "            SUM(LASTMONSUMAMT) LASTMONSUMAMT,  ";
    sql += "            SUM(ENDMONAMT) ENDMONAMT,  ";
    sql += "            CASE  ";
    sql += "                WHEN (SUM(MONSUMAMT) = 0 OR SUM(MONSUMAMT) IS NULL OR SUM(MONSUMAMT) = '') AND (SUM(LASTMONSUMAMT) = 0 OR SUM(LASTMONSUMAMT) IS NULL OR SUM(LASTMONSUMAMT) = '') THEN ''  ";
    sql += "                WHEN SUM(MONSUMAMT) = 0 OR SUM(MONSUMAMT) IS NULL OR SUM(MONSUMAMT) = '' THEN '-100'  ";
    sql += "                WHEN SUM(LASTMONSUMAMT) = 0 OR SUM(LASTMONSUMAMT) IS NULL OR SUM(LASTMONSUMAMT) = '' THEN ''  ";
    sql += "                ELSE TO_CHAR(ROUND((SUM(MONSUMAMT)/SUM(LASTMONSUMAMT)-1),2)*100)  ";
    sql += "            END MONRATE,  ";       
    sql += "            '' MONSUMPLNAMT,  ";
    sql += "            CASE  ";
    sql += "                WHEN SUM(MONSUMAMT) = 0 OR SUM(MONSUMAMT) IS NULL OR SUM(MONSUMAMT) = '' THEN ''  ";
    sql += "                WHEN SUM(PLNAMT) = 0 OR SUM(PLNAMT) IS NULL OR SUM(PLNAMT) = '' THEN ''  ";
    sql += "                ELSE TO_CHAR(ROUND(SUM(MONSUMAMT)/SUM(PLNAMT),2)*100)  ";
    sql += "            END MONAVG,  ";
    sql += "            '' MS,  ";
    sql += "            '' TEMP_SAVE  ";
    sql += "        FROM   BIWE060 A  ";
    sql += "        WHERE  YYYY = '" + yyyy + "'  ";
    sql += "        AND    MM = '" + mm + "'  ";
    sql += "        AND    WEEK = '" + week + "'  ";
    sql += "        AND    A.TEMP_SAVE IN (  ";
    sql += "                                SELECT MAX(B.TEMP_SAVE)  ";
    sql += "                                FROM BIWE060 B  ";
    sql += "                                WHERE YYYY = '" + yyyy + "'  ";
    sql += "                                AND MM = '" + mm + "'  ";
    sql += "                                AND WEEK = '" + week + "'  ";
    sql += "                                AND B.TEMP_SAVE > '2000'  ";
    sql += "                                )  ";
    sql += "        GROUP BY COMCD, SUCD, SORT, BRCD, YYYY, MM, WEEK, FROM_SALEDT, TO_SALEDT, MEMP, ERPNM )  ";
    sql += "ORDER BY SORT, MEMP, MVDCD, VDCD  ";

    console.log("getStoreSaleByCharge >>>", sql);

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};