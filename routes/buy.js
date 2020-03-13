var express = require('express');
const service = require('../api/service/buy')
var router = express.Router();

/* BUY0101 */
router.get('/getMakeDataDate', service.getMakeDataDate);
router.get('/getBuyData', service.getBuyData);

/* BUY0102 */
router.get('/getCurrentYearData', service.getCurrentYearData);
router.get('/getLastYearData', service.getLastYearData);

module.exports = router;
