var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res) => {
    console.log("============== getMakeDataDate Call ======================");
    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD') CREATEDATE FROM BIWE030"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSaleRate = (req, res) => {
    console.log("============== getPQTY Call ======================");

    let selectSucd = req.body.params.selectSucd
    let selectComcd = 1
    let brcd

    let seasonStartYear = req.body.params.seasonStartYear
    let seasonStartMonth = req.body.params.seasonStartMonth
    let seasonEndYear = req.body.params.seasonEndYear
    let seasonEndMonth = req.body.params.seasonEndMonth

    let seasonStart = seasonStartYear + seasonStartMonth
    let seasonEnd = seasonEndYear + seasonEndMonth

    let paramStartDate = req.body.params.paramStartDate
    let paramEndDate = req.body.params.paramEndDate

    if(selectSucd == 3) { // SO 사업부만 selectComcd 2
        selectComcd = 2
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

    let sql = "SELECT PQTY, PAMT, INQTY, INAMT, SQTY, SILAMT, STOCK, STOCKAMT, "
    sql += "CASE WHEN INQTY = 0 THEN 0 ELSE ROUND(SQTY/INQTY ,2)*100 END SALERATE, "
    sql += "CASE WHEN SQTY = 0 THEN 0 ELSE ROUND(SILAMT/SQTY) END AVGPRI FROM ( "
    sql += "SELECT SUM(PQTY) PQTY, "
    sql += "SUM(PQTY)*TAGPRI PAMT, "
    sql += "SUM(INQTY) INQTY, "
    sql += "SUM(INAMT) INAMT, "
    sql += "SUM(SQTY) SQTY, "
    sql += "SUM(SILAMT) SILAMT, "
    sql += "SUM(INQTY) - (SUM(SQTY)+SUM(CHINASQTY)) STOCK, "
    sql += "(SUM(INQTY) - (SUM(SQTY)+SUM(CHINASQTY)))*TAGPRI STOCKAMT "
    sql += "FROM BIWE030 "
    sql += "WHERE MAINSTYCD IN (SELECT MAINSTYCD "
    sql += "FROM (SELECT SUM(SQTY) SQTY, "
    sql += "ROWNUM() RN, "
    sql += "MAINSTYCD "
    sql += "FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramStartDate+"' AND '"+paramEndDate+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += "GROUP BY MAINSTYCD, RN "
    sql += "ORDER BY SQTY DESC ) "
    sql += "WHERE RN < 21 ) "
    sql += ")"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getWeeklyBestSale = (req, res) => {
    console.log("============== getPQTY Call ======================");

    let selectSucd = req.body.params.selectSucd
    let selectComcd = 1
    let brcd

    let seasonStartYear = req.body.params.seasonStartYear
    let seasonStartMonth = req.body.params.seasonStartMonth
    let seasonEndYear = req.body.params.seasonEndYear
    let seasonEndMonth = req.body.params.seasonEndMonth

    let seasonStart = seasonStartYear + seasonStartMonth
    let seasonEnd = seasonEndYear + seasonEndMonth

    let paramStartDate = req.body.params.paramStartDate
    let paramEndDate = req.body.params.paramEndDate
    let paramBe1StartDate = req.body.params.paramBe1StartDate
    let paramBe1EndDate = req.body.params.paramBe1EndDate
    let paramBe2StartDate = req.body.params.paramBe2StartDate
    let paramBe2EndDate = req.body.params.paramBe2EndDate

    if(selectSucd == 3) { // SO 사업부만 selectComcd 2
        selectComcd = 2
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

    let sql = "SELECT TOTSQTY, SQTY, CASE WHEN TOTSQTY = 0 THEN 0 ELSE ROUND(SILAMT/TOTSILAMT ,2)*100 END RATE, TOTSILAMT, SILAMT FROM ( "
    sql += "SELECT SUM(TOTSQTY) TOTSQTY, SUM(TOTSILAMT) TOTSILAMT, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM ( "
    sql += "SELECT MAINSTYCD, 0 TOTSQTY, SQTY SQTY, 0 TOTSILAMT, SILAMT SILAMT FROM ( "
    sql += "SELECT SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, ROWNUM() RN, MAINSTYCD FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramStartDate+"' AND '"+paramEndDate+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += "GROUP BY MAINSTYCD, RN "
    sql += "ORDER BY SQTY DESC ) "
    sql += "WHERE RN < 21 "
    sql += "UNION ALL "
    sql += "SELECT MAINSTYCD, SQTY TOTSQTY, 0 SQTY, SILAMT TOTSILAMT, 0 SILAMT FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramStartDate+"' AND '"+paramEndDate+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += ") "
    sql += ") "
    sql += "UNION ALL "
    sql += "SELECT TOTSQTY, SQTY, CASE WHEN TOTSQTY = 0 THEN 0 ELSE ROUND(SILAMT/TOTSILAMT ,2)*100 END RATE, TOTSILAMT, SILAMT FROM ( "
    sql += "SELECT SUM(TOTSQTY) TOTSQTY, SUM(TOTSILAMT) TOTSILAMT, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM ( "
    sql += "SELECT MAINSTYCD, 0 TOTSQTY, SQTY SQTY, 0 TOTSILAMT, SILAMT SILAMT FROM ( "
    sql += "SELECT SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, ROWNUM() RN, MAINSTYCD FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramBe1StartDate+"' AND '"+paramBe1EndDate+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += "GROUP BY MAINSTYCD, RN "
    sql += "ORDER BY SQTY DESC ) "
    sql += "WHERE RN < 21 "
    sql += "UNION ALL "
    sql += "SELECT MAINSTYCD, SQTY TOTSQTY, 0 SQTY, SILAMT TOTSILAMT, 0 SILAMT FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramBe1StartDate+"' AND '"+paramBe1EndDate+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += ")"
    sql += ")"
    sql += "UNION ALL "
    sql += "SELECT TOTSQTY, SQTY, CASE WHEN TOTSQTY = 0 THEN 0 ELSE ROUND(SILAMT/TOTSILAMT ,2)*100 END RATE, TOTSILAMT, SILAMT FROM ( "
    sql += "SELECT SUM(TOTSQTY) TOTSQTY, SUM(TOTSILAMT) TOTSILAMT, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM ( "
    sql += "SELECT MAINSTYCD, 0 TOTSQTY, SQTY SQTY, 0 TOTSILAMT, SILAMT SILAMT FROM ( "
    sql += "SELECT SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, ROWNUM() RN, MAINSTYCD FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramBe2StartDate+"' AND '"+paramBe2EndDate+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += "GROUP BY MAINSTYCD, RN "
    sql += "ORDER BY SQTY DESC ) "
    sql += "WHERE RN < 21 "
    sql += "UNION ALL "
    sql += "SELECT MAINSTYCD, SQTY TOTSQTY, 0 SQTY, SILAMT TOTSILAMT, 0 SILAMT FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramBe2StartDate+"' AND '"+paramBe2EndDate+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += ")"
    sql += ")"


    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getMCount = (req, res) => {
    console.log("============== getMCount Call ======================");

    let selectSucd = req.body.params.selectSucd
    let selectComcd = 1
    let brcd

    let seasonStartYear = req.body.params.seasonStartYear
    let seasonStartMonth = req.body.params.seasonStartMonth
    let seasonEndYear = req.body.params.seasonEndYear
    let seasonEndMonth = req.body.params.seasonEndMonth

    let seasonStart = seasonStartYear + seasonStartMonth
    let seasonEnd = seasonEndYear + seasonEndMonth

    let paramStartDate = req.body.params.paramStartDate
    let paramEndDate = req.body.params.paramEndDate

    if(selectSucd == 3) { // SO 사업부만 selectComcd 2
        selectComcd = 2
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

    let sql = "SELECT CNT, SILAMT, ITEM, TOTSILAMT, "
    sql += "CASE WHEN TOTSILAMT = 0 THEN 0 ELSE ROUND(SILAMT/TOTSILAMT ,3)*100 END RATE FROM ( "
    sql += "SELECT CNT, SILAMT, ITEM, "
    sql += "(SELECT SUM(SILAMT) TOTSILAMT FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramStartDate+"' AND '"+paramEndDate+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030)) TOTSILAMT "
    sql += "FROM ( "
    sql += "SELECT COUNT(ITEM) CNT, SUM(SILAMT) SILAMT , ITEM FROM ( "
	sql += "SELECT  ITEM,SQTY SQTY, SILAMT SILAMT FROM ( "
    sql += "SELECT SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, ROWNUM() RN, MAINSTYCD, ITEM FROM BIWE030 "
	sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramStartDate+"' AND '"+paramEndDate+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += "GROUP BY MAINSTYCD, ITEM, RN "
    sql += "ORDER BY SQTY DESC "
	sql += ") "
    sql += "WHERE RN < 21 "
    sql += ") "
    sql += "GROUP BY ITEM "
    sql += ") "
    sql += ") "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};


exports.getMaxCnt = (req, res) => {
    console.log("============== getMaxCnt Call ======================");

    let sql = "SELECT MAX(CNT) MAXCNT FROM ( "
    sql += "SELECT MAINSTYCD, COUNT(MAINSTYCD) CNT FROM ( "
    sql += "SELECT MAINSTYCD, STYCD, COLCD FROM BIWE030 "
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += "GROUP BY MAINSTYCD, STYCD, COLCD "
    sql += "ORDER BY MAINSTYCD, STYCD, COLCD "
    sql += ") "
    sql += "GROUP BY MAINSTYCD "
    sql += "ORDER BY  CNT DESC "
    sql += ")"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStyle20 = (req, res) => {
    console.log("============== getStyle20 Call ======================");

    let selectSucd = req.body.params.selectSucd
    let selectComcd = 1
    let brcd

    let seasonStartYear = req.body.params.seasonStartYear
    let seasonStartMonth = req.body.params.seasonStartMonth
    let seasonEndYear = req.body.params.seasonEndYear
    let seasonEndMonth = req.body.params.seasonEndMonth

    let seasonStart = seasonStartYear + seasonStartMonth
    let seasonEnd = seasonEndYear + seasonEndMonth

    let paramStartDate = req.body.params.paramStartDate
    let paramEndDate = req.body.params.paramEndDate

    if(selectSucd == 3) { // SO 사업부만 selectComcd 2
        selectComcd = 2
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
    
    let sql = "SELECT MAINSTYCD, DIMAGEPATH, SOJAENM, CUSTNM, SUBSTR(OUTDT,1,4)||'-'||SUBSTR(OUTDT,5,2)||'-'||SUBSTR(OUTDT,7,2) OUTDT, TAGPRI, SQTY FROM ( "
    sql += "SELECT MAINSTYCD, DIMAGEPATH, SOJAENM, CUSTNM, MIN(OUTDT) OUTDT, TAGPRI, SUM(SQTY) SQTY "
    sql += "FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramStartDate+"' AND '"+paramEndDate+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += "GROUP BY MAINSTYCD, DIMAGEPATH, SOJAENM, CUSTNM, TAGPRI "
    sql += "ORDER BY SQTY DESC"
    sql += ")"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStyle20VDSNM = (req, res) => {
    console.log("============== getStyle20VDSNM Call ======================");

    let selectSucd = req.body.params.selectSucd
    let mainStycd = req.body.params.mainStycd
    let selectComcd = 1
    let brcd

    let seasonStartYear = req.body.params.seasonStartYear
    let seasonStartMonth = req.body.params.seasonStartMonth
    let seasonEndYear = req.body.params.seasonEndYear
    let seasonEndMonth = req.body.params.seasonEndMonth

    let seasonStart = seasonStartYear + seasonStartMonth
    let seasonEnd = seasonEndYear + seasonEndMonth

    let paramStartDate = req.body.params.paramStartDate
    let paramEndDate = req.body.params.paramEndDate

    if(selectSucd == 3) { // SO 사업부만 selectComcd 2
        selectComcd = 2
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
    
    let sql = "SELECT COUNT(*) RN, MAX('TOTCNT') AS VDCD, SUM(0) AS SQTY  FROM ( "
    sql += "SELECT VDCD "
    sql += "FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramStartDate+"' AND '"+paramEndDate+"' "
    sql += "AND MAINSTYCD = '"+mainStycd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += "AND SQTY > 0 "
    sql += ") "
    sql += "UNION ALL "
    sql += "SELECT SUM(0) AS RN, VDSNM, SUM(SQTY) SQTY "
    sql += "FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramStartDate+"' AND '"+paramEndDate+"' "
    sql += "AND MAINSTYCD = '"+mainStycd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += "AND SQTY > 0 "
    sql += "GROUP BY VDSNM "
    sql += "ORDER BY SQTY DESC"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStyle20COLOR = (req, res) => {
    console.log("============== getStyle20COLOR Call ======================");

    let selectSucd = req.body.params.selectSucd
    let mainStycd = req.body.params.mainStycd
    let selectComcd = 1
    let brcd

    let seasonStartYear = req.body.params.seasonStartYear
    let seasonStartMonth = req.body.params.seasonStartMonth
    let seasonEndYear = req.body.params.seasonEndYear
    let seasonEndMonth = req.body.params.seasonEndMonth

    let seasonStart = seasonStartYear + seasonStartMonth
    let seasonEnd = seasonEndYear + seasonEndMonth

    let paramStartDate = req.body.params.paramStartDate
    let paramEndDate = req.body.params.paramEndDate

    let startDayMoment = moment(paramStartDate, 'YYYYMMDD')
    let endDayMoment = moment(paramEndDate, 'YYYYMMDD')

    let lastWeekTo = endDayMoment.clone().subtract(1, 'week').format('YYYYMMDD')
    let lastWeekFrom = startDayMoment.clone().subtract(1, 'week').format('YYYYMMDD')

    if(selectSucd == 3) { // SO 사업부만 selectComcd 2
        selectComcd = 2
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
    
    let sql = "SELECT MAINSTYCD, "
    sql += "STYCD, "
    sql += "COLCD, "
    sql += "SOJAENM, "
    sql += "CUSTNM, "
    sql += "MIN(OUTDT) OUTDT, "
    sql += "MAX(TAGPRI) TAGPRI, "
    sql += "SUM(PQTY) PQTY, "
    sql += "SUM(PQTY) * MAX(TAGPRI) PQTYAMT, "
    sql += "SUM(INQTY) INQTY, "
    sql += "SUM(INAMT) INAMT, "
    sql += "SUM(CHINASQTY) CHINASQTY, "
    sql += "SUM(CHINAAMT) CHINAAMT, "
    sql += "SUM(ONLINESQTY) ONLINESQTY, "
    sql += "SUM(ONLINEAMT) ONLINEAMT, "
    sql += "SUM(PSQTY) PSQTY, "
    sql += "SUM(PSILAMT) PSILAMT, "
    sql += "SUM(SQTY) SQTY, "
    sql += "SUM(SILAMT) SILAMT, "
    sql += "SUM(TOTSQTY) TOTSQTY, "
    sql += "SUM(TOTSILAMT) TOTSILAMT, "
    sql += "SUM(INQTY) - (SUM(TOTSQTY)+SUM(CHINASQTY)) STOCK, "
    sql += "(SUM(INQTY) - (SUM(TOTSQTY)+SUM(CHINASQTY))) * MAX(TAGPRI) STOCKAMT, "
    sql += "CASE WHEN SUM(INQTY)-SUM(CHINASQTY)=0 THEN 0 ELSE ROUND(SUM(TOTSQTY)/(SUM(INQTY)-SUM(CHINASQTY)),2)*100 END SALES "
    sql += "FROM ( "
    sql += "SELECT MAINSTYCD, "
    sql += "STYCD, "
    sql += "COLCD, "
    sql += "SOJAENM, "
    sql += "CUSTNM, "
    sql += "OUTDT, "
    sql += "TAGPRI, "
    sql += "PQTY, "
    sql += "INQTY, "
    sql += "INAMT, "
    sql += "0 AS SQTY, "
    sql += "0 AS SILAMT, "
    sql += "ONLINESQTY, "
    sql += "ONLINEAMT, "
    sql += "CHINASQTY, "
    sql += "CHINAAMT, "
    sql += "SQTY AS TOTSQTY, "
    sql += "SILAMT AS TOTSILAMT, "
    sql += "0 AS PSQTY, "
    sql += "0 AS PSILAMT "
    sql += "FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND MAINSTYCD = '"+mainStycd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += "UNION ALL "
    sql += "SELECT MAINSTYCD, "
    sql += "STYCD, "
    sql += "COLCD, "
    sql += "SOJAENM, "
    sql += "CUSTNM, "
    sql += "OUTDT, "
    sql += "TAGPRI, "
    sql += "0 AS PQTY, "
    sql += "0 AS INQTY, "
    sql += "0 AS INAMT, "
    sql += "SQTY, "
    sql += "SILAMT, "
    sql += "0 AS ONLINESQTY, "
    sql += "0 AS ONLINEAMT, "
    sql += "0 AS CHINASQTY, "
    sql += "0 AS CHINAAMT, "
    sql += "0 AS TOTSQTY, "
    sql += "0 AS TOTSILAMT, "
    sql += "0 AS PSQTY, "
    sql += "0 AS PSILAMT "
    sql += "FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+paramStartDate+"' AND '"+paramEndDate+"' "
    sql += "AND MAINSTYCD = '"+mainStycd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += "UNION ALL "
    sql += "SELECT MAINSTYCD, "
    sql += "STYCD, "
    sql += "COLCD, "
    sql += "SOJAENM, "
    sql += "CUSTNM, "
    sql += "OUTDT, "
    sql += "TAGPRI, "
    sql += "0 AS PQTY, "
    sql += "0 AS INQTY, "
    sql += "0 AS INAMT, "
    sql += "0 AS SQTY, "
    sql += "0 AS SILAMT, "
    sql += "0 AS ONLINESQTY, "
    sql += "0 AS ONLINEAMT, "
    sql += "0 AS CHINASQTY, "
    sql += "0 AS CHINAAMT, "
    sql += "0 AS TOTSQTY, "
    sql += "0 AS TOTSILAMT, "
    sql += "SQTY AS PSQTY, "
    sql += "SILAMT AS PSILAMT "
    sql += "FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND YSCD BETWEEN '"+seasonStart+"' AND '"+seasonEnd+"' "
    sql += "AND INOUTDT BETWEEN '"+lastWeekFrom+"' AND '"+lastWeekTo+"' "
    sql += "AND MAINSTYCD = '"+mainStycd+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += ") "
    sql += "GROUP BY MAINSTYCD, "
    sql += "STYCD, "
    sql += "COLCD, "
    sql += "SOJAENM, "
    sql += "CUSTNM "
    sql += "ORDER BY STYCD"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

