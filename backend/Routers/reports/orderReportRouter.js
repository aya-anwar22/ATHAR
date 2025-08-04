const express = require('express');
const router = express.Router();
const {
  getOrderSummaryReport,
  getOrderStatusReport,
  getTopSellingProducts,
  getPaymentMethodReport,
  getReturnOrdersReport,
  getCancelledOrdersReport,
  getOrdersBetweenDates,
  getTopCustomersReport
} = require('../../controllers/reports/orderReportControllers');

router.get('/summary', getOrderSummaryReport);
router.get('/status', getOrderStatusReport);
router.get('/top-products', getTopSellingProducts);
router.get('/payment-method', getPaymentMethodReport);
router.get('/returns', getReturnOrdersReport);
router.get('/cancelled', getCancelledOrdersReport);
router.get('/between-dates', getOrdersBetweenDates);
router.get('/top-customers', getTopCustomersReport);

module.exports = router;