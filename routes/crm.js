var express = require('express');
const service = require('../api/service/crm')
var router = express.Router();

/* CRM0001 */
router.get('/getMakeDataDate', service.getMakeDataDate);
router.get('/getSalesBest3', service.getSalesBest3);
router.get('/getDataByAge', service.getDataByAge);
router.get('/getItemDataByAge', service.getItemDataByAge);
router.get('/getNewCustomerCount', service.getNewCustomerCount);
router.get('/getNewCustomerCountByPeriod', service.getNewCustomerCountByPeriod);
router.get('/getCurrentCustomerCount', service.getCurrentCustomerCount);
router.get('/getCurrentCustomerCountByPeriod', service.getCurrentCustomerCountByPeriod);
router.get('/getDormancyCustomerCount', service.getDormancyCustomerCount);
router.get('/getSumSalesForCurrentMonth', service.getSumSalesForCurrentMonth);
router.get('/getCustomerSalesDataByAge', service.getCustomerSalesDataByAge);

module.exports = router;
