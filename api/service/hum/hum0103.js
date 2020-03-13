var axios = require('axios');
const db = require('../../config/db')

exports.getSDSalesData = (req, res, next) => {
    console.log("============== getSDSalesData Call ======================");
    let selectedCODE = req.body.params.selectedCODE;
    let vdcdData = req.body.params.vdcdData;
    let year = req.body.params.year;
    let month = req.body.params.month;
    let dateTab = req.body.params.dateTab;
    
    if (month.toString().length == 1) {
      month = "0" + month
    }

    // SD매출TOP
    let sql = "";
    if(selectedCODE == "other"){ // 타사일때
      sql += "SELECT HRID, VDCD, SNO, NAME, BRCD, BRNM, SUCD, CHGUCD, CHGUNM, AMTRATINGNM, VDSNM, JAEJIGNM, ONEAVGAMT FROM BIHR050 ";
      sql += "WHERE COMPANYCD = '2' ";
      sql += "AND SNO IN ("
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
      sql += "SELECT RN, B.VDCD VDCD, SNO, NAME, BRCD, SUCD, SALE_TOT, QTY_TOT, CHGUCD, CHGUNM, AMTRATINGNM, B.VDSNM, JAEJIGNM, HRID FROM ";
      sql += "(SELECT ROWNUM() RN, MVDCD, SALE_TOT, QTY_TOT FROM ( ";
      sql += "SELECT MVDCD, SUM(TSAMT+ADVDEPAMT) AS SALE_TOT, SUM(SQTY+RQTY) AS QTY_TOT FROM BISH041 ";
      sql += "WHERE MVDCD IN ("
      for (let i=0;i<vdcdData.length;i++) {
        sql += "'" + vdcdData[i].VDCD + "'"
        if (i < vdcdData.length - 1) {
          sql += ","
        }
      }
      sql += ") "
      if(dateTab == 1){
        // sql += "AND SUBSTR(SALEDT,1,6) = '" + year + month +"' ";
        sql += "AND SALEYY = '" + year +"' "
        sql += "AND SALEMM = '" + month +"' "
      } else if(dateTab == 2){
        // sql += "AND SUBSTR(SALEDT,1,6) BETWEEN '"+ year + "01" +"' AND '" + year + "12" +"' ";
        sql += "AND SALEYY = '"+ year +"' "
      }
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BISH041) ";
      sql += "GROUP BY MVDCD ";
      sql += "ORDER BY SALE_TOT DESC ";
      sql += "))A, ";
      sql += "(SELECT VDCD, VDSNM, NAME, SNO, BRCD, SUCD, JAEJIGNM, AMTRATINGNM, CHGUCD, CHGUNM, HRID FROM BIHR050 ";
      sql += "WHERE COMPANYCD = '1' ";
      sql += "AND VDCD IN ("
      for (let i=0;i<vdcdData.length;i++) {
        sql += "'" + vdcdData[i].VDCD + "'"
        if (i < vdcdData.length - 1) {
          sql += ","
        }
      }
      sql += ") "
      sql += "AND CREATEDATE = (SELECT MAX(CREATEDATE) FROM BIHR050))B ";
      sql += "WHERE A.MVDCD = B.VDCD"
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};