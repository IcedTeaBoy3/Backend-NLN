const DashboardService = require('../services/DashboardService');
const getRevenueByDay = async (req, res) => {
    try {
        const data = await DashboardService.getRevenueByDay();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
}
const getRevenueByMonth = async (req, res) => {
    try {
        const data = await DashboardService.getRevenueByMonth();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
}
const getRevenueByYear = async (req, res) => {
    try {
        const data = await DashboardService.getRevenueByYear();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
}
const getTotalRevenue = async (req, res) => {
    try {
        const data = await DashboardService.getTotalRevenue();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
}
const getPaidVsUnpaid = async (req, res) => {
    try {
        const data = await DashboardService.getPaidVsUnpaid();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
}
module.exports = {
    getRevenueByDay,
    getRevenueByMonth,
    getRevenueByYear,
    getTotalRevenue,
    getPaidVsUnpaid
}