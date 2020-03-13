var express = require('express');
const service = require('../api/service/sales')
var router = express.Router();

/* SAL0001 */
router.get('/getMakeDataDate', service.getMakeDataDate);
router.get('/getTotalSalesData', service.getTotalSalesData);
router.get('/getYearSalesData', service.getYearSalesData);
router.get('/getMonthSalesData', service.getMonthSalesData);
router.get('/getMonthDiscountData', service.getMonthDiscountData);
router.get('/getMonthTotalSalesData', service.getMonthTotalSalesData);

module.exports = router;
