var express = require('express');
const wee0101 = require('../api/service/wee/wee0101')
const wee0201 = require('../api/service/wee/wee0201')
const wee0301 = require('../api/service/wee/wee0301')
const wee0401 = require('../api/service/wee/wee0401')
var router = express.Router();

/* COMMON */
router.get('/getMakeDataDate', wee0401.getMakeDataDate);

/* WEE0101 */
router.get('/getDataByClothingType', wee0101.getDataByClothingType);
router.get('/getMonthlySalesData', wee0101.getMonthlySalesData);
router.get('/getForeignerData', wee0101.getForeignerData);
router.get('/getForeignerSumData', wee0101.getForeignerSumData);
router.get('/getSalesResultData', wee0101.getSalesResultData);

/* WEE0201 */
router.get('/get0201MakeDataDate', wee0201.getMakeDataDate);
router.post('/getSaleRate', wee0201.getSaleRate);
router.post('/getWeeklyBestSale', wee0201.getWeeklyBestSale);
router.post('/getMCount', wee0201.getMCount);
router.get('/getMaxCnt', wee0201.getMaxCnt);
router.post('/getStyle20', wee0201.getStyle20);
router.post('/getStyle20VDSNM', wee0201.getStyle20VDSNM);
router.post('/getStyle20COLOR', wee0201.getStyle20COLOR);

/* WEE0301 */
router.get('/get0301MakeDataDate', wee0301.MakeDataDate);
router.post('/getStyle', wee0301.getStyle);
router.post('/getStyleDetail', wee0301.getStyleDetail);
router.post('/getStyleStore', wee0301.getStyleStore);

/* WEE0401 */
router.get('/get0401MakeDataDate', wee0401.getMakeDataDate);
router.post('/getWeeklySale', wee0401.getWeeklySale);
router.post('/getWeeklySSUM', wee0401.getWeeklySSUM);
router.post('/getWeeklyTSUM', wee0401.getWeeklyTSUM);
router.post('/getWeeklyGraph', wee0401.getWeeklyGraph);

module.exports = router;
