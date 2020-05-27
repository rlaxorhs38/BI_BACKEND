var express = require('express');
const sto0001 = require('../api/service/store/sto0001')
const sto0002 = require('../api/service/store/sto0002')
const sto0101 = require('../api/service/store/sto0101')
const sto0102 = require('../api/service/store/sto0102')
const sto0103 = require('../api/service/store/sto0103')
const sto0003 = require('../api/service/store/sto0003')
const sto0004 = require('../api/service/store/sto0004')
var router = express.Router();

/* STO0001 */
router.get('/getMakeDataDate', sto0001.getMakeDataDate);
router.get('/getRegionData', sto0001.getRegionData);
router.get('/getSelectRegionData', sto0001.getSelectRegionData);
router.get('/getStoreSUData', sto0001.getStoreSUData);
router.get('/getStoreTypeData', sto0001.getStoreTypeData);
router.get('/getStoreOptionData', sto0001.getStoreOptionData);
router.get('/getSelectVDCDStoreInfo', sto0001.getSelectVDCDStoreInfo);
router.get('/getDailyStoreList', sto0001.getDailyStoreList);
router.get('/getMonthStoreList', sto0001.getMonthStoreList);
router.get('/getCumulativeStoreList', sto0001.getCumulativeStoreList);
router.get('/getDailyTotalAMT', sto0001.getDailyTotalAMT);
router.get('/getMonthTotalAMT', sto0001.getMonthTotalAMT);
router.get('/getCumulativeTotalAMT', sto0001.getCumulativeTotalAMT);

/* STO0002 */
router.get('/getMakeDataDate2', sto0002.getMakeDataDate);
router.get('/getStoreDailyList', sto0002.getStoreDailyList);
router.get('/getStoreMonthList', sto0002.getStoreMonthList);
router.get('/getStoreCumulativeList', sto0002.getStoreCumulativeList);

/* STO0101 */
router.get('/getMakeDataDate3', sto0101.getMakeDataDate);
router.get('/getMonthlyHeaderData', sto0101.getHeaderData);
router.get('/getMonthlySalesChartData', sto0101.getSalesChartData);
router.get('/getMonthlySalesLineCharData', sto0101.getSalesLineCharData);
router.get('/getMonthlySalesAnalysisData', sto0101.getSalesAnalysisData);

/* STO0102 */
router.get('/getMakeDataDate4', sto0102.getMakeDataDate);
router.get('/getDailyData', sto0102.getDailyData);
router.get('/getDailyChartCountData', sto0102.getDailyChartCountData);
router.get('/getDailyChartAMTData', sto0102.getDailyChartAMTData);
router.get('/getDailyChartListData', sto0102.getDailyChartListData);
router.get('/getCurrentYearData', sto0102.getCurrentYearData);
router.get('/getDailyStoreListData', sto0102.getDailyStoreListData);

/* STO0103 */
router.get('/getMakeDataDate5', sto0103.getMakeDataDate);
router.get('/getHeaderData', sto0103.getHeaderData);
router.get('/getSalesChartData', sto0103.getSalesChartData);
router.get('/getSalesLineCharData', sto0103.getSalesLineCharData);
router.get('/getSalesAnalysisData', sto0103.getSalesAnalysisData);

/* STO0003 */
router.get('/getMainCurrentStatus', sto0003.getMainCurrentStatus);
router.get('/getMainLastStatus', sto0003.getMainLastStatus);
router.get('/getOpenCloseStore', sto0003.getOpenCloseStore);
router.get('/getInDeCreaseStore', sto0003.getInDeCreaseStore);
router.get('/getCuIndexStore', sto0003.getCuIndexStore);
router.get('/getLastIndexStore', sto0003.getLastIndexStore);
router.get('/getMonthlySalesAverage', sto0003.getMonthlySalesAverage);
router.get('/getStoreSalesAverage', sto0003.getStoreSalesAverage);
router.get('/getMonthAvg', sto0003.getMonthAvg);
router.get('/getMonthStoreAvg', sto0003.getMonthStoreAvg);

router.get('/getSalesTotal', sto0003.getSalesTotal);

/* STO0004 */
router.get('/getMakeDataDate6', sto0004.getMakeDataDate);
router.get('/getMonthlySalesStatus', sto0004.getMonthlySalesStatus);
router.get('/getSHTPNMList', sto0004.getSHTPNMList);

module.exports = router;
