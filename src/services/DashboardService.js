const Order = require('../models/Order');

const getRevenueByDay = async () => {
    try {
        const date = new Date();
        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        const result = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    createdAt: {
                        $gte: today,
                        $lt: tomorrow
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        return {
            status: "success",
            data: result.length > 0 ? result[0].totalRevenue : 0
        };
    } catch (error) {
        return {
            status: "error",
            message: "Error when getting revenue by day",
            error: error.message
        };
    }
};

const getRevenueByMonth = async () => {
    try {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const result = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    createdAt: {
                        $gte: firstDay,
                        $lt: lastDay
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        return {
            status: "success",
            data: result.length > 0 ? result[0].totalRevenue : 0
        };
    } catch (error) {
        return {
            status: "error",
            message: "Error when getting revenue by month",
            error: error.message
        };
    }
};
const getRevenueByYear = async () => {
    try {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), 0, 1);
        const lastDay = new Date(date.getFullYear(), 11, 31);

        const result = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    createdAt: {
                        $gte: firstDay,
                        $lt: lastDay
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        return {
            status: "success",
            data: result.length > 0 ? result[0].totalRevenue : 0
        };
    } catch (error) {
        return {
            status: "error",
            message: "Error when getting revenue by year",
            error: error.message
        };
    }
};
const getTotalRevenue = async () => {
    try {
        const result = await Order.aggregate([
            {
                $group: {
                    isPaid: true,
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        return {
            status: "success",
            data: result.length > 0 ? result[0].totalRevenue : 0
        };
    } catch (error) {
        return {
            status: "error",
            message: "Error when getting total revenue",
            error: error.message
        };
    }
};
const getPaidVsUnpaid = async () => {
    try {
        const result = await Order.aggregate([
            {
                $group: {
                    _id: "$isPaid",
                    count: { $sum: 1 }
                }
            }
        ]);

        const paidCount = result.find(item => item._id === true)?.count || 0;
        const unpaidCount = result.find(item => item._id === false)?.count || 0;

        return {
            status: "success",
            data: { paid: paidCount, unpaid: unpaidCount }
        };
    } catch (error) {
        return {
            status: "error",
            message: "Error when getting paid vs unpaid orders",
            error: error.message
        };
    }
};


module.exports = {
    getRevenueByDay,
    getRevenueByMonth,
    getRevenueByYear,
    getTotalRevenue,
    getPaidVsUnpaid
}