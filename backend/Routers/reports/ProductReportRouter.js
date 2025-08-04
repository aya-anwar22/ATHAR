const express = require('express');
const router = express.Router();
const {
  getInventoryReport,
  getDeletedProductsReport,
  getPriceReport,
  getGenderReport,
  getBrandReport,
  getSubcategoryReport,
  getTimeBasedReport,
} = require('../../controllers/reports/productReportControllers');

// 🛒 1. Inventory Report
router.get('/inventory', getInventoryReport);

// 🧾 2. Soft Deleted Products
router.get('/deleted', getDeletedProductsReport);

// 💰 3. Price Report
router.get('/price', getPriceReport);

// 🧍‍♂️🧍‍♀️ 4. Gender-Based Report
router.get('/gender', getGenderReport);

// 🏷️ 5. Brand Report
router.get('/brands', getBrandReport);

// 📂 6. Subcategory Report
router.get('/subcategories', getSubcategoryReport);

// 🕓 7. Time-based Report
// مثال: /api/v1/report-product/time?from=2024-01-01&to=2024-12-31
router.get('/time', getTimeBasedReport);

module.exports = router;
