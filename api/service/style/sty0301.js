var axios = require('axios');
const db = require('../../config/db')

exports.getStoreKind = (req, res) => {
    console.log("============== getStoreKind Call ======================");
    let changeSucd = req.query.changeSucd;
    let sucd = req.query.sucd;
    let cloneSucd = req.query.cloneSucd;

    let sql = "SELECT SHTP, SHTPNM FROM BISY021 "
    sql += "WHERE 1=1 "
    if(changeSucd){ // 필터자체에서 사업부 변경
      sql += "AND SUCD = '" + sucd + "' "
    } else { // 리스트에서 사업부 변경
      sql += "AND SUCD = '" + cloneSucd + "' "
    }
    sql += "AND SHTP IS NOT NULL "
    sql += "GROUP BY SHTP, SHTPNM"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getstoreList = (req, res) => {
    console.log("============== getstoreList Call ======================");
    let changeSucd = req.query.changeSucd;
    let sucd = req.query.sucd;
    let cloneSucd = req.query.cloneSucd;
    let changeStore = req.query.changeStore;

    let sql = "SELECT VDCD, VDNM FROM BISY021 "
    sql += "WHERE 1=1 "
    if(changeSucd){ // 팝업 화면에서 사업부 바꿧을때 매장 리셋
      sql += "AND SUCD = '" + sucd + "' "
    } else { // 리스트 화면에서 사업부 바꿧을때 매장 리셋
      sql += "AND SUCD = '" + cloneSucd + "' "
    }
    sql += "AND VDCD IS NOT NULL "
    if(changeStore != "STOKINDALL"){
      sql += "AND SHTP = '" + changeStore + "' "
    }
    sql += "GROUP BY VDCD, VDNM "
    sql += "ORDER BY VDNM"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getClothCodeList = (req, res) => {
    console.log("============== getClothCodeList Call ======================");
    
    let sql = "SELECT * FROM BICM011 "
    sql += "WHERE GBNCD = 'MC027' "
    sql += "AND USEYN = 'Y' "
    sql += "ORDER BY CODE"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getFabricsCodeList = (req, res) => {
    console.log("============== getFabricsCodeList Call ======================");

    let sql = "SELECT * FROM BICM011 "
    sql += "WHERE GBNCD = 'MC026' "
    sql += "AND USEYN = 'Y' "
    sql += "ORDER BY CODE "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};


exports.getColorsCodeList = (req, res) => {
  console.log("============== getColorsCodeList Call ======================");

  let sql = "SELECT * FROM BICM013 "
  sql += "WHERE BRCD = 'MI' "
  sql += "ORDER BY COLCD "

  axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};