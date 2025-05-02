const DashboardService = require('../services/DashboardService');
class DashboardController {
    getRevenueByDay = async (req, res) => {
        try {
            const data = await DashboardService.getRevenueByDay();
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    getRevenueByMonth = async (req, res) => {
        try {
            const data = await DashboardService.getRevenueByMonth();
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    getRevenueByYear = async (req, res) => {
        try {
            const data = await DashboardService.getRevenueByYear();
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    getTotalRevenue = async (req, res) => {
        try {
            const data = await DashboardService.getTotalRevenue();
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    getPaidVsUnpaid = async (req, res) => {
        try {
            const data = await DashboardService.getPaidVsUnpaid();
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}
module.exports = new DashboardController();