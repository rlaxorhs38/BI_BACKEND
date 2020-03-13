var axios = require('axios');
const db = require('../../config/db')

exports.getRegionData = (req, res, next) => {
    console.log("============== getRegionData Call ======================");
    let selectedCODE = req.query.selectedCODE;
    let selectChgucd = req.query.selectChgucd;
    
    // 지역 셀렉박스
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
    if(selectedCODE == 'our'){
        sql += "AND COMPANYCD = '1' ";
    } else if(selectedCODE == 'other'){
        sql += "AND COMPANYCD = '2' ";
    } else {
        sql += "AND BRCD = '" + selectedCODE + "' ";
    }
    if(selectChgucd == '전체') {
    } else {
      sql += "AND CHGUCD = '" + selectChgucd +  "' ";  
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) ";
    sql += "GROUP BY SI ";
    sql += "ORDER BY SI ";
    sql += ") ";
    sql += "GROUP BY SI "; 
    sql += "ORDER BY SI";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSiGuData = (req, res, next) => {
    console.log("============== getSiGuData Call ======================");
    let selectedCODE = req.query.selectedCODE;
    let selectRegion = req.query.selectRegion;
    let selectChgucd = req.query.selectChgucd;
    
    // 시/구 셀렉박스
    let sql = "SELECT SI, GU, COUNT(GU) CNT FROM BIHR050 ";
    sql += "WHERE GU is NOT NULL ";
    if(selectedCODE == 'our'){
      sql += "AND COMPANYCD = '1' ";
    } else if(selectedCODE == 'other'){
      sql += "AND COMPANYCD = '2' ";
    } else {
      sql += "AND BRCD = '" + selectedCODE + "' ";
    }
    if(selectRegion != "전국"){
        sql += "AND SI = '" + selectRegion + "' ";
    } 
    if(selectChgucd == '전체') {
    } else {
      sql += "AND CHGUCD = '" + selectChgucd +  "' ";  
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) ";
    sql += "GROUP BY SI, GU ";
    sql += "ORDER BY SI, GU";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getChageChgucdRegionData = (req, res, next) => {
    console.log("============== getChageChgucdRegionData Call ======================");
    let selectedCODE = req.query.selectedCODE;
    let selectChgucd = req.query.selectChgucd;
    
    // 지역 셀렉박스
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
    if(selectedCODE == 'our'){
        sql += "AND COMPANYCD = '1' ";
    } else if(selectedCODE == 'other'){
        sql += "AND COMPANYCD = '2' ";
    } else {
        sql += "AND BRCD = '" + selectedCODE + "' ";
    }
    if(selectChgucd == '전체') {
    } else {
      sql += "AND CHGUCD = '" + selectChgucd +  "' ";  
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) ";
    sql += "GROUP BY SI ";
    sql += "ORDER BY SI ";
    sql += ") ";
    sql += "GROUP BY SI "; 
    sql += "ORDER BY SI";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getChageChgucdGuData = (req, res, next) => {
    console.log("============== getChageChgucdGuData Call ======================");
    let selectedCODE = req.query.selectedCODE;
    let selectRegion = req.query.selectRegion;
    let selectChgucd = req.query.selectChgucd;
    
    // 시/구 셀렉박스
    let sql = "SELECT SI, GU, COUNT(GU) CNT FROM BIHR050 ";
    sql += "WHERE GU is NOT NULL ";
    if(selectedCODE == 'our'){
      sql += "AND COMPANYCD = '1' ";
    } else if(selectedCODE == 'other'){
      sql += "AND COMPANYCD = '2' ";
    } else {
      sql += "AND BRCD = '" + selectedCODE + "' ";
    }
    if(selectRegion != "전국"){
        sql += "AND SI = '" + selectRegion + "' ";
    } 
    if(selectChgucd == '전체') {
    } else {
      sql += "AND CHGUCD = '" + selectChgucd +  "' ";  
    }
    sql += "GROUP BY SI, GU ";
    sql += "ORDER BY SI, GU";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getVDCDList = (req, res, next) => {
    console.log("============== getVDCDList Call ======================");
    let selectedCODE = req.query.selectedCODE;
    let selectRegion = req.query.selectRegion;
    let selectGu = req.query.selectGu;
    let selectChgucd = req.query.selectChgucd;
    
    // 셀렉박스 조건 선택시 마다 변동하는 매출 테이블로 넘길 SD VDCD코드값
    let sql = "SELECT SNO, VDCD, NAME, COMPANYCD, BRCD, SUCD, SI, GU, CHGUCD FROM BIHR050 ";
    sql += "WHERE 1=1 ";
    if(selectedCODE == 'our'){
      sql += "AND COMPANYCD = '1' ";
    } else if(selectedCODE == 'other'){
      sql += "AND COMPANYCD = '2' ";
    } else {
      sql += "AND BRCD = '" + selectedCODE + "' ";
    }
    if(selectRegion != "전국"){
      sql += "AND SI = '" + selectRegion + "' ";
    }
    if(selectGu != "전체"){
      sql += "AND GU = '" + selectGu + "' ";
    }
    if(selectChgucd != "전체"){
      sql += "AND CHGUCD = '" + selectChgucd + "' ";
    }
    sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050)";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSDInfo = (req, res, next) => {
    console.log("============== getSDInfo Call ======================");
    let selectedCODE = req.body.params.selectedCODE;
    let vdcdData = req.body.params.vdcdData;
    let choice = req.body.params.choice;
    let year = req.body.params.year;
    let month = req.body.params.month;
    
    if (month.toString().length == 1) {
      month = "0" + month
    }

    // SD 매출TOP20
    let sql = "";
    if(selectedCODE == "other"){ // 타사일때
      sql += "SELECT VDCD, SNO, NAME, BRCD, BRNM, SUCD, CHGUCD, CHGUNM, ONEAVGAMT, VDSNM, HRID FROM BIHR050 ";
      sql += "WHERE SNO IN ("
      for (let i=0;i<vdcdData.length;i++) {
          sql += "" + vdcdData[i].SNO + ""
          if (i < vdcdData.length - 1) {
          sql += ","
          }
      }
      sql += ") "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050) ";
      sql += "ORDER BY ONEAVGAMT DESC ";
    } else { // 자사SD전체 및 브랜드일때
        sql += "SELECT B.VDCD VDCD, SNO, NAME, BRCD, SUCD, CHGUCD, CHGUNM, HRID, B.VDSNM VDSNM, TOT_AMT FROM ";
        sql += "(SELECT MVDCD, SUM(TSAMT+ADVDEPAMT) AS TOT_AMT FROM BISH041 ";
        sql += "WHERE 1=1 ";
        if(choice == 1){
            sql += "AND SALEYY = '" + year +"' "
            sql += "AND SALEMM = '" + month +"' "
        } else if (choice == 2){
            sql += "AND SALEYY = '"+ year +"' "
        }
        sql += "AND MVDCD IN ("
        for (let i=0;i<vdcdData.length;i++) {
            sql += "'" + vdcdData[i].VDCD + "'"
            if (i < vdcdData.length - 1) {
            sql += ","
            }
        }
        sql += ") "
        sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) ";
        sql += "GROUP BY MVDCD)A, ";
        sql += "(SELECT VDCD, VDSNM, SNO, NAME, BRCD, SUCD, CHGUCD, CHGUNM, HRID FROM BIHR050 ";
        sql += "WHERE COMPANYCD = '1' "
        sql += "AND VDCD IN ("
        for (let i=0;i<vdcdData.length;i++) {
            sql += "'" + vdcdData[i].VDCD + "'"
            if (i < vdcdData.length - 1) {
            sql += ","
            }
        }
        sql += ") "
        sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050))B ";
        sql += "WHERE A.MVDCD = B.VDCD ";
        sql += "ORDER BY TOT_AMT DESC ";
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};