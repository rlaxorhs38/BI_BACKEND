var axios = require('axios');
const db = require('../../config/db')

exports.getMakeDataDate = (req, res) => {
    console.log("============== getMakeDataDate Call ======================");
    
    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BIFN050";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getRecentDate = (req, res) => {
    console.log("============== getRecentDate Call ======================");
    
    let sql = "SELECT MAX(TO_NUMBER(YYYY)) YYYY, MAX(TO_NUMBER(MM)) MM FROM BIFN050 ";
    sql += "WHERE YYYY = (SELECT MAX(YYYY) FROM BIFN050)";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN050)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getMakeDataDate2 = (req, res) => {
    console.log("============== getMakeDataDate2 Call ======================");
    
    let sql = "SELECT TO_CHAR(MAX(CREATEDATE), 'YY.MM.DD HH24:MI') CREATEDATE FROM BIFN051";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getRecentDate2 = (req, res) => {
    console.log("============== getRecentDate2 Call ======================");
    
    let sql = "SELECT MAX(TO_NUMBER(YYYY)) YYYY, MAX(TO_NUMBER(MM)) MM FROM BIFN051 ";
    sql += "WHERE YYYY = (SELECT MAX(YYYY) FROM BIFN051)";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIFN051)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};