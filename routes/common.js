var express = require('express');
const service = require('../api/service/common')
var router = express.Router();

/* COMMON */
router.get('/accessControl', service.accessControl);
router.get('/getAssignedMenuList', service.getAssignedMenuList);
router.get('/getAssignedPageList', service.getAssignedPageList);
router.get('/getAssignedSUList', service.getAssignedSUList);
router.get('/getAssignedBrandList', service.getAssignedBrandList);
router.get('/getFDRList', service.getFDRList);
router.get('/getFINLIST', service.getFINLIST);
router.get('/getSALList', service.getSALList);
router.get('/getWRPList', service.getWRPList);
router.get('/getSTYList', service.getSTYList);
router.get('/getSTOList', service.getSTOList);
router.get('/getCRMList', service.getCRMList);
router.get('/getPROList', service.getPROList);
router.get('/getBUYList', service.getBUYList);
router.get('/getHUMList', service.getHUMList);
router.get('/getSDCOMPANYCDList', service.getSDCOMPANYCDList);
router.get('/getSECOMPANYCDList', service.getSECOMPANYCDList);
router.get('/getJAEJIGCDList', service.getJAEJIGCDList);
router.get('/getCHGUCDList', service.getCHGUCDList);
router.get('/getAMTRATINGCDList', service.getAMTRATINGCDList);
router.get('/getSUCDCardList', service.getSUCDCardList);
router.get('/getSUCDList', service.getSUCDList);
router.get('/getBRCDList', service.getBRCDList);
router.get('/getBRCDCardList', service.getBRCDCardList);
router.get('/getFasionSUCDList', service.getFasionSUCDList);
router.get('/getFutureSUCDList', service.getFutureSUCDList);
router.get('/getStopSUCDList', service.getStopSUCDList);
router.get('/getFasionBRCDList', service.getFasionBRCDList);
router.get('/getFutureBRCDList', service.getFutureBRCDList);
router.get('/getStopBRCDList', service.getStopBRCDList);
router.get('/getYearCodeList', service.getYearCodeList);

/* mapVewHr */
router.get('/getRegionData', service.getRegionData);

module.exports = router;
