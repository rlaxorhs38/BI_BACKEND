var express = require('express');
const service = require('../api/service/online')
var router = express.Router();

/* ONL0101 */
router.get('/getMakeDataDate', service.getMakeDataDate);
router.get('/getLatelySalesDate', service.getLatelySalesDate);
router.get('/getSaleData', service.getSaleData);
router.get('/getSaleDeptCount', service.getSaleDeptCount);
router.get('/getSaleDeptData', service.getSaleDeptData);
router.get('/getSaleBrandCount', service.getSaleBrandCount);
router.get('/getSaleBrandData', service.getSaleBrandData);

/* ONL0102 */
router.get('/getBrandDetailData', service.getBrandDetailData);
router.get('/getMallDetailData', service.getMallDetailData);

/* ONL0103 */
router.get('/getSaleByBrandList', service.getSaleByBrandList);
router.get('/getITOnOffSaleList', service.getITOnOffSaleList);
router.get('/getBaseSaleList', service.getBaseSaleList);
router.get('/getDailySaleList', service.getDailySaleList);
router.get('/getMonthlySaleList', service.getMonthlySaleList);
router.get('/geJasaSaleList', service.geJasaSaleList);

router.get('/getMonthlySaleList_POP', service.getDailySaleList_POP);

/* ONL0104 */
router.get('/getSaleByBrdDetailData', service.getSaleByBrdDetailData);
router.get('/getITOnOffDetailData', service.getITOnOffDetailData);

module.exports = router;
