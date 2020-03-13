var axios = require('axios');
const db = require('../../config/db')

exports.getOutQty = (req, res) => {
    console.log("============== getOutQty Call ======================");
    let STYCODE = req.query.STYCODE;
    let sucd = req.query.sucd;

    let sql = "SELECT SUM(OUTQTY) OUTQTY FROM BISY021 "
    sql += "WHERE STYCD = '" + STYCODE + "' "
    sql += "AND SUCD = '" + sucd + "' "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getOutInfo = (req, res) => {
    console.log("============== getOutInfo Call ======================");
    let STYCODE = req.query.STYCODE;
    let MAINSTYCD = req.query.MAINSTYCD;
    let sucd = req.query.sucd;

    let sql = "SELECT TO_NUMBER(RESEQ) ORD, SUM(OUTQTY) OUTQTY FROM BISY021 "
    if (MAINSTYCD) {
      sql += "WHERE MAINSTYCD = '" + MAINSTYCD + "' "
    } else {
      sql += "WHERE STYCD = '" + STYCODE + "' "
    }
    sql += "AND SUCD = '" + sucd + "' "
    sql += "GROUP BY ORD "
    sql += "ORDER BY ORD"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStoreQTYData = (req, res) => {
    console.log("============== getStoreQTYData Call ======================");
    let STYCODE = req.query.STYCODE;
    let VDCD = req.query.VDCD;
    let sucd = req.query.sucd;

    let sql = "SELECT COLCD, COLCDNM, SIZE, CASE "
    sql += "WHEN A.OUTQTY > 0 THEN ROUND(A.SQTY/A.OUTQTY * 100, 1) ELSE 0 END AS QTY_RATE FROM "
    sql += "(SELECT STYCD, VDCD, COLCD, COLCDNM, PSIZE || MAX('(') || PSIZENM || MAX(')') SIZE, SUM(SQTY) SQTY, SUM(OUTQTY) OUTQTY FROM BISY021 "
    sql += "WHERE STYCD = '" + STYCODE + "' "; /* 스타일 */
    sql += "AND VDCD = '" + VDCD + "' "  /* 매장 */
    sql += "AND SUCD = '" + sucd + "' "
    sql += "GROUP BY STYCD, VDCD, COLCD, COLCDNM, PSIZE, PSIZENM) A "
    sql += "ORDER BY A.COLCDNM, A.SIZE, A.SQTY, A.OUTQTY "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStoreQTYColSz = (req, res) => {
    console.log("============== getStoreQTYColSz Call ======================");
    let tabType = req.query.tabType;
    let STYCODE = req.query.STYCODE;
    let VDCD = req.query.VDCD;
    let sucd = req.query.sucd;

    // 매장별 재고현황 색상/사이즈
    let sql = "SELECT " + tabType + ", COLCD, COLCDNM || MAX('/') || PSIZE || MAX('(') || PSIZENM || MAX(')') COLSZ, SUM(OUTQTY) OUTQTY, SUM(SQTY) SQTY, SUM(OUTQTY)-SUM(SQTY) STOQTY FROM BISY021 "
    sql += "WHERE STYCD = '" + STYCODE + "' "
    sql += "AND VDCD = '" + VDCD + "' " //셀렉박스 값에 따라 바뀌어야함\
    sql += "AND SUCD = '" + sucd + "' "
    sql += "GROUP BY " + tabType + ", COLCD, COLCDNM, PSIZE, PSIZENM "
    sql += "ORDER BY COLCDNM || MAX('/') || PSIZE || MAX('(') || PSIZENM || MAX(')')"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getColorCode = (req, res) => {
    console.log("============== getColorCode Call ======================");
    let BRCD = req.query.BRCD;

    let sql = "SELECT BRCD, COLCD, COLCDNM, RGBCOLCD  FROM BICM013 "
    sql += "WHERE BRCD = '" + BRCD + "' "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStoreListData = (req, res) => {
    console.log("============== getStoreListData Call ======================");
    let STYCODE = req.query.STYCODE;
    let sucd = req.query.sucd;

    let sql = "SELECT VDCD, VDNM, OUTQTY, SQTY, OUTQTY - SQTY STOQTY, CASE WHEN OUTQTY = 0 THEN 0 ELSE ROUND(SQTY/OUTQTY * 100,0) END AS QTY_RATE FROM "
    sql += "(SELECT VDCD, VDNM, SUM(OUTQTY) OUTQTY, SUM(SQTY) SQTY FROM BISY021 "
    sql += "WHERE STYCD = '" + STYCODE + "' "
    sql += "AND SUCD = '" + sucd + "' "
    sql += "AND VDNM IS NOT NULL "
    sql += "AND VDNM NOT IN ('입고불량','매장불량') "
    sql += "GROUP BY VDCD, VDNM) "
    sql += "ORDER BY SQTY DESC"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getDistributionListData = (req, res) => {
    console.log("============== getDistributionListData Call ======================");
    let STYCODE = req.query.STYCODE;
    let sucd = req.query.sucd;

    let sql = "SELECT B.SHTPNM SHTPNM, A.SQTY ACCSQTY, B.SQTY DISTRISQTY, CASE WHEN A.SQTY = 0 THEN 0 ELSE ROUND(B.SQTY / A.SQTY * 100,1) END AS RESULT FROM (  "
    sql += "SELECT STYCD, SUM(SQTY) SQTY FROM BISY021 "
    sql += "WHERE STYCD = '" + STYCODE + "' "
    sql += "AND SUCD = '" + sucd + "' "
    sql += "GROUP BY STYCD) A, ";
    sql += "(SELECT STYCD, SHTPNM, SUM(SQTY) SQTY FROM BISY021 "
    sql += "WHERE STYCD = '" + STYCODE + "' "
    sql += "AND SUCD = '" + sucd + "' "
    sql += "GROUP BY STYCD, SHTPNM) B "
    sql += "WHERE A.STYCD = B.STYCD "
    sql += "AND   B.SHTPNM IS NOT NULL "
    sql += "ORDER BY B.SHTPNM"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};
