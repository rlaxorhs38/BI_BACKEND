var express = require('express');
const service = require('../api/service/product')
var router = express.Router();

/* COMMON */
router.get('/getMakeDataDate', service.getMakeDataDate);

/* PRO0101 */
router.get('/getProData', service.getProData);

/* PRO0102 */
router.get('/getData', service.getData);

/* PRO0103 */
router.get('/getMonthlyDetailData', service.getMonthlyDetailData);

module.exports = router;
