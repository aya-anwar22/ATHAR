const express = require('express');
const router = express.Router();
const { getCartReport } = require('../../controllers/reports/cartReportController');

router.get('/', getCartReport);

module.exports = router;
