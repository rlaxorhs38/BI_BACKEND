var express = require('express');
const service = require('../api/service/hum')
const hum0001 = require('../api/service/hum/hum0001.js')
const hum0002 = require('../api/service/hum/hum0002.js')
const hum0101 = require('../api/service/hum/hum0101.js')
const hum0103 = require('../api/service/hum/hum0103.js')
const hum0201 = require('../api/service/hum/hum0201.js')
const hum0301 = require('../api/service/hum/hum0301.js')
const hum0401 = require('../api/service/hum/hum0401.js')
var router = express.Router();

/* COMMON */
router.get('/getMakeDataDate', service.getMakeDataDate);

/* HUM0001 */
router.get('/getStoreCountByType', hum0001.getStoreCountByType);
router.get('/getTotalSDCount', hum0001.getTotalSDCount);
router.get('/getRegionSDCount', hum0001.getRegionSDCount);

/* HUM0002 */
router.get('/getSDList', hum0002.getSDList);
router.get('/getBrandCodeList', hum0002.getBrandCodeList);
router.get('/getSiList', hum0002.getSiList);
router.get('/getGuList', hum0002.getGuList);
router.get('/getCHGUCOMList', hum0002.getCHGUCOMList);
router.get('/searchSD', hum0002.searchSD);

/* HUM0101 */
router.get('/getRegionData', hum0101.getRegionData);
router.get('/getSiGuData', hum0101.getSiGuData);
router.get('/getChageChgucdRegionData', hum0101.getChageChgucdRegionData);
router.get('/getChageChgucdGuData', hum0101.getChageChgucdGuData);
router.get('/getVDCDList', hum0101.getVDCDList);
router.post('/getSDInfo', hum0101.getSDInfo);

/* HUM0103 */
router.post('/getSDSalesData', hum0103.getSDSalesData);

/* hum0201 */
router.get('/getRatingInfoData', hum0201.getRatingInfoData);
router.get('/getSalesManagerData', hum0201.getSalesManagerData);
router.get('/getSalesManInfo', hum0201.getSalesManInfo);
router.get('/getSalesResultData', hum0201.getSalesResultData);
router.get('/getAccumulatedSalesData', hum0201.getAccumulatedSalesData);
router.get('/getSalesInfoData', hum0201.getSalesInfoData);
router.get('/getLeftInfoData', hum0201.getLeftInfoData);
router.get('/getBagicInfoTopData', hum0201.getBagicInfoTopData);
router.get('/getStyleStoreTop10', hum0201.getStyleStoreTop10);
router.get('/getStyleSucdTop10', hum0201.getStyleSucdTop10);
router.get('/getAdditionalInfo', hum0201.getAdditionalInfo);
router.get('/getSpecialNote', hum0201.getSpecialNote);

/* hum0301 */
router.get('/getLeftInfoData2', hum0301.getLeftInfoData2);
router.get('/getBagicInfoTopData2', hum0301.getBagicInfoTopData2);
router.get('/getSpecialNote2', hum0301.getSpecialNote2);
router.get('/getSalesManagerData2', hum0301.getSalesManagerData2);

/* hum0401 */
router.get('/getLeftInfoData3', hum0401.getLeftInfoData3);
router.get('/getBagicInfoTopData3', hum0401.getBagicInfoTopData3);
router.get('/getSpecialNote3', hum0401.getSpecialNote3);
router.get('/getSalesManagerData3', hum0401.getSalesManagerData3);

module.exports = router;
