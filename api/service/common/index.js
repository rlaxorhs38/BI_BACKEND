var axios = require('axios');
const db = require('../../config/db')

exports.accessControl = (req, res, next) => {
    console.log("============== accessControl Call ======================");

    req.session.token = "smzH^8^N9}N`B[t."; //개발 테스트용 운영 반영 시 삭제
    // 토큰 가져오기
    let sql = "SELECT MEMO FROM BICM010 ";
    sql += "WHERE GBNCD = 'M0001' ";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => {    
      if (reault.MACHBASE_ERROR) {
        res.status(400).send("확인이 필요합니다.");
      } else {
        if (reault.MEMO == req.session.token) {
            res.send("OK")
        } else {
          if (reault.MEMO) {
            res.status(403).send("접속권한이 없습니다.");
          } else {
            res.status(401).send("TOKEN 정보가 없습니다.");
          }
        }
      }
    },
    reject =>{
        res.status(500).send("DB접속이 불가합니다. DB확인 후 다시 시도해 주시기 바랍니다.");
    })
};

exports.getAssignedMenuList = (req, res, next) => {
    console.log("============== getAssignedMenuList Call ======================");

    let empcd = req.query.empcd;

    // 메뉴 권한 가져오기
    let sql = "SELECT GBNCD FROM BIGR010 ";
    sql += "WHERE EMPCD = '" + empcd + "' ";
    sql += "GROUP BY GBNCD ";
    sql += "ORDER BY GBNCD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getAssignedPageList = (req, res, next) => {
    console.log("============== getAssignedPageList Call ======================");

    let empcd = req.query.empcd;

    // 화면 권한 가져오기
    let sql = "SELECT GBNCD, PROCD, VIEWYN, PRINTYN FROM BIGR010 ";
    sql += "WHERE EMPCD = '" + empcd + "' ";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getAssignedSUList = (req, res, next) => {
    console.log("============== getAssignedSUList Call ======================");
    
    let empcd = req.query.empcd;
    
    // 사업부 권한 가져오기
    let sql = "SELECT GBNCD, MCODE, CODNM, SORTORD FROM ";
    sql += "(SELECT GBNCD, MCODE FROM BIGR010 ";
    sql += "WHERE EMPCD = '" + empcd + "' "; 
    sql += "AND GRTCD = 'BI1001' ";
    sql += "AND VIEWYN = 'Y') A, ";
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE GBNCD = 'C0002' ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD) B ";
    sql += "WHERE A.MCODE = B.CODE ";
    sql += "ORDER BY A.GBNCD, B.SORTORD";
    console.log("getAssignedSUList >>> ", sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getAssignedBrandList = (req, res, next) => {
    console.log("============== getAssignedBrandList Call ======================");

    let empcd = req.query.empcd;

    // 브랜드 권한 가져오기
    let sql = "SELECT GBNCD, MCODE, CODNM, SORTORD FROM ";
    sql += "(SELECT GBNCD, MCODE FROM BIGR010 ";
    sql += "WHERE EMPCD = '" + empcd + "' ";
    sql += "AND GRTCD = 'BI1002' ";
    sql += "AND VIEWYN = 'Y') A, ";
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE GBNCD = 'C0003' ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD) B ";
    sql += "WHERE A.MCODE = B.CODE ";
    sql += "ORDER BY A.GBNCD, B.SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getFDRList = (req, res, next) => {
    console.log("============== getFDRList Call ======================");
    
    // 데일리리포트(사업부 기준)
    let sql = "";
    sql += "SELECT A.GBNCD, A.MCODE, B.CODNM, B.SORTORD FROM ";
    sql += "(SELECT GBNCD, MCODE FROM BICM012 ";
    sql += "WHERE MENUCD = 'FDR' ";
    sql += "AND VIEWYN = 'Y' ";
    sql += "GROUP BY GBNCD, MCODE ";
    sql += "ORDER BY MCODE) A, ";
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE (GBNCD = 'C0002' OR GBNCD = 'C0003') ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD) B ";
    sql += "WHERE A.MCODE = B.CODE ";
    sql += "ORDER BY B.SORTORD ";
    console.log("getFDRList Call  >>> ", sql);
    
    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getFINLIST = (req, res, next) => {
    console.log("============== getFINLIST Call ======================");

    // 재무(사업부, 브랜드 기준)
    let sql = "";
    sql += "SELECT A.GBNCD, A.MCODE, B.CODNM, B.SORTORD FROM ";
    sql += "(SELECT GBNCD, MCODE FROM BICM012 ";
    sql += "WHERE MENUCD = 'FIN' ";
    sql += "AND VIEWYN = 'Y' ";
    sql += "GROUP BY GBNCD, MCODE ";
    sql += "ORDER BY MCODE) A, ";
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE (GBNCD = 'C0002' OR GBNCD = 'C0003') ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD) B ";
    sql += "WHERE A.MCODE = B.CODE ";
    sql += "ORDER BY A.GBNCD, B.SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSALList = (req, res, next) => {
    console.log("============== getSALList Call ======================");

    // 영업(사업부 기준)
    let sql = "";
    sql += "SELECT A.GBNCD, A.MCODE, B.CODNM, B.SORTORD FROM ";
    sql += "(SELECT GBNCD, MCODE FROM BICM012 ";
    sql += "WHERE MENUCD = 'SAL' ";
    sql += "AND VIEWYN = 'Y' ";
    sql += "GROUP BY GBNCD, MCODE ";
    sql += "ORDER BY MCODE) A, ";
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE (GBNCD = 'C0002' OR GBNCD = 'C0003') ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD) B ";
    sql += "WHERE A.MCODE = B.CODE ";
    sql += "ORDER BY B.SORTORD ";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getWRPList = (req, res, next) => {
    console.log("============== getWRPList Call ======================");

    // 주간보고(사업부 기준)
    let sql = "";
    sql += "SELECT A.GBNCD, A.MCODE, B.CODNM, B.SORTORD FROM ";
    sql += "(SELECT GBNCD, MCODE FROM BICM012 ";
    sql += "WHERE MENUCD = 'WRP' ";
    sql += "AND VIEWYN = 'Y' ";
    sql += "GROUP BY GBNCD, MCODE ";
    sql += "ORDER BY MCODE) A, ";
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE (GBNCD = 'C0002' OR GBNCD = 'C0003') ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD) B ";
    sql += "WHERE A.MCODE = B.CODE ";
    sql += "ORDER BY B.SORTORD ";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSTYList = (req, res, next) => {
    console.log("============== getSTYList Call ======================");

    // 스타일(브랜드 기준)
    let sql = "";
    sql += "SELECT A.GBNCD, A.MCODE, B.CODNM, B.SORTORD FROM ";
    sql += "(SELECT GBNCD, MCODE FROM BICM012 ";
    sql += "WHERE MENUCD = 'STY' ";
    sql += "AND VIEWYN = 'Y' ";
    sql += "GROUP BY GBNCD, MCODE ";
    sql += "ORDER BY MCODE) A, ";
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE (GBNCD = 'C0002' OR GBNCD = 'C0003') ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD) B ";
    sql += "WHERE A.MCODE = B.CODE ";
    sql += "ORDER BY B.SORTORD ";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSTOList = (req, res, next) => {
    console.log("============== getSTOList Call ======================");

    // 매장(브랜드 기준)
    let sql = "";
    sql += "SELECT A.GBNCD, A.MCODE, B.CODNM, B.SORTORD FROM ";
    sql += "(SELECT GBNCD, MCODE FROM BICM012 ";
    sql += "WHERE MENUCD = 'STO' ";
    sql += "AND VIEWYN = 'Y' ";
    sql += "GROUP BY GBNCD, MCODE ";
    sql += "ORDER BY MCODE) A, ";
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE (GBNCD = 'C0002' OR GBNCD = 'C0003') ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD) B ";
    sql += "WHERE A.MCODE = B.CODE ";
    sql += "ORDER BY B.SORTORD ";
    console.log("스토어 getSTOList >>>", sql)

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getCRMList = (req, res, next) => {
    console.log("============== getCRMList Call ======================");

    // CRM(브랜드 기준)
    let sql = "";
    sql += "SELECT A.GBNCD, A.MCODE, B.CODNM, B.SORTORD FROM ";
    sql += "(SELECT GBNCD, MCODE FROM BICM012 ";
    sql += "WHERE MENUCD = 'CRM' ";
    sql += "AND VIEWYN = 'Y' ";
    sql += "GROUP BY GBNCD, MCODE ";
    sql += "ORDER BY MCODE) A, ";
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE (GBNCD = 'C0002' OR GBNCD = 'C0003') ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD) B ";
    sql += "WHERE A.MCODE = B.CODE ";
    sql += "ORDER BY B.SORTORD ";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getPROList = (req, res, next) => {
    console.log("============== getPROList Call ======================");

    // 생산(사업부 기준)
    let sql = "";
    sql += "SELECT A.GBNCD, A.MCODE, B.CODNM, B.SORTORD FROM ";
    sql += "(SELECT GBNCD, MCODE FROM BICM012 ";
    sql += "WHERE MENUCD = 'PRO' ";
    sql += "AND VIEWYN = 'Y' ";
    sql += "GROUP BY GBNCD, MCODE ";
    sql += "ORDER BY MCODE) A, ";
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE (GBNCD = 'C0002' OR GBNCD = 'C0003') ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD) B ";
    sql += "WHERE A.MCODE = B.CODE ";
    sql += "ORDER BY B.SORTORD ";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getBUYList = (req, res, next) => {
    console.log("============== getBUYList Call ======================");

    // 구매(사업부 기준)
    let sql = "";
    sql += "SELECT A.GBNCD, A.MCODE, B.CODNM, B.SORTORD FROM ";
    sql += "(SELECT GBNCD, MCODE FROM BICM012 ";
    sql += "WHERE MENUCD = 'BUY' ";
    sql += "AND VIEWYN = 'Y' ";
    sql += "GROUP BY GBNCD, MCODE ";
    sql += "ORDER BY MCODE) A, ";
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE (GBNCD = 'C0002' OR GBNCD = 'C0003') ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD) B ";
    sql += "WHERE A.MCODE = B.CODE ";
    sql += "ORDER BY B.SORTORD ";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getHUMList = (req, res, next) => {
    console.log("============== getHUMList Call ======================");

    // 인재DB(브랜드 기준)
    let sql = "";
    sql += "SELECT A.GBNCD, A.MCODE, B.CODNM, B.SORTORD FROM ";
    sql += "(SELECT GBNCD, MCODE FROM BICM012 ";
    sql += "WHERE MENUCD = 'HUM' ";
    sql += "AND VIEWYN = 'Y' ";
    sql += "GROUP BY GBNCD, MCODE ";
    sql += "ORDER BY MCODE) A, ";
    sql += "(SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE (GBNCD = 'C0002' OR GBNCD = 'C0003') ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD) B ";
    sql += "WHERE A.MCODE = B.CODE ";
    sql += "ORDER BY B.SORTORD ";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSDCOMPANYCDList = (req, res, next) => {
    console.log("============== getSDCOMPANYCDList Call ======================");

    // 인재정보 자사타사구분
    let sql = "";
    sql += "SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE GBNCD = 'HR001' ";
    sql += "AND CODE IN ('1','2')"
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSECOMPANYCDList = (req, res, next) => {
    console.log("============== getSECOMPANYCDList Call ======================");

    // 인재정보 자사타사구분
    let sql = "";
    sql += "SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE GBNCD = 'HR001' ";
    sql += "AND CODE IN ('3','4')"
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getJAEJIGCDList = (req, res, next) => {
    console.log("============== getJAEJIGCDList Call ======================");

    // 인재정보 재직구분
    let sql = "";
    sql += "SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE GBNCD = 'HR002' ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getCHGUCDList = (req, res, next) => {
    console.log("============== getCHGUCDList Call ======================");

    // 인재정보 유통구분
    let sql = "";
    sql += "SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE GBNCD = 'HR003' ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getAMTRATINGCDList = (req, res, next) => {
    console.log("============== getAMTRATINGCDList Call ======================");

    // 인재정보 평가등급
    let sql = "";
    sql += "SELECT CODE, CODNM, SORTORD FROM BICM011 ";
    sql += "WHERE GBNCD = 'HR004' ";
    sql += "AND USEYN = 'Y' ";
    sql += "ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSUCDCardList = (req, res, next) => {
    console.log("============== getSUCDCardList Call ======================");

    // 사업부 카드 CODE
    let sql = "SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' AND ADDINFO1 = 'Y' ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getSUCDList = (req, res, next) => {
    console.log("============== getSUCDList Call ======================");

    // 사업부 CODE
    let sql = "SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getBRCDList = (req, res, next) => {
    console.log("============== getBRCDList Call ======================");

    // 브랜드 CODE
    let sql = "SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0003' AND USEYN = 'Y' ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getBRCDCardList = (req, res, next) => {
    console.log("============== getBRCDCardList Call ======================");

    // 브랜드 카드 CODE
    let sql = "SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0003' AND USEYN = 'Y' AND ADDINFO1 = 'Y' ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getFasionSUCDList = (req, res, next) => {
    console.log("============== getFasionSUCDList Call ======================");

    // 패션사업 사업부 CODE
    let sql = "SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' AND ADDINFO1 = 'Y' AND ADDINFO = 'F' ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getFutureSUCDList = (req, res, next) => {
    console.log("============== getFutureSUCDList Call ======================");

    // 미래성장사업 사업부 CODE
    let sql = "SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' AND ADDINFO1 = 'Y' AND ADDINFO = 'N' ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStopSUCDList = (req, res, next) => {
    console.log("============== getStopSUCDList Call ======================");

    // 중단사업 사업부 CODE
    let sql = "SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0002' AND USEYN = 'Y' AND ADDINFO1 = 'Y' AND ADDINFO = 'S' ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getFasionBRCDList = (req, res, next) => {
    console.log("============== getFasionBRCDList Call ======================");

    // 패션사업 브랜드 CODE
    let sql = "SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0003' AND USEYN = 'Y' AND ADDINFO1 = 'Y' AND ADDINFO = 'F' ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getFutureBRCDList = (req, res, next) => {
    console.log("============== getFutureBRCDList Call ======================");

    // 미래성장사업 브랜드 CODE
    let sql = "SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0003' AND USEYN = 'Y' AND ADDINFO1 = 'Y' AND ADDINFO = 'N' ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getStopBRCDList = (req, res, next) => {
    console.log("============== getStopBRCDList Call ======================");

    // 중단사업 브랜드 CODE
    let sql = "SELECT CODE, CODNM FROM BICM011 WHERE GBNCD = 'C0003' AND USEYN = 'Y' AND ADDINFO1 = 'Y' AND ADDINFO = 'S' ORDER BY SORTORD";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getYearCodeList = (req, res, next) => {
    console.log("============== getYearCodeList Call ======================");

    // 연도 CODE
    let sql = "SELECT CODE, CODNM YYYY FROM BICM011 WHERE GBNCD = 'C0005' AND USEYN = 'Y' ORDER BY CODE";

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};

exports.getRegionData = (req, res, next) => {
    console.log("============== getRegionData Call ======================");
    
    // 시도,시군구
    let sql = "SELECT SIDO region , SGU title, x, y FROM BICM014"
    sql += " GROUP BY region, title, x, y"
    sql += " ORDER BY region, title"

    axios.get(db.DB_URL + '?q=' + encodeURIComponent(sql)).then(x => x.data).then(reault => res.send(reault))
};