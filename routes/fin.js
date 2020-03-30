var express = require('express');
const service = require('../api/service/fin')
const fin0001 = require('../api/service/fin/fin0001')
const fin0101 = require('../api/service/fin/fin0101')
const fin0102 = require('../api/service/fin/fin0102')
const fin0201 = require('../api/service/fin/fin0201')
const fin0202 = require('../api/service/fin/fin0202')
const fin0301 = require('../api/service/fin/fin0301')
const fin0302 = require('../api/service/fin/fin0302')
const fin0401 = require('../api/service/fin/fin0401')
const fin0402 = require('../api/service/fin/fin0402')
const fin0501 = require('../api/service/fin/fin0501')
const fin0502 = require('../api/service/fin/fin0502')
var router = express.Router();

/* COMMON */
router.get('/getMakeDataDate', service.getMakeDataDate);
router.get('/getRecentDate', service.getRecentDate);
router.get('/getMakeDataDate2', service.getMakeDataDate2);
router.get('/getRecentDate2', service.getRecentDate2);

/* FIN0001 */
router.get('/getRecentBIFN050Date', fin0001.getRecentBIFN050Date);
router.get('/getRecentBIFN051Date', fin0001.getRecentBIFN051Date);
router.get('/getDailySalesData', fin0001.getDailySalesData);
router.get('/getSaleData', fin0001.getSaleData);
router.get('/getTotSaleData', fin0001.getTotSaleData);
router.get('/getCashData', fin0001.getCashData);
router.get('/getTotCashData', fin0001.getTotCashData);
router.get('/getProfitData', fin0001.getProfitData);
router.get('/getTotProfitData', fin0001.getTotProfitData);
router.get('/getStockData', fin0001.getStockData);
router.get('/getResourceData', fin0001.getResourceData);

/* FIN0101 */
router.get('/getRecentBISL061Date', fin0101.getRecentBISL061Date);
router.get('/getTotalSalesData', fin0101.getTotalSalesData);
router.get('/getCumulativeData', fin0101.getCumulativeData);
router.get('/getChartData2', fin0101.getChartData2);
router.get('/getCurrentYearData', fin0101.getCurrentYearData);
router.get('/getStoreList', fin0101.getStoreList);
router.get('/getSalesChartCount', fin0101.getSalesChartCount);
router.get('/getSalesChartAMT', fin0101.getSalesChartAMT);
router.get('/getCumulativeSales', fin0101.getCumulativeSales);

/* FIN0102 */
router.get('/getsalesRanking', fin0102.getsalesRanking);

/* FIN0201 */
router.get('/getSaleData2', fin0201.getSaleData);
router.get('/getSaleTotRate', fin0201.getSaleTotRate);
router.get('/getSaleDeptData', fin0201.getSaleDeptData);
router.get('/getDepartmentList', fin0201.getDepartmentList);
router.get('/getSaleBrandDeptData', fin0201.getSaleBrandDeptData);

/* FIN0202 */
router.get('/getSaleData3', fin0202.getSaleData);
router.get('/getSaleTotRate2', fin0202.getSaleTotRate);
router.get('/getSaleDeptData2', fin0202.getSaleDeptData);
router.get('/getSaleBrandDeptData2', fin0202.getSaleBrandDeptData);

/* FIN0301 */
router.get('/getCashData2', fin0301.getCashData);
router.get('/getDeptCashData', fin0301.getDeptCashData);
router.get('/getBrandCashData', fin0301.getBrandCashData);
router.get('/getDepartmentList2', fin0301.getDepartmentList);

/* FIN0302 */
router.get('/getCashData3', fin0302.getCashData);
router.get('/getSaleTotRate3', fin0302.getSaleTotRate);
router.get('/getDeptCashData2', fin0302.getDeptCashData);
router.get('/getBrandCashData2', fin0302.getBrandCashData);

/* FIN0401 */
router.get('/getProfitData2', fin0401.getProfitData);
router.get('/getDeptProfitData', fin0401.getDeptProfitData);
router.get('/getDeptBrandProfitData', fin0401.getDeptBrandProfitData);
router.get('/getDepartmentList3', fin0401.getDepartmentList);

/* FIN0402 */
router.get('/getProfitData3', fin0402.getProfitData);
router.get('/getDeptProfitData2', fin0402.getDeptProfitData);
router.get('/getDeptBrandProfitData2', fin0402.getDeptBrandProfitData);

/* FIN0501 */
router.get('/getStockData2', fin0501.getStockData);
router.get('/getDeptStockData', fin0501.getDeptStockData);
router.get('/getDepartmentList4', fin0501.getDepartmentList);

/* FIN0502 */
router.get('/getStockData3', fin0502.getStockData);
router.get('/getDeptStockData2', fin0502.getDeptStockData);

module.exports = router;
