var axios = require('axios');
var moment = require('moment');
const db = require('../../config/db')

exports.searchStyle = (req, res) => {
    console.log("============== searchStyle Call ======================");
    let tabType = req.body.params.tabType;
    let searchText = req.body.params.searchText;
    let filterData = req.body.params.filterData;

    let sql = ""        
    if(filterData.addReOrder) { // 리오더 포함
      if(filterData.addSimilar) { // 리오더 포함 , 유사상품 포함
        sql += "SELECT 0 STYCD, SSTYCD STYCODE, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SQTY, SILAMT, OUTQTY, STOQTY, TOTOUTQTY, ACCSQTY, TOTSQTY, SALERATE, TOTSALERATE, INQTY, ACCSILAMT FROM( "
        sql += "SELECT SSTYCD, MAINSTYCD, MAX(DIMAGEPATH) DIMAGEPATH, MAX(MAINDIMAGEPATH) MAINDIMAGEPATH, MAX(TAGPRI) TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, SUM(OUTQTY) OUTQTY, SUM(TOTOUTQTY) - SUM(ACCSQTY) AS STOQTY, SUM(TOTOUTQTY) TOTOUTQTY, SUM(ACCSQTY) ACCSQTY, SUM(TOTSQTY) TOTSQTY, "
        sql += "CASE WHEN SUM(TOTOUTQTY) > 0 THEN ROUND(SUM(INQTY)/SUM(TOTOUTQTY) * 100, 1) ELSE 0 END AS SALERATE, "
        sql += "CASE WHEN SUM(INQTY) > 0 THEN ROUND(SUM(TOTSQTY)/SUM(INQTY) * 100, 1) ELSE 0 END AS TOTSALERATE, SUM(INQTY) INQTY, SUM(ACCSILAMT) ACCSILAMT FROM( "
        sql += "SELECT SSTYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SQTY, SILAMT, 0 OUTQTY, 0 TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, 0 INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT CASE WHEN MAX(SSTYCD) IS NULL THEN MAX(MAINSTYCD) ELSE MAX(SSTYCD) END SSTYCD, "
        sql += "MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, MAX(TAGPRI) TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT BETWEEN '" + filterData.saleStartDate + "' AND '" + filterData.saleEndDate + "' "
        sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += "AND STYCD LIKE '%" + searchText + "%' "
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT SSTYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT CASE WHEN MAX(SSTYCD) IS NULL THEN MAX(MAINSTYCD) ELSE MAX(SSTYCD) END SSTYCD, "
        sql += "MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, MAX(TAGPRI)TAGPRI, SUM(SQTY) TOTSQTY, SUM(INQTY) INQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND STYCD LIKE '%" + searchText + "%' "
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT SSTYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, 0 TOTSQTY, TOTOUTQTY, ACCSQTY, 0 INQTY, ACCSILAMT FROM ( "
        sql += "SELECT CASE WHEN MAX(SSTYCD) IS NULL THEN MAX(MAINSTYCD) ELSE MAX(SSTYCD) END SSTYCD, "
        sql += "MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, MAX(TAGPRI)TAGPRI, SUM(SQTY) ACCSQTY, SUM(SILAMT) ACCSILAMT, SUM(OUTQTY) TOTOUTQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT <= '" + filterData.saleEndDate + "' "
        // 191220 요구사항으로 주석처리(출고수량,누적판매금액,누적판매수량)
        // sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += "AND STYCD LIKE '%" + searchText + "%' "
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH "
        sql += ") "
        sql += ") "
        sql += "GROUP BY SSTYCD, MAINSTYCD "
        sql += ") "
        sql += "WHERE SQTY > 0"
      } else { // 리오더 포함 , 유사상품 미포함
        sql += "SELECT 0 STYCD, MAINSTYCD STYCODE, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SQTY, SILAMT, OUTQTY, STOQTY, TOTOUTQTY, ACCSQTY, TOTSQTY, SALERATE, TOTSALERATE, INQTY, ACCSILAMT FROM( "
        sql += "SELECT MAINSTYCD, MAX(DIMAGEPATH) DIMAGEPATH, MAX(MAINDIMAGEPATH) MAINDIMAGEPATH, MAX(TAGPRI) TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, SUM(OUTQTY) OUTQTY, SUM(TOTOUTQTY) - SUM(ACCSQTY) AS STOQTY, SUM(TOTOUTQTY) TOTOUTQTY, SUM(ACCSQTY) ACCSQTY, SUM(TOTSQTY) TOTSQTY, "
        sql += "CASE WHEN SUM(TOTOUTQTY) > 0 THEN ROUND(SUM(INQTY)/SUM(TOTOUTQTY) * 100, 1) ELSE 0 END AS SALERATE, "
        sql += "CASE WHEN SUM(INQTY) > 0 THEN ROUND(SUM(TOTSQTY)/SUM(INQTY) * 100, 1) ELSE 0 END AS TOTSALERATE, SUM(INQTY) INQTY, SUM(ACCSILAMT) ACCSILAMT FROM( "
        sql += "SELECT MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SQTY, SILAMT, 0 OUTQTY, 0 TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, 0 INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT BETWEEN '" + filterData.saleStartDate + "' AND '" + filterData.saleEndDate + "' "
        sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += "AND STYCD LIKE '%" + searchText + "%' "
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SUM(SQTY) TOTSQTY, SUM(INQTY) INQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND STYCD LIKE '%" + searchText + "%' "
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, 0 TOTSQTY, TOTOUTQTY, ACCSQTY, 0 INQTY, ACCSILAMT FROM ( "
        sql += "SELECT MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SUM(SQTY) ACCSQTY, SUM(SILAMT) ACCSILAMT, SUM(OUTQTY) TOTOUTQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT <= '" + filterData.saleEndDate + "' "
        // 191220 요구사항으로 주석처리(출고수량,누적판매금액,누적판매수량)
        // sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += "AND STYCD LIKE '%" + searchText + "%' "
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI "
        sql += ") "
        sql += ") "
        sql += "GROUP BY MAINSTYCD "
        sql += ") "
        sql += "WHERE SQTY > 0"
      }
    } else { // 리오더 미포함
      if(filterData.addSimilar) { // 리오더 미포함 , 유사상품 포함
        sql += "SELECT 0 STYCD, SSTYCD STYCODE, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SQTY, SILAMT, OUTQTY, STOQTY, TOTOUTQTY, ACCSQTY, TOTSQTY, SALERATE, TOTSALERATE, INQTY, ACCSILAMT FROM( "
        sql += "SELECT SSTYCD, MAINSTYCD, MAX(DIMAGEPATH) DIMAGEPATH, MAX(MAINDIMAGEPATH) MAINDIMAGEPATH, MAX(TAGPRI) TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, SUM(OUTQTY) OUTQTY, SUM(TOTOUTQTY) - SUM(ACCSQTY) AS STOQTY, SUM(TOTOUTQTY) TOTOUTQTY, SUM(ACCSQTY) ACCSQTY, SUM(TOTSQTY) TOTSQTY, "
        sql += "CASE WHEN SUM(TOTOUTQTY) > 0 THEN ROUND(SUM(INQTY)/SUM(TOTOUTQTY) * 100, 1) ELSE 0 END AS SALERATE, "
        sql += "CASE WHEN SUM(INQTY) > 0 THEN ROUND(SUM(TOTSQTY)/SUM(INQTY) * 100, 1) ELSE 0 END AS TOTSALERATE, SUM(INQTY) INQTY, SUM(ACCSILAMT) ACCSILAMT FROM( "
        sql += "SELECT SSTYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SQTY, SILAMT, 0 OUTQTY, 0 TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, 0 INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT CASE WHEN MAX(SSTYCD) IS NULL THEN MAX(MAINSTYCD) ELSE MAX(SSTYCD) END SSTYCD, "
        sql += "MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, MAX(TAGPRI) TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT BETWEEN '" + filterData.saleStartDate + "' AND '" + filterData.saleEndDate + "' "
        sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += "AND STYCD LIKE '%" + searchText + "%' "
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT SSTYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT CASE WHEN MAX(SSTYCD) IS NULL THEN MAX(MAINSTYCD) ELSE MAX(SSTYCD) END SSTYCD, "
        sql += "MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, MAX(TAGPRI)TAGPRI, SUM(SQTY) TOTSQTY, SUM(INQTY) INQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND STYCD LIKE '%" + searchText + "%' "
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT SSTYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, 0 TOTSQTY, TOTOUTQTY, ACCSQTY, 0 INQTY, ACCSILAMT FROM ( "
        sql += "SELECT CASE WHEN MAX(SSTYCD) IS NULL THEN MAX(MAINSTYCD) ELSE MAX(SSTYCD) END SSTYCD, "
        sql += "MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, MAX(TAGPRI)TAGPRI, SUM(SQTY) ACCSQTY, SUM(SILAMT) ACCSILAMT, SUM(OUTQTY) TOTOUTQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT <= '" + filterData.saleEndDate + "' "
        // 191220 요구사항으로 주석처리(출고수량,누적판매금액,누적판매수량)
        // sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += "AND STYCD LIKE '%" + searchText + "%' "
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH "
        sql += ") "
        sql += ") "
        sql += "GROUP BY SSTYCD, MAINSTYCD "
        sql += ") "
        sql += "WHERE SQTY > 0"
      } else { // 리오더 미포함 , 유사상품 미포함
        sql += "SELECT 1 STYCD, STYCODE, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, SQTY, SILAMT, OUTQTY, STOQTY, TOTOUTQTY, ACCSQTY, TOTSQTY, SALERATE, TOTSALERATE, INQTY, ACCSILAMT FROM ( "
        sql += "SELECT STYCD STYCODE, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, SUM(OUTQTY) OUTQTY, SUM(TOTOUTQTY) - SUM(ACCSQTY) AS STOQTY, SUM(TOTOUTQTY) TOTOUTQTY, SUM(ACCSQTY) ACCSQTY, SUM(TOTSQTY) TOTSQTY, "
        sql += "CASE WHEN SUM(TOTOUTQTY) > 0 THEN ROUND(SUM(INQTY)/SUM(TOTOUTQTY) * 100, 1) ELSE 0 END AS SALERATE, "
        sql += "CASE WHEN SUM(INQTY) > 0 THEN ROUND(SUM(TOTSQTY)/SUM(INQTY) * 100, 1) ELSE 0 END AS TOTSALERATE, SUM(INQTY) INQTY, SUM(ACCSILAMT) ACCSILAMT FROM ( "
        sql += "SELECT STYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, SQTY, SILAMT, 0 OUTQTY, 0 TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, 0 INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT STYCD, MAX(MAINSTYCD) MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT BETWEEN '" + filterData.saleStartDate + "' AND '" + filterData.saleEndDate + "' "
        sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += "AND STYCD LIKE '%" + searchText + "%' "
        sql += "GROUP BY STYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT STYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT STYCD, MAX(MAINSTYCD) MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, SUM(SQTY) TOTSQTY, SUM(INQTY) INQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND STYCD LIKE '%" + searchText + "%' "
        sql += "GROUP BY STYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT STYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, 0 TOTSQTY, TOTOUTQTY, ACCSQTY, 0 INQTY, ACCSILAMT FROM ( "
        sql += "SELECT STYCD, MAX(MAINSTYCD) MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, SUM(SQTY) ACCSQTY, SUM(SILAMT) ACCSILAMT, SUM(OUTQTY) TOTOUTQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT <= '" + filterData.saleEndDate + "' "
        // 191220 요구사항으로 주석처리(출고수량,누적판매금액,누적판매수량)
        // sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += "AND STYCD LIKE '%" + searchText + "%' "
        sql += "GROUP BY STYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI "
        sql += ") "
        sql += ") "
        sql += "GROUP BY STYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI "
        sql += ") "
        sql += "WHERE SQTY > 0"
      }
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStyleTopData = (req, res) => {
    console.log("============== getStyleTopData Call ======================");
    let tabType = req.body.params.tabType;
    let filterData = req.body.params.filterData;

    let sql = "" 
    let c_sql = "";
    if(filterData.storekindCode == "STOKINDALL" || filterData.changeListCode){ // 매장형태 전체 선택 || 리스트내에서 사업부 변경시 매장형태 조건 태우지 않음
    } else {
      c_sql += "AND SHTP = '" + filterData.storekindCode + "' "
    }

    if(filterData.store_a || filterData.changeListCode){ // 매장 전체 선택 || 리스트내에서 사업부 변경시 매장형태 조건 태우지 않음
    } else {
      if (filterData.stores.length > 0) { // 매장
        c_sql += "AND VDCD IN ("
        for (let i=0;i<filterData.stores.length;i++) {
          c_sql += "'" + filterData.stores[i] + "'"
          if (i < filterData.stores.length - 1) {
            c_sql += ","
          }
        }
        c_sql += ") "
      } 
    }

    if(filterData.item_a){ // 제품구분 전체 선택
    } else {
      if (filterData.items.length > 0) { // 제품구분
        c_sql += "AND ITEMGU IN ("
        for (let i=0;i<filterData.items.length;i++) {
          c_sql += "'" + filterData.items[i] + "'"
          if (i < filterData.items.length - 1) {
            c_sql += ","
          }
        }
        c_sql += ") "
      } 
    }

    if(filterData.gubun_a){ // 구분 전체 선택
      c_sql += "AND SOJAE <> 'S' AND RESEQ <> 'S' "
      c_sql += "AND INGU NOT IN ('D') "
      c_sql += "AND VDCD <> 'MI909' "
      c_sql += "AND VVDCDGB <> '20' "
      c_sql += "AND VDCD <> 'SO931' "
      c_sql += "AND RETURNYN <> '1' "
      c_sql += "AND BADGB = '0' "
      c_sql += "AND VVDCDGB = '0' "
    } else {
      if (filterData.gubuns.length > 0) { // 구분
        if(filterData.gubuns.includes("s_except")){
          c_sql += "AND SOJAE <> 'S' AND RESEQ <> 'S' "
        } 
        if(filterData.gubuns.includes("b_except")){
          c_sql += "AND INGU NOT IN ('D') "
        } 
        if(filterData.gubuns.includes("d_except")){
          c_sql += "AND VDCD <> 'MI909' "
        } 
        if(filterData.gubuns.includes("l_except")){
          c_sql += "AND VVDCDGB <> '20' "
        } 
        if(filterData.gubuns.includes("t_except")){
          c_sql += "AND VDCD <> 'SO931' "
        } 
        if(filterData.gubuns.includes("w_except")){
          c_sql += "AND RETURNYN <> '1' "
        } 
        if(filterData.gubuns.includes("f_except")){
          c_sql += "AND BADGB = '0' "
        } 
        if(filterData.gubuns.includes("i_except")){
          c_sql += "AND VVDCDGB = '0' "
        }
      }
    }

    if(filterData.cloth_a){ // 복종 전체 선택
    } else {
      if (filterData.cloths.length > 0) { // 복종
        c_sql += "AND ITEM IN ("
        for (let i=0;i<filterData.cloths.length;i++) {
          c_sql += "'" + filterData.cloths[i] + "'"
          if (i < filterData.cloths.length - 1) {
            c_sql += ","
          }
        }
        c_sql += ") "
      } else {
        c_sql += "AND ITEM IS NULL "
      }
    }
      
    if(filterData.fabric_a){ // 소재 전체 선택
    } else {
      if (filterData.fabrics.length > 0) { // 소재
        c_sql += "AND SOJAE IN ("
        for (let i=0;i<filterData.fabrics.length;i++) {
          c_sql += "'" + filterData.fabrics[i] + "'"
          if (i < filterData.fabrics.length - 1) {
            c_sql += ","
          }
        }
        c_sql += ") "
      } else {
        c_sql += "AND SOJAE IS NULL "
      }
    }

    if(filterData.releaseCodes == "RELEASEALL"){ // 출고유형 전체 선택
    } else {
      if(filterData.releaseCodes == "00"){
        c_sql += "AND SALEGU IN ('00','02','09','06') "
      } else if(filterData.releaseCodes == "30"){
        c_sql += "AND SALEGU = '30' "
      }
    }

    if(filterData.saleCodes == "SALEALL"){ // 판매유형 전체 선택
    } else {
      if(filterData.saleCodes == "00"){
        c_sql += "AND SALEGU IN ('00','01','02','03','05','09','99','06') "
      } else if(filterData.saleCodes == "2"){
        c_sql += "AND SUBSTR(SALEGU,1,1) = '2' "
      } else if(filterData.saleCodes == "002"){
        c_sql += "AND (SALEGU IN ('00','01','02','03','05','09','99','06') OR SUBSTR(SALEGU,1,1) = '2') "
      } else if(filterData.saleCodes == "30"){
        c_sql += "AND SALEGU = '30' "
      }
    }
    
    if(filterData.foreign == "f_except"){  // 해외매장 제외
      c_sql += "AND NVL(SHTP,'-1') <> '10' ";
    } else if(filterData.foreign == "f_store"){  // 해외매장
      c_sql += "AND NVL(SHTP,'-1') = '10' ";
    }
    
    // TOTOUTQTY 출고수량
    // SQTY 기간판매
    // ACCSQTY 누적판매
    // STOQTY 재고
    // OUTQTY ??
    // INQTY 총생산량
    // TOTSQTY 총판매량
    // SALERATE 판매율
    // TOTSALERATE 총판매율
    // ACCSILAMT 누적판매금액
    // SILAMT 기간판매금액

    // 스타일 TOP20
    if(filterData.addReOrder) { // 리오더 포함
      if(filterData.addSimilar) { // 리오더 포함 , 유사상품 포함
        sql += "SELECT 0 STYCD, SSTYCD STYCODE, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SQTY, SILAMT, OUTQTY, STOQTY, TOTOUTQTY, ACCSQTY, TOTSQTY, SALERATE, TOTSALERATE, INQTY, ACCSILAMT FROM( "
        sql += "SELECT SSTYCD, MAINSTYCD, MAX(DIMAGEPATH) DIMAGEPATH, MAX(MAINDIMAGEPATH) MAINDIMAGEPATH, MAX(TAGPRI) TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, SUM(OUTQTY) OUTQTY, SUM(TOTOUTQTY) - SUM(ACCSQTY) AS STOQTY, SUM(TOTOUTQTY) TOTOUTQTY, SUM(ACCSQTY) ACCSQTY, SUM(TOTSQTY) TOTSQTY, "
        sql += "CASE WHEN SUM(TOTOUTQTY) > 0 THEN ROUND(SUM(INQTY)/SUM(TOTOUTQTY) * 100, 1) ELSE 0 END AS SALERATE, "
        sql += "CASE WHEN SUM(INQTY) > 0 THEN ROUND(SUM(TOTSQTY)/SUM(INQTY) * 100, 1) ELSE 0 END AS TOTSALERATE, SUM(INQTY) INQTY, SUM(ACCSILAMT) ACCSILAMT FROM( "
        sql += "SELECT SSTYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SQTY, SILAMT, 0 OUTQTY, 0 TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, 0 INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT CASE WHEN MAX(SSTYCD) IS NULL THEN MAX(MAINSTYCD) ELSE MAX(SSTYCD) END SSTYCD, "
        sql += "MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, MAX(TAGPRI) TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT BETWEEN '" + filterData.saleStartDate + "' AND '" + filterData.saleEndDate + "' "
        sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += c_sql // 필터조건
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT SSTYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT CASE WHEN MAX(SSTYCD) IS NULL THEN MAX(MAINSTYCD) ELSE MAX(SSTYCD) END SSTYCD, "
        sql += "MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, MAX(TAGPRI)TAGPRI, SUM(SQTY) TOTSQTY, SUM(INQTY) INQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT SSTYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, 0 TOTSQTY, TOTOUTQTY, ACCSQTY, 0 INQTY, ACCSILAMT FROM ( "
        sql += "SELECT CASE WHEN MAX(SSTYCD) IS NULL THEN MAX(MAINSTYCD) ELSE MAX(SSTYCD) END SSTYCD, "
        sql += "MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, MAX(TAGPRI)TAGPRI, SUM(SQTY) ACCSQTY, SUM(SILAMT) ACCSILAMT, SUM(OUTQTY) TOTOUTQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT <= '" + filterData.saleEndDate + "' "
        // 191220 요구사항으로 주석처리(출고수량,누적판매금액,누적판매수량)
        // sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += c_sql // 필터조건
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH "
        sql += ") "
        sql += ") "
        sql += "GROUP BY SSTYCD, MAINSTYCD "
        sql += ") "
        sql += "WHERE SQTY > 0"
      } else { // 리오더 포함 , 유사상품 미포함
        sql += "SELECT 0 STYCD, MAINSTYCD STYCODE, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SQTY, SILAMT, OUTQTY, STOQTY, TOTOUTQTY, ACCSQTY, TOTSQTY, SALERATE, TOTSALERATE, INQTY, ACCSILAMT FROM( "
        sql += "SELECT MAINSTYCD, MAX(DIMAGEPATH) DIMAGEPATH, MAX(MAINDIMAGEPATH) MAINDIMAGEPATH, MAX(TAGPRI) TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, SUM(OUTQTY) OUTQTY, SUM(TOTOUTQTY) - SUM(ACCSQTY) AS STOQTY, SUM(TOTOUTQTY) TOTOUTQTY, SUM(ACCSQTY) ACCSQTY, SUM(TOTSQTY) TOTSQTY, "
        sql += "CASE WHEN SUM(TOTOUTQTY) > 0 THEN ROUND(SUM(INQTY)/SUM(TOTOUTQTY) * 100, 1) ELSE 0 END AS SALERATE, "
        sql += "CASE WHEN SUM(INQTY) > 0 THEN ROUND(SUM(TOTSQTY)/SUM(INQTY) * 100, 1) ELSE 0 END AS TOTSALERATE, SUM(INQTY) INQTY, SUM(ACCSILAMT) ACCSILAMT FROM( "
        sql += "SELECT MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SQTY, SILAMT, 0 OUTQTY, 0 TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, 0 INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT BETWEEN '" + filterData.saleStartDate + "' AND '" + filterData.saleEndDate + "' "
        sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += c_sql // 필터조건
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SUM(SQTY) TOTSQTY, SUM(INQTY) INQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, 0 TOTSQTY, TOTOUTQTY, ACCSQTY, 0 INQTY, ACCSILAMT FROM ( "
        sql += "SELECT MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SUM(SQTY) ACCSQTY, SUM(SILAMT) ACCSILAMT, SUM(OUTQTY) TOTOUTQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT <= '" + filterData.saleEndDate + "' "
        // 191220 요구사항으로 주석처리(출고수량,누적판매금액,누적판매수량)
        // sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += c_sql // 필터조건
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI "
        sql += ") "
        sql += ") "
        sql += "GROUP BY MAINSTYCD "
        sql += ") "
        sql += "WHERE SQTY > 0"
      }
    } else { // 리오더 미포함
      if(filterData.addSimilar) { // 리오더 미포함 , 유사상품 포함
        sql += "SELECT 0 STYCD, SSTYCD STYCODE, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SQTY, SILAMT, OUTQTY, STOQTY, TOTOUTQTY, ACCSQTY, TOTSQTY, SALERATE, TOTSALERATE, INQTY, ACCSILAMT FROM( "
        sql += "SELECT SSTYCD, MAINSTYCD, MAX(DIMAGEPATH) DIMAGEPATH, MAX(MAINDIMAGEPATH) MAINDIMAGEPATH, MAX(TAGPRI) TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, SUM(OUTQTY) OUTQTY, SUM(TOTOUTQTY) - SUM(ACCSQTY) AS STOQTY, SUM(TOTOUTQTY) TOTOUTQTY, SUM(ACCSQTY) ACCSQTY, SUM(TOTSQTY) TOTSQTY, "
        sql += "CASE WHEN SUM(TOTOUTQTY) > 0 THEN ROUND(SUM(INQTY)/SUM(TOTOUTQTY) * 100, 1) ELSE 0 END AS SALERATE, "
        sql += "CASE WHEN SUM(INQTY) > 0 THEN ROUND(SUM(TOTSQTY)/SUM(INQTY) * 100, 1) ELSE 0 END AS TOTSALERATE, SUM(INQTY) INQTY, SUM(ACCSILAMT) ACCSILAMT FROM( "
        sql += "SELECT SSTYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, SQTY, SILAMT, 0 OUTQTY, 0 TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, 0 INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT CASE WHEN MAX(SSTYCD) IS NULL THEN MAX(MAINSTYCD) ELSE MAX(SSTYCD) END SSTYCD, "
        sql += "MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, MAX(TAGPRI) TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT BETWEEN '" + filterData.saleStartDate + "' AND '" + filterData.saleEndDate + "' "
        sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += c_sql // 필터조건
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT SSTYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT CASE WHEN MAX(SSTYCD) IS NULL THEN MAX(MAINSTYCD) ELSE MAX(SSTYCD) END SSTYCD, "
        sql += "MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, MAX(TAGPRI)TAGPRI, SUM(SQTY) TOTSQTY, SUM(INQTY) INQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT SSTYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, 0 TOTSQTY, TOTOUTQTY, ACCSQTY, 0 INQTY, ACCSILAMT FROM ( "
        sql += "SELECT CASE WHEN MAX(SSTYCD) IS NULL THEN MAX(MAINSTYCD) ELSE MAX(SSTYCD) END SSTYCD, "
        sql += "MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, MAX(TAGPRI)TAGPRI, SUM(SQTY) ACCSQTY, SUM(SILAMT) ACCSILAMT, SUM(OUTQTY) TOTOUTQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT <= '" + filterData.saleEndDate + "' "
        // 191220 요구사항으로 주석처리(출고수량,누적판매금액,누적판매수량)
        // sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += c_sql // 필터조건
        sql += "GROUP BY MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH "
        sql += ") "
        sql += ") "
        sql += "GROUP BY SSTYCD, MAINSTYCD "
        sql += ") "
        sql += "WHERE SQTY > 0"
      } else { // 리오더 미포함 , 유사상품 미포함
        sql += "SELECT 1 STYCD, STYCODE, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, SQTY, SILAMT, OUTQTY, STOQTY, TOTOUTQTY, ACCSQTY, TOTSQTY, SALERATE, TOTSALERATE, INQTY, ACCSILAMT FROM ( "
        sql += "SELECT STYCD STYCODE, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, SUM(OUTQTY) OUTQTY, SUM(TOTOUTQTY) - SUM(ACCSQTY) AS STOQTY, SUM(TOTOUTQTY) TOTOUTQTY, SUM(ACCSQTY) ACCSQTY, SUM(TOTSQTY) TOTSQTY, "
        sql += "CASE WHEN SUM(TOTOUTQTY) > 0 THEN ROUND(SUM(INQTY)/SUM(TOTOUTQTY) * 100, 1) ELSE 0 END AS SALERATE, "
        sql += "CASE WHEN SUM(INQTY) > 0 THEN ROUND(SUM(TOTSQTY)/SUM(INQTY) * 100, 1) ELSE 0 END AS TOTSALERATE, SUM(INQTY) INQTY, SUM(ACCSILAMT) ACCSILAMT FROM ( "
        sql += "SELECT STYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, SQTY, SILAMT, 0 OUTQTY, 0 TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, 0 INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT STYCD, MAX(MAINSTYCD) MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, SUM(SQTY) SQTY, SUM(SILAMT) SILAMT FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT BETWEEN '" + filterData.saleStartDate + "' AND '" + filterData.saleEndDate + "' "
        sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += c_sql // 필터조건
        sql += "GROUP BY STYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT STYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, TOTSQTY, 0 TOTOUTQTY, 0 ACCSQTY, INQTY, 0 ACCSILAMT FROM ( "
        sql += "SELECT STYCD, MAX(MAINSTYCD) MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, SUM(SQTY) TOTSQTY, SUM(INQTY) INQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "GROUP BY STYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI "
        sql += ") "
        sql += "UNION ALL "
        sql += "SELECT STYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, 0 SQTY, 0 SILAMT, 0 OUTQTY, 0 TOTSQTY, TOTOUTQTY, ACCSQTY, 0 INQTY, ACCSILAMT FROM ( "
        sql += "SELECT STYCD, MAX(MAINSTYCD) MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI, SUM(SQTY) ACCSQTY, SUM(SILAMT) ACCSILAMT, SUM(OUTQTY) TOTOUTQTY FROM BISY021 "
        sql += "WHERE 1=1 "
        sql += "AND " + tabType + " = '" + filterData.sucd + "' "
        sql += "AND INOUTDT <= '" + filterData.saleEndDate + "' "
        // 191220 요구사항으로 주석처리(출고수량,누적판매금액,누적판매수량)
        // sql += "AND YSCD BETWEEN '" + filterData.seasonStartYear + filterData.seasonStartMonth + "' AND '" + filterData.seasonEndYear + filterData.seasonEndMonth + "' "
        sql += c_sql // 필터조건
        sql += "GROUP BY STYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI "
        sql += ") "
        sql += ") "
        sql += "GROUP BY STYCD, MAINSTYCD, DIMAGEPATH, MAINDIMAGEPATH, RESEQ, TAGPRI "
        sql += ") "
        sql += "WHERE SQTY > 0"
      }
    }
    console.log("!!!sql >>> " + sql)
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getDesignerTopData = (req, res) => {
    console.log("============== getDesignerTopData Call ======================");
    let tabType = req.query.tabType;
    let sucd = req.query.sucd;

    let sql = "SELECT A.DESIGNER ";
    sql += ",A.EMPNAME ";
    sql += ",A.PHOTOPATH ";
    sql += ",CASE WHEN A.ACC_STAGPRI = 0 THEN 0 ELSE ROUND(A.ACC_SALEAMT/A.ACC_STAGPRI * 100,1) END AS ACC_SALERATE ";
    sql += ",A.ACC_SALEQTY AS ACC_SALEQTY ";
    sql += ",A.ACC_SALEAMT AS ACC_SALEAMT ";
    sql += "FROM ( ";
    sql += "SELECT DESIGNER ";
    sql += ",EMPNAME ";
    sql += ",PHOTOPATH ";
    sql += ",SUM(SQTY) AS ACC_SALEQTY ";
    sql += ",SUM(SILAMT) AS ACC_SALEAMT ";
    sql += ",SUM(STAGPRI) AS ACC_STAGPRI ";
    sql += "FROM BISY021 ";
    sql += "WHERE DESIGNER IS NOT NULL ";
    sql += "AND OUTDT >= '" + moment().subtract(1, 'year').add(1, 'day').format("YYYYMMDD") + "' "; /* 최근 1년 데이터를 추출하기 위함으로, 1년전 내일 날짜를 입력해주시기 바랍니다. */
    sql += "AND " + tabType + " = '" + sucd + "' ";
    sql += "GROUP BY DESIGNER,EMPNAME,PHOTOPATH ";
    sql += ") A ";
    sql += "ORDER BY ACC_SALERATE DESC "; /* 판매율별 */
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};
