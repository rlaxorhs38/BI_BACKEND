var express = require('express');
const service = require('../api/service/style')
const sty0001 = require('../api/service/style/sty0001')
const sty0101 = require('../api/service/style/sty0101')
const sty0102 = require('../api/service/style/sty0102')
const sty0301 = require('../api/service/style/sty0301')
var router = express.Router();

/* COMMON */
router.get('/getMakeDataDate', service.getMakeDataDate);

/* STY0001 */
router.post('/searchStyle', sty0001.searchStyle);
router.post('/getStyleTopData', sty0001.getStyleTopData);
router.get('/getDesignerTopData', sty0001.getDesignerTopData);

/* STY0101 */
router.get('/getClothData', sty0101.getClothData);
router.get('/getKindOfStyle', sty0101.getKindOfStyle);
router.get('/getAccClothSaleData', sty0101.getAccClothSaleData);
router.get('/getInOutQty', sty0101.getInOutQty);
router.get('/getClothJRData', sty0101.getClothJRData);
router.get('/getAccClothSaleRate', sty0101.getAccClothSaleRate);
router.get('/getInOutDt', sty0101.getInOutDt);
router.get('/getSqtyData', sty0101.getSqtyData);

/* STY0102 */
router.get('/getOutQty', sty0102.getOutQty);
router.get('/getOutInfo', sty0102.getOutInfo);
router.get('/getStoreQTYData', sty0102.getStoreQTYData);
router.get('/getStoreQTYColSz', sty0102.getStoreQTYColSz);
router.get('/getColorCode', sty0102.getColorCode);
router.get('/getStoreListData', sty0102.getStoreListData);
router.get('/getDistributionListData', sty0102.getDistributionListData);

/* STY0301 */
router.get('/getStoreKind', sty0301.getStoreKind);
router.get('/getstoreList', sty0301.getstoreList);
router.get('/getClothCodeList', sty0301.getClothCodeList);
router.get('/getFabricsCodeList', sty0301.getFabricsCodeList);

module.exports = router;
