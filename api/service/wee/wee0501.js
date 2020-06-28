var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.getSaleListByBrand = (req, res) => {
    console.log("============== getSaleListByBrand Call ======================");

    let yyyy = req.query.yyyy;
    let mm = req.query.mm;
    let week = req.query.week;

    let sql = "SELECT   COMCD, SUCD, ";
    sql += "            DECODE(SUCD, '1', 'MI', '12', 'MO', '4', 'IT', '3', 'SO', '5', 'SO', '21', 'FO') AS BRCD,  ";
    sql += "            YYYY, MM, WEEK, FROM_SALEDT, TO_SALEDT, SALEGU, ";
    sql += "            MONPLNAMT, MONAMT, PLNRATE, WEEKPLNAMT, WEEKAMT, MONRATE, WEEKRATE, PREMONAMT, PREWEEKAMT, MONAVERAGE, WEEKAVERAGE, NEXTWEEKPLNAMT, MONSUMPLNAMT, ";
    sql += "            DECODE(SUCD, '1', '1', '12', '2', '4', '3', '3', '4', '5', '4', '21', '5') AS SORT ";
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

    let sql = "SELECT  COMCD, SUCD,  ";
    sql += "        DECODE(SUCD, '1', 'MI', '12', 'MO', '4', 'IT', '3', 'SO', '5', 'SO', '21', 'FO') AS BRCD,  ";
    sql += "        YYYY, MM, WEEK, FROM_SALEDT, TO_SALEDT, PROGRESS, PLAN, TEMP_SAVE, ";
    sql += "        DECODE(SUCD, '1', '1', '12', '2', '4', '3', '3', '4', '5', '4', '21', '5') AS SORT ";
    sql += "FROM BIWE051 ";
    sql += "WHERE TEMP_SAVE = '3' ";
    sql += "AND SNO IN (SELECT MAX(SNO) FROM BIWE051 ";
    sql += "            WHERE YYYY = '" + yyyy + "' ";
    sql += "            AND MM = '" + mm + "' ";
    sql += "            AND WEEK = '" + week + "' ";
    sql += "            GROUP BY COMCD, SUCD, BRCD) ";
    sql += "ORDER BY SORT ";

    console.log("getProgressData >>>", sql);

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};