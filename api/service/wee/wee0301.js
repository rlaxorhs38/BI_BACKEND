var axios = require('axios');
const db = require('../../config/db')

exports.MakeDataDate = (req, res) => {
    console.log("============== MakeDataDate Call ======================");
    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD') CREATEDATE FROM BIWE030"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStyle = (req, res) => {
    console.log("============== getStyle Call ======================");

    let selectSucd = req.body.params.selectSucd
    let selectComcd = 1
    let brcd

    let paramOutFromDate = req.body.params.paramOutFromDate
    let paramOutToDate = req.body.params.paramOutToDate
    let paramStFromDate = req.body.params.paramStFromDate
    let paramStToDate = req.body.params.paramStToDate

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
    
    let sql = "SELECT STYCD, DIMAGEPATH, SOJAENM, CUSTNM, SUBSTR(OUTDT,1,4)||'-'||SUBSTR(OUTDT,5,2)||'-'||SUBSTR(OUTDT,7,2) OUTDT, TAGPRI, SQTY FROM ( "
    sql += "SELECT STYCD, DIMAGEPATH, SOJAENM, CUSTNM, MIN(OUTDT) OUTDT, TAGPRI, SUM(SQTY) SQTY "
    sql += "FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND OUTDT BETWEEN '"+paramOutFromDate+"' AND '"+paramOutToDate+"' "
    sql += "AND INOUTDT BETWEEN '"+paramStFromDate+"' AND '"+paramStToDate+"' "
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIWE030) "
    sql += "GROUP BY STYCD, DIMAGEPATH, SOJAENM, CUSTNM, TAGPRI "
    sql += "ORDER BY SQTY DESC"
    sql += ")"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStyleDetail = (req, res) => {
    console.log("============== getStyleDetail Call ======================");

    let selectSucd = req.body.params.selectSucd
    let selectComcd = 1
    let stycd = req.body.params.stycd
    let brcd

    let paramOutFromDate = req.body.params.paramOutFromDate
    let paramOutToDate = req.body.params.paramOutToDate
    let paramStFromDate = req.body.params.paramStFromDate
    let paramStToDate = req.body.params.paramStToDate

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
    
    let sql = "SELECT STYCD, SOJAENM, CUSTNM, TAGPRI, COLCD, TOTPQTY, INQTY, CHINASQTY, DOMPQTY, DOMQTY, UNSTOCKED, SQTY, SALES, OUTDT, "
    sql += "SUBSTR(OUTDT,3,2)||'-'||SUBSTR(OUTDT,5,2)||'-'||SUBSTR(OUTDT,7,2) CONVERT_OUTDT, STOCK FROM ( "
    sql += "SELECT STYCD, "
    sql += "SOJAENM, "
    sql += "CUSTNM, "
    sql += "TAGPRI, "
    sql += "COLCD, "
    sql += "SUM(PQTY) TOTPQTY, "
    sql += "SUM(INQTY) INQTY, "
    sql += "SUM(CHINASQTY) CHINASQTY, "
    sql += "SUM(PQTY) DOMPQTY, "
    sql += "SUM(INQTY) - SUM(CHINASQTY) DOMQTY, "
    sql += "SUM(PQTY) - SUM(INQTY) UNSTOCKED, "
    sql += "SUM(SQTY) SQTY, "
    sql += "CASE WHEN SUM(INQTY) - SUM(CHINASQTY) = 0 THEN 0 ELSE ROUND(SUM(SQTY)/(SUM(INQTY) - SUM(CHINASQTY)) * 100,1) END SALES, "
    sql += "OUTDT, "
    sql += "(SUM(INQTY) - SUM(CHINASQTY)) - SUM(SQTY) STOCK "
    sql += "FROM(SELECT STYCD, "
    sql += "SOJAENM, "
    sql += "CUSTNM, "
    sql += "TAGPRI, "
    sql += "COLCD, "
    sql += "0 AS PQTY, "
    sql += "0 AS INQTY, "
    sql += "0 AS CHINASQTY, "
    sql += "SQTY, "
    sql += "OUTDT "
    sql += "FROM BIWE030 "
    sql += "WHERE OUTDT BETWEEN '"+paramOutFromDate+"' AND '"+paramOutToDate+"' "
    sql += "AND INOUTDT BETWEEN '"+paramStFromDate+"' AND '"+paramStToDate+"' "
    sql += "AND "+brcd+" "
    sql += "AND STYCD = '"+stycd+"' "
    sql += "UNION ALL "
    sql += "SELECT STYCD, "
    sql += "SOJAENM, "
    sql += "CUSTNM, "
    sql += "TAGPRI, "
    sql += "COLCD, "
    sql += "PQTY, "
    sql += "INQTY, "
    sql += "CHINASQTY, "
    sql += "0 AS SQTY, "
    sql += "OUTDT "
    sql += "FROM BIWE030 "
    sql += "WHERE "+brcd+" "
    sql += "AND STYCD = '"+stycd+"' "
    sql += "AND OUTDT IS NOT NULL ) "
    sql += "GROUP BY STYCD, OUTDT, SOJAENM, CUSTNM, TAGPRI ,COLCD "
    sql += ")"
    console.log("============== 출고일 ======================"+sql);
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStyleStore = (req, res) => {
    console.log("============== getStyleStore Call ======================");

    let selectSucd = req.body.params.selectSucd
    let selectComcd = 1
    let stycd = req.body.params.stycd
    let brcd

    let paramOutFromDate = req.body.params.paramOutFromDate
    let paramOutToDate = req.body.params.paramOutToDate
    let paramStFromDate = req.body.params.paramStFromDate
    let paramStToDate = req.body.params.paramStToDate

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

    let sql = "SELECT VDSNM, SUM(SQTY) SQTY "
    sql += "FROM BIWE030 "
    sql += "WHERE COMCD = '"+selectComcd+"' "
    sql += "AND SUCD = '"+selectSucd+"' "
    sql += "AND "+brcd+" "
    sql += "AND OUTDT BETWEEN '"+paramOutFromDate+"' AND '"+paramOutToDate+"' "
    sql += "AND INOUTDT BETWEEN '"+paramStFromDate+"' AND '"+paramStToDate+"' "
    sql += "AND STYCD = '"+stycd+"' "
    sql += "AND SQTY > 0 "
    sql += "GROUP BY VDSNM "
    sql += "ORDER BY SQTY DESC "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};



