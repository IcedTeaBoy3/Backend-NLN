
const Order = require('../models/Order');
const Product = require('../models/Product');
const MailService = require('../services/MailService');
class OrderService {
    createOrder = async (data) => {
    
        const { orderItems, paymentMethod, shippingMethod, itemsPrice, shippingPrice, totalPrice, user, fullName, phone, city, address,isPaid,paidAt,email } = data;
        
        try {
            // Kiểm tra tất cả sản phẩm có đủ hàng không
            for (const order of orderItems) {
                const product = await Product.findById(order.product);
                if (!product || product.countInStock < order.amount) {
                    return {
                        status: 'error',
                        message: `Sản phẩm ${order.name} không đủ hàng!`,
                    };
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
                return {
                    status: 'success',
                    message: 'Đặt hàng thành công',
                    data: newOrder,
                };
            }

        } catch (error) {
            return{
                status: 'error',
                message: error.message,
            };
        }
    
    };
    getAllOrder = async (userId) => {
        try {
            const order = await Order.find({ user: userId }).sort({ createdAt: -1 });
            if (!order) {
                return {
                    status: 'error',
                    message: 'Đơn hàng không tồn tại'
                };
            }
            return {
                status: 'success',
                message: 'Đơn hàng đã được tìm thấy',
                data: order
            };
        } catch (error) {
            return{
                status: 'error',
                message: error.message
            };
        }
    };
    getDetailOrder = async (orderId) => {
       
        try {
            const order = await Order.findById({ _id: orderId });
            if (!order) {
                return {
                    status: 'error',
                    message: 'Đơn hàng không tồn tại'
                };
            }
            return{
                status: 'success',
                message: 'Đơn hàng đã được tìm thấy',
                data: order
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
        
    }
    cancelOrder = async (orderId) => {
        
        try {
            const order = await Order.findById({ _id: orderId });
            if (!order) {
                return {
                    status: 'error',
                    message: 'Đơn hàng không tồn tại'
                };
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

            return{
                status: 'success',
                message: 'Đơn hàng đã được hủy',
            };

        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
       
    }
    getAllOrderAdmin = async () => {
        try {
            const orders = await Order.find({}).sort({ createdAt: -1 });
            if (!orders) {
                return {
                    status: 'error',
                    message: 'Đơn hàng không tồn tại'
                };
            }
            return{
                status: 'success',
                message: 'Đơn hàng đã được tìm thấy',
                data: orders
            };
        } catch (error) {
            return{
                status: 'error',
                message: error.message
            };
        }
       
    }
}

module.exports = new OrderService();  