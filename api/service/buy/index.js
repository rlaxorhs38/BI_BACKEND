var axios = require('axios');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res) => {
    console.log("============== getMakeDataDate Call ======================");

    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BIPU012";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getBuyData = (req, res) => {
    console.log("============== getBuyData Call ======================");

    let choice = req.query.choice;
    let tabType = req.query.tabType;
    let CODETab = req.query.CODETab;
    let yearCode = req.query.yearCode;

    let sql = "SELECT DECODE(MAX(SUBSTR(B.SEASON,2,2)),'01','SPRING','02','SUMMER','03','FALL','04','WINTER') AS 'MONTH' ";
    sql += ",B.SEASON ";
    sql += ",MAX(B.YSAMT) AS YSAMT ";
    sql += ",MAX(1) AS SEQ "; /*수량*/
    sql += ",SUM(A.ORQTY) AS ORQTY ";
    sql += ",SUM(A.ORAMT) AS ORAMT ";
    sql += ",CASE WHEN MAX(B.YSAMT) = 0 THEN 0 ELSE ROUND(SUM(A.ORAMT) / MAX(B.YSAMT) * 100,1) END AS ORRATE ";
    sql += ",SUM(A.INQTY) AS INQTY ";
    sql += ",SUM(A.INAMT) AS INAMT ";
    sql += ",CASE WHEN MAX(B.YSAMT) = 0 THEN 0 ELSE ROUND(SUM(A.INAMT) / MAX(B.YSAMT) * 100,1) END AS INRATE ";
    sql += ",SUM(A.OUTQTY) AS OUTQTY ";
    sql += ",SUM(A.OUTAMT) AS OUTAMT ";
    sql += ",CASE WHEN SUM(A.INQTY) = 0 THEN 0 ELSE ROUND(SUM(A.OUTQTY) / SUM(A.INQTY) * 100,1) END AS OUTQTYRATE ";
    sql += ",CASE WHEN SUM(A.INAMT) = 0 THEN 0 ELSE ROUND(SUM(A.OUTAMT) / SUM(A.INAMT) * 100,1) END AS OUTAMTRATE ";
    sql += ",SUM(A.INQTY - A.OUTQTY) AS STOCKQTY ";
    sql += ",SUM(A.INAMT - A.OUTAMT) AS STOCKAMT ";
    sql += "FROM (SELECT SUM(B.YSAMT) AS YSAMT "
    sql += "        ,COMCD,SUCD,BRCD,YEAR,GUBUN,SEASON "
    sql += "  FROM BIPU010 B " /*구매계획*/
    sql += "  WHERE B.CREATEDATE = ( "
    sql += "                  SELECT max(CREATEDATE) "
    sql += "                  FROM   BIPU010 "
    sql += "                  ) "
    sql += "  GROUP BY COMCD,SUCD,BRCD,YEAR,GUBUN,SEASON "
    sql += "  ) B "
    sql += "LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
    sql += "ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN AND A.SEASON = B.SEASON "
    sql += "WHERE B."+tabType+" = '" + CODETab + "' ";
    sql += "AND   B.YEAR = '" + yearCode + "' ";
    sql += "AND   B.GUBUN = '" + choice + "' "; /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
    sql += "GROUP BY B.SEASON ";
    sql += "ORDER BY B.SEASON";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getCurrentYearData = (req, res) => {
    console.log("============== getCurrentYearData Call ======================");
//   res.send('respond with a resource');
    let gubun = req.query.gubun;
    let code = req.query.code;
    let yearCode = req.query.yearCode;

    /* 월별 소재별 */
    let sql = "select * "
    sql += "from ( "
    sql += "SELECT * "
    sql += "FROM ( "
    sql += "    SELECT MAX('0') AS MONTH "
    sql += "          ,MAX(0) SEQ " /*월별 TOTAL*/
    sql += "          ,MAX(B.YSAMT) AS YSAMT "
    sql += "          ,A.SOJAENM AS SOJAENM "
    sql += "          ,SUM(A.ORQTY) AS ORQTY "
    sql += "          ,SUM(A.ORAMT) AS ORAMT "
    sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.ORAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS ORRATE "
    sql += "          ,SUM(A.INQTY) AS INQTY "
    sql += "          ,SUM(A.INAMT) AS INAMT "
    sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.INAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS INRATE "
    sql += "          ,SUM(A.OUTQTY) AS OUTQTY "
    sql += "          ,SUM(A.OUTAMT) AS OUTAMT "
    sql += "          ,CASE WHEN SUM(A.INQTY) > 0 THEN ROUND(SUM(A.OUTQTY) / SUM(A.INQTY) * 100,1) ELSE 0 END AS OUTQTYRATE "
    sql += "          ,CASE WHEN SUM(A.INAMT) > 0 THEN ROUND(SUM(A.OUTAMT) / SUM(A.INAMT) * 100,1) ELSE 0 END AS OUTAMTRATE "
    sql += "          ,SUM(A.INQTY - A.OUTQTY) AS STOCKQTY "
    sql += "          ,SUM(A.INAMT - A.OUTAMT) AS STOCKAMT "
    sql += "    FROM  (SELECT SUM(B.YSAMT) AS YSAMT "
    sql += "                  ,COMCD,SUCD,BRCD,YEAR,GUBUN "
    sql += "            FROM   BIPU010 B " /*구매계획*/
    sql += "            WHERE  B.CREATEDATE = ( "
    sql += "                        SELECT max(CREATEDATE) "
    sql += "                        FROM   BIPU010 "
    sql += "                        ) "
    sql += "            GROUP BY COMCD,SUCD,BRCD,YEAR,GUBUN "
    sql += "          ) B "
    sql += "          LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
    sql += "          ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN "
    sql += "    WHERE B.SUCD = '" + code + "' "
    sql += "    /*AND   A.BRCD = 'MI'*/ "
    sql += "    AND   B.YEAR = '" + yearCode + "' "
    sql += "    /*AND   A.SEASON = 'I01'*/ "
    sql += "    AND   B.GUBUN = '" + gubun + "' " /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
    sql += "    GROUP BY A.SOJAENM "
    sql += "    UNION ALL     "
    sql += "    SELECT MAX('0') AS MONTH "
    sql += "          ,MAX(1) SEQ " /*월별 TOTAL*/
    sql += "          ,MAX(B.YSAMT) AS YSAMT "
    sql += "          ,MAX('TOTAL') AS SOJAENM "
    sql += "          ,SUM(A.ORQTY) AS ORQTY "
    sql += "          ,SUM(A.ORAMT) AS ORAMT "
    sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.ORAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS ORRATE "
    sql += "          ,SUM(A.INQTY) AS INQTY "
    sql += "          ,SUM(A.INAMT) AS INAMT "
    sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.INAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS INRATE "
    sql += "          ,SUM(A.OUTQTY) AS OUTQTY "
    sql += "          ,SUM(A.OUTAMT) AS OUTAMT "
    sql += "          ,CASE WHEN SUM(A.INQTY) > 0 THEN ROUND(SUM(A.OUTQTY) / SUM(A.INQTY) * 100,1) ELSE 0 END AS OUTQTYRATE "
    sql += "          ,CASE WHEN SUM(A.INAMT) > 0 THEN ROUND(SUM(A.OUTAMT) / SUM(A.INAMT) * 100,1) ELSE 0 END AS OUTAMTRATE "
    sql += "          ,SUM(A.INQTY - A.OUTQTY) AS STOCKQTY "
    sql += "          ,SUM(A.INAMT - A.OUTAMT) AS STOCKAMT "
    sql += "    FROM  (SELECT SUM(B.YSAMT) AS YSAMT "
    sql += "                  ,COMCD,SUCD,BRCD,YEAR,GUBUN "
    sql += "            FROM   BIPU010 B " /*구매계획*/
    sql += "            WHERE  B.CREATEDATE = ( "
    sql += "                        SELECT max(CREATEDATE) "
    sql += "                        FROM   BIPU010 "
    sql += "                        ) "
    sql += "            GROUP BY COMCD,SUCD,BRCD,YEAR,GUBUN "
    sql += "          ) B "
    sql += "          LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
    sql += "          ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN "
    sql += "    WHERE B.SUCD = '" + code + "' "
    sql += "    /*AND   A.BRCD = 'MI'*/ "
    sql += "    AND   B.YEAR = '" + yearCode + "' "
    sql += "    /*AND   A.SEASON = 'I01'*/ "
    sql += "    AND   B.GUBUN = '" + gubun + "' " /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
    sql += "    GROUP BY B.YEAR "
    sql += "      ) A "
    sql += "UNION ALL  " 

    sql += "SELECT * "
    sql += "FROM ( "
    sql += "    SELECT B.SEASON AS MONTH "
    sql += "          ,MAX(0.5) SEQ " /*월별 TOTAL*/
    sql += "          ,MAX(B.YSAMT) AS YSAMT "
    sql += "          ,MAX('TOTAL') AS SOJAENM "
    sql += "          ,SUM(A.ORQTY) AS ORQTY "
    sql += "          ,SUM(A.ORAMT) AS ORAMT "
    sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.ORAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS ORRATE "
    sql += "          ,SUM(A.INQTY) AS INQTY "
    sql += "          ,SUM(A.INAMT) AS INAMT "
    sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.INAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS INRATE "
    sql += "          ,SUM(A.OUTQTY) AS OUTQTY "
    sql += "          ,SUM(A.OUTAMT) AS OUTAMT "
    sql += "          ,CASE WHEN SUM(A.INQTY) > 0 THEN ROUND(SUM(A.OUTQTY) / SUM(A.INQTY) * 100,1) ELSE 0 END AS OUTQTYRATE "
    sql += "          ,CASE WHEN SUM(A.INAMT) > 0 THEN ROUND(SUM(A.OUTAMT) / SUM(A.INAMT) * 100,1) ELSE 0 END AS OUTAMTRATE "
    sql += "          ,SUM(A.INQTY - A.OUTQTY) AS STOCKQTY "
    sql += "          ,SUM(A.INAMT - A.OUTAMT) AS STOCKAMT "
    sql += "    FROM  (SELECT SUM(B.YSAMT) AS YSAMT "
    sql += "                  ,COMCD,SUCD,BRCD,YEAR,GUBUN,SEASON "
    sql += "            FROM   BIPU010 B " /*구매계획*/
    sql += "            WHERE  B.CREATEDATE = ( "
    sql += "                        SELECT max(CREATEDATE) "
    sql += "                        FROM   BIPU010 "
    sql += "                        ) "
    sql += "            GROUP BY COMCD,SUCD,BRCD,YEAR,GUBUN,SEASON "
    sql += "          ) B "
    sql += "          LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
    sql += "          ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN AND A.SEASON = B.SEASON"
    sql += "    WHERE B.SUCD = '" + code + "' "
    sql += "    /*AND   A.BRCD = 'MI'*/ "
    sql += "    AND   B.YEAR = '" + yearCode + "' "
    sql += "    AND   B.GUBUN = '" + gubun + "' " /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
    sql += "    GROUP BY B.SEASON "
    sql += "    UNION ALL "
    sql += "    SELECT B.SEASON AS MONTH "
    sql += "          ,MAX(0) AS SEQ " /*월별 TOTAL*/
    sql += "          ,MAX(B.YSAMT) AS YSAMT "
    sql += "          ,A.SOJAENM AS SOJAENM "
    sql += "          ,SUM(A.ORQTY) AS ORQTY "
    sql += "          ,SUM(A.ORAMT) AS ORAMT "
    sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.ORAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS ORRATE "
    sql += "          ,SUM(A.INQTY) AS INQTY "
    sql += "          ,SUM(A.INAMT) AS INAMT "
    sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.INAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS INRATE "
    sql += "          ,SUM(A.OUTQTY) AS OUTQTY "
    sql += "          ,SUM(A.OUTAMT) AS OUTAMT "
    sql += "          ,CASE WHEN SUM(A.INQTY) > 0 THEN ROUND(SUM(A.OUTQTY) / SUM(A.INQTY) * 100,1) ELSE 0 END AS OUTQTYRATE "
    sql += "          ,CASE WHEN SUM(A.INAMT) > 0 THEN ROUND(SUM(A.OUTAMT) / SUM(A.INAMT) * 100,1) ELSE 0 END AS OUTAMTRATE "
    sql += "          ,SUM(A.INQTY - A.OUTQTY) AS STOCKQTY "
    sql += "          ,SUM(A.INAMT - A.OUTAMT) AS STOCKAMT "
    sql += "    FROM  (SELECT SUM(B.YSAMT) AS YSAMT "
    sql += "                  ,COMCD,SUCD,BRCD,YEAR,GUBUN,SEASON "
    sql += "            FROM   BIPU010 B " /*구매계획*/
    sql += "            WHERE  B.CREATEDATE = ( "
    sql += "                        SELECT max(CREATEDATE) "
    sql += "                        FROM   BIPU010 "
    sql += "                        ) "
    sql += "            GROUP BY COMCD,SUCD,BRCD,YEAR,GUBUN,SEASON "
    sql += "          ) B "
    sql += "          LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
    sql += "          ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN AND A.SEASON = B.SEASON"
    sql += "    WHERE B.SUCD = '" + code + "' "
    sql += "    /*AND   A.BRCD = 'MI'*/ "
    sql += "    AND   B.YEAR = '" + yearCode + "' "
    sql += "    AND   B.GUBUN = '" + gubun + "' " /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
    sql += "    GROUP BY B.SEASON, A.SOJAENM "
    sql += "    ) A "
    sql += "UNION ALL  " 

    sql += "SELECT * "
    sql += "FROM ( "
    sql += "    SELECT B.YSCD AS MONTH "
    sql += "          ,2 SEQ " /*월별*/
    sql += "          ,B.YSAMT AS YSAMT "
    sql += "          ,A.SOJAENM AS SOJAENM "
    sql += "          ,A.ORQTY AS ORQTY "
    sql += "          ,A.ORAMT AS ORAMT "
    sql += "          ,CASE WHEN B.YSAMT > 0 THEN ROUND(A.ORAMT / B.YSAMT * 100,1) ELSE 0 END AS ORRATE "
    sql += "          ,A.INQTY AS INQTY "
    sql += "          ,A.INAMT AS INAMT "
    sql += "          ,CASE WHEN B.YSAMT > 0 THEN ROUND(A.INAMT / B.YSAMT * 100,1) ELSE 0 END AS INRATE "
    sql += "          ,A.OUTQTY AS OUTQTY "
    sql += "          ,A.OUTAMT AS OUTAMT "
    sql += "          ,CASE WHEN A.INQTY > 0 THEN ROUND(A.OUTQTY / A.INQTY * 100,1) ELSE 0 END AS OUTQTYRATE "
    sql += "          ,CASE WHEN A.INAMT > 0 THEN ROUND(A.OUTAMT / A.INAMT * 100,1) ELSE 0 END AS OUTAMTRATE "
    sql += "          ,A.INQTY - OUTQTY AS STOCKQTY "
    sql += "          ,A.INAMT - OUTAMT AS STOCKAMT "
    sql += "    FROM  (SELECT * FROM BIPU010 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU010)) B " /*구매계획*/
    sql += "          LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
    sql += "          ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN AND A.YSCD = B.YSCD"
    sql += "    WHERE B.SUCD = '" + code + "' "
    sql += "    /*AND   A.BRCD = 'MI'*/ "
    sql += "    AND   B.YEAR = '" + yearCode + "' "
    sql += "    /*AND   A.SEASON = 'I01'*/ "
    sql += "    AND   B.GUBUN = '" + gubun + "' " /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
    sql += "    UNION ALL "
    sql += "    SELECT B.YSCD AS MONTH "
    sql += "          ,MAX(3) SEQ " /*월별 TOTAL*/
    sql += "          ,MAX(B.YSAMT) AS YSAMT "
    sql += "          ,MAX('TOTAL') AS SOJAENM "
    sql += "          ,SUM(A.ORQTY) AS ORQTY "
    sql += "          ,SUM(A.ORAMT) AS ORAMT "
    sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.ORAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS ORRATE "
    sql += "          ,SUM(A.INQTY) AS INQTY "
    sql += "          ,SUM(A.INAMT) AS INAMT "
    sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.INAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS INRATE "
    sql += "          ,SUM(A.OUTQTY) AS OUTQTY "
    sql += "          ,SUM(A.OUTAMT) AS OUTAMT "
    sql += "          ,CASE WHEN SUM(A.INQTY) > 0 THEN ROUND(SUM(A.OUTQTY) / SUM(A.INQTY) * 100,1) ELSE 0 END AS OUTQTYRATE "
    sql += "          ,CASE WHEN SUM(A.INAMT) > 0 THEN ROUND(SUM(A.OUTAMT) / SUM(A.INAMT) * 100,1) ELSE 0 END AS OUTAMTRATE "
    sql += "          ,SUM(A.INQTY) - SUM(OUTQTY) AS STOCKQTY "
    sql += "          ,SUM(A.INAMT) - SUM(OUTAMT) AS STOCKAMT "
    sql += "    FROM  (SELECT * FROM BIPU010 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU010)) B " /*구매계획*/
    sql += "          LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
    sql += "          ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN AND A.YSCD = B.YSCD"
    sql += "    WHERE B.SUCD = '" + code + "' "
    sql += "    /*AND   A.BRCD = 'MI'*/ "
    sql += "    AND   B.YEAR = '" + yearCode + "' "
    sql += "    /*AND   A.SEASON = 'I01'*/ "
    sql += "    AND   B.GUBUN = '" + gubun + "' " /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
    sql += "    GROUP BY B.YSCD "
    sql += "    ) A "
    sql += ") a     "
    sql += "ORDER BY A.MONTH , SEQ "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getLastYearData = (req, res) => {
    console.log("============== getLastYearData Call ======================");
//   res.send('respond with a resource');
    let gubun = req.query.gubun;
    let code = req.query.code;
    let yearCode = req.query.yearCode;

      /* 월별 소재별 */
      let sql = "select * "
      sql += "from ( "
      sql += "SELECT * "
      sql += "FROM ( "
      sql += "    SELECT MAX('0') AS MONTH "
      sql += "          ,MAX(0) SEQ " /*월별 TOTAL*/
      sql += "          ,MAX(B.YSAMT) AS YSAMT "
      sql += "          ,A.SOJAENM AS SOJAENM "
      sql += "          ,SUM(A.ORQTY) AS ORQTY "
      sql += "          ,SUM(A.ORAMT) AS ORAMT "
      sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.ORAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS ORRATE "
      sql += "          ,SUM(A.INQTY) AS INQTY "
      sql += "          ,SUM(A.INAMT) AS INAMT "
      sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.INAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS INRATE "
      sql += "          ,SUM(A.OUTQTY) AS OUTQTY "
      sql += "          ,SUM(A.OUTAMT) AS OUTAMT "
      sql += "          ,CASE WHEN SUM(A.INQTY) > 0 THEN ROUND(SUM(A.OUTQTY) / SUM(A.INQTY) * 100,1) ELSE 0 END AS OUTQTYRATE "
      sql += "          ,CASE WHEN SUM(A.INAMT) > 0 THEN ROUND(SUM(A.OUTAMT) / SUM(A.INAMT) * 100,1) ELSE 0 END AS OUTAMTRATE "
      sql += "          ,SUM(A.INQTY - A.OUTQTY) AS STOCKQTY "
      sql += "          ,SUM(A.INAMT - A.OUTAMT) AS STOCKAMT "
      sql += "    FROM  (SELECT SUM(B.YSAMT) AS YSAMT "
      sql += "                  ,COMCD,SUCD,BRCD,YEAR,GUBUN "
      sql += "            FROM   BIPU010 B " /*구매계획*/
      sql += "            WHERE  B.CREATEDATE = ( "
      sql += "                        SELECT max(CREATEDATE) "
      sql += "                        FROM   BIPU010 "
      sql += "                        ) "
      sql += "            GROUP BY COMCD,SUCD,BRCD,YEAR,GUBUN "
      sql += "          ) B "
      sql += "          LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
      sql += "          ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN "
      sql += "    WHERE B.SUCD = '" + code + "' "
      sql += "    /*AND   A.BRCD = 'MI'*/ "
      sql += "    AND   B.YEAR = '" + yearCode + "' "
      sql += "    /*AND   A.SEASON = 'I01'*/ "
      sql += "    AND   B.GUBUN = '" + gubun + "' " /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
      sql += "    GROUP BY A.SOJAENM "
      sql += "    UNION ALL     "
      sql += "    SELECT MAX('0') AS MONTH "
      sql += "          ,MAX(1) SEQ " /*월별 TOTAL*/
      sql += "          ,MAX(B.YSAMT) AS YSAMT "
      sql += "          ,MAX('TOTAL') AS SOJAENM "
      sql += "          ,SUM(A.ORQTY) AS ORQTY "
      sql += "          ,SUM(A.ORAMT) AS ORAMT "
      sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.ORAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS ORRATE "
      sql += "          ,SUM(A.INQTY) AS INQTY "
      sql += "          ,SUM(A.INAMT) AS INAMT "
      sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.INAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS INRATE "
      sql += "          ,SUM(A.OUTQTY) AS OUTQTY "
      sql += "          ,SUM(A.OUTAMT) AS OUTAMT "
      sql += "          ,CASE WHEN SUM(A.INQTY) > 0 THEN ROUND(SUM(A.OUTQTY) / SUM(A.INQTY) * 100,1) ELSE 0 END AS OUTQTYRATE "
      sql += "          ,CASE WHEN SUM(A.INAMT) > 0 THEN ROUND(SUM(A.OUTAMT) / SUM(A.INAMT) * 100,1) ELSE 0 END AS OUTAMTRATE "
      sql += "          ,SUM(A.INQTY - A.OUTQTY) AS STOCKQTY "
      sql += "          ,SUM(A.INAMT - A.OUTAMT) AS STOCKAMT "
      sql += "    FROM  (SELECT SUM(B.YSAMT) AS YSAMT "
      sql += "                  ,COMCD,SUCD,BRCD,YEAR,GUBUN "
      sql += "            FROM   BIPU010 B " /*구매계획*/
      sql += "            WHERE  B.CREATEDATE = ( "
      sql += "                        SELECT max(CREATEDATE) "
      sql += "                        FROM   BIPU010 "
      sql += "                        ) "
      sql += "            GROUP BY COMCD,SUCD,BRCD,YEAR,GUBUN "
      sql += "          ) B "
      sql += "          LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
      sql += "          ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN "
      sql += "    WHERE B.SUCD = '" + code + "' "
      sql += "    /*AND   A.BRCD = 'MI'*/ "
      sql += "    AND   B.YEAR = '" + yearCode + "' "
      sql += "    /*AND   A.SEASON = 'I01'*/ "
      sql += "    AND   B.GUBUN = '" + gubun + "' " /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
      sql += "    GROUP BY A.YEAR "
      sql += "      ) A "
      sql += "UNION ALL  " 

      sql += "SELECT * "
      sql += "FROM ( "
      sql += "    SELECT B.SEASON AS MONTH "
      sql += "          ,MAX(0.5) SEQ " /*월별 TOTAL*/
      sql += "          ,MAX(B.YSAMT) AS YSAMT "
      sql += "          ,MAX('TOTAL') AS SOJAENM "
      sql += "          ,SUM(A.ORQTY) AS ORQTY "
      sql += "          ,SUM(A.ORAMT) AS ORAMT "
      sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.ORAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS ORRATE "
      sql += "          ,SUM(A.INQTY) AS INQTY "
      sql += "          ,SUM(A.INAMT) AS INAMT "
      sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.INAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS INRATE "
      sql += "          ,SUM(A.OUTQTY) AS OUTQTY "
      sql += "          ,SUM(A.OUTAMT) AS OUTAMT "
      sql += "          ,CASE WHEN SUM(A.INQTY) > 0 THEN ROUND(SUM(A.OUTQTY) / SUM(A.INQTY) * 100,1) ELSE 0 END AS OUTQTYRATE "
      sql += "          ,CASE WHEN SUM(A.INAMT) > 0 THEN ROUND(SUM(A.OUTAMT) / SUM(A.INAMT) * 100,1) ELSE 0 END AS OUTAMTRATE "
      sql += "          ,SUM(A.INQTY - A.OUTQTY) AS STOCKQTY "
      sql += "          ,SUM(A.INAMT - A.OUTAMT) AS STOCKAMT "
      sql += "    FROM  (SELECT SUM(B.YSAMT) AS YSAMT "
      sql += "                  ,COMCD,SUCD,BRCD,YEAR,GUBUN,SEASON "
      sql += "            FROM   BIPU010 B " /*구매계획*/
      sql += "            WHERE  B.CREATEDATE = ( "
      sql += "                        SELECT max(CREATEDATE) "
      sql += "                        FROM   BIPU010 "
      sql += "                        ) "
      sql += "            GROUP BY COMCD,SUCD,BRCD,YEAR,GUBUN,SEASON "
      sql += "          ) B "
      sql += "          LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
      sql += "          ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN AND A.SEASON = B.SEASON"
      sql += "    WHERE B.SUCD = '" + code + "' "
      sql += "    /*AND   A.BRCD = 'MI'*/ "
      sql += "    AND   B.YEAR = '" + yearCode + "' "
      sql += "    AND   B.GUBUN = '" + gubun + "' " /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
      sql += "    GROUP BY B.SEASON "
      sql += "    UNION ALL "
      sql += "    SELECT B.SEASON AS MONTH "
      sql += "          ,MAX(0) AS SEQ " /*월별 TOTAL*/
      sql += "          ,MAX(B.YSAMT) AS YSAMT "
      sql += "          ,A.SOJAENM AS SOJAENM "
      sql += "          ,SUM(A.ORQTY) AS ORQTY "
      sql += "          ,SUM(A.ORAMT) AS ORAMT "
      sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.ORAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS ORRATE "
      sql += "          ,SUM(A.INQTY) AS INQTY "
      sql += "          ,SUM(A.INAMT) AS INAMT "
      sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.INAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS INRATE "
      sql += "          ,SUM(A.OUTQTY) AS OUTQTY "
      sql += "          ,SUM(A.OUTAMT) AS OUTAMT "
      sql += "          ,CASE WHEN SUM(A.INQTY) > 0 THEN ROUND(SUM(A.OUTQTY) / SUM(A.INQTY) * 100,1) ELSE 0 END AS OUTQTYRATE "
      sql += "          ,CASE WHEN SUM(A.INAMT) > 0 THEN ROUND(SUM(A.OUTAMT) / SUM(A.INAMT) * 100,1) ELSE 0 END AS OUTAMTRATE "
      sql += "          ,SUM(A.INQTY - A.OUTQTY) AS STOCKQTY "
      sql += "          ,SUM(A.INAMT - A.OUTAMT) AS STOCKAMT "
      sql += "    FROM  (SELECT SUM(B.YSAMT) AS YSAMT "
      sql += "                  ,COMCD,SUCD,BRCD,YEAR,GUBUN,SEASON "
      sql += "            FROM   BIPU010 B " /*구매계획*/
      sql += "            WHERE  B.CREATEDATE = ( "
      sql += "                        SELECT max(CREATEDATE) "
      sql += "                        FROM   BIPU010 "
      sql += "                        ) "
      sql += "            GROUP BY COMCD,SUCD,BRCD,YEAR,GUBUN,SEASON "
      sql += "          ) B "
      sql += "          LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
      sql += "          ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN AND A.SEASON = B.SEASON"
      sql += "    WHERE B.SUCD = '" + code + "' "
      sql += "    /*AND   A.BRCD = 'MI'*/ "
      sql += "    AND   B.YEAR = '" + yearCode + "' "
      sql += "    AND   B.GUBUN = '" + gubun + "' " /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
      sql += "    GROUP BY B.SEASON, A.SOJAENM "
      sql += "    ) A "
      sql += "UNION ALL  " 

      sql += "SELECT * "
      sql += "FROM ( "
      sql += "    SELECT B.YSCD AS MONTH "
      sql += "          ,2 SEQ " /*월별*/
      sql += "          ,B.YSAMT AS YSAMT "
      sql += "          ,A.SOJAENM AS SOJAENM "
      sql += "          ,A.ORQTY AS ORQTY "
      sql += "          ,A.ORAMT AS ORAMT "
      sql += "          ,CASE WHEN B.YSAMT > 0 THEN ROUND(A.ORAMT / B.YSAMT * 100,1) ELSE 0 END AS ORRATE "
      sql += "          ,A.INQTY AS INQTY "
      sql += "          ,A.INAMT AS INAMT "
      sql += "          ,CASE WHEN B.YSAMT > 0 THEN ROUND(A.INAMT / B.YSAMT * 100,1) ELSE 0 END AS INRATE "
      sql += "          ,A.OUTQTY AS OUTQTY "
      sql += "          ,A.OUTAMT AS OUTAMT "
      sql += "          ,CASE WHEN A.INQTY > 0 THEN ROUND(A.OUTQTY / A.INQTY * 100,1) ELSE 0 END AS OUTQTYRATE "
      sql += "          ,CASE WHEN A.INAMT > 0 THEN ROUND(A.OUTAMT / A.INAMT * 100,1) ELSE 0 END AS OUTAMTRATE "
      sql += "          ,A.INQTY - OUTQTY AS STOCKQTY "
      sql += "          ,A.INAMT - OUTAMT AS STOCKAMT "
      sql += "    FROM  (SELECT * FROM BIPU010 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU010)) B " /*구매계획*/
      sql += "          LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
      sql += "          ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN AND A.YSCD = B.YSCD"
      sql += "    WHERE B.SUCD = '" + code + "' "
      sql += "    /*AND   A.BRCD = 'MI'*/ "
      sql += "    AND   B.YEAR = '" + yearCode + "' "
      sql += "    /*AND   A.SEASON = 'I01'*/ "
      sql += "    AND   B.GUBUN = '" + gubun + "' " /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
      sql += "    UNION ALL "
      sql += "    SELECT B.YSCD AS MONTH "
      sql += "          ,MAX(3) SEQ " /*월별 TOTAL*/
      sql += "          ,MAX(B.YSAMT) AS YSAMT "
      sql += "          ,MAX('TOTAL') AS SOJAENM "
      sql += "          ,SUM(A.ORQTY) AS ORQTY "
      sql += "          ,SUM(A.ORAMT) AS ORAMT "
      sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.ORAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS ORRATE "
      sql += "          ,SUM(A.INQTY) AS INQTY "
      sql += "          ,SUM(A.INAMT) AS INAMT "
      sql += "          ,CASE WHEN MAX(B.YSAMT) > 0 THEN ROUND(SUM(A.INAMT) / MAX(B.YSAMT) * 100,1) ELSE 0 END AS INRATE "
      sql += "          ,SUM(A.OUTQTY) AS OUTQTY "
      sql += "          ,SUM(A.OUTAMT) AS OUTAMT "
      sql += "          ,CASE WHEN SUM(A.INQTY) > 0 THEN ROUND(SUM(A.OUTQTY) / SUM(A.INQTY) * 100,1) ELSE 0 END AS OUTQTYRATE "
      sql += "          ,CASE WHEN SUM(A.INAMT) > 0 THEN ROUND(SUM(A.OUTAMT) / SUM(A.INAMT) * 100,1) ELSE 0 END AS OUTAMTRATE "
      sql += "          ,SUM(A.INQTY) - SUM(OUTQTY) AS STOCKQTY "
      sql += "          ,SUM(A.INAMT) - SUM(OUTAMT) AS STOCKAMT "
      sql += "    FROM  (SELECT * FROM BIPU010 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU010)) B " /*구매계획*/
      sql += "          LEFT OUTER JOIN (SELECT * FROM BIPU012 WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIPU012)) A " /*구매정보*/
      sql += "          ON A.COMCD = B.COMCD AND A.SUCD = B.SUCD AND A.BRCD = B.BRCD AND A.YEAR = B.YEAR AND A.GUBUN = B.GUBUN AND A.YSCD = B.YSCD"
      sql += "    WHERE B.SUCD = '" + code + "' "
      sql += "    /*AND   A.BRCD = 'MI'*/ "
      sql += "    AND   B.YEAR = '" + yearCode + "' "
      sql += "    /*AND   A.SEASON = 'I01'*/ "
      sql += "    AND   B.GUBUN = '" + gubun + "' " /* 데이터 구분(1:원자재, 2:부자재, 3:임가공, 4:완사입) */
      sql += "    GROUP BY B.YSCD "
      sql += "    ) A "
      sql += ") a     "
      sql += "ORDER BY A.MONTH , SEQ "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};