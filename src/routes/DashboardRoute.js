const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const {authUserMiddleWare, authMiddleWare} = require('../middleware/authMiddleWare');

router.get('/get-revenue-by-day',authMiddleWare, dashboardController.getRevenueByDay);
router.get('/get-revenue-by-month',authMiddleWare, dashboardController.getRevenueByMonth);
router.get('/get-revenue-by-year',authMiddleWare, dashboardController.getRevenueByYear);
router.get('/get-total-revenue',authMiddleWare, dashboardController.getTotalRevenue);
router.get('/paidvsunpaid',authMiddleWare, dashboardController.getPaidVsUnpaid);
module.exports = router;