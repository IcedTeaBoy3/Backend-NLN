
const Order = require('../models/Order');
const Product = require('../models/Product');
const MailService = require('../services/MailService');
const createOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, shippingMethod, itemsPrice, shippingPrice, totalPrice, user, fullName, phone, city, address,isPaid,paidAt,email } = data;
        
        try {
            // Kiểm tra tất cả sản phẩm có đủ hàng không
            for (const order of orderItems) {
                const product = await Product.findById(order.product);
                if (!product || product.countInStock < order.amount) {
                    return reject({
                        status: 'error',
                        message: `Sản phẩm ${order.name} không đủ hàng!`,
                    });
                }
            }

            // Cập nhật số lượng hàng
            const promises = orderItems.map(async (order) => {
                return Product.findByIdAndUpdate(
                    order.product,
                    {
                        $inc: { countInStock: -order.amount, selled: order.amount }
                    },
                    { new: true }
                );
            });

            await Promise.all(promises);

            // Tạo đơn hàng
            const newOrder = await Order.create({
                user,
                orderItems,
                shippingAddress: { fullName, phone, city, address },
                paymentMethod,
                shippingMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                isPaid,
                paidAt
            });
            if(newOrder){

                await MailService.sendMailCreateOrder(email,orderItems,totalPrice,fullName,phone,city,address);
                resolve({
                    status: 'success',
                    message: 'Order created successfully!',
                    data: newOrder,
                });
            }

        } catch (error) {
            reject({
                status: 'error',
                message: 'Order not created',
            });
        }
    });
};

const getAllOrder = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({ user: userId }).sort({ createdAt: -1 });
            if (!order) {
                return reject({
                    status: 'error',
                    message: 'Order not found'
                });
            }
            resolve({
                status: 'success',
                message: 'Order found',
                data: order
            });
        } catch (error) {
            reject({
                status: 'error',
                message: 'Order not found'
            });
        }
    });
};
const getDetailOrder = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({ _id: orderId });
            if (!order) {
                return reject({
                    status: 'error',
                    message: 'Order not found'
                });
            }
            resolve({
                status: 'success',
                message: 'Order found',
                data: order
            });
        } catch (error) {
            reject({
                status: 'error',
                message: 'Order not found'
            });
        }
    });
}
const cancelOrder = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({ _id: orderId });
            if (!order) {
                return reject({
                    status: 'error',
                    message: 'Order not found'
                });
            }
            // Cập nhật số lượng hàng
            const promises = order.orderItems.map(async (order) => {
                return Product.findByIdAndUpdate(
                    order.product,
                    {
                        $inc: { countInStock: order.amount, selled: -order.amount }
                    },
                    { new: true }
                );
            });

            await Promise.all(promises);

            await Order.findByIdAndDelete({ _id: orderId });

            resolve({
                status: 'success',
                message: 'Order canceled successfully!',
            });

        } catch (error) {
            reject({
                status: 'error',
                message: 'Order not canceled'
            });
        }
    });
}
const getAllOrderAdmin = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find({}).sort({ createdAt: -1 });
            if (!orders) {
                return reject({
                    status: 'error',
                    message: 'All Order not found'
                });
            }
            resolve({
                status: 'success',
                message: 'All Order found',
                data: orders
            });
        } catch (error) {
            reject({
                status: 'error',
                message: 'All Order not found'
            });
        }
    });
}
module.exports = {
    createOrder,
    getAllOrder,
    getDetailOrder,
    cancelOrder,
    getAllOrderAdmin
};  