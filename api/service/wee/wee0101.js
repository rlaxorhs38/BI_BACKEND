var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getDataByClothingType = (req, res) => {
    console.log("============== getDataByClothingType Call ======================");
    
    let selectSucd = req.query.selectSucd;
    let date = req.query.date;
    let lastYearDate = req.query.lastYearDate;
    let fromSeason = req.query.fromSeason;
    let toSeason = req.query.toSeason;
    let fromLastYearSeason = req.query.fromLastYearSeason;
    let toLastYearSeason = req.query.toLastYearSeason;
    let comcd = 1;
    let brcd;
    
    if(selectSucd == 3) { // SO 사업부만 selectComcd 2
        comcd = 2
    }

    if(selectSucd == 1) { // MI사업부
        brcd = "BRCD = 'MI'"
    } else if(selectSucd == 12) { // MO사업부
        brcd = "BRCD = 'MI'"
    } else if(selectSucd == 4) { // IT사업부
        brcd = "BRCD = 'IT'"
    } else if(selectSucd == 3) { // SO사업부
        brcd = "BRCD = 'SO'"
    } else if(selectSucd == 21) { // FO사업부
        brcd = "BRCD IN ('MI','IT','SO')"
    }
    
    // 지역 셀렉박스
    let sql = ""        
    sql += "SELECT ITEM, CODNM, MCNT, INQTY, INAMT, SOINAMT, SQTY, SILAMT, ACCSQTY, ACCSILAMT,"
    sql += "	   CASE WHEN NVL(SOINAMT,0) = 0 THEN 0 ELSE ROUND(ACCSILAMT/SOINAMT*100) END AS SOPER,"
    sql += "	   CASE WHEN NVL(INQTY,0) = 0 THEN 0 ELSE ROUND(ACCSQTY/INQTY*100) END AS PERQTY,"
    sql += "	   CASE WHEN NVL(INAMT,0) = 0 THEN 0 ELSE ROUND(ACCSILAMT/INAMT*100) END AS PERAMT,"
    sql += "	   JMCNT, JINQTY, JINAMT, JSQTY, JSOINAMT, JSILAMT, JACCSQTY, JACCSILAMT,"
    sql += "	   CASE WHEN NVL(JSOINAMT,0) = 0 THEN 0 ELSE ROUND(JACCSILAMT/JSOINAMT*100) END AS JSOPER,"
    sql += "	   CASE WHEN NVL(JINQTY,0) = 0 THEN 0 ELSE ROUND(JACCSQTY/JINQTY*100) END AS JPERQTY,"
    sql += "	   CASE WHEN NVL(JINAMT,0) = 0 THEN 0 ELSE ROUND(JACCSILAMT/JINAMT*100) END AS JPERAMT,"
    sql += "	   (INAMT-JINAMT) AS ERRINAMT,"
    sql += "	   CASE WHEN NVL(JINAMT,0) = 0 THEN 0 ELSE ROUND((INAMT/JINAMT-1)*100) END AS ERRINPER,"
    sql += "	   (ACCSILAMT-JACCSILAMT) AS ERRACCAMT,"
    sql += "	   CASE WHEN NVL(JACCSILAMT,0) = 0 THEN 0 ELSE ROUND((ACCSILAMT/JACCSILAMT-1)*100) END AS ERRACCPER,"
    sql += "	   (SILAMT-JSILAMT) AS ERRSAMT,"
    sql += "	   CASE WHEN NVL(JSILAMT,0) = 0 THEN 0 ELSE ROUND((SILAMT/JSILAMT-1)*100) END AS ERRSPER,"
    sql += "	   SORTORD"
    sql += "  FROM"
    sql += "    ("
    sql += "    SELECT ITEM, B.CODNM,"
    sql += "           SUM(MCNT) MCNT, SUM(INQTY) INQTY, SUM(INAMT) INAMT, SUM(SOINAMT) SOINAMT, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, SUM(ACCSQTY) ACCSQTY, SUM(ACCSILAMT) ACCSILAMT,"
    sql += "           SUM(JMCNT) JMCNT, SUM(JINQTY) JINQTY, SUM(JINAMT) JINAMT, SUM(JSOINAMT) JSOINAMT, SUM(JSQTY) JSQTY, SUM(JSILAMT) JSILAMT, SUM(JACCSQTY) JACCSQTY, SUM(JACCSILAMT) JACCSILAMT,"
    sql += "           SORTORD"
    sql += "      FROM"
    sql += "        (SELECT ITEM, MCNT, INQTY, INAMT, SOINAMT, SQTY, SILAMT, ACCSQTY, ACCSILAMT,"
    sql += "               0 JMCNT, 0 JINQTY, 0 JINAMT, 0 JSOINAMT, 0 JSQTY, 0 JSILAMT, 0 JACCSQTY, 0 JACCSILAMT"
    sql += "          FROM"
    sql += "            (SELECT ITEM,"
    sql += "            	     SUM(MCNT) AS MCNT,"
    sql += "                   (SUM(INQTY)-SUM(CHINAQTY)) INQTY, ROUND((SUM(INTAGPRI)-SUM(CHINAPRI))/1000) INAMT,"
    sql += "                   SUM(SQTY) SQTY, ROUND(SUM(SILAMT)/1000) SILAMT,"
    sql += "                   SUM(ACCSQTY) ACCSQTY, ROUND(SUM(ACCSILAMT)/1000) ACCSILAMT,"
    sql += "    		 	   ROUND(SUM(SOINTAGPRI)/1000) SOINAMT"
    sql += "              FROM ("
    sql += "                SELECT ITEM, STYCD, MAINSTYCD,"
    sql += "                   CASE WHEN STYCD = MAINSTYCD AND SUBSTR(STYCD, 8, 1) <> '8' THEN 1 ELSE 0 END AS MCNT,"
    sql += "                   SUM(INQTY) AS INQTY,"
    sql += "                   SUM(INTAGPRI)/1000 AS INTAGPRI,"
    sql += "                   SUM(CASE WHEN INOUTDT >= TO_CHAR(ADD_TIME(TO_DATE('" + date + "', 'YYYYMMDD'), '0/0/-6 0:0:0'),'YYYYMMDD') THEN SQTY ELSE 0 END) AS SQTY,"
    sql += "                   SUM(CASE WHEN INOUTDT >= TO_CHAR(ADD_TIME(TO_DATE('" + date + "', 'YYYYMMDD'), '0/0/-6 0:0:0'),'YYYYMMDD') THEN SILAMT ELSE 0 END)/1000 AS SILAMT,"
    sql += "                   SUM(SQTY) AS ACCSQTY,"
    sql += "                   SUM(SILAMT)/1000 AS ACCSILAMT,"
    sql += "                   SUM(CHINAQTY) AS CHINAQTY,"
    sql += "                   SUM(CHINAPRI)/1000 AS CHINAPRI,"
    sql += "                   SUM(SOINTAGPRI)/1000 AS SOINTAGPRI"
    sql += "                  FROM BIWE020"
    sql += "                 WHERE COMCD = '" + comcd + "'"
    sql += "                   AND SUCD = '" + selectSucd + "'"
    sql += "                   AND " + brcd
    sql += "            	   AND YSCD BETWEEN '" + fromSeason + "' AND '" + toSeason + "'"
    sql += "            	   AND INOUTDT <= '" + date + "'"
    sql += "            	   AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE020)"
    sql += "                 GROUP BY ITEM, STYCD, MAINSTYCD, MCNT"
    sql += "                )"
    sql += "             GROUP BY ITEM"
    sql += "            )"
    sql += "        UNION ALL"
    sql += "        SELECT ITEM, 0 MCNT, 0 INQTY, 0 INAMT, 0 SOINAMT, 0 SQTY, 0 SILAMT, 0 ACCSQTY, 0 ACCSILAMT,"
    sql += "               MCNT JMCNT, INQTY JINQTY, INAMT JINAMT, SOINAMT JSOINAMT, SQTY JSQTY, SILAMT JSILAMT, ACCSQTY JACCSQTY, ACCSILAMT JACCSILAMT"
    sql += "          FROM"
    sql += "            (SELECT ITEM,"
    sql += "            	     SUM(MCNT) AS MCNT,"
    sql += "                   (SUM(INQTY)-SUM(CHINAQTY)) INQTY, ROUND((SUM(INTAGPRI)-SUM(CHINAPRI))/1000) INAMT,"
    sql += "                   SUM(SQTY) SQTY, ROUND(SUM(SILAMT)/1000) SILAMT,"
    sql += "                   SUM(ACCSQTY) ACCSQTY, ROUND(SUM(ACCSILAMT)/1000) ACCSILAMT,"
    sql += "    		 	   ROUND(SUM(SOINTAGPRI)/1000) SOINAMT"
    sql += "              FROM ("
    sql += "                SELECT ITEM, STYCD, MAINSTYCD,"
    sql += "                   CASE WHEN STYCD = MAINSTYCD AND SUBSTR(STYCD, 8, 1) <> '8' THEN 1 ELSE 0 END AS MCNT,"
    sql += "                   SUM(INQTY) AS INQTY,"
    sql += "                   SUM(INTAGPRI)/1000 AS INTAGPRI,"
    sql += "                   SUM(CASE WHEN INOUTDT >= TO_CHAR(ADD_TIME(TO_DATE('" + lastYearDate + "', 'YYYYMMDD'), '0/0/-6 0:0:0'),'YYYYMMDD') THEN SQTY ELSE 0 END) AS SQTY,"
    sql += "                   SUM(CASE WHEN INOUTDT >= TO_CHAR(ADD_TIME(TO_DATE('" + lastYearDate + "', 'YYYYMMDD'), '0/0/-6 0:0:0'),'YYYYMMDD') THEN SILAMT ELSE 0 END)/1000 AS SILAMT,"
    sql += "                   SUM(SQTY) AS ACCSQTY,"
    sql += "                   SUM(SILAMT)/1000 AS ACCSILAMT,"
    sql += "                   SUM(CHINAQTY) AS CHINAQTY,"
    sql += "                   SUM(CHINAPRI)/1000 AS CHINAPRI,"
    sql += "                   SUM(SOINTAGPRI)/1000 AS SOINTAGPRI"
    sql += "                  FROM BIWE020"
    sql += "                 WHERE COMCD = '" + comcd + "'"
    sql += "                   AND SUCD = '" + selectSucd + "'"
    sql += "                   AND " + brcd
    sql += "            	   AND YSCD BETWEEN '" + fromLastYearSeason + "' AND '" + toLastYearSeason + "'"
    sql += "            	   AND INOUTDT <= '" + lastYearDate + "'"
    sql += "            	   AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE020)"
    sql += "                 GROUP BY ITEM, STYCD, MAINSTYCD, MCNT"
    sql += "                )"
    sql += "             GROUP BY ITEM"
    sql += "            )"
    sql += "        ) A,"
    sql += "        (SELECT * FROM BICM011 WHERE GBNCD='WE001') B"
    sql += "     WHERE A.ITEM = B.CODE"
    sql += "     GROUP BY ITEM, B.CODNM, B.SORTORD"
    sql += "    UNION ALL"
    sql += "    SELECT A.ITEM, CODNM,"
    sql += "           SUM(MCNT) MCNT, SUM(INQTY) INQTY, SUM(INAMT) INAMT, SUM(SOINAMT) SOINAMT,SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, SUM(ACCSQTY) ACCSQTY, SUM(ACCSILAMT) ACCSILAMT,"
    sql += "           SUM(JMCNT) JMCNT, SUM(JINQTY) JINQTY, SUM(JINAMT) JINAMT, SUM(JSOINAMT) JSOINAMT,SUM(JSQTY) JSQTY, SUM(JSILAMT) JSILAMT, SUM(JACCSQTY) JACCSQTY, SUM(JACCSILAMT) JACCSILAMT,"
    sql += "           A.SORTORD"
    sql += "      FROM"
    sql += "        (SELECT 'TOTAL' ITEM, 'TOTAL' CODNM, MCNT, INQTY, INAMT, SOINAMT, SQTY, SILAMT, ACCSQTY, ACCSILAMT,"
    sql += "               0 JMCNT, 0 JINQTY, 0 JINAMT, 0 JSOINAMT, 0 JSQTY, 0 JSILAMT, 0 JACCSQTY, 0 JACCSILAMT,"
    sql += "    	 	   99 SORTORD"
    sql += "          FROM"
    sql += "            (SELECT ITEM,"
    sql += "            	     SUM(MCNT) AS MCNT,"
    sql += "                   (SUM(INQTY)-SUM(CHINAQTY)) INQTY, ROUND((SUM(INTAGPRI)-SUM(CHINAPRI))/1000) INAMT,"
    sql += "                   SUM(SQTY) SQTY, ROUND(SUM(SILAMT)/1000) SILAMT,"
    sql += "                   SUM(ACCSQTY) ACCSQTY, ROUND(SUM(ACCSILAMT)/1000) ACCSILAMT,"
    sql += "    		 	   SUM(SOINTAGPRI)/1000 SOINAMT"
    sql += "              FROM ("
    sql += "                SELECT ITEM, STYCD, MAINSTYCD,"
    sql += "                   CASE WHEN STYCD = MAINSTYCD AND SUBSTR(STYCD, 8, 1) <> '8' THEN 1 ELSE 0 END AS MCNT,"
    sql += "                   SUM(INQTY) AS INQTY,"
    sql += "                   SUM(INTAGPRI)/1000 AS INTAGPRI,"
    sql += "                   SUM(CASE WHEN INOUTDT >= TO_CHAR(ADD_TIME(TO_DATE('" + date + "', 'YYYYMMDD'), '0/0/-6 0:0:0'),'YYYYMMDD') THEN SQTY ELSE 0 END) AS SQTY,"
    sql += "                   SUM(CASE WHEN INOUTDT >= TO_CHAR(ADD_TIME(TO_DATE('" + date + "', 'YYYYMMDD'), '0/0/-6 0:0:0'),'YYYYMMDD') THEN SILAMT ELSE 0 END)/1000 AS SILAMT,"
    sql += "                   SUM(SQTY) AS ACCSQTY,"
    sql += "                   SUM(SILAMT)/1000 AS ACCSILAMT,"
    sql += "                   SUM(CHINAQTY) AS CHINAQTY,"
    sql += "                   SUM(CHINAPRI)/1000 AS CHINAPRI,"
    sql += "                   SUM(SOINTAGPRI)/1000 AS SOINTAGPRI"
    sql += "                  FROM BIWE020"
    sql += "                 WHERE COMCD = '" + comcd + "'"
    sql += "                   AND SUCD = '" + selectSucd + "'"
    sql += "                   AND " + brcd
    sql += "            	   AND YSCD BETWEEN '" + fromSeason + "' AND '" + toSeason + "'"
    sql += "            	   AND INOUTDT <= '" + date + "'"
    sql += "            	   AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE020)"
    sql += "                 GROUP BY ITEM, STYCD, MAINSTYCD, MCNT"
    sql += "                )"
    sql += "             GROUP BY ITEM"
    sql += "            )"
    sql += "        UNION ALL"
    sql += "        SELECT 'TOTAL' ITEM, 'TOTAL' CODNM, 0 MCNT, 0 INQTY, 0 INAMT, 0 SOINAMT, 0 SQTY, 0 SILAMT, 0 ACCSQTY, 0 ACCSILAMT,"
    sql += "               MCNT JMCNT, INQTY JINQTY, INAMT JINAMT, SOINAMT JSOINAMT, SQTY JSQTY, SILAMT JSILAMT, ACCSQTY JACCSQTY, ACCSILAMT JACCSILAMT,"
    sql += "    	 	   99 SORTORD"
    sql += "          FROM"
    sql += "            (SELECT ITEM,"
    sql += "            	     SUM(MCNT) AS MCNT,"
    sql += "                   (SUM(INQTY)-SUM(CHINAQTY)) INQTY, ROUND((SUM(INTAGPRI)-SUM(CHINAPRI))/1000) INAMT,"
    sql += "                   SUM(SQTY) SQTY, ROUND(SUM(SILAMT)/1000) SILAMT,"
    sql += "                   SUM(ACCSQTY) ACCSQTY, ROUND(SUM(ACCSILAMT)/1000) ACCSILAMT,"
    sql += "    		 	   SUM(SOINTAGPRI)/1000 SOINAMT"
    sql += "              FROM ("
    sql += "                SELECT ITEM, STYCD, MAINSTYCD,"
    sql += "                   CASE WHEN STYCD = MAINSTYCD AND SUBSTR(STYCD, 8, 1) <> '8' THEN 1 ELSE 0 END AS MCNT,"
    sql += "                   SUM(INQTY) AS INQTY,"
    sql += "                   SUM(INTAGPRI)/1000 AS INTAGPRI,"
    sql += "                   SUM(CASE WHEN INOUTDT >= TO_CHAR(ADD_TIME(TO_DATE('" + lastYearDate + "', 'YYYYMMDD'), '0/0/-6 0:0:0'),'YYYYMMDD') THEN SQTY ELSE 0 END) AS SQTY,"
    sql += "                   SUM(CASE WHEN INOUTDT >= TO_CHAR(ADD_TIME(TO_DATE('" + lastYearDate + "', 'YYYYMMDD'), '0/0/-6 0:0:0'),'YYYYMMDD') THEN SILAMT ELSE 0 END)/1000 AS SILAMT,"
    sql += "                   SUM(SQTY) AS ACCSQTY,"
    sql += "                   SUM(SILAMT)/1000 AS ACCSILAMT,"
    sql += "                   SUM(CHINAQTY) AS CHINAQTY,"
    sql += "                   SUM(CHINAPRI)/1000 AS CHINAPRI,"
    sql += "                   SUM(SOINTAGPRI)/1000 AS SOINTAGPRI"
    sql += "                  FROM BIWE020"
    sql += "                 WHERE COMCD = '" + comcd + "'"
    sql += "                   AND SUCD = '" + selectSucd + "'"
    sql += "                   AND " + brcd
    sql += "            	   AND YSCD BETWEEN '" + fromLastYearSeason + "' AND '" + toLastYearSeason + "'"
    sql += "            	   AND INOUTDT <= '" + lastYearDate + "'"
    sql += "            	   AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE020)"
    sql += "                 GROUP BY ITEM, STYCD, MAINSTYCD, MCNT"
    sql += "                )"
    sql += "             GROUP BY ITEM"
    sql += "            )"
    sql += "        ) A"
    sql += "     GROUP BY A.ITEM, CODNM, A.SORTORD"
    sql += "    )"
    sql += " ORDER BY SORTORD"
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getMonthlySalesData = (req, res) => {
    console.log("============== getMonthlySalesData Call ======================");
    
    let selectSucd = req.query.selectSucd;
    let date = req.query.date;
    let lastYearDate = req.query.lastYearDate;
    let fromSeason = req.query.fromSeason;
    let toSeason = req.query.toSeason;
    let fromLastYearSeason = req.query.fromLastYearSeason;
    let toLastYearSeason = req.query.toLastYearSeason;
    let comcd = 1;
    let brcd;

    let cStartDate = moment(date).year() +'0101'
    let lStartDate = (moment(date).year() -1) +'0101'
    
    if(selectSucd == 3) { // SO 사업부만 selectComcd 2
        comcd = 2
    }

    if(selectSucd == 1) { // MI사업부
        brcd = "BRCD = 'MI'"
    } else if(selectSucd == 12) { // MO사업부
        brcd = "BRCD = 'MI'"
    } else if(selectSucd == 4) { // IT사업부
        brcd = "BRCD = 'IT'"
    } else if(selectSucd == 3) { // SO사업부
        brcd = "BRCD = 'SO'"
    } else if(selectSucd == 21) { // FO사업부
        brcd = "BRCD IN ('MI','IT','SO')"
    }
    
    // 지역 셀렉박스
    let sql = ""     
    sql += " SELECT "
    sql += "        ROUND(NVL(SUM(S01QTY),0)/1000000) AS S01QTY,"
    sql += "        ROUND(NVL(SUM(S02QTY),0)/1000000) AS S02QTY,"
    sql += "        ROUND(NVL(SUM(S03QTY),0)/1000000) AS S03QTY,"
    sql += "        ROUND(NVL(SUM(S04QTY),0)/1000000) AS S04QTY,"
    sql += "        ROUND(NVL(SUM(S05QTY),0)/1000000) AS S05QTY,"
    sql += "        ROUND(NVL(SUM(S06QTY),0)/1000000) AS S06QTY,"
    sql += "        ROUND(NVL(SUM(S07QTY),0)/1000000) AS S07QTY,"
    sql += "        ROUND(NVL(SUM(S08QTY),0)/1000000) AS S08QTY,"
    sql += "        ROUND(NVL(SUM(S09QTY),0)/1000000) AS S09QTY,"
    sql += "        ROUND(NVL(SUM(S10QTY),0)/1000000) AS S10QTY,"
    sql += "        ROUND(NVL(SUM(S11QTY),0)/1000000) AS S11QTY,"
    sql += "        ROUND(NVL(SUM(S12QTY),0)/1000000) AS S12QTY,"
    sql += "        ROUND(NVL(SUM(JS01QTY),0)/1000000) AS JS01QTY,"
    sql += "        ROUND(NVL(SUM(JS02QTY),0)/1000000) AS JS02QTY,"
    sql += "        ROUND(NVL(SUM(JS03QTY),0)/1000000) AS JS03QTY,"
    sql += "        ROUND(NVL(SUM(JS04QTY),0)/1000000) AS JS04QTY,"
    sql += "        ROUND(NVL(SUM(JS05QTY),0)/1000000) AS JS05QTY,"
    sql += "        ROUND(NVL(SUM(JS06QTY),0)/1000000) AS JS06QTY,"
    sql += "        ROUND(NVL(SUM(JS07QTY),0)/1000000) AS JS07QTY,"
    sql += "        ROUND(NVL(SUM(JS08QTY),0)/1000000) AS JS08QTY,"
    sql += "        ROUND(NVL(SUM(JS09QTY),0)/1000000) AS JS09QTY,"
    sql += "        ROUND(NVL(SUM(JS10QTY),0)/1000000) AS JS10QTY,"
    sql += "        ROUND(NVL(SUM(JS11QTY),0)/1000000) AS JS11QTY,"
    sql += "        ROUND(NVL(SUM(JS12QTY),0)/1000000) AS JS12QTY "
    sql += "    FROM ("
    sql += "  SELECT    "
    sql += "  CASE WHEN INOUTDT = '01' THEN STAGPRI END AS S01QTY,"
    sql += "          CASE WHEN INOUTDT = '02' THEN STAGPRI END AS S02QTY,"
    sql += "          CASE WHEN INOUTDT = '03' THEN STAGPRI END AS S03QTY,"
    sql += "          CASE WHEN INOUTDT = '04' THEN STAGPRI END AS S04QTY,"
    sql += "          CASE WHEN INOUTDT = '05' THEN STAGPRI END AS S05QTY,"
    sql += "          CASE WHEN INOUTDT = '06' THEN STAGPRI END AS S06QTY,"
    sql += "          CASE WHEN INOUTDT = '07' THEN STAGPRI END AS S07QTY,"
    sql += "          CASE WHEN INOUTDT = '08' THEN STAGPRI END AS S08QTY,"
    sql += "          CASE WHEN INOUTDT = '09' THEN STAGPRI END AS S09QTY,"
    sql += "          CASE WHEN INOUTDT = '10' THEN STAGPRI END AS S10QTY,"
    sql += "          CASE WHEN INOUTDT = '11' THEN STAGPRI END AS S11QTY,"
    sql += "          CASE WHEN INOUTDT = '12' THEN STAGPRI END AS S12QTY,"
    sql += "          0 JS01QTY, 0 JS02QTY, 0 JS03QTY, 0 JS04QTY, 0 JS05QTY, 0 JS06QTY,"
    sql += "          0 JS07QTY, 0 JS08QTY, 0 JS09QTY, 0 JS10QTY, 0 JS11QTY, 0 JS12QTY "
    sql += "  FROM ("
    sql += "    SELECT COMCD, SUCD, BRCD, SALEGU, SUBSTR(INOUTDT,5,2) AS INOUTDT, SUM(STAGPRI) STAGPRI"
    sql += "    FROM BIWE020   "
    sql += "            WHERE COMCD = '" + comcd + "'"
    sql += "              AND SUCD = '" + selectSucd + "'"
    sql += "              AND " + brcd
    sql += "              AND YSCD BETWEEN '" + fromSeason + "' AND '" + toSeason + "'"
    sql += "              AND INOUTDT BETWEEN '" + cStartDate + "' AND '" + date + "'"
    // sql += "            AND INOUTDT BETWEEN '" + moment(date).subtract(6, 'days').format('YYYYMMDD') + "' AND '" + date + "'"
    // sql += "            AND INOUTDT <= '" + date + "'"
    sql += "          GROUP BY COMCD, SUCD, BRCD, SALEGU, INOUTDT"
    sql += "  )"
    sql += "  UNION All"
    sql += "  SELECT "
    sql += "   0 S01QTY, 0 S02QTY, 0 S03QTY, 0 S04QTY, 0 S05QTY, 0 S06QTY,"
    sql += "             0 S07QTY, 0 S08QTY, 0 S09QTY, 0 S10QTY, 0 S11QTY, 0 S12QTY,"
    sql += "             CASE WHEN INOUTDT = '01' THEN STAGPRI END AS JS01QTY,"
    sql += "             CASE WHEN INOUTDT = '02' THEN STAGPRI END AS JS02QTY,"
    sql += "             CASE WHEN INOUTDT = '03' THEN STAGPRI END AS JS03QTY,"
    sql += "             CASE WHEN INOUTDT = '04' THEN STAGPRI END AS JS04QTY,"
    sql += "             CASE WHEN INOUTDT = '05' THEN STAGPRI END AS JS05QTY,"
    sql += "             CASE WHEN INOUTDT = '06' THEN STAGPRI END AS JS06QTY,"
    sql += "             CASE WHEN INOUTDT = '07' THEN STAGPRI END AS JS07QTY,"
    sql += "             CASE WHEN INOUTDT = '08' THEN STAGPRI END AS JS08QTY,"
    sql += "             CASE WHEN INOUTDT = '09' THEN STAGPRI END AS JS09QTY,"
    sql += "             CASE WHEN INOUTDT = '10' THEN STAGPRI END AS JS10QTY,"
    sql += "             CASE WHEN INOUTDT = '11' THEN STAGPRI END AS JS11QTY,"
    sql += "             CASE WHEN INOUTDT = '12' THEN STAGPRI END AS JS12QTY "
    sql += "  FROM ("
    sql += "    SELECT COMCD, SUCD, BRCD, SALEGU, SUBSTR(INOUTDT,5,2) AS INOUTDT, SUM(STAGPRI) STAGPRI"
    sql += "    FROM BIWE020"
    sql += "            WHERE COMCD = '" + comcd + "'"
    sql += "              AND SUCD = '" + selectSucd + "'"
    sql += "              AND " + brcd
    sql += "              AND YSCD BETWEEN '" + fromLastYearSeason + "' AND '" + toLastYearSeason + "'"
    sql += "              AND INOUTDT BETWEEN '" + lStartDate + "' AND '" + lastYearDate + "'"
    // sql += "            AND INOUTDT BETWEEN '" + moment(lastYearDate).subtract(6, 'days').format('YYYYMMDD') + "' AND '" + lastYearDate + "'"
    // sql += "            AND INOUTDT <= '" + lastYearDate + "'"
    sql += "          GROUP BY COMCD, SUCD, BRCD, SALEGU, INOUTDT"
    sql += "  )"
    sql += "    )"            

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getForeignerData = (req, res) => {
    console.log("============== getForeignerData Call ======================");
    
    let selectSucd = req.query.selectSucd;
    let date = req.query.date;
    let lastYearDate = req.query.lastYearDate;
    let fromSeason = req.query.fromSeason;
    let toSeason = req.query.toSeason;
    let fromLastYearSeason = req.query.fromLastYearSeason;
    let toLastYearSeason = req.query.toLastYearSeason;
    let comcd = 1;
    let brcd;

    let cStartDate = moment(date).year() +'0101'
    let lStartDate = (moment(date).year() -1) +'0101'
    
    if(selectSucd == 3) { // SO 사업부만 selectComcd 2
        comcd = 2
    }

    if(selectSucd == 1) { // MI사업부
        brcd = "BRCD = 'MI'"
    } else if(selectSucd == 12) { // MO사업부
        brcd = "BRCD = 'MI'"
    } else if(selectSucd == 4) { // IT사업부
        brcd = "BRCD = 'IT'"
    } else if(selectSucd == 3) { // SO사업부
        brcd = "BRCD = 'SO'"
    } else if(selectSucd == 21) { // FO사업부
        brcd = "BRCD IN ('MI','IT','SO')"
    }
    
    // 지역 셀렉박스
    let sql = ""    
    sql += " SELECT SALEGUNM,"
    sql += "        ROUND(NVL(SUM(S01QTY),0)/1000000) AS S01QTY,"
    sql += "        ROUND(NVL(SUM(S02QTY),0)/1000000) AS S02QTY,"
    sql += "        ROUND(NVL(SUM(S03QTY),0)/1000000) AS S03QTY,"
    sql += "        ROUND(NVL(SUM(S04QTY),0)/1000000) AS S04QTY,"
    sql += "        ROUND(NVL(SUM(S05QTY),0)/1000000) AS S05QTY,"
    sql += "        ROUND(NVL(SUM(S06QTY),0)/1000000) AS S06QTY,"
    sql += "        ROUND(NVL(SUM(S07QTY),0)/1000000) AS S07QTY,"
    sql += "        ROUND(NVL(SUM(S08QTY),0)/1000000) AS S08QTY,"
    sql += "        ROUND(NVL(SUM(S09QTY),0)/1000000) AS S09QTY,"
    sql += "        ROUND(NVL(SUM(S10QTY),0)/1000000) AS S10QTY,"
    sql += "        ROUND(NVL(SUM(S11QTY),0)/1000000) AS S11QTY,"
    sql += "        ROUND(NVL(SUM(S12QTY),0)/1000000) AS S12QTY,"
    sql += "        ROUND(NVL(SUM(JS01QTY),0)/1000000) AS JS01QTY,"
    sql += "        ROUND(NVL(SUM(JS02QTY),0)/1000000) AS JS02QTY,"
    sql += "        ROUND(NVL(SUM(JS03QTY),0)/1000000) AS JS03QTY,"
    sql += "        ROUND(NVL(SUM(JS04QTY),0)/1000000) AS JS04QTY,"
    sql += "        ROUND(NVL(SUM(JS05QTY),0)/1000000) AS JS05QTY,"
    sql += "        ROUND(NVL(SUM(JS06QTY),0)/1000000) AS JS06QTY,"
    sql += "        ROUND(NVL(SUM(JS07QTY),0)/1000000) AS JS07QTY,"
    sql += "        ROUND(NVL(SUM(JS08QTY),0)/1000000) AS JS08QTY,"
    sql += "        ROUND(NVL(SUM(JS09QTY),0)/1000000) AS JS09QTY,"
    sql += "        ROUND(NVL(SUM(JS10QTY),0)/1000000) AS JS10QTY,"
    sql += "        ROUND(NVL(SUM(JS11QTY),0)/1000000) AS JS11QTY,"
    sql += "        ROUND(NVL(SUM(JS12QTY),0)/1000000) AS JS12QTY "
    sql += "    FROM ("
    sql += "  SELECT    "
    sql += "  CASE WHEN INOUTDT = '01' THEN STAGPRI END AS S01QTY,"
    sql += "          CASE WHEN INOUTDT = '02' THEN STAGPRI END AS S02QTY,"
    sql += "          CASE WHEN INOUTDT = '03' THEN STAGPRI END AS S03QTY,"
    sql += "          CASE WHEN INOUTDT = '04' THEN STAGPRI END AS S04QTY,"
    sql += "          CASE WHEN INOUTDT = '05' THEN STAGPRI END AS S05QTY,"
    sql += "          CASE WHEN INOUTDT = '06' THEN STAGPRI END AS S06QTY,"
    sql += "          CASE WHEN INOUTDT = '07' THEN STAGPRI END AS S07QTY,"
    sql += "          CASE WHEN INOUTDT = '08' THEN STAGPRI END AS S08QTY,"
    sql += "          CASE WHEN INOUTDT = '09' THEN STAGPRI END AS S09QTY,"
    sql += "          CASE WHEN INOUTDT = '10' THEN STAGPRI END AS S10QTY,"
    sql += "          CASE WHEN INOUTDT = '11' THEN STAGPRI END AS S11QTY,"
    sql += "          CASE WHEN INOUTDT = '12' THEN STAGPRI END AS S12QTY,"
    sql += "          0 JS01QTY, 0 JS02QTY, 0 JS03QTY, 0 JS04QTY, 0 JS05QTY, 0 JS06QTY,"
    sql += "          0 JS07QTY, 0 JS08QTY, 0 JS09QTY, 0 JS10QTY, 0 JS11QTY, 0 JS12QTY, SALEGUNM "
    sql += "  FROM ("
    sql += "    SELECT COMCD, SUCD, BRCD, SALEGU, SALEGUNM, SUBSTR(INOUTDT,5,2) AS INOUTDT, SUM(STAGPRI) STAGPRI"
    sql += "    FROM BIWE020   "
    sql += "            WHERE COMCD = '" + comcd + "'"
    sql += "              AND SUCD = '" + selectSucd + "'"
    sql += "              AND " + brcd
    sql += "              AND YSCD BETWEEN '" + fromSeason + "' AND '" + toSeason + "'"
    sql += "              AND INOUTDT BETWEEN '" + cStartDate + "' AND '" + date + "'"
    sql += "              AND SALEGUNM LIKE '외국인%'"
    sql += "          GROUP BY COMCD, SUCD, BRCD, SALEGU, INOUTDT, SALEGUNM"
    sql += "  )"
    sql += "  UNION All"
    sql += "  SELECT "
    sql += "   0 S01QTY, 0 S02QTY, 0 S03QTY, 0 S04QTY, 0 S05QTY, 0 S06QTY,"
    sql += "             0 S07QTY, 0 S08QTY, 0 S09QTY, 0 S10QTY, 0 S11QTY, 0 S12QTY,"
    sql += "             CASE WHEN INOUTDT = '01' THEN STAGPRI END AS JS01QTY,"
    sql += "             CASE WHEN INOUTDT = '02' THEN STAGPRI END AS JS02QTY,"
    sql += "             CASE WHEN INOUTDT = '03' THEN STAGPRI END AS JS03QTY,"
    sql += "             CASE WHEN INOUTDT = '04' THEN STAGPRI END AS JS04QTY,"
    sql += "             CASE WHEN INOUTDT = '05' THEN STAGPRI END AS JS05QTY,"
    sql += "             CASE WHEN INOUTDT = '06' THEN STAGPRI END AS JS06QTY,"
    sql += "             CASE WHEN INOUTDT = '07' THEN STAGPRI END AS JS07QTY,"
    sql += "             CASE WHEN INOUTDT = '08' THEN STAGPRI END AS JS08QTY,"
    sql += "             CASE WHEN INOUTDT = '09' THEN STAGPRI END AS JS09QTY,"
    sql += "             CASE WHEN INOUTDT = '10' THEN STAGPRI END AS JS10QTY,"
    sql += "             CASE WHEN INOUTDT = '11' THEN STAGPRI END AS JS11QTY,"
    sql += "             CASE WHEN INOUTDT = '12' THEN STAGPRI END AS JS12QTY, SALEGUNM "
    sql += "  FROM ("
    sql += "    SELECT COMCD, SUCD, BRCD, SALEGU, SALEGUNM, SUBSTR(INOUTDT,5,2) AS INOUTDT, SUM(STAGPRI) STAGPRI"
    sql += "    FROM BIWE020"
    sql += "            WHERE COMCD = '" + comcd + "'"
    sql += "              AND SUCD = '" + selectSucd + "'"
    sql += "              AND " + brcd
    sql += "              AND YSCD BETWEEN '" + fromLastYearSeason + "' AND '" + toLastYearSeason + "'"
    sql += "              AND INOUTDT BETWEEN '" + lStartDate + "' AND '" + lastYearDate + "'"
    sql += "              AND SALEGUNM LIKE '외국인%'"
    sql += "          GROUP BY COMCD, SUCD, BRCD, SALEGU, SALEGUNM, INOUTDT"
    sql += "  )"
    sql += "    )"
    sql += "    GROUP BY SALEGUNM"
    sql += "    ORDER BY SALEGUNM"    

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getForeignerSumData = (req, res) => {
    console.log("============== getForeignerSumData Call ======================");
    
    let selectSucd = req.query.selectSucd;
    let date = req.query.date;
    let lastYearDate = req.query.lastYearDate;
    let fromSeason = req.query.fromSeason;
    let toSeason = req.query.toSeason;
    let fromLastYearSeason = req.query.fromLastYearSeason;
    let toLastYearSeason = req.query.toLastYearSeason;
    let comcd = 1;
    let brcd;

    let cStartDate = moment(date).year() +'0101'
    let lStartDate = (moment(date).year() -1) +'0101'
    
    if(selectSucd == 3) { // SO 사업부만 selectComcd 2
        comcd = 2
    }

    if(selectSucd == 1) { // MI사업부
        brcd = "BRCD = 'MI'"
    } else if(selectSucd == 12) { // MO사업부
        brcd = "BRCD = 'MI'"
    } else if(selectSucd == 4) { // IT사업부
        brcd = "BRCD = 'IT'"
    } else if(selectSucd == 3) { // SO사업부
        brcd = "BRCD = 'SO'"
    } else if(selectSucd == 21) { // FO사업부
        brcd = "BRCD IN ('MI','IT','SO')"
    }
    
    // 지역 셀렉박스
    let sql = ""    
    sql += " SELECT "
    sql += "        ROUND(NVL(SUM(S01QTY),0)/1000000) AS S01QTY,"
    sql += "        ROUND(NVL(SUM(S02QTY),0)/1000000) AS S02QTY,"
    sql += "        ROUND(NVL(SUM(S03QTY),0)/1000000) AS S03QTY,"
    sql += "        ROUND(NVL(SUM(S04QTY),0)/1000000) AS S04QTY,"
    sql += "        ROUND(NVL(SUM(S05QTY),0)/1000000) AS S05QTY,"
    sql += "        ROUND(NVL(SUM(S06QTY),0)/1000000) AS S06QTY,"
    sql += "        ROUND(NVL(SUM(S07QTY),0)/1000000) AS S07QTY,"
    sql += "        ROUND(NVL(SUM(S08QTY),0)/1000000) AS S08QTY,"
    sql += "        ROUND(NVL(SUM(S09QTY),0)/1000000) AS S09QTY,"
    sql += "        ROUND(NVL(SUM(S10QTY),0)/1000000) AS S10QTY,"
    sql += "        ROUND(NVL(SUM(S11QTY),0)/1000000) AS S11QTY,"
    sql += "        ROUND(NVL(SUM(S12QTY),0)/1000000) AS S12QTY,"
    sql += "        ROUND(NVL(SUM(JS01QTY),0)/1000000) AS JS01QTY,"
    sql += "        ROUND(NVL(SUM(JS02QTY),0)/1000000) AS JS02QTY,"
    sql += "        ROUND(NVL(SUM(JS03QTY),0)/1000000) AS JS03QTY,"
    sql += "        ROUND(NVL(SUM(JS04QTY),0)/1000000) AS JS04QTY,"
    sql += "        ROUND(NVL(SUM(JS05QTY),0)/1000000) AS JS05QTY,"
    sql += "        ROUND(NVL(SUM(JS06QTY),0)/1000000) AS JS06QTY,"
    sql += "        ROUND(NVL(SUM(JS07QTY),0)/1000000) AS JS07QTY,"
    sql += "        ROUND(NVL(SUM(JS08QTY),0)/1000000) AS JS08QTY,"
    sql += "        ROUND(NVL(SUM(JS09QTY),0)/1000000) AS JS09QTY,"
    sql += "        ROUND(NVL(SUM(JS10QTY),0)/1000000) AS JS10QTY,"
    sql += "        ROUND(NVL(SUM(JS11QTY),0)/1000000) AS JS11QTY,"
    sql += "        ROUND(NVL(SUM(JS12QTY),0)/1000000) AS JS12QTY "
    sql += "       FROM ("
    sql += "        SELECT    "
    sql += "        CASE WHEN INOUTDT = '01' THEN STAGPRI END AS S01QTY,"
    sql += "          CASE WHEN INOUTDT = '02' THEN STAGPRI END AS S02QTY,"
    sql += "          CASE WHEN INOUTDT = '03' THEN STAGPRI END AS S03QTY,"
    sql += "          CASE WHEN INOUTDT = '04' THEN STAGPRI END AS S04QTY,"
    sql += "          CASE WHEN INOUTDT = '05' THEN STAGPRI END AS S05QTY,"
    sql += "          CASE WHEN INOUTDT = '06' THEN STAGPRI END AS S06QTY,"
    sql += "          CASE WHEN INOUTDT = '07' THEN STAGPRI END AS S07QTY,"
    sql += "          CASE WHEN INOUTDT = '08' THEN STAGPRI END AS S08QTY,"
    sql += "          CASE WHEN INOUTDT = '09' THEN STAGPRI END AS S09QTY,"
    sql += "          CASE WHEN INOUTDT = '10' THEN STAGPRI END AS S10QTY,"
    sql += "          CASE WHEN INOUTDT = '11' THEN STAGPRI END AS S11QTY,"
    sql += "          CASE WHEN INOUTDT = '12' THEN STAGPRI END AS S12QTY,"
    sql += "          0 JS01QTY, 0 JS02QTY, 0 JS03QTY, 0 JS04QTY, 0 JS05QTY, 0 JS06QTY,"
    sql += "          0 JS07QTY, 0 JS08QTY, 0 JS09QTY, 0 JS10QTY, 0 JS11QTY, 0 JS12QTY "
    sql += "        FROM ("
    sql += "          SELECT COMCD, SUCD, BRCD, SALEGU, SUBSTR(INOUTDT,5,2) AS INOUTDT, SUM(STAGPRI) STAGPRI"
    sql += "          FROM BIWE020   "
    sql += "            WHERE COMCD = '" + comcd + "'"
    sql += "              AND SUCD = '" + selectSucd + "'"
    sql += "              AND " + brcd
    sql += "              AND YSCD BETWEEN '" + fromSeason + "' AND '" + toSeason + "'"
    sql += "              AND INOUTDT BETWEEN '" + cStartDate + "' AND '" + date + "'"
    sql += "              AND SALEGUNM LIKE '외국인%'"
    sql += "            GROUP BY COMCD, SUCD, BRCD, SALEGU, INOUTDT"
    sql += "        )"
    sql += "        UNION All"
    sql += "        SELECT "
    sql += "           0 S01QTY, 0 S02QTY, 0 S03QTY, 0 S04QTY, 0 S05QTY, 0 S06QTY,"
    sql += "               0 S07QTY, 0 S08QTY, 0 S09QTY, 0 S10QTY, 0 S11QTY, 0 S12QTY,"
    sql += "               CASE WHEN INOUTDT = '01' THEN STAGPRI END AS JS01QTY,"
    sql += "               CASE WHEN INOUTDT = '02' THEN STAGPRI END AS JS02QTY,"
    sql += "               CASE WHEN INOUTDT = '03' THEN STAGPRI END AS JS03QTY,"
    sql += "               CASE WHEN INOUTDT = '04' THEN STAGPRI END AS JS04QTY,"
    sql += "               CASE WHEN INOUTDT = '05' THEN STAGPRI END AS JS05QTY,"
    sql += "               CASE WHEN INOUTDT = '06' THEN STAGPRI END AS JS06QTY,"
    sql += "               CASE WHEN INOUTDT = '07' THEN STAGPRI END AS JS07QTY,"
    sql += "               CASE WHEN INOUTDT = '08' THEN STAGPRI END AS JS08QTY,"
    sql += "               CASE WHEN INOUTDT = '09' THEN STAGPRI END AS JS09QTY,"
    sql += "               CASE WHEN INOUTDT = '10' THEN STAGPRI END AS JS10QTY,"
    sql += "               CASE WHEN INOUTDT = '11' THEN STAGPRI END AS JS11QTY,"
    sql += "               CASE WHEN INOUTDT = '12' THEN STAGPRI END AS JS12QTY "
    sql += "        FROM ("
    sql += "          SELECT COMCD, SUCD, BRCD, SALEGU, SUBSTR(INOUTDT,5,2) AS INOUTDT, SUM(STAGPRI) STAGPRI"
    sql += "          FROM BIWE020"
    sql += "            WHERE COMCD = '" + comcd + "'"
    sql += "              AND SUCD = '" + selectSucd + "'"
    sql += "              AND " + brcd
    sql += "              AND YSCD BETWEEN '" + fromLastYearSeason + "' AND '" + toLastYearSeason + "'"
    sql += "              AND INOUTDT BETWEEN '" + lStartDate + "' AND '" + lastYearDate + "'"
    sql += "              AND SALEGUNM LIKE '외국인%'"
    sql += "            GROUP BY COMCD, SUCD, BRCD, SALEGU, INOUTDT"
    sql += "        )"
    sql += "       )"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};

exports.getSalesResultData = (req, res) => {
    console.log("============== getSalesResultData Call ======================");
    
    let selectSucd = req.query.selectSucd;
    let date = req.query.date;
    let lastYearDate = req.query.lastYearDate;
    let comcd = 1;
    let brcd;

    let cStartDate = moment(date).year() +'0101'
    let lStartDate = (moment(date).year() -1) +'0101'
    
    if(selectSucd == 3) { // SO 사업부만 selectComcd 2
        comcd = 2
    }

    if(selectSucd == 1) { // MI사업부
        brcd = "BRCD = 'MI'"
    } else if(selectSucd == 12) { // MO사업부
        brcd = "BRCD = 'MI'"
    } else if(selectSucd == 4) { // IT사업부
        brcd = "BRCD = 'IT'"
    } else if(selectSucd == 3) { // SO사업부
        brcd = "BRCD = 'SO'"
    } else if(selectSucd == 21) { // FO사업부
        brcd = "BRCD IN ('MI','IT','SO')"
    }
    
    // 지역 셀렉박스
    let sql = ""   
    sql += " SELECT YCD,"
    sql += "        NVL(SUM(S01PER),0) AS S01PER,"
    sql += "        NVL(SUM(S02PER),0) AS S02PER,"
    sql += "        NVL(SUM(S03PER),0) AS S03PER,"
    sql += "        NVL(SUM(S04PER),0) AS S04PER,"
    sql += "        NVL(SUM(S05PER),0) AS S05PER,"
    sql += "        NVL(SUM(S06PER),0) AS S06PER,"
    sql += "        NVL(SUM(S07PER),0) AS S07PER,"
    sql += "        NVL(SUM(S08PER),0) AS S08PER,"
    sql += "        NVL(SUM(S09PER),0) AS S09PER,"
    sql += "        NVL(SUM(S10PER),0) AS S10PER,"
    sql += "        NVL(SUM(S11PER),0) AS S11PER,"
    sql += "        NVL(SUM(S12PER),0) AS S12PER,"
    sql += "        NVL(SUM(JS01PER),0) AS JS01PER,"
    sql += "        NVL(SUM(JS02PER),0) AS JS02PER,"
    sql += "        NVL(SUM(JS03PER),0) AS JS03PER,"
    sql += "        NVL(SUM(JS04PER),0) AS JS04PER,"
    sql += "        NVL(SUM(JS05PER),0) AS JS05PER,"
    sql += "        NVL(SUM(JS06PER),0) AS JS06PER,"
    sql += "        NVL(SUM(JS07PER),0) AS JS07PER,"
    sql += "        NVL(SUM(JS08PER),0) AS JS08PER,"
    sql += "        NVL(SUM(JS09PER),0) AS JS09PER,"
    sql += "        NVL(SUM(JS10PER),0) AS JS10PER,"
    sql += "        NVL(SUM(JS11PER),0) AS JS11PER,"
    sql += "        NVL(SUM(JS12PER),0) AS JS12PER "
    sql += "   FROM ("
    sql += "     SELECT MM, YCD,"
    sql += "            CASE WHEN MM = '01' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS S01PER,"
    sql += "            CASE WHEN MM = '02' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS S02PER,"
    sql += "            CASE WHEN MM = '03' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS S03PER,"
    sql += "            CASE WHEN MM = '04' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS S04PER,"
    sql += "            CASE WHEN MM = '05' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS S05PER,"
    sql += "            CASE WHEN MM = '06' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS S06PER,"
    sql += "            CASE WHEN MM = '07' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS S07PER,"
    sql += "            CASE WHEN MM = '08' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS S08PER,"
    sql += "            CASE WHEN MM = '09' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS S09PER,"
    sql += "            CASE WHEN MM = '10' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS S10PER,"
    sql += "            CASE WHEN MM = '11' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS S11PER,"
    sql += "            CASE WHEN MM = '12' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS S12PER,"
    sql += "            0 JS01PER, 0 JS02PER, 0 JS03PER, 0 JS04PER, 0 JS05PER, 0 JS06PER,"
    sql += "            0 JS07PER, 0 JS08PER, 0 JS09PER, 0 JS10PER, 0 JS11PER, 0 JS12PER"
    sql += "       FROM ("
    sql += "         SELECT COMCD, SUCD, BRCD, SUBSTR(INOUTDT,5,2) MM, SUBSTR(YSCD,1,1) AS YCD, SUM(SILAMT) SILAMT, SUM(STAGPRI) STAGPRI"
    sql += "           FROM BIWE020"
    sql += "          WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE020 duration 1day)"
    sql += "            AND COMCD = '" + comcd + "'"
    sql += "            AND SUCD = '" + selectSucd + "'"
    sql += "            AND " + brcd
    sql += "            AND INOUTDT BETWEEN '" + cStartDate + "' AND '" + date + "'"
    sql += "          GROUP BY COMCD, SUCD, BRCD, MM, YCD"
    sql += "         UNION ALL"
    sql += "         SELECT COMCD, SUCD, BRCD, MM, 'ZZ' YCD, SILAMT, STAGPRI"
    sql += "           FROM ("
    sql += "             SELECT COMCD, SUCD, BRCD, SUBSTR(INOUTDT,5,2) MM, SUM(SILAMT) SILAMT, SUM(STAGPRI) STAGPRI"
    sql += "               FROM BIWE020"
    sql += "              WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE020 duration 1day)"
    sql += "              AND COMCD = '" + comcd + "'"
    sql += "              AND SUCD = '" + selectSucd + "'"
    sql += "              AND " + brcd
    sql += "              AND INOUTDT BETWEEN '" + cStartDate + "' AND '" + date + "'"
    sql += "              GROUP BY COMCD, SUCD, BRCD, MM ) )"
    sql += "     UNION ALL"
    sql += "     SELECT MM, YCD,"
    sql += "            0 S01PER, 0 S02PER, 0 S03PER, 0 S04PER, 0 S05PER, 0 S06PER,"
    sql += "            0 S07PER, 0 S08PER, 0 S09PER, 0 S10PER, 0 S11PER, 0 S12PER,"
    sql += "            CASE WHEN MM = '01' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS JS01PER,"
    sql += "            CASE WHEN MM = '02' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS JS02PER,"
    sql += "            CASE WHEN MM = '03' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS JS03PER,"
    sql += "            CASE WHEN MM = '04' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS JS04PER,"
    sql += "            CASE WHEN MM = '05' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS JS05PER,"
    sql += "            CASE WHEN MM = '06' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS JS06PER,"
    sql += "            CASE WHEN MM = '07' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS JS07PER,"
    sql += "            CASE WHEN MM = '08' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS JS08PER,"
    sql += "            CASE WHEN MM = '09' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS JS09PER,"
    sql += "            CASE WHEN MM = '10' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS JS10PER,"
    sql += "            CASE WHEN MM = '11' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS JS11PER,"
    sql += "            CASE WHEN MM = '12' THEN (CASE WHEN STAGPRI = 0 OR SILAMT <= 0 THEN 0 ELSE ROUND((1-SILAMT/STAGPRI)*100) END) END AS JS12PER"
    sql += "       FROM ("
    sql += "         SELECT COMCD, SUCD, BRCD, SUBSTR(INOUTDT,5,2) MM, SUBSTR(YSCD,1,1) AS YCD, SUM(SILAMT) SILAMT, SUM(STAGPRI) STAGPRI"
    sql += "           FROM BIWE020"
    sql += "          WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE020 duration 1day)"
    sql += "            AND COMCD = '" + comcd + "'"
    sql += "            AND SUCD = '" + selectSucd + "'"
    sql += "            AND " + brcd
    sql += "            AND INOUTDT BETWEEN '" + lStartDate + "' AND '" + lastYearDate + "'"
    sql += "          GROUP BY COMCD, SUCD, BRCD, MM, YCD"
    sql += "         UNION ALL"
    sql += "         SELECT COMCD, SUCD, BRCD, MM, 'ZZ' YCD, SILAMT, STAGPRI"
    sql += "           FROM ("
    sql += "             SELECT COMCD, SUCD, BRCD, SUBSTR(INOUTDT,5,2) MM, SUM(SILAMT) SILAMT, SUM(STAGPRI) STAGPRI"
    sql += "               FROM BIWE020"
    sql += "              WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE020 duration 1day)"
    sql += "                AND COMCD = '" + comcd + "'"
    sql += "                AND SUCD = '" + selectSucd + "'"
    sql += "                AND " + brcd
    sql += "                AND INOUTDT BETWEEN '" + lStartDate + "' AND '" + lastYearDate + "'"
    sql += "              GROUP BY COMCD, SUCD, BRCD, MM ) ) )"
    sql += "  GROUP BY YCD"
    sql += "  ORDER BY YCD"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault));
};