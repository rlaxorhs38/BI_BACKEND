var axios = require('axios');
const db = require('../../config/db')

exports.getStoreCountByType = (req, res, next) => {
    console.log("============== getStoreCountByType Call ======================");
    
    // 매장 형태별 SD Pool
    let sql = "SELECT CHGUCD, CHGUNM, COUNT(CHGUCD) CNT FROM BIHR050 ";
    sql += "WHERE CHGUCD IS NOT NULL ";
    sql += "AND COMPANYCD IN ('1','2') ";
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) ";
    sql += "GROUP BY CHGUCD, CHGUNM ";
    sql += "ORDER BY CHGUCD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getTotalSDCount = (req, res, next) => {
    console.log("============== getTotalSDCount Call ======================");
    let selectedBRCD = req.query.selectedBRCD;
    let selectedCHGUCD = req.query.selectedCHGUCD;
    
    // 브랜드별, 매장형태별 전체 SD 인원수
    let sql = "SELECT COUNT(*) CNT FROM BIHR050 ";
    sql += "WHERE 1=1 ";
    if(selectedBRCD == "all") {
      sql += "AND COMPANYCD IN ('1','2') ";
    } else if(selectedBRCD == "our") {
      sql += "AND COMPANYCD = '1' ";  
    } else if(selectedBRCD == "other"){
      sql += "AND COMPANYCD = '2' ";
    } else {
      sql += "AND COMPANYCD = '1' ";  
      sql += "AND BRCD = '" + selectedBRCD +  "' ";
    }
    if(selectedCHGUCD == 0) {
    } else {
      sql += "AND CHGUCD = '" + selectedCHGUCD +  "' ";  
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) ";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getRegionSDCount = (req, res, next) => {
    console.log("============== getRegionSDCount Call ======================");
    let selectedBRCD = req.query.selectedBRCD;
    let selectedCHGUCD = req.query.selectedCHGUCD;
    
    // 브랜드별, 매장형태별 지역당 SD 인원수
    let sql = "SELECT SI, SUM(CNT) CNT FROM ( ";
    sql += "SELECT SI, 0 AS CNT FROM ( ";
    sql += "SELECT SIDO SI FROM BICM014 ";
    sql += "WHERE CREATEDATE = (SELECT MAX(CREATEDATE) FROM BICM014) ";
    sql += "GROUP BY SI ";
    sql += "ORDER BY SI ";
    sql += ") ";
    sql += "UNION ALL ";
    sql += "SELECT SI, COUNT(SI) CNT FROM BIHR050 ";
    sql += "WHERE 1=1 ";
    if(selectedBRCD == "all") {
      sql += "AND COMPANYCD IN ('1','2') ";
    } else if(selectedBRCD == "our") {
      sql += "AND COMPANYCD = '1' ";  
    } else if(selectedBRCD == "other"){
      sql += "AND COMPANYCD = '2' ";
    } else {
      sql += "AND COMPANYCD = '1' ";  
      sql += "AND BRCD = '" + selectedBRCD +  "' ";
    }
    if(selectedCHGUCD == 0) {
    } else {
      sql += "AND CHGUCD = '" + selectedCHGUCD +  "' ";  
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) ";
    sql += "GROUP BY SI ";
    sql += "ORDER BY SI ";
    sql += ") ";
    sql += "GROUP BY SI "; 
    sql += "ORDER BY CNT DESC";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};