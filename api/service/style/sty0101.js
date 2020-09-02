var axios = require('axios');
const db = require('../../config/db')

exports.getClothData = (req, res) => {
    console.log("============== getClothData Call ======================")
    let styleCode = req.query.styleCode
    let SUCD = req.query.SUCD

    let sql = "SELECT TO_NUMBER(SUCD) SUCD, BRCD, COMCD, DIMAGEPATH, MAINDIMAGEPATH, STYCD, YSCD, EMPNAME, SOJAENM, SOJAENMOG ,PRDTGU, CUSTNM, TAGPRI, OUTDT, RESEQ, "
    sql += "CASE WHEN MRGU IS NULL THEN '' ELSE MRGU END AS MRGU, "
    sql += "MIN(SALEPRI) MIN_SALEPRI, MAX(SALEPRI) MAX_SALEPRI FROM BISY021 "
    sql += "WHERE STYCD = '" + styleCode + "' "
    sql += "AND SUCD = '" + SUCD + "' "
    sql += "GROUP BY SUCD, BRCD, COMCD, DIMAGEPATH, MAINDIMAGEPATH, STYCD, YSCD, EMPNAME, SOJAENM, SOJAENMOG, PRDTGU, CUSTNM, TAGPRI, OUTDT, RESEQ, MRGU "
    sql += "ORDER BY SUCD"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getKindOfStyle = (req, res) => {
    console.log("============== getKindOfStyle Call ======================")
    let MAINSTYCD = req.query.MAINSTYCD
    let SUCD = req.query.SUCD

    // let sql = "SELECT MAINSTYCD, STYCD, TO_NUMBER(RESEQ) RESEQ FROM BISY021 "
    // sql += "WHERE STYCD = '" + MAINSTYCD + "' "
    // sql += "AND SUCD = '" + SUCD + "' "
    // sql += "GROUP BY MAINSTYCD, STYCD, RESEQ "
    // sql += "UNION ALL "
    // sql += "SELECT MAINSTYCD, STYCD, TO_NUMBER(RESEQ) RESEQ FROM BISY021 "
    // sql += "WHERE MAINSTYCD = '" + MAINSTYCD + "' "
    // sql += "AND SUCD = '" + SUCD + "' "
    // sql += "AND RESEQ > '0' "
    // sql += "GROUP BY MAINSTYCD, STYCD, RESEQ "
    // sql += "ORDER BY RESEQ"

    let sql = "SELECT STYCD, MAINSTYCD, TO_NUMBER(RESEQ) RESEQ FROM BISY021 "
    sql += "WHERE MAINSTYCD = '" + MAINSTYCD + "' "
    sql += "AND SUCD = '" + SUCD + "' "
    sql += "GROUP BY STYCD, MAINSTYCD, RESEQ "
    sql += "ORDER BY RESEQ"
    console.log("getKindOfStyle >>> "+sql);

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getAccClothSaleData = (req, res) => {
    console.log("============== getAccClothSaleData Call ======================")
    let gubun_a = req.query.gubun_a
    let gubuns = req.query.gubuns
    let foreign = req.query.foreign
    let selectStyle = req.query.selectStyle
    let KINDOFSTYLE = req.query.KINDOFSTYLE.split(',')
    let STYCODE = req.query.STYCODE
    let SUCD = req.query.SUCD

    let c_sql = ""
    if(foreign == "f_except"){  //해외매장 제외
      c_sql += "AND NVL(SHTP,'-1') <> '10' "
    }else if(foreign == "f_store"){  //해외매장
      c_sql += "AND NVL(SHTP,'-1') = '10' "
    }

    if(gubun_a){ // 구분 전체 선택
      c_sql += "AND SOJAE <> 'S' AND RESEQ <> 'S' "
      c_sql += "AND INGU NOT IN ('D') "
      c_sql += "AND VDCD <> 'MI909' "
      c_sql += "AND VVDCDGB <> '20' "
      c_sql += "AND VDCD <> 'SO931' "
      c_sql += "AND RETURNYN <> '1' "
      c_sql += "AND BADGB IS NULL "
      c_sql += "AND VVDCDGB = '0' "
    } else {
      if (gubuns.length > 0) { // 구분
        if(gubuns.includes("s_except")){
          c_sql += "AND SOJAE <> 'S' AND RESEQ <> 'S' "
        } 
        if(gubuns.includes("b_except")){
          c_sql += "AND INGU NOT IN ('D') "
        } 
        if(gubuns.includes("d_except")){
          c_sql += "AND VDCD <> 'MI909' "
        } 
        if(gubuns.includes("l_except")){
          c_sql += "AND VVDCDGB <> '20' "
        } 
        if(gubuns.includes("t_except")){
          c_sql += "AND VDCD <> 'SO931' "
        } 
        if(gubuns.includes("w_except")){
          c_sql += "AND RETURNYN <> '1' "
        } 
        if(gubuns.includes("f_except")){
          c_sql += "AND BADGB IS NULL "
        } 
        if(gubuns.includes("i_except")){
          c_sql += "AND VVDCDGB = '0' "
        }
      }
    }

    let sql = ""

    // 누적판매실적
    if(selectStyle == 0) {
      sql += "SELECT "
      sql += "CASE WHEN B.INQTY = 0 THEN 0 ELSE ROUND(B.SQTY/B.INQTY * 100,1) END ACC_QTY_RATE, "
      sql += "CASE WHEN B.STAGPRI = 0 THEN 0 ELSE ROUND(B.SILAMT/B.STAGPRI * 100,1) END ACC_AMT_RATE, "
      sql += "SILAMT, B.SQTY SQTY FROM "
      sql += "(SELECT SUM(SQTY) SQTY , SUM(SILAMT) SILAMT, SUM(INQTY) INQTY, SUM(STAGPRI) STAGPRI FROM BISY021 "
      sql += "WHERE STYCD IN ("
      for (var i=0;i<KINDOFSTYLE.length;i++) {
        sql += "'" + KINDOFSTYLE[i] + "'"
        if (i < KINDOFSTYLE.length - 1) {
          sql += ","
        }
      }
      sql += ") "
      sql += "AND SUCD = '" + SUCD + "' "
      sql += c_sql  //해외매장 조건
      sql += ") B"
    } else {
      sql += "SELECT "
      sql += "CASE WHEN B.INQTY = 0 THEN 0 ELSE ROUND(A.SQTY/B.INQTY * 100,1) END ACC_QTY_RATE, "
      sql += "CASE WHEN B.STAGPRI = 0 THEN 0 ELSE ROUND(A.SILAMT/B.STAGPRI * 100,1) END ACC_AMT_RATE, "
      sql += "SILAMT, A.SQTY SQTY FROM "
      sql += "(SELECT STYCD, SUM(SQTY) SQTY , SUM(SILAMT) SILAMT FROM BISY021 "
      sql += "WHERE STYCD = '" + STYCODE + "' "
      sql += "AND SUCD = '" + SUCD + "' "
      sql += c_sql  //해외매장 조건
      sql += "GROUP BY STYCD) A, "
      sql += "(SELECT STYCD, SUM(INQTY) INQTY, SUM(STAGPRI) STAGPRI FROM BISY021 "
      sql += "WHERE STYCD = '" + STYCODE + "' "
      sql += "AND SUCD = '" + SUCD + "' "
      sql += "GROUP BY STYCD) B "
      sql += "WHERE A.STYCD = B.STYCD "
    }

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getInOutQty = (req, res) => {
    console.log("============== getInOutQty Call ======================")
    let selectStyle = req.query.selectStyle
    let KINDOFSTYLE = req.query.KINDOFSTYLE.split(',')
    let STYCODE = req.query.STYCODE
    let SUCD = req.query.SUCD

    let sql = "SELECT SUM(INQTY) INQTY, SUM(OUTQTY) OUTQTY FROM BISY021 "
    if(selectStyle == 0){
      sql += "WHERE STYCD IN ("
      for (var i=0;i<KINDOFSTYLE.length;i++) {
        sql += "'" + KINDOFSTYLE[i] + "'"
        if (i < KINDOFSTYLE.length - 1) {
          sql += ","
        }
      }
      sql += ") "
    } else {
      sql += "WHERE STYCD = '" + STYCODE + "' "
    }
    sql += "AND SUCD = '" + SUCD + "' "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getClothJRData = (req, res) => {
    console.log("============== getClothJRData Call ======================")
    let gubun_a = req.query.gubun_a
    let gubuns = req.query.gubuns
    let foreign = req.query.foreign
    let selectStyle = req.query.selectStyle
    let KINDOFSTYLE = req.query.KINDOFSTYLE.split(',')
    let STYCODE = req.query.STYCODE
    let SUCD = req.query.SUCD
    let saleStartDate = req.query.saleStartDate
    let saleEndDate = req.query.saleEndDate

    let c_sql = ""
    if(foreign == "f_except"){  //해외매장 제외
      c_sql += "AND NVL(SHTP,'-1') <> '10' "
    }else if(foreign == "f_store"){  //해외매장
      c_sql += "AND NVL(SHTP,'-1') = '10' "
    }

    if(gubun_a){ // 구분 전체 선택
      c_sql += "AND SOJAE <> 'S' AND RESEQ <> 'S' "
      c_sql += "AND INGU NOT IN ('D') "
      c_sql += "AND VDCD <> 'MI909' "
      c_sql += "AND VVDCDGB <> '20' "
      c_sql += "AND VDCD <> 'SO931' "
      c_sql += "AND RETURNYN <> '1' "
      c_sql += "AND BADGB IS NULL "
      c_sql += "AND VVDCDGB = '0' "
    } else {
      if (gubuns.length > 0) { // 구분
        if(gubuns.includes("s_except")){
          c_sql += "AND SOJAE <> 'S' AND RESEQ <> 'S' "
        } 
        if(gubuns.includes("b_except")){
          c_sql += "AND INGU NOT IN ('D') "
        } 
        if(gubuns.includes("d_except")){
          c_sql += "AND VDCD <> 'MI909' "
        } 
        if(gubuns.includes("l_except")){
          c_sql += "AND VVDCDGB <> '20' "
        } 
        if(gubuns.includes("t_except")){
          c_sql += "AND VDCD <> 'SO931' "
        } 
        if(gubuns.includes("w_except")){
          c_sql += "AND RETURNYN <> '1' "
        } 
        if(gubuns.includes("f_except")){
          c_sql += "AND BADGB IS NULL "
        } 
        if(gubuns.includes("i_except")){
          c_sql += "AND VVDCDGB = '0' "
        }
      }
    }

    // 기판실적 금액, 수량
    let sql ="SELECT SUM(SQTY) SQTY, SUM(SILAMT) SILAMT, SUM(JSQTY) JSQTY, SUM(JSAMT) JSAMT, SUM(DCSQTY) DCSQTY, SUM(DCSAMT) DCSAMT, SUM(GSQTY) GSQTY ,SUM(GSAMT) GSAMT, "
    sql += "SUM(JRQTY) JRQTY, SUM(JRAMT) JRAMT, SUM(DCRQTY) DCRQTY, SUM(DCRAMT) DCRAMT, SUM(GRQTY) GRQTY ,SUM(GRAMT) GRAMT FROM BISY021 "
    if(selectStyle == 0){
      sql += "WHERE STYCD IN ("
      for (var i=0;i<KINDOFSTYLE.length;i++) {
        sql += "'" + KINDOFSTYLE[i] + "'"
        if (i < KINDOFSTYLE.length - 1) {
          sql += ","
        }
      }
      sql += ") "
    } else {
      sql += "WHERE STYCD = '" + STYCODE + "' "
    }
    sql += "AND SUCD = '" + SUCD + "' "
    sql += c_sql // 해외매장 조건
    sql += "AND INOUTDT BETWEEN '" + saleStartDate + "' AND '" + saleEndDate + "'"

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + sql)

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getAccClothSaleRate = (req, res) => {
    console.log("============== getAccClothSaleRate Call ======================")
    let gubun_a = req.query.gubun_a
    let gubuns = req.query.gubuns
    let foreign = req.query.foreign
    let selectStyle = req.query.selectStyle
    let KINDOFSTYLE = req.query.KINDOFSTYLE.split(',')
    let STYCODE = req.query.STYCODE
    let SUCD = req.query.SUCD

    let c_sql = ""
    if(foreign == "f_except"){  //해외매장 제외
      c_sql += "AND NVL(SHTP,'-1') <> '10' "
    } else if(foreign == "f_store"){  //해외매장
      c_sql += "AND NVL(SHTP,'-1') = '10' "
    }

    if(gubun_a){ // 구분 전체 선택
      c_sql += "AND SOJAE <> 'S' AND RESEQ <> 'S' "
      c_sql += "AND INGU NOT IN ('D') "
      c_sql += "AND VDCD <> 'MI909' "
      c_sql += "AND VVDCDGB <> '20' "
      c_sql += "AND VDCD <> 'SO931' "
      c_sql += "AND RETURNYN <> '1' "
      c_sql += "AND BADGB IS NULL "
      c_sql += "AND VVDCDGB = '0' "
    } else {
      if (gubuns.length > 0) { // 구분
        if(gubuns.includes("s_except")){
          c_sql += "AND SOJAE <> 'S' AND RESEQ <> 'S' "
        } 
        if(gubuns.includes("b_except")){
          c_sql += "AND INGU NOT IN ('D') "
        } 
        if(gubuns.includes("d_except")){
          c_sql += "AND VDCD <> 'MI909' "
        } 
        if(gubuns.includes("l_except")){
          c_sql += "AND VVDCDGB <> '20' "
        } 
        if(gubuns.includes("t_except")){
          c_sql += "AND VDCD <> 'SO931' "
        } 
        if(gubuns.includes("w_except")){
          c_sql += "AND RETURNYN <> '1' "
        } 
        if(gubuns.includes("f_except")){
          c_sql += "AND BADGB IS NULL "
        } 
        if(gubuns.includes("i_except")){
          c_sql += "AND VVDCDGB = '0' "
        }
      }
    }

    // 누적판매율 추이
    let sql = "SELECT INOUTDT "
    sql += ", CASE WHEN INQTY = 0 THEN 0 ELSE ROUND((SQTY/INQTY)*100,1) END AS ACC_QTY_RATE "
    sql += ", CASE WHEN INAMT = 0 THEN 0 ELSE ROUND((SAMT/INAMT)*100,1) END AS ACC_AMT_RATE "
    sql += "FROM "
    sql += "( "
    sql += "SELECT A.INOUTDT "
    sql += ",SUM(B.SQTY) AS SQTY "
    sql += ",MIN(C.INQTY) AS INQTY "
    sql += ",SUM(B.SAMT) AS SAMT "
    sql += ",MIN(C.INAMT) AS INAMT "
    sql += "FROM "
    sql += "( "
    sql += "SELECT A.STYCD "
    sql += ", A.INOUTDT "
    sql += "FROM BISY021 A "
    if(selectStyle == 0){
      sql += "WHERE A.STYCD IN ("
      for (var i=0;i<KINDOFSTYLE.length;i++) {
        sql += "'" + KINDOFSTYLE[i] + "'"
        if (i < KINDOFSTYLE.length - 1) {
          sql += ","
        }
      }
      sql += ") "
    } else {
      sql += "WHERE A.STYCD = '" + STYCODE + "' "
    }
    sql += "AND SUCD = '" + SUCD + "' "
    sql += c_sql  //해외매장 조건
    sql += "AND A.SQTY <> 0 "
    sql += "AND A.SILAMT <> 0 "
    sql += "GROUP BY A.STYCD, A.INOUTDT "
    sql += ") A "
    sql += ",( "
    sql += "SELECT A.STYCD "
    sql += ", A.INOUTDT "
    sql += ", SUM(A.SQTY) AS SQTY "
    sql += ", SUM(A.SILAMT) AS SAMT "
    sql += "FROM BISY021 A "
    if(selectStyle == 0){
      sql += "WHERE A.STYCD IN ("
      for (var i=0;i<KINDOFSTYLE.length;i++) {
        sql += "'" + KINDOFSTYLE[i] + "'"
        if (i < KINDOFSTYLE.length - 1) {
          sql += ","
        }
      }
      sql += ") "
    } else {
      sql += "WHERE A.STYCD = '" + STYCODE + "' "
    }
    sql += "AND SUCD = '" + SUCD + "' "
    sql += c_sql  //해외매장 조건
    sql += "GROUP BY A.STYCD, A.INOUTDT "
    sql += ") B "
    sql += ",( "
    sql += "SELECT A.STYCD "
    sql += ", SUM(A.INQTY) AS INQTY "
    sql += ", SUM(A.STAGPRI) AS INAMT "
    sql += "FROM BISY021 A "
    if(selectStyle == 0){
      sql += "WHERE A.STYCD IN ("
      for (var i=0;i<KINDOFSTYLE.length;i++) {
        sql += "'" + KINDOFSTYLE[i] + "'"
        if (i < KINDOFSTYLE.length - 1) {
          sql += ","
        }
      }
      sql += ") "
    } else {
      sql += "WHERE A.STYCD = '" + STYCODE + "' "
    }
    sql += "AND SUCD = '" + SUCD + "' "
    sql += "GROUP BY A.STYCD "
    sql += ") C ";
    sql += "WHERE A.INOUTDT >= B.INOUTDT "
    sql += "AND   A.STYCD = B.STYCD "
    sql += "AND   B.STYCD = C.STYCD "
    sql += "GROUP BY A.INOUTDT "
    sql += ") "
    sql += "ORDER BY INOUTDT "

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getInOutDt = (req, res) => {
  console.log("============== getInOutDt Call ======================");
  let selectStyle = req.query.selectStyle
  let KINDOFSTYLE = req.query.KINDOFSTYLE.split(',')
  let STYCODE = req.query.STYCODE

  // 최초 판매 날짜
  let sql = "SELECT MIN(INOUTDT) MIN_INOUTDT FROM ( "
  sql += "SELECT INOUTDT FROM BISY021 "
  if(selectStyle == 0) {
    sql += "WHERE MAINSTYCD = '" + KINDOFSTYLE[0] + "' "
  } else {
    sql += "WHERE STYCD = '" + STYCODE + "' "
  }
  sql += "AND SQTY > 0 "
  sql += "UNION ALL "
  sql += "SELECT INOUTDT FROM BISY021 "
  if(selectStyle == 0) {
    sql += "WHERE MAINSTYCD = '" + KINDOFSTYLE[0] + "' "
  } else {
    sql += "WHERE STYCD = '" + STYCODE + "' "
  }
  sql += ")"

  // let sql = "SELECT MIN(INOUTDT) MIN_INOUTDT FROM ( "
  // sql += "SELECT SUBSTR(MIN(INOUTDT),5,2)||'/'||SUBSTR(MIN(INOUTDT),7,2) INOUTDT FROM BISY021 "
  // if(selectStyle == 0) {
  //   sql += "WHERE MAINSTYCD = '" + KINDOFSTYLE[0] + "' "
  // } else {
  //   sql += "WHERE STYCD = '" + STYCODE + "' "
  // }
  // sql += "AND SQTY > 0 "
  // sql += "UNION ALL "
  // sql += "SELECT SUBSTR(MIN(OUTDT),5,2)||'/'||SUBSTR(MIN(OUTDT),7,2) INOUTDT FROM BISY021 "
  // if(selectStyle == 0) {
  //   sql += "WHERE MAINSTYCD = '" + KINDOFSTYLE[0] + "' "
  // } else {
  //   sql += "WHERE STYCD = '" + STYCODE + "' "
  // }
  // sql += ")"

    
  axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSqtyData = (req, res) => {
  console.log("============== getSqtyData Call ======================");
  let fromDate = req.query.fromDate
  let toDate = req.query.toDate
  let gubun_a = req.query.gubun_a
  let gubuns = req.query.gubuns
  let foreign = req.query.foreign
  let selectStyle = req.query.selectStyle
  let KINDOFSTYLE = req.query.KINDOFSTYLE.split(',')
  let STYCODE = req.query.STYCODE

  let c_sql = ""
  if(foreign == "f_except"){  //해외매장 제외
    c_sql += "AND NVL(SHTP,'-1') <> '10' "
  } else if(foreign == "f_store"){  //해외매장
    c_sql += "AND NVL(SHTP,'-1') = '10' "
  }

  if(gubun_a){ // 구분 전체 선택
    c_sql += "AND SOJAE <> 'S' AND RESEQ <> 'S' "
    c_sql += "AND INGU NOT IN ('D') "
    c_sql += "AND VDCD <> 'MI909' "
    c_sql += "AND VVDCDGB <> '20' "
    c_sql += "AND VDCD <> 'SO931' "
    c_sql += "AND RETURNYN <> '1' "
    c_sql += "AND BADGB IS NULL "
    c_sql += "AND VVDCDGB = '0' "
  } else {
    if (gubuns.length > 0) { // 구분
      if(gubuns.includes("s_except")){
        c_sql += "AND SOJAE <> 'S' AND RESEQ <> 'S' "
      } 
      if(gubuns.includes("b_except")){
        c_sql += "AND INGU NOT IN ('D') "
      } 
      if(gubuns.includes("d_except")){
        c_sql += "AND VDCD <> 'MI909' "
      } 
      if(gubuns.includes("l_except")){
        c_sql += "AND VVDCDGB <> '20' "
      } 
      if(gubuns.includes("t_except")){
        c_sql += "AND VDCD <> 'SO931' "
      } 
      if(gubuns.includes("w_except")){
        c_sql += "AND RETURNYN <> '1' "
      } 
      if(gubuns.includes("f_except")){
        c_sql += "AND BADGB IS NULL "
      } 
      if(gubuns.includes("i_except")){
        c_sql += "AND VVDCDGB = '0' "
      }
    }
  }

  // 주간판매 수량,금액
  let sql = "SELECT STYCD, SUBSTR('"+toDate+"',3,2)||'/'||SUBSTR('"+toDate+"',5,2)||'/'||SUBSTR('"+toDate+"',7,2) date, SQTY, SILAMT FROM ( "
  sql += "SELECT STYCD ,SUM(SQTY) SQTY, ROUND(SUM(SILAMT)/1000) SILAMT FROM BISY021 "
  if(selectStyle == 0) {
    sql += "WHERE MAINSTYCD = '" + KINDOFSTYLE[0] + "' "
  } else {
    sql += "WHERE STYCD = '" + STYCODE + "' "
  }
  sql += "AND INOUTDT BETWEEN '"+fromDate+"' AND '"+toDate+"' "
  sql += c_sql  //해외매장 조건
  sql += "GROUP BY STYCD "
  sql += "ORDER BY STYCD "
  sql += ")"

  axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};
